import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prisma } = await import('@/lib/prisma');
    const url = new URL(request.url);
    const projectId = url.searchParams.get('projectId');

    // Get user with organization info for proper access control
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        role: true,
        organizationId: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let whereClause: any = {};

    // SECURITY: Scope file access based on user role and organization
    if (user.role === 'ADMIN') {
      // Admin can see all files
      if (projectId) {
        whereClause = { projectId };
      }
    } else if (user.role === 'CLIENT' || user.role === 'OWNER') {
      // Client/Owner can only see files from their own projects
      if (projectId) {
        whereClause = {
          project: {
            id: projectId,
            clientId: user.id,
          },
        };
      } else {
        whereClause = {
          project: {
            clientId: user.id,
          },
        };
      }
    } else if (user.role === 'TEAM_MEMBER' || user.role === 'TEAM_ADMIN') {
      // Team members can only see files from their organization's projects
      if (!user.organizationId) {
        return NextResponse.json(
          { error: 'Team member must belong to an organization' },
          { status: 403 }
        );
      }

      if (projectId) {
        whereClause = {
          project: {
            id: projectId,
            client: {
              organizationId: user.organizationId,
            },
          },
        };
      } else {
        whereClause = {
          project: {
            client: {
              organizationId: user.organizationId,
            },
          },
        };
      }
    } else {
      // Fallback: no access
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const files = await prisma.file.findMany({
      where: whereClause,
      include: {
        uploader: {
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
      orderBy: { createdAt: 'desc' },
    });

    const formattedFiles = files.map((file) => ({
      id: file.id,
      filename: file.filename,
      originalName: file.originalName,
      mimetype: file.mimetype,
      size: file.size,
      url: file.url,
      createdAt: file.createdAt.toISOString(),
      uploader: file.uploader,
      project: file.project,
    }));

    return NextResponse.json({ files: formattedFiles });
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
