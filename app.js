const APP_STORE_URL = "https://mono-app-jet.vercel.app/home";
const GOOGLE_PLAY_URL = "https://mono-app-jet.vercel.app/wallet";
const APP_PROMPT_STORAGE_KEY = "mono-app-prompt-dismissed-at";
const APP_PROMPT_COOLDOWN = 7 * 24 * 60 * 60 * 1000;

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

  if (shouldShowAppPrompt()) {
    window.setTimeout(openAppPrompt, 1500);
  } else if (floatingAppButton) {
    floatingAppButton.hidden = false;
  }
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
setupAppPrompt();
