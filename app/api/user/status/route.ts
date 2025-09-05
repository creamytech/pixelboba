import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action } = await request.json();

    try {
      const { prisma } = await import('@/lib/prisma');

      if (action === 'online') {
        // Set user as online and update last active time
        await prisma.user.update({
          where: { id: session.user.id },
          data: {
            isOnline: true,
            lastActiveAt: new Date(),
          },
        });
      } else if (action === 'offline') {
        // Set user as offline
        await prisma.user.update({
          where: { id: session.user.id },
          data: {
            isOnline: false,
            lastActiveAt: new Date(),
          },
        });
      } else if (action === 'heartbeat') {
        // Update last active time for users who are online
        await prisma.user.update({
          where: { id: session.user.id },
          data: {
            lastActiveAt: new Date(),
          },
        });
      }

      return NextResponse.json({ success: true });
    } catch (dbError) {
      console.error('Database error updating user status:', dbError);
      return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in user status API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const { prisma } = await import('@/lib/prisma');

      // Get online status of all users (for admin) or project collaborators (for clients)
      if (session.user.role === 'ADMIN' || session.user.role === 'OWNER') {
        // Admin can see all users
        const users = await prisma.user.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isOnline: true,
            lastActiveAt: true,
          },
        });

        return NextResponse.json({ users });
      } else {
        // Clients can see their project team members
        const projects = await prisma.project.findMany({
          where: { clientId: session.user.id },
          include: {
            client: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isOnline: true,
                lastActiveAt: true,
              },
            },
          },
        });

        // Also get admin users who can be contacted
        const adminUsers = await prisma.user.findMany({
          where: {
            role: { in: ['ADMIN', 'OWNER'] },
          },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isOnline: true,
            lastActiveAt: true,
          },
        });

        const users = [...adminUsers];

        return NextResponse.json({ users });
      }
    } catch (dbError) {
      console.error('Database error fetching user status:', dbError);
      return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in user status API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
