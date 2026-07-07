# MONO - Audit intervento MONO Table Ritual

Data: 7 luglio 2026

## Problemi rilevati

- La hero precedente era credibile, ma ancora percepita come visual incorniciato invece che come flagship immersiva.
- La tavola aveva profondità simulata, ma il primo viewport non era ancora abbastanza scenografico per un posizionamento premium.
- I riferimenti Open Graph e service worker puntavano ancora agli asset cinematic precedenti.
- Mancava un tracciamento CTA strutturato per app, wallet, contatti e Convivium.

## Correzioni applicate

- Generata una nuova immagine hero iperrealistica MONO Table Ritual:
  - `assets/mono-table/mono-table-ritual-desktop.webp`
  - `assets/mono-table/mono-table-ritual-mobile.webp`
  - `assets/mono-table/mono-table-ritual-og.webp`
  - `assets/mono-table/mono-table-ritual-blur.webp`
- Trasformata la hero in esperienza full-bleed con testo sovrapposto, luce cinematografica e fallback statico.
- Riallineati i layer CSS della tavola su piatto oro, grissini, olio, pane madre, burro, vino, dolce, fumo e luce.
- Aggiornato `mono-3d.js` con micro-reveal, pointer light, reset su pointerleave e scroll-depth.
- Aggiunti eventi tracking `mono_cta_click` pronti per `dataLayer` e GA4/gtag.
- Aggiornato cache-busting a `20260707-flagship-final-v1`.
- Aggiornato service worker a `mono-site-v16`.
- Aggiunte varianti logo corrette:
  - `assets/brand/mono-logo-primary.svg`
  - `assets/brand/mono-logo-light.svg`
  - `assets/brand/mono-convivium-primary.svg`
- Bonificati gli accenti rotti nelle pagine interne e nelle meta description.
- Aggiunti visual prodotto 3D-like e tilt interattivo leggero.

## Verifiche da eseguire

- Desktop: impatto hero full-bleed, leggibilità H1, CTA e sequenza tavola.
- Mobile: crop verticale, posizione testo, assenza sovrapposizioni e fluidità scroll.
- SEO: canonical, Open Graph, Twitter Card, schema `FoodEstablishment`, `robots.txt`, `sitemap.xml`.
- CTA app: verifica eventi su header, hero, app gateway, prompt wallet, contatti e Convivium.

## Nota tecnica

La nuova esperienza resta senza librerie pesanti: usa WebP ottimizzati, CSS 3D, clip mask, luce interattiva e reveal progressivo. Three.js o `model-viewer` vanno introdotti solo quando esistono GLB reali, compressi e coerenti con MONO.
