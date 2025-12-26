# Comprehensive Refactoring Analysis - November 18, 2025

## Executive Summary

This report provides a comprehensive refactoring analysis of the Becoming Diamond Next.js 15 application codebase, examining 217 TypeScript files across the entire application architecture.

### Key Metrics

- **Total TypeScript Files**: 217
- **Critical Issues Found**: 8
- **High-Priority Refactorings**: 15
- **Medium-Priority Improvements**: 22
- **Low-Priority Enhancements**: 11
- **Technical Debt Items**: 30 TODOs identified
- **Type Safety Issues**: 48 uses of `any` type
- **Estimated Total Effort**: 80-120 hours

### Priority Breakdown

| Priority | Count | Est. Effort | Impact |
|----------|-------|-------------|--------|
| Critical | 8 | 16-24 hours | Security, Stability |
| High | 15 | 32-48 hours | Performance, Maintainability |
| Medium | 22 | 24-36 hours | Code Quality |
| Low | 11 | 8-12 hours | Nice-to-have |

---

## Critical Issues

### 1. Serverless Rate Limiting Ineffectiveness

**File**: `src/app/api/leads/route.ts` (Lines 26-58)

**Issue**: In-memory rate limiting using `Map` is ineffective in serverless environments. Each function invocation is stateless and may run in different containers, making the rate limiting completely unreliable.

**Current Code**:
```typescript
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);

  if (!limit || now > limit.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60000 });
    return true;
  }

  if (limit.count >= 5) {
    return false;
  }

  limit.count++;
  return true;
}
```

**Recommended Solution**:
```typescript
// Use Vercel KV (Redis) for distributed rate limiting
import { kv } from '@vercel/kv';

async function checkRateLimit(ip: string): Promise<boolean> {
  const key = `rate-limit:leads:${ip}`;
  const now = Date.now();

  const requests = await kv.get<number[]>(key) || [];
  const windowStart = now - 60000; // 1 minute window

  // Filter requests within the current window
  const recentRequests = requests.filter(timestamp => timestamp > windowStart);

  if (recentRequests.length >= 5) {
    return false;
  }

  // Add current request
  recentRequests.push(now);
  await kv.set(key, recentRequests, { ex: 60 }); // Expire after 60 seconds

  return true;
}
```

**Benefits**:
- Actual rate limiting across all serverless instances
- Protection against DDoS and spam attacks
- Consistent behavior in production

**Effort**: 3-4 hours
**Priority**: CRITICAL - Security vulnerability

---

### 2. Profile Data Transformation Duplication

**Files**:
- `src/app/api/profile/route.ts` (Lines 74-89, 245-259)
- Total duplication: 32 lines repeated

**Issue**: Identical profile transformation logic is duplicated in GET and PUT handlers, violating DRY principle and creating maintenance burden.

**Current Pattern**:
```typescript
// Duplicated in both GET and PUT
const profile = {
  id: user.id as string,
  name: (user.name as string) || (user.email as string)?.split('@')[0] || 'User',
  email: (user.email as string) || '',
  avatar: (user.image as string) || '/profile-placeholder-2.webp',
  bio: (profileData?.bio as string) || '',
  location: (profileData?.location as string) || '',
  website: (profileData?.website as string) || '',
  joinedDate: new Date((user.created_at as number) * 1000).toISOString(),
  currentPR: (profileData?.current_pr as number) || 1,
  completedPRs,
  level: (profileData?.level as string) || 'Initiate',
  xp: (profileData?.xp as number) || 0,
  streak: (profileData?.streak as number) || 0,
};
```

**Recommended Solution**:
```typescript
// Create shared transformation function
interface DatabaseUser {
  id: unknown;
  name: unknown;
  email: unknown;
  image: unknown;
  created_at: unknown;
}

interface DatabaseProfile {
  bio?: unknown;
  location?: unknown;
  website?: unknown;
  current_pr?: unknown;
  completed_prs?: unknown;
  level?: unknown;
  xp?: unknown;
  streak?: unknown;
}

function transformDatabaseToProfile(
  user: DatabaseUser,
  profileData: DatabaseProfile | null
): UserProfile {
  // Parse completed_prs JSON string to array
  let completedPRs: number[] = [];
  if (profileData?.completed_prs) {
    try {
      completedPRs = JSON.parse(profileData.completed_prs as string);
    } catch (e) {
      console.error('Failed to parse completed_prs:', e);
    }
  }

  return {
    id: user.id as string,
    name: (user.name as string) || (user.email as string)?.split('@')[0] || 'User',
    email: (user.email as string) || '',
    avatar: (user.image as string) || '/profile-placeholder-2.webp',
    bio: (profileData?.bio as string) || '',
    location: (profileData?.location as string) || '',
    website: (profileData?.website as string) || '',
    joinedDate: new Date((user.created_at as number) * 1000).toISOString(),
    currentPR: (profileData?.current_pr as number) || 1,
    completedPRs,
    level: (profileData?.level as string) || 'Initiate',
    xp: (profileData?.xp as number) || 0,
    streak: (profileData?.streak as number) || 0,
  };
}

// Usage in GET handler
export async function GET() {
  // ... fetch logic ...
  const profile = transformDatabaseToProfile(user, profileData);
  return NextResponse.json({ profile });
}

// Usage in PUT handler
export async function PUT(request: NextRequest) {
  // ... update logic ...
  const profile = transformDatabaseToProfile(user, profileData);
  return NextResponse.json({ profile });
}
```

**Benefits**:
- Single source of truth for profile transformation
- Easier to maintain and update
- Reduced chance of inconsistencies

**Effort**: 2 hours
**Priority**: CRITICAL - Code quality and maintainability

---

### 3. Hardcoded Admin Email in Multiple Locations

**Files**:
- `src/app/app/layout.tsx` (Line 27)
- Potentially other locations

**Issue**: Admin access control is hardcoded as a string literal `'support@becomingdiamond.com'`. This creates:
- Difficult to change if admin email changes
- No centralized configuration
- Potential inconsistencies if used in multiple places

**Current Code**:
```typescript
const isAdmin = session?.user?.email === 'support@becomingdiamond.com';
```

**Recommended Solution**:
```typescript
// Create src/lib/auth-helpers.ts
export const ADMIN_EMAILS = [
  'support@becomingdiamond.com',
  // Add more admin emails here
];

export function isAdminUser(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

// Alternative: Environment variable approach
export function isAdminUser(email: string | null | undefined): boolean {
  if (!email) return false;
  const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());
  return adminEmails.includes(email.toLowerCase());
}

// Usage in layout
const isAdmin = isAdminUser(session?.user?.email);
```

