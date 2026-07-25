/* Reeli's test suite. No dependencies, no test runner — just node.
 *
 *     node test-ranking.mjs
 *
 * Covers the two pieces of pure logic the app is actually built on:
 *
 *   ranking.js   the binary-search insertion that decides where a movie lands
 *                in your list, and therefore what score it gets
 *   matching.js  the fuzzy title matcher that decides which catalog entry is
 *                the movie you meant, and therefore whose poster you see
 *
 * The ranking tests include a differential check against a transcription of the
 * original inline stepCompare/placeAt loop, so the extraction into ranking.js is
 * provably behaviour-preserving and not just plausible.
 *
 * The other harnesses under test/ cover the parts that need a DOM:
 *   node test/render-diff.mjs       markup is unchanged by the refactor
 *   node test/delegation.mjs        every control is routed and dispatches
 *   node test/watchlist-sync.mjs    the watchlist RLS failure is surfaced
 */
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const {rankInit, rankRemaining, rankStep, rankChoose, rankInsert} = require("./ranking.js");
const {normT, lev, pickMeta} = require("./matching.js");

let pass = 0, fail = 0;
const ok = (c, m) => { if(c){ pass++; } else { fail++; console.log("  FAIL  " + m); } };
const group = m => console.log("\n" + m);
const eq = (a, b, m) => ok(JSON.stringify(a) === JSON.stringify(b), `${m}\n           got ${JSON.stringify(a)}\n           want ${JSON.stringify(b)}`);

/* deterministic PRNG so a failure is always reproducible */
function rng(seed){
  let s = (seed >>> 0) || 1;
  return () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
}

/* ======================================================================== */
group("ranking.js — state machine");

eq(rankInit(0), {lo:0, hi:0, n:0}, "rankInit on an empty bucket");
eq(rankInit(7), {lo:0, hi:7, n:0}, "rankInit on a bucket of 7");

eq(rankStep(rankInit(0), i => undefined), {type:"place", index:0},
   "an empty bucket places immediately, with no matchup");
{
  const st = rankInit(1);
  eq(rankStep(st, i => "x"), {type:"compare", mid:0, n:1, remaining:0},
     "a bucket of 1 asks exactly one matchup and says it is the last");
  eq(st.n, 1, "rankStep counts the matchup it just produced");
}
{
  const st = rankInit(8);
  const s1 = rankStep(st, i => "x");
  eq(s1.mid, 4, "first matchup on a bucket of 8 is against index 4");
  eq(s1.remaining, 2, "…with about 2 more expected after it");
}
/* the safety valve: the bucket shrank underneath an in-progress ranking */
eq(rankStep({lo:0, hi:5, n:0}, i => undefined), {type:"place", index:0},
   "a missing contender places at lo rather than rendering an empty matchup");
{
  const st = {lo:2, hi:9, n:3};
  eq(rankStep(st, i => null), {type:"place", index:2}, "…at lo, not at 0");
  eq(st.n, 3, "…and does not count a matchup that was never shown");
}

eq([0,1,2,3,4,8,9,16,17].map(w => rankRemaining(0, w)), [0,0,0,1,1,2,3,3,4],
   "rankRemaining over widths 0..17");

{
  const st = {lo:0, hi:8, n:1};
  ok(rankChoose(st, 4, "new") === null && st.hi === 4 && st.lo === 0, "'new' narrows to the upper half");
}
{
  const st = {lo:0, hi:8, n:1};
  ok(rankChoose(st, 4, "old") === null && st.lo === 5 && st.hi === 8, "'old' narrows to the lower half");
}
eq(rankChoose({lo:0, hi:8, n:1}, 4, "tie"), {type:"place", index:5},
   "'tie' stops the search and parks the movie just below the incumbent");

/* ======================================================================== */
group("ranking.js — insertion produces a correctly ordered list");

/* A comparator standing in for a user with perfectly consistent taste: every
   movie has a hidden true score, and they always pick the better one. */
const byScore = truth => (a, b) => (truth[a] > truth[b] ? "new" : "old");

