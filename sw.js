// Lets phones install the app and open it even with a weak connection. Network first, saved copy as backup.
const CACHE = "dd-v2";
const FILES = ["./", "index.html", "style.css", "app.js", "trie.js", "offers.js", "pricing.js", "recommend.js", "delivery.js", "account.js", "manifest.json"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return r; })
    .catch(() => caches.match(e.request)));
});
