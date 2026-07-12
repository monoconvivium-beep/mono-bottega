import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = resolve(__dirname);
const MAX_BODY_BYTES = 180_000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 36;
const requestBuckets = new Map();

loadEnvFile(".env");
loadEnvFile(".env.local");

const PORT = Number(process.env.PORT || 4177);

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/markdown; charset=utf-8"
};

const MODULE_BRIEFS = {
  content: "Genera una proposta completa per un contenuto social MONO.",
  reel: "Genera uno script Reel/TikTok con hook, scene, copy, CTA, rischio e priorita.",
  carousel: "Genera un carousel Instagram slide-by-slide.",
  stories: "Genera una sequenza Stories interattiva con sticker e CTA.",
  image: "Genera un'immagine reale o un prompt immagine originale, coerente con food branding premium.",
  video: "Genera prompt video e guida di produzione manuale.",
  viral: "Genera opportunita organiche locali per Torino e Santa Rita.",
  campaign: "Genera una campagna completa con piano contenuti, Stories, offline e metriche.",
  adv: "Valuta se sponsorizzare un contenuto e crea raccomandazione ADV.",
  critic: "Valuta brutalmente una bozza e riscrivila in tono MONO.",
  feed: "Suggerisci ritmo feed, cover, colori e regole visuali.",
  analytics: "Analizza metriche social manuali e suggerisci la prossima decisione.",
  agent: "Agisci come direttore operativo social e decidi cosa fare ora."
};

const server = createServer(async (request, response) => {
  try {
    if (request.url === "/api/health" && request.method === "GET") {
      const openAiConfigured = isValidOpenAiKey(process.env.OPENAI_API_KEY || "");
      const geminiConfigured = isValidGeminiKey(process.env.GEMINI_API_KEY || "");
      return sendJson(response, 200, {
        ok: true,
        aiConfigured: openAiConfigured || geminiConfigured,
        providers: {
          openai: {
            configured: openAiConfigured,
            model: getOpenAiModelName()
          },
          gemini: {
            configured: geminiConfigured,
            textModel: getGeminiTextModelName(),
            imageModel: getGeminiImageModelName()
          }
        },
        model: openAiConfigured ? getOpenAiModelName() : getGeminiTextModelName(),
        retention: "no_prompt_logging"
      });
    }

    if (request.url === "/api/agent" && request.method === "POST") {
      return handleAgentRequest(request, response);
    }

    if (request.url === "/api/setup-key" && request.method === "POST") {
      return handleSetupKeyRequest(request, response);
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return sendJson(response, 405, { error: "Metodo non consentito." });
    }

    return serveStatic(request, response);
  } catch {
    return sendJson(response, 500, { error: "Errore interno del server." });
  }
});

server.listen(PORT, "127.0.0.1", () => {
  const activeProviders = [
    isValidOpenAiKey(process.env.OPENAI_API_KEY || "") ? "OpenAI" : "",
    isValidGeminiKey(process.env.GEMINI_API_KEY || "") ? "Gemini" : ""
  ].filter(Boolean);

  console.info(`MONO Social Studio AI attivo su http://127.0.0.1:${PORT}`);
  console.info(activeProviders.length ? `AI reale configurata: ${activeProviders.join(" + ")}.` : "AI reale non configurata: uso fallback demo nel browser.");
});

async function handleAgentRequest(request, response) {
  const clientId = request.socket.remoteAddress || "local";
  if (!withinRateLimit(clientId)) {
    return sendJson(response, 429, { error: "Troppe richieste. Riprova tra poco." });
  }

  const payload = await readJsonBody(request);
  const cleanPayload = sanitizePayload(payload);
  const selectedProvider = selectProvider(cleanPayload);

  if (selectedProvider === "none") {
    return sendJson(response, 503, {
      error: "Nessun provider AI configurato. Aggiungi OpenAI o Gemini.",
      code: "AI_NOT_CONFIGURED"
    });
  }

  try {
    const aiResponse = await callSelectedProvider(selectedProvider, cleanPayload);
    return sendJson(response, 200, aiResponse);
  } catch {
    return sendJson(response, 502, {
      mode: "fallback",
      error: "Provider AI non raggiungibile. Verifica connessione, chiave e modello.",
      code: "AI_PROVIDER_UNREACHABLE"
    });
  }
}

