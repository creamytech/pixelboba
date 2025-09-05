import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    try {
      const { prisma } = await import('@/lib/prisma');

      // Verify user has access to this project
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          clientId: session.user.id,
        },
      });

      if (!project) {
        return NextResponse.json({ error: 'Project not found or access denied' }, { status: 404 });
      }

      const messages = await prisma.message.findMany({
        where: { projectId },
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
        orderBy: { createdAt: 'asc' },
      });

      // Mark messages as read for this user
      await prisma.message.updateMany({
        where: {
          projectId,
          senderId: { not: session.user.id },
          isRead: false,
        },
        data: { isRead: true },
      });

      // Format messages for the client
      const formattedMessages = messages.map((msg) => ({
        id: msg.id,
        content: msg.content,
        sender: msg.sender,
        timestamp: msg.createdAt,
        isOwn: msg.senderId === session.user.id,
      }));

      return NextResponse.json({ messages: formattedMessages });
    } catch (dbError) {
      console.error('Database error fetching portal messages:', dbError);
      return NextResponse.json({ messages: [] });
    }
  } catch (error) {
    console.error('Error in portal messages API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { content, projectId } = body;

    if (!content?.trim() || !projectId) {
      return NextResponse.json({ error: 'Content and project ID are required' }, { status: 400 });
    }

    try {
      const { prisma } = await import('@/lib/prisma');

      // Verify user has access to this project
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          clientId: session.user.id,
        },
      });

      if (!project) {
        return NextResponse.json({ error: 'Project not found or access denied' }, { status: 404 });
      }

      const message = await prisma.message.create({
        data: {
          content: content.trim(),
          projectId,
          senderId: session.user.id,
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

      // Create activity log
      await prisma.activity.create({
        data: {
          action: 'message_sent',
          description: `Message sent by client`,
          userId: session.user.id,
          projectId,
        },
      });

      // Format message for the client
      const formattedMessage = {
        id: message.id,
        content: message.content,
        sender: message.sender,
        timestamp: message.createdAt,
        isOwn: true,
      };

      return NextResponse.json(formattedMessage);
    } catch (dbError) {
      console.error('Database error sending portal message:', dbError);
      return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in send portal message API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
