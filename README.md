# MONO Bottega Gastronomica

Sito statico per MONO Bottega Gastronomica.

Il sito deve orientare il cliente con chiarezza: gastronomia, pasticceria,
aperitivo, catering, MONO Convivium e app. L'app resta il motore operativo per
ordini, wallet, punti, sconti, notifiche, inviti e ritorno cliente.

## Sito Online

- GitHub Pages: `https://monoconvivium-beep.github.io/mono-bottega/`
- Versione cache-busting: `?v=20260710-local-v1`
- Service worker: `mono-site-v21`

## Esperienza Visuale

La home usa una hero video full-bleed: cucina scura, fuoco, pentola in rame,
fumo e logo MONO reale sovrapposto dal sito. La priorità è leggibilità,
velocità e mobile: video forte, messaggio semplice, CTA evidenti.

Su desktop è attiva una luce calda che segue il cursore. L'effetto è disattivato
su touch e con `prefers-reduced-motion`.

I testi sono stati riallineati a una voce più MONO: concreta, calda, sintetica,
con un equilibrio tra desiderio e informazioni utili.

## Dati Locali

- Indirizzo: `Via Barletta 72D, Torino`
- Orari: martedì-sabato `10:30-14:30` e `18:00-22:30`; domenica `9:00-14:00`; lunedì chiuso.
- Info e preventivi: `monobottega@gmail.com`
- MONO Convivium: `monoconvivium@gmail.com`
- Telefono: da inserire appena disponibile.

Non sono installate librerie 3D pesanti. Three.js o `model-viewer` vanno valutati
solo con GLB reali, compressi e caricati dopo LCP.

## Asset Principali

- `assets/hero/mono-kitchen-fire-desktop.mp4`
- `assets/hero/mono-kitchen-fire-poster.jpg`
- `assets/hero/mono-kitchen-fire-og.jpg`
- `assets/mono-table/mono-table-ritual-desktop.webp`
- `assets/mono-table/mono-table-ritual-mobile.webp`
- `assets/mono-table/mono-table-ritual-og.webp`
- `assets/brand/` per il sistema logo operativo.
- `icons/` per icone PWA MONO.

## Brand System

Varianti logo operative:

- `assets/brand/mono-logo-primary.svg`
- `assets/brand/mono-logo-light.svg`
- `assets/brand/mono-logo-mono.svg`
- `assets/brand/mono-logo-champagne.svg`
- `assets/brand/mono-convivium-primary.svg`
- `assets/brand/mono-convivium-light.svg`

Gli SVG originali in root restano come sorgente storica.

## Tracking

`app.js` invia eventi `mono_cta_click` a `dataLayer` e, se configurato, a
GA4/GTM. Non carica script esterni finché gli ID restano vuoti.

Per attivare analytics reali, impostare in pagina prima di `app.js`:

```html
<script>
  window.MONO_ANALYTICS_CONFIG = {
    ga4MeasurementId: "G-XXXXXXX",
    gtmContainerId: "GTM-XXXXXXX"
  };
</script>
```

## SEO Locale

Già presenti:

- canonical;
- Open Graph e Twitter Card;
- schema `FoodEstablishment`;
- `robots.txt`;
- `sitemap.xml`.

Da completare solo con dati reali:

- indirizzo completo;
- telefono;
- orari;
- link social;
- Google Search Console;
- Google Business Profile;
- schema `openingHours`, `telephone`, `geo`, `sameAs`, `menu`.

## Come Provarlo In Locale

Aprire da piccolo server locale, non direttamente da file:

```bash
python -m http.server 4173 --bind 127.0.0.1
```

Poi visitare `http://127.0.0.1:4173/`.

## Pubblicazione

Il repository è pubblicato su GitHub Pages dal branch principale.

Flusso operativo:

```bash
git add .
git commit -m "Simplify MONO site experience"
git push
```

## Palette MONO

- Cashmere: `#F4ECDD`
- Warm Butter: `#EFE3C6`
- Terracotta: `#B85C38`
- Coral: `#E27A60`
- Burnt Olive: `#6E6A3C`
- Champagne: `#CBA75A`
- Anthracite: `#262321`
