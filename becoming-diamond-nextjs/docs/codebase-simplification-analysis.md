# Codebase Simplification Analysis

> Analysis of what code is needed vs removable for simplified MVP scope

**Date:** 2025-01-05
**Status:** Analysis Only - No Changes Made
**Backup Required:** Yes - Full branch backup before any removal

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
- CMS admin interface (Decap CMS)
- Video streaming infrastructure
- Complex progress tracking
- Payment webhooks (if book uses external checkout)
- OAuth flows
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

#### REMOVE - Complex Features (15 files)

```
# CMS (if moving to static blog)
/src/app/api/cms-auth/route.ts               ❌ REMOVE - No CMS admin
/src/app/api/cms-callback/route.ts           ❌ REMOVE - No CMS admin

# Courses
/src/app/api/courses/route.ts                ❌ REMOVE - No course platform
/src/app/api/activities/route.ts             ❌ REMOVE - No activity tracking

# Video Infrastructure
/src/app/api/videos/route.ts                 ⚠️  MAYBE KEEP - If sprint uses Bunny videos
/src/app/api/video/[videoId]/token/route.ts  ⚠️  MAYBE KEEP - If sprint uses Bunny videos

# AI Chat
/src/app/api/chat/route.ts                   ❌ REMOVE - No AI chat
/src/app/api/ask/route.ts                    ❌ REMOVE - No RAG queries

# Payments (if not needed)
/src/app/api/stripe/webhook/route.ts         ⚠️  DEPENDS - Keep if handling subscriptions
/src/app/api/stripe/checkout/route.ts        ⚠️  DEPENDS - Keep if Stripe integration needed

# Dev Tools
/src/app/api/dev/zip/route.ts                ❌ REMOVE - Dev utility only
```

**Decision Point:** Video infrastructure depends on how sprint videos are delivered.
- **Option A:** Keep Bunny Stream integration for sprint videos → Keep video APIs
- **Option B:** Use YouTube embeds or simple video links → Remove video APIs

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

#### REMOVE - Complex Features (5 files)

```
/src/components/ContentRenderer.tsx          ⚠️  SIMPLIFY - Remove video parsing if videos removed
/src/components/MarkdownMessage.tsx          ❌ REMOVE - Only used for AI chat
/src/components/VideoPlayer.tsx              ⚠️  DEPENDS - Sprint video playback
/src/components/PlaylistVideoPlayer.tsx      ❌ REMOVE - Not used
/src/components/MemberAreaTransition.tsx     ⚠️  OPTIONAL - Nice to have
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

#### OPTIONAL - Depending on Decisions

```
/src/lib/gmail-smtp.ts             ⚠️  KEEP IF using Gmail instead of Resend
/src/lib/stripe.ts                 ⚠️  KEEP IF book checkout uses Stripe
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
/content/blog/                     ✅ KEEP - Insights content
/content/pages/                    ❌ REMOVE - Not needed
/content/settings/                 ❌ REMOVE - Not needed
/content/sprint/                   ✅ KEEP - 30-day sprint content
```

**Alternative:** If removing Decap CMS, could convert blog to static markdown files only.

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

### KEEP

```bash
# Database
DATABASE_URL
DATABASE_AUTH_TOKEN

# Auth
NEXTAUTH_URL
NEXTAUTH_SECRET

# Email (choose one)
RESEND_API_KEY
# OR
GMAIL_USER
GMAIL_CLIENT_ID
GMAIL_CLIENT_SECRET
GMAIL_REFRESH_TOKEN

# Feature Flags
NODE_ENV
```

### OPTIONAL (Depending on Decisions)

```bash
# Stripe (if book uses integrated checkout)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET

# Bunny Stream (if sprint uses video streaming)
BUNNY_LIBRARY_ID
BUNNY_API_KEY
BUNNY_CDN_HOSTNAME
```

### REMOVE

```bash
# AI Chat
ANTHROPIC_API_KEY

# CMS
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET

