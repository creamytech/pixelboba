import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { chatId, content } = await request.json();

    if (!chatId || !content?.trim()) {
      return NextResponse.json({ error: 'Chat ID and content are required' }, { status: 400 });
    }

    try {
      const { prisma } = await import('@/lib/prisma');

      // Verify chat exists and admin has access
      const chat = await prisma.visitorChat.findUnique({
        where: { id: chatId },
      });

      if (!chat) {
        return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
      }

      if (chat.status !== 'LIVE') {
        return NextResponse.json({ error: 'Chat is not in live status' }, { status: 400 });
      }

      // Create message
      const message = await prisma.visitorChatMessage.create({
        data: {
          chatId: chatId,
          content: content.trim(),
          isFromVisitor: false,
          isFromBot: false,
          senderId: session.user.id,
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return NextResponse.json({ success: true, message });
    } catch (dbError) {
      console.error('Database error sending admin message:', dbError);
      return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in admin message API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
