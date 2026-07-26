/* Reeli service worker: network-first for the app itself, so users always get
   the newest deploy when online (no more 10-minute stale cache), and the last
   good copy when offline. Cross-origin requests (posters, APIs) pass through. */
/* Bump this on ANY change to the precache list below, and on any deploy that
   changes how the shell files fit together.

   v3: index.html no longer carries the app inline — the CSS moved to styles.css
   and the JS to posters.js / ranking.js / matching.js / app.js. A cache holding
   the v2 shell (a single self-contained index.html) alongside v3's would be a
   mix that only half-works offline, so the activate handler below deletes every
   cache whose name is not this one. Online users never see the seam: the fetch
   handler goes to the network first and only falls back to the cache.

   v4: index.html gained a doctype, a lang, a skip link and two live regions;
   styles.css gained the .sr-only/.skip/.alertbar rules and a corrected
   light-theme palette; app.js gained focus management and the offline queue.
   A cache still holding the v3 shell would serve markup whose stylesheet no
   longer matches it. */
/* v5: app.js feed items now store a real timestamp and render it relative,
   with a pull-time backfill for older entries — a v4 shell would still show
   the frozen "just now".
   v6: search covers TV shows + anime (series catalog), so app.js changed.
   v7: Letterboxd CSV import (auto + manual modes) added to app.js.
   v8: sync/pull race fix, feed sorted by time, memoized ranked/custom indexes. */
const CACHE = "reeli-v8";
/* the app shell: enough to boot and look right with no network at all.
   Precached individually rather than with addAll() so one missing/blocked file
   can't fail the whole install and leave the user with no service worker. */
const PRECACHE = [
  "./",
  "./index.html",
  "./styles.css",
  "./posters.js",
  "./ranking.js",
  "./matching.js",
  "./app.js",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
];
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.all(PRECACHE.map(u => c.add(u).catch(err => {
        console.warn("[reeli sw] precache skipped", u, err);
      }))))
      .then(() => self.skipWaiting())
  );
});
self.addEventListener("activate", e => {
  // drop every cache from an older CACHE name, so bumping the version above is
  // all it takes to evict stale shells instead of accumulating them forever
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .catch(err => console.warn("[reeli sw] cache cleanup failed", err))
      .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if(req.method !== "GET") return;
  let url;
  try{ url = new URL(req.url); }catch(err){ return; }
  if(url.origin !== self.location.origin) return; // posters/APIs: browser default
  e.respondWith(
    fetch(req, {cache: "no-cache"}).then(r => {
      if(r.ok){ const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return r;
    }).catch(() => caches.match(req).then(r => {
      if(r) return r;
      /* Last resort, and only for a navigation. The old code fell back to "./"
         for ANY uncached same-origin miss, which meant a failed app.js request
         was answered with index.html — the browser then tried to execute HTML
         as JavaScript and the app died in a way that looked nothing like being
         offline. Everything that isn't a page navigation now fails honestly. */
      if(req.mode === "navigate") return caches.match("./");
      return Response.error();
    }))
  );
});
