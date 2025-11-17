/**
 * Custom NextAuth.js Adapter for Turso (LibSQL)
 *
 * Implements the NextAuth Adapter interface to work with Turso's LibSQL database.
 * Handles user accounts, sessions, and verification tokens.
 *
 * Enhanced with comprehensive Axiom logging for authentication flow monitoring.
 */

import type {
  Adapter,
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "next-auth/adapters";
import { createClient, type Client } from "@libsql/client";
import { log } from "@/lib/axiom-logger";

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
      const startTime = Date.now();
      const id = crypto.randomUUID();
      const now = Math.floor(Date.now() / 1000);

      // For magic link users without a name, derive from email
      const name = user.name ?? (user.email ? user.email.split('@')[0] : null);

      // Validate required fields
      if (!user.email) {
        await log.error('Adapter: createUser validation failed', {
          component: 'TursoAdapter',
          method: 'createUser',
          error: 'Email is required',
          timestamp: new Date().toISOString(),
        });
        throw new Error('[Turso Adapter] Cannot create user without email');
      }

      await log.info('Adapter: createUser started', {
        component: 'TursoAdapter',
        method: 'createUser',
        emailDomain: user.email.split('@')[1] || 'unknown',
        hasName: !!user.name,
        hasImage: !!user.image,
        emailVerified: !!user.emailVerified,
        timestamp: new Date().toISOString(),
      });

      try {
        const args = [
          id,
          name,
          user.email,
          user.emailVerified ? Math.floor(user.emailVerified.getTime() / 1000) : null,
          user.image ?? '/profile-placeholder-2.webp',
          now,
          now,
        ];

        const insertResult = await client.execute({
          sql: `INSERT INTO users (id, name, email, email_verified, image, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
          args,
        });

        // Verify the insert worked
        const result = await client.execute({
          sql: `SELECT * FROM users WHERE id = ?`,
          args: [id],
        });

        if (!result.rows[0]) {
          await log.error('Adapter: createUser verification failed', {
            component: 'TursoAdapter',
            method: 'createUser',
            error: 'User not found after insert',
            userId: id,
            rowsAffected: insertResult.rowsAffected,
            timestamp: new Date().toISOString(),
          });
          throw new Error(`[Turso Adapter] User not found after insert: ${id}`);
        }

        const createdUser = mapRowToUser(result.rows[0]);

        // Validate created user data
        if (!createdUser.email) {
          await log.error('Adapter: createUser data corruption detected', {
            component: 'TursoAdapter',
            method: 'createUser',
            error: 'Created user has NULL email',
            userId: id,
            insertedEmailDomain: user.email.split('@')[1],
            timestamp: new Date().toISOString(),
          });

          // Delete the corrupt user immediately
          await client.execute({
            sql: `DELETE FROM users WHERE id = ?`,
            args: [id],
          });

          throw new Error(`[Turso Adapter] Created user validation failed: NULL email. User deleted.`);
        }

        const duration = Date.now() - startTime;
        await log.info('Adapter: createUser success', {
          component: 'TursoAdapter',
          method: 'createUser',
          userId: createdUser.id,
          emailDomain: createdUser.email.split('@')[1],
          hasName: !!createdUser.name,
          durationMs: duration,
          timestamp: new Date().toISOString(),
        });

        return createdUser;
      } catch (error) {
        const duration = Date.now() - startTime;
        await log.error('Adapter: createUser failed', {
          component: 'TursoAdapter',
          method: 'createUser',
          emailDomain: user.email.split('@')[1],
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          durationMs: duration,
          timestamp: new Date().toISOString(),
        });
        throw error;
      }
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
      const startTime = Date.now();

      await log.debug('Adapter: getUserByEmail started', {
        component: 'TursoAdapter',
        method: 'getUserByEmail',
        emailDomain: email ? email.split('@')[1] : 'unknown',
        timestamp: new Date().toISOString(),
      });

      try {
        const result = await client.execute({
          sql: `SELECT * FROM users WHERE email = ?`,
          args: [email],
        });

        const found = result.rows[0] ? mapRowToUser(result.rows[0]) : null;
        const duration = Date.now() - startTime;

        if (found) {
          // Validate data integrity
          if (!found.email) {
            await log.error('Adapter: getUserByEmail data corruption', {
              component: 'TursoAdapter',
              method: 'getUserByEmail',
              error: 'Found user has NULL email',
              userId: found.id,
              durationMs: duration,
              timestamp: new Date().toISOString(),
            });
          }

          await log.debug('Adapter: getUserByEmail success', {
            component: 'TursoAdapter',
            method: 'getUserByEmail',
            userId: found.id,
            emailDomain: email.split('@')[1],
            hasName: !!found.name,
            durationMs: duration,
            timestamp: new Date().toISOString(),
          });
        } else {
          await log.debug('Adapter: getUserByEmail not found', {
            component: 'TursoAdapter',
            method: 'getUserByEmail',
            emailDomain: email.split('@')[1],
            durationMs: duration,
            timestamp: new Date().toISOString(),
          });
        }

        return found;
      } catch (error) {
        const duration = Date.now() - startTime;
        await log.error('Adapter: getUserByEmail failed', {
          component: 'TursoAdapter',
          method: 'getUserByEmail',
          emailDomain: email ? email.split('@')[1] : 'unknown',
          error: error instanceof Error ? error.message : String(error),
          durationMs: duration,
          timestamp: new Date().toISOString(),
        });
        throw error;
      }
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
      const startTime = Date.now();
      const now = Math.floor(Date.now() / 1000);

      await log.info('Adapter: updateUser started', {
        component: 'TursoAdapter',
        method: 'updateUser',
        userId: user.id,
        hasEmail: !!user.email,
        hasName: !!user.name,
        emailVerified: !!user.emailVerified,
        timestamp: new Date().toISOString(),
      });

      try {
        // Fetch existing user to preserve fields not being updated
        const existingResult = await client.execute({
          sql: `SELECT * FROM users WHERE id = ?`,
          args: [user.id],
        });

        if (!existingResult.rows[0]) {
          await log.error('Adapter: updateUser user not found', {
            component: 'TursoAdapter',
            method: 'updateUser',
            userId: user.id,
            error: 'Cannot update non-existent user',
            timestamp: new Date().toISOString(),
          });
          throw new Error(`[Turso Adapter] Cannot update non-existent user: ${user.id}`);
        }

        const existing = existingResult.rows[0];

        // Preserve existing values if new values are null/undefined
        const email = user.email ?? existing.email;
        const name = user.name ?? existing.name;
        const image = user.image ?? existing.image ?? '/profile-placeholder-2.webp';

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
        const duration = Date.now() - startTime;

        await log.info('Adapter: updateUser success', {
          component: 'TursoAdapter',
          method: 'updateUser',
          userId: updated.id,
          emailDomain: updated.email ? updated.email.split('@')[1] : 'unknown',
          hasName: !!updated.name,
          durationMs: duration,
          timestamp: new Date().toISOString(),
        });

        return updated;
      } catch (error) {
        const duration = Date.now() - startTime;
        await log.error('Adapter: updateUser failed', {
          component: 'TursoAdapter',
          method: 'updateUser',
          userId: user.id,
          error: error instanceof Error ? error.message : String(error),
          durationMs: duration,
          timestamp: new Date().toISOString(),
        });
        throw error;
      }
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
      const startTime = Date.now();
      const id = crypto.randomUUID();

      await log.info('Adapter: createSession started', {
        component: 'TursoAdapter',
        method: 'createSession',
        userId: session.userId,
        expiresAt: session.expires.toISOString(),
        timestamp: new Date().toISOString(),
      });

      try {
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

        const duration = Date.now() - startTime;
        await log.info('Adapter: createSession success', {
          component: 'TursoAdapter',
          method: 'createSession',
          userId: session.userId,
          sessionId: id,
          durationMs: duration,
          timestamp: new Date().toISOString(),
        });

        return session as AdapterSession;
      } catch (error) {
        const duration = Date.now() - startTime;
        await log.error('Adapter: createSession failed', {
          component: 'TursoAdapter',
          method: 'createSession',
          userId: session.userId,
          error: error instanceof Error ? error.message : String(error),
          durationMs: duration,
          timestamp: new Date().toISOString(),
        });
        throw error;
      }
    },

    /**
     * Retrieves a session and its associated user
     */
    async getSessionAndUser(sessionToken) {
      const startTime = Date.now();

      await log.debug('Adapter: getSessionAndUser started', {
        component: 'TursoAdapter',
        method: 'getSessionAndUser',
        timestamp: new Date().toISOString(),
      });

      try {
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

        const duration = Date.now() - startTime;

        if (!result.rows[0]) {
          await log.warn('Adapter: getSessionAndUser not found or expired', {
            component: 'TursoAdapter',
            method: 'getSessionAndUser',
            durationMs: duration,
            timestamp: new Date().toISOString(),
          });
          return null;
        }

        const row = result.rows[0];
        const user = mapRowToUser(row);

        await log.debug('Adapter: getSessionAndUser success', {
          component: 'TursoAdapter',
          method: 'getSessionAndUser',
          userId: row.user_id as string,
          sessionExpires: new Date((row.session_expires as number) * 1000).toISOString(),
          durationMs: duration,
          timestamp: new Date().toISOString(),
        });

        return {
          session: {
            sessionToken: row.session_token as string,
            userId: row.user_id as string,
            expires: new Date((row.session_expires as number) * 1000),
          },
          user,
        };
      } catch (error) {
        const duration = Date.now() - startTime;
        await log.error('Adapter: getSessionAndUser failed', {
          component: 'TursoAdapter',
          method: 'getSessionAndUser',
          error: error instanceof Error ? error.message : String(error),
          durationMs: duration,
          timestamp: new Date().toISOString(),
        });
        throw error;
      }
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
      const startTime = Date.now();

      await log.info('Adapter: useVerificationToken started', {
        component: 'TursoAdapter',
        method: 'useVerificationToken',
        identifierDomain: identifier.includes('@') ? identifier.split('@')[1] : 'unknown',
        tokenPreview: token.substring(0, 8) + '...',
        timestamp: new Date().toISOString(),
      });

      try {
        const result = await client.execute({
          sql: `SELECT * FROM verification_tokens
                WHERE identifier = ? AND token = ?`,
          args: [identifier, token],
        });

        if (!result.rows[0]) {
          const duration = Date.now() - startTime;
          await log.warn('Adapter: useVerificationToken not found', {
            component: 'TursoAdapter',
            method: 'useVerificationToken',
            identifierDomain: identifier.includes('@') ? identifier.split('@')[1] : 'unknown',
            reason: 'Token not found (already used or invalid)',
            durationMs: duration,
            timestamp: new Date().toISOString(),
          });
          return null;
        }

        const row = result.rows[0];
        const expires = new Date((row.expires as number) * 1000);

        // Check if token is expired
        if (expires < new Date()) {
          await client.execute({
            sql: `DELETE FROM verification_tokens WHERE identifier = ? AND token = ?`,
            args: [identifier, token],
          });

          const duration = Date.now() - startTime;
          await log.warn('Adapter: useVerificationToken expired', {
            component: 'TursoAdapter',
            method: 'useVerificationToken',
            identifierDomain: identifier.includes('@') ? identifier.split('@')[1] : 'unknown',
            expiredAt: expires.toISOString(),
            durationMs: duration,
            timestamp: new Date().toISOString(),
          });
          return null;
        }

        // Delete the token (one-time use)
        await client.execute({
          sql: `DELETE FROM verification_tokens
                WHERE identifier = ? AND token = ?`,
          args: [identifier, token],
        });

        const duration = Date.now() - startTime;
        await log.info('Adapter: useVerificationToken success', {
          component: 'TursoAdapter',
          method: 'useVerificationToken',
          identifierDomain: identifier.includes('@') ? identifier.split('@')[1] : 'unknown',
          durationMs: duration,
          timestamp: new Date().toISOString(),
        });

        return {
          identifier: row.identifier as string,
          token: row.token as string,
          expires,
        };
      } catch (error) {
        const duration = Date.now() - startTime;
        await log.error('Adapter: useVerificationToken failed', {
          component: 'TursoAdapter',
          method: 'useVerificationToken',
          identifierDomain: identifier.includes('@') ? identifier.split('@')[1] : 'unknown',
          error: error instanceof Error ? error.message : String(error),
          durationMs: duration,
          timestamp: new Date().toISOString(),
        });
        throw error;
      }
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
