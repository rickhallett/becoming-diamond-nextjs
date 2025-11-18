# Testing Strategy & Implementation Plan

## Executive Summary

This document outlines a comprehensive testing strategy for the Becoming Diamond Next.js application. The strategy covers unit, integration, and end-to-end testing with estimated timelines and clear implementation phases.

**Current State**: No testing infrastructure exists
**Target Coverage**: 70% code coverage (excluding vendor components)
**Estimated Implementation**: 15-20 hours setup + 40-60 hours initial coverage
**Framework Stack**: Vitest (unit/integration) + Playwright (E2E)

---

## 1. Testing Architecture

### 1.1 Testing Pyramid

```
         /\
        /E2E\          20% - Critical user flows (5-10 tests)
       /------\
      /  INT   \       30% - API routes & integrations (30-40 tests)
     /----------\
    /   UNIT     \     50% - Core business logic (100+ tests)
   /--------------\
```

### 1.2 Framework Selection Rationale

| Framework | Purpose | Why Chosen |
|-----------|---------|------------|
| **Vitest** | Unit & Integration | Native ESM support, faster than Jest, Vite-compatible, better DX with Turbopack |
| **React Testing Library** | Component tests | Industry standard, encourages accessibility-first testing |
| **MSW** | API mocking | Intercepts network requests, realistic mock behavior |
| **Playwright** | E2E testing | Cross-browser, mobile support, auto-wait, visual regression |
| **happy-dom** | DOM environment | Faster than jsdom, sufficient for most React tests |

---

## 2. Unit Testing Strategy

### 2.1 Target Modules

#### Priority 1: Core Business Logic (`src/lib/`)

**`src/lib/content.ts`** (310 lines)
- **Functions to test** (12 total):
  - `getContentByType()` - Markdown parsing, published filtering, date sorting
  - `getContentBySlug()` - Single item retrieval, null handling
  - `getCourseContent()` - Course ID lookup, parsing integration
  - `getAllCourses()` - Filtering, sorting by pressure room
  - `getSprintDays()` - Cache TTL behavior, day number sorting
  - `getSprintDay()` - Cache hit/miss scenarios
  - `replaceVideoPlaceholders()` - Regex parsing with options
  - `markdownToHtml()` - Remark pipeline integration

**Test scenarios**:
```typescript
describe('getContentByType', () => {
  it('should return published items only');
  it('should sort by date descending');
  it('should return empty array for non-existent type');
  it('should parse frontmatter correctly');
  it('should convert markdown to HTML');
  it('should handle missing date fields');
});

describe('replaceVideoPlaceholders', () => {
  it('should replace basic video placeholder');
  it('should parse video options (autoplay, poster, quality)');
  it('should unwrap paragraph tags around video divs');
  it('should handle multiple videos in content');
  it('should ignore malformed placeholders');
});

describe('getSprintDays caching', () => {
  it('should cache results in production');
  it('should bypass cache in development');
  it('should respect CACHE_TTL');
  it('should invalidate cache after TTL expires');
});
```

**`src/lib/course-parser.ts`**
- Chapter/slide parsing
- Markdown structure validation
- Error handling for malformed courses

**`src/lib/utils.ts`**
- `cn()` utility for Tailwind class merging
- Edge cases: empty strings, conflicting classes

**`src/lib/turso.ts`**
- Database client initialization
- Connection error handling
- Query execution

**`src/lib/rag/claude-simple.ts`**
- RAG query logic
- API error handling
- Response formatting

### 2.2 Component Testing

#### In-Scope Components (Business Logic)

**`src/components/course/ChapterNav.tsx`**
```typescript
describe('ChapterNav', () => {
  it('should render all chapters');
  it('should highlight active chapter');
  it('should navigate on chapter click');
  it('should show completion status');
  it('should handle empty chapters array');
});
```

**`src/components/course/CourseProgress.tsx`**
```typescript
describe('CourseProgress', () => {
  it('should calculate progress percentage');
  it('should show completed/total slides');
  it('should handle zero completed slides');
  it('should handle 100% completion');
});
```

**`src/components/MarkdownMessage.tsx`**
```typescript
describe('MarkdownMessage', () => {
  it('should render markdown as HTML');
  it('should sanitize dangerous HTML');
  it('should render code blocks with syntax highlighting');
  it('should handle empty content');
});
```

**`src/components/auth/SignOutButton.tsx`**
```typescript
describe('SignOutButton', () => {
  it('should call signOut on click');
  it('should show loading state during signout');
  it('should redirect after successful signout');
});
```

**`src/app/app/layout.tsx`** (Member portal layout)
```typescript
describe('MemberPortalLayout', () => {
  it('should render navigation items');
  it('should highlight active route');
  it('should toggle mobile menu');
  it('should show user avatar when authenticated');
  it('should handle signout click');
});
```

#### Out-of-Scope Components (Excluded)

- **All `src/components/ui/**` components** (89 Aceternity vendor components)
  - Rationale: Pre-built, heavily tested upstream, testing animations adds minimal value
  - Exception: Test integration points where used in business components

