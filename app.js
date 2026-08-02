
'use strict';
const BUILD = "2026.07.25-6"; // bump on every deploy — shown on the Profile screen
/* ---------- movie database ----------
   Named keys, not positional tuples: every consumer reads m.title / m.year
   rather than a[1] / a[2], so adding a field can never silently shift the
   meaning of the ones after it. `hue` is the fallback gradient colour used
   when a title has no poster art. */
const DB = [
  {id:"godfather", title:"The Godfather", year:1972, genre:"Crime", dir:"Francis Ford Coppola", hue:28},
  {id:"shawshank", title:"The Shawshank Redemption", year:1994, genre:"Drama", dir:"Frank Darabont", hue:210},
  {id:"darkknight", title:"The Dark Knight", year:2008, genre:"Action", dir:"Christopher Nolan", hue:230},
  {id:"pulpfiction", title:"Pulp Fiction", year:1994, genre:"Crime", dir:"Quentin Tarantino", hue:45},
  {id:"parasite", title:"Parasite", year:2019, genre:"Thriller", dir:"Bong Joon-ho", hue:150},
  {id:"spiritedaway", title:"Spirited Away", year:2001, genre:"Animation", dir:"Hayao Miyazaki", hue:0},
  {id:"interstellar", title:"Interstellar", year:2014, genre:"Sci-Fi", dir:"Christopher Nolan", hue:255},
  {id:"inception", title:"Inception", year:2010, genre:"Sci-Fi", dir:"Christopher Nolan", hue:215},
  {id:"goodfellas", title:"Goodfellas", year:1990, genre:"Crime", dir:"Martin Scorsese", hue:350},
  {id:"fightclub", title:"Fight Club", year:1999, genre:"Drama", dir:"David Fincher", hue:330},
  {id:"matrix", title:"The Matrix", year:1999, genre:"Sci-Fi", dir:"The Wachowskis", hue:130},
  {id:"forrestgump", title:"Forrest Gump", year:1994, genre:"Drama", dir:"Robert Zemeckis", hue:95},
  {id:"seven", title:"Se7en", year:1995, genre:"Thriller", dir:"David Fincher", hue:25},
  {id:"silence", title:"The Silence of the Lambs", year:1991, genre:"Thriller", dir:"Jonathan Demme", hue:10},
  {id:"gladiator", title:"Gladiator", year:2000, genre:"Action", dir:"Ridley Scott", hue:35},
  {id:"departed", title:"The Departed", year:2006, genre:"Crime", dir:"Martin Scorsese", hue:200},
  {id:"whiplash", title:"Whiplash", year:2014, genre:"Drama", dir:"Damien Chazelle", hue:40},
  {id:"prestige", title:"The Prestige", year:2006, genre:"Mystery", dir:"Christopher Nolan", hue:260},
  {id:"lionking", title:"The Lion King", year:1994, genre:"Animation", dir:"Rob Minkoff", hue:30},
  {id:"backfuture", title:"Back to the Future", year:1985, genre:"Sci-Fi", dir:"Robert Zemeckis", hue:190},
  {id:"lotr1", title:"The Fellowship of the Ring", year:2001, genre:"Fantasy", dir:"Peter Jackson", hue:110},
  {id:"lotr3", title:"The Return of the King", year:2003, genre:"Fantasy", dir:"Peter Jackson", hue:50},
  {id:"starwars4", title:"Star Wars: A New Hope", year:1977, genre:"Sci-Fi", dir:"George Lucas", hue:48},
  {id:"empire", title:"The Empire Strikes Back", year:1980, genre:"Sci-Fi", dir:"Irvin Kershner", hue:220},
  {id:"jurassic", title:"Jurassic Park", year:1993, genre:"Adventure", dir:"Steven Spielberg", hue:120},
  {id:"titanic", title:"Titanic", year:1997, genre:"Romance", dir:"James Cameron", hue:205},
  {id:"avatar", title:"Avatar", year:2009, genre:"Sci-Fi", dir:"James Cameron", hue:175},
  {id:"casablanca", title:"Casablanca", year:1942, genre:"Romance", dir:"Michael Curtiz", hue:42},
  {id:"psycho", title:"Psycho", year:1960, genre:"Horror", dir:"Alfred Hitchcock", hue:0},
  {id:"rearwindow", title:"Rear Window", year:1954, genre:"Mystery", dir:"Alfred Hitchcock", hue:160},
  {id:"citizenkane", title:"Citizen Kane", year:1941, genre:"Drama", dir:"Orson Welles", hue:38},
  {id:"taxidriver", title:"Taxi Driver", year:1976, genre:"Drama", dir:"Martin Scorsese", hue:52},
  {id:"apocalypse", title:"Apocalypse Now", year:1979, genre:"War", dir:"Francis Ford Coppola", hue:18},
  {id:"alien", title:"Alien", year:1979, genre:"Horror", dir:"Ridley Scott", hue:140},
  {id:"blade", title:"Blade Runner", year:1982, genre:"Sci-Fi", dir:"Ridley Scott", hue:280},
  {id:"blade2049", title:"Blade Runner 2049", year:2017, genre:"Sci-Fi", dir:"Denis Villeneuve", hue:22},
  {id:"dune", title:"Dune: Part One", year:2021, genre:"Sci-Fi", dir:"Denis Villeneuve", hue:33},
  {id:"dune2", title:"Dune: Part Two", year:2024, genre:"Sci-Fi", dir:"Denis Villeneuve", hue:20},
  {id:"oppenheimer", title:"Oppenheimer", year:2023, genre:"Drama", dir:"Christopher Nolan", hue:15},
  {id:"barbie", title:"Barbie", year:2023, genre:"Comedy", dir:"Greta Gerwig", hue:320},
  {id:"eeaao", title:"Everything Everywhere All at Once", year:2022, genre:"Sci-Fi", dir:"Daniels", hue:300},
  {id:"nocountry", title:"No Country for Old Men", year:2007, genre:"Thriller", dir:"Coen Brothers", hue:36},
  {id:"fargo", title:"Fargo", year:1996, genre:"Crime", dir:"Coen Brothers", hue:195},
  {id:"lebowski", title:"The Big Lebowski", year:1998, genre:"Comedy", dir:"Coen Brothers", hue:85},
  {id:"grandbudapest", title:"The Grand Budapest Hotel", year:2014, genre:"Comedy", dir:"Wes Anderson", hue:340},
  {id:"moonrise", title:"Moonrise Kingdom", year:2012, genre:"Comedy", dir:"Wes Anderson", hue:55},
  {id:"amelie", title:"Amélie", year:2001, genre:"Romance", dir:"Jean-Pierre Jeunet", hue:100},
  {id:"oldboy", title:"Oldboy", year:2003, genre:"Thriller", dir:"Park Chan-wook", hue:15},
  {id:"cityofgod", title:"City of God", year:2002, genre:"Crime", dir:"Fernando Meirelles", hue:43},
  {id:"panslabyrinth", title:"Pan's Labyrinth", year:2006, genre:"Fantasy", dir:"Guillermo del Toro", hue:115},
  {id:"princessmono", title:"Princess Mononoke", year:1997, genre:"Animation", dir:"Hayao Miyazaki", hue:145},
  {id:"totoro", title:"My Neighbor Totoro", year:1988, genre:"Animation", dir:"Hayao Miyazaki", hue:125},
  {id:"wall-e", title:"WALL·E", year:2008, genre:"Animation", dir:"Andrew Stanton", hue:185},
  {id:"up", title:"Up", year:2009, genre:"Animation", dir:"Pete Docter", hue:290},
  {id:"insideout", title:"Inside Out", year:2015, genre:"Animation", dir:"Pete Docter", hue:58},
  {id:"cocomovie", title:"Coco", year:2017, genre:"Animation", dir:"Lee Unkrich", hue:25},
  {id:"spiderverse", title:"Into the Spider-Verse", year:2018, genre:"Animation", dir:"Persichetti / Ramsey / Rothman", hue:335},
  {id:"getout", title:"Get Out", year:2017, genre:"Horror", dir:"Jordan Peele", hue:165},
  {id:"hereditary", title:"Hereditary", year:2018, genre:"Horror", dir:"Ari Aster", hue:8},
  {id:"shining", title:"The Shining", year:1980, genre:"Horror", dir:"Stanley Kubrick", hue:355},
  {id:"2001space", title:"2001: A Space Odyssey", year:1968, genre:"Sci-Fi", dir:"Stanley Kubrick", hue:235},
  {id:"clockwork", title:"A Clockwork Orange", year:1971, genre:"Drama", dir:"Stanley Kubrick", hue:30},
  {id:"madmax", title:"Mad Max: Fury Road", year:2015, genre:"Action", dir:"George Miller", hue:24},
  {id:"johnwick", title:"John Wick", year:2014, genre:"Action", dir:"Chad Stahelski", hue:250},
  {id:"heat", title:"Heat", year:1995, genre:"Crime", dir:"Michael Mann", hue:212},
  {id:"drive", title:"Drive", year:2011, genre:"Thriller", dir:"Nicolas Winding Refn", hue:315},
  {id:"lalaland", title:"La La Land", year:2016, genre:"Romance", dir:"Damien Chazelle", hue:265},
  {id:"her", title:"Her", year:2013, genre:"Romance", dir:"Spike Jonze", hue:5},
  {id:"socialnetwork", title:"The Social Network", year:2010, genre:"Drama", dir:"David Fincher", hue:208},
  {id:"truman", title:"The Truman Show", year:1998, genre:"Drama", dir:"Peter Weir", hue:188},
  {id:"etern", title:"Eternal Sunshine of the Spotless Mind", year:2004, genre:"Romance", dir:"Michel Gondry", hue:170},
  {id:"killbill", title:"Kill Bill: Vol. 1", year:2003, genre:"Action", dir:"Quentin Tarantino", hue:50},
  {id:"django", title:"Django Unchained", year:2012, genre:"Western", dir:"Quentin Tarantino", hue:32},
  {id:"inglourious", title:"Inglourious Basterds", year:2009, genre:"War", dir:"Quentin Tarantino", hue:12},
  {id:"saving", title:"Saving Private Ryan", year:1998, genre:"War", dir:"Steven Spielberg", hue:78},
  {id:"schindler", title:"Schindler's List", year:1993, genre:"Drama", dir:"Steven Spielberg", hue:0},
  {id:"memento", title:"Memento", year:2000, genre:"Mystery", dir:"Christopher Nolan", hue:192},
  {id:"arrival", title:"Arrival", year:2016, genre:"Sci-Fi", dir:"Denis Villeneuve", hue:198},
  {id:"knivesout", title:"Knives Out", year:2019, genre:"Mystery", dir:"Rian Johnson", hue:352},
  {id:"challengers", title:"Challengers", year:2024, genre:"Drama", dir:"Luca Guadagnino", hue:88},
];
const MOVIES = {};
/* MOVIES holds a COPY of each row, not the row itself: enrich() mutates movie
   objects in place (genre, director, description) and DB stays pristine. */
DB.forEach(m => MOVIES[m.id] = {id:m.id, title:m.title, year:m.year, genre:m.genre, dir:m.dir, hue:m.hue});

/* ---------- state ---------- */
const KEY = "reeli-v1";
const BUCKETS = { loved:{hi:10, lo:6.7}, fine:{hi:6.6, lo:3.4}, disliked:{hi:3.3, lo:0.5} };
let S = load();

function seed(){
  return {
    profile:null,
    onboarded:false,
    guestChosen:false,
    taste:null,
    loved:[], fine:[], disliked:[],
    watch:[],
    custom:[],
    likes:{},
    notes:{},
    myFeed:[],
    feedSeen:"",
    notifSeen:"",
    lbQueue:[],
    ui:{accent:null, wall:null, wallTitle:null},
  };
}
function load(){
  try{
    const raw = localStorage.getItem(KEY);
    if(raw){
      const s = JSON.parse(raw);
      if(s && s.loved){
        if(!("profile" in s)) s.profile = null;
        if(!("onboarded" in s)) s.onboarded = true; // returning visitor: don't re-onboard
        if(!("taste" in s)) s.taste = null;
        if(!("guestChosen" in s)) s.guestChosen = false;
        if(!s.notes) s.notes = {};
        if(!("feedSeen" in s)) s.feedSeen = "";
        if(!s.ui) s.ui = {accent:null, wall:null, wallTitle:null};
        if(!("notifSeen" in s)) s.notifSeen = "";
        if(!Array.isArray(s.lbQueue)) s.lbQueue = [];
        // one-time cleanup: earlier demo builds pre-seeded rankings; if they're
        // untouched, clear them so real users start with their own list
        if(s.loved.join() === "parasite,whiplash,spiderverse,madmax" &&
           s.fine.join() === "avatar,johnwick" && s.disliked.join() === "barbie"){
          s.loved = []; s.fine = []; s.disliked = []; s.myFeed = [];
        }
        delete s.mates;
        return s;
      }
    }
  }catch(e){ logErr("reading saved state (falling back to a fresh one)", e); }
  return seed();
}
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){ logErr("saving state to localStorage", e); } updateBadge(); if(typeof queueSync === "function") queueSync(); }
function updateBadge(){
  const b = document.getElementById("watchBadge");
  if(b) b.textContent = S.watch.length ? String(S.watch.length) : "";
  /* the badge itself is aria-hidden — a bare "3" read out next to "Watchlist"
     is noise, so the count goes into the button's name instead */
  const btn = document.querySelector('[data-nav="watch"]');
  if(btn) btn.setAttribute("aria-label", S.watch.length ? `Watchlist, ${S.watch.length} saved` : "Watchlist");
}

/* id -> movie index over S.custom, memoized on (identity, length) exactly like
   rankedIndex below. S.custom is a plain array that getMovie() used to scan
   linearly, which is fine for a handful of hand-added films — but a cloud pull
   pushes one entry per ranking it doesn't already know, and a Letterboxd import
   adds one per unmatched title, so it reaches thousands. getMovie() is called
   once per row by every list render, which made that render quadratic (84ms for
   3000 entries). Every mutation of S.custom either pushes (length changes) or
   replaces the array (identity changes). */
let CUSTOM_CACHE = null;
function customIndex(){
  const C = S.custom, c = CUSTOM_CACHE;
  if(c && c.C === C && c.len === C.length) return c.map;
  const map = new Map();
  for(const m of C) if(m && !map.has(m.id)) map.set(m.id, m);
  CUSTOM_CACHE = {C, len: C.length, map};
  return map;
}
function getMovie(id){
  if(MOVIES[id]) return MOVIES[id];
  if(LIVE[id]) return LIVE[id];
  return customIndex().get(id) || null;
}
/* persist a live-search movie into the user's personal DB so it survives reloads */
function ensureSaved(id){
  if(MOVIES[id]) return;
  if(customIndex().has(id)) return;
  if(LIVE[id]) S.custom.push(LIVE[id]);
}
/* Movies, TV shows and anime rank in three completely separate pools — a
   head-to-head never pits a movie against a show, and "top 10" means top 10
   of that one type. TYPES lists every pool; typeOf() says which one an id
   belongs to, straight off the movie's `kind` (unset/"movie" -> "movie",
   "show" -> "show", "anime" -> "anime"). */
const TYPES = ["movie", "show", "anime"];
const TYPE_LABEL = { movie:"Movies", show:"TV Shows", anime:"Anime" };
function typeOf(id){
  const m = getMovie(id);
  const k = m && m.kind;
  return k === "show" || k === "anime" ? k : "movie";
}
/* "1 movie" / "3 shows" / "3 anime" — anime doesn't pluralize */
function typeNoun(type, n){
  if(type === "anime") return "anime";
  if(type === "show") return n === 1 ? "show" : "shows";
  return n === 1 ? "movie" : "movies";
}
/* "a movie" / "a show" / "an anime" */
function typeNounA(type){ return (type === "anime" ? "an " : "a ") + typeNoun(type, 1); }

/* Memoized index over the three bucket arrays, optionally narrowed to one
   media type.

   These functions used to each rebuild the whole ranked list —
   [...loved, ...fine, ...disliked] — and then scan it linearly. That is a fresh
   allocation plus an O(n) walk *per call*, and the callers run inside loops:
   rankOf() is called once per row by the rankings screen, isRanked() once per
   candidate by search, trending and the Letterboxd import queue. At a dozen
   movies nobody notices; a Letterboxd import can leave thousands, where
   lbRemaining() measured 45ms and the rankings screen went quadratic.

   The cache is valid while all three arrays are the same objects at the same
   lengths. Every mutation in this file satisfies that: removeRanking reassigns
   via filter, placeAt splices, the importers and pullRankings push. There is no
   in-place same-length permutation of these arrays (no sort/reverse anywhere).
   If one is ever introduced, invalidate explicitly with bumpRanked(). One
   cache entry per type (plus "all" for the cross-type view) is kept, all
   sharing the same epoch/array-identity invalidation. */
let RANKED_CACHE = new Map(), RANKED_EPOCH = 0;
function bumpRanked(){ RANKED_EPOCH++; RANKED_CACHE.clear(); }
function rankedIndex(type){
  const key = type || "all";
  const L = S.loved, F = S.fine, D = S.disliked, c = RANKED_CACHE.get(key);
  if(c && c.epoch === RANKED_EPOCH && c.L === L && c.F === F && c.D === D
     && c.ll === L.length && c.fl === F.length && c.dl === D.length) return c;
  const narrow = arr => type ? arr.filter(id => typeOf(id) === type) : arr;
  const arrs = { loved: narrow(L), fine: narrow(F), disliked: narrow(D) };
  const list = arrs.loved.concat(arrs.fine, arrs.disliked);
  const pos = new Map();       // id -> overall rank within this type (1-based)
  const where = new Map();     // id -> {b: bucket name, i: index within it}
  for(let i = 0; i < list.length; i++) if(!pos.has(list[i])) pos.set(list[i], i + 1);
  for(const b of ["loved","fine","disliked"])
    arrs[b].forEach((id, i) => { if(!where.has(id)) where.set(id, {b, i}); });
  const entry = {epoch: RANKED_EPOCH, L, F, D,
    ll: L.length, fl: F.length, dl: D.length, list, set: new Set(list), pos, where, arrs};
  RANKED_CACHE.set(key, entry);
  return entry;
}
/* read-only: callers must not mutate the returned array (none do).
   allRanked() with no type is every ranked item across all three pools;
   allRanked("show") etc. is that one pool. */
function allRanked(type){ return rankedIndex(type).list; }
function isRanked(id){ return rankedIndex().set.has(id); }
function bucketOf(id){ const w = rankedIndex(typeOf(id)).where.get(id); return w ? w.b : null; }
function scoreOf(id){
  const idx = rankedIndex(typeOf(id));
  const w = idx.where.get(id); if(!w) return null;
  const {hi,lo} = BUCKETS[w.b], len = idx.arrs[w.b].length;
  return Math.round((hi - (hi-lo)*(w.i+1)/(len+1))*10)/10;
}
function rankOf(id){ return rankedIndex(typeOf(id)).pos.get(id) || 0; }
function scoreClass(sc){ return sc >= 6.7 ? "s-good" : sc >= 3.4 ? "s-mid" : "s-bad"; }
function removeRanking(id){ for(const b of ["loved","fine","disliked"]) S[b] = S[b].filter(x => x !== id); }

/* ---------- helpers ---------- */
const $ = sel => document.querySelector(sel);
/* one place to surface swallowed failures: never changes control flow, just
   makes network/storage problems visible in the console instead of vanishing */
function logErr(ctx, e){ try{ console.warn("[reeli] " + ctx + " failed:", e); }catch(_){} }
/* stable pseudo-random hue from a title, for gradient poster cards.
   Shared by cineToMovie (catalog rows) and rowToMovie (cloud rows) so the same
   movie gets the same colour no matter which path it arrived through. */
