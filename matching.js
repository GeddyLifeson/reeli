/* Reeli: fuzzy title matching against the worldwide catalog.

   Pure functions — no DOM, no app state, no network. This is the logic that
   decides which catalog result IS the movie you meant, and getting it wrong is
   how a title ends up with somebody else's poster, so it lives here where it
   can be tested (see test-ranking.mjs).

   Loaded from index.html as a plain <script src="matching.js"> before app.js;
   the declarations below become globals that app.js calls at runtime. Also
   require()d directly by the Node test file via the CommonJS shim at the end,
   which the browser never sees (`module` is undefined there). */
'use strict';

/* Fold a title down to comparable tokens: lowercase, punctuation to spaces.
   "Star Wars: Episode IV - A New Hope" -> "star wars episode iv a new hope" */
function normT(s){ return String(s).toLowerCase().replace(/[^a-z0-9]+/g," ").trim(); }

/* Bounded Levenshtein edit distance, for stylized titles ("Se7en" vs "Seven").
   Bails out early when the length gap alone exceeds `cap`, and never returns a
   value above cap + 1 — callers only ever compare it against cap. */
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

/* Score every candidate instead of taking the first loose match — handles
   retitles ("Star Wars: Episode IV - A New Hope") and stylizations ("Se7en" is
   catalogued as "Seven"). Returns the best candidate, or null if nothing clears
   the bar.

   Scoring, highest wins:
     exact normalized title            +100
     within the fuzz cap (len/8)        +90
     one contains the other             +65 * length ratio (floor 0.35)
     all title words present            +55
     >= 60% of title words present      +25
     otherwise                         -100
     release year exact / ±1 / ±2 / more  +30 / +20 / 0 / -60
     has a poster                        +5

   The 55 threshold keeps subtitle variants ("Dune: Part One" -> "Dune" 2021,
   score 58) while still rejecting title-squatters (a "Se7en" parody scores 48). */
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
  return bestScore >= 55 ? best : null;
}

/* Node-only: lets test-ranking.mjs require() this file. Invisible in a browser. */
if(typeof module !== "undefined" && module.exports)
  module.exports = { normT, lev, pickMeta };
