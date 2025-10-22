import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET all layout settings or specific ones
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const elementId = searchParams.get('elementId');
    const page = searchParams.get('page');

    let settings;

    if (elementId) {
      settings = await prisma.layoutSetting.findUnique({
        where: { elementId },
      });
    } else if (page) {
      settings = await prisma.layoutSetting.findMany({
        where: {
          OR: [{ page }, { page: 'all' }],
        },
      });
    } else {
      settings = await prisma.layoutSetting.findMany({
        orderBy: { page: 'asc' },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching layout settings:', error);
    return NextResponse.json({ error: 'Failed to fetch layout settings' }, { status: 500 });
  }
}

// POST create or update layout setting
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    const setting = await prisma.layoutSetting.upsert({
      where: {
        elementId: data.elementId,
      },
      update: {
        positionX: data.positionX,
        positionY: data.positionY,
        width: data.width,
        height: data.height,
        scale: data.scale,
        rotation: data.rotation,
        opacity: data.opacity,
        zIndex: data.zIndex,
      },
      create: {
        elementId: data.elementId,
        elementType: data.elementType,
        page: data.page,
        positionX: data.positionX || 0,
        positionY: data.positionY || 0,
        width: data.width,
        height: data.height,
        scale: data.scale || 1.0,
        rotation: data.rotation || 0,
        opacity: data.opacity || 1.0,
        zIndex: data.zIndex || 0,
      },
    });

    return NextResponse.json(setting);
  } catch (error) {
    console.error('Error saving layout setting:', error);
    return NextResponse.json({ error: 'Failed to save layout setting' }, { status: 500 });
  }
}

// DELETE layout setting
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const elementId = searchParams.get('elementId');

    if (!elementId) {
      return NextResponse.json({ error: 'Element ID required' }, { status: 400 });
    }

    await prisma.layoutSetting.delete({
      where: { elementId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting layout setting:', error);
    return NextResponse.json({ error: 'Failed to delete layout setting' }, { status: 500 });
  }
}
