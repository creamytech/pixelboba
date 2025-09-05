import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { invoiceId } = await request.json();

    if (!invoiceId) {
      return NextResponse.json({ error: 'Invoice ID is required' }, { status: 400 });
    }

    try {
      const { prisma } = await import('@/lib/prisma');

      // Find user
      const user: any = await prisma.user.findUnique({
        where: { email: session.user.email! },
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Verify invoice belongs to this client
      const invoice = await prisma.invoice.findFirst({
        where: {
          id: invoiceId,
          clientId: user.id,
        },
        include: {
          items: true,
        },
      });

      if (!invoice) {
        return NextResponse.json({ error: 'Invoice not found or access denied' }, { status: 404 });
      }

      if (invoice.status === 'PAID') {
        return NextResponse.json({ error: 'Invoice is already paid' }, { status: 400 });
      }

      // Create Stripe checkout session
      const stripe = (await import('stripe')).default;
      const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2025-08-27.basil',
      });

      const lineItems = invoice.items.map((item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.description,
          },
          unit_amount: Math.round(Number(item.rate) * 100), // Convert to cents
        },
        quantity: item.quantity,
      }));

      const stripeSession = await stripeClient.checkout.sessions.create({
        line_items: lineItems,
        mode: 'payment',
        success_url: `${process.env.NEXTAUTH_URL}/portal?payment=success&invoice=${invoice.id}`,
        cancel_url: `${process.env.NEXTAUTH_URL}/portal?payment=cancelled`,
        metadata: {
          invoiceId: invoice.id,
          clientId: user.id,
        },
        customer_email: user.email,
      });

      return NextResponse.json({ url: stripeSession.url });
    } catch (dbError) {
      console.error('Database error creating payment session:', dbError);
      return NextResponse.json({ error: 'Failed to create payment session' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in portal invoice payment API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