for(let seed = 1; seed <= 400; seed++){
  const r = rng(seed);
  const count = 1 + Math.floor(r() * 25);
  const truth = {};
  const ids = [];
  for(let i = 0; i < count; i++){ const id = "m" + i; ids.push(id); truth[id] = r(); }
  /* insert in a random order — the ranking must not depend on it */
  const order = ids.slice().sort(() => r() - 0.5);
  let list = [];
  for(const id of order) list = rankInsert(list, id, byScore(truth)).list;

  const sortedDesc = ids.slice().sort((a, b) => truth[b] - truth[a]);
  if(JSON.stringify(list) !== JSON.stringify(sortedDesc)){
    ok(false, `seed ${seed}: ${count} movies inserted in a random order did not end up in true-score order`);
    break;
  }
  if(seed === 400) ok(true, "");
}
ok(true, "400 random insertion sequences (1–25 movies) all produce true-score order");

/* the same list, built in two different orders, must come out the same */
{
  let same = true;
  for(let seed = 1; seed <= 100 && same; seed++){
    const r = rng(seed * 7919);
    const truth = {};
    const ids = [];
    for(let i = 0; i < 12; i++){ const id = "m" + i; ids.push(id); truth[id] = r(); }
    const build = order => order.reduce((l, id) => rankInsert(l, id, byScore(truth)).list, []);
    const a = build(ids.slice().sort(() => r() - 0.5));
    const b = build(ids.slice().sort(() => r() - 0.5));
    same = JSON.stringify(a) === JSON.stringify(b);
  }
  ok(same, "insertion order does not change the final ranking");
}

/* binary search, so the matchup count must stay logarithmic */
{
  let worst = 0, bad = null;
  for(let seed = 1; seed <= 200; seed++){
    const r = rng(seed * 104729);
    const truth = {};
    let list = [];
    for(let i = 0; i < 60; i++){
      const id = "m" + i; truth[id] = r();
      const {list: next, comparisons} = rankInsert(list, id, byScore(truth));
      const bound = Math.ceil(Math.log2(list.length + 1));
      if(comparisons > bound) bad = `inserting into ${list.length} took ${comparisons} matchups (bound ${bound})`;
      worst = Math.max(worst, comparisons);
      list = next;
    }
  }
  ok(bad === null, "matchups never exceed ceil(log2(n+1))" + (bad ? ": " + bad : ""));
  ok(worst <= 6, `worst case over 60-movie lists was ${worst} matchups`);
}

/* a "too close to call" ends the search on the spot */
{
  let worst = 0;
  for(let n = 0; n < 40; n++){
    const list = Array.from({length: n}, (_, i) => "m" + i);
    const {comparisons, index} = rankInsert(list, "new", () => "tie");
    worst = Math.max(worst, comparisons);
    ok(n === 0 ? index === 0 : index === (n >> 1) + 1, `a tie against a ${n}-movie list places just below the midpoint`);
  }
  ok(worst <= 1, "a tie is always answered on the very first matchup");
}

/* boundary placements */
eq(rankInsert([], "a", () => "new").index, 0, "the first movie in a bucket lands at 0");
eq(rankInsert(["x","y","z"], "a", () => "new").list, ["a","x","y","z"], "beating everything lands at the top");
eq(rankInsert(["x","y","z"], "a", () => "old").list, ["x","y","z","a"], "losing to everything lands at the bottom");
{
  const before = ["x","y","z"];
  rankInsert(before, "a", () => "new");
  eq(before, ["x","y","z"], "rankInsert leaves the caller's list alone");
}

/* ======================================================================== */
group("ranking.js — differential against the original inline loop");

/* A faithful transcription of the pre-refactor stepCompare/placeAt flow, before
   any of it moved into ranking.js. If the two disagree on any sequence, the
   extraction changed behaviour. */
