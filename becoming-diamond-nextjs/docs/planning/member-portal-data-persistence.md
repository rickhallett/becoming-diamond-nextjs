# Member Portal Data Persistence - Phase 1

**Status:** Draft
**Priority:** High
**Estimated Effort:** Medium (2-3 days)
**Date:** 2025-10-01

---

## Overview

The current member portal (`/app/*`) presents a rich, interactive dashboard with user progress tracking, course enrollment, profile management, and AI chat functionality. However, all data is currently **hardcoded** with static mock data. Users cannot persist their actual progress, profile changes, or chat history.

This specification outlines **Phase 1** of data persistence: implementing client-side state management and local storage to provide a functional, persistent user experience without requiring immediate backend infrastructure.

---

## Current State Assessment

### What's Working Well
- **Complete UI Implementation**: All member portal pages are fully implemented with excellent UX
  - Dashboard (`/app/page.tsx`) with gateway progress, stats, and activity feeds
  - Courses page (`/app/courses/page.tsx`) with enrollment status and progress tracking
  - Profile page (`/app/profile/page.tsx`) with editable user information
  - Chat page (`/app/chat/page.tsx`) with AI conversation interface
  - Settings and Support pages (basic implementations)

- **Visual Design**: Consistent use of Aceternity UI components, animations, and theming
- **Navigation**: Functional sidebar layout with mobile responsiveness
- **Authentication Flow**: Basic auth page exists with "test login" functionality

### Current Limitations
1. **No Data Persistence**: All user data resets on page refresh
2. **Hardcoded Values**: User stats, course progress, profile info are static
3. **Lost State**: Profile edits, chat conversations, and progress tracking disappear
4. **No User Context**: No global state management for authenticated user
5. **Limited Interactivity**: Dashboard "Quick Actions" buttons are non-functional

### Technical Debt
- Auth page shows SSO buttons but only GitHub OAuth has backend route
- Profile edit saves locally but state is lost on refresh
- Chat messages are ephemeral and regenerate each session
- Dashboard stats don't update based on actual user activity

---

## Proposed Changes

### Phase 1 Scope: Client-Side Persistence

Implement local storage-based data persistence to make the member portal fully functional for individual users on a single device. This provides immediate value while laying groundwork for future backend integration.

### Core Components

#### 1. User Context & State Management
**Location:** `/Users/richardhallett/Documents/code/becoming-diamond/becoming-diamond-nextjs/src/contexts/UserContext.tsx`

Create a React Context provider to manage authenticated user state globally:

```typescript
interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  occupation: string;
  bio: string;
  avatarUrl?: string;
  joinDate: string;
}

interface UserProgress {
  currentGateway: number;
  daysInProgram: number;
  currentStreak: number;
  completedSessions: number;
  totalSessions: number;
  coursesCompleted: number;
  hoursLearned: number;
}

interface UserContext {
  profile: UserProfile;
  progress: UserProgress;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateProgress: (updates: Partial<UserProgress>) => void;
  isAuthenticated: boolean;
  login: (credentials: LoginData) => void;
  logout: () => void;
}
```

**Key Features:**
- Automatic sync with localStorage on all state changes
- Hydration from localStorage on app initialization
- Type-safe state updates
- Authentication status management

#### 2. Course Progress Tracking
**Location:** `/Users/richardhallett/Documents/code/becoming-diamond/becoming-diamond-nextjs/src/contexts/CourseContext.tsx`

Manage course enrollment, progress, and completion status:

```typescript
interface CourseProgress {
  courseId: string;
  title: string;
  status: 'locked' | 'enrolled' | 'in-progress' | 'completed';
  progress: number; // 0-100
  lastAccessedDate?: string;
  completedModules: string[];
  totalModules: number;
}

interface CourseContext {
  courses: CourseProgress[];
  enrolledCourses: CourseProgress[];
  updateCourseProgress: (courseId: string, updates: Partial<CourseProgress>) => void;
  completeModule: (courseId: string, moduleId: string) => void;
  enrollInCourse: (courseId: string) => void;
}
```

