# NextAuth.js Authentication Setup Guide

This guide will help you configure and test the NextAuth.js authentication system for the Becoming Diamond member portal.

## Quick Start Checklist

- [ ] Generate `AUTH_SECRET`
- [ ] Configure Turso database credentials
- [ ] Run database migrations
- [ ] Set up Resend email provider
- [ ] Create Google OAuth app
- [ ] Create GitHub OAuth app (separate from CMS)
- [ ] Test authentication flows
- [ ] Configure production environment

---

## 1. Generate AUTH_SECRET

Open your terminal and run:

```bash
openssl rand -base64 32
```

Copy the output and add it to your `.env.local`:

```bash
AUTH_SECRET=<paste-the-generated-secret-here>
AUTH_URL=http://localhost:3003
```

**For production**, set `AUTH_URL` to your domain:
```bash
AUTH_URL=https://becomingdiamond.com
```

---

## 2. Configure Turso Database

If you haven't already set up Turso credentials, add them to `.env.local`:

```bash
DATABASE_URL=libsql://your-database-name.turso.io
DATABASE_AUTH_TOKEN=your-turso-auth-token
```

**To get your Turso credentials:**

1. Install Turso CLI:
   ```bash
   brew install tursodatabase/tap/turso  # macOS
   # Or visit: https://docs.turso.tech/cli/installation
   ```

2. Login and create database (if needed):
   ```bash
   turso auth login
   turso db create becoming-diamond
   turso db show becoming-diamond
   ```

3. Get credentials:
   ```bash
   turso db show becoming-diamond --url     # DATABASE_URL
   turso db tokens create becoming-diamond  # DATABASE_AUTH_TOKEN
   ```

---

## 3. Run Database Migrations

Once your Turso credentials are configured:

```bash
npm run db:migrate
```

**Expected output:**
```
🔄 Starting database migrations...

Found 1 migration file(s):

📄 Running migration: 001_create_auth_tables.sql
   ✓ Executed 6 statement(s)

✅ All migrations completed successfully!
```

**Verify tables were created:**

```bash
turso db shell becoming-diamond
```

Then run:
```sql
.tables
-- Should show: users, accounts, sessions, verification_tokens, user_profiles

.schema users
-- Should show the users table structure
```

---

## 4. Set Up Resend (Email Provider)

### Create Resend Account

1. Go to https://resend.com
2. Sign up for a free account (3,000 emails/month free tier)
3. Verify your email address

### Configure Your Domain

1. Go to **Domains** in Resend dashboard
2. Click **Add Domain**
3. Enter your domain: `becomingdiamond.com`
4. Add the DNS records Resend provides to your domain registrar:
   - **SPF record** (TXT)
   - **DKIM records** (TXT)
   - **DMARC record** (TXT, optional but recommended)

**Example DNS records:**
```
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all

Type: TXT
Name: resend._domainkey
Value: (Resend will provide this long string)

Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@becomingdiamond.com
```

### Generate API Key

1. Go to **API Keys** in Resend
2. Click **Create API Key**
3. Name: "Becoming Diamond Auth"
4. Copy the API key (starts with `re_`)
5. Add to `.env.local`:

```bash
AUTH_RESEND_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Test Email Sending (Optional)

While domain verification is pending, you can test with your own email:

```bash
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer re_xxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "onboarding@resend.dev",
    "to": "your-email@example.com",
    "subject": "Test Email",
    "html": "<p>Test from Resend</p>"
  }'
```

---

## 5. Set Up Google OAuth

### Create Google Cloud Project

1. Go to https://console.cloud.google.com
2. Click **Select a project** → **New Project**
3. Project name: "Becoming Diamond Auth"
4. Click **Create**

### Enable Google+ API

1. Go to **APIs & Services** → **Library**
2. Search for "Google+ API"
3. Click **Enable**

### Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. If prompted, configure the OAuth consent screen:
   - **User Type**: External
   - **App name**: Becoming Diamond
   - **User support email**: your-email@example.com
   - **Developer contact**: your-email@example.com
   - **Scopes**: Add `email`, `profile`, `openid`
   - Save and continue

4. **Create OAuth Client ID**:
   - **Application type**: Web application
   - **Name**: "Becoming Diamond Member Portal"
   - **Authorized JavaScript origins**:
     - `http://localhost:3003` (development)
     - `https://becomingdiamond.com` (production)
   - **Authorized redirect URIs**:
     - `http://localhost:3003/api/auth/callback/google`
     - `https://becomingdiamond.com/api/auth/callback/google`
   - Click **Create**

