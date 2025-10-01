/**
 * NextAuth.js Edge-Compatible Configuration
 *
 * This configuration is used by middleware for route protection.
 * Must be edge-compatible (no Node.js APIs or database connections).
 */

import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },

  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnMemberPortal = nextUrl.pathname.startsWith("/app");
      const isOnAuthPage = nextUrl.pathname.startsWith("/auth");

      // Protect /app/* routes
      if (isOnMemberPortal) {
        if (isLoggedIn) return true;
        // Redirect unauthenticated users to sign-in
        return false;
      }

      // Redirect authenticated users away from auth pages
      if (isOnAuthPage && isLoggedIn) {
        return Response.redirect(new URL("/app", nextUrl));
      }

      return true;
    },
  },

  providers: [], // Providers configured in auth.ts
} satisfies NextAuthConfig;
