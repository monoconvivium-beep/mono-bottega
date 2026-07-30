/* ============================================================
   MONO — SERVICE WORKER
   Rifatto il 29/7 (voci 19, 22, 30 e 37 dell'audit).

   ⚠️ DUE COSE DA SAPERE PRIMA DI TOCCARLO

   1) LA SIGLA `?v=` QUI DENTRO DEVE ESSERE LA STESSA DELLE PAGINE.
      Le pagine chiedono `styles.css?v=20260730-mappa-v79`. Per il browser
      quello e' l'indirizzo del file: se qui lo precarico senza la sigla,
      metto in cache un indirizzo che nessuno chiedera' MAI, e il file viene
      scaricato due volte. Dal 29/7 la sigla e' UNA SOLA per tutto il sito
      (prima erano 12 diverse), quindi basta cambiarla in un posto: qui e
      nelle pagine, con la stessa sostituzione.

   2) SI BUMPA `CACHE_NAME` A OGNI PUBBLICAZIONE.
      E' la chiave della dispensa: se non cambia, la roba vecchia resta.
   ============================================================ */
const VERSIONE = "20260730-mappa-v79";
const CACHE_NAME = "mono-site-v178";

/* ------------------------------------------------------------
   COSA SI PRECARICA — e cosa NON si precarica piu'

   PRIMA: 64 file, 1.776.079 byte, scaricati SUBITO mentre la home si stava
   ancora aprendo. Il momento peggiore: la persona aspetta di vedere qualcosa
   e la linea e' gia' occupata. Su 4G lenta erano 8,7 secondi di banda tolti
   alla prima impressione, per pagine che forse non aprira' mai.

   Dentro c'era, di sprecato:
     - 515 kB di loghi che NESSUNA pagina usa (mono-logo-light/mono/champagne,
       mono-loghissimo-light, mono-loghissimo.svg, mono-convivium-light/warm,
       mono-convivium.svg) — verificato uno per uno;
     - le 13 pagine elencate DUE VOLTE, come "./eventi/" e come
       "./eventi/index.html": 71.174 byte scaricati per niente;
     - la stessa identica icona tre volte con tre nomi (icon-192.svg,
       icon-512.svg, mono-favicon.svg: stesso md5), 78.428 byte;
     - il poster mono-03 (51.734 byte), che non compare in nessuna pagina;
     - mono-kitchen-fire-og.jpg, che lo vede solo Facebook.

   ADESSO: solo l'OSSATURA, cioe' quello che serve a QUALUNQUE pagina
   (~150 kB). Le pagine e le immagini entrano in cache DA SOLE mentre la
   persona naviga, senza rubare banda all'inizio.
   ⚠️ Conseguenza voluta: senza rete, una pagina mai visitata non si apre.
   Per un sito vetrina e' il baratto giusto — la prima impressione vale piu'
   della navigazione offline di una pagina che non e' mai stata aperta.
   ------------------------------------------------------------ */
const ASSETS = [
  "./",
  "./404.html",
  "./manifest.webmanifest",

  "./mono-colors.css?v=" + VERSIONE,
  "./styles.css?v=" + VERSIONE,
  "./experience.css?v=" + VERSIONE,
  "./mono-engineering.css?v=" + VERSIONE,
  "./mono-enhance.css?v=" + VERSIONE,
  "./mono-dark-home.css?v=" + VERSIONE,

  "./mono-config.js?v=" + VERSIONE,
  "./mono-enhance.js?v=" + VERSIONE,
  "./mono-experience-config.js?v=" + VERSIONE,
  "./cinematic-assets.js?v=" + VERSIONE,
  "./mono-cinematic.js?v=" + VERSIONE,
  "./mono-navigation.js?v=" + VERSIONE,
  "./mono-signature.js?v=" + VERSIONE,
  "./app.js?v=" + VERSIONE,
  "./experience.js?v=" + VERSIONE,

  /* L'unico logo che le pagine usano davvero (verificato: 15 pagine su 15).
     Gli altri sei colori restano online, ma non li precarica piu' nessuno. */
  "./assets/brand/mono-logo-primary.svg",
  "./icons/mono-favicon.svg?v=20260718-favicon-v2"
];

