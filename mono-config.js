/* ============================================================
   MONO — IMPOSTAZIONI DA COMPLETARE
   Questo è l'UNICO file da toccare per accendere due cose.
   Non serve saper programmare: si incolla il codice fra le
   virgolette "" e si salva. Finché sono vuote, il sito funziona
   lo stesso: semplicemente quelle due cose restano spente.
   ============================================================ */

/* ------------------------------------------------------------
   1) RACCOLTA EMAIL AUTOMATICA  (Formspree — gratis)

   Oggi: quando qualcuno lascia l'email, gli si apre la SUA posta
   già scritta e deve premere invia. Funziona, ma chi non ha voglia
   di premere invia si perde per strada.

   Con questo attivo: l'email si salva DA SOLA e a te arriva la
   notifica. La persona non deve fare nient'altro.

   Come si fa (5 minuti):
     1. vai su  formspree.io  e crea un account gratuito
     2. crea un nuovo form, come destinatario metti
        monobottega@gmail.com
     3. ti danno un indirizzo tipo  https://formspree.io/f/abcdwxyz
     4. incollalo qui sotto fra le virgolette
   ------------------------------------------------------------ */
window.MONO_NEWSLETTER_ENDPOINT = "";

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
window.MONO_CF_TOKEN = "";

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
