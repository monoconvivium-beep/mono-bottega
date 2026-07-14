# MONO Cinematic Asset Bible

Versione: `2026-07-14 / cinematic-bible-v1`

Stato: asset preparation completata per i film 01, 02 e 03; struttura predisposta ma master mancante per il film 04.

## 1. Scopo

I film MONO sono quattro capitoli dello stesso racconto: fuoco, trasformazione, persone, convivialita. Non sono player decorativi indipendenti e non devono sembrare una raccolta di video generati in momenti diversi.

Questa Bible definisce la fonte di verita per:

- master originali;
- derivati web;
- poster;
- QC visivo;
- watermark e badge MONO;
- safe area e focal point;
- playback e memoria di sessione;
- preload, mobile, reduced motion e accessibilita;
- handoff al MONO Codex Engineering Master Brief.

Il sistema tecnico definitivo, MONO FLOW, MONO DROP, MONO OLIO VIVO, portale della O, navigazione orizzontale e scena 3D persistente non sono implementati in questa fase.

## 2. Linguaggio condiviso

Il linguaggio cinematografico MONO deve restare:

- realistico, caldo e materico;
- gastronomico, contemporaneo e umano;
- elegante ma non patinato;
- fisicamente credibile;
- ricco di rame, acciaio caldo, cashmere, terracotta e verde naturale;
- privo di look HDR, blu tecnologici e saturazione food artificiale;
- mai apertamente fantasy e mai presentato come dimostrazione AI.

L'uniformita viene costruita fuori dai pixel mediante contenitori editoriali, poster coerenti, badge ufficiale, ritmo di riproduzione, spazio negativo e transizioni HTML/CSS. Nessun master e stato alterato per imporre un filtro comune.

## 3. Struttura canonica

Il repository usa la struttura cinematografica gia esistente:

- `assets/cinematic/source/`: master originali preservati;
- `assets/cinematic/web/`: MP4, WebM e poster destinati al web;
- `cinematic-assets.js`: manifest centrale;
- `docs/MONO-CINEMATIC-ASSET-BIBLE.md`: specifica narrativa e tecnica.

Non vengono create directory duplicate `public/media/`. I master non entrano nel bundle JavaScript e nessun video e convertito in base64.

## 4. Censimento reale

La ricerca e stata eseguita nel repository, in Downloads e nelle cartelle Desktop, Documents e Videos. Il contenuto e stato verificato con `ffprobe`, contact sheet e fotogrammi singoli: il nome del file non e stato usato come unica prova.

| Film | Nome sorgente reale | Nome normalizzato | Stato |
| --- | --- | --- | --- |
| 01A Fuoco | `VIDEO PENTOLA.mp4` | `mono-01-fuoco-ravioli-master.mp4` | trovato, hash preservato |
| 01B Ravioli | `VIDEO AGNOLOTTI.mp4` | `mono-01-ravioli-cut-master.mp4` | trovato, secondo segmento dello stesso capitolo Home |
| 02 Cucina | `VIDEO CUCINA MAGICA.mp4` | `mono-02-cucina-magica-master.mp4` | trovato, hash preservato |
| 03 Mani | `VIDEO MANI.mp4` | `mono-03-molte-mani-master.mp4` | trovato, hash preservato |
| 04 Eventi | non trovato | `mono-04-tavola-eventi-master.mp4` | mancante, nessuna sostituzione fittizia |

Il capitolo 01 e oggi un film sequenziale composto da due master originali di 10,005 secondi. La pentola e il segmento primario; gli agnolotti sono il secondo taglio approvato della stessa matrice “Fuoco e ravioli”. I due originali restano distinti per non creare un falso master concatenato.

## 5. Asset esclusi

I seguenti file non appartengono ai quattro film flagship:

- `video polpette.mp4`: cascata di polpette su fondo verde;
- `Create_a_premium_cinematic_an.mp4`: polpette su banco in legno con salsa;
- filmati promozionali storici con testo generato, scenari fantasy o insegne non ufficiali.

