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

    // Try to send notification email
    let emailSent = false;

    try {
      const { getSettingValue } = await import('@/lib/settings');
      const apiKey = (await getSettingValue('email.apiKey')) || process.env.RESEND_API_KEY;
      const fromName = (await getSettingValue('email.fromName')) || 'Pixel Boba';

      if (apiKey) {
        const { Resend } = await import('resend');
        const resend = new Resend(apiKey);

        // Send notification to you
        await resend.emails.send({
          from: `${fromName} <hello@pixelboba.com>`,
          to: ['hello@pixelboba.com'],
          subject: `🧋 New Newsletter Subscriber`,
          html: `
            <h2>New Newsletter Subscriber</h2>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subscribed:</strong> ${new Date().toLocaleString()}</p>
            <p>Add them to your email list manually.</p>
          `,
          text: `
New Newsletter Subscriber

Email: ${email}
Subscribed: ${new Date().toLocaleString()}

Add them to your email list manually.
          `.trim(),
        });

        // Send welcome email to subscriber
        await resend.emails.send({
          from: `${fromName} <hello@pixelboba.com>`,
          to: [email],
          subject: `🧋 welcome to the boba fam!`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <title>Welcome to Pixel Boba!</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #8B5CF6; font-size: 28px; margin-bottom: 10px;">🧋 pixel boba</h1>
                <p style="color: #666; font-size: 18px;">welcome to the boba fam!</p>
              </div>
              
              <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                <h2 style="color: #333; margin-top: 0;">hey there! 👋</h2>
                <p>thanks for subscribing to our newsletter! you're now part of the pixel boba community where we share:</p>
                <ul style="color: #666;">
                  <li>behind-the-scenes peeks at our latest projects</li>
                  <li>web design tips and trends</li>
                  <li>exclusive insights into our creative process</li>
                  <li>the occasional boba tea recommendation 🧋</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <p>while you're here, check out our latest work:</p>
                <a href="https://pixelboba.com/work" style="display: inline-block; background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                  view our portfolio
                </a>
              </div>
              
              <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #999; font-size: 12px;">
                <p>pixel boba - websites that pop 🧋<br>
                <a href="mailto:hello@pixelboba.com" style="color: #8B5CF6;">hello@pixelboba.com</a></p>
              </div>
            </body>
            </html>
          `,
          text: `
🧋 welcome to the boba fam!

hey there! 👋

thanks for subscribing to our newsletter! you're now part of the pixel boba community where we share:

• behind-the-scenes peeks at our latest projects
• web design tips and trends  
• exclusive insights into our creative process
• the occasional boba tea recommendation 🧋

while you're here, check out our latest work: https://pixelboba.com/work

---
pixel boba - websites that pop 🧋
hello@pixelboba.com
          `.trim(),
        });

        emailSent = true;
      }
    } catch (emailError) {
      console.error('Failed to send subscription emails:', emailError);
    }

    // Log the subscription
    console.log('Newsletter subscription:', {
      email,
      timestamp: new Date().toISOString(),
      emailSent,
    });

    return NextResponse.json({
      message: emailSent
        ? 'Thanks for subscribing! Check your email for a welcome message.'
        : "Thanks for subscribing! We'll be in touch soon.",
      success: true,
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}
