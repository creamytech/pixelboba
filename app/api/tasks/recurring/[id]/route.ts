import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { add } from 'date-fns';

// PATCH - Update recurring task
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
      isActive,
      estimatedHours,
      tags,
      assignedToId,
    } = body;

    const { id } = await params;

    // Recalculate next due if pattern or interval changed
    let nextDue;
    if (pattern || interval) {
      const existingTask = await prisma.recurringTask.findUnique({
        where: { id },
      });

      if (existingTask) {
        const start = startDate ? new Date(startDate) : existingTask.startDate;
        const newPattern = pattern || existingTask.pattern;
        const newInterval = interval || existingTask.interval;

        switch (newPattern) {
          case 'DAILY':
            nextDue = add(start, { days: newInterval });
            break;
          case 'WEEKLY':
            nextDue = add(start, { weeks: newInterval });
            break;
          case 'BIWEEKLY':
            nextDue = add(start, { weeks: newInterval * 2 });
            break;
          case 'MONTHLY':
            nextDue = add(start, { months: newInterval });
            break;
          case 'QUARTERLY':
            nextDue = add(start, { months: newInterval * 3 });
            break;
          case 'YEARLY':
            nextDue = add(start, { years: newInterval });
            break;
        }
      }
    }

    const recurringTask = await prisma.recurringTask.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(priority && { priority }),
        ...(pattern && { pattern }),
        ...(interval && { interval }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
        ...(isActive !== undefined && { isActive }),
        ...(estimatedHours !== undefined && { estimatedHours }),
        ...(tags && { tags }),
        ...(assignedToId !== undefined && { assignedToId }),
        ...(nextDue && { nextDue }),
      },
    });

    return NextResponse.json(recurringTask);
  } catch (error) {
    console.error('Failed to update recurring task:', error);
    return NextResponse.json({ error: 'Failed to update recurring task' }, { status: 500 });
  }
}

// DELETE - Delete recurring task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.recurringTask.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete recurring task:', error);
    return NextResponse.json({ error: 'Failed to delete recurring task' }, { status: 500 });
  }
}
