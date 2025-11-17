# Backend Payment API Setup Guide

This guide explains how to set up the payment endpoints in your backend API.

## 📋 Overview

The backend API provides endpoints for:
- **Apple IAP verification** (iOS)
- **Stripe payment processing** (Android/Web)
- **Premium status checking**
- **Webhook handling** (Stripe subscriptions)

## 🚀 Setup Instructions

### Step 1: Install Dependencies

Dependencies are already installed:
- ✅ `stripe` - Stripe SDK for payment processing
- ✅ `axios` - For Apple receipt verification

### Step 2: Environment Variables

Add these to your `.env` file:

```env
# Stripe Configuration (for Android/Web)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Apple In-App Purchase Configuration (for iOS)
APPLE_SHARED_SECRET=your_apple_shared_secret_from_app_store_connect
APPLE_BUNDLE_ID=com.quitbetai.app
```

### Step 3: Get Stripe Keys

1. **Go to Stripe Dashboard**: https://dashboard.stripe.com
2. **Get API Keys**:
   - Go to Developers → API keys
   - Copy **Publishable key** (`pk_test_...`) → `STRIPE_PUBLISHABLE_KEY`
   - Copy **Secret key** (`sk_test_...`) → `STRIPE_SECRET_KEY`
3. **Get Webhook Secret**:
   - Go to Developers → Webhooks
   - Create endpoint: `https://your-api.com/api/payments/webhook`
   - Copy **Signing secret** (`whsec_...`) → `STRIPE_WEBHOOK_SECRET`

### Step 4: Get Apple Shared Secret

1. **Go to App Store Connect**: https://appstoreconnect.apple.com
2. **Navigate to**: Your App → App Store → In-App Purchases
3. **Click**: "App-Specific Shared Secret" (top right)
4. **Generate or copy** shared secret → `APPLE_SHARED_SECRET`

### Step 5: Database Schema

Add these fields to your `users` table:

```sql
ALTER TABLE users
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS premium_product_id TEXT,
ADD COLUMN IF NOT EXISTS premium_expires_at TIMESTAMPTZ;

-- Create purchases table for tracking purchases
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  product_id TEXT NOT NULL,
  transaction_id TEXT NOT NULL UNIQUE,
  platform TEXT NOT NULL, -- 'ios' or 'android' or 'web'
  receipt_data TEXT, -- For storing receipt data
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_transaction_id ON purchases(transaction_id);
```

### Step 6: Create Stripe Products

1. **Go to Stripe Dashboard**: https://dashboard.stripe.com/products
2. **Create Products**:
   - **Premium Monthly**: `premium_monthly` - $4.99/month (recurring)
   - **Premium Yearly**: `premium_yearly` - $39.99/year (recurring)
   - **Premium Lifetime**: `premium_lifetime` - $99.99 (one-time)

3. **Product IDs must match** the product IDs in `apps/mobile/lib/payments.ts`:
   ```typescript
   PREMIUM_MONTHLY: 'premium_monthly'
   PREMIUM_YEARLY: 'premium_yearly'
   PREMIUM_LIFETIME: 'premium_lifetime'
   ```

### Step 7: Configure Stripe Webhook

1. **Go to Stripe Dashboard**: https://dashboard.stripe.com/webhooks
2. **Add endpoint**: `https://your-api.com/api/payments/webhook`
3. **Select events**:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. **Copy webhook secret** → `STRIPE_WEBHOOK_SECRET`

## 📡 API Endpoints

### 1. Get Products (Public)
**GET** `/api/payments/products`

Returns available products for Stripe (Android/Web).

**Response:**
```json
{
  "success": true,
  "products": [
    {
      "productId": "premium_monthly",
      "title": "Premium Monthly",
      "description": "Unlock all premium features for one month",
      "price": "$4.99",
      "currencyCode": "USD",
      "type": "subscription"
    }
  ]
}
```

### 2. Create Payment Intent (Protected)
**POST** `/api/payments/create-intent`

Creates Stripe payment intent or checkout session.

**Headers:**
- `X-Session-ID: <session_id>` (required)

