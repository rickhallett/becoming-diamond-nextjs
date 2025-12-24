# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Development Server
```bash
npm run dev  # Runs Next.js dev server with Turbopack on http://localhost:3003
```

### Build
```bash
npm run build  # Creates production build with Turbopack (prebuild copies Decap CMS assets)
```

### Testing
```bash
npm test              # Run all tests with Vitest
npm run test:unit     # Run unit tests only
npm run test:integration  # Run integration tests
npm run test:ui       # Open Vitest UI
npm run test:coverage # Run tests with coverage report
npm run test:watch    # Run tests in watch mode
npm run test:e2e      # Run Playwright E2E tests
npm run test:e2e:ui   # Open Playwright UI mode
npm run test:e2e:debug    # Run E2E tests in debug mode
npm run test:e2e:headed   # Run E2E tests with visible browser
npm run test:e2e:report   # Show Playwright test report
```

### Linting & Code Quality
```bash
npm run lint        # Run ESLint
npm run lint:fix    # Auto-fix linting issues
npm run knip        # Detect unused files/dependencies
npm run cleanup:knip          # Preview cleanup (dry run)
npm run cleanup:knip:execute  # Execute cleanup of unused code
```

### Database & Utilities
```bash
npm run db:migrate  # Run database migrations
npm run test:auth   # Test authentication setup
npm run test:gmail  # Test Gmail SMTP configuration
npm run monitor:email      # Monitor email stability (5-minute intervals)
npm run monitor:email:fast # Monitor email stability (1-minute intervals)
npm run validate:env       # Validate environment variables
```

## Architecture Overview

### High-Level Architecture

**Next.js 15 MVP application** with simplified hybrid rendering:
- **Public pages** (landing, blog, book): SSR and SSG
- **Member portal** (`/app/*`): CSR with NextAuth protected routes
- **Admin portal** (`/app/admin/*`): Admin-only pages (email-based access control)
- **CMS**: Decap CMS with GitHub backend

**MVP Scope** (January 2025):
- ✅ 30-Day Sprint, Blog (Insights), Book Sales, Lead Generation, Admin Tools
- ❌ Removed: Course platform, AI chat, News section, Settings, Support ticketing

**Layered Architecture**:
1. **Presentation**: React Server/Client Components with Aceternity UI
2. **Business Logic**: Sprint progress, authentication, payment processing
3. **Data**: File-based CMS (markdown) + Turso database (users/accounts) + NextAuth JWT sessions
4. **Infrastructure**: Next.js 15, Turbopack, Bunny Stream, Stripe, Gmail SMTP

### Project Structure

**Key directories:**
- `src/app/` - Next.js App Router pages
  - `page.tsx` - Landing page (client component, SSR)
  - `app/` - Protected member portal (NextAuth required)
    - `layout.tsx` - Sidebar with admin detection
    - `sprint/` - 30-day sprint pages and video player
    - `profile/` - User profile management
    - `admin/leads/` - Lead management dashboard
  - `auth/` - Authentication pages
  - `blog/[slug]/` - Blog posts (SSG with `generateStaticParams`)
  - `api/` - API Routes (NextAuth, profile, leads, webhooks)
- `src/components/ui/` - 89 Aceternity UI components (vendor code, do not modify)
- `src/lib/` - Utilities (`content.ts`, `utils.ts`)
- `content/` - Git-based content (blog, sprint, pages, settings)
- `public/admin/` - Decap CMS interface
- `scripts/` - Utility scripts (cleanup, migrations, testing)
- `docs/` - Documentation (specs, guides, cleanup checklists)

### Technology Stack

- **Framework:** Next.js 16.1.0, App Router, React 19, Turbopack
- **Styling:** Tailwind CSS 4 (inline config in `globals.css`)
- **UI:** Aceternity UI (Framer Motion, React Three Fiber, Radix UI)
- **CMS:** Decap CMS with GitHub backend
- **Auth:** NextAuth v5 with TursoAdapter (JWT sessions, database users/accounts)
- **Database:** Turso (libSQL) for users, accounts, verification tokens, app data
- **Video:** Bunny Stream with HLS and token auth
- **Payments:** Stripe
- **Email:** Gmail SMTP via Nodemailer
- **Testing:** Vitest, Playwright, React Testing Library
- **Quality:** ESLint, Knip
- **Logging:** Axiom (integrated throughout app, TursoAdapter, API routes)
- **Debugging:** Chrome DevTools MCP (browser automation, network inspection)

