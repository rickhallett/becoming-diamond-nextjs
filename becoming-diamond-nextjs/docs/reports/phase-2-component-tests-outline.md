# Phase 2: Component Testing - Implementation Outline

**Status**: 📋 Planning
**Estimated Duration**: 3-4 hours
**Dependencies**: Phase 1 Complete ✅
**Target Test Count**: ~40-50 tests

## Overview

Phase 2 focuses on testing React components with business logic. This phase validates UI component behavior, user interactions, and integration with hooks/contexts while excluding vendor UI components (Aceternity).

## Objectives

1. Test components with business logic and state management
2. Validate user interaction handling (clicks, inputs, navigation)
3. Ensure proper integration with React hooks and contexts
4. Verify accessibility attributes and ARIA labels
5. Test conditional rendering and edge cases

## Component Testing Priority

### Priority 1: Course Components (High Business Value)
**Complexity**: Medium-High
**User Impact**: Critical (core learning experience)

#### 1.1 ChapterNav Component
**File**: `src/components/course/ChapterNav.tsx` (119 lines)
**Purpose**: Chapter navigation sidebar for course playback
**Test Count**: 6-8 tests

**Test Cases**:
```typescript
describe('ChapterNav', () => {
  // Rendering
  it('should render all chapters with titles');
  it('should render slide count for each chapter');
  it('should handle empty chapters array gracefully');

  // State & Interaction
  it('should highlight active chapter based on currentChapter prop');
  it('should highlight active slide within chapter');
  it('should call onChapterClick when chapter is clicked');
  it('should call onSlideClick when slide is clicked');

  // Completion Status
  it('should show completion checkmark for completed chapters');
  it('should show progress indicator for in-progress chapters');

  // Accessibility
  it('should have proper ARIA labels for navigation');
  it('should be keyboard navigable');
});
```

**Key Props to Test**:
- `chapters: CourseChapter[]`
- `currentChapter: number`
- `currentSlide: number`
- `completedSlides: number[]`
- `onChapterClick: (chapterIndex: number) => void`
- `onSlideClick: (chapterIndex: number, slideIndex: number) => void`

**Dependencies to Mock**:
- Course types from `@/types/course`
- Icons from `@tabler/icons-react`

---

#### 1.2 CourseProgress Component
**File**: `src/components/course/CourseProgress.tsx` (83 lines)
**Purpose**: Displays course completion progress with visual indicator
**Test Count**: 5-7 tests

**Test Cases**:
```typescript
describe('CourseProgress', () => {
  // Progress Calculation
  it('should calculate correct percentage (completedSlides / totalSlides)');
  it('should display completed/total slide count');
  it('should show 0% when no slides completed');
  it('should show 100% when all slides completed');

  // Edge Cases
  it('should handle zero total slides gracefully');
  it('should handle invalid completed count (> total)');
  it('should round percentage to nearest integer');

  // Visual Rendering
  it('should render progress bar with correct width');
  it('should show completion message at 100%');

  // Accessibility
  it('should have aria-valuenow, aria-valuemin, aria-valuemax');
  it('should have descriptive label for screen readers');
});
```

**Key Props to Test**:
- `totalSlides: number`
- `completedSlides: number`
- `currentSlide: number`

**Expected Calculations**:
- `percentage = Math.round((completed / total) * 100)`
- Handle division by zero (total = 0)

---

#### 1.3 SlideContent Component
**File**: `src/components/course/SlideContent.tsx` (113 lines)
**Purpose**: Renders individual slide content with markdown and video
**Test Count**: 6-8 tests

**Test Cases**:
```typescript
describe('SlideContent', () => {
  // Content Rendering
  it('should render markdown content as HTML');
  it('should render slide title');
  it('should render video player when videoReferences present');
  it('should handle slides without video');

  // Video Integration
  it('should pass correct videoId to VideoPlayer');
  it('should pass video options (autoplay, poster, quality)');
  it('should render multiple videos in correct order');

  // Edge Cases
  it('should handle empty content gracefully');
  it('should handle missing title');
  it('should handle malformed video references');

  // Layout
  it('should apply correct styling classes');
  it('should be responsive (mobile/desktop)');
});
```

**Key Props to Test**:
- `slide: CourseSlide`
- `slide.title: string`
- `slide.content: string` (HTML)
- `slide.videoReferences?: VideoReference[]`

**Dependencies to Mock**:
- `VideoPlayer` component
- `MarkdownMessage` component (if used)

---

### Priority 2: Markdown & Content (Medium Business Value)

#### 2.1 MarkdownMessage Component
**File**: `src/components/MarkdownMessage.tsx` (164 lines)
**Purpose**: Renders markdown with syntax highlighting and sanitization
**Test Count**: 7-9 tests

