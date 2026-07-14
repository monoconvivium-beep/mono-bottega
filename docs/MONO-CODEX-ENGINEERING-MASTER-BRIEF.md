# MONO Codex Engineering Master Brief

Stato dell'implementazione della flagship digitale MONO al 14 luglio 2026.

## Principi applicati

- Il sito resta multipagina, indicizzabile e navigabile senza effetti avanzati.
- Copy, URL, contatti, orari, CTA e contenuti approvati non sono stati riscritti.
- Gli effetti sono progressive enhancement e non sostituiscono HTML, link o controlli.
- Non sono state aggiunte dipendenze JavaScript o librerie 3D.
- Il video delle polpette non è utilizzato.

## Stack e struttura

Il progetto è un sito statico HTML, CSS e JavaScript pubblicato con GitHub Pages. Non esistono build, bundler, router client-side o package manager per il sito pubblico.

Moduli condivisi:

- `styles.css`: design system e layout storico.
- `experience.css`: regia immersiva e scene esistenti.
- `mono-engineering.css`: token, componenti e fallback della fase Engineering Master.
- `mono-experience-config.js`: capitoli, qualità, feature flag e capability detection.
- `cinematic-assets.js`: manifest cinematografico ufficiale.
- `mono-cinematic.js`: video, poster, badge, controlli e memoria di sessione.
- `mono-navigation.js`: MONO FLOW, anteprima capitolo, O-portale e prefetch.
- `mono-signature.js`: MONO DROP e MONO OLIO VIVO.
- `app.js`: interazioni funzionali, menu, analytics e form.
- `experience.js`: scene narrative e Tavola MONO 2.5D.

## Configurazione centrale

`mono-experience-config.js` contiene l'unica mappa narrativa dei nove capitoli:

1. Home
2. Prodotti
3. Cos'è MONO
4. Chi siamo
5. MONO Convivium
6. Eventi
7. App
8. Dove siamo
9. Lavora con noi

Ogni capitolo definisce URL reale, titolo, indice, temperatura, ingresso, uscita, azione primaria, asset cinematico, oggetto narrativo e collegamenti precedente/successivo.

Feature flag disponibili:

- `monoFlow`
- `oPortal`
- `monoDrop`
- `oilTrail`
- `microDroplets`
- `oilRefraction`
- `monoTable`
- `timeTheme`
- `cinematicAutoplay`
- `videoBadges`
- `oilAlive`

Profili disponibili: `full`, `balanced`, `reduced`, `static`. Il profilo viene scelto in base a reduced motion, puntatore, Save-Data, connessione, memoria e capacità hardware.

## Design system

`mono-engineering.css` consolida:

- Cashmere, burro, terracotta, corallo, oliva, champagne e antracite;
- Libre Baskerville per il tono editoriale e Sora per UI e testo;
- scale fluide con `clamp()`;
- spacing, radius, ombre, superfici, z-index, durate ed easing;
- varianti mattino, giorno e sera tramite `data-mono-time`;
- breakpoint e media query per capacità, non solo larghezza.

La variazione oraria usa esclusivamente l'ora locale. Non usa geolocalizzazione e non modifica contenuti.

## Cinematic system

`mono-cinematic.js` legge il manifest e monta un controller condiviso. Ogni film supporta:

- poster immediato;
- WebM con fallback MP4;
- caricamento lazy vicino al viewport;
- audio sempre disattivato;
- riproduzione una volta;
- pausa quando fuori viewport o quando la scheda non è visibile;
- pulsanti HTML reali `Salta` e `Rivedi`;
- memoria di sessione con fallback sicuro;
- badge MONO ancorato al video;
- eventi analytics, se la configurazione analytics esistente è attiva.

La Home utilizza due master ufficiali coordinati: fuoco/pentola e taglio ravioli. Il passaggio al secondo film dipende da scroll e viewport, con timing più breve su mobile. Reduced motion mostra il poster.

### Stato dei quattro film

1. **Fuoco e ravioli — Home:** integrato con due master ufficiali, poster prioritari, badge, Salta e Rivedi.
2. **Cucina magica — Prodotti:** integrato nella pagina Gastronomia come finestra editoriale, play once e lazy loading.
3. **Molte mani — Chi siamo:** integrato nella pagina Chi siamo. Convivium usa soltanto uno still, senza duplicare il film integrale.
4. **Tavola Eventi — Eventi:** struttura, configurazione e fallback sono pronti, ma il master ufficiale non è presente. Nessun video stock o alternativo è stato inventato.

