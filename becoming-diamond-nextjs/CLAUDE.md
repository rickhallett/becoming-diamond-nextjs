# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Development Server
```bash
npm run dev
```
Runs Next.js dev server with Turbopack on http://localhost:3003

### Build
```bash
npm run build
```
Creates production build with Turbopack. Note: `prebuild` script automatically copies Decap CMS assets to `public/admin/`

### Testing
```bash
npm test              # Run all tests with Vitest
npm run test:unit     # Run unit tests only
npm run test:integration  # Run integration tests
npm run test:ui       # Open Vitest UI
npm run test:coverage # Run tests with coverage report
npm run test:watch    # Run tests in watch mode

npm run test:e2e       # Run Playwright E2E tests
npm run test:e2e:ui    # Open Playwright UI mode
npm run test:e2e:debug # Debug E2E tests
npm run test:e2e:headed  # Run E2E with browser visible
npm run test:e2e:report  # Show E2E test report
```

### Linting & Code Quality
```bash
npm run lint        # Run ESLint
npm run lint:fix    # Auto-fix linting issues
npm run lint:next   # Run Next.js linter
npm run knip        # Detect unused files/dependencies
```

### Database
```bash
npm run db:migrate  # Run database migrations
```

### Cleanup
```bash
npm run cleanup:knip          # Preview cleanup (dry run)
npm run cleanup:knip:execute  # Execute cleanup of unused code
```
See `docs/knip-cleanup-checklist.md` for interactive cleanup management.

### Utility Scripts
```bash
npm run test:auth   # Test authentication setup
```

## Architecture Overview

### High-Level Architecture

This is a **Next.js 15 MVP application** focused on core features with a **simplified hybrid rendering strategy**:
- **Public pages** (landing, blog, book): Server-side rendered (SSR) and statically generated (SSG)
- **Member portal** (`/app/*`): Client-side rendered (CSR) with NextAuth protected routes
- **Admin portal** (`/app/admin/*`): Admin-only pages for lead management (email-based access control)
- **CMS integration**: Decap CMS with GitHub backend for blog content management

**MVP Scope** (Simplified January 2025):
- ✅ **30-Day Sprint**: Core video-based training program with progress tracking
- ✅ **Blog (Insights)**: Content management via Decap CMS
- ✅ **Book Sales**: Digital product sales with Stripe integration
- ✅ **Lead Generation**: Email collection via Gmail SMTP
- ✅ **Admin Tools**: Lead management dashboard (admin-only)
- ❌ **Removed**: Course platform, AI chat (DiamondMindAI), News section, Settings, Support ticketing

**Architectural Pattern**: Layered architecture with clear separation:
1. **Presentation Layer**: React Server/Client Components with Aceternity UI
2. **Business Logic Layer**: Sprint progress tracking, authentication flows, payment processing
3. **Data Layer**: File-based CMS (markdown) + Turso database (user data) + NextAuth sessions
4. **Infrastructure Layer**: Next.js 15 with Turbopack, Bunny Stream (video), Stripe (payments), Gmail SMTP (email)

### Project Structure

**Key directories:**
- `src/app/` - Next.js App Router pages (routing via file system)
  - `page.tsx` - Public landing page (client component, SSR)
  - `app/` - Protected member portal (NextAuth authentication required)
    - `layout.tsx` - Sidebar layout with admin detection and conditional navigation
    - `page.tsx` - Dashboard with sprint stats and user progress
    - `sprint/` - 30-day sprint pages and video player
    - `profile/` - User profile management
    - `admin/` - Admin-only pages (email-based access control)
      - `leads/` - Lead management dashboard
  - `auth/` - Authentication pages (NextAuth magic link + OAuth flow)
  - `blog/` - Dynamic routes for blog content ([slug])
    - `[slug]/page.tsx` - Individual blog post pages (SSG with `generateStaticParams`)
  - `book/` - Book sales landing page
  - `collective/` - DiamondMind Immersion landing page
  - `program/` - Training program information
  - `api/` - API Routes (Route Handlers)
    - `auth/[...nextauth]/route.ts` - NextAuth authentication handlers
    - `profile/route.ts` - User profile management
    - `leads/route.ts` - Lead capture endpoint
- `src/components/ui/` - 89 Aceternity UI components (pre-built, complex animations)
- `src/lib/` - Shared utilities
  - `content.ts` - Content management API (gray-matter + remark)
  - `utils.ts` - Tailwind class merging utility (cn)
- `src/hooks/` - Custom React hooks (e.g., `use-outside-click.tsx`)
- `content/` - Git-based content storage (managed by Decap CMS)
  - `blog/`, `pages/`, `settings/` - Markdown files with frontmatter
  - `sprint/` - 30-day sprint content (day-01.md through day-30.md)
- `public/admin/` - Decap CMS admin interface
  - `config.yml` - CMS configuration (collections, fields, GitHub backend)
  - `index.html` - CMS entry point
  - `decap-cms.js` - CMS bundle (copied from node_modules on build)
- `scripts/` - Utility scripts
  - `cleanup-from-checklist.ts` - Automated cleanup based on knip analysis
  - `migrate-db.ts` - Database migration runner
  - `test-auth-setup.ts` - Authentication testing
  - Various admin/debug scripts for database queries
