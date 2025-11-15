# Knip Cleanup Checklist

**Date:** 2025-11-15
**Purpose:** Review and approve file deletions identified by knip analysis

**Automated Cleanup Script:** `scripts/cleanup-from-checklist.ts`

**Usage:**
```bash
# Preview changes (dry run - safe, no modifications)
npm run cleanup:knip

# Execute cleanup (will delete files and uninstall packages)
npm run cleanup:knip:execute
```

**Instructions:**
- [ ] = Safe to delete (default recommendation)
- Check the box to KEEP the file (prevent deletion)
- Files with ⚠️ require investigation before deletion
- Files with ✅ are FALSE POSITIVES (must keep)
- Script reads this file and only deletes/uninstalls unchecked items

---

## 1. UNUSED FILES (111 total)

### FALSE POSITIVES - DO NOT DELETE ✅

- [x] `lib/content.ts` - **KEEP** - Used in 9 files (blog, sprint, legal pages)
- [x] `public/admin/decap-cms.js` - **KEEP** - Required by prebuild script

### Scripts - Utility/Debug Scripts (18 files)

**One-time database/debugging scripts - Safe to delete unless actively debugging:**

- [ ] `scripts/check-all-profiles.ts`
- [ ] `scripts/check-corrupt-user.ts`
- [ ] `scripts/check-lead-emails.ts`
- [ ] `scripts/check-sessions.ts`
- [ ] `scripts/check-user-by-id.ts`
- [ ] `scripts/check-user.ts`
- [ ] `scripts/cleanup-corrupt-user.ts`
- [ ] `scripts/delete-user-by-id.ts`
- [ ] `scripts/insert-test-lead.ts`
- [ ] `scripts/list-recent-users.ts`
- [ ] `scripts/verify-book-order.ts`
- [ ] `scripts/verify-tables.ts`
- [ ] `scripts/test-db-connection.ts`
- [ ] `scripts/test-gmail-smtp.ts`
- [ ] `scripts/test-auth-flow.ts` - ⚠️ Keep if actively debugging auth
- [ ] `dev-with-restart.js`
- [ ] `test-dev-zip.ts`
- [ ] `register-all.ts`

### Scripts - Migration Scripts (4 files)

**Check if migrations are complete before deleting:**

- [ ] `scripts/run-member-portal-migration.ts` - ⚠️ Delete only if migration complete
- [ ] `scripts/run-migration.ts` - ⚠️ Delete only if migration complete
- [ ] `scripts/run-stripe-migration.ts` - ⚠️ Delete only if migration complete
- [ ] `scripts/convert-manifesto-to-pdf.js`

### Scripts - Video Management (2 files)

**Keep if you manage videos via CLI:**

- [ ] `scripts/list-bunny-videos.js` - ⚠️ Keep if you use this to manage Bunny videos
- [ ] `scripts/update-all-video-ids.js` - ⚠️ Keep if you bulk update video IDs

### Archive/Abandoned Code (2 files)

- [ ] `docs/archive/landing-alt-all/page.tsx`
- [ ] `docs/mark-all-days-complete.js`

### CMS Configuration (1 file)

- [ ] `public/admin/config.js` - ⚠️ Verify CMS works without this (may use config.yml instead)

### Test Utilities (3 files)

- [ ] `src/test/utils/auth-helpers.ts`
- [ ] `src/test/utils/email-helpers.ts`
- [ ] `src/types/progress.ts` - ⚠️ Check if type is used elsewhere

### Services (1 file)

- [ ] `src/lib/email-service.ts` - ⚠️ Keep if not superseded by gmail-smtp.ts

### Components (2 files)

- [ ] `src/components/ErrorBoundary.tsx` - ⚠️ Good practice to keep
- [ ] `src/hooks/use-outside-click.tsx`

### Aceternity UI Components - Unused (73 files)

**Note:** These are library components. Safe to delete if bundle size is a concern, but may need in future.

**3D Components:**
- [ ] `src/components/ui/3d-card.tsx`
- [ ] `src/components/ui/3d-marquee.tsx`
- [ ] `src/components/ui/3d-pin.tsx`

