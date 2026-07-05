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
    description: "Pasta fresca, ragu lento e besciamella morbida.",
    price: 12.5,
    accent: "#B85C38",
    mark: "G"
  },
  {
    id: "parmigiana",
    name: "Parmigiana MONO",
    category: "gastronomia",
    description: "Melanzane, pomodoro, basilico e formaggi selezionati.",
    price: 10,
    accent: "#B85C38",
    mark: "M"
  },
  {
    id: "crostata",
    name: "Crostata stagionale",
    category: "pasticceria",
    description: "Frolla artigianale con crema o confettura del giorno.",
    price: 18,
    accent: "#E27A60",
    mark: "P"
  },
  {
    id: "mono-dolce",
    name: "Mono porzione dolce",
    category: "pasticceria",
    description: "Piccola pasticceria elegante per pausa o regalo.",
    price: 5.5,
    accent: "#E27A60",
    mark: "D"
  },
  {
    id: "pranzo",
    name: "Piatto bistrot",
    category: "bistrot",
    description: "Piatto caldo del giorno con contorno di stagione.",
    price: 14,
    accent: "#6E6A3C",
    mark: "B"
  },
  {
    id: "aperitivo",
    name: "Aperitivo gastronomico",
    category: "bistrot",
    description: "Selezione salata MONO per due persone.",
    price: 22,
    accent: "#6E6A3C",
    mark: "A"
  }
];

const productGrid = document.querySelector("#productGrid");
const notificationButton = document.querySelector("#notificationButton");
let activeFilter = "tutti";

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
      card.innerHTML = `
        <div class="product-visual" style="--product-color: ${product.accent}">
          <span>${product.mark}</span>
        </div>
        <div class="product-body">
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

if (notificationButton) {
  notificationButton.addEventListener("click", async () => {
    if (!("Notification" in window)) {
      notificationButton.textContent = "Notifiche non supportate";
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      new Notification("MONO", {
        body: "Promozioni attivate: ti avviseremo per menu speciali e vantaggi fedelta."
      });
      notificationButton.textContent = "Promozioni attive";
    }
  });
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}

renderProducts();
