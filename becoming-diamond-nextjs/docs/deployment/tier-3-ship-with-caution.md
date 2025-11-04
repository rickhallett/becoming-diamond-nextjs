# Tier 3: Ship with Caution - Deployment Guide

**Confidence Level:** 🟠 60-74%
**Features:** 2 features with significant gaps in testing or dependencies
**Risk Level:** Medium-High
**Estimated Setup Time:** 2-4 weeks (extensive validation required)

---

## Features Included

### 1. Payment/Stripe Integration (72% Confidence)
**Tests:** 26 E2E tests (18 active, 8 pending)
**Dependencies:** Stripe account (not configured)
**Risk:** Real payment flow untested, webhook validation pending

### 2. CMS OAuth Integration (68% Confidence)
**Tests:** 8 E2E tests (2 passing, 6 gracefully skipping)
**Dependencies:** GitHub OAuth (partial), GitHub App (not configured)
**Risk:** OAuth flow untested, token refresh unvalidated

---

## Pre-Deployment WARNING

**DO NOT deploy Tier 3 features without:**
1. ⚠️ Extensive testing in sandbox/test mode
2. ⚠️ Manual validation of all payment flows
3. ⚠️ Legal review of payment processing compliance
4. ⚠️ Security audit of webhook endpoints
5. ⚠️ Rollback plan tested and documented

**Recommended Approach:**
- **Week 1-2:** Stripe test mode configuration and validation
- **Week 3:** OAuth flow testing and edge case handling
- **Week 4:** Production deployment with monitoring

---

## Feature 1: Payment/Stripe Integration

### Deployment Readiness: ⚠️ HIGH RISK - Test Mode Only

**Confidence:** 72%
**Risk:** High (financial transactions, PCI compliance)
**Dependencies:** Stripe account, webhook endpoint, SSL certificate

### Pre-Deployment Requirements

**1. Create Stripe Account**

```bash
# 1. Go to https://stripe.com
# 2. Create account (or sign in)
# 3. Complete business verification
# 4. Activate account for production
# 5. Copy API keys from Dashboard → Developers → API keys
```

**2. Configure Environment Variables**

```bash
# TEST MODE (start here)
STRIPE_PUBLISHABLE_KEY_TEST=pk_test_...
STRIPE_SECRET_KEY_TEST=sk_test_...
STRIPE_WEBHOOK_SECRET_TEST=whsec_...

# PRODUCTION MODE (only after validation)
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Feature flag for gradual rollout
STRIPE_ENABLED=false  # Set to true only after validation
```

**3. Create Stripe Products**

```bash
# Via Stripe Dashboard
# 1. Go to Products
# 2. Create products matching your offerings:
#    - Diamond Sprint Course ($497)
#    - Monthly Membership ($97/month)
#    - Annual Membership ($970/year)
# 3. Copy Price IDs for each product
```

**4. Implement Stripe Checkout API**

```typescript
// src/app/api/stripe/checkout/route.ts

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

export async function POST(req: Request) {
  // Verify user authentication
  const session = await getSession();
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { priceId, successUrl, cancelUrl } = await req.json();

  // Validate price ID (prevent price manipulation)
  const allowedPriceIds = [
    process.env.STRIPE_PRICE_DIAMOND_SPRINT,
    process.env.STRIPE_PRICE_MONTHLY,
    process.env.STRIPE_PRICE_ANNUAL,
  ];

  if (!allowedPriceIds.includes(priceId)) {
    return Response.json({ error: 'Invalid price' }, { status: 400 });
  }

  try {
    // Create Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment', // or 'subscription' for recurring
      customer_email: session.user.email,
      client_reference_id: session.user.id, // Link to user account
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/app/dashboard?payment=success`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/pricing?payment=cancelled`,
      metadata: {
        userId: session.user.id,
        userEmail: session.user.email,
      },
    });

    return Response.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url
    });
  } catch (error) {
    console.error('[Stripe] Checkout error', error);
    return Response.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
```

**5. Implement Webhook Handler**

