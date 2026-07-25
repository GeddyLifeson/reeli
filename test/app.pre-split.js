/* FROZEN BASELINE — not part of the app, never loaded by index.html.
 *
 * This is a verbatim copy of the single inline <script> that made up all of
 * Reeli up to build 2026.07.24-22, before it was split into posters.js /
 * ranking.js / matching.js / app.js. test/render-diff.mjs loads it into its own
 * vm context alongside the current build and compares the HTML both produce, so
 * the refactor is provably output-preserving rather than merely plausible.
 *
 * When a future change is MEANT to alter the markup, refresh this file from the
 * commit before that change (or retire render-diff.mjs) — do not silently relax
 * the comparison.
 */

'use strict';
const BUILD = "2026.07.24-22"; // bump on every deploy — shown on the Profile screen
/* ---------- movie database: [id, title, year, genre, director, hue] ---------- */
const DB = [
  ["godfather","The Godfather",1972,"Crime","Francis Ford Coppola",28],
  ["shawshank","The Shawshank Redemption",1994,"Drama","Frank Darabont",210],
  ["darkknight","The Dark Knight",2008,"Action","Christopher Nolan",230],
  ["pulpfiction","Pulp Fiction",1994,"Crime","Quentin Tarantino",45],
  ["parasite","Parasite",2019,"Thriller","Bong Joon-ho",150],
  ["spiritedaway","Spirited Away",2001,"Animation","Hayao Miyazaki",0],
  ["interstellar","Interstellar",2014,"Sci-Fi","Christopher Nolan",255],
  ["inception","Inception",2010,"Sci-Fi","Christopher Nolan",215],
  ["goodfellas","Goodfellas",1990,"Crime","Martin Scorsese",350],
  ["fightclub","Fight Club",1999,"Drama","David Fincher",330],
  ["matrix","The Matrix",1999,"Sci-Fi","The Wachowskis",130],
  ["forrestgump","Forrest Gump",1994,"Drama","Robert Zemeckis",95],
  ["seven","Se7en",1995,"Thriller","David Fincher",25],
  ["silence","The Silence of the Lambs",1991,"Thriller","Jonathan Demme",10],
  ["gladiator","Gladiator",2000,"Action","Ridley Scott",35],
  ["departed","The Departed",2006,"Crime","Martin Scorsese",200],
  ["whiplash","Whiplash",2014,"Drama","Damien Chazelle",40],
  ["prestige","The Prestige",2006,"Mystery","Christopher Nolan",260],
  ["lionking","The Lion King",1994,"Animation","Rob Minkoff",30],
  ["backfuture","Back to the Future",1985,"Sci-Fi","Robert Zemeckis",190],
  ["lotr1","The Fellowship of the Ring",2001,"Fantasy","Peter Jackson",110],
  ["lotr3","The Return of the King",2003,"Fantasy","Peter Jackson",50],
  ["starwars4","Star Wars: A New Hope",1977,"Sci-Fi","George Lucas",48],
  ["empire","The Empire Strikes Back",1980,"Sci-Fi","Irvin Kershner",220],
  ["jurassic","Jurassic Park",1993,"Adventure","Steven Spielberg",120],
  ["titanic","Titanic",1997,"Romance","James Cameron",205],
  ["avatar","Avatar",2009,"Sci-Fi","James Cameron",175],
  ["casablanca","Casablanca",1942,"Romance","Michael Curtiz",42],
  ["psycho","Psycho",1960,"Horror","Alfred Hitchcock",0],
  ["rearwindow","Rear Window",1954,"Mystery","Alfred Hitchcock",160],
  ["citizenkane","Citizen Kane",1941,"Drama","Orson Welles",38],
  ["taxidriver","Taxi Driver",1976,"Drama","Martin Scorsese",52],
  ["apocalypse","Apocalypse Now",1979,"War","Francis Ford Coppola",18],
  ["alien","Alien",1979,"Horror","Ridley Scott",140],
  ["blade","Blade Runner",1982,"Sci-Fi","Ridley Scott",280],
  ["blade2049","Blade Runner 2049",2017,"Sci-Fi","Denis Villeneuve",22],
  ["dune","Dune: Part One",2021,"Sci-Fi","Denis Villeneuve",33],
  ["dune2","Dune: Part Two",2024,"Sci-Fi","Denis Villeneuve",20],
  ["oppenheimer","Oppenheimer",2023,"Drama","Christopher Nolan",15],
  ["barbie","Barbie",2023,"Comedy","Greta Gerwig",320],
  ["eeaao","Everything Everywhere All at Once",2022,"Sci-Fi","Daniels",300],
  ["nocountry","No Country for Old Men",2007,"Thriller","Coen Brothers",36],
  ["fargo","Fargo",1996,"Crime","Coen Brothers",195],
  ["lebowski","The Big Lebowski",1998,"Comedy","Coen Brothers",85],
  ["grandbudapest","The Grand Budapest Hotel",2014,"Comedy","Wes Anderson",340],
  ["moonrise","Moonrise Kingdom",2012,"Comedy","Wes Anderson",55],
  ["amelie","Amélie",2001,"Romance","Jean-Pierre Jeunet",100],
  ["oldboy","Oldboy",2003,"Thriller","Park Chan-wook",15],
  ["cityofgod","City of God",2002,"Crime","Fernando Meirelles",43],
  ["panslabyrinth","Pan's Labyrinth",2006,"Fantasy","Guillermo del Toro",115],
  ["princessmono","Princess Mononoke",1997,"Animation","Hayao Miyazaki",145],
  ["totoro","My Neighbor Totoro",1988,"Animation","Hayao Miyazaki",125],
  ["wall-e","WALL·E",2008,"Animation","Andrew Stanton",185],
  ["up","Up",2009,"Animation","Pete Docter",290],
  ["insideout","Inside Out",2015,"Animation","Pete Docter",58],
  ["cocomovie","Coco",2017,"Animation","Lee Unkrich",25],
  ["spiderverse","Into the Spider-Verse",2018,"Animation","Persichetti / Ramsey / Rothman",335],
  ["getout","Get Out",2017,"Horror","Jordan Peele",165],
  ["hereditary","Hereditary",2018,"Horror","Ari Aster",8],
  ["shining","The Shining",1980,"Horror","Stanley Kubrick",355],
  ["2001space","2001: A Space Odyssey",1968,"Sci-Fi","Stanley Kubrick",235],
  ["clockwork","A Clockwork Orange",1971,"Drama","Stanley Kubrick",30],
  ["madmax","Mad Max: Fury Road",2015,"Action","George Miller",24],
  ["johnwick","John Wick",2014,"Action","Chad Stahelski",250],
  ["heat","Heat",1995,"Crime","Michael Mann",212],
  ["drive","Drive",2011,"Thriller","Nicolas Winding Refn",315],
  ["lalaland","La La Land",2016,"Romance","Damien Chazelle",265],
  ["her","Her",2013,"Romance","Spike Jonze",5],
  ["socialnetwork","The Social Network",2010,"Drama","David Fincher",208],
  ["truman","The Truman Show",1998,"Drama","Peter Weir",188],
  ["etern","Eternal Sunshine of the Spotless Mind",2004,"Romance","Michel Gondry",170],
  ["killbill","Kill Bill: Vol. 1",2003,"Action","Quentin Tarantino",50],
  ["django","Django Unchained",2012,"Western","Quentin Tarantino",32],
  ["inglourious","Inglourious Basterds",2009,"War","Quentin Tarantino",12],
  ["saving","Saving Private Ryan",1998,"War","Steven Spielberg",78],
  ["schindler","Schindler's List",1993,"Drama","Steven Spielberg",0],
  ["memento","Memento",2000,"Mystery","Christopher Nolan",192],
  ["arrival","Arrival",2016,"Sci-Fi","Denis Villeneuve",198],
  ["knivesout","Knives Out",2019,"Mystery","Rian Johnson",352],
  ["challengers","Challengers",2024,"Drama","Luca Guadagnino",88],
];
const MOVIES = {};
DB.forEach(a => MOVIES[a[0]] = {id:a[0], title:a[1], year:a[2], genre:a[3], dir:a[4], hue:a[5]});

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
}

