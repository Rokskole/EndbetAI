# Payment Implementation Guide

This guide explains the payment system implementation for QuitBet AI, supporting both Apple In-App Purchase (iOS) and Stripe (Android/Web).

## 📋 Overview

The app uses a **unified payment service** that automatically selects the correct payment method based on the platform:

- **iOS**: Apple In-App Purchase (IAP) - Required by Apple
- **Android**: Stripe (via backend API) - Allows third-party processors
- **Web**: Stripe (via backend API) - Standard web payments

## 🏗️ Architecture

### Payment Service (`lib/payments.ts`)
- Unified interface for all platforms
- Automatically detects platform and uses appropriate payment method
- Handles purchase flow, verification, and restoration

### Premium Provider (`features/premium/PremiumProvider.tsx`)
- React context for premium status
- Manages subscription state across the app
- Automatically checks premium status on app start

### Components
- **PurchaseModal**: UI for displaying products and handling purchases
- **PremiumGate**: Component that gates premium features behind a paywall

## 🚀 Setup Instructions

### Step 1: Backend API Endpoints Required

Your backend API needs to implement these endpoints:

#### 1. Get Products (Android/Web)
```
GET /api/payments/products
Response: {
  products: [
    {
      productId: "premium_monthly",
      title: "Premium Monthly",
      description: "Unlock all premium features for one month",
      price: "$4.99",
      type: "subscription"
    },
    ...
  ]
}
```

#### 2. Create Payment Intent (Android/Web - Stripe)
```
POST /api/payments/create-intent
Body: {
  productId: "premium_monthly"
}
Response: {
  clientSecret: "pi_xxx...",
  intentId: "pi_xxx"
}
```

#### 3. Verify IAP Purchase (iOS)
```
POST /api/payments/verify-iap
Body: {
  productId: "com.quitbetai.app.premium.monthly",
  transactionId: "1000000123456789",
  receipt: "base64_receipt_string",
  platform: "ios"
}
Response: {
  success: true,
  verified: true
}
```

#### 4. Check Premium Status
```
GET /api/payments/premium-status
Headers: {
  "X-Session-ID": "user_session_id"
}
Response: {
  success: true,
  data: {
    isPremium: true,
    productId: "premium_monthly",
    expiresAt: "2024-12-17T00:00:00Z"
  }
}
```

#### 5. Subscription Status (Android/Web - Stripe)
```
GET /api/payments/subscription-status
Headers: {
  "X-Session-ID": "user_session_id"
}
Response: {
  success: true,
  data: {
    active: true,
    productId: "premium_monthly"
  }
}
```

### Step 2: Configure Product IDs

Update product IDs in `lib/payments.ts`:

```typescript
export const PRODUCT_IDS = {
  PREMIUM_MONTHLY: Platform.OS === 'ios' 
    ? 'com.quitbetai.app.premium.monthly'  // Must match App Store Connect
    : 'premium_monthly',                    // Must match Stripe
  PREMIUM_YEARLY: Platform.OS === 'ios'
    ? 'com.quitbetai.app.premium.yearly'
    : 'premium_yearly',
  PREMIUM_LIFETIME: Platform.OS === 'ios'
    ? 'com.quitbetai.app.premium.lifetime'
    : 'premium_lifetime',
};
```

### Step 3: Configure App Store Connect (iOS)

1. **Create In-App Purchase Products:**
   - Go to App Store Connect → Your App → Features → In-App Purchases
   - Click "+" to create new IAP
   - Product IDs must match `PRODUCT_IDS` in code
   - Configure pricing and descriptions

2. **Product Types:**
   - **Auto-Renewable Subscription**: For monthly/yearly (recommended)
   - **Non-Consumable**: For lifetime purchase

3. **Required Info:**
   - Reference Name
   - Product ID (must match code)
   - Price Tier
   - Display Name
   - Description

### Step 4: Configure Stripe (Android/Web)

1. **Create Stripe Products:**
   - Go to Stripe Dashboard → Products
   - Create products matching product IDs
   - Set up pricing (subscription or one-time)

