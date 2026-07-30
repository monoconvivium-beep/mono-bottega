# MONO brand assets

Varianti operative normalizzate per il sito MONO.

- `mono-logo-primary.svg` - logo principale, l'unico che le pagine usano
  davvero (verificato: 15 pagine su 15) ed e' anche l'unico precaricato dal
  service worker.
- `mono-convivium-primary.svg` - Convivium terracotta/antracite su chiaro.
- `mono-convivium-cuore-rosso.svg` - il cuore di posate di MonoConvivium.

## 30/7 — tolte sei varianti che nessuno apriva

Erano qui `mono-logo-light.svg`, `mono-logo-mono.svg`, `mono-logo-champagne.svg`,
`mono-loghissimo-light.svg`, `mono-convivium-light.svg` e `mono-convivium-warm.svg`:
855 kB in tutto, **zero riferimenti** in qualunque pagina, CSS, JS o manifest.
Erano gia' segnalate come inutili nei commenti del service worker il 29/7.
Se un domani ne serve una, sta nella storia di git: `git log --all -- <percorso>`
e poi `git checkout <commit> -- <percorso>`.
