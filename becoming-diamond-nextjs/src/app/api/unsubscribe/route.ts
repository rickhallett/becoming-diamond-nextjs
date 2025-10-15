import { NextRequest, NextResponse } from 'next/server';
import { log } from '@/lib/logger';

// Dynamic route config for Next.js 15
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Lazy import turso to avoid build-time initialization
    const { turso } = await import('@/lib/turso');

    const url = new URL(request.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return new NextResponse(
        getHtmlResponse({
          title: 'Invalid Link',
          message: 'Missing unsubscribe token. Please use the link from your email.',
          type: 'error',
        }),
        { status: 400, headers: { 'Content-Type': 'text/html' } }
      );
    }

    // Find lead by token
    const result = await turso.execute({
      sql: 'SELECT id, email, subscribed FROM leads WHERE unsubscribe_token = ?',
      args: [token],
    });

    if (result.rows.length === 0) {
      await log.warn('Invalid unsubscribe token attempted', 'UNSUBSCRIBE', { token });

      return new NextResponse(
        getHtmlResponse({
          title: 'Invalid Link',
          message: 'This unsubscribe link is invalid or has expired.',
          type: 'error',
        }),
        { status: 404, headers: { 'Content-Type': 'text/html' } }
      );
    }

    const lead = result.rows[0];
    const leadEmail = String(lead.email);
    const leadId = String(lead.id);
    const currentlySubscribed = lead.subscribed === 1;

    if (!currentlySubscribed) {
      await log.info('Unsubscribe attempted for already unsubscribed email', 'UNSUBSCRIBE', {
        email: leadEmail,
      });

      return new NextResponse(
        getHtmlResponse({
          title: 'Already Unsubscribed',
          message: `You've already been unsubscribed.`,
          email: leadEmail,
          type: 'info',
        }),
        { status: 200, headers: { 'Content-Type': 'text/html' } }
      );
    }

    // Update subscription status
    await turso.execute({
      sql: 'UPDATE leads SET subscribed = 0, updated_at = ? WHERE id = ?',
      args: [new Date().toISOString(), leadId],
    });

    await log.info(`User unsubscribed successfully`, 'UNSUBSCRIBE', {
      email: leadEmail,
      leadId,
    });

    return new NextResponse(
      getHtmlResponse({
        title: 'Successfully Unsubscribed',
        message: "You've been removed from our mailing list.",
        email: leadEmail,
        type: 'success',
      }),
      { status: 200, headers: { 'Content-Type': 'text/html' } }
    );
  } catch (error) {
    await log.error('Unsubscribe error', 'UNSUBSCRIBE', error);

    return new NextResponse(
      getHtmlResponse({
        title: 'Error',
        message: 'An error occurred while processing your request. Please try again later.',
        type: 'error',
      }),
      { status: 500, headers: { 'Content-Type': 'text/html' } }
    );
  }
}

// Helper function to generate HTML response
function getHtmlResponse(params: {
  title: string;
  message: string;
  email?: string;
  type: 'success' | 'error' | 'info';
}): string {
  const { title, message, email, type } = params;

  const colors = {
    success: {
      bg: '#10b981',
      border: '#059669',
    },
    error: {
      bg: '#ef4444',
      border: '#dc2626',
    },
    info: {
      bg: '#3b82f6',
      border: '#2563eb',
    },
  };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3003';

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title} - Becoming Diamond</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: #000000;
            color: #ffffff;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            width: 100%;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 48px 32px;
            text-align: center;
          }
          .logo {
            color: #4fc3f7;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 32px;
          }
          .icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 24px;
            background: ${colors[type].bg};
            border: 3px solid ${colors[type].border};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
          }
          h1 {
            color: #ffffff;
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 16px;
          }
          p {
            color: #9ca3af;
            font-size: 18px;
            line-height: 1.6;
            margin-bottom: 12px;
          }
          .email {
            color: #4fc3f7;
            font-weight: 600;
            word-break: break-all;
          }
          .footer {
            margin-top: 48px;
            padding-top: 24px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          }
          .footer-links {
            display: flex;
            gap: 16px;
            justify-content: center;
            flex-wrap: wrap;
            margin-bottom: 16px;
          }
          a {
            color: #4fc3f7;
            text-decoration: none;
            font-size: 14px;
          }
          a:hover {
            text-decoration: underline;
          }
          .copyright {
            color: #6b7280;
            font-size: 12px;
          }
          @media (max-width: 640px) {
            .container {
              padding: 32px 24px;
            }
            h1 {
              font-size: 24px;
            }
            p {
              font-size: 16px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">Becoming Diamond</div>

          <div class="icon">
            ${
              type === 'success'
                ? '✓'
                : type === 'error'
                  ? '✕'
                  : 'ℹ'
            }
          </div>

          <h1>${title}</h1>
          <p>${message}</p>
          ${email ? `<p class="email">${email}</p>` : ''}

          <div class="footer">
            <div class="footer-links">
              <a href="${baseUrl}">Home</a>
              <a href="${baseUrl}/privacy">Privacy Policy</a>
              <a href="${baseUrl}/terms">Terms of Service</a>
            </div>
            <p class="copyright">© 2025 Becoming Diamond. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
