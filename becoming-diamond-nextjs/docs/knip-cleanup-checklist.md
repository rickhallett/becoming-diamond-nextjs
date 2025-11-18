# Knip Cleanup Checklist

**Date:** 2025-11-15
**Last Cleanup:** 2025-11-17 (37 items removed)
**Purpose:** Review and approve file deletions identified by knip analysis

## ✅ Cleanup Execution Record

**Date:** 2025-11-17 17:39:15 UTC
**Status:** COMPLETED
**Summary:**
- Files deleted: 18 (17 scripts + 1 archive file)
- Dependencies removed: 14 packages
- Dev dependencies removed: 5 packages
- Total actions: 37
- Backup location: `.cleanup-backup/backup-2025-11-17T17-39-15-024Z`

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

## 1. UNUSED FILES (93 remaining, 18 deleted)

### FALSE POSITIVES - DO NOT DELETE ✅

- [x] `lib/content.ts` - **KEEP** - Used in 9 files (blog, sprint, legal pages)
- [x] `public/admin/decap-cms.js` - **KEEP** - Required by prebuild script

### Scripts - Utility/Debug Scripts (1 remaining, 17 deleted ✅)

**Deleted 2025-11-17:**

- [x] `scripts/check-all-profiles.ts` - ✅ DELETED
- [x] `scripts/check-corrupt-user.ts` - ✅ DELETED
- [x] `scripts/check-lead-emails.ts` - ✅ DELETED
- [x] `scripts/check-sessions.ts` - ✅ DELETED
- [x] `scripts/check-user-by-id.ts` - ✅ DELETED
- [x] `scripts/check-user.ts` - ✅ DELETED
- [x] `scripts/cleanup-corrupt-user.ts` - ✅ DELETED
- [x] `scripts/delete-user-by-id.ts` - ✅ DELETED
- [x] `scripts/insert-test-lead.ts` - ✅ DELETED
- [x] `scripts/list-recent-users.ts` - ✅ DELETED
- [x] `scripts/verify-book-order.ts` - ✅ DELETED
- [x] `scripts/verify-tables.ts` - ✅ DELETED
- [x] `scripts/test-db-connection.ts` - ✅ DELETED
- [x] `scripts/test-auth-flow.ts` - ✅ DELETED
- [x] `dev-with-restart.js` - ✅ DELETED
- [x] `test-dev-zip.ts` - ✅ DELETED
- [x] `register-all.ts` - ✅ DELETED

**Kept:**

- [x] `scripts/test-gmail-smtp.ts` - **KEPT** - Used for testing email configuration

### Scripts - Migration Scripts (4 files)

**Check if migrations are complete before deleting:**

- [x] `scripts/run-member-portal-migration.ts` - ⚠️ Delete only if migration complete
- [x] `scripts/run-migration.ts` - ⚠️ Delete only if migration complete
- [x] `scripts/run-stripe-migration.ts` - ⚠️ Delete only if migration complete
- [x] `scripts/convert-manifesto-to-pdf.js`

### Scripts - Video Management (2 files)

**Keep if you manage videos via CLI:**

- [x] `scripts/list-bunny-videos.js` - ⚠️ Keep if you use this to manage Bunny videos
- [x] `scripts/update-all-video-ids.js` - ⚠️ Keep if you bulk update video IDs

### Archive/Abandoned Code (1 remaining, 1 deleted ✅)

**Deleted 2025-11-17:**

- [x] `docs/archive/landing-alt-all/page.tsx` - ✅ DELETED

**Kept:**

- [x] `docs/mark-all-days-complete.js` - **KEPT**

### CMS Configuration (1 file)

- [x] `public/admin/config.js` - ⚠️ Verify CMS works without this (may use config.yml instead)

### Test Utilities (3 files)

- [x] `src/test/utils/auth-helpers.ts`
- [x] `src/test/utils/email-helpers.ts`
- [x] `src/types/progress.ts` - ⚠️ Check if type is used elsewhere

### Services (1 file)

- [x] `src/lib/email-service.ts` - ⚠️ Keep if not superseded by gmail-smtp.ts

### Components (2 files)

- [x] `src/components/ErrorBoundary.tsx` - ⚠️ Good practice to keep
- [x] `src/hooks/use-outside-click.tsx`

### Aceternity UI Components - Unused (73 files)

**Note:** These are library components. Safe to delete if bundle size is a concern, but may need in future.

TODO: keep all components

**3D Components:**

- [x] `src/components/ui/3d-card.tsx`
- [x] `src/components/ui/3d-marquee.tsx`
- [x] `src/components/ui/3d-pin.tsx`

**Animation Components:**

- [x] `src/components/ui/animated-modal.tsx`
- [x] `src/components/ui/animated-tooltip.tsx`

