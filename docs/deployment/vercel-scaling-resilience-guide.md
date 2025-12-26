# Vercel Deployment Scaling & Resilience Guide

**Document Version:** 1.0
**Last Updated:** 2025-10-16
**Status:** Active
**Audience:** DevOps, Backend Engineers, Technical Leads

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Current Deployment State](#current-deployment-state)
3. [Tier Analysis](#tier-analysis)
4. [Vertical Scaling Implementation](#vertical-scaling-implementation)
5. [Resilience & Monitoring](#resilience--monitoring)
6. [Performance Optimization](#performance-optimization)
7. [Security Hardening](#security-hardening)
8. [Action Plan](#action-plan)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

---

## Executive Summary

### Current Status
The Becoming Diamond application is deployed on Vercel with **55% implementation** of production-grade scaling and resilience features. The deployment relies heavily on Vercel's automatic defaults rather than explicit configuration, creating potential gaps in resource management, monitoring, and fault tolerance.

### Key Findings
- ✅ **Working:** Basic deployment, Speed Insights, edge middleware, image optimization
- ⚠️ **Partial:** Runtime configuration (2/14+ API routes), performance optimizations
- ❌ **Missing:** Error tracking, health checks, rate limiting, explicit tier management, monitoring

### Critical Actions Required
1. Add error tracking service (Sentry or Vercel Monitoring)
2. Configure health check endpoints
3. Implement rate limiting on all API routes
4. Create explicit vercel.json configuration
5. Set up production monitoring and alerting

### Tier Status
**Current Tier:** Pro (inferred from `maxDuration: 60s` usage and team org)
**Monthly Cost Estimate:** ~$20-50/month for Pro tier
**At Risk:** One API route (`/api/dev/zip`) requires Pro tier features

---

## Current Deployment State

### Vercel Project Configuration

**Project Details:**
- **Project ID:** `prj_8RDjwBAyiKUAlB6aXSfUrgOTWyIh`
- **Organization:** `team_OnRhYT9YIEipDIeZwJEjbXD2`
- **Project Name:** `aceternity-demo-cms`
- **Framework:** Next.js 15.5.3
- **Build System:** Turbopack
- **Region:** Not explicitly configured (using Vercel default)

**Files:**
```
.vercel/
├── project.json          # Project metadata only
└── README.txt

# MISSING FILES:
vercel.json               # ❌ No explicit configuration
.vercelignore            # ❌ Using default ignore rules
```

### Runtime Configuration Audit

**Configured Routes (2):**

```typescript
// ✅ src/app/api/ask/route.ts
export const runtime = 'nodejs'; // AI streaming endpoint
// Missing: maxDuration, memory

// ✅ src/app/api/dev/zip/route.ts
export const runtime = 'nodejs';
export const maxDuration = 60; // ⚠️ REQUIRES PRO TIER
// Missing: memory
```

**Unconfigured Routes (~12):**
- `/api/auth` - OAuth endpoints (critical)
- `/api/callback` - OAuth callback
- `/api/checkout` - Stripe payments (critical)
- `/api/profile` - User data
- `/api/sprint/*` - Content delivery
- `/api/videos` - Video token generation
- `/api/leads` - Lead capture
- `/api/unsubscribe` - Email management
- `/api/blog` - Content API

**Risk:** These routes use Vercel's default settings:
- Free tier: 10s timeout, 1024MB memory
- Pro tier: 10s timeout (unless configured), 1024MB memory

### Middleware Configuration

**Edge Middleware (✅ Configured):**

```typescript
// middleware.ts
export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    "/((?!api/(?!auth)|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|admin|book_cover.webp).*)",
  ],
};
```

**Benefits:**
- Runs on Vercel Edge Network (low latency)
- Protects /app/* routes
- Excludes static assets and public routes

**Limitations:**
- No rate limiting
- No geo-routing
- No custom headers
- No request logging

### Performance Configuration

**Next.js Config (next.config.ts):**

```typescript
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],        // ✅ Modern formats
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,                    // ✅ 1 year cache
    remotePatterns: [/* ... */],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production', // ✅ Strip logs
  },
  experimental: {
    optimizePackageImports: ['@tabler/icons-react', 'framer-motion'] // ✅
  },
};
```

**Build Output Size:**
- `.next/` directory: **118MB** (large - optimization opportunity)

**Resource Hints (layout.tsx):**
```html
<link rel="preconnect" href="https://images.unsplash.com" />
<link rel="dns-prefetch" href="https://js.stripe.com" />
<link rel="dns-prefetch" href="https://fonts.googleapis.com" />
```

---

## Tier Analysis

### Vercel Pricing Tiers Comparison

| Feature | Hobby (Free) | Pro ($20/seat) | Enterprise (Custom) |
|---------|--------------|----------------|---------------------|
| **Function Duration** | 10 seconds | 60 seconds | 900 seconds |
| **Function Memory** | 1024 MB | 3008 MB | 3008 MB |
| **Bandwidth** | 100 GB/month | 1 TB/month | Custom |
| **Build Minutes** | 6,000/month | Unlimited | Unlimited |
| **Team Members** | 1 | Unlimited | Unlimited |
| **Speed Insights** | ✅ | ✅ | ✅ |
| **Web Analytics** | Limited | Advanced | Advanced |
| **Password Protection** | ❌ | ✅ | ✅ |
| **Preview Deployments** | ✅ | ✅ | ✅ |
| **Custom Domains** | ✅ | ✅ | ✅ |
| **Edge Functions** | ✅ | ✅ | ✅ |
| **Cron Jobs** | ❌ | ✅ | ✅ |
| **Log Drains** | ❌ | ✅ | ✅ |
| **Support** | Community | Email | Priority + SLA |

### Add-Ons (Pro/Enterprise Only)

| Add-On | Use Case | Monthly Cost |
|--------|----------|--------------|
| **Vercel KV** (Redis) | Session storage, caching | $1/100K reads |
| **Vercel Postgres** | Relational database | $0.30/GB storage |
| **Vercel Blob** | File storage (images, videos) | $0.15/GB stored |
| **Edge Config** | Global feature flags | Free (limited) |
| **Monitoring** | Error tracking, APM | $10/seat |
| **WAF** | DDoS protection, bot blocking | Custom pricing |

### Current Tier Assessment

**Evidence of Pro Tier:**
```typescript
// src/app/api/dev/zip/route.ts:9
export const maxDuration = 60; // Only available on Pro+
```

**Team Organization ID:**
```json
// .vercel/project.json
{"orgId": "team_OnRhYT9YIEipDIeZwJEjbXD2"}
```

**Conclusion:** Project is on **Pro tier** ($20/month minimum)

### Tier Optimization Recommendations

**If staying on Pro tier:**
- ✅ Use extended function durations where needed
- ✅ Enable advanced analytics
- ✅ Configure cron jobs for maintenance
- ✅ Add Log Drains for centralized logging
- ⚠️ Consider Vercel KV for session storage (currently using Turso)
- ⚠️ Evaluate Vercel Monitoring vs Sentry

**If downgrading to Hobby (not recommended):**
- ❌ Would need to remove `/api/dev/zip` or reduce maxDuration to 10s
- ❌ Would lose team collaboration features
- ❌ Would lose advanced analytics
- ❌ Limited for production use

---

## Vertical Scaling Implementation

### Understanding Vertical Scaling on Vercel

Vercel's "vertical scaling" refers to allocating more resources (CPU, memory, time) to individual serverless functions rather than traditional server scaling.

**Controllable Parameters:**
1. **runtime** - Execution environment (nodejs, edge)
2. **maxDuration** - Maximum execution time (10s-900s depending on tier)
3. **memory** - RAM allocation (128MB-3008MB)
4. **regions** - Geographic deployment regions

### Route-by-Route Scaling Strategy

#### Critical Routes (Require Extended Resources)

**1. AI Processing Routes**

```typescript
// src/app/api/ask/route.ts
export const runtime = 'nodejs';
export const maxDuration = 60; // AI responses can take time
export const memory = 3008;    // Max memory for AI SDK

export async function POST(request: NextRequest) {
  // Anthropic Claude streaming
  // Needs: High memory, extended time
}
```

**2. File Processing Routes**

```typescript
// src/app/api/dev/zip/route.ts
export const runtime = 'nodejs';
export const maxDuration = 60; // Already configured
export const memory = 3008;    // ADD: For file processing + AI
```

**3. Payment Processing Routes**

```typescript
// src/app/api/checkout/route.ts
export const runtime = 'nodejs';
export const maxDuration = 30; // Stripe webhook processing
export const memory = 1024;    // Standard memory sufficient

// Stripe webhooks must respond within 30 seconds
```

#### Fast Routes (Edge Runtime Candidates)

**1. Authentication Routes**

```typescript
// src/app/api/auth/route.ts
export const runtime = 'edge'; // Fast cold start
export const regions = ['iad1', 'sfo1']; // Multi-region

// OAuth is I/O bound, benefits from edge deployment
```

**2. Content API Routes**

```typescript
// src/app/api/blog/route.ts
export const runtime = 'edge';
export const regions = ['iad1'];

// Static content delivery, edge is ideal
```

**3. Health Check Routes**

```typescript
// src/app/api/health/route.ts (CREATE)
export const runtime = 'edge';
export const regions = ['iad1', 'sfo1', 'fra1']; // Global health checks

export async function GET() {
  return Response.json({
    status: 'ok',
    region: process.env.VERCEL_REGION,
    timestamp: new Date().toISOString()
  });
}
```

#### Standard Routes (Default Settings Acceptable)

```typescript
// src/app/api/profile/route.ts
export const runtime = 'nodejs';
export const maxDuration = 10; // Free tier compatible
export const memory = 1024;    // Standard

// CRUD operations, database queries
```

### Creating vercel.json for Centralized Configuration

**Recommended vercel.json:**

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "npm run build",
  "framework": "nextjs",

  "functions": {
    "src/app/api/ask/route.ts": {
      "maxDuration": 60,
      "memory": 3008
    },
    "src/app/api/dev/zip/route.ts": {
      "maxDuration": 60,
      "memory": 3008
    },
    "src/app/api/checkout/route.ts": {
      "maxDuration": 30,
      "memory": 1024
    }
  },

  "regions": ["iad1"],

  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=63072000; includeSubDomains; preload"
        }
      ]
    }
  ],

  "redirects": [
    {
      "source": "/admin",
      "has": [
        {
          "type": "host",
          "value": "www.becomingdiamond.com"
        }
      ],
      "destination": "https://becomingdiamond.com/admin",
      "permanent": true
    }
  ],

  "crons": [
    {
      "path": "/api/cron/cleanup-sessions",
      "schedule": "0 0 * * *"
    },
    {
      "path": "/api/cron/send-digest",
      "schedule": "0 8 * * 1"
    }
  ]
}
```

### Regional Deployment Strategy

**Default Region:** `iad1` (US East, Virginia)

**Multi-Region Deployment (Pro tier):**

```typescript
// For global audience
export const regions = ['iad1', 'sfo1', 'cdg1', 'hnd1'];

// For US-only
export const regions = ['iad1', 'sfo1'];

// For critical endpoints (redundancy)
export const regions = ['iad1', 'sfo1', 'dub1'];
```

**Region Codes:**
- `iad1` - US East (Virginia)
- `sfo1` - US West (San Francisco)
- `cdg1` - Europe West (Paris)
- `dub1` - Europe West (Dublin)
- `hnd1` - Asia (Tokyo)
- `gru1` - South America (São Paulo)

---

## Resilience & Monitoring

### Current Gaps

**No Error Tracking:**
```typescript
// Current state: Errors only logged to console
catch (error) {
  await log.error('Error in /api/ask', 'API', error);
  // ❌ No external tracking
  // ❌ No alerting
  // ❌ No error aggregation
}
```

**No Health Checks:**
- No `/api/health` endpoint
- No uptime monitoring
- No dependency health verification

**No Rate Limiting:**
- All API routes unprotected
- Vulnerable to abuse
- No DDoS mitigation

**Limited Monitoring:**
- Only Vercel Speed Insights enabled
- No function execution metrics
- No database query monitoring
- No external service monitoring

### Recommended Monitoring Stack

#### Option 1: Vercel Native (Recommended for Simplicity)

**Vercel Monitoring ($10/seat/month):**
- Integrated error tracking
- Function execution metrics
- Real-time alerts
- No external dependencies

**Setup:**
```bash
# Enable in Vercel dashboard
Project Settings > Monitoring > Enable

# Or via CLI
vercel env add VERCEL_MONITORING_ENABLED true
```

**Instrumentation:**
```typescript
// src/app/layout.tsx
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SpeedInsights />
        <Analytics />
        {children}
      </body>
    </html>
  );
}
```

#### Option 2: Sentry (Recommended for Advanced Features)

**Sentry.io:**
- Advanced error tracking
- Performance monitoring
- Release tracking
- User feedback
- Free tier: 5,000 errors/month

**Installation:**
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

**Configuration:**
```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
});

// sentry.server.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1, // Lower sample rate for server
  environment: process.env.NODE_ENV,
});
```

**Usage in Routes:**
```typescript
import * as Sentry from "@sentry/nextjs";

export async function POST(request: NextRequest) {
  try {
    // ... route logic
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        endpoint: '/api/ask',
        method: 'POST',
      },
      extra: {
        requestId: request.headers.get('x-request-id'),
      },
    });
    throw error;
  }
}
```

### Health Check Implementation

**Create Health Check Endpoint:**

```typescript
// src/app/api/health/route.ts
import { NextResponse } from 'next/server';
import { checkDatabase, checkAnthropic, checkStripe } from '@/lib/health-checks';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

interface HealthCheck {
  name: string;
  healthy: boolean;
  latency?: number;
  error?: string;
}

export async function GET() {
  const checks: HealthCheck[] = [];
  let allHealthy = true;

  // Database check
  const dbStart = Date.now();
  try {
    await checkDatabase();
    checks.push({
      name: 'turso-database',
      healthy: true,
      latency: Date.now() - dbStart,
    });
  } catch (error) {
    allHealthy = false;
    checks.push({
      name: 'turso-database',
      healthy: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  // Anthropic API check
  const aiStart = Date.now();
  try {
    await checkAnthropic();
    checks.push({
      name: 'anthropic-api',
      healthy: true,
      latency: Date.now() - aiStart,
    });
  } catch (error) {
    allHealthy = false;
    checks.push({
      name: 'anthropic-api',
      healthy: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  // Stripe API check
  const stripeStart = Date.now();
  try {
    await checkStripe();
    checks.push({
      name: 'stripe-api',
      healthy: true,
      latency: Date.now() - stripeStart,
    });
  } catch (error) {
    // Stripe is non-critical, don't mark overall as unhealthy
    checks.push({
      name: 'stripe-api',
      healthy: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  return NextResponse.json(
    {
      status: allHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      region: process.env.VERCEL_REGION,
      version: process.env.VERCEL_GIT_COMMIT_SHA,
      checks,
    },
    { status: allHealthy ? 200 : 503 }
  );
}
```

**Health Check Utilities:**

```typescript
// src/lib/health-checks.ts
import { createClient } from '@libsql/client';
import Anthropic from '@anthropic-ai/sdk';
import Stripe from 'stripe';

export async function checkDatabase(): Promise<void> {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  await client.execute('SELECT 1');
}

export async function checkAnthropic(): Promise<void> {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
  });

  // Lightweight API check (doesn't count toward usage)
  await fetch('https://api.anthropic.com/v1/messages', {
    method: 'HEAD',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
  });
}

export async function checkStripe(): Promise<void> {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-12-18.acacia',
  });

  // List one product (minimal API call)
  await stripe.products.list({ limit: 1 });
}
```

### Rate Limiting Implementation

**Install Rate Limiter:**

```bash
npm install @upstash/ratelimit @upstash/redis
```

**Configure Upstash Redis (Free tier: 10K requests/day):**

1. Create account at upstash.com
2. Create Redis database
3. Add to `.env`:
```bash
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

**Create Rate Limiter Utility:**

```typescript
// src/lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Different limits for different routes
export const authRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
  analytics: true,
});

export const aiRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 AI requests per minute
  analytics: true,
});

