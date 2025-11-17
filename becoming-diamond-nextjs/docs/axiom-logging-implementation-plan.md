# Comprehensive Axiom Logging Implementation Plan
## Becoming Diamond Next.js Application

> **Generated**: 2025-01-17
> **Status**: Phase 1 In Progress
> **Estimated Completion**: 3 weeks (18-24 hours total)

---

## Executive Summary

### Current State
Your Axiom infrastructure is **well-configured** but **critically underutilized**. You have:
- Solid logger foundation (`src/lib/axiom-logger.ts`) with server/client safety
- Global error handlers via `instrumentation.ts`
- Minimal coverage (~5% of critical paths logged)
- Recent cleanup removed console logging (good decision)

### Primary Recommendation
**Implement comprehensive structured logging across 8 priority areas in 3 phases over 2-3 days.**

**Estimated Monthly Cost**: $0-25/month (well within Axiom's free tier of 500GB/month)

### Key Benefits
1. **Production Visibility**: Real-time insight into authentication flows, payment processing, and user behavior
2. **Faster Debugging**: Structured events replace blind console.log hunting
3. **Business Intelligence**: Track sprint completion rates, conversion funnels, email delivery
4. **Security Monitoring**: Detect unauthorized access attempts, rate limit violations, suspicious patterns
5. **Performance Tracking**: Identify slow database queries, video token generation bottlenecks

### Critical Gaps Identified
- **Authentication Flow**: No visibility into NextAuth magic link/OAuth failures
- **Payment Processing**: Limited Stripe webhook event tracking beyond basic logging
- **Email Delivery**: Partial tracking in leads API, missing in NextAuth
- **Sprint Progress**: No analytics on user engagement or completion patterns
- **Video Access**: Basic logging exists but missing business metrics
- **Database Operations**: Zero query performance monitoring
- **Client-Side Errors**: No tracking despite heavy 3D/animation usage

---

## Implementation Phases

### Phase 1: Foundation & Critical Paths (Week 1, 8-10 hours)

**Priority 1A: Authentication Deep Dive (3 hours)**
- Target: `/src/lib/turso-adapter.ts`
- Add logging to ALL adapter methods (createUser, getUser, getUserByEmail, etc.)
- Track authentication flow from start to finish
- Measure performance (duration metrics)

**Priority 1B: Rate Limiting & Security Events (2 hours)**
- Target: `/src/app/api/leads/route.ts`
- Log rate limit checks and violations
- Track duplicate submission attempts
- Monitor unauthorized access patterns

**Priority 1C: Client-Side Error Boundary (3 hours)**
- New: `/src/components/error-boundary.tsx`
- New: `/src/app/api/log/error/route.ts`
- Wrap root layout with Error Boundary
- Track client-side crashes and WebGL errors

### Phase 2: Business Intelligence & Analytics (Week 2, 6-8 hours)

**Priority 2A: Sprint Progress Analytics (3 hours)**
- Target: `/src/app/api/sprint/progress/*.ts`
- Track completion patterns, dropout rates
- Monitor streaks and milestones
- Calculate completion funnels

**Priority 2B: Video Analytics (2 hours)**
- Target: `/src/app/api/video/[videoId]/token/route.ts`
- Track video views and watch duration
- Monitor token generation success rates
- Identify most-watched content

**Priority 2C: Email Delivery Deep Dive (3 hours)**
- Target: `/src/lib/gmail-smtp.ts`
- Track send success/failure rates
- Monitor delivery performance
- Alert on SMTP issues

### Phase 3: Performance & Advanced Monitoring (Week 3, 4-6 hours)

**Priority 3A: Database Query Performance (3 hours)**
- New: `/src/lib/turso-instrumented.ts`
- Wrap Turso client with performance tracking
- Detect slow queries (>500ms)
- Monitor query patterns

**Priority 3B: Checkout Flow Logging (2 hours)**
- Target: `/src/app/api/checkout/create-session/route.ts`
- Track conversion funnel
- Monitor payment success rates
- Alert on checkout failures

**Priority 3C: WebGL Performance Monitoring (1 hour)**
- Target: `/src/components/ui/globe.tsx`
- Track rendering errors
- Monitor performance degradation
- Alert on crashes

---

## Monitoring Strategy

### Key Metrics to Track

#### 1. Authentication Funnel
**Goal**: Identify where users drop off in sign-up flow

**Axiom Query**:
```
component == "Authentication"
| summarize
    signInAttempts = countif(event == "oauth_callback"),
    signInSuccess = countif(event == "oauth_callback" and isNewUser == true),
    magicLinkSent = countif(event == "magic_link_sent"),
    magicLinkClicked = countif(event == "magic_link_verified")
| extend conversionRate = (signInSuccess / signInAttempts) * 100
```

**Alert Condition**:
- If `conversionRate < 70%` → Alert (authentication broken)
- If `magicLinkClicked / magicLinkSent < 50%` → Alert (email deliverability issue)

#### 2. Sprint Completion Funnel
**Goal**: Track user progression through 30-day program

**Axiom Query**:
```
component == "SprintProgress" and event == "day_completed"
| summarize userCount = dcount(userId) by dayNumber
| order by dayNumber asc
```

**Expected Pattern**: Exponential drop-off (Day 1: 100%, Day 30: 20-30%)

**Alert Condition**:
- If Day 1 to Day 2 retention < 80% → Alert (poor onboarding)
- If Day 15 retention < 40% → Alert (mid-sprint engagement issue)

#### 3. Payment Success Rate
**Goal**: Monitor Stripe integration health

**Axiom Query**:
```
component == "PaymentProcessor"
| summarize
    attempts = countif(event == "checkout_session_created"),
    successes = countif(event == "payment_succeeded"),
    failures = countif(event == "payment_failed")
| extend successRate = (successes / attempts) * 100
```

**Alert Condition**:
- If `successRate < 85%` → Alert (payment processor issue)
- If `failures > 10` in 1 hour → Alert (potential fraud or technical issue)

#### 4. Email Delivery Health
**Goal**: Ensure lead capture emails reach users

**Axiom Query**:
```
component == "EmailService" and emailType == "welcome"
| summarize
    sent = countif(event == "email_sent"),
    failed = countif(event == "email_send_failed")
| extend failureRate = (failed / (sent + failed)) * 100
```

**Alert Condition**:
- If `failureRate > 5%` → Alert (Gmail SMTP issue)

#### 5. API Performance (P95 Latency)
**Goal**: Detect performance degradation

**Axiom Query**:
```
component == "Database" and event == "query_executed"
| summarize p95_latency = percentile(durationMs, 95) by bin(_time, 5m)
| where p95_latency > 500
```

**Alert Condition**:
- If P95 latency > 500ms for 5 consecutive minutes → Alert (database performance issue)

---

## Privacy & Security Best Practices

### PII Handling Rules

**NEVER log**:
- Full email addresses → Use email domain only (`user.email.split('@')[1]`)
- Credit card numbers → Log last 4 digits at most (actually, don't log at all)
- Passwords or API keys → Obviously never
- Full names → Use initials or omit
- Physical addresses → Use city/country only
- Phone numbers → Omit entirely

**Safe to log**:
- User IDs (internal database IDs)
- Email domains (for analytics, not identification)
- Timestamps and durations
- Error messages (sanitized - no user input echoed back)
- IP addresses (for rate limiting, with GDPR disclosure)
- User agents (for device analytics)

### Example: Sanitizing User Data

```typescript
// BAD
await log.info('User registered', {
  email: user.email, // PII!
  name: user.name, // PII!
});

// GOOD
await log.info('User registered', {
  userId: user.id,
  emailDomain: user.email?.split('@')[1] || 'unknown',
  hasName: !!user.name,
  timestamp: new Date().toISOString(),
});
```

---

## Cost Projections

### Estimated Log Volume

**Assumptions**:
- 1,000 DAU (daily active users)
- 10 API requests per user per day
- Average log event size: 500 bytes
- 80% of requests generate 1 log event
- 20% of requests generate multiple log events

**Calculation**:
```
Daily Events:
  API requests: 1,000 users × 10 requests = 10,000 requests
  Single events (80%): 10,000 × 0.8 × 1 = 8,000 events
  Multi events (20%): 10,000 × 0.2 × 3 = 6,000 events
  Total events: 14,000 events/day

Daily Data Volume:
  14,000 events × 500 bytes = 7 MB/day

Monthly Data Volume:
  7 MB/day × 30 days = 210 MB/month
```

**Result**: Well within free tier (500GB/month)

### Scaling Projections
- **10,000 DAU**: 2.1 GB/month (free)
- **50,000 DAU**: 10.5 GB/month (free)
- **100,000 DAU**: 21 GB/month (free)
- **500,000 DAU**: 105 GB/month (free)

**Conclusion**: You won't hit paid tiers unless you reach **2.3 million DAU**

---

## Testing Strategy

### Unit Testing
- Test log event structure and formatting
- Validate PII sanitization
- Mock Axiom transport for isolated tests

### Integration Testing
- Verify logs reach Axiom in staging
- Test error scenarios and edge cases
- Validate alert conditions trigger correctly

### Performance Testing
- Measure logging overhead (<10ms per call)
- Test under high load (concurrent requests)
- Verify no memory leaks from logging

---

## Success Metrics

### Week 1 Targets
- ✅ Authentication flow fully visible in Axiom
- ✅ Client-side errors captured
- ✅ Zero production incidents caused by logging
- ✅ Rate limiting violations tracked

### Week 2 Targets
- ✅ Sprint completion funnel visible
- ✅ Video viewing analytics tracked
- ✅ Email delivery success rate monitored
- ✅ Dashboards created in Axiom

### Week 3 Targets
- ✅ Slow queries automatically detected
- ✅ All critical alerts configured
- ✅ P95 latency tracked across all APIs
- ✅ Security events monitored

### Final Success Criteria
**"Can we debug any production issue in <10 minutes using Axiom logs alone?"**

If yes, mission accomplished.

---

## Resources

### Documentation
- [Axiom Next.js Integration](https://axiom.co/docs/integrations/nextjs)
- [Structured Logging Best Practices](https://www.datadoghq.com/blog/structured-logging/)
- [GDPR Logging Compliance](https://gdpr.eu/logging/)

### Implementation Files
- `/src/lib/axiom-logger.ts` - Core logger (already implemented)
- `/instrumentation.ts` - Server error tracking (already implemented)
- `/src/contexts/UserContext.tsx` - Example usage (already implemented)

### Next Steps
1. Review plan with team
2. Set up staging environment for testing
3. Begin Phase 1 implementation
4. Monitor for 48 hours before production rollout

---

## Rollback Plan

**If logging causes issues**:

1. **Immediate**: Comment out all `await log.*()` calls in affected file
2. **Redeploy**: Push fix to production within 5 minutes
3. **Investigate**: Check Axiom for errors related to logging itself
4. **Fix**: Resolve issue (likely: rate limiting, infinite loops, or network timeouts)
5. **Gradual Re-enable**: Re-introduce logging one component at a time

**Prevention**:
- Never call `await log.*()` in a tight loop
- Use fire-and-forget pattern for non-critical logs
- Test thoroughly in staging with production-like traffic

---

## Appendix: Code Examples

### Example 1: Authentication Logging

```typescript
// src/lib/turso-adapter.ts

async createUser(user) {
  const startTime = Date.now();
  await log.info('Adapter: createUser started', {
    component: 'TursoAdapter',
    method: 'createUser',
    email: user.email,
    hasName: !!user.name,
    timestamp: new Date().toISOString(),
  });

  try {
    // ... existing logic ...

    const duration = Date.now() - startTime;
    await log.info('Adapter: createUser success', {
      component: 'TursoAdapter',
      method: 'createUser',
      userId: id,
      email: user.email,
      durationMs: duration,
      timestamp: new Date().toISOString(),
    });

    return createdUser;
  } catch (error) {
    await log.error('Adapter: createUser failed', {
      component: 'TursoAdapter',
      method: 'createUser',
      email: user.email,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
}
```

### Example 2: Rate Limiting Logging

```typescript
// src/app/api/leads/route.ts

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);

  if (!limit || now > limit.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60000 });
    log.debug('Rate limit: New window', {
      component: 'LeadCapture',
      event: 'rate_limit_check',
      ipAddress: ip,
      result: 'allowed',
      timestamp: new Date().toISOString(),
    });
    return true;
  }

  if (limit.count >= 5) {
    log.warn('Rate limit: Exceeded', {
      component: 'LeadCapture',
      event: 'rate_limit_exceeded',
      ipAddress: ip,
      attemptCount: limit.count,
      windowResetAt: new Date(limit.resetAt).toISOString(),
      timestamp: new Date().toISOString(),
    });
    return false;
  }

  limit.count++;
  return true;
}
```

### Example 3: Error Boundary

```typescript
// src/components/error-boundary.tsx

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  async componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to Axiom via API route (server-side safe)
    try {
      await fetch('/api/log/error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error_type: error.name || 'ClientError',
          error_message: error.message,
          error_stack: error.stack,
          component_stack: errorInfo.componentStack,
          url: window.location.href,
          user_agent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch {
      // Silent fail - don't break UI for logging
    }
  }
}
```

---

**Document Version**: 1.0
**Last Updated**: 2025-01-17
**Owner**: Development Team
