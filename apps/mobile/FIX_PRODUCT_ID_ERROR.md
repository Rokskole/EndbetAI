# Fix: Product ID Already Used Error

If you see "The Product ID you entered is already being used by another in-app purchase associated with this team," this means you previously created a product with this ID and deleted it.

## ⚠️ Important: Product IDs Can't Be Reused

**Once a Product ID is used (even if deleted), it cannot be reused by your team.**

This is an Apple limitation - Product IDs are permanently reserved, even after deletion.

---

## ✅ Solution: Use a Different Product ID

You have two options:

### **Option 1: Use a Slightly Different Product ID (Recommended)**

**Update the Product ID to something new:**

Instead of:
- `com.quitbetai.app.premium.monthly` ❌ (already used)

Use:
- `com.quitbetai.app.premium.monthly.v1` ✅ (new)
- OR `com.quitbetai.app.premium.monthly.subscription` ✅ (new)
- OR `com.quitbetai.app.premium.monthly.sub` ✅ (new)

**Then update your code** to match the new Product ID.

---

### **Option 2: Check if Product Still Exists**

**Sometimes products aren't fully deleted:**

1. In App Store Connect → Your app → **"Features"** → **"In-App Purchases"**
2. Look for the product in the list (check all statuses)
3. If you find it, you can edit it instead of creating a new one

---

## 🔧 Quick Fix Steps

### **Step 1: Choose New Product ID**

**Recommended new Product IDs:**

- Monthly: `com.quitbetai.app.premium.monthly.v1`
- Yearly: `com.quitbetai.app.premium.yearly.v1`
- Lifetime: `com.quitbetai.app.premium.lifetime.v1`

### **Step 2: Update Code**

**Update `apps/mobile/lib/payments.ts`:**

```typescript
export const PRODUCT_IDS = {
  PREMIUM_MONTHLY: Platform.OS === 'ios' 
    ? 'com.quitbetai.app.premium.monthly.v1'  // ← Changed!
    : 'premium_monthly',
  PREMIUM_YEARLY: Platform.OS === 'ios'
    ? 'com.quitbetai.app.premium.yearly.v1'   // ← Changed!
    : 'premium_yearly',
  PREMIUM_LIFETIME: Platform.OS === 'ios'
    ? 'com.quitbetai.app.premium.lifetime.v1' // ← Changed!
    : 'premium_lifetime',
};
```

### **Step 3: Create Product with New ID**

1. In App Store Connect, use the **new Product ID** (e.g., `com.quitbetai.app.premium.monthly.v1`)
2. Fill in all other fields
3. Click **"Create"**

---

## 📋 Alternative Product ID Options

**You can use any of these formats:**

| Option | Example |
|--------|---------|
| Add `.v1` | `com.quitbetai.app.premium.monthly.v1` |
| Add `.sub` | `com.quitbetai.app.premium.monthly.sub` |
| Add `.subscription` | `com.quitbetai.app.premium.monthly.subscription` |
| Add `.pro` | `com.quitbetai.app.premium.monthly.pro` |
| Use different name | `com.quitbetai.app.monthly.premium` |
| Use numbers | `com.quitbetai.app.premium.monthly.001` |

**As long as it's unique and matches your code, it will work!**

---

## ⚠️ Important Notes

1. **Product IDs cannot be changed** after creation
2. **Product IDs are permanent** (even after deletion)
3. **Must update code** to match new Product ID
4. **Test thoroughly** after changing Product ID

---

## 🎯 Recommended Action

**Use Product IDs with `.v1` suffix:**

1. Monthly: `com.quitbetai.app.premium.monthly.v1`
2. Yearly: `com.quitbetai.app.premium.yearly.v1`
3. Lifetime: `com.quitbetai.app.premium.lifetime.v1`

**This makes it clear these are version 1 products.**

---

## 🔧 Need Help Updating Code?

Let me know which Product IDs you want to use, and I'll update your code automatically!

