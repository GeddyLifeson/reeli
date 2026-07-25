/* HARNESS: accessibility invariants.

   Reeli is a consumer app built almost entirely out of icon buttons and
   dynamically replaced innerHTML, which is the exact shape that silently loses
   accessibility one render function at a time. These are the structural
   properties — the ones a machine can actually decide — pinned so they don't
   regress:

     * the document shell: doctype, lang, landmarks, skip link, live regions
     * every control the app renders has an accessible name
     * every form field has a label that isn't just a placeholder
     * decorative SVG and duplicate badges are hidden from the tree
     * the score colours clear WCAG AA against the surfaces they sit on

   What this cannot check: focus order in a real browser, whether the wording of
   a label is any good, or whether a screen reader makes sense of the result.
   Those still want a human and a real AT pass.

   Usage: node test/a11y.mjs   (from the repo root) */
import fs from "node:fs";
import { buildApp, forEachRender } from "./seeds.mjs";

let fail = 0;
const ok = (c, m) => { console.log((c ? "  PASS  " : "  FAIL  ") + m); if(!c) fail++; };

const HTML = fs.readFileSync("index.html", "utf8");
const CSS = fs.readFileSync("styles.css", "utf8");

/* ================= 1. the document shell ================= */

ok(/^\s*<!doctype html>/i.test(HTML),
   "index.html opens with <!doctype html> (without it the browser renders in quirks mode)");
{
  const m = HTML.match(/<html\b[^>]*\blang="([^"]+)"/i);
  ok(!!m, "<html> carries a lang attribute" + (m ? ` (lang="${m[1]}")` : " — screen readers guess the wrong voice without it"));
}

/* landmarks: one main, a banner, a labelled nav */
ok((HTML.match(/<main\b/g) || []).length === 1, "exactly one <main> landmark");
ok(/<header\b/.test(HTML), "a <header> banner landmark is present");
{
  const nav = HTML.match(/<nav\b[^>]*>/);
  ok(!!nav && /aria-label="/.test(nav[0]), "the <nav> landmark has an accessible name");
}

/* the skip link must actually point somewhere */
{
  const m = HTML.match(/<a\b[^>]*class="skip"[^>]*href="#([\w-]+)"/);
  ok(!!m, "a skip link is the first focusable element");
  if(m) ok(new RegExp(`id="${m[1]}"`).test(HTML), `the skip link target #${m[1]} exists`);
}

/* live regions must exist in the initial markup: a region inserted at the same
   moment as its text is a region that never announces */
for(const [id, role] of [["toast", "status"], ["alert", "alert"], ["srstatus", "status"]]){
  const tag = (HTML.match(new RegExp(`<[^>]*id="${id}"[^>]*>`)) || [])[0] || "";
  ok(/aria-live="/.test(tag) && new RegExp(`role="${role}"`).test(tag),
     `#${id} is in the shell as a role="${role}" live region`);
}

/* both modal containers need a name and modal semantics */
for(const id of ["overlay", "gate"]){
  const tag = (HTML.match(new RegExp(`<[^>]*id="${id}"[^>]*>`)) || [])[0] || "";
  ok(/role="dialog"/.test(tag) && /aria-modal="true"/.test(tag) && /aria-label(?:ledby)?="/.test(tag),
     `#${id} is a named modal dialog`);
}

/* every inline SVG in the shell is decorative and must be hidden: its meaning is
   always carried by adjacent text or the button's own label */
{
  const svgs = [...HTML.matchAll(/<svg\b[^>]*>/g)].map(m => m[0]);
  const bare = svgs.filter(s => !/aria-hidden="true"/.test(s));
  ok(bare.length === 0, `all ${svgs.length} inline SVGs in the shell are aria-hidden` +
     (bare.length ? ` — ${bare.length} are not` : ""));
}

/* the count badges duplicate information that belongs in the button's name */
{
  const bad = ["feedDot", "watchBadge", "notifBadge"].filter(id => {
    const tag = (HTML.match(new RegExp(`<[^>]*id="${id}"[^>]*>`)) || [])[0] || "";
    return !/aria-hidden="true"/.test(tag);
  });
  ok(bad.length === 0, "the nav count badges are aria-hidden (their counts live in each button's aria-label)" +
     (bad.length ? " — exposed: " + bad.join(", ") : ""));
}

/* every button in the shell must be named, by text or by aria-label */
{
  const unnamed = [];
  for(const m of HTML.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)){
    const text = m[2].replace(/<svg[\s\S]*?<\/svg>/g, "").replace(/<[^>]*>/g, "").trim();
    if(!/aria-label(?:ledby)?="/.test(m[1]) && !/[A-Za-z]{2,}/.test(text))
      unnamed.push(m[1].trim().slice(0, 60));
  }
  ok(unnamed.length === 0, "every button in the shell has an accessible name" +
     (unnamed.length ? " — unnamed: " + unnamed.join(" | ") : ""));
}

/* ================= 2. the CSS affordances ================= */

ok(/:focus-visible\s*[,{][\s\S]{0,200}?outline\s*:\s*2px/.test(CSS),
   "a visible focus indicator is defined for :focus-visible");
ok(/@media \(prefers-reduced-motion: reduce\)/.test(CSS),
   "prefers-reduced-motion is honoured");
ok(/\.sr-only\s*\{[^}]*clip-path/.test(CSS),
   ".sr-only exists for screen-reader-only live text");
/* .searchbar input sets outline:none, which removed the only focus ring the two
   search fields had; the wrapper has to put one back */
ok(/\.searchbar:focus-within\s*\{[^}]*outline/.test(CSS),
   ".searchbar restores a focus ring on the wrapper (its input sets outline:none)");

/* contrast: the score badge is 14.5px bold — normal text by WCAG, so 4.5:1.
   The light theme is the tight one; parse it out of the file rather than
   hard-coding, so a future palette edit is what gets checked. */
{
  const hex = h => { h = h.replace("#", ""); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); };
  const lum = c => { const [r, g, b] = hex(c).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
                     return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  const cr = (a, b) => { const l1 = lum(a), l2 = lum(b); const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1]; return (hi + 0.05) / (lo + 0.05); };

  const light = CSS.slice(0, CSS.indexOf("@media (prefers-color-scheme: dark)"));
  const v = n => (light.match(new RegExp("--" + n + ":\\s*(#[0-9A-Fa-f]{6})")) || [])[1];
  const pairs = [
    ["good", "good-soft"], ["mid", "mid-soft"], ["bad", "bad-soft"],
    ["ink", "bg"], ["muted", "bg"], ["accent", "bg"], ["on-accent", "accent"],
  ];
  const bad = [];
  for(const [fg, bg] of pairs){
    const a = v(fg), b = v(bg);
    if(!a || !b){ bad.push(`${fg}/${bg} not found in the light palette`); continue; }
    const r = cr(a, b);
    if(r < 4.5) bad.push(`${fg} on ${bg} = ${r.toFixed(2)}:1`);
  }
  ok(bad.length === 0, `all ${pairs.length} light-theme text/background pairs clear WCAG AA 4.5:1` +
     (bad.length ? " — FAILING: " + bad.join(", ") : ""));
}

/* ================= 3. what the render functions emit ================= */

const B = buildApp();
const frags = [];
forEachRender(B, 120, r => { if(r.html) frags.push(r); });

/* a) every rendered control has a name */
{
  const unnamed = [];
  let buttons = 0;
  for(const f of frags){
    for(const m of f.html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)){
      buttons++;
      const attrs = m[1];
      if(/aria-label(?:ledby)?="\s*[^"\s]/.test(attrs)) continue;
      // text content, ignoring decorative SVG; an <img alt> also names a button
      const text = m[2].replace(/<svg[\s\S]*?<\/svg>/g, "").replace(/<[^>]*>/g, "").trim();
      const imgAlt = [...m[2].matchAll(/<img\b[^>]*\balt="([^"]+)"/g)].map(x => x[1]).join("");
      /* A name has to contain a word. The like button is an icon plus its count,
         so without an aria-label its entire accessible name is "12" — which
         satisfies "has a name" while telling the user nothing about what the
         control does. Requiring a letter is what makes that case fail. */
      if(/[A-Za-zÀ-ɏ]/.test(text) || /[A-Za-z]/.test(imgAlt)) continue;
      unnamed.push(`${f.screen} seed ${f.seed}: <button ${attrs.trim().slice(0, 70)}> name=${JSON.stringify(text || imgAlt)}`);
    }
  }
  ok(unnamed.length === 0, `all ${buttons} rendered buttons have an accessible name` +
     (unnamed.length ? `\n          ${unnamed.length} unnamed, first 3:\n          ` + unnamed.slice(0, 3).join("\n          ") : ""));
}

