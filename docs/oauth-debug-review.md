# OAuth Authentication Debug Review

**Date:** 2025-12-21
**Issue:** OAuth redirect loop - users authenticate successfully but get redirected back to signin page
**Attempts:** 5 fix attempts across multiple deployments
**Status:** Awaiting deployment #5 test results

---

## Timeline of Changes and Fixes

### Attempt 1: Deploy the Original OAuth Fix
**Commit:** `8caecfe` (13 hours before debug session)
**Change:** Added `allowDangerousEmailAccountLinking: true` to Google and GitHub providers
**Problem Identified:** Fix not deployed to production
**Debug Strategy:** Checked recent commits and Vercel deployment timestamps
**What It Picked Up:** Deployment gap between fix commit and latest production deployment
**What It Missed:** Nothing - this was correct
**Result:** Deployed successfully but OAuth still failed

### Attempt 2: Add Cookie Configuration to auth.ts
**Commit:** `f59e61c`
**Changes:**
```typescript
// Added to auth.ts
cookies: {
  sessionToken: {
    name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
    options: {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
    },
  },
},

// Also enabled debug mode
debug: process.env.NODE_ENV === 'production'
```
**Problem Identified:** "invalid compact jwe" error suggested cookie/JWE issues
**Debug Strategy:** Read error message and assumed stale cookies or missing cookie config
**What It Picked Up:** Cookie configuration was indeed missing
**What It Missed:** That auth.config.ts (used by middleware) also needed this config
**Result:** Still failed with same symptoms

### Attempt 3: Add Cookie Configuration to auth.config.ts
**Commit:** `74ad68e`
**Change:** Added identical cookie configuration to auth.config.ts
**Problem Identified:** Log analysis showed middleware not seeing authenticated sessions
**Debug Strategy:** Analyzed production logs, noticed 307 redirects from protected routes
**What It Picked Up:** Middleware and main auth were using different cookie configurations
**What It Missed:** Edge runtime limitation - middleware can't access Turso database
**Result:** Still failed - empty auth object in middleware (`[auth][details]: {}`)

### Attempt 4: Add JWT Session Strategy to auth.config.ts
**Commit:** `4566f6c`
**Changes:**
```typescript
// Added to auth.config.ts
session: {
  strategy: "jwt", // Edge middleware must use JWT to avoid database calls
}
```
**Problem Identified:** Edge middleware cannot access Turso database to validate sessions
**Debug Strategy:** Researched NextAuth edge runtime limitations
**What It Picked Up:** Correctly identified that edge runtime can't make database calls
**What It Missed:** That database sessions create UUID tokens, not JWTs - middleware still can't decode them
**Result:** Still failed with identical symptoms - empty auth object

### Attempt 5: Add JWT Callbacks for Hybrid Strategy (CURRENT)
**Commit:** `f3675e4`
**Changes:**
```typescript
// Added to auth.ts callbacks
async jwt({ token, user, trigger, session: updateSession }) {
  if (user) {
    token.id = user.id;
    token.email = user.email;
    token.name = user.name;
    token.picture = user.image;
  }
  if (trigger === "update" && updateSession) {
    token.name = updateSession.name;
    token.email = updateSession.email;
    token.picture = updateSession.image;
  }
  return token;
},

async session({ session, user, token }) {
  if (user) {
    // Database session
    session.user.id = user.id;
  } else if (token) {
    // JWT session (middleware)
    session.user.id = token.id as string;
    session.user.email = token.email as string;
    session.user.name = token.name as string;
    session.user.image = token.picture as string;
  }
  return session;
}
```
**Problem Identified:** JWT strategy in middleware expects JWT tokens but gets UUID session tokens from database
**Debug Strategy:** Deeper analysis of NextAuth v5 session/token flow
**What It Picked Up:** Mismatch between token format (UUID) and expected format (JWT)
**What It Could Miss:** See "Potential Issues Still Not Addressed" below
**Result:** Pending deployment test

---

## Root Causes of Cyclical Debug Loops

### 1. **Incremental Fixes Without Full System Understanding**
Each fix addressed a symptom without understanding the complete session flow:
- Fix 1: Account linking (correct but insufficient)
- Fix 2: Cookie config in auth.ts (correct but incomplete)
- Fix 3: Cookie config in auth.config.ts (correct but insufficient)
- Fix 4: JWT strategy (correct diagnosis, incomplete solution)
- Fix 5: JWT callbacks (attempts to bridge the gap)

**Why This Happened:**
- NextAuth v5 architecture is complex with multiple configuration files
- Edge runtime limitations not immediately obvious
- Database adapter + edge middleware combination is non-trivial
- Each fix appeared logical based on symptoms but didn't address root architecture mismatch

