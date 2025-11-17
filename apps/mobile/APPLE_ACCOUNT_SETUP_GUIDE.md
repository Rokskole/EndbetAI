# Apple Developer Account - Next Steps Guide

You have an Apple Developer account and are in App Store Connect. Here's what to do next:

## ✅ Step 1: Register Bundle ID (REQUIRED FIRST)

Before creating your app, you need to register your Bundle ID in the Apple Developer portal.

### How to Register Bundle ID:

1. **Go to Apple Developer Portal**
   - Visit: https://developer.apple.com/account/resources/identifiers/list
   - Sign in with your Apple ID (the same one used for App Store Connect)

2. **Create New App ID**
   - Click the **"+"** button (top left)
   - Select **"App IDs"**
   - Click **"Continue"**

3. **Configure App ID**
   - **Description**: `QuitBet AI` (or whatever you prefer)
   - **Bundle ID**: Select **"Explicit"**
   - **Bundle ID**: Enter `com.quitbetai.app` (must match your app.json exactly)
   - Click **"Continue"**

4. **Select Capabilities**
   - **Push Notifications** - ✅ MUST enable (you use expo-notifications)
   - **In-App Purchase** - ✅ Enable ONLY if you want to sell premium features/subscriptions via IAP
     - If making a simple paid app (one-time purchase), leave this unchecked
     - If making a free app with IAP or subscriptions, check this
   - **Associated Domains** - ❌ Only if you need custom domains (leave unchecked)
   - Leave others unchecked unless you need them
   - Click **"Continue"**

5. **Register**
   - Review the information
   - Click **"Register"**
   - You'll see: "Your App ID has been registered"

✅ **Bundle ID registered!** Now you can create your app in App Store Connect.

---

## ✅ Step 2: Create App in App Store Connect

Now go back to App Store Connect (where you are now):

### How to Create Your App:

1. **Click "Apps"** (top left in the icon grid)

2. **Click "+" button** (top left, next to "My Apps")

3. **Select "New App"**

4. **Fill in App Information:**
   - **Platform**: Select **iOS** (check the box)
   - **Name**: `QuitBet AI` (must be unique in the App Store)
   - **Primary Language**: `English (U.S.)` (or your preferred language)
   - **Bundle ID**: Select `com.quitbetai.app` from the dropdown (this appears after you register it)
   - **SKU**: `quitbet-ai-001` (unique identifier, you can use this)
   - **User Access**: Select **Full Access**

5. **Click "Create"**

✅ **Your app is now created in App Store Connect!**

---

## ✅ Step 3: Update EAS Submit Configuration (Optional)

After creating the app, you'll need the App Store Connect App ID for easier submission later.

### Get Your App Store Connect App ID:

1. In App Store Connect, go to your app
2. Click on **"App Information"** (left sidebar)
3. Scroll down to **"General Information"**
4. Find **"Apple ID"** - this is your `ascAppId` (e.g., `1234567890`)
5. Also note your **Team ID** from https://developer.apple.com/account (Membership section)

### Update eas.json (Optional):

