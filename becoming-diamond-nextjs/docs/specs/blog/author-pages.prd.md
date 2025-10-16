# Product Requirements Document: Author Pages

**Status:** Draft
**Priority:** Medium
**Effort Estimate:** 2-3 hours (Simple) | 1-2 days (Full-featured)
**Owner:** TBD
**Created:** 2025-10-16
**Last Updated:** 2025-10-16

## Executive Summary

Add dedicated author profile/archive pages to the blog system, allowing users to view all posts by a specific author and access author biographical information. Currently, author names are displayed statically on blog posts but are not clickable and have no dedicated landing pages.

## Problem Statement

### Current State
- Author metadata exists in blog post frontmatter (`author` field)
- Author names displayed on blog listing page and individual posts
- Author information is static text with no interactivity
- No way to browse all posts by a specific author
- No author profile or biographical information displayed
- All current posts authored by "Michael T Dugan"

### User Pain Points
1. **Discovery**: Users cannot easily find all posts by their favorite author
2. **Context**: No biographical information about authors to establish credibility
3. **Navigation**: No author-centric browsing experience
4. **SEO**: Missing author-specific landing pages hurts discoverability

### Business Impact
- Reduced content discoverability
- Missed opportunity for author branding
- Suboptimal SEO (missing author archive pages)
- Poor multi-author blog experience (if/when additional authors join)

## Goals & Success Metrics

### Primary Goals
1. Enable users to browse all posts by a specific author
2. Provide author biographical information and context
3. Make author names clickable throughout the site
4. Improve content discoverability and navigation

### Success Metrics
- Author page views > 5% of total blog traffic
- Click-through rate on author links > 10%
- Average session duration increase on blog section > 15%
- Reduced bounce rate on blog posts with author links

### Non-Goals (Out of Scope)
- Multi-author post attribution (one author per post)
- Author authentication/login system
- Author dashboard or CMS access control
- Author-specific RSS feeds (future consideration)
- Author following/subscription features

## User Stories

### As a Blog Reader
- I want to click an author's name to see all their posts
- I want to learn about an author's background and expertise
- I want to find an author's social media profiles
- I want to see an author's avatar/photo for personalization

### As a Content Creator
- I want my author profile to establish credibility
- I want readers to discover my other content easily
- I want my biographical information displayed consistently
- I want my social media links to drive engagement

### As a Site Administrator
- I want to add new authors easily through the CMS
- I want author pages to be SEO-optimized automatically
- I want author data to be maintainable without code changes
- I want the system to scale for multiple authors

## Functional Requirements

### MVP (Approach A: Simple Author Archives)

#### 1. Author Archive Page
**Route:** `/blog/author/[authorSlug]`

**Features:**
- Display all blog posts by specific author
- Author name as page heading
- Post count indicator (e.g., "5 posts by Michael T Dugan")
- Standard blog post grid/list layout
- Responsive design matching existing blog pages
- Same post card design as main blog listing

**Technical:**
- Dynamic route using Next.js App Router
- Static generation via `generateStaticParams()`
- Slug generation from author name (e.g., "Michael T Dugan" → "michael-t-dugan")
- Filter posts using existing `getContentByType('blog')` function

#### 2. Clickable Author Links
**Locations:**
- Blog listing page (src/app/blog/page.tsx:120)
- Individual blog post page (src/app/blog/[slug]/page.tsx:152)

**Behavior:**
- Convert static author text to `<Link>` components
- Link to `/blog/author/[authorSlug]`
- Maintain existing styling
- Add hover state (text-primary color)

#### 3. Utility Functions
**File:** `src/lib/content.ts`

**Functions:**
```typescript
authorNameToSlug(name: string): string
getPostsByAuthor(authorSlug: string): Promise<BlogPost[]>
getAuthors(): Promise<string[]>
```

**Logic:**
- Slug generation: lowercase, replace spaces with hyphens, remove special chars
- Post filtering: case-insensitive author name matching
- Author extraction: unique authors from all blog posts

#### 4. SEO & Metadata
- Page title: `Posts by [Author Name] | Becoming Diamond Blog`
- Meta description: `Read all articles by [Author Name] on transformation, leadership, and mastering pressure.`
- Open Graph tags for social sharing
- Canonical URLs for author pages

