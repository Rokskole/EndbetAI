# Apple In-App Purchase Setup - Step by Step Guide

This guide walks you through setting up Apple In-App Purchase (IAP) for your iOS app.

## 📋 Prerequisites

Before you start:
- ✅ Apple Developer account ($99/year) - **REQUIRED**
- ✅ App Store Connect access - **REQUIRED**
- ✅ Your app configured with EAS - **Already done!** ✅
- ✅ Bundle ID ready - `com.quitbetai.app`

---

## 🎯 Step-by-Step Setup

### **Step 1: Register Bundle ID with In-App Purchase Capability**

#### 1.1 Go to Apple Developer Portal
1. Open: https://developer.apple.com/account
2. Sign in with your Apple ID (same as App Store Connect)

#### 1.2 Navigate to Identifiers
1. Click **"Certificates, IDs & Profiles"** (left sidebar)
2. Click **"Identifiers"** (in the list)
3. You should see a list of existing identifiers

#### 1.3 Create New App ID (or Edit Existing)
**If Bundle ID doesn't exist:**
1. Click the **"+"** button (top left)
2. Select **"App IDs"**
3. Click **"Continue"**

**If Bundle ID exists:**
1. Search for `com.quitbetai.app` in the list
2. Click on it to edit

#### 1.4 Configure App ID
**Fill in:**
1. **Description**: `QuitBet AI` (or whatever you prefer)
2. **Bundle ID**: Select **"Explicit"**
3. **Bundle ID**: Enter `com.quitbetai.app` (must match your app.json exactly)
4. Click **"Continue"**

#### 1.5 Select Capabilities
**IMPORTANT - Select these:**
- ✅ **Push Notifications** - Check this (you use expo-notifications)
- ✅ **In-App Purchase** - **MUST CHECK THIS!** ← Critical for IAP
- ❌ **Sign in with Apple** - Leave unchecked (you use Supabase)
- ❌ **Associated Domains** - Leave unchecked (unless needed)
- ❌ **Other capabilities** - Leave unchecked unless needed

**Click "Continue"**

#### 1.6 Register
1. Review your settings
2. Click **"Register"**
3. You'll see: "Your App ID has been registered" ✅

**✅ Step 1 Complete!** Bundle ID registered with In-App Purchase capability.

---

### **Step 2: Create App in App Store Connect**

#### 2.1 Go to App Store Connect
1. Open: https://appstoreconnect.apple.com
2. Sign in with your Apple ID

#### 2.2 Create New App
1. Click **"My Apps"** (in the icon grid)
2. Click the **"+"** button (top left, next to "My Apps")
3. Select **"New App"**

