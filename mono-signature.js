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

  /* Le due manopole della farina MENTRE UN FILM SUONA (vedi il commento
     lungo dentro onMove). Sono qui in alto perche' sono l'unica cosa da
     toccare se il video della home tornasse a scattare:
     GRANELLI_CON_VIDEO a 0 rimette esattamente il comportamento del 28/7. */
  const GRANELLI_CON_VIDEO = 1;   /* granelli per movimento, invece di 1-4 */
  const TETTO_CON_VIDEO = 12;     /* granelli in aria insieme, invece di 44 */

  /* ============================================================
     IL CURSORE E' UNA NUVOLA DI FARINA (28/7 sera)

     Scelta del proprietario fra quattro proposte provate dal vivo su
     /prova-cursore/ (goccia d'olio, impronta nella farina, nuvola,
     pallina d'impasto): "nuvola di farina e' la mia scelta".

     Cosa cambia rispetto alla goccia d'olio:
     - le particelle NON vengono piu' tirate verso il cursore (era il
       comportamento del liquido che si ricompatta). Ognuna ha una
       velocita' sua: parte all'indietro rispetto al movimento, sale un
       poco, l'aria la frena, e alla fine il peso la fa posare.
     - si disegnano CERCHI PIENI invece di gradienti radiali. Sembra un
       dettaglio ed e' la ragione per cui questa versione costa MENO
       della precedente: il vecchio codice creava un createRadialGradient
       PER OGNI particella A OGNI fotogramma. 44 cerchi piatti pesano
       meno di 18 gradienti.
     - ogni granello e' disegnato due volte: prima un'ombra calda
       spostata in basso a destra, poi il granello chiaro. Serve a due
       cose: dare rilievo, e farlo vedere ANCHE sulle schede crema, dove
       una farina tutta bianca sparirebbe.

     ⚠️ NON ho toccato il guardiano delle prestazioni (monitorFrame):
     se la media dei fotogrammi peggiora, spegne da solo prima gli
     sbuffi e poi la scia. E' la rete che c'era gia'.
     ⚠️ La fisica e' scalata sul tempo vero (dt), non "a fotogramma":
     su uno schermo a 120Hz altrimenti la farina volerebbe al doppio.
     ============================================================ */
  class MonoDrop {
    constructor() {
      /* granelli, non goccioline: piu' numerosi ma molto piu' leggeri */
      this.maxTrail = runtime.quality === "full" ? 44 : 22;
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
      this.videoInCorso = 0;   /* quanti video stanno suonando adesso */
      this.sporco = null;      /* il rettangolo da ripulire al prossimo giro */
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

      /* ⚠️ TETTO ALLO SPOSTAMENTO, e non e' teoria: misurato il 28/7.
         Senza, al PRIMO movimento della sessione (e ogni volta che il
         mouse rientra dal bordo della finestra) lo scarto vale
         centinaia di pixel, e la farina partiva a razzo fuori dallo
         schermo invece di restare una nuvoletta. Il motore gia' tappa
         a 28 la sua `velocity.speed`: qui si usa lo stesso metro. */
      const spintaX = Math.max(-26, Math.min(26, deltaX));
      const spintaY = Math.max(-26, Math.min(26, deltaY));

      /* ⚠️⚠️ MENTRE UN FILM SUONA LA FARINA SI ALLEGGERISCE — NON SI SPEGNE.
         COM'ERA (28/7 sera): qui c'era un `return` secco, cioe' ZERO farina
         finche' un video suonava. Serviva a togliere carico, perche' lui
         aveva segnalato "si inceppa il video iniziale".
         IL PREZZO, capito solo il 30/7 quando me l'ha detto lui: sulla home
         partono DUE film da 10 secondi l'uno, quindi per una VENTINA DI
         SECONDI il cursore era una pallina nuda senza scia — cioe' sembrava
         rotto, proprio nei primi secondi in cui una persona guarda la home.
         ADESSO pesa circa un quarto: un granello per movimento invece di
         quattro, dodici granelli in aria invece di quarantaquattro, e
         niente sbuffi nelle curve (sono il pezzo piu' caro, sette granelli
         in un colpo). Sommato al fatto che si ridipinge SOLO il rettangolo
         sporco - l'altro rimedio del 28/7, e quasi certamente quello che
         contava davvero - il carico resta molto sotto a quello che aveva
         fatto inceppare il film.
         ⚠️ SE IL FILM DELLA HOME TORNA A SCATTARE: la manopola e'
         GRANELLI_CON_VIDEO qui sopra. Portalo a 0 e si torna esattamente
         al comportamento del 28/7, senza toccare altro. */
      const conFilm = this.videoInCorso > 0;

      /* piu' corri, piu' farina sollevi: da 1 granello a 4 per movimento */
      if (this.trailEnabled && distance > 1.4) {
        const quanti = conFilm ? GRANELLI_CON_VIDEO : Math.min(4, 1 + Math.floor(distance / 9));
        for (let i = 0; i < quanti; i += 1) this.sollevaFarina(now, spintaX, spintaY, 0.75);
        const tetto = conFilm ? TETTO_CON_VIDEO : this.maxTrail;
        if (this.trail.length > tetto) this.trail.splice(0, this.trail.length - tetto);
      }

      /* nelle curve strette la mano "sbatte" e alza uno sbuffo piu' grosso */
      const sharpTurn = distance > 13 && Math.abs(Math.sin(this.lastAngle - angleRadians)) > 0.55;
      if (!conFilm && this.dropletsEnabled && sharpTurn && now - this.lastDrop > 260) {
        this.lastDrop = now;
        this.sbuffo(now, spintaX, spintaY, 7);
      }
      this.lastAngle = angleRadians;
      this.start();
    }

    /* un granello solo. `forza` = quanto viene scagliato all'indietro. */
    sollevaFarina(now, deltaX, deltaY, forza) {
      const sparpaglio = Math.random() * Math.PI * 2;
      const spinta = Math.random() * forza;
      this.trail.push({
        x: this.target.x + (Math.random() - 0.5) * 7,
        y: this.target.y + (Math.random() - 0.5) * 7,
        vx: Math.cos(sparpaglio) * spinta - deltaX * 0.055,
        vy: Math.sin(sparpaglio) * spinta - deltaY * 0.055 - 0.34, /* -0.34 = la farina SALE, prima di posarsi */
        born: now,
        life: 620 + Math.random() * 700,
        radius: 0.9 + Math.random() * 2.4
      });
    }

    sbuffo(now, deltaX, deltaY, quanti) {
      for (let i = 0; i < quanti; i += 1) this.sollevaFarina(now, deltaX, deltaY, 2.1);
      if (this.trail.length > this.maxTrail) this.trail.splice(0, this.trail.length - this.maxTrail);
    }

    bind() {
      document.addEventListener("pointermove", (event) => this.onMove(event), { passive: true });
      document.addEventListener("pointerleave", () => {
        this.visible = false;
        this.overlay.classList.remove("is-visible");
      });
      document.addEventListener("pointerdown", () => {
        this.overlay.classList.add("is-pressed");
        /* il clic schiaccia la nuvola e alza una spolverata */
        if (this.trailEnabled) {
          this.sbuffo(performance.now(), 0, 0, this.dropletsEnabled ? 12 : 6);
          this.start();
        }
      }, { passive: true });
      document.addEventListener("pointerup", () => this.overlay.classList.remove("is-pressed"), { passive: true });
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          this.running = false;
          this.trail.length = 0;
          this.droplets.length = 0;
          this.lastPhysics = 0;
          this.sporco = null;
          this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        } else if (this.visible) {
          this.start();
        }
      });
      /* ⚠️ I video NON fanno risalire i loro eventi (play/pause non
         "bollono"): per sentirli da document serve la fase di CATTURA,
         cioe' il terzo argomento a true. Con false non arriverebbe
         niente e la protezione del film non partirebbe mai. */
      /* ⚠️ I film si CONTANO dal DOM, non a colpi di +1 e -1.
         Col contatore bastava un evento perso - un video tolto dalla
         pagina mentre suona, un `pause` che non arriva perche' la scheda
         era in secondo piano - e restava per sempre sopra zero: la farina
         sarebbe rimasta leggera per tutta la visita e nessuno avrebbe
         capito perche'. I video in pagina sono due o tre: contarli non
         costa niente, e il numero e' sempre quello vero.
         ⚠️ Fase di CATTURA (il terzo argomento `true`): play/pause/ended
         non risalgono il DOM, da `document` non si sentirebbero. */
      const contaFilm = () => {
        let quanti = 0;
        document.querySelectorAll("video").forEach((film) => {
          if (!film.paused && !film.ended) quanti += 1;
        });
        this.videoInCorso = quanti;
      };
      document.addEventListener("play", contaFilm, true);
      document.addEventListener("pause", contaFilm, true);
      document.addEventListener("ended", contaFilm, true);

      window.addEventListener("resize", () => {
        this.resize();
        this.sporco = null;   /* la tela e' stata azzerata dal ridimensionamento */
      }, { passive: true });
      window.addEventListener("pagehide", () => this.destroy(), { once: true });
    }

    drawTrail(now) {
      const context = this.context;

      /* ⚠️ SI PULISCE SOLO IL RETTANGOLO SPORCO, non tutto lo schermo.
         Perche' conta: il costo vero di questa tela non e' il disegno
         (misurato: 0,041 ms, niente) ma il fatto che una tela grande
         quanto la finestra, ridipinta a ogni fotogramma, va ricaricata
         sulla scheda grafica a ogni fotogramma. Sopra il film della
         home, che sta gia' lavorando, si sente: lui ha segnalato che
         il video "si inceppa". La farina occupa una macchia di qualche
         centinaio di pixel, non 1440x900: si tocca solo quella. */
      const vecchio = this.sporco;
      if (vecchio) {
        context.clearRect(vecchio.x0, vecchio.y0, vecchio.x1 - vecchio.x0, vecchio.y1 - vecchio.y0);
      }
      if (!this.trail.length) {
        this.sporco = null;
        return;
      }

      /* passo di tempo normalizzato a 60 al secondo: cosi' la farina cade
         alla stessa velocita' su uno schermo a 60Hz e su uno a 120Hz.
         Tappato a 3 per non far "saltare" tutto dopo una pausa lunga. */
      const dt = Math.min(3, this.lastPhysics ? (now - this.lastPhysics) / 16.667 : 1);
      this.lastPhysics = now;
      const ARIA = Math.pow(0.955, dt);   /* l'aria frena */
      const PESO = 0.028 * dt;            /* poi vince il peso */

      this.trail = this.trail.filter((granello) => now - granello.born < granello.life);

      /* 1° passo: l'ombra calda, spostata in basso a destra.
         Da' rilievo e tiene la farina visibile anche sulle schede crema.
         Nello stesso giro si segna il rettangolo da ripulire al
         prossimo fotogramma. */
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      context.fillStyle = "rgba(120, 96, 60, 0.85)";
      for (let i = 0; i < this.trail.length; i += 1) {
        const g = this.trail[i];
        g.x += g.vx * dt;
        g.y += g.vy * dt;
        g.vx *= ARIA;
        g.vy = g.vy * ARIA + PESO;
        const age = (now - g.born) / g.life;
        g.raggioOra = Math.max(0.2, g.radius * (1 - age * 0.42));
        g.opacitaOra = (1 - age) * 0.62;
        context.globalAlpha = g.opacitaOra * 0.55;
        context.beginPath();
        context.arc(g.x + 0.9, g.y + 1.1, g.raggioOra, 0, 6.2832);
        context.fill();

        const bordo = g.raggioOra + 3;   /* margine: ombra spostata + arrotondamenti */
        if (g.x - bordo < x0) x0 = g.x - bordo;
        if (g.y - bordo < y0) y0 = g.y - bordo;
        if (g.x + bordo > x1) x1 = g.x + bordo;
        if (g.y + bordo > y1) y1 = g.y + bordo;
      }
      this.sporco = { x0, y0, x1, y1 };

      /* 2° passo: il granello chiaro sopra */
      context.fillStyle = "rgba(248, 243, 232, 1)";
      for (let i = 0; i < this.trail.length; i += 1) {
        const g = this.trail[i];
        context.globalAlpha = g.opacitaOra;
        context.beginPath();
        context.arc(g.x, g.y, g.raggioOra, 0, 6.2832);
        context.fill();
      }
      context.globalAlpha = 1;
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
      /* RETE DI SICUREZZA (28/7 sera, aggiunta con la nuvola di farina).
         Il cursore vero e' nascosto da `cursor: none` sulla classe
         .mono-drop-active, che viene messa PRIMA che questo giro parta.
         Se qui dentro scoppiasse qualcosa, la freccia resterebbe
         nascosta e l'utente rimarrebbe senza cursore: il guasto
         peggiore possibile su ogni pagina del sito. Con destroy() la
         classe viene tolta e torna il cursore di sistema. */
      try {
        this.drawTrail(now);
      } catch (errore) {
        this.destroy();
        return;
      }
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
      /* l'orologio della fisica riparte da zero: se no, dopo una pausa
         lunga il primo fotogramma farebbe volare via tutta la farina */
      this.lastPhysics = 0;
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
