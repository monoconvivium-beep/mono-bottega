const CACHE_NAME = "mono-site-v16";
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
  "./robots.txt",
  "./sitemap.xml",
  "./mono-loghissimo.svg",
  "./mono-convivium.svg",
  "./assets/brand/mono-logo-primary.svg",
  "./assets/brand/mono-logo-light.svg",
  "./assets/brand/mono-logo-mono.svg",
  "./assets/brand/mono-logo-champagne.svg",
  "./assets/brand/mono-convivium-primary.svg",
  "./assets/brand/mono-convivium-light.svg",
  "./assets/brand/mono-loghissimo-light.svg",
  "./assets/brand/mono-convivium-warm.svg",
  "./assets/product-visuals/gastronomia.svg",
  "./assets/product-visuals/pasticceria.svg",
  "./assets/product-visuals/aperitivo.svg",
  "./assets/product-visuals/catering.svg",
  "./assets/mono-table/mono-table-ritual-desktop.webp",
  "./assets/mono-table/mono-table-ritual-mobile.webp",
  "./assets/mono-table/mono-table-ritual-og.webp",
  "./assets/mono-table/mono-table-ritual-blur.webp",
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
