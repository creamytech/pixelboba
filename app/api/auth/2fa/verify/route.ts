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
      select: { twoFactorSecret: true, twoFactorBackupCodes: true },
    });

    if (!user?.twoFactorSecret) {
      return NextResponse.json({ error: '2FA not set up' }, { status: 400 });
    }

    // Verify token
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: token,
      window: 2, // Allow 2 time steps before/after for clock drift
    });

    if (!verified) {
      // Check if it's a backup code
      if (user.twoFactorBackupCodes) {
        const backupCodes: string[] = JSON.parse(user.twoFactorBackupCodes);
        const codeIndex = backupCodes.indexOf(token.toUpperCase());

        if (codeIndex !== -1) {
          // Remove used backup code
          backupCodes.splice(codeIndex, 1);
          await prisma.user.update({
            where: { id: session.user.id },
            data: {
              twoFactorBackupCodes: JSON.stringify(backupCodes),
            },
          });

          return NextResponse.json({
            success: true,
            message: 'Backup code accepted',
            remainingBackupCodes: backupCodes.length,
          });
        }
      }

      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    // Enable 2FA on first successful verification
    await prisma.user.update({
      where: { id: session.user.id },
      data: { twoFactorEnabled: true },
    });

    return NextResponse.json({ success: true, message: '2FA verified and enabled' });
  } catch (error) {
    console.error('2FA verification error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
