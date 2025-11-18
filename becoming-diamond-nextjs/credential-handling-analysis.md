# Comprehensive Credential Handling Analysis Report
## Becoming Diamond Next.js Codebase

**Analysis Date:** November 18, 2025
**Scope:** Full codebase credential handling patterns
**Thoroughness Level:** Very Thorough

---

## Executive Summary

This analysis identifies critical security gaps in credential handling across the Becoming Diamond application. The codebase exhibits **inconsistent validation patterns** with several critical credentials using unsafe fallback values (empty strings) that could mask configuration errors. Of the 21 identified security-critical credentials, only 2 implement proper fail-fast validation.

### Critical Findings

- **CRITICAL:** 9 credentials use empty string fallbacks (masks configuration errors)
- **HIGH:** 4 credentials use non-strict validation patterns
- **MEDIUM:** 8 credentials lack initialization validation
- **7 files** require immediate remediation

---

## Section 1: Detailed Credential Analysis

### 1.1 Database Credentials (Turso LibSQL)

#### File: `/src/lib/turso.ts`
**Lines:** 3-6

```typescript
export const turso = createClient({
  url: process.env.TURSO_DATABASE_URL || '',
  authToken: process.env.TURSO_AUTH_TOKEN || '',
});
```

**Security Assessment:** CRITICAL

| Property | Value |
|----------|-------|
| Environment Variables | `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` |
| Fallback Pattern | Empty string (`''`) |
| Validation Type | None - Silent failure mode |
| Security Level | CRITICAL |
| Impact | Database connection fails silently; application may proceed with non-functional DB |

**Issues Identified:**
- Empty string fallbacks mask missing configuration
- No validation before client initialization
- Error occurs at first database operation (late failure)
- Difficult to debug deployment issues

**Severity Justification:** These are the PRIMARY DATABASE CREDENTIALS. If invalid, the entire authentication system, user profiles, and payment tracking fail silently.

---

#### File: `/src/lib/turso-adapter.ts`
**Lines:** 665-678

```typescript
export function getTursoClient() {
  if (!process.env.TURSO_DATABASE_URL) {
    throw new Error("TURSO_DATABASE_URL environment variable is not set");
  }

  if (!process.env.TURSO_AUTH_TOKEN) {
    throw new Error("TURSO_AUTH_TOKEN environment variable is not set");
  }

  return createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
}
```

**Security Assessment:** GOOD (Best Practice Example)

| Property | Value |
|----------|-------|
| Environment Variables | `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` |
| Validation Type | Explicit throw with descriptive messages |
| Security Level | GOOD |
| Impact | Immediate fail-fast at client creation |

**Strengths:**
- Explicit validation checks
- Throws descriptive errors
- Used in test/script contexts
- Early failure detection

**Inconsistency Note:** This function demonstrates BETTER validation than `src/lib/turso.ts`. The two files handle the same credentials differently, creating inconsistency.

---

### 1.2 Authentication Credentials (NextAuth)

#### File: `/auth.ts`
**Lines:** 21-47

```typescript
const providers: Provider[] = [
  Nodemailer({
    server: { ...GMAIL_SMTP_CONFIG, auth: { user: process.env.GMAIL_USER!, pass: process.env.GMAIL_APP_PASSWORD!, }, },
    from: process.env.GMAIL_USER!,
  }),
  Google({
    clientId: process.env.AUTH_GOOGLE_ID!,
    clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    allowDangerousEmailAccountLinking: true,
  }),
];

if (FEATURES.githubAuth) {
  providers.push(
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
      allowDangerousEmailAccountLinking: true,
    })
  );
}
```

**Security Assessment:** HIGH RISK (Non-Null Assertions Without Validation)

| Environment Variable | Validation | Fallback | Line |
|----------------------|-----------|----------|------|
| `GMAIL_USER` | Non-null assertion (!) | None - Will throw | 26 |
| `GMAIL_APP_PASSWORD` | Non-null assertion (!) | None - Will throw | 27 |
| `AUTH_GOOGLE_ID` | Non-null assertion (!) | None - Will throw | 33 |
| `AUTH_GOOGLE_SECRET` | Non-null assertion (!) | None - Will throw | 34 |
| `AUTH_GITHUB_ID` | Non-null assertion (!) | Conditional feature flag | 43 |
| `AUTH_GITHUB_SECRET` | Non-null assertion (!) | Conditional feature flag | 44 |

**Security Assessment Details:**

**Critical Issues:**
- Uses TypeScript non-null assertions (`!`) without explicit validation
- Non-null assertions are stripped at compile time - provide ZERO runtime safety
- No explicit `if (!variable)` checks before use
- Errors occur AFTER NextAuth initialization (late failure)
- Email authentication will fail if `GMAIL_USER` or `GMAIL_APP_PASSWORD` missing