function originalInsert(list, id, compare){
  let lo = 0, hi = list.length, n = 0;
  const place = idx => { const out = list.slice(); out.splice(idx, 0, id); return {list: out, index: idx, comparisons: n}; };
  for(;;){
    if(lo >= hi) return place(lo);
    const mid = (lo + hi) >> 1;
    const b = list[mid];
    if(!b) return place(lo);
    n++;
    const p = compare(id, b);
    if(p === "new") hi = mid;
    else if(p === "old") lo = mid + 1;
    else return place(mid + 1);
  }
}
{
  let bad = null;
  for(let seed = 1; seed <= 600 && !bad; seed++){
    const r = rng(seed * 2654435761);
    const n = Math.floor(r() * 30);
    const list = Array.from({length: n}, (_, i) => "m" + i);
    /* an arbitrary, possibly inconsistent user — including ties and a chance of
       an answer no reasonable person would give, to cover odd paths too */
    const answers = [];
    const compare = () => { const v = r(); const a = v < 0.45 ? "new" : v < 0.9 ? "old" : "tie"; answers.push(a); return a; };
    let i = 0;
    const replay = () => answers[i++];
    const A = originalInsert(list, "new!", compare);
    i = 0;
    const B = rankInsert(list, "new!", replay);
    if(JSON.stringify(A) !== JSON.stringify(B))
      bad = `seed ${seed}, list of ${n}, answers ${answers.join(",")}\n           original ${JSON.stringify(A)}\n           ranking.js ${JSON.stringify(B)}`;
  }
  ok(bad === null, "600 random answer sequences: ranking.js matches the original loop exactly" + (bad ? "\n           " + bad : ""));
}

/* ======================================================================== */
group("matching.js — normT");

eq(normT("Star Wars: Episode IV - A New Hope"), "star wars episode iv a new hope", "punctuation collapses to spaces");
eq(normT("  WALL·E  "), "wall e", "leading/trailing space is trimmed");
eq(normT("Amélie"), "am lie", "non-ASCII letters are dropped, not transliterated");
eq(normT("Se7en"), "se7en", "digits survive");
eq(normT(1994), "1994", "non-strings are coerced");
eq(normT(""), "", "the empty string stays empty");

/* ======================================================================== */
group("matching.js — lev");

/* unbounded reference implementation to check the real one against */
function refLev(a, b){
  const d = Array.from({length: a.length + 1}, (_, i) => [i, ...Array(b.length).fill(0)]);
  for(let j = 0; j <= b.length; j++) d[0][j] = j;
  for(let i = 1; i <= a.length; i++)
    for(let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i-1][j] + 1, d[i][j-1] + 1, d[i-1][j-1] + (a[i-1] === b[j-1] ? 0 : 1));
  return d[a.length][b.length];
}
eq(lev("kitten", "sitting", 9), 3, "kitten -> sitting is 3 edits");
eq(lev("seven", "se7en", 9), 1, "seven -> se7en is 1 edit (the stylization this exists for)");
eq(lev("abc", "abc", 3), 0, "identical strings are 0 apart");
eq(lev("", "abc", 5), 3, "against the empty string, the distance is the length");
eq(lev("abc", "", 5), 3, "…in either direction");
eq(lev("abc", "abcdefghij", 2), 3, "a length gap wider than the cap short-circuits to cap + 1");
ok(lev("abcdefgh", "a", 2) === 3, "the short-circuit ignores the actual distance, which is the point");

{
  const alpha = "abcde";
  let bad = null;
  for(let seed = 1; seed <= 3000 && !bad; seed++){
    const r = rng(seed);
    const s = n => Array.from({length: n}, () => alpha[Math.floor(r() * alpha.length)]).join("");
    const a = s(Math.floor(r() * 9)), b = s(Math.floor(r() * 9));
    const cap = 1 + Math.floor(r() * 5);
    const got = lev(a, b, cap), want = refLev(a, b);
    /* the cap is only a length short-circuit, so whenever it does not fire the
       answer must be the true edit distance */
    if(Math.abs(a.length - b.length) <= cap && got !== want) bad = `lev(${a},${b},${cap}) = ${got}, true = ${want}`;
    if(lev(a, b, cap) !== lev(b, a, cap)) bad = `lev is not symmetric for (${a}, ${b}, ${cap})`;
  }
  ok(bad === null, "3000 random string pairs match an unbounded reference, and lev is symmetric" + (bad ? ": " + bad : ""));
}

