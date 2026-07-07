# MONO Table Ritual - Report operativo

Data: 7 luglio 2026

## Direzione creativa

MONO deve sembrare una digital flagship gastronomica, non un sito vetrina. La hero diventa un rituale editoriale: tavola full-bleed, luce calda, materia vera, profondità CSS e copy sovrapposto. Il sito racconta desiderio, fiducia e posizionamento; l'app resta il luogo operativo per ordini, wallet, punti, sconti, inviti e ritorno cliente.

## Audit visivo

- Punto forte: nuovo asset iperrealistico con piatto centrale, pane, olio, vino, grissini, dolce, lino e riflessi oro.
- Punto forte: crop mobile dedicato con piatto e pane leggibili, senza dipendere dal desktop.
- Correzione fatta: hero da card visuale a scena full-bleed con overlay narrativo.
- Correzione fatta: rimosso effetto "debug" delle etichette visive sulla tavola.
- Rischio residuo: il logo SVG va ancora verificato su device reale se compare fondo bianco.

## Asset prodotti

- `assets/mono-table/mono-table-ritual-desktop.webp` - 1920x1080, circa 225 KB.
- `assets/mono-table/mono-table-ritual-mobile.webp` - 960x1280, circa 93 KB.
- `assets/mono-table/mono-table-ritual-og.webp` - 1200x630, circa 116 KB.
- `assets/mono-table/mono-table-ritual-blur.webp` - micro placeholder.

## Modifiche tecniche

- `index.html` usa il nuovo OG image, preload desktop/mobile e hero `MONO Table Ritual`.
- `styles.css` gestisce hero full-bleed, overlay, clip mask, parallax, fumo e responsive mobile.
- `mono-3d.js` gestisce sequenza, pointer light, reset pointer e scroll-depth.
- `app.js` invia eventi `mono_cta_click` a `dataLayer` e `gtag` quando presente.
- `service-worker.js` aggiorna cache a `mono-site-v16`.
- `assets/brand/mono-logo-light.svg` corregge la resa logo hero senza filtro tutto bianco.
- `assets/brand/mono-convivium-primary.svg` riallinea Convivium alla palette MONO.
- Le pagine interne sono state bonificate da sequenze UTF-8 interpretate male negli accenti italiani.
- `assets/product-visuals/` introduce visual editoriali 3D-like per famiglie prodotto.

## SEO e local

- Prossimo dato necessario: indirizzo completo, telefono, orari e link social ufficiali.
- Dopo il dominio custom: aggiungere Google Search Console e inviare `sitemap.xml`.
- Dopo apertura/scheda: completare Google Business Profile con foto reali, categorie, prodotti e post.
- Estendere schema con `telephone`, `openingHours`, `geo`, `sameAs`, `menu` quando disponibili.

## Tracking CTA

Eventi predisposti:

- `header_app`
- `hero_enter_project`
- `hero_open_app`
- `table_story_app`
- `convivium_feature_open`
- `app_gateway_download`
- `app_gateway_contacts`
- `contact_strip_contacts`
- `contact_strip_app`
- `prompt_open_app`
- `prompt_wallet`

## Checklist QA

- Desktop 1440px: H1 leggibile, CTA non sovrapposte, tavola non troppo scura.
- Mobile 390px: crop hero centrato, testo non invade piatto, pannello sequenza nascosto.
- Performance: asset hero sotto 250 KB, nessuna libreria 3D caricata.
- Accessibilità: reduced motion rispettato, CTA raggiungibili, menu mobile funzionante.
- Pubblicazione: commit, push, deploy GitHub Pages, verifica live con cache-busting `?v=20260707-flagship-final-v1`.
