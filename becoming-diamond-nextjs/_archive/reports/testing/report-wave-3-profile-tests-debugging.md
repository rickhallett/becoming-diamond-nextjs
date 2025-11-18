# Wave 3 Profile Tests - Debugging Guide

## Current Issue

Profile E2E tests are failing because the authentication flow isn't working properly in the test environment. All 38 tests timeout waiting for profile content to appear.

## Root Cause Analysis

### UserContext Authentication Flow

```typescript
// UserContext checks NextAuth session first
const { data: session, status } = useSession();

useEffect(() => {
  if (status === 'loading') {
    setIsLoading(true);
    return;
  }

  if (status === 'unauthenticated') {
    // Falls back to localStorage test auth
    const storedAuth = storage.getItem<AuthState>(STORAGE_KEYS.USER_AUTH);
    const storedProfile = storage.getItem<UserProfile>(STORAGE_KEYS.USER_PROFILE);
    // ...
  }

  // Otherwise fetches from /api/profile
  fetchProfile();
}, [status, fetchProfile]);
```

**Problem:** In test environment:
1. NextAuth `useSession()` status may be stuck in 'loading'
2. Or NextAuth may not be configured, causing indefinite loading
3. Tests set localStorage but UserContext never checks it if NextAuth doesn't return 'unauthenticated'

### Playwright Configuration

```typescript
// playwright.config.ts
baseURL: 'http://localhost:3003',  // ✅ Correct
webServer: {
  command: 'npm run dev',
  url: 'http://localhost:3003',    // ✅ Correct
}
```
Port configuration is correct. Not the issue.

## Solution Options

### Option 1: Mock NextAuth Session (Recommended)

Add NextAuth session mocking to test setup:

```typescript
// In profile.spec.ts or test setup
await page.addInitScript(() => {
  // Mock NextAuth to return unauthenticated immediately
  window.__NEXT_DATA__ = {
    props: {
      pageProps: {
        session: null
      }
    }
  };
});
```

### Option 2: Create NextAuth Middleware Bypass

Add test mode detection to skip NextAuth:

```typescript
// In middleware or auth config
if (process.env.NODE_ENV === 'test' || process.env.BYPASS_AUTH === 'true') {
  // Skip NextAuth, use localStorage directly
}
```

### Option 3: Use Playwright's storageState

Create proper NextAuth session fixture:

```typescript
// Generate authenticated session
const { baseURL } = useConfig();
const page = await context.newPage();
await page.goto(`${baseURL}/api/auth/signin`);
// Complete auth flow
await context.storageState({ path: 'auth-state.json' });

// Use in tests
test.use({ storageState: 'auth-state.json' });
```

### Option 4: Environment Variable Flag

Add test mode flag to NextAuth config:

```typescript
// auth.ts or auth config
export const authOptions = {
  // ...
  skipSession: process.env.E2E_TEST_MODE === 'true'
};
```

Then run tests with:
```bash
E2E_TEST_MODE=true npm run test:e2e
```

## Quick Fix Implementation

### Step 1: Add Test Mode to UserContext

```typescript
// src/contexts/UserContext.tsx
useEffect(() => {
  // Check for test mode first
  if (typeof window !== 'undefined' && window.localStorage.getItem('E2E_TEST_MODE') === 'true') {
    const storedAuth = storage.getItem<AuthState>(STORAGE_KEYS.USER_AUTH);
    const storedProfile = storage.getItem<UserProfile>(STORAGE_KEYS.USER_PROFILE);

    if (storedAuth && storedProfile && storedAuth.isAuthenticated) {
      setAuth(storedAuth);
      setUser(storedProfile);
      setIsLoading(false);
      return;
    }
  }

  // Original NextAuth flow
  if (status === 'loading') {
    setIsLoading(true);
    return;
  }
  // ...
}, [status, fetchProfile]);
```

### Step 2: Update Test Setup

```typescript
// In profile.spec.ts
async function setUserAuth(page: Page, userType: 'newUser' | 'activeUser' | 'completedUser') {
  const authKey = profileFixtures.localStorage.userAuthKey;
  const profileKey = profileFixtures.localStorage.userProfileKey;

  // ... existing code ...

  await page.addInitScript(({ authKey, authValue, profileKey, profileValue }) => {
    // Enable test mode
    localStorage.setItem('E2E_TEST_MODE', 'true');
    localStorage.setItem(authKey, authValue);
    localStorage.setItem(profileKey, profileValue);
  }, { authKey, authValue, profileKey, profileValue });
}
```

## Verification Steps

1. **Check NextAuth Status:**
```typescript
test('debug: check NextAuth status', async ({ page }) => {
  await page.goto('/app/profile');

  const status = await page.evaluate(() => {
    // Check what NextAuth is returning
    return {
      sessionStorage: window.sessionStorage,
      localStorage: window.localStorage,
      cookies: document.cookie
    };
  });

  console.log('Auth state:', status);
});
```

2. **Check UserContext State:**
```typescript
test('debug: check UserContext', async ({ page }) => {
  await setUserAuth(page, 'activeUser');
  await page.goto('/app/profile');

  const userState = await page.evaluate(() => {
    return {
      authKey: localStorage.getItem('user_auth_v1'),
      profileKey: localStorage.getItem('user_profile_v1')
    };
  });

  console.log('UserContext state:', userState);
});
```

3. **Check Page Load:**
```typescript
test('debug: check page load', async ({ page }) => {
  await setUserAuth(page, 'activeUser');

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error));

  await page.goto('/app/profile');
  await page.waitForTimeout(5000);

  const content = await page.content();
  console.log('Page HTML:', content.substring(0, 1000));
});
```

## Expected Behavior After Fix

1. Tests set `E2E_TEST_MODE=true` in localStorage
2. UserContext checks for test mode first
3. If test mode, skip NextAuth and use localStorage directly
4. Profile page loads with test user data
5. All assertions pass

## Testing the Fix

```bash
# Run single test for debugging
npm run test:e2e -- profile.spec.ts -g "displays profile information"

# Run with debug mode
DEBUG=pw:api npm run test:e2e -- profile.spec.ts

# Run with headed browser to see what's happening
npm run test:e2e -- profile.spec.ts --headed --debug
```

## Alternative: Skip Profile Tests Until NextAuth is Configured

If NextAuth configuration is pending:

```typescript
test.describe.skip('profile management features', () => {
  // All tests will be skipped with clear reason
});
```

Or add condition:

```typescript
const NEXTAUTH_CONFIGURED = process.env.NEXTAUTH_URL !== undefined;

test.describe.skipIf(!NEXTAUTH_CONFIGURED)('profile management features', () => {
  // Tests run only if NextAuth is configured
});
```

## Summary

**Primary Issue:** UserContext's NextAuth session check blocks localStorage fallback in test environment

**Recommended Fix:** Add test mode flag that bypasses NextAuth and uses localStorage directly

**Implementation Time:** 15-30 minutes

**Alternative:** Use Playwright's authenticated session state management (more robust, takes longer)

---

## Next Steps

1. Choose solution approach (recommend Option 1 or Quick Fix)
2. Implement changes to UserContext
3. Update test setup with test mode flag
4. Run single test to verify fix
5. Run full suite
6. Remove debug tests after verification
