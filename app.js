const APP_STORE_URL = "https://app.monobottega.it/home";
const GOOGLE_PLAY_URL = "https://app.monobottega.it/home";
const NEWSLETTER_EMAIL = "monobottega@gmail.com";
const NEWSLETTER_ENDPOINT = window.MONO_NEWSLETTER_ENDPOINT || "";
const APP_WAITLIST_ENDPOINT = window.MONO_APP_WAITLIST_ENDPOINT || "";
const GFORM_ACTION = window.MONO_GFORM_ACTION || "";
const GFORM_FIELD = window.MONO_GFORM_FIELD || "";
const TRACKING_EVENT_NAME = "mono_cta_click";
const ANALYTICS_CONFIG = {
  ga4MeasurementId: "",
  gtmContainerId: ""
};

const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
const primaryNav = document.querySelector("#primaryNav");
const siteHeader = document.querySelector("[data-header]");
const rootElement = document.documentElement;

function setupMobileMenu() {
  if (!mobileMenuToggle || !primaryNav) {
    return;
  }

  const closeMenu = () => {
    primaryNav.classList.remove("is-open");
    mobileMenuToggle.setAttribute("aria-expanded", "false");
  };

  mobileMenuToggle.addEventListener("click", () => {
    const isOpen = primaryNav.classList.toggle("is-open");
    mobileMenuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  primaryNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && primaryNav.classList.contains("is-open")) {
      closeMenu();
      mobileMenuToggle.focus();
    }
  });
}

function setupHeaderState() {
  if (!siteHeader) {
    return;
  }

  const updateHeader = () => {
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

function setupHeroVideo() {
  const heroVideo = document.querySelector("[data-hero-video]");

  if (!(heroVideo instanceof HTMLVideoElement)) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    heroVideo.pause();
    heroVideo.removeAttribute("autoplay");
    return;
  }

  heroVideo.muted = true;
  heroVideo.play().catch(() => {
    heroVideo.controls = false;
  });
}

function setupCursorLight() {
  if (window.MONODrop || window.MONOExperienceConfig?.runtime?.flags?.monoDrop) {
    return;
  }

  const canUseCursorLight = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!canUseCursorLight || prefersReducedMotion) {
    return;
  }

  let animationFrame = null;
  let cursorX = window.innerWidth / 2;
  let cursorY = window.innerHeight / 2;

  rootElement.classList.add("has-cursor-light");

  const updateLight = () => {
    rootElement.style.setProperty("--cursor-light-x", `${cursorX}px`);
    rootElement.style.setProperty("--cursor-light-y", `${cursorY}px`);
    animationFrame = null;
  };

  window.addEventListener("pointermove", (event) => {
    cursorX = event.clientX;
    cursorY = event.clientY;
    rootElement.classList.add("is-cursor-active");

    if (!animationFrame) {
      animationFrame = window.requestAnimationFrame(updateLight);
    }
  }, { passive: true });

  document.addEventListener("pointerleave", () => {
    rootElement.classList.remove("is-cursor-active");
  });
}

function setupAppLinks() {
  document.querySelectorAll("[data-app-store]").forEach((link) => {
    link.setAttribute("href", APP_STORE_URL);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener");
  });

  document.querySelectorAll("[data-google-play]").forEach((link) => {
    link.setAttribute("href", GOOGLE_PLAY_URL);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener");
  });
}

function setupQrDialog() {
  const trigger = document.querySelector("[data-qr-open]");
  const dialog = document.querySelector("[data-qr-dialog]");
  const closeButton = dialog?.querySelector("[data-qr-close]");

  if (!(trigger instanceof HTMLButtonElement) || !(dialog instanceof HTMLElement) || !(closeButton instanceof HTMLButtonElement)) {
    return;
  }

  const openDialog = () => {
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }

    document.body.classList.add("qr-dialog-open");
    closeButton.focus();
    emitTrackingEvent("app_qr_enlarge", trigger);
  };

  const closeDialog = () => {
    if (typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
      document.body.classList.remove("qr-dialog-open");
      trigger.focus();
    }
  };

  trigger.addEventListener("click", openDialog);
  closeButton.addEventListener("click", closeDialog);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      closeDialog();
    }
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("qr-dialog-open");
    trigger.focus();
  });
}

