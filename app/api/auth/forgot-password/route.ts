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

      // Send password reset email if email API is available
      try {
        const resend = new (await import('resend')).Resend(process.env.RESEND_API_KEY);
        if (process.env.RESEND_API_KEY) {
          await resend.emails.send({
            from: 'Pixel Boba <hello@pixelboba.com>',
            to: [user.email],
            subject: 'Reset your Pixel Boba password',
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Reset Your Password - Pixel Boba</title>
              </head>
              <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #8B5CF6;">🧋 pixel boba</h1>
                </div>
                
                <h2>reset your password</h2>
                <p>you requested a password reset for your pixel boba account. click the link below to reset your password:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${resetUrl}" 
                     style="display: inline-block; background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">
                    reset password
                  </a>
                </div>
                
                <p style="color: #666; font-size: 14px;">this link will expire in 1 hour for security reasons.</p>
                <p style="color: #666; font-size: 14px;">if you didn't request this, please ignore this email.</p>
                
                <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; color: #999; font-size: 12px; text-align: center;">
                  <p>pixel boba • websites that pop</p>
                </div>
              </body>
              </html>
            `,
          });
          console.log('Password reset email sent to:', user.email);
        }
      } catch (emailError) {
        console.error('Failed to send password reset email:', emailError);
      }

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