- `docs/` - Documentation
  - `specs/` - Feature specifications and planning documents
  - `guides/` - Developer guides and handoff documentation
  - `knip-cleanup-*.md` - Code cleanup checklists and reports

### Technology Stack

- **Framework:** Next.js 15.5.3 with App Router, React 19, Turbopack
- **Styling:** Tailwind CSS 4 (inline config in `globals.css`), `tw-animate-css`
- **UI Library:** Aceternity UI components with heavy use of:
  - Framer Motion for animations
  - React Three Fiber for 3D graphics
  - Radix UI primitives
- **Content Management:** Decap CMS with GitHub backend for blog content
- **Authentication:** NextAuth v5 (magic link via Gmail SMTP, Google OAuth, optional GitHub OAuth)
- **Database:** Turso (libSQL) with custom adapter for user data and sessions
- **Video Platform:** Bunny Stream with HLS delivery and token-based authentication
- **Payments:** Stripe for book sales and product purchases
- **Email:** Gmail SMTP via Nodemailer for transactional emails
- **Content Processing:** Gray-matter for frontmatter, Remark for markdown to HTML
- **Testing:** Vitest (unit/integration), Playwright (E2E), React Testing Library
- **Code Quality:** ESLint, Knip (unused code detection)
- **Logging:** Axiom (structured logging and monitoring)

### Admin Access Control

**Pattern**: Email-based admin detection without separate roles table

Admin users are identified by email address in the member portal layout:
```typescript
// src/app/app/layout.tsx
const isAdmin = session?.user?.email === 'support@becomingdiamond.com';
```

**Navigation items** have an `adminOnly` flag:
```typescript
{ name: "Lead Management", href: "/app/admin/leads", icon: IconUsers, adminOnly: true }
```

**Admin Features:**
- Lead management dashboard (`/app/admin/leads`)
- Admin-only navigation items (conditionally rendered)
- Email-based access control (no database roles needed for MVP)

**Future Considerations:**
- Move admin check to database role when scaling beyond single admin
- Add middleware protection for admin routes
- Implement audit logging for admin actions

### Content Management System (Decap CMS)

**Architecture Pattern**: Git-based CMS with OAuth-protected editing

The project uses **Decap CMS** (formerly Netlify CMS) for content management:
- **Storage**: Git-based (content stored as markdown files in repository)
- **Backend**: GitHub (content commits pushed to repository)
- **Authentication**: GitHub OAuth (see API routes section)
- **Access**: `/admin` route (served as static HTML)

**Content Collections:**
- `blog/` - Blog posts (Insights) with author, categories, tags, published status
- `sprint/` - 30-day sprint lessons with video IDs and metadata
- `pages/` - Static pages (privacy, terms) - file-based collection
- `settings/` - Site configuration (general settings, social media) - YAML format

**Content Structure:**
```
content/
├── blog/YYYY-MM-DD-slug.md      # Markdown with YAML frontmatter
├── sprint/day-01.md through day-30.md  # Sprint lessons
├── pages/[name].md              # Static page content
└── settings/general.yml         # Site-wide settings
```

**Content API** (`src/lib/content.ts`):
- `getContentByType(type: string): Promise<ContentItem[]>`
  - Reads markdown files from `content/{type}/` directory
  - Parses frontmatter with `gray-matter`
  - Converts markdown to HTML with `remark` + `remark-html`
  - Filters out unpublished items (`published: false`)
  - Auto-sorts by date (newest first)
  - Returns array of `ContentItem` objects
- `getContentBySlug(type: string, slug: string): Promise<ContentItem | null>`
  - Fetches single content item
  - Returns null if not found
  - Used for dynamic route generation

**ContentItem Interface:**
```typescript
{
  slug: string;
  frontmatter: {
    title: string;
    date?: string;
    description?: string;
    thumbnail?: string;
    published?: boolean;
    [key: string]: unknown;
  };
  content: string; // HTML rendered from markdown
}
```

**CMS Workflow:**
1. Editor accesses `/admin` (static HTML page)
2. Decap CMS loads from `/admin/decap-cms.js` (copied via prebuild script)
3. OAuth authentication via `/api/cms-auth` (GitHub)
4. Editor creates/edits content through CMS UI
5. CMS commits changes to GitHub repository
6. Next.js rebuilds pages on next deployment

### Path Aliases

TypeScript path mapping (`@/*` → `./src/*` AND `./`):
```typescript
import { Component } from '@/components/ui/component'
import { getContentByType } from '@/lib/content'
import { auth } from '@/auth'  // Root-level auth.ts
```

**IMPORTANT**: The `auth.ts` file is at project root, NOT in `src/`. Always import as `@/auth`, never use relative paths like `../../../../../auth`.

### ESLint Configuration

Custom rules in `eslint.config.mjs`:
- Unused vars with `_` prefix ignored
- `@typescript-eslint/no-explicit-any` is warn (not error)
- `@next/next/no-img-element` disabled
- **UI components directory (`src/components/ui/`) is excluded from linting**

### Authentication Flow (GitHub OAuth)

**Pattern**: OAuth 2.0 with popup window and postMessage communication

