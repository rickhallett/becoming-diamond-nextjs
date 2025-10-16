# PRD: Book Purchasing with Stripe Integration

**Status:** Draft
**Created:** 2025-10-16
**Owner:** Product Team
**Target Release:** TBD

---

## Executive Summary

Implement e-commerce functionality to sell digital and physical books through the Becoming Diamond platform using Stripe as the payment processor. This feature will enable content creators to monetize their book content alongside the existing course offerings, creating an additional revenue stream while providing value to members.

### Goals
- Enable book sales through a seamless checkout experience
- Integrate with existing Becoming Diamond brand and member portal
- Provide secure payment processing with industry-standard compliance
- Support both digital and physical book fulfillment
- Track orders and provide purchase history to users

### Non-Goals (Out of Scope)
- Marketplace for third-party authors
- Subscription-based book access (focus on one-time purchases)
- Print-on-demand integration (manual fulfillment initially)
- International currency support (USD only for MVP)
- Gift purchases or gift cards

---

## Problem Statement

The Becoming Diamond platform currently focuses on course-based content delivery. However, the program philosophy and teachings could be extended through companion books, workbooks, and reference materials. Currently, there is no way to sell these materials directly through the platform, forcing potential customers to external storefronts and creating a disjointed user experience.

### User Pain Points
- Members must leave platform to purchase related materials
- No centralized location for program-related books
- Difficulty tracking which books a member has purchased
- Missed cross-sell opportunities (books to course members, courses to book buyers)

### Business Impact
- Lost revenue from book sales going to external platforms
- Reduced customer lifetime value
- Fragmented brand experience
- Manual order fulfillment overhead

---

## User Personas

### Primary: Sarah - Committed Member
- **Demographics:** 35-year-old professional, existing course member
- **Goals:** Deepen understanding through supplemental materials
- **Pain Points:** Wants seamless purchasing without leaving trusted platform
- **Technical Comfort:** Medium (comfortable with online shopping)

### Secondary: Marcus - Book-First Buyer
- **Demographics:** 42-year-old skeptical of online programs
- **Goals:** Test the philosophy with a lower-commitment purchase
- **Pain Points:** Unsure if full course is worth investment
- **Technical Comfort:** High (frequent online shopper)

### Tertiary: Admin - Content Creator
- **Demographics:** Program owner/author
- **Goals:** Easily add new books, track sales, fulfill orders
- **Pain Points:** Complex technical systems, time-consuming order management
- **Technical Comfort:** Low-medium (uses Decap CMS currently)

---

## User Stories

### Epic 1: Book Discovery & Browsing

**US-001: Browse Book Catalog**
```
As a visitor
I want to view all available books in a catalog
So that I can discover relevant materials
```
**Acceptance Criteria:**
- Book catalog page displays at `/books`
- Each book shows: cover image, title, author, price, short description
- Books are sortable by: newest, price (low-high, high-low), title
- Mobile-responsive grid layout (1 col mobile, 2 col tablet, 3-4 col desktop)
- "Out of stock" indicator for physical books
- Clear distinction between digital and physical products

**US-002: View Book Details**
```
As a visitor
I want to view detailed information about a book
So that I can make an informed purchase decision
```
**Acceptance Criteria:**
- Individual book page at `/books/[slug]`
- Displays: full description, table of contents, author bio, sample pages/preview
- Shows format options (digital PDF, physical paperback, bundle)
- Reviews/testimonials section (manual curation initially)
- "Add to Cart" button prominent and accessible
- Related books section (manual curation initially)
- SEO optimized (Open Graph tags, meta descriptions)

### Epic 2: Shopping & Checkout

**US-003: Add Books to Cart**
```
As a visitor
I want to add multiple books to a cart
So that I can purchase several items at once
```
**Acceptance Criteria:**
- Cart icon in header shows item count
- Add to cart button adds item without page refresh
- Toast notification confirms addition
- Cart persists across page navigation (localStorage)
- Cart accessible from any page via header icon
- Quantity adjustment (1-10 per item)
- Remove item functionality
- Cart shows subtotal before checkout

**US-004: Complete Purchase**
```
As a visitor
I want to securely pay for my books
So that I can receive my purchase
```
**Acceptance Criteria:**
- Checkout page at `/checkout` shows order summary
- Stripe Payment Element embedded (card, Apple Pay, Google Pay supported)
- Collects: email, shipping address (if physical), billing address
- Email validation and format checking
- Clear total breakdown (subtotal, tax if applicable, shipping, total)
- Order processing indicator during payment
- Error messages for declined cards (user-friendly language)
- Order confirmation page at `/orders/[orderId]/confirmation`
- Confirmation email sent automatically

### Epic 3: Order Management

**US-005: View Purchase History**
```
As a member
I want to see my past book purchases
So that I can track orders and re-download digital books
```
**Acceptance Criteria:**
- Purchase history page at `/app/orders`
- Lists all orders with: date, items, total, status (processing, shipped, delivered)
- Click order to view details page
- Digital books show "Download" button (generates signed URL, 24hr expiry)
- Physical books show tracking number when shipped
- Filter by: all orders, digital only, physical only, date range
- Export order history to PDF

**US-006: Access Digital Downloads**
```
As a member
I want to download my purchased digital books
So that I can read them on my devices
```
**Acceptance Criteria:**
- "My Books" section in member portal sidebar
- Grid of purchased book covers
- Click cover to download or view in browser (PDF viewer)
- Re-download available unlimited times
- Download URLs expire after 24 hours (regenerate on each access)
- PDF includes watermark with purchaser email (piracy deterrent)
- Mobile-optimized reading experience