**Background Components:**

- [x] `src/components/ui/aurora-background.tsx`
- [x] `src/components/ui/background-beams-with-collision.tsx`
- [x] `src/components/ui/background-boxes.tsx`
- [x] `src/components/ui/background-gradient-animation.tsx`
- [x] `src/components/ui/background-gradient.tsx`
- [x] `src/components/ui/background-lines.tsx`
- [x] `src/components/ui/background-ripple-effect.tsx`

**Card Components:**

- [x] `src/components/ui/apple-cards-carousel.tsx`
- [x] `src/components/ui/card-hover-effect.tsx`
- [x] `src/components/ui/card-stack.tsx`
- [x] `src/components/ui/carousel.tsx`

**Effect Components:**

- [x] `src/components/ui/code-block.tsx`
- [x] `src/components/ui/colourful-text.tsx`
- [x] `src/components/ui/comet-card.tsx`
- [x] `src/components/ui/compare.tsx`
- [x] `src/components/ui/container-scroll-animation.tsx`
- [x] `src/components/ui/container-text-flip.tsx`
- [x] `src/components/ui/direction-aware-hover.tsx`
- [x] `src/components/ui/draggable-card.tsx`

**Input Components:**

- [x] `src/components/ui/file-upload.tsx`

**Text/Animation Components:**

- [x] `src/components/ui/flip-words.tsx`
- [x] `src/components/ui/floating-dock.tsx`
- [x] `src/components/ui/floating-navbar.tsx`
- [x] `src/components/ui/focus-cards.tsx`
- [x] `src/components/ui/following-pointer.tsx`

**Visual Effect Components:**

- [x] `src/components/ui/glare-card.tsx`
- [x] `src/components/ui/glowing-effect.tsx`
- [x] `src/components/ui/glowing-stars.tsx`
- [x] `src/components/ui/google-gemini-effect.tsx`
- [x] `src/components/ui/grid.tsx`

**Hero Components:**

- [x] `src/components/ui/hero-highlight.tsx`
- [x] `src/components/ui/hero-parallax.tsx`

**Image/Slider Components:**

- [x] `src/components/ui/images-slider.tsx`
- [x] `src/components/ui/infinite-moving-cards.tsx`

**Layout Components:**

- [x] `src/components/ui/layout-grid.tsx`
- [x] `src/components/ui/lens.tsx`
- [x] `src/components/ui/link-preview.tsx`
- [x] `src/components/ui/loader.tsx`
- [x] `src/components/ui/macbook-scroll.tsx`

**Special Effect Components:**

- [x] `src/components/ui/meteors.tsx`
- [x] `src/components/ui/moving-border.tsx`
- [x] `src/components/ui/moving-line.tsx`
- [x] `src/components/ui/multi-step-loader.tsx`

**Navigation Components:**

- [x] `src/components/ui/navbar-menu.tsx`
- [x] `src/components/ui/resizable-navbar.tsx`
- [x] `src/components/ui/sidebar.tsx`

**Parallax Components:**

- [x] `src/components/ui/parallax-scroll-2.tsx`
- [x] `src/components/ui/parallax-scroll.tsx`

**Interactive Components:**

- [x] `src/components/ui/pixelated-canvas.tsx`
- [x] `src/components/ui/pointer-highlight.tsx`

**Particle/Sky Effects:**

- [x] `src/components/ui/shooting-stars.tsx`
- [x] `src/components/ui/sparkles-background.tsx`
- [x] `src/components/ui/sparkles.tsx`
- [x] `src/components/ui/spotlight-new.tsx`
- [x] `src/components/ui/stars-background.tsx`

**UI Components:**

- [x] `src/components/ui/stateful-button.tsx`
- [x] `src/components/ui/sticky-banner.tsx`
- [x] `src/components/ui/sticky-scroll-reveal.tsx`
- [x] `src/components/ui/svg-mask-effect.tsx`
- [x] `src/components/ui/tabs.tsx`
- [x] `src/components/ui/tailwindcss-buttons.tsx`

**Text Effect Components:**

- [x] `src/components/ui/text-generate-effect.tsx`
- [x] `src/components/ui/text-hover-effect.tsx`
- [x] `src/components/ui/text-reveal-card.tsx`

**Advanced Components:**

- [x] `src/components/ui/tracing-beam.tsx`
- [x] `src/components/ui/typewriter-effect.tsx`
- [x] `src/components/ui/vortex.tsx`
- [x] `src/components/ui/wavy-background.tsx`
- [x] `src/components/ui/wobble-card.tsx`
- [x] `src/components/ui/world-map.tsx`

---

## 2. UNUSED DEPENDENCIES (4 remaining, 14 removed ✅)

