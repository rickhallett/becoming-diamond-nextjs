# Production Observability & Error Tracking Strategy
## Becoming Diamond Next.js Application

**Date:** 2025-11-15
**Status:** CRITICAL - Mobile Production Error Needs Immediate Diagnosis
**Current State:** Axiom integrated but not capturing client-side errors
**Goal:** Diagnose mobile-only client-side exception and establish comprehensive production monitoring

---

## Executive Summary

### Critical Issue
**Production mobile-only bug:** "Application error: a client-side exception has occurred" preventing entire app rendering on real mobile devices (Chrome, Safari). Does NOT reproduce in desktop Chrome DevTools mobile simulation.

### Primary Recommendation
**Immediate Action (Hours 1-4):** Axiom Client-Side Error Tracking + React Error Boundaries
**Cost:** $0/month (within existing Axiom free tier: 500GB ingestion, 30-day retention)
**Implementation Time:** 3-4 hours for immediate diagnosis, 8-12 hours for comprehensive setup
**Key Benefit:** Capture actual mobile errors with full stack traces, device context, and user sessions

### Long-Term Strategy
**Platform:** Axiom (already integrated, no vendor lock-in)
**Estimated Monthly Cost:** $25-50/month at scale (1M events/month projected)
**Alternative Considered:** Sentry ($26-80/month) - Rejected due to existing Axiom investment

---

## Codebase Analysis