**Test Cases**:
```typescript
describe('MarkdownMessage', () => {
  // Basic Rendering
  it('should render markdown text as HTML');
  it('should handle empty content');
  it('should render paragraphs, headings, lists');

  // Code Blocks
  it('should render code blocks with syntax highlighting');
  it('should support multiple languages (js, python, etc)');
  it('should render inline code with proper styling');

  // Links & Images
  it('should render links with proper attributes');
  it('should render images with alt text');
  it('should add rel="noopener noreferrer" to external links');

  // Security
  it('should sanitize dangerous HTML (script tags)');
  it('should preserve safe HTML elements');
  it('should escape XSS attempts');

  // GFM Features
  it('should render tables correctly');
  it('should render task lists with checkboxes');
  it('should render strikethrough text');
});
```

**Key Props to Test**:
- `content: string` (markdown)
- `className?: string`

**Dependencies**:
- `react-markdown`
- `react-syntax-highlighter`
- `rehype-raw` (for HTML in markdown)
- `remark-gfm` (for GitHub Flavored Markdown)

**Security Considerations**:
- Test XSS prevention: `<script>alert('xss')</script>`
- Test dangerous attributes: `<img src=x onerror="alert('xss')">`
- Verify safe tags preserved: `<strong>`, `<em>`, `<code>`

---

### Priority 3: Authentication Components (Low Complexity, High Importance)

#### 3.1 SignOutButton Component
**File**: `src/components/auth/SignOutButton.tsx` (30 lines)
**Purpose**: Handles user sign out with loading state
**Test Count**: 4-5 tests

**Test Cases**:
```typescript
describe('SignOutButton', () => {
  // Interaction
  it('should call signOut when clicked');
  it('should prevent multiple clicks during signout');

  // Loading State
  it('should show loading spinner during signout');
  it('should disable button during signout');

  // Redirect
  it('should redirect to homepage after successful signout');
  it('should handle signout errors gracefully');

  // Accessibility
  it('should have descriptive aria-label');
  it('should announce loading state to screen readers');
});
```

**Key Props to Test**:
- `className?: string`
- `onSignOut?: () => void`

**Dependencies to Mock**:
- `next-auth` (signOut function)
- `next/navigation` (useRouter)

---

#### 3.2 UserAvatar Component
**File**: `src/components/auth/UserAvatar.tsx` (55 lines)
**Purpose**: Displays user avatar with fallback initials
**Test Count**: 4-6 tests

**Test Cases**:
```typescript
describe('UserAvatar', () => {
  // Image Rendering
  it('should render user image when provided');
  it('should show fallback initials when no image');
  it('should generate correct initials (first + last name)');

  // Edge Cases
  it('should handle missing name gracefully');
  it('should handle single name (no last name)');
  it('should handle empty user object');

  // Styling
  it('should apply size prop correctly (sm, md, lg)');
  it('should apply custom className');

  // Accessibility
  it('should have alt text for image');
  it('should have aria-label for avatar container');
});
```

**Key Props to Test**:
- `user: { name?: string, image?: string, email?: string }`
- `size?: 'sm' | 'md' | 'lg'`
- `className?: string`

---

### Priority 4: Layout Components (High Complexity)

#### 4.1 Member Portal Layout
**File**: `src/app/app/layout.tsx` (244 lines)
**Purpose**: Main layout with sidebar navigation and mobile menu
**Test Count**: 8-10 tests

**Test Cases**:
```typescript
describe('MemberPortalLayout', () => {
  // Navigation Rendering
  it('should render all navigation items');
  it('should render navigation icons correctly');
  it('should render user avatar in sidebar');

  // Active Route Highlighting
  it('should highlight active route based on pathname');
  it('should update highlight when route changes');

  // Mobile Menu
  it('should toggle mobile menu on hamburger click');
  it('should close mobile menu on navigation');
  it('should close mobile menu on outside click');

  // Sign Out
  it('should render SignOutButton in sidebar');
  it('should handle signout click');

  // Responsive
  it('should show sidebar on desktop (>1024px)');
  it('should show mobile menu button on mobile (<1024px)');

  // Accessibility
  it('should have proper navigation landmarks');
  it('should be keyboard navigable');
  it('should trap focus in mobile menu when open');
});
```

**Key Features to Test**:
- Navigation items array
- `usePathname()` hook for active route
- Mobile menu state (`mobileMenuOpen`)
- Responsive breakpoints

**Dependencies to Mock**:
- `next/navigation` (usePathname, useRouter)
- `@tabler/icons-react` (icons)
- `SignOutButton` component
- `UserAvatar` component

---

## Additional API Route Tests

### API Route: /api/courses
**File**: `src/app/api/courses/route.ts`
**Test Count**: 5-7 tests

