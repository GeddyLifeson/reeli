/* Run every Reeli check. No dependencies, no test runner.
 *
 *     node test/all.mjs
 *
 * Each suite is also runnable on its own — see the header of each file. */
import { spawnSync } from "node:child_process";

const SUITES = [
  ["test-ranking.mjs",         "pure logic: the ranking algorithm and the title matcher"],
  ["test/shell.mjs",           "deploy surface: file refs, precache, one global scope, document"],
  ["test/helpers.mjs",         "PostgREST URL building, hue hashing, and the poster cache"],
  ["test/delegation.mjs",      "every control is routed, and dispatches where it should"],
  ["test/smoke.mjs",           "no function references a name that does not exist"],
  ["test/watchlist-sync.mjs",  "the watchlist RLS failure is surfaced, not swallowed"],
  ["test/sync-steps.mjs",      "each sync/pull step, and what happens offline"],
  ["test/a11y.mjs",            "landmarks, accessible names, labels, contrast"],
  ["test/render-snapshot.mjs", "rendered HTML matches the golden hashes and stays well-formed"],
];

let failed = 0;
for(const [file, what] of SUITES){
  console.log(`\n\x1b[1m── ${file}\x1b[0m — ${what}`);
  const r = spawnSync(process.execPath, [file], {stdio: "inherit"});
  if(r.status !== 0) failed++;
}
console.log(failed ? `\n${failed} of ${SUITES.length} suites FAILED` : `\nall ${SUITES.length} suites passed`);
process.exit(failed ? 1 : 0);