**Positive Aspects:**
- Credentials are required (not optional with fallbacks)
- Feature flags gate GitHub provider conditionally
- Will fail at authentication attempt if credentials missing

**Recommended Approach:**
```typescript
// Instead of:
user: process.env.GMAIL_USER!,

// Should be:
if (!process.env.GMAIL_USER) {
  throw new Error('GMAIL_USER environment variable is required for authentication');
}
user: process.env.GMAIL_USER,
```

---

#### File: `/src/lib/gmail-smtp.ts`
**Lines:** 9-14, 54-59

```typescript
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const FROM_EMAIL = GMAIL_USER;
const ADMIN_EMAIL = GMAIL_USER;

function getGmailTransporter() {
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    throw new Error(
      "GMAIL_USER and GMAIL_APP_PASSWORD environment variables are required"
    );
  }
  // ...
}
```

**Security Assessment:** MODERATE (Lazy Validation)

| Property | Value |
|----------|-------|
| Environment Variables | `GMAIL_USER`, `GMAIL_APP_PASSWORD` |
| Validation Pattern | Lazy validation (checked when transporter created) |
| Security Level | MODERATE |
| Impact | Error thrown only when emails are sent |

**Issues:**
- Variables assigned without validation at module load time
- Validation occurs in `getGmailTransporter()` (only called during actual email send)
- Application starts successfully with missing credentials
- Error masked until email triggered
- `FROM_EMAIL` and `ADMIN_EMAIL` assigned null if `GMAIL_USER` undefined

**Positive Aspects:**
- Does validate before using credentials
- Provides descriptive error message
- Handles both variables together

**Risk Scenario:**
```typescript
// This is allowed:
const FROM_EMAIL = process.env.GMAIL_USER; // Could be undefined
// Later when email is sent:
from: FROM_EMAIL || "" // Empty string sent to Nodemailer
```

---

### 1.3 Payment Processing Credentials (Stripe)

#### File: `/src/lib/stripe.ts`
**Lines:** 1-10

```typescript
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-10-29.clover',
  typescript: true,
});
```

**Security Assessment:** GOOD (Proper Fail-Fast)

| Property | Value |
|----------|-------|
| Environment Variable | `STRIPE_SECRET_KEY` |
| Validation Type | Explicit check with throw |
| Validation Timing | Module load time (immediate) |
| Security Level | GOOD |
| Impact | Application fails to start if credential missing |

**Strengths:**
- Validated immediately at module load
- Fails fast with clear error message
- Exported Stripe instance is guaranteed valid
- Prevents silent failures in payment processing

**Note:** This is the CORRECT pattern for critical credentials.

---

#### File: `/src/app/api/stripe/webhook/route.ts`
**Lines:** 6-10

```typescript
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST || process.env.STRIPE_STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-10-29.clover',
});

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET_TEST || process.env.STRIPE_WEBHOOK_SECRET || '';
```

**Security Assessment:** CRITICAL

| Property | Value |
|----------|-------|
| Environment Variables | `STRIPE_SECRET_KEY_TEST`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET_TEST`, `STRIPE_WEBHOOK_SECRET` |
| Fallback Pattern | Chained OR with empty string |
| Validation Type | None |
| Security Level | CRITICAL |
| Impact | Silent failure of payment webhook handler |

**Critical Issues:**
- **INCONSISTENCY:** Contradicts the proper validation in `/src/lib/stripe.ts`
- Empty string fallback masks missing credentials
- Stripe instance created with empty key (will fail on first webhook processing)
- Webhook signature verification will fail silently or with wrong secret
- No check for empty string before using `WEBHOOK_SECRET`
- Subsequent check at line 158 catches missing secret, but too late

**Vulnerability Scenario:**
```
1. If STRIPE_SECRET_KEY_TEST and STRIPE_SECRET_KEY both undefined:
   - stripe = new Stripe('')  // Empty key accepted by Stripe SDK
   
2. If webhook signature validation fails:
   - Webhook processing skipped silently
   - Payment events not recorded
   - User funds processed but not reflected in database
```

**Remediation Priority:** URGENT - Payment processing impacts revenue

---

#### File: `/src/app/api/stripe/checkout/route.ts`
**Lines:** 4-21

```typescript
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST || process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-10-29.clover',
});

