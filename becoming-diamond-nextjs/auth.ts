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
import { TursoAdapter, getTursoClient } from "@/lib/turso-adapter";
import { FEATURES } from "@/config/features";
import { GMAIL_SMTP_CONFIG } from "@/lib/gmail-smtp";
import type { Provider } from "next-auth/providers";
import { log } from '@axiomhq/nextjs';

const turso = getTursoClient();

// Build providers array conditionally
const providers: Provider[] = [
  Nodemailer({
    server: {
      ...GMAIL_SMTP_CONFIG,
      auth: {
        user: process.env.GMAIL_USER!,
        pass: process.env.GMAIL_APP_PASSWORD!,
      },
    },
    from: process.env.GMAIL_USER!,
  }),
  Google({
    clientId: process.env.AUTH_GOOGLE_ID!,
    clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    allowDangerousEmailAccountLinking: true,
  }),
];

// Conditionally add GitHub provider
if (FEATURES.githubAuth) {
  providers.push(
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
      allowDangerousEmailAccountLinking: true,
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: TursoAdapter(turso),

  providers,

  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },

  callbacks: {
    async session({ session, user }) {
      // Attach user ID to session
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },

    async signIn({ user, account, profile, email }) {
      try {
        // Validate user data
        if (!user.email) {
          await log.error('Sign-in failed: Missing email', {
            userId: user.id,
            provider: account?.provider,
            timestamp: new Date().toISOString(),
          });
          return false;
        }

        await log.info('User sign-in attempt', {
          provider: account?.provider,
          authMethod: email?.verificationRequest ? 'magic-link' : 'oauth',
          userId: user.id,
          email: user.email,
          hasProfile: !!profile,
          timestamp: new Date().toISOString(),
        });

        return true;
      } catch (error) {
        await log.error('Sign-in callback error', {
          error: error instanceof Error ? error.message : String(error),
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

  debug: false,
});
