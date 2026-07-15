(() => {
  "use strict";

  const config = window.MONOExperienceConfig;
  if (!config || !document.body?.classList.contains("mono-world")) return;
  const runtime = config.runtime;
  const root = document.documentElement;
  const body = document.body;

  const setupOilAlive = () => {
    if (!runtime.flags.oilAlive || runtime.quality === "static") return;
    document.querySelectorAll(".button.primary, .header-action, .mono-next-chapter__open").forEach((element) => {
      if (element.querySelector(".mono-oil-surface")) return;
      const surface = document.createElement("span");
      surface.className = "mono-oil-surface";
      surface.setAttribute("aria-hidden", "true");
      element.prepend(surface);
      element.classList.add("has-mono-oil");
    });
    window.addEventListener("mono:oil-alive", (event) => {
      root.style.setProperty("--mono-oil-origin-x", `${event.detail?.originX || window.innerWidth / 2}px`);
      root.style.setProperty("--mono-oil-origin-y", `${event.detail?.originY || window.innerHeight / 2}px`);
      root.classList.remove("is-oil-alive-pulsing");
      void root.offsetWidth;
      root.classList.add("is-oil-alive-pulsing");
      window.setTimeout(() => root.classList.remove("is-oil-alive-pulsing"), 980);
    });
  };

  class MonoDrop {
    constructor() {
      this.maxTrail = runtime.quality === "full" ? 18 : 10;
      this.trailEnabled = runtime.flags.oilTrail;
      this.dropletsEnabled = runtime.flags.microDroplets;
      this.refractionEnabled = runtime.flags.oilRefraction;
      this.target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      this.previous = { ...this.target };
      this.velocity = { x: 0, y: 0, speed: 0 };
      this.trail = [];
      this.droplets = [];
      this.lastMove = 0;
      this.lastDrop = 0;
      this.lastAngle = 0;
      this.lastFrame = 0;
      this.frameSamples = [];
      this.frame = 0;
      this.visible = false;
      this.running = false;
      this.currentLabel = "";
      this.build();
      this.bind();
    }

    build() {
      this.overlay = document.createElement("div");
      this.overlay.className = "mono-drop";
      this.overlay.setAttribute("aria-hidden", "true");
      this.overlay.innerHTML = `
        <canvas class="mono-drop__trail"></canvas>
        <span class="mono-drop__lens"><span class="mono-drop__highlight"></span><span class="mono-drop__label"></span></span>`;
      body.append(this.overlay);
      this.canvas = this.overlay.querySelector("canvas");
      this.context = this.canvas.getContext("2d", { alpha: true, desynchronized: true });
      this.lens = this.overlay.querySelector(".mono-drop__lens");
      this.label = this.overlay.querySelector(".mono-drop__label");
      this.overlay.classList.toggle("has-refraction", this.refractionEnabled);
      this.resize();
      root.classList.add("mono-drop-active");
    }

    resize() {
      this.dpr = Math.min(1.5, window.devicePixelRatio || 1);
      this.canvas.width = Math.round(window.innerWidth * this.dpr);
      this.canvas.height = Math.round(window.innerHeight * this.dpr);
      this.canvas.style.width = `${window.innerWidth}px`;
      this.canvas.style.height = `${window.innerHeight}px`;
      this.context.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }

    inferLabel(target) {
      const cinematicControl = target?.closest?.(
        "[data-cinematic-state], [data-cinematic-skip], [data-cinematic-replay]"
      );
      if (cinematicControl) return "";

      const interactive = target?.closest?.("[data-cursor-label], [data-cinematic-state], a, button");
      if (!interactive) return "";
      if (interactive.dataset.cursorLabel) return interactive.dataset.cursorLabel.slice(0, 10).toUpperCase();
      if (interactive.matches("[data-cinematic-state]")) {
        const state = interactive.dataset.cinematicState;
        if (state === "playing") return "SALTA";
        if (state === "complete") return "RIVEDI";
        return "GUARDA";
      }
      if (interactive.closest(".nav")) return "ENTRA";
      if (interactive.matches('a[href^="mailto:"]')) return "SCRIVI";
      if (/google\.com\/maps/i.test(interactive.href || "")) return "PORTAMI";
      if (interactive.closest(".product-system, .gastronomia-page, .pasticceria-page, .aperitivo-page")) return "ASSAGGIA";
      if (interactive.closest(".mono-next-chapter")) return "SCORRI";
      if (interactive.matches(".button, .header-action")) return "SCOPRI";
      return "";
    }

    setLabel(nextLabel) {
      if (nextLabel === this.currentLabel) return;
      this.currentLabel = nextLabel;
      this.label.textContent = nextLabel;
      this.overlay.classList.toggle("has-label", Boolean(nextLabel));
    }

    onMove(event) {
      const now = performance.now();
      const deltaX = event.clientX - this.previous.x;
      const deltaY = event.clientY - this.previous.y;
      const distance = Math.hypot(deltaX, deltaY);
      this.target.x = event.clientX;
      this.target.y = event.clientY;
      this.velocity.x = deltaX;
      this.velocity.y = deltaY;
      this.velocity.speed = Math.min(28, distance);
      this.previous.x = event.clientX;
      this.previous.y = event.clientY;
      this.visible = true;
      this.lastMove = now;
      this.overlay.classList.add("is-visible");
      this.setLabel(this.inferLabel(event.target));

      const angleRadians = Math.atan2(deltaY, deltaX);
      const angle = angleRadians * 180 / Math.PI;
      const stretch = Math.min(0.55, distance / 52);
      this.lens.style.setProperty("--drop-x", `${event.clientX}px`);
      this.lens.style.setProperty("--drop-y", `${event.clientY}px`);
      this.lens.style.setProperty("--drop-angle", `${angle.toFixed(2)}deg`);
      this.lens.style.setProperty("--drop-stretch", stretch.toFixed(3));

      if (this.trailEnabled && distance > 1.5) {
        this.trail.push({ x: event.clientX, y: event.clientY, born: now, radius: Math.min(7.5, 2.8 + distance * 0.12) });
        if (this.trail.length > this.maxTrail) this.trail.splice(0, this.trail.length - this.maxTrail);
      }

      const sharpTurn = distance > 13 && Math.abs(Math.sin(this.lastAngle - angleRadians)) > 0.55;
      if (this.dropletsEnabled && sharpTurn && now - this.lastDrop > 420 && this.droplets.length < 2) {
        this.lastDrop = now;
        this.droplets.push({
          x: event.clientX - deltaX * 0.55 + deltaY * 0.12,
          y: event.clientY - deltaY * 0.55 - deltaX * 0.12,
          born: now,
          life: 360 + Math.random() * 120,
          radius: 1.8 + Math.random() * 1.4
        });
      }
      this.lastAngle = angleRadians;
      this.start();
    }

    bind() {
      document.addEventListener("pointermove", (event) => this.onMove(event), { passive: true });
      document.addEventListener("pointerleave", () => {
        this.visible = false;
        this.overlay.classList.remove("is-visible");
      });
      document.addEventListener("pointerdown", () => this.overlay.classList.add("is-pressed"), { passive: true });
      document.addEventListener("pointerup", () => this.overlay.classList.remove("is-pressed"), { passive: true });
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          this.running = false;
          this.trail.length = 0;
          this.droplets.length = 0;
          this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        } else if (this.visible) {
          this.start();
        }
      });
      window.addEventListener("resize", () => this.resize(), { passive: true });
      window.addEventListener("pagehide", () => this.destroy(), { once: true });
    }

    drawTrail(now) {
      this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      this.trail = this.trail.filter((point) => now - point.born < 420);
      this.trail.forEach((point, index) => {
        const age = Math.min(1, (now - point.born) / 420);
        const pull = age * age * (3 - 2 * age);
        const x = point.x + (this.target.x - point.x) * pull;
        const y = point.y + (this.target.y - point.y) * pull;
        const radius = Math.max(0.45, point.radius * (1 - age) * (0.45 + index / Math.max(1, this.trail.length)));
        const gradient = this.context.createRadialGradient(x - radius * 0.25, y - radius * 0.35, 0, x, y, radius * 1.4);
        gradient.addColorStop(0, `rgba(244, 236, 221, ${0.52 * (1 - age)})`);
        gradient.addColorStop(0.3, `rgba(203, 167, 90, ${0.45 * (1 - age)})`);
        gradient.addColorStop(1, `rgba(110, 106, 60, ${0.08 * (1 - age)})`);
        this.context.fillStyle = gradient;
        this.context.beginPath();
        this.context.ellipse(x, y, radius * 1.55, radius, 0, 0, Math.PI * 2);
        this.context.fill();
      });

      this.droplets = this.droplets.filter((drop) => now - drop.born < drop.life);
      this.droplets.forEach((drop) => {
        const age = Math.min(1, (now - drop.born) / drop.life);
        const pull = age * age;
        const x = drop.x + (this.target.x - drop.x) * pull;
        const y = drop.y + (this.target.y - drop.y) * pull;
        const radius = Math.max(0.2, drop.radius * (1 - age * 0.7));
        this.context.fillStyle = `rgba(110, 106, 60, ${0.48 * (1 - age)})`;
        this.context.beginPath();
        this.context.ellipse(x, y, radius * 1.15, radius, 0, 0, Math.PI * 2);
        this.context.fill();
      });
    }

    monitorFrame(now) {
      if (this.lastFrame) {
        this.frameSamples.push(now - this.lastFrame);
        if (this.frameSamples.length > 60) this.frameSamples.shift();
      }
      this.lastFrame = now;
      if (this.frameSamples.length < 45) return;
      const average = this.frameSamples.reduce((sum, value) => sum + value, 0) / this.frameSamples.length;
      if (average <= 24) return;
      if (this.refractionEnabled) {
        this.refractionEnabled = false;
        this.overlay.classList.remove("has-refraction");
      } else if (this.dropletsEnabled) {
        this.dropletsEnabled = false;
        this.droplets.length = 0;
      } else if (this.maxTrail > 8) {
        this.maxTrail = 8;
      } else {
        this.trailEnabled = false;
        this.trail.length = 0;
      }
      this.frameSamples.length = 0;
    }

    render(now) {
      if (!this.running) return;
      this.drawTrail(now);
      this.monitorFrame(now);
      const idle = now - this.lastMove > 460;
      if (idle && this.trail.length === 0 && this.droplets.length === 0) {
        this.running = false;
        this.lens.style.setProperty("--drop-stretch", "0");
        return;
      }
      this.frame = window.requestAnimationFrame((time) => this.render(time));
    }

    start() {
      if (this.running || document.hidden) return;
      this.running = true;
      this.lastFrame = 0;
      this.frame = window.requestAnimationFrame((time) => this.render(time));
    }

    destroy() {
      this.running = false;
      window.cancelAnimationFrame(this.frame);
      root.classList.remove("mono-drop-active");
      this.overlay.remove();
    }
  }

  const setupCursorLabels = () => {
    document.querySelectorAll('.nav a').forEach((element) => { element.dataset.cursorLabel = "ENTRA"; });
    document.querySelectorAll('a[href^="mailto:"]').forEach((element) => { element.dataset.cursorLabel = "SCRIVI"; });
    document.querySelectorAll('a[href*="google.com/maps"]').forEach((element) => { element.dataset.cursorLabel = "PORTAMI"; });
    document.querySelectorAll('.product-system a, .gastronomia-page .page-card a, .pasticceria-page .page-card a, .aperitivo-page .page-card a').forEach((element) => {
      element.dataset.cursorLabel = "ASSAGGIA";
    });
  };

  setupOilAlive();
  setupCursorLabels();
  if (runtime.flags.monoDrop) {
    window.MONODrop = new MonoDrop();
  }

  window.MONOSignature = Object.freeze({
    version: "20260715-cinematic-cleanup-v1",
    oilAlive: runtime.flags.oilAlive,
    monoDrop: Boolean(window.MONODrop)
  });
})();
