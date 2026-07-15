# CLAUDE — Handoff finale (audit indipendente MONO)

**Da:** team di revisione Claude · **A:** proprietario, Codex, o altro sviluppatore
**Data:** 2026-07-15 · **Branch:** `main` · **HEAD di riferimento:** `f5138225`

## 1. Cosa ho verificato (con prova)
- **Git/ancestry:** il lavoro Claude precedente (`3c3a073`, hero fuoco→agnolotti) è antenato di HEAD; Codex ha costruito ~25 commit sopra ed è la **base approvata**.
- **JS:** 9/9 moduli `node --check` OK.
- **Link/asset:** checker Node su 12 pagine → **357 riferimenti locali, 0 rotti**.
- **SEO:** 11/11 pagine primarie complete (title, 1 H1, canonical, og:url, twitter:card, manifest, main, skip-link).
- **Runtime home (Chromium):** 0 errori console; H1 unico; 2 video; `.mono-drop`, `.mono-o-portal`, badge, cinema-hero presenti nel DOM.
- **Service worker:** `mono-site-v69`.
- **Copy home:** estratta e revisionata (buona qualità, brand-coerente).

## 2. Cosa NON ho potuto verificare (ambiente)
Cross-browser reale (Safari/Firefox/iOS/Android), Lighthouse/performance ripetibile, dispositivi fisici, resa visiva/regressione dei film (il browser sandbox va in timeout sulle pagine con video autoplay), transcodifica (no ffmpeg). Queste restano **da certificare su strumenti/dispositivi reali** (backlog ENV-1..4).

## 3. Cosa ho corretto
**Nessuna modifica al codice del sito.** Motivazione professionale: (a) non ho trovato bug oggettivi bloccanti (0 link rotti, 0 errori console, JS valido, SEO completa); (b) il repo ha **lavoro parallelo attivo non committato** (`social-studio/**`, verosimilmente Codex) e la base è "approvata" — modificare alla cieca i file Codex avrebbe violato il mandato "non alterare il lavoro approvato". I due unici fix sicuri (H1 su `presentazione.html`; rimozione `mono-3d.js` dead code) sono **documentati e pronti**, non applicati d'ufficio.

## 4. Cosa ho lasciato invariato (di proposito)
Tutto il codice e gli asset del sito Codex, incluso `social-studio/**` (non toccato), `tmp/` e `security-audit/` (ignorati).

## 5. Cosa propongo (dettaglio in `docs/CLAUDE-IMPROVEMENT-BACKLOG.md`)
- **Sicuri:** H1 su presentazione, rimuovere dead code, rigenerare il QA report (SW v69), chiarire MONO FLOW.
- **Ambiente reale:** Lighthouse, cross-browser, regressione video, responsive reale.
- **Proprietario:** master Film 04 Eventi, ID GA4/GTM, foto reali del banco, Google Business/Search Console.
- **Creativi (da approvare):** prova prodotto con foto reali, evidenza app, micro-storie Santa Rita, eventuale mascotte "Monino".

## 6. File creati da questo audit
- `docs/handoff/CODEX-TO-CLAUDE-VERIFICATION.md` (+ `.json`)
- `docs/CLAUDE-INDEPENDENT-SITE-AUDIT.md`
- `docs/CLAUDE-BRAND-AND-CONVERSION-REVIEW.md`
- `docs/CLAUDE-IMPROVEMENT-BACKLOG.md`
- `docs/CLAUDE-FINAL-SITE-RESULTS.json`
- `docs/handoff/CLAUDE-FINAL-HANDOFF.md` (questo file)

## 7. File modificati (codice)
Nessuno.

## 8. Test eseguiti
`git` (branch/HEAD/ancestry), `node --check` ×9, checker link/asset Node (357 ref), parser SEO Node (12 pagine), console+DOM probe Chromium (home). Nessun `package.json` → nessuna suite build/lint/unit da eseguire (registrato come `NON_TROVATO`, non come fallimento).

## 9. Cosa resta da decidere (proprietario)
1. Applicare i fix sicuri SF-1..SF-4?
2. Chi esegue le verifiche ambiente-reale (ENV-1..4)?
3. Master Film 04 e foto reali del banco: quando?
4. Attivare raccolta email reale (endpoint) e analytics?

## 10. Verdetto sintetico
**C — tecnicamente pronto, migliorabile prima del lancio**, con **certificazione indipendente parziale**: repository e runtime home verificati e puliti; cross-browser/performance/resa video **non** certificati in questo ambiente. Nessun difetto bloccante o alto emerso su ciò che ho potuto ispezionare. Coerente (non identico) con l'autovalutazione Codex C/88.
