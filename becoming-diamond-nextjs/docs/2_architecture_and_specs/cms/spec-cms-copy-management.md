# CMS-Managed Website Copy - Complexity Analysis

**Created:** 2025-01-18
**Status:** Analysis
**Priority:** Medium
**Estimated Total Effort:** 16-24 hours

## Executive Summary

This document analyzes the complexity, risks, and considerations for migrating hardcoded website copy from the public-facing pages into Decap CMS for client-managed content updates.

**Current State:** All marketing copy (hero text, features, CTAs, testimonials) is hardcoded in React components
**Proposed State:** Marketing copy managed through Decap CMS, editable by client without developer intervention

**Key Finding:** High-value feature with moderate complexity. Recommend phased implementation starting with highest-impact, lowest-risk content.

---

## Table of Contents

1. [Current Architecture Analysis](#current-architecture-analysis)
2. [Content Element Inventory](#content-element-inventory)
3. [Complexity Assessment by Element Type](#complexity-assessment-by-element-type)
4. [Implementation Approaches](#implementation-approaches)
5. [Risk Analysis](#risk-analysis)
6. [Developer Considerations](#developer-considerations)
7. [Client Considerations](#client-considerations)
8. [Recommended Implementation Plan](#recommended-implementation-plan)
9. [Cost-Benefit Analysis](#cost-benefit-analysis)
10. [Appendix: Technical Examples](#appendix-technical-examples)

---

## Current Architecture Analysis

### Existing CMS Setup

**✅ Already Implemented:**
- Decap CMS configured with GitHub backend
- Authentication via GitHub OAuth
- Content API (`src/lib/content.ts`) for fetching markdown
- Collections: `blog`, `sprint`, `pages`, `settings`
- Markdown-to-HTML conversion with remark

**Current CMS Usage:**
```yaml
# public/admin/config.yml
collections:
  - name: "blog"              # ✅ Active
  - name: "sprint"            # ✅ Active
  - name: "pages"             # ⚠️  Static pages only (privacy, terms)
  - name: "settings"          # ✅ Active (YAML config)
```

### Current Public Pages

| Page | File | Lines | Content Elements | Hardcoded? |
|------|------|-------|------------------|------------|
| Landing | `src/app/page.tsx` | 515 | Hero, Features, Timeline, Testimonials, Globe section | ✅ Yes |
| Book | `src/app/book/page.tsx` | ~300 | Hero, Benefits, Sample, Purchase CTA | ✅ Yes |
| Collective | `src/app/collective/page.tsx` | ~250 | Hero, Features, Pricing, CTA | ✅ Yes |
| Program | `src/app/program/page.tsx` | ~200 | Overview, Phases, Benefits | ✅ Yes |

**Total LOC with Hardcoded Copy:** ~1,265 lines

---

## Content Element Inventory

### Landing Page (`src/app/page.tsx`)

#### Hero Section
```typescript
// Current: Hardcoded
<h1>Transform Your Diamond Journey</h1>
<p>Become the Diamond You're Meant to Be</p>
<button>Start Your Journey</button>
```

**Elements:**
- Main headline (1 line, 4-6 words)
- Subheadline (1 line, 8-12 words)
- CTA button text (1-3 words)
- Optional: Supporting paragraph (2-3 sentences)

**Complexity:** ⭐⭐☆☆☆ Low
**Change Frequency:** Medium (quarterly)
**Client Value:** ⭐⭐⭐⭐⭐ Critical

---

#### Features/Benefits Grid (BentoGrid)
```typescript
// Current: Hardcoded array of objects
const features = [
  {
    title: "30-Day Diamond Sprint",
    description: "Transform in 30 days...",
    icon: IconRocket,
  },
  // ... 5 more items
];
```

**Elements:**
- Feature title (3-6 words each)
- Feature description (1-2 sentences each)
- Icon identifier (technical, not CMS-managed)
- 6 total features

**Complexity:** ⭐⭐⭐☆☆ Medium
**Change Frequency:** Low (semi-annually)
**Client Value:** ⭐⭐⭐⭐☆ High

---

#### Timeline/Journey Section
```typescript
const timelineData = [
  {
    title: "Foundation",
    content: "Week 1-2: Build your base...",
  },
  // ... 3 more phases
];
```

**Elements:**
- Phase title (1-2 words)
- Phase description (2-3 sentences)
- Duration indicator (e.g., "Week 1-2")
- 4 total phases

**Complexity:** ⭐⭐⭐☆☆ Medium
**Change Frequency:** Low (annually)
**Client Value:** ⭐⭐⭐☆☆ Medium

---

#### Testimonials
```typescript
const testimonials = [
  {
    quote: "This program changed my life...",
    name: "Sarah Johnson",
    title: "Entrepreneur",
  },
  // ... 4 more testimonials
];
```

**Elements:**
- Quote text (2-4 sentences)
- Author name
- Author title/role
- Optional: Author image URL
- 5 total testimonials

**Complexity:** ⭐⭐☆☆☆ Low
**Change Frequency:** High (monthly)
**Client Value:** ⭐⭐⭐⭐⭐ Critical

---

#### Globe/World Section
```typescript
<h2>Join a Global Community</h2>
<p>Connect with diamond seekers worldwide...</p>
```

**Elements:**
- Section heading (4-8 words)
- Section description (1-2 paragraphs)

**Complexity:** ⭐☆☆☆☆ Very Low
**Change Frequency:** Very Low (rarely)
**Client Value:** ⭐⭐☆☆☆ Low

---

### Book Page (`src/app/book/page.tsx`)

#### Hero Section
- Book title
- Subtitle
- Author name
- Cover image URL
- Purchase CTA text
- Price display

**Complexity:** ⭐⭐☆☆☆ Low
**Change Frequency:** Medium (per promotion)
**Client Value:** ⭐⭐⭐⭐⭐ Critical

---

#### Benefits Section
- Section headline
- 6-8 bullet points (each 1-2 sentences)
- Supporting paragraph

**Complexity:** ⭐⭐☆☆☆ Low
**Change Frequency:** Medium
**Client Value:** ⭐⭐⭐⭐☆ High

---

#### Sample Chapter/Preview
- Sample text preview (markdown format)
- "Read More" CTA

**Complexity:** ⭐⭐☆☆☆ Low (already markdown-capable)
**Change Frequency:** Low
**Client Value:** ⭐⭐⭐☆☆ Medium

---

### Collective Page (`src/app/collective/page.tsx`)

#### Hero + Features
- Program name
- Tagline
- Value proposition (2-3 paragraphs)
- Feature list (5-7 items)

**Complexity:** ⭐⭐☆☆☆ Low
**Change Frequency:** Medium
**Client Value:** ⭐⭐⭐⭐☆ High

---

#### Pricing Section
- Tier name (e.g., "Monthly", "Annual")
- Price
- Billing cycle text
- Feature list per tier
- CTA button text

**Complexity:** ⭐⭐⭐⭐☆ High (structured data)
**Change Frequency:** High (promotions)
**Client Value:** ⭐⭐⭐⭐⭐ Critical

**⚠️ Risk:** Pricing changes require careful validation

---

### Program Page (`src/app/program/page.tsx`)

#### Overview Section
- Program description (3-4 paragraphs)
- What's included list (8-10 items)

**Complexity:** ⭐⭐☆☆☆ Low
**Change Frequency:** Low
**Client Value:** ⭐⭐⭐☆☆ Medium

---

## Complexity Assessment by Element Type

### 1. Simple Text Fields

**Examples:** Headlines, subheadings, button text, single paragraphs

**CMS Implementation:**
```yaml
fields:
  - { label: "Hero Headline", name: "hero_headline", widget: "string" }
  - { label: "Hero Subheadline", name: "hero_subheadline", widget: "text" }
  - { label: "CTA Button Text", name: "cta_text", widget: "string" }
```

**Fetching:**
```typescript
const pageContent = await getContentBySlug('pages', 'landing');
const headline = pageContent.frontmatter.hero_headline;
```

| Metric | Rating | Notes |
|--------|--------|-------|
| **Complexity** | ⭐☆☆☆☆ | Very straightforward |
| **Dev Effort** | 30 min per field | Define field, update component |
| **Client Learning Curve** | ⭐☆☆☆☆ | Simple text input |
| **Risk** | Very Low | Hard to break |
| **Maintenance** | Very Low | Minimal ongoing work |

**Recommendation:** ✅ **Implement First** - Quick wins, high value

---

### 2. Rich Text / Markdown Fields

**Examples:** Long-form descriptions, benefits sections, feature explanations

**CMS Implementation:**
```yaml
fields:
  - { label: "Program Description", name: "description", widget: "markdown" }
```

**Fetching:**
```typescript
const pageContent = await getContentBySlug('pages', 'landing');
const descriptionHtml = pageContent.content; // Already converted to HTML
```

| Metric | Rating | Notes |
|--------|--------|-------|
| **Complexity** | ⭐⭐☆☆☆ | Markdown parser already in place |
| **Dev Effort** | 20 min per field | Mostly configuration |
| **Client Learning Curve** | ⭐⭐☆☆☆ | Requires markdown knowledge |
| **Risk** | Low | Markdown errors won't crash site |
| **Maintenance** | Low | Stable implementation |

**Recommendation:** ✅ **Implement Early** - Leverage existing markdown infrastructure

---

### 3. Repeatable List Items

**Examples:** Features grid, benefits lists, timeline phases

**CMS Implementation:**
```yaml
fields:
  - label: "Features"
    name: "features"
    widget: "list"
    fields:
      - { label: "Title", name: "title", widget: "string" }
      - { label: "Description", name: "description", widget: "text" }
      - { label: "Icon", name: "icon", widget: "select", options: ["rocket", "diamond", "star"] }
```

**Fetching:**
```typescript
const pageContent = await getContentBySlug('pages', 'landing');
const features = pageContent.frontmatter.features as Feature[];
// features is typed array of objects
```

| Metric | Rating | Notes |
|--------|--------|-------|
| **Complexity** | ⭐⭐⭐☆☆ | Requires list widget, type definitions |
| **Dev Effort** | 1-2 hours per list | Schema + component integration |
| **Client Learning Curve** | ⭐⭐⭐☆☆ | Add/remove/reorder items |
| **Risk** | Medium | Empty lists could break layout |
| **Maintenance** | Medium | Schema changes require dev work |

**Recommendation:** ⚠️ **Implement Mid-Phase** - More complex but high value

**Considerations:**
- Need default values to prevent broken layouts
- Icon selection limited to predefined set
- Validation: min/max items (e.g., "must have 3-6 features")

---

### 4. Structured Data (Testimonials, Pricing)

**Examples:** Testimonials with author info, pricing tiers

**CMS Implementation:**
```yaml
fields:
  - label: "Testimonials"
    name: "testimonials"
    widget: "list"
    fields:
      - { label: "Quote", name: "quote", widget: "text" }
      - { label: "Author Name", name: "name", widget: "string" }
      - { label: "Author Title", name: "title", widget: "string" }
      - { label: "Author Image", name: "image", widget: "image", required: false }
```

**Fetching:**
```typescript
interface Testimonial {
  quote: string;
  name: string;
  title: string;
  image?: string;
}

const testimonials = pageContent.frontmatter.testimonials as Testimonial[];
```

| Metric | Rating | Notes |
|--------|--------|-------|
| **Complexity** | ⭐⭐⭐☆☆ | Multiple nested fields |
| **Dev Effort** | 2-3 hours per structure | Complex schema, type safety |
| **Client Learning Curve** | ⭐⭐⭐⭐☆ | Many fields to manage |
| **Risk** | Medium-High | Missing required fields breaks UI |
| **Maintenance** | Medium-High | Schema evolution requires care |

**Recommendation:** ⚠️ **Implement Mid-Phase** - High value but needs careful validation

**Considerations:**
- Optional vs required fields strategy
- Image upload handling (media library)
- Field validation (e.g., quote max length)

---

### 5. Pricing Data

**Examples:** Pricing tiers, feature comparisons

**CMS Implementation:**
```yaml
fields:
  - label: "Pricing Tiers"
    name: "pricing"
    widget: "list"
    fields:
      - { label: "Tier Name", name: "name", widget: "string" }
      - { label: "Price", name: "price", widget: "number" }
      - { label: "Currency", name: "currency", widget: "string", default: "USD" }
      - { label: "Billing Cycle", name: "cycle", widget: "select", options: ["monthly", "annual"] }
      - { label: "Features", name: "features", widget: "list", field: { label: "Feature", name: "feature", widget: "string" } }
      - { label: "CTA Text", name: "cta_text", widget: "string" }
      - { label: "Stripe Price ID", name: "stripe_price_id", widget: "string" }
```

**Fetching:**
```typescript
interface PricingTier {
  name: string;
  price: number;
  currency: string;
  cycle: 'monthly' | 'annual';
  features: string[];
  cta_text: string;
  stripe_price_id: string;
}

const pricing = pageContent.frontmatter.pricing as PricingTier[];
```

| Metric | Rating | Notes |
|--------|--------|-------|
| **Complexity** | ⭐⭐⭐⭐☆ | Deeply nested, business-critical |
| **Dev Effort** | 4-6 hours | Schema + validation + testing |
| **Client Learning Curve** | ⭐⭐⭐⭐⭐ | Complex, many fields |
| **Risk** | **HIGH** | Incorrect pricing = revenue loss |
| **Maintenance** | High | Requires ongoing validation |

**Recommendation:** 🔴 **Implement Last or Consider Alternatives**

**⚠️ Critical Considerations:**
- **Revenue Risk:** Wrong price could cost money
- **Stripe Integration:** Must match Stripe Price IDs exactly
- **Validation:** Need number validation, min/max checks
- **Alternative Approach:** Keep pricing in code, only allow copy/CTA changes

**Recommended Compromise:**
```yaml
# Only expose safe copy fields, keep pricing logic in code
fields:
  - { label: "Pricing Headline", name: "pricing_headline", widget: "string" }
  - { label: "Pricing Description", name: "pricing_description", widget: "text" }
  - { label: "CTA Button Text", name: "pricing_cta", widget: "string" }
  # Price values stay in code for safety
```

---

### 6. Image/Media Management

**Examples:** Hero images, book cover, testimonial avatars

**CMS Implementation:**
```yaml
fields:
  - { label: "Hero Image", name: "hero_image", widget: "image" }
  - { label: "Image Alt Text", name: "hero_image_alt", widget: "string" }
```

**Fetching:**
```typescript
const heroImage = pageContent.frontmatter.hero_image as string;
// Returns: /uploads/hero-image.jpg
```

| Metric | Rating | Notes |
|--------|--------|-------|
| **Complexity** | ⭐⭐⭐☆☆ | Media library integration |
| **Dev Effort** | 30 min per image | Mostly config |
| **Client Learning Curve** | ⭐⭐☆☆☆ | Drag-and-drop upload |
| **Risk** | Medium | Large images affect performance |
| **Maintenance** | Medium | Image optimization needed |

**Recommendation:** ✅ **Implement Mid-Phase** - Good UX, manageable risk

**Considerations:**
- **Image Size Validation:** Limit file size (e.g., max 2MB)
- **Format Restriction:** Only allow JPG, PNG, WebP
- **Alt Text Required:** Accessibility requirement
- **Performance:** May need image optimization pipeline
- **Storage:** Images stored in Git (increases repo size)

**Alternative Approach:**
- Use external CDN (Cloudinary, Bunny CDN)
- Store only URLs in CMS
- Lower Git repo bloat

---

## Implementation Approaches

### Approach A: Monolithic Page Content Model

**Structure:** One CMS collection per page, all content in frontmatter

```yaml
# config.yml
collections:
  - name: "landing_page"
    label: "Landing Page"
    files:
      - label: "Landing Page Content"
        name: "landing"
        file: "content/pages/landing.md"
        fields:
          - { label: "Hero Headline", name: "hero_headline", widget: "string" }
          - { label: "Hero Subheadline", name: "hero_subheadline", widget: "text" }
          # ... 50+ more fields
```

**Pros:**
- ✅ All page content in one place
- ✅ Single API call to fetch all content
- ✅ Easy to see full page structure

**Cons:**
- ❌ Very long CMS edit form (50+ fields)
- ❌ Overwhelming for client
- ❌ Hard to find specific content to edit
- ❌ All-or-nothing: must load entire page config

**Complexity:** ⭐⭐⭐⭐☆ High (maintenance burden)
**Recommendation:** ❌ **Not Recommended** - Poor UX for client

---

### Approach B: Section-Based Content Model

**Structure:** Separate CMS collections for each major section

```yaml
collections:
  - name: "landing_hero"
    label: "Landing Page - Hero"
    file: "content/landing/hero.md"
    fields:
      - { label: "Headline", name: "headline", widget: "string" }
      # ... 5-10 hero-specific fields

  - name: "landing_features"
    label: "Landing Page - Features"
    file: "content/landing/features.md"
    fields:
      - label: "Features List"
        name: "features"
        widget: "list"
        # ... feature fields

  - name: "landing_testimonials"
    label: "Landing Page - Testimonials"
    # ... testimonial fields
```

**Pros:**
- ✅ Focused editing experience (5-10 fields per section)
- ✅ Client can find what they need easily
- ✅ Can load sections independently (performance)
- ✅ Easier to add new sections without disrupting existing content

**Cons:**
- ⚠️ More API calls needed (multiple `getContentBySlug` calls)
- ⚠️ More CMS configuration to maintain
- ⚠️ Client sees many menu items in CMS

**Complexity:** ⭐⭐⭐☆☆ Medium
**Recommendation:** ✅ **Recommended** - Best balance of UX and maintainability

---

### Approach C: Hybrid Content Model

**Structure:** Simple fields in frontmatter, complex content in markdown body

```yaml
collections:
  - name: "landing_page"
    file: "content/pages/landing.md"
    fields:
      # Simple fields in frontmatter
      - { label: "Hero Headline", name: "hero_headline", widget: "string" }
      - { label: "CTA Text", name: "cta_text", widget: "string" }

      # Complex content in markdown body
      - label: "Body"
        name: "body"
        widget: "markdown"
        hint: "Use markdown for features, benefits, etc."
```

**Markdown Structure:**
```markdown
---
hero_headline: "Transform Your Diamond Journey"
cta_text: "Start Now"
---

## Features

### 30-Day Sprint
Transform in 30 days with our structured program...

### Expert Coaching
Get guidance from certified diamond coaches...
```

**Pros:**
- ✅ Simple CMS configuration
- ✅ Flexible for client (markdown is powerful)
- ✅ Easy to add new content sections

**Cons:**
- ❌ Client must learn markdown syntax
- ❌ Less structured (harder to enforce consistency)
- ❌ Need markdown parsing rules for specific sections
- ❌ Can't easily reorder sections via CMS UI

**Complexity:** ⭐⭐☆☆☆ Low (simple config) but ⭐⭐⭐☆☆ Medium (client learning curve)
**Recommendation:** ⚠️ **Consider for Text-Heavy Pages** - Good for program/about pages

---

### Approach D: Component-Based Content Model

**Structure:** Each reusable component gets its own content definition

```yaml
collections:
  - name: "components_hero"
    label: "Components - Hero Sections"
    folder: "content/components/heroes"
    create: true
    slug: "{{slug}}"
    fields:
      - { label: "Headline", name: "headline", widget: "string" }
      - { label: "Subheadline", name: "subheadline", widget: "text" }
      - { label: "Background Type", name: "bg_type", widget: "select", options: ["gradient", "image", "video"] }

  - name: "components_features"
    label: "Components - Feature Grids"
    # ... reusable feature grid definitions
```

**Usage:**
```yaml
# content/pages/landing.md frontmatter:
hero: "hero-landing-main"  # References components/heroes/hero-landing-main.md
features: "features-sprint"  # References components/features/features-sprint.md
```

**Pros:**
- ✅ Reusable content across pages
- ✅ Component library approach
- ✅ Easy A/B testing (swap component references)
- ✅ Content versioning (keep old versions)

**Cons:**
- ❌ Complex architecture (references to references)
- ❌ Harder for client to understand relationships
- ❌ More files to manage
- ❌ Overkill for single-use content

**Complexity:** ⭐⭐⭐⭐⭐ Very High
**Recommendation:** ❌ **Not Recommended for MVP** - Over-engineered for current needs

---

## Risk Analysis

### Technical Risks

#### Risk 1: Performance Degradation
**Likelihood:** Medium
**Impact:** Medium
**Mitigation:**
- Implement caching in content API (already exists)
- Use static generation where possible (landing page can be SSG)
- Monitor build times (currently <2 min)

**Code Example:**
```typescript
// Already implemented caching
const contentCache = new Map<string, ContentItem>();

export async function getContentBySlug(type: string, slug: string) {
  const cacheKey = `${type}-${slug}`;
  if (contentCache.has(cacheKey)) {
    return contentCache.get(cacheKey)!;
  }
  // ... fetch and cache
}
```

---

#### Risk 2: Build Failures from Invalid Content
**Likelihood:** High
**Impact:** High (site won't deploy)
**Mitigation:**
- Add content validation in build process
- Implement CMS preview mode
- Use TypeScript interfaces for content shape
- Add CI checks before deployment

**Example Validation:**
```typescript
// src/lib/content-validator.ts
export function validatePageContent(content: unknown): PageContent {
  if (!content || typeof content !== 'object') {
    throw new Error('Invalid page content');
  }

  const page = content as Partial<PageContent>;

  // Required fields
  if (!page.hero_headline || page.hero_headline.length < 5) {
    throw new Error('Hero headline required (min 5 chars)');
  }

  // Length limits
  if (page.hero_headline.length > 100) {
    throw new Error('Hero headline too long (max 100 chars)');
  }

  return page as PageContent;
}
```

---

#### Risk 3: Breaking Layout with Missing/Extra Content
**Likelihood:** High
**Impact:** Medium
**Mitigation:**
- Always provide default values
- Use optional chaining in components
- Add visual indicators for missing content in dev mode

**Example:**
```typescript
// Component with safe defaults
export function HeroSection({ content }: { content?: HeroContent }) {
  const headline = content?.hero_headline || 'Transform Your Diamond Journey';
  const subheadline = content?.hero_subheadline || 'Start your journey today';

  return (
    <div>
      <h1>{headline}</h1>
      <p>{subheadline}</p>
      {!content && process.env.NODE_ENV === 'development' && (
        <div className="warning">⚠️ Using default content</div>
      )}
    </div>
  );
}
```

---

### Business Risks

#### Risk 4: Accidental Pricing Changes
**Likelihood:** Medium
**Impact:** **CRITICAL** (revenue loss)
**Mitigation:**
- **Do NOT put pricing numbers in CMS** (keep in code)
- Only expose pricing copy/descriptions in CMS
- Add approval workflow for pricing changes
- Implement rollback mechanism

**Recommended Approach:**
```typescript
// Keep pricing in code
const PRICING_TIERS = {
  monthly: {
    price: 49,
    stripe_price_id: 'price_xxx',
  },
  annual: {
    price: 490,
    stripe_price_id: 'price_yyy',
  },
} as const;

// Only CMS-managed copy
interface PricingCopy {
  headline: string;
  monthly_description: string;
  annual_description: string;
  cta_text: string;
}
```

---

#### Risk 5: Loss of Design Consistency
**Likelihood:** High
**Impact:** Medium (brand damage)
**Mitigation:**
- Provide content guidelines in CMS
- Set character limits on fields
- Use select widgets instead of free text where possible
- Regular content audits

**Example CMS Hints:**
```yaml
fields:
  - label: "Hero Headline"
    name: "hero_headline"
    widget: "string"
    hint: "Keep it short and punchy (4-8 words). Focus on transformation."
    pattern: ['^.{10,80}$', "Must be 10-80 characters"]
```

---

### Operational Risks

#### Risk 6: Client Learning Curve
**Likelihood:** High
**Impact:** Medium (support burden)
**Mitigation:**
- Create video tutorials for CMS usage
- Provide written guide with screenshots
- Start with simple fields (headlines) before complex structures
- Offer initial handholding session

**Support Materials Needed:**
- CMS login guide (5 min video)
- "How to edit hero section" (3 min video)
- "How to add a testimonial" (5 min video)
- Troubleshooting guide (written)

**Estimated Training Time:** 1-2 hours total

---

#### Risk 7: Git Merge Conflicts
**Likelihood:** Low
**Impact:** Medium (deployment delays)
**Mitigation:**
- Client edits in CMS (separate branch)
- Enable "Editorial Workflow" in Decap CMS
- Review changes before merging
- Keep content files separate from code

**Editorial Workflow Config:**
```yaml
# public/admin/config.yml
publish_mode: editorial_workflow

# This creates a PR workflow:
# 1. Client makes changes (draft)
# 2. Client clicks "Set to Review"
# 3. Developer reviews PR in GitHub
# 4. Developer merges when safe
```

**Pros of Editorial Workflow:**
- ✅ Changes are reviewed before going live
- ✅ Can be rolled back easily
- ✅ Visible history of who changed what

**Cons:**
- ⚠️ Requires developer to merge PRs
- ⚠️ Delays content updates (not instant)

**Recommendation:** ✅ Enable for production, disable for staging/preview

---

## Developer Considerations

### Time Investment

| Phase | Task | Estimated Time |
|-------|------|----------------|
| **Phase 1: Foundation** | | |
| | Analyze current content | 2 hours |
| | Design CMS schema | 3 hours |
| | Create TypeScript interfaces | 2 hours |
| | Update content API if needed | 1 hour |
| **Phase 2: Simple Fields** | | |
| | Hero sections (4 pages) | 2 hours |
| | CTA buttons | 1 hour |
| | Section headings | 1 hour |
| | Testing & debugging | 2 hours |
| **Phase 3: Complex Structures** | | |
| | Features lists | 3 hours |
| | Testimonials | 3 hours |
| | Timeline/phases | 2 hours |
| | Testing & debugging | 3 hours |
| **Phase 4: Polish** | | |
| | Content validation | 3 hours |
| | Error handling | 2 hours |
| | CMS preview mode | 4 hours |
| | Documentation | 2 hours |
| **Total** | | **36 hours** |

**Optimistic:** 24 hours (if no issues)
**Realistic:** 36 hours (with normal debugging)
**Pessimistic:** 48 hours (if architectural changes needed)

---

### Maintenance Burden

**Ongoing Time Commitment:**
- **Client Support:** 1-2 hours/month initially, 30 min/month after ramp-up
- **Schema Updates:** 1 hour/quarter (as needs evolve)
- **Bug Fixes:** 2 hours/year (edge cases)
- **Content Audits:** 1 hour/quarter (check for stale content)

**Total Annual Maintenance:** ~12-15 hours/year

---

### Code Complexity Impact

**Before (Hardcoded):**
```typescript
// Simple, direct
export default function LandingPage() {
  return (
    <div>
      <h1>Transform Your Diamond Journey</h1>
      <p>Become the Diamond You're Meant to Be</p>
    </div>
  );
}
```

**After (CMS-Managed):**
```typescript
// Async, data fetching, error handling
export default async function LandingPage() {
  const content = await getContentBySlug('pages', 'landing');

  if (!content) {
    return <ErrorPage message="Content not found" />;
  }

  return (
    <div>
      <h1>{content.frontmatter.hero_headline}</h1>
      <p>{content.frontmatter.hero_subheadline}</p>
    </div>
  );
}
```

**Complexity Increase:**
- ⚠️ Server Components required (data fetching)
- ⚠️ Error handling needed
- ⚠️ TypeScript types for content shape
- ⚠️ Default values for missing content

**But Also Benefits:**
- ✅ Separation of concerns (content vs presentation)
- ✅ Easier to test (mock content objects)
- ✅ Reusable content across pages

---

### Testing Requirements

**New Testing Needs:**
1. **Content Validation Tests:**
   ```typescript
   describe('Landing Page Content', () => {
     it('should have valid hero content', async () => {
       const content = await getContentBySlug('pages', 'landing');
       expect(content.frontmatter.hero_headline).toBeDefined();
       expect(content.frontmatter.hero_headline.length).toBeGreaterThan(5);
     });
   });
   ```

2. **Component Tests with Mock Content:**
   ```typescript
   describe('HeroSection', () => {
     it('should render with CMS content', () => {
       const mockContent = { hero_headline: 'Test Headline' };
       render(<HeroSection content={mockContent} />);
       expect(screen.getByText('Test Headline')).toBeInTheDocument();
     });

     it('should render with default content when CMS fails', () => {
       render(<HeroSection content={undefined} />);
       expect(screen.getByText(/Transform Your Diamond Journey/i)).toBeInTheDocument();
     });
   });
   ```

3. **Integration Tests:**
   - CMS schema validation
   - Content API response shapes
   - Build success with various content states

**Testing Time:** +4 hours per implementation phase

---

## Client Considerations

### Learning Curve

**CMS Concepts to Learn:**
1. **Login & Authentication** (5 min)
   - GitHub OAuth
   - CMS dashboard navigation

2. **Basic Content Editing** (15 min)
   - Text fields
   - Rich text editor
   - Save vs Publish

3. **Advanced Features** (30 min)
   - List widgets (add/remove items)
   - Image uploads
   - Preview mode

4. **Workflow** (10 min)
   - Draft → Review → Publish
   - How changes deploy

**Total Training Time:** 1-2 hours

**Ease of Use Rating by Field Type:**
| Field Type | Ease | Client Confidence |
|------------|------|-------------------|
| Text fields | ⭐⭐⭐⭐⭐ Very Easy | High |
| Rich text/markdown | ⭐⭐⭐☆☆ Moderate | Medium |
| Lists | ⭐⭐⭐☆☆ Moderate | Medium |
| Images | ⭐⭐⭐⭐☆ Easy | High |
| Structured data | ⭐⭐☆☆☆ Challenging | Low |

---

### Value Proposition

**What Client Gains:**
1. ✅ **Independence:** Update copy without developer
2. ✅ **Speed:** Changes live in minutes, not days
3. ✅ **Control:** A/B test headlines and CTAs easily
4. ✅ **Cost Savings:** No developer fees for copy changes
5. ✅ **Flexibility:** Run promotions and campaigns dynamically

**What Client Gives Up:**
- ⚠️ Some flexibility in layout (structure is fixed)
- ⚠️ Need to learn CMS interface
- ⚠️ Responsibility for content quality

---

### Ongoing Responsibilities

**Client Must:**
1. **Review Content:** Check grammar, spelling, brand voice
2. **Test Changes:** Preview before publishing
3. **Monitor Impact:** Track how copy changes affect conversions
4. **Keep Content Fresh:** Regular updates to testimonials, features
5. **Manage Media:** Optimize images before upload

**Time Commitment:**
- **Initial Setup:** 2-3 hours (learning + populating content)
- **Ongoing:** 1-2 hours/month for updates

---

### Support Needs

**Common Client Questions:**
1. "How do I preview changes before publishing?"
2. "Can I undo a change?"
3. "Why isn't my change showing up?"
4. "How do I add a new testimonial?"
5. "The image won't upload - what's wrong?"

**Support Strategy:**
- **Self-Service:** Video tutorials + written guide (covers 80% of questions)
- **Async Support:** Email/Slack for non-urgent questions
- **Sync Support:** 30 min monthly check-in for complex issues

**Expected Support Volume:**
- **Month 1-2:** 3-5 questions/week
- **Month 3-6:** 1-2 questions/week
- **Month 6+:** 1-2 questions/month

---

## Recommended Implementation Plan

### Phase 0: Preparation (4 hours)
**Goals:** Understand scope, design architecture, plan rollout

**Tasks:**
1. Audit all public pages for content elements
2. Categorize by complexity (simple → complex)
3. Design CMS schema (section-based approach)
4. Create TypeScript interfaces
5. Set up content validation framework

**Deliverables:**
- Content inventory spreadsheet
- CMS schema document
- TypeScript interface definitions

---

### Phase 1: Quick Wins (8 hours)
**Goals:** Deliver value fast, build momentum, validate approach

**Implement:**
1. ✅ **Hero Headlines** (all pages)
   - Main headline
   - Subheadline
   - CTA button text
   - 4 pages × 3 fields = 12 fields

2. ✅ **Section Headings** (all pages)
   - Features heading
   - Benefits heading
   - Testimonials heading
   - ~8 additional fields

**Total:** 20 simple text fields across 4 pages

**Client Value:** ⭐⭐⭐⭐⭐ High - Most visible content
**Risk:** ⭐☆☆☆☆ Very Low - Hard to break
**ROI:** Excellent - Quick implementation, immediate value

**Success Criteria:**
- Client can update all hero sections independently
- Changes deploy successfully
- No layout breakage

---

### Phase 2: Structured Content (12 hours)
**Goals:** Enable richer content editing, maintain quality

**Implement:**
1. ✅ **Testimonials** (landing page)
   - List widget with quote, name, title
   - Image upload for avatars
   - 5 testimonials

2. ✅ **Features Grid** (landing page)
   - List widget with title, description
   - Icon selection (dropdown)
   - 6 features

3. ✅ **Timeline/Phases** (landing page)
   - List widget with phase title, description, duration
   - 4 phases

**Client Value:** ⭐⭐⭐⭐☆ High - Dynamic sections
**Risk:** ⭐⭐⭐☆☆ Medium - More complex, needs validation
**ROI:** Good - Higher complexity but valuable for marketing

**Success Criteria:**
- Client can add/remove/reorder testimonials
- Client can update feature descriptions
- No empty sections due to missing data

---

### Phase 3: Rich Content (8 hours)
**Goals:** Enable long-form content editing

**Implement:**
1. ✅ **Book Benefits Section**
   - Markdown editor
   - Bullet points + paragraphs

2. ✅ **Program Overview**
   - Markdown editor
   - Multi-paragraph descriptions

3. ✅ **Collective Value Proposition**
   - Markdown editor
   - Flexible formatting

**Client Value:** ⭐⭐⭐☆☆ Medium - Less frequent updates
**Risk:** ⭐⭐☆☆☆ Low - Markdown errors won't crash site
**ROI:** Moderate - Good for content-heavy pages

**Success Criteria:**
- Client comfortable with markdown basics
- Content renders correctly with formatting
- Images in markdown work

---

### Phase 4: Polish & Safety (4 hours)
**Goals:** Production-ready, prevent errors, build confidence

**Implement:**
1. ✅ **Content Validation**
   - Required field checks
   - Length limits
   - Format validation

2. ✅ **Error Handling**
   - Graceful fallbacks
   - Default content
   - Error messages in dev mode

3. ✅ **CMS Preview Mode**
   - Live preview of changes
   - Before/after comparison

4. ✅ **Documentation**
   - Video tutorials
   - Written guides
   - Troubleshooting tips

**Client Value:** ⭐⭐⭐⭐⭐ Critical - Confidence & safety
**Risk:** N/A - Risk mitigation phase
**ROI:** Excellent - Prevents costly mistakes

**Success Criteria:**
- Client can preview all changes before publishing
- Invalid content caught before deployment
- Client trained and comfortable

---

### Phase 5: Advanced (Optional, 8+ hours)
**Goals:** Power user features, A/B testing capabilities

**Implement (if needed):**
1. ⚠️ **Pricing Copy** (NOT pricing values)
   - Headline/description only
   - CTA text
   - Disclaimer text

2. ⚠️ **Image Management**
   - Media library
   - Image optimization
   - Alt text management

3. ⚠️ **Global Settings**
   - Site-wide CTAs
   - Contact information
   - Social media links

**Client Value:** ⭐⭐⭐☆☆ Medium - Nice to have
**Risk:** ⭐⭐⭐☆☆ Medium - More moving parts
**ROI:** Lower - Diminishing returns

**Recommendation:** Evaluate after Phase 4 success

---

### Timeline Summary

| Phase | Duration | Cumulative | Milestone |
|-------|----------|------------|-----------|
| Phase 0: Prep | 4 hours | 4 hours | Schema ready |
| Phase 1: Quick Wins | 8 hours | 12 hours | Hero sections CMS-managed |
| Phase 2: Structured | 12 hours | 24 hours | All landing content CMS-managed |
| Phase 3: Rich Content | 8 hours | 32 hours | All pages CMS-managed |
| Phase 4: Polish | 4 hours | 36 hours | Production-ready |
| Phase 5: Advanced | 8 hours | 44 hours | Optional enhancements |

**Recommended Scope:** Phases 0-4 (36 hours)
**Stretch Goal:** Phase 5 if budget allows

---

## Cost-Benefit Analysis

### Developer Investment

**One-Time Implementation:**
- Phase 0-4: 36 hours @ $150/hour = **$5,400**
- Phase 5 (optional): 8 hours @ $150/hour = **$1,200**

**Ongoing Maintenance:**
- 12-15 hours/year @ $150/hour = **$1,800-2,250/year**

**Total Year 1 Cost:** $7,200-7,650 (without Phase 5)

---

### Client Savings

**Current State (Hardcoded Copy):**
- Every copy change requires developer
- Average 30 min per change × $150/hour = **$75 per change**
- Estimated changes per month: 4-6
- Monthly cost: **$300-450**
- Annual cost: **$3,600-5,400**

**CMS-Managed Copy:**
- Most changes done by client (no developer)
- Developer only needed for:
  - Schema changes (1-2x per year)
  - Bug fixes (rare)
  - New content types (as needed)
- Annual cost: **$1,800-2,250** (maintenance only)

**Annual Savings:** $1,800-3,150 (30-45% reduction)

---

### ROI Calculation

**Break-Even Point:**
- Implementation cost: $5,400
- Monthly savings: $150-300 (50% reduction in copy change costs)
- Break-even: **18-36 months**

**But Consider Intangibles:**
- ✅ **Speed:** Changes in minutes vs days (faster time-to-market)
- ✅ **Autonomy:** Client control over messaging
- ✅ **Experimentation:** Easy A/B testing of copy
- ✅ **Marketing Agility:** Run campaigns dynamically
- ✅ **Reduced Friction:** No scheduling/coordination with developer

**True ROI:** Likely **12-18 months** when factoring in business value

---

### Value by Content Type

| Content Type | Change Frequency | Savings/Year | Implementation Cost | ROI Timeframe |
|--------------|------------------|--------------|---------------------|---------------|
| Hero Headlines | Monthly | $900 (12 changes) | $800 | 11 months |
| Testimonials | Bi-weekly | $1,800 (24 changes) | $1,500 | 10 months |
| Features | Quarterly | $300 (4 changes) | $1,200 | 48 months ⚠️ |
| CTAs | Weekly | $3,600 (48 changes) | $400 | 1 month ⭐ |
| Rich Content | Semi-annually | $150 (2 changes) | $1,200 | 96 months ⚠️ |

**Insight:**
- ✅ **High-ROI:** CTAs, testimonials, hero text (change frequently)
- ⚠️ **Low-ROI:** Features, rich content (change rarely)

**Strategic Recommendation:**
- Implement high-change-frequency content first (Phase 1-2)
- Evaluate Phase 3 based on actual usage patterns

---

## Recommendations

### Tier 1: MUST IMPLEMENT
**Content:** Hero sections, CTA buttons
**Effort:** 8 hours
**Value:** ⭐⭐⭐⭐⭐
**ROI:** Excellent (3-6 months break-even)

**Rationale:**
- Highest change frequency
- Most visible content
- Lowest complexity
- Quick win for client confidence

---

### Tier 2: SHOULD IMPLEMENT
**Content:** Testimonials, features grid
**Effort:** 12 hours
**Value:** ⭐⭐⭐⭐☆
**ROI:** Good (12-18 months break-even)

**Rationale:**
- Moderate change frequency
- High marketing value (social proof)
- Manageable complexity
- Enables experimentation

---

### Tier 3: CONSIDER IMPLEMENTING
**Content:** Rich text sections, program details
**Effort:** 8 hours
**Value:** ⭐⭐⭐☆☆
**ROI:** Moderate (24-36 months break-even)

**Rationale:**
- Low change frequency
- High initial setup value (populate once)
- Good for content-heavy pages
- Requires markdown knowledge

---

### Tier 4: DO NOT IMPLEMENT (YET)
**Content:** Pricing values, complex structured data
**Effort:** 8+ hours
**Value:** ⭐⭐☆☆☆ (high risk)
**ROI:** Poor or negative (risk of revenue loss)

**Rationale:**
- High business risk (pricing errors)
- Requires approval workflows
- Better kept in code for now
- Can revisit after 6-12 months of CMS maturity

---

## Decision Matrix

Use this matrix to evaluate each content element:

| Criteria | Weight | Score 1-5 | Weighted Score |
|----------|--------|-----------|----------------|
| **Change Frequency** | 30% | ? | |
| **Client Value** | 25% | ? | |
| **Implementation Complexity** | 20% | ? (inverted) | |
| **Risk Level** | 15% | ? (inverted) | |
| **Maintenance Burden** | 10% | ? (inverted) | |

**Scoring Guide:**
- Change Frequency: 1 = Yearly, 5 = Weekly
- Client Value: 1 = Nice to have, 5 = Critical
- Complexity: 1 = Very complex, 5 = Very simple
- Risk: 1 = High risk, 5 = Very low risk
- Maintenance: 1 = High burden, 5 = Very low burden

**Threshold:** Implement if weighted score ≥ 3.5

**Example: Hero Headline**
- Change Frequency: 4 (monthly) × 0.30 = 1.2
- Client Value: 5 (critical) × 0.25 = 1.25
- Complexity: 5 (very simple) × 0.20 = 1.0
- Risk: 5 (very low) × 0.15 = 0.75
- Maintenance: 5 (very low) × 0.10 = 0.5
- **Total: 4.7** ✅ Strong implement

**Example: Pricing Values**
- Change Frequency: 2 (semi-annually) × 0.30 = 0.6
- Client Value: 5 (critical) × 0.25 = 1.25
- Complexity: 2 (complex) × 0.20 = 0.4
- Risk: 1 (high risk) × 0.15 = 0.15
- Maintenance: 2 (high burden) × 0.10 = 0.2
- **Total: 2.6** ❌ Do not implement

---

## Appendix: Technical Examples

### Example 1: Simple Text Field Implementation

**Step 1: Add to CMS Config**
```yaml
# public/admin/config.yml
collections:
  - name: "landing_page"
    label: "Landing Page"
    files:
      - label: "Landing Page Content"
        name: "landing"
        file: "content/pages/landing.md"
        fields:
          - label: "Hero Section"
            name: "hero"
            widget: "object"
            fields:
              - { label: "Headline", name: "headline", widget: "string", hint: "4-8 words, focus on transformation" }
              - { label: "Subheadline", name: "subheadline", widget: "text", hint: "8-12 words, supporting benefit" }
              - { label: "CTA Text", name: "cta_text", widget: "string", default: "Start Your Journey" }
```

**Step 2: Create Content File**
```markdown
<!-- content/pages/landing.md -->
---
hero:
  headline: "Transform Your Diamond Journey"
  subheadline: "Become the Diamond You're Meant to Be"
  cta_text: "Start Your Journey"
---

Additional page content here...
```

**Step 3: Define TypeScript Interface**
```typescript
// src/types/content.ts
export interface HeroContent {
  headline: string;
  subheadline: string;
  cta_text: string;
}

export interface LandingPageContent {
  hero: HeroContent;
  // ... other sections
}
```

**Step 4: Fetch in Component**
```typescript
// src/app/page.tsx
import { getContentBySlug } from '@/lib/content';
import type { LandingPageContent } from '@/types/content';

export default async function LandingPage() {
  const content = await getContentBySlug('pages', 'landing');
  const pageContent = content?.frontmatter as LandingPageContent;

  // Fallback to defaults if CMS fails
  const hero = pageContent?.hero || {
    headline: 'Transform Your Diamond Journey',
    subheadline: 'Become the Diamond You're Meant to Be',
    cta_text: 'Start Your Journey',
  };

  return (
    <section className="hero">
      <h1>{hero.headline}</h1>
      <p>{hero.subheadline}</p>
      <button>{hero.cta_text}</button>
    </section>
  );
}
```

**Time to Implement:** 30 minutes

---

### Example 2: List Widget (Testimonials)

**Step 1: CMS Config**
```yaml
fields:
  - label: "Testimonials"
    name: "testimonials"
    widget: "list"
    summary: "{{fields.name}} - {{fields.title}}"
    min: 3
    max: 10
    fields:
      - { label: "Quote", name: "quote", widget: "text", hint: "2-4 sentences" }
      - { label: "Author Name", name: "name", widget: "string" }
      - { label: "Author Title", name: "title", widget: "string", hint: "Job title or role" }
      - { label: "Author Image", name: "image", widget: "image", required: false, hint: "Square image, 400×400px recommended" }
```

**Step 2: Content**
```markdown
---
testimonials:
  - quote: "This program completely transformed my approach to personal development. The 30-day sprint gave me clarity and momentum I never had before."
    name: "Sarah Johnson"
    title: "Entrepreneur & Life Coach"
    image: "/uploads/testimonials/sarah-johnson.jpg"

  - quote: "I was skeptical at first, but the results speak for themselves. My confidence has skyrocketed, and I'm finally living authentically."
    name: "Michael Chen"
    title: "Software Engineer"
    image: "/uploads/testimonials/michael-chen.jpg"
---
```

**Step 3: TypeScript**
```typescript
export interface Testimonial {
  quote: string;
  name: string;
  title: string;
  image?: string;
}

export interface LandingPageContent {
  testimonials: Testimonial[];
}
```

**Step 4: Component**
```typescript
import { getContentBySlug } from '@/lib/content';
import type { Testimonial } from '@/types/content';

export default async function TestimonialsSection() {
  const content = await getContentBySlug('pages', 'landing');
  const testimonials = (content?.frontmatter.testimonials as Testimonial[]) || [];

  // Ensure minimum content
  if (testimonials.length === 0) {
    console.warn('No testimonials found, using defaults');
    // Return default testimonials or empty state
  }

  return (
    <section className="testimonials">
      <h2>What Our Community Says</h2>
      <div className="testimonials-grid">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="testimonial-card">
            {testimonial.image && (
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="author-image"
              />
            )}
            <blockquote>{testimonial.quote}</blockquote>
            <div className="author">
              <strong>{testimonial.name}</strong>
              <span>{testimonial.title}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

**Time to Implement:** 2-3 hours

---

### Example 3: Content Validation

```typescript
// src/lib/content-validator.ts
import type { LandingPageContent, Testimonial } from '@/types/content';

export class ContentValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ContentValidationError';
  }
}

export function validateHeroContent(hero: unknown): void {
  if (!hero || typeof hero !== 'object') {
    throw new ContentValidationError('Hero section is missing');
  }

  const h = hero as Record<string, unknown>;

  // Headline validation
  if (!h.headline || typeof h.headline !== 'string') {
    throw new ContentValidationError('Hero headline is required');
  }
  if (h.headline.length < 10) {
    throw new ContentValidationError('Hero headline too short (min 10 chars)');
  }
  if (h.headline.length > 100) {
    throw new ContentValidationError('Hero headline too long (max 100 chars)');
  }

  // Subheadline validation
  if (!h.subheadline || typeof h.subheadline !== 'string') {
    throw new ContentValidationError('Hero subheadline is required');
  }
  if (h.subheadline.length > 200) {
    throw new ContentValidationError('Hero subheadline too long (max 200 chars)');
  }

  // CTA text validation
  if (h.cta_text && typeof h.cta_text === 'string' && h.cta_text.length > 30) {
    throw new ContentValidationError('CTA text too long (max 30 chars)');
  }
}

export function validateTestimonials(testimonials: unknown): void {
  if (!Array.isArray(testimonials)) {
    throw new ContentValidationError('Testimonials must be an array');
  }

  if (testimonials.length < 3) {
    throw new ContentValidationError('At least 3 testimonials required');
  }

  if (testimonials.length > 10) {
    throw new ContentValidationError('Maximum 10 testimonials allowed');
  }

  testimonials.forEach((t, index) => {
    if (!t.quote || typeof t.quote !== 'string') {
      throw new ContentValidationError(`Testimonial ${index + 1}: Quote is required`);
    }
    if (t.quote.length < 50) {
      throw new ContentValidationError(`Testimonial ${index + 1}: Quote too short (min 50 chars)`);
    }
    if (t.quote.length > 500) {
      throw new ContentValidationError(`Testimonial ${index + 1}: Quote too long (max 500 chars)`);
    }

    if (!t.name || typeof t.name !== 'string') {
      throw new ContentValidationError(`Testimonial ${index + 1}: Author name is required`);
    }

    if (!t.title || typeof t.title !== 'string') {
      throw new ContentValidationError(`Testimonial ${index + 1}: Author title is required`);
    }
  });
}

export function validateLandingPageContent(content: unknown): LandingPageContent {
  if (!content || typeof content !== 'object') {
    throw new ContentValidationError('Invalid landing page content');
  }

  const page = content as Partial<LandingPageContent>;

  validateHeroContent(page.hero);
  validateTestimonials(page.testimonials);

  return page as LandingPageContent;
}

// Usage in build script or API route
async function buildPage() {
  try {
    const content = await getContentBySlug('pages', 'landing');
    const validated = validateLandingPageContent(content?.frontmatter);
    // Proceed with build
  } catch (error) {
    if (error instanceof ContentValidationError) {
      console.error('❌ Content validation failed:', error.message);
      process.exit(1); // Fail build
    }
    throw error;
  }
}
```

---

### Example 4: CMS Preview Configuration

```yaml
# public/admin/config.yml

# Enable preview
show_preview_links: true

# Preview templates
collections:
  - name: "landing_page"
    label: "Landing Page"
    files:
      - label: "Landing Page Content"
        name: "landing"
        file: "content/pages/landing.md"
        preview_path: "/"  # Preview at root URL
        fields:
          # ... fields
```

**Custom Preview Template:**
```typescript
// public/admin/preview-templates/landing-page-preview.js
const LandingPagePreview = ({ entry, widgetFor, getAsset }) => {
  const data = entry.getIn(['data']).toJS();
  const hero = data.hero || {};

  return (
    <div className="preview-container">
      <section className="hero-preview">
        <h1>{hero.headline || 'Headline'}</h1>
        <p>{hero.subheadline || 'Subheadline'}</p>
        <button>{hero.cta_text || 'CTA'}</button>
      </section>

      {data.testimonials && (
        <section className="testimonials-preview">
          {data.testimonials.map((t, i) => (
            <div key={i} className="testimonial">
              <blockquote>{t.quote}</blockquote>
              <strong>{t.name}</strong> - <span>{t.title}</span>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

CMS.registerPreviewTemplate('landing_page', LandingPagePreview);
```

---

## Conclusion

### Key Takeaways

1. **Feasibility:** ✅ Highly feasible with existing infrastructure (Decap CMS already configured)

2. **Complexity:** ⭐⭐⭐☆☆ Moderate overall
   - Simple fields: ⭐☆☆☆☆ Very easy
   - Structured content: ⭐⭐⭐☆☆ Medium
   - Business-critical data: ⭐⭐⭐⭐☆ Complex (avoid for now)

3. **Value:** ⭐⭐⭐⭐☆ High for frequently-changed content

4. **Risk:** ⭐⭐☆☆☆ Low-Medium with proper mitigation

5. **ROI:** 12-24 months break-even for full implementation, 3-6 months for high-value content only

### Final Recommendation

**✅ Proceed with Phased Implementation**

**Immediate Action Items:**
1. **Start with Phase 1** (hero sections, CTAs) - 8 hours
   - Lowest risk, highest impact
   - Proves concept to client
   - Quick wins build momentum

2. **Evaluate after 30 days:**
   - Is client using the CMS?
   - Any issues or confusion?
   - Ready for Phase 2?

3. **Phase 2 if successful** (testimonials, features) - 12 hours
   - More complex but high marketing value
   - Build on Phase 1 success

4. **Phase 3-4 as needed** (rich content, polish) - 12 hours
   - Only if client demonstrates comfort with CMS
   - Optional based on actual usage

**Do NOT Implement:**
- ❌ Pricing values in CMS (too risky)
- ❌ Complex structured data (wait 6 months)
- ❌ Full page layout control (out of scope)

**Total Recommended Investment:** 20-36 hours ($3,000-5,400)
**Expected Break-Even:** 12-18 months
**Client Independence:** High (80% of copy changes)

---

**Next Steps:**
1. Share this spec with client for feedback
2. Agree on Phase 1 scope
3. Schedule 2-hour kickoff (schema design + training plan)
4. Implement Phase 1 (1 week sprint)
5. Client UAT + training (1 week)
6. Evaluate and decide on Phase 2

---

**Document Version:** 1.0
**Last Updated:** 2025-01-18
**Author:** Claude Code
**Review Status:** Draft - Pending Client Review
