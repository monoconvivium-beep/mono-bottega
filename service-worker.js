const CACHE_NAME = "mono-site-v10";
const ASSETS = [
  "./",
  "./index.html",
  "./la-bottega/",
  "./la-bottega/index.html",
  "./gastronomia/",
  "./gastronomia/index.html",
  "./pasticceria/",
  "./pasticceria/index.html",
  "./aperitivo/",
  "./aperitivo/index.html",
  "./catering/",
  "./catering/index.html",
  "./app/",
  "./app/index.html",
  "./contatti/",
  "./contatti/index.html",
  "./mono-convivium/",
  "./mono-convivium/index.html",
  "./pdf/mono-convivium.pdf",
  "./styles.css",
  "./app.js",
  "./mono-3d.js",
  "./manifest.webmanifest",
  "./mono-loghissimo.svg",
  "./mono-convivium.svg",
  "./icons/icon-192.svg",
  "./icons/icon-512.svg"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
