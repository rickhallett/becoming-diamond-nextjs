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

### Linting
```bash
npm run lint        # Run ESLint
npm run lint:fix    # Auto-fix linting issues
npm run lint:next   # Run Next.js linter
```

## Architecture Overview

### High-Level Architecture

This is a **Next.js 15 application** using the **App Router** with a **hybrid rendering strategy**:
- **Public pages** (landing, news): Server-side rendered (SSR) and statically generated (SSG)
- **Member portal** (`/app/*`): Client-side rendered (CSR) with protected routes
- **CMS integration**: Decap CMS with GitHub backend for content management

**Architectural Pattern**: Layered architecture with clear separation:
1. **Presentation Layer**: React Server/Client Components with Aceternity UI
2. **Business Logic Layer**: Content processing, authentication flows
3. **Data Layer**: File-based CMS (markdown) + GitHub OAuth
4. **Infrastructure Layer**: Next.js 15 with Turbopack, deployed on Vercel

### Project Structure

**Key directories:**
- `src/app/` - Next.js App Router pages (routing via file system)
  - `page.tsx` - Public landing page (client component, SSR)
  - `app/` - Protected member portal (requires authentication)
    - `layout.tsx` - Sidebar layout with navigation
    - `page.tsx` - Dashboard with user stats and progress
    - `courses/`, `chat/`, `profile/`, `settings/`, `support/` - Feature pages
  - `auth/` - Authentication pages (OAuth flow)
  - `news/` - Dynamic routes for content ([slug])
    - `[slug]/page.tsx` - Individual article pages (SSG with `generateStaticParams`)
  - `api/` - API Routes (Route Handlers)
    - `auth/route.ts` - GitHub OAuth initiation and token exchange
    - `callback/route.ts` - OAuth callback handler (returns HTML with postMessage)
- `src/components/ui/` - 89 Aceternity UI components (pre-built, complex animations)
- `src/lib/` - Shared utilities
  - `content.ts` - Content management API (gray-matter + remark)
  - `utils.ts` - Tailwind class merging utility (cn)
- `src/hooks/` - Custom React hooks (e.g., `use-outside-click.tsx`)
- `content/` - Git-based content storage (managed by Decap CMS)
  - `news/`, `blog/`, `pages/`, `settings/` - Markdown files with frontmatter
- `public/admin/` - Decap CMS admin interface
  - `config.yml` - CMS configuration (collections, fields, GitHub backend)
  - `index.html` - CMS entry point
  - `decap-cms.js` - CMS bundle (copied from node_modules on build)

### Technology Stack

- **Framework:** Next.js 15.5.3 with App Router, React 19, Turbopack
- **Styling:** Tailwind CSS 4 (inline config in `globals.css`), `tw-animate-css`
- **UI Library:** Aceternity UI components with heavy use of:
  - Framer Motion for animations
  - React Three Fiber for 3D graphics
  - Radix UI primitives
- **Content Management:** Decap CMS with GitHub backend
- **Authentication:** GitHub OAuth (see `src/app/api/auth/route.ts`)
- **Content Processing:** Gray-matter for frontmatter, Remark for markdown to HTML

### Content Management System (Decap CMS)

**Architecture Pattern**: Git-based CMS with OAuth-protected editing

The project uses **Decap CMS** (formerly Netlify CMS) for content management:
- **Storage**: Git-based (content stored as markdown files in repository)
- **Backend**: GitHub (content commits pushed to repository)
- **Authentication**: GitHub OAuth (see API routes section)
- **Access**: `/admin` route (served as static HTML)

**Content Collections:**
- `news/` - News updates with date, thumbnail, tags, published status
- `blog/` - Blog posts with author, categories, tags
- `pages/` - Static pages (about, contact) - file-based collection
- `settings/` - Site configuration (general settings, social media) - YAML format

