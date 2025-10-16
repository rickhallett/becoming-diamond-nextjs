# PRD: Single Book Sales via Stripe

**Status:** Draft v2.0 (MVP Scope)
**Created:** 2025-10-16
**Updated:** 2025-10-16 (Reduced scope to single book MVP)
**Owner:** Product Team
**Target Release:** TBD
**Estimated Effort:** 12-20 hours (MVP only)

---

## Executive Summary

Enable selling a single digital book through the Becoming Diamond platform using Stripe Checkout. This MVP focuses on the fastest path to revenue with minimal complexity, while maintaining code structure that allows future expansion.

### MVP Goals
- Sell ONE digital book via Stripe
- Stripe-hosted checkout (no custom payment form needed)
- Automated email receipt (Stripe built-in)
- Simple order tracking in database
- Secure download link delivery

### MVP Non-Goals (Future Expansion)
- Multiple books / catalog pages
- Shopping cart
- Physical book fulfillment
- Member portal integration (download from member area)
- Admin order dashboard (use Stripe dashboard initially)
- Guest checkout accounts
- Advanced features (discounts, bundles, reviews, etc.)

---

## Problem Statement

The author has completed a book and wants to sell it directly through the Becoming Diamond platform. Currently, there is no payment infrastructure in place. The goal is to implement the simplest possible solution that generates revenue quickly while maintaining professional quality.

### Current Situation
- Book is ready to sell (PDF exists)
- No payment processing capability
- Using external platforms would split revenue and fragment brand
- Need fast time-to-market (weeks, not months)

### Business Impact
- **Time is money:** Every week without a sales channel is lost revenue
- **Complexity risk:** Over-engineered solutions delay launch and increase maintenance burden
- **Validation need:** Single book sale validates demand before building extensive infrastructure

---

## User Persona (MVP)

### Primary: Book Buyer
- **Goal:** Purchase and download the book quickly
- **Expectation:** Standard e-commerce experience (similar to Gumroad, Amazon, etc.)
- **Flow:** Click "Buy Now" → Pay with card → Receive download link via email
- **Technical Comfort:** Medium (comfortable with online shopping, expects email confirmation)

---

## User Stories (MVP Only)

### US-001: View Book Sales Page
```
As a visitor
I want to see a dedicated page for the book
So that I can learn about it and decide to purchase
```
**Acceptance Criteria:**
- Single page at `/book` (or `/books/[slug]` for future expansion)
- Displays: cover image, title, author, description, price
- "Buy Now" button prominent
- Mobile-responsive
- SEO optimized

### US-002: Complete Purchase
```
As a visitor
I want to pay for the book
So that I can receive the download link
```
**Acceptance Criteria:**
- Click "Buy Now" redirects to Stripe Checkout (hosted by Stripe)
- Stripe collects email and payment
- After successful payment, redirect to success page
- Success page shows download link (temporary, signed URL)
- Stripe sends receipt email automatically

### US-003: Download Book
```
As a purchaser
I want to download the book I paid for
So that I can read it
```
**Acceptance Criteria:**
- Download link on success page works
- Link expires after 24 hours (security)
- Can re-generate link from success page URL (bookmark-able)
- PDF downloads correctly

---

## Functional Requirements (MVP Only)

### FR-1: Book Sales Page
- Single static page at `/book` (hardcoded, no CMS needed for MVP)
- Displays book information:
  - Cover image
  - Title
  - Author
  - Description (2-3 paragraphs)
  - Price ($XX.XX)
  - "Buy Now" button
- SEO meta tags for social sharing

### FR-2: Stripe Checkout Integration
- Create Stripe Checkout Session API endpoint (`/api/checkout/create-session`)
- "Buy Now" button calls API, receives Stripe Checkout URL
- Redirect user to Stripe-hosted checkout page
- Stripe collects:
  - Email address
  - Card payment
- Success URL: `/book/success?session_id={CHECKOUT_SESSION_ID}`
- Cancel URL: `/book` (back to sales page)

### FR-3: Order Tracking (Minimal)
- Webhook endpoint (`/api/stripe/webhook`)
- On `checkout.session.completed`:
  - Create order record in Turso (email, stripe session ID, amount, timestamp)
  - Mark order as "completed"
- Simple schema (no complex relationships needed for MVP):
  ```typescript
  {
    id: string;
    email: string;
    stripeSessionId: string;
    amountPaid: number;
    createdAt: timestamp;
  }
  ```

