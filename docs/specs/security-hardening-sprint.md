# Security Hardening Sprint - Implementation Specification

**Document Type:** Implementation Plan
**Priority:** P0 - Critical Security Issues
**Estimated Effort:** 3-5 days
**Created:** 2025-11-18
**Based On:** Comprehensive Code Review Analysis

---

## Executive Summary

This specification addresses **4 critical security vulnerabilities** and **3 high-priority technical debt items** identified in the code review. The issues range from authentication bypasses to serverless architecture misunderstandings that render security controls ineffective.

**Risk Level:** 🔴 **CRITICAL** - The application currently has production-blocking security issues.

**Business Impact:**
- **Video Auth Bypass:** Users can access paid course content without authentication
- **Silent Failures:** Application may run in broken state, causing data loss or payment failures
- **Rate Limiting:** Ineffective protection against spam/abuse in serverless environment
- **Account Takeover:** OAuth configuration allows potential account hijacking

---

## Phase 1: Critical Security Fixes (P0)

### 1.1 Environment Variable Validation & Fail-Fast Pattern

**Issue:** Critical credentials default to empty strings, allowing app to boot in insecure/broken state.

**Affected Files:**
- `src/lib/turso.ts`
- `src/app/api/stripe/webhook/route.ts`
- `src/lib/email.ts`
- Any file using `process.env.X || ''` pattern

**Implementation Tasks:**

#### Task 1.1.1: Create Environment Validation Schema
**File:** `src/lib/env.ts` (new file)
**Effort:** 1 hour

```typescript
import { z } from 'zod';

// Define schema for all required environment variables
const envSchema = z.object({
  // Database
  TURSO_DATABASE_URL: z.string().url('TURSO_DATABASE_URL must be a valid URL'),
  TURSO_AUTH_TOKEN: z.string().min(1, 'TURSO_AUTH_TOKEN is required'),

  // Authentication
  AUTH_SECRET: z.string().min(32, 'AUTH_SECRET must be at least 32 characters'),
  AUTH_GOOGLE_ID: z.string().min(1, 'AUTH_GOOGLE_ID is required'),
  AUTH_GOOGLE_SECRET: z.string().min(1, 'AUTH_GOOGLE_SECRET is required'),

  // Payments
  STRIPE_SECRET_KEY: z.string().startsWith('sk_', 'STRIPE_SECRET_KEY must be a valid Stripe key'),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_', 'STRIPE_WEBHOOK_SECRET must be a valid webhook secret'),

  // Email
  RESEND_API_KEY: z.string().startsWith('re_', 'RESEND_API_KEY must be a valid Resend key'),

  // Video
  BUNNY_LIBRARY_ID: z.string().min(1, 'BUNNY_LIBRARY_ID is required'),
  BUNNY_API_KEY: z.string().min(1, 'BUNNY_API_KEY is required'),
  BUNNY_CDN_HOSTNAME: z.string().min(1, 'BUNNY_CDN_HOSTNAME is required'),

  // Optional: Feature flags
  AUTH_GITHUB_ID: z.string().optional(),
  AUTH_GITHUB_SECRET: z.string().optional(),
});

// Runtime-only variables (optional, with defaults)
const runtimeEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
});

// Validate and export typed environment
function validateEnv() {
  try {
    const parsed = envSchema.parse(process.env);
    const runtime = runtimeEnvSchema.parse(process.env);
    return { ...parsed, ...runtime };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment validation failed:');
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      throw new Error('Missing or invalid environment variables. Check .env.local');
    }
    throw error;
  }
}

// Export validated and typed environment
export const env = validateEnv();

// Type-safe access
export type Env = z.infer<typeof envSchema> & z.infer<typeof runtimeEnvSchema>;
```

**Acceptance Criteria:**
- [ ] Schema validates all required environment variables
- [ ] Provides helpful error messages for missing/invalid variables
- [ ] App fails immediately at startup if validation fails (not at runtime)
- [ ] TypeScript types are exported for autocomplete

**Testing:**
```bash
# Test with missing variable
unset TURSO_AUTH_TOKEN
npm run dev  # Should fail with clear error message

# Test with invalid format
export STRIPE_SECRET_KEY="invalid"
npm run dev  # Should fail with validation error
```

---

#### Task 1.1.2: Update Turso Client to Use Validated Env
**File:** `src/lib/turso.ts`
**Effort:** 15 minutes