5. Copy the **Client ID** and **Client Secret**
6. Add to `.env.local`:

```bash
AUTH_GOOGLE_ID=1234567890-abcdefghijklmnop.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxx
```

---

## 6. Set Up GitHub OAuth (NEW App)

**IMPORTANT:** This is a **separate** OAuth app from your Decap CMS GitHub OAuth. Do NOT reuse the existing credentials.

### Create New OAuth App

1. Go to https://github.com/settings/developers
2. Click **OAuth Apps** → **New OAuth App**
3. **Application name**: "Becoming Diamond Member Portal"
4. **Homepage URL**: `https://becomingdiamond.com`
5. **Application description**: "Authentication for Becoming Diamond member portal"
6. **Authorization callback URL**:
   - Development: `http://localhost:3003/api/auth/callback/github`
   - Production: `https://becomingdiamond.com/api/auth/callback/github`

   *Note: You can only add one callback URL. Use development for now, update for production later.*

7. Click **Register application**
8. Copy the **Client ID**
9. Click **Generate a new client secret** and copy it
10. Add to `.env.local`:

```bash
# GitHub OAuth (Member Portal - NEW)
AUTH_GITHUB_ID=Iv1.xxxxxxxxxxxxxxxxxx
AUTH_GITHUB_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Keep your existing Decap CMS credentials separate:
GITHUB_CLIENT_ID=your-existing-cms-client-id
GITHUB_CLIENT_SECRET=your-existing-cms-client-secret
```

---

## 7. Complete .env.local Example

Your `.env.local` should now look like this:

```bash
# NextAuth.js Authentication
AUTH_SECRET=<your-generated-secret>
AUTH_URL=http://localhost:3003

# Email Provider (Resend)
AUTH_RESEND_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Google OAuth
AUTH_GOOGLE_ID=1234567890-abcdefg.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=GOCSPX-xxxxxxxxxxxxxxx

# GitHub OAuth (Member Portal - NEW)
AUTH_GITHUB_ID=Iv1.xxxxxxxxxxxxxxxx
AUTH_GITHUB_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# GitHub OAuth (Decap CMS - EXISTING)
GITHUB_CLIENT_ID=your-existing-cms-client-id
GITHUB_CLIENT_SECRET=your-existing-cms-client-secret

# Turso Database
DATABASE_URL=libsql://your-database.turso.io
DATABASE_AUTH_TOKEN=your-turso-token

# Anthropic API (Existing)
ANTHROPIC_API_KEY=sk-ant-xxxx

# Stripe (Existing)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxx
STRIPE_SECRET_KEY=sk_test_xxxx
```

---

## 8. Testing Authentication

### Start Development Server

```bash
npm run dev
```

Server should start on http://localhost:3003

### Test Flow 1: Email Magic Link

1. Navigate to http://localhost:3003/app
2. You should be redirected to http://localhost:3003/auth/signin
3. Enter your email address
4. Click **Continue with Email**
5. Check your email for the magic link
6. Click the link in the email
7. You should be redirected to http://localhost:3003/app (dashboard)
8. Verify your avatar and email appear in the sidebar

**Expected behavior:**
- Email sent confirmation page appears
- Magic link email arrives within 30 seconds
- Link is valid for 24 hours
- After clicking link, you're authenticated and redirected to member portal

### Test Flow 2: Google OAuth

1. Go to http://localhost:3003/auth/signin
2. Click **Sign in with Google**
3. Google consent screen appears
4. Select your Google account
5. Approve permissions (email, profile)
6. Redirected back to http://localhost:3003/app
7. Verify your Google name and avatar appear in the sidebar

**Expected behavior:**
- OAuth popup opens (or redirect)
- After approval, automatic redirect to member portal
- User profile synced with Google data

### Test Flow 3: GitHub OAuth

1. Go to http://localhost:3003/auth/signin
2. Click **Sign in with GitHub**
3. GitHub authorization page appears
4. Click **Authorize [App Name]**
5. Redirected back to http://localhost:3003/app
6. Verify your GitHub username and avatar appear in the sidebar

