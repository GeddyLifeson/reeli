/* HARNESS: the sync and pull step functions, and going offline.

   Round 2 split syncCloud/pullCloud into named steps. Each one issues a
   specific set of PostgREST calls in a specific order, and each one has a
   failure mode that is invisible from the UI:

     * pushTable must upsert BEFORE it reconciles deletions, or an interrupted
       sync deletes rows it was about to re-add
     * pullProfile must only believe "this user has no profile" when the fetch
       actually succeeded, or a flaky network strands a set-up user in setup
     * pullRankings/pullWatchlist must merge guest-only local data rather than
       letting the cloud clobber it
     * queueSync must not silently drop a change made while offline

   The app is loaded over a fake DOM with a recording fetch, so every assertion
   is about the exact requests issued.

   Usage: node test/sync-steps.mjs   (from the repo root) */
import fs from "node:fs";
import vm from "node:vm";
import { makeGlobals, bodyOf, TEST_EPILOGUE } from "./fakedom.mjs";

let fail = 0;
const ok = (c, m) => { console.log((c ? "  PASS  " : "  FAIL  ") + m); if(!c) fail++; };
const eq = (a, b, m) => ok(a === b, `${m}${a === b ? "" : `\n          expected ${JSON.stringify(b)}\n          got      ${JSON.stringify(a)}`}`);

/* Build the app with a fetch that records every call and answers from a script
   the test supplies. `online` drives navigator.onLine. */
function build(){
  const g = makeGlobals();
  const calls = [];
  let plan = [];                       // [{match, status, body}]
  g.navigator = {share: undefined, clipboard: undefined, onLine: true};
  g.fetch = (url, opts) => {
    opts = opts || {};
    const rec = {url: String(url), method: opts.method || "GET",
                 body: opts.body ? JSON.parse(opts.body) : null,
                 prefer: (opts.headers || {}).Prefer || ""};
    calls.push(rec);
    const hit = plan.find(p => p.match(rec)) || {status: 200, body: []};
    const res = {
      ok: hit.status >= 200 && hit.status < 300, status: hit.status,
      json: () => Promise.resolve(hit.body === undefined ? [] : hit.body),
      text: () => Promise.resolve(JSON.stringify(hit.body || "")),
      clone(){ return this; },
    };
    return hit.throws ? Promise.reject(new Error("network down")) : Promise.resolve(res);
  };
  const ctx = vm.createContext(g);
  for(const f of ["posters.js", "ranking.js", "matching.js"])
    vm.runInContext(fs.readFileSync(f, "utf8"), ctx, {filename: f});
  vm.runInContext(bodyOf(fs.readFileSync("app.js", "utf8")) + TEST_EPILOGUE + `
    globalThis.__T.pushTable = pushTable;
    globalThis.__T.pushRankings = pushRankings;
    globalThis.__T.pushWatchlist = pushWatchlist;
    globalThis.__T.pullProfile = pullProfile;
    globalThis.__T.pullRankings = pullRankings;
    globalThis.__T.pullWatchlist = pullWatchlist;
    globalThis.__T.syncCloud = syncCloud;
    globalThis.__T.queueSync = queueSync;
    globalThis.__T.pullCloud = pullCloud;
    globalThis.__T.pgPath = pgPath;
    Object.defineProperty(globalThis.__T, "SYNC_PENDING", {get: () => SYNC_PENDING});
    Object.defineProperty(globalThis.__T, "PULLING", {get: () => PULLING, set: v => { PULLING = v; }});
  `, ctx, {filename: "app.js"});
  const T = g.__T;
  T.AUTH = {access_token: "tok", refresh_token: "r", expires_at: 9e9, user: {id: "me"}};
  return {g, T, calls, setPlan: p => { plan = p; }, reset: () => { calls.length = 0; }};
}

const path = c => c.url.replace(/^https:\/\/[^/]+/, "");

/* ================= 1. pushTable: upsert before delete ================= */
{
  const B = build();
  B.setPlan([{match: r => r.method === "GET", status: 200, body: [{movie_id: "keep"}, {movie_id: "drop"}]}]);
  B.reset(); await B.T.pushTable("rankings", [{user_id: "me", movie_id: "keep"}], id => id === "keep");

  const seq = B.calls.map(c => c.method);
  eq(seq[0], "POST", "pushTable issues the upsert first");
  ok(seq.includes("GET"), "then reads back what the cloud holds");
  eq(seq[seq.length - 1], "DELETE", "and reconciles deletions last");
  ok(seq.indexOf("POST") < seq.indexOf("DELETE"),
     "the upsert always precedes the delete, so an interrupted sync cannot leave the cloud short");

  const post = B.calls.find(c => c.method === "POST");
  eq(post.prefer, "resolution=merge-duplicates", "the upsert asks PostgREST to merge duplicates");
  ok(post.url.includes("on_conflict=user_id,movie_id"), "keyed on (user_id, movie_id)");

  const del = B.calls.find(c => c.method === "DELETE");
  ok(del.url.includes("movie_id=in.(drop)"), "only the row the client no longer has is deleted");
  ok(!del.url.includes("keep"), "the row the client still has is left alone");
}