Non sono copiati nella struttura cinematografica, non sono nel manifest, non sono precaricati e non possono essere usati come fallback del film Eventi.

## 6. Inventario tecnico dei master

Tutti i master trovati sono MP4/QuickTime, H.264 High, `yuv420p`, 1280x720, 16:9, 24 fps, orientamento landscape, start time 0 e nessun tag di rotazione. Tutti contengono AAC LC stereo 48 kHz; i derivati web sono invece privi di audio.

| Asset | Durata | Video bitrate | Bitrate totale | Peso | Audio master |
| --- | ---: | ---: | ---: | ---: | --- |
| 01A Fuoco | 10,005 s | 1.889 kb/s | 2.028 kb/s | 2.536.253 B | AAC 128 kb/s, stereo |
| 01B Ravioli | 10,005 s | 1.744 kb/s | 1.883 kb/s | 2.354.312 B | AAC 128 kb/s, stereo |
| 02 Cucina | 10,005 s | 1.963 kb/s | 2.103 kb/s | 2.629.633 B | AAC 128 kb/s, stereo |
| 03 Mani | 10,005 s | 2.031 kb/s | 2.170 kb/s | 2.713.542 B | AAC 128 kb/s, stereo |
| 04 Eventi | non disponibile | non disponibile | non disponibile | non disponibile | da verificare sul master reale |

Hash SHA-256 preservati:

- 01A: `682EA4B5BAC77F0DFB60D7D9675A32B5FACE304C32C61EBDA9B80060488F9564`;
- 01B: `FBC11315E716B06A1F52DC75E01A3389D1BD7EE5B781D245E026E515A76156DF`;
- 02: `F500BCF8D1F41B4A6A0EF3FAC6EB560E794BFF21B71128447EDC5DD95B1B9001`;
- 03: `A45FEA6DB0F3F107108DCF7CDA4A1A04C101B80160A36F5BDCE98D01A18519B5`.

## 7. Derivati web

I derivati mantengono 1280x720, 24 fps e `yuv420p`, senza upscale, interpolazione, traccia audio, sharpening aggressivo o grading distruttivo. Gli MP4 usano H.264 con faststart; i WebM usano VP9.

| Asset | WebM VP9 | MP4 H.264 | Poster WebP | Riduzione WebM | Riduzione MP4 |
| --- | ---: | ---: | ---: | ---: | ---: |
| 01A Fuoco | 1.452.402 B | 2.104.014 B | 36.152 B | 42,7% | 17,0% |
| 01B Ravioli | 1.379.701 B | 2.232.067 B | 56.664 B | 41,4% | 5,2% |
| 02 Cucina | 2.333.401 B | 3.023.656 B | 49.688 B | 11,3% | -15,0% |
| 03 Mani | 2.340.863 B | 3.059.120 B | 51.734 B | 13,7% | -12,7% |
| 04 Eventi | mancante | mancante | mancante | n/d | n/d |

Gli MP4 02 e 03 sono piu pesanti dei master perche sono fallback ad alta qualita ricodificati senza audio. Il WebM resta la sorgente primaria. Il terzo brief puo eseguire un'ulteriore prova CRF misurata, ma non deve ridurre la qualita di mani, vapore o dettagli per inseguire un numero arbitrario.

Controllo SSIM rispetto ai master:

| Asset | MP4 SSIM | WebM SSIM |
| --- | ---: | ---: |
| 01A Fuoco | 0,993934 | 0,978922 |
| 01B Ravioli | 0,992755 | 0,978723 |
| 02 Cucina | 0,992161 | 0,939479 |
| 03 Mani | 0,991645 | 0,936723 |

AVIF non e stato introdotto: la pipeline attuale usa WebP e aggiungere un secondo formato poster non porta un vantaggio sufficiente rispetto alla complessita. `posterAvif` resta predisposto a `null` nel manifest.

## 8. Poster selezionati

