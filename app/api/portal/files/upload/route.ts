import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { uploadFile } from '@/lib/upload';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prisma } = await import('@/lib/prisma');
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const files = formData.getAll('files') as File[];
    const projectId = formData.get('projectId') as string;

    // Support both single file and multiple files
    const filesToUpload = file ? [file] : files;

    if (!filesToUpload || filesToUpload.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    // If projectId is provided, verify user has access
    if (projectId) {
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          OR: [
            { clientId: session.user.id }, // Client access
            {
              AND: [
                { id: projectId },
                // Admin/Owner can upload to any project
                {
                  OR: [{ client: { role: 'ADMIN' } }, { client: { role: 'OWNER' } }],
                },
              ],
            },
          ],
        },
      });

      // Alternative check for admin/owner
      if (!project && session.user.role !== 'ADMIN' && session.user.role !== 'OWNER') {
        return NextResponse.json({ error: 'Project not found or access denied' }, { status: 404 });
      }
    }

    const uploadedFiles = [];

    for (const file of filesToUpload) {
      try {
        // Use a default project if none specified and user is client
        let targetProjectId = projectId;

        if (!targetProjectId && session.user.role === 'CLIENT') {
          // Get the user's first active project
          const userProject = await prisma.project.findFirst({
            where: { clientId: session.user.id },
            select: { id: true },
          });
          targetProjectId = userProject?.id || '';
        }

        const uploadResult = await uploadFile(file, targetProjectId || 'general');

        // Save file info to database
        const savedFile = await prisma.file.create({
          data: {
            filename: uploadResult.filename,
            originalName: uploadResult.originalName,
            mimetype: uploadResult.mimetype,
            size: uploadResult.size,
            url: uploadResult.url,
            publicId: uploadResult.publicId || null,
            uploaderId: session.user.id,
            projectId: targetProjectId || null,
          },
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
        });

        uploadedFiles.push(savedFile);
      } catch (fileError) {
        console.error('Error uploading file:', file.name, fileError);
      }
    }

    // If single file upload, return just the file data with url at root level
    if (uploadedFiles.length === 1) {
      const uploadedFile = uploadedFiles[0];
      return NextResponse.json({
        success: true,
        url: uploadedFile.url,
        id: uploadedFile.id,
        filename: uploadedFile.filename,
        originalName: uploadedFile.originalName,
        mimetype: uploadedFile.mimetype,
        size: uploadedFile.size,
        createdAt: uploadedFile.createdAt.toISOString(),
        uploader: uploadedFile.uploader,
        project: uploadedFile.project,
      });
    }

    return NextResponse.json({
      success: true,
      files: uploadedFiles.map((file) => ({
        id: file.id,
        filename: file.filename,
        originalName: file.originalName,
        mimetype: file.mimetype,
        size: file.size,
        url: file.url,
        createdAt: file.createdAt.toISOString(),
        uploader: file.uploader,
        project: file.project,
      })),
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
