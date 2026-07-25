/* HARNESS: the render functions are pinned two ways at once.

   1. GOLDEN HASHES. Every screen is rendered across 400 deterministic seeded
      app states and the concatenated HTML is hashed per screen. The hashes live
      in test/render-snapshot.json — 6 lines, not 126 KB. An unintended markup
      change fails here; an intended one is re-blessed with:

          node test/render-snapshot.mjs --update

      This replaces the old render-diff.mjs, which diffed against a frozen copy
      of the pre-split source (test/app.pre-split.js). That file could only
      answer "is the markup byte-identical to July 2026", so every deliberate
      change — an aria-label, a new row — failed it, and the only fix was to
      re-freeze the whole app. A hash is the same guarantee at 1/2000th the size
      and with a documented way to move it forward.

   2. STRUCTURAL INVARIANTS. These are the properties that must hold no matter
      how the markup is restyled, so they keep their value across re-blessings:
      hostile strings stay escaped, tags balance, and nothing renders a raw
      "undefined"/"NaN". A --update never silences these.

   Usage: node test/render-snapshot.mjs [--update] [seeds] */
import fs from "node:fs";
import crypto from "node:crypto";
import { buildApp, forEachRender, makeSeed, apply, NASTY } from "./seeds.mjs";

const args = process.argv.slice(2);
const UPDATE = args.includes("--update");
const N = Number(args.find(a => /^\d+$/.test(a)) || 400);
const SNAP = "test/render-snapshot.json";

let fail = 0;
const ok = (c, m) => { console.log((c ? "  PASS  " : "  FAIL  ") + m); if(!c) fail++; };

const B = buildApp();

/* ---------- collect ---------- */
const hashers = new Map();   // screen -> running sha256
const fragments = [];        // {seed, screen, html} for the invariant pass
const errors = [];
let renders = 0;

forEachRender(B, N, r => {
  if(r.error){ errors.push(r); return; }
  renders++;
  if(!hashers.has(r.screen)) hashers.set(r.screen, crypto.createHash("sha256"));
  hashers.get(r.screen).update(r.html, "utf8");
  fragments.push(r);
});

/* The five screens are containers. Hash the two leaf builders directly too, so
   a change inside one is pinned even when it happens to be rendered in a branch
   the seeded states rarely reach. */
{
  const lh = {feedItemHTML: crypto.createHash("sha256"), movieRowHTML: crypto.createHash("sha256")};
  for(let i = 0; i < 120; i++){
    const seed = makeSeed(i + 9000, B.T.DB);
    apply(B, seed);
    seed.CLOUD.feed.forEach((f, idx) => {
      lh.feedItemHTML.update(B.T.feedItemHTML(JSON.parse(JSON.stringify(f)), idx), "utf8"); renders++;
    });
    seed.S.myFeed.forEach((f, idx) => {
      lh.feedItemHTML.update(B.T.feedItemHTML(JSON.parse(JSON.stringify(f)), idx), "utf8"); renders++;
    });
    for(const m of seed.S.custom){ lh.movieRowHTML.update(B.T.movieRowHTML(m), "utf8"); renders++; }
  }
  for(const k of Object.keys(lh)) hashers.set(k, lh[k]);
}

const digest = {};
for(const [screen, h] of [...hashers].sort((a, b) => a[0] < b[0] ? -1 : 1))
  digest[screen] = h.digest("hex");

/* ---------- 1. golden hashes ---------- */
ok(errors.length === 0, `${renders} renders across ${N} seeded states, 0 threw` +
   (errors.length ? ` — ${errors.length} threw, first: ${errors[0].screen} seed ${errors[0].seed}: ${errors[0].error}` : ""));

