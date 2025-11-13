/**
 * Custom NextAuth.js Adapter for Turso (LibSQL)
 *
 * Implements the NextAuth Adapter interface to work with Turso's LibSQL database.
 * Handles user accounts, sessions, and verification tokens.
 */

import type {
  Adapter,
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "next-auth/adapters";
import { createClient, type Client } from "@libsql/client";

/**
 * Creates a NextAuth adapter for Turso database
 * @param client - Turso LibSQL client instance
 * @returns NextAuth Adapter implementation
 */
export function TursoAdapter(client: Client): Adapter {
  return {
    /**
     * Creates a new user in the database
     */
    async createUser(user) {
      const id = crypto.randomUUID();
      const now = Math.floor(Date.now() / 1000);

      // For magic link users without a name, derive from email
      const name = user.name ?? (user.email ? user.email.split('@')[0] : null);

      // Validate required fields
      if (!user.email) {
        throw new Error('[Turso Adapter] Cannot create user without email');
      }

      console.log('[Turso Adapter] createUser called:', { email: user.email, name });

      const args = [
        id,
        name,
        user.email,
        user.emailVerified ? Math.floor(user.emailVerified.getTime() / 1000) : null,
        user.image ?? null,
        now,
        now,
      ];

      console.log('[Turso Adapter] createUser args:', {
        id,
        name,
        email: user.email,
        args: args.map((arg, i) => `[${i}]: ${arg === null ? 'NULL' : typeof arg === 'object' ? JSON.stringify(arg) : arg}`),
      });

      const insertResult = await client.execute({
        sql: `INSERT INTO users (id, name, email, email_verified, image, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args,
      });

      console.log('[Turso Adapter] createUser INSERT result:', {
        rowsAffected: insertResult.rowsAffected,
        id,
        email: user.email
      });

      // Verify the insert worked
      const result = await client.execute({
        sql: `SELECT * FROM users WHERE id = ?`,
        args: [id],
      });

      if (!result.rows[0]) {
        throw new Error(`[Turso Adapter] User not found after insert: ${id}`);
      }

      const createdUser = mapRowToUser(result.rows[0]);

      // Validate created user data
      if (!createdUser.email) {
        console.error('[Turso Adapter] CRITICAL: Created user has NULL email!', {
          userId: id,
          insertedEmail: user.email,
          insertedName: name,
          retrievedUser: createdUser,
          rowData: result.rows[0],
        });

        // Delete the corrupt user immediately
        await client.execute({
          sql: `DELETE FROM users WHERE id = ?`,
          args: [id],
        });

        throw new Error(`[Turso Adapter] Created user validation failed: NULL email. User deleted. Original email: ${user.email}`);
      }

      console.log('[Turso Adapter] createUser success:', {
        id: createdUser.id,
        email: createdUser.email,
        name: createdUser.name
      });

      return createdUser;
    },

    /**
     * Retrieves a user by their ID
     */
    async getUser(id) {
      const result = await client.execute({
        sql: `SELECT * FROM users WHERE id = ?`,
        args: [id],
      });

      return result.rows[0] ? mapRowToUser(result.rows[0]) : null;
    },

    /**
     * Retrieves a user by their email address
     */
    async getUserByEmail(email) {
      console.log('[Turso Adapter] getUserByEmail called:', email);
      const result = await client.execute({
        sql: `SELECT * FROM users WHERE email = ?`,
        args: [email],
      });

      const found = result.rows[0] ? mapRowToUser(result.rows[0]) : null;

      if (found) {
        console.log('[Turso Adapter] getUserByEmail result:', {
          id: found.id,
          email: found.email || '(NULL)',
          name: found.name || '(NULL)',
        });

        // Validate data integrity
        if (!found.email) {
          console.error('[Turso Adapter] WARNING: Found user with NULL email!', found);
        }
      } else {
        console.log('[Turso Adapter] getUserByEmail result: Not found');
      }

      return found;
    },

    /**
     * Retrieves a user by their OAuth account
     */
    async getUserByAccount({ providerAccountId, provider }) {
      const result = await client.execute({
        sql: `SELECT u.* FROM users u
              JOIN accounts a ON u.id = a.user_id
              WHERE a.provider = ? AND a.provider_account_id = ?`,
        args: [provider, providerAccountId],
      });

      return result.rows[0] ? mapRowToUser(result.rows[0]) : null;
    },

    /**
     * Updates an existing user
     */
    async updateUser(user) {
      const now = Math.floor(Date.now() / 1000);

      console.log('[Turso Adapter] updateUser called:', {
        id: user.id,
        email: user.email || '(NULL)',
        name: user.name || '(NULL)',
        emailVerified: user.emailVerified,
      });

      // Fetch existing user to preserve fields not being updated
      const existingResult = await client.execute({
        sql: `SELECT * FROM users WHERE id = ?`,
        args: [user.id],
      });

      if (!existingResult.rows[0]) {
        throw new Error(`[Turso Adapter] Cannot update non-existent user: ${user.id}`);
      }

      const existing = existingResult.rows[0];

      // Preserve existing values if new values are null/undefined
      const email = user.email ?? existing.email;
      const name = user.name ?? existing.name;
      const image = user.image ?? existing.image;

      console.log('[Turso Adapter] updateUser preserving values:', {
        email: email || '(NULL)',
        name: name || '(NULL)',
        existingEmail: existing.email || '(NULL)',
        existingName: existing.name || '(NULL)',
      });

      await client.execute({
        sql: `UPDATE users
              SET name = ?, email = ?, email_verified = ?, image = ?, updated_at = ?
              WHERE id = ?`,
        args: [
          name,
          email,
          user.emailVerified ? Math.floor(user.emailVerified.getTime() / 1000) : null,
          image,
          now,
          user.id,
        ],
      });

      const result = await client.execute({
        sql: `SELECT * FROM users WHERE id = ?`,
        args: [user.id],
      });

      const updated = mapRowToUser(result.rows[0]);

      console.log('[Turso Adapter] updateUser result:', {
        id: updated.id,
        email: updated.email || '(NULL)',
        name: updated.name || '(NULL)',
      });

      return updated;
    },

    /**
     * Deletes a user from the database
     */
    async deleteUser(userId) {
      await client.execute({
        sql: `DELETE FROM users WHERE id = ?`,
        args: [userId],
      });
    },

    /**
     * Links an OAuth account to a user
     */
    async linkAccount(account) {
      const id = crypto.randomUUID();
      const now = Math.floor(Date.now() / 1000);

      await client.execute({
        sql: `INSERT INTO accounts (
                id, user_id, type, provider, provider_account_id,
                refresh_token, access_token, expires_at, token_type,
                scope, id_token, session_state, created_at, updated_at
              )
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          id,
          account.userId,
          account.type,
          account.provider,
          account.providerAccountId,
          account.refresh_token ?? null,
          account.access_token ?? null,
          account.expires_at ?? null,
          account.token_type ?? null,
          account.scope ?? null,
          account.id_token ?? null,
          account.session_state ? JSON.stringify(account.session_state) : null,
          now,
          now,
        ],
      });

      return account as AdapterAccount;
    },

    /**
     * Unlinks an OAuth account from a user
     */
    async unlinkAccount({ providerAccountId, provider }) {
      await client.execute({
        sql: `DELETE FROM accounts WHERE provider = ? AND provider_account_id = ?`,
        args: [provider, providerAccountId],
      });
    },

    /**
     * Creates a new session for a user
     */
    async createSession(session) {
      const id = crypto.randomUUID();

      await client.execute({
        sql: `INSERT INTO sessions (id, session_token, user_id, expires)
              VALUES (?, ?, ?, ?)`,
        args: [
          id,
          session.sessionToken,
          session.userId,
          Math.floor(session.expires.getTime() / 1000),
        ],
      });

      return session as AdapterSession;
    },

    /**
     * Retrieves a session and its associated user
     */
    async getSessionAndUser(sessionToken) {
      const result = await client.execute({
        sql: `SELECT
                s.id as session_id,
                s.session_token,
                s.user_id,
                s.expires as session_expires,
                u.id,
                u.name,
                u.email,
                u.email_verified,
                u.image
              FROM sessions s
              JOIN users u ON s.user_id = u.id
              WHERE s.session_token = ?`,
        args: [sessionToken],
      });

      if (!result.rows[0]) return null;

      const row = result.rows[0];

      return {
        session: {
          sessionToken: row.session_token as string,
          userId: row.user_id as string,
          expires: new Date((row.session_expires as number) * 1000),
        },
        user: mapRowToUser(row),
      };
    },

    /**
     * Updates an existing session (extends expiration)
     */
    async updateSession(session) {
      if (!session.expires) {
        return session as AdapterSession;
      }

      await client.execute({
        sql: `UPDATE sessions SET expires = ? WHERE session_token = ?`,
        args: [Math.floor(session.expires.getTime() / 1000), session.sessionToken],
      });

      return session as AdapterSession;
    },

    /**
     * Deletes a session
     */
    async deleteSession(sessionToken) {
      await client.execute({
        sql: `DELETE FROM sessions WHERE session_token = ?`,
        args: [sessionToken],
      });
    },

    /**
     * Creates a verification token (for email magic links)
     */
    async createVerificationToken(token) {
      await client.execute({
        sql: `INSERT INTO verification_tokens (identifier, token, expires)
              VALUES (?, ?, ?)`,
        args: [
          token.identifier,
          token.token,
          Math.floor(token.expires.getTime() / 1000),
        ],
      });

      return token as VerificationToken;
    },

    /**
     * Uses (and deletes) a verification token
     */
    async useVerificationToken({ identifier, token }) {
      console.log('[Turso Adapter] useVerificationToken called:', { identifier, token: token.substring(0, 8) + '...' });

      const result = await client.execute({
        sql: `SELECT * FROM verification_tokens
              WHERE identifier = ? AND token = ?`,
        args: [identifier, token],
      });

      if (!result.rows[0]) {
        console.log('[Turso Adapter] useVerificationToken: Token not found (already used or expired)');
        return null;
      }

      const row = result.rows[0];
      const expires = new Date((row.expires as number) * 1000);

      // Check if token is expired
      if (expires < new Date()) {
        console.log('[Turso Adapter] useVerificationToken: Token expired');
        await client.execute({
          sql: `DELETE FROM verification_tokens WHERE identifier = ? AND token = ?`,
          args: [identifier, token],
        });
        return null;
      }

      // Delete the token (one-time use)
      await client.execute({
        sql: `DELETE FROM verification_tokens
              WHERE identifier = ? AND token = ?`,
        args: [identifier, token],
      });

      console.log('[Turso Adapter] useVerificationToken: Token consumed successfully');

      return {
        identifier: row.identifier as string,
        token: row.token as string,
        expires,
      };
    },
  };
}

/**
 * Maps a database row to an AdapterUser object
 */
function mapRowToUser(row: Record<string, unknown>): AdapterUser {
  return {
    id: row.id as string,
    name: (row.name as string | null) ?? null,
    email: row.email as string,
    emailVerified:
      row.email_verified
        ? new Date((row.email_verified as number) * 1000)
        : null,
    image: (row.image as string | null) ?? null,
  };
}

/**
 * Creates and returns a configured Turso client
 * Uses environment variables for connection details
 */
export function getTursoClient() {
  if (!process.env.TURSO_DATABASE_URL) {
    throw new Error("TURSO_DATABASE_URL environment variable is not set");
  }

  if (!process.env.TURSO_AUTH_TOKEN) {
    throw new Error("TURSO_AUTH_TOKEN environment variable is not set");
  }

  return createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
}