### 2.3 Mock Strategy

**File System Mocking**
```typescript
// src/test/mocks/fs.ts
import { vi } from 'vitest';

export const mockFs = {
  existsSync: vi.fn(),
  readdirSync: vi.fn(),
  readFileSync: vi.fn(),
};

vi.mock('fs', () => mockFs);
```

**Sample Test Fixtures**
```typescript
// src/test/fixtures/content.ts
export const mockNewsArticle = `---
title: "Test Article"
date: "2024-01-15"
published: true
thumbnail: "/images/test.jpg"
---

This is test content.
{{video:abc123|autoplay:true}}
`;

export const mockCourseMetadata = {
  id: 'pr1-stabilize-snowflakes-to-diamonds',
  title: 'Pressure Room 1',
  pressureRoom: 1,
  published: true,
};
```

---

## 3. Integration Testing Strategy

### 3.1 API Route Testing

#### Target Endpoints (19 routes)

**Authentication Routes**
- `GET /api/auth?provider=github` - OAuth redirect
- `POST /api/auth` - Token exchange
- `GET /api/callback?code=XXX` - OAuth callback
- `[...nextauth]` - NextAuth.js handlers

**Content APIs**
- `GET /api/blog` - Blog listing
- `GET /api/courses` - Course catalog
- `GET /api/sprint/days` - All sprint days
- `GET /api/sprint/[dayNumber]` - Specific day

**User Features**
- `GET /api/profile` - User profile
- `POST /api/profile` - Update profile
- `GET /api/activities` - Activity feed
- `POST /api/chat` - AI chat

**Video**
- `GET /api/videos` - Video catalog
- `GET /api/video/[videoId]/token` - Signed token

**Payments**
- `POST /api/checkout` - Create checkout
- `POST /api/checkout/create-session` - Stripe session
- `POST /api/stripe/webhook` - Stripe webhooks

**Leads**
- `POST /api/leads` - Newsletter signup
- `POST /api/unsubscribe` - Unsubscribe

### 3.2 Test Scenarios per Route

**Example: Sprint Day API**
```typescript
// src/test/integration/api/sprint.test.ts
import { describe, it, expect, beforeAll } from 'vitest';
import { GET } from '@/app/api/sprint/[dayNumber]/route';

describe('GET /api/sprint/[dayNumber]', () => {
  it('should return 200 and day content for valid day number', async () => {
    const request = new Request('http://localhost/api/sprint/1');
    const response = await GET(request, { params: { dayNumber: '1' } });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('slug');
    expect(data).toHaveProperty('frontmatter');
    expect(data).toHaveProperty('content');
  });

  it('should return 404 for non-existent day', async () => {
    const request = new Request('http://localhost/api/sprint/999');
    const response = await GET(request, { params: { dayNumber: '999' } });

    expect(response.status).toBe(404);
  });

  it('should return 400 for invalid day number format', async () => {
    const request = new Request('http://localhost/api/sprint/abc');
    const response = await GET(request, { params: { dayNumber: 'abc' } });

    expect(response.status).toBe(400);
  });

  it('should handle missing params', async () => {
    const request = new Request('http://localhost/api/sprint/');
    const response = await GET(request, { params: {} });

    expect(response.status).toBe(400);
  });
});
```

**Example: Stripe Webhook**
```typescript
// src/test/integration/api/stripe-webhook.test.ts
import { describe, it, expect, vi } from 'vitest';
import { POST } from '@/app/api/stripe/webhook/route';
import Stripe from 'stripe';

describe('POST /api/stripe/webhook', () => {
  it('should handle checkout.session.completed', async () => {
    const mockEvent: Stripe.Event = {
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_123',
          customer_email: 'test@example.com',
          // ...
        }
      }
    };

    const request = new Request('http://localhost/api/stripe/webhook', {
      method: 'POST',
      headers: { 'stripe-signature': 'test_sig' },
      body: JSON.stringify(mockEvent)
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
  });

  it('should reject invalid signature', async () => {
    const request = new Request('http://localhost/api/stripe/webhook', {
      method: 'POST',
      headers: { 'stripe-signature': 'invalid' },
      body: JSON.stringify({})
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it('should handle customer.subscription.deleted', async () => {
    // Test subscription cancellation flow
  });
});
```

### 3.3 MSW (Mock Service Worker) Setup

```typescript
// src/test/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  // GitHub OAuth
  http.post('https://github.com/login/oauth/access_token', () => {
    return HttpResponse.json({
      access_token: 'gho_test_token',
      token_type: 'bearer',
      scope: 'repo,user',
    });
  }),

  // GitHub User API
  http.get('https://api.github.com/user', () => {
    return HttpResponse.json({
      login: 'testuser',
      name: 'Test User',
      email: 'test@example.com',
      avatar_url: 'https://example.com/avatar.jpg',
    });
  }),

  // Stripe API
  http.post('https://api.stripe.com/v1/checkout/sessions', () => {
    return HttpResponse.json({
      id: 'cs_test_123',
      url: 'https://checkout.stripe.com/test',
    });
  }),

  // Bunny Stream (future)
  http.get('https://video.bunnycdn.com/library/*/videos/*', () => {
    return HttpResponse.json({
      videoLibraryId: 12345,
      guid: 'abc-123',
      status: 4, // Ready
    });
  }),
];
```