/* an empty local table must not issue an upsert at all — POSTing [] to
   PostgREST is a request that can only fail or do nothing */
{
  const B = build();
  B.setPlan([{match: r => r.method === "GET", status: 200, body: []}]);
  B.reset(); const r = await B.T.pushTable("watchlist", [], () => true);
  eq(B.calls.filter(c => c.method === "POST").length, 0, "an empty row set issues no upsert");
  eq(r, null, "and pushTable reports no upsert response to its caller");
}

/* nothing to delete means no DELETE request */
{
  const B = build();
  B.setPlan([{match: r => r.method === "GET", status: 200, body: [{movie_id: "a"}]}]);
  B.reset(); await B.T.pushTable("rankings", [{movie_id: "a"}], () => true);
  eq(B.calls.filter(c => c.method === "DELETE").length, 0, "nothing stale means no DELETE is issued");
}

/* A failed read-back must not trigger a blind delete. The stub answers the
   failing GET with a non-empty body on purpose: if the `cr.ok` guard were
   dropped, those rows would be read and deleted, so the assertion can tell the
   guarded and unguarded versions apart. */
{
  const B = build();
  B.setPlan([{match: r => r.method === "GET", status: 500, body: [{movie_id: "a"}, {movie_id: "b"}]}]);
  B.reset(); await B.T.pushTable("rankings", [{movie_id: "a"}], () => false);
  eq(B.calls.filter(c => c.method === "DELETE").length, 0,
     "when the read-back fails, nothing is deleted (a 500 is not evidence of an empty cloud)");
}

/* ================= 2. pushRankings: the rows it builds ================= */
{
  const B = build();
  B.T.S = Object.assign(B.T.S, {loved: ["godfather"], fine: [], disliked: [], notes: {}});
  B.setPlan([{match: r => r.method === "GET", status: 200, body: []}]);
  B.reset(); await B.T.pushRankings();
  const post = B.calls.find(c => c.method === "POST");
  ok(!!post, "pushRankings upserts the ranked rows");
  const row = post.body[0];
  eq(row.bucket, "loved", "each row carries its bucket");
  eq(row.position, 0, "and its position within that bucket");
  eq(row.user_id, "me", "and the signed-in user id");
  ok(typeof row.score === "number", `and a numeric score (${row.score})`);
}

/* ================= 3. pullProfile: only trust a successful fetch ========= */
{
  const B = build();
  B.T.CLOUD.profile = {handle: "ana", display_name: "Ana", avatar_hue: 10};
  B.T.CLOUD.profileLoaded = true;
  B.setPlan([{match: () => true, status: 500, body: []}]);
  await B.T.pullProfile();
  ok(B.T.CLOUD.profile !== null,
     "a failed profile fetch leaves the known profile in place (it must not strand a set-up user in 'finish setup')");
}
{
  const B = build();
  B.T.CLOUD.profile = {handle: "ana"};
  B.setPlan([{match: () => true, status: 200, body: []}]);
  await B.T.pullProfile();
  eq(B.T.CLOUD.profile, null, "a successful fetch returning no row does clear the profile");
  eq(B.T.CLOUD.profileLoaded, true, "and records that the answer is trustworthy");
}
{
  /* The flag is the whole point: an existing account whose profile fetch failed
     must not be sent through "claim a handle" again. Only a fetch that SUCCEEDS
     and returns nothing means "this user has never set up". */
  const B = build();
  B.T.CLOUD.profile = null;
  B.T.CLOUD.profileLoaded = false;
  B.setPlan([{match: () => true, throws: true}]);
  try{ await B.T.pullProfile(); }catch(e){ /* the caller's outer catch owns this */ }
  eq(B.T.CLOUD.profileLoaded, false,
     "a profile fetch that never answered leaves profileLoaded false, so setup is not offered on a guess");
}

/* ================= 4. pullRankings / pullWatchlist: merge, don't clobber == */
{
  const B = build();
  B.T.S = Object.assign(B.T.S, {loved: ["guest-only"], fine: [], disliked: [], custom: [
    {id: "guest-only", title: "Guest Movie", year: 2020, genre: "", dir: "", hue: 1}], notes: {}});
  B.setPlan([{match: () => true, status: 200, body: [
    {movie_id: "godfather", bucket: "loved", position: 0, title: "The Godfather", year: 1972, note: "great"}]}]);
  await B.T.pullRankings();
  ok(B.T.S.loved.includes("godfather"), "a cloud ranking is pulled in");
  ok(B.T.S.loved.includes("guest-only"), "and a guest-only local ranking survives the pull");
  eq(B.T.S.loved.indexOf("godfather") < B.T.S.loved.indexOf("guest-only"), true,
     "cloud rows come first, guest-only rows are appended");
  eq(B.T.S.notes["godfather"], "great", "a note stored in the cloud is restored");
}
{
  const B = build();
  B.T.S = Object.assign(B.T.S, {watch: ["local-1"], custom: [], loved: [], fine: [], disliked: [], notes: {}});
  B.setPlan([{match: () => true, status: 200, body: [{movie_id: "tt1", title: "X", year: 2001}]}]);
  await B.T.pullWatchlist();
  ok(B.T.S.watch.includes("tt1") && B.T.S.watch.includes("local-1"),
     "the watchlist pull unions cloud and local ids");
  eq(new Set(B.T.S.watch).size, B.T.S.watch.length, "and de-duplicates them");
}
/* a failed pull must not wipe local state */
{
  const B = build();
  B.T.S = Object.assign(B.T.S, {watch: ["local-1"], loved: ["mine"], fine: [], disliked: [], custom: [], notes: {}});
  B.setPlan([{match: () => true, status: 503, body: []}]);
  await B.T.pullWatchlist();
  await B.T.pullRankings();
  ok(B.T.S.watch.includes("local-1") && B.T.S.loved.includes("mine"),
     "a failed pull leaves local rankings and watchlist untouched");
}

