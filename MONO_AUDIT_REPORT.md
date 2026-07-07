# MONO - Audit intervento cinematic 3D

Data: 7 luglio 2026

## Problemi rilevati

- La tavola precedente era più credibile della prima versione, ma restava un reveal fotografico troppo piatto.
- Il sito aveva CTA app ripetute e qualche sezione interna troppo sintetica per sostenere un posizionamento premium.
- Mancavano canonical, sitemap, robots e immagine social condivisibile.
- Il service worker teneva in cache asset vecchi non più coerenti con la nuova direzione.
- Il pop-up app appariva troppo presto rispetto al racconto.

## Correzioni applicate

- Creata una nuova scena hero iperrealistica e cinematografica:
  - `assets/mono-table/mono-table-cinematic-3d.webp`
  - `assets/mono-table/mono-table-cinematic-mobile.webp`
  - `assets/mono-table/mono-og-image.webp`
- Ricostruito il reveal della tavola come esperienza a livelli: piatti oro, grissini, olio, pane madre, burro, vino, dolce e fumo con parallax.
- Aggiornata la logica `MonoTableExperience` con profondità differenziate, luce interattiva e sequenza narrativa più teatrale.
- Aggiunta una sezione prodotti in home centrata su gastronomia, pasticceria e bistrot.
- Rafforzata la sezione app con motivi concreti: ordini, wallet/fedeltà, inviti/promozioni.
- Ritardato il prompt app: ora entra quando il cliente arriva alla sezione app, non appena apre il sito.
- Aggiunti canonical, Open Graph, Twitter Card e schema `FoodEstablishment`.
- Aggiornato cache-busting a `20260707-cinematic-3d-v1`.
- Aggiornato service worker a `mono-site-v13`.

## Verifiche da eseguire

- Desktop: impatto hero, sequenza tavola, parallax e leggibilità CTA.
- Mobile: crop della tavola, peso del pannello narrativo e fluidità scroll.
- SEO: presenza di `robots.txt`, `sitemap.xml`, canonical e immagine OG.
- CTA app: verifica link `Apri app MONO`, wallet e download.

## Nota tecnica

La nuova esperienza evita librerie pesanti e modelli 3D improvvisati: usa un master visual iperrealistico, livelli mascherati, profondità CSS, fumo e luce interattiva. È un approccio premium e mobile-first; un futuro step può sostituire i livelli con asset GLB professionali quando saranno disponibili modelli veri.
