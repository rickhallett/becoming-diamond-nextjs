import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { WelcomeEmail } from "@/emails/welcome-email";
import { log } from '@/lib/axiom-logger';
import fs from "fs";
import path from "path";

// Gmail SMTP configuration
const GMAIL_USER = process.env.GMAIL_USER; // support@becomingdiamond.com
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD; // Generated from Google Workspace
// const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "support@becomingdiamond.com";
// const ADMIN_EMAIL = process.env.RESEND_ADMIN_EMAIL;
const FROM_EMAIL = GMAIL_USER;
const ADMIN_EMAIL = GMAIL_USER;

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
 * Gmail SMTP Configuration
 *
 * Uses smtp.gmail.com hostname for proper DNS resolution and load balancing.
 * Configured with extended timeouts for reliable email delivery.
 *
 * This configuration is used by both:
 * - NextAuth magic link emails
 * - Newsletter welcome emails
 */
export const GMAIL_SMTP_CONFIG = {
  host: "smtp.gmail.com", // Use proper hostname for DNS resolution and load balancing
  port: 465,
  secure: true, // Use SSL
  tls: {
    servername: "smtp.gmail.com", // Required for certificate validation
    rejectUnauthorized: true,
  },
  connectionTimeout: 60000, // 60 seconds
  greetingTimeout: 30000,
  socketTimeout: 120000,
  logger: true,
} as const;

/**
 * Create Gmail SMTP transporter
 */