/* ======================================================================== */
group("matching.js — pickMeta");

const meta = (name, year, extra) => Object.assign({name, releaseInfo: String(year), id: "tt" + (1000000 + name.length),
  poster: "https://p/" + encodeURIComponent(name)}, extra || {});

eq(pickMeta([], "Inception", 2010), null, "no candidates means no match");
eq(pickMeta([meta("Inception", 2010)], "Inception", 2010).name, "Inception", "an exact title + year is picked");
eq(pickMeta([{name: "Inception", releaseInfo: "2010"}], "Inception", 2010), null,
   "a candidate with neither poster nor id is skipped entirely");
ok(pickMeta([{name: "Inception", releaseInfo: "2010", id: "tt1375666"}], "Inception", 2010) !== null,
   "…but an id alone is enough to consider it");

/* the stylization the fuzzy path exists for */
eq(pickMeta([meta("Seven", 1995)], "Se7en", 1995).name, "Seven", "Se7en 1995 resolves to the catalogued 'Seven'");

/* the title-squatter the scoring is tuned to reject */
eq(pickMeta([meta("Kaori's SM Se7en", 1996)], "Se7en", 1995), null,
   "a longer title merely containing 'Se7en', a year off, is rejected");
{
  const picked = pickMeta([meta("Kaori's SM Se7en", 1996), meta("Seven", 1995)], "Se7en", 1995);
  eq(picked && picked.name, "Seven", "…and loses outright when the real film is also in the list");
}

/* the subtitle variant the 55 threshold exists to keep */
eq(pickMeta([meta("Dune", 2021)], "Dune: Part One", 2021).name, "Dune",
   "'Dune: Part One' 2021 still matches the catalogued 'Dune' 2021");
eq(pickMeta([meta("Dune", 1984)], "Dune: Part One", 2021), null,
   "…but not the 1984 Dune, 37 years out");

/* The 0.35 floor under the containment ratio. A short catalogue title sitting
   inside a much longer wanted one scores 65 * ratio, which for a long subtitle
   would fall under the bar even with the year and the poster both right. The
   floor is what keeps those matching — remove it and this case goes null. */
ok(pickMeta([meta("Dune", 2026)], "Dune: Part Three — The Reckoning", 2026) !== null,
   "a short catalogue title inside a much longer wanted one still clears the bar");

/* the year is a strong signal in both directions */
eq(pickMeta([meta("Inception", 2010), meta("Inception", 1999)], "Inception", 2010).releaseInfo, "2010",
   "between two identical titles, the right year wins");
ok(pickMeta([meta("Inception", 2011)], "Inception", 2010) !== null, "a year off by one is still accepted");
ok(pickMeta([meta("Inception", 2003)], "Inception", 2010) === null, "a year off by seven is not");

/* retitles: every word of the wanted title is present */
ok(pickMeta([meta("Star Wars: Episode IV - A New Hope", 1977)], "Star Wars: A New Hope", 1977) !== null,
   "the Star Wars retitle is matched through the word-overlap path");

/* unrelated films must not be dragged in */
eq(pickMeta([meta("The Godfather Part III", 1990)], "Barbie", 2023), null, "an unrelated title scores below the bar");
eq(pickMeta([meta("Up", 2009)], "Us", 2019), null, "two-letter titles a year apart do not collide");

/* pickMeta returns the caller's own object, not a copy */
{
  const cands = [meta("Arrival", 2016)];
  ok(pickMeta(cands, "Arrival", 2016) === cands[0], "the winning candidate is returned by reference");
}
/* missing/garbled fields must not throw */
ok(pickMeta([{id: "tt1", name: undefined, releaseInfo: undefined}], "Anything", 2000) === null,
   "a candidate with no usable name is handled, not thrown on");
ok(pickMeta([meta("Heat", 1995)], "Heat", 0) !== null, "a movie with no known year still matches on title alone");

/* ======================================================================== */
console.log(`\n  ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
