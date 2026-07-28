import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL(".", import.meta.url));
const MAX_BODY_BYTES = 80_000;
const MAX_MEDIA_BYTES = 40 * 1024 * 1024;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 24;
const requestBuckets = new Map();

loadEnvFile(".env");
loadEnvFile(".env.local");

const PORT = Number(process.env.PORT || 4177);
const STATIC_FILES = new Map([
  ["/", "index.html"],
  ["/index.html", "index.html"],
  ["/app.js", "app.js"],
  ["/styles.css", "styles.css"]
]);

const MIME_TYPES = {
  "index.html": "text/html; charset=utf-8",
  "app.js": "text/javascript; charset=utf-8",
  "styles.css": "text/css; charset=utf-8"
};

const FORMAT_PRESETS = {
  reel: { platform: "Instagram + TikTok", aspectRatio: "9:16", visualType: "video" },
  stories: { platform: "Instagram", aspectRatio: "9:16", visualType: "image" },
  carousel: { platform: "Instagram", aspectRatio: "4:5", visualType: "image" },
  post: { platform: "Instagram", aspectRatio: "4:5", visualType: "image" }
};

const server = createServer(async (request, response) => {
  try {
    const path = new URL(request.url || "/", `http://127.0.0.1:${PORT}`).pathname;

    if (path.startsWith("/api/") && !isTrustedOrigin(request)) {
      return sendJson(response, 403, { error: "Richiesta non autorizzata." });
    }

    if (path === "/api/health" && request.method === "GET") {
      return sendJson(response, 200, getHealth());
    }

    if (path === "/api/brainstorm" && request.method === "POST") {
      return handleBrainstorm(request, response);
    }

    if (path === "/api/visual" && request.method === "POST") {
      return handleVisual(request, response);
    }

    if (path === "/api/setup" && request.method === "POST") {
      return handleSetup(request, response);
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return sendJson(response, 405, { error: "Metodo non consentito." });
    }

    return serveStatic(path, request, response);
  } catch (error) {
    const status = Number(error?.statusCode || 500);
    const payload = {
      error: error?.publicMessage || "Errore interno del server."
    };
    if (error?.code) payload.code = error.code;
    return sendJson(response, status, payload);
  }
});

server.listen(PORT, "127.0.0.1", () => {
  const health = getHealth();
  const active = [health.providers.openai ? "GPT" : "", health.providers.gemini ? "Gemini" : ""].filter(Boolean);
  console.info(`MONO AI attivo su http://127.0.0.1:${PORT}/`);
  console.info(active.length ? `Motori connessi: ${active.join(" + ")}.` : "Nessuna chiave configurata: bozza locale disponibile.");
});

function getHealth() {
  return {
    ok: true,
    providers: {
      openai: isValidOpenAiKey(process.env.OPENAI_API_KEY || ""),
      gemini: isValidGeminiKey(process.env.GEMINI_API_KEY || "")
    },
    models: {
      openai: getOpenAiModelName(),
      image: getGeminiImageModelName(),
      video: getGeminiVideoModelName()
    },
    privacy: {
      localOnly: true,
      promptLogging: false,
      openAiStore: false
    }
  };
}

async function handleBrainstorm(request, response) {
  enforceRateLimit(request, "brainstorm");
  const payload = await readJsonBody(request);
  const message = sanitizeText(payload.message, 6000);
  const history = sanitizeHistory(payload.history);

  if (!message) {
    return sendJson(response, 400, { error: "Scrivi cosa vuoi creare." });
  }

  if (!isValidOpenAiKey(process.env.OPENAI_API_KEY || "")) {
    return sendJson(response, 200, createFallbackResult(message));
  }

  try {
    const result = await callOpenAi(message, history);
    return sendJson(response, 200, { ...result, mode: "ai", provider: "openai" });
  } catch {
    return sendJson(response, 200, createFallbackResult(message));
  }
}