**Animation Components:**
- [ ] `src/components/ui/animated-modal.tsx`
- [ ] `src/components/ui/animated-tooltip.tsx`

**Background Components:**
- [ ] `src/components/ui/aurora-background.tsx`
- [ ] `src/components/ui/background-beams-with-collision.tsx`
- [ ] `src/components/ui/background-boxes.tsx`
- [ ] `src/components/ui/background-gradient-animation.tsx`
- [ ] `src/components/ui/background-gradient.tsx`
- [ ] `src/components/ui/background-lines.tsx`
- [ ] `src/components/ui/background-ripple-effect.tsx`

**Card Components:**
- [ ] `src/components/ui/apple-cards-carousel.tsx`
- [ ] `src/components/ui/card-hover-effect.tsx`
- [ ] `src/components/ui/card-stack.tsx`
- [ ] `src/components/ui/carousel.tsx`

**Effect Components:**
- [ ] `src/components/ui/code-block.tsx`
- [ ] `src/components/ui/colourful-text.tsx`
- [ ] `src/components/ui/comet-card.tsx`
- [ ] `src/components/ui/compare.tsx`
- [ ] `src/components/ui/container-scroll-animation.tsx`
- [ ] `src/components/ui/container-text-flip.tsx`
- [ ] `src/components/ui/direction-aware-hover.tsx`
- [ ] `src/components/ui/draggable-card.tsx`

**Input Components:**
- [ ] `src/components/ui/file-upload.tsx`

**Text/Animation Components:**
- [ ] `src/components/ui/flip-words.tsx`
- [ ] `src/components/ui/floating-dock.tsx`
- [ ] `src/components/ui/floating-navbar.tsx`
- [ ] `src/components/ui/focus-cards.tsx`
- [ ] `src/components/ui/following-pointer.tsx`

**Visual Effect Components:**
- [ ] `src/components/ui/glare-card.tsx`
- [ ] `src/components/ui/glowing-effect.tsx`
- [ ] `src/components/ui/glowing-stars.tsx`
- [ ] `src/components/ui/google-gemini-effect.tsx`
- [ ] `src/components/ui/grid.tsx`

**Hero Components:**
- [ ] `src/components/ui/hero-highlight.tsx`
- [ ] `src/components/ui/hero-parallax.tsx`

**Image/Slider Components:**
- [ ] `src/components/ui/images-slider.tsx`
- [ ] `src/components/ui/infinite-moving-cards.tsx`

**Layout Components:**
- [ ] `src/components/ui/layout-grid.tsx`
- [ ] `src/components/ui/lens.tsx`
- [ ] `src/components/ui/link-preview.tsx`
- [ ] `src/components/ui/loader.tsx`
- [ ] `src/components/ui/macbook-scroll.tsx`

**Special Effect Components:**
- [ ] `src/components/ui/meteors.tsx`
- [ ] `src/components/ui/moving-border.tsx`
- [ ] `src/components/ui/moving-line.tsx`
- [ ] `src/components/ui/multi-step-loader.tsx`

**Navigation Components:**
- [ ] `src/components/ui/navbar-menu.tsx`
- [ ] `src/components/ui/resizable-navbar.tsx`
- [ ] `src/components/ui/sidebar.tsx`

**Parallax Components:**
- [ ] `src/components/ui/parallax-scroll-2.tsx`
- [ ] `src/components/ui/parallax-scroll.tsx`

**Interactive Components:**
- [ ] `src/components/ui/pixelated-canvas.tsx`
- [ ] `src/components/ui/pointer-highlight.tsx`

**Particle/Sky Effects:**
- [ ] `src/components/ui/shooting-stars.tsx`
- [ ] `src/components/ui/sparkles-background.tsx`
- [ ] `src/components/ui/sparkles.tsx`
- [ ] `src/components/ui/spotlight-new.tsx`
- [ ] `src/components/ui/stars-background.tsx`

**UI Components:**
- [ ] `src/components/ui/stateful-button.tsx`
- [ ] `src/components/ui/sticky-banner.tsx`
- [ ] `src/components/ui/sticky-scroll-reveal.tsx`
- [ ] `src/components/ui/svg-mask-effect.tsx`
- [ ] `src/components/ui/tabs.tsx`
- [ ] `src/components/ui/tailwindcss-buttons.tsx`