### FR-4: Download Delivery
- Success page (`/book/success`) accepts `session_id` query param
- Verify session with Stripe API
- Generate signed download URL (24-hour expiry)
- Display download button
- Store PDF in Vercel Blob (private) or use pre-signed URL approach

### FR-5: Email Receipt (Automated)
- Stripe sends receipt email automatically (no custom email needed for MVP)
- Receipt includes product name and amount
- **Future:** Custom email with download link (Phase 2)

---

## Technical Requirements (MVP)

### Architecture

**TR-1: Technology Stack (Minimal)**
- **Payment Processing:** Stripe Checkout (hosted, no @stripe/stripe-js needed initially)
- **Database:** Turso (libSQL) with Drizzle ORM (already in use - extend schema)
- **File Storage:** Vercel Blob Storage for PDF
- **Email:** None (Stripe handles receipts automatically for MVP)
- **State Management:** None (no cart needed for MVP)

**TR-2: Database Schema (Minimal)**

```typescript
// src/lib/db/schema.ts (Add to existing Drizzle schema)

import { sqliteTable, text, real, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Simple orders table (no complex relationships for MVP)
export const bookOrders = sqliteTable('book_orders', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull(),
  stripeSessionId: text('stripe_session_id').notNull().unique(),
  amountPaid: real('amount_paid').notNull(),
  status: text('status', { enum: ['completed', 'refunded'] }).notNull().default('completed'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// Index for looking up orders by email
CREATE INDEX idx_book_orders_email ON book_orders(email);
CREATE INDEX idx_book_orders_session_id ON book_orders(stripe_session_id);

// TypeScript types
export type BookOrder = typeof bookOrders.$inferSelect;
export type NewBookOrder = typeof bookOrders.$inferInsert;
```

**Migration:**
```bash
# Generate migration
npx drizzle-kit generate:sqlite

# Apply to Turso
npx drizzle-kit push:sqlite
```

**TR-3: API Endpoints (MVP Only)**

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/api/checkout/create-session` | POST | Create Stripe Checkout session | No |
| `/api/stripe/webhook` | POST | Handle Stripe webhooks (record orders) | No (signature verification) |
| `/api/download` | GET | Generate temporary download URL | No (validates session_id) |

**TR-4: File Structure (MVP Only - ~6 files)**

```
src/
├── app/
│   ├── book/
│   │   ├── page.tsx                 # Sales page for THE book
│   │   └── success/
│   │       └── page.tsx             # Success page with download link
│   └── api/
│       ├── checkout/
│       │   └── create-session/
│       │       └── route.ts         # Create Stripe Checkout session
│       ├── download/
│       │   └── route.ts             # Generate temporary download URL
│       └── stripe/
│           └── webhook/
│               └── route.ts         # Handle Stripe events
├── lib/
│   ├── db/
│   │   ├── schema.ts                # Extend with bookOrders table
│   │   └── client.ts                # Turso client (already exists)
│   └── stripe.ts                    # Stripe client initialization (new)

public/
└── book/
    ├── cover.jpg                    # Book cover image
    └── the-book.pdf                 # The actual PDF (temporary - move to Vercel Blob)
```

**Future Expansion Structure** (not built in MVP):
- `src/app/books/` - Multiple book catalog
- `src/components/cart/` - Shopping cart components
- `src/app/app/orders/` - Member portal order history
- etc.

**TR-5: Environment Variables (MVP Only)**

```bash
# .env.local

# Stripe (required)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Database (Turso - already configured)
TURSO_DATABASE_URL=libsql://[database-name]-[org-name].turso.io
TURSO_AUTH_TOKEN=eyJhbGc...

# File Storage (Vercel Blob - for private PDF hosting)
BLOB_READ_WRITE_TOKEN=vercel_blob_...

