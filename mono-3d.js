class MonoTableExperience {
  constructor(root) {
    this.root = root;
    this.pieces = [...root.querySelectorAll("[data-table-piece]")];
    this.photoPieces = [...root.querySelectorAll("[data-photo-piece]")];
    this.steps = [...document.querySelectorAll("[data-table-step]")];
    this.status = document.querySelector("[data-table-status]");
    this.statusCount = document.querySelector("[data-table-count]");
    this.statusTitle = document.querySelector("[data-table-title]");
    this.statusCopy = document.querySelector("[data-table-copy]");
    this.dots = document.querySelector("[data-table-dots]");
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.sequenceIndex = 0;
    this.autoTimer = null;
    this.autoCompleted = false;
    this.lastNarrativeStep = "clean";
    this.sequence = [
      {
        id: "clean",
        title: "La tavola si apre.",
        copy: "Luce, lino, ceramica: MONO prepara il primo gesto.",
        pieces: []
      },
      {
        id: "bread",
        title: "Arriva il pane.",
        copy: "La materia semplice entra in scena, senza rumore.",
        pieces: ["bread"]
      },
      {
        id: "oil",
        title: "Un filo d'olio.",
        copy: "Il gesto diventa accoglienza.",
        pieces: ["bread", "oil"]
      },
      {
        id: "gastronomy",
        title: "Il piatto caldo.",
        copy: "La gastronomia porta la cucina quotidiana al centro.",
        pieces: ["bread", "oil", "gastronomy"]
      },
      {
        id: "steam",
        title: "Cucina viva.",
        copy: "Un respiro leggero, caldo, appena percepibile.",
        pieces: ["bread", "oil", "gastronomy", "steam"]
      },
      {
        id: "pastry",
        title: "Il dolce firma.",
        copy: "La pasticceria entra come memoria e precisione.",
        pieces: ["bread", "oil", "gastronomy", "steam", "pastry"]
      },
      {
        id: "aperitivo",
        title: "Il bicchiere giusto.",
        copy: "L'aperitivo mette ordine al tempo che resta.",
        pieces: ["bread", "oil", "gastronomy", "steam", "pastry", "aperitivo"]
      },
      {
        id: "takeaway",
        title: "La cura si porta via.",
        copy: "Box, gifting e quotidiano entrano nella stessa idea di buono.",
        pieces: ["bread", "oil", "gastronomy", "steam", "pastry", "aperitivo", "takeaway"]
      },
      {
        id: "complete",
        title: "La tavola è completa.",
        copy: "Una bottega. Più momenti. La stessa idea di buono.",
        pieces: ["bread", "oil", "gastronomy", "steam", "pastry", "aperitivo", "takeaway", "conviviality", "complete"]
      }
    ];
    this.narrativePieces = {
      gesture: ["bread", "oil"],
      gastronomy: ["bread", "oil", "gastronomy", "steam"],
      pastry: ["bread", "oil", "gastronomy", "steam", "pastry"],
      aperitivo: ["bread", "oil", "gastronomy", "steam", "pastry", "aperitivo"],
      takeaway: ["bread", "oil", "gastronomy", "steam", "pastry", "aperitivo", "takeaway"],
      conviviality: ["bread", "oil", "gastronomy", "steam", "pastry", "aperitivo", "takeaway", "conviviality"],
      complete: ["bread", "oil", "gastronomy", "steam", "pastry", "aperitivo", "takeaway", "conviviality", "complete"]
    };
  }

  init() {
    this.createDots();
    this.applySequence(0);
    this.setupObserver();
    if (this.reducedMotion) {
      this.applySequence(this.sequence.length - 1);
      return;
    }
    this.startAutoSequence();
    this.setupPointerLight();
  }

  createDots() {
    if (!this.dots) {
      return;
    }

    this.dots.innerHTML = this.sequence.map((item, index) => `<span data-dot="${index}" aria-label="${item.title}"></span>`).join("");
  }

  applyPieces(visiblePieces) {
    this.root.classList.toggle("is-photo-complete", visiblePieces.includes("complete"));
    this.pieces.forEach((piece) => {
      piece.classList.toggle("is-visible", visiblePieces.includes(piece.dataset.tablePiece));
    });
    this.photoPieces.forEach((piece) => {
      piece.classList.toggle("is-visible", visiblePieces.includes(piece.dataset.photoPiece));
    });
  }

  applySequence(index) {
    const nextIndex = Math.max(0, Math.min(index, this.sequence.length - 1));
    const item = this.sequence[nextIndex];
    this.sequenceIndex = nextIndex;
    this.applyPieces(item.pieces);
    this.updateStatus(item);
  }

  updateStatus(item) {
    if (this.statusCount) {
      this.statusCount.textContent = `${String(this.sequenceIndex + 1).padStart(2, "0")} / ${String(this.sequence.length).padStart(2, "0")}`;
    }
    if (this.statusTitle) {
      this.statusTitle.textContent = item.title;
    }
    if (this.statusCopy) {
      this.statusCopy.textContent = item.copy;
    }
    this.dots?.querySelectorAll("span").forEach((dot, index) => {
      dot.classList.toggle("is-active", index <= this.sequenceIndex);
    });
  }

  startAutoSequence() {
    window.setTimeout(() => {
      this.autoTimer = window.setInterval(() => {
        if (this.sequenceIndex >= this.sequence.length - 1) {
          window.clearInterval(this.autoTimer);
          this.autoCompleted = true;
          return;
        }
        this.applySequence(this.sequenceIndex + 1);
      }, 1500);
    }, 700);
  }

  applyNarrativeStep(step) {
    this.lastNarrativeStep = step;
    const pieces = this.narrativePieces[step];
    if (!pieces) {
      return;
    }
    this.applyPieces(pieces);
    const sequenceIndex = this.sequence.findIndex((item) => item.id === step);
    if (sequenceIndex >= 0) {
      this.sequenceIndex = sequenceIndex;
      this.updateStatus(this.sequence[sequenceIndex]);
    }
  }

  setupObserver() {
    if (!("IntersectionObserver" in window)) {
      this.applySequence(this.sequence.length - 1);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visibleEntry?.target?.dataset?.tableStep) {
          this.applyNarrativeStep(visibleEntry.target.dataset.tableStep);
        }
      },
      {
        rootMargin: "-26% 0px -42% 0px",
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
      light.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(239, 227, 198, 0.72), transparent 36%)`;
    });
  }
}

document.querySelectorAll("[data-mono-table]").forEach((root) => {
  new MonoTableExperience(root).init();
});
