# Magic Link Double-Request Issue (Apple Mail)

## Issue Summary

When signing in with magic link (email) using an iCloud email address (`@icloud.com`), users may see a "Verification" error after successful authentication.

## Root Cause

**Apple Mail Privacy Protection** automatically prefetches links in emails to:
1. Check for malicious content
2. Load rich previews
3. Protect user privacy

This causes the magic link callback URL to be accessed **twice**:
1. **First request** (Apple Mail prefetch): Consumes the one-time verification token → User created, session established ✓
2. **Second request** (User clicks link): Token already used → Verification error ✗

## Evidence from Logs

```
[Turso Adapter] getUserByEmail called: rickhallett@icloud.com
[Turso Adapter] getUserByEmail result: Not found
...
[Turso Adapter] createUser success: { id: '9a0389b6...', email: 'rickhallett@icloud.com' }
[Auth] Created profile for user 9a0389b6...
GET /api/auth/callback/nodemailer?...&token=c6c72cc4... 302 in 845ms    ← SUCCESS
GET /app/profile 200 in 54ms                                             ← User logged in
...
[auth][error] Verification: Read more at https://errors.authjs.dev#verification  ← Error appears
GET /api/auth/callback/nodemailer?...&token=c6c72cc4... 302 in 284ms    ← SECOND REQUEST (token already used)
GET /auth/error?error=Verification 200 in 58ms                           ← Shows error page
```

## Solutions Implemented

### 1. Enhanced Token Logging (`turso-adapter.ts`)
Added detailed logging to track token verification lifecycle:
```typescript
async useVerificationToken({ identifier, token }) {
  console.log('[Turso Adapter] useVerificationToken called:', { identifier, token: token.substring(0, 8) + '...' });

  if (!result.rows[0]) {
    console.log('[Turso Adapter] useVerificationToken: Token not found (already used or expired)');
    return null;
  }

  // Check expiration
  if (expires < new Date()) {
    console.log('[Turso Adapter] useVerificationToken: Token expired');
    return null;
  }

  console.log('[Turso Adapter] useVerificationToken: Token consumed successfully');
  return { identifier, token, expires };
}
```

### 2. Smart Error Page Redirect (`auth/error/page.tsx`)
Error page now checks if user is already authenticated:
- If **Verification error** + **user authenticated** → Auto-redirect to `/app/profile`
- Otherwise → Show appropriate error message

```typescript
useEffect(() => {
  if (status === "loading") return;

  if (error === "Verification" && status === "authenticated") {
    console.log('[Error Page] User already authenticated, redirecting to app');
    router.push("/app/profile");
    return;
  }

  setIsChecking(false);
}, [error, status, router]);
```

### 3. Improved Error Message
Changed from:
> "The verification link has expired. Please request a new one."

To:
> "This magic link has already been used or has expired. If you just signed in successfully, you can close this page and access your account. Otherwise, please request a new sign-in link."

### 4. Sign-In Callback Logging (`auth.ts`)
Added logging to track authentication attempts:
```typescript
async signIn({ user, account, profile, email }) {
  console.log('[Auth] signIn callback:', {
    provider: account?.provider,
    email: email?.verificationRequest ? 'magic-link' : user.email,
    userId: user.id,
  });
  return true;
}
```

## User Experience

### Before Fix:
1. User requests magic link
2. Email arrives in Apple Mail
3. Apple Mail prefetches link (consumes token, creates account)
4. User clicks link
5. **Error page shown** (confusing - account was created!)

### After Fix:
1. User requests magic link
2. Email arrives in Apple Mail
3. Apple Mail prefetches link (consumes token, creates account)
4. User clicks link
5. Error page detects authentication → **Auto-redirects to profile** (seamless!)

## Alternative Solutions Considered

### Option A: Landing Page with Button
Add an intermediate page that requires explicit user interaction before consuming token.

**Pros**: Prevents prefetch from consuming token
**Cons**: Extra click, worse UX, longer flow

### Option B: Rate Limiting by IP
Track IP addresses and prevent multiple token uses from same IP.

**Pros**: Could reduce duplicate attempts
**Cons**: Doesn't solve prefetch issue, could block legitimate users (NAT, shared networks)

### Option C: Longer Token Expiration
Increase token validity period to allow multiple uses within timeframe.

**Pros**: Simple config change
**Cons**: Security risk (one-time use is a feature), doesn't solve the UX issue

## Why Current Solution is Best

1. **No extra clicks**: User experience unchanged for legitimate users
2. **Graceful degradation**: If prefetch happens, user still gets logged in
3. **Security maintained**: Token still one-time-use, no compromise
4. **Transparent**: Detailed logging helps debug future issues
5. **Idempotent behavior**: Multiple requests handled gracefully

## Testing Verification

Run the auth flow test suite:
```bash
npx tsx scripts/test-auth-flow.ts
```

All 9 tests should pass:
- ✓ Database Connection
- ✓ User Creation (email-derived name)
- ✓ User Lookup by Email
- ✓ Profile Creation
- ✓ Profile Retrieval (defaults)
- ✓ Profile Update (persistence)
- ✓ Repeated Sign-In (profile persistence)
- ✓ Duplicate Email Prevention
- ✓ NULL Value Handling

## Related Issues

- [NextAuth.js: Email provider token consumed by email client](https://github.com/nextauthjs/next-auth/discussions/4896)
- [Apple Mail Privacy Protection affecting magic links](https://github.com/nextauthjs/next-auth/issues/4026)

## Future Improvements

1. Consider adding session check in NextAuth adapter's `useVerificationToken`
2. Implement retry logic with backoff for transient failures
3. Add metrics tracking for verification error rates
4. Create user-facing documentation about Apple Mail behavior