export const apiRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
  analytics: true,
});
```

**Apply to Routes:**

```typescript
// src/app/api/ask/route.ts
import { aiRateLimiter } from '@/lib/rate-limit';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Get client IP
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';

  // Check rate limit
  const { success, limit, remaining, reset } = await aiRateLimiter.limit(ip);

  if (!success) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        limit,
        remaining,
        reset: new Date(reset).toISOString(),
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        },
      }
    );
  }

  // Continue with normal logic
  // ...
}
```

### Circuit Breaker Pattern

**Install Circuit Breaker:**

```bash
npm install opossum
```

**Implement for External Services:**

```typescript
// src/lib/circuit-breakers.ts
import CircuitBreaker from 'opossum';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// Circuit breaker options
const options = {
  timeout: 30000, // 30 seconds
  errorThresholdPercentage: 50, // Open circuit if 50% fail
  resetTimeout: 30000, // Try again after 30 seconds
};

// Wrap Anthropic calls in circuit breaker
export const anthropicCircuit = new CircuitBreaker(
  async (prompt: string) => {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    });
    return message;
  },
  options
);

// Event listeners
anthropicCircuit.on('open', () => {
  console.error('Circuit breaker opened - Anthropic API unavailable');
  // Send alert
});

anthropicCircuit.on('halfOpen', () => {
  console.warn('Circuit breaker half-open - Testing Anthropic API');
});

