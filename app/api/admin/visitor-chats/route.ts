import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
      const { prisma } = await import('@/lib/prisma');

      const chats = await prisma.visitorChat.findMany({
        include: {
          assignedAdmin: {
            select: {
              id: true,
              name: true,
            },
          },
          messages: {
            include: {
              sender: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 50, // Limit to recent chats
      });

      return NextResponse.json({ chats });
    } catch (dbError) {
      console.error('Database error fetching visitor chats:', dbError);
      return NextResponse.json({ error: 'Failed to fetch chats' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in visitor chats API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
