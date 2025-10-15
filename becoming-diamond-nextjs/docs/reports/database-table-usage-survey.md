# Database Table Usage Survey

**Generated:** 2025-10-15
**Database:** Turso (becoming-diamond-leads)
**Total Tables:** 10

## Executive Summary

This survey identifies which database tables are actively used in the codebase and which may be residual from deprecated or non-existent code.

### Status Overview

- **✅ Actively Used:** 6 tables (60%)
- **⚠️ Partially Used:** 1 table (10%)
- **❌ Not Used:** 3 tables (30%)

---

## Table-by-Table Analysis

### 1. `users` ✅ ACTIVELY USED

**Purpose:** Core authentication table for user accounts

**Active References:**
- `src/lib/turso-adapter.ts:32` - INSERT INTO users (createUser)
- `src/lib/turso-adapter.ts:46` - SELECT FROM users (getUser)
- `src/lib/turso-adapter.ts:70` - SELECT FROM users (getUserByEmail)
- `src/lib/turso-adapter.ts:82-84` - JOIN with accounts (getUserByAccount)
- `src/lib/turso-adapter.ts:98` - UPDATE users (updateUser)
- `src/lib/turso-adapter.ts:112` - SELECT FROM users (after update)
- `src/lib/turso-adapter.ts:124` - DELETE FROM users (deleteUser)
- `src/lib/turso-adapter.ts:210` - JOIN with sessions (getSessionAndUser)
- `src/app/api/profile/route.ts:26` - SELECT user profile data
- `src/app/api/profile/route.ts:96` - UPDATE user name
- `src/app/api/profile/route.ts:131` - SELECT updated user data

**Usage Pattern:** Full CRUD operations
**Status:** ✅ PRODUCTION READY

---

### 2. `accounts` ✅ ACTIVELY USED

**Purpose:** OAuth provider account linking (Google, GitHub, Resend)

**Active References:**
- `src/lib/turso-adapter.ts:137-159` - INSERT INTO accounts (linkAccount)
- `src/lib/turso-adapter.ts:83-84` - JOIN in getUserByAccount
- `src/lib/turso-adapter.ts:169` - DELETE FROM accounts (unlinkAccount)

**Usage Pattern:** OAuth account management (create, join, delete)
**Status:** ✅ PRODUCTION READY

---

### 3. `sessions` ✅ ACTIVELY USED

**Purpose:** Database-backed user sessions (NextAuth strategy: "database")

**Active References:**
- `src/lib/turso-adapter.ts:180-189` - INSERT INTO sessions (createSession)
- `src/lib/turso-adapter.ts:209-211` - SELECT/JOIN with users (getSessionAndUser)
- `src/lib/turso-adapter.ts:238` - UPDATE sessions (updateSession - extend expiration)
- `src/lib/turso-adapter.ts:250` - DELETE FROM sessions (deleteSession)
- `auth.ts:36-40` - Session strategy configuration (database, 30 days max)

**False Positive:**
- `src/contexts/ChatContext.tsx` - Uses "sessions" for chat sessions (localStorage), NOT database table

**Usage Pattern:** Full session lifecycle management
**Status:** ✅ PRODUCTION READY

---

### 4. `verification_tokens` ✅ ACTIVELY USED

**Purpose:** Email magic link verification (Resend provider)

**Active References:**
- `src/lib/turso-adapter.ts:259-267` - INSERT INTO verification_tokens (createVerificationToken)
- `src/lib/turso-adapter.ts:276-289` - SELECT and DELETE (useVerificationToken - one-time use)
- `auth.ts:20-23` - Resend provider configuration (email magic links)

**Usage Pattern:** Create and consume (one-time use tokens)
**Status:** ✅ PRODUCTION READY

---

### 5. `user_profiles` ⚠️ PARTIALLY IMPLEMENTED

**Purpose:** Extended user data (bio, location, website, gamification fields)

**Active References:**
- `auth.ts:71-75` - INSERT INTO user_profiles (createUser event - auto-created on signup)
- `src/app/api/profile/route.ts:40-45` - SELECT profile fields (bio, location, website)
- `src/app/api/profile/route.ts:123-126` - UPDATE profile fields

**Unused Fields (TODOs in code):**
- `current_pr` - Not fetched (hardcoded to 1)
- `completed_prs` - Not fetched (hardcoded to empty array)
- `level` - Not fetched (hardcoded to "Initiate")
- `xp` - Not fetched (hardcoded to 0)
- `streak` - Not calculated (hardcoded to 0)

**References in code comments:**
```typescript
// src/app/api/profile/route.ts:57-61
currentPR: 1, // TODO: fetch from user progress
completedPRs: [], // TODO: fetch from user progress
level: 'Initiate', // TODO: calculate from user progress
xp: 0, // TODO: fetch from user progress
streak: 0, // TODO: calculate from activity
```

**Usage Pattern:** Partially implemented (profile fields working, gamification fields unused)
**Status:** ⚠️ NEEDS COMPLETION or consider removing unused columns

---

### 6. `leads` ✅ ACTIVELY USED

**Purpose:** Lead capture, email subscriptions, newsletter management

