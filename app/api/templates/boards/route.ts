import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - List board templates
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const templates = await prisma.boardTemplate.findMany({
      where: {
        OR: [{ isPublic: true }, { createdById: (session.user as any).id }],
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(templates);
  } catch (error) {
    console.error('Failed to fetch board templates:', error);
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
  }
}

// POST - Create board template
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, description, tasks, isPublic } = body;

    const template = await prisma.boardTemplate.create({
      data: {
        name,
        description,
        tasks,
        isPublic: isPublic || false,
        createdById: (session.user as any).id,
      },
    });

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error('Failed to create board template:', error);
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
  }
}