function hueFromTitle(title){
  let hash = 0;
  for(const ch of title) hash = (hash*31 + ch.charCodeAt(0)) % 360;
  return hash;
}
function esc(s){ return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function avatarHTML(name, hue, url, extraStyle){
  return `<div class="avatar" style="background:hsl(${hue} 45% 45%);${extraStyle||""}">${url ? `<img src="${esc(url)}" alt="">` : esc((String(name||"?")[0]||"?").toUpperCase())}</div>`;
}
function initials(t){
  const skip = new Set(["the","a","an","of","to","in","la","le"]);
  const w = t.split(/[\s:·-]+/).filter(x => x && !skip.has(x.toLowerCase()));
  return ((w[0]||t)[0] + (w[1]?w[1][0]:"")).toUpperCase();
}
function metahubPoster(tt){ return "https://images.metahub.space/poster/medium/" + tt + "/img"; }
/* poster <img> onerror: swap to the metahub CDN once (keyed by IMDb id), then give up to the gradient card */
window.__pfail = function(img, tt){
  if(tt && !img.dataset.f){ img.dataset.f = "1"; img.src = metahubPoster(tt); }
  else img.remove();
};
function cacheEntry(id){
  const c = POSTERS.cache[id];
  if(!c || c === "x") return null;
  return typeof c === "string" ? {u:c, tt:null} : c;
}
function posterHTML(m, size){
  const h = m.hue;
  const tt = /^tt\d+$/.test(m.id) ? m.id : "";
  const cached = m.poster ? {u:m.poster, tt} : cacheEntry(m.id);
  const img = cached
    /* loading="lazy": a full 80-title ranking emits 80 poster <img>, of which a
       phone shows about six. decoding="async" keeps the decode off the thread
       that is scrolling. No width/height attributes are needed — .poster fixes
       the box in CSS per size class and .pimg fills it absolutely, so the
       layout is already stable before any image arrives. */
    ? `<img class="pimg" src="${esc(cached.u)}" alt="" loading="lazy" decoding="async" onload="this.classList.add('ld')" onerror="__pfail(this,'${esc(cached.tt||tt)}')">`
    : `<img class="pimg" data-pid="${esc(m.id)}" alt="" loading="lazy" decoding="async">`;
  return `<div class="poster ${size}" style="background:linear-gradient(150deg,hsl(${h} 42% 46%),hsl(${(h+40)%360} 48% 30%))" aria-hidden="true">
    <span class="init">${esc(initials(m.title))}</span><span class="yr">${m.year}</span>${img}</div>`;
}

/* ---------- Cinemeta (free, keyless, worldwide IMDb-backed catalog) ----------
   Stremio's public metadata API: live catalog search, real posters, and a
   per-title meta endpoint (genres, director, description, IMDb rating).
   Where outbound requests are blocked (e.g. sandboxed hosting), everything
   degrades gracefully to the built-in library and gradient poster cards. */
const CINE = "https://v3-cinemeta.strem.io";
const LIVE = {}; // id -> movie object from live search, this session
function getJSON(url, cb, timeoutMs){
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), timeoutMs || 8000);
  fetch(url, {signal: ctl.signal})
    .then(r => r.ok ? r.json() : null)
    .then(d => { clearTimeout(t); cb(d); })
    .catch(() => { clearTimeout(t); cb(null); });
}
function cineSearch(term, cb, type){
  getJSON(CINE + "/catalog/" + (type || "movie") + "/top/search=" + encodeURIComponent(term) + ".json",
    d => cb(d && Array.isArray(d.metas) ? d.metas : null));
}
function cineMeta(id, cb, kind){
  const url = CINE + "/meta/" + (kind || "movie") + "/" + encodeURIComponent(id) + ".json";
  getJSON(url, d => {
    if(d && d.meta) cb(d.meta);
    else setTimeout(() => getJSON(url, d2 => cb(d2 && d2.meta ? d2.meta : null)), 900); // one retry for transient failures
  });
}
/* normT / lev / pickMeta live in matching.js — pure title-matching logic,
   loaded before this file and covered by test-ranking.mjs */
function cineToMovie(r, kind){
  const hash = hueFromTitle(r.name);
  const m = { id: r.imdb_id || r.id, title: r.name,
    year: r.releaseInfo ? parseInt(String(r.releaseInfo).slice(0,4),10) || "—" : "—",
    genre: "", dir: "", hue: hash, poster: r.poster || null };
  if(kind === "show") m.kind = "show";
  return m;
}

/* ---------- AniList (free, keyless, GraphQL) ----------
   Cinemeta's "series" catalog covers TV in general but has no reliable signal
   for anime specifically, so anime gets its own source: AniList's public
   GraphQL API, which is anime/manga-only and needs no API key. Ids are
   prefixed "al:" so they never collide with an IMDb tt-id sharing an
   otherwise-identical title. */
const ANILIST = "https://graphql.anilist.co";
const ANILIST_FIELDS = `id title{romaji english} startDate{year} coverImage{large}
  genres description(asHtml:false) averageScore episodes format`;
function anilistQuery(query, variables, cb){
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 8000);
  fetch(ANILIST, {method:"POST", signal: ctl.signal,
    headers:{"Content-Type":"application/json", Accept:"application/json"},
    body: JSON.stringify({query, variables})})
    .then(r => r.ok ? r.json() : null)
    .then(d => { clearTimeout(t); cb(d && d.data ? d.data : null); })
    .catch(() => { clearTimeout(t); cb(null); });
}
function aniToMovie(r){
  const hash = hueFromTitle(r.title.english || r.title.romaji);
  return { id: "al:" + r.id, title: r.title.english || r.title.romaji,
    year: r.startDate && r.startDate.year || "—",
    genre: (r.genres && r.genres[0]) || "", dir: "", hue: hash,
    poster: r.coverImage && r.coverImage.large || null,
    desc: r.description ? r.description.replace(/<[^>]+>/g, "").trim() : null,
    kind: "anime", enriched: true };
}
function anilistSearch(term, cb){
  anilistQuery(
    `query($s:String){Page(page:1,perPage:20){media(search:$s,type:ANIME,sort:SEARCH_MATCH){${ANILIST_FIELDS}}}}`,
    {s: term}, d => cb(d ? d.Page.media.map(aniToMovie) : null));
}
function anilistTrending(cb){
  anilistQuery(
    `query{Page(page:1,perPage:14){media(type:ANIME,sort:TRENDING_DESC){${ANILIST_FIELDS}}}}`,
    {}, d => cb(d ? d.Page.media.map(aniToMovie) : null));
}
/* one-line meta under a title: skip blanks */
function mline(m){ return [m.year, m.genre, m.dir].filter(x => x && x !== "—").join(" · "); }
/* fill in description/rating/runtime for ANY movie: catalog ids go straight
   to the meta endpoint; built-in/custom titles resolve their IMDb id first
   (reusing the poster cache's stored id when available) */
const ENRICHING = new Set();
function enrich(id, after){
  const m = getMovie(id);
  // in-flight guard: a second open while fetching must not start a parallel chain
  if(!m || m.enriched || ENRICHING.has(id)){ if(after) after(false); return; }
  // Cinemeta has no anime catalog, so a title search here would silently
  // attach some other (movie) title's metadata to an anime entry — catalog
  // anime already arrives pre-enriched from AniList; a hand-added one just
  // stays without a description/rating rather than getting a wrong one
  if(m.kind === "anime"){ m.enriched = true; if(after) after(false); return; }
  ENRICHING.add(id);
  const finish = meta => {
    ENRICHING.delete(id);
    if(meta){
      if(!m.genre || m.genre === "—" || m.genre === "Film") m.genre = (meta.genres && meta.genres[0]) || m.genre;
      if(!m.dir || m.dir === "—") m.dir = (meta.director && meta.director[0]) || m.dir;
      m.desc = meta.description || m.desc || null;
      m.imdb = meta.imdbRating || null;
      m.runtime = meta.runtime || null;
      m.enriched = true;
      if(S.custom.some(x => x.id === id)) save();
    }
    if(after) after(!!meta);
  };
  const cineKind = m.kind === "show" ? "series" : undefined; // Cinemeta's own vocabulary; anime never reaches here (pre-enriched)
  const withTT = tt => tt ? cineMeta(tt, finish, cineKind) : finish(null);
  if(/^tt\d+$/.test(id)){ withTT(id); return; }
  const c = cacheEntry(id);
  if(c && c.tt){ withTT(c.tt); return; }
  cineSearch(m.title, metas => {
    const hit = metas ? pickMeta(metas, m.title, m.year) : null;
    const tt = hit ? (hit.imdb_id || (/^tt\d+$/.test(hit.id || "") ? hit.id : null)) : null;
    if(tt){ // opportunistically fill the poster cache from the same lookup
      POSTERS.cache[id] = {u: hit.poster || metahubPoster(tt), tt};
      savePosters();
    }
    withTT(tt);
  });
}

/* pre-resolved posters for the whole built-in library (library id -> IMDb id +
   art), so no runtime catalog search is needed for these — immune to API
   flakiness. The data lives in posters.js, loaded by a blocking <script> tag
   before this one, so it is already present by the time this line runs; a
   missing or blocked posters.js degrades to {} and every title falls back to
   the live catalog lookup path. */
const PREBAKED_POSTERS = Object.assign({}, (typeof window !== "undefined" && window.REELI_PREBAKED_POSTERS) || {});

/* poster lookups for anything not pre-baked, queued politely + cached */
const POSTERS = (() => {
  let cache = {};
  try{ cache = JSON.parse(localStorage.getItem("reeli-posters")||"{}"); }catch(e){ logErr("reading the poster cache", e); }
  // "no match" verdicts don't persist across sessions — only real poster URLs do
  for(const k of Object.keys(cache)) if(cache[k] === "x") delete cache[k];
  for(const k of Object.keys(PREBAKED_POSTERS)) if(!cache[k]) cache[k] = PREBAKED_POSTERS[k];
  return { cache, failed:new Set(), fails:{}, q:[], queued:new Set(), busy:false };
})();
function savePosters(){ try{ localStorage.setItem("reeli-posters", JSON.stringify(POSTERS.cache)); }catch(e){ logErr("saving the poster cache", e); } }
function hydratePosters(root){
  root.querySelectorAll("img.pimg[data-pid]").forEach(img => {
    const id = img.dataset.pid;
    const c = cacheEntry(id);
    if(c){ setPoster(img, c); }
    else if(POSTERS.cache[id] !== "x" && !POSTERS.failed.has(id) && !POSTERS.queued.has(id)){
      POSTERS.queued.add(id); POSTERS.q.push(id); pumpPosters();
    }
  });
}
function setPoster(img, entry){
  if(img.src) return;
  img.addEventListener("load", () => img.classList.add("ld"));
  img.addEventListener("error", () => window.__pfail(img, entry.tt || ""));
  img.src = entry.u;
}
function applyCachedPoster(id){
  document.querySelectorAll(`img.pimg[data-pid="${CSS.escape(id)}"]`).forEach(img => setPoster(img, cacheEntry(id)));
}
function pumpPosters(){
  if(POSTERS.busy || !POSTERS.q.length) return;
  POSTERS.busy = true;
  const id = POSTERS.q.shift();
  const m = getMovie(id);
  if(!m){ POSTERS.busy = false; POSTERS.queued.delete(id); pumpPosters(); return; }
  // catalog ids don't need a search — the poster CDN is keyed by IMDb id
  if(/^tt\d+$/.test(id)){
    POSTERS.cache[id] = {u: metahubPoster(id), tt: id};
    savePosters(); applyCachedPoster(id);
    POSTERS.queued.delete(id);
    POSTERS.busy = false; pumpPosters(); return;
  }
  cineSearch(m.title, metas => {
    if(metas === null){
      // transient failure: retry up to 2 more times before giving up
      const n = (POSTERS.fails[id] = (POSTERS.fails[id] || 0) + 1);
      if(n < 3){ POSTERS.q.push(id); }
      else { POSTERS.failed.add(id); POSTERS.queued.delete(id); }
    } else {
      const hit = pickMeta(metas, m.title, m.year);
      const tt = hit ? (hit.imdb_id || (/^tt\d+$/.test(hit.id||"") ? hit.id : null)) : null;
      POSTERS.cache[id] = hit ? {u: hit.poster || metahubPoster(tt), tt} : "x";
      savePosters();
      if(hit) applyCachedPoster(id);
      POSTERS.queued.delete(id);
    }
    setTimeout(() => { POSTERS.busy = false; pumpPosters(); }, 400);
  });
}
function scoreHTML(sc, extra){ return `<div class="score ${scoreClass(sc)} ${extra||""}">${sc.toFixed(1)}</div>`; }
let toastT;
function toast(msg){
  const t = $("#toast"); t.textContent = msg; t.classList.add("on");
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("on"), 1900);
}

/* ---------- the user-visible error channel ----------
   The user of this app is also the only person debugging it, and a console
   warning on a phone is a warning nobody will ever read. logErr stays the
   console half; reportErr adds the half the user can see.

   Three levels, deliberately:
     announce()  — screen-reader only, for state changes with no visual need
     toast()     — transient, polite, for things that went right
     showAlert() — persistent and assertive, for things that went wrong and
                   stay wrong. It does NOT auto-dismiss: a failure that fades
                   after 1.9s is a failure the user will miss.

   Repeats are collapsed by key so a retry loop can't produce a wall of alerts. */
function announce(msg){
  const el = $("#srstatus");
  if(el){ el.textContent = ""; el.textContent = String(msg); }
}
const ALERTED = new Set();
function showAlert(msg, key){
  const k = key || msg;
  if(ALERTED.has(k)) return;      // already on screen / already said this session
  ALERTED.add(k);
  const el = $("#alert");
  if(!el){ toast(msg); return; }  // shell missing: better a toast than silence
  el.innerHTML = `<span>${esc(msg)}</span><button data-alertclose="1" aria-label="Dismiss">✕</button>`;
  el.hidden = false;
}
function dismissAlert(){
  const el = $("#alert");
  if(el){ el.hidden = true; el.innerHTML = ""; }
}
/* the one call to make from a catch block: logs for you, surfaces for the user */
function reportErr(ctx, e, userMsg, key){
  logErr(ctx, e);
  if(userMsg) showAlert(userMsg, key || ctx);
}

/* ---------- offline ----------
   Everything the app does locally already works with no network: state lives in
   localStorage and the shell is precached by sw.js. What did NOT survive going
   offline was the sync. save() -> queueSync() -> syncCloud() -> fetch() throws
   -> the outer catch logs it and the change is dropped on the floor. Coming
   back online re-pushed only because syncCloud is a full reconcile and some
   later save() happened to run; close the tab first and the change never left
   the device.

   So: when a sync can't run, record that fact durably. The flag survives a
   reload, and is cleared only by a sync that actually succeeded. */
const PENDING_KEY = "reeli-sync-pending";
let SYNC_PENDING = false;
try{ SYNC_PENDING = localStorage.getItem(PENDING_KEY) === "1"; }catch(e){ logErr("reading the pending-sync flag", e); }
function isOffline(){ return typeof navigator !== "undefined" && navigator.onLine === false; }
function markSyncPending(why){
  SYNC_PENDING = true;
  try{ localStorage.setItem(PENDING_KEY, "1"); }catch(e){ logErr("recording the pending sync", e); }
  announce(why === "offline" ? "Offline — changes saved on this device and will sync later" : "Sync postponed");
}
function clearSyncPending(){
  const was = SYNC_PENDING;
  SYNC_PENDING = false;
  /* Always clear storage, even when the in-memory flag was already false: the
     two can disagree (flag written by an earlier session, or by another tab on
     the same origin), and a stale key means every future boot fires a redundant
     sync that nothing ever clears. */
  try{ localStorage.removeItem(PENDING_KEY); }catch(e){ logErr("clearing the pending sync", e); }
  if(!was) return;
  dismissAlert();
  announce("Changes synced");
}

/* ---------- navigation ---------- */
const TAGS = {feed:"Feed", ranks:"Your ranking", search:"Rank anything", watch:"Watchlist", profile:"Profile"};
let cur = "feed";
function nav(to){
  cur = to;
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("on"));
  $("#scr-"+to).classList.add("on");
  /* `.cur` is the visual state; aria-current is the one a screen reader reads,
     and without it the nav announces five identical-sounding buttons */
  document.querySelectorAll(".nav [data-nav]").forEach(b => {
    const on = b.dataset.nav === to;
    b.classList.toggle("cur", on);
    if(on) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current");
  });
  $("#screenTag").textContent = TAGS[to];
  render(to);
  if(to === "feed" && authed()){ markFeedSeen(); refreshCloudFeed(); refreshNotifs(); }
  window.scrollTo({top:0});
  // the screen swap is a DOM replacement, not a page load, so announce it
  announce(TAGS[to]);
}
document.querySelectorAll(".nav [data-nav]").forEach(b => b.addEventListener("click", () => nav(b.dataset.nav)));

function render(which){
  ({feed:renderFeed, ranks:renderRanks, search:renderSearch, watch:renderWatch, profile:renderProfile})[which]();
  hydratePosters($("#scr-"+which));
}

/* ---------- Supabase backend: real accounts, cloud sync, real Reelmates ----------
   Plain REST (auth + PostgREST) — no SDK. The anon key below is publishable by
   design; row-level security in the database is what protects the data. */
const SUPA_URL = "https://mnulgfeeqyjkewmvriiv.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1udWxnZmVlcXlqa2V3bXZyaWl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4NDE2MTAsImV4cCI6MjEwMDQxNzYxMH0.7NLxMKa_1QJwkU7WZCsuQYCTTmuMv_7BbwEfbzvc-SA";
const AUTH_KEY = "reeli-auth";
/* profile columns to select — avatar_url only once the customize SQL has been run */
let PSEL = "handle,display_name,avatar_hue";
fetch(SUPA_URL + pgPath("profiles", {select:"avatar_url", limit:1}),
  {headers:{apikey:SUPA_KEY, Authorization:"Bearer " + SUPA_KEY}})
  .then(r => { if(r.ok) PSEL += ",avatar_url"; })
  .catch(e => logErr("avatar_url column probe", e));
let AUTH = null;
try{ AUTH = JSON.parse(localStorage.getItem(AUTH_KEY)) || null; }catch(e){ logErr("reading the saved session", e); }
const CLOUD = { profile:null, profileLoaded:false, follows:new Set(), feed:[], myLikes:new Set(), notifs:[] };
function saveAuth(a){ AUTH = a; try{ a ? localStorage.setItem(AUTH_KEY, JSON.stringify(a)) : localStorage.removeItem(AUTH_KEY); }catch(e){ logErr("saving the session", e); } }
function authed(){ return !!(AUTH && AUTH.access_token); }
function myId(){ return AUTH && AUTH.user ? AUTH.user.id : null; }

async function refreshSession(){
  if(!AUTH || !AUTH.refresh_token) return false;
  try{
    const r = await fetch(SUPA_URL + "/auth/v1/token?grant_type=refresh_token", {
      method:"POST", headers:{apikey:SUPA_KEY, "Content-Type":"application/json"},
      body: JSON.stringify({refresh_token: AUTH.refresh_token})});
    if(!r.ok){ if(r.status === 400 || r.status === 401) saveAuth(null); return false; }
    const d = await r.json();
    saveAuth({access_token:d.access_token, refresh_token:d.refresh_token,
      expires_at: Math.floor(Date.now()/1000) + (d.expires_in || 3600), user:d.user});
    return true;
  }catch(e){ logErr("refreshing the session", e); return false; }
}
async function sb(path, opts){
  opts = opts || {};
  if(authed() && AUTH.expires_at && Date.now()/1000 > AUTH.expires_at - 60) await refreshSession();
  const headers = Object.assign({
    apikey: SUPA_KEY,
    Authorization: "Bearer " + (authed() ? AUTH.access_token : SUPA_KEY),
    "Content-Type": "application/json",
  }, opts.headers || {});
  let r = await fetch(SUPA_URL + path, Object.assign({}, opts, {headers}));
  if(r.status === 401 && authed() && await refreshSession()){
    headers.Authorization = "Bearer " + AUTH.access_token;
    r = await fetch(SUPA_URL + path, Object.assign({}, opts, {headers}));
  }
  // log-only: PostgREST reports failures as non-2xx, not as thrown errors, so
  // without this a broken policy or column just looks like "nothing happened".
  // 409 (handle taken / duplicate follow) and opts.quiet are expected outcomes
  // the caller already handles, so they stay out of the console.
  if(!r.ok && r.status !== 409 && !opts.quiet)
    logErr("supabase " + (opts.method || "GET") + " " + path + " -> " + r.status, null);
  return r;
}

/* ---- PostgREST query building ----
   Operator syntax (eq., neq., in.(...), order=col.desc, embedded selects) is
   authored by the caller and passed through verbatim; only the *values* wrapped
   in pgEq/pgNeq/pgIn get percent-encoded, so a handle, movie id or search term
   containing &, +, # or a space can never corrupt the query. */
function pgVal(v){ return encodeURIComponent(String(v)); }
function pgEq(v){ return "eq." + pgVal(v); }
function pgNeq(v){ return "neq." + pgVal(v); }
function pgIn(list){ return "in.(" + list.map(pgVal).join(",") + ")"; }
function pgPath(table, params){
  const p = params || {};
  const qs = Object.keys(p)
    .filter(k => p[k] !== undefined && p[k] !== null)
    .map(k => k + "=" + p[k])
    .join("&");
  return "/rest/v1/" + table + (qs ? "?" + qs : "");
}
function relTime(ts){
  const s = (Date.now() - new Date(ts).getTime()) / 1000;
  if(s < 90) return "just now";
  if(s < 3600) return Math.round(s/60) + "m";
  if(s < 86400) return Math.round(s/3600) + "h";
  if(s < 604800) return Math.round(s/86400) + "d";
  return new Date(ts).toLocaleDateString();
}
function rowToMovie(r){
  const m = {id:r.movie_id, title:r.title, year:r.year || "—", genre:r.genre || "",
    dir:r.director || "", hue:hueFromTitle(r.title), poster:r.poster || null};
  if(r.media_type === "show" || r.media_type === "anime") m.kind = r.media_type;
  return m;
}
function movieToRow(id, bucket, pos){
  const m = getMovie(id); if(!m) return null;
  const c = cacheEntry(id);
  return {user_id: myId(), movie_id: id, title: m.title,
    year: typeof m.year === "number" ? m.year : null,
    genre: m.genre || null, director: m.dir || null,
    poster: m.poster || (c ? c.u : null),
    bucket, position: pos, score: scoreOf(id), media_type: typeOf(id),
    note: S.notes[id] || null};
}

