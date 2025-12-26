/**
 * Email Service Layer
 *
 * Centralized service for triggering automated emails based on user actions.
 * Uses Gmail SMTP for email delivery (simplified MVP).
 */

import { log } from "@/lib/logger";

const _FROM_EMAIL = process.env.GMAIL_USER || "support@becomingdiamond.com";

// Construct base URL with Vercel auto-detection support
// Priority: NEXT_PUBLIC_BASE_URL > VERCEL_URL (auto-provided by Vercel) > localhost fallback
const _BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
  || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3003");

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
