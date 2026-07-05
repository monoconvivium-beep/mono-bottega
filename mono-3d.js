class MonoTableExperience {
  constructor(root) {
    this.root = root;
    this.pieces = [...root.querySelectorAll("[data-table-piece]")];
    this.steps = [...document.querySelectorAll("[data-table-step]")];
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.activeStep = "gesture";
    this.stepPieces = {
      gesture: ["gesture"],
      gastronomy: ["gesture", "gastronomy"],
      pastry: ["gesture", "gastronomy", "pastry"],
      aperitivo: ["gesture", "gastronomy", "pastry", "aperitivo"],
      takeaway: ["gesture", "gastronomy", "pastry", "aperitivo", "takeaway"],
      conviviality: ["gesture", "gastronomy", "pastry", "aperitivo", "takeaway", "conviviality"],
      complete: ["gesture", "gastronomy", "pastry", "aperitivo", "takeaway", "conviviality"]
    };
  }

  init() {
    this.applyStep(this.activeStep);
    this.setupObserver();
    if (!this.reducedMotion) {
      this.setupPointerLight();
    }
  }

  applyStep(step) {
    this.activeStep = step;
    const visiblePieces = this.stepPieces[step] || this.stepPieces.complete;
    this.pieces.forEach((piece) => {
      piece.classList.toggle("is-visible", visiblePieces.includes(piece.dataset.tablePiece));
    });
  }

  setupObserver() {
    if (!("IntersectionObserver" in window)) {
      this.applyStep("complete");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visibleEntry?.target?.dataset?.tableStep) {
          this.applyStep(visibleEntry.target.dataset.tableStep);
        }
      },
      {
        rootMargin: "-28% 0px -42% 0px",
        threshold: [0.18, 0.38, 0.62]
      }
    );

    this.steps.forEach((step) => observer.observe(step));
  }

  setupPointerLight() {
    const light = this.root.querySelector(".table-light");
    if (!light) {
      return;
    }

    window.addEventListener("pointermove", (event) => {
      const x = Math.round((event.clientX / window.innerWidth) * 100);
      const y = Math.round((event.clientY / window.innerHeight) * 100);
      light.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(248, 239, 217, 0.72), transparent 36%)`;
    });
  }
}

document.querySelectorAll("[data-mono-table]").forEach((root) => {
  new MonoTableExperience(root).init();
});