### Full-Featured (Approach B: Author Profiles) - Phase 2

#### 5. Author Profile Data
**Storage:** `content/authors/[author-slug].md` (new directory)

**Frontmatter Schema:**
```yaml
name: "Michael T Dugan"
slug: "michael-t-dugan"
bio: "Author and transformation coach specializing in..."
avatar: "/uploads/authors/michael-dugan.jpg"
social:
  twitter: "michaeltdugan"
  linkedin: "michaeltdugan"
  website: "https://example.com"
title: "Author & Coach"
published: true
```

#### 6. CMS Configuration
**File:** `public/admin/config.yml`

**Add Collection:**
```yaml
- name: "authors"
  label: "Authors"
  folder: "content/authors"
  create: true
  slug: "{{slug}}"
  fields:
    - {label: "Name", name: "name", widget: "string"}
    - {label: "Slug", name: "slug", widget: "string", pattern: ['^[a-z0-9-]+$', 'Lowercase letters, numbers, and hyphens only']}
    - {label: "Bio", name: "bio", widget: "text"}
    - {label: "Avatar", name: "avatar", widget: "image", required: false}
    - {label: "Title", name: "title", widget: "string"}
    - label: "Social Media"
      name: "social"
      widget: "object"
      fields:
        - {label: "Twitter", name: "twitter", widget: "string", required: false}
        - {label: "LinkedIn", name: "linkedin", widget: "string", required: false}
        - {label: "Website", name: "website", widget: "string", required: false}
    - {label: "Published", name: "published", widget: "boolean", default: true}
```

#### 7. Enhanced Author Profile Page
**Components:**
- Author header section with avatar
- Author bio (markdown formatted)
- Social media links with icons
- Post count and publication date range
- "About the Author" card on blog posts
- Author profile sidebar on archive page

#### 8. Author Profile Component
**File:** `src/components/AuthorProfile.tsx`

**Props:**
```typescript
interface AuthorProfileProps {
  author: Author;
  postCount?: number;
  variant?: 'full' | 'compact' | 'sidebar';
}
```

**Features:**
- Reusable across different layouts
- Responsive design (mobile/desktop)
- Social media icon links
- Optional avatar display

## Technical Specifications

### Data Flow

#### Approach A (Simple)
```
Blog Post Markdown (author field)
  ↓
getContentByType('blog')
  ↓
Extract unique authors → Generate slugs
  ↓
generateStaticParams() → Author archive routes
  ↓
Filter posts by author → Render archive page
```

#### Approach B (Full-featured)
```
content/authors/[slug].md (author profiles)
  ↓
getContentByType('authors')
  ↓
Match blog posts with author profiles
  ↓
Enhanced author pages with bio/avatar/social
```

### File Structure

```
src/
├── app/
│   └── blog/
│       └── author/
│           └── [authorSlug]/
│               └── page.tsx          # New: Author archive page
├── components/
│   └── AuthorProfile.tsx             # Phase 2: Reusable author component
└── lib/
    └── content.ts                     # Updated: Add author utilities

content/
└── authors/                           # Phase 2: Author profiles
    └── michael-t-dugan.md

public/
└── admin/
    └── config.yml                     # Phase 2: Add authors collection
```

### API Changes

#### New Functions in `src/lib/content.ts`

```typescript
/**
 * Convert author name to URL-safe slug
 * Example: "Michael T Dugan" → "michael-t-dugan"
 */
export function authorNameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/--+/g, '-')      // Collapse multiple hyphens
    .trim();
}

/**
 * Get all unique authors from blog posts
 * Returns array of author names
 */
export async function getAuthors(): Promise<string[]> {
  const posts = await getContentByType('blog') as BlogPost[];
  const authors = new Set(posts.map(p => p.frontmatter.author));
  return Array.from(authors).sort();
}

/**
 * Get all posts by a specific author
 * @param authorSlug - URL-safe author identifier
 * Returns filtered and sorted blog posts
 */
export async function getPostsByAuthor(authorSlug: string): Promise<BlogPost[]> {
  const posts = await getContentByType('blog') as BlogPost[];
  return posts
    .filter(p => authorNameToSlug(p.frontmatter.author) === authorSlug)
    .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());
}

// Phase 2: Author profile functions
export async function getAuthorProfile(slug: string): Promise<Author | null> {
  return getContentBySlug('authors', slug) as Promise<Author | null>;
}

export async function getAuthorProfiles(): Promise<Author[]> {
  return getContentByType('authors') as Promise<Author[]>;
}
```

