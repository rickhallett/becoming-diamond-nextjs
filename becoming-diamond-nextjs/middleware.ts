/**
 * NextAuth.js Middleware for Route Protection
 *
 * Protects /app/* routes and redirects unauthenticated users to sign-in.
 * Runs on edge runtime for optimal performance.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for session token cookie
  const sessionToken = request.cookies.get(
    process.env.NODE_ENV === 'production'
      ? '__Secure-next-auth.session-token'
      : 'next-auth.session-token'
  );

  const isLoggedIn = !!sessionToken;

  // Protect /app/* routes
  if (pathname.startsWith('/app')) {
    if (!isLoggedIn) {
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Protect /docs-site/* routes (admin only)
  if (pathname.startsWith('/docs-site')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    // Note: Full admin check happens in the page itself
    // We just ensure user is logged in here
  }

  // Redirect authenticated users away from auth pages
  if (pathname.startsWith('/auth') && isLoggedIn) {
    return NextResponse.redirect(new URL('/app/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
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
