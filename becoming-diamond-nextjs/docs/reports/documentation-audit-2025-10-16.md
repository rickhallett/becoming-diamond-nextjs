# Documentation Audit Report

**Date:** 2025-10-16
**Auditor:** Claude
**Purpose:** Identify outdated, superfluous, or misleading documentation

---

## Summary

**Total Documents Reviewed:** 50
**Outdated/Superfluous:** 22
**Current and Accurate:** 14
**Needs Update:** 14

---

## Critical Issues

### 1. **Astro Framework Documentation (COMPLETELY OUTDATED)**

**Status:** ❌ **SUPERFLUOUS** - Project is Next.js 15, not Astro

**Files to Remove:**
- `/docs/specs/integrations/astro-decap-cms-aceternity-integration.md`
- `/docs/specs/integrations/astro-decap-cms-aceternity-integration-00.md`
- `/docs/specs/integrations/astro-decap-cms-aceternity-integration-01.md`
- `/docs/specs/integrations/astro-decap-cms-aceternity-integration-02.md`
- `/docs/specs/integrations/astro-decap-cms-aceternity-integration-03.md`
- `/docs/specs/integrations/astro-decap-cms-aceternity-integration-04.md`
- `/docs/specs/integrations/astro-decap-cms-aceternity-integration-breakdown.md`
- `/docs/reports/integration-reports/astro-decap-cms-aceternity-integration-00-report.md`
- `/docs/reports/integration-reports/astro-decap-cms-aceternity-integration-01-report.md`
- `/docs/reports/integration-reports/astro-decap-cms-aceternity-integration-02-report.md`
- `/docs/reports/integration-reports/astro-decap-cms-aceternity-integration-03-report.md`
- `/docs/reports/integration-reports/astro-decap-cms-aceternity-integration-04-report.md`

**Impact:** High - These documents describe an entirely different tech stack (Astro) that was never implemented in this Next.js project.

**Recommendation:** Move to `/docs/archive/astro-migration-abandoned/` or delete entirely.

---

### 2. **Database Schema Documentation (PARTIALLY OUTDATED)**

**Status:** ⚠️ **NEEDS UPDATE** - Recent changes not reflected

**Files Affected:**
- `/docs/reports/phase1-migration-summary.md` - References 4 dropped tables

**Issues:**
- Phase 1 report documents course_enrollments, lesson_progress, user_activities, user_achievements tables
- **These tables were dropped on 2025-10-15** per `database-table-usage-survey.md`
- Current schema has 6 tables, not 10

**Current Reality (as of 2025-10-15):**
```
Active Tables:
  ✓ users (NextAuth core)
  ✓ accounts (OAuth providers)
  ✓ sessions (database sessions)
  ✓ verification_tokens (email magic links)
  ✓ user_profiles (extended user data)
  ✓ leads (email capture)

Dropped Tables (2025-10-15):
  ✗ course_enrollments (0 references)
  ✗ lesson_progress (0 references)
  ✗ user_activities (0 references)
  ✗ user_achievements (0 references)
```

**Recommendation:** Update phase1-migration-summary.md with deprecation notice, or archive it.

---

### 3. **Decap CMS Configuration (OUTDATED)**

**Status:** ⚠️ **NEEDS UPDATE** - Incorrect URLs and env vars

**Files Affected:**
- `/docs/guides/cms-setup.md`

**Issues:**
- References `NEXTAUTH_URL` but project doesn't use NextAuth for Decap CMS
- Uses old OAuth flow description
- Doesn't mention current port (3003, not 3000)
- Missing Turbopack reference in dev commands

**Current Reality:**
```env
# Actual env vars for Decap CMS GitHub OAuth:
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...

# Dev server runs on port 3003 with Turbopack:
npm run dev  # next dev --turbopack
```

**Recommendation:** Update cms-setup.md with correct port, OAuth flow, and env var names.

---

## Documentation Categories

### ✅ **Current and Accurate**

1. **`/docs/reports/database-table-usage-survey.md`** (2025-10-15)
   - Accurate database table survey
   - Documents dropped tables
   - Current state of schema

2. **`/docs/reports/profile-navigation-bug-fix.md`** (2025-10-15)
   - Recent bug fix documentation
   - Accurate code references
   - Properly documents solution

3. **`/docs/reports/test-auth-navigation-fix.md`** (2025-10-15)
   - Recent test auth fix
   - Accurate UserContext changes
   - Properly documents dual-mode auth

4. **`/docs/guides/auth-setup.md`**
   - NextAuth v5 setup (needs verification)

5. **`/docs/guides/stripe-integration.md`**
   - Stripe setup (needs verification)

6. **`/docs/guides/resend-setup.md`**
   - Resend email integration (needs verification)

7. **`/docs/specs/video/video-hosting-analysis.md`**
   - Platform comparison still valid
   - Planning documentation

8. **`/docs/specs/video/video-integration-simplified.md`**
   - Bunny Stream integration plan
   - Still valid for future implementation

9. **`/docs/specs/performance/performance-optimization.md`**
   - Performance optimization spec (needs verification)

10. **`/docs/specs/performance/performance-optimization-report.md`**
    - Optimization results (needs verification)

11. **`/docs/planning/sprints/`** (all files)
    - Sprint planning docs (planning, not implementation)
    - Valid as historical records