**Benefits**:
- Centralized configuration
- Easy to add multiple admins
- Environment-based configuration possible
- Type-safe and reusable

**Effort**: 2 hours
**Priority**: CRITICAL - Scalability and maintainability

---

### 4. Large Landing Page Component (519 Lines)

**File**: `src/app/page.tsx` (519 lines)

**Issue**: The landing page is a massive 519-line client component with multiple responsibilities:
- Hero section
- Globe visualization
- Problem/pain points
- Solution/features
- Testimonials
- Lead magnet
- Book sales
- Programs overview

This violates the Single Responsibility Principle and makes the component:
- Hard to test
- Difficult to maintain
- Challenging to optimize
- Poor code reusability

**Current Structure**:
```typescript
export default function LandingPage() {
  // 50+ lines of configuration
  const globeConfig = { /* ... */ };
  const colors = [/* ... */];
  const sampleArcs = [/* ... */];

  return (
    <main>
      {/* 450+ lines of JSX */}
      <HeroSection {...} />
      <section>{/* Globe */}</section>
      <ProblemPainPointsGrid {...} />
      <section>{/* Solution */}</section>
      <TestimonialsSection {...} />
      <LeadMagnetSection {...} />
      <BookSalesSection />
      <section>{/* Programs */}</section>
      <Footer />
    </main>
  );
}
```

**Recommended Solution**:
```typescript
// Extract configuration to separate file
// src/config/landing-page.ts
export const GLOBE_CONFIG = { /* ... */ };
export const GLOBE_SAMPLE_ARCS = [/* ... */];

// Extract programs section component
// src/components/ProgramsSection.tsx
export function ProgramsSection() {
  return (
    <section id="programs" className="py-24 px-6 bg-gradient-to-b from-black via-primary/5 to-black">
      {/* Program cards */}
    </section>
  );
}

// Extract solution section component
// src/components/SolutionSection.tsx
export function SolutionSection() {
  return (
    <section id="solution" className="py-24 px-6 relative">
      {/* Solution content */}
    </section>
  );
}

// Extract globe section component
// src/components/GlobalCommunitySection.tsx
export function GlobalCommunitySection() {
  return (
    <section className="py-24 px-6 bg-black relative">
      {/* Globe visualization */}
    </section>
  );
}

// Refactored landing page (< 100 lines)
// src/app/page.tsx
"use client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { GlobalCommunitySection } from "@/components/GlobalCommunitySection";
import { ProblemPainPointsGrid } from "@/components/ProblemPainPointsGrid";
import { SolutionSection } from "@/components/SolutionSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { LeadMagnetSection } from "@/components/LeadMagnetSection";
import { BookSalesSection } from "@/components/BookSalesSection";
import { ProgramsSection } from "@/components/ProgramsSection";
import {
  HERO_CONTENT,
  PROBLEM_CONTENT,
  TESTIMONIALS,
  LEAD_MAGNET_CONTENT,
} from "@/config/landing-page";

export default function LandingPage() {
  return (
    <main className="relative bg-black antialiased">
      <Navigation />
      <HeroSection {...HERO_CONTENT} />
      <GlobalCommunitySection />
      <ProblemPainPointsGrid {...PROBLEM_CONTENT} />
      <SolutionSection />
      <TestimonialsSection testimonials={TESTIMONIALS} />
      <LeadMagnetSection {...LEAD_MAGNET_CONTENT} />
      <BookSalesSection />
      <ProgramsSection />
      <Footer />
    </main>
  );
}
```

**Benefits**:
- Each section is independently testable
- Better code organization and reusability
- Easier to optimize individual sections
- Improved maintainability
- Better performance (can lazy load sections)

**Effort**: 6-8 hours
**Priority**: CRITICAL - Code organization and maintainability

---

### 5. Missing Error Boundaries in Key Locations

**Files**: Multiple page components

**Issue**: While `ErrorBoundaryWithLogging` is used in the member portal layout, many critical pages lack error boundaries:
- `src/app/page.tsx` (landing page)
- `src/app/blog/page.tsx`
- `src/app/blog/[slug]/page.tsx`
- `src/app/book/page.tsx`

If a runtime error occurs in these pages, users see a white screen with no recovery option.

**Current Pattern**:
```typescript
// No error boundary
export default function BlogPage() {
  return (
    <main>
      {/* Content that might throw errors */}
    </main>
  );
}
```

**Recommended Solution**:
```typescript
// Create a reusable page error boundary wrapper
// src/components/PageErrorBoundary.tsx
"use client";
import { ErrorBoundaryWithLogging } from "@/components/error-boundary-with-logging";
import { ReactNode } from "react";

interface PageErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

export function PageErrorBoundary({
  children,
  fallbackTitle = "Something went wrong",
  fallbackMessage = "We're working to fix this. Please try refreshing the page."
}: PageErrorBoundaryProps) {
  return (
    <ErrorBoundaryWithLogging
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
          <div className="max-w-md text-center">
            <h1 className="text-3xl mb-4 text-primary">{fallbackTitle}</h1>
            <p className="text-gray-400 mb-8">{fallbackMessage}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-black px-6 py-3 rounded-lg hover:bg-primary/80 transition"
            >
              Refresh Page
            </button>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundaryWithLogging>
  );
}

// Usage in pages
// src/app/page.tsx
export default function LandingPage() {
  return (
    <PageErrorBoundary fallbackTitle="Landing Page Error">
      <main className="relative bg-black antialiased">
        {/* ... content ... */}
      </main>
    </PageErrorBoundary>
  );
}
```

**Benefits**:
- Graceful error handling
- Better user experience
- Error tracking and logging
- Consistent error UI across pages

**Effort**: 3 hours
**Priority**: CRITICAL - User experience and stability

---

### 6. Inconsistent Email Validation

**Files**:
- `src/app/api/leads/route.ts` (Line 60-62)
- Potentially other locations

**Issue**: Email validation is implemented inline in the leads route. This should be:
- Centralized for consistency
- More robust with additional checks
- Reusable across the application

**Current Code**:
```typescript
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
```

