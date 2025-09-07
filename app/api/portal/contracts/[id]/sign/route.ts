import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { DocuSignService } from '@/lib/docusign';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prisma } = await import('@/lib/prisma');
    const contractId = params.id;
    const { signatureData } = await request.json();

    // Find the contract
    const contract = await prisma.contract.findFirst({
      where: {
        id: contractId,
        clientId: session.user.id,
        status: 'SENT',
      },
      include: {
        client: true,
        project: true,
      },
    });

    if (!contract) {
      return NextResponse.json(
        { error: 'Contract not found or not available for signing' },
        { status: 404 }
      );
    }

    // Check if contract has expired
    if (contract.expiresAt && new Date() > contract.expiresAt) {
      await prisma.contract.update({
        where: { id: contractId },
        data: { status: 'EXPIRED' },
      });
      return NextResponse.json({ error: 'Contract has expired' }, { status: 400 });
    }

    try {
      // Create DocuSign envelope
      const { envelopeId, signingUrl } = await DocuSignService.createEnvelope({
        title: contract.title,
        content: contract.content,
        clientEmail: contract.client.email,
        clientName: contract.client.name || 'Client',
      });

      // Update contract with DocuSign envelope ID
      await prisma.contract.update({
        where: { id: contractId },
        data: {
          docusignEnvelopeId: envelopeId,
        },
      });

      // If signature data is provided (manual signing), create signature record
      if (signatureData) {
        const signature = await prisma.signature.create({
          data: {
            imageData: signatureData,
            contractId: contractId,
            signerId: session.user.id,
            signedAt: new Date(),
            ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
            userAgent: request.headers.get('user-agent') || 'unknown',
          },
        });

        // Update contract status
        await prisma.contract.update({
          where: { id: contractId },
          data: {
            status: 'SIGNED',
            signedAt: new Date(),
          },
        });

        return NextResponse.json({
          success: true,
          message: 'Contract signed successfully',
          signature: {
            id: signature.id,
            signedAt: signature.signedAt.toISOString(),
          },
        });
      } else {
        // Return DocuSign signing URL for external signing
        return NextResponse.json({
          success: true,
          signingUrl,
          envelopeId,
        });
      }
    } catch (docusignError) {
      console.error('DocuSign integration error:', docusignError);

      // Fallback to manual signing if DocuSign fails
      if (signatureData) {
        const signature = await prisma.signature.create({
          data: {
            imageData: signatureData,
            contractId: contractId,
            signerId: session.user.id,
            signedAt: new Date(),
            ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
            userAgent: request.headers.get('user-agent') || 'unknown',
          },
        });

        await prisma.contract.update({
          where: { id: contractId },
          data: {
            status: 'SIGNED',
            signedAt: new Date(),
          },
        });

        return NextResponse.json({
          success: true,
          message: 'Contract signed successfully (manual signature)',
          signature: {
            id: signature.id,
            signedAt: signature.signedAt.toISOString(),
          },
        });
      } else {
        return NextResponse.json(
          { error: 'DocuSign integration failed. Please try manual signing.' },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error('Error signing contract:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prisma } = await import('@/lib/prisma');
    const contractId = params.id;

    // Get contract with DocuSign envelope ID
    const contract = await prisma.contract.findFirst({
      where: {
        id: contractId,
        clientId: session.user.id,
      },
      include: {
        client: true,
      },
    });

    if (!contract || !contract.docusignEnvelopeId) {
      return NextResponse.json(
        { error: 'Contract not found or not set up for DocuSign' },
        { status: 404 }
      );
    }

    try {
      // Get DocuSign signing URL
      const accountId = await DocuSignService.getAccountId();
      const signingUrl = await DocuSignService.getSigningUrl(
        accountId,
        contract.docusignEnvelopeId,
        contract.client.email,
        contract.client.name || 'Client'
      );

      return NextResponse.json({
        signingUrl,
        envelopeId: contract.docusignEnvelopeId,
      });
    } catch (docusignError) {
      console.error('DocuSign signing URL error:', docusignError);
      return NextResponse.json({ error: 'Failed to get DocuSign signing URL' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error getting signing URL:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
