// Crew sheet offline cache: the page itself is tiny and the plan lives in the link,
// so caching index.html is enough for a crew member at an aid station with no signal.
const CACHE = "crew-v1";
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.add("./")).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
// Network first (so fixes reach people), cache when offline
self.addEventListener("fetch", e => {
  if (e.request.mode !== "navigate") return;
  e.respondWith(fetch(e.request).then(r => {
    const copy = r.clone(); caches.open(CACHE).then(c => c.put("./", copy)); return r;
  }).catch(() => caches.match("./")));
});
