/**
 * Phase 4: Admin Route Protection
 * Protects /docs-site/* with JWT-based admin check
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decode } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
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

  // Phase 4: Admin Route Protection
  if (isOnDocsPage) {
    // Get admin email from env
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

    // If no admin email configured, block all access
    if (!ADMIN_EMAIL) {
      console.log('[Phase 4] No ADMIN_EMAIL configured, blocking:', pathname);
      return NextResponse.redirect(new URL('/', request.url));
    }

    // If no session, redirect to signin
    if (!hasSession) {
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      console.log('[Phase 4] No session, redirecting:', pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Decode JWT to check admin status
    const sessionCookie = prodCookie || devCookie;
    if (sessionCookie) {
      try {
        const token = await decode({
          token: sessionCookie.value,
          secret: process.env.AUTH_SECRET!,
        });

        if (token?.email !== ADMIN_EMAIL) {
          console.log('[Phase 4] Non-admin blocked:', token?.email, '→', pathname);
          return NextResponse.redirect(new URL('/', request.url));
        }

        console.log('[Phase 4] Admin allowed:', ADMIN_EMAIL, '→', pathname);
      } catch (error) {
        console.log('[Phase 4] Token decode error, blocking:', pathname);
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
  }

  // Log route classification
  console.log('[Phase 4] path:', pathname, 'protected:', isProtected, 'allowed');

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
