const API = {
  health: "/api/health",
  brainstorm: "/api/brainstorm",
  visual: "/api/visual",
  setup: "/api/setup"
};

const state = {
  busy: false,
  health: null,
  messages: [],
  toastTimer: null
};

const conversation = document.querySelector("[data-conversation]");
const welcome = document.querySelector("[data-welcome]");
const composer = document.querySelector("[data-composer]");
const promptInput = document.querySelector("[data-prompt]");
const sendButton = composer.querySelector("button[type='submit']");
const settingsDialog = document.querySelector("[data-settings-dialog]");
const settingsForm = document.querySelector("[data-settings-form]");
const settingsError = document.querySelector("[data-settings-error]");
const toast = document.querySelector("[data-toast]");

init();

function init() {
  composer.addEventListener("submit", handleSubmit);
  promptInput.addEventListener("input", resizePrompt);
  promptInput.addEventListener("keydown", handlePromptKeydown);
  settingsForm.addEventListener("submit", saveSettings);
  settingsDialog.addEventListener("click", handleDialogBackdrop);
  document.addEventListener("click", handleAction);
  loadHealth();

  if (window.location.protocol === "file:") {
    welcome.hidden = true;
    appendAssistant("Questa pagina è stata aperta come file. Avvia MONO AI con 1_APRI_MONO_SOCIAL_STUDIO.cmd e usa http://127.0.0.1:4177/.", "error");
    setComposerEnabled(false);
  }
}

async function loadHealth() {
  try {
    const response = await fetch(API.health, { cache: "no-store" });
    if (!response.ok) throw new Error("Server non disponibile");
    state.health = await response.json();
  } catch {
    state.health = {
      providers: { openai: false, gemini: false }
    };
  }

  updateProviderState();
}

function updateProviderState() {
  const providers = state.health?.providers || {};
  document.querySelector("[data-engine='openai']")?.classList.toggle("connected", Boolean(providers.openai));
  document.querySelector("[data-engine='gemini']")?.classList.toggle("connected", Boolean(providers.gemini));

  const openAiState = document.querySelector("[data-key-state='openai']");
  const geminiState = document.querySelector("[data-key-state='gemini']");
  if (openAiState) openAiState.textContent = providers.openai ? "Connesso" : "Non connesso";
  if (geminiState) geminiState.textContent = providers.gemini ? "Connesso" : "Non connesso";
}

function handlePromptKeydown(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    composer.requestSubmit();
  }
}

function resizePrompt() {
  promptInput.style.height = "auto";
  promptInput.style.height = `${Math.min(promptInput.scrollHeight, 180)}px`;
}

async function handleSubmit(event) {
  event.preventDefault();
  const message = promptInput.value.trim();
  if (!message || state.busy) return;

  state.busy = true;
  setComposerEnabled(false);
  welcome.hidden = true;
  appendUser(message);
  state.messages.push({ role: "user", text: message });
  promptInput.value = "";
  resizePrompt();

  const thinking = appendThinking("GPT sta pensando");

  try {
    const response = await fetch(API.brainstorm, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        history: state.messages.slice(0, -1).slice(-10)
      })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || "Non riesco a contattare GPT.");

    thinking.remove();
    const assistantBubble = appendAssistant(result.reply || "Fatto.", result.mode);
    state.messages.push({ role: "assistant", text: result.reply || "Fatto." });

    if (result.deliverable) {
      const card = renderDeliverable(result.deliverable);
      assistantBubble.append(card);
      if (result.deliverable.visual?.type && result.deliverable.visual.type !== "none") {
        generateVisual(card, result.deliverable.visual, result.deliverable.aspectRatio);
      }
    }
  } catch (error) {
    thinking.remove();
    appendAssistant(error.message || "Si è verificato un errore.", "error");
  } finally {
    state.busy = false;
    setComposerEnabled(true);
    promptInput.focus();
    scrollToLatest();
  }
}

function appendUser(text) {
  const message = createElement("article", "message user");
  const bubble = createElement("div", "message-bubble");
  bubble.textContent = text;
  message.append(bubble);
  conversation.append(message);
  scrollToLatest();
}

function appendAssistant(text, mode = "ai") {
  const message = createElement("article", "message assistant");
  const bubble = createElement("div", "message-bubble");
  const paragraph = document.createElement("p");
  paragraph.textContent = text;
  bubble.append(paragraph);

  if (mode === "demo") {
    const meta = createElement("small", "message-meta");
    meta.textContent = "Bozza locale · collega GPT per il brainstorming reale";
    bubble.append(meta);
  }

  message.append(bubble);
  conversation.append(message);
  scrollToLatest();
  return bubble;
}

