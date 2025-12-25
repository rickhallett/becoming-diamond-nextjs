/**
 * Phase 1: Cookie Detection Only
 * Minimal test - just pass through without logging
 */

import { NextResponse } from 'next/server';

export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
