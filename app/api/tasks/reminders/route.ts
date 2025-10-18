import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - List task reminders
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get('taskId');
  const userId = (session.user as any).id;

  try {
    const reminders = await prisma.taskReminder.findMany({
      where: {
        ...(taskId ? { taskId } : { userId }),
        isSent: false,
      },
      orderBy: { remindAt: 'asc' },
    });

    return NextResponse.json(reminders);
  } catch (error) {
    console.error('Failed to fetch reminders:', error);
    return NextResponse.json({ error: 'Failed to fetch reminders' }, { status: 500 });
  }
}

// POST - Create task reminder
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { taskId, remindAt, message, type } = body;

    const reminder = await prisma.taskReminder.create({
      data: {
        taskId,
        userId: (session.user as any).id,
        remindAt: new Date(remindAt),
        message,
        type: type || 'CUSTOM',
      },
    });

    return NextResponse.json(reminder, { status: 201 });
  } catch (error) {
    console.error('Failed to create reminder:', error);
    return NextResponse.json({ error: 'Failed to create reminder' }, { status: 500 });
  }
}
