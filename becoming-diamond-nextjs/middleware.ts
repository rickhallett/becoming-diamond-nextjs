/**
 * NextAuth.js Middleware for Route Protection
 *
 * Protects /app/* routes and redirects unauthenticated users to sign-in.
 * Runs on edge runtime for optimal performance.
 */

import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // Match all routes except:
  // - API routes (except NextAuth)
  // - Static files
  // - Public assets
  // - Admin (Decap CMS)
  matcher: [
    /*
     * Match all request paths except:
     * - api (except /api/auth)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (public files)
     * - admin (Decap CMS)
     */
    "/((?!api/(?!auth)|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|admin|book_cover.webp).*)",
  ],
};
