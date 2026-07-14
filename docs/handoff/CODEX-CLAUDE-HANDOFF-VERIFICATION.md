# Verifica passaggio Claude → Codex

## 1. Esito sintetico

- **Data verifica:** 15 luglio 2026, Europe/Rome
- **Ambiente:** Windows, repository statico in `C:\Users\feder\Documents\New project`
- **Branch:** `main`
- **Commit verificato:** `573cd1343dc777679796cf37fc637e80d612ae52`
- **Verdetto visibilità:** **D — HANDOFF NON VISIBILE O NON VERIFICABILE**

Il codice operativo del sito, le tre bible di progetto e gli asset cinematografici 01–03 sono presenti, tracciati e verificabili. L'handoff Claude formale non è però disponibile: mancano indice, report, inventario, manifest file e script di verifica richiesti. Il sito è stato quindi collaudato autonomamente sul repository reale, senza assumere come vere dichiarazioni non disponibili.

## 2. Documenti Claude cercati

### Mancanti

1. `docs/PROJECT-HANDOFF-INDEX.md`
2. `docs/handoff/CLAUDE-TO-CODEX-HANDOFF.md`
3. `docs/handoff/CLAUDE-WORK-INVENTORY.json`
4. `docs/handoff/CLAUDE-FILES-MANIFEST.json`
5. `scripts/verify-claude-handoff.mjs`

La ricerca per nome e contenuto nell'intero repository non ha trovato copie alternative. I file non risultano nemmeno ignorati da Git.

### Fonti normative trovate e tracciate

| Documento | Stato | Byte | SHA-256 |
|---|---:|---:|---|
| `docs/MONO-DIGITAL-CREATIVE-BIBLE.md` | presente, leggibile, tracciato | 19.043 | `EA070CD0639C40D26137E89CE5D92393E5A0149632ACC2949E1CC8FCFC32CC89` |
| `docs/MONO-CINEMATIC-ASSET-BIBLE.md` | presente, leggibile, tracciato | 20.769 | `15F261FF883C5FAB8A5D4B0DE824040FA0211D7D90FC1AEDD7BF20850DA94ECD` |
| `docs/MONO-CODEX-ENGINEERING-MASTER-BRIEF.md` | presente, leggibile, tracciato | 12.068 | `97681835B4DF663B74828340EEAB82D987D33BFB4F8A0F933E1127F252E5F7C3` |
| `assets/cinematic/README.md` | presente, leggibile, tracciato | 2.193 | `2D22751023BADBBD34B8CB4E617BABFFDF2387000122F35E27A654A8B4E201B8` |
| `cinematic-assets.js` | presente, leggibile, tracciato | 9.111 | `447D3A29A5FD21CC0A624A2F088EB74161822577A6B95246FCD90D6D1DA6CF07` |

Non esiste un manifest Claude con hash di riferimento: non è quindi possibile dichiarare hash concordanti o divergenti rispetto al report mancante.

## 3. Esecuzione script di handoff

- **Comando:** `node scripts/verify-claude-handoff.mjs`
- **Exit code effettivo:** `1`
- **Esito:** `MODULE_NOT_FOUND`
- **Causa:** directory `scripts/` e file `verify-claude-handoff.mjs` assenti.
- **Script package manager:** non disponibile; non esiste un `package.json` alla radice.

Lo script non è stato ricreato, per non falsificare l'handoff iniziale.

## 4. Stato Git

- Branch corrente: `main`.
- HEAD iniziale: `573cd1343dc777679796cf37fc637e80d612ae52`.
- Conflitti: nessuno.
- `.gitmodules`: assente; nessun submodule dichiarato.
- `.gitattributes`: solo `*.pdf binary`; nessuna regola Git LFS.
- `git lfs ls-files`: nessun asset LFS elencato.
- Puntatori LFS rilevati nei file pubblici: nessuno.
- Modifiche del sito pubblico: correzioni QA Codex non ancora committate al momento della verifica iniziale.
- Modifiche estranee già presenti: `social-studio/**`, lasciate intatte e fuori dallo staging del sito.
- File non tracciati rilevanti all'handoff pubblico: nessuno.
- File ignorati: `tmp/` e `security-audit/`; non sono dipendenze runtime del sito pubblico.

Il report Claude mancante non permette il confronto formale di branch e commit. La cronologia è comunque lineare su `main`; i commit recenti sono presenti e il repository è operativo.

## 5. Asset binari

Tutti i 17 asset dichiarati tramite `assetUrl(...)` in `cinematic-assets.js` sono presenti, non vuoti, tracciati, con firma coerente al formato e non sono puntatori LFS:

- 8 MP4 validi;
- 6 WebM validi;
- 3 poster WebP validi;
- `icons/mono-favicon.svg` valido e tracciato.

Gli asset video 01–03 risultano inoltre realmente usati dal DOM locale: Prodotti carica `mono-02-cucina-magica-desktop.webm/mp4`; Chi siamo carica `mono-03-molte-mani-desktop.webm/mp4`; Home espone i controlli cinematografici e i due segmenti previsti.

### Asset mancante noto

- `assets/cinematic/source/mono-04-tavola-eventi-master.mp4`: **non presente**, coerentemente marcato `missing-master` nel manifest. La pagina Eventi usa contenuto editoriale e non un falso video sostitutivo.

## 6. Percorsi assoluti e dipendenze locali

Riferimenti trovati nei file tracciati pubblici:

| Percorso | Tipo | Impatto |
|---|---|---|
| `MONO_HANDOFF.md` → repo Windows locale | documentale | informativo |
| `README.md` → `127.0.0.1:4173` | istruzione server locale | legittimo, non runtime produzione |
| `app.js` → `localhost` / `127.0.0.1` | log diagnostico locale | legittimo, non dipendenza produzione |
| `docs/MONO-SHARED-COLOR-SYSTEM.md` → `C:/Users/feder/Documents/mono-app/...` | sorgente esterna app | non portabile, documentale |
| `docs/MONO-SHARED-COLOR-TOKENS.json` → percorso app assoluto | provenienza token | non portabile, documentale |

Nessun riferimento pubblico runtime a `/mnt/data`, `/tmp`, `/Users/...`, allegati Claude o file personali esterni è stato trovato.

## 7. Confronto funzioni dichiarate–repository

| Funzione | Stato | Evidenza operativa |
|---|---|---|
| Pagine e routing | `CONFERMATO` | nove capitoli configurati; route e anchor interni esistenti |
| Copy corrente | `CONFERMATO_CON_DIFFERENZE` | testi reali presenti; impossibile confrontarli con inventario Claude assente |
| Video Home 01 | `CONFERMATO` | master, derivati, poster, controlli e DOM presenti |
| Video Prodotti 02 | `CONFERMATO` | WebM/MP4/poster caricati nel DOM |
| Video Chi siamo 03 | `CONFERMATO` | WebM/MP4/poster caricati nel DOM |
| Video Eventi 04 | `SOLO_DOCUMENTATO` | slot e manifest pronti, master assente |
| Badge ufficiale | `CONFERMATO` | asset SVG, configurazione e overlay HTML/CSS presenti |
| Salta | `CONFERMATO` | controllo presente nei film attivi |
| Rivedi | `CONFERMATO` | controllo presente nei film attivi |
| Memoria `sessionStorage` video | `CONFERMATO` | chiavi per asset e comportamento play-once implementati |
| MONO FLOW | `CONFERMATO` | modulo caricato, preview capitolo renderizzata, wheel/tastiera/drag implementati |
| O-portale | `CONFERMATO` | overlay `.mono-o-portal` renderizzato e navigazione configurata |
| MONO DROP | `CONFERMATO` | overlay `.mono-drop` renderizzato in qualità full |
| Scia oleosa | `CONFERMATO` | canvas, trail temporale e decadimento implementati |
| Riassorbimento | `CONFERMATO` | punti e microgocce convergono verso il cursore prima della rimozione |
| Microgocce | `CONFERMATO` | generate su cambi di direzione, massimo due, con vita limitata |
| Effetto plastificato/rifrazione | `CONFERMATO` | lens CSS e `backdrop-filter` attivi solo quando consentito |
| MONO OLIO VIVO | `CONFERMATO` | superfici inserite nelle CTA e impulso globale su navigazione |
| Tavola MONO | `CONFERMATO` | otto oggetti renderizzati e memoria `mono-visited-chapters` |
| Responsive | `CONFERMATO_CON_DIFFERENZE` | CSS e matrice breakpoint verificate; nessun test su dispositivo fisico |
| Reduced motion | `CONFERMATO` | flag runtime e media query disattivano motion avanzato/video autoplay |
| SEO | `CONFERMATO` | title, H1, canonical, OG URL, Twitter Card e manifest su tutte le pagine principali |
| Analytics | `PRESENTE_MA_NON_UTILIZZATO` | hook e `data-track` presenti; ID GA4/GTM vuoti |
| Test automatici progetto | `NON_TROVATO` | nessuna suite root e script handoff assente; QA eseguito con audit ad hoc |

## 8. Discrepanze classificate

1. **BLOCCANTE per l'handoff, non per il sito:** tutti i cinque documenti/script Claude obbligatori sono assenti.
2. **ALTA:** impossibile confrontare hash, inventario e commit dichiarati da Claude.
3. **MEDIA:** master e derivati Film 04 Eventi assenti; fallback editoriale corretto ma capitolo cinematografico incompleto.
4. **MEDIA:** tracking predisposto ma non attivato per assenza di ID GA4/GTM.
5. **MEDIA:** assenza di test reali Safari, Firefox, iOS e Android e di una misurazione Lighthouse mobile ripetibile.
6. **BASSA:** riferimenti assoluti al repository app nei documenti colore, non usati a runtime.
7. **INFORMATIVA:** `social-studio/**` contiene lavoro locale separato e non è stato incluso né alterato.

## 9. Correzioni applicate durante il QA

- uniformati i link app a `https://app.monobottega.it/home`;
- aggiunti `og:url` e `twitter:card` alle pagine interne;
- migliorata la semantica e l'accessibilità di Convivium;
- rimossi numero non autorizzato e indirizzo incompleto dalla presentazione Convivium;
- eliminata la memorizzazione locale dell'email newsletter;
- aggiunta chiusura del menu con `Escape` e ripristino del focus;
- portati i controlli mobili a target minimo 44 px;
- aggiornati copy obsoleti e cache service worker a `mono-site-v61`.

## 10. Impatto sul collaudo finale

L'handoff Claude non può essere certificato come consegna documentale. Il repository reale consente però di verificare autonomamente quasi tutto il prodotto pubblico. Il collaudo finale usa quindi il codice, gli asset e il comportamento renderizzato come unica fonte operativa; non attribuisce a Claude funzioni non dimostrate.

## 11. Verdetto

**D — HANDOFF CLAUDE NON VISIBILE O NON VERIFICABILE.**

Motivo: l'intero pacchetto documentale Claude obbligatorio e lo script di verifica sono assenti. Le implementazioni pubbliche principali sono comunque presenti e sono state ricostruite e verificate direttamente da Codex, con le limitazioni indicate.
