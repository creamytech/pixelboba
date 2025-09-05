import { getSettingValue } from './settings';

interface VisitorChatEmailData {
  visitorName?: string;
  visitorEmail?: string;
  source?: string;
  messages: Array<{
    content: string;
    isFromVisitor: boolean;
    timestamp: Date;
  }>;
  chatId: string;
}

export async function sendVisitorChatNotification(chatData: VisitorChatEmailData) {
  try {
    // Get email settings
    const fromName = (await getSettingValue('email.fromName')) || 'Pixel Boba';
    const fromEmail = (await getSettingValue('email.fromEmail')) || 'noreply@pixelboba.com';
    const apiKey = await getSettingValue('email.apiKey');

    if (!apiKey) {
      console.error('No email API key configured');
      return false;
    }

    // Format message history
    const messageHistory = chatData.messages
      .map((msg) => `${msg.isFromVisitor ? '👤 Visitor' : '🧋 Boba Bot'}: ${msg.content}`)
      .join('\n');

    const emailContent = `
🧋 New Visitor Chat Lead from Pixel Boba!

Visitor Details:
• Name: ${chatData.visitorName || 'Not provided'}
• Email: ${chatData.visitorEmail || 'Not provided'}
• Source Page: ${chatData.source || 'Not provided'}
• Chat ID: ${chatData.chatId}

Chat History:
${messageHistory}

---
This lead came through your website chat widget. 
${chatData.visitorEmail ? `You can follow up directly at: ${chatData.visitorEmail}` : 'No email provided for follow-up.'}

🎯 Pro tip: Quick responses to leads increase conversion rates!
    `;

    // Send email via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${fromName} <${fromEmail}>`,
        to: ['hello@pixelboba.com'],
        subject: `🧋 New Chat Lead: ${chatData.visitorName || 'Anonymous'} from website`,
        text: emailContent,
        html: emailContent.replace(/\n/g, '<br>').replace(/• /g, '<li>').replace(/---/g, '<hr>'),
      }),
    });

    if (response.ok) {
      console.log('Visitor chat notification sent successfully');
      return true;
    } else {
      console.error('Failed to send email:', await response.text());
      return false;
    }
  } catch (error) {
    console.error('Error sending visitor chat notification:', error);
    return false;
  }
}

export async function sendChatEndedNotification(
  chatData: VisitorChatEmailData & {
    adminName?: string;
    duration?: number;
  }
) {
  try {
    const fromName = (await getSettingValue('email.fromName')) || 'Pixel Boba';
    const fromEmail = (await getSettingValue('email.fromEmail')) || 'noreply@pixelboba.com';
    const apiKey = await getSettingValue('email.apiKey');

    if (!apiKey) return false;

    const messageHistory = chatData.messages
      .map((msg) => {
        const sender = msg.isFromVisitor
          ? '👤 Visitor'
          : chatData.adminName
            ? `👨‍💼 ${chatData.adminName}`
            : '🧋 Boba Bot';
        return `${sender}: ${msg.content}`;
      })
      .join('\n');

    const emailContent = `
🧋 Chat Session Completed - Pixel Boba

Session Summary:
• Visitor: ${chatData.visitorName || 'Anonymous'}
• Email: ${chatData.visitorEmail || 'Not provided'}
• Duration: ${chatData.duration ? `${Math.round(chatData.duration / 60)} minutes` : 'Unknown'}
• Handled by: ${chatData.adminName || 'Bot only'}

Complete Chat History:
${messageHistory}

---
${chatData.visitorEmail ? `Follow up with: ${chatData.visitorEmail}` : 'No contact info provided.'}
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${fromName} <${fromEmail}>`,
        to: ['hello@pixelboba.com'],
        subject: `📝 Chat Summary: ${chatData.visitorName || 'Anonymous'} conversation ended`,
        text: emailContent,
        html: emailContent.replace(/\n/g, '<br>').replace(/• /g, '<li>').replace(/---/g, '<hr>'),
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error sending chat ended notification:', error);
    return false;
  }
}
