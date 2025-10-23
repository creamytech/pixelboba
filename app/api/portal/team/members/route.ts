import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Get all team members
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        organization: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
                createdAt: true,
                lastActiveAt: true,
                isOnline: true,
              },
            },
            members: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
                createdAt: true,
                lastActiveAt: true,
                isOnline: true,
              },
            },
            manager: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                phone: true,
              },
            },
          },
        },
        subscription: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.organization) {
      return NextResponse.json({
        members: [
          {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
            createdAt: user.createdAt,
            lastActiveAt: user.lastActiveAt,
            isOnline: user.isOnline,
            isOwner: true,
          },
        ],
        maxSeats: 1,
        currentSeats: 1,
        manager: null,
      });
    }

    // Calculate seat limits
    const tierLimits: Record<string, number> = {
      [process.env.NEXT_PUBLIC_STRIPE_LITE_BREW_PRICE_ID || '']: 1,
      [process.env.NEXT_PUBLIC_STRIPE_SIGNATURE_BLEND_PRICE_ID || '']: 3,
      [process.env.NEXT_PUBLIC_STRIPE_TARO_CLOUD_PRICE_ID || '']: 5,
    };

    const maxSeats = user.subscription ? tierLimits[user.subscription.stripePriceId] || 1 : 1;

    const allMembers = [
      { ...user.organization.owner, isOwner: true },
      ...user.organization.members.map((m) => ({ ...m, isOwner: false })),
    ];

    return NextResponse.json({
      members: allMembers,
      maxSeats,
      currentSeats: allMembers.length,
      manager: user.organization.manager,
    });
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 });
  }
}

// Remove team member
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('memberId');

    if (!memberId) {
      return NextResponse.json({ error: 'Member ID required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { organization: true },
    });

    if (!user?.organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    // Only owner can remove members
    if (user.organization.ownerId !== user.id) {
      return NextResponse.json(
        { error: 'Only organization owner can remove members' },
        { status: 403 }
      );
    }

    // Can't remove yourself
    if (memberId === user.id) {
      return NextResponse.json({ error: 'Cannot remove yourself' }, { status: 400 });
    }

    // Remove member
    await prisma.user.update({
      where: { id: memberId },
      data: {
        organizationId: null,
        role: 'CLIENT', // Reset to CLIENT role
      },
    });

    return NextResponse.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Error removing team member:', error);
    return NextResponse.json({ error: 'Failed to remove member' }, { status: 500 });
  }
}