### Admin Access Control

**Pattern**: Email-based admin detection without database roles

```typescript
// src/app/app/layout.tsx
const isAdmin = session?.user?.email === 'support@becomingdiamond.com';
```

Navigation items have `adminOnly` flag for conditional rendering. Future: Move to database roles when scaling.

### Content Management System (Decap CMS)

**Git-based CMS** with OAuth-protected editing:
- Storage: Markdown files in `content/` directory
- Backend: GitHub (commits pushed to repository)
- Authentication: GitHub OAuth via `/api/cms-auth`
- Access: `/admin` route (static HTML)

**Collections**: `blog/`, `sprint/` (day-01.md - day-30.md), `pages/`, `settings/`

**Content API** (`src/lib/content.ts`):
- `getContentByType(type)` - Reads markdown, parses frontmatter, converts to HTML, filters unpublished
- `getContentBySlug(type, slug)` - Fetches single item

**CMS Workflow**: Editor → `/admin` → OAuth → Edit content → Commit to GitHub → Next.js rebuild

### Path Aliases

```typescript
import { Component } from '@/components/ui/component'
import { getContentByType } from '@/lib/content'
import { auth } from '@/auth'  // Root-level auth.ts (NOT in src/)
```

**Path Mapping** (tsconfig.json):
- `@/*` resolves to both `./src/*` AND `./*` (root directory)
- This dual mapping allows importing from both `src/` and root-level files
- Root-level imports: `@/auth` (auth.ts), `@/middleware` (middleware.ts)
- Src-level imports: `@/lib/*`, `@/components/*`, `@/app/*`

**IMPORTANT**: Always import as `@/auth`, never use relative paths.

### ESLint Configuration

- Unused vars with `_` prefix ignored
- `@typescript-eslint/no-explicit-any` is warn
- `@next/next/no-img-element` disabled
- **UI components (`src/components/ui/`) excluded from linting**

### Authentication Architecture

**NextAuth v5 with Hybrid JWT + Database Strategy**:
- **Session Storage**: JWT tokens (edge-compatible, no database reads for session validation)
- **User/Account Storage**: Turso database via TursoAdapter
- **Strategy**: `session: { strategy: "jwt" }` + `adapter: TursoAdapter(turso)` in `auth.ts`
- **Providers**: Magic link (email), Google OAuth, GitHub OAuth (optional)
- **Why Hybrid**:
  - JWT sessions: Edge middleware can validate without database calls
  - Turso adapter: Persistent user/account data, verification tokens, account linking
- **Edge Compatible**: Middleware decodes JWT directly, users/accounts fetched only when needed

**Authentication Flow (GitHub OAuth)**:

**OAuth 2.0** with popup window and postMessage communication

**API Routes**:
1. `/api/cms-auth` (GET) - OAuth initiation, redirects to GitHub
2. `/api/cms-auth` (POST) - Token exchange
3. `/api/callback` (GET) - OAuth callback, uses postMessage

**Environment Variables**:
- `GITHUB_CLIENT_ID/SECRET` - Decap CMS OAuth
- `AUTH_GITHUB_ID/SECRET` - Member authentication (separate OAuth app)

### Member Portal Architecture

**Protected SPA** with shared layout and admin detection

**Layout** (`src/app/app/layout.tsx`):
- Fixed sidebar (desktop), mobile drawer
- Active route highlighting with `usePathname()`
- Admin detection via email check
- Conditional navigation based on `adminOnly` flag

**Pages**: Dashboard, Sprint, Profile, Admin/Leads

**State Management**: UserContext, localStorage (sprint progress), NextAuth JWT sessions

**Design**: Pure black theme, diamond blue accent (`#4fc3f7`)

### Component Organization

**Aceternity UI** (`src/components/ui/`):
- 89 pre-built, effect-heavy components
- Technology: Framer Motion, React Three Fiber, Radix UI
- Usage: Import as-is, do NOT modify (vendor code)
- Categories: 3D, Backgrounds, Animations, Cards, Navigation, Effects, Inputs, Layout