### Architecture Overview
- **Framework:** Next.js 15.5.3 with App Router, React 19, Turbopack
- **Rendering Strategies:**
  - Public pages (landing, blog, book): SSR with "use client" directives
  - Member portal (/app/*): CSR with NextAuth protection
  - API routes: Server-side only
- **Client Components:** ~18 pages using "use client" (ALL interactive pages)
- **Heavy 3D Components:** Dynamic imports (Globe, World) with ssr: false
- **Deployment:** Vercel with production at www.becomingdiamond.com

### Current Logging Infrastructure

#### Server-Side (Working)
```typescript
// /src/lib/axiom-logger.ts
- AxiomJSTransport (server-only)
- ConsoleTransport (server + browser)
- NextJS formatters (server context)
- Environment detection (isBrowser check)
```

**Current Usage:**
- 20 API routes with error logging
- Profile operations (GET/PUT)
- Stripe webhook processing
- Lead capture with email delivery tracking
- Database operations (Turso)

**Logging Quality:** Good structured logging with context, timestamps, user IDs

#### Client-Side (MISSING)
- **No error boundary components**
- **No client-side error capture to Axiom**
- **No global error handler**
- **No unhandled rejection handler**
- Console-only logging (not persisted)

### Critical Logging Gaps Identified

#### 1. Client-Side Errors (URGENT)
**Missing Coverage:**
- React component errors
- JavaScript exceptions (mobile-specific)
- Unhandled promise rejections
- Hydration mismatches
- Third-party library failures (Framer Motion, Three.js)

**Business Impact:**
- Mobile users cannot access application (100% failure rate on mobile)
- No visibility into what's breaking
- No stack traces or device context
- Lost revenue from mobile traffic (~40-60% of web traffic)

#### 2. Authentication Flows
**Current State:** Partial logging in UserContext.tsx
**Missing:**
- NextAuth session creation failures
- OAuth callback errors (Google/GitHub)
- Magic link delivery failures
- Session expiration events

**Risk:** Authentication failures are opaque to developers

#### 3. Payment Processing (Stripe)
**Current State:** Good webhook logging
**Missing:**
- Client-side Stripe checkout failures
- Payment form validation errors
- 3D Secure authentication failures
- Card decline error visibility

**Risk:** Revenue loss from untracked payment failures

#### 4. Video Playback (Bunny Stream)
**Current State:** Video integration planned but not implemented
**Missing (Future):**
- HLS stream loading failures
- Token authentication errors
- Adaptive bitrate switching issues
- Buffer/playback errors

#### 5. Database Operations
**Current State:** Server-side errors logged
**Missing:**
- Query performance metrics
- Connection pool exhaustion
- Transaction failures
- Data migration errors

#### 6. Third-Party Service Failures
**Current State:** Minimal tracking
**Missing:**
- Resend email delivery failures
- Gmail SMTP errors (tracked in leads API only)
- Turso database unavailability
- Stripe API failures beyond webhooks

#### 7. Performance Bottlenecks
**Current State:** Vercel Speed Insights integrated
**Missing:**
- Page load times by route
- API response times
- Database query durations
- Client-side rendering performance
- Largest Contentful Paint (LCP) by device type

---

## Service Evaluation: Why Axiom?

### Axiom vs. Alternatives

| Feature | Axiom (Current) | Sentry | LogRocket | Datadog |
|---------|----------------|--------|-----------|---------|
| **Monthly Cost** (1M events) | $25-50 | $26-80 | $99+ | $31+ per host |
| **Free Tier** | 500GB/month | 5k errors/month | 1k sessions/month | 150GB/month |
| **Already Integrated** | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **Client-Side SDK** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Error Boundaries** | Manual | Built-in | Built-in | Manual |
| **Session Replay** | ❌ No | ✅ Yes | ✅ Yes | ✅ Yes |
| **Source Maps** | ✅ Vercel integration | ✅ Yes | ✅ Yes | ✅ Yes |
| **Query Language** | APL (powerful) | Basic filters | Basic filters | DQL |
| **Data Retention** | 30 days (free) | 90 days | 30 days | 15 days |
| **Vendor Lock-In** | Low | Medium | High | High |
| **Next.js Integration** | ✅ Official package | ✅ Official | ⚠️ Limited | ⚠️ Limited |

### Decision Rationale

#### Primary Choice: Axiom
**Strengths:**
1. **Already integrated:** AXIOM_TOKEN and AXIOM_DATASET configured in .env.prod
2. **Zero switching cost:** No migration, no new contracts
3. **Unified logging:** Server + client errors in same platform
4. **Cost-effective:** $0-50/month vs. $26-300/month for alternatives
5. **Query power:** APL language for complex analytics
6. **Next.js native:** @axiomhq/nextjs official package
7. **No vendor lock-in:** Standard log ingestion, easy to migrate

**Weaknesses:**
1. No session replay (use Sentry/LogRocket if needed later)
2. Manual error boundary implementation (vs. Sentry auto-instrumentation)
3. Smaller ecosystem (fewer integrations)

**Recommendation:** **Use Axiom for all error tracking and logging**

#### Alternative Considered: Sentry
**When to use:**
- Need session replay to debug complex UI issues
- Want automatic error boundary instrumentation
- Team prefers specialized error tracking UX
- Budget allows $80-300/month

**Why rejected for now:**
- Axiom already integrated and working
- Can add Sentry later for session replay only
- Redundant cost for core error tracking

---

## Implementation Plan

### Phase 1: Immediate Mobile Error Diagnosis (Hours 1-4)

**Goal:** Capture the mobile-only error that's breaking production

#### Step 1.1: Create Global Error Boundary (1 hour)
**File:** `/src/app/error.tsx` (Next.js convention)

```typescript
'use client';

import { useEffect } from 'react';
import { log } from '@/lib/axiom-logger';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to Axiom
    log.error('React Error Boundary Caught Error', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      route: window.location.pathname,
      userAgent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      devicePixelRatio: window.devicePixelRatio,
    });
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4">
      <div className="max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <p className="text-gray-400 mb-6">
          We've been notified and are looking into it.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-primary text-black rounded-lg font-semibold hover:bg-primary/90 transition"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
```

#### Step 1.2: Create Global Root Error Boundary (30 min)
**File:** `/src/app/global-error.tsx` (catches errors in root layout)

```typescript
'use client';

import { useEffect } from 'react';
import { log } from '@/lib/axiom-logger';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log critical root-level errors
    log.error('Global Error Boundary - Critical Failure', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      route: typeof window !== 'undefined' ? window.location.pathname : 'unknown',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      viewport: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'unknown',
    });
  }, [error]);

  return (
    <html>
      <body className="bg-black text-white">
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <h2 className="text-2xl font-bold mb-4">Application Error</h2>
          <p className="text-gray-400 mb-6">Please refresh the page.</p>
          <button
            onClick={reset}
            className="px-6 py-3 bg-primary text-black rounded-lg font-semibold"
          >
            Refresh
          </button>
        </div>
      </body>
    </html>
  );
}
```

#### Step 1.3: Add Client-Side Error Instrumentation (1 hour)
**File:** `/src/lib/client-error-tracking.ts` (new file)

```typescript
'use client';

import { log } from '@/lib/axiom-logger';

/**
 * Initialize client-side error tracking
 * Call this once in the root layout client component
 */
export function initClientErrorTracking() {
  if (typeof window === 'undefined') return;

  // Track unhandled errors
  window.addEventListener('error', (event) => {
    log.error('Unhandled JavaScript Error', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack,
      timestamp: new Date().toISOString(),
      route: window.location.pathname,
      userAgent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      devicePixelRatio: window.devicePixelRatio,
      isMobile: /iPhone|iPad|Android/i.test(navigator.userAgent),
    });
  });

  // Track unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    log.error('Unhandled Promise Rejection', {
      reason: event.reason,
      promise: String(event.promise),
      timestamp: new Date().toISOString(),
      route: window.location.pathname,
      userAgent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      isMobile: /iPhone|iPad|Android/i.test(navigator.userAgent),
    });
  });

  // Track React hydration errors (Next.js 15 specific)
  const originalConsoleError = console.error;
  console.error = (...args: any[]) => {
    const message = args[0];
    if (
      typeof message === 'string' &&
      (message.includes('Hydration') || message.includes('hydration'))
    ) {
      log.error('React Hydration Error', {
        message: args.join(' '),
        timestamp: new Date().toISOString(),
        route: window.location.pathname,
        userAgent: navigator.userAgent,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        isMobile: /iPhone|iPad|Android/i.test(navigator.userAgent),
      });
    }
    originalConsoleError.apply(console, args);
  };

  // Log initial page load context (for mobile debugging)
  log.info('Client Initialized', {
    timestamp: new Date().toISOString(),
    route: window.location.pathname,
    userAgent: navigator.userAgent,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    devicePixelRatio: window.devicePixelRatio,
    isMobile: /iPhone|iPad|Android/i.test(navigator.userAgent),
    browserFeatures: {
      webGL: !!document.createElement('canvas').getContext('webgl'),
      serviceWorker: 'serviceWorker' in navigator,
      localStorage: typeof Storage !== 'undefined',
    },
  });
}
```

#### Step 1.4: Update Root Layout (30 min)
**File:** `/src/app/layout.tsx` (modify existing)

```typescript
"use client";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Providers } from "./providers";
import { useEffect } from "react"; // ADD
import { initClientErrorTracking } from "@/lib/client-error-tracking"; // ADD
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Initialize client-side error tracking
  useEffect(() => {
    initClientErrorTracking();
  }, []);

  return (
    <html lang="en">
      <head>
        <title>Becoming Diamond - Transform Pressure into Clarity</title>
        {/* Resource hints for performance optimization */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://js.stripe.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <SpeedInsights />
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

#### Step 1.5: Deploy and Monitor (1 hour)
1. Deploy to Vercel production
2. Test on real mobile devices (Chrome, Safari)
3. Watch Axiom dashboard for errors
4. Query for mobile-specific errors:
   ```apl
   ['becoming-diamond-prod']
   | where ['_time'] > ago(1h)
   | where level == 'error'
   | where isMobile == true
   | project ['_time'], message, stack, userAgent, viewport
   | sort by ['_time'] desc
   ```

**Expected Outcome:**
- Capture exact error message, stack trace, and mobile context
- Identify which component/library is failing on mobile
- Root cause analysis within hours

---

### Phase 2: Comprehensive Error Tracking (Hours 5-12)

#### Step 2.1: Component-Level Error Boundaries (2 hours)
**Files to create:**

1. `/src/components/error-boundary.tsx` - Reusable boundary
```typescript
'use client';

import React from 'react';
import { log } from '@/lib/axiom-logger';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  context?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to Axiom with component context
    log.error('Component Error Boundary Caught Error', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      context: this.props.context || 'unknown',
      timestamp: new Date().toISOString(),
      route: typeof window !== 'undefined' ? window.location.pathname : 'unknown',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 border border-red-500 rounded bg-red-500/10 text-red-400">
          <p className="font-semibold">Something went wrong in {this.props.context || 'this component'}</p>
        </div>
      );
    }

    return this.props.children;
  }
}
```

2. Wrap critical sections:
```typescript
// Example: /src/app/page.tsx (landing page)
<ErrorBoundary context="HeroSection">
  <HeroSection {...heroProps} />
</ErrorBoundary>

<ErrorBoundary context="Globe3D">
  <World data={sampleArcs} globeConfig={globeConfig} />
</ErrorBoundary>
```

#### Step 2.2: Authentication Error Tracking (1.5 hours)
**File:** `/src/contexts/UserContext.tsx` (enhance existing)

Add comprehensive error logging:
```typescript
// In fetchProfile() catch block (line 114)
await log.error('Failed to load user profile', {
  error: error instanceof Error ? error.message : String(error),
  stack: error instanceof Error ? error.stack : undefined,
  userId: session?.user?.id || 'unknown',
  sessionStatus: status,
  timestamp: new Date().toISOString(),
  route: typeof window !== 'undefined' ? window.location.pathname : 'unknown',
});

// In updateProfile() catch block (line 188)
await log.error('Failed to update profile', {
  error: error instanceof Error ? error.message : String(error),
  stack: error instanceof Error ? error.stack : undefined,
  userId: user.id,
  attemptedUpdates: Object.keys(updates),
  timestamp: new Date().toISOString(),
});
```

#### Step 2.3: API Route Error Enhancement (2 hours)
**Pattern to apply to all 20 API routes:**

```typescript
// Example: /src/app/api/profile/route.ts (enhance existing)
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      await log.warn('Unauthorized profile access attempt', {
        timestamp: new Date().toISOString(),
        ip: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ... existing logic

  } catch (error) {
    await log.error('Error fetching profile', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      userId: session?.user?.id || 'unknown',
      timestamp: new Date().toISOString(),
      // Add request context
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

**Apply to:**
- All 20 API routes in `/src/app/api/**/*.ts`
- Add request context (method, URL, headers)
- Add error stack traces
- Add user/session context

#### Step 2.4: Payment Error Tracking (1.5 hours)
**Client-Side Stripe Integration** (when implemented):

```typescript
// Future: /src/components/StripeCheckoutButton.tsx
import { log } from '@/lib/axiom-logger';

async function handleCheckout() {
  try {
    const response = await fetch('/api/checkout/create-session', {
      method: 'POST',
      // ... request config
    });

    if (!response.ok) {
      await log.error('Stripe checkout session creation failed', {
        status: response.status,
        statusText: response.statusText,
        timestamp: new Date().toISOString(),
      });
      throw new Error('Failed to create checkout session');
    }

    // ... redirect to Stripe
  } catch (error) {
    await log.error('Stripe checkout error', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      userId: user?.id || 'anonymous',
    });
  }
}
```

#### Step 2.5: Third-Party Service Monitoring (1 hour)
**Files to enhance:**

1. `/src/lib/turso-adapter.ts` (database errors)
```typescript
export async function getTursoClient() {
  try {
    return createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  } catch (error) {
    await log.error('Turso client initialization failed', {
      error: error instanceof Error ? error.message : String(error),
      hasUrl: !!process.env.TURSO_DATABASE_URL,
      hasToken: !!process.env.TURSO_AUTH_TOKEN,
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
}
```

2. Email delivery tracking (already good in leads API)

#### Step 2.6: Performance Monitoring (1 hour)
**File:** `/src/lib/performance-tracking.ts` (new)

```typescript
'use client';

import { log } from '@/lib/axiom-logger';

export function trackPagePerformance() {
  if (typeof window === 'undefined') return;

  // Wait for page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paintEntries = window.performance.getEntriesByType('paint');

      log.info('Page Performance Metrics', {
        route: window.location.pathname,
        // Core Web Vitals
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
        // Paint metrics
        firstPaint: paintEntries.find((entry) => entry.name === 'first-paint')?.startTime,
        firstContentfulPaint: paintEntries.find((entry) => entry.name === 'first-contentful-paint')?.startTime,
        // Resource timing
        dnsLookup: perfData.domainLookupEnd - perfData.domainLookupStart,
        tcpConnection: perfData.connectEnd - perfData.connectStart,
        serverResponse: perfData.responseEnd - perfData.requestStart,
        // Device context
        userAgent: navigator.userAgent,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        isMobile: /iPhone|iPad|Android/i.test(navigator.userAgent),
        timestamp: new Date().toISOString(),
      });
    }, 0);
  });
}
```

Add to root layout:
```typescript
useEffect(() => {
  initClientErrorTracking();
  trackPagePerformance(); // ADD
}, []);
```

---

### Phase 3: Dashboards & Alerting (Hours 13-16)

#### Dashboard 1: Production Errors Overview
**Purpose:** Real-time error monitoring and triage

**Query:**
```apl
['becoming-diamond-prod']
| where ['_time'] > ago(24h)
| where level == 'error'
| summarize
    errorCount = count(),
    uniqueUsers = dcount(userId),
    errorTypes = make_set(message)
  by bin(['_time'], 1h)
