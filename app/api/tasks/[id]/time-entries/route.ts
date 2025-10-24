import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const taskId = params.id;

    // Fetch all time entries for this task
    const entries = await prisma.timeEntry.findMany({
      where: { taskId },
      orderBy: { startedAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({ entries });
  } catch (error) {
    console.error('Error fetching time entries:', error);
    return NextResponse.json({ error: 'Failed to fetch time entries' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const taskId = params.id;
    const body = await request.json();
    const { duration, description, isBillable } = body;

    if (!duration || duration <= 0) {
      return NextResponse.json({ error: 'Duration is required' }, { status: 400 });
    }

    // Create time entry
    const startedAt = new Date();
    const endedAt = new Date(startedAt.getTime() + duration * 60000);

    const entry = await prisma.timeEntry.create({
      data: {
        taskId,
        userId: session.user.id,
        duration,
        description: description || 'Time tracked',
        isBillable: isBillable ?? true,
        startedAt,
        endedAt,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    // Update task's actual hours
    const totalMinutes = await prisma.timeEntry.aggregate({
      where: { taskId },
      _sum: { duration: true },
    });

    await prisma.task.update({
      where: { id: taskId },
      data: {
        actualHours: totalMinutes._sum.duration ? totalMinutes._sum.duration / 60 : 0,
      },
    });

    return NextResponse.json({ entry });
  } catch (error) {
    console.error('Error creating time entry:', error);
    return NextResponse.json({ error: 'Failed to create time entry' }, { status: 500 });
  }
}