**Active References:**
- `src/app/api/leads/route.ts:76-78` - SELECT for duplicate check
- `src/app/api/leads/route.ts:103-123` - INSERT new lead
- `src/app/api/leads/route.ts:142-150` - UPDATE email delivery status
- `src/app/api/leads/route.ts:159-161` - UPDATE email failure status
- `src/app/api/leads/route.ts:183-186` - UPDATE email failure (catch block)
- `src/app/api/leads/route.ts:224-240` - SELECT with filters (GET endpoint)
- `src/app/api/leads/route.ts:245-265` - COUNT query for pagination
- `src/app/api/unsubscribe/route.ts:27-30` - SELECT by unsubscribe token
- `src/app/api/unsubscribe/route.ts:67-70` - UPDATE subscribed status
- `scripts/insert-test-lead.ts` - Test script

**Usage Pattern:** Full CRUD operations + unsubscribe flow
**Status:** ✅ PRODUCTION READY

---

### 7. `course_enrollments` ❌ NOT USED

**Purpose:** Track user course enrollments and progress

**Schema Fields:**
- `id`, `user_id`, `course_id`, `pressure_room`, `enrolled_at`, `started_at`, `completed_at`, `progress`, `status`

**References:** NONE found in TypeScript codebase

**Likely Reason:** Courses feature not yet implemented (member portal exists but no course enrollment logic)

**Status:** ❌ DEPRECATED - Can be safely dropped or reserved for future implementation

---

### 8. `lesson_progress` ❌ NOT USED

**Purpose:** Track completion of individual lessons within courses

**Schema Fields:**
- `id`, `user_id`, `course_id`, `lesson_id`, `completed`, `completed_at`, `time_spent`, `notes`

**References:** NONE found in TypeScript codebase

**Likely Reason:** Lesson tracking feature not implemented

**Status:** ❌ DEPRECATED - Can be safely dropped or reserved for future implementation

---

### 9. `user_activities` ❌ NOT USED

**Purpose:** Activity log for gamification and analytics

**Schema Fields:**
- `id`, `user_id`, `activity_type`, `description`, `metadata`, `created_at`

**References:** NONE found in TypeScript codebase

**Likely Reason:** Gamification/analytics tracking not implemented

**Status:** ❌ DEPRECATED - Can be safely dropped or reserved for future implementation

---

### 10. `user_achievements` ❌ NOT USED

**Purpose:** User achievement and badge system

**Schema Fields:**
- `id`, `user_id`, `achievement_key`, `title`, `description`, `earned_at`

**References:** NONE found in TypeScript codebase

**Likely Reason:** Achievement system not implemented

**Status:** ❌ DEPRECATED - Can be safely dropped or reserved for future implementation

---

## Recommendations

### Immediate Actions

1. **Drop Unused Tables** (if not planning immediate implementation):
   ```sql
   DROP TABLE IF EXISTS course_enrollments;
   DROP TABLE IF EXISTS lesson_progress;
   DROP TABLE IF EXISTS user_activities;
   DROP TABLE IF EXISTS user_achievements;
   ```

2. **Complete `user_profiles` Implementation** or simplify schema:
   - **Option A:** Implement gamification fields (current_pr, completed_prs, level, xp, streak)
   - **Option B:** Drop unused columns and keep only bio, location, website

3. **Update Migration File** (`migrations/000_consolidated_schema.sql`):
   - Remove course-related tables if dropping
   - Add comment explaining which tables are reserved for future use

### Future Considerations

If planning to implement course/gamification features:
- Keep table schemas as reference
- Move to separate migration file: `migrations/999_future_features.sql`
- Document in `docs/planning/future-features.md`

---

## Files Checked

### Production Code
- `src/lib/turso-adapter.ts` - NextAuth adapter (users, accounts, sessions, verification_tokens)
- `src/app/api/profile/route.ts` - User profile management (users, user_profiles)
- `src/app/api/leads/route.ts` - Lead capture API (leads)
- `src/app/api/unsubscribe/route.ts` - Unsubscribe flow (leads)
- `auth.ts` - Authentication configuration (user_profiles creation event)

### False Positives
- `src/contexts/ChatContext.tsx` - Chat "sessions" (localStorage, not database)

### Test/Utility Scripts
- `scripts/test-auth-setup.ts` - References expected tables
- `scripts/verify-tables.ts` - Generic table listing script
- `scripts/insert-test-lead.ts` - Lead insertion test

---

## Migration History

### Completed Migrations
1. ✅ `001_create_auth_tables.sql` - Created users, accounts, sessions, verification_tokens, user_profiles
2. ✅ `002_create_course_tables.sql` - Created course_enrollments, lesson_progress, user_activities, user_achievements
3. ✅ `003_add_email_tracking_to_leads.sql` - Created leads table with email tracking
4. ✅ `004_drop_utm_columns.sql` - Removed UTM tracking columns

### Current State
- All migrations consolidated to `000_consolidated_schema.sql`
- Old migration files deleted (001-004)
- Fresh database created with consolidated schema

---

## Conclusion

**Healthy Tables (6):** users, accounts, sessions, verification_tokens, user_profiles (partial), leads
**Unused/Future Tables (4):** course_enrollments, lesson_progress, user_activities, user_achievements

The authentication and lead capture systems are fully functional. Course and gamification features appear to be planned but not implemented. Recommend cleaning up unused tables or documenting them as reserved for future use.
