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

        // Send confirmation email to the user
        try {
          const confirmationResult = await resend.emails.send({
            from: `${fromName} <hello@pixelboba.com>`,
            to: [email],
            subject: `🧋 Thanks for reaching out, ${name}! We're brewing up a response`,
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
                <title>Thanks for contacting us!</title>
              </head>
              <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td align="center" style="padding: 40px 0;">
                      <table role="presentation" style="width: 600px; max-width: 90%; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <!-- Header -->
                        <tr>
                          <td style="background: linear-gradient(135deg, #8B5CF6, #A78BFA); padding: 30px; text-align: center;">
                            <div style="font-size: 40px; margin-bottom: 15px;">🧋</div>
                            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Thanks for reaching out!</h1>
                            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">we're brewing up the perfect response ✨</p>
                          </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                          <td style="padding: 40px 30px;">
                            <div style="text-align: center; margin-bottom: 30px;">
                              <h2 style="color: #333; font-size: 20px; margin-bottom: 15px;">hey ${name}! 👋</h2>
                              <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                                thanks for reaching out to pixel boba! your message has safely landed in our digital tea cup 🫖 
                                and our team is already brewing up the perfect response.
                              </p>
                              <p style="color: #666; font-size: 16px; line-height: 1.6;">
                                we typically serve up responses within <strong style="color: #8B5CF6;">24 hours</strong> during business days. 
                                if your project is bubbling with urgency, feel free to ping us directly at 
                                <a href="mailto:hello@pixelboba.com" style="color: #8B5CF6; text-decoration: none;">hello@pixelboba.com</a> ☕
                              </p>
                            </div>
                            
                            <!-- Message Summary -->
                            <div style="background: #f8f9fa; border-left: 4px solid #8B5CF6; padding: 20px; border-radius: 4px; margin: 25px 0;">
                              <h3 style="color: #333; font-size: 16px; margin-bottom: 15px;">your message (safely steeped in our inbox): 💌</h3>
                              <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0; font-style: italic;">
                                "${message.replace(/\n/g, '<br>')}"
                              </p>
                            </div>
                            
                            <!-- What's Next -->
                            <div style="text-align: center; margin: 30px 0;">
                              <h3 style="color: #333; font-size: 18px; margin-bottom: 15px;">the boba brewing process 🧋</h3>
                              <div style="text-align: left; max-width: 420px; margin: 0 auto;">
                                <div style="display: flex; align-items: center; margin-bottom: 15px; padding: 10px; background: rgba(139, 92, 246, 0.05); border-radius: 6px;">
                                  <span style="color: #8B5CF6; font-size: 18px; margin-right: 15px;">🫖</span>
                                  <span style="color: #666; font-size: 14px;">our digital tea masters review your project</span>
                                </div>
                                <div style="display: flex; align-items: center; margin-bottom: 15px; padding: 10px; background: rgba(139, 92, 246, 0.05); border-radius: 6px;">
                                  <span style="color: #8B5CF6; font-size: 18px; margin-right: 15px;">💭</span>
                                  <span style="color: #666; font-size: 14px;">we craft thoughtful questions & next steps</span>
                                </div>
                                <div style="display: flex; align-items: center; margin-bottom: 15px; padding: 10px; background: rgba(139, 92, 246, 0.05); border-radius: 6px;">
                                  <span style="color: #8B5CF6; font-size: 18px; margin-right: 15px;">🎯</span>
                                  <span style="color: #666; font-size: 14px;">if it's a perfect blend, we'll schedule a call</span>
                                </div>
                              </div>
                            </div>
                            
                            <!-- CTA -->
                            <div style="text-align: center; margin: 30px 0;">
                              <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
                                while we're brewing, why not check out our freshest digital creations? 👀
                              </p>
                              <a href="https://pixelboba.com/work" 
                                 style="display: inline-block; background: linear-gradient(135deg, #8B5CF6, #A78BFA); color: white; padding: 14px 28px; text-decoration: none; border-radius: 25px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);">
                                🎨 peek at our portfolio
                              </a>
                            </div>
                          </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                          <td style="background: #f8f9fa; padding: 25px; text-align: center; border-top: 1px solid #eee;">
                            <div style="font-size: 20px; margin-bottom: 10px;">🧋</div>
                            <p style="margin: 0 0 10px 0; color: #666; font-size: 14px; font-weight: 600;">
                              pixel boba - digital experiences that matter
                            </p>
                            <p style="margin: 0; color: #999; font-size: 12px; line-height: 1.5;">
                              ☕ <a href="mailto:hello@pixelboba.com" style="color: #8B5CF6;">hello@pixelboba.com</a> • 
                              🌐 <a href="https://pixelboba.com" style="color: #8B5CF6;">pixelboba.com</a><br>
                              this is an automated confirmation email brewed fresh just for you ✨
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
🧋 hey ${name}!

thanks for reaching out to pixel boba! your message has safely landed in our digital tea cup and our team is already brewing up the perfect response.

your message (safely steeped in our inbox):
"${message}"

the boba brewing process:
🫖 our digital tea masters review your project
💭 we craft thoughtful questions & next steps  
🎯 if it's a perfect blend, we'll schedule a call

we typically serve up responses within 24 hours during business days. if your project is bubbling with urgency, ping us directly at hello@pixelboba.com

while we're brewing, check out our freshest digital creations: https://pixelboba.com/work

---
🧋 pixel boba - digital experiences that matter
☕ hello@pixelboba.com • 🌐 pixelboba.com

this is an automated confirmation email brewed fresh just for you ✨
            `.trim(),
          });

          console.log('Confirmation email sent to user:', confirmationResult);
        } catch (confirmationError) {
          console.error('Failed to send confirmation email to user:', confirmationError);
          // Don't fail the main request if confirmation email fails
        }

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
