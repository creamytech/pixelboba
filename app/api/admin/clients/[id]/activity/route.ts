import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin access
    const adminUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (adminUser?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const resolvedParams = await params;
    const clientId = resolvedParams.id;

    // Get query parameters for pagination and filtering
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const entityType = searchParams.get('entityType');
    const action = searchParams.get('action');

    // Build where clause
    const where: any = {
      userId: clientId,
    };

    if (entityType) {
      where.entityType = entityType;
    }

    if (action) {
      where.action = action;
    }

    // Fetch activity logs
    const [activities, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    // Parse changes JSON
    const parsedActivities = activities.map((activity) => ({
      ...activity,
      changes: activity.changes ? JSON.parse(activity.changes) : null,
    }));

    // Get activity statistics
    const stats = await prisma.auditLog.groupBy({
      by: ['action'],
      where: { userId: clientId },
      _count: {
        action: true,
      },
    });

    const actionCounts = stats.reduce(
      (acc, stat) => {
        acc[stat.action] = stat._count.action;
        return acc;
      },
      {} as Record<string, number>
    );

    return NextResponse.json({
      activities: parsedActivities,
      total,
      limit,
      offset,
      stats: actionCounts,
    });
  } catch (error) {
    console.error('Error fetching client activity:', error);
    return NextResponse.json({ error: 'Failed to fetch activity' }, { status: 500 });
  }
}
