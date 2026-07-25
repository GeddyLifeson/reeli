/* HARNESS: the deploy surface.

   Splitting one 150 KB index.html into six files creates three new ways to
   break the site, none of which show up in a syntax check:

     * a file index.html asks for that isn't in the repo -> 404, dead app
     * a file the service worker doesn't precache -> works online, breaks offline
     * a name declared at top level in two of the classic scripts -> the second
       one throws "Identifier has already been declared" and never runs

   Plus the usual document checks: tag balance and a parseable JSON-LD block.

   Usage: node test/shell.mjs   (from the repo root) */
import fs from "node:fs";
import vm from "node:vm";
import { makeGlobals } from "./fakedom.mjs";

let fail = 0;
const ok = (c, m) => { console.log((c ? "  PASS  " : "  FAIL  ") + m); if(!c) fail++; };

const HTML = fs.readFileSync("index.html", "utf8");
const HTML_NC = HTML.replace(/<!--[\s\S]*?-->/g, ""); // comments can contain tag-shaped text
const SW = fs.readFileSync("sw.js", "utf8");

/* ---------- 1. what the page asks for ---------- */
const refs = [
  ...[...HTML.matchAll(/<script[^>]*\bsrc="([^"]+)"/g)].map(m => m[1]),
  ...[...HTML.matchAll(/<link[^>]*\bhref="([^"]+)"/g)].map(m => m[1]),
].filter(u => !/^(https?:)?\/\//.test(u));
const uniqRefs = [...new Set(refs)];

ok(refs.length >= 5, `index.html references ${uniqRefs.length} distinct local files: ${uniqRefs.join(", ")}`);
const missing = uniqRefs.filter(u => !fs.existsSync(u));
ok(missing.length === 0, "every referenced file exists in the repo" + (missing.length ? " — MISSING: " + missing.join(", ") : ""));

/* the split must actually have happened */
ok(!/<style>/.test(HTML), "no inline <style> block is left in index.html");
ok(!/<script>\s*['"]use strict/.test(HTML), "no inline app <script> is left in index.html");
ok(HTML.includes(`href="styles.css"`), "styles.css is linked");

/* load order: app.js reads window.REELI_PREBAKED_POSTERS at load, so posters.js
   must be parsed before it */
const order = [...HTML.matchAll(/<script[^>]*\bsrc="([^"]+)"/g)].map(m => m[1]);
ok(order.indexOf("posters.js") >= 0 && order.indexOf("posters.js") < order.indexOf("app.js"),
   `posters.js loads before app.js (${order.join(" -> ")})`);
ok(order.indexOf("app.js") === order.length - 1, "app.js is last");
ok(!/<script[^>]*\btype="module"/.test(HTML), "the scripts are classic, not modules — one shared global scope, as before");

/* ---------- 2. what the service worker keeps ---------- */
const precache = [...(SW.match(/const PRECACHE = \[([\s\S]*?)\];/) || [,""])[1].matchAll(/"([^"]+)"/g)].map(m => m[1]);
ok(precache.length > 0, `sw.js precaches ${precache.length} entries`);
const notCached = uniqRefs.filter(u => !precache.includes("./" + u));
ok(notCached.length === 0, "every file index.html references is precached" + (notCached.length ? " — MISSING: " + notCached.join(", ") : ""));
const ghosts = precache.filter(u => u !== "./" && !fs.existsSync(u.replace(/^\.\//, "")));
ok(ghosts.length === 0, "no precache entry points at a file that doesn't exist" + (ghosts.length ? " — " + ghosts.join(", ") : ""));
ok(precache.includes("./index.html") && precache.includes("./"), "both './' and './index.html' are precached");

/* the cache name must move, or returning users keep the v2 shell offline */
const cacheName = (SW.match(/const CACHE = "([^"]+)"/) || [])[1];
ok(!!cacheName, `cache name is ${cacheName}`);
ok(cacheName !== "reeli-v2", "the cache name is bumped past the deployed reeli-v2");
ok(/caches\.keys\(\)[\s\S]*?filter\(k => k !== CACHE\)[\s\S]*?caches\.delete/.test(SW),
   "activate deletes every cache that isn't the current one");
ok(/skipWaiting\(\)/.test(SW) && /clients\.claim\(\)/.test(SW),
   "the new worker takes over immediately (skipWaiting + clients.claim)");
ok(/fetch\(req[\s\S]*?\.catch\(\(\) => caches\.match/.test(SW),
   "the fetch handler is still network-first, so online users never see a stale mix");
/* the "./" fallback must be reachable only for a navigation: answering a failed
   app.js request with index.html makes the browser execute HTML as JavaScript */
ok(/req\.mode === "navigate"[\s\S]{0,80}caches\.match\("\.\/"\)/.test(SW),
   'the "./" shell fallback is scoped to navigation requests');
ok(/Response\.error\(\)/.test(SW),
   "a non-navigation cache miss fails honestly instead of being served the shell");

/* ---------- 2b. the manifest, against install criteria ---------- */
{
  const M = JSON.parse(fs.readFileSync("manifest.webmanifest", "utf8"));
  ok(!!M.name && !!M.short_name, `manifest declares name and short_name (${M.short_name})`);
  ok(!!M.start_url && !!M.scope, "manifest declares start_url and scope");
  ok(["standalone", "fullscreen", "minimal-ui"].includes(M.display),
     `display is an installable value (${M.display})`);
  ok(!!M.id, `manifest declares an explicit id (${M.id}) so app identity does not drift with start_url`);
  ok(!!M.lang, `manifest declares lang (${M.lang})`);
  const sizes = (M.icons || []).map(i => i.sizes);
  ok(sizes.includes("192x192") && sizes.includes("512x512"),
     `manifest ships both required icon sizes (${sizes.join(", ")})`);
  const iconFiles = (M.icons || []).map(i => i.src).filter(s => !fs.existsSync(s));
  ok(iconFiles.length === 0, "every manifest icon exists in the repo" +
     (iconFiles.length ? " — MISSING: " + iconFiles.join(", ") : ""));
  ok((M.icons || []).some(i => /maskable/.test(i.purpose || "")),
     "at least one icon is declared maskable (Android adaptive icons)");
  ok(precache.includes("./manifest.webmanifest"), "the manifest itself is precached");
}

/* ---------- 3. one global scope, no collisions ---------- */
const scripts = order.map(f => [f, fs.readFileSync(f, "utf8")]);
const lex = new Map();       // const/let/class: redeclaring across scripts is fatal
const dupes = [];
for(const [file, src] of scripts)
  for(const m of src.matchAll(/^(?:const|let|class)\s+([A-Za-z_$][\w$]*)/gm)){
    const prev = lex.get(m[1]);
    if(prev && prev !== file) dupes.push(`${m[1]} (${prev} and ${file})`);
    lex.set(m[1], file);
  }
ok(dupes.length === 0, `no top-level const/let/class is declared in two scripts (${lex.size} names)` +
   (dupes.length ? " — CLASH: " + dupes.join(", ") : ""));

/* the definitive check: run them in one context, in page order, and see */
{
  const g = makeGlobals();
  const ctx = vm.createContext(g);
  let err = null;
  try{ for(const [file, src] of scripts) vm.runInContext(src, ctx, {filename: file}); }
  catch(e){ err = `${e.name}: ${e.message}`; }
  ok(err === null, "all four scripts load into one shared global scope without throwing" + (err ? " — " + err : ""));
  ok(typeof g.rankInsert === "function" && typeof g.pickMeta === "function",
     "ranking.js and matching.js expose their functions to app.js's scope");
}

/* ---------- 4. the document itself ---------- */
{
  const ld = (HTML.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/) || [])[1];
  let parsed = null, e = null;
  try{ parsed = JSON.parse(ld); }catch(x){ e = x.message; }
  ok(parsed && parsed["@type"] === "WebApplication", "the JSON-LD block still parses" + (e ? " — " + e : ""));
}
{
  const VOID = new Set(["area","base","br","col","embed","hr","img","input","link","meta","source","track","wbr","path","circle","rect","polygon","polyline","line","ellipse","stop","use"]);
  const stack = [];
  let bad = null;
  for(const m of HTML_NC.matchAll(/<(\/?)([a-zA-Z][\w-]*)\b([^>]*)>/g)){
    const [, close, tag, attrs] = m;
    const t = tag.toLowerCase();
    if(VOID.has(t) || attrs.trimEnd().endsWith("/")) continue;
    if(close){
      if(stack.pop() !== t){ bad = `</${t}> does not close the open element`; break; }
    } else stack.push(t);
  }
  ok(!bad && stack.length === 0, "index.html tags balance" + (bad ? " — " + bad : stack.length ? " — unclosed: " + stack.join(", ") : ""));
}
ok(fs.readFileSync("styles.css", "utf8").split("{").length === fs.readFileSync("styles.css", "utf8").split("}").length,
   "styles.css braces balance");

console.log(fail ? `\nFAILED (${fail})` : "\nALL PASS");
process.exit(fail ? 1 : 0);