```typescript
// src/app/api/stripe/webhook/route.ts

import Stripe from 'stripe';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature')!;

  let event: Stripe.Event;

  // Verify webhook signature (CRITICAL for security)
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('[Stripe] Webhook signature verification failed', err);
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle different event types
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;

      // Grant access to user
      await grantCourseAccess({
        userId: session.metadata?.userId,
        customerEmail: session.customer_email,
        sessionId: session.id,
        amountTotal: session.amount_total,
      });
      break;
    }

    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;

      // Update user subscription status
      await updateSubscription({
        userId: subscription.metadata?.userId,
        subscriptionId: subscription.id,
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      });
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;

      // Revoke access
      await revokeAccess({
        userId: subscription.metadata?.userId,
        subscriptionId: subscription.id,
      });
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      // Send email notification
      await sendPaymentFailedEmail({
        email: paymentIntent.receipt_email,
        amount: paymentIntent.amount,
      });
      break;
    }

    default:
      console.log(`[Stripe] Unhandled event type: ${event.type}`);
  }

  return Response.json({ received: true });
}
```

**6. Create Database Schema for Payments**

```sql
-- migrations/004_payments.sql

CREATE TABLE payments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  stripe_session_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  amount INTEGER NOT NULL, -- in cents
  currency TEXT DEFAULT 'usd',
  status TEXT NOT NULL, -- 'pending', 'succeeded', 'failed', 'refunded'
  product_type TEXT, -- 'course', 'subscription'
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  status TEXT NOT NULL, -- 'active', 'canceled', 'past_due'
  current_period_start TEXT,
  current_period_end TEXT,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_stripe_session ON payments(stripe_session_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);
```

**7. Install Dependencies**

```bash
npm install stripe
npm install --save-dev @types/stripe
```

### Testing Steps (TEST MODE ONLY)

**1. Test Stripe Test Mode**

```bash
# Use test card numbers
# Success: 4242 4242 4242 4242
# Decline: 4000 0000 0000 0002
# Auth required: 4000 0025 0000 3155

# Test checkout flow
curl -X POST http://localhost:3003/api/stripe/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "priceId": "price_test_123",
    "successUrl": "http://localhost:3003/success",
    "cancelUrl": "http://localhost:3003/cancel"
  }'
```

**2. Test Webhook Locally (Stripe CLI)**

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3003/api/stripe/webhook

# Trigger test events
stripe trigger checkout.session.completed
stripe trigger payment_intent.succeeded
stripe trigger customer.subscription.created
```

**3. Validate Payment Flow End-to-End**

```bash
# Manual testing checklist:
# 1. Click "Buy Course" button
# 2. Redirects to Stripe Checkout
# 3. Enter test card: 4242 4242 4242 4242
# 4. Complete purchase
# 5. Redirects to success page
# 6. Webhook fires (check logs)
# 7. Database updated (check payments table)
# 8. User granted access (check user record)
# 9. Confirmation email sent
```

**4. Test Edge Cases**

```bash
# Test declined payment
# Card: 4000 0000 0000 0002
# Expected: Error message, no access granted

# Test subscription cancellation
# Expected: Access continues until period end

# Test refund
# Via Stripe Dashboard → refund payment
# Expected: Access revoked, user notified
```

**5. Run E2E Tests**

```bash
# Use Stripe test mode environment variables
npx playwright test payment-flow.spec.ts

# Expected: 18 tests passing (8 pending tests should pass after configuration)
```

### Deployment Steps (TEST MODE FIRST)

```bash
# 1. Deploy payment API routes (TEST MODE)
git add src/app/api/stripe/
git commit -m "feat(payments): implement Stripe checkout and webhooks (TEST MODE)"

# 2. Deploy database schema
git add migrations/004_payments.sql
git commit -m "feat(payments): add payment and subscription tables"

# 3. Deploy UI components
git add src/app/pricing/
git commit -m "feat(payments): add pricing page with Stripe integration"

# 4. Configure environment variables (Vercel)
# Add TEST keys first, validate thoroughly

