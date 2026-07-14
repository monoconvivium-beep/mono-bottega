# MONO — Rapporto finale di Quality Assurance

## 1. Certificazione

- **Data:** 15 luglio 2026, Europe/Rome
- **Repository:** `C:\Users\feder\Documents\New project`
- **Branch:** `main`
- **Baseline:** `573cd1343dc777679796cf37fc637e80d612ae52`
- **Release QA:** `a5b419c879641ea5fdebea1006ba2e9afd25cb77`
- **Sito:** `https://monobottega.it/`
- **Verdetto prodotto:** **C — completo e utilizzabile con rifiniture medie**
- **Punteggio:** **88/100**
- **Difetti critici o alti aperti sul percorso pubblico:** **0**
- **Visibilità handoff Claude:** **D — non visibile o non verificabile**

Il sito pubblico è navigabile, coerente, accessibile nelle funzioni fondamentali e le correzioni QA risultano pubblicate e verificate sul dominio ufficiale. Non viene certificato al 100% perché mancano il film Eventi approvato, una suite automatica ripetibile, il test su browser/dispositivi reali e il pacchetto documentale Claude richiesto. Le funzioni flagship sono state ricostruite e controllate direttamente sul repository.

### Verifica live

- **Stato:** `LIVE_VERIFIED`
- **Data:** 15 luglio 2026, 01:53 Europe/Rome
- **URL cache-bust:** `https://monobottega.it/?v=20260715-final-qa-v1`
- **Smoke test:** 10/10 percorsi pubblici con risposta HTTP `200`.
- **Contenuti verificati:** copy Home aggiornato, CTA app verso `/home`, cache `mono-site-v61`, Convivium con `main`, indirizzo 72D e nessun telefono non autorizzato.

## 2. Perimetro verificato

### Capitoli principali

1. Home
2. Prodotti
3. Cos'è MONO (`/#bottega`)
4. Chi siamo
5. MONO Convivium
6. Eventi
7. App
8. Dove siamo
9. Lavora con noi

### Pagine di supporto

- Pasticceria
- Aperitivo
- Catering
- Presentazione Convivium secondaria, marcata `noindex`

### Sistemi condivisi

- MONO FLOW e navigazione capitoli;
- O-portale;
- MONO DROP, scia oleosa, microgocce, rifrazione e riassorbimento;
- MONO OLIO VIVO;
- Tavola MONO e memoria capitoli;
- film cinematici, poster, badge, Salta e Rivedi;
- menu, CTA, newsletter, service worker;
- SEO, social metadata, semantica e reduced motion.

## 3. Verifica handoff Claude → Codex

Il pacchetto formale richiesto non è presente: mancano `PROJECT-HANDOFF-INDEX.md`, report Claude, inventario, manifest hash e script `verify-claude-handoff.mjs`. L'esecuzione del comando obbligatorio termina con exit code `1` e `MODULE_NOT_FOUND`.

Le tre bible, il README cinematico, il manifest applicativo e gli asset 01–03 sono invece presenti e tracciati. Per questo il sito è stato verificato autonomamente, funzione per funzione. Dettaglio completo:

- `docs/handoff/CODEX-CLAUDE-HANDOFF-VERIFICATION.md`
- `docs/handoff/CODEX-CLAUDE-HANDOFF-VERIFICATION.json`

## 4. Esiti dei test

### Audit statico

- **9 script JavaScript condivisi:** `node --check` superato.
- **11 documenti HTML pubblici:** title, un H1, main, skip link, canonical, OG URL, Twitter Card e manifest presenti.
- **ID duplicati:** nessuno.
- **Link/file interni mancanti:** nessuno.
- **Riferimenti service worker mancanti:** nessuno.
- **`git diff --check`:** superato; restano solo avvisi di conversione LF/CRLF non funzionali.
- **Segreti pubblici:** nessuno rilevato.
- **Link telefonici non autorizzati:** rimossi.

### Navigazione e stabilità

- I nove capitoli sono raggiungibili e la sequenza precedente/successivo è coerente.
- Il deep link `/#bottega`, Back e Forward funzionano.
- Le pagine principali caricano senza errori o warning console nel browser Chromium disponibile.
- MONO FLOW, O-portale, MONO DROP, Tavola MONO e superfici OLIO VIVO vengono renderizzati nel DOM.
- Tutti gli oggetti della Tavola MONO possono assumere lo stato ricordato tramite `mono-visited-chapters`; non vengono memorizzati dati personali.
- `https://app.monobottega.it/home` è raggiungibile e conduce al flusso app `/onboarding`.

### Cinematici

- Home 01: due segmenti, poster-first, play-once, Salta e Rivedi verificati.
- Prodotti 02: WebM/MP4 1280×720, 10 s, poster, Salta e Rivedi verificati.
- Chi siamo 03: WebM/MP4 1280×720, 10 s, poster, Salta e Rivedi verificati.
- Eventi 04: master non ricevuto; pagina editoriale attiva, senza video stock o fallback falso.
- Tutti i 17 asset dichiarati dal manifest sono presenti, non vuoti, tracciati, con firma formato valida e non LFS.
- Audio pubblico disattivato, `playsinline`, niente controlli nativi e niente loop infinito.