anthropicCircuit.on('close', () => {
  console.log('Circuit breaker closed - Anthropic API recovered');
});

// Usage in routes
export async function callAnthropic(prompt: string) {
  try {
    return await anthropicCircuit.fire(prompt);
  } catch (error) {
    if (anthropicCircuit.opened) {
      throw new Error('AI service temporarily unavailable');
    }
    throw error;
  }
}
```

### Uptime Monitoring Setup

**Option 1: Vercel Monitoring (Pro tier)**
- Automatic uptime checks
- 1-minute check intervals
- Email/Slack alerts
- No configuration needed

**Option 2: External Monitoring (Recommended for redundancy)**

**UptimeRobot (Free tier):**
- 50 monitors
- 5-minute intervals
- Email alerts

**Setup:**
1. Create account at uptimerobot.com
2. Add monitors:
   - `https://becomingdiamond.com/` (Main site)
   - `https://becomingdiamond.com/api/health` (Health check)
   - `https://becomingdiamond.com/app` (Member portal)

**Better Uptime (Paid, $10/mo):**
- 1-minute intervals
- Multi-region checks
- Status page hosting
- SMS alerts

---

## Performance Optimization

### Current Performance Metrics

**From PageSpeed Insights (docs/specs/performance/):**
- **Total Page Weight:** 4,795 KiB (Target: <2 MB)
- **JavaScript:** 420 KiB unused code
- **Images:** 3,130 KiB offscreen images loaded eagerly
- **Execution Time:** 6.5 seconds (Target: <3s)