**Changes:**
```typescript
// BEFORE (Dangerous)
import { createClient } from '@libsql/client';

export const turso = createClient({
  url: process.env.TURSO_DATABASE_URL || '',
  authToken: process.env.TURSO_AUTH_TOKEN || '',
});

// AFTER (Secure)
import { createClient } from '@libsql/client';
import { env } from './env';

export const turso = createClient({
  url: env.TURSO_DATABASE_URL,
  authToken: env.TURSO_AUTH_TOKEN,
});
```

**Acceptance Criteria:**
- [ ] Turso client uses validated environment variables
- [ ] No fallback to empty strings
- [ ] TypeScript autocomplete works for env variables

---

#### Task 1.1.3: Update Stripe Webhook to Use Validated Env
**File:** `src/app/api/stripe/webhook/route.ts`
**Effort:** 15 minutes

**Changes:**
```typescript
// BEFORE (Dangerous)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

// AFTER (Secure)
import { env } from '@/lib/env';

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
});
```

**Similar updates needed in:**
- `src/lib/stripe.ts` (if exists)
- `src/app/api/stripe/checkout/route.ts`

**Acceptance Criteria:**
- [ ] All Stripe initializations use validated env
- [ ] Webhook secret validation cannot be bypassed with empty string

---

#### Task 1.1.4: Update Email Client to Use Validated Env
**File:** `src/lib/email.ts`
**Effort:** 15 minutes

**Changes:**
```typescript
// BEFORE
import { Resend } from 'resend';
export const resend = new Resend(process.env.RESEND_API_KEY || '');

// AFTER
import { Resend } from 'resend';
import { env } from './env';

export const resend = new Resend(env.RESEND_API_KEY);
```

**Acceptance Criteria:**
- [ ] Email client initialization fails fast if API key is missing
- [ ] No silent failures in email sending

---

### 1.2 Video Authentication Bypass Fix

**Issue:** Client-side localStorage check allows users to bypass subscription requirements.

**Affected Files:**
- `src/components/VideoPlayer.tsx`
- `src/app/api/video/[videoId]/token/route.ts`

**Implementation Tasks:**

#### Task 1.2.1: Remove Client-Side Auth Bypass
**File:** `src/components/VideoPlayer.tsx`
**Effort:** 30 minutes

**Changes:**
```typescript
// REMOVE THESE LINES (Security Bypass)
const testAuth = typeof window !== 'undefined'
  ? localStorage.getItem('bd_user_auth')
  : null;

if (testAuth) {
  headers['x-test-auth'] = 'true';
}

// KEEP ONLY SERVER-SIDE VALIDATION
// The token API route already checks session - trust that
```

**Complete Secure Implementation:**
```typescript
'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

interface VideoPlayerProps {
  videoId: string;
  autoplay?: boolean;
  poster?: string;
  onProgress?: (seconds: number) => void;
}

export function VideoPlayer({ videoId, autoplay = false, poster, onProgress }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    // Fetch signed token from server (session validation happens here)
    const initializePlayer = async () => {
      try {
        setLoading(true);
        setError(null);

        // Server validates session and returns signed URL
        const response = await fetch(`/api/video/${videoId}/token`, {
          credentials: 'include', // Include session cookie
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Please sign in to watch this video');
          }
          if (response.status === 403) {
            throw new Error('Subscription required to access this content');
          }
          throw new Error('Failed to load video');
        }

        const { streamUrl } = await response.json();

        // Initialize HLS player with signed URL
        if (Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: false,
          });

          hls.loadSource(streamUrl);
          hls.attachMedia(videoElement);

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            setLoading(false);
            if (autoplay) {
              videoElement.play();
            }
          });

          hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              setError('Failed to load video stream');
            }
          });

          hlsRef.current = hls;
        } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
          // Native HLS support (Safari)
          videoElement.src = streamUrl;
          videoElement.addEventListener('loadedmetadata', () => {
            setLoading(false);
            if (autoplay) {
              videoElement.play();
            }
          });
        } else {
          setError('Your browser does not support video playback');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load video');
        setLoading(false);
      }
    };

    initializePlayer();

    // Progress tracking
    let progressInterval: NodeJS.Timeout;
    if (onProgress) {
      progressInterval = setInterval(() => {
        if (videoElement && !videoElement.paused) {
          onProgress(Math.floor(videoElement.currentTime));
        }
      }, 5000); // Report every 5 seconds
    }

    // Cleanup
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [videoId, autoplay, onProgress]);

  if (error) {
    return (
      <div className="flex items-center justify-center bg-black/90 rounded-lg p-8 text-center">
        <div>
          <p className="text-red-400 mb-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-primary hover:underline"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}
      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        poster={poster}
        playsInline
      />
    </div>
  );
}
```

