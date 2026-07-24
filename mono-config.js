/* ============================================================
   MONO — IMPOSTAZIONI DA COMPLETARE
   Questo è l'UNICO file da toccare per accendere due cose.
   Non serve saper programmare: si incolla il codice fra le
   virgolette "" e si salva. Finché sono vuote, il sito funziona
   lo stesso: semplicemente quelle due cose restano spente.
   ============================================================ */

/* ------------------------------------------------------------
   1) FORMSPREE — 🔌 NON SERVE PIU', lasciare vuoto

   ⚠️ Superato dal 24/7: la raccolta email ora la fa l'APP (vedi
   1-BIS qui sotto), che non ha tetti mensili e tiene i dati in casa.
   Questa casella resta solo come terza scorta: NON riempirla senza
   parlarne, o si finirebbe con le iscrizioni in due posti diversi.

   Come si fa (5 minuti):
     1. vai su  formspree.io  e crea un account gratuito
     2. crea un nuovo form, come destinatario metti
        monobottega@gmail.com
     3. ti danno un indirizzo tipo  https://formspree.io/f/abcdwxyz
     4. incollalo qui sotto fra le virgolette
   ------------------------------------------------------------ */
window.MONO_NEWSLETTER_ENDPOINT = "";

/* ------------------------------------------------------------
   1-BIS) ⭐⭐ APP MONO — QUESTA E' LA STRADA ATTIVA (dal 24/7)

   Le iscrizioni "Avvisami all'apertura" entrano DIRETTAMENTE nell'app
   (app.monobottega.it), dentro il CRM, come contatti con consenso
   marketing. Nessun servizio esterno, nessun tetto, nessun account
   in piu': i dati sono tuoi e stanno dove stanno tutti gli altri.

   Dove le ritrovi:
     - Admin  > "Lista apertura"  = elenco completo + Scarica CSV
     - Counter> "Lista apertura"  = SOLO il numero, mai le email
       (al banco serve sapere che e' arrivata roba da segnalarti)

   Se un giorno vuoi spegnerla: si spegne dal lato APP, mettendo
   LISTA_APERTURA_ENABLED = false in lib/flags.ts. Il sito se ne
   accorge da solo e ripiega sulla mail: non si perde nessuno.
   ------------------------------------------------------------ */
window.MONO_APP_WAITLIST_ENDPOINT = "https://app.monobottega.it/api/waitlist";

/* ------------------------------------------------------------
   1-TER) MODULO GOOGLE — 🔌 SCORTA, OGGI SPENTA
   Preparato e provato il 24/7, poi messo da parte: Google vive
   FUORI dall'app, quindi i dipendenti avrebbero dovuto aprire un
   link esterno con un altro account, e l'app non poteva essere
   avvisata delle nuove iscrizioni. L'app fa tutto meglio.

   Il modulo esiste ancora ed e' valido. Per riaccenderlo (solo se
   un giorno l'app non fosse disponibile) rimetti i due valori:
     ACTION: https://docs.google.com/forms/d/e/1FAIpQLSeVmJIhfb13X6
             s9Uze1z7sra4oQc5FeIB3LC74j7TCFSQ3LpQ/formResponse
     FIELD:  entry.570361845
   Modulo "LISTA EVENTI MONO", proprietario federicopasciucco1989@
   gmail.com. Verificato con un invio vero il 24/7.

   ⚠️ Sotto restano VUOTI di proposito: vuoti = spento.
   Nota storica: il modulo Google era stato scelto al posto di
   Formspree perche' Formspree gratis si ferma a 50 email al mese.
   Poi e' arrivata la strada dell'app, che le batte entrambe.

   ⚠️ SE UN GIORNO LO RIACCENDI e rifai il modulo da capo, servono
   due cose nuove: l'indirizzo (finisce sempre in /formResponse,
   NON in /viewform) e il numero del campo, diverso per ogni modulo.
   E "Visualizzazione intervistato" DEVE stare su "Chiunque abbia il
   link", altrimenti Google chiede il login e non si iscrive nessuno.
   ------------------------------------------------------------ */
window.MONO_GFORM_ACTION = "";
window.MONO_GFORM_FIELD = "";

/* ------------------------------------------------------------
   2) STATISTICHE DEL SITO — SCEGLI UNA DELLE DUE

   ⭐ CONSIGLIATA: 2A — statistiche SENZA COOKIE (niente banner)
   ------------------------------------------------------------

   2A) CLOUDFLARE WEB ANALYTICS  (gratis, senza cookie)

   Ti dice: quante visite, da dove arrivano, quali pagine guardano,
   quanto ci mette a caricare. Non usa cookie e non segue le persone
   fuori dal sito: per legge NON serve il banner di consenso.

   Come si fa (5 minuti):
     1. vai su  dash.cloudflare.com  e crea un account gratuito
     2. nel menu scegli  Analytics & Logs  >  Web Analytics
     3. premi "Add a site" e scrivi  monobottega.it
     4. ti danno un "token" (una sequenza di lettere e numeri)
     5. incollalo qui sotto fra le virgolette
   ------------------------------------------------------------ */
window.MONO_CF_TOKEN = "49cdcc2e80cf458db73629f60acd9a34";

/* ------------------------------------------------------------
   2B) GOOGLE ANALYTICS 4  (gratis, ma CON cookie)

   Più dettagliato del precedente (percorsi, conversioni, pubblico).
   Il tracciamento dei bottoni è GIÀ scritto dentro il sito: manca
   solo il codice che collega tutto al tuo account.

   ⚠️ ATTENZIONE: usa i cookie e in Italia i cookie di statistica
   richiedono il BANNER DI CONSENSO. Se accendi questo senza banner
   sei fuori norma. Parlane con me prima: ti preparo il banner.

   Come si fa:
     1. vai su  analytics.google.com  con l'account Google di MONO
     2. crea una proprietà per monobottega.it
     3. ti danno un codice che inizia con  G-  (es. G-AB12CD34EF)
     4. incollalo qui sotto fra le virgolette
   ------------------------------------------------------------ */
window.MONO_GA4_ID = "";


/* ============================================================
   Da qui in giù non serve toccare niente.
   ============================================================ */
/* 2A — Cloudflare Web Analytics (senza cookie) */
(function () {
  var token = window.MONO_CF_TOKEN;
  if (!token || !/^[a-z0-9]{16,}$/i.test(token)) return; // spento finché non c'è il token
  var s = document.createElement("script");
  s.defer = true;
  s.src = "https://static.cloudflareinsights.com/beacon.min.js";
  s.setAttribute("data-cf-beacon", JSON.stringify({ token: token }));
  document.head.appendChild(s);
})();

/* 2B — Google Analytics 4 (con cookie: serve il banner) */
(function () {
  var id = window.MONO_GA4_ID;
  if (!id || !/^G-[A-Z0-9]+$/i.test(id)) return; // spento finché non c'è il codice

  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", id, { anonymize_ip: true });
})();