### Image Optimization

**Current Configuration:**
```typescript
// next.config.ts
images: {
  formats: ['image/avif', 'image/webp'],
  minimumCacheTTL: 31536000, // 1 year
}
```

**Improvements Needed:**

1. **Convert CMS uploads to optimized formats:**
```typescript
// src/lib/image-optimizer.ts
import sharp from 'sharp';

export async function optimizeUpload(file: Buffer): Promise<Buffer> {
  return await sharp(file)
    .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
    .avif({ quality: 80 })
    .toBuffer();
}
```

2. **Add lazy loading to all images:**
```tsx
// Replace all <img> with Next.js Image
import Image from 'next/image';

<Image
  src="/uploads/hero.jpg"
  alt="Hero image"
  width={1920}
  height={1080}
  loading="lazy"
  placeholder="blur"
/>
```

### Caching Strategy

**Static Assets (Already Optimized):**
```
Cache-Control: public, max-age=31536000, immutable
```

**API Routes (Need Configuration):**

```typescript
// src/app/api/blog/route.ts
export async function GET() {
  const posts = await getContentByType('blog');

  return NextResponse.json(posts, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
```

**ISR for Content Pages:**

```typescript
// src/app/news/[slug]/page.tsx
export const revalidate = 3600; // Revalidate every hour

export async function generateStaticParams() {
  const news = await getContentByType('news');
  return news.map((item) => ({ slug: item.slug }));
}
```

