import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const type = searchParams.get('type'); // 'all', 'projects', 'tasks', 'files', 'messages'

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ error: 'Query too short' }, { status: 400 });
    }

    const userId = session.user.id;
    const searchTerm = query.trim();

    // Prepare results object
    const results: {
      projects: any[];
      tasks: any[];
      files: any[];
      messages: any[];
      totalResults: number;
    } = {
      projects: [],
      tasks: [],
      files: [],
      messages: [],
      totalResults: 0,
    };

    // Search Projects (only user's projects or projects they're a member of)
    if (!type || type === 'all' || type === 'projects') {
      const projects = await prisma.project.findMany({
        where: {
          AND: [
            {
              OR: [
                { clientId: userId },
                { members: { some: { userId } } },
                // Admin can see all
                session.user.role === 'ADMIN' || session.user.role === 'OWNER'
                  ? {}
                  : { id: 'never' },
              ],
            },
            {
              OR: [
                { name: { contains: searchTerm, mode: 'insensitive' } },
                { description: { contains: searchTerm, mode: 'insensitive' } },
              ],
            },
          ],
        },
        select: {
          id: true,
          name: true,
          description: true,
          status: true,
          progress: true,
          websiteUrl: true,
          client: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
        },
        take: 10,
      });
      results.projects = projects.map((p) => ({ ...p, type: 'project' }));
    }

    // Search Tasks
    if (!type || type === 'all' || type === 'tasks') {
      const tasks = await prisma.task.findMany({
        where: {
          AND: [
            {
              project: {
                OR: [
                  { clientId: userId },
                  { members: { some: { userId } } },
                  session.user.role === 'ADMIN' || session.user.role === 'OWNER'
                    ? {}
                    : { id: 'never' },
                ],
              },
            },
            {
              OR: [
                { title: { contains: searchTerm, mode: 'insensitive' } },
                { description: { contains: searchTerm, mode: 'insensitive' } },
              ],
            },
          ],
        },
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          priority: true,
          dueDate: true,
          project: {
            select: {
              id: true,
              name: true,
            },
          },
          assignedTo: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
        },
        take: 20,
        orderBy: {
          updatedAt: 'desc',
        },
      });
      results.tasks = tasks.map((t) => ({ ...t, type: 'task' }));
    }

    // Search Files
    if (!type || type === 'all' || type === 'files') {
      const files = await prisma.file.findMany({
        where: {
          AND: [
            {
              project: {
                OR: [
                  { clientId: userId },
                  { members: { some: { userId } } },
                  session.user.role === 'ADMIN' || session.user.role === 'OWNER'
                    ? {}
                    : { id: 'never' },
                ],
              },
            },
            {
              OR: [
                { filename: { contains: searchTerm, mode: 'insensitive' } },
                { originalName: { contains: searchTerm, mode: 'insensitive' } },
              ],
            },
          ],
        },
        select: {
          id: true,
          filename: true,
          originalName: true,
          url: true,
          size: true,
          mimetype: true,
          createdAt: true,
          project: {
            select: {
              id: true,
              name: true,
            },
          },
          uploader: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
        },
        take: 15,
        orderBy: {
          createdAt: 'desc',
        },
      });
      results.files = files.map((f) => ({ ...f, type: 'file' }));
    }

    // Search Messages
    if (!type || type === 'all' || type === 'messages') {
      const messages = await prisma.message.findMany({
        where: {
          AND: [
            {
              OR: [
                { senderId: userId },
                { recipientId: userId },
                // Admin can see all
                session.user.role === 'ADMIN' || session.user.role === 'OWNER'
                  ? {}
                  : { id: 'never' },
              ],
            },
            {
              content: { contains: searchTerm, mode: 'insensitive' },
            },
          ],
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
          sender: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
          recipient: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
        },
        take: 15,
        orderBy: {
          createdAt: 'desc',
        },
      });
      results.messages = messages.map((m) => ({ ...m, type: 'message' }));
    }

    // Calculate total results
    results.totalResults =
      results.projects.length +
      results.tasks.length +
      results.files.length +
      results.messages.length;

    return NextResponse.json(results);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
