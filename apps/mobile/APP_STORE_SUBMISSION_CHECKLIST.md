# App Store Submission Checklist for QuitBet AI

This comprehensive checklist covers everything you need to do to submit your app to the Apple App Store.

## ✅ Phase 1: Apple Developer Account Setup

### Required:
- [ ] **Enroll in Apple Developer Program**
  - Cost: $99/year
  - Visit: https://developer.apple.com/programs/
  - You'll need: Apple ID, payment method, and legal entity information (individual or organization)
  - Approval can take 1-2 days

- [ ] **Verify your account is active**
  - Log into https://appstoreconnect.apple.com
  - Ensure you have App Store Connect access

---

## ✅ Phase 2: EAS (Expo Application Services) Setup

### Required:
- [ ] **Create EAS account** (if not already done)
  ```bash
  npm install -g eas-cli
  eas login
  ```

- [ ] **Link your project to EAS**
  ```bash
  cd apps/mobile
  eas init
  ```
  - This will generate a `projectId` in your `app.json`

- [ ] **Configure EAS build**
  - Update `eas.json` with your Apple credentials (see below)

---

## ✅ Phase 3: Update Configuration Files

### app.json - Update these values:
- [x] App name: "QuitBet AI" ✅
- [x] Slug: "quitbet-ai" ✅
- [x] Bundle ID: "com.quitbetai.app" ✅
- [ ] **EAS Project ID**: Run `eas init` to get your real project ID
- [ ] **Version**: Update when releasing new versions (currently 1.0.0)

### eas.json - Update with your Apple credentials:
```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",  // ← Your Apple ID email
        "ascAppId": "your-app-store-connect-app-id",  // ← Get from App Store Connect
        "appleTeamId": "your-team-id"  // ← Get from Apple Developer portal
      }
    }
  }
}
```

**How to find your Apple Team ID:**
1. Go to https://developer.apple.com/account
2. Click on "Membership" in the sidebar
3. Your Team ID is displayed there (format: ABC1234567)

---

## ✅ Phase 4: App Store Connect Setup

