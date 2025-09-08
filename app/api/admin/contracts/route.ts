import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { prisma } = await import('@/lib/prisma');

    const contracts = await prisma.contract.findMany({
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        signatures: {
          include: {
            signer: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        files: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedContracts = contracts.map((contract) => ({
      id: contract.id,
      title: contract.title,
      content: contract.content,
      status: contract.status,
      sentAt: contract.sentAt?.toISOString(),
      signedAt: contract.signedAt?.toISOString(),
      expiresAt: contract.expiresAt?.toISOString(),
      docusignEnvelopeId: contract.docusignEnvelopeId,
      client: contract.client,
      project: contract.project,
      signatures: contract.signatures.map((sig) => ({
        id: sig.id,
        signer: sig.signer,
        signedAt: sig.signedAt.toISOString(),
        ipAddress: sig.ipAddress,
      })),
      files: contract.files.map((file) => ({
        id: file.id,
        filename: file.filename,
        originalName: file.originalName,
        url: file.url,
        size: file.size,
        createdAt: file.createdAt.toISOString(),
      })),
      createdAt: contract.createdAt.toISOString(),
      updatedAt: contract.updatedAt.toISOString(),
    }));

    return NextResponse.json({ contracts: formattedContracts });
  } catch (error) {
    console.error('Error fetching contracts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { prisma } = await import('@/lib/prisma');
    const body = await request.json();
    const { title, content, clientId, projectId, expiresAt, templateId } = body;

    if (!title || !content || !clientId) {
      return NextResponse.json(
        { error: 'Title, content, and client ID are required' },
        { status: 400 }
      );
    }

    // Verify client exists
    const client = await prisma.user.findUnique({
      where: { id: clientId, role: 'CLIENT' },
    });

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // Verify project exists if provided
    if (projectId) {
      const project = await prisma.project.findFirst({
        where: { id: projectId, clientId },
      });

      if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }
    }

    const contract = await prisma.contract.create({
      data: {
        title,
        content,
        status: 'DRAFT',
        clientId,
        projectId: projectId || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        docusignTemplateId: templateId || null, // Store DocuSign template ID
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const formattedContract = {
      id: contract.id,
      title: contract.title,
      content: contract.content,
      status: contract.status,
      sentAt: contract.sentAt?.toISOString(),
      signedAt: contract.signedAt?.toISOString(),
      expiresAt: contract.expiresAt?.toISOString(),
      client: contract.client,
      project: contract.project,
      signatures: [],
      files: [],
      createdAt: contract.createdAt.toISOString(),
      updatedAt: contract.updatedAt.toISOString(),
    };

    return NextResponse.json({ contract: formattedContract }, { status: 201 });
  } catch (error) {
    console.error('Error creating contract:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
