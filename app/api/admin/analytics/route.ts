import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Decimal } from '@prisma/client/runtime/library';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !['ADMIN', 'OWNER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30d';

    // Calculate date range
    const now = new Date();
    let startDate = new Date();

    switch (range) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    // Fetch invoices for revenue data
    const invoices = await prisma.invoice.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        id: true,
        status: true,
        totalAmount: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Fetch all invoices for stats
    const allInvoices = await prisma.invoice.findMany({
      select: {
        status: true,
        totalAmount: true,
      },
    });

    // Fetch projects for completion stats
    const projects = await prisma.project.findMany({
      select: {
        status: true,
        name: true,
      },
    });

    // Calculate revenue by month
    const revenueByMonth = new Map<string, { revenue: number; invoices: number }>();

    invoices.forEach((invoice) => {
      const month = new Date(invoice.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });

      const current = revenueByMonth.get(month) || { revenue: 0, invoices: 0 };

      if (invoice.status === 'PAID') {
        const amount =
          invoice.totalAmount instanceof Decimal
            ? invoice.totalAmount.toNumber()
            : Number(invoice.totalAmount);
        current.revenue += amount;
      }
      current.invoices += 1;

      revenueByMonth.set(month, current);
    });

    const revenueData = Array.from(revenueByMonth.entries()).map(([month, data]) => ({
      month,
      revenue: data.revenue,
      invoices: data.invoices,
    }));

    // Calculate invoice stats
    const invoiceStats = {
      total: allInvoices.length,
      paid: allInvoices.filter((inv) => inv.status === 'PAID').length,
      pending: allInvoices.filter((inv) => inv.status === 'SENT').length,
      overdue: allInvoices.filter((inv) => inv.status === 'OVERDUE').length,
      totalRevenue: allInvoices
        .filter((inv) => inv.status === 'PAID')
        .reduce((sum, inv) => {
          const amount =
            inv.totalAmount instanceof Decimal
              ? inv.totalAmount.toNumber()
              : Number(inv.totalAmount);
          return sum + amount;
        }, 0),
      pendingAmount: allInvoices
        .filter((inv) => ['SENT', 'OVERDUE'].includes(inv.status))
        .reduce((sum, inv) => {
          const amount =
            inv.totalAmount instanceof Decimal
              ? inv.totalAmount.toNumber()
              : Number(inv.totalAmount);
          return sum + amount;
        }, 0),
    };

    // Calculate project completion stats
    const projectCompletion = {
      completed: projects.filter((p) => p.status === 'COMPLETED').length,
      inProgress: projects.filter((p) => p.status === 'ACTIVE').length,
      notStarted: projects.filter((p) => p.status === 'PENDING').length,
    };

    // Calculate project stats by status
    const projectStatsByStatus = new Map<string, { count: number; value: number }>();

    projects.forEach((project) => {
      const current = projectStatsByStatus.get(project.status) || { count: 0, value: 0 };
      current.count += 1;
      // Value is just a placeholder since budget might not exist
      current.value += 1000;
      projectStatsByStatus.set(project.status, current);
    });

    const projectStats = Array.from(projectStatsByStatus.entries()).map(([status, data]) => ({
      status,
      count: data.count,
      value: data.value,
    }));

    // Client growth data (placeholder)
    const clientGrowth = [
      { month: 'Jan', clients: 5 },
      { month: 'Feb', clients: 8 },
      { month: 'Mar', clients: 12 },
    ];

    return NextResponse.json({
      revenueData,
      projectStats,
      clientGrowth,
      invoiceStats,
      projectCompletion,
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
