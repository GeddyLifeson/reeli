/* DIFFERENTIAL HARNESS: the refactored render functions must emit exactly the
   HTML the originals did.

   Two builds of the app — test/app.pre-split.js (a frozen copy of the
   pre-refactor inline script) and the current app.js plus its extracted siblings — are
   loaded into two separate vm contexts over identical fake DOMs. The same
   seeded state is pushed into both, every screen is rendered, and the resulting
   innerHTML is compared byte for byte across many generated app shapes.

   Usage: node test/render-diff.mjs   (from the repo root) */
import fs from "node:fs";
import vm from "node:vm";
import { makeGlobals, bodyOf, TEST_EPILOGUE } from "./fakedom.mjs";

const read = f => fs.readFileSync(f, "utf8");

function build(label, prelude, appFile){
  const g = makeGlobals();
  const ctx = vm.createContext(g);
  for(const f of prelude) vm.runInContext(read(f), ctx, {filename: f});
  vm.runInContext(bodyOf(read(appFile)) + TEST_EPILOGUE, ctx, {filename: appFile});
  return {label, g, T: g.__T};
}

const OLD = build("old", [], "test/app.pre-split.js");
const NEW = build("new", ["posters.js", "ranking.js", "matching.js"], "app.js");

/* ---------- deterministic pseudo-random seed generation ---------- */
function rng(seed){
  let s = seed >>> 0;
  return () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
}

/* nasty strings, so esc() is genuinely exercised in every slot */
const NASTY = [
  `Don't <b>bold</b> me`, `A & B "quoted"`, `<script>alert(1)</script>`,
  `Amélie · 100%`, `back\\slash`, `emoji 🎬 ok`, `'`, `"`, `<`, `&amp;`, ``,
];

