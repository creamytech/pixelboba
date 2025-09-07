import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please provide a valid email address' }, { status: 400 });
    }

    // Add subscriber to MailerLite
    let subscribed = false;
    let errorMessage = '';

    try {
      const { getSettingValue } = await import('@/lib/settings');
      const mailerLiteApiKey =
        (await getSettingValue('mailerlite.apiKey')) || process.env.MAILERLITE_API_KEY;
      const groupId =
        (await getSettingValue('mailerlite.groupId')) || process.env.MAILERLITE_GROUP_ID;

      if (!mailerLiteApiKey) {
        throw new Error('MailerLite API key not configured');
      }

      // Add subscriber to MailerLite group
      const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mailerLiteApiKey}`,
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email: email,
          groups: groupId ? [groupId] : undefined,
          status: 'active',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Check if subscriber already exists
        if (response.status === 422 && errorData.message?.includes('already exists')) {
          subscribed = true;
          errorMessage = 'already_subscribed';
        } else {
          throw new Error(
            `MailerLite API error: ${response.status} - ${errorData.message || response.statusText}`
          );
        }
      } else {
        const data = await response.json();
        subscribed = true;
        console.log('Successfully added subscriber to MailerLite:', data.data?.id);
      }
    } catch (mailerLiteError) {
      console.error('Failed to add subscriber to MailerLite:', mailerLiteError);
      errorMessage = 'api_error';
    }

    // Log the subscription attempt
    console.log('Newsletter subscription attempt:', {
      email,
      timestamp: new Date().toISOString(),
      subscribed,
      errorMessage,
    });

    // Return response based on result
    if (subscribed) {
      return NextResponse.json({
        message:
          errorMessage === 'already_subscribed'
            ? "You're already subscribed! Thanks for your continued interest."
            : "Thanks for subscribing! You'll start receiving our newsletter soon.",
        success: true,
      });
    } else {
      return NextResponse.json({
        message: "Thanks for subscribing! We'll add you to our list manually.",
        success: true,
      });
    }
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}