function getMovie(id){
  if(MOVIES[id]) return MOVIES[id];
  if(LIVE[id]) return LIVE[id];
  return S.custom.find(m => m.id === id) || null;
}
/* persist a live-search movie into the user's personal DB so it survives reloads */
function ensureSaved(id){
  if(MOVIES[id]) return;
  if(S.custom.some(m => m.id === id)) return;
  if(LIVE[id]) S.custom.push(LIVE[id]);
}
function allRanked(){ return [...S.loved, ...S.fine, ...S.disliked]; }
function isRanked(id){ return allRanked().includes(id); }
function bucketOf(id){ for(const b of ["loved","fine","disliked"]) if(S[b].includes(id)) return b; return null; }
function scoreOf(id){
  const b = bucketOf(id); if(!b) return null;
  const arr = S[b], i = arr.indexOf(id), {hi,lo} = BUCKETS[b];
  return Math.round((hi - (hi-lo)*(i+1)/(arr.length+1))*10)/10;
}
function rankOf(id){ return allRanked().indexOf(id)+1; }
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
    ? `<img class="pimg" src="${esc(cached.u)}" alt="" onload="this.classList.add('ld')" onerror="__pfail(this,'${esc(cached.tt||tt)}')">`
    : `<img class="pimg" data-pid="${esc(m.id)}" alt="">`;
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
function normT(s){ return String(s).toLowerCase().replace(/[^a-z0-9]+/g," ").trim(); }
function cineToMovie(r, kind){
  const hash = hueFromTitle(r.name);
  const m = { id: r.imdb_id || r.id, title: r.name,
    year: r.releaseInfo ? parseInt(String(r.releaseInfo).slice(0,4),10) || "—" : "—",
    genre: "", dir: "", hue: hash, poster: r.poster || null };
  if(kind === "series") m.kind = "series";
  return m;
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
  const withTT = tt => tt ? cineMeta(tt, finish) : finish(null);
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

/* pre-resolved posters for the whole built-in library (title -> IMDb id + art),
   so no runtime catalog search is needed for these — immune to API flakiness */
const PREBAKED_POSTERS = Object.assign({},
{"avatar":{"tt":"tt0499549","u":"https://m.media-amazon.com/images/M/MV5BMDEzMmQwZjctZWU2My00MWNlLWE0NjItMDJlYTRlNGJiZjcyXkEyXkFqcGc@._V1_SX250.jpg"},"backfuture":{"tt":"tt0088763","u":"https://m.media-amazon.com/images/M/MV5BZmM3ZjE0NzctNjBiOC00MDZmLTgzMTUtNGVlOWFlOTNiZDJiXkEyXkFqcGc@._V1_SX250.jpg"},"darkknight":{"tt":"tt0468569","u":"https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX250.jpg"},"departed":{"tt":"tt0407887","u":"https://m.media-amazon.com/images/M/MV5BMTI1MTY2OTIxNV5BMl5BanBnXkFtZTYwNjQ4NjY3._V1_SX250.jpg"},"empire":{"tt":"tt0080684","u":"https://m.media-amazon.com/images/M/MV5BMTkxNGFlNDktZmJkNC00MDdhLTg0MTEtZjZiYWI3MGE5NWIwXkEyXkFqcGc@._V1_SX250.jpg"},"fightclub":{"tt":"tt0137523","u":"https://m.media-amazon.com/images/M/MV5BOTgyOGQ1NDItNGU3Ny00MjU3LTg2YWEtNmEyYjBiMjI1Y2M5XkEyXkFqcGc@._V1_SX250.jpg"},"forrestgump":{"tt":"tt0109830","u":"https://m.media-amazon.com/images/M/MV5BNDYwNzVjMTItZmU5YS00YjQ5LTljYjgtMjY2NDVmYWMyNWFmXkEyXkFqcGc@._V1_SX250.jpg"},"gladiator":{"tt":"tt0172495","u":"https://m.media-amazon.com/images/M/MV5BYWQ4YmNjYjEtOWE1Zi00Y2U4LWI4NTAtMTU0MjkxNWQ1ZmJiXkEyXkFqcGc@._V1_SX250.jpg"},"godfather":{"tt":"tt0068646","u":"https://m.media-amazon.com/images/M/MV5BNGEwYjgwOGQtYjg5ZS00Njc1LTk2ZGEtM2QwZWQ2NjdhZTE5XkEyXkFqcGc@._V1_SX250.jpg"},"goodfellas":{"tt":"tt0099685","u":"https://m.media-amazon.com/images/M/MV5BN2E5NzI2ZGMtY2VjNi00YTRjLWI1MDUtZGY5OWU1MWJjZjRjXkEyXkFqcGc@._V1_SX250.jpg"},"inception":{"tt":"tt1375666","u":"https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX250.jpg"},"interstellar":{"tt":"tt0816692","u":"https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_SX250.jpg"},"jurassic":{"tt":"tt0107290","u":"https://m.media-amazon.com/images/M/MV5BMjM2MDgxMDg0Nl5BMl5BanBnXkFtZTgwNTM2OTM5NDE@._V1_SX250.jpg"},"lionking":{"tt":"tt0110357","u":"https://m.media-amazon.com/images/M/MV5BZGRiZDZhZjItM2M3ZC00Y2IyLTk3Y2MtMWY5YjliNDFkZTJlXkEyXkFqcGc@._V1_SX250.jpg"},"lotr1":{"tt":"tt0120737","u":"https://m.media-amazon.com/images/M/MV5BNzIxMDQ2YTctNDY4MC00ZTRhLTk4ODQtMTVlOWY4NTdiYmMwXkEyXkFqcGc@._V1_SX250.jpg"},"lotr3":{"tt":"tt0167260","u":"https://m.media-amazon.com/images/M/MV5BMTZkMjBjNWMtZGI5OC00MGU0LTk4ZTItODg2NWM3NTVmNWQ4XkEyXkFqcGc@._V1_SX250.jpg"},"matrix":{"tt":"tt0133093","u":"https://m.media-amazon.com/images/M/MV5BN2NmN2VhMTQtMDNiOS00NDlhLTliMjgtODE2ZTY0ODQyNDRhXkEyXkFqcGc@._V1_SX250.jpg"},"parasite":{"tt":"tt6751668","u":"https://m.media-amazon.com/images/M/MV5BYjk1Y2U4MjQtY2ZiNS00OWQyLWI3MmYtZWUwNmRjYWRiNWNhXkEyXkFqcGc@._V1_SX250.jpg"},"prestige":{"tt":"tt0482571","u":"https://m.media-amazon.com/images/M/MV5BM2Y0YmM5MWYtZTYzNi00ZjU5LTlmOGYtZDQ4ODQyMjAzNjQ2XkEyXkFqcGc@._V1_SX250.jpg"},"pulpfiction":{"tt":"tt0110912","u":"https://m.media-amazon.com/images/M/MV5BYTViYTE3ZGQtNDBlMC00ZTAyLTkyODMtZGRiZDg0MjA2YThkXkEyXkFqcGc@._V1_SX250.jpg"},"seven":{"tt":"tt0114369","u":"https://m.media-amazon.com/images/M/MV5BY2IzNzMxZjctZjUxZi00YzAxLTk3ZjMtODFjODdhMDU5NDM1XkEyXkFqcGc@._V1_SX250.jpg"},"shawshank":{"tt":"tt0111161","u":"https://m.media-amazon.com/images/M/MV5BMDAyY2FhYjctNDc5OS00MDNlLThiMGUtY2UxYWVkNGY2ZjljXkEyXkFqcGc@._V1_SX250.jpg"},"silence":{"tt":"tt0102926","u":"https://m.media-amazon.com/images/M/MV5BNDdhOGJhYzctYzYwZC00YmI2LWI0MjctYjg4ODdlMDExYjBlXkEyXkFqcGc@._V1_SX250.jpg"},"spiritedaway":{"tt":"tt0245429","u":"https://images.metahub.space/poster/small/tt0245429/img"},"starwars4":{"tt":"tt0076759","u":"https://m.media-amazon.com/images/M/MV5BOGUwMDk0Y2MtNjBlNi00NmRiLTk2MWYtMGMyMDlhYmI4ZDBjXkEyXkFqcGc@._V1_SX250.jpg"},"titanic":{"tt":"tt0120338","u":"https://m.media-amazon.com/images/M/MV5BYzYyN2FiZmUtYWYzMy00MzViLWJkZTMtOGY1ZjgzNWMwN2YxXkEyXkFqcGc@._V1_SX250.jpg"},"whiplash":{"tt":"tt2582802","u":"https://m.media-amazon.com/images/M/MV5BMDFjOWFkYzktYzhhMC00NmYyLTkwY2EtYjViMDhmNzg0OGFkXkEyXkFqcGc@._V1_SX250.jpg"}},
{"casablanca":{"u":"https://images.metahub.space/poster/small/tt0034583/img","tt":"tt0034583"},"psycho":{"u":"https://m.media-amazon.com/images/M/MV5BYjZhMzFiZjItODA3ZC00MmRhLWIzMGYtMmVjOWUwYTA3MTRjXkEyXkFqcGc@._V1_SX250.jpg","tt":"tt0054215"},"rearwindow":{"u":"https://m.media-amazon.com/images/M/MV5BODZhOWI1ODgtMzdiOS00YjNkLTgwOGUtYmIyZDg5ZmQwMzQ1XkEyXkFqcGc@._V1_SX250.jpg","tt":"tt0047396"},"citizenkane":{"u":"https://m.media-amazon.com/images/M/MV5BYjk1ZDJlMmUtOWQ0Zi00MDM5LTk1OGYtODczNjFmMGYwZGVkXkEyXkFqcGc@._V1_SX250.jpg","tt":"tt0033467"},"taxidriver":{"u":"https://m.media-amazon.com/images/M/MV5BZDNhMGYwM2UtMTdlZS00MGQ1LWI2YzAtODY5YWI1MjYyNzRmXkEyXkFqcGc@._V1_SX250.jpg","tt":"tt0075314"},"apocalypse":{"u":"https://m.media-amazon.com/images/M/MV5BZDhiMTljYjYtODc1Yy00MmEwLTg2OTYtYmE1YTRmNDE4MmEwXkEyXkFqcGc@._V1_SX250.jpg","tt":"tt0078788"},"alien":{"u":"https://m.media-amazon.com/images/M/MV5BN2NhMDk2MmEtZDQzOC00MmY5LThhYzAtMDdjZGFjOGZjMjdjXkEyXkFqcGc@._V1_SX250.jpg","tt":"tt0078748"},"blade":{"u":"https://m.media-amazon.com/images/M/MV5BOWQ4YTBmNTQtMDYxMC00NGFjLTkwOGQtNzdhNmY1Nzc1MzUxXkEyXkFqcGc@._V1_SX250.jpg","tt":"tt0083658"},"blade2049":{"u":"https://m.media-amazon.com/images/M/MV5BNzA1Njg4NzYxOV5BMl5BanBnXkFtZTgwODk5NjU3MzI@._V1_SX250.jpg","tt":"tt1856101"},"dune":{"u":"https://m.media-amazon.com/images/M/MV5BNWIyNmU5MGYtZDZmNi00ZjAwLWJlYjgtZTc0ZGIxMDE4ZGYwXkEyXkFqcGc@._V1_SX250.jpg","tt":"tt1160419"},"dune2":{"u":"https://m.media-amazon.com/images/M/MV5BNTc0YmQxMjEtODI5MC00NjFiLTlkMWUtOGQ5NjFmYWUyZGJhXkEyXkFqcGc@._V1_SX250.jpg","tt":"tt15239678"},"oppenheimer":{"u":"https://m.media-amazon.com/images/M/MV5BN2JkMDc5MGQtZjg3YS00NmFiLWIyZmQtZTJmNTM5MjVmYTQ4XkEyXkFqcGc@._V1_SX250.jpg","tt":"tt15398776"},"barbie":{"u":"https://m.media-amazon.com/images/M/MV5BYjI3NDU0ZGYtYjA2YS00Y2RlLTgwZDAtYTE2YTM5ZjE1M2JlXkEyXkFqcGc@._V1_SX250.jpg","tt":"tt1517268"},"eeaao":{"u":"https://m.media-amazon.com/images/M/MV5BOWNmMzAzZmQtNDQ1NC00Nzk5LTkyMmUtNGI2N2NkOWM4MzEyXkEyXkFqcGc@._V1_SX250.jpg","tt":"tt6710474"},"nocountry":{"u":"https://m.media-amazon.com/images/M/MV5BMjA5Njk3MjM4OV5BMl5BanBnXkFtZTcwMTc5MTE1MQ@@._V1_SX250.jpg","tt":"tt0477348"},"fargo":{"u":"https://m.media-amazon.com/images/M/MV5BNjg4MWE0MjEtODFhNy00MjA5LTg5ODktMzgwNWFmZTAwNjBlXkEyXkFqcGc@._V1_SX250.jpg","tt":"tt0116282"},"lebowski":{"u":"https://m.media-amazon.com/images/M/MV5BY2E3OWQ5OWYtYTRkMC00NjVjLWIzZDQtNmRmM2ZiYTIyYmYxXkEyXkFqcGc@._V1_SX250.jpg","tt":"tt0118715"},"grandbudapest":{"u":"https://m.media-amazon.com/images/M/MV5BMzM5NjUxOTEyMl5BMl5BanBnXkFtZTgwNjEyMDM0MDE@._V1_SX250.jpg","tt":"tt2278388"},"moonrise":{"u":"https://m.media-amazon.com/images/M/MV5BMTEwMTc3NDkzOTJeQTJeQWpwZ15BbWU3MDI4NTAwNzc@._V1_SX250.jpg","tt":"tt1748122"},"amelie":{"u":"https://images.metahub.space/poster/small/tt0211915/img","tt":"tt0211915"},"oldboy":{"u":"https://m.media-amazon.com/images/M/MV5BMTAwNzNjYWItZmI0Ni00ZTcyLWIwNWMtZjlmNGMxZTEyYTJmXkEyXkFqcGc@._V1_SX250.jpg","tt":"tt0364569"},"cityofgod":{"u":"https://images.metahub.space/poster/small/tt0317248/img","tt":"tt0317248"},"panslabyrinth":{"u":"https://images.metahub.space/poster/small/tt0457430/img","tt":"tt0457430"},"princessmono":{"u":"https://m.media-amazon.com/images/M/MV5BZTcyN2Y0MDYtMGI1NC00MWQ1LWFhZGMtN2U4NTcxZGYyNjljXkEyXkFqcGc@._V1_SX250.jpg","tt":"tt0119698"},"totoro":{"u":"https://m.media-amazon.com/images/M/MV5BYWM3MDE3YjEtMzIzZC00ODE5LTgxNTItNmUyMTBkM2M2NmNiXkEyXkFqcGc@._V1_SX250.jpg","tt":"tt0096283"},"wall-e":{"u":"https://m.media-amazon.com/images/M/MV5BMjExMTg5OTU0NF5BMl5BanBnXkFtZTcwMjMxMzMzMw@@._V1_SX250.jpg","tt":"tt0910970"},"up":{"u":"https://m.media-amazon.com/images/M/MV5BNmI1ZTc5MWMtMDYyOS00ZDc2LTkzOTAtNjQ4NWIxNjYyNDgzXkEyXkFqcGc@._V1_SX250.jpg","tt":"tt1049413"}},
{"insideout":{"u":"https://m.media-amazon.com/images/M/MV5BOTgxMDQwMDk0OF5BMl5BanBnXkFtZTgwNjU5OTg2NDE@._V1_SX250.jpg","tt":"tt2096673"},"cocomovie":{"u":"https://m.media-amazon.com/images/M/MV5BMDIyM2E2NTAtMzlhNy00ZGUxLWI1NjgtZDY5MzhiMDc5NGU3XkEyXkFqcGc@._V1_SX250.jpg","tt":"tt2380307"},"spiderverse":{"u":"https://m.media-amazon.com/images/M/MV5BMjMwNDkxMTgzOF5BMl5BanBnXkFtZTgwNTkwNTQ3NjM@._V1_SX250.jpg","tt":"tt4633694"},"getout":{"u":"https://m.media-amazon.com/images/M/MV5BMjUxMDQwNjcyNl5BMl5BanBnXkFtZTgwNzcwMzc0MTI@._V1_SX250.jpg","tt":"tt5052448"},"hereditary":{"u":"https://m.media-amazon.com/images/M/MV5BNTEyZGQwODctYWJjZi00NjFmLTg3YmEtMzlhNjljOGZhMWMyXkEyXkFqcGc@._V1_SX250.jpg","tt":"tt7784604"},"shining":{"u":"https://m.media-amazon.com/images/M/MV5BNmM5ZThhY2ItOGRjOS00NzZiLWEwYTItNDgyMjFkOTgxMmRiXkEyXkFqcGc@._V1_SX250.jpg","tt":"tt0081505"},"2001space":{"u":"https://m.media-amazon.com/images/M/MV5BNjU0NDFkMTQtZWY5OS00MmZhLTg3Y2QtZmJhMzMzMWYyYjc2XkEyXkFqcGc@._V1_SX250.jpg","tt":"tt0062622"},"clockwork":{"u":"https://m.media-amazon.com/images/M/MV5BMTY3MjM1Mzc4N15BMl5BanBnXkFtZTgwODM0NzAxMDE@._V1_SX250.jpg","tt":"tt0066921"},"madmax":{"u":"https://m.media-amazon.com/images/M/MV5BZDRkODJhOTgtOTc1OC00NTgzLTk4NjItNDgxZDY4YjlmNDY2XkEyXkFqcGc@._V1_SX250.jpg","tt":"tt1392190"},"johnwick":{"u":"https://m.media-amazon.com/images/M/MV5BMTU2NjA1ODgzMF5BMl5BanBnXkFtZTgwMTM2MTI4MjE@._V1_SX250.jpg","tt":"tt2911666"},"heat":{"u":"https://m.media-amazon.com/images/M/MV5BMTkxYjU1OTMtYWViZC00ZjAzLWI3MDktZGQ2N2VmMjVjNDRlXkEyXkFqcGc@._V1_SX250.jpg","tt":"tt0113277"},"drive":{"u":"https://m.media-amazon.com/images/M/MV5BYTFmNTFlOTAtNzEyNi00MWU2LTg3MGEtYjA2NWY3MDliNjlkXkEyXkFqcGc@._V1_SX250.jpg","tt":"tt0780504"},"lalaland":{"u":"https://m.media-amazon.com/images/M/MV5BNDdlZmY4YzgtMmMwNS00MmIzLTliOGYtOWIxN2U2MDE5OTdlXkEyXkFqcGc@._V1_SX250.jpg","tt":"tt3783958"},"her":{"u":"https://images.metahub.space/poster/small/tt1798709/img","tt":"tt1798709"},"socialnetwork":{"u":"https://m.media-amazon.com/images/M/MV5BMjlkNTE5ZTUtNGEwNy00MGVhLThmZjMtZjU1NDE5Zjk1NDZkXkEyXkFqcGc@._V1_SX250.jpg","tt":"tt1285016"},"truman":{"u":"https://m.media-amazon.com/images/M/MV5BNzA3ZjZlNzYtMTdjMy00NjMzLTk5ZGYtMTkyYzNiOGM1YmM3XkEyXkFqcGc@._V1_SX250.jpg","tt":"tt0120382"},"etern":{"u":"https://m.media-amazon.com/images/M/MV5BMTY4NzcwODg3Nl5BMl5BanBnXkFtZTcwNTEwOTMyMw@@._V1_SX250.jpg","tt":"tt0338013"},"killbill":{"u":"https://m.media-amazon.com/images/M/MV5BZmMyYzJlZmYtY2I3NC00NjAyLTkyZWItZjdjZDI1YTYyYTEwXkEyXkFqcGc@._V1_SX250.jpg","tt":"tt0266697"},"django":{"u":"https://m.media-amazon.com/images/M/MV5BMjIyNTQ5NjQ1OV5BMl5BanBnXkFtZTcwODg1MDU4OA@@._V1_SX250.jpg","tt":"tt1853728"},"inglourious":{"u":"https://m.media-amazon.com/images/M/MV5BODZhMWJlNjYtNDExNC00MTIzLTllM2ItOGQ2NGVjNDQ3MzkzXkEyXkFqcGc@._V1_SX250.jpg","tt":"tt0361748"},"saving":{"u":"https://m.media-amazon.com/images/M/MV5BZGZhZGQ1ZWUtZTZjYS00MDJhLWFkYjctN2ZlYjE5NWYwZDM2XkEyXkFqcGc@._V1_SX250.jpg","tt":"tt0120815"},"schindler":{"u":"https://images.metahub.space/poster/small/tt0108052/img","tt":"tt0108052"},"memento":{"u":"https://images.metahub.space/poster/small/tt0209144/img","tt":"tt0209144"},"arrival":{"u":"https://m.media-amazon.com/images/M/MV5BMTExMzU0ODcxNDheQTJeQWpwZ15BbWU4MDE1OTI4MzAy._V1_SX250.jpg","tt":"tt2543164"},"knivesout":{"u":"https://m.media-amazon.com/images/M/MV5BZDU5ZTRkYmItZjg0Mi00ZTQwLThjMWItNWM3MTMxMzVjZmVjXkEyXkFqcGc@._V1_SX250.jpg","tt":"tt8946378"},"challengers":{"u":"https://m.media-amazon.com/images/M/MV5BZTcyZGIyODctZGJhOS00MWUyLWI5ZWEtMjg4YzhkMDczMDBhXkEyXkFqcGc@._V1_SX250.jpg","tt":"tt16426418"}});

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
/* bounded edit distance for stylized titles ("Se7en" vs "Seven") */
function lev(a, b, cap){
  if(Math.abs(a.length - b.length) > cap) return cap + 1;
  let prev = Array.from({length: b.length + 1}, (_, i) => i);
  for(let i = 1; i <= a.length; i++){
    const curr = [i];
    for(let j = 1; j <= b.length; j++)
      curr[j] = Math.min(prev[j] + 1, curr[j-1] + 1, prev[j-1] + (a[i-1] === b[j-1] ? 0 : 1));
    prev = curr;
  }
  return prev[b.length];
}
/* score every candidate instead of taking the first loose match —
   handles retitles ("Star Wars: Episode IV - A New Hope") and
   stylizations ("Se7en" is catalogued as "Seven") */
function pickMeta(metas, title, year){
  const want = normT(title), wtok = want.split(" ");
  let best = null, bestScore = 0;
  for(const r of metas){
    if(!r.poster && !(r.imdb_id || r.id)) continue;
    const got = normT(r.name || "");
    const yr = parseInt(String(r.releaseInfo || "").slice(0,4),10) || 0;
    let s = 0;
    const fuzzCap = Math.max(1, Math.floor(want.length / 8));
    if(got === want) s += 100;
    else if(lev(got, want, fuzzCap) <= fuzzCap) s += 90;
    else if(got.includes(want) || want.includes(got)){
      // containment scaled by length ratio, so "Kaori's SM Se7en" can't ride on containing "Se7en"
      const ratio = Math.min(got.length, want.length) / Math.max(got.length, want.length);
      s += Math.round(65 * Math.max(0.35, ratio));
    } else {
      const gtok = got.split(" ");
      const hits = wtok.filter(t => gtok.some(g => g === t || (t.length >= 4 && lev(g, t, 1) <= 1))).length;
      s += hits === wtok.length ? 55 : hits >= wtok.length * 0.6 ? 25 : -100;
    }
    if(year && yr){
      const d = Math.abs(yr - year);
      s += d === 0 ? 30 : d <= 1 ? 20 : d <= 2 ? 0 : -60;
    }
    if(r.poster) s += 5;
    if(s > bestScore){ bestScore = s; best = r; }
  }
  // 55 keeps subtitle variants ("Dune: Part One" → "Dune" 2021, score 58)
  // while still rejecting title-squatters (the Se7en parody scores 48)
  return bestScore >= 55 ? best : null;
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

/* ---------- navigation ---------- */
const TAGS = {feed:"Feed", ranks:"Your ranking", search:"Rank a movie", watch:"Watchlist", profile:"Profile"};
let cur = "feed";
function nav(to){
  cur = to;
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("on"));
  $("#scr-"+to).classList.add("on");
  document.querySelectorAll(".nav [data-nav]").forEach(b => b.classList.toggle("cur", b.dataset.nav === to));
  $("#screenTag").textContent = TAGS[to];
  render(to);
  if(to === "feed" && authed()){ markFeedSeen(); refreshCloudFeed(); refreshNotifs(); }
  window.scrollTo({top:0});
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
  return {id:r.movie_id, title:r.title, year:r.year || "—", genre:r.genre || "",
    dir:r.director || "", hue:hueFromTitle(r.title), poster:r.poster || null};
}
function movieToRow(id, bucket, pos){
  const m = getMovie(id); if(!m) return null;
  const c = cacheEntry(id);
  return {user_id: myId(), movie_id: id, title: m.title,
    year: typeof m.year === "number" ? m.year : null,
    genre: m.genre || null, director: m.dir || null,
    poster: m.poster || (c ? c.u : null),
    bucket, position: pos, score: scoreOf(id),
    note: S.notes[id] || null};
}

/* ---- cloud sync: debounced full reconcile of rankings + watchlist ---- */
let syncT = null, SYNC_TOUCH = null, PULLING = false;
function queueSync(){
  if(!authed() || PULLING) return;
  clearTimeout(syncT);
  syncT = setTimeout(syncCloud, 1200);
}
/* upsert the local rows for one (user, movie)-keyed table, then delete whatever
   the cloud still holds that we no longer do. Upsert always runs before the
   delete-reconcile so an interrupted sync can never leave the cloud short. */
async function pushTable(table, rows, keep){
  if(rows.length)
    await sb(pgPath(table, {on_conflict:"user_id,movie_id"}), {method:"POST",
      headers:{Prefer:"resolution=merge-duplicates"}, body: JSON.stringify(rows)});
  const cr = await sb(pgPath(table, {user_id:pgEq(myId()), select:"movie_id"}));
  if(cr.ok){
    const cloudIds = (await cr.json()).map(x => x.movie_id);
    const gone = cloudIds.filter(id => !keep(id));
    if(gone.length)
      await sb(pgPath(table, {user_id:pgEq(myId()), movie_id:pgIn(gone)}), {method:"DELETE"});
  }
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
async function pushWatchlist(){
  const rows = S.watch.map(id => { const m = getMovie(id); const c = cacheEntry(id);
    return m ? {user_id:myId(), movie_id:id, title:m.title, year: typeof m.year==="number"?m.year:null,
      genre:m.genre||null, director:m.dir||null, poster:m.poster||(c?c.u:null)} : null; }).filter(Boolean);
  await pushTable("watchlist", rows, id => S.watch.includes(id));
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
  // one outer catch, as before: a step that throws aborts the rest of the cycle.
  // `step` only exists so the log says WHICH half of the sync died.
  let step = "rankings";
  try{
    await pushRankings();
    step = "ranking-touch"; await touchRanking();
    step = "watchlist";     await pushWatchlist();
    step = "profile";       await patchProfile();
  }catch(e){ logErr("syncCloud/" + step, e); }
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
}
async function pullWatchlist(){
  const wl = await sb(pgPath("watchlist", {user_id:pgEq(myId()), select:"*", order:"added_at.desc"}));
  if(!wl.ok) return;
  const rows = await wl.json();
  rows.forEach(r => { if(!getMovie(r.movie_id)) S.custom.push(rowToMovie(r)); });
  S.watch = [...new Set([...rows.map(r => r.movie_id), ...S.watch])];
}
async function pullLikes(){
  const lk = await sb(pgPath("likes", {user_id:pgEq(myId()), select:"ranking_user,ranking_movie"}));
  CLOUD.myLikes = lk.ok ? new Set((await lk.json()).map(x => x.ranking_user + "|" + x.ranking_movie)) : new Set();
}
async function pullCloud(){
  if(!authed()) return;
  PULLING = true;
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
  const heart = `<svg width="14" height="14" viewBox="0 0 24 24" fill="var(--bad)" stroke="var(--bad)" stroke-width="2"><path d="M12 21C7 16.5 3 13.3 3 9.3 3 6.4 5.2 4.5 7.7 4.5c1.7 0 3.3.9 4.3 2.4 1-1.5 2.6-2.4 4.3-2.4 2.5 0 4.7 1.9 4.7 4.8 0 4-4 7.2-9 11.7z"/></svg>`;
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
  sheet.querySelectorAll("[data-notif]").forEach(b => b.addEventListener("click", () => openDetail(b.dataset.notif)));
  sheet.querySelectorAll("[data-notifperson]").forEach(b => b.addEventListener("click", () => openPerson(b.dataset.notifperson)));
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
    wrap.querySelectorAll("[data-cperson]").forEach(b => b.addEventListener("click", () => openPerson(b.dataset.cperson)));
  }catch(e){ logErr("loading community scores", e); }
}

/* ---- public profile sheet: tap any person to see their list ---- */
async function openPerson(id){
  openSheet(`<div class="empty" style="padding:30px"><p>Loading profile…</p></div>`);
  const pr = await sb(pgPath("profiles", {id:pgEq(id), select:"*"}));
  const p = pr.ok ? (await pr.json())[0] : null;
  if(!p){ openSheet(`<div class="empty" style="padding:30px"><p>Couldn't load this profile — try again.</p></div>`); return; }
  const rr = await sb(pgPath("rankings", {user_id:pgEq(id), select:"*", order:"score.desc", limit:50}));
  const rows = rr.ok ? await rr.json() : [];
  rows.forEach(r => { if(!getMovie(r.movie_id)) LIVE[r.movie_id] = rowToMovie(r); });
  const overlap = rows.filter(r => isRanked(r.movie_id));
  const both = overlap.slice(0, 6);
  const match = overlap.length
    ? Math.min(99, Math.max(35, Math.round(97 - (overlap.reduce((a, r) => a + Math.abs(Number(r.score) - scoreOf(r.movie_id)), 0) / overlap.length) * 9)))
    : null;
  const following = CLOUD.follows.has(id);
  const isMe = id === myId();
  openSheet(`
    <div class="dhead">
      ${avatarHTML(p.display_name, p.avatar_hue, p.avatar_url, "width:74px;height:74px;font-size:26px")}
      <div class="meta">
        <h2>${esc(p.display_name)}</h2>
        <div class="d">@${esc(p.handle)} · ${rows.length} movie${rows.length===1?"":"s"} ranked</div>
        ${p.taste && p.taste.genres && p.taste.genres.length ? `<div class="chips" style="margin-top:8px">${p.taste.genres.slice(0,4).map(g => `<span class="chip" style="padding:4px 9px;font-size:11px">${esc(g)}</span>`).join("")}</div>` : ""}
        <div class="dactions">
          ${isMe ? "" : `<button class="pillbtn ${following?"soft":"acc"}" id="pfollow">${following ? "Reelmates ✓" : "Add Reelmate"}</button>`}
          <button class="pillbtn" id="pshare">Share</button>
        </div>
      </div>
      ${match !== null ? `<div class="matchring" style="--pct:${match}" title="Taste match across ${overlap.length} shared movie${overlap.length===1?"":"s"}"><span>${match}%</span></div>` : ""}
    </div>
    ${both.length ? `<div class="sechead">You both ranked</div><div class="card" style="padding:6px 14px">
      ${both.map(r => `<div class="bothrow"><span style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(r.title)}</span>
        <span class="score sc ${scoreClass(scoreOf(r.movie_id))}" title="Your score">${scoreOf(r.movie_id).toFixed(1)}</span>
        <span class="score sc ${scoreClass(Number(r.score))}" title="Their score">${Number(r.score).toFixed(1)}</span></div>`).join("")}
      <div style="display:flex;justify-content:flex-end;gap:14px;color:var(--muted);font-size:10.5px;padding:8px 2px 4px"><span>you</span><span>them</span></div></div>` : ""}
    <div class="sechead">Their top rankings</div>
    ${rows.length ? `<div class="card">${rows.slice(0, 10).map((r, i) => `<button class="row" data-open="${esc(r.movie_id)}">
      <span class="rankno">${i+1}</span>${posterHTML(getMovie(r.movie_id) || rowToMovie(r), "p-sm")}
      <span class="meta"><span class="t">${esc(r.title)}</span><span class="d">${esc([r.year, r.genre].filter(Boolean).join(" · "))}</span></span>
      ${scoreHTML(Number(r.score))}</button>`).join("")}</div>` : `<div class="empty"><p>Nothing ranked yet.</p></div>`}`);
  const pf = $("#pfollow");
  if(pf) pf.addEventListener("click", () => {
    (following ? BACKEND.unfollow : BACKEND.follow)(id, ok => { if(ok) openPerson(id); });
  });
  $("#pshare").addEventListener("click", () =>
    openShare(`${p.display_name}'s movie taste on Reeli 🎬`, location.origin + location.pathname + "?u=" + encodeURIComponent(p.handle)));
  sheet.querySelectorAll("[data-open]").forEach(b => b.addEventListener("click", () => openDetail(b.dataset.open)));
  hydratePosters(sheet);
}

/* ---- social sign-in (Supabase OAuth: works per-provider once configured in the dashboard) ---- */
const OAUTH = [["google","Google","#4285F4"],["discord","Discord","#5865F2"],["facebook","Facebook","#1877F2"],["x","X","#111"]];
function oauthBtnsHTML(){
  return OAUTH.map(([p, label, bg]) =>
    `<button class="socialbtn" data-oauth="${p}"><span class="mark" style="background:${bg}">${label[0]}</span>Continue with ${label}</button>`).join("");
}
function wireOauth(root){
  root.querySelectorAll("[data-oauth]").forEach(b => b.addEventListener("click", () => {
    location.href = SUPA_URL + "/auth/v1/authorize?provider=" + b.dataset.oauth +
      "&redirect_to=" + encodeURIComponent(location.origin + location.pathname);
  }));
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
  wireOauth($("#gate"));
  $("#gateSignup").addEventListener("click", () => openAuthSheet("signup"));
  $("#gateLogin").addEventListener("click", () => openAuthSheet("login"));
  $("#gateGuest").addEventListener("click", () => {
    S.guestChosen = true; save(); hideGate();
    if(!S.onboarded) openOnboarding(0);
  });
}
function hideGate(){ $("#gate").classList.remove("on"); }
function afterAuthEntry(){
  hideGate();
  if(!S.onboarded) openOnboarding(0);
  else render(cur);
}

/* ---- auth UI ---- */
function openAuthSheet(mode){
  const signup = mode === "signup";
  openSheet(`
    <h1 class="h1">${signup ? "Create your account" : "Welcome back"}</h1>
    <p class="sub">${signup ? "Your list syncs to the cloud and friends can find you." : "Log in to your Reeli account."}</p>
    <div style="display:grid;gap:10px">
      ${oauthBtnsHTML()}
      <div class="ordiv">or with email</div>
      <input class="field" id="auemail" type="email" placeholder="Email" autocomplete="email">
      <input class="field" id="aupass" type="password" placeholder="Password (8+ characters)" autocomplete="${signup?"new-password":"current-password"}">
      <div id="auerr" style="color:var(--bad);font-size:12.5px;display:none"></div>
      <div style="display:flex;gap:9px;flex-wrap:wrap">
        <button class="pillbtn acc" id="ausubmit" style="padding:11px 20px">${signup ? "Sign up" : "Log in"}</button>
        <button class="pillbtn" id="auswap">${signup ? "I have an account" : "I need an account"}</button>
      </div>
    </div>`);
  $("#auswap").addEventListener("click", () => openAuthSheet(signup ? "login" : "signup"));
  wireOauth(sheet);
  ["auemail","aupass"].forEach(fid => $("#"+fid).addEventListener("keydown", e => { if(e.key === "Enter") $("#ausubmit").click(); }));
  const err = msg => { const e = $("#auerr"); e.textContent = msg; e.style.display = "block"; };
  $("#ausubmit").addEventListener("click", async () => {
    const email = $("#auemail").value.trim(), pass = $("#aupass").value;
    if(!/.+@.+\..+/.test(email)) return err("That email doesn't look right.");
    if(pass.length < 8) return err("Password needs at least 8 characters.");
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
        err(msg);
        // stuck half-signed-up? (signed up but never confirmed) — offer a way out
        if(/confirm/i.test(msg) || /already registered/i.test(msg)){
          $("#auerr").insertAdjacentHTML("afterend",
            `<button class="pillbtn soft" id="aurescue" style="justify-self:start">Resend confirmation email</button>`);
          $("#aurescue").addEventListener("click", async () => {
            const rr = await fetch(SUPA_URL + "/auth/v1/resend", {method:"POST",
              headers:{apikey:SUPA_KEY, "Content-Type":"application/json"},
              body: JSON.stringify({type:"signup", email,
                options:{email_redirect_to: location.origin + location.pathname}})});
            toast(rr.ok ? "Confirmation email sent 📬 — click the link, you'll be signed in here" : "Couldn't send — wait a minute and retry");
          });
        }
        return;
      }
      if(signup && !d.access_token){
        openSheet(`<div class="result"><h2>Check your inbox 📬</h2>
          <p>We sent a confirmation link to <b>${esc(email)}</b>.<br>Clicking it signs you in here automatically.<br>Nothing after a few minutes? Check spam, or resend.</p>
          <div style="display:flex;gap:9px"><button class="pillbtn acc" id="audone">I've confirmed — log in</button>
          <button class="pillbtn" id="auresend">Resend email</button></div></div>`);
        $("#audone").addEventListener("click", () => openAuthSheet("login"));
        $("#auresend").addEventListener("click", async () => {
          const rr = await fetch(SUPA_URL + "/auth/v1/resend", {method:"POST",
            headers:{apikey:SUPA_KEY, "Content-Type":"application/json"},
            body: JSON.stringify({type:"signup", email,
              options:{email_redirect_to: location.origin + location.pathname}})});
          toast(rr.ok ? "Confirmation email resent 📬" : "Couldn't resend — wait a minute and try again");
        });
        return;
      }
      saveAuth({access_token:d.access_token, refresh_token:d.refresh_token,
        expires_at: Math.floor(Date.now()/1000) + (d.expires_in || 3600), user:d.user});
      closeSheet();
      await pullCloud();
      if(!CLOUD.profile) openClaimHandle();
      else { toast("Welcome back, " + CLOUD.profile.display_name + " 🎬"); afterAuthEntry(); }
    }catch(e){ err("Network hiccup — try again."); }
    finally{ const b = $("#ausubmit"); if(b) b.textContent = signup ? "Sign up" : "Log in"; }
  });
}
function openClaimHandle(){
  const P = S.profile || {name:"", hue:172};
  // locked: this MUST be completed — a signed-in user needs a profile to sync
  // and be found. An explicit "Not now" is the only way out (signs back out).
  openSheet(`
    <h1 class="h1">Almost there — claim your handle</h1>
    <p class="sub">You're signed in. Pick a display name and @handle so your list syncs and Reelmates can find you.</p>
    <div style="display:grid;gap:10px">
      <input class="field" id="chname" placeholder="Display name" maxlength="40" value="${esc(P.name === "Guest" ? "" : P.name)}">
      <input class="field" id="chhandle" placeholder="@handle" maxlength="20">
      <div class="swatches">${AVATAR_HUES.map(h => `<button class="swatch ${P.hue===h?"cur":""}" data-chue="${h}" style="background:hsl(${h} 45% 45%)" aria-label="Avatar color"></button>`).join("")}</div>
      <div id="cherr" style="color:var(--bad);font-size:12.5px;display:none"></div>
      <button class="pillbtn acc" id="chsave" style="padding:11px 20px">Finish</button>
      <button class="ghostlink" id="chcancel" style="margin-top:2px">Not now — sign out</button>
    </div>`, true);
  $("#chcancel").addEventListener("click", () => { closeSheet(true); doLogout(); });
  ["chname","chhandle"].forEach(fid => $("#"+fid).addEventListener("keydown", e => { if(e.key === "Enter") $("#chsave").click(); }));
  let hue = P.hue;
  sheet.querySelectorAll("[data-chue]").forEach(b => b.addEventListener("click", () => {
    hue = +b.dataset.chue;
    sheet.querySelectorAll(".swatch").forEach(s => s.classList.toggle("cur", +s.dataset.chue === hue));
  }));
  $("#chsave").addEventListener("click", async () => {
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
  });
}
async function doLogout(){
  try{ await sb("/auth/v1/logout", {method:"POST"}); }catch(e){ logErr("server-side logout (signing out locally anyway)", e); }
  saveAuth(null);
  CLOUD.profile = null; CLOUD.profileLoaded = false; CLOUD.follows = new Set(); CLOUD.feed = []; CLOUD.myLikes = new Set(); CLOUD.notifs = [];
  setNotifBadge(0);
  S.profile = null; S.guestChosen = false; save(); render(cur); toast("Logged out");
  showGate();
}
function feedItemHTML(f, idx){
  const m = getMovie(f.movie); if(!m) return "";
  const who = f.who || {name:"You", hue:(S.profile ? S.profile.hue : 172), url:(S.profile ? S.profile.avatarUrl : null)};
  const mine = !f.cloud;
  let liked, likeN, likeAttr;
  if(f.cloud){
    liked = CLOUD.myLikes.has(f.userId + "|" + f.movie);
    likeN = f.likes || 0;
    likeAttr = `data-clike="${esc(f.userId)}|${esc(f.movie)}"`;
  } else {
    const likeKey = "me"+idx;
    liked = !!S.likes[likeKey];
    likeN = (f.likes||0) + (liked?1:0);
    likeAttr = `data-like="${likeKey}"`;
  }
  const sub = mine
    ? `${esc(f.time)}${f.rank ? ` · #${f.rank} on your list` : ""}`
    : `${esc(f.time)} · @${esc(f.handle || "")}`;
  const headInner = `
      ${avatarHTML(who.name, who.hue, who.url)}
      <div class="fwho"><b>${esc(who.name)}</b> ranked <b>${esc(m.title)}</b><br><span class="ftime">${sub}</span></div>
      ${scoreHTML(f.score)}`;
  return `<article class="fitem">
    ${f.cloud
      ? `<button class="fhead" data-person="${esc(f.userId)}" style="width:100%;text-align:left">${headInner}</button>`
      : `<div class="fhead">${headInner}</div>`}
    <button class="fbody" data-open="${m.id}" style="width:100%;text-align:left;border:none">
      ${posterHTML(m,"p-sm")}
      <div class="meta"><span class="t" style="font-weight:650;font-size:13.5px;display:block">${esc(m.title)}</span>
      <span class="d" style="color:var(--muted);font-size:12px">${esc(mline(m))}</span></div>
    </button>
    ${f.note ? `<p class="fnote">“${esc(f.note)}”</p>` : ""}
    <div class="facts">
      <button ${likeAttr} class="${liked?"liked":""}" aria-pressed="${liked}">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="${liked?"currentColor":"none"}" stroke="currentColor" stroke-width="2"><path d="M12 21C7 16.5 3 13.3 3 9.3 3 6.4 5.2 4.5 7.7 4.5c1.7 0 3.3.9 4.3 2.4 1-1.5 2.6-2.4 4.3-2.4 2.5 0 4.7 1.9 4.7 4.8 0 4-4 7.2-9 11.7z"/></svg>
        ${likeN}</button>
      <button data-open="${m.id}">${isRanked(m.id) ? "Ranked ✓" : "Rank it too"}</button>
    </div>
  </article>`;
}
let feedTab = "activity", mateQuery = "", mateResults = null, mateState = "idle", mateT = null, mateSugg = null;
function renderFeed(){
  const segs = `<div class="segs">
    <button class="seg ${feedTab==="activity"?"cur":""}" data-ftab="activity">Activity</button>
    <button class="seg ${feedTab==="mates"?"cur":""}" data-ftab="mates">Reelmates</button>
  </div>`;
  let body;
  if(feedTab === "activity"){
    const cloudHTML = CLOUD.feed.map(f => feedItemHTML(f, 0)).join("");
    const mine = S.myFeed.map((f,i) => feedItemHTML(f, i)).join("");
    const loadingMates = authed() && CLOUD.follows.size && !CLOUD.feedLoaded
      ? `<p class="sub" style="margin:0 0 10px">Checking your Reelmates' latest…</p>` : "";
    const all = loadingMates + mine + cloudHTML;
    body = all ? `<div class="fgrid">${all}</div>` :
      `<div class="empty"><div class="big" aria-hidden="true">🎞️</div>
        <p>Your feed starts with you. Rank a movie and it lands here — and once you add Reelmates, their rankings join the stream.</p>
        <button class="pillbtn acc" data-gosearch>Rank your first movie</button></div>`;
    body = `<h1 class="h1">Fresh takes</h1>
      <p class="sub">Your rankings and your Reelmates' — as they happen.</p>${segs}${body}`;
  } else {
    const personRow = p => `<div class="row">
        ${avatarHTML(p.name, p.hue, p.avatarUrl)}
        <button class="meta" data-person="${esc(p.id)}" style="text-align:left;min-width:0">
        <span class="t">${esc(p.name)} <span style="color:var(--muted);font-weight:500;font-size:12px">@${esc(p.handle)}</span></span>
        <span class="d">${p.ranked} movie${p.ranked===1?"":"s"} ranked · tap for profile</span></button>
        <button class="pillbtn ${p.following?"soft":"acc"}" data-pfollow="${esc(p.id)}">${p.following ? "Reelmates ✓" : "Add"}</button>
      </div>`;
    let results;
    if(!BACKEND.enabled){
      results = `<div class="empty" style="padding:30px 24px"><div class="big" aria-hidden="true">🎟️</div>
        <p><b>Reelmates are real people — no bots, no demo accounts.</b><br>
        Send the site to a friend so there's someone to find:</p>
        <button class="pillbtn acc" id="inviteBtn">Copy invite link</button></div>`;
    } else if(mateState === "loading"){
      results = `<div class="empty" style="padding:24px"><p>Searching people…</p></div>`;
    } else if(Array.isArray(mateResults)){
      results = mateResults.length ? `<div class="card">${mateResults.map(personRow).join("")}</div>`
        : `<div class="empty" style="padding:24px"><p>Nobody matching “${esc(mateQuery)}” yet. Handles are exact — ask your friend for theirs.</p></div>`;
    } else {
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
      const sugg = Array.isArray(mateSugg)
        ? mateSugg.map(p => ({...p, following: CLOUD.follows.has(p.id)}))
        : null;
      results = `${sugg && sugg.length ? `<div class="sechead">New on Reeli</div><div class="card">${sugg.map(personRow).join("")}</div>` : ""}
        <div class="empty" style="padding:24px"><p>Search by name or @handle to find people.${authed() ? "" : "<br>You can browse without an account — following needs one."}</p>
        <button class="pillbtn soft" id="inviteBtn" style="margin-top:10px">Copy invite link</button></div>`;
    }
    body = `<h1 class="h1">Reelmates</h1>
      <p class="sub">Your people in the audience. Find them by name or @handle and follow their rankings.</p>
      ${segs}
      <div class="searchbar">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.8-3.8"/></svg>
        <input id="mq" type="search" placeholder="Find people by name or @handle…" value="${esc(mateQuery)}" autocomplete="off" ${BACKEND.enabled?"":"disabled"}>
      </div>
      ${results}`;
  }
  $("#feedWrap").innerHTML = body;
  $("#feedWrap").querySelectorAll("[data-ftab]").forEach(b => b.addEventListener("click", () => { feedTab = b.dataset.ftab; renderFeed(); }));
  const inv = $("#inviteBtn");
  if(inv) inv.addEventListener("click", () => {
    const link = location.origin + location.pathname;
    if(navigator.clipboard && navigator.clipboard.writeText)
      navigator.clipboard.writeText(link).then(() => toast("Invite link copied 🎟️"), () => toast(link));
    else toast(link);
  });
  const mq = $("#mq");
  if(mq && BACKEND.enabled){
    mq.addEventListener("input", () => {
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
    });
  }
  $("#feedWrap").querySelectorAll("[data-pfollow]").forEach(b => b.addEventListener("click", () => {
    const id = b.dataset.pfollow;
    // person can come from either the search results or the "New on Reeli" suggestions
    const pool = [...(mateResults || []), ...(Array.isArray(mateSugg) ? mateSugg : [])];
    const p = pool.find(x => x.id === id);
    const name = p ? p.name : "them";
    const following = CLOUD.follows.has(id); // source of truth, not the list object
    const done = ok => {
      if(!ok){ toast("Couldn't update — try again"); return; }
      if(p) p.following = !following;
      toast(following ? `Removed ${name}` : `${name} is now a Reelmate 🎟️`);
      renderFeed();
    };
    following ? BACKEND.unfollow(id, done) : BACKEND.follow(id, done);
  }));
  wireCommon($("#feedWrap"));
}

