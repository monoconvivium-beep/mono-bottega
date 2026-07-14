# MONO Shared Color System

Versione: 2026-07-14

Fonte di verità: app MONO

Implementazione sito: `mono-colors.css`

## Verdetto

Il sito non usa più una palette indipendente. I colori primitivi, le temperature di pagina, i componenti e le firme cinematografiche derivano dai token reali dell'app MONO. La corrispondenza è forte ma non viene dichiarata perfetta al 100%: le schermate autenticate dell'app non sono verificabili interamente dal browser pubblico e i due repository non condividono ancora un pacchetto di token compilato unico.

Punteggio di coerenza cromatica: **97/100**.

## Fonti analizzate

Ordine effettivo di verifica:

1. `C:/Users/feder/Documents/mono-app/tokens/design.ts`
2. `C:/Users/feder/Documents/mono-app/app/globals.css`
3. `C:/Users/feder/Documents/mono-app/tailwind.config.ts`
4. Componenti `Button`, `Card`, `TabBar`, `RouteBackground`, layout e pagine pubbliche dell'app
5. Colori calcolati nel browser su `https://app.monobottega.it/home`, con redirect legittimo a `/onboarding`
6. Asset SVG in `mono-app/public/brand`
7. Screenshot ufficiale `COLORI CODICI PANTONE APP MONO.jpeg`
8. Fogli di stile, script e pagine pubbliche di `monobottega.it`

Non sono state aggirate autenticazioni o protezioni.

## Verifica pubblica dell'app

La pagina pubblica dell'app ha restituito questi valori calcolati:

| Elemento | Valore calcolato | Token |
| --- | --- | --- |
| Body background | `rgb(244, 236, 221)` | Cashmere `#F4ECDD` |
| Body text | `rgb(38, 35, 33)` | Anthracite `#262321` |
| Pulsante principale | `rgb(184, 92, 56)` | Terracotta `#B85C38` |
| Testo pulsante | `rgb(244, 236, 221)` | Cashmere `#F4ECDD` |
| Card | `rgb(255, 255, 255)` | White `#FFFFFF` |
| Bordo card | `rgb(239, 227, 200)` | Warm Butter `#EFE3C8` |

## Palette master

| Token | HEX | RGB | HSL | Ruolo |
| --- | --- | --- | --- | --- |
| `--mono-cashmere` | `#F4ECDD` | 244 236 221 | 39 51% 91% | fondo principale |
| `--mono-butter` | `#EFE3C8` | 239 227 200 | 42 55% 86% | superficie calda |
| `--mono-terracotta` | `#B85C38` | 184 92 56 | 17 53% 47% | accento primario |
| `--mono-coral` | `#E27A60` | 226 122 96 | 12 69% 63% | accento vivido |
| `--mono-olive` | `#6E6A3C` | 110 106 60 | 55 29% 33% | accento naturale |
| `--mono-gold` | `#CBA75A` | 203 167 90 | 41 52% 57% | accento premium |
| `--mono-anthracite` | `#262321` | 38 35 33 | 24 7% 14% | testo e fondo inverso |
| `--mono-terracotta-tint` | `#C4563A` | 196 86 58 | 12 54% 50% | tinta pagina app |
| `--mono-gold-tint` | `#D9A94A` | 217 169 74 | 40 65% 57% | tinta pagina app |
| `--mono-sage` | `#4E6B47` | 78 107 71 | 108 20% 35% | Convivium e successo |
| `--mono-brick` | `#A83A28` | 168 58 40 | 8 62% 41% | variante primaria accessibile |
| `--mono-clay` | `#B5723F` | 181 114 63 | 26 48% 48% | coccio e pagine calde |
| `--mono-white` | `#FFFFFF` | 255 255 255 | 0 0% 100% | card elevate |
| `--mono-olive-bright` | `#7E9247` | 126 146 71 | 76 35% 43% | variante funzionale Counter/DROP |

I colori `#231F20` e `#D5A34C` restano token asset per i loghi ufficiali. Non vengono confusi con Anthracite e Champagne Gold dell'interfaccia.

## Token semantici

I componenti del sito usano ruoli, non HEX sparsi:

- fondi: `--mono-bg-primary`, `--mono-bg-secondary`, `--mono-bg-inverse`;
- superfici: `--mono-surface-primary`, `--mono-surface-elevated`;
- testi: `--mono-text-primary`, `--mono-text-secondary`, `--mono-text-muted`, `--mono-text-inverse`;
- accenti: `--mono-accent-primary`, `--mono-accent-secondary`, `--mono-accent-premium`;
- bordi e focus: `--mono-border-soft`, `--mono-border-strong`, `--mono-focus`, `--mono-focus-soft`;
- pulsanti: `--mono-button-primary-*`, `--mono-button-secondary-*`;
- card e header: `--mono-card-*`, `--mono-header-*`;
- stati: `--mono-state-success`, `--mono-state-warning`, `--mono-state-error`, `--mono-state-info`;
- firma: `--mono-video-*`, `--mono-drop-*`.

