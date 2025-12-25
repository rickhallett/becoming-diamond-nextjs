/**
 * Phase 1: Cookie Detection Only
 * Logs session cookie presence without changing behavior
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Detect session cookie (try both production and development cookie names)
  const prodCookie = request.cookies.get('__Secure-next-auth.session-token');
  const devCookie = request.cookies.get('next-auth.session-token');
  const hasSession = !!(prodCookie || devCookie);

  // Log to Vercel Functions
  console.log('[Phase 1] path:', request.nextUrl.pathname, 'hasSession:', hasSession);

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
