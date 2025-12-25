/**
 * NextAuth.js Edge-Compatible Configuration
 *
 * This configuration is used by middleware for route protection.
 * Must be edge-compatible (no Node.js APIs or database connections).
 */

import type { NextAuthConfig } from "next-auth";

/**
 * Auth configuration constants
 * Inlined here to avoid importing non-edge-compatible modules
 */
const AUTH_SUCCESS_REDIRECT = '/app/profile';

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

  session: {
    strategy: "jwt", // Edge middleware must use JWT to avoid database calls
  },

  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      try {
        const isLoggedIn = !!auth?.user;
        const isOnMemberPortal = nextUrl.pathname.startsWith("/app");
        const isOnAuthPage = nextUrl.pathname.startsWith("/auth");
        const isOnDocs = nextUrl.pathname.startsWith("/docs-site");
        const userEmail = auth?.user?.email;

        // Protect /docs-site/* routes (only admin email)
        if (isOnDocs) {
          // If ADMIN_EMAIL not configured, deny all access to docs-site
          if (!ADMIN_EMAIL) {
            return Response.redirect(new URL("/", nextUrl.origin));
          }
          if (userEmail === ADMIN_EMAIL) return true;
          // Redirect unauthorized users (including other logged-in users)
          return Response.redirect(new URL("/", nextUrl.origin));
        }

        // Protect /app/* routes
        if (isOnMemberPortal) {
          if (isLoggedIn) return true;
          // Redirect unauthenticated users to sign-in
          return false;
        }

        // Redirect authenticated users away from auth pages to configured success URI
        if (isOnAuthPage && isLoggedIn) {
          return Response.redirect(new URL(AUTH_SUCCESS_REDIRECT, nextUrl.origin));
        }

        return true;
      } catch (error) {
        // If middleware fails, allow the request through to avoid breaking the site
        // Error will be logged but won't crash the middleware
        return true;
      }
    },
  },

  providers: [], // Providers configured in auth.ts
} satisfies NextAuthConfig;