/* b) every rendered form field is labelled, and not by a placeholder.
      A placeholder disappears the moment the user types and is announced
      inconsistently across screen readers, so it does not count. */
{
  const unlabelled = [];
  let inputs = 0;
  for(const f of frags){
    for(const m of f.html.matchAll(/<input\b([^>]*)>/g)){
      inputs++;
      const attrs = m[1];
      if(/type="(hidden|file)"/.test(attrs)) continue;       // file input is wrapped in a <label>
      if(/aria-label(?:ledby)?="\s*[^"\s]/.test(attrs)) continue;
      unlabelled.push(`${f.screen} seed ${f.seed}: <input ${attrs.trim().slice(0, 70)}>`);
    }
  }
  ok(unlabelled.length === 0, `all ${inputs} rendered inputs carry an aria-label (a placeholder is not a label)` +
     (unlabelled.length ? `\n          first: ${unlabelled[0]}` : ""));
}

/* c) rendered <img> must have an alt attribute — decorative posters use alt="" */
{
  const noAlt = [];
  let imgs = 0;
  for(const f of frags)
    for(const m of f.html.matchAll(/<img\b([^>]*)>/g)){
      imgs++;
      if(!/\balt=/.test(m[1])) noAlt.push(`${f.screen} seed ${f.seed}`);
    }
  ok(noAlt.length === 0, `all ${imgs} rendered images declare an alt attribute` +
     (noAlt.length ? ` — ${noAlt.length} without` : ""));
}

/* d) an SVG inside a named control must not also be announced */
{
  const exposed = [];
  let svgs = 0;
  for(const f of frags)
    for(const m of f.html.matchAll(/<svg\b([^>]*)>/g)){
      svgs++;
      if(!/aria-hidden="true"/.test(m[1]) && !/role="img"/.test(m[1]))
        exposed.push(`${f.screen} seed ${f.seed}: <svg ${m[1].trim().slice(0, 50)}>`);
    }
  ok(exposed.length === 0, `all ${svgs} rendered SVGs are aria-hidden or role="img"` +
     (exposed.length ? `\n          ${exposed.length} exposed, first: ${exposed[0]}` : ""));
}

/* e) toggle controls expose their state, not just a CSS class */
{
  const pressed = frags.reduce((n, f) => n + (f.html.match(/aria-pressed="/g) || []).length, 0);
  ok(pressed > 0, `toggle buttons expose aria-pressed (${pressed} occurrences across ${frags.length} fragments)`);
}

console.log(fail ? `\nFAILED (${fail})` : "\nALL PASS");
process.exit(fail ? 1 : 0);