### Bundle Size Optimization

**Current Issues:**
- Stripe SDK loaded on all pages (202.3 KiB)
- Unused JavaScript: 420 KiB

**Solution - Code Splitting:**

```typescript
// src/components/StripeCheckout.tsx
import dynamic from 'next/dynamic';

// Lazy load Stripe only on checkout page
const StripeElements = dynamic(
  () => import('@stripe/react-stripe-js').then(mod => mod.Elements),
  { ssr: false }
);

// Usage
export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <StripeElements>{/* ... */}</StripeElements>
    </Suspense>
  );
}
```

**Analyze Bundle:**

```bash
# Install analyzer
npm install @next/bundle-analyzer

# next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);

# Run analysis
ANALYZE=true npm run build
```

### Database Query Optimization

**Add Connection Pooling:**

```typescript
// src/lib/db.ts
import { createClient } from '@libsql/client';

let client: ReturnType<typeof createClient> | null = null;

export function getDb() {
  if (!client) {
    client = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });
  }
  return client;
}

// Usage in routes
export async function GET() {
  const db = getDb(); // Reuses connection
  const result = await db.execute('SELECT * FROM users');
  return NextResponse.json(result.rows);
}
```

**Add Query Timeouts:**

```typescript
// Wrap queries with timeout
export async function queryWithTimeout<T>(
  query: Promise<T>,
  timeoutMs: number = 5000
): Promise<T> {
  return Promise.race([
    query,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Query timeout')), timeoutMs)
    ),
  ]);
}

// Usage
const result = await queryWithTimeout(
  db.execute('SELECT * FROM large_table'),
  10000 // 10 second timeout
);
```

