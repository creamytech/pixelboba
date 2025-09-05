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

    const { chatId } = await request.json();

    if (!chatId) {
      return NextResponse.json({ error: 'Chat ID is required' }, { status: 400 });
    }

    try {
      const { prisma } = await import('@/lib/prisma');

      // Update chat status to ENDED
      const chat = await prisma.visitorChat.update({
        where: { id: chatId },
        data: {
          status: 'ENDED',
          endedAt: new Date(),
        },
        include: {
          assignedAdmin: true,
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      // Send closing message
      await prisma.visitorChatMessage.create({
        data: {
          chatId: chatId,
          content:
            'Thanks for chatting with us! If you have any more questions, feel free to start a new chat or contact us at hello@pixelboba.com.',
          isFromVisitor: false,
          isFromBot: false,
          senderId: session.user.id,
        },
      });

      // Send chat summary email (async, don't wait)
      if (chat.visitorEmail) {
        try {
          const { sendChatEndedNotification } = await import('@/lib/email-notifications');
          const duration =
            chat.endedAt && chat.createdAt
              ? (chat.endedAt.getTime() - chat.createdAt.getTime()) / 1000
              : undefined;

          sendChatEndedNotification({
            visitorName: chat.visitorName || undefined,
            visitorEmail: chat.visitorEmail,
            source: chat.source || undefined,
            adminName: chat.assignedAdmin?.name || session.user.name || undefined,
            duration,
            messages: chat.messages.map((m) => ({
              content: m.content,
              isFromVisitor: m.isFromVisitor,
              timestamp: m.createdAt,
            })),
            chatId: chat.id,
          }).catch((error) => console.error('Failed to send chat summary:', error));
        } catch (error) {
          console.error('Error preparing chat summary:', error);
        }
      }

      return NextResponse.json({ success: true, chat });
    } catch (dbError) {
      console.error('Database error ending chat:', dbError);
      return NextResponse.json({ error: 'Failed to end chat' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in end chat API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
