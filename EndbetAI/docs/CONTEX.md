## QuitBet AI — Context & MVP Scope

### 1. Overview

- **Name (placeholder)**: QuitBet AI  
- **Purpose**: An AI-powered support app that helps people reduce or stop gambling through personalized guidance, crisis support, and practical tools for long-term change.  
- **Key principle**: Compassionate, evidence-based harm reduction — small, achievable steps, no judgment.

### 2. Core Goals

- **Regain control**: Help users manage gambling urges with behavioral tools and education.  
- **Always available**: On-demand AI support, 24/7, with minimal friction.  
- **Encourage progress**: Nudge gradual improvements and celebrate milestones.  
- **Protect in crisis**: Provide immediate safety nets when risk is detected.

### 3. AI Features

- **Conversational Coach**  
  - Empathic chatbot using CBT and motivational interviewing.  
  - Delivers short daily exercises, urge-surfing techniques, and tailored advice.

- **Urgency / Crisis Detector**  
  - Lightweight model monitors messages for gambling urges or self-harm risk.  
  - Triggers an SOS panel with grounding tools, helplines, and/or a trusted-contact option.

- **Relapse Risk Scoring**  
  - Analyzes activity, journals, and triggers to estimate relapse probability.  
  - Adjusts plans and nudges based on dynamic risk.

- **Personalized Recovery Plan**  
  - AI generates daily micro-tasks, progress summaries, and motivational messages.

- **RAG (Retrieval-Augmented Generation)**  
  - Retrieves content from an educational library, user notes, and best-practice guides.

- **Automatic Summaries**  
  - Condenses journals and finance data into clear, actionable insights.

### 4. User Experience Flow

- **Welcome**  
  - Warm greeting; clear “If you’re in crisis…” banner.  
  - CTA: Sign in with email.

- **Email Login (Magic Link)**  
  - One-tap access, no password.

- **Onboarding**  
  - Short questionnaire: frequency, triggers, goals, emergency contact.  
  - Disclaimer: AI is not a substitute for professional therapy.

- **Dashboard**  
  - Shows daily goal, progress, SOS button, and quick access to tools.

- **Daily Routine**  
  - AI suggests 5–10 minute activities: breathing, thought reframing, alternative hobbies.

- **Relapse Support**  
  - If the user reports (or AI detects) a slip, offer a step-by-step “get back on track” flow immediately.

### 5. Key Tools

- **SOS / Urge Button**: One-tap grounding exercises, contact a trusted person, local helplines.  
- **Trigger & Mood Journal**: Quick entries; AI analyzes patterns over time.  
- **Finance Tracker**: Manual inputs for spending/savings with simple charts.  
- **Education Library**: Short articles, audio tips, and “how to self-exclude.”  
- **Accountability**: Share progress with an optional supporter.  
- **Self-exclusion & cool-down**: Voluntary locks during high-risk moments.

### 6. Design & Tone

- **Visuals**: Calm colors (blues/greens), minimal animations, zero gambling aesthetics.  
- **Voice**: Encouraging, supportive, never shaming.  
- **Accessibility**: WCAG-compliant, mobile-first, lightweight.

### 7. Privacy & Safety

- **Minimal data**: Email, optional notes, risk info; encrypted at rest and in transit.  
- **User control**: GDPR-compliant; easy export and deletion.  
- **Chat consent**: Store logs only with explicit consent.  
- **Crisis protocol**: On self-harm signals, show localized helplines and prompt immediate contact.

### 8. MVP Priorities

- Email login and onboarding.  
- AI chatbot with educational RAG.  
- SOS / Urge detector and crisis flow.  
- Daily plan and progress tracking.  
- Basic finance tracker and journal.  
- Future: peer groups, therapist directory, browser extension, bank integrations.

### 9. Example Dialogues

#### Impulse Detected

User: “I really want to bet right now.”  
AI: “That urge is tough — and you paused, which is a great first step. Let’s try a quick 10‑minute delay: 1) make tea, 2) walk for 5 minutes, 3) write three reasons you want to stop. Start a timer?”

#### Crisis Risk

User: “I don’t see the point anymore.”  
AI: “I’m really sorry you’re feeling this way. If you’re thinking about harming yourself, please reach out right now. I can show you a local helpline, or help you message your trusted contact. You’re not alone.”

