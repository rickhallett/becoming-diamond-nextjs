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

      await client.execute({
        sql: `INSERT INTO users (id, name, email, email_verified, image, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: [
          id,
          user.name ?? null,
          user.email,
          user.emailVerified ? Math.floor(user.emailVerified.getTime() / 1000) : null,
          user.image ?? null,
          now,
          now,
        ],
      });

      const result = await client.execute({
        sql: `SELECT * FROM users WHERE id = ?`,
        args: [id],
      });

      return mapRowToUser(result.rows[0]);
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
      const result = await client.execute({
        sql: `SELECT * FROM users WHERE email = ?`,
        args: [email],
      });

      return result.rows[0] ? mapRowToUser(result.rows[0]) : null;
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

      await client.execute({
        sql: `UPDATE users
              SET name = ?, email = ?, email_verified = ?, image = ?, updated_at = ?
              WHERE id = ?`,
        args: [
          user.name ?? null,
          user.email ?? null,
          user.emailVerified ? Math.floor(user.emailVerified.getTime() / 1000) : null,
          user.image ?? null,
          now,
          user.id,
        ],
      });

      const result = await client.execute({
        sql: `SELECT * FROM users WHERE id = ?`,
        args: [user.id],
      });

      return mapRowToUser(result.rows[0]);
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
      const result = await client.execute({
        sql: `SELECT * FROM verification_tokens
              WHERE identifier = ? AND token = ?`,
        args: [identifier, token],
      });

      if (!result.rows[0]) return null;

      // Delete the token (one-time use)
      await client.execute({
        sql: `DELETE FROM verification_tokens
              WHERE identifier = ? AND token = ?`,
        args: [identifier, token],
      });

      const row = result.rows[0];

      return {
        identifier: row.identifier as string,
        token: row.token as string,
        expires: new Date((row.expires as number) * 1000),
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
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  if (!process.env.DATABASE_AUTH_TOKEN) {
    throw new Error("DATABASE_AUTH_TOKEN environment variable is not set");
  }

  return createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });
}
