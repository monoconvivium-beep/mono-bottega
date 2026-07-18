const CACHE_NAME = "mono-site-v107";
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
  "./eventi/",
  "./eventi/index.html",
  "./app/",
  "./app/index.html",
  "./lavora-con-noi/",
  "./lavora-con-noi/index.html",
  "./dove-siamo/",
  "./dove-siamo/index.html",
  "./contatti/",
  "./contatti/index.html",
  "./mono-convivium/",
  "./mono-convivium/index.html",
  "./mono-colors.css",
  "./styles.css",
  "./app.js",
  "./experience.css",
  "./experience.js",
  "./mono-engineering.css",
  "./mono-experience-config.js",
  "./mono-cinematic.js",
  "./mono-navigation.js",
  "./mono-signature.js",
  "./cinematic-assets.js",
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
  "./assets/hero/mono-kitchen-fire-poster.jpg",
  "./assets/hero/mono-kitchen-fire-og.jpg",
  "./assets/cinematic/web/mono-01-fuoco-ravioli-poster.webp",
  "./assets/cinematic/web/mono-01-ravioli-cut-poster.webp",
  "./assets/cinematic/web/mono-02-cucina-magica-poster.webp",
  "./assets/cinematic/web/mono-03-molte-mani-poster.webp",
  "./assets/app/mono-app-qr.svg",
  "./assets/mono-table/mono-table-ritual-desktop.webp",
  "./assets/mono-table/mono-table-ritual-mobile.webp",
  "./assets/mono-table/mono-table-ritual-og.webp",
  "./assets/mono-table/mono-table-ritual-blur.webp",
  "./icons/icon-192.svg",
  "./icons/icon-512.svg",
  "./icons/mono-favicon.svg"
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

  if (event.request.headers.has("range")) {
    event.respondWith(fetch(event.request));
    return;
  }

  if (event.request.destination === "video") {
    event.respondWith(fetch(event.request));
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
