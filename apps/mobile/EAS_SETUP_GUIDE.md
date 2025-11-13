# EAS Setup Guide - Step by Step

This guide will help you set up EAS (Expo Application Services) for your app.

## ✅ Current Status

- ✅ EAS CLI is installed (version 16.19.3)
- ⚠️ Not logged in to EAS (requires authentication)
- ⚠️ EAS project not initialized yet

## 🚀 Setup Steps

### Step 1: Login to EAS

You need to login to EAS first. This requires interactive authentication.

**Option A: Using Email/Username (Recommended)**
```bash
cd apps/mobile
eas login
```
- Enter your Expo account email/username
- Enter your password
- If you don't have an Expo account, sign up at https://expo.dev (it's free)

**Option B: Using GitHub/Google**
```bash
cd apps/mobile
eas login --sso github
# or
eas login --sso google
```

**Option C: Using Browser (Automatic)**
```bash
cd apps/mobile
eas login --web
```
- This will open your browser
- Sign in with your Expo account
- Return to the terminal

---

### Step 2: Initialize EAS Project

Once you're logged in, initialize the EAS project:

```bash
cd apps/mobile
eas init
```

**What this does:**
- Creates a new EAS project (or links to existing one)
- Updates `app.json` with your real EAS project ID
- Links your local project to EAS

**Questions you'll be asked:**
1. "Would you like to create a new project?" → Yes
2. "What would you like to name your project?" → QuitBet AI (or whatever you prefer)
3. "In which region would you like to host your builds?" → Choose closest region (e.g., us-east-1)

**After initialization:**
- Your `app.json` will be updated with a real project ID (replaces "your-project-id-here")
- You'll see a success message
- You're ready to build!

---

### Step 3: Verify Setup

Check that everything is set up correctly:

```bash
# Check you're logged in
eas whoami

# Check your project
eas project:info
```

---

## 🎯 Quick Commands

```bash
# 1. Navigate to mobile app
cd apps/mobile

# 2. Login to EAS
eas login

# 3. Initialize project
eas init

# 4. Verify setup
eas whoami
eas project:info
```

---

## 📝 What Happens Next

After EAS is set up:

1. **You'll have a real EAS project ID** in your `app.json`
2. **You can build your app** for iOS/Android
3. **You can submit to App Store** (once you have Apple Developer account)

---

## 🆘 Troubleshooting

### "Not logged in" error
- Run `eas login` and authenticate
- Make sure you have an Expo account (sign up at https://expo.dev if needed)

### "Project already exists" error
- This is normal if you've initialized before
- EAS will link to the existing project
- Your `app.json` will be updated with the project ID

### "Cannot find project" error
- Make sure you're in the `apps/mobile` directory
- Make sure `app.json` exists
- Try running `eas init` again

---

## 🔗 Useful Links

- EAS Documentation: https://docs.expo.dev/build/introduction/
- Expo Account: https://expo.dev
- EAS Status: https://status.expo.dev/

---

## ✅ Next Steps After EAS Setup

1. ✅ Verify icon (already done!)
2. ✅ Set up EAS (you're here)
3. ⏳ Test app locally
4. ⏳ Get Apple Developer account ($99/year)
5. ⏳ Build app for iOS
6. ⏳ Submit to App Store

---

**Ready to start?** Run these commands:

```bash
cd apps/mobile
eas login
eas init
```

Good luck! 🚀