**API Routes:**

1. **`/api/cms-auth` (GET)** - OAuth Initiation for Decap CMS
   - Query param: `provider=github`
   - Redirects to GitHub authorization URL
   - Includes `client_id`, `redirect_uri`, and `scope` (repo, user)
   - Redirect target: `{origin}/api/callback`

2. **`/api/cms-auth` (POST)** - Token Exchange
   - Receives: `{ code, provider }`
   - Exchanges authorization code for access token
   - Fetches user info from GitHub API
   - Returns: `{ token, provider, user: { login, name, email, avatar_url } }`

3. **`/api/callback` (GET)** - OAuth Callback Handler
   - Receives: `code` and `state` query params from GitHub
   - Returns HTML page with embedded JavaScript
   - Uses `window.postMessage` to communicate authorization code back to CMS opener window
   - **Critical Pattern**: Popup-based OAuth flow with cross-window messaging

**Authentication Flow:**
```
1. User clicks "Login with GitHub" in Decap CMS (/admin)
2. CMS opens popup to /api/cms-auth?provider=github
3. Server redirects popup to GitHub OAuth authorize page
4. User authorizes on GitHub
5. GitHub redirects to /api/callback?code=XXX
6. Callback page sends code via postMessage to parent window
7. CMS receives code and calls /api/cms-auth (POST) to exchange for token
8. CMS uses token for GitHub API operations
```

**Environment Variables Required:**
- `GITHUB_CLIENT_ID` - GitHub OAuth App Client ID (for Decap CMS)
- `GITHUB_CLIENT_SECRET` - GitHub OAuth App Client Secret (for Decap CMS)
- `AUTH_GITHUB_ID` - GitHub OAuth for member authentication (separate app)
- `AUTH_GITHUB_SECRET` - GitHub OAuth secret for member authentication

**Note**: Decap CMS and member authentication use **separate GitHub OAuth apps** with different callback URLs.

### Landing Page Architecture

**Component Type**: Client Component (`"use client"`)

The main landing page (`src/app/page.tsx`) demonstrates advanced React patterns:
- **Dynamic Imports**: Heavy 3D components (Globe/World) loaded with `next/dynamic` for code-splitting
  ```typescript
  const World = dynamic(() => import("@/components/ui/globe").then(m => m.World), { ssr: false });
  ```
- **Performance Optimization**: `ssr: false` prevents server-side rendering of WebGL components
- **Scroll-based State**: `useEffect` with scroll event listener for navbar state
- **Framer Motion**: Extensive animation orchestration with `motion` components

**Page Sections:**
1. Hero with Spotlight effect and gradient text
2. BentoGrid feature showcase
3. Timeline component (program phases)
4. Animated testimonials
5. 3D Globe visualization with arc animations
6. Background effects (BackgroundBeams)

**Mobile Responsiveness:**
- Mobile menu state management
- Responsive grid layouts (Tailwind breakpoints)
- Touch-optimized navigation

### Member Portal Architecture

**Pattern**: Protected SPA with shared layout and admin detection

**Layout Structure** (`/app/*/`):
- **Shared Layout** (`src/app/app/layout.tsx`) - Client Component
  - Fixed sidebar navigation (desktop) with active route highlighting
  - Mobile drawer navigation with backdrop
  - Logo, navigation items, logout button
  - `usePathname()` hook for active route detection
  - Uses Tabler Icons for UI icons
  - **Admin Detection**: Checks `session?.user?.email === 'support@becomingdiamond.com'`
  - **Conditional Navigation**: Filters items based on `adminOnly` flag and feature flags

**Navigation Items (Simplified MVP):**
```typescript
[
  { name: "30 Day Sprint", href: "/app/sprint", icon: IconRocket, feature: null, adminOnly: false },
  { name: "Profile", href: "/app/profile", icon: IconUser, feature: null, adminOnly: false },
  { name: "Lead Management", href: "/app/admin/leads", icon: IconUsers, feature: null, adminOnly: true },
]
```

**Page Structure:**
- `page.tsx` - Dashboard with sprint stats, user progress, recent activity
- `sprint/page.tsx` - 30-day sprint overview and daily lessons
- `sprint/day/[day]/page.tsx` - Individual day lessons with video player
- `sprint/watch/page.tsx` - Continuous video playlist mode
- `profile/page.tsx` - User profile management and sprint achievements
- `admin/leads/page.tsx` - Lead management (admin-only)

**State Management:**
- User state via React Context (`UserContext`) with session integration
- Local component state with `useState` for UI interactions
- Sprint progress tracking with localStorage (planned: database sync)
- NextAuth session management for authentication state

**Design System:**
- Pure black theme (`--background: #000000`)
- Diamond blue accent color (`--primary: #4fc3f7`)
- Gradient backgrounds with blur effects
- Consistent spacing and border styles

### Component Organization and Patterns

**Aceternity UI Components** (`src/components/ui/`):
- **Count**: 89 pre-built, effect-heavy components
- **Purpose**: Visual effects, animations, 3D graphics, advanced UI patterns
- **Technology**: Framer Motion, React Three Fiber, Radix UI, Tailwind CSS
- **Pattern**: Self-contained components with minimal configuration
- **Linting**: Excluded from ESLint to preserve vendor code
- **Usage**: Import directly, avoid modification, treat as external library