### Epic 4: Admin Management

**US-007: Add New Book**
```
As an admin
I want to add a new book through the CMS
So that it appears in the catalog
```
**Acceptance Criteria:**
- New "Books" collection in Decap CMS (`/admin`)
- Fields: title, slug, author, description, long description, cover image, price (digital), price (physical), ISBN, page count, format options, sample pages (PDF), published status
- Markdown support for descriptions
- Cover image upload (auto-resize to 600x900px)
- Preview functionality before publishing
- Books sync to Stripe Products API on publish

**US-008: Fulfill Orders**
```
As an admin
I want to view pending orders
So that I can fulfill physical book shipments
```
**Acceptance Criteria:**
- Admin order dashboard at `/admin/orders` (new custom page)
- Lists unfulfilled orders with: order ID, customer name, items, shipping address
- Mark as fulfilled (adds tracking number, triggers email to customer)
- Export orders to CSV for bulk processing
- Filter by: pending, fulfilled, canceled
- Search by customer name or order ID

---

## Functional Requirements

### Book Catalog Management

**FR-1: Content Structure**
- Books stored as markdown files in `content/books/` directory
- Frontmatter schema:
  ```yaml
  title: "The Diamond Journey"
  slug: "diamond-journey"
  author: "Author Name"
  description: "Short description (160 chars)"
  longDescription: "Full description with markdown support"
  coverImage: "/images/books/diamond-journey-cover.jpg"
  priceDigital: 29.99
  pricePhysical: 39.99
  priceBundle: 59.99  # Both formats
  isbn: "978-1-234567-89-0"
  pageCount: 240
  publishDate: "2025-03-01"
  published: true
  formatOptions: ["digital", "physical", "bundle"]
  samplePdf: "/samples/diamond-journey-sample.pdf"
  digitalFile: "/products/diamond-journey-full.pdf"  # Secure storage path
  tags: ["transformation", "mindset", "workbook"]
  featured: true  # Show on homepage
  ```

**FR-2: Book Display**
- Public catalog page with grid layout
- Server-side rendering for SEO
- Dynamic routes for individual book pages (`/books/[slug]`)
- Static generation with `generateStaticParams()` at build time
- Responsive images with next/image optimization

**FR-3: Search & Discovery**
- Client-side filtering by tags (no backend search for MVP)
- Sort options: newest, price, title (A-Z)
- Featured books section on homepage
- Related books (manually curated via tags)

### Shopping Cart

**FR-4: Cart Functionality**
- Client-side cart state management (React Context or Zustand)
- Persist to localStorage (survives page refresh, 7-day expiry)
- Cart operations: add, remove, update quantity, clear
- Support multiple format selections (digital + physical = bundle price)
- Cart accessible from all pages via header component

**FR-5: Cart Validation**
- Quantity limits (max 10 per item)
- Stock validation for physical books (check inventory)
- Price validation on checkout (server-side verification)
- Handle out-of-stock scenarios (remove from cart, notify user)

### Payment Processing

**FR-6: Stripe Integration**
- Stripe Payment Element for checkout form
- Support payment methods: credit/debit cards, Apple Pay, Google Pay
- Webhook endpoint at `/api/stripe/webhook` for payment events
- Events handled: `payment_intent.succeeded`, `payment_intent.failed`, `charge.refunded`
- Idempotency keys for all Stripe API calls (prevent duplicate charges)

**FR-7: Order Creation**
- Create order record on successful payment
- Order schema:
  ```typescript
  {
    id: string;  // uuid
    orderNumber: string;  // human-readable (e.g., "BD-2025-0001")
    userId: string | null;  // null for guest checkout
    email: string;
    status: 'pending' | 'processing' | 'completed' | 'canceled' | 'refunded';
    items: [
      {
        bookSlug: string;
        title: string;
        format: 'digital' | 'physical' | 'bundle';
        quantity: number;
        priceAtPurchase: number;  // Store price in case it changes later
      }
    ];
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    shippingAddress: {
      name: string;
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    } | null;
    stripePaymentIntentId: string;
    stripeChargeId: string;
    createdAt: timestamp;
    updatedAt: timestamp;
  }
  ```

**FR-8: Tax Calculation**
- Use Stripe Tax for automatic tax calculation (US only for MVP)
- Tax-exempt for digital products in most states (physical books may have sales tax)
- Display tax breakdown in cart and checkout

**FR-9: Shipping**
- Flat-rate shipping for physical books: $5.99 (US only)
- Free shipping on orders over $50
- Digital-only orders have no shipping fee
- No international shipping for MVP

### Order Fulfillment

**FR-10: Digital Delivery**
- Generate secure download URLs with signed tokens
- URLs expire after 24 hours (regenerate on each access)
- Store PDFs in private S3 bucket or Vercel Blob Storage
- PDF watermarking with purchaser email (using pdf-lib)
- Email delivery: send download link immediately after purchase

**FR-11: Physical Fulfillment**
- Admin dashboard shows pending shipments
- Manual fulfillment workflow:
  1. Admin prints packing slip from order page
  2. Ships book via USPS/UPS
  3. Enters tracking number in admin panel
  4. System sends shipping notification email to customer
- Tracking number updates order status to "shipped"