```typescript
// src/test/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

```typescript
// src/test/setup.ts
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './mocks/server';
import '@testing-library/jest-dom/vitest';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

---

## 4. End-to-End Testing Strategy

### 4.1 Critical User Flows

#### Flow 1: Landing Page → Newsletter Signup
```typescript
// src/test/e2e/landing.spec.ts
import { test, expect } from '@playwright/test';

test('user can sign up for newsletter', async ({ page }) => {
  await page.goto('/');

  // Verify landing page loads
  await expect(page.getByRole('heading', { name: /becoming diamond/i })).toBeVisible();

  // Fill newsletter form
  await page.getByPlaceholder('Enter your email').fill('test@example.com');
  await page.getByRole('button', { name: /join/i }).click();

  // Verify success message
  await expect(page.getByText(/thank you/i)).toBeVisible({ timeout: 5000 });

  // Verify API call was made
  const response = await page.waitForResponse(resp =>
    resp.url().includes('/api/leads') && resp.status() === 200
  );
  expect(response.ok()).toBeTruthy();
});

test('landing page loads all sections', async ({ page }) => {
  await page.goto('/');

  // Check hero section
  await expect(page.getByTestId('hero-section')).toBeVisible();

  // Scroll to features (BentoGrid)
  await page.getByTestId('features-section').scrollIntoViewIfNeeded();
  await expect(page.getByTestId('features-section')).toBeInViewport();

  // Check timeline
  await page.getByTestId('timeline-section').scrollIntoViewIfNeeded();
  await expect(page.getByTestId('timeline-section')).toBeInViewport();

  // Check testimonials
  await page.getByTestId('testimonials-section').scrollIntoViewIfNeeded();
  await expect(page.getByTestId('testimonials-section')).toBeInViewport();
});
```

#### Flow 2: Member Portal Navigation
```typescript
// src/test/e2e/member-portal.spec.ts
import { test, expect } from '@playwright/test';

test.use({ storageState: 'src/test/fixtures/auth.json' }); // Pre-authenticated

test('authenticated user can navigate member portal', async ({ page }) => {
  await page.goto('/app');

  // Verify dashboard loads
  await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();

  // Check navigation items
  const nav = page.getByRole('navigation');
  await expect(nav.getByRole('link', { name: /courses/i })).toBeVisible();
  await expect(nav.getByRole('link', { name: /chat/i })).toBeVisible();
  await expect(nav.getByRole('link', { name: /profile/i })).toBeVisible();

  // Navigate to courses
  await page.getByRole('link', { name: /courses/i }).click();
  await expect(page).toHaveURL('/app/courses');
  await expect(page.getByRole('heading', { name: /courses/i })).toBeVisible();

  // Check active route highlighting
  const activeLink = page.getByRole('link', { name: /courses/i });
  await expect(activeLink).toHaveClass(/active|bg-primary/);
});

test('mobile navigation works', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
  await page.goto('/app');

  // Menu should be hidden initially
  const nav = page.getByRole('navigation');
  await expect(nav).not.toBeVisible();

  // Open mobile menu
  await page.getByRole('button', { name: /menu/i }).click();
  await expect(nav).toBeVisible();

  // Navigate and menu should close
  await page.getByRole('link', { name: /courses/i }).click();
  await expect(nav).not.toBeVisible();
});
```

#### Flow 3: Course Video Playback
```typescript
// src/test/e2e/course-playback.spec.ts
import { test, expect } from '@playwright/test';

test.use({ storageState: 'src/test/fixtures/auth.json' });

test('user can watch course video', async ({ page }) => {
  await page.goto('/app/courses/pr1-stabilize-snowflakes-to-diamonds');

  // Course page loads
  await expect(page.getByRole('heading', { name: /pressure room 1/i })).toBeVisible();

  // Navigate to first slide with video
  await page.getByRole('button', { name: /slide 1/i }).click();

  // Wait for video token API call
  const tokenResponse = await page.waitForResponse(
    resp => resp.url().includes('/api/video/') && resp.url().includes('/token')
  );
  expect(tokenResponse.ok()).toBeTruthy();

  // Video player loads
  const video = page.locator('video');
  await expect(video).toBeVisible({ timeout: 10000 });

  // Check video attributes
  await expect(video).toHaveAttribute('src', /\.m3u8/); // HLS stream

  // Play video
  await video.click();
  await page.waitForTimeout(2000); // Let video play briefly

  // Verify video is playing
  const isPaused = await video.evaluate(v => (v as HTMLVideoElement).paused);
  expect(isPaused).toBe(false);

  // Progress tracking
  await page.getByRole('button', { name: /next slide/i }).click();
  await expect(page.getByText(/slide 1.*completed/i)).toBeVisible();
});
```