#### Type Definitions

```typescript
// Existing BlogPost interface (no changes)
interface BlogPost {
  slug: string;
  frontmatter: {
    title: string;
    author: string;  // Used to link to author pages
    date: string;
    thumbnail?: string;
    excerpt: string;
    categories: string[];
    tags: string[];
    published?: boolean;
  };
  content: string;
}

// Phase 2: New Author interface
interface Author {
  slug: string;
  frontmatter: {
    name: string;
    slug: string;
    bio: string;
    avatar?: string;
    title?: string;
    social?: {
      twitter?: string;
      linkedin?: string;
      website?: string;
    };
    published?: boolean;
  };
  content: string; // Bio in markdown format
}
```

### UI/UX Specifications

#### Author Archive Page Layout

```
┌─────────────────────────────────────┐
│           Navigation                │
├─────────────────────────────────────┤
│                                     │
│  ← Back to Blog                     │
│                                     │
│  Posts by Michael T Dugan           │
│  3 articles                         │
│                                     │
│  ┌──────┐  ┌──────┐  ┌──────┐     │
│  │Post 1│  │Post 2│  │Post 3│     │
│  │      │  │      │  │      │     │
│  └──────┘  └──────┘  └──────┘     │
│                                     │
│  [CTA: Join Diamond Community]      │
│                                     │
├─────────────────────────────────────┤
│           Footer                    │
└─────────────────────────────────────┘
```

#### Phase 2: Enhanced Author Page

```
┌─────────────────────────────────────┐
│           Navigation                │
├─────────────────────────────────────┤
│                                     │
│  ← Back to Blog                     │
│                                     │
│  ┌────────────────────────────┐    │
│  │  [Avatar]  Michael T Dugan  │    │
│  │            Author & Coach   │    │
│  │  Bio text here...          │    │
│  │  [Twitter] [LinkedIn] [Web]│    │
│  └────────────────────────────┘    │
│                                     │
│  Articles (3)                       │
│                                     │
│  ┌──────┐  ┌──────┐  ┌──────┐     │
│  │Post 1│  │Post 2│  │Post 3│     │
│  └──────┘  └──────┘  └──────┘     │
│                                     │
└─────────────────────────────────────┘
```

#### Clickable Author Links Styling

```css
/* Current: Static text */
<span>{post.frontmatter.author}</span>

/* New: Interactive link */
<Link href="/blog/author/michael-t-dugan">
  <span className="text-gray-400 hover:text-primary transition-colors cursor-pointer">
    Michael T Dugan
  </span>
</Link>
```

### Performance Considerations

1. **Static Generation**
   - All author pages pre-rendered at build time
   - No runtime filtering required
   - Fast page loads with zero database queries

2. **Bundle Size**
   - Minimal JavaScript for author pages
   - Reuse existing blog components
   - No additional dependencies required

3. **Build Time**
   - ~1-2 seconds per author page
   - Negligible impact with 1-5 authors
   - Scales linearly with author count

### SEO Strategy

1. **Author Page URLs**
   - Clean, semantic URLs: `/blog/author/michael-t-dugan`
   - Lowercase, hyphenated slugs for consistency
   - No special characters or spaces

2. **Metadata**
   ```typescript
   export async function generateMetadata({ params }) {
     const { authorSlug } = await params;
     const posts = await getPostsByAuthor(authorSlug);
     const authorName = posts[0]?.frontmatter.author;

     return {
       title: `Posts by ${authorName} | Becoming Diamond Blog`,
       description: `Read all articles by ${authorName} on transformation, leadership, and mastering pressure.`,
       openGraph: {
         title: `Posts by ${authorName}`,
         description: `Articles by ${authorName}`,
         type: 'profile',
       },
     };
   }
   ```