function setupNewsletterForms() {
  document.querySelectorAll("[data-newsletter-form]").forEach((form) => {
    const emailInput = form.querySelector('input[type="email"]');
    const status = form.querySelector("[data-newsletter-status]");

    if (!(form instanceof HTMLFormElement) || !(emailInput instanceof HTMLInputElement)) {
      return;
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!emailInput.checkValidity()) {
        emailInput.reportValidity();
        return;
      }

      const email = emailInput.value.trim();
      const createdAt = new Date().toISOString();
      const payload = { email, created_at: createdAt };

      /* ⚠️ ONESTA' DEL MESSAGGIO (18/7). Prima qui si diceva SEMPRE "Ci siamo,
         ti scriviamo noi" anche quando l'email non era stata raccolta da
         nessuno: senza endpoint si apriva un `mailto:` che, su un telefono
         senza client di posta, NON FA NULLA. Risultato: la persona credeva di
         essersi iscritta e il contatto era perso in silenzio.
         Ora: se c'e' l'endpoint si salva davvero; se non c'e' si apre Gmail
         gia' compilato (funziona su qualunque dispositivo) e il messaggio dice
         la verita' — l'iscrizione si completa premendo invia. */
      /* RIPIEGO DI SCORTA (24/7). Apre Gmail gia' compilato. Serve in due casi:
         quando non e' configurato NESSUN sistema di raccolta, e - questa e' la
         novita' - quando quello configurato FALLISCE (rete assente, modulo
         cancellato, Google giu'). Prima in quel caso si diceva soltanto "non
         siamo riusciti a salvare l'email": la persona aveva gia' scritto il suo
         indirizzo, si sentiva dire di no, e il contatto era perso lo stesso.
         Ora il peggio che puo' capitare e' tornare al comportamento di prima. */
      const ripiegaSuGmail = () => {
        const subject = "Avvisami all'apertura MONO";
        const body = `Email: ${email}\nOrigine: ${window.location.href}\nData: ${createdAt}`;
        const gmailUrl =
          "https://mail.google.com/mail/?view=cm&fs=1&to=" + encodeURIComponent(NEWSLETTER_EMAIL) +
          "&su=" + encodeURIComponent(subject) +
          "&body=" + encodeURIComponent(body);

        const composeWindow = window.open(gmailUrl, "_blank", "noopener");

        if (composeWindow) {
          if (status) {
            status.textContent = "Ti abbiamo aperto la mail già scritta: premi invia e sei dentro.";
          }
          form.reset();
          return;
        }

        // popup bloccato: ultima spiaggia il mailto: nativo, senza promesse
        window.location.href =
          "mailto:" + NEWSLETTER_EMAIL +
          "?subject=" + encodeURIComponent(subject) +
          "&body=" + encodeURIComponent(body);

        if (status) {
          status.textContent = "Apri la mail che abbiamo preparato e premi invia. Oppure scrivici a " + NEWSLETTER_EMAIL + ".";
        }
      };

      try {
        if (NEWSLETTER_ENDPOINT) {
          const response = await fetch(NEWSLETTER_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });

          if (!response.ok) {
            throw new Error("Newsletter endpoint error");
          }

          if (status) {
            status.textContent = "Ci siamo. Ti scriviamo noi. — MONO";
          }
          form.reset();
          return;
        }

        /* ⭐ APP MONO - la strada VERA, dal 24/7 (app v115).
           L'iscrizione entra direttamente nel CRM dell'app come contatto con
           consenso marketing. Da li' il titolare la vede in Admin > Lista
           apertura (elenco + CSV) e il banco vede solo QUANTE sono.
           Scelta al posto del modulo Google perche' Google vive FUORI
           dall'app: i dipendenti avrebbero dovuto aprire un link esterno con
           un altro account, e l'app non poteva essere avvisata di niente.
           L'app risponde:
             {ok:true}                -> salvata
             {ok:true, already:true}  -> gia' iscritta (per la persona e' un
                                         successo comunque: non la spaventiamo)
             {disabled:true}          -> interruttore spento lato app
           Negli ultimi due casi NON ci si ferma: si prova la strada dopo. */
        if (APP_WAITLIST_ENDPOINT) {
          try {
            const risposta = await fetch(APP_WAITLIST_ENDPOINT, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email })
            });
            const esito = await risposta.json().catch(() => ({}));

            if (esito && esito.ok) {
              if (status) {
                status.textContent = "Ci siamo. Ti scriviamo noi. — MONO";
              }
              form.reset();
              return;
            }
          } catch (e) {
            /* app irraggiungibile: si scende alla strada dopo, non si molla */
          }
        }

        /* MODULO GOOGLE - scorta SPENTA (i due valori sono vuoti in
           mono-config.js, quindi questo blocco non parte mai). Tenuto pronto
           nel caso un giorno serva senza l'app.
           ⚠️ Se lo si riaccende: mode:"no-cors" e' OBBLIGATORIO (Google non
           concede CORS ai moduli) e ha un prezzo - la risposta e' "opaca",
           NON possiamo sapere se ha funzionato, quindi il successo si
           annuncia fidandosi. La fetch rifiuta solo se la rete e' giu', e li'
           il catch ripiega su Gmail. */
        if (GFORM_ACTION && GFORM_FIELD) {
          const dati = new URLSearchParams();
          dati.append(GFORM_FIELD, email);

          await fetch(GFORM_ACTION, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: dati.toString()
          });

          if (status) {
            status.textContent = "Ci siamo. Ti scriviamo noi. — MONO";
          }
          form.reset();
          return;
        }

        ripiegaSuGmail();
      } catch (error) {
        ripiegaSuGmail();
      }
    });
  });
}

