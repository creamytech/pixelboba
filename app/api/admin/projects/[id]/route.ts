import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
      const { id } = await params;

      const project = await prisma.project.findUnique({
        where: { id },
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
            orderBy: { createdAt: 'asc' },
          },
          messages: {
            include: {
              sender: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                },
              },
            },
            orderBy: { createdAt: 'desc' },
            take: 20,
          },
          files: {
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
        },
      });

      if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }

      return NextResponse.json({ project });
    } catch (dbError) {
      console.error('Database error fetching project:', dbError);
      return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in get project API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, status, progress, deadline, websiteUrl } = body;

    try {
      const { prisma } = await import('@/lib/prisma');
      const { id } = await params;

      const existingProject = await prisma.project.findUnique({
        where: { id },
        include: { client: { select: { name: true } } },
      });

      if (!existingProject) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }

      const updatedProject = await prisma.project.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(description !== undefined && { description }),
          ...(status && { status }),
          ...(progress !== undefined && { progress }),
          ...(deadline !== undefined && {
            deadline: deadline ? new Date(deadline) : null,
          }),
          ...(websiteUrl !== undefined && { websiteUrl }),
          ...(status === 'COMPLETED' &&
            !existingProject.completedAt && {
              completedAt: new Date(),
            }),
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
          milestones: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      // Create activity log for updates
      const changes = [];
      if (progress !== undefined && progress !== existingProject.progress) {
        changes.push(`Progress updated to ${progress}%`);
      }
      if (status && status !== existingProject.status) {
        changes.push(`Status changed to ${status.toLowerCase()}`);
      }

      if (changes.length > 0) {
        await prisma.activity.create({
          data: {
            action: 'project_updated',
            description: changes.join(', '),
            userId: session.user.id,
            projectId: id,
          },
        });
      }

      return NextResponse.json({ project: updatedProject });
    } catch (dbError) {
      console.error('Database error updating project:', dbError);
      return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in update project API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
      const { id } = await params;

      const project = await prisma.project.findUnique({
        where: { id },
        select: { name: true },
      });

      if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }

      await prisma.project.delete({
        where: { id },
      });

      // Create activity log
      await prisma.activity.create({
        data: {
          action: 'project_deleted',
          description: `Project "${project.name}" deleted`,
          userId: session.user.id,
        },
      });

      return NextResponse.json({ success: true });
    } catch (dbError) {
      console.error('Database error deleting project:', dbError);
      return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in delete project API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
