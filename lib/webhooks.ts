import { prisma } from './prisma';
import crypto from 'crypto';

export const WEBHOOK_EVENTS = {
  // Project events
  PROJECT_CREATED: 'project.created',
  PROJECT_UPDATED: 'project.updated',
  PROJECT_STATUS_CHANGED: 'project.status_changed',

  // Task events
  TASK_CREATED: 'task.created',
  TASK_UPDATED: 'task.updated',
  TASK_COMPLETED: 'task.completed',
  TASK_DELETED: 'task.deleted',

  // Invoice events
  INVOICE_CREATED: 'invoice.created',
  INVOICE_SENT: 'invoice.sent',
  INVOICE_PAID: 'invoice.paid',

  // Contract events
  CONTRACT_SENT: 'contract.sent',
  CONTRACT_SIGNED: 'contract.signed',

  // File events
  FILE_UPLOADED: 'file.uploaded',

  // Message events
  MESSAGE_SENT: 'message.sent',
} as const;

export type WebhookEvent = (typeof WEBHOOK_EVENTS)[keyof typeof WEBHOOK_EVENTS];

interface WebhookPayload {
  event: WebhookEvent;
  timestamp: string;
  data: any;
}

// Sign payload with HMAC SHA256
function signPayload(payload: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

// Trigger webhooks for a specific event
export async function triggerWebhooks(userId: string, event: WebhookEvent, data: any) {
  try {
    // Find all active webhooks for this user that subscribe to this event
    const webhooks = await prisma.webhook.findMany({
      where: {
        userId,
        isActive: true,
        events: {
          has: event,
        },
      },
    });

    if (webhooks.length === 0) {
      return;
    }

    // Trigger all webhooks in parallel
    const promises = webhooks.map((webhook) => deliverWebhook(webhook, event, data));

    await Promise.allSettled(promises);
  } catch (error) {
    console.error('Failed to trigger webhooks:', error);
  }
}

// Deliver a single webhook
async function deliverWebhook(
  webhook: { id: string; url: string; secret: string },
  event: WebhookEvent,
  data: any
) {
  const payload: WebhookPayload = {
    event,
    timestamp: new Date().toISOString(),
    data,
  };

  const payloadString = JSON.stringify(payload);
  const signature = signPayload(payloadString, webhook.secret);

  let success = false;
  let statusCode: number | null = null;
  let response: string | null = null;

  try {
    const res = await fetch(webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
        'X-Webhook-Event': event,
      },
      body: payloadString,
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    statusCode = res.status;
    response = await res.text();
    success = res.ok;
  } catch (error) {
    success = false;
    response = error instanceof Error ? error.message : 'Unknown error';
  }

  // Record delivery
  await prisma.webhookDelivery.create({
    data: {
      webhookId: webhook.id,
      event,
      payload: payloadString,
      response,
      statusCode,
      success,
      attempts: 1,
      nextRetry: success ? null : new Date(Date.now() + 5 * 60 * 1000), // Retry in 5 minutes
    },
  });

  return success;
}

// Retry failed webhook deliveries
export async function retryFailedDeliveries() {
  const failedDeliveries = await prisma.webhookDelivery.findMany({
    where: {
      success: false,
      attempts: {
        lt: 3, // Max 3 attempts
      },
      nextRetry: {
        lte: new Date(),
      },
    },
    include: {
      webhook: true,
    },
    take: 50, // Process 50 at a time
  });

  for (const delivery of failedDeliveries) {
    if (!delivery.webhook.isActive) continue;

    const payload = JSON.parse(delivery.payload);
    const signature = signPayload(delivery.payload, delivery.webhook.secret);

    let success = false;
    let statusCode: number | null = null;
    let response: string | null = null;

    try {
      const res = await fetch(delivery.webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': signature,
          'X-Webhook-Event': delivery.event,
        },
        body: delivery.payload,
        signal: AbortSignal.timeout(30000),
      });

      statusCode = res.status;
      response = await res.text();
      success = res.ok;
    } catch (error) {
      success = false;
      response = error instanceof Error ? error.message : 'Unknown error';
    }

    // Update delivery record
    await prisma.webhookDelivery.update({
      where: { id: delivery.id },
      data: {
        response,
        statusCode,
        success,
        attempts: delivery.attempts + 1,
        nextRetry: success
          ? null
          : new Date(Date.now() + Math.pow(2, delivery.attempts) * 5 * 60 * 1000), // Exponential backoff
      },
    });
  }
}

// Verify webhook signature
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = signPayload(payload, secret);
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}
