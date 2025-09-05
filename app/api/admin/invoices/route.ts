import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
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

      const invoices = await prisma.invoice.findMany({
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
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json({ invoices });
    } catch (dbError) {
      console.error('Database error fetching invoices:', dbError);
      return NextResponse.json({ invoices: [] });
    }
  } catch (error) {
    console.error('Error in admin invoices API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { title, clientId, projectId, dueDate, items, notes } = body;

    if (!title || !clientId || !items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Title, client ID, and items are required' },
        { status: 400 }
      );
    }

    try {
      const { prisma } = await import('@/lib/prisma');

      // Calculate total amount
      const totalAmount = items.reduce((sum: number, item: any) => {
        return sum + item.quantity * item.rate;
      }, 0);

      // Generate invoice number
      const invoiceCount = await prisma.invoice.count();
      const invoiceNumber = `INV-${String(invoiceCount + 1).padStart(5, '0')}`;

      const invoice = await prisma.invoice.create({
        data: {
          number: invoiceNumber,
          title,
          clientId,
          projectId: projectId || null,
          issueDate: new Date(),
          dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          amount: totalAmount, // subtotal
          totalAmount, // total with tax
          status: 'DRAFT',
          description: notes || '',
          items: {
            create: items.map((item: any) => ({
              description: item.description,
              quantity: item.quantity,
              rate: item.rate,
              amount: item.quantity * item.rate,
            })),
          },
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
          action: 'invoice_created',
          description: `Invoice ${invoiceNumber} created for ${invoice.client.name}`,
          userId: session.user.id,
          projectId: projectId || null,
        },
      });

      return NextResponse.json({ invoice });
    } catch (dbError) {
      console.error('Database error creating invoice:', dbError);
      return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in create invoice API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
