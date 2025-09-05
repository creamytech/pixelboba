import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { unlink } from 'fs/promises';
import { join } from 'path';

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const fileId = params.id;
    const { prisma } = await import('@/lib/prisma');

    // Get the file to check permissions and get file path
    const file = await prisma.file.findUnique({
      where: { id: fileId },
      include: {
        project: {
          select: {
            id: true,
            clientId: true,
          },
        },
      },
    });

    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Check if user has permission to delete this file
    const canDelete =
      file.uploaderId === session.user.id || // User owns the file
      session.user.role === 'ADMIN' || // Admin can delete any file
      session.user.role === 'OWNER' || // Owner can delete any file
      (file.project && file.project.clientId === session.user.id); // Client can delete files in their projects

    if (!canDelete) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    // Delete the physical file
    try {
      const uploadsPath = join(process.cwd(), 'uploads');
      const filePath = join(uploadsPath, file.filename);
      await unlink(filePath);
    } catch (fileError) {
      console.error('Error deleting physical file:', fileError);
      // Continue with database deletion even if physical file deletion fails
    }

    // Delete the file record from database
    await prisma.file.delete({
      where: { id: fileId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
