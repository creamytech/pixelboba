/**
 * Email utility functions using Resend
 */
import { Resend } from 'resend';

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send an email using Resend
 */
export async function sendEmail({ to, subject, html, from }: EmailOptions): Promise<boolean> {
  try {
    // For development/testing, log the email details
    if (process.env.NODE_ENV === 'development') {
      console.log('[Email] Sending email via Resend:', {
        to,
        subject,
        from: from || process.env.EMAIL_FROM || 'Pixel Boba <noreply@pixelboba.com>',
        htmlPreview: html.substring(0, 100) + '...',
      });
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.warn('[Email] RESEND_API_KEY not configured. Emails will not be sent.');
      console.log('[Email] Would send to:', to, 'Subject:', subject);
      return false;
    }

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: from || process.env.EMAIL_FROM || 'Pixel Boba <noreply@pixelboba.com>',
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    });

    if (error) {
      console.error('[Email] Resend error:', error);
      return false;
    }

    console.log(`[Email] Successfully sent email to ${to}. ID: ${data?.id}`);
    return true;
  } catch (error) {
    console.error('[Email] Error sending email:', error);
    return false;
  }
}

/**
 * Send a bulk email to multiple recipients
 * Uses Resend batch sending for better performance
 */
export async function sendBulkEmail(
  emails: Array<{ to: string; subject: string; html: string; from?: string }>
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  // Resend allows batch sending, but we'll send individually for better error handling
  for (const email of emails) {
    const sent = await sendEmail(email);
    if (sent) {
      success++;
    } else {
      failed++;
    }

    // Small delay to avoid rate limiting (Resend free tier: 100 emails/day)
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log(`[Email] Bulk send complete: ${success} success, ${failed} failed`);
  return { success, failed };
}

/**
 * Send a team invitation email
 */
export async function sendTeamInvitationEmail({
  to,
  inviterName,
  organizationName,
  role,
  inviteUrl,
}: {
  to: string;
  inviterName: string;
  organizationName: string;
  role: string;
  inviteUrl: string;
}): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #3a001d;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background: #fff;
            border: 4px solid #3a001d;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 4px 4px 0px 0px rgba(58, 0, 29, 1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 32px;
            font-weight: 900;
            text-transform: uppercase;
            background: linear-gradient(135deg, #9333EA 0%, #6B4423 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          h1 {
            color: #3a001d;
            font-size: 24px;
            font-weight: 900;
            text-transform: uppercase;
            margin: 20px 0;
          }
          .invite-box {
            background: linear-gradient(135deg, #f3e8ff 0%, #fef3c7 100%);
            border: 3px solid #3a001d;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .invite-box p {
            margin: 10px 0;
            font-weight: 600;
          }
          .invite-box strong {
            font-weight: 900;
          }
          .button {
            display: inline-block;
            padding: 16px 32px;
            background: linear-gradient(135deg, #9333EA 0%, #7928CA 100%);
            color: white !important;
            text-decoration: none;
            border-radius: 12px;
            border: 3px solid #3a001d;
            box-shadow: 3px 3px 0px 0px rgba(58, 0, 29, 1);
            font-weight: 900;
            text-transform: uppercase;
            margin: 20px 0;
            transition: all 0.2s;
          }
          .button:hover {
            box-shadow: 5px 5px 0px 0px rgba(58, 0, 29, 1);
            transform: translate(-2px, -2px);
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
            text-align: center;
          }
          .expires {
            background: #fef3c7;
            border: 2px solid #f59e0b;
            border-radius: 6px;
            padding: 12px;
            margin: 20px 0;
            text-align: center;
            font-weight: 700;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🧋 Pixel Boba</div>
          </div>

          <h1>You're Invited! 🎉</h1>

          <p><strong>${inviterName}</strong> has invited you to join their team on Pixel Boba.</p>

          <div class="invite-box">
            <p><strong>Organization:</strong> ${organizationName}</p>
            <p><strong>Role:</strong> ${role}</p>
          </div>

          <div style="text-align: center;">
            <a href="${inviteUrl}" class="button">Accept Invitation</a>
          </div>

          <div class="expires">
            ⏰ This invitation expires in 7 days
          </div>

          <div class="footer">
            <p>If you didn't expect this invitation, you can safely ignore this email.</p>
            <p>Need help? Contact us at hello@pixelboba.com</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: `You've been invited to join ${organizationName} on Pixel Boba`,
    html,
  });
}
