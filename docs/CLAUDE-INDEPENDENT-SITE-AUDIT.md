# CLAUDE — Audit indipendente del sito MONO

**Data:** 2026-07-15 · **Branch:** `main` · **HEAD:** `f5138225`
**Natura:** revisione indipendente e non compiacente, confrontabile con il QA Codex (`docs/MONO-FINAL-QA-REPORT.md`, che si autovaluta **C — 88/100**).
**Regola seguita:** nessuna dichiarazione senza riscontro. Ciò che non ho potuto testare è marcato `NON_VERIFICABILE`, non "ok".

---

## 1. Copertura reale di questo audit
| Dimensione | Metodo | Esito |
|---|---|---|
| Integrità repository/Git | git, ancestry | ✅ eseguito |
| Sintassi JS | `node --check` ×9 | ✅ eseguito |
| Link/asset interni | checker Node su 12 pagine | ✅ eseguito |
| SEO statico per pagina | parser Node | ✅ eseguito |
| Console + DOM runtime (home) | Chromium sandbox | ✅ eseguito (parziale) |
| Presenza feature flagship | grep + probe DOM | ✅ eseguito |
| Responsive reale | — | ❌ `NON_VERIFICABILE` (viewport sandbox inaffidabile) |
| Cross-browser | — | ❌ `NON_VERIFICABILE` (solo Chromium) |
| Performance/Lighthouse | — | ❌ `NON_VERIFICABILE` (no tooling) |
| Resa visiva video / regressione | — | ❌ `NON_VERIFICABILE` (timeout sandbox su autoplay) |

> Onestà professionale: **circa metà delle 40 sezioni del brief richiede un ambiente (Lighthouse, Safari/Firefox, device reali, screenshot video) qui non disponibile.** Questo audit certifica con forza il livello statico/strutturale e in modo parziale il runtime; NON certifica cross-browser, performance né la resa visiva dei film.

## 2. Risultati verificati (fatti, non opinioni)
- **JS:** 9/9 moduli passano `node --check` (app, cinematic-assets, experience, mono-3d, mono-cinematic, mono-experience-config, mono-navigation, mono-signature, service-worker). 3.346 righe totali.
- **Link/asset:** **357 riferimenti locali su 12 pagine, 0 rotti.**
- **SEO:** 11/11 pagine primarie con title, **esattamente 1 H1**, canonical, og:url, twitter:card, manifest, `<main>`, skip-link.
- **Runtime home:** 0 errori console; H1 unico ("Buono come una volta. Pensato per la vita di oggi."); 2 `<video>`; nodi `.mono-drop`, `.mono-o-portal`, badge, cinema-hero presenti.
- **Service worker:** `mono-site-v69`.
- **Video 04 Eventi:** master assente (coerente con il report: pagina editoriale, nessun falso video).

## 3. Problemi rilevati (con severità)
| # | Problema | Severità | Prova | Azione |
|---|---|---|---|---|
| 1 | Nessun blocco/critico riscontrato nel percorso pubblico statico | — | 0 link rotti, 0 errori console | — |
| 2 | `mono-3d.js` non caricato in nessuna pagina (dead code) | BASSA | assente dagli `<script>`; grep conferma | rimuovere o cablare (backlog, non blind) |
| 3 | "Tavola MONO" presentata come WebGL/Three.js ma è CSS/DOM | BASSA | `grep THREE` = 0; unico canvas = cursore | correggere il *framing* nei doc, non il codice |
| 4 | MONO FLOW: nodo `.mono-flow` non rilevato in home | MEDIA | probe DOM negativo | chiarire con Codex (classe/condizione/rendering) |
| 5 | `mono-convivium/presentazione.html` senza `<h1>` | BASSA | parser: H1=0 | promuovere il titolo hero a `<h1>` (noindex) |
| 6 | Video 04 Eventi mancante | MEDIA | master assente | serve master approvato dal proprietario |
| 7 | Analytics non attivo (GA4/GTM vuoti) | MEDIA | hook presenti, ID vuoti | inserire ID reale quando pronto |
| 8 | Report Codex già stale (SW v61 vs v69) | INFO | confronto | rigenerare report a fine ciclo |

**Nessuna correzione di codice applicata da Claude in questo passaggio**: gli unici candidati sicuri (#2, #5) toccano file Codex in un repo con lavoro parallelo attivo (`social-studio/**` non committato). Per non pestare i piedi e non alterare la base approvata, sono documentati come fix sicuri **da applicare in modo controllato** (vedi backlog), non eseguiti alla cieca.

## 4. Confronto con il QA Codex
Il QA Codex (C/88) è, sui punti che ho potuto ricontrollare, **sostanzialmente onesto e verificato**: link puliti, SEO completa, JS valido, 0 errori console — tutto confermato indipendentemente. Le riserve sono di *framing* (Tavola/WebGL), di *freschezza* (SW v61→v69) e un *chiarimento* (MONO FLOW). Non ho trovato dichiarazioni gonfiate sul percorso pubblico critico.

## 5. Punteggio indipendente (solo aree verificabili qui)
| Area | Peso | Punteggio | Nota |
|---|---:|---:|---|
| Integrità tecnica (JS, link, SW) | 15% | 14/15 | dead code residuo |
| Navigazione/routing | 10% | 9.5/10 | 0 ref rotti; MONO FLOW da chiarire |
| Asset e media | 10% | 8.5/10 | 04 mancante, 01–03 non validati visivamente |
| SEO/local | 10% | 9.5/10 | completa e coerente |
| Accessibilità (statica) | 10% | 8.5/10 | 1 H1/pagina ok; presentazione senza H1 |
| Brand coherence (struttura) | 10% | 8/10 | vedi review brand |
| Coerenza sito-app | 5% | 4/5 | token colore condivisi presenti; non pixel-validati |
| Interazione/motion | 5% | 3.5/5 | presente nel DOM, non validata visivamente |
| Chiarezza commerciale | 10% | 7.5/10 | vedi review conversione |
| Responsive/mobile | 10% | `N/V` | non verificabile qui |
| Performance | 5% | `N/V` | non verificabile qui |

**Punteggio sulle sole aree verificabili: ~86/100.** Le due aree pesanti non verificabili (responsive, performance) impediscono un punteggio complessivo certificato.

## 6. Verdetto indipendente
**C — TECNICAMENTE PRONTO, MIGLIORABILE PRIMA DEL LANCIO**, con l'avvertenza esplicita che la mia **certificazione indipendente è parziale (condizione E)** sulle dimensioni cross-browser, performance e resa video, che restano da validare su strumenti/dispositivi reali. 
- Repository verificato: **sì (forte)**
- Runtime home verificato: **sì (parziale, pulito)**
- Live cross-browser/perf verificato da Claude: **no**

Nessun difetto **bloccante o alto** emerso sul percorso pubblico che ho potuto ispezionare. Il verdetto C (non B) dipende da: film 04 mancante, MONO FLOW da chiarire, e dall'impossibilità di chiudere qui responsive/perf/cross-browser.
