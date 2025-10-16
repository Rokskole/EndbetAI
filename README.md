# QuitBet AI - Gambling Recovery Support App

An AI-powered support app that helps people reduce or stop gambling through personalized guidance, crisis support, and practical tools for long-term change.

## 🚀 Quick Start

### Installation Command

```bash
# Clone and setup the project
git clone <repository-url>
cd EndbetAI
npm run quick-setup
```

### Manual Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp env.example .env

# 3. Edit .env with your credentials
# Required: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, DEEPSEEK_API_KEY

# 4. Set up database
# Run infra/db/schema.sql in your PostgreSQL database

# 5. Start development
npm run dev
```

## 📱 What's Included

- **API Backend**: Node.js/Express with TypeScript
- **Mobile App**: React Native with Expo
- **Database**: PostgreSQL with comprehensive schema
- **AI Integration**: DeepSeek for conversational support
- **Authentication**: Supabase magic link auth
- **Safety Features**: Crisis detection and SOS system

## 🏗️ Project Structure

```
EndbetAI/
├── apps/
│   ├── api/                 # Backend API server
│   └── mobile/              # React Native mobile app
├── packages/
│   ├── types/               # Shared TypeScript types
│   ├── validation/          # Zod validation schemas
│   ├── config/              # Configuration management
│   └── ui/                  # Shared UI components
├── infra/
│   ├── db/                  # Database schema and migrations
│   ├── docker/              # Docker configurations
│   └── terraform/           # Infrastructure as code
└── docs/                    # Documentation
```

## 🛠️ Development

### Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL 13+
- Supabase account
- Expo CLI (for mobile development)

### Available Scripts

```bash
# Development
npm run dev              # Start all services
npm run dev:api          # Start API server only
npm run dev:mobile       # Start mobile app only

# Setup
npm run quick-setup      # Quick setup with checks
npm run setup            # Full setup process

# Testing
npm test                 # Run all tests
npm run test:auth        # Authentication tests
npm run test:smoke       # Smoke tests

# Quality
npm run lint             # Run linter
npm run type-check       # TypeScript type checking
npm run build            # Build all packages
```

### Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/quitbet_ai

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AI
DEEPSEEK_API_KEY=your_deepseek_api_key
DEEPSEEK_BASE_URL=https://api.deepseek.com

# Security
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_encryption_key

# Features
ENABLE_CRISIS_DETECTION=true
ENABLE_AI_CHAT=true
ENABLE_ANALYTICS=false

# External Services (Optional)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number
```

## 📊 Current Status

| Feature | API | Mobile | Status |
|---------|-----|--------|--------|
| Authentication | ✅ | ✅ | Complete |
| Dashboard | 🚧 | 🚧 | In Progress |
| Journal | ⏳ | ⏳ | Pending |
| Finance | ⏳ | ⏳ | Pending |
| AI Chat | ⏳ | ⏳ | Pending |
| SOS System | ⏳ | ⏳ | Pending |
| Crisis Detection | ⏳ | ⏳ | Pending |

## 🎯 Development Phases

### Phase 1 - Core UX & Data (Week 1)
- Dashboard implementation
- Journal module
- Finance tracking
- Content library

### Phase 2 - AI & Safety (Week 2)
- AI chat integration
- Crisis detection
- SOS system
- Safety features

### Phase 3 - RAG & Personalization (Week 3)
- RAG implementation
- Risk scoring
- Daily plans
- Adaptive features

### Phase 4 - Quality & Release (Week 4)
- Privacy controls
- Testing & security
- Performance optimization
- Release preparation

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signin` - Send magic link
- `POST /api/auth/callback` - Verify magic link
- `GET /api/auth/me` - Get current user
- `POST /api/auth/signout` - Sign out

### Journal
- `GET /api/journal` - List journal entries
- `POST /api/journal` - Create journal entry
- `GET /api/journal/:id` - Get journal entry
- `PUT /api/journal/:id` - Update journal entry
- `DELETE /api/journal/:id` - Delete journal entry

### Finance
- `GET /api/finance` - List transactions
- `POST /api/finance` - Create transaction
- `GET /api/finance/summary` - Get financial summary

### Tasks
- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create task
- `POST /api/tasks/:id/complete` - Complete task

### SOS & Safety
- `POST /api/sos/trigger` - Trigger SOS event
- `GET /api/sos/helplines` - Get helplines by country
- `GET /api/sos/contacts` - Get trusted contacts
- `POST /api/sos/contacts` - Add trusted contact

### Chat
- `GET /api/chat/messages` - Get chat history
- `POST /api/chat/send` - Send message
- `POST /api/chat/analyze` - Analyze message for risk

## 📱 Mobile App

The mobile app is built with React Native and Expo, featuring:

- **Authentication**: Magic link sign-in
- **Dashboard**: Progress overview and quick actions
- **Journal**: Mood and urge tracking
- **Finance**: Spending and saving tracking
- **Chat**: AI-powered support conversations
- **SOS**: Crisis support and emergency contacts

### Mobile Development

```bash
# Start mobile development
cd apps/mobile
npm run dev

# Run on specific platforms
npm run ios      # iOS simulator
npm run android  # Android emulator
npm run web      # Web browser
```

## 🗄️ Database Schema

The database includes comprehensive tables for:

- **Users & Authentication**: User profiles and sessions
- **Journal & Mood**: Journal entries and mood tracking
- **Finance**: Transaction tracking and summaries
- **Tasks & Recovery**: Daily tasks and completions
- **AI & Chat**: Message history and AI interactions
- **Safety & SOS**: Crisis events and trusted contacts
- **Content**: Educational articles and guides
- **Settings**: User preferences and privacy controls

See `infra/db/schema.sql` for the complete schema.

## 🔒 Security & Privacy

- **Authentication**: Supabase magic link authentication
- **Data Encryption**: Sensitive data encrypted at rest
- **Privacy Controls**: User consent for data storage
- **Crisis Detection**: Automated risk assessment
- **Rate Limiting**: API rate limiting and protection
- **CORS**: Configured for secure cross-origin requests

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:auth    # Authentication tests
npm run test:smoke   # Smoke tests

# Run tests for specific workspace
npm run test --workspace=apps/api
npm run test --workspace=apps/mobile
```

## 📚 Documentation

- **Development Plan**: `DEVELOPMENT_PLAN.md`
- **Context & Specs**: `docs/CONTEX.md`
- **API Documentation**: Available at `/api/docs` when running
- **Database Schema**: `infra/db/schema.sql`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- **Documentation**: Check the docs folder
- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions

## ⚠️ Disclaimer

This app is designed to support gambling recovery but is not a substitute for professional therapy or medical treatment. If you're in crisis, please contact emergency services or a qualified mental health professional.

---

**Ready to help people on their recovery journey!** 🌟