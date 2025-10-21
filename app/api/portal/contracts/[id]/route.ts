import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prisma } = await import('@/lib/prisma');
    const { id: contractId } = await params;

    const contract = await prisma.contract.findFirst({
      where: {
        id: contractId,
        clientId: session.user.id,
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