# 5. Deploy to staging environment
git push origin staging

# 6. Validate in staging (1 week minimum)
# 7. Only then consider production deployment
```

### Production Deployment Checklist

**CRITICAL: Do not deploy to production until ALL items checked:**

- [ ] All 26 E2E tests passing
- [ ] Manual testing completed (minimum 20 test transactions)
- [ ] Webhook endpoint validated (100% delivery rate)
- [ ] Database transactions working (ACID compliance verified)
- [ ] Error handling tested (network failures, timeouts)
- [ ] Security audit completed (webhook signature verification, HTTPS)
- [ ] PCI compliance verified (Stripe handles card data, not us)
- [ ] Legal review of terms and refund policy
- [ ] Customer support process documented
- [ ] Rollback plan tested
- [ ] Monitoring dashboards configured
- [ ] Production Stripe keys activated
- [ ] Webhook URL registered with Stripe production
- [ ] SSL certificate validated
- [ ] Rate limiting implemented
- [ ] Fraud detection reviewed (Stripe Radar configured)

### Post-Deployment Monitoring

**Critical Metrics:**

- Payment success rate (target: >95%)
- Webhook delivery rate (target: 100%)
- Refund rate (target: <5%)
- Average payment processing time (target: <3 seconds)
- Failed payment reasons

**Set Up Alerts:**

```typescript
// Alert on payment failure spike
const failureRate = failedPayments / totalPayments;
if (failureRate > 0.05) {
  await sendAlert({
    channel: 'slack',
    severity: 'critical',
    message: `⚠️ Payment failure rate: ${(failureRate * 100).toFixed(1)}%`,
  });
}

// Alert on webhook delivery failure
const webhookFailures = await getWebhookFailures();
if (webhookFailures > 0) {
  await sendAlert({
    channel: 'slack',
    severity: 'high',
    message: `⚠️ ${webhookFailures} webhook deliveries failed`,
  });
}

// Alert on subscription cancellations
const dailyCancellations = await getDailyCancellations();
if (dailyCancellations > 5) {
  await sendAlert({
    channel: 'slack',
    severity: 'medium',
    message: `📊 ${dailyCancellations} subscriptions cancelled today`,
  });
}
```

**Stripe Dashboard Monitoring:**

- Check "Payments" for transaction volume
- Monitor "Disputes" for chargebacks
- Review "Radar" for fraud detection
- Check "Webhooks" for delivery status
- Monitor "Balance" for payout schedule

### Success Criteria

- [ ] Payment success rate >95%
- [ ] Webhook delivery rate 100%
- [ ] Average processing time <3 seconds
- [ ] Refund rate <5%
- [ ] No security incidents
- [ ] Zero unhandled payment errors
- [ ] Customer satisfaction (manual feedback)

### Rollback Plan

If payment system fails:

```typescript
// Disable payment processing immediately
const PAYMENTS_ENABLED = process.env.PAYMENTS_ENABLED === 'true';

if (!PAYMENTS_ENABLED) {
  return (
    <div className="bg-yellow-900/20 border border-yellow-500 p-4 rounded">
      <p className="text-yellow-400">
        Payment processing is temporarily unavailable.
        Please contact support: support@becomingdiamond.com
      </p>
    </div>
  );
}
```

**Rollback Procedure:**

1. Set `PAYMENTS_ENABLED=false` in environment
2. Redeploy application
3. Notify users via email/banner
4. Investigate issue in logs
5. Fix issue in staging
6. Re-enable after validation

---

## Feature 2: CMS OAuth Integration

### Deployment Readiness: ⚠️ MEDIUM RISK - Manual Testing Required

**Confidence:** 68%
**Risk:** Medium (editor access, content security)
**Dependencies:** GitHub OAuth App, GitHub API access

### Pre-Deployment Requirements

**1. Create GitHub OAuth App**

```bash
# 1. Go to https://github.com/settings/developers
# 2. Click "New OAuth App"
# 3. Application name: Becoming Diamond CMS
# 4. Homepage URL: https://becomingdiamond.com
# 5. Callback URL: https://becomingdiamond.com/api/callback
# 6. Copy Client ID and Client Secret
```

**2. Configure Environment Variables**

```bash
# Already exists (for lead capture OAuth)
GITHUB_CLIENT_ID=Iv1...
GITHUB_CLIENT_SECRET=...