**Key Features:**
- Track progress for each enrolled course
- Module completion tracking
- Automatic calculation of overall progress percentage
- Update dashboard stats when courses are completed

#### 3. Chat History Persistence
**Location:** `/Users/richardhallett/Documents/code/becoming-diamond/becoming-diamond-nextjs/src/contexts/ChatContext.tsx`

Store and retrieve DiamondMindAI chat conversations:

```typescript
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

interface ChatContext {
  currentSession: ChatSession | null;
  sessions: ChatSession[];
  createSession: (title: string) => ChatSession;
  addMessage: (sessionId: string, message: ChatMessage) => void;
  deleteSession: (sessionId: string) => void;
  loadSession: (sessionId: string) => void;
}
```

**Key Features:**
- Persist chat history across sessions
- Support multiple conversation threads
- Automatic session creation and management
- Export/import conversation history

#### 4. Activity Tracking
**Location:** `/Users/richardhallett/Documents/code/becoming-diamond/becoming-diamond-nextjs/src/hooks/useActivityTracker.ts`

Custom hook to record and display user activities:

```typescript
interface Activity {
  id: string;
  type: 'course_complete' | 'module_complete' | 'chat' | 'profile_update' | 'streak_update';
  description: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

const useActivityTracker = () => {
  const logActivity = (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
  const getRecentActivities = (limit: number) => Activity[];
  const clearOldActivities = (daysOld: number) => void;
};
```

**Key Features:**
- Log all significant user actions
- Display in dashboard "Recent Activity" section
- Auto-cleanup of old activities
- Support for activity metadata

#### 5. Local Storage Utility
**Location:** `/Users/richardhallett/Documents/code/becoming-diamond/becoming-diamond-nextjs/src/lib/storage.ts`

Type-safe wrapper around localStorage with error handling:

```typescript
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {},
  set: <T>(key: string, value: T): void => {},
  remove: (key: string): void => {},
  clear: (): void => {},
  exists: (key: string): boolean => {},
};
```

**Key Features:**
- JSON serialization/deserialization
- Type safety with generics
- Graceful error handling for quota exceeded
- SSR-safe (check for window object)

---

## Implementation Approach

### Phase 1A: Foundation (Day 1)
1. Create `storage.ts` utility with localStorage wrapper
2. Implement `UserContext` with profile and progress management
3. Update `/app/layout.tsx` to wrap children with UserProvider
4. Modify auth page to set authenticated state and redirect

### Phase 1B: Features (Day 2)
1. Implement `CourseContext` with progress tracking
2. Update courses page to use real enrollment/progress data
3. Add "Quick Actions" functionality to dashboard
4. Implement activity tracking hook
5. Update dashboard to show real, dynamic stats

### Phase 1C: Chat & Polish (Day 3)
1. Implement `ChatContext` with message persistence
2. Update chat page to load/save conversation history
3. Add session management UI (view/delete past conversations)
4. Update profile page to persist edits
5. Test all flows and add error boundaries

---

## Success Criteria

### Functional Requirements
- [ ] User profile edits persist across browser sessions
- [ ] Course progress is saved and accurately displayed
- [ ] Chat conversations are preserved and can be resumed
- [ ] Dashboard stats update dynamically based on user actions
- [ ] "Quick Actions" on dashboard are fully functional
- [ ] Recent activity feed shows real user activities
- [ ] Gateway progress updates when courses are completed
- [ ] Current streak increments with daily activity

### Non-Functional Requirements
- [ ] All data persists in localStorage with < 5MB total usage
- [ ] No visible lag when loading persisted data
- [ ] Graceful degradation if localStorage is unavailable
- [ ] Type-safe context APIs with no `any` types
- [ ] Zero console errors or warnings

### User Experience
- [ ] First-time users see onboarding with default profile
- [ ] Returning users see their personalized dashboard
- [ ] Profile editing feels instant with optimistic updates
- [ ] Chat feels like a continuous conversation
- [ ] Progress visualization matches actual completion status

---

## Technical Considerations

### Data Schema Versioning
- Implement schema version in localStorage keys
- Handle migrations when data structure changes
- Provide fallback to default values for missing fields

