import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Mark onboarding as completed
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Update user onboarding status
    await prisma.user.update({
      where: { email: session.user.email },
      data: { onboardingCompleted: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating onboarding status:', error);
    return NextResponse.json({ error: 'Failed to update onboarding status' }, { status: 500 });
  }
}

// Reset onboarding (for replay feature)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Reset user onboarding status
    await prisma.user.update({
      where: { email: session.user.email },
      data: { onboardingCompleted: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error resetting onboarding status:', error);
    return NextResponse.json({ error: 'Failed to reset onboarding status' }, { status: 500 });
  }
}
