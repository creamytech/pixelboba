import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Update request
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { status, priority, title, description } = await request.json();
    const resolvedParams = await params;
    const requestId = resolvedParams.id;

    // Verify request belongs to user's organization
    const existingRequest = await prisma.request.findUnique({
      where: { id: requestId },
      include: {
        organization: {
          include: {
            owner: true,
            members: true,
          },
        },
      },
    });

    if (!existingRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    const isMember =
      existingRequest.organization?.ownerId === session.user.id ||
      existingRequest.organization?.members.some((m) => m.id === session.user.id);

    if (!isMember) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (title) updateData.title = title;
    if (description) updateData.description = description;

    // Track start time when status changes to IN_PROGRESS
    if (status === 'IN_PROGRESS' && !existingRequest.startedAt) {
      updateData.startedAt = new Date();
    }

    // Track completion time
    if (status === 'COMPLETED' && !existingRequest.completedAt) {
      updateData.completedAt = new Date();
    }

    const updatedRequest = await prisma.request.update({
      where: { id: requestId },
      data: updateData,
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ request: updatedRequest });
  } catch (error) {
    console.error('Error updating request:', error);
    return NextResponse.json({ error: 'Failed to update request' }, { status: 500 });
  }
}

// Delete request
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const requestId = resolvedParams.id;

    // Verify request belongs to user's organization
    const existingRequest = await prisma.request.findUnique({
      where: { id: requestId },
      include: {
        organization: true,
      },
    });

    if (!existingRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    if (existingRequest.organization?.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: 'Only organization owner can delete requests' },
        { status: 403 }
      );
    }

    await prisma.request.delete({
      where: { id: requestId },
    });

    return NextResponse.json({ message: 'Request deleted successfully' });
  } catch (error) {
    console.error('Error deleting request:', error);
    return NextResponse.json({ error: 'Failed to delete request' }, { status: 500 });
  }
}
