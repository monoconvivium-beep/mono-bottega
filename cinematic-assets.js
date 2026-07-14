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
    playback: "loop",
    visibilityThreshold: 0.22,
    decorative: true,
    status: "approved-with-watermark-review",
    attribution: "Asset ufficiale MONO; simbolo a stella incorporato nel master, non alterato.",
    mobileStrategy: "preserve-landscape"
  });

  const handsTeam = Object.freeze({
    id: "mono-hands-team",
    title: "Molte mani, una sola squadra",
    chapter: "about",
    primaryPage: "la-bottega",
    master: assetUrl("assets/cinematic/source/mono-03-molte-mani-master.mp4"),
    sources: Object.freeze([
      Object.freeze({ src: assetUrl("assets/cinematic/web/mono-03-molte-mani-desktop.webm"), type: "video/webm" }),
      Object.freeze({ src: assetUrl("assets/cinematic/web/mono-03-molte-mani-desktop.mp4"), type: "video/mp4" })
    ]),
    posterWebp: assetUrl("assets/cinematic/web/mono-03-molte-mani-poster.webp"),
    posterAvif: null,
    posterTime: 9,
    width: 1280,
    height: 720,
    aspectRatio: "16 / 9",
    duration: 10.005,
    fps: 24,
    audio: false,
    playback: "once",
    visibilityThreshold: 0.4,
    sessionMemory: true,
    sessionKey: "mono-video-seen-hands-team",
    skip: true,
    replay: true,
    badge: true,
    badgeAsset: assetUrl("icons/mono-favicon.svg"),
    badgePosition: "bottom-right",
    badgeSize: "clamp(50px, 7vw, 76px)",
    badgeRight: "calc(9% - (var(--video-badge-size) / 2))",
    badgeBottom: "calc(15.3% - (var(--video-badge-size) / 2))",
    badgeBackground: "#F4ECDD",
    badgeLogoScale: 0.76,
    objectFit: "cover",
    objectPosition: "center center",
    decorative: true,
    analyticsMode: "cinematic-controls",
    status: "approved",
    attribution: "Asset ufficiale MONO; simbolo a stella incorporato nel master e coperto nel layout dal bollino ufficiale.",
    mobileStrategy: "preserve-landscape",
    secondaryUses: Object.freeze(["poster", "still", "short-extract"])
  });

  window.MONOCinematicAssets = Object.freeze({
    version: "20260714-hands-team-v1",
    byId: Object.freeze({
      [kitchenMagic.id]: kitchenMagic,
      [handsTeam.id]: handsTeam
    })
  });
})();
