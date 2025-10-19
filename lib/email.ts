/**
 * Email utility functions
 * Handles sending emails via nodemailer or a service like SendGrid/Resend
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

/**
 * Send an email
 * In production, replace this with a real email service like SendGrid, Resend, or AWS SES
 */
export async function sendEmail({ to, subject, html, from }: EmailOptions): Promise<boolean> {
  try {
    // For development/testing, just log the email
    if (process.env.NODE_ENV === 'development') {
      console.log('[Email] Would send email:', {
        to,
        subject,
        html: html.substring(0, 100) + '...',
      });
      return true;
    }

    // Production: Use a real email service
    // Example with fetch to an email API
    const emailApiUrl = process.env.EMAIL_API_URL;
    const emailApiKey = process.env.EMAIL_API_KEY;

    if (!emailApiUrl || !emailApiKey) {
      console.warn('[Email] Email service not configured. Set EMAIL_API_URL and EMAIL_API_KEY');
      return false;
    }

    const response = await fetch(emailApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${emailApiKey}`,
      },
      body: JSON.stringify({
        from: from || process.env.EMAIL_FROM || 'noreply@pixelboba.com',
        to,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      throw new Error(`Email API returned ${response.status}: ${await response.text()}`);
    }

    console.log(`[Email] Successfully sent email to ${to}`);
    return true;
  } catch (error) {
    console.error('[Email] Error sending email:', error);
    return false;
  }
}

/**
 * Send a bulk email to multiple recipients
 */
export async function sendBulkEmail(
  emails: Array<{ to: string; subject: string; html: string }>
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  for (const email of emails) {
    const sent = await sendEmail(email);
    if (sent) {
      success++;
    } else {
      failed++;
    }

    // Rate limit to avoid overwhelming email service
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return { success, failed };
}
