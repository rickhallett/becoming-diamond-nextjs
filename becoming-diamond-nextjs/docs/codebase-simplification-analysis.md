# Codebase Simplification Analysis

> Analysis of what code is needed vs removable for simplified MVP scope

**Date:** 2025-01-05
**Status:** Analysis Only - No Changes Made
**Backup Required:** Yes - Full branch backup before any removal

---

## Critical Decisions - FINALIZED

✅ **Video Delivery:** Keep Bunny Stream (already implemented)
✅ **Book Checkout:** Keep Stripe integration (checkout + webhooks)
✅ **Blog Management:** Keep Decap CMS admin
✅ **Email Provider:** Gmail SMTP (already configured)

---

## Scope Definition

### Required Features
1. **Home Page** - Marketing landing page
2. **Program Page** - Diamond Activation tiers
3. **Collective Page** - DiamondMind Immersion
4. **Insights Page** - Blog content display
5. **Members Portal** - Basic profile + 30-day sprint access
6. **Lead Gen** - Email capture from home page
7. **Book Page** - Book sales

### Features to Remove
- Course platform (complex course player)
- AI Chat (DiamondMindAI)
- News section (separate from blog)
- Individual offer detail pages
- ~~CMS admin interface (Decap CMS)~~ **KEEP - Decision made**
- ~~Video streaming infrastructure~~ **KEEP - Bunny Stream**
- Complex course progress tracking (keep sprint progress only)
- ~~Payment webhooks~~ **KEEP - Stripe integration**
- ~~OAuth flows~~ **KEEP - GitHub OAuth for CMS**
- Support ticketing
- Settings page
- Full profile management

---

## File-by-File Analysis

### ✅ KEEP - Core Configuration (8 files)

```
/auth.ts                           ✅ KEEP - Required for magic link auth
/next.config.ts                    ✅ KEEP - Framework config
/tailwind.config.ts                ✅ KEEP - Styles
/eslint.config.mjs                 ✅ KEEP - Linting
/tsconfig.json                     ✅ KEEP - TypeScript
/package.json                      ✅ KEEP - Dependencies (review & trim)
/postcss.config.mjs                ✅ KEEP - CSS processing
/.env.local                        ✅ KEEP - Environment vars
```

**Action:** Review package.json to remove unused dependencies after file removal.

---

## Source Code Analysis

### Type Definitions

```
/src/types/course.ts               ❌ REMOVE - Course platform not needed
/src/types/progress.ts             ⚠️  PARTIAL - Keep sprint progress only
```

**Keep from progress.ts:**
- Sprint-related types only
- Remove course progress tracking

---

### React Contexts

```
/src/contexts/UserContext.tsx      ✅ KEEP - User session needed
/src/contexts/CourseContext.tsx    ❌ REMOVE - No complex courses
/src/contexts/ChatContext.tsx      ❌ REMOVE - No AI chat
```

---

### Public Pages - KEEP (7 files)

```
/src/app/page.tsx                  ✅ KEEP - Home page
/src/app/layout.tsx                ✅ KEEP - Root layout
/src/app/providers.tsx             ⚠️  MODIFY - Remove CourseContext, ChatContext
/src/app/program/page.tsx          ✅ KEEP - Program page
/src/app/collective/page.tsx       ✅ KEEP - Collective page
/src/app/book/page.tsx             ✅ KEEP - Book sales
/src/app/book/success/page.tsx     ✅ KEEP - Book success page
```

---

### Blog Pages - KEEP (2 files)

```
/src/app/blog/page.tsx             ✅ KEEP - Blog index (rename to "Insights")
/src/app/blog/[slug]/page.tsx      ✅ KEEP - Individual blog posts
```

**Action:** Rename "Blog" to "Insights" in UI/navigation.

---

### Pages to REMOVE (14 files)

```
/src/app/pricing/page.tsx          ❌ REMOVE - Redundant with program page
/src/app/news/page.tsx             ❌ REMOVE - Not needed
/src/app/news/[slug]/page.tsx      ❌ REMOVE - Not needed

/src/app/offers/diamond-advantage/page.tsx          ❌ REMOVE
/src/app/offers/diamond-edge-mastery/page.tsx       ❌ REMOVE
/src/app/offers/pressure-room-one/page.tsx          ❌ REMOVE
```

