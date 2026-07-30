# Asset cinematografici MONO

Questa cartella contiene i film ufficiali e i derivati web della flagship MONO.

## Struttura

- `source/`: copie normalizzate dei master ufficiali, conservate senza sovrascrivere gli originali ricevuti.
- `web/`: derivati WebM/MP4 e poster WebP usati dal sito.
- `cinematic-assets.js`: manifest applicativo nella radice del progetto.

## Naming

Formato:

`mono-{numero}-{nome}-{variante}.{estensione}`

Esempi:

- `mono-01-fuoco-ravioli-master.mp4`
- `mono-01-fuoco-ravioli-desktop.webm`
- `mono-01-fuoco-ravioli-poster.webp`

## Film disponibili

### 01 — Fuoco e ravioli

- Master: `source/mono-01-fuoco-ravioli-master.mp4`
- Companion: `source/mono-01-ravioli-cut-master.mp4`
- Derivati: `web/mono-01-fuoco-ravioli-desktop.*` e `web/mono-01-ravioli-cut-desktop.*`
- Uso: Home.

### 02 — Cucina magica

- Master: `source/mono-02-cucina-magica-master.mp4`
- Derivati: `web/mono-02-cucina-magica-desktop.*`
- Uso: Prodotti/Gastronomia.

### 03 — Molte mani — TOLTO IL 30/7

Non c'e' piu' in questa cartella. Era un film **vero e diverso** dagli altri
(non un doppione), ma **non e' mai stato pubblicato**: dal 18/7 su Chi siamo va
il film 04, e `cinematic-assets.js` non lo nominava piu' da nessuna parte.
Erano 8 MB fermi online che nessuno chiedeva.
⚠️ Sta nella storia di git e torna indietro quando si vuole:
`git log --all -- assets/cinematic/source/mono-03-molte-mani-master.mp4`,
poi `git checkout <commit> -- <percorso>`.

### 04 — Chi siamo

- Master: `source/mono-04-chi-siamo-master.mp4`
- Derivati: `web/mono-04-chi-siamo-desktop.*`
- Uso: Chi siamo (`la-bottega`), + poster/still in Convivium.
- ⚠️ Il titolo dice "la brigata al passe": **ha preso il posto del film 03**,
  che raccontava un'altra cosa. Il commento in `cinematic-assets.js` lo spiega.

### 05 — Tavola Eventi

- Master: `source/mono-05-tavola-eventi-master.mp4`
- Uso: Eventi.
- Non viene sostituito con stock o film non approvati.

⚠️ **La numerazione qui sopra e' cambiata il 18/7**: quello che questo file
chiamava "04 — Tavola Eventi, non ricevuto" oggi e' il **05**, ed e' arrivato.

## Badge

Il badge ufficiale è `../../icons/mono-favicon.svg`. Posizione, dimensione, scala, bordo e ombra sono configurati per asset in `../../cinematic-assets.js`. Il badge è un overlay HTML/CSS e non modifica i master.

## Sostituzione e compressione

Quando arriva un nuovo master:

1. conservarlo in `source/` con naming coerente;
2. generare WebM VP9 e MP4 H.264 in `web/` senza upscale;
3. generare un poster WebP dal fotogramma approvato;
4. aggiornare `cinematic-assets.js` con dimensioni, durata, focal point e percorsi;
5. verificare badge, Salta, Rivedi, autoplay, reduced motion e mobile;
6. incrementare la cache del service worker solo per moduli/poster, non per i master video.

## File esclusi

Il video delle polpette è esplicitamente escluso dall'esperienza pubblica e non deve essere reintrodotto come fallback.
