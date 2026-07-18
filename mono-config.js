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
   2) STATISTICHE DEL SITO  (Google Analytics 4 — gratis)

   Il tracciamento è GIÀ scritto dentro il sito (quali bottoni si
   premono, quali pagine si guardano): manca solo il codice che
   collega tutto al tuo account.

   Come si fa (5 minuti):
     1. vai su  analytics.google.com  con l'account Google di MONO
     2. crea una proprietà per monobottega.it
     3. ti danno un codice che inizia con  G-  (es. G-AB12CD34EF)
     4. incollalo qui sotto fra le virgolette

   ⚠️ NOTA IMPORTANTE: Analytics usa i cookie e in Italia i cookie
   di statistica richiedono il banner di consenso. Prima di
   accendere questo, parlane con me: ti preparo il banner oppure
   ti propongo un'alternativa senza cookie (niente banner).
   ------------------------------------------------------------ */
window.MONO_GA4_ID = "";


/* ============================================================
   Da qui in giù non serve toccare niente.
   ============================================================ */
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
