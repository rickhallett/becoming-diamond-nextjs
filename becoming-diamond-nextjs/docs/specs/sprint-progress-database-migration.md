# Sprint Progress Database Implementation - Scope Estimate

**Feature**: Cross-device sprint progress synchronization via Turso database

**Current State**: Sprint progress stored in browser localStorage (device-specific, no sync)

**Target State**: Sprint progress stored in Turso database (cross-device sync, persistent, backed up)

**Estimated Effort**: 4-5 hours (half day)

**Priority**: Medium-High (significant UX improvement)

**Risk Level**: Very Low (no live users, no migration needed)

**Note**: No live users yet, so no data migration required. This is a clean implementation.

---

## Executive Summary

**Simplified Scope**: Since there are no live users, we can skip all migration complexity:
- ❌ No localStorage fallback needed
- ❌ No migration banner/UI
- ❌ No data import/export tools
- ❌ No dual-mode (API + localStorage) complexity
- ✅ Clean API-only implementation
- ✅ Simpler codebase
- ✅ Faster development (4-5 hours vs 6-8 hours)

**Key Changes**:
1. Database table for sprint progress (1 table, 3 indexes)
2. Three API endpoints (GET, complete-day, reset)
3. Refactor client library to be fully async
4. Update 4 components to handle async operations
5. Remove all localStorage code

**Deliverables**:
- Cross-device progress synchronization
- Persistent progress storage
- Clean, maintainable codebase
- Foundation for future analytics

---

## Table of Contents