3. **Structured Data** (Phase 2)
   - Schema.org Person markup
   - Author bio and social profiles
   - Article authorship attribution

## Implementation Plan

### Phase 1: MVP (Simple Author Archives) - 2-3 hours

#### Step 1: Create Author Utilities (30 min)
- [ ] Add `authorNameToSlug()` to `src/lib/content.ts`
- [ ] Add `getPostsByAuthor()` to `src/lib/content.ts`
- [ ] Add `getAuthors()` to `src/lib/content.ts`
- [ ] Add TypeScript type exports if needed

#### Step 2: Build Author Archive Page (60 min)
- [ ] Create `src/app/blog/author/[authorSlug]/page.tsx`
- [ ] Implement `generateStaticParams()` for static generation
- [ ] Implement `generateMetadata()` for SEO
- [ ] Build page component with post filtering
- [ ] Use existing blog post card components
- [ ] Add "Back to Blog" navigation
- [ ] Style page matching existing blog design

#### Step 3: Make Author Names Clickable (30 min)
- [ ] Update `src/app/blog/page.tsx` line 120
  - Convert `<span>` to `<Link>` component
  - Add hover styles
  - Generate author slug for href
- [ ] Update `src/app/blog/[slug]/page.tsx` line 152
  - Same changes as blog listing page
  - Maintain existing icon and layout

#### Step 4: Testing & QA (30 min)
- [ ] Test author page rendering for all authors
- [ ] Test author link navigation
- [ ] Test mobile responsiveness
- [ ] Verify SEO metadata
- [ ] Check build performance
- [ ] Test 404 handling for invalid author slugs

### Phase 2: Enhanced Author Profiles - 1-2 days (Optional)

#### Step 1: CMS Configuration (30 min)
- [ ] Create `content/authors/` directory
- [ ] Add authors collection to `public/admin/config.yml`
- [ ] Create initial author profile: `michael-t-dugan.md`
- [ ] Add author avatar to uploads directory

#### Step 2: Author Profile Functions (45 min)
- [ ] Add `getAuthorProfile()` to `src/lib/content.ts`
- [ ] Add `getAuthorProfiles()` to `src/lib/content.ts`
- [ ] Add `Author` TypeScript interface
- [ ] Update `getPostsByAuthor()` to merge profile data

#### Step 3: Author Profile Component (2 hours)
- [ ] Create `src/components/AuthorProfile.tsx`
- [ ] Implement avatar display with fallback
- [ ] Add bio rendering (markdown support)
- [ ] Add social media icon links
- [ ] Build 3 variants: full, compact, sidebar
- [ ] Style with Tailwind matching design system

#### Step 4: Enhanced Author Page (2 hours)
- [ ] Update `src/app/blog/author/[authorSlug]/page.tsx`
- [ ] Add author profile header section
- [ ] Integrate `AuthorProfile` component
- [ ] Add structured data (Schema.org)
- [ ] Enhance SEO with author metadata
- [ ] Add social sharing meta tags

#### Step 5: Blog Post Integration (1 hour)
- [ ] Add "About the Author" card to `src/app/blog/[slug]/page.tsx`
- [ ] Use compact variant of `AuthorProfile`
- [ ] Position below article content, above related posts
- [ ] Make card design match article style

#### Step 6: Testing & QA (1 hour)
- [ ] Test all author profile pages
- [ ] Test CMS author creation workflow
- [ ] Test author profile updates
- [ ] Verify image uploads work
- [ ] Test social media links
- [ ] Check mobile responsiveness
- [ ] Validate structured data with Google

## Dependencies

### Required
- None (uses existing Next.js, React, Tailwind setup)

### Optional (Phase 2)
- `react-icons` or `@tabler/icons-react` (already installed) - For social media icons
- `remark-html` (already installed) - For rendering author bio markdown

## Risks & Mitigations

### Risk 1: Author Name Changes
**Issue:** If author names change in existing posts, links break
**Mitigation:**
- Use slug field in Phase 2 author profiles
- Implement slug redirects if needed
- Document author naming conventions

### Risk 2: Build Performance
**Issue:** Many authors could slow build times
**Mitigation:**
- Static generation is fast for <50 authors
- Consider ISR (Incremental Static Regeneration) if scaling beyond 50 authors
- Monitor build times and optimize if needed

