import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { url, events, description, isActive } = await request.json();

    // Verify ownership
    const webhook = await prisma.webhook.findUnique({
      where: { id: resolvedParams.id },
    });

    if (!webhook || webhook.userId !== session.user.id) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
    }

    const updated = await prisma.webhook.update({
      where: { id: resolvedParams.id },
      data: {
        url,
        events,
        description,
        isActive,
      },
    });

    return NextResponse.json({ webhook: updated });
  } catch (error) {
    console.error('Update webhook error:', error);
    return NextResponse.json({ error: 'Failed to update webhook' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;

    // Verify ownership
    const webhook = await prisma.webhook.findUnique({
      where: { id: resolvedParams.id },
    });

    if (!webhook || webhook.userId !== session.user.id) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
    }

    await prisma.webhook.delete({
      where: { id: resolvedParams.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete webhook error:', error);
    return NextResponse.json({ error: 'Failed to delete webhook' }, { status: 500 });
  }
}
