/* MONO — potenziamento: inclinazione 3D delle card verso il cursore.
   Additivo, non tocca la logica esistente. Solo mouse fine + rispetta reduced-motion. */
(function () {
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!fine || reduce) return;

  var MAX = 8;     // gradi: era 11, l'utente lo trovava "troppo" (17/7 sera)
  var EASE = 0.22; // smorzamento per-frame: la card GLIDE verso il cursore
                   // invece di scattare -> "rallentarle un pelo"

  /* Un solo rAF che interpola lo stato ATTUALE verso il TARGET (cx,cy →
     tx,ty). Questo da' due cose insieme: il movimento morbido chiesto
     ("rallentare un pelo") e il rientro dolce a piatto quando esci (basta
     mettere il target a 0). La posizione si misura all'ingresso (e su
     scroll/resize), mai dentro pointermove -> niente forced layout.
     .is-tilting resta per TUTTO il tempo che il JS controlla il transform,
     cosi' la transizione di comparsa di Codex (transform .86s) non azzuffa
     con la scrittura frame-by-frame. */
  function campoInUso(card) {
    var a = document.activeElement;
    return a && card.contains(a) && /^(INPUT|SELECT|TEXTAREA)$/.test(a.tagName);
  }

  function bind(card) {
    var rect = null, loop = 0, active = false;
    var tx = 0, ty = 0, cx = 0, cy = 0;

    var measure = function () { rect = card.getBoundingClientRect(); };

    var step = function () {
      cx += (tx - cx) * EASE;
      cy += (ty - cy) * EASE;
      var fermo = Math.abs(tx - cx) < 0.02 && Math.abs(ty - cy) < 0.02;
      if (fermo && !active && tx === 0 && ty === 0) {
        // rientrata a piatto: pulisci e ferma (cosi' torna la transizione di comparsa)
        card.style.transform = "";
        card.classList.remove("is-tilting");
        loop = 0;
        return;
      }
      card.style.transform =
        "perspective(1000px) rotateX(" + cy.toFixed(2) + "deg) rotateY(" +
        cx.toFixed(2) + "deg) translateY(-7px) scale(1.014)";
      // raggiunto il target: fermati e basta (un pointermove fara' ripartire).
      // Cosi' col cursore fermo il rAF non gira a vuoto.
      loop = fermo ? 0 : requestAnimationFrame(step);
    };
    var kick = function () { if (!loop) loop = requestAnimationFrame(step); };

    card.addEventListener("pointerenter", function () {
      measure();
      active = true;
      card.classList.add("is-tilting");
      kick();
    });

    card.addEventListener("pointermove", function (e) {
      if (!active) return;
      if (!rect) measure();
      // Card-modulo in compilazione: resta ferma (i campi non devono ballare)
      if (campoInUso(card)) { tx = 0; ty = 0; kick(); return; }
      var px = (e.clientX - rect.left) / rect.width;
      var py = (e.clientY - rect.top) / rect.height;
      ty = (0.5 - py) * MAX;
      tx = (px - 0.5) * MAX;
      kick();
    });

    card.addEventListener("pointerleave", function () {
      active = false;
      tx = 0; ty = 0;   // il loop fa il rientro morbido a piatto, poi si ferma
      rect = null;
      kick();
    });

    // appena clicchi in un campo la card si appiattisce subito (non aspetta
    // il prossimo movimento del mouse): compilare non deve far ballare i campi
    card.addEventListener("focusin", function () {
      if (campoInUso(card)) { tx = 0; ty = 0; kick(); }
    });

    window.addEventListener("scroll", function () { if (active) measure(); }, { passive: true });
    window.addEventListener("resize", function () { if (active) measure(); }, { passive: true });
  }

  function init() {
    document.querySelectorAll(
      ".page-card, .local-info-card, .phone-card, .app-reason-grid article, .app-qr, .pdf-panel, .convivium-mark, .principio, .cta-block"
    ).forEach(bind);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

/* ============================================================
   "Scrivici" (header di Contatti) — sembrava rotto (17/7)
   Non era rotto: e' un link mailto:, e su un dispositivo senza client
   di posta collegato il clic non fa NULLA. Qui NON blocchiamo il link
   (chi ha la posta configurata la vede aprirsi come prima): copiamo
   l'indirizzo negli appunti e lo diciamo. Cosi' non si perde un contatto
   nemmeno quando il mailto muore in silenzio.
   ============================================================ */
(function () {
  function nota(testo, ancora) {
    var vecchia = document.querySelector(".mono-copiato");
    if (vecchia) vecchia.remove();
    var el = document.createElement("span");
    el.className = "mono-copiato";
    el.setAttribute("role", "status");
    el.textContent = testo;
    /* position:fixed calcolata dal bottone cliccato: funziona ovunque nella
       pagina, non solo nell'header (i bottoni mailto stanno anche dentro
       card e sezioni). Niente animazione d'ingresso: deve VEDERSI sempre. */
    document.body.appendChild(el);
    var r = ancora.getBoundingClientRect();
    var w = el.offsetWidth || 220;
    var x = Math.max(10, Math.min(r.left + r.width / 2 - w / 2, window.innerWidth - w - 10));
    var y = r.bottom + 10;
    if (y + 44 > window.innerHeight) y = Math.max(10, r.top - 44);
    el.style.left = x + "px";
    el.style.top = y + "px";
    setTimeout(function () {
      el.classList.add("is-out");
      setTimeout(function () { el.remove(); }, 400);
    }, 2600);
  }

  /* Apre la composizione di Gmail gia' compilata (richiesta 17/7 sera: "non
     solo copiare, portami subito alla scrittura"). Se il popup viene bloccato
     si ripiega sul mailto: classico. L'indirizzo viene comunque copiato. */
  function apriGmail(indirizzo, oggetto, corpo, fallbackHref) {
    var url = "https://mail.google.com/mail/?view=cm&fs=1&to=" + encodeURIComponent(indirizzo);
    if (oggetto) url += "&su=" + encodeURIComponent(oggetto);
    if (corpo) url += "&body=" + encodeURIComponent(corpo);
    var win = window.open(url, "_blank", "noopener");
    if (!win) window.location.href = fallbackHref || ("mailto:" + indirizzo);
  }
  window.MONOApriGmail = apriGmail;
  window.MONONotaCopia = nota;

  /* Questionario eventi: alla conferma si apre Gmail con la richiesta gia'
     scritta riga per riga. Nessun servizio esterno, zero costi. */
  function initFormEventi() {
    var form = document.querySelector("[data-mono-form-eventi]");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = function (n) { return (form.elements[n] && form.elements[n].value || "").trim(); };
      if (!v("tipo")) { form.elements.tipo.focus(); return; }
      var dataIt = "";
      if (v("data")) {
        var p = v("data").split("-"); // yyyy-mm-dd → gg/mm/aaaa
        dataIt = p[2] + "/" + p[1] + "/" + p[0];
      }
      var righe = [
        "Ciao MONO!",
        "",
        "Tipo di evento: " + v("tipo"),
        "Data: " + (dataIt || "da definire"),
        "Numero di persone: " + (v("persone") || "da definire"),
        "Budget orientativo: " + (v("budget") || "da definire insieme"),
        "",
        "L'occasione: " + (v("note") || "-"),
        "",
        (v("nome") ? "— " + v("nome") : "")
      ];
      var oggetto = "Richiesta evento MONO — " + v("tipo") + (dataIt ? " (" + dataIt + ")" : "");
      apriGmail("monobottega@gmail.com", oggetto, righe.join("\n"),
        "mailto:monobottega@gmail.com?subject=" + encodeURIComponent(oggetto) + "&body=" + encodeURIComponent(righe.join("\n")));
      nota("Richiesta pronta: controlla e invia", form.querySelector("button[type=submit]"));
    });
  }

  function init() {
    /* TUTTI i mailto del sito: click → copia l'indirizzo + apre Gmail con
       destinatario e oggetto gia' impostati. Chi ha i popup bloccati finisce
       sul mailto: nativo (com'era prima). */
    document.querySelectorAll('a[href^="mailto:"]').forEach(function (link) {
      var href = link.getAttribute("href");
      var indirizzo = href.replace(/^mailto:/, "").split("?")[0];
      var oggetto = (href.split("subject=")[1] || "").split("&")[0];
      link.addEventListener("click", function (e) {
        e.preventDefault();
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(indirizzo).then(function () {
            nota("Email copiata: " + indirizzo, link);
          }).catch(function () {});
        }
        apriGmail(indirizzo, decodeURIComponent(oggetto || ""), "", href);
      });
    });
    initFormEventi();
    initQrSblocco();
    initBadgeProdotti();
    initContoApertura();
  }

  /* Conto alla rovescia per l'apertura (18/7). Sta accanto alla raccolta
     email: "mancano N giorni" da' un motivo per lasciare l'indirizzo ADESSO
     invece di rimandare. Resta nascosto finche' il JS non ha un numero vero,
     cosi' non si vede mai un trattino al posto della cifra. */
  function initContoApertura() {
    var blocco = document.querySelector("[data-conto-apertura]");
    if (!blocco) return;
    var numero = blocco.querySelector("[data-conto-giorni]");
    var testo = blocco.querySelector(".mono-conto__testo");
    if (!numero) return;

    var apertura = new Date(2026, 8, 1); // 1 settembre 2026 (mese 0-based)
    var oggi = new Date();
    oggi.setHours(0, 0, 0, 0);
    var giorni = Math.ceil((apertura - oggi) / 86400000);

    if (giorni > 0) {
      numero.textContent = giorni;
      if (testo) testo.textContent = giorni === 1 ? "giorno all'apertura" : "giorni all'apertura";
    } else {
      numero.textContent = "";
      if (testo) testo.textContent = "La bottega è aperta.";
      blocco.classList.add("is-aperto");
    }
    blocco.hidden = false;
  }

  /* Video PRODOTTI (gastronomia): l'asset mono-kitchen-magic ha badge:false,
     quindi il watermark "Gemini" in basso a destra NON e' coperto. Su PC il
     ritaglio ovale del riquadro lo nasconde; su mobile si vede. Iniettiamo il
     badge MONO (favicon piatto+posate) come sugli altri video; il CSS lo mostra
     solo su mobile (18/7). */
  function initBadgeProdotti() {
    var film = document.querySelector(".chapter-film--products");
    if (!film || film.querySelector(".chapter-film__badge")) return;
    var badge = document.createElement("span");
    badge.className = "chapter-film__badge";
    badge.setAttribute("aria-hidden", "true");
    var img = document.createElement("img");
    img.src = "/icons/mono-favicon.svg"; // assoluto: vale su ogni pagina
    img.alt = "";
    badge.appendChild(img);
    film.appendChild(badge);
  }

  /* Rete di sicurezza QR (bug 17/7 sera: "e' un casino tornare indietro").
     Chiudendo il modale del QR, il <dialog> si chiude (perde l'attributo
     `open`) ma la classe `qr-dialog-open` — che tiene `overflow:hidden` sul
     body — puo' restare se l'evento `close` non scatta: la PAGINA RESTA
     BLOCCATA, non scrolla piu'. Qui osserviamo l'attributo `open`: appena il
     dialog e' chiuso, sblocchiamo sempre. (Il cursore invisibile e' risolto
     nel CSS.) */
  function initQrSblocco() {
    var dialog = document.querySelector(".app-qr-dialog, [data-qr-dialog]");
    if (!dialog || typeof MutationObserver !== "function") return;
    var sblocca = function () {
      if (!dialog.open) document.body.classList.remove("qr-dialog-open");
    };
    new MutationObserver(sblocca).observe(dialog, { attributes: true, attributeFilter: ["open"] });
    dialog.addEventListener("close", sblocca);
    dialog.addEventListener("cancel", sblocca);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

/* ============================================================
   SIPARIO "dal basso" per il cambio pagina (tutti i browser).
   Uscita: sale il pannello, poi si naviga. Arrivo: l'inline script
   in <head> ha già coperto la pagina (classe mono-curtain-cover);
   qui la sveliamo facendo uscire il pannello verso l'alto.
   ============================================================ */
(function () {
  var html = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function reveal() {
    if (!html.classList.contains("mono-curtain-cover")) return;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        html.classList.remove("mono-curtain-cover");
        html.classList.add("mono-curtain-exit");
        window.setTimeout(function () { html.classList.remove("mono-curtain-exit"); }, 720);
      });
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", reveal);
  else reveal();

  window.addEventListener("pageshow", function () {
    html.classList.remove("mono-curtain-in");
  });

  if (reduce) return;

  var leaving = false;
  function norm(p) { return (p.replace(/index\.html$/, "").replace(/\/+$/, "") || "/"); }

  document.addEventListener("click", function (e) {
    if (leaving || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var link = e.target && e.target.closest ? e.target.closest("a[href]") : null;
    if (!link || link.target || link.hasAttribute("download") || link.dataset.noPortal !== undefined) return;
    var url;
    try { url = new URL(link.href, window.location.href); } catch (err) { return; }
    if (!/^https?:$/.test(url.protocol) || url.origin !== window.location.origin) return;
    if (norm(url.pathname) === norm(window.location.pathname)) return; /* àncore e stessa pagina */

    e.preventDefault();
    if (e.stopImmediatePropagation) e.stopImmediatePropagation(); else e.stopPropagation();
    leaving = true;
    try { sessionStorage.setItem("monoCurtain", "1"); } catch (err) {}
    html.classList.add("mono-curtain-in");
    window.setTimeout(function () { window.location.assign(url.href); }, 430);
    window.setTimeout(function () { leaving = false; html.classList.remove("mono-curtain-in"); }, 2600);
  }, true);
})();

/* ============================================================
   BRACI DI FALÒ nei momenti scuri (hero + footer).
   Canvas decorativo (pointer-events:none), additivo. Modello:
   rosso in basso → oro a metà → baglioncino → si spegne; alcune
   fino in cima; forme tonde e rettangolari; intermittenza dolce.
   Perf: IntersectionObserver (disegna solo se visibile).
   ============================================================ */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function lerp(a, b, t) { return a + (b - a) * t; }
  function fireCol(p) {
    if (p < 0.42) { var t = p / 0.42; return [lerp(202,236,t), lerp(46,112,t), lerp(18,40,t)]; }
    if (p < 0.72) { var s = (p-0.42)/0.30; return [lerp(236,255,s), lerp(112,201,s), lerp(40,108,s)]; }
    var u = (p-0.72)/0.28; return [lerp(255,150,u), lerp(201,72,u), lerp(108,34,u)];
  }

  function mountEmbers() {
    /* Home notturna: braci diffuse su TUTTA la pagina (canvas fisso dietro
       ai contenuti). Altrimenti: solo sezioni scure senza video (prodotti).
       MAI sopra i video. Footer: sempre. */
    var hosts = [];
    if (document.body.classList.contains("mono-dark-home")) {
      var stage = document.createElement("div");
      stage.className = "mono-embers-stage";
      stage.setAttribute("aria-hidden", "true");
      document.body.insertBefore(stage, document.body.firstChild);
      hosts.push({ el: stage, stage: true });
    } else {
      document.querySelectorAll(".product-system").forEach(function (s) { hosts.push({ el: s, hero: true }); });
    }
    document.querySelectorAll(".site-footer").forEach(function (f) { hosts.push({ el: f, hero: false }); });

    hosts.forEach(function (h) {
      var host = h.el;
      if (getComputedStyle(host).position === "static") host.style.position = "relative";
      var canvas = document.createElement("canvas");
      canvas.className = "mono-embers";
      canvas.setAttribute("aria-hidden", "true");
      canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;";
      host.insertBefore(canvas, host.firstChild);
      if (h.stage) run3d(canvas, host);
      else run(canvas, host, h.hero);
    });
  }

  /* Motore 3D per lo stage a tutta pagina: profondità vera.
     Parallasse col mouse (la telecamera si guarda intorno) e
     scroll = camminata (le braci ti vengono incontro). */
  function run3d(canvas, host) {
    var ctx = canvas.getContext("2d");
    var DPR = Math.min(window.devicePixelRatio || 1, 2);
    var W = 1, H = 1, tick = 0, DEPTH = 1400, FOCAL = 520 * DPR;
    function size() {
      var r = host.getBoundingClientRect();
      W = canvas.width = Math.max(1, Math.round(r.width * DPR));
      H = canvas.height = Math.max(1, Math.round(r.height * DPR));
    }
    size();
    window.addEventListener("resize", size);

    var N = window.innerWidth < 640 ? 110 : 170, pts = [];
    function mk() {
      var spark = Math.random() < 0.12;
      var high = spark || Math.random() < 0.26;
      var birthY = 430 + Math.random() * 520;
      var rise = high ? (1500 + Math.random() * 900) : (470 + Math.random() * 680);
      return {
        x: (Math.random() - 0.5) * 2400, y: birthY, birthY: birthY, endY: birthY - rise,
        z: Math.random() * DEPTH,
        vy: spark ? (1.9 + Math.random() * 2.6) : (0.5 + Math.random() * 1.5),
        vx: (Math.random() - 0.5) * 0.5,
        wob: Math.random() * 6.28, wobAmp: 4 + Math.random() * 10, wobSpd: 0.006 + Math.random() * 0.02,
        rect: Math.random() < 0.42, rot: Math.random() * 6.28, rotSpd: (Math.random() - 0.5) * 0.05,
        r: spark ? (0.5 + Math.random()) : (1 + Math.random() * 2.1),
        br: 0.75 + Math.random() * 0.25, fl: Math.random() * 6.28, fs: 0.15 + Math.random() * 0.5
      };
    }
    for (var i = 0; i < N; i++) { var q = mk(); q.y = q.birthY - Math.random() * (q.birthY - q.endY); pts.push(q); }

    var mx = 0, my = 0, camx = 0, camy = 0, camz = 0;
    window.addEventListener("mousemove", function (e) {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
    }, { passive: true });

    var visible = true;
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }, { threshold: 0 }).observe(host);
    }

    function frame() {
      tick++;
      camx += (mx * 220 - camx) * 0.05;
      camy += (my * 140 - camy) * 0.05;
      camz += (window.scrollY * 1.1 - camz) * 0.06;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      var cxp = W / 2, cyp = H / 2;
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        if (!reduce) { p.y -= p.vy; p.x += p.vx; p.wob += p.wobSpd; p.rot += p.rotSpd; }
        var prog = (p.birthY - p.y) / (p.birthY - p.endY);
        if (prog >= 1) { pts[i] = mk(); continue; }
        var zr = p.z - (camz % DEPTH); if (zr <= 1) zr += DEPTH;
        var k = FOCAL / zr;
        var sx = cxp + (p.x + Math.sin(p.wob) * p.wobAmp - camx * DPR) * k;
        var sy = cyp + (p.y - camy * DPR) * k;
        if (sx < -60 || sx > W + 60 || sy < -60 || sy > H + 60) continue;
        var depth = 1 - zr / DEPTH;
        var glow = 0.3 + 0.7 * Math.sin(Math.max(0, Math.min(1, prog)) * Math.PI);
        if (prog > 0.86) glow *= (1 - (prog - 0.86) / 0.14);
        var fl = 0.86 + 0.14 * Math.sin(p.fl + tick * p.fs * 0.22);
        var a = glow * fl * p.br * (0.4 + 0.6 * depth);
        if (a <= 0.02) continue;
        var c = fireCol(Math.max(0, Math.min(1, prog))), R = c[0] | 0, G = c[1] | 0, B = c[2] | 0;
        var col = "rgba(" + R + "," + G + "," + B + ",";
        var rr = Math.max(0.5, p.r * DPR * k);
        ctx.beginPath(); ctx.arc(sx, sy, rr * 3.2, 0, 6.283); ctx.fillStyle = col + (a * 0.15).toFixed(3) + ")"; ctx.fill();
        if (p.rect) {
          ctx.save(); ctx.translate(sx, sy); ctx.rotate(p.rot);
          ctx.fillStyle = col + Math.min(1, a).toFixed(3) + ")"; ctx.fillRect(-rr * 1.3, -rr * 0.5, rr * 2.6, rr); ctx.restore();
        } else {
          ctx.beginPath(); ctx.arc(sx, sy, rr, 0, 6.283); ctx.fillStyle = col + Math.min(1, a).toFixed(3) + ")"; ctx.fill();
        }
      }
      ctx.globalCompositeOperation = "source-over";
    }
    function loop() { requestAnimationFrame(loop); if (visible && !reduce) frame(); }
    if (reduce) frame(); else loop();
  }

  function run(canvas, host, hero) {
    var ctx = canvas.getContext("2d");
    var DPR = Math.min(window.devicePixelRatio || 1, 2);
    var W = 1, H = 1, pts = [], N = 0, tick = 0;

    function mk(seed) {
      var spark = Math.random() < 0.16;
      var high = spark || Math.random() < 0.24;
      return {
        x: Math.random() * W,
        y: seed ? Math.random() * H : H + Math.random() * 40 * DPR,
        vy: (spark ? 1.7 + Math.random() * 2.4 : 0.5 + Math.random() * 1.4) * DPR,
        vx: (Math.random() - 0.5) * 0.5 * DPR,
        top: high ? -20 * DPR : H * (0.28 + Math.random() * 0.34),
        wob: Math.random() * 6.28, wobA: (3 + Math.random() * 10) * DPR, wobS: 0.01 + Math.random() * 0.04,
        r: (spark ? 0.5 + Math.random() : 1 + Math.random() * 2.2) * DPR,
        rect: Math.random() < 0.4, rot: Math.random() * 6.28, rotS: (Math.random() - 0.5) * 0.05,
        br: 0.7 + Math.random() * 0.3, fl: Math.random() * 6.28, fs: 0.15 + Math.random() * 0.5
      };
    }
    function build() { pts = []; for (var i = 0; i < N; i++) pts.push(mk(true)); }
    function size() {
      var r = host.getBoundingClientRect();
      W = canvas.width = Math.max(1, Math.round(r.width * DPR));
      H = canvas.height = Math.max(1, Math.round(r.height * DPR));
      N = Math.max(24, Math.min(hero ? 150 : 70, Math.round((r.width * r.height) / (hero ? 9000 : 6000))));
      build();
    }
    size();
    if (window.ResizeObserver) new ResizeObserver(size).observe(host);

    var visible = true;
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }, { threshold: 0 }).observe(host);
    }

    function frame() {
      tick++;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        if (!reduce) { p.y -= p.vy; p.x += p.vx; p.wob += p.wobS; p.rot += p.rotS; }
        var span = H - p.top, prog = span > 0 ? (H - p.y) / span : 1;
        if (prog >= 1 || p.y < -30 * DPR) { pts[i] = mk(false); continue; }
        var glow = 0.3 + 0.7 * Math.sin(Math.max(0, Math.min(1, prog)) * Math.PI);
        if (prog > 0.86) glow *= (1 - (prog - 0.86) / 0.14);
        var fl = 0.86 + 0.14 * Math.sin(p.fl + tick * p.fs * 0.22);
        var a = glow * fl * p.br;
        if (a <= 0.02) continue;
        var c = fireCol(Math.max(0, Math.min(1, prog))), R = c[0]|0, G = c[1]|0, B = c[2]|0, col = "rgba(" + R + "," + G + "," + B + ",";
        var x = p.x + Math.sin(p.wob) * p.wobA;
        ctx.beginPath(); ctx.arc(x, p.y, p.r * 3.2, 0, 6.283); ctx.fillStyle = col + (a * 0.15).toFixed(3) + ")"; ctx.fill();
        if (p.rect) {
          ctx.save(); ctx.translate(x, p.y); ctx.rotate(p.rot);
          ctx.fillStyle = col + Math.min(1, a).toFixed(3) + ")"; ctx.fillRect(-p.r * 1.3, -p.r * 0.5, p.r * 2.6, p.r); ctx.restore();
        } else {
          ctx.beginPath(); ctx.arc(x, p.y, p.r, 0, 6.283); ctx.fillStyle = col + Math.min(1, a).toFixed(3) + ")"; ctx.fill();
        }
      }
      ctx.globalCompositeOperation = "source-over";
    }
    function loop() { requestAnimationFrame(loop); if (visible && !reduce) frame(); }
    if (reduce) frame(); else loop();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mountEmbers);
  else mountEmbers();
})();