**Recommended Solution**:
```typescript
// Create src/lib/validation.ts
import { z } from 'zod';

// Using Zod for comprehensive validation
export const emailSchema = z.string()
  .email('Invalid email address')
  .min(5, 'Email is too short')
  .max(255, 'Email is too long')
  .toLowerCase()
  .trim();

export function validateEmail(email: string): { valid: boolean; error?: string } {
  try {
    emailSchema.parse(email);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0].message };
    }
    return { valid: false, error: 'Invalid email' };
  }
}

// Additional validation helpers
export const userProfileSchema = z.object({
  name: z.string().min(1).max(100),
  email: emailSchema,
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  website: z.string().url().optional().or(z.literal('')),
});

export type UserProfileInput = z.infer<typeof userProfileSchema>;

// Usage in API route
const validation = validateEmail(email);
if (!validation.valid) {
  return NextResponse.json(
    { success: false, error: validation.error },
    { status: 400 }
  );
}
```

**Benefits**:
- Centralized validation logic
- More comprehensive validation
- Better error messages
- Type-safe validation with Zod
- Reusable across application

**Effort**: 3 hours
**Priority**: CRITICAL - Data integrity and security

---

### 7. No TypeScript Interface for ContentItem Frontmatter

**File**: `src/lib/content.ts` (Lines 17-27)

**Issue**: The `ContentItem` interface uses `[key: string]: unknown` for frontmatter, losing type safety for different content types.

**Current Code**:
```typescript
export interface ContentItem {
  slug: string;
  frontmatter: {
    title: string;
    date?: string;
    description?: string;
    thumbnail?: string;
    published?: boolean;
    [key: string]: unknown; // Too permissive
  };
  content: string;
}
```

**Recommended Solution**:
```typescript
// Create type-safe frontmatter interfaces
export interface BaseFrontmatter {
  title: string;
  published?: boolean;
}

export interface BlogFrontmatter extends BaseFrontmatter {
  author: string;
  date: string;
  thumbnail?: string;
  excerpt: string;
  categories: string[];
  tags: string[];
}

export interface SprintDayFrontmatter extends BaseFrontmatter {
  day: number;
  subtitle: string;
  duration: string;
  difficulty: 'easy' | 'medium' | 'hard';
  videoId?: string;
}

export interface PageFrontmatter extends BaseFrontmatter {
  description?: string;
  lastUpdated?: string;
}

// Discriminated union for content items
export type ContentItem<T extends BaseFrontmatter = BaseFrontmatter> = {
  slug: string;
  frontmatter: T;
  content: string;
};

export type BlogPost = ContentItem<BlogFrontmatter>;
export type SprintDay = ContentItem<SprintDayFrontmatter>;
export type Page = ContentItem<PageFrontmatter>;

// Update function signatures
export async function getContentByType<T extends BaseFrontmatter>(
  type: string
): Promise<ContentItem<T>[]> {
  // ... implementation
}

export async function getContentBySlug<T extends BaseFrontmatter>(
  type: string,
  slug: string
): Promise<ContentItem<T> | null> {
  // ... implementation
}

// Type-safe usage
const posts = await getContentByType<BlogFrontmatter>('blog');
posts[0].frontmatter.author // Type-safe!
posts[0].frontmatter.excerpt // Type-safe!
```

**Benefits**:
- Full type safety for content
- Better autocomplete in IDEs
- Compile-time error catching
- Self-documenting code

**Effort**: 2-3 hours
**Priority**: CRITICAL - Type safety

---

### 8. Dangerous innerHTML Usage Without Sanitization

**Files**:
- `src/app/blog/[slug]/page.tsx` (Line 229)
- Potentially other locations

**Issue**: Using `dangerouslySetInnerHTML` with content from markdown files without sanitization could be a XSS vector if CMS is compromised.

**Current Code**:
```typescript
<div
  className="prose prose-invert prose-lg max-w-none ..."
  dangerouslySetInnerHTML={{ __html: post.content }}
/>
```

**Recommended Solution**:
```typescript
// Install DOMPurify
// npm install isomorphic-dompurify

// Create src/lib/sanitize.ts
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'a', 'ul', 'ol', 'li',
      'blockquote', 'code', 'pre',
      'strong', 'em', 'br', 'hr',
      'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span'
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel',
      'src', 'alt', 'title',
      'class', 'id',
      'data-video-id', 'data-autoplay', 'data-poster', 'data-quality'
    ],
    ALLOW_DATA_ATTR: true,
  });
}

// Update content processing
// src/lib/content.ts
import { sanitizeHtml } from './sanitize';

async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(html).process(markdown);
  const htmlContent = result.toString();
  const withVideos = replaceVideoPlaceholders(htmlContent);
  return sanitizeHtml(withVideos); // Sanitize before returning
}

// Usage in blog page
<div
  className="prose prose-invert prose-lg max-w-none ..."
  dangerouslySetInnerHTML={{ __html: post.content }} // Now sanitized
/>
```

**Benefits**:
- XSS protection
- Defense in depth security
- Configurable allowed tags/attributes
- Peace of mind

**Effort**: 2 hours
**Priority**: CRITICAL - Security

---

## High-Priority Refactorings

### 9. Duplicate Sidebar Code (Mobile vs Desktop)

**File**: `src/app/app/layout.tsx` (Lines 56-119 and 146-230)

**Issue**: Desktop and mobile sidebars share 95% identical code with only minor differences in styling and event handlers.

**Estimated Duplication**: ~70 lines

**Recommended Solution**:
```typescript
// Extract shared sidebar component
interface SidebarProps {
  navItems: NavItem[];
  isActive: (href: string) => boolean;
  session: Session | null;
  isMobile?: boolean;
  onItemClick?: () => void;
}

function Sidebar({ navItems, isActive, session, isMobile = false, onItemClick }: SidebarProps) {
  return (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-white/10 bg-black">
        <Link
          href="/app/profile"
          className="flex items-center gap-3"
          onClick={onItemClick}
        >
          {/* Logo content */}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <SidebarNavItem
            key={item.href}
            item={item}
            isActive={isActive(item.href)}
            onClick={onItemClick}
          />
        ))}
      </nav>

      {/* User Section */}
      {session?.user && (
        <div className="p-4 border-t border-white/10 space-y-3">
          <UserInfo user={session.user} />
          <SignOutButton className="w-full justify-start text-red-400 hover:bg-red-400/10" />
        </div>
      )}
    </>
  );
}

// Usage
<aside className="hidden lg:flex lg:flex-col w-72 ...">
  <Sidebar navItems={navItems} isActive={isActive} session={session} />
</aside>

<motion.aside className="lg:hidden ...">
  <Sidebar
    navItems={navItems}
    isActive={isActive}
    session={session}
    isMobile
    onItemClick={() => setIsSidebarOpen(false)}
  />
</motion.aside>
```

**Benefits**:
- Single source of truth for sidebar logic
- Easier to maintain and update
- Consistent behavior across mobile/desktop

**Effort**: 3 hours
**Priority**: HIGH