async function handleVisual(request, response) {
  enforceRateLimit(request, "visual");

  if (!isValidGeminiKey(process.env.GEMINI_API_KEY || "")) {
    return sendJson(response, 503, {
      error: "Collega Gemini per creare immagini e video.",
      code: "GEMINI_NOT_CONFIGURED"
    });
  }

  const payload = await readJsonBody(request);
  const type = payload.type === "video" ? "video" : "image";
  const prompt = sanitizeText(payload.prompt, 5000);
  const aspectRatio = sanitizeAspectRatio(payload.aspectRatio, type);

  if (!prompt) {
    return sendJson(response, 400, { error: "Manca la direzione visuale." });
  }

  try {
    const result = type === "video"
      ? await callGeminiVideo(prompt, aspectRatio)
      : await callGeminiImage(prompt, aspectRatio);
    return sendJson(response, 200, { ok: true, type, ...result });
  } catch (error) {
    const authError = error?.statusCode === 401 || error?.statusCode === 403;
    return sendJson(response, authError ? 401 : 502, {
      error: authError
        ? "La chiave Gemini non è accettata. Apri le impostazioni e sostituiscila."
        : "Gemini non ha completato il visual. Riprova tra poco.",
      code: authError ? "GEMINI_AUTH_ERROR" : "GEMINI_UNAVAILABLE"
    });
  }
}

async function handleSetup(request, response) {
  enforceRateLimit(request, "setup");

  if (!isLoopbackClient(request.socket.remoteAddress || "")) {
    return sendJson(response, 403, { error: "Configurazione consentita solo da questo computer." });
  }

  const payload = await readJsonBody(request);
  const openaiKey = normalizeSecretValue(payload.openaiKey || "");
  const geminiKey = normalizeSecretValue(payload.geminiKey || "");

  if (!openaiKey && !geminiKey) {
    return sendJson(response, 400, { error: "Incolla almeno una chiave nuova." });
  }

  if (openaiKey && !isValidOpenAiKey(openaiKey)) {
    return sendJson(response, 400, { error: "La chiave OpenAI non ha un formato valido." });
  }

  if (geminiKey && !isValidGeminiKey(geminiKey)) {
    return sendJson(response, 400, { error: "La chiave Gemini non ha un formato valido." });
  }

  const checks = await Promise.all([
    openaiKey ? verifyOpenAiKey(openaiKey) : Promise.resolve({ valid: true }),
    geminiKey ? verifyGeminiKey(geminiKey) : Promise.resolve({ valid: true })
  ]);

  if (!checks[0].valid) {
    return sendJson(response, 400, { error: "OpenAI ha rifiutato questa chiave. Creane una nuova dalla piattaforma OpenAI." });
  }

  if (!checks[1].valid) {
    return sendJson(response, 400, { error: "Google ha rifiutato questa chiave. Creane una nuova in Google AI Studio." });
  }

  const updates = { PORT: String(PORT) };
  if (openaiKey) {
    updates.OPENAI_API_KEY = openaiKey;
    updates.OPENAI_MODEL = getOpenAiModelName();
  }
  if (geminiKey) {
    updates.GEMINI_API_KEY = geminiKey;
    updates.GEMINI_IMAGE_MODEL = getGeminiImageModelName();
    updates.GEMINI_VIDEO_MODEL = getGeminiVideoModelName();
  }

  await updateEnvLocal(updates);
  Object.assign(process.env, updates);

  const warning = checks.some((check) => check.unverified)
    ? "Chiavi salvate localmente; la rete non ha permesso la verifica completa."
    : "Connessioni verificate e salvate localmente.";

  return sendJson(response, 200, {
    ok: true,
    providers: getHealth().providers,
    warning
  });
}

async function callOpenAi(message, history) {
  const models = [...new Set([getOpenAiModelName(), "gpt-5.4-mini", "gpt-5-mini"])];
  let lastError = null;

  for (const model of models) {
    const upstream = await fetchWithTimeout("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        store: false,
        instructions: buildOpenAiInstructions(),
        input: buildConversationInput(message, history),
        max_output_tokens: 2600
      })
    }, 90_000);

    const data = await upstream.json().catch(() => ({}));
    if (upstream.ok) {
      const text = extractOpenAiText(data);
      const parsed = parseJsonObject(text);
      return normalizeAgentResult(parsed, text, message);
    }

    lastError = providerError(upstream.status, data?.error?.message || "OpenAI non disponibile.");
    if (upstream.status === 401 || upstream.status === 403 || upstream.status === 429) break;
    if (upstream.status !== 400 && upstream.status !== 404) break;
  }

  throw lastError || providerError(502, "OpenAI non disponibile.");
}

