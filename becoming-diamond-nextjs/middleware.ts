/**
 * Phase 4: Admin Route Protection (Simplified)
 * Protects /docs-site/* (email check deferred to Phase 7)
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Phase 6: Error Handling - Wrap all logic in try-catch
  try {
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
    if (isOnDocsPage) {
      if (!hasSession) {
        const signInUrl = new URL('/auth/signin', request.url);
        signInUrl.searchParams.set('callbackUrl', pathname);
        console.log('[Phase 4] Docs page requires auth, redirecting:', pathname);
        return NextResponse.redirect(signInUrl);
      }
      console.log('[Phase 4] Authenticated user accessing docs:', pathname);
    }

    // Phase 5: Auth Page Redirect
    if (isOnAuthPage && hasSession) {
      console.log('[Phase 5] Authenticated user on auth page, redirecting to profile:', pathname);
      return NextResponse.redirect(new URL('/app/profile', request.url));
    }

    // Log successful pass-through
    console.log('[Phase 6] path:', pathname, 'allowed');

    return NextResponse.next();
  } catch (error) {
    // Phase 6: Fail-open strategy - log error but allow request through
    console.error('[Phase 6] Middleware error - failing open:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