/* ---- cloud sync: debounced full reconcile of rankings + watchlist ---- */
let syncT = null, SYNC_TOUCH = null, PULLING = false;
function queueSync(){
  if(!authed() || PULLING) return;
  /* Offline: don't burn a doomed request, but don't forget either. The flag is
     what the "online" listener and the next boot both look at. */
  if(isOffline()){ markSyncPending("offline"); return; }
  clearTimeout(syncT);
  syncT = setTimeout(syncCloud, 1200);
}
/* upsert the local rows for one (user, movie)-keyed table, then delete whatever
   the cloud still holds that we no longer do. Upsert always runs before the
   delete-reconcile so an interrupted sync can never leave the cloud short. */
async function pushTable(table, rows, keep){
  let upsert = null;
  if(rows.length)
    upsert = await sb(pgPath(table, {on_conflict:"user_id,movie_id"}), {method:"POST",
      headers:{Prefer:"resolution=merge-duplicates"}, body: JSON.stringify(rows)});
  const cr = await sb(pgPath(table, {user_id:pgEq(myId()), select:"movie_id"}));
  if(cr.ok){
    const cloudIds = (await cr.json()).map(x => x.movie_id);
    const gone = cloudIds.filter(id => !keep(id));
    if(gone.length)
      await sb(pgPath(table, {user_id:pgEq(myId()), movie_id:pgIn(gone)}), {method:"DELETE"});
  }
  return upsert; // callers that care whether the upsert itself was accepted
}
async function pushRankings(){
  const rows = [];
  for(const b of ["loved","fine","disliked"])
    S[b].forEach((id, i) => { const r = movieToRow(id, b, i); if(r) rows.push(r); });
  await pushTable("rankings", rows, id => isRanked(id));
}
/* bump updated_at on the one ranking the user just touched, so it surfaces in
   Reelmates' feeds even when nothing else about the row changed */
async function touchRanking(){
  if(!(SYNC_TOUCH && isRanked(SYNC_TOUCH))) return;
  await sb(pgPath("rankings", {user_id:pgEq(myId()), movie_id:pgEq(SYNC_TOUCH)}),
    {method:"PATCH", body: JSON.stringify({updated_at: new Date().toISOString()})});
  SYNC_TOUCH = null;
}
/* The watchlist upsert is the one call in the app that can fail for a reason
   the user can actually fix, so it is the one call whose failure we surface.

   `resolution=merge-duplicates` compiles to INSERT ... ON CONFLICT DO UPDATE,
   which under row-level security needs an UPDATE policy as well as an INSERT
   one. public.watchlist shipped without an UPDATE policy, so the first push for
   a given movie succeeded and every push after it came back 403 / 42501 — and
   because PostgREST reports that as a status code rather than an exception, the
   watchlist silently stopped syncing while looking perfectly fine locally.

   supabase-rls-watchlist-fix.sql adds the missing policy. Until it is run, say
   so out loud: once per session, so a flaky connection doesn't nag. */
let watchlistSyncWarned = false;
async function reportWatchlistPushFailure(r){
  if(watchlistSyncWarned) return;
  watchlistSyncWarned = true;
  let detail = "";
  try{ detail = (await r.clone().text()).slice(0, 400); }catch(e){ /* body already consumed or unreadable */ }
  const rls = r.status === 403 || /42501|row-level security/i.test(detail);
  logErr("watchlist upsert -> " + r.status + (detail ? " " + detail : "") +
    (rls ? " — public.watchlist is missing its UPDATE policy; run supabase-rls-watchlist-fix.sql" : ""), null);
  toast(rls ? "Watchlist isn't syncing — run supabase-rls-watchlist-fix.sql"
            : "Watchlist sync failed — details in the console");
}
async function pushWatchlist(){
  const rows = S.watch.map(id => { const m = getMovie(id); const c = cacheEntry(id);
    return m ? {user_id:myId(), movie_id:id, title:m.title, year: typeof m.year==="number"?m.year:null,
      genre:m.genre||null, director:m.dir||null, poster:m.poster||(c?c.u:null), media_type: typeOf(id)} : null; }).filter(Boolean);
  const upsert = await pushTable("watchlist", rows, id => S.watch.includes(id));
  if(upsert && !upsert.ok) await reportWatchlistPushFailure(upsert);
  else if(upsert && upsert.ok) watchlistSyncWarned = false; // recovered: warn again if it breaks later
}
async function patchProfile(){
  if(!CLOUD.profile) return;
  // the ui column only exists after supabase-customize.sql — retry without it.
  // quiet: the first attempt failing is an expected outcome on older databases,
  // so don't warn about it every single sync; the retry still reports problems.
  const path = pgPath("profiles", {id:pgEq(myId())});
  const pr = await sb(path, {method:"PATCH", quiet:true, body: JSON.stringify({taste: S.taste, ui: S.ui})});
  if(!pr.ok) await sb(path, {method:"PATCH", body: JSON.stringify({taste: S.taste})});
}
async function syncCloud(){
  if(!authed()) return;
  /* Never push while a pull is in flight.
     queueSync() refuses to SCHEDULE during a pull, but a timer scheduled just
     before login fires straight through that check — and pushTable() deletes
     every cloud row the local state doesn't have. Local state mid-pull is the
     guest's (often empty), so that delete wiped the user's cloud watchlist and
     rankings, which then pulled back empty. Bail and let pullCloud's own
     queueSync() re-run us once the local state is whole. */
  if(PULLING){ markSyncPending("pull-in-flight"); return; }
  if(isOffline()){ markSyncPending("offline"); return; }
  // one outer catch, as before: a step that throws aborts the rest of the cycle.
  // `step` only exists so the log says WHICH half of the sync died.
  let step = "rankings";
  try{
    await pushRankings();
    step = "ranking-touch"; await touchRanking();
    step = "watchlist";     await pushWatchlist();
    step = "profile";       await patchProfile();
    clearSyncPending();     // a clean pass is the only thing that clears the flag
  }catch(e){
    /* A throw here is the network dying mid-cycle, not a policy problem — the
       local state is intact, so say so plainly rather than leaving the user to
       guess whether their rankings made it. */
    markSyncPending("error");
    reportErr("syncCloud/" + step, e,
      "Couldn't sync to the cloud — your rankings are safe on this device and will retry.",
      "sync-failed");
  }
}

/* ---- login-time pull: cloud wins, local-only guest data is merged in ---- */
async function pullProfile(){
  const pr = await sb(pgPath("profiles", {id:pgEq(myId()), select:"*"}));
  // only trust "no profile" when the fetch actually SUCCEEDED — a network
  // failure must never strand an already-set-up user in "finish setup"
  if(pr.ok){ CLOUD.profile = (await pr.json())[0] || null; CLOUD.profileLoaded = true; }
  if(CLOUD.profile){
    S.profile = {name: CLOUD.profile.display_name, handle: "@"+CLOUD.profile.handle, hue: CLOUD.profile.avatar_hue,
      avatarUrl: CLOUD.profile.avatar_url || null};
    if(CLOUD.profile.taste && !S.taste) S.taste = CLOUD.profile.taste;
    if(CLOUD.profile.ui && S.ui.accent == null && !S.ui.wall){ S.ui = Object.assign(S.ui, CLOUD.profile.ui); applyUI(); }
  }
}
async function pullFollows(){
  const fr = await sb(pgPath("follows", {follower:pgEq(myId()), select:"followee"}));
  CLOUD.follows = fr.ok ? new Set((await fr.json()).map(x => x.followee)) : new Set();
}
async function pullRankings(){
  const rr = await sb(pgPath("rankings", {user_id:pgEq(myId()), select:"*", order:"bucket,position"}));
  if(!rr.ok) return;
  const rows = await rr.json();
  if(!rows.length) return;
  // cloud wins for anything it knows about; guest-only rankings are appended
  const localOnly = {loved:[], fine:[], disliked:[]};
  for(const b of ["loved","fine","disliked"])
    localOnly[b] = S[b].filter(id => !rows.some(r => r.movie_id === id));
  S.loved = []; S.fine = []; S.disliked = [];
  rows.sort((a,b) => a.position - b.position).forEach(r => {
    if(!getMovie(r.movie_id)){ const m = rowToMovie(r); S.custom.push(m); }
    if(S[r.bucket]) S[r.bucket].push(r.movie_id);
    if(r.note) S.notes[r.movie_id] = r.note;
  });
  for(const b of ["loved","fine","disliked"]) S[b] = S[b].concat(localOnly[b]);
  // backfill real timestamps onto existing feed items (older builds stored a
  // frozen "just now" string) so they stop reading as brand-new
  const tsByMovie = {};
  rows.forEach(r => { tsByMovie[r.movie_id] = r.updated_at || r.created_at; });
  S.myFeed.forEach(f => { if(!f.ts && tsByMovie[f.movie]) f.ts = tsByMovie[f.movie]; });
}
async function pullWatchlist(){
  const wl = await sb(pgPath("watchlist", {user_id:pgEq(myId()), select:"*", order:"added_at.desc"}));
  if(!wl.ok) return;
  const rows = await wl.json();
  rows.forEach(r => { if(!getMovie(r.movie_id)) S.custom.push(rowToMovie(r)); });
  S.watch = [...new Set([...rows.map(r => r.movie_id), ...S.watch])];
}
/* The profile fetch failed (offline, a blip, a 5xx). Don't guess: retry a few
   times with backoff, and only once a request genuinely SUCCEEDS with no row do
   we ask the user to claim a handle. Without this an existing account gets sent
   through setup again every time the network hiccups at login. */
let profileRetryT = null;
function retryProfile(attempt){
  attempt = attempt || 1;
  clearTimeout(profileRetryT);
  if(!authed() || CLOUD.profile || attempt > 4) return;
  profileRetryT = setTimeout(async () => {
    if(!authed() || CLOUD.profile) return;
    try{ await pullProfile(); }catch(e){ logErr("profile retry", e); }
    if(CLOUD.profile){ save(); render(cur); queueSync(); }
    else if(CLOUD.profileLoaded) openClaimHandle();
    else retryProfile(attempt + 1);
  }, attempt * 2000);
}
async function pullLikes(){
  const lk = await sb(pgPath("likes", {user_id:pgEq(myId()), select:"ranking_user,ranking_movie"}));
  CLOUD.myLikes = lk.ok ? new Set((await lk.json()).map(x => x.ranking_user + "|" + x.ranking_movie)) : new Set();
}
async function pullCloud(){
  if(!authed()) return;
  PULLING = true;
  clearTimeout(syncT); // drop any sync queued before login; it would push guest state
  // same single outer catch as before — a throwing step skips the rest of the
  // pull; `step` only names which one for the log.
  let step = "profile";
  try{
    await pullProfile();
    step = "follows";   await pullFollows();
    step = "rankings";  await pullRankings();
    step = "watchlist"; await pullWatchlist();
    step = "likes";     await pullLikes();
    save();
  }catch(e){ logErr("pullCloud/" + step, e); }
  PULLING = false;
  queueSync(); // reconcile any local-only data up to the cloud
  refreshCloudFeed();
  refreshNotifs();
}
async function refreshCloudFeed(){
  if(!authed() || !CLOUD.follows.size){ CLOUD.feed = []; if(cur === "feed") renderFeed(); return; }
  try{
    const r = await sb(pgPath("rankings", {
      user_id: pgIn([...CLOUD.follows]),
      select: "movie_id,title,year,genre,director,poster,score,updated_at,user_id,note," +
        "profiles!rankings_user_id_fkey!inner(" + PSEL + "),likes(count)",
      order: "updated_at.desc", limit: 30,
    }));
    if(r.ok){
      CLOUD.feed = (await r.json()).map(row => {
        if(!getMovie(row.movie_id)) LIVE[row.movie_id] = rowToMovie(row);
        return {cloud:true, movie:row.movie_id, score:Number(row.score), time:relTime(row.updated_at),
          ts:row.updated_at, note:row.note || "", likes:(row.likes && row.likes[0] ? row.likes[0].count : 0),
          userId:row.user_id, handle:row.profiles.handle,
          who:{name:row.profiles.display_name, hue:row.profiles.avatar_hue, url:row.profiles.avatar_url}};
      });
      CLOUD.feedLoaded = true;
      const latest = CLOUD.feed.length ? CLOUD.feed[0].ts : "";
      if(cur === "feed"){ if(latest > (S.feedSeen || "")){ S.feedSeen = latest; save(); } markFeedSeen(); }
      else if(latest && latest > (S.feedSeen || "")) setFeedDot(true);
    }
  }catch(e){ logErr("refreshing the Reelmates feed", e); }
  if(cur === "feed") renderFeed();
}
function setFeedDot(on){
  const d = document.getElementById("feedDot");
  if(d) d.textContent = on ? "●" : "";
  const btn = document.querySelector('[data-nav="feed"]');
  if(btn) btn.setAttribute("aria-label", on ? "Feed, new activity" : "Feed");
}
function markFeedSeen(){
  setFeedDot(false);
  if(CLOUD.feed.length && CLOUD.feed[0].ts > (S.feedSeen || "")){ S.feedSeen = CLOUD.feed[0].ts; save(); }
}

const BACKEND = {
  enabled: !!SUPA_URL,
  searchPeople(q, cb){
    const safe = q.toLowerCase().replace(/[^a-z0-9_ ]/g, "");
    if(!safe) return cb([]);
    sb(pgPath("profiles", {
      select: "id," + PSEL + ",rankings!rankings_user_id_fkey(count)",
      // `safe` is already stripped to [a-z0-9_ ]; the ilike wildcards and the
      // or() grouping are operator syntax, so this value stays unencoded
      or: "(handle.ilike.*" + safe + "*,display_name.ilike.*" + safe + "*)",
      limit: 12,
    }))
      .then(r => r.ok ? r.json() : null)
      .then(rows => cb(rows === null ? null : rows
        .filter(p => p.id !== myId())
        .map(p => ({id:p.id, handle:p.handle, name:p.display_name, hue:p.avatar_hue, avatarUrl:p.avatar_url || null,
          ranked:(p.rankings && p.rankings[0] ? p.rankings[0].count : 0),
          following: CLOUD.follows.has(p.id)}))))
      .catch(e => { logErr("people search", e); cb(null); });
  },
  follow(id, cb){
    if(!authed()){ toast("Sign in to add Reelmates"); openAuthSheet("signup"); return cb(false); }
    sb(pgPath("follows"), {method:"POST", body: JSON.stringify({follower:myId(), followee:id})})
      .then(r => { if(r.ok || r.status === 409){ CLOUD.follows.add(id); refreshCloudFeed(); cb(true); } else cb(false); })
      .catch(e => { logErr("follow", e); cb(false); });
  },
  unfollow(id, cb){
    sb(pgPath("follows", {follower:pgEq(myId()), followee:pgEq(id)}), {method:"DELETE"})
      .then(r => { if(r.ok){ CLOUD.follows.delete(id); refreshCloudFeed(); cb(true); } else cb(false); })
      .catch(e => { logErr("unfollow", e); cb(false); });
  },
};

/* ---- notifications: likes on your rankings + new Reelmates ---- */
function setNotifBadge(n){
  const btn = $("#notifBtn"), b = $("#notifBadge");
  if(!btn || !b) return;
  btn.style.display = authed() ? "flex" : "none";
  b.textContent = n > 0 ? (n > 9 ? "9+" : String(n)) : "";
  btn.setAttribute("aria-label", n > 0 ? `Notifications, ${n} unread` : "Notifications");
}
function profFields(p){ return {
  who: p ? p.display_name : "Someone",
  hue: p ? p.avatar_hue : 172,
  url: p ? p.avatar_url : null,
}; }
async function refreshNotifs(){
  if(!authed()){ CLOUD.notifs = []; setNotifBadge(0); return; }
  try{
    const [likesR, followsR] = await Promise.all([
      sb(pgPath("likes", {ranking_user:pgEq(myId()), user_id:pgNeq(myId()),
        select:"user_id,ranking_movie,created_at,profiles!likes_user_id_fkey(" + PSEL + ")",
        order:"created_at.desc", limit:40})),
      sb(pgPath("follows", {followee:pgEq(myId()),
        select:"follower,created_at,profiles!follows_follower_fkey(" + PSEL + ")",
        order:"created_at.desc", limit:40})),
    ]);
    const notifs = [];
    if(likesR.ok) (await likesR.json()).forEach(x =>
      notifs.push({type:"like", userId:x.user_id, movie:x.ranking_movie, ts:x.created_at, ...profFields(x.profiles)}));
    if(followsR.ok) (await followsR.json()).forEach(x =>
      notifs.push({type:"follow", userId:x.follower, ts:x.created_at, ...profFields(x.profiles)}));
    notifs.sort((a,b) => (a.ts < b.ts ? 1 : -1));
    CLOUD.notifs = notifs.slice(0, 50);
    setNotifBadge(CLOUD.notifs.filter(n => n.ts > (S.notifSeen || "")).length);
  }catch(e){ logErr("refreshing notifications", e); }
}
function openNotifications(){
  const list = CLOUD.notifs || [];
  const heart = `<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="var(--bad)" stroke="var(--bad)" stroke-width="2"><path d="M12 21C7 16.5 3 13.3 3 9.3 3 6.4 5.2 4.5 7.7 4.5c1.7 0 3.3.9 4.3 2.4 1-1.5 2.6-2.4 4.3-2.4 2.5 0 4.7 1.9 4.7 4.8 0 4-4 7.2-9 11.7z"/></svg>`;
  const seat = `<span style="font-size:15px">🎟️</span>`;
  const body = list.length
    ? `<div class="card">${list.map(n => {
        const fresh = n.ts > (S.notifSeen || "");
        const bg = fresh ? "background:var(--accent-soft)" : "";
        const av = avatarHTML(n.who, n.hue, n.url, "width:34px;height:34px;font-size:13px");
        if(n.type === "follow"){
          return `<button class="row" data-notifperson="${esc(n.userId)}" style="${bg}">${av}
            <span class="meta"><span class="t" style="font-weight:600;font-size:13.5px;white-space:normal"><b>${esc(n.who)}</b> added you as a Reelmate</span>
            <span class="d">${esc(relTime(n.ts))}</span></span>${seat}</button>`;
        }
        const m = getMovie(n.movie), title = m ? m.title : "your ranking";
        return `<button class="row" data-notif="${esc(n.movie)}" style="${bg}">${av}
          <span class="meta"><span class="t" style="font-weight:600;font-size:13.5px;white-space:normal"><b>${esc(n.who)}</b> liked your take on <b>${esc(title)}</b></span>
          <span class="d">${esc(relTime(n.ts))}</span></span>${heart}</button>`;
      }).join("")}</div>`
    : `<div class="empty" style="padding:36px 20px"><div class="big" aria-hidden="true">🔔</div>
        <p>No notifications yet. When someone likes your ranking or adds you as a Reelmate, it shows up here.</p></div>`;
  openSheet(`<h1 class="h1">Notifications</h1>${body}`);
  if(list.length){ S.notifSeen = list[0].ts; save(); }
  setNotifBadge(0);
}

async function toggleCloudLike(userId, movieId, btn){
  if(!authed()){ toast("Sign in to like rankings"); openAuthSheet("login"); return; }
  const key = userId + "|" + movieId;
  const liked = CLOUD.myLikes.has(key);
  if(liked){
    CLOUD.myLikes.delete(key);
    await sb(pgPath("likes", {user_id:pgEq(myId()), ranking_user:pgEq(userId),
      ranking_movie:pgEq(movieId)}), {method:"DELETE"});
  } else {
    CLOUD.myLikes.add(key);
    await sb(pgPath("likes"), {method:"POST",
      body: JSON.stringify({user_id:myId(), ranking_user:userId, ranking_movie:movieId})});
  }
  refreshCloudFeed();
}

/* ---- community scores on a movie: everyone's average + your Reelmates' takes ---- */
async function loadCommunityScores(movieId){
  try{
    const r = await sb(pgPath("rankings", {movie_id:pgEq(movieId),
      select:"score,note,user_id,profiles!rankings_user_id_fkey(" + PSEL + ")", limit:200}));
    if(!r.ok) return;
    const all = await r.json();
    const others = all.filter(x => x.user_id !== myId());
    const wrap = document.getElementById("commWrap");
    // only worth showing when someone besides you has ranked it —
    // but the average includes everyone (you too), so the math matches what you see
    if(!wrap || detailId !== movieId || !others.length) return;
    const mineIncluded = all.length > others.length;
    const avg = all.reduce((a, x) => a + Number(x.score), 0) / all.length;
    const bands = [
      ["loved", all.filter(x => Number(x.score) >= 6.7).length],
      ["fine", all.filter(x => Number(x.score) >= 3.4 && Number(x.score) < 6.7).length],
      ["not for them", all.filter(x => Number(x.score) < 3.4).length],
    ].filter(b => b[1] > 0).map(b => `${b[1]} ${b[0]}`).join(" · ");
    const mates = others.filter(x => CLOUD.follows.has(x.user_id));
    wrap.innerHTML = `
      <div class="sechead">On Reeli</div>
      <div class="card" style="padding:12px 14px;display:flex;align-items:center;gap:12px">
        ${scoreHTML(Math.round(avg*10)/10)}
        <span class="d" style="color:var(--muted);font-size:12.5px;line-height:1.45">
          Average of ${all.length} ranking${all.length===1?"":"s"}${mineIncluded ? " (including yours)" : ""}<br>${esc(bands)}</span>
      </div>
      ${mates.length ? `<div class="sechead">Your Reelmates say</div><div class="card">${mates.map(x => `
        <button class="row" data-cperson="${esc(x.user_id)}">
          ${avatarHTML(x.profiles.display_name, x.profiles.avatar_hue, x.profiles.avatar_url, "width:30px;height:30px;font-size:12px")}
          <span class="meta"><span class="t" style="font-size:13px">${esc(x.profiles.display_name)}</span>
          ${x.note ? `<span class="d" style="white-space:normal">“${esc(x.note)}”</span>` : ""}</span>
          ${scoreHTML(Number(x.score))}
        </button>`).join("")}</div>` : ""}`;
  }catch(e){ logErr("loading community scores", e); }
}