function buildOpenAiInstructions() {
  return [
    "Sei MONO AI, un social media manager pragmatico per una bottega gastronomica contemporanea italiana.",
    "Il tuo compito è pensare, fare brainstorming e scrivere. Un secondo motore Gemini creerà immagini e video.",
    "Parla in italiano naturale, diretto, caldo. Niente gergo marketing, niente spiegazioni tecniche.",
    "Se l'utente sta esplorando idee, usa intent brainstorm, resta entro 120 parole e fai al massimo una domanda utile.",
    "Se l'utente chiede di creare, usa intent create e consegna subito senza chiedere piattaforma o misure se puoi inferirle.",
    "Formati fissi: reel = Instagram e TikTok, verticale 9:16, 5 scene, visual video; stories = Instagram 9:16, 3 stories, visual immagine; carousel = Instagram 4:5, 6 slide, visual immagine; post = Instagram 4:5, visual immagine.",
    "Se il formato non è indicato, scegli reel. Non inventare prezzi, disponibilità, sconti, ingredienti o claim salutistici.",
    "Il prompt visual deve essere in inglese, specifico, senza testo grafico nell'immagine, coerente con food branding italiano premium e realistico.",
    "Rispondi esclusivamente con JSON valido, senza markdown, con questa forma:",
    '{"intent":"brainstorm|create","reply":"massimo due frasi","deliverable":null oppure {"format":"reel|stories|carousel|post","title":"...","platform":"...","aspectRatio":"9:16|4:5","hook":"...","body":["..."],"caption":"...","cta":"...","visual":{"type":"video|image|none","prompt":"..."}}}'
  ].join("\n");
}

function buildConversationInput(message, history) {
  const transcript = history
    .slice(-10)
    .map((item) => `${item.role === "assistant" ? "MONO AI" : "UTENTE"}: ${item.text}`)
    .join("\n");
  return `${transcript}\nUTENTE: ${message}`.trim();
}

function normalizeAgentResult(value, rawText, originalMessage) {
  if (!value || typeof value !== "object") {
    return {
      intent: "brainstorm",
      reply: sanitizeText(rawText, 1600) || "Dimmi cosa vuoi ottenere e lo trasformo in un contenuto.",
      deliverable: null
    };
  }

  const intent = value.intent === "create" ? "create" : "brainstorm";
  const reply = sanitizeText(value.reply, 1600) || (intent === "create" ? "Fatto." : "Ragioniamoci insieme.");
  const deliverable = intent === "create" ? normalizeDeliverable(value.deliverable, originalMessage) : null;
  return { intent, reply, deliverable };
}

function normalizeDeliverable(value, originalMessage) {
  if (!value || typeof value !== "object") return createFallbackDeliverable(originalMessage, detectFormat(originalMessage));

  const format = FORMAT_PRESETS[value.format] ? value.format : detectFormat(originalMessage);
  const preset = FORMAT_PRESETS[format];
  const visualValue = value.visual && typeof value.visual === "object" ? value.visual : {};
  const visualType = visualValue.type === "none" ? "none" : preset.visualType;

  return {
    format,
    title: sanitizeText(value.title, 180) || fallbackTitle(format),
    platform: sanitizeText(value.platform, 80) || preset.platform,
    aspectRatio: sanitizeAspectRatio(value.aspectRatio, visualType),
    hook: sanitizeText(value.hook, 500),
    body: sanitizeStringArray(value.body, 8, 700),
    caption: sanitizeText(value.caption, 1800),
    cta: sanitizeText(value.cta, 400),
    visual: {
      type: visualType,
      prompt: sanitizeText(visualValue.prompt, 5000) || buildFallbackVisualPrompt(originalMessage, format)
    }
  };
}

