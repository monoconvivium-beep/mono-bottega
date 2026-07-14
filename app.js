const APP_STORE_URL = "https://app.monobottega.it";
const GOOGLE_PLAY_URL = "https://app.monobottega.it";
const NEWSLETTER_EMAIL = "monobottega@gmail.com";
const NEWSLETTER_ENDPOINT = window.MONO_NEWSLETTER_ENDPOINT || "";
const TRACKING_EVENT_NAME = "mono_cta_click";
const ANALYTICS_CONFIG = {
  ga4MeasurementId: "",
  gtmContainerId: ""
};

const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
const primaryNav = document.querySelector("#primaryNav");
const siteHeader = document.querySelector("[data-header]");
const rootElement = document.documentElement;

function setupMobileMenu() {
  if (!mobileMenuToggle || !primaryNav) {
    return;
  }

  mobileMenuToggle.addEventListener("click", () => {
    const isOpen = primaryNav.classList.toggle("is-open");
    mobileMenuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  primaryNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      primaryNav.classList.remove("is-open");
      mobileMenuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

function setupHeaderState() {
  if (!siteHeader) {
    return;
  }

  const updateHeader = () => {
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

function setupHeroVideo() {
  const heroVideo = document.querySelector("[data-hero-video]");

  if (!(heroVideo instanceof HTMLVideoElement)) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    heroVideo.pause();
    heroVideo.removeAttribute("autoplay");
    return;
  }

  heroVideo.muted = true;
  heroVideo.play().catch(() => {
    heroVideo.controls = false;
  });
}

function setupCursorLight() {
  const canUseCursorLight = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!canUseCursorLight || prefersReducedMotion) {
    return;
  }

  let animationFrame = null;
  let cursorX = window.innerWidth / 2;
  let cursorY = window.innerHeight / 2;

  rootElement.classList.add("has-cursor-light");

  const updateLight = () => {
    rootElement.style.setProperty("--cursor-light-x", `${cursorX}px`);
    rootElement.style.setProperty("--cursor-light-y", `${cursorY}px`);
    animationFrame = null;
  };

  window.addEventListener("pointermove", (event) => {
    cursorX = event.clientX;
    cursorY = event.clientY;
    rootElement.classList.add("is-cursor-active");

    if (!animationFrame) {
      animationFrame = window.requestAnimationFrame(updateLight);
    }
  }, { passive: true });

  document.addEventListener("pointerleave", () => {
    rootElement.classList.remove("is-cursor-active");
  });
}

function setupAppLinks() {
  document.querySelectorAll("[data-app-store]").forEach((link) => {
    link.setAttribute("href", APP_STORE_URL);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener");
  });

  document.querySelectorAll("[data-google-play]").forEach((link) => {
    link.setAttribute("href", GOOGLE_PLAY_URL);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener");
  });
}

function setupNewsletterForms() {
  document.querySelectorAll("[data-newsletter-form]").forEach((form) => {
    const emailInput = form.querySelector('input[type="email"]');
    const status = form.querySelector("[data-newsletter-status]");

    if (!(form instanceof HTMLFormElement) || !(emailInput instanceof HTMLInputElement)) {
      return;
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!emailInput.checkValidity()) {
        emailInput.reportValidity();
        return;
      }

      const email = emailInput.value.trim();
      const createdAt = new Date().toISOString();
      const payload = { email, created_at: createdAt };

      try {
        if (NEWSLETTER_ENDPOINT) {
          const response = await fetch(NEWSLETTER_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });

          if (!response.ok) {
            throw new Error("Newsletter endpoint error");
          }
        } else {
          localStorage.setItem("mono_newsletter_last_signup", JSON.stringify(payload));
          const subject = encodeURIComponent("Avvisami all'apertura MONO");
          const body = encodeURIComponent(`Email: ${email}\nOrigine: ${window.location.href}\nData: ${createdAt}`);
          window.location.href = `mailto:${NEWSLETTER_EMAIL}?subject=${subject}&body=${body}`;
        }

        if (status) {
          status.textContent = "Ci siamo. Ti scriviamo noi. — MONO";
        }

        form.reset();
      } catch (error) {
        if (status) {
          status.textContent = "Non siamo riusciti a salvare l'email. Scrivici a monobottega@gmail.com.";
        }
      }
    });
  });
}