### Risk 3: Data Consistency
**Issue:** Author names might have typos or variations
**Mitigation:**
- Phase 2: Link blog posts to author slugs, not names
- Add CMS validation for author field
- Create author migration script if needed

### Risk 4: SEO Duplication
**Issue:** Author pages might compete with blog listing for keywords
**Mitigation:**
- Use distinct page titles and descriptions
- Add "noindex" to author pages if needed (unlikely)
- Canonical URLs properly configured

## Open Questions

1. **Author Attribution Model**
   - Q: Will posts ever have multiple authors?
   - A: Out of scope for now (single author per post)

2. **Historical Authors**
   - Q: What happens to posts if an author leaves?
   - A: Author profile remains, marked as "Former Author" or similar

3. **Guest Authors**
   - Q: How to handle one-time guest contributors?
   - A: Same workflow, just won't have many posts

4. **Author Display Name vs. Profile Name**
   - Q: Should we support different display names?
   - A: Phase 1: No. Phase 2: Could add "displayName" field

5. **Author Page Pagination**
   - Q: Do we paginate if author has 50+ posts?
   - A: Not needed initially (unlikely scenario)

## Future Enhancements

1. **Author RSS Feeds** - Per-author RSS/Atom feeds
2. **Author Following** - Email subscriptions for specific authors
3. **Author Analytics** - View counts, engagement metrics per author
4. **Co-Authorship** - Support multiple authors per post
5. **Author Comparison** - Side-by-side author stats
6. **Author Search** - Dedicated author search/directory
7. **Guest Author Workflow** - Streamlined process for guest posts

## Acceptance Criteria

### Phase 1 (MVP)
- [ ] Author archive pages render correctly for all authors
- [ ] Author names are clickable on blog listing and post pages
- [ ] Clicking author links navigates to author archive
- [ ] Author archive shows correct filtered posts
- [ ] Page titles and metadata are SEO-optimized
- [ ] Mobile responsive design matches blog design
- [ ] Build process completes without errors
- [ ] No console errors or warnings
- [ ] 404 page shown for invalid author slugs

### Phase 2 (Enhanced Profiles)
- [ ] Author profiles editable via Decap CMS
- [ ] Author avatars display correctly
- [ ] Author bios render with markdown formatting
- [ ] Social media links work and open in new tabs
- [ ] Author profile component reusable across pages
- [ ] "About the Author" card appears on blog posts
- [ ] Structured data validates in Google Rich Results Test
- [ ] All images optimized and loading efficiently

## Appendix

### Example URLs

**Phase 1:**
- `/blog/author/michael-t-dugan` - Michael T Dugan's posts

**Phase 2:**
- Same as Phase 1, enhanced with profile data

### Example Author Profile (Phase 2)

```markdown
---
name: "Michael T Dugan"
slug: "michael-t-dugan"
bio: "Michael T Dugan is an author, coach, and creator of the Turning Snowflakes Into Diamonds system. With over a decade of experience helping high-achievers master pressure and unlock their potential, Michael combines neuroscience, embodied practices, and transformational coaching to guide leaders through their most challenging moments."
avatar: "/uploads/authors/michael-dugan.jpg"
title: "Author & Transformation Coach"
social:
  twitter: "michaeltdugan"
  linkedin: "michaeltdugan"
  website: "https://michaeltdugan.com"
published: true
---

# Extended Bio

Michael's work focuses on the intersection of nervous system regulation, identity transformation, and high performance. His Adaptive Resonance Training (ART) protocols help leaders move from burnout to breakthrough without sacrificing who they are.

## Expertise
- Nervous system regulation
- Identity transformation
- Leadership development
- Embodied practices

## Background
- 10+ years coaching executives and entrepreneurs
- Creator of the Diamond Sprint program
- Author of "Turning Snowflakes Into Diamonds"
```

### Related Documentation
- [Blog System Documentation](../../guides/cms-setup.md)
- [Content Management Guide](../../features/features-overview.md)
- [Decap CMS Configuration](../../guides/cms-setup.md)

---

**Document Version:** 1.0
**Last Review:** 2025-10-16
**Next Review:** After Phase 1 completion
