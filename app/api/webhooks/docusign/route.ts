import { NextRequest, NextResponse } from 'next/server';
import { DocuSignService } from '@/lib/docusign';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('DocuSign webhook received:', JSON.stringify(body, null, 2));

    const { data } = body;

    if (!data || !data.envelopeId) {
      console.error('Invalid DocuSign webhook payload - missing envelope data');
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const { prisma } = await import('@/lib/prisma');
    const envelopeId = data.envelopeId;
    const envelopeStatus = data.envelopeSummary?.status || data.status;

    console.log(
      `Processing DocuSign webhook for envelope ${envelopeId}, status: ${envelopeStatus}`
    );

    // Find the contract associated with this envelope
    const contract = await prisma.contract.findFirst({
      where: { docusignEnvelopeId: envelopeId },
      include: {
        client: true,
        project: true,
      },
    });

    if (!contract) {
      console.error(`Contract not found for envelope ${envelopeId}`);
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    let updateData: any = {};
    let shouldCreateSignature = false;
    let shouldSendNotification = false;

    switch (envelopeStatus?.toLowerCase()) {
      case 'sent':
        updateData = { status: 'SENT', sentAt: new Date() };
        break;

      case 'completed':
        updateData = {
          status: 'SIGNED',
          signedAt: new Date(),
        };
        shouldCreateSignature = true;
        shouldSendNotification = true;
        console.log(`Contract ${contract.id} completed in DocuSign`);
        break;

      case 'declined':
        updateData = { status: 'CANCELLED' };
        shouldSendNotification = true;
        console.log(`Contract ${contract.id} declined in DocuSign`);
        break;

      case 'voided':
        updateData = { status: 'CANCELLED' };
        shouldSendNotification = true;
        console.log(`Contract ${contract.id} voided in DocuSign`);
        break;

      case 'expired':
        updateData = { status: 'EXPIRED' };
        shouldSendNotification = true;
        console.log(`Contract ${contract.id} expired in DocuSign`);
        break;

      default:
        console.log(`Unhandled DocuSign status: ${envelopeStatus}`);
        break;
    }

    // Update contract status
    if (Object.keys(updateData).length > 0) {
      await prisma.contract.update({
        where: { id: contract.id },
        data: updateData,
      });
      console.log(`Contract ${contract.id} updated with status ${updateData.status}`);
    }

    // Create signature record for completed contracts
    if (shouldCreateSignature) {
      try {
        await prisma.signature.create({
          data: {
            imageData: 'docusign-signature', // Placeholder - actual signature would come from DocuSign
            contractId: contract.id,
            signerId: contract.clientId,
            signedAt: new Date(),
            ipAddress: 'docusign',
            userAgent: 'DocuSign Platform',
          },
        });
        console.log(`Signature record created for contract ${contract.id}`);
      } catch (signatureError) {
        console.error('Error creating signature record:', signatureError);
      }
    }

    // Send email notification if needed
    if (shouldSendNotification) {
      try {
        const { triggerContractUpdateEmail } = await import('@/lib/emailTriggers');

        // Get admin users to notify
        const admins = await prisma.user.findMany({
          where: { role: { in: ['ADMIN', 'OWNER'] } },
        });

        // Notify admins
        for (const admin of admins) {
          try {
            const adminUser = {
              ...admin,
              name: admin.name || 'Admin',
            };
            await triggerContractUpdateEmail(adminUser as any, contract as any, updateData.status);
          } catch (emailError) {
            console.error(`Failed to send email to admin ${admin.email}:`, emailError);
          }
        }

        // Notify client if contract was completed
        if (updateData.status === 'SIGNED') {
          try {
            const clientUser = {
              ...contract.client,
              name: contract.client.name || 'Client',
            };
            await triggerContractUpdateEmail(clientUser as any, contract as any, 'SIGNED');
          } catch (emailError) {
            console.error(`Failed to send email to client ${contract.client.email}:`, emailError);
          }
        }

        console.log(`Email notifications sent for contract ${contract.id}`);
      } catch (emailError) {
        console.error('Error sending contract update emails:', emailError);
      }
    }

    // Process DocuSign webhook through service
    try {
      await DocuSignService.handleWebhook(body);
    } catch (serviceError) {
      console.error('DocuSign service webhook processing error:', serviceError);
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully',
      contractId: contract.id,
      status: updateData.status || 'unchanged',
    });
  } catch (error) {
    console.error('DocuSign webhook processing error:', error);
    return NextResponse.json(
      {
        error: 'Webhook processing failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Handle GET requests for webhook verification (if DocuSign requires it)
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const challenge = url.searchParams.get('challenge');

  if (challenge) {
    return new Response(challenge, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  return NextResponse.json({
    message: 'DocuSign webhook endpoint is active',
    timestamp: new Date().toISOString(),
  });
}
