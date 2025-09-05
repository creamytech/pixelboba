import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, source } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    try {
      const { prisma } = await import('@/lib/prisma');

      // Check if chat already exists for this session
      let chat = await prisma.visitorChat.findUnique({
        where: { sessionId },
      });

      if (!chat) {
        // Create new chat session
        chat = await prisma.visitorChat.create({
          data: {
            sessionId,
            source: source || '/',
            ipAddress:
              request.headers.get('x-forwarded-for') ||
              request.headers.get('x-real-ip') ||
              'unknown',
            userAgent: request.headers.get('user-agent') || 'unknown',
          },
        });
      }

      return NextResponse.json({
        chatId: chat.id,
        status: chat.status,
        success: true,
      });
    } catch (dbError) {
      console.error('Database error initializing chat:', dbError);
      return NextResponse.json({ error: 'Failed to initialize chat' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in chat init API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
