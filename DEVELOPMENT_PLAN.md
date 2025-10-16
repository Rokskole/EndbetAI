# QuitBet AI - Development Plan & Installation Guide

## Project Overview

QuitBet AI is an AI-powered support app that helps people reduce or stop gambling through personalized guidance, crisis support, and practical tools for long-term change. This is a monorepo containing:

- **API Backend**: Node.js/Express with TypeScript, Supabase integration
- **Mobile App**: React Native with Expo, TypeScript
- **Shared Packages**: Types, validation, configuration
- **Database**: PostgreSQL with comprehensive schema

## Current Project Status

✅ **Phase 0 - Setup Complete**
- Monorepo structure with workspaces
- Database schema implemented
- Basic authentication flow
- Shared packages (types, validation, config)
- API server foundation
- Mobile app shell with auth screens

## Development Phases

### Phase 1 - Core UX & Data (Week 1) 🚧 IN PROGRESS

#### 1.1 Dashboard Implementation
- **API**: Dashboard summary endpoints
  - Daily goal status
  - Weekly progress metrics
  - Recent journal entries
  - Finance summary
  - Task completions
- **Mobile**: Dashboard UI
  - Progress cards
  - Quick actions
  - SOS button (FAB)
  - Empty states

#### 1.2 Journal Module
- **API**: Journal CRUD operations
  - Create/list journal entries
  - Mood and urge level tracking
  - Trigger associations
  - Search and filtering
- **Mobile**: Journal interface
  - Add entry screen with mood sliders
  - Entry list with filters
  - Trigger selection
  - Entry details view

#### 1.3 Finance Module
- **API**: Finance transaction management
  - Add spend/save transactions
  - List with pagination
  - Weekly/monthly summaries
  - Currency support
- **Mobile**: Finance tracking
  - Add transaction form
  - Transaction list
  - Simple charts/graphs
  - Summary cards

#### 1.4 Content Library
- **API**: Content management
  - List articles/guides
  - Search functionality
  - Tag filtering
  - Content details
- **Mobile**: Content browser
  - Article list
  - Search interface
  - Content reader
  - Bookmarking

### Phase 2 - AI & Safety (Week 2)

#### 2.1 AI Chat Integration
- **API**: DeepSeek integration
  - Message handling
  - Context management
  - Response generation
  - Safety prompts
- **Mobile**: Chat interface
  - Message list
  - Input composer
  - Typing indicators
  - Message status

#### 2.2 Crisis Detection System
- **API**: Keyword-based detection
  - Message analysis
  - Risk scoring
  - SOS event creation
  - Alert triggers
- **Mobile**: Crisis response
  - SOS panel
  - Helpline display
  - Trusted contact actions
  - Grounding exercises

#### 2.3 SOS & Safety Features
- **API**: Safety endpoints
  - Trusted contacts CRUD
  - Helpline management
  - SOS event tracking
  - Emergency protocols
- **Mobile**: Safety interface
  - SOS button
  - Contact management
  - Helpline directory
  - Emergency actions

### Phase 3 - RAG & Personalization (Week 3)

#### 3.1 RAG Implementation
- **API**: Content retrieval
  - Vector embeddings
  - Semantic search
  - Context enrichment
  - Response enhancement
- **Mobile**: Enhanced chat
  - Contextual responses
  - Educational content
  - Personalized advice

#### 3.2 Risk Scoring System
- **API**: Risk analysis
  - Pattern detection
  - Score computation
  - Trend analysis
  - Alert generation
- **Mobile**: Risk visualization
  - Risk indicators
  - Progress tracking
  - Warning systems

#### 3.3 Daily Plans & Tasks
- **API**: Task management
  - Daily plan generation
  - Task completion tracking
  - Streak calculation
  - Adaptive planning
- **Mobile**: Task interface
  - Daily task list
  - Completion flow
  - Progress tracking
  - Motivational messages

### Phase 4 - Quality & Release Prep (Week 4)

#### 4.1 Privacy & Consent
- **API**: Privacy controls
  - Consent management
  - Data export
  - Data deletion
  - Privacy settings
- **Mobile**: Privacy interface
  - Consent toggles
  - Data controls
  - Privacy settings

#### 4.2 Testing & Security
- **API**: Comprehensive testing
  - Unit tests
  - Integration tests
  - Security testing
  - Performance testing
- **Mobile**: Quality assurance
  - Smoke tests
  - User flow testing
  - Performance optimization
  - Accessibility audit

