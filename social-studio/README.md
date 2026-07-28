# MONO AI

Un social media manager AI ridotto all'essenziale:

- scrivi cosa vuoi;
- GPT ragiona, fa brainstorming e prepara il contenuto;
- Gemini crea automaticamente l'immagine o il video nel formato corretto.

Non ci sono dashboard, calendari, task o scelte tecniche nell'interfaccia principale.

## Avvio

Fai doppio clic su:

```text
APRI_MONO_AI.cmd
```

Il vecchio `1_APRI_MONO_SOCIAL_STUDIO.cmd` continua a funzionare e rimanda allo stesso avvio.

L'indirizzo corretto è:

```text
http://127.0.0.1:4177/
```

## Uso

Scrivi normalmente, per esempio:

```text
Fammi un reel sul tiramisù di oggi.
```

Il formato viene deciso automaticamente:

- Reel e TikTok: video verticale `9:16`;
- Stories: immagine verticale `9:16`;
- Carosello e post: immagine `4:5`.

Per fare solo brainstorming basta dirlo nella richiesta.

## Connessioni

Apri l'ingranaggio in alto e inserisci:

- chiave OpenAI per GPT;
- chiave Gemini per immagini e video.

Le chiavi vengono verificate e salvate solo in `social-studio/.env.local`, escluso da Git. Il server ascolta esclusivamente su `127.0.0.1`, non registra prompt e usa `store: false` nelle richieste che lo supportano.

Le API possono richiedere credito del relativo account. La generazione video può impiegare più tempo di quella delle immagini.

Senza chiave OpenAI resta disponibile una bozza locale dichiarata come tale. Senza Gemini il testo viene comunque creato, ma l'app non finge di aver generato il visual.
