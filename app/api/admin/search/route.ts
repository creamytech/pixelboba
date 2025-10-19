import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || !['ADMIN', 'OWNER'].includes(session.user.role || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    if (query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const searchTerm = query.toLowerCase();
    const results: any[] = [];

    // Search projects
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      include: {
        client: { select: { name: true, email: true } },
      },
      take: 5,
    });

    results.push(
      ...projects.map((project) => ({
        id: project.id,
        title: project.name,
        subtitle: project.client.name || project.client.email,
        type: 'project' as const,
        url: `/admin?tab=projects&project=${project.id}`,
        metadata: { status: project.status },
      }))
    );

    // Search clients
    const clients = await prisma.user.findMany({
      where: {
        role: 'CLIENT',
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { email: { contains: searchTerm, mode: 'insensitive' } },
          { company: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      take: 5,
    });

    results.push(
      ...clients.map((client) => ({
        id: client.id,
        title: client.name || client.email,
        subtitle: client.company || client.email,
        type: 'client' as const,
        url: `/admin?tab=clients&client=${client.id}`,
      }))
    );

    // Search invoices
    const invoices = await prisma.invoice.findMany({
      where: {
        OR: [
          { number: { contains: searchTerm, mode: 'insensitive' } },
          { title: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      include: {
        client: { select: { name: true, email: true } },
      },
      take: 5,
    });

    results.push(
      ...invoices.map((invoice) => ({
        id: invoice.id,
        title: `Invoice ${invoice.number}`,
        subtitle: `${invoice.client.name || invoice.client.email} - $${invoice.totalAmount}`,
        type: 'invoice' as const,
        url: `/admin?tab=invoices&invoice=${invoice.id}`,
        metadata: { status: invoice.status },
      }))
    );

    // Search contracts
    const contracts = await prisma.contract.findMany({
      where: {
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { content: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      include: {
        client: { select: { name: true, email: true } },
      },
      take: 5,
    });

    results.push(
      ...contracts.map((contract) => ({
        id: contract.id,
        title: contract.title,
        subtitle: contract.client.name || contract.client.email,
        type: 'contract' as const,
        url: `/admin?tab=contracts&contract=${contract.id}`,
        metadata: { status: contract.status },
      }))
    );

    // Search messages
    const messages = await prisma.message.findMany({
      where: {
        content: { contains: searchTerm, mode: 'insensitive' },
      },
      include: {
        project: { select: { name: true } },
        sender: { select: { name: true, email: true } },
      },
      take: 5,
    });

    results.push(
      ...messages.map((message) => ({
        id: message.id,
        title: message.content.substring(0, 60) + (message.content.length > 60 ? '...' : ''),
        subtitle: `${message.sender.name || message.sender.email}${message.project ? ` in ${message.project.name}` : ''}`,
        type: 'message' as const,
        url: `/admin?tab=projects&project=${message.projectId}`,
      }))
    );

    // Sort by relevance (title matches first, then subtitle matches)
    results.sort((a, b) => {
      const aTitle = a.title.toLowerCase().indexOf(searchTerm);
      const bTitle = b.title.toLowerCase().indexOf(searchTerm);
      if (aTitle !== -1 && bTitle === -1) return -1;
      if (aTitle === -1 && bTitle !== -1) return 1;
      if (aTitle !== -1 && bTitle !== -1) return aTitle - bTitle;
      return 0;
    });

    return NextResponse.json({ results: results.slice(0, 20) });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