#### Flow 4: OAuth Flow (Decap CMS)
```typescript
// src/test/e2e/oauth-flow.spec.ts
import { test, expect } from '@playwright/test';

test('CMS OAuth flow completes successfully', async ({ page, context }) => {
  await page.goto('/admin');

  // CMS loads
  await expect(page.getByText(/decap cms/i)).toBeVisible();

  // Click GitHub login
  const [popup] = await Promise.all([
    context.waitForEvent('page'),
    page.getByRole('button', { name: /login.*github/i }).click()
  ]);

  // Popup redirects to GitHub
  await popup.waitForLoadState();
  expect(popup.url()).toContain('github.com/login/oauth/authorize');

  // Mock GitHub authorization (in test mode, use test OAuth app)
  // In production, this would require actual GitHub interaction
  await popup.goto('/api/callback?code=test_auth_code&state=test_state');

  // Popup posts message back to parent
  await page.waitForEvent('console', msg =>
    msg.text().includes('authorization') || msg.text().includes('success')
  );

  // Main window receives auth and CMS becomes accessible
  await expect(page.getByRole('button', { name: /new entry/i })).toBeVisible({ timeout: 10000 });
});
```

#### Flow 5: Stripe Checkout (Test Mode)
```typescript
// src/test/e2e/payment-flow.spec.ts
import { test, expect } from '@playwright/test';

test.skip(({ browserName }) => browserName !== 'chromium', 'Stripe test mode only in Chrome');

test('user can complete checkout', async ({ page }) => {
  await page.goto('/');

  // Click pricing/buy button
  await page.getByRole('button', { name: /get access/i }).click();

  // Checkout API call
  const checkoutResponse = await page.waitForResponse('/api/checkout/create-session');
  expect(checkoutResponse.ok()).toBeTruthy();

  // Redirects to Stripe
  await page.waitForURL(/checkout\.stripe\.com/);

  // Fill test card details (Stripe test mode)
  await page.getByPlaceholder('Card number').fill('4242 4242 4242 4242');
  await page.getByPlaceholder('MM / YY').fill('12/34');
  await page.getByPlaceholder('CVC').fill('123');
  await page.getByPlaceholder('ZIP').fill('12345');

  // Submit payment
  await page.getByRole('button', { name: /pay/i }).click();

  // Redirects back to success page
  await page.waitForURL('/checkout/success');
  await expect(page.getByText(/thank you/i)).toBeVisible();

  // Verify webhook was called (check logs or DB)
  // This would require test environment instrumentation
});
```

### 4.2 Visual Regression Testing

```typescript
// src/test/e2e/visual-regression.spec.ts
import { test, expect } from '@playwright/test';

test.describe('visual regression', () => {
  test('landing page matches baseline', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Take full page screenshot
    await expect(page).toHaveScreenshot('landing-full.png', {
      fullPage: true,
      animations: 'disabled', // Disable Framer Motion
    });
  });

  test('member dashboard matches baseline', async ({ page }) => {
    // Load auth state
    await page.goto('/app');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('dashboard.png', {
      mask: [page.getByTestId('user-avatar')], // Mask dynamic content
    });
  });

  test('course viewer matches baseline', async ({ page }) => {
    await page.goto('/app/courses/pr1-stabilize-snowflakes-to-diamonds');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('course-viewer.png', {
      mask: [page.locator('video')], // Mask video player
    });
  });
});
```

### 4.3 Accessibility Testing

```typescript
// Install: npm install -D axe-playwright

// src/test/e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('accessibility', () => {
  test('landing page has no a11y violations', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('member portal has no a11y violations', async ({ page }) => {
    await page.goto('/app');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
```

---

## 5. Configuration Files

### 5.1 Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/test/**/*.test.{ts,tsx}'],
    exclude: ['node_modules', 'dist', '.next'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov', 'json'],
      exclude: [
        'src/components/ui/**', // Aceternity vendor components
        '**/*.config.*',
        '**/*.d.ts',
        '**/dist/**',
        '**/node_modules/**',
        '**/test/**',
        '**/.next/**',
      ],
      thresholds: {
        statements: 70,
        branches: 65,
        functions: 70,
        lines: 70,
      },
    },
    // Mock environment variables
    env: {
      GITHUB_CLIENT_ID: 'test_client_id',
      GITHUB_CLIENT_SECRET: 'test_client_secret',
      TURSO_DATABASE_URL: 'libsql://test.turso.io',
      TURSO_AUTH_TOKEN: 'test_token',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### 5.2 Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/test/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'playwright-report/results.json' }],
  ],
  use: {
    baseURL: 'http://localhost:3003',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    // Desktop browsers
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Mobile browsers
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 13'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3003',
    reuseExistingServer: !process.env.CI,
    timeout: 120000, // 2 minutes for cold start
  },
});
```

### 5.3 Test Setup File

```typescript
// src/test/setup.ts
import { beforeAll, afterEach, afterAll, vi } from 'vitest';
import { server } from './mocks/server';
import '@testing-library/jest-dom/vitest';