/* ---------- rankings ---------- */
let rankFilter = "all", rankGenre = "";
function renderRanks(){
  const ids = allRanked();
  let body;
  if(!ids.length){
    body = `<div class="empty"><div class="big" aria-hidden="true">🎬</div>
      <p>Nothing ranked yet. Add your first movie and Reeli will build your list one head-to-head at a time.</p>
      <button class="pillbtn acc" data-gosearch>Rank your first movie</button></div>`;
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
    ${body}`;
  $("#ranksWrap").querySelectorAll("[data-filter]").forEach(b =>
    b.addEventListener("click", () => { rankFilter = b.dataset.filter; renderRanks(); }));
  $("#ranksWrap").querySelectorAll("[data-gfilter]").forEach(b =>
    b.addEventListener("click", () => { rankGenre = rankGenre === b.dataset.gfilter ? "" : b.dataset.gfilter; renderRanks(); }));
  wireCommon($("#ranksWrap"));
}

/* ---------- search (built-in library + live worldwide catalog) ---------- */
let query = "", liveResults = [], liveState = "idle", liveT = null, liveSeq = 0;
function movieRowHTML(m){
  const ranked = isRanked(m.id), inWatch = S.watch.includes(m.id);
  return `<div class="row">
    ${posterHTML(m,"p-sm")}
    <button class="meta" data-open="${m.id}" style="text-align:left;min-width:0">
      <span class="t">${esc(m.title)}</span><span class="d">${esc(mline(m))}</span>
    </button>
    ${ranked ? scoreHTML(scoreOf(m.id))
      : `<button class="iconbtn ${inWatch?"on":""}" data-watch="${m.id}" aria-label="${inWatch?"Remove from":"Add to"} watchlist" title="Watchlist">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="${inWatch?"currentColor":"none"}" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M6 3h12v18l-6-4.5L6 21z"/></svg></button>
        <button class="pillbtn acc" data-rate="${m.id}">Rank</button>`}
  </div>`;
}
function runLiveSearch(q){
  const seq = ++liveSeq;
  liveState = "loading";
  cineSearch(q, metas => {
    if(seq !== liveSeq) return;
    if(metas === null){ liveState = "err"; liveResults = []; }
    else {
      liveState = "done";
      const locals = new Set([...DB.map(a => normT(a[1])+"|"+a[2]), ...S.custom.map(m => normT(m.title)+"|"+m.year)]);
      liveResults = metas.slice(0, 22).map(r => cineToMovie(r))
        .filter(m => !locals.has(normT(m.title)+"|"+m.year));
      liveResults.forEach(m => { if(!getMovie(m.id)) LIVE[m.id] = m; });
    }
    if(cur === "search") renderSearch();
  });
}
let TREND = null; // null = not fetched, "loading"/"err", or array of movies
function loadTrending(){
  TREND = "loading";
  getJSON(CINE + "/catalog/movie/top.json", d => {
    if(!d || !Array.isArray(d.metas)){ TREND = "err"; return; }
    const locals = new Set(DB.map(a => normT(a[1])+"|"+a[2]));
    TREND = d.metas.slice(0, 14).map(r => cineToMovie(r)).filter(m => !locals.has(normT(m.title)+"|"+m.year));
    TREND.forEach(m => { if(!getMovie(m.id)) LIVE[m.id] = m; });
    if(cur === "search" && !query.trim()) renderSearch();
  });
}
function renderSearch(){
  const q = query.trim().toLowerCase();
  if(!q && TREND === null) loadTrending();
  const pool = [...DB.map(a => MOVIES[a[0]]), ...S.custom];
  const list = q
    ? pool.filter(m => (m.title+" "+m.dir+" "+m.genre+" "+m.year).toLowerCase().includes(q))
    : pool.filter(m => !isRanked(m.id)).sort((a,b) => tasteScore(b) - tasteScore(a)).slice(0, 12);
  const rows = list.map(movieRowHTML).join("");
  const trendRows = (!q && Array.isArray(TREND))
    ? TREND.filter(m => !isRanked(m.id)).slice(0, 10).map(movieRowHTML).join("") : "";
  let liveHTML = "";
  if(q){
    const liveRows = liveResults.map(movieRowHTML).join("");
    liveHTML = `<div class="sechead">Worldwide catalog</div><div class="card">${
      liveState === "loading" ? `<div class="empty" style="padding:22px"><p>Searching the worldwide catalog…</p></div>`
      : liveState === "err" ? `<div class="empty" style="padding:22px"><p>Live catalog unreachable right now — showing the built-in library only.</p></div>`
      : liveRows || `<div class="empty" style="padding:22px"><p>No catalog matches for “${esc(query)}”.</p></div>`}</div>`;
  }
  $("#searchWrap").innerHTML = `
    <h1 class="h1">Rank a movie</h1>
    <p class="sub">Search any movie ever released — live from the worldwide catalog.</p>
    <div class="searchbar">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.8-3.8"/></svg>
      <input id="q" type="search" placeholder="Search any movie, director, genre…" value="${esc(query)}" autocomplete="off">
    </div>
    ${trendRows ? `<div class="sechead">Popular right now</div><div class="card">${trendRows}</div>` : ""}
    ${!q ? `<div class="sechead">${S.taste ? "Picked for your taste" : "Suggestions for you"}</div>` : rows ? `<div class="sechead">From your library</div>` : ""}
    ${(!q || rows) ? `<div class="card">${rows}</div>` : ""}
    ${liveHTML}
    <div class="sechead">Missing something?</div>
    <div class="card"><div class="row">
      <span class="meta"><span class="t">Add a movie manually</span><span class="d">Home movies? Festival one-offs? Put them on the board.</span></span>
      <button class="pillbtn soft" data-addcustom>Add</button>
    </div></div>`;
  const inp = $("#q");
  inp.addEventListener("input", () => {
    query = inp.value;
    const pos = inp.selectionStart;
    clearTimeout(liveT);
    const qq = query.trim();
    if(qq){ liveState = "loading"; liveT = setTimeout(() => runLiveSearch(qq), 450); }
    else { liveState = "idle"; liveResults = []; liveSeq++; }
    renderSearch();
    const ni = $("#q"); ni.focus(); ni.setSelectionRange(pos,pos);
  });
  inp.addEventListener("keydown", e => {
    if(e.key !== "Enter") return;
    const qq = inp.value.trim(); if(!qq) return;
    clearTimeout(liveT); runLiveSearch(qq);
  });
  $("#searchWrap").querySelector("[data-addcustom]").addEventListener("click", openCustom);
  wireCommon($("#searchWrap"));
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
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
    </div>`).join("");
  $("#watchWrap").innerHTML = `
    <h1 class="h1">Watchlist</h1>
    <p class="sub">Queued up for future you. Rank them once you've watched.</p>
    ${items.length >= 2 ? `<div style="margin-bottom:14px"><button class="pillbtn acc" id="pickBtn">🎲 Pick tonight's movie for me</button></div>` : ""}
    ${items.length ? `<div class="card">${rows}</div>`
      : `<div class="empty"><div class="big" aria-hidden="true">🍿</div><p>Your watchlist is empty. Browse and bookmark anything you want to see.</p><button class="pillbtn acc" data-gosearch>Find movies</button></div>`}`;
  $("#watchWrap").querySelectorAll("[data-unwatch]").forEach(b => b.addEventListener("click", () => {
    S.watch = S.watch.filter(x => x !== b.dataset.unwatch); save(); renderWatch(); toast("Removed from watchlist");
  }));
  const pb = $("#pickBtn"); if(pb) pb.addEventListener("click", pickTonight);
  wireCommon($("#watchWrap"));
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
function pickAgainRender(m){
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
  $("#pkSeen").addEventListener("click", () => startRate(m.id));
  $("#pkAgain").addEventListener("click", () => pickTonight(m.id));
  $("#pkClose").addEventListener("click", closeSheet);
  hydratePosters(sheet);
}

/* ---------- profile ---------- */
function renderProfile(){
  const ids = allRanked();
  const scores = ids.map(scoreOf);
  const avg = scores.length ? (scores.reduce((a,b)=>a+b,0)/scores.length).toFixed(1) : "—";
  const gc = {};
  ids.forEach(id => { const m = getMovie(id); if(m && m.genre) gc[m.genre] = (gc[m.genre]||0)+1; });
  const topGenres = Object.entries(gc).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const n = ids.length || 1;
  const dist = [["Loved", S.loved.length, "var(--good)"],["Fine", S.fine.length, "var(--mid)"],["Not for me", S.disliked.length, "var(--bad)"]];
  const P = S.profile || {name:"Guest", handle:"@guest", hue:172};
  const cloud = authed() && CLOUD.profile;
  // only after a CONFIRMED cloud check showing no profile — never during load or on a failed fetch
  const needsSetup = authed() && CLOUD.profileLoaded && !CLOUD.profile;
  $("#profileWrap").innerHTML = `
    <div class="phead">
      ${avatarHTML(needsSetup ? "?" : P.name, P.hue, P.avatarUrl)}
      <div style="flex:1;min-width:0"><div class="pname">${needsSetup ? "Finish setup" : esc(P.name)}</div>
        <div class="phandle">${cloud ? esc(P.handle) + " · " + esc(AUTH.user && AUTH.user.email || "") : needsSetup ? "signed in — pick a handle" : esc(P.handle) + " · guest mode"}</div></div>
      ${needsSetup ? "" : `<button class="pillbtn" id="editBtn">Edit</button>`}
    </div>
    ${needsSetup ? `<div class="card" style="padding:14px;margin-bottom:14px;display:flex;gap:10px;align-items:center;flex-wrap:wrap">
      <span class="d" style="color:var(--muted);font-size:12.5px;line-height:1.5;flex:1;min-width:200px">
      You're signed in, but you haven't picked a handle yet — so your list isn't syncing and friends can't find you. Finish setup to fix that.</span>
      <button class="pillbtn acc" id="finishSetupBtn">Finish setup</button>
      <button class="pillbtn" id="logoutBtn2">Sign out</button></div>`
    : cloud ? "" : `<div class="card" style="padding:14px;margin-bottom:14px;display:flex;gap:10px;align-items:center;flex-wrap:wrap">
      <span class="d" style="color:var(--muted);font-size:12.5px;line-height:1.5;flex:1;min-width:200px">
      You're in guest mode — everything saves to this browser only. Create a free account to sync your list and follow Reelmates.</span>
      <button class="pillbtn acc" id="signupBtn">Create account</button>
      <button class="pillbtn" id="loginBtn">Log in</button></div>`}
    <div class="stats" style="grid-template-columns:repeat(4,1fr)">
      <div class="stat"><div class="n">${ids.length}</div><div class="l">Ranked</div></div>
      <div class="stat"><div class="n">${S.loved.length}</div><div class="l">Loved</div></div>
      <div class="stat"><div class="n">${S.watch.length}</div><div class="l">Queued</div></div>
      <div class="stat"><div class="n">${avg}</div><div class="l">Avg</div></div>
    </div>
    <div class="sechead" style="display:flex;justify-content:space-between;align-items:center">Your taste
      <button class="pillbtn" id="tasteBtn" style="padding:5px 11px;font-size:11.5px">${S.taste ? "Edit" : "Set up"}</button></div>
    ${S.taste && (S.taste.genres.length || S.taste.dirs.length)
      ? `<div class="chips" style="margin-bottom:14px">${[...S.taste.genres, ...S.taste.dirs].map(t => `<span class="chip">${esc(t)}</span>`).join("")}</div>`
      : `<div class="card" style="padding:12px 14px;margin-bottom:14px"><span class="d" style="color:var(--muted);font-size:12.5px">No taste set yet — pick genres and filmmakers to fuel your suggestions.</span></div>`}
    <div class="sechead">Make it yours</div>
    <div class="card" style="padding:14px;margin-bottom:14px;display:grid;gap:12px">
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
        <span class="d" style="color:var(--muted);font-size:12px;width:72px;flex:none">Accent</span>
        <div class="swatches" style="justify-content:flex-start;flex-wrap:wrap">${ACCENTS.map(([n, h]) =>
          `<button class="swatch ${S.ui.accent === h ? "cur" : ""}" data-acc="${h === null ? "" : h}" title="${n}" aria-label="${n}"
            style="background:${h === null ? "#0E6B5C" : `hsl(${h} 60% 44%)`}"></button>`).join("")}</div>
      </div>
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
        <span class="d" style="color:var(--muted);font-size:12px;width:72px;flex:none">Wallpaper</span>
        <button class="pillbtn" id="wallBtn">${S.ui.wallTitle ? "🎞 " + esc(S.ui.wallTitle) : "Pick a movie scene"}</button>
      </div>
    </div>
    <div class="sechead">Taste breakdown</div>
    <div class="card" style="padding:14px">
      ${dist.map(([l,c,col]) => `<div class="distrow"><span class="lbl">${l}</span>
        <span class="bar"><span class="fill" style="width:${Math.round(c/n*100)}%;background:${col}"></span></span>
        <span class="cnt">${c}</span></div>`).join("")}
    </div>
    ${topGenres.length ? `<div class="sechead">Most-ranked genres</div>
      <div class="chips">${topGenres.map(([g,c]) => `<span class="chip">${esc(g)} · ${c}</span>`).join("")}</div>` : ""}
    ${ids.length ? `<div class="sechead">Podium</div><div class="card">${
      ids.slice(0,3).map((id,i) => { const m = getMovie(id); return `<button class="row" data-open="${id}">
        <span class="rankno">${["🥇","🥈","🥉"][i]}</span>${posterHTML(m,"p-sm")}
        <span class="meta"><span class="t">${esc(m.title)}</span><span class="d">${esc([m.year, m.genre].filter(x => x && x !== "—").join(" · "))}</span></span>
        ${scoreHTML(scoreOf(id))}</button>`; }).join("")}</div>` : ""}
    <div style="display:flex;gap:9px;margin-top:18px;flex-wrap:wrap">
      ${cloud ? `<button class="pillbtn soft" id="shareProfBtn">Share my profile</button>` : ""}
      ${ids.length ? `<button class="pillbtn soft" id="shareBtn">Share my top 5</button>` : ""}
      <button class="pillbtn" id="exportBtn">Back up data</button>
      <button class="pillbtn" id="importBtn">Restore backup</button>
      ${authed() ? `<button class="pillbtn" id="logoutBtn">Log out</button>` : ""}
    </div>
    <button class="danger" id="resetBtn">Reset all my data</button>
    <div style="color:var(--muted);font-size:10.5px;margin-top:14px">Reeli build ${BUILD}</div>`;
  const eb = $("#editBtn"); if(eb) eb.addEventListener("click", () => openAccountForm());
  const fsb = $("#finishSetupBtn"); if(fsb) fsb.addEventListener("click", openClaimHandle);
  const lo2 = $("#logoutBtn2"); if(lo2) lo2.addEventListener("click", doLogout);
  $("#tasteBtn").addEventListener("click", () => { O = null; openOnboarding(1); });
  $("#profileWrap").querySelectorAll("[data-acc]").forEach(b => b.addEventListener("click", () => {
    S.ui.accent = b.dataset.acc === "" ? null : +b.dataset.acc;
    save(); applyUI(); renderProfile();
  }));
  $("#wallBtn").addEventListener("click", openWallPicker);
  const lo = $("#logoutBtn"); if(lo) lo.addEventListener("click", doLogout);
  const sp = $("#shareProfBtn");
  if(sp) sp.addEventListener("click", () =>
    openShare("Check my movie taste on Reeli 🎬", location.origin + location.pathname + "?u=" + encodeURIComponent(CLOUD.profile.handle)));
  const su = $("#signupBtn"); if(su) su.addEventListener("click", () => openAuthSheet("signup"));
  const li = $("#loginBtn"); if(li) li.addEventListener("click", () => openAuthSheet("login"));
  $("#exportBtn").addEventListener("click", () => {
    const text = JSON.stringify({reeli:1, app:S, posters:POSTERS.cache});
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(() => toast("Backup copied — paste it somewhere safe"), () => toast("Couldn't copy here"));
    } else toast("Couldn't copy here");
  });
  $("#importBtn").addEventListener("click", () => {
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
  });
  const sb5 = $("#shareBtn");
  if(sb5) sb5.addEventListener("click", () => {
    const top = ids.slice(0,5).map((id,i) => `${i+1}. ${getMovie(id).title} — ${scoreOf(id).toFixed(1)}`).join("\n");
    openShare(`My top 5 on Reeli 🎬\n${top}\nWhat's yours?`,
      cloud ? location.origin + location.pathname + "?u=" + encodeURIComponent(CLOUD.profile.handle) : "https://reeli.org/");
  });
  $("#resetBtn").addEventListener("click", () => {
    if(confirm("Wipe your rankings, watchlist and activity? This can't be undone.")){
      localStorage.removeItem(KEY); localStorage.removeItem("reeli-posters");
      S = seed(); save(); nav("feed"); openOnboarding(0);
    }
  });
  wireCommon($("#profileWrap"));
}

