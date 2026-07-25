/* HARNESS: no function references a name that doesn't exist.
 *
 * `node --check` only parses. A refactor that moves code between functions can
 * leave behind a reference to a variable that used to be in scope and isn't any
 * more — a ReferenceError that only fires when a user happens to press that
 * button. This calls every top-level function in the app with a spread of
 * plausible arguments and fails on any ReferenceError.
 *
 * TypeErrors are ignored: the fake DOM is deliberately incomplete, so
 * "x.foo is not a function" is the harness's fault, not the app's. Undefined
 * identifiers are never the harness's fault.
 *
 * Usage: node test/smoke.mjs   (from the repo root) */
import fs from "node:fs";
import vm from "node:vm";
import { makeGlobals } from "./fakedom.mjs";

/* Calling functions with the wrong arguments makes plenty of noise land in
   callbacks and promise chains. Swallow it — unless it is a ReferenceError,
   which is the one thing this file is looking for. */
const refErrors = [];
/* the app runs in a vm context with its own intrinsics, so a ReferenceError
   thrown in there is NOT an instanceof this realm's ReferenceError — go by name */
const isRef = e => !!e && (e.name === "ReferenceError" || e instanceof ReferenceError);
const collect = e => { if(isRef(e)) refErrors.push("async -> " + e.message); };
process.on("uncaughtException", collect);
process.on("unhandledRejection", collect);

const g = makeGlobals();
const ctx = vm.createContext(g);
const FILES = ["posters.js", "ranking.js", "matching.js", "app.js"];
for(const f of FILES) vm.runInContext(fs.readFileSync(f, "utf8"), ctx, {filename: f});

/* module state the sheet actions read back, so they take their real paths
   rather than bailing out at a null guard */
vm.runInContext(`globalThis.__S = {
  arm(){
    SHEET_PERSON = {id:"u1", handle:"h", name:"N"};
    PICK_MOVIE = MOVIES.godfather; PLACED_ID = "godfather"; detailId = "godfather";
    SHARE = {text:"t", url:"u"}; AUTH_MODE = "signup"; AUTH_EMAIL = "a@b.co";
    EDIT_P = {name:"n", handle:"@h", hue:172}; EDIT_NEW = false; pickedHue = 172;
    O = {genres:new Set(["Drama"]), dirs:new Set(), movies:new Set(["godfather"])};
    R = {id:"godfather", bucket:"loved", lo:0, hi:1, n:0, mid:0};
    AUTH = {access_token:"tok", refresh_token:"r", expires_at:9e9, user:{id:"me", email:"a@b.co"}};
    CLOUD.profile = {id:"me", handle:"me", display_name:"Me", avatar_hue:172};
    CLOUD.profileLoaded = true;
    CLOUD.feed = [{cloud:true, movie:"godfather", score:8, time:"3m", ts:"2026-01-01", note:"n",
                   likes:1, userId:"u1", handle:"h", who:{name:"N", hue:1, url:null}}];
    CLOUD.follows = new Set(["u1"]);
    S.profile = {name:"Me", handle:"@me", hue:172};
    S.loved = ["godfather","shawshank"]; S.fine = ["matrix"]; S.disliked = [];
    S.watch = ["alien"]; S.taste = {genres:["Drama"], dirs:["Wes Anderson"]};
    S.myFeed = [{movie:"godfather", score:8, time:"just now", note:"", likes:0, rank:1}];
    S.notes = {godfather:"great"};
  },
  MOVIES, S: () => S, CLOUD,
};`, ctx, {filename: "arm"});
g.__S.arm();

/* argument shapes to try; the first that doesn't ReferenceError is enough */
const el = {id: "x", dataset: {open:"godfather", rate:"godfather", watch:"alien", unwatch:"alien",
  like:"me0", clike:"u1|godfather", person:"u1", notif:"godfather", notifperson:"u1", cperson:"u1",
  pfollow:"u1", ftab:"mates", filter:"loved", gfilter:"Drama", acc:"42", oauth:"google",
  chue:"172", ehue:"172", g:"Drama", d:"Wes Anderson", m:"godfather", ob:"1", b:"loved",
  pick:"new", a:"rate", wall:"tt0068646", wt:"The Godfather", pid:"godfather"},
  value: "dune", files: [], classList: {toggle(){}, add(){}, remove(){}, contains: () => false},
  hasAttribute: () => true, closest(){ return this; }, focus(){}, setSelectionRange(){}, selectionStart: 0,
  querySelectorAll: () => [], querySelector: () => null, addEventListener(){}, style: {}, textContent: ""};

const movie = g.__S.MOVIES.godfather;
const ARGS = [
  [], ["godfather"], [el], [el, "chue"], ["loved"], [0], [1],
  [{}, 0], [movie], ["a", "b"], [movie, "p-sm"], ["signup"],
  [[], "Godfather", 1972], ["abc", "abd", 2], [el, "g", new Set()],
  ["x", "y"], [{lo:0, hi:2, n:0}, () => "m"], [{lo:0, hi:2, n:0}, 1, "new"],
];

const skip = new Set(["attachDelegates"]); // binds listeners; nothing to learn, and it is exercised by shell.mjs
const names = Object.keys(g).filter(k => typeof g[k] === "function" && !skip.has(k)
  && !["fetch","addEventListener","removeEventListener","scrollTo","open","parseInt","parseFloat","isNaN",
       "encodeURIComponent","decodeURIComponent","setTimeout","clearTimeout","setInterval","clearInterval",
       "prompt","confirm","alert"].includes(k)
  && typeof globalThis[k] !== "function");

let called = 0, reached = 0;
for(const name of names){
  let cleanCall = false;
  for(const args of ARGS){
    g.__S.arm();
    called++;
    try{
      const out = g[name](...args);
      cleanCall = true;
      if(out && typeof out.then === "function") out.then(() => {}, e => {
        if(isRef(e)) refErrors.push(`${name}(${args.length} args) async -> ${e.message}`);
      });
    }catch(e){
      if(isRef(e)) refErrors.push(`${name}(${args.length} args) -> ${e.message}`);
      else cleanCall = cleanCall || false; // TypeError from the stub DOM: not interesting
    }
  }
  if(cleanCall) reached++;
}
await new Promise(r => setImmediate(r));   // let async rejections land
await new Promise(r => setImmediate(r));

let fail = 0;
const ok = (c, m) => { console.log((c ? "  PASS  " : "  FAIL  ") + m); if(!c) fail++; };
ok(names.length > 100, `${names.length} top-level functions found`);
ok(reached > names.length * 0.8, `${reached}/${names.length} completed at least one call without throwing`);
ok(refErrors.length === 0, `no ReferenceError across ${called} calls` +
   (refErrors.length ? "\n          " + [...new Set(refErrors)].join("\n          ") : ""));

console.log(fail ? `\nFAILED (${fail})` : "\nALL PASS");
process.exit(fail ? 1 : 0);