**Acceptance Criteria:**
- [ ] No localStorage checks in component
- [ ] No client-side authentication logic
- [ ] All auth validation happens server-side in token API route
- [ ] Clear error messages for unauthorized access
- [ ] Video URL is never exposed to client without valid session

**Testing:**
```typescript
// Manual Testing Checklist:
// 1. Open video page while signed out → Should show "Please sign in" error
// 2. Sign in, then try video → Should load successfully
// 3. Open DevTools, try localStorage.setItem('bd_user_auth', 'true') → Should have no effect
// 4. Check Network tab → Token URL should be called with credentials
// 5. Inspect video URL → Should be signed with expiration token
```

---

#### Task 1.2.2: Strengthen Server-Side Token Validation
**File:** `src/app/api/video/[videoId]/token/route.ts`
**Effort:** 30 minutes

**Current Implementation Review:**
```typescript
// Ensure this logic is present and robust:
export async function GET(
  request: Request,
  { params }: { params: { videoId: string } }
) {
  // 1. Validate session
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  // 2. Check user subscription status (if applicable)
  // For MVP, just having a session is enough, but add this for future:
  /*
  const user = await getUserByEmail(session.user.email);
  if (!user.subscriptionActive) {
    return NextResponse.json(
      { error: 'Active subscription required' },
      { status: 403 }
    );
  }
  */

  // 3. Validate videoId format (prevent injection)
  const { videoId } = params;
  if (!videoId || !/^[a-f0-9-]{36}$/.test(videoId)) {
    return NextResponse.json(
      { error: 'Invalid video ID' },
      { status: 400 }
    );
  }

  // 4. Generate signed token with expiration
  const expiresAt = Math.floor(Date.now() / 1000) + 86400; // 24 hours
  const token = await generateBunnyToken(videoId, expiresAt);

  // 5. Return signed stream URL
  const streamUrl = `https://${env.BUNNY_CDN_HOSTNAME}/${videoId}/playlist.m3u8?token=${token}&expires=${expiresAt}`;

  return NextResponse.json({ streamUrl });
}
```

**Add Rate Limiting (See Section 1.3):**
```typescript
import { rateLimit } from '@/lib/rate-limit';