`styles.css`, `experience.css` e `mono-engineering.css` consumano questa fonte centrale. Gli alias storici rimasti esistono soltanto dentro `mono-colors.css`, così le pagine precedenti continuano a funzionare senza mantenere palette concorrenti.

## Applicazione per componenti

### Background e card

- Body e pagine editoriali: Cashmere.
- Fasce e superfici secondarie: Warm Butter dell'app, corretto da `#EFE3C6` a `#EFE3C8`.
- Card: White al 90% con bordo Warm Butter e ombra Anthracite.
- Sezioni inverse: Anthracite, senza marroni casuali.

### Testi

- Primario: Anthracite.
- Secondario e muted: alpha controllati dello stesso Anthracite.
- Inverso: Cashmere.
- Link e label ereditano il ruolo del componente, senza grigi esterni alla palette.

### Pulsanti

- L'app mantiene Terracotta come primitivo di azione.
- Il sito usa Brick `#A83A28` per le CTA con testo Cashmere, perché supera AA per testo normale.
- Il precedente gradiente con riflesso oro è stato rimosso dal pulsante primario: la CTA è ora più vicina alla grammatica piana dell'app e più leggibile.
- Focus usa Brick più alone Champagne e non dipende soltanto dal colore.

### Navigazione

- Header: Cashmere al 92%, bordo Terracotta al 14%.
- Voce attiva e hover: token della pagina o accento Terracotta.
- Menu mobile: stessa superficie e stessi ruoli, senza palette separata.

### Cinematic controls, badge e MONO DROP

- Badge video: Cashmere + Anthracite, non più valori duplicati nel JavaScript.
- Controlli Salta/Rivedi: superficie Cashmere, testo Anthracite e focus Brick/Champagne.
- MONO DROP: Burnt Olive, Olive Bright, Champagne e Cashmere; rimossi verdi e marroni esterni alla palette app.
- MONO OLIO VIVO e temperature dei capitoli riusano esclusivamente primitive o alpha controllati.

## Temperature delle pagine

| Pagina | Accento semantico |
| --- | --- |
| Home | Clay |
| Prodotti | Terracotta |
| Pasticceria | Coral |
| Chi siamo | Anthracite |
| Convivium | Sage |
| Eventi | Clay |
| App | Burnt Olive |
| Dove siamo | Clay |
| Lavora con noi | Brick |

La temperatura cambia, ma Cashmere, Butter, White e Anthracite mantengono continuità tra tutte le pagine.

## Contrasto e varianti accessibili

| Coppia | Rapporto | Esito |
| --- | ---: | --- |
| Anthracite / Cashmere | 13.30:1 | AAA |
| Anthracite / Warm Butter | 12.26:1 | AAA |
| Anthracite / White | 15.62:1 | AAA |
| Cashmere / Terracotta | 3.87:1 | solo testo grande |
| White / Terracotta | 4.54:1 | AA, margine ridotto |
| Cashmere / Brick | 5.42:1 | AA |
| Cashmere / Burnt Olive | 4.72:1 | AA |
| Anthracite / Champagne Gold | 6.85:1 | AA |
| Cashmere / Sage | 5.08:1 | AA |

Decisione: Terracotta resta il colore brand esatto e il riferimento visivo dell'app; Brick, già presente nei token app, è la variante tecnica per CTA e focus che richiedono testo normale chiaro.

## Colori rimossi o unificati

| Prima | Dopo | Motivo |
| --- | --- | --- |
| `#EFE3C6` | `#EFE3C8` | Warm Butter reale dell'app |
| `#ECE6D4` | Warm Butter | fondo secondario duplicato |
| `#FFF9EE` | White | hover superficie non motivato |
| `#3A2A20` | Brick | apertura del gradiente Convivium |
| `#2C2420` | Anthracite Warm | passaggio scuro controllato |
| `#241F1D` | Anthracite | fondo inverso unico |
| HEX in badge JS | `--mono-video-badge-*` | una sola fonte |
| verdi/marroni MONO DROP | `--mono-drop-*` | firma coerente con app |
| gradienti CTA con oro | Brick pieno | accessibilità e coerenza app |

## Differenze intenzionali e colori preservati

