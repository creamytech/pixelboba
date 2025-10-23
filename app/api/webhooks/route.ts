import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const webhooks = await prisma.webhook.findMany({
      where: { userId: session.user.id },
      include: {
        _count: {
          select: { deliveries: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ webhooks });
  } catch (error) {
    console.error('Fetch webhooks error:', error);
    return NextResponse.json({ error: 'Failed to fetch webhooks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { url, events, description } = await request.json();

    if (!url || !events || events.length === 0) {
      return NextResponse.json({ error: 'URL and at least one event required' }, { status: 400 });
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    // Generate secret for signing
    const secret = crypto.randomBytes(32).toString('hex');

    const webhook = await prisma.webhook.create({
      data: {
        userId: session.user.id,
        url,
        events,
        secret,
        description,
      },
    });

    return NextResponse.json({ webhook });
  } catch (error) {
    console.error('Create webhook error:', error);
    return NextResponse.json({ error: 'Failed to create webhook' }, { status: 500 });
  }
}
