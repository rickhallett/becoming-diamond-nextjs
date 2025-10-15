import { Resend } from 'resend';
import { render } from '@react-email/render';
import { WelcomeEmail } from '@/emails/welcome-email';
import { log } from '@/lib/logger';

// Initialize Resend client
export const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'hello@becomingdiamond.com';
const ADMIN_EMAIL = process.env.RESEND_ADMIN_EMAIL;

interface SendWelcomeEmailParams {
  to: string;
  unsubscribeToken: string;
}

interface EmailResult {
  success: boolean;
  emailId?: string;
  error?: string;
}

/**
 * Send welcome email to new lead
 * Includes retry logic with exponential backoff
 */
export async function sendWelcomeEmail(
  params: SendWelcomeEmailParams,
  retryCount = 0
): Promise<EmailResult> {
  const { to, unsubscribeToken } = params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3003';
  const unsubscribeUrl = `${baseUrl}/api/unsubscribe?token=${unsubscribeToken}`;

  try {
    // Render email template
    const emailHtml = await render(
      WelcomeEmail({
        email: to,
        unsubscribeUrl,
      })
    );

    // Send email via Resend
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Your Diamond Sprint Materials Are Here 💎',
      html: emailHtml,
    });

    await log.info(`Welcome email sent to ${to}`, 'EMAIL', {
      emailId: result.data?.id,
      to,
    });

    return {
      success: true,
      emailId: result.data?.id,
    };
  } catch (error) {
    await log.error(`Failed to send welcome email to ${to}`, 'EMAIL', error);

    // Retry logic (max 3 attempts)
    if (retryCount < 2) {
      const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff: 1s, 2s
      await log.info(
        `Retrying email send to ${to} in ${delay}ms (attempt ${retryCount + 2}/3)`,
        'EMAIL'
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
      return sendWelcomeEmail(params, retryCount + 1);
    }

    // Return error after all retries exhausted
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send admin notification for new lead
 * Optional - only sends if RESEND_ADMIN_EMAIL is configured
 */
export async function sendAdminNotification(params: {
  email: string;
  referrer?: string | null;
  landingPage?: string;
}): Promise<void> {
  if (!ADMIN_EMAIL) {
    // Admin notifications not configured
    return;
  }

  try {
    const { email, referrer, landingPage } = params;

    const subject = `New Lead: ${email}`;
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            h1 { color: #4fc3f7; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f4f4f4; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>New Lead Captured</h1>
            <table>
              <tr>
                <th>Email</th>
                <td>${email}</td>
              </tr>
              ${referrer ? `<tr><th>Referrer</th><td>${referrer}</td></tr>` : ''}
              ${landingPage ? `<tr><th>Landing Page</th><td>${landingPage}</td></tr>` : ''}
              <tr>
                <th>Timestamp</th>
                <td>${new Date().toLocaleString()}</td>
              </tr>
            </table>
          </div>
        </body>
      </html>
    `;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject,
      html,
    });

    await log.info(`Admin notification sent for lead: ${email}`, 'EMAIL');
  } catch (error) {
    // Don't fail the request if admin notification fails
    await log.error('Failed to send admin notification', 'EMAIL', error);
  }
}

/**
 * Validate email configuration
 * Call this on app startup to ensure Resend is properly configured
 */
export function validateEmailConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!process.env.RESEND_API_KEY) {
    errors.push('RESEND_API_KEY is not set');
  }

  if (!process.env.RESEND_FROM_EMAIL) {
    errors.push('RESEND_FROM_EMAIL is not set (will use default: hello@becomingdiamond.com)');
  }

  if (!process.env.NEXT_PUBLIC_BASE_URL) {
    errors.push('NEXT_PUBLIC_BASE_URL is not set (will use default: http://localhost:3003)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
