import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

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
      let totalAmount = currentInvoice.totalAmount;
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

      // Create Stripe customer if doesn't exist
      let stripeCustomerId = invoice.client.stripeCustomerId;
      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: invoice.client.email,
          name: invoice.client.name || undefined,
        });
        stripeCustomerId = customer.id;

        // Update user with Stripe customer ID
        await prisma.user.update({
          where: { id: invoice.clientId },
          data: { stripeCustomerId },
        });
      }

      // Create Stripe invoice
      const stripeInvoice = await stripe.invoices.create({
        customer: stripeCustomerId,
        description: invoice.title,
        due_date: Math.floor(invoice.dueDate.getTime() / 1000),
        metadata: {
          invoiceId: invoice.id,
          projectId: invoice.projectId || '',
        },
      });

      // Add invoice items to Stripe
      for (const item of invoice.items) {
        await stripe.invoiceItems.create({
          customer: stripeCustomerId,
          invoice: stripeInvoice.id,
          description: item.description,
          quantity: item.quantity,
          unit_amount: Math.round(item.rate * 100), // Convert to cents
        });
      }

      // Finalize and send the invoice
      const finalizedInvoice = await stripe.invoices.finalizeInvoice(stripeInvoice.id);
      await stripe.invoices.sendInvoice(stripeInvoice.id);

      // Update our database
      const updatedInvoice = await prisma.invoice.update({
        where: { id: params.id },
        data: {
          status: 'SENT',
          stripeInvoiceId: stripeInvoice.id,
          sentAt: new Date(),
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
        stripeInvoiceUrl: finalizedInvoice.hosted_invoice_url,
      });
    } catch (dbError) {
      console.error('Database error sending invoice:', dbError);
      return NextResponse.json({ error: 'Failed to send invoice' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in send invoice API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
