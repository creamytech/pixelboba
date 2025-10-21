import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; filename: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId, filename } = await params;
    const { prisma } = await import('@/lib/prisma');

    // Verify user has access to this project
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { clientId: session.user.id }, // Client access
          { client: { role: 'ADMIN' } }, // Admin access (simplified check)
        ],
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found or access denied' }, { status: 404 });
    }

    const filepath = join(process.cwd(), 'uploads', 'messages', projectId, filename);

    try {
      const fileBuffer = await readFile(filepath);

      // Get file info from database to get proper content type
      const fileRecord = await prisma.file.findFirst({
        where: {
          filename: filename,
          projectId: projectId,
        },
      });

      const contentType = fileRecord?.mimetype || 'application/octet-stream';

      return new NextResponse(fileBuffer as BodyInit, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `inline; filename="${fileRecord?.originalName || filename}"`,
        },
      });
    } catch (fileError) {
      console.error('Error reading file:', fileError);
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error serving uploaded file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
