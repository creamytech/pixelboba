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
          from: `${fromName} <${fromEmail}>`,
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
                <h1 style="color: white; margin: 0; font-size: 24px;">🧋 New Project Inquiry</h1>
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
