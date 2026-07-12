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
setupHeroVideo();
setupCursorLight();
setupReveals();
setupAnalytics();
setupAppLinks();
setupNewsletterForms();
setupTracking();