Il master mancante atteso è `assets/cinematic/source/mono-04-tavola-eventi-master.mp4`.

## Badge video

Il badge usa `icons/mono-favicon.svg` e variabili per dimensione, posizione, sfondo, scala, bordo e ombra. È decorativo, responsive, ancorato al contenitore e non intercetta input.

## MONO FLOW

`mono-navigation.js` aggiunge a ogni pagina una `NextChapterPreview` generata dalla configurazione centrale.

Il cambio capitolo è possibile con:

- click o Enter sul link reale;
- trascinamento nella zona esplicita;
- gesto orizzontale intenzionale;
- wheel solo quando la pagina è realmente vicina al fondo;
- frecce da tastiera nella zona finale.

Il sistema non intercetta la lettura verticale normale. Soglie e lock impediscono cambi involontari o doppi. In caso di errore resta disponibile la navigazione HTML standard.

La navigazione mantiene URL reali, deep link, apertura in nuova scheda e cronologia del browser. Dopo un passaggio attivato da MONO FLOW, la pagina destinazione ripristina scroll, focus e annuncio accessibile tramite session state. Il documento successivo viene prefetched solo su dispositivi e connessioni compatibili.

## Portale della O

`MonoOPortal` è una maschera circolare/organica CSS che accompagna i passaggi intenzionali. Nasce come O materica, usa terracotta, rame, champagne e oliva e si riassorbe durante la navigazione. Non modifica il logo ufficiale.

Fallback:

- navigazione standard se View Transition o JavaScript non sono disponibili;
- crossfade breve con reduced motion;
- nessun overlay persistente dopo errori o timeout.

## MONO DROP

`mono-signature.js` implementa un unico overlay globale con:

- lente DOM per la goccia principale;
- canvas 2D per la scia;
- coordinate di input indipendenti dall'elemento visuale;
- `pointer-events: none`, quindi nessuna alterazione del click;
- interpolazione minima via `requestAnimationFrame` e `transform`;
- DPR limitato a 1.5;
- massimo controllato di segmenti e microgocce;
- pausa a puntatore fermo e scheda nascosta;
- degradazione automatica della qualità se il frame time cresce.

La goccia usa oliva dorato, rame e highlight champagne. La rifrazione è limitata all'area della lente e non modifica l'intera pagina.

### Scia e riassorbimento

La scia viene disegnata come una sequenza corta di punti viscosi. Ogni punto viene richiamato verso la posizione corrente e rimosso entro circa 420 ms. Non dissolve come fumo e non crea una coda lunga.

### Microgocce

Una o due microgocce possono staccarsi soltanto durante cambi di direzione rapidi e con frequenza limitata. Vengono attirate nuovamente verso la goccia principale. Il sistema impone un massimo rigido di due.

### Stati

Gli elementi possono usare `data-cursor-label`. Le etichette contestuali includono `ENTRA`, `SCOPRI`, `ASSAGGIA`, `PORTAMI`, `SCRIVI`, `SCORRI`, `GUARDA`, `SALTA` e `RIVEDI`. I pulsanti e i link HTML restano sempre presenti.

Su touch, puntatore non fine, Save-Data, profilo statico o reduced motion, MONO DROP avanzato non viene attivato.

## MONO OLIO VIVO

MONO OLIO VIVO è un effetto distinto dal cursore. È applicato con pseudo-elementi, gradienti, maschere e trasformazioni CSS soltanto a CTA principali, O-portale e momenti selezionati. Non è un background continuo e non richiede WebGL.

Con reduced motion resta una superficie statica o un crossfade.

## Tavola MONO

La Tavola MONO resta una composizione 2.5D basata su asset WebP, layer CSS, profondità, ombre e movimento limitato. Non è stato introdotto Three.js perché gli asset disponibili non giustificano un modello 3D pesante o di qualità inferiore.

La memoria locale usa la chiave `mono-visited-chapters` e registra soltanto gli ID dei capitoli visitati. Lo storage è protetto da `try/catch`; se non disponibile, la tavola usa uno stato predefinito.

## Responsive e reduced motion

Desktop abilita il profilo completo quando le capacità lo consentono. Tablet riduce profondità, durata e gesture. Mobile:

- non mostra cursore, scia o microgocce;
- non richiede WebGL;
- usa poster immediati e video contenuti;
- non applica scroll hijacking;
- conserva CTA, menu e contenuti HTML;
- riduce titoli e transizioni;
- evita overflow orizzontale.

Con `prefers-reduced-motion: reduce` autoplay, trail, microgocce, grandi slide, parallax e distorsioni vengono disattivati. Poster, link, CTA e controlli restano disponibili.

## Progressive enhancement e fallback

Livelli effettivi:

1. HTML, CSS, URL, contenuti, CTA e poster.
2. Reveal, film e microinterazioni.
3. MONO FLOW, O-portale e label contestuali.
4. Scia, rifrazione, OLIO VIVO e Tavola 2.5D.

Errori di video, storage, observer, canvas o View Transition non bloccano navigazione, scroll o contenuti.

## Performance

- Nessuna nuova dipendenza e nessun bundle.
- Nessun Three.js o WebGL globale.
- I master video non vengono precached dal service worker.
- Le richieste video, comprese quelle range, restano network-first e non vengono inserite nella cache applicativa.
- Poster e moduli critici sono in precache.
- I film non prioritari vengono collegati solo vicino al viewport.
- Video e canvas vengono messi in pausa quando non utili.
- Prefetch del capitolo successivo disattivato con Save-Data o connessione lenta.

## Accessibilità

- URL e link reali restano la base del sistema.
- Salta e Rivedi sono pulsanti HTML con focus visibile e area utile.
- MONO DROP non intercetta input e non sostituisce il focus da tastiera.
- L'anteprima capitolo è utilizzabile con tastiera.
- Il cambio via MONO FLOW prepara focus e annuncio del nuovo capitolo.
- Reduced motion e touch ricevono una versione semplificata.
- I contenuti testuali restano nel DOM e ogni pagina conserva un singolo H1.

## SEO e analytics

Canonical, title, description, Open Graph, dati strutturati, sitemap, robots e heading esistenti sono conservati. Il sistema non trasforma il sito in canvas o SPA.

Gli eventi passano attraverso il tracker già presente. Sono previsti menu, capitolo precedente/successivo, navigazione orizzontale, video start/skip/complete/replay, O-portale, App, Maps, eventi e candidatura. MONO DROP non registra coordinate o traiettorie.

## Verifiche eseguite

- Sintassi JavaScript con `node --check` su tutti i moduli e sul service worker.
- Controllo whitespace/diff con `git diff --check`.
- Verifica strutturale dei moduli inclusi nelle pagine pubbliche.
- Test locale reale in browser Chromium su Home, Gastronomia, Chi siamo, Convivium ed Eventi.
- Controllo console: nessun errore o warning nelle pagine verificate.
- Controllo overflow a viewport desktop e 390×844: nessun overflow.
- Verifica mobile: MONO DROP nascosto, video e NextChapterPreview contenuti.
- Verifica film: nessun controllo nativo, nessun loop, audio disattivato; Rivedi e Salta azionati realmente su Home e Prodotti.
- Verifica MONO FLOW: cambio Eventi → App, scroll top, focus sul main e browser Back verso Eventi.

Non sono stati eseguiti Lighthouse, Safari, Firefox, iOS reale o Android reale nell'ambiente disponibile. Non esiste una build o una suite lint/test del sito statico da eseguire.

## Coerenza cromatica sito ↔ app

La palette dell'app è ora la fonte normativa del sito. Primitive, token semantici, contrasti, eccezioni e QA sono descritti in `docs/MONO-SHARED-COLOR-SYSTEM.md`; il formato machine-readable è `docs/MONO-SHARED-COLOR-TOKENS.json`. Il sito consuma il master `mono-colors.css` prima degli altri fogli di stile. Il punteggio corrente è 97/100: resta esclusa soltanto la verifica browser completa delle schermate autenticate e non esiste ancora un package di token fisicamente condiviso tra i due repository.

## Limiti e interventi futuri

- Il quarto master ufficiale Eventi è assente; la pagina usa il proprio fallback editoriale, senza video sostitutivo.
- Non esistono derivati mobile dedicati dei tre film disponibili; il layout preserva i master orizzontali.
- Una verifica finale su Safari iOS, Chrome Android, Firefox ed Edge reali resta consigliata dopo la pubblicazione.
- I parametri del badge possono essere affinati da screenshot quando arriverà il quarto master.