/* ---- public profile sheet: tap any person to see their list ---- */
/* the person whose sheet is open, so the delegated [id] routes below can act
   on them without every button closing over a fresh copy */
let SHEET_PERSON = null;
async function openPerson(id){
  SHEET_PERSON = null;
  openSheet(`<div class="empty" style="padding:30px"><p>Loading profile…</p></div>`);
  const pr = await sb(pgPath("profiles", {id:pgEq(id), select:"*"}));
  const p = pr.ok ? (await pr.json())[0] : null;
  if(!p){ openSheet(`<div class="empty" style="padding:30px"><p>Couldn't load this profile — try again.</p></div>`); return; }
  const rr = await sb(pgPath("rankings", {user_id:pgEq(id), select:"*", order:"score.desc", limit:500}));
  const rows = rr.ok ? await rr.json() : [];
  rows.forEach(r => { if(!getMovie(r.movie_id)) LIVE[r.movie_id] = rowToMovie(r); });
  // rows arrive sorted score.desc overall; grouping preserves that order, so
  // each type's list is already sorted within itself — no re-sort needed
  const byType = {movie:[], show:[], anime:[]};
  rows.forEach(r => (byType[r.media_type] || byType.movie).push(r));
  const overlap = rows.filter(r => isRanked(r.movie_id));
  const both = overlap.slice(0, 6);
  const match = overlap.length
    ? Math.min(99, Math.max(35, Math.round(97 - (overlap.reduce((a, r) => a + Math.abs(Number(r.score) - scoreOf(r.movie_id)), 0) / overlap.length) * 9)))
    : null;
  const following = CLOUD.follows.has(id);
  const isMe = id === myId();
  SHEET_PERSON = {id, handle: p.handle, name: p.display_name};
  openSheet(`
    <div class="dhead">
      ${avatarHTML(p.display_name, p.avatar_hue, p.avatar_url, "width:74px;height:74px;font-size:26px")}
      <div class="meta">
        <h2>${esc(p.display_name)}</h2>
        <div class="d">@${esc(p.handle)} · ${rows.length} title${rows.length===1?"":"s"} ranked</div>
        ${p.taste && p.taste.genres && p.taste.genres.length ? `<div class="chips" style="margin-top:8px">${p.taste.genres.slice(0,4).map(g => `<span class="chip" style="padding:4px 9px;font-size:11px">${esc(g)}</span>`).join("")}</div>` : ""}
        <div class="dactions">
          ${isMe ? "" : `<button class="pillbtn ${following?"soft":"acc"}" id="pfollow">${following ? "Reelmates ✓" : "Add Reelmate"}</button>`}
          <button class="pillbtn" id="pshare">Share</button>
        </div>
      </div>
      ${match !== null ? `<div class="matchring" style="--pct:${match}" title="Taste match across ${overlap.length} shared title${overlap.length===1?"":"s"}"><span>${match}%</span></div>` : ""}
    </div>
    ${both.length ? `<div class="sechead">You both ranked</div><div class="card" style="padding:6px 14px">
      ${both.map(r => `<div class="bothrow"><span style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(r.title)}</span>
        <span class="score sc ${scoreClass(scoreOf(r.movie_id))}" title="Your score">${scoreOf(r.movie_id).toFixed(1)}</span>
        <span class="score sc ${scoreClass(Number(r.score))}" title="Their score">${Number(r.score).toFixed(1)}</span></div>`).join("")}
      <div style="display:flex;justify-content:flex-end;gap:14px;color:var(--muted);font-size:10.5px;padding:8px 2px 4px"><span>you</span><span>them</span></div></div>` : ""}
    ${rows.length ? TYPES.map(t => byType[t].length ? `
      <div class="sechead">Their top ${TYPE_LABEL[t].toLowerCase()}</div>
      <div class="card">${byType[t].slice(0, 10).map((r, i) => `<button class="row" data-open="${esc(r.movie_id)}">
        <span class="rankno">${i+1}</span>${posterHTML(getMovie(r.movie_id) || rowToMovie(r), "p-sm")}
        <span class="meta"><span class="t">${esc(r.title)}</span><span class="d">${esc([r.year, r.genre].filter(Boolean).join(" · "))}</span></span>
        ${scoreHTML(Number(r.score))}</button>`).join("")}</div>` : "").join("")
      : `<div class="sechead">Their top rankings</div><div class="empty"><p>Nothing ranked yet.</p></div>`}`);
  hydratePosters(sheet);
}
/* follow/unfollow from an open profile sheet. CLOUD.follows is re-read here
   rather than captured, so a stale sheet can't invert the action. */
function toggleSheetPerson(){
  if(!SHEET_PERSON) return;
  const id = SHEET_PERSON.id;
  const following = CLOUD.follows.has(id);
  (following ? BACKEND.unfollow : BACKEND.follow)(id, ok => { if(ok) openPerson(id); });
}
function shareSheetPerson(){
  if(!SHEET_PERSON) return;
  openShare(`${SHEET_PERSON.name}'s movie taste on Reeli 🎬`,
    location.origin + location.pathname + "?u=" + encodeURIComponent(SHEET_PERSON.handle));
}

/* ---- social sign-in (Supabase OAuth: works per-provider once configured in the dashboard) ---- */
const OAUTH = [["google","Google","#4285F4"],["discord","Discord","#5865F2"],["facebook","Facebook","#1877F2"],["x","X","#111"]];
function oauthBtnsHTML(){
  return OAUTH.map(([p, label, bg]) =>
    `<button class="socialbtn" data-oauth="${p}"><span class="mark" style="background:${bg}">${label[0]}</span>Continue with ${label}</button>`).join("");
}
function startOauth(provider){
  location.href = SUPA_URL + "/auth/v1/authorize?provider=" + provider +
    "&redirect_to=" + encodeURIComponent(location.origin + location.pathname);
}

/* ---- entry gate: sign up / log in up front, guest is an explicit choice ---- */
function showGate(){
  $("#gate").innerHTML = `
    <div class="hero">
      <svg width="46" height="46" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="var(--accent)" stroke-width="2.2"/>
        <circle cx="12" cy="7.6" r="1.7" fill="var(--accent)"/><circle cx="12" cy="16.4" r="1.7" fill="var(--accent)"/>
        <circle cx="7.6" cy="12" r="1.7" fill="var(--accent)"/><circle cx="16.4" cy="12" r="1.7" fill="var(--accent)"/>
      </svg>
      <span class="wordmark">Reeli</span>
      <p class="tagline">Rank every movie you've ever seen — one head-to-head at a time.</p>
    </div>
    <div class="feats">
      <div class="feat"><span class="fdot">⚔</span><span><b>No star ratings.</b> Every score is earned in head-to-head matchups.</span></div>
      <div class="feat"><span class="fdot">🌍</span><span><b>The whole catalog.</b> Live search across a worldwide movie database.</span></div>
      <div class="feat"><span class="fdot">🎟</span><span><b>Reelmates.</b> Follow real people and see rankings as they happen.</span></div>
    </div>
    <div class="authcard">
      ${oauthBtnsHTML()}
      <div class="ordiv">or with email</div>
      <button class="pillbtn acc" id="gateSignup" style="padding:13px;font-size:15px">Create account</button>
      <button class="pillbtn" id="gateLogin" style="padding:13px;font-size:15px">Log in</button>
    </div>
    <button class="ghostlink" id="gateGuest">Continue as guest</button>
    <p class="authnote">Accounts sync your list and let friends find you. Guest mode saves to this browser only — you can create an account later and your list carries over.</p>`;
  $("#gate").classList.add("on");
}
function continueAsGuest(){
  S.guestChosen = true; save(); hideGate();
  if(!S.onboarded) openOnboarding(0);
}
function hideGate(){ $("#gate").classList.remove("on"); }
function afterAuthEntry(){
  hideGate();
  if(!S.onboarded) openOnboarding(0);
  else render(cur);
}

/* ---- auth UI ---- */
/* the auth sheet's own state: which mode it is in, and the address the last
   submit used (so "resend confirmation" knows where to send). Module-level so
   the delegated routes can read it instead of every button capturing a copy. */
let AUTH_MODE = "login", AUTH_EMAIL = "";
function openAuthSheet(mode){
  const signup = mode === "signup";
  AUTH_MODE = mode;
  openSheet(`
    <h1 class="h1">${signup ? "Create your account" : "Welcome back"}</h1>
    <p class="sub">${signup ? "Your list syncs to the cloud and friends can find you." : "Log in to your Reeli account."}</p>
    <div style="display:grid;gap:10px">
      ${oauthBtnsHTML()}
      <div class="ordiv">or with email</div>
      <input class="field" id="auemail" aria-label="Email address" type="email" placeholder="Email" autocomplete="email">
      <input class="field" id="aupass" aria-label="Password" type="password" placeholder="Password (8+ characters)" autocomplete="${signup?"new-password":"current-password"}">
      <div id="auerr" style="color:var(--bad);font-size:12.5px;display:none"></div>
      <div style="display:flex;gap:9px;flex-wrap:wrap">
        <button class="pillbtn acc" id="ausubmit" style="padding:11px 20px">${signup ? "Sign up" : "Log in"}</button>
        <button class="pillbtn" id="auswap">${signup ? "I have an account" : "I need an account"}</button>
      </div>
    </div>`);
}
function authErr(msg){ const e = $("#auerr"); if(e){ e.textContent = msg; e.style.display = "block"; } }
/* one place for the two "send the confirmation email again" buttons */
async function resendConfirmation(okMsg, failMsg){
  if(!AUTH_EMAIL) return;
  const rr = await fetch(SUPA_URL + "/auth/v1/resend", {method:"POST",
    headers:{apikey:SUPA_KEY, "Content-Type":"application/json"},
    body: JSON.stringify({type:"signup", email: AUTH_EMAIL,
      options:{email_redirect_to: location.origin + location.pathname}})});
  toast(rr.ok ? okMsg : failMsg);
}
async function submitAuth(){
  const signup = AUTH_MODE === "signup";
  const email = $("#auemail").value.trim(), pass = $("#aupass").value;
  AUTH_EMAIL = email;
  if(!/.+@.+\..+/.test(email)) return authErr("That email doesn't look right.");
  if(pass.length < 8) return authErr("Password needs at least 8 characters.");
  $("#ausubmit").textContent = "…";
  try{
    const path = signup
      ? "/auth/v1/signup?redirect_to=" + encodeURIComponent(location.origin + location.pathname)
      : "/auth/v1/token?grant_type=password";
    const r = await fetch(SUPA_URL + path, {method:"POST",
      headers:{apikey:SUPA_KEY, "Content-Type":"application/json"},
      body: JSON.stringify({email, password: pass})});
    const d = await r.json();
    if(!r.ok){
      const msg = d.msg || d.error_description || d.message || "Something went wrong — try again.";
      authErr(msg);
      // stuck half-signed-up? (signed up but never confirmed) — offer a way out
      if(/confirm/i.test(msg) || /already registered/i.test(msg))
        $("#auerr").insertAdjacentHTML("afterend",
          `<button class="pillbtn soft" id="aurescue" style="justify-self:start">Resend confirmation email</button>`);
      return;
    }
    if(signup && !d.access_token){
      openSheet(`<div class="result"><h2>Check your inbox 📬</h2>
          <p>We sent a confirmation link to <b>${esc(email)}</b>.<br>Clicking it signs you in here automatically.<br>Nothing after a few minutes? Check spam, or resend.</p>
          <div style="display:flex;gap:9px"><button class="pillbtn acc" id="audone">I've confirmed — log in</button>
          <button class="pillbtn" id="auresend">Resend email</button></div></div>`);
      return;
    }
    saveAuth({access_token:d.access_token, refresh_token:d.refresh_token,
      expires_at: Math.floor(Date.now()/1000) + (d.expires_in || 3600), user:d.user});
    closeSheet();
    await pullCloud();
    /* Only send someone to "claim a handle" when the profile fetch actually
       came back and said there is none. A failed request leaves profileLoaded
       false — treating that as "no profile" is what made an existing account
       re-run setup on every login. */
    if(CLOUD.profile){ toast("Welcome back, " + CLOUD.profile.display_name + " 🎬"); afterAuthEntry(); }
    else if(CLOUD.profileLoaded) openClaimHandle();
    else { toast("Couldn't reach your profile — retrying"); afterAuthEntry(); retryProfile(); }
  }catch(e){ authErr("Network hiccup — try again."); }
  finally{ const b = $("#ausubmit"); if(b) b.textContent = signup ? "Sign up" : "Log in"; }
}
function openClaimHandle(){
  const P = S.profile || {name:"", hue:172};
  // locked: this MUST be completed — a signed-in user needs a profile to sync
  // and be found. An explicit "Not now" is the only way out (signs back out).
  openSheet(`
    <h1 class="h1">Almost there — claim your handle</h1>
    <p class="sub">You're signed in. Pick a display name and @handle so your list syncs and Reelmates can find you.</p>
    <div style="display:grid;gap:10px">
      <input class="field" id="chname" aria-label="Display name" placeholder="Display name" maxlength="40" value="${esc(P.name === "Guest" ? "" : P.name)}">
      <input class="field" id="chhandle" aria-label="Handle" placeholder="@handle" maxlength="20">
      <div class="swatches">${AVATAR_HUES.map(h => `<button class="swatch ${P.hue===h?"cur":""}" data-chue="${h}" style="background:hsl(${h} 45% 45%)" aria-pressed="${P.hue===h}" aria-label="Avatar colour ${AVATAR_HUES.indexOf(h)+1} of ${AVATAR_HUES.length}"></button>`).join("")}</div>
      <div id="cherr" style="color:var(--bad);font-size:12.5px;display:none"></div>
      <button class="pillbtn acc" id="chsave" style="padding:11px 20px">Finish</button>
      <button class="ghostlink" id="chcancel" style="margin-top:2px">Not now — sign out</button>
    </div>`, true);
  pickedHue = P.hue;
}
async function saveClaimedHandle(){
  const hue = pickedHue;
  const name = $("#chname").value.trim();
  const handle = $("#chhandle").value.trim().replace(/^@+/,"").toLowerCase();
  const err = msg => { const e = $("#cherr"); e.textContent = msg; e.style.display = "block"; };
  if(!name) return err("Pick a display name.");
  if(!/^[a-z0-9_]{3,20}$/.test(handle)) return err("Handle: 3–20 chars, letters/numbers/_ only.");
  const r = await sb(pgPath("profiles"), {method:"POST",
    body: JSON.stringify({id:myId(), handle, display_name:name, avatar_hue:hue, taste:S.taste})});
  if(r.status === 409) return err("That handle is taken — try another.");
  if(!r.ok) return err("Couldn't save — try again.");
  CLOUD.profile = {id:myId(), handle, display_name:name, avatar_hue:hue};
  S.profile = {name, handle:"@"+handle, hue};
  save(); closeSheet(true);
  toast(`Welcome to Reeli, ${name} 🎬`);
  queueSync();
  afterAuthEntry();
}
/* the avatar-colour swatches appear in two different sheets; both write here */
let pickedHue = 172;
function pickHue(el, attr){
  pickedHue = +el.dataset[attr];
  sheet.querySelectorAll(".swatch").forEach(sw => sw.classList.toggle("cur", +sw.dataset[attr] === pickedHue));
}
async function doLogout(){
  try{ await sb("/auth/v1/logout", {method:"POST"}); }catch(e){ logErr("server-side logout (signing out locally anyway)", e); }
  saveAuth(null);
  CLOUD.profile = null; CLOUD.profileLoaded = false; CLOUD.follows = new Set(); CLOUD.feed = []; CLOUD.myLikes = new Set(); CLOUD.notifs = [];
  setNotifBadge(0);
  S.profile = null; S.guestChosen = false; save(); render(cur); toast("Logged out");
  showGate();
}
/* One feed row. Split in two: feedItemData() answers "who, what, and is it
   liked?" — the part with all the cloud-vs-local branching — and feedItemHTML()
   is then a straight template with no logic worth arguing about. */
function feedItemData(f, idx){
  const m = getMovie(f.movie);
  if(!m) return null;
  const who = f.who || {name:"You", hue:(S.profile ? S.profile.hue : 172), url:(S.profile ? S.profile.avatarUrl : null)};
  /* cloud items are somebody else's ranking, keyed by (user, movie) in the
     shared likes table; local items are your own, keyed by position in myFeed */
  const like = f.cloud
    ? {liked: CLOUD.myLikes.has(f.userId + "|" + f.movie), n: f.likes || 0,
       attr: `data-clike="${esc(f.userId)}|${esc(f.movie)}"`}
    : (() => { const key = "me" + idx, liked = !!S.likes[key];
        return {liked, n: (f.likes||0) + (liked?1:0), attr: `data-like="${key}"`}; })();
  // local items now carry a real ts; render it relative. Fall back to any
  // legacy `time` string, then to "recently" for pre-fix entries.
  const localTime = f.ts ? relTime(f.ts) : (f.time || "recently");
  const sub = f.cloud
    ? `${esc(f.time)} · @${esc(f.handle || "")}`
    : `${esc(localTime)}${f.rank ? ` · #${f.rank} on your list` : ""}`;
  return {f, m, who, like, sub, cloud: !!f.cloud};
}
function feedItemHTML(f, idx){
  const d = feedItemData(f, idx);
  if(!d) return "";
  const {m, who, like} = d;
  const headInner = `
      ${avatarHTML(who.name, who.hue, who.url)}
      <div class="fwho"><b>${esc(who.name)}</b> ranked <b>${esc(m.title)}</b><br><span class="ftime">${d.sub}</span></div>
      ${scoreHTML(f.score)}`;
  return `<article class="fitem">
    ${d.cloud
      ? `<button class="fhead" data-person="${esc(f.userId)}" style="width:100%;text-align:left">${headInner}</button>`
      : `<div class="fhead">${headInner}</div>`}
    <button class="fbody" data-open="${m.id}" style="width:100%;text-align:left;border:none">
      ${posterHTML(m,"p-sm")}
      <div class="meta"><span class="t" style="font-weight:650;font-size:13.5px;display:block">${esc(m.title)}</span>
      <span class="d" style="color:var(--muted);font-size:12px">${esc(mline(m))}</span></div>
    </button>
    ${f.note ? `<p class="fnote">“${esc(f.note)}”</p>` : ""}
    <div class="facts">
      <button ${like.attr} class="${like.liked?"liked":""}" aria-pressed="${like.liked}" aria-label="${like.liked ? "Unlike" : "Like"} ${esc(m.title)}, ${like.n} ${like.n === 1 ? "like" : "likes"}">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="${like.liked?"currentColor":"none"}" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 21C7 16.5 3 13.3 3 9.3 3 6.4 5.2 4.5 7.7 4.5c1.7 0 3.3.9 4.3 2.4 1-1.5 2.6-2.4 4.3-2.4 2.5 0 4.7 1.9 4.7 4.8 0 4-4 7.2-9 11.7z"/></svg>
        ${like.n}</button>
      <button data-open="${m.id}">${isRanked(m.id) ? "Ranked ✓" : "Rank it too"}</button>
    </div>
  </article>`;
}
let feedTab = "activity", mateQuery = "", mateResults = null, mateState = "idle", mateT = null, mateSugg = null;
function feedSegsHTML(){
  return `<div class="segs">
    <button class="seg ${feedTab==="activity"?"cur":""}" data-ftab="activity">Activity</button>
    <button class="seg ${feedTab==="mates"?"cur":""}" data-ftab="mates">Reelmates</button>
  </div>`;
}
/* Activity tab: yours and your Reelmates' interleaved, newest first.
   These used to be concatenated — every one of your own rankings above every
   Reelmate's — so a film you ranked two days ago sat above a friend's from
   45 minutes ago. Both sources carry an ISO `ts`, so sort on it. Local items
   keep their index in S.myFeed (their like key is derived from it), so the
   index travels with the item rather than being the position after sorting. */