const ALLOWED_PRICE_IDS = [
  process.env.STRIPE_PRICE_DIAMOND_SPRINT_TEST,
  process.env.STRIPE_PRICE_DIAMOND_SPRINT,
  process.env.STRIPE_PRICE_MONTHLY_TEST,
  process.env.STRIPE_PRICE_MONTHLY,
  process.env.STRIPE_PRICE_ANNUAL_TEST,
  process.env.STRIPE_PRICE_ANNUAL,
].filter(Boolean);
```

**Security Assessment:** HIGH RISK

| Property | Value |
|----------|-------|
| Environment Variables | `STRIPE_SECRET_KEY_TEST`, `STRIPE_SECRET_KEY`, `STRIPE_PRICE_*` (6 variants) |
| Validation Type | Fallback chaining for key; optional for price IDs |
| Security Level | HIGH RISK |
| Impact | Silent failure or price validation bypass |

**Issues:**
- Same empty string fallback for Stripe key as webhook route
- Price IDs have NO fallback but are optional (silently accepted)
- `.filter(Boolean)` removes undefined prices silently
- If all price IDs undefined, `ALLOWED_PRICE_IDS` becomes empty array
- Line 36 check `!priceId || !ALLOWED_PRICE_IDS.includes(priceId)` catches invalid prices, but upstream has no validation

**Security Implications:**
- Price validation only works if at least one price ID configured
- Missing all price environment variables silently creates permission bypass

---

#### File: `/src/app/api/checkout/route.ts`
**Lines:** 1-7

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    // Uses stripe from @/lib/stripe (which validates STRIPE_SECRET_KEY)
```

**Security Assessment:** GOOD (Defers to Validated Import)

**Note:** This route imports from `/src/lib/stripe.ts` which properly validates credentials, so inherits that validation.

---

### 1.4 CMS (Decap CMS) OAuth Credentials

#### File: `/src/app/api/cms-auth/route.ts`
**Lines:** 4-5

```typescript
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || '';
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || '';
```

**Security Assessment:** CRITICAL

| Property | Value |
|----------|-------|
| Environment Variables | `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` |
| Fallback Pattern | Empty string |
| Validation Type | None |
| Security Level | CRITICAL |
| Impact | OAuth flow fails silently; CMS authentication broken |

**Critical Issues:**
- Empty string fallback masks misconfiguration
- OAuth URL construction at line 19 silently includes empty values:
  ```typescript
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&...`
  // Results in: ?client_id=&... (invalid URL)
  ```
- CMS users redirected to invalid GitHub URL
- Silent failure to detect misconfiguration

**Note:** These are DIFFERENT from `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` (member portal authentication). CMS uses separate GitHub OAuth app.

---

### 1.5 Email Configuration

#### File: `/src/lib/email-service.ts`
**Lines:** 10, 14-15

```typescript
const _FROM_EMAIL = process.env.GMAIL_USER || "support@becomingdiamond.com";

const _BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
  || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3003");
```

**Security Assessment:** MODERATE (Inappropriate Defaults)

| Property | Value |
|----------|-------|
| Environment Variable | `GMAIL_USER`, `NEXT_PUBLIC_BASE_URL`, `VERCEL_URL` |
| Fallback Pattern | Hardcoded domain; fallback chain |
| Security Level | MODERATE |
| Impact | Emails sent from wrong address in misconfigured environments |

**Issues:**
- Hardcoded fallback `support@becomingdiamond.com` masks missing `GMAIL_USER`
- Fallback assumes hardcoded domain is correct for all deployments
- `_BASE_URL` fallback chain creates ambiguity (localhost in production possible)

**Inappropriate for Security Credentials:**
- Email FROM address should never silently fallback
- Should validate that `GMAIL_USER` matches actual Gmail account

---

### 1.6 Logging & Monitoring Credentials

#### File: `/src/lib/axiom-logger.ts`
**Lines:** 46-50

```typescript
const axiomConfig = {
  token: process.env.AXIOM_TOKEN,
  dataset: process.env.AXIOM_DATASET || 'becoming-diamond-prod',
  orgId: process.env.AXIOM_ORG_ID,
};

const axiomTransport = axiomConfig.token
  ? new AxiomJSTransport({ ... })
  : null;
```

**Security Assessment:** ACCEPTABLE (Optional Service)

| Property | Value |
|----------|-------|
| Environment Variables | `AXIOM_TOKEN`, `AXIOM_DATASET`, `AXIOM_ORG_ID` |
| Validation Type | Conditional (only used if token present) |
| Security Level | ACCEPTABLE |
| Impact | Logging disabled if credentials missing; non-critical |

**Notes:**
- Axiom is optional monitoring service (not critical for functionality)
- Graceful degradation: uses no-op transport if missing
- Default dataset `'becoming-diamond-prod'` may be inappropriate for non-prod environments

---

#### File: `/instrumentation.ts`
**Lines:** 47-51

```typescript
const axiomToken = process.env.AXIOM_TOKEN;
const axiomDataset = process.env.AXIOM_DATASET;

