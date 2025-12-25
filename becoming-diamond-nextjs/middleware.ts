/**
 * Phase 7: Full NextAuth Integration (FINAL)
 * Uses NextAuth authorized callback from auth.config.ts
 *
 * Features:
 * - Member portal protection (/app/*)
 * - Admin route protection (/docs-site/* with email verification)
 * - Auth page redirect for logged-in users
 * - Built-in error handling in authorized callback
 */

import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
