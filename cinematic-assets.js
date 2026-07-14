(() => {
  "use strict";

  const scriptUrl = new URL(document.currentScript?.src || window.location.href, window.location.href);
  const siteRoot = new URL("./", scriptUrl);
  const assetUrl = (path) => new URL(path, siteRoot).href;

  const kitchenMagic = Object.freeze({
    id: "mono-kitchen-magic",
    title: "La cucina lavora",
    chapter: "products",
    primaryPage: "gastronomia",
    master: assetUrl("assets/cinematic/source/mono-02-cucina-magica-master.mp4"),
    sources: Object.freeze([
      Object.freeze({ src: assetUrl("assets/cinematic/web/mono-02-cucina-magica-desktop.webm"), type: "video/webm" }),
      Object.freeze({ src: assetUrl("assets/cinematic/web/mono-02-cucina-magica-desktop.mp4"), type: "video/mp4" })
    ]),
    posterWebp: assetUrl("assets/cinematic/web/mono-02-cucina-magica-poster.webp"),
    posterAvif: null,
    posterTime: 8.5,
    width: 1280,
    height: 720,
    aspectRatio: "16 / 9",
    duration: 10.005,
    fps: 24,
    audio: false,
    decorative: true,
    status: "approved-with-watermark-review",
    attribution: "Asset ufficiale MONO; simbolo a stella incorporato nel master, non alterato.",
    mobileStrategy: "preserve-landscape"
  });

  window.MONOCinematicAssets = Object.freeze({
    version: "20260714-kitchen-magic-v1",
    byId: Object.freeze({
      [kitchenMagic.id]: kitchenMagic
    })
  });
})();