**Justification:** Program page already shows all tiers. Individual offer pages add complexity without value for simplified scope.

---

### Legal Pages - KEEP (3 files)

```
/src/app/legal/terms/page.tsx      ✅ KEEP - Required legally
/src/app/legal/privacy/page.tsx    ✅ KEEP - Required legally
/src/app/legal/disclaimer/page.tsx ✅ KEEP - Required legally
```

---

### Auth Pages - KEEP (4 files)

```
/src/app/auth/page.tsx             ✅ KEEP - Auth hub
/src/app/auth/signin/page.tsx      ✅ KEEP - Magic link login
/src/app/auth/verify-request/page.tsx  ✅ KEEP - Check email page
/src/app/auth/error/page.tsx       ✅ KEEP - Error handling
```

---

### Member Portal Analysis

#### KEEP - Sprint Only (6 files)

```
/src/app/app/layout.tsx            ⚠️  MODIFY - Simplify nav (remove Courses, Chat, Settings, Support)
/src/app/app/page.tsx              ⚠️  MODIFY - Dashboard: show sprint progress only
/src/app/app/profile/page.tsx      ⚠️  SIMPLIFY - Basic profile view only (name, email, avatar, sprint stats)

/src/app/app/sprint/page.tsx                   ✅ KEEP - Sprint hub
/src/app/app/sprint/dashboard/page.tsx         ✅ KEEP - Sprint dashboard
/src/app/app/sprint/watch/page.tsx             ✅ KEEP - Video library
/src/app/app/sprint/day/[dayNumber]/page.tsx   ✅ KEEP - Day player
```

#### REMOVE - Complex Portal Features (5 files)

```
/src/app/app/courses/page.tsx                      ❌ REMOVE
/src/app/app/courses/[courseId]/page.tsx           ❌ REMOVE
/src/app/app/courses/[courseId]/CourseViewer.tsx   ❌ REMOVE
/src/app/app/courses/[courseId]/not-found.tsx      ❌ REMOVE
/src/app/app/chat/page.tsx                         ❌ REMOVE
/src/app/app/settings/page.tsx                     ❌ REMOVE
/src/app/app/support/page.tsx                      ❌ REMOVE
```

**Navigation Changes for `/src/app/app/layout.tsx`:**

```typescript
// BEFORE (7 items)
const navItems = [
  { name: "Dashboard", href: "/app", icon: IconHome },
  { name: "Courses", href: "/app/courses", icon: IconBooks },        // REMOVE
  { name: "DiamondMindAI", href: "/app/chat", icon: IconBrain },     // REMOVE
  { name: "Profile", href: "/app/profile", icon: IconUser },
  { name: "Settings", href: "/app/settings", icon: IconSettings },   // REMOVE
  { name: "Support", href: "/app/support", icon: IconHelp },         // REMOVE
];

// AFTER (3 items)
const navItems = [
  { name: "Dashboard", href: "/app", icon: IconHome },
  { name: "30-Day Sprint", href: "/app/sprint", icon: IconRocket },  // ADD
  { name: "Profile", href: "/app/profile", icon: IconUser },
];
```

---

### API Routes Analysis

#### KEEP - Essential APIs (11 files)

```
# Authentication
/src/app/api/auth/[...nextauth]/route.ts     ✅ KEEP - NextAuth handler
/src/app/api/auth/test-session/route.ts      ⚠️  DEV ONLY - Remove in production

# Sprint
/src/app/api/sprint/days/route.ts            ✅ KEEP - Sprint metadata
/src/app/api/sprint/[dayNumber]/route.ts     ✅ KEEP - Individual day data

# Lead Gen
/src/app/api/leads/route.ts                  ✅ KEEP - Email capture
/src/app/api/download/route.ts               ✅ KEEP - Lead magnet delivery
/src/app/api/unsubscribe/route.ts            ✅ KEEP - Email unsubscribe

# User
/src/app/api/profile/route.ts                ⚠️  SIMPLIFY - Basic profile only (remove course progress)

# Book Sales
/src/app/api/checkout/route.ts               ⚠️  DEPENDS - If using external Stripe checkout, may remove
/src/app/api/checkout/create-session/route.ts  ⚠️  DEPENDS - Same as above

# Blog
/src/app/api/blog/route.ts                   ⚠️  OPTIONAL - Only if CMS is kept
```

