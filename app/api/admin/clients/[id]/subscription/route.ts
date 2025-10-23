import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

// GET /api/admin/clients/[id]/subscription - Get client subscription
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: clientId } = await params;
  const subscription = await prisma.subscription.findUnique({
    where: { userId: clientId },
  });

  return NextResponse.json(subscription);
}

// POST /api/admin/clients/[id]/subscription - Grant subscription to client
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: clientId } = await params;
    const body = await request.json();
    const { priceId } = body;

    if (!priceId) {
      return NextResponse.json({ error: 'Price ID is required' }, { status: 400 });
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { id: clientId },
      include: { subscription: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let stripeCustomerId = user.subscription?.stripeCustomerId;

    // Create Stripe customer if doesn't exist
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email || undefined,
        name: user.name || undefined,
        metadata: {
          userId: user.id,
        },
      });
      stripeCustomerId = customer.id;
    }

    // If user already has a subscription, cancel it first
    if (user.subscription?.stripeSubscriptionId) {
      try {
        await stripe.subscriptions.cancel(user.subscription.stripeSubscriptionId);
      } catch (error) {
        console.error('Error canceling existing subscription:', error);
        // Continue even if cancel fails (subscription might already be canceled)
      }
    }

    // Create new subscription in Stripe
    const stripeSubscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      metadata: {
        userId: user.id,
        grantedByAdmin: 'true',
      },
    });

    // Create or update subscription in database
    const subscription = await prisma.subscription.upsert({
      where: { userId: clientId },
      create: {
        userId: clientId,
        stripeCustomerId,
        stripeSubscriptionId: stripeSubscription.id,
        stripePriceId: priceId,
        status: 'ACTIVE', // Admin-granted subscriptions are immediately active
        currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
        cancelAtPeriodEnd: false,
      },
      update: {
        stripeSubscriptionId: stripeSubscription.id,
        stripePriceId: priceId,
        status: 'ACTIVE',
        currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
        cancelAtPeriodEnd: false,
        canceledAt: null,
        pausedAt: null,
      },
    });

    // Update user permissions based on tier
    const tierPermissions = getTierPermissions(priceId);
    if (tierPermissions) {
      await prisma.userPermissions.upsert({
        where: { userId: clientId },
        create: {
          userId: clientId,
          ...tierPermissions,
        },
        update: tierPermissions,
      });
    }

    return NextResponse.json({ subscription, message: 'Subscription granted successfully' });
  } catch (error) {
    console.error('Error granting subscription:', error);
    return NextResponse.json(
      {
        error: 'Failed to grant subscription',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/clients/[id]/subscription - Revoke subscription
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: clientId } = await params;

    const subscription = await prisma.subscription.findUnique({
      where: { userId: clientId },
    });

    if (!subscription) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 404 });
    }

    // Cancel in Stripe
    try {
      await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
    } catch (error) {
      console.error('Error canceling Stripe subscription:', error);
    }

    // Delete from database
    await prisma.subscription.delete({
      where: { userId: clientId },
    });

    return NextResponse.json({ message: 'Subscription revoked successfully' });
  } catch (error) {
    console.error('Error revoking subscription:', error);
    return NextResponse.json({ error: 'Failed to revoke subscription' }, { status: 500 });
  }
}

// Helper function to map price IDs to tier permissions
function getTierPermissions(priceId: string) {
  // You'll need to map your actual Stripe price IDs here
  // For now, we'll use a basic mapping that can be updated
  const basePermissions = {
    canAccessDashboard: true,
    canAccessProjects: true,
    canAccessTasks: true,
    canAccessMessages: true,
    canAccessFiles: true,
    canAccessInvoices: true,
    canAccessContracts: true,
    canUploadFiles: true,
    canSendMessages: true,
  };

  // This is a placeholder - you should map actual Stripe price IDs
  // to determine which tier they represent
  if (priceId.includes('matcha') || priceId.includes('basic')) {
    return {
      ...basePermissions,
      canViewAnalytics: false,
      canAccessMeetings: false,
      canAccessTeam: false,
      canAccessRequests: false,
      canAccessBilling: false,
      canCreateTasks: false,
      canEditTasks: false,
      canDeleteTasks: false,
      canInviteTeam: false,
      canManageProjects: false,
    };
  }

  if (priceId.includes('taro') || priceId.includes('pro')) {
    return {
      ...basePermissions,
      canAccessMeetings: true,
      canAccessTeam: true,
      canAccessRequests: true,
      canAccessBilling: true,
      canCreateTasks: true,
      canEditTasks: true,
      canViewAnalytics: true,
      canDeleteTasks: false,
      canInviteTeam: false,
      canManageProjects: false,
    };
  }

  // Thai Tea / Premium tier
  return {
    ...basePermissions,
    canAccessMeetings: true,
    canAccessTeam: true,
    canAccessRequests: true,
    canAccessBilling: true,
    canUploadFiles: true,
    canCreateTasks: true,
    canEditTasks: true,
    canDeleteTasks: true,
    canInviteTeam: true,
    canViewAnalytics: true,
    canManageProjects: true,
  };
}
