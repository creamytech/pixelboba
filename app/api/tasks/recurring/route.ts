import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { add } from 'date-fns';

// GET - List recurring tasks
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');

  try {
    const recurringTasks = await prisma.recurringTask.findMany({
      where: projectId ? { projectId } : {},
      orderBy: { nextDue: 'asc' },
    });

    return NextResponse.json(recurringTasks);
  } catch (error) {
    console.error('Failed to fetch recurring tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch recurring tasks' }, { status: 500 });
  }
}

// POST - Create recurring task
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      title,
      description,
      priority,
      pattern,
      interval,
      startDate,
      endDate,
      estimatedHours,
      tags,
      projectId,
      assignedToId,
    } = body;

    // Calculate next due date based on pattern and interval
    const start = new Date(startDate);
    let nextDue = start;

    switch (pattern) {
      case 'DAILY':
        nextDue = add(start, { days: interval });
        break;
      case 'WEEKLY':
        nextDue = add(start, { weeks: interval });
        break;
      case 'BIWEEKLY':
        nextDue = add(start, { weeks: interval * 2 });
        break;
      case 'MONTHLY':
        nextDue = add(start, { months: interval });
        break;
      case 'QUARTERLY':
        nextDue = add(start, { months: interval * 3 });
        break;
      case 'YEARLY':
        nextDue = add(start, { years: interval });
        break;
    }

    const recurringTask = await prisma.recurringTask.create({
      data: {
        title,
        description,
        priority: priority || 'MEDIUM',
        pattern,
        interval: interval || 1,
        startDate: start,
        endDate: endDate ? new Date(endDate) : null,
        nextDue,
        estimatedHours,
        tags: tags || [],
        projectId,
        assignedToId,
        createdById: (session.user as any).id,
      },
    });

    return NextResponse.json(recurringTask, { status: 201 });
  } catch (error) {
    console.error('Failed to create recurring task:', error);
    return NextResponse.json({ error: 'Failed to create recurring task' }, { status: 500 });
  }
}
