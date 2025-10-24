import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';
import { sendTeamInvitationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, role } = await request.json();

    // Get user's subscription, permissions, and organization
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        subscription: true,
        permissions: true,
        organization: {
          include: {
            owner: true,
            members: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has an active subscription
    if (!user.subscription || user.subscription.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Active subscription required to invite team members' },
        { status: 403 }
      );
    }

    // ONLY allow the organization owner to invite team members
    // This prevents invited team members from inviting others
    if (user.organization && user.organization.ownerId !== user.id) {
      return NextResponse.json(
        { error: 'Only the account owner can invite team members' },
        { status: 403 }
      );
    }

    // Check permissions - must have canInviteTeam permission
    if (!user.permissions?.canInviteTeam) {
      return NextResponse.json(
        { error: 'Your subscription plan does not support team invitations' },
        { status: 403 }
      );
    }

    // Check seat limits based on tier
    // Try environment variables first, then fall back to price matching
    const tierLimits: Record<string, number> = {
      [process.env.NEXT_PUBLIC_STRIPE_LITE_BREW_PRICE_ID || '']: 1,
      [process.env.NEXT_PUBLIC_STRIPE_SIGNATURE_BLEND_PRICE_ID || '']: 3,
      [process.env.NEXT_PUBLIC_STRIPE_TARO_CLOUD_PRICE_ID || '']: 5,
    };

    let maxSeats = tierLimits[user.subscription.stripePriceId];

    // Fallback: If price ID not found in env vars, detect tier from subscription ID pattern
    // Admin-granted subscriptions have fake IDs starting with "admin_grant_"
    if (!maxSeats && user.subscription.stripeSubscriptionId.startsWith('admin_grant_')) {
      // For admin-granted subscriptions, check the price ID pattern
      const priceId = user.subscription.stripePriceId.toLowerCase();
      if (priceId.includes('lite') || priceId.includes('brew')) {
        maxSeats = 1;
      } else if (priceId.includes('signature') || priceId.includes('blend')) {
        maxSeats = 3;
      } else if (priceId.includes('taro') || priceId.includes('cloud')) {
        maxSeats = 5;
      }
    }

    // Final fallback: default to 1 seat if we can't determine the tier
    if (!maxSeats) {
      maxSeats = 1;
    }

    const currentSeats = user.organization ? user.organization.members.length + 1 : 1; // Owner + members

    if (currentSeats >= maxSeats) {
      return NextResponse.json(
        {
          error: `Your plan supports up to ${maxSeats} user(s). You currently have ${currentSeats} user(s). Upgrade to add more team members.`,
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
          owner: true,
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

    // Check for existing pending invite
    const existingInvite = await prisma.teamInvite.findFirst({
      where: {
        email,
        organizationId: organization.id,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    let invite;
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days to accept

    if (existingInvite) {
      // Update existing invite with new token and extended expiry (resend functionality)
      console.log('[Team Invite] Resending existing invite:', existingInvite.id);
      invite = await prisma.teamInvite.update({
        where: { id: existingInvite.id },
        data: {
          token,
          expiresAt,
          role: role || existingInvite.role, // Allow role update on resend
          createdById: user.id, // Update who resent it
        },
      });
    } else {
      // Create new invitation
      console.log('[Team Invite] Creating new invite for:', email);
      invite = await prisma.teamInvite.create({
        data: {
          email,
          token,
          role: role || 'TEAM_MEMBER',
          expiresAt,
          organizationId: organization.id,
          createdById: user.id,
        },
      });
    }

    // Send invitation email
    const inviteUrl = `${process.env.NEXTAUTH_URL}/team/accept-invite?token=${token}`;
    await sendTeamInvitationEmail({
      to: email,
      inviterName: user.name || user.email,
      organizationName: organization.name,
      role: role || 'Team Member',
      inviteUrl,
    });

    return NextResponse.json({
      message: existingInvite ? 'Invitation resent successfully' : 'Invitation sent successfully',
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
