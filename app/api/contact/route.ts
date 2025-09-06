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
          from: `${fromName} <hello@pixelboba.com>`, // Use actual monitored inbox
          to: ['hello@pixelboba.com'],
          replyTo: email, // Allow replying directly to the contact
          subject: `New Contact Inquiry from ${name}`, // Removed emoji, more professional
          headers: {
            'X-Priority': '3',
            'X-Mailer': 'Pixel Boba Contact Form',
          },
          html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>New Contact Form Submission</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 40px 0;">
                    <table role="presentation" style="width: 600px; max-width: 90%; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                      <!-- Header -->
                      <tr>
                        <td style="background: linear-gradient(135deg, #8B5CF6, #A78BFA); padding: 30px; text-align: center;">
                          <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">New Contact Inquiry</h1>
                          <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 14px;">From your website contact form</p>
                        </td>
                      </tr>
                      
                      <!-- Content -->
                      <tr>
                        <td style="padding: 30px;">
                          <!-- Contact Details -->
                          <table role="presentation" style="width: 100%; margin-bottom: 25px;">
                            <tr>
                              <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
                                <strong style="color: #333; font-size: 14px;">Name:</strong>
                                <span style="color: #666; font-size: 14px; margin-left: 10px;">${name}</span>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
                                <strong style="color: #333; font-size: 14px;">Email:</strong>
                                <a href="mailto:${email}" style="color: #8B5CF6; text-decoration: none; margin-left: 10px;">${email}</a>
                              </td>
                            </tr>
                            ${
                              company
                                ? `
                            <tr>
                              <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
                                <strong style="color: #333; font-size: 14px;">Company:</strong>
                                <span style="color: #666; font-size: 14px; margin-left: 10px;">${company}</span>
                              </td>
                            </tr>
                            `
                                : ''
                            }
                            ${
                              budget
                                ? `
                            <tr>
                              <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
                                <strong style="color: #333; font-size: 14px;">Budget:</strong>
                                <span style="color: #666; font-size: 14px; margin-left: 10px;">${budget}</span>
                              </td>
                            </tr>
                            `
                                : ''
                            }
                            ${
                              timeline
                                ? `
                            <tr>
                              <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
                                <strong style="color: #333; font-size: 14px;">Timeline:</strong>
                                <span style="color: #666; font-size: 14px; margin-left: 10px;">${timeline}</span>
                              </td>
                            </tr>
                            `
                                : ''
                            }
                          </table>
                          
                          <!-- Message -->
                          <div style="margin-top: 25px;">
                            <h3 style="color: #333; font-size: 16px; margin-bottom: 15px;">Message:</h3>
                            <div style="background: #f8f9fa; border-left: 4px solid #8B5CF6; padding: 20px; border-radius: 4px; font-size: 14px; line-height: 1.6; color: #555;">
                              ${message.replace(/\n/g, '<br>')}
                            </div>
                          </div>
                          
                          <!-- Call to Action -->
                          <div style="text-align: center; margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 4px;">
                            <p style="margin: 0 0 15px 0; color: #666; font-size: 14px;">Reply directly to this email to respond to ${name}</p>
                            <a href="mailto:${email}?subject=Re: Your inquiry to Pixel Boba" 
                               style="display: inline-block; background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">
                              Reply to ${name}
                            </a>
                          </div>
                        </td>
                      </tr>
                      
                      <!-- Footer -->
                      <tr>
                        <td style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
                          <p style="margin: 0; color: #999; font-size: 12px; line-height: 1.5;">
                            This inquiry was submitted on ${new Date().toLocaleString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              timeZoneName: 'short',
                            })}<br>
                            via the contact form at <a href="https://pixelboba.com/contact" style="color: #8B5CF6;">pixelboba.com/contact</a>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
          `,
          text: `
New Contact Inquiry

Name: ${name}
Email: ${email}
${company ? `Company: ${company}` : ''}
${budget ? `Budget: ${budget}` : ''}
${timeline ? `Timeline: ${timeline}` : ''}

Message:
${message}

---
Submitted: ${new Date().toLocaleString()}
Reply directly to this email to respond to ${name}.
          `.trim(),
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
