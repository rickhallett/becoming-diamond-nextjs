# BecomingDiamond Platform Architecture

> Comprehensive file-by-file documentation of the codebase structure and purpose

## Table of Contents

- [Project Overview](#project-overview)
- [Core Configuration](#core-configuration)
- [Source Directory Structure](#source-directory-structure)
- [Type Definitions](#type-definitions)
- [React Contexts](#react-contexts)
- [Application Routes](#application-routes)
- [API Routes](#api-routes)
- [Shared Components](#shared-components)
- [UI Components Library](#ui-components-library)
- [Utility Libraries](#utility-libraries)
- [Email Templates](#email-templates)
- [Testing Infrastructure](#testing-infrastructure)

---

## Project Overview

**BecomingDiamond** is a Next.js 15 application built for delivering transformational leadership programs through an interactive member portal. The platform combines:
- Marketing landing pages with advanced animations
- Protected member area with course delivery
- AI-powered chat assistant
- Payment integration via Stripe
- Video streaming via Bunny CDN
- Email automation
- Git-based CMS (Decap CMS)

**Tech Stack:**
- Next.js 15.5.3 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Turso (SQLite edge database)
- NextAuth.js (authentication)
- Stripe (payments)
- Bunny Stream (video hosting)
- Resend/Gmail SMTP (email)
- Anthropic Claude (AI chat)

---

## Core Configuration

### `/auth.ts`
NextAuth.js configuration file defining authentication strategies and session management.
- Email magic link authentication
- Custom Turso database adapter
- Session configuration
- Callback handlers for sign-in/sign-out events

### `/next.config.ts`
Next.js framework configuration.
- Turbopack enabled for dev and build
- Image optimization settings
- Remote image patterns for external CDNs
- Environment variable handling

### `/tailwind.config.ts`
Tailwind CSS configuration (minimal - most config inline in globals.css).
- References inline `@theme` directive in globals.css
- Component paths configuration

### `/eslint.config.mjs`
ESLint configuration with TypeScript support.
- Disables strict linting rules for development velocity
- Excludes UI components directory
- Custom ignore patterns

### `/tsconfig.json`
TypeScript compiler configuration.
- Path aliases (`@/*` maps to `./src/*` and `./`)
- Strict mode disabled for faster development
- JSX preserve mode for Next.js

### `/package.json`
Node.js project manifest.
- Scripts: `dev`, `build`, `start`, `lint`, `test`, `test:e2e`
- Dependencies: Next.js, React, database clients, payment SDKs
- Prebuild script copies Decap CMS assets

---

## Source Directory Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/             # Shared React components
├── lib/                    # Utility functions and services
├── types/                  # TypeScript type definitions
├── contexts/               # React Context providers
├── config/                 # Application configuration
├── emails/                 # Email templates (React Email)
├── test/                   # Test files (unit + e2e)
└── hooks/                  # Custom React hooks
```

---

## Type Definitions

### `/src/types/course.ts`
TypeScript interfaces for course data structures.
- `Course`: Course metadata (id, title, description, pricing)
- `Slide`: Individual slide content with markdown
- `Video`: Video metadata for Bunny Stream integration
- `CourseSlide`: Combined slide + video data

### `/src/types/progress.ts`
User progress tracking types.
- `UserProgress`: Overall course completion tracking
- `SlideProgress`: Individual slide view status
- `ActivityLog`: User activity events
- Progress calculation utilities

---

## React Contexts

### `/src/contexts/UserContext.tsx`
Global user state management.
- Current user session data
- User profile information
- Authentication status
- Role-based permissions

### `/src/contexts/CourseContext.tsx`
Course playback state management.
- Current course and slide
- Navigation (next/previous slide)
- Progress tracking
- Completion status

### `/src/contexts/ChatContext.tsx`
AI chat conversation state.
- Message history
- Streaming response handling
- Context persistence
- RAG (Retrieval-Augmented Generation) integration

---

## Application Routes

### Public Pages (`/src/app/`)

#### `/src/app/page.tsx`
**Landing Page** - Main marketing homepage.
- Hero section with animated globe
- Problem/solution framework
- Feature showcase (BentoGrid)
- Testimonials carousel
- Lead magnet CTA
- Book sales section
- Dynamic imports for performance (Globe, World components)
- Client-side rendered with Framer Motion animations

#### `/src/app/layout.tsx`
**Root Layout** - Global app wrapper.
- Font configuration (Geist Sans, Geist Mono)
- Metadata configuration (title, description, OG tags)
- Context providers wrapper
- Global CSS imports

#### `/src/app/providers.tsx`
**Client Providers Wrapper** - Bundles all context providers.
- UserContext
- CourseContext
- ChatContext
- Session provider (NextAuth)

#### `/src/app/program/page.tsx`
**Program Tiers Page** - Diamond Activation Experience offerings.
- Three pricing tiers (Diamond Advantage, Edge Mastery, Pressure Room One)
- Feature comparison
- CTA buttons (mailto links)
- Money-back guarantee section

#### `/src/app/collective/page.tsx`
**DiamondMind Immersion Page** - Year-long transformation program.
- Lamp effect hero section
- 5 Pressure Room progression (PR I-V)
- Timeline visualization
- DiamondMindAI integration
- Testimonials
- High-ticket CTA ($7,995)

#### `/src/app/book/page.tsx`
**Book Sales Page** - "The Diamond Advantage" book offer.
- Product showcase
- Stripe checkout integration
- Social proof
- Benefits breakdown

#### `/src/app/book/success/page.tsx`
**Purchase Confirmation** - Post-checkout success page.
- Order confirmation
- Next steps
- Email delivery notice

#### `/src/app/pricing/page.tsx`
**Pricing Overview** - All program tiers comparison.
- Side-by-side comparison table
- FAQ section
- Guarantee information

### Offer Pages (`/src/app/offers/`)

#### `/src/app/offers/diamond-advantage/page.tsx`
**Diamond Advantage Detail Page** - $97 tier deep-dive.
- Detailed feature breakdown
- What's included
- Who it's for
- CTA to purchase

#### `/src/app/offers/diamond-edge-mastery/page.tsx`
**Diamond Edge Mastery Detail Page** - $497 tier deep-dive.
- Live session details
- Community access
- Integration lab information

#### `/src/app/offers/pressure-room-one/page.tsx`
**Pressure Room One Detail Page** - $1,997 tier deep-dive.
- 3-day intensive breakdown
- Transformation promise
- Prerequisites
- Application process

### Content Pages

#### `/src/app/news/page.tsx`
**News Index** - List of all news items from CMS.
- Fetches from `content/news/` directory
- Card grid layout
- Filter by published status

#### `/src/app/news/[slug]/page.tsx`
**News Article** - Dynamic route for individual news items.
- Static generation (`generateStaticParams`)
- Markdown rendering
- Metadata generation
- Breadcrumb navigation

#### `/src/app/blog/page.tsx`
**Blog Index** - List of all blog posts.
- Similar to news index
- Category filtering
- Tag system

#### `/src/app/blog/[slug]/page.tsx`
**Blog Post** - Individual blog article.
- Dynamic route with SSG
- Author information
- Related posts

### Legal Pages (`/src/app/legal/`)

#### `/src/app/legal/terms/page.tsx`
**Terms of Service** - Legal terms and conditions.

#### `/src/app/legal/privacy/page.tsx`
**Privacy Policy** - Data privacy disclosures.

#### `/src/app/legal/disclaimer/page.tsx`
**Disclaimer** - Liability disclaimers.

### Authentication Pages (`/src/app/auth/`)

#### `/src/app/auth/page.tsx`
**Auth Hub** - Authentication landing page.
- Sign in/sign up options
- OAuth provider buttons

#### `/src/app/auth/signin/page.tsx`
**Sign In Page** - Email magic link authentication.
- Email input form
- NextAuth integration
- Redirect handling

#### `/src/app/auth/verify-request/page.tsx`
**Check Email Page** - Post-magic-link-send confirmation.
- Email sent confirmation
- Instructions to check inbox

#### `/src/app/auth/error/page.tsx`
**Auth Error Page** - Authentication error handling.
- Error message display
- Retry options

### Member Portal (`/src/app/app/`)

#### `/src/app/app/layout.tsx`
**Member Portal Layout** - Sidebar navigation wrapper.
- Fixed sidebar (desktop)
- Mobile drawer menu
- Navigation items (Dashboard, Courses, Chat, Profile, Settings, Support)
- Active route highlighting
- Sign out button

#### `/src/app/app/page.tsx`
**Dashboard** - Member portal home.
- Welcome message
- Course progress overview
- Recent activity
- Upcoming sessions
- Quick links

#### `/src/app/app/courses/page.tsx`
**Course Catalog** - List of available courses.
- Course cards with thumbnails
- Enrollment status
- Progress indicators
- Filter/search functionality

#### `/src/app/app/courses/[courseId]/page.tsx`
**Course Player** - Individual course viewer.
- Dynamic route for course playback
- Slide navigation
- Video player integration
- Progress tracking
- Notes section

#### `/src/app/app/courses/[courseId]/CourseViewer.tsx`
**Course Viewer Component** - Main course playback UI.
- Slide renderer (markdown + video)
- Navigation controls
- Progress bar
- Fullscreen support

#### `/src/app/app/courses/[courseId]/not-found.tsx`
**Course Not Found** - 404 for invalid course IDs.

#### `/src/app/app/chat/page.tsx`
**DiamondMindAI Chat** - AI assistant interface.
- Message thread display
- Input field with submit
- Streaming response rendering
- Context-aware RAG queries
- Markdown message formatting

#### `/src/app/app/profile/page.tsx`
**User Profile** - Account information and progress.
- User details (name, email, avatar)
- Overall progress statistics
- Course completion badges
- Activity history

#### `/src/app/app/settings/page.tsx`
**Account Settings** - User preferences.
- Email preferences
- Notification settings
- Password change (if applicable)
- Account deletion

#### `/src/app/app/support/page.tsx`
**Support Center** - Help and contact information.
- FAQ accordion
- Contact form
- Resource links

### Sprint Pages (`/src/app/app/sprint/`)

#### `/src/app/app/sprint/page.tsx`
**Sprint Hub** - Diamond Sprint program overview.
- 30-day challenge introduction
- Navigation to dashboard/watch pages

#### `/src/app/app/sprint/dashboard/page.tsx`
**Sprint Dashboard** - Progress tracking for 30-day sprint.
- Day completion checklist
- Progress visualization
- Stats cards
- CTA to current day

#### `/src/app/app/sprint/watch/page.tsx`
**Sprint Video Library** - All sprint videos in one place.
- Video grid for all 30 days
- Quick access to any day
- Progress indicators

#### `/src/app/app/sprint/day/[dayNumber]/page.tsx`
**Sprint Day Player** - Individual day content.
- Dynamic route (day 1-30)
- Video player
- Daily challenge description
- Completion checkbox
- Navigation to next day

---

## API Routes

All API routes follow Next.js 15 App Router conventions (Route Handlers in `route.ts` files).

### Authentication (`/src/app/api/auth/`)

#### `/src/app/api/auth/[...nextauth]/route.ts`
**NextAuth Catch-All Route** - Handles all NextAuth.js endpoints.
- Sign in/sign out
- Session management
- Magic link callbacks

#### `/src/app/api/auth/test-session/route.ts`
**Session Debug Endpoint** - Development helper to inspect session.
- GET: Returns current session data
- Used for debugging authentication issues

### CMS Integration (`/src/app/api/`)

#### `/src/app/api/cms-auth/route.ts`
**Decap CMS OAuth Initiation** - Starts GitHub OAuth flow for CMS access.
- GET: Redirects to GitHub authorization

#### `/src/app/api/cms-callback/route.ts`
**Decap CMS OAuth Callback** - Handles GitHub OAuth response.
- Receives authorization code
- Returns HTML with `postMessage` script
- Communicates code to CMS window

### Course & Video APIs

#### `/src/app/api/courses/route.ts`
**Course Management API**
- GET: Fetch all courses or single course by ID
- POST: Create new course (admin only)
- PUT: Update course (admin only)
- DELETE: Remove course (admin only)

#### `/src/app/api/videos/route.ts`
**Video Metadata API**
- GET: List all videos from Bunny Stream
- Returns video metadata (duration, thumbnails, status)

#### `/src/app/api/video/[videoId]/token/route.ts`
**Video Token Generation** - Secure video streaming URLs.
- GET: Generates signed token for Bunny Stream
- Validates user authentication
- 24-hour expiry
- Returns HLS stream URL

### Sprint APIs

#### `/src/app/api/sprint/days/route.ts`
**Sprint Days Metadata** - Returns all 30 days configuration.
- GET: Array of day objects with titles, descriptions, video IDs

#### `/src/app/api/sprint/[dayNumber]/route.ts`
**Individual Sprint Day API**
- GET: Fetch specific day content
- PUT: Mark day as completed
- Progress tracking

### User Data APIs

#### `/src/app/api/profile/route.ts`
**User Profile Management**
- GET: Fetch user profile + progress
- PUT: Update profile fields
- Returns aggregated statistics

#### `/src/app/api/activities/route.ts`
**Activity Logging**
- GET: Fetch user activity history
- POST: Log new activity event

### Lead & Email APIs

#### `/src/app/api/leads/route.ts`
**Lead Capture API**
- POST: Save email lead from landing page
- Triggers welcome email sequence
- Stores in database

#### `/src/app/api/download/route.ts`
**Lead Magnet Download** - Delivers free resource.
- GET: Returns PDF/resource file
- Requires email submission first

#### `/src/app/api/unsubscribe/route.ts`
**Email Unsubscribe Handler**
- GET: Unsubscribe page rendering
- POST: Process unsubscribe request
- Updates email preferences in database

### Payment APIs

#### `/src/app/api/stripe/checkout/route.ts`
**Stripe Checkout Session Creation**
- POST: Create Stripe checkout session
- Handles different product tiers
- Returns checkout URL

#### `/src/app/api/stripe/webhook/route.ts`
**Stripe Webhook Handler** - Processes payment events.
- POST: Validates webhook signature
- Handles events:
  - `checkout.session.completed`: Provision access
  - `customer.subscription.updated`: Update subscription
  - `invoice.payment_failed`: Handle failed payments
- Updates database with payment status

#### `/src/app/api/checkout/route.ts`
**Legacy Checkout API** (may be deprecated)
- POST: Create checkout session
- Alternate checkout flow

#### `/src/app/api/checkout/create-session/route.ts`
**Checkout Session Helper**
- POST: Simplified session creation
- Used by book sales page

### Chat & AI APIs

#### `/src/app/api/chat/route.ts`
**DiamondMindAI Chat API** - AI assistant endpoint.
- POST: Send message, receive streaming response
- Anthropic Claude integration
- Conversation context management
- Server-sent events for streaming

#### `/src/app/api/ask/route.ts`
**RAG Query API** - Retrieval-Augmented Generation queries.
- POST: Ask question about course content
- Searches course markdown files
- Returns AI-generated answer with sources

### Content APIs

#### `/src/app/api/blog/route.ts`
**Blog Management API**
- GET: Fetch blog posts
- POST: Create new post (admin)
- Used by Decap CMS

### Development APIs

#### `/src/app/api/dev/zip/route.ts`
**Codebase Zipper** - Dev tool for exporting project.
- GET: Creates ZIP of codebase
- Excludes node_modules, .git, .next
- Development only

---

## Shared Components

### Layout Components

#### `/src/components/Navigation.tsx`
**Global Navigation Bar** - Public site header.
- Logo
- Navigation links (Home, Program, Collective, News, Blog)
- Sign in button
- Mobile menu
- Sticky on scroll

#### `/src/components/Footer.tsx`
**Global Footer** - Site-wide footer.
- Social media links
- Legal links (Terms, Privacy, Disclaimer)
- Newsletter signup
- Copyright notice

### Section Components

#### `/src/components/HeroSection.tsx`
**Landing Page Hero** - Reusable hero component.
- Animated headline
- Subheading
- Primary/secondary CTAs
- Social proof statistics
- Micro-testimonials

#### `/src/components/SectionHeader.tsx`
**Section Title Component** - Reusable section headers.
- Consistent typography
- Optional subtitle
- Centered or left-aligned

#### `/src/components/ProblemPainPointsGrid.tsx`
**Problem Framework Grid** - Landing page section.
- Before/after comparison
- Pain point articulation
- Visual grid layout

#### `/src/components/TestimonialsSection.tsx`
**Testimonials Carousel** - Social proof component.
- Animated testimonials slider
- Uses `animated-testimonials` UI component
- Configurable testimonials array

#### `/src/components/LeadMagnetSection.tsx`
**Lead Capture Section** - Email opt-in component.
- Free resource offer
- Email input form
- Form submission handling
- Thank you state

#### `/src/components/BookSalesSection.tsx`
**Book Purchase Section** - Book offer component.
- Product showcase
- Stripe checkout integration
- Benefits list
- Purchase CTA

### Content Components

#### `/src/components/ContentRenderer.tsx`
**Markdown Renderer** - Renders markdown with custom components.
- Video embed support (`{{video:ID}}` syntax)
- Image optimization
- Code syntax highlighting
- Link handling

#### `/src/components/MarkdownMessage.tsx`
**Chat Message Renderer** - Markdown for chat interface.
- Streaming text support
- Code blocks with copy button
- Link previews
- Sanitization

#### `/src/components/LegalPage.tsx`
**Legal Content Wrapper** - Template for legal pages.
- Consistent layout
- Breadcrumbs
- Print styles

### Video Components

#### `/src/components/VideoPlayer.tsx`
**HLS Video Player** - Bunny Stream integration.
- HLS.js for adaptive streaming
- Play/pause controls
- Progress bar
- Fullscreen support
- Autoplay handling

#### `/src/components/PlaylistVideoPlayer.tsx`
**Playlist Video Player** - Multi-video player.
- Video queue management
- Auto-advance to next video
- Thumbnail grid
- Progress tracking

### Utility Components

#### `/src/components/FeatureGuard.tsx`
**Feature Flag Wrapper** - Conditionally render features.
- Checks feature flags from config
- Hides/shows components based on environment
- Development vs production toggling

#### `/src/components/ErrorBoundary.tsx`
**Error Boundary** - Catches React errors.
- Error message display
- Fallback UI
- Error reporting (optional)

#### `/src/components/MemberAreaTransition.tsx`
**Page Transition** - Animation wrapper for route changes.
- Fade in/out effects
- Loading states
- Smooth navigation

---

## UI Components Library

Located in `/src/components/ui/` - 89 pre-built Aceternity UI components.

**Note:** These are vendor components and should NOT be modified. Treat as external library.

### Key UI Components Used

- **animated-testimonials.tsx** - Testimonials carousel with 3D card stack
- **bento-grid.tsx** - Feature showcase grid layout
- **card-spotlight.tsx** - Cards with spotlight hover effect
- **globe.tsx** - 3D animated globe with arcs
- **lamp.tsx** - Lamp effect background animation
- **timeline.tsx** - Vertical timeline for program phases
- **spotlight.tsx** - Hero spotlight effect
- **background-beams.tsx** - Animated background lines
- **hover-border-gradient.tsx** - Gradient border on hover
- **text-generate-effect.tsx** - Typewriter text animation
- **world-map.tsx** - Interactive world map visualization
- **lens.tsx** - Magnifying lens effect
- **meteors.tsx** - Falling meteors background
- **stars-background.tsx** - Starfield animation
- **vortex.tsx** - Swirling vortex background

**Other Components:** 3D cards, animated modals, flip words, floating navbar, following pointer, parallax scroll, particles, pixelated canvas, shooting stars, tabs, and more.

---

## Utility Libraries

### `/src/lib/content.ts`
**Content Management API** - Reads markdown files from git-based CMS.
- `getContentByType(type)`: Fetch all items of a type (news, blog, pages)
- `getContentBySlug(type, slug)`: Fetch single item
- Parses frontmatter with `gray-matter`
- Converts markdown to HTML with `remark`
- Filters by published status
- Auto-sorts by date

### `/src/lib/course-parser.ts`
**Course Content Parser** - Parses course markdown files.
- Extracts slide metadata from markdown
- Parses `{{video:ID}}` syntax
- Splits course into individual slides
- Generates table of contents
- Slide numbering and sequencing

### `/src/lib/utils.ts`
**Utility Functions** - Common helpers.
- `cn()`: Tailwind class merging (clsx + tailwind-merge)
- Date formatting
- String manipulation
- Validation helpers

### `/src/lib/storage.ts`
**Browser Storage Abstraction** - LocalStorage/SessionStorage wrapper.
- Type-safe storage access
- JSON serialization
- Expiration handling
- SSR-safe (no window errors)

### `/src/lib/progress.ts`
**Progress Tracking** - User progress calculations.
- Course completion percentage
- Slide completion tracking
- Activity logging
- Statistics aggregation

### `/src/lib/sprint-progress.ts`
**Sprint Progress** - 30-day sprint tracking.
- Day completion status
- Streak calculation
- Progress visualization data
- Reset functionality

### `/src/lib/turso.ts`
**Turso Database Client** - SQLite edge database.
- Connection setup
- Query execution
- Transaction handling
- Migration runner

### `/src/lib/turso-adapter.ts`
**NextAuth Turso Adapter** - Database adapter for NextAuth.
- User table CRUD
- Session management
- Account linking
- Magic link verification tokens

### `/src/lib/stripe.ts`
**Stripe Client** - Payment processing.
- Stripe SDK initialization
- Product/price fetching
- Checkout session creation
- Webhook signature verification

### `/src/lib/email-service.ts`
**Email Service Abstraction** - Email sending interface.
- Supports Resend and Gmail SMTP
- Template rendering
- Queue management
- Error handling

### `/src/lib/resend.ts`
**Resend Email Client** - Transactional email via Resend API.
- Magic link emails
- Welcome emails
- Course completion emails
- HTML template support

### `/src/lib/gmail-smtp.ts`
**Gmail SMTP Client** - Email via Gmail SMTP.
- OAuth2 authentication
- Template rendering with React Email
- Attachment support
- Fallback for Resend

### `/src/lib/rag/claude-simple.ts`
**RAG Implementation** - Retrieval-Augmented Generation.
- Searches course markdown files
- Chunks content for context
- Sends to Claude API
- Returns AI-generated answers with sources

### `/src/lib/logger.ts`
**Logging Utility** - Structured logging.
- Console logging wrapper
- Log levels (debug, info, warn, error)
- Contextual metadata
- Production log filtering

### `/src/lib/migrate-to-db.ts`
**Database Migration Tool** - Migrate data to Turso.
- Imports users from old system
- Migrates progress data
- Course enrollment sync
- One-time migration script

### `/src/lib/test-parser.ts`
**Test Parser** - Development tool for testing course parser.
- Validates course markdown syntax
- Tests video ID extraction
- Debugging output

---

## Email Templates

### `/src/emails/welcome-email.tsx`
**Welcome Email Template** - Sent after lead capture.
- React Email component
- Branded design
- CTA to member portal
- Personalization tokens

**Future Templates** (not yet implemented):
- Magic link email
- Course completion email
- Payment receipt email
- Weekly digest email

---

## Testing Infrastructure

### Unit Tests (`/src/test/unit/`)

#### `/src/test/unit/lib/content.test.ts`
Tests for content management API.
- Fetching content by type
- Filtering published content
- Markdown parsing
- Frontmatter extraction

#### `/src/test/unit/lib/course-parser.test.ts`
Tests for course parser.
- Slide extraction
- Video ID parsing
- Table of contents generation
- Edge cases

#### `/src/test/unit/components/MarkdownMessage.test.tsx`
Tests for markdown rendering in chat.
- Code block rendering
- Link handling
- Streaming support

#### `/src/test/unit/components/CourseProgress.test.tsx`
Tests for progress calculations.
- Completion percentage
- Slide tracking
- Edge cases (0%, 100%)

### E2E Tests (`/src/test/e2e/`) - Playwright

#### `/src/test/e2e/landing.spec.ts`
Landing page smoke tests.
- Hero renders
- Navigation works
- CTAs clickable

#### `/src/test/e2e/landing-extended.spec.ts`
Extended landing page tests.
- Section rendering
- Form submissions
- Animations trigger

#### `/src/test/e2e/auth-flow.spec.ts`
Authentication flow tests.
- Magic link request
- Email verification
- Session creation

#### `/src/test/e2e/oauth-flow.spec.ts`
OAuth flow tests (GitHub for CMS).
- OAuth initiation
- Callback handling
- Token exchange

#### `/src/test/e2e/member-portal.spec.ts`
Member portal tests.
- Dashboard loads
- Navigation works
- Protected routes

#### `/src/test/e2e/member-portal-extended.spec.ts`
Extended member portal tests.
- Course enrollment
- Progress tracking
- Settings updates

#### `/src/test/e2e/course-playback.spec.ts`
Course player tests.
- Slide navigation
- Video playback
- Progress saving

#### `/src/test/e2e/course-interactions.spec.ts`
Course interaction tests.
- Notes taking
- Bookmarks
- Completion

#### `/src/test/e2e/chat-interaction.spec.ts`
AI chat tests.
- Message sending
- Streaming responses
- Context preservation

#### `/src/test/e2e/sprint.spec.ts`
Sprint program tests.
- Day navigation
- Completion tracking
- Dashboard stats

#### `/src/test/e2e/payment-flow.spec.ts`
Stripe payment tests.
- Checkout creation
- Webhook handling
- Access provisioning

#### `/src/test/e2e/profile.spec.ts`
User profile tests.
- Profile viewing
- Updates
- Avatar upload

#### `/src/test/e2e/settings.spec.ts`
Settings page tests.
- Preference updates
- Email settings
- Account deletion

#### `/src/test/e2e/content-pages.spec.ts`
Content page tests.
- News articles
- Blog posts
- Legal pages

### Test Utilities

#### `/src/test/setup.ts`
Test environment setup.
- Vitest configuration
- Global mocks
- Test database setup

#### `/src/test/utils/test-utils.tsx`
React testing utilities.
- Custom render function with providers
- Mock context values
- Test helpers

#### `/src/test/utils/auth-helpers.ts`
Authentication test helpers.
- Mock user sessions
- Login/logout helpers
- Protected route testing

#### `/src/test/utils/email-helpers.ts`
Email testing utilities.
- Mock email service
- Email verification helpers
- Template testing

### Test Fixtures

#### `/src/test/fixtures/user.ts`
Mock user data for tests.

#### `/src/test/fixtures/course.ts`
Mock course data for tests.

---

## Configuration

### `/src/config/features.ts`
**Feature Flags** - Toggle features by environment.
```typescript
export const features = {
  diamondMindAI: process.env.NEXT_PUBLIC_ENABLE_AI === 'true',
  sprintProgram: true,
  payments: process.env.NODE_ENV === 'production',
};
```

---

## Data Flow Diagrams

### Authentication Flow
```
User → /auth/signin
  → Email input → POST /api/auth/signin
  → Magic link email sent
  → User clicks link → /api/auth/callback
  → Session created → Redirect to /app
```

### Course Playback Flow
```
User → /app/courses/[courseId]
  → Fetch course metadata (API)
  → Render slide markdown
  → Extract video ID → Request token (/api/video/[videoId]/token)
  → Load HLS stream from Bunny CDN
  → Track progress → Update database
```

### Payment Flow
```
User → Book page → Click "Buy Now"
  → POST /api/stripe/checkout → Create Stripe session
  → Redirect to Stripe → User completes payment
  → Stripe webhook → POST /api/stripe/webhook
  → Verify signature → Update database → Grant access
  → Send confirmation email → Redirect to /book/success
```

### AI Chat Flow
```
User → /app/chat → Type message
  → POST /api/chat
  → Search course files (RAG)
  → Send to Claude API → Stream response
  → Display in chat → Save to context
```

---

## Database Schema

### Turso Database Tables

**users**
- `id`: Primary key
- `email`: Unique email
- `name`: Display name
- `image`: Avatar URL
- `emailVerified`: Timestamp
- `createdAt`: Timestamp

**accounts**
- `userId`: Foreign key to users
- `type`: "email" | "oauth"
- `provider`: "email" | "github"
- `providerAccountId`: External account ID

**sessions**
- `sessionToken`: Unique session ID
- `userId`: Foreign key to users
- `expires`: Expiration timestamp

**verification_tokens**
- `identifier`: Email address
- `token`: Magic link token
- `expires`: Expiration timestamp

**courses**
- `id`: Primary key
- `title`: Course name
- `slug`: URL-friendly identifier
- `description`: Course summary
- `content`: Markdown content
- `published`: Boolean
- `price`: Decimal (cents)
- `createdAt`: Timestamp

**user_progress**
- `userId`: Foreign key
- `courseId`: Foreign key
- `slideIndex`: Current slide position
- `completed`: Boolean
- `lastAccessedAt`: Timestamp

**activities**
- `id`: Primary key
- `userId`: Foreign key
- `type`: Activity type
- `metadata`: JSON data
- `createdAt`: Timestamp

**leads**
- `id`: Primary key
- `email`: Email address
- `source`: Lead source (landing page, etc.)
- `unsubscribed`: Boolean
- `createdAt`: Timestamp

**payments**
- `id`: Primary key
- `userId`: Foreign key
- `stripeSessionId`: Stripe checkout session
- `amount`: Decimal
- `status`: "pending" | "succeeded" | "failed"
- `createdAt`: Timestamp

---

## Environment Variables

```bash
# Database
DATABASE_URL=libsql://[db-name].turso.io
DATABASE_AUTH_TOKEN=eyJ...

# Authentication
NEXTAUTH_URL=http://localhost:3003
NEXTAUTH_SECRET=random-secret-string

# Email
RESEND_API_KEY=re_...
GMAIL_USER=email@gmail.com
GMAIL_CLIENT_ID=...
GMAIL_CLIENT_SECRET=...
GMAIL_REFRESH_TOKEN=...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Bunny Stream
BUNNY_LIBRARY_ID=12345
BUNNY_API_KEY=abc-123...
BUNNY_CDN_HOSTNAME=vz-abc-123.b-cdn.net

# Anthropic Claude
ANTHROPIC_API_KEY=sk-ant-...

# CMS (Decap)
GITHUB_CLIENT_ID=abc123...
GITHUB_CLIENT_SECRET=secret123...

# Feature Flags
NEXT_PUBLIC_ENABLE_AI=true
NODE_ENV=development
```

---

## Deployment Architecture

### Vercel Deployment
- **Platform:** Vercel (serverless)
- **Edge Functions:** API routes run on Vercel Edge
- **CDN:** Static assets cached globally
- **Database:** Turso (SQLite edge replicas)
- **Video CDN:** Bunny Stream
- **Email:** Resend + Gmail SMTP fallback

### Build Process
1. `npm run prebuild` - Copy Decap CMS assets
2. `next build` - Create production build with Turbopack
3. Static generation for content pages
4. API routes bundled as serverless functions

### Performance Optimizations
- **Code Splitting:** Dynamic imports for heavy components (Globe, World)
- **Static Generation:** News/blog pages pre-rendered at build time
- **Image Optimization:** Next.js Image component (when used)
- **Font Optimization:** Geist fonts with next/font
- **CSS:** Tailwind with minimal runtime overhead

---

## Development Workflow

### Local Development
```bash
npm run dev    # Start dev server (localhost:3003)
npm run build  # Test production build
npm run lint   # Run ESLint
npm test       # Run unit tests
npm run test:e2e  # Run Playwright tests
```

### Content Management
1. Navigate to `/admin` (Decap CMS)
2. Authenticate with GitHub
3. Create/edit content
4. Publish → Commit to repository
5. Rebuild site to reflect changes

### Code Quality
- **TypeScript:** Type checking (not strict mode)
- **ESLint:** Linting (relaxed rules)
- **Prettier:** Code formatting (if configured)
- **Git Hooks:** Pre-commit linting (if configured)

---

## Security Considerations

### Authentication
- Magic link authentication (no passwords)
- Secure session tokens
- CSRF protection via NextAuth
- Email verification required

### API Security
- Route protection with session validation
- Stripe webhook signature verification
- Video token expiration (24 hours)
- Rate limiting (to be implemented)

### Data Protection
- Environment variables for secrets
- No sensitive data in client bundles
- SQL injection prevention (parameterized queries)
- XSS protection (React auto-escaping)

### Content Security
- Markdown sanitization
- Video stream signing
- CMS OAuth (GitHub only)

---

## Future Enhancements

### Planned Features
- [ ] Real-time notifications (Pusher/Ably)
- [ ] Mobile app (React Native)
- [ ] Downloadable course content
- [ ] Certificates of completion
- [ ] Community forum
- [ ] Live sessions (Zoom integration)
- [ ] Advanced analytics dashboard
- [ ] A/B testing framework
- [ ] Multi-language support
- [ ] Affiliate program

### Technical Debt
- [ ] Replace `<img>` with `next/image` throughout
- [ ] Add API rate limiting
- [ ] Implement ISR for content pages
- [ ] Add comprehensive error logging (Sentry)
- [ ] Improve test coverage (>80%)
- [ ] Add bundle size monitoring
- [ ] Implement CSP headers
- [ ] Add performance monitoring

---

## Additional Documentation

- **CLAUDE.md** - Detailed architectural guide for AI assistants
- **README.md** - Project setup and getting started
- **docs/specs/** - Feature specifications and PRDs
  - `video-integration-simplified.md`
  - `video-hosting-analysis.md`
  - `performance-optimization.prd.md`

---

## Contributing Guidelines

1. **Never modify** files in `src/components/ui/` (vendor code)
2. **Always use** path aliases (`@/*`)
3. **Prefer** existing components over creating new ones
4. **Test** locally before committing
5. **Follow** existing naming conventions
6. **Document** new features in CLAUDE.md

---

**Last Updated:** 2025-01-05
**Maintainer:** Development Team
**License:** Proprietary
