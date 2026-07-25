/* HARNESS: event delegation must cover everything the app renders, and dispatch
   it to the right place.

   Three passes:
     1. STATIC   — every data- attribute and every element id the app emits into
                   markup is either routed or on an explicit "not interactive"
                   list, and no route is dead.
     2. HYGIENE  — no render or sheet builder binds listeners any more.
     3. DISPATCH — routeClick / routeInput / routeChange / routeKeydown are run
                   against synthetic elements with a real closest(), and the
                   function each one reaches is asserted by name.

   Usage: node test/delegation.mjs   (from the repo root) */
import fs from "node:fs";
import vm from "node:vm";
import { makeGlobals, bodyOf } from "./fakedom.mjs";

const SRC = fs.readFileSync("app.js", "utf8");
let fail = 0;
const ok = (c, m) => { console.log((c ? "  PASS  " : "  FAIL  ") + m); if(!c) fail++; };

/* ============================ 1. STATIC COVERAGE ======================== */

/* attributes that appear in markup but are deliberately not clickable */
const PASSIVE_ATTRS = new Set([
  "pid",   // poster <img> hydration target
  "wt",    // wallpaper title, read off the data-wall button
  "nav",   // the bottom nav lives in index.html and is bound once there
]);
/* ids that exist to be read or written, not clicked */
const PASSIVE_IDS = new Set([
  "auerr", "cherr", "commWrap",                      // message / mount points
  "ename", "ehandle", "ctitle", "cyear", "cgenre",   // fields read on save
  "takeInp",                                          // read by commitTake()
]);

const emitted = {attrs: new Map(), ids: new Map()};
for(const m of SRC.matchAll(/(?<![-\w])data-([a-z][a-z0-9]*)(?==|>)/g))
  emitted.attrs.set(m[1], (emitted.attrs.get(m[1]) || 0) + 1);
for(const m of SRC.matchAll(/<(?:button|input|label|select|textarea)\b[^>]*?\sid="([A-Za-z0-9_]+)"/g))
  emitted.ids.set(m[1], (emitted.ids.get(m[1]) || 0) + 1);

/* pull the route tables out of the module by appending a probe */
const g = makeGlobals();
const ctx = vm.createContext(g);
for(const f of ["posters.js", "ranking.js", "matching.js"]) vm.runInContext(fs.readFileSync(f, "utf8"), ctx, {filename: f});
vm.runInContext(bodyOf(SRC) + `
globalThis.__D = {
  routes: CLICK_ROUTES.map(r => r[0]),
  ids: Object.keys(CLICK_IDS), inputs: Object.keys(INPUT_IDS),
  changes: Object.keys(CHANGE_IDS), enters: Object.keys(ENTER_IDS),
  roots: DELEGATE_ROOTS,
  setPick: m => { PICK_MOVIE = m; }, setPlaced: id => { PLACED_ID = id; },
  setPerson: p => { SHEET_PERSON = p; }, setShare: s => { SHARE = s; },
  setDetail: id => { detailId = id; }, setO: o => { O = o; },
  setEdit: p => { EDIT_P = p; }, setR: r => { R = r; }, CLOUD,
};`, ctx, {filename: "app.js"});
const D = g.__D;

const routed = new Set(D.routes);
const handledIds = new Set([...D.ids, ...D.inputs, ...D.changes, ...D.enters]);

const unroutedAttrs = [...emitted.attrs.keys()].filter(a => !routed.has(a) && !PASSIVE_ATTRS.has(a));
ok(unroutedAttrs.length === 0, `every emitted data- attribute is routed (${emitted.attrs.size} distinct)` +
  (unroutedAttrs.length ? " — MISSING: " + unroutedAttrs.join(", ") : ""));

const unhandledIds = [...emitted.ids.keys()].filter(i => !handledIds.has(i) && !PASSIVE_IDS.has(i));
ok(unhandledIds.length === 0, `every emitted control id is handled (${emitted.ids.size} distinct)` +
  (unhandledIds.length ? " — MISSING: " + unhandledIds.join(", ") : ""));

const deadRoutes = D.routes.filter(r => !emitted.attrs.has(r));
ok(deadRoutes.length === 0, `no dead data- routes (${D.routes.length} routes)` +
  (deadRoutes.length ? " — DEAD: " + deadRoutes.join(", ") : ""));
const deadIds = D.ids.filter(i => !emitted.ids.has(i));
ok(deadIds.length === 0, `no dead id routes (${D.ids.length} ids)` + (deadIds.length ? " — DEAD: " + deadIds.join(", ") : ""));

