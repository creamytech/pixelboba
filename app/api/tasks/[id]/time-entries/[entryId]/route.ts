import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; entryId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: taskId, entryId } = params;

    // Delete the time entry
    await prisma.timeEntry.delete({
      where: { id: entryId },
    });

    // Recalculate task's actual hours
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting time entry:', error);
    return NextResponse.json({ error: 'Failed to delete time entry' }, { status: 500 });
  }
}
