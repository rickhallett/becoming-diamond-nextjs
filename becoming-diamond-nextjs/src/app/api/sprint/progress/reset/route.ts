import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getTursoClient } from '@/lib/turso-adapter';
import { log } from '@/lib/axiom-logger';

const turso = getTursoClient();

/**
 * POST /api/sprint/progress/reset
 * Reset user's sprint progress
 */
export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    await turso.execute({
      sql: 'DELETE FROM sprint_progress WHERE user_id = ?',
      args: [userId]
    });

    await log.info('Sprint progress reset', { userId });

    return NextResponse.json({
      success: true,
      message: 'Sprint progress reset successfully'
    });
  } catch (error) {
    await log.error('Error resetting sprint progress', {
      error: error instanceof Error ? error.message : String(error)
    });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
