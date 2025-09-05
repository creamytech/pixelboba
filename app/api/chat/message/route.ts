import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, content, visitorName, visitorEmail } = await request.json();

    if (!sessionId || !content?.trim()) {
      return NextResponse.json({ error: 'Session ID and content are required' }, { status: 400 });
    }

    try {
      const { prisma } = await import('@/lib/prisma');

      // Find the chat session
      let chat = await prisma.visitorChat.findUnique({
        where: { sessionId },
        include: {
          assignedAdmin: true,
        },
      });

      if (!chat) {
        return NextResponse.json({ error: 'Chat session not found' }, { status: 404 });
      }

      // Update visitor info if provided and send email notification for new leads
      if ((visitorName || visitorEmail) && (!chat.visitorName || !chat.visitorEmail)) {
        chat = await prisma.visitorChat.update({
          where: { id: chat.id },
          data: {
            visitorName: visitorName || chat.visitorName,
            visitorEmail: visitorEmail || chat.visitorEmail,
          },
          include: {
            assignedAdmin: true,
          },
        });

        // Send email notification for new lead (async, don't wait)
        if (visitorEmail && !chat.visitorEmail) {
          try {
            const { sendVisitorChatNotification } = await import('@/lib/email-notifications');
            const messages = await prisma.visitorChatMessage.findMany({
              where: { chatId: chat.id },
              orderBy: { createdAt: 'asc' },
            });

            sendVisitorChatNotification({
              visitorName,
              visitorEmail,
              source: chat.source || undefined,
              messages: messages.map((m) => ({
                content: m.content,
                isFromVisitor: m.isFromVisitor,
                timestamp: m.createdAt,
              })),
              chatId: chat.id,
            }).catch((error) => console.error('Failed to send lead notification:', error));
          } catch (error) {
            console.error('Error preparing lead notification:', error);
          }
        }
      }

      // Save visitor message
      await prisma.visitorChatMessage.create({
        data: {
          chatId: chat.id,
          content: content.trim(),
          isFromVisitor: true,
          isFromBot: false,
        },
      });

      // Check if any admins are online
      const onlineAdmins = await prisma.user.findMany({
        where: {
          role: { in: ['ADMIN', 'OWNER'] },
          isOnline: true,
        },
        orderBy: { lastActiveAt: 'desc' },
      });

      let response = '';
      let isFromBot = true;
      let senderName = 'Pixel Boba Bot';
      let messageId = '';

      if (onlineAdmins.length > 0 && chat.status === 'BOT') {
        // Transition to live chat if admin is available
        await prisma.visitorChat.update({
          where: { id: chat.id },
          data: {
            status: 'LIVE',
            assignedAdminId: onlineAdmins[0].id,
          },
        });

        response =
          'Perfect! ✨ Let me connect you with one of our talented team members who can help brew up the perfect solution for you!';

        // Create admin notification message
        const adminMessage = await prisma.visitorChatMessage.create({
          data: {
            chatId: chat.id,
            content: response,
            isFromVisitor: false,
            isFromBot: true,
          },
        });
        messageId = adminMessage.id;
      } else {
        // Use bot response
        const botResponse = await getBotResponse(content.trim());
        response = botResponse;

        const botMessage = await prisma.visitorChatMessage.create({
          data: {
            chatId: chat.id,
            content: response,
            isFromVisitor: false,
            isFromBot: true,
          },
        });
        messageId = botMessage.id;
      }

      return NextResponse.json({
        response,
        isFromBot,
        senderName,
        messageId,
        status: chat.status,
      });
    } catch (dbError) {
      console.error('Database error in chat message:', dbError);
      return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in chat message API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getBotResponse(message: string): Promise<string> {
  const messageLower = message.toLowerCase();

  // Simple keyword matching with boba-themed responses
  if (
    messageLower.includes('price') ||
    messageLower.includes('cost') ||
    messageLower.includes('budget')
  ) {
    return "🧋 Great question! Our digital creations typically brew up between $5,000 to $25,000, depending on how complex and feature-rich you want your project to be. We'd love to craft a custom quote just for you! What kind of digital magic are you dreaming about?";
  }

  if (
    messageLower.includes('timeline') ||
    messageLower.includes('how long') ||
    messageLower.includes('time')
  ) {
    return "⏰ Most of our projects simmer for about 4-12 weeks from start to finish - kind of like brewing the perfect boba tea! The time depends on how many features we're mixing in. We work in phases so you can taste-test along the way. What's your ideal timeline?";
  }

  if (
    messageLower.includes('service') ||
    messageLower.includes('what do you do') ||
    messageLower.includes('help')
  ) {
    return "✨ We're digital artisans who specialize in brewing up custom web applications, e-commerce sites, mobile apps, and immersive digital experiences! We handle everything from the first design sketches to final deployment - like a full-service digital tea shop! What kind of project is bubbling in your mind?";
  }

  if (
    messageLower.includes('portfolio') ||
    messageLower.includes('work') ||
    messageLower.includes('example')
  ) {
    return "🎨 You can sip on our latest creations at /work on our website! We've crafted everything from SaaS platforms to e-commerce sites to mobile apps. Each project is like a unique boba flavor - carefully crafted and deliciously functional! Want to chat about a specific type of project?";
  }

  if (
    messageLower.includes('contact') ||
    messageLower.includes('email') ||
    messageLower.includes('call')
  ) {
    return "📬 You can reach our team at hello@pixelboba.com or through our contact page! We're usually pretty quick to respond - faster than it takes to make a perfect boba tea! What's the best way for us to follow up with you?";
  }

  if (
    messageLower.includes('hello') ||
    messageLower.includes('hi') ||
    messageLower.includes('hey')
  ) {
    return "Hey there! 👋 Thanks for popping by! I'm here to help you discover how we can brew up some amazing web development and design magic together. What's cooking in your digital world?";
  }

  // Default response
  return "Thanks for reaching out! 🧋 I'm excited to help you learn more about how we create digital experiences that are both beautiful and functional. Want to tell me more about what you're looking for? Or feel free to ask about our pricing, timelines, or check out some examples of our work!";
}