**FR-12: Email Notifications**
- Order confirmation (immediate)
- Digital download links (immediate)
- Shipping notification with tracking (when fulfilled)
- Refund processed (if applicable)
- Use Resend or SendGrid for email delivery
- Templates styled to match Becoming Diamond brand

### Authentication Integration

**FR-13: Guest Checkout**
- Allow purchases without account (email-only identification)
- Option to "Create account" during checkout (save address, access downloads)
- Guest orders linked to email address

**FR-14: Member Purchases**
- Logged-in members have pre-filled email and saved addresses
- Orders automatically linked to user account
- Purchase history accessible in member portal
- Digital downloads available in "My Books" section

**FR-15: Account Creation Post-Purchase**
- Guest purchasers can claim their order by creating an account with same email
- Automatic order association on account creation
- Prompt to create account on confirmation page

---

## Technical Requirements

### Architecture

**TR-1: Technology Stack**
- **Payment Processing:** Stripe (stripe npm package, @stripe/stripe-js)
- **Database:** Prisma + PostgreSQL (or Supabase for hosted solution)
- **File Storage:** Vercel Blob Storage for PDFs (or AWS S3)
- **Email:** Resend (resend npm package) - modern, developer-friendly
- **PDF Processing:** pdf-lib for watermarking
- **State Management:** Zustand for cart (lightweight, TypeScript-friendly)

**TR-2: Database Schema**

```prisma
// prisma/schema.prisma

model Book {
  id            String   @id @default(uuid())
  slug          String   @unique
  title         String
  author        String
  description   String
  coverImage    String
  priceDigital  Decimal?
  pricePhysical Decimal?
  priceBundle   Decimal?
  stripeProductId String?
  stripePriceIdDigital String?
  stripePriceIdPhysical String?
  stripePriceIdBundle String?
  digitalFileUrl String?  // Secure storage URL
  published     Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  orderItems    OrderItem[]
}

model Order {
  id                    String   @id @default(uuid())
  orderNumber           String   @unique
  userId                String?
  email                 String
  status                OrderStatus
  subtotal              Decimal
  tax                   Decimal
  shipping              Decimal
  total                 Decimal
  shippingAddress       Json?
  stripePaymentIntentId String   @unique
  stripeChargeId        String?
  trackingNumber        String?
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  items                 OrderItem[]
  user                  User?    @relation(fields: [userId], references: [id])
}

model OrderItem {
  id               String  @id @default(uuid())
  orderId          String
  bookId           String
  bookSlug         String  // Denormalized for historical accuracy
  title            String  // Denormalized
  format           BookFormat
  quantity         Int
  priceAtPurchase  Decimal

  order            Order   @relation(fields: [orderId], references: [id])
  book             Book    @relation(fields: [bookId], references: [id])
}

enum OrderStatus {
  PENDING
  PROCESSING
  COMPLETED
  SHIPPED
  CANCELED
  REFUNDED
}

enum BookFormat {
  DIGITAL
  PHYSICAL
  BUNDLE
}

// Extend existing User model (if exists)
model User {
  id       String  @id @default(uuid())
  email    String  @unique
  name     String?
  // ... existing fields
  orders   Order[]
}
```

**TR-3: API Endpoints**

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/api/books` | GET | List all published books | No |
| `/api/books/[slug]` | GET | Get single book details | No |
| `/api/cart/validate` | POST | Validate cart contents and prices | No |
| `/api/stripe/create-payment-intent` | POST | Create Stripe payment intent | No |
| `/api/stripe/webhook` | POST | Handle Stripe webhooks | No (signature verification) |
| `/api/orders` | GET | Get user's order history | Yes (user) |
| `/api/orders/[orderId]` | GET | Get single order details | Yes (user or guest with token) |
| `/api/orders/[orderId]/download` | POST | Generate download URL for digital book | Yes |
| `/api/admin/orders` | GET | List all orders (with filters) | Yes (admin) |
| `/api/admin/orders/[orderId]/fulfill` | POST | Mark order as fulfilled, add tracking | Yes (admin) |
| `/api/admin/books/sync` | POST | Sync book to Stripe Products API | Yes (admin) |

**TR-4: File Structure**

```
src/
├── app/
│   ├── books/
│   │   ├── page.tsx                 # Book catalog
│   │   └── [slug]/
│   │       └── page.tsx             # Individual book page
│   ├── checkout/
│   │   └── page.tsx                 # Checkout flow
│   ├── orders/
│   │   └── [orderId]/
│   │       └── confirmation/
│   │           └── page.tsx         # Order confirmation
│   ├── app/
│   │   ├── orders/
│   │   │   └── page.tsx             # User order history
│   │   └── books/
│   │       └── page.tsx             # User's purchased books
│   ├── admin/
│   │   └── orders/
│   │       ├── page.tsx             # Admin order dashboard
│   │       └── [orderId]/
│   │           └── page.tsx         # Admin order detail
│   └── api/
│       ├── books/
│       │   ├── route.ts
│       │   └── [slug]/
│       │       └── route.ts
│       ├── cart/
│       │   └── validate/
│       │       └── route.ts
│       ├── stripe/
│       │   ├── create-payment-intent/
│       │   │   └── route.ts
│       │   └── webhook/
│       │       └── route.ts
│       ├── orders/
│       │   ├── route.ts
│       │   └── [orderId]/
│       │       ├── route.ts
│       │       └── download/
│       │           └── route.ts
│       └── admin/
│           ├── orders/
│           │   ├── route.ts
│           │   └── [orderId]/
│           │       └── fulfill/
│           │           └── route.ts
│           └── books/
│               └── sync/
│                   └── route.ts
├── components/
│   ├── books/
│   │   ├── BookCard.tsx             # Book grid item
│   │   ├── BookGrid.tsx             # Book catalog grid
│   │   ├── BookDetail.tsx           # Book detail layout
│   │   └── BookFilters.tsx          # Sort/filter controls
│   ├── cart/
│   │   ├── CartDrawer.tsx           # Slide-out cart
│   │   ├── CartIcon.tsx             # Header cart icon
│   │   ├── CartItem.tsx             # Single cart item
│   │   └── CartSummary.tsx          # Totals display
│   ├── checkout/
│   │   ├── CheckoutForm.tsx         # Main checkout component
│   │   ├── PaymentForm.tsx          # Stripe Payment Element wrapper
│   │   ├── ShippingForm.tsx         # Address collection
│   │   └── OrderSummary.tsx         # Right sidebar summary
│   └── orders/
│       ├── OrderList.tsx            # Order history list
│       ├── OrderCard.tsx            # Single order display
│       └── DownloadButton.tsx       # Digital download CTA
├── lib/
│   ├── stripe.ts                    # Stripe client initialization
│   ├── books.ts                     # Book data fetching utilities
│   ├── orders.ts                    # Order management utilities
│   └── email.ts                     # Email sending utilities
├── stores/
│   └── cart.ts                      # Zustand cart store
└── types/
    ├── book.ts                      # Book TypeScript types
    ├── order.ts                     # Order TypeScript types
    └── cart.ts                      # Cart TypeScript types