# App URL (for Stripe redirect URLs)
NEXT_PUBLIC_APP_URL=http://localhost:3003
```

**Not Needed for MVP:**
- ~~Email service~~ (Stripe sends receipts)
- ~~Stripe publishable key~~ (using Checkout, not custom form)
- ~~Admin email~~ (no admin features in MVP)

**TR-6: Security Requirements**

- All API endpoints validate input with Zod schemas
- Webhook signature verification for Stripe events
- Signed URLs for digital downloads (24-hour expiry)
- PDF watermarking to deter piracy
- Rate limiting on payment endpoints (max 10 attempts per hour per IP)
- HTTPS required in production
- Environment variables never exposed to client
- Order amount validation on server (never trust client)
- SQL injection prevention (Drizzle ORM parameterized queries)
- XSS protection (React auto-escaping, sanitize user input)

**TR-7: Performance Requirements**

- Book catalog page loads in <2s (LCP)
- Checkout page loads in <1.5s
- Payment processing completes in <3s (Stripe API latency)
- Digital downloads available immediately after payment (via webhook)
- Book images optimized (WebP/AVIF, max 200KB per cover)
- Static generation for book pages (rebuild on content changes)
- Cart operations feel instant (<100ms)

**Turso Performance Benefits:**
- Edge-replicated database (reads from nearest location globally)
- Sub-10ms query latency for most operations
- Built-in read replicas (no additional configuration)
- SQLite performance characteristics (fast reads, simple queries)
- Excellent for e-commerce workloads (read-heavy with occasional writes)

**TR-8: Monitoring & Logging**

- Log all Stripe webhook events (success and failure)
- Track payment failures with error codes
- Monitor order fulfillment times
- Alert on webhook processing failures
- Dashboard for key metrics:
  - Orders per day/week/month
  - Revenue (digital vs physical)
  - Failed payment rate
  - Average order value
  - Conversion rate (catalog view → purchase)

---

## Implementation Plan (MVP - Single Phase)

### MVP Implementation: 12-20 hours
**Goal: Sell one book, take payment, deliver PDF**

**Prerequisites (1-2 hours):**
- [ ] Create Stripe account (test mode)
- [ ] Set up Vercel Blob storage (or decide to use public/ temporarily)
- [ ] Get book PDF and cover image from author

**Step 1: Database (1-2 hours)**
- [ ] Add `bookOrders` table to `src/lib/db/schema.ts`
- [ ] Run migration: `npx drizzle-kit generate:sqlite && npx drizzle-kit push:sqlite`
- [ ] Verify table exists in Turso dashboard

**Step 2: Stripe Setup (1 hour)**
- [ ] Install Stripe: `npm install stripe`
- [ ] Create `src/lib/stripe.ts` (initialize Stripe client)
- [ ] Create Stripe Product in dashboard (name: "Book Title", price: $XX)
- [ ] Copy Price ID for use in checkout

**Step 3: Book Sales Page (2-3 hours)**
- [ ] Create `src/app/book/page.tsx`
- [ ] Add book cover to `public/book/cover.jpg`
- [ ] Hardcode book info (title, description, price)
- [ ] Add "Buy Now" button
- [ ] Make mobile-responsive
- [ ] Add SEO meta tags

**Step 4: Checkout API (2-3 hours)**
- [ ] Create `src/app/api/checkout/create-session/route.ts`
- [ ] Implement Stripe Checkout Session creation
- [ ] Set success_url: `/book/success?session_id={CHECKOUT_SESSION_ID}`
- [ ] Set cancel_url: `/book`
- [ ] Wire up "Buy Now" button to call API

**Step 5: Webhook Handler (2-3 hours)**
- [ ] Create `src/app/api/stripe/webhook/route.ts`
- [ ] Verify webhook signature
- [ ] Handle `checkout.session.completed` event
- [ ] Insert order record into `bookOrders` table
- [ ] Test with Stripe CLI: `stripe listen --forward-to localhost:3003/api/stripe/webhook`

**Step 6: Success Page + Download (3-4 hours)**
- [ ] Create `src/app/book/success/page.tsx`
- [ ] Retrieve session ID from query param
- [ ] Verify session with Stripe API
- [ ] Upload PDF to Vercel Blob (or keep in public/ for now)
- [ ] Create `src/app/api/download/route.ts`
- [ ] Generate signed URL (24-hour expiry)
- [ ] Display download button on success page

**Step 7: Testing (1-2 hours)**
- [ ] Test successful purchase with test card (4242 4242 4242 4242)
- [ ] Test declined card (4000 0000 0000 0002)
- [ ] Verify order appears in database
- [ ] Verify download link works
- [ ] Verify download link expires after 24 hours
- [ ] Test on mobile device

**Step 8: Deploy (1 hour)**
- [ ] Add production Stripe keys to Vercel env vars
- [ ] Deploy to production
- [ ] Configure production webhook endpoint in Stripe dashboard
- [ ] Test live purchase (real card, real money - refund after)
- [ ] Update production URL in code if needed

**Total Estimated Time: 12-20 hours**

---

## Future Expansion Phases (Not in MVP)

### Phase 2: Multiple Books (15-20 hours)
- Dynamic book pages from CMS
- Book catalog page
- Book detail pages with SEO

### Phase 3: Shopping Cart (20-25 hours)
- Cart state management
- Multi-item checkout
- Quantity selection

### Phase 4: Member Portal Integration (15-20 hours)
- Order history page
- Re-download functionality
- Link orders to user accounts

### Phase 5: Admin Dashboard (20-25 hours)
- View all orders
- Filter and search
- Export to CSV
- Refund handling

### Phase 6: Advanced Features (variable)
- PDF watermarking
- Email customization
- Discount codes
- Physical book fulfillment
- etc.

---

## Success Metrics (MVP)

### Primary KPIs
**Track in first 30 days:**
- Total revenue
- Number of purchases
- Failed payment rate (target: <5%)
- Sales page visits (Google Analytics or Vercel Analytics)
- Conversion rate (visits → purchases)

### Monitoring (MVP)
- **Payments:** Stripe Dashboard (free, built-in)
- **Orders:** Query Turso database directly or use Drizzle Studio
- **Analytics:** Vercel Analytics (free) or Google Analytics 4

### Success Criteria
- At least 1 successful purchase within first week (validates technical implementation)
- Failed payment rate <10% (indicates smooth checkout experience)
- No critical bugs reported by purchasers

**Note:** Advanced metrics (AOV, cart abandonment, etc.) only matter once you have multiple products and shopping cart.

---

## Dependencies & Blockers (MVP)

### Critical - Required Before Starting
**None!** MVP can start immediately with existing infrastructure.
- ✅ Turso database already set up (just need schema migration)
- ✅ Vercel hosting already configured
- ✅ No authentication needed (guest checkout only)

### External Setup (Can do in parallel - 1-2 hours)
**1. Stripe Account**
- Create account (free, 5 minutes)
- Activate test mode (immediate)
- Create product and price in dashboard (10 minutes)
- Production activation can wait until launch

**2. Vercel Blob**
- Enable in Vercel dashboard (immediate)
- Get API token (2 minutes)
- OR use `public/` directory temporarily for MVP

### Content Required from Author (Before launch)
- Book PDF file
- Book cover image (JPG/PNG, ideally 600x900px)
- Book description (2-3 paragraphs)
- Book title, author name, price

### Legal (Can defer to launch)
- Add refund policy to sales page ("Digital products non-refundable after download")
- Update Privacy Policy to mention Stripe (use Stripe's template)

---

## Risk Assessment (MVP)

### Technical Risks

**Risk 1: Webhook Failure**
- **Impact:** Orders not recorded (user paid but no download)
- **Mitigation:**
  - Test webhooks thoroughly with Stripe CLI
  - Log all webhook events
  - Monitor Stripe dashboard for webhook delivery issues
  - **Workaround:** User can email support with receipt, manually look up session in Stripe dashboard

**Risk 2: PDF Download Issues**
- **Impact:** Customer can't access purchased book
- **Mitigation:**
  - Test download from success page multiple times
  - Ensure Vercel Blob URLs are correctly signed
  - Set clear expiry messaging ("Link expires in 24 hours")
  - **Workaround:** Support can regenerate download link manually via success page URL

**Risk 3: Stripe Test/Production Key Mixup**
- **Impact:** Test purchases in production or vice versa
- **Mitigation:**
  - Use environment variables for all keys
  - Clearly label test vs. production in Stripe dashboard
  - Test one real purchase after deployment (then refund)

### Business Risks

**Risk 4: Low Sales Volume**
- **Impact:** MVP doesn't validate product-market fit
- **Mitigation:**
  - Price competitively for initial launch
  - Promote to existing audience first (warm traffic)
  - If no sales in 30 days, reassess pricing/positioning
  - **MVP benefit:** Low time investment (12-20 hours) limits downside

**Risk 5: Chargebacks/Refund Requests**
- **Impact:** Revenue loss, Stripe fees ($15/chargeback)
- **Mitigation:**
  - Clear refund policy on sales page
  - Accurate book description (set expectations)
  - Respond quickly to support inquiries
  - For MVP: Accept 1-2 refunds as cost of learning

---

## Open Questions (MVP)

### Must Decide Before Starting

1. **Book Price**
   - Q: What is the book priced at? ($XX.XX)
   - A: ____________ (fill in before implementation)

2. **Refund Policy**
   - Q: Any refunds allowed for digital book?
   - Recommendation: "Digital products are non-refundable after download" (industry standard)
   - A: ____________ (decision needed)

3. **File Storage**
   - Q: Use Vercel Blob ($0.15/GB) or keep PDF in `public/` initially?
   - Recommendation: `public/` for MVP (faster), migrate to Blob when scaling
   - A: ____________ (decision needed)

### Can Defer to Later

1. **Tax Collection**
   - Stripe automatically calculates tax based on customer location
   - For US digital products, usually no sales tax
   - No action needed for MVP

2. **International Sales**
   - Stripe Checkout supports international cards automatically
   - No additional work needed for MVP

3. **Support Process**
   - Who responds to "I paid but can't download" emails?
   - Recommendation: Author checks Stripe dashboard, manually sends success page URL
   - Can formalize later if volume increases

---

## Appendix

### A. Stripe Webhook Testing

**Install Stripe CLI:**
```bash
brew install stripe/stripe-cli/stripe
```

**Test Webhooks Locally:**
```bash
# Login to Stripe
stripe login