# Add repository access
GITHUB_REPO_OWNER=your-username
GITHUB_REPO_NAME=becoming-diamond-nextjs
GITHUB_BRANCH=main
```

**3. Verify Decap CMS Configuration**

```yaml
# public/admin/config.yml

backend:
  name: github
  repo: your-username/becoming-diamond-nextjs
  branch: main
  base_url: https://becomingdiamond.com
  auth_endpoint: /api/auth

media_folder: public/images/uploads
public_folder: /images/uploads

collections:
  - name: news
    label: News
    folder: content/news
    create: true
    slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
    fields:
      - { label: "Title", name: "title", widget: "string" }
      - { label: "Date", name: "date", widget: "datetime" }
      - { label: "Description", name: "description", widget: "text" }
      - { label: "Thumbnail", name: "thumbnail", widget: "image" }
      - { label: "Published", name: "published", widget: "boolean", default: true }
      - { label: "Body", name: "body", widget: "markdown" }
```

**4. Test OAuth Flow**

```bash
# Manual test procedure:
# 1. Navigate to https://becomingdiamond.com/admin
# 2. Click "Login with GitHub"
# 3. Popup opens to /api/auth?provider=github
# 4. Redirects to GitHub authorization
# 5. User approves
# 6. Redirects to /api/callback?code=XXX
# 7. Callback sends postMessage to parent window
# 8. CMS receives code and exchanges for token via /api/auth (POST)
# 9. CMS authenticated and loads
```

**5. Verify API Routes**

Check existing implementation:

```typescript
// src/app/api/auth/route.ts - Already implemented