**Expected behavior:**
- OAuth redirect to GitHub
- After authorization, return to member portal
- User profile synced with GitHub data

### Test Flow 4: Sign Out

1. While signed in, click **Sign Out** in the sidebar
2. You should be redirected to http://localhost:3003 (home page)
3. Try accessing http://localhost:3003/app again
4. You should be redirected to the sign-in page

**Expected behavior:**
- Session cleared from database
- Cookies cleared
- All `/app/*` routes protected

### Test Flow 5: Session Persistence

1. Sign in with any method
2. Reload the page (Ctrl+R or Cmd+R)
3. You should remain signed in
4. Close the browser and reopen
5. Navigate to http://localhost:3003/app
6. You should still be signed in (session persists for 30 days)

**Expected behavior:**
- Session persists across page reloads
- Session persists across browser restarts
- Session automatically refreshes every 24 hours of activity

---

## 9. Troubleshooting

### Email Not Sending

**Problem:** Magic link email doesn't arrive

**Solutions:**
1. Check Resend API key is correct in `.env.local`
2. Verify domain is verified in Resend (or use `onboarding@resend.dev` for testing)
3. Check spam folder
4. View Resend logs: https://resend.com/emails
5. Check server console for errors:
   ```bash
   [Auth] Error sending email: ...
   ```

### OAuth Errors

**Problem:** "OAuth error: invalid_client"

**Solutions:**
1. Verify Client ID and Client Secret are correct
2. Check callback URL matches exactly:
   - Development: `http://localhost:3003/api/auth/callback/{provider}`
   - No trailing slash
3. For Google: Ensure OAuth consent screen is configured
4. For GitHub: Ensure app is not suspended

**Problem:** "Redirect URI mismatch"

**Solutions:**
1. Check OAuth app settings
2. Ensure redirect URI includes the provider name:
   - ✅ `http://localhost:3003/api/auth/callback/google`
   - ❌ `http://localhost:3003/api/auth/callback`
3. Update redirect URIs in OAuth app settings

### Database Errors

**Problem:** "DATABASE_URL is not set"

**Solutions:**
1. Ensure `.env.local` exists in project root
2. Restart dev server after adding variables
3. Check for typos in variable names

**Problem:** "table users already exists"

**Solutions:**
- Tables already created, no action needed
- If you want to recreate tables, drop them first:
  ```sql
  DROP TABLE IF EXISTS user_profiles;
  DROP TABLE IF EXISTS verification_tokens;
  DROP TABLE IF EXISTS sessions;
  DROP TABLE IF EXISTS accounts;
  DROP TABLE IF EXISTS users;
  ```
  Then run `npm run db:migrate` again

### Middleware/Route Protection Issues

**Problem:** Still can access `/app/*` without authentication

**Solutions:**
1. Check `middleware.ts` exists in project root
2. Restart dev server
3. Clear browser cookies: DevTools → Application → Cookies → Clear
4. Check browser console for middleware errors

**Problem:** Infinite redirect loop

**Solutions:**
1. Check `AUTH_URL` matches your dev server URL
2. Clear all cookies and try again
3. Check middleware matcher pattern doesn't exclude `/auth/*`

---

## 10. Production Deployment

### Update Environment Variables

On Vercel (or your hosting platform):

1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add all `AUTH_*` variables from `.env.local`
4. **Update** `AUTH_URL`:
   ```bash
   AUTH_URL=https://becomingdiamond.com
   ```

### Update OAuth Redirect URIs

**Google:**
1. Go to Google Cloud Console → Credentials
2. Edit your OAuth client
3. Add production redirect URI:
   ```
   https://becomingdiamond.com/api/auth/callback/google
   ```

**GitHub:**
1. Go to GitHub OAuth app settings
2. Update **Authorization callback URL**:
   ```
   https://becomingdiamond.com/api/auth/callback/github
   ```

   *Note: GitHub only allows one callback URL. You may need to create a separate app for production.*

### Run Migrations on Production Database

```bash
# Set production database credentials temporarily
export DATABASE_URL=libsql://production-db.turso.io
export DATABASE_AUTH_TOKEN=production-token

# Run migrations
npm run db:migrate
```

### Test Production

