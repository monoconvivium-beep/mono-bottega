# MONO — Asset cinematografici e slot creativi

Il sistema flagship funziona con CSS, asset approvati e fallback statici. Gli slot ancora aperti non devono essere sostituiti con stock generici.

La fonte tecnica completa è `docs/MONO-CINEMATIC-ASSET-BIBLE.md`; i percorsi runtime sono centralizzati in `cinematic-assets.js`.

## Asset integrati

| Nome file | Stato | Posizione | Regola |
| --- | --- | --- | --- |
| `assets/hero/mono-kitchen-fire-desktop.mp4` | attivo | Home, apertura cinematografica | autoplay muto, poster e fallback |
| `assets/cinematic/source/mono-01-fuoco-ravioli-master.mp4` | master conservato | Sorgente ufficiale Fuoco | copia hash-identica di `VIDEO PENTOLA.mp4` |
| `assets/cinematic/source/mono-01-ravioli-cut-master.mp4` | master companion conservato | Secondo taglio dello stesso capitolo Home | copia hash-identica di `VIDEO AGNOLOTTI.mp4` |
| `assets/cinematic/web/mono-01-fuoco-ravioli-desktop.webm` | preparato | Home, sorgente primaria futura | VP9, muto, 1280×720, 24 fps |
| `assets/cinematic/web/mono-01-fuoco-ravioli-desktop.mp4` | preparato | Home, fallback futuro | H.264, muto, faststart, 1280×720, 24 fps |
| `assets/cinematic/web/mono-01-fuoco-ravioli-poster.webp` | preparato | Poster Home | fotogramma 6,5 s, 1280×720 |
| `assets/cinematic/web/mono-01-ravioli-cut-desktop.webm` | preparato | Home, secondo taglio futuro | VP9, muto, 1280×720, 24 fps |
| `assets/cinematic/web/mono-01-ravioli-cut-desktop.mp4` | preparato | Home, fallback secondo taglio | H.264, muto, faststart, 1280×720, 24 fps |
| `assets/cinematic/web/mono-01-ravioli-cut-poster.webp` | preparato | Poster secondo taglio | fotogramma 9,0 s, 1280×720 |
| `assets/cinematic/source/mono-02-cucina-magica-master.mp4` | master conservato | Sorgente ufficiale “La cucina lavora” | H.264 + AAC, non caricato dal componente |
| `assets/cinematic/web/mono-02-cucina-magica-desktop.webm` | attivo | Prodotti, sorgente primaria | VP9, muto, 1280×720, 24 fps |
| `assets/cinematic/web/mono-02-cucina-magica-desktop.mp4` | attivo | Prodotti, fallback browser | H.264, muto, faststart, 1280×720, 24 fps |
| `assets/cinematic/web/mono-02-cucina-magica-poster.webp` | attivo | Poster immediato e reduced motion | fotogramma 8,5 s, 1280×720 |
| `assets/cinematic/source/mono-03-molte-mani-master.mp4` | master conservato | Sorgente ufficiale “Molte mani, una sola squadra” | H.264 + AAC, non caricato dal componente |
| `assets/cinematic/web/mono-03-molte-mani-desktop.webm` | attivo | Chi siamo, sorgente primaria | VP9, muto, 1280×720, 24 fps |
| `assets/cinematic/web/mono-03-molte-mani-desktop.mp4` | attivo | Chi siamo, fallback browser | H.264, muto, faststart, 1280×720, 24 fps |
| `assets/cinematic/web/mono-03-molte-mani-poster.webp` | attivo | Poster, fine riproduzione e reduced motion | fotogramma 9,0 s, 1280×720 |

I due video di polpette individuati fuori dal repository sono esclusi: non sono copiati, manifestati o usati come fallback.

Il master “La cucina lavora” contiene un simbolo a stella incorporato in più fotogrammi, visibile anche nel poster. Non è stato cancellato, coperto, sfocato o ritagliato. Per la pubblicazione definitiva senza simbolo serve un master autorizzato e pulito.

Il master “Molte mani, una sola squadra” contiene lo stesso simbolo a stella nell’angolo inferiore destro. Il file resta integro; sul sito il simbolo viene coperto esclusivamente da un bollino HTML/CSS con l’icona ufficiale `icons/mono-favicon.svg`.

I master Home mostrano lo stesso simbolo nello stesso quadrante. Il manifest prepara il medesimo badge configurabile, verificato sul centro normalizzato del simbolo. L’attivazione definitiva sulla Home resta compito del terzo brief.

## Slot da produrre e approvare

| Nome file | Formato | Rapporto | Durata | Peso massimo | Posizione |
| --- | --- | --- | --- | --- | --- |
| `mono-intro-table-ritual.webm` + `.mp4` | WebM VP9 + MP4 H.264 | 16:9 desktop, 9:16 mobile | 3–4 s | 2,2 MB desktop, 1,2 MB mobile | Intro home, solo prima visita |
| `mono-convivium-workflow.webp` | WebP/AVIF | 16:9 | immagine | 360 KB | Monoconvivium, ingresso → squadra |
| `mono-04-tavola-eventi-master.mp4` + derivati | MP4 master, WebM VP9 + MP4 H.264 | 16:9 | da verificare | da verificare | Eventi, tavola imperiale che si prepara |
| `mono-app-ticket-fold.webm` + `.mp4` | WebM VP9 + MP4 H.264 | 4:5 | 4–5 s | 1,8 MB | App, scontrino che diventa tessera |
| `mono-torino-santa-rita-route.svg` | SVG ottimizzato | 16:9 | — | 35 KB | Dove siamo, linea Torino → Via Barletta |
| `mono-workstation-apron.webp` | WebP/AVIF | 16:9 | immagine | 320 KB | Lavora con noi, postazione vuota |

## Specifiche comuni

- Nessun testo o logo generato dentro video e immagini.
- Nessun audio in autoplay.
- Colore: cashmere, terracotta, rame, oliva, champagne; niente filtro seppia globale.
- Inquadrature materiche e ravvicinate; mani e gesti reali, mai persone in posa.
- Primo frame già leggibile come poster.
- Esportare poster WebP/AVIF separati sotto 180 KB.
- Evitare grana incorporata pesante: il sito applica già una texture CSS leggera.
