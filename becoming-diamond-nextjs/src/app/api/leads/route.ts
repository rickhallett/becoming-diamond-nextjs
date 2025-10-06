import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { log } from '@/lib/logger';

// Dynamic route config for Next.js 15
export const dynamic = 'force-dynamic';

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
    const { turso } = await import('@/lib/turso');

    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }

    // Parse request body
    const body = await request.json();
    const { email, consentGiven } = body;

    // Validate email
    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Validate consent
    if (!consentGiven) {
      return NextResponse.json(
        { success: false, error: 'Consent required to subscribe' },
        { status: 400 }
      );
    }

    // Check for duplicate within 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const duplicateCheck = await turso.execute({
      sql: 'SELECT id FROM leads WHERE email = ? AND created_at > ?',
      args: [email.toLowerCase(), twentyFourHoursAgo],
    });

    if (duplicateCheck.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'This email is already registered. Check your inbox!' },
        { status: 409 }
      );
    }

    // Extract UTM parameters from query string
    const url = new URL(request.url);
    const utmSource = url.searchParams.get('utm_source') || null;
    const utmMedium = url.searchParams.get('utm_medium') || null;
    const utmCampaign = url.searchParams.get('utm_campaign') || null;
    const utmTerm = url.searchParams.get('utm_term') || null;
    const utmContent = url.searchParams.get('utm_content') || null;

    // Get metadata
    const referrer = request.headers.get('referer') || null;
    const userAgent = request.headers.get('user-agent') || null;
    const landingPage = referrer || url.origin;

    // Generate ID and timestamps
    const id = `lead_${nanoid()}`;
    const now = new Date().toISOString();

    // Insert lead
    await turso.execute({
      sql: `INSERT INTO leads (
        id, email, created_at, updated_at,
        utm_source, utm_medium, utm_campaign, utm_term, utm_content,
        referrer, landing_page, user_agent, ip_address,
        consent_given, subscribed, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        email.toLowerCase(),
        now,
        now,
        utmSource,
        utmMedium,
        utmCampaign,
        utmTerm,
        utmContent,
        referrer,
        landingPage,
        userAgent,
        ip,
        1, // consent_given
        1, // subscribed
        'new', // status
      ],
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Thanks! Check your email for the Diamond Sprint materials.',
        leadId: id,
      },
      { status: 201 }
    );
  } catch (error) {
    await log.error('Lead capture error:', 'API', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Lazy import turso to avoid build-time initialization
    const { turso } = await import('@/lib/turso');

    // Check admin authentication
    const authHeader = request.headers.get('authorization');
    const adminKey = process.env.ADMIN_API_KEY;

    if (!authHeader || authHeader !== `Bearer ${adminKey}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const url = new URL(request.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const source = url.searchParams.get('source');
    const status = url.searchParams.get('status');
    const format = url.searchParams.get('format') || 'json';
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const pageSize = parseInt(url.searchParams.get('pageSize') || '100', 10);

    // Build query
    let sql = 'SELECT * FROM leads WHERE 1=1';
    const args: (string | number)[] = [];

    if (startDate) {
      sql += ' AND created_at >= ?';
      args.push(startDate);
    }

    if (endDate) {
      sql += ' AND created_at <= ?';
      args.push(endDate);
    }

    if (source) {
      sql += ' AND utm_source = ?';
      args.push(source);
    }

    if (status) {
      sql += ' AND status = ?';
      args.push(status);
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    args.push(pageSize, (page - 1) * pageSize);

    // Execute query
    const result = await turso.execute({ sql, args });

    // Get total count
    let countSql = 'SELECT COUNT(*) as total FROM leads WHERE 1=1';
    const countArgs: string[] = [];

    if (startDate) {
      countSql += ' AND created_at >= ?';
      countArgs.push(startDate);
    }

    if (endDate) {
      countSql += ' AND created_at <= ?';
      countArgs.push(endDate);
    }

    if (source) {
      countSql += ' AND utm_source = ?';
      countArgs.push(source);
    }

    if (status) {
      countSql += ' AND status = ?';
      countArgs.push(status);
    }

    const countResult = await turso.execute({ sql: countSql, args: countArgs });
    const total = Number(countResult.rows[0]?.total || 0);

    // Format response
    if (format === 'csv') {
      // Generate CSV
      const headers = [
        'email',
        'created_at',
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'status',
        'referrer',
        'landing_page',
      ];
      const csvRows = [headers.join(',')];

      for (const row of result.rows) {
        const values = headers.map((header) => {
          const value = row[header];
          // Escape commas and quotes
          if (value === null || value === undefined) return '';
          const stringValue = String(value);
          if (stringValue.includes(',') || stringValue.includes('"')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        });
        csvRows.push(values.join(','));
      }

      const csv = csvRows.join('\n');

      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="leads-${new Date().toISOString().split('T')[0]}.csv"`,
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
    await log.error('Lead export error:', 'API', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred' },
      { status: 500 }
    );
  }
}
