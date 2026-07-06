class MonoTableExperience {
  constructor(root) {
    this.root = root;
    this.pieces = [...root.querySelectorAll("[data-table-piece]")];
    this.frames = [...root.querySelectorAll("[data-table-frame]")];
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
        frame: "clean",
        title: "La tavola si apre.",
        copy: "Luce, lino e ceramica preparano il primo gesto.",
        pieces: []
      },
      {
        id: "gesture",
        frame: "gesture",
        title: "Pane e olio.",
        copy: "La materia semplice diventa accoglienza.",
        pieces: ["bread", "oil"]
      },
      {
        id: "gastronomy",
        frame: "gastronomy",
        title: "Il piatto caldo.",
        copy: "La gastronomia porta il ristorante nel quotidiano.",
        pieces: ["bread", "oil", "gastronomy", "steam"]
      },
      {
        id: "pastry",
        frame: "complete",
        title: "Il dolce firma.",
        copy: "La pasticceria entra come equilibrio e memoria.",
        pieces: ["bread", "oil", "gastronomy", "steam", "pastry"]
      },
      {
        id: "aperitivo",
        frame: "complete",
        title: "Il bicchiere giusto.",
        copy: "L'aperitivo mette ordine al tempo che resta.",
        pieces: ["bread", "oil", "gastronomy", "steam", "pastry", "aperitivo"]
      },
      {
        id: "takeaway",
        frame: "complete",
        title: "La cura si porta via.",
        copy: "Box, gifting e quotidiano restano nello stesso gesto.",
        pieces: ["bread", "oil", "gastronomy", "steam", "pastry", "aperitivo", "takeaway"]
      },
      {
        id: "conviviality",
        frame: "complete",
        title: "La tavola si allarga.",
        copy: "Più coperti, più momenti, la stessa idea di buono.",
        pieces: ["bread", "oil", "gastronomy", "steam", "pastry", "aperitivo", "takeaway", "conviviality"]
      },
      {
        id: "app",
        frame: "complete",
        title: "Il gateway digitale.",
        copy: "Quando il racconto è chiaro, l'app accompagna il gesto.",
        pieces: ["bread", "oil", "gastronomy", "steam", "pastry", "aperitivo", "takeaway", "conviviality", "app"]
      },
      {
        id: "complete",
        frame: "complete",
        title: "MONO è completo.",
        copy: "Una bottega. Più momenti. La stessa idea di buono.",
        pieces: ["bread", "oil", "gastronomy", "steam", "pastry", "aperitivo", "takeaway", "conviviality", "app"]
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
    this.applyFrame(item.frame);
    this.applyPieces(item.pieces);
    this.updateStatus(item);
  }

  applyFrame(activeFrame) {
    this.frames.forEach((frame) => {
      frame.classList.toggle("is-visible", frame.dataset.tableFrame === activeFrame);
    });
    this.root.dataset.activeFrame = activeFrame;
  }

  applyPieces(visiblePieces) {
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
