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
    /* .mono-form-card ESCLUSA di proposito (18/7): e' la scheda "Due minuti,
       e ci pensiamo noi" degli eventi. Una card che si deve COMPILARE non
       deve muoversi: il tilt rendeva difficile centrare i campi. Ferma. */
    document.querySelectorAll(
      ".page-card:not(.mono-form-card), .local-info-card, .phone-card, .app-reason-grid article, .app-qr, .pdf-panel, .convivium-mark, .principio, .cta-block"
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

  /* Conferma dopo l'invio della richiesta evento.

     ⚠️ Perche' esiste. Prima al posto suo c'era una nota volante (`nota`) che
     spariva dopo due secondi e mezzo e diceva solo "Ti ricontattiamo presto".
     L'app RESTITUISCE il codice pratica (`publicCode`) e nessuno lo mostrava:
     chi mandava la richiesta dal sito restava senza niente in mano — nessun
     codice da citare al telefono, nessuna prova di aver mandato qualcosa.
     Il titolare se n'e' accorto in collaudo: "la conferma con il codice
     pratica non c'e' sullo schermo".

     Il riquadro prende il posto del modulo e RESTA: si puo' fotografare. */
  function mostraConferma(form, codice, email) {
    var box = document.createElement("div");
    box.className = "mono-eventi-ok";
    box.setAttribute("role", "status");

    var h = document.createElement("p");
    h.className = "mono-eventi-ok__titolo";
    h.textContent = "✓ Richiesta ricevuta";
    box.appendChild(h);

    if (codice) {
      var et = document.createElement("p");
      et.className = "mono-eventi-ok__etichetta";
      et.textContent = "Il tuo codice pratica";
      box.appendChild(et);

      var c = document.createElement("p");
      c.className = "mono-eventi-ok__codice";
      c.textContent = codice;
      box.appendChild(c);
    }

    var p = document.createElement("p");
    p.className = "mono-eventi-ok__testo";
    /* Due cose che evitano la telefonata "non mi e' arrivato niente":
       dove cercare la mail, e che questa NON e' una prenotazione. */
    p.textContent = email
      ? "Ti abbiamo mandato una conferma a " + email + " — se non la vedi, guarda in Promozioni o Spam. "
        + "Ti ricontattiamo noi: quella che hai mandato e' una richiesta, non ancora una prenotazione."
      : "Ti ricontattiamo noi: quella che hai mandato e' una richiesta, non ancora una prenotazione.";
    box.appendChild(p);

    form.replaceWith(box);
    if (box.scrollIntoView) box.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  /* Questionario eventi: alla conferma si apre Gmail con la richiesta gia'
     scritta riga per riga. Nessun servizio esterno, zero costi. */
  function initFormEventi() {
    var form = document.querySelector("[data-mono-form-eventi]");
    if (!form) return;
    var ENDPOINT = "https://app.monobottega.it/api/events";
    var CAT = {
      "Cena o festa privata": "privato", "Evento aziendale": "aziendale",
      "Aperitivo": "aperitivo", "Box o regalo gastronomico": "gifting", "Altro": "altro"
    };
    var BUD = {
      "Da definire insieme": "da_definire", "Fino a 500 €": "fino_500",
      "500–1.000 €": "500_1000", "1.000–2.500 €": "1000_2500", "Oltre 2.500 €": "oltre_2500"
    };
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = function (n) { return (form.elements[n] && form.elements[n].value || "").trim(); };
      var btn = form.querySelector("button[type=submit]");
      if (!v("tipo")) { form.elements.tipo.focus(); return; }
      if (v("email").indexOf("@") < 0) { form.elements.email.focus(); nota("Serve la tua email", btn); return; }
      if (v("telefono").replace(/\D/g, "").length < 8) { form.elements.telefono.focus(); nota("Serve il cellulare", btn); return; }
      if (form.elements.consenso && !form.elements.consenso.checked) { nota("Serve il consenso", btn); return; }

      var dataIt = "";
      if (v("data")) { var p = v("data").split("-"); dataIt = p[2] + "/" + p[1] + "/" + p[0]; }
      var righe = [
        "Ciao MONO!", "",
        "Tipo di evento: " + v("tipo"),
        "Data: " + (dataIt || "da definire"),
        "Numero di persone: " + (v("persone") || "da definire"),
        "Budget orientativo: " + (v("budget") || "da definire insieme"), "",
        "L'occasione: " + (v("note") || "-"), "",
        "Nome: " + (v("nome") || "-"),
        "Email: " + v("email"),
        "Cellulare: " + v("telefono")
      ];
      var oggetto = "Richiesta evento MONO — " + v("tipo") + (dataIt ? " (" + dataIt + ")" : "");
      var doMail = function () {
        apriGmail("monobottega@gmail.com", oggetto, righe.join("\n"),
          "mailto:monobottega@gmail.com?subject=" + encodeURIComponent(oggetto) + "&body=" + encodeURIComponent(righe.join("\n")));
        nota("Richiesta pronta: controlla e invia", btn);
      };

      var payload = {
        customerType: "private", category: CAT[v("tipo")] || "altro", title: v("tipo"),
        dateExact: v("data") || null,
        partySize: v("persone") ? parseInt(v("persone"), 10) : null,
        budgetBand: BUD[v("budget")] || "da_definire",
        description: v("note") || null, name: v("nome") || null,
        email: v("email"), phone: v("telefono"), consent: true
      };
      nota("Invio…", btn);
      fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res && res.ok) { mostraConferma(form, res.publicCode, v("email")); }
          else { doMail(); }   // disabilitato o errore → si ripiega sulla mail
        })
        .catch(function () { doMail(); });  // rete giù → mail
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
    initSocial();
    initMappa();
  }

  /* ⚠️ NOTA per chi cerca il "risveglio" della tavola di /la-bottega/:
     NON sta qui. Le illustrazioni fatte a mano si accendono con una
     regola CSS in mono-dark-home.css (come --social e --frusta), non
     con JavaScript: una regola CSS non puo' non partire. Avevo scritto
     qui una funzione con IntersectionObserver ed era il metodo
     sbagliato — tolta il 28/7 sera prima che facesse danni. */

  /* ============================================================
     SCHEDA GOOGLE SULLA MAPPA (28/7 sera)

     I 9 tasti "Apri Google Maps" / "Portami da MONO" (home, Contatti,
     Dove siamo, Social) puntavano a una RICERCA per indirizzo. Ora che
     la scheda Google Business esiste, portano alla scheda vera: nome,
     orari, foto, recensioni, tasto indicazioni.

     UN SOLO punto di configurazione: window.MONO_MAPS_PLACE in
     mono-config.js. Stessa scelta di social e cartellini UTM: nessun
     indirizzo scritto a mano nelle pagine, e un tasto nuovo aggiunto
     domani si aggancia da solo.

     ⚠️ L'href scritto nell'HTML resta la RICERCA PER INDIRIZZO, ed e'
     voluto: e' la rete per chi ha il JavaScript spento. Quel link
     funziona comunque, porta solo a uno spillo invece che alla scheda.
     Quindi NON e' una dimenticanza se un grep sulle pagine trova
     ancora /maps/search: e' il ripiego.

     ⚠️ Non toccare `data-track`: le etichette dei tasti servono alle
     statistiche e ai cartellini, e restano quelle di prima.
     ============================================================ */
  function initMappa() {
    var place = (window.MONO_MAPS_PLACE || "").trim();
    /* vuoto o indirizzo non-Maps => si lascia tutto com'era.
       Il controllo su google.com/maps serve anche a mono-signature.js,
       che riconosce i link della mappa da quel pezzo di testo per
       mettere la scritta "PORTAMI" sul cursore. */
    if (!place || place.indexOf("google.com/maps") === -1) return;
    document.querySelectorAll('a[href*="google.com/maps/search"]').forEach(function (link) {
      link.setAttribute("href", place);
    });
  }

  /* ============================================================
     SOCIAL (26/7) — footer di tutte le pagine + scheda su Contatti

     UN SOLO punto di configurazione: window.MONO_SOCIAL in
     mono-config.js. Qui non ci sono indirizzi scritti a mano.
     Chi ha l'indirizzo vuoto NON viene disegnato: cosi' Facebook
     resta invisibile finche' il proprietario non lo compila, senza
     che nessuno debba toccare il codice.

     Disegnato via JS e non a mano nelle 12 pagine: un punto solo da
     mantenere, e il giorno che si aggiunge un social compare
     ovunque da solo. Stessa scelta gia' fatta per i cartellini UTM.
     ============================================================ */
  var SOCIAL_ORDINE = [
    { chiave: "instagram", nome: "Instagram", icona: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5.2" fill="none" stroke="currentColor" stroke-width="1.9"/><circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" stroke-width="1.9"/><circle cx="17.3" cy="6.7" r="1.25" fill="currentColor"/></svg>' },
    { chiave: "tiktok", nome: "TikTok", icona: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M16.4 2.8h-2.9v12.3c0 1.3-1 2.3-2.3 2.3s-2.3-1-2.3-2.3 1-2.3 2.3-2.3c.2 0 .4 0 .6.1V9.9c-.2 0-.4-.1-.6-.1-2.9 0-5.2 2.3-5.2 5.2s2.3 5.2 5.2 5.2 5.2-2.3 5.2-5.2V8.6c1.1.8 2.4 1.2 3.8 1.2V6.9c-2.1 0-3.8-1.7-3.8-3.8v-.3z"/></svg>' },
    { chiave: "facebook", nome: "Facebook", icona: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5H16.5V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.5V21h3.2z"/></svg>' }
  ];

  function socialAttivi() {
    var cfg = window.MONO_SOCIAL || {};
    return SOCIAL_ORDINE.filter(function (s) {
      var url = cfg[s.chiave];
      return typeof url === "string" && url.trim().length > 0;
    }).map(function (s) {
      return { nome: s.nome, icona: s.icona, chiave: s.chiave, url: cfg[s.chiave].trim() };
    });
  }

  /* Costruisce la fila di icone. `dove` finisce nel data-track, cosi' si
     distingue un clic dal footer da uno dalla pagina Contatti. */
  function listaSocial(voci, dove) {
    var ul = document.createElement("ul");
    ul.className = "mono-social__lista";
    voci.forEach(function (v) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = v.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.setAttribute("aria-label", "MONO su " + v.nome);
      a.dataset.track = "social_" + v.chiave + "_" + dove;
      a.innerHTML = v.icona;
      li.appendChild(a);
      ul.appendChild(li);
    });
    return ul;
  }

  function initSocial() {
    var voci = socialAttivi();
    if (!voci.length) return;   // nessun indirizzo compilato: non si disegna niente

    // 1) FOOTER — su tutte le pagine
    var footer = document.querySelector(".site-footer");
    if (footer && !footer.querySelector(".mono-social")) {
      var blocco = document.createElement("div");
      blocco.className = "mono-social";
      var frase = document.createElement("p");
      frase.className = "mono-social__frase";
      frase.textContent = "Seguici. A settembre si comincia.";
      blocco.appendChild(frase);
      blocco.appendChild(listaSocial(voci, "footer"));
      footer.appendChild(blocco);
    }

    /* 2) PAGINA CONTATTI — la scheda "Vieni a vederla nascere" NON ESISTE PIU'.
       TOLTA il 28/7 su decisione del proprietario: "la carta che c'e' la
       togliamo proprio, cosi' ci togliamo anche il problema del testo e
       siamo puliti, lineari e funzionali. Less is more."
       Il canale social su Contatti adesso e' il tasto "Seguici sui social"
       nella chiusura (vedi initChiusuraContatti): un tasto invece di una
       scheda con tre paragrafi. ⚠️ NON rimetterla senza che lo chieda lui:
       era stata scritta e riscritta due volte, e il testo non lo convinceva. */

    // 3) HOME — subito sotto il riquadro "Sii tra i primi a entrare in
    //    bottega", in cima alla pagina. La scheda su Contatti sta a 3191px
    //    di scorrimento e non la trovava nessuno: qui invece si incontra
    //    per forza. Ed e' il punto giusto anche come senso: chi non lascia
    //    l'email puo' comunque seguire, invece di andarsene e basta.
    //    ⚠️ Anche qui NIENTE data-reveal, per il motivo scritto sopra.
    //    Su TELEFONO pero' la hero e' piena fino all'orlo (misurato): per
    //    farci stare anche i social bisognerebbe togliere data e indirizzo,
    //    che il proprietario ha scelto di tenere. Quindi si disegnano DUE
    //    file e il CSS ne mostra una sola: dentro la hero su computer,
    //    subito SOTTO il film sul telefono. Il data-track le distingue.
    function filaSocial(variante, dove) {
      var fila = document.createElement("div");
      fila.className = "mono-social mono-social--" + variante;
      var invito = document.createElement("p");
      invito.className = "mono-social__frase";
      /* Frase scritta dal proprietario il 28/7, parola per parola. Aveva
         bocciato la mia ("Oppure seguici: qui la bottega si vede nascere"):
         non aggiungere niente e non "migliorarla", ha detto FINE TESTO. */
      invito.textContent = "Entra a far parte della community, aiutaci a crescere.";
      fila.appendChild(invito);
      fila.appendChild(listaSocial(voci, dove));
      return fila;
    }

    var formHero = document.querySelector(".cinema-hero .cinema-group.sg-3 .cinema-signup");
    if (formHero && formHero.parentNode && !formHero.parentNode.querySelector(".mono-social--hero")) {
      formHero.insertAdjacentElement("afterend", filaSocial("hero", "home"));
    }

    var sezioneHero = document.querySelector(".cinema-hero");
    if (sezioneHero) sezioneHero = sezioneHero.closest("section") || sezioneHero;
    if (sezioneHero && sezioneHero.parentNode &&
        !sezioneHero.parentNode.querySelector(".mono-social--sottohero")) {
      sezioneHero.insertAdjacentElement("afterend", filaSocial("sottohero", "home_telefono"));
    }

    /* 4) PAGINA /social/ — il segnaposto nell'HTML si riempie da qui, cosi'
       gli indirizzi restano scritti in un posto solo (mono-config.js). */
    var segnaposti = document.querySelectorAll("[data-social-pagina]");
    Array.prototype.forEach.call(segnaposti, function (posto, i) {
      if (posto.querySelector(".mono-social__lista")) return;
      posto.appendChild(listaSocial(voci, i === 0 ? "pagina_social_alto" : "pagina_social_fondo"));
    });

    initChiusuraContatti(voci);
  }

  /* ============================================================
     CONTATTI — il quarto tasto "Seguici" + il telefono a rotella (28/7)

     Richiesta del proprietario: nella chiusura "Ci vediamo, ci scriviamo,
     ci sentiamo" (tre tasti: Contatta MONO / Salva il contatto / Dove
     siamo) manca il canale social. Ne aggiungiamo un QUARTO che apre le
     tre icone, invece di mandare fuori pagina.
     E accanto ai tasti un telefono vecchio ANIMATO — parole sue: "una
     cosa retro perche' noi siamo tradizionalmente moderni", che salti
     all'occhio e renda i tasti piu' vivi. La frase e' letteralmente il
     sottotitolo della home ("Cucina contemporanea. Tradizionalmente
     moderna"), quindi il disegno e' coerente col sito, non un vezzo.

     Disegnato in SVG a mano: nessuna immagine da scaricare, pesa nulla,
     e prende il colore dal CSS con `currentColor` come le icone social.
     ⚠️ Niente `data-reveal` qui: nasce da JS (errore gia' pagato).
     ============================================================ */
  var TELEFONO_SVG =
    '<svg class="mono-telefono" viewBox="0 0 152 132" aria-hidden="true" focusable="false">' +
      '<defs>' +
        '<pattern id="monoPuntini" width="8" height="8" patternUnits="userSpaceOnUse">' +
          '<circle cx="4" cy="4" r="1.7" fill="#CBA75A"/>' +
        '</pattern>' +
        '<clipPath id="monoDisco"><circle cx="76" cy="64" r="52"/></clipPath>' +
      '</defs>' +
      /* Saette FUORI dal disco chiaro: sul fondo scuro l'oro pieno si legge
         da solo, mentre un contorno scuro li' sparirebbe. */
      '<g class="mono-telefono__saette" fill="#CBA75A">' +
        '<path d="M22 24 L38 17 L31 31 L43 27 L20 52 L27 34 L14 38 Z"/>' +
        '<path d="M130 22 L146 15 L139 29 L151 25 L128 50 L135 32 L122 36 Z"/>' +
        '<path d="M134 74 L148 69 L143 80 L152 77 L133 98 L139 83 L128 86 Z"/>' +
      '</g>' +
      /* Il disco chiaro a pallini e' quello che rende la cosa POP: senza,
         i contorni scuri sul fondo notturno sparivano e le forme
         galleggiavano (provato e scartato). */
      '<circle cx="76" cy="64" r="52" fill="#EFE3C8"/>' +
      '<g clip-path="url(#monoDisco)">' +
        '<rect x="24" y="12" width="104" height="104" fill="url(#monoPuntini)" opacity="0.85"/>' +
      '</g>' +
      '<g class="mono-telefono__squillo" stroke="#241a14" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round">' +
        '<path d="M44 58 C30 62 30 70 44 74 C58 78 58 86 46 89" fill="none" stroke="#241a14" stroke-width="6.4"/>' +
        '<path d="M44 58 C30 62 30 70 44 74 C58 78 58 86 46 89" fill="none" stroke="#B85C38" stroke-width="3"/>' +
        '<path fill="#B85C38" d="M48 80 H104 C113 80 118 89 118 99 V106 C118 109.5 115.5 112 112 112 H40 C36.5 112 34 109.5 34 106 V99 C34 89 39 80 48 80 Z"/>' +
        '<circle cx="76" cy="97" r="12.5" fill="#F4ECDD"/>' +
        '<circle cx="76" cy="97" r="3.4" fill="#B85C38" stroke="none"/>' +
        '<g class="mono-telefono__cornetta" transform="rotate(-13 76 46)">' +
          '<rect x="50" y="40" width="52" height="12" rx="6" fill="#B85C38"/>' +
          '<ellipse cx="47" cy="46" rx="12" ry="13" fill="#B85C38"/>' +
          '<ellipse cx="105" cy="46" rx="12" ry="13" fill="#B85C38"/>' +
        '</g>' +
        '<g fill="#241a14" stroke="none">' +
          '<circle cx="76" cy="89" r="1.9"/><circle cx="83" cy="92" r="1.9"/>' +
          '<circle cx="84" cy="99.5" r="1.9"/><circle cx="78.5" cy="104.5" r="1.9"/>' +
          '<circle cx="71" cy="104" r="1.9"/><circle cx="67" cy="98" r="1.9"/>' +
          '<circle cx="69" cy="91" r="1.9"/>' +
        '</g>' +
      '</g>' +
    '</svg>';

  function initChiusuraContatti(voci) {
    /* ⚠️ Contrassegno esplicito, non una classe di stile. `.contacts-page
       .contacts-closing` sembrava identificare Contatti, ma quelle classi
       ce l'hanno anche Dove siamo e la pagina Social: il telefono e il
       tasto Social spuntavano anche li' (bug del 28/7, era gia' online). */
    var chiusura = document.querySelector("[data-mono-chiamata]");
    if (!chiusura) return;
    var azioni = chiusura.querySelector(".hero-actions");
    if (!azioni || chiusura.querySelector(".mono-chiamata")) return;

    /* Il telefono e i tasti vanno messi fianco a fianco: serve un
       contenitore. `appendChild` SPOSTA i tasti dentro, non li duplica. */
    var tendina = null;

    if (voci.length) {
      /* 28/7, seconda versione. Prima il tasto apriva e chiudeva il blocco
         qui sotto; il proprietario ha deciso il contrario:
         "voglio che la pagina stia fissa cosi'... non voglio che quando si
         schiaccia social esce cosi'. Quello li' deve rimanere fisso."
         Quindi: il blocco frase+icone e' SEMPRE visibile (niente piu'
         apri/chiudi), e il tasto "Social" e' tornato a essere un LINK, che
         porta alla pagina nuova /social/ con il testo della MONO Family. */
      var tasto = document.createElement("a");
      tasto.className = "button ghost mono-social-tasto";
      tasto.textContent = "Social";
      tasto.href = "../social/";
      tasto.dataset.track = "contacts_final_social";

      tendina = document.createElement("div");
      tendina.className = "mono-social-pannello";

      var frase = document.createElement("p");
      frase.className = "mono-social-pannello__frase";
      frase.textContent = "Scopri le novità e i post attraverso i nostri canali social. Stay tuned.";
      tendina.appendChild(frase);

      var fila = document.createElement("div");
      fila.className = "mono-social mono-social--tendina";
      fila.appendChild(listaSocial(voci, "contatti_fisso"));
      tendina.appendChild(fila);

      azioni.appendChild(tasto);
    }

    /* Il telefono va IN MEZZO ai tasti (28/7): due a sinistra, il telefono,
       due a destra. Quindi il quarto tasto va creato PRIMA di dividerli. */
    var tasti = Array.prototype.slice.call(azioni.children);
    var meta = Math.ceil(tasti.length / 2);

    var riga = document.createElement("div");
    riga.className = "mono-chiamata";
    var sinistra = document.createElement("div");
    sinistra.className = "mono-chiamata__lato";
    var destra = document.createElement("div");
    destra.className = "mono-chiamata__lato";
    var disegno = document.createElement("div");
    disegno.className = "mono-chiamata__disegno";
    disegno.innerHTML = TELEFONO_SVG;

    tasti.forEach(function (t, i) {
      (i < meta ? sinistra : destra).appendChild(t);   // appendChild SPOSTA
    });

    riga.appendChild(sinistra);
    riga.appendChild(disegno);
    riga.appendChild(destra);
    azioni.parentNode.insertBefore(riga, azioni);
    azioni.remove();   // il contenitore originale e' rimasto vuoto

    if (tendina) riga.insertAdjacentElement("afterend", tendina);
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
    // ⚠️ SU TELEFONO SI ALLEGGERISCE (24/7). Gli iPhone hanno schermi a densità
    // 3×: con DPR pieno il canvas a tutta pagina ha ~4× i pixel di un Android e
    // Safari, che già arranca su canvas + "lighter", scalda e scatta. Il tetto
    // a 1,5 dimezza i pixel da dipingere; l'occhio non lo nota su braci sfocate.
    // Il PC resta a 2 (invariato).
    var MOBILE = window.innerWidth < 640;
    var DPR = Math.min(window.devicePixelRatio || 1, MOBILE ? 1.5 : 2);
    var W = 1, H = 1, tick = 0, DEPTH = 1400, FOCAL = 520 * DPR;
    function size() {
      var r = host.getBoundingClientRect();
      W = canvas.width = Math.max(1, Math.round(r.width * DPR));
      H = canvas.height = Math.max(1, Math.round(r.height * DPR));
    }
    size();
    window.addEventListener("resize", size);

    var N = MOBILE ? 66 : 170, pts = [];   // meno scintille sul telefono: su schermo piccolo non si distingue, ma pesa parecchio meno
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
    // Stesso alleggerimento del motore 3D: canvas meno fitto sui telefoni Retina.
    var DPR = Math.min(window.devicePixelRatio || 1, window.innerWidth < 640 ? 1.5 : 2);
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