/* ------------------------------------------------------------
   INSTALLAZIONE — uno per uno, non "tutto o niente" (voce 30)

   PRIMA c'era `cache.addAll(ASSETS)`: se anche UNO SOLO dei 64 file non
   esisteva piu', l'installazione falliva, il service worker non partiva, e
   nessuno se ne accorgeva — nessun errore, nessun avviso, il sito
   semplicemente perdeva la cache. E nell'elenco c'era gia' l'esca: un file
   che nessuna pagina usava piu'.
   Adesso ogni file va per conto suo: quello che manca si salta e si scrive
   in console, il resto entra.
   ------------------------------------------------------------ */
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(
        ASSETS.map((url) =>
          cache.add(url).catch((errore) => {
            console.warn("[MONO SW] saltato (non trovato):", url, errore && errore.message);
          })
        )
      )
    )
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

/* Si mette in dispensa SOLO una risposta buona.
   ⚠️ Prima si metteva in cache qualunque cosa tornasse, ERRORI COMPRESI: una
   pagina 404 poteva restare in cache e continuare a essere servita al posto
   di quella vera. `type === "basic"` esclude le risposte da altri domini
   (i caratteri di Google, la mappa): non sono roba nostra e non le teniamo. */
function daTenere(risposta) {
  return risposta && risposta.ok && risposta.type === "basic";
}

function metti(richiesta, risposta) {
  if (!daTenere(risposta)) return;
  const copia = risposta.clone();
  caches.open(CACHE_NAME).then((cache) => cache.put(richiesta, copia));
}

self.addEventListener("fetch", (event) => {
  const richiesta = event.request;

  if (richiesta.method !== "GET") return;
  /* Le richieste con "range" sono lo streaming dei video: mai intercettarle,
     o il video non parte. */
  if (richiesta.headers.has("range")) return;
  if (richiesta.destination === "video") return;

  const url = new URL(richiesta.url);
  /* Altri domini (caratteri di Google, mappa OpenStreetMap, statistiche):
     lasciati passare senza toccarli. */
  if (url.origin !== self.location.origin) return;

  /* ---- 1) LE PAGINE: prima la rete ----------------------------------
     I testi devono essere sempre freschi: se lui pubblica una correzione
     alle 18, chi apre il sito alle 18:01 la deve vedere. Se la rete non
     c'e', si ripiega sulla copia in cache, e se non c'e' nemmeno quella
     sulla pagina 404 (che e' precaricata apposta). */
  if (richiesta.mode === "navigate") {
    event.respondWith(
      fetch(richiesta)
        .then((risposta) => {
          metti(richiesta, risposta);
          return risposta;
        })
        .catch(() =>
          caches.match(richiesta).then((salvata) => salvata || caches.match("./404.html"))
        )
    );
    return;
  }

  /* ---- 2) I FILE CON LA SIGLA: prima la cache (voce 22) --------------
     Se l'indirizzo contiene `?v=`, quel file NON PUO' cambiare senza che
     cambi anche l'indirizzo: e' il senso della sigla. Quindi chiederlo alla
     rete e' tempo buttato — ed e' esattamente quello che il sito faceva
     prima ("prima la rete, la cache solo se la rete fallisce"), sommato al
     `max-age=600` di GitHub Pages: dopo dieci minuti si riscaricava tutto
     anche avendolo gia' nel telefono.
     Adesso: se c'e' in dispensa si serve al volo, ZERO attesa. Quando la
     sigla cambia, l'indirizzo e' nuovo, non c'e' in cache, e si scarica la
     versione nuova. Il modo giusto di funzionare. */
  if (url.searchParams.has("v")) {
    event.respondWith(
      caches.match(richiesta).then((salvata) => {
        if (salvata) return salvata;
        return fetch(richiesta).then((risposta) => {
          metti(richiesta, risposta);
          return risposta;
        });
      })
    );
    return;
  }

  /* ---- 3) TUTTO IL RESTO (immagini, poster, QR) ----------------------
     Prima la cache perche' non cambiano quasi mai, ma con un aggiornamento
     silenzioso in sottofondo: la prossima volta si vede la versione nuova
     senza che nessuno abbia aspettato. */
  event.respondWith(
    caches.match(richiesta).then((salvata) => {
      const dallaRete = fetch(richiesta)
        .then((risposta) => {
          metti(richiesta, risposta);
          return risposta;
        })
        .catch(() => salvata);
      if (salvata) {
        event.waitUntil(dallaRete.catch(() => {}));
        return salvata;
      }
      return dallaRete;
    })
  );
});
