# QuitBet AI Backend Setup Guide

## 🚀 Quick Start

### Step 1: Install Dependencies
```bash
cd apps/api
npm install
```

### Step 2: Set Up Environment Variables

1. Copy the example environment file:
```bash
cp env.example .env
```

2. Edit `.env` and add your credentials:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# JWT Secret - Generate a random string
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Gmail Configuration (for password reset)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# OpenAI API Key (get from https://platform.openai.com)
OPENAI_API_KEY=sk-your-openai-api-key

# CORS Origins
ALLOWED_ORIGINS=https://your-app-domain.com
```

### Step 3: Configure Gmail (for password reset)

1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account Settings → Security → App Passwords
3. Generate a new app password
4. Use that password in `EMAIL_PASS`

### Step 4: Get OpenAI API Key

1. Go to https://platform.openai.com
2. Sign up or log in
3. Go to API Keys section
4. Create a new API key
5. Add it to your `.env` file

### Step 5: Run the Server

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

## 📦 Deploy to Production

### Option 1: Deploy to Vercel (Easiest)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login:
```bash
vercel login
```

3. Deploy:
```bash
vercel --prod
```

4. Add environment variables in Vercel dashboard

### Option 2: Deploy to Heroku

1. Install Heroku CLI
2. Create app:
```bash
heroku create your-app-name
```

3. Set environment variables:
```bash
heroku config:set JWT_SECRET=your-secret
heroku config:set EMAIL_USER=your-email@gmail.com
heroku config:set EMAIL_PASS=your-password
heroku config:set OPENAI_API_KEY=your-key
```

4. Deploy:
```bash
git push heroku main
```

### Option 3: Deploy to AWS/GCP

Follow the standard Node.js deployment guides for your chosen provider.

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with code

### Chat
- `POST /api/chat` - Send chat message to AI

### Users
- `GET /api/users/:userId` - Get user data
- `POST /api/users/:userId/data` - Save user data

## 🧪 Testing

Test the API:
```bash
curl http://localhost:5000/health
```

Should return:
```json
{"status":"ok","timestamp":"2024-01-01T00:00:00.000Z"}
```

## 📝 Next Steps

After backend is deployed, you'll need to:

1. Update mobile app to use backend API
2. Test all authentication flows
3. Implement proper database (PostgreSQL/MongoDB)
4. Add monitoring and logging
5. Set up CI/CD pipeline

