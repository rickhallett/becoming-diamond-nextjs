/**
 * Email Testing Helper Utilities
 *
 * Provides utilities for testing email functionality in E2E tests.
 * Supports Mailosaur and MailHog email testing services.
 */

/**
 * Email testing service configuration
 */
export interface EmailConfig {
  provider: 'mailosaur' | 'mailhog' | 'mock';
  apiKey?: string;
  serverId?: string;
  host?: string;
  port?: number;
}

/**
 * Email message structure
 */
export interface EmailMessage {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
  receivedAt: Date;
}

/**
 * Get email testing configuration from environment
 */
export function getEmailConfig(): EmailConfig {
  if (process.env.MAILOSAUR_API_KEY && process.env.MAILOSAUR_SERVER_ID) {
    return {
      provider: 'mailosaur',
      apiKey: process.env.MAILOSAUR_API_KEY,
      serverId: process.env.MAILOSAUR_SERVER_ID
    };
  }

  if (process.env.MAILHOG_HOST) {
    return {
      provider: 'mailhog',
      host: process.env.MAILHOG_HOST || 'localhost',
      port: parseInt(process.env.MAILHOG_WEB_PORT || '8025')
    };
  }

  return {
    provider: 'mock'
  };
}

/**
 * Wait for email to arrive
 *
 * Polls the email service for a new email matching the criteria.
 *
 * @param recipient - Email address to check
 * @param subject - Subject line to match (partial match)
 * @param timeout - Maximum wait time in milliseconds
 * @returns Email message
 */
export async function waitForEmail(
  recipient: string,
  subject: string,
  timeout: number = 30000
): Promise<EmailMessage> {
  const config = getEmailConfig();

  if (config.provider === 'mailosaur') {
    return await waitForEmailMailosaur(recipient, subject, timeout, config);
  }

  if (config.provider === 'mailhog') {
    return await waitForEmailMailHog(recipient, subject, timeout, config);
  }

  throw new Error('Email testing not configured. Set up Mailosaur or MailHog.');
}

/**
 * Extract magic link from email
 *
 * Parses the email HTML/text to find the authentication magic link.
 *
 * @param email - Email message
 * @returns Magic link URL
 */
export function extractMagicLink(email: EmailMessage): string {
  // Try to find link in HTML
  const htmlLinkMatch = email.html.match(/href="([^"]*(?:signin|verify|callback)[^"]*)"/i);
  if (htmlLinkMatch) {
    return htmlLinkMatch[1];
  }

  // Try to find link in text
  const textLinkMatch = email.text.match(/(https?:\/\/[^\s]+(?:signin|verify|callback)[^\s]*)/i);
  if (textLinkMatch) {
    return textLinkMatch[1];
  }

  throw new Error('Magic link not found in email');
}

/**
 * Delete all emails for a recipient
 *
 * Cleans up test emails from the inbox.
 *
 * @param recipient - Email address to clean up
 */
export async function deleteEmails(recipient: string): Promise<void> {
  const config = getEmailConfig();

  if (config.provider === 'mailosaur') {
    await deleteEmailsMailosaur(recipient, config);
  }

  if (config.provider === 'mailhog') {
    await deleteEmailsMailHog(recipient, config);
  }
}

/**
 * Mailosaur implementation
 */
async function waitForEmailMailosaur(
  recipient: string,
  subject: string,
  timeout: number,
  config: EmailConfig
): Promise<EmailMessage> {
  // TODO: Implement Mailosaur client
  // Requires: npm install mailosaur @types/mailosaur
  /*
  import { MailosaurClient } from 'mailosaur';
  const client = new MailosaurClient(config.apiKey!);

  const message = await client.messages.get(
    config.serverId!,
    {
      sentTo: recipient,
      subject: subject
    },
    { timeout }
  );

  return {
    from: message.from[0].email!,
    to: message.to[0].email!,
    subject: message.subject!,
    html: message.html?.body || '',
    text: message.text?.body || '',
    receivedAt: new Date(message.received!)
  };
  */

  throw new Error('Mailosaur client not implemented. Install mailosaur package and implement.');
}

async function deleteEmailsMailosaur(
  recipient: string,
  config: EmailConfig
): Promise<void> {
  // TODO: Implement Mailosaur deletion
  console.warn('Mailosaur email deletion not implemented');
}

/**
 * MailHog implementation
 */
async function waitForEmailMailHog(
  recipient: string,
  subject: string,
  timeout: number,
  config: EmailConfig
): Promise<EmailMessage> {
  const startTime = Date.now();
  const baseUrl = `http://${config.host}:${config.port}`;

  while (Date.now() - startTime < timeout) {
    try {
      const response = await fetch(`${baseUrl}/api/v2/messages`);
      const data = await response.json();

      // Search for matching email
      const message = data.items?.find((item: any) => {
        const to = item.To?.[0]?.Mailbox + '@' + item.To?.[0]?.Domain;
        const emailSubject = item.Content?.Headers?.Subject?.[0] || '';

        return (
          to.toLowerCase() === recipient.toLowerCase() &&
          emailSubject.toLowerCase().includes(subject.toLowerCase())
        );
      });

      if (message) {
        const from = message.From?.Mailbox + '@' + message.From?.Domain;
        const to = message.To?.[0]?.Mailbox + '@' + message.To?.[0]?.Domain;

        return {
          from,
          to,
          subject: message.Content?.Headers?.Subject?.[0] || '',
          html: message.Content?.Body || '',
          text: message.Content?.Body || '',
          receivedAt: new Date(message.Created)
        };
      }
    } catch (error) {
      console.warn('MailHog API error:', error);
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  throw new Error(`Email not received within ${timeout}ms`);
}

async function deleteEmailsMailHog(
  recipient: string,
  config: EmailConfig
): Promise<void> {
  const baseUrl = `http://${config.host}:${config.port}`;

  try {
    // MailHog DELETE all messages
    await fetch(`${baseUrl}/api/v1/messages`, { method: 'DELETE' });
  } catch (error) {
    console.warn('MailHog deletion error:', error);
  }
}

/**
 * Setup instructions for email testing services
 */
export function printEmailSetupInstructions(): void {
  console.log(`
Email Testing Setup Instructions:

Option 1: Mailosaur (Cloud Service)
1. Sign up at https://mailosaur.com
2. Create a server
3. Set environment variables:
   MAILOSAUR_API_KEY=your-api-key
   MAILOSAUR_SERVER_ID=your-server-id
4. Install package: npm install mailosaur @types/mailosaur

Option 2: MailHog (Local SMTP)
1. Install MailHog: brew install mailhog (macOS)
2. Run MailHog: mailhog
3. Set environment variables:
   MAILHOG_HOST=localhost
   MAILHOG_PORT=1025
   MAILHOG_WEB_PORT=8025
4. Configure Resend to use SMTP (development mode)

Option 3: Mock (No Email Service)
- Tests requiring email will be skipped
- Useful for quick test runs without email verification
  `);
}