| project ['_time'], errorCount, uniqueUsers, errorTypes
| render timechart
```

**Visualizations:**
1. **Error Rate Timeline** (line chart)
   - X-axis: Time (1-hour bins)
   - Y-axis: Error count
   - Group by: error type

2. **Top Errors** (table)
   - Columns: Error message, Count, Affected users, Last seen
   - Sort by: Count descending

3. **Error Distribution by Route** (pie chart)
   - Segments: /app/*, /blog/*, /, /book/*

4. **Mobile vs Desktop Errors** (bar chart)
   - X-axis: Device type
   - Y-axis: Error count

#### Dashboard 2: Mobile-Specific Issues
**Purpose:** Track mobile-only bugs (like current production issue)

**Query:**
```apl
['becoming-diamond-prod']
| where ['_time'] > ago(7d)
| where isMobile == true
| where level == 'error'
| summarize
    errorCount = count(),
    uniqueDevices = dcount(userAgent)
  by message, route
| sort by errorCount desc
| take 20
```

**Visualizations:**
1. **Mobile Error Heatmap** (heatmap)
   - X-axis: Route
   - Y-axis: Error type
   - Color: Error frequency

2. **Device Breakdown** (table)
   - Columns: User agent, Viewport, Error count
   - Filter: iOS vs Android

3. **Hydration Errors** (timeline)
   - Filter: message contains "Hydration"
   - Group by: Component

#### Dashboard 3: API Performance & Errors
**Purpose:** Monitor backend health

**Query:**
```apl
['becoming-diamond-prod']
| where ['_time'] > ago(1h)
| where context == 'API' or level == 'error'
| summarize
    requestCount = count(),
    errorRate = countif(level == 'error') * 100.0 / count()
  by bin(['_time'], 5m), route
