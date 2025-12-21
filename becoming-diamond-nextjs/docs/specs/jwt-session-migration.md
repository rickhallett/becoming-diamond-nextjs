# Pure JWT Session Migration Specification

**Date:** 2025-12-21
**Issue:** OAuth redirect loop due to database session UUID incompatible with edge middleware
**Solution:** Migrate to JWT sessions while maintaining database adapter for user/account storage
**Effort:** 30 minutes implementation + 15 minutes testing
**Risk Level:** LOW (easily reversible, no data loss)

---

## Executive Summary

**Problem:**
- Edge middleware cannot access Turso database to validate sessions
- Database sessions create UUID tokens that middleware cannot decode as JWTs
- Results in redirect loop after successful OAuth authentication

**Solution:**
- Switch `session.strategy` from `"database"` to `"jwt"` in auth.ts
- **Keep TursoAdapter** for user and account storage
- JWT sessions work natively with edge middleware (no database access needed)
- Existing JWT callbacks will now fire and populate session data

**Key Insight:**
Adapter and session strategy are **independent concerns**:
- **Adapter** = Where users/accounts/profiles are stored (Turso database)
- **Session Strategy** = Where session data is stored (JWT cookie vs database)

We want: **Database adapter (users) + JWT sessions** ✓

---

## Current Architecture vs New Architecture

### Current (Broken) Architecture

```
OAuth Flow:
1. User authenticates with Google
2. NextAuth creates user in database (via TursoAdapter)
3. NextAuth creates session in database with UUID token
4. Cookie set with UUID: "1b56ca92-2ef6-4025-b343-5c479f408ee3"
5. Middleware tries to decode UUID as JWT → FAILS
6. Middleware sees empty auth object → redirects to signin
7. Redirect loop

Session Validation (Middleware):
1. Middleware reads cookie value (UUID)
2. Tries to decode as JWT → FAILS (UUID is not a JWT)
3. Returns empty auth object
4. User appears unauthenticated

Session Validation (Server):
1. Server reads cookie value (UUID)
2. Queries database: SELECT * FROM sessions WHERE sessionToken = UUID
3. Returns user data
4. User is authenticated ✓

Problem: Middleware and server have different validation mechanisms
```

### New (Working) Architecture

```
OAuth Flow:
1. User authenticates with Google
2. NextAuth creates user in database (via TursoAdapter) ✓ SAME
3. NextAuth creates JWT token (encrypted, self-contained)
4. Cookie set with JWT: "eyJhbGc...long-encrypted-string"
5. Middleware decodes JWT → SUCCESS
6. Middleware sees user data → allows access ✓
7. User lands on /app/profile

Session Validation (Middleware):
1. Middleware reads cookie value (JWT)
2. Decodes JWT using AUTH_SECRET
3. Extracts user data from JWT claims
4. User is authenticated ✓

Session Validation (Server):
1. Server reads cookie value (JWT)
2. Decodes JWT using AUTH_SECRET
3. Extracts user data from JWT claims
4. User is authenticated ✓

Solution: Both middleware and server use same validation mechanism (JWT decode)
```

---

## What Changes

### File: `auth.ts`

**Line 130-134 (session config):**

```typescript
// BEFORE
session: {
  strategy: "database",
  maxAge: 30 * 24 * 60 * 60, // 30 days
  updateAge: 24 * 60 * 60, // 24 hours
},

// AFTER
session: {
  strategy: "jwt", // ← ONLY CHANGE
  maxAge: 30 * 24 * 60 * 60, // 30 days
  updateAge: 24 * 60 * 60, // 24 hours
},
```

**That's it. One word change: `"database"` → `"jwt"`**

---

## What STAYS THE SAME

### 1. TursoAdapter - KEEP IT
```typescript
adapter: TursoAdapter(turso), // ← NO CHANGE
```

**Why:** Adapter stores users, accounts, and verification tokens in database. This is separate from session storage. We still need this for:
- Creating user records on first OAuth signin
- Storing OAuth account linking (Google account → user)
- Firing `createUser` event (which creates user_profiles)
- Magic link verification token storage

