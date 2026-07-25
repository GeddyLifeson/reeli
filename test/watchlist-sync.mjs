/* HARNESS: the watchlist sync guard.

   The live bug this guards against: public.watchlist had no UPDATE policy, so
   the merge-duplicates upsert came back 403 / 42501 on every push after the
   first and the app threw the response away. These tests drive pushWatchlist()
   against stubbed PostgREST responses and assert the failure is now surfaced —
   once per session, naming the SQL file that fixes it — and that a healthy sync
   stays silent.

   Usage: node test/watchlist-sync.mjs   (from the repo root) */
import fs from "node:fs";
import vm from "node:vm";
import { makeGlobals, bodyOf } from "./fakedom.mjs";

let fail = 0;
const ok = (c, m) => { console.log((c ? "  PASS  " : "  FAIL  ") + m); if(!c) fail++; };

function boot(upsertResponse){
  const g = makeGlobals();
  const toasts = [], warns = [];
  const seen = [];
  g.console = {log(){}, warn: (...a) => warns.push(a.join(" ")), error(){}};
  g.fetch = (url, opts) => {
    const method = (opts && opts.method) || "GET";
    seen.push(method + " " + String(url).replace(/^https:\/\/[^/]+/, ""));
    if(method === "POST" && /\/watchlist\b/.test(url)) return Promise.resolve(upsertResponse());
    return Promise.resolve({ok: true, status: 200, json: () => Promise.resolve([]),
      text: () => Promise.resolve(""), clone(){ return this; }});
  };
  const ctx = vm.createContext(g);
  for(const f of ["posters.js", "ranking.js", "matching.js"]) vm.runInContext(fs.readFileSync(f, "utf8"), ctx, {filename: f});
  vm.runInContext(bodyOf(fs.readFileSync("app.js", "utf8")) + `
globalThis.__W = {
  seed(){
    AUTH = {access_token:"tok", refresh_token:"r", expires_at: 9e9, user:{id:"me"}};
    S.watch = ["godfather"];
    watchlistSyncWarned = false;
  },
  pushWatchlist,
  get warned(){ return watchlistSyncWarned; },
  clearWatch(){ S.watch = []; },
};`, ctx, {filename: "app.js"});
  /* capture toasts (toast is a function declaration, so it is a global property) */
  ctx.toast = m => toasts.push(m);
  g.__W.seed();
  return {g, W: g.__W, toasts, warns, seen};
}

const res = (status, body) => () => ({ok: status >= 200 && status < 300, status,
  json: () => Promise.resolve([]), text: () => Promise.resolve(body || ""), clone(){ return this; }});

/* ---- 1. the live bug: RLS rejects the upsert ---- */
{
  const {W, toasts, warns, seen} = boot(res(403, `{"code":"42501","message":"new row violates row-level security policy for table \\"watchlist\\""}`));
  await W.pushWatchlist();
  ok(seen.some(s => s.startsWith("POST /rest/v1/watchlist?on_conflict=user_id,movie_id")), "the upsert is still issued as a merge-duplicates POST");
  ok(toasts.length === 1, `exactly one toast fired (got ${toasts.length})`);
  ok(/supabase-rls-watchlist-fix\.sql/.test(toasts[0] || ""), `the toast names the fix file: ${JSON.stringify(toasts[0])}`);
  ok(warns.some(w => /42501/.test(w)), "the console warning carries the Postgres error code");
  ok(warns.some(w => /UPDATE policy/.test(w)), "the console warning says which policy is missing");

  const before = toasts.length;
  await W.pushWatchlist();
  await W.pushWatchlist();
  ok(toasts.length === before, "repeat failures stay quiet — one warning per session, not one per sync");
}

/* ---- 2. a 403 with no PostgREST body still reads as an RLS problem ---- */
{
  const {W, toasts} = boot(res(403, ""));
  await W.pushWatchlist();
  ok(/supabase-rls-watchlist-fix\.sql/.test(toasts[0] || ""), "a bare 403 is still reported as the policy problem");
}

/* ---- 3. an unrelated failure gets a generic message, not the SQL advice ---- */
{
  const {W, toasts, warns} = boot(res(500, `{"message":"upstream unavailable"}`));
  await W.pushWatchlist();
  ok(toasts.length === 1 && !/watchlist-fix/.test(toasts[0]), `a 500 gets a generic message: ${JSON.stringify(toasts[0])}`);
  ok(warns.some(w => /500/.test(w)), "the console warning carries the status code");
}

/* ---- 4. a healthy sync says nothing at all ---- */
{
  const {W, toasts} = boot(res(201, ""));
  await W.pushWatchlist();
  ok(toasts.length === 0, "a successful sync is silent");
  ok(W.warned === false, "and leaves the guard armed for a later failure");
}

/* ---- 5. after a failure, a later success re-arms the warning ---- */
{
  let broken = true;
  const {W, toasts} = boot(() => (broken ? res(403, "42501")() : res(201, "")()));
  await W.pushWatchlist();
  broken = false; await W.pushWatchlist();
  broken = true;  await W.pushWatchlist();
  ok(toasts.length === 2, `a recovery re-arms the guard (got ${toasts.length} toasts across fail/ok/fail)`);
}

/* ---- 6. an empty watchlist issues no upsert, so there is nothing to report ---- */
{
  const {W, toasts, seen} = boot(res(403, "42501"));
  W.clearWatch();
  await W.pushWatchlist();
  ok(!seen.some(s2 => s2.startsWith("POST /rest/v1/watchlist")), "an empty watchlist skips the upsert entirely");
  ok(toasts.length === 0, "and therefore reports nothing");
}

console.log(fail ? `\nFAILED (${fail})` : "\nALL PASS");
process.exit(fail ? 1 : 0);
