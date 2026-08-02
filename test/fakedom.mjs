/* A DOM stub just real enough to load Reeli's app.js in Node and capture the
   HTML its render functions produce. Not a browser: querySelectorAll returns
   nothing, so event wiring is a no-op and only markup is observed. That is
   exactly the point — it lets the same seeded state be pushed through two
   different builds of app.js and the resulting HTML compared byte for byte. */

class ClassList {
  constructor(){ this.s = new Set(); }
  add(...c){ c.forEach(x => this.s.add(x)); }
  remove(...c){ c.forEach(x => this.s.delete(x)); }
  contains(c){ return this.s.has(c); }
  toggle(c, on){ const want = on === undefined ? !this.s.has(c) : !!on; want ? this.s.add(c) : this.s.delete(c); return want; }
  get value(){ return [...this.s].join(" "); }
}

class Style {
  setProperty(k, v){ this["--prop:" + k] = v; }
  removeProperty(k){ delete this["--prop:" + k]; }
}

export class FakeEl {
  constructor(tag, key){
    this.tagName = (tag || "div").toUpperCase();
    this.__key = key || "";
    this.classList = new ClassList();
    this.dataset = {};
    this.attrs = {};
    this.style = new Style();
    this.innerHTML = "";
    this.textContent = "";
    this.value = "";
    this.title = "";
    this.placeholder = "";
    this.selectionStart = 0;
    this.files = [];
    this.listeners = {};
    this.children = [];
    /* focus management reads both: `isConnected` decides whether focus can be
       handed back, `offsetParent` filters out hidden candidates */
    this.isConnected = true;
    this.offsetParent = null;
    this.hidden = false;
  }
  setAttribute(k, v){ this.attrs[k] = String(v); if(k === "hidden") this.hidden = true; }
  getAttribute(k){ return k in this.attrs ? this.attrs[k] : null; }
  removeAttribute(k){ delete this.attrs[k]; if(k === "hidden") this.hidden = false; }
  hasAttribute(k){ return k in this.attrs; }
  contains(el){ return el === this; }
  addEventListener(t, fn){ (this.listeners[t] = this.listeners[t] || []).push(fn); }
  removeEventListener(){}
  /* a throwaway stand-in rather than null: the pre-refactor build did
     container.querySelector(...).addEventListener(...) with no guard, and the
     harness is comparing markup, not wiring */
  querySelector(){ return new FakeEl("div"); }
  querySelectorAll(){ return []; }
  closest(){ return null; }
  insertAdjacentHTML(_pos, html){ this.innerHTML += html; }
  appendChild(c){ this.children.push(c); return c; }
  focus(){}
  blur(){}
  click(){ (this.listeners.click || []).forEach(f => f({})); }
  setSelectionRange(){}
  remove(){}
  getContext(){ return {drawImage(){}}; }
  toBlob(cb){ cb(null); }
}

/* A Date whose "now" never moves, and whose locale formatting does not depend on
   the machine running the tests.

   The app renders timestamps relatively (relTime: "just now" / "2h" / "1d"), so
   with the real clock the same seeded state hashes differently on every run —
   the snapshot would rot within hours and locale-format differently in CI than
   on a laptop. Both are pinned here instead of being kept out of the seeds,
   so time-dependent markup is covered rather than avoided. */
export const FROZEN_NOW = Date.UTC(2026, 6, 26, 12, 0, 0); // 2026-07-26T12:00:00Z
export class FrozenDate extends Date {
  constructor(...a){ super(...(a.length ? a : [FROZEN_NOW])); }
  static now(){ return FROZEN_NOW; }
  toLocaleDateString(){ return this.toISOString().slice(0, 10); }
  toLocaleTimeString(){ return this.toISOString().slice(11, 19); }
  toLocaleString(){ return this.toISOString(); }
}