**Custom Components**:
- Create in `src/components/` (not `/ui`)
- Use TypeScript interfaces for props
- Leverage Tailwind with `cn()` utility

### API Structure

**Route Handlers** (`src/app/api/*/route.ts`):
- Export HTTP methods: `GET`, `POST`, `PUT`, `DELETE`
- Use `NextRequest`, return `NextResponse`

**Current Endpoints**:

*Authentication & Session*:
1. `/api/auth/[...nextauth]` - NextAuth handlers
2. `/api/auth/test-session` - Session testing endpoint
3. `/api/auth/debug` - Auth configuration debugging

*User & Profile*:
4. `/api/profile` - GET/PUT user profile

*Lead Generation*:
5. `/api/leads` - POST lead capture
6. `/api/admin/leads` - GET/DELETE lead management (admin only)
7. `/api/unsubscribe` - POST email unsubscribe

*Sprint & Progress*:
8. `/api/sprint/days` - GET all sprint day content
9. `/api/sprint/[dayNumber]` - GET specific day content
10. `/api/sprint/progress` - GET/POST sprint progress
11. `/api/sprint/progress/complete-day` - POST mark day complete
12. `/api/sprint/progress/reset` - POST reset progress

*Video*:
13. `/api/video/[videoId]/token` - GET video auth tokens
14. `/api/videos` - GET video metadata

*Payments (Stripe)*:
15. `/api/checkout` - POST create checkout session
16. `/api/checkout/create-session` - POST session creation
17. `/api/stripe/checkout` - POST Stripe checkout
18. `/api/stripe/webhook` - POST Stripe webhooks
19. `/api/download` - GET digital product downloads

*CMS & OAuth*:
20. `/api/cms-auth` - GET/POST Decap CMS GitHub OAuth
21. `/api/cms-callback` - GET CMS OAuth callback

*Logging & Monitoring*:
22. `/api/log/error` - POST error logging to Axiom
23. `/api/log/test` - GET test logging endpoint

### Testing Infrastructure

- **Unit/Integration**: Vitest + React Testing Library (`src/test/`)
- **E2E**: Playwright with accessibility testing
- Coverage: `npm run test:coverage`

### Logging & Monitoring (Axiom)

**Architecture**: Centralized logging with `@/lib/axiom-logger`

**Integration Points**:
- **TursoAdapter**: Comprehensive auth flow logging (user creation, session management, token verification)
- **API Routes**: Error tracking via `/api/log/error`
- **Client-side**: Error boundary integration
- **Production**: Real-time monitoring and alerting

**Usage Pattern**:
```typescript
import { log } from '@/lib/axiom-logger';

// Info logging
await log.info('Operation started', {
  component: 'ComponentName',
  action: 'actionName',
  metadata: { key: 'value' }
});

// Error logging
await log.error('Operation failed', {
  component: 'ComponentName',
  error: error.message,
  stack: error.stack
});
```

**Log Levels**: `info`, `warn`, `error`, `debug`

**Best Practices**:
- Always include `component` field for traceability
- Add `timestamp` for time-sensitive operations
- Sanitize sensitive data (emails → domain only, no passwords)
- Use structured data for better querying

### Chrome DevTools MCP Integration

**Purpose**: Browser automation and debugging for production issues

**Capabilities**:
- Network request/response inspection
- Cookie and session state monitoring
- Console error capture
- Screenshot and DOM inspection
- OAuth flow debugging

**Setup**: Configured in `~/.claude.json` via `npx chrome-devtools-mcp@latest`

**Common Use Cases**:
1. Debug production OAuth redirects
2. Inspect session cookies causing auth loops
3. Monitor API request/response headers
4. Capture network timing for performance analysis
5. Verify middleware behavior in production

**Documentation**: See `docs/chrome-devtools-mcp-setup.md`

**Activation**: Requires Claude Code restart after installation

### Code Maintenance

**Knip**: Detects unused files, exports, dependencies
- Run: `npm run knip`
- Preview cleanup: `npm run cleanup:knip`
- Execute: `npm run cleanup:knip:execute`
- Interactive checklist: `docs/knip-cleanup-checklist.md`