/* ---------- onboarding: Beli-style taste picker (guest-first) ---------- */
const AVATAR_HUES = [172, 262, 22, 335, 205, 45];
const OB_GENRES = ["Drama","Sci-Fi","Crime","Thriller","Comedy","Animation","Horror","Action","Romance","Fantasy","Mystery","Documentary","War","Adventure","Western"];
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
    sheet.querySelectorAll("[data-g]").forEach(b => b.addEventListener("click", () => {
      const g = b.dataset.g; O.genres.has(g) ? O.genres.delete(g) : O.genres.add(g); b.classList.toggle("sel");
    }));
  } else if(n === 2){
    openSheet(`
      <div class="step">Your taste · 2 of 3</div>
      <h1 class="h1" style="text-align:center;margin-top:12px">Filmmakers you rate</h1>
      <p class="sub" style="text-align:center">Directors and writer-directors whose work you seek out.</p>
      <div class="chipgrid">${OB_MAKERS.map(d => `<button class="chippick ${O.dirs.has(d)?"sel":""}" data-d="${esc(d)}">${esc(d)}</button>`).join("")}</div>
      <div class="obfoot"><button class="pillbtn acc" data-ob="3" style="padding:11px 22px">Next</button><button class="pillbtn" data-ob="skip">Skip the rest</button></div>${obDots(2)}`);
    sheet.querySelectorAll("[data-d]").forEach(b => b.addEventListener("click", () => {
      const d = b.dataset.d; O.dirs.has(d) ? O.dirs.delete(d) : O.dirs.add(d); b.classList.toggle("sel");
    }));
  } else if(n === 3){
    const cands = DB.map(a => MOVIES[a[0]])
      .filter(m => !isRanked(m.id))
      .sort((a,b) => ((O.genres.has(b.genre)?2:0)+(O.dirs.has(b.dir)?3:0)) - ((O.genres.has(a.genre)?2:0)+(O.dirs.has(a.dir)?3:0)))
      .slice(0, 18);
    openSheet(`
      <div class="step">Your taste · 3 of 3</div>
      <h1 class="h1" style="text-align:center;margin-top:12px">Tap a few you've seen and loved</h1>
      <p class="sub" style="text-align:center">They become your first ranked movies — first tap ranks highest. You can re-rank anytime.</p>
      <div class="pickgrid">${cands.map(m => `<button class="pcard" data-m="${m.id}">${posterHTML(m,"p-md")}<span class="pt">${esc(m.title)}</span></button>`).join("")}</div>
      <div class="obfoot"><button class="pillbtn acc" data-ob="done" style="padding:11px 22px">Finish setup</button><button class="pillbtn" data-ob="skip">Skip</button></div>${obDots(3)}`);
    sheet.querySelectorAll("[data-m]").forEach(b => b.addEventListener("click", () => {
      const id = b.dataset.m; O.movies.has(id) ? O.movies.delete(id) : O.movies.add(id); b.classList.toggle("sel");
    }));
  }
  sheet.querySelectorAll("[data-ob]").forEach(b => b.addEventListener("click", () => {
    const v = b.dataset.ob;
    if(v === "skip" || v === "done") finishOnboarding(v === "done");
    else obStep(+v);
  }));
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
function openAccountForm(){
  const isNew = !S.profile;
  const P = S.profile || {name:"", handle:"@", hue:172};
  openSheet(`
    <h1 class="h1">${isNew ? "Set up your profile" : "Edit profile"}</h1>
    ${isNew ? `<p class="sub">This personalizes your device. Real accounts with cloud sync are switching on shortly — your profile and rankings will carry over.</p>` : ""}
    <div style="display:grid;gap:10px;margin-top:10px">
      <input class="field" id="ename" value="${esc(P.name)}" maxlength="24">
      <input class="field" id="ehandle" value="${esc(P.handle)}" maxlength="20">
      <div class="swatches">${AVATAR_HUES.map(h => `<button class="swatch ${P.hue===h?"cur":""}" data-ehue="${h}" style="background:hsl(${h} 45% 45%)" aria-label="Avatar color"></button>`).join("")}</div>
      ${authed() && CLOUD.profile ? `<label class="pillbtn" style="text-align:center;cursor:pointer">📷 Upload profile photo<input id="pfpFile" type="file" accept="image/*" style="display:none"></label>` : ""}
      <div style="display:flex;gap:9px"><button class="pillbtn acc" id="esave">Save</button><button class="pillbtn" id="ecancel">Cancel</button></div>
    </div>`);
  const pfp = $("#pfpFile");
  if(pfp) pfp.addEventListener("change", () => {
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
  });
  let hue = P.hue;
  sheet.querySelectorAll("[data-ehue]").forEach(b => b.addEventListener("click", () => {
    hue = +b.dataset.ehue;
    sheet.querySelectorAll(".swatch").forEach(s => s.classList.toggle("cur", +s.dataset.ehue === hue));
  }));
  $("#ecancel").addEventListener("click", closeSheet);
  $("#esave").addEventListener("click", async () => {
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
  });
}

