import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - List auto-assignment rules
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');

  try {
    const rules = await prisma.autoAssignmentRule.findMany({
      where: projectId ? { projectId } : {},
      orderBy: { priority: 'desc' },
    });

    return NextResponse.json(rules);
  } catch (error) {
    console.error('Failed to fetch auto-assignment rules:', error);
    return NextResponse.json({ error: 'Failed to fetch rules' }, { status: 500 });
  }
}

// POST - Create auto-assignment rule
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, description, conditions, assignToId, isActive, priority, projectId } = body;

    const rule = await prisma.autoAssignmentRule.create({
      data: {
        name,
        description,
        conditions,
        assignToId,
        isActive: isActive !== undefined ? isActive : true,
        priority: priority || 0,
        projectId,
      },
    });

    return NextResponse.json(rule, { status: 201 });
  } catch (error) {
    console.error('Failed to create auto-assignment rule:', error);
    return NextResponse.json({ error: 'Failed to create rule' }, { status: 500 });
  }
}