| Asset | Timestamp | File | Motivazione |
| --- | ---: | --- | --- |
| 01A Fuoco | 6,5 s | `assets/cinematic/web/mono-01-fuoco-ravioli-poster.webp` | rame leggibile, fiamma controllata, vapore presente, composizione stabile |
| 01B Ravioli | 9,0 s | `assets/cinematic/web/mono-01-ravioli-cut-poster.webp` | ravioli completati, banco leggibile, mani fuori scena |
| 02 Cucina | 8,5 s | `assets/cinematic/web/mono-02-cucina-magica-poster.webp` | piatti finiti, cucina ordinata, vapore leggero |
| 03 Mani | 9,0 s | `assets/cinematic/web/mono-03-molte-mani-poster.webp` | piatto finito, confezione chiusa, banco ordinato |
| 04 Eventi | da scegliere | non disponibile | richiede il master reale della tavola imperiale |

I poster sono 16:9, 1280x720 e devono rimanere visibili durante caricamento, reduced motion, errore media, ritorno nella stessa sessione e dopo “Salta”.

## 9. Film 01 — Fuoco e ravioli

### Funzione e storyboard

Pagina primaria: Home.

1. pentola in rame sul fuoco;
2. fiamma e riflessi aumentano il desiderio;
3. il vapore costruisce profondita;
4. secondo taglio: sfoglia, ripieno e taglio degli agnolotti;
5. chiusura su banco ordinato e pasta pronta.

### QC visivo

- Pentola, manico e fuoco restano coerenti: problema trascurabile nel sito.
- Il vapore ha riccioli molto perfetti e leggermente sintetici: visibile soprattutto in pausa.
- Nel taglio ravioli il numero e la disposizione dei pezzi cambiano durante il movimento: visibile soprattutto in pausa.
- Mani, cutter e sfoglia restano leggibili durante la riproduzione.
- Simbolo bianco incorporato in basso a destra: da gestire con badge HTML/CSS.
- Primo e ultimo frame non formano un loop invisibile: playback target `once`.

### Regia

- Safe area desktop: fascia sinistra, evitando pentola, fiamma e vapore centrale.
- Testo mobile: fuori dal video.
- `focalPoint`: `58% 54%`.
- `mobileFocalPoint`: `58% 54%`.
- `objectPosition`: `58% center`.
- Forma: portale ampio o pannello editoriale; mai falso fullscreen oltre la qualita nativa.
- Strategia mobile: `contained-landscape`.

## 10. Film 02 — La cucina lavora

### Funzione e storyboard

Pagina primaria: Prodotti/Gastronomia.

1. verdure lavate nel lavello;
2. passaggio al tagliere;
3. taglio e organizzazione degli ingredienti;
4. padella e fiamma;
5. piatti completati;
6. banco nuovamente ordinato.

### QC visivo

- Verdure e tagli cambiano leggermente forma fra i passaggi: visibile soprattutto in pausa.
- Alcuni utensili e dettagli di fondo si trasformano durante i raccordi: visibile durante un'osservazione attenta.
- Una forma lunga tipo manico/scopa compare sul fondo nella chiusura: da gestire con durata e composizione, non con cancellazione pixel.
- I piatti finali sono stabili e adatti al poster.
- Simbolo bianco incorporato in basso a destra: da gestire con badge HTML/CSS.
- Il runtime pubblico attuale e ancora in loop; il target del terzo brief e `once` con “Salta” e “Rivedi”.

### Regia

- Safe area: `outside-video`; l'azione occupa quasi tutto il frame.
- `focalPoint`: `52% 58%`.
- `mobileFocalPoint`: `52% 58%`.
- Forma: finestra editoriale o maschera collegata alla O.
- Strategia mobile: `preserve-landscape`.

## 11. Film 03 — Molte mani, una sola squadra

### Funzione e storyboard

Pagina primaria: Chi siamo.

1. preparazione del banco;
2. taglio e mise en place;
3. passaggio della padella fra persone;
4. cottura;
5. impiattamento;
6. confezionamento;
7. piatto e package conclusivi.

### QC visivo