#### KEEP - Video & CMS Infrastructure (4 files)

```
# CMS (Decision: Keep Decap CMS)
/src/app/api/cms-auth/route.ts               ✅ KEEP - GitHub OAuth for CMS
/src/app/api/cms-callback/route.ts           ✅ KEEP - CMS OAuth callback

# Video Infrastructure (Decision: Keep Bunny Stream)
/src/app/api/videos/route.ts                 ✅ KEEP - Sprint video metadata
/src/app/api/video/[videoId]/token/route.ts  ✅ KEEP - Secure video tokens
```

#### KEEP - Payments (3 files)

```
# Payments (Decision: Keep Stripe integration)
/src/app/api/stripe/webhook/route.ts         ✅ KEEP - Payment event handling
/src/app/api/stripe/checkout/route.ts        ✅ KEEP - Book checkout
/src/app/api/checkout/create-session/route.ts ✅ KEEP - Session creation helper
```

#### REMOVE - Complex Features (5 files)

```
# Courses
/src/app/api/courses/route.ts                ❌ REMOVE - No course platform
/src/app/api/activities/route.ts             ❌ REMOVE - Complex activity tracking

# AI Chat
/src/app/api/chat/route.ts                   ❌ REMOVE - No AI chat
/src/app/api/ask/route.ts                    ❌ REMOVE - No RAG queries

# Dev Tools
/src/app/api/dev/zip/route.ts                ❌ REMOVE - Dev utility only
```

**✅ Decisions Made:**
- Keep Bunny Stream for professional video delivery
- Keep Stripe for book checkout and webhooks
- Keep Decap CMS for blog management
- Keep Gmail SMTP for email delivery

---

### Shared Components Analysis

#### KEEP - Essential Components (10 files)

```
/src/components/Navigation.tsx               ✅ KEEP - Site navigation
/src/components/Footer.tsx                   ✅ KEEP - Site footer
/src/components/HeroSection.tsx              ✅ KEEP - Landing page hero
/src/components/SectionHeader.tsx            ✅ KEEP - Section headers
/src/components/ProblemPainPointsGrid.tsx    ✅ KEEP - Landing page section
/src/components/TestimonialsSection.tsx      ✅ KEEP - Social proof
/src/components/LeadMagnetSection.tsx        ✅ KEEP - Email capture
/src/components/BookSalesSection.tsx         ✅ KEEP - Book sales
/src/components/LegalPage.tsx                ✅ KEEP - Legal page template
/src/components/FeatureGuard.tsx             ✅ KEEP - Feature flags
/src/components/ErrorBoundary.tsx            ✅ KEEP - Error handling
```

#### KEEP - Video Components (Decision: Bunny Stream)

```
/src/components/VideoPlayer.tsx              ✅ KEEP - Sprint video playback (HLS)
/src/components/ContentRenderer.tsx          ✅ KEEP - Markdown + video rendering
```

#### REMOVE - Unused Components (3 files)

```
/src/components/MarkdownMessage.tsx          ❌ REMOVE - Only used for AI chat
/src/components/PlaylistVideoPlayer.tsx      ❌ REMOVE - Not used
/src/components/MemberAreaTransition.tsx     ❌ REMOVE - Optional, not essential
```

#### Sprint-Specific Components

```
/src/components/sprint/StatsCard.tsx         ✅ KEEP - Dashboard stats
/src/components/sprint/*                     ✅ KEEP ALL - Sprint UI components
```

---

### UI Components Library

```
/src/components/ui/                          ⚠️  SELECTIVE KEEP
```

**Keep Only Components Used In:**
- Home page: `globe`, `bento-grid`, `card-spotlight`, `animated-testimonials`, `spotlight`, `background-beams`, `hover-border-gradient`, `world-map`
- Program page: (check imports)
- Collective page: `lamp`, `timeline`, `evervault-card`, `placeholders-and-vanish-input`
- Sprint: Video player components (if using Aceternity)

