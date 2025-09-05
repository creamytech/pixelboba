import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    try {
      const { prisma } = await import('@/lib/prisma');

      // Verify user has access to this project
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          clientId: session.user.id,
        },
      });

      if (!project) {
        return NextResponse.json({ error: 'Project not found or access denied' }, { status: 404 });
      }

      const messages = await prisma.message.findMany({
        where: { projectId },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              image: true,
            },
          },
          file: {
            select: {
              originalName: true,
              url: true,
              mimetype: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      });

      // Mark messages as read for this user
      await prisma.message.updateMany({
        where: {
          projectId,
          senderId: { not: session.user.id },
          isRead: false,
        },
        data: { isRead: true },
      });

      // Format messages for the client
      const formattedMessages = messages.map((msg) => ({
        id: msg.id,
        content: msg.content,
        sender: msg.sender,
        timestamp: msg.createdAt,
        isOwn: msg.senderId === session.user.id,
        file: msg.file || undefined,
      }));

      return NextResponse.json({ messages: formattedMessages });
    } catch (dbError) {
      console.error('Database error fetching portal messages:', dbError);
      return NextResponse.json({ messages: [] });
    }
  } catch (error) {
    console.error('Error in portal messages API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const content = formData.get('content') as string;
    const projectId = formData.get('projectId') as string;
    const fileCount = parseInt((formData.get('fileCount') as string) || '0');

    if ((!content?.trim() && fileCount === 0) || !projectId) {
      return NextResponse.json(
        { error: 'Content or files and project ID are required' },
        { status: 400 }
      );
    }

    try {
      const { prisma } = await import('@/lib/prisma');
      const { uploadFile } = await import('@/lib/upload');

      // Verify user has access to this project
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          clientId: session.user.id,
        },
      });

      if (!project) {
        return NextResponse.json({ error: 'Project not found or access denied' }, { status: 404 });
      }

      let fileId: string | undefined;

      // Handle file upload if present
      if (fileCount > 0) {
        const file = formData.get('file_0') as File;
        if (file) {
          try {
            const uploadResult = await uploadFile(file, projectId);

            // Save file to database
            const savedFile = await prisma.file.create({
              data: {
                filename: uploadResult.filename,
                originalName: uploadResult.originalName,
                mimetype: uploadResult.mimetype,
                size: uploadResult.size,
                url: uploadResult.url,
                uploaderId: session.user.id,
                projectId: projectId,
              },
            });

            fileId = savedFile.id;
          } catch (uploadError) {
            console.error('File upload error:', uploadError);
            return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
          }
        }
      }

      const message = await prisma.message.create({
        data: {
          content: content?.trim() || '',
          projectId,
          senderId: session.user.id,
          isRead: false,
          fileId: fileId,
          type: fileId ? 'FILE' : 'TEXT',
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              image: true,
            },
          },
          file: {
            select: {
              originalName: true,
              url: true,
              mimetype: true,
            },
          },
        },
      });

      // Create activity log
      await prisma.activity.create({
        data: {
          action: 'message_sent',
          description: `Message sent by client`,
          userId: session.user.id,
          projectId,
        },
      });

      // Format message for the client
      const formattedMessage = {
        id: message.id,
        content: message.content,
        sender: message.sender,
        timestamp: message.createdAt,
        isOwn: true,
        file: message.file || undefined,
      };

      return NextResponse.json(formattedMessage);
    } catch (dbError) {
      console.error('Database error sending portal message:', dbError);
      return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in send portal message API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
