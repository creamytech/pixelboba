import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Get all meetings across all clients (admin only)
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
    const type = searchParams.get('type');

    // Build where clause
    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (type) {
      where.type = type;
    }

    // Fetch all meetings with organization and host info
    const meetings = await prisma.meeting.findMany({
      where,
      include: {
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
        host: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });

    // Get stats
    const stats = {
      total: meetings.length,
      scheduled: meetings.filter((m) => m.status === 'SCHEDULED').length,
      completed: meetings.filter((m) => m.status === 'COMPLETED').length,
      cancelled: meetings.filter((m) => m.status === 'CANCELLED').length,
      upcoming: meetings.filter(
        (m) => m.status === 'SCHEDULED' && new Date(m.scheduledAt) > new Date()
      ).length,
    };

    return NextResponse.json({ meetings, stats });
  } catch (error) {
    console.error('Error fetching admin meetings:', error);
    return NextResponse.json({ error: 'Failed to fetch meetings' }, { status: 500 });
  }
}
