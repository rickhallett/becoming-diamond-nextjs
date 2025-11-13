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

const turso = getTursoClient();

// Build providers array conditionally
const providers = [
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
      // Log sign-in attempts for debugging
      console.log('[Auth] signIn callback:', {
        provider: account?.provider,
        email: email?.verificationRequest ? 'magic-link' : user.email,
        userId: user.id,
      });

      // Allow sign-in
      return true;
    },
  },

  events: {
    async createUser({ user }) {
      // Create user profile when a new user signs up
      console.log(`[Auth Event] createUser triggered:`, {
        userId: user.id,
        email: user.email,
        name: user.name,
      });

      try {
        const profileId = crypto.randomUUID();
        const now = Math.floor(Date.now() / 1000);

        await turso.execute({
          sql: `INSERT INTO user_profiles (id, user_id, created_at, updated_at)
                VALUES (?, ?, ?, ?)`,
          args: [profileId, user.id, now, now],
        });

        console.log(`[Auth Event] Created profile for user ${user.id}`);
      } catch (error) {
        console.error(
          `[Auth Event] Failed to create profile for user ${user.id}:`,
          error
        );
      }
    },
  },

  debug: false,
});
