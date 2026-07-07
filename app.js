const APP_STORE_URL = "https://mono-app-jet.vercel.app/home";
const GOOGLE_PLAY_URL = "https://mono-app-jet.vercel.app/wallet";
const APP_PROMPT_STORAGE_KEY = "mono-app-prompt-dismissed-at";
const APP_PROMPT_COOLDOWN = 7 * 24 * 60 * 60 * 1000;
const TRACKING_EVENT_NAME = "mono_cta_click";
const ANALYTICS_CONFIG = {
  ga4MeasurementId: "",
  gtmContainerId: ""
};

const appPrompt = document.querySelector("[data-app-prompt]");
const floatingAppButton = document.querySelector("[data-floating-app]");
const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
const primaryNav = document.querySelector("#primaryNav");
const siteHeader = document.querySelector("[data-header]");
let lastFocusedElement = null;

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

function safeGetStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    return;
  }
}

function shouldShowAppPrompt() {
  const storedValue = safeGetStorage(APP_PROMPT_STORAGE_KEY);

  if (!storedValue) {
    return true;
  }

  return Date.now() - Number(storedValue) > APP_PROMPT_COOLDOWN;
}

function getFocusableElements() {
  if (!appPrompt) {
    return [];
  }

  return [...appPrompt.querySelectorAll("a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])")];
}

function closeAppPrompt() {
  if (!appPrompt) {
    return;
  }

  appPrompt.hidden = true;
  document.body.classList.remove("is-locked");
  safeSetStorage(APP_PROMPT_STORAGE_KEY, String(Date.now()));

  if (floatingAppButton) {
    floatingAppButton.hidden = false;
  }

  lastFocusedElement?.focus?.();
}

function openAppPrompt() {
  if (!appPrompt) {
    return;
  }

  lastFocusedElement = document.activeElement;
  appPrompt.hidden = false;
  document.body.classList.add("is-locked");

  if (floatingAppButton) {
    floatingAppButton.hidden = true;
  }

  appPrompt.querySelector(".app-prompt-panel")?.focus();
}

function revealFloatingAppButton() {
  if (floatingAppButton && appPrompt?.hidden !== false) {
    floatingAppButton.hidden = false;
  }
}

function setupDeferredAppPrompt() {
  if (!shouldShowAppPrompt()) {
    window.setTimeout(revealFloatingAppButton, 1200);
    return;
  }

  const appSection = document.querySelector(".app-gateway, #download");

  if (!appSection || !("IntersectionObserver" in window)) {
    window.setTimeout(revealFloatingAppButton, 1800);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const isVisible = entries.some((entry) => entry.isIntersecting);

      if (!isVisible) {
        return;
      }

      observer.disconnect();
      window.setTimeout(openAppPrompt, 500);
    },
    {
      rootMargin: "0px 0px -20% 0px",
      threshold: 0.35
    }
  );

  observer.observe(appSection);
}

function setupAppPrompt() {
  if (!appPrompt) {
    return;
  }

  const appStoreLink = document.querySelector("[data-app-store]");
  const googlePlayLink = document.querySelector("[data-google-play]");
  appStoreLink?.setAttribute("href", APP_STORE_URL);
  googlePlayLink?.setAttribute("href", GOOGLE_PLAY_URL);

  appPrompt.querySelectorAll("[data-app-prompt-close]").forEach((control) => {
    control.addEventListener("click", closeAppPrompt);
  });

  floatingAppButton?.addEventListener("click", openAppPrompt);

  document.addEventListener("keydown", (event) => {
    if (appPrompt.hidden) {
      return;
    }

    if (event.key === "Escape") {
      closeAppPrompt();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusable = getFocusableElements();
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (!first || !last) {
      return;
    }

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  setupDeferredAppPrompt();
}

function emitTrackingEvent(action, element) {
  const eventPayload = {
    event: TRACKING_EVENT_NAME,
    action,
    event_category: "mono_cta",
    link_text: element.textContent?.trim() || element.getAttribute("aria-label") || action,
    link_url: element.getAttribute("href") || "",
    page_path: window.location.pathname
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(eventPayload);

  if (typeof window.gtag === "function") {
    window.gtag("event", action, eventPayload);
  }

  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    console.info("[MONO tracking]", eventPayload);
  }
}

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

    const trackedElement = event.target.closest("[data-track]");

    if (!trackedElement) {
      return;
    }

    emitTrackingEvent(trackedElement.dataset.track, trackedElement);
  });
}

function setupVisualTilt() {
  const canAnimate = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!canAnimate) {
    return;
  }

  const visuals = [...document.querySelectorAll(".product-card-visual, .page-hero-visual")];

  visuals.forEach((visual) => {
    visual.addEventListener("pointermove", (event) => {
      const rect = visual.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      visual.style.setProperty("--visual-tilt-x", `${(-x * 5).toFixed(2)}deg`);
      visual.style.setProperty("--visual-tilt-y", `${(y * 4).toFixed(2)}deg`);
    });

    visual.addEventListener("pointerleave", () => {
      visual.style.removeProperty("--visual-tilt-x");
      visual.style.removeProperty("--visual-tilt-y");
    });
  });
}

function setupReveals() {
  const revealElements = [...document.querySelectorAll("[data-reveal]")];

  if (!revealElements.length) {
    return;
  }

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

if ("serviceWorker" in navigator) {
  const scriptUrl = new URL(document.currentScript?.src || "app.js", window.location.href);
  navigator.serviceWorker.register(new URL("service-worker.js", scriptUrl));
}

setupMobileMenu();
setupHeaderState();
setupReveals();
setupAnalytics();
setupAppPrompt();
setupTracking();
setupVisualTilt();
