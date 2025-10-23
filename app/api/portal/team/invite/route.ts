import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';
import { sendEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, role } = await request.json();

    // Get user's subscription to check tier and seats
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        subscription: true,
        organization: {
          include: {
            members: true,
          },
        },
      },
    });

    if (!user?.subscription || user.subscription.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Active subscription required to invite team members' },
        { status: 403 }
      );
    }

    // Check seat limits based on tier
    const tierLimits: Record<string, number> = {
      [process.env.NEXT_PUBLIC_STRIPE_LITE_BREW_PRICE_ID || '']: 1, // Lite Brew: 1 user only
      [process.env.NEXT_PUBLIC_STRIPE_SIGNATURE_BLEND_PRICE_ID || '']: 3, // Signature Blend: 3 users
      [process.env.NEXT_PUBLIC_STRIPE_TARO_CLOUD_PRICE_ID || '']: 5, // Taro Cloud: 5 users
    };

    const maxSeats = tierLimits[user.subscription.stripePriceId] || 1;
    const currentSeats = user.organization?.members.length || 1; // Owner counts as 1

    if (currentSeats >= maxSeats) {
      return NextResponse.json(
        {
          error: `Your ${getTierName(user.subscription.stripePriceId)} plan supports up to ${maxSeats} user(s). Upgrade to add more team members.`,
        },
        { status: 403 }
      );
    }

    // Create or get organization
    let organization = user.organization;
    if (!organization) {
      organization = await prisma.organization.create({
        data: {
          name: user.company || `${user.name}'s Team`,
          ownerId: user.id,
        },
        include: {
          members: true,
        },
      });

      // Update user with organization
      await prisma.user.update({
        where: { id: user.id },
        data: { organizationId: organization.id },
      });
    }

    // Check if user already exists or invited
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser?.organizationId === organization.id) {
      return NextResponse.json({ error: 'User is already a team member' }, { status: 400 });
    }

    const existingInvite = await prisma.teamInvite.findFirst({
      where: {
        email,
        organizationId: organization.id,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (existingInvite) {
      return NextResponse.json({ error: 'Invitation already sent to this email' }, { status: 400 });
    }

    // Create invitation
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days to accept

    const invite = await prisma.teamInvite.create({
      data: {
        email,
        token,
        role: role || 'TEAM_MEMBER',
        expiresAt,
        organizationId: organization.id,
        createdById: user.id,
      },
    });

    // Send invitation email
    const inviteUrl = `${process.env.NEXTAUTH_URL}/team/accept-invite?token=${token}`;
    await sendEmail({
      to: email,
      subject: `You've been invited to join ${organization.name} on Pixel Boba`,
      html: `
        <h1>Team Invitation</h1>
        <p>${user.name || user.email} has invited you to join their team on Pixel Boba.</p>
        <p><strong>Organization:</strong> ${organization.name}</p>
        <p><strong>Role:</strong> ${role || 'Team Member'}</p>
        <p>Click the link below to accept the invitation:</p>
        <a href="${inviteUrl}" style="padding: 12px 24px; background-color: #9333EA; color: white; text-decoration: none; border-radius: 8px; display: inline-block; margin: 16px 0;">Accept Invitation</a>
        <p>This invitation expires in 7 days.</p>
        <p style="color: #666; font-size: 14px;">If you didn't expect this invitation, you can safely ignore this email.</p>
      `,
    });

    return NextResponse.json({
      message: 'Invitation sent successfully',
      invite: {
        id: invite.id,
        email: invite.email,
        role: invite.role,
        expiresAt: invite.expiresAt,
      },
    });
  } catch (error) {
    console.error('Error sending team invitation:', error);
    return NextResponse.json({ error: 'Failed to send invitation' }, { status: 500 });
  }
}

// Get all pending invitations
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { organization: true },
    });

    if (!user?.organization) {
      return NextResponse.json({ invites: [] });
    }

    const invites = await prisma.teamInvite.findMany({
      where: {
        organizationId: user.organization.id,
        usedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ invites });
  } catch (error) {
    console.error('Error fetching invitations:', error);
    return NextResponse.json({ error: 'Failed to fetch invitations' }, { status: 500 });
  }
}

function getTierName(priceId: string): string {
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_LITE_BREW_PRICE_ID) return 'Lite Brew';
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_SIGNATURE_BLEND_PRICE_ID) return 'Signature Blend';
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_TARO_CLOUD_PRICE_ID) return 'Taro Cloud';
  return 'current';
}
