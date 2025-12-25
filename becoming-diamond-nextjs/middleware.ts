/**
 * Phase 2: Path Matching Logic
 * Adds route classification without behavior changes
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Detect session cookie
  const prodCookie = request.cookies.get('__Secure-next-auth.session-token');
  const devCookie = request.cookies.get('next-auth.session-token');
  const hasSession = !!(prodCookie || devCookie);

  // Classify routes
  const isOnMemberPortal = pathname.startsWith('/app');
  const isOnDocsPage = pathname.startsWith('/docs-site');
  const isOnAuthPage = pathname.startsWith('/auth');

  // Determine protection needs
  const isProtected = isOnMemberPortal || isOnDocsPage;
  const shouldBlock = isProtected && !hasSession;

  // Log route classification
  console.log('[Phase 2] path:', pathname, 'protected:', isProtected, 'shouldBlock:', shouldBlock, 'hasSession:', hasSession);

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
