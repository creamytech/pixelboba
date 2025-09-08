import jwt from 'jsonwebtoken';

// DocuSign API configuration
const DOCUSIGN_CONFIG = {
  DEMO_BASE_URL: 'https://demo.docusign.net/restapi',
  PRODUCTION_BASE_URL: 'https://na1.docusign.net/restapi', // Update based on your account
  OAUTH_BASE_URL: 'https://account-d.docusign.com', // Demo environment
  SCOPE: 'signature impersonation',
};

interface DocuSignAuthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface DocuSignEnvelopeRequest {
  // For document-based envelopes
  documents?: Array<{
    documentBase64: string;
    name: string;
    fileExtension: string;
    documentId: string;
  }>;
  recipients?: {
    signers: Array<{
      email: string;
      name: string;
      recipientId: string;
      tabs?: {
        signHereTabs?: Array<{
          documentId: string;
          pageNumber: string;
          xPosition: string;
          yPosition: string;
        }>;
      };
    }>;
  };
  // For template-based envelopes
  templateId?: string;
  templateRoles?: Array<{
    email: string;
    name: string;
    roleName: string;
    tabs?: {
      textTabs?: Array<{
        tabLabel: string;
        value: string;
        tabId: string;
      }>;
    };
  }>;
  status: 'sent' | 'created';
  emailSubject: string;
  emailBlurb: string;
}

export class DocuSignService {
  private static authToken: DocuSignAuthToken | null = null;
  private static tokenExpiry: number = 0;

  static async getAccessToken(): Promise<string> {
    if (this.authToken && Date.now() < this.tokenExpiry) {
      return this.authToken.access_token;
    }

    const integrationKey = process.env.DOCUSIGN_INTEGRATION_KEY;
    const userId = process.env.DOCUSIGN_USER_ID;
    const privateKey = process.env.DOCUSIGN_PRIVATE_KEY;

    if (!integrationKey || !userId || !privateKey) {
      throw new Error('DocuSign environment variables not configured');
    }

    // Create JWT assertion
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: integrationKey,
      sub: userId,
      iat: now,
      exp: now + 3600, // 1 hour
      aud: 'account-d.docusign.com',
      scope: DOCUSIGN_CONFIG.SCOPE,
    };

