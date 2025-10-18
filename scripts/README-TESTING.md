# API Testing Scripts for PowerShell

This directory contains PowerShell scripts to help you test the QuitBet AI API endpoints.

## Prerequisites

1. **API Running**: Make sure your API is running
   ```powershell
   npm run dev:api
   ```

2. **Environment Variables**: Ensure your `.env` file is configured with:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DEEPSEEK_API_KEY` (optional, for AI features)

## Available Scripts

### 1. `test-api.ps1` - Basic API Testing

Tests API health, authentication endpoints, and provides instructions for further testing.

**Usage:**
```powershell
# Test local API (default)
.\scripts\test-api.ps1

# Test with custom API URL
.\scripts\test-api.ps1 -ApiUrl "https://your-api.vercel.app"

# Test with custom email
.\scripts\test-api.ps1 -Email "your-email@example.com"
```

**What it tests:**
- ✅ API health check
- ✅ Magic link authentication
- ✅ Protected endpoint security

### 2. `chat-test.ps1` - Interactive Chat Testing

Provides an interactive chat interface to test the chat API in real-time.

**Usage:**
```powershell
# Start interactive chat session
.\scripts\chat-test.ps1 -SessionToken "your-session-id-here"

# With custom API URL
.\scripts\chat-test.ps1 -SessionToken "your-session-id" -ApiUrl "https://endbet-ai-api-749k.vercel.app"
```

**Features:**
- 💬 Interactive chat interface
- 📜 View chat history
- 🤖 Real-time AI responses
- ⚠️ Crisis detection alerts

**Commands in chat:**
- Type your message and press Enter to chat
- Type `history` to see all messages
- Type `exit` to quit

### 3. `quick-chat.ps1` - Single Message Testing

Send a single message and get a response (useful for scripting).

**Usage:**
```powershell
# Send a single message
.\scripts\quick-chat.ps1 -Message "Hello, I need help" -SessionToken "your-session-id"

# Example messages to test
.\scripts\quick-chat.ps1 -Message "I'm feeling an urge to gamble" -SessionToken "abc123"
.\scripts\quick-chat.ps1 -Message "I'm feeling hopeless" -SessionToken "abc123"
.\scripts\quick-chat.ps1 -Message "Tell me about CBT techniques" -SessionToken "abc123"
```

## Complete Testing Workflow

### Step 1: Start the API
```powershell
npm run dev:api
```

### Step 2: Run Basic Tests
```powershell
.\scripts\test-api.ps1 -Email "your-email@example.com"
```

### Step 3: Get Authentication Token

**Option A: Via Supabase Dashboard**
1. Go to your Supabase dashboard
2. Navigate to Authentication > Users
3. Check the logs or email inbox for the magic link
4. Extract the token from the URL

**Option B: For Development (if using test environment)**
1. Check your API server logs for the magic link
2. The link contains parameters like `token_hash`, `type`, and `email`
3. Make a POST request to `/api/auth/verify` with these parameters

Example:
```powershell
$verifyBody = @{
    token_hash = "paste-token-hash-here"
    type = "magiclink"
    email = "your-email@example.com"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "https://endbet-ai-api-749k.vercel.app/api/auth/verify" `
    -Method POST `
    -Headers @{ "Content-Type" = "application/json" } `
    -Body $verifyBody

# Save your session ID
$sessionId = $response.data.session.id
Write-Host "Your Session ID: $sessionId"
```

### Step 4: Test Chat Functionality

**Interactive Mode:**
```powershell
.\scripts\chat-test.ps1 -SessionToken $sessionId
```

**Quick Test:**
```powershell
.\scripts\quick-chat.ps1 -Message "Hello!" -SessionToken $sessionId
```

## Testing Different Scenarios

### Test Crisis Detection
```powershell
.\scripts\quick-chat.ps1 -Message "I feel hopeless and don't know what to do" -SessionToken $sessionId
```

### Test Urge Detection
```powershell
.\scripts\quick-chat.ps1 -Message "I really want to place a bet right now" -SessionToken $sessionId
```

### Test Normal Chat
```powershell
.\scripts\quick-chat.ps1 -Message "What are some healthy coping strategies?" -SessionToken $sessionId
```

## API Endpoints Reference

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/health` | No | API health check |
| POST | `/api/auth/login` | No | Send magic link |
| POST | `/api/auth/verify` | No | Verify magic link |
| GET | `/api/auth/me` | Yes | Get current user |
| POST | `/api/auth/logout` | Yes | Logout user |
| POST | `/api/auth/refresh` | Yes | Refresh session |
| POST | `/api/chat/messages` | Yes | Send chat message |
| GET | `/api/chat/messages` | Yes | Get chat history |
| POST | `/api/chat/analyze` | Yes | Analyze message for crisis |

## Troubleshooting

### API Not Running
```
❌ API is not running. Please start it with: npm run dev:api
```
**Solution:** Start the API server with `npm run dev:api`

### Invalid Session Token
```
❌ Invalid session token or API not running
```
**Solution:** Get a new session token by following the authentication flow

### Supabase Not Configured
```
❌ Failed to send magic link: Make sure Supabase is configured
```
**Solution:** Check your `.env` file has valid Supabase credentials

### Rate Limited
```
Too many requests from this IP, please try again later
```
**Solution:** Wait 15 minutes or restart the API server (in development)

## Environment Setup

### Required Environment Variables

Create a `.env` file in the project root with:

```env
# Supabase (Required)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# API Configuration
PORT=3001
HOST=localhost
CORS_ORIGIN=http://localhost:3000
CLIENT_URL=http://localhost:3000

# AI Configuration (Optional - for chat features)
DEEPSEEK_API_KEY=your-deepseek-api-key
DEEPSEEK_BASE_URL=https://api.deepseek.com

# Features
ENABLE_CRISIS_DETECTION=true
ENABLE_AI_CHAT=true

# Environment
NODE_ENV=development
```

## Production Testing (Vercel)

Once deployed to Vercel:

```powershell
# Test production API
.\scripts\test-api.ps1 -ApiUrl "https://your-app.vercel.app" -Email "your-email@example.com"

# Interactive chat on production
.\scripts\chat-test.ps1 -SessionToken $sessionId -ApiUrl "https://your-app.vercel.app"
```

## Tips

1. **Save Your Session ID**: Store it in a variable for easy reuse
   ```powershell
   $sessionId = "your-session-id-here"
   ```

2. **Check API Logs**: Watch the API server logs for helpful debug information

3. **Use Development Mode**: Enable `NODE_ENV=development` for detailed error messages

4. **Test Incrementally**: Start with health check, then auth, then chat

5. **Monitor Supabase**: Check the Supabase dashboard for database activity

## Need Help?

- Check the main README.md for overall project setup
- Review `env.example` for required environment variables
- Ensure all dependencies are installed with `npm install`
- Make sure Supabase project is properly configured