async function callGeminiImage(prompt, aspectRatio) {
  const model = getGeminiImageModelName();
  const upstream = await fetchWithTimeout(
    `https://generativelanguage.googleapis.com/v1/models/${encodeURIComponent(model)}:generateContent`,
    {
      method: "POST",
      headers: {
        "x-goog-api-key": process.env.GEMINI_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseModalities: ["IMAGE"],
          responseFormat: {
            image: {
              aspectRatio,
              imageSize: "1K"
            }
          }
        }
      })
    },
    120_000
  );

  const data = await upstream.json().catch(() => ({}));
  if (!upstream.ok) throw providerError(upstream.status, data?.error?.message || "Gemini immagine non disponibile.");

  const image = extractGeminiImage(data);
  if (!image) throw providerError(502, "Gemini non ha restituito un'immagine.");
  ensureMediaSize(image.data);

  return {
    model,
    mimeType: image.mimeType || "image/png",
    data: image.data
  };
}

async function callGeminiVideo(prompt, aspectRatio) {
  const model = getGeminiVideoModelName();
  const upstream = await fetchWithTimeout("https://generativelanguage.googleapis.com/v1beta/interactions", {
    method: "POST",
    headers: {
      "x-goog-api-key": process.env.GEMINI_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      input: prompt,
      response_format: {
        type: "video",
        aspect_ratio: aspectRatio === "16:9" ? "16:9" : "9:16",
        delivery: "uri"
      },
      store: false,
      background: false,
      stream: false
    })
  }, 240_000);

  let data = await upstream.json().catch(() => ({}));
  if (!upstream.ok) throw providerError(upstream.status, data?.error?.message || "Gemini video non disponibile.");

  let video = extractGeminiVideo(data);
  if (!video && data.id) {
    data = await pollGeminiInteraction(data.id);
    video = extractGeminiVideo(data);
  }

  if (!video) throw providerError(502, "Gemini non ha restituito un video.");

  if (video.data) {
    ensureMediaSize(video.data);
    return { model, mimeType: video.mimeType || "video/mp4", data: video.data };
  }

  const downloaded = await downloadGeminiMedia(video.uri);
  ensureMediaSize(downloaded.data);
  return { model, mimeType: downloaded.mimeType || video.mimeType || "video/mp4", data: downloaded.data };
}

async function pollGeminiInteraction(id) {
  const safeId = encodeURIComponent(String(id));
  for (let attempt = 0; attempt < 20; attempt += 1) {
    await delay(3000);
    const response = await fetchWithTimeout(`https://generativelanguage.googleapis.com/v1beta/interactions/${safeId}`, {
      headers: { "x-goog-api-key": process.env.GEMINI_API_KEY }
    }, 30_000);
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw providerError(response.status, data?.error?.message || "Video non disponibile.");
    if (extractGeminiVideo(data) || data.status === "completed") return data;
    if (data.status === "failed" || data.status === "cancelled") throw providerError(502, "Generazione video non riuscita.");
  }
  throw providerError(504, "Generazione video troppo lenta.");
}

async function downloadGeminiMedia(uri) {
  const url = new URL(uri);
  if (url.hostname !== "generativelanguage.googleapis.com") {
    throw providerError(502, "Indirizzo media non riconosciuto.");
  }

  for (let attempt = 0; attempt < 16; attempt += 1) {
    const response = await fetchWithTimeout(url, {
      headers: { "x-goog-api-key": process.env.GEMINI_API_KEY },
      redirect: "follow"
    }, 45_000);

    if (response.ok) {
      const bytes = Buffer.from(await response.arrayBuffer());
      return {
        mimeType: response.headers.get("content-type")?.split(";")[0] || "video/mp4",
        data: bytes.toString("base64")
      };
    }

    if (![400, 404, 409, 425, 503].includes(response.status)) {
      throw providerError(response.status, "Download video non riuscito.");
    }

    await delay(3000);
  }

  throw providerError(504, "Il video non è ancora pronto.");
}

function extractOpenAiText(data) {
  if (typeof data?.output_text === "string") return data.output_text;
  const parts = [];
  for (const item of Array.isArray(data?.output) ? data.output : []) {
    for (const content of Array.isArray(item?.content) ? item.content : []) {
      if (typeof content?.text === "string") parts.push(content.text);
      if (typeof content?.output_text === "string") parts.push(content.output_text);
    }
  }
  return parts.join("\n").trim();
}

