import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getTursoClient } from '@/lib/turso-adapter';

const turso = getTursoClient();

/**
 * GET /api/activities
 * Fetch recent activities for authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    // Fetch activities
    const result = await turso.execute({
      sql: `SELECT * FROM user_activities WHERE user_id = ? ORDER BY timestamp DESC LIMIT ?`,
      args: [userId, limit],
    });

    const activities = result.rows.map(row => ({
      id: row.id as string,
      userId: row.user_id as string,
      type: row.type as string,
      description: row.description as string,
      timestamp: row.timestamp as string,
      metadata: row.metadata ? JSON.parse(row.metadata as string) : {},
    }));

    return NextResponse.json({ activities });
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/activities
 * Log a new activity
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
    const { type, description, metadata } = await request.json();

    if (!type || !description) {
      return NextResponse.json(
        { error: 'type and description are required' },
        { status: 400 }
      );
    }

    const activityId = `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    await turso.execute({
      sql: `INSERT INTO user_activities (id, user_id, type, description, timestamp, metadata)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [
        activityId,
        userId,
        type,
        description,
        now,
        metadata ? JSON.stringify(metadata) : null,
      ],
    });

    return NextResponse.json({
      activity: {
        id: activityId,
        userId,
        type,
        description,
        timestamp: now,
        metadata: metadata || {},
      }
    });
  } catch (error) {
    console.error('Error logging activity:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
