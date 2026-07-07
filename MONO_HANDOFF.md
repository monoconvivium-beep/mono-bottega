# PROGETTO MONO - HANDOFF OPERATIVO

## Contesto

- Repo locale: `C:\Users\feder\Documents\New project`
- Repo GitHub: `https://github.com/monoconvivium-beep/mono-bottega`
- Sito online: `https://monoconvivium-beep.github.io/mono-bottega/`
- Versione cache-busting: `https://monoconvivium-beep.github.io/mono-bottega/?v=20260707-table-ritual-v1`

## Stato attuale

Il sito pubblico di MONO Bottega Gastronomica e una digital flagship narrativa. Il sito racconta MONO, crea desiderio e fiducia; l'app resta il motore operativo per ordini, wallet, punti, sconti, inviti, notifiche e ritorno cliente.

MONO Convivium resta centrale: inclusione, formazione e lavoro dignitoso sono parte dell'impresa, non una sezione laterale.

## Ultima evoluzione creativa

E stata introdotta la hero `MONO Table Ritual`:

- scena full-bleed iperrealistica;
- tavola cashmere con luce cinematografica calda;
- piatto con bordo oro, olio, pane madre, burro, grissini, vino rosso, dolce e fumo leggero;
- depth layers CSS, parallax, pointer light, scroll-depth e micro-reveal;
- nessuna libreria 3D pesante;
- fallback statico e reduced motion.

## Asset attivi

Cartella: `assets/mono-table/`

- `mono-table-ritual-desktop.webp` - hero desktop 1920x1080.
- `mono-table-ritual-mobile.webp` - crop mobile 960x1280.
- `mono-table-ritual-og.webp` - immagine social/Open Graph 1200x630.
- `mono-table-ritual-blur.webp` - placeholder leggero.

## File principali

- `index.html` - homepage, hero, storytelling, CTA app, schema SEO.
- `styles.css` - visual system, hero full-bleed, depth layers, responsive.
- `mono-3d.js` - controller tavola, reveal, parallax, pointer light, scroll-depth.
- `app.js` - menu, reveal, prompt app, tracking CTA.
- `service-worker.js` - cache `mono-site-v14`.
- `MONO_AUDIT_REPORT.md` - audit intervento.
- `MONO_TABLE_RITUAL_REPORT.md` - report operativo completo.

## SEO e tracking

Gia presenti:

- canonical;
- Open Graph e Twitter Card con nuovo asset ritual;
- schema `FoodEstablishment`;
- `robots.txt`;
- `sitemap.xml`;
- eventi `mono_cta_click` su CTA principali;
- `dataLayer` e compatibilita `gtag`.

Da completare quando i dati reali sono disponibili:

- dominio custom;
- Google Search Console;
- Google Business Profile;
- indirizzo completo, telefono, orari;
- schema `openingHours`, `telephone`, `geo`, `sameAs`, `menu`;
- foto reali prodotto/bottega.

## Regole di lavoro

- Non installare librerie inutili.
- Prima qualita visiva, mobile e performance.
- La tavola deve essere icona scenografica, non frullatore grafico.
- Il sito non deve duplicare l'app.
- Ogni modifica va verificata e poi pubblicata.

## Prossimi step consigliati

1. Verificare live da telefono e PC:
   `https://monoconvivium-beep.github.io/mono-bottega/?v=20260707-table-ritual-v1`
2. Controllare crop mobile, leggibilita hero, menu e CTA.
3. Pulire i loghi SVG se compare ancora fondo bianco.
4. Inserire dati reali local SEO: indirizzo, telefono, orari.
5. Collegare dominio custom, Search Console e Business Profile.
6. Collegare GA4/Tag Manager agli eventi `mono_cta_click`.