### Storage Limits
- Monitor localStorage usage (typically 5-10MB limit)
- Implement compression for large datasets (chat history)
- Provide warning/cleanup when approaching limits
- Consider LRU eviction for old chat sessions

### SSR Compatibility
- All localStorage access must check for `typeof window !== 'undefined'`
- Use `useEffect` for hydration to avoid SSR/client mismatches
- Provide loading states during hydration

### Testing Strategy
- Unit tests for storage utility functions
- Integration tests for context providers
- E2E tests for critical user flows:
  - Login → edit profile → refresh → verify persistence
  - Enroll in course → mark progress → refresh → verify
  - Start chat → send messages → refresh → verify history

### Future Migration Path
This implementation is designed to easily migrate to backend persistence:
- Context providers will accept API clients
- `storage.ts` functions can be swapped with API calls
- Data schemas match expected backend models
- Authentication context ready for JWT/session tokens

---

## Out of Scope (Future Phases)

### Phase 2: Backend Integration
- Database setup (PostgreSQL/MongoDB)
- REST API or GraphQL endpoints
- Real authentication with JWT tokens
- Server-side session management

### Phase 3: Advanced Features
- Multi-device sync
- Real-time collaboration features
- Analytics and insights dashboard
- Gamification and leaderboards
- Social features (community posts, messaging)

### Phase 4: AI Integration
- Replace mock DiamondMindAI with real LLM
- Personalized coaching based on user progress
- Content recommendations
- Adaptive learning paths

---

## Dependencies

### Required Changes
- None - this is purely additive functionality

### Package Dependencies
- No new packages required (uses built-in React Context + localStorage)

### Environment Variables
- None for Phase 1 (fully client-side)

---

## Migration & Rollout

### Backward Compatibility
- New users: Start with clean slate, default values
- Existing sessions: No breaking changes (all data is currently ephemeral)

### Rollout Strategy
1. Develop behind feature flag (optional)
2. Test with development team
3. Deploy to staging for QA
4. Production release with monitoring
5. Collect user feedback for Phase 2 prioritization

### Rollback Plan
- Remove context providers and revert to static data
- No data loss risk (everything is currently client-side only)

---

## Acceptance Criteria

### Demo Scenario
1. User visits `/auth` and logs in (test login)
2. Lands on dashboard showing default stats
3. Navigates to profile, edits name and bio, saves
4. Navigates to courses, enrolls in a course, marks progress to 50%
5. Navigates to chat, has conversation, sends 5 messages
6. Refreshes browser (F5)
7. **Expected:** All changes persist:
   - Dashboard shows updated name
   - Course progress shows 50% complete
   - Stats show 1 enrolled course
   - Chat history shows all 5 messages
   - Recent activity shows enrollment and profile update

### Edge Cases Handled
- [ ] localStorage quota exceeded → graceful error message
- [ ] Corrupted localStorage data → reset to defaults
- [ ] Missing localStorage (incognito/disabled) → warning + session-only mode
- [ ] Rapid successive updates → debounced writes
- [ ] Concurrent tab updates → sync via storage events

---

## Questions & Decisions Needed

1. **Chat History Limit**: How many chat sessions should we retain? (Recommendation: 10 most recent)
2. **Activity Feed Limit**: How long to keep activity history? (Recommendation: 90 days)
3. **Course Enrollment**: Should users be able to enroll in locked courses? (Recommendation: No, enforce prerequisites)
4. **Profile Avatars**: Support file upload to localStorage? (Recommendation: Phase 2 - requires backend)

---

## Related Documents

- `/Users/richardhallett/Documents/code/becoming-diamond/becoming-diamond-nextjs/CLAUDE.md` - Project overview and architecture
- Future: `authentication-phase-2.md` - Backend auth specification
- Future: `analytics-dashboard.md` - User insights and reporting

---

## Changelog

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2025-10-01 | 1.0 | Claude Code | Initial specification |

---

**Next Steps:**
1. Review and approve this specification
2. Create implementation tasks in project management tool
3. Assign developer and schedule sprint
4. Begin Phase 1A implementation
