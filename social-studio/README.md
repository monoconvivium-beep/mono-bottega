# MONO Social Studio 1.0

Studio AI per pianificare, generare e organizzare contenuti Instagram e TikTok di MONO.

Ora l'app ha quattro modalita operative:

- **Gemini**: consigliato per generare immagini reali e usabile anche per testi.
- **OpenAI**: consigliato per strategia, copy, critica contenuti e decisioni operative.
- **Doppio motore**: confronto OpenAI + Gemini quando sono configurati entrambi.
- **Demo locale**: apertura diretta di `index.html`, senza chiamate esterne e senza AI reale.

## Avvio con AI reale

### Modalita semplice

Fai doppio clic su:

```text
AVVIA_MONO_SOCIAL_STUDIO.cmd
```

Lo script:

- avvia il server locale;
- apre `http://127.0.0.1:4177/`;
- tiene il server acceso finche la finestra resta aperta.

Poi apri **Impostazioni** e salva una o entrambe le chiavi:

- `GEMINI_API_KEY` per immagini reali e testi Gemini.
- `OPENAI_API_KEY` per testi, decisioni e confronto.

Le chiavi vengono salvate solo in `social-studio/.env.local`, escluso da Git.

### Modalita manuale

1. Crea `social-studio/.env.local` partendo da `.env.example`.
2. Inserisci la chiave solo li:

```text
OPENAI_API_KEY=INSERISCI_CHIAVE_OPENAI_QUI
OPENAI_MODEL=gpt-5.5
GEMINI_API_KEY=INSERISCI_CHIAVE_GEMINI_QUI
GEMINI_TEXT_MODEL=gemini-3.5-flash
GEMINI_IMAGE_MODEL=gemini-3.1-flash-image
GEMINI_IMAGE_SIZE=1K
PORT=4177
```

3. Avvia:

```powershell
cd social-studio
npm start
```

4. Apri:

```text
http://127.0.0.1:4177/
```

Se apri `social-studio/index.html` come file, l'app resta utilizzabile ma usa il fallback demo.

## Cosa include

- Dashboard con cosa pubblicare oggi.
- Brand Brain modificabile.
- Calendario settimanale e mensile.
- Generator per contenuti, Reel/TikTok, carousel, Stories, prompt immagini e prompt video.
- Generazione immagini reali con Gemini quando `GEMINI_API_KEY` e configurata.
- Local Virality Engine per Torino e Santa Rita.
- Campaign Builder, ADV Advisor, Content Critic e Feed Design Advisor.
- Analytics manuale con suggerimenti operativi.
- Task manager con stati editoriali.
- Export Markdown, CSV, JSON e copia negli appunti.

## Architettura

- `index.html`: shell dell'app.
- `styles.css`: interfaccia mobile-first MONO.
- `app.js`: interfaccia, stato locale, chiamate all'agente AI, fallback demo, task, analytics ed export.
- `server.mjs`: backend locale sicuro per chiamare il provider AI senza esporre chiavi nel browser.
- `data-model.ts`: modello dati TypeScript per una futura app Next.js.
- `supabase-schema.sql`: schema iniziale Supabase-ready.
- `.env.example`: esempio variabili ambiente.

## Sicurezza dati

- Le chiavi API non sono mai hardcodate e non vengono mai mandate al browser.
- Il server locale non salva prompt, output, Brand Brain o metriche.
- Le chiamate OpenAI vengono inviate con `store: false`.
- Gemini viene chiamato solo dal server locale: la chiave non finisce nel frontend.
- Le immagini generate non vengono salvate in localStorage come base64; scaricale dal pulsante nell'app se vuoi conservarle.
- L'app ha una **Sessione privata** nelle impostazioni: se attiva, non salva dati nel browser tra una sessione e l'altra.
- `.env` e `.env.local` sono ignorati da Git tramite `.gitignore`.
- Per produzione multiutente usare Supabase con Row Level Security e autenticazione.

## Integrazioni future server-side

Le chiavi non vanno mai hardcodate nel browser. Per la versione con backend usare variabili ambiente lato server:

- `OPENAI_API_KEY`
- `GEMINI_API_KEY`
- `GEMINI_TEXT_MODEL`
- `GEMINI_IMAGE_MODEL`
- `ANTHROPIC_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Il provider server-side puo essere esteso a Claude, Gemini, API immagini, API video, Instagram, TikTok, Meta Ads, Google Business Profile, Google Analytics, Notion, Airtable, Google Drive o Canva.
