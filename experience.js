(() => {
  "use strict";

  const body = document.body;
  const root = document.documentElement;
  const experienceConfig = window.MONOExperienceConfig;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const memoryKey = experienceConfig?.keys?.visitedChapters || "mono-visited-chapters";
  const legacyMemoryKey = "mono_table_memory_v1";
  const introKey = "mono_intro_seen_v1";

  if (!body?.classList.contains("mono-world")) {
    return;
  }

  const fallbackWorldTargets = [
    { id: "mono", label: "Cos'è MONO", href: "#bottega", object: "linen" },
    { id: "products", label: "Prodotti", href: "gastronomia/", object: "plate" },
    { id: "people", label: "Chi siamo", href: "la-bottega/", object: "spoon" },
    { id: "convivium", label: "MONO Convivium", href: "mono-convivium/", object: "apron" },
    { id: "events", label: "Eventi", href: "eventi/", object: "glass" },
    { id: "app", label: "App MONO", href: "app/", object: "card" },
    { id: "location", label: "Dove siamo", href: "contatti/", object: "place" },
    { id: "jobs", label: "Lavora con noi", href: "lavora-con-noi/", object: "tools" }
  ];
  const worldTargets = experienceConfig?.chapters
    ?.filter((chapter) => chapter.id !== "home")
    .map((chapter) => ({ id: chapter.id, label: chapter.title, href: chapter.href, object: chapter.narrativeObject })) || fallbackWorldTargets;

  const fallbackChapterSequence = [
    { id: "home", label: "Home", href: "./", temperature: "fire", regia: "materica", gesture: "vapore" },
    { id: "products", label: "Prodotti", href: "gastronomia/", temperature: "warm", regia: "materica", gesture: "materia" },
    { id: "mono", label: "Cos'è MONO", href: "#bottega", temperature: "warm", regia: "monumentale", gesture: "o" },
    { id: "people", label: "Chi siamo", href: "la-bottega/", temperature: "human", regia: "dialogata", gesture: "mani" },
    { id: "convivium", label: "MONO Convivium", href: "mono-convivium/", temperature: "human", regia: "silenziosa", gesture: "filo" },
    { id: "events", label: "Eventi", href: "eventi/", temperature: "convivial", regia: "monumentale", gesture: "tavola" },
    { id: "app", label: "App MONO", href: "app/", temperature: "clear", regia: "silenziosa", gesture: "flusso" },
    { id: "location", label: "Dove siamo", href: "contatti/", temperature: "local", regia: "monumentale", gesture: "traccia" },
    { id: "jobs", label: "Lavora con noi", href: "lavora-con-noi/", temperature: "human", regia: "dialogata", gesture: "cura" }
  ];
  const chapterSequence = experienceConfig?.chapters?.map((chapter) => ({ ...chapter, label: chapter.title })) || fallbackChapterSequence;

  const sceneMarkup = {
    people: `
      <svg class="scene-table-plan" viewBox="0 0 520 520" focusable="false" aria-hidden="true">
        <defs>
          <radialGradient id="monoPeopleTableSurface" cx="38%" cy="30%" r="76%">
            <stop offset="0" stop-color="#fff9ee" />
            <stop offset="0.72" stop-color="#f4ecdd" />
            <stop offset="1" stop-color="#efe3c6" />
          </radialGradient>
          <linearGradient id="monoPeopleChairFinish" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#e27a60" />
            <stop offset="1" stop-color="#b85c38" />
          </linearGradient>
          <filter id="monoPeopleTableShadow" x="-30%" y="-30%" width="160%" height="170%">
            <feDropShadow dx="0" dy="18" stdDeviation="16" flood-color="#262321" flood-opacity="0.16" />
          </filter>
        </defs>
        <circle class="scene-table-plan__halo" cx="260" cy="260" r="232" />
        <g class="scene-table-plan__chairs" filter="url(#monoPeopleTableShadow)">
          <g transform="rotate(0 260 260)"><rect x="218" y="24" width="84" height="126" rx="38" /><path d="M238 55h44" /></g>
          <g transform="rotate(72 260 260)"><rect x="218" y="24" width="84" height="126" rx="38" /><path d="M238 55h44" /></g>
          <g transform="rotate(144 260 260)"><rect x="218" y="24" width="84" height="126" rx="38" /><path d="M238 55h44" /></g>
          <g transform="rotate(216 260 260)"><rect x="218" y="24" width="84" height="126" rx="38" /><path d="M238 55h44" /></g>
          <g transform="rotate(288 260 260)"><rect x="218" y="24" width="84" height="126" rx="38" /><path d="M238 55h44" /></g>
        </g>
        <g class="scene-table-plan__table" filter="url(#monoPeopleTableShadow)">
          <circle cx="260" cy="260" r="160" />
          <circle class="scene-table-plan__rim" cx="260" cy="260" r="153" />
        </g>
        <g class="scene-table-plan__settings">
          <g transform="rotate(0 260 260)"><circle cx="260" cy="145" r="20" /><path d="M247 169h26" /></g>
          <g transform="rotate(72 260 260)"><circle cx="260" cy="145" r="20" /><path d="M247 169h26" /></g>
          <g transform="rotate(144 260 260)"><circle cx="260" cy="145" r="20" /><path d="M247 169h26" /></g>
          <g transform="rotate(216 260 260)"><circle cx="260" cy="145" r="20" /><path d="M247 169h26" /></g>
          <g transform="rotate(288 260 260)"><circle cx="260" cy="145" r="20" /><path d="M247 169h26" /></g>
        </g>
        <circle class="scene-table-plan__center" cx="260" cy="260" r="27" />
        <circle class="scene-table-plan__center-dot" cx="260" cy="260" r="7" />
      </svg>`,
    products: `
      <span class="scene-tray"></span>
      <span class="scene-ingredient scene-ingredient--one"></span>
      <span class="scene-ingredient scene-ingredient--two"></span>
      <span class="scene-ingredient scene-ingredient--three"></span>
      <span class="scene-herb scene-herb--one"></span>
      <span class="scene-herb scene-herb--two"></span>`,
    pastry: `
      <span class="scene-dessert-plate"></span>
      <span class="scene-dessert"></span>
      <span class="scene-dessert-glaze"></span>
      <span class="scene-dessert-dot scene-dessert-dot--one"></span>
      <span class="scene-dessert-dot scene-dessert-dot--two"></span>`,
    aperitivo: `
      <span class="scene-glass"></span>
      <span class="scene-glass-liquid"></span>
      <span class="scene-olive"></span>
      <span class="scene-bottle-reflection"></span>`,
    events: `
      <span class="scene-linen"></span>
      <span class="scene-event-plate scene-event-plate--one"></span>
      <span class="scene-event-plate scene-event-plate--two"></span>
      <span class="scene-event-glass scene-event-glass--one"></span>
      <span class="scene-event-glass scene-event-glass--two"></span>`,
    app: `
      <span class="scene-receipt"><i></i><i></i><i></i></span>
      <span class="scene-app-card scene-app-card--one"></span>
      <span class="scene-app-card scene-app-card--two"></span>
      <span class="scene-app-card scene-app-card--three"></span>`,
    location: `
      <svg class="scene-route" viewBox="0 0 520 360" focusable="false" aria-hidden="true">
        <path d="M30 276 C92 232 92 108 172 106 C248 104 234 278 326 258 C406 240 376 120 486 74" />
        <circle cx="30" cy="276" r="9" />
        <circle class="scene-route-destination" cx="486" cy="74" r="17" />
      </svg>
      <span class="scene-route-label">72D</span>`,
    jobs: `
      <svg class="scene-megaphone" viewBox="0 0 560 460" focusable="false" aria-hidden="true">
        <defs>
          <linearGradient id="monoJobsMegaphoneBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#e27a60" />
            <stop offset="1" stop-color="#b85c38" />
          </linearGradient>
          <linearGradient id="monoJobsMegaphoneCone" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="#efe3c6" />
            <stop offset="0.72" stop-color="#f4ecdd" />
            <stop offset="1" stop-color="#cba75a" />
          </linearGradient>
          <filter id="monoJobsMegaphoneShadow" x="-30%" y="-30%" width="170%" height="180%">
            <feDropShadow dx="0" dy="18" stdDeviation="17" flood-color="#262321" flood-opacity="0.17" />
          </filter>
        </defs>
        <circle class="scene-megaphone__halo" cx="316" cy="227" r="205" />
        <g class="scene-megaphone__sound">
          <path d="M472 86 L523 44" />
          <path d="M500 130 L550 111" />
          <path d="M506 183 L558 184" />
          <path d="M494 235 L545 258" />
        </g>
        <g class="scene-megaphone__object" filter="url(#monoJobsMegaphoneShadow)">
          <rect class="scene-megaphone__rear" x="92" y="174" width="166" height="82" rx="41" />
          <rect class="scene-megaphone__neck" x="223" y="185" width="62" height="60" rx="18" />
          <path class="scene-megaphone__cone" d="M263 168 L445 81 Q467 70 472 94 L505 257 Q510 283 486 276 L263 224 Z" />
          <ellipse class="scene-megaphone__rim" cx="482" cy="180" rx="46" ry="99" transform="rotate(-10 482 180)" />
          <ellipse class="scene-megaphone__mouth" cx="478" cy="180" rx="31" ry="77" transform="rotate(-10 478 180)" />
          <path class="scene-megaphone__handle" d="M246 224 L300 232 L273 360 Q269 378 251 376 L218 372 Q204 369 210 352 Z" />
          <path class="scene-megaphone__trigger" d="M250 246 L284 252 L276 278 L242 272 Z" />
        </g>
        <g class="scene-megaphone__hand" filter="url(#monoJobsMegaphoneShadow)">
          <path class="scene-megaphone__sleeve" d="M113 388 L198 338 L250 409 L153 457 L93 457 Z" />
          <path class="scene-megaphone__skin" d="M189 329 Q210 300 232 297 L273 302 Q286 304 286 316 Q285 328 270 329 L244 328 L273 344 Q285 351 279 362 Q273 372 260 367 L231 351 L251 369 Q261 379 251 388 Q242 397 231 387 L205 363 L218 381 Q225 393 214 400 Q203 406 194 394 L163 354 Q156 342 166 334 Z" />
          <path class="scene-megaphone__cuff" d="M143 360 L188 335 L218 381 L174 408 Z" />
        </g>
      </svg>`,
    convivium: `
      <svg class="scene-thread" viewBox="0 0 520 280" focusable="false" aria-hidden="true">
        <path d="M34 188 C90 72 144 214 208 116 C270 22 314 218 382 118 C424 58 460 74 492 52" />
        <circle cx="34" cy="188" r="8" />
        <circle cx="145" cy="155" r="8" />
        <circle cx="260" cy="93" r="8" />
        <circle cx="382" cy="118" r="8" />
        <circle cx="492" cy="52" r="8" />
      </svg>
      <span class="scene-team-apron"></span>`
  };

  function normalizePath(pathname) {
    const cleanPath = pathname.replace(/index\.html$/i, "").replace(/\/{2,}/g, "/");
    return cleanPath.endsWith("/") ? cleanPath : `${cleanPath}/`;
  }

  function siteRootUrl() {
    const chapterPath = /\/(?:la-bottega|gastronomia|pasticceria|aperitivo|catering|eventi|app|contatti|lavora-con-noi|mono-convivium)\/$/;
    return new URL(chapterPath.test(normalizePath(window.location.pathname)) ? "../" : "./", window.location.href);
  }

  function chapterUrl(chapter) {
    const href = chapter.href.startsWith("#") ? `./${chapter.href}` : chapter.href;
    return new URL(href, siteRootUrl()).href;
  }

  function trackExperience(action, element = body) {
    if (typeof window.MONOTrackEvent === "function") {
      window.MONOTrackEvent(action, element);
    }
  }

  function worldFromUrl(url) {
    if (experienceConfig?.worldFromUrl) return experienceConfig.worldFromUrl(url);
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
  }

  function currentWorld() {
    const urlWorld = worldFromUrl(new URL(window.location.href));
    return urlWorld === "mono" || window.location.hash ? urlWorld : body.dataset.monoWorld || urlWorld;
  }

  function setupCreativeDirection() {
    const chapter = chapterSequence.find((item) => item.id === currentWorld()) || chapterSequence[0];
    const hour = new Date().getHours();
    const time = experienceConfig?.runtime?.time || (hour >= 5 && hour < 11 ? "morning" : hour >= 11 && hour < 18 ? "day" : "evening");

    body.dataset.monoTemperature = chapter.temperature;
    body.dataset.monoRegia = chapter.regia;
    body.dataset.monoGesture = chapter.gesture;
    body.dataset.monoTime = time;
  }

  function safeReadMemory() {
    try {
      const storedValue = window.localStorage.getItem(memoryKey) || window.localStorage.getItem(legacyMemoryKey);
      const parsedValue = storedValue ? JSON.parse(storedValue) : [];
      if (!window.localStorage.getItem(memoryKey) && storedValue) {
        window.localStorage.setItem(memoryKey, storedValue);
      }
      return Array.isArray(parsedValue) ? parsedValue.filter((value) => typeof value === "string") : [];
    } catch (error) {
      return [];
    }
  }

  function safeWriteMemory(values) {
    try {
      window.localStorage.setItem(memoryKey, JSON.stringify([...new Set(values)]));
    } catch (error) {
      root.classList.add("mono-storage-unavailable");
    }
  }

  function rememberWorld(worldId) {
    if (!worldTargets.some((target) => target.id === worldId)) {
      return safeReadMemory();
    }

    const rememberedWorlds = safeReadMemory();
    if (!rememberedWorlds.includes(worldId)) {
      rememberedWorlds.push(worldId);
      safeWriteMemory(rememberedWorlds);
    }
    return rememberedWorlds;
  }

  function setupActiveNavigation() {
    const navLinks = [...document.querySelectorAll(".nav a")];
    const worldId = currentWorld();

    navLinks.forEach((link) => {
      let linkWorld = "";
      try {
        linkWorld = worldFromUrl(new URL(link.href, window.location.href));
      } catch (error) {
        return;
      }

      if (linkWorld === worldId && worldId !== "home") {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    if (worldId !== "home" || !("IntersectionObserver" in window)) {
      return;
    }

    const sectionLinks = navLinks
      .map((link) => {
        const href = link.getAttribute("href") || "";
        const hash = href.startsWith("#") ? href : "";
        const section = hash ? document.querySelector(hash) : null;
        return section ? { link, section } : null;
      })
      .filter(Boolean);

    const sectionObserver = new IntersectionObserver((entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((firstEntry, secondEntry) => secondEntry.intersectionRatio - firstEntry.intersectionRatio)[0];

      if (!visibleEntry) return;
      navLinks.forEach((link) => link.removeAttribute("aria-current"));
      const match = sectionLinks.find((item) => item.section === visibleEntry.target);
      match?.link.setAttribute("aria-current", "location");
    }, { rootMargin: "-28% 0px -58%", threshold: [0.08, 0.3, 0.6] });

    sectionLinks.forEach((item) => sectionObserver.observe(item.section));
  }

  function setupPortalNavigation() {
    if (window.MONONavigation) return;
    const portal = document.createElement("div");
    portal.className = "mono-portal";
    portal.setAttribute("aria-hidden", "true");
    portal.innerHTML = '<span class="mono-portal__mark">O</span>';
    body.append(portal);

    root.classList.toggle("mono-view-transitions", "startViewTransition" in document);

    document.addEventListener("click", (event) => {
      const link = event.target.closest("a[href]");
      if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (link.target || link.hasAttribute("download") || link.dataset.noPortal !== undefined || prefersReducedMotion.matches) return;

      let destination;
      try {
        destination = new URL(link.href, window.location.href);
      } catch (error) {
        return;
      }

      const protocolIsNavigable = destination.protocol === "http:" || destination.protocol === "https:";
      const sameOrigin = destination.origin === window.location.origin;
      const samePage = normalizePath(destination.pathname) === normalizePath(window.location.pathname);
      const narrativeWorld = worldFromUrl(destination);
      const eligibleArea = link.closest(".nav, .site-footer, .mono-chapter-flow, .mono-table-memory, .hero-actions, .definition-section, .convivium-feature, .contacts-info");

      if (!protocolIsNavigable || !sameOrigin || samePage || !narrativeWorld || !eligibleArea) return;

      event.preventDefault();
      const originX = Number.isFinite(event.clientX) && event.clientX > 0 ? event.clientX : window.innerWidth / 2;
      const originY = Number.isFinite(event.clientY) && event.clientY > 0 ? event.clientY : window.innerHeight / 2;
      root.style.setProperty("--mono-portal-x", `${originX}px`);
      root.style.setProperty("--mono-portal-y", `${originY}px`);
      root.classList.add("is-portal-leaving");
      portal.setAttribute("aria-hidden", "false");
      trackExperience(`portal_${currentWorld()}_to_${narrativeWorld}`, link);

      window.setTimeout(() => {
        window.location.assign(destination.href);
      }, 620);
    });

    window.addEventListener("pageshow", () => {
      root.classList.remove("is-portal-leaving");
      portal.setAttribute("aria-hidden", "true");
    });
  }

  function setupIntro() {
    if (currentWorld() !== "home" || prefersReducedMotion.matches || navigator.connection?.saveData) {
      return;
    }

    let hasSeenIntro = false;
    try {
      hasSeenIntro = window.localStorage.getItem(introKey) === "seen";
    } catch (error) {
      hasSeenIntro = window.sessionStorage.getItem(introKey) === "seen";
    }

    if (hasSeenIntro) return;

    try {
      window.localStorage.setItem(introKey, "seen");
    } catch (error) {
      try {
        window.sessionStorage.setItem(introKey, "seen");
      } catch (sessionError) {
        root.classList.add("mono-storage-unavailable");
      }
    }

    const intro = document.createElement("aside");
    intro.className = "mono-intro";
    intro.setAttribute("aria-label", "Introduzione a MONO Bottega Gastronomica");
    intro.innerHTML = `
      <button class="mono-intro__skip" type="button">Salta</button>
      <div class="mono-intro__surface" aria-hidden="true">
        <span class="mono-intro__linen"></span>
        <span class="mono-intro__bread"></span>
        <span class="mono-intro__oil"></span>
        <span class="mono-intro__plate"></span>
        <span class="mono-intro__fork"></span>
        <span class="mono-intro__spoon"></span>
        <span class="mono-intro__steam"></span>
      </div>
      <div class="mono-intro__copy">
        <img src="assets/brand/mono-logo-primary.svg" alt="MONO Bottega Gastronomica">
        <p>Buono come una volta.<br><span>Pensato per la vita di oggi.</span></p>
        <button class="mono-intro__enter" type="button">Entra da MONO</button>
      </div>`;

    body.prepend(intro);
    root.classList.add("mono-intro-open");

    let closing = false;
    const closeIntro = (trackingAction) => {
      if (closing) return;
      closing = true;
      trackExperience(trackingAction, intro);
      intro.classList.add("is-closing");
      root.classList.remove("mono-intro-open");
      window.setTimeout(() => intro.remove(), 620);
    };

    intro.querySelector(".mono-intro__skip")?.addEventListener("click", () => closeIntro("intro_skip"));
    intro.querySelector(".mono-intro__enter")?.addEventListener("click", () => closeIntro("intro_enter"));
    window.setTimeout(() => closeIntro("intro_complete"), 3600);
  }

  function setupPageScene() {
    const worldId = currentWorld();
    let sceneId = worldId;

    if (body.classList.contains("pasticceria-page")) sceneId = "pastry";
    if (body.classList.contains("aperitivo-page")) sceneId = "aperitivo";
    if (body.classList.contains("gastronomia-page")) sceneId = "products";
    if (body.classList.contains("catering-page")) sceneId = "events";

    const markup = sceneMarkup[sceneId];
    const hero = document.querySelector(".page-hero, .convivium-page .hero");
    if (!markup || !hero || hero.querySelector(".mono-page-scene, [data-chapter-film]")) return;

    const scene = document.createElement("div");
    scene.className = `mono-page-scene mono-page-scene--${sceneId}`;
    scene.setAttribute("aria-hidden", "true");
    if (sceneId === "people" || sceneId === "convivium") scene.dataset.videoSlot = "hands-team";
    if (sceneId === "events") scene.dataset.videoSlot = "table-setting";
    scene.innerHTML = markup;
    hero.prepend(scene);

    const awakenScene = () => hero.classList.add("is-scene-awake");
    if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
      awakenScene();
    } else {
      const observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          awakenScene();
          observer.disconnect();
        }
      }, { threshold: 0.12 });
      observer.observe(hero);
    }

    if (finePointer.matches && !prefersReducedMotion.matches) {
      hero.addEventListener("pointermove", (event) => {
        const bounds = hero.getBoundingClientRect();
        const xRatio = (event.clientX - bounds.left) / bounds.width - 0.5;
        const yRatio = (event.clientY - bounds.top) / bounds.height - 0.5;
        scene.style.setProperty("--scene-x", `${(xRatio * 12).toFixed(2)}px`);
        scene.style.setProperty("--scene-y", `${(yRatio * 8).toFixed(2)}px`);
      }, { passive: true });

      hero.addEventListener("pointerleave", () => {
        scene.style.setProperty("--scene-x", "0px");
        scene.style.setProperty("--scene-y", "0px");
      });
    }
  }

  function setupChapterFilms() {
    if (window.MONOCinematicController?.mountAll) {
      window.MONOCinematicController.mountAll();
      return;
    }

    const readSessionFlag = (key) => {
      if (!key) return false;
      try {
        return window.sessionStorage.getItem(key) === "true";
      } catch (error) {
        return false;
      }
    };

    const writeSessionFlag = (key) => {
      if (!key) return;
      try {
        window.sessionStorage.setItem(key, "true");
      } catch (error) {
        return;
      }
    };

    document.querySelectorAll("[data-chapter-film]").forEach((film) => {
      const video = film.querySelector("[data-cinematic-video]");
      const poster = film.querySelector("[data-cinematic-poster]");
      const badgeImage = film.querySelector("[data-cinematic-badge]");
      const skipButton = film.querySelector("[data-cinematic-skip]");
      const replayButton = film.querySelector("[data-cinematic-replay]");
      const asset = window.MONOCinematicAssets?.byId?.[film.dataset.assetId];
      if (!video || !poster || !asset) return;

      const playOnce = asset.playback === "once";
      const sessionKey = asset.sessionMemory ? asset.sessionKey || `mono-video-seen-${asset.id}` : "";
      const visibilityThreshold = Math.min(0.9, Math.max(0.05, Number(asset.visibilityThreshold) || 0.22));
      const motionLimited = prefersReducedMotion.matches || navigator.connection?.saveData;
      let sourcesAttached = false;
      let isVisible = false;
      let viewTracked = false;
      let startTracked = false;
      let skipTracked = false;
      let replayTracked = false;
      let completionTracked = false;
      let hasFinished = readSessionFlag(sessionKey);
      let manualPlaybackAuthorized = false;
      let loadObserver;
      let playbackObserver;

      poster.src = asset.posterWebp;
      poster.width = asset.width;
      poster.height = asset.height;
      video.poster = asset.posterWebp;
      video.width = asset.width;
      video.height = asset.height;
      video.loop = asset.playback === "loop";
      video.controls = false;
      video.muted = true;
      video.defaultMuted = true;
      film.style.setProperty("--film-aspect-ratio", asset.aspectRatio);
      film.style.setProperty("--cinematic-object-fit", asset.objectFit || "cover");
      film.style.setProperty("--cinematic-object-position", asset.objectPosition || "center center");

      if (asset.badge && badgeImage) {
        badgeImage.src = asset.badgeAsset;
        film.style.setProperty("--video-badge-size", asset.badgeSize || "72px");
        film.style.setProperty("--video-badge-right", asset.badgeRight || "16px");
        film.style.setProperty("--video-badge-bottom", asset.badgeBottom || "16px");
        film.style.setProperty("--video-badge-bg", asset.badgeBackground || "var(--mono-video-badge-bg)");
        film.style.setProperty("--video-badge-logo-scale", String(asset.badgeLogoScale || 0.76));
      }

      if (playOnce) {
        video.autoplay = false;
      }

      const trackCinematic = (action, legacyAction = action) => {
        trackExperience(asset.analyticsMode === "cinematic-controls" ? action : legacyAction, film);
      };

      const syncControls = () => {
        if (skipButton) {
          skipButton.hidden = !(playOnce && asset.skip && film.classList.contains("is-playing"));
        }
        if (replayButton) {
          const posterOnly = film.classList.contains("is-poster-only");
          replayButton.hidden = !(playOnce && asset.replay && (hasFinished || posterOnly));
          replayButton.textContent = posterOnly && !hasFinished ? "Guarda" : "Rivedi";
          replayButton.setAttribute("aria-label", posterOnly && !hasFinished ? "Riproduci il video" : "Rivedi il video");
        }
      };

      const showVideo = () => film.classList.add("is-ready");
      const showPoster = () => {
        film.classList.remove("is-ready", "is-playing");
        syncControls();
      };
      const attachSources = () => {
        if (sourcesAttached) return;
        asset.sources.forEach((sourceData) => {
          const source = document.createElement("source");
          source.src = sourceData.src;
          source.type = sourceData.type;
          video.append(source);
        });
        sourcesAttached = true;
        film.dataset.mediaLoaded = "true";
        video.load();
      };

      const playWhenAllowed = ({ manual = false } = {}) => {
        if (document.hidden || hasFinished) return;
        if (!manual && !isVisible) return;
        if (!manual && motionLimited && !manualPlaybackAuthorized) return;
        attachSources();
        film.classList.remove("is-complete", "is-poster-only");
        video.play().catch(showPoster);
      };

      const showFinal = (reason = "", remember = true) => {
        hasFinished = true;
        video.pause();
        film.classList.remove("is-playing", "is-ready", "is-poster-only");
        film.classList.add("is-complete");
        if (remember) writeSessionFlag(sessionKey);
        syncControls();

        if (reason === "skip" && !skipTracked) {
          skipTracked = true;
          trackCinematic("cinematic_video_skip", `cinematic_${asset.id}_skip`);
        }
        if (reason === "complete" && !completionTracked) {
          completionTracked = true;
          trackCinematic("cinematic_video_complete", `cinematic_${asset.id}_complete`);
        }
      };

      const replay = () => {
        hasFinished = false;
        manualPlaybackAuthorized = true;
        film.classList.add("is-motion-authorized");
        film.classList.remove("is-complete", "is-poster-only");
        attachSources();

        if (!replayTracked) {
          replayTracked = true;
          trackCinematic("cinematic_video_replay", `cinematic_${asset.id}_replay`);
        }

        const restart = () => {
          video.currentTime = 0;
          playWhenAllowed({ manual: true });
        };

        if (video.readyState >= 1) {
          restart();
        } else {
          video.addEventListener("loadedmetadata", restart, { once: true });
        }
      };

      video.addEventListener("canplay", showVideo, { once: true });
      video.addEventListener("playing", () => {
        showVideo();
        film.classList.add("is-playing");
        film.classList.remove("is-complete", "is-poster-only");
        syncControls();
        if (!startTracked) {
          startTracked = true;
          trackCinematic("cinematic_video_start", `cinematic_${asset.id}_play`);
        }
      });
      video.addEventListener("pause", () => {
        if (!hasFinished && !video.ended) {
          film.classList.remove("is-playing");
          syncControls();
        }
      });
      video.addEventListener("ended", () => {
        if (playOnce) showFinal("complete");
      });
      video.addEventListener("timeupdate", () => {
        if (playOnce && !hasFinished && video.duration && video.currentTime >= video.duration - 0.2) {
          showFinal("complete");
        }
      });
      video.addEventListener("error", () => {
        if (playOnce) {
          showFinal("", false);
        } else {
          showPoster();
        }
      });

      skipButton?.addEventListener("click", () => showFinal("skip"));
      replayButton?.addEventListener("click", replay);

      if (hasFinished) {
        film.classList.add("is-complete");
      } else if (motionLimited) {
        film.classList.add("is-poster-only");
      }
      syncControls();

      if (!("IntersectionObserver" in window)) {
        isVisible = true;
        if (!hasFinished && !motionLimited) playWhenAllowed();
        return;
      }

      loadObserver = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting) && !hasFinished && !motionLimited) {
          attachSources();
          loadObserver.disconnect();
        }
      }, { rootMargin: "420px 0px", threshold: 0.01 });

      playbackObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting && entry.intersectionRatio >= visibilityThreshold;
          if (isVisible) {
            if (!viewTracked && asset.analyticsMode !== "cinematic-controls") {
              viewTracked = true;
              trackExperience(`cinematic_${asset.id}_view`, film);
            }
            playWhenAllowed();
          } else if (!entry.isIntersecting || !manualPlaybackAuthorized) {
            video.pause();
          }
        });
      }, { threshold: [0, 0.22, 0.6] });

      const handleVisibility = () => {
        if (document.hidden) {
          video.pause();
        } else {
          playWhenAllowed();
        }
      };

      loadObserver.observe(film);
      playbackObserver.observe(film);
      document.addEventListener("visibilitychange", handleVisibility);
      window.addEventListener("pagehide", () => {
        video.pause();
        loadObserver?.disconnect();
        playbackObserver?.disconnect();
        document.removeEventListener("visibilitychange", handleVisibility);
      }, { once: true });
    });
  }

  function setupChapterFlow() {
    if (window.MONONavigation) return;
    const footer = document.querySelector(".site-footer, footer");
    if (!footer || document.querySelector(".mono-chapter-flow")) return;

    const chapterIndex = chapterSequence.findIndex((chapter) => chapter.id === currentWorld());
    const safeIndex = chapterIndex >= 0 ? chapterIndex : 0;
    const previousChapter = chapterSequence[(safeIndex - 1 + chapterSequence.length) % chapterSequence.length];
    const nextChapter = chapterSequence[(safeIndex + 1) % chapterSequence.length];
    const flow = document.createElement("nav");

    flow.className = "mono-chapter-flow";
    flow.setAttribute("aria-label", "Continua il racconto di MONO");
    flow.innerHTML = `
      <a class="mono-chapter-flow__link" href="${chapterUrl(previousChapter)}" data-track="chapter_previous_${previousChapter.id}">
        <span class="mono-chapter-flow__direction">Capitolo precedente</span>
        <span class="mono-chapter-flow__title">${previousChapter.label}</span>
      </a>
      <span class="mono-chapter-flow__o" aria-hidden="true">O</span>
      <a class="mono-chapter-flow__link" href="${chapterUrl(nextChapter)}" data-track="chapter_next_${nextChapter.id}">
        <span class="mono-chapter-flow__direction">Capitolo successivo</span>
        <span class="mono-chapter-flow__title">${nextChapter.label}</span>
      </a>`;

    footer.before(flow);
  }

  function setupTableMemory() {
    if (experienceConfig && !experienceConfig.runtime.flags.monoTable) return;
    const worldId = currentWorld();
    if (worldId !== "home") {
      rememberWorld(worldId);
      return;
    }

    const insertionPoint = document.querySelector(".value-section");
    if (!insertionPoint) return;
    const tableTargets = worldTargets.filter((target) => target.id !== "location");

    const section = document.createElement("section");
    section.className = "mono-table-memory";
    section.setAttribute("aria-label", "La tavola narrativa di MONO");
    section.innerHTML = `
      <picture class="mono-table-memory__picture" aria-hidden="true">
        <source media="(max-width: 720px)" srcset="assets/mono-table/mono-table-ritual-mobile.webp">
        <img src="assets/mono-table/mono-table-ritual-desktop.webp" alt="" loading="lazy" decoding="async">
      </picture>
      <span class="mono-table-memory__veil" aria-hidden="true"></span>
      <div class="mono-table-memory__objects">
        ${tableTargets.map((target) => `
          <a class="mono-table-object mono-table-object--${target.object}" data-world-object="${target.id}" data-track="table_object_${target.id}" href="${target.href}" aria-label="${target.label}">
            <span class="mono-table-object__shape" aria-hidden="true"></span>
            <span class="mono-table-object__label">${target.label}</span>
          </a>`).join("")}
      </div>
      <p class="mono-table-memory__message" aria-live="polite">La tavola di MONO prende forma anche con te.</p>`;

    insertionPoint.before(section);

    const updateTable = () => {
      const rememberedWorlds = safeReadMemory();
      section.querySelectorAll("[data-world-object]").forEach((objectLink) => {
        objectLink.classList.toggle("is-remembered", rememberedWorlds.includes(objectLink.dataset.worldObject));
      });
      section.classList.toggle("has-memory", rememberedWorlds.length > 0);
    };

    section.addEventListener("click", (event) => {
      const objectLink = event.target.closest("[data-world-object]");
      if (!objectLink) return;
      rememberWorld(objectLink.dataset.worldObject);
      updateTable();
    });

    document.addEventListener("click", (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (!link) return;
      const hashWorld = worldFromUrl(new URL(link.href, window.location.href));
      rememberWorld(hashWorld);
      updateTable();
    });

    updateTable();
  }

  function setupSceneVisibility() {
    if (!("IntersectionObserver" in window) || prefersReducedMotion.matches) {
      document.querySelectorAll("[data-material-scene]").forEach((scene) => scene.classList.add("is-visible"));
      return;
    }

    const sceneObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          sceneObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: "8% 0px", threshold: 0.12 });

    document.querySelectorAll("[data-material-scene]").forEach((scene) => sceneObserver.observe(scene));
  }

  setupCreativeDirection();
  setupActiveNavigation();
  setupPortalNavigation();
  setupIntro();
  setupPageScene();
  setupChapterFilms();
  setupTableMemory();
  setupChapterFlow();
  setupSceneVisibility();
})();
