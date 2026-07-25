/* HARNESS: the small pure helpers.

   These are the functions with no visible output, which is exactly why they are
   worth pinning: a broken pgPath produces a URL that PostgREST answers with a
   perfectly ordinary 200 and the wrong rows, and nothing in the UI looks wrong.

   Covered: pgVal / pgEq / pgNeq / pgIn / pgPath (URL construction and escaping),
   hueFromTitle (stability and range), and the poster cache readers
   (cacheEntry / posterHTML / the "x" no-match sentinel).

   Usage: node test/helpers.mjs   (from the repo root) */
import { buildApp } from "./seeds.mjs";

let fail = 0;
const ok = (c, m) => { console.log((c ? "  PASS  " : "  FAIL  ") + m); if(!c) fail++; };
const eq = (a, b, m) => ok(a === b, `${m}${a === b ? "" : `\n          expected ${JSON.stringify(b)}\n          got      ${JSON.stringify(a)}`}`);

/* Function declarations land on the vm's global object; `const` bindings do not,
   so POSTERS comes through the test epilogue instead. */
const {g, T} = buildApp();
const {pgVal, pgEq, pgNeq, pgIn, pgPath, hueFromTitle, cacheEntry, posterHTML, esc} = g;
const POSTERS = T.POSTERS;

/* ================= 1. pgVal: value escaping ================= */

eq(pgVal("tt0068646"), "tt0068646", "pgVal leaves a plain IMDb id alone");
eq(pgVal("Amélie"), "Am%C3%A9lie", "pgVal percent-encodes non-ASCII");
eq(pgVal("a b"), "a%20b", "pgVal encodes spaces");
eq(pgVal("a&b"), "a%26b", "pgVal encodes & (which would otherwise start a new query param)");
eq(pgVal("a+b"), "a%2Bb", "pgVal encodes + (which PostgREST would read as a space)");
eq(pgVal("a#b"), "a%23b", "pgVal encodes # (which would truncate the URL at a fragment)");
eq(pgVal("a,b"), "a%2Cb", "pgVal encodes , (the separator inside in.(...))");
eq(pgVal(42), "42", "pgVal stringifies numbers");
eq(pgVal(null), "null", "pgVal stringifies null rather than throwing");

/* the reason this matters: a comma in a value must not be able to add a member
   to an in.() list, and an ampersand must not be able to add a query parameter */
ok(!pgIn(["a,b", "c"]).includes("a,b"), "pgIn cannot be split by a comma inside a value");
eq(pgIn(["a,b", "c"]), "in.(a%2Cb,c)", "pgIn encodes members and joins with a literal comma");
eq(pgIn([]), "in.()", "pgIn of an empty list is a syntactically valid empty set");
eq(pgIn(["x"]), "in.(x)", "pgIn of one member");

eq(pgEq("me"), "eq.me", "pgEq prefixes eq.");
eq(pgEq("a b"), "eq.a%20b", "pgEq encodes its value");
eq(pgNeq("me"), "neq.me", "pgNeq prefixes neq.");

/* ================= 2. pgPath: URL construction ================= */

eq(pgPath("rankings"), "/rest/v1/rankings", "pgPath with no params is a bare table path");
eq(pgPath("rankings", {}), "/rest/v1/rankings", "pgPath with empty params adds no ?");
eq(pgPath("rankings", {select: "*"}), "/rest/v1/rankings?select=*",
   "pgPath appends a single param");
eq(pgPath("rankings", {user_id: pgEq("me"), select: "*"}),
   "/rest/v1/rankings?user_id=eq.me&select=*",
   "pgPath joins params with & in insertion order");

/* undefined / null params are dropped, so a caller can build one object with
   optional filters instead of assembling the query string conditionally */
eq(pgPath("t", {a: "1", b: undefined, c: "2"}), "/rest/v1/t?a=1&c=2", "pgPath drops undefined params");
eq(pgPath("t", {a: undefined}), "/rest/v1/t", "pgPath with only undefined params adds no ?");
eq(pgPath("t", {a: null, b: "1"}), "/rest/v1/t?b=1", "pgPath drops null params");
/* but falsy-yet-meaningful values must survive */
eq(pgPath("t", {limit: 0}), "/rest/v1/t?limit=0", "pgPath keeps 0 (it is not 'missing')");
eq(pgPath("t", {a: ""}), "/rest/v1/t?a=", "pgPath keeps an empty string");

/* operator syntax is the caller's, and must pass through untouched */
eq(pgPath("rankings", {order: "updated_at.desc", limit: 30}),
   "/rest/v1/rankings?order=updated_at.desc&limit=30",
   "pgPath does not encode operator syntax the caller authored");
eq(pgPath("watchlist", {on_conflict: "user_id,movie_id"}),
   "/rest/v1/watchlist?on_conflict=user_id,movie_id",
   "pgPath leaves an on_conflict column list intact");

/* the composed shape the app actually issues */
eq(pgPath("watchlist", {user_id: pgEq("u-1"), movie_id: pgIn(["tt1", "tt2"])}),
   "/rest/v1/watchlist?user_id=eq.u-1&movie_id=in.(tt1,tt2)",
   "the delete-reconcile URL composes correctly");
