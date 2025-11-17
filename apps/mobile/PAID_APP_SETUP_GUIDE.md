# Paid App Setup Guide

This guide explains how to set up your app as a paid app in the App Store.

## 📱 Payment Model Options

You have three main options for monetizing your app:

### Option 1: One-Time Paid App
**Users pay once to download the app**
- ✅ Simple setup
- ✅ No subscription management needed
- ✅ One-time payment per user
- ❌ Lower initial conversion (users see price before downloading)
- **Best for**: Premium apps with complete feature set

### Option 2: Free App with In-App Purchases (IAP)
**App is free, but users pay for premium features/content**
- ✅ Higher download rate (free to download)
- ✅ Can offer freemium model (free basic + paid premium)
- ✅ Multiple purchase options (different tiers/features)
- ❌ More complex setup (need to implement IAP in code)
- ❌ Need to manage purchase states
- **Best for**: Apps with tiered features or content

### Option 3: Subscription Model
**Users pay monthly/yearly for ongoing access**
- ✅ Recurring revenue
- ✅ Can offer free trial
- ✅ Can provide ongoing updates/service
- ❌ Need to manage subscription lifecycle
- ❌ More complex setup
- **Best for**: Apps with ongoing service/value

---

## 🚀 Recommended Approach for QuitBet AI

Given that QuitBet AI is a recovery support app, I recommend:

**Option 2: Free with In-App Purchases (Freemium)**
- Free basic features (crisis support, basic tracking)
- Premium features via IAP (AI chat, advanced tracking, premium content)
- This allows users to try before they buy, which is important for health apps

**OR**

**Option 1: One-Time Paid App ($2.99 - $9.99)**
- Simple one-time payment
- All features included
- Good for users who prefer straightforward pricing

**Which do you prefer?** This will determine what capabilities you need to enable.

---

## ✅ Step-by-Step Setup

### If Choosing: One-Time Paid App

#### 1. Bundle ID Configuration
- ✅ **Push Notifications** (already selected)
- ❌ **In-App Purchase** - NOT needed (leave unchecked)
- Continue with registration

#### 2. App Store Connect Setup
After creating your app:
1. Go to **App Store** tab → **Pricing and Availability**
2. Select **Price Schedule**
3. Choose your price tier (e.g., $2.99, $4.99, $9.99)
4. Set availability (all countries or specific regions)
5. Save

#### 3. Build & Submit
- Build normally (no IAP code needed)
- Submit for review
- App will show as paid in App Store

---

### If Choosing: Free with In-App Purchases

#### 1. Bundle ID Configuration
- ✅ **Push Notifications** (already selected)
- ✅ **In-App Purchase** - MUST enable this!
- Continue with registration

#### 2. Configure In-App Purchases in App Store Connect
After creating your app:

1. Go to your app in App Store Connect
2. Click **Features** → **In-App Purchases**
3. Click **"+"** to create a new IAP
4. Choose IAP type:
   - **Consumable**: One-time purchase (e.g., credits, coins)
   - **Non-Consumable**: One-time purchase that unlocks permanently (e.g., "Remove Ads", "Premium Features")
   - **Auto-Renewable Subscription**: Recurring payment (monthly/yearly)
   - **Non-Renewing Subscription**: Manual renewal required

5. **Recommended for QuitBet AI:**
   - Create a **Non-Consumable** IAP called "Premium Features" or "Pro Upgrade"
   - Set price (e.g., $4.99, $9.99)
   - Configure what features it unlocks

6. Fill in IAP details:
   - **Reference Name**: Premium Features
   - **Product ID**: `com.quitbetai.app.premium` (must be unique)
   - **Price**: Select tier
   - **Display Name**: Premium Upgrade
   - **Description**: What premium features include

#### 3. Implement IAP in Your App Code
You'll need to add code to handle purchases:

```bash
npm install expo-in-app-purchases
```

Then implement purchase flow in your app to:
- Check if user has purchased premium
- Show purchase UI
- Handle purchase completion
- Unlock premium features

**This requires code changes!** Let me know if you want help implementing this.

---

### If Choosing: Subscription Model

#### 1. Bundle ID Configuration
- ✅ **Push Notifications** (already selected)
- ✅ **In-App Purchase** - MUST enable this!
- Continue with registration

#### 2. Configure Subscriptions in App Store Connect
Similar to IAP setup:
1. Go to **Features** → **In-App Purchases**
2. Create **Auto-Renewable Subscription**
3. Set up subscription group and tiers
4. Configure pricing (monthly/yearly)

#### 3. Implement Subscription Code
Same as IAP - requires code implementation.

---

## 💰 Recommended Pricing Tiers

For QuitBet AI recovery app:

### One-Time Purchase:
- **$4.99** - Good balance of value and accessibility
- **$9.99** - Premium pricing
- **$2.99** - More accessible, lower revenue per user

### In-App Purchase (Premium Upgrade):
- **$4.99** - Non-Consumable premium unlock
- **$9.99** - Higher tier premium

### Subscription:
- **$2.99/month** or **$24.99/year** - Monthly subscription
- **$4.99/month** or **$39.99/year** - Premium subscription

---

## ⚠️ Important Considerations

### For Paid Apps:
1. **Demo/Trial Account Required**: App Review will need to test the app
   - Create a test account for reviewers
   - Or offer a limited free trial if using IAP

2. **Payment Processing**:
   - Apple handles all payments (takes 30% commission, 15% after year 1 for subscriptions)
   - You receive payments via App Store Connect

3. **Tax Information**:
   - You'll need to provide tax information in App Store Connect
   - Go to **Agreements, Tax, and Banking** section

4. **Pricing Changes**:
   - Can change pricing at any time
   - Can offer limited-time promotions

---

## 📋 Quick Decision Guide

**Choose One-Time Paid App if:**
- ✅ You want simple setup
- ✅ All features are included
- ✅ One payment covers lifetime access

**Choose Free with IAP if:**
- ✅ You want more downloads (free to try)
- ✅ You want tiered features (basic vs premium)
- ✅ You're okay with more complex setup

**Choose Subscription if:**
- ✅ You provide ongoing service/value
- ✅ You want recurring revenue
- ✅ You regularly add new content/features

---

## 🎯 Next Steps

1. **Decide on payment model** (which option above?)
2. **Enable correct capabilities** in Bundle ID registration:
   - One-Time Paid: Only Push Notifications
   - IAP/Subscription: Push Notifications + In-App Purchase
3. **Set up pricing** in App Store Connect after creating app
4. **Implement purchase code** (if using IAP/Subscription)
5. **Test purchases** using sandbox accounts
6. **Submit for review**

---

## 🔗 Useful Links

- **App Store Connect Pricing**: https://appstoreconnect.apple.com
- **In-App Purchase Guide**: https://developer.apple.com/in-app-purchase/
- **Pricing Tiers**: https://developer.apple.com/app-store/pricing/
- **Expo IAP Docs**: https://docs.expo.dev/versions/latest/sdk/in-app-purchases/

---

**Need help implementing IAP code?** Let me know which payment model you choose and I can help with the implementation!