**Remove (~70+ unused components):**
- 3D effects not used
- Unused background effects
- Unused card styles
- Unused animations

**Audit Process:**
1. Run: `grep -r "from '@/components/ui/" src/app/page.tsx src/app/program/page.tsx src/app/collective/page.tsx src/app/blog/`
2. Keep only imported components
3. Remove all others

**Estimated Reduction:** 80% of UI components can be removed.

---

### Utility Libraries

#### KEEP (8 files)

```
/src/lib/utils.ts                  ✅ KEEP - Common utilities
/src/lib/storage.ts                ✅ KEEP - LocalStorage wrapper
/src/lib/sprint-progress.ts        ✅ KEEP - Sprint tracking
/src/lib/turso.ts                  ✅ KEEP - Database client
/src/lib/turso-adapter.ts          ✅ KEEP - NextAuth adapter
/src/lib/email-service.ts          ✅ KEEP - Email abstraction
/src/lib/resend.ts                 ✅ KEEP - Email sending (or Gmail)
/src/lib/logger.ts                 ✅ KEEP - Logging
```

#### KEEP - Email & Payments (Decision: Gmail SMTP + Stripe)

```
/src/lib/gmail-smtp.ts             ✅ KEEP - Gmail SMTP (configured)
/src/lib/stripe.ts                 ✅ KEEP - Book checkout
/src/lib/resend.ts                 ❌ REMOVE - Not using Resend
```

#### REMOVE (8 files)

```
/src/lib/content.ts                ⚠️  SIMPLIFY - Only blog parsing, remove news/pages
/src/lib/course-parser.ts          ❌ REMOVE - No course platform
/src/lib/progress.ts               ❌ REMOVE - Use sprint-progress.ts only
/src/lib/rag/claude-simple.ts      ❌ REMOVE - No AI chat
/src/lib/migrate-to-db.ts          ❌ REMOVE - One-time script, not needed
/src/lib/test-parser.ts            ❌ REMOVE - Dev tool only
```

**Action for `/src/lib/content.ts`:**
```typescript
// BEFORE: Supports news, blog, pages
export async function getContentByType(type: 'news' | 'blog' | 'pages')

// AFTER: Blog only
export async function getContentByType(type: 'blog')
```

---

### Email Templates

```
/src/emails/welcome-email.tsx      ✅ KEEP - Lead magnet email
```

**Future Templates (create as needed):**
- Magic link email
- Book purchase confirmation
- Sprint completion

---

### Testing Infrastructure

```
/src/test/                         ⚠️  SELECTIVE KEEP
```

**Keep Tests For:**
- Landing page (e2e)
- Auth flow (e2e)
- Sprint (e2e)
- Profile (e2e)
- Lead gen (unit)

**Remove Tests For:**
- Course playback
- AI chat
- Complex course parser
- Payment webhooks (if removed)

**Estimated Reduction:** 60% of tests can be removed.

---

### Configuration Files

```
/src/config/features.ts            ⚠️  MODIFY - Update feature flags
```

**BEFORE:**
```typescript
export const features = {
  diamondMindAI: true,
  courses: true,
  sprint: true,
  payments: true,
  cms: true,
};
```

**AFTER:**
```typescript
export const features = {
  sprint: true,
  leadGen: true,
  bookSales: true,
};
```

---

## Content Directory Analysis

```
/content/news/                     ❌ REMOVE - Not needed
/content/blog/                     ✅ KEEP - Insights content (managed via CMS)
/content/pages/                    ❌ REMOVE - Not needed
/content/settings/                 ❌ REMOVE - Not needed
/content/sprint/                   ✅ KEEP - 30-day sprint content
/public/admin/                     ✅ KEEP - Decap CMS admin UI
```

**Decision:** Keep Decap CMS for non-technical blog management.

---

## Database Schema Simplification

### Tables to KEEP

```sql
users                  ✅ KEEP - User accounts
accounts               ✅ KEEP - Magic link auth
sessions               ✅ KEEP - Session management
verification_tokens    ✅ KEEP - Magic link tokens
leads                  ✅ KEEP - Email capture
sprint_progress        ✅ KEEP - Sprint tracking (rename from user_progress)
```

