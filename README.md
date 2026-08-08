# MONO Bottega Gastronomica

Sito statico per MONO Bottega Gastronomica.

Il sito deve orientare il cliente con chiarezza: gastronomia, pasticceria,
aperitivo, catering, MONO Convivium e app. L'app resta il motore operativo per
ordini, wallet, punti, sconti, notifiche, inviti e ritorno cliente.

## Sito Online

- Dominio ufficiale: `https://monobottega.it/`
- GitHub Pages tecnico: `https://monoconvivium-beep.github.io/mono-bottega/`
- Versione cache-busting: `?v=20260712-opening-app-v1`
- Favicon browser: `?v=20260712-plate-icon-v1`
- Service worker: `mono-site-v37`

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

- `assets/hero/mono-kitchen-fire-og.jpg` — l'anteprima social di tutte le pagine.
- `assets/cinematic/web/mono-01-fuoco-ravioli-poster.webp` — il fotogramma
  fermo che si vede per primo sulla home. ⚠️ **E' l'elemento piu' grande
  della pagina**, cioe' quello su cui Google misura il punteggio: lo dicono
  i dati veri dei visitatori (Cloudflare, vista «Elemento»). Per questo e'
  lui, e non altro, ad avere il `preload` con priorita' alta in `index.html`.
- `assets/mono-table/mono-table-ritual-desktop.webp`
- `assets/mono-table/mono-table-ritual-mobile.webp`
- `assets/cinematic/` — i film veri della home e delle interne, elencati uno per
  uno in `cinematic-assets.js`. Il README della cartella li descrive.
- `assets/fonts/` — i caratteri, dal 30/7 ospitati in casa (vedi `mono-fonts.css`).
- `assets/brand/` per il sistema logo operativo.
- `icons/` per icone PWA MONO.

⚠️ **30/7 — questo elenco era in parte falso** e mi ha fatto credere vivi due
video da 4,7 MB: `mono-kitchen-fire-desktop.mp4` e `mono-table-ritual-og.webp`
erano citati qui e in nessun altro posto. Citare un file in un documento non lo
rende usato: la hero della home passa dal sistema cinematografico, e l'attributo
`data-hero-video` che il vecchio codice cercava non esiste in nessuna pagina.
Tolti insieme agli altri file morti.

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
- schema `FoodEstablishment` + `LocalBusiness`;
- FAQ schema in homepage;
- sezione locale visibile per `gastronomia Torino`, `bottega gastronomica Torino`, `Santa Rita` e `Via Barletta 72D`;
- `robots.txt`;
- `sitemap.xml`.

Da completare solo con dati reali:

- telefono;
- link social;
- Google Search Console;
- Google Business Profile;
- schema `telephone`, `geo` e `sameAs`.

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
git add <i file che hai toccato>     # MAI "git add ." ne' "git add -u"
git diff --cached --name-only        # controlla SEMPRE cosa stai per mandare
git commit -m "..."
git push
```

> ⚠️ **Mai `git add .` e mai `git add -u`.**
> In questa cartella vivono anche progetti che col sito non c'entrano
> (ceo-engine, mono-custode, conto-casa, social-studio) e i documenti di
> lavoro. Un `git add .` li manderebbe tutti online in un colpo solo.
> `.gitignore` fa da rete, ma la rete non e' il metodo: elenca i file.
> In piu' su questo repo lavorano piu' sessioni in parallelo: `git add -u`
> rastrella anche le modifiche di qualcun altro, mezze fatte.

## Palette MONO

- Cashmere: `#F4ECDD`
- Warm Butter: `#EFE3C6`
- Terracotta: `#B85C38`
- Coral: `#E27A60`
- Burnt Olive: `#6E6A3C`
- Champagne: `#CBA75A`
- Anthracite: `#262321`
