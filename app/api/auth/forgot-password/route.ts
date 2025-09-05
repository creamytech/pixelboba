import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    try {
      const { prisma } = await import('@/lib/prisma');

      // Check if user exists and has a password (manual signup user)
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        // Don't reveal if user exists or not for security
        return NextResponse.json({
          success: true,
          message: 'If an account with that email exists, a password reset link has been sent.',
        });
      }

      // Only allow password reset for users who signed up manually (have a password)
      if (!user.password) {
        return NextResponse.json({
          success: true,
          message: 'If an account with that email exists, a password reset link has been sent.',
        });
      }

      // Generate reset token
      const resetToken = randomBytes(32).toString('hex');
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry

      // Clean up any existing reset tokens for this user
      await prisma.passwordReset.deleteMany({
        where: { userId: user.id },
      });

      // Create new reset token
      await prisma.passwordReset.create({
        data: {
          token: resetToken,
          email: user.email,
          userId: user.id,
          expiresAt,
        },
      });

      // In a real app, you would send an email here
      // For now, we'll just return the reset URL for testing
      const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

      console.log('Password reset requested for:', email);
      console.log('Reset URL:', resetUrl);

      // TODO: Send email with reset link
      // await sendPasswordResetEmail(user.email, resetUrl);

      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.',
        // Remove this in production - only for testing
        resetUrl: process.env.NODE_ENV === 'development' ? resetUrl : undefined,
      });
    } catch (dbError) {
      console.error('Database error in forgot password:', dbError);
      return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in forgot password API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