### Tables to REMOVE

```sql
courses                ❌ REMOVE - No course platform
user_progress          ⚠️  RENAME to sprint_progress and simplify
activities             ⚠️  OPTIONAL - Keep if tracking sprint activities
payments               ⚠️  DEPENDS - Book purchases
```

**Migration Required:** Backup existing data before schema changes.

---

## Environment Variables - Cleanup

### KEEP - Required Variables

```bash
# Database
DATABASE_URL                        ✅ KEEP
DATABASE_AUTH_TOKEN                 ✅ KEEP

# Auth
NEXTAUTH_URL                        ✅ KEEP
NEXTAUTH_SECRET                     ✅ KEEP

# Email (Decision: Gmail SMTP)
GMAIL_USER                          ✅ KEEP
GMAIL_CLIENT_ID                     ✅ KEEP
GMAIL_CLIENT_SECRET                 ✅ KEEP
GMAIL_REFRESH_TOKEN                 ✅ KEEP

# Stripe (Decision: Keep integration)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY  ✅ KEEP
STRIPE_SECRET_KEY                   ✅ KEEP
STRIPE_WEBHOOK_SECRET               ✅ KEEP

# Bunny Stream (Decision: Keep)
BUNNY_LIBRARY_ID                    ✅ KEEP
BUNNY_API_KEY                       ✅ KEEP
BUNNY_CDN_HOSTNAME                  ✅ KEEP

# CMS (Decision: Keep Decap)
GITHUB_CLIENT_ID                    ✅ KEEP
GITHUB_CLIENT_SECRET                ✅ KEEP

# Feature Flags
NODE_ENV                            ✅ KEEP
```

### REMOVE - Unused Variables

```bash
# AI Chat
ANTHROPIC_API_KEY                   ❌ REMOVE

# Resend (not using)
RESEND_API_KEY                      ❌ REMOVE

# Old feature flags
NEXT_PUBLIC_ENABLE_AI               ❌ REMOVE
```

---

## Dependencies to Remove from package.json

### Can Remove (Based on Decisions)

```json
{
  "@anthropic-ai/sdk": "❌ REMOVE - No AI chat",
  "resend": "❌ REMOVE - Using Gmail SMTP instead",
  "react-email": "⚠️  REVIEW - May still use for templates with Gmail",

  "hls.js": "✅ KEEP - Sprint uses Bunny videos",
  "@stripe/stripe-js": "✅ KEEP - Book checkout",
  "stripe": "✅ KEEP - Payment processing",

  "gray-matter": "✅ KEEP - CMS markdown parsing",
  "remark": "✅ KEEP - Blog content rendering",
  "remark-html": "✅ KEEP - Markdown to HTML"
}
```

**Full Audit Required:** Review all dependencies against actual imports after file removal.

**Estimated Savings:**
- Before: ~80 dependencies
- After: ~50 dependencies (37% reduction)
- Bundle size reduction: ~40-50%

---

## File & Folder Removal Summary

### Total File Count Analysis

**Before Simplification:**
- Total TypeScript/TSX files: ~180 files
- Total components (incl. UI): ~120 files
- Total API routes: 25 files
- Total pages: 35 files

**After Simplification:**
- Total TypeScript/TSX files: ~80 files (56% reduction)
- Total components (incl. UI): ~30 files (75% reduction)
- Total API routes: ~10 files (60% reduction)
- Total pages: ~20 files (43% reduction)

### Directories to COMPLETELY Remove

```
/src/app/courses/                      ❌ DELETE ENTIRE DIRECTORY
/src/app/offers/                       ❌ DELETE ENTIRE DIRECTORY
/src/app/news/                         ❌ DELETE ENTIRE DIRECTORY
/src/app/pricing/                      ❌ DELETE ENTIRE DIRECTORY
/src/app/api/courses/                  ❌ DELETE ENTIRE DIRECTORY
/src/app/api/chat/                     ❌ DELETE ENTIRE DIRECTORY
/src/app/api/ask/                      ❌ DELETE ENTIRE DIRECTORY
/src/app/api/dev/                      ❌ DELETE ENTIRE DIRECTORY
/src/contexts/CourseContext.tsx        ❌ DELETE FILE
/src/contexts/ChatContext.tsx          ❌ DELETE FILE
/src/lib/rag/                          ❌ DELETE ENTIRE DIRECTORY
/src/components/ui/                    ⚠️  DELETE 70+ UNUSED COMPONENTS (selective)
/content/news/                         ❌ DELETE ENTIRE DIRECTORY
/content/pages/                        ❌ DELETE ENTIRE DIRECTORY
```

