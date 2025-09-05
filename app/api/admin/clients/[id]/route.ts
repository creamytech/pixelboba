import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin access
    if (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { prisma } = await import('@/lib/prisma');
    const clientId = params.id;
    const updateData = await request.json();

    try {
      // Update client data
      const updatedClient = await prisma.user.update({
        where: { id: clientId },
        data: {
          name: updateData.name,
          email: updateData.email,
          phone: updateData.phone || null,
          company: updateData.company || null,
          role: updateData.role,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          company: true,
          role: true,
          image: true,
          createdAt: true,
        },
      });

      return NextResponse.json(updatedClient);
    } catch (dbError) {
      console.error('Database error updating client:', dbError);
      return NextResponse.json({ error: 'Failed to update client' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in update client API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin access
    if (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { prisma } = await import('@/lib/prisma');
    const clientId = params.id;

    try {
      // Delete client (this will cascade to related records based on schema)
      await prisma.user.delete({
        where: { id: clientId },
      });

      return NextResponse.json({ success: true });
    } catch (dbError) {
      console.error('Database error deleting client:', dbError);
      return NextResponse.json({ error: 'Failed to delete client' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in delete client API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
