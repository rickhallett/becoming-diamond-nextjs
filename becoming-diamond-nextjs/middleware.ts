/**
 * Phase 1: Cookie Detection Only
 * Logs session cookie presence without changing behavior
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Detect session cookie
  const sessionCookie = request.cookies.get(
    process.env.NODE_ENV === 'production'
      ? '__Secure-next-auth.session-token'
      : 'next-auth.session-token'
  );

  console.log('[Phase 1]', { path: pathname, hasSession: !!sessionCookie });

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