- Le mani sono generalmente credibili; alcuni passaggi di utensili cambiano geometria fra i frame: visibile soprattutto in pausa.
- Padella e ingredienti cambiano leggermente durante i raccordi: visibile durante un'osservazione attenta.
- Packaging finale leggibile ma con microtesto non affidabile: non deve essere ingrandito o usato come informazione.
- Il poster a 9,0 s e stabile e bilanciato.
- Simbolo bianco incorporato in basso a destra: coperto nel sito dal badge MONO ufficiale.
- Integrazione pubblica gia verificata con playback `once`, “Salta”, “Rivedi” e sessionStorage.

### Regia

- Safe area: `outside-video`.
- `focalPoint`: `54% 60%`.
- `mobileFocalPoint`: `54% 60%`.
- Forma: rettangolo morbido editoriale con spazio negativo.
- Strategia mobile: `preserve-landscape`.
- Uso Convivium: solo poster, still, maschera o estratto breve; mai una seconda riproduzione integrale automatica.

## 12. Film 04 — La tavola delle occasioni

Pagina primaria prevista: Eventi.

Il master non e presente nel repository ne fra i file locali ispezionati. Nessun video di polpette, stock o vecchio spot e stato usato come sostituzione.

Struttura predisposta:

- ID: `mono-event-table`;
- master atteso: `assets/cinematic/source/mono-04-tavola-eventi-master.mp4`;
- WebM atteso: `assets/cinematic/web/mono-04-tavola-eventi-desktop.webm`;
- MP4 atteso: `assets/cinematic/web/mono-04-tavola-eventi-desktop.mp4`;
- poster atteso: `assets/cinematic/web/mono-04-tavola-eventi-poster.webp`;
- playback target: `once`;
- strategia mobile provvisoria: `contained-landscape`;
- preload disabilitato fino all'arrivo del master.

QC, timestamp poster, watermark, coordinate badge, codec, pesi, safe area e focal point devono essere misurati sul file reale. Il brief atteso richiede tavola imperiale completa, sala vuota, forte prospettiva centrale, cristalli, piatti, centrotavola e luce calda.

## 13. Watermark e MonoVideoBadge

I tre master disponibili condividono un piccolo simbolo bianco incorporato nello stesso quadrante. La misurazione visiva sui poster 1280x720 colloca il centro approssimativo a:

- X: 91,0% della larghezza;
- Y: 84,7% dell'altezza;
- ingombro: circa 5–6% della larghezza.

Il master non viene ritagliato, sfocato, clonato o corretto. Il simbolo viene coperto soltanto nel layout con `icons/mono-favicon.svg`.

Configurazione iniziale verificata per i film 01, 02 e 03:

```text
badgeVariant: cashmere-squircle
badgeSize: clamp(50px, 7vw, 76px)
badgeRight: calc(9% - (var(--video-badge-size) / 2))
badgeBottom: calc(15.3% - (var(--video-badge-size) / 2))
badgeBackground: #F4ECDD
badgeLogoScale: 0.76
```

La formula ancora il centro del badge alla posizione reale del simbolo e resta configurabile tramite variabili locali. Il film 04 usa gli stessi valori soltanto come placeholder: dovranno essere verificati sul master reale.

Il badge deve restare `pointer-events: none`, `aria-hidden="true"`, sotto i controlli accessibili e sopra video e poster.

## 14. Playback e session memory

Target comune:

`autoplay una volta -> poster finale -> Rivedi`

Regole:

- autoplay solo muto e `playsinline`;
- avvio quando il film e visibile circa al 35–45%;
- “Salta” disponibile durante la riproduzione;
- pausa fuori viewport e quando la scheda e nascosta;
- nessun riavvio automatico dopo la conclusione;
- “Rivedi” riporta a 0 senza ricaricare la pagina;
- nessun controllo browser nativo;
- nessuna barra di avanzamento;
- nessun cookie e nessun dato personale.

Chiavi sessionStorage:

- `mono-video-seen-fire-ravioli`;
- `mono-video-seen-kitchen-magic`;
- `mono-video-seen-hands-team`;
- `mono-video-seen-event-table`.