async function handleSetupKeyRequest(request, response) {
  const clientId = request.socket.remoteAddress || "local";
  if (!isLoopbackClient(clientId)) {
    return sendJson(response, 403, { error: "Setup consentito solo da questo computer." });
  }

  if (!withinRateLimit(`setup:${clientId}`)) {
    return sendJson(response, 429, { error: "Troppe richieste. Riprova tra poco." });
  }

  const payload = await readJsonBody(request);
  const provider = sanitizeProvider(payload.provider || "openai");
  const apiKey = normalizeSecretValue(payload.apiKey || "");
  const model = sanitizeModelName(
    payload.model || (provider === "gemini" ? getGeminiTextModelName() : getOpenAiModelName()),
    provider === "gemini" ? "gemini-3.5-flash" : "gpt-5.5"
  );
  const imageModel = sanitizeModelName(payload.imageModel || getGeminiImageModelName(), "gemini-3.1-flash-image");

  if (provider === "openai" && !isValidOpenAiKey(apiKey)) {
    return sendJson(response, 400, { error: "Chiave OpenAI non valida. Deve iniziare con sk-." });
  }

  if (provider === "gemini" && !isValidGeminiKey(apiKey)) {
    return sendJson(response, 400, { error: "Chiave Gemini non valida. Incolla una API key di Google AI Studio." });
  }

  const envUpdates = provider === "gemini"
    ? { GEMINI_API_KEY: apiKey, GEMINI_TEXT_MODEL: model, GEMINI_IMAGE_MODEL: imageModel, PORT: String(PORT) }
    : { OPENAI_API_KEY: apiKey, OPENAI_MODEL: model, PORT: String(PORT) };

  await updateEnvLocal(envUpdates);
  Object.assign(process.env, envUpdates);

  return sendJson(response, 200, {
    ok: true,
    aiConfigured: true,
    provider,
    model,
    imageModel: provider === "gemini" ? imageModel : undefined,
    message: "Chiave salvata localmente in .env.local."
  });
}

async function callSelectedProvider(provider, payload) {
  if (provider === "gemini") {
    return callGemini(payload);
  }

  if (provider === "both") {
    return callBothProviders(payload);
  }

  return callOpenAi(payload);
}

async function callBothProviders(payload) {
  const [openAiResult, geminiResult] = await Promise.allSettled([
    callOpenAi(payload),
    callGemini(payload)
  ]);

  const openAiValue = openAiResult.status === "fulfilled" ? openAiResult.value : { mode: "fallback", error: "OpenAI non disponibile." };
  const geminiValue = geminiResult.status === "fulfilled" ? geminiResult.value : { mode: "fallback", error: "Gemini non disponibile." };

  const comparison = {
    title: "Risposta doppio motore",
    summary: "Confronto tra OpenAI e Gemini per scegliere il contenuto piu forte.",
    sections: [
      { titolo: "OpenAI", punti: [openAiValue.text || openAiValue.error || "Nessun output"] },
      { titolo: "Gemini", punti: [geminiValue.text || geminiValue.error || "Nessun output"] }
    ],
    tasks: ["Scegliere la versione piu coerente con MONO", "Rifinire CTA e asset prima della pubblicazione"],
    guardrails: ["Non pubblicare claim non verificati", "Non usare immagini di persone senza consenso"],
    priorityScore: 82
  };

  return {
    mode: "ai",
    provider: "both",
    model: `${getOpenAiModelName()} + ${getGeminiTextModelName()}`,
    text: JSON.stringify(comparison),
    object: comparison
  };
}

async function callOpenAi(payload) {
  const body = {
    model: getOpenAiModelName(),
    store: false,
    instructions: buildDeveloperInstructions(payload),
    input: buildUserInput(payload),
    max_output_tokens: 2400
  };

  const upstream = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const data = await upstream.json().catch(() => ({}));

  if (!upstream.ok) {
    return {
      mode: "fallback",
      error: data?.error?.message || "Errore dal provider AI.",
      status: upstream.status
    };
  }

  const text = extractResponseText(data);
  const object = parseJsonObject(text);

  return {
    mode: "ai",
    provider: "openai",
    model: data.model || getOpenAiModelName(),
    text,
    object
  };
}

