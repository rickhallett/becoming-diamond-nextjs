/**
 * Phase 4: Admin Route Protection (Simplified)
 * Protects /docs-site/* (email check deferred to Phase 7)
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

  // Phase 4: Admin Route Protection (Simplified)
  // Full JWT-based email check deferred to Phase 7
  if (isOnDocsPage) {
    // For now, just require authentication
    // Phase 7 will add full NextAuth integration with email verification
    if (!hasSession) {
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      console.log('[Phase 4] Docs page requires auth, redirecting:', pathname);
      return NextResponse.redirect(signInUrl);
    }

    // NOTE: Email-based admin check will be added in Phase 7 via NextAuth authorized callback
    console.log('[Phase 4] Authenticated user accessing docs:', pathname);
  }

  // Log route classification
  console.log('[Phase 4] path:', pathname, 'protected:', isProtected, 'allowed');

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
