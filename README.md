# MONO Bottega Gastronomica

Sito statico gratuito per MONO con catalogo prodotti, carrello, ordine demo,
programma fedelta e notifiche promozionali locali.

## Piattaforma consigliata

La soluzione piu gratuita e semplice e GitHub Pages:

- hosting gratuito per file HTML, CSS e JavaScript;
- dominio incluso del tipo `nomeutente.github.io`;
- possibilita di collegare un dominio acquistato in futuro;
- nessun database obbligatorio per partire.

Alternative valide: Netlify Free o Cloudflare Pages Free. Netlify e piu comodo
se in futuro vuoi moduli, funzioni serverless e integrazioni no-code.

## Pubblicazione gratuita su GitHub Pages

1. Crea un repository GitHub, per esempio `mono-bottega`.
2. Carica tutti i file di questa cartella nel repository.
3. Vai su `Settings` > `Pages`.
4. In `Build and deployment`, scegli `Deploy from a branch`.
5. Seleziona branch `main` e cartella `/root`.
6. Dopo pochi minuti il sito sara online all'indirizzo GitHub Pages indicato.

Se vuoi usare il terminale:

```bash
git add .
git commit -m "Create MONO website"
git branch -M main
git remote add origin https://github.com/TUO-UTENTE/mono-bottega.git
git push -u origin main
```

## Come provarlo

Per vedere correttamente la scena 3D, apri il sito tramite un piccolo server
locale dalla cartella progetto:

```bash
python -m http.server 4173 --bind 127.0.0.1
```

Poi apri `http://127.0.0.1:4173/`.

Per testare installazione app e service worker e meglio pubblicarlo online
oppure servirlo da locale, perche aprire direttamente `index.html` puo bloccare
i moduli JavaScript esterni.

## Flusso incluso

1. Il cliente guarda i prodotti per gastronomia, pasticceria e bistrot.
2. Aggiunge prodotti al carrello.
3. Inserisce dati, telefono e preferenza ritiro/consegna.
4. Conferma un ordine demo.
5. Il sistema salva punti fedelta nel browser del cliente.
6. Il cliente puo attivare notifiche promozionali.

## Esperienza 3D

La home usa una scena Three.js gratuita caricata da CDN. La scena funziona come
ingresso esperienziale al progetto MONO:

- tavola/bancone interattivo;
- mondi colore per gastronomia, pasticceria, bistrot e fedelta;
- movimento al mouse;
- click sugli elementi per entrare nelle sezioni o aprire l'app.

Per una pubblicazione completamente autonoma si puo scaricare Three.js nel
progetto e servirlo localmente, evitando CDN esterne.

## Rapporto sito/app

Il sito pubblico ha il compito di raccontare MONO e generare effetto wow.
L'app esistente su Vercel resta il motore operativo:

- ordini: `https://mono-app-jet.vercel.app/order`;
- wallet: `https://mono-app-jet.vercel.app/wallet`;
- tessera/fedelta: `https://mono-app-jet.vercel.app/home`.

Questa separazione permette di pubblicare il sito gratuitamente su GitHub Pages
senza rinunciare alle funzioni gia sviluppate nell'app.

## Monoconvivium

Nel sito va prevista una sezione dedicata al progetto sociale Monoconvivium.
La presentazione/PDF dovra essere visibile direttamente nella pagina, tramite
viewer incorporato, e disponibile anche come download.

File sorgente indicato: `MONO_Convivium_presentazione.html`.

## Pagamenti online

Per restare a costo zero fisso, il pagamento reale non e ancora collegato.
Quando serve incassare online, la via piu semplice e:

- Stripe Payment Links per link di pagamento prodotto/carrello;
- PayPal.me o PayPal Checkout;
- Satispay Business, se adatto alla bottega.

Questi servizi non richiedono sviluppo backend, ma applicano commissioni sulle
transazioni.

## Branding

Il sito ora usa:

- `mono-loghissimo.svg` per logo principale e hero;
- `mono-convivium.svg` come elemento visuale nel riepilogo ordine.

## Palette MONO

- Cashmere: `#F4ECDD`;
- Warm Butter: `#EFE3C6`;
- Terracotta: `#B85C38`;
- Coral: `#E27A60`;
- Burnt Olive: `#6E6A3C`;
- Champagne: `#CBA75A`;
- Anthracite: `#262321`.

Le icone PWA in `icons/` sono ancora provvisorie. Possiamo sostituirle con una
versione quadrata derivata dal file `mono icon.pdf` o da un SVG dedicato.
