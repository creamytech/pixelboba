import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
      const { prisma } = await import('@/lib/prisma');

      const projects = await prisma.project.findMany({
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              createdAt: true,
            },
          },
          milestones: {
            orderBy: { order: 'asc' },
          },
          _count: {
            select: {
              messages: true,
              files: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json({ projects });
    } catch (dbError) {
      console.error('Database error in admin projects:', dbError);
      return NextResponse.json({ projects: [] });
    }
  } catch (error) {
    console.error('Error in admin projects API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, clientId, startDate, deadline } = body;

    if (!name || !clientId || !startDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    try {
      const { prisma } = await import('@/lib/prisma');

      const project = await prisma.project.create({
        data: {
          name,
          description: description || '',
          clientId,
          startDate: new Date(startDate),
          deadline: deadline ? new Date(deadline) : null,
          status: 'DISCOVERY',
          progress: 0,
        },
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              createdAt: true,
            },
          },
        },
      });

      // Create activity log
      await prisma.activity.create({
        data: {
          action: 'project_created',
          description: `Project "${name}" created`,
          userId: session.user.id,
          projectId: project.id,
        },
      });

      return NextResponse.json({ project });
    } catch (dbError) {
      console.error('Database error creating project:', dbError);
      return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in create project API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