export async function GET(req: NextRequest) {
  const provider = searchParams.get('provider');

  if (provider === 'github') {
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=repo,user`;
    return NextResponse.redirect(authUrl);
  }
}

export async function POST(req: Request) {
  const { code, provider } = await req.json();

  // Exchange code for token
  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ client_id: GITHUB_CLIENT_ID, client_secret: GITHUB_CLIENT_SECRET, code }),
  });

  const { access_token } = await tokenResponse.json();

  // Fetch user info
  const userResponse = await fetch('https://api.github.com/user', {
    headers: { 'Authorization': `Bearer ${access_token}` },
  });

  const user = await userResponse.json();

  return Response.json({ token: access_token, provider: 'github', user });
}
```

### Testing Steps

**1. Test OAuth Authorization Flow**

```bash
# Manual test:
# 1. Open /admin in browser
# 2. Open browser DevTools → Console
# 3. Click "Login with GitHub"
# 4. Watch for:
#    - Popup opens
#    - Redirects to GitHub
#    - GitHub authorization page
#    - Redirect back to /api/callback
#    - postMessage sent to parent
#    - Token exchange (check Network tab)
#    - CMS loads content
```

**2. Test Content Operations**

```bash
# Test create:
# 1. Click "New News" in CMS
# 2. Fill in fields
# 3. Click "Publish"
# 4. Check git history for new commit
# 5. Verify file created in content/news/

# Test update:
# 1. Click existing news item
# 2. Edit content
# 3. Click "Publish"
# 4. Check git history for update commit
# 5. Verify file updated

# Test delete:
# 1. Click existing news item
# 2. Click "Delete"
# 3. Confirm deletion
# 4. Check git history for delete commit
# 5. Verify file removed
```

**3. Test Media Upload**

```bash
# Test image upload:
# 1. Create/edit news item
# 2. Click thumbnail field
# 3. Upload image
# 4. Verify image appears in media library
# 5. Check public/images/uploads/ for file
# 6. Verify git commit includes image
```

**4. Test Error Scenarios**

```bash
# Test unauthorized access:
# 1. Clear browser storage
# 2. Navigate to /admin
# 3. Try to access content
# 4. Expected: Login prompt

# Test token expiration:
# 1. Login to CMS
# 2. Wait for token expiry (1 hour)
# 3. Try to save content
# 4. Expected: Re-authentication prompt

# Test network failure:
# 1. Login to CMS
# 2. Disconnect network
# 3. Try to save content
# 4. Expected: Error message, retry option
```

**5. Run E2E Tests**

```bash
# Configure GitHub OAuth credentials
export GITHUB_CLIENT_ID=Iv1...
export GITHUB_CLIENT_SECRET=...

npx playwright test oauth-flow.spec.ts

# Expected: All 8 tests passing (no more graceful skips)
```

### Deployment Steps

```bash
# 1. Verify OAuth configuration
git add public/admin/config.yml
git commit -m "feat(cms): configure Decap CMS with GitHub backend"

# 2. Ensure API routes are deployed
# (Already deployed from previous work)

# 3. Configure environment variables (Vercel)
# Add GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET

# 4. Deploy to production
git push origin main

# 5. Test OAuth flow in production
# Navigate to https://becomingdiamond.com/admin
# Complete authorization flow
# Create test content item
# Verify git commit appears in repository
```

### Post-Deployment Monitoring

**Metrics to Track:**

- OAuth success rate
- Token exchange failures
- Content operation errors (create/update/delete)
- Media upload failures
- GitHub API rate limit usage

**Set Up Alerts:**

```typescript
// Alert on OAuth failures
const oauthFailureRate = failures / totalAttempts;
if (oauthFailureRate > 0.1) {
  await sendAlert({
    channel: 'slack',
    message: `⚠️ CMS OAuth failure rate: ${(oauthFailureRate * 100).toFixed(1)}%`,
  });
}

// Alert on GitHub API rate limit
const rateLimitRemaining = await getGitHubRateLimitRemaining();
if (rateLimitRemaining < 100) {
  await sendAlert({
    channel: 'slack',
    message: `⚠️ GitHub API rate limit low: ${rateLimitRemaining} requests remaining`,
  });
}
```

### Success Criteria

- [ ] OAuth flow working (100% success rate)
- [ ] Content create/update/delete operations working
- [ ] Media upload working
- [ ] Git commits appearing in repository
- [ ] No token refresh errors
- [ ] GitHub API rate limit not exceeded
- [ ] CMS UI loads without errors

### Rollback Plan

If CMS OAuth fails:

```yaml
# Temporary: Switch to Git Gateway backend
# public/admin/config.yml

backend:
  name: git-gateway
  # Falls back to manual Git operations
  # Editors use GitHub directly until OAuth fixed
```

**Rollback Procedure:**

1. Update `config.yml` to use `git-gateway` backend
2. Redeploy application
3. Notify editors to use GitHub directly
4. Investigate OAuth issue
5. Fix and re-enable GitHub backend

---

## Final Tier 3 Checklist

**Before Deploying Tier 3:**

- [ ] All Tier 1 features deployed and stable
- [ ] All Tier 2 features deployed and stable
- [ ] Stripe account fully verified (not just test mode)
- [ ] Legal review completed (payment terms, refunds)
- [ ] Security audit completed (webhooks, OAuth)
- [ ] Manual testing completed (minimum 2 weeks)
- [ ] Monitoring dashboards configured
- [ ] Rollback plan tested
- [ ] Customer support process documented
- [ ] Team trained on troubleshooting

**After Deployment:**

- [ ] Monitor payments hourly (first 48 hours)
- [ ] Monitor webhooks continuously (first week)
- [ ] Review error logs daily (first week)
- [ ] Gather user feedback (payment experience)
- [ ] Document issues for iteration

---

**Deployment Owner:** [Your Name]
**Estimated Completion:** 2-4 weeks post-Tier 2
**Status:** ⚠️ HIGH RISK - Extensive Validation Required
