# Boba Club Stripe Setup Guide

## Overview

The Boba Club pricing page now supports 3 different subscription tiers, each with its own Stripe price ID:

1. **Lite Brew** - $1,500/month - Perfect for solo founders or startups
2. **Signature Blend** - $3,000/month (Most Popular) - Built for growing teams
3. **Taro Cloud** - $6,000/month - Full creative power, unlimited brands, and real-time collaboration

## Setup Steps

### 1. Create Products in Stripe Dashboard

You need to create 3 recurring products in your Stripe Dashboard:

#### For TEST Mode (Development):
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/products)
2. Switch to **Test mode** (toggle in top right)
3. Create 3 products with these details:

**Product 1: Lite Brew**
- Name: `Lite Brew`
- Description: `Perfect for solo founders or startups`
- Pricing: `$1,500/month` recurring
- Copy the **Price ID** (starts with `price_test_...`)

**Product 2: Signature Blend**
- Name: `Signature Blend`
- Description: `Our most popular — built for growing teams`
- Pricing: `$3,000/month` recurring
- Copy the **Price ID** (starts with `price_test_...`)

**Product 3: Taro Cloud**
- Name: `Taro Cloud`
- Description: `Full creative power, unlimited brands, and real-time collaboration`
- Pricing: `$6,000/month` recurring
- Copy the **Price ID** (starts with `price_test_...`)

#### For LIVE Mode (Production):
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/products)
2. Switch to **Live mode**
3. Create the same 3 products with live pricing
4. Copy the **Price IDs** (starts with `price_...`)

### 2. Update Environment Variables

#### Local Development (.env.local):

Replace the placeholder values in your `.env.local` file:

```env
# Replace these with your actual Stripe price IDs
NEXT_PUBLIC_STRIPE_LITE_BREW_PRICE_ID=price_test_your_lite_brew_id
NEXT_PUBLIC_STRIPE_SIGNATURE_BLEND_PRICE_ID=price_test_your_signature_blend_id
NEXT_PUBLIC_STRIPE_TARO_CLOUD_PRICE_ID=price_test_your_taro_cloud_id
```

#### Production (Vercel):

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add these 3 new variables:

```
NEXT_PUBLIC_STRIPE_LITE_BREW_PRICE_ID=price_your_lite_brew_id
NEXT_PUBLIC_STRIPE_SIGNATURE_BLEND_PRICE_ID=price_your_signature_blend_id
NEXT_PUBLIC_STRIPE_TARO_CLOUD_PRICE_ID=price_your_taro_cloud_id
```

4. Make sure to set them for **Production** environment
5. Redeploy your application for changes to take effect

## How It Works

### Code Implementation

The pricing component now passes the appropriate price ID for each tier:

**[BobaClubPricing.tsx](pixelboba/components/boba-club/BobaClubPricing.tsx:10-84)**
- Each tier object includes a `priceId` field
- Price IDs are loaded from environment variables
- When user clicks "Get Started", the price ID is passed to CheckoutButton

**[CheckoutButton.tsx](pixelboba/components/boba-club/CheckoutButton.tsx)**
- Accepts `priceId` prop
- Sends price ID to checkout API

**[Checkout API](pixelboba/app/api/boba-club/checkout/route.ts)**
- Receives price ID from request body
- Uses it to create Stripe checkout session
- Falls back to `STRIPE_BOBA_CLUB_PRICE_ID` if no price ID provided (backward compatibility)

### Testing

1. **Local Testing:**
   - Set TEST mode price IDs in `.env.local`
   - Run `npm run dev`
   - Visit `/boba-club`
   - Click "Get Started" on any tier
   - Should redirect to Stripe checkout with correct price

2. **Production Testing:**
   - Use Stripe TEST mode price IDs first
   - Once verified, update to LIVE mode price IDs
   - Test with Stripe test cards: https://stripe.com/docs/testing

## Important Notes

- All price IDs must be prefixed with `NEXT_PUBLIC_` to be accessible in client-side code
- Always test with TEST mode price IDs before using LIVE mode
- The old `STRIPE_BOBA_CLUB_PRICE_ID` environment variable is still supported as a fallback
- Make sure all 3 products are set to **recurring/subscription** billing in Stripe

## Troubleshooting

**Issue: "No price ID found" error**
- Check that environment variables are properly set
- Verify the price IDs start with `price_` (or `price_test_` for test mode)
- Restart your dev server after updating `.env.local`

**Issue: Redirects to wrong checkout**
- Verify you're using the correct price ID for each tier
- Check Stripe Dashboard to ensure products are active

**Issue: Environment variables not working in Vercel**
- Ensure variables are set for the correct environment (Production/Preview)
- Redeploy the application after adding variables
- Check Vercel deployment logs for any errors

## Next Steps

After completing this setup:
1. Create your 3 products in Stripe Dashboard
2. Update `.env.local` with test price IDs
3. Test locally to verify checkout works for all 3 tiers
4. Update Vercel environment variables with live price IDs
5. Deploy and test in production