### Create App in App Store Connect:
- [ ] **Create a new app**
  - Go to https://appstoreconnect.apple.com
  - Click "My Apps" → "+" → "New App"
  - Fill in:
    - Platform: iOS
    - Name: QuitBet AI
    - Primary Language: English (or your preferred language)
    - Bundle ID: `com.quitbetai.app` (you'll need to register this first)
    - SKU: `quitbet-ai-001` (unique identifier)
    - User Access: Full Access

- [ ] **Register Bundle ID** (if not already registered)
  - Go to https://developer.apple.com/account/resources/identifiers/list
  - Click "+" → "App IDs"
  - Description: QuitBet AI
  - Bundle ID: `com.quitbetai.app` (must match app.json)
  - Enable capabilities: Push Notifications (if using)
  - Save and register

---

## ✅ Phase 5: Prepare App Assets

### Required Assets:
- [ ] **App Icon** (1024x1024 PNG)
  - Location: `apps/mobile/assets/icon.png`
  - Must be exactly 1024x1024 pixels
  - No transparency, no rounded corners (iOS will add them)
  - Must be a PNG file

- [ ] **Splash Screen** (optional but recommended)
  - Location: `apps/mobile/assets/splash.png`
  - Already configured ✅

- [ ] **App Screenshots** (REQUIRED for App Store listing)
  - iPhone 6.7" Display (iPhone 14 Pro Max, 15 Pro Max): 1290 x 2796 pixels
  - iPhone 6.5" Display (iPhone 11 Pro Max, XS Max): 1242 x 2688 pixels
  - iPhone 5.5" Display (iPhone 8 Plus): 1242 x 2208 pixels
  - **Minimum**: 1 screenshot for largest size
  - **Recommended**: 3-5 screenshots showing key features
  - Take screenshots on a real device or simulator

- [ ] **App Preview Video** (Optional but recommended)
  - 30 seconds max
  - Show key features of your app
  - Formats: .mov or .mp4

---

## ✅ Phase 6: App Store Listing Content

All content is already prepared in `APP_STORE_LISTING.md` ✅

### Update in App Store Connect:
- [ ] **App Name**: QuitBet AI
- [ ] **Subtitle**: Your compassionate companion for gambling recovery
- [ ] **Description**: Copy from APP_STORE_LISTING.md
- [ ] **Keywords**: Copy from APP_STORE_LISTING.md (100 chars max)
- [ ] **Promotional Text**: Copy from APP_STORE_LISTING.md (170 chars max)
- [ ] **Support URL**: Your website support page (required)
- [ ] **Marketing URL**: Your website (optional)
- [ ] **Privacy Policy URL**: Your privacy policy URL (required)
- [ ] **Category**: Health & Fitness (Primary), Lifestyle (Secondary)
- [ ] **Age Rating**: Complete the questionnaire (expect 17+ rating)

---

## ✅ Phase 7: Privacy & Legal Requirements

### Required:
- [ ] **Privacy Policy** (REQUIRED)
  - Already created: `PRIVACY_POLICY.md` ✅
  - **MUST be hosted on a public URL** (can't just be a file)
  - Update placeholders:
    - `[Date]` → Actual date
    - `[your-email@example.com]` → Your contact email
    - `[your-website.com]` → Your website
  - Upload to your website and get the public URL

- [ ] **Terms of Service** (Optional but recommended)
  - Already created: `TERMS_OF_SERVICE.md` ✅
  - Host on your website if using

- [ ] **App Privacy Details** (In App Store Connect)
  - Complete the privacy questionnaire
  - Declare what data you collect
  - Based on your app, you'll likely need to declare:
    - Email addresses
    - Usage data
    - Device identifiers (if using analytics)

---

## ✅ Phase 8: Build & Test

### Build the app:
- [ ] **Install EAS CLI** (if not already installed)
  ```bash
  npm install -g eas-cli
  ```

- [ ] **Build iOS app for App Store**
  ```bash
  cd apps/mobile
  eas build --platform ios --profile production
  ```
  - This will:
    - Ask you to create credentials (or reuse existing)
    - Create certificates and provisioning profiles
    - Build your app in the cloud
    - Take 10-20 minutes

- [ ] **Download and test the build**
  - Install TestFlight app on your iPhone
  - EAS will automatically upload to TestFlight after build
  - Test all features thoroughly:
    - Sign in/Sign up
    - All screens and navigation
    - AI chat functionality
    - Journal entries
    - Financial tracking
    - Crisis support
    - Push notifications (if implemented)

---

## ✅ Phase 9: Submit to App Store

### Using EAS Submit (Recommended):
- [ ] **Submit build to App Store**
  ```bash
  eas submit --platform ios
  ```
  - EAS will handle the submission process
  - Your app will appear in App Store Connect

### Or manually:
- [ ] **Upload via App Store Connect**
  - Download the `.ipa` file from EAS
  - Use Transporter app or Xcode to upload
  - Or use `eas submit` command

- [ ] **Create App Version in App Store Connect**
  - Select your app
  - Click "+ Version or Platform"
  - Choose iOS
  - Fill in version number (1.0.0)
  - Select the build you just uploaded
  - Fill in "What's New" section

- [ ] **Complete App Review Information**
  - Demo account credentials (if app requires login)
  - Contact information
  - Review notes explaining any features
  - Demo video (optional but helpful)

- [ ] **Submit for Review**
  - Review all information
  - Ensure "App Store Connect" checkbox is checked
  - Click "Submit for Review"

---

## ✅ Phase 10: App Review Process

### Timeline:
- Initial review: 1-3 days
- If rejected, fix issues and resubmit

### Common Rejection Reasons:
- [ ] App crashes on launch
- [ ] Missing privacy policy URL
- [ ] Broken functionality (links don't work, features crash)
- [ ] Incomplete app (placeholder content)
- [ ] Missing required permissions descriptions
- [ ] Violation of App Store guidelines
- [ ] Health/Medical claims (your app mentions therapy - be careful)

### Your app might face extra scrutiny because:
- It's a health/mental health app
- It deals with addiction recovery
- AI is involved

**Mitigation:**
- Clearly state it's not a replacement for professional therapy
- Make sure privacy policy is comprehensive
- Ensure all features work perfectly
- Provide detailed review notes

---

## ✅ Phase 11: Post-Submission

### After Approval:
- [ ] **App goes live** (usually within 24 hours of approval)
- [ ] **Monitor reviews and ratings**
- [ ] **Respond to user feedback**
- [ ] **Fix any reported bugs**
- [ ] **Prepare for updates**

---

## 🚨 Critical Items Checklist

Before submitting, ensure:

- [ ] App doesn't crash on launch
- [ ] All features work as expected
- [ ] Privacy policy is publicly accessible
- [ ] Support URL is working
- [ ] All placeholder text/values are replaced
- [ ] App icon is 1024x1024 PNG
- [ ] At least 1 screenshot is uploaded
- [ ] Bundle ID matches in app.json and App Store Connect
- [ ] Version number is set correctly
- [ ] Build number increments with each submission
- [ ] Demo account works (if required)
- [ ] All API endpoints are working
- [ ] No console errors or warnings
- [ ] App complies with App Store guidelines

---

## 📝 Additional Notes

### App Store Guidelines for Health Apps:
- Your app mentions "therapy" - be careful not to claim medical benefits
- Consider adding disclaimer: "Not a replacement for professional therapy"
- Make sure crisis resources actually work (don't just show alerts)

### Resources:
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)

### Getting Help:
- EAS Support: https://expo.dev/support
- Apple Developer Support: https://developer.apple.com/support/

---

## 🎯 Quick Start Commands

```bash
# 1. Login to EAS
cd apps/mobile
eas login

# 2. Initialize project (if not done)
eas init

# 3. Build for production
eas build --platform ios --profile production

# 4. Submit to App Store
eas submit --platform ios
```

---

**Status**: ✅ = Already done | ⚠️ = Needs attention | ❌ = Not started

Good luck with your App Store submission! 🚀

