import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    try {
      const { prisma } = await import('@/lib/prisma');

      const invite = await prisma.invite.findUnique({
        where: { token },
        select: {
          id: true,
          email: true,
          role: true,
          expiresAt: true,
          usedAt: true,
        },
      });

      if (!invite) {
        return NextResponse.json({
          valid: false,
          error: 'Invalid invite token',
        });
      }

      if (invite.usedAt) {
        return NextResponse.json({
          valid: false,
          error: 'Invite has already been used',
        });
      }

      if (invite.expiresAt < new Date()) {
        return NextResponse.json({
          valid: false,
          error: 'Invite has expired',
        });
      }

      return NextResponse.json({
        valid: true,
        invite: {
          email: invite.email,
          role: invite.role,
        },
      });
    } catch (dbError) {
      console.error('Database error validating invite:', dbError);
      return NextResponse.json({ error: 'Failed to validate invite' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in validate invite API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