export async function GET(request: Request, { params }: { params: { videoId: string } }) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  // Rate limit: 100 token requests per hour per user
  const identifier = session.user.email;
  const { success } = await rateLimit(identifier, { limit: 100, window: 3600 });

  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  // ... rest of implementation
}
```

**Acceptance Criteria:**
- [ ] Session validation is first step (fail fast)
- [ ] Video ID format is validated (prevent injection)
- [ ] Tokens expire within 24 hours
- [ ] Rate limiting prevents abuse (see Section 1.3)
- [ ] Subscription check placeholder added for future

---

### 1.3 Serverless Rate Limiting Fix

**Issue:** In-memory Map-based rate limiting is ineffective in serverless (Vercel/Lambda) environments.

**Affected Files:**
- `src/app/api/leads/route.ts`
- Any other routes with rate limiting

**Implementation Tasks:**

#### Task 1.3.1: Create Database-Backed Rate Limiter
**File:** `src/lib/rate-limit.ts` (new file)
**Effort:** 2 hours

**Database Schema:**
```sql
-- migrations/003_rate_limiting.sql
CREATE TABLE IF NOT EXISTS rate_limits (
  id TEXT PRIMARY KEY,
  identifier TEXT NOT NULL,
  window_start INTEGER NOT NULL,
  count INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier
  ON rate_limits(identifier, window_start);

-- Auto-cleanup old entries (older than 1 hour)
CREATE TRIGGER IF NOT EXISTS cleanup_old_rate_limits
AFTER INSERT ON rate_limits
BEGIN
  DELETE FROM rate_limits
  WHERE window_start < (strftime('%s', 'now') - 3600);
END;
```

**Implementation:**
```typescript
import { turso } from './turso';

interface RateLimitConfig {
  limit: number;      // Max requests
  window: number;     // Time window in seconds (e.g., 3600 = 1 hour)
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Database-backed rate limiter for serverless environments.
 * Uses Turso database for persistent state across lambda invocations.
 *
 * @param identifier - Unique identifier (email, IP, user ID)
 * @param config - Rate limit configuration
 * @returns Rate limit result with success status
 */
export async function rateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const now = Math.floor(Date.now() / 1000);
  const windowStart = Math.floor(now / config.window) * config.window;
  const id = `${identifier}_${windowStart}`;

  try {
    // Use transaction for atomic read-modify-write
    await turso.execute('BEGIN TRANSACTION');

    // Get current count for this window
    const result = await turso.execute({
      sql: 'SELECT count FROM rate_limits WHERE id = ?',
      args: [id],
    });

    const currentCount = result.rows.length > 0
      ? Number(result.rows[0].count)
      : 0;

    if (currentCount >= config.limit) {
      await turso.execute('COMMIT');
      return {
        success: false,
        remaining: 0,
        resetAt: windowStart + config.window,
      };
    }

    // Increment or create record
    if (result.rows.length > 0) {
      await turso.execute({
        sql: 'UPDATE rate_limits SET count = count + 1, updated_at = ? WHERE id = ?',
        args: [now, id],
      });
    } else {
      await turso.execute({
        sql: 'INSERT INTO rate_limits (id, identifier, window_start, count, created_at, updated_at) VALUES (?, ?, ?, 1, ?, ?)',
        args: [id, identifier, windowStart, now, now],
      });
    }

    await turso.execute('COMMIT');

    return {
      success: true,
      remaining: config.limit - currentCount - 1,
      resetAt: windowStart + config.window,
    };
  } catch (error) {
    await turso.execute('ROLLBACK');
    console.error('Rate limit error:', error);
    // Fail open (allow request) rather than fail closed (deny all)
    // This prevents rate limiting from breaking the app if DB is down
    return {
      success: true,
      remaining: config.limit,
      resetAt: windowStart + config.window,
    };
  }
}

/**
 * Helper to get client IP from request headers (Vercel/Cloudflare)
 */
export function getClientIp(request: Request): string {
  // Vercel/Cloudflare headers
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');

  return cfConnectingIp || realIp || forwardedFor?.split(',')[0] || 'unknown';
}
```

**Acceptance Criteria:**
- [ ] Rate limits persist across serverless invocations
- [ ] Uses database transactions for atomic operations
- [ ] Auto-cleanup of old entries via trigger
- [ ] Fails open (allows requests) if database is down
- [ ] Returns remaining count and reset time

---

#### Task 1.3.2: Update Leads API with Database Rate Limiting
**File:** `src/app/api/leads/route.ts`
**Effort:** 30 minutes

**Changes:**
```typescript
// REMOVE THIS (Ineffective in serverless)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

// REPLACE WITH
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);

    // Rate limit: 5 submissions per hour per IP
    const { success, remaining, resetAt } = await rateLimit(clientIp, {
      limit: 5,
      window: 3600,
    });

    if (!success) {
      return NextResponse.json(
        {
          error: 'Too many submissions. Please try again later.',
          resetAt,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(resetAt - Math.floor(Date.now() / 1000)),
          },
        }
      );
    }

    // ... rest of lead capture logic

    return NextResponse.json(
      { success: true },
      {
        headers: {
          'X-RateLimit-Remaining': String(remaining),
          'X-RateLimit-Reset': String(resetAt),
        },
      }
    );
  } catch (error) {
    // ... error handling
  }
}
```

**Acceptance Criteria:**
- [ ] Uses database-backed rate limiting
- [ ] Returns proper HTTP 429 status
- [ ] Includes `Retry-After` header
- [ ] Exposes rate limit info in response headers
- [ ] Works correctly in Vercel serverless environment

**Testing:**
```bash
# Test script: scripts/test-rate-limiting.ts
import { rateLimit } from '../src/lib/rate-limit';

async function testRateLimiting() {
  const identifier = 'test-user@example.com';

  console.log('Testing rate limiting...\n');

  // Should succeed for first 5 requests
  for (let i = 1; i <= 5; i++) {
    const result = await rateLimit(identifier, { limit: 5, window: 60 });
    console.log(`Request ${i}:`, result);
    if (!result.success) {
      throw new Error(`Expected success on request ${i}`);
    }
  }

  // Should fail on 6th request
  const result = await rateLimit(identifier, { limit: 5, window: 60 });
  console.log('Request 6:', result);
  if (result.success) {
    throw new Error('Expected failure on request 6');
  }

  console.log('\n✅ Rate limiting works correctly!');
}