/* ---------- common wiring ---------- */
function wireCommon(root){
  root.querySelectorAll("[data-open]").forEach(b => b.addEventListener("click", () => openDetail(b.dataset.open)));
  root.querySelectorAll("[data-rate]").forEach(b => b.addEventListener("click", e => { e.stopPropagation(); startRate(b.dataset.rate); }));
  root.querySelectorAll("[data-watch]").forEach(b => b.addEventListener("click", e => {
    e.stopPropagation();
    const id = b.dataset.watch;
    if(S.watch.includes(id)){ S.watch = S.watch.filter(x=>x!==id); toast("Removed from watchlist"); }
    else { ensureSaved(id); S.watch.unshift(id); toast("Added to watchlist 🔖"); }
    save(); render(cur);
  }));
  root.querySelectorAll("[data-like]").forEach(b => b.addEventListener("click", () => {
    const k = b.dataset.like;
    S.likes[k] = !S.likes[k]; if(!S.likes[k]) delete S.likes[k];
    save(); renderFeed();
  }));
  root.querySelectorAll("[data-clike]").forEach(b => b.addEventListener("click", () => {
    const [u, mv] = b.dataset.clike.split("|");
    toggleCloudLike(u, mv, b);
  }));
  root.querySelectorAll("[data-person]").forEach(b => b.addEventListener("click", () => openPerson(b.dataset.person)));
  root.querySelectorAll("[data-gosearch]").forEach(b => b.addEventListener("click", () => nav("search")));
}