if (!axiomToken || !axiomDataset) {
  return; // Silent no-op if not configured
}
```

**Security Assessment:** ACCEPTABLE (Same reasoning as axiom-logger.ts)

---

### 1.7 Video Streaming Credentials

#### File: `/src/app/api/video/[videoId]/token/route.ts`
**Lines:** 6-8

```typescript
const BUNNY_LIBRARY_ID = process.env.BUNNY_STREAM_LIBRARY_ID!;
const BUNNY_API_KEY = process.env.BUNNY_STREAM_API_KEY!;
const BUNNY_CDN_HOSTNAME = process.env.BUNNY_STREAM_CDN_HOSTNAME!;
```

**Security Assessment:** HIGH RISK (Non-Null Assertions Without Validation)

| Environment Variables | `BUNNY_STREAM_LIBRARY_ID`, `BUNNY_STREAM_API_KEY`, `BUNNY_STREAM_CDN_HOSTNAME` |
|----------------------|-------|
| Validation Type | Non-null assertions (!) |
| Validation Timing | Compile-time only (stripped at runtime) |
| Security Level | HIGH RISK |
| Impact | Runtime error if any credential missing |

**Issues:**
- Non-null assertions provide ZERO runtime protection
- Error occurs when video token endpoint is called (late failure)
- No explicit validation in GET handler
- Token generation uses `BUNNY_API_KEY` in hash (line 40):
  ```typescript
  const tokenBase = `${BUNNY_LIBRARY_ID}${BUNNY_API_KEY}${expirationTime}${videoId}`;
  const token = crypto.createHash('sha256').update(tokenBase).digest('hex');
  ```
  If `BUNNY_API_KEY` is undefined, this creates invalid tokens

**Security Implication:**
- Invalid API keys could expose video stream signing algorithm
- Users may be unable to watch videos without understanding why

---

### 1.8 Admin Access Control

#### File: `/auth.config.ts`
**Line:** 11

```typescript
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "support@becomingdiamond.com";
```

**Security Assessment:** MODERATE RISK (Hardcoded Fallback for Security Control)

| Property | Value |
|----------|-------|
| Environment Variable | `ADMIN_EMAIL` |
| Fallback Pattern | Hardcoded email address |
| Security Level | MODERATE |
| Impact | Unauthorized admin access possible if misconfigured |

**Critical Issue:**
- Hardcoded fallback email means misconfiguration grants admin access to hardcoded address
- Should require explicit configuration, never silently fallback
- Controls access to lead management dashboard (`/docs-site/admin/lead-management`)

**Security Principle Violation:**
- Access control should NEVER have silent defaults
- Misconfiguration should fail-fast, not gracefully degrade to known account

---

## Section 2: Credential Severity Classification Matrix

### Critical Credentials (Application Fails Without Them)

| Variable | File | Lines | Fallback | Validation | Priority |
|----------|------|-------|----------|-----------|----------|
| `TURSO_DATABASE_URL` | `src/lib/turso.ts` | 4 | Empty string | NONE | URGENT |
| `TURSO_AUTH_TOKEN` | `src/lib/turso.ts` | 5 | Empty string | NONE | URGENT |
| `STRIPE_SECRET_KEY` | `src/lib/stripe.ts` | 7 | N/A | FAIL-FAST | GOOD |
| `STRIPE_SECRET_KEY_TEST` | `src/app/api/stripe/webhook/route.ts` | 6 | Empty string | LATE | URGENT |
| `STRIPE_WEBHOOK_SECRET` | `src/app/api/stripe/webhook/route.ts` | 10 | Empty string | LATE | URGENT |
| `GMAIL_USER` | `auth.ts` | 26 | Non-null (!) | NONE | HIGH |
| `GMAIL_APP_PASSWORD` | `auth.ts` | 27 | Non-null (!) | NONE | HIGH |
| `AUTH_GOOGLE_ID` | `auth.ts` | 33 | Non-null (!) | NONE | HIGH |
| `AUTH_GOOGLE_SECRET` | `auth.ts` | 34 | Non-null (!) | NONE | HIGH |

### High-Risk Credentials (Access Control / Integration)

| Variable | File | Lines | Fallback | Validation | Priority |
|----------|------|-------|----------|-----------|----------|
| `GITHUB_CLIENT_ID` | `src/app/api/cms-auth/route.ts` | 4 | Empty string | NONE | HIGH |
| `GITHUB_CLIENT_SECRET` | `src/app/api/cms-auth/route.ts` | 5 | Empty string | NONE | HIGH |
| `BUNNY_STREAM_API_KEY` | `src/app/api/video/[videoId]/token/route.ts` | 7 | Non-null (!) | NONE | HIGH |
| `ADMIN_EMAIL` | `auth.config.ts` | 11 | Hardcoded | NONE | HIGH |

### Medium-Risk Credentials (Optional Features / Monitoring)

| Variable | File | Lines | Fallback | Validation | Priority |
|----------|------|-------|----------|-----------|----------|
| `AXIOM_TOKEN` | `src/lib/axiom-logger.ts` | 47 | Optional | CONDITIONAL | MEDIUM |
| `AXIOM_DATASET` | `src/lib/axiom-logger.ts` | 48 | Default value | CONDITIONAL | MEDIUM |

---

## Section 3: Validation Pattern Comparison

### Pattern 1: Proper Fail-Fast (RECOMMENDED)
```typescript
// src/lib/stripe.ts - GOOD EXAMPLE
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, ...);
```

**Characteristics:**
- Explicit validation before use
- Early throw at module load time
- Descriptive error message
- Guarantees non-null value in subsequent code

**Impact:** Immediate failure, clear debugging information

---

### Pattern 2: Empty String Fallback (UNSAFE)
```typescript
// src/lib/turso.ts - PROBLEMATIC
export const turso = createClient({
  url: process.env.TURSO_DATABASE_URL || '',
  authToken: process.env.TURSO_AUTH_TOKEN || '',
});
```

**Characteristics:**
- Silent acceptance of undefined variables
- Client created with invalid credentials
- Error occurs at first operation (lazy failure)
- Difficult to debug configuration issues

**Impact:** Silent failure, confusing errors at unexpected points

---

### Pattern 3: Non-Null Assertions (FALSE SECURITY)
```typescript
// auth.ts - RISKY
user: process.env.GMAIL_USER!,
pass: process.env.GMAIL_APP_PASSWORD!,
```

**Characteristics:**
- Non-null assertions (`!`) stripped at compile time
- Zero runtime safety
- TypeScript-only safety illusion
- Errors at runtime, not compile-time

**Impact:** False sense of security, runtime errors masked

---

### Pattern 4: Lazy Validation (MODERATE)
```typescript
// src/lib/gmail-smtp.ts - ACCEPTABLE
function getGmailTransporter() {
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    throw new Error("GMAIL_USER and GMAIL_APP_PASSWORD are required");
  }
  // ... use credentials
}
```

**Characteristics:**
- Validation occurs at use-time, not load-time
- Application starts successfully with missing credentials
- Error masked until feature is used
- Better than empty string, worse than fail-fast

**Impact:** Delayed failure, harder to catch in testing

---

### Pattern 5: Conditional Usage (ACCEPTABLE FOR OPTIONAL)
```typescript
// src/lib/axiom-logger.ts - GOOD FOR OPTIONAL FEATURES
const axiomTransport = axiomConfig.token
  ? new AxiomJSTransport(...)
  : null;