function emitTrackingEvent(action, element) {
  const isCinematicEvent = action.startsWith("cinematic_video_");
  const eventPayload = {
    event: isCinematicEvent ? action : TRACKING_EVENT_NAME,
    action,
    event_category: isCinematicEvent ? "mono_cinematic" : "mono_cta",
    link_text: element.textContent?.trim() || element.getAttribute("aria-label") || action,
    link_url: element.getAttribute("href") || "",
    page_path: window.location.pathname
  };

  const assetId = element.dataset.assetId || element.closest?.("[data-asset-id]")?.dataset.assetId;
  if (assetId) {
    eventPayload.asset_id = assetId;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(eventPayload);

  if (typeof window.gtag === "function") {
    window.gtag("event", action, eventPayload);
  }

  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    console.info("[MONO tracking]", eventPayload);
  }
}

window.MONOTrackEvent = emitTrackingEvent;

function loadScript(src) {
  const existingScript = document.querySelector(`script[src="${src}"]`);

  if (existingScript) {
    return;
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = src;
  document.head.append(script);
}

function setupAnalytics() {
  const runtimeConfig = window.MONO_ANALYTICS_CONFIG || {};
  const config = {
    ...ANALYTICS_CONFIG,
    ...runtimeConfig
  };

  window.dataLayer = window.dataLayer || [];

  if (config.gtmContainerId) {
    window.dataLayer.push({
      event: "mono_gtm_ready",
      gtm_container_id: config.gtmContainerId
    });
    loadScript(`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(config.gtmContainerId)}`);
  }

  if (config.ga4MeasurementId) {
    window.gtag = window.gtag || function gtag() {
      window.dataLayer.push(arguments);
    };

    window.gtag("js", new Date());
    window.gtag("config", config.ga4MeasurementId, {
      send_page_view: true
    });
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(config.ga4MeasurementId)}`);
  }
}

function setupTracking() {
  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const trackedElement = event.target.closest("[data-track], [data-app-store], [data-google-play]");

    if (!trackedElement) {
      return;
    }

    const action = trackedElement.dataset.track
      || (trackedElement.hasAttribute("data-google-play") ? "open_app_wallet" : "open_app_home");

    emitTrackingEvent(action, trackedElement);
  });
}

function setupReveals() {
  const revealElements = [...document.querySelectorAll("[data-reveal]")];

  if (!revealElements.length) {
    return;
  }

  // Cascade: reveals that share a grid stagger in sequence for a filmic feel.
  const staggerParents = ".page-grid, .local-answer-grid, .app-reason-grid";
  revealElements.forEach((element) => {
    const group = element.parentElement;

    if (group instanceof Element && group.matches(staggerParents)) {
      const revealSiblings = [...group.children].filter((child) => child.hasAttribute("data-reveal"));
      element.style.setProperty("--reveal-order", String(Math.max(0, revealSiblings.indexOf(element))));
    }
  });

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-revealed"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.12
    }
  );

  revealElements.forEach((element) => observer.observe(element));
}

function setupHeroParallax() {
  const hero = document.querySelector("[data-mono-hero]");

  if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  // Parallax only where the desktop hero layout applies; mobile hero is restacked.
  if (!window.matchMedia("(min-width: 821px)").matches) {
    return;
  }

  let ticking = false;

  const update = () => {
    const rect = hero.getBoundingClientRect();
    const height = rect.height || 1;
    const progress = Math.min(1, Math.max(0, -rect.top / height));
    hero.style.setProperty("--hero-scroll", progress.toFixed(3));
    hero.style.setProperty("--hero-light-x", `${(64 + progress * 10).toFixed(1)}%`);
    hero.style.setProperty("--hero-light-y", `${(42 + progress * 12).toFixed(1)}%`);
    ticking = false;
  };

  const requestUpdate = () => {
    if (ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(update);
  };

  update();
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate, { passive: true });
}

function setupCinematicHero() {
  if (window.MONOCinematicController?.mountHome) {
    window.MONOCinematicController.mountHome();
    return;
  }

  var hero = document.querySelector("[data-cinema-hero]");

  if (!hero) {
    return;
  }

  var track = hero.querySelector("[data-cinema-track]");
  var fireVideo = hero.querySelector('[data-video="fire"] video');
  var pastaVideo = hero.querySelector('[data-video="pasta"] video');
  var pauseBtn = hero.querySelector("[data-cinema-pause]");
  var reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
  var mobileMq = window.matchMedia("(max-width: 820px)");

  // Agnolotti film timeline: 0-1s flour cloud | ~2-5s cut | 6s finished zoom
  var TRIGGER = 0.20;
  // Su mobile il fuoco (pentolino) restava solo 1.2s e poi tagliava sugli
  // agnolotti: troppo veloce, non si capiva ne' l'uno ne' l'altro. Alzato a
  // 3.5s (17/7) e poi a 4.8s (18/7: "almeno un secondo in piu', se no si
  // perde la magia"). I due video girano anche piu' lenti (0.8x).
  var MOBILE_FIRE_HOLD = 4800;
  var MOBILE_RATE = 0.8;
  var STAGE2_AT = 1.6;
  var STAGE3_AT = 5.0;

  var pastaLoadStarted = false;
  var pastaReady = false;
  var transitioned = false;
  var active = false;
  var paused = false;
  var ticking = false;
  var mobileTimer = null;

  function safePlay(v) { if (!v) { return; } v.muted = true; try { v.playbackRate = mobileMq.matches ? MOBILE_RATE : 1; } catch (e) {} var p = v.play(); if (p && typeof p.catch === "function") { p.catch(function () {}); } }
  function safePause(v) { if (v) { try { v.pause(); } catch (e) {} } }
  function setStage(s) { if (hero.getAttribute("data-stage") !== s) { hero.setAttribute("data-stage", s); } }

  function loadPasta() {
    if (pastaLoadStarted) { return; }
    pastaLoadStarted = true;
    var src = pastaVideo.getAttribute("data-src");
    if (src && !pastaVideo.src) { pastaVideo.src = src; try { pastaVideo.load(); } catch (e) {} }
  }
  pastaVideo.addEventListener("loadeddata", function () {
    pastaReady = true;
    hero.classList.add("pasta-ready");
  });

  function filmStage() {
    var ct = pastaVideo.currentTime || 0;
    if (ct < STAGE2_AT) { return "t"; }
    if (ct < STAGE3_AT) { return "2"; }
    return "3";
  }
  pastaVideo.addEventListener("timeupdate", function () {
    if (transitioned && !paused) { setStage(filmStage()); }
  });

  function triggerTransition() {
    if (transitioned) { return; }
    loadPasta();
    transitioned = true;
    hero.classList.remove("is-transitioned");
    void hero.offsetWidth;
    hero.classList.add("is-transitioned");
    try { pastaVideo.currentTime = 0; } catch (e) {}
    safePause(fireVideo);
    if (!paused) { safePlay(pastaVideo); }
    setStage("t");
  }
  function untrigger() {
    if (!transitioned) { return; }
    transitioned = false;
    hero.classList.remove("is-transitioned");
    safePause(pastaVideo);
    try { pastaVideo.currentTime = 0; } catch (e) {}
    setStage("1");
    if (!paused && active) { safePlay(fireVideo); }
  }

  function computeProgress() {
    var rect = track.getBoundingClientRect();
    var total = track.offsetHeight - window.innerHeight;
    if (total <= 0) { return rect.top <= 0 ? 1 : 0; }
    return -rect.top / total;
  }
  function apply(p) {
    p = Math.max(0, Math.min(1, p));
    hero.style.setProperty("--progress", p.toFixed(4));
    if (p > 0.22) { loadPasta(); }
    if (p >= TRIGGER) { triggerTransition(); } else { untrigger(); }
  }
  function onScroll() {
    if (ticking || !active || paused || mobileMq.matches) { return; }
    ticking = true;
    window.requestAnimationFrame(function () { apply(computeProgress()); ticking = false; });
  }

  function startMobile() {
    if (paused) { return; }
    safePlay(fireVideo);
    loadPasta();
    if (mobileTimer) { clearTimeout(mobileTimer); }
    mobileTimer = window.setTimeout(function () { triggerTransition(); }, MOBILE_FIRE_HOLD);
  }

  function setPaused(next) {
    paused = next;
    if (paused) {
      safePause(fireVideo);
      safePause(pastaVideo);
      if (mobileTimer) { clearTimeout(mobileTimer); mobileTimer = null; }
      pauseBtn.textContent = "▶ Riprendi";
      pauseBtn.setAttribute("aria-label", "Riprendi l'animazione");
    } else {
      pauseBtn.textContent = "⏸ Pausa";
      pauseBtn.setAttribute("aria-label", "Metti in pausa l'animazione");
      if (transitioned) { safePlay(pastaVideo); }
      else if (mobileMq.matches) { startMobile(); }
      else { safePlay(fireVideo); onScroll(); }
    }
  }
  if (pauseBtn) { pauseBtn.addEventListener("click", function () { setPaused(!paused); }); }

  function enable() {
    active = true;
    if (mobileMq.matches) { startMobile(); }
    else { if (!transitioned) { safePlay(fireVideo); } onScroll(); }
  }
  function disable() {
    active = false;
    safePause(fireVideo);
    safePause(pastaVideo);
    if (mobileTimer) { clearTimeout(mobileTimer); mobileTimer = null; }
  }

  if (reduceMq.matches) {
    setStage("3");
    safePause(fireVideo);
    safePause(pastaVideo);
  } else if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { enable(); } else { disable(); }
      });
    }, { rootMargin: "10% 0px 10% 0px", threshold: 0.01 });
    io.observe(hero);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", function () { if (active && !mobileMq.matches) { onScroll(); } }, { passive: true });
  } else {
    loadPasta();
    triggerTransition();
    setStage("3");
  }
}

if ("serviceWorker" in navigator) {
  const scriptUrl = new URL(document.currentScript?.src || "app.js", window.location.href);
  navigator.serviceWorker.register(new URL("service-worker.js", scriptUrl));
}

setupMobileMenu();
setupHeaderState();
setupHeroVideo();
setupCursorLight();
setupHeroParallax();
setupCinematicHero();
setupReveals();
setupAnalytics();
setupAppLinks();
setupQrDialog();
setupNewsletterForms();
setupTracking();
