import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/admin/users/[id]/permissions - Get user permissions
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    const resolvedParams = await params;

    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = resolvedParams.id;

    // Get or create permissions
    let permissions = await prisma.userPermissions.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    // Create default permissions if they don't exist
    if (!permissions) {
      permissions = await prisma.userPermissions.create({
        data: { userId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      });
    }

    return NextResponse.json({ permissions });
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    return NextResponse.json({ error: 'Failed to fetch permissions' }, { status: 500 });
  }
}

// PATCH /api/admin/users/[id]/permissions - Update user permissions
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    const resolvedParams = await params;

    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = resolvedParams.id;
    const body = await request.json();

    // Extract permission fields
    const {
      canAccessDashboard,
      canAccessProjects,
      canAccessTasks,
      canAccessMessages,
      canAccessFiles,
      canAccessInvoices,
      canAccessContracts,
      canAccessMeetings,
      canAccessTeam,
      canAccessRequests,
      canAccessBilling,
      canUploadFiles,
      canCreateTasks,
      canEditTasks,
      canDeleteTasks,
      canSendMessages,
      canInviteTeam,
      canViewAnalytics,
      canManageProjects,
    } = body;

    // Upsert permissions
    const permissions = await prisma.userPermissions.upsert({
      where: { userId },
      update: {
        canAccessDashboard,
        canAccessProjects,
        canAccessTasks,
        canAccessMessages,
        canAccessFiles,
        canAccessInvoices,
        canAccessContracts,
        canAccessMeetings,
        canAccessTeam,
        canAccessRequests,
        canAccessBilling,
        canUploadFiles,
        canCreateTasks,
        canEditTasks,
        canDeleteTasks,
        canSendMessages,
        canInviteTeam,
        canViewAnalytics,
        canManageProjects,
      },
      create: {
        userId,
        canAccessDashboard,
        canAccessProjects,
        canAccessTasks,
        canAccessMessages,
        canAccessFiles,
        canAccessInvoices,
        canAccessContracts,
        canAccessMeetings,
        canAccessTeam,
        canAccessRequests,
        canAccessBilling,
        canUploadFiles,
        canCreateTasks,
        canEditTasks,
        canDeleteTasks,
        canSendMessages,
        canInviteTeam,
        canViewAnalytics,
        canManageProjects,
      },
    });

    return NextResponse.json({ permissions });
  } catch (error) {
    console.error('Error updating user permissions:', error);
    return NextResponse.json({ error: 'Failed to update permissions' }, { status: 500 });
  }
}