function extractGeminiImage(data) {
  for (const candidate of Array.isArray(data?.candidates) ? data.candidates : []) {
    for (const part of Array.isArray(candidate?.content?.parts) ? candidate.content.parts : []) {
      const inline = part?.inlineData || part?.inline_data;
      if (typeof inline?.data === "string") {
        return {
          data: inline.data,
          mimeType: inline.mimeType || inline.mime_type || "image/png"
        };
      }
    }
  }
  return null;
}

function extractGeminiVideo(data) {
  for (const step of Array.isArray(data?.steps) ? data.steps : []) {
    for (const content of Array.isArray(step?.content) ? step.content : []) {
      if (content?.type === "video" && (content.data || content.uri)) {
        return {
          data: content.data || "",
          uri: content.uri || "",
          mimeType: content.mime_type || content.mimeType || "video/mp4"
        };
      }
    }
  }

  const output = data?.output_video || data?.outputVideo;
  if (output?.data || output?.uri) {
    return {
      data: output.data || "",
      uri: output.uri || "",
      mimeType: output.mime_type || output.mimeType || "video/mp4"
    };
  }
  return null;
}

function createFallbackResult(message) {
  const wantsBrainstorm = /brainstorm|idee|idea|consiglio|che ne pensi|come potrei|ragioniamo|aiutami a pensare/i.test(message);
  if (wantsBrainstorm) {
    return {
      mode: "demo",
      intent: "brainstorm",
      reply: "Tre strade semplici: mostrare il prodotto in modo irresistibile, raccontare il gesto dietro la preparazione, oppure legarlo a un momento reale della giornata. Quale delle tre vuoi trasformare in contenuto?",
      deliverable: null
    };
  }

  const format = detectFormat(message);
  return {
    mode: "demo",
    intent: "create",
    reply: `Ti preparo subito ${format === "reel" ? "un Reel valido anche per TikTok" : format === "carousel" ? "un carosello" : format === "stories" ? "una sequenza Stories" : "un post"}.`,
    deliverable: createFallbackDeliverable(message, format)
  };
}

function createFallbackDeliverable(message, format) {
  const preset = FORMAT_PRESETS[format];
  const topic = extractTopic(message);
  const bodies = {
    reel: [
      `Apertura ravvicinata: ${topic}.`,
      "Dettaglio del gesto che rende il prodotto desiderabile.",
      "Cambio rapido: consistenza, taglio o servizio.",
      "Inquadratura pulita del risultato finale.",
      "Chiusura con MONO e invito a passare in bottega."
    ],
    stories: [
      `Story 1 — Fermati qui: ${topic}.`,
      "Story 2 — Mostra il dettaglio più goloso e racconta perché conta.",
      "Story 3 — Invito semplice: passa da MONO e scoprilo dal vivo."
    ],
    carousel: [
      `Cover — ${topic}.`,
      "Il dettaglio che attira subito l'occhio.",
      "Il gesto o la lavorazione dietro il risultato.",
      "La consistenza raccontata senza esagerazioni.",
      "Il momento perfetto per sceglierlo.",
      "Chiusura — Vieni a scoprirlo da MONO."
    ],
    post: [
      `Protagonista assoluto: ${topic}.`,
      "Visual pulito, luce calda, nessun elemento superfluo.",
      "Caption breve e invito concreto alla visita."
    ]
  };

  return {
    format,
    title: fallbackTitle(format),
    platform: preset.platform,
    aspectRatio: preset.aspectRatio,
    hook: `Oggi c'è un solo protagonista: ${topic}.`,
    body: bodies[format],
    caption: "Pochi discorsi, il dettaglio giusto e tutta la cura MONO. Lo prepariamo per rendere speciale anche una giornata normale.",
    cta: "Passa da MONO e scoprilo dal vivo.",
    visual: {
      type: preset.visualType,
      prompt: buildFallbackVisualPrompt(topic, format)
    }
  };
}

function detectFormat(text) {
  const value = String(text || "").toLowerCase();
  if (/carosell|carousel/.test(value)) return "carousel";
  if (/storie|stories|story/.test(value)) return "stories";
  if (/post|foto|immagine/.test(value)) return "post";
  return "reel";
}

