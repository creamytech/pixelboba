import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { EmailPreferences } from '@/types/portal';

// Default email preferences for new users
const DEFAULT_EMAIL_PREFERENCES: EmailPreferences = {
  newMessages: true,
  projectUpdates: true,
  milestoneCompletions: true,
  invoiceNotifications: true,
  contractReminders: true,
  fileUploads: true,
  weeklyDigest: true,
  marketingEmails: false,
  frequency: 'instant',
  quietHours: {
    start: '22:00',
    end: '08:00',
    timezone: 'America/New_York',
  },
};

// Get user's email preferences
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Fetch from database
    // For now, return default preferences
    const preferences = {
      ...DEFAULT_EMAIL_PREFERENCES,
      // Override with user's saved preferences if available
    };

    return NextResponse.json({
      preferences,
      success: true,
    });
  } catch (error) {
    console.error('Error fetching email preferences:', error);
    return NextResponse.json({ error: 'Failed to fetch preferences' }, { status: 500 });
  }
}

// Update user's email preferences
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const preferences: Partial<EmailPreferences> = await request.json();

    // Validate preferences
    const validKeys = Object.keys(DEFAULT_EMAIL_PREFERENCES);
    const invalidKeys = Object.keys(preferences).filter((key) => !validKeys.includes(key));

    if (invalidKeys.length > 0) {
      return NextResponse.json(
        {
          error: 'Invalid preference keys',
          invalidKeys,
          validKeys,
        },
        { status: 400 }
      );
    }

    // Validate frequency
    if (preferences.frequency && !['instant', 'daily', 'weekly'].includes(preferences.frequency)) {
      return NextResponse.json(
        {
          error: 'Invalid frequency. Must be: instant, daily, or weekly',
        },
        { status: 400 }
      );
    }

    // TODO: Save to database
    // For now, just log and return success
    console.log('Saving email preferences for user:', session.user.email, preferences);

    return NextResponse.json({
      success: true,
      message: 'Preferences updated successfully',
      preferences: {
        ...DEFAULT_EMAIL_PREFERENCES,
        ...preferences,
      },
    });
  } catch (error) {
    console.error('Error updating email preferences:', error);
    return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 });
  }
}
