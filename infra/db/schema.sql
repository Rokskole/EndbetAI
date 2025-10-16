-- QuitBet AI Database Schema
-- PostgreSQL with time-series friendly columns, soft deletes where useful, and explicit foreign keys
-- All timestamps are UTC (timestamptz)

-- Core: Users & Auth
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  display_name text,
  country_code text, -- for localized helplines
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);

-- Safety & Contacts
create table if not exists trusted_contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  name text not null,
  channel text not null, -- 'sms' | 'email' | 'phone'
  value text not null,   -- address/number
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists helplines (
  id uuid primary key default gen_random_uuid(),
  country_code text not null,
  name text not null,
  phone text,
  sms text,
  web text,
  priority int not null default 10
);

-- Journals, Triggers, Mood
create table if not exists journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  title text,
  content text,
  mood int, -- -5..+5
  urge_level int, -- 0..10
  created_at timestamptz not null default now()
);

create table if not exists triggers_catalog (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade, -- null => global/default
  label text not null
);

create table if not exists journal_entry_triggers (
  journal_entry_id uuid not null references journal_entries(id) on delete cascade,
  trigger_id uuid not null references triggers_catalog(id) on delete cascade,
  primary key (journal_entry_id, trigger_id)
);

-- Finance
create table if not exists finance_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  kind text not null, -- 'spend' | 'save'
  amount_cents bigint not null check (amount_cents >= 0),
  currency text not null default 'USD',
  note text,
  occurred_at timestamptz not null,
  created_at timestamptz not null default now()
);

-- Tasks & Routine
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  title text not null,
  kind text not null, -- 'breathing' | 'reframe' | 'alt_hobby' | ...
  payload jsonb,      -- dynamic fields per task type
  created_at timestamptz not null default now(),
  archived boolean not null default false
);

create table if not exists task_completions (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  completed_at timestamptz not null default now(),
  rating int, -- optional self-rating of helpfulness 1..5
  notes text
);

-- Chat & AI
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  role text not null, -- 'user' | 'assistant' | 'system'
  content text not null,
  meta jsonb,
  created_at timestamptz not null default now()
);

create table if not exists risk_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  kind text not null, -- 'urge' | 'relapse' | 'crisis'
  score numeric not null check (score >= 0 and score <= 1),
  computed_at timestamptz not null default now(),
  features jsonb
);

create table if not exists relapse_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  described_at timestamptz not null,
  amount_cents bigint,
  note text,
  created_at timestamptz not null default now()
);

-- SOS & Safety flows
create table if not exists sos_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  source text not null, -- 'manual' | 'detector'
  level text not null,  -- 'urge' | 'crisis'
  triggered_at timestamptz not null default now(),
  resolution text,      -- e.g. 'grounding', 'helpline_shown', 'contacted_trusted_person'
  meta jsonb
);

-- Content for RAG
create table if not exists content_items (
  id uuid primary key default gen_random_uuid(),
  kind text not null, -- 'article' | 'audio' | 'guide'
  title text not null,
  body text,          -- plain/markdown
  locale text default 'en',
  tags text[],
  created_at timestamptz not null default now()
);

-- Preferences & Settings
create table if not exists user_settings (
  user_id uuid primary key references users(id) on delete cascade,
  timezone text default 'UTC',
  consent_store_chat boolean not null default false,
  daily_reminder_hour int, -- 0..23
  crisis_detection boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Self-exclusion / Cool-down windows
create table if not exists self_exclusions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  reason text,
  created_at timestamptz not null default now()
);

-- Useful indexes
create index if not exists idx_messages_user_created on messages(user_id, created_at desc);
create index if not exists idx_journal_user_created on journal_entries(user_id, created_at desc);
create index if not exists idx_finance_user_occurred on finance_transactions(user_id, occurred_at desc);
create index if not exists idx_risk_user_time on risk_scores(user_id, computed_at desc);
create index if not exists idx_tasks_user_archived on tasks(user_id, archived);
create index if not exists idx_sos_user_triggered on sos_events(user_id, triggered_at desc);
