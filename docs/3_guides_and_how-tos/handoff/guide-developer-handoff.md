# Developer Handoff Guide - Client Account Migration

Complete guide for migrating all third-party integrations from developer accounts to client-owned accounts.

**Purpose**: Transfer ownership of all external services (GitHub OAuth, Google OAuth, Stripe, Gmail, Turso, Bunny Stream, Anthropic) from your developer accounts to the client's accounts.

**Estimated Time**: 3-4 hours

---

## Table of Contents

1. [Overview & Prerequisites](#overview--prerequisites)
2. [Google OAuth Setup (NextAuth)](#1-google-oauth-setup-nextauth)
3. [GitHub OAuth Setup (NextAuth)](#2-github-oauth-setup-nextauth)
4. [GitHub OAuth Setup (Decap CMS)](#3-github-oauth-setup-decap-cms)
5. [Stripe Integration](#4-stripe-integration)
6. [Gmail SMTP Setup](#5-gmail-smtp-setup)
7. [Turso Database](#6-turso-database)
8. [Bunny Stream Video Hosting](#7-bunny-stream-video-hosting)
9. [Anthropic API (Optional)](#8-anthropic-api-optional)
10. [Vercel Deployment](#9-vercel-deployment)
11. [Testing Checklist](#10-testing-checklist)
12. [Rollback Procedures](#11-rollback-procedures)

---

## Overview & Prerequisites

### What Needs to be Migrated

| Service | Purpose | Current Owner | New Owner |
|---------|---------|---------------|-----------|
| Google OAuth | Member authentication | Your account | Client's Google account |
| GitHub OAuth (Auth) | Member authentication | Your GitHub | Client's GitHub |
| GitHub OAuth (CMS) | Decap CMS content editing | Your GitHub | Client's GitHub |
| Stripe | Payment processing | Your Stripe | Client's Stripe |
| Gmail SMTP | Transactional emails | Your Gmail | Client's Gmail |
| Turso Database | User data storage | Your Turso account | Client's Turso account |
| Bunny Stream | Video hosting | Your Bunny account | Client's Bunny account |
| Anthropic API | AI features | Your API key | Client's API key |

### Prerequisites

**You need:**
- Access to all current developer accounts
- SSH access to production deployment (Vercel)
- Backup of current environment variables
- Testing environment ready

**Client needs to provide:**
- Google Cloud Console access (or credentials)
- GitHub account with repo access
- Stripe account credentials (from client setup guide)
- Gmail account with SMTP enabled
- Turso account created
- Bunny Stream account created
- Anthropic account (optional)

### Before You Begin

1. **Backup current configuration:**
   ```bash
   # Create backup of environment files
   cp .env.local .env.local.backup
   cp .env.production .env.production.backup

   # Export current Vercel environment variables
   vercel env pull .env.vercel.backup
   ```

2. **Document current values:**
   Create a spreadsheet with all current credentials for rollback purposes.

3. **Set up testing environment:**
   Ensure you have a staging environment for testing before production deployment.

---

## 1. Google OAuth Setup (NextAuth)

**Purpose**: Allow users to sign in with "Sign in with Google"

### Step 1: Access Client's Google Cloud Console

Have the client:
1. Go to https://console.cloud.google.com
2. Create a new project (or use existing):
   - Project name: "Becoming Diamond Production"
   - Project ID: will be auto-generated

### Step 2: Enable Required APIs

1. In Google Cloud Console, navigate to **APIs & Services** → **Library**

2. Search and enable:
   - Google+ API
   - People API (if available)

### Step 3: Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**

2. Choose **External** user type → Click **Create**

3. Fill in App information:
   - **App name**: `Becoming Diamond`
   - **User support email**: Client's email
   - **App logo**: (optional) Upload logo
   - **Application home page**: `https://www.becomingdiamond.com`
   - **Application privacy policy**: `https://www.becomingdiamond.com/privacy`
   - **Application terms of service**: `https://www.becomingdiamond.com/terms`
   - **Authorized domains**: `becomingdiamond.com`
   - **Developer contact information**: Client's email

4. Click **Save and Continue**

5. **Scopes**: Click **Add or Remove Scopes**
   - Select: `userinfo.email`
   - Select: `userinfo.profile`
   - Select: `openid`
   - Click **Update** → **Save and Continue**

6. **Test users** (optional): Add test emails → **Save and Continue**

7. Click **Back to Dashboard**

### Step 4: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**

2. Click **+ Create Credentials** → **OAuth client ID**

3. Configure:
   - **Application type**: `Web application`
   - **Name**: `Becoming Diamond - Production`

4. **Authorized JavaScript origins**:
   ```
   https://www.becomingdiamond.com
   https://becomingdiamond.com
   ```

5. **Authorized redirect URIs**:
   ```
   https://www.becomingdiamond.com/api/auth/callback/google
   ```

6. Click **Create**

7. **Copy the credentials:**
   - Client ID (starts with numbers, ends with `.apps.googleusercontent.com`)
   - Client Secret (starts with `GOCSPX-`)

### Step 5: Repeat for Development Environment

1. Create another OAuth client ID for local development:
   - **Name**: `Becoming Diamond - Development`
   - **Authorized JavaScript origins**: `http://localhost:3003`
   - **Authorized redirect URIs**: `http://localhost:3003/api/auth/callback/google`

2. Copy these credentials separately (for `.env.local`)

### Step 6: Update Environment Variables

**Production (`.env.production` and Vercel):**
```bash
AUTH_GOOGLE_ID=<client-id-from-production-oauth-app>
AUTH_GOOGLE_SECRET=<client-secret-from-production-oauth-app>
```

**Development (`.env.local`):**
```bash
AUTH_GOOGLE_ID=<client-id-from-development-oauth-app>
AUTH_GOOGLE_SECRET=<client-secret-from-development-oauth-app>
```

### Step 7: Deploy and Test

```bash
# Update Vercel environment variables
vercel env add AUTH_GOOGLE_ID production
# Paste the production client ID when prompted

vercel env add AUTH_GOOGLE_SECRET production
# Paste the production client secret when prompted

# Redeploy
vercel --prod

# Test
# 1. Open https://www.becomingdiamond.com
# 2. Click "Sign In"
# 3. Choose "Continue with Google"
# 4. Verify you can authenticate successfully
```

---

## 2. GitHub OAuth Setup (NextAuth)

**Purpose**: Allow users to sign in with "Sign in with GitHub"

### Step 1: Access Client's GitHub Account

Have the client log into GitHub and navigate to:
https://github.com/settings/developers

### Step 2: Create OAuth App for Production

1. Click **OAuth Apps** in left sidebar

2. Click **New OAuth App**

3. Fill in details:
   - **Application name**: `Becoming Diamond - Production`
   - **Homepage URL**: `https://www.becomingdiamond.com`
   - **Application description**: `Member authentication for Becoming Diamond platform`
   - **Authorization callback URL**: `https://www.becomingdiamond.com/api/auth/callback/github`

4. Click **Register application**

5. On the app page:
   - Copy the **Client ID** (starts with `Ov23li`)
   - Click **Generate a new client secret**
   - Copy the **Client Secret** (will only be shown once!)

### Step 3: Create OAuth App for Development

1. Click **New OAuth App** again

2. Fill in details:
   - **Application name**: `Becoming Diamond - Development`
   - **Homepage URL**: `http://localhost:3003`
   - **Authorization callback URL**: `http://localhost:3003/api/auth/callback/github`

3. Register and copy credentials

### Step 4: Update Environment Variables

**Production:**
```bash
AUTH_GITHUB_ID=<client-id-from-production-oauth-app>
AUTH_GITHUB_SECRET=<client-secret-from-production-oauth-app>
```

**Development:**
```bash
AUTH_GITHUB_ID=<client-id-from-development-oauth-app>
AUTH_GITHUB_SECRET=<client-secret-from-development-oauth-app>
```

### Step 5: Deploy and Test

```bash
# Update Vercel
vercel env add AUTH_GITHUB_ID production
vercel env add AUTH_GITHUB_SECRET production

# Redeploy
vercel --prod

# Test GitHub authentication flow
```

---

## 3. GitHub OAuth Setup (Decap CMS)

**Purpose**: Allow content editors to authenticate to Decap CMS

**IMPORTANT**: This is a **separate** OAuth app from the NextAuth GitHub integration.

### Step 1: Create Decap CMS OAuth App for Production

1. In client's GitHub, go to https://github.com/settings/developers

2. Click **New OAuth App**

3. Fill in details:
   - **Application name**: `Becoming Diamond Decap CMS - Production`
   - **Homepage URL**: `https://www.becomingdiamond.com`
   - **Application description**: `Content management system authentication`
   - **Authorization callback URL**: `https://www.becomingdiamond.com/api/callback`

   Note: The callback URL is `/api/callback` (NOT `/api/auth/callback/github`)

4. Register and copy credentials

### Step 2: Create Decap CMS OAuth App for Development

1. Click **New OAuth App**

2. Fill in details:
   - **Application name**: `Becoming Diamond Decap CMS - Development`
   - **Homepage URL**: `http://localhost:3003`
   - **Authorization callback URL**: `http://localhost:3003/api/callback`

3. Register and copy credentials

### Step 3: Update Environment Variables

**Production:**
```bash
GITHUB_CLIENT_ID=<client-id-from-decap-production-oauth-app>
GITHUB_CLIENT_SECRET=<client-secret-from-decap-production-oauth-app>
```

**Development:**
```bash
GITHUB_CLIENT_ID=<client-id-from-decap-development-oauth-app>
GITHUB_CLIENT_SECRET=<client-secret-from-decap-development-oauth-app>
```

### Step 4: Grant Repository Access

**CRITICAL**: The client's GitHub account must have write access to the repository.

1. Ensure client is added as collaborator:
   ```bash
   # Go to repo settings
   https://github.com/YOUR_ORG/becoming-diamond-nextjs/settings/access

   # Add client's GitHub username with "Write" or "Maintain" role
   ```

2. Client must accept the invitation

### Step 5: Deploy and Test

```bash
# Update Vercel
vercel env add GITHUB_CLIENT_ID production
vercel env add GITHUB_CLIENT_SECRET production

# Redeploy
vercel --prod

# Test Decap CMS
# 1. Navigate to https://www.becomingdiamond.com/admin
# 2. Click "Login with GitHub"
# 3. Authorize the app
# 4. Verify you can access CMS and see content collections
# 5. Try creating/editing a blog post
```

---

## 4. Stripe Integration

**Purpose**: Process book sales and payments

**Prerequisites**: Client has completed the [Stripe Client Setup Guide](./stripe-client-setup.md)

### Step 1: Collect Client's Stripe Credentials

You should receive from the client:

```
Product Details:
- Product ID: prod_XXXxxxxXXXxxx
- Price ID: price_1XXXxxxXXXxxx

Test Mode Keys:
- Publishable Key (TEST): pk_test_51XXXxxxXXXxxx
- Secret Key (TEST): sk_test_51XXXxxxXXXxxx

Live Mode Keys:
- Publishable Key (LIVE): pk_live_51XXXxxxXXXxxx
- Secret Key (LIVE): sk_live_51XXXxxxXXXxxx
```

### Step 2: Update Code with Product/Price IDs

Edit the book sales component:

```bash
# Find the component
code src/components/BookSalesSection.tsx
```

Update the price ID:
```typescript
const STRIPE_PRICE_ID = "price_XXX"; // Replace with client's price ID
const STRIPE_PRODUCT_ID = "prod_XXX"; // Replace with client's product ID
```

Or use environment variables (recommended):
```typescript
const STRIPE_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_BOOK;
const STRIPE_PRODUCT_ID = process.env.NEXT_PUBLIC_STRIPE_PRODUCT_BOOK;
```

### Step 3: Update Environment Variables

**Production (`.env.production` and Vercel):**
```bash
# Live Mode Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51XXX...
STRIPE_SECRET_KEY=sk_live_51XXX...

# Product/Price IDs
NEXT_PUBLIC_STRIPE_PRICE_BOOK=price_1XXX...
NEXT_PUBLIC_STRIPE_PRODUCT_BOOK=prod_XXX...
```

**Development (`.env.local`):**
```bash
# Test Mode Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51XXX...
STRIPE_SECRET_KEY=sk_test_51XXX...

# Product/Price IDs (use test product)
NEXT_PUBLIC_STRIPE_PRICE_BOOK=price_1XXX...
NEXT_PUBLIC_STRIPE_PRODUCT_BOOK=prod_XXX...
```

### Step 4: Set Up Webhook Endpoint in Client's Stripe

1. Have client log into Stripe Dashboard

2. Navigate to **Developers** → **Webhooks**

3. Click **Add endpoint**

4. Configure:
   - **Endpoint URL**: `https://www.becomingdiamond.com/api/stripe/webhook`
   - **Description**: `Production webhook for book sales`
   - **Events to send**:
     - `checkout.session.completed`
     - `checkout.session.expired`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`

5. Click **Add endpoint**

6. Copy the **Signing secret** (starts with `whsec_`)

7. Add to production environment:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_XXX...
   ```

### Step 5: Test in Test Mode

```bash
# Local testing with Stripe CLI
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3003/api/stripe/webhook

# In another terminal, start dev server
npm run dev

# Navigate to http://localhost:3003
# Go to book section
# Click "Buy Now"
# Use test card: 4242 4242 4242 4242
# Verify checkout completes
# Check webhook fired in stripe listen terminal
```

### Step 6: Test in Production

```bash
# Deploy updated environment variables
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
vercel env add STRIPE_SECRET_KEY production
vercel env add STRIPE_WEBHOOK_SECRET production
vercel env add NEXT_PUBLIC_STRIPE_PRICE_BOOK production

# Redeploy
vercel --prod

# IMPORTANT: Only test with real money if client approves
# Recommend: Make a $14.99 purchase yourself, then refund it
```

---

## 5. Gmail SMTP Setup

**Purpose**: Send transactional emails (magic links, receipts, notifications)

### Step 1: Enable SMTP in Client's Gmail

Have the client:

1. Log into their Gmail account (support@becomingdiamond.com)

2. Enable 2-Factor Authentication (if not already):
   - Go to https://myaccount.google.com/security
   - Click **2-Step Verification**
   - Follow setup wizard

3. Create App Password:
   - Go to https://myaccount.google.com/apppasswords
   - Select app: **Mail**
   - Select device: **Other (Custom name)**
   - Enter name: `Becoming Diamond Production`
   - Click **Generate**
   - Copy the 16-character password (no spaces)

### Step 2: Update Environment Variables

**Production:**
```bash
GMAIL_USER=support@becomingdiamond.com
GMAIL_APP_PASSWORD=<16-character-app-password>
```

**Development:**
```bash
# Can use same credentials or separate dev email
GMAIL_USER=support@becomingdiamond.com
GMAIL_APP_PASSWORD=<16-character-app-password>
```

### Step 3: Deploy and Test

```bash
# Update Vercel
vercel env add GMAIL_USER production
vercel env add GMAIL_APP_PASSWORD production

# Redeploy
vercel --prod

# Test email sending
# 1. Trigger magic link authentication
# 2. Verify email arrives
# 3. Check spam folder if not in inbox
# 4. Verify email format and branding
```

### Troubleshooting

If emails don't send:
- Verify 2FA is enabled on Gmail account
- Verify App Password is correct (no spaces)
- Check Gmail "Less secure app access" is not blocking
- Try regenerating the App Password
- Check application logs for SMTP errors

---

## 6. Turso Database

**Purpose**: Store user data, sessions, sprint progress, and leads

### Step 1: Client Creates Turso Account

Have the client:

1. Go to https://turso.tech

2. Sign up with GitHub or email

3. Verify email

### Step 2: Create Production Database

Have the client:

1. Install Turso CLI:
   ```bash
   # macOS/Linux
   curl -sSfL https://get.tur.so/install.sh | bash

   # Or via Homebrew
   brew install chiselstrike/tap/turso
   ```

2. Login:
   ```bash
   turso auth login
   ```

3. Create database:
   ```bash
   turso db create becoming-diamond-production --location lhr
   ```

   Note: `lhr` is London (choose closest to users)

4. Get database URL:
   ```bash
   turso db show becoming-diamond-production
   ```

   Copy the **URL** (starts with `libsql://`)

5. Create auth token:
   ```bash
   turso db tokens create becoming-diamond-production
   ```

   Copy the **token** (starts with `eyJ...`)

### Step 3: Update Environment Variables

**Production:**
```bash
TURSO_DATABASE_URL=libsql://becoming-diamond-production-<client>.aws-<region>.turso.io
TURSO_AUTH_TOKEN=eyJ...

# Legacy aliases (for compatibility)
DATABASE_URL=libsql://becoming-diamond-production-<client>.aws-<region>.turso.io
DATABASE_AUTH_TOKEN=eyJ...
```

### Step 4: Run Database Migrations

Before deploying, you need to set up the database schema:

```bash
# Locally, update .env.local with new Turso credentials temporarily
# Then run migrations

# Install dependencies
npm install

# Run migration scripts
npx tsx scripts/run-migrations.ts
```

Migrations to run:
1. Users table
2. Sessions table
3. Sprint progress table
4. Leads table
5. Payments table (if using Stripe)

### Step 5: Migrate Existing Data (Optional)

If you need to migrate data from your old database:

```bash
# Export from old database
turso db shell <old-db-name> ".dump" > backup.sql

# Import to new database
turso db shell becoming-diamond-production < backup.sql
```

Alternatively, write a custom migration script if schema changes are needed.

### Step 6: Deploy and Test

```bash
# Update Vercel
vercel env add TURSO_DATABASE_URL production
vercel env add TURSO_AUTH_TOKEN production
vercel env add DATABASE_URL production
vercel env add DATABASE_AUTH_TOKEN production

# Redeploy
vercel --prod

# Test database connectivity
# 1. Sign up a new user
# 2. Complete a sprint day
# 3. Verify data persists
# 4. Check Turso dashboard for data
```

### Monitoring Database

```bash
# Client can monitor database usage
turso db show becoming-diamond-production

# View database shell
turso db shell becoming-diamond-production

# List tables
.tables

# Query data
SELECT * FROM users LIMIT 5;
```

---

## 7. Bunny Stream Video Hosting

**Purpose**: Host and stream sprint training videos

### Step 1: Client Creates Bunny Account

Have the client:

1. Go to https://bunny.net

2. Sign up for account

3. Verify email

4. Add payment method (required even for free tier)

### Step 2: Create Video Library

1. In Bunny Dashboard, go to **Stream** → **Libraries**

2. Click **Add Library**

3. Configure:
   - **Library name**: `Becoming Diamond Videos`
   - **Region**: Choose closest to target audience (e.g., EU for Europe, US for USA)
   - **Replication regions**: (optional) Add additional regions for global CDN

4. Click **Create Library**

5. Copy the **Library ID** (6-digit number)

### Step 3: Get API Key

1. Go to **Account** → **API**

2. Click **Add API Key**

3. Configure:
   - **Name**: `Becoming Diamond Production`
   - **Permissions**:
     - Stream: Read/Write
     - Storage: Read/Write

4. Click **Create**

5. Copy the **API Key** (alphanumeric string)

### Step 4: Get CDN Hostname

1. Go back to **Stream** → **Libraries**

2. Click on your library

3. Find **CDN Hostname** (e.g., `vz-xxxxxx-xxx.b-cdn.net`)

4. Find **Pull Zone** name (e.g., `vz-xxxxxx-xxx`)

### Step 5: Update Environment Variables

**Production:**
```bash
BUNNY_STREAM_LIBRARY_ID=<library-id>
BUNNY_STREAM_API_KEY=<api-key>
BUNNY_STREAM_CDN_HOSTNAME=<cdn-hostname>
BUNNY_STREAM_PULL_ZONE=<pull-zone-name>
```

**Development** (can use same or create separate library):
```bash
BUNNY_STREAM_LIBRARY_ID=<library-id>
BUNNY_STREAM_API_KEY=<api-key>
BUNNY_STREAM_CDN_HOSTNAME=<cdn-hostname>
BUNNY_STREAM_PULL_ZONE=<pull-zone-name>
```

### Step 6: Upload Existing Videos

You need to transfer videos from your account to client's account:

**Option A: Download and Re-upload (Recommended)**

1. Download all videos from your Bunny library:
   ```bash
   # Use Bunny's download API or dashboard
   ```

2. Upload to client's library via Bunny dashboard:
   - Go to client's library
   - Drag and drop video files
   - Wait for encoding to complete
   - Copy new video GUIDs

**Option B: API Transfer (Advanced)**

Create a script to copy videos:
```bash
# Create transfer script
node scripts/transfer-bunny-videos.js
```

### Step 7: Update Video References

After uploading to new library, update video IDs in code/content:

1. Find all hardcoded video IDs:
   ```bash
   grep -r "videoId" src/
   ```

2. Update markdown content files in `content/` with new video GUIDs

3. Or update database if video IDs are stored there

### Step 8: Deploy and Test

```bash
# Update Vercel
vercel env add BUNNY_STREAM_LIBRARY_ID production
vercel env add BUNNY_STREAM_API_KEY production
vercel env add BUNNY_STREAM_CDN_HOSTNAME production
vercel env add BUNNY_STREAM_PULL_ZONE production

# Redeploy
vercel --prod

# Test video playback
# 1. Navigate to sprint page
# 2. Play a video
# 3. Verify no buffering issues
# 4. Test on mobile
```

---

## 8. Anthropic API (Optional)

**Purpose**: Power DiamondMind AI chat features

**Note**: Only needed if AI chat features are enabled.

### Step 1: Client Creates Anthropic Account

Have the client:

1. Go to https://console.anthropic.com

2. Sign up for account

3. Verify email

4. Add payment method

### Step 2: Create API Key

1. In console, go to **API Keys**

2. Click **Create Key**

3. Configure:
   - **Name**: `Becoming Diamond Production`
   - **Permissions**: Full access (default)

4. Copy the API key (starts with `sk-ant-api03-`)

**IMPORTANT**: Key is only shown once - save it securely!

### Step 3: Update Environment Variables

**Production:**
```bash
ANTHROPIC_API_KEY=sk-ant-api03-XXX...
```

### Step 4: Set Usage Limits (Recommended)

1. In Anthropic console, go to **Settings** → **Billing**

2. Set monthly spending limit (e.g., $100)

3. Enable email alerts at 50%, 75%, 90%

### Step 5: Deploy and Test

```bash
# Update Vercel
vercel env add ANTHROPIC_API_KEY production

# Redeploy
vercel --prod

# Test AI chat
# 1. Navigate to DiamondMind AI page
# 2. Send a test message
# 3. Verify response is generated
# 4. Check Anthropic console for usage
```

---

## 9. Vercel Deployment

**Purpose**: Update production deployment with all new credentials

### Step 1: Update All Environment Variables

Use the Vercel CLI or dashboard to update all variables at once:

```bash
# Export current production env (for backup)
vercel env pull .env.vercel.production.old

# Remove old variables (if needed)
vercel env rm AUTH_GOOGLE_ID production
vercel env rm AUTH_GOOGLE_SECRET production
# ... repeat for all variables

# Add all new variables
vercel env add AUTH_GOOGLE_ID production
vercel env add AUTH_GOOGLE_SECRET production
vercel env add AUTH_GITHUB_ID production
vercel env add AUTH_GITHUB_SECRET production
vercel env add GITHUB_CLIENT_ID production
vercel env add GITHUB_CLIENT_SECRET production
vercel env add STRIPE_SECRET_KEY production
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
vercel env add STRIPE_WEBHOOK_SECRET production
vercel env add GMAIL_USER production
vercel env add GMAIL_APP_PASSWORD production
vercel env add TURSO_DATABASE_URL production
vercel env add TURSO_AUTH_TOKEN production
vercel env add DATABASE_URL production
vercel env add DATABASE_AUTH_TOKEN production
vercel env add BUNNY_STREAM_LIBRARY_ID production
vercel env add BUNNY_STREAM_API_KEY production
vercel env add BUNNY_STREAM_CDN_HOSTNAME production
vercel env add BUNNY_STREAM_PULL_ZONE production
vercel env add ANTHROPIC_API_KEY production
```

Alternatively, use Vercel Dashboard:
1. Go to https://vercel.com/your-team/becoming-diamond/settings/environment-variables
2. Update each variable in the UI

### Step 2: Redeploy Production

```bash
# Trigger production deployment
vercel --prod

# Or via Git push to main branch
git push origin main
```

### Step 3: Monitor Deployment

```bash
# Watch deployment logs
vercel logs --prod --follow

# Check for errors in:
# - Build process
# - Runtime initialization
# - API route responses
```

---

## 10. Testing Checklist

After deployment, systematically test every integration:

### Authentication Testing

- [ ] **Google OAuth**
  - [ ] Navigate to `/auth/signin`
  - [ ] Click "Continue with Google"
  - [ ] Verify redirect to Google
  - [ ] Authorize app
  - [ ] Verify redirect back to site
  - [ ] Confirm user is logged in
  - [ ] Check user profile data saved to database

- [ ] **GitHub OAuth**
  - [ ] Navigate to `/auth/signin`
  - [ ] Click "Continue with GitHub"
  - [ ] Verify redirect to GitHub
  - [ ] Authorize app
  - [ ] Verify redirect back and login

- [ ] **Magic Link (Email)**
  - [ ] Enter email on signin page
  - [ ] Check email arrives within 1 minute
  - [ ] Click magic link
  - [ ] Verify authentication successful

### CMS Testing

- [ ] **Decap CMS Access**
  - [ ] Navigate to `/admin`
  - [ ] Click "Login with GitHub"
  - [ ] Verify authorization
  - [ ] Confirm CMS dashboard loads
  - [ ] See all collections (blog, pages, settings)

- [ ] **Content Editing**
  - [ ] Create a new blog post
  - [ ] Add title, content, image
  - [ ] Publish
  - [ ] Verify Git commit created
  - [ ] Verify post appears on site

### Payment Testing

- [ ] **Stripe Checkout**
  - [ ] Navigate to book section
  - [ ] Click "Buy Now - $14.99"
  - [ ] Verify redirect to Stripe Checkout
  - [ ] Use test card (if test mode): `4242 4242 4242 4242`
  - [ ] Or use real card (then refund)
  - [ ] Complete payment
  - [ ] Verify redirect to success page
  - [ ] Check Stripe dashboard for transaction
  - [ ] Verify webhook fired
  - [ ] Check database for payment record

### Email Testing

- [ ] **Transactional Emails**
  - [ ] Magic link email (tested above)
  - [ ] Purchase confirmation email
  - [ ] Sprint progress emails (if enabled)
  - [ ] Verify all emails:
    - Arrive promptly
    - Have correct sender
    - Render properly
    - Links work

### Database Testing

- [ ] **User Data**
  - [ ] Create new user account
  - [ ] Update profile
  - [ ] Complete a sprint day
  - [ ] Log out and log back in
  - [ ] Verify data persists

- [ ] **Query Performance**
  - [ ] Load dashboard (should be fast)
  - [ ] Load sprint progress
  - [ ] Check Turso dashboard for query metrics

### Video Testing

- [ ] **Video Playback**
  - [ ] Navigate to sprint day with video
  - [ ] Click play
  - [ ] Verify video loads
  - [ ] Check playback quality
  - [ ] Test on mobile device
  - [ ] Verify no CORS errors

### AI Testing (if enabled)

- [ ] **DiamondMind Chat**
  - [ ] Navigate to AI chat page
  - [ ] Send a message
  - [ ] Verify response generated
  - [ ] Check response quality
  - [ ] Verify no API errors
  - [ ] Check Anthropic usage dashboard

---

## 11. Rollback Procedures

If something goes wrong during migration, follow these rollback steps:

### Quick Rollback (Use Backup Environment Variables)

```bash
# Restore from backup
vercel env pull .env.vercel.production.old

# Re-add old variables
vercel env add AUTH_GOOGLE_ID production < .env.vercel.production.old
# ... repeat for all variables

# Redeploy
vercel --prod
```

### Service-Specific Rollbacks

**Google OAuth Issues:**
```bash
# Switch back to old OAuth credentials
vercel env add AUTH_GOOGLE_ID production
# Enter old value when prompted
vercel env add AUTH_GOOGLE_SECRET production
# Enter old value when prompted
vercel --prod
```

**Database Issues:**
```bash
# Point back to old Turso database
vercel env add TURSO_DATABASE_URL production
# Enter old database URL
vercel env add TURSO_AUTH_TOKEN production
# Enter old auth token
vercel --prod
```

**Stripe Issues:**
```bash
# Revert to old Stripe account
vercel env add STRIPE_SECRET_KEY production
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
vercel --prod
```

### Emergency Rollback (Complete Revert)

If multiple systems are failing:

```bash
# Revert entire deployment to previous version
vercel rollback

# Or redeploy specific commit
vercel --prod --force
```

### Post-Rollback Actions

1. **Document what went wrong**
   - Which service failed?
   - What was the error message?
   - What triggered the failure?

2. **Notify client**
   - Explain the rollback
   - Provide timeline for resolution
   - Request any missing information

3. **Debug offline**
   - Test in staging environment
   - Verify credentials are correct
   - Check service configurations

4. **Plan retry**
   - Schedule new migration time
   - Address root cause
   - Update this guide with lessons learned

---

## Appendix A: Environment Variable Reference

Complete list of all environment variables to migrate:

### Authentication
```bash
# NextAuth
NEXTAUTH_URL=https://www.becomingdiamond.com
AUTH_SECRET=<keep-same-value>

# Google OAuth
AUTH_GOOGLE_ID=<new-from-client>
AUTH_GOOGLE_SECRET=<new-from-client>

# GitHub OAuth (NextAuth)
AUTH_GITHUB_ID=<new-from-client>
AUTH_GITHUB_SECRET=<new-from-client>

# GitHub OAuth (Decap CMS)
GITHUB_CLIENT_ID=<new-from-client>
GITHUB_CLIENT_SECRET=<new-from-client>
```

### Database
```bash
TURSO_DATABASE_URL=<new-from-client>
TURSO_AUTH_TOKEN=<new-from-client>
DATABASE_URL=<new-from-client>
DATABASE_AUTH_TOKEN=<new-from-client>
```

### Payments
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<new-from-client>
STRIPE_SECRET_KEY=<new-from-client>
STRIPE_WEBHOOK_SECRET=<new-from-client>
NEXT_PUBLIC_STRIPE_PRICE_BOOK=<new-from-client>
NEXT_PUBLIC_STRIPE_PRODUCT_BOOK=<new-from-client>
```

### Email
```bash
GMAIL_USER=<new-from-client>
GMAIL_APP_PASSWORD=<new-from-client>
```

### Video
```bash
BUNNY_STREAM_LIBRARY_ID=<new-from-client>
BUNNY_STREAM_API_KEY=<new-from-client>
BUNNY_STREAM_CDN_HOSTNAME=<new-from-client>
BUNNY_STREAM_PULL_ZONE=<new-from-client>
```

### AI (Optional)
```bash
ANTHROPIC_API_KEY=<new-from-client>
```

---

## Appendix B: Troubleshooting Common Issues

### OAuth "Redirect URI mismatch"

**Symptom**: Error during OAuth flow saying redirect URI doesn't match

**Solution**:
1. Check OAuth app configuration
2. Verify redirect URI exactly matches (including https/http, trailing slash)
3. Common mistakes:
   - `http` vs `https`
   - `www.` vs no `www.`
   - `/callback` vs `/api/callback` vs `/api/auth/callback/google`

### "Invalid API key" Errors

**Symptom**: Services returning 401 or authentication errors

**Solution**:
1. Verify API key copied correctly (no extra spaces)
2. Check key hasn't expired
3. Verify environment variable name matches code
4. Restart deployment after updating env vars

### Database Connection Failures

**Symptom**: 500 errors, "Failed to connect to database"

**Solution**:
1. Test connection with Turso CLI:
   ```bash
   turso db shell <database-name>
   ```
2. Verify auth token is valid and not expired
3. Check database region/location
4. Ensure migrations have run

### Emails Not Sending

**Symptom**: Magic links not arriving, no confirmation emails

**Solution**:
1. Check Gmail App Password is correct
2. Verify 2FA enabled on Gmail account
3. Check spam folders
4. Test SMTP connection:
   ```bash
   node scripts/test-smtp.js
   ```
5. Check Gmail "Less secure app" settings

### Videos Not Playing

**Symptom**: Video player shows error or infinite loading

**Solution**:
1. Verify video uploaded to client's Bunny library
2. Check video GUID is correct in code/content
3. Test video URL directly in browser
4. Check browser console for CORS errors
5. Verify CDN hostname is correct

---

## Appendix C: Post-Migration Checklist

After successful migration, complete these final tasks:

### Security Cleanup

- [ ] Revoke old OAuth apps (your GitHub/Google accounts)
- [ ] Delete old Stripe test/live keys
- [ ] Rotate old database tokens
- [ ] Remove old Bunny API keys
- [ ] Clear old API keys from local `.env` files

### Documentation Updates

- [ ] Update README with client's service accounts
- [ ] Document new environment variable values (in secure location)
- [ ] Update deployment guides
- [ ] Share credentials with client securely

### Client Training

- [ ] Walk through Stripe Dashboard
- [ ] Show how to access Decap CMS
- [ ] Explain Turso database monitoring
- [ ] Review Bunny video uploads
- [ ] Share API usage dashboards

### Monitoring Setup

- [ ] Set up error tracking (Sentry/LogRocket)
- [ ] Configure uptime monitoring (UptimeRobot/Pingdom)
- [ ] Set budget alerts (Stripe, Anthropic, Bunny)
- [ ] Enable email notifications for critical errors

### Handoff Complete

- [ ] All integrations tested and working
- [ ] Client has access to all accounts
- [ ] Credentials documented and shared
- [ ] Support plan established
- [ ] Payment for development received

---

**Document Version:** 1.0
**Last Updated:** November 15, 2025
**Estimated Migration Time:** 3-4 hours
**Risk Level:** Medium (rollback procedures in place)
