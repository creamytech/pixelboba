import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { DocuSignService } from '@/lib/docusign';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { prisma } = await import('@/lib/prisma');
    const contractId = params.id;

    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
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
    });

    if (!contract) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    const formattedContract = {
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
    };

    return NextResponse.json({ contract: formattedContract });
  } catch (error) {
    console.error('Error fetching contract:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { prisma } = await import('@/lib/prisma');
    const contractId = params.id;
    const body = await request.json();
    const { title, content, status, expiresAt, projectId } = body;

    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        client: true,
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!contract) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    // If sending the contract, create DocuSign envelope
    if (status === 'SENT' && contract.status === 'DRAFT') {
      try {
        const { envelopeId } = await DocuSignService.createEnvelope({
          title: title || contract.title,
          content: content || contract.content,
          clientEmail: contract.client.email,
          clientName: contract.client.name || 'Client',
          templateId: contract.docusignTemplateId || undefined,
          templateVariables: contract.docusignTemplateId
            ? {
                ClientName: contract.client.name || 'Client',
                ProjectName: contract.project?.name || 'General Services',
                ContractTitle: title || contract.title,
              }
            : undefined,
        });

        const updatedContract = await prisma.contract.update({
          where: { id: contractId },
          data: {
            title: title || contract.title,
            content: content || contract.content,
            status: 'SENT',
            sentAt: new Date(),
            expiresAt: expiresAt ? new Date(expiresAt) : contract.expiresAt,
            projectId: projectId !== undefined ? projectId : contract.projectId,
            docusignEnvelopeId: envelopeId,
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

        return NextResponse.json({
          contract: {
            ...updatedContract,
            sentAt: updatedContract.sentAt?.toISOString(),
            signedAt: updatedContract.signedAt?.toISOString(),
            expiresAt: updatedContract.expiresAt?.toISOString(),
            createdAt: updatedContract.createdAt.toISOString(),
            updatedAt: updatedContract.updatedAt.toISOString(),
          },
          envelopeId,
        });
      } catch (docusignError) {
        console.error('DocuSign error when sending contract:', docusignError);
        // Continue with database update even if DocuSign fails
      }
    }

    const updatedContract = await prisma.contract.update({
      where: { id: contractId },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(status && { status }),
        ...(expiresAt && { expiresAt: new Date(expiresAt) }),
        ...(projectId !== undefined && { projectId }),
        ...(status === 'SENT' && contract.status === 'DRAFT' && { sentAt: new Date() }),
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
    });

    const formattedContract = {
      id: updatedContract.id,
      title: updatedContract.title,
      content: updatedContract.content,
      status: updatedContract.status,
      sentAt: updatedContract.sentAt?.toISOString(),
      signedAt: updatedContract.signedAt?.toISOString(),
      expiresAt: updatedContract.expiresAt?.toISOString(),
      docusignEnvelopeId: updatedContract.docusignEnvelopeId,
      client: updatedContract.client,
      project: updatedContract.project,
      signatures: updatedContract.signatures.map((sig) => ({
        id: sig.id,
        signer: sig.signer,
        signedAt: sig.signedAt.toISOString(),
        ipAddress: sig.ipAddress,
      })),
      files: updatedContract.files.map((file) => ({
        id: file.id,
        filename: file.filename,
        originalName: file.originalName,
        url: file.url,
        size: file.size,
        createdAt: file.createdAt.toISOString(),
      })),
      createdAt: updatedContract.createdAt.toISOString(),
      updatedAt: updatedContract.updatedAt.toISOString(),
    };

    return NextResponse.json({ contract: formattedContract });
  } catch (error) {
    console.error('Error updating contract:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { prisma } = await import('@/lib/prisma');
    const contractId = params.id;

    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
    });

    if (!contract) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    // Don't allow deletion of signed contracts
    if (contract.status === 'SIGNED') {
      return NextResponse.json({ error: 'Cannot delete signed contracts' }, { status: 400 });
    }

    // Delete associated signatures and files first
    await prisma.signature.deleteMany({
      where: { contractId },
    });

    await prisma.file.deleteMany({
      where: { contractId },
    });

    // Delete the contract
    await prisma.contract.delete({
      where: { id: contractId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting contract:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
