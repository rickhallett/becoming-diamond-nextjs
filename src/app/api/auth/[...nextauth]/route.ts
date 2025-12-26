/**
 * NextAuth.js API Route Handler
 *
 * Handles all NextAuth.js authentication requests at /api/auth/*
 * Including sign-in, sign-out, callbacks, and session management.
 */

import { handlers } from "../../../../../auth";

export const { GET, POST } = handlers;