2. **Configure Webhooks:**
   - Set up webhook endpoint on your backend
   - Listen for: `checkout.session.completed`, `customer.subscription.updated`

3. **Store Subscription Status:**
   - When payment succeeds, store subscription in your database
   - Link subscription to user account
   - Update premium status when webhook events occur

### Step 5: Using Premium Features in Your App

#### Option 1: Using PremiumGate Component
```tsx
import { PremiumGate } from '@/components/PremiumGate';

function MyFeature() {
  return (
    <PremiumGate featureName="AI Chat">
      <AIChatComponent />
    </PremiumGate>
  );
}
```

#### Option 2: Using usePremium Hook
```tsx
import { usePremium } from '@/features/premium/PremiumProvider';

function MyFeature() {
  const { isPremium, isLoading } = usePremium();

  if (isLoading) return <Loading />;
  if (!isPremium) return <UpgradePrompt />;

  return <PremiumContent />;
}
```

#### Option 3: Opening Purchase Modal
```tsx
import { useState } from 'react';
import { PurchaseModal } from '@/components/PurchaseModal';

function Settings() {
  const [showPurchase, setShowPurchase] = useState(false);

  return (
    <>
      <Button onPress={() => setShowPurchase(true)}>
        Upgrade to Premium
      </Button>
      <PurchaseModal
        visible={showPurchase}
        onDismiss={() => setShowPurchase(false)}
      />
    </>
  );
}
```

## 🧪 Testing

### iOS Testing (IAP)

1. **Sandbox Testing:**
   - Create sandbox test account in App Store Connect
   - Sign out of App Store on test device
   - Use sandbox account when prompted

2. **Test Purchases:**
   - All purchases are free in sandbox
   - Test different scenarios (success, cancel, restore)

### Android/Web Testing (Stripe)

1. **Stripe Test Mode:**
   - Use Stripe test API keys
   - Use test card numbers: `4242 4242 4242 4242`
   - Test different card scenarios

2. **Backend Testing:**
   - Verify webhook events are received
   - Test subscription status checking
   - Test purchase verification

## 📝 Product ID Requirements

### iOS (App Store Connect)
- Format: `com.quitbetai.app.premium.monthly`
- Must match exactly in code and App Store Connect
- Cannot be changed after first submission

### Android/Web (Stripe)
- Format: `premium_monthly` (simpler, can be changed)
- Must match Stripe product IDs
- Can be updated anytime

## ⚠️ Important Notes

### iOS Specific:
1. **Apple's 30% Commission**: Apple takes 30% of revenue (15% after year 1 for subscriptions)
2. **IAP Required**: Cannot use Stripe for digital content on iOS
3. **Review Process**: IAP products must be approved by Apple
4. **Sandbox Testing**: Use sandbox accounts, not real purchases

### Android/Web Specific:
1. **Stripe Setup**: Requires backend API integration
2. **Webhook Events**: Must handle subscription events properly
3. **Payment Security**: Never expose Stripe secret keys in app
4. **Testing**: Use Stripe test mode before production

## 🔧 Troubleshooting

### Common Issues:

1. **"Product not found" error**
   - Check product IDs match exactly
   - Ensure products are configured in App Store Connect/Stripe
   - Products must be approved (iOS) before they appear

2. **"Purchase verification failed"**
   - Check backend API endpoint is working
   - Verify receipt/transaction ID is being sent correctly
   - Check backend logs for errors

3. **Premium status not updating**
   - Check backend premium status endpoint
   - Verify session ID is being sent
   - Refresh premium status manually: `refreshPremiumStatus()`

4. **Restore purchases not working**
   - Ensure user is signed into correct Apple ID (iOS)
   - Check purchase history exists
   - Verify backend can verify restored purchases

## 📚 Additional Resources

- **Apple IAP Docs**: https://developer.apple.com/in-app-purchase/
- **Expo IAP Docs**: https://docs.expo.dev/versions/latest/sdk/in-app-purchases/
- **Stripe Docs**: https://stripe.com/docs
- **App Store Guidelines**: https://developer.apple.com/app-store/review/guidelines/

---

**Need help?** Check the implementation in `lib/payments.ts` and the examples in components.

