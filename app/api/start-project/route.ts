import { NextRequest, NextResponse } from 'next/server';

interface ProjectFormData {
  name: string;
  email: string;
  company: string;
  services: string[];
  pages: string;
  budget: string;
  timeline: string;
  links: string;
  additional: string;
  honeypot: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: ProjectFormData = await request.json();

    // Basic spam protection
    if (data.honeypot) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Validate required fields
    if (!data.name?.trim() || !data.email?.trim() || !data.services?.length || !data.budget) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Sanitize inputs
    const sanitizedData = {
      name: data.name.trim(),
      email: data.email.trim(),
      company: data.company?.trim() || '',
      services: data.services,
      pages: data.pages?.trim() || '',
      budget: data.budget,
      timeline: data.timeline?.trim() || '',
      links: data.links?.trim() || '',
      additional: data.additional?.trim() || '',
    };

    // Try to send email using settings system first, then fallback to env var
    let emailSent = false;

    try {
      const { getSettingValue } = await import('@/lib/settings');
      const apiKey = (await getSettingValue('email.apiKey')) || process.env.RESEND_API_KEY;
      const fromName = (await getSettingValue('email.fromName')) || 'Pixel Boba';
      const fromEmail = (await getSettingValue('email.fromEmail')) || 'hello@pixelboba.com';

      console.log('Project form email configuration:', {
        hasApiKey: !!apiKey,
        fromName,
        fromEmail,
      });

      if (apiKey) {
        const { Resend } = await import('resend');
        const resend = new Resend(apiKey);

        // Format services list
        const servicesList = sanitizedData.services.map((service) => `• ${service}`).join('\n');

        // Create email content
        const emailContent = `
🧋 New Project Inquiry — Pixel Boba

Client Information:
• Name: ${sanitizedData.name}
• Email: ${sanitizedData.email}
• Company: ${sanitizedData.company || 'Not provided'}

Project Details:
Services Needed:
${servicesList}

Budget Range: ${sanitizedData.budget}

${sanitizedData.pages ? `Pages/Features:\n${sanitizedData.pages}\n\n` : ''}
${sanitizedData.timeline ? `Timeline: ${sanitizedData.timeline}\n\n` : ''}
${sanitizedData.links ? `Current Site/Inspirations:\n${sanitizedData.links}\n\n` : ''}
${sanitizedData.additional ? `Additional Notes:\n${sanitizedData.additional}\n\n` : ''}

---
Submitted: ${new Date().toLocaleString()}
Reply directly to this email to respond to ${sanitizedData.name}.
        `.trim();

        const htmlContent = emailContent
          .replace(/\n/g, '<br>')
          .replace(/•/g, '<li>')
          .replace(/---/g, '<hr>');

        const result = await resend.emails.send({
          from: `${fromName} <hello@pixelboba.com>`,
          to: ['hello@pixelboba.com'],
          replyTo: sanitizedData.email,
          subject: `🧋 New Project Inquiry — ${sanitizedData.name}`,
          text: emailContent,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>New Project Inquiry</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #8B5CF6, #A78BFA); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
                <img src="https://pixelboba.com/Pixel_Boba_Icon_PNG.png" alt="pixel boba" style="width: 48px; height: 48px; margin-bottom: 16px; filter: brightness(0) invert(1);" />
                <h1 style="color: white; margin: 0; font-size: 24px;">New Project Inquiry</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">From your website services form</p>
              </div>
              
              <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
                <h2 style="color: #374151; border-bottom: 2px solid #8B5CF6; padding-bottom: 10px;">Client Information</h2>
                <table style="width: 100%; margin-bottom: 20px;">
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #374151;">Name:</td>
                    <td style="padding: 8px 0; color: #6B7280;">${sanitizedData.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #374151;">Email:</td>
                    <td style="padding: 8px 0; color: #6B7280;"><a href="mailto:${sanitizedData.email}" style="color: #8B5CF6;">${sanitizedData.email}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #374151;">Company:</td>
                    <td style="padding: 8px 0; color: #6B7280;">${sanitizedData.company || 'Not provided'}</td>
                  </tr>
                </table>

                <h2 style="color: #374151; border-bottom: 2px solid #8B5CF6; padding-bottom: 10px;">Project Details</h2>
                
                <div style="margin-bottom: 20px;">
                  <h3 style="color: #374151; margin-bottom: 10px;">Services Needed:</h3>
                  <ul style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #8B5CF6;">
                    ${sanitizedData.services.map((service) => `<li style="margin-bottom: 5px;">${service}</li>`).join('')}
                  </ul>
                </div>

                <div style="margin-bottom: 20px;">
                  <h3 style="color: #374151; margin-bottom: 10px;">Budget Range:</h3>
                  <p style="background: #f0f9ff; padding: 15px; border-radius: 8px; border-left: 4px solid #0ea5e9; margin: 0; font-weight: bold; color: #0369a1;">${sanitizedData.budget}</p>
                </div>

                ${
                  sanitizedData.pages
                    ? `
                <div style="margin-bottom: 20px;">
                  <h3 style="color: #374151; margin-bottom: 10px;">Pages/Features:</h3>
                  <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981;">
                    ${sanitizedData.pages.replace(/\n/g, '<br>')}
                  </div>
                </div>
                `
                    : ''
                }

                ${
                  sanitizedData.timeline
                    ? `
                <div style="margin-bottom: 20px;">
                  <h3 style="color: #374151; margin-bottom: 10px;">Timeline:</h3>
                  <p style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 0;">${sanitizedData.timeline}</p>
                </div>
                `
                    : ''
                }

                ${
                  sanitizedData.links
                    ? `
                <div style="margin-bottom: 20px;">
                  <h3 style="color: #374151; margin-bottom: 10px;">Current Site/Inspirations:</h3>
                  <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #6366f1;">
                    ${sanitizedData.links.replace(/\n/g, '<br>')}
                  </div>
                </div>
                `
                    : ''
                }

                ${
                  sanitizedData.additional
                    ? `
                <div style="margin-bottom: 20px;">
                  <h3 style="color: #374151; margin-bottom: 10px;">Additional Notes:</h3>
                  <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #8b5cf6;">
                    ${sanitizedData.additional.replace(/\n/g, '<br>')}
                  </div>
                </div>
                `
                    : ''
                }

                <div style="text-align: center; margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 8px;">
                  <p style="margin: 0 0 15px 0; color: #6B7280; font-size: 14px;">Reply directly to this email to respond to ${sanitizedData.name}</p>
                  <a href="mailto:${sanitizedData.email}?subject=Re: Your project inquiry to Pixel Boba" 
                     style="display: inline-block; background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                    Reply to ${sanitizedData.name}
                  </a>
                </div>
              </div>
              
              <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; margin-top: 20px;">
                <p style="margin: 0; color: #6B7280; font-size: 12px;">
                  This inquiry was submitted on ${new Date().toLocaleString()}<br>
                  via the services form at <a href="https://pixelboba.com/services" style="color: #8B5CF6;">pixelboba.com/services</a>
                </p>
              </div>
            </body>
            </html>
          `,
        });

        console.log('Project form email sent successfully:', result);

        // Send confirmation email to user
        const confirmationResult = await resend.emails.send({
          from: `${fromName} <${fromEmail}>`,
          to: [sanitizedData.email],
          subject: `🧋 We received your project details!`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Project Confirmation - Pixel Boba</title>
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #fefefe;">
              
              <!-- Header with branding -->
              <div style="background: linear-gradient(135deg, #8B5CF6, #A78BFA); padding: 40px 30px; text-align: center; border-radius: 0;">
                <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 16px; backdrop-filter: blur(10px);">
                  <img src="https://pixelboba.com/brand/Pixel_Boba_Logo_White.svg" alt="pixel boba" style="width: 60px; height: 60px; margin: 0 auto 15px; display: block;" />
                  <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">pixel boba</h1>
                  <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">websites that pop</p>
                </div>
              </div>
              
              <!-- Main content -->
              <div style="background: white; padding: 40px 30px;">
                <h2 style="color: #374151; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">thanks ${sanitizedData.name}! 🎉</h2>
                
                <p style="color: #6B7280; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                  we've received your project details and we're excited to work with you. here's what happens next:
                </p>

                <!-- Timeline steps -->
                <div style="background: #f8fafc; padding: 24px; border-radius: 12px; border-left: 4px solid #8B5CF6; margin: 24px 0;">
                  <div style="margin-bottom: 16px;">
                    <div style="display: flex; align-items: center; margin-bottom: 8px;">
                      <div style="width: 24px; height: 24px; background: #8B5CF6; border-radius: 50%; color: white; text-align: center; line-height: 24px; font-size: 12px; font-weight: 600; margin-right: 12px;">1</div>
                      <strong style="color: #374151;">review (happening now)</strong>
                    </div>
                    <p style="margin: 0 0 0 36px; color: #6B7280; font-size: 14px;">our team is reviewing your project requirements</p>
                  </div>
                  
                  <div style="margin-bottom: 16px;">
                    <div style="display: flex; align-items: center; margin-bottom: 8px;">
                      <div style="width: 24px; height: 24px; background: #10b981; border-radius: 50%; color: white; text-align: center; line-height: 24px; font-size: 12px; font-weight: 600; margin-right: 12px;">2</div>
                      <strong style="color: #374151;">custom proposal (within 24 hours)</strong>
                    </div>
                    <p style="margin: 0 0 0 36px; color: #6B7280; font-size: 14px;">we'll send you a detailed proposal with pricing and timeline</p>
                  </div>
                  
                  <div>
                    <div style="display: flex; align-items: center; margin-bottom: 8px;">
                      <div style="width: 24px; height: 24px; background: #f59e0b; border-radius: 50%; color: white; text-align: center; line-height: 24px; font-size: 12px; font-weight: 600; margin-right: 12px;">3</div>
                      <strong style="color: #374151;">project kick-off</strong>
                    </div>
                    <p style="margin: 0 0 0 36px; color: #6B7280; font-size: 14px;">once approved, we start building your dream website</p>
                  </div>
                </div>

                <!-- Project summary -->
                <div style="margin: 32px 0;">
                  <h3 style="color: #374151; margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">your project summary:</h3>
                  <div style="background: #f1f5f9; padding: 20px; border-radius: 8px;">
                    <p style="margin: 0 0 8px 0; color: #374151;"><strong>services:</strong> ${sanitizedData.services.join(', ')}</p>
                    <p style="margin: 0 0 8px 0; color: #374151;"><strong>budget:</strong> ${sanitizedData.budget}</p>
                    ${sanitizedData.timeline ? `<p style="margin: 0; color: #374151;"><strong>timeline:</strong> ${sanitizedData.timeline}</p>` : ''}
                  </div>
                </div>

                <!-- Questions section -->
                <div style="background: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 24px 0;">
                  <h4 style="color: #92400e; margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">have questions?</h4>
                  <p style="color: #92400e; margin: 0; font-size: 14px;">
                    simply reply to this email and we'll get back to you quickly. no phone calls needed!
                  </p>
                </div>

                <p style="color: #6B7280; font-size: 16px; line-height: 1.6; margin: 32px 0 0 0;">
                  thanks for choosing pixel boba. we can't wait to make your website pop! 🚀
                </p>

                <p style="color: #374151; font-size: 16px; font-weight: 600; margin: 24px 0 0 0;">
                  the pixel boba team
                </p>
              </div>
              
              <!-- Footer -->
              <div style="background: #f8fafc; padding: 30px; text-align: center; border-radius: 0;">
                <div style="margin-bottom: 20px;">
                  <p style="margin: 0 0 8px 0; color: #6B7280; font-size: 14px; font-weight: 600;">pixel boba</p>
                  <p style="margin: 0; color: #9CA3AF; font-size: 12px;">websites that pop</p>
                </div>
                
                <div style="border-top: 1px solid #e5e7eb; padding-top: 20px;">
                  <p style="margin: 0; color: #9CA3AF; font-size: 12px;">
                    submitted ${new Date().toLocaleString()}<br>
                    <a href="https://pixelboba.com" style="color: #8B5CF6; text-decoration: none;">pixelboba.com</a>
                  </p>
                </div>
              </div>
            </body>
            </html>
          `,
        });

        console.log('Confirmation email sent successfully:', confirmationResult);
        emailSent = true;
      } else {
        console.log('No email API key configured for project form');
      }
    } catch (emailError) {
      console.error('Failed to send project form email:', emailError);
    }

    // Also log the form submission for backup
    console.log('New project form submission:', {
      timestamp: new Date().toISOString(),
      name: sanitizedData.name,
      email: sanitizedData.email,
      company: sanitizedData.company,
      services: sanitizedData.services,
      budget: sanitizedData.budget,
      emailSent,
    });

    return NextResponse.json({
      success: true,
      message: emailSent
        ? 'Project inquiry sent successfully'
        : 'Project inquiry received, email pending',
    });
  } catch (error) {
    console.error('Project form API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
