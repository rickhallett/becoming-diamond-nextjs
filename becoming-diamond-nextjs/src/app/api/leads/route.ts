import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { log } from "@/lib/logger";
import { sendWelcomeEmail, sendAdminNotification } from "@/lib/resend";

// Dynamic route config for Next.js 15
export const dynamic = "force-dynamic";

// Rate limiting map (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);

  if (!limit || now > limit.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60000 }); // 1 minute
    return true;
  }

  if (limit.count >= 5) {
    return false;
  }

  limit.count++;
  return true;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function POST(request: NextRequest) {
  try {
    // Lazy import turso to avoid build-time initialization
    const { turso } = await import("@/lib/turso");

    // Rate limiting
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    // Parse request body
    const body = await request.json();
    const { email, consentGiven } = body;

    // Validate email
    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Validate consent
    if (!consentGiven) {
      return NextResponse.json(
        { success: false, error: "Consent required to subscribe" },
        { status: 400 }
      );
    }

    // Check for duplicate within 24 hours
    // TODO: why is this 24 hours?
    const twentyFourHoursAgo = new Date(
      Date.now() - 24 * 60 * 60 * 1000
    ).toISOString();
    const duplicateCheck = await turso.execute({
      sql: "SELECT id FROM leads WHERE email = ? AND created_at > ?",
      args: [email.toLowerCase(), twentyFourHoursAgo],
    });

    if (duplicateCheck.rows.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "This email is already registered. Check your inbox!",
        },
        { status: 409 }
      );
    }

    // Get metadata
    const url = new URL(request.url);
    const referrer = request.headers.get("referer") || null;
    const userAgent = request.headers.get("user-agent") || null;
    const landingPage = referrer || url.origin;

    // Generate ID, tokens, and timestamps
    const id = `lead_${nanoid()}`;
    const unsubscribeToken = nanoid(32);
    const now = new Date().toISOString();

    // Insert lead
    await turso.execute({
      sql: `INSERT INTO leads (
        id, email, created_at, updated_at,
        referrer, landing_page, user_agent, ip_address,
        consent_given, subscribed, status, unsubscribe_token
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        email.toLowerCase(),
        now,
        now,
        referrer,
        landingPage,
        userAgent,
        ip,
        1, // consent_given
        1, // subscribed
        "new", // status
        unsubscribeToken,
      ],
    });

    // Send welcome email (non-blocking - don't fail if email fails)
    try {
      const emailResult = await sendWelcomeEmail({
        to: email.toLowerCase(),
        unsubscribeToken,
      });

      if (emailResult.success) {
        // Update lead with email delivery status
        await turso.execute({
          sql: `UPDATE leads SET email_sent_at = ?, email_status = ?, email_id = ? WHERE id = ?`,
          args: [
            new Date().toISOString(),
            "sent",
            emailResult.emailId || null,
            id,
          ],
        });

        await log.info(`Welcome email sent successfully to ${email}`, "EMAIL", {
          emailId: emailResult.emailId,
          leadId: id,
        });
      } else {
        // Mark email as failed for retry
        await turso.execute({
          sql: `UPDATE leads SET email_status = ? WHERE id = ?`,
          args: ["failed", id],
        });

        await log.error(`Failed to send welcome email to ${email}`, "EMAIL", {
          error: emailResult.error,
          leadId: id,
        });
      }

      // Send admin notification (optional, non-blocking)
      await sendAdminNotification({
        email: email.toLowerCase(),
        referrer,
        landingPage,
      });
    } catch (emailError) {
      // Log email error but don't fail the API call
      await log.error(`Email sending error for ${email}`, "EMAIL", emailError);

      // Mark email as failed
      await turso.execute({
        sql: `UPDATE leads SET email_status = ? WHERE id = ?`,
        args: ["failed", id],
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thanks! Check your email for the Diamond Sprint materials.",
        leadId: id,
      },
      { status: 201 }
    );
  } catch (error) {
    await log.error("Lead capture error:", "API", error);
    return NextResponse.json(
      {
        success: false,
        error: `An error occurred. Please try again. ${JSON.stringify(error)}`,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Lazy import turso to avoid build-time initialization
    const { turso } = await import("@/lib/turso");

    // Check admin authentication
    const authHeader = request.headers.get("authorization");
    const adminKey = process.env.ADMIN_API_KEY;

    if (!authHeader || authHeader !== `Bearer ${adminKey}`) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse query parameters
    const url = new URL(request.url);
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");
    const status = url.searchParams.get("status");
    const format = url.searchParams.get("format") || "json";
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "100", 10);

    // Build query
    let sql = "SELECT * FROM leads WHERE 1=1";
    const args: (string | number)[] = [];

    if (startDate) {
      sql += " AND created_at >= ?";
      args.push(startDate);
    }

    if (endDate) {
      sql += " AND created_at <= ?";
      args.push(endDate);
    }

    if (status) {
      sql += " AND status = ?";
      args.push(status);
    }

    sql += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    args.push(pageSize, (page - 1) * pageSize);

    // Execute query
    const result = await turso.execute({ sql, args });

    // Get total count
    let countSql = "SELECT COUNT(*) as total FROM leads WHERE 1=1";
    const countArgs: string[] = [];

    if (startDate) {
      countSql += " AND created_at >= ?";
      countArgs.push(startDate);
    }

    if (endDate) {
      countSql += " AND created_at <= ?";
      countArgs.push(endDate);
    }

    if (status) {
      countSql += " AND status = ?";
      countArgs.push(status);
    }

    const countResult = await turso.execute({ sql: countSql, args: countArgs });
    const total = Number(countResult.rows[0]?.total || 0);

    // Format response
    if (format === "csv") {
      // Generate CSV
      const headers = [
        "email",
        "created_at",
        "status",
        "referrer",
        "landing_page",
      ];
      const csvRows = [headers.join(",")];

      for (const row of result.rows) {
        const values = headers.map((header) => {
          const value = row[header];
          // Escape commas and quotes
          if (value === null || value === undefined) return "";
          const stringValue = String(value);
          if (stringValue.includes(",") || stringValue.includes('"')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        });
        csvRows.push(values.join(","));
      }

      const csv = csvRows.join("\n");

      return new NextResponse(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="leads-${new Date().toISOString().split("T")[0]}.csv"`,
        },
      });
    }

    // JSON response
    return NextResponse.json({
      leads: result.rows,
      total,
      page,
      pageSize,
    });
  } catch (error) {
    await log.error("Lead export error:", "API", error);
    return NextResponse.json(
      { success: false, error: "An error occurred" },
      { status: 500 }
    );
  }
}
