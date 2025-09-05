import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, inviteToken } = await request.json();

    if (!email || !inviteToken) {
      return NextResponse.json({ error: 'Email and invite token are required' }, { status: 400 });
    }

    try {
      const { prisma } = await import('@/lib/prisma');

      // Validate invite token
      const invite = await prisma.invite.findUnique({
        where: { token: inviteToken },
      });

      if (!invite) {
        return NextResponse.json({ error: 'Invalid invite token' }, { status: 400 });
      }

      if (invite.usedAt) {
        return NextResponse.json({ error: 'Invite has already been used' }, { status: 400 });
      }

      if (invite.expiresAt < new Date()) {
        return NextResponse.json({ error: 'Invite has expired' }, { status: 400 });
      }

      if (invite.email !== email) {
        return NextResponse.json({ error: 'Email does not match invite' }, { status: 400 });
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 });
      }

      // Hash password if provided (for manual signup)
      let hashedPassword = null;
      if (password) {
        hashedPassword = await bcrypt.hash(password, 12);
      }

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          name: name || email.split('@')[0],
          role: invite.role,
          emailVerified: new Date(),
          ...(hashedPassword && { password: hashedPassword }),
        },
      });

      // Mark invite as used
      await prisma.invite.update({
        where: { id: invite.id },
        data: {
          usedAt: new Date(),
          usedById: user.id,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Account created successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    } catch (dbError) {
      console.error('Database error creating user:', dbError);
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in signup API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
