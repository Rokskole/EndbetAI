# Your Next Steps - Action Plan

This is your prioritized action plan for getting your app on the App Store.

## ✅ What You've Already Done

- ✅ App configuration updated (app.json)
- ✅ EAS set up and logged in
- ✅ EAS project initialized
- ✅ App tested locally (works in Expo Go)
- ✅ TypeScript errors fixed
- ✅ Apple Developer account obtained
- ✅ Payment system implemented (IAP + Stripe)
- ✅ Backend payment endpoints created

---

## 🎯 What To Do Next (In Order)

### **STEP 1: Register Bundle ID with In-App Purchase** ⏰ 5 minutes

**Right now - do this first:**

1. Go to: https://developer.apple.com/account/resources/identifiers/list
2. Click **"+"** button (top left)
3. Select **"App IDs"** → Click **"Continue"**
4. Fill in:
   - **Description**: `QuitBet AI`
   - **Bundle ID**: Select **"Explicit"**
   - **Bundle ID**: Enter `com.quitbetai.app`
   - Click **"Continue"**
5. **Check capabilities:**
   - ✅ **Push Notifications** (you use expo-notifications)
   - ✅ **In-App Purchase** ← **MUST CHECK THIS!**
   - ❌ Leave others unchecked
   - Click **"Continue"**
6. Review → Click **"Register"**

**✅ Step 1 Complete!** Bundle ID registered with IAP capability.

---

### **STEP 2: Create App in App Store Connect** ⏰ 2 minutes

**After Step 1 is done:**

1. Go to: https://appstoreconnect.apple.com
2. Click **"Apps"** (in the icon grid)
3. Click **"+"** → **"New App"**
4. Fill in:
   - **Platform**: Check **iOS** ✅
   - **Name**: `QuitBet AI`
   - **Primary Language**: `English (U.S.)`
   - **Bundle ID**: Select `com.quitbetai.app` (from Step 1)
   - **SKU**: `quitbet-ai-001`
   - **User Access**: **Full Access**
5. Click **"Create"**

**✅ Step 2 Complete!** App created in App Store Connect.

---

### **STEP 3: Create IAP Products** ⏰ 10 minutes

**After Step 2 is done:**

1. In App Store Connect → Your app (`QuitBet AI`)
2. Click **"Features"** tab → **"In-App Purchases"**
3. Click **"+"** to create products

**Create 3 products:**

#### Product 1: Monthly Subscription
- Click **"+"** → Select **"Auto-Renewable Subscription"** → **"Create"**
- **Reference Name**: `Premium Monthly`
- **Product ID**: `com.quitbetai.app.premium.monthly` ← **Must match exactly!**
- **Subscription Group**: Create new `Premium Subscription`
- **Duration**: `1 Month`
- **Price**: `$4.99` (Tier 5)
- **Display Name**: `Premium Monthly`
- **Description**: `Unlock all premium features for one month`
- Click **"Save"**

#### Product 2: Yearly Subscription
- Click **"+"** → Select **"Auto-Renewable Subscription"** → **"Create"**
- **Reference Name**: `Premium Yearly`
- **Product ID**: `com.quitbetai.app.premium.yearly` ← **Must match exactly!**
- **Subscription Group**: Same `Premium Subscription`
- **Duration**: `1 Year`
- **Price**: `$39.99` (Tier 20)
- **Display Name**: `Premium Yearly`
- **Description**: `Unlock all premium features for one year (Save 30%)`
- Click **"Save"**

#### Product 3: Lifetime Purchase
- Click **"+"** → Select **"Non-Consumable"** → **"Create"**
- **Reference Name**: `Premium Lifetime`
- **Product ID**: `com.quitbetai.app.premium.lifetime` ← **Must match exactly!**
- **Price**: `$99.99` (Tier 50)
- **Display Name**: `Premium Lifetime`
- **Description**: `Unlock all premium features forever`
- Click **"Save"**

**✅ Step 3 Complete!** All IAP products created.

**⚠️ IMPORTANT:** Double-check Product IDs match your code:
- `com.quitbetai.app.premium.monthly`
- `com.quitbetai.app.premium.yearly`
- `com.quitbetai.app.premium.lifetime`

---

### **STEP 4: Get Apple Shared Secret** ⏰ 2 minutes

**After Step 3 is done:**

1. In App Store Connect → Your app → **"App Store"** tab
2. Click **"In-App Purchases"** section (left sidebar)
3. Scroll down to **"App-Specific Shared Secret"**
4. Click **"Generate"** or **"View"**
5. **Copy the shared secret** (looks like: `a1b2c3d4e5f6...`)

**✅ Step 4 Complete!** Shared secret obtained.

---

### **STEP 5: Configure Backend Environment Variables** ⏰ 3 minutes

**After Step 4 is done:**