content/
└── books/
    ├── diamond-journey.md           # Example book content
    └── transformation-workbook.md

prisma/
├── schema.prisma                    # Database schema
└── migrations/                      # Database migrations

public/
├── images/
│   └── books/
│       ├── covers/                  # Book cover images
│       └── samples/                 # Sample page images
└── products/                        # Digital book files (dev only, use cloud storage in prod)
```

**TR-5: Environment Variables**

```bash
# .env.local

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/becoming_diamond

# File Storage (choose one)
# Option A: Vercel Blob
BLOB_READ_WRITE_TOKEN=vercel_blob_...

# Option B: AWS S3
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET_NAME=...
AWS_REGION=us-east-1

# Email
RESEND_API_KEY=re_...
EMAIL_FROM="Becoming Diamond <orders@becomingdiamond.com>"

# App
NEXT_PUBLIC_APP_URL=http://localhost:3003  # For email links

# Admin (simple auth for MVP)
ADMIN_EMAIL=admin@becomingdiamond.com
```

**TR-6: Security Requirements**

- All API endpoints validate input with Zod schemas
- Webhook signature verification for Stripe events
- Signed URLs for digital downloads (24-hour expiry)
- PDF watermarking to deter piracy
- Rate limiting on payment endpoints (max 10 attempts per hour per IP)
- HTTPS required in production
- Environment variables never exposed to client
- Order amount validation on server (never trust client)
- SQL injection prevention (Prisma prepared statements)
- XSS protection (React auto-escaping, sanitize user input)

**TR-7: Performance Requirements**

- Book catalog page loads in <2s (LCP)
- Checkout page loads in <1.5s
- Payment processing completes in <3s (Stripe API latency)
- Digital downloads available immediately after payment (via webhook)
- Book images optimized (WebP/AVIF, max 200KB per cover)
- Static generation for book pages (rebuild on content changes)
- Cart operations feel instant (<100ms)

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

## Implementation Phases

### Phase 0: Prerequisites (1 week)
**Blockers must be resolved first**

**Tasks:**
- [ ] Implement authentication system (NextAuth.js or similar)
  - GitHub OAuth (already have credentials)
  - Email/password as alternative
  - Session management
  - Protected route middleware
- [ ] Set up database
  - Install Prisma
  - Configure PostgreSQL (local + production)
  - Create initial schema (User model)
  - Set up migrations
- [ ] Choose and configure email provider (Resend recommended)
- [ ] Choose file storage solution (Vercel Blob recommended)

**Deliverables:**
- Authentication working on member portal
- Database connected and migrated
- Email sending functional (test email)
- File upload/download tested

**Dependencies:**
- None (blocks all other phases)

**Estimated Effort:** 20-30 hours

---

### Phase 1: Foundation (1 week)
**MVP: Single book, direct checkout (no cart)**

**Tasks:**
- [ ] Install dependencies
  ```bash
  npm install stripe @stripe/stripe-js zustand prisma @prisma/client resend pdf-lib zod
  npm install -D @types/node
  ```
- [ ] Set up Stripe account (test mode)
- [ ] Create database schema (Book, Order, OrderItem models)
- [ ] Run Prisma migrations
- [ ] Configure Stripe client (`src/lib/stripe.ts`)
- [ ] Create "Books" collection in Decap CMS
- [ ] Add first test book via CMS
- [ ] Create book catalog page (list view only)
- [ ] Create book detail page (static generation)

**Deliverables:**
- Books visible on website
- Database schema deployed
- One test book in catalog
- Book detail pages rendering

**Acceptance Criteria:**
- `/books` page displays books from CMS
- `/books/[slug]` shows full book details
- Cover images load properly
- Price displays correctly
- SEO meta tags present

**Estimated Effort:** 25-35 hours

---

### Phase 2: Checkout & Payment (1.5 weeks)
**Goal: Complete purchase flow for single book**

**Tasks:**
- [ ] Create Stripe checkout session API (`/api/stripe/create-payment-intent`)
- [ ] Build checkout page UI
- [ ] Integrate Stripe Payment Element
- [ ] Collect shipping address form (if physical book)
- [ ] Server-side price validation
- [ ] Create webhook endpoint (`/api/stripe/webhook`)
- [ ] Implement webhook signature verification
- [ ] Handle `payment_intent.succeeded` event
  - Create order in database
  - Send confirmation email
  - Generate download link for digital books
- [ ] Handle `payment_intent.failed` event
- [ ] Create order confirmation page
- [ ] Build email templates (order confirmation, digital delivery)
- [ ] Test with Stripe test cards

**Deliverables:**
- Working checkout flow
- Order creation on successful payment
- Email notifications sent
- Order confirmation page

**Acceptance Criteria:**
- User can complete purchase with test card
- Order appears in database
- Confirmation email received
- Digital download link works
- Failed payments show error message
- Webhook events logged

**Test Scenarios:**
- ✅ Successful card payment (4242 4242 4242 4242)
- ✅ Declined card (4000 0000 0000 0002)
- ✅ Insufficient funds (4000 0000 0000 9995)
- ✅ Digital book purchase
- ✅ Physical book purchase
- ✅ Webhook replay attack (signature invalid)

**Estimated Effort:** 35-45 hours

---

### Phase 3: Shopping Cart (1 week)
**Goal: Multiple book purchases in one transaction**

**Tasks:**
- [ ] Create Zustand cart store
- [ ] Build cart icon with item count (header)
- [ ] Create cart drawer component (slide-out)
- [ ] Implement cart operations (add, remove, update quantity)
- [ ] Cart persistence (localStorage)
- [ ] Cart validation API (`/api/cart/validate`)
- [ ] Update checkout to accept multiple items
- [ ] Update order creation to handle multiple items
- [ ] Modify Stripe payment intent to include line items
- [ ] Test multi-item purchases

**Deliverables:**
- Shopping cart with add/remove/update
- Cart persists across sessions
- Multi-item checkout works
- Order confirmation shows all items

**Acceptance Criteria:**
- Add to cart from book detail page
- Cart icon shows correct count
- Cart drawer opens with animation
- Remove item works
- Quantity adjustment works (1-10)
- Cart total calculates correctly
- Empty cart shows placeholder
- Checkout processes all items
- Confirmation email lists all purchases

**Estimated Effort:** 25-30 hours

---

### Phase 4: Order Management (1 week)
**Goal: Users can view orders, download books**

**Tasks:**
- [ ] Create "My Orders" page in member portal (`/app/orders`)
- [ ] Build order list component
- [ ] Create order detail page
- [ ] Implement download URL generation API (`/api/orders/[orderId]/download`)
- [ ] Add PDF watermarking with pdf-lib
- [ ] Build "My Books" page (`/app/books`)
- [ ] Create download button component
- [ ] Add download expiry handling (24 hours)
- [ ] Build order filtering (all, digital, physical)
- [ ] Guest order access (email + order number lookup)

**Deliverables:**
- Order history page
- Digital download functionality
- PDF watermarking
- Guest order lookup

**Acceptance Criteria:**
- Logged-in users see all orders
- Orders sorted by date (newest first)
- Click order to view details
- Download button generates fresh URL
- PDF opens with email watermark
- Download URL expires after 24 hours
- Physical orders show "pending shipment"
- Guest users can access order via email link

**Estimated Effort:** 30-40 hours

---

### Phase 5: Admin Fulfillment (1 week)
**Goal: Admins can manage orders and fulfill shipments**

**Tasks:**
- [ ] Create admin middleware (role-based access)
- [ ] Build admin order dashboard (`/admin/orders`)
- [ ] Order list with filters (pending, fulfilled, all)
- [ ] Order detail page for admin
- [ ] Implement fulfillment API (`/api/admin/orders/[orderId]/fulfill`)
- [ ] Add tracking number field
- [ ] Send shipping notification email
- [ ] Export orders to CSV
- [ ] Add order search (by email, order number)
- [ ] Packing slip generation (print view)

**Deliverables:**
- Admin order dashboard
- Order fulfillment workflow
- Shipping notifications
- CSV export

**Acceptance Criteria:**
- Admin can view all orders
- Filter by status works
- Mark order as fulfilled
- Add tracking number
- Customer receives shipping email with tracking
- CSV export includes all order data
- Print packing slip shows address and items
- Non-admin users cannot access admin pages

**Estimated Effort:** 25-35 hours

---

### Phase 6: Polish & Optimization (1 week)
**Goal: Production-ready experience**

**Tasks:**
- [ ] Add loading states (skeleton screens)
- [ ] Error boundary components
- [ ] Retry logic for failed webhooks
- [ ] Rate limiting on checkout endpoint
- [ ] Add analytics events (add to cart, purchase, etc.)
- [ ] SEO optimization (structured data for books)
- [ ] Mobile responsiveness testing
- [ ] Accessibility audit (WCAG AA compliance)
- [ ] Performance optimization
  - Image optimization (next/image)
  - Code splitting for checkout
  - Lazy load cart drawer
- [ ] Error tracking setup (Sentry)
- [ ] Create user documentation
- [ ] Create admin documentation

**Deliverables:**
- Polished UI/UX
- Performance optimized
- Production monitoring
- Documentation

**Acceptance Criteria:**
- Lighthouse score >90 on all pages
- Mobile usability 100%
- Accessibility score >90
- All user flows tested on mobile
- Error tracking active
- Documentation published

**Estimated Effort:** 25-30 hours

---

### Phase 7: Advanced Features (Future)
**Post-MVP enhancements**

**Potential Features:**
- Bundle deals (course + book discounts)
- Discount codes / coupon system
- Affiliate program
- Book reviews (user-generated)
- Wishlist functionality
- Gift purchases
- Pre-orders for upcoming books
- Print-on-demand integration
- International shipping
- Multi-currency support
- Subscription box (monthly book club)
- Audiobook support
- Sample chapter downloads (lead magnet)
- Automatic upsells (related courses)

---

## Success Metrics

### Primary KPIs

**Revenue Metrics:**
- Monthly book revenue
- Average order value (AOV)
- Revenue per visitor (RPV)
- Digital vs. physical split

**Conversion Metrics:**
- Catalog → Detail page (CTR)
- Detail page → Add to cart (conversion rate)
- Cart → Checkout (cart abandonment rate)
- Checkout → Purchase (checkout conversion rate)
- Overall conversion funnel (catalog → purchase)

**Operational Metrics:**
- Failed payment rate (<5% target)
- Webhook processing success rate (>99.9% target)
- Order fulfillment time (physical books <48 hours)
- Digital delivery time (<5 minutes)
- Support tickets related to orders (<2% of orders)

### Target Metrics (6 months post-launch)

- **Monthly revenue:** $5,000+
- **Conversion rate:** 2-5% (catalog visitors → purchasers)
- **AOV:** $40-60
- **Cart abandonment:** <70%
- **Failed payments:** <3%
- **Fulfillment time:** <24 hours (90th percentile)
- **Customer satisfaction:** >4.5/5 stars

### Monitoring Tools

- **Analytics:** Vercel Analytics or Google Analytics 4
- **Error Tracking:** Sentry
- **Stripe Dashboard:** Payment metrics, revenue reports
- **Custom Dashboard:** Order fulfillment metrics (build in admin panel)

---

## Dependencies & Blockers

### Critical Blockers (Must Resolve Before Start)

**1. Authentication System (HIGH PRIORITY)**
- **Issue:** Member portal has no authentication
- **Impact:** Cannot link orders to users, no purchase history, no protected downloads
- **Solution:** Implement NextAuth.js with GitHub OAuth + email/password
- **Timeline:** 1 week
- **Owner:** Backend team

**2. Database Infrastructure**
- **Issue:** No database currently (file-based CMS only)
- **Impact:** Cannot store orders, user data, transactions
- **Solution:** Add Prisma + PostgreSQL (or Supabase)
- **Timeline:** 3-5 days
- **Owner:** DevOps/Backend team

### External Dependencies

**1. Stripe Account**
- Create account (free)
- Complete business verification (1-3 days)
- Activate test mode (immediate)
- Production approval (submit when ready)

**2. Email Service Provider**
- Resend account (recommended)
- Domain verification (DNS records, 24-48 hours)
- Send test emails

**3. File Storage**
- Vercel Blob (if using Vercel hosting) - immediate
- OR AWS S3 setup (1-2 days for IAM, bucket policies)

### Internal Dependencies

**1. Content Creation**
- At least 1 book ready for launch (PDF, cover image, metadata)
- Ideally 3-5 books for catalog

**2. Design Assets**
- Book cover images (600x900px minimum)
- Sample pages or preview PDFs
- Email template designs

**3. Legal/Compliance**
- Terms of Service (mention refund policy)
- Privacy Policy (mention payment data handling)
- Refund policy (digital vs. physical)
- Tax nexus determination (if selling physical products)

**4. Business Operations**
- Physical book inventory management
- Shipping supplies (boxes, labels)
- Return/refund process
- Customer support procedures

---

## Risk Assessment

### Technical Risks

**Risk 1: Webhook Reliability**
- **Likelihood:** Medium
- **Impact:** High (orders not created if webhook fails)
- **Mitigation:**
  - Implement retry logic with exponential backoff
  - Log all webhook events
  - Alert on failures
  - Poll Stripe API for payment status as backup
  - Test webhook handling thoroughly

**Risk 2: Digital File Piracy**
- **Likelihood:** Medium
- **Impact:** Medium (revenue loss from shared PDFs)
- **Mitigation:**
  - PDF watermarking with purchaser email
  - Expiring download URLs (24 hours)
  - Monitor for unauthorized distribution
  - Consider DRM if piracy becomes significant
  - Price books competitively to reduce piracy incentive

**Risk 3: Payment Fraud**
- **Likelihood:** Low-Medium
- **Impact:** High (chargebacks, financial loss)
- **Mitigation:**
  - Use Stripe Radar for fraud detection (included)
  - Limit digital delivery to verified payments
  - Monitor chargeback rate
  - Require CVV for all transactions
  - Implement velocity limits (max purchases per user per day)

**Risk 4: Database Performance**
- **Likelihood:** Low (small scale initially)
- **Impact:** Medium (slow page loads, timeouts)
- **Mitigation:**
  - Index frequently queried fields (userId, email, orderNumber)
  - Cache book catalog data (revalidate on CMS publish)
  - Use connection pooling (Prisma built-in)
  - Monitor query performance

### Business Risks

**Risk 5: Low Conversion Rate**
- **Likelihood:** Medium
- **Impact:** High (feature doesn't generate revenue)
- **Mitigation:**
  - A/B test pricing
  - Offer digital + physical bundles (higher perceived value)
  - Free sample chapters as lead magnet
  - Cross-sell to existing course members (they already trust brand)
  - Guest checkout to reduce friction

**Risk 6: High Cart Abandonment**
- **Likelihood:** Medium-High (typical e-commerce is 60-80%)
- **Impact:** Medium (lost sales)
- **Mitigation:**
  - Abandon cart email sequence (if user logged in)
  - Show security badges on checkout
  - Display total upfront (no surprise fees)
  - Fast checkout (minimize form fields)
  - Apple Pay / Google Pay for one-click purchase

**Risk 7: Fulfillment Bottleneck**
- **Likelihood:** Medium (manual process)
- **Impact:** Medium (slow shipping, customer dissatisfaction)
- **Mitigation:**
  - Clear fulfillment SLA (ship within 48 hours)
  - Admin dashboard prioritizes pending orders
  - Consider ShipStation integration for scaling
  - Automate packing slip generation

### Operational Risks

**Risk 8: Customer Support Volume**
- **Likelihood:** Medium
- **Impact:** Medium (time-consuming, support costs)
- **Mitigation:**
  - Comprehensive FAQ page
  - Self-service order tracking
  - Clear refund policy displayed
  - Automated emails reduce "where is my order" tickets
  - Knowledge base for common issues

**Risk 9: Refund/Chargeback Rate**
- **Likelihood:** Low
- **Impact:** Medium (revenue loss, Stripe fees)
- **Mitigation:**
  - Clear refund policy (digital books non-refundable after download)
  - 30-day refund for physical books (unopened)
  - High-quality book covers and descriptions (set accurate expectations)
  - Prompt customer service
  - Target <1% chargeback rate

---

## Open Questions

### Product Questions

1. **Pricing Strategy**
   - Q: What price points for books? ($9.99, $19.99, $29.99 tiers?)
   - Q: Bundle discount percentage? (e.g., digital + physical for 20% off?)
   - Q: Dynamic pricing or fixed?

2. **Refund Policy**
   - Q: Are digital books refundable? (Industry standard: no refunds after download)
   - Q: Physical book return window? (30 days?)
   - Q: Restocking fee for physical returns?

3. **Content Strategy**
   - Q: How many books at launch? (Recommend 3-5 minimum)
   - Q: Release cadence? (New book every quarter?)
   - Q: Workbooks vs. full books vs. journals?

4. **Cross-Selling**
   - Q: Should book purchasers get discount on course? (Lead gen strategy)
   - Q: Should course members get free/discounted books? (Retention strategy)
   - Q: Bundle books with specific course modules?

### Technical Questions

1. **File Storage**
   - Q: Vercel Blob vs. AWS S3? (Cost, simplicity, scalability)
   - Q: Max file size for digital books? (Assume <50MB?)
   - Q: Support EPUB/MOBI or PDF only?

2. **Tax Handling**
   - Q: Which states require sales tax collection? (Stripe Tax handles automatically)
   - Q: Is company registered for sales tax? (Economic nexus thresholds)
   - Q: Tax-exempt customers? (Non-profit, education?)

3. **Internationalization**
   - Q: Launch with US-only or international? (Recommend US-only MVP)
   - Q: Future plans for non-USD currencies?
   - Q: International shipping rates?

4. **Authentication**
   - Q: Use existing auth system or implement new? (Depends on Phase 0 decision)
   - Q: Social login options? (GitHub, Google, Facebook?)
   - Q: Guest checkout allowed? (Recommend yes)

### Operations Questions

1. **Fulfillment**
   - Q: Who handles physical book fulfillment? (In-house or 3PL?)
   - Q: Current inventory levels?
   - Q: Inventory management system?

2. **Customer Support**
   - Q: Who handles order support? (Dedicated support or general inquiries?)
   - Q: Support hours? (Business hours only or 24/7?)
   - Q: Expected support volume?

3. **Analytics**
   - Q: Which metrics to track daily vs. weekly?
   - Q: Who has access to admin dashboard?
   - Q: Reporting cadence (daily, weekly, monthly)?

---

## Appendix

### A. Stripe Webhook Events Reference

**Events to Handle:**

| Event | Priority | Action |
|-------|----------|--------|
| `payment_intent.succeeded` | Critical | Create order, send confirmation email, deliver digital books |
| `payment_intent.payment_failed` | High | Log failure, notify customer (optional) |
| `charge.refunded` | High | Update order status to refunded, send refund confirmation |
| `charge.dispute.created` | Medium | Alert admin, flag order for review |
| `payment_intent.canceled` | Low | Log event (usually user canceled) |

**Webhook Testing:**
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local dev server
stripe listen --forward-to localhost:3003/api/stripe/webhook

# Trigger test event
stripe trigger payment_intent.succeeded
```

