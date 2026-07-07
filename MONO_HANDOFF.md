# PROGETTO MONO — HANDOFF NUOVO PROGETTO

## Contesto

Stiamo sviluppando il sito pubblico di MONO Bottega Gastronomica su GitHub Pages.

- Repo locale: `C:\Users\feder\Documents\New project`
- Repo GitHub: `https://github.com/monoconvivium-beep/mono-bottega`
- Sito online: `https://monoconvivium-beep.github.io/mono-bottega/`
- Link cache-busting ultima versione: `https://monoconvivium-beep.github.io/mono-bottega/?v=20260707-cinematic-3d-v1`
- Ultimo commit pubblicato: `9b8fcd0 — Build MONO cinematic 3D experience`
- Deploy GitHub Pages verificato: `success`

## Stato attuale

Il sito è online e pubblicato. La versione attuale è una landing/mini-sito premium per raccontare MONO come bottega gastronomica contemporanea, con rimando all'app per ordini, wallet, vantaggi e fedeltà.

La direzione strategica fissata è:

- Il sito non deve copiare l'app.
- Il sito deve fare storytelling, posizionamento, fiducia, racconto del progetto.
- L'app deve gestire vendita, ordini, wallet, punti, sconti, inviti, notifiche e ritorno del cliente.
- MONO Convivium deve restare parte centrale del progetto, non sezione laterale.

## Ultima evoluzione creativa

È stata creata una nuova hero “cinematic 3D” con tavola iperrealistica:

- tovaglia cashmere/bianca;
- piatti classici con bordo oro;
- olio;
- piattino con olio;
- pane madre;
- burro;
- grissini;
- vino rosso;
- dolce;
- fumo/atmosfera teatrale;
- palette cashmere, terracotta, champagne oro, antracite e accenti verde oliva bruciato.

Non sono state installate librerie 3D pesanti. La scena usa un master visual iperrealistico e livelli CSS mascherati con parallax, luce e reveal progressivo. È una scelta deliberata: alta resa visiva, performance mobile e nessun “frullatore grafico”.

## Asset attivi

Cartella: `assets/mono-table/`

- `mono-table-cinematic-3d.webp` — master desktop della tavola.
- `mono-table-cinematic-mobile.webp` — crop mobile.
- `mono-og-image.webp` — immagine social/Open Graph.
- `README.md` — note sugli asset.

Gli asset tavola vecchi sono stati rimossi dal repo e dalla cache.

## File principali

- `index.html:27` — preload asset hero cinematic.
- `index.html:32` — schema SEO `FoodEstablishment`.
- `index.html:99` — hero tavola cinematic desktop/mobile.
- `index.html:104` — livelli reveal della tavola.
- `index.html:341` — motivi per scaricare l'app.
- `styles.css:987` — motore visuale tavola cinematic 3D.
- `styles.css:1035` — layer/maschere della tavola.
- `styles.css:1332` — asset mobile della tavola.
- `mono-3d.js:1` — controller esperienza tavola.
- `app.js:116` — prompt app ritardato alla sezione app.
- `service-worker.js:1` — cache `mono-site-v13`.
- `robots.txt:1` — robots SEO.
- `sitemap.xml:1` — sitemap.

## Palette attuale

- Cashmere: `#F4ECDD`
- Warm Butter: `#EFE3C6`
- Terracotta: `#B85C38`
- Coral: `#E27A60`
- Burnt Olive: `#6E6A3C`
- Champagne: `#CBA75A`
- Anthracite: `#262321`

## Struttura sito

Pagine pubbliche:

- Home: `index.html`
- La Bottega: `la-bottega/index.html`
- Gastronomia: `gastronomia/index.html`
- Pasticceria: `pasticceria/index.html`
- Aperitivo: `aperitivo/index.html`
- Catering: `catering/index.html`
- MONO Convivium: `mono-convivium/index.html`
- App: `app/index.html`
- Contatti: `contatti/index.html`

