const STORAGE_KEY = "mono-social-studio-state-v1";
const ACTIVE_VIEW_KEY = "mono-social-studio-active-view-v1";
const AI_HEALTH_ENDPOINT = "/api/health";
const AI_AGENT_ENDPOINT = "/api/agent";
const DEFAULT_VIEW = "create";

const views = [
  { id: "create", label: "Crea", group: "Studio", hint: "Reel, caroselli, stories, immagini" },
  { id: "dashboard", label: "Oggi", group: "Studio", hint: "Cosa pubblicare ora" },
  { id: "calendar", label: "Calendario", group: "Studio", hint: "Piano contenuti" },
  { id: "tasks", label: "Task", group: "Studio", hint: "Cose da fare" },
  { id: "brand", label: "Brand", group: "Base", hint: "Tono e regole MONO" },
  { id: "exports", label: "Export", group: "Base", hint: "Scarica materiali" },
  { id: "settings", label: "AI e sicurezza", group: "Base", hint: "Chiavi e privacy" }
];

const contentPillars = [
  {
    id: "identita",
    code: "A",
    title: "Identita MONO",
    summary: "Filosofia, valori, design, parole e posizionamento."
  },
  {
    id: "desiderio",
    code: "B",
    title: "Cibo e desiderio",
    summary: "Piatti che fanno venire fame e rendono concreta la visita."
  },
  {
    id: "behind",
    code: "C",
    title: "Dietro le quinte",
    summary: "Cucina, preparazione, persone, rituali e ingredienti."
  },
  {
    id: "quartiere",
    code: "D",
    title: "Quartiere e Torino",
    summary: "Santa Rita, lavoro in zona, famiglie, residenti, abitudini locali."
  },
  {
    id: "educazione",
    code: "E",
    title: "Educazione gastronomica",
    summary: "Rigenerazione, ingredienti, conservazione, tecniche semplici."
  },
  {
    id: "convivium",
    code: "F",
    title: "MONO Convivium",
    summary: "Inclusione, dignita del lavoro e impatto umano senza retorica."
  },
  {
    id: "packaging",
    code: "G",
    title: "Packaging e casa",
    summary: "Asporto, piatti da rigenerare e MONO che continua a casa."
  },
  {
    id: "app",
    code: "H",
    title: "App, fedelta e futuro",
    summary: "Download app, vantaggi, notifiche, ecommerce e relazione."
  },
  {
    id: "founder",
    code: "I",
    title: "Federico / founder",
    summary: "Voce di Federico, decisioni, visione e responsabilita."
  },
  {
    id: "community",
    code: "J",
    title: "Comunita e UGC",
    summary: "Clienti, recensioni, domande, reazioni e contenuti dal quartiere."
  }
];

const formats = [
  "Reel Instagram",
  "Video TikTok",
  "Carousel Instagram",
  "Story Instagram",
  "Sequenza Stories",
  "Sondaggio",
  "Domande e risposte",
  "Conto alla rovescia",
  "Post feed",
  "Post promozione app",
  "Post comunita locale",
  "Post campagna lancio",
  "Richiesta UGC",
  "Video founder",
  "Video dietro le quinte"
];

const taskStatuses = [
  "idea",
  "approved",
  "to shoot",
  "to edit",
  "ready",
  "scheduled",
  "published",
  "analyzed",
  "recycled"
];

const taskStatusLabels = {
  idea: "idea",
  approved: "approvato",
  "to shoot": "da girare",
  "to edit": "da montare",
  ready: "pronto",
  scheduled: "programmato",
  published: "pubblicato",
  analyzed: "analizzato",
  recycled: "riciclato"
};

const brandFields = [
  ["positioning", "Posizionamento"],
  ["toneOfVoice", "Tono di voce"],
  ["palette", "Palette"],
  ["contentPillars", "Pilastri contenuto"],
  ["productCategories", "Categorie prodotto"],
  ["socialGoals", "Obiettivi social"],
  ["forbiddenLanguage", "Linguaggio vietato"],
  ["visualRules", "Regole visuali"],
  ["localArea", "Area locale"],
  ["targetAudience", "Pubblico target"],
  ["offers", "Offerte"],
  ["keyPhrases", "Frasi chiave"],
  ["launchPhase", "Fase lancio"],
  ["convivium", "MONO Convivium"],
  ["packagingNarrative", "Narrativa packaging"],
  ["appLoyalty", "App, fedelta, ecommerce"]
];

const defaultBrandBrain = {
  positioning: "MONO e una bottega gastronomica contemporanea: cucina da ristorante nella vita di tutti i giorni, a Torino, con radice forte nel quartiere Santa Rita.",
  toneOfVoice: "Umano, diretto, caldo, intelligente, poetico ma controllato. Mai finto lusso, mai aggressivo, mai influencer-like.",
  palette: "Cashmere white, warm butter white, ivory, terracotta, burnt terracotta, anthracite black, burnt olive green, walnut wood, stainless steel, carta tattile, luce calda.",
  contentPillars: contentPillars.map((pillar) => `${pillar.code}. ${pillar.title}`).join("\n"),
  productCategories: "Gastronomia, pasticceria, bistrot, aperitivo, catering, box da condividere, piatti da rigenerare.",
  socialGoals: "Followers -> Fiducia -> Desiderio -> Visita in bottega -> Download app -> Acquisto -> Fedelta -> Passaparola.",
  forbiddenLanguage: "Niente claim falsi, prezzi inventati, scontistica aggressiva, toni cheap, copia competitor, promesse salute, storytelling sociale sfruttato.",
  visualRules: "Luce calda, superfici tattili, styling gastronomico pulito, materiali veri, logo usato con misura, alternanza cibo / Federico / quartiere / app / packaging.",
  localArea: "Torino, Santa Rita, Mirafiori, Crocetta, Lingotto, San Paolo, Pozzo Strada, Centro Torino quando utile.",
  targetAudience: "Residenti, famiglie, lavoratori in zona, studenti, persone che vogliono mangiare bene senza cucinare, clienti da pranzo e cena a casa.",
  offers: "App MONO, tessera fedelta, vantaggi, notifiche promozionali utili, inviti, settimana lancio, menu settimanale, buoni regalo futuri.",
  keyPhrases: "Semplice. Buono. MONO.\nCucina contemporanea, tradizionalmente moderna.\nLa cucina da ristorante nella vita di tutti i giorni.\nLa coccola che ti meriti.",
  launchPhase: "Apertura / crescita locale: consolidare fiducia, rendere memorabile il posizionamento, portare persone in bottega e nell'app.",
  convivium: "Progetto sociale raccontato con rispetto: inclusione, dignita del lavoro, gesti concreti, mai pietismo, mai esposizione non consensuale.",
  packagingNarrative: "Il packaging non e solo una busta: protegge il gesto, porta MONO a casa, rende semplice rigenerare bene.",
  appLoyalty: "Download app, punti, sconti, notifiche promozionali, wallet, ecommerce futuro, ordini e relazione continuativa."
};

const outputLabels = {
  title: "Titolo",
  formato: "Formato",
  pilastro: "Pilastro",
  obiettivo: "Obiettivo",
  hook: "Hook",
  concept: "Concept",
  caption: "Caption",
  cta: "CTA",
  visualDirection: "Direzione visuale",
  hashtags: "Hashtag",
  guardrail: "Guardrail",
  taskSuggerito: "Task suggerito",
  objective: "Obiettivo",
  targetAudience: "Target",
  hookFirstSecond: "Hook nei primi 1,5 secondi",
  visualOpening: "Apertura visuale",
  shotList: "Shot list",
  sceneByScene: "Struttura scena per scena",
  voiceover: "Voiceover",
  onScreenText: "Testo a schermo",
  geotags: "Geotag",
  soundMusicDirection: "Direzione suono e musica",
  editingRhythm: "Ritmo di montaggio",
  duration: "Durata",
  filmingInstructions: "Istruzioni di ripresa",
  propsNeeded: "Props necessari",
  foodStylingNotes: "Note styling cibo",
  viralityAngle: "Angolo virale",
  localRelevance: "Rilevanza locale",
  whyItCouldWork: "Perche puo funzionare",
  risks: "Rischi",
  difficulty: "Difficolta",
  priorityScore: "Punteggio priorita",
  numberOfSlides: "Numero slide",
  slides: "Slide",
  slide: "Slide",
  headline: "Headline",
  microcopy: "Microcopy",
  imagePrompt: "Prompt immagine",
  ctaSlide: "Slide CTA",
  designNotes: "Note design",
  backgroundColorSuggestion: "Colore sfondo suggerito",
  typographyMood: "Mood tipografico",
  whyThisCarouselMatters: "Perche conta",
  numberOfStories: "Numero stories",
  sequence: "Sequenza",
  story: "Story",
  copy: "Copy",
  sticker: "Sticker",
  finalReminder: "Promemoria finale",
  subject: "Soggetto",
  composition: "Composizione",
  lighting: "Luce",
  materials: "Materiali",
  colorPalette: "Palette colore",
  mood: "Mood",
  cameraAngle: "Angolo camera",
  foodStyling: "Styling cibo",
  background: "Sfondo",
  brandConsistency: "Coerenza brand",
  negativePrompt: "Prompt negativo",
  usageFormat: "Formato d'uso",
  fullPrompt: "Prompt completo",
  runwayPikaPrompt: "Prompt Runway/Pika",
  capCutInstructions: "Istruzioni CapCut",
  shotSequence: "Sequenza riprese",
  motionDirection: "Direzione movimento",
  cameraMovement: "Movimento camera",
  lightingDirection: "Direzione luce",
  textOverlay: "Testi overlay",
  soundDirection: "Direzione suono",
  transitionSuggestions: "Transizioni suggerite",
  recommendedDuration: "Durata consigliata",
  verticalInstructions: "Istruzioni verticale 9:16",
  localHooks: "Hook locali",
  localHashtags: "Hashtag locali",
  collaborations: "Collaborazioni",
  communityPosts: "Post comunita",
  offlineToOnlineActions: "Azioni offline-online",
  comeAndDiscoverCampaigns: "Campagne vieni a scoprire",
  launchCountdownIdeas: "Idee conto alla rovescia lancio",
  geotagStrategy: "Strategia geotag",
  googleMapsReviewStrategy: "Strategia recensioni Google Maps",
  priorityForAudience: "Priorita per pubblico",
  campaignObjective: "Obiettivo campagna",
  keyMessage: "Messaggio chiave",
  contentPlan: "Piano contenuti",
  dailyPosts: "Post giornalieri",
  reelsTikTokIdeas: "Idee Reel e TikTok",
  offlineSupport: "Supporto offline",
  metricsToTrack: "Metriche da tracciare",
  paidStrategy: "Strategia paid",
  guardrails: "Guardrail",
  verdict: "Verdetto",
  score: "Punteggio",
  whySponsorOrNot: "Perche sponsorizzare o no",
  audience: "Pubblico",
  locationRadius: "Area geografica",
  budget: "Budget",
  creativeToUse: "Creativo da usare",
  landingDestination: "Destinazione",
  expectedResult: "Risultato atteso",
  risk: "Rischio",
  scores: "Punteggi",
  brandCoherence: "Coerenza brand",
  hookStrength: "Forza hook",
  clarity: "Chiarezza",
  emotionalPower: "Potenza emotiva",
  viralityPotential: "Potenziale viralita",
  conversionPotential: "Potenziale conversione",
  visualStrength: "Forza visuale",
  ctaQuality: "Qualita CTA",
  genericRisk: "Rischio genericita",
  brutalNotes: "Note brutali",
  improvedVersion: "Versione migliorata",
  visualRewrite: "Riscrittura visuale",
  finalCta: "CTA finale",
  gridRhythm: "Ritmo griglia",
  colorBalance: "Bilanciamento colore",
  postCategories: "Categorie post",
  coverTemplates: "Template cover",
  typographyRules: "Regole tipografiche",
  reelCoverDesign: "Cover Reel",
  carouselDesign: "Design carousel",
  visualConsistency: "Coerenza visuale",
  logoUsage: "Uso logo",
  alternationRule: "Regola alternanza",
  generatedImage: "Immagine generata",
  summary: "Sintesi",
  nextActions: "Prossime azioni",
  sintesi: "Sintesi",
  cosaFunziona: "Cosa funziona",
  cosaFareOra: "Cosa fare ora",
  rischio: "Rischio",
  prossimoEsperimento: "Prossimo esperimento"
};

const defaultMetrics = {
  followers: 860,
  reach: 6200,
  impressions: 9100,
  profileVisits: 410,
  websiteClicks: 86,
  appDownloads: 42,
  saves: 96,
  shares: 58,
  comments: 31,
  reelViews: 12400,
  averageWatchTime: 7.4,
  ordersGenerated: 18,
  couponRedemptions: 11,
  storeVisitsEstimate: 54
};

const defaultSettings = {
  providerMode: "server",
  textProvider: "auto",
  imageProvider: "gemini",
  privateMode: false,
  agenticVersion: 2,
  futureOpenAiEnv: "OPENAI_API_KEY",
  futureClaudeEnv: "ANTHROPIC_API_KEY",
  futureGeminiEnv: "GEMINI_API_KEY",
  futureSupabaseUrlEnv: "NEXT_PUBLIC_SUPABASE_URL",
  futureSupabaseKeyEnv: "NEXT_PUBLIC_SUPABASE_ANON_KEY"
};

const topicSeeds = [
  "Santa Rita, abbiamo una cosa da dirti",
  "Non e una gastronomia classica",
  "La cena pronta, ma fatta come si deve",
  "Se lavori in zona, questo e per te",
  "Torino ha fame di cose semplici fatte bene",
  "Il packaging che continua a casa",
  "La prima settimana MONO",
  "Perche scaricare l'app senza sentirsi inseguiti"
];