### 2. **Insufficient Documentation Review**
**What We Should Have Done First:**
- Read NextAuth v5 docs on "Database Sessions with Edge Runtime"
- Check if this combination is even officially supported
- Look for example implementations of Turso adapter + edge middleware

**Why We Didn't:**
- Pressure to fix quickly led to reactive debugging
- Assumed common pattern would "just work"
- Log analysis seemed to point to specific issues rather than architectural problems

### 3. **Lack of Local Reproduction**
**Critical Gap:**
- All debugging done against production logs
- No local testing between attempts
- Couldn't inspect actual token contents
- Couldn't step through middleware execution

**Impact:**
- Slower feedback loop (deploy → wait → test → analyze logs → repeat)
- Less visibility into actual values and execution flow
- Multiple deployments frustrating for user and risky for production

### 4. **Misunderstanding Token Flow in Hybrid Strategy**
**Key Confusion:**
When you set `session.strategy = "database"` in auth.ts:
- NextAuth creates a **session record in database** with a **UUID as the session token**
- The cookie stores this UUID
- Server-side routes look up the UUID in the database

When you set `session.strategy = "jwt"` in auth.config.ts (middleware):
- Middleware expects the cookie to contain a **JWT (encoded JSON)**
- JWT can be decoded without database access
- Contains user data directly

**The Problem:**
- We're sending UUID tokens (from database strategy) to middleware expecting JWTs
- Adding JWT callbacks might not help if the session token itself is still a UUID

**What We Missed:**
The JWT callbacks might only fire when `session.strategy = "jwt"` in the same config file. With database strategy, the session token might still be a UUID that middleware can't decode.

---

## Debug Strategy Analysis

### What Worked Well

1. **Log Analysis**
   - Production logs clearly showed the redirect loop pattern
   - Timestamp correlation between session creation and middleware rejection
   - `[auth][details]: {}` was a strong signal

2. **Incremental Testing**
   - Each fix was deployed and tested before next attempt
   - Gathered user feedback after each deployment

3. **Code Reading**
   - Checked actual auth.ts and auth.config.ts contents
   - Verified environment variable presence
   - Reviewed Vercel deployment status

### What Could Have Been Better

1. **Architecture Review First**
   - Should have mapped out the complete session flow before any fixes
   - Should have questioned if database + edge middleware is supported
   - Should have checked NextAuth v5 documentation for this exact pattern

2. **Local Testing Setup**
   - Should have set up local environment with production variables
   - Could have used `console.log` to inspect token contents
   - Could have tested middleware behavior locally

3. **Hypothesis Documentation**
   - Each fix was based on an implicit hypothesis
   - Should have written out: "I believe X is happening because Y, so changing Z should fix it"
   - Would have made it easier to spot flawed assumptions

4. **Alternative Approaches Consideration**
   - Jumped to fixes without considering if we're solving the right problem
   - Should have listed multiple approaches and evaluated trade-offs

---

## Potential Issues Still Not Addressed

### Issue 1: JWT Callbacks May Not Fire with Database Strategy

**The Problem:**
Looking at NextAuth v5 docs, JWT callbacks typically fire when:
- `session.strategy = "jwt"` is set
- Tokens need to be updated or read

With `session.strategy = "database"` in auth.ts, the JWT callback might:
- Never fire during initial signin
- Not create a JWT at all
- Still create UUID session tokens

**How to Verify:**
Check NextAuth v5 source or docs: Can you use database sessions AND JWT callbacks together?