function appendThinking(label) {
  const message = createElement("article", "message assistant");
  const bubble = createElement("div", "message-bubble");
  const thinking = createElement("div", "thinking");
  const dots = createElement("span", "thinking-dots");
  dots.append(document.createElement("i"), document.createElement("i"), document.createElement("i"));
  const text = document.createElement("span");
  text.textContent = label;
  thinking.append(dots, text);
  bubble.append(thinking);
  message.append(bubble);
  conversation.append(message);
  scrollToLatest();
  return message;
}

function renderDeliverable(deliverable) {
  const card = createElement("section", "deliverable");
  const head = createElement("header", "deliverable-head");
  const badge = createElement("span", "deliverable-badge");
  badge.textContent = `${formatLabel(deliverable.format)} · ${deliverable.platform}`;
  const copy = createElement("button", "copy-button");
  copy.type = "button";
  copy.dataset.action = "copy-deliverable";
  copy.textContent = "Copia";
  head.append(badge, copy);

  const body = createElement("div", "deliverable-body");
  const title = createElement("h2", "deliverable-title");
  title.textContent = deliverable.title;
  body.append(title);

  addTextBlock(body, "Hook", deliverable.hook);
  addListBlock(body, deliverable.format === "carousel" ? "Slide" : deliverable.format === "stories" ? "Stories" : "Scaletta", deliverable.body);
  addTextBlock(body, "Caption", deliverable.caption);
  addTextBlock(body, "CTA", deliverable.cta);

  if (deliverable.visual?.type && deliverable.visual.type !== "none") {
    const visual = createElement("div", "visual-output");
    visual.dataset.visual = "";
    visual.dataset.ratio = deliverable.aspectRatio || "4:5";
    body.append(visual);
  }

  card.dataset.copyText = buildCopyText(deliverable);
  card.append(head, body);
  return card;
}

function addTextBlock(parent, title, text) {
  if (!text) return;
  const block = createElement("section", "content-block");
  const heading = document.createElement("h3");
  const paragraph = document.createElement("p");
  heading.textContent = title;
  paragraph.textContent = text;
  block.append(heading, paragraph);
  parent.append(block);
}

function addListBlock(parent, title, items) {
  if (!Array.isArray(items) || items.length === 0) return;
  const block = createElement("section", "content-block");
  const heading = document.createElement("h3");
  const list = createElement("ol", "content-list");
  heading.textContent = title;
  items.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    list.append(listItem);
  });
  block.append(heading, list);
  parent.append(block);
}

async function generateVisual(card, visualRequest, aspectRatio) {
  const visual = card.querySelector("[data-visual]");
  if (!visual) return;

  renderVisualLoading(visual, visualRequest.type);
  scrollToLatest();

  try {
    const response = await fetch(API.visual, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: visualRequest.type,
        prompt: visualRequest.prompt,
        aspectRatio
      })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(result.error || "Gemini non ha creato il visual.");
      error.code = result.code;
      throw error;
    }

    renderGeneratedMedia(visual, result);
  } catch (error) {
    renderVisualError(visual, error);
  } finally {
    scrollToLatest();
  }
}

function renderVisualLoading(container, type) {
  container.replaceChildren();
  const loading = createElement("div", "visual-loading");
  const spinner = document.createElement("span");
  const label = document.createElement("p");
  label.textContent = type === "video" ? "Gemini sta creando il video…" : "Gemini sta creando l’immagine…";
  loading.append(spinner, label);
  container.append(loading);
}

function renderGeneratedMedia(container, result) {
  container.replaceChildren();
  const source = `data:${result.mimeType};base64,${result.data}`;
  const media = result.type === "video" ? document.createElement("video") : document.createElement("img");

  if (result.type === "video") {
    media.controls = true;
    media.playsInline = true;
    media.preload = "metadata";
  } else {
    media.alt = "Visual creato da Gemini";
  }

  media.src = source;
  const download = createElement("a", "download-link");
  download.href = source;
  download.download = `mono-ai-${Date.now()}.${extensionForMime(result.mimeType)}`;
  download.textContent = "Salva";
  container.append(media, download);
}

