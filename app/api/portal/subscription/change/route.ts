import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getAdminSettings } from '@/lib/settings';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'CLIENT') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { newPriceId } = body;

    if (!newPriceId) {
      return NextResponse.json({ error: 'New price ID is required' }, { status: 400 });
    }

    // Get user's subscription
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });

    if (!subscription) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 404 });
    }

    // Get Stripe configuration
    let stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      const settings = await getAdminSettings();
      stripeSecretKey = settings.payments.stripeSecretKey;
    }

    if (!stripeSecretKey) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
    }

    // Initialize Stripe
    const stripe = (await import('stripe')).default;
    const stripeClient = new stripe(stripeSecretKey, {
      apiVersion: '2025-08-27.basil',
    });

    // First retrieve the subscription to get the subscription item ID
    const currentSubscription = await stripeClient.subscriptions.retrieve(
      subscription.stripeSubscriptionId
    );

    // Update the subscription in Stripe
    await stripeClient.subscriptions.update(subscription.stripeSubscriptionId, {
      items: [
        {
          id: currentSubscription.items.data[0].id,
          price: newPriceId,
        },
      ],
      proration_behavior: 'create_prorations', // Prorate the price change
    });

    // Update subscription in database - just update the price ID
    // The period dates will be updated via webhook
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        stripePriceId: newPriceId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Change subscription error:', error);
    return NextResponse.json({ error: 'Failed to change subscription' }, { status: 500 });
  }
}