**Text Effect Components:**
- [ ] `src/components/ui/text-generate-effect.tsx`
- [ ] `src/components/ui/text-hover-effect.tsx`
- [ ] `src/components/ui/text-reveal-card.tsx`

**Advanced Components:**
- [ ] `src/components/ui/tracing-beam.tsx`
- [ ] `src/components/ui/typewriter-effect.tsx`
- [ ] `src/components/ui/vortex.tsx`
- [ ] `src/components/ui/wavy-background.tsx`
- [ ] `src/components/ui/wobble-card.tsx`
- [ ] `src/components/ui/world-map.tsx`

---

## 2. UNUSED DEPENDENCIES (18 total)

**Instructions:** Unchecked items will be uninstalled via `npm uninstall`

### Safe to Remove:

- [ ] `@radix-ui/react-hover-card`
- [ ] `@radix-ui/react-tabs`
- [ ] `@tsparticles/engine`
- [ ] `@tsparticles/react`
- [ ] `@tsparticles/slim`
- [ ] `class-variance-authority`
- [ ] `lucide-react` - (using @tabler/icons-react instead)
- [ ] `mini-svg-data-uri`
- [ ] `qss`
- [ ] `react-dropzone`
- [ ] `react-syntax-highlighter`
- [ ] `rehype-raw`
- [ ] `remark-gfm`
- [ ] `simplex-noise`

### Review Before Removing:

- [ ] `decap-cms` - ⚠️ **KEEP if using CMS** (prebuild script needs this)
- [ ] `next-themes` - ⚠️ Keep if implementing dark mode
- [ ] `react-markdown` - ⚠️ Keep if rendering markdown content

---

## 3. UNUSED DEV DEPENDENCIES (8 total)

### Safe to Remove:

- [ ] `@axe-core/playwright`
- [ ] `@types/pdfkit`
- [ ] `@types/react-syntax-highlighter`
- [ ] `critters`
- [ ] `pdfkit`

### Review Before Removing:

- [ ] `repomix` - ⚠️ Keep if you use this for repo documentation
- [x] `eslint-config-next` - **KEEP** - Required by Next.js
- [x] `aceternity-ui` - **KEEP** - Source for UI components

---

## 4. CRITICAL FIXES REQUIRED ✅

### Add Missing Dependencies (DO THIS FIRST):

**Run these commands:**
```bash
npm install --save nanoid
npm install --save-dev @eslint/js postcss
```

**Affected files:**
- `@eslint/js` - Used in `eslint.config.mjs:4:17`
- `postcss` - Used in `postcss.config.mjs`
- `nanoid` - Used in `src/app/api/leads/route.ts:2:25`

---

## 5. UNRESOLVED IMPORTS (3 total)

**Action Required:** Either create these files or remove the test files that import them.

- [ ] Create `src/components/course/CourseProgress.tsx` OR delete `src/test/unit/components/CourseProgress.test.tsx`
- [ ] Create `src/components/MarkdownMessage.tsx` OR delete `src/test/unit/components/MarkdownMessage.test.tsx`
- [ ] Create `src/lib/course-parser.ts` OR delete `src/test/unit/lib/course-parser.test.ts`

**Recommendation:** Delete the test files since components don't exist yet.

---

## 6. UNUSED EXPORTS (24 total)

**Note:** These are exported but not imported. Low priority - keep for now unless doing deep cleanup.

### Auth Exports (auth.ts):
- `signIn` - ⚠️ Actually used via next-auth/react, not direct import
- `signOut` - ⚠️ Actually used via next-auth/react, not direct import

### Component Utilities:
- `CardPattern`, `generateRandomString`, `Icon` (evervault-card.tsx)
- `Globe`, `WebGLRendererConfig`, `hexToRgb`, `genRandomNumbers` (globe.tsx)
- `default` (lamp.tsx)