const localHooks = [
  "Santa Rita, abbiamo una cosa da dirti.",
  "Non e una gastronomia. Vieni a capirlo.",
  "La cena pronta, ma fatta come si deve.",
  "Se lavori in zona, questo e per te.",
  "Torino ha fame di cose semplici fatte bene.",
  "Hai presente quando torni a casa e vuoi solo mangiare bene?"
];

const aiProvider = {
  name: "MONO Agent Provider",
  async generate(kind, input, state) {
    if (canUseServerAi()) {
      const aiResult = await callServerAgent(kind, input, state);
      if (aiResult) {
        return aiResult;
      }
    }

    const fallback = generateMockOutput(kind, input, state);
    return {
      motore: "Demo locale",
      notaProtezione: "Nessuna chiave API nel browser. Output generato senza inviare dati a provider esterni.",
      ...fallback
    };
  }
};

let aiStatus = {
  checked: false,
  available: false,
  configured: false,
  model: "",
  label: "Demo locale"
};

function generateMockOutput(kind, input, state) {
    const generators = {
      content: generateContentIdea,
      reel: generateReelScript,
      carousel: generateCarousel,
      stories: generateStories,
      image: generateImagePrompt,
      video: generateVideoPrompt,
      viral: generateLocalVirality,
      campaign: generateCampaign,
      adv: generateAdvRecommendation,
      critic: generateContentCritic,
      feed: generateFeedAdvisor,
      analytics: generateAnalyticsReport,
      agent: generateAgentPlan
    };

    const generator = generators[kind];
    return generator ? generator(input, state) : {};
}

function canUseServerAi() {
  return state.settings.providerMode === "server" && window.location.protocol !== "file:";
}

async function callServerAgent(kind, input, currentState) {
  try {
    const response = await fetch(AI_AGENT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        kind,
        provider: kind === "image" ? currentState.settings.imageProvider : currentState.settings.textProvider,
        imageProvider: currentState.settings.imageProvider,
        input,
        brandBrain: currentState.brandBrain,
        metrics: currentState.metrics,
        calendar: currentState.calendar.slice(0, 5),
        tasks: currentState.tasks.slice(0, 8)
      })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || data.mode !== "ai") {
      aiStatus = {
        ...aiStatus,
        checked: true,
        available: true,
        configured: false,
        label: data.code === "AI_NOT_CONFIGURED" ? "AI non configurata" : "Demo locale"
      };
      return null;
    }

    aiStatus = {
      checked: true,
      available: true,
      configured: true,
      model: data.model || aiStatus.model,
      label: data.provider === "both" ? "AI reale: OpenAI + Gemini" : `AI reale: ${providerLabel(data.provider)}`
    };

    return normalizeAiOutput(data);
  } catch {
    aiStatus = {
      ...aiStatus,
      checked: true,
      available: false,
      configured: false,
      label: "Demo locale"
    };
    return null;
  }
}

function normalizeAiOutput(data) {
  const output = data.object && typeof data.object === "object"
    ? data.object
    : {
      title: "Risposta AI MONO",
      summary: data.text || "Output generato dall'agente AI.",
      sections: []
    };

  return {
    motore: `AI reale - ${providerLabel(data.provider)}${data.model ? ` (${data.model})` : ""}`,
    notaProtezione: "Chiave API custodita lato server. Richieste non salvate dal server locale.",
    ...output
  };
}

function providerLabel(provider) {
  const map = {
    openai: "OpenAI",
    gemini: "Gemini",
    both: "OpenAI + Gemini",
    auto: "Auto"
  };

  return map[provider] || "AI";
}