async function callGemini(payload) {
  const isImageRequest = payload.kind === "image";
  const body = isImageRequest
    ? buildGeminiImageBody(payload)
    : buildGeminiTextBody(payload);

  const upstream = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
    method: "POST",
    headers: {
      "x-goog-api-key": process.env.GEMINI_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const data = await upstream.json().catch(() => ({}));

  if (!upstream.ok) {
    return {
      mode: "fallback",
      provider: "gemini",
      error: data?.error?.message || "Errore dal provider Gemini.",
      status: upstream.status
    };
  }

  if (isImageRequest) {
    const image = extractGeminiImage(data);
    const text = extractGeminiText(data) || "Immagine generata da Gemini.";
    const object = {
      title: "Immagine MONO generata con Gemini",
      summary: text,
      generatedImage: image,
      prompt: buildGeminiImagePrompt(payload),
      sections: [
        {
          titolo: "Uso consigliato",
          punti: ["Reel cover", "Story verticale", "Carousel slide", "App promo"]
        }
      ],
      tasks: ["Verificare coerenza con Brand Brain", "Non pubblicare se compaiono volti senza consenso", "Salvare asset e creare caption"],
      guardrails: ["No prezzi inventati", "No claim nutrizionali non verificati", "No copia di artisti o competitor"],
      priorityScore: image ? 88 : 65
    };

    return {
      mode: image ? "ai" : "fallback",
      provider: "gemini",
      model: getGeminiImageModelName(),
      text,
      object
    };
  }

  const text = extractGeminiText(data);
  const object = parseJsonObject(text);

  return {
    mode: "ai",
    provider: "gemini",
    model: data.model || getGeminiTextModelName(),
    text,
    object
  };
}

function buildGeminiTextBody(payload) {
  return {
    model: getGeminiTextModelName(),
    system_instruction: buildDeveloperInstructions(payload),
    input: buildUserInput(payload),
    generation_config: {
      temperature: 0.8
    }
  };
}

function buildGeminiImageBody(payload) {
  return {
    model: getGeminiImageModelName(),
    input: buildGeminiImagePrompt(payload),
    response_format: {
      type: "image",
      aspect_ratio: getImageAspectRatio(payload),
      image_size: process.env.GEMINI_IMAGE_SIZE || "1K"
    }
  };
}

function buildGeminiImagePrompt(payload) {
  const input = payload.input || {};
  const subject = input.subject || "piatto MONO nel packaging";
  const usage = input.usage || "vertical story";
  const mood = input.mood || "premium accessibile";

  return [
    `Crea un'immagine originale per MONO Bottega Gastronomica a Torino.`,
    `Soggetto: ${subject}.`,
    `Uso: ${usage}.`,
    `Mood: ${mood}.`,
    "Direzione: food branding italiano contemporaneo, premium ma accessibile, caldo, umano, locale.",
    "Palette: cashmere white, warm butter, ivory, terracotta, burnt olive, anthracite, accenti acciaio e noce.",
    "Composizione: cibo reale al centro, luce calda laterale, materiali tattili, packaging curato, niente estetica fast food.",
    "Vincoli: nessun logo inventato, nessun prezzo, nessun claim nutrizionale, nessun volto riconoscibile, nessuna copia di artisti o competitor."
  ].join("\n");
}

function getImageAspectRatio(payload) {
  const usage = String(payload.input?.usage || "").toLowerCase();
  if (usage.includes("story") || usage.includes("reel") || usage.includes("vertical")) {
    return "9:16";
  }
  if (usage.includes("poster")) {
    return "4:5";
  }
  if (usage.includes("app")) {
    return "1:1";
  }
  return "1:1";
}

function buildDeveloperInstructions(payload) {
  return [
    "Sei MONO Social Studio 1.0, un agente AI operativo per crescita Instagram e TikTok di MONO Bottega Gastronomica a Torino.",
    "Rispondi sempre e solo in italiano.",
    "Agisci come team senior: product manager AI, social strategist food, TikTok/Instagram strategist, local marketer, creative director, copywriter, ADV specialist, data analyst e community manager.",
    "Non sembrare ChatGPT: produci output pronti da usare, con critica, decisioni e priorita.",
    "Rispetta il Brand Brain, la palette, il tono caldo e contemporaneo, la localita Torino/Santa Rita e il funnel Followers -> Fiducia -> Desiderio -> Visita -> App -> Acquisto -> Fedelta -> Passaparola.",
    "Non inventare prezzi, certificazioni, allergeni, nutrizione, disponibilita, risultati o dati non forniti.",
    "Non sfruttare storie di fragilita, inclusione o disabilita. Non usare volti senza consenso. Non copiare competitor, creator o artisti.",
    "Se mancano dati, dichiara cosa serve verificare ma consegna comunque la migliore proposta utilizzabile.",
    "Restituisci SOLO JSON valido, senza Markdown fuori dal JSON.",
    "Schema libero ma stabile: usa sempre almeno title, summary, sections, tasks, guardrails, priorityScore. sections e tasks devono essere array."
  ].join("\n");
}

function buildUserInput(payload) {
  return JSON.stringify(
    {
      module: payload.kind,
      moduleBrief: MODULE_BRIEFS[payload.kind] || MODULE_BRIEFS.agent,
      input: payload.input,
      brandBrain: payload.brandBrain,
      metrics: payload.metrics,
      recentCalendar: payload.calendar,
      recentTasks: payload.tasks,
      requiredOutput: "JSON operativo pronto da mostrare nell'app. Niente testo generico."
    },
    null,
    2
  );
}

function sanitizePayload(payload) {
  const value = payload && typeof payload === "object" ? payload : {};

  return {
    kind: sanitizeText(value.kind || "agent", 40),
    provider: sanitizeProvider(value.provider || "auto"),
    imageProvider: sanitizeProvider(value.imageProvider || "gemini"),
    input: sanitizeObject(value.input, 8000),
    brandBrain: sanitizeObject(value.brandBrain, 16_000),
    metrics: sanitizeObject(value.metrics, 6000),
    calendar: sanitizeArray(value.calendar, 5, 16_000),
    tasks: sanitizeArray(value.tasks, 8, 16_000)
  };
}

function sanitizeObject(value, maxChars) {
  if (!value || typeof value !== "object") {
    return {};
  }

  return truncateJson(value, maxChars);
}

function sanitizeArray(value, maxItems, maxChars) {
  if (!Array.isArray(value)) {
    return [];
  }

  return truncateJson(value.slice(0, maxItems), maxChars);
}

function truncateJson(value, maxChars) {
  const json = JSON.stringify(value);
  const truncated = json.length > maxChars ? json.slice(0, maxChars) : json;
  try {
    return JSON.parse(truncated);
  } catch {
    return { text: truncated };
  }
}

function sanitizeText(value, maxChars) {
  return String(value || "").replace(/[^\w-]/g, "").slice(0, maxChars);
}

function sanitizeProvider(value) {
  const provider = String(value || "").trim().toLowerCase();
  return ["auto", "openai", "gemini", "both"].includes(provider) ? provider : "auto";
}

function selectProvider(payload) {
  const openAiConfigured = isValidOpenAiKey(process.env.OPENAI_API_KEY || "");
  const geminiConfigured = isValidGeminiKey(process.env.GEMINI_API_KEY || "");
  const requestedProvider = payload.kind === "image" ? payload.imageProvider : payload.provider;

  if (requestedProvider === "both") {
    if (openAiConfigured && geminiConfigured) return "both";
    if (geminiConfigured) return "gemini";
    if (openAiConfigured) return "openai";
    return "none";
  }

  if (requestedProvider === "gemini") {
    return geminiConfigured ? "gemini" : "none";
  }

  if (requestedProvider === "openai") {
    return openAiConfigured ? "openai" : "none";
  }

  if (payload.kind === "image") {
    if (geminiConfigured) return "gemini";
    if (openAiConfigured) return "openai";
    return "none";
  }

  if (openAiConfigured) return "openai";
  if (geminiConfigured) return "gemini";
  return "none";
}

function extractResponseText(data) {
  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const chunks = [];
  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if (content.type === "output_text" && content.text) {
        chunks.push(content.text);
      }
    }
  }

  return chunks.join("\n").trim();
}

