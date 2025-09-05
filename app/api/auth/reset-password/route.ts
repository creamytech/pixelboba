import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    try {
      const { prisma } = await import('@/lib/prisma');

      // Find and validate reset token
      const resetToken = await prisma.passwordReset.findUnique({
        where: { token },
        include: { user: true },
      });

      if (!resetToken) {
        return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
      }

      if (resetToken.usedAt) {
        return NextResponse.json({ error: 'Reset token has already been used' }, { status: 400 });
      }

      if (resetToken.expiresAt < new Date()) {
        return NextResponse.json({ error: 'Reset token has expired' }, { status: 400 });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Update user password
      await prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword },
      });

      // Mark reset token as used
      await prisma.passwordReset.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      });

      // Clean up any other reset tokens for this user
      await prisma.passwordReset.deleteMany({
        where: {
          userId: resetToken.userId,
          id: { not: resetToken.id },
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Password has been reset successfully',
      });
    } catch (dbError) {
      console.error('Database error in reset password:', dbError);
      return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in reset password API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