/* ---------- overlay ---------- */
const overlay = $("#overlay"), sheet = $("#sheet");
let sheetLocked = false;
function openSheet(html, locked){ sheetLocked = !!locked; sheet.innerHTML = (locked ? "" : `<div class="grab"></div>`) + html; overlay.classList.add("on"); hydratePosters(sheet); }
function closeSheet(force){ if(sheetLocked && !force) return; sheetLocked = false; overlay.classList.remove("on"); sheet.innerHTML = ""; }
overlay.addEventListener("click", e => { if(e.target === overlay) closeSheet(); });
document.addEventListener("keydown", e => { if(e.key === "Escape") closeSheet(); });

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
          ${scoreHTML(scoreOf(id))}<div class="d" style="font-size:12.5px">#${rankOf(id)} of ${allRanked().length}<br>on your list</div></div>` : ""}
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
  sheet.querySelectorAll("[data-a]").forEach(b => b.addEventListener("click", () => {
    const a = b.dataset.a;
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
  }));
}

/* ---------- custom add ---------- */
function openCustom(){
  openSheet(`
    <h1 class="h1">Add a movie</h1>
    <p class="sub">It joins your personal database and is ready to rank.</p>
    <div style="display:grid;gap:10px">
      <input id="ctitle" placeholder="Title" style="padding:12px 14px;border-radius:12px;border:1px solid var(--line);background:var(--surface);color:var(--ink);font-size:15px">
      <input id="cyear" placeholder="Year" inputmode="numeric" maxlength="4" style="padding:12px 14px;border-radius:12px;border:1px solid var(--line);background:var(--surface);color:var(--ink);font-size:15px">
      <input id="cgenre" placeholder="Genre (optional)" style="padding:12px 14px;border-radius:12px;border:1px solid var(--line);background:var(--surface);color:var(--ink);font-size:15px">
      <div style="display:flex;gap:9px;margin-top:4px">
        <button class="pillbtn acc" id="csave">Add &amp; rank</button>
        <button class="pillbtn" id="ccancel">Cancel</button>
      </div>
    </div>`);
  $("#ccancel").addEventListener("click", closeSheet);
  $("#csave").addEventListener("click", () => {
    const t = $("#ctitle").value.trim();
    if(!t){ $("#ctitle").focus(); return; }
    const y = parseInt($("#cyear").value,10);
    const m = {id:"c_"+Date.now(), title:t, year:(y>=1888 && y<=2030)?y:"—", genre:$("#cgenre").value.trim()||"Film", dir:"—", hue:hueFromTitle(t)};
    S.custom.push(m); save();
    startRate(m.id);
  });
}

