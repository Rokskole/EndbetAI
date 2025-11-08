# 🚀 Production Ready Guide - QuitBet AI

This guide will help you transition your app from demo to production-ready for App Store submission.

## ✅ What's Been Done

### 1. EAS Build Configuration
- ✅ Created `apps/mobile/eas.json` with production build profiles
- ✅ Configured iOS and Android build settings
- ✅ Set up preview and production builds

### 2. App Configuration
- ✅ Updated `app.json` with production settings:
  - iOS privacy manifests
  - Android permissions
  - Build properties
  - API URL configuration
- ✅ Made API endpoint configurable via environment variables

### 3. Production Scripts
- ✅ Added EAS build commands to `package.json`:
  - `npm run build:ios` - Build iOS app
  - `npm run build:android` - Build Android app
  - `npm run build:all` - Build both platforms
  - `npm run submit:ios` - Submit to App Store
  - `npm run submit:android` - Submit to Play Store

### 4. Error Handling
- ✅ Created `ErrorBoundary` component for crash protection
- ✅ Integrated into app layout

### 5. Legal Documents
- ✅ Created `PRIVACY_POLICY.md`
- ✅ Created `TERMS_OF_SERVICE.md`
- ✅ Created `APP_STORE_LISTING.md` with all metadata

### 6. Assets Structure
- ✅ Created `assets/` directory with README
- ⚠️ **YOU NEED TO CREATE**: App icons and splash screens

---

## 📋 Pre-Launch Checklist

### Phase 1: Setup EAS (Expo Application Services)

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**
   ```bash
   eas login
   ```

3. **Create EAS Project**
   ```bash
   cd apps/mobile
   eas init
   ```
   - This will create a project ID
   - Update `app.json` with the generated `projectId` in `extra.eas.projectId`

4. **Configure Build Profiles**
   - Review `eas.json` - it's already configured
   - Adjust if needed for your specific requirements

### Phase 2: Create App Assets

**Required Assets:**
1. **icon.png** (1024x1024px) - App icon
2. **splash.png** (2732x2732px) - Splash screen
3. **adaptive-icon.png** (1024x1024px) - Android adaptive icon
4. **favicon.png** (48x48px) - Web favicon

**Location:** `apps/mobile/assets/`

**Tools:**
- Use Canva, Figma, or Adobe Photoshop
- Or use online generators: https://www.appicon.co/
- See `apps/mobile/assets/README.md` for detailed instructions

### Phase 3: Configure Production Backend

1. **Deploy API to Production**
   - Deploy to Vercel, Heroku, or your preferred hosting
   - Update `app.json` `extra.apiUrl` with production URL
   - Or set `EXPO_PUBLIC_API_URL` environment variable

2. **Update Environment Variables**
   ```bash
   # In apps/mobile
   cp .env.production.example .env.production
   # Edit .env.production with your production API URL
   ```

3. **Test Production API**
   - Verify all endpoints work
   - Test authentication flow
   - Test all features

### Phase 4: Update Legal Documents

1. **Privacy Policy**
   - Edit `apps/mobile/PRIVACY_POLICY.md`
   - Replace `[your-email@example.com]` with your email
   - Replace `[your-website.com]` with your website
   - Host it online (GitHub Pages, your website, etc.)
   - Update `app.json` with privacy policy URL (if needed)

2. **Terms of Service**
   - Edit `apps/mobile/TERMS_OF_SERVICE.md`
   - Replace placeholders with your information
   - Host it online
   - Link from your website/app

### Phase 5: App Store Preparation

1. **App Store Connect Setup**
   - Create Apple Developer account ($99/year)
   - Create app in App Store Connect
   - Fill out app information using `APP_STORE_LISTING.md`

2. **Screenshots**
   - Take screenshots on real devices
   - Required sizes:
     - iPhone 14 Pro Max (1290 x 2796)
     - iPhone 14 Pro (1179 x 2556)
     - iPhone SE (750 x 1334)
   - See `APP_STORE_LISTING.md` for descriptions