### Directories to KEEP (Based on Decisions)

```
/src/app/api/cms-auth/                 ✅ KEEP - CMS OAuth
/src/app/api/cms-callback/             ✅ KEEP - CMS callback
/src/app/api/video/                    ✅ KEEP - Bunny Stream
/src/app/api/videos/                   ✅ KEEP - Video metadata
/src/app/api/stripe/                   ✅ KEEP - Payments
/public/admin/                         ✅ KEEP - Decap CMS admin UI
```

---

## Navigation & UI Updates Required

### Global Navigation (`/src/components/Navigation.tsx`)

**BEFORE:**
```typescript
const links = [
  { href: "/", label: "Home" },
  { href: "/program", label: "Program" },
  { href: "/collective", label: "Collective" },
  { href: "/news", label: "News" },
  { href: "/blog", label: "Blog" },
  { href: "/pricing", label: "Pricing" },
];
```

**AFTER:**
```typescript
const links = [
  { href: "/", label: "Home" },
  { href: "/program", label: "Program" },
  { href: "/collective", label: "Collective" },
  { href: "/blog", label: "Insights" },  // Renamed from Blog
  { href: "/book", label: "Book" },
];
```

### Member Portal Navigation (see earlier section)

---

## Decision Matrix - FINALIZED

### Critical Decisions - All Made ✅

| Feature | Decision | Impact | Rationale |
|---------|----------|--------|-----------|
| **Video Streaming** | ✅ KEEP Bunny Stream | High | Already implemented, professional streaming |
| **Stripe Integration** | ✅ KEEP Full Integration | Medium | Branded checkout experience needed |
| **Email Provider** | ✅ Gmail SMTP | Low | Already configured |
| **Decap CMS** | ✅ KEEP | High | Non-technical blog editing required |
| **Course Content** | ❌ REMOVE | High | Major simplification - not in scope |
| **AI Chat** | ❌ REMOVE | High | Major simplification - not in scope |

### Implementation Summary

**KEEP Infrastructure:**
- Bunny Stream (video delivery)
- Stripe (checkout + webhooks)
- Decap CMS (blog management)
- Gmail SMTP (email delivery)
- GitHub OAuth (for CMS access)

**REMOVE Infrastructure:**
- Course platform
- AI chat (Claude API)
- Resend (email provider)

---

## Implementation Plan (If Approved)

### Phase 1: Backup & Preparation
1. Create full branch backup: `git checkout -b backup/full-codebase-2025-01-05`
2. Push backup to remote: `git push origin backup/full-codebase-2025-01-05`
3. Create new branch for simplification: `git checkout -b simplify/mvp-scope`
4. Document current functionality with screenshots

### Phase 2: Remove Unused Files (2-3 hours)
1. Delete entire directories listed above
2. Remove unused API routes
3. Remove unused components
4. Remove unused pages
5. Commit: "chore: remove unused directories and files"

### Phase 3: Update Dependencies (1 hour)
1. Remove unused packages from `package.json`
2. Run `npm install` to update lockfile
3. Test that build still works: `npm run build`
4. Commit: "chore: remove unused dependencies"

### Phase 4: Update Existing Files (3-4 hours)
1. Simplify `/src/app/providers.tsx` (remove contexts)
2. Update `/src/app/app/layout.tsx` navigation
3. Simplify `/src/app/app/page.tsx` dashboard
4. Simplify `/src/components/Navigation.tsx`
5. Update `/src/config/features.ts`
6. Commit: "refactor: simplify core components for MVP scope"

### Phase 5: Database Schema Changes (1-2 hours)
1. Create migration to drop unused tables
2. Rename `user_progress` to `sprint_progress`
3. Test locally with fresh database
4. Commit: "feat: simplify database schema"