/* no single element may carry two routed attributes: the router picks one */
const doubles = [];
for(const tag of SRC.match(/<[a-z][^>]*>/g) || []){
  const on = [...tag.matchAll(/(?<![-\w])data-([a-z][a-z0-9]*)(?==|>)/g)].map(m => m[1]).filter(a => routed.has(a));
  if(new Set(on).size > 1) doubles.push(tag.slice(0, 80) + " -> " + on.join("+"));
}
ok(doubles.length === 0, "no element carries two routed attributes" + (doubles.length ? ": " + doubles[0] : ""));

/* the containers must be the ones that actually exist in index.html */
const HTML = fs.readFileSync("index.html", "utf8");
const missingRoots = D.roots.filter(sel => !HTML.includes(`id="${sel.slice(1)}"`));
ok(missingRoots.length === 0, `all ${D.roots.length} delegate roots exist in index.html` +
  (missingRoots.length ? " — MISSING: " + missingRoots.join(", ") : ""));

/* ============================ 2. HYGIENE ================================ */
const stray = [];
SRC.split("\n").forEach((line, i) => {
  if(!line.includes("addEventListener")) return;
  // the only legitimate per-element bindings left: poster <img> load/error
  if(/^\s*img\.addEventListener/.test(line)) return;
  // and the handful attached once, at load, to elements index.html owns
  if(/^(document|window|overlay|\$\("#themeBtn"\)|\$\("#notifBtn"\)|root)\.addEventListener/.test(line)) return;
  if(/^\s*root\.addEventListener/.test(line)) return;
  if(/^document\.querySelectorAll\("\.nav /.test(line)) return;
  stray.push(`${i + 1}: ${line.trim().slice(0, 90)}`);
});
ok(stray.length === 0, "no per-render addEventListener remains" + (stray.length ? "\n          " + stray.join("\n          ") : ""));
ok(!/\bwireCommon\b|\bwireOauth\b/.test(SRC), "wireCommon / wireOauth are gone");

/* ============================ 3. DISPATCH =============================== */

/* a synthetic element with a real closest() over the selector forms the router
   uses: "[data-x]" and "#id", comma separated */
function node({id = "", attrs = {}, parent = null}){
  const el = {
    id, dataset: {}, parent,
    hasAttribute: a => a.startsWith("data-") && Object.prototype.hasOwnProperty.call(attrs, a.slice(5)),
    closest(sel){
      const parts = sel.split(",");
      for(let n = this; n; n = n.parent)
        for(const p of parts){
          if(p.startsWith("#") && n.id === p.slice(1)) return n;
          if(p.startsWith("[data-") && n.hasAttribute(p.slice(1, -1))) return n;
        }
      return null;
    },
    classList: {toggle(){}, add(){}, remove(){}, contains: () => false},
    value: "", files: [], focus(){}, setSelectionRange(){}, selectionStart: 0,
  };
  for(const k of Object.keys(attrs)) el.dataset[k] = attrs[k];
  return el;
}

/* what each route is required to reach */
const EXPECT_ATTR = {
  open: "openDetail", rate: "startRate", watch: "toggleWatch", unwatch: "removeFromWatch",
  like: "toggleLocalLike", clike: "toggleCloudLike", person: "openPerson",
  notif: "openDetail", notifperson: "openPerson", cperson: "openPerson",
  pfollow: "toggleMate", gosearch: "nav", addcustom: "openCustom",
  ftab: "renderFeed", filter: "renderRanks", gfilter: "renderRanks", acc: "applyUI",
  oauth: "startOauth", chue: "pickHue", ehue: "pickHue",
  g: "obToggle", d: "obToggle", m: "obToggle", ob: "obNav",
  b: "pickBucket", pick: "answerMatchup", a: "detailAction", wall: "pickWallpaper",
};
const EXPECT_ID = {
  editBtn: "openAccountForm", finishSetupBtn: "openClaimHandle", logoutBtn: "doLogout",
  logoutBtn2: "doLogout", tasteBtn: "openOnboarding", wallBtn: "openWallPicker",
  signupBtn: "openAuthSheet", loginBtn: "openAuthSheet", exportBtn: "exportBackup",
  importBtn: "importBackup", shareBtn: "shareTopFive", resetBtn: "resetEverything",
  shareProfBtn: "openShare", inviteBtn: "copyInviteLink", pickBtn: "pickTonight",
  gateSignup: "openAuthSheet", gateLogin: "openAuthSheet", gateGuest: "continueAsGuest",
  auswap: "openAuthSheet", ausubmit: "submitAuth", aurescue: "resendConfirmation",
  audone: "openAuthSheet", auresend: "resendConfirmation",
  chcancel: "closeSheet", chsave: "saveClaimedHandle", ecancel: "closeSheet", esave: "saveAccountForm",
  pfollow: "toggleSheetPerson", pshare: "shareSheetPerson",
  pkSeen: "startRate", pkAgain: "pickTonight", pkClose: "closeSheet",
  csave: "saveCustomMovie", ccancel: "closeSheet",
  doneBtn: "nav", moreBtn: "nav", undoBtn: "undoPlacement",
  wallOff: "applyUI", wallDone: "closeSheet",
  shNative: "shareVia", shX: "shareVia", shFb: "shareVia", shCopy: "shareVia",
};

/* replace every expected target with a recorder so nothing real runs */
const calls = [];
const SPIES = new Set([...Object.values(EXPECT_ATTR), ...Object.values(EXPECT_ID),
  "onSearchInput", "onMateQueryInput", "uploadAvatar", "runLiveSearch",
  "renderProfile", "renderSearch", "renderWatch", "save", "openSheet", "closeSheet"]);
for(const name of SPIES){
  if(typeof g[name] !== "function"){ ok(false, `spy target ${name} is not a global function`); continue; }
  ctx[name] = (...a) => { calls.push({name, a}); };
}
/* module state the routes read back */
D.setPick({id: "godfather"}); D.setPlaced("godfather");
D.setPerson({id: "u1", handle: "h", name: "N"}); D.setShare({text: "t", url: "u"});
D.setDetail("godfather"); D.setO({genres: new Set(), dirs: new Set(), movies: new Set()});
D.setEdit({name: "n", handle: "@h", hue: 172}); D.setR({id: "godfather", bucket: "loved", lo: 0, hi: 1, n: 0, mid: 0});
D.CLOUD.profile = {handle: "me"};

let dispatched = 0, wrong = [];
for(const [attr, want] of Object.entries(EXPECT_ATTR)){
  const parent = node({attrs: {[attr]: attr === "clike" ? "u|m" : attr === "acc" ? "" : "godfather"}});
  const child = node({parent});           // click lands on a child, as it does on an <svg> inside a button
  calls.length = 0;
  try{ g.routeClick({target: child}); }catch(e){ wrong.push(`${attr}: threw ${e.message}`); continue; }
  dispatched++;
  if(!calls.some(c => c.name === want)) wrong.push(`data-${attr} -> ${calls.map(c => c.name).join("|") || "nothing"} (want ${want})`);
}
ok(wrong.length === 0, `all ${dispatched} data- routes dispatch correctly` + (wrong.length ? "\n          " + wrong.join("\n          ") : ""));

let idWrong = [];
for(const [id, want] of Object.entries(EXPECT_ID)){
  const parent = node({id});
  const child = node({parent});
  calls.length = 0;
  try{ g.routeClick({target: child}); }catch(e){ idWrong.push(`#${id}: threw ${e.message}`); continue; }
  if(!calls.some(c => c.name === want)) idWrong.push(`#${id} -> ${calls.map(c => c.name).join("|") || "nothing"} (want ${want})`);
}
ok(idWrong.length === 0, `all ${Object.keys(EXPECT_ID).length} id routes dispatch correctly` +
  (idWrong.length ? "\n          " + idWrong.join("\n          ") : ""));

/* a routed attribute on an ancestor must beat an unrelated id further up */
calls.length = 0;
g.routeClick({target: node({parent: node({attrs: {open: "godfather"}, parent: node({id: "resetBtn"})})})});
ok(calls.length === 1 && calls[0].name === "openDetail", "nearest routed attribute wins over an outer id");

/* input / change / keydown */
for(const [ev, fn, id, want] of [["input", "routeInput", "q", "onSearchInput"],
                                 ["input", "routeInput", "mq", "onMateQueryInput"],
                                 ["change", "routeChange", "pfpFile", "uploadAvatar"]]){
  calls.length = 0;
  g[fn]({target: node({id})});
  ok(calls.some(c => c.name === want), `${ev} on #${id} -> ${want}`);
}
for(const [id, want] of [["auemail", "submitAuth"], ["aupass", "submitAuth"],
                         ["chname", "saveClaimedHandle"], ["chhandle", "saveClaimedHandle"],
                         ["q", "runLiveSearch"]]){
  calls.length = 0;
  g.routeKeydown({key: "Enter", target: Object.assign(node({id}), {value: "dune"})});
  ok(calls.some(c => c.name === want), `Enter in #${id} -> ${want}`);
  calls.length = 0;
  g.routeKeydown({key: "a", target: node({id})});
  ok(calls.length === 0, `a plain keypress in #${id} does nothing`);
}
/* an unrouted click must be a no-op, not a throw */
calls.length = 0;
let threw = false;
try{ g.routeClick({target: node({id: "nothingInParticular"})}); }catch(e){ threw = true; }
ok(!threw && calls.length === 0, "an unrouted click is a silent no-op");

console.log(fail ? `\nFAILED (${fail})` : "\nALL PASS");
process.exit(fail ? 1 : 0);