function extractTopic(message) {
  const cleaned = String(message || "")
    .replace(/\b(fammi|crea|genera|prepara|vorrei|voglio|mi serve|facciamo|un|una|del|della|per|su|sul|sulla|sullo|sui|sulle|riguardo|reel|tiktok|video|storie|stories|story|carosello|carousel|post|foto|immagine)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^[,.:;\-\s]+|[,.:;\-\s]+$/g, "");
  return sanitizeText(cleaned, 180) || "la novità di oggi";
}

function fallbackTitle(format) {
  const titles = {
    reel: "Il dettaglio che fa fermare lo scroll",
    stories: "Tre Stories, un solo desiderio",
    carousel: "Da vedere. Da capire. Da assaggiare.",
    post: "La semplicità fatta bene"
  };
  return titles[format];
}

function buildFallbackVisualPrompt(topic, format) {
  const motion = format === "reel"
    ? "Vertical cinematic food video, one continuous 8-second shot, slow push-in camera movement, subtle steam and natural hand movement"
    : "Editorial food photograph";
  return `${motion} featuring ${topic}. Contemporary Italian gastronomy, warm natural light, tactile ivory and terracotta surfaces, refined but honest styling, realistic ingredients, shallow depth of field, premium local neighborhood brand, no logos, no graphic text, no watermarks, no people faces.`;
}

async function verifyOpenAiKey(apiKey) {
  try {
    const response = await fetchWithTimeout("https://api.openai.com/v1/models", {
      headers: { Authorization: `Bearer ${apiKey}` }
    }, 15_000);
    return { valid: response.status !== 401 && response.status !== 403 };
  } catch {
    return { valid: true, unverified: true };
  }
}

async function verifyGeminiKey(apiKey) {
  try {
    const response = await fetchWithTimeout("https://generativelanguage.googleapis.com/v1beta/models", {
      headers: { "x-goog-api-key": apiKey }
    }, 15_000);
    return { valid: response.status !== 400 && response.status !== 401 && response.status !== 403 };
  } catch {
    return { valid: true, unverified: true };
  }
}

function enforceRateLimit(request, scope) {
  const client = request.socket.remoteAddress || "local";
  const key = `${scope}:${client}`;
  const now = Date.now();
  const recent = (requestBuckets.get(key) || []).filter((time) => now - time < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) {
    throw httpError(429, "Troppe richieste. Aspetta qualche secondo.");
  }
  recent.push(now);
  requestBuckets.set(key, recent);
}

function sanitizeHistory(value) {
  if (!Array.isArray(value)) return [];
  return value.slice(-10).map((item) => ({
    role: item?.role === "assistant" ? "assistant" : "user",
    text: sanitizeText(item?.text, 1800)
  })).filter((item) => item.text);
}

function sanitizeStringArray(value, maxItems, maxChars) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, maxItems).map((item) => sanitizeText(item, maxChars)).filter(Boolean);
}

function sanitizeText(value, maxChars) {
  return String(value ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxChars);
}

function sanitizeAspectRatio(value, type) {
  const allowed = type === "video" ? ["9:16", "16:9"] : ["1:1", "4:5", "9:16", "16:9"];
  return allowed.includes(value) ? value : type === "video" ? "9:16" : "4:5";
}

function parseJsonObject(text) {
  if (!text) return null;
  const cleaned = String(text).replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch {
    return null;
  }
}

function getOpenAiModelName() {
  return sanitizeModelName(process.env.OPENAI_MODEL, "gpt-5.4-mini");
}

function getGeminiImageModelName() {
  return sanitizeModelName(process.env.GEMINI_IMAGE_MODEL, "gemini-3.1-flash-image");
}

function getGeminiVideoModelName() {
  return sanitizeModelName(process.env.GEMINI_VIDEO_MODEL, "gemini-omni-flash-preview");
}

function sanitizeModelName(value, fallback) {
  const model = String(value || "").trim();
  return /^[a-zA-Z0-9._:-]{3,100}$/.test(model) ? model : fallback;
}

function isValidOpenAiKey(value) {
  const key = normalizeSecretValue(value);
  return key.startsWith("sk-") && key.length >= 24 && key.length <= 300 && !/\s/.test(key);
}

