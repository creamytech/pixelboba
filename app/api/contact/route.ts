import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, budget, timeline, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please provide a valid email address' }, { status: 400 });
    }

    // Try to send email using settings system first, then fallback to env var
    let emailSent = false;

    try {
      const { getSettingValue } = await import('@/lib/settings');
      const apiKey = (await getSettingValue('email.apiKey')) || process.env.RESEND_API_KEY;
      const fromName = (await getSettingValue('email.fromName')) || 'Pixel Boba';
      const fromEmail = (await getSettingValue('email.fromEmail')) || 'hello@pixelboba.com';

      console.log('Email configuration:', {
        hasApiKey: !!apiKey,
        fromName,
        fromEmail,
        keyLength: apiKey ? apiKey.length : 0,
      });

      if (apiKey) {
        const { Resend } = await import('resend');
        const resend = new Resend(apiKey);

        const result = await resend.emails.send({
          from: `${fromName} <${fromEmail}>`,
          to: ['hello@pixelboba.com'],
          subject: `🌟 New Contact Form Submission from ${name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #8B5CF6;">🌟 New Contact Form Submission</h2>
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
                ${budget ? `<p><strong>Budget:</strong> ${budget}</p>` : ''}
                ${timeline ? `<p><strong>Timeline:</strong> ${timeline}</p>` : ''}
              </div>
              <div style="margin: 20px 0;">
                <p><strong>Message:</strong></p>
                <div style="background: white; padding: 15px; border-left: 4px solid #8B5CF6; border-radius: 4px;">
                  ${message.replace(/\n/g, '<br>')}
                </div>
              </div>
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
              <p style="color: #666; font-size: 12px;">
                This message was sent via the Pixel Boba contact form at ${new Date().toLocaleString()}
              </p>
            </div>
          `,
        });

        console.log('Contact form email sent successfully:', result);
        emailSent = true;
      } else {
        console.log('No email API key configured - email not sent');
      }
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // Continue execution - we'll still log the form submission
    }

    // Log form submission (in production, you might want to save to database)
    console.log('Contact form submission:', {
      name,
      email,
      company,
      budget,
      timeline,
      message,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        message: emailSent
          ? "Thank you! Your message has been sent successfully and we'll get back to you soon."
          : "Thank you! Your message has been received. We'll get back to you soon.",
        emailSent,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}