#### 4.3 Release Preparation
- **Infrastructure**: Deployment setup
  - Production environment
  - CI/CD pipeline
  - Monitoring setup
  - Backup systems
- **Documentation**: User guides
  - Setup instructions
  - User manual
  - API documentation
  - Troubleshooting

## Installation Commands

### Prerequisites
- Node.js 18+ 
- npm 9+
- PostgreSQL 13+
- Supabase account
- Expo CLI (for mobile development)

### 1. Clone and Setup
```bash
# Clone the repository
git clone <repository-url>
cd EndbetAI

# Install dependencies
npm install

# Install dependencies for all workspaces
npm run setup
```

### 2. Environment Configuration
```bash
# Copy environment template
cp env.example .env

# Edit .env with your configuration
# Required variables:
# - SUPABASE_URL
# - SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - DEEPSEEK_API_KEY
# - DATABASE_URL
```

### 3. Database Setup
```bash
# Connect to your PostgreSQL database
# Run the schema from infra/db/schema.sql
psql -d your_database -f infra/db/schema.sql

# Or use Supabase SQL editor to run the schema
```

### 4. Development Server
```bash
# Start all services
npm run dev

# Or start individually:
npm run dev:api    # API server on port 3001
npm run dev:mobile # Mobile app (Expo)
```

### 5. Mobile App Setup
```bash
# Install Expo CLI globally
npm install -g @expo/cli

# Start mobile development
cd apps/mobile
npm run dev

# For iOS simulator
npm run ios

# For Android emulator
npm run android
```

### 6. Testing
```bash
# Run all tests
npm test

# Run specific tests
npm run test:auth    # Authentication tests
npm run test:smoke   # Smoke tests

# Type checking
npm run type-check

# Linting
npm run lint
```

## Project Structure

```
EndbetAI/
├── apps/
│   ├── api/                 # Backend API
│   │   ├── src/
│   │   │   ├── modules/     # Feature modules
│   │   │   ├── middleware/  # Express middleware
│   │   │   └── lib/         # Utilities
│   │   └── package.json
│   └── mobile/              # React Native app
│       ├── app/             # Expo Router pages
│       ├── components/      # Reusable components
│       ├── features/        # Feature modules
│       └── package.json
├── packages/
│   ├── types/               # Shared TypeScript types
│   ├── validation/          # Zod schemas
│   ├── config/              # Configuration
│   └── ui/                  # Shared UI components
├── infra/
│   ├── db/                  # Database schema
│   ├── docker/              # Docker configurations
│   └── terraform/           # Infrastructure as code
└── docs/                    # Documentation
```

## Key Features Implementation Status

| Feature | API | Mobile | Status |
|---------|-----|--------|--------|
| Authentication | ✅ | ✅ | Complete |
| Dashboard | 🚧 | 🚧 | In Progress |
| Journal | ⏳ | ⏳ | Pending |
| Finance | ⏳ | ⏳ | Pending |
| AI Chat | ⏳ | ⏳ | Pending |
| SOS System | ⏳ | ⏳ | Pending |
| Crisis Detection | ⏳ | ⏳ | Pending |
| RAG System | ⏳ | ⏳ | Pending |
| Risk Scoring | ⏳ | ⏳ | Pending |
| Daily Plans | ⏳ | ⏳ | Pending |

## Next Steps

1. **Complete Phase 1** - Focus on core UX and data modules
2. **Implement Dashboard** - Start with API endpoints and mobile UI
3. **Build Journal Module** - Essential for user engagement
4. **Add Finance Tracking** - Core recovery tool
5. **Create Content Library** - Educational resources

## Development Guidelines

- **Feature-first development** - Build complete features end-to-end
- **Test-driven approach** - Write tests for critical functionality
- **Mobile-first design** - Prioritize mobile experience
- **Security-first** - Implement proper authentication and data protection
- **Accessibility** - Ensure WCAG compliance
- **Performance** - Optimize for mobile performance

## Support & Resources

- **Documentation**: See `docs/CONTEX.md` for detailed specifications
- **API Reference**: Available at `/api/docs` when running
- **Database Schema**: See `infra/db/schema.sql`
- **Type Definitions**: See `packages/types/src/index.ts`

---

**Ready to start development!** 🚀

The project is well-structured and ready for Phase 1 implementation. Focus on the dashboard and journal modules first, as they provide the core user experience foundation.
