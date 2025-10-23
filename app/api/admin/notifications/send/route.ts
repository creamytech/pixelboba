import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Send notification to client(s) (admin only)
export async function POST(request: NextRequest) {
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

    const {
      title,
      message,
      type,
      recipientIds, // Array of user IDs
      broadcastToAll, // Send to all clients
    } = await request.json();

    if (!title || !message || !type) {
      return NextResponse.json({ error: 'Title, message, and type are required' }, { status: 400 });
    }

    let recipients: string[] = [];

    if (broadcastToAll) {
      // Get all CLIENT users
      const clients = await prisma.user.findMany({
        where: { role: 'CLIENT' },
        select: { id: true },
      });
      recipients = clients.map((c) => c.id);
    } else if (recipientIds && recipientIds.length > 0) {
      recipients = recipientIds;
    } else {
      return NextResponse.json(
        { error: 'Either recipientIds or broadcastToAll must be provided' },
        { status: 400 }
      );
    }

    // Create notifications for all recipients
    const notifications = await prisma.notification.createMany({
      data: recipients.map((recipientId) => ({
        title,
        message,
        type,
        recipientId,
        senderId: session.user.id,
      })),
    });

    return NextResponse.json({
      message: `Notification sent to ${recipients.length} recipient(s)`,
      count: notifications.count,
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}
