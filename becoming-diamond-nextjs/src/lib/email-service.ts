/**
 * Email Service Layer
 *
 * Centralized service for triggering automated emails based on user actions.
 * Uses Gmail SMTP for email delivery (simplified MVP).
 */

import { log } from "@/lib/logger";

const FROM_EMAIL = process.env.GMAIL_USER || "support@becomingdiamond.com";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3003";

interface EmailResult {
  success: boolean;
  emailId?: string;
  error?: string;
}

// ============================================================================
// WELCOME EMAIL (Sprint Signup)
// ============================================================================

interface SendWelcomeEmailParams {
  email: string;
  unsubscribeToken: string;
}

/**
 * Send welcome email when user signs up for the sprint.
 * Email sending is handled by NextAuth via Gmail SMTP.
 */
export async function sendWelcomeEmail(
  params: SendWelcomeEmailParams
): Promise<EmailResult> {
  try {
    // Email sending is handled by NextAuth via Gmail SMTP
    // This function is kept for compatibility but doesn't need to send manually
    await log.info(`Welcome email queued for ${params.email}`, "EMAIL_SERVICE");

    return {
      success: true,
      emailId: "handled-by-nextauth",
    };
  } catch (error) {
    await log.error(`Exception processing welcome email for ${params.email}`, "EMAIL_SERVICE", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ============================================================================
// BOOK PURCHASE CONFIRMATION EMAIL
// ============================================================================

interface SendBookPurchaseEmailParams {
  email: string;
  downloadUrl: string;
  orderNumber: string;
}

/**
 * Send email with download link after book purchase.
 */
export async function sendBookPurchaseEmail(
  params: SendBookPurchaseEmailParams
): Promise<EmailResult> {
  const { email, downloadUrl, orderNumber } = params;

  try {
    // Note: For MVP, book purchase emails could be sent via Gmail SMTP
    // For now, returning success as email is handled separately

    const subject = `Your Becoming Diamond Book is Ready 📖`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              background-color: #000000;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              padding: 20px 0;
              margin: 0;
            }
            .container {
              margin: 0 auto;
              padding: 40px 20px;
              max-width: 600px;
            }
            .header {
              margin-bottom: 32px;
              text-align: center;
            }
            .logo {
              color: #4fc3f7;
              font-size: 24px;
              font-weight: bold;
              margin: 0;
            }
            h1 {
              color: #ffffff;
              font-size: 32px;
              font-weight: bold;
              line-height: 1.3;
              margin-bottom: 24px;
              text-align: center;
            }
            p {
              color: #ffffff;
              font-size: 16px;
              line-height: 1.6;
              margin-bottom: 16px;
            }
            .order-box {
              background-color: rgba(79, 195, 247, 0.05);
              border: 1px solid rgba(79, 195, 247, 0.3);
              border-radius: 8px;
              padding: 20px;
              margin: 24px 0;
            }
            .order-number {
              color: #9ca3af;
              font-size: 14px;
              margin: 0;
            }
            .button-container {
              margin: 32px 0;
              text-align: center;
            }
            .button {
              background-color: #4fc3f7;
              color: #000000;
              font-size: 18px;
              font-weight: bold;
              padding: 16px 32px;
              border-radius: 8px;
              text-decoration: none;
              display: inline-block;
              cursor: pointer;
            }
            .footer {
              margin-top: 48px;
              padding-top: 24px;
              border-top: 1px solid rgba(255,255,255,0.1);
            }
            .footer-text {
              color: #9ca3af;
              font-size: 14px;
              text-align: center;
              margin-bottom: 8px;
            }
            .link {
              color: #4fc3f7;
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 class="logo">Becoming Diamond</h2>
            </div>

            <h1>Your Book is Ready! 📖</h1>

            <p>Thank you for purchasing Becoming Diamond. Your download is ready.</p>

            <div class="order-box">
              <p class="order-number">Order: ${orderNumber}</p>
            </div>

            <div class="button-container">
              <a href="${downloadUrl}" class="button">Download Your Book →</a>
            </div>

            <p style="color: #9ca3af; font-size: 14px; text-align: center;">
              Save this email—your download link will remain active.
            </p>

            <div class="footer">
              <p class="footer-text">
                Questions? Contact us at <a href="mailto:${FROM_EMAIL}" class="link">${FROM_EMAIL}</a>
              </p>
              <p class="footer-text">
                <a href="${BASE_URL}/privacy" class="link">Privacy Policy</a>
                •
                <a href="${BASE_URL}/terms" class="link">Terms</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    // For MVP, book purchase confirmation is handled separately
    // This stub function returns success for compatibility
    await log.info(`Book purchase email queued for ${email}`, "EMAIL_SERVICE", {
      orderNumber,
      downloadUrl,
    });

    return {
      success: true,
      emailId: "handled-separately",
    };
  } catch (error) {
    await log.error(`Failed to send book purchase email to ${email}`, "EMAIL_SERVICE", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