function feedActivityHTML(){
  const items = [
    ...S.myFeed.map((f, i) => ({f, i})),
    ...CLOUD.feed.map(f => ({f, i: 0})),
  ];
  const when = f => f.ts || "";            // legacy local rows have no ts: they sort last
  items.sort((a, b) => (when(b.f) > when(a.f) ? 1 : when(b.f) < when(a.f) ? -1 : 0));
  const loadingMates = authed() && CLOUD.follows.size && !CLOUD.feedLoaded
    ? `<p class="sub" style="margin:0 0 10px">Checking your Reelmates' latest…</p>` : "";
  const all = loadingMates + items.map(x => feedItemHTML(x.f, x.i)).join("");
  const body = all ? `<div class="fgrid">${all}</div>` :
    `<div class="empty"><div class="big" aria-hidden="true">🎞️</div>
        <p>Your feed starts with you. Rank a movie and it lands here — and once you add Reelmates, their rankings join the stream.</p>
        <button class="pillbtn acc" data-gosearch>Rank your first movie</button></div>`;
  return `<h1 class="h1">Fresh takes</h1>
      <p class="sub">Your rankings and your Reelmates' — as they happen.</p>${feedSegsHTML()}${body}`;
}
function personRowHTML(p){
  return `<div class="row">
        ${avatarHTML(p.name, p.hue, p.avatarUrl)}
        <button class="meta" data-person="${esc(p.id)}" style="text-align:left;min-width:0">
        <span class="t">${esc(p.name)} <span style="color:var(--muted);font-weight:500;font-size:12px">@${esc(p.handle)}</span></span>
        <span class="d">${p.ranked} title${p.ranked===1?"":"s"} ranked · tap for profile</span></button>
        <button class="pillbtn ${p.following?"soft":"acc"}" data-pfollow="${esc(p.id)}">${p.following ? "Reelmates ✓" : "Add"}</button>
      </div>`;
}
/* Kick off the "New on Reeli" lookup at most once per session. Returns the
   suggestions to draw: an array, or null while there is nothing to draw yet. */
function mateSuggestions(){
  if(mateSugg === null){
    mateSugg = "loading";
    sb(pgPath("profiles", {select:"id," + PSEL + ",rankings!rankings_user_id_fkey(count)",
      order:"created_at.desc", limit:8}))
      .then(r => r.ok ? r.json() : []).then(rows => {
        mateSugg = rows.filter(p => p.id !== myId()).map(p => ({id:p.id, handle:p.handle, name:p.display_name,
          hue:p.avatar_hue, avatarUrl:p.avatar_url || null, ranked:(p.rankings && p.rankings[0] ? p.rankings[0].count : 0),
          following: CLOUD.follows.has(p.id)}));
        if(cur === "feed" && feedTab === "mates" && !mateQuery.trim()) renderFeed();
      }).catch(e => { logErr("loading suggested people", e); mateSugg = []; });
  }
  return Array.isArray(mateSugg)
    ? mateSugg.map(p => ({...p, following: CLOUD.follows.has(p.id)}))
    : null;
}
/* The four states of the people list: no backend, searching, results in hand,
   or nothing typed yet (in which case: suggestions + an invite prompt). */
function mateResultsHTML(){
  if(!BACKEND.enabled)
    return `<div class="empty" style="padding:30px 24px"><div class="big" aria-hidden="true">🎟️</div>
        <p><b>Reelmates are real people — no bots, no demo accounts.</b><br>
        Send the site to a friend so there's someone to find:</p>
        <button class="pillbtn acc" id="inviteBtn">Copy invite link</button></div>`;
  if(mateState === "loading")
    return `<div class="empty" style="padding:24px"><p>Searching people…</p></div>`;
  if(Array.isArray(mateResults))
    return mateResults.length ? `<div class="card">${mateResults.map(personRowHTML).join("")}</div>`
      : `<div class="empty" style="padding:24px"><p>Nobody matching “${esc(mateQuery)}” yet. Handles are exact — ask your friend for theirs.</p></div>`;
  const sugg = mateSuggestions();
  return `${sugg && sugg.length ? `<div class="sechead">New on Reeli</div><div class="card">${sugg.map(personRowHTML).join("")}</div>` : ""}
        <div class="empty" style="padding:24px"><p>Search by name or @handle to find people.${authed() ? "" : "<br>You can browse without an account — following needs one."}</p>
        <button class="pillbtn soft" id="inviteBtn" style="margin-top:10px">Copy invite link</button></div>`;
}
function feedMatesHTML(){
  return `<h1 class="h1">Reelmates</h1>
      <p class="sub">Your people in the audience. Find them by name or @handle and follow their rankings.</p>
      ${feedSegsHTML()}
      <div class="searchbar">
        <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.8-3.8"/></svg>
        <input id="mq" aria-label="Find people by name or handle" type="search" placeholder="Find people by name or @handle…" value="${esc(mateQuery)}" autocomplete="off" ${BACKEND.enabled?"":"disabled"}>
      </div>
      ${mateResultsHTML()}`;
}
function renderFeed(){
  $("#feedWrap").innerHTML = feedTab === "activity" ? feedActivityHTML() : feedMatesHTML();
}
/* follow/unfollow from the people list. CLOUD.follows is the source of truth,
   not the list object, which may be a stale render. */
function toggleMate(id){
  const pool = [...(mateResults || []), ...(Array.isArray(mateSugg) ? mateSugg : [])];
  const p = pool.find(x => x.id === id);
  const name = p ? p.name : "them";
  const following = CLOUD.follows.has(id);
  const done = ok => {
    if(!ok){ toast("Couldn't update — try again"); return; }
    if(p) p.following = !following;
    toast(following ? `Removed ${name}` : `${name} is now a Reelmate 🎟️`);
    renderFeed();
  };
  following ? BACKEND.unfollow(id, done) : BACKEND.follow(id, done);
}
function copyInviteLink(){
  const link = location.origin + location.pathname;
  if(navigator.clipboard && navigator.clipboard.writeText)
    navigator.clipboard.writeText(link).then(() => toast("Invite link copied 🎟️"), () => toast(link));
  else toast(link);
}
/* typing in the Reelmates search box */
function onMateQueryInput(mq){
  mateQuery = mq.value;
  clearTimeout(mateT);
  const qq = mateQuery.trim().replace(/^@+/,"");
  if(!qq){ mateResults = null; mateState = "idle"; renderFeed(); return; }
  mateState = "loading";
  mateT = setTimeout(() => BACKEND.searchPeople(qq, res => {
    mateResults = res || []; mateState = "done";
    if(cur === "feed" && feedTab === "mates"){ const pos = $("#mq") ? $("#mq").selectionStart : null; renderFeed(); const ni = $("#mq"); if(ni){ ni.focus(); if(pos!==null) ni.setSelectionRange(pos,pos); } }
  }), 400);
  renderFeed();
  const ni = $("#mq"); ni.focus(); ni.setSelectionRange(ni.value.length, ni.value.length);
}

/* ---------- rankings ---------- */
let rankFilter = "all", rankGenre = "", rankType = "movie";
function renderRanks(){
  const tabs = `<div class="segs" role="tablist">
    ${TYPES.map(t => `<button class="seg ${rankType===t?"cur":""}" data-rtype="${t}">${TYPE_LABEL[t]} (${allRanked(t).length})</button>`).join("")}
  </div>`;
  const ids = allRanked(rankType);
  let body;
  if(!ids.length){
    body = `<div class="empty"><div class="big" aria-hidden="true">🎬</div>
      <p>Nothing ranked yet. Add your first ${esc(typeNoun(rankType,1))} and Reeli will build your list one head-to-head at a time.</p>
      <button class="pillbtn acc" data-gosearch>Rank your first ${esc(typeNoun(rankType,1))}</button></div>`;
  } else {
    const genres = [...new Set(ids.map(getMovie).filter(Boolean).map(m => m.genre).filter(g => g && g !== "—"))].sort();
    if(rankGenre && !genres.includes(rankGenre)) rankGenre = "";
    const shown = ids.filter(id => {
      if(rankFilter !== "all" && bucketOf(id) !== rankFilter) return false;
      if(rankGenre){ const m = getMovie(id); if(!m || m.genre !== rankGenre) return false; }
      return true;
    });
    const rows = shown.map(id => {
      const m = getMovie(id); if(!m) return "";
      return `<button class="row" data-open="${id}">
        <span class="rankno">${rankOf(id)}</span>
        ${posterHTML(m,"p-sm")}
        <span class="meta"><span class="t">${esc(m.title)}</span><span class="d">${esc([m.year, m.genre].filter(x => x && x !== "—").join(" · "))}</span></span>
        ${scoreHTML(scoreOf(id))}
      </button>`;
    }).join("");
    body = `
      <div class="segs" role="tablist">
        ${[["all","All ("+ids.length+")"],["loved","Loved"],["fine","Fine"],["disliked","Not for me"]].map(([k,l]) =>
          `<button class="seg ${rankFilter===k?"cur":""}" data-filter="${k}">${l}</button>`).join("")}
      </div>
      ${genres.length >= 2 ? `<div class="segs" style="margin-top:-6px">
        ${genres.map(g => `<button class="seg ${rankGenre===g?"cur":""}" data-gfilter="${esc(g)}" style="padding:5px 11px;font-size:11.5px">${esc(g)}</button>`).join("")}
      </div>` : ""}
      <div class="card">${rows || `<div class="empty"><p>Nothing matches this filter yet.</p></div>`}</div>`;
  }
  $("#ranksWrap").innerHTML = `
    <h1 class="h1">Your ranking</h1>
    <p class="sub">Every score is earned by head-to-head matchups — no gut-feel star ratings here.</p>
    ${tabs}
    ${body}`;
}

/* ---------- search: three independent sections — Movies, TV Shows, Anime ----------
   Each section works exactly the same way (trending + live worldwide search)
   but never mixes results with the others: movies come from Cinemeta's movie
   catalog, shows from its series catalog, anime from AniList. Which section
   is open is `searchType`; switching it re-runs trending/search for the new
   type from scratch. */
let query = "", searchType = "movie", liveResults = [], liveState = "idle", liveT = null, liveSeq = 0;
function movieRowHTML(m){
  const ranked = isRanked(m.id), inWatch = S.watch.includes(m.id);
  return `<div class="row">
    ${posterHTML(m,"p-sm")}
    <button class="meta" data-open="${m.id}" style="text-align:left;min-width:0">
      <span class="t">${esc(m.title)}</span><span class="d">${esc(mline(m))}</span>
    </button>
    ${ranked ? scoreHTML(scoreOf(m.id))
      : `<button class="iconbtn ${inWatch?"on":""}" data-watch="${m.id}" aria-label="${inWatch?"Remove from":"Add to"} watchlist" title="Watchlist">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="${inWatch?"currentColor":"none"}" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M6 3h12v18l-6-4.5L6 21z"/></svg></button>
        <button class="pillbtn acc" data-rate="${m.id}">Rank</button>`}
  </div>`;
}
function switchSearchType(t){
  if(t === searchType || !TYPES.includes(t)) return;
  searchType = t;
  liveResults = []; liveState = "idle"; liveSeq++;
  if(query.trim()) runLiveSearch(query.trim());
  renderSearch();
}
function runLiveSearch(q){
  const seq = ++liveSeq, type = searchType;
  liveState = "loading";
  const locals = new Set([...DB, ...S.custom].map(m => normT(m.title)+"|"+m.year));
  const finish = results => {
    if(seq !== liveSeq) return;
    if(results === null){ liveState = "err"; liveResults = []; }
    else {
      liveState = "done";
      liveResults = results.filter(m => !locals.has(normT(m.title)+"|"+m.year));
      liveResults.forEach(m => { if(!getMovie(m.id)) LIVE[m.id] = m; });
    }
    if(cur === "search" && searchType === type) renderSearch();
  };
  if(type === "movie") cineSearch(q, r => finish(r ? r.slice(0, 20).map(x => cineToMovie(x)) : null));
  else if(type === "show") cineSearch(q, r => finish(r ? r.slice(0, 20).map(x => cineToMovie(x, "show")) : null), "series");
  else anilistSearch(q, finish);
}
// per type: null (not loaded), "loading", "err", or an array of results
let TRENDING = { movie: null, show: null, anime: null };
function loadTrending(type){
  if(TRENDING[type] !== null) return; // already loaded or in flight
  TRENDING[type] = "loading";
  const land = list => {
    TRENDING[type] = list;
    if(Array.isArray(list)) list.forEach(m => { if(!getMovie(m.id)) LIVE[m.id] = m; });
    if(cur === "search" && !query.trim() && searchType === type) renderSearch();
  };
  if(type === "movie"){
    getJSON(CINE + "/catalog/movie/top.json", d => {
      if(!d || !Array.isArray(d.metas)) return land("err");
      const locals = new Set(DB.map(m => normT(m.title)+"|"+m.year));
      land(d.metas.slice(0, 14).map(r => cineToMovie(r)).filter(m => !locals.has(normT(m.title)+"|"+m.year)));
    });
  } else if(type === "show"){
    getJSON(CINE + "/catalog/series/top.json", d => {
      if(!d || !Array.isArray(d.metas)) return land("err");
      land(d.metas.slice(0, 14).map(r => cineToMovie(r, "show")));
    });
  } else {
    anilistTrending(list => land(list || "err"));
  }
}
function renderSearch(){
  const q = query.trim().toLowerCase();
  loadTrending(searchType);
  const tabs = `<div class="segs" role="tablist">
    ${TYPES.map(t => `<button class="seg ${searchType===t?"cur":""}" data-stype="${t}">${TYPE_LABEL[t]}</button>`).join("")}
  </div>`;
  let body;
  if(searchType === "movie"){
    const pool = [...DB.map(m => MOVIES[m.id]), ...S.custom.filter(m => typeOf(m.id) === "movie")];
    const list = q
      ? pool.filter(m => (m.title+" "+m.dir+" "+m.genre+" "+m.year).toLowerCase().includes(q))
      : pool.filter(m => !isRanked(m.id)).sort((a,b) => tasteScore(b) - tasteScore(a)).slice(0, 12);
    const rows = list.map(movieRowHTML).join("");
    const trend = TRENDING.movie;
    const trendRows = (!q && Array.isArray(trend)) ? trend.filter(m => !isRanked(m.id)).slice(0, 10).map(movieRowHTML).join("") : "";
    body = `
      ${trendRows ? `<div class="sechead">Popular movies</div><div class="card">${trendRows}</div>` : ""}
      ${!q ? `<div class="sechead">${S.taste ? "Picked for your taste" : "Suggestions for you"}</div>` : rows ? `<div class="sechead">From your library</div>` : ""}
      ${(!q || rows) ? `<div class="card">${rows}</div>` : ""}`;
  } else {
    const label = TYPE_LABEL[searchType].toLowerCase();
    // hand-added shows/anime (the "Add manually" escape hatch below) live only
    // in S.custom — same local pool the movie tab already searches/browses
    const customPool = S.custom.filter(m => typeOf(m.id) === searchType);
    const customList = q
      ? customPool.filter(m => (m.title+" "+m.genre+" "+m.year).toLowerCase().includes(q))
      : customPool.filter(m => !isRanked(m.id));
    const customRows = customList.map(movieRowHTML).join("");
    const trend = TRENDING[searchType];
    const trendRows = (!q && Array.isArray(trend)) ? trend.filter(m => !isRanked(m.id)).slice(0, 10).map(movieRowHTML).join("") : "";
    const trendEmpty = !q && !trendRows
      ? trend === "loading" ? `<div class="empty" style="padding:22px"><p>Loading trending ${label}…</p></div>`
        : trend === "err" ? `<div class="empty" style="padding:22px"><p>Live catalog unreachable right now.</p></div>`
        : ""
      : "";
    body = `
      ${trendRows ? `<div class="sechead">Trending ${label}</div><div class="card">${trendRows}</div>` : trendEmpty}
      ${customRows ? `<div class="sechead">From your library</div><div class="card">${customRows}</div>` : ""}
      ${!q && !trendRows && !customRows && !trendEmpty ? `<div class="empty" style="padding:22px"><p>Search to find ${label}.</p></div>` : ""}`;
  }
  let liveHTML = "";
  if(q){
    const liveRows = liveResults.map(movieRowHTML).join("");
    liveHTML = `<div class="sechead">Worldwide catalog</div><div class="card">${
      liveState === "loading" ? `<div class="empty" style="padding:22px"><p>Searching the worldwide catalog…</p></div>`
      : liveState === "err" ? `<div class="empty" style="padding:22px"><p>Live catalog unreachable right now.</p></div>`
      : liveRows || `<div class="empty" style="padding:22px"><p>No catalog matches for “${esc(query)}”.</p></div>`}</div>`;
  }
  $("#searchWrap").innerHTML = `
    <h1 class="h1">Rank anything</h1>
    <p class="sub">Movies, TV shows, anime — three separate boards, search the whole worldwide catalog.</p>
    ${tabs}
    <div class="searchbar">
      <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.8-3.8"/></svg>
      <input id="q" aria-label="Search ${TYPE_LABEL[searchType].toLowerCase()}" type="search" placeholder="Search ${TYPE_LABEL[searchType].toLowerCase()}…" value="${esc(query)}" autocomplete="off">
    </div>
    ${body}
    ${liveHTML}
    <div class="sechead">Missing something?</div>
    <div class="card"><div class="row">
      <span class="meta"><span class="t">Add ${esc(typeNounA(searchType))} manually</span><span class="d">${searchType === "movie" ? "Home movies? Festival one-offs?" : searchType === "show" ? "A local series the catalog missed?" : "A title the catalog missed?"} Put it on the board.</span></span>
      <button class="pillbtn soft" data-addcustom>Add</button>
    </div></div>`;
}
/* typing in the movie search box: debounce the worldwide lookup, re-render, and
   put the caret back where it was (the input is replaced on every render) */
function onSearchInput(inp){
  query = inp.value;
  const pos = inp.selectionStart;
  clearTimeout(liveT);
  const qq = query.trim();
  if(qq){ liveState = "loading"; liveT = setTimeout(() => runLiveSearch(qq), 450); }
  else { liveState = "idle"; liveResults = []; liveSeq++; }
  renderSearch();
  const ni = $("#q"); ni.focus(); ni.setSelectionRange(pos,pos);
}

