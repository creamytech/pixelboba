import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { getAdminSettings } from '@/lib/settings';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = headers().get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature provided' }, { status: 400 });
    }

    // Get Stripe webhook secret and API key
    const settings = await getAdminSettings();
    const stripeSecretKey = settings.payments.stripeSecretKey;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!stripeSecretKey || !webhookSecret) {
      console.error('Stripe not configured');
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
    }

    // Initialize Stripe
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-08-27.basil',
    });

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session, stripe);
        break;
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCreated(subscription);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

// Handle checkout session completed
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session, stripe: Stripe) {
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;
  const userEmail = session.metadata?.email || session.customer_details?.email;

  if (!userEmail) {
    console.error('No email found in checkout session');
    return;
  }

  // Find or create user
  let user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    // Generate a temporary password
    const tempPassword = generateRandomPassword();

    // Create new user account with temporary password
    const bcrypt = await import('bcrypt');
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    user = await prisma.user.create({
      data: {
        email: userEmail,
        name: session.customer_details?.name || undefined,
        phone: session.customer_details?.phone || undefined,
        password: hashedPassword,
        role: 'CLIENT',
      },
    });

    console.log(`Created new user: ${user.email}`);

    // TODO: Send welcome email with temporary password
    // For now, log the temp password (remove this in production!)
    console.log(`Temporary password for ${user.email}: ${tempPassword}`);
    // In production, you should send an email with a password reset link instead
  }

  // Get subscription details from Stripe
  if (subscriptionId) {
    const subscription = (await stripe.subscriptions.retrieve(
      subscriptionId
    )) as Stripe.Subscription;

    // Create or update subscription in database
    await prisma.subscription.upsert({
      where: { stripeSubscriptionId: subscriptionId },
      create: {
        userId: user.id,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        stripePriceId: subscription.items.data[0].price.id,
        status: mapStripeStatus(subscription.status),
        currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
        cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
        trialStart: (subscription as any).trial_start
          ? new Date((subscription as any).trial_start * 1000)
          : null,
        trialEnd: (subscription as any).trial_end
          ? new Date((subscription as any).trial_end * 1000)
          : null,
      },
      update: {
        status: mapStripeStatus(subscription.status),
        currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
        cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
      },
    });

    console.log(`Subscription created for user: ${user.email}`);
  }
}

// Handle subscription created
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const email = subscription.metadata?.email;

  if (!email) {
    console.error('No email in subscription metadata');
    return;
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.error(`User not found for email: ${email}`);
    return;
  }

  await prisma.subscription.upsert({
    where: { stripeSubscriptionId: subscription.id },
    create: {
      userId: user.id,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items.data[0].price.id,
      status: mapStripeStatus(subscription.status),
      currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
      trialStart: (subscription as any).trial_start
        ? new Date((subscription as any).trial_start * 1000)
        : null,
      trialEnd: (subscription as any).trial_end
        ? new Date((subscription as any).trial_end * 1000)
        : null,
    },
    update: {
      status: mapStripeStatus(subscription.status),
      currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
    },
  });

  console.log(`Subscription updated for user: ${email}`);
}

// Handle subscription updated
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  await prisma.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: mapStripeStatus(subscription.status),
      currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
      canceledAt: (subscription as any).canceled_at
        ? new Date((subscription as any).canceled_at * 1000)
        : null,
      trialStart: (subscription as any).trial_start
        ? new Date((subscription as any).trial_start * 1000)
        : null,
      trialEnd: (subscription as any).trial_end
        ? new Date((subscription as any).trial_end * 1000)
        : null,
    },
  });

  console.log(`Subscription updated: ${subscription.id}`);
}

// Handle subscription deleted
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await prisma.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: 'CANCELLED',
      canceledAt: new Date(),
    },
  });

  console.log(`Subscription cancelled: ${subscription.id}`);
}

// Handle invoice payment succeeded
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = (invoice as any).subscription as string;

  if (subscriptionId) {
    // Update subscription status
    await prisma.subscription.update({
      where: { stripeSubscriptionId: subscriptionId },
      data: {
        status: 'ACTIVE',
      },
    });

    console.log(`Payment succeeded for subscription: ${subscriptionId}`);
  }
}

// Handle invoice payment failed
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = (invoice as any).subscription as string;

  if (subscriptionId) {
    // Update subscription status to past due
    await prisma.subscription.update({
      where: { stripeSubscriptionId: subscriptionId },
      data: {
        status: 'PAST_DUE',
      },
    });

    console.log(`Payment failed for subscription: ${subscriptionId}`);

    // TODO: Send notification to user about payment failure
  }
}

// Map Stripe subscription status to our database status
function mapStripeStatus(
  stripeStatus: Stripe.Subscription.Status
): 'ACTIVE' | 'PAUSED' | 'CANCELLED' | 'PAST_DUE' | 'INCOMPLETE' | 'TRIALING' {
  switch (stripeStatus) {
    case 'active':
      return 'ACTIVE';
    case 'past_due':
      return 'PAST_DUE';
    case 'canceled':
      return 'CANCELLED';
    case 'incomplete':
    case 'incomplete_expired':
      return 'INCOMPLETE';
    case 'trialing':
      return 'TRIALING';
    case 'paused':
      return 'PAUSED';
    default:
      return 'INCOMPLETE';
  }
}

// Generate a random password
function generateRandomPassword(): string {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}