function emitTrackingEvent(action, element) {
  const isCinematicEvent = action.startsWith("cinematic_video_");
  const eventPayload = {
    event: isCinematicEvent ? action : TRACKING_EVENT_NAME,
    action,
    event_category: isCinematicEvent ? "mono_cinematic" : "mono_cta",
    link_text: element.textContent?.trim() || element.getAttribute("aria-label") || action,
    link_url: element.getAttribute("href") || "",
    page_path: window.location.pathname
  };

  const assetId = element.dataset.assetId || element.closest?.("[data-asset-id]")?.dataset.assetId;
  if (assetId) {
    eventPayload.asset_id = assetId;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(eventPayload);

  if (typeof window.gtag === "function") {
    window.gtag("event", action, eventPayload);
  }

  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    console.info("[MONO tracking]", eventPayload);
  }
}

window.MONOTrackEvent = emitTrackingEvent;

function loadScript(src) {
  const existingScript = document.querySelector(`script[src="${src}"]`);

  if (existingScript) {
    return;
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = src;
  document.head.append(script);
}

function setupAnalytics() {
  const runtimeConfig = window.MONO_ANALYTICS_CONFIG || {};
  const config = {
    ...ANALYTICS_CONFIG,
    ...runtimeConfig
  };

  window.dataLayer = window.dataLayer || [];

  if (config.gtmContainerId) {
    window.dataLayer.push({
      event: "mono_gtm_ready",
      gtm_container_id: config.gtmContainerId
    });
    loadScript(`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(config.gtmContainerId)}`);
  }

  if (config.ga4MeasurementId) {
    window.gtag = window.gtag || function gtag() {
      window.dataLayer.push(arguments);
    };

    window.gtag("js", new Date());
    window.gtag("config", config.ga4MeasurementId, {
      send_page_view: true
    });
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(config.ga4MeasurementId)}`);
  }
}

function setupTracking() {
  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const trackedElement = event.target.closest("[data-track], [data-app-store], [data-google-play]");

    if (!trackedElement) {
      return;
    }

    const action = trackedElement.dataset.track
      || (trackedElement.hasAttribute("data-google-play") ? "open_app_wallet" : "open_app_home");

    emitTrackingEvent(action, trackedElement);
  });
}

function setupReveals() {
  const revealElements = [...document.querySelectorAll("[data-reveal]")];

  if (!revealElements.length) {
    return;
  }

  // Cascade: reveals that share a grid stagger in sequence for a filmic feel.
  const staggerParents = ".page-grid, .local-answer-grid, .app-reason-grid";
  revealElements.forEach((element) => {
    const group = element.parentElement;

    if (group instanceof Element && group.matches(staggerParents)) {
      const revealSiblings = [...group.children].filter((child) => child.hasAttribute("data-reveal"));
      element.style.setProperty("--reveal-order", String(Math.max(0, revealSiblings.indexOf(element))));
    }
  });

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-revealed"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.12
    }
  );

  revealElements.forEach((element) => observer.observe(element));
}

function setupHeroParallax() {
  const hero = document.querySelector("[data-mono-hero]");

  if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  // Parallax only where the desktop hero layout applies; mobile hero is restacked.
  if (!window.matchMedia("(min-width: 821px)").matches) {
    return;
  }

  let ticking = false;

  const update = () => {
    const rect = hero.getBoundingClientRect();
    const height = rect.height || 1;
    const progress = Math.min(1, Math.max(0, -rect.top / height));
    hero.style.setProperty("--hero-scroll", progress.toFixed(3));
    hero.style.setProperty("--hero-light-x", `${(64 + progress * 10).toFixed(1)}%`);
    hero.style.setProperty("--hero-light-y", `${(42 + progress * 12).toFixed(1)}%`);
    ticking = false;
  };

  const requestUpdate = () => {
    if (ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(update);
  };

  update();
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate, { passive: true });
}

function setupCinematicHero() {
  var hero = document.querySelector("[data-cinema-hero]");

  if (!hero) {
    return;
  }

  var track = hero.querySelector("[data-cinema-track]");
  var fireVideo = hero.querySelector('[data-video="fire"] video');
  var pastaVideo = hero.querySelector('[data-video="pasta"] video');
  var pauseBtn = hero.querySelector("[data-cinema-pause]");
  var reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
  var mobileMq = window.matchMedia("(max-width: 820px)");

  // Agnolotti film timeline: 0-1s flour cloud | ~2-5s cut | 6s finished zoom
  var TRIGGER = 0.20;
  var MOBILE_FIRE_HOLD = 1200;
  var STAGE2_AT = 1.6;
  var STAGE3_AT = 5.0;

  var pastaLoadStarted = false;
  var pastaReady = false;
  var transitioned = false;
  var active = false;
  var paused = false;
  var ticking = false;
  var mobileTimer = null;

  function safePlay(v) { if (!v) { return; } v.muted = true; var p = v.play(); if (p && typeof p.catch === "function") { p.catch(function () {}); } }
  function safePause(v) { if (v) { try { v.pause(); } catch (e) {} } }
  function setStage(s) { if (hero.getAttribute("data-stage") !== s) { hero.setAttribute("data-stage", s); } }

  function loadPasta() {
    if (pastaLoadStarted) { return; }
    pastaLoadStarted = true;
    var src = pastaVideo.getAttribute("data-src");
    if (src && !pastaVideo.src) { pastaVideo.src = src; try { pastaVideo.load(); } catch (e) {} }
  }
  pastaVideo.addEventListener("loadeddata", function () {
    pastaReady = true;
    hero.classList.add("pasta-ready");
  });

  function filmStage() {
    var ct = pastaVideo.currentTime || 0;
    if (ct < STAGE2_AT) { return "t"; }
    if (ct < STAGE3_AT) { return "2"; }
    return "3";
  }
  pastaVideo.addEventListener("timeupdate", function () {
    if (transitioned && !paused) { setStage(filmStage()); }
  });

  function triggerTransition() {
    if (transitioned) { return; }
    loadPasta();
    transitioned = true;
    hero.classList.remove("is-transitioned");
    void hero.offsetWidth;
    hero.classList.add("is-transitioned");
    try { pastaVideo.currentTime = 0; } catch (e) {}
    safePause(fireVideo);
    if (!paused) { safePlay(pastaVideo); }
    setStage("t");
  }
  function untrigger() {
    if (!transitioned) { return; }
    transitioned = false;
    hero.classList.remove("is-transitioned");
    safePause(pastaVideo);
    try { pastaVideo.currentTime = 0; } catch (e) {}
    setStage("1");
    if (!paused && active) { safePlay(fireVideo); }
  }

  function computeProgress() {
    var rect = track.getBoundingClientRect();
    var total = track.offsetHeight - window.innerHeight;
    if (total <= 0) { return rect.top <= 0 ? 1 : 0; }
    return -rect.top / total;
  }
  function apply(p) {
    p = Math.max(0, Math.min(1, p));
    hero.style.setProperty("--progress", p.toFixed(4));
    if (p > 0.22) { loadPasta(); }
    if (p >= TRIGGER) { triggerTransition(); } else { untrigger(); }
  }
  function onScroll() {
    if (ticking || !active || paused || mobileMq.matches) { return; }
    ticking = true;
    window.requestAnimationFrame(function () { apply(computeProgress()); ticking = false; });
  }

  function startMobile() {
    if (paused) { return; }
    safePlay(fireVideo);
    loadPasta();
    if (mobileTimer) { clearTimeout(mobileTimer); }
    mobileTimer = window.setTimeout(function () { triggerTransition(); }, MOBILE_FIRE_HOLD);
  }

  function setPaused(next) {
    paused = next;
    if (paused) {
      safePause(fireVideo);
      safePause(pastaVideo);
      if (mobileTimer) { clearTimeout(mobileTimer); mobileTimer = null; }
      pauseBtn.textContent = "▶ Riprendi";
      pauseBtn.setAttribute("aria-label", "Riprendi l'animazione");
    } else {
      pauseBtn.textContent = "⏸ Pausa";
      pauseBtn.setAttribute("aria-label", "Metti in pausa l'animazione");
      if (transitioned) { safePlay(pastaVideo); }
      else if (mobileMq.matches) { startMobile(); }
      else { safePlay(fireVideo); onScroll(); }
    }
  }
  if (pauseBtn) { pauseBtn.addEventListener("click", function () { setPaused(!paused); }); }

  function enable() {
    active = true;
    if (mobileMq.matches) { startMobile(); }
    else { if (!transitioned) { safePlay(fireVideo); } onScroll(); }
  }
  function disable() {
    active = false;
    safePause(fireVideo);
    safePause(pastaVideo);
    if (mobileTimer) { clearTimeout(mobileTimer); mobileTimer = null; }
  }

  if (reduceMq.matches) {
    setStage("3");
    safePause(fireVideo);
    safePause(pastaVideo);
  } else if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { enable(); } else { disable(); }
      });
    }, { rootMargin: "10% 0px 10% 0px", threshold: 0.01 });
    io.observe(hero);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", function () { if (active && !mobileMq.matches) { onScroll(); } }, { passive: true });
  } else {
    loadPasta();
    triggerTransition();
    setStage("3");
  }
}

if ("serviceWorker" in navigator) {
  const scriptUrl = new URL(document.currentScript?.src || "app.js", window.location.href);
  navigator.serviceWorker.register(new URL("service-worker.js", scriptUrl));
}

setupMobileMenu();
setupHeaderState();
setupHeroVideo();
setupCursorLight();
setupHeroParallax();
setupCinematicHero();
setupReveals();
setupAnalytics();
setupAppLinks();
setupNewsletterForms();
setupTracking();
