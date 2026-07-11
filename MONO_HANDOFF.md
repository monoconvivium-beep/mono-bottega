# PROGETTO MONO - HANDOFF OPERATIVO

## Contesto

- Repo locale: `C:\Users\feder\Documents\New project`
- Repo GitHub: `https://github.com/monoconvivium-beep/mono-bottega`
- Sito online: `https://monobottega.it/`
- GitHub Pages tecnico: `https://monoconvivium-beep.github.io/mono-bottega/`
- Versione cache-busting: `https://monobottega.it/?v=20260711-seo-local-v1`

## Stato attuale

Il sito pubblico di MONO Bottega Gastronomica è stato semplificato. La nuova
direzione è: meno scenografia raccontata, più chiarezza per il cliente.

La home mostra un'immagine hero forte, ma il testo resta essenziale: gastronomia,
pasticceria, aperitivo, app e MONO Convivium. L'app resta il motore operativo per
ordini, wallet, punti, sconti, inviti, notifiche e ritorno cliente.

MONO Convivium resta centrale: inclusione, formazione e lavoro dignitoso sono
parte dell'impresa, non una sezione laterale.

## Ultima evoluzione

- Sostituita la vecchia hero statica con una hero video minimal: cucina scura, fuoco, pentola in rame e fumo.
- Il logo non è generato nel video: resta sovrapposto dal sito con SVG reale.
- Aggiunta luce calda al cursore su desktop, disattivata su touch e reduced motion.
- Migliorati i testi di home, prodotti, app, contatti, bottega e Convivium con tono più caldo, premium e commerciale.
- Inseriti dati locali: Via Barletta 72D, orari, email, mappa Google e candidature.
- Sostituita l'immagine Open Graph con il frame hero video in `assets/hero/mono-kitchen-fire-og.jpg`.
- Rimossa la narrazione lunga sulla tavola.
- Rimossi popup e bottone flottante dell'app.
- Rimossi visual prodotto SVG dalle pagine visibili.
- Riscritti testi home e pagine interne in tono più chiaro, poetico ma commerciale.
- Semplificata l'esperienza mobile.
- Aggiornato dominio ufficiale a `monobottega.it` con file `CNAME`.
- Rafforzato SEO locale per `gastronomia Torino`, `bottega gastronomica Torino`, `Santa Rita`, `Via Barletta 72D`.
- Aggiunto schema `LocalBusiness`, FAQ schema e sezione FAQ visibile in homepage.
- Aggiornato cache-busting a `20260711-seo-local-v1`.
- Aggiornato service worker a `mono-site-v28`.
- Aggiunte le pagine `eventi/` e `lavora-con-noi/`.
- Incorporato il PDF MONO Convivium direttamente nella pagina Convivium.

## Asset attivi

Cartella: `assets/mono-table/`

- `mono-table-ritual-desktop.webp` - hero desktop.
- `mono-table-ritual-mobile.webp` - crop mobile.
- `mono-table-ritual-og.webp` - immagine social/Open Graph.
- `mono-table-ritual-blur.webp` - placeholder leggero.

Cartella: `assets/hero/`

- `mono-kitchen-fire-desktop.mp4` - hero video 16:9.
- `mono-kitchen-fire-poster.jpg` - poster/fallback hero.
- `mono-kitchen-fire-og.jpg` - immagine social/Open Graph.

## File principali

- `index.html` - homepage, hero, prodotti, Convivium, app, CTA e schema SEO.
- `styles.css` - visual system, hero full-bleed, responsive e layout.
- `app.js` - menu, reveal, tracking CTA, link app e GA4/GTM-ready.
- `service-worker.js` - cache `mono-site-v28`.
- `README.md` - istruzioni operative aggiornate.

## SEO e tracking

Già presenti:

- canonical;
- Open Graph e Twitter Card;
- schema `FoodEstablishment`;
- `robots.txt`;
- `sitemap.xml`;
- eventi `mono_cta_click` su CTA principali;
- `dataLayer`, compatibilità `gtag`, predisposizione GA4/GTM;
- sistema logo operativo in `assets/brand/`.

Da completare quando i dati reali sono disponibili:

- Google Search Console;
- Google Business Profile;
- telefono pubblico;
- schema `telephone`, `geo`, `sameAs`;
- foto reali prodotto/bottega.

## Regole di lavoro

- Non installare librerie inutili.
- Prima qualità visiva, mobile e performance.
- Less is more: il sito informa, non deve confondere.
- Il sito non deve duplicare l'app.
- Ogni modifica va verificata e poi pubblicata.

## Prossimi step consigliati

1. Inserire i record DNS del dominio presso il registrar.
2. Verificare live da telefono e PC:
   `https://monobottega.it/?v=20260711-seo-local-v1`
3. Controllare crop mobile, leggibilità hero, menu e CTA.
4. Verificare colori logo su telefono e PC.
5. Inserire telefono pubblico appena disponibile.
6. Collegare Search Console, Business Profile e GA4/Tag Manager.
