import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin/owner role
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    console.log('Admin stats API called by:', session.user.email);

    try {
      // Dynamic import to avoid build-time database connection
      const { prisma } = await import('@/lib/prisma');

      // Get comprehensive admin statistics
      const [
        totalClients,
        activeProjects,
        completedProjects,
        totalProjects,
        pendingInvoices,
        paidInvoices,
        totalRevenue,
        pendingContracts,
        signedContracts,
        recentActivity,
      ] = await Promise.all([
        // Total clients (users with CLIENT role)
        prisma.user.count({
          where: { role: 'CLIENT' },
        }),

        // Active projects (not completed or cancelled)
        prisma.project.count({
          where: {
            status: {
              notIn: ['COMPLETED', 'CANCELLED'],
            },
          },
        }),

        // Completed projects
        prisma.project.count({
          where: { status: 'COMPLETED' },
        }),

        // Total projects
        prisma.project.count(),

        // Pending invoices
        prisma.invoice.count({
          where: {
            status: { in: ['SENT', 'OVERDUE'] },
          },
        }),

        // Paid invoices
        prisma.invoice.count({
          where: { status: 'PAID' },
        }),

        // Total revenue from paid invoices
        prisma.invoice.aggregate({
          where: { status: 'PAID' },
          _sum: { totalAmount: true },
        }),

        // Pending contracts
        prisma.contract.count({
          where: { status: 'SENT' },
        }),

        // Signed contracts
        prisma.contract.count({
          where: { status: 'SIGNED' },
        }),

        // Recent activities (last 10)
        prisma.activity.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: { name: true, email: true },
            },
            project: {
              select: { name: true },
            },
          },
        }),
      ]);

      // Calculate average project duration (for completed projects)
      const completedProjectsWithDuration = await prisma.project.findMany({
        where: {
          status: 'COMPLETED',
          completedAt: { not: null },
        },
        select: {
          startDate: true,
          completedAt: true,
        },
      });

      const averageProjectDuration =
        completedProjectsWithDuration.length > 0
          ? Math.round(
              completedProjectsWithDuration.reduce((total, project) => {
                const duration = Math.floor(
                  (new Date(project.completedAt!).getTime() -
                    new Date(project.startDate).getTime()) /
                    (1000 * 60 * 60 * 24)
                );
                return total + duration;
              }, 0) / completedProjectsWithDuration.length
            )
          : 0;

      // Calculate monthly revenue (last 30 days of paid invoices)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const monthlyRevenue = await prisma.invoice.aggregate({
        where: {
          status: 'PAID',
          paidAt: {
            gte: thirtyDaysAgo,
          },
        },
        _sum: { totalAmount: true },
      });

      const adminStats = {
        totalClients,
        activeProjects,
        completedProjects,
        monthlyRevenue: Number(monthlyRevenue._sum.totalAmount || 0),
        totalRevenue: Number(totalRevenue._sum.totalAmount || 0),
        pendingInvoices,
        paidInvoices,
        pendingContracts,
        signedContracts,
        averageProjectDuration,
        recentActivity: recentActivity.map((activity) => ({
          id: activity.id,
          action: activity.action,
          description: activity.description,
          user: activity.user,
          project: activity.project,
          createdAt: activity.createdAt,
        })),
      };

      console.log('Returning admin stats:', {
        totalClients,
        activeProjects,
        monthlyRevenue: adminStats.monthlyRevenue,
      });

      return NextResponse.json(adminStats);
    } catch (dbError) {
      console.error('Database error in admin stats:', dbError);

      // Return mock data if database fails
      const mockStats = {
        totalClients: 0,
        activeProjects: 0,
        completedProjects: 0,
        monthlyRevenue: 0,
        totalRevenue: 0,
        pendingInvoices: 0,
        paidInvoices: 0,
        pendingContracts: 0,
        signedContracts: 0,
        averageProjectDuration: 0,
        recentActivity: [],
      };

      console.log('Returning mock admin stats due to database error');
      return NextResponse.json(mockStats);
    }
  } catch (error) {
    console.error('Error in admin stats API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