**Body:**
```json
{
  "productId": "premium_monthly"
}
```

**Response:**
```json
{
  "success": true,
  "clientSecret": "pi_xxx...",
  "intentId": "pi_xxx...",
  "checkoutUrl": "https://checkout.stripe.com/xxx"
}
```

### 3. Verify IAP Purchase (Protected)
**POST** `/api/payments/verify-iap`

Verifies Apple In-App Purchase receipt (iOS).

**Headers:**
- `X-Session-ID: <session_id>` (required)

**Body:**
```json
{
  "productId": "com.quitbetai.app.premium.monthly",
  "transactionId": "1000000123456789",
  "receipt": "base64_receipt_string",
  "platform": "ios"
}
```

**Response:**
```json
{
  "success": true,
  "verified": true
}
```

### 4. Get Premium Status (Protected)
**GET** `/api/payments/premium-status`

Checks user's premium subscription status.

**Headers:**
- `X-Session-ID: <session_id>` (required)

**Response:**
```json
{
  "success": true,
  "data": {
    "isPremium": true,
    "productId": "premium_monthly",
    "expiresAt": "2024-12-17T00:00:00Z"
  }
}
```

### 5. Get Subscription Status (Protected)
**GET** `/api/payments/subscription-status`

Checks user's Stripe subscription status (Android/Web).

**Headers:**
- `X-Session-ID: <session_id>` (required)

**Response:**
```json
{
  "success": true,
  "data": {
    "active": true,
    "productId": "premium_monthly"
  }
}
```

### 6. Stripe Webhook (Public - Stripe Signed)
**POST** `/api/payments/webhook`

Handles Stripe webhook events for subscription updates.

**Headers:**
- `stripe-signature: <signature>` (Stripe provides this)

**Note:** This endpoint uses raw body parsing (not JSON) to verify Stripe signatures.

## 🔒 Security Notes

1. **Never expose Stripe secret keys** in frontend code
2. **Always verify webhook signatures** (handled automatically)
3. **Verify Apple receipts** server-side (never trust client)
4. **Use HTTPS** for all payment endpoints
5. **Rate limit** payment endpoints to prevent abuse

## 🧪 Testing

### Testing Stripe (Test Mode)

1. **Use test keys**: `sk_test_...` and `pk_test_...`
2. **Use test cards**: `4242 4242 4242 4242` (success)
3. **Test webhooks** using Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3001/api/payments/webhook
   ```

### Testing Apple IAP

1. **Create sandbox test account** in App Store Connect
2. **Sign out** of App Store on test device
3. **Use sandbox account** when prompted
4. **Receipt verification** automatically uses sandbox URL when needed

## 📊 Database Queries

### Check Premium Users
```sql
SELECT id, email, is_premium, premium_product_id, premium_expires_at
FROM users
WHERE is_premium = true
AND (premium_expires_at IS NULL OR premium_expires_at > NOW());
```

### Get User Purchases
```sql
SELECT *
FROM purchases
WHERE user_id = '<user_id>'
ORDER BY created_at DESC;
```

## 🐛 Troubleshooting

### "Stripe is not configured"
- Check `STRIPE_SECRET_KEY` is set in `.env`
- Restart server after changing environment variables

### "Invalid receipt" (Apple)
- Check `APPLE_SHARED_SECRET` is correct
- Verify receipt is base64 encoded
- Test with sandbox URL if production fails

### "Webhook signature verification failed"
- Check `STRIPE_WEBHOOK_SECRET` is correct
- Ensure webhook endpoint uses raw body (configured in routes)
- Verify webhook URL in Stripe dashboard matches your API URL

### Premium status not updating
- Check database schema has required fields
- Verify webhook events are being received
- Check server logs for errors

## 📚 Next Steps

1. ✅ Set up environment variables
2. ✅ Configure Stripe products
3. ✅ Set up Apple shared secret
4. ✅ Update database schema
5. ✅ Configure webhooks
6. ✅ Test endpoints
7. ✅ Deploy to production

---

**Need help?** Check the main payment implementation guide in `apps/mobile/PAYMENT_IMPLEMENTATION_GUIDE.md`

