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
      let project;
      if (session.user.role === 'CLIENT') {
        project = await prisma.project.findFirst({
          where: {
            id: projectId,
            clientId: session.user.id,
          },
        });
      } else {
        // Admin/Owner can access any project
        project = await prisma.project.findUnique({
          where: { id: projectId },
        });
      }

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

      // Override sender name with display name for admin users
      let displayName: string | null = null;
      try {
        const { getSettingValue } = await import('@/lib/settings');
        displayName = await getSettingValue('company.displayName');
      } catch (error) {
        console.error('Error fetching display name:', error);
      }

      // Format messages for the client
      const formattedMessages = messages.map((msg) => {
        const sender = { ...msg.sender };

        // Override sender name if it's an admin/owner and we have a display name
        if ((sender.role === 'ADMIN' || sender.role === 'OWNER') && displayName) {
          sender.name = displayName;
        }

        return {
          id: msg.id,
          content: msg.content,
          sender: sender,
          timestamp: msg.createdAt,
          isOwn: msg.senderId === session.user.id,
          file: msg.file || undefined,
        };
      });

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
    const existingFileCount = parseInt((formData.get('existingFileCount') as string) || '0');

    console.log('Portal message POST received:', {
      content: content?.trim(),
      projectId,
      fileCount,
      existingFileCount,
      hasContent: !!content?.trim(),
      hasFiles: fileCount > 0,
      hasExistingFiles: existingFileCount > 0,
    });

    if ((!content?.trim() && fileCount === 0 && existingFileCount === 0) || !projectId) {
      console.log('Validation failed:', {
        contentEmpty: !content?.trim(),
        noFiles: fileCount === 0,
        noExistingFiles: existingFileCount === 0,
        noProjectId: !projectId,
      });
      return NextResponse.json(
        { error: 'Content or files and project ID are required' },
        { status: 400 }
      );
    }

    try {
      const { prisma } = await import('@/lib/prisma');
      const { uploadFile } = await import('@/lib/upload');

      // Verify user has access to this project
      let project;
      if (session.user.role === 'CLIENT') {
        project = await prisma.project.findFirst({
          where: {
            id: projectId,
            clientId: session.user.id,
          },
        });
      } else {
        // Admin/Owner can send messages to any project
        project = await prisma.project.findUnique({
          where: { id: projectId },
        });
      }

      if (!project) {
        return NextResponse.json({ error: 'Project not found or access denied' }, { status: 404 });
      }

      // Handle multiple file uploads and existing files
      const createdMessages = [];

      // Handle new file uploads
      if (fileCount > 0) {
        for (let i = 0; i < fileCount; i++) {
          const file = formData.get(`file_${i}`) as File;
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
                  publicId: uploadResult.publicId || null,
                  uploaderId: session.user.id,
                  projectId: projectId,
                },
              });

              // Create message for this file
              const fileMessage = await prisma.message.create({
                data: {
                  content: i === 0 && content?.trim() ? content.trim() : '', // Only add text to first file message
                  projectId,
                  senderId: session.user.id,
                  isRead: false,
                  fileId: savedFile.id,
                  type: 'FILE',
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

              createdMessages.push(fileMessage);
            } catch (uploadError) {
              console.error('File upload error:', uploadError);
              return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
            }
          }
        }
      }

      // Handle existing files from library
      if (existingFileCount > 0) {
        for (let i = 0; i < existingFileCount; i++) {
          const existingFileId = formData.get(`existingFileId_${i}`) as string;
          if (existingFileId) {
            try {
              // Verify file exists and user has access
              const existingFile = await prisma.file.findFirst({
                where: {
                  id: existingFileId,
                  OR: [
                    { uploaderId: session.user.id }, // User owns the file
                    {
                      project: {
                        OR: [
                          { clientId: session.user.id }, // User owns the project
                          ...(session.user.role === 'ADMIN' || session.user.role === 'OWNER'
                            ? [{}]
                            : []), // Admin/Owner can access all
                        ],
                      },
                    },
                  ],
                },
              });

              if (existingFile) {
                // Create message for this existing file
                const fileMessage = await prisma.message.create({
                  data: {
                    content: i === 0 && content?.trim() ? content.trim() : '', // Only add text to first file message
                    projectId,
                    senderId: session.user.id,
                    isRead: false,
                    fileId: existingFile.id,
                    type: 'FILE',
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

                createdMessages.push(fileMessage);
              }
            } catch (existingFileError) {
              console.error('Error using existing file:', existingFileError);
              // Continue with other files instead of failing completely
            }
          }
        }
      }

      // Create text-only message if no files
      if (content?.trim() && fileCount === 0 && existingFileCount === 0) {
        // Create text-only message
        const textMessage = await prisma.message.create({
          data: {
            content: content.trim(),
            projectId,
            senderId: session.user.id,
            isRead: false,
            type: 'TEXT',
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

        createdMessages.push(textMessage);
      }

      // Override sender name with display name for admin users in all messages
      for (const message of createdMessages) {
        if (message.sender.role === 'ADMIN' || message.sender.role === 'OWNER') {
          try {
            const { getSettingValue } = await import('@/lib/settings');
            const displayName = await getSettingValue('company.displayName');
            if (displayName) {
              message.sender.name = displayName;
            }
          } catch (error) {
            console.error('Error fetching display name:', error);
          }
        }
      }

      // Create activity log for the message(s)
      await prisma.activity.create({
        data: {
          action: 'message_sent',
          description: `Message sent by client`,
          userId: session.user.id,
          projectId,
        },
      });

      // Format messages for the client and return the first one (for compatibility)
      const formattedMessages = createdMessages.map((message) => ({
        id: message.id,
        content: message.content,
        sender: message.sender,
        timestamp: message.createdAt,
        isOwn: true,
        file: message.file || undefined,
      }));

      // Return the first message for compatibility with existing frontend
      // The frontend will refetch all messages anyway
      return NextResponse.json(formattedMessages[0] || { success: true });
    } catch (dbError) {
      console.error('Database error sending portal message:', dbError);
      return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in send portal message API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
