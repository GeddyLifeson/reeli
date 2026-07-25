/* Reeli: the ranking algorithm.

   Reeli has no star ratings — a movie's score comes from where it lands in your
   list, and it gets there by binary-search insertion: you pick a bucket (loved /
   fine / disliked), then answer ~log2(n) head-to-head matchups against movies
   already in that bucket until there is exactly one slot left.

   This file is the algorithm and nothing else: no DOM, no `S`, no sheet
   rendering, no network. app.js owns the state and the markup and drives this
   as a small state machine — rankStep() says what to show next, rankChoose()
   folds the answer back in. That split is what makes the ordering testable
   without a browser (see test-ranking.mjs).

   The state object is {lo, hi, n}:
     lo, hi  the half-open index range [lo, hi) the movie could still belong in
     n       how many matchups have been shown, for the "Matchup 3" counter

   Loaded from index.html as a plain <script src="ranking.js"> before app.js;
   the declarations below become globals. Also require()d by the Node test file
   via the CommonJS shim at the end, which the browser never sees. */
'use strict';

/* Start placing a movie into a bucket that currently holds `size` movies.
   The whole range is open, so the first matchup is against the middle movie. */
function rankInit(size){ return {lo: 0, hi: size, n: 0}; }

/* Matchups still likely AFTER the one about to be shown, for the progress line.
   A range of width w needs ceil(log2(w)) more answers; one of those is the
   matchup being shown right now, hence the -1. */
function rankRemaining(lo, hi){ return Math.max(0, Math.ceil(Math.log2(Math.max(hi - lo, 1))) - 1); }

/* What happens next.

   Returns {type:"place", index} when the range has collapsed to a single slot —
   the caller should splice the movie in at `index` — or {type:"compare", mid, n,
   remaining} to show a matchup against the movie at index `mid`.

   `at(i)` returns the movie id at index i of the bucket. It exists purely as a
   safety valve: if the bucket shrank underneath an in-progress ranking (a
   cloud pull landing mid-flow, say) there is nothing to compare against, so we
   place at `lo` rather than rendering a matchup with a missing contender.

   Mutates st.n, because n is the count of matchups actually shown to the user
   and that is exactly what the UI displays. */
function rankStep(st, at){
  if(st.lo >= st.hi) return {type: "place", index: st.lo};
  const mid = (st.lo + st.hi) >> 1;
  if(at && !at(mid)) return {type: "place", index: st.lo};
  st.n++;
  return {type: "compare", mid, n: st.n, remaining: rankRemaining(st.lo, st.hi)};
}

/* Fold the user's answer to the matchup at `mid` back into the state.

     "new"  the movie being ranked won  -> it belongs above mid, search [lo, mid)
     "old"  the incumbent won           -> it belongs below mid, search (mid, hi)
     "tie"  too close to call           -> stop asking, park it just below mid

   Returns null when the search should continue (call rankStep again), or a
   {type:"place", index} verdict when the tie shortcut ends it. Mutates st. */
function rankChoose(st, mid, choice){
  if(choice === "new"){ st.hi = mid; return null; }
  if(choice === "old"){ st.lo = mid + 1; return null; }
  return {type: "place", index: mid + 1};
}

/* Run a whole insertion to completion against a comparator, with no UI in the
   loop. app.js does not use this — the browser flow is driven one matchup per
   click — but it is the same three functions in the same order, which is what
   makes it a faithful subject for the tests.

   `compare(candidate, incumbent)` returns "new" | "old" | "tie".
   Returns {list, index, comparisons} with `list` a new array; the input is not
   mutated. */
function rankInsert(list, id, compare){
  const st = rankInit(list.length);
  for(;;){
    const step = rankStep(st, i => list[i]);
    const verdict = step.type === "place"
      ? step
      : rankChoose(st, step.mid, compare(id, list[step.mid]));
    if(verdict){
      const out = list.slice();
      out.splice(verdict.index, 0, id);
      return {list: out, index: verdict.index, comparisons: st.n};
    }
  }
}

/* Node-only: lets test-ranking.mjs require() this file. Invisible in a browser. */
if(typeof module !== "undefined" && module.exports)
  module.exports = { rankInit, rankRemaining, rankStep, rankChoose, rankInsert };