function makeSeed(i){
  const r = rng(i * 2654435761 + 12345);
  const pick = a => a[Math.floor(r() * a.length)];
  const ids = OLD.T.DB.map(m => m[0] !== undefined && typeof m === "object" && m.id === undefined ? m[0] : m.id);
  const shuffled = ids.slice().sort(() => r() - 0.5);
  const take = n => shuffled.splice(0, n);

  const loved = take(Math.floor(r() * 8));
  const fine = take(Math.floor(r() * 5));
  const disliked = take(Math.floor(r() * 4));
  const watch = take(Math.floor(r() * 5));
  const all = [...loved, ...fine, ...disliked];

  const authed = r() < 0.6;
  const hasCloudProfile = authed && r() < 0.7;
  const notes = {};
  all.forEach(id => { if(r() < 0.3) notes[id] = pick(NASTY); });

  const custom = [];
  const nCustom = Math.floor(r() * 3);
  for(let c = 0; c < nCustom; c++)
    custom.push({id: "c_" + i + "_" + c, title: pick(NASTY) || "Untitled", year: r() < .5 ? 1999 + c : "—",
      genre: pick(["Film", "Drama", "—", pick(NASTY)]), dir: pick(["—", "Someone O'Neil", ""]), hue: Math.floor(r() * 360)});

  const feed = [];
  const nFeed = Math.floor(r() * 4);
  for(let f = 0; f < nFeed; f++){
    const mv = pick(ids);
    feed.push({cloud: true, movie: mv, score: Math.round(r() * 100) / 10, time: pick(["3m", "2h", "just now"]),
      ts: "2026-07-2" + f + "T00:00:00Z", note: r() < .5 ? pick(NASTY) : "", likes: Math.floor(r() * 20),
      userId: "u" + f, handle: pick(["ana_b", "o'neil", "x"]),
      who: {name: pick(NASTY) || "Someone", hue: Math.floor(r() * 360), url: r() < .3 ? "https://x/y?a=1&b=2" : null}});
  }

  const myFeed = [];
  for(let f = 0; f < Math.floor(r() * 4) && f < all.length; f++)
    myFeed.push({movie: all[f], score: Math.round(r() * 100) / 10, time: "just now",
      note: r() < .5 ? pick(NASTY) : "", likes: Math.floor(r() * 5), rank: f + 1});

  const people = [];
  for(let p = 0; p < Math.floor(r() * 4); p++)
    people.push({id: "p" + p, handle: pick(["a_b", "zoe"]), name: pick(NASTY) || "P",
      hue: Math.floor(r() * 360), avatarUrl: r() < .3 ? "https://a/b?c=1&d=2" : null,
      ranked: Math.floor(r() * 50), following: r() < .5});

  return {
    S: {
      profile: r() < .8 ? {name: pick(NASTY) || "Guest", handle: "@" + pick(["ana", "o'neil"]), hue: Math.floor(r() * 360),
        avatarUrl: r() < .3 ? "https://a/b?c=1" : null} : null,
      onboarded: true, guestChosen: true,
      taste: r() < .6 ? {genres: [pick(["Drama", "Sci-Fi", pick(NASTY)])], dirs: r() < .5 ? [pick(["Wes Anderson", pick(NASTY)])] : []} : null,
      loved, fine, disliked, watch, custom,
      likes: {me0: r() < .5, me1: r() < .5},
      notes, myFeed, feedSeen: "", notifSeen: "",
      ui: {accent: r() < .5 ? null : pick([355, 42, 218, 275, 105]), wall: r() < .5 ? null : "tt0068646", wallTitle: r() < .5 ? null : pick(NASTY)},
    },
    AUTH: authed ? {access_token: "tok", refresh_token: "r", expires_at: 9e9, user: {id: "me", email: pick(["a@b.co", "o'neil@x.com"])}} : null,
    CLOUD: {
      profile: hasCloudProfile ? {id: "me", handle: pick(["ana", "zed"]), display_name: pick(NASTY) || "Me", avatar_hue: 172} : null,
      profileLoaded: authed && r() < .8,
      follows: people.filter(() => r() < .5).map(p => p.id),
      feed, myLikes: feed.filter(() => r() < .5).map(f => f.userId + "|" + f.movie),
      feedLoaded: r() < .5, notifs: [],
    },
    posters: Object.fromEntries(all.filter(() => r() < .4).map(id => [id, r() < .5 ? "https://p/" + id + "?a=1&b=2" : {u: "https://p/" + id, tt: "tt" + (1000000 + Math.floor(r() * 9e6))}])),
    live: Object.fromEntries(feed.map(f => [f.movie + "_live", {id: f.movie + "_live", title: pick(NASTY) || "L", year: 2001, genre: "", dir: "", hue: 10}])),
    view: {
      feedTab: pick(["activity", "mates"]),
      mateQuery: pick(["", "ana", pick(NASTY)]),
      mateResults: pick([null, [], people]),
      mateState: pick(["idle", "loading", "done"]),
      mateSugg: pick([[], people, "loading"]),   // never null: null triggers a network fetch
      rankFilter: pick(["all", "loved", "fine", "disliked"]),
      rankGenre: pick(["", "Drama", "Sci-Fi", "Crime"]),
      query: pick(["", "the", "nolan", pick(NASTY)]),
      liveResults: custom.map(c => ({...c, id: c.id + "_live"})),
      liveState: pick(["idle", "loading", "err", "done"]),
      TREND: pick(["err", "loading", []]),        // never null: null triggers a network fetch
    },
  };
}

function apply(B, seed){
  const T = B.T;
  T.S = JSON.parse(JSON.stringify(seed.S));
  T.AUTH = seed.AUTH ? JSON.parse(JSON.stringify(seed.AUTH)) : null;
  const C = T.CLOUD;
  C.profile = seed.CLOUD.profile ? JSON.parse(JSON.stringify(seed.CLOUD.profile)) : null;
  C.profileLoaded = seed.CLOUD.profileLoaded;
  C.follows = new Set(seed.CLOUD.follows);
  C.feed = JSON.parse(JSON.stringify(seed.CLOUD.feed));
  C.myLikes = new Set(seed.CLOUD.myLikes);
  C.feedLoaded = seed.CLOUD.feedLoaded;
  C.notifs = [];
  for(const k of Object.keys(T.LIVE)) delete T.LIVE[k];
  Object.assign(T.LIVE, JSON.parse(JSON.stringify(seed.live)));
  Object.assign(T.POSTERS.cache, JSON.parse(JSON.stringify(seed.posters)));
  for(const k of Object.keys(seed.view)) T[k] = JSON.parse(JSON.stringify(seed.view[k]));
}