### Email/Logging (KEEP THESE):
- [x] `default` (welcome-email.tsx) - May use later
- [x] `default`, `log` (axiom-logger.ts) - Logging infrastructure
- [x] `sendAdminNotification` (gmail-smtp.ts) - Admin features
- [x] `logger` (logger.ts) - Logging infrastructure

### Sprint Progress (KEEP ALL - Core Feature):
- [x] `getProgress` (sprint-progress.ts)
- [x] `saveProgress` (sprint-progress.ts)
- [x] `exportProgress` (sprint-progress.ts)
- [x] `importProgress` (sprint-progress.ts)

### Test Fixtures (KEEP - Needed for tests):
- [x] `mockVideoReference` (test/fixtures/course.ts)
- [x] `mockSlide` (test/fixtures/course.ts)
- [x] `mockSlide2` (test/fixtures/course.ts)
- [x] `mockChapter` (test/fixtures/course.ts)
- [x] `mockChapter2` (test/fixtures/course.ts)
- [x] `mockSession` (test/fixtures/user.ts)

### Types:
- [ ] `StorageKey` type (storage.ts)

---

## 7. DUPLICATE EXPORTS (2 total)

**Action Required:** Fix these files to have only one export style.

- [ ] Fix `src/emails/welcome-email.tsx` - Has both `WelcomeEmail` and `default` export
- [ ] Fix `src/lib/axiom-logger.ts` - Has both `log` and `default` export

**Recommendation:** Keep named exports, remove default exports.

---

## EXECUTION PLAN

### Automated Execution

**Instead of manual cleanup, use the automated script:**

```bash
# Step 1: Review this checklist and check boxes for files you want to KEEP

# Step 2: Preview what will be deleted (safe, no changes)
npm run cleanup:knip

# Step 3: Review the preview output in console and cleanup-log.txt

# Step 4: If satisfied, execute the cleanup (5 second countdown before deletion)
npm run cleanup:knip:execute
```

**The script will:**
- ✅ Only delete/uninstall items that are unchecked ([ ])
- ✅ Skip items that are checked ([x])
- ✅ Create backups in `.cleanup-backup/` before deleting files
- ✅ Log all actions to `cleanup-log.txt`
- ✅ Group actions by phase (files, dependencies, dev dependencies)

---

### Manual Execution (if preferred)

### Phase 1: Critical Fixes (Do First)
1. [ ] Add missing dependencies: `npm install --save nanoid && npm install --save-dev @eslint/js postcss`
2. [ ] Fix duplicate exports in welcome-email.tsx
3. [ ] Fix duplicate exports in axiom-logger.ts
4. [ ] Remove orphaned test files (CourseProgress.test.tsx, MarkdownMessage.test.tsx, course-parser.test.ts)

### Phase 2: Safe Deletions (High Confidence)
1. [ ] Delete checked utility scripts (scripts/*)
2. [ ] Delete checked archive files (docs/archive/*)
3. [ ] Uninstall checked unused dependencies
4. [ ] Uninstall checked unused dev dependencies

### Phase 3: Aceternity UI Cleanup (Optional - Only if bundle size is critical)
1. [ ] Delete checked Aceternity UI components
2. [ ] Test build to ensure no breakage
3. [ ] Can reinstall from aceternity-ui package if needed later

### Phase 4: Low Priority Cleanup
1. [ ] Remove unused exports from component files
2. [ ] Clean up unused types

---

## ESTIMATED IMPACT

**Disk Space Saved:**
- Scripts: ~200 KB
- Aceternity components: ~1-2 MB
- Dependencies: ~15-20 MB (node_modules)

**Bundle Size Reduction:**
- Removing unused deps: ~500 KB - 1 MB (production bundle)
- Removing Aceternity components: ~200-500 KB (if tree-shaking doesn't catch them)

**Risk Level:**
- Phase 1: LOW - These are fixes, not deletions
- Phase 2: LOW - High confidence unused code
- Phase 3: MEDIUM - May need components later
- Phase 4: LOW - Cleanup only

---

**Notes:**
- Review this file carefully before executing deletions
- Commit your work before starting cleanup
- Test the application after each phase
- Keep a backup of deleted scripts in case they're needed later