**Test Cases**:
```typescript
describe('GET /api/courses', () => {
  it('should return all published courses');
  it('should filter out unpublished courses');
  it('should return courses sorted by pressureRoom');
  it('should return proper JSON format');
  it('should handle empty courses directory');
  it('should return 500 on file system error');
});

describe('POST /api/courses (if implemented)', () => {
  it('should enroll user in course');
  it('should require authentication');
  it('should prevent duplicate enrollment');
  it('should return enrollment data');
});
```

---

### API Route: /api/chat
**File**: `src/app/api/chat/route.ts`
**Test Count**: 6-8 tests

**Test Cases**:
```typescript
describe('POST /api/chat', () => {
  it('should accept message and return AI response');
  it('should require authentication');
  it('should validate message format');
  it('should handle Anthropic API errors');
  it('should stream responses');
  it('should handle rate limiting');
  it('should sanitize user input');
  it('should include conversation context');
});
```

---

### API Route: /api/activities
**File**: `src/app/api/activities/route.ts`
**Test Count**: 5-7 tests

**Test Cases**:
```typescript
describe('POST /api/activities', () => {
  it('should record user activity');
  it('should require authentication');
  it('should validate activity type');
  it('should store in database');
  it('should return success response');
});

describe('GET /api/activities', () => {
  it('should return user activity history');
  it('should require authentication');
  it('should filter by date range');
  it('should paginate results');
});
```

---

## Testing Infrastructure Setup

### 1. React Testing Library Configuration

**Install Dependencies**:
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

**Configure Vitest for React**:
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',  // Changed from 'node'
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

**Setup File**:
```typescript
// src/test/setup.ts
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia (for responsive components)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver (for scroll-based components)
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() { return []; }
  unobserve() {}
};
```

---

### 2. Test Utilities & Helpers

**Create Custom Render Function**:
```typescript
// src/test/utils/test-utils.tsx
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

// Add providers if needed (ThemeProvider, etc)
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

---

### 3. Mock Factories

**Create Reusable Mock Data**:
```typescript
// src/test/fixtures/course.ts
import type { CourseChapter, CourseSlide, VideoReference } from '@/types/course';

export const mockVideoReference: VideoReference = {
  videoId: 'test-video-123',
  autoplay: false,
  poster: '/images/poster.jpg',
  quality: '1080p',
};

export const mockSlide: CourseSlide = {
  id: 'pr1-c0-s0-intro',
  title: 'Introduction',
  content: '<p>Test slide content</p>',
  order: 0,
  videoReferences: [mockVideoReference],
  mediaType: 'video',
  estimatedTime: 5,
};

export const mockChapter: CourseChapter = {
  id: 'pr1-c0',
  title: 'Chapter 1',
  order: 0,
  slides: [mockSlide],
  part: 1,
};

export const mockCourse = {
  id: 'pr1-test-course',
  title: 'Test Course',
  chapters: [mockChapter],
  totalChapters: 1,
  totalSlides: 1,
  metadata: {
    pressureRoom: 1,
    duration: '4 weeks',
    difficulty: 'Beginner',
    instructor: 'Test Instructor',
    published: true,
  },
};
```

```typescript
// src/test/fixtures/user.ts
export const mockUser = {
  id: 'user-123',
  name: 'Test User',
  email: 'test@example.com',
  image: '/images/avatar.jpg',
};

export const mockSession = {
  user: mockUser,
  expires: '2025-12-31',
};
```

---

### 4. Common Mock Patterns

**Mock Next.js Navigation**:
```typescript
// In test files
import { useRouter, usePathname } from 'next/navigation';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  })),
  usePathname: vi.fn(() => '/app/courses'),
}));
```

**Mock Next Auth**:
```typescript
import { signOut } from 'next-auth/react';

