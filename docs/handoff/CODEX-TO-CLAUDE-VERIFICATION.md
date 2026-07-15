# Verifica indipendente Codex → Claude

**Team:** revisione indipendente Claude (QA, brand, frontend, accessibilità, SEO, conversione)
**Data:** 2026-07-15 (Europe/Rome) · **Branch:** `main` · **HEAD:** `f5138225`
**Metodo:** confronto delle dichiarazioni del report Codex con il codice reale del repository. Nessuna dichiarazione è stata accettata senza riscontro nel codice o a runtime.

## 0. Contesto onesto
Questa sessione Claude aveva realizzato in precedenza un hero cinematografico "fuoco → agnolotti" (commit `3c3a073`, antenato verificato di HEAD). **Codex ha poi costruito ~25 commit sopra**, sostituendo/estendendo quel lavoro con un "immersive flagship system" molto più ampio. La BASE APPROVATA è quella di Codex; questa verifica la tratta come tale.

## 1. Ambiente e limiti (dichiarati)
Verifiche **eseguibili** in questo ambiente: git, `node --check`, link/asset checker, audit SEO statico, console runtime e DOM su Chromium integrato.
Verifiche **NON eseguibili** qui (→ marcate `NON_VERIFICABILE`): Lighthouse/perf ripetibile, cross-browser reale (Safari/Firefox/iOS/Android), dispositivi fisici, regressione visiva/screenshot dei video (il browser sandbox va in timeout sulle pagine con video autoplay), transcodifica (no ffmpeg).

## 2. Stato Git
- Branch `main`, HEAD `f5138225`, storia lineare.
- Commit Claude `3c3a073` = **antenato confermato** di HEAD (`git merge-base --is-ancestor` → vero).
- Modifiche non committate presenti: **solo** `social-studio/**` (lavoro locale parallelo, verosimilmente Codex). **Non toccate.**
- `tmp/` e `security-audit/` ignorati; non runtime del sito pubblico.
- Nessun submodule; `.gitattributes` = `*.pdf binary`; nessun puntatore LFS.

## 3. Riscontro dichiarazioni Codex ↔ codice reale

| Funzione dichiarata | Stato verificato da Claude | Evidenza indipendente |
|---|---|---|
| Pagine e routing (9 capitoli + supporto) | `CONFERMATO_E_FUNZIONANTE` | 12 pagine; **357 riferimenti locali, 0 rotti** (checker Node) |
| Integrità JS | `CONFERMATO_E_FUNZIONANTE` | 9/9 file `node --check` OK (3.346 righe totali) |
| SEO su pagine primarie | `CONFERMATO_E_FUNZIONANTE` | 11/11 con title, **1 H1**, canonical, og:url, twitter:card, manifest, main, skip-link |
| Video cinematici 01–03 | `CONFERMATO_CON_DIFFERENZE` | DOM presente (Home: 2 `<video>`); **riproduzione visiva non verificabile qui** |
| Video 04 Eventi | `SOLO_DOCUMENTATO` | master assente (`assets/cinematic/source/…04…` non presente) — coerente col report |
| Badge cinematico | `CONFERMATO` | classi/HTML/CSS presenti e nel DOM |
| Controlli Salta / Rivedi | `PRESENTE_MA_NON_RUNTIME_TESTATO` | stringhe/handler in `cinematic-assets.js`, `mono-cinematic.js`, `experience.js` |
| MONO DROP (cursore) | `CONFERMATO` | nodo `.mono-drop` nel DOM; unico canvas/WebGL del sito è `mono-signature.js` |
| O-portale | `CONFERMATO` | nodo `.mono-o-portal` nel DOM |
| **MONO FLOW** | `PARZIALMENTE_IMPLEMENTATO / DA_CHIARIRE` | modulo `mono-navigation.js` caricato, ma il **nodo `.mono-flow` non è stato rilevato** dal probe DOM in home |
| **Tavola MONO** | `CONFERMATO_CON_DIFFERENZE` | presente come esperienza **CSS/DOM**, **non WebGL/Three.js**: `grep THREE` → 0 occorrenze; `mono-3d.js` (MonoTableExperience) **non è caricato** in `index.html` (codice morto). La cornice "otto oggetti WebGL" del report è imprecisa. |
| Reduced motion | `CONFERMATO_STATICAMENTE` | riferito in 10 file; non provato a runtime qui |
| Responsive | `NON_VERIFICABILE` | viewport del browser sandbox inaffidabile (riporta 0/1280); nessun device reale |
| Cross-browser | `NON_VERIFICABILE` | solo Chromium integrato |
| Performance/Lighthouse | `NON_VERIFICABILE` | nessuno strumento perf nell'ambiente |
| Analytics | `PRESENTE_MA_NON_UTILIZZATO` | hook `data-track`/`dataLayer`/`gtag` presenti, ID GA4/GTM vuoti |
| Console errori (home) | `CONFERMATO_PULITO` | 0 errori console al load |

## 4. Discrepanze rispetto al report Codex
1. **Service worker:** il report cita `mono-site-v61`; il codice reale è **`mono-site-v69`** → il report è già superato di 8 versioni (Codex ha continuato a lavorare).
2. **"Tavola MONO / WebGL":** framing impreciso — non esiste Three.js né WebGL per la tavola; è CSS/DOM. `mono-3d.js` è **non caricato** (dead code) e andrebbe rimosso o cablato.
3. **MONO FLOW:** dichiarato `CONFERMATO`; il nodo `.mono-flow` non è emerso dal probe DOM in home → richiede chiarimento (classe diversa, rendering condizionato o non montato in home).
4. **`presentazione.html`:** manca `<h1>` (gerarchia parte da `<h2>`) — minore, pagina `noindex`.

## 5. Conclusione della verifica
Il **prodotto pubblico è reale, tracciato e in buona salute statica**; le funzioni flagship principali sono presenti nel DOM e la home carica senza errori. Le dichiarazioni Codex sono **in larga parte confermate**, con alcune imprecisioni di framing (Tavola/WebGL, versione SW nel report) e un punto da chiarire (MONO FLOW). La certificazione piena resta bloccata dall'ambiente per cross-browser, performance e resa visiva dei video.

**Stato handoff Codex → Claude: RICEVUTO E IN LARGA PARTE VERIFICATO, con riserve documentate (§4).**
