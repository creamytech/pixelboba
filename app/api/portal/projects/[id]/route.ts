import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/portal/projects/[id] - Get detailed project information
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const projectId = resolvedParams.id;

    // Fetch project with all related data
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
              },
            },
          },
        },
        tasks: {
          include: {
            assignedTo: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            comments: {
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
              },
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        files: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
        activities: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 20,
        },
        milestones: {
          orderBy: {
            dueDate: 'asc',
          },
        },
        requests: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check if user has access to this project
    const isClient = project.clientId === session.user.id;
    const isTeamMember = project.members.some((m) => m.userId === session.user.id);
    const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'OWNER';

    if (!isClient && !isTeamMember && !isAdmin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Error fetching project details:', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

// PATCH /api/portal/projects/[id] - Update project details
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const projectId = resolvedParams.id;
    const body = await request.json();

    // Check if user has permission to edit
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        members: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const isClient = project.clientId === session.user.id;
    const canEdit = project.members.find((m) => m.userId === session.user.id && m.canEdit);
    const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'OWNER';

    if (!isClient && !canEdit && !isAdmin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Update project
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        name: body.name,
        description: body.description,
        status: body.status,
        progress: body.progress,
        websiteUrl: body.websiteUrl,
        deadline: body.deadline,
      },
    });

    return NextResponse.json({ project: updatedProject });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}