**Component Categories:**
1. **3D Components**: 3d-card, 3d-marquee, 3d-pin, globe, world-map
2. **Backgrounds**: aurora-background, background-beams, background-boxes, stars-background, sparkles-background
3. **Animations**: animated-modal, animated-testimonials, flip-words, text-generate-effect
4. **Cards**: bento-grid, card-hover-effect, card-spotlight, focus-cards, wobble-card
5. **Navigation**: floating-navbar, sidebar, resizable-navbar
6. **Effects**: spotlight, lens, vortex, meteors, shooting-stars
7. **Inputs**: file-upload, placeholders-and-vanish-input
8. **Layout**: timeline, tabs, container-scroll-animation, sticky-scroll-reveal

**Custom Components Pattern:**
- Should be created in `src/components/` (not `/ui`)
- Use Aceternity components as building blocks
- Follow client/server component distinction
- Use TypeScript interfaces for props
- Leverage Tailwind with `cn()` utility for styling

### Data Flow Architecture

**Content Flow** (File-based CMS):
```
Editor → Decap CMS UI → GitHub OAuth → Git Commit → Repository
                                                          ↓
Build Process → getContentByType() → gray-matter → remark → HTML
                                                          ↓
                                            React Components → User
```

**Static Generation Flow** (Blog):
```
Build Time:
  → generateStaticParams() reads all markdown files
  → Creates static routes for each slug
  → Pre-renders pages with content
  → Outputs static HTML

Request Time:
  → Next.js serves pre-rendered HTML
  → No database queries or API calls needed
```

**Client-Side Rendering Flow** (Member Portal):
```
User Navigation → Route Change (client-side)
                       ↓
                 Layout renders (persistent)
                       ↓
                 Page component mounts
                       ↓
                 Local state initialized
                       ↓
                 UI renders with animations
```

**Authentication Data Flow**:
```
CMS Login → OAuth Popup → GitHub Authorization → Callback
                                                      ↓
                                            postMessage to parent
                                                      ↓
                                            Token exchange (POST)
                                                      ↓
                                            GitHub API Token
                                                      ↓
                                            CMS Git Operations
```

### API Structure

**Route Handlers** (Next.js 15 App Router):
- Location: `src/app/api/*/route.ts`
- HTTP methods as named exports: `GET`, `POST`, `PUT`, `DELETE`
- Receives: `NextRequest` object
- Returns: `NextResponse` object or `Response`

**Current API Endpoints (MVP):**

1. **`/api/auth/[...nextauth]`**
   - NextAuth handlers for authentication (magic link, Google OAuth, GitHub OAuth)
   - Session management and JWT tokens

2. **`/api/profile`**
   - `GET`: Fetch user profile data
   - `PUT`: Update user profile (name, bio, location, website)

3. **`/api/leads`**
   - `POST`: Capture email leads for sprint signup

4. **`/api/stripe/webhooks`**
   - `POST`: Handle Stripe payment webhooks for book purchases

5. **`/api/cms-auth`**
   - `GET`: Initiate GitHub OAuth for Decap CMS
   - `POST`: Exchange authorization code for token

6. **`/api/callback`**
   - `GET`: OAuth callback handler for Decap CMS

**API Patterns:**
- Environment variables for secrets (NextAuth, Stripe, Gmail, Turso)
- Error handling with appropriate HTTP status codes
- JSON responses for data endpoints
- NextAuth middleware for route protection
- Database operations via Turso adapter

**Future Expansion (Post-MVP):**
- `/api/video/[videoId]/token` - Video streaming token generation for Bunny Stream
- `/api/sprint/progress` - Sprint progress tracking and completion (in planning - see docs/specs/sprint-progress-database-migration.md)
- `/api/achievements` - User achievement system

### Testing Infrastructure

**Unit & Integration Tests** (Vitest):
- Location: `src/test/unit/` and `src/test/integration/`
- Framework: Vitest with React Testing Library
- Coverage: Available via `npm run test:coverage`
- UI Mode: Interactive test runner via `npm run test:ui`

**E2E Tests** (Playwright):
- Framework: Playwright with accessibility testing (@axe-core/playwright)
- Commands: `test:e2e`, `test:e2e:ui`, `test:e2e:debug`, `test:e2e:headed`
- Reports: Available via `npm run test:e2e:report`

**Test Structure:**
```
src/test/
├── unit/           # Component and utility tests
├── integration/    # API and integration tests
└── fixtures/       # Test data and mocks
```

### Code Maintenance Tools

**Knip** - Unused Code Detection:
- Configuration: `knip.json`
- Detects: Unused files, exports, dependencies, unresolved imports
- Run: `npm run knip`

**Automated Cleanup**:
- Interactive checklist: `docs/knip-cleanup-checklist.md`
- Preview: `npm run cleanup:knip` (dry run, safe)
- Execute: `npm run cleanup:knip:execute` (performs deletions)
- Script: `scripts/cleanup-from-checklist.ts`
- Features:
  - Checkbox-based selection (check to KEEP, uncheck to DELETE)
  - Automatic backups before deletion (`.cleanup-backup/`)
  - Detailed logging (`cleanup-log.txt`)
  - 5-second safety countdown