vi.mock('next-auth/react', () => ({
  signOut: vi.fn(() => Promise.resolve()),
  useSession: vi.fn(() => ({
    data: mockSession,
    status: 'authenticated',
  })),
}));
```

**Mock Icons**:
```typescript
vi.mock('@tabler/icons-react', () => ({
  IconHome: () => <div data-testid="icon-home">Home Icon</div>,
  IconBooks: () => <div data-testid="icon-books">Books Icon</div>,
  // Add other icons as needed
}));
```

---

## Implementation Workflow

### Step-by-Step Process (Code, Verify, Commit, Repeat)

1. **Setup Phase** (~30 min)
   - [ ] Install React Testing Library dependencies
   - [ ] Update vitest.config.ts for jsdom environment
   - [ ] Create test setup file with global mocks
   - [ ] Create test utilities (custom render, helpers)
   - [ ] Create mock fixtures (course, user, content)
   - [ ] Commit: "test: Configure React Testing Library for component tests"

2. **Course Components** (~1.5 hours)
   - [ ] Implement ChapterNav.test.tsx (6-8 tests)
   - [ ] Run tests, verify all pass
   - [ ] Commit: "test: Add ChapterNav component tests"
   - [ ] Implement CourseProgress.test.tsx (5-7 tests)
   - [ ] Run tests, verify all pass
   - [ ] Commit: "test: Add CourseProgress component tests"
   - [ ] Implement SlideContent.test.tsx (6-8 tests)
   - [ ] Run tests, verify all pass
   - [ ] Commit: "test: Add SlideContent component tests"

3. **Markdown Component** (~45 min)
   - [ ] Implement MarkdownMessage.test.tsx (7-9 tests)
   - [ ] Test markdown rendering, code highlighting, sanitization
   - [ ] Run tests, verify all pass
   - [ ] Commit: "test: Add MarkdownMessage component tests"

4. **Auth Components** (~30 min)
   - [ ] Implement SignOutButton.test.tsx (4-5 tests)
   - [ ] Implement UserAvatar.test.tsx (4-6 tests)
   - [ ] Run tests, verify all pass
   - [ ] Commit: "test: Add authentication component tests"

5. **Layout Component** (~45 min)
   - [ ] Implement MemberPortalLayout.test.tsx (8-10 tests)
   - [ ] Test navigation, mobile menu, responsive behavior
   - [ ] Run tests, verify all pass
   - [ ] Commit: "test: Add member portal layout tests"

6. **API Routes** (~1 hour)
   - [ ] Implement /api/courses route tests (5-7 tests)
   - [ ] Implement /api/chat route tests (6-8 tests)
   - [ ] Implement /api/activities route tests (5-7 tests)
   - [ ] Run tests, verify all pass
   - [ ] Commit: "test: Add API route tests for courses, chat, activities"

7. **Documentation** (~15 min)
   - [ ] Create Phase 2 summary document
   - [ ] Document test patterns and best practices
   - [ ] Update testing strategy with actual coverage
   - [ ] Commit: "docs: Add Phase 2 component tests summary"

---

## Success Criteria

### Quantitative Metrics
- [ ] **40-50 component tests** implemented and passing
- [ ] **15-20 API route tests** implemented and passing
- [ ] **100% pass rate** on all Phase 2 tests
- [ ] **<5 seconds** total test execution time
- [ ] **Zero test warnings** or deprecation notices

### Qualitative Goals
- [ ] All business-critical components tested
- [ ] User interactions validated (clicks, inputs, navigation)
- [ ] Edge cases and error states covered
- [ ] Accessibility attributes verified
- [ ] Mock patterns documented and reusable
- [ ] Tests are readable and maintainable

---

## Exclusions (Out of Scope)

### Components NOT Being Tested
- **All 89 Aceternity UI components** (`src/components/ui/**`)
  - Rationale: Vendor components, heavily tested upstream
  - Exception: Test integration points in business components

### Features Deferred to Phase 3
- **Integration tests** (cross-component flows)
- **E2E tests** (full user journeys)
- **Visual regression tests** (screenshot diffs)
- **Performance tests** (component render time)

---

## Risk Assessment

### High Risk Areas
1. **MarkdownMessage security**: XSS vulnerabilities if sanitization fails
2. **Layout responsive behavior**: Complex media query logic
3. **Video player integration**: External dependency on Bunny Stream

### Mitigation Strategies
1. Comprehensive XSS test cases for MarkdownMessage
2. Mock window.matchMedia for responsive tests
3. Mock VideoPlayer component for isolation

---

## Estimated Timeline

| Task | Duration | Cumulative |
|------|----------|------------|
| Setup & Configuration | 30 min | 0:30 |
| Course Components (3) | 1.5 hours | 2:00 |
| Markdown Component | 45 min | 2:45 |
| Auth Components (2) | 30 min | 3:15 |
| Layout Component | 45 min | 4:00 |
| API Routes (3) | 1 hour | 5:00 |
| Documentation | 15 min | 5:15 |
| **Total** | **~5 hours** | **5:15** |

*Note: Includes time for debugging, refactoring, and commit messages*

---

## Next Steps

**Ready to Begin Phase 2?**
1. Review this outline
2. Confirm component priorities
3. Execute "Setup Phase" first
4. Follow "Code, Verify, Commit, Repeat" workflow

**Questions to Address Before Starting**:
- Are there additional components that need testing?
- Should we add snapshot testing for component output?
- Do we need visual regression tests (Percy, Chromatic)?
- Should we measure code coverage percentage?

---

**Document Status**: 📋 Planning Complete
**Created**: 2025-11-04
**Last Updated**: 2025-11-04
**Related Documents**:
- `/docs/specs/testing-strategy.md` - Overall strategy
- `/docs/reports/phase-1-unit-tests-summary.md` - Phase 1 results
