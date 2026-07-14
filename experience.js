(() => {
  "use strict";

  const body = document.body;
  const root = document.documentElement;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const memoryKey = "mono_table_memory_v1";
  const introKey = "mono_intro_seen_v1";

  if (!body?.classList.contains("mono-world")) {
    return;
  }

  const worldTargets = [
    { id: "mono", label: "Cos'è MONO", href: "#bottega", object: "linen" },
    { id: "products", label: "Prodotti", href: "gastronomia/", object: "plate" },
    { id: "people", label: "Chi siamo", href: "la-bottega/", object: "spoon" },
    { id: "convivium", label: "MONO Convivium", href: "mono-convivium/", object: "apron" },
    { id: "events", label: "Eventi", href: "eventi/", object: "glass" },
    { id: "app", label: "App MONO", href: "app/", object: "card" },
    { id: "location", label: "Dove siamo", href: "contatti/", object: "place" },
    { id: "jobs", label: "Lavora con noi", href: "lavora-con-noi/", object: "tools" }
  ];

  const sceneMarkup = {
    people: `
      <span class="scene-hand scene-hand--one"></span>
      <span class="scene-hand scene-hand--two"></span>
      <span class="scene-hand scene-hand--three"></span>
      <span class="scene-plate"></span>`,
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
      <span class="scene-bench"></span>
      <span class="scene-apron"></span>
      <span class="scene-utensil scene-utensil--one"></span>
      <span class="scene-utensil scene-utensil--two"></span>
      <span class="scene-towel"></span>`,
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

  function trackExperience(action, element = body) {
    if (typeof window.MONOTrackEvent === "function") {
      window.MONOTrackEvent(action, element);
    }
  }

  function worldFromUrl(url) {
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
    return body.dataset.monoWorld || worldFromUrl(new URL(window.location.href));
  }

  function safeReadMemory() {
    try {
      const storedValue = window.localStorage.getItem(memoryKey);
      const parsedValue = storedValue ? JSON.parse(storedValue) : [];
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
      const eligibleArea = link.closest(".nav, .site-footer, .mono-table-memory, .hero-actions, .definition-section, .convivium-feature, .contacts-info");

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
    if (!markup || !hero || hero.querySelector(".mono-page-scene")) return;

    const scene = document.createElement("div");
    scene.className = `mono-page-scene mono-page-scene--${sceneId}`;
    scene.setAttribute("aria-hidden", "true");
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

  function setupTableMemory() {
    const worldId = currentWorld();
    if (worldId !== "home") {
      rememberWorld(worldId);
      return;
    }

    const insertionPoint = document.querySelector(".value-section");
    if (!insertionPoint) return;

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
        ${worldTargets.map((target) => `
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

  setupActiveNavigation();
  setupPortalNavigation();
  setupIntro();
  setupPageScene();
  setupTableMemory();
  setupSceneVisibility();
})();