function renderVisualError(container, error) {
  container.replaceChildren();
  const empty = createElement("div", "visual-empty");
  const text = document.createElement("span");
  text.textContent = error.code === "GEMINI_NOT_CONFIGURED"
    ? "Il contenuto è pronto. Collega Gemini per creare anche il visual."
    : error.message || "Gemini non ha creato il visual.";
  empty.append(text);

  if (error.code === "GEMINI_NOT_CONFIGURED" || error.code === "GEMINI_AUTH_ERROR") {
    const setup = createElement("button", "setup-inline");
    setup.type = "button";
    setup.dataset.action = "settings";
    setup.textContent = "Configura Gemini";
    empty.append(setup);
  }

  container.append(empty);
}

function handleAction(event) {
  const target = event.target.closest("[data-action]");
  if (!target) return;

  const action = target.dataset.action;
  if (action === "settings") openSettings();
  if (action === "close-settings") settingsDialog.close();
  if (action === "new-chat") resetConversation();
  if (action === "copy-deliverable") copyDeliverable(target);
}

function openSettings() {
  settingsError.textContent = "";
  settingsError.classList.remove("visible");
  settingsForm.reset();
  updateProviderState();
  if (!settingsDialog.open) settingsDialog.showModal();
}

function handleDialogBackdrop(event) {
  if (event.target === settingsDialog) settingsDialog.close();
}

async function saveSettings(event) {
  event.preventDefault();
  const formData = new FormData(settingsForm);
  const openaiKey = String(formData.get("openaiKey") || "").trim();
  const geminiKey = String(formData.get("geminiKey") || "").trim();
  const saveButton = settingsForm.querySelector("button[type='submit']");

  settingsError.textContent = "";
  settingsError.classList.remove("visible");

  if (!openaiKey && !geminiKey) {
    showSettingsError("Incolla almeno una chiave nuova.");
    return;
  }

  saveButton.disabled = true;
  saveButton.textContent = "Verifico…";

  try {
    const response = await fetch(API.setup, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ openaiKey, geminiKey })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || "Non riesco a salvare le chiavi.");

    settingsDialog.close();
    await loadHealth();
    showToast(result.warning || "Connessioni salvate");
  } catch (error) {
    showSettingsError(error.message);
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = "Salva in sicurezza";
  }
}

function showSettingsError(message) {
  settingsError.textContent = message;
  settingsError.classList.add("visible");
}

function resetConversation() {
  state.messages = [];
  conversation.querySelectorAll(".message").forEach((message) => message.remove());
  welcome.hidden = false;
  promptInput.value = "";
  resizePrompt();
  promptInput.focus();
}

async function copyDeliverable(button) {
  const card = button.closest(".deliverable");
  if (!card?.dataset.copyText) return;

  try {
    await navigator.clipboard.writeText(card.dataset.copyText);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = card.dataset.copyText;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }

  button.textContent = "Copiato";
  window.setTimeout(() => { button.textContent = "Copia"; }, 1400);
}

function buildCopyText(deliverable) {
  const lines = [
    deliverable.title,
    `${formatLabel(deliverable.format)} · ${deliverable.platform}`,
    "",
    deliverable.hook ? `HOOK\n${deliverable.hook}` : "",
    Array.isArray(deliverable.body) ? `\nCONTENUTO\n${deliverable.body.map((item, index) => `${index + 1}. ${item}`).join("\n")}` : "",
    deliverable.caption ? `\nCAPTION\n${deliverable.caption}` : "",
    deliverable.cta ? `\nCTA\n${deliverable.cta}` : ""
  ];
  return lines.filter(Boolean).join("\n");
}

function formatLabel(format) {
  const labels = {
    reel: "Reel / TikTok",
    stories: "Stories",
    carousel: "Carosello",
    post: "Post"
  };
  return labels[format] || "Contenuto";
}

function extensionForMime(mimeType) {
  if (mimeType === "image/jpeg") return "jpg";
  if (mimeType === "image/webp") return "webp";
  if (mimeType === "video/webm") return "webm";
  if (mimeType?.startsWith("video/")) return "mp4";
  return "png";
}

function setComposerEnabled(enabled) {
  promptInput.disabled = !enabled;
  sendButton.disabled = !enabled;
}

function scrollToLatest() {
  window.requestAnimationFrame(() => {
    conversation.scrollTop = conversation.scrollHeight;
  });
}

function showToast(message) {
  window.clearTimeout(state.toastTimer);
  toast.textContent = message;
  toast.classList.add("visible");
  state.toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 2400);
}

function createElement(tagName, className) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  return element;
}
