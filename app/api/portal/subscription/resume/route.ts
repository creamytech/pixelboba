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

    // Get user's subscription
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });

    if (!subscription) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 404 });
    }

    if (!subscription.cancelAtPeriodEnd) {
      return NextResponse.json({ error: 'Subscription is not set to cancel' }, { status: 400 });
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

    // Resume subscription in Stripe (remove cancel_at_period_end)
    await stripeClient.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: false,
    });

    // Update subscription in database
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        cancelAtPeriodEnd: false,
        canceledAt: null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Resume subscription error:', error);
    return NextResponse.json({ error: 'Failed to resume subscription' }, { status: 500 });
  }
}
