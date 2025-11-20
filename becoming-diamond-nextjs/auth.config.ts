/**
 * NextAuth.js Edge-Compatible Configuration
 *
 * This configuration is used by middleware for route protection.
 * Must be edge-compatible (no Node.js APIs or database connections).
 */

import type { NextAuthConfig } from "next-auth";
import { AUTH_CONFIG } from "@/config/features";

/**
 * Get admin email from environment.
 * Note: In edge runtime (middleware), we can't throw errors at module load,
 * so we validate at runtime instead.
 */
function getAdminEmail(): string | undefined {
  return process.env.ADMIN_EMAIL;
}

const ADMIN_EMAIL = getAdminEmail();

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
      const isOnDocs = nextUrl.pathname.startsWith("/docs-site");
      const userEmail = auth?.user?.email;

      // Protect /docs-site/* routes (only admin email)
      if (isOnDocs) {
        // If ADMIN_EMAIL not configured, deny all access to docs-site
        if (!ADMIN_EMAIL) {
          console.warn('ADMIN_EMAIL not configured - docs-site access denied');
          return Response.redirect(new URL("/", nextUrl));
        }
        if (userEmail === ADMIN_EMAIL) return true;
        // Redirect unauthorized users (including other logged-in users)
        return Response.redirect(new URL("/", nextUrl));
      }

      // Protect /app/* routes
      if (isOnMemberPortal) {
        if (isLoggedIn) return true;
        // Redirect unauthenticated users to sign-in
        return false;
      }

      // Redirect authenticated users away from auth pages to configured success URI
      if (isOnAuthPage && isLoggedIn) {
        return Response.redirect(new URL(AUTH_CONFIG.successRedirectUri, nextUrl));
      }

      return true;
    },
  },

  providers: [], // Providers configured in auth.ts
} satisfies NextAuthConfig;