---

## Security Hardening

### Security Headers

**Add to vercel.json:**

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-DNS-Prefetch-Control",
          "value": "on"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=63072000; includeSubDomains; preload"
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    },
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "X-Robots-Tag",
          "value": "noindex, nofollow"
        }
      ]
    }
  ]
}
```

### Content Security Policy

**Add CSP Header:**

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' js.stripe.com",
    "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' fonts.gstatic.com",
    "connect-src 'self' *.anthropic.com api.stripe.com",
    "frame-src 'self' js.stripe.com",
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);
  return response;
}
```

### API Key Rotation

**Environment Variable Management:**

```bash
# Development
.env.local

# Production (Vercel Dashboard)
Settings > Environment Variables

# Staging
Settings > Environment Variables > Preview
```

**Key Rotation Schedule:**
- **Anthropic API Key:** Rotate every 90 days
- **Stripe API Key:** Rotate annually (or on breach)
- **GitHub OAuth Secret:** Rotate annually
- **Database Auth Token:** Rotate every 180 days
- **Session Secret:** Rotate every 30 days

**Rotation Script:**

```typescript
// scripts/rotate-keys.ts
import { execSync } from 'child_process';

const keys = [
  'ANTHROPIC_API_KEY',
  'STRIPE_SECRET_KEY',
  'TURSO_AUTH_TOKEN',
];

for (const key of keys) {
  console.log(`Rotating ${key}...`);

  // 1. Generate new key from service
  const newKey = generateNewKey(key);

  // 2. Add to Vercel with suffix
  execSync(`vercel env add ${key}_NEW production`, {
    input: newKey,
  });

  // 3. Deploy with new key
  execSync('vercel deploy --prod');

  // 4. Test deployment
  const healthy = await checkHealth();

  if (healthy) {
    // 5. Remove old key
    execSync(`vercel env rm ${key} production`);
    execSync(`vercel env rename ${key}_NEW ${key} production`);
    console.log(`✅ ${key} rotated successfully`);
  } else {
    console.error(`❌ ${key} rotation failed - rolling back`);
    execSync(`vercel env rm ${key}_NEW production`);
  }
}
```

### DDoS Protection

**Vercel WAF (Enterprise tier):**
- Layer 7 DDoS protection
- Bot detection
- Rate limiting at edge
- Custom rules

**Alternative - Cloudflare (Free tier):**
1. Add domain to Cloudflare
2. Point DNS to Cloudflare
3. Add Vercel as origin
4. Enable:
   - DDoS protection (automatic)
   - Bot fight mode
   - Rate limiting rules
   - Challenge pages

---

## Action Plan

### Phase 1: Critical Infrastructure (Week 1)

**Priority: P0 - Production Stability**

- [ ] **Day 1-2: Monitoring Setup**
  - [ ] Add Sentry error tracking
  - [ ] Configure Vercel Speed Insights (already installed)
  - [ ] Set up UptimeRobot monitoring
  - [ ] Create `/api/health` endpoint
  - [ ] Configure alerting (email + Slack)

- [ ] **Day 3-4: Rate Limiting**
  - [ ] Set up Upstash Redis (free tier)
  - [ ] Implement rate limiting on `/api/ask`
  - [ ] Implement rate limiting on `/api/auth`
  - [ ] Implement rate limiting on `/api/checkout`
  - [ ] Test rate limits

- [ ] **Day 5: Runtime Configuration**
  - [ ] Add runtime config to all API routes
  - [ ] Create vercel.json with function configs
  - [ ] Document tier requirements
  - [ ] Test deployment