- Documentation: `scripts/README-cleanup.md`, `docs/knip-cleanup-summary.md`

### Architectural Decisions and Trade-offs

**Key Decisions:**

1. **File-based CMS vs. Database**
   - **Chosen**: Decap CMS with Git-based storage
   - **Rationale**: Version control, no database infrastructure, easy backups, content in repository
   - **Trade-off**: Limited query capabilities, no real-time updates, rebuild required for content changes
   - **Suitable for**: Marketing content, documentation, blog posts
   - **Not suitable for**: User-generated content, real-time data, high-frequency updates

2. **Client Components for Landing Page**
   - **Chosen**: `"use client"` directive for main landing page
   - **Rationale**: Heavy use of animations, scroll effects, and interactive 3D components
   - **Trade-off**: Larger initial JavaScript bundle, no static optimization for interactive elements
   - **Mitigation**: Dynamic imports with `ssr: false` for heavy 3D components

3. **App Router vs. Pages Router**
   - **Chosen**: Next.js 15 App Router
   - **Rationale**: Modern React patterns (Server Components), better performance, improved routing
   - **Trade-off**: Newer API, fewer examples online, requires understanding client/server boundaries
   - **Benefits**: Streaming SSR, improved data fetching, nested layouts

4. **Tailwind CSS 4 Inline Configuration**
   - **Chosen**: `@theme inline` in `globals.css` instead of `tailwind.config.js`
   - **Rationale**: Tailwind CSS 4 best practice, single source of truth, better performance
   - **Trade-off**: Non-standard location for configuration, harder to find for newcomers
   - **Location**: `src/app/globals.css` (lines 6-44)

5. **NextAuth v5 with Multiple Providers**
   - **Chosen**: Magic link (primary), Google OAuth, optional GitHub OAuth
   - **Rationale**: Passwordless experience reduces friction, multiple options for user preference
   - **Trade-off**: Email delivery dependency (Gmail SMTP), session management complexity
   - **Implementation**: Custom Turso adapter for session storage, conditional GitHub OAuth via feature flags

6. **Email-based Admin Access Control**
   - **Chosen**: Simple email check (`support@becomingdiamond.com`) for admin detection
   - **Rationale**: Single admin user for MVP, no need for complex RBAC
   - **Trade-off**: Hardcoded email address, not scalable for multiple admins
   - **Future**: Move to database-backed roles when scaling

7. **Turbopack for Development and Build**
   - **Chosen**: `--turbopack` flag for both dev and build
   - **Rationale**: Faster builds, improved development experience
   - **Trade-off**: Newer bundler, potential compatibility issues
   - **Status**: Next.js 15 feature, increasingly stable

**Design Patterns in Use:**
- **Compound Components**: BentoGrid + BentoGridItem
- **Render Props**: Used in some Aceternity components
- **Higher-Order Components**: Minimal usage (mostly functional components)
- **Hooks Pattern**: useState, useEffect, useRouter, usePathname
- **Composition over Inheritance**: React functional component pattern
- **Container/Presenter**: Layout (container) + Page (presenter) in member portal

**Performance Considerations:**
- Dynamic imports for code-splitting (Globe, World components)
- Static generation for content pages (blog articles)
- CSS-in-JS with Tailwind (minimal runtime overhead)
- Image optimization: **NOT YET IMPLEMENTED** (using `<img>` instead of `next/image`)
- Font optimization: Using next/font (Geist Sans, Geist Mono)

**Security Considerations:**
- OAuth secrets in environment variables (not committed to Git)
- Origin validation in postMessage handlers
- XSS protection: React's automatic escaping (except `dangerouslySetInnerHTML` in blog pages)
- CSRF: No protection implemented (not needed for public site, required for authenticated actions)
- Content Security Policy: Not configured
- Rate limiting: Not implemented
- Admin access: Email-based (suitable for single admin MVP)

### Rendering Strategy by Route (Simplified MVP)

| Route | Strategy | Rationale |
|-------|----------|-----------|
| `/` (landing) | SSR (Client Component) | Interactive animations, scroll effects |
| `/blog` | SSG (Static Generation) | Content rarely changes, SEO important |
| `/blog/[slug]` | SSG with ISR potential | Pre-render all blog posts, regenerate on rebuild |
| `/book` | SSR (Client Component) | Stripe integration, dynamic content |
| `/collective` | SSR (Client Component) | Marketing page with animations |
| `/program` | SSR (Client Component) | Marketing page with animations |
| `/app/*` | CSR (Client-Side) | Protected content, user-specific data, interactive UI |
| `/app/admin/*` | CSR (Client-Side) | Admin-only, email-based access control |
| `/admin` | Static HTML | Decap CMS single-page application |
| `/api/*` | Server-Side | API endpoints, NextAuth handlers, webhooks |

### Future Architecture Considerations

**MVP Implementation Status (January 2025):**

✅ **Completed:**
1. **Authentication & Authorization**
   - NextAuth v5 implemented with magic link (Gmail SMTP)
   - Google OAuth and optional GitHub OAuth
   - Custom Turso adapter for session storage
   - Middleware protecting `/app/*` routes

