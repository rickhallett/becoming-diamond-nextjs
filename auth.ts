/**
 * NextAuth.js v5 Configuration
 *
 * Main authentication configuration for the Becoming Diamond member portal.
 * Supports email magic links, Google OAuth, and GitHub OAuth.
 */

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Nodemailer from "next-auth/providers/nodemailer";
import Credentials from "next-auth/providers/credentials";
import { TursoAdapter, getTursoClient } from "@/lib/turso-adapter";
import { FEATURES } from "@/config/features";
import { GMAIL_SMTP_CONFIG } from "@/lib/gmail-smtp";
import { verifyPassword } from "@/lib/password";
import type { Provider } from "next-auth/providers";
import { log } from '@/lib/axiom-logger';

/**
 * Validates that required authentication credentials are present.
 * Implements fail-fast pattern to prevent silent misconfiguration.
 */
function validateAuthCredentials() {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPassword = process.env.GMAIL_APP_PASSWORD;
  const googleId = process.env.AUTH_GOOGLE_ID;
  const googleSecret = process.env.AUTH_GOOGLE_SECRET;

  if (!gmailUser || gmailUser.trim() === '') {
    throw new Error(
      'GMAIL_USER is not configured for magic link authentication. ' +
      'Please set this environment variable. See README.md for setup instructions.'
    );
  }

  if (!gmailPassword || gmailPassword.trim() === '') {
    throw new Error(
      'GMAIL_APP_PASSWORD is not configured for magic link authentication. ' +
      'Please set this environment variable. See README.md for setup instructions.'
    );
  }

  if (!googleId || googleId.trim() === '') {
    throw new Error(
      'AUTH_GOOGLE_ID is not configured for Google OAuth. ' +
      'Please set this environment variable. See README.md for setup instructions.'
    );
  }

  if (!googleSecret || googleSecret.trim() === '') {
    throw new Error(
      'AUTH_GOOGLE_SECRET is not configured for Google OAuth. ' +
      'Please set this environment variable. See README.md for setup instructions.'
    );
  }

  // Validate GitHub credentials if GitHub auth is enabled
  if (FEATURES.githubAuth) {
    const githubId = process.env.AUTH_GITHUB_ID;
    const githubSecret = process.env.AUTH_GITHUB_SECRET;

    if (!githubId || githubId.trim() === '') {
      throw new Error(
        'AUTH_GITHUB_ID is not configured but GitHub auth is enabled. ' +
        'Please set this environment variable or disable GitHub auth in config/features.ts.'
      );
    }

    if (!githubSecret || githubSecret.trim() === '') {
      throw new Error(
        'AUTH_GITHUB_SECRET is not configured but GitHub auth is enabled. ' +
        'Please set this environment variable or disable GitHub auth in config/features.ts.'
      );
    }
  }

  return {
    gmailUser,
    gmailPassword,
    googleId,
    googleSecret,
    githubId: process.env.AUTH_GITHUB_ID,
    githubSecret: process.env.AUTH_GITHUB_SECRET,
  };
}

// Validate credentials at module load time (fail-fast)
const credentials = validateAuthCredentials();

const turso = getTursoClient();

// Build providers array conditionally
const providers: Provider[] = [
  Nodemailer({
    server: {
      ...GMAIL_SMTP_CONFIG,
      auth: {
        user: credentials.gmailUser,
        pass: credentials.gmailPassword,
      },
    },
    from: credentials.gmailUser,
  }),
  Google({
    clientId: credentials.googleId,
    clientSecret: credentials.googleSecret,
    // IMPORTANT: Enabled to allow OAuth signin even if email exists
    // This is safe because Google verifies email ownership
    allowDangerousEmailAccountLinking: true,
  }),
  // Password authentication for home screen app users
  // Users must first authenticate via magic link or OAuth, then set a password in their profile
  Credentials({
    id: "credentials",
    name: "Password",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        await log.warn('Credentials auth: Missing email or password', {
          timestamp: new Date().toISOString(),
        });
        return null;
      }

      const email = credentials.email as string;
      const password = credentials.password as string;

      try {
        // Look up user by email
        const result = await turso.execute({
          sql: `SELECT id, email, name, image, password_hash FROM users WHERE email = ?`,
          args: [email],
        });

        if (!result.rows[0]) {
          await log.info('Credentials auth: User not found', {
            email: email.split('@')[1], // Only log domain for privacy
            timestamp: new Date().toISOString(),
          });
          return null;
        }

        const user = result.rows[0];
        const passwordHash = user.password_hash as string | null;

        // Check if user has a password set
        if (!passwordHash) {
          await log.info('Credentials auth: No password set for user', {
            userId: user.id as string,
            timestamp: new Date().toISOString(),
          });
          return null;
        }

        // Verify password
        const isValid = await verifyPassword(password, passwordHash);

        if (!isValid) {
          await log.warn('Credentials auth: Invalid password', {
            userId: user.id as string,
            timestamp: new Date().toISOString(),
          });
          return null;
        }

        await log.info('Credentials auth: Successful login', {
          userId: user.id as string,
          timestamp: new Date().toISOString(),
        });

        return {
          id: user.id as string,
          email: user.email as string,
          name: user.name as string | null,
          image: user.image as string | null,
        };
      } catch (error) {
        await log.error('Credentials auth: Database error', {
          error: error instanceof Error ? error.message : String(error),
          timestamp: new Date().toISOString(),
        });
        return null;
      }
    },
  }),
];

