import { Resend } from 'resend';
import { getSettingValue } from '@/lib/settings';

// Initialize Resend with API key from settings or env
let resendInstance: Resend | null = null;

export const getResend = async (): Promise<Resend> => {
  if (!resendInstance) {
    const apiKey = (await getSettingValue('resend.apiKey')) || process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('Resend API key not configured');
    }
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
};

// Email template configurations
export const EMAIL_TEMPLATES = {
  PROJECT_UPDATE: 'project-update',
  NEW_MESSAGE: 'new-message',
  MILESTONE_COMPLETED: 'milestone-completed',
  INVOICE_READY: 'invoice-ready',
  CONTRACT_PENDING: 'contract-pending',
  CONTRACT_COMPLETED: 'contract-completed',
  CONTRACT_EXPIRED: 'contract-expired',
  CONTRACT_UPDATE: 'contract-update',
  FILES_UPLOADED: 'files-uploaded',
  WEEKLY_DIGEST: 'weekly-digest',
  DEADLINE_REMINDER: 'deadline-reminder',
} as const;

export type EmailTemplate = (typeof EMAIL_TEMPLATES)[keyof typeof EMAIL_TEMPLATES];

// Common email configuration
export const EMAIL_CONFIG = {
  FROM: 'Pixel Boba <hello@pixelboba.com>',
  REPLY_TO: 'hello@pixelboba.com',
  BRAND_COLORS: {
    taro: '#A78BFA',
    'deep-taro': '#8B5CF6',
    'brown-sugar': '#D97706',
    'milk-tea': '#FEF3C7',
    matcha: '#10B981',
    ink: '#1F2937',
  },
};

// Email notification types
export interface EmailNotification {
  to: string;
  template: EmailTemplate;
  subject: string;
  data: Record<string, any>;
  priority?: 'high' | 'normal' | 'low';
  scheduledFor?: Date;
}

// Queue system for batching emails
export class EmailQueue {
  private static queue: EmailNotification[] = [];
  private static processing = false;

  static add(notification: EmailNotification) {
    this.queue.push(notification);
    if (!this.processing) {
      this.process();
    }
  }

  static async process() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;

    try {
      const resend = await getResend();

      // Process high priority emails immediately
      const highPriority = this.queue.filter((n) => n.priority === 'high');
      const others = this.queue.filter((n) => n.priority !== 'high');

      for (const notification of highPriority) {
        await this.sendEmail(notification);
      }

      // Batch process normal and low priority emails
      if (others.length > 0) {
        // Group by recipient to avoid spam
        const grouped = others.reduce(
          (acc, notification) => {
            if (!acc[notification.to]) acc[notification.to] = [];
            acc[notification.to].push(notification);
            return acc;
          },
          {} as Record<string, EmailNotification[]>
        );

        for (const [recipient, notifications] of Object.entries(grouped)) {
          // If multiple notifications for same user, consider digest
          if (notifications.length > 3) {
            await this.sendDigestEmail(recipient, notifications);
          } else {
            for (const notification of notifications) {
              await this.sendEmail(notification);
              // Add delay between emails to same recipient
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }
          }
        }
      }

      this.queue = [];
    } catch (error) {
      console.error('Error processing email queue:', error);
    } finally {
      this.processing = false;
    }
  }

  private static async sendEmail(notification: EmailNotification) {
    try {
      const resend = await getResend();
      const template = await this.getEmailTemplate(notification.template, notification.data);

      console.log(`Attempting to send email: ${notification.template} to ${notification.to}`);
      console.log(`Email config:`, {
        from: EMAIL_CONFIG.FROM,
        to: notification.to,
        subject: notification.subject,
      });

      const result = await resend.emails.send({
        from: EMAIL_CONFIG.FROM,
        to: notification.to,
        replyTo: EMAIL_CONFIG.REPLY_TO,
        subject: notification.subject,
        html: template,
      });

      console.log(
        `Email sent successfully: ${notification.template} to ${notification.to}`,
        result
      );
      return result;
    } catch (error) {
      console.error(`Failed to send email: ${notification.template} to ${notification.to}`, error);
      throw error;
    }
  }

  private static async sendDigestEmail(recipient: string, notifications: EmailNotification[]) {
    try {
      const resend = await getResend();
      const digestData = {
        notifications: notifications.map((n) => ({
          type: n.template,
          subject: n.subject,
          data: n.data,
        })),
        count: notifications.length,
      };

      const template = await this.getEmailTemplate('notification-digest', digestData);

      await resend.emails.send({
        from: EMAIL_CONFIG.FROM,
        to: recipient,
        replyTo: EMAIL_CONFIG.REPLY_TO,
        subject: `${notifications.length} Updates from Pixel Boba`,
        html: template,
      });

      console.log(`Digest email sent to ${recipient} with ${notifications.length} notifications`);
    } catch (error) {
      console.error('Failed to send digest email:', error);
    }
  }

  private static async getEmailTemplate(
    template: string,
    data: Record<string, any>
  ): Promise<string> {
    // This would typically load from a template system or database
    // For now, we'll generate inline templates
    return generateEmailTemplate(template as EmailTemplate, data);
  }
}

