/**
 * NextAuth.js v5 Configuration
 *
 * Main authentication configuration for the Becoming Diamond member portal.
 * Supports email magic links, Google OAuth, and GitHub OAuth.
 */

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Resend from "next-auth/providers/resend";
import { TursoAdapter, getTursoClient } from "@/lib/turso-adapter";

const turso = getTursoClient();

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: TursoAdapter(turso),

  providers: [
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY!,
      from: "noreply@becomingdiamond.com",
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],

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

    async signIn({ user, account, profile }) {
      // Allow sign-in
      // Add custom logic here if you need to restrict access
      return true;
    },
  },

  events: {
    async createUser({ user }) {
      // Create user profile when a new user signs up
      try {
        const profileId = crypto.randomUUID();
        const now = Math.floor(Date.now() / 1000);

        await turso.execute({
          sql: `INSERT INTO user_profiles (id, user_id, created_at, updated_at)
                VALUES (?, ?, ?, ?)`,
          args: [profileId, user.id, now, now],
        });

        console.log(`[Auth] Created profile for user ${user.id}`);
      } catch (error) {
        console.error(`[Auth] Failed to create profile for user ${user.id}:`, error);
      }
    },
  },

  debug: process.env.NODE_ENV === "development",
});