La pagina Prodotti conserva temporaneamente il loop della precedente integrazione. Il terzo brief deve migrare il runtime a `playbackMode: once` e aggiungere i controlli accessibili senza rigenerare i derivati.

## 15. Mobile

Non sono stati trovati master verticali ufficiali.

| Film | Strategia | Regola |
| --- | --- | --- |
| 01 Fuoco e ravioli | `contained-landscape` | testo fuori dal film; nessun crop 9:16; larghezza controllata |
| 02 Cucina | `preserve-landscape` | azione intera; finestra editoriale; nessun overflow |
| 03 Mani | `preserve-landscape` | 16:9 dentro il contenitore; testo sopra o sotto |
| 04 Eventi | `contained-landscape` provvisorio | confermare dopo il master; non inventare un crop verticale |

Il badge scala fra 50 e 76 px. I controlli accessibili mantengono un target minimo 44x44 px. Touch usa cursore nativo e non attiva MONO DROP.

## 16. Preload e lazy loading

### Home

- poster Fuoco ad alta priorita;
- video dopo le risorse critiche/LCP;
- secondo segmento Ravioli soltanto quando la sequenza sta per usarlo;
- nessun caricamento dei film 02, 03 o 04.

### Pagine interne

- poster immediato ma non `fetchpriority=high` fuori dal primo viewport;
- sorgenti collegate con IntersectionObserver quando il film si avvicina;
- riproduzione alla soglia indicata nel manifest;
- pausa fuori viewport;
- cleanup observer/listener su `pagehide`;
- nessun preload simultaneo dei quattro film.

## 17. Reduced motion e fallback

Con `prefers-reduced-motion: reduce`:

- nessun autoplay;
- poster statico e badge MONO;
- copy e CTA reali sempre disponibili;
- pulsante manuale “Guarda il video” soltanto se coerente con la pagina;
- “Salta” nascosto finche il film non parte;
- nessun vuoto o cambio di altezza.

Se il media fallisce, il poster resta visibile e il contenuto HTML conserva tutto il significato.

## 18. Accessibilita

- Il film e complementare e `aria-hidden` quando decorativo.
- Titoli, paragrafi, CTA e informazioni vivono nel DOM.
- “Salta”, “Rivedi” e “Guarda il video” sono pulsanti reali.
- Focus visibile, ordine di tab logico, target minimo 44x44 px.
- Nessun audio automatico, lampeggio o testo essenziale dentro i pixel.
- Badge nascosto agli screen reader.
- Nessun cursore custom su touch o con reduced motion.

## 19. Color grading

Non e stato applicato grading ai derivati.

Valutazione:

- 01 Fuoco: gia caldo, rame credibile, neri morbidi; nessun ulteriore filtro arancione.
- 01 Ravioli: neutro caldo e materico; preservare farina e tono della pasta.
- 02 Cucina: acciaio neutro, verdure naturali; evitare saturazione dei verdi.
- 03 Mani: incarnati e cashmere equilibrati; non aumentare contrasto o nitidezza sulle mani.
- 04 Eventi: da verificare; proteggere highlight di cristalli e candele.

Eventuali correzioni future devono essere leggere, reversibili e applicate soltanto ai derivati.

## 20. Linguaggio delle maschere

Forme ammesse:

- finestra editoriale;
- rettangolo morbido;
- maschera circolare collegata alla O;
- crop asimmetrico controllato;
- pannello materico;
- portale della O.

Forme escluse:

- cornici televisive o browser;
- mockup smartphone per film gastronomici;
- blob casuali;
- bordi neon;
- crop verticale distruttivo.

## 21. Manifest centrale

`cinematic-assets.js` contiene quattro record e mantiene la compatibilita con i componenti esistenti.

Campi predisposti:

- identita, titolo, capitolo e pagina primaria;
- usi secondari;
- master e derivati desktop/mobile;
- poster e timestamp;
- dimensioni, aspect ratio, durata, fps e codec;
- playback runtime e playback target;
- session key, skip, replay e soglia viewport;
- badge e coordinate;
- safe area, text side, focal point e object position;
- strategia mobile, preload, priorita poster e stato;
- note operative e stato di integrazione.