/* ---------- rating flow ---------- */
let R = null; // {id, bucket, lo, hi}
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
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--good)" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M8.5 14.5c1 1.3 2.2 2 3.5 2s2.5-.7 3.5-2"/><path d="M9 9.6h.01M15 9.6h.01" stroke-width="2.6"/></svg></span>
        <span><b>Loved it</b><span>The kind you tell people about</span></span></button>
      <button class="bucket" data-b="fine"><span class="dot" style="background:var(--mid-soft)">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--mid)" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M8.5 15h7"/><path d="M9 9.6h.01M15 9.6h.01" stroke-width="2.6"/></svg></span>
        <span><b>It was fine</b><span>Watchable. Forgettable. Fine.</span></span></button>
      <button class="bucket" data-b="disliked"><span class="dot" style="background:var(--bad-soft)">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--bad)" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M8.5 16c1-1.3 2.2-2 3.5-2s2.5.7 3.5 2"/><path d="M9 9.6h.01M15 9.6h.01" stroke-width="2.6"/></svg></span>
        <span><b>Not for me</b><span>Two hours you want back</span></span></button>
    </div>`);
  sheet.querySelectorAll("[data-b]").forEach(b => b.addEventListener("click", () => pickBucket(b.dataset.b)));
}
function pickBucket(bucket){
  removeRanking(R.id); // re-rank support
  R.bucket = bucket;
  R.lo = 0; R.hi = S[bucket].length;
  R.n = 0;
  stepCompare();
}
function stepCompare(){
  if(R.lo >= R.hi){ placeAt(R.lo); return; }
  const mid = (R.lo + R.hi) >> 1;
  const a = getMovie(R.id), b = getMovie(S[R.bucket][mid]);
  if(!b){ placeAt(R.lo); return; }
  R.n++;
  const total = S[R.bucket].length;
  const left = Math.max(0, Math.ceil(Math.log2(Math.max(R.hi - R.lo, 1))) - 1);
  openSheet(`
    <div class="step">Matchup ${R.n} · ${left ? "about " + left + " more after this" : "last one"} · ${total} ${total===1?"movie":"movies"} you ${R.bucket === "loved" ? "loved" : R.bucket === "fine" ? "found fine" : "didn't like"}</div>
    <h1 class="h1" style="text-align:center;margin-top:14px">Which did you like more?</h1>
    <div class="faceoff">
      <button class="contender" data-pick="new">${posterHTML(a,"p-md")}<span class="t">${esc(a.title)}</span><span class="d">${a.year}</span></button>
      <span class="vs">VS</span>
      <button class="contender" data-pick="old">${posterHTML(b,"p-md")}<span class="t">${esc(b.title)}</span><span class="d">${b.year}</span></button>
    </div>
    <button class="tiebtn" data-pick="tie">Too close to call</button>
    <span class="kbdhint"><b>←</b> left wins · <b>→</b> right wins · <b>T</b> too close</span>`);
  sheet.querySelectorAll("[data-pick]").forEach(btn => btn.addEventListener("click", () => {
    const p = btn.dataset.pick;
    if(p === "new") R.hi = mid;
    else if(p === "old") R.lo = mid + 1;
    else { placeAt(mid + 1); return; }
    stepCompare();
  }));
}
function placeAt(idx){
  ensureSaved(R.id);
  SYNC_TOUCH = R.id;
  S[R.bucket].splice(idx, 0, R.id);
  S.watch = S.watch.filter(x => x !== R.id);
  const m = getMovie(R.id), sc = scoreOf(R.id), rk = rankOf(R.id);
  S.myFeed.unshift({movie:R.id, score:sc, time:"just now", note:"", likes:0, rank:rk});
  if(S.myFeed.length > 6) S.myFeed.pop();
  save();
  // catalog movies arrive without genre/director — backfill so lists show them
  enrich(R.id, ok => { if(ok){ save(); if(cur === "ranks") renderRanks(); } });
  openSheet(`
    <div class="result">
      ${posterHTML(m,"p-lg")}
      <h2>${esc(m.title)}</h2>
      ${scoreHTML(sc,"bigscore")}
      <p>Locked in at <b>#${rk}</b> of ${allRanked().length} on your list.<br>Scores shift as your ranking grows — that's the fun part.</p>
      <input class="field" id="takeInp" placeholder="Add a hot take (optional) — your Reelmates will see it" maxlength="280" style="width:100%">
      <div style="display:flex;gap:9px;margin-top:6px">
        <button class="pillbtn acc" id="doneBtn">See my ranking</button>
        <button class="pillbtn" id="moreBtn">Rank another</button>
        <button class="pillbtn" id="undoBtn">Undo</button>
      </div>
    </div>`);
  const placedId = R.id;
  const commitTake = () => {
    const inp = $("#takeInp");
    const v = inp ? inp.value.trim().slice(0, 280) : "";
    if(v){
      S.notes[placedId] = v;
      if(S.myFeed[0] && S.myFeed[0].movie === placedId) S.myFeed[0].note = v;
      save();
    }
  };
  $("#doneBtn").addEventListener("click", () => { commitTake(); closeSheet(); nav("ranks"); });
  $("#moreBtn").addEventListener("click", () => { commitTake(); closeSheet(); nav("search"); });
  $("#undoBtn").addEventListener("click", () => {
    removeRanking(placedId);
    delete S.notes[placedId];
    if(S.myFeed.length && S.myFeed[0].movie === placedId) S.myFeed.shift();
    save(); closeSheet(); render(cur); toast("Ranking undone");
  });
  R = null;
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
  sheet.querySelectorAll("[data-wall]").forEach(b => b.addEventListener("click", () => {
    S.ui.wall = b.dataset.wall; S.ui.wallTitle = b.dataset.wt;
    save(); applyUI();
    sheet.querySelectorAll(".pcard").forEach(c => c.classList.toggle("sel", c.dataset.wall === S.ui.wall));
  }));
  $("#wallOff").addEventListener("click", () => { S.ui.wall = null; S.ui.wallTitle = null; save(); applyUI(); closeSheet(); renderProfile(); });
  $("#wallDone").addEventListener("click", () => { closeSheet(); if(cur === "profile") renderProfile(); });
}

/* ---------- share sheet: native share + platform intents ---------- */
function openShare(text, url){
  const enc = encodeURIComponent;
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
  const shn = $("#shNative");
  if(shn) shn.addEventListener("click", () => navigator.share({title:"Reeli", text, url}).catch(() => {}));
  $("#shX").addEventListener("click", () => window.open("https://twitter.com/intent/tweet?text=" + enc(text) + "&url=" + enc(url), "_blank", "noopener"));
  $("#shFb").addEventListener("click", () => window.open("https://www.facebook.com/sharer/sharer.php?u=" + enc(url), "_blank", "noopener"));
  $("#shCopy").addEventListener("click", () => {
    if(navigator.clipboard && navigator.clipboard.writeText)
      navigator.clipboard.writeText(url).then(() => toast("Link copied"), () => toast(url));
  });
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
window.addEventListener("online", () => { queueSync(); if(authed()) refreshCloudFeed(); });
S.watch = S.watch.filter(id => getMovie(id));
updateBadge();
nav("feed");
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
  if(!CLOUD.profile && authed()) openClaimHandle();
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
