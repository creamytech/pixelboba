import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Get all meetings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        organization: {
          include: {
            meetings: {
              include: {
                host: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                  },
                },
              },
              orderBy: { scheduledAt: 'asc' },
            },
            manager: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        subscription: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check which meeting types are available based on tier
    const tierFeatures: Record<string, { hasUxReview: boolean; hasStrategyCalls: boolean }> = {
      [process.env.NEXT_PUBLIC_STRIPE_LITE_BREW_PRICE_ID || '']: {
        hasUxReview: false,
        hasStrategyCalls: false,
      },
      [process.env.NEXT_PUBLIC_STRIPE_SIGNATURE_BLEND_PRICE_ID || '']: {
        hasUxReview: true,
        hasStrategyCalls: false,
      },
      [process.env.NEXT_PUBLIC_STRIPE_TARO_CLOUD_PRICE_ID || '']: {
        hasUxReview: true,
        hasStrategyCalls: true,
      },
    };

    const features = user.subscription
      ? tierFeatures[user.subscription.stripePriceId] || {
          hasUxReview: false,
          hasStrategyCalls: false,
        }
      : { hasUxReview: false, hasStrategyCalls: false };

    return NextResponse.json({
      meetings: user.organization?.meetings || [],
      features,
      manager: user.organization?.manager || null,
    });
  } catch (error) {
    console.error('Error fetching meetings:', error);
    return NextResponse.json({ error: 'Failed to fetch meetings' }, { status: 500 });
  }
}

// Request/schedule a meeting
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, type, scheduledAt, duration } = await request.json();

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        subscription: true,
        organization: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.subscription || user.subscription.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Active subscription required to schedule meetings' },
        { status: 403 }
      );
    }

    // Check tier permissions
    const tierFeatures: Record<string, { hasUxReview: boolean; hasStrategyCalls: boolean }> = {
      [process.env.NEXT_PUBLIC_STRIPE_LITE_BREW_PRICE_ID || '']: {
        hasUxReview: false,
        hasStrategyCalls: false,
      },
      [process.env.NEXT_PUBLIC_STRIPE_SIGNATURE_BLEND_PRICE_ID || '']: {
        hasUxReview: true,
        hasStrategyCalls: false,
      },
      [process.env.NEXT_PUBLIC_STRIPE_TARO_CLOUD_PRICE_ID || '']: {
        hasUxReview: true,
        hasStrategyCalls: true,
      },
    };

    const features = tierFeatures[user.subscription.stripePriceId] || {
      hasUxReview: false,
      hasStrategyCalls: false,
    };

    if (type === 'UX_REVIEW' && !features.hasUxReview) {
      return NextResponse.json(
        { error: 'UX reviews are only available with Signature Blend or Taro Cloud plans' },
        { status: 403 }
      );
    }

    if (type === 'STRATEGY_CALL' && !features.hasStrategyCalls) {
      return NextResponse.json(
        { error: 'Strategy calls are only available with Taro Cloud plan' },
        { status: 403 }
      );
    }

    // Create or get organization
    let organizationId = user.organizationId;
    if (!organizationId) {
      const org = await prisma.organization.create({
        data: {
          name: user.company || `${user.name}'s Team`,
          ownerId: user.id,
        },
      });
      organizationId = org.id;

      await prisma.user.update({
        where: { id: user.id },
        data: { organizationId: org.id },
      });
    }

    const meeting = await prisma.meeting.create({
      data: {
        title,
        description,
        type,
        scheduledAt: new Date(scheduledAt),
        duration: duration || 30,
        organizationId,
        hostId: user.id,
      },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: 'Meeting scheduled successfully',
      meeting,
    });
  } catch (error) {
    console.error('Error creating meeting:', error);
    return NextResponse.json({ error: 'Failed to create meeting' }, { status: 500 });
  }
}