Tech Stack:
Frontend: React Native with TypeScript, Expo, and Expo Router
Backend/Database: Supabase
UI Framework: React Native Paper
AI Processing: DeepSeek

### 10. Database Schema (PostgreSQL)

The MVP targets PostgreSQL with time-series friendly columns, soft deletes where useful, and explicit foreign keys. All timestamps are UTC (`timestamptz`).

```sql
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
```

Notes:
- Keep PII minimal; store only what is necessary.  
- Consider row-level security and per-tenant policies if using a hosted platform.  
- Use `jsonb` for flexible task payloads and model features without frequent migrations.

### 11. Recommended Project Structure

Monorepo with clear separation of API, app, shared libs, infra. Works for web or mobile clients.

```
.
├─ apps/
│  ├─ api/                 # Node/TypeScript API (Express/Nest/Fastify)
│  │  ├─ src/
│  │  │  ├─ modules/       # feature-first: auth, journal, finance, sos, tasks, chat
│  │  │  │  ├─ auth/
│  │  │  │  ├─ users/
│  │  │  │  ├─ journal/
│  │  │  │  ├─ finance/
│  │  │  │  ├─ tasks/
│  │  │  │  ├─ sos/
│  │  │  │  ├─ chat/
│  │  │  │  └─ content/
│  │  │  ├─ db/            # prisma/knex/sql migrations + seed
│  │  │  ├─ lib/           # shared utils (validation, tracing, error)
│  │  │  ├─ middleware/
│  │  │  └─ index.ts
│  │  ├─ package.json
│  │  └─ tsconfig.json
│  ├─ web/                 # Next.js (or React) client
│  │  ├─ app/ or src/
│  │  │  ├─ components/
│  │  │  ├─ features/      # feature-first UI: journal, finance, sos, tasks, chat
│  │  │  ├─ pages/ (if not app router)
│  │  │  ├─ hooks/
│  │  │  ├─ styles/
│  │  │  └─ lib/
│  │  ├─ public/
│  │  ├─ package.json
│  │  └─ tsconfig.json
│  └─ mobile/              # React Native/Expo (optional for later)
│     ├─ app/
│     ├─ components/
│     └─ package.json
├─ packages/
│  ├─ ui/                  # shared UI components (if web+mobile via React Native Web)
│  ├─ validation/          # zod/yup schemas shared by api and client
│  ├─ config/              # shared configs (eslint, tsconfig base)
│  └─ types/               # shared TypeScript types
├─ infra/
│  ├─ db/                  # SQL migrations, seed scripts, backups
│  ├─ terraform/           # optional IaC
│  └─ docker/              # Dockerfiles, compose for local dev
├─ docs/
│  └─ CONTEX.md
├─ .env.example
├─ package.json            # workspace root (pnpm/yarn/npm workspaces)
└─ README.md
```

Guidelines:
- Prefer feature-first layout (`modules/feature`) over layer-first for faster iteration.  
- Centralize schema and validation in shared packages to avoid drift.  
- Keep migrations in `infra/db` or `apps/api/src/db` (choose one source of truth).  
- Use workspaces to share code and types between API and clients.



### 12. Development Plan (MVP ~6–8 weeks)

- **Phase 0 — Setup (Complete)**  
  Monorepo, API/mobile shells, shared packages, DB schema, auth, baseline docs.

- **Phase 1 — Core UX & Data (Week 1)**  
  - Dashboard: daily goal card, weekly progress, SOS FAB  
  - Journal: create/list entries, mood/urge sliders, trigger tags  
  - Finance: add spend/save, list + simple summary  
  - Content: articles/guides listing and search  
  - Ship: stable flows; AI responses gated by env flags

- **Phase 2 — AI & Safety (Week 2)**  
  - AI chat: integrate DeepSeek via backend (reply generation)  
  - Detectors: keyword-based urge/crisis detection + `sos_events`  
  - SOS: one-tap trigger, helplines by locale, trusted contacts CRUD  
  - Ship: crisis banner, rate limits, logging

- **Phase 3 — RAG & Personalization (Week 3)**  
  - RAG: enrich `content_items`, retrieve by intent/topic  
  - Risk scores: compute from frequency, mood, urges  
  - Daily plan: micro-tasks; completions, streaks, nudges  
  - Ship: adaptive daily plan

