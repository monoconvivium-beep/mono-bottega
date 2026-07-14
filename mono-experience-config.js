(() => {
  "use strict";

  const scriptUrl = new URL(document.currentScript?.src || window.location.href, window.location.href);
  const siteRoot = new URL("./", scriptUrl);
  const absoluteUrl = (path = "") => new URL(path, siteRoot).href;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const saveData = Boolean(navigator.connection?.saveData);
  const slowConnection = /(^|-)2g$/.test(navigator.connection?.effectiveType || "");
  const lowMemory = Number(navigator.deviceMemory || 8) <= 4;
  const lowConcurrency = Number(navigator.hardwareConcurrency || 8) <= 4;

  const chapters = [
    {
      id: "home",
      title: "Home",
      eyebrow: "La bottega prende vita",
      preview: "Buono come una volta. Pensato per la vita di oggi.",
      href: "",
      index: 1,
      temperature: "fire",
      regia: "materica",
      gesture: "vapore",
      entry: "steam",
      exit: "steam",
      primaryAction: "Scopri i prodotti",
      cinematicAsset: "mono-fire-ravioli",
      narrativeObject: "pot"
    },
    {
      id: "products",
      title: "Prodotti",
      eyebrow: "Quello che trovi da MONO",
      preview: "Poche linee. Molta memoria.",
      href: "gastronomia/",
      index: 2,
      temperature: "warm",
      regia: "monumentale",
      gesture: "materia",
      entry: "counter",
      exit: "plate",
      primaryAction: "Scopri le categorie",
      cinematicAsset: "mono-kitchen-magic",
      narrativeObject: "plate"
    },
    {
      id: "mono",
      title: "Cos'è MONO",
      eyebrow: "Memoria e contemporaneità",
      preview: "La tradizione incontra la vita di oggi.",
      href: "#bottega",
      index: 3,
      temperature: "warm",
      regia: "dialogata",
      gesture: "o",
      entry: "o-portal",
      exit: "gesture",
      primaryAction: "Comprendi MONO",
      cinematicAsset: null,
      narrativeObject: "linen"
    },
    {
      id: "people",
      title: "Chi siamo",
      eyebrow: "Una visione. Molte mani.",
      preview: "Molte mani. Una sola bottega.",
      href: "la-bottega/",
      index: 4,
      temperature: "human",
      regia: "monumentale",
      gesture: "mani",
      entry: "hand",
      exit: "apron",
      primaryAction: "Conosci il metodo",
      cinematicAsset: "mono-hands-team",
      narrativeObject: "spoon"
    },
    {
      id: "convivium",
      title: "MONO Convivium",
      eyebrow: "Formazione, lavoro, autonomia",
      preview: "Il cuore sociale lavora nella stessa squadra.",
      href: "mono-convivium/",
      index: 5,
      temperature: "human",
      regia: "silenziosa",
      gesture: "filo",
      entry: "thread",
      exit: "table",
      primaryAction: "Approfondisci Convivium",
      cinematicAsset: null,
      narrativeObject: "apron"
    },
    {
      id: "events",
      title: "Eventi",
      eyebrow: "La tavola delle occasioni",
      preview: "Ogni occasione merita il calore giusto.",
      href: "eventi/",
      index: 6,
      temperature: "convivial",
      regia: "dialogata",
      gesture: "tavola",
      entry: "table",
      exit: "card",
      primaryAction: "Richiedi una proposta",
      cinematicAsset: "mono-event-table",
      narrativeObject: "glass"
    },
    {
      id: "app",
      title: "App",
      eyebrow: "Il filo quotidiano",
      preview: "Ordini, vantaggi e relazione nello stesso posto.",
      href: "app/",
      index: 7,
      temperature: "clear",
      regia: "silenziosa",
      gesture: "flusso",
      entry: "card",
      exit: "route",
      primaryAction: "Apri app MONO",
      cinematicAsset: null,
      narrativeObject: "card"
    },
    {
      id: "location",
      title: "Dove siamo",
      eyebrow: "Torino, Santa Rita",
      preview: "La linea arriva in Via Barletta 72D.",
      href: "contatti/",
      index: 8,
      temperature: "local",
      regia: "materica",
      gesture: "traccia",
      entry: "route",
      exit: "workstation",
      primaryAction: "Apri Google Maps",
      cinematicAsset: null,
      narrativeObject: "place"
    },
    {
      id: "jobs",
      title: "Lavora con noi",
      eyebrow: "Persone, prima ancora dei ruoli",
      preview: "Una postazione pronta per chi lavora con cura.",
      href: "lavora-con-noi/",
      index: 9,
      temperature: "human",
      regia: "silenziosa",
      gesture: "cura",
      entry: "workstation",
      exit: "table-complete",
      primaryAction: "Invia la candidatura",
      cinematicAsset: null,
      narrativeObject: "tools"
    }
  ].map((chapter, chapterIndex, chapterList) => Object.freeze({
    ...chapter,
    previousId: chapterList[(chapterIndex - 1 + chapterList.length) % chapterList.length].id,
    nextId: chapterList[(chapterIndex + 1) % chapterList.length].id
  }));

  const chapterById = Object.freeze(Object.fromEntries(chapters.map((chapter) => [chapter.id, chapter])));
  const chapterPathPattern = /\/(?:la-bottega|gastronomia|pasticceria|aperitivo|catering|eventi|app|contatti|lavora-con-noi|mono-convivium)\/?$/;
  const normalizePath = (pathname = "/") => {
    const clean = pathname.replace(/index\.html$/i, "").replace(/\/{2,}/g, "/");
    return clean.endsWith("/") ? clean : `${clean}/`;
  };

  const worldFromUrl = (input = window.location.href) => {
    const url = input instanceof URL ? input : new URL(input, window.location.href);
    if (url.hash === "#bottega") return "mono";
    if (url.hash === "#prodotti") return "products";
    if (url.hash === "#dove-siamo") return "location";
    const path = normalizePath(url.pathname);
    if (/\/la-bottega\/$/.test(path)) return "people";
    if (/\/(gastronomia|pasticceria|aperitivo)\/$/.test(path)) return "products";
    if (/\/(eventi|catering)\/$/.test(path)) return "events";
    if (/\/mono-convivium\/$/.test(path)) return "convivium";
    if (/\/app\/$/.test(path)) return "app";
    if (/\/contatti\/$/.test(path)) return "location";
    if (/\/lavora-con-noi\/$/.test(path)) return "jobs";
    return "home";
  };

  const chapterUrl = (chapterOrId) => {
    const chapter = typeof chapterOrId === "string" ? chapterById[chapterOrId] : chapterOrId;
    if (!chapter) return siteRoot.href;
    return absoluteUrl(chapter.href);
  };

  const getChapter = (id = worldFromUrl()) => chapterById[id] || chapterById.home;
  const getAdjacent = (id = worldFromUrl()) => {
    const current = getChapter(id);
    return Object.freeze({
      current,
      previous: chapterById[current.previousId],
      next: chapterById[current.nextId]
    });
  };

  const hour = new Date().getHours();
  const time = hour >= 5 && hour < 11 ? "morning" : hour >= 11 && hour < 18 ? "day" : "evening";
  const detectedQuality = reducedMotion.matches || saveData
    ? "reduced"
    : finePointer.matches && !lowMemory && !lowConcurrency && !slowConnection
      ? "full"
      : "balanced";

  const defaults = {
    quality: detectedQuality,
    flags: {
      monoFlow: true,
      oPortal: true,
      monoDrop: true,
      oilTrail: true,
      microDroplets: true,
      oilRefraction: true,
      monoTable: true,
      timeTheme: true,
      cinematicAutoplay: true,
      videoBadges: true,
      oilAlive: true
    }
  };
  const overrides = window.MONO_EXPERIENCE_OVERRIDES || {};
  const quality = ["full", "balanced", "reduced", "static"].includes(overrides.quality)
    ? overrides.quality
    : defaults.quality;
  const flags = Object.freeze({ ...defaults.flags, ...(overrides.flags || {}) });
  const runtime = Object.freeze({
    quality,
    time,
    reducedMotion: reducedMotion.matches,
    finePointer: finePointer.matches,
    saveData,
    slowConnection,
    lowMemory,
    lowConcurrency,
    flags: Object.freeze({
      ...flags,
      monoDrop: flags.monoDrop && quality !== "static" && quality !== "reduced" && finePointer.matches,
      oilTrail: flags.oilTrail && quality === "full" && finePointer.matches,
      microDroplets: flags.microDroplets && quality === "full" && finePointer.matches,
      oilRefraction: flags.oilRefraction && quality === "full" && finePointer.matches,
      cinematicAutoplay: flags.cinematicAutoplay && quality !== "static" && quality !== "reduced" && !saveData
    })
  });

  const safeStorage = Object.freeze({
    get(storage, key, fallback = null) {
      try {
        const value = storage?.getItem(key);
        return value === null ? fallback : value;
      } catch (error) {
        return fallback;
      }
    },
    set(storage, key, value) {
      try {
        storage?.setItem(key, value);
        return true;
      } catch (error) {
        return false;
      }
    },
    remove(storage, key) {
      try {
        storage?.removeItem(key);
        return true;
      } catch (error) {
        return false;
      }
    }
  });

  document.documentElement.dataset.monoQuality = runtime.quality;
  document.documentElement.dataset.monoTime = runtime.time;

  window.MONOExperienceConfig = Object.freeze({
    version: "20260714-engineering-master-v1",
    siteRoot: siteRoot.href,
    chapterPathPattern,
    chapters: Object.freeze(chapters),
    chapterById,
    normalizePath,
    worldFromUrl,
    chapterUrl,
    getChapter,
    getAdjacent,
    absoluteUrl,
    runtime,
    safeStorage,
    keys: Object.freeze({
      visitedChapters: "mono-visited-chapters",
      navigationPending: "mono-navigation-pending-v1"
    })
  });
})();