**What adapter does WITH JWT sessions:**
- ✓ Creates users in database
- ✓ Creates accounts (OAuth linking)
- ✓ Fires createUser event
- ✗ Does NOT store sessions (JWT handles this)

### 2. Providers - NO CHANGE
```typescript
providers: [
  Nodemailer(...), // Magic link still works
  Google(...),     // OAuth still works
  GitHub(...),     // OAuth still works
]
```

### 3. Callbacks - NO CHANGE
JWT and session callbacks we added in deployment #5 will now actually fire:
```typescript
callbacks: {
  async jwt({ token, user, trigger, session }) {
    // NOW FIRES with JWT strategy ✓
  },
  async session({ session, user, token }) {
    // NOW FIRES with JWT strategy ✓
  },
  async signIn({ user, account, profile, email }) {
    // Still fires, same as before ✓
  }
}
```

### 4. Events - NO CHANGE
```typescript
events: {
  async createUser({ user }) {
    // Still fires, creates user_profiles ✓
  }
}
```

### 5. Cookie Configuration - NO CHANGE
Already configured correctly in both auth.ts and auth.config.ts

### 6. Middleware - NO CHANGE
Already configured for JWT strategy in auth.config.ts

---

## How JWT Sessions Work with Database Adapter

### First-Time OAuth Signin Flow

```
1. User clicks "Continue with Google"
   ↓
2. Google OAuth flow completes
   ↓
3. NextAuth receives user data from Google
   ↓
4. TursoAdapter.getUserByEmail(email) → user not found
   ↓
5. TursoAdapter.createUser(userData) → creates user in database
   ↓
6. TursoAdapter.linkAccount(account) → creates account record
   ↓
7. Events.createUser() fires → creates user_profile
   ↓
8. jwt() callback fires → encodes user data into token
   {
     id: "uuid",
     email: "user@example.com",
     name: "User Name",
     picture: "avatar.jpg"
   }
   ↓
9. JWT created and encrypted with AUTH_SECRET
   ↓
10. Session cookie set with JWT value
   ↓
11. User redirected to /app/profile
   ↓
12. Middleware decodes JWT → user authenticated ✓
```

### Returning User OAuth Signin Flow

```
1. User clicks "Continue with Google"
   ↓
2. Google OAuth flow completes
   ↓
3. NextAuth receives user data from Google
   ↓
4. TursoAdapter.getUserByEmail(email) → user FOUND
   ↓
5. TursoAdapter.getAccount(providerId, providerAccountId) → account FOUND
   ↓
6. jwt() callback fires → encodes existing user data
   ↓
7. JWT created with user data
   ↓
8. Session cookie set
   ↓
9. User redirected to /app/profile
   ↓
10. Middleware decodes JWT → user authenticated ✓
```

### Magic Link Flow

```
1. User enters email, clicks "Send Magic Link"
   ↓
2. NextAuth generates verification token
   ↓
3. TursoAdapter.createVerificationToken() → stores in database
   ↓
4. Email sent with magic link
   ↓
5. User clicks link
   ↓
6. NextAuth verifies token
   ↓
7. TursoAdapter.useVerificationToken() → validates and deletes token
   ↓
8. If user exists: TursoAdapter.getUser()
   If new user: TursoAdapter.createUser() + Events.createUser()
   ↓
9. jwt() callback fires → encodes user data
   ↓
10. JWT session created
   ↓
11. User authenticated ✓
```

---

## Database Impact

### Tables Still Used ✓

1. **users** - All user records stored here
   - OAuth users
   - Magic link users
   - Profile data (name, email, image)

2. **accounts** - OAuth account linking
   - Which Google account belongs to which user
   - Which GitHub account belongs to which user
   - Enables multiple OAuth providers per user

3. **verification_tokens** - Magic link tokens
   - Temporary tokens for email verification
   - Auto-deleted after use