## SEO già fatto

- Canonical sulle pagine principali.
- Open Graph image.
- Twitter Card.
- Schema `FoodEstablishment` in home.
- `robots.txt`.
- `sitemap.xml`.
- Service worker aggiornato.

## Validazioni già fatte

- GitHub Pages deploy `success`.
- Home live HTTP `200`.
- Asset hero desktop/mobile/OG live HTTP `200`.
- `service-worker.js` live HTTP `200`.
- `robots.txt` live HTTP `200`.
- `sitemap.xml` live HTTP `200`.
- Marker online confermati:
  - `20260707-cinematic-3d-v1`;
  - `mono-table-cinematic-3d.webp`;
  - `FoodEstablishment`;
  - `mono-site-v13`.
- Asset vecchi non presenti nella home e non presenti nel service worker.
- Controlli locali:
  - `node --check app.js`;
  - `node --check mono-3d.js`;
  - `node --check service-worker.js`;
  - `git diff --check`;
  - link interni risolti;
  - asset CSS/service worker risolti;
  - nessun mojibake comune nei file pubblici.

Nota: il browser integrato Codex non è riuscito a visualizzare `localhost` e ha bloccato `file://`; quindi la verifica visuale finale live va fatta manualmente da telefono/PC aprendo il link pubblico.

## Problemi/attenzioni

- La hero è molto più forte, ma resta basata su immagini/layer CSS, non su veri modelli GLB/WebGL.
- I loghi SVG sono trasparenti lato CSS, ma se si vede ancora un “fondo bianco” potrebbe essere parte del file SVG esportato da Inkscape e va pulito direttamente nel vettoriale.
- Le pagine prodotto sono state arricchite, ma possono diventare ancora più editoriali con foto reali, menu, esempi prodotto e tono più concreto.
- La posizione reale/indirizzo definitivo non è ancora fissata nel sito: Contatti usa Santa Rita/Torino come area.

## Prossimi step consigliati

1. Verificare manualmente il sito da telefono e PC:
   - `https://monoconvivium-beep.github.io/mono-bottega/?v=20260707-cinematic-3d-v1`
2. Se la hero non è ancora abbastanza “wow”, creare asset separati veri:
   - piatti;
   - pane;
   - olio;
   - vino;
   - dolce;
   - grissini;
   - fumo;
   - ombre.
3. Pulire/esportare i loghi SVG in modo definitivo, senza page background Inkscape.
4. Inserire foto reali prodotti quando disponibili.
5. Rafforzare pagine prodotto con contenuti concreti:
   - cosa si ordina;
   - quando;
   - per chi;
   - perché usare l'app.
6. Collegare dominio personalizzato.
7. Preparare Google Search Console e Google Business Profile.
8. Collegare analytics/eventi sulle CTA app:
   - scarica app;
   - apri app;
   - wallet;
   - contatti.

## Prompt operativo per nuovo progetto

Agisci come un team senior composto da creative director premium food brand, UX/UI designer, frontend developer, SEO strategist e conversion strategist.

Obiettivo: continuare il sito MONO Bottega Gastronomica partendo dalla versione pubblicata `9b8fcd0`, senza perdere la direzione attuale.

Regole:

- Non installare mille librerie 3D.
- Prima massima qualità narrativa, mobile e performance.
- La tavola deve essere un'icona scenografica, non un frullatore grafico.
- Il sito deve raccontare MONO, non duplicare l'app.
- L'app è il punto di conversione per ordini, wallet, fedeltà e notifiche.
- MONO Convivium è parte del cuore del progetto.
- Ogni volta che finisci un'azione, rispondi con “Finito”, report breve, link e cosa deve fare l'utente.

Prima azione consigliata nel nuovo progetto: aprire il sito live da telefono e PC, fare un audit visivo della hero cinematic 3D e decidere se passare a una scena composta da asset separati reali.