# Feature Flags (old)
NEXT_PUBLIC_ENABLE_AI
```

---

## Dependencies to Remove from package.json

### Can Remove (21 packages)

```json
{
  "@anthropic-ai/sdk": "REMOVE - No AI chat",
  "react-markdown": "REMOVE - If ContentRenderer simplified",
  "remark": "MAYBE REMOVE - Used for blog, but could use simpler parser",
  "remark-html": "MAYBE REMOVE - Same as above",
  "hls.js": "KEEP IF sprint uses Bunny videos, else REMOVE",
  "@stripe/stripe-js": "KEEP IF book checkout, else REMOVE",
  "stripe": "KEEP IF book checkout, else REMOVE"
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
/src/app/courses/                      DELETE ENTIRE DIRECTORY
/src/app/offers/                       DELETE ENTIRE DIRECTORY
/src/app/news/                         DELETE ENTIRE DIRECTORY
/src/app/pricing/                      DELETE ENTIRE DIRECTORY
/src/app/api/courses/                  DELETE ENTIRE DIRECTORY
/src/app/api/chat/                     DELETE ENTIRE DIRECTORY
/src/app/api/cms-auth/                 DELETE ENTIRE DIRECTORY
/src/app/api/cms-callback/             DELETE ENTIRE DIRECTORY
/src/app/api/dev/                      DELETE ENTIRE DIRECTORY
/src/contexts/CourseContext.tsx        DELETE FILE
/src/contexts/ChatContext.tsx          DELETE FILE
/src/lib/rag/                          DELETE ENTIRE DIRECTORY
/src/components/ui/                    DELETE 70+ UNUSED COMPONENTS
/content/news/                         DELETE ENTIRE DIRECTORY
/content/pages/                        DELETE ENTIRE DIRECTORY
/public/admin/                         DELETE (Decap CMS)
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

## Decision Matrix

### Critical Decisions Needed Before Removal

| Feature | Keep? | Depends On | Impact |
|---------|-------|------------|--------|
| **Video Streaming** | ⚠️ | How sprint videos are delivered | High - affects video APIs, Bunny integration |
| **Stripe Integration** | ⚠️ | Book checkout flow | Medium - affects payment APIs |
| **Email Provider** | ⚠️ | Resend vs Gmail SMTP | Low - affects one library |
| **Decap CMS** | ⚠️ | Blog management workflow | High - affects content APIs, admin UI |
| **Course Content** | ❌ | N/A - Remove | High - major simplification |
| **AI Chat** | ❌ | N/A - Remove | High - major simplification |

### Recommended Decisions

**Video Delivery for Sprint:**
- **Option A (Recommended):** Keep Bunny Stream for professional delivery
  - Keep: `/src/lib/bunny.ts`, video token APIs, `VideoPlayer.tsx`
  - Pros: Professional streaming, analytics, security
  - Cons: Monthly cost (~$10-30)

- **Option B:** Use YouTube embeds
  - Remove all video infrastructure
  - Pros: Free, simple
  - Cons: Less control, ads (unless paid), privacy concerns

**Book Checkout:**
- **Option A (Recommended):** External Stripe checkout (Stripe Payment Links)
  - Remove: All checkout APIs, webhook handler
  - Keep: Simple redirect to Stripe-hosted checkout
  - Pros: Simpler, PCI compliant by default
  - Cons: Less customization

- **Option B:** Integrated Stripe checkout
  - Keep: `/src/lib/stripe.ts`, checkout APIs
  - Pros: Branded experience
  - Cons: More code to maintain

**Blog Management:**
- **Option A (Recommended):** Keep Decap CMS
  - Keep: CMS admin, auth APIs, content APIs
  - Pros: Non-technical content editing
  - Cons: OAuth setup, admin UI to maintain

- **Option B:** Static markdown files only
  - Remove: All CMS infrastructure
  - Add: Manual blog post creation via Git commits
  - Pros: Simpler codebase
  - Cons: Technical skill required for blog posts

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

**Next Steps:** Review decisions matrix and get stakeholder approval before proceeding.