### B. Email Templates Required

1. **Order Confirmation (All Orders)**
   - Subject: "Your Becoming Diamond order confirmation (#ORDER_NUMBER)"
   - Content: Order summary, items, total, billing address, expected delivery
   - CTA: View order details (link to order page)

2. **Digital Delivery (Digital Books)**
   - Subject: "Your books are ready to download!"
   - Content: List of purchased books with download buttons
   - Note: Download links expire in 24 hours
   - CTA: Download now

3. **Shipping Notification (Physical Books)**
   - Subject: "Your order has shipped!"
   - Content: Tracking number, carrier, estimated delivery
   - CTA: Track package

4. **Refund Processed**
   - Subject: "Your refund has been processed"
   - Content: Refund amount, reason, timeline (5-10 business days)

5. **Guest Order Access (Guest Checkout)**
   - Subject: "Access your Becoming Diamond order"
   - Content: Magic link to view order without logging in
   - CTA: View order

### C. Sample Book Markdown

```markdown
---
title: "The Diamond Journey: A Guide to Personal Transformation"
slug: "diamond-journey"
author: "Dr. Jane Smith"
description: "Transform your mindset and unlock your potential with proven strategies from the Becoming Diamond philosophy."
longDescription: |
  The Diamond Journey takes you through the complete transformation process, from recognizing your raw potential to polishing yourself into the diamond you were meant to become.

  This comprehensive guide includes:
  - 12 core principles of transformation
  - Weekly exercises and journal prompts
  - Case studies from successful program graduates
  - Integration practices for lasting change

  Perfect for new members or those deepening their practice.
coverImage: "/images/books/diamond-journey-cover.jpg"
priceDigital: 29.99
pricePhysical: 39.99
priceBundle: 59.99
isbn: "978-1-234567-89-0"
pageCount: 240
publishDate: "2025-03-01"
published: true
formatOptions: ["digital", "physical", "bundle"]
samplePdf: "/samples/diamond-journey-sample.pdf"
digitalFile: "books/diamond-journey-full.pdf"  # Relative to storage bucket
tags: ["transformation", "mindset", "foundational"]
featured: true
---

## About This Book

The Diamond Journey is the essential companion to the Becoming Diamond program...

## What You'll Learn

- How to identify and overcome limiting beliefs
- The science behind lasting behavior change
- Daily practices for maintaining momentum
- ...

## Who This Book Is For

- New program members looking for structure
- Anyone feeling stuck in their personal growth
- Coaches and facilitators teaching transformation
- ...

## Testimonials

> "This book changed my life. The exercises helped me break through barriers I didn't even know I had." - Sarah M.

## Table of Contents

1. Introduction: Your Diamond Potential
2. Chapter 1: Recognizing the Rough
3. Chapter 2: The Pressure Process
...
```