ok(pgPath("profiles", {handle: pgEq("o'neil")}).includes("o'neil".replace("'", "'")) ||
   pgPath("profiles", {handle: pgEq("o'neil")}) === "/rest/v1/profiles?handle=eq.o'neil",
   "an apostrophe in a handle survives as itself (encodeURIComponent leaves it)");

/* a hostile handle cannot escape its parameter */
{
  const p = pgPath("profiles", {handle: pgEq("x&select=*&id=eq.1")});
  ok(!/&select=\*/.test(p.slice(p.indexOf("handle="))),
     "a value containing &select= cannot inject a second parameter");
}

/* ================= 3. hueFromTitle ================= */

{
  const titles = ["The Godfather", "Amélie", "", "WALL·E", "a", "Don't Look Up", "🎬"];
  const hues = titles.map(hueFromTitle);
  ok(hues.every(h => Number.isInteger(h) && h >= 0 && h < 360),
     `hueFromTitle always returns an integer in [0,360) (${hues.join(", ")})`);
  eq(hueFromTitle("The Godfather"), hueFromTitle("The Godfather"), "hueFromTitle is stable for the same title");
  ok(hueFromTitle("The Godfather") !== hueFromTitle("The Godfather II"),
     "hueFromTitle distinguishes near-identical titles");
  eq(hueFromTitle(""), 0, "hueFromTitle of an empty title is 0");
  /* the whole point: a movie arriving via the catalog and via a cloud row must
     get the same colour, and both paths call this with the title alone */
  ok(hueFromTitle("Arrival") === hueFromTitle("Arrival"),
     "the same title yields the same hue no matter which code path asks");
  const spread = new Set(Array.from({length: 200}, (_, i) => hueFromTitle("Movie " + i))).size;
  ok(spread > 60, `hueFromTitle spreads 200 titles over ${spread} distinct hues (not degenerate)`);
}

/* ================= 4. the poster cache readers ================= */

/* cacheEntry normalises two historical shapes — a bare URL string written by
   older builds, and the {u, tt} object written now — and treats "x" as the
   "searched, no poster exists" sentinel rather than a URL. */
{
  const C = POSTERS.cache;
  for(const k of Object.keys(C)) delete C[k];

  eq(cacheEntry("nope"), null, "cacheEntry of an unknown id is null");

  C.legacy = "https://p/legacy.jpg";
  const legacy = cacheEntry("legacy");
  eq(legacy && legacy.u, "https://p/legacy.jpg", "cacheEntry upgrades a bare URL string to {u,tt}");
  eq(legacy && legacy.tt, null, "an upgraded legacy entry has a null tt");

  C.modern = {u: "https://p/m.jpg", tt: "tt42"};
  const modern = cacheEntry("modern");
  eq(modern && modern.u, "https://p/m.jpg", "cacheEntry passes an object entry through");
  eq(modern && modern.tt, "tt42", "and keeps its IMDb id for the CDN fallback");

  C.missing = "x";
  eq(cacheEntry("missing"), null, `cacheEntry treats the "x" sentinel as no poster, not as a URL`);

  C.empty = "";
  eq(cacheEntry("empty"), null, "cacheEntry treats an empty string as no poster");
}

/* posterHTML reads that cache and must escape everything it interpolates */
{
  const C = POSTERS.cache;
  for(const k of Object.keys(C)) delete C[k];

  const m = {id: "tt0068646", title: "The Godfather", year: 1972, hue: 100};

  const cold = posterHTML(m, "p-sm");
  ok(/data-pid="tt0068646"/.test(cold), "an uncached poster renders a data-pid placeholder for hydration");
  ok(!/src="/.test(cold), "and no src, so nothing is fetched until hydratePosters runs");
  ok(/aria-hidden="true"/.test(cold), "the poster card is aria-hidden (the title is adjacent text)");
  ok(/alt=""/.test(cold), "the poster img declares an empty alt");

  C["tt0068646"] = {u: "https://p/g.jpg?a=1&b=2", tt: "tt0068646"};
  const warm = posterHTML(m, "p-sm");
  ok(/src="https:\/\/p\/g\.jpg\?a=1&amp;b=2"/.test(warm), "a cached poster renders an escaped src immediately");
  ok(!/data-pid=/.test(warm), "and drops the hydration placeholder");

  /* a poster URL carried on the movie row wins over the cache */
  const withOwn = posterHTML({...m, poster: "https://own/p.jpg"}, "p-sm");
  ok(/src="https:\/\/own\/p\.jpg"/.test(withOwn), "a poster on the movie object beats the cache");

  /* hostile title and a non-IMDb id */
  const nasty = posterHTML({id: `c"><script>`, title: `<b>Bad</b> & "Ugly"`, year: "—", hue: 7}, "p-md");
  ok(!/<script>/.test(nasty), "a hostile custom id cannot break out of the placeholder attribute");
  ok(!/<b>/.test(nasty), "a hostile title is escaped in the initials");
  eq(esc(`<b>&"'`), "&lt;b&gt;&amp;&quot;&#39;", "esc covers all five HTML-significant characters");

  for(const k of Object.keys(C)) delete C[k];
}

console.log(fail ? `\nFAILED (${fail})` : "\nALL PASS");
process.exit(fail ? 1 : 0);
