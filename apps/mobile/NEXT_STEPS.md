# Next Steps After Pushing Changes

You've pushed the configuration changes. Here's what to do next, in priority order:

## ✅ Step 1: Verify Your App Icon (Do This Now)

**Option A: Use the verification script (Easiest)**
```bash
cd apps/mobile
powershell -ExecutionPolicy Bypass -File verify-icon.ps1
```

**Option B: Check manually**
1. Open `apps/mobile/assets/icon.png` in an image viewer
2. Verify it's exactly **1024x1024 pixels**
3. Verify it's a **PNG file**
4. Make sure it looks good (no transparency issues, proper design)

**If the icon is wrong size:**
- Resize it to 1024x1024 pixels (use any image editor)
- Save as PNG format
- Replace the file at `apps/mobile/assets/icon.png`

---

## ✅ Step 2: Setup EAS (Do This Now)

EAS (Expo Application Services) is required to build your app for the App Store.

```bash
# 1. Install EAS CLI globally
npm install -g eas-cli

# 2. Login to EAS (uses your Expo account, free to sign up)
eas login

# 3. Initialize EAS project (this will update your app.json with real project ID)
cd apps/mobile
eas init
```

**Note:** If you don't have an Expo account, sign up at https://expo.dev (it's free).

**What `eas init` does:**
- Creates an EAS project
- Updates `app.json` with your real EAS project ID
- Links your local project to EAS

---

## ✅ Step 3: Test Your App Locally (Do This Before Building)

Make sure everything works before building for production:

```bash
cd apps/mobile

# Start the development server
npm run dev

# Or use Expo CLI directly
npx expo start
```

**Test these things:**
- [ ] App launches without crashes
- [ ] All screens load correctly
- [ ] Navigation works
- [ ] API calls work (your backend is accessible)
- [ ] Authentication works (if implemented)
- [ ] All features function properly

---

## ✅ Step 4: Prepare Required Assets (Do This While Waiting for Apple Account)

### A. App Screenshots (REQUIRED)
Take screenshots of your app on an iPhone (or simulator):

**Required sizes:**
- iPhone 6.7" (iPhone 14 Pro Max, 15 Pro Max): **1290 x 2796 pixels**
- iPhone 6.5" (iPhone 11 Pro Max, XS Max): **1242 x 2688 pixels** (optional but recommended)
- iPhone 5.5" (iPhone 8 Plus): **1242 x 2208 pixels** (optional)