/* ---------- watchlist ---------- */
function renderWatch(){
  const items = S.watch.map(getMovie).filter(Boolean);
  const rows = items.map(m => `<div class="row">
      ${posterHTML(m,"p-sm")}
      <button class="meta" data-open="${m.id}" style="text-align:left;min-width:0">
        <span class="t">${esc(m.title)}</span><span class="d">${esc(mline(m))}</span>
      </button>
      <button class="pillbtn acc" data-rate="${m.id}">Seen it</button>
      <button class="iconbtn" data-unwatch="${m.id}" aria-label="Remove from watchlist">
        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
    </div>`).join("");
  $("#watchWrap").innerHTML = `
    <h1 class="h1">Watchlist</h1>
    <p class="sub">Queued up for future you. Rank them once you've watched.</p>
    ${items.length >= 2 ? `<div style="margin-bottom:14px"><button class="pillbtn acc" id="pickBtn">🎲 Pick tonight's movie for me</button></div>` : ""}
    ${items.length ? `<div class="card">${rows}</div>`
      : `<div class="empty"><div class="big" aria-hidden="true">🍿</div><p>Your watchlist is empty. Browse and bookmark anything you want to see.</p><button class="pillbtn acc" data-gosearch>Find movies</button></div>`}`;
}
/* taste-weighted random pick from the watchlist */
function pickTonight(prevId){
  const items = S.watch.map(getMovie).filter(m => m && m.id !== prevId);
  if(!items.length){ toast("Watchlist is empty — go find something"); return; }
  const weights = items.map(m => 1 + tasteScore(m));
  let t = Math.random() * weights.reduce((a, b) => a + b, 0);
  let m = items[items.length - 1];
  for(let i = 0; i < items.length; i++){ t -= weights[i]; if(t <= 0){ m = items[i]; break; } }
  detailId = m.id;
  enrich(m.id, ok => { if(ok && detailId === m.id && overlay.classList.contains("on")) pickAgainRender(m); });
  pickAgainRender(m);
}
let PICK_MOVIE = null; // the movie the "tonight's pick" sheet is showing
function pickAgainRender(m){
  PICK_MOVIE = m;
  openSheet(`
    <div class="step">Tonight's pick</div>
    <div class="result" style="margin-top:10px">
      ${posterHTML(m,"p-lg")}
      <h2>${esc(m.title)}</h2>
      <p>${esc([m.year, m.genre, m.runtime].filter(x => x && x !== "—").join(" · "))}${m.imdb ? ` · ★ ${esc(m.imdb)}` : ""}</p>
      ${m.desc ? `<p style="max-width:38ch">${esc(m.desc)}</p>` : ""}
      <div style="display:flex;gap:9px;margin-top:6px;flex-wrap:wrap;justify-content:center">
        <button class="pillbtn acc" id="pkSeen">Watched it — rank it</button>
        <button class="pillbtn" id="pkAgain">🎲 Spin again</button>
        <button class="pillbtn" id="pkClose">Close</button>
      </div>
    </div>`);
  hydratePosters(sheet);
}

/* ---------- profile ----------
   Split three ways: profileData() computes, the *HTML helpers render one block
   each, and renderProfile() only glues them together and writes. The nested
   ternaries that used to sit inline in the middle of the markup (the identity
   line, the account banner) are named functions now, so each branch reads as
   its own case instead of a chain you have to unpick. */
function profileData(){
  const ids = allRanked();
  const scores = ids.map(scoreOf);
  const gc = {};
  ids.forEach(id => { const m = getMovie(id); if(m && m.genre) gc[m.genre] = (gc[m.genre]||0)+1; });
  return {
    ids,
    avg: scores.length ? (scores.reduce((a,b)=>a+b,0)/scores.length).toFixed(1) : "—",
    topGenres: Object.entries(gc).sort((a,b)=>b[1]-a[1]).slice(0,5),
    n: ids.length || 1,                 // divisor for the distribution bars
    dist: [["Loved", S.loved.length, "var(--good)"],["Fine", S.fine.length, "var(--mid)"],["Not for me", S.disliked.length, "var(--bad)"]],
    P: S.profile || {name:"Guest", handle:"@guest", hue:172},
    cloud: authed() && CLOUD.profile,
    // only after a CONFIRMED cloud check showing no profile — never during load or on a failed fetch
    needsSetup: authed() && CLOUD.profileLoaded && !CLOUD.profile,
  };
}
/* the line under the display name — three mutually exclusive states */
function profileIdentityLine(d){
  if(d.cloud) return esc(d.P.handle) + " · " + esc(AUTH.user && AUTH.user.email || "");
  if(d.needsSetup) return "signed in — pick a handle";
  return esc(d.P.handle) + " · guest mode";
}
function profileHeadHTML(d){
  return `<div class="phead">
      ${avatarHTML(d.needsSetup ? "?" : d.P.name, d.P.hue, d.P.avatarUrl)}
      <div style="flex:1;min-width:0"><div class="pname">${d.needsSetup ? "Finish setup" : esc(d.P.name)}</div>
        <div class="phandle">${profileIdentityLine(d)}</div></div>
      ${d.needsSetup ? "" : `<button class="pillbtn" id="editBtn">Edit</button>`}
    </div>`;
}
/* the call-to-action card above the stats. Signed in with a profile: nothing to
   nag about. Signed in without one: sync is silently off, say so. Guest: offer
   an account. */
function profileBannerHTML(d){
  if(d.needsSetup) return `<div class="card" style="padding:14px;margin-bottom:14px;display:flex;gap:10px;align-items:center;flex-wrap:wrap">
      <span class="d" style="color:var(--muted);font-size:12.5px;line-height:1.5;flex:1;min-width:200px">
      You're signed in, but you haven't picked a handle yet — so your list isn't syncing and friends can't find you. Finish setup to fix that.</span>
      <button class="pillbtn acc" id="finishSetupBtn">Finish setup</button>
      <button class="pillbtn" id="logoutBtn2">Sign out</button></div>`;
  if(d.cloud) return "";
  return `<div class="card" style="padding:14px;margin-bottom:14px;display:flex;gap:10px;align-items:center;flex-wrap:wrap">
      <span class="d" style="color:var(--muted);font-size:12.5px;line-height:1.5;flex:1;min-width:200px">
      You're in guest mode — everything saves to this browser only. Create a free account to sync your list and follow Reelmates.</span>
      <button class="pillbtn acc" id="signupBtn">Create account</button>
      <button class="pillbtn" id="loginBtn">Log in</button></div>`;
}
function profileStatsHTML(d){
  return `<div class="stats" style="grid-template-columns:repeat(4,1fr)">
      <div class="stat"><div class="n">${d.ids.length}</div><div class="l">Ranked</div></div>
      <div class="stat"><div class="n">${S.loved.length}</div><div class="l">Loved</div></div>
      <div class="stat"><div class="n">${S.watch.length}</div><div class="l">Queued</div></div>
      <div class="stat"><div class="n">${d.avg}</div><div class="l">Avg</div></div>
    </div>`;
}
function profileTasteHTML(){
  const chips = S.taste && (S.taste.genres.length || S.taste.dirs.length)
    ? `<div class="chips" style="margin-bottom:14px">${[...S.taste.genres, ...S.taste.dirs].map(t => `<span class="chip">${esc(t)}</span>`).join("")}</div>`
    : `<div class="card" style="padding:12px 14px;margin-bottom:14px"><span class="d" style="color:var(--muted);font-size:12.5px">No taste set yet — pick genres and filmmakers to fuel your suggestions.</span></div>`;
  return `<div class="sechead" style="display:flex;justify-content:space-between;align-items:center">Your taste
      <button class="pillbtn" id="tasteBtn" style="padding:5px 11px;font-size:11.5px">${S.taste ? "Edit" : "Set up"}</button></div>
    ${chips}`;
}
/* accent swatches + wallpaper picker. `name`/`hue` here are the accent's, not
   the profile's — the old inline version shadowed the outer `n`. */
function profileCustomizeHTML(){
  const swatches = ACCENTS.map(([name, hue]) =>
          `<button class="swatch ${S.ui.accent === hue ? "cur" : ""}" data-acc="${hue === null ? "" : hue}" title="${name}" aria-label="${name}"
            style="background:${hue === null ? "#0E6B5C" : `hsl(${hue} 60% 44%)`}"></button>`).join("");
  return `<div class="sechead">Make it yours</div>
    <div class="card" style="padding:14px;margin-bottom:14px;display:grid;gap:12px">
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
        <span class="d" style="color:var(--muted);font-size:12px;width:72px;flex:none">Accent</span>
        <div class="swatches" style="justify-content:flex-start;flex-wrap:wrap">${swatches}</div>
      </div>
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
        <span class="d" style="color:var(--muted);font-size:12px;width:72px;flex:none">Wallpaper</span>
        <button class="pillbtn" id="wallBtn" aria-label="${S.ui.wallTitle ? "Change wallpaper, currently " + esc(S.ui.wallTitle) : "Pick a movie scene as wallpaper"}">${S.ui.wallTitle ? "🎞 " + esc(S.ui.wallTitle) : "Pick a movie scene"}</button>
      </div>
    </div>`;
}
function profileBreakdownHTML(d){
  return `<div class="sechead">Taste breakdown</div>
    <div class="card" style="padding:14px">
      ${d.dist.map(([l,c,col]) => `<div class="distrow"><span class="lbl">${l}</span>
        <span class="bar"><span class="fill" style="width:${Math.round(c/d.n*100)}%;background:${col}"></span></span>
        <span class="cnt">${c}</span></div>`).join("")}
    </div>`;
}
function profileGenresHTML(d){
  if(!d.topGenres.length) return "";
  return `<div class="sechead">Most-ranked genres</div>
      <div class="chips">${d.topGenres.map(([g,c]) => `<span class="chip">${esc(g)} · ${c}</span>`).join("")}</div>`;
}
function profilePodiumHTML(d){
  if(!d.ids.length) return "";
  const medals = ["🥇","🥈","🥉"];
  return `<div class="sechead">Podium</div><div class="card">${
      d.ids.slice(0,3).map((id,i) => { const m = getMovie(id); return `<button class="row" data-open="${id}">
        <span class="rankno">${medals[i]}</span>${posterHTML(m,"p-sm")}
        <span class="meta"><span class="t">${esc(m.title)}</span><span class="d">${esc([m.year, m.genre].filter(x => x && x !== "—").join(" · "))}</span></span>
        ${scoreHTML(scoreOf(id))}</button>`; }).join("")}</div>`;
}
function profileActionsHTML(d){
  return `<div style="display:flex;gap:9px;margin-top:18px;flex-wrap:wrap">
      ${d.cloud ? `<button class="pillbtn soft" id="shareProfBtn">Share my profile</button>` : ""}
      ${d.ids.length ? `<button class="pillbtn soft" id="shareBtn">Share my top 5</button>` : ""}
      <button class="pillbtn soft" id="lbImportBtn">Import from Letterboxd</button>
      <button class="pillbtn" id="exportBtn">Back up data</button>
      <button class="pillbtn" id="importBtn">Restore backup</button>
      ${authed() ? `<button class="pillbtn" id="logoutBtn">Log out</button>` : ""}
    </div>`;
}
function profileHTML(d){
  return `
    ${profileHeadHTML(d)}
    ${profileBannerHTML(d)}
    ${profileStatsHTML(d)}
    ${profileTasteHTML()}
    ${profileCustomizeHTML()}
    ${profileBreakdownHTML(d)}
    ${profileGenresHTML(d)}
    ${profilePodiumHTML(d)}
    ${profileActionsHTML(d)}
    <button class="danger" id="resetBtn">Reset all my data</button>
    <div style="color:var(--muted);font-size:10.5px;margin-top:14px">Reeli build ${BUILD}</div>`;
}
function renderProfile(){
  $("#profileWrap").innerHTML = profileHTML(profileData());
}
/* backup/restore, kept out of the render path so it can be reached from the
   delegated click router */
function exportBackup(){
  const text = JSON.stringify({reeli:1, app:S, posters:POSTERS.cache});
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(() => toast("Backup copied — paste it somewhere safe"), () => toast("Couldn't copy here"));
  } else toast("Couldn't copy here");
}
function importBackup(){
  const txt = prompt("Paste your Reeli backup:");
  if(!txt) return;
  try{
    const d = JSON.parse(txt);
    if(!d || d.reeli !== 1 || !d.app || !Array.isArray(d.app.loved)) throw 0;
    S = d.app;
    if(!("profile" in S)) S.profile = null;
    if(!("onboarded" in S)) S.onboarded = true;
    if(!("taste" in S)) S.taste = null;
    delete S.mates;
    Object.assign(POSTERS.cache, d.posters || {});
    save(); savePosters(); render(cur); toast("Backup restored 🎬");
  }catch(e){ toast("That doesn't look like a Reeli backup"); }
}
function shareTopFive(){
  const ids = allRanked();
  const cloud = authed() && CLOUD.profile;
  const top = ids.slice(0,5).map((id,i) => `${i+1}. ${getMovie(id).title} — ${scoreOf(id).toFixed(1)}`).join("\n");
  openShare(`My top 5 on Reeli 🎬\n${top}\nWhat's yours?`,
    cloud ? location.origin + location.pathname + "?u=" + encodeURIComponent(CLOUD.profile.handle) : "https://reeli.org/");
}
function resetEverything(){
  if(confirm("Wipe your rankings, watchlist and activity? This can't be undone.")){
    localStorage.removeItem(KEY); localStorage.removeItem("reeli-posters");
    S = seed(); save(); nav("feed"); openOnboarding(0);
  }
}

/* ---------- onboarding: Beli-style taste picker (guest-first) ---------- */
const AVATAR_HUES = [172, 262, 22, 335, 205, 45];
const OB_GENRES = ["Drama","Sci-Fi","Crime","Thriller","Comedy","Animation","Anime","Horror","Action","Romance","Fantasy","Mystery","Documentary","War","Adventure","Western"];
const OB_MAKERS = ["Christopher Nolan","Martin Scorsese","Steven Spielberg","Quentin Tarantino","Denis Villeneuve","David Fincher","Hayao Miyazaki","Stanley Kubrick","Coen Brothers","Wes Anderson","Alfred Hitchcock","Ridley Scott","James Cameron","Greta Gerwig","Jordan Peele","Damien Chazelle"];
let O = null;
function tasteScore(m){
  if(!S.taste) return 0;
  return (S.taste.genres.includes(m.genre) ? 2 : 0) + (S.taste.dirs.includes(m.dir) ? 3 : 0);
}
function openOnboarding(step){
  O = O || {
    genres: new Set(S.taste ? S.taste.genres : []),
    dirs: new Set(S.taste ? S.taste.dirs : []),
    movies: new Set(),
  };
  obStep(step);
}
function obDots(n){ return `<div class="obdots">${[0,1,2,3].map(i => `<span class="${i<=n?"on":""}"></span>`).join("")}</div>`; }
function obStep(n){
  if(n === 0){
    openSheet(`
      <div style="display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px;padding:10px 0 4px">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="var(--accent)" stroke-width="2.2"/>
          <circle cx="12" cy="7.6" r="1.7" fill="var(--accent)"/><circle cx="12" cy="16.4" r="1.7" fill="var(--accent)"/>
          <circle cx="7.6" cy="12" r="1.7" fill="var(--accent)"/><circle cx="16.4" cy="12" r="1.7" fill="var(--accent)"/>
        </svg>
        <span class="wordmark" style="font-size:30px">Reeli</span>
        <p class="sub" style="margin:0;max-width:32ch">No star ratings here. Every movie earns its score in head-to-head matchups against your own list.</p>
        <p class="sub" style="margin:0;max-width:32ch">Tell us your taste and we'll set up your first rankings — takes under a minute.</p>
      </div>
      <div class="obfoot">
        <button class="pillbtn acc" data-ob="1" style="padding:11px 22px">Set up my taste</button>
        <button class="pillbtn" data-ob="skip">Skip — just let me in</button>
      </div>${obDots(0)}`);
  } else if(n === 1){
    openSheet(`
      <div class="step">Your taste · 1 of 3</div>
      <h1 class="h1" style="text-align:center;margin-top:12px">What do you love watching?</h1>
      <p class="sub" style="text-align:center">Pick as many as you like — this fuels your suggestions.</p>
      <div class="chipgrid">${OB_GENRES.map(g => `<button class="chippick ${O.genres.has(g)?"sel":""}" data-g="${g}">${g}</button>`).join("")}</div>
      <div class="obfoot"><button class="pillbtn acc" data-ob="2" style="padding:11px 22px">Next</button><button class="pillbtn" data-ob="skip">Skip the rest</button></div>${obDots(1)}`);
  } else if(n === 2){
    openSheet(`
      <div class="step">Your taste · 2 of 3</div>
      <h1 class="h1" style="text-align:center;margin-top:12px">Filmmakers you rate</h1>
      <p class="sub" style="text-align:center">Directors and writer-directors whose work you seek out.</p>
      <div class="chipgrid">${OB_MAKERS.map(d => `<button class="chippick ${O.dirs.has(d)?"sel":""}" data-d="${esc(d)}">${esc(d)}</button>`).join("")}</div>
      <div class="obfoot"><button class="pillbtn acc" data-ob="3" style="padding:11px 22px">Next</button><button class="pillbtn" data-ob="skip">Skip the rest</button></div>${obDots(2)}`);
  } else if(n === 3){
    const cands = DB.map(m => MOVIES[m.id])
      .filter(m => !isRanked(m.id))
      .sort((a,b) => ((O.genres.has(b.genre)?2:0)+(O.dirs.has(b.dir)?3:0)) - ((O.genres.has(a.genre)?2:0)+(O.dirs.has(a.dir)?3:0)))
      .slice(0, 18);
    openSheet(`
      <div class="step">Your taste · 3 of 3</div>
      <h1 class="h1" style="text-align:center;margin-top:12px">Tap a few you've seen and loved</h1>
      <p class="sub" style="text-align:center">They become your first ranked movies — first tap ranks highest. You can re-rank anytime.</p>
      <div class="pickgrid">${cands.map(m => `<button class="pcard" data-m="${m.id}">${posterHTML(m,"p-md")}<span class="pt">${esc(m.title)}</span></button>`).join("")}</div>
      <div class="obfoot"><button class="pillbtn acc" data-ob="done" style="padding:11px 22px">Finish setup</button><button class="pillbtn" data-ob="skip">Skip</button></div>${obDots(3)}`);
  }
}
/* the three onboarding pick-lists all behave the same: toggle membership in a
   Set on O, toggle the button's own selected style */
function obToggle(el, attr, set){
  const v = el.dataset[attr];
  set.has(v) ? set.delete(v) : set.add(v);
  el.classList.toggle("sel");
}
function obNav(v){
  if(v === "skip" || v === "done") finishOnboarding(v === "done");
  else obStep(+v);
}
function finishOnboarding(applyPicks){
  if(applyPicks || O.genres.size || O.dirs.size) S.taste = {genres:[...O.genres], dirs:[...O.dirs]};
  let added = 0;
  if(applyPicks){
    for(const id of O.movies){ if(!isRanked(id)){ S.loved.push(id); added++; } }
    for(const id of [...O.movies].reverse()){
      if(bucketOf(id) === "loved")
        S.myFeed.unshift({movie:id, score:scoreOf(id), time:"just now", note:"", likes:0, rank:rankOf(id)});
    }
    S.myFeed = S.myFeed.slice(0, 6);
  }
  S.onboarded = true;
  O = null;
  save(); closeSheet();
  nav(added ? "ranks" : "feed");
  toast(added ? `${added} movie${added>1?"s":""} on the board — welcome to Reeli 🎬` : "Welcome to Reeli 🎬");
}
let EDIT_P = null, EDIT_NEW = false; // the profile the edit sheet is editing
function openAccountForm(){
  const isNew = !S.profile;
  const P = S.profile || {name:"", handle:"@", hue:172};
  EDIT_P = P; EDIT_NEW = isNew; pickedHue = P.hue;
  openSheet(`
    <h1 class="h1">${isNew ? "Set up your profile" : "Edit profile"}</h1>
    ${isNew ? `<p class="sub">This personalizes your device. Real accounts with cloud sync are switching on shortly — your profile and rankings will carry over.</p>` : ""}
    <div style="display:grid;gap:10px;margin-top:10px">
      <input class="field" id="ename" aria-label="Display name" value="${esc(P.name)}" maxlength="24">
      <input class="field" id="ehandle" aria-label="Handle" value="${esc(P.handle)}" maxlength="20">
      <div class="swatches">${AVATAR_HUES.map(h => `<button class="swatch ${P.hue===h?"cur":""}" data-ehue="${h}" style="background:hsl(${h} 45% 45%)" aria-pressed="${P.hue===h}" aria-label="Avatar colour ${AVATAR_HUES.indexOf(h)+1} of ${AVATAR_HUES.length}"></button>`).join("")}</div>
      ${authed() && CLOUD.profile ? `<label class="pillbtn" style="text-align:center;cursor:pointer">📷 Upload profile photo<input id="pfpFile" type="file" accept="image/*" style="display:none"></label>` : ""}
      <div style="display:flex;gap:9px"><button class="pillbtn acc" id="esave">Save</button><button class="pillbtn" id="ecancel">Cancel</button></div>
    </div>`);
}
/* square-crop the chosen file to 256px, upload it, point the profile at it */
function uploadAvatar(pfp){
  const f = pfp.files[0]; if(!f) return;
  toast("Uploading…");
  const img = new Image();
  img.onload = () => {
    const c = document.createElement("canvas"); c.width = c.height = 256;
    const x = c.getContext("2d");
    const side = Math.min(img.width, img.height);
    x.drawImage(img, (img.width - side)/2, (img.height - side)/2, side, side, 0, 0, 256, 256);
    c.toBlob(async blob => {
      const r = await sb("/storage/v1/object/avatars/" + myId() + ".jpg",
        {method:"POST", headers:{"Content-Type":"image/jpeg", "x-upsert":"true"}, body: blob});
      if(!r.ok){ toast("Upload failed — run supabase-customize.sql first"); return; }
      const url = SUPA_URL + "/storage/v1/object/public/avatars/" + myId() + ".jpg?v=" + Date.now();
      await sb(pgPath("profiles", {id:pgEq(myId())}), {method:"PATCH", body: JSON.stringify({avatar_url: url})});
      CLOUD.profile.avatar_url = url;
      S.profile.avatarUrl = url; save();
      toast("Photo updated 📷"); closeSheet(); render(cur);
    }, "image/jpeg", .85);
    URL.revokeObjectURL(img.src);
  };
  img.src = URL.createObjectURL(f);
}
async function saveAccountForm(){
  const P = EDIT_P, isNew = EDIT_NEW, hue = pickedHue;
  if(!P) return;
  const name = $("#ename").value.trim() || P.name;
  if(!name){ $("#ename").focus(); $("#ename").placeholder = "Name — required"; return; }
  let handle = ($("#ehandle").value.trim().replace(/^@+/,"") || P.handle.slice(1) ||
    name.toLowerCase().replace(/[^a-z0-9]/g,"").slice(0,14) || "cinephile").toLowerCase();
  if(authed() && CLOUD.profile){
    if(!/^[a-z0-9_]{3,20}$/.test(handle)){ toast("Handle: 3–20 chars, letters/numbers/_"); return; }
    const r = await sb(pgPath("profiles", {id:pgEq(myId())}), {method:"PATCH",
      body: JSON.stringify({display_name:name, handle, avatar_hue:hue})});
    if(r.status === 409){ toast("That handle is taken"); return; }
    if(!r.ok){ toast("Couldn't save to the cloud — try again"); return; }
    CLOUD.profile.display_name = name; CLOUD.profile.handle = handle; CLOUD.profile.avatar_hue = hue;
  }
  S.profile = {...P, name, handle:"@"+handle, hue};
  save(); closeSheet(); renderProfile(); toast(isNew ? `Welcome, ${name} 🎬` : "Profile updated");
}

