class MonoTableExperience {
  constructor(root) {
    this.root = root;
    this.pieces = [...root.querySelectorAll("[data-table-piece]")];
    this.statusCount = root.querySelector("[data-table-count]");
    this.statusTitle = root.querySelector("[data-table-title]");
    this.statusCopy = root.querySelector("[data-table-copy]");
    this.dots = root.querySelector("[data-table-dots]");
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.activeIndex = 0;
    this.timer = null;
    this.sequence = [
      {
        id: "clean",
        title: "Il servizio prende luce.",
        copy: "Tovaglia cashmere, porcellana classica, bordo oro: la scena si accende piano.",
        pieces: ["service"]
      },
      {
        id: "grissini",
        title: "I grissini emergono dal fumo.",
        copy: "Verticali, dorati, quasi scultorei: il primo segno dà profondità alla tavola.",
        pieces: ["service", "grissini"]
      },
      {
        id: "oil",
        title: "L'olio diventa oro liquido.",
        copy: "Bottiglia, riflessi champagne e piattino per il pane: un gesto semplice diventa rito.",
        pieces: ["service", "grissini", "oil"]
      },
      {
        id: "bread",
        title: "Il pane madre si apre.",
        copy: "Crosta viva e mollica irregolare: materia vera, luce teatrale, memoria quotidiana.",
        pieces: ["service", "grissini", "oil", "bread"]
      },
      {
        id: "butter",
        title: "Burro e piccoli gesti.",
        copy: "Un piattino, una materia morbida, un dettaglio quasi antico.",
        pieces: ["service", "grissini", "oil", "bread", "butter"]
      },
      {
        id: "wine",
        title: "Il vino entra in scena.",
        copy: "Rosso, vetro sottile, ombra profonda: la tavola diventa convivio.",
        pieces: ["service", "grissini", "oil", "bread", "butter", "wine"]
      },
      {
        id: "dessert",
        title: "Il dolce firma.",
        copy: "Una presenza precisa, elegante, finale: la bottega non urla, seduce.",
        pieces: ["service", "grissini", "oil", "bread", "butter", "wine", "dessert"]
      },
      {
        id: "app",
        title: "La tavola è pronta.",
        copy: "Ora il racconto lascia spazio al gesto: ordina, torna, partecipa.",
        pieces: ["service", "grissini", "oil", "bread", "butter", "wine", "dessert", "complete"]
      },
      {
        id: "complete",
        title: "MONO è completo.",
        copy: "Una bottega. Più momenti. La stessa idea di buono.",
        pieces: ["service", "grissini", "oil", "bread", "butter", "wine", "dessert", "complete"]
      }
    ];
  }

  init() {
    this.createDots();
    this.applyIndex(this.reducedMotion ? this.sequence.length - 1 : 0);
    this.setupPointerLight();

    if (this.root.hasAttribute("data-auto-table") && !this.reducedMotion) {
      this.startAutoSequence();
    }
  }

  createDots() {
    if (!this.dots) {
      return;
    }

    this.dots.innerHTML = this.sequence
      .map((item, index) => `<span data-dot="${index}" aria-label="${item.title}"></span>`)
      .join("");
  }

  applyStep(stepId) {
    const index = this.sequence.findIndex((item) => item.id === stepId);
    this.applyIndex(index >= 0 ? index : 0);
  }

  applyIndex(index) {
    const nextIndex = Math.max(0, Math.min(index, this.sequence.length - 1));
    const item = this.sequence[nextIndex];
    this.activeIndex = nextIndex;
    this.applyPieces(item.pieces);
    this.updateStatus(item);
  }

  applyPieces(visiblePieces) {
    this.root.classList.toggle("is-complete", visiblePieces.includes("complete"));
    this.pieces.forEach((piece) => {
      const pieceName = piece.dataset.tablePiece;
      piece.classList.toggle("is-visible", visiblePieces.includes(pieceName));
    });
  }

  updateStatus(item) {
    if (this.statusCount) {
      this.statusCount.textContent = `${String(this.activeIndex + 1).padStart(2, "0")} / ${String(this.sequence.length).padStart(2, "0")}`;
    }

    if (this.statusTitle) {
      this.statusTitle.textContent = item.title;
    }

    if (this.statusCopy) {
      this.statusCopy.textContent = item.copy;
    }

    this.dots?.querySelectorAll("span").forEach((dot, index) => {
      dot.classList.toggle("is-active", index <= this.activeIndex);
    });
  }

  startAutoSequence() {
    window.setTimeout(() => {
      this.timer = window.setInterval(() => {
        if (this.activeIndex >= this.sequence.length - 1) {
          window.clearInterval(this.timer);
          return;
        }

        this.applyIndex(this.activeIndex + 1);
      }, 1050);
    }, 600);
  }

  setupPointerLight() {
    this.root.addEventListener("pointermove", (event) => {
      const rect = this.root.getBoundingClientRect();
      const x = Math.round(((event.clientX - rect.left) / rect.width) * 100);
      const y = Math.round(((event.clientY - rect.top) / rect.height) * 100);
      const parallaxX = ((x - 50) / 50).toFixed(2);
      const parallaxY = ((y - 50) / 50).toFixed(2);
      const horizontal = Number(parallaxX);
      const vertical = Number(parallaxY);
      this.root.style.setProperty("--light-x", `${x}%`);
      this.root.style.setProperty("--light-y", `${y}%`);
      this.root.style.setProperty("--tilt-x", `${horizontal * 2.8}deg`);
      this.root.style.setProperty("--tilt-y", `${vertical * -2.2}deg`);
      this.root.style.setProperty("--parallax-back-x", `${horizontal * -4}px`);
      this.root.style.setProperty("--parallax-back-y", `${vertical * -3}px`);
      this.root.style.setProperty("--parallax-mid-x", `${horizontal * -8}px`);
      this.root.style.setProperty("--parallax-mid-y", `${vertical * -6}px`);
      this.root.style.setProperty("--parallax-front-x", `${horizontal * -13}px`);
      this.root.style.setProperty("--parallax-front-y", `${vertical * -9}px`);
      this.root.style.setProperty("--parallax-near-x", `${horizontal * -18}px`);
      this.root.style.setProperty("--parallax-near-y", `${vertical * -12}px`);
    });
  }
}

const tableControllers = [...document.querySelectorAll("[data-mono-table]")].map((root) => {
  const controller = new MonoTableExperience(root);
  controller.init();
  return controller;
});

function applyTableStep(stepId) {
  tableControllers.forEach((controller) => controller.applyStep(stepId));
}

function setupTableStoryObserver() {
  const steps = [...document.querySelectorAll("[data-table-step]")];

  if (!steps.length) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    applyTableStep("complete");
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visibleEntry?.target?.dataset?.tableStep) {
        applyTableStep(visibleEntry.target.dataset.tableStep);
      }
    },
    {
      rootMargin: "-28% 0px -42% 0px",
      threshold: [0.18, 0.35, 0.6]
    }
  );

  steps.forEach((step) => observer.observe(step));
}

setupTableStoryObserver();
