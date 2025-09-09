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

    let whereClause: any = {};

    // If user is a client, only show their files
    if (session.user.role === 'CLIENT') {
      if (projectId) {
        // Show files from a specific project they have access to
        whereClause = {
          project: {
            id: projectId,
            clientId: session.user.id,
          },
        };
      } else {
        // Show all files from their projects
        whereClause = {
          project: {
            clientId: session.user.id,
          },
        };
      }
    } else {
      // Admin/Owner can see all files
      if (projectId) {
        whereClause = { projectId };
      }
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
