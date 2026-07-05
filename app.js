const APP_STORE_URL = "#";
const GOOGLE_PLAY_URL = "#";
const APP_PROMPT_STORAGE_KEY = "mono-app-prompt-dismissed-at";
const APP_PROMPT_COOLDOWN = 7 * 24 * 60 * 60 * 1000;

const appLinks = {
  order: "https://mono-app-jet.vercel.app/order",
  wallet: "https://mono-app-jet.vercel.app/wallet",
  home: "https://mono-app-jet.vercel.app/home"
};

const products = [
  {
    id: "lasagna",
    name: "Lasagna della bottega",
    category: "gastronomia",
    description: "Pasta fresca, ragù lento e besciamella morbida.",
    price: 12.5,
    accent: "#B85C38",
    mark: "G",
    tags: ["oggi", "da rigenerare"]
  },
  {
    id: "parmigiana",
    name: "Parmigiana MONO",
    category: "gastronomia",
    description: "Melanzane, pomodoro, basilico e formaggi selezionati.",
    price: 10,
    accent: "#B85C38",
    mark: "M",
    tags: ["stagionale", "banco"]
  },
  {
    id: "crostata",
    name: "Crostata stagionale",
    category: "pasticceria",
    description: "Frolla artigianale con crema o confettura del giorno.",
    price: 18,
    accent: "#E27A60",
    mark: "P",
    tags: ["stagionale", "da regalare"]
  },
  {
    id: "mono-dolce",
    name: "Monoporzione dolce",
    category: "pasticceria",
    description: "Piccola pasticceria elegante per pausa, tavola o regalo.",
    price: 5.5,
    accent: "#CBA75A",
    mark: "D",
    tags: ["da regalare", "oggi"]
  },
  {
    id: "aperitivo",
    name: "Aperitivo gastronomico",
    category: "aperitivo",
    description: "Selezione salata MONO per due persone.",
    price: 22,
    accent: "#6E6A3C",
    mark: "A",
    tags: ["sera", "condividere"]
  },
  {
    id: "catering-box",
    name: "Box tavola grande",
    category: "catering",
    description: "Base premium per regali, aziende e piccoli eventi.",
    price: 38,
    accent: "#CBA75A",
    mark: "C",
    tags: ["catering", "da regalare"]
  }
];

const productGrid = document.querySelector("#productGrid");
const appPrompt = document.querySelector("[data-app-prompt]");
const floatingAppButton = document.querySelector("[data-floating-app]");
const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
const primaryNav = document.querySelector("#primaryNav");
let activeFilter = "tutti";
let lastFocusedElement = null;

const formatPrice = (amount) =>
  new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR"
  }).format(amount);

function renderProducts() {
  if (!productGrid) {
    return;
  }

  productGrid.innerHTML = "";
  products
    .filter((product) => activeFilter === "tutti" || product.category === activeFilter)
    .forEach((product) => {
      const card = document.createElement("article");
      card.className = "product-card";
      card.style.setProperty("--product-color", product.accent);
      card.innerHTML = `
        <div class="product-visual" style="--product-color: ${product.accent}">
          <span>${product.mark}</span>
        </div>
        <div class="product-body">
          <div class="product-tags">
            ${product.tags.map((tag) => `<span>${tag}</span>`).join("")}
          </div>
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="product-meta">
            <span class="price">${formatPrice(product.price)}</span>
            <a href="${appLinks.order}">Ordina</a>
          </div>
        </div>
      `;
      productGrid.appendChild(card);
    });
}

function setupFilters() {
  document.querySelectorAll(".filter").forEach((button) => {
    button.addEventListener("click", () => {
      const current = document.querySelector(".filter.active");
      if (current) {
        current.classList.remove("active");
      }
      button.classList.add("active");
      activeFilter = button.dataset.filter;
      renderProducts();
    });
  });
}

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

function shouldShowAppPrompt() {
  const storedValue = localStorage.getItem(APP_PROMPT_STORAGE_KEY);
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
  localStorage.setItem(APP_PROMPT_STORAGE_KEY, String(Date.now()));
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
  floatingAppButton.hidden = true;
  appPrompt.querySelector(".app-prompt-panel")?.focus();
}

function setupAppPrompt() {
  if (!appPrompt || !floatingAppButton) {
    return;
  }

  const appStoreLink = document.querySelector("[data-app-store]");
  const googlePlayLink = document.querySelector("[data-google-play]");
  appStoreLink?.setAttribute("href", APP_STORE_URL);
  googlePlayLink?.setAttribute("href", GOOGLE_PLAY_URL);

  appPrompt.querySelectorAll("[data-app-prompt-close]").forEach((control) => {
    control.addEventListener("click", closeAppPrompt);
  });

  floatingAppButton.addEventListener("click", openAppPrompt);

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
  } else {
    floatingAppButton.hidden = false;
  }
}

if ("serviceWorker" in navigator) {
  const scriptUrl = new URL(document.currentScript?.src || "app.js", window.location.href);
  navigator.serviceWorker.register(new URL("service-worker.js", scriptUrl));
}

setupMobileMenu();
setupFilters();
setupAppPrompt();
renderProducts();