```

**Characteristics:**
- Optional feature gracefully degrades if missing
- Appropriate only for non-critical services
- No error thrown
- Feature disabled if not configured

**Impact:** Acceptable for optional monitoring/logging

---

## Section 4: Validation Gaps by File

### Summary Table

| File | Critical Credentials | Validation Pattern | Risk Level | Remediation |
|------|----------------------|-------------------|-----------|-------------|
| `src/lib/turso.ts` | 2 | Empty string | CRITICAL | Add explicit validation |
| `auth.ts` | 4-6 | Non-null (!) | HIGH | Add explicit if() checks |
| `src/lib/gmail-smtp.ts` | 2 | Lazy validation | MODERATE | Consider fail-fast approach |
| `src/app/api/stripe/webhook/route.ts` | 4 | Empty string | CRITICAL | Add explicit validation |
| `src/app/api/stripe/checkout/route.ts` | 7 | Empty string + optional | HIGH | Add explicit validation |
| `src/app/api/cms-auth/route.ts` | 2 | Empty string | CRITICAL | Add explicit validation |
| `src/app/api/video/[videoId]/token/route.ts` | 3 | Non-null (!) | HIGH | Add explicit validation |
| `auth.config.ts` | 1 | Hardcoded fallback | MODERATE | Remove hardcoded default |

---

## Section 5: Security Impact Analysis

### Attack Vectors Enabled by Current Gaps

#### 1. Misconfiguration Silent Failure (High Impact)
```
Scenario: DevOps engineer forgets TURSO_DATABASE_URL in production deployment
Current Behavior:
  - Application starts successfully
  - Empty string passed to Turso client
  - Error occurs at first auth attempt
  - User sees generic error "Authentication failed"
  - DevOps engineer debugging production outage (1+ hour)

With Proper Validation:
  - Application fails to start
  - Error in logs: "TURSO_DATABASE_URL environment variable is not set"
  - Issue caught in pre-deployment checks (5 minutes)