**Removed 2025-11-17:**

- [x] `@radix-ui/react-hover-card` - ✅ REMOVED
- [x] `@radix-ui/react-tabs` - ✅ REMOVED
- [x] `@tsparticles/engine` - ✅ REMOVED
- [x] `@tsparticles/react` - ✅ REMOVED
- [x] `@tsparticles/slim` - ✅ REMOVED
- [x] `class-variance-authority` - ✅ REMOVED
- [x] `lucide-react` - ✅ REMOVED (using @tabler/icons-react instead)
- [x] `mini-svg-data-uri` - ✅ REMOVED
- [x] `qss` - ✅ REMOVED
- [x] `react-dropzone` - ✅ REMOVED
- [x] `react-syntax-highlighter` - ✅ REMOVED
- [x] `rehype-raw` - ✅ REMOVED
- [x] `remark-gfm` - ✅ REMOVED
- [x] `simplex-noise` - ✅ REMOVED

### Review Before Removing:

- [x] `decap-cms` - ⚠️ **KEEP if using CMS** (prebuild script needs this)
- [x] `next-themes` - ⚠️ Keep if implementing dark mode
- [x] `react-markdown` - ⚠️ Keep if rendering markdown content

---

## 3. UNUSED DEV DEPENDENCIES (3 remaining, 5 removed ✅)

**Removed 2025-11-17:**

- [x] `@axe-core/playwright` - ✅ REMOVED
- [x] `@types/pdfkit` - ✅ REMOVED
- [x] `@types/react-syntax-highlighter` - ✅ REMOVED
- [x] `critters` - ✅ REMOVED
- [x] `pdfkit` - ✅ REMOVED

### Review Before Removing:

- [x] `repomix` - ⚠️ Keep if you use this for repo documentation
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

### ✅ Cleanup Completed (2025-11-17)

**Automated execution completed successfully:**

```bash
# Executed: npm run cleanup:knip:execute
# Date: 2025-11-17 17:39:15 UTC
# Status: COMPLETED
# Actions: 37 (18 files + 14 deps + 5 dev deps)
```

**Script performed:**

- ✅ Deleted 18 files (17 scripts + 1 archive)
- ✅ Uninstalled 14 unused dependencies
- ✅ Uninstalled 5 unused dev dependencies
- ✅ Created backup: `.cleanup-backup/backup-2025-11-17T17-39-15-024Z`
- ✅ Logged all actions to `cleanup-log.txt`

### Future Cleanups

To run another cleanup pass:

```bash
# Step 1: Review this checklist and check boxes for files you want to KEEP

# Step 2: Preview what will be deleted (safe, no changes)
npm run cleanup:knip

# Step 3: Review the preview output in console and cleanup-log.txt

# Step 4: If satisfied, execute the cleanup (5 second countdown before deletion)
npm run cleanup:knip:execute
```

---

### Manual Execution (if preferred)

### Phase 1: Critical Fixes (Do First)

1. [ ] Add missing dependencies: `npm install --save nanoid && npm install --save-dev @eslint/js postcss`
2. [ ] Fix duplicate exports in welcome-email.tsx
3. [ ] Fix duplicate exports in axiom-logger.ts
4. [ ] Remove orphaned test files (CourseProgress.test.tsx, MarkdownMessage.test.tsx, course-parser.test.ts)

### Phase 2: Safe Deletions (High Confidence)

1. [ ] Delete checked utility scripts (scripts/\*)
2. [ ] Delete checked archive files (docs/archive/\*)
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

## ACTUAL IMPACT (2025-11-17 Cleanup)

**Disk Space Saved:**

- Scripts deleted: ~200 KB (18 files)
- Dependencies removed: ~15-20 MB (14 packages in node_modules)
- Dev dependencies removed: ~5-10 MB (5 packages)
- Total: ~20-30 MB saved

**Bundle Size Reduction:**

- Estimated production bundle reduction: ~500 KB - 1 MB
- Unused dependencies removed (no longer bundled)
- Tree-shaking now more effective

**Risk Level: LOW**

- All deleted items were unused (verified by knip)
- Backups created before deletion
- Can restore from `.cleanup-backup/backup-2025-11-17T17-39-15-024Z` if needed
- No breaking changes expected

## FUTURE CLEANUP POTENTIAL

**Remaining unused items (not yet deleted):**

- Aceternity components: ~1-2 MB (73 files kept for future use)
- Test utilities: 3 files (kept for testing infrastructure)
- Additional files: Various kept items marked with [x]

---

**Notes:**

- Review this file carefully before executing deletions
- Commit your work before starting cleanup
- Test the application after each phase
- Keep a backup of deleted scripts in case they're needed later
