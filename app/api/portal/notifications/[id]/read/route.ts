import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prisma } = await import('@/lib/prisma');
    const notificationId = params.id;

    // Update notification as read, but only if it belongs to the current user
    const notification = await prisma.notification.update({
      where: {
        id: notificationId,
        recipientId: session.user.id,
      },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json({ success: true, notification });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