    const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });

    try {
      const response = await fetch(`${DOCUSIGN_CONFIG.OAUTH_BASE_URL}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          assertion: token,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`DocuSign authentication failed: ${error}`);
      }

      this.authToken = await response.json();
      this.tokenExpiry = Date.now() + (this.authToken!.expires_in - 300) * 1000; // Buffer 5 minutes

      return this.authToken!.access_token;
    } catch (error) {
      console.error('DocuSign authentication error:', error);
      throw error;
    }
  }

  static async getAccountId(): Promise<string> {
    const accountId = process.env.DOCUSIGN_ACCOUNT_ID;
    if (accountId) {
      return accountId;
    }

    // If not provided, get from user info
    const accessToken = await this.getAccessToken();
    const response = await fetch(`${DOCUSIGN_CONFIG.OAUTH_BASE_URL}/oauth/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get DocuSign account info');
    }

    const userInfo = await response.json();
    return userInfo.accounts[0].account_id;
  }

  static async createEnvelope(contractData: {
    title: string;
    content: string;
    clientEmail: string;
    clientName: string;
    templateId?: string; // DocuSign template ID
    templateVariables?: Record<string, string>; // Variables to populate in template
  }): Promise<{ envelopeId: string; signingUrl: string }> {
    const accessToken = await this.getAccessToken();
    const accountId = await this.getAccountId();

    let envelopeRequest: DocuSignEnvelopeRequest;

    // Use DocuSign template if provided, otherwise create from document
    if (contractData.templateId) {
      // Template-based envelope
      envelopeRequest = {
        templateId: contractData.templateId,
        templateRoles: [
          {
            email: contractData.clientEmail,
            name: contractData.clientName,
            roleName: 'Client', // This should match the role in your DocuSign template
            tabs: contractData.templateVariables
              ? {
                  textTabs: Object.entries(contractData.templateVariables).map(
                    ([key, value], index) => ({
                      tabLabel: key,
                      value: value,
                      tabId: (index + 1).toString(),
                    })
                  ),
                }
              : undefined,
          },
        ],
        status: 'sent',
        emailSubject: `Please sign: ${contractData.title}`,
        emailBlurb: 'Please review and sign this contract from Pixel Boba.',
      };
    } else {
      // Document-based envelope (fallback to current method)
      const documentBase64 = createContractPDF(contractData.title, contractData.content);

      envelopeRequest = {
        documents: [
          {
            documentBase64,
            name: contractData.title,
            fileExtension: 'pdf',
            documentId: '1',
          },
        ],
        recipients: {
          signers: [
            {
              email: contractData.clientEmail,
              name: contractData.clientName,
              recipientId: '1',
              tabs: {
                signHereTabs: [
                  {
                    documentId: '1',
                    pageNumber: '1',
                    xPosition: '100',
                    yPosition: '100',
                  },
                ],
              },
            },
          ],
        },
        status: 'sent',
        emailSubject: `Please sign: ${contractData.title}`,
        emailBlurb: 'Please review and sign this contract from Pixel Boba.',
      };
    }

    try {
      const response = await fetch(
        `${DOCUSIGN_CONFIG.DEMO_BASE_URL}/v2.1/accounts/${accountId}/envelopes`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(envelopeRequest),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to create DocuSign envelope: ${error}`);
      }

      const envelope = await response.json();

      // Get signing URL
      const signingUrl = await this.getSigningUrl(
        accountId,
        envelope.envelopeId,
        contractData.clientEmail,
        contractData.clientName
      );

      return {
        envelopeId: envelope.envelopeId,
        signingUrl,
      };
    } catch (error) {
      console.error('DocuSign envelope creation error:', error);
      throw error;
    }
  }

  static async getSigningUrl(
    accountId: string,
    envelopeId: string,
    clientEmail: string,
    clientName: string
  ): Promise<string> {
    const accessToken = await this.getAccessToken();

    const recipientViewRequest = {
      authenticationMethod: 'none',
      email: clientEmail,
      userName: clientName,
      recipientId: '1',
      returnUrl: `${process.env.NEXTAUTH_URL}/portal?tab=contracts&signed=${envelopeId}`,
      clientUserId: clientEmail, // Unique identifier for the recipient
    };

    try {
      const response = await fetch(
        `${DOCUSIGN_CONFIG.DEMO_BASE_URL}/v2.1/accounts/${accountId}/envelopes/${envelopeId}/views/recipient`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(recipientViewRequest),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to get signing URL: ${error}`);
      }

      const result = await response.json();
      return result.url;
    } catch (error) {
      console.error('DocuSign signing URL error:', error);
      throw error;
    }
  }

  static async getEnvelopeStatus(envelopeId: string): Promise<any> {
    const accessToken = await this.getAccessToken();
    const accountId = await this.getAccountId();

    try {
      const response = await fetch(
        `${DOCUSIGN_CONFIG.DEMO_BASE_URL}/v2.1/accounts/${accountId}/envelopes/${envelopeId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get envelope status');
      }

      return await response.json();
    } catch (error) {
      console.error('DocuSign status check error:', error);
      throw error;
    }
  }

  static async downloadSignedDocument(envelopeId: string): Promise<Buffer> {
    const accessToken = await this.getAccessToken();
    const accountId = await this.getAccountId();

    try {
      const response = await fetch(
        `${DOCUSIGN_CONFIG.DEMO_BASE_URL}/v2.1/accounts/${accountId}/envelopes/${envelopeId}/documents/combined`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to download signed document');
      }

      return Buffer.from(await response.arrayBuffer());
    } catch (error) {
      console.error('DocuSign document download error:', error);
      throw error;
    }
  }

  static async getTemplates(): Promise<
    Array<{ templateId: string; name: string; description?: string }>
  > {
    try {
      const accessToken = await this.getAccessToken();
      const accountId = await this.getAccountId();

      const response = await fetch(
        `${DOCUSIGN_CONFIG.DEMO_BASE_URL}/v2.1/accounts/${accountId}/templates`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get DocuSign templates');
      }

      const data = await response.json();
      return (
        data.envelopeTemplates?.map((template: any) => ({
          templateId: template.templateId,
          name: template.name,
          description: template.description,
        })) || []
      );
    } catch (error) {
      console.error('DocuSign get templates error:', error);
      return [];
    }
  }

  static async handleWebhook(webhookData: any): Promise<void> {
    // Process DocuSign webhook events
    const { envelopeId, envelopeSummary } = webhookData;

    if (envelopeSummary?.status === 'completed') {
      // Update contract status in database
      console.log(`Contract ${envelopeId} has been completed`);
      // You would typically update your database here
    }
  }
}

// Helper function to create a simple PDF-like document
export function createContractPDF(title: string, content: string): string {
  // This is a simplified version - in production, you'd use a proper PDF library
  const pdfContent = `
%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> >>
endobj
4 0 obj
<< /Length ${content.length + title.length + 100} >>
stream
BT
/F1 18 Tf
50 750 Td
(${title}) Tj
0 -30 Td
/F1 12 Tf
(${content.replace(/\n/g, ') Tj 0 -15 Td (')}) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000010 00000 n 
0000000053 00000 n 
0000000110 00000 n 
0000000295 00000 n 
trailer
<< /Size 5 /Root 1 0 R >>
startxref
${400 + content.length + title.length}
%%EOF
`;
  return Buffer.from(pdfContent).toString('base64');
}