/* ---------- shared row actions ---------- */
function toggleWatch(id){
  if(S.watch.includes(id)){ S.watch = S.watch.filter(x=>x!==id); toast("Removed from watchlist"); }
  else { ensureSaved(id); S.watch.unshift(id); toast("Added to watchlist 🔖"); }
  save(); render(cur);
}
function removeFromWatch(id){
  S.watch = S.watch.filter(x => x !== id); save(); renderWatch(); toast("Removed from watchlist");
}
function toggleLocalLike(k){
  S.likes[k] = !S.likes[k]; if(!S.likes[k]) delete S.likes[k];
  save(); renderFeed();
}

/* ---------- Letterboxd import ----------
   Letterboxd's data export (letterboxd.com/settings/data) is a ZIP; the file
   we want is ratings.csv with columns Date,Name,Year,Letterboxd URI,Rating
   where Rating is 0.5–5.0. The user uploads that CSV directly. Two modes:
   auto (convert stars → buckets, instant list) or manual (rank each yourself). */
let LB_ROWS = null; // parsed rows awaiting a mode choice

/* minimal RFC-4180-ish CSV parser: handles quoted fields, embedded commas,
   and doubled "" escapes. Returns array of string arrays. */
function parseCSV(text){
  const rows = []; let row = [], field = "", i = 0, q = false;
  text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  while(i < text.length){
    const c = text[i];
    if(q){
      if(c === '"'){ if(text[i+1] === '"'){ field += '"'; i++; } else q = false; }
      else field += c;
    } else {
      if(c === '"') q = true;
      else if(c === ","){ row.push(field); field = ""; }
      else if(c === "\n"){ row.push(field); rows.push(row); row = []; field = ""; }
      else field += c;
    }
    i++;
  }
  if(field.length || row.length){ row.push(field); rows.push(row); }
  return rows;
}
function parseLetterboxdCSV(text){
  const rows = parseCSV(text).filter(r => r.length && r.some(c => c.trim()));
  if(!rows.length) return [];
  const head = rows[0].map(h => h.trim().toLowerCase());
  const iName = head.indexOf("name"), iYear = head.indexOf("year"), iRating = head.indexOf("rating");
  if(iName < 0) return []; // not a Letterboxd ratings export
  return rows.slice(1).map(r => ({
    name: (r[iName] || "").trim(),
    year: iYear >= 0 ? parseInt(r[iYear], 10) || null : null,
    rating: iRating >= 0 ? parseFloat(r[iRating]) : null, // 0.5–5.0, or NaN if unrated
  })).filter(x => x.name);
}
/* Letterboxd stars (0.5–5) → Reeli bucket. Mirrors the score thresholds. */
function lbBucket(stars){ return stars >= 3.5 ? "loved" : stars >= 2.5 ? "fine" : "disliked"; }

/* resolve one {name, year} to a rankable movie id, throttled. Uses the catalog
   (cineSearch + pickMeta from matching.js); on no match, mints a custom entry
   so nothing in the user's history is silently dropped. */
function lbResolve(item, cb){
  const want = item.name;
  cineSearch(want, metas => {
    let id = null;
    const hit = metas ? pickMeta(metas, want, item.year) : null;
    if(hit){
      id = hit.imdb_id || hit.id;
      if(!getMovie(id)) LIVE[id] = cineToMovie(hit);
      const tt = /^tt\d+$/.test(id) ? id : (hit.imdb_id || null);
      if(tt && !POSTERS.cache[id]){ POSTERS.cache[id] = {u: hit.poster || metahubPoster(tt), tt}; }
    } else {
      id = "c_lb_" + normT(want).replace(/\s+/g,"_") + "_" + (item.year||"");
      if(!getMovie(id)) S.custom.push({id, title:want, year:item.year||"—", genre:"", dir:"", hue:hueFromTitle(want), poster:null});
    }
    cb(id);
  });
}
/* run a throttled resolve over many items with a progress callback */
function lbResolveAll(items, onProgress, onDone){
  const out = []; let i = 0;
  const step = () => {
    if(i >= items.length){ savePosters(); onDone(out); return; }
    const item = items[i];
    lbResolve(item, id => {
      out.push({id, item});
      i++; onProgress(i, items.length);
      setTimeout(step, 140); // be gentle on the catalog API
    });
  };
  step();
}
function openLetterboxdImport(){
  openSheet(`
    <h1 class="h1">Import from Letterboxd</h1>
    <p class="sub">On Letterboxd, go to <b>Settings → Import &amp; Export → Export your data</b>. Unzip it and upload <b>ratings.csv</b> below.</p>
    <label class="pillbtn acc" style="text-align:center;cursor:pointer;display:block;padding:12px">
      Choose ratings.csv<input id="lbFile" type="file" accept=".csv,text/csv" style="display:none">
    </label>
    <div id="lbStatus" class="sub" style="margin-top:12px"></div>`);
}
function onLetterboxdFile(inp){
  const f = inp.files && inp.files[0];
  if(!f) return;
  const reader = new FileReader();
  reader.onload = () => {
    LB_ROWS = parseLetterboxdCSV(String(reader.result || ""));
    const rated = LB_ROWS.filter(r => r.rating && !isNaN(r.rating));
    const st = $("#lbStatus");
    if(!LB_ROWS.length){ if(st){ st.textContent = "That doesn't look like a Letterboxd ratings.csv — it needs a Name column."; } return; }
    const already = new Set([...DB, ...S.custom].map(m => normT(m.title)));
    if(st) st.innerHTML = `
      <div class="card" style="padding:14px;display:grid;gap:10px">
        <div><b>${LB_ROWS.length}</b> films found${rated.length < LB_ROWS.length ? ` (${rated.length} rated)` : ""}. How do you want to import?</div>
        <button class="pillbtn acc" id="lbAuto" style="padding:11px">Auto-rank from my Letterboxd ratings</button>
        <button class="pillbtn" id="lbManual" style="padding:11px">Rank them myself, one by one</button>
        <span class="d" style="color:var(--muted);font-size:11.5px">Auto places each film into loved / fine / not-for-me by its star rating and orders them. You can re-rank any of them later.</span>
      </div>`;
  };
  reader.onerror = () => { const st = $("#lbStatus"); if(st) st.textContent = "Couldn't read that file — try again."; };
  reader.readAsText(f);
}
function lbProgressUI(done, total){
  const st = $("#lbStatus");
  if(st) st.innerHTML = `<div class="card" style="padding:16px;text-align:center">
    <p style="margin:0 0 8px">Matching your films… <b>${done}/${total}</b></p>
    <div class="bar" style="height:10px;border-radius:6px;background:var(--surface2);overflow:hidden">
      <span style="display:block;height:100%;width:${Math.round(done/total*100)}%;background:var(--accent);border-radius:6px"></span></div>
    <p class="d" style="color:var(--muted);font-size:11.5px;margin:10px 0 0">Sit tight — large lists take a minute.</p></div>`;
}
function runLetterboxdAuto(){
  const rated = (LB_ROWS || []).filter(r => r.rating && !isNaN(r.rating));
  if(!rated.length){ const st=$("#lbStatus"); if(st) st.textContent="No star ratings found in that file to auto-rank from."; return; }
  // highest-rated first so within-bucket order (and derived scores) track the stars
  rated.sort((a,b) => b.rating - a.rating);
  lbProgressUI(0, rated.length);
  lbResolveAll(rated, lbProgressUI, resolved => {
    let added = 0;
    resolved.forEach(({id, item}) => {
      if(!id || isRanked(id)) return;
      const b = lbBucket(item.rating);
      S[b].push(id); // already sorted by rating desc, so append keeps that order
      S.watch = S.watch.filter(x => x !== id);
      added++;
    });
    save();
    closeSheet();
    toast(`Imported ${added} film${added===1?"":"s"} from Letterboxd 🎬`);
    nav("ranks");
    LB_ROWS = null;
  });
}
function runLetterboxdManual(){
  const items = LB_ROWS || [];
  if(!items.length) return;
  lbProgressUI(0, items.length);
  lbResolveAll(items, lbProgressUI, resolved => {
    S.lbQueue = resolved.map(r => r.id).filter(id => id && !isRanked(id));
    save();
    LB_ROWS = null;
    if(!S.lbQueue.length){ closeSheet(); toast("Everything in that file is already ranked"); return; }
    rankNextImport();
  });
}
/* how many imported films are still waiting to be ranked */
function lbRemaining(){ return (S.lbQueue || []).filter(id => !isRanked(id)).length; }
/* pull the next un-ranked film from the import queue and start its matchup */
function rankNextImport(){
  while(S.lbQueue && S.lbQueue.length && isRanked(S.lbQueue[0])) S.lbQueue.shift();
  if(!S.lbQueue || !S.lbQueue.length){ save(); closeSheet(); toast("Import complete — every film ranked 🎬"); nav("ranks"); return; }
  save();
  startRate(S.lbQueue[0]);
}

/* ---------- event delegation ----------
   Every screen and sheet is drawn by writing innerHTML, which throws away all
   the elements inside it. The old code re-queried and re-bound dozens of
   listeners after each of those writes — a per-render cost, and a listener leak
   for anything the browser hadn't collected yet.

   Instead: one listener per stable container (the five screen wrappers, the
   sheet, the gate), attached once at boot and never removed, and a table that
   maps the clicked element back to an action. The containers themselves are in
   index.html and are never replaced, so these listeners outlive every render.

   Handlers that used to close over per-render state don't any more. Anything
   the action needs is either carried in a data- attribute, or read back from
   module state that the opener set (SHEET_PERSON, PICK_MOVIE, PLACED_ID,
   detailId, AUTH_MODE, EDIT_P, pickedHue, SHARE). Nothing captures a snapshot
   of a list that a later render might contradict — CLOUD.follows and S are
   re-read at click time, which is what the follow buttons wanted all along. */

/* data-attribute routes. Only one of these ever appears on a given element, so
   the order is for determinism rather than precedence. Presence is tested with
   hasAttribute, not truthiness: data-gosearch, data-addcustom and the default
   data-acc="" are all valueless. */
const CLICK_ROUTES = [
  ["open",        el => openDetail(el.dataset.open)],
  ["rate",        el => startRate(el.dataset.rate)],
  ["watch",       el => toggleWatch(el.dataset.watch)],
  ["unwatch",     el => removeFromWatch(el.dataset.unwatch)],
  ["like",        el => toggleLocalLike(el.dataset.like)],
  ["clike",       el => { const [u, mv] = el.dataset.clike.split("|"); toggleCloudLike(u, mv, el); }],
  ["person",      el => openPerson(el.dataset.person)],
  ["notif",       el => openDetail(el.dataset.notif)],
  ["notifperson", el => openPerson(el.dataset.notifperson)],
  ["cperson",     el => openPerson(el.dataset.cperson)],
  ["pfollow",     el => toggleMate(el.dataset.pfollow)],
  ["gosearch",    () => { if(cur === "ranks") searchType = rankType; nav("search"); }],
  ["addcustom",   () => openCustom()],
  ["ftab",        el => { feedTab = el.dataset.ftab; renderFeed(); }],
  ["stype",       el => switchSearchType(el.dataset.stype)],
  ["rtype",       el => { rankType = el.dataset.rtype; rankGenre = ""; renderRanks(); }],
  ["filter",      el => { rankFilter = el.dataset.filter; renderRanks(); }],
  ["gfilter",     el => { rankGenre = rankGenre === el.dataset.gfilter ? "" : el.dataset.gfilter; renderRanks(); }],
  ["acc",         el => { S.ui.accent = el.dataset.acc === "" ? null : +el.dataset.acc; save(); applyUI(); renderProfile(); }],
  ["oauth",       el => startOauth(el.dataset.oauth)],
  ["chue",        el => pickHue(el, "chue")],
  ["ehue",        el => pickHue(el, "ehue")],
  ["g",           el => obToggle(el, "g", O.genres)],
  ["d",           el => obToggle(el, "d", O.dirs)],
  ["m",           el => obToggle(el, "m", O.movies)],
  ["ob",          el => obNav(el.dataset.ob)],
  ["b",           el => pickBucket(el.dataset.b)],
  ["pick",        el => answerMatchup(el.dataset.pick)],
  ["a",           el => detailAction(el.dataset.a)],
  ["wall",        el => pickWallpaper(el)],
  ["alertclose",  () => dismissAlert()],
];

/* one-off buttons a screen or sheet renders, keyed by the id they already had */
const CLICK_IDS = {
  // profile
  editBtn:        () => openAccountForm(),
  finishSetupBtn: () => openClaimHandle(),
  logoutBtn:      () => doLogout(),
  logoutBtn2:     () => doLogout(),
  tasteBtn:       () => { O = null; openOnboarding(1); },
  wallBtn:        () => openWallPicker(),
  signupBtn:      () => openAuthSheet("signup"),
  loginBtn:       () => openAuthSheet("login"),
  exportBtn:      () => exportBackup(),
  importBtn:      () => importBackup(),
  lbImportBtn:    () => openLetterboxdImport(),
  lbAuto:         () => runLetterboxdAuto(),
  lbManual:       () => runLetterboxdManual(),
  shareBtn:       () => shareTopFive(),
  resetBtn:       () => resetEverything(),
  shareProfBtn:   () => openShare("Check my movie taste on Reeli 🎬",
                      location.origin + location.pathname + "?u=" + encodeURIComponent(CLOUD.profile.handle)),
  // feed / watchlist
  inviteBtn:      () => copyInviteLink(),
  pickBtn:        () => pickTonight(),
  // entry gate
  gateSignup:     () => openAuthSheet("signup"),
  gateLogin:      () => openAuthSheet("login"),
  gateGuest:      () => continueAsGuest(),
  // auth sheet
  auswap:         () => openAuthSheet(AUTH_MODE === "signup" ? "login" : "signup"),
  ausubmit:       () => submitAuth(),
  aurescue:       () => resendConfirmation("Confirmation email sent 📬 — click the link, you'll be signed in here",
                      "Couldn't send — wait a minute and retry"),
  audone:         () => openAuthSheet("login"),
  auresend:       () => resendConfirmation("Confirmation email resent 📬", "Couldn't resend — wait a minute and try again"),
  // claim handle / edit profile
  chcancel:       () => { closeSheet(true); doLogout(); },
  chsave:         () => saveClaimedHandle(),
  ecancel:        () => closeSheet(),
  esave:          () => saveAccountForm(),
  // public profile sheet
  pfollow:        () => toggleSheetPerson(),
  pshare:         () => shareSheetPerson(),
  // tonight's pick
  pkSeen:         () => { if(PICK_MOVIE) startRate(PICK_MOVIE.id); },
  pkAgain:        () => { if(PICK_MOVIE) pickTonight(PICK_MOVIE.id); },
  pkClose:        () => closeSheet(),
  // add a movie manually
  csave:          () => saveCustomMovie(),
  ccancel:        () => closeSheet(),
  // ranking result
  doneBtn:        () => { commitTake(); closeSheet(); nav("ranks"); },
  moreBtn:        () => { commitTake(); if(S.lbQueue && S.lbQueue.length){ S.lbQueue = []; save(); } closeSheet(); nav("search"); },
  lbNext:         () => { commitTake(); rankNextImport(); },
  undoBtn:        () => undoPlacement(),
  // wallpaper picker
  wallOff:        () => { S.ui.wall = null; S.ui.wallTitle = null; save(); applyUI(); closeSheet(); renderProfile(); },
  wallDone:       () => { closeSheet(); if(cur === "profile") renderProfile(); },
  // share sheet
  shNative:       () => shareVia("native"),
  shX:            () => shareVia("x"),
  shFb:           () => shareVia("fb"),
  shCopy:         () => shareVia("copy"),
};

/* text inputs that react as you type, and the avatar file picker */
const INPUT_IDS = { q: el => onSearchInput(el), mq: el => onMateQueryInput(el) };
const CHANGE_IDS = { pfpFile: el => uploadAvatar(el), lbFile: el => onLetterboxdFile(el) };
/* pressing Enter in these fields submits the form they belong to (or, in the
   movie search box, skips the debounce and searches the catalog right now) */
const ENTER_IDS = { auemail: () => submitAuth(), aupass: () => submitAuth(),
                    chname: () => saveClaimedHandle(), chhandle: () => saveClaimedHandle(),
                    q: el => { const qq = el.value.trim(); if(!qq) return; clearTimeout(liveT); runLiveSearch(qq); } };

const CLICK_ROUTE_SEL = CLICK_ROUTES.map(([k]) => "[data-" + k + "]").join(",");
const CLICK_ID_SEL = Object.keys(CLICK_IDS).map(k => "#" + k).join(",");

function routeClick(e){
  const t = e.target;
  if(!t || !t.closest) return;
  /* nearest ancestor carrying a routed attribute wins, which is exactly what
     binding the listener to that element used to give us */
  const el = t.closest(CLICK_ROUTE_SEL);
  if(el){
    for(const [attr, fn] of CLICK_ROUTES)
      if(el.hasAttribute("data-" + attr)){ fn(el, e); return; }
  }
  const byId = t.closest(CLICK_ID_SEL);
  if(byId && CLICK_IDS[byId.id]) CLICK_IDS[byId.id](byId, e);
}
function routeInput(e){ const fn = INPUT_IDS[e.target && e.target.id]; if(fn) fn(e.target, e); }
function routeChange(e){ const fn = CHANGE_IDS[e.target && e.target.id]; if(fn) fn(e.target, e); }
function routeKeydown(e){
  if(e.key !== "Enter") return;
  const fn = ENTER_IDS[e.target && e.target.id];
  if(fn) fn(e.target, e);
}
/* the containers below live in index.html and are never replaced — only their
   innerHTML changes — so these listeners are attached exactly once, ever */
const DELEGATE_ROOTS = ["#feedWrap", "#ranksWrap", "#searchWrap", "#watchWrap", "#profileWrap", "#sheet", "#gate", "#alert"];
function attachDelegates(){
  for(const sel of DELEGATE_ROOTS){
    const root = $(sel);
    if(!root){ logErr("delegating events on " + sel + " (element missing)", null); continue; }
    root.addEventListener("click", routeClick);
    root.addEventListener("input", routeInput);
    root.addEventListener("change", routeChange);
    root.addEventListener("keydown", routeKeydown);
  }
}

/* ---------- overlay ----------
   The sheet is a modal dialog, so it owes the keyboard three things it did not
   used to provide: focus moves into it on open, Tab cycles within it instead of
   walking the page behind it, and focus returns to whatever opened it on close.
   Escape already dismissed it; that stays, and still respects `locked` sheets
   (onboarding, handle claim) which must be completed rather than escaped. */
const overlay = $("#overlay"), sheet = $("#sheet");
let sheetLocked = false;
let sheetOpener = null;   // the element focus came from, to hand it back
const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';
function focusablesIn(root){
  return [...root.querySelectorAll(FOCUSABLE)].filter(el => el.offsetParent !== null || el === document.activeElement);
}
function openSheet(html, locked){
  // only remember the opener for the outermost sheet: re-rendering an open
  // sheet (openDetail does this when enrichment lands) must not make the sheet
  // itself the thing focus returns to
  if(!overlay.classList.contains("on")) sheetOpener = document.activeElement;
  sheetLocked = !!locked;
  sheet.innerHTML = (locked ? "" : `<div class="grab" aria-hidden="true"></div>`) + html;
  overlay.classList.add("on");
  hydratePosters(sheet);
  const first = focusablesIn(sheet)[0];
  if(first) first.focus();
  else { sheet.setAttribute("tabindex", "-1"); sheet.focus(); }
}
function closeSheet(force){
  if(sheetLocked && !force) return;
  sheetLocked = false;
  overlay.classList.remove("on");
  sheet.innerHTML = "";
  sheet.removeAttribute("tabindex");
  const back = sheetOpener;
  sheetOpener = null;
  // the opener is often inside markup a re-render has since replaced, so only
  // restore focus if it is still connected to the document
  if(back && back.isConnected && typeof back.focus === "function") back.focus();
}
overlay.addEventListener("click", e => { if(e.target === overlay) closeSheet(); });
/* Tab containment. Only while the sheet is open, and only for Tab — every other
   key keeps its normal behaviour, including the Enter routes in ENTER_IDS. */
function trapTab(e){
  if(e.key !== "Tab" || !overlay.classList.contains("on")) return;
  const f = focusablesIn(sheet);
  if(!f.length){ e.preventDefault(); return; }
  const first = f[0], last = f[f.length - 1];
  if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
  else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  else if(!sheet.contains(document.activeElement)){ e.preventDefault(); first.focus(); }
}
document.addEventListener("keydown", e => {
  if(e.key === "Escape"){ closeSheet(); return; }
  trapTab(e);
});