| project ['_time'], route, requestCount, errorRate
| render timechart
```

**Visualizations:**
1. **API Error Rate** (line chart)
   - Multiple series per route
   - Threshold line at 1% error rate

2. **Slowest Endpoints** (table)
   - Columns: Route, Avg duration, P95, P99
   - Sort by: P99 descending

3. **Database Errors** (timeline)
   - Filter: error contains "turso" or "database"

#### Dashboard 4: Authentication & User Journey
**Purpose:** Track login failures and session issues

**Query:**
```apl
['becoming-diamond-prod']
| where ['_time'] > ago(24h)
| where message contains "auth" or message contains "login" or message contains "session"
| summarize count() by level, message
| sort by count_ desc
```

**Visualizations:**
1. **Auth Success/Failure Rate** (donut chart)
   - Segments: Success, Failed, Pending

2. **OAuth Provider Breakdown** (bar chart)
   - X-axis: Google, GitHub, Email
   - Y-axis: Login attempts

3. **Session Expiration Events** (timeline)
   - Track user frustration from expired sessions

#### Dashboard 5: Payment & Revenue Tracking
**Purpose:** Monitor Stripe integration health

**Query:**
```apl
['becoming-diamond-prod']
| where ['_time'] > ago(7d)
| where message contains "stripe" or message contains "payment"
| summarize
    totalPayments = countif(message contains "checkout completed"),
    failedPayments = countif(message contains "payment failed"),
    revenue = sum(todouble(amount))
  by bin(['_time'], 1d)
| project ['_time'], totalPayments, failedPayments, revenue
```

**Visualizations:**
1. **Payment Success Rate** (line chart)
   - Success % over time
   - Threshold alert at <95%

2. **Revenue Timeline** (area chart)
   - Daily/weekly revenue trends

3. **Failed Payment Reasons** (table)
   - Group by: failureMessage
   - Count occurrences

---

### Phase 4: Alerting Rules (Hours 17-20)

#### Critical Alerts (Immediate Response)

**Alert 1: High Error Rate**
```apl
['becoming-diamond-prod']
| where ['_time'] > ago(5m)
| where level == 'error'
| summarize errorCount = count()
| where errorCount > 10
```
- **Threshold:** >10 errors in 5 minutes
- **Severity:** Critical
- **Channel:** Slack #engineering-alerts, Email
- **Response:** Check dashboard, rollback if deployment-related

**Alert 2: Authentication System Down**
```apl
['becoming-diamond-prod']
| where ['_time'] > ago(5m)
| where message contains "auth" and level == 'error'
| summarize errorCount = count()
| where errorCount > 3
```
- **Threshold:** >3 auth errors in 5 minutes
- **Severity:** Critical
- **Channel:** Slack #engineering-alerts, PagerDuty
- **Response:** Check NextAuth, OAuth providers, database

**Alert 3: Payment Processing Failure**
```apl
['becoming-diamond-prod']
| where ['_time'] > ago(10m)
| where message contains "payment failed" or message contains "stripe webhook"
| where level == 'error'
| summarize errorCount = count()
| where errorCount > 2
```
- **Threshold:** >2 payment errors in 10 minutes
- **Severity:** Critical (revenue impact)
- **Channel:** Slack #revenue-alerts, Email to admin
- **Response:** Check Stripe dashboard, verify webhook endpoint

**Alert 4: Database Connection Issues**
```apl
['becoming-diamond-prod']
| where ['_time'] > ago(5m)
| where message contains "turso" or message contains "database"
| where level == 'error'
| summarize errorCount = count()
| where errorCount > 5
```
- **Threshold:** >5 database errors in 5 minutes
- **Severity:** Critical
- **Channel:** Slack #engineering-alerts
- **Response:** Check Turso status, connection pool, credentials

#### Warning Alerts (Investigation Required)

**Alert 5: Mobile Error Spike**
```apl
['becoming-diamond-prod']
| where ['_time'] > ago(15m)
| where isMobile == true
| where level == 'error'
| summarize errorCount = count()
| where errorCount > 5
```
- **Threshold:** >5 mobile errors in 15 minutes
- **Severity:** Warning
- **Channel:** Slack #engineering
- **Response:** Review mobile dashboard, test on devices

**Alert 6: API Performance Degradation**
```apl
['becoming-diamond-prod']
| where ['_time'] > ago(10m)
| where context == 'API'
| where duration > 5000  // >5 seconds
| summarize slowRequests = count()
| where slowRequests > 10
```
- **Threshold:** >10 slow requests (>5s) in 10 minutes
- **Severity:** Warning
- **Channel:** Slack #engineering
- **Response:** Check database queries, external API latency

**Alert 7: Hydration Errors**
```apl
['becoming-diamond-prod']
| where ['_time'] > ago(30m)
| where message contains "Hydration" or message contains "hydration"
| summarize errorCount = count()
| where errorCount > 3
```
- **Threshold:** >3 hydration errors in 30 minutes
- **Severity:** Warning
- **Channel:** Slack #engineering
- **Response:** Check for SSR/CSR mismatches, environment variables

#### Info Alerts (Daily Summary)

**Alert 8: Daily Error Summary**
- **Schedule:** Daily at 9 AM
- **Query:** Previous 24h error summary
- **Channel:** Email to team
- **Content:**
  - Total errors
  - Top 5 error types
  - Affected routes
  - Mobile vs desktop breakdown

---

## Specific Code Examples

### Example 1: Wrap 3D Components with Error Boundary
**File:** `/src/app/page.tsx`

**Before:**
```typescript
const World = dynamic(() => import("@/components/ui/globe").then((m) => m.World), {
  ssr: false,
});