// Template generator function
function generateEmailTemplate(template: EmailTemplate, data: Record<string, any>): string {
  const baseStyles = `
    <style>
      body { 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
        margin: 0; 
        padding: 0; 
        background-color: #FEF3C7; 
      }
      .container { 
        max-width: 600px; 
        margin: 0 auto; 
        background: white; 
        border-radius: 16px; 
        overflow: hidden; 
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      }
      .header { 
        background: linear-gradient(135deg, #A78BFA 0%, #D97706 100%); 
        padding: 24px; 
        text-align: center; 
      }
      .content { 
        padding: 32px 24px; 
      }
      .footer { 
        background: #F9FAFB; 
        padding: 24px; 
        text-align: center; 
        font-size: 14px; 
        color: #6B7280; 
      }
      .button {
        display: inline-block;
        background: linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%);
        color: white;
        padding: 12px 24px;
        text-decoration: none;
        border-radius: 8px;
        font-weight: 600;
        margin: 16px 0;
      }
      .highlight { 
        background: linear-gradient(135deg, #A78BFA20 0%, #D9770620 100%); 
        padding: 16px; 
        border-radius: 8px; 
        margin: 16px 0; 
      }
    </style>
  `;

  const header = `
    <div class="header">
      <img src="https://pixelboba.com/Pixel_Boba_Icon_PNG.png" alt="Pixel Boba" style="width: 48px; height: 48px; margin-bottom: 16px;">
      <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">pixel boba</h1>
    </div>
  `;

  const footer = `
    <div class="footer">
      <p>You're receiving this because you're a valued Pixel Boba client.</p>
      <p>
        <a href="https://pixelboba.com/portal" style="color: #A78BFA;">View Portal</a> | 
        <a href="mailto:hello@pixelboba.com" style="color: #A78BFA;">Contact Us</a> | 
        <a href="#" style="color: #6B7280;">Unsubscribe</a>
      </p>
      <p style="font-size: 12px; margin-top: 16px;">
        © ${new Date().getFullYear()} Pixel Boba LLC. All rights reserved.
      </p>
    </div>
  `;

  let content = '';

  switch (template) {
    case 'new-message':
      content = `
        <div class="content">
          <h2 style="color: #1F2937; margin-bottom: 16px;">new message from your team 💬</h2>
          <p>Hi ${data.clientName},</p>
          <p>You have a new message regarding <strong>${data.projectName}</strong>:</p>
          <div class="highlight">
            <p style="margin: 0;"><strong>${data.senderName}</strong> says:</p>
            <p style="margin: 8px 0 0 0; font-style: italic;">"${data.messagePreview}"</p>
          </div>
          <a href="${data.portalUrl}/messages" class="button">View Message →</a>
          <p style="font-size: 14px; color: #6B7280;">You can reply directly in your portal or by responding to this email.</p>
        </div>
      `;
      break;

    case 'milestone-completed':
      content = `
        <div class="content">
          <h2 style="color: #1F2937; margin-bottom: 16px;">milestone completed! 🎉</h2>
          <p>Hi ${data.clientName},</p>
          <p>Great news! We've completed the <strong>${data.milestoneName}</strong> milestone for <strong>${data.projectName}</strong>.</p>
          <div class="highlight">
            <h3 style="margin: 0 0 8px 0; color: #10B981;">✅ ${data.milestoneName}</h3>
            <p style="margin: 0;">${data.milestoneDescription}</p>
            <p style="margin: 8px 0 0 0; font-size: 14px; color: #6B7280;">
              Completed on ${new Date(data.completedAt).toLocaleDateString()}
            </p>
          </div>
          <p><strong>What's next:</strong> ${data.nextSteps}</p>
          <a href="${data.portalUrl}" class="button">View Project Progress →</a>
        </div>
      `;
      break;

    case 'project-update':
      content = `
        <div class="content">
          <h2 style="color: #1F2937; margin-bottom: 16px;">project update 📊</h2>
          <p>Hi ${data.clientName},</p>
          <p>Here's the latest update on <strong>${data.projectName}</strong>:</p>
          <div class="highlight">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <span style="font-weight: 600;">Progress</span>
              <span style="font-weight: 600; color: #A78BFA;">${data.progress}%</span>
            </div>
            <div style="background: #E5E7EB; height: 8px; border-radius: 4px;">
              <div style="background: linear-gradient(90deg, #A78BFA 0%, #D97706 100%); height: 8px; border-radius: 4px; width: ${data.progress}%;"></div>
            </div>
            <p style="margin: 12px 0 0 0; font-size: 14px; color: #6B7280;">
              Current Phase: <strong>${data.currentPhase}</strong>
            </p>
          </div>
          <p><strong>Recent Changes:</strong></p>
          <ul>
            ${data.updates?.map((update: string) => `<li>${update}</li>`).join('') || '<li>No recent updates</li>'}
          </ul>
          <a href="${data.portalUrl}" class="button">View Full Project →</a>
        </div>
      `;
      break;

    case 'invoice-ready':
      content = `
        <div class="content">
          <h2 style="color: #1F2937; margin-bottom: 16px;">invoice ready for payment 💰</h2>
          <p>Hi ${data.clientName},</p>
          <p>Your invoice for <strong>${data.projectName}</strong> is ready for review and payment.</p>
          <div class="highlight">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>Invoice #${data.invoiceNumber}</span>
              <span style="font-weight: 600;">$${data.amount}</span>
            </div>
            <div style="font-size: 14px; color: #6B7280;">
              Due: ${new Date(data.dueDate).toLocaleDateString()}
            </div>
          </div>
          <a href="${data.portalUrl}/invoices" class="button">View & Pay Invoice →</a>
          <p style="font-size: 14px; color: #6B7280;">Secure payment processing via Stripe. Questions? Just reply to this email.</p>
        </div>
      `;
      break;

    case 'files-uploaded':
      content = `
        <div class="content">
          <h2 style="color: #1F2937; margin-bottom: 16px;">new files uploaded 📁</h2>
          <p>Hi ${data.clientName},</p>
          <p>We've uploaded new files to <strong>${data.projectName}</strong> for your review:</p>
          <div class="highlight">
            <ul style="margin: 0; padding-left: 20px;">
              ${
                data.files
                  ?.map(
                    (file: any) => `
                <li style="margin: 4px 0;">
                  <strong>${file.name}</strong> 
                  <span style="color: #6B7280; font-size: 14px;">(${file.type})</span>
                </li>
              `
                  )
                  .join('') || '<li>File details not available</li>'
              }
            </ul>
          </div>
          <a href="${data.portalUrl}/files" class="button">Download Files →</a>
          <p style="font-size: 14px; color: #6B7280;">Files are available for download for 30 days. Need an extension? Let us know!</p>
        </div>
      `;
      break;

    case 'contract-pending':
      content = `
        <div class="content">
          <h2 style="color: #1F2937; margin-bottom: 16px;">contract ready for signature 📋</h2>
          <p>Hi ${data.clientName},</p>
          <p>Your contract for <strong>${data.projectName}</strong> is ready for your signature:</p>
          <div class="highlight">
            <h3 style="margin: 0 0 8px 0; color: #A78BFA;">📋 ${data.contractTitle}</h3>
            <p style="margin: 0; font-size: 14px; color: #6B7280;">Status: Awaiting Your Signature</p>
          </div>
          <p><strong>Next Steps:</strong></p>
          <ul>
            <li>Review the contract terms carefully</li>
            <li>Sign electronically via DocuSign or manual signature</li>
            <li>Contact us if you have any questions</li>
          </ul>
          <a href="${data.portalUrl}" class="button">Review & Sign Contract →</a>
          <p style="font-size: 14px; color: #6B7280;">Secure signing powered by DocuSign. Questions? Just reply to this email.</p>
        </div>
      `;
      break;

    case 'contract-completed':
      content = `
        <div class="content">
          <h2 style="color: #1F2937; margin-bottom: 16px;">contract signed successfully! ✅</h2>
          <p>Hi ${data.clientName},</p>
          <p>Great news! Your contract <strong>${data.contractTitle}</strong> has been successfully signed and is now active.</p>
          <div class="highlight">
            <h3 style="margin: 0 0 8px 0; color: #10B981;">✅ ${data.contractTitle}</h3>
            <p style="margin: 0; font-size: 14px; color: #6B7280;">Status: Signed & Active</p>
            <p style="margin: 8px 0 0 0; font-size: 14px; color: #6B7280;">
              Project: ${data.projectName}
            </p>
          </div>
          <p><strong>What happens next:</strong></p>
          <ul>
            <li>We'll begin work as outlined in the contract</li>
            <li>You'll receive regular project updates</li>
            <li>A signed copy is available in your portal</li>
          </ul>
          <a href="${data.portalUrl}" class="button">View Contract →</a>
        </div>
      `;
      break;

    case 'contract-expired':
      content = `
        <div class="content">
          <h2 style="color: #1F2937; margin-bottom: 16px;">contract has expired ⏰</h2>
          <p>Hi ${data.clientName},</p>
          <p>The contract <strong>${data.contractTitle}</strong> for <strong>${data.projectName}</strong> has expired without being signed.</p>
          <div class="highlight">
            <h3 style="margin: 0 0 8px 0; color: #EF4444;">⏰ ${data.contractTitle}</h3>
            <p style="margin: 0; font-size: 14px; color: #6B7280;">Status: Expired</p>
          </div>
          <p><strong>Next Steps:</strong></p>
          <ul>
            <li>Contact us if you still want to proceed</li>
            <li>We can create a new contract with updated terms</li>
            <li>No action needed if you've decided not to proceed</li>
          </ul>
          <a href="mailto:hello@pixelboba.com" class="button">Contact Us →</a>
        </div>
      `;
      break;

    case 'contract-update':
      content = `
        <div class="content">
          <h2 style="color: #1F2937; margin-bottom: 16px;">contract status update 📋</h2>
          <p>Hi ${data.clientName},</p>
          <p>There's an update on your contract <strong>${data.contractTitle}</strong> for <strong>${data.projectName}</strong>.</p>
          <div class="highlight">
            <h3 style="margin: 0 0 8px 0; color: #8B5CF6;">📋 ${data.contractTitle}</h3>
            <p style="margin: 0; font-size: 14px; color: #6B7280;">Status: ${data.status}</p>
          </div>
          <p>You can view the full contract details in your portal.</p>
          <a href="${data.portalUrl}" class="button">View Contract →</a>
        </div>
      `;
      break;

    default:
      content = `
        <div class="content">
          <h2 style="color: #1F2937;">Notification from Pixel Boba</h2>
          <p>You have a new notification from your project team.</p>
          <a href="${data.portalUrl || 'https://pixelboba.com/portal'}" class="button">View Portal →</a>
        </div>
      `;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Pixel Boba Notification</title>
      ${baseStyles}
    </head>
    <body>
      <div style="padding: 24px;">
        <div class="container">
          ${header}
          ${content}
          ${footer}
        </div>
      </div>
    </body>
    </html>
  `;
}

// Helper functions for sending specific notification types
export const sendProjectUpdate = (to: string, data: any) => {
  EmailQueue.add({
    to,
    template: EMAIL_TEMPLATES.PROJECT_UPDATE,
    subject: `Project Update: ${data.projectName}`,
    data,
    priority: 'normal',
  });
};

export const sendNewMessage = (to: string, data: any) => {
  EmailQueue.add({
    to,
    template: EMAIL_TEMPLATES.NEW_MESSAGE,
    subject: `💬 New message from ${data.senderName}`,
    data,
    priority: 'high',
  });
};

export const sendMilestoneCompleted = (to: string, data: any) => {
  EmailQueue.add({
    to,
    template: EMAIL_TEMPLATES.MILESTONE_COMPLETED,
    subject: `🎉 Milestone completed: ${data.milestoneName}`,
    data,
    priority: 'high',
  });
};

export const sendInvoiceReady = (to: string, data: any) => {
  EmailQueue.add({
    to,
    template: EMAIL_TEMPLATES.INVOICE_READY,
    subject: `💰 Invoice ready: ${data.projectName}`,
    data,
    priority: 'high',
  });
};

export const sendFilesUploaded = (to: string, data: any) => {
  EmailQueue.add({
    to,
    template: EMAIL_TEMPLATES.FILES_UPLOADED,
    subject: `📁 New files uploaded: ${data.projectName}`,
    data,
    priority: 'normal',
  });
};