### Phase 6: Testing & QA (2-3 hours)
1. Test all kept pages manually
2. Run remaining tests: `npm test`
3. Run E2E tests: `npm run test:e2e`
4. Fix any broken tests
5. Update test suite to match new scope

### Phase 7: Documentation Updates (1 hour)
1. Update `CLAUDE.md` with new architecture
2. Update `architecture.md`
3. Update `README.md`
4. Remove outdated docs in `/docs/specs/`

### Phase 8: Production Deployment Preparation
1. Update environment variables on Vercel
2. Remove unused secrets
3. Test production build locally: `npm run build && npm start`
4. Create deployment checklist

**Total Estimated Time:** 10-15 hours

---

## Risk Assessment

### High Risks

1. **Accidental Data Loss**
   - Risk: Deleting files with unique functionality
   - Mitigation: Full backup before any changes, staged approach

2. **Breaking Dependencies**
   - Risk: Removing a file that's imported elsewhere
   - Mitigation: TypeScript will catch at build time, thorough testing

3. **Database Migration Issues**
   - Risk: Schema changes break existing user data
   - Mitigation: Test migrations on staging DB first, keep rollback plan

### Medium Risks

1. **Hidden Feature Usage**
   - Risk: Removing a feature that's actually being used in production
   - Mitigation: Check analytics for page views, monitor logs

2. **Integration Breakage**
   - Risk: Third-party integrations stop working
   - Mitigation: Document all integrations, test webhooks

### Low Risks

1. **UI/UX Changes**
   - Risk: Users notice removed features
   - Mitigation: Most removed features are backend/admin-facing

---

## Estimated Impact

### Code Reduction
- **Files:** 180 → 80 (56% reduction)
- **Lines of Code:** ~15,000 → ~6,000 (60% reduction)
- **Dependencies:** 80 → 50 (37% reduction)

### Performance Improvements
- **Build Time:** 4.0s → ~2.0s (50% faster)
- **Bundle Size:** ~400KB → ~200KB (50% smaller)
- **Page Load:** Faster due to smaller JS bundles

### Maintenance Benefits
- **Cognitive Load:** Significantly reduced
- **Bug Surface Area:** 60% smaller
- **Deployment Speed:** Faster builds
- **Developer Onboarding:** Simpler codebase to learn

### Feature Set
- **Before:** Full course platform + sprint + AI + book + blog
- **After:** Sprint + blog + book + lead gen + marketing pages

---

## Alternative: Feature Flagging Approach

Instead of deletion, consider feature flags to disable code without removing:

```typescript
// /src/config/features.ts
export const features = {
  courses: false,        // Disable course platform
  aiChat: false,         // Disable AI chat
  cms: false,            // Disable CMS admin
  sprint: true,          // Keep sprint
  blog: true,            // Keep blog
  bookSales: true,       // Keep book
  leadGen: true,         // Keep lead gen
};
```

**Pros:**
- Reversible without Git history diving
- Can re-enable features quickly
- Less risky

**Cons:**
- Dead code still in codebase
- Dependencies still installed
- No performance/size benefits
- Adds complexity

**Recommendation:** Use feature flags for quick wins, then proceed with deletion after confidence is gained.

---

## Rollback Plan

If simplification causes issues:

1. **Immediate Rollback:**
   ```bash
   git checkout backup/full-codebase-2025-01-05
   git push origin main --force  # DANGEROUS - only if necessary
   ```

2. **Partial Rollback:**
   ```bash
   git revert <commit-hash>  # Revert specific commits
   ```

3. **Cherry-Pick Approach:**
   ```bash
   git checkout backup/full-codebase-2025-01-05 -- path/to/file
   # Restore specific files from backup
   ```

---

## Recommendations

### Immediate Actions (No Code Changes)

1. ✅ Review this analysis with stakeholders
2. ✅ Make decisions on the 4 critical questions:
   - Video delivery method?
   - Book checkout flow?
   - Email provider?
   - Blog management approach?
3. ✅ Create full backup branch
4. ✅ Document current production metrics (page views, usage)

### Short-Term (After Approval)

1. Start with feature flags to disable features
2. Monitor for 1-2 weeks
3. Proceed with file deletion if no issues
4. Follow phased implementation plan