3. **App Preview Video** (Optional but recommended)
   - 30-second video showcasing features
   - MP4, H.264 format

### Phase 6: Build Production App

1. **Build iOS App**
   ```bash
   cd apps/mobile
   npm run build:ios
   ```
   - Follow prompts to configure certificates
   - EAS will handle code signing

2. **Build Android App**
   ```bash
   npm run build:android
   ```
   - EAS will handle signing

3. **Test Builds**
   - Download and test on real devices
   - Verify all features work
   - Check for crashes or bugs

### Phase 7: Submit to App Stores

1. **Submit iOS App**
   ```bash
   npm run submit:ios
   ```
   - Or manually upload via App Store Connect
   - Fill out review information
   - Submit for review

2. **Submit Android App**
   ```bash
   npm run submit:android
   ```
   - Or manually upload via Google Play Console
   - Fill out store listing
   - Submit for review

---

## 🔧 Configuration Files Reference

### `apps/mobile/eas.json`
EAS build configuration. Already configured for:
- Development builds
- Preview builds (internal testing)
- Production builds (App Store)

### `apps/mobile/app.json`
Main app configuration. Key settings:
- Bundle IDs: `com.quitbetai.app`
- Version: `1.0.0`
- Build numbers: Auto-increment enabled
- API URL: Configurable via `extra.apiUrl`

### `apps/mobile/lib/apiClient.ts`
API client automatically uses:
1. `app.json` `extra.apiUrl`
2. Environment variable `EXPO_PUBLIC_API_URL`
3. Fallback to default development URL

---

## 🐛 Troubleshooting

### Build Fails
- Check `eas.json` configuration
- Verify all dependencies are installed
- Check EAS project is initialized

### API Not Working
- Verify API URL in `app.json` or environment variables
- Check CORS settings on backend
- Test API endpoints directly

### App Store Rejection
- Review `APP_STORE_LISTING.md` for common issues
- Ensure privacy policy is accessible
- Test all features before submission
- Provide demo account if required

---

## 📱 Next Steps After Launch

1. **Monitor Analytics**
   - Set up crash reporting (Sentry, Bugsnag)
   - Monitor app performance
   - Track user engagement

2. **Respond to Reviews**
   - Check App Store reviews regularly
   - Respond to user feedback
   - Fix reported issues quickly

3. **Plan Updates**
   - Collect feature requests
   - Plan update roadmap
   - Regular maintenance and bug fixes

---

## 🔐 Security Checklist

- ✅ API endpoints use HTTPS
- ✅ Sensitive data encrypted
- ✅ Error boundaries prevent crashes
- ✅ Privacy policy in place
- ⚠️ Add crash reporting (Sentry/Bugsnag)
- ⚠️ Add analytics (optional, privacy-compliant)

---

## 📞 Support

For issues or questions:
1. Check documentation files
2. Review error messages
3. Check EAS documentation: https://docs.expo.dev/build/introduction/
4. Check Expo documentation: https://docs.expo.dev/

---

## ✅ Final Checklist Before Submission

- [ ] EAS project initialized
- [ ] App assets created (icons, splash screens)
- [ ] Production backend deployed and tested
- [ ] API URL configured correctly
- [ ] Privacy policy hosted and accessible
- [ ] Terms of service hosted and accessible
- [ ] App builds successfully for iOS
- [ ] App builds successfully for Android
- [ ] App tested on real devices
- [ ] All features work correctly
- [ ] No crashes or critical bugs
- [ ] App Store listing content prepared
- [ ] Screenshots taken and prepared
- [ ] Demo account created (if needed for review)
- [ ] Legal documents finalized
- [ ] Ready to submit!

---

**You're almost ready! Follow this guide step by step, and your app will be production-ready for the App Store! 🎉**

