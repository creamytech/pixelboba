import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { TaskStatus } from '@prisma/client';

// POST /api/tasks/[id]/move - Move a task to a new status/position
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const task = await prisma.task.findUnique({
      where: { id: params.id },
      include: {
        project: {
          select: {
            clientId: true,
          },
        },
      },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Check permissions
    if (user.role === 'CLIENT' && task.project.clientId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { status, newOrder } = body as { status: TaskStatus; newOrder: number };

    if (!status || newOrder === undefined) {
      return NextResponse.json({ error: 'Status and newOrder are required' }, { status: 400 });
    }

    // If moving to a new status
    if (status !== task.status) {
      // Reorder tasks in the old status (close the gap)
      await prisma.task.updateMany({
        where: {
          projectId: task.projectId,
          status: task.status,
          order: { gt: task.order },
        },
        data: {
          order: { decrement: 1 },
        },
      });

      // Make room in the new status
      await prisma.task.updateMany({
        where: {
          projectId: task.projectId,
          status,
          order: { gte: newOrder },
        },
        data: {
          order: { increment: 1 },
        },
      });

      // Update the task with new status and order
      const updateData: any = {
        status,
        order: newOrder,
      };

      // Auto-set completedAt when moving to COMPLETED
      if (status === 'COMPLETED' && task.status !== 'COMPLETED') {
        updateData.completedAt = new Date();
      } else if (status !== 'COMPLETED' && task.status === 'COMPLETED') {
        updateData.completedAt = null;
      }

      const updatedTask = await prisma.task.update({
        where: { id: params.id },
        data: updateData,
        include: {
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          project: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return NextResponse.json(updatedTask);
    } else {
      // Moving within the same status (reordering)
      if (newOrder === task.order) {
        // No change needed
        return NextResponse.json(task);
      }

      if (newOrder > task.order) {
        // Moving down: decrement order of tasks between old and new position
        await prisma.task.updateMany({
          where: {
            projectId: task.projectId,
            status: task.status,
            order: {
              gt: task.order,
              lte: newOrder,
            },
          },
          data: {
            order: { decrement: 1 },
          },
        });
      } else {
        // Moving up: increment order of tasks between new and old position
        await prisma.task.updateMany({
          where: {
            projectId: task.projectId,
            status: task.status,
            order: {
              gte: newOrder,
              lt: task.order,
            },
          },
          data: {
            order: { increment: 1 },
          },
        });
      }

      // Update the task's order
      const updatedTask = await prisma.task.update({
        where: { id: params.id },
        data: { order: newOrder },
        include: {
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          project: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return NextResponse.json(updatedTask);
    }
  } catch (error) {
    console.error('Error moving task:', error);
    return NextResponse.json({ error: 'Failed to move task' }, { status: 500 });
  }
}
