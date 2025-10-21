import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET messages between admin and a specific client
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { clientId } = await params;

    // Get direct messages between admin and client
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            // Messages from client to admin
            senderId: clientId,
            recipientId: session.user.id,
          },
          {
            // Messages from admin to client
            senderId: session.user.id,
            recipientId: clientId,
          },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        file: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json({
      messages: messages.map((msg) => ({
        id: msg.id,
        content: msg.content,
        senderId: msg.sender.id,
        senderName: msg.sender.name,
        senderImage: msg.sender.image,
        senderRole: msg.sender.role,
        createdAt: msg.createdAt.toISOString(),
        isRead: msg.isRead,
        type: msg.type,
        project: msg.project,
        file: msg.file,
      })),
    });
  } catch (error) {
    console.error('Error fetching admin messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// POST - Send message to client
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { clientId } = await params;
    const body = await request.json();
    const { content } = body;

    if (!content?.trim()) {
      return NextResponse.json({ error: 'Message content required' }, { status: 400 });
    }

    // Get sender info
    const sender = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!sender) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify client exists
    const client = await prisma.user.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // Create direct message to client
    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        type: 'TEXT',
        senderId: sender.id,
        recipientId: clientId,
        isRead: false,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Create notification for client
    await prisma.notification.create({
      data: {
        type: 'MESSAGE',
        title: 'New Message',
        message: `${sender.name} sent you a message`,
        senderId: sender.id,
        recipientId: clientId,
        isRead: false,
      },
    });

    return NextResponse.json({
      message: {
        id: message.id,
        content: message.content,
        senderId: message.sender.id,
        senderName: message.sender.name,
        senderImage: message.sender.image,
        senderRole: message.sender.role,
        createdAt: message.createdAt.toISOString(),
        isRead: message.isRead,
        type: message.type,
        project: message.project,
      },
    });
  } catch (error) {
    console.error('Error sending admin message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
