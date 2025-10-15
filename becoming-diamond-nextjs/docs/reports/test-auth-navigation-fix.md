# Test Auth Navigation Fix

**Date:** 2025-10-15
**Issue:** Test auth doesn't maintain user state during navigation like production auth
**Status:** ✅ FIXED

---

## Problem Description

**Context:**
After fixing the production auth navigation issue (see `profile-navigation-bug-fix.md`), test auth had inconsistent behavior. Test auth uses localStorage instead of NextAuth sessions, but wasn't properly integrated with the UserContext navigation flow.

**Symptoms:**
- Test login works initially
- Navigating between pages causes user state to be lost
- Pages show loading state indefinitely or lose user data
- Test auth doesn't persist across navigation like production auth

**Why This Matters:**
- Test auth is used for development and testing
- Inconsistent behavior between test and production auth makes testing unreliable
- Developers need confidence that test auth behaves like production auth

---

## Root Cause Analysis

### Architecture Overview

**Production Auth Flow:**
1. User signs in via NextAuth (Google, GitHub, Email)
2. NextAuth creates session in database
3. `useSession()` hook provides session state
4. `UserContext` fetches profile from `/api/profile` when session exists
5. Navigation triggers re-fetch but session persists

**Test Auth Flow (BEFORE FIX):**
1. User clicks "Test Login" button
2. `login()` function sets data in localStorage
3. User navigated to dashboard
4. Navigation causes component re-render
5. `useSession()` returns `status: 'unauthenticated'` (no real session)
6. `UserContext` effect cleared user state ❌
7. User appears logged out

### The Problem

The `UserContext` only checked for NextAuth sessions:

```typescript
// BEFORE FIX - Only handled NextAuth sessions
useEffect(() => {
  if (status === 'loading') {
    setIsLoading(true);
    return;
  }

  if (status === 'unauthenticated') {
    setUser(null);  // ❌ Clears test auth data
    setAuth({ isAuthenticated: false, userId: null });
    setIsLoading(false);
    return;
  }

  fetchProfile();  // Only runs for NextAuth sessions
}, [status, fetchProfile]);
```

When using test auth:
- `useSession()` returns `status: 'unauthenticated'`
- Effect cleared the user state set by `login()`
- Navigation re-triggered effect → user state lost

---

## Solution

### Strategy

Make `UserContext` handle both authentication modes:
1. **Production mode:** Use NextAuth session + API fetching
2. **Test mode:** Use localStorage persistence (no API calls)

### Code Changes

**File Modified:** `src/contexts/UserContext.tsx`

**1. Session Sync Effect (Lines 116-148)**

Added localStorage fallback when NextAuth session is unauthenticated:

```typescript
// AFTER FIX - Handles both NextAuth and test auth
useEffect(() => {
  if (status === 'loading') {
    setIsLoading(true);
    return;
  }

  if (status === 'unauthenticated') {
    // Check for test auth in localStorage (development mode)
    const storedAuth = storage.getItem<AuthState>(STORAGE_KEYS.USER_AUTH);
    const storedProfile = storage.getItem<UserProfile>(STORAGE_KEYS.USER_PROFILE);

    if (storedAuth && storedProfile && storedAuth.isAuthenticated) {
      // Test auth mode - use localStorage data
      setAuth(storedAuth);
      setUser(storedProfile);
      setIsLoading(false);
      return;
    }

    // No session and no test auth - truly unauthenticated
    setUser(null);
    setAuth({ isAuthenticated: false, userId: null });
    setIsLoading(false);
    return;
  }

  // Fetch profile from database when session is ready (production auth)
  fetchProfile();
}, [status, fetchProfile]);
```

**2. Update Profile Function (Lines 150-183)**

Skip API calls when in test mode:

```typescript
const updateProfile = async (updates: Partial<UserProfile>) => {
  if (!user) return;

  const updatedProfile = { ...user, ...updates };
  setUser(updatedProfile);

  // Test mode - update localStorage only
  if (auth.loginMethod === 'test') {
    storage.setItem(STORAGE_KEYS.USER_PROFILE, updatedProfile);
    return;  // ✅ Skip API call
  }

  // Production mode - update database via API
  try {
    const response = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    // ... rest of API logic
  }
};
```

**3. Refresh Profile Function (Lines 223-236)**

Handle both modes in refresh:

```typescript
const refreshProfile = async () => {
  // Test mode - reload from localStorage
  if (auth.loginMethod === 'test') {
    const storedProfile = storage.getItem<UserProfile>(STORAGE_KEYS.USER_PROFILE);
    if (storedProfile) {
      setUser(storedProfile);
    }
    return;
  }

  // Production mode - fetch from API
  await fetchProfile();
};
```

---

## How It Works Now

### Test Auth Flow (AFTER FIX)

1. **Login:**
   - User clicks "Test Login"
   - `login()` sets auth state and profile in localStorage
   - User redirected to dashboard
   - UserContext loads from localStorage ✅

