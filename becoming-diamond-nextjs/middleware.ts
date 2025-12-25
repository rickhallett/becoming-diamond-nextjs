/**
 * Phase 1: Cookie Detection Only
 * Logs session cookie presence without changing behavior
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Detect session cookie (try both production and development cookie names)
  const prodCookie = request.cookies.get('__Secure-next-auth.session-token');
  const devCookie = request.cookies.get('next-auth.session-token');
  const hasSession = !!(prodCookie || devCookie);

  // Log to Vercel Functions (string concatenation safer than object in edge)
  console.log('[Phase 1] path:', pathname, 'hasSession:', hasSession);

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
