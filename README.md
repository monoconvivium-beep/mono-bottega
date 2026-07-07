# MONO Bottega Gastronomica

Digital flagship statica per MONO Bottega Gastronomica.

Il sito racconta MONO, costruisce desiderio e fiducia, presenta gastronomia,
pasticceria, aperitivo, catering e MONO Convivium. L'app resta il motore
operativo per ordini, wallet, punti, sconti, notifiche, inviti e ritorno cliente.

## Sito Online

- GitHub Pages: `https://monoconvivium-beep.github.io/mono-bottega/`
- Versione cache-busting: `?v=20260707-flagship-final-v1`
- Service worker: `mono-site-v16`

## Esperienza Visuale

La home usa `MONO Table Ritual`: una hero full-bleed iperrealistica con asset
WebP, CSS 3D, parallax leggero, fumo, luce cinematografica e micro-reveal.

Non sono installate librerie 3D pesanti. Three.js o `model-viewer` vanno valutati
solo con GLB reali, compressi e caricati dopo LCP.

## Asset Principali

- `assets/mono-table/mono-table-ritual-desktop.webp`
- `assets/mono-table/mono-table-ritual-mobile.webp`
- `assets/mono-table/mono-table-ritual-og.webp`
- `assets/brand/` per il sistema logo operativo.
- `assets/product-visuals/` per visual prodotto 3D-like leggeri.
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

`app.js` invia eventi `mono_cta_click` a `dataLayer` e, se configurato,
a GA4/GTM.

Per attivare analytics reali, impostare in pagina prima di `app.js`:

```html
<script>
  window.MONO_ANALYTICS_CONFIG = {
    ga4MeasurementId: "G-XXXXXXX",
    gtmContainerId: "GTM-XXXXXXX"
  };
</script>
```

Lasciare vuoti gli ID evita caricamenti esterni.

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
git commit -m "Build MONO flagship final polish"
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
