import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getTursoClient } from '@/lib/turso-adapter';
import { log } from '@/lib/axiom-logger';

const turso = getTursoClient();

export interface SprintProgress {
  sprintId: string;
  enrollmentDate: string;
  completedDays: number[];
  currentDay: number;
  totalDaysCompleted: number;
  completionPercentage: number;
  status: 'not_started' | 'in_progress' | 'completed';
  lastAccessDate: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * GET /api/sprint/progress
 * Fetch current user's sprint progress
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

    const result = await turso.execute({
      sql: 'SELECT * FROM sprint_progress WHERE user_id = ?',
      args: [userId]
    });

    if (result.rows.length === 0) {
      await log.info('No sprint progress found for user', { userId });
      return NextResponse.json({ success: true, progress: null });
    }

    const row = result.rows[0];
    const progress: SprintProgress = {
      sprintId: row.sprint_id as string,
      enrollmentDate: row.enrollment_date as string,
      completedDays: JSON.parse(row.completed_days as string),
      currentDay: row.current_day as number,
      totalDaysCompleted: row.total_days_completed as number,
      completionPercentage: row.completion_percentage as number,
      status: row.status as 'not_started' | 'in_progress' | 'completed',
      lastAccessDate: row.last_access_date as string,
      createdAt: new Date((row.created_at as number) * 1000).toISOString(),
      updatedAt: new Date((row.updated_at as number) * 1000).toISOString(),
    };

    await log.info('Sprint progress fetched', {
      userId,
      currentDay: progress.currentDay,
      completionPercentage: progress.completionPercentage
    });

    return NextResponse.json({ success: true, progress });
  } catch (error) {
    await log.error('Error fetching sprint progress', {
      error: error instanceof Error ? error.message : String(error)
    });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
