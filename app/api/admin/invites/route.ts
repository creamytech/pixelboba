import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

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

      const invites = await prisma.invite.findMany({
        include: {
          createdBy: {
            select: {
              name: true,
              email: true,
            },
          },
          usedBy: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json({ invites });
    } catch (dbError) {
      console.error('Database error fetching invites:', dbError);
      return NextResponse.json({ error: 'Failed to fetch invites' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in admin invites API:', error);
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

    const { email, role = 'CLIENT', expiresInDays = 7 } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    try {
      const { prisma } = await import('@/lib/prisma');

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 });
      }

      // Check if there's already a pending invite for this email
      const existingInvite = await prisma.invite.findFirst({
        where: {
          email,
          usedAt: null,
          expiresAt: { gte: new Date() },
        },
      });

      if (existingInvite) {
        return NextResponse.json(
          { error: 'Pending invite already exists for this email' },
          { status: 400 }
        );
      }

      // Create new invite
      const token = uuidv4();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);

      const invite = await prisma.invite.create({
        data: {
          email,
          token,
          role,
          expiresAt,
          createdById: session.user.id,
        },
        include: {
          createdBy: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      // Generate invite URL
      const inviteUrl = `${process.env.NEXTAUTH_URL}/signup?invite=${token}`;

      return NextResponse.json({ invite, inviteUrl });
    } catch (dbError) {
      console.error('Database error creating invite:', dbError);
      return NextResponse.json({ error: 'Failed to create invite' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in admin invites API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
