# MONO - Audit intervento hyperreal

Data: 6 luglio 2026

## Problemi rilevati

- La tavola precedente era una CSS illustration: non abbastanza realistica, non coerente con una richiesta avanguardistica.
- Il primo impatto mobile mostrava troppo poco prodotto e troppa interfaccia, con la tavola poco credibile.
- Erano presenti CTA provvisorie verso `#`, etichette App Store / Google Play non ancora collegate a store reali e un riferimento WhatsApp fittizio.
- La pagina Contatti conteneva testo provvisorio tipo "Da completare", non adatto a una pubblicazione pubblica.
- Il sito era troppo vicino alla logica dell'app: troppe funzioni operative e poco racconto del mondo MONO.
- Il CSS conteneva ancora blocchi inutilizzati della tavola disegnata, potenziale fonte di confusione tecnica.

## Correzioni applicate

- Sostituita la tavola illustrata con una sequenza di frame WebP iperrealistici:
  - `assets/mono-table/frame-01-empty.webp`
  - `assets/mono-table/frame-02-bread-oil.webp`
  - `assets/mono-table/frame-03-gastronomy.webp`
  - `assets/mono-table/frame-04-complete.webp`
- Aggiunto un master hero più scenografico per il nuovo reveal:
  - `assets/mono-table/mono-table-master-wow.webp`
- Aggiornata la logica `MonoTableExperience` per gestire frame progressivi, luce interattiva e micro-parallasse.
- Rimossi i CSS obsoleti della tavola disegnata.
- Corretti link morti e sostituiti con destinazioni reali verso app web MONO.
- Riscritta la pagina Contatti eliminando placeholder e testo provvisorio.
- Aggiornato cache-busting a `20260707-wow-table-v1`.
- Aggiornato service worker a `mono-site-v12`.

## Verifiche da eseguire

- Desktop: controllare impatto hero, leggibilità testo e transizione frame.
- Mobile: controllare crop tavola, peso visivo del pannello e fluidità scroll.
- CTA app: verificare che `Apri app MONO` e `Vedi vantaggi` aprano correttamente l'app web.
- Pagine principali: Home, App, MONO Convivium, Contatti.

## Limite ancora presente

La sequenza è iperrealistica tramite frame 3D/render fotografici, non tramite modelli GLB real-time. È una scelta deliberata per ottenere qualità visiva immediata, performance mobile e nessuna libreria pesante. Un futuro step può sostituire i frame con asset 3D professionali WebGL/GLB.