/* ---------- movie detail ---------- */
let detailId = null;
function openDetail(id){
  const m = getMovie(id); if(!m) return;
  detailId = id;
  const ranked = isRanked(id), inWatch = S.watch.includes(id);
  enrich(id, ok => { if(ok && detailId === id && overlay.classList.contains("on")) openDetail(id); });
  openSheet(`
    <div class="dhead">
      ${posterHTML(m,"p-lg")}
      <div class="meta">
        <h2>${esc(m.title)}</h2>
        <div class="d">${esc([m.year, m.genre].filter(x => x && x !== "—").join(" · "))}${m.dir && m.dir !== "—" ? `<br>Directed by ${esc(m.dir)}` : ""}
          ${m.runtime ? ` · ${esc(m.runtime)}` : ""}${m.imdb ? `<br>★ ${esc(m.imdb)} on IMDb` : ""}</div>
        ${ranked ? `<div style="display:flex;align-items:center;gap:10px;margin-top:12px">
          ${scoreHTML(scoreOf(id))}<div class="d" style="font-size:12.5px">#${rankOf(id)} of ${allRanked(typeOf(id)).length}<br>on your list</div></div>` : ""}
      </div>
    </div>
    ${m.desc ? `<p class="sub" style="margin:0 0 14px">${esc(m.desc)}</p>`
      : !m.enriched ? `<p class="sub" style="margin:0 0 14px;opacity:.6">Loading details…</p>` : ""}
    ${ranked && S.notes[id] ? `<p class="fnote" style="margin:0 0 12px">“${esc(S.notes[id])}” — you</p>` : ""}
    <div class="dactions">
      ${ranked
        ? `<button class="pillbtn acc" data-a="rerate">Re-rank</button>
           <button class="pillbtn" data-a="take">${S.notes[id] ? "✍ Edit take" : "✍ Hot take"}</button>
           <button class="pillbtn" data-a="unrank">Remove ranking</button>`
        : `<button class="pillbtn acc" data-a="rate">Rank it</button>
           <button class="pillbtn ${inWatch?"soft":""}" data-a="watch">${inWatch ? "On watchlist ✓" : "+ Watchlist"}</button>`}
      <button class="pillbtn" data-a="close">Close</button>
    </div>
    <div id="commWrap"></div>`);
  if(BACKEND.enabled) loadCommunityScores(id);
}
/* the detail sheet's action bar. detailId is the movie the sheet is showing,
   so the buttons no longer need to capture it. */
function detailAction(a){
  const id = detailId;
  if(!id) return;
  if(a === "close") closeSheet();
  else if(a === "rate" || a === "rerate"){ startRate(id); }
  else if(a === "take"){
    const v = prompt("Your hot take (up to 280 characters):", S.notes[id] || "");
    if(v === null) return;
    const t = v.trim().slice(0, 280);
    if(t) S.notes[id] = t; else delete S.notes[id];
    const fe = S.myFeed.find(f => f.movie === id); if(fe) fe.note = t;
    save(); openDetail(id); toast(t ? "Take saved ✍" : "Take removed");
  }
  else if(a === "unrank"){ removeRanking(id); delete S.notes[id]; save(); closeSheet(); render(cur); toast("Ranking removed"); }
  else if(a === "watch"){
    if(S.watch.includes(id)){ S.watch = S.watch.filter(x=>x!==id); } else { ensureSaved(id); S.watch.unshift(id); toast("Added to watchlist 🔖"); }
    save(); openDetail(id); render(cur);
  }
}

/* ---------- custom add ---------- */
function openCustom(){
  openSheet(`
    <h1 class="h1">Add ${esc(typeNounA(searchType))}</h1>
    <p class="sub">It joins your personal database and is ready to rank.</p>
    <div style="display:grid;gap:10px">
      <input id="ctitle" aria-label="Title" placeholder="Title" style="padding:12px 14px;border-radius:12px;border:1px solid var(--line);background:var(--surface);color:var(--ink);font-size:15px">
      <input id="cyear" aria-label="Year" placeholder="Year" inputmode="numeric" maxlength="4" style="padding:12px 14px;border-radius:12px;border:1px solid var(--line);background:var(--surface);color:var(--ink);font-size:15px">
      <input id="cgenre" aria-label="Genre (optional)" placeholder="Genre (optional)" style="padding:12px 14px;border-radius:12px;border:1px solid var(--line);background:var(--surface);color:var(--ink);font-size:15px">
      <div style="display:flex;gap:9px;margin-top:4px">
        <button class="pillbtn acc" id="csave">Add &amp; rank</button>
        <button class="pillbtn" id="ccancel">Cancel</button>
      </div>
    </div>`);
}
function saveCustomMovie(){
  const t = $("#ctitle").value.trim();
  if(!t){ $("#ctitle").focus(); return; }
  const y = parseInt($("#cyear").value,10);
  const m = {id:"c_"+Date.now(), title:t, year:(y>=1888 && y<=2030)?y:"—", genre:$("#cgenre").value.trim()||"Film", dir:"—", hue:hueFromTitle(t)};
  if(searchType === "show" || searchType === "anime") m.kind = searchType;
  S.custom.push(m); save();
  startRate(m.id);
}

/* ---------- rating flow ----------
   The binary-search insertion itself lives in ranking.js — pure, DOM-free and
   covered by test-ranking.mjs. Everything here is the sheet UI wrapped around
   it: R carries {id, bucket, mid} plus the {lo, hi, n} search state that
   ranking.js owns and mutates. */
let R = null;
function startRate(id){
  const m = getMovie(id); if(!m) return;
  R = {id};
  openSheet(`
    <div class="step">Step 1 of 2</div>
    <div style="display:flex;flex-direction:column;align-items:center;gap:10px;margin:16px 0 4px">
      ${posterHTML(m,"p-lg")}
      <h1 class="h1" style="text-align:center;margin:2px 0 0">${esc(m.title)}</h1>
      <p class="sub" style="text-align:center;margin:0">How was it?</p>
    </div>
    <div class="buckets">
      <button class="bucket" data-b="loved"><span class="dot" style="background:var(--good-soft)">
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--good)" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M8.5 14.5c1 1.3 2.2 2 3.5 2s2.5-.7 3.5-2"/><path d="M9 9.6h.01M15 9.6h.01" stroke-width="2.6"/></svg></span>
        <span><b>Loved it</b><span>The kind you tell people about</span></span></button>
      <button class="bucket" data-b="fine"><span class="dot" style="background:var(--mid-soft)">
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--mid)" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M8.5 15h7"/><path d="M9 9.6h.01M15 9.6h.01" stroke-width="2.6"/></svg></span>
        <span><b>It was fine</b><span>Watchable. Forgettable. Fine.</span></span></button>
      <button class="bucket" data-b="disliked"><span class="dot" style="background:var(--bad-soft)">
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--bad)" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M8.5 16c1-1.3 2.2-2 3.5-2s2.5.7 3.5 2"/><path d="M9 9.6h.01M15 9.6h.01" stroke-width="2.6"/></svg></span>
        <span><b>Not for me</b><span>Two hours you want back</span></span></button>
    </div>`);
}
/* the movies R.id competes against: only ever its own pool (movie/show/anime)
   within the chosen bucket — a movie is never matched up against a show */
function rivals(){ return rankedIndex(R.type).arrs[R.bucket]; }
function pickBucket(bucket){
  removeRanking(R.id); // re-rank support
  R.bucket = bucket;
  R.type = typeOf(R.id);
  Object.assign(R, rankInit(rivals().length));
  stepCompare();
}
/* one turn of the crank: ask ranking.js what comes next, then either place the
   movie or render the matchup it asked for */
function stepCompare(){
  const arr = rivals();
  const step = rankStep(R, i => getMovie(arr[i]));
  if(step.type === "place"){ placeAt(step.index); return; }
  R.mid = step.mid; // the delegated [data-pick] handler reads this back
  renderMatchup(step);
}
/* the head-to-head sheet — presentation only; the answer goes straight back to
   ranking.js via rankChoose (see the delegated [data-pick] route) */
function renderMatchup(step){
  const arr = rivals();
  const a = getMovie(R.id), b = getMovie(arr[step.mid]);
  const total = arr.length;
  const left = step.remaining;
  const feel = R.bucket === "loved" ? "loved" : R.bucket === "fine" ? "found fine" : "didn't like";
  openSheet(`
    <div class="step">Matchup ${step.n} · ${left ? "about " + left + " more after this" : "last one"} · ${total} ${typeNoun(R.type, total)} you ${feel}</div>
    <h1 class="h1" style="text-align:center;margin-top:14px">Which did you like more?</h1>
    <div class="faceoff">
      <button class="contender" data-pick="new">${posterHTML(a,"p-md")}<span class="t">${esc(a.title)}</span><span class="d">${a.year}</span></button>
      <span class="vs">VS</span>
      <button class="contender" data-pick="old">${posterHTML(b,"p-md")}<span class="t">${esc(b.title)}</span><span class="d">${b.year}</span></button>
    </div>
    <button class="tiebtn" data-pick="tie">Too close to call</button>
    <span class="kbdhint"><b>←</b> left wins · <b>→</b> right wins · <b>T</b> too close</span>`);
}
/* the user answered the matchup at R.mid */
function answerMatchup(choice){
  if(!R || R.mid === undefined) return;
  const verdict = rankChoose(R, R.mid, choice);
  if(verdict) placeAt(verdict.index); else stepCompare();
}
/* idx is a position within rivals() (same-type items only) — translate it to
   the real splice index in the full, mixed-type S[bucket] array */
function realSpliceIndex(idx){
  const arr = S[R.bucket], typed = rivals();
  if(idx >= typed.length) return typed.length ? arr.lastIndexOf(typed[typed.length - 1]) + 1 : arr.length;
  return arr.indexOf(typed[idx]);
}
function placeAt(idx){
  ensureSaved(R.id);
  SYNC_TOUCH = R.id;
  S[R.bucket].splice(realSpliceIndex(idx), 0, R.id);
  S.watch = S.watch.filter(x => x !== R.id);
  const m = getMovie(R.id), sc = scoreOf(R.id), rk = rankOf(R.id);
  // store a real timestamp; the feed renders it relative ("2h", "yesterday")
  // so an item ranked days ago never keeps saying "just now"
  S.myFeed.unshift({movie:R.id, score:sc, ts: new Date().toISOString(), note:"", likes:0, rank:rk});
  if(S.myFeed.length > 6) S.myFeed.pop();
  save();
  // catalog movies arrive without genre/director — backfill so lists show them
  enrich(R.id, ok => { if(ok){ save(); if(cur === "ranks") renderRanks(); } });
  openSheet(`
    <div class="result">
      ${posterHTML(m,"p-lg")}
      <h2>${esc(m.title)}</h2>
      ${scoreHTML(sc,"bigscore")}
      <p>Locked in at <b>#${rk}</b> of ${allRanked(R.type).length} on your list.<br>Scores shift as your ranking grows — that's the fun part.</p>
      <input class="field" id="takeInp" aria-label="Your hot take about this movie (optional)" placeholder="Add a hot take (optional) — your Reelmates will see it" maxlength="280" style="width:100%">
      <div style="display:flex;gap:9px;margin-top:6px;flex-wrap:wrap;justify-content:center">
        ${lbRemaining() ? `<button class="pillbtn acc" id="lbNext">Next import (${lbRemaining()} left)</button>` : `<button class="pillbtn acc" id="doneBtn">See my ranking</button>`}
        <button class="pillbtn" id="moreBtn">${lbRemaining() ? "Stop importing" : "Rank another"}</button>
        <button class="pillbtn" id="undoBtn">Undo</button>
      </div>
    </div>`);
  PLACED_ID = R.id;
  R = null;
}
/* the movie the result sheet is about — R is cleared as soon as it opens, so
   Done / Rank another / Undo read this instead */
let PLACED_ID = null;
/* the hot-take box is optional and unsubmitted; harvest it before leaving */
function commitTake(){
  const inp = $("#takeInp");
  const v = inp ? inp.value.trim().slice(0, 280) : "";
  if(v && PLACED_ID){
    S.notes[PLACED_ID] = v;
    if(S.myFeed[0] && S.myFeed[0].movie === PLACED_ID) S.myFeed[0].note = v;
    save();
  }
}
function undoPlacement(){
  if(!PLACED_ID) return;
  removeRanking(PLACED_ID);
  delete S.notes[PLACED_ID];
  if(S.myFeed.length && S.myFeed[0].movie === PLACED_ID) S.myFeed.shift();
  save(); closeSheet(); render(cur); toast("Ranking undone");
}

/* ---------- personalization: accent color + movie-scene wallpaper ---------- */
const ACCENTS = [ ["Reeli teal", null], ["Velvet red", 355], ["Marquee gold", 42], ["Midnight blue", 218], ["Neon violet", 275], ["Matcha", 105] ];
function applyUI(){
  const r = document.documentElement.style;
  if(S.ui.accent != null){
    r.setProperty("--accent", `hsl(${S.ui.accent} 60% 44%)`);
    r.setProperty("--accent-soft", `hsla(${S.ui.accent}, 60%, 44%, .16)`);
    r.setProperty("--on-accent", "#fff");
  } else { r.removeProperty("--accent"); r.removeProperty("--accent-soft"); r.removeProperty("--on-accent"); }
  if(S.ui.wall) r.setProperty("--wall", `url("https://images.metahub.space/background/medium/${S.ui.wall}/img")`);
  else r.removeProperty("--wall");
}
function openWallPicker(){
  const cands = [...new Set([...allRanked(), ...S.watch])]
    .map(id => ({id, m:getMovie(id), tt: /^tt\d+$/.test(id) ? id : (cacheEntry(id) || {}).tt}))
    .filter(x => x.m && x.tt).slice(0, 24);
  openSheet(`
    <h1 class="h1">Scene wallpaper</h1>
    <p class="sub">Pick a movie from your list — its backdrop becomes your app wallpaper.</p>
    ${cands.length ? `<div class="pickgrid">${cands.map(x => `<button class="pcard ${S.ui.wall===x.tt?"sel":""}" data-wall="${x.tt}" data-wt="${esc(x.m.title)}">${posterHTML(x.m,"p-md")}<span class="pt">${esc(x.m.title)}</span></button>`).join("")}</div>`
      : `<div class="empty"><p>Rank or watchlist some movies first — their backdrops become wallpaper options.</p></div>`}
    <div class="obfoot"><button class="pillbtn" id="wallOff">No wallpaper</button><button class="pillbtn acc" id="wallDone">Done</button></div>`);
}
function pickWallpaper(el){
  S.ui.wall = el.dataset.wall; S.ui.wallTitle = el.dataset.wt;
  save(); applyUI();
  sheet.querySelectorAll(".pcard").forEach(c => c.classList.toggle("sel", c.dataset.wall === S.ui.wall));
}

/* ---------- share sheet: native share + platform intents ---------- */
let SHARE = null; // what the open share sheet is sharing
function openShare(text, url){
  SHARE = {text, url};
  openSheet(`
    <h1 class="h1">Share</h1>
    <p class="sub" style="word-break:break-all">${esc(text)}<br><b>${esc(url)}</b></p>
    <div style="display:grid;gap:9px">
      ${navigator.share ? `<button class="pillbtn acc" id="shNative" style="padding:12px">Share…</button>` : ""}
      <button class="pillbtn" id="shX" style="padding:12px">Post to X</button>
      <button class="pillbtn" id="shFb" style="padding:12px">Share to Facebook</button>
      <button class="pillbtn" id="shCopy" style="padding:12px">Copy link</button>
    </div>
    <p class="authnote">Discord/iMessage/WhatsApp: paste the link — it unfurls with the Reeli card.</p>`);
}
function shareVia(where){
  if(!SHARE) return;
  const enc = encodeURIComponent, {text, url} = SHARE;
  if(where === "native") navigator.share({title:"Reeli", text, url}).catch(() => {});
  else if(where === "x") window.open("https://twitter.com/intent/tweet?text=" + enc(text) + "&url=" + enc(url), "_blank", "noopener");
  else if(where === "fb") window.open("https://www.facebook.com/sharer/sharer.php?u=" + enc(url), "_blank", "noopener");
  else if(where === "copy" && navigator.clipboard && navigator.clipboard.writeText)
    navigator.clipboard.writeText(url).then(() => toast("Link copied"), () => toast(url));
}

/* ---------- theme toggle: auto → light → dark ---------- */
const THEME_KEY = "reeli-theme";
const THEME_ICON = {auto:"◐", light:"☀", dark:"☾"};
function applyTheme(v){
  if(v === "light" || v === "dark") document.documentElement.dataset.theme = v;
  else delete document.documentElement.dataset.theme;
  const b = $("#themeBtn");
  b.textContent = THEME_ICON[v] || THEME_ICON.auto;
  b.title = "Theme: " + v;
}
let themeMode = localStorage.getItem(THEME_KEY) || "auto";
applyTheme(themeMode);
applyUI();
$("#themeBtn").addEventListener("click", () => {
  themeMode = themeMode === "auto" ? "light" : themeMode === "light" ? "dark" : "auto";
  try{ localStorage.setItem(THEME_KEY, themeMode); }catch(e){ logErr("saving the theme preference", e); }
  applyTheme(themeMode);
  toast("Theme: " + themeMode);
});
$("#notifBtn").addEventListener("click", openNotifications);

/* ---------- keyboard shortcuts ---------- */
document.addEventListener("keydown", e => {
  const tag = (e.target.tagName || "").toLowerCase();
  if(tag === "input" || tag === "textarea") return;
  if(overlay.classList.contains("on")){
    if(!sheet.querySelector('[data-pick="new"]')) return;
    const pick = k => { const el = sheet.querySelector(`[data-pick="${k}"]`); if(el){ el.click(); e.preventDefault(); } };
    if(e.key === "ArrowLeft") pick("new");
    else if(e.key === "ArrowRight") pick("old");
    else if(e.key.toLowerCase() === "t") pick("tie");
    return;
  }
  if(e.key === "/"){
    if(cur !== "search") nav("search");
    const q = $("#q"); if(q){ q.focus(); e.preventDefault(); }
  }
});

/* ---------- boot ---------- */
// service worker: always-fresh app when online, last good copy offline
if("serviceWorker" in navigator && location.protocol === "https:"){
  navigator.serviceWorker.register("sw.js").catch(e => logErr("service worker registration", e));
}
// coming back online: push pending changes, refresh the social feed
window.addEventListener("online", () => {
  announce("Back online");
  dismissAlert();
  ALERTED.delete("offline");        // let the next genuine outage speak again
  ALERTED.delete("sync-failed");
  queueSync();
  if(authed()) refreshCloudFeed();
});
window.addEventListener("offline", () => {
  announce("Offline — Reeli keeps working; changes sync when you reconnect");
  showAlert("You're offline. Rankings and your watchlist still work — they'll sync when you reconnect.", "offline");
});
attachDelegates();
S.watch = S.watch.filter(id => getMovie(id));
updateBadge();
nav("feed");
/* A sync that never completed in an earlier session (tab closed while offline)
   is only remembered by the flag in localStorage — nothing else would ever
   retry it, so kick it here once the app is up. */
if(SYNC_PENDING && !isOffline()) queueSync();
if(isOffline()) showAlert("You're offline. Rankings and your watchlist still work — they'll sync when you reconnect.", "offline");
/* Email links (confirmation, magic, recovery) land back here with tokens in
   the URL fragment — pick them up and complete the sign-in. Runs at boot and
   again on hashchange in case the fragment arrives after load. */
async function handleAuthHash(){
  const h = new URLSearchParams((location.hash || "").replace(/^#/, ""));
  if(h.get("error_description")){
    history.replaceState(null, "", location.pathname + location.search);
    setTimeout(() => toast(h.get("error_description")), 500);
    return "error";
  }
  if(h.get("access_token")){
    saveAuth({access_token: h.get("access_token"), refresh_token: h.get("refresh_token"),
      expires_at: Math.floor(Date.now()/1000) + (parseInt(h.get("expires_in"),10) || 3600), user: null});
    history.replaceState(null, "", location.pathname + location.search);
    try{
      const r = await fetch(SUPA_URL + "/auth/v1/user",
        {headers:{apikey:SUPA_KEY, Authorization:"Bearer " + AUTH.access_token}});
      if(r.ok){ AUTH.user = await r.json(); saveAuth(AUTH); toast("Email confirmed ✓"); return "token"; }
      saveAuth(null);
    }catch(e){ logErr("completing sign-in from the email link", e); saveAuth(null); }
  }
  return null;
}
async function enterSignedIn(){
  hideGate();
  await pullCloud();
  if(authed() && !CLOUD.profile && CLOUD.profileLoaded) openClaimHandle();
  else if(authed() && !CLOUD.profile) retryProfile();
  else if(!S.onboarded) openOnboarding(0);
  else render(cur);
}
window.addEventListener("hashchange", async () => {
  if(await handleAuthHash() === "token") enterSignedIn();
});
(async () => {
  await handleAuthHash();
  if(authed()){
    enterSignedIn();
  } else if(!S.guestChosen){
    showGate();
  } else if(!S.onboarded){
    openOnboarding(0);
  }
  // shared profile links: reeli/?u=handle opens that person's profile
  const shareU = new URLSearchParams(location.search).get("u");
  if(shareU && BACKEND.enabled){
    sb(pgPath("profiles", {handle:pgEq(shareU.toLowerCase().replace(/^@+/, "")), select:"id"}))
      .then(r => r.ok ? r.json() : []).then(rows => { if(rows[0]) openPerson(rows[0].id); })
      .catch(e => logErr("shared profile link lookup", e));
  }
})();