function getGmailTransporter() {
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    throw new Error(
      "GMAIL_USER and GMAIL_APP_PASSWORD environment variables are required"
    );
  }

  // Remove any spaces or quotes from app password
  const cleanPassword = GMAIL_APP_PASSWORD.replace(/[\s"']/g, "");

  return nodemailer.createTransport({
    ...GMAIL_SMTP_CONFIG,
    auth: {
      user: GMAIL_USER,
      pass: cleanPassword,
    },
  });
}

/**
 * Load Diamond Manifesto PDF as attachment
 */
function getManifestoAttachment(): {
  filename: string;
  path: string;
} | null {
  try {
    const manifestoPath = path.join(
      process.cwd(),
      "public",
      "assets",
      "diamond-manifesto.pdf"
    );

    if (!fs.existsSync(manifestoPath)) {
      // Fire and forget - don't block on logging
      log.error("Diamond Manifesto PDF not found", {
        context: "EMAIL",
        path: manifestoPath,
        timestamp: new Date().toISOString(),
      });
      return null;
    }

    return {
      filename: "Diamond-Manifesto.pdf",
      path: manifestoPath,
    };
  } catch (error) {
    // Fire and forget - don't block on logging
    log.error("Failed to load Diamond Manifesto for attachment", {
      context: "EMAIL",
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return null;
  }
}

/**
 * Send welcome email via Gmail SMTP
 */
export async function sendWelcomeEmail(
  params: SendWelcomeEmailParams,
  retryCount = 0
): Promise<EmailResult> {
  const { to, unsubscribeToken } = params;

  // Construct base URL with Vercel auto-detection support
  // Priority: NEXT_PUBLIC_BASE_URL > VERCEL_URL (auto-provided by Vercel) > localhost fallback
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3003");
  const unsubscribeUrl = `${baseUrl}/api/unsubscribe?token=${unsubscribeToken}`;

  try {
    await log.info("Starting email send", {
      context: "EMAIL",
      to,
      retryCount,
      timestamp: new Date().toISOString(),
    });

    // Render email template
    const emailHtml = await render(
      WelcomeEmail({
        email: to,
        unsubscribeUrl,
      })
    );

    await log.info("Email template rendered", {
      context: "EMAIL",
      to,
      timestamp: new Date().toISOString(),
    });

    // Load manifesto attachment
    const manifestoAttachment = getManifestoAttachment();

    // Get Gmail transporter
    const transporter = getGmailTransporter();
    await log.info("Gmail SMTP transporter initialized", {
      context: "EMAIL",
      fromEmail: FROM_EMAIL,
      timestamp: new Date().toISOString(),
    });

    // Prepare email payload
    const emailPayload: {
      from: string;
      to: string;
      subject: string;
      html: string;
      attachments?: Array<{ filename: string; path: string }>;
    } = {
      from: FROM_EMAIL || "",
      to,
      subject: "Your Diamond Sprint Materials + Manifesto Are Here",
      html: emailHtml,
    };

    // Add attachment if available
    if (manifestoAttachment) {
      emailPayload.attachments = [manifestoAttachment];
      await log.info("Including Diamond Manifesto attachment", {
        context: "EMAIL",
        filename: manifestoAttachment.filename,
        to,
        timestamp: new Date().toISOString(),
      });
    } else {
      await log.warn("Sending email without Diamond Manifesto attachment", {
        context: "EMAIL",
        to,
        timestamp: new Date().toISOString(),
      });
    }

    // Send email via Gmail SMTP
    await log.info("Calling Gmail SMTP", {
      context: "EMAIL",
      from: emailPayload.from,
      to: emailPayload.to,
      hasAttachments: !!emailPayload.attachments,
      timestamp: new Date().toISOString(),
    });

    let result;
    try {
      result = await transporter.sendMail(emailPayload);
    } catch (smtpError) {
      const err = smtpError as Error & { code?: string; command?: string; response?: string; responseCode?: number };
      await log.error("Gmail SMTP send failed", {
        context: "EMAIL",
        error: err.message,
        code: err.code,
        command: err.command,
        response: err.response,
        responseCode: err.responseCode,
        to,
        timestamp: new Date().toISOString(),
      });
      throw smtpError;
    }

    await log.info("Gmail SMTP response received", {
      context: "EMAIL",
      messageId: result.messageId,
      accepted: result.accepted,
      rejected: result.rejected,
      response: result.response,
      to,
      timestamp: new Date().toISOString(),
    });

    if (result.rejected && result.rejected.length > 0) {
      await log.error("Gmail SMTP rejected recipients", {
        context: "EMAIL",
        rejected: result.rejected,
        to,
        timestamp: new Date().toISOString(),
      });
      return {
        success: false,
        error: `Recipients rejected: ${result.rejected.join(", ")}`,
      };
    }

    await log.info("Welcome email sent successfully", {
      context: "EMAIL",
      emailId: result.messageId,
      to,
      hasAttachment: !!emailPayload.attachments,
      retryCount,
      timestamp: new Date().toISOString(),
    });

    return {
      success: true,
      emailId: result.messageId,
    };
  } catch (error) {
    await log.error("Failed to send welcome email", {
      context: "EMAIL",
      to,
      error: error instanceof Error ? error.message : String(error),
      retryCount,
      timestamp: new Date().toISOString(),
    });

    // Retry logic (max 3 attempts)
    if (retryCount < 2) {
      const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff: 1s, 2s
      await log.info("Scheduling email retry", {
        context: "EMAIL",
        to,
        delayMs: delay,
        attemptNumber: retryCount + 2,
        timestamp: new Date().toISOString(),
      });

      await new Promise((resolve) => setTimeout(resolve, delay));
      return sendWelcomeEmail(params, retryCount + 1);
    }

    // Return error after all retries exhausted
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send admin notification via Gmail SMTP
 */
export async function sendAdminNotification(params: {
  email: string;
  referrer?: string | null;
  landingPage?: string;
}): Promise<void> {
  if (!ADMIN_EMAIL) {
    return;
  }

  const { email, referrer, landingPage } = params;

  try {

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
              ${referrer ? `<tr><th>Referrer</th><td>${referrer}</td></tr>` : ""}
              ${landingPage ? `<tr><th>Landing Page</th><td>${landingPage}</td></tr>` : ""}
              <tr>
                <th>Timestamp</th>
                <td>${new Date().toLocaleString()}</td>
              </tr>
            </table>
          </div>
        </body>
      </html>
    `;

    const transporter = getGmailTransporter();
    await transporter.sendMail({
      from: FROM_EMAIL || "",
      to: ADMIN_EMAIL,
      subject,
      html,
    });

    await log.info("Admin notification sent", {
      context: "EMAIL",
      leadEmail: email,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    await log.error("Failed to send admin notification", {
      context: "EMAIL",
      leadEmail: email,
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
  }
}