Il record `mono-event-table` resta privo di URL media attivi: non puo generare richieste 404 o caricare un fallback sbagliato.

## 22. MONO DROP — handoff obbligatorio

MONO DROP e il cursore proprietario futuro.

### Forma

- piccola goccia collegata alla O;
- antracite o terracotta;
- precisa, rapida, elegante;
- nessun ritardo nei click e nessuna scia continua.

### Stati

- `ENTRA`;
- `SCOPRI`;
- `GUARDA`;
- `ASSAGGIA`;
- `SCORRI`;
- `TRASCINA`;
- `SCRIVI`;
- `PORTAMI`;
- `RIVEDI`.

### Stato video

- film non visto: `GUARDA`;
- film in riproduzione: `SALTA`, senza sostituire il pulsante accessibile;
- film concluso: `RIVEDI`;
- breve deformazione fluida collegata alla O soltanto all'ingresso.

### Particelle selettive

- Home: vapore o luce rame;
- Prodotti: farina o erbe molto fini;
- Eventi: riflesso champagne;
- Dove siamo: tratto cartografico.

Nessuna particella continua. Su touch, coarse pointer, reduced motion o device a bassa potenza resta il cursore nativo.

## 23. MONO OLIO VIVO — handoff

MONO OLIO VIVO e una forma liquida editoriale ispirata all'olio, non un effetto fantasy.

Specifiche iniziali:

- trasparenza: 0,12–0,28;
- colori: champagne `#CBA75A`, terracotta `#B85C38`, riflesso cashmere `#F4ECDD`;
- viscosita lenta ma risposta immediata all'interazione;
- durata hover: 180–260 ms;
- durata rivelazione/transizione: 550–900 ms;
- rifrazione molto lieve;
- nessuna distorsione permanente del testo;
- nessuna copia riconoscibile di interfacce di altri brand.

Usi futuri:

- apertura del portale O;
- rivelazione dei film;
- hover primari;
- passaggio fra capitoli;
- transizioni selettive.

Tecnologie in ordine di preferenza:

1. CSS mask/clip-path e gradienti;
2. SVG filter leggero e disattivabile;
3. Canvas 2D soltanto se misurato;
4. WebGL esclusivamente se il terzo brief dimostra un vantaggio reale.

Fallback: gradienti statici e dissolvenza. Reduced motion: nessuna viscosita animata, solo cambio di opacita.

## 24. Requisiti per il terzo brief

Il MONO Codex Engineering Master Brief dovra:

1. costruire un unico componente cinematico riutilizzabile;
2. leggere soltanto `cinematic-assets.js` per i percorsi;
3. migrare la Home dai file legacy ai master/derivati normalizzati;
4. gestire la sequenza Fuoco -> Ravioli senza precaricare film estranei;
5. migrare Cucina Magica da loop a play once;
6. mantenere l'integrazione Mani gia verificata;
7. non attivare Eventi finche il master 04 non arriva;
8. applicare badge per asset, non con override globali;
9. implementare sessionStorage per tutti i film;
10. coordinare “Salta”, “Rivedi”, reduced motion e MONO DROP;
11. introdurre MONO OLIO VIVO con fallback misurato;
12. verificare LCP, CLS, decoder simultanei e memoria su mobile;
13. aggiornare service worker senza precache dei file video;
14. testare desktop, tablet, mobile, tastiera e screen reader;
15. non implementare un fallback video fittizio per la tavola Eventi.

## 25. Stato finale della fase 2

- Film 01: master primario e companion preservati; MP4, WebM e due poster prodotti.
- Film 02: master, MP4, WebM e poster verificati.
- Film 03: master, MP4, WebM e poster verificati; integrazione pubblica gia disponibile.
- Film 04: struttura pronta, master e derivati mancanti segnalati.
- Polpette: escluse.
- Manifest: quattro record centralizzati.
- MONO DROP e MONO OLIO VIVO: handoff documentato, non implementato.
- Nessun upscale, nessun audio web, nessuna libreria pesante, nessun grading distruttivo.