testRateLimiting().catch(console.error);
```

---

### 1.4 OAuth Account Linking Security

**Issue:** `allowDangerousEmailAccountLinking: true` enables potential account takeover.

**Affected Files:**
- `auth.ts`

**Implementation Tasks:**

#### Task 1.4.1: Review and Fix OAuth Configuration
**File:** `auth.ts`
**Effort:** 1 hour (includes research and testing)

**Current Risk:**
```typescript
// CURRENT (Dangerous)
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: TursoAdapter(turso),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true, // 🚨 RISK
    }),
  ],
  // ...
});
```

**Threat Model:**
1. User creates account via Magic Link with `attacker@example.com`
2. Attacker controls `attacker@example.com` email
3. Attacker signs in via Google OAuth using same email
4. With `allowDangerousEmailAccountLinking: true`, Google account is linked to existing Magic Link account
5. Attacker now has full access to victim's account

**Decision Matrix:**

| Scenario | Recommended Setting | Rationale |
|----------|-------------------|-----------|
| **Users create accounts via Magic Link first** | `false` (secure) | Prevents OAuth from auto-linking to existing accounts |
| **Users create accounts via OAuth first** | `false` (secure) | Standard behavior, no linking needed |
| **Need to support both flows** | `false` + manual linking UI | Requires user to confirm linking in account settings |

**Recommended Fix:**
```typescript
// RECOMMENDED (Secure)
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: TursoAdapter(turso),
  providers: [
    Google({
      clientId: env.AUTH_GOOGLE_ID, // Use validated env
      clientSecret: env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: false, // ✅ SECURE
    }),
    // If GitHub OAuth is enabled
    ...(env.AUTH_GITHUB_ID && env.AUTH_GITHUB_SECRET ? [
      GitHub({
        clientId: env.AUTH_GITHUB_ID,
        clientSecret: env.AUTH_GITHUB_SECRET,
        allowDangerousEmailAccountLinking: false,
      }),
    ] : []),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Optional: Add custom logic to check for existing account
      // and prompt user to link manually

      if (account?.provider === 'google' || account?.provider === 'github') {
        const existingUser = await turso.execute({
          sql: 'SELECT id FROM users WHERE email = ?',
          args: [user.email!],
        });

        if (existingUser.rows.length > 0) {
          // Account exists with this email via different provider
          // Option 1: Block and show error
          throw new Error('An account with this email already exists. Please sign in with your original method or contact support to link accounts.');

          // Option 2: Allow but log for manual review
          // console.warn(`OAuth sign-in attempted for existing email: ${user.email}`);
          // return true; // Allow but flag for review
        }
      }

      return true;
    },
  },
  pages: {
    error: '/auth/error', // Redirect to error page with helpful message
  },
});
```

**Alternative: Manual Account Linking (Future Enhancement):**
```typescript
// In user profile settings, allow manual linking
// src/app/app/profile/link-accounts/route.ts
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { provider, providerId } = await request.json();

  // Verify user owns the provider account (via OAuth flow)
  // Then create account link in database
  await turso.execute({
    sql: 'INSERT INTO accounts (userId, provider, providerAccountId) VALUES (?, ?, ?)',
    args: [session.user.id, provider, providerId],
  });

  return NextResponse.json({ success: true });
}
```

**Acceptance Criteria:**
- [ ] `allowDangerousEmailAccountLinking` set to `false`
- [ ] Existing account detection in `signIn` callback
- [ ] Clear error message when email conflict occurs
- [ ] Documentation added for manual account linking (future)

**Testing:**
```typescript
// Test cases:
// 1. Create account via Magic Link (user@example.com)
// 2. Try to sign in with Google OAuth using same email
// Expected: Error message, sign-in blocked

// 3. Create account via Google OAuth (user@example.com)
// 4. Try Magic Link with same email
// Expected: Either creates separate account or shows error (depending on implementation)
```

---

## Phase 2: Code Quality & Cleanup (P1)

### 2.1 Unused Component Cleanup

**Issue:** 89 Aceternity UI components in codebase, only ~15 are actually used.

**Impact:**
- Increases bundle size
- Slows down build times
- Makes codebase harder to navigate
- Wastes disk space

**Implementation Tasks:**

#### Task 2.1.1: Run Knip Analysis
**Effort:** 15 minutes

```bash
# Generate updated analysis
npm run knip