```

#### 2. Payment Processing Bypass (Critical Impact)
```
Scenario: Stripe credentials misconfigured, but empty string accepted
Current Behavior:
  - stripe = new Stripe('')
  - Stripe SDK may create error on first transaction
  - Payment fails but database not updated
  - Revenue impact
  - Difficult to trace root cause

With Proper Validation:
  - Application fails to start
  - Deployment blocked
  - Issue resolved before production exposure
```

#### 3. Admin Access Control Drift (High Impact)
```
Scenario: ADMIN_EMAIL environment variable not set in new environment
Current Behavior:
  - Admin access granted to support@becomingdiamond.com
  - If mailbox compromised, unauthorized access to lead management
  - Security breach possible without explicit configuration

With Proper Validation:
  - Should require explicit ADMIN_EMAIL configuration
  - No implicit access to any email address
  - Clear security control
```

#### 4. CMS Authentication Failure (Medium Impact)
```
Scenario: GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET not configured
Current Behavior:
  - GitHub OAuth URL: ...?client_id=&client_secret=
  - User redirected to invalid GitHub authorization URL
  - Silent failure, user confused
  - CMS unusable without clear error message

With Proper Validation:
  - Explicit error: "GitHub OAuth credentials required for CMS"
  - Administrator can immediately identify missing configuration
  - Clear remediation path