---

### 10. Repeated Profile Fetch Logic in UserContext

**File**: `src/contexts/UserContext.tsx` (Lines 84-123)

**Issue**: Profile fetching logic could be extracted into a reusable service layer.

**Recommended Solution**:
```typescript
// Create src/services/profile-service.ts
export class ProfileService {
  private static cache: Map<string, UserProfile> = new Map();

  static async fetchProfile(userId: string): Promise<UserProfile> {
    // Check cache first
    if (this.cache.has(userId)) {
      return this.cache.get(userId)!;
    }

    const response = await fetch('/api/profile', {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch profile: ${response.status}`);
    }

    const data = await response.json();
    this.cache.set(userId, data.profile);
    return data.profile;
  }

  static async updateProfile(
    userId: string,
    updates: Partial<UserProfile>
  ): Promise<UserProfile> {
    const response = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    const data = await response.json();
    this.cache.set(userId, data.profile);
    return data.profile;
  }

  static clearCache(userId?: string) {
    if (userId) {
      this.cache.delete(userId);
    } else {
      this.cache.clear();
    }
  }
}

// Simplified UserContext
const fetchProfile = useCallback(async () => {
  if (!session?.user?.id) return;

  try {
    const profile = await ProfileService.fetchProfile(session.user.id);
    setUser(profile);
    // ... update auth state
  } catch (error) {
    // ... error handling
  } finally {
    setIsLoading(false);
  }
}, [session?.user?.id]);
```

**Benefits**:
- Better separation of concerns
- Reusable across components
- Easier to test
- Centralized caching logic

**Effort**: 4 hours
**Priority**: HIGH

---

### 11. Video Placeholder Processing Could Be Optimized

**File**: `src/lib/content.ts` (Lines 36-63)

**Issue**: Video placeholder regex processing happens on every content fetch. Could be memoized or optimized.

**Current Performance**: O(n) regex matching on every fetch

**Recommended Solution**:
```typescript
// Optimize regex with compiled pattern
const VIDEO_PLACEHOLDER_REGEX = /{{video:([\w-]+)(?:\|([^}]+))?}}/g;
const VIDEO_PARAGRAPH_WRAPPER_REGEX = /<p>\s*(<div class="video-placeholder"[^>]*><\/div>)\s*<\/p>/g;

function parseVideoOptions(optionsStr: string | undefined): Record<string, string> {
  if (!optionsStr) return {};

  const options: Record<string, string> = {};
  const pairs = optionsStr.split('|');

  for (const pair of pairs) {
    const separatorIndex = pair.indexOf(':');
    if (separatorIndex === -1) continue;

    const key = pair.substring(0, separatorIndex).trim();
    const value = pair.substring(separatorIndex + 1).trim();

    if (key && value) {
      options[key] = value;
    }
  }

  return options;
}

function createVideoPlaceholder(videoId: string, options: Record<string, string>): string {
  const autoplay = options.autoplay || 'false';
  const poster = options.poster || '';
  const quality = options.quality || '';

  return `<div class="video-placeholder" data-video-id="${videoId}" data-autoplay="${autoplay}" data-poster="${poster}" data-quality="${quality}"></div>`;
}

function replaceVideoPlaceholders(htmlContent: string): string {
  // Reset regex state
  VIDEO_PLACEHOLDER_REGEX.lastIndex = 0;

  // Replace video placeholders
  let processed = htmlContent.replace(
    VIDEO_PLACEHOLDER_REGEX,
    (match, videoId, optionsStr) => {
      const options = parseVideoOptions(optionsStr);
      return createVideoPlaceholder(videoId, options);
    }
  );

  // Remove paragraph tags wrapping video placeholders
  processed = processed.replace(VIDEO_PARAGRAPH_WRAPPER_REGEX, '$1');

  return processed;
}
```

**Benefits**:
- Slight performance improvement
- More maintainable code
- Better separation of concerns

**Effort**: 2 hours
**Priority**: HIGH

---

### 12. Missing Input Validation in Profile Update

**File**: `src/app/api/profile/route.ts` (Line 127)

**Issue**: Profile updates accept any JSON without validation, potentially allowing invalid data into database.

**Recommended Solution**:
```typescript
import { z } from 'zod';

// Define validation schema
const profileUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  website: z.string().url().optional().or(z.literal('')),
}).strict(); // Reject unknown fields

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate input
    const validationResult = profileUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          details: validationResult.error.flatten()
        },
        { status: 400 }
      );
    }

    const updates = validationResult.data;
    // ... rest of update logic
  } catch (error) {
    // ... error handling
  }
}
```

**Benefits**:
- Data integrity
- Prevention of injection attacks
- Clear error messages
- Type safety

**Effort**: 2 hours
**Priority**: HIGH

---

### 13. No Pagination in Blog Page

**File**: `src/app/blog/page.tsx`

**Issue**: Blog page loads ALL posts without pagination. This will cause performance issues as content grows.

**Recommended Solution**:
```typescript
// Add pagination support
interface BlogPageProps {
  searchParams: Promise<{ page?: string; category?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1', 10);
  const category = params.category;
  const postsPerPage = 12;

  const allPosts = (await getContentByType("blog")) as BlogPost[];

  // Filter by category if specified
  const filteredPosts = category
    ? allPosts.filter(post => post.frontmatter.categories.includes(category))
    : allPosts;

  // Calculate pagination
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  return (
    <main className="bg-black min-h-screen text-white">
      {/* ... header ... */}

      {/* Posts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paginatedPosts.map(post => (/* ... post card ... */))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          category={category}
        />
      )}
    </main>
  );
}

// Create Pagination component
function Pagination({ currentPage, totalPages, category }: {
  currentPage: number;
  totalPages: number;
  category?: string;
}) {
  const buildUrl = (page: number) => {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    if (category) params.set('category', category);
    return `/blog?${params.toString()}`;
  };

  return (
    <div className="flex justify-center gap-2 mt-12">
      {currentPage > 1 && (
        <Link href={buildUrl(currentPage - 1)}>Previous</Link>
      )}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
        <Link
          key={page}
          href={buildUrl(page)}
          className={currentPage === page ? 'active' : ''}
        >
          {page}
        </Link>
      ))}
      {currentPage < totalPages && (
        <Link href={buildUrl(currentPage + 1)}>Next</Link>
      )}
    </div>
  );
}
```

**Benefits**:
- Scalability for growing content
- Better performance
- Improved UX with faster page loads

**Effort**: 4 hours
**Priority**: HIGH

---

### 14. Content Cache Missing TTL in Development

**File**: `src/lib/content.ts` (Lines 9-15)

**Issue**: Cache behavior is inconsistent between development and production. Development has no TTL, which can cause stale content during CMS editing.

**Recommended Solution**:
```typescript
const CACHE_TTL = process.env.NODE_ENV === 'production'
  ? 1000 * 60 * 60 // 1 hour in production
  : 1000 * 10; // 10 seconds in development for faster CMS iteration

