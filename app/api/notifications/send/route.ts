import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  sendNewMessage,
  sendMilestoneCompleted,
  sendProjectUpdate,
  sendInvoiceReady,
  sendFilesUploaded,
  EmailTemplate,
  EMAIL_TEMPLATES,
} from '@/lib/resend';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !['ADMIN', 'OWNER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, recipient, data } = await request.json();

    if (!type || !recipient || !data) {
      return NextResponse.json(
        {
          error: 'Missing required fields: type, recipient, data',
        },
        { status: 400 }
      );
    }

    // Validate email template type
    const validTemplates = Object.values(EMAIL_TEMPLATES);
    if (!validTemplates.includes(type)) {
      return NextResponse.json(
        {
          error: 'Invalid notification type',
          validTypes: validTemplates,
        },
        { status: 400 }
      );
    }

    // Add portal URL to data
    const portalUrl = `${process.env.NEXTAUTH_URL}/portal`;
    const enrichedData = {
      ...data,
      portalUrl,
      clientName: data.clientName || recipient.split('@')[0], // Fallback name
    };

    // Route to appropriate notification sender
    switch (type) {
      case EMAIL_TEMPLATES.NEW_MESSAGE:
        sendNewMessage(recipient, enrichedData);
        break;

      case EMAIL_TEMPLATES.MILESTONE_COMPLETED:
        sendMilestoneCompleted(recipient, enrichedData);
        break;

      case EMAIL_TEMPLATES.PROJECT_UPDATE:
        sendProjectUpdate(recipient, enrichedData);
        break;

      case EMAIL_TEMPLATES.INVOICE_READY:
        sendInvoiceReady(recipient, enrichedData);
        break;

      case EMAIL_TEMPLATES.FILES_UPLOADED:
        sendFilesUploaded(recipient, enrichedData);
        break;

      default:
        return NextResponse.json(
          {
            error: 'Notification type not implemented yet',
          },
          { status: 400 }
        );
    }

    // Log the notification attempt
    console.log('Email notification queued:', {
      type,
      recipient,
      sender: session.user.email,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Notification queued for delivery',
      type,
      recipient,
    });
  } catch (error) {
    console.error('Notification API error:', error);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}

// Get notification history
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !['ADMIN', 'OWNER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Implement notification history from database
    // For now, return mock data
    const mockHistory = [
      {
        id: '1',
        type: 'new-message',
        recipient: 'client@example.com',
        status: 'sent',
        sentAt: new Date().toISOString(),
        subject: 'New message from your team',
      },
      {
        id: '2',
        type: 'milestone-completed',
        recipient: 'client@example.com',
        status: 'delivered',
        sentAt: new Date(Date.now() - 86400000).toISOString(),
        subject: 'Milestone completed: Design Phase',
      },
    ];

    return NextResponse.json({
      notifications: mockHistory,
      total: mockHistory.length,
    });
  } catch (error) {
    console.error('Notification history error:', error);
    return NextResponse.json({ error: 'Failed to fetch notification history' }, { status: 500 });
  }
}
