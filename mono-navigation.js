(() => {
  "use strict";

  const config = window.MONOExperienceConfig;
  if (!config || !document.body?.classList.contains("mono-world")) return;

  const root = document.documentElement;
  const body = document.body;
  const runtime = config.runtime;
  const pendingKey = config.keys.navigationPending;
  let navigationLocked = false;
  let wheelIntent = 0;
  let wheelResetTimer = 0;
  let dragState = null;
  let flowElement = null;

  const track = (action, element) => {
    if (typeof window.MONOTrackEvent === "function") window.MONOTrackEvent(action, element || body);
  };

  const isEditableTarget = (target) => Boolean(target?.closest?.("input, textarea, select, [contenteditable='true']"));
  const nearPageEnd = () => window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - Math.max(64, window.innerHeight * 0.06);

  const ensureAnnouncer = () => {
    let announcer = document.querySelector("[data-mono-announcer]");
    if (!announcer) {
      announcer = document.createElement("p");
      announcer.className = "sr-only";
      announcer.dataset.monoAnnouncer = "";
      announcer.setAttribute("aria-live", "polite");
      announcer.setAttribute("aria-atomic", "true");
      body.append(announcer);
    }
    return announcer;
  };

  const restoreNavigationContext = () => {
    const raw = config.safeStorage.get(window.sessionStorage, pendingKey, "");
    if (!raw) return;
    config.safeStorage.remove(window.sessionStorage, pendingKey);

    let pending;
    try {
      pending = JSON.parse(raw);
    } catch (error) {
      return;
    }
    if (pending?.targetId !== config.worldFromUrl()) return;

    const target = document.querySelector("main h1, main h2, #main");
    const announcer = ensureAnnouncer();
    window.setTimeout(() => {
      if (target) {
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
        window.setTimeout(() => target.removeAttribute("tabindex"), 1000);
      }
      announcer.textContent = `Capitolo ${config.getChapter().title}`;
    }, runtime.reducedMotion ? 0 : 180);
  };

  const portal = document.createElement("div");
  portal.className = "mono-o-portal";
  portal.setAttribute("aria-hidden", "true");
  portal.innerHTML = '<span class="mono-o-portal__oil"></span><span class="mono-o-portal__ring">O</span>';
  body.append(portal);

  const navigate = (destination, { direction = "next", trigger = null, mode = "flow" } = {}) => {
    if (navigationLocked) return;
    const url = destination instanceof URL ? destination : new URL(destination, window.location.href);
    const targetId = config.worldFromUrl(url);
    const currentId = config.worldFromUrl();
    if (url.origin !== window.location.origin || targetId === currentId && config.normalizePath(url.pathname) === config.normalizePath(window.location.pathname)) {
      window.location.assign(url.href);
      return;
    }

    navigationLocked = true;
    const targetChapter = config.getChapter(targetId);
    const sourceChapter = config.getChapter(currentId);
    config.safeStorage.set(window.sessionStorage, pendingKey, JSON.stringify({
      targetId,
      direction,
      at: Date.now()
    }));
    track(mode === "flow" ? `navigation_horizontal_${direction}` : `navigation_${mode}`, trigger || body);

    if (runtime.reducedMotion || !runtime.flags.oPortal) {
      window.location.assign(url.href);
      return;
    }

    const bounds = trigger?.getBoundingClientRect?.();
    const originX = bounds ? bounds.left + bounds.width / 2 : direction === "previous" ? window.innerWidth * 0.18 : window.innerWidth * 0.82;
    const originY = bounds ? bounds.top + bounds.height / 2 : window.innerHeight * 0.62;
    root.style.setProperty("--mono-portal-x", `${originX}px`);
    root.style.setProperty("--mono-portal-y", `${originY}px`);
    root.dataset.monoPortalFrom = sourceChapter.exit;
    root.dataset.monoPortalTo = targetChapter.entry;
    root.dataset.monoFlowDirection = direction;
    root.classList.add("is-mono-navigating");
    portal.setAttribute("aria-hidden", "false");
    window.dispatchEvent(new CustomEvent("mono:oil-alive", { detail: { originX, originY, direction } }));

    const duration = window.innerWidth <= 720 ? 420 : window.innerWidth <= 1100 ? 620 : 780;
    window.setTimeout(() => window.location.assign(url.href), duration);
    window.setTimeout(() => {
      if (document.visibilityState === "visible") {
        navigationLocked = false;
        root.classList.remove("is-mono-navigating");
        portal.setAttribute("aria-hidden", "true");
      }
    }, duration + 900);
  };

  const setupLinkNavigation = () => {
    document.addEventListener("click", (event) => {
      const link = event.target.closest("a[href]");
      if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (link.target || link.hasAttribute("download") || link.dataset.noPortal !== undefined) return;

      let destination;
      try {
        destination = new URL(link.href, window.location.href);
      } catch (error) {
        return;
      }
      if (!/^https?:$/.test(destination.protocol) || destination.origin !== window.location.origin) return;
      const samePage = config.normalizePath(destination.pathname) === config.normalizePath(window.location.pathname);
      if (samePage) return;
      const eligible = link.closest(".nav, .site-footer, .mono-next-chapter, .mono-table-memory, .hero-actions, .cinema-actions, .definition-section, .convivium-feature, .contacts-info");
      if (!eligible) return;

      event.preventDefault();
      const direction = link.dataset.flowDirection || "next";
      navigate(destination, { direction, trigger: link, mode: link.closest(".mono-next-chapter") ? "flow" : "link" });
    });
  };

  const prefetch = (href) => {
    if (runtime.saveData || runtime.slowConnection || document.querySelector(`link[rel="prefetch"][href="${href}"]`)) return;
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = href;
    link.as = "document";
    document.head.append(link);
  };

  const setupChapterPreview = () => {
    if (!runtime.flags.monoFlow || document.querySelector(".mono-next-chapter")) return;
    const footer = document.querySelector(".site-footer, footer");
    if (!footer) return;
    const { current, previous, next } = config.getAdjacent();
    flowElement = document.createElement("nav");
    flowElement.className = "mono-next-chapter";
    flowElement.dataset.temperature = next.temperature;
    flowElement.setAttribute("aria-label", "Continua il racconto di MONO");
    flowElement.innerHTML = `
      <a class="mono-next-chapter__previous" href="${config.chapterUrl(previous)}" data-flow-direction="previous" data-track="chapter_previous_${previous.id}" data-cursor-label="SCORRI">
        <span>Capitolo precedente</span>
        <strong>${previous.title}</strong>
      </a>
      <div class="mono-next-chapter__stage" data-flow-drag-zone tabindex="0" role="group" aria-label="Scorri verso il capitolo successivo">
        <span class="mono-next-chapter__index">${String(next.index).padStart(2, "0")} / ${String(config.chapters.length).padStart(2, "0")}</span>
        <span class="mono-next-chapter__eyebrow">${next.eyebrow}</span>
        <strong class="mono-next-chapter__title">${next.title}</strong>
        <span class="mono-next-chapter__preview">${next.preview}</span>
        <span class="mono-next-chapter__gesture" aria-hidden="true">Trascina o scorri <i>→</i></span>
        <a class="mono-next-chapter__open" href="${config.chapterUrl(next)}" data-flow-direction="next" data-track="chapter_next_${next.id}" data-cursor-label="ENTRA">Entra nel capitolo</a>
      </div>
      <span class="mono-next-chapter__o" aria-hidden="true">O</span>`;
    footer.before(flowElement);

    const nextHref = config.chapterUrl(next);
    flowElement.addEventListener("pointerenter", () => prefetch(nextHref), { once: true });
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          prefetch(nextHref);
          observer.disconnect();
        }
      }, { rootMargin: "500px 0px", threshold: 0.01 });
      observer.observe(flowElement);
    }
  };

  const setupIntentNavigation = () => {
    if (!runtime.flags.monoFlow) return;

    window.addEventListener("wheel", (event) => {
      if (!nearPageEnd() || navigationLocked || isEditableTarget(event.target)) return;
      const horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY) * 0.75 && Math.abs(event.deltaX) > 5;
      const shifted = event.shiftKey && Math.abs(event.deltaY) > 5;
      if (!horizontal && !shifted) return;
      const delta = horizontal ? event.deltaX : event.deltaY;
      wheelIntent += delta;
      window.clearTimeout(wheelResetTimer);
      wheelResetTimer = window.setTimeout(() => { wheelIntent = 0; }, 700);
      if (Math.abs(wheelIntent) < 180) return;
      event.preventDefault();
      const adjacent = config.getAdjacent();
      const direction = wheelIntent > 0 ? "next" : "previous";
      const chapter = direction === "next" ? adjacent.next : adjacent.previous;
      wheelIntent = 0;
      navigate(config.chapterUrl(chapter), { direction, trigger: flowElement, mode: "flow" });
    }, { passive: false });

    document.addEventListener("keydown", (event) => {
      if (navigationLocked || isEditableTarget(event.target) || !nearPageEnd()) return;
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? "next" : "previous";
      const adjacent = config.getAdjacent();
      const chapter = direction === "next" ? adjacent.next : adjacent.previous;
      navigate(config.chapterUrl(chapter), { direction, trigger: flowElement, mode: "keyboard" });
    });

    document.addEventListener("pointerdown", (event) => {
      const zone = event.target.closest("[data-flow-drag-zone]");
      if (!zone || event.button !== 0) return;
      dragState = { zone, pointerId: event.pointerId, x: event.clientX, y: event.clientY };
      zone.setPointerCapture?.(event.pointerId);
      zone.classList.add("is-dragging");
    });
    document.addEventListener("pointermove", (event) => {
      if (!dragState || dragState.pointerId !== event.pointerId) return;
      const deltaX = event.clientX - dragState.x;
      const deltaY = event.clientY - dragState.y;
      if (Math.abs(deltaX) < Math.abs(deltaY)) return;
      const progress = Math.max(-1, Math.min(1, deltaX / Math.max(180, dragState.zone.clientWidth * 0.36)));
      dragState.zone.style.setProperty("--flow-drag", progress.toFixed(3));
    }, { passive: true });
    const releaseDrag = (event) => {
      if (!dragState || dragState.pointerId !== event.pointerId) return;
      const deltaX = event.clientX - dragState.x;
      const deltaY = event.clientY - dragState.y;
      const zone = dragState.zone;
      zone.classList.remove("is-dragging");
      zone.style.removeProperty("--flow-drag");
      dragState = null;
      if (Math.abs(deltaX) < 78 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) return;
      const direction = deltaX < 0 ? "next" : "previous";
      const adjacent = config.getAdjacent();
      const chapter = direction === "next" ? adjacent.next : adjacent.previous;
      navigate(config.chapterUrl(chapter), { direction, trigger: zone, mode: "drag" });
    };
    document.addEventListener("pointerup", releaseDrag);
    document.addEventListener("pointercancel", releaseDrag);
  };

  const setup = () => {
    restoreNavigationContext();
    setupChapterPreview();
    setupLinkNavigation();
    setupIntentNavigation();
    window.addEventListener("pageshow", () => {
      navigationLocked = false;
      root.classList.remove("is-mono-navigating");
      portal.setAttribute("aria-hidden", "true");
    });
  };

  window.MONONavigation = Object.freeze({
    version: "20260714-engineering-master-v1",
    setup,
    navigate
  });

  setup();
})();