2. **Database Integration**
   - Turso (libSQL) database for user data
   - Custom adapter for NextAuth sessions
   - User profiles, sprint progress tracking (localStorage - migration planned)
   - Feature flags for conditional functionality

3. **Core API Layer**
   - NextAuth handlers for authentication
   - Profile management API
   - Lead capture endpoint
   - Stripe webhook handler for payments

4. **Basic State Management**
   - UserContext for global user state
   - localStorage for sprint progress persistence
   - NextAuth session management

5. **Admin Tools**
   - Email-based admin detection
   - Lead management dashboard
   - Admin-only navigation items

6. **Testing Infrastructure**
   - Vitest for unit/integration tests
   - Playwright for E2E tests
   - React Testing Library

7. **Code Maintenance**
   - Knip for unused code detection
   - Automated cleanup scripts
   - Interactive cleanup checklist

**Post-MVP Enhancements:**

1. **Testing Infrastructure** (Priority: High)
   - Expand test coverage
   - Add API tests for authentication and payment flows
   - Performance testing

2. **Performance Optimization** (Priority: Medium)
   - Replace `<img>` with `next/image` for optimization
   - Implement ISR (Incremental Static Regeneration) for blog
   - Add loading skeletons for async content
   - Optimize 3D component loading and rendering

3. **Monitoring & Analytics** (Priority: High)
   - Axiom integration completed (structured logging)
   - Add analytics (Plausible, Vercel Analytics)
   - Implement performance monitoring
   - Add structured logging for API routes

4. **Video Token Authentication** (Priority: High, In Progress)
   - **Platform**: Bunny Stream (selected after comprehensive analysis)
   - **Current Status**: Hardcoded video IDs in sprint pages
   - **Next Step**: Implement token-based authentication
   - **Key Components**:
     - Token-based authentication API (`/api/video/[videoId]/token`)
     - Enhanced VideoPlayer component with security
   - **Documentation**: See `/docs/specs/video-integration-simplified.md`

5. **Sprint Progress Database Migration** (Priority: High, In Planning)
   - **Current**: localStorage (device-specific, no sync)
   - **Target**: Turso database (cross-device sync, persistent)
   - **Effort**: 4-5 hours (simplified - no live users to migrate)
   - **Benefits**: Cross-device synchronization, persistent storage, analytics foundation
   - **Documentation**: See `/docs/specs/sprint-progress-database-migration.md`
   - **Key Changes**:
     - Database table with indexes
     - Three API endpoints (GET, complete-day, reset)
     - Refactor client library to async
     - Update 4 components for async operations
     - Remove localStorage code

6. **Admin Tools Enhancement** (Priority: Medium)
   - Move admin check to database roles (when scaling)
   - Add middleware protection for admin routes
   - Implement audit logging for admin actions
   - Add more admin dashboards (users, analytics)

## Development Notes

### Turbopack
This project uses Turbopack for both dev and build. All npm scripts include `--turbopack` flag.

### Tailwind CSS 4
Uses new inline `@theme` syntax in `globals.css` rather than separate `tailwind.config.js`. CSS variables defined inline.

### Components Configuration
`components.json` configures shadcn-style component setup with "new-york" style, RSC enabled, Lucide icons.

### Aceternity UI Components
90+ pre-built animated components in `src/components/ui/`. These are complex, effect-heavy components (3D cards, parallax, spotlights, backgrounds, globes, etc.) and should generally not be modified. Import and use as-is.

### Content Creation Workflow
1. Use Decap CMS at `/admin` to create/edit content
2. Content saved as markdown in `content/` directory
3. Use `getContentByType()` or `getContentBySlug()` to fetch in pages
4. Published status controlled via `published` frontmatter field

### Sprint Content Structure
Sprint lessons are markdown files in `content/sprint/`:
- Named `day-01.md` through `day-30.md`
- Frontmatter includes: day, title, subtitle, duration, difficulty, video ID
- Video IDs reference Bunny Stream videos (planned: token-based auth)

## Quick Reference Guide

### Common Development Tasks

**Adding a New Page to Member Portal:**
1. Create `src/app/app/[page-name]/page.tsx`
2. Add route to navigation in `src/app/app/layout.tsx` navItems array
3. Add icon import from `@tabler/icons-react`
4. Set `adminOnly: false` (or `true` for admin pages)
5. Use consistent styling with existing pages (black bg, primary accent)

**Creating an Admin-Only Page:**
1. Create page in `src/app/app/admin/[page-name]/page.tsx`
2. Add to navItems with `adminOnly: true`
3. Admin detection automatically handled by layout
4. Future: Add middleware protection for server-side enforcement

**Creating a New Content Type:**
1. Create directory in `content/[type]/`
2. Add collection to `public/admin/config.yml`
3. Define fields for the collection
4. Use `getContentByType('type')` to fetch in components
5. Rebuild site to see changes

**Adding a New API Endpoint:**
1. Create `src/app/api/[endpoint]/route.ts`
2. Export HTTP methods as functions (GET, POST, etc.)
3. Use `NextRequest` and return `NextResponse`
4. Add environment variables if needed
5. Handle errors with appropriate status codes

