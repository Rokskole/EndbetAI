# Quick Start - Testing Your Chat API

## ✅ API is Running
Your API is now running on `http://localhost:3001` with proper Supabase configuration!

## Your Original Command (FIXED)

### ❌ What you had:
```powershell
curl -Uri "@https://vercel.com/rok3 /chat" `
  -Method POST `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{"messages":[{"role":"user","content":"Hello!"}]}'
```

### ✅ Corrected version:
```powershell
curl -Uri "http://localhost:3001/api/chat/messages" `
  -Method POST `
  -Headers @{ 
    "Content-Type" = "application/json"
    "Authorization" = "Bearer YOUR_SESSION_TOKEN"
  } `
  -Body '{"content":"Hello!"}'
```

## What Was Wrong:

1. **URL**: 
   - ❌ `@https://vercel.com/rok3 /chat` (Vercel dashboard URL with @ symbol)
   - ✅ `http://localhost:3001/api/chat/messages` (your local API endpoint)

2. **Endpoint Path**:
   - ❌ `/chat`
   - ✅ `/api/chat/messages`

3. **Request Body**:
   - ❌ `{"messages":[{"role":"user","content":"Hello!"}]}`
   - ✅ `{"content":"Hello!"}`

4. **Authentication**:
   - ❌ Missing Authorization header
   - ✅ Needs `"Authorization" = "Bearer SESSION_TOKEN"`

## How to Test Right Now:

### Step 1: Test API Health (No auth needed)
```powershell
curl http://localhost:3001/health
```

### Step 2: Test Chat Endpoint (Will fail - needs auth)
```powershell
curl -Uri "http://localhost:3001/api/chat/messages" `
  -Method POST `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{"content":"Hello!"}'
```
**Expected:** Error 401 "Session ID required" ✅ This is correct!

### Step 3: Get Authenticated

First, send a magic link:
```powershell
curl -Uri "http://localhost:3001/api/auth/login" `
  -Method POST `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{"email":"test@example.com"}'
```

Then check your email for the magic link, or check the API logs for the token.

### Step 4: Once you have a session token:
```powershell
$sessionToken = "paste-your-session-id-here"

curl -Uri "http://localhost:3001/api/chat/messages" `
  -Method POST `
  -Headers @{ 
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $sessionToken"
  } `
  -Body '{"content":"Hello! I need help staying away from gambling."}'
```

## Testing Scripts Created

I've created several PowerShell scripts to make testing easier:

1. **`.\scripts\test-api.ps1`** - Basic API testing
2. **`.\scripts\chat-test.ps1`** - Interactive chat interface
3. **`.\scripts\quick-chat.ps1`** - Send single messages
4. **`.\scripts\check-setup.ps1`** - Verify configuration

## What I Fixed:

✅ Built all required packages (config, types, validation)
✅ Created `.env` file with Supabase credentials
✅ Updated tsconfig.json (removed invalid expo reference)
✅ Started API server on port 3001
✅ Created test scripts for you

## Current API Status:

- 🚀 Running on: `http://localhost:3001`
- 📊 Environment: Production
- 🔒 Crisis detection: Disabled (enable with ENABLE_CRISIS_DETECTION=true)
- 🤖 AI chat: Disabled (add DEEPSEEK_API_KEY to enable)

## Available Endpoints:

```
GET  /health                     - API health check (no auth)
POST /api/auth/login             - Send magic link (no auth)
POST /api/auth/verify            - Verify magic link (no auth)
GET  /api/auth/me                - Get current user (auth required)
POST /api/chat/messages          - Send chat message (auth required)
GET  /api/chat/messages          - Get chat history (auth required)
POST /api/chat/analyze           - Analyze message (auth required)
```

## For Production/Vercel:

When you deploy to Vercel, replace `http://localhost:3001` with your Vercel URL:

```powershell
curl -Uri "https://your-app.vercel.app/api/chat/messages" `
  -Method POST `
  -Headers @{ 
    "Content-Type" = "application/json"
    "Authorization" = "Bearer YOUR_TOKEN"
  } `
  -Body '{"content":"Hello!"}'
```

## Need Help?

- Check API logs for detailed error messages
- Run `.\scripts\check-setup.ps1` to verify configuration
- See `.\scripts\README-TESTING.md` for detailed testing guide