# Review output and update checklist
# File: docs/knip-cleanup-checklist.md
```

---

#### Task 2.1.2: Execute Automated Cleanup
**File:** `scripts/cleanup-from-checklist.ts`
**Effort:** 30 minutes (review + execution)

**Process:**
1. Review `docs/knip-cleanup-checklist.md`
2. Uncheck any components you want to DELETE
3. Keep checked only components you want to KEEP
4. Run cleanup script:

```bash
# Dry run (preview)
npm run cleanup:knip

# Review backup will be created at .cleanup-backup/
# Review cleanup-log.txt

# Execute deletion (after review)
npm run cleanup:knip:execute
```

**Expected Deletions** (based on review):
- ~74 unused Aceternity UI components
- ~20 unused dependencies in package.json
- ~5 unused utility files

**Acceptance Criteria:**
- [ ] Backup created before deletion
- [ ] Log file shows all deletions
- [ ] Build still succeeds after cleanup
- [ ] All pages render correctly
- [ ] No broken imports

**Testing:**
```bash
# After cleanup
npm run build
npm run dev

# Manually test all pages:
# - Landing page (/)
# - Blog pages (/blog, /blog/[slug])
# - Member portal (/app/*)
# - Admin pages (/app/admin/leads)

# Run automated tests
npm run test
npm run test:e2e
```

---

### 2.2 TypeScript Type Safety

**Issue:** `any` types in Stripe webhooks and other critical paths.

**Implementation Tasks:**

#### Task 2.2.1: Add Stripe TypeScript Definitions
**File:** `src/app/api/stripe/webhook/route.ts`
**Effort:** 1 hour

**Changes:**
```typescript
// BEFORE (Unsafe)
const body = await request.text();
const sig = request.headers.get('stripe-signature');
const event: any = stripe.webhooks.constructEvent(body, sig, webhookSecret);

// AFTER (Type-safe)
import Stripe from 'stripe';

const body = await request.text();
const sig = request.headers.get('stripe-signature');

if (!sig) {
  return NextResponse.json({ error: 'No signature' }, { status: 400 });
}

let event: Stripe.Event;

try {
  event = stripe.webhooks.constructEvent(body, sig, env.STRIPE_WEBHOOK_SECRET);
} catch (err) {
  const error = err instanceof Error ? err.message : 'Unknown error';
  console.error('Webhook signature verification failed:', error);
  return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
}

// Type-safe event handling
switch (event.type) {
  case 'checkout.session.completed': {
    const session = event.data.object as Stripe.Checkout.Session;
    await handleCheckoutComplete(session);
    break;
  }
  case 'payment_intent.succeeded': {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    await handlePaymentSuccess(paymentIntent);
    break;
  }
  case 'payment_intent.payment_failed': {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    await handlePaymentFailure(paymentIntent);
    break;
  }
  default:
    console.log(`Unhandled event type: ${event.type}`);
}

// Type-safe handlers
async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const productId = session.metadata?.productId;

  if (!userId || !productId) {
    console.error('Missing metadata in checkout session:', session.id);
    return;
  }

  // Update database with type-safe access
  await turso.execute({
    sql: 'INSERT INTO purchases (user_id, product_id, stripe_session_id, amount, status) VALUES (?, ?, ?, ?, ?)',
    args: [userId, productId, session.id, session.amount_total, 'completed'],
  });
}
```

**Acceptance Criteria:**
- [ ] No `any` types in webhook handler
- [ ] All Stripe types imported from `stripe` package
- [ ] Event type discrimination with switch/case
- [ ] Type-safe metadata access
- [ ] Error handling for missing metadata

---

## Phase 3: Long-term Improvements (P2)

### 3.1 Environment Variable Documentation

**File:** `.env.example` (update)
**Effort:** 30 minutes

**Add clear documentation for all variables:**
```bash
# .env.example

# ==========================================
# DATABASE (Required)
# ==========================================
# Get these from: https://turso.tech/app
TURSO_DATABASE_URL=libsql://[your-db].turso.io
TURSO_AUTH_TOKEN=your-auth-token-here

# ==========================================
# AUTHENTICATION (Required)
# ==========================================
# Generate with: openssl rand -base64 32
AUTH_SECRET=your-32-char-secret-here