### Responsive e mobile

- Primo ciclo: matrice di 90 combinazioni pagina/larghezza da 320 a 1920 px, senza overflow materiale; un solo arrotondamento di 1 px tollerato su Prodotti a 320 px.
- MONO DROP è escluso dall'esperienza touch tramite capability/fine pointer e media query.
- Controlli mobili portati a minimo 44 px.
- Menu mobile chiudibile con `Escape`, stato ARIA aggiornato e focus restituito al toggle.
- Secondo ciclo: il controllo viewport del browser integrato non ha applicato l'override 390 px e ha continuato a riportare 1280 px; la regressione è stata quindi completata con audit CSS, codice e computed style. Resta obbligatorio un controllo finale su telefono reale.

### Accessibilità

- Un solo H1 per pagina e landmark `main` presenti.
- Skip link presente anche nella pagina Convivium.
- Reduced motion e save-data riducono autoplay, portale e motion avanzato.
- Controlli cinematici hanno label accessibili.
- Focus e tasti direzionali supportati nel flusso capitoli.
- Titoli interni Convivium riallineati nella gerarchia ARIA.

### SEO e local

- Canonical coerente su tutte le pagine principali.
- `og:url` e `twitter:card` completati sulle pagine interne.
- `robots.txt`, `sitemap.xml`, manifest e schema locale presenti.
- Indirizzo pubblico uniformato a Via Barletta 72D, Torino, Santa Rita.
- La presentazione duplicata Convivium è `noindex` e canonica verso la pagina principale.
- L'indicizzazione e il posizionamento Google non sono immediati né garantibili dal solo codice; richiedono Search Console, Google Business Profile e tempo di scansione.

### Privacy e tracking

- La newsletter non conserva più l'email dell'utente in `localStorage`.
- Gli hook `data-track`, `dataLayer` e `gtag` sono presenti.
- GA4 e GTM non sono attivi: gli identificativi sono volutamente vuoti e non vengono inventati.

## 5. Correzioni applicate

1. Link app uniformati a `https://app.monobottega.it/home`.
2. Metadata social completati sulle pagine interne.
3. Convivium reso semanticamente coerente con main, skip link, manifest e heading ARIA.
4. Numero non autorizzato rimosso e indirizzo corretto in `72D`.
5. Presentazione secondaria Convivium marcata `noindex` con canonical corretto.
6. Email newsletter non più persistita localmente.
7. Menu mobile chiudibile con `Escape` e focus restore.
8. Target touch menu/pausa portati a 44 px.
9. Copy obsoleti riallineati alla versione editoriale corrente.
10. Cache service worker aggiornata a `mono-site-v61`.

## 6. Valutazione ponderata

| Area | Punteggio |
|---|---:|
| Funzionalità e routing | 19,5 / 20 |
| Contenuti e link | 10 / 10 |
| Responsive e mobile | 13,5 / 15 |
| Video e motion | 12 / 15 |
| Performance | 12 / 15 |
| Accessibilità | 9,5 / 10 |
| SEO/local | 4,5 / 5 |
| Cross-browser | 2 / 5 |
| Stabilità | 5 / 5 |
| **Totale** | **88 / 100** |

## 7. Problemi aperti

### Media

1. **Film 04 Eventi:** serve il master approvato, poi WebM, MP4, poster e controllo del focal point.
2. **Cross-browser reale:** eseguire smoke test su Safari, Firefox, iPhone e Android.
3. **Performance mobile:** eseguire Lighthouse ripetibile con throttling e correggere solo regressioni misurate.
4. **Analytics:** inserire un ID GA4 o GTM reale e verificare gli eventi CTA in DebugView.
5. **Convivium:** il documento integrato pesa circa 477 KB per asset incorporati; può essere alleggerito senza cambiare l'impaginazione.

### Bassa/informativa

1. Recuperare il pacchetto handoff Claude se serve continuità di attribuzione e confronto hash.
2. Sostituire i percorsi app assoluti nei documenti colore con riferimenti portabili quando il repository app verrà formalizzato.
3. Aggiungere una piccola suite automatica root per link, metadata e asset manifest.

## 8. Verdetto finale

**C — SITO COMPLETO E UTILIZZABILE CON RIFINITURE MEDIE.**

Il percorso pubblico non presenta difetti critici o alti noti dopo le correzioni. La pubblicazione è approvata. La categoria C dipende da asset Eventi mancante, copertura browser/dispositivi non completa, assenza di metriche Lighthouse ripetibili e handoff Claude non verificabile.

## 9. Azioni richieste al titolare

1. Aprire il sito una volta da iPhone/Android e da PC dopo la pubblicazione.
2. Inviare il master Eventi quando approvato.
3. Fornire ID GA4/GTM solo quando l'account analytics è pronto.
4. Collegare e verificare Search Console e Google Business Profile.