4. **user_profiles** - Custom profile data
   - Created by createUser event
   - Linked to users.id
   - Sprint progress, settings, etc.

### Table No Longer Used ✗

**sessions** - Session storage
- Previously stored: sessionToken (UUID), userId, expires
- With JWT: Sessions stored in encrypted cookie instead
- **Action:** Can delete old sessions, table can stay empty

### Cleanup Old Sessions (Optional)

```sql
-- After deployment, optionally clean up old database sessions
DELETE FROM sessions WHERE expires < CURRENT_TIMESTAMP;

-- Or delete all old sessions
DELETE FROM sessions;

-- Table can stay in schema (doesn't hurt), or drop it
-- DROP TABLE sessions; -- optional
```

---

## What We Lose

### 1. Server-Side Session Invalidation
**Before:** Could delete session from database to force logout
```sql
DELETE FROM sessions WHERE userId = 'xxx';
```

**After:** Can't invalidate JWT until it expires naturally (maxAge: 30 days)

**Mitigation:**
- JWT expiry is 30 days (acceptable for this use case)
- If need immediate logout, can implement token blacklist (add later if needed)
- For most use cases, client-side logout (clear cookie) is sufficient

### 2. Session Query Capabilities
**Before:** Could query active sessions
```sql
SELECT * FROM sessions WHERE userId = 'xxx';
SELECT COUNT(*) FROM sessions; -- active user count
```

**After:** Sessions not in database, can't query them

**Mitigation:**
- Track user activity through API logs (Axiom)
- Track last login in user_profiles table (can add later)
- For analytics, track signin events instead of active sessions

### 3. Session Data Size Limit
**Before:** Database session can store unlimited data

**After:** JWT cookie limited to ~4KB

**Current Usage:** ~200 bytes (id, email, name, picture)
**Headroom:** 20x safety margin
**Mitigation:** If need more data, store in database and fetch using userId from JWT

---

## What We Gain

### 1. Edge Middleware Compatibility ✓
- Middleware can validate sessions without database access
- Fast, no latency from database queries
- Works in edge runtime globally

### 2. Reduced Database Load ✓
- No session queries on every request
- Only user/account queries during signin
- Database used for data storage, not session validation

### 3. Simpler Architecture ✓
- One validation mechanism (JWT decode) for both middleware and server
- No session table to maintain
- No session cleanup jobs needed

### 4. Better Scalability ✓
- Stateless session validation
- No session table growing infinitely
- No database connection needed for auth checks

---

## Implementation Steps

### Step 1: Modify auth.ts

```bash
# Open file
code auth.ts

# Line 130-134: Change session.strategy
session: {
  strategy: "jwt", // ← Change from "database" to "jwt"
  maxAge: 30 * 24 * 60 * 60,
  updateAge: 24 * 60 * 60,
},

# Save file
```

### Step 2: Verify No Other Changes Needed

**Checklist:**
- [ ] TursoAdapter still present ✓
- [ ] Providers unchanged ✓
- [ ] JWT callbacks present (lines 154-188) ✓
- [ ] Session callback present ✓
- [ ] Cookie config present ✓
- [ ] Events.createUser present ✓

### Step 3: Commit and Deploy

```bash
git add auth.ts

git commit -m "fix: migrate to JWT sessions for edge middleware compatibility

Switches from database sessions to JWT sessions to resolve OAuth redirect
loop caused by edge middleware inability to decode UUID session tokens.

Changes:
- session.strategy: 'database' → 'jwt' (auth.ts:131)

What stays the same:
- TursoAdapter for user/account storage
- JWT callbacks (already added in f3675e4)
- All providers (Nodemailer, Google, GitHub)
- Cookie configuration
- Middleware configuration

Technical details:
- Database sessions created UUID tokens incompatible with edge runtime
- JWT sessions create self-contained encrypted tokens
- Middleware can decode JWT without database access
- Users/accounts still stored in Turso database via adapter
- Old database sessions will be orphaned (users need to re-authenticate)

Closes: OAuth redirect loop issue
See: docs/specs/jwt-session-migration.md"

git push
```

