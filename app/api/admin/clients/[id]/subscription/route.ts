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

    // For admin-granted subscriptions, we'll create a database-only subscription
    // without involving Stripe payment processing at all
    let stripeCustomerId = user.subscription?.stripeCustomerId;

    // Create Stripe customer if doesn't exist (for future use)
    if (!stripeCustomerId) {
      try {
        const customer = await stripe.customers.create({
          email: user.email || undefined,
          name: user.name || undefined,
          metadata: {
            userId: user.id,
          },
        });
        stripeCustomerId = customer.id;
      } catch (error) {
        console.error('Error creating Stripe customer:', error);
        // Continue without Stripe customer - subscription will be database-only
        stripeCustomerId = `admin_grant_${Date.now()}`;
      }
    }

    // Cancel existing Stripe subscription if it exists
    if (
      user.subscription?.stripeSubscriptionId &&
      !user.subscription.stripeSubscriptionId.startsWith('admin_grant_')
    ) {
      try {
        await stripe.subscriptions.cancel(user.subscription.stripeSubscriptionId);
      } catch (error) {
        console.error('Error canceling existing subscription:', error);
      }
    }

    // Create subscription directly in database (no Stripe subscription needed for admin grants)
    const now = new Date();
    const oneMonthFromNow = new Date(now);
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

    const subscription = await prisma.subscription.upsert({
      where: { userId: clientId },
      create: {
        userId: clientId,
        stripeCustomerId,
        stripeSubscriptionId: `admin_grant_${Date.now()}`, // Fake subscription ID for admin grants
        stripePriceId: priceId,
        status: 'ACTIVE',
        currentPeriodStart: now,
        currentPeriodEnd: oneMonthFromNow,
        cancelAtPeriodEnd: false,
      },
      update: {
        stripeSubscriptionId: `admin_grant_${Date.now()}`,
        stripePriceId: priceId,
        status: 'ACTIVE',
        currentPeriodStart: now,
        currentPeriodEnd: oneMonthFromNow,
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

// Helper function to map price IDs to tier permissions based on Boba Club tiers
function getTierPermissions(priceId: string) {
  const liteBrewPriceId = process.env.NEXT_PUBLIC_STRIPE_LITE_BREW_PRICE_ID;
  const signatureBlendPriceId = process.env.NEXT_PUBLIC_STRIPE_SIGNATURE_BLEND_PRICE_ID;
  const taroCloudPriceId = process.env.NEXT_PUBLIC_STRIPE_TARO_CLOUD_PRICE_ID;

  // Lite Brew ($1,500/mo) - Basic tier for solo founders
  // Features: 1 user, 1 active request, basic dashboard access
  if (priceId === liteBrewPriceId) {
    return {
      canAccessDashboard: true,
      canAccessProjects: true,
      canAccessTasks: true,
      canAccessMessages: true,
      canAccessFiles: true,
      canAccessInvoices: true,
      canAccessContracts: true,
      canAccessMeetings: false,
      canAccessTeam: false,
      canAccessRequests: true, // 1 active request
      canAccessBilling: false,
      canUploadFiles: true,
      canSendMessages: true,
      canCreateTasks: false, // View only
      canEditTasks: false,
      canDeleteTasks: false,
      canInviteTeam: false, // Only 1 user
      canViewAnalytics: false,
      canManageProjects: false,
    };
  }

  // Signature Blend ($3,000/mo) - Most popular, for growing teams
  // Features: Up to 3 users, 2 active requests, premium dashboard, real-time tracking
  if (priceId === signatureBlendPriceId) {
    return {
      canAccessDashboard: true,
      canAccessProjects: true,
      canAccessTasks: true,
      canAccessMessages: true,
      canAccessFiles: true,
      canAccessInvoices: true,
      canAccessContracts: true,
      canAccessMeetings: true, // Premium feature
      canAccessTeam: true, // Up to 3 users
      canAccessRequests: true, // 2 active requests
      canAccessBilling: true,
      canUploadFiles: true,
      canSendMessages: true,
      canCreateTasks: true, // Task queue management
      canEditTasks: true,
      canDeleteTasks: false,
      canInviteTeam: true, // Up to 3 users
      canViewAnalytics: true, // Real-time project tracking
      canManageProjects: false,
    };
  }

  // Taro Cloud ($6,000/mo) - Enterprise tier
  // Features: Up to 5 users, 3 active requests, enterprise dashboard, admin panel, dedicated manager
  if (priceId === taroCloudPriceId) {
    return {
      canAccessDashboard: true,
      canAccessProjects: true,
      canAccessTasks: true,
      canAccessMessages: true,
      canAccessFiles: true,
      canAccessInvoices: true,
      canAccessContracts: true,
      canAccessMeetings: true,
      canAccessTeam: true, // Up to 5 users
      canAccessRequests: true, // 3 active requests
      canAccessBilling: true,
      canUploadFiles: true,
      canSendMessages: true,
      canCreateTasks: true,
      canEditTasks: true,
      canDeleteTasks: true, // Full control
      canInviteTeam: true, // Up to 5 users
      canViewAnalytics: true, // Enterprise dashboard
      canManageProjects: true, // Admin panel access
    };
  }

  // Default fallback - minimal permissions
  return {
    canAccessDashboard: true,
    canAccessProjects: true,
    canAccessTasks: true,
    canAccessMessages: true,
    canAccessFiles: true,
    canAccessInvoices: true,
    canAccessContracts: true,
    canAccessMeetings: false,
    canAccessTeam: false,
    canAccessRequests: false,
    canAccessBilling: false,
    canUploadFiles: false,
    canSendMessages: true,
    canCreateTasks: false,
    canEditTasks: false,
    canDeleteTasks: false,
    canInviteTeam: false,
    canViewAnalytics: false,
    canManageProjects: false,
  };
}