function normalizeSecretValue(value) {
  let secret = String(value || "").trim();
  const assignmentMatch = secret.match(/^(?:GEMINI_API_KEY|GOOGLE_API_KEY|OPENAI_API_KEY)\s*=\s*(.+)$/i);
  if (assignmentMatch) {
    secret = assignmentMatch[1].trim();
  }

  return secret.replace(/^["']|["']$/g, "").trim();
}

function uid(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function formatDateIso(date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date, days) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function dayName(dateString) {
  return new Intl.DateTimeFormat("it-IT", { weekday: "short" }).format(new Date(`${dateString}T12:00:00`));
}

function dayNumber(dateString) {
  return new Intl.DateTimeFormat("it-IT", { day: "2-digit", month: "short" }).format(new Date(`${dateString}T12:00:00`));
}

function priorityLabel(score) {
  if (score >= 88) return "Priorita alta";
  if (score >= 74) return "Buon potenziale";
  return "Da rifinire";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function toLines(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join("\n");
  return String(value ?? "");
}

function createDefaultState() {
  const calendar = buildCalendarItems(7);
  return {
    brandBrain: { ...defaultBrandBrain },
    calendar,
    tasks: calendar.map(taskFromCalendarItem),
    metrics: { ...defaultMetrics },
    settings: { ...defaultSettings },
    outputs: {},
    generations: []
  };
}

function loadState() {
  const base = createDefaultState();

  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!stored || typeof stored !== "object") return base;

    const nextState = {
      ...base,
      ...stored,
      brandBrain: { ...base.brandBrain, ...(stored.brandBrain || {}) },
      metrics: { ...base.metrics, ...(stored.metrics || {}) },
      settings: { ...base.settings, ...(stored.settings || {}) },
      calendar: Array.isArray(stored.calendar) ? stored.calendar : base.calendar,
      tasks: Array.isArray(stored.tasks) ? stored.tasks : base.tasks,
      outputs: stored.outputs || {},
      generations: Array.isArray(stored.generations) ? stored.generations : []
    };

    if (!stored.settings?.agenticVersion) {
      nextState.settings.providerMode = "server";
      nextState.settings.agenticVersion = 2;
    }

    return nextState;
  } catch {
    return base;
  }
}

function persist() {
  if (state.settings.privateMode) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(stripTransientMedia(state)));
}

function stripTransientMedia(value) {
  if (Array.isArray(value)) {
    return value.map(stripTransientMedia);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  if (isGeneratedImage(value)) {
    return {
      provider: value.provider,
      mimeType: value.mimeType,
      nota: "Immagine generata non salvata in localStorage. Scaricala dopo la generazione se vuoi conservarla."
    };
  }

  return Object.fromEntries(Object.entries(value).map(([key, childValue]) => [key, stripTransientMedia(childValue)]));
}

function getStoredView() {
  const stored = localStorage.getItem(ACTIVE_VIEW_KEY);
  return views.some((view) => view.id === stored) ? stored : DEFAULT_VIEW;
}

let state = loadState();
let activeView = getStoredView();

const navRoot = document.querySelector("[data-nav]");
const viewRoot = document.querySelector("[data-view-root]");
const titleRoot = document.querySelector("[data-view-title]");
const toastRoot = document.querySelector("[data-toast]");

function renderNav() {
  const groups = views.reduce((acc, view) => {
    acc[view.group] = acc[view.group] || [];
    acc[view.group].push(view);
    return acc;
  }, {});

  navRoot.innerHTML = Object.entries(groups)
    .map(([group, groupViews]) => `
      <section class="nav-group">
        <div class="nav-group-title">${escapeHtml(group)}</div>
        ${groupViews
          .map((view) => `
            <button class="nav-button" type="button" data-view="${view.id}" aria-current="${activeView === view.id ? "page" : "false"}">
              <strong>${escapeHtml(view.label)}</strong>
              <span>${escapeHtml(view.hint)}</span>
            </button>
          `)
          .join("")}
      </section>
    `)
    .join("");
}

function render() {
  const view = views.find((item) => item.id === activeView) || views[0];
  titleRoot.textContent = view.label;
  renderSignals();
  renderNav();

  const renderers = {
    dashboard: renderDashboard,
    agent: () => renderGeneratorScreen("agent"),
    calendar: renderCalendar,
    create: renderCreateContent,
    reel: () => renderGeneratorScreen("reel"),
    carousel: () => renderGeneratorScreen("carousel"),
    stories: () => renderGeneratorScreen("stories"),
    image: () => renderGeneratorScreen("image"),
    video: () => renderGeneratorScreen("video"),
    viral: () => renderGeneratorScreen("viral"),
    campaigns: () => renderGeneratorScreen("campaign"),
    adv: () => renderGeneratorScreen("adv"),
    critic: () => renderGeneratorScreen("critic"),
    feed: () => renderGeneratorScreen("feed"),
    analytics: renderAnalytics,
    tasks: renderTasks,
    exports: renderExports,
    brand: renderBrandBrain,
    settings: renderSettings
  };

  viewRoot.innerHTML = (renderers[activeView] || renderDashboard)();
}

function renderSignals() {
  document.querySelector('[data-signal="objective"]').textContent = "Visite in bottega e download app";
  document.querySelector('[data-signal="phase"]').textContent = state.brandBrain.launchPhase.split(":")[0] || "Apertura";
  document.querySelector('[data-signal="ready"]').textContent = String(
    state.tasks.filter((task) => ["ready", "scheduled", "published"].includes(task.status)).length
  );
  document.querySelector('[data-signal="engine"]').textContent = state.settings.privateMode
    ? `${aiStatus.label} / privato`
    : aiStatus.label;
}

function setActiveView(viewId) {
  activeView = viewId;
  localStorage.setItem(ACTIVE_VIEW_KEY, viewId);
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showToast(message) {
  toastRoot.textContent = message;
  toastRoot.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toastRoot.classList.remove("is-visible"), 2600);
}

async function checkAiHealth() {
  if (window.location.protocol === "file:" || state.settings.providerMode !== "server") {
    aiStatus = {
      checked: true,
      available: false,
      configured: false,
      model: "",
      label: "Demo locale"
    };
    renderSignals();
    return;
  }

  try {
    const response = await fetch(AI_HEALTH_ENDPOINT, { cache: "no-store" });
    const health = await response.json();
    const configuredProviders = [];
    if (health.providers?.openai?.configured) configuredProviders.push("OpenAI");
    if (health.providers?.gemini?.configured) configuredProviders.push("Gemini");
    const providerModels = [
      health.providers?.openai?.configured ? health.providers.openai.model : "",
      health.providers?.gemini?.configured ? health.providers.gemini.textModel : ""
    ].filter(Boolean);

    aiStatus = {
      checked: true,
      available: response.ok,
      configured: Boolean(health.aiConfigured),
      model: providerModels.join(" + ") || health.model || "",
      label: health.aiConfigured ? `AI reale: ${configuredProviders.join(" + ")}` : "AI non configurata"
    };
  } catch {
    aiStatus = {
      checked: true,
      available: false,
      configured: false,
      model: "",
      label: "Demo locale"
    };
  }

  renderSignals();
}

function renderDashboard() {
  const today = state.calendar[0] || buildCalendarItems(1)[0];
  const nextPosts = state.calendar.slice(0, 3);
  const approvals = state.tasks.filter((task) => ["idea", "approved", "to shoot", "to edit"].includes(task.status)).slice(0, 5);
  const highIdeas = state.calendar.filter((item) => item.priorityScore >= 84).slice(0, 4);

  return `
    <div class="hero-dashboard">
      <section class="card dashboard-lead">
        <p class="eyebrow">Cosa pubblicare oggi</p>
        <h2>${escapeHtml(today.hook)}</h2>
        <p>${escapeHtml(today.concept)}</p>
        <div class="pill-row">
          <span class="pill dark">${escapeHtml(today.platform)}</span>
          <span class="pill dark">${escapeHtml(today.format)}</span>
          <span class="pill dark">${escapeHtml(today.pillar)}</span>
        </div>
        <div class="button-row">
          <button class="button primary" type="button" data-view="agent">Apri agente AI</button>
          <button class="button primary" type="button" data-action="open-calendar-item" data-id="${today.id}">Apri contenuto</button>
          <button class="button ghost" type="button" data-view="reel">Crea script video</button>
          <button class="button ghost" type="button" data-view="critic">Valuta una bozza</button>
        </div>
      </section>

      <aside class="card stack">
        <div>
          <p class="eyebrow">Priorita settimanali</p>
          <h3>Fiducia locale prima, conversione subito dopo.</h3>
        </div>
        <ul class="list">
          <li>Pubblica 3 video verticali con hook locale nei primi 1,5 secondi.</li>
          <li>Porta ogni contenuto verso visita in bottega o download app.</li>
          <li>Trasforma backstage e packaging in prove di qualita, non in decorazione.</li>
          <li>Raccogli domande reali da Santa Rita e usale per Stories e carousel.</li>
        </ul>
      </aside>
    </div>

    <div class="grid-3">
      <section class="card stack">
        <p class="eyebrow">Prossimi post</p>
        ${nextPosts.map(renderMiniContent).join("")}
      </section>
      <section class="card stack">
        <p class="eyebrow">Da approvare</p>
        ${approvals.length ? approvals.map(renderMiniTask).join("") : `<div class="empty-state">Nessun contenuto in approvazione.</div>`}
      </section>
      <section class="card stack">
        <p class="eyebrow">Opportunita organiche</p>
        <ul class="list">
          <li>Geotag coerenti: Santa Rita, Torino, Lingotto, Crocetta.</li>
          <li>Commenta 15 profili locali prima e dopo la pubblicazione.</li>
          <li>Chiedi una recensione Google solo dopo una visita felice.</li>
          <li>Usa un QR in bottega: "Scopri il contenuto di oggi".</li>
        </ul>
      </section>
    </div>

    <div class="grid-2">
      <section class="card stack">
        <p class="eyebrow">Idee migliori pronte</p>
        ${highIdeas.map(renderMiniContent).join("")}
      </section>
      <section class="card stack">
        <p class="eyebrow">Consulente ADV</p>
        <h3>Non sponsorizzare prima di vedere segnali organici.</h3>
        <p>Usa budget solo su contenuti con retention, salvataggi, commenti locali e CTA chiara verso visita o app.</p>
        <button class="button dark" type="button" data-view="adv">Controlla un post</button>
      </section>
    </div>
  `;
}

function renderMiniContent(item) {
  return `
    <article class="tight-stack">
      <div class="pill-row">
        <span class="pill">${escapeHtml(item.format)}</span>
        <span class="pill warn">${escapeHtml(priorityLabel(item.priorityScore))}</span>
      </div>
      <strong>${escapeHtml(item.title)}</strong>
      <span class="meta">${escapeHtml(item.pillar)} - ${escapeHtml(item.platform)}</span>
    </article>
  `;
}

function renderMiniTask(task) {
  return `
    <article class="tight-stack">
      <strong>${escapeHtml(task.title)}</strong>
      <span class="meta">${escapeHtml(taskStatusLabels[task.status] || task.status)} - ${escapeHtml(task.deadline)} - impatto ${escapeHtml(task.expectedImpact)}</span>
    </article>
  `;
}

function renderCalendar() {
  return `
    <section class="card stack">
      <div class="output-heading">
        <div>
          <p class="eyebrow">Calendario editoriale</p>
          <h2>Piano contenuti MONO</h2>
        </div>
        <div class="button-row">
          <button class="button primary" type="button" data-action="calendar-week">Genera settimana</button>
          <button class="button ghost" type="button" data-action="calendar-month">Genera mese</button>
          <button class="button ghost" type="button" data-action="export-calendar-md">Markdown</button>
          <button class="button ghost" type="button" data-action="export-calendar-csv">CSV</button>
          <button class="button ghost" type="button" data-action="export-calendar-json">JSON</button>
        </div>
      </div>
      <div class="calendar-list">
        ${state.calendar.map(renderCalendarCard).join("")}
      </div>
    </section>
  `;
}

function renderCalendarCard(item) {
  return `
    <article class="calendar-card">
      <header>
        <div class="calendar-date">
          <span>${escapeHtml(dayName(item.date))}</span>
          <strong>${escapeHtml(dayNumber(item.date))}</strong>
        </div>
        <div class="calendar-body">
          <div class="pill-row">
            <span class="pill">${escapeHtml(item.platform)}</span>
            <span class="pill">${escapeHtml(item.format)}</span>
            <span class="pill warn">${escapeHtml(item.pillar)}</span>
            <span class="pill dark">${item.priorityScore}/100</span>
          </div>
          <h3>${escapeHtml(item.title)}</h3>
          <p><strong>Hook:</strong> ${escapeHtml(item.hook)}</p>
        </div>
        <button class="chip-button" type="button" data-action="task-from-calendar" data-id="${item.id}">Task</button>
      </header>
      <div class="grid-3">
        <p><strong>Concept:</strong> ${escapeHtml(item.concept)}</p>
        <p><strong>Caption:</strong> ${escapeHtml(item.caption)}</p>
        <p><strong>CTA:</strong> ${escapeHtml(item.cta)}</p>
      </div>
      <div class="grid-3">
        <p><strong>Visual:</strong> ${escapeHtml(item.visualDirection)}</p>
        <p><strong>Shooting:</strong> ${escapeHtml(item.shootingInstructions)}</p>
        <p><strong>ADV:</strong> ${escapeHtml(item.sponsorRecommendation)}</p>
      </div>
      <div class="pill-row">
        ${item.requiredAssets.map((asset) => `<span class="pill">${escapeHtml(asset)}</span>`).join("")}
      </div>
    </article>
  `;
}

function renderCreateContent() {
  const output = state.outputs.smartCreate;
  const advisorOutput = state.outputs.instagramAdvisor;

  return `
    <section class="stack">
      <div class="tool-grid smart-create">
        <section class="form-panel stack" data-smart-create-form>
          <div>
            <p class="eyebrow">Crea</p>
            <h2>Cosa vuoi creare?</h2>
            <p>Tre passaggi: scegli piattaforma, scegli formato, scrivi il tema. Fine. Se l'AI non e configurata, funziona comunque in demo locale.</p>
          </div>

          <div class="wizard-step">
            <span class="step-badge">1</span>
            <div>
              <h3>Instagram o TikTok?</h3>
              <div class="choice-grid two">
                ${renderChoice("platform", "Instagram", "Instagram", "Caroselli, Stories, Reel, feed", true)}
                ${renderChoice("platform", "TikTok", "TikTok", "Video verticale, hook, ritmo", false)}
              </div>
            </div>
          </div>

          <div class="wizard-step">
            <span class="step-badge">2</span>
            <div>
              <h3>Che formato vuoi?</h3>
              <div class="choice-grid">
                ${renderChoice("contentType", "reel", "Reel / TikTok", "Script video pronto", true)}
                ${renderChoice("contentType", "stories", "Stories", "Sequenza interattiva", false)}
                ${renderChoice("contentType", "carousel", "Carosello", "Slide e microcopy", false)}
                ${renderChoice("contentType", "feed", "Ottimizza feed", "Ritmo, cover, griglia", false)}
                ${renderChoice("contentType", "image", "Immagine", "Visual o prompt", false)}
                ${renderChoice("contentType", "campaign", "Campagna", "Piano multi-post", false)}
              </div>
            </div>
          </div>

          <div class="wizard-step">
            <span class="step-badge">3</span>
            <div class="stack">
              <h3>Tema e obiettivo</h3>
              ${renderField("topic", "Tema", "textarea", null, "Es. cena pronta fatta come si deve per chi vive a Santa Rita")}
              ${renderField("objective", "Obiettivo", "select", [
                ["store_visit", "Portare persone in bottega"],
                ["app_download", "Far scaricare l'app"],
                ["trust", "Costruire fiducia"],
                ["desire", "Far venire voglia"],
                ["saves", "Aumentare salvataggi"],
                ["shares", "Aumentare condivisioni"]
              ])}
              ${renderField("mood", "Stile", "select", [
                ["warm", "Caldo e quotidiano"],
                ["premium", "Premium accessibile"],
                ["local", "Locale Torino / Santa Rita"],
                ["direct", "Diretto e commerciale"]
              ])}
            </div>
          </div>

          <button class="button primary button-large" type="button" data-action="generate-smart-output">Crea ora</button>
        </section>
        ${renderOutputPanel("smartCreate", output, "Scegli piattaforma, formato e tema. Poi premi Crea ora.")}
      </div>

      <div class="tool-grid">
        <section class="form-panel stack" data-instagram-advisor-form>
          <div>
            <p class="eyebrow">Instagram Advisor</p>
            <h2>Parere AI sul profilo</h2>
            <p>La connessione diretta Instagram richiede Meta Login, permessi e App Review. Per non fingere, qui puoi intanto incollare handle, note e metriche: l'AI ti dà un parere operativo continuo.</p>
          </div>
          ${renderField("instagramHandle", "Profilo Instagram", "input", null, "@mono.torino")}
          ${renderField("profileNotes", "Cosa vuoi migliorare?", "textarea", null, "Es. feed disordinato, pochi salvataggi, poca conversione in bottega")}
          ${renderField("lastMetrics", "Metriche o osservazioni", "textarea", null, "Es. ultimo Reel 3.200 views, 68 like, 9 salvataggi, pochi commenti")}
          <div class="button-row">
            <button class="button primary" type="button" data-action="analyze-instagram-profile">Dammi parere AI</button>
            <button class="button ghost" type="button" data-action="connect-instagram">Collega Instagram</button>
          </div>
        </section>
        ${renderOutputPanel("instagramAdvisor", advisorOutput, "Incolla profilo e metriche: ricevi critica, priorita e prossime azioni.")}
      </div>
    </section>
  `;
}

function renderChoice(name, value, title, hint, checked) {
  return `
    <label class="choice-card">
      <input type="radio" name="${escapeHtml(name)}" value="${escapeHtml(value)}" ${checked ? "checked" : ""}>
      <strong>${escapeHtml(title)}</strong>
      <span>${escapeHtml(hint)}</span>
    </label>
  `;
}

function renderGeneratorScreen(kind) {
  const config = generatorConfigs[kind];
  const output = state.outputs[kind];

  return `
    <div class="tool-grid">
      <section class="form-panel stack">
        <div>
          <p class="eyebrow">${escapeHtml(config.eyebrow)}</p>
          <h2>${escapeHtml(config.title)}</h2>
        </div>
        ${config.fields.map((field) => renderField(field.name, field.label, field.type, field.options, field.placeholder)).join("")}
        <button class="button primary" type="button" data-action="generate-output" data-kind="${kind}">${escapeHtml(config.button)}</button>
      </section>
      ${renderOutputPanel(kind, output, config.empty)}
    </div>
  `;
}

const generatorConfigs = {
  agent: {
    eyebrow: "Direzione operativa",
    title: "Agente AI MONO",
    button: "Chiedi decisione all'agente",
    empty: "Descrivi situazione, dubbio o obiettivo. L'agente restituisce decisione, piano, task e guardrail.",
    fields: [
      { name: "situation", label: "Situazione", type: "textarea", placeholder: "Es. questa settimana voglio aumentare visite in bottega e download app, ho poco tempo per girare video." },
      { name: "decisionType", label: "Tipo decisione", type: "select", options: [["today", "Cosa fare oggi"], ["week", "Priorita settimana"], ["launch", "Piano lancio"], ["content", "Scelta contenuti"], ["growth", "Crescita organica"], ["adv", "ADV e budget"]] },
      { name: "constraint", label: "Vincolo", type: "select", options: [["low_time", "Poco tempo"], ["low_budget", "Budget basso"], ["no_assets", "Pochi asset"], ["opening", "Apertura"], ["quality", "Massima coerenza brand"]] }
    ]
  },
  reel: {
    eyebrow: "Retenzione e conversione",
    title: "Generatore Reel / TikTok",
    button: "Genera script video",
    empty: "Genera hook, scene, voiceover, caption, CTA e note di produzione.",
    fields: [
      { name: "topic", label: "Tema", type: "input", placeholder: "Es. pranzo per chi lavora in Santa Rita" },
      { name: "pillar", label: "Pilastro", type: "select", options: contentPillars.map((pillar) => [pillar.id, pillar.title]) },
      { name: "audience", label: "Target", type: "select", options: [["lavoratori", "Lavoratori in zona"], ["famiglie", "Famiglie"], ["residenti", "Residenti"], ["studenti", "Studenti"], ["food_lovers", "Appassionati di cucina torinesi"]] },
      { name: "objective", label: "Obiettivo", type: "select", options: [["store_visit", "Visita in bottega"], ["app_download", "Download app"], ["saves", "Salvataggi"], ["shares", "Condivisioni"]] }
    ]
  },
  carousel: {
    eyebrow: "Slide salvabili",
    title: "Generatore carousel",
    button: "Genera carousel",
    empty: "Genera slide, microcopy, direzione visuale, caption e prompt immagine.",
    fields: [
      { name: "type", label: "Tipo", type: "select", options: [
        ["cos_e_mono", "Cos'e MONO"],
        ["non_classica", "Perche non siamo una gastronomia classica"],
        ["rigenerare", "Come rigenerare un piatto MONO"],
        ["app", "5 motivi per scaricare l'app"],
        ["quotidiana", "La cucina da ristorante nella vita quotidiana"],
        ["santa_rita", "Santa Rita ha una nuova bottega"],
        ["semplice", "Semplice. Buono. MONO."],
        ["packaging", "Il packaging non e solo una busta"],
        ["convivium", "MONO Convivium spiegato bene"],
        ["cosa_compri", "Cosa compri quando compri MONO"]
      ] },
      { name: "slides", label: "Numero slide", type: "select", options: [["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"]] },
      { name: "objective", label: "Obiettivo", type: "select", options: [["saves", "Salvataggi"], ["trust", "Fiducia"], ["app_download", "Download app"], ["store_visit", "Visita in bottega"]] }
    ]
  },
  stories: {
    eyebrow: "Interazione quotidiana",
    title: "Generatore Stories",
    button: "Genera stories",
    empty: "Genera sequenza, sticker, copy e CTA locale.",
    fields: [
      { name: "moment", label: "Momento", type: "select", options: [["mattina", "Mattina"], ["pranzo", "Pranzo"], ["pomeriggio", "Pomeriggio"], ["cena", "Cena"], ["launch", "Conto alla rovescia lancio"]] },
      { name: "topic", label: "Tema", type: "input", placeholder: "Es. cosa mangiare stasera" },
      { name: "objective", label: "Obiettivo", type: "select", options: [["poll", "Risposte e sondaggio"], ["store_visit", "Visita"], ["app_download", "App"], ["loyalty", "Fedelta"]] }
    ]
  },
  image: {
    eyebrow: "Prompt gastronomici premium",
    title: "Generatore prompt immagini",
    button: "Genera prompt immagine",
    empty: "Genera prompt originale, coerente con palette e materiali MONO.",
    fields: [
      { name: "subject", label: "Soggetto", type: "input", placeholder: "Es. lasagna MONO nel packaging" },
      { name: "usage", label: "Formato uso", type: "select", options: [["square post", "Post quadrato"], ["vertical story", "Story verticale"], ["reel cover", "Cover Reel"], ["carousel slide", "Slide carousel"], ["app promo", "Promo app"], ["launch poster", "Poster lancio"]] },
      { name: "mood", label: "Mood", type: "select", options: [["warm", "Caldo e quotidiano"], ["premium", "Premium accessibile"], ["local", "Locale e umano"], ["technical", "Pulito e gastronomico"]] }
    ]
  },
  video: {
    eyebrow: "Video IA e shooting",
    title: "Generatore prompt video",
    button: "Genera piano video",
    empty: "Genera prompt Runway/Pika-style, CapCut e guida di ripresa manuale.",
    fields: [
      { name: "concept", label: "Concept", type: "input", placeholder: "Es. packaging che arriva sulla tavola di casa" },
      { name: "duration", label: "Durata", type: "select", options: [["8", "8 secondi"], ["12", "12 secondi"], ["18", "18 secondi"], ["25", "25 secondi"]] },
      { name: "motion", label: "Movimento", type: "select", options: [["slow_push", "Avvicinamento lento"], ["top_down", "Ripresa dall'alto"], ["handheld", "Mano calda e stabile"], ["macro", "Macro dettaglio piatto"]] }
    ]
  },
  viral: {
    eyebrow: "Motore viralita locale",
    title: "Idee virali Torino",
    button: "Genera opportunita locali",
    empty: "Genera hook, hashtag, collaborazioni, QR poster, geotag e recensioni.",
    fields: [
      { name: "area", label: "Area", type: "select", options: [["Santa Rita", "Santa Rita"], ["Mirafiori", "Mirafiori"], ["Crocetta", "Crocetta"], ["Lingotto", "Lingotto"], ["San Paolo", "San Paolo"], ["Torino", "Torino"]] },
      { name: "audience", label: "Pubblico", type: "select", options: [["residenti", "Residenti"], ["lavoratori", "Lavoratori"], ["famiglie", "Famiglie"], ["studenti", "Studenti"], ["curiosi", "Curiosi di quartiere"]] },
      { name: "moment", label: "Momento", type: "select", options: [["lunch", "Pausa pranzo"], ["dinner", "Cena a casa"], ["aperitivo", "Aperitivo"], ["opening", "Attesa apertura"], ["weekend", "Fine settimana"]] }
    ]
  },
  campaign: {
    eyebrow: "Costruttore campagne",
    title: "Costruisci campagna",
    button: "Genera campagna",
    empty: "Genera obiettivo, messaggio, contenuti, Stories, offline support e metriche.",
    fields: [
      { name: "type", label: "Tipo campagna", type: "select", options: [
        ["pre-opening", "Pre-apertura"],
        ["opening countdown", "Conto alla rovescia apertura"],
        ["launch week", "Settimana lancio"],
        ["app download", "Download app"],
        ["fidelity card", "Tessera fedelta"],
        ["first visit", "Prima visita"],
        ["product launch", "Lancio prodotto"],
        ["weekly menu", "Menu settimanale"],
        ["aperitivo", "Aperitivo"],
        ["catering", "Catering"],
        ["gift card", "Buono regalo"],
        ["MONO Convivium", "MONO Convivium"],
        ["neighborhood campaign", "Campagna di quartiere"],
        ["review generation", "Generazione recensioni"],
        ["inactive customer reactivation", "Riattivazione clienti inattivi"]
      ] },
      { name: "duration", label: "Durata", type: "select", options: [["3 giorni", "3 giorni"], ["7 giorni", "7 giorni"], ["14 giorni", "14 giorni"], ["30 giorni", "30 giorni"]] },
      { name: "goal", label: "Obiettivo", type: "select", options: [["store_visit", "Visite in bottega"], ["app_download", "Download app"], ["orders", "Ordini"], ["reviews", "Recensioni"], ["loyalty", "Fedelta"]] }
    ]
  },
  adv: {
    eyebrow: "Consulente paid media",
    title: "Consulente ADV",
    button: "Valuta sponsorizzazione",
    empty: "Inserisci segnali organici e ricevi verdetto, budget, audience e rischio.",
    fields: [
      { name: "creative", label: "Creativo", type: "input", placeholder: "Es. Reel cena pronta Santa Rita" },
      { name: "watchTime", label: "Tempo medio di visione", type: "input", placeholder: "Es. 7.4" },
      { name: "saveRate", label: "Save rate %", type: "input", placeholder: "Es. 2.8" },
      { name: "shareRate", label: "Share rate %", type: "input", placeholder: "Es. 1.9" },
      { name: "localComments", label: "Commenti locali", type: "input", placeholder: "Es. 12" }
    ]
  },
  critic: {
    eyebrow: "Direzione creativa",
    title: "Critico contenuti",
    button: "Valuta e riscrivi",
    empty: "Incolla bozza, caption o idea. Il sistema assegna score e riscrive.",
    fields: [
      { name: "draft", label: "Bozza", type: "textarea", placeholder: "Incolla qui la caption o l'idea da valutare." },
      { name: "format", label: "Formato", type: "select", options: formats.map((format) => [format, format]) }
    ]
  },
  feed: {
    eyebrow: "Sistema visivo",
    title: "Consulente design feed",
    button: "Genera ritmo feed",
    empty: "Genera ritmo griglia, categorie, cover, palette e regole logo.",
    fields: [
      { name: "period", label: "Periodo", type: "select", options: [["9 post", "9 post"], ["12 post", "12 post"], ["15 post", "15 post"]] },
      { name: "focus", label: "Focus", type: "select", options: [["opening", "Apertura"], ["food", "Cibo e desiderio"], ["app", "App e fedelta"], ["community", "Community locale"]] }
    ]
  }
};

function renderField(name, label, type, options, placeholder = "") {
  if (type === "select") {
    return `
      <label class="field">
        <span class="field-label">${escapeHtml(label)}</span>
        <select name="${escapeHtml(name)}">
          ${options.map(([value, text]) => `<option value="${escapeHtml(value)}">${escapeHtml(text)}</option>`).join("")}
        </select>
      </label>
    `;
  }

  if (type === "textarea") {
    return `
      <label class="field">
        <span class="field-label">${escapeHtml(label)}</span>
        <textarea name="${escapeHtml(name)}" placeholder="${escapeHtml(placeholder)}"></textarea>
      </label>
    `;
  }

  return `
    <label class="field">
      <span class="field-label">${escapeHtml(label)}</span>
      <input name="${escapeHtml(name)}" type="text" placeholder="${escapeHtml(placeholder)}">
    </label>
  `;
}

function renderOutputPanel(kind, output, emptyText) {
  return `
    <section class="output-panel stack" data-output-kind="${kind}">
      <div class="output-heading">
        <div>
          <p class="eyebrow">Output</p>
          <h2>${output ? escapeHtml(output.title || output.titolo || "Pronto da usare") : "In attesa"}</h2>
        </div>
        <div class="button-row">
          <button class="chip-button" type="button" data-action="copy-output" data-kind="${kind}" ${output ? "" : "disabled"}>Copia</button>
          <button class="chip-button" type="button" data-action="task-from-output" data-kind="${kind}" ${output ? "" : "disabled"}>Task</button>
        </div>
      </div>
      ${output ? renderStructuredOutput(output) : `<div class="empty-state">${escapeHtml(emptyText)}</div>`}
    </section>
  `;
}

function renderStructuredOutput(output) {
  return `<div class="output-list">${Object.entries(output)
    .filter(([key]) => !["id", "createdAt", "title"].includes(key))
    .map(([key, value]) => renderOutputBlock(labelize(key), value))
    .join("")}</div>`;
}

function renderOutputBlock(label, value) {
  if (isGeneratedImage(value)) {
    return `
      <div class="output-block">
        <strong>${escapeHtml(label)}</strong>
        <figure class="generated-image-card">
          <img src="${escapeHtml(value.dataUrl)}" alt="Immagine generata per MONO">
          <figcaption>Generata con ${escapeHtml(providerLabel(value.provider))}. Non viene salvata in chiaro sul server locale.</figcaption>
          <a class="chip-button" href="${escapeHtml(value.dataUrl)}" download="mono-social-studio-gemini.png">Scarica immagine</a>
        </figure>
      </div>
    `;
  }

  if (Array.isArray(value)) {
    return `
      <div class="output-block">
        <strong>${escapeHtml(label)}</strong>
        <ul class="list">
          ${value.map((item) => `<li>${typeof item === "object" ? renderObjectInline(item) : escapeHtml(item)}</li>`).join("")}
        </ul>
      </div>
    `;
  }

  if (value && typeof value === "object") {
    return `
      <div class="output-block">
        <strong>${escapeHtml(label)}</strong>
        <div class="tight-stack">${Object.entries(value).map(([childKey, childValue]) => `<p><strong>${escapeHtml(labelize(childKey))}:</strong> ${escapeHtml(toLines(childValue))}</p>`).join("")}</div>
      </div>
    `;
  }

  return `
    <div class="output-block">
      <strong>${escapeHtml(label)}</strong>
      <p>${escapeHtml(value)}</p>
    </div>
  `;
}

function isGeneratedImage(value) {
  return Boolean(value && typeof value === "object" && typeof value.dataUrl === "string" && value.dataUrl.startsWith("data:image/"));
}

function renderObjectInline(value) {
  return Object.entries(value)
    .map(([key, childValue]) => `<strong>${escapeHtml(labelize(key))}:</strong> ${escapeHtml(toLines(childValue))}`)
    .join(" - ");
}

function labelize(key) {
  if (outputLabels[key]) {
    return outputLabels[key];
  }

  return key
    .replace(/([A-Z])/g, " $1")
    .replaceAll("_", " ")
    .replace(/^./, (letter) => letter.toUpperCase());
}

function buildCalendarItems(days) {
  const start = new Date();
  return Array.from({ length: days }, (_, index) => {
    const pillar = contentPillars[index % contentPillars.length];
    const format = formats[(index * 2) % formats.length];
    const date = formatDateIso(addDays(start, index));
    const hook = localHooks[index % localHooks.length];
    const priorityScore = 72 + ((index * 7) % 25);
    const topic = topicSeeds[index % topicSeeds.length];
    const platform = index % 3 === 0 ? "Instagram + TikTok" : index % 3 === 1 ? "Instagram" : "TikTok";

    return {
      id: uid("calendar"),
      date,
      platform,
      format,
      pillar: pillar.title,
      title: `${topic}`,
      hook,
      concept: `Raccontare ${pillar.summary.toLowerCase()} con una prova concreta: prodotto reale, gesto umano e riferimento a Torino.`,
      caption: `${hook} Da MONO il buono deve essere semplice, riconoscibile e pronto quando serve. Passa in bottega o apri l'app MONO.`,
      cta: index % 2 === 0 ? "Passa oggi in bottega a Santa Rita." : "Apri l'app MONO e salva il contenuto.",
      visualDirection: "Luce calda, piano ravvicinato, superfici cashmere e accento terracotta, cibo reale al centro.",
      shootingInstructions: "Riprendi in verticale 9:16, apertura entro 1,5 secondi, alterna macro cibo, gesto mano, dettaglio packaging e chiusura CTA.",
      requiredAssets: ["telefono", "piatto reale", "packaging", "luce calda", "logo discreto"],
      expectedObjective: index % 2 === 0 ? "Visita in bottega" : "Download app",
      difficultyLevel: index % 4 === 0 ? "Media" : "Bassa",
      organicPotential: priorityScore > 84 ? "Alto" : "Medio",
      sponsorRecommendation: priorityScore > 88 ? "Sponsorizzare solo se i primi dati organici confermano retention e salvataggi." : "Non sponsorizzare subito: prima validare organicamente.",
      priorityScore
    };
  });
}

function taskFromCalendarItem(item) {
  return {
    id: uid("task"),
    sourceId: item.id,
    title: item.title,
    owner: "Federico",
    deadline: item.date,
    requiredAssets: item.requiredAssets,
    script: item.concept,
    caption: item.caption,
    format: item.format,
    priority: item.priorityScore,
    difficulty: item.difficultyLevel,
    expectedImpact: item.expectedObjective,
    status: "idea"
  };
}

function syncTasksFromCalendar() {
  const existingSourceIds = new Set(state.tasks.map((task) => task.sourceId).filter(Boolean));
  const newTasks = state.calendar.filter((item) => !existingSourceIds.has(item.id)).map(taskFromCalendarItem);
  state.tasks = [...newTasks, ...state.tasks].slice(0, 120);
}

function getPillarTitle(id) {
  return contentPillars.find((pillar) => pillar.id === id)?.title || "Identita MONO";
}

function getToolInput(kind) {
  const panel = document.querySelector(`[data-output-kind="${kind}"]`)?.previousElementSibling;
  const formPanel = panel?.matches(".form-panel") ? panel : document.querySelector(".form-panel");
  const values = {};

  formPanel?.querySelectorAll("input, select, textarea").forEach((field) => {
    values[field.name] = field.value.trim();
  });

  return values;
}

function getSmartCreateInput() {
  const formPanel = document.querySelector("[data-smart-create-form]");
  const values = {};
  formPanel?.querySelectorAll("input, select, textarea").forEach((field) => {
    if (field.type === "radio" && !field.checked) {
      return;
    }

    values[field.name] = field.value.trim();
  });

  const kind = values.contentType || "reel";
  const topic = values.topic || "cena pronta fatta come si deve";
  const objective = values.objective || "store_visit";
  const platform = values.platform || "Instagram + TikTok";
  const mood = values.mood || "warm";
  const commonInput = {
    topic,
    objective,
    platform,
    mood,
    pillar: "quartiere",
    audience: "residenti"
  };

  const inputMap = {
    content: {
      ...commonInput,
      format: platform.includes("TikTok") ? "TikTok" : "Instagram Post"
    },
    reel: commonInput,
    carousel: {
      ...commonInput,
      type: "quotidiana",
      slides: "6"
    },
    stories: {
      ...commonInput,
      moment: platform.includes("Stories") ? "cena" : "launch"
    },
    image: {
      subject: topic,
      usage: platform.includes("TikTok") ? "reel cover" : "vertical story",
      mood
    },
    video: {
      concept: topic,
      duration: "12",
      motion: "slow_push",
      mood
    },
    campaign: {
      type: objective === "app_download" ? "app download" : "launch week",
      duration: "7 giorni",
      objective,
      keyMessage: topic
    },
    viral: {
      area: "Santa Rita",
      audience: "residenti",
      moment: objective === "store_visit" ? "dinner" : "opening",
      topic
    },
    adv: {
      watchTime: "7",
      saveRate: objective === "saves" ? "8" : "4",
      shareRate: objective === "shares" ? "7" : "3",
      localComments: "5",
      topic
    },
    critic: {
      draft: topic,
      format: platform
    },
    feed: {
      period: "9",
      objective,
      topic
    }
  };

  return {
    kind,
    input: inputMap[kind] || commonInput
  };
}

function getInstagramAdvisorInput() {
  const formPanel = document.querySelector("[data-instagram-advisor-form]");
  const values = {};
  formPanel?.querySelectorAll("input, select, textarea").forEach((field) => {
    values[field.name] = field.value.trim();
  });

  return {
    period: "9",
    objective: "Ottimizzare Instagram per visite in bottega, fiducia e download app.",
    topic: [
      `Profilo: ${values.instagramHandle || "@mono.torino"}`,
      `Problema percepito: ${values.profileNotes || "Serve un parere sul feed e sulla chiarezza del posizionamento."}`,
      `Metriche/osservazioni: ${values.lastMetrics || "Metriche non inserite: ragiona su priorita qualitative e prossimi test."}`
    ].join("\n")
  };
}

function rememberOutput(kind, output) {
  state.outputs[kind] = {
    id: uid(kind),
    createdAt: new Date().toISOString(),
    ...output
  };
  state.generations.unshift({
    id: state.outputs[kind].id,
    kind,
    title: output.title || output.titolo || labelize(kind),
    createdAt: state.outputs[kind].createdAt
  });
  state.generations = state.generations.slice(0, 80);
  persist();
}

function generateContentIdea(input) {
  const pillar = getPillarTitle(input.pillar);
  const topic = input.topic || "La cena pronta, ma fatta come si deve";
  const format = input.format || "Instagram Reel";

  return {
    title: `${topic} - ${format}`,
    formato: format,
    pilastro: pillar,
    obiettivo: objectiveText(input.objective),
    hook: localHooks[Math.floor(Math.random() * localHooks.length)],
    concept: `Partire da un gesto quotidiano e far vedere perche MONO rende quel gesto piu buono, piu curato e piu semplice.`,
    caption: `${topic}. Non serve complicare la giornata per mangiare bene. MONO porta cucina contemporanea nella vita di tutti i giorni. Ti aspettiamo a Santa Rita.`,
    cta: input.objective === "app_download" ? "Scarica l'app MONO e salva il prossimo ordine." : "Passa in bottega e dicci che arrivi da Instagram.",
    visualDirection: "Inquadratura verticale, dettaglio cibo reale, mano che apre packaging, chiusura con logo piccolo.",
    hashtags: ["#monotorino", "#santarita", "#torinofood", "#bottegagastronomica", "#cucinacontemporanea"],
    guardrail: "Non inventare prezzo, ingredienti specifici o disponibilita se non confermati.",
    taskSuggerito: "Girare 3 take da 8 secondi, selezionare il migliore, montare con ritmo rapido e CTA finale."
  };
}

function generateReelScript(input) {
  const topic = input.topic || "La cena pronta, ma fatta come si deve";
  const pillar = getPillarTitle(input.pillar);

  return {
    title: `Reel / TikTok - ${topic}`,
    objective: objectiveText(input.objective),
    targetAudience: audienceText(input.audience),
    hookFirstSecond: "Hai 10 minuti e vuoi mangiare come si deve?",
    visualOpening: "Mano che appoggia il packaging MONO su una tavola vera, apertura rapida sul piatto.",
    shotList: [
      "0:00-0:02 packaging sul tavolo, hook in sovraimpressione",
      "0:02-0:05 dettaglio del piatto che viene aperto o rigenerato",
      "0:05-0:09 close-up consistenza, vapore, taglio o cucchiaio",
      "0:09-0:13 Federico o mano in cucina: prova umana",
      "0:13-0:18 chiusura su piatto pronto e CTA Santa Rita/app"
    ],
    sceneByScene: [
      { scena: "Apertura", testo: "La cena pronta, ma fatta come si deve.", nota: "Nessun intro lungo." },
      { scena: "Prova", testo: "Cucina da ristorante nella vita di tutti i giorni.", nota: "Mostrare prodotto reale." },
      { scena: "Locale", testo: "Siamo a Torino, in Santa Rita.", nota: "Geotag visibile." },
      { scena: "Conversione", testo: "Passa in bottega o apri l'app MONO.", nota: "CTA chiara." }
    ],
    voiceover: "Ci sono giorni in cui vuoi solo tornare a casa e mangiare bene. MONO nasce per questo: cucina contemporanea, pronta quando serve, fatta con cura vera.",
    onScreenText: ["Cena pronta.", "Fatta come si deve.", "Santa Rita, Torino.", "Semplice. Buono. MONO."],
    caption: `${topic}. Se lavori o vivi in zona, salva questo video: la prossima cena puo essere piu semplice.`,
    hashtags: ["#monotorino", "#santarita", "#torinofood", "#torino", "#cenaacasa"],
    geotags: ["Santa Rita", "Torino", "Lingotto", "Mirafiori", "Crocetta"],
    cta: input.objective === "app_download" ? "Apri l'app MONO e salva il prossimo ordine." : "Passa in bottega in Santa Rita.",
    soundMusicDirection: "Base calda, minimale, percussiva leggera; no audio trend se rende il brand cheap.",
    editingRhythm: "Tagli ogni 1,5-2 secondi, macro food alternata a gesto umano.",
    duration: "18 secondi",
    filmingInstructions: "Verticale 9:16, luce laterale calda, niente zoom digitali, chiusura pulita su packaging.",
    propsNeeded: ["packaging MONO", "piatto reale", "posate acciaio", "tovagliolo cashmere", "telefono con app"],
    foodStylingNotes: "Porzione vera, superficie pulita, piccolo disordine umano controllato, salsa o texture visibile.",
    viralityAngle: "Trasforma un bisogno quotidiano locale in una promessa memorabile e ripetibile.",
    localRelevance: "Parla a chi vive o lavora in Santa Rita e non vuole scegliere tra comodita e qualita.",
    whyItCouldWork: "Hook pratico, prova visiva immediata, riferimento locale e CTA concreta.",
    risks: "Se il piatto non e molto appetitoso in apertura, il video perde retention.",
    difficulty: "Media",
    priorityScore: 91,
    pillar
  };
}

function generateCarousel(input) {
  const slideCount = Number(input.slides || 6);
  const titleMap = {
    cos_e_mono: "Cos'e MONO",
    non_classica: "Perche non siamo una gastronomia classica",
    rigenerare: "Come rigenerare un piatto MONO",
    app: "5 motivi per scaricare l'app",
    quotidiana: "La cucina da ristorante nella vita quotidiana",
    santa_rita: "Santa Rita ha una nuova bottega",
    semplice: "Semplice. Buono. MONO.",
    packaging: "Il packaging non e solo una busta",
    convivium: "MONO Convivium spiegato bene",
    cosa_compri: "Cosa compri quando compri MONO"
  };
  const title = titleMap[input.type] || "Cos'e MONO";

  return {
    title,
    objective: objectiveText(input.objective),
    numberOfSlides: slideCount,
    slides: Array.from({ length: slideCount }, (_, index) => ({
      slide: index + 1,
      headline: index === 0 ? title : carouselHeadline(title, index),
      microcopy: carouselCopy(title, index),
      visualDirection: index % 2 === 0 ? "Fondo cashmere, foto food ravvicinata, titolo antracite." : "Fondo terracotta bruciata, dettaglio packaging, microcopy ivory.",
      imagePrompt: `Editorial food still life per MONO, ${title}, luce calda, materiali tattili, palette cashmere terracotta oliva, composizione pulita, no stile copiato.`
    })),
    ctaSlide: "Salva il post, passa in bottega a Santa Rita o apri l'app MONO.",
    designNotes: "Usare griglia 4:5, margini ampi, titolo breve, logo solo in chiusura.",
    backgroundColorSuggestion: "Cashmere per copertina, terracotta per snodi, oliva per CTA.",
    typographyMood: "Sans contemporaneo, peso alto sui titoli, corpo leggibile e caldo.",
    caption: `${title}. MONO nasce per rendere semplice una cosa importante: mangiare bene nella vita vera.`,
    hashtags: ["#monotorino", "#bottegagastronomica", "#torinofood", "#santarita"],
    whyThisCarouselMatters: "Chiarisce posizionamento e riduce ambiguita: chi salva capisce quando usare MONO."
  };
}

function carouselHeadline(title, index) {
  const lines = [
    "Non vendiamo solo piatti.",
    "Rendiamo piu semplice il quotidiano.",
    "Il buono deve essere riconoscibile.",
    "Torino e il nostro punto di partenza.",
    "L'app chiude il cerchio.",
    "Semplice. Buono. MONO.",
    "La prossima volta sai dove andare."
  ];
  return lines[(index - 1) % lines.length] || title;
}

function carouselCopy(title, index) {
  const copy = [
    "Ogni contenuto deve spiegare una differenza concreta, non decorare il feed.",
    "Cucina curata, formati quotidiani, linguaggio umano.",
    "La qualita si vede nei dettagli: ingredienti, gesto, packaging, servizio.",
    "Santa Rita non e un dettaglio geografico: e la comunita da cui partire.",
    "L'app serve quando rende piu facile ordinare, tornare e ricevere attenzioni.",
    "La frase e breve perche deve restare in testa.",
    "CTA finale: visita, salvataggio o download app."
  ];
  return copy[(index - 1) % copy.length];
}

function generateStories(input) {
  const topic = input.topic || "cosa mangiare stasera";

  return {
    title: `Stories - ${topic}`,
    objective: objectiveText(input.objective),
    numberOfStories: 7,
    sequence: [
      { story: 1, copy: "Oggi in bottega si parte da qui.", visualDirection: "Dettaglio banco o preparazione", sticker: "Nessuno", cta: "Guarda la prossima" },
      { story: 2, copy: `Domanda vera: cosa ti salva la cena quando arrivi tardi?`, visualDirection: "Piatto in apertura", sticker: "Box domande", cta: "Rispondi" },
      { story: 3, copy: "Meglio pronto o fatto bene? La risposta giusta e: entrambi.", visualDirection: "Prima/dopo rigenerazione", sticker: "Sondaggio", cta: "Vota" },
      { story: 4, copy: "Questo e il gesto MONO: semplice, caldo, concreto.", visualDirection: "Mano, packaging, piatto", sticker: "Slider", cta: "Salva idea" },
      { story: 5, copy: "Se sei in Santa Rita, passa a vedere cosa c'e oggi.", visualDirection: "Esterno o dettaglio quartiere", sticker: "Geotag", cta: "Apri mappa" },
      { story: 6, copy: "Nell'app trovi ordini, vantaggi e notifiche utili.", visualDirection: "Telefono con app", sticker: "Link", cta: "Apri app" },
      { story: 7, copy: "Semplice. Buono. MONO.", visualDirection: "Logo discreto e piatto", sticker: "Conto alla rovescia o promemoria", cta: "Ci vediamo in bottega" }
    ],
    localRelevance: "Parla a persone che decidono pranzo o cena nel raggio reale di Santa Rita.",
    finalReminder: "Ripubblicare le risposte migliori il giorno dopo come prova sociale."
  };
}

function generateImagePrompt(input) {
  const subject = input.subject || "piatto MONO nel packaging";
  const usage = input.usage || "vertical story";

  return {
    title: `Prompt immagine - ${subject}`,
    subject,
    composition: usage.includes("vertical") || usage.includes("reel") ? "Composizione verticale 9:16, soggetto nel terzo inferiore, spazio pulito per testo." : "Composizione editoriale 4:5 o 1:1, piatto centrale, respiro laterale.",
    lighting: "Luce calda laterale, morbida, naturale, con riflessi controllati su acciaio e ceramica.",
    materials: "Carta tattile, tovaglia cashmere, legno noce, acciaio satinato, packaging MONO.",
    colorPalette: "Cashmere white, warm butter, terracotta, burnt olive, anthracite, piccoli accenti champagne.",
    mood: moodText(input.mood),
    cameraAngle: "45 gradi ravvicinato con profondita naturale; macro detail per texture del cibo.",
    foodStyling: "Porzione reale, appetitosa, non perfetta in modo finto; vapore o salsa se presente davvero.",
    background: "Superficie pulita da bottega contemporanea italiana, nessun elemento cheap o rumoroso.",
    brandConsistency: "Premium accessibile, umano, locale, niente estetica fast food o influencer.",
    negativePrompt: "No copie di artisti, no volti riconoscibili senza consenso, no mani deformate, no packaging inventato con claim falsi, no prezzi, no stile stock freddo.",
    usageFormat: usage,
    fullPrompt: `Immagine originale premium per il branding gastronomico di MONO Bottega Gastronomica a Torino. Soggetto: ${subject}. Luce laterale calda, carta tattile, legno noce, acciaio satinato, palette cashmere e terracotta, atmosfera italiana contemporanea da cucina di qualita quotidiana, styling gastronomico realistico, sfondo pulito, formato ${usage}, nessuno stile di artista copiato, nessun claim falso, nessuna atmosfera da ristorazione veloce economica.`
  };
}

function generateVideoPrompt(input) {
  const concept = input.concept || "packaging MONO che arriva sulla tavola di casa";

  return {
    title: `Prompt video - ${concept}`,
    runwayPikaPrompt: `Video verticale 9:16 cinematografico per il branding gastronomico di MONO Bottega Gastronomica, Torino. ${concept}. Luce calda da cucina contemporanea italiana, packaging tattile, mani reali, movimento lento e appetitoso, palette cashmere terracotta oliva antracite, mood premium accessibile, nessuno stile copiato, nessun claim falso.`,
    capCutInstructions: "Formato 9:16, tagli a tempo ogni 1,5-2 secondi, testo breve antracite su fondo chiaro, chiusura con CTA in 1 secondo.",
    shotSequence: [
      "Apertura macro: packaging entra in campo.",
      "Movimento: mano apre, dettaglio materiale.",
      "Rivelazione del piatto: texture e vapore se reali.",
      "Human proof: gesto di servizio o assaggio.",
      "Finale: app o bottega con CTA."
    ],
    motionDirection: motionText(input.motion),
    cameraMovement: "Camera stabile, micro movimento naturale, niente transizioni aggressive.",
    lightingDirection: "Luce calda laterale, ombre morbide, riflessi su acciaio controllati.",
    textOverlay: ["Pronto.", "Fatto bene.", "Santa Rita.", "MONO."],
    soundDirection: "Base calda e minimale, suoni reali di carta, posate, apertura packaging.",
    transitionSuggestions: "Match cut tra packaging e piatto; hard cut sul morso; fade solo in chiusura.",
    recommendedDuration: `${input.duration || 12} secondi`,
    verticalInstructions: "Lascia safe area centrale per testo e CTA; nessun elemento importante sotto i controlli TikTok."
  };
}

function generateLocalVirality(input) {
  const area = input.area || "Santa Rita";
  const audience = input.audience || "residenti";

  return {
    title: `Viralita locale - ${area}`,
    localHooks: [
      `${area}, abbiamo una cosa da dirti.`,
      `Se vivi in ${area}, questo e per la tua prossima cena.`,
      "Non e una gastronomia. Vieni a capirlo.",
      "Torino ha fame di cose semplici fatte bene."
    ],
    localHashtags: [`#${area.replace(/\s+/g, "").toLowerCase()}`, "#torinofood", "#monotorino", "#torinodamangiare", "#bottegagastronomica"],
    collaborations: [
      "Palestra o studio yoga di quartiere: contenuto pranzo/cena post allenamento.",
      "Fioraio o libreria locale: box regalo o aperitivo di vicinato.",
      "Uffici e coworking: pausa pranzo MONO con QR dedicato.",
      "Micro creator torinesi con audience reale, non solo vanity metrics."
    ],
    communityPosts: [
      `Cosa manca davvero a ${area} quando arrivi a casa tardi?`,
      "La mappa dei 10 minuti: da lavoro a cena fatta bene.",
      "Chiediamo ai vicini: cosa vorreste trovare in bottega?"
    ],
    offlineToOnlineActions: [
      "QR poster in bottega: 'Vota il piatto che vuoi vedere domani'.",
      "Cartolina nel packaging con CTA recensione Google dopo esperienza positiva.",
      "Sticker sul banco: 'Se lavori in zona, salva questo profilo'."
    ],
    comeAndDiscoverCampaigns: [
      "Non e una gastronomia. Vieni a capirlo.",
      "Il primo assaggio lo racconti tu.",
      "Passa, guarda, scegli: MONO e piu semplice dal vivo."
    ],
    launchCountdownIdeas: ["-7 il banco prende forma", "-5 cosa troverai", "-3 il packaging", "-1 Santa Rita, ci siamo"],
    geotagStrategy: [`${area}`, "Torino", "Lingotto", "Mirafiori", "Crocetta", "San Paolo"],
    googleMapsReviewStrategy: "Chiedere recensione solo dopo acquisto felice, con messaggio umano e specifico: 'Se MONO ti ha semplificato la cena, raccontalo in due righe'.",
    priorityForAudience: `Per ${audience}: puntare su bisogno quotidiano, non su estetica fine a se stessa.`
  };
}

function generateCampaign(input) {
  const type = input.type || "launch week";
  const readableType = campaignTypeText(type);
  const duration = input.duration || "7 giorni";

  return {
    title: `Campagna - ${readableType}`,
    campaignObjective: objectiveText(input.goal),
    duration,
    keyMessage: campaignMessage(type),
    contentPlan: [
      "1 contenuto identita per chiarire cosa e MONO.",
      "2 contenuti desiderio gastronomico con prodotto reale.",
      "1 backstage con Federico o cucina.",
      "1 contenuto quartiere Santa Rita.",
      "1 contenuto app/fedelta con CTA chiara."
    ],
    dailyPosts: buildCampaignDays(duration, type),
    stories: ["Sondaggio quotidiano", "Box domande", "Conto alla rovescia", "CTA app", "Promemoria finale"],
    reelsTikTokIdeas: ["Hook locale", "Macro cibo", "POV Federico", "Packaging a casa", "Recensione cliente"],
    offlineSupport: ["QR poster", "cartolina packaging", "invito banco", "micro collaborazione locale"],
    cta: input.goal === "app_download" ? "Scarica l'app MONO" : "Passa in bottega a Santa Rita",
    metricsToTrack: ["copertura locale", "visite profilo", "salvataggi", "condivisioni", "commenti locali", "download app", "stima visite in bottega"],
    paidStrategy: "Sponsorizzare solo i contenuti con segnali organici forti dopo 24-48 ore.",
    guardrails: "Niente prezzi inventati, niente urgenza aggressiva, niente promessa non verificata."
  };
}

function campaignTypeText(type) {
  const map = {
    "pre-opening": "pre-apertura",
    "opening countdown": "conto alla rovescia apertura",
    "launch week": "settimana lancio",
    "app download": "download app",
    "fidelity card": "tessera fedelta",
    "first visit": "prima visita",
    "product launch": "lancio prodotto",
    "weekly menu": "menu settimanale",
    aperitivo: "aperitivo",
    catering: "catering",
    "gift card": "buono regalo",
    "MONO Convivium": "MONO Convivium",
    "neighborhood campaign": "campagna di quartiere",
    "review generation": "generazione recensioni",
    "inactive customer reactivation": "riattivazione clienti inattivi"
  };
  return map[type] || type || "campagna";
}

function buildCampaignDays(duration, type) {
  const days = duration.includes("30") ? 10 : duration.includes("14") ? 7 : duration.includes("3") ? 3 : 5;
  return Array.from({ length: days }, (_, index) => `Giorno ${index + 1}: ${campaignTypeText(type)} - ${topicSeeds[index % topicSeeds.length]}`);
}

function campaignMessage(type) {
  if (type.includes("app")) return "L'app non e un extra: e il modo piu semplice per restare vicino a MONO.";
  if (type.includes("opening")) return "Santa Rita ha una nuova bottega da scoprire, senza rumore e senza finzione.";
  if (type.includes("Convivium")) return "Inclusione raccontata attraverso gesti concreti, lavoro e dignita.";
  return "MONO rende quotidiana una cucina curata, locale e riconoscibile.";
}

function generateAdvRecommendation(input) {
  const watchTime = Number.parseFloat(input.watchTime || "0");
  const saveRate = Number.parseFloat(input.saveRate || "0");
  const shareRate = Number.parseFloat(input.shareRate || "0");
  const localComments = Number.parseFloat(input.localComments || "0");
  const score = Math.min(100, Math.round(watchTime * 6 + saveRate * 8 + shareRate * 9 + localComments * 2));
  const sponsor = score >= 72;

  return {
    title: `ADV - ${input.creative || "contenuto MONO"}`,
    verdict: sponsor ? "Sponsorizzabile con budget controllato." : "Non sponsorizzare ora.",
    score,
    whySponsorOrNot: sponsor
      ? "Il contenuto mostra segnali organici abbastanza forti: retention, salvataggi o conversazione locale."
      : "Prima migliora hook, prova visuale o CTA. Sponsorizzare debolezza moltiplica spreco.",
    objective: sponsor ? "Visita in bottega o download app" : "Test creativo organico",
    audience: "Persone 22-58 nel raggio locale, interessi gastronomici, famiglie, lavoratori, residenti.",
    locationRadius: "Santa Rita + Torino, Mirafiori, Crocetta, Lingotto, San Paolo, Pozzo Strada. Centro Torino solo se il creativo ha appeal cittadino.",
    budget: sponsor ? "10-20 euro al giorno per 3 giorni, poi scalare solo se CPA e segnali restano buoni." : "0 euro finche non migliora organicamente.",
    duration: sponsor ? "72 ore di test" : "24-48 ore di nuovo test organico",
    creativeToUse: input.creative || "Il Reel con migliore tempo medio di visione e commenti locali.",
    cta: "Passa in bottega" + (sponsor ? " / Scarica app MONO" : ""),
    landingDestination: "App MONO o pagina contatti con indicazioni chiare.",
    expectedResult: sponsor ? "Aumento visite profilo, stima visite in bottega e download app." : "Apprendimento creativo, non vendite immediate.",
    risk: "Se il contenuto e generico, Meta ottimizza su curiosita debole e non su clienti reali."
  };
}

function generateContentCritic(input) {
  const draft = input.draft || "";
  const hasLocal = /torino|santa rita|mirafiori|lingotto|crocetta|san paolo/i.test(draft);
  const hasCta = /passa|scarica|salva|scrivici|apri|vieni/i.test(draft);
  const hasMonoTone = /semplice|buono|cucina|bottega|quotidiani|casa/i.test(draft);
  const lengthScore = draft.length > 80 && draft.length < 700 ? 8 : 5;

  const scores = {
    brandCoherence: hasMonoTone ? 8 : 5,
    hookStrength: draft.slice(0, 90).includes("?") || draft.length < 140 ? 7 : 5,
    clarity: lengthScore,
    emotionalPower: hasMonoTone ? 7 : 5,
    localRelevance: hasLocal ? 9 : 4,
    viralityPotential: hasLocal && hasCta ? 8 : 5,
    conversionPotential: hasCta ? 8 : 4,
    visualStrength: /video|foto|piatto|packaging|mano|banco/i.test(draft) ? 8 : 5,
    ctaQuality: hasCta ? 8 : 3,
    genericRisk: hasLocal && hasMonoTone ? 3 : 8
  };

  return {
    title: "Valutazione direzione creativa",
    scores,
    verdict: scores.genericRisk > 6 ? "Troppo generico: manca una prova locale o un gesto MONO riconoscibile." : "Buona base: rendere piu rapido l'hook e piu concreta la CTA.",
    brutalNotes: [
      hasLocal ? "Il riferimento locale c'e: tienilo vicino all'apertura." : "Manca Torino o Santa Rita: cosi puo sembrare qualsiasi brand gastronomico.",
      hasCta ? "La CTA esiste, ma deve essere ancora piu secca." : "Non c'e un gesto successivo chiaro: il contenuto rischia di finire nel feed.",
      hasMonoTone ? "Il tono e vicino a MONO." : "Aggiungi una frase piu umana e meno marketing."
    ],
    improvedVersion: improveDraft(draft, input.format),
    visualRewrite: "Apri con prodotto reale entro 1,5 secondi, poi gesto umano, poi chiusura con Santa Rita/app.",
    finalCta: "Salva il post, passa in bottega a Santa Rita o apri l'app MONO."
  };
}

function improveDraft(draft, format) {
  if (!draft.trim()) {
    return "Santa Rita, la cena pronta non deve sembrare una rinuncia. Da MONO trovi cucina contemporanea, fatta con cura, pensata per entrare nella vita di tutti i giorni. Salva questo contenuto e passa in bottega quando vuoi mangiare bene senza complicarti la serata.";
  }

  return `Santa Rita, questa e la versione MONO: ${draft.trim()}\n\nMeno rumore, piu gesto reale. Cucina contemporanea, pronta quando serve, fatta come si deve. ${format?.includes("Reel") ? "Salva il Reel" : "Salva il post"} e passa in bottega.`;
}

function generateFeedAdvisor(input) {
  const slots = Number.parseInt(input.period, 10) || 9;
  const rhythm = ["Cibo desiderio", "Identita MONO", "Dietro le quinte", "Quartiere", "App / fedelta", "Founder", "Packaging", "Community", "Convivium"];
  const profileContext = input.topic || "Profilo non collegato: valutazione qualitativa su feed, contenuti e conversione locale.";

  return {
    title: input.topic ? "Parere AI Instagram" : `Design feed - ${input.period || "9 post"}`,
    summary: profileContext,
    verdict: "Prima priorita: rendere immediatamente chiaro cosa vende MONO, dove si trova e perche vale la visita oggi.",
    nextActions: [
      "Aprire i prossimi 3 contenuti con prodotto reale o promessa locale, non con intro generiche.",
      "Alternare Reel desiderio, carousel educativo e Stories con sondaggio per capire cosa vogliono comprare.",
      "Ogni contenuto deve chiudere con una sola CTA: passa in bottega, salva, o apri l'app.",
      "Misurare salvataggi, risposte Stories e visite profilo prima di sponsorizzare."
    ],
    gridRhythm: Array.from({ length: slots }, (_, index) => `${index + 1}. ${rhythm[index % rhythm.length]}`),
    colorBalance: "40% cashmere/avorio, 20% terracotta, 15% oliva, 15% fotografia cibo, 10% antracite.",
    postCategories: rhythm,
    coverTemplates: ["Macro cibo con titolo breve", "POV Federico con sfondo pulito", "Carousel educativo cashmere", "Hook locale terracotta", "CTA app oliva"],
    typographyRules: "Titoli brevi, zero letter spacing negativo, corpo leggibile, massimo due pesi.",
    reelCoverDesign: "Frame reale del video + titolo di 3-5 parole + logo piccolo solo se serve.",
    carouselDesign: "Una tesi per slide, margini ampi, CTA finale chiara.",
    visualConsistency: "Alternare cibo reale, mani, packaging, banco e quartiere. Non fare una griglia tutta beige.",
    logoUsage: "Usare il logo in chiusura o cover istituzionali; evitarlo quando il prodotto deve parlare.",
    alternationRule: "Mai piu di due post cibo consecutivi senza identita, Federico, comunita o app."
  };
}

function generateAnalyticsReport(input, currentState) {
  const metrics = currentState.metrics;
  const engagement = metrics.reach ? ((metrics.saves + metrics.shares + metrics.comments) / metrics.reach) * 100 : 0;
  const appConversion = metrics.profileVisits ? (metrics.appDownloads / metrics.profileVisits) * 100 : 0;
  const storeSignal = metrics.reach ? (metrics.storeVisitsEstimate / metrics.reach) * 100 : 0;

  return {
    title: "Analisi performance",
    sintesi: `Engagement stimato ${engagement.toFixed(1)}%, conversione app da profilo ${appConversion.toFixed(1)}%, segnale visite ${storeSignal.toFixed(1)}%.`,
    cosaFunziona: [
      metrics.saves > 60 ? "I salvataggi indicano contenuti utili: spingere carousel e guide." : "I salvataggi sono bassi: servono contenuti piu pratici.",
      metrics.shares > 40 ? "Le condivisioni indicano rilevanza locale o desiderio gastronomico." : "Le condivisioni sono migliorabili con hook piu locali.",
      metrics.averageWatchTime > 6 ? "Tempo medio di visione buono: continuare con aperture rapide." : "Tempo medio di visione debole: tagliare intro e mostrare prodotto prima."
    ],
    cosaFareOra: [
      "Creare un Reel con hook Santa Rita e prodotto reale entro 1,5 secondi.",
      "Pubblicare un carousel salvabile su app o rigenerazione piatti.",
      "Chiedere recensioni Google ai clienti soddisfatti, senza automatismi freddi.",
      "Sponsorizzare solo il miglior contenuto organico dopo 24-48 ore."
    ],
    rischio: engagement < 1.8 ? "Il contenuto rischia di essere troppo generico o poco salvabile." : "Il sistema organico ha segnali da consolidare.",
    prossimoEsperimento: "Test A/B su due hook: uno locale diretto, uno di desiderio gastronomico."
  };
}

function generateAgentPlan(input, currentState) {
  const situation = input.situation || "Aumentare visite in bottega e download app con poco tempo di produzione.";
  const bestCalendarItem = currentState.calendar.slice().sort((a, b) => b.priorityScore - a.priorityScore)[0];

  return {
    title: "Decisione operativa MONO",
    summary: `Priorita: trasformare la situazione in una sequenza breve, locale e misurabile. Situazione letta: ${situation}`,
    decisione: "Pubblicare prima un contenuto ad alto desiderio e riferimento Santa Rita, poi una Story con interazione e CTA app.",
    sections: [
      {
        titolo: "Cosa fare oggi",
        punti: [
          `Girare ${bestCalendarItem?.format || "un Reel"} su "${bestCalendarItem?.title || "la cena pronta fatta bene"}".`,
          "Aprire con prodotto reale entro 1,5 secondi.",
          "Chiudere con una sola CTA: passa in bottega oppure apri l'app."
        ]
      },
      {
        titolo: "Perche questa scelta",
        punti: [
          "Un bisogno locale concreto converte meglio di un contenuto solo estetico.",
          "Il Brand Brain chiede tono umano, caldo, premium accessibile.",
          "La priorita e portare persone reali da Torino e Santa Rita verso visita e app."
        ]
      }
    ],
    tasks: [
      "Scrivere hook locale in 8 parole.",
      "Girare 5 clip verticali da 2 secondi.",
      "Montare versione da 18 secondi.",
      "Pubblicare con geotag Santa Rita.",
      "Dopo 24 ore controllare salvataggi, condivisioni e commenti locali."
    ],
    guardrails: [
      "Non inventare prezzi o disponibilita.",
      "Non sponsorizzare finche non ci sono segnali organici.",
      "Non usare tono scontistico o fast food."
    ],
    priorityScore: 88
  };
}

function objectiveText(value) {
  const map = {
    store_visit: "Portare persone in bottega",
    app_download: "Generare download app",
    trust: "Costruire fiducia",
    desire: "Generare desiderio",
    ugc: "Stimolare UGC e conversazioni",
    saves: "Aumentare salvataggi",
    shares: "Aumentare condivisioni",
    poll: "Generare risposte",
    loyalty: "Attivare fedelta",
    orders: "Generare ordini",
    reviews: "Generare recensioni"
  };
  return map[value] || value || "Crescita organica locale";
}

function audienceText(value) {
  const map = {
    lavoratori: "Lavoratori in zona Santa Rita, Lingotto, Crocetta",
    famiglie: "Famiglie che vogliono semplificare pranzo e cena",
    residenti: "Residenti del quartiere",
    studenti: "Studenti e giovani professionisti",
    food_lovers: "Appassionati di cucina torinesi"
  };
  return map[value] || "Clienti locali";
}

function moodText(value) {
  const map = {
    warm: "Caldo, quotidiano, accogliente",
    premium: "Premium accessibile, mai freddo",
    local: "Locale, umano, vicino al quartiere",
    technical: "Pulito, gastronomico, preciso"
  };
  return map[value] || "Caldo e contemporaneo";
}

function motionText(value) {
  const map = {
    slow_push: "Slow push-in verso il piatto, movimento morbido e desiderabile.",
    top_down: "Top-down ordinato, ideale per packaging e istruzioni.",
    handheld: "Handheld stabile e umano, come un gesto in bottega.",
    macro: "Macro detail su texture, salsa, taglio, vapore reale."
  };
  return map[value] || "Movimento lento e controllato.";
}

function renderBrandBrain() {
  return `
    <section class="card stack">
      <div class="output-heading">
        <div>
          <p class="eyebrow">Brand knowledge base</p>
          <h2>Brand Brain MONO</h2>
        </div>
        <button class="button primary" type="button" data-action="save-brand">Salva Brand Brain</button>
      </div>
      <div class="brand-grid">
        ${brandFields.map(([key, label]) => `
          <label class="field">
            <span class="field-label">${escapeHtml(label)}</span>
            <textarea data-brand-field="${escapeHtml(key)}">${escapeHtml(state.brandBrain[key])}</textarea>
          </label>
        `).join("")}
      </div>
    </section>
  `;
}

function renderAnalytics() {
  const analysis = state.outputs.analytics;

  return `
    <div class="grid-2">
      <section class="card stack">
        <div class="output-heading">
          <div>
            <p class="eyebrow">Metriche manuali</p>
            <h2>Analisi social</h2>
          </div>
          <div class="button-row">
            <button class="button primary" type="button" data-action="save-metrics">Salva metriche</button>
            <button class="button ghost" type="button" data-action="analyze-metrics">Analizza</button>
          </div>
        </div>
        <div class="metrics-grid">
          ${Object.entries(state.metrics).map(([key, value]) => `
            <label class="analytics-input field">
              <span class="field-label">${escapeHtml(labelize(key))}</span>
              <input class="metric-input" name="${escapeHtml(key)}" value="${escapeHtml(value)}" inputmode="decimal">
            </label>
          `).join("")}
        </div>
      </section>
      ${renderOutputPanel("analytics", analysis, "Inserisci metriche e genera la prossima decisione editoriale.")}
    </div>
  `;
}

function renderTasks() {
  return `
    <section class="card stack">
      <div class="output-heading">
        <div>
          <p class="eyebrow">Gestione task</p>
          <h2>Pipeline contenuti</h2>
        </div>
        <div class="button-row">
          <button class="button ghost" type="button" data-action="export-tasks-csv">CSV task</button>
          <button class="button ghost" type="button" data-action="export-tasks-json">JSON task</button>
        </div>
      </div>
      <div class="task-list">
        ${state.tasks.map(renderTaskRow).join("")}
      </div>
    </section>
  `;
}

function renderTaskRow(task) {
  return `
    <article class="task-row">
      <div class="tight-stack">
        <header>
          <div>
            <div class="pill-row">
              <span class="pill">${escapeHtml(task.format)}</span>
              <span class="pill warn">Priorita ${escapeHtml(task.priority)}</span>
              <span class="pill">${escapeHtml(task.difficulty)}</span>
            </div>
            <h3>${escapeHtml(task.title)}</h3>
          </div>
        </header>
        <p>${escapeHtml(task.script)}</p>
        <p><strong>Caption:</strong> ${escapeHtml(task.caption)}</p>
        <p><strong>Asset:</strong> ${escapeHtml(toLines(task.requiredAssets))}</p>
        <span class="meta">Responsabile ${escapeHtml(task.owner)} - Scadenza ${escapeHtml(task.deadline)} - Impatto ${escapeHtml(task.expectedImpact)}</span>
      </div>
      <label class="field">
        <span class="field-label">Stato</span>
        <select data-task-status="${task.id}">
          ${taskStatuses.map((status) => `<option value="${status}" ${status === task.status ? "selected" : ""}>${taskStatusLabels[status] || status}</option>`).join("")}
        </select>
      </label>
    </article>
  `;
}

function renderExports() {
  return `
    <section class="stack">
      <p class="eyebrow">Centro export</p>
      <h2>Porta fuori tutto cio che serve</h2>
      <div class="grid-3">
        ${renderExportCard("Calendario", "weekly calendar, monthly calendar", "export-calendar-md", "export-calendar-csv", "export-calendar-json")}
        ${renderExportCard("Caption e script", "caption, hashtag, reel, TikTok, stories", "export-outputs-md", "copy-all-outputs", "export-outputs-json")}
        ${renderExportCard("Task e checklist", "checklist riprese, task, priorita", "export-tasks-md", "export-tasks-csv", "export-tasks-json")}
      </div>
      <div class="output-panel">
        <pre class="preformatted">${escapeHtml(buildFullMarkdownExport())}</pre>
      </div>
    </section>
  `;
}

function renderExportCard(title, text, first, second, third) {
  return `
    <article class="card tight-stack">
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(text)}</p>
      <button class="button dark" type="button" data-action="${first}">Markdown</button>
      <button class="button ghost" type="button" data-action="${second}">${second.includes("copy") ? "Copia" : "CSV"}</button>
      <button class="button ghost" type="button" data-action="${third}">JSON</button>
    </article>
  `;
}

function renderSettings() {
  const serverNotice = window.location.protocol === "file:"
    ? `<div class="notice-card warning"><strong>Server non attivo.</strong><span>Le chiavi non si salvano aprendo <code>index.html</code>. Usa <code>AVVIA_MONO_SOCIAL_STUDIO.cmd</code> e poi apri <code>http://127.0.0.1:4177/</code>.</span></div>`
    : "";

  return `
    <section class="stack">
      <p class="eyebrow">Impostazioni</p>
      <h2>Motori AI e sicurezza dati</h2>
      ${serverNotice}
      <div class="grid-2">
        <article class="form-panel stack">
          <h3>Modalita agente</h3>
          <label class="field">
            <span class="field-label">Modalita</span>
            <select data-setting-field="providerMode">
              <option value="server" ${state.settings.providerMode === "server" ? "selected" : ""}>Agente AI server-side</option>
              <option value="mock" ${state.settings.providerMode === "mock" ? "selected" : ""}>Simulazione locale</option>
            </select>
          </label>
          <label class="field">
            <span class="field-label">Testi e decisioni</span>
            <select data-setting-field="textProvider">
              <option value="auto" ${state.settings.textProvider === "auto" ? "selected" : ""}>Auto: usa il provider disponibile</option>
              <option value="openai" ${state.settings.textProvider === "openai" ? "selected" : ""}>Solo OpenAI</option>
              <option value="gemini" ${state.settings.textProvider === "gemini" ? "selected" : ""}>Solo Gemini</option>
              <option value="both" ${state.settings.textProvider === "both" ? "selected" : ""}>Entrambi: confronto OpenAI + Gemini</option>
            </select>
          </label>
          <label class="field">
            <span class="field-label">Immagini</span>
            <select data-setting-field="imageProvider">
              <option value="gemini" ${state.settings.imageProvider === "gemini" ? "selected" : ""}>Gemini consigliato: genera immagini reali</option>
              <option value="auto" ${state.settings.imageProvider === "auto" ? "selected" : ""}>Auto</option>
              <option value="both" ${state.settings.imageProvider === "both" ? "selected" : ""}>Entrambi: Gemini immagine + OpenAI controllo</option>
              <option value="openai" ${state.settings.imageProvider === "openai" ? "selected" : ""}>OpenAI: prompt/brief immagine</option>
            </select>
          </label>
          <label class="field">
            <span class="field-label">Salvataggio dati</span>
            <select data-setting-field="privateMode">
              <option value="false" ${!state.settings.privateMode ? "selected" : ""}>Salva nel browser</option>
              <option value="true" ${state.settings.privateMode ? "selected" : ""}>Sessione privata</option>
            </select>
          </label>
          <p>Le chiavi API non entrano mai nel browser. In sessione privata Brand Brain, output e task non vengono salvati in localStorage.</p>
          <button class="button primary" type="button" data-action="save-settings">Salva impostazioni</button>
        </article>
        <article class="form-panel stack">
          <h3>Sicurezza dati</h3>
          <ul class="list">
            <li>AI reale solo via server locale: chiavi in <code>.env.local</code>.</li>
            <li>Il server non salva prompt, output o Brand Brain.</li>
            <li>Le richieste OpenAI usano <code>store: false</code>.</li>
            <li>Le immagini generate non vengono persistite in localStorage come base64.</li>
            <li>Per dati condivisi in produzione usare Supabase con RLS.</li>
          </ul>
          <button class="button ghost" type="button" data-action="clear-local-data">Cancella dati locali</button>
        </article>
        <article class="form-panel stack">
          <h3>Attiva Gemini</h3>
          <label class="field">
            <span class="field-label">GEMINI_API_KEY</span>
            <input data-secret-field="gemini-key" type="password" autocomplete="off" placeholder="AIza...">
          </label>
          <label class="field">
            <span class="field-label">Modello testo</span>
            <input data-secret-field="gemini-text-model" type="text" value="gemini-3.5-flash">
          </label>
          <label class="field">
            <span class="field-label">Modello immagini</span>
            <input data-secret-field="gemini-image-model" type="text" value="gemini-3.1-flash-image">
          </label>
          <p>Consigliato per la creazione immagini. La chiave resta solo nel file locale <code>.env.local</code>.</p>
          <button class="button dark" type="button" data-action="setup-provider-key" data-provider="gemini">Salva Gemini</button>
        </article>
        <article class="form-panel stack">
          <h3>Attiva OpenAI</h3>
          <label class="field">
            <span class="field-label">OPENAI_API_KEY</span>
            <input data-secret-field="openai-key" type="password" autocomplete="off" placeholder="sk-...">
          </label>
          <label class="field">
            <span class="field-label">Modello</span>
            <input data-secret-field="openai-model" type="text" value="gpt-5.5">
          </label>
          <p>Consigliato per decisioni, copy, critica contenuti e confronto con Gemini.</p>
          <button class="button dark" type="button" data-action="setup-provider-key" data-provider="openai">Salva OpenAI</button>
        </article>
        <article class="form-panel stack">
          <h3>Variabili ambiente</h3>
          <ul class="list">
            ${Object.entries(state.settings)
              .filter(([key]) => key.endsWith("Env"))
              .map(([, value]) => `<li><code>${escapeHtml(value)}</code></li>`)
              .join("")}
          </ul>
          <button class="button ghost" type="button" data-action="reset-demo">Ripristina demo</button>
        </article>
      </div>
    </section>
  `;
}

async function handleClick(event) {
  const viewButton = event.target.closest("[data-view]");
  if (viewButton) {
    setActiveView(viewButton.dataset.view);
    return;
  }

  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) return;

  const action = actionButton.dataset.action;
  const kind = actionButton.dataset.kind;

  if (action === "generate-smart-output") {
    const smartRequest = getSmartCreateInput();
    actionButton.disabled = true;
    showToast(canUseServerAi() ? "Creo con AI reale..." : "Creo in demo locale...");
    const output = await aiProvider.generate(smartRequest.kind, smartRequest.input, state);
    rememberOutput("smartCreate", output);
    rememberOutput(smartRequest.kind, output);
    render();
    showToast("Creato. Puoi copiarlo o trasformarlo in task.");
    return;
  }

  if (action === "analyze-instagram-profile") {
    const input = getInstagramAdvisorInput();
    actionButton.disabled = true;
    showToast(canUseServerAi() ? "Analizzo profilo con AI..." : "Analizzo in demo locale...");
    const output = await aiProvider.generate("feed", input, state);
    rememberOutput("instagramAdvisor", output);
    render();
    showToast("Parere AI generato.");
    return;
  }

  if (action === "connect-instagram") {
    showToast("Connessione diretta: serve Meta Login + permessi Instagram. Intanto usa il parere AI manuale.");
    return;
  }

  if (action === "generate-output") {
    const input = getToolInput(kind);
    actionButton.disabled = true;
    showToast(canUseServerAi() ? "Agente AI al lavoro..." : "Genero in demo locale...");
    const output = await aiProvider.generate(kind, input, state);
    rememberOutput(kind, output);
    render();
    showToast("Output generato.");
    return;
  }

  if (action === "calendar-week" || action === "calendar-month") {
    state.calendar = buildCalendarItems(action === "calendar-week" ? 7 : 30);
    syncTasksFromCalendar();
    persist();
    setActiveView("calendar");
    showToast(action === "calendar-week" ? "Calendario settimanale generato." : "Calendario mensile generato.");
    return;
  }

  if (action === "generate-today") {
    actionButton.disabled = true;
    showToast(canUseServerAi() ? "Agente AI al lavoro..." : "Genero in demo locale...");
    const output = await aiProvider.generate("reel", { topic: topicSeeds[0], pillar: "quartiere", audience: "residenti", objective: "store_visit" }, state);
    rememberOutput("reel", output);
    setActiveView("reel");
    showToast("Piano di oggi generato.");
    return;
  }

  if (action === "save-brand") {
    document.querySelectorAll("[data-brand-field]").forEach((field) => {
      state.brandBrain[field.dataset.brandField] = field.value.trim();
    });
    persist();
    render();
    showToast("Brand Brain salvato.");
    return;
  }

  if (action === "save-metrics") {
    document.querySelectorAll(".metric-input").forEach((input) => {
      state.metrics[input.name] = Number.parseFloat(input.value) || 0;
    });
    persist();
    showToast("Metriche salvate.");
    return;
  }

  if (action === "analyze-metrics") {
    document.querySelectorAll(".metric-input").forEach((input) => {
      state.metrics[input.name] = Number.parseFloat(input.value) || 0;
    });
    actionButton.disabled = true;
    showToast(canUseServerAi() ? "Agente AI al lavoro..." : "Analizzo in demo locale...");
    const output = await aiProvider.generate("analytics", {}, state);
    rememberOutput("analytics", output);
    render();
    showToast("Analisi generata.");
    return;
  }

  if (action === "save-settings") {
    document.querySelectorAll("[data-setting-field]").forEach((field) => {
      state.settings[field.dataset.settingField] = field.dataset.settingField === "privateMode"
        ? field.value === "true"
        : field.value;
    });
    persist();
    checkAiHealth();
    showToast("Impostazioni salvate.");
    return;
  }

  if (action === "clear-local-data") {
    if (window.confirm("Cancellare dati locali, output, task e Brand Brain salvati nel browser?")) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(ACTIVE_VIEW_KEY);
      state = createDefaultState();
      activeView = "dashboard";
      render();
      showToast("Dati locali cancellati.");
    }
    return;
  }

  if (action === "setup-provider-key") {
    const provider = actionButton.dataset.provider || "openai";
    const apiKey = normalizeSecretValue(document.querySelector(`[data-secret-field="${provider}-key"]`)?.value);
    const model = provider === "gemini"
      ? document.querySelector('[data-secret-field="gemini-text-model"]')?.value.trim() || "gemini-3.5-flash"
      : document.querySelector('[data-secret-field="openai-model"]')?.value.trim() || "gpt-5.5";
    const imageModel = document.querySelector('[data-secret-field="gemini-image-model"]')?.value.trim() || "gemini-3.1-flash-image";

    if (!apiKey) {
      showToast(`Inserisci una chiave ${providerLabel(provider)}.`);
      return;
    }

    if (provider === "openai" && !apiKey.startsWith("sk-")) {
      showToast("La chiave OpenAI deve iniziare con sk-.");
      return;
    }

    actionButton.disabled = true;
    showToast(`Configuro ${providerLabel(provider)} sul server locale...`);

    try {
      const response = await fetch("/api/setup-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ provider, apiKey, model, imageModel })
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        showToast(result.error || "Configurazione non riuscita.");
        actionButton.disabled = false;
        return;
      }

      document.querySelector(`[data-secret-field="${provider}-key"]`).value = "";
      aiStatus = {
        checked: true,
        available: true,
        configured: true,
        model: result.model || model,
        label: `AI reale: ${providerLabel(provider)}`
      };
      actionButton.disabled = false;
      renderSignals();
      checkAiHealth();
      showToast(`${providerLabel(provider)} attivato.`);
    } catch {
      showToast("Server non acceso: apri AVVIA_MONO_SOCIAL_STUDIO.cmd.");
      actionButton.disabled = false;
    }
    return;
  }

  if (action === "reset-demo") {
    if (window.confirm("Ripristinare dati demo di MONO Social Studio?")) {
      state = createDefaultState();
      persist();
      render();
      showToast("Demo ripristinata.");
    }
    return;
  }

  if (action === "copy-output") {
    copyText(toMarkdown(state.outputs[kind] || {}));
    return;
  }

  if (action === "copy-all-outputs") {
    copyText(buildOutputsMarkdown());
    return;
  }

  if (action === "task-from-output") {
    const output = state.outputs[kind];
    if (!output) return;
    state.tasks.unshift(taskFromOutput(kind, output));
    persist();
    showToast("Task creato.");
    render();
    return;
  }

  if (action === "task-from-calendar") {
    const item = state.calendar.find((calendarItem) => calendarItem.id === actionButton.dataset.id);
    if (!item) return;
    state.tasks.unshift(taskFromCalendarItem(item));
    persist();
    showToast("Task creato dal calendario.");
    return;
  }

  if (action === "open-calendar-item") {
    setActiveView("calendar");
    return;
  }

  handleExportAction(action);
}

