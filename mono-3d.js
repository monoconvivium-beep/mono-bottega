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
        title: "Il servizio appare.",
        copy: "Tovaglia bianca, porcellana classica e bordo oro: la scena trattiene il respiro.",
        pieces: ["service"]
      },
      {
        id: "grissini",
        title: "Arrivano i grissini.",
        copy: "Verticali, dorati, croccanti: il primo segno si svela nel fumo.",
        pieces: ["service", "grissini"]
      },
      {
        id: "oil",
        title: "L'olio prende luce.",
        copy: "Bottiglia, riflessi oro e un piattino per inzuppare il pane.",
        pieces: ["service", "grissini", "oil"]
      },
      {
        id: "bread",
        title: "Pane madre, aperto.",
        copy: "Crosta viva, mollica irregolare, gesto semplice e scenografico.",
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
        copy: "Rosso, vetro sottile, ombra profonda: la tavola diventa rito.",
        pieces: ["service", "grissini", "oil", "bread", "butter", "wine"]
      },
      {
        id: "dessert",
        title: "Il dolce firma.",
        copy: "Una presenza lucida, precisa, quasi teatrale.",
        pieces: ["service", "grissini", "oil", "bread", "butter", "wine", "dessert"]
      },
      {
        id: "app",
        title: "La tavola è pronta.",
        copy: "Ora il racconto lascia spazio al gesto: entra nel mondo MONO.",
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
      this.root.style.setProperty("--light-x", `${x}%`);
      this.root.style.setProperty("--light-y", `${y}%`);
      this.root.style.setProperty("--parallax-x", `${Number(parallaxX) * -8}px`);
      this.root.style.setProperty("--parallax-y", `${Number(parallaxY) * -6}px`);
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
