import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import Stripe from 'stripe';
import { getSettingValue } from '@/lib/settings';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
      const { prisma } = await import('@/lib/prisma');

      const invoice = await prisma.invoice.findUnique({
        where: { id: params.id },
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          project: {
            select: {
              id: true,
              name: true,
            },
          },
          items: true,
        },
      });

      if (!invoice) {
        return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
      }

      return NextResponse.json({ invoice });
    } catch (dbError) {
      console.error('Database error fetching invoice:', dbError);
      return NextResponse.json({ error: 'Failed to fetch invoice' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in get invoice API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { title, dueDate, items, notes, status } = body;

    try {
      const { prisma } = await import('@/lib/prisma');

      // First, get the current invoice
      const currentInvoice = await prisma.invoice.findUnique({
        where: { id: params.id },
        include: { items: true },
      });

      if (!currentInvoice) {
        return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
      }

      // Calculate new total amount if items provided
      let totalAmount = Number(currentInvoice.totalAmount);
      if (items && Array.isArray(items)) {
        totalAmount = items.reduce((sum: number, item: any) => {
          return sum + item.quantity * item.rate;
        }, 0);
      }

      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (dueDate !== undefined) updateData.dueDate = new Date(dueDate);
      if (notes !== undefined) updateData.notes = notes;
      if (status !== undefined) updateData.status = status;
      if (items !== undefined) updateData.totalAmount = totalAmount;

      const invoice = await prisma.invoice.update({
        where: { id: params.id },
        data: updateData,
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          project: {
            select: {
              id: true,
              name: true,
            },
          },
          items: true,
        },
      });

      // Update items if provided
      if (items && Array.isArray(items)) {
        // Delete existing items
        await prisma.invoiceItem.deleteMany({
          where: { invoiceId: params.id },
        });

        // Create new items
        await prisma.invoiceItem.createMany({
          data: items.map((item: any) => ({
            invoiceId: params.id,
            description: item.description,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.quantity * item.rate,
          })),
        });
      }

      // Create activity log
      await prisma.activity.create({
        data: {
          action: 'invoice_updated',
          description: `Invoice ${invoice.number} updated`,
          userId: session.user.id,
          projectId: invoice.projectId,
        },
      });

      return NextResponse.json({ invoice });
    } catch (dbError) {
      console.error('Database error updating invoice:', dbError);
      return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in update invoice API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
      const { prisma } = await import('@/lib/prisma');

      const invoice = await prisma.invoice.findUnique({
        where: { id: params.id },
      });

      if (!invoice) {
        return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
      }

      // Delete invoice items first
      await prisma.invoiceItem.deleteMany({
        where: { invoiceId: params.id },
      });

      // Delete invoice
      await prisma.invoice.delete({
        where: { id: params.id },
      });

      // Create activity log
      await prisma.activity.create({
        data: {
          action: 'invoice_deleted',
          description: `Invoice ${invoice.number} deleted`,
          userId: session.user.id,
          projectId: invoice.projectId,
        },
      });

      return NextResponse.json({ success: true });
    } catch (dbError) {
      console.error('Database error deleting invoice:', dbError);
      return NextResponse.json({ error: 'Failed to delete invoice' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in delete invoice API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Send invoice via Stripe
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { action } = await request.json();

    if (action !== 'send') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    try {
      const { prisma } = await import('@/lib/prisma');

      // Get Stripe secret key from settings or fallback to environment variable
      const stripeSecretKey =
        (await getSettingValue('payments.stripeSecretKey')) || process.env.STRIPE_SECRET_KEY;

      console.log('Debug - Stripe key check:', {
        hasSettingsKey: !!(await getSettingValue('payments.stripeSecretKey')),
        hasEnvKey: !!process.env.STRIPE_SECRET_KEY,
        finalKey: stripeSecretKey ? `${stripeSecretKey.substring(0, 7)}...` : 'none',
      });

      if (!stripeSecretKey) {
        console.log('Debug - No Stripe key found');
        return NextResponse.json(
          {
            error:
              'Stripe not configured. Please add your Stripe secret key in Admin Settings > Payments or environment variables.',
          },
          { status: 400 }
        );
      }

      // Initialize Stripe with the secret key from settings
      const stripe = new Stripe(stripeSecretKey, {
        apiVersion: '2025-08-27.basil',
      });

      const invoice = await prisma.invoice.findUnique({
        where: { id: params.id },
        include: {
          client: true,
          items: true,
          project: true,
        },
      });

      if (!invoice) {
        return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
      }

      if (invoice.status !== 'DRAFT') {
        return NextResponse.json({ error: 'Invoice has already been sent' }, { status: 400 });
      }

      // Create Stripe customer - always create new for now since User model doesn't have stripeCustomerId
      console.log('Debug - Creating Stripe customer for:', invoice.client.email);
      const customer = await stripe.customers.create({
        email: invoice.client.email,
        name: invoice.client.name || undefined,
      });
      const stripeCustomerId = customer.id;
      console.log('Debug - Stripe customer created:', stripeCustomerId);

      // Create Stripe invoice
      console.log('Debug - Creating Stripe invoice');
      const stripeInvoice = await stripe.invoices.create({
        customer: stripeCustomerId,
        description: invoice.title,
        collection_method: 'send_invoice',
        due_date: Math.floor(invoice.dueDate.getTime() / 1000),
        metadata: {
          invoiceId: invoice.id,
          projectId: invoice.projectId || '',
        },
      });
      console.log('Debug - Stripe invoice created:', stripeInvoice.id);

      // Add invoice items to Stripe
      for (const item of invoice.items) {
        await stripe.invoiceItems.create({
          customer: stripeCustomerId,
          invoice: stripeInvoice.id,
          description: item.description,
          amount: Math.round(Number(item.rate) * item.quantity * 100), // Convert to cents and multiply by quantity
        });
      }

      // Finalize and send the invoice
      let finalizedInvoice = null;
      if (stripeInvoice.id) {
        finalizedInvoice = await stripe.invoices.finalizeInvoice(stripeInvoice.id);
        await stripe.invoices.sendInvoice(stripeInvoice.id);
      }

      // Update our database
      const updatedInvoice = await prisma.invoice.update({
        where: { id: params.id },
        data: {
          status: 'SENT',
          stripeInvoiceId: stripeInvoice.id,
        },
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          project: {
            select: {
              id: true,
              name: true,
            },
          },
          items: true,
        },
      });

      // Create activity log
      await prisma.activity.create({
        data: {
          action: 'invoice_sent',
          description: `Invoice ${invoice.number} sent to ${invoice.client.name}`,
          userId: session.user.id,
          projectId: invoice.projectId,
        },
      });

      return NextResponse.json({
        invoice: updatedInvoice,
        stripeInvoiceUrl: finalizedInvoice?.hosted_invoice_url,
      });
    } catch (dbError) {
      console.error('Database error sending invoice:', dbError);
      return NextResponse.json({ error: `Database error: ${dbError}` }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in send invoice API:', error);
    // Check if it's a Stripe error
    if (error instanceof Error) {
      return NextResponse.json({ error: `Stripe/API error: ${error.message}` }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