**Using Aceternity UI Components:**
1. Browse available components in `src/components/ui/`
2. Import: `import { Component } from '@/components/ui/component'`
3. Check component file for props and usage examples
4. Do NOT modify files in `src/components/ui/` (vendor code)
5. For heavy 3D components, use dynamic imports with `ssr: false`

**Styling with Tailwind:**
1. Use theme colors: `bg-primary`, `text-primary`, `border-primary`
2. Dark theme by default: `bg-black`, `text-white`
3. Use `cn()` utility for conditional classes: `cn('base-class', condition && 'conditional-class')`
4. Access CSS variables: `var(--primary)` or Tailwind tokens
5. Responsive: `sm:`, `md:`, `lg:`, `xl:` prefixes

**Working with Content:**
```typescript
// Fetch all blog items
const blog = await getContentByType('blog');

// Fetch single item
const article = await getContentBySlug('blog', slug);

// Access frontmatter
article.frontmatter.title
article.frontmatter.date
article.frontmatter.thumbnail

// Render HTML content
<div dangerouslySetInnerHTML={{ __html: article.content }} />
```

**Running Tests:**
```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests (headless)
npm run test:e2e

# E2E tests (with browser visible)
npm run test:e2e:headed

# Test coverage
npm run test:coverage
```

**Code Cleanup:**
```bash
# Analyze unused code
npm run knip

# Preview cleanup (dry run)
npm run cleanup:knip

# Review checklist
code docs/knip-cleanup-checklist.md

# Execute cleanup (after review)
npm run cleanup:knip:execute
```

**Environment Variables:**
- Create `.env.local` file (not committed to Git)
- Required variables:
  - `GITHUB_CLIENT_ID` - For Decap CMS OAuth
  - `GITHUB_CLIENT_SECRET` - For Decap CMS OAuth
  - `AUTH_GITHUB_ID` - For member authentication (separate app)
  - `AUTH_GITHUB_SECRET` - For member authentication
  - See README.md for complete list
- Access in code: `process.env.VARIABLE_NAME`
- Prefix with `NEXT_PUBLIC_` for client-side access

### File Path Reference

**Important Files:**
- `/CLAUDE.md` - This architecture documentation
- `/README.md` - Setup and environment variable guide
- `/src/app/page.tsx` - Landing page (1000+ lines)
- `/src/app/app/layout.tsx` - Member portal layout with sidebar and admin detection
- `/src/app/api/cms-auth/route.ts` - OAuth authentication for Decap CMS
- `/src/lib/content.ts` - Content management API
- `/src/app/globals.css` - Tailwind config and theme
- `/public/admin/config.yml` - Decap CMS configuration
- `/package.json` - Dependencies and scripts
- `/tsconfig.json` - TypeScript configuration
- `/eslint.config.mjs` - ESLint rules
- `/next.config.ts` - Next.js configuration (minimal)
- `/knip.json` - Knip configuration for unused code detection
- `/docs/knip-cleanup-checklist.md` - Interactive cleanup checklist

### Debugging Tips

**Common Issues:**

1. **"Module not found" errors**
   - Check path alias: Should use `@/` for `src/`
   - Verify import path is correct
   - Ensure file has proper extension (.tsx, .ts)

2. **Hydration errors (client/server mismatch)**
   - Add `"use client"` directive if component uses browser APIs
   - Use `next/dynamic` with `ssr: false` for problematic components
   - Check for date/time rendering differences

3. **Aceternity component not working**
   - Ensure parent has proper height/width
   - Check for missing CSS imports in globals.css
   - Verify Framer Motion is installed
   - Some components require client-side rendering

4. **CMS not loading**
   - Check `/admin/decap-cms.js` exists (run prebuild script)
   - Verify `config.yml` syntax
   - Ensure GitHub OAuth is configured (separate from member auth)
   - Check browser console for errors

5. **Build errors with Turbopack**
   - Try removing `.next` directory
   - Check for TypeScript errors with `npm run lint:next`
   - Ensure all dependencies are installed
   - Verify Node version compatibility

6. **Admin navigation not appearing**
   - Check session user email matches `support@becomingdiamond.com`
   - Verify navigation item has `adminOnly: true`
   - Check session is loaded (`useSession` hook)

7. **OAuth redirect loop (redirects back to signin after successful OAuth)**
   - **Symptom**: OAuth completes successfully (Google/GitHub auth works), but user is redirected back to `/auth/signin?callbackUrl=...` instead of landing on protected page
   - **Root Cause**: Cookie configuration mismatch between `auth.ts` and `auth.config.ts`
   - **Why This Happens**:
     - `auth.ts` is used by main auth (creates sessions with custom cookie names)
     - `auth.config.ts` is used by middleware in edge runtime (checks sessions)
     - If cookie config only exists in `auth.ts`, middleware can't find the session cookie
   - **Solution**: Ensure BOTH files have identical cookie configuration:
     ```typescript
     cookies: {
       sessionToken: {
         name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
         options: {
           httpOnly: true,
           sameSite: 'lax',
           path: '/',
           secure: process.env.NODE_ENV === 'production',
         },
       },
     },
     ```
   - **Debugging Steps**:
     1. Check production logs for `adapter_createSession` - if present, session IS being created
     2. Check for `adapter_getSessionAndUser` calls - if present, session IS being retrieved
     3. Check middleware logs - if session exists but middleware returns 307 redirect, cookie names don't match
     4. Compare cookie configuration in both `auth.ts` (line 136) and `auth.config.ts` (line 29)
   - **Related Files**: `auth.ts`, `auth.config.ts`, `middleware.ts`
   - **Error Messages**: "invalid compact jwe", "JWTSessionError" (indicates JWT/cookie decryption issues)

