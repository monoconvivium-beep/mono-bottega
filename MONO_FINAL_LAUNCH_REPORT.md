# MONO - Final flagship launch report

Data: 7 luglio 2026

## Fatto

- Sistema logo normalizzato in `assets/brand/` con varianti primary, light, mono, champagne e Convivium.
- Header, hero e Convivium usano varianti brand corrette senza filtri CSS che alterano i colori.
- Icone PWA aggiornate con sigillo MONO coerente con palette premium.
- Visual prodotto editoriali 3D-like in `assets/product-visuals/` per gastronomia, pasticceria, aperitivo e catering.
- Homepage e pagine prodotto integrano visual leggeri con hover/tilt 3D interattivo.
- Tracking CTA reso GA4/GTM-ready con eventi `mono_cta_click`, `dataLayer` e caricamento script solo con ID reali.
- SEO tecnico rafforzato con schema `FoodEstablishment`, `priceRange`, `hasMenu` e reparti.
- Cache-busting aggiornato a `20260707-flagship-final-v1`.
- Service worker aggiornato a `mono-site-v16`.

## Non Inventato

Non sono stati pubblicati dati non verificati per indirizzo completo, telefono, orari, link social ufficiali, ID Search Console, ID GA4/GTM o Google Business Profile.

## Per Chiudere Il 100%

Servono dal cliente:

1. indirizzo completo della bottega;
2. telefono pubblico;
3. orari ufficiali;
4. link Instagram/Facebook/Google Maps;
5. dominio personalizzato;
6. ID Google Search Console;
7. ID GA4 o container GTM;
8. eventuali foto reali prodotto o approvazione definitiva dei visual 3D generativi.

## Nota 3D

È stato scelto un 3D interattivo CSS/SVG leggero, coerente con performance e mobile-first. Un vero GLB con Three.js o `model-viewer` resta consigliato solo dopo produzione di modelli reali compressi.