// Conditionally add GitHub provider
if (FEATURES.githubAuth && credentials.githubId && credentials.githubSecret) {
  providers.push(
    GitHub({
      clientId: credentials.githubId,
      clientSecret: credentials.githubSecret,
      // IMPORTANT: Enabled to allow OAuth signin even if email exists
      // This is safe because GitHub verifies email ownership
      allowDangerousEmailAccountLinking: true,
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: TursoAdapter(turso),

  providers,

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },

  callbacks: {
    async jwt({ token, user, trigger, session: updateSession }) {
      // Initial sign in - add user data to token
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }

      // Handle session updates (e.g., profile changes)
      if (trigger === "update" && updateSession) {
        token.name = updateSession.name;
        token.email = updateSession.email;
        token.picture = updateSession.image;
      }

      return token;
    },

    async session({ session, user, token }) {
      // For database sessions, user comes from database
      // For JWT sessions (middleware), user comes from token
      if (user) {
        // Database session
        session.user.id = user.id;
      } else if (token) {
        // JWT session (middleware)
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
      }
      return session;
    },

    async signIn({ user, account, profile, email }) {
      try {
        console.log('[AUTH] Sign-in callback triggered', {
          provider: account?.provider,
          userEmail: user.email,
          userId: user.id,
        });

        // Validate user data
        if (!user.email) {
          console.error('[AUTH] Sign-in failed: Missing email', { userId: user.id });
          await log.error('Sign-in failed: Missing email', {
            userId: user.id,
            provider: account?.provider,
            timestamp: new Date().toISOString(),
          });
          return false;
        }

        console.log('[AUTH] User sign-in validated, proceeding');

        await log.info('User sign-in attempt', {
          provider: account?.provider,
          authMethod: email?.verificationRequest ? 'magic-link' : 'oauth',
          userId: user.id,
          email: user.email,
          hasProfile: !!profile,
          timestamp: new Date().toISOString(),
        });

        console.log('[AUTH] Sign-in successful, returning true');
        return true;
      } catch (error) {
        console.error('[AUTH] Sign-in callback error:', error);
        await log.error('Sign-in callback error', {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          userId: user.id,
          provider: account?.provider,
          timestamp: new Date().toISOString(),
        });
        return false;
      }
    },
  },

  events: {
    async createUser({ user }) {
      await log.info('User creation triggered', {
        userId: user.id,
        email: user.email,
        name: user.name || 'not provided',
        timestamp: new Date().toISOString(),
      });

      try {
        const profileId = crypto.randomUUID();
        const now = Math.floor(Date.now() / 1000);

        await turso.execute({
          sql: `INSERT INTO user_profiles (id, user_id, created_at, updated_at)
                VALUES (?, ?, ?, ?)`,
          args: [profileId, user.id, now, now],
        });

        await log.info('User profile created successfully', {
          userId: user.id,
          profileId,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        await log.error('Failed to create user profile', {
          userId: user.id,
          error: error instanceof Error ? error.message : String(error),
          timestamp: new Date().toISOString(),
        });
      }
    },
  },

  debug: process.env.NODE_ENV === 'production', // Enable debug in production temporarily
});