/* Build one isolated global object for a vm context. */
export function makeGlobals(){
  const registry = new Map();
  const el = key => {
    if(!registry.has(key)) registry.set(key, new FakeEl("div", key));
    return registry.get(key);
  };

  const documentElement = new FakeEl("html", "html");
  const document = {
    documentElement,
    body: new FakeEl("body", "body"),
    querySelector: sel => el(sel),
    querySelectorAll: () => [],
    getElementById: id => el("#" + id),
    createElement: tag => new FakeEl(tag),
    addEventListener(){},
    removeEventListener(){},
  };

  const store = new Map();
  const localStorage = {
    getItem: k => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: k => store.delete(k),
  };

  /* Every network call resolves to a non-ok response: no data ever arrives, so
     both builds render from the seeded state alone and stay comparable. */
  const response = () => Promise.resolve({
    ok: false, status: 0,
    json: () => Promise.resolve([]),
    text: () => Promise.resolve(""),
    clone(){ return this; },
  });

  const g = {
    document, localStorage,
    fetch: response,
    /* see FrozenDate below — the clock must not move, or any render that turns a
       timestamp into "2h"/"1d" would hash differently tomorrow than it does today */
    console: { log(){}, warn(){}, error(){} },
    /* no serviceWorker key at all: the app feature-detects with `in` */
    navigator: { share: undefined, clipboard: undefined },
    location: { origin: "https://reeli.org", pathname: "/", search: "", hash: "", href: "https://reeli.org/", protocol: "https:" },
    history: { replaceState(){} },
    CSS: { escape: s => String(s).replace(/["\\]/g, "\\$&") },
    AbortController, URLSearchParams, URL, Image: FakeEl,
    setTimeout: () => 0, clearTimeout(){}, setInterval: () => 0, clearInterval(){},
    prompt: () => null, confirm: () => false, alert(){},
    Math, JSON, Date: FrozenDate, Object, Array, String, Number, Boolean, Set, Map, Promise,
    RegExp, Error, parseInt, parseFloat, isNaN, encodeURIComponent, decodeURIComponent,
    /* window-level listeners (online, hashchange) — recorded, never fired */
    addEventListener(){}, removeEventListener(){}, scrollTo(){}, open(){},
    __registry: registry,
  };
  g.window = g;
  g.globalThis = g;
  g.self = g;
  return g;
}

/* app.js up to the boot section. Everything after that marker registers the
   service worker and kicks off network calls; the render functions themselves
   are all defined before it, so both builds get cut at the same seam. */
export function bodyOf(src){
  const i = src.indexOf("/* ---------- boot ---------- */");
  if(i < 0) throw new Error("boot marker not found");
  return src.slice(0, i);
}

/* Appended identically to both builds so the harness can reach bindings that
   `let`/`const` keep out of the context object. */
export const TEST_EPILOGUE = `
globalThis.__T = {
  get S(){ return S; }, set S(v){ S = v; },
  get AUTH(){ return AUTH; }, set AUTH(v){ AUTH = v; },
  get feedTab(){ return feedTab; }, set feedTab(v){ feedTab = v; },
  get mateQuery(){ return mateQuery; }, set mateQuery(v){ mateQuery = v; },
  get mateResults(){ return mateResults; }, set mateResults(v){ mateResults = v; },
  get mateState(){ return mateState; }, set mateState(v){ mateState = v; },
  get mateSugg(){ return mateSugg; }, set mateSugg(v){ mateSugg = v; },
  get rankFilter(){ return rankFilter; }, set rankFilter(v){ rankFilter = v; },
  get rankGenre(){ return rankGenre; }, set rankGenre(v){ rankGenre = v; },
  get rankType(){ return rankType; }, set rankType(v){ rankType = v; },
  get query(){ return query; }, set query(v){ query = v; },
  get liveResults(){ return liveResults; }, set liveResults(v){ liveResults = v; },
  get liveState(){ return liveState; }, set liveState(v){ liveState = v; },
  get searchType(){ return searchType; }, set searchType(v){ searchType = v; },
  get TRENDING(){ return TRENDING; }, set TRENDING(v){ TRENDING = v; },
  CLOUD, POSTERS, LIVE, MOVIES, DB,
  renderProfile, renderFeed, renderRanks, renderSearch, renderWatch,
  feedItemHTML, movieRowHTML,
};
`;
