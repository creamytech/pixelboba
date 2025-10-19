# Stripe Boba Club Setup Guide

## Issue
You're seeing: **"No such price: 'price_1SJgSJFyD6VfNTiLOxZNA4yV'"**

## Root Cause
You're using **Stripe TEST keys** but the price ID might be from **LIVE mode** or doesn't exist in test mode.

## Solution

### Step 1: Verify Your Stripe Mode
Your current setup in `.env.local`:
- `STRIPE_SECRET_KEY=sk_test_...` ← **TEST MODE**
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...` ← **TEST MODE**

Since you're using test keys, you need a **test price ID**.

### Step 2: Create or Find Test Price in Stripe Dashboard

#### Option A: Using Existing Price (if it's already in test mode)
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test)
2. Make sure you're in **TEST MODE** (toggle in top right)
3. Navigate to: **Products** → Find "Boba Club" product
4. Click on the product → Copy the **Price ID** under the pricing section
5. It should start with `price_` and look like: `price_1ABC123xyz...`

#### Option B: Create New Test Product & Price
1. Go to [Stripe Dashboard TEST MODE](https://dashboard.stripe.com/test)
2. Click **Products** → **+ Add product**
3. Product details:
   - **Name**: `Boba Club Membership`
   - **Description**: `Monthly subscription to Pixel Boba's exclusive Boba Club`
4. Pricing:
   - **Pricing model**: Standard pricing
   - **Price**: `$15.00` (or your desired amount)
   - **Billing period**: Recurring → Monthly
   - **Payment type**: Subscription
5. Click **Save product**
6. Copy the **Price ID** (starts with `price_`)

### Step 3: Update Environment Variable

Update your `pixelboba/.env.local` file:

```bash
STRIPE_BOBA_CLUB_PRICE_ID=price_YOUR_TEST_PRICE_ID_HERE
```

**Important**: This price ID must be from **TEST MODE** since you're using test keys!

### Step 4: Restart Development Server

```bash
cd pixelboba
npm run dev
```

The server needs to restart to pick up the new environment variable.

### Step 5: Test the Checkout Flow

1. Visit `http://localhost:3000/boba-club`
2. Click **"Join Boba Club"**
3. You should be redirected to Stripe Checkout
4. Use test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC
   - Any valid ZIP code

---

## Production Setup (When Ready)

When you're ready to go live:

### 1. Get Live Stripe Keys
1. Switch Stripe Dashboard to **LIVE MODE**
2. Go to **Developers** → **API keys**
3. Copy your **Live** keys (start with `pk_live_` and `sk_live_`)

### 2. Create Live Price
1. In **LIVE MODE**, create the same product
2. Copy the **live** price ID

### 3. Update Production Environment Variables
Update your Vercel/production environment variables:
```bash
STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_KEY
STRIPE_BOBA_CLUB_PRICE_ID=price_YOUR_LIVE_PRICE_ID
```

---

## Quick Verification Checklist

- [ ] Stripe Dashboard is in **TEST MODE**
- [ ] Using **test keys** (`sk_test_...` and `pk_test_...`)
- [ ] Price ID is from **TEST MODE** (verify it exists in test products)
- [ ] `STRIPE_BOBA_CLUB_PRICE_ID` is set in `.env.local`
- [ ] Development server restarted after adding env var
- [ ] Test checkout with card `4242 4242 4242 4242`

---

## Common Errors

### "No such price"
→ Price ID doesn't exist in the Stripe account/mode you're using
→ **Solution**: Verify price exists in TEST mode dashboard

### "Invalid API Key"
→ Using wrong key format or key from different account
→ **Solution**: Copy fresh keys from Stripe Dashboard → Developers → API keys

### "Stripe is not configured"
→ Environment variables not loaded
→ **Solution**: Restart dev server, check `.env.local` file

---

## Need Help?

1. Check Stripe Dashboard logs: [https://dashboard.stripe.com/test/logs](https://dashboard.stripe.com/test/logs)
2. Verify your price exists: [https://dashboard.stripe.com/test/products](https://dashboard.stripe.com/test/products)
3. Check API keys: [https://dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)
