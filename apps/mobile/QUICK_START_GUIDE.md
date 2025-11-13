# Quick Start Guide: Publishing to App Store

This is a condensed guide for getting your app on the App Store quickly.

## 🚀 Essential Steps (In Order)

### 1. Get Apple Developer Account ($99/year)
- Sign up at https://developer.apple.com/programs/
- Wait for approval (1-2 days)

### 2. Setup EAS
```bash
cd apps/mobile
npm install -g eas-cli
eas login
eas init  # This will create your EAS project and update app.json
```

### 3. Create App in App Store Connect
1. Go to https://appstoreconnect.apple.com
2. Register Bundle ID: `com.quitbetai.app`
   - Go to https://developer.apple.com/account/resources/identifiers/list
   - Click "+" → "App IDs"
   - Register: `com.quitbetai.app`
3. Create new app in App Store Connect
   - Name: QuitBet AI
   - Bundle ID: `com.quitbetai.app`
   - SKU: `quitbet-ai-001`

### 4. Prepare Assets
- ✅ App Icon: `apps/mobile/assets/icon.png` (must be 1024x1024 PNG)
- ⚠️ Screenshots: Take on iPhone (see APP_STORE_SUBMISSION_CHECKLIST.md for sizes)
- ✅ Privacy Policy: Update `PRIVACY_POLICY.md` and host on your website (REQUIRED)

### 5. Build Your App
```bash
cd apps/mobile
eas build --platform ios --profile production
```
- First build will ask you to create credentials (let EAS handle it)
- Takes 10-20 minutes
- Automatically uploads to TestFlight

### 6. Test on TestFlight
- Install TestFlight app on your iPhone
- Accept the TestFlight invite (EAS sends automatically)
- Test everything!

### 7. Complete App Store Listing
- Go to App Store Connect
- Fill in all app information (see `APP_STORE_LISTING.md`)
- Upload screenshots
- Add privacy policy URL
- Complete app review information

### 8. Submit for Review
```bash
eas submit --platform ios
```
OR manually via App Store Connect

### 9. Wait for Review
- Typically 1-3 days
- Address any rejection feedback
- Resubmit if needed

---

## ⚠️ CRITICAL: Before Submitting

Make sure:
- [ ] Privacy policy is publicly accessible on your website
- [ ] Support URL works
- [ ] All features work (no crashes)
- [ ] App icon is 1024x1024 PNG
- [ ] At least 1 screenshot uploaded
- [ ] No placeholder text in the app

---

## 📚 Full Details

See `APP_STORE_SUBMISSION_CHECKLIST.md` for the complete checklist with all details.

---

## 🆘 Need Help?

- EAS Docs: https://docs.expo.dev/build/introduction/
- App Store Connect: https://appstoreconnect.apple.com
- Apple Developer: https://developer.apple.com/support/