1. [Current Implementation Analysis](#current-implementation-analysis)
2. [Scope of Work](#scope-of-work)
3. [Database Schema Design](#database-schema-design)
4. [API Endpoints](#api-endpoints)
5. [Client-Side Changes](#client-side-changes)
6. [Implementation Strategy](#implementation-strategy)
7. [Testing Requirements](#testing-requirements)
8. [Timeline & Effort Breakdown](#timeline--effort-breakdown)
9. [Risks & Mitigations](#risks--mitigations)
10. [Success Criteria](#success-criteria)

---

## Current Implementation Analysis

### Existing Code Structure

**Core Module**: `src/lib/sprint-progress.ts`
- 231 lines of code
- Client-side only (localStorage)
- Well-structured with clear interfaces
- 12 exported functions

**Key Functions**:
```typescript
getProgress()              // Reads from localStorage
saveProgress()             // Writes to localStorage
markDayComplete()          // Updates progress
isDayAccessible()          // Checks unlock status
isDayCompleted()           // Checks completion status
calculateStreak()          // Calculates consecutive days
getProgressStats()         // Returns dashboard stats
resetProgress()            // Clears all data
exportProgress()           // JSON export
importProgress()           // JSON import
```

**Data Model**:
```typescript
interface SprintProgress {
  sprintId: string;                 // '30-day-sprint'
  enrollmentDate: string;           // ISO 8601 timestamp
  completedDays: number[];          // [1, 2, 3, ...]
  currentDay: number;               // 1-30
  totalDaysCompleted: number;       // Count
  completionPercentage: number;     // 0-100
  status: 'not_started' | 'in_progress' | 'completed';
  lastAccessDate: string;           // ISO 8601 timestamp
  createdAt: string;                // ISO 8601 timestamp
  updatedAt: string;                // ISO 8601 timestamp
}
```

### Usage Points

**Components using sprint progress**:
1. `/app/sprint/page.tsx` - Overview page (stats display)
2. `/app/sprint/dashboard/page.tsx` - Dashboard with all days
3. `/app/sprint/day/[dayNumber]/page.tsx` - Individual day page
4. `/app/sprint/watch/page.tsx` - Playlist mode
5. `/components/sprint/DayCard.tsx` - Day card component
6. `/components/sprint/ProgressBar.tsx` - Progress visualization
7. `/components/sprint/StatsCard.tsx` - Stats display

**API Endpoints** (currently):
- `/api/sprint/[dayNumber]/route.ts` - Fetches day content (no progress)
- `/api/sprint/days/route.ts` - Fetches all days (no progress)

**Current Flow**:
```
User Action → Client Component → sprint-progress.ts → localStorage
```

---

## Scope of Work

### In Scope

1. **Database Schema**
   - Create `sprint_progress` table
   - Create indexes for performance
   - Migration script

2. **API Layer**
   - GET `/api/sprint/progress` - Fetch user's progress
   - POST `/api/sprint/progress/complete-day` - Mark day complete
   - POST `/api/sprint/progress/reset` - Reset progress (with auth check)

3. **Client Library Refactor**
   - Modify `src/lib/sprint-progress.ts` to use API
   - Remove localStorage entirely (no users to migrate)
   - Add loading states
   - Error handling with user-friendly messages

4. **Component Updates**
   - Add loading states to components
   - Handle API errors gracefully
   - Remove localStorage fallback code

5. **Testing**
   - API endpoint tests
   - Client library tests
   - E2E tests for core flows

### Out of Scope

1. **Data Migration** - No live users, not needed
2. **localStorage Fallback** - No legacy data, can remove entirely
3. **Migration Banner/UI** - Not applicable
4. Offline support (requires service workers)
5. Real-time sync across devices (requires websockets)
6. Conflict resolution for simultaneous updates
7. Progress analytics/reporting
8. Admin dashboard for viewing user progress
9. Multiple sprint support (future enhancement)

---

## Database Schema Design

### Table: `sprint_progress`

```sql
-- Sprint progress tracking table
CREATE TABLE IF NOT EXISTS sprint_progress (
  id TEXT PRIMARY KEY,                    -- UUID
  user_id TEXT NOT NULL UNIQUE,           -- One progress per user
  sprint_id TEXT NOT NULL DEFAULT '30-day-sprint',
  enrollment_date TEXT NOT NULL,          -- ISO 8601
  completed_days TEXT NOT NULL DEFAULT '[]', -- JSON array: [1, 2, 3, ...]
  current_day INTEGER NOT NULL DEFAULT 1, -- 1-30
  total_days_completed INTEGER DEFAULT 0,
  completion_percentage REAL DEFAULT 0,   -- 0.0-100.0
  status TEXT NOT NULL DEFAULT 'not_started'
    CHECK (status IN ('not_started', 'in_progress', 'completed')),
  last_access_date TEXT NOT NULL,         -- ISO 8601
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch()),

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sprint_progress_user_id
  ON sprint_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_sprint_progress_status
  ON sprint_progress(status);
CREATE INDEX IF NOT EXISTS idx_sprint_progress_updated_at
  ON sprint_progress(updated_at DESC);
```

**Design Notes**:
- Store `completed_days` as JSON array (SQLite supports JSON functions)
- One row per user (enforced by UNIQUE on user_id)
- Denormalize stats (total_days_completed, completion_percentage) for query performance
- Cascade delete on user deletion (cleanup)

**Alternative Design** (normalized):
```sql
CREATE TABLE sprint_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  -- ... other fields
);

CREATE TABLE sprint_day_completions (
  id TEXT PRIMARY KEY,
  progress_id TEXT NOT NULL,
  day_number INTEGER NOT NULL,
  completed_at TEXT NOT NULL,
  FOREIGN KEY (progress_id) REFERENCES sprint_progress(id) ON DELETE CASCADE,
  UNIQUE(progress_id, day_number)
);
```

**Recommendation**: Use denormalized design (JSON array) because:
- Simpler queries
- Fewer joins
- Better performance for small arrays (max 30 items)
- Easier migration from localStorage structure

---

## API Endpoints

### 1. GET `/api/sprint/progress`

**Purpose**: Fetch current user's sprint progress

**Auth**: Required (NextAuth session)

**Request**:
```typescript
GET /api/sprint/progress
Authorization: Session cookie
```

**Response** (200 OK):
```json
{
  "success": true,
  "progress": {
    "sprintId": "30-day-sprint",
    "enrollmentDate": "2025-11-15T10:00:00.000Z",
    "completedDays": [1, 2, 3, 4, 5],
    "currentDay": 6,
    "totalDaysCompleted": 5,
    "completionPercentage": 16.67,
    "status": "in_progress",
    "lastAccessDate": "2025-11-15T14:30:00.000Z",
    "createdAt": "2025-11-15T10:00:00.000Z",
    "updatedAt": "2025-11-15T14:30:00.000Z"
  }
}
```

**Response** (404 Not Found - first time user):
```json
{
  "success": true,
  "progress": null
}
```

**Implementation**:
```typescript
// src/app/api/sprint/progress/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const result = await db.execute({
    sql: 'SELECT * FROM sprint_progress WHERE user_id = ?',
    args: [session.user.id]
  });

  if (result.rows.length === 0) {
    return NextResponse.json({ success: true, progress: null });
  }

  const row = result.rows[0];
  const progress = {
    sprintId: row.sprint_id,
    enrollmentDate: row.enrollment_date,
    completedDays: JSON.parse(row.completed_days as string),
    currentDay: row.current_day,
    totalDaysCompleted: row.total_days_completed,
    completionPercentage: row.completion_percentage,
    status: row.status,
    lastAccessDate: row.last_access_date,
    createdAt: new Date(row.created_at as number * 1000).toISOString(),
    updatedAt: new Date(row.updated_at as number * 1000).toISOString(),
  };

  return NextResponse.json({ success: true, progress });
}
```

---

### 2. POST `/api/sprint/progress/complete-day`

**Purpose**: Mark a specific day as complete (optimized endpoint)

**Auth**: Required

**Request**:
```json
{
  "dayNumber": 5
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "progress": { /* updated progress */ },
  "dayCompleted": 5,
  "streak": 5
}
```

**Business Logic**:
- Verify day is accessible (previous day completed or day 1)
- Add to `completed_days` array
- Update `current_day` to next day
- Recalculate `total_days_completed` and `completion_percentage`
- Update `status` to 'completed' if all 30 days done
- Update `last_access_date` and `updated_at`

---

### 3. POST `/api/sprint/progress/reset`

**Purpose**: Reset user's sprint progress

**Auth**: Required

**Request**: Empty body or `{ "confirm": true }`

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Sprint progress reset successfully"
}
```

**Implementation**: DELETE from database

---

## Client-Side Changes

### Updated `src/lib/sprint-progress.ts`

**Strategy**: Pure API-based - No localStorage

**Benefits**:
- Simpler codebase (no dual mode complexity)
- Always in sync across devices
- No migration code needed
- Cleaner implementation

**New Implementation Pattern**:

```typescript
// All functions become async and call API
let cachedProgress: SprintProgress | null = null;

export async function getProgress(): Promise<SprintProgress> {
  try {
    const response = await fetch('/api/sprint/progress');
    const data = await response.json();

    if (data.progress) {
      cachedProgress = data.progress;
      return data.progress;
    }

    // Initialize new progress for first-time users
    return initializeProgress();
  } catch (error) {
    log.error('Failed to fetch progress from server', 'Lib', error);

    // Return cached version if available
    if (cachedProgress) {
      return cachedProgress;
    }

    // Last resort: return initialized progress
    return initializeProgress();
  }
}

export async function markDayComplete(dayNumber: number): Promise<SprintProgress> {
  try {
    const response = await fetch('/api/sprint/progress/complete-day', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dayNumber })
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to complete day');
    }

    // Update cache
    cachedProgress = data.progress;
    return data.progress;
  } catch (error) {
    log.error('Failed to mark day complete', 'Lib', error);
    throw error; // Re-throw so UI can handle
  }
}

export async function isDayAccessible(dayNumber: number): Promise<boolean> {
  if (dayNumber === 1) return true;

  const progress = await getProgress();
  return dayNumber <= progress.currentDay;
}

export async function isDayCompleted(dayNumber: number): Promise<boolean> {
  const progress = await getProgress();
  return progress.completedDays.includes(dayNumber);
}

export async function resetProgress(): Promise<void> {
  try {
    await fetch('/api/sprint/progress/reset', { method: 'POST' });
    cachedProgress = null;
  } catch (error) {
    log.error('Failed to reset progress', 'Lib', error);
    throw error;
  }
}

// Remove: exportProgress, importProgress, migrateLocalProgressToServer
// These are no longer needed
```

---

### Component Changes

**1. Sprint Overview Page** (`/app/sprint/page.tsx`)

**Current**:
```typescript
useEffect(() => {
  setMounted(true);
  setStats(getProgressStats());
}, []);
```

**New**:
```typescript
const [loading, setLoading] = useState(true);

useEffect(() => {
  async function loadProgress() {
    setMounted(true);
    const stats = await getProgressStats(); // Now async
    setStats(stats);
    setLoading(false);
  }
  loadProgress();
}, []);

if (loading) {
  return <LoadingSpinner />;
}
```

**2. Day Page** (`/app/sprint/day/[dayNumber]/page.tsx`)

**Current**:
```typescript
const handleMarkComplete = () => {
  try {
    setCompleting(true);
    markDayComplete(dayNumber);
    setIsCompleted(true);
    // ...
  } catch (error) {
    // ...
  }
};
```

**New**:
```typescript
const handleMarkComplete = async () => {
  try {
    setCompleting(true);
    const progress = await markDayComplete(dayNumber);
    setIsCompleted(true);

    // Show celebration with updated stats
    const streak = calculateStreak();
    setStreakCount(streak);
    setShowModal(true);
  } catch (error) {
    log.error('Error marking day complete:', 'App', error);
    // Show error toast
  } finally {
    setCompleting(false);
  }
};
```

**3. Error Handling**

Add error toast/notification for API failures:

```typescript
// src/components/sprint/error-toast.tsx
'use client';

export function ErrorToast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div className="fixed bottom-4 right-4 bg-red-500/10 border border-red-500 rounded-lg p-4 max-w-md">
      <p className="text-sm text-red-400">{message}</p>
      <button
        onClick={onDismiss}
        className="mt-2 text-xs text-gray-400 hover:text-white"
      >
        Dismiss
      </button>
    </div>
  );
}
```

---

## Implementation Strategy

### Phase 1: Database Setup (20 minutes)

1. Create migration file: `migrations/005_sprint_progress.sql`
2. Run migration script: `npx tsx scripts/run-sprint-migration.ts`
3. Verify table creation in Turso dashboard

### Phase 2: API Implementation (1.5 hours)

1. Create API route files (3 endpoints: GET, complete-day, reset)
2. Implement business logic (reuse from localStorage code)
3. Add error handling
4. Test with curl/Postman

### Phase 3: Client Library Refactor (1 hour)

1. Update `sprint-progress.ts` to be fully async
2. Replace localStorage calls with API calls
3. Add in-memory caching for performance
4. Remove export/import/migration functions

### Phase 4: Component Updates (1 hour)

1. Update sprint pages to handle async functions
2. Add loading states
3. Add error handling/toasts
4. Update `isDayAccessible` and `isDayCompleted` calls

### Phase 5: Testing (1 hour)

1. Unit tests for API endpoints
2. Integration tests for progress flow
3. Quick E2E smoke tests
4. Manual testing

### Phase 6: Cleanup (15 minutes)

1. Remove all localStorage references
2. Update documentation
3. Deploy to production

---

## Testing Requirements

### Unit Tests

**API Endpoints** (`src/app/api/sprint/progress/*.test.ts`):
```typescript
describe('GET /api/sprint/progress', () => {
  it('returns 401 when not authenticated')
  it('returns null for new users')
  it('returns progress for existing users')
  it('parses completed_days JSON correctly')
});

describe('POST /api/sprint/progress/complete-day', () => {
  it('marks day 1 complete for new users')
  it('prevents skipping days')
  it('prevents re-completing same day')
  it('updates current_day correctly')
  it('calculates completion_percentage correctly')
  it('sets status to completed when day 30 done')
});
```

**Client Library** (`src/lib/sprint-progress.test.ts`):
```typescript
describe('markDayComplete', () => {
  it('updates localStorage optimistically')
  it('syncs to server when authenticated')
  it('falls back to local on server error')
  it('merges server response with local cache')
});
```

### Integration Tests

**Sync Flow**:
```typescript
describe('Sprint Progress Sync', () => {
  it('fetches server progress on mount')
  it('prefers server data over local cache')
  it('migrates local progress to server')
  it('handles concurrent updates gracefully')
});
```

### E2E Tests (Playwright)

**Critical User Flows**:
```typescript
test('complete day and verify sync across devices', async ({ browser }) => {
  // Login on device 1
  const page1 = await browser.newPage();
  await page1.goto('/app/sprint/day/1');
  await page1.click('button:has-text("Mark Complete")');

  // Login on device 2 (new context)
  const page2 = await browser.newPage();
  await page2.goto('/app/sprint');

  // Verify progress synced
  await expect(page2.locator('text=Day 1 Complete')).toBeVisible();
});
```

---

## Timeline & Effort Breakdown

### Total Estimate: 4-5 hours

| Task | Estimated Time | Details |
|------|----------------|---------|
| **Database Schema** | 20 min | Write migration SQL, run script, verify |
| **API Endpoints** | 1.5 hours | 3 routes + business logic + error handling |
| **Client Library** | 1 hour | Convert to async, remove localStorage |
| **Component Updates** | 1 hour | Update 4 pages, add loading states |
| **Testing** | 1 hour | Unit, integration, E2E tests |
| **Cleanup** | 15 min | Remove old code, update docs |
| **Buffer** | 45 min | Unexpected issues, edge cases |

**Single Day Implementation** (5-hour session):

**Hour 1**: Database + API foundation
- Database schema and migration (20 min)
- GET endpoint (20 min)
- complete-day endpoint (20 min)

**Hour 2**: Complete API layer
- reset endpoint (15 min)
- Error handling and validation (30 min)
- API testing with curl (15 min)

**Hour 3**: Client library refactor
- Convert functions to async (30 min)
- Replace localStorage with API calls (20 min)
- Add caching and error handling (10 min)

**Hour 4**: Component updates
- Sprint overview page (20 min)
- Day page (20 min)
- Dashboard page (10 min)
- Error toast component (10 min)

**Hour 5**: Testing and deployment
- Unit tests (30 min)
- E2E smoke tests (15 min)
- Deploy and verify (15 min)

---

## Risks & Mitigations

### Risk 1: Race Conditions

**Scenario**: User completes day on two devices simultaneously

**Impact**: Medium
**Probability**: Low

**Mitigation**:
- Use optimistic locking (updated_at check)
- Prefer union of completed_days (no data loss)
- Add retry logic with exponential backoff
- Log conflicts for monitoring

### Risk 3: API Performance

**Concern**: Database query latency on every page load

**Impact**: Medium
**Probability**: Low

**Mitigation**:
- Add indexes on user_id
- Cache progress in memory for session duration
- Use SWR/React Query for client-side caching
- Monitor query performance in Turso dashboard

### Risk 4: First User Experience

**Concern**: Users without progress see loading states

**Impact**: Low
**Probability**: High

**Mitigation**:
- Fast API responses (< 200ms)
- In-memory caching after first load
- Clear loading indicators
- Graceful empty state handling

---

## Success Criteria

### Functional Requirements

- [ ] User can complete sprint days on device A
- [ ] Progress appears on device B after login
- [ ] Streak calculations work correctly
- [ ] Completed days persist across sessions
- [ ] Day unlocking logic preserved
- [ ] Statistics accurate (completion %, current day)

### Non-Functional Requirements

- [ ] API response time < 200ms (p95)
- [ ] Zero data loss during migration
- [ ] Graceful fallback to localStorage if API fails
- [ ] No breaking changes to existing UI
- [ ] Test coverage > 80% for new code
- [ ] Zero production incidents during rollout

### User Experience

- [ ] No noticeable performance degradation
- [ ] Loading states for async operations
- [ ] Clear error messages if sync fails
- [ ] Migration prompt appears only once
- [ ] Sync happens automatically in background

---

## Follow-up Enhancements (Future)

**Not included in current scope but worth considering**:

1. **Real-time Sync**
   - WebSocket/Server-Sent Events
   - Live updates across devices
   - Effort: +4 hours

2. **Conflict Resolution UI**
   - Show conflicts to user
   - Let user choose which version to keep
   - Effort: +2 hours

3. **Progress Analytics**
   - Track completion trends
   - Time-to-complete per day
   - Admin dashboard
   - Effort: +8 hours

4. **Multiple Sprint Support**
   - Allow restarting sprint
   - Archive old progress
   - Compare attempts
   - Effort: +6 hours

5. **Offline PWA Support**
   - Service worker
   - Background sync API
   - Effort: +6 hours

6. **Social Features**
   - Share progress
   - Leaderboards
   - Effort: +12 hours

---

## Questions for Product Owner

Before starting implementation, clarify:

1. **Migration UX**: Auto-migrate or require user action?
   - Recommendation: Auto-migrate with notification banner

2. **Conflict Resolution**: What if user has different progress on different devices?
   - Recommendation: Union of completed days (most permissive)

3. **Reset Functionality**: Should users be able to restart sprint?
   - Current scope: Yes, but requires manual action
   - Future: Allow multiple attempts with archiving

4. **Analytics**: Do we need to track sprint completion rates?
   - Current scope: No
   - Future: Add analytics table

5. **Performance Budget**: Acceptable API latency?
   - Recommendation: < 200ms p95

6. **Rollout Strategy**: Feature flag or full deploy?
   - Recommendation: Full deploy with localStorage fallback

---

## Appendix: Code Samples

### Migration Script Template

```typescript
#!/usr/bin/env tsx
// scripts/run-sprint-migration.ts

import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: join(process.cwd(), '.env.local') });

const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
  console.error('Missing Turso credentials');
  process.exit(1);
}

async function runMigration() {
  const client = createClient({
    url: TURSO_DATABASE_URL,
    authToken: TURSO_AUTH_TOKEN,
  });

  const migrationSQL = readFileSync(
    join(process.cwd(), 'migrations', '005_sprint_progress.sql'),
    'utf-8'
  );

  const statements = migrationSQL
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  for (const statement of statements) {
    await client.execute(statement + ';');
  }

  console.log('✓ Sprint progress migration completed');
}

runMigration();
```

### Example API Test

```typescript
// src/app/api/sprint/progress/route.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { POST } from './route';

describe('POST /api/sprint/progress/complete-day', () => {
  beforeEach(async () => {
    await setupTestDatabase();
  });

  it('marks day as complete and advances current day', async () => {
    const request = new Request('http://localhost/api/sprint/progress/complete-day', {
      method: 'POST',
      body: JSON.stringify({ dayNumber: 1 }),
      headers: { 'Content-Type': 'application/json' }
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.progress.completedDays).toContain(1);
    expect(data.progress.currentDay).toBe(2);
    expect(data.progress.status).toBe('in_progress');
  });
});
```

---

**Document Version:** 1.0
**Created:** November 15, 2025
**Author:** Development Team
**Status:** Estimation Phase
**Next Steps:** Approval → Implementation