**Deliverables:**
- ✅ Error tracking active
- ✅ Health checks responding
- ✅ Rate limits protecting critical endpoints
- ✅ All API routes explicitly configured

### Phase 2: Resilience & Scaling (Week 2)

**Priority: P1 - Operational Excellence**

- [ ] **Day 1-2: Circuit Breakers**
  - [ ] Implement circuit breaker for Anthropic API
  - [ ] Implement circuit breaker for Stripe API
  - [ ] Add fallback responses
  - [ ] Test failure scenarios

- [ ] **Day 3-4: Performance Optimization**
  - [ ] Analyze bundle with webpack-bundle-analyzer
  - [ ] Implement code splitting for Stripe
  - [ ] Add ISR to content pages
  - [ ] Optimize database queries

- [ ] **Day 5: Documentation**
  - [ ] Document all runtime configurations
  - [ ] Create runbook for common issues
  - [ ] Update deployment documentation

**Deliverables:**
- ✅ External services fault-tolerant
- ✅ Bundle size reduced by 200+ KiB
- ✅ Content pages use ISR
- ✅ Operations documentation complete

### Phase 3: Advanced Features (Week 3-4)

**Priority: P2 - Enhancement**

- [ ] **Week 3: Caching Layer**
  - [ ] Evaluate Vercel KV vs Redis
  - [ ] Implement session caching
  - [ ] Add API response caching
  - [ ] Measure performance improvement

- [ ] **Week 4: Security Hardening**
  - [ ] Add security headers
  - [ ] Implement CSP
  - [ ] Set up key rotation schedule
  - [ ] Security audit

**Deliverables:**
- ✅ Caching layer operational
- ✅ Security score 90+
- ✅ Key rotation automated
- ✅ Security documentation complete

### Success Metrics

| Metric | Current | Target | Deadline |
|--------|---------|--------|----------|
| Error tracking coverage | 0% | 100% | Week 1 |
| API rate limit coverage | 0% | 100% | Week 1 |
| Health check uptime | 0% | 99.9% | Week 1 |
| Bundle size | 118MB | <90MB | Week 2 |
| Page load time | Unknown | <2s | Week 2 |
| Error response time | N/A | <5min | Week 1 |
| Security score | Unknown | 90+ | Week 3 |

---

## Best Practices

### Runtime Configuration

**Always specify runtime explicitly:**
```typescript
// ✅ Good
export const runtime = 'nodejs';
export const maxDuration = 10;
export const memory = 1024;

// ❌ Bad - relies on defaults
export async function GET() { /* ... */ }
```

**Choose runtime based on workload:**
- **Edge:** Static content, auth, redirects, simple APIs
- **Node.js:** Database queries, AI processing, file operations

### Error Handling

**Structured error responses:**
```typescript
interface ErrorResponse {
  error: string;
  code: string;
  requestId: string;
  timestamp: string;
}

export async function POST(request: NextRequest) {
  try {
    // ... logic
  } catch (error) {
    const errorResponse: ErrorResponse = {
      error: error instanceof Error ? error.message : 'Unknown error',
      code: 'INTERNAL_ERROR',
      requestId: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };

    // Log to Sentry
    Sentry.captureException(error, {
      extra: errorResponse,
    });

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
```

### Caching

**Cache-Control patterns:**

```typescript
// Static data (rarely changes)
headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate' }

// Dynamic data (changes frequently)
headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=3600' }

// Private data (user-specific)
headers: { 'Cache-Control': 'private, max-age=0, must-revalidate' }

// No cache (sensitive data)
headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
```

### Deployment

**Pre-deployment checklist:**
- [ ] Run `npm run build` locally
- [ ] Run `npm run lint`
- [ ] Test critical user flows
- [ ] Verify environment variables in Vercel dashboard
- [ ] Check health endpoint
- [ ] Review deployment logs

**Post-deployment checklist:**
- [ ] Verify deployment status in Vercel dashboard
- [ ] Check `/api/health` endpoint
- [ ] Monitor error tracking for new issues
- [ ] Test critical features (auth, payments)
- [ ] Verify analytics tracking

---

## Troubleshooting

### Common Issues

#### 1. Function Timeout (FUNCTION_INVOCATION_TIMEOUT)

