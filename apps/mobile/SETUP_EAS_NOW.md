# Setup EAS Now - Step by Step Instructions

Follow these steps to set up EAS for your app. **This requires interactive commands**, so you'll need to run them in your terminal.

## ✅ Prerequisites

- ✅ EAS CLI is installed (version 16.19.3)
- ✅ You're in the project directory
- ⚠️ You need an Expo account (sign up at https://expo.dev if needed - it's free)

## 🚀 Step-by-Step Instructions

### Step 1: Open Terminal

Open your terminal/PowerShell in the project root or navigate to the mobile app directory:

```powershell
# If you're in the project root (C:\EndbetAI)
cd apps\mobile

# Verify you're in the right place
dir app.json
```

You should see `app.json` listed.

---

### Step 2: Login to EAS

Run this command and follow the prompts:

```powershell
eas login
```

**What will happen:**
1. EAS will ask: "Log in to EAS with email or username"
2. Enter your Expo account email (or create one at https://expo.dev first)
3. Enter your password
4. You'll see: "Successfully logged in as [your-email]"

**Alternative login methods:**
- `eas login --web` - Opens browser for authentication
- `eas login --sso github` - Login with GitHub
- `eas login --sso google` - Login with Google

**If you don't have an Expo account:**
1. Go to https://expo.dev
2. Click "Sign Up" (it's free)
3. Create an account
4. Return to terminal and run `eas login`

---

### Step 3: Initialize EAS Project

Once you're logged in, run:

```powershell
eas init
```

**What will happen:**
1. EAS will ask: "Would you like to create a new project?"
   - Type: **Y** (Yes)
   - Press Enter

2. EAS will ask: "What would you like to name your project?"
   - Type: **QuitBet AI** (or whatever you prefer)
   - Press Enter

3. EAS will ask: "In which region would you like to host your builds?"
   - Choose the region closest to you (e.g., **us-east-1** for US East)
   - Press Enter

4. EAS will create the project and update your `app.json`
   - You'll see: "Created new project: [project-name]"
   - Your `app.json` will be updated with a real project ID

**What gets updated:**
- `app.json` → `extra.eas.projectId` will be updated from `"your-project-id-here"` to a real ID like `"abc123-def456-ghi789"`

---

### Step 4: Verify Setup

Check that everything is set up correctly:

```powershell
# Check you're logged in
eas whoami

# Check your project info
eas project:info
```

**Expected output:**
- `eas whoami` → Shows your email/username
- `eas project:info` → Shows your project details

---

## ✅ Success Checklist

After completing these steps, you should have:

- [ ] ✅ Logged in to EAS (`eas whoami` shows your account)
- [ ] ✅ EAS project created (`eas project:info` shows your project)
- [ ] ✅ `app.json` updated with real project ID
- [ ] ✅ Ready to build your app

---

## 🎯 Next Steps After EAS Setup

Once EAS is set up, you can:

1. **Test your app locally:**
   ```powershell
   npm run dev
   ```

2. **Build for iOS (requires Apple Developer account):**
   ```powershell
   eas build --platform ios --profile production
   ```

3. **Build for Android:**
   ```powershell
   eas build --platform android --profile production
   ```

---

## 🆘 Troubleshooting

### "Not logged in" error
- Make sure you ran `eas login` and successfully logged in
- Check with `eas whoami`

### "Cannot find project" error
- Make sure you're in the `apps\mobile` directory
- Make sure `app.json` exists
- Try running `eas init` again

### "Project already exists" error
- This is normal if you've initialized before
- EAS will link to the existing project
- Your `app.json` will be updated with the project ID

### "Email or password incorrect"
- Make sure you have an Expo account (sign up at https://expo.dev)
- Check your email/password
- Try resetting your password if needed

---

## 📝 Quick Reference

```powershell
# 1. Navigate to mobile app
cd apps\mobile

# 2. Login to EAS
eas login

# 3. Initialize project
eas init

# 4. Verify setup
eas whoami
eas project:info
```

---

## 🔗 Useful Links

- **Expo Account**: https://expo.dev
- **EAS Documentation**: https://docs.expo.dev/build/introduction/
- **EAS Status**: https://status.expo.dev/

---

**Ready to start?** Open your terminal and run the commands above! 🚀

**Need help?** Check the full guide at `EAS_SETUP_GUIDE.md`