### Step 4: Monitor Deployment

```bash
# Watch Vercel deployment
# Usually completes in 1-2 minutes
```

---

## Testing Checklist

### Test 1: Google OAuth (Primary Flow)

**Setup:**
1. Open incognito window
2. Clear all cookies for becomingdiamond.com
3. Open DevTools → Application → Cookies
4. Open DevTools → Network tab

**Steps:**
1. Navigate to https://www.becomingdiamond.com/auth/signin
2. Click "Continue with Google"
3. Complete Google authentication
4. **Expected:** Land on /app/profile (no redirect loop)

**Verify:**
- [ ] Cookie `__Secure-next-auth.session-token` is set
- [ ] Cookie value is LONG encrypted string (not UUID like "1b56ca92-...")
- [ ] Cookie value starts with "eyJ..." (base64 JWT format)
- [ ] Network tab shows: `/api/auth/callback/google` → 302 → `/app/profile` → 200
- [ ] No redirect to `/auth/signin`
- [ ] Profile page loads successfully
- [ ] User name/email displayed correctly

**Check Database:**
```sql
-- New user should be created
SELECT * FROM users ORDER BY created_at DESC LIMIT 1;

-- OAuth account should be linked
SELECT * FROM accounts ORDER BY created_at DESC LIMIT 1;

-- User profile should be created
SELECT * FROM user_profiles ORDER BY created_at DESC LIMIT 1;

-- Sessions table should be EMPTY (old sessions might exist)
SELECT COUNT(*) FROM sessions; -- Should be 0 for new sessions
```

### Test 2: Magic Link Flow

**Steps:**
1. In new incognito window, go to signin
2. Enter email address
3. Click "Send Magic Link"
4. Check email, click link
5. **Expected:** Land on /app/profile

**Verify:**
- [ ] Magic link email received
- [ ] Clicking link authenticates user
- [ ] JWT session created (check cookie)
- [ ] No redirect loop

### Test 3: Returning User (Already Exists)

**Steps:**
1. Logout (or use different incognito)
2. Sign in with same Google account
3. **Expected:** Immediate authentication, no new user created

**Verify:**
- [ ] Same user record used (check users table - no duplicate)
- [ ] New JWT session created
- [ ] Authentication works

### Test 4: Protected Route Access

**Steps:**
1. While authenticated, navigate to:
   - https://www.becomingdiamond.com/app/sprint
   - https://www.becomingdiamond.com/app/profile
2. **Expected:** All load without redirects

