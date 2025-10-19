import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { content, recipientId } = body;

    if (!content?.trim()) {
      return NextResponse.json({ error: 'Message content required' }, { status: 400 });
    }

    if (!recipientId) {
      return NextResponse.json({ error: 'Recipient ID required' }, { status: 400 });
    }

    // Get sender info
    const sender = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!sender) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify recipient exists and is admin/owner
    const recipient = await prisma.user.findUnique({
      where: { id: recipientId },
    });

    if (!recipient || (recipient.role !== 'ADMIN' && recipient.role !== 'OWNER')) {
      return NextResponse.json({ error: 'Invalid recipient' }, { status: 404 });
    }

    // Create direct message
    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        type: 'TEXT',
        senderId: sender.id,
        recipientId: recipientId,
        isRead: false,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
          },
        },
      },
    });

    // Create notification for admin
    await prisma.notification.create({
      data: {
        type: 'MESSAGE',
        title: 'New Message',
        message: `${sender.name || sender.email} sent you a message`,
        senderId: sender.id,
        recipientId: recipientId,
        isRead: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: {
        id: message.id,
        content: message.content,
        sender: message.sender,
        timestamp: message.createdAt,
        isOwn: true,
      },
    });
  } catch (error) {
    console.error('Error sending direct message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
