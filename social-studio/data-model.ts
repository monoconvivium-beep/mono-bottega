export type ContentStatus =
  | "idea"
  | "approved"
  | "to shoot"
  | "to edit"
  | "ready"
  | "scheduled"
  | "published"
  | "analyzed"
  | "recycled";

export interface BrandProfile {
  positioning: string;
  toneOfVoice: string;
  palette: string;
  contentPillars: string;
  productCategories: string;
  socialGoals: string;
  forbiddenLanguage: string;
  visualRules: string;
  localArea: string;
  targetAudience: string;
  offers: string;
  keyPhrases: string;
  launchPhase: string;
  convivium: string;
  packagingNarrative: string;
  appLoyalty: string;
}

export interface ContentPillar {
  id: string;
  code: string;
  title: string;
  summary: string;
}

export interface ContentIdea {
  id: string;
  title: string;
  format: string;
  pillar: string;
  hook: string;
  concept: string;
  caption: string;
  cta: string;
  visualDirection: string;
  hashtags: string[];
  guardrail: string;
  priorityScore: number;
}

export interface EditorialCalendarItem {
  id: string;
  date: string;
  platform: string;
  format: string;
  pillar: string;
  title: string;
  hook: string;
  concept: string;
  caption: string;
  cta: string;
  visualDirection: string;
  shootingInstructions: string;
  requiredAssets: string[];
  expectedObjective: string;
  difficultyLevel: string;
  organicPotential: string;
  sponsorRecommendation: string;
  priorityScore: number;
}

export interface ReelScript {
  id: string;
  title: string;
  objective: string;
  targetAudience: string;
  hookFirstSecond: string;
  visualOpening: string;
  shotList: string[];
  sceneByScene: Array<Record<string, string | number>>;
  voiceover: string;
  onScreenText: string[];
  caption: string;
  hashtags: string[];
  geotags: string[];
  cta: string;
  soundMusicDirection: string;
  editingRhythm: string;
  duration: string;
  filmingInstructions: string;
  propsNeeded: string[];
  foodStylingNotes: string;
  viralityAngle: string;
  localRelevance: string;
  whyItCouldWork: string;
  risks: string;
  difficulty: string;
  priorityScore: number;
}

export interface Carousel {
  id: string;
  title: string;
  objective: string;
  numberOfSlides: number;
  slides: Array<Record<string, string | number>>;
  ctaSlide: string;
  designNotes: string;
  backgroundColorSuggestion: string;
  typographyMood: string;
  caption: string;
  hashtags: string[];
  whyThisCarouselMatters: string;
}

export interface StorySequence {
  id: string;
  title: string;
  objective: string;
  numberOfStories: number;
  sequence: Array<Record<string, string | number>>;
  localRelevance: string;
  finalReminder: string;
}

export interface Campaign {
  id: string;
  title: string;
  campaignObjective: string;
  duration: string;
  keyMessage: string;
  contentPlan: string[];
  dailyPosts: string[];
  stories: string[];
  reelsTikTokIdeas: string[];
  offlineSupport: string[];
  cta: string;
  metricsToTrack: string[];
  paidStrategy: string;
  guardrails: string;
}

export interface AdvRecommendation {
  id: string;
  title: string;
  verdict: string;
  score: number;
  whySponsorOrNot: string;
  objective: string;
  audience: string;
  locationRadius: string;
  budget: string;
  duration: string;
  creativeToUse: string;
  cta: string;
  landingDestination: string;
  expectedResult: string;
  risk: string;
}

export interface SocialMetric {
  followers: number;
  reach: number;
  impressions: number;
  profileVisits: number;
  websiteClicks: number;
  appDownloads: number;
  saves: number;
  shares: number;
  comments: number;
  reelViews: number;
  averageWatchTime: number;
  ordersGenerated: number;
  couponRedemptions: number;
  storeVisitsEstimate: number;
}

export interface Task {
  id: string;
  sourceId?: string;
  owner: string;
  deadline: string;
  requiredAssets: string[];
  script: string;
  caption: string;
  format: string;
  priority: number;
  difficulty: string;
  expectedImpact: string;
  status: ContentStatus;
}

export interface Asset {
  id: string;
  type: "image" | "video" | "audio" | "document" | "prompt" | "other";
  title: string;
  url?: string;
  notes?: string;
}

export interface ExportRecord {
  id: string;
  type: "markdown" | "csv" | "json" | "clipboard";
  title: string;
  createdAt: string;
  payloadSummary: string;
}

export interface LocalAudience {
  id: string;
  area: string;
  segment: string;
  habits: string[];
  conversionMoments: string[];
}

export interface HashtagSet {
  id: string;
  title: string;
  hashtags: string[];
  geotags: string[];
}

export interface Caption {
  id: string;
  text: string;
  cta: string;
  format: string;
}

export interface Hook {
  id: string;
  text: string;
  platform: "Instagram" | "TikTok" | "Instagram + TikTok";
  goal: string;
}

export interface AiGeneration {
  id: string;
  kind: string;
  title: string;
  createdAt: string;
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
}

export interface UserSettings {
  providerMode: "mock" | "server";
  futureOpenAiEnv: string;
  futureClaudeEnv: string;
  futureGeminiEnv: string;
  futureSupabaseUrlEnv: string;
  futureSupabaseKeyEnv: string;
}
