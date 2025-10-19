/**
 * Workflow Automation Engine
 * Handles automated tasks like invoice reminders, project phase auto-advancement, etc.
 */

import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

export interface AutomationRule {
  id: string;
  name: string;
  type: 'INVOICE_REMINDER' | 'PROJECT_MILESTONE' | 'CONTRACT_EXPIRY' | 'PAYMENT_FOLLOWUP';
  enabled: boolean;
  conditions: Record<string, any>;
  actions: Record<string, any>;
}

/**
 * Check for overdue invoices and send reminders
 */
export async function processInvoiceReminders() {
  console.log('[Automation] Checking for overdue invoices...');

  try {
    const now = new Date();

    // Find invoices that are past due date with status SENT
    const overdueInvoices = await prisma.invoice.findMany({
      where: {
        status: 'SENT',
        dueDate: {
          lt: now,
        },
      },
      include: {
        client: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        project: {
          select: {
            name: true,
          },
        },
      },
    });

    console.log(`[Automation] Found ${overdueInvoices.length} overdue invoices`);

    for (const invoice of overdueInvoices) {
      const daysOverdue = Math.floor(
        (now.getTime() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24)
      );

      // Send reminder email
      await sendInvoiceReminder(invoice, daysOverdue);

      // Create notification for client
      await prisma.notification.create({
        data: {
          recipientId: invoice.clientId,
          type: 'INVOICE',
          title: 'Invoice Payment Reminder',
          message: `Invoice ${invoice.number} is ${daysOverdue} days overdue. Amount: $${invoice.totalAmount}`,
          isRead: false,
        },
      });

      console.log(
        `[Automation] Sent reminder for invoice ${invoice.number} (${daysOverdue} days overdue)`
      );
    }

    return {
      success: true,
      processed: overdueInvoices.length,
    };
  } catch (error) {
    console.error('[Automation] Error processing invoice reminders:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send invoice reminder email
 */
async function sendInvoiceReminder(invoice: any, daysOverdue: number) {
  const subject = `Payment Reminder: Invoice ${invoice.number} (${daysOverdue} days overdue)`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #8B5CF6;">Payment Reminder</h2>

      <p>Hello ${invoice.client.name || 'valued client'},</p>

      <p>This is a friendly reminder that the following invoice is now <strong>${daysOverdue} days overdue</strong>:</p>

      <div style="background: #F3E8D2; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Invoice #:</strong> ${invoice.number}</p>
        <p style="margin: 5px 0;"><strong>Amount:</strong> $${invoice.totalAmount.toString()}</p>
        <p style="margin: 5px 0;"><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
        ${invoice.project ? `<p style="margin: 5px 0;"><strong>Project:</strong> ${invoice.project.name}</p>` : ''}
      </div>

      <p>Please submit payment at your earliest convenience to avoid any late fees.</p>

      ${
        invoice.stripeInvoiceUrl
          ? `<p><a href="${invoice.stripeInvoiceUrl}" style="background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Pay Invoice</a></p>`
          : ''
      }

      <p>If you have any questions or concerns, please don't hesitate to reach out.</p>

      <p style="margin-top: 30px;">Thank you for your business!</p>

      <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;" />

      <p style="color: #6B7280; font-size: 12px;">This is an automated reminder from your portal.</p>
    </div>
  `;

  try {
    await sendEmail({
      to: invoice.client.email,
      subject,
      html: htmlContent,
    });

    return true;
  } catch (error) {
    console.error(`[Automation] Failed to send reminder email to ${invoice.client.email}:`, error);
    return false;
  }
}

/**
 * Check for contracts expiring soon
 */
export async function processContractExpiryReminders() {
  console.log('[Automation] Checking for expiring contracts...');

  try {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    // Find contracts expiring in the next 30 days
    const expiringContracts = await prisma.contract.findMany({
      where: {
        status: 'SIGNED',
        expiresAt: {
          gte: now,
          lte: thirtyDaysFromNow,
        },
      },
      include: {
        client: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    console.log(`[Automation] Found ${expiringContracts.length} expiring contracts`);

    for (const contract of expiringContracts) {
      const daysUntilExpiry = Math.floor(
        (new Date(contract.expiresAt!).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Create notification
      await prisma.notification.create({
        data: {
          recipientId: contract.clientId,
          type: 'CONTRACT',
          title: 'Contract Expiring Soon',
          message: `Your contract "${contract.title}" will expire in ${daysUntilExpiry} days.`,
          isRead: false,
        },
      });

      console.log(
        `[Automation] Created expiry notification for contract ${contract.title} (${daysUntilExpiry} days)`
      );
    }

    return {
      success: true,
      processed: expiringContracts.length,
    };
  } catch (error) {
    console.error('[Automation] Error processing contract expiry reminders:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Auto-advance project phases based on completion criteria
 */
export async function processProjectPhaseAdvancement() {
  console.log('[Automation] Checking for project phase advancement...');

  try {
    // Find active projects with all tasks completed (not COMPLETED, PAUSED, or CANCELLED)
    const projects = await prisma.project.findMany({
      where: {
        status: {
          notIn: ['COMPLETED', 'PAUSED', 'CANCELLED'],
        },
      },
      include: {
        tasks: {
          select: {
            status: true,
          },
        },
        client: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    let advancedCount = 0;

    for (const project of projects) {
      const totalTasks = project.tasks.length;
      const completedTasks = project.tasks.filter((t) => t.status === 'COMPLETED').length;

      // If all tasks are completed, mark project as completed
      if (totalTasks > 0 && completedTasks === totalTasks) {
        await prisma.project.update({
          where: { id: project.id },
          data: { status: 'COMPLETED' },
        });

        // Create notification for client
        await prisma.notification.create({
          data: {
            recipientId: project.clientId,
            type: 'PROJECT_UPDATE',
            title: 'Project Completed!',
            message: `Your project "${project.name}" has been completed. All tasks are done!`,
            isRead: false,
          },
        });

        advancedCount++;
        console.log(`[Automation] Auto-completed project: ${project.name}`);
      }
    }

    return {
      success: true,
      processed: advancedCount,
    };
  } catch (error) {
    console.error('[Automation] Error processing project phase advancement:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Run all automation workflows
 */
export async function runAllAutomations() {
  console.log('[Automation] Starting all automation workflows...');

  const results = {
    invoiceReminders: await processInvoiceReminders(),
    contractExpiry: await processContractExpiryReminders(),
    projectAdvancement: await processProjectPhaseAdvancement(),
    timestamp: new Date().toISOString(),
  };

  console.log('[Automation] All workflows completed:', results);

  return results;
}