function extractGeminiText(data) {
  if (typeof data?.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const chunks = [];
  for (const step of data?.steps || []) {
    for (const content of step.content || []) {
      if (content?.type === "text" && content.text) {
        chunks.push(content.text);
      }
    }
  }

  for (const item of data?.output || []) {
    for (const content of item.content || []) {
      if (content?.type === "text" && content.text) {
        chunks.push(content.text);
      }
    }
  }

  return chunks.join("\n").trim();
}

function extractGeminiImage(data) {
  if (data?.output_image?.data) {
    return toGeneratedImage(data.output_image);
  }

  const stack = [data];
  const seen = new Set();

  while (stack.length) {
    const current = stack.pop();
    if (!current || typeof current !== "object" || seen.has(current)) {
      continue;
    }
    seen.add(current);

    if (current.type === "image" && typeof current.data === "string") {
      return toGeneratedImage(current);
    }

    if (current.inline_data?.data && String(current.inline_data.mime_type || "").startsWith("image/")) {
      return toGeneratedImage(current.inline_data);
    }

    for (const value of Object.values(current)) {
      if (value && typeof value === "object") {
        stack.push(value);
      }
    }
  }

  return null;
}

function toGeneratedImage(value) {
  const mimeType = value.mime_type || value.mimeType || "image/png";
  return {
    provider: "gemini",
    mimeType,
    dataUrl: `data:${mimeType};base64,${value.data}`
  };
}

function parseJsonObject(text) {
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      return null;
    }

    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

function getOpenAiModelName() {
  return process.env.OPENAI_MODEL || "gpt-5.5";
}

function getGeminiTextModelName() {
  return process.env.GEMINI_TEXT_MODEL || "gemini-3.5-flash";
}

function getGeminiImageModelName() {
  return process.env.GEMINI_IMAGE_MODEL || "gemini-3.1-flash-image";
}

function isValidOpenAiKey(value) {
  return value.startsWith("sk-") && value.length > 30 && !value.toLowerCase().includes("inserisci");
}

function isValidGeminiKey(value) {
  const secret = normalizeSecretValue(value);
  return secret.length >= 20 && secret.length <= 300 && /^[^\s"'<>]+$/.test(secret) && !secret.toLowerCase().includes("inserisci");
}

function normalizeSecretValue(value) {
  let secret = String(value || "").trim();
  const assignmentMatch = secret.match(/^(?:GEMINI_API_KEY|GOOGLE_API_KEY|OPENAI_API_KEY)\s*=\s*(.+)$/i);
  if (assignmentMatch) {
    secret = assignmentMatch[1].trim();
  }

  return secret.replace(/^["']|["']$/g, "").trim();
}

function sanitizeModelName(value, fallback = "gpt-5.5") {
  const model = String(value || "").trim();
  return /^[a-zA-Z0-9._-]{2,80}$/.test(model) ? model : fallback;
}

function isLoopbackClient(value) {
  return ["127.0.0.1", "::1", "::ffff:127.0.0.1"].includes(value);
}

function withinRateLimit(clientId) {
  const now = Date.now();
  const bucket = requestBuckets.get(clientId) || [];
  const active = bucket.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);
  active.push(now);
  requestBuckets.set(clientId, active);
  return active.length <= RATE_LIMIT_MAX;
}

async function readJsonBody(request) {
  const chunks = [];
  let size = 0;

  for await (const chunk of request) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      throw new Error("Request body too large");
    }
    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

async function serveStatic(request, response) {
  const url = new URL(request.url || "/", `http://${request.headers.host || "127.0.0.1"}`);
  const requestedPath = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  const filePath = safeResolve(requestedPath);

  if (!filePath) {
    return sendJson(response, 403, { error: "Percorso non consentito." });
  }

  try {
    const content = await readFile(filePath);
    response.writeHead(200, securityHeaders(MIME_TYPES[extname(filePath).toLowerCase()] || "application/octet-stream"));
    if (request.method !== "HEAD") {
      response.end(content);
    } else {
      response.end();
    }
  } catch {
    sendJson(response, 404, { error: "File non trovato." });
  }
}

function safeResolve(requestedPath) {
  const normalized = normalize(requestedPath).replace(/^(\.\.[/\\])+/, "");
  const filePath = resolve(join(ROOT, normalized));
  return filePath.startsWith(ROOT) ? filePath : null;
}

function sendJson(response, status, body) {
  response.writeHead(status, securityHeaders("application/json; charset=utf-8"));
  response.end(JSON.stringify(body));
}

function securityHeaders(contentType) {
  return {
    "Content-Type": contentType,
    "Cache-Control": "no-store",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
    "Content-Security-Policy": "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"
  };
}

async function updateEnvLocal(updates) {
  const path = join(ROOT, ".env.local");
  const existingLines = existsSync(path) ? readFileSync(path, "utf8").split(/\r?\n/) : [];
  const pendingKeys = new Set(Object.keys(updates));
  const lines = [];

  for (const line of existingLines) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=/);
    const key = match?.[1];
    if (key && Object.prototype.hasOwnProperty.call(updates, key)) {
      lines.push(`${key}=${updates[key]}`);
      pendingKeys.delete(key);
    } else if (line.trim()) {
      lines.push(line);
    }
  }

  for (const key of pendingKeys) {
    lines.push(`${key}=${updates[key]}`);
  }

  await writeFile(path, `${lines.join("\n")}\n`, "utf8");
}

function loadEnvFile(filename) {
  const path = join(ROOT, filename);
  if (!existsSync(path)) {
    return;
  }

  const lines = readFileSync(path, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, "");
    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}