1. Open `apps/api/.env` (create it if it doesn't exist)
2. Add these lines:
   ```env
   # Apple In-App Purchase Configuration
   APPLE_SHARED_SECRET=your_shared_secret_from_step_4
   APPLE_BUNDLE_ID=com.quitbetai.app
   
   # Stripe Configuration (for Android/Web - set up later)
   STRIPE_SECRET_KEY=sk_test_your_stripe_key
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   ```
3. Replace `your_shared_secret_from_step_4` with the actual secret you copied
4. Save the file

**✅ Step 5 Complete!** Backend configured for Apple IAP.

---

### **STEP 6: Update Database Schema** ⏰ 5 minutes

**After Step 5 is done:**

Run this SQL in your Supabase SQL editor or PostgreSQL database:

```sql
-- Add premium fields to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS premium_product_id TEXT,
ADD COLUMN IF NOT EXISTS premium_expires_at TIMESTAMPTZ;

-- Create purchases table
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  transaction_id TEXT NOT NULL UNIQUE,
  platform TEXT NOT NULL CHECK (platform IN ('ios', 'android', 'web')),
  receipt_data TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_transaction_id ON purchases(transaction_id);
CREATE INDEX IF NOT EXISTS idx_users_is_premium ON users(is_premium);
```

**✅ Step 6 Complete!** Database schema updated.

---

### **STEP 7: Submit IAP Products for Review** ⏰ 2 minutes

**After Step 6 is done:**

1. In App Store Connect → Your app → **"Features"** → **"In-App Purchases"**
2. For each product (Monthly, Yearly, Lifetime):
   - Click on the product
   - Click **"Submit for Review"** (top right)
   - Confirm submission

**Note:** Review takes **1-2 days**. Products won't be purchasable until approved.

**✅ Step 7 Complete!** Products submitted for review.

---

### **STEP 8: Create Sandbox Test Account** ⏰ 2 minutes

**While waiting for product approval:**

1. In App Store Connect → **"Users and Access"** (top navigation)
2. Click **"Sandbox Testers"** tab
3. Click **"+"** button
4. Fill in:
   - **First Name**: `Test`
   - **Last Name**: `User`
   - **Email**: Use a unique email (e.g., `test-quitbet-[random]@example.com`)
   - **Password**: Create a password
   - **Country/Region**: Your region
5. Click **"Invite"**

**Note:** You'll receive an email to confirm (check spam if needed).

**✅ Step 8 Complete!** Sandbox test account created.

---

### **STEP 9: Build Your App** ⏰ 15-20 minutes

**After products are created (can do while waiting for approval):**

1. Open terminal:
   ```powershell
   cd C:\EndbetAI\apps\mobile
   ```

2. Build for iOS:
   ```powershell
   eas build --platform ios --profile production
   ```

3. **What happens:**
   - EAS will ask about credentials (let it create them automatically)
   - Build will take 10-20 minutes
   - Build will automatically upload to TestFlight
   - You'll receive an email when build completes

**✅ Step 9 Complete!** App built and uploaded to TestFlight.

---

### **STEP 10: Test IAP Purchases** ⏰ 5 minutes

**After build completes and products are approved:**

1. **Install TestFlight** on your iPhone (if not already installed)
2. **Accept TestFlight invite** (sent automatically)
3. **Install your app** from TestFlight
4. **Sign out** of App Store on your test device:
   - Settings → App Store → Sign Out
5. **Open your app** on test device
6. **Navigate to purchase/premium screen**
7. **Click "Upgrade to Premium"** or purchase button
8. **Select a product** (Monthly, Yearly, or Lifetime)
9. **When prompted to sign in**: Use **sandbox test account** you created
10. **Confirm purchase** (it's free in sandbox)
11. **Verify** purchase completes and premium features unlock

**✅ Step 10 Complete!** IAP tested successfully.

---

### **STEP 11: Prepare App Store Assets** ⏰ 30 minutes

**While waiting for product approval:**

1. **Take screenshots:**
   - iPhone 6.7" (1290 x 2796 pixels) - **REQUIRED** (minimum 1)
   - Take 3-5 screenshots showing key features
   - Use iPhone simulator or real device

2. **Host Privacy Policy:**
   - Update `PRIVACY_POLICY.md` with real info:
     - Replace `[Date]` with actual date
     - Replace `[your-email@example.com]` with your email
     - Replace `[your-website.com]` with your website
   - Host it publicly (GitHub Pages, Vercel, Netlify, etc.)
   - Get the public URL

3. **Verify app icon:**
   - Already verified ✅ (1024x1024 PNG)

**✅ Step 11 Complete!** Assets prepared.

---

### **STEP 12: Complete App Store Listing** ⏰ 15 minutes

**After assets are ready:**

1. In App Store Connect → Your app → **"App Store"** tab
2. Click **"+ Version or Platform"** → Select **iOS**
3. Fill in app information (see `APP_STORE_LISTING.md`):
   - **Name**: `QuitBet AI`
   - **Subtitle**: `Your compassionate companion for gambling recovery`
   - **Description**: Copy from `APP_STORE_LISTING.md`
   - **Keywords**: Copy from `APP_STORE_LISTING.md`
   - **Support URL**: Your website support page (required)
   - **Privacy Policy URL**: Your hosted privacy policy URL (required)
   - **Category**: Health & Fitness (Primary), Lifestyle (Secondary)
   - **Age Rating**: Complete questionnaire (expect 17+)

4. **Upload screenshots:**
   - iPhone 6.7" Display (1290 x 2796 pixels) - Upload at least 1

5. **Upload app icon:**
   - Use `apps/mobile/assets/icon.png` (1024x1024)

6. **App Review Information:**
   - Demo account (if app requires login)
   - Contact information
   - Review notes (see `APP_STORE_LISTING.md`)

**✅ Step 12 Complete!** App Store listing completed.

---

### **STEP 13: Link Build and Submit for Review** ⏰ 5 minutes

**After listing is complete and build is ready:**

1. In App Store Connect → Your app version → **"Build"** section
2. **Select the build** you uploaded (from Step 9)
3. If build doesn't appear, wait a few minutes and refresh
4. **Review all information:**
   - Check app information is complete
   - Verify screenshots are uploaded
   - Confirm privacy policy URL works
   - Ensure all required fields are filled
5. **Click "Submit for Review"** (top right)
6. **Confirm submission**

**✅ Step 13 Complete!** App submitted for review!

---

### **STEP 14: Wait for Review** ⏰ 1-3 days

**What happens:**
- Apple reviews your app (typically 1-3 days)
- You'll receive email updates
- Check App Store Connect for status

**If approved:**
- 🎉 Your app goes live!
- Usually available within 24 hours of approval

**If rejected:**
- Review rejection feedback
- Fix issues
- Resubmit for review

**✅ Step 14 Complete!** App approved and live! 🚀

---

## 📋 Complete Checklist

### Immediate (Do Now):
- [ ] **Step 1**: Register Bundle ID with In-App Purchase capability
- [ ] **Step 2**: Create app in App Store Connect
- [ ] **Step 3**: Create 3 IAP products (monthly, yearly, lifetime)
- [ ] **Step 4**: Get Apple shared secret
- [ ] **Step 5**: Configure backend environment variables
- [ ] **Step 6**: Update database schema
- [ ] **Step 7**: Submit IAP products for review

### While Waiting (Can Do Anytime):
- [ ] **Step 8**: Create sandbox test account
- [ ] **Step 11**: Take screenshots and host privacy policy
- [ ] **Step 12**: Complete App Store listing

### After Products Approved:
- [ ] **Step 9**: Build your app
- [ ] **Step 10**: Test IAP purchases

### Final Step:
- [ ] **Step 13**: Link build and submit for review
- [ ] **Step 14**: Wait for approval

---

## ⏰ Estimated Timeline

- **Steps 1-7**: ~30 minutes (can do today)
- **Product Approval**: 1-2 days (wait time)
- **Steps 8-12**: ~1 hour (can do while waiting)
- **Step 9-10**: ~30 minutes (after approval)
- **Step 13**: ~5 minutes
- **App Review**: 1-3 days (wait time)
- **Total**: ~2-5 days from start to App Store

---

## 🎯 Priority Order

**Do these first (today):**
1. ✅ Step 1: Register Bundle ID
2. ✅ Step 2: Create app
3. ✅ Step 3: Create IAP products
4. ✅ Step 4: Get shared secret
5. ✅ Step 5: Configure backend
6. ✅ Step 6: Update database
7. ✅ Step 7: Submit products

**While waiting (today/tomorrow):**
8. ✅ Step 8: Create sandbox account
9. ✅ Step 11: Prepare assets
10. ✅ Step 12: Complete listing

**After approval (in 1-2 days):**
11. ✅ Step 9: Build app
12. ✅ Step 10: Test IAP
13. ✅ Step 13: Submit for review

**Final (in 1-3 days):**
14. ✅ Step 14: Wait for App Store approval

---

## 🚀 Quick Start

**Right now, do this:**

1. **Open**: https://developer.apple.com/account/resources/identifiers/list
2. **Click**: "+" → "App IDs"
3. **Register**: Bundle ID `com.quitbetai.app` with **In-App Purchase** capability

**Then continue with Steps 2-7 above.**

---

## 📚 Reference Documents

- **Full IAP Setup**: `APPLE_IAP_SETUP_STEP_BY_STEP.md`
- **App Store Listing**: `APP_STORE_LISTING.md`
- **Backend Setup**: `apps/api/BACKEND_PAYMENT_SETUP.md`
- **Payment Implementation**: `PAYMENT_IMPLEMENTATION_GUIDE.md`

---

## 🆘 Need Help?

**If stuck on any step:**
- Check the detailed guide: `APPLE_IAP_SETUP_STEP_BY_STEP.md`
- Check troubleshooting section
- See documentation files above

**Common issues:**
- "No + button" → Click "Identifiers" first, then you'll see the + button
- "Product not found" → Wait a few hours after creating, or check Product ID matches exactly
- "Purchase failed" → Make sure products are approved and you're using sandbox account

---

**Ready? Start with Step 1!** 🚀

Good luck! 🎉