### D. Testing Checklist

**Pre-Launch Testing:**

- [ ] **Payment Flow**
  - [ ] Successful payment (test card 4242 4242 4242 4242)
  - [ ] Declined card (4000 0000 0000 0002)
  - [ ] Insufficient funds (4000 0000 0000 9995)
  - [ ] 3D Secure required (4000 0027 6000 3184)
  - [ ] Apple Pay (if supported)
  - [ ] Google Pay (if supported)

- [ ] **Order Creation**
  - [ ] Digital-only order
  - [ ] Physical-only order
  - [ ] Bundle order (digital + physical)
  - [ ] Multi-item order (3+ books)
  - [ ] Guest checkout
  - [ ] Logged-in user checkout

- [ ] **Email Delivery**
  - [ ] Order confirmation received
  - [ ] Digital download links work
  - [ ] Shipping notification received
  - [ ] Refund confirmation received

- [ ] **Digital Delivery**
  - [ ] Download link generates successfully
  - [ ] PDF opens correctly
  - [ ] Watermark shows correct email
  - [ ] Download link expires after 24 hours
  - [ ] Re-download generates new link

- [ ] **Admin Functions**
  - [ ] View all orders
  - [ ] Filter by status
  - [ ] Mark order as fulfilled
  - [ ] Add tracking number
  - [ ] Export to CSV
  - [ ] Print packing slip

