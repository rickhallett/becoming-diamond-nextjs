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

  // Phase 3: Member Portal Protection
  if (isOnMemberPortal && !hasSession) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    console.log('[Phase 3] Redirecting to signin:', pathname, '→ /auth/signin?callbackUrl=' + pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Log route classification
  console.log('[Phase 3] path:', pathname, 'protected:', isProtected, 'allowed:', hasSession || !isProtected);

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
