import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getTursoClient } from '@/lib/turso-adapter';

const turso = getTursoClient();

/**
 * GET /api/courses
 * Fetch all course enrollments for authenticated user
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

    // Fetch all enrollments
    const enrollmentsResult = await turso.execute({
      sql: `SELECT * FROM course_enrollments WHERE user_id = ? ORDER BY last_accessed_date DESC`,
      args: [userId],
    });

    // Fetch lesson progress for each enrollment
    const enrollments = await Promise.all(
      enrollmentsResult.rows.map(async (row) => {
        const lessonsResult = await turso.execute({
          sql: `SELECT lesson_id FROM lesson_progress WHERE enrollment_id = ?`,
          args: [row.id],
        });

        return {
          courseId: row.course_id as string,
          enrolledDate: row.enrolled_date as string,
          completedDate: row.completed_date as string | undefined,
          progress: row.progress as number,
          lastAccessedDate: row.last_accessed_date as string,
          lessonsCompleted: lessonsResult.rows.map(l => l.lesson_id as string),
          currentLesson: row.current_lesson as string | undefined,
          timeSpent: row.time_spent as number,
        };
      })
    );

    return NextResponse.json({ enrollments });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/courses
 * Enroll in a course
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
    const { courseId } = await request.json();

    if (!courseId) {
      return NextResponse.json(
        { error: 'courseId is required' },
        { status: 400 }
      );
    }

    const enrollmentId = `enroll_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    await turso.execute({
      sql: `INSERT INTO course_enrollments (id, user_id, course_id, enrolled_date, progress, last_accessed_date, time_spent)
            VALUES (?, ?, ?, ?, 0, ?, 0)`,
      args: [enrollmentId, userId, courseId, now, now],
    });

    return NextResponse.json({
      enrollment: {
        courseId,
        enrolledDate: now,
        progress: 0,
        lastAccessedDate: now,
        lessonsCompleted: [],
        timeSpent: 0,
      }
    });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/courses
 * Update course progress
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { courseId, updates } = await request.json();

    if (!courseId) {
      return NextResponse.json(
        { error: 'courseId is required' },
        { status: 400 }
      );
    }

    // Get enrollment ID
    const enrollmentResult = await turso.execute({
      sql: `SELECT id FROM course_enrollments WHERE user_id = ? AND course_id = ?`,
      args: [userId, courseId],
    });

    if (!enrollmentResult.rows[0]) {
      return NextResponse.json(
        { error: 'Enrollment not found' },
        { status: 404 }
      );
    }

    const enrollmentId = enrollmentResult.rows[0].id as string;
    const now = new Date().toISOString();
    const unixNow = Math.floor(Date.now() / 1000);

    // Build update query
    const updateFields: string[] = ['last_accessed_date = ?', 'updated_at = ?'];
    const updateValues: any[] = [now, unixNow];

    if (updates.progress !== undefined) {
      updateFields.push('progress = ?');
      updateValues.push(updates.progress);
    }
    if (updates.completedDate !== undefined) {
      updateFields.push('completed_date = ?');
      updateValues.push(updates.completedDate);
    }
    if (updates.currentLesson !== undefined) {
      updateFields.push('current_lesson = ?');
      updateValues.push(updates.currentLesson);
    }
    if (updates.timeSpent !== undefined) {
      updateFields.push('time_spent = ?');
      updateValues.push(updates.timeSpent);
    }

    updateValues.push(enrollmentId);

    await turso.execute({
      sql: `UPDATE course_enrollments SET ${updateFields.join(', ')} WHERE id = ?`,
      args: updateValues,
    });

    // Handle lesson completions
    if (updates.lessonsCompleted && Array.isArray(updates.lessonsCompleted)) {
      // Add new completed lessons
      for (const lessonId of updates.lessonsCompleted) {
        const lessonProgressId = `lesson_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        try {
          await turso.execute({
            sql: `INSERT OR IGNORE INTO lesson_progress (id, enrollment_id, lesson_id, completed_date)
                  VALUES (?, ?, ?, ?)`,
            args: [lessonProgressId, enrollmentId, lessonId, now],
          });
        } catch (err) {
          // Ignore duplicates
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