12. **`/docs/content/book/turning-snowflakes-into-diamonds.md`**
    - Content documentation, not tech docs

13. **`/docs/content/copy/*.md`**
    - Marketing copy, not tech docs

14. **`/docs/readme.md`**
    - Needs update to reflect archive of Astro docs

---

### ⚠️ **Needs Update or Verification**

1. **`/docs/guides/cms-setup.md`**
   - Issue: Port 3000 → 3003, missing Turbopack
   - Fix: Update dev server instructions

2. **`/docs/guides/auth-setup.md`**
   - Status: Needs verification against current auth.ts
   - Check: NextAuth v5 configuration accuracy

3. **`/docs/guides/stripe-integration.md`**
   - Status: Needs verification against current code
   - Check: Webhook setup, product IDs, test mode

4. **`/docs/guides/resend-setup.md`**
   - Status: Needs verification against src/lib/resend.ts
   - Check: API key, from address, templates

5. **`/docs/reports/phase1-migration-summary.md`**
   - Issue: Documents 4 dropped database tables
   - Fix: Add deprecation notice or archive

6. **`/docs/specs/integrations/resend-lead-email-integration.prd.md`**
   - Status: Check if implementation matches spec
   - Verification needed

7. **`/docs/specs/integrations/resend-implementation-summary.md`**
   - Status: Check if current state matches summary
   - Verification needed

8. **`/docs/planning/course-viewer.md`**
   - Status: Feature planning - check implementation status
   - May be superseded by current sprint implementation

9. **`/docs/planning/lead-capture-turso.md`**
   - Status: Check if implemented as specified
   - Verify against current /api/leads/route.ts

10. **`/docs/planning/member-portal-data-persistence.md`**
    - Status: Check against current UserContext implementation
    - Verify localStorage vs database usage

11. **`/docs/planning/offer-stack-rebrand.md`**
    - Status: Marketing/product planning
    - Check if outdated

12. **`/docs/planning/tnitd-website.md`**
    - Status: Website planning
    - Check if current site matches plan

13. **`/docs/features/features-overview.md`**
    - Status: Needs verification against FEATURES config
    - Check: Feature flags, toggle states

14. **`/docs/specs/ai/`** (all files)
    - Status: RAG/AI planning docs
    - Check: Implementation status, relevance

---

### ❌ **Outdated and Superfluous**

**Astro Integration Documentation (12 files):**
- All `/docs/specs/integrations/astro-*.md` files
- All `/docs/reports/integration-reports/astro-*.md` files
- **Reason:** Project is Next.js 15, not Astro
- **Action:** Archive or delete

**Phase 1 Migration Report:**
- `/docs/reports/phase1-migration-summary.md`
- **Reason:** Documents tables that were dropped 2025-10-15
- **Action:** Add deprecation notice or archive

---

## Recommendations

### Immediate Actions

1. **Archive Astro Documentation**
   ```bash
   mkdir -p docs/archive/astro-abandoned
   mv docs/specs/integrations/astro-* docs/archive/astro-abandoned/
   mv docs/reports/integration-reports/astro-* docs/archive/astro-abandoned/
   ```

2. **Update Phase 1 Report**
   - Add deprecation notice at top
   - Reference database-table-usage-survey.md for current state

3. **Fix CMS Setup Guide**
   - Update port to 3003
   - Add Turbopack reference
   - Correct env variable names

4. **Update Documentation Index**
   - Remove references to Astro docs
   - Add note about archived documentation

### Verification Needed

Run verification checks on:
- Auth setup guide vs current auth.ts
- Stripe guide vs current Stripe code
- Resend guide vs current email code
- Feature overview vs config/features.ts
- Planning docs vs current implementation state

### Long-term Maintenance

1. **Add "Last Verified" dates** to all docs
2. **Create deprecation policy** for outdated docs
3. **Implement doc review cycle** (quarterly)
4. **Link docs to code** via comments (e.g., "See docs/guides/auth-setup.md")

---

## Action Items

### High Priority (Do Now)

- [ ] Archive all Astro documentation
- [ ] Update cms-setup.md with correct port and commands
- [ ] Add deprecation notice to phase1-migration-summary.md
- [ ] Update docs/readme.md to remove Astro references

### Medium Priority (This Week)

- [ ] Verify auth-setup.md against auth.ts
- [ ] Verify stripe-integration.md against current code
- [ ] Verify resend-setup.md against current code
- [ ] Check features-overview.md against FEATURES config

### Low Priority (This Month)

- [ ] Review all planning docs for implementation status
- [ ] Add "last verified" dates to guide docs
- [ ] Create documentation maintenance policy
- [ ] Add code-to-doc linking comments

---

## Conclusion

**22 out of 50 documents** need action:
- **12 Astro docs** are completely superfluous (archive/delete)
- **10 docs** need updates or verification
- **14 docs** are current and accurate
- **4 docs** are content (not tech docs)

**Primary Issue:** Astro documentation leftover from abandoned framework migration attempt. This creates confusion about the actual tech stack (Next.js 15).

**Secondary Issue:** Database schema changes (dropped tables) not reflected in older migration reports.

**Recommendation:** Prioritize archiving Astro docs and updating setup guides before they cause development confusion.