if(UPDATE){
  fs.writeFileSync(SNAP, JSON.stringify({seeds: N, renders, screens: digest}, null, 2) + "\n");
  console.log(`  WROTE  ${SNAP} (${Object.keys(digest).length} screen hashes over ${N} seeds)`);
} else if(!fs.existsSync(SNAP)){
  ok(false, `${SNAP} is missing — create it with: node test/render-snapshot.mjs --update`);
} else {
  const golden = JSON.parse(fs.readFileSync(SNAP, "utf8"));
  ok(golden.seeds === N, `snapshot was taken over the same seed count (${golden.seeds})`);
  const drift = Object.keys(digest).filter(s => golden.screens[s] !== digest[s]);
  const gone = Object.keys(golden.screens).filter(s => !(s in digest));
  ok(gone.length === 0, `every snapshotted screen still renders` + (gone.length ? " — MISSING: " + gone.join(", ") : ""));
  ok(drift.length === 0,
     `all ${Object.keys(digest).length} screen hashes match the snapshot` +
     (drift.length ? "\n          CHANGED: " + drift.map(s => `${s} ${String(golden.screens[s]).slice(0,12)} -> ${digest[s].slice(0,12)}`).join("\n          ") +
      "\n          If this change is intended: node test/render-snapshot.mjs --update" : ""));
}

/* ---------- 2. structural invariants (never silenced by --update) ---------- */

/* a) hostile strings must never survive into markup as live syntax. The seeds
      push `<script>alert(1)</script>` and friends through every text slot. */
{
  const raw = [];
  for(const f of fragments){
    if(/<script/i.test(f.html)) raw.push(`${f.screen} seed ${f.seed}: <script`);
    else if(/<b>bold<\/b>/.test(f.html)) raw.push(`${f.screen} seed ${f.seed}: unescaped <b>`);
    if(raw.length > 2) break;
  }
  ok(raw.length === 0, `no seeded payload survives unescaped into any of ${fragments.length} fragments` +
     (raw.length ? " — " + raw.join("; ") : ""));
}

/* b) the escaper is actually running: with NASTY in play the output must carry
      entity-encoded forms, or a) above would pass vacuously */
{
  const escaped = fragments.filter(f => /&lt;|&amp;|&#39;|&quot;/.test(f.html)).length;
  ok(escaped > fragments.length * 0.5,
     `${escaped}/${fragments.length} fragments contain escaped entities (the escaper is live, so the check above is not vacuous)`);
}

/* c) tag balance, per fragment — catches an unclosed div in a rarely-hit branch */
{
  const VOID = new Set(["area","base","br","col","embed","hr","img","input","link","meta","source","track","wbr",
                        "path","circle","rect","polygon","polyline","line","ellipse","stop","use"]);
  const bad = [];
  for(const f of fragments){
    const stack = [];
    let err = null;
    for(const m of f.html.matchAll(/<(\/?)([a-zA-Z][\w-]*)\b([^>]*)>/g)){
      const [, close, tag, attrs] = m;
      const t = tag.toLowerCase();
      if(VOID.has(t) || attrs.trimEnd().endsWith("/")) continue;
      if(close){ if(stack.pop() !== t){ err = `</${t}> does not close the open element`; break; } }
      else stack.push(t);
    }
    if(err || stack.length) bad.push(`${f.screen} seed ${f.seed}: ${err || "unclosed " + stack.join(",")}`);
    if(bad.length > 2) break;
  }
  ok(bad.length === 0, `tags balance in every fragment` + (bad.length ? " — " + bad.join("; ") : ""));
}

/* d) no placeholder leakage: a missing field should render as "—" or be omitted,
      never as the literal string undefined/NaN/[object Object] */
{
  const leaks = [];
  for(const f of fragments){
    const m = f.html.match(/>\s*(undefined|NaN|\[object Object\])\s*</) ||
              f.html.match(/"(undefined|NaN|\[object Object\])"/);
    if(m) leaks.push(`${f.screen} seed ${f.seed}: ${m[1]}`);
    if(leaks.length > 2) break;
  }
  ok(leaks.length === 0, `no fragment renders a raw undefined / NaN / [object Object]` +
     (leaks.length ? " — " + leaks.join("; ") : ""));
}

/* e) the seed generator must still be exercising the app, not rendering blanks */
{
  const nonTrivial = fragments.filter(f => f.html.length > 200).length;
  ok(nonTrivial > fragments.length * 0.6,
     `${nonTrivial}/${fragments.length} fragments are non-trivial (>200 bytes) — the seeds still drive real markup`);
  ok(NASTY.length >= 10, `the hostile-string corpus still has ${NASTY.length} entries`);
}

console.log(fail ? `\nFAILED (${fail})` : "\nALL PASS");
process.exit(fail ? 1 : 0);