You can update your `eas.json` with these values for easier submission:

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-email@example.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABC1234567"
      }
    }
  }
}
```

**Note:** EAS will ask for these during submission if you don't provide them, so this is optional.

---

## ✅ Step 4: Prepare Before Building

Before you build, make sure you have:

### Required Assets:
- [ ] **App Icon**: ✅ Already verified (1024x1024 PNG)
- [ ] **Screenshots**: Take on iPhone (see sizes below)
- [ ] **Privacy Policy URL**: Must be publicly hosted

### Screenshot Requirements:
- **iPhone 6.7" Display** (iPhone 14 Pro Max, 15 Pro Max): **1290 x 2796 pixels** (REQUIRED - minimum 1)
- **iPhone 6.5" Display** (iPhone 11 Pro Max, XS Max): **1242 x 2688 pixels** (optional but recommended)
- **iPhone 5.5" Display** (iPhone 8 Plus): **1242 x 2208 pixels** (optional)

**How to take screenshots:**
- Run your app on iPhone simulator or real device
- Take screenshots showing key features
- Save them (you'll upload later in App Store Connect)

### Privacy Policy:
- Must be publicly accessible via URL
- Update `PRIVACY_POLICY.md` with real information
- Host it on your website or use a free hosting service
- You'll need the URL when completing App Store listing

---

## ✅ Step 5: Build Your App

Once your Bundle ID is registered and app is created:

```powershell
cd C:\EndbetAI\apps\mobile
eas build --platform ios --profile production
```

**What happens:**
- EAS will ask you to create credentials (let EAS handle it automatically)
- Creates certificates and provisioning profiles
- Builds your app in the cloud (takes 10-20 minutes)
- Automatically uploads to App Store Connect/TestFlight

**First build will ask:**
- "Would you like to create credentials now?" → Type **Y** (Yes)
- EAS will handle everything automatically

---

## ✅ Step 6: Test on TestFlight

After the build completes:

1. **Install TestFlight app** on your iPhone (if not already installed)
2. **Check your email** - EAS/Apple sends an invite automatically
3. **Accept the TestFlight invite** and install your app
4. **Test thoroughly:**
   - All features work
   - No crashes
   - Navigation works
   - API calls work
   - Looks good on device

---

## ✅ Step 7: Complete App Store Listing

Go back to App Store Connect:

1. **Select your app** → Click "App Store" tab
2. **Click "+ Version or Platform"** → Select iOS
3. **Fill in App Information** (see `APP_STORE_LISTING.md`):
   - Name, Subtitle, Description
   - Keywords
   - Promotional Text
   - Support URL (required)
   - Privacy Policy URL (required - must be publicly accessible)
   - Marketing URL (optional)
   - Category: Health & Fitness (Primary), Lifestyle (Secondary)
   - Age Rating: Complete questionnaire (expect 17+)

4. **Upload Screenshots:**
   - Upload the screenshots you took
   - At minimum: iPhone 6.7" screenshot

5. **Upload App Icon:**
   - The icon from `apps/mobile/assets/icon.png` (1024x1024)

6. **Complete App Review Information:**
   - Demo account (if app requires login)
   - Contact information
   - Review notes
   - Testing instructions

7. **Select the Build:**
   - Under "Build" section, select the build you uploaded
   - If you don't see it, make sure build completed and uploaded

---

## ✅ Step 8: Submit for Review

1. **Review all information** - make sure everything is complete
2. **Click "Submit for Review"** (top right)
3. **Wait for review** (typically 1-3 days)
4. **Respond to any rejection** - fix issues and resubmit if needed

---

## 📋 Quick Checklist

**Before Building:**
- [ ] Bundle ID registered in Apple Developer portal
- [ ] App created in App Store Connect
- [ ] Screenshots taken (at least 1 required)
- [ ] Privacy Policy hosted publicly (URL ready)
- [ ] App icon verified (1024x1024 PNG) ✅

**After Building:**
- [ ] Build completed successfully
- [ ] Tested on TestFlight
- [ ] App Store listing completed
- [ ] Screenshots uploaded
- [ ] Privacy Policy URL added
- [ ] App review information completed
- [ ] Submitted for review

---

## 🚨 Important Notes

1. **Bundle ID must match exactly** - `com.quitbetai.app` in both app.json and App Store Connect
2. **Privacy Policy URL is REQUIRED** - Your app will be rejected without it
3. **Screenshots are REQUIRED** - At least 1 screenshot is mandatory
4. **Build takes 10-20 minutes** - Be patient
5. **Review takes 1-3 days** - Usually responds quickly

---

## 🔗 Useful Links

- **Apple Developer Portal**: https://developer.apple.com/account
- **App Store Connect**: https://appstoreconnect.apple.com
- **EAS Dashboard**: https://expo.dev/accounts/r0k1/projects/quitbet-ai
- **Full Checklist**: See `APP_STORE_SUBMISSION_CHECKLIST.md`

---

**Ready to start?** Begin with Step 1 - Register your Bundle ID!

Good luck! 🚀

