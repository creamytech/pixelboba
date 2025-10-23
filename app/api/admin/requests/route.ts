import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Get all requests across all clients (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get filter params
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const clientId = searchParams.get('clientId');

    // Build where clause
    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (priority) {
      where.priority = priority;
    }
    if (clientId) {
      where.organization = {
        ownerId: clientId,
      };
    }

    // Fetch all requests with organization and project info
    const requests = await prisma.request.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    });

    // Get stats
    const stats = {
      total: requests.length,
      submitted: requests.filter((r) => r.status === 'SUBMITTED').length,
      inProgress: requests.filter((r) => r.status === 'IN_PROGRESS').length,
      inReview: requests.filter((r) => r.status === 'IN_REVIEW').length,
      completed: requests.filter((r) => r.status === 'COMPLETED').length,
      overdue: requests.filter(
        (r) => r.dueDate && new Date(r.dueDate) < new Date() && r.status !== 'COMPLETED'
      ).length,
    };

    return NextResponse.json({ requests, stats });
  } catch (error) {
    console.error('Error fetching admin requests:', error);
    return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 });
  }
}