function isValidGeminiKey(value) {
  const key = normalizeSecretValue(value);
  return key.length >= 20 && key.length <= 300 && !/[\s'"<>]/.test(key);
}

function normalizeSecretValue(value) {
  let secret = String(value || "").trim();
  secret = secret.replace(/^(OPENAI_API_KEY|GEMINI_API_KEY|GOOGLE_API_KEY)\s*=\s*/i, "").trim();
  if ((secret.startsWith('"') && secret.endsWith('"')) || (secret.startsWith("'") && secret.endsWith("'"))) {
    secret = secret.slice(1, -1).trim();
  }
  return secret;
}

function isTrustedOrigin(request) {
  const origin = String(request.headers.origin || "");
  if (!origin) return true;
  return origin === `http://127.0.0.1:${PORT}` || origin === `http://localhost:${PORT}`;
}

function isLoopbackClient(value) {
  return value === "127.0.0.1" || value === "::1" || value === "::ffff:127.0.0.1";
}

async function readJsonBody(request) {
  const contentType = String(request.headers["content-type"] || "");
  if (!contentType.includes("application/json")) throw httpError(415, "Formato richiesta non valido.");

  const chunks = [];
  let total = 0;
  for await (const chunk of request) {
    total += chunk.length;
    if (total > MAX_BODY_BYTES) throw httpError(413, "Richiesta troppo grande.");
    chunks.push(chunk);
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
  } catch {
    throw httpError(400, "Dati non validi.");
  }
}

async function serveStatic(path, request, response) {
  const fileName = STATIC_FILES.get(path);
  if (!fileName) return sendJson(response, 404, { error: "Pagina non trovata." });

  const content = await readFile(resolve(ROOT, fileName));
  response.writeHead(200, {
    "Content-Type": MIME_TYPES[fileName],
    "Content-Length": content.length,
    "Cache-Control": fileName === "index.html" ? "no-store" : "no-cache",
    ...securityHeaders()
  });
  response.end(request.method === "HEAD" ? undefined : content);
}

function sendJson(response, status, body) {
  const payload = Buffer.from(JSON.stringify(body));
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": payload.length,
    "Cache-Control": "no-store",
    ...securityHeaders()
  });
  response.end(payload);
}

function securityHeaders() {
  return {
    "Content-Security-Policy": "default-src 'self'; img-src 'self' data: blob:; media-src 'self' data: blob:; connect-src 'self'; style-src 'self'; script-src 'self'; font-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "no-referrer",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Cross-Origin-Resource-Policy": "same-origin"
  };
}

async function updateEnvLocal(updates) {
  const envPath = resolve(ROOT, ".env.local");
  const values = new Map();

  if (existsSync(envPath)) {
    const current = await readFile(envPath, "utf8");
    for (const rawLine of current.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const separator = line.indexOf("=");
      if (separator <= 0) continue;
      values.set(line.slice(0, separator).trim(), line.slice(separator + 1).trim());
    }
  }

  for (const [key, value] of Object.entries(updates)) values.set(key, String(value));
  const output = [...values.entries()].map(([key, value]) => `${key}=${value}`).join("\r\n");
  await writeFile(envPath, `${output}\r\n`, { encoding: "utf8", mode: 0o600 });
}

function loadEnvFile(filename) {
  const envPath = resolve(ROOT, filename);
  if (!existsSync(envPath)) return;

  for (const rawLine of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator <= 0) continue;
    const key = line.slice(0, separator).trim();
    const value = normalizeSecretValue(line.slice(separator + 1));
    if (!process.env[key]) process.env[key] = value;
  }
}

async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function ensureMediaSize(base64Data) {
  const estimatedBytes = Math.ceil((String(base64Data).length * 3) / 4);
  if (estimatedBytes > MAX_MEDIA_BYTES) throw providerError(413, "Media troppo grande.");
}

function providerError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function httpError(statusCode, publicMessage, code) {
  const error = new Error(publicMessage);
  error.statusCode = statusCode;
  error.publicMessage = publicMessage;
  error.code = code;
  return error;
}

function delay(ms) {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, ms));
}
