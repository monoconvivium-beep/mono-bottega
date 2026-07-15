# CLAUDE — Backlog migliorie MONO (indipendente)

Classificazione: **P0** (prima del lancio) · **P1** (alto impatto) · **P2** (rifinitura) · **P3** (futuro).
Valutazioni 1–5. Nessun P1/P2/P3 va applicato senza approvazione del proprietario se cambia direzione/copy/identità.

## A. Correzioni sicure (da applicare in modo controllato, non alla cieca)
| ID | Intervento | Prio | Impatto cliente | Sforzo | Rischio | Note |
|---|---|---|---|---|---|---|
| SF-1 | Aggiungere un `<h1>` a `mono-convivium/presentazione.html` (promuovere il titolo hero) | P2 | 2 | 1 | 1 | pagina `noindex`; accessibilità/gerarchia heading |
| SF-2 | Rimuovere o cablare `mono-3d.js` (dead code non caricato) | P2 | 1 | 1 | 2 | verificare prima riferimenti dinamici/build |
| SF-3 | Rigenerare il QA report Codex (SW reale v69, non v61) | P2 | 1 | 1 | 1 | allineare documentazione allo stato reale |
| SF-4 | Chiarire/ripristinare MONO FLOW in home o correggere la dichiarazione | P1 | 3 | 2 | 2 | nodo `.mono-flow` non rilevato dal probe |

## B. Verifiche che richiedono ambiente reale (non eseguibili qui)
| ID | Intervento | Prio | Perché |
|---|---|---|---|
| ENV-1 | Lighthouse mobile ripetibile (LCP/CLS/INP/TBT) con throttling | P1 | performance non misurata; 2 video pesano ~5MB |
| ENV-2 | Smoke test reale Safari/Firefox + iPhone/Android | P1 | View Transitions, backdrop-filter, autoplay, cursore |
| ENV-3 | Regressione visiva dei 4 film (crossfade, poster, no black frame) | P1 | resa video non ispezionabile in sandbox |
| ENV-4 | Test responsive reale 320→1920 + zoom 200% | P1 | viewport sandbox inaffidabile |

## C. Contenuti/asset in attesa del proprietario
| ID | Intervento | Prio |
|---|---|---|
| OWN-1 | Master approvato Film 04 "Tavola eventi" | P1 |
| OWN-2 | ID GA4/GTM reale per attivare il tracking CTA | P2 |
| OWN-3 | Poster statico agnolotti/foto reali del banco (prodotto vero > AI) | P1 |
| OWN-4 | Google Business Profile + Search Console per il local discovery | P1 |

## D. Proposte creative (SOLO da approvare — non applicare)
Ogni proposta supera il test "potrebbe esistere solo da MONO?".
| ID | Proposta | Problema risolto | Impatto cliente | Impatto commerciale | Distintività MONO | Sforzo | Rischio | Prio | Consiglio |
|---|---|---|---:|---:|---:|---:|---:|---|---|
| CR-1 | Prova prodotto concreta: 3–4 "firme MONO" con foto reali del banco (senza prezzi, il prezzo vive nell'app) | il sito racconta ma non fa "venire fame" | 5 | 5 | 4 | 3 | 2 | P1 | fortemente consigliato all'apertura |
| CR-2 | Micro-storie gastronomiche legate a Santa Rita (quartiere) | radicamento locale + fiducia | 3 | 3 | 5 | 2 | 1 | P2 | consigliato |
| CR-3 | Rendere l'app più evidente come "motore" (un blocco esplicito ordina/wallet/punti) | il sito non deve duplicare l'app ma indirizzarla | 4 | 4 | 3 | 2 | 1 | P1 | consigliato |
| CR-4 | "Monino" (mascotte editoriale che scorre) — già discussa in sessione precedente | memorabilità + piacere di scorrere | 3 | 2 | 4 | 4 | 3 | P3 | valutare solo dopo che il core è certificato |
| CR-5 | Ridurre il peso dei film / offrire poster-first su rete lenta (Save-Data) | performance mobile | 4 | 3 | 2 | 3 | 2 | P1 | consigliato dopo ENV-1 |

## E. Cose da NON fare (coerenza brand)
Niente chatbot, popup multipli, gamification invasiva, newsletter aggressiva, carousel generici, stock photography, WebGL senza funzione, o eliminazione di parti approvate. (Allineato al brief e alle bible di progetto.)