/* ================= 5. offline: queue, don't drop ================= */
{
  const B = build();
  B.g.navigator.onLine = false;
  B.reset(); B.T.queueSync();
  eq(B.calls.length, 0, "queueSync issues no request while offline");
  eq(B.T.SYNC_PENDING, true, "and records that a sync is owed");
  eq(B.g.localStorage.getItem("reeli-sync-pending"), "1",
     "the pending flag is persisted, so closing the tab offline does not lose the change");
}
{
  const B = build();
  B.g.navigator.onLine = false;
  B.T.S = Object.assign(B.T.S, {loved: ["godfather"], fine: [], disliked: [], watch: [], notes: {}});
  B.reset(); await B.T.syncCloud();
  eq(B.calls.length, 0, "syncCloud short-circuits offline rather than firing doomed requests");
  eq(B.T.SYNC_PENDING, true, "and leaves the work marked as owed");
}
{
  /* back online, a clean pass clears the flag */
  const B = build();
  B.g.localStorage.setItem("reeli-sync-pending", "1");
  B.T.S = Object.assign(B.T.S, {loved: [], fine: [], disliked: [], watch: [], notes: {}, taste: null, ui: {}});
  B.setPlan([{match: () => true, status: 200, body: []}]);
  B.reset(); await B.T.syncCloud();
  ok(B.calls.length > 0, "online, syncCloud issues its requests");
  eq(B.T.SYNC_PENDING, false, "a clean sync clears the pending flag");
  eq(B.g.localStorage.getItem("reeli-sync-pending"), null, "and removes it from storage");
}
{
  /* a throwing network marks the work pending and tells the user */
  const B = build();
  B.T.S = Object.assign(B.T.S, {loved: [], fine: [], disliked: [], watch: [], notes: {}, taste: null, ui: {}});
  B.setPlan([{match: () => true, throws: true}]);
  B.reset(); await B.T.syncCloud();
  eq(B.T.SYNC_PENDING, true, "a network failure mid-sync marks the sync as still owed");
  const alert = B.g.__registry.get("#alert");
  ok(alert && /sync/i.test(alert.innerHTML), "and raises a user-visible alert rather than only a console warning");
  ok(alert && alert.hidden === false, "the alert is shown, not left hidden");
}

/* ===== a sync must never run while a pull is in flight =====
   pushTable deletes every cloud row the local state does not have. Mid-pull the
   local state is still the guest's — often an empty watchlist — so a sync that
   lands in that window deleted the user's whole cloud watchlist, which then
   pulled back empty. queueSync() refused to SCHEDULE during a pull, but a timer
   scheduled just before login fired straight through it. */
{
  const B = build();
  B.T.S = Object.assign(B.T.S, {loved: [], fine: [], disliked: [], watch: [], notes: {}, taste: null, ui: {}});
  B.setPlan([{match: () => true, status: 200, body: []}]);
  B.T.PULLING = true;
  B.reset(); await B.T.syncCloud();
  eq(B.calls.length, 0, "syncCloud issues nothing while a pull is in flight (it would delete cloud rows the pull has not merged yet)");
  eq(B.T.SYNC_PENDING, true, "and the work is still marked as owed, so the pull's own queueSync re-runs it");

  B.T.PULLING = false;
  B.reset(); await B.T.syncCloud();
  ok(B.calls.length > 0, "once the pull finishes, the same sync goes through");
}
{
  /* the other half: starting a pull cancels a sync queued moments earlier */
  const B = build();
  B.T.S = Object.assign(B.T.S, {loved: [], fine: [], disliked: [], watch: ["godfather"], notes: {}, taste: null, ui: {}});
  B.setPlan([{match: () => true, status: 200, body: []}]);
  let cleared = false;
  const realClear = B.g.clearTimeout;
  B.g.clearTimeout = t => { cleared = true; return realClear(t); };
  B.T.queueSync();                 // a change made as a guest, sync pending
  await B.T.pullCloud();           // then they log in
  ok(cleared, "pullCloud clears any sync queued before login rather than letting it push guest state");
}

console.log(fail ? `\nFAILED (${fail})` : "\nALL PASS");
process.exit(fail ? 1 : 0);
