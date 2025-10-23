import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Get all requests for user
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
            requests: {
              include: {
                project: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
              orderBy: { createdAt: 'desc' },
            },
          },
        },
        subscription: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get tier limits
    const tierLimits: Record<string, { maxActive: number; slaHours: number }> = {
      [process.env.NEXT_PUBLIC_STRIPE_LITE_BREW_PRICE_ID || '']: {
        maxActive: 1,
        slaHours: 84, // 3.5 days average
      },
      [process.env.NEXT_PUBLIC_STRIPE_SIGNATURE_BLEND_PRICE_ID || '']: {
        maxActive: 2,
        slaHours: 48, // 2 days
      },
      [process.env.NEXT_PUBLIC_STRIPE_TARO_CLOUD_PRICE_ID || '']: {
        maxActive: 3,
        slaHours: 24, // 24 hours
      },
    };

    const limits = user.subscription
      ? tierLimits[user.subscription.stripePriceId] || { maxActive: 1, slaHours: 84 }
      : { maxActive: 1, slaHours: 84 };

    const requests = user.organization?.requests || [];

    const activeRequests = requests.filter(
      (r) => r.status === 'SUBMITTED' || r.status === 'IN_PROGRESS' || r.status === 'IN_REVIEW'
    );

    return NextResponse.json({
      requests,
      limits: {
        maxActive: limits.maxActive,
        currentActive: activeRequests.length,
        slaHours: limits.slaHours,
      },
    });
  } catch (error) {
    console.error('Error fetching requests:', error);
    return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 });
  }
}

// Create new request
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, projectId, priority } = await request.json();

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        organization: {
          include: {
            requests: {
              where: {
                status: {
                  in: ['SUBMITTED', 'IN_PROGRESS', 'IN_REVIEW'],
                },
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

    if (!user.subscription || user.subscription.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Active subscription required to submit requests' },
        { status: 403 }
      );
    }

    // Check tier limits
    const tierLimits: Record<string, { maxActive: number; slaHours: number }> = {
      [process.env.NEXT_PUBLIC_STRIPE_LITE_BREW_PRICE_ID || '']: {
        maxActive: 1,
        slaHours: 84,
      },
      [process.env.NEXT_PUBLIC_STRIPE_SIGNATURE_BLEND_PRICE_ID || '']: {
        maxActive: 2,
        slaHours: 48,
      },
      [process.env.NEXT_PUBLIC_STRIPE_TARO_CLOUD_PRICE_ID || '']: {
        maxActive: 3,
        slaHours: 24,
      },
    };

    const limits = tierLimits[user.subscription.stripePriceId] || {
      maxActive: 1,
      slaHours: 84,
    };

    const activeCount = user.organization?.requests.length || 0;

    if (activeCount >= limits.maxActive) {
      return NextResponse.json(
        {
          error: `You have reached the maximum of ${limits.maxActive} active request(s) for your tier. Please wait for a request to complete or upgrade your plan.`,
        },
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

    // Calculate due date based on SLA
    const submittedAt = new Date();
    const dueDate = new Date(submittedAt);
    dueDate.setHours(dueDate.getHours() + limits.slaHours);

    // Create request
    const newRequest = await prisma.request.create({
      data: {
        title,
        description,
        status: 'SUBMITTED',
        priority: priority || 'MEDIUM',
        projectId: projectId || null,
        organizationId,
        submittedAt,
        dueDate,
        slaHours: limits.slaHours,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: 'Request submitted successfully',
      request: newRequest,
    });
  } catch (error) {
    console.error('Error creating request:', error);
    return NextResponse.json({ error: 'Failed to create request' }, { status: 500 });
  }
}