### Long-Term

1. Keep backup branch indefinitely
2. Document removed features for future reference
3. Update team documentation
4. Consider creating a "feature restoration" guide

---

## Conclusion

**Simplification Potential:** Massive - 56% file reduction, 60% code reduction

**Recommended Approach:**
1. Make critical decisions (video, payments, CMS, email)
2. Create backup branch
3. Use feature flags first (1-2 weeks)
4. Proceed with deletion in phases
5. Keep backup branch as insurance

**Biggest Wins:**
- Removing course platform (largest feature)
- Removing AI chat infrastructure
- Removing Decap CMS admin
- Removing 70+ unused UI components

**Safe Starting Point:**
Start with removing the `/docs/` folder and unused UI components - low risk, high impact.

---

**Next Steps:**
1. ✅ Decisions finalized (Bunny Stream, Stripe, Gmail SMTP, Decap CMS - all KEEP)
2. Create backup branch
3. Begin Phase 1: Remove unused files
4. Follow implementation plan

---

## Updated Impact Estimates (Based on Final Decisions)

### Code Reduction (Revised)
- **Files:** 180 → ~95 (47% reduction, less aggressive due to keeping infrastructure)
- **Lines of Code:** ~15,000 → ~8,000 (47% reduction)
- **Dependencies:** 80 → ~60 packages (25% reduction)
- **API Routes:** 25 → ~18 (28% reduction - keeping video, CMS, payment APIs)

### Features Kept vs Removed

**KEEPING (Infrastructure):**
- ✅ Bunny Stream video delivery
- ✅ Stripe payment integration
- ✅ Decap CMS admin
- ✅ Gmail SMTP email
- ✅ GitHub OAuth
- ✅ Sprint video player
- ✅ Blog management

**REMOVING (Features):**
- ❌ Course platform (largest removal)
- ❌ AI Chat (second largest)
- ❌ News section
- ❌ Individual offer pages
- ❌ Settings page
- ❌ Support ticketing
- ❌ Complex progress tracking

### Infrastructure Cost Summary

**Monthly Costs (All Kept):**
- Bunny Stream: $10-30/month
- Vercel: $0-20/month (hobby to pro)
- Turso: $0-29/month (starter to scaler)
- Gmail: Free (workspace included)
- Stripe: Transaction fees only
- GitHub: Free (for OAuth)

**Total Estimated: $10-80/month** depending on usage tiers

### Performance Impact (Revised)
- **Build Time:** 4.0s → ~2.5s (37% faster)
- **Bundle Size:** ~400KB → ~250KB (37% smaller)
- **Maintained Complexity:** Video infrastructure adds ~50KB to bundle

### Final Simplification Score

**Before:** Full-featured course platform with AI
**After:** Streamlined sprint + blog + book platform with professional infrastructure

**Complexity Reduction: 7/10** (Good balance of simplification while keeping quality infrastructure)

---

## Action Items Summary

### Immediate Next Steps
1. ✅ **Decisions Made** - All 4 critical decisions finalized
2. **Create Backup** - Full branch backup required
3. **Environment Check** - Verify all required env vars are set
4. **Database Review** - Plan schema simplification

### Implementation Checklist
- [ ] Create backup branch: `backup/full-codebase-2025-01-05`
- [ ] Push backup to remote
- [ ] Create work branch: `simplify/mvp-scope`
- [ ] Remove course platform files (Phase 2)
- [ ] Remove AI chat files (Phase 2)
- [ ] Remove unused UI components (Phase 2)
- [ ] Update dependencies (Phase 3)
- [ ] Simplify contexts and providers (Phase 4)
- [ ] Update navigation (Phase 4)
- [ ] Database schema changes (Phase 5)
- [ ] Testing and QA (Phase 6)
- [ ] Documentation updates (Phase 7)

### Risk Mitigation
✅ **Backup strategy in place**
✅ **Phased approach planned**
✅ **No breaking changes to kept features**
✅ **All infrastructure decisions made**

---

**Last Updated:** 2025-01-05 (Decisions Finalized)
**Status:** Ready for Implementation
**Estimated Effort:** 10-15 hours
**Risk Level:** Low-Medium (with proper backup)