**If This Is The Issue:**
The hybrid approach won't work. We need to choose one:
- Full JWT sessions (lose database persistence benefits)
- Full database sessions (can't use edge middleware)
- Different middleware approach (Server Components instead)

### Issue 2: Middleware and Main App Using Different Session Strategies

**The Configuration:**
- `auth.ts`: `session.strategy = "database"`
- `auth.config.ts`: `session.strategy = "jwt"`

**Potential Problem:**
These might be fundamentally incompatible. The middleware and main app might be treating the same cookie value differently:
- Main app: "This is a UUID, look it up in database"
- Middleware: "This is a JWT, decode it"
- Reality: "It's a UUID, middleware can't decode it"

**Expected Behavior:**
When middleware tries to decode a UUID as a JWT, it should fail. But maybe it's failing silently and just returning empty auth object.

### Issue 3: Cookie Domain/Path Mismatch

**What We Configured:**
```typescript
path: '/'
secure: true (in production)
sameSite: 'lax'
```

**What We Didn't Configure:**
- `domain` - Could be an issue with www vs non-www
- Cookie is set on OAuth callback (might be different domain)

**How to Verify:**
Check browser DevTools:
1. After OAuth callback, inspect cookies
2. Verify `__Secure-next-auth.session-token` exists
3. Check its domain, path, and value
4. Verify it's sent on subsequent requests to `/app/profile`

### Issue 4: Adapter Implementation Issues

**Using Custom Turso Adapter:**
File: `src/lib/turso-adapter.ts`

**Potential Issues:**
- Adapter might not be implementing all required methods
- Session creation might succeed but session retrieval might fail
- Adapter might not be compatible with JWT callbacks

**We Didn't Check:**
- Whether TursoAdapter properly implements the NextAuth Adapter interface
- Whether it handles JWT callback scenarios
- Whether it's tested with edge middleware

### Issue 5: Multiple Session Token Cookies

**Possibility:**
There might be two cookies:
1. Database session token (UUID)
2. JWT token for middleware

**We Haven't Verified:**
- How many session-related cookies are actually set
- Which cookie middleware is reading
- If there's a conflict between multiple cookies

### Issue 6: Middleware Matcher Configuration

**What We Didn't Check:**
Does middleware.ts have a matcher? Is it actually running on `/app/*` routes?

**Default Behavior:**
NextAuth middleware runs on all routes unless configured otherwise

**Could Be:**
- Middleware not running at all (no protection)
- Middleware running but not on the routes we think
- Middleware running too broadly and interfering

---

## What to Check If This Deployment Fails

### Immediate Checks (User Can Do in Browser)

1. **Clear All Cookies and Try Again**
   - Open DevTools → Application → Cookies
   - Delete all cookies for becomingdiamond.com
   - Try OAuth flow fresh
   - **Why:** Stale cookies from previous attempts might interfere

2. **Inspect Cookies After OAuth Callback**
   - Complete OAuth flow
   - Before clicking anything, open DevTools → Application → Cookies
   - Look for cookies matching `*next-auth*` or `*session*`
   - Document: name, value (first 20 chars), domain, path, secure, sameSite
   - **What to Look For:**
     - Is cookie being set?
     - Is value a UUID or a long JWT string?
     - Is domain correct?

3. **Check Network Tab During Redirect Loop**
   - DevTools → Network tab
   - Complete OAuth flow
   - Watch the redirect chain
   - Document each request:
     - URL
     - Status code
     - Request headers (especially Cookie header)
     - Response headers (especially Set-Cookie)
   - **What to Look For:**
     - Is cookie being sent with requests to `/app/profile`?
     - Is server setting new cookies on each redirect?

4. **Check Console for Errors**
   - Any client-side errors?
   - Any warnings about cookies?

### Backend Checks (Production Logs)

5. **JWT Callback Execution**
   - Search logs for "jwt" or any custom logging we could add
   - **Critical:** Did the JWT callback actually fire during signin?
   - If not visible, we need to add logging to the callback

6. **Session Callback Execution**
   - Search for session callback logs
   - Check if it's going through `user` branch or `token` branch
   - **Expected:** Should go through `user` branch for database session, `token` branch for middleware

7. **Middleware Auth Object**
   - Look for `[auth][details]` in logs
   - Is it still `{}`?
   - Or does it now have user data?

8. **Token Format in Database**
   - Query Turso database: `SELECT * FROM sessions ORDER BY expires DESC LIMIT 1`
   - Check the `sessionToken` column
   - Is it a UUID or a JWT?
   - **Expected:** Should still be UUID with database strategy

### Code Review Checks

9. **Review middleware.ts**
   ```bash
   cat middleware.ts
   ```
   - Does it have a matcher?
   - Is it actually using authConfig?
   - Any custom logic that might interfere?

10. **Review TursoAdapter Implementation**
    ```bash
    cat src/lib/turso-adapter.ts | head -100
    ```
    - Does it implement all required methods?
    - Any obvious issues?
    - Check `getSession` method specifically

11. **Verify Environment Variables**
    - Check `/api/auth/debug` endpoint
    - Verify all auth variables are set
    - Check for any typos or missing values

### Alternative Diagnostic Approach

12. **Test Without Middleware**
    - Temporarily rename `middleware.ts` to `middleware.ts.bak`
    - Deploy
    - Try OAuth flow
    - **If This Works:** Confirms middleware is the issue
    - **If This Fails:** Issue is in main auth config, not middleware

13. **Test With Pure JWT Sessions**
    - Change auth.ts to `session.strategy = "jwt"`
    - Remove database session creation
    - Deploy
    - Try OAuth flow
    - **If This Works:** Confirms database sessions are incompatible with our setup
    - **If This Fails:** Different root cause

---

## Recommended Next Steps If Deployment #5 Fails

### Option 1: Abandon Database Sessions (Simplest)
**Change:**
```typescript
// auth.ts
session: {
  strategy: "jwt",
  maxAge: 30 * 24 * 60 * 60, // 30 days
}

// Remove TursoAdapter, use default
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  session: { strategy: "jwt" },
  callbacks: { /* existing jwt and session callbacks */ }
});
```

**Pros:**
- Guaranteed to work with edge middleware
- Simpler architecture
- Fewer moving parts

**Cons:**
- Lose database session persistence
- Can't easily invalidate sessions server-side
- Session data only in JWT (size limits)

**Effort:** 30 minutes

### Option 2: Abandon Edge Middleware (Most Robust)
**Change:**
- Remove `middleware.ts`
- Handle auth in Server Components and Route Handlers
- Use `auth()` from auth.ts to check authentication
- Client-side redirects for unauthenticated users

**Example:**
```typescript
// app/app/layout.tsx
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function AppLayout({ children }) {
  const session = await auth();

  if (!session) {
    redirect('/auth/signin');
  }

  return <div>{children}</div>;
}
```

**Pros:**
- Database sessions work perfectly
- No edge runtime limitations
- More control over auth logic
- Can use Turso adapter fully

**Cons:**
- Server Components required for protection
- Client-side navigation might briefly show protected content
- Need to handle auth in each route group

**Effort:** 1-2 hours

### Option 3: Deep Dive NextAuth v5 + Database + Edge
**Approach:**
- Read NextAuth v5 source code
- Find official example of database adapter + edge middleware
- Understand the exact mechanism for JWT callbacks with database sessions
- Implement based on reference implementation

**Pros:**
- Might find the "correct" way to do this
- Learn the architecture deeply
- Future-proof solution

**Cons:**
- Time-consuming
- Might discover it's not officially supported
- Could lead to more complex code

**Effort:** 3-4 hours

### Option 4: Hybrid Auth Check (Pragmatic)
**Approach:**
- Keep database sessions for main app
- Use API route for middleware auth check
- Middleware calls `/api/auth/validate` which uses database session
- Cache validation result

**Example:**
```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('session-token');

  // Call API route that can access database
  const res = await fetch(`${request.nextUrl.origin}/api/auth/validate`, {
    headers: { 'x-session-token': sessionToken?.value || '' }
  });

  if (!res.ok) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  return NextResponse.next();
}
```

**Pros:**
- Keeps database sessions
- Works around edge limitations
- Flexible for future changes

**Cons:**
- Extra API call on every protected route
- More complex
- Potential performance impact (needs caching)

**Effort:** 2-3 hours

---

## Critical Questions to Answer

Before proceeding with any more fixes, we need to answer:

1. **Does NextAuth v5 officially support database sessions with edge middleware?**
   - Check docs, GitHub issues, Discord
   - If no: Pick Option 1 or 2
   - If yes: Find reference implementation

2. **Can JWT callbacks fire with database session strategy?**
   - Test locally with logging
   - Check NextAuth v5 source code
   - If no: Current fix won't work

3. **What is the actual value in the session cookie?**
   - UUID → Database session, middleware can't decode
   - Long string (JWT) → JWT session, should work
   - This tells us if the hybrid approach is even working

4. **Is middleware actually running?**
   - Add logging to middleware
   - Check if it's executing on `/app/*` routes
   - Verify matcher configuration

5. **What does the official NextAuth team recommend for this setup?**
   - Check their Discord or GitHub discussions
   - Search for: "database sessions edge middleware"
   - See what they say about Turso or similar adapters

---

## Lessons Learned

1. **Start with Architecture Review**
   - Complex integrations need complete understanding first
   - Don't jump to fixes based on error messages alone
   - Map out the complete data flow

2. **Test Locally First**
   - Production debugging is slow and risky
   - Local reproduction gives faster feedback
   - Can inspect actual values and step through code

3. **Document Hypotheses**
   - Write down what you think is happening
   - Write down what you expect the fix to do
   - Makes it easier to spot flawed assumptions

4. **Consider Simpler Alternatives**
   - Sometimes the "correct" solution is removing complexity
   - JWT sessions might be fine for this use case
   - Server Component auth might be better than middleware

5. **Check Official Docs and Examples**
   - Don't assume common patterns work
   - Look for reference implementations
   - Read about edge cases and limitations

6. **Know When to Pivot**
   - After 3-4 failed attempts, step back
   - Might be solving the wrong problem
   - Consider fundamentally different approaches

---

## Immediate Action Plan

**If deployment #5 succeeds:**
- Document the solution
- Add comments explaining the hybrid strategy
- Test thoroughly (magic link, Google OAuth, GitHub OAuth)
- Monitor logs for any errors

**If deployment #5 fails:**
1. Complete all checks in "What to Check" section
2. Answer the critical questions
3. Present Options 1-4 to user with trade-offs
4. Get user decision on which path to take
5. Implement chosen solution with local testing first

**Time Budget:**
- If not working after deployment #5: Maximum 1 more hour of investigation
- Then must pivot to Option 1 (JWT) or Option 2 (no middleware)
- Goal is working auth, not perfect architecture
