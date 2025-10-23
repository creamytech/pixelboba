import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import speakeasy from 'speakeasy';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { twoFactorSecret: true, twoFactorEnabled: true },
    });

    if (!user?.twoFactorEnabled) {
      return NextResponse.json({ error: '2FA not enabled' }, { status: 400 });
    }

    if (!user.twoFactorSecret) {
      return NextResponse.json({ error: '2FA secret not found' }, { status: 400 });
    }

    // Verify token before disabling
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: token,
      window: 2,
    });

    if (!verified) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    // Disable 2FA
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
        twoFactorBackupCodes: null,
      },
    });

    return NextResponse.json({ success: true, message: '2FA disabled' });
  } catch (error) {
    console.error('2FA disable error:', error);
    return NextResponse.json({ error: 'Failed to disable 2FA' }, { status: 500 });
  }
}
