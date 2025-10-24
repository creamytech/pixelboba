import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: fileId } = await params;
    const { prisma } = await import('@/lib/prisma');

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

    // Get the file to check permissions and get file path
    const file = await prisma.file.findUnique({
      where: { id: fileId },
      include: {
        project: {
          select: {
            id: true,
            clientId: true,
            client: {
              select: {
                organizationId: true,
              },
            },
          },
        },
      },
    });

    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // SECURITY: Check if user has permission to delete this file
    let canDelete = false;

    if (user.role === 'ADMIN') {
      // Admin can delete any file
      canDelete = true;
    } else if (user.role === 'CLIENT' || user.role === 'OWNER') {
      // Client/Owner can delete files they uploaded or files in their projects
      canDelete = Boolean(
        (file.uploaderId && file.uploaderId === user.id) ||
          (file.project && file.project.clientId === user.id)
      );
    } else if (user.role === 'TEAM_MEMBER' || user.role === 'TEAM_ADMIN') {
      // Team members can only delete files from their organization's projects
      if (user.organizationId && file.project && file.project.client) {
        canDelete = file.project.client.organizationId === user.organizationId;
      }
    }

    if (!canDelete) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    // Delete the file from Cloudinary
    try {
      if (file.publicId) {
        await cloudinary.uploader.destroy(file.publicId);
      }
    } catch (fileError) {
      console.error('Error deleting file from Cloudinary:', fileError);
      // Continue with database deletion even if Cloudinary deletion fails
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
