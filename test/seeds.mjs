/* Shared fixture generator: builds the current app over a fake DOM and pushes
   deterministic pseudo-random app states through it.

   This used to live inside render-diff.mjs, which compared the live app against
   test/app.pre-split.js — a frozen 126 KB copy of the pre-split inline script.
   That baseline could only ever say "the markup did not change", so the first
   intentional markup change (an aria-label, say) failed the suite and the only
   repair was to re-freeze 126 KB of code. The generator was the valuable half;
   it is kept here and reused by render-snapshot.mjs and a11y.mjs. */
import fs from "node:fs";
import vm from "node:vm";
import { makeGlobals, bodyOf, TEST_EPILOGUE } from "./fakedom.mjs";

const read = f => fs.readFileSync(f, "utf8");

/* Load posters.js / ranking.js / matching.js / app.js into one shared global
   scope, exactly as index.html's four classic <script> tags do. */
export function buildApp(){
  const g = makeGlobals();
  const ctx = vm.createContext(g);
  for(const f of ["posters.js", "ranking.js", "matching.js"])
    vm.runInContext(read(f), ctx, {filename: f});
  vm.runInContext(bodyOf(read("app.js")) + TEST_EPILOGUE, ctx, {filename: "app.js"});
  return {g, T: g.__T};
}

/* xorshift32: same sequence on every machine and every Node version, so a
   golden hash computed here reproduces in CI. */
function rng(seed){
  let s = seed >>> 0;
  return () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
}

/* nasty strings, so esc() is genuinely exercised in every slot */
export const NASTY = [
  `Don't <b>bold</b> me`, `A & B "quoted"`, `<script>alert(1)</script>`,
  `Amélie · 100%`, `back\\slash`, `emoji 🎬 ok`, `'`, `"`, `<`, `&amp;`, ``,
];

export function makeSeed(i, DB){
  const r = rng(i * 2654435761 + 12345);
  const pick = a => a[Math.floor(r() * a.length)];

  /* a slice of custom entries are shows/anime, not movies, and — like real
     ones — can land in the ranking buckets right alongside the built-in
     (movie-only) library, so the type-scoped rank/score math gets exercised
     against mixed-type buckets, not just homogeneous ones. */
  const custom = [];
  const nCustom = Math.floor(r() * 3);
  for(let c = 0; c < nCustom; c++){
    const kind = pick([undefined, undefined, "show", "anime"]);
    const item = {id: "c_" + i + "_" + c, title: pick(NASTY) || "Untitled", year: r() < .5 ? 1999 + c : "—",
      genre: pick(["Film", "Drama", "—", pick(NASTY)]), dir: pick(["—", "Someone O'Neil", ""]), hue: Math.floor(r() * 360)};
    if(kind) item.kind = kind;
    custom.push(item);
  }

  const ids = DB.map(m => m.id).concat(custom.map(c => c.id));
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

  const feed = [];
  const nFeed = Math.floor(r() * 4);
  for(let f = 0; f < nFeed; f++){
    const mv = pick(ids);
    feed.push({cloud: true, movie: mv, score: Math.round(r() * 100) / 10, time: pick(["3m", "2h", "just now"]),
      ts: "2026-07-2" + f + "T00:00:00Z", note: r() < .5 ? pick(NASTY) : "", likes: Math.floor(r() * 20),
      userId: "u" + f, handle: pick(["ana_b", "o'neil", "x"]),
      who: {name: pick(NASTY) || "Someone", hue: Math.floor(r() * 360), url: r() < .3 ? "https://x/y?a=1&b=2" : null}});
  }

  /* Local feed items come in two shapes: current ones carry a real ISO `ts`
     (rendered relative), and ones written by builds before that carry only a
     frozen `time` string. Seed both so the render covers each path. */
  const myFeed = [];
  for(let f = 0; f < Math.floor(r() * 4) && f < all.length; f++){
    /* legacy-vs-current is chosen from the seed index, not the rng, so adding
       this coverage does not shift every later draw and rewrite unrelated
       screens' hashes */
    const legacy = (i + f) % 4 === 0;
    const item = {movie: all[f], score: Math.round(r() * 100) / 10,
      note: r() < .5 ? pick(NASTY) : "", likes: Math.floor(r() * 5), rank: f + 1};
    if(legacy) item.time = "just now";          // written by a build before ts existed
    else item.ts = "2026-07-2" + f + "T00:00:00Z"; // current shape: rendered relative
    myFeed.push(item);
  }

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
      /* also index-derived, for the same reason as `legacy` above */
      lbQueue: i % 4 === 1 ? all.slice(0, i % 3) : [],
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
      rankType: pick(["movie", "show", "anime"]),
      query: pick(["", "the", "nolan", pick(NASTY)]),
      liveResults: custom.map(c => ({...c, id: c.id + "_live"})),
      liveState: pick(["idle", "loading", "err", "done"]),
      searchType: pick(["movie", "show", "anime"]),
      // never null: null triggers a network fetch
      TRENDING: {movie: pick(["err", "loading", []]), show: pick(["err", "loading", []]), anime: pick(["err", "loading", []])},
    },
  };
}

export function apply(B, seed){
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

export const SCREENS = [
  ["profile", "#profileWrap", T => T.renderProfile()],
  ["feed",    "#feedWrap",    T => T.renderFeed()],
  ["ranks",   "#ranksWrap",   T => T.renderRanks()],
  ["search",  "#searchWrap",  T => T.renderSearch()],
  ["watch",   "#watchWrap",   T => T.renderWatch()],
];

/* The profile footer prints the deploy BUILD string, which moves on every
   release and must not drag the snapshot with it. The stand-in is deliberately
   not angle-bracketed: the tag-balance invariant parses these fragments, and a
   "<BUILD>" placeholder would read as an unclosed element. */
export const norm = h => String(h).replace(/Reeli build [\w.-]+/g, "Reeli build 0.0.0-snapshot");

/* Render every screen for every seed and hand each fragment to `visit`. */
export function forEachRender(B, N, visit){
  for(let i = 0; i < N; i++){
    const seed = makeSeed(i, B.T.DB);
    apply(B, seed);
    for(const [name, sel, run] of SCREENS){
      let html;
      try{ run(B.T); html = norm(B.g.__registry.get(sel).innerHTML); }
      catch(e){ visit({seed: i, screen: name, error: String(e && e.message)}); continue; }
      visit({seed: i, screen: name, html});
    }
  }
}
