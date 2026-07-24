/* Reeli service worker: network-first for the app itself, so users always get
   the newest deploy when online (no more 10-minute stale cache), and the last
   good copy when offline. Cross-origin requests (posters, APIs) pass through. */
const CACHE = "reeli-v1";
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(["./"])).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(self.clients.claim());
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
    }).catch(() => caches.match(req).then(r => r || caches.match("./")))
  );
});