- I loghi ufficiali conservano `#231F20`, `#D5A34C`, e, negli asset Convivium, rosso, grigio, bianco e nero incorporati. Sono colori asset, non token UI.
- Il tema operativo `Counter Night` dell'app usa varianti più luminose e scure per leggibilità al banco. Non viene trasferito al sito perché ha una funzione diversa.
- I colori di provider esterni, come Google e social login, restano proprietà dei relativi marchi.
- Foto e video non vengono ricolorati con filtri globali: la palette governa interfaccia, overlay e controlli, non altera artificialmente il contenuto cinematografico.
- Gli stati error, success, warning, disabled e focus restano semanticamente distinti anche quando riusano la famiglia MONO.

## RAL indicativi

Le corrispondenze seguenti sono solo orientative: HEX sRGB e RAL fisico non sono equivalenti e dipendono da materiale, finitura e illuminazione.

| Colore digitale | RAL approssimativo | Attendibilità |
| --- | --- | --- |
| Cashmere `#F4ECDD` | RAL 1013 Bianco perla | media |
| Warm Butter `#EFE3C8` | RAL 1015 Avorio chiaro | media |
| Terracotta `#B85C38` | RAL 8004 Marrone rame | media |
| Coral `#E27A60` | RAL 3012 Rosso beige | media-bassa |
| Burnt Olive `#6E6A3C` | RAL 7008 Grigio kaki | media-bassa |
| Champagne Gold `#CBA75A` | RAL 1002 Giallo sabbia | bassa, non metallico |
| Anthracite `#262321` | RAL 7021 Grigio nerastro | media |
| Sage `#4E6B47` | RAL 6003 Verde oliva | media |

Per produzione fisica serve sempre una mazzetta RAL reale e una prova sul materiale definitivo.

## Coerenza cromatica sito ↔ app

- [x] Repository app e token reali analizzati.
- [x] Valori pubblici principali verificati nel browser.
- [x] Warm Butter del sito allineato al valore app `#EFE3C8`.
- [x] Palette centralizzata in un solo modulo sito.
- [x] Token primitivi e semantici documentati in JSON.
- [x] Header, card, pulsanti, badge, controlli video e MONO DROP migrati.
- [x] Pagine editoriali collegate al master prima degli altri fogli di stile.
- [x] Cache applicativa aggiornata per distribuire il nuovo sistema.
- [x] Contrasti principali calcolati e CTA corretta con variante app accessibile.
- [x] Colori asset, provider e stati funzionali preservati intenzionalmente.
- [ ] Schermate autenticate dell'app verificate integralmente dal browser pubblico.
- [ ] Token distribuiti da un unico package condiviso tra i due repository.

### Differenze residue

Le uniche differenze residue sono motivate: accessibilità CTA, modalità operativa Counter Night, asset ufficiali, provider esterni e contenuti fotografici/video. Non risultano seconde palette principali nel sito.

## Validazione eseguita

- `node --check` superato su nove moduli JavaScript e sul service worker.
- Struttura CSS verificata sui quattro fogli principali; parentesi bilanciate.
- Parità automatica superata per tutti i 12 colori ufficiali dichiarati in `tokens/design.ts`.
- JSON validato: 31 record completi con tutti i campi obbligatori.
- Tutte le 12 pagine pubbliche e `mono-colors.css` restituiscono HTTP 200 in locale.
- QA Chromium desktop: token calcolati corretti, CTA Brick/Cashmere, nessun overflow e nessun errore console.
- QA Chromium mobile 390×844: palette caricata, CTA leggibile e nessun overflow orizzontale.
- Service worker aggiornato a `mono-site-v60` e master cromatico aggiunto alla precache.
- Build produzione dell'app: completata con successo, 54 pagine generate. Restano warning già presenti su workspace root e uso Supabase in Edge Runtime.
- Lint app: non verde per debiti preesistenti e non collegati alla palette, tra cui apostrofi/virgolette JSX, un hook `useMiss` dentro callback, regole TypeScript ESLint mancanti e due dipendenze hook. Nessun errore riguarda `tokens/design.ts`, `tailwind.config.ts` o il master cromatico del sito.

I problemi lint dell'app non sono stati corretti perché estranei a questa migrazione e il repository app non è stato modificato.

## Prossimo consolidamento tecnico

Quando sito e app verranno riuniti in un monorepo o in una pipeline condivisa, `docs/MONO-SHARED-COLOR-TOKENS.json` può diventare il file sorgente compilato automaticamente in:

- `mono-colors.css` per il sito;
- `tokens/design.ts` per l'app;
- eventuale configurazione Tailwind.

Fino ad allora l'app resta la fonte normativa e il sito ne conserva una copia esplicita, verificabile e documentata.
