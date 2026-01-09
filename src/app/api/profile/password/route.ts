import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getTursoClient } from '@/lib/turso-adapter';
import { log } from '@/lib/axiom-logger';
import { hashPassword, validatePassword } from '@/lib/password';

const turso = getTursoClient();

/**
 * GET /api/profile/password
 * Check if authenticated user has a password set
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Check if user has a password set
    const result = await turso.execute({
      sql: `SELECT password_hash FROM users WHERE id = ?`,
      args: [userId],
    });

    if (!result.rows[0]) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const hasPassword = !!result.rows[0].password_hash;

    // Non-blocking log - don't let logging failures crash the request
    try {
      log.info('Password status checked', {
        userId,
        hasPassword,
        timestamp: new Date().toISOString(),
      });
    } catch {
      // Ignore logging errors
    }

    return NextResponse.json({ hasPassword });
  } catch (error) {
    // Non-blocking log
    try {
      log.error('Error checking password status', {
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      });
    } catch {
      // Ignore logging errors
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/profile/password
 * Set or update password for authenticated user
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { password, confirmPassword } = await request.json();

    // Validate passwords match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    // Validate password requirements
    const validation = validatePassword(password);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Hash the password
    const passwordHash = await hashPassword(password);
    const now = Math.floor(Date.now() / 1000);

    // Update user with password hash
    const result = await turso.execute({
      sql: `UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?`,
      args: [passwordHash, now, userId],
    });

    if (result.rowsAffected === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Non-blocking log
    try {
      log.info('Password set successfully', {
        userId,
        timestamp: new Date().toISOString(),
      });
    } catch {
      // Ignore logging errors
    }

    return NextResponse.json({
      success: true,
      message: 'Password set successfully',
    });
  } catch (error) {
    // Non-blocking log
    try {
      log.error('Error setting password', {
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      });
    } catch {
      // Ignore logging errors
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
