create table if not exists brand_profiles (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid,
  positioning text not null,
  tone_of_voice text not null,
  palette text not null,
  content_pillars text not null,
  product_categories text not null,
  social_goals text not null,
  forbidden_language text not null,
  visual_rules text not null,
  local_area text not null,
  target_audience text not null,
  offers text not null,
  key_phrases text not null,
  launch_phase text not null,
  convivium text not null,
  packaging_narrative text not null,
  app_loyalty text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists content_pillars (
  id text primary key,
  code text not null,
  title text not null,
  summary text not null,
  sort_order int not null default 0
);

create table if not exists editorial_calendar_items (
  id uuid primary key default gen_random_uuid(),
  brand_profile_id uuid references brand_profiles(id) on delete cascade,
  publish_date date not null,
  platform text not null,
  format text not null,
  pillar text not null,
  title text not null,
  hook text not null,
  concept text not null,
  caption text not null,
  cta text not null,
  visual_direction text not null,
  shooting_instructions text not null,
  required_assets text[] not null default '{}',
  expected_objective text not null,
  difficulty_level text not null,
  organic_potential text not null,
  sponsor_recommendation text not null,
  priority_score int not null check (priority_score between 0 and 100),
  created_at timestamptz not null default now()
);

create table if not exists ai_generations (
  id uuid primary key default gen_random_uuid(),
  brand_profile_id uuid references brand_profiles(id) on delete cascade,
  kind text not null,
  title text not null,
  input jsonb not null default '{}',
  output jsonb not null default '{}',
  provider text not null default 'mock',
  created_at timestamptz not null default now()
);

create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  brand_profile_id uuid references brand_profiles(id) on delete cascade,
  title text not null,
  campaign_objective text not null,
  duration text not null,
  key_message text not null,
  content_plan jsonb not null default '[]',
  metrics_to_track text[] not null default '{}',
  paid_strategy text not null,
  created_at timestamptz not null default now()
);

create table if not exists social_metrics (
  id uuid primary key default gen_random_uuid(),
  brand_profile_id uuid references brand_profiles(id) on delete cascade,
  metric_date date not null default current_date,
  followers int not null default 0,
  reach int not null default 0,
  impressions int not null default 0,
  profile_visits int not null default 0,
  website_clicks int not null default 0,
  app_downloads int not null default 0,
  saves int not null default 0,
  shares int not null default 0,
  comments int not null default 0,
  reel_views int not null default 0,
  average_watch_time numeric not null default 0,
  orders_generated int not null default 0,
  coupon_redemptions int not null default 0,
  store_visits_estimate int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  brand_profile_id uuid references brand_profiles(id) on delete cascade,
  source_id text,
  title text not null,
  owner text not null,
  deadline date,
  required_assets text[] not null default '{}',
  script text not null,
  caption text not null,
  format text not null,
  priority int not null default 0,
  difficulty text not null,
  expected_impact text not null,
  status text not null check (status in ('idea', 'approved', 'to shoot', 'to edit', 'ready', 'scheduled', 'published', 'analyzed', 'recycled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists assets (
  id uuid primary key default gen_random_uuid(),
  brand_profile_id uuid references brand_profiles(id) on delete cascade,
  type text not null,
  title text not null,
  url text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists export_records (
  id uuid primary key default gen_random_uuid(),
  brand_profile_id uuid references brand_profiles(id) on delete cascade,
  type text not null,
  title text not null,
  payload_summary text not null,
  created_at timestamptz not null default now()
);