function handleChange(event) {
  const statusSelect = event.target.closest("[data-task-status]");
  if (statusSelect) {
    const task = state.tasks.find((item) => item.id === statusSelect.dataset.taskStatus);
    if (task) {
      task.status = statusSelect.value;
      persist();
      renderSignals();
      showToast("Stato task aggiornato.");
    }
  }
}

function taskFromOutput(kind, output) {
  return {
    id: uid("task"),
    sourceId: output.id,
    title: output.title || output.titolo || labelize(kind),
    owner: "Federico",
    deadline: formatDateIso(addDays(new Date(), 2)),
    requiredAssets: output.propsNeeded || output.requiredAssets || ["telefono", "prodotto reale", "luce calda"],
    script: output.concept || output.voiceover || output.fullPrompt || output.verdict || "Output generato da MONO Social Studio.",
    caption: output.caption || output.improvedVersion || output.cta || "Da rifinire prima della pubblicazione.",
    format: kind === "reel" ? "Instagram Reel / TikTok" : labelize(kind),
    priority: output.priorityScore || output.score || 82,
    difficulty: output.difficulty || "Media",
    expectedImpact: output.objective || output.campaignObjective || "Crescita organica",
    status: "idea"
  };
}

function handleExportAction(action) {
  const exportMap = {
    "export-calendar-md": () => downloadFile("mono-calendario.md", buildCalendarMarkdown(), "text/markdown"),
    "export-calendar-csv": () => downloadFile("mono-calendario.csv", buildCalendarCsv(), "text/csv"),
    "export-calendar-json": () => downloadFile("mono-calendario.json", JSON.stringify(state.calendar, null, 2), "application/json"),
    "export-tasks-md": () => downloadFile("mono-task.md", buildTasksMarkdown(), "text/markdown"),
    "export-tasks-csv": () => downloadFile("mono-task.csv", buildTasksCsv(), "text/csv"),
    "export-tasks-json": () => downloadFile("mono-task.json", JSON.stringify(state.tasks, null, 2), "application/json"),
    "export-outputs-md": () => downloadFile("mono-output.md", buildOutputsMarkdown(), "text/markdown"),
    "export-outputs-json": () => downloadFile("mono-output.json", JSON.stringify(stripTransientMedia(state.outputs), null, 2), "application/json")
  };

  const exporter = exportMap[action];
  if (exporter) {
    exporter();
    showToast("Export creato.");
  }
}