const contentCache = new Map<string, { data: ContentItem; timestamp: number }>();

function getCachedContent(key: string): ContentItem | null {
  const cached = contentCache.get(key);
  if (!cached) return null;

  const now = Date.now();
  if (now - cached.timestamp > CACHE_TTL) {
    contentCache.delete(key);
    return null;
  }

  return cached.data;
}

function setCachedContent(key: string, data: ContentItem): void {
  contentCache.set(key, {
    data,
    timestamp: Date.now()
  });
}
```

**Benefits**:
- Better development experience
- Fresh content in dev mode
- Consistent caching behavior

**Effort**: 1 hour
**Priority**: HIGH

---

### 15. Excessive Logging Could Impact Performance

**Files**: Multiple API routes

**Issue**: Every API route logs extensively, which could:
- Impact performance in high-traffic scenarios
- Generate excessive log volume
- Increase costs with Axiom

**Recommended Solution**:
```typescript
// Create logging utility with levels
// src/lib/logging-helpers.ts
import { log } from '@/lib/axiom-logger';

const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

const LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

export const logger = {
  debug: (message: string, data?: Record<string, unknown>) => {
    if (LEVELS[LOG_LEVEL] <= LEVELS.debug) {
      return log.debug(message, data);
    }
  },

  info: (message: string, data?: Record<string, unknown>) => {
    if (LEVELS[LOG_LEVEL] <= LEVELS.info) {
      return log.info(message, data);
    }
  },

  warn: (message: string, data?: Record<string, unknown>) => {
    if (LEVELS[LOG_LEVEL] <= LEVELS.warn) {
      return log.warn(message, data);
    }
  },

  error: (message: string, data?: Record<string, unknown>) => {
    // Always log errors
    return log.error(message, data);
  },
};

// Usage in API routes
// Only log important events in production
await logger.info('Profile update request received', { /* ... */ });
await logger.debug('Detailed debugging info', { /* ... */ }); // Won't log in production
```

**Benefits**:
- Better performance in production
- Cost control for logging service
- Configurable verbosity

**Effort**: 3 hours
**Priority**: HIGH

---

### 16. No Request Timeout Handling

**Files**: All API route handlers

**Issue**: API routes don't have timeout handling. Long-running requests could tie up resources.

**Recommended Solution**:
```typescript
// Create timeout middleware
// src/lib/api-helpers.ts
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 10000, // 10 seconds default
  timeoutMessage: string = 'Request timeout'
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs)
    ),
  ]);
}

// Usage in API routes
export async function GET() {
  try {
    const data = await withTimeout(
      turso.execute({ sql: 'SELECT * FROM users', args: [] }),
      5000, // 5 second timeout
      'Database query timeout'
    );

    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof Error && error.message.includes('timeout')) {
      return NextResponse.json(
        { error: 'Request timed out' },
        { status: 504 }
      );
    }
    // ... other error handling
  }
}
```

**Benefits**:
- Better resource management
- Prevents hanging requests
- Improved reliability

**Effort**: 2 hours
**Priority**: HIGH

---

### 17. Sprint Progress Cache Not Invalidated

**File**: `src/lib/sprint-progress.ts` (Line 24)

**Issue**: In-memory cache `cachedProgress` is never invalidated except in `clearCache()`. Could show stale data.

**Recommended Solution**:
```typescript
// Add TTL to cache
interface CachedProgress {
  data: SprintProgress;
  timestamp: number;
}

let cachedProgress: CachedProgress | null = null;
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

function getCachedProgress(): SprintProgress | null {
  if (!cachedProgress) return null;

  const now = Date.now();
  if (now - cachedProgress.timestamp > CACHE_TTL) {
    cachedProgress = null;
    return null;
  }

  return cachedProgress.data;
}

function setCachedProgress(progress: SprintProgress): void {
  cachedProgress = {
    data: progress,
    timestamp: Date.now()
  };
}

export async function getProgress(): Promise<SprintProgress> {
  // Check cache with TTL
  const cached = getCachedProgress();
  if (cached) return cached;

  try {
    const response = await fetch('/api/sprint/progress', {
      credentials: 'include'
    });
    // ... fetch logic
    setCachedProgress(data.progress);
    return data.progress;
  } catch (error) {
    // ... error handling
  }
}
```

**Benefits**:
- Fresh data
- Prevents stale cache issues
- Better UX

**Effort**: 1 hour
**Priority**: HIGH

---

### 18. Database Query Building Is Not Type-Safe

**Files**: Multiple API routes (e.g., `src/app/api/leads/route.ts` Line 317-336)

**Issue**: SQL queries are built with string concatenation, which is error-prone and not type-safe.

**Recommended Solution**:
```typescript
// Use a query builder or create type-safe helpers
// src/lib/query-builder.ts
interface QueryBuilder {
  sql: string;
  args: (string | number)[];
}

export class SelectQueryBuilder {
  private table: string;
  private whereClauses: string[] = [];
  private whereArgs: (string | number)[] = [];
  private limitValue?: number;
  private offsetValue?: number;
  private orderByClause?: string;

  constructor(table: string) {
    this.table = table;
  }

  where(condition: string, value: string | number): this {
    this.whereClauses.push(condition);
    this.whereArgs.push(value);
    return this;
  }

  orderBy(column: string, direction: 'ASC' | 'DESC' = 'ASC'): this {
    this.orderByClause = `${column} ${direction}`;
    return this;
  }

  limit(value: number): this {
    this.limitValue = value;
    return this;
  }

  offset(value: number): this {
    this.offsetValue = value;
    return this;
  }

  build(): QueryBuilder {
    let sql = `SELECT * FROM ${this.table}`;
    const args: (string | number)[] = [];

    if (this.whereClauses.length > 0) {
      sql += ` WHERE ${this.whereClauses.join(' AND ')}`;
      args.push(...this.whereArgs);
    }

    if (this.orderByClause) {
      sql += ` ORDER BY ${this.orderByClause}`;
    }

    if (this.limitValue !== undefined) {
      sql += ` LIMIT ?`;
      args.push(this.limitValue);
    }

    if (this.offsetValue !== undefined) {
      sql += ` OFFSET ?`;
      args.push(this.offsetValue);
    }

    return { sql, args };
  }
}

