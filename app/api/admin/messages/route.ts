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

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    try {
      const { prisma } = await import('@/lib/prisma');

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
          file: {
            select: {
              originalName: true,
              url: true,
              mimetype: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      });

      // Mark messages as read for admin
      await prisma.message.updateMany({
        where: {
          projectId,
          senderId: { not: session.user.id },
          isRead: false,
        },
        data: { isRead: true },
      });

      return NextResponse.json({ messages });
    } catch (dbError) {
      console.error('Database error fetching messages:', dbError);
      return NextResponse.json({ messages: [] });
    }
  } catch (error) {
    console.error('Error in admin messages API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { content, projectId } = body;

    if (!content?.trim() || !projectId) {
      return NextResponse.json({ error: 'Content and project ID are required' }, { status: 400 });
    }

    try {
      const { prisma } = await import('@/lib/prisma');

      // Verify project exists and get client info
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
          client: {
            select: { name: true, email: true },
          },
        },
      });

      if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
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
          description: `Message sent to ${project.client.name}`,
          userId: session.user.id,
          projectId,
        },
      });

      return NextResponse.json({ message });
    } catch (dbError) {
      console.error('Database error sending message:', dbError);
      return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in send message API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
