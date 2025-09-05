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
      const { getSettingValue } = await import('@/lib/settings');

      // Update chat status to LIVE and assign admin
      const chat = await prisma.visitorChat.update({
        where: { id: chatId },
        data: {
          status: 'LIVE',
          assignedAdminId: session.user.id,
        },
      });

      // Get admin display name
      let adminName = session.user.name || 'Admin';
      try {
        const displayName = await getSettingValue('company.displayName');
        if (displayName) {
          adminName = displayName;
        }
      } catch (error) {
        console.error('Error fetching display name:', error);
      }

      // Send takeover message
      await prisma.visitorChatMessage.create({
        data: {
          chatId: chatId,
          content: `Hi! I'm ${adminName} from Pixel Boba. I'm here to help you personally. What can I assist you with?`,
          isFromVisitor: false,
          isFromBot: false,
          senderId: session.user.id,
        },
      });

      return NextResponse.json({ success: true, chat });
    } catch (dbError) {
      console.error('Database error in chat takeover:', dbError);
      return NextResponse.json({ error: 'Failed to take over chat' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in chat takeover API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