#### 2.3 Fill in App Information
**Fill in the form:**
- **Platform**: Check **iOS** ✅
- **Name**: `QuitBet AI` (must be unique in App Store)
- **Primary Language**: Select `English (U.S.)` (or your preferred language)
- **Bundle ID**: Select `com.quitbetai.app` from dropdown (the one you registered)
- **SKU**: `quitbet-ai-001` (unique identifier, can't be changed)
- **User Access**: Select **Full Access**

**Click "Create"**

**✅ Step 2 Complete!** Your app is now in App Store Connect.

---

### **Step 3: Create In-App Purchase Products**

#### 3.1 Navigate to In-App Purchases
1. In App Store Connect, select your app (`QuitBet AI`)
2. Click **"Features"** tab (top navigation)
3. Click **"In-App Purchases"** (left sidebar)
4. Click the **"+"** button (next to "In-App Purchases")

#### 3.2 Create First Product - Monthly Subscription

**Product Type:**
- Select **"Auto-Renewable Subscription"** ← For monthly/yearly
- Click **"Create"**

**Product Information:**
1. **Reference Name**: `Premium Monthly` (internal name)
2. **Product ID**: `com.quitbetai.app.premium.monthly` ← **MUST match code exactly!**
3. **Subscription Group**: Create new group `Premium Subscription`
4. **Subscription Duration**: Select **1 Month**
5. Click **"Create"**

**Pricing:**
1. Click **"Set Up Subscription"**
2. Select price tier (e.g., **$4.99** / Tier 5)
3. Click **"Next"**

**Localization:**
1. Click **"Add Localization"**
2. **Display Name**: `Premium Monthly`
3. **Description**: `Unlock all premium features for one month. Includes AI chat, advanced tracking, and premium content.`
4. Click **"Save"**

**Click "Save"** (top right)

#### 3.3 Create Second Product - Yearly Subscription

**Repeat Step 3.2 with:**
- **Reference Name**: `Premium Yearly`
- **Product ID**: `com.quitbetai.app.premium.yearly` ← **Must match code!**
- **Subscription Group**: Same group `Premium Subscription`
- **Subscription Duration**: Select **1 Year**
- **Price**: **$39.99** / Tier 20 (or your chosen price)
- **Display Name**: `Premium Yearly`
- **Description**: `Unlock all premium features for one year. Save 30% compared to monthly subscription.`

**Click "Save"**

#### 3.4 Create Third Product - Lifetime Purchase

**Product Type:**
- Select **"Non-Consumable"** ← For lifetime purchase
- Click **"Create"**

**Product Information:**
1. **Reference Name**: `Premium Lifetime`
2. **Product ID**: `com.quitbetai.app.premium.lifetime` ← **Must match code!**
3. Click **"Create"**

**Pricing:**
1. Select price tier (e.g., **$99.99** / Tier 50)
2. Click **"Next"**

**Localization:**
1. **Display Name**: `Premium Lifetime`
2. **Description**: `Unlock all premium features forever. One-time payment for lifetime access.`
3. Click **"Save"**

**Click "Save"** (top right)

#### 3.5 Verify Product IDs
**Make sure these match exactly in your code** (`apps/mobile/lib/payments.ts`):
```typescript
PRODUCT_IDS = {
  PREMIUM_MONTHLY: 'com.quitbetai.app.premium.monthly',
  PREMIUM_YEARLY: 'com.quitbetai.app.premium.yearly',
  PREMIUM_LIFETIME: 'com.quitbetai.app.premium.lifetime',
}
```

**✅ Step 3 Complete!** All IAP products created.

---

### **Step 4: Get Apple Shared Secret**

#### 4.1 Navigate to App-Specific Shared Secret
1. In App Store Connect, select your app
2. Click **"App Store"** tab (top navigation)
3. Click **"In-App Purchases"** section (left sidebar)
4. Scroll down to **"App-Specific Shared Secret"**
5. Click **"Generate"** or **"View"**

#### 4.2 Copy Shared Secret
1. Copy the shared secret (looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)
2. Save it securely - you'll need it for backend

#### 4.3 Add to Backend Environment
Add to `apps/api/.env`:
```env
APPLE_SHARED_SECRET=your_shared_secret_here
APPLE_BUNDLE_ID=com.quitbetai.app
```

**✅ Step 4 Complete!** Shared secret configured.

---

### **Step 5: Submit IAP Products for Review**

#### 5.1 Prepare for Submission
**For each product:**
1. Make sure all information is filled in
2. Screenshots are optional but recommended
3. Review notes are optional

#### 5.2 Submit Each Product
1. Go to **"Features"** → **"In-App Purchases"**
2. Click on each product
3. Click **"Submit for Review"** (top right)
4. Confirm submission

**Note:** IAP products need to be approved before they can be purchased. This typically takes 1-2 days.

**✅ Step 5 Complete!** Products submitted for review.

---

### **Step 6: Configure Your App for Testing**

#### 6.1 Verify Product IDs in Code
Check `apps/mobile/lib/payments.ts`:
```typescript
export const PRODUCT_IDS = {
  PREMIUM_MONTHLY: Platform.OS === 'ios' 
    ? 'com.quitbetai.app.premium.monthly'  // ← Must match App Store Connect
    : 'premium_monthly',
  PREMIUM_YEARLY: Platform.OS === 'ios'
    ? 'com.quitbetai.app.premium.yearly'   // ← Must match App Store Connect
    : 'premium_yearly',
  PREMIUM_LIFETIME: Platform.OS === 'ios'
    ? 'com.quitbetai.app.premium.lifetime' // ← Must match App Store Connect
    : 'premium_lifetime',
};
```

**✅ Already configured!**

#### 6.2 Build Your App
```powershell
cd C:\EndbetAI\apps\mobile
eas build --platform ios --profile production
```

**This will:**
- Create certificates and provisioning profiles
- Build your app for iOS
- Upload to TestFlight (if configured)

#### 6.3 Install TestFlight
1. Install TestFlight app on your iPhone (if not already installed)
2. Accept TestFlight invite (sent automatically by EAS)
3. Install your app from TestFlight

**✅ Step 6 Complete!** App ready for testing.

---

### **Step 7: Create Sandbox Test Account**

#### 7.1 Create Test Account
1. In App Store Connect, go to **"Users and Access"**
2. Click **"Sandbox Testers"** tab
3. Click **"+"** button
4. Fill in:
   - **First Name**: Test
   - **Last Name**: User
   - **Email**: Use a unique email (e.g., `test-quitbet@example.com`)
   - **Password**: Create a password
   - **Country/Region**: Select your region
5. Click **"Invite"**

**Note:** You'll receive an email to confirm the sandbox account.

#### 7.2 Use Sandbox Account for Testing
1. **Sign out** of App Store on your test device
2. When you try to purchase in-app, you'll be prompted to sign in
3. **Use the sandbox test account** you created
4. Purchases will be free in sandbox mode

**✅ Step 7 Complete!** Sandbox testing configured.

---

### **Step 8: Test IAP Purchases**

#### 8.1 Test Purchase Flow
1. Open your app on test device (via TestFlight)
2. Navigate to premium features or purchase screen
3. Click "Upgrade to Premium" or purchase button
4. Select a product (Monthly, Yearly, or Lifetime)
5. You'll be prompted to sign in → **Use sandbox test account**
6. Confirm purchase (it's free in sandbox)
7. Verify purchase completes successfully

#### 8.2 Verify Purchase in Backend
1. Check backend logs for receipt verification
2. Verify user's premium status is updated
3. Check database for purchase record

#### 8.3 Test Restore Purchases
1. In your app, find "Restore Purchases" option
2. Click it
3. Sign in with sandbox account if prompted
4. Verify previous purchases are restored

**✅ Step 8 Complete!** IAP tested successfully.

---

## 📝 Quick Checklist

**Before Testing:**
- [ ] Bundle ID registered with In-App Purchase capability
- [ ] App created in App Store Connect
- [ ] IAP products created in App Store Connect
- [ ] Product IDs match code exactly
- [ ] Apple shared secret obtained and added to backend
- [ ] IAP products submitted for review (takes 1-2 days)
- [ ] Sandbox test account created
- [ ] App built and installed via TestFlight
- [ ] Backend environment variables configured

**For Production:**
- [ ] IAP products approved by Apple
- [ ] App submitted for review
- [ ] Backend using production Apple shared secret
- [ ] Receipt verification working correctly
- [ ] Premium status updates correctly

---

## 🎯 Product IDs Reference

Make sure these match **exactly** in App Store Connect and your code:

| Product | Product ID (App Store Connect) | Code Reference |
|---------|-------------------------------|----------------|
| Monthly | `com.quitbetai.app.premium.monthly` | `PRODUCT_IDS.PREMIUM_MONTHLY` |
| Yearly | `com.quitbetai.app.premium.yearly` | `PRODUCT_IDS.PREMIUM_YEARLY` |
| Lifetime | `com.quitbetai.app.premium.lifetime` | `PRODUCT_IDS.PREMIUM_LIFETIME` |

---

## ⚠️ Important Notes

### Product IDs Cannot Be Changed
- Once created and submitted, Product IDs **cannot be changed**
- Double-check Product IDs before submitting
- They must match your code exactly

### Sandbox vs Production
- **Sandbox**: Free purchases, for testing
- **Production**: Real purchases, after App Store approval
- Receipt verification automatically handles both

### Review Process
- IAP products must be **approved** before they can be purchased
- Review typically takes **1-2 days**
- Your app must also be approved before IAP works in production

### Shared Secret
- Shared secret is required for receipt verification
- Keep it secure (don't commit to git)
- Use environment variables in backend

---

## 🐛 Troubleshooting

### "Product not found" Error
- **Check**: Product IDs match exactly in App Store Connect and code
- **Check**: Product is submitted and approved
- **Check**: Product ID format is correct (no typos)

### "Invalid receipt" Error
- **Check**: Apple shared secret is correct in backend `.env`
- **Check**: Receipt is base64 encoded
- **Check**: Bundle ID matches in receipt and App Store Connect

### "Purchase cancelled" Error
- **Check**: User is signed in with sandbox account
- **Check**: Product is approved in App Store Connect
- **Check**: Network connection is working

### "No products available"
- **Check**: IAP products are created in App Store Connect
- **Check**: Product IDs match code exactly
- **Check**: Products are submitted for review
- **Wait**: May take a few hours for products to appear after creation

---

## 🔗 Useful Links

- **Apple Developer Portal**: https://developer.apple.com/account
- **App Store Connect**: https://appstoreconnect.apple.com
- **Apple IAP Guidelines**: https://developer.apple.com/in-app-purchase/
- **Expo IAP Docs**: https://docs.expo.dev/versions/latest/sdk/in-app-purchases/
- **EAS Dashboard**: https://expo.dev/accounts/r0k1/projects/quitbet-ai

---

## ✅ Completion Checklist

After completing all steps:

- [ ] ✅ Bundle ID registered with IAP capability
- [ ] ✅ App created in App Store Connect
- [ ] ✅ All 3 IAP products created (monthly, yearly, lifetime)
- [ ] ✅ Product IDs match code exactly
- [ ] ✅ Apple shared secret obtained
- [ ] ✅ Shared secret added to backend `.env`
- [ ] ✅ IAP products submitted for review
- [ ] ✅ Sandbox test account created
- [ ] ✅ App built and installed via TestFlight
- [ ] ✅ Test purchase completed successfully
- [ ] ✅ Restore purchases works
- [ ] ✅ Backend receipt verification working

---

**Ready to start?** Begin with **Step 1: Register Bundle ID with In-App Purchase Capability**!

**Questions?** Check the troubleshooting section above or see `PAYMENT_IMPLEMENTATION_GUIDE.md` for more details.

