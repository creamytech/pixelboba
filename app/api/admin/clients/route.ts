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

      const clients = await prisma.user.findMany({
        where: {
          role: 'CLIENT',
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          phone: true,
          company: true,
          image: true,
          emailVerified: true,
          createdAt: true,
          _count: {
            select: {
              projects: true,
              sentMessages: true,
            },
          },
          projects: {
            select: {
              id: true,
              name: true,
              status: true,
              progress: true,
              createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 3,
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json({ clients });
    } catch (dbError) {
      console.error('Database error in admin clients:', dbError);
      return NextResponse.json({ clients: [] });
    }
  } catch (error) {
    console.error('Error in admin clients API:', error);
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
    const { name, email, phone, company } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    try {
      const { prisma } = await import('@/lib/prisma');

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
      }

      const client = await prisma.user.create({
        data: {
          name,
          email,
          phone: phone || null,
          company: company || null,
          role: 'CLIENT',
          emailVerified: new Date(),
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          phone: true,
          company: true,
          createdAt: true,
        },
      });

      // Create activity log
      await prisma.activity.create({
        data: {
          action: 'client_created',
          description: `Client "${name}" (${email}) created`,
          userId: session.user.id,
        },
      });

      return NextResponse.json({ client });
    } catch (dbError) {
      console.error('Database error creating client:', dbError);
      return NextResponse.json({ error: 'Failed to create client' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in create client API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