**Verify:**
- [ ] All /app/* routes accessible
- [ ] No middleware redirects
- [ ] User data displays correctly

### Test 5: Logout and Re-Authentication

**Steps:**
1. Click logout
2. **Expected:** Redirected to landing page
3. Try accessing /app/profile
4. **Expected:** Redirected to signin
5. Sign in again
6. **Expected:** Authentication works

**Verify:**
- [ ] Logout clears cookie
- [ ] Protected routes redirect when not authenticated
- [ ] Re-authentication works

---

## Production Log Analysis

### What to Look For in Logs

**Success Indicators:**
```
✓ [auth][debug]: adapter_createSession NOT present (JWT sessions don't create DB sessions)
✓ /api/auth/callback/google → 302
✓ /app/profile → 200 (not 307)
✓ No [auth][details]: {}
✓ Session creation via JWT (check for jwt callback logs if we add them)
```

**Failure Indicators:**
```
✗ [auth][details]: {} (middleware still can't decode)
✗ /app/profile → 307 (redirect)
✗ adapter_createSession with UUID (database sessions still being created)
✗ Cookie value is UUID format
```

### Debugging Failed Deployment

**If OAuth still fails:**

1. **Check cookie value** (DevTools → Application → Cookies)
   ```
   Name: __Secure-next-auth.session-token

   Value should be: eyJhbGc... (long encrypted string)
   Value should NOT be: 1b56ca92-... (UUID)
   ```

2. **Check deployment**
   ```bash
   # Verify commit is deployed
   git log --oneline -1

   # Should show the JWT migration commit
   ```

3. **Check auth.ts in production**
   - Vercel might have cached build
   - Verify line 131 shows `strategy: "jwt"`

4. **Check environment variables**
   - Navigate to /api/auth/debug
   - Verify AUTH_SECRET is set
   - JWT encoding requires AUTH_SECRET

5. **Add debug logging**
   ```typescript
   // Temporarily add to jwt callback
   async jwt({ token, user }) {
     console.log('[JWT CALLBACK FIRED]', { hasUser: !!user });
     if (user) {
       console.log('[JWT] Encoding user:', user.email);
       token.id = user.id;
       // ... rest
     }
     return token;
   }
   ```

---

## Rollback Plan

**If deployment fails catastrophically:**

### Immediate Rollback (2 minutes)

```bash
# Revert the commit
git revert HEAD

# Push to deploy previous version
git push
```

### Manual Rollback (5 minutes)

```typescript
// auth.ts line 131
session: {
  strategy: "database", // ← Change back from "jwt"
  maxAge: 30 * 24 * 60 * 60,
  updateAge: 24 * 60 * 60,
},
```

```bash
git add auth.ts
git commit -m "revert: rollback to database sessions"
git push
```

**Data Loss:** None - users just need to re-authenticate

---

## Edge Cases and Considerations

### 1. Concurrent Sessions Across Devices
**Behavior:** Each device gets its own JWT session
**Limitation:** Can't see/manage sessions centrally
**Acceptable:** Standard for JWT-based auth

### 2. JWT Token Refresh
**Behavior:** Token refreshed on activity (updateAge: 24 hours)
**Mechanism:** NextAuth automatically refreshes when user makes requests
**MaxAge:** 30 days absolute maximum

### 3. Session Data Updates
**Scenario:** User updates profile (name, email, avatar)
**Solution:** Trigger session update
```typescript
import { update } from "next-auth/react";

// After updating profile
await update({
  name: newName,
  email: newEmail,
  image: newImage,
});
```

This triggers the jwt callback with `trigger: "update"`

### 4. Admin Email Check
**Current:** Layout checks `session?.user?.email === 'support@becomingdiamond.com'`
**With JWT:** Email is in JWT, works exactly the same
**No changes needed**

### 5. API Route Authentication
**Current:** Use `auth()` from auth.ts
**With JWT:** Same, no changes
```typescript
import { auth } from '@/auth';

export async function GET() {
  const session = await auth();
  if (!session) return new Response('Unauthorized', { status: 401 });
  // ...
}
```

### 6. Server Component Authentication
**Current:** Use `auth()` from auth.ts
**With JWT:** Same, no changes
```typescript
import { auth } from '@/auth';

export default async function Page() {
  const session = await auth();
  // ...
}
```

---

## Success Criteria

The migration is successful when:

### Primary Criteria
- [ ] OAuth flow completes without redirect loop
- [ ] User lands on /app/profile after authentication
- [ ] Middleware allows access to /app/* routes
- [ ] Cookie contains JWT (not UUID)

### Secondary Criteria
- [ ] Users created in database (TursoAdapter working)
- [ ] Accounts linked (OAuth associations stored)
- [ ] User profiles created (createUser event fires)
- [ ] Magic link flow works
- [ ] Logout/re-login works

### Performance Criteria
- [ ] No database queries for session validation
- [ ] Fast middleware execution (<50ms)
- [ ] No session table growth

### Log Criteria
- [ ] No `[auth][details]: {}` in middleware logs
- [ ] No 307 redirects from /app/* routes
- [ ] No adapter_createSession with UUID tokens

---

## Post-Deployment Actions

### Immediate (Within 1 hour)
1. Test OAuth flow thoroughly
2. Monitor error logs
3. Check user creation in database
4. Verify middleware auth object has data

### Short-term (Within 1 day)
1. Test magic link flow
2. Test logout/re-login
3. Monitor Axiom logs for errors
4. Gather user feedback

### Long-term (Within 1 week)
1. Clean up old sessions from database
   ```sql
   DELETE FROM sessions;
   ```
2. Consider dropping sessions table (optional)
3. Document the new architecture
4. Update any session-related documentation

---

## Technical Deep Dive

### JWT Structure (For Reference)

**JWT Cookie Value:**
```
eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..abcdef123456.ghijkl789012.mnopqr345678
│                                │    │            │            │
│                                │    │            │            └─ Authentication tag
│                                │    │            └─ Encrypted payload (user data)
│                                │    └─ Initialization vector
│                                └─ JWT header (algorithm, encryption)
```

**Encrypted Payload Contains:**
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "name": "User Name",
  "picture": "https://avatar.url",
  "iat": 1703174400,
  "exp": 1705766400,
  "jti": "session-id"
}
```

**Encryption:**
- Algorithm: A256GCM (AES 256-bit Galois/Counter Mode)
- Key: Derived from AUTH_SECRET
- NextAuth handles all encryption/decryption automatically

### Session Validation Flow

**Middleware (Edge Runtime):**
```typescript
// auth.config.ts authorized() callback
export const authConfig = {
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ auth, request }) {
      // auth object populated by decoding JWT
      // No database access needed
      const isLoggedIn = !!auth?.user;

      if (isOnMemberPortal && !isLoggedIn) {
        return false; // Redirect to signin
      }

      return true;
    }
  }
}
```

**Server Components / API Routes:**
```typescript
// Uses same JWT decoding
import { auth } from '@/auth';

const session = await auth();
// session.user populated from JWT
// No database query
```

### Why This Works

**Before (Database Sessions):**
1. Cookie contains: `"1b56ca92-2ef6-4025-b343-5c479f408ee3"` (UUID)
2. Server: Queries database with UUID → Gets user data ✓
3. Middleware: Tries to decode UUID as JWT → FAILS ✗

**After (JWT Sessions):**
1. Cookie contains: `"eyJhbGc..."` (encrypted JWT)
2. Server: Decodes JWT → Gets user data ✓
3. Middleware: Decodes JWT → Gets user data ✓

Both use the same validation mechanism (JWT decoding).

---

## FAQ

**Q: Will this log out all current users?**
A: Yes. They'll need to re-authenticate. This is expected and acceptable.

**Q: What happens to existing user records?**
A: Nothing - they stay in database. Users just get new JWT sessions on next login.

**Q: Can we still track user activity?**
A: Yes - via Axiom logs, API request logs, and we can add last_login to user_profiles.

**Q: What if we need to force-logout a user?**
A: Implement token blacklist (check JWT ID against denied list). Can add later if needed.

**Q: Is this secure?**
A: Yes - JWT is encrypted with AUTH_SECRET. Standard pattern used by millions of apps.

**Q: What if JWT cookie gets stolen?**
A: Same risk as any session cookie. Use HTTPS (already configured), httpOnly (already configured), secure flag (already configured).

**Q: Can we switch back to database sessions later?**
A: Yes - just change strategy back to "database". One-line change, same as migration.

**Q: Do we lose any functionality?**
A: Only server-side session invalidation and session queries. Neither is critical for this app.

---

## Conclusion

This is a **one-line change** with **significant impact**:

**Change:** `strategy: "database"` → `strategy: "jwt"`

**Result:**
- ✓ OAuth redirect loop fixed
- ✓ Edge middleware works
- ✓ Users still stored in database
- ✓ Profiles still created
- ✓ All authentication flows work
- ✓ Simpler architecture
- ✓ Better performance

**Risk:** LOW - Easily reversible, no data loss
**Effort:** 30 minutes implementation + 15 minutes testing
**Confidence:** HIGH - This is the standard NextAuth pattern for edge middleware

**Ready to implement.**
