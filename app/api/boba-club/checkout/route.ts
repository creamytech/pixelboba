import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAdminSettings } from '@/lib/settings';

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user session (optional for checkout)
    const session = await getServerSession(authOptions);

    // Get request body for email if not authenticated
    const body = await request.json().catch(() => ({}));
    const { email, name, priceId } = body;

    // Determine user email and name
    const userEmail = session?.user?.email || email;
    const userName = session?.user?.name || name;
    const userId = session?.user?.id;

    if (!userEmail) {
      return NextResponse.json(
        { error: 'Email is required to start subscription' },
        { status: 400 }
      );
    }

    // Get Stripe configuration from settings
    const settings = await getAdminSettings();
    const stripeSecretKey = settings.payments.stripeSecretKey;
    const stripePublishableKey = settings.payments.stripePublishableKey;

    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: 'Stripe is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    // Get the base URL for redirect
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || request.headers.get('origin') || 'http://localhost:3000';

    // Initialize Stripe
    const stripe = (await import('stripe')).default;
    const stripeClient = new stripe(stripeSecretKey, {
      apiVersion: '2025-08-27.basil',
    });

    // Default Boba Club price ID from environment or use provided one
    const stripePriceId = priceId || process.env.STRIPE_BOBA_CLUB_PRICE_ID;

    if (!stripePriceId) {
      return NextResponse.json(
        { error: 'Boba Club subscription price not configured. Please contact support.' },
        { status: 500 }
      );
    }

    // Create or get Stripe customer
    let customer;
    const existingCustomers = await stripeClient.customers.list({
      email: userEmail,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripeClient.customers.create({
        email: userEmail,
        name: userName || undefined,
        metadata: {
          userId: userId || '',
        },
      });
    }

    // Create Stripe Checkout Session for subscription
    const checkoutSession = await stripeClient.checkout.sessions.create({
      customer: customer.id,
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${baseUrl}/boba-club/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/boba-club?checkout=cancelled`,
      metadata: {
        userId: userId || '',
        email: userEmail,
      },
      subscription_data: {
        metadata: {
          userId: userId || '',
          email: userEmail,
        },
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      // Collect phone number for new members
      phone_number_collection: {
        enabled: true,
      },
    });

    // Return the checkout session URL
    return NextResponse.json({
      url: checkoutSession.url,
      sessionId: checkoutSession.id,
    });
  } catch (error) {
    console.error('Boba Club checkout error:', error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
