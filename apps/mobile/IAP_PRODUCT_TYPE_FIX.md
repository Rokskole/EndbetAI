# Fix: Only Seeing Consumable/Non-Consumable Options

If you only see "Consumable" and "Non-Consumable" options, you're looking at the wrong place or need to access Subscriptions differently.

## 🎯 Solution

### Option 1: Subscriptions Are in a Different Location

**Auto-Renewable Subscriptions are NOT in the regular In-App Purchases section!**

They're in a **separate Subscriptions section**:

1. In App Store Connect → Your app (`QuitBet AI`)
2. Click **"Features"** tab (top navigation)
3. Look for **"Subscriptions"** (NOT "In-App Purchases")
4. Click **"Subscriptions"** in the left sidebar
5. You should see options for:
   - **Auto-Renewable Subscriptions** ← This is what you need!
   - **Non-Renewing Subscriptions**

**If you don't see "Subscriptions" option:**
- You might need to create a **Subscription Group** first
- Or your account might need the subscription feature enabled

---

### Option 2: Create Subscription Group First

**Before creating subscriptions, you need a Subscription Group:**

1. In App Store Connect → Your app → **"Features"** tab
2. Click **"Subscriptions"** (left sidebar)
3. Click **"+ Subscription Group"** (if you don't have one)
4. **Group Name**: `Premium Subscription`
5. Click **"Create"**
6. **Now** you can create Auto-Renewable Subscriptions in this group

---

### Option 3: Use Non-Consumable for Everything (Simpler Alternative)

**If subscriptions are too complex, you can use Non-Consumable for all products:**

This means:
- **Monthly**: Non-Consumable (user buys once, expires after 30 days via backend)
- **Yearly**: Non-Consumable (user buys once, expires after 365 days via backend)
- **Lifetime**: Non-Consumable (user buys once, never expires)

**How it works:**
- User purchases Non-Consumable product
- Your backend tracks expiration dates
- App checks backend for premium status
- Backend handles expiration logic

**Pros:**
- ✅ Simpler setup
- ✅ Works immediately
- ✅ No subscription group needed

**Cons:**
- ❌ User must manually purchase again when expires (no auto-renew)
- ❌ More work for user

---

## 🎯 Recommended Approach

### For Subscriptions (Better User Experience):

1. **First, create Subscription Group:**
   - Go to **"Features"** → **"Subscriptions"**
   - Click **"+ Subscription Group"**
   - Name: `Premium Subscription`
   - Create it

2. **Then create Auto-Renewable Subscriptions:**
   - In the subscription group, click **"+ Subscription"**
   - Select **"Auto-Renewable Subscription"**
   - Set duration (1 Month, 1 Year)
   - Configure pricing

3. **For Lifetime, use Non-Consumable:**
   - Go to **"Features"** → **"In-App Purchases"**
   - Click **"+"** → Select **"Non-Consumable"**

### For Non-Consumable Only (Simpler):

1. **Go to "Features"** → **"In-App Purchases"**
2. **Click "+"** → Select **"Non-Consumable"**
3. **Create all 3 products as Non-Consumable:**
   - Monthly (backend handles expiration)
   - Yearly (backend handles expiration)
   - Lifetime (no expiration)

---

## 📋 Where to Find Each Product Type

| Product Type | Location in App Store Connect |
|--------------|-------------------------------|
| **Auto-Renewable Subscription** | Features → Subscriptions → Create Group → Add Subscription |
| **Non-Renewing Subscription** | Features → Subscriptions |
| **Non-Consumable** | Features → In-App Purchases → "+" → Non-Consumable |
| **Consumable** | Features → In-App Purchases → "+" → Consumable |

---

## ✅ Quick Fix: What to Do Now

**If you want subscriptions (recommended):**

1. **Go to**: App Store Connect → Your app → **"Features"** tab
2. **Click**: **"Subscriptions"** (not "In-App Purchases")
3. **If no group exists**: Click **"+ Subscription Group"**
4. **Create group**: `Premium Subscription`
5. **In the group**: Click **"+ Subscription"** → Select **"Auto-Renewable Subscription"**

**If subscriptions are not available:**

1. **Go to**: App Store Connect → Your app → **"Features"** → **"In-App Purchases"**
2. **Click**: **"+"** → Select **"Non-Consumable"**
3. **Create all 3 products as Non-Consumable**
4. **Your backend will handle expiration** (we'll update the code)

---

## 🔄 Need to Update Code?

**If you choose Non-Consumable for everything**, we'll need to update your payment code slightly, but the backend already handles expiration dates, so it should work fine.

**Which do you want to do?**
1. **Try to find Subscriptions section** (better UX, auto-renewal)
2. **Use Non-Consumable for all** (simpler, manual renewal)

Let me know which option you prefer!

