import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Portal dashboard API called for user:', session.user.email);

    try {
      // Dynamic import to avoid build-time database connection
      const { prisma } = await import('@/lib/prisma');

      // Find or create user
      let user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
          projects: {
            include: {
              milestones: true,
            },
            orderBy: { createdAt: 'desc' },
          },
          subscription: true,
        },
      });

      if (!user) {
        console.log('Creating new user from portal dashboard API');
        user = await prisma.user.create({
          data: {
            email: session.user.email,
            name: session.user.name || session.user.email,
            image: session.user.image,
            role: 'CLIENT',
            emailVerified: new Date(),
          },
          include: {
            projects: {
              include: {
                milestones: true,
              },
              orderBy: { createdAt: 'desc' },
            },
            subscription: true,
          },
        });
      }

      // Get counts for dashboard stats
      const [unreadMessages, pendingInvoices, pendingContracts] = await Promise.all([
        prisma.message.count({
          where: {
            project: { clientId: user.id },
            isRead: false,
          },
        }),
        prisma.invoice.count({
          where: {
            clientId: user.id,
            status: { in: ['SENT', 'OVERDUE'] },
          },
        }),
        prisma.contract.count({
          where: {
            clientId: user.id,
            status: 'SENT',
          },
        }),
      ]);

      // Determine subscription tier name
      let subscriptionTier = null;
      let isSubscriptionActive = false;

      if (user.subscription) {
        isSubscriptionActive =
          user.subscription.status === 'ACTIVE' && !user.subscription.cancelAtPeriodEnd;

        // Map price ID to tier name
        const priceId = user.subscription.stripePriceId;
        if (priceId === process.env.NEXT_PUBLIC_STRIPE_LITE_BREW_PRICE_ID) {
          subscriptionTier = 'Lite Brew';
        } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_SIGNATURE_BLEND_PRICE_ID) {
          subscriptionTier = 'Signature Blend';
        } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_TARO_CLOUD_PRICE_ID) {
          subscriptionTier = 'Taro Cloud';
        }
      }

      const portalData = {
        user: {
          id: user.id,
          name: user.name || 'User',
          email: user.email,
          role: user.role,
          phone: user.phone,
          company: user.company,
          image: user.image,
          createdAt: user.createdAt,
          onboardingCompleted: user.onboardingCompleted,
        },
        subscription: {
          tier: subscriptionTier,
          isActive: isSubscriptionActive,
        },
        projects: user.projects.map((project) => ({
          ...project,
          client: {
            id: user.id,
            name: user.name || 'User',
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
          },
        })),
        unreadMessages,
        pendingInvoices,
        pendingContracts,
      };

      console.log('Returning real portal data for:', session.user.email, {
        projectCount: user.projects.length,
        unreadMessages,
        pendingInvoices,
        pendingContracts,
      });

      return NextResponse.json(portalData);
    } catch (dbError) {
      console.error('Database error in portal dashboard:', dbError);

      // Fallback to session data if database fails
      const fallbackData = {
        user: {
          id: session.user.id || session.user.email,
          name: session.user.name || 'User',
          email: session.user.email,
          role: session.user.role || 'CLIENT',
          createdAt: new Date(),
        },
        projects: [],
        unreadMessages: 0,
        pendingInvoices: 0,
        pendingContracts: 0,
      };

      console.log('Returning fallback data due to database error');
      return NextResponse.json(fallbackData);
    }
  } catch (error) {
    console.error('Error in portal dashboard API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