// Usage in API route
const query = new SelectQueryBuilder('leads')
  .where('created_at >= ?', startDate)
  .where('created_at <= ?', endDate)
  .where('status = ?', status)
  .orderBy('created_at', 'DESC')
  .limit(pageSize)
  .offset((page - 1) * pageSize)
  .build();

const result = await turso.execute(query);
```

**Benefits**:
- Type-safe query construction
- Less error-prone
- More maintainable
- Easier to test

**Effort**: 6 hours
**Priority**: HIGH

---

### 19. Missing Rate Limiting on Profile API

**File**: `src/app/api/profile/route.ts`

**Issue**: Profile update endpoint has no rate limiting, could be abused.

**Recommended Solution**:
```typescript
// Apply rate limiting middleware
import { rateLimit } from '@/lib/rate-limit';

export async function PUT(request: NextRequest) {
  // Check rate limit (5 updates per minute per user)
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rateLimitKey = `profile-update:${session.user.id}`;
  const rateLimitResult = await rateLimit(rateLimitKey, 5, 60); // 5 per minute

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      {
        error: 'Too many requests. Please try again later.',
        retryAfter: rateLimitResult.retryAfter
      },
      {
        status: 429,
        headers: { 'Retry-After': rateLimitResult.retryAfter.toString() }
      }
    );
  }

  // ... rest of handler
}
```

**Benefits**:
- Abuse prevention
- Better resource management
- DoS protection

**Effort**: 2 hours
**Priority**: HIGH

---

### 20. Test Mode Authentication Mixed with Production

**File**: `src/contexts/UserContext.tsx` (Lines 133-143)

**Issue**: Test authentication logic is mixed into production UserContext, adding complexity and potential security risks.

**Recommended Solution**:
```typescript
// Separate test mode into conditional compilation
const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true';

// Only include test auth in development
useEffect(() => {
  if (status === 'loading') {
    setIsLoading(true);
    return;
  }

  if (status === 'unauthenticated') {
    // Only check localStorage in test mode
    if (isTestMode && process.env.NODE_ENV === 'development') {
      const storedAuth = storage.getItem<AuthState>(STORAGE_KEYS.USER_AUTH);
      const storedProfile = storage.getItem<UserProfile>(STORAGE_KEYS.USER_PROFILE);

      if (storedAuth && storedProfile && storedAuth.isAuthenticated) {
        setAuth(storedAuth);
        setUser(storedProfile);
        setIsLoading(false);
        return;
      }
    }

    // Production path
    setUser(null);
    setAuth({ isAuthenticated: false, userId: null });
    setIsLoading(false);
    return;
  }

  fetchProfile();
}, [status, fetchProfile]);
```

**Benefits**:
- Cleaner production code
- Better security
- Easier to reason about

**Effort**: 2 hours
**Priority**: HIGH

---

### 21. Blog Category Filtering Not Implemented

**File**: `src/app/blog/page.tsx` (Line 64)

**Issue**: Category filter links are rendered but filtering logic is not implemented.

**Recommended Solution**:
```typescript
interface BlogPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const selectedCategory = params.category;

  const allPosts = (await getContentByType("blog")) as BlogPost[];

  // Filter posts by category if selected
  const posts = selectedCategory
    ? allPosts.filter(post =>
        post.frontmatter.categories.includes(selectedCategory)
      )
    : allPosts;

  return (
    <main className="bg-black min-h-screen text-white">
      {/* Category Filter */}
      {allCategories.length > 0 && (
        <div className="mb-12 flex flex-wrap gap-3 justify-center">
          <Link href="/blog">
            <span className={cn(
              "px-4 py-2 rounded-full text-sm transition-all cursor-pointer",
              !selectedCategory
                ? "bg-primary/20 border border-primary/50 text-primary"
                : "bg-secondary/50 border border-white/10 text-gray-300 hover:border-primary/50"
            )}>
              All Posts
            </span>
          </Link>
          {allCategories.map((category) => (
            <Link key={category} href={`/blog?category=${encodeURIComponent(category)}`}>
              <span className={cn(
                "px-4 py-2 rounded-full text-sm transition-all cursor-pointer",
                selectedCategory === category
                  ? "bg-primary/20 border border-primary/50 text-primary"
                  : "bg-secondary/50 border border-white/10 text-gray-300 hover:border-primary/50"
              )}>
                {category}
              </span>
            </Link>
          ))}
        </div>
      )}

      {/* Results count */}
      <div className="mb-6 text-center text-gray-400">
        {selectedCategory
          ? `${posts.length} posts in "${selectedCategory}"`
          : `${posts.length} total posts`
        }
      </div>

      {/* Posts Grid */}
      {/* ... */}
    </main>
  );
}
```

**Benefits**:
- Complete feature implementation
- Better UX
- Content discoverability

**Effort**: 2 hours
**Priority**: HIGH

---

### 22. No Loading States for Async Operations

**Files**: Multiple components

**Issue**: Components don't show loading states during async operations, leaving users uncertain.

**Recommended Solution**:
```typescript
// Create reusable loading components
// src/components/LoadingSpinner.tsx
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-primary border-t-transparent`} />
  );
}

// src/components/LoadingState.tsx
export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-gray-400">{message}</p>
    </div>
  );
}

// Usage in profile page
export default function ProfilePage() {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      await updateProfile({/* ... */});
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div>
      <button onClick={handleSave} disabled={isUpdating}>
        {isUpdating ? (
          <span className="flex items-center gap-2">
            <LoadingSpinner size="sm" />
            Saving...
          </span>
        ) : (
          'Save'
        )}
      </button>
    </div>
  );
}
```

**Benefits**:
- Better UX
- Clear feedback
- Professional feel

**Effort**: 4 hours
**Priority**: HIGH

---

### 23. Inconsistent Error Response Format

**Files**: All API routes

**Issue**: Error responses have inconsistent formats across different routes:
- Some return `{ error: string }`
- Some return `{ success: false, error: string }`
- Some include additional fields

**Recommended Solution**:
```typescript
// Create standardized error response types
// src/lib/api-responses.ts
export interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: unknown;
  timestamp: string;
}

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  timestamp: string;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// Error response helpers
export function errorResponse(
  error: string,
  status: number = 500,
  code?: string,
  details?: unknown
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
      code,
      details,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

export function successResponse<T>(
  data: T,
  status: number = 200
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

// Usage in API routes
export async function GET() {
  try {
    const profile = await fetchProfile();
    return successResponse({ profile });
  } catch (error) {
    return errorResponse(
      'Failed to fetch profile',
      500,
      'PROFILE_FETCH_ERROR',
      error instanceof Error ? { message: error.message } : undefined
    );
  }
}

export async function POST(request: NextRequest) {
  const validation = validateInput(await request.json());
  if (!validation.valid) {
    return errorResponse(
      'Invalid input',
      400,
      'VALIDATION_ERROR',
      validation.errors
    );
  }
  // ... rest of handler
}
```