function csvEscape(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function buildCalendarCsv() {
  const headers = ["date", "platform", "format", "pillar", "title", "hook", "concept", "caption", "cta", "visualDirection", "shootingInstructions", "requiredAssets", "expectedObjective", "difficultyLevel", "organicPotential", "sponsorRecommendation", "priorityScore"];
  return [headers.join(","), ...state.calendar.map((item) => headers.map((header) => csvEscape(Array.isArray(item[header]) ? item[header].join("; ") : item[header])).join(","))].join("\n");
}

function buildTasksCsv() {
  const headers = ["title", "owner", "deadline", "status", "format", "priority", "difficulty", "expectedImpact", "requiredAssets", "caption"];
  return [headers.join(","), ...state.tasks.map((task) => headers.map((header) => csvEscape(Array.isArray(task[header]) ? task[header].join("; ") : task[header])).join(","))].join("\n");
}

function buildCalendarMarkdown() {
  return `# Calendario editoriale MONO\n\n${state.calendar.map((item) => `## ${item.date} - ${item.title}\n\n- Piattaforma: ${item.platform}\n- Formato: ${item.format}\n- Pilastro: ${item.pillar}\n- Hook: ${item.hook}\n- Concept: ${item.concept}\n- Caption: ${item.caption}\n- CTA: ${item.cta}\n- Visual: ${item.visualDirection}\n- Shooting: ${item.shootingInstructions}\n- Asset: ${item.requiredAssets.join(", ")}\n- ADV: ${item.sponsorRecommendation}\n- Priorita: ${item.priorityScore}/100`).join("\n\n")}`;
}

function buildTasksMarkdown() {
  return `# Task MONO Social Studio\n\n${state.tasks.map((task) => `## ${task.title}\n\n- Stato: ${taskStatusLabels[task.status] || task.status}\n- Responsabile: ${task.owner}\n- Scadenza: ${task.deadline}\n- Formato: ${task.format}\n- Priorita: ${task.priority}\n- Difficolta: ${task.difficulty}\n- Impatto: ${task.expectedImpact}\n- Asset: ${toLines(task.requiredAssets)}\n- Script: ${task.script}\n- Caption: ${task.caption}`).join("\n\n")}`;
}

function buildOutputsMarkdown() {
  const entries = Object.entries(state.outputs);
  if (!entries.length) return "# Output MONO\n\nNessun output generato.";
  return `# Output MONO Social Studio\n\n${entries.map(([kind, output]) => `## ${labelize(kind)}\n\n${toMarkdown(output)}`).join("\n\n")}`;
}

function buildFullMarkdownExport() {
  return `${buildCalendarMarkdown()}\n\n---\n\n${buildTasksMarkdown()}\n\n---\n\n${buildOutputsMarkdown()}`;
}

function toMarkdown(value, depth = 0) {
  if (isGeneratedImage(value)) {
    return `${"  ".repeat(depth)}- Immagine generata con ${providerLabel(value.provider)} (${value.mimeType || "image"})\n${"  ".repeat(depth)}- Nota: scaricala dal pulsante nell'app; il base64 non viene copiato negli export.`;
  }

  if (Array.isArray(value)) {
    return value.map((item) => `${"  ".repeat(depth)}- ${typeof item === "object" ? toMarkdown(item, depth + 1).trim() : item}`).join("\n");
  }

  if (value && typeof value === "object") {
    return Object.entries(value)
      .filter(([key]) => !["id", "createdAt"].includes(key))
      .map(([key, child]) => {
        if (typeof child === "object") {
          return `${"  ".repeat(depth)}- ${labelize(key)}:\n${toMarkdown(child, depth + 1)}`;
        }
        return `${"  ".repeat(depth)}- ${labelize(key)}: ${child}`;
      })
      .join("\n");
  }

  return String(value ?? "");
}

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
  showToast("Copiato negli appunti.");
}

document.addEventListener("click", handleClick);
document.addEventListener("change", handleChange);

render();
checkAiHealth();