1. Deploy to production
2. Test all authentication flows:
   - Email magic link
   - Google OAuth
   - GitHub OAuth
   - Sign out
   - Route protection

### Verify Decap CMS Still Works

**IMPORTANT:** Ensure the existing CMS authentication is unaffected:

1. Navigate to `https://becomingdiamond.com/admin`
2. CMS should load
3. Click "Login with GitHub"
4. OAuth should work with the **original** GitHub app
5. Test editing and saving content

---

## 11. Security Checklist

- [ ] `AUTH_SECRET` is a strong random string (32+ bytes)
- [ ] All OAuth secrets are kept secure (not committed to git)
- [ ] Resend domain is verified with SPF/DKIM
- [ ] Production `AUTH_URL` uses HTTPS
- [ ] OAuth redirect URIs use HTTPS in production
- [ ] Database credentials are secure
- [ ] `.env.local` is in `.gitignore`
- [ ] Test all authentication flows in production
- [ ] Monitor Resend usage for abuse
- [ ] Set up error monitoring (Sentry, etc.)

---

## 12. Monitoring & Maintenance

### View Sessions

Query active sessions in Turso:

```sql
SELECT
  s.id,
  s.session_token,
  s.user_id,
  datetime(s.expires, 'unixepoch') as expires,
  u.email,
  u.name
FROM sessions s
JOIN users u ON s.user_id = u.id
ORDER BY s.expires DESC;
```

### View Users

```sql
SELECT
  id,
  name,
  email,
  datetime(email_verified, 'unixepoch') as email_verified,
  datetime(created_at, 'unixepoch') as created_at
FROM users
ORDER BY created_at DESC;
```

### Monitor Email Delivery

1. Go to https://resend.com/emails
2. View sent emails, delivery status, and errors
3. Set up webhook for delivery notifications (optional)

### Clean Up Expired Sessions

Run periodically (or set up a cron job):

```sql
DELETE FROM sessions
WHERE expires < unixepoch();
```

### Clean Up Expired Verification Tokens

```sql
DELETE FROM verification_tokens
WHERE expires < unixepoch();
```

---

## Support

If you encounter issues:

1. Check server logs: `npm run dev` output
2. Check browser console: DevTools → Console
3. Check Resend logs: https://resend.com/emails
4. Check Turso database: `turso db shell becoming-diamond`
5. Review NextAuth.js docs: https://authjs.dev

---

## Architecture Reference

**Authentication Flow:**
```
User → /app → Middleware → Session Check
                              ↓
                         Not Authenticated
                              ↓
                    Redirect → /auth/signin
                              ↓
                    Choose Auth Method
                              ↓
         ┌────────────────────┼────────────────────┐
         ↓                    ↓                     ↓
    Email Magic Link    Google OAuth         GitHub OAuth
         ↓                    ↓                     ↓
    Resend Email        Google Consent       GitHub Auth
         ↓                    ↓                     ↓
    Click Link          Approve                Authorize
         ↓                    ↓                     ↓
         └────────────────────┼─────────────────────┘
                              ↓
                    Create User (if new)
                              ↓
                      Create Session
                              ↓
                    Redirect → /app
                              ↓
                        User Signed In
```

**File Structure:**
```
/
├── auth.ts                    # Main NextAuth config
├── auth.config.ts             # Edge middleware config
├── middleware.ts              # Route protection
├── migrations/
│   └── 001_create_auth_tables.sql
├── scripts/
│   └── migrate-db.ts
├── src/
│   ├── app/
│   │   ├── api/auth/[...nextauth]/route.ts
│   │   ├── auth/
│   │   │   ├── signin/page.tsx
│   │   │   ├── error/page.tsx
│   │   │   └── verify-request/page.tsx
│   │   ├── layout.tsx         # Root layout with SessionProvider
│   │   ├── providers.tsx      # SessionProvider wrapper
│   │   └── app/
│   │       └── layout.tsx     # Member portal with session UI
│   ├── components/auth/
│   │   ├── SignOutButton.tsx
│   │   └── UserAvatar.tsx
│   ├── contexts/
│   │   └── UserContext.tsx    # Syncs with NextAuth
│   └── lib/
│       └── turso-adapter.ts   # Custom Turso adapter
└── types/
    └── next-auth.d.ts         # TypeScript types
```

---

**🎉 You're all set! Happy authenticating!**
