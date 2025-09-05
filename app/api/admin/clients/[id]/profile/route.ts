import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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
      // Fetch client data
      const client = await prisma.user.findUnique({
        where: { id: clientId },
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

      if (!client) {
        return NextResponse.json({ error: 'Client not found' }, { status: 404 });
      }

      // Fetch projects
      const projects = await prisma.project.findMany({
        where: { clientId },
        select: {
          id: true,
          name: true,
          description: true,
          status: true,
          progress: true,
          startDate: true,
          deadline: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      // Fetch recent messages
      const messages = await prisma.message.findMany({
        where: {
          project: { clientId },
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
          project: {
            select: { name: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      });

      // Fetch files
      const files = await prisma.file.findMany({
        where: {
          project: { clientId },
        },
        select: {
          id: true,
          originalName: true,
          size: true,
          mimetype: true,
          url: true,
          createdAt: true,
          project: {
            select: { name: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      // Fetch invoices
      const invoices = await prisma.invoice.findMany({
        where: {
          project: { clientId },
        },
        select: {
          id: true,
          amount: true,
          status: true,
          dueDate: true,
          project: {
            select: { name: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      // Calculate stats from invoices instead
      const totalRevenue = invoices
        .filter((inv) => inv.status === 'PAID')
        .reduce((sum, inv) => sum + Number(inv.amount), 0);

      const stats = {
        totalProjects: projects.length,
        activeProjects: projects.filter((p) => !['COMPLETED', 'CANCELLED'].includes(p.status))
          .length,
        totalRevenue,
        totalFiles: files.length,
        totalMessages: messages.length,
      };

      // Format the data
      const profileData = {
        client: {
          ...client,
          createdAt: client.createdAt.toISOString(),
        },
        projects: projects.map((project) => ({
          ...project,
          startDate: project.startDate.toISOString(),
          deadline: project.deadline?.toISOString() || null,
          totalValue: null, // We'll calculate from invoices instead
        })),
        messages: messages.map((message) => ({
          id: message.id,
          content: message.content,
          createdAt: message.createdAt.toISOString(),
          projectName: message.project?.name || 'Unknown Project',
        })),
        files: files.map((file) => ({
          id: file.id,
          originalName: file.originalName,
          size: file.size,
          mimetype: file.mimetype,
          url: file.url,
          createdAt: file.createdAt.toISOString(),
          projectName: file.project?.name || 'Unknown Project',
        })),
        invoices: invoices.map((invoice) => ({
          id: invoice.id,
          amount: Number(invoice.amount),
          status: invoice.status,
          dueDate: invoice.dueDate.toISOString(),
          projectName: invoice.project?.name || 'Unknown Project',
        })),
        stats,
      };

      return NextResponse.json(profileData);
    } catch (dbError) {
      console.error('Database error fetching client profile:', dbError);
      return NextResponse.json({ error: 'Failed to fetch client profile' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in client profile API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