# Google OAuth (Required for sign-in)
# Get these from: https://console.cloud.google.com/
AUTH_GOOGLE_ID=your-google-client-id.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=your-google-client-secret

# GitHub OAuth (Optional - for alternative sign-in)
# Get these from: https://github.com/settings/developers
# AUTH_GITHUB_ID=your-github-client-id
# AUTH_GITHUB_SECRET=your-github-client-secret

# ==========================================
# PAYMENTS (Required for book sales)
# ==========================================
# Get these from: https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_test_... (use sk_live_... in production)
STRIPE_WEBHOOK_SECRET=whsec_... (from webhook dashboard)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... (exposed to client)

# ==========================================
# EMAIL (Required for Magic Link auth)
# ==========================================
# Get these from: https://resend.com/api-keys
RESEND_API_KEY=re_...

# ==========================================
# VIDEO PLATFORM (Required for course content)
# ==========================================
# Get these from: https://panel.bunny.net/
BUNNY_LIBRARY_ID=your-library-id
BUNNY_API_KEY=your-api-key
BUNNY_CDN_HOSTNAME=vz-xxx.b-cdn.net

# ==========================================
# OPTIONAL: Analytics & Monitoring
# ==========================================
# AXIOM_DATASET=your-dataset-name
# AXIOM_TOKEN=xaat-...

# ==========================================
# OPTIONAL: CMS (if using Decap CMS)
# ==========================================
# GITHUB_CLIENT_ID=your-cms-oauth-client-id
# GITHUB_CLIENT_SECRET=your-cms-oauth-secret
```

---

### 3.2 Video Token Rotation (Future)

**Priority:** P2 (Post-MVP)
**Effort:** 2-3 days

**Concept:** Shorter-lived tokens with automatic rotation.

**Current:** 24-hour tokens
**Proposed:** 1-hour tokens with automatic refresh

**Benefits:**
- Limits exposure window if token is leaked
- Prevents long-term URL sharing
- Better piracy protection

**Implementation Sketch:**
```typescript
// src/components/VideoPlayer.tsx
useEffect(() => {
  let tokenRefreshInterval: NodeJS.Timeout;

  const refreshToken = async () => {
    const response = await fetch(`/api/video/${videoId}/token`);
    const { streamUrl } = await response.json();

    // Update HLS source with new signed URL
    if (hlsRef.current) {
      hlsRef.current.loadSource(streamUrl);
    }
  };

  // Refresh token every 50 minutes (before 1-hour expiry)
  tokenRefreshInterval = setInterval(refreshToken, 50 * 60 * 1000);

  return () => clearInterval(tokenRefreshInterval);
}, [videoId]);
```

---

## Implementation Sequence

### Week 1: Critical Security (P0)

**Day 1-2:**
- [ ] Task 1.1: Environment validation (4 hours)
- [ ] Task 1.4: OAuth security fix (1 hour)

**Day 3:**
- [ ] Task 1.2: Video auth bypass fix (2 hours)
- [ ] Create migration for rate limiting table (1 hour)

**Day 4-5:**
- [ ] Task 1.3: Database rate limiting (4 hours)
- [ ] Testing and validation (4 hours)

### Week 2: Code Quality (P1)

**Day 1:**
- [ ] Task 2.1: Knip cleanup (2 hours)
- [ ] Testing after cleanup (2 hours)

**Day 2:**
- [ ] Task 2.2: TypeScript type safety (3 hours)
- [ ] Final security audit (2 hours)

---

## Testing Checklist

### Security Testing

**Environment Validation:**
- [ ] App fails to start with missing TURSO_AUTH_TOKEN
- [ ] App fails to start with invalid STRIPE_SECRET_KEY format
- [ ] Clear error messages point to specific missing variables

**Video Authentication:**
- [ ] Signed-out users cannot access video token API
- [ ] Signed-in users can load videos successfully
- [ ] localStorage bypass does not work (manual DevTools test)
- [ ] Video URLs contain signed tokens with expiration
- [ ] Expired tokens are rejected by Bunny CDN

**Rate Limiting:**
- [ ] 6th lead submission within 1 hour is rejected with 429
- [ ] Rate limits persist across server restarts (serverless test)
- [ ] Rate limit headers are returned correctly
- [ ] Different IPs have separate rate limit buckets

**OAuth Security:**
- [ ] Cannot sign in with Google using existing Magic Link email
- [ ] Error message explains account conflict clearly

### Functional Testing

**After Cleanup:**
- [ ] Landing page renders without errors
- [ ] All Aceternity components used in production still work
- [ ] Blog pages render correctly
- [ ] Member portal pages load
- [ ] No console errors about missing modules

**Type Safety:**
- [ ] No TypeScript errors in build
- [ ] Autocomplete works for Stripe event types
- [ ] Webhook handler logs show correct event types

---

## Rollback Plan

### If Issues Occur After Deployment:

**Environment Validation Issues:**
```bash
# Quick fix: Remove validation temporarily
# In src/lib/env.ts, comment out validation and return process.env directly
# Deploy hotfix, then debug locally