**Benefits**:
- Consistent API contract
- Easier client-side error handling
- Better debugging
- Type-safe responses

**Effort**: 4 hours
**Priority**: HIGH

---

## Medium-Priority Improvements

### 24. Extract Globe Configuration to Separate File

**File**: `src/app/page.tsx` (Lines 29-81)

**Current**: 50+ lines of configuration in component

**Recommended**: Move to `src/config/landing-page.ts`

**Effort**: 1 hour
**Priority**: MEDIUM

---

### 25. Create Shared Type Definitions File

**Issue**: Types like `BlogPost` are defined multiple times across files

**Recommended**: Create `src/types/content.ts` with shared types

**Effort**: 2 hours
**Priority**: MEDIUM

---

### 26. Add JSDoc Comments to Public APIs

**Issue**: Many exported functions lack documentation

**Recommended**: Add comprehensive JSDoc comments

**Effort**: 4 hours
**Priority**: MEDIUM

---

### 27. Extract Magic Numbers to Constants

**Files**: Multiple

**Issue**: Magic numbers like `30` (sprint days), `5` (rate limit) scattered throughout

**Recommended**: Create constants file

**Effort**: 2 hours
**Priority**: MEDIUM

---

### 28. Improve Error Messages User-Friendliness

**Issue**: Technical error messages shown to users

**Recommended**: User-friendly error messages with technical details logged

**Effort**: 3 hours
**Priority**: MEDIUM

---

### 29. Add Analytics Tracking

**Issue**: No analytics tracking for user actions

**Recommended**: Add event tracking for key user actions

**Effort**: 6 hours
**Priority**: MEDIUM

---

### 30. Optimize Image Loading

**Issue**: Some images use `<img>` instead of Next.js `Image`

**Recommended**: Audit and convert to Next.js Image component

**Effort**: 4 hours
**Priority**: MEDIUM

---

### 31. Create Reusable Card Components

**Issue**: Card patterns repeated across multiple pages

**Recommended**: Extract shared card components

**Effort**: 3 hours
**Priority**: MEDIUM

---

### 32. Add Skeleton Loading States

**Issue**: Blank screens while loading content

**Recommended**: Add skeleton screens for better perceived performance

**Effort**: 5 hours
**Priority**: MEDIUM

---

### 33. Implement Optimistic Updates for Profile

**Issue**: User sees delay when updating profile

**Recommended**: Already partially implemented, improve UX with better rollback

**Effort**: 2 hours
**Priority**: MEDIUM

---

### 34. Add Search Functionality to Blog

**Issue**: No search capability in blog

**Recommended**: Implement client-side search or integrate search service

**Effort**: 8 hours
**Priority**: MEDIUM

---

### 35. Create Admin Dashboard Layout Component

**Issue**: Admin pages might grow and need consistent layout

**Recommended**: Create dedicated admin layout

**Effort**: 3 hours
**Priority**: MEDIUM

---

### 36. Add Email Validation on Frontend

**Issue**: Email validation only happens on backend

**Recommended**: Add client-side validation for better UX

**Effort**: 2 hours
**Priority**: MEDIUM

---

### 37. Implement Toast Notifications

**Issue**: No global notification system

**Recommended**: Add toast notification system for feedback

**Effort**: 4 hours
**Priority**: MEDIUM

---

### 38. Add Accessibility Landmarks

**Issue**: Some pages missing proper ARIA landmarks

**Recommended**: Audit and add proper semantic HTML and ARIA

**Effort**: 4 hours
**Priority**: MEDIUM

---

### 39. Create API Response Caching

**Issue**: No caching for frequently accessed data

**Recommended**: Implement response caching for static data

**Effort**: 3 hours
**Priority**: MEDIUM

---

### 40. Add Database Connection Pooling

**Issue**: New connection on every request

**Recommended**: Implement connection pooling (if not already handled by Turso)

**Effort**: 2 hours
**Priority**: MEDIUM

---

### 41. Create Shared Button Components

**Issue**: Button styles inconsistent across pages

**Recommended**: Create Button component with variants

**Effort**: 3 hours
**Priority**: MEDIUM

---

### 42. Add Request/Response Logging Middleware

**Issue**: Inconsistent logging across routes

**Recommended**: Create middleware for standardized logging

**Effort**: 3 hours
**Priority**: MEDIUM

---

### 43. Implement Progressive Image Loading

**Issue**: Large images block rendering

**Recommended**: Add blur placeholders and progressive loading

**Effort**: 3 hours
**Priority**: MEDIUM

---

### 44. Add Meta Tags for Social Sharing

**Issue**: Missing Open Graph and Twitter card meta tags on some pages

**Recommended**: Add comprehensive social sharing meta tags

**Effort**: 3 hours
**Priority**: MEDIUM

---

### 45. Create Environment Variable Validation

**Issue**: Missing env vars cause runtime errors

**Recommended**: Validate all required env vars at startup

**Effort**: 2 hours
**Priority**: MEDIUM

---

## Low-Priority Enhancements

### 46. Add Dark Mode Toggle (Already Dark)

**Note**: Site is already dark theme, but could add light mode option

**Effort**: 8 hours
**Priority**: LOW

---

### 47. Implement Keyboard Shortcuts

**Recommended**: Add keyboard navigation for power users

**Effort**: 4 hours
**Priority**: LOW

---

### 48. Add Print Stylesheets

**Recommended**: Optimize pages for printing

**Effort**: 3 hours
**Priority**: LOW

---

### 49. Create Storybook Documentation

**Recommended**: Document components with Storybook

**Effort**: 12 hours
**Priority**: LOW

---

### 50. Add RSS Feed for Blog

**Recommended**: Generate RSS feed for blog posts

**Effort**: 3 hours
**Priority**: LOW

---

### 51. Implement Service Worker

**Recommended**: Add offline support with service worker

**Effort**: 8 hours
**Priority**: LOW

---

### 52. Add Animated Page Transitions

**Recommended**: Smooth transitions between pages

**Effort**: 4 hours
**Priority**: LOW

---

### 53. Create Component Performance Metrics

**Recommended**: Track component render performance