**Development Server Issues:**
- Default port: 3003 (configured in package.json)
- Clear Turbopack cache: Delete `.next/` directory
- Check for port conflicts: Change port in dev script if needed
- Hot reload not working: Restart dev server

### Project Conventions

**File Naming:**
- Components: PascalCase (e.g., `BentoGrid.tsx`)
- Utilities: camelCase (e.g., `content.ts`, `utils.ts`)
- Pages: lowercase (e.g., `page.tsx`, `layout.tsx`)
- API Routes: lowercase (e.g., `route.ts`)

**Component Patterns:**
- Use functional components with TypeScript
- Props interface named `[ComponentName]Props`
- Export component as default
- Use named exports for related utilities
- Add "use client" directive when needed

**Code Style:**
- **NEVER use emojis** in code, UI components, error messages, or fallback content
- Keep all text professional and clean without decorative symbols

**Import Order Convention (Recommended):**
1. React imports
2. Next.js imports
3. Third-party libraries
4. UI components (`@/components/ui`)
5. Local components
6. Utilities (`@/lib`)
7. Types and interfaces
8. CSS imports (if any)

**Git Commit Messages:**
- Use conventional commits: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`
- Decap CMS creates commits like: "Create blog/2024-10-01-article-title.md"
- Manual commits should be descriptive: "feat: add lead management dashboard", "fix: authentication bug"

### Performance Best Practices

1. **Use dynamic imports for heavy components:**
   ```typescript
   const HeavyComponent = dynamic(() => import('@/components/ui/globe'), { ssr: false });
   ```

2. **Optimize images (TODO):**
   - Replace `<img>` with `next/image`
   - Add width and height attributes
   - Use WebP format when possible

3. **Lazy load sections:**
   - Use Intersection Observer for below-fold content
   - Consider React.lazy() for large components

4. **Minimize client-side JavaScript:**
   - Use Server Components where possible
   - Move static content to SSG
   - Avoid large dependencies in client components

5. **Monitor bundle size:**
   - Check `.next/analyze` output
   - Use webpack-bundle-analyzer
   - Split large pages into smaller components

### Recent Performance Optimizations

**Completed (2025-10)**:
- 59% page weight reduction achieved
- WebP/AVIF image format implementation
- Code splitting for Stripe integration
- See `/docs/specs/performance-optimization.prd.md` for details

### Video Integration (Planned Feature)

**Status**: Planning complete, implementation pending

**Approach**: Simplified integration using Bunny Stream's native dashboard
- **Platform Decision**: Bunny Stream selected after evaluating 7 platforms
- **Cost**: $10-30/month for MVP (50+ hours of 1080p video)
- **Security**: Token-based authentication (upgrade to DRM if piracy >5%)
- **Scope**: 1-2 days implementation, ~200 lines of code

**Content Creator Workflow**:
1. Upload video via Bunny dashboard (drag & drop)
2. Copy video GUID from Bunny
3. Add to sprint markdown: video field in frontmatter
4. Decap CMS saves content
5. Video automatically renders in sprint pages

**Technical Components to Build**:
```typescript
// API Route (30 lines)
/api/video/[videoId]/token/route.ts
  - Validates user authentication
  - Generates signed token with 24h expiry
  - Returns HLS stream URL

// VideoPlayer Component (100 lines)
src/components/VideoPlayer.tsx
  - HLS.js integration for adaptive streaming
  - Progress tracking
  - Autoplay/poster image support

// Markdown Parser Enhancement (70 lines)
src/lib/course-parser.ts
  - Regex to extract video IDs from frontmatter
  - Replace with VideoPlayer component
  - Support optional parameters (autoplay, poster)
```

**Dependencies to Add**:
- `hls.js` - HLS video playback (~50KB gzipped)
- `@types/hls.js` - TypeScript definitions

**Environment Variables Required**:
```bash
BUNNY_LIBRARY_ID=your-library-id
BUNNY_API_KEY=your-api-key
BUNNY_CDN_HOSTNAME=your-cdn-hostname
```

**Documentation**:
- `/docs/specs/video-integration-simplified.md` - Implementation guide (80% scope reduction)
- `/docs/specs/video-integration-plan.md` - Full admin UI approach (for reference)
- `/docs/specs/video-hosting-analysis.md` - Platform comparison (7 platforms evaluated)

**Next Steps** (when approved):
1. Create Bunny Stream account
2. Install `hls.js` dependency
3. Implement token API route
4. Build VideoPlayer component
5. Enhance markdown parser
6. Test with sample video
7. Deploy to production