2. **Navigation:**
   - User navigates to `/app/profile`
   - Component re-renders
   - `useSession()` returns `'unauthenticated'`
   - UserContext checks localStorage
   - Finds test auth data → restores state ✅
   - Navigation works seamlessly

3. **Profile Updates:**
   - User edits profile
   - `updateProfile()` detects test mode
   - Updates localStorage (skips API)
   - Changes persist across navigation ✅

### Production Auth Flow (Unchanged)

1. **Login:**
   - User signs in via OAuth/Email
   - NextAuth creates session
   - UserContext fetches from API
   - Profile loaded ✅

2. **Navigation:**
   - User navigates between pages
   - `useSession()` provides session
   - UserContext fetches from API
   - Profile reloaded ✅

3. **Profile Updates:**
   - User edits profile
   - `updateProfile()` calls API
   - Database updated
   - Changes synced ✅

---

## Benefits

### 1. Consistent Behavior
- Test auth now behaves like production auth during navigation
- No more lost user state
- Developers can trust test mode for development

### 2. No Breaking Changes
- Production auth flow unchanged
- Existing NextAuth integration intact
- Backward compatible

### 3. Clear Separation
- Test mode clearly identified by `auth.loginMethod === 'test'`
- Production mode uses API calls
- No confusion between modes

### 4. Robust Testing
- Can now test navigation flows in development
- Profile editing works in test mode
- All features testable without real authentication

---

## Testing Recommendations

### Manual Testing

**Test Auth Flow:**
1. [ ] Click "Test Login" → verify redirect to dashboard
2. [ ] Navigate to Profile → verify data persists
3. [ ] Navigate to Sprint → back to Profile → verify no data loss
4. [ ] Edit profile → save → navigate away → verify changes persist
5. [ ] Refresh page → verify test auth persists
6. [ ] Log out → verify localStorage cleared

**Production Auth Flow:**
1. [ ] Sign in with Google/GitHub → verify redirect
2. [ ] Navigate between pages → verify profile loads
3. [ ] Edit profile → verify API update
4. [ ] Refresh page → verify session persists
5. [ ] Log out → verify session cleared

**Cross-Mode Testing:**
1. [ ] Sign in with test auth → log out → sign in with production auth
2. [ ] Sign in with production auth → log out → sign in with test auth
3. [ ] Verify no data contamination between modes

### Automated Tests (Future)

```typescript
describe('UserContext - Test Auth', () => {
  it('should restore test auth from localStorage on navigation', () => {
    // Mock localStorage with test auth
    // Navigate between pages
    // Assert user state persists
  });

  it('should update localStorage in test mode', () => {
    // Log in with test auth
    // Update profile
    // Assert localStorage updated (not API)
  });

  it('should handle logout in test mode', () => {
    // Log in with test auth
    // Log out
    // Assert localStorage cleared
  });
});

describe('UserContext - Production Auth', () => {
  it('should fetch from API when session exists', () => {
    // Mock NextAuth session
    // Assert API call made
  });

  it('should not use localStorage in production mode', () => {
    // Sign in with OAuth
    // Assert localStorage not used for profile
  });
});
```

---

## Related Code

### Authentication
- `src/app/auth/signin/page.tsx:46-49` - Test login button handler
- `src/contexts/UserContext.tsx:186-208` - Login function
- `src/contexts/UserContext.tsx:210-221` - Logout function

### Storage
- `src/lib/storage.ts` - localStorage wrapper (STORAGE_KEYS)
- `STORAGE_KEYS.USER_AUTH` - Auth state storage key
- `STORAGE_KEYS.USER_PROFILE` - Profile storage key

### Session Management
- `auth.ts` - NextAuth configuration
- `middleware.ts` - Route protection
- `auth.config.ts` - Edge-compatible auth config

---

## Future Improvements

### Short-term
1. Add visual indicator when in test mode (dev badge in sidebar)
2. Add console logs to distinguish test vs production mode
3. Consider expiring test auth after some time period

### Long-term
1. **Mock API Mode:**
   - Make test auth use mock API endpoints
   - Better simulation of production behavior
   - Can test error handling

2. **Test Auth Persistence Options:**
   - Session storage for temporary test auth
   - Memory-only for ephemeral testing
   - Configurable test user profiles

3. **Development Tools:**
   - Dev panel to switch between test users
   - Quick reset test auth
   - Inspect auth state in UI

---

## Migration Notes

**For Developers:**
- Test auth now works consistently across navigation
- No changes needed to existing test login workflow
- Profile editing now works in test mode

**For New Features:**
- When adding features that use `UserContext`, they automatically work in both modes
- No special handling needed for test vs production
- Always check `auth.loginMethod` if you need mode-specific behavior

---

## Conclusion

**Problem:** Test auth lost user state during navigation due to localStorage not being checked when NextAuth session was unauthenticated.

**Solution:** Enhanced `UserContext` to check localStorage for test auth data when NextAuth session is unavailable, making test auth behavior consistent with production auth.

**Impact:** 1 file modified (`UserContext.tsx`), 3 functions updated (session sync, update profile, refresh profile).

**Result:** Test auth now provides reliable, consistent behavior for development and testing, matching production auth UX.
