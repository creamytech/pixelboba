import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const { prisma } = await import('@/lib/prisma');

      // Find user
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Get all invoices for this client
      const invoices = await prisma.invoice.findMany({
        where: { clientId: user.id },
        include: {
          items: true,
          project: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json({ invoices });
    } catch (dbError) {
      console.error('Database error fetching portal invoices:', dbError);
      return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in portal invoices API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