**How to take screenshots:**
1. Run your app on iPhone simulator or real device
2. Navigate to each key screen
3. Take screenshots (Cmd+S on Mac, or device screenshot)
4. Save them somewhere safe (you'll upload to App Store Connect later)

**Recommended screenshots:**
- Dashboard/home screen
- AI chat interface
- Journal entry screen
- Finance tracking screen
- Crisis support screen

### B. Privacy Policy (REQUIRED - Must be publicly accessible)

**Current status:** You have `PRIVACY_POLICY.md` but it needs to be:
1. Updated with real information (replace placeholders)
2. Hosted on a public website
3. Accessible via URL (e.g., `https://yourwebsite.com/privacy-policy`)

**What to update in PRIVACY_POLICY.md:**
- `[Date]` → Actual date
- `[your-email@example.com]` → Your contact email
- `[your-website.com]` → Your website URL

**How to host it:**
- Option 1: Add to your existing website
- Option 2: Host on GitHub Pages (free)
- Option 3: Use a free hosting service (Vercel, Netlify)

**Important:** The Privacy Policy URL is **REQUIRED** by Apple. Your app will be rejected without it.

---

## ✅ Step 5: Get Apple Developer Account ($99/year)

**This is required before you can submit to the App Store.**

### Sign up process:
1. Go to https://developer.apple.com/programs/
2. Click "Enroll"
3. Sign in with your Apple ID
4. Choose enrollment type:
   - **Individual**: $99/year (faster approval, 1-2 days)
   - **Organization**: $99/year (requires D-U-N-S number, takes longer)
5. Complete payment ($99/year)
6. Wait for approval (1-3 days typically)

**While waiting for approval, you can:**
- ✅ Complete Steps 1-4 above
- ✅ Test your app thoroughly
- ✅ Prepare all assets
- ✅ Set up EAS
- ✅ Build a preview version (TestFlight requires Apple account)

---

## ✅ Step 6: Register Bundle ID (After Apple Account is Approved)

Once your Apple Developer account is approved:

1. Go to https://developer.apple.com/account/resources/identifiers/list
2. Click "+" → "App IDs"
3. Register your Bundle ID:
   - Description: QuitBet AI
   - Bundle ID: `com.quitbetai.app` (must match app.json)
   - Capabilities: Enable Push Notifications (if you use them)
4. Save and register

---

## ✅ Step 7: Create App in App Store Connect (After Apple Account)

1. Go to https://appstoreconnect.apple.com
2. Click "My Apps" → "+" → "New App"
3. Fill in:
   - Platform: iOS
   - Name: QuitBet AI
   - Primary Language: English
   - Bundle ID: `com.quitbetai.app` (must be registered first)
   - SKU: `quitbet-ai-001` (unique identifier)
   - User Access: Full Access
4. Click "Create"

---

## ✅ Step 8: Build Your App (After EAS Setup)

Once EAS is set up and Apple account is ready:

```bash
cd apps/mobile

# Build for iOS App Store
eas build --platform ios --profile production
```

**First build will:**
- Ask you to create credentials (let EAS handle it automatically)
- Create certificates and provisioning profiles
- Build your app in the cloud (takes 10-20 minutes)
- Automatically upload to TestFlight (if Apple account is ready)

---

## ✅ Step 9: Test on TestFlight (After Build Completes)

1. Install TestFlight app on your iPhone
2. Accept the TestFlight invite (EAS sends automatically)
3. Install your app from TestFlight
4. Test everything thoroughly:
   - [ ] App launches
   - [ ] All features work
   - [ ] No crashes
   - [ ] API calls work
   - [ ] Navigation works
   - [ ] Looks good on device

---

## ✅ Step 10: Complete App Store Listing (After App is in App Store Connect)

1. Go to App Store Connect
2. Select your app
3. Fill in all required information (see `APP_STORE_LISTING.md`):
   - App name, subtitle, description
   - Keywords
   - Screenshots (upload the ones you prepared)
   - Privacy Policy URL (must be publicly accessible)
   - Support URL
   - Category (Health & Fitness)
   - Age rating (complete questionnaire)
4. Upload app icon (1024x1024)
5. Complete app review information

---

## ✅ Step 11: Submit for Review

```bash
cd apps/mobile

# Submit to App Store
eas submit --platform ios
```

Or manually via App Store Connect:
1. Select your app version
2. Click "Submit for Review"
3. Wait for review (1-3 days typically)

---

## 📋 Quick Checklist

**Can do now (no Apple account needed):**
- [ ] Verify app icon (1024x1024 PNG)
- [ ] Set up EAS (`eas init`)
- [ ] Test app locally
- [ ] Take screenshots
- [ ] Host privacy policy publicly
- [ ] Update privacy policy with real info

**Need Apple Developer account ($99/year):**
- [ ] Sign up for Apple Developer Program
- [ ] Wait for approval (1-3 days)
- [ ] Register Bundle ID
- [ ] Create app in App Store Connect
- [ ] Build app (`eas build`)
- [ ] Test on TestFlight
- [ ] Submit for review

---

## 🚨 Important Notes

1. **Privacy Policy is REQUIRED** - Your app will be rejected without it
2. **Screenshots are REQUIRED** - At least 1 screenshot is mandatory
3. **App must not crash** - Test thoroughly before submitting
4. **Health apps get extra scrutiny** - Make sure you're not making medical claims
5. **Review can take 1-3 days** - Be patient
6. **Rejections are common** - Fix issues and resubmit

---

## 🆘 Need Help?

- EAS Docs: https://docs.expo.dev/build/introduction/
- App Store Connect: https://appstoreconnect.apple.com
- Apple Developer: https://developer.apple.com/support/
- Full Checklist: See `APP_STORE_SUBMISSION_CHECKLIST.md`

---

**Current Status:** ✅ Configuration files updated | ⏳ Waiting for next steps

**Recommended Next Action:** Verify your app icon and set up EAS (Steps 1-2)