**Effort**: 4 hours
**Priority**: LOW

---

### 54. Add Internationalization (i18n)

**Recommended**: Support multiple languages

**Effort**: 16 hours
**Priority**: LOW

---

### 55. Implement A/B Testing Framework

**Recommended**: Add A/B testing capability

**Effort**: 8 hours
**Priority**: LOW

---

### 56. Add Sitemap Generation

**Recommended**: Auto-generate sitemap.xml

**Effort**: 2 hours
**Priority**: LOW

---

## Technical Debt Summary

### TODO Items Found (30 total)

1. **Lead Capture**: Distributed rate limiting implementation needed
2. **Lead Capture**: Document why duplicate check is 24 hours (line 112)
3. **Stripe Checkout**: Replace book title placeholder
4. **Stripe Checkout**: Add book cover image URL
5. **Download Route**: Replace PDF path when book uploaded
6. **Stripe Webhook**: Send confirmation email (4 instances)
7. **Test Utils**: Implement magic link retrieval
8. **Test Utils**: Implement database user creation
9. **Test Utils**: Implement database cleanup
10. **Test Utils**: Implement Mailosaur client
11. **E2E Tests**: Multiple test implementations needed (15+ skipped tests)

### Type Safety Issues

- **48 uses of `any` type** across codebase
- Need to replace with proper interfaces
- Estimated effort: 12-16 hours to address all

---

## Implementation Roadmap

### Phase 1: Critical Security & Stability (2-3 weeks)

**Focus**: Fix critical security and stability issues

1. Implement distributed rate limiting (3-4h)
2. Extract profile transformation logic (2h)
3. Centralize admin email configuration (2h)
4. Add error boundaries to all pages (3h)
5. Implement input validation with Zod (3h)
6. Add HTML sanitization (2h)
7. Validate environment variables at startup (2h)

**Total**: 16-24 hours

---

### Phase 2: Architecture & Code Quality (3-4 weeks)

**Focus**: Major refactorings for maintainability

1. Break down landing page component (6-8h)
2. Eliminate sidebar code duplication (3h)
3. Create ProfileService layer (4h)
4. Implement type-safe query builder (6h)
5. Standardize API response formats (4h)
6. Create shared type definitions (2h)
7. Add proper TypeScript interfaces for content (2-3h)

**Total**: 27-36 hours

---

### Phase 3: Performance & UX (2-3 weeks)

**Focus**: Improve performance and user experience

1. Add blog pagination (4h)
2. Implement blog category filtering (2h)
3. Add loading states across app (4h)
4. Optimize video placeholder processing (2h)
5. Improve cache TTL handling (2h)
6. Add toast notifications (4h)
7. Implement skeleton screens (5h)

**Total**: 23-30 hours

---

### Phase 4: Polish & Enhancement (2-3 weeks)

**Focus**: Nice-to-have improvements

1. Add analytics tracking (6h)
2. Optimize images (4h)
3. Create reusable components (6h)
4. Add search functionality (8h)
5. Improve accessibility (4h)
6. Add meta tags for SEO (3h)

**Total**: 31-40 hours

---

## Metrics & Analysis

### Code Quality Metrics

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Average file size | 162 lines | <200 lines | Good |
| Largest file | 678 lines | <500 lines | Needs refactoring |
| Uses of `any` | 48 | <10 | Needs improvement |
| Code duplication | ~5% | <3% | Acceptable |
| Test coverage | ~60% | >80% | Needs improvement |

### Performance Indicators

| Indicator | Current | Target | Priority |
|-----------|---------|--------|----------|
| Landing page size | 519 lines | <200 lines | CRITICAL |
| API response time | Good | <200ms | Monitor |
| Client bundle size | Unknown | <500KB | HIGH |
| Lighthouse score | Unknown | >90 | MEDIUM |

### Security Posture

| Area | Status | Priority |
|------|--------|----------|
| Rate limiting | Broken in serverless | CRITICAL |
| Input validation | Partial | CRITICAL |
| HTML sanitization | Missing | CRITICAL |
| XSS protection | Needs improvement | HIGH |
| SQL injection | Protected (parameterized) | Good |
| CSRF protection | Not needed (no cookies) | N/A |

---

## Conclusion

This codebase is generally well-structured for an MVP, but has several critical issues that should be addressed before scaling:

### Strengths

- Good Next.js 15 App Router patterns
- Clean component separation (mostly)
- Proper use of Server Components where appropriate
- Good authentication implementation
- Comprehensive error logging with Axiom

### Key Weaknesses

1. **Broken rate limiting** in serverless environment
2. **Large monolithic components** (landing page)
3. **Code duplication** (profile transformation, sidebar)
4. **Missing validation** on critical endpoints
5. **Type safety issues** (48 uses of `any`)
6. **30+ TODO items** indicating incomplete features

### Recommended Priority Order

1. Fix critical security issues (rate limiting, validation, sanitization)
2. Break down large components and eliminate duplication
3. Improve type safety across the codebase
4. Add missing features (pagination, filtering, error boundaries)
5. Polish UX with loading states and better feedback
6. Implement nice-to-have enhancements

### Estimated Timeline

- **Phase 1 (Critical)**: 2-3 weeks
- **Phase 2 (Architecture)**: 3-4 weeks
- **Phase 3 (Performance)**: 2-3 weeks
- **Phase 4 (Polish)**: 2-3 weeks

**Total**: 9-13 weeks of dedicated refactoring effort

This represents a significant but necessary investment to transform this MVP into a production-ready, scalable application.

---

## Appendix: Quick Reference

### Files Requiring Immediate Attention

1. `src/app/api/leads/route.ts` - Rate limiting
2. `src/app/page.tsx` - Component size
3. `src/app/api/profile/route.ts` - Code duplication, validation
4. `src/app/app/layout.tsx` - Sidebar duplication, hardcoded admin
5. `src/lib/content.ts` - Type safety
6. `src/app/blog/[slug]/page.tsx` - HTML sanitization
7. `src/contexts/UserContext.tsx` - Test mode separation

### Dependencies to Consider Adding

- `zod` - Runtime type validation
- `isomorphic-dompurify` - HTML sanitization
- `@vercel/kv` - Distributed rate limiting
- React Hook Form - Better form handling
- Sonner or React Hot Toast - Toast notifications

### Environment Variables to Add

- `LOG_LEVEL` - Control logging verbosity
- `ADMIN_EMAILS` - Comma-separated admin emails
- `CACHE_TTL` - Cache duration configuration

---

*Report generated: November 18, 2025*
*Next review recommended: December 18, 2025*
