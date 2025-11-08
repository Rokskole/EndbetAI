# Deploy to Vercel - Quick Guide

## Step 1: Push to GitHub

```powershell
cd C:\Users\Rok\Downloads\EndbetAI
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/quitbet-ai.git
git push -u origin main
```

## Step 2: Deploy to Vercel

### In Vercel Import Dialog, use:
```
https://github.com/YOUR_USERNAME/quitbet-ai
```

### Environment Variables to Set in Vercel:

Go to your Vercel project → Settings → Environment Variables and add:

```
SUPABASE_URL = https://pddaxnedzvzkoyaxplhm.supabase.co
SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkZGF4bmVkenZ6a295YXhwbGhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMTE4NzQsImV4cCI6MjA3Mzg4Nzg3NH0.QWyunYKWHH5Y5j0OO6ua_JR9LGF6apoO8Vr88IBpntk
SUPABASE_SERVICE_ROLE_KEY = your_service_role_key_here
PORT = 3001
NODE_ENV = production
ENABLE_CRISIS_DETECTION = true
ENABLE_AI_CHAT = true
```

### Important: Get Your Supabase Service Role Key

1. Go to https://supabase.com/dashboard/project/pddaxnedzvzkoyaxplhm/settings/api
2. Copy the **service_role** key (secret)
3. Add it to Vercel environment variables

## Step 3: Test Your Deployed API

After deployment, test with:

```powershell
curl -Uri "https://your-app.vercel.app/health"
```

And for chat (once you have auth):
```powershell
curl -Uri "https://your-app.vercel.app/api/chat/messages" `
  -Method POST `
  -Headers @{ 
    "Content-Type" = "application/json"
    "Authorization" = "Bearer YOUR_SESSION_TOKEN"
  } `
  -Body '{"content":"Hello!"}'
```

## What Gets Deployed:

- ✅ API Backend (Node.js/Express)
- ✅ Chat endpoints
- ✅ Authentication
- ✅ Crisis detection
- ❌ Mobile app (stays local/Expo)

## After Deployment:

Your API will be available at:
```
https://your-app-name.vercel.app
```

Update your mobile app to use this URL instead of localhost.