### Feature Flag System

**Configuration**: `src/config/features.ts`

**Current Feature Flags**:
```typescript
export const FEATURES = {
  // Core Features
  sprint: true,           // 30-day sprint tracking
  leadGen: true,          // Email lead capture
  bookSales: true,        // Stripe checkout for book
  dashboard: true,        // Member dashboard

  // Sprint Features
  sprintWatchPlaylist: false,  // Watch playlist feature

  // Authentication
  githubAuth: false,      // GitHub OAuth (disabled in favor of Google)
};
```

**Usage Pattern**:
```typescript
import { FEATURES, isFeatureEnabled } from '@/config/features';

// Check if feature is enabled
if (FEATURES.sprint) {
  // Sprint feature code
}

// Or use helper function
if (isFeatureEnabled('leadGen')) {
  // Lead generation code
}
```

**Route Protection**:
- `getDisabledRoutes()` - Returns array of routes to block in middleware
- `FEATURE_REDIRECT_PATH` - Where to redirect users accessing disabled features (`/app/profile`)

**Auth Configuration**:
- `AUTH_CONFIG.successRedirectUri` - Post-login redirect (`/app/profile`)
- `AUTH_CONFIG.githubAuth` - GitHub OAuth toggle

**Best Practices**:
- Use feature flags for MVP scope control
- Disable incomplete features instead of removing code
- Update flags before major releases
- Document flag dependencies in code comments

### Key Architectural Decisions

1. **File-based CMS**: Git storage, version control, easy backups (trade-off: rebuild required)
2. **Client Components for Landing**: Heavy animations/3D (trade-off: larger bundle)
3. **App Router**: Modern React patterns, better performance
4. **Tailwind CSS 4**: Inline config in `globals.css` (not `tailwind.config.js`)
5. **NextAuth v5 Hybrid (JWT + TursoAdapter)**: JWT sessions for edge compatibility + database for users/accounts (best of both worlds - no session sync issues, persistent user data)
6. **Email-based Admin**: Simple for single admin MVP (trade-off: not scalable)
7. **Turbopack**: Faster builds (trade-off: newer, potential issues)

**Performance**: Dynamic imports for heavy components, SSG for blog, font optimization with next/font

**Security**: OAuth secrets in env vars, origin validation, React XSS protection, no CSRF (public site)

### Rendering Strategy

| Route | Strategy | Rationale |
|-------|----------|-----------|
| `/` | SSR (Client Component) | Interactive animations |
| `/blog` | SSG | SEO, rarely changes |
| `/app/*` | CSR | Protected, user-specific |
| `/app/admin/*` | CSR | Admin-only |
| `/admin` | Static HTML | Decap CMS |
| `/api/*` | Server-Side | API endpoints |

### MVP Status (January 2025)

✅ **Completed**:
- Authentication, Database, API Layer, State Management
- Admin Tools, Testing, Code Maintenance
- **Video Token Auth** - Bunny Stream token-based authentication (`/api/video/[videoId]/token`)
- **Sprint Progress API** - Database-backed progress tracking (`/api/sprint/progress/*`)
- **Axiom Logging** - Production monitoring integrated throughout app

**Current Priorities**:
1. **Sprint Progress Migration Verification** (High) - Confirm localStorage → Turso migration complete
2. **Performance** (Medium) - Replace `<img>` with `next/image`, ISR for blog
3. **Admin Enhancement** (Medium) - Database roles, middleware protection, audit logging
4. **Production OAuth Debugging** (High) - Resolve Google OAuth production issues using Chrome DevTools MCP

## Development Notes

### Key Configurations
- **Turbopack**: Used for dev and build (`--turbopack` flag)
- **Tailwind CSS 4**: Inline `@theme` in `globals.css`
- **Aceternity UI**: 90+ components in `src/components/ui/` - do not modify
- **Sprint Content**: `content/sprint/day-01.md` through `day-30.md`

### Vercel Deployment Configuration

**Configuration File**: `vercel.json` (root directory)