**Content Structure:**
```
content/
├── news/YYYY-MM-DD-slug.md      # Markdown with YAML frontmatter
├── blog/YYYY-MM-DD-slug.md      # Markdown with YAML frontmatter
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
3. OAuth authentication via `/api/auth` (GitHub)
4. Editor creates/edits content through CMS UI
5. CMS commits changes to GitHub repository
6. Next.js rebuilds pages on next deployment

### Path Aliases

TypeScript path mapping (`@/*` → `./src/*`):
```typescript
import { Component } from '@/components/ui/component'
import { getContentByType } from '@/lib/content'
```

### ESLint Configuration

Custom rules in `eslint.config.mjs`:
- Unused vars with `_` prefix ignored
- `@typescript-eslint/no-explicit-any` is warn (not error)
- `@next/next/no-img-element` disabled
- **UI components directory (`src/components/ui/`) is excluded from linting**

### Authentication Flow (GitHub OAuth)

**Pattern**: OAuth 2.0 with popup window and postMessage communication

**API Routes:**

1. **`/api/auth` (GET)** - OAuth Initiation
   - Query param: `provider=github`
   - Redirects to GitHub authorization URL
   - Includes `client_id`, `redirect_uri`, and `scope` (repo, user)
   - Redirect target: `{origin}/api/callback`

2. **`/api/auth` (POST)** - Token Exchange
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
2. CMS opens popup to /api/auth?provider=github
3. Server redirects popup to GitHub OAuth authorize page
4. User authorizes on GitHub
5. GitHub redirects to /api/callback?code=XXX
6. Callback page sends code via postMessage to parent window
7. CMS receives code and calls /api/auth (POST) to exchange for token
8. CMS uses token for GitHub API operations
```

**Environment Variables Required:**
- `GITHUB_CLIENT_ID` - GitHub OAuth App Client ID
- `GITHUB_CLIENT_SECRET` - GitHub OAuth App Client Secret

**Security Considerations:**
- OAuth secrets stored in environment variables
- Origin validation in postMessage receiver
- Token never exposed to client-side code (except in CMS context)
- CMS operations require valid GitHub token

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

**Pattern**: Protected SPA with shared layout

**Layout Structure** (`/app/*/`):
- **Shared Layout** (`src/app/app/layout.tsx`) - Client Component
  - Fixed sidebar navigation (desktop) with active route highlighting
  - Mobile drawer navigation with backdrop
  - Logo, navigation items, logout button
  - `usePathname()` hook for active route detection
  - Uses Tabler Icons for UI icons

**Navigation Items:**
```typescript
[
  { name: "Dashboard", href: "/app", icon: IconHome },
  { name: "Courses", href: "/app/courses", icon: IconBooks },
  { name: "DiamondMindAI", href: "/app/chat", icon: IconBrain },
  { name: "Profile", href: "/app/profile", icon: IconUser },
  { name: "Settings", href: "/app/settings", icon: IconSettings },
  { name: "Support", href: "/app/support", icon: IconHelp },
]
```

**Page Structure:**
- `page.tsx` - Dashboard with user stats, progress tracking, upcoming sessions
- `courses/page.tsx` - Course catalog and enrollment
- `chat/page.tsx` - AI chat interface (DiamondMindAI)
- `profile/page.tsx` - User profile and progress
- `settings/page.tsx` - Account settings
- `support/page.tsx` - Help and support resources

**State Management:**
- Local component state with `useState`
- Route state with Next.js `useRouter` and `usePathname`
- No global state management (Redux, Zustand, etc.) currently implemented

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

**Static Generation Flow** (News/Blog):
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

**Current API Endpoints:**

1. **`/api/auth`**
   - `GET`: OAuth initiation (redirects to GitHub)
   - `POST`: Token exchange (JSON request/response)

2. **`/api/callback`**
   - `GET`: OAuth callback handler (returns HTML with postMessage script)

**API Patterns:**
- Environment variables for secrets
- Error handling with appropriate HTTP status codes
- JSON responses for data endpoints
- HTML responses for redirect/callback pages
- No middleware or API route protection implemented yet

**Potential Expansion Areas:**
- `/api/user` - User profile management
- `/api/courses` - Course data and enrollment
- `/api/progress` - User progress tracking
- `/api/chat` - AI chat endpoint (DiamondMindAI)

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

5. **No Authentication for Member Portal**
   - **Current State**: Member portal accessible without authentication
   - **Rationale**: Likely in development/demo phase
   - **Risk**: Production deployment would expose protected content
   - **TODO**: Implement authentication middleware or route protection

6. **Monolithic Landing Page Component**
   - **Current**: 1000+ line `page.tsx` with all sections inline
   - **Trade-off**: Harder to maintain, difficult to test individual sections
   - **Opportunity**: Could extract sections into separate components
   - **Benefit of current approach**: Single file shows complete page structure

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
- Static generation for content pages (news articles)
- CSS-in-JS with Tailwind (minimal runtime overhead)
- Image optimization: **NOT YET IMPLEMENTED** (using `<img>` instead of `next/image`)
- Font optimization: Using next/font (Geist Sans, Geist Mono)

**Security Considerations:**
- OAuth secrets in environment variables (not committed to Git)
- Origin validation in postMessage handlers
- XSS protection: React's automatic escaping (except `dangerouslySetInnerHTML` in news pages)
- CSRF: No protection implemented (not needed for public site, required for authenticated actions)
- Content Security Policy: Not configured
- Rate limiting: Not implemented

### Rendering Strategy by Route

| Route | Strategy | Rationale |
|-------|----------|-----------|
| `/` (landing) | SSR (Client Component) | Interactive animations, scroll effects |
| `/news` | SSG (Static Generation) | Content rarely changes, SEO important |
| `/news/[slug]` | SSG with ISR potential | Pre-render all articles, regenerate on rebuild |
| `/app/*` | CSR (Client-Side) | Protected content, user-specific data, interactive UI |
| `/admin` | Static HTML | Decap CMS single-page application |
| `/api/*` | Server-Side | API endpoints, OAuth handlers |

### Future Architecture Considerations

**Recommended Enhancements:**

1. **Authentication & Authorization**
   - Implement NextAuth.js or similar
   - Add middleware for route protection
   - Store user sessions securely
   - Add role-based access control (admin, member, etc.)

2. **Database Integration**
   - Add database for user data (PostgreSQL, MongoDB)
   - Store user progress, course enrollment, chat history
   - Consider Prisma ORM for type-safe database access
   - Keep content in Git-based CMS, user data in database

3. **API Layer Expansion**
   - Implement REST or GraphQL API for member features
   - Add API authentication (JWT, session tokens)
   - Create endpoints for courses, progress, chat, profile
   - Consider API rate limiting and validation

4. **State Management**
   - Add Zustand or Jotai for global state (lightweight)
   - Store user profile, preferences, UI state
   - Avoid Redux (overkill for current needs)

5. **Testing Infrastructure**
   - Unit tests: Vitest or Jest
   - Component tests: React Testing Library
   - E2E tests: Playwright or Cypress
   - API tests: Supertest or Vitest

6. **Performance Optimization**
   - Replace `<img>` with `next/image` for optimization
   - Add image CDN (Cloudinary, Vercel Image Optimization)
   - Implement ISR (Incremental Static Regeneration) for news
   - Add loading skeletons for async content
   - Optimize 3D component loading and rendering

7. **Monitoring & Analytics**
   - Add error tracking (Sentry)
   - Add analytics (Plausible, Vercel Analytics)
   - Implement performance monitoring
   - Add logging for API routes

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

## Quick Reference Guide

### Common Development Tasks

**Adding a New Page to Member Portal:**
1. Create `src/app/app/[page-name]/page.tsx`
2. Add route to navigation in `src/app/app/layout.tsx` navItems array
3. Add icon import from `@tabler/icons-react`
4. Use consistent styling with existing pages (black bg, primary accent)

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
// Fetch all news items
const news = await getContentByType('news');

// Fetch single item
const article = await getContentBySlug('news', slug);

// Access frontmatter
article.frontmatter.title
article.frontmatter.date
article.frontmatter.thumbnail

// Render HTML content
<div dangerouslySetInnerHTML={{ __html: article.content }} />
```

**Environment Variables:**
- Create `.env.local` file (not committed to Git)
- Required variables:
  - `GITHUB_CLIENT_ID` - For Decap CMS OAuth
  - `GITHUB_CLIENT_SECRET` - For Decap CMS OAuth
- Access in code: `process.env.VARIABLE_NAME`
- Prefix with `NEXT_PUBLIC_` for client-side access

### File Path Reference

**Important Files:**
- `/CLAUDE.md` - This architecture documentation
- `/src/app/page.tsx` - Landing page (1000+ lines)
- `/src/app/app/layout.tsx` - Member portal layout with sidebar
- `/src/app/api/auth/route.ts` - OAuth authentication
- `/src/lib/content.ts` - Content management API
- `/src/app/globals.css` - Tailwind config and theme
- `/public/admin/config.yml` - Decap CMS configuration
- `/package.json` - Dependencies and scripts
- `/tsconfig.json` - TypeScript configuration
- `/eslint.config.mjs` - ESLint rules
- `/next.config.ts` - Next.js configuration (minimal)

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
   - Ensure GitHub OAuth is configured
   - Check browser console for errors

5. **Build errors with Turbopack**
   - Try removing `.next` directory
   - Check for TypeScript errors with `npm run lint:next`
   - Ensure all dependencies are installed
   - Verify Node version compatibility

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

**Import Order Convention (Recommended):**
1. React imports
2. Next.js imports
3. Third-party libraries
4. UI components (`@/components/ui`)
5. Local components
6. Utilities (`@/lib`)
7. Types and interfaces
8. CSS imports (if any)

**Git Commit Messages (when using CMS):**
- Decap CMS creates commits like: "Create news/2024-10-01-article-title.md"
- Manual commits should be descriptive: "feat: add courses page", "fix: authentication bug"

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