- **Phase 4 — Quality, Privacy, Release Prep (Week 4)**  
  - QA: API unit, smoke, and happy-path mobile tests  
  - Privacy: consent gating for chat logs; export/delete data  
  - Security: CORS, headers, rate limiting, secrets management  
  - Ship: Beta via Expo; API deployed to managed Node host

- **Phase 5 — Feedback & Iteration (Weeks 5–6)**  
  Prompt/content tuning, accessibility audit, perf and indexing

#### Backlog (Post-MVP)
- Onboarding v2 (goals, triggers, baseline scores)  
- Peer support groups, therapist directory  
- Browser extension, bank integrations, proactive notifications  
- Model upgrades: improved crisis/urge classifiers, safety filters

#### Engineering Trackers
- **Non-functional**: P95 API < 300ms; app TTI < 2.5s; uptime 99.5%+; crash rate < 1%/100 sessions; GDPR export/delete; crisis flow ≤2 taps  
- **Testing**: API unit (validation/auth/CRUD), mobile smoke (auth → dashboard → journal → SOS), contract tests on `@packages/types`, light load tests  
- **DevOps**: dev/stage/prod envs; DB migrations + nightly backups; CI (lint, type-check, test, build); structured logs with PII redaction and alerts

#### Risks & Mitigations
- AI reliability: graceful fallbacks, retries, safe responses  
- Safety compliance: curated helplines, clear disclaimers  
- Scope creep: freeze features post-Week 2; backlog extras  
- Mobile auth edge cases: deep-link QA; manual fallback

#### Success Criteria (MVP)
- Users can: sign in, view dashboard, log journal, add finance entries, chat with AI, trigger SOS  
- ≥80% successful happy-path sessions; <1 crash/100 sessions  
- Positive feedback on tone and usefulness

### 13. Step-by-step Build Plan (Single-task focus)

1) Project bootstrap (done)
- Create monorepo, workspaces, base configs, README.  
- DoD: `npm run setup` succeeds; repo installs cleanly.

2) Database schema (done)
- Apply SQL in `infra/db/schema.sql`.  
- DoD: All tables exist; indexes created; basic seed optional.

3) Auth (done)
- Supabase magic-link auth; sessions table.  
- DoD: User can request link, verify, and hit `/api/auth/me` with session.

4) Dashboard (implement)
- API: simple summaries for tasks, journal, finance.  
- Mobile: show daily goal, weekly progress, SOS button.  
- DoD: Dashboard renders from live API; empty states covered.

5) Journal
- API: create/list entries; mood/urge; triggers mapping.  
- Mobile: add entry screen; list with basic filters.  
- DoD: Entry create/list works; validation via Zod; errors surfaced.

6) Finance
- API: transactions CRUD (create + list for MVP) and summary.  
- Mobile: add spend/save; list and weekly totals.  
- DoD: Totals accurate; currency displayed; edge cases (0, large).

7) Tasks
- API: create/list; complete with rating.  
- Mobile: show daily tasks; complete flow.  
- DoD: Completion recorded; streak visible in dashboard.

8) SOS & Safety
- API: `sos_events`, trusted contacts CRUD, helplines by locale.  
- Mobile: SOS sheet; contact and helpline actions.  
- DoD: SOS event persists; helplines render by `country_code`.

9) AI Chat
- Backend: DeepSeek integration with safety prompts and fallbacks.  
- Mobile: chat UI with message composer; optimistic send.  
- DoD: Assistant reply returns within 5–8s; failure fallback present.

10) Content (RAG-ready)
- API: list/search `content_items`.  
- Mobile: content list and detail.  
- DoD: Search works; tags filter optional.

11) Privacy & Consent
- Gate chat log storage via `user_settings.consent_store_chat`.  
- Add data export/delete endpoints.  
- DoD: Consent off => no persistent message storage.

12) Quality & Release Prep
- Tests: API unit + mobile smoke; `npm run test:smoke`.  
- Security: CORS, rate limits, headers validated.  
- DoD: CI green; Beta build via Expo; API deployed.

Notes for execution
- Work strictly top-to-bottom; do not start next step until current DoD is met.  
- Track each step as a single ticket; include DoD in ticket description.  
- If scope grows, move extras to backlog; protect flow velocity.