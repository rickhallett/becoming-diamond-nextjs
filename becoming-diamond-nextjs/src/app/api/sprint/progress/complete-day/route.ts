import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getTursoClient } from '@/lib/turso-adapter';
import { log } from '@/lib/axiom-logger';

const turso = getTursoClient();

/**
 * POST /api/sprint/progress/complete-day
 * Mark a specific day as complete
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
    const { dayNumber } = await request.json();

    if (!dayNumber || dayNumber < 1 || dayNumber > 30) {
      return NextResponse.json(
        { error: 'Invalid day number. Must be between 1 and 30.' },
        { status: 400 }
      );
    }

    // Fetch existing progress
    const result = await turso.execute({
      sql: 'SELECT * FROM sprint_progress WHERE user_id = ?',
      args: [userId]
    });

    const now = new Date().toISOString();
    const unixNow = Math.floor(Date.now() / 1000);

    if (result.rows.length === 0) {
      // First time user - initialize progress
      if (dayNumber !== 1) {
        return NextResponse.json(
          { error: 'Must start with Day 1' },
          { status: 400 }
        );
      }

      const progressId = crypto.randomUUID();
      await turso.execute({
        sql: `INSERT INTO sprint_progress
              (id, user_id, sprint_id, enrollment_date, completed_days,
               current_day, total_days_completed, completion_percentage,
               status, last_access_date, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          progressId,
          userId,
          '30-day-sprint',
          now,
          JSON.stringify([1]),
          2,
          1,
          3.33,
          'in_progress',
          now,
          unixNow,
          unixNow
        ]
      });

      await log.info('Sprint progress initialized', {
        userId,
        dayNumber: 1
      });

      return NextResponse.json({
        success: true,
        progress: {
          sprintId: '30-day-sprint',
          enrollmentDate: now,
          completedDays: [1],
          currentDay: 2,
          totalDaysCompleted: 1,
          completionPercentage: 3.33,
          status: 'in_progress',
          lastAccessDate: now,
          createdAt: now,
          updatedAt: now
        },
        dayCompleted: 1,
        streak: 1
      });
    }

    const row = result.rows[0];
    const completedDays = JSON.parse(row.completed_days as string) as number[];
    const currentDay = row.current_day as number;

    // Verify day is accessible
    if (dayNumber > currentDay) {
      return NextResponse.json(
        { error: `Day ${dayNumber} is not yet accessible. Complete Day ${currentDay} first.` },
        { status: 400 }
      );
    }

    // Don't re-complete already completed days
    if (completedDays.includes(dayNumber)) {
      return NextResponse.json(
        { error: `Day ${dayNumber} is already completed.` },
        { status: 400 }
      );
    }

    // Add to completed days
    const updatedCompletedDays = [...completedDays, dayNumber].sort((a, b) => a - b);
    const totalDaysCompleted = updatedCompletedDays.length;
    const completionPercentage = (totalDaysCompleted / 30) * 100;
    const newCurrentDay = dayNumber === currentDay && dayNumber < 30 ? dayNumber + 1 : currentDay;
    const status = totalDaysCompleted === 30 ? 'completed' : 'in_progress';

    // Calculate streak
    let streak = 1;
    const sortedDays = [...updatedCompletedDays].sort((a, b) => a - b);
    for (let i = sortedDays.length - 1; i > 0; i--) {
      if (sortedDays[i] - sortedDays[i - 1] === 1) {
        streak++;
      } else {
        break;
      }
    }

    // Update progress
    await turso.execute({
      sql: `UPDATE sprint_progress
            SET completed_days = ?, current_day = ?, total_days_completed = ?,
                completion_percentage = ?, status = ?, last_access_date = ?, updated_at = ?
            WHERE user_id = ?`,
      args: [
        JSON.stringify(updatedCompletedDays),
        newCurrentDay,
        totalDaysCompleted,
        completionPercentage,
        status,
        now,
        unixNow,
        userId
      ]
    });

    await log.info('Day marked complete', {
      userId,
      dayNumber,
      totalDaysCompleted,
      completionPercentage,
      status
    });

    const progress = {
      sprintId: row.sprint_id as string,
      enrollmentDate: row.enrollment_date as string,
      completedDays: updatedCompletedDays,
      currentDay: newCurrentDay,
      totalDaysCompleted,
      completionPercentage,
      status,
      lastAccessDate: now,
      createdAt: new Date((row.created_at as number) * 1000).toISOString(),
      updatedAt: now
    };

    return NextResponse.json({
      success: true,
      progress,
      dayCompleted: dayNumber,
      streak
    });
  } catch (error) {
    await log.error('Error completing day', {
      error: error instanceof Error ? error.message : String(error)
    });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
