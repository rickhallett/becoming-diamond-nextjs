/**
 * Development-only endpoint to create mock NextAuth sessions
 * ONLY works in NODE_ENV=development
 */

import { NextRequest, NextResponse } from "next/server";
import { getTursoClient } from "@/lib/turso-adapter";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  // SECURITY: Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Not available in production" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { userId, name, email } = body;

    const turso = getTursoClient();
    const now = Math.floor(Date.now() / 1000);
    const sessionToken = `test-session-${Date.now()}`;
    const expires = now + 30 * 24 * 60 * 60; // 30 days

    // Delete existing test user if it exists
    await turso.execute({
      sql: `DELETE FROM users WHERE email = ?`,
      args: [email],
    });

    // Create or update user in database
    const userResult = await turso.execute({
      sql: `INSERT INTO users (id, name, email, email_verified, image)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
              name = excluded.name,
              email = excluded.email`,
      args: [userId, name, email, now, null],
    });

    // Create session
    const sessionId = crypto.randomUUID();
    await turso.execute({
      sql: `INSERT INTO sessions (id, session_token, user_id, expires)
            VALUES (?, ?, ?, ?)`,
      args: [sessionId, sessionToken, userId, expires],
    });

    // Create account record (for NextAuth compatibility)
    const accountId = crypto.randomUUID();
    await turso.execute({
      sql: `INSERT INTO accounts (id, user_id, type, provider, provider_account_id)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(provider, provider_account_id) DO NOTHING`,
      args: [accountId, userId, "credentials", "test", userId],
    });

    // Create user profile
    const profileId = crypto.randomUUID();
    await turso.execute({
      sql: `INSERT INTO user_profiles (id, user_id, created_at, updated_at)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(user_id) DO NOTHING`,
      args: [profileId, userId, now, now],
    });

    // Set session cookie (NextAuth uses different names in dev vs prod)
    const response = NextResponse.json({ success: true });

    // Use the same cookie name NextAuth uses (always dev since we're in dev-only endpoint)
    const cookieName = "authjs.session-token";

    response.cookies.set(cookieName, sessionToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    console.log(`[Test Session] Created session with cookie: ${cookieName}`);
    return response;
  } catch (error) {
    console.error("[Test Session] Error:", error);
    return NextResponse.json(
      { error: "Failed to create test session" },
      { status: 500 }
    );
  }
}
