import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - List task templates
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');

  try {
    const templates = await prisma.taskTemplate.findMany({
      where: {
        OR: [
          { isPublic: true },
          { createdById: (session.user as any).id },
          projectId ? { projectId } : {},
        ],
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(templates);
  } catch (error) {
    console.error('Failed to fetch task templates:', error);
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
  }
}

// POST - Create task template
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, description, priority, estimatedHours, tags, checklist, isPublic, projectId } =
      body;

    const template = await prisma.taskTemplate.create({
      data: {
        name,
        description,
        priority: priority || 'MEDIUM',
        estimatedHours,
        tags: tags || [],
        checklist,
        isPublic: isPublic || false,
        projectId,
        createdById: (session.user as any).id,
      },
    });

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error('Failed to create task template:', error);
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
  }
}
