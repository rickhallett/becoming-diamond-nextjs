import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getTursoClient } from '@/lib/turso-adapter';

const turso = getTursoClient();

/**
 * GET /api/chat
 * Fetch all chat sessions for authenticated user
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

    // Fetch sessions with message counts
    const sessionsResult = await turso.execute({
      sql: `SELECT * FROM chat_sessions WHERE user_id = ? ORDER BY updated_at DESC LIMIT 10`,
      args: [userId],
    });

    // Fetch messages for each session
    const sessions = await Promise.all(
      sessionsResult.rows.map(async (row) => {
        const messagesResult = await turso.execute({
          sql: `SELECT * FROM chat_messages WHERE session_id = ? ORDER BY timestamp ASC`,
          args: [row.id],
        });

        return {
          id: row.id as string,
          title: row.title as string,
          createdAt: row.created_at as string,
          updatedAt: row.updated_at as string,
          messages: messagesResult.rows.map(m => ({
            id: m.id as string,
            role: m.role as 'user' | 'assistant',
            content: m.content as string,
            timestamp: m.timestamp as string,
          })),
        };
      })
    );

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error('Error fetching chat sessions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/chat
 * Create a new chat session
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
    const { title } = await request.json();

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    await turso.execute({
      sql: `INSERT INTO chat_sessions (id, user_id, title, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?)`,
      args: [sessionId, userId, title || 'New Conversation', now, now],
    });

    return NextResponse.json({
      session: {
        id: sessionId,
        title: title || 'New Conversation',
        createdAt: now,
        updatedAt: now,
        messages: [],
      }
    });
  } catch (error) {
    console.error('Error creating chat session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/chat
 * Add a message to a session or update session title
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
    const { sessionId, message, title } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId is required' },
        { status: 400 }
      );
    }

    // Verify session belongs to user
    const sessionResult = await turso.execute({
      sql: `SELECT id FROM chat_sessions WHERE id = ? AND user_id = ?`,
      args: [sessionId, userId],
    });

    if (!sessionResult.rows[0]) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    const now = new Date().toISOString();

    // Update session title if provided
    if (title !== undefined) {
      await turso.execute({
        sql: `UPDATE chat_sessions SET title = ?, updated_at = ? WHERE id = ?`,
        args: [title, now, sessionId],
      });
    }

    // Add message if provided
    if (message) {
      const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      await turso.execute({
        sql: `INSERT INTO chat_messages (id, session_id, role, content, timestamp)
              VALUES (?, ?, ?, ?, ?)`,
        args: [messageId, sessionId, message.role, message.content, now],
      });

      // Update session updated_at
      await turso.execute({
        sql: `UPDATE chat_sessions SET updated_at = ? WHERE id = ?`,
        args: [now, sessionId],
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating chat:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/chat
 * Delete a chat session
 */
export async function DELETE(request: NextRequest) {
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
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId is required' },
        { status: 400 }
      );
    }

    // Delete session (cascade will delete messages)
    await turso.execute({
      sql: `DELETE FROM chat_sessions WHERE id = ? AND user_id = ?`,
      args: [sessionId, userId],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting chat session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