/* The profile footer prints the deploy BUILD string, which moves on every
   release and is the one difference between the two builds that is meant to
   exist. Everything else must match byte for byte. */
const norm = h => String(h).replace(/Reeli build [\w.-]+/g, "Reeli build <BUILD>");

const SCREENS = [
  ["profile", "#profileWrap", T => T.renderProfile()],
  ["feed",    "#feedWrap",    T => T.renderFeed()],
  ["ranks",   "#ranksWrap",   T => T.renderRanks()],
  ["search",  "#searchWrap",  T => T.renderSearch()],
  ["watch",   "#watchWrap",   T => T.renderWatch()],
];

const N = Number(process.argv[2] || 400);
let checks = 0, fails = 0;
const failed = [];

for(let i = 0; i < N; i++){
  const seed = makeSeed(i);
  for(const B of [OLD, NEW]) apply(B, seed);
  for(const [name, sel, run] of SCREENS){
    let a, b, ea = null, eb = null;
    try{ run(OLD.T); a = norm(OLD.g.__registry.get(sel).innerHTML); }catch(e){ ea = String(e && e.message); }
    try{ run(NEW.T); b = norm(NEW.g.__registry.get(sel).innerHTML); }catch(e){ eb = String(e && e.message); }
    checks++;
    if(ea || eb){
      if(ea !== eb){ fails++; failed.push({i, name, kind: "throw", ea, eb}); }
      continue;
    }
    if(a !== b){
      fails++;
      let at = 0; while(at < a.length && a[at] === b[at]) at++;
      failed.push({i, name, kind: "html", at, a: a.slice(Math.max(0, at - 90), at + 90), b: b.slice(Math.max(0, at - 90), at + 90)});
    }
  }
}

/* also diff the two leaf builders directly, isolated from their containers */
for(let i = 0; i < 120; i++){
  const seed = makeSeed(i + 9000);
  for(const B of [OLD, NEW]) apply(B, seed);
  seed.CLOUD.feed.forEach((f, idx) => {
    checks++;
    const a = OLD.T.feedItemHTML(JSON.parse(JSON.stringify(f)), idx);
    const b = NEW.T.feedItemHTML(JSON.parse(JSON.stringify(f)), idx);
    if(a !== b){ fails++; failed.push({i, name: "feedItemHTML", kind: "html", at: 0, a: a.slice(0, 180), b: b.slice(0, 180)}); }
  });
  seed.S.myFeed.forEach((f, idx) => {
    checks++;
    const a = OLD.T.feedItemHTML(JSON.parse(JSON.stringify(f)), idx);
    const b = NEW.T.feedItemHTML(JSON.parse(JSON.stringify(f)), idx);
    if(a !== b){ fails++; failed.push({i, name: "feedItemHTML/mine", kind: "html", at: 0, a: a.slice(0, 180), b: b.slice(0, 180)}); }
  });
}

for(const f of failed.slice(0, 6)){
  console.log(`\n  FAIL seed ${f.i} / ${f.name} (${f.kind}${f.at !== undefined ? " @" + f.at : ""})`);
  console.log("    old: " + JSON.stringify(f.ea ?? f.a));
  console.log("    new: " + JSON.stringify(f.eb ?? f.b));
}
console.log(`\n  ${checks - fails}/${checks} render comparisons identical across ${N} seeded app states`);
console.log(fails ? `\nFAILED (${fails})` : "\nALL PASS");
process.exit(fails ? 1 : 0);