// Later in render
<World data={sampleArcs} globeConfig={globeConfig} />
```

**After:**
```typescript
import { ErrorBoundary } from '@/components/error-boundary';

const World = dynamic(() => import("@/components/ui/globe").then((m) => m.World), {
  ssr: false,
});

// Later in render
<ErrorBoundary
  context="Globe3D"
  fallback={
    <div className="h-[600px] flex items-center justify-center text-gray-500">
      3D visualization unavailable
    </div>
  }
>
  <World data={sampleArcs} globeConfig={globeConfig} />
</ErrorBoundary>
```

### Example 2: Track API Route Performance
**File:** `/src/app/api/profile/route.ts`

```typescript
import { log } from '@/lib/axiom-logger';

export async function GET() {
  const startTime = Date.now();

  try {
    const session = await auth();

    if (!session?.user?.id) {
      await log.warn('Unauthorized profile access', {
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Database query timing
    const dbStartTime = Date.now();
    const result = await turso.execute({
      sql: `SELECT id, name, email, image, created_at FROM users WHERE id = ?`,
      args: [userId],
    });
    const dbDuration = Date.now() - dbStartTime;

    if (!result.rows[0]) {
      await log.warn('User not found in database', {
        userId,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      });
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // ... rest of logic

    // Log successful request with timing
    await log.info('Profile fetched successfully', {
      userId,
      totalDuration: Date.now() - startTime,
      dbDuration,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ profile });
  } catch (error) {
    await log.error('Error fetching profile', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      duration: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### Example 3: User Session Error Tracking
**File:** `/src/contexts/UserContext.tsx`

```typescript
// In fetchProfile() function
const fetchProfile = React.useCallback(async () => {
  if (!session?.user?.id) {
    setUser(null);
    setIsLoading(false);
    return;
  }

  const fetchStartTime = Date.now();

  try {
    const response = await fetch('/api/profile');

    if (!response.ok) {
      throw new Error(`Failed to fetch profile: ${response.status}`);
    }

    const data = await response.json();
    setUser(data.profile);

    // Log successful profile load with timing
    await log.info('User profile loaded', {
      userId: data.profile.id,
      duration: Date.now() - fetchStartTime,
      timestamp: new Date().toISOString(),
    });

    // Update auth state
    const authState: AuthState = {
      isAuthenticated: true,
      userId: data.profile.id,
      loginMethod: 'email',
      loginTimestamp: Date.now(),
    };
    setAuth(authState);
  } catch (error) {
    await log.error('Failed to load user profile', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      userId: session?.user?.id,
      sessionStatus: status,
      duration: Date.now() - fetchStartTime,
      timestamp: new Date().toISOString(),
      // Add network context
      online: navigator.onLine,
      connectionType: (navigator as any).connection?.effectiveType || 'unknown',
    });
    setUser(null);
  } finally {
    setIsLoading(false);
  }
}, [session?.user?.id, status]);
```

### Example 4: Stripe Checkout Error Tracking
**File:** `/src/components/StripeCheckoutButton.tsx` (future implementation)

```typescript
'use client';

import { useState } from 'react';
import { log } from '@/lib/axiom-logger';
import { loadStripe } from '@stripe/stripe-js';

export function StripeCheckoutButton() {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    const startTime = Date.now();
    setLoading(true);

    try {
      // Create checkout session
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create checkout session');
      }

      const { sessionId } = await response.json();

      // Load Stripe
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      if (!stripe) {
        throw new Error('Failed to load Stripe');
      }

      // Redirect to checkout
      const { error: redirectError } = await stripe.redirectToCheckout({ sessionId });

      if (redirectError) {
        throw redirectError;
      }

      // Log successful redirect
      await log.info('Redirected to Stripe checkout', {
        sessionId,
        userId: user?.id || 'anonymous',
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      await log.error('Stripe checkout error', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        userId: user?.id || 'anonymous',
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        // Add payment context
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
        publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.slice(0, 10) + '...',
      });

      // Show user-friendly error
      alert('Payment processing error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="px-6 py-3 bg-primary text-black rounded-lg font-semibold"
    >
      {loading ? 'Processing...' : 'Purchase Now'}
    </button>
  );
}
```

---

## Privacy & Compliance

### Data Handling
**What we log:**
- Error messages and stack traces
- User IDs (not PII like email/name in error logs)
- Request metadata (URL, method, headers)
- Device information (user agent, viewport)
- Performance metrics

**What we DON'T log:**
- Passwords or authentication credentials
- Credit card numbers or payment details (except Stripe IDs)
- Email content
- Full request/response bodies (only metadata)

### GDPR/CCPA Compliance
1. **Data Minimization:** Only log necessary debugging information
2. **Retention Policy:** 30 days in Axiom (configurable)
3. **User Rights:**
   - Right to erasure: Can delete user's error logs via Axiom API
   - Right to access: Can export user's error history
4. **Consent:** Error tracking is operational necessity (legitimate interest)
5. **Privacy Policy:** Update to mention error tracking for service improvement

### Security Considerations
1. **API Keys:** Store in environment variables (never log)
2. **Stack Traces:** May contain file paths (acceptable for debugging)
3. **Headers:** Sanitize auth headers before logging
4. **Database Credentials:** Never log connection strings
5. **User Data:** Hash user IDs in logs if needed for extra privacy

---

## Cost Projections

### Axiom Pricing Breakdown
**Free Tier:**
- 500 GB ingestion/month
- 30-day retention
- Unlimited users
- Unlimited queries

**Current Usage Estimate:**
- Server-side logs: ~100 MB/day (API routes, webhooks)
- Client-side errors: ~50 MB/day (estimate)
- Performance metrics: ~20 MB/day
- **Total:** ~170 MB/day = ~5.1 GB/month

**Projection at Scale (10k monthly active users):**
- Server-side logs: ~500 MB/day
- Client-side errors: ~200 MB/day
- Performance metrics: ~100 MB/day
- **Total:** ~800 MB/day = ~24 GB/month

**Cost:** $0/month (well within free tier)

### Growth Projections

| Monthly Users | Events/Month | Ingestion | Cost |
|---------------|--------------|-----------|------|
| 1,000 | 100k | 5 GB | $0 |
| 10,000 | 1M | 24 GB | $0 |
| 50,000 | 5M | 120 GB | $0 |
| 100,000 | 10M | 240 GB | $0 |
| 200,000 | 20M | 480 GB | $0 |
| 500,000 | 50M | 1.2 TB | $25/month |
| 1,000,000 | 100M | 2.4 TB | $50/month |

**Break-even Analysis:**
- Free tier covers: Up to ~200k monthly active users
- Paid tier: $25-50/month for 500k-1M users
- Alternative (Sentry): $80-300/month for same volume

**Cost Optimization Strategies:**
1. **Sampling:** Log 10% of successful requests, 100% of errors
2. **Log Levels:** Use debug/info sparingly in production
3. **Retention:** Keep 30 days for errors, 7 days for info logs
4. **Aggregation:** Aggregate repetitive errors (don't log same error 1000 times)

---

## Migration Path (Not Needed)

Since Axiom is already integrated, there's no migration required. However, if switching to Sentry later:

### Axiom → Sentry Migration (Optional)
1. **Parallel Running (Week 1):**
   - Keep Axiom for server-side logs
   - Add Sentry for client-side errors only
   - Compare data quality and coverage

2. **Evaluation (Week 2):**
   - Check which platform captures more errors
   - Compare query/dashboard UX
   - Assess cost vs. value

3. **Decision (Week 3):**
   - If Sentry provides session replay value: Keep both
   - If Axiom is sufficient: Remove Sentry
   - If migrating fully: Switch all logging to Sentry

4. **Cutover (Week 4):**
   - Export critical queries/dashboards
   - Archive Axiom data if needed
   - Update all error tracking code

**Rollback Plan:**
- Keep Axiom logger wrapper abstraction
- Can switch back by changing import paths
- No vendor lock-in (standard logging patterns)

---

## Testing Strategy

### Unit Tests (Vitest)
```typescript
// tests/lib/client-error-tracking.test.ts
import { describe, it, expect, vi } from 'vitest';
import { initClientErrorTracking } from '@/lib/client-error-tracking';

describe('Client Error Tracking', () => {
  it('should register global error handler', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    initClientErrorTracking();
    expect(addEventListenerSpy).toHaveBeenCalledWith('error', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('unhandledrejection', expect.any(Function));
  });

  it('should log unhandled errors to Axiom', async () => {
    // Mock log.error
    const logErrorSpy = vi.fn();
    vi.mock('@/lib/axiom-logger', () => ({
      log: { error: logErrorSpy },
    }));

    initClientErrorTracking();

    // Trigger error
    const error = new Error('Test error');
    window.dispatchEvent(new ErrorEvent('error', { error, message: 'Test error' }));

    expect(logErrorSpy).toHaveBeenCalledWith(
      'Unhandled JavaScript Error',
      expect.objectContaining({
        message: 'Test error',
      })
    );
  });
});
```

### Integration Tests (Playwright)
```typescript
// tests/e2e/error-tracking.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Error Tracking', () => {
  test('should capture and log React errors', async ({ page }) => {
    // Navigate to page with intentional error trigger
    await page.goto('/test-error-boundary');

    // Trigger error
    await page.click('[data-testid="trigger-error"]');

    // Verify error boundary displayed
    await expect(page.locator('text=Something went wrong')).toBeVisible();

    // Verify error logged to console (Axiom logs to console in dev)
    const consoleErrors = await page.evaluate(() => {
      return (window as any).__consoleErrors || [];
    });
    expect(consoleErrors.length).toBeGreaterThan(0);
  });

  test('should track mobile-specific errors', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile-only test');

    await page.goto('/');

    // Wait for client-side hydration
    await page.waitForLoadState('networkidle');

    // Verify no hydration errors
    const errors = await page.evaluate(() => {
      return (window as any).__hydrationErrors || [];
    });
    expect(errors.length).toBe(0);
  });
});
```

### Load Testing (Artillery)
```yaml
# tests/load/error-tracking-load.yml
config:
  target: 'https://www.becomingdiamond.com'
  phases:
    - duration: 60
      arrivalRate: 10  # 10 users/sec
      name: 'Warm up'
    - duration: 300
      arrivalRate: 50  # 50 users/sec
      name: 'Sustained load'
  processor: './error-tracking-processor.js'

scenarios:
  - name: 'Browse and trigger errors'
    flow:
      - get:
          url: '/'
      - get:
          url: '/app'
          expect:
            - statusCode: 401  # Unauthenticated
      - post:
          url: '/api/leads'
          json:
            email: 'test@example.com'
            consentGiven: true
            noLiabilityAccepted: true
```

**Expected Results:**
- Error rate: <1% under normal load
- Axiom ingestion: <1s latency
- No logging-related performance impact

---

## Red Flags & Resolution

### Red Flag 1: Mobile-Only Client-Side Exception (CURRENT)
**Symptoms:**
- "Application error: a client-side exception has occurred"
- Only on real mobile devices (not desktop dev tools)
- Both Chrome and Safari affected

**Likely Causes:**
1. **Hydration mismatch:** SSR HTML doesn't match CSR render on mobile
   - Possible: window.innerWidth calculations
   - Possible: navigator.userAgent conditionals
   - Possible: Date/time formatting differences

2. **Third-party library mobile incompatibility:**
   - Three.js WebGL context failures on mobile GPUs
   - Framer Motion touch event handlers
   - Canvas operations (BackgroundBeams, WavyBackground)

3. **Browser API unavailability on mobile:**
   - IntersectionObserver issues
   - ResizeObserver issues
   - requestAnimationFrame timing differences

4. **Memory constraints:**
   - Mobile devices running out of memory loading 3D components
   - Too many animations running simultaneously

**Resolution Steps:**
1. **Deploy Phase 1 error boundaries (immediate)**
   - Will capture exact error message and stack trace
   - Will identify which component is failing

2. **Review Axiom dashboard for error pattern**
   - Check if error occurs on specific routes
   - Identify mobile device types affected
   - Check viewport sizes causing issues

3. **Test hypotheses:**
   - Add conditional rendering for mobile: `if (isMobile) return <SimpleFallback />`
   - Disable 3D components on mobile temporarily
   - Check for window/navigator usage outside useEffect

4. **Fix and redeploy:**
   - Once error identified, implement targeted fix
   - Add mobile-specific error boundary
   - Add mobile detection utility

### Red Flag 2: Missing Error Tracking in NextAuth
**Symptoms:**
- Users report login failures
- No error logs in Axiom
- Support tickets with "can't sign in"

**Resolution:**
1. Add error logging to NextAuth configuration:
```typescript
// /auth.config.ts
export default {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        // ... sign-in logic
        return true;
      } catch (error) {
        await log.error('NextAuth sign-in error', {
          error: error instanceof Error ? error.message : String(error),
          provider: account?.provider,
          userId: user?.id,
          timestamp: new Date().toISOString(),
        });
        return false;
      }
    },
  },
  events: {
    signIn: async ({ user }) => {
      await log.info('User signed in', {
        userId: user.id,
        timestamp: new Date().toISOString(),
      });
    },
    signOut: async ({ token }) => {
      await log.info('User signed out', {
        userId: token.sub,
        timestamp: new Date().toISOString(),
      });
    },
  },
};
```

### Red Flag 3: Stripe Webhook Failures Not Alerting
**Symptoms:**
- Payments succeed in Stripe
- Course access not granted
- No alerts fired

**Resolution:**
1. **Add webhook failure tracking:**
```typescript
// /src/app/api/stripe/webhook/route.ts
export async function POST(req: NextRequest) {
  // ... existing signature verification

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        // ... existing logic

        // Add tracking
        await log.info('Course access granted', {
          sessionId: session.id,
          userId: session.metadata?.userId,
          amount: session.amount_total,
          timestamp: new Date().toISOString(),
        });
        break;
      }
    }
  } catch (err) {
    // CRITICAL: Alert on webhook processing failures
    await log.error('Stripe webhook processing failed - REVENUE IMPACT', {
      error: err instanceof Error ? err.message : String(err),
      eventType: event.type,
      eventId: event.id,
      severity: 'CRITICAL',
      timestamp: new Date().toISOString(),
    });

    // Trigger immediate alert (configure in Axiom)
    throw err;
  }
}
```

2. **Set up critical alert:**
   - Threshold: ANY webhook processing error
   - Channel: Slack + PagerDuty
   - Response: Manual investigation within 15 minutes

### Red Flag 4: Performance Degradation Not Detected
**Symptoms:**
- Users report slow page loads
- No performance alerts
- Vercel Speed Insights shows issues

**Resolution:**
1. **Add performance monitoring:**
```typescript
// Track slow API routes
export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    // ... API logic

    const duration = Date.now() - startTime;

    if (duration > 1000) {
      await log.warn('Slow API response', {
        route: request.url,
        duration,
        threshold: 1000,
        timestamp: new Date().toISOString(),
      });
    }

    return response;
  } catch (error) {
    // ... error handling
  }
}
```

2. **Set up performance alert:**
   - Threshold: >10 slow requests (>5s) in 10 minutes
   - Channel: Slack #engineering
   - Response: Check database, external APIs

### Red Flag 5: Database Connection Pool Exhaustion
**Symptoms:**
- Intermittent 500 errors
- "Too many connections" errors
- Turso dashboard shows high connection count

**Resolution:**
1. **Add connection monitoring:**
```typescript
// /src/lib/turso-adapter.ts
import { log } from '@/lib/axiom-logger';

export function getTursoClient() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  // Track connection lifecycle
  log.info('Turso client created', {
    timestamp: new Date().toISOString(),
  });

  return client;
}
```

2. **Add connection pool metrics:**
   - Track active connections
   - Alert on >80% pool usage
   - Auto-scale or connection pooling

---

## Success Metrics

### Week 1 (Immediate)
- [ ] Mobile error captured and diagnosed
- [ ] Root cause identified
- [ ] Fix deployed and verified
- [ ] No mobile errors in last 24 hours

### Month 1 (Comprehensive)
- [ ] <1% error rate across all routes
- [ ] 100% of critical errors alerting
- [ ] <5 minute mean time to detection (MTTD)
- [ ] <30 minute mean time to resolution (MTTR) for critical issues
- [ ] 0 revenue-impacting payment errors

### Quarter 1 (Optimized)
- [ ] <0.5% error rate
- [ ] 95% of errors auto-resolved or non-blocking
- [ ] Custom dashboards for each team member
- [ ] Weekly error review meetings with insights
- [ ] Performance budget enforcement (LCP <2.5s on mobile)

---

## Next Steps & Action Items

### Immediate (This Week)
1. **Hour 1-2:** Create error boundaries (error.tsx, global-error.tsx)
2. **Hour 3:** Create client error tracking utility
3. **Hour 4:** Deploy to production and test on mobile
4. **Hour 5-8:** Review Axiom logs and identify root cause
5. **Hour 9-12:** Implement fix and verify resolution

### Short-Term (Next 2 Weeks)
1. **Week 2:** Implement comprehensive error tracking (Phase 2)
   - Component-level boundaries
   - API route enhancements
   - Performance monitoring

2. **Week 3:** Build dashboards and alerts (Phase 3-4)
   - Production errors overview
   - Mobile-specific dashboard
   - Critical alerts setup

### Long-Term (Next Quarter)
1. **Month 2:** Advanced monitoring
   - User session tracking
   - Feature flag integration
   - A/B test error tracking

2. **Month 3:** Optimization
   - Error aggregation and grouping
   - Automated error triage
   - Predictive alerting (ML-based anomaly detection)

3. **Month 4:** Team enablement
   - Error tracking documentation
   - On-call playbooks
   - Training sessions

---

## Appendix

### A. Axiom Query Examples

**Find all mobile errors in last hour:**
```apl
['becoming-diamond-prod']
| where ['_time'] > ago(1h)
| where level == 'error'
| where isMobile == true
| project ['_time'], message, stack, userAgent, route
| sort by ['_time'] desc
```

**Top 10 errors by count:**
```apl
['becoming-diamond-prod']
| where ['_time'] > ago(24h)
| where level == 'error'
| summarize count() by message
| sort by count_ desc
| take 10
```

**Authentication failure rate:**
```apl
['becoming-diamond-prod']
| where ['_time'] > ago(1h)
| where message contains "auth" or message contains "login"
| summarize
    total = count(),
    failures = countif(level == 'error')
| extend failureRate = (failures * 100.0) / total
| project failureRate, total, failures
```

**API performance percentiles:**
```apl
['becoming-diamond-prod']
| where ['_time'] > ago(1h)
| where context == 'API'
| summarize
    p50 = percentile(duration, 50),
    p95 = percentile(duration, 95),
    p99 = percentile(duration, 99)
  by route
| sort by p99 desc
```

### B. Error Taxonomy

**Error Categories:**
1. **Client-Side Errors**
   - Component errors (caught by Error Boundary)
   - Unhandled exceptions (window.onerror)
   - Promise rejections (unhandledrejection)
   - Hydration mismatches (React/Next.js)

2. **Server-Side Errors**
   - API route errors (500 responses)
   - Database errors (Turso connection/query)
   - Authentication errors (NextAuth)
   - External API errors (Stripe, Resend)

3. **Integration Errors**
   - Webhook failures (Stripe)
   - Email delivery failures (Resend/Gmail)
   - OAuth provider errors (Google/GitHub)

4. **Performance Issues**
   - Slow API responses (>5s)
   - Large bundle sizes (>1MB)
   - Poor LCP (>2.5s)
   - Memory leaks (client-side)

### C. Incident Response Playbook

**Critical Error Response (Within 15 minutes):**
1. **Acknowledge:** Respond to alert in Slack/PagerDuty
2. **Assess:** Check Axiom dashboard for error count and scope
3. **Triage:**
   - Is it affecting >10% of users? → Rollback
   - Is it revenue-impacting? → Escalate to CTO
   - Is it isolated? → Schedule fix for next sprint
4. **Communicate:** Post status update in #incidents channel
5. **Resolve:** Deploy fix or rollback
6. **Verify:** Check Axiom for error resolution
7. **Post-Mortem:** Document in /docs/incidents/ (if critical)

**Example Incident Timeline:**
```
00:00 - Alert fires: "High error rate"
00:02 - Engineer acknowledges in Slack
00:05 - Axiom dashboard shows mobile-only errors
00:10 - Root cause identified: 3D component on iOS Safari
00:15 - Fix PR created (disable 3D on iOS)
00:25 - Fix deployed to production
00:30 - Verification: 0 errors in last 10 minutes
00:45 - Post-mortem written
```

### D. Resources & Documentation

**Axiom Documentation:**
- Official Docs: https://axiom.co/docs
- Next.js Integration: https://axiom.co/docs/integrations/nextjs
- APL Query Language: https://axiom.co/docs/apl/introduction

**Next.js Error Handling:**
- Error Boundaries: https://nextjs.org/docs/app/building-your-application/routing/error-handling
- Global Error: https://nextjs.org/docs/app/api-reference/file-conventions/error

**React Error Boundaries:**
- React Docs: https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary

**Internal Documentation:**
- CLAUDE.md: Project architecture and conventions
- /docs/specs/: Feature specifications

---

## Conclusion

This observability strategy will:
1. **Immediately diagnose** the critical mobile production bug (Phase 1: 4 hours)
2. **Establish comprehensive** error tracking across client and server (Phase 2: 8 hours)
3. **Provide actionable insights** via dashboards and alerts (Phase 3-4: 8 hours)
4. **Scale cost-effectively** to 200k+ users on free tier

**Total Implementation Time:** 20 hours (2.5 days)
**Total Cost:** $0/month (within Axiom free tier)
**Business Impact:** Zero mobile downtime, <1% error rate, <30 min MTTR

**Next Step:** Deploy Phase 1 error boundaries to production immediately.
