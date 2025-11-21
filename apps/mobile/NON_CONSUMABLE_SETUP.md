# Using Non-Consumable IAP Products - Setup Guide

If you're only seeing "Consumable" and "Non-Consumable" options, that's fine! You can use **Non-Consumable** for all your products, and your backend will handle expiration dates.

## ✅ Recommended: Use Non-Consumable for All

**This works perfectly!** Here's how:

### How It Works:

1. **User purchases Non-Consumable product** (e.g., Monthly for $4.99)
2. **Backend receives purchase** and sets expiration date:
   - Monthly: Expires in 30 days
   - Yearly: Expires in 365 days
   - Lifetime: Never expires
3. **App checks backend** for premium status
4. **Backend checks expiration** and returns premium status
5. **User must purchase again** when expired (manual renewal)

**Pros:**
- ✅ Simpler setup (no subscription groups needed)
- ✅ Works immediately
- ✅ Backend handles expiration logic
- ✅ Same product IDs work fine

**Cons:**
- ❌ No auto-renewal (user must manually purchase again)
- ❌ More work for user when subscription expires

---

## 📋 Setup Steps

### Step 1: Create All Products as Non-Consumable

1. In App Store Connect → Your app → **"Features"** → **"In-App Purchases"**
2. Click **"+"** → Select **"Non-Consumable"**
3. Create all 3 products:

#### Product 1: Monthly (Non-Consumable)
- **Reference Name**: `Premium Monthly`
- **Product ID**: `com.quitbetai.app.premium.monthly` ← **Must match code!**
- **Price**: `$4.99` (Tier 5)
- **Display Name**: `Premium Monthly`
- **Description**: `Unlock all premium features for one month`

#### Product 2: Yearly (Non-Consumable)
- **Reference Name**: `Premium Yearly`
- **Product ID**: `com.quitbetai.app.premium.yearly` ← **Must match code!**
- **Price**: `$39.99` (Tier 20)
- **Display Name**: `Premium Yearly`
- **Description**: `Unlock all premium features for one year (Save 30%)`

#### Product 3: Lifetime (Non-Consumable)
- **Reference Name**: `Premium Lifetime`
- **Product ID**: `com.quitbetai.app.premium.lifetime` ← **Must match code!**
- **Price**: `$99.99` (Tier 50)
- **Display Name**: `Premium Lifetime`
- **Description**: `Unlock all premium features forever`

**✅ All products created as Non-Consumable!**

---

## 🔧 How Backend Handles Expiration

Your backend (`apps/api/src/modules/payments/controller.ts`) already handles this:

```typescript
// When user purchases Monthly
if (productId.includes('monthly')) {
  expiresAt = 30 days from now
}

// When user purchases Yearly
if (productId.includes('yearly')) {
  expiresAt = 365 days from now
}

// When user purchases Lifetime
if (productId.includes('lifetime')) {
  expiresAt = null  // Never expires
}
```

The app checks `premium_expires_at` from the backend and determines if user has premium.

---

## ✅ Product IDs

Your code already supports this! Product IDs stay the same:

```typescript
PRODUCT_IDS = {
  PREMIUM_MONTHLY: 'com.quitbetai.app.premium.monthly',
  PREMIUM_YEARLY: 'com.quitbetai.app.premium.yearly',
  PREMIUM_LIFETIME: 'com.quitbetai.app.premium.lifetime',
}
```

**No code changes needed!** ✅

---

## 📋 Checklist

- [ ] Create all 3 products as Non-Consumable
- [ ] Product IDs match code exactly
- [ ] Set prices ($4.99, $39.99, $99.99)
- [ ] Add display names and descriptions
- [ ] Submit products for review
- [ ] Backend handles expiration (already implemented) ✅

---

## 🎯 Next Steps

After creating products:
1. Submit products for review (Step 7)
2. Get Apple shared secret (Step 4)
3. Continue with remaining steps

**Everything else stays the same!** Your backend already handles expiration dates, so this works perfectly.

---

**Ready to proceed?** Create all 3 products as Non-Consumable and continue with the rest of the steps!

