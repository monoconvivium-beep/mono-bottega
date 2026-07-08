# PROGETTO MONO - HANDOFF OPERATIVO

## Contesto

- Repo locale: `C:\Users\feder\Documents\New project`
- Repo GitHub: `https://github.com/monoconvivium-beep/mono-bottega`
- Sito online: `https://monoconvivium-beep.github.io/mono-bottega/`
- Versione cache-busting: `https://monoconvivium-beep.github.io/mono-bottega/?v=20260708-clean-v1`

## Stato attuale

Il sito pubblico di MONO Bottega Gastronomica è stato semplificato. La nuova
direzione è: meno scenografia raccontata, più chiarezza per il cliente.

La home mostra un'immagine hero forte, ma il testo resta essenziale: gastronomia,
pasticceria, aperitivo, app e MONO Convivium. L'app resta il motore operativo per
ordini, wallet, punti, sconti, inviti, notifiche e ritorno cliente.

MONO Convivium resta centrale: inclusione, formazione e lavoro dignitoso sono
parte dell'impresa, non una sezione laterale.

## Ultima evoluzione

- Rimossa la narrazione lunga sulla tavola.
- Rimossi popup e bottone flottante dell'app.
- Rimossi visual prodotto SVG dalle pagine visibili.
- Riscritti testi home e pagine interne in tono più chiaro, poetico ma commerciale.
- Semplificata l'esperienza mobile.
- Aggiornato cache-busting a `20260708-clean-v1`.
- Aggiornato service worker a `mono-site-v17`.

## Asset attivi

Cartella: `assets/mono-table/`

- `mono-table-ritual-desktop.webp` - hero desktop.
- `mono-table-ritual-mobile.webp` - crop mobile.
- `mono-table-ritual-og.webp` - immagine social/Open Graph.
- `mono-table-ritual-blur.webp` - placeholder leggero.

## File principali

- `index.html` - homepage, hero, prodotti, Convivium, app, CTA e schema SEO.
- `styles.css` - visual system, hero full-bleed, responsive e layout.
- `app.js` - menu, reveal, tracking CTA, link app e GA4/GTM-ready.
- `service-worker.js` - cache `mono-site-v17`.
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

- dominio custom;
- Google Search Console;
- Google Business Profile;
- indirizzo completo, telefono, orari;
- schema `openingHours`, `telephone`, `geo`, `sameAs`, `menu`;
- foto reali prodotto/bottega.

## Regole di lavoro

- Non installare librerie inutili.
- Prima qualità visiva, mobile e performance.
- Less is more: il sito informa, non deve confondere.
- Il sito non deve duplicare l'app.
- Ogni modifica va verificata e poi pubblicata.

## Prossimi step consigliati

1. Verificare live da telefono e PC:
   `https://monoconvivium-beep.github.io/mono-bottega/?v=20260708-clean-v1`
2. Controllare crop mobile, leggibilità hero, menu e CTA.
3. Verificare colori logo su telefono e PC.
4. Inserire dati reali local SEO: indirizzo, telefono, orari.
5. Collegare dominio custom, Search Console e Business Profile.
6. Collegare GA4/Tag Manager agli eventi `mono_cta_click`.
