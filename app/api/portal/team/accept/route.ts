import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { token } = await request.json();

    // Find invitation
    const invite = await prisma.teamInvite.findUnique({
      where: { token },
      include: {
        organization: {
          include: {
            owner: {
              include: {
                subscription: true,
              },
            },
            members: true,
          },
        },
      },
    });

    if (!invite) {
      return NextResponse.json({ error: 'Invalid invitation' }, { status: 404 });
    }

    if (invite.usedAt) {
      return NextResponse.json({ error: 'Invitation already used' }, { status: 400 });
    }

    if (invite.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Invitation expired' }, { status: 400 });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        organization: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('[Accept Invite] User found:', {
      id: user.id,
      email: user.email,
      currentOrganizationId: user.organizationId,
      currentRole: user.role,
    });

    // Case-insensitive email comparison
    const userEmail = user.email?.toLowerCase().trim();
    const inviteEmail = invite.email?.toLowerCase().trim();

    console.log('[Accept Invite] Email comparison:', { userEmail, inviteEmail });

    if (userEmail !== inviteEmail) {
      return NextResponse.json(
        {
          error: `This invitation was sent to ${invite.email}, but you're signed in as ${user.email}. Please sign in with the correct email address.`,
        },
        { status: 403 }
      );
    }

    // Check seat limit
    const subscription = invite.organization.owner.subscription;
    if (!subscription || subscription.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Organization subscription is not active' },
        { status: 403 }
      );
    }

    const tierLimits: Record<string, number> = {
      [process.env.NEXT_PUBLIC_STRIPE_LITE_BREW_PRICE_ID || '']: 1,
      [process.env.NEXT_PUBLIC_STRIPE_SIGNATURE_BLEND_PRICE_ID || '']: 3,
      [process.env.NEXT_PUBLIC_STRIPE_TARO_CLOUD_PRICE_ID || '']: 5,
    };

    const maxSeats = tierLimits[subscription.stripePriceId] || 1;
    const currentSeats = invite.organization.members.length + 1; // +1 for owner

    if (currentSeats >= maxSeats) {
      return NextResponse.json(
        { error: 'Organization has reached maximum team size for their plan' },
        { status: 403 }
      );
    }

    // Update user and mark invitation as used
    console.log('[Accept Invite] Updating user:', {
      userId: user.id,
      organizationId: invite.organizationId,
      role: invite.role,
    });

    const [updatedUser] = await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          organizationId: invite.organizationId,
          role: invite.role,
        },
      }),
      prisma.teamInvite.update({
        where: { id: invite.id },
        data: { usedAt: new Date() },
      }),
    ]);

    console.log('[Accept Invite] User updated successfully:', {
      userId: updatedUser.id,
      email: updatedUser.email,
      organizationId: updatedUser.organizationId,
      role: updatedUser.role,
    });

    return NextResponse.json({
      message: 'Successfully joined team',
      organization: {
        id: invite.organization.id,
        name: invite.organization.name,
      },
    });
  } catch (error) {
    console.error('Error accepting invitation:', error);
    return NextResponse.json({ error: 'Failed to accept invitation' }, { status: 500 });
  }
}