// Start MSW server
beforeAll(() => {
  server.listen({
    onUnhandledRequest: 'warn' // Don't fail on unhandled requests
  });
});

// Reset handlers after each test
afterEach(() => {
  server.resetHandlers();
});

// Clean up after all tests
afterAll(() => {
  server.close();
});

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/test-path',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next-auth
vi.mock('next-auth/react', () => ({
  useSession: () => ({
    data: {
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
      },
    },
    status: 'authenticated',
  }),
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

// Suppress console errors in tests (optional)
global.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
};
```

### 5.4 Custom Test Utils

```typescript
// src/lib/test-utils.tsx
import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';

interface WrapperProps {
  children: React.ReactNode;
}

const AllTheProviders = ({ children }: WrapperProps) => {
  return (
    <SessionProvider
      session={{
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
          name: 'Test User',
        },
        expires: '2099-12-31',
      }}
    >
      {children}
    </SessionProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

---

## 6. Dependencies & Installation

### 6.1 NPM Packages

```json
{
  "devDependencies": {
    // Unit & Integration Testing
    "vitest": "^2.1.8",
    "@vitest/ui": "^2.1.8",
    "@vitest/coverage-v8": "^2.1.8",
    "happy-dom": "^16.7.1",

    // Component Testing
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.5.2",
    "@testing-library/jest-dom": "^6.6.3",

    // API Mocking
    "msw": "^2.8.1",

    // E2E Testing
    "@playwright/test": "^1.51.0",

    // Accessibility Testing
    "@axe-core/playwright": "^4.11.0"
  }
}
```

### 6.2 Installation Commands

```bash
# Install all test dependencies
npm install -D vitest @vitest/ui @vitest/coverage-v8 happy-dom \
  @testing-library/react @testing-library/user-event @testing-library/jest-dom \
  msw @playwright/test @axe-core/playwright

# Install Playwright browsers
npx playwright install --with-deps
```

### 6.3 NPM Scripts

```json
{
  "scripts": {
    // Unit & Integration
    "test": "vitest",
    "test:unit": "vitest run src/test/unit",
    "test:integration": "vitest run src/test/integration",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest watch",

    // E2E
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:report": "playwright show-report",

    // Combined
    "test:all": "npm run test:coverage && npm run test:e2e",
    "test:ci": "npm run test:coverage -- --reporter=json && npm run test:e2e -- --reporter=json"
  }
}
```

---

## 7. Directory Structure

```
src/
├── test/
│   ├── setup.ts                           # Vitest global setup
│   ├── mocks/
│   │   ├── handlers.ts                    # MSW request handlers
│   │   ├── server.ts                      # MSW server config
│   │   └── fs.ts                          # File system mocks
│   ├── fixtures/
│   │   ├── content.ts                     # Sample markdown content
│   │   ├── courses.ts                     # Sample course data
│   │   ├── users.ts                       # Test user fixtures
│   │   └── auth.json                      # Playwright auth state
│   ├── unit/
│   │   ├── lib/
│   │   │   ├── content.test.ts            # Content management
│   │   │   ├── course-parser.test.ts      # Course parsing
│   │   │   ├── utils.test.ts              # Utilities
│   │   │   ├── turso.test.ts              # Database client
│   │   │   └── rag/
│   │   │       └── claude-simple.test.ts  # RAG logic
│   │   └── components/
│   │       ├── course/
│   │       │   ├── ChapterNav.test.tsx
│   │       │   └── CourseProgress.test.tsx
│   │       ├── auth/
│   │       │   ├── SignOutButton.test.tsx
│   │       │   └── UserAvatar.test.tsx
│   │       └── MarkdownMessage.test.tsx
│   ├── integration/
│   │   ├── api/
│   │   │   ├── auth.test.ts               # OAuth flow
│   │   │   ├── courses.test.ts            # Course APIs
│   │   │   ├── sprint.test.ts             # Sprint day APIs
│   │   │   ├── chat.test.ts               # AI chat API
│   │   │   ├── profile.test.ts            # User profile
│   │   │   ├── video.test.ts              # Video token API
│   │   │   ├── checkout.test.ts           # Stripe checkout
│   │   │   ├── stripe-webhook.test.ts     # Webhook handling
│   │   │   └── leads.test.ts              # Newsletter signups
│   │   └── content/
│   │       ├── markdown-parsing.test.ts   # Markdown pipeline
│   │       └── video-placeholders.test.ts # Video embed parsing
│   └── e2e/
│       ├── landing.spec.ts                # Landing page flows
│       ├── member-portal.spec.ts          # Member navigation
│       ├── oauth-flow.spec.ts             # CMS OAuth
│       ├── course-playback.spec.ts        # Video playback
│       ├── payment-flow.spec.ts           # Stripe checkout
│       ├── visual-regression.spec.ts      # Screenshot tests
│       └── accessibility.spec.ts          # a11y tests
└── lib/
    └── test-utils.tsx                     # Custom render with providers
```

---

## 8. Implementation Phases

### Phase 1: Foundation (Week 1) - 15-20 hours

**Objectives**: Set up infrastructure, write first tests

**Tasks**:
1. Install Vitest, React Testing Library, MSW
2. Create test directory structure
3. Configure `vitest.config.ts` with path aliases and coverage
4. Set up `src/test/setup.ts` with MSW server
5. Create mock handlers for GitHub/Stripe APIs
6. Write test fixtures (content, courses, users)
7. Implement first 10 unit tests:
   - `getContentByType()` - 5 tests
   - `getContentBySlug()` - 2 tests
   - `replaceVideoPlaceholders()` - 3 tests
8. Set up GitHub Actions workflow for CI

**Success Criteria**:
- `npm run test` executes successfully
- Coverage report generates
- CI pipeline runs on push

---

### Phase 2: Core Coverage (Week 2) - 20-25 hours

**Objectives**: Complete unit tests, start integration tests

**Tasks**:
1. Complete unit tests for `src/lib/content.ts` (remaining 6 functions)
2. Write unit tests for `src/lib/course-parser.ts`
3. Write unit tests for `src/lib/utils.ts`
4. Write unit tests for `src/lib/turso.ts` (with mocked DB client)
5. Write component tests:
   - `ChapterNav` - 5 tests
   - `CourseProgress` - 4 tests
   - `MarkdownMessage` - 4 tests
   - `SignOutButton` - 3 tests
   - Member portal layout - 5 tests
6. Start integration tests:
   - `/api/sprint/[dayNumber]` - 4 tests
   - `/api/courses` - 3 tests
   - `/api/auth` (POST) - 4 tests

**Success Criteria**:
- 50%+ code coverage achieved
- All `src/lib/**` modules have tests
- Core components have tests
- 3+ API routes have integration tests

---

### Phase 3: E2E & Advanced (Week 3) - 25-30 hours

**Objectives**: E2E tests, advanced integrations, visual regression

**Tasks**:
1. Install Playwright and configure browsers
2. Create authenticated state fixture for member portal tests
3. Write E2E tests:
   - Landing page flow (newsletter signup) - 2 tests
   - Member portal navigation - 3 tests
   - Course video playback - 2 tests
   - OAuth flow (Decap CMS) - 1 test
   - Payment flow (Stripe test mode) - 1 test (skipped in CI)
4. Complete remaining API integration tests:
   - `/api/stripe/webhook` - 5 tests (checkout, subscription events)
   - `/api/video/[videoId]/token` - 3 tests
   - `/api/chat` - 4 tests
   - `/api/profile` - 3 tests
   - `/api/leads` - 3 tests
5. Set up visual regression baseline screenshots
6. Add accessibility tests with axe-playwright

**Success Criteria**:
- All critical user flows have E2E tests
- All 19 API routes have integration tests
- Visual regression baselines captured
- No accessibility violations on key pages

---

### Phase 4: Optimization & Polish (Week 4) - 10-15 hours

**Objectives**: Reach 70% coverage, optimize tests, documentation

**Tasks**:
1. Fill coverage gaps to reach 70% threshold
2. Add parameterized tests for edge cases
3. Optimize slow tests (parallelize, reduce wait times)
4. Create test data factories for common fixtures
5. Document testing patterns in CLAUDE.md
6. Add pre-commit hook to run unit tests
7. Configure code coverage comments on PRs (Codecov)
8. Write testing best practices guide for team

**Success Criteria**:
- 70%+ code coverage maintained
- CI pipeline completes in <10 minutes
- Test documentation complete
- Team onboarded to testing workflow

---

## 9. CI/CD Integration

### 9.1 GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  unit-integration:
    name: Unit & Integration Tests
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit & integration tests with coverage
        run: npm run test:coverage
        env:
          GITHUB_CLIENT_ID: ${{ secrets.TEST_GITHUB_CLIENT_ID }}
          GITHUB_CLIENT_SECRET: ${{ secrets.TEST_GITHUB_CLIENT_SECRET }}
          TURSO_DATABASE_URL: ${{ secrets.TEST_TURSO_DATABASE_URL }}
          TURSO_AUTH_TOKEN: ${{ secrets.TEST_TURSO_AUTH_TOKEN }}

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v4
        with:
          files: ./coverage/lcov.info
          flags: unit-integration
          token: ${{ secrets.CODECOV_TOKEN }}

      - name: Upload coverage artifacts
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: coverage-report
          path: coverage/

  e2e:
    name: E2E Tests
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e
        env:
          NEXTAUTH_URL: http://localhost:3003
          NEXTAUTH_SECRET: test-secret-for-ci
          GITHUB_CLIENT_ID: ${{ secrets.TEST_GITHUB_CLIENT_ID }}
          GITHUB_CLIENT_SECRET: ${{ secrets.TEST_GITHUB_CLIENT_SECRET }}
          # Skip payment tests in CI (requires real Stripe test mode)
          SKIP_PAYMENT_TESTS: true

      - name: Upload Playwright report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

  coverage-check:
    name: Coverage Threshold Check
    runs-on: ubuntu-latest
    needs: unit-integration

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Download coverage artifacts
        uses: actions/download-artifact@v4
        with:
          name: coverage-report
          path: coverage/

      - name: Check coverage thresholds
        run: |
          # Parse coverage-summary.json
          STATEMENTS=$(jq '.total.statements.pct' coverage/coverage-summary.json)
          BRANCHES=$(jq '.total.branches.pct' coverage/coverage-summary.json)
          FUNCTIONS=$(jq '.total.functions.pct' coverage/coverage-summary.json)
          LINES=$(jq '.total.lines.pct' coverage/coverage-summary.json)

          # Check thresholds
          if (( $(echo "$STATEMENTS < 70" | bc -l) )); then
            echo "Statement coverage ($STATEMENTS%) below threshold (70%)"
            exit 1
          fi

          echo "Coverage thresholds met ✓"
```

### 9.2 Pre-commit Hook (Optional)

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "Running unit tests..."
npm run test:unit -- --run --bail

# Only commit if tests pass
if [ $? -ne 0 ]; then
  echo "Tests failed. Commit aborted."
  exit 1
fi
```

Install Husky:
```bash
npm install -D husky
npx husky init
```

---

## 10. Testing Best Practices

### 10.1 General Principles

1. **Test Behavior, Not Implementation**
   - ❌ Test internal state changes
   - ✅ Test user-visible outcomes

2. **Use Descriptive Test Names**
   - ❌ `it('works')`
   - ✅ `it('should return published items sorted by date descending')`

3. **Arrange-Act-Assert Pattern**
   ```typescript
   it('should calculate progress percentage', () => {
     // Arrange
     const completed = 5;
     const total = 10;

     // Act
     const result = calculateProgress(completed, total);

     // Assert
     expect(result).toBe(50);
   });
   ```

4. **One Assertion per Test (Guideline)**
   - Test one behavior per test case
   - Multiple assertions OK if testing same behavior

5. **Mock External Dependencies**
   - File system, network requests, databases
   - Use MSW for HTTP requests
   - Use `vi.mock()` for modules

### 10.2 Component Testing

**Use React Testing Library queries in this order**:
1. `getByRole` (most accessible)
2. `getByLabelText` (forms)
3. `getByPlaceholderText`
4. `getByText`
5. `getByTestId` (last resort)

**Example**:
```typescript
// ❌ Bad
const button = container.querySelector('.submit-button');

// ✅ Good
const button = screen.getByRole('button', { name: /submit/i });
```

### 10.3 API Testing

**Test all response codes**:
```typescript
it('should return 200 for valid request');
it('should return 400 for invalid params');
it('should return 401 for unauthenticated request');
it('should return 404 for non-existent resource');
it('should return 500 for server errors');
```

**Test request/response structure**:
```typescript
it('should return correct response shape', async () => {
  const response = await GET(request, { params: { id: '1' } });
  const data = await response.json();

  expect(data).toMatchObject({
    id: expect.any(String),
    title: expect.any(String),
    createdAt: expect.any(String),
  });
});
```

### 10.4 E2E Testing

**Use Playwright auto-waiting**:
```typescript
// ❌ Bad
await page.waitForTimeout(5000);
await page.click('.button');

// ✅ Good
await page.getByRole('button', { name: /submit/i }).click();
```

**Test critical paths only**:
- Focus on happy paths and common error scenarios
- Don't test every edge case in E2E (use unit tests)

**Use page objects for complex flows**:
```typescript
// src/test/e2e/page-objects/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  async login(email: string, password: string) {
    await this.page.getByPlaceholder('Email').fill(email);
    await this.page.getByPlaceholder('Password').fill(password);
    await this.page.getByRole('button', { name: /login/i }).click();
  }

  async expectLoginSuccess() {
    await expect(this.page).toHaveURL('/app/dashboard');
  }
}
```

### 10.5 Coverage Guidelines

**What to exclude from coverage**:
- Vendor components (`src/components/ui/**`)
- Configuration files (`*.config.ts`)
- Type definitions (`*.d.ts`)
- Build output (`.next/`, `dist/`)

**What to prioritize**:
- Business logic (`src/lib/**`)
- API routes (`src/app/api/**/route.ts`)
- Custom components with logic

**Coverage thresholds**:
- 70% statements (minimum viable)
- 65% branches (control flow coverage)
- 70% functions
- 70% lines

---

## 11. Maintenance & Scaling

### 11.1 Test Maintenance Strategy

**Monthly**:
- Review flaky tests (>2% failure rate)
- Update visual regression baselines if UI changes
- Audit test execution time (target: <10min total)

**Quarterly**:
- Review coverage reports for gaps
- Update test fixtures with realistic data
- Audit MSW handlers for API changes

**Per Release**:
- Run full test suite before deployment
- Update E2E tests for new user flows
- Document new testing patterns

### 11.2 Scaling Considerations

**As team grows**:
- Add test ownership to CODEOWNERS
- Create test plan template for features
- Run tests in parallel (Playwright shards)

**As codebase grows**:
- Split test suites by feature area
- Use test impact analysis (run only affected tests)
- Consider separate test environments (dev, staging)

### 11.3 Performance Optimization

**Slow tests**:
- Mock heavy operations (video encoding, AI inference)
- Use `beforeAll` instead of `beforeEach` for setup
- Parallelize Playwright tests with sharding

**Large test suites**:
- Run unit tests on every commit
- Run integration tests on PR
- Run E2E tests nightly + pre-release

---

## 12. Success Metrics

### 12.1 Coverage Metrics

| Metric | Target | Rationale |
|--------|--------|-----------|
| Statement Coverage | 70% | Balance between effort and value |
| Branch Coverage | 65% | Test control flow paths |
| Function Coverage | 70% | All public APIs tested |
| Line Coverage | 70% | Actual code execution coverage |

### 12.2 Quality Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Flaky Test Rate | <2% | Failed tests / total runs |
| Test Execution Time | <10min | Full suite on CI |
| Bugs Caught by Tests | >50% | Bugs found pre-production |
| Time to Test New Feature | <20% dev time | Test writing efficiency |

### 12.3 Team Adoption Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| PRs with Tests | >90% | PRs with new test files |
| Test-First Development | >50% | Tests written before code |
| Test Documentation | 100% | All patterns documented |

---

## 13. Risk Mitigation

### 13.1 Technical Risks

**Risk**: Turbopack incompatibility with test frameworks
- **Mitigation**: Use Vitest (better ESM support than Jest)
- **Fallback**: Run tests with standard Webpack if needed

**Risk**: 3D component testing complexity (Three.js)
- **Mitigation**: Mock React Three Fiber in unit tests, skip rendering
- **Fallback**: Test integration points only, not 3D internals

**Risk**: OAuth flow testing in E2E
- **Mitigation**: Use test OAuth app with dummy credentials
- **Fallback**: Mock OAuth endpoints, test callback separately

**Risk**: Stripe webhook testing
- **Mitigation**: Use Stripe CLI for local webhooks, mock in CI
- **Fallback**: Manual testing in staging environment

### 13.2 Process Risks

**Risk**: Low team adoption of testing
- **Mitigation**: Pair programming sessions, test examples in PRs
- **Fallback**: Make tests required in CI (block merges)

**Risk**: Test maintenance burden
- **Mitigation**: Keep tests simple, avoid over-mocking
- **Fallback**: Archive tests for deprecated features

**Risk**: Slow CI pipeline
- **Mitigation**: Parallelize tests, use test impact analysis
- **Fallback**: Split into fast/slow suites (run slow nightly)

---

## 14. Resources & Documentation

### 14.1 Official Documentation

- [Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright](https://playwright.dev/)
- [MSW](https://mswjs.io/)
- [Next.js Testing Guide](https://nextjs.org/docs/app/building-your-application/testing)

### 14.2 Team Training Materials

**Recommended Learning Path**:
1. Vitest basics (2 hours)
2. React Testing Library patterns (3 hours)
3. Playwright E2E testing (3 hours)
4. MSW API mocking (2 hours)

**Internal Resources** (to be created):
- Testing pattern examples (`docs/testing-examples.md`)
- Video tutorial: "Writing Your First Test"
- Test troubleshooting guide

---

## 15. Appendix

### 15.1 Example Test Files

See complete examples in Phase implementation sections (8.2-8.5)

### 15.2 Coverage Report Example

```
File                        | % Stmts | % Branch | % Funcs | % Lines
----------------------------|---------|----------|---------|--------
src/lib/content.ts          |   85.2  |   78.3   |   91.7  |   85.2
src/lib/course-parser.ts    |   72.4  |   65.1   |   80.0  |   72.4
src/lib/utils.ts            |   95.0  |   90.0   |  100.0  |   95.0
src/components/course/      |   68.3  |   60.0   |   70.0  |   68.3
src/app/api/                |   73.1  |   66.7   |   75.0  |   73.1
----------------------------|---------|----------|---------|--------
Total                       |   74.3  |   68.2   |   78.1  |   74.3
```

### 15.3 Test Execution Times

| Suite | Tests | Time | Pass Rate |
|-------|-------|------|-----------|
| Unit | 120 | 2.3s | 100% |
| Integration | 45 | 8.7s | 98% |
| E2E | 12 | 4.2min | 95% |
| **Total** | **177** | **~5min** | **98%** |

---

## Conclusion

This testing strategy provides comprehensive coverage across unit, integration, and E2E layers with realistic timelines and clear success criteria. The phased implementation approach allows for incremental progress while maintaining development velocity.

**Key Takeaways**:
- Start with unit tests for core business logic
- Use MSW for realistic API mocking
- Focus E2E tests on critical user flows
- Exclude vendor components from coverage
- Maintain <10min CI pipeline
- Target 70% coverage as sustainable baseline

**Next Steps**:
1. Review and approve this plan
2. Set up Phase 1 infrastructure (Week 1)
3. Begin writing first tests
4. Iterate based on team feedback