**Critical Settings**:
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "installCommand": "npm install --legacy-peer-deps",
  "outputDirectory": ".next"
}
```

**Key Requirements**:
- **Install Command**: MUST use `--legacy-peer-deps` flag (dependency resolution conflicts)
- **Build Command**: Uses Next.js 16.1.0 with Turbopack
- **Git Deployments**: Auto-deploy enabled for `main` branch only

**Common Deployment Issues**:
1. **Missing `--legacy-peer-deps`**: Causes dependency resolution failures
2. **OAuth Redirects**: Ensure `NEXTAUTH_URL` matches production domain exactly (no typos)
3. **Environment Variables**: Must be set in Vercel dashboard before deployment

**Deployment Checklist**:
- [ ] All env vars configured in Vercel dashboard
- [ ] `NEXTAUTH_URL` set to exact production domain (no trailing slash)
- [ ] OAuth redirect URIs updated in Google/GitHub consoles
- [ ] Decap CMS `base_url` in `/public/admin/config.yml` updated
- [ ] Database migrations run (if needed)
- [ ] Test OAuth flows after deployment

### Content Workflow
1. Edit via Decap CMS at `/admin`
2. Content saved as markdown in `content/`
3. Fetch with `getContentByType()` or `getContentBySlug()`
4. Control publishing via `published` frontmatter field

## Quick Reference

### Common Tasks

**Add Page to Member Portal**:
1. Create `src/app/app/[page-name]/page.tsx`
2. Add to navItems in `src/app/app/layout.tsx`
3. Import icon from `@tabler/icons-react`
4. Set `adminOnly: true/false`

**Create API Endpoint**:
1. Create `src/app/api/[endpoint]/route.ts`
2. Export HTTP methods (GET, POST, etc.)
3. Use `NextRequest`, return `NextResponse`

**Use Aceternity Component**:
```typescript
import { Component } from '@/components/ui/component'
// For heavy 3D: use dynamic(() => import(...), { ssr: false })
```

**Content Operations**:
```typescript
const blog = await getContentByType('blog');
const article = await getContentBySlug('blog', slug);
<div dangerouslySetInnerHTML={{ __html: article.content }} />
```

**Styling**:
```typescript
// Theme colors: bg-primary, text-primary, border-primary
// Dark theme: bg-black, text-white
// Conditional: cn('base-class', condition && 'conditional-class')
// Responsive: sm:, md:, lg:, xl: prefixes
```

### Important Files
- `/CLAUDE.md` - Architecture documentation (this file)
- `/README.md` - Setup guide
- `/vercel.json` - Vercel deployment configuration
- `/auth.ts` - NextAuth configuration (root level, NOT in src/)
- `/middleware.ts` - Edge middleware for route protection
- `/src/app/page.tsx` - Landing page
- `/src/app/app/layout.tsx` - Member portal layout with admin detection
- `/src/lib/content.ts` - Content API for markdown files
- `/src/lib/turso-adapter.ts` - Custom NextAuth adapter for Turso
- `/src/lib/axiom-logger.ts` - Centralized logging utility
- `/src/config/features.ts` - Feature flag configuration
- `/src/app/globals.css` - Tailwind CSS 4 config
- `/public/admin/config.yml` - Decap CMS configuration
- `/docs/chrome-devtools-mcp-setup.md` - Browser debugging setup

### Debugging Tips

**Module not found**: Check `@/` path alias (maps to both `./src/*` and `./*`), file extensions
**Hydration errors**: Add `"use client"` or use `next/dynamic` with `ssr: false`
**Aceternity issues**: Check parent height/width, CSS imports, Framer Motion installed
**CMS not loading**: Run prebuild, check `config.yml`, verify OAuth setup
**Build errors**: Remove `.next/`, check TypeScript errors, verify `--legacy-peer-deps` used

**Production OAuth Issues**:
- Use Chrome DevTools MCP to inspect network requests and cookies
- Check `NEXTAUTH_URL` matches production domain exactly (no typos)
- Verify OAuth redirect URIs in Google/GitHub console
- Monitor session cookies: `__Secure-authjs.session-token`
- Check Axiom logs for authentication flow errors

**Logging & Monitoring**:
- Check Axiom dashboard for production errors
- Use `/api/log/test` to verify logging works
- Review TursoAdapter logs for auth issues
- Use `npm run monitor:email` to check email stability

**OAuth redirect loop (RESOLVED)**:
- **Solution**: Hybrid approach - JWT sessions + TursoAdapter for users/accounts
- **Root Cause**: Database session strategy created UUID tokens that edge middleware couldn't decode
- **Configuration**:
  - `auth.ts`: `session: { strategy: "jwt" }` + `adapter: TursoAdapter(turso)`
  - `auth.config.ts`: `session: { strategy: "jwt" }`
- **What Changed**: Only session storage strategy (database → jwt)
- **What Stayed**: TursoAdapter for users/accounts, all providers, cookie config, middleware
- **Why This Works**:
  - JWT creates self-contained encrypted tokens edge middleware can decode
  - TursoAdapter still handles user/account persistence and OAuth account linking
  - No database calls needed for session validation in middleware
- **Files**: `auth.ts` (line 131), `auth.config.ts`, `middleware.ts`
- **Reference**: See `docs/specs/jwt-session-migration.md` for complete migration details

**Dev Server**: Port 3003, clear cache by deleting `.next/`

### Conventions

**File Naming**: Components (PascalCase), utilities (camelCase), pages/routes (lowercase), **all markdown files (lowercase with hyphens)** - Exceptions: root README.md and CLAUDE.md only
**Component Patterns**: Functional components, TypeScript, props interface `[Name]Props`
**Code Style**: NEVER use emojis in code/UI/errors/scripts/CLI output - keep text professional. Exception: ✅ and ❌ are acceptable for success/error status indicators only.
**Imports**: React → Next.js → third-party → UI components → local → utilities → types
**Git Commits**: Use conventional commits (`feat:`, `fix:`, `docs:`, etc.)

### Performance Best Practices

1. Dynamic imports for heavy components: `dynamic(() => import(...), { ssr: false })`
2. Optimize images: Replace `<img>` with `next/image` (TODO)
3. Lazy load: Use Intersection Observer for below-fold content
4. Minimize client JS: Use Server Components where possible
5. Monitor bundle: Use webpack-bundle-analyzer

**Recent Optimizations**: 59% page weight reduction, WebP/AVIF formats, code splitting, lazy-loaded DOMPurify

### Video Integration (Bunny Stream)

**Status**: ✅ Implemented (including thumbnails)

**Platform**: Bunny Stream with HLS and token-based authentication

**Implementation**:
- **API Route**: `/api/video/[videoId]/token/route.ts` - Generates signed tokens for video access and thumbnails
- **Video Player**: HLS.js integration for adaptive streaming with automatic thumbnail poster images
- **Dependencies**: `hls.js` (v1.6.13) installed
- **Security**: Token-based auth prevents unauthorized access
- **Thumbnails**: Automatically fetched from Bunny metadata and displayed as poster images before playback

**Workflow**: Upload to Bunny → Copy video GUID → Add to sprint markdown → Video renders with auth and thumbnail

**Configuration** (Environment Variables):
```bash
BUNNY_STREAM_LIBRARY_ID=512164
BUNNY_STREAM_API_KEY=your_api_key
BUNNY_STREAM_CDN_HOSTNAME=vz-xxxxxxx-xxx.b-cdn.net
BUNNY_STREAM_PULL_ZONE=vz-xxxxxxx-xxx
```

**Security Settings** (Bunny Dashboard):
- Direct Link Token Authentication: Disabled (for thumbnail access)
- HLS streaming: Token-protected
- Thumbnails: Publicly accessible via signed URLs

**Usage Example**:
```typescript
// Fetch video token and thumbnail
const response = await fetch(`/api/video/${videoId}/token`);
const { streamUrl, thumbnailUrl } = await response.json();

// VideoPlayer component automatically uses thumbnailUrl as poster
<VideoPlayer videoId={videoId} />
```

**API Response**:
```typescript
{
  streamUrl: string;        // HLS playlist URL with token
  thumbnailUrl?: string;    // Thumbnail image URL with token (if available)
  token: string;            // Signed authentication token
  expiresAt: string;        // ISO timestamp for token expiration
}
```

**Docs**:
- `/docs/specs/video-integration-simplified.md`
- `/docs/bunny-stream-thumbnail-investigation.md`
