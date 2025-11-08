# ✅ Production Checklist

Use this checklist to ensure your app is ready for App Store submission.

## 📋 Pre-Build Checklist

### Configuration
- [ ] EAS project initialized (`eas init`)
- [ ] Project ID added to `app.json` (`extra.eas.projectId`)
- [ ] Bundle ID configured (`com.quitbetai.app`)
- [ ] App version set (`1.0.0`)
- [ ] Build number configured (auto-increment enabled)

### Assets
- [ ] App icon created (1024x1024px PNG)
- [ ] Splash screen created (2732x2732px PNG)
- [ ] Android adaptive icon created (1024x1024px PNG)
- [ ] Favicon created (48x48px or 512x512px)
- [ ] All assets placed in `apps/mobile/assets/`

### Backend
- [ ] Production API deployed and accessible
- [ ] API URL configured in `app.json` or environment variables
- [ ] CORS configured for mobile app domain
- [ ] All API endpoints tested and working
- [ ] Database migrations applied
- [ ] Environment variables set on production server

### Authentication
- [ ] Magic link authentication working
- [ ] Email service configured (SendGrid, etc.)
- [ ] Deep linking configured for auth callbacks
- [ ] Session management working
- [ ] Logout functionality tested

## 📱 App Store Preparation

### Apple App Store
- [ ] Apple Developer account created ($99/year)
- [ ] App created in App Store Connect
- [ ] App Store listing content prepared
- [ ] Screenshots taken (all required sizes)
- [ ] App preview video created (optional)
- [ ] Privacy policy URL hosted and accessible
- [ ] Support URL configured
- [ ] Age rating set (17+)
- [ ] Categories selected (Health & Fitness, Lifestyle)

### Google Play Store
- [ ] Google Play Developer account created ($25 one-time)
- [ ] App created in Google Play Console
- [ ] Store listing content prepared
- [ ] Screenshots taken (all required sizes)
- [ ] Feature graphic created (1024x500px)
- [ ] Privacy policy URL hosted and accessible
- [ ] Content rating questionnaire completed

## 📄 Legal Documents

### Privacy Policy
- [ ] Privacy policy created (`PRIVACY_POLICY.md`)
- [ ] All placeholders replaced with real information
- [ ] Privacy policy hosted online (accessible URL)
- [ ] Privacy policy linked in app (if required)
- [ ] GDPR compliance verified (if serving EU users)
- [ ] CCPA compliance verified (if serving CA users)

### Terms of Service
- [ ] Terms of service created (`TERMS_OF_SERVICE.md`)
- [ ] All placeholders replaced with real information
- [ ] Terms of service hosted online (accessible URL)
- [ ] Terms linked from app or website

## 🧪 Testing

### Functional Testing
- [ ] Authentication flow tested (sign in, sign out)
- [ ] All screens load without errors
- [ ] Navigation works correctly
- [ ] API calls work correctly
- [ ] Error handling works (try invalid inputs)
- [ ] Deep linking works (auth callbacks)
- [ ] Offline behavior tested

### Device Testing
- [ ] Tested on iOS (iPhone)
- [ ] Tested on iOS (iPad if supporting tablets)
- [ ] Tested on Android (phone)
- [ ] Tested on Android (tablet if supporting)
- [ ] Tested on different screen sizes
- [ ] Tested on different OS versions

### Performance Testing
- [ ] App loads quickly (< 3 seconds)
- [ ] No memory leaks
- [ ] Battery usage reasonable
- [ ] Network requests optimized
- [ ] Images optimized

### Security Testing
- [ ] Sensitive data encrypted
- [ ] API endpoints use HTTPS
- [ ] No hardcoded secrets in code
- [ ] Session tokens handled securely
- [ ] Error messages don't leak sensitive info

## 🚀 Build & Submit

### Build Process
- [ ] `npm install` completed successfully
- [ ] `npm run build:ios` completed successfully
- [ ] `npm run build:android` completed successfully
- [ ] Builds downloaded and tested on devices
- [ ] No crashes or critical bugs found

### App Store Submission
- [ ] iOS build uploaded to App Store Connect
- [ ] App Store listing completed
- [ ] Review notes provided (demo account if needed)
- [ ] App submitted for review
- [ ] Android build uploaded to Google Play Console
- [ ] Play Store listing completed
- [ ] App submitted for review

## 📊 Post-Launch

### Monitoring
- [ ] Crash reporting set up (Sentry, Bugsnag)
- [ ] Analytics set up (optional, privacy-compliant)
- [ ] App Store Connect notifications enabled
- [ ] Google Play Console notifications enabled

### Support
- [ ] Support email configured
- [ ] Support website/page ready
- [ ] FAQ or help documentation prepared
- [ ] Response process for user feedback

### Maintenance
- [ ] Update process planned
- [ ] Bug tracking system set up
- [ ] Feature request tracking system
- [ ] Regular review monitoring scheduled

---

## 🎯 Quick Start Commands

```bash
# 1. Initialize EAS
cd apps/mobile
eas login
eas init

# 2. Update app.json with project ID from step 1

# 3. Build for production
npm run build:ios      # iOS build
npm run build:android # Android build
npm run build:all     # Both platforms

# 4. Submit to stores
npm run submit:ios      # Submit to App Store
npm run submit:android  # Submit to Play Store
```

---

**Once all items are checked, your app is ready for App Store submission! 🎉**

