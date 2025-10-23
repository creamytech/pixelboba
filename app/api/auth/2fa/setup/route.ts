import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if 2FA is already enabled
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { twoFactorEnabled: true },
    });

    if (user?.twoFactorEnabled) {
      return NextResponse.json({ error: '2FA already enabled' }, { status: 400 });
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `Pixel Boba (${session.user.email})`,
      issuer: 'Pixel Boba',
    });

    // Generate backup codes
    const backupCodes = Array.from({ length: 10 }, () =>
      crypto.randomBytes(4).toString('hex').toUpperCase()
    );

    // Store secret temporarily (not enabled until verified)
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        twoFactorSecret: secret.base32,
        twoFactorBackupCodes: JSON.stringify(backupCodes),
        twoFactorEnabled: false, // Not enabled until verified
      },
    });

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

    return NextResponse.json({
      secret: secret.base32,
      qrCode: qrCodeUrl,
      backupCodes,
    });
  } catch (error) {
    console.error('2FA setup error:', error);
    return NextResponse.json({ error: 'Failed to setup 2FA' }, { status: 500 });
  }
}