# Forward webhooks to local dev server
stripe listen --forward-to localhost:3003/api/stripe/webhook

# In another terminal, trigger test checkout completion
stripe trigger checkout.session.completed
```

**Webhook Event to Handle (MVP):**
- `checkout.session.completed` - Critical (create order, mark as completed)

### B. MVP Testing Checklist

**Pre-Launch Testing (Must Complete):**

- [ ] **Happy Path**
  - [ ] Can view book sales page
  - [ ] "Buy Now" button redirects to Stripe Checkout
  - [ ] Can complete purchase with test card (4242 4242 4242 4242)
  - [ ] Redirected to success page after payment
  - [ ] Download link appears on success page
  - [ ] Can download PDF successfully
  - [ ] Order appears in Turso database

- [ ] **Payment Failures**
  - [ ] Declined card shows error (4000 0000 0000 0002)
  - [ ] User can retry payment

- [ ] **Download Security**
  - [ ] Download URL expires after 24 hours
  - [ ] Can re-access success page via bookmark (generates fresh URL)
  - [ ] Invalid session_id shows error message

- [ ] **Mobile**
  - [ ] Sales page looks good on mobile
  - [ ] Stripe Checkout works on mobile
  - [ ] Can download PDF on mobile device

- [ ] **Production**
  - [ ] Test one real purchase with real card
  - [ ] Verify webhook fires in production
  - [ ] Refund test purchase in Stripe dashboard

---

## Approval & Sign-off

**Product Owner:** ___________________ Date: _______

**Engineering Lead:** ___________________ Date: _______

**Design Lead:** ___________________ Date: _______

**Operations Manager:** ___________________ Date: _______

---

## Cost Estimate (MVP)

### Development Time: 12-20 hours @ $XX/hour = $XXX-$XXX

### Monthly Operational Costs:
- **Stripe:** 2.9% + $0.30 per transaction (no monthly fee)
- **Turso:** Free tier (500M row reads/month) - adequate for MVP
- **Vercel Blob:** $0.15/GB storage, $0.20/GB transfer - ~$1-5/month
- **Vercel Hosting:** Likely already covered by existing plan

**Total Monthly: ~$1-5 (plus Stripe transaction fees)**

### Break-Even Analysis:
If book sells for $29:
- Stripe fee: $1.14
- Net per sale: $27.86
- Break-even at ~1-2 sales (covers first month ops)
- Development costs recovered after ~10-20 sales (assuming $500-1000 dev investment)

### Comparison to Alternatives:
- **Gumroad:** 10% fee ($2.90/sale) + payment processing
- **Amazon KDP:** 30-65% commission
- **Custom solution:** $0 commission (only 2.9% + $0.30 payment processing)

**ROI:** If this generates 50+ sales, MVP pays for itself and validates building more features.

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-16 | Product Team | Initial draft (comprehensive, 160-215 hours) |
| 1.1 | 2025-10-16 | Engineering Team | Updated database specs from Prisma + PostgreSQL to Turso + Drizzle ORM |
| 2.0 | 2025-10-16 | Product Team | **Scope reduction to MVP (12-20 hours)** - Single book, guest checkout, Stripe-hosted payment, minimal features. Future expansion documented but not implemented. |

---

## Related Documents

- [Video Integration Plan](/docs/specs/video-integration-simplified.md)
- [Performance Optimization PRD](/docs/specs/performance-optimization.prd.md)
- [Architecture Documentation](/CLAUDE.md)
- Stripe Integration Guide (to be created)
- Email Template Specifications (to be created)
- Admin User Guide (to be created)