- [ ] **Error Handling**
  - [ ] Webhook signature verification fails
  - [ ] Duplicate webhook events (idempotency)
  - [ ] Stripe API timeout
  - [ ] Database connection error
  - [ ] File storage unavailable

- [ ] **Security**
  - [ ] Cannot access other users' orders
  - [ ] Admin routes require authentication
  - [ ] Download URLs are signed
  - [ ] Webhook endpoint verifies signatures
  - [ ] Rate limiting on checkout

- [ ] **Performance**
  - [ ] Catalog page <2s LCP
  - [ ] Checkout page <1.5s LCP
  - [ ] Payment processing <3s
  - [ ] Download generation <1s
  - [ ] Mobile performance acceptable

- [ ] **Mobile**
  - [ ] Catalog browsing on mobile
  - [ ] Book detail page responsive
  - [ ] Cart drawer usable on mobile
  - [ ] Checkout form mobile-friendly
  - [ ] Touch targets >44px

- [ ] **Accessibility**
  - [ ] Keyboard navigation works
  - [ ] Screen reader announces actions
  - [ ] Color contrast WCAG AA
  - [ ] Form labels properly associated
  - [ ] Error messages announced

---

## Approval & Sign-off

**Product Owner:** ___________________ Date: _______

**Engineering Lead:** ___________________ Date: _______

**Design Lead:** ___________________ Date: _______

**Operations Manager:** ___________________ Date: _______

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-16 | Product Team | Initial draft |

---

## Related Documents

- [Video Integration Plan](/docs/specs/video-integration-simplified.md)
- [Performance Optimization PRD](/docs/specs/performance-optimization.prd.md)
- [Architecture Documentation](/CLAUDE.md)
- Stripe Integration Guide (to be created)
- Email Template Specifications (to be created)
- Admin User Guide (to be created)
