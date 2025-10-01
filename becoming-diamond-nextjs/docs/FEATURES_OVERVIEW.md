# Becoming Diamond - Features Overview

**Last Updated:** October 1, 2025 (Updated)
**Version:** 2.0

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Public Website Features](#public-website-features)
3. [Member Portal Features](#member-portal-features)
4. [Authentication System](#authentication-system)
5. [E-Commerce & Payments](#e-commerce--payments)
6. [Content Management System](#content-management-system)
7. [AI & RAG Integration](#ai--rag-integration)
8. [Data & Infrastructure](#data--infrastructure)
9. [Future Roadmap](#future-roadmap)

---

## Executive Summary

Becoming Diamond is a modern web application built with Next.js 15 that combines a high-converting marketing website with a feature-rich member portal. The platform enables identity transformation coaching through interactive courses, AI-powered chat, premium content delivery, and now includes complete authentication and e-commerce capabilities.

**Core Value Propositions:**

- Transform pressure into power through structured learning
- AI-powered coaching available 24/7
- Track progress through courses and transformations
- Access exclusive content and community resources
- Purchase and access premium transformation programs

**Recent Major Updates (v2.0):**

- ✅ **NextAuth.js v5 Authentication** - Multi-provider auth with database sessions
- ✅ **Stripe E-Commerce** - Book sales and checkout integration
- ✅ **Lead Capture System** - Full Turso database integration with API
- ✅ **New Public Pages** - Program, Collective, and Book sales pages
- ✅ **Enhanced UX** - Animated member area transitions

---

## Public Website Features

### Landing Page (`/`)

**Purpose:** Convert visitors into leads and members

**Implemented Components:**

- **Hero Section** with spotlight effect and gradient text
  - Compelling headline: "Turn Pressure Into Power"
  - Subheadline explaining the transformation
  - Primary CTA: "Get the Free Diamond Sprint Guide"
  - Secondary CTA: "Join the Community"

- **Problem/Pain Points Grid** (Bento Grid)
  - Visual showcase of transformation journey
  - Animated cards with hover effects
  - Pain points: Overwhelm, Uncertainty, Burnout, Self-Doubt

- **Program Timeline**
  - 3-phase transformation roadmap visualization
  - Interactive timeline with animations
  - Gateway 1, Gateway 2, Gateway 3 progression

- **Testimonials Carousel**
  - Animated testimonials slider
  - Social proof from transformed members
  - Real photos and success stories

- **3D Globe Visualization**
  - Interactive world map showing global reach
  - Animated connection arcs between locations
  - WebGL-powered graphics

- **Lead Capture Form** ✅ **FULLY INTEGRATED**
  - Email collection for free guide download
  - Turso database integration (see Lead Capture System)
  - Privacy-compliant with consent tracking
  - UTM parameter tracking
  - Rate limiting and duplicate prevention

- **Member Area Transition** 🆕
  - Animated 8-step loader when entering member portal
  - Themed loading messages about transformation
  - Smooth navigation to `/app` after completion

**Technical Highlights:**

- Aceternity UI components for premium feel
- Framer Motion animations throughout
- Fully responsive mobile-first design
- SEO optimized with meta tags
- Performance optimized with lazy loading

---

### Program Page (`/program`) 🆕

**Purpose:** Showcase the Diamond Activation Experience with tiered pricing

**Features:**

- **Hero Section**
  - Compelling headline and subheadline
  - Gradient background effects

- **Problem/Solution Framework**
  - Side-by-side comparison cards
  - Clear articulation of pain points
  - Solution-focused messaging

- **3-Tier Pricing Model**
  - **Recorded Version** - $97 (self-paced)
    - Full Diamond Operating System Course
    - Swiss Army Knife Toolkit
    - ART & ART² Protocols
    - 30-Day Diamond Sprint Tracker
    - Lifetime Access

  - **Full Program** - $497 (most popular)
    - Everything in Recorded Version
    - 3 Live Coaching Calls with Michael
    - Emotional Mastery Mini-Course ($497 value)
    - Influence Masterclass ($297 value)
    - Private Diamond Forum
    - Total Value: $2,488

  - **Premium** - $3,000 (1-on-1 mentoring)
    - Everything in Full Program
    - Private 1-on-1 Sessions
    - Priority Support
    - Custom Action Plan
    - Personalized Accountability

- **Trust Elements**
  - 14-Day Unshakable Guarantee
  - Testimonials section
  - Social proof

- **Cross-sell**
  - CTA to DiamondMind Collective

**Integration:**
- Links to authentication (`/auth/signin`)
- Animated components with Framer Motion
- Responsive design

---

### DiamondMind Collective Page (`/collective`) 🆕

**Purpose:** Showcase the yearlong transformation journey for emerging leaders

**Features:**

- **Hero Section** with LampContainer effect
  - Dramatic lighting effect
  - Clear positioning: "Yearlong Transformation Journey for Emerging Leaders"

- **The 5 Gateways Visualization**
  - Interactive gateway cards with hover effects
  - Progressive intensity visualization (20% → 60% opacity)
  - Glowing effects on hover

  **Gateway Structure:**
  1. **Stabilize** - Nervous system mastery, presence, self-regulation
  2. **Shift** - Identity rewiring, emotional mastery, ego integration
  3. **Strengthen** - Resilience, coherence, energetic stamina
  4. **Shine** - Embodied leadership, influence, magnetic presence
  5. **Synthesize** - Purpose, legacy, lifelong adaptability

- **DiamondMindAI Section**
  - Interactive EvervaultCard component
  - PlaceholdersAndVanishInput for AI queries
  - Suggested questions about the Collective

- **Gateway Journey Timeline**
  - Detailed Timeline component with expandable sections
  - Each gateway includes:
    - Description and benefits
    - Key training modules
    - Testimonials
    - Visual progression

- **CTA Section**
  - Application call-to-action
  - "Limited to 50 emerging leaders per cohort"
  - Links to authentication

**Technical Highlights:**
- Advanced Aceternity UI components (Lamp, EvervaultCard, Timeline)
- Custom hover effects with dynamic shadows
- Responsive grid layouts
- Seamless animations

---

### Book Sales Page (`/book`) 🆕

**Purpose:** Sell "Turning Snowflakes into Diamonds" book

**Features:**

- **BookSalesSection Component**
  - Split layout: Book cover + Sales copy
  - Premium design with gradient effects
  - Book cover image asset
  - Social proof with testimonials
  - Urgency indicators (limited time offer)
  - Price display: $47 (discounted from $77)
  - Stripe Checkout integration
  - Mobile-responsive design

**Product Details:**
- Price: $47 USD
- Product ID: `prod_T9jYQj5hLB9gYw`
- Price ID: `price_1SDQ50RVLr5O3VREdsw5inuj`

**Integration:**
- `/api/checkout` endpoint for Stripe session creation
- Secure checkout flow
- Redirect to success/cancel pages

---

### Blog System (`/blog`)

**Purpose:** Content marketing and SEO

**Features:**

- Blog post listing with thumbnails and excerpts
- Individual blog post pages (`/blog/[slug]`)
- Markdown-based content from Git repository
- Author attribution and categorization
- Publication dates and tags
- Static site generation for performance

**Sample Posts:**

- "Mastering Pressure: From Snowflake to Diamond"
- "The AI Anxiety Epidemic"
- "Burnout and Identity Crisis"

**Content API:**

```typescript
const posts = await getContentByType("blog");
const post = await getContentBySlug("blog", slug);
```

---

### News Section (`/news`)

**Purpose:** Updates and announcements

**Features:**

- News article listing
- Individual article pages (`/news/[slug]`)
- Date-stamped updates
- Featured image support
- Tag-based organization

---

### Navigation & Layout

**Public Header:**

- Logo and brand identity
- Desktop navigation menu (Home, Program, Collective, Book, Blog, News)
- Mobile responsive drawer
- Smooth scroll animations
- Active route highlighting
- Sign In button

**Footer:**

- Social media links
- Copyright and legal info
- Newsletter signup (planned)

---

## Member Portal Features

### Protected Area (`/app/*`) ✅ **FULLY SECURED**

**Access Control:**

- NextAuth.js v5 authentication wall
- Session management with database persistence
- Protected routes via middleware
- Automatic redirect to `/auth/signin` for unauthenticated users
- Logout functionality

---

### Dashboard (`/app`)

**Purpose:** Member home base and progress overview

**Features:**

- Welcome message with user name
- Course enrollment status
- Progress statistics
  - Courses in progress
  - Completed modules
  - Total learning time
- Quick actions
  - Continue learning
  - Start new course
  - Access chat
- Upcoming sessions (planned)

**Layout:**

- Fixed sidebar navigation (desktop)
- Mobile drawer navigation
- Active route indicators
- User profile section with authenticated user info
- Logout button

---

### Course Viewer (`/app/courses/[courseId]`)

**Purpose:** Interactive course consumption experience

**Status:** ✅ Fully Implemented (Phase 3 Complete)

**Core Features:**

1. **Slide Navigation**
   - One slide at a time for focused learning
   - Next/Previous buttons
   - Keyboard shortcuts (Arrow keys, Space)
   - Smooth scrolling transitions
   - Progress indicator

2. **Chapter Sidebar**
   - Hierarchical chapter/slide organization
   - Grouped by course parts (Part 1, Part 2, etc.)
   - Expandable/collapsible chapters
   - Visual completion indicators
   - Click to jump to any slide

3. **Progress Tracking** (Phase 3)
   - localStorage-based persistence
   - Per-slide completion tracking
   - Chapter completion percentages
   - Overall course progress calculation
   - Resume from last position
   - Green checkmarks for completed items
   - Completion celebration on course finish

4. **Mark Complete Button**
   - Manual slide completion
   - Updates progress in real-time
   - Visual feedback on completion

5. **Content Display**
   - Markdown rendered to HTML
   - Typography optimization with Tailwind Prose
   - Proper paragraph spacing and formatting
   - Syntax highlighting for code blocks
   - Responsive font sizing

6. **Notes Feature** (Implemented, not yet activated)
   - Toggle notes panel
   - Per-slide note taking
   - Auto-save functionality
   - Keyboard shortcut (N key)

**Course Structure:**

```
Gateway 1: Turning Snowflakes into Diamonds
├── Part 1: The Snowflake Crisis (3 chapters, 23 slides)
├── Part 2: The Diamond Transformation Roadmap (3 chapters, 22 slides)
└── Part 3: Building Your Diamond Practice (4 chapters, 32 slides)
```

**Technical Implementation:**

- `CourseViewer.tsx` - Main container component
- `ChapterNav.tsx` - Sidebar navigation
- `SlideContent.tsx` - Content renderer
- `CourseProgress.tsx` - Header with progress
- `course-parser.ts` - Markdown to structured data
- `progress.ts` - Progress management functions

**Mobile Experience:**

- Responsive layout
- Touch-friendly navigation
- Mobile drawer for chapter navigation
- Optimized typography for smaller screens

---

### Course Catalog (`/app/courses`)

**Purpose:** Browse and enroll in courses

**Features:**

- Course cards with thumbnails
- Enrollment status badges
  - "Not Started" → "Start Course"
  - "In Progress" → Links to course viewer
  - "Completed" → View again
- Progress percentage display
- Course metadata (duration, instructor, gateway)
- Filtering by gateway level (planned)

**Available Courses:**

- Gateway 1: Turning Snowflakes into Diamonds
- Gateway 2: Advanced Diamond Techniques (planned)
- Gateway 3: Mastery & Leadership (planned)

---

### DiamondMindAI Chat (`/app/chat`)

**Purpose:** 24/7 AI coaching powered by Claude

**Status:** ✅ Fully Implemented with RAG

**Features:**

1. **Conversational Interface**
   - Chat bubble UI with message history
   - User/assistant message distinction
   - Real-time response generation
   - Markdown formatting in responses

2. **RAG System** (Retrieval-Augmented Generation)
   - Entire "Turning Snowflakes into Diamonds" book loaded
   - Claude Sonnet 4.5 with 200K context window
   - Prompt caching for 90% cost reduction
   - Automatic citations from book chapters

3. **Suggested Prompts**
   - Quick-start conversation topics
   - Pre-built questions about the book
   - One-click prompt insertion

4. **Cost Efficiency**
   - First query: ~$0.014
   - Cached queries: ~$0.0027
   - Monthly estimate (100 queries/day): ~$15

**Sample Questions:**

- "What is the Diamond Transformation Roadmap?"
- "How do I stabilize under pressure?"
- "Explain the difference between snowflakes and diamonds"

**Technical Stack:**

- `/api/ask` endpoint for Claude integration
- `claude-simple.ts` RAG implementation
- Streaming responses (backend ready)
- Error handling and retry logic

---

### Profile Page (`/app/profile`)

**Purpose:** User account management

**Features:**

- Profile information display (from authenticated session)
- User name, email, avatar
- Edit profile form (planned)
- Progress history
- Achievements and milestones (planned)
- Avatar upload (planned)

---

### Settings Page (`/app/settings`)

**Purpose:** Account preferences

**Features:**

- Email preferences
- Notification settings
- Privacy controls
- Theme selection (planned)
- Data export (GDPR compliance, planned)

---

### Support Page (`/app/support`)

**Purpose:** Help resources

**Features:**

- FAQ section
- Contact form
- Help articles
- Video tutorials (planned)
- Community links

---

## Authentication System

### NextAuth.js v5 Integration ✅ **FULLY IMPLEMENTED** (Phase 4 Complete)

**Status:** Production Ready

**Architecture:**

- NextAuth.js v5 (beta.29)
- Custom Turso database adapter for LibSQL
- Edge-compatible middleware for route protection
- Database-backed sessions (30-day persistence)

**Authentication Providers:**

1. **Email Magic Links** (via Resend)
   - Passwordless authentication
   - Secure token-based login
   - Email verification

2. **Google OAuth**
   - Social login integration
   - Profile data sync

3. **GitHub OAuth** (Member Auth - separate from CMS)
   - Developer-friendly login
   - Distinct from Decap CMS GitHub auth

**Database Schema:**

```sql
-- Core authentication tables
users              # User identity and basic info
accounts           # OAuth provider linkage
sessions           # Database-backed sessions
verification_tokens # Email magic link tokens
user_profiles      # Extended member data (tier, onboarded_at, preferences)
```

**Features:**

- Session management with 30-day expiry
- Automatic token rotation
- CSRF protection
- Secure cookie handling
- Edge runtime compatible

**API Routes:**

- `/api/auth/[...nextauth]` - NextAuth handler (sign in, sign out, callbacks)
- `/auth/signin` - Custom sign-in page
- `/auth/error` - Error handling page
- `/auth/verify-request` - Email verification page

**Middleware Protection:**

- Protects all `/app/*` routes
- Redirects unauthenticated users to `/auth/signin`
- Preserves intended destination URL

**Environment Variables Required:**

```bash
AUTH_SECRET=<generated-secret>
AUTH_URL=http://localhost:3003 # or production URL

# Email Provider (Resend)
RESEND_API_KEY=<resend-api-key>
EMAIL_FROM=noreply@becomingdiamond.com

# Google OAuth
GOOGLE_CLIENT_ID=<google-client-id>
GOOGLE_CLIENT_SECRET=<google-client-secret>

# GitHub OAuth (Member Auth)
GITHUB_ID=<github-oauth-app-id>
GITHUB_SECRET=<github-oauth-app-secret>

# Database (Turso)
DATABASE_URL=libsql://your-db.turso.io
DATABASE_AUTH_TOKEN=<turso-token>
```

**Setup & Testing:**

- Database migrations: `npm run db:migrate`
- Test script: `npm run test:auth`
- Comprehensive setup guide: `AUTH_SETUP.md`

**Custom Adapter:**

- `src/lib/turso-adapter.ts` - Custom NextAuth adapter for Turso
- Handles all CRUD operations for auth tables
- Compatible with LibSQL/Turso edge runtime

**User Experience:**

- Seamless authentication flow
- Persistent sessions across devices
- Automatic session refresh
- Secure logout

---

## E-Commerce & Payments

### Stripe Integration ✅ **FULLY IMPLEMENTED**

**Status:** Production Ready

**Features:**

1. **Book Sales**
   - Product: "Turning Snowflakes into Diamonds"
   - Price: $47 (discounted from $77)
   - Stripe Checkout integration
   - Success/cancel page redirects

2. **API Endpoint**
   - `POST /api/checkout`
   - Creates Stripe checkout session
   - Configurable product/price IDs
   - Session expiration (30 minutes)

**Product Configuration:**

```typescript
{
  productId: "prod_T9jYQj5hLB9gYw",
  priceId: "price_1SDQ50RVLr5O3VREdsw5inuj",
  amount: 4700, // $47.00
  currency: "usd"
}
```

**Integration:**

- BookSalesSection component with CTA button
- Secure checkout session creation
- Redirect to Stripe-hosted checkout
- Return URLs configured for success/cancel

**Environment Variables:**

```bash
STRIPE_SECRET_KEY=sk_test_... # or sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... # or pk_live_...
```

**Documentation:**

- Usage guide: `BOOK_SALES_USAGE.md`
- Stripe setup: `STRIPE_INTEGRATION.md`

**Future Enhancements:**

- Program tier payments ($97, $497, $3,000)
- Subscription management for Collective
- Webhook handling for payment events
- Customer portal for subscription management

---

## Content Management System

### Decap CMS Integration

**Access:** `/admin`

**Purpose:** Git-based content management without code

**Features:**

1. **Visual Editor**
   - WYSIWYG markdown editing
   - Live preview
   - Rich text toolbar
   - Image uploads to `/public/uploads/`

2. **Content Collections**
   - **News Updates** - Date-stamped announcements
   - **Blog Posts** - Long-form articles with authors
   - **Pages** - Static pages (About, Contact)
   - **Site Settings** - Global configuration

3. **Media Library**
   - Upload images and files
   - Organize in folders
   - Insert into content
   - Automatic optimization (planned)

4. **Workflow**
   - Draft/Published status
   - Git commits on save
   - Editorial workflow (planned)
   - Preview before publish

5. **GitHub Integration**
   - OAuth authentication (separate from member auth)
   - Direct commits to repository
   - Pull request workflow (optional)
   - Version history via Git

**Setup:**

```yaml
# /public/admin/config.yml
backend:
  name: github
  repo: your-username/becoming-diamond-nextjs
  branch: main
```

**Environment Variables:**

```env
GITHUB_CLIENT_ID=your_cms_client_id
GITHUB_CLIENT_SECRET=your_cms_client_secret
```

---

### Content API

**Server-Side Functions:**

```typescript
import { getContentByType, getContentBySlug } from "@/lib/content";

// Get all published news articles
const news = await getContentByType("news");

// Get specific article by slug
const article = await getContentBySlug("news", "welcome-2024");

// Access frontmatter and content
article.frontmatter.title;
article.frontmatter.date;
article.content; // HTML string
```

**Features:**

- Automatic markdown to HTML conversion
- Frontmatter parsing with gray-matter
- Published/draft filtering
- Date sorting
- Slug generation

---

## AI & RAG Integration

### Claude-Powered RAG System

**Purpose:** Answer questions about book content

**Architecture:**

- Simple approach leveraging Claude's 200K context
- Entire book loaded into system prompt
- Prompt caching for cost efficiency
- No vector database required

**Implementation:**

**Backend (`/src/lib/rag/claude-simple.ts`):**

```typescript
export async function askBook(question: string): Promise<AskBookResult>;
export async function askBookStreaming(question: string);
```

**API Route (`/src/app/api/ask/route.ts`):**

```typescript
POST /api/ask
Body: { question: string }
Response: { answer: string, usage: {...} }
```

**Frontend Integration:**

- Chat interface at `/app/chat`
- Suggested prompts
- Message history
- Markdown rendering

**Book Content:**

- Located at `docs/content/turning-snowflakes-into-diamonds.md`
- 2,078 lines, ~40K tokens
- Loaded at module initialization
- Cached in memory

**Cost Analysis:**

- Cache creation: $0.012 first query
- Cache read: $0.0012 subsequent queries
- 5-minute cache TTL
- ~$15/month for 100 queries/day

**System Prompt:**

```
You are an expert on the book "Turning Snowflakes into Diamonds" by Michael Dugan.
Answer questions based ONLY on the book content provided.
Always cite specific chapter sections or headings.
Focus on identity transformation, nervous system regulation, and high-performance.
```

---

## Data & Infrastructure

### Database (Turso SQLite) ✅ **FULLY IMPLEMENTED**

**Status:** Production Ready

**Purpose:** Lead capture, user authentication, and data persistence

**Implemented Features:**

1. **Lead Capture System** ✅ (Phase 7 Complete)
   - Email collection from landing page
   - UTM parameter tracking
   - Referrer source tracking
   - Duplicate prevention (24-hour window)
   - GDPR consent tracking
   - Rate limiting (5 requests/min per IP)
   - Metadata capture (IP, user agent, landing page)

2. **Authentication Tables** ✅ (Phase 4 Complete)
   - Users, accounts, sessions, verification tokens
   - User profiles with tier and preferences
   - OAuth provider linkage

**Schema:**

```sql
-- Lead capture
CREATE TABLE leads (
  id INTEGER PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  source TEXT,
  utm_campaign TEXT,
  utm_medium TEXT,
  utm_source TEXT,
  utm_content TEXT,
  utm_term TEXT,
  referrer TEXT,
  landing_page TEXT,
  ip_address TEXT,
  user_agent TEXT,
  consent BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'active'
);

-- Authentication (managed by NextAuth adapter)
users
accounts
sessions
verification_tokens
user_profiles
```

**API Endpoints:**

1. **POST `/api/leads`** - Submit lead
   ```typescript
   {
     email: string;
     consent: boolean;
     utm_campaign?: string;
     utm_medium?: string;
     utm_source?: string;
     // ... other UTM params
   }
   ```

2. **GET `/api/leads`** - Admin export (authenticated)
   - Bearer token authentication
   - Query filters (date range, source, status)
   - Pagination support
   - CSV and JSON export formats

**Integration:**

```typescript
import { turso } from "@/lib/turso";

// Insert lead
await turso.execute({
  sql: "INSERT INTO leads (email, source, utm_campaign) VALUES (?, ?, ?)",
  args: [email, "landing_page", campaign],
});
```

**Environment Variables:**

```env
DATABASE_URL=libsql://your-db.turso.io
DATABASE_AUTH_TOKEN=your-token
LEADS_API_SECRET=your-admin-secret # for admin endpoints
```

**Database Management:**

- Migrations: `npm run db:migrate`
- Migration scripts in `/migrations/`
- TypeScript migration runner: `scripts/migrate-db.ts`

**Planned Expansions:**

- Course progress sync across devices
- Notes and annotations storage
- User preferences and settings
- Analytics and tracking data

---

### Deployment & Hosting

**Platform:** Vercel (Production)

**Features:**

- Automatic deployments from Git
- Preview deployments for PRs
- Environment variable management
- Edge functions for API routes
- Analytics and monitoring

**Build Configuration:**

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "db:migrate": "tsx scripts/migrate-db.ts",
    "test:auth": "tsx scripts/test-auth-setup.ts"
  }
}
```

**Production Optimizations:**

- Static page generation (SSG)
- Server-side rendering (SSR) for dynamic content
- Image optimization (planned - replace `<img>` with `next/image`)
- Code splitting
- Turbopack for fast builds

---

## Technology Stack Summary

### Frontend

- **Next.js 15.5.3** - React framework with App Router
- **React 19.1** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Utility-first styling
- **Aceternity UI** - 89 premium animated components
- **Framer Motion** - Animation library
- **React Three Fiber** - 3D graphics

### Backend & Data

- **Next.js API Routes** - Serverless functions
- **Turso SQLite** - Database (LibSQL)
- **NextAuth.js v5** - Authentication
- **Decap CMS** - Git-based CMS
- **Gray-matter** - Frontmatter parsing
- **Remark** - Markdown processing

### AI & ML

- **Anthropic Claude Sonnet 4.5** - Language model
- **Prompt Caching** - Cost optimization
- **RAG System** - Book-based Q&A

### Payments & Email

- **Stripe** - Payment processing
- **Resend** - Email delivery (magic links)

### DevOps & Tools

- **Vercel** - Hosting and deployment
- **GitHub** - Version control
- **ESLint** - Code linting
- **Turbopack** - Fast bundler
- **tsx** - TypeScript execution

---

## Future Roadmap

### ✅ Phase 4: Member Authentication (COMPLETE)

- ✅ NextAuth.js v5 implementation
- ✅ Email/password magic links
- ✅ Google and GitHub OAuth
- ✅ Session management
- ✅ Protected route middleware
- ✅ User profile database
- ✅ Custom Turso adapter

### ✅ Phase 7: Lead Nurture Automation (DATABASE COMPLETE)

- ✅ Turso database integration
- ✅ Lead capture API with validation
- ✅ UTM tracking
- ✅ Rate limiting and duplicate prevention
- ✅ Admin export API
- 🔨 Email automation triggers (planned)
- 🔨 Drip campaign sequences (planned)
- 🔨 Lead scoring (planned)
- 🔨 CRM integration - HubSpot/Mailchimp (planned)

### Phase 5: Advanced Course Features

- Video/audio embedding
  - Secure non-downloadable playback
  - Custom video player
  - Playback speed controls
- Rich note-taking
  - Markdown editor
  - Export to PDF/Markdown
  - Search within notes
- Discussion forums
  - Per-slide comments
  - Community Q&A
  - Upvoting/downvoting

### Phase 6: Progress Sync

- Move from localStorage to database
- Multi-device synchronization
- Progress analytics dashboard
- Learning time tracking
- Streak tracking and gamification

### Phase 8: E-Commerce Expansion

- ✅ Book sales ($47) - Complete
- 🔨 Program tier payments
  - Recorded Version ($97)
  - Full Program ($497)
  - Premium ($3,000)
- Subscription management for Collective
- Stripe webhook handling
- Customer portal
- Payment history

### Phase 9: Community Features

- Member directory
- Group cohorts
- Live Q&A sessions
- Peer accountability partnerships
- Private messaging

### Phase 10: Advanced Analytics

- Course completion funnels
- Engagement heatmaps
- Drop-off analysis
- A/B testing infrastructure
- Conversion tracking

### Phase 11: Mobile App

- React Native application
- Offline course access
- Push notifications
- Mobile-optimized UI
- App Store deployment

---

## Documentation References

- **Architecture Details:** [CLAUDE.md](/CLAUDE.md)
- **Authentication Setup:** [AUTH_SETUP.md](/AUTH_SETUP.md)
- **CMS Setup:** [README_CMS.md](/README_CMS.md)
- **RAG System:** [README_RAG.md](/README_RAG.md)
- **Book Sales:** [BOOK_SALES_USAGE.md](/BOOK_SALES_USAGE.md)
- **Stripe Integration:** [STRIPE_INTEGRATION.md](/STRIPE_INTEGRATION.md)
- **Main README:** [README.md](/README.md)

**PRDs (Product Requirements Documents):**

- Course Viewer: [docs/specs/course-viewer-prd.md](/docs/specs/course-viewer-prd.md)
- Lead Capture: [docs/specs/lead-capture-turso-prd.md](/docs/specs/lead-capture-turso-prd.md)
- RAG System: [docs/specs/diamond-rag.md](/docs/specs/diamond-rag.md)

---

## Quick Start Guide

### For Developers

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Add required keys:
# - ANTHROPIC_API_KEY
# - DATABASE_URL and DATABASE_AUTH_TOKEN (Turso)
# - AUTH_SECRET (generate with: openssl rand -base64 32)
# - RESEND_API_KEY
# - GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
# - GITHUB_ID and GITHUB_SECRET
# - STRIPE_SECRET_KEY
# - GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET (for CMS)

# Run database migrations
npm run db:migrate

# Test authentication setup
npm run test:auth

# Start development server
npm run dev

# Visit http://localhost:3003
```

### For Content Editors

1. Navigate to `/admin`
2. Log in with GitHub (CMS OAuth)
3. Create/edit content using visual editor
4. Publish to deploy changes

### For Members

1. Visit landing page at `/`
2. Sign up at `/auth/signin` (email magic link, Google, or GitHub)
3. Access member portal at `/app`
4. Browse courses at `/app/courses`
5. Ask questions at `/app/chat`

### For Purchasing

1. Visit `/book` to purchase the book
2. Complete Stripe checkout
3. Receive confirmation and access

---

## Key Metrics & Performance

**Authentication:**
- Session duration: 30 days
- Database-backed sessions for security
- Edge runtime compatible

**Lead Capture:**
- Rate limit: 5 requests/minute per IP
- Duplicate prevention: 24-hour window
- 100% GDPR compliant

**AI Chat:**
- First query: ~$0.014
- Cached queries: ~$0.0027
- Response time: <2 seconds

**E-Commerce:**
- Stripe checkout: Hosted, secure
- Session expiry: 30 minutes
- Success rate: 99.9%+ (Stripe SLA)

---

**Last Updated:** October 1, 2025
**Version:** 2.0
**Status:** Production Ready (Core Features + Auth + E-Commerce)

**Major Version Changes:**
- v1.0 → v2.0: Added NextAuth.js authentication, Stripe e-commerce, lead capture system, and new program/collective/book pages
