# Test Fixtures

This directory contains test fixtures for Playwright E2E tests.

## auth.json

Mock authentication state for testing authenticated user flows.

### Usage

```typescript
import { test } from '@playwright/test';

// Use auth fixture for authenticated tests
test.use({ storageState: 'src/test/fixtures/auth.json' });

test('authenticated user can access member portal', async ({ page }) => {
  await page.goto('/app');
  // Test runs with mock authentication
});
```

### Generating Real Auth State

To capture actual authentication state from browser:

```bash
# Run Playwright in headed mode
npx playwright test --headed --debug

# In browser:
# 1. Navigate to /admin or /app
# 2. Complete real authentication
# 3. In Playwright Inspector, run:
await page.context().storageState({ path: 'src/test/fixtures/auth.json' });
```

### Current Implementation

The current `auth.json` contains **mock data only**. Real authentication requires:

1. Valid GitHub OAuth setup
2. NextAuth.js session token
3. Proper cookie configuration

For actual testing with authentication, either:
- Generate real auth state using method above
- Mock authentication at API/middleware level
- Use test-specific auth bypass for E2E tests

## Future Fixtures

Add additional fixtures as needed:

- `users.ts` - Test user data
- `content.ts` - Sample markdown content
- `courses.ts` - Course data for testing
