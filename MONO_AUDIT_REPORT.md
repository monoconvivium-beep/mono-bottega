# MONO - Audit pulizia sito

Data: 8 luglio 2026

## Problemi rilevati

- La versione precedente risultava troppo carica e poco chiara.
- Il racconto della tavola appariva più come esercizio grafico che come contenuto utile.
- I visual disegnati dei prodotti non avevano qualità sufficiente.
- Il prompt app e il bottone flottante aggiungevano rumore.
- Il mobile aveva troppi elementi nel primo impatto.

## Correzioni applicate

- Hero trasformata in video minimal con cucina scura, fuoco, rame e fumo, senza descrizioni narrative superflue.
- Testi riscritti con tono più semplice: cosa vendiamo, perché fidarsi, dove agire.
- Navigazione riportata su sezioni utili: bottega, prodotti, Convivium, app, contatti.
- Pagine interne pulite e rese più commerciali.
- Rimosso codice popup e stile collegato.
- Service worker aggiornato a `mono-site-v18`.
- Cache-busting aggiornato a `20260710-kitchen-fire-v1`.

## Verifiche da eseguire

- Desktop: leggibilità hero, CTA, menu e sezioni prodotto.
- Mobile: crop immagine, menu, lunghezza testi e assenza di confusione visiva.
- SEO: canonical, Open Graph, Twitter Card, schema `FoodEstablishment`, `robots.txt`, `sitemap.xml`.
- CTA app: verifica eventi su header, hero, app gateway, contatti e Convivium.

## Nota tecnica

La nuova versione resta senza librerie pesanti. Prima di introdurre vero 3D,
servono asset approvati e leggeri, con fallback statico e caricamento dopo LCP.