# Long-term fix: Add validation error logging to Axiom
```

**Rate Limiting Breaking API:**
```bash
# Emergency rollback: Disable rate limiting
# In src/lib/rate-limit.ts, return { success: true } immediately
# Deploy, then fix database/transaction issues
```

**Video Player Broken:**
```bash
# Rollback to previous VideoPlayer.tsx from git
git checkout HEAD~1 src/components/VideoPlayer.tsx
# Deploy immediately
```

---

## Success Metrics

### Security Improvements:
- [ ] 0 critical vulnerabilities remaining (down from 4)
- [ ] 0 high-priority security issues (down from 1)
- [ ] 100% of secrets validated at startup
- [ ] 100% of API routes protected by rate limiting

### Code Quality:
- [ ] 70-80% reduction in unused components
- [ ] 0 `any` types in critical paths
- [ ] Build time improvement: 10-20% faster

### Developer Experience:
- [ ] Clear error messages for missing environment variables
- [ ] Type-safe Stripe webhook handling
- [ ] Reduced cognitive load (less unused code)

---

## Estimated Timeline

**Total Effort:** 3-5 days (1 developer)

| Phase | Effort | Dependencies |
|-------|--------|-------------|
| P0: Critical Security | 2.5 days | None |
| P1: Code Quality | 1 day | P0 complete |
| P2: Documentation | 0.5 days | Can run in parallel |

**Risk Buffer:** +1 day for unexpected issues

---

## Appendix: Security Audit Checklist

**Pre-Deployment Checklist:**
- [ ] All secrets loaded from environment (no hardcoded values)
- [ ] Environment validation throws errors for missing critical variables
- [ ] No client-side authentication bypass mechanisms
- [ ] Rate limiting uses persistent storage (database, not memory)
- [ ] OAuth email linking disabled or manually controlled
- [ ] Stripe webhook signatures verified before processing
- [ ] Video tokens expire within reasonable timeframe (24 hours)
- [ ] All API routes validate session/authentication
- [ ] Database queries use parameterized statements (no SQL injection)
- [ ] No sensitive data logged to console in production

**Post-Deployment Monitoring:**
- [ ] Set up Axiom alerts for 401/403 errors (auth failures)
- [ ] Monitor rate limit violations (potential attacks)
- [ ] Track Stripe webhook failures
- [ ] Monitor video token request patterns (piracy detection)

---

## Questions & Decisions Needed

1. **OAuth Linking Strategy:**
   - Option A: Block completely (secure, but limits user flexibility)
   - Option B: Allow with manual confirmation UI (more work, better UX)
   - **Recommendation:** Option A for MVP, add Option B post-launch

2. **Rate Limiting Windows:**
   - Leads API: 5 per hour per IP (current)
   - Video tokens: 100 per hour per user (proposed)
   - **Question:** Are these limits appropriate for expected usage?

3. **Cleanup Aggressiveness:**
   - Delete all 74 unused Aceternity components immediately?
   - Or keep some for potential future use?
   - **Recommendation:** Delete all, re-add if needed (they're in git history)

4. **Type Safety Trade-offs:**
   - Strict types everywhere vs. pragmatic `any` in non-critical paths?
   - **Recommendation:** Strict in payment/auth, pragmatic elsewhere

---

## Additional Resources

- [NextAuth Security Best Practices](https://authjs.dev/guides/providers/email#security)
- [Stripe Webhook Security](https://stripe.com/docs/webhooks/best-practices)
- [Serverless Rate Limiting Patterns](https://vercel.com/guides/how-to-add-rate-limiting-to-your-api-routes)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

---

**Document Status:** ✅ Ready for Implementation
**Last Updated:** 2025-11-18
**Next Review:** After P0 completion