**Symptoms:**
```
Error: Function execution timed out after 10s
```

**Cause:** Function exceeded configured maxDuration

**Solutions:**
```typescript
// Option 1: Increase timeout (Pro tier required for >10s)
export const maxDuration = 60;

// Option 2: Optimize function (reduce work)
// - Move to background job
// - Paginate results
// - Use streaming response

// Option 3: Switch to edge runtime (faster cold start)
export const runtime = 'edge';
```

#### 2. Out of Memory (FUNCTION_INVOCATION_FAILED)

**Symptoms:**
```
Error: JavaScript heap out of memory
```

**Cause:** Function exceeded memory limit

**Solutions:**
```typescript
// Option 1: Increase memory (Pro tier)
export const memory = 3008;

// Option 2: Optimize memory usage
// - Stream responses instead of buffering
// - Use generators for large datasets
// - Clear large objects after use
let largeObject = processData();
// ... use object
largeObject = null; // Free memory

// Option 3: Process in chunks
for await (const chunk of largeDataset) {
  process(chunk);
}
```

#### 3. Rate Limit Exceeded

**Symptoms:**
```json
{ "error": "Rate limit exceeded", "status": 429 }
```

**Cause:** Too many requests from single IP

**Solutions:**
```typescript
// Option 1: Increase rate limit
export const apiRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1000, '1 m'), // Increased
});

// Option 2: Use authenticated rate limiting
const identifier = user?.id ?? ip; // Higher limits for authenticated users

// Option 3: Implement tiered limits
const limit = user?.tier === 'pro' ? 1000 : 100;
```

#### 4. Health Check Failing

**Symptoms:**
```json
{ "status": "degraded", "checks": [{ "name": "database", "healthy": false }] }
```

**Cause:** Dependency unavailable

**Solutions:**
1. Check dependency status pages
2. Verify environment variables
3. Test connection manually:
```bash
curl -v https://api.anthropic.com
```
4. Implement fallback:
```typescript
if (!checks.database.healthy) {
  // Serve from cache
  return getCachedData();
}
```

#### 5. High Error Rate

**Symptoms:** Sentry shows spike in errors

**Investigation:**
1. Check Sentry dashboard for common errors
2. Review recent deployments
3. Check external service status
4. Review function logs in Vercel

**Response:**
```bash
# Rollback to previous deployment
vercel rollback

# Or redeploy specific commit
vercel deploy --prod --yes
```

### Debugging Tools

**Vercel CLI:**
```bash
# View real-time logs
vercel logs --follow

# View deployment info
vercel inspect <deployment-url>

# List environment variables
vercel env ls

# Pull environment variables locally
vercel env pull .env.local
```

**Local Testing:**
```bash
# Run production build locally
npm run build
npm start

# Test specific route
curl http://localhost:3000/api/health

# Load test
ab -n 1000 -c 10 http://localhost:3000/api/health
```

---

## Appendix

### Environment Variables Reference

**Required:**
```bash
# Database
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...

# Authentication
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://becomingdiamond.com

# AI
ANTHROPIC_API_KEY=...

# Payments
STRIPE_SECRET_KEY=...
STRIPE_PUBLISHABLE_KEY=...
STRIPE_WEBHOOK_SECRET=...

# Email
RESEND_API_KEY=...
```

**Optional (Recommended):**
```bash
# Monitoring
SENTRY_DSN=...
SENTRY_AUTH_TOKEN=...

# Rate Limiting
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...

# Analytics
VERCEL_ANALYTICS_ID=... (auto-set by Vercel)
```

### Useful Links

**Vercel Documentation:**
- [Function Configuration](https://vercel.com/docs/functions/serverless-functions)
- [Edge Functions](https://vercel.com/docs/functions/edge-functions)
- [Monitoring](https://vercel.com/docs/observability)
- [Rate Limiting](https://vercel.com/docs/edge-network/rate-limiting)

**External Services:**
- [Sentry Next.js Setup](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Upstash Redis](https://docs.upstash.com/redis)
- [UptimeRobot](https://uptimerobot.com/)

**Performance:**
- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Web Vitals](https://web.dev/vitals/)
- [Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)

---

## Changelog

**Version 1.0 (2025-10-16)**
- Initial document creation
- Comprehensive audit of current deployment
- Tier analysis and recommendations
- 3-phase implementation plan
- Best practices and troubleshooting guide
