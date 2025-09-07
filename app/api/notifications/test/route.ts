import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendTestNotification } from '@/lib/emailTriggers';
import { User } from '@/types/portal';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, email } = await request.json();

    if (!type) {
      return NextResponse.json(
        {
          error: 'Missing notification type',
          availableTypes: ['message', 'milestone', 'update', 'invoice', 'files'],
        },
        { status: 400 }
      );
    }

    // Use provided email or session user email
    const recipientEmail = email || session.user.email;

    // Create mock user for testing
    const mockUser: User = {
      id: session.user.id || 'test-user',
      name: session.user.name || 'Test User',
      email: recipientEmail,
      role: 'CLIENT',
      createdAt: new Date(),
      // Default to all notifications enabled for testing
      emailPreferences: {
        newMessages: true,
        projectUpdates: true,
        milestoneCompletions: true,
        invoiceNotifications: true,
        contractReminders: true,
        fileUploads: true,
        weeklyDigest: true,
        marketingEmails: false,
        frequency: 'instant',
      },
    };

    await sendTestNotification(mockUser, type);

    return NextResponse.json({
      success: true,
      message: `Test ${type} notification sent to ${recipientEmail}`,
      type,
      recipient: recipientEmail,
    });
  } catch (error) {
    console.error('Test notification error:', error);
    return NextResponse.json({ error: 'Failed to send test notification' }, { status: 500 });
  }
}

// Get available test notification types
export async function GET() {
  return NextResponse.json({
    availableTypes: [
      { id: 'message', name: 'New Message', description: 'Test new message notification' },
      {
        id: 'milestone',
        name: 'Milestone Completed',
        description: 'Test milestone completion notification',
      },
      { id: 'update', name: 'Project Update', description: 'Test project update notification' },
      {
        id: 'invoice',
        name: 'Invoice Ready',
        description: 'Test invoice notification (coming soon)',
      },
      {
        id: 'files',
        name: 'Files Uploaded',
        description: 'Test file upload notification (coming soon)',
      },
    ],
    note: 'Use POST request with { "type": "message", "email": "optional@email.com" } to send test notifications',
  });
}
