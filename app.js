const products = [
  {
    id: "lasagna",
    name: "Lasagna della bottega",
    category: "gastronomia",
    description: "Pasta fresca, ragu lento e besciamella fatta in casa.",
    price: 12.5
  },
  {
    id: "parmigiana",
    name: "Parmigiana MONO",
    category: "gastronomia",
    description: "Melanzane, pomodoro, basilico e formaggi selezionati.",
    price: 10
  },
  {
    id: "crostata",
    name: "Crostata stagionale",
    category: "pasticceria",
    description: "Frolla artigianale con confettura o crema del giorno.",
    price: 18
  },
  {
    id: "mono-dolce",
    name: "Mono porzione dolce",
    category: "pasticceria",
    description: "Piccola pasticceria elegante per pausa o regalo.",
    price: 5.5
  },
  {
    id: "pranzo",
    name: "Piatto bistrot",
    category: "bistrot",
    description: "Piatto caldo del giorno con contorno di stagione.",
    price: 14
  },
  {
    id: "aperitivo",
    name: "Aperitivo gastronomico",
    category: "bistrot",
    description: "Selezione salata MONO per due persone.",
    price: 22
  }
];

const productGrid = document.querySelector("#productGrid");
const cartItems = document.querySelector("#cartItems");
const cartTotal = document.querySelector("#cartTotal");
const loyaltyPreview = document.querySelector("#loyaltyPreview");
const pointsBalance = document.querySelector("#pointsBalance");
const rewardStatus = document.querySelector("#rewardStatus");
const checkoutForm = document.querySelector("#checkoutForm");
const orderDialog = document.querySelector("#orderDialog");
const orderMessage = document.querySelector("#orderMessage");
const closeDialog = document.querySelector("#closeDialog");
const notificationButton = document.querySelector("#notificationButton");
const installButton = document.querySelector("#installButton");

let activeFilter = "tutti";
let deferredInstallPrompt;
const cart = new Map(JSON.parse(localStorage.getItem("mono-cart") || "[]"));
let points = Number(localStorage.getItem("mono-points") || "0");

const formatPrice = (amount) =>
  new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR"
  }).format(amount);

function saveState() {
  localStorage.setItem("mono-cart", JSON.stringify([...cart.entries()]));
  localStorage.setItem("mono-points", String(points));
}

function renderProducts() {
  productGrid.innerHTML = "";
  products
    .filter((product) => activeFilter === "tutti" || product.category === activeFilter)
    .forEach((product) => {
      const card = document.createElement("article");
      card.className = "product-card";
      card.innerHTML = `
        <div class="product-image">${product.category}</div>
        <div>
          <h3>${product.name}</h3>
          <p>${product.description}</p>
        </div>
        <div class="product-meta">
          <span class="price">${formatPrice(product.price)}</span>
          <button class="button ghost" type="button" data-add="${product.id}">Aggiungi</button>
        </div>
      `;
      productGrid.appendChild(card);
    });
}

function getCartTotal() {
  return [...cart.entries()].reduce((total, [id, quantity]) => {
    const product = products.find((item) => item.id === id);
    return total + product.price * quantity;
  }, 0);
}

function renderCart() {
  cartItems.innerHTML = "";

  if (cart.size === 0) {
    cartItems.innerHTML = "<p>Il carrello e vuoto.</p>";
  }

  cart.forEach((quantity, id) => {
    const product = products.find((item) => item.id === id);
    const row = document.createElement("div");
    row.className = "cart-row";
    row.innerHTML = `
      <span>${product.name} x ${quantity}</span>
      <strong>${formatPrice(product.price * quantity)}</strong>
      <button type="button" aria-label="Rimuovi ${product.name}" data-remove="${id}">-</button>
    `;
    cartItems.appendChild(row);
  });

  const total = getCartTotal();
  const expectedPoints = Math.floor(total);
  cartTotal.textContent = formatPrice(total);
  loyaltyPreview.textContent =
    total > 0
      ? `Con questo ordine accumuli ${expectedPoints} punti MONO.`
      : "Aggiungi prodotti per accumulare punti.";
  pointsBalance.textContent = points;
  rewardStatus.textContent =
    points >= 80
      ? "Hai sbloccato 5 euro di sconto sul prossimo ordine."
      : `Ti mancano ${80 - points} punti al prossimo premio.`;
  saveState();
}

function addToCart(id) {
  cart.set(id, (cart.get(id) || 0) + 1);
  renderCart();
}

function removeFromCart(id) {
  const nextQuantity = (cart.get(id) || 0) - 1;
  if (nextQuantity <= 0) {
    cart.delete(id);
  } else {
    cart.set(id, nextQuantity);
  }
  renderCart();
}

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".filter.active").classList.remove("active");
    button.classList.add("active");
    activeFilter = button.dataset.filter;
    renderProducts();
  });
});

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (button) {
    addToCart(button.dataset.add);
  }
});

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove]");
  if (button) {
    removeFromCart(button.dataset.remove);
  }
});

checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const total = getCartTotal();

  if (total <= 0) {
    orderMessage.textContent = "Aggiungi almeno un prodotto prima di confermare.";
    orderDialog.showModal();
    return;
  }

  const earnedPoints = Math.floor(total);
  points += earnedPoints;
  cart.clear();
  renderCart();
  checkoutForm.reset();
  orderMessage.textContent = `Ordine demo confermato. Hai guadagnato ${earnedPoints} punti MONO.`;
  orderDialog.showModal();
});

closeDialog.addEventListener("click", () => orderDialog.close());

notificationButton.addEventListener("click", async () => {
  if (!("Notification" in window)) {
    notificationButton.textContent = "Notifiche non supportate";
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    new Notification("MONO", {
      body: "Promozioni attivate: ti avviseremo per menu speciali e sconti fedelta."
    });
    notificationButton.textContent = "Promozioni attive";
  }
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  installButton.hidden = false;
});

installButton.addEventListener("click", async () => {
  if (!deferredInstallPrompt) {
    return;
  }
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  installButton.hidden = true;
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}

renderProducts();
renderCart();