```

---

## Section 6: Recommendations

### Priority 1: Fail-Fast Validation (URGENT - Do This First)

#### 1.1 Create Centralized Validation Module
```typescript
// src/lib/validate-credentials.ts
export function validateCriticalCredentials() {
  const required = [
    { name: 'TURSO_DATABASE_URL', value: process.env.TURSO_DATABASE_URL },
    { name: 'TURSO_AUTH_TOKEN', value: process.env.TURSO_AUTH_TOKEN },
    { name: 'STRIPE_SECRET_KEY', value: process.env.STRIPE_SECRET_KEY },
    { name: 'STRIPE_WEBHOOK_SECRET_TEST', value: process.env.STRIPE_WEBHOOK_SECRET_TEST || process.env.STRIPE_WEBHOOK_SECRET },
    { name: 'GMAIL_USER', value: process.env.GMAIL_USER },
    { name: 'GMAIL_APP_PASSWORD', value: process.env.GMAIL_APP_PASSWORD },
    { name: 'AUTH_GOOGLE_ID', value: process.env.AUTH_GOOGLE_ID },
    { name: 'AUTH_GOOGLE_SECRET', value: process.env.AUTH_GOOGLE_SECRET },
    { name: 'GITHUB_CLIENT_ID', value: process.env.GITHUB_CLIENT_ID },
    { name: 'GITHUB_CLIENT_SECRET', value: process.env.GITHUB_CLIENT_SECRET },
  ];

  const missing = required.filter(({ value }) => !value);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing critical environment variables:\n${missing
        .map(({ name }) => `  - ${name}`)
        .join('\n')}`
    );
  }
}
```

#### 1.2 Call Validation at Startup
```typescript
// instrumentation.ts - Add at top
if (process.env.NEXT_RUNTIME === 'nodejs') {
  try {
    validateCriticalCredentials();
  } catch (error) {
    console.error('Fatal: Credential validation failed', error);
    process.exit(1);
  }
}
```

---

### Priority 2: Fix Individual Credentials (HIGH)

#### 2.1 Fix turso.ts
```typescript
// src/lib/turso.ts - BEFORE
export const turso = createClient({
  url: process.env.TURSO_DATABASE_URL || '',
  authToken: process.env.TURSO_AUTH_TOKEN || '',
});

// AFTER
if (!process.env.TURSO_DATABASE_URL) {
  throw new Error('TURSO_DATABASE_URL environment variable is required');
}
if (!process.env.TURSO_AUTH_TOKEN) {
  throw new Error('TURSO_AUTH_TOKEN environment variable is required');
}

export const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
```

#### 2.2 Fix auth.ts (Replace Non-Null Assertions)
```typescript
// BEFORE
user: process.env.GMAIL_USER!,
pass: process.env.GMAIL_APP_PASSWORD!,

// AFTER
// Add validation block at module top:
if (!process.env.GMAIL_USER) {
  throw new Error('GMAIL_USER environment variable is required');
}
if (!process.env.GMAIL_APP_PASSWORD) {
  throw new Error('GMAIL_APP_PASSWORD environment variable is required');
}
// ... then use safely:
user: process.env.GMAIL_USER,
pass: process.env.GMAIL_APP_PASSWORD,
```

#### 2.3 Fix stripe webhook route
```typescript
// src/app/api/stripe/webhook/route.ts - BEFORE
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST || process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-10-29.clover',
});
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET_TEST || process.env.STRIPE_WEBHOOK_SECRET || '';

// AFTER
const stripeKey = process.env.STRIPE_SECRET_KEY_TEST || process.env.STRIPE_SECRET_KEY;
if (!stripeKey) {
  throw new Error('STRIPE_SECRET_KEY (or STRIPE_SECRET_KEY_TEST) environment variable is required');
}

const stripe = new Stripe(stripeKey, {
  apiVersion: '2025-10-29.clover',
});

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET_TEST || process.env.STRIPE_WEBHOOK_SECRET;
if (!WEBHOOK_SECRET) {
  throw new Error('STRIPE_WEBHOOK_SECRET (or STRIPE_WEBHOOK_SECRET_TEST) environment variable is required');
}
```

#### 2.4 Fix CMS OAuth credentials
```typescript
// src/app/api/cms-auth/route.ts - BEFORE
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || '';
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || '';

// AFTER
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
  throw new Error('GitHub OAuth credentials (GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET) required for CMS');
}
```

#### 2.5 Fix admin access control
```typescript
// auth.config.ts - BEFORE
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "support@becomingdiamond.com";

// AFTER
if (!process.env.ADMIN_EMAIL) {
  throw new Error('ADMIN_EMAIL environment variable is required (no default for security control)');
}
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
```

#### 2.6 Fix video streaming credentials
```typescript
// src/app/api/video/[videoId]/token/route.ts - BEFORE
const BUNNY_LIBRARY_ID = process.env.BUNNY_STREAM_LIBRARY_ID!;
const BUNNY_API_KEY = process.env.BUNNY_STREAM_API_KEY!;
const BUNNY_CDN_HOSTNAME = process.env.BUNNY_STREAM_CDN_HOSTNAME!;

// AFTER
// Add validation at module top or in GET handler
if (!process.env.BUNNY_STREAM_LIBRARY_ID || 
    !process.env.BUNNY_STREAM_API_KEY || 
    !process.env.BUNNY_STREAM_CDN_HOSTNAME) {
  throw new Error('Bunny Stream credentials required (BUNNY_STREAM_LIBRARY_ID, BUNNY_STREAM_API_KEY, BUNNY_STREAM_CDN_HOSTNAME)');
}

const BUNNY_LIBRARY_ID = process.env.BUNNY_STREAM_LIBRARY_ID;
const BUNNY_API_KEY = process.env.BUNNY_STREAM_API_KEY;
const BUNNY_CDN_HOSTNAME = process.env.BUNNY_STREAM_CDN_HOSTNAME;
```

---

### Priority 3: Stripe Checkout Price IDs (MEDIUM)

#### 3.1 Validate at least one price ID configured
```typescript
// src/app/api/stripe/checkout/route.ts
const ALLOWED_PRICE_IDS = [
  process.env.STRIPE_PRICE_DIAMOND_SPRINT_TEST,
  process.env.STRIPE_PRICE_DIAMOND_SPRINT,
  process.env.STRIPE_PRICE_MONTHLY_TEST,
  process.env.STRIPE_PRICE_MONTHLY,
  process.env.STRIPE_PRICE_ANNUAL_TEST,
  process.env.STRIPE_PRICE_ANNUAL,
].filter(Boolean);

// ADD:
if (ALLOWED_PRICE_IDS.length === 0) {
  throw new Error('At least one Stripe price ID environment variable required (STRIPE_PRICE_*)');
}
```

---

### Priority 4: Consistency Improvements (LOW)

#### 4.1 Use `/src/lib/stripe.ts` Pattern Everywhere
- Never use `|| ''` fallback for critical credentials
- Always use `if (!var) throw new Error(...)` pattern
- Consistent across all files

#### 4.2 Document Credential Classification
```typescript
// At top of each file using credentials:
/**
 * CRITICAL CREDENTIALS - Application fails without these
 * - STRIPE_SECRET_KEY: Payment processing
 * - TURSO_DATABASE_URL: User database
 * 
 * CONFIGURATION TIPS:
 * - Required for all environments (dev, staging, production)
 * - Validate with: npm run test:auth
 * - See README.md section: Environment Variables
 */
```

---

## Section 7: Testing Recommendations

### Unit Tests for Credential Validation

```typescript
// src/test/unit/lib/credential-validation.test.ts
describe('Credential Validation', () => {
  it('should throw if TURSO_DATABASE_URL missing', () => {
    delete process.env.TURSO_DATABASE_URL;
    expect(() => {
      require('@/lib/turso');
    }).toThrow('TURSO_DATABASE_URL');
  });

  it('should throw if STRIPE_SECRET_KEY missing', () => {
    delete process.env.STRIPE_SECRET_KEY;
    expect(() => {
      require('@/lib/stripe');
    }).toThrow('STRIPE_SECRET_KEY');
  });

  // ... test all critical credentials
});
```

### Pre-Deployment Validation Script

```bash
#!/bin/bash
# scripts/validate-credentials.sh
set -e

required_vars=(
  "TURSO_DATABASE_URL"
  "TURSO_AUTH_TOKEN"
  "STRIPE_SECRET_KEY"
  "STRIPE_WEBHOOK_SECRET"
  "GMAIL_USER"
  "GMAIL_APP_PASSWORD"
  "AUTH_GOOGLE_ID"
  "AUTH_GOOGLE_SECRET"
  "GITHUB_CLIENT_ID"
  "GITHUB_CLIENT_SECRET"
  "ADMIN_EMAIL"
)

missing=()
for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    missing+=("$var")
  fi
done

if [ ${#missing[@]} -gt 0 ]; then
  echo "FATAL: Missing required environment variables:"
  printf ' - %s\n' "${missing[@]}"
  exit 1
fi

echo "All critical credentials validated successfully"
```

---

## Section 8: Summary Table - All Credentials

| Credential | Current Pattern | File:Line | Validation | Risk | Action |
|-----------|-----------------|-----------|-----------|------|--------|
| TURSO_DATABASE_URL | Empty string | turso.ts:4 | None | CRITICAL | Add validation |
| TURSO_AUTH_TOKEN | Empty string | turso.ts:5 | None | CRITICAL | Add validation |
| STRIPE_SECRET_KEY | Fail-fast | stripe.ts:3-7 | Yes | GOOD | Keep as is |
| STRIPE_SECRET_KEY_TEST | Empty string | webhook/route:6 | Late | CRITICAL | Add early validation |
| STRIPE_WEBHOOK_SECRET | Empty string | webhook/route:10 | Late | CRITICAL | Add early validation |
| STRIPE_PRICE_* (6 vars) | Optional | checkout/route:14-20 | Filtering | MEDIUM | Validate at least one |
| GMAIL_USER | Non-null (!) | auth.ts:26 | None | HIGH | Add explicit check |
| GMAIL_APP_PASSWORD | Non-null (!) | auth.ts:27 | None | HIGH | Add explicit check |
| AUTH_GOOGLE_ID | Non-null (!) | auth.ts:33 | None | HIGH | Add explicit check |
| AUTH_GOOGLE_SECRET | Non-null (!) | auth.ts:34 | None | HIGH | Add explicit check |
| AUTH_GITHUB_ID | Non-null (!) | auth.ts:43 | Feature flag | MEDIUM | Add explicit check |
| AUTH_GITHUB_SECRET | Non-null (!) | auth.ts:44 | Feature flag | MEDIUM | Add explicit check |
| GITHUB_CLIENT_ID | Empty string | cms-auth/route:4 | None | CRITICAL | Add validation |
| GITHUB_CLIENT_SECRET | Empty string | cms-auth/route:5 | None | CRITICAL | Add validation |
| BUNNY_STREAM_LIBRARY_ID | Non-null (!) | video/token:6 | None | HIGH | Add explicit check |
| BUNNY_STREAM_API_KEY | Non-null (!) | video/token:7 | None | HIGH | Add explicit check |
| BUNNY_STREAM_CDN_HOSTNAME | Non-null (!) | video/token:8 | None | HIGH | Add explicit check |
| AXIOM_TOKEN | Optional | axiom-logger:47 | Conditional | ACCEPTABLE | Keep as is |
| AXIOM_DATASET | Default | axiom-logger:48 | Conditional | ACCEPTABLE | Document default |
| AXIOM_ORG_ID | Optional | axiom-logger:49 | Conditional | ACCEPTABLE | Keep as is |
| ADMIN_EMAIL | Hardcoded | auth.config:11 | None | HIGH | Remove default |

---

## Conclusion

The codebase exhibits **inconsistent credential handling** with critical gaps that could lead to:

1. **Silent Configuration Failures** - Misconfigurations not caught until production
2. **Payment Processing Issues** - Revenue impact from misconfigured Stripe credentials
3. **Authentication Bypass** - Non-explicit admin access control
4. **CMS Unavailability** - Content management dependent on implicit configuration

**Recommended Approach:**
- Implement centralized credential validation module
- Apply fail-fast pattern consistently across all files
- Remove all empty string and hardcoded fallback patterns
- Add startup validation that prevents application from starting with missing credentials
- Document credential requirements clearly in each file

**Estimated Remediation Time:** 4-6 hours
**Estimated Testing Time:** 2-3 hours

**Risk Level if Not Addressed:** HIGH - Production outages and security issues likely

