# MONO — Asset cinematografici e slot creativi

Il sistema flagship funziona con CSS, asset approvati e fallback statici. Gli slot ancora aperti non devono essere sostituiti con stock generici.

## Asset integrati

| Nome file | Stato | Posizione | Regola |
| --- | --- | --- | --- |
| `assets/hero/mono-kitchen-fire-desktop.mp4` | attivo | Home, apertura cinematografica | autoplay muto, poster e fallback |
| `assets/products/mono-kitchen-works.mp4` | attivo | Prodotti, film materico dentro la O | autoplay muto, loop, fallback CSS |

Il precedente video della cascata di polpette è stato rimosso dal progetto.

## Slot da produrre e approvare

| Nome file | Formato | Rapporto | Durata | Peso massimo | Posizione |
| --- | --- | --- | --- | --- | --- |
| `mono-intro-table-ritual.webm` + `.mp4` | WebM VP9 + MP4 H.264 | 16:9 desktop, 9:16 mobile | 3–4 s | 2,2 MB desktop, 1,2 MB mobile | Intro home, solo prima visita |
| `mono-hands-team.webm` + `.mp4` | WebM VP9 + MP4 H.264 | 4:5 | 4–6 s | 1,8 MB | Chi siamo e Convivium, mani al lavoro |
| `mono-convivium-workflow.webp` | WebP/AVIF | 16:9 | immagine | 360 KB | Monoconvivium, ingresso → squadra |
| `mono-events-table-setting.webm` + `.mp4` | WebM VP9 + MP4 H.264 | 16:9 | 4–6 s | 2,8 MB | Eventi, tavola che si prepara |
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
