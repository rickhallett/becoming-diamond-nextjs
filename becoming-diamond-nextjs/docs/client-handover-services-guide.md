# Client Handover: Required Services & Accounts

**Purpose**: This document outlines all third-party services, integrations, and accounts required to run the Becoming Diamond platform. Use this as a checklist to transition from developer accounts to client-owned production accounts.

**Last Updated**: 2025-10-15

---

## Overview

The platform requires **8 core services** to operate fully. Each section below provides:
- **Service name and purpose**
- **Current status** (developer vs. production)
- **Required plan/tier**
- **Estimated monthly cost**
- **Setup instructions**
- **Environment variables needed**

---

## 1. GitHub (Source Control & CMS Backend)

### Purpose
- Source code repository hosting
- Version control
- Decap CMS content storage backend
- OAuth provider for CMS authentication

### Current Status
- **Repository**: `rickhallett/becoming-diamond-nextjs` (developer account)
- **OAuth Apps**: 3 apps configured under developer account

### Required Setup

#### GitHub Account
- **Plan Required**: Free tier is sufficient
- **Cost**: $0/month
- **Action**: Create organization account: `becoming-diamond` or use personal account

#### GitHub OAuth Apps
Create **3 separate OAuth applications**:

1. **NextAuth GitHub OAuth** (Member Portal Authentication)
   - Navigate to: https://github.com/settings/developers
   - Click "New OAuth App"
   - **Application name**: `Becoming Diamond - Member Portal`
   - **Homepage URL**: `https://becomingdiamond.com`
   - **Authorization callback URL**: `https://becomingdiamond.com/api/auth/callback/github`
   - Copy the Client ID and generate a Client Secret

2. **Decap CMS OAuth** (Content Management)
   - Create another OAuth App
   - **Application name**: `Becoming Diamond - Decap CMS`
   - **Homepage URL**: `https://becomingdiamond.com`
   - **Authorization callback URL**: `https://becomingdiamond.com/api/cms-callback`
   - Copy the Client ID and generate a Client Secret

3. **GitHub Token** (Content API)
   - Navigate to: https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - **Note**: `Becoming Diamond Content API`
   - **Expiration**: No expiration (or set to 1 year and add to renewal calendar)
   - **Scopes**: Select `repo` (Full control of private repositories)
   - Copy the generated token

#### Repository Transfer
- Transfer repository from `rickhallett/becoming-diamond-nextjs` to client account
- Update Decap CMS config (`public/admin/config.yml`) with new repo path

### Environment Variables
```bash
# NextAuth GitHub OAuth
AUTH_GITHUB_ID=Ov23li...
AUTH_GITHUB_SECRET=138afd...

# Decap CMS OAuth
GITHUB_CLIENT_ID=Ov23liKQ...
GITHUB_CLIENT_SECRET=9f4f3f...

# GitHub API Token
GITHUB_TOKEN=github_pat_11...
```

---

## 2. Vercel (Hosting & Deployment)

### Purpose
- Next.js application hosting
- Automatic deployments from GitHub
- Edge network CDN
- Serverless functions for API routes

### Current Status
- **Account**: Developer account
- **Project**: Not yet deployed to production Vercel

### Required Setup

#### Vercel Account
- **Plan Required**: Hobby (Free) or Pro ($20/month)
- **Recommended**: Start with Hobby (Free), upgrade to Pro if needed
- **Cost**: $0/month (Hobby) or $20/month (Pro)
- **Sign up**: https://vercel.com/signup

#### Free Tier (Hobby Plan) Limitations:
- **Suitable for**: Personal projects, low-to-moderate traffic sites
- **Limits**:
  - 100 GB bandwidth/month
  - 6,000 build minutes/month
  - 100 GB-hours serverless function execution
  - Limited to usage caps (no overages)
  - 12 serverless functions per deployment
- **When to upgrade to Pro**:
  - Commercial production use (Hobby plan is for personal projects)
  - Need for more than 100 GB bandwidth/month
  - Need for team collaboration features
  - Need for advanced analytics

#### Deployment Setup
1. Create new Vercel project
2. Connect to GitHub repository
3. Configure build settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`
4. Add all environment variables (see Environment Variables Summary below)
5. Configure custom domain: `becomingdiamond.com`

#### Domain Configuration
1. Add domain in Vercel dashboard
2. Update DNS records at domain registrar:
   - **A Record**: Point to Vercel IP (provided in dashboard)
   - **CNAME**: `www` → `cname.vercel-dns.com`

### Environment Variables
All variables from this document must be added to Vercel project settings.

---

## 3. Turso (Database)

### Purpose
- SQLite database hosting (edge-replicated)
- User data storage (leads, book orders, user profiles, sessions)
- Fast global reads with edge replication

### Current Status
- **Database**: `becoming-diamond-leads-rickhallett` (developer account)
- **Region**: AWS EU-West-1

### Required Setup

#### Turso Account
- **Plan Required**: Free tier, Developer ($4.99/month), or Scaler ($29/month)
- **Recommended**: Start with Free tier, upgrade to Developer/Scaler as needed
- **Cost**: $0/month (Free), $4.99/month (Developer), or $29/month (Scaler)
- **Sign up**: https://turso.tech/signup

#### Free Tier Limitations:
- **Suitable for**: MVP, low-to-moderate traffic applications
- **Limits** (as of March 2025):
  - 500 million rows read/month
  - 10 million rows written/month
  - 5 GB total storage
  - 3 databases
  - 3 locations per database
- **When to upgrade**:
  - **Developer ($4.99/mo)**: 2.5 billion rows read/month, more databases
  - **Scaler ($29/mo)**: 10x Developer limits, production support
  - Exceeding free tier read/write limits consistently

#### Database Creation
1. Install Turso CLI: `brew install tursodatabase/tap/turso` (Mac) or see docs for other OS
2. Login: `turso auth login`
3. Create database:
   ```bash
   turso db create becoming-diamond-production --location iad
   ```
4. Create auth token:
   ```bash
   turso db tokens create becoming-diamond-production
   ```
5. Get database URL:
   ```bash
   turso db show becoming-diamond-production --url
   ```

#### Database Migration
Run migrations to create tables:
```bash
# From project root
npx tsx scripts/run-migration.ts 000_consolidated_schema.sql
npx tsx scripts/run-migration.ts 001_create_book_orders.sql
npx tsx scripts/run-migration.ts 002_member_portal_persistence.sql
npx tsx scripts/run-migration.ts 003_add_liability_acceptance.sql
```

#### Data Migration (if needed)
Export data from dev database and import to production:
```bash
turso db shell becoming-diamond-leads-rickhallett .dump > backup.sql
turso db shell becoming-diamond-production < backup.sql
```

### Environment Variables
```bash
TURSO_DATABASE_URL=libsql://becoming-diamond-production-[client].turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIs...
```

---

## 4. Resend (Transactional Email)

### Purpose
- Welcome email delivery (lead magnet)
- Admin notifications
- Future: Password resets, notifications

### Current Status
- **Account**: Developer account
- **Domain**: `turningsnowflakesintodiamonds.com` (verified on dev account)

### Required Setup

#### Resend Account
- **Plan Required**: Free tier (50,000 emails/month) or Pro ($20/month for 100k emails)
- **Recommended**: Free tier to start
- **Cost**: $0-20/month
- **Sign up**: https://resend.com/signup

#### Domain Verification
1. Navigate to: https://resend.com/domains
2. Click "Add Domain"
3. Enter: `turningsnowflakesintodiamonds.com`
4. Copy provided DNS records
5. Add DNS records to domain registrar:
   - **TXT Record**: For domain verification
   - **MX Records**: For email delivery
   - **CNAME Records**: For DKIM authentication
6. Click "Verify" (may take 24-48 hours for DNS propagation)

#### API Key Generation
1. Navigate to: https://resend.com/api-keys
2. Click "Create API Key"
3. **Name**: `Becoming Diamond Production`
4. **Permission**: Full access
5. Copy the API key (starts with `re_`)

### Environment Variables
```bash
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=support@turningsnowflakesintodiamonds.com
RESEND_ADMIN_EMAIL=admin@turningsnowflakesintodiamonds.com
```

---

## 5. Stripe (Payment Processing)

### Purpose
- Book sales payment processing
- Future: Course enrollment, subscription billing
- Webhook handling for payment events

### Current Status
- **Account**: Production account configured
- **Keys**: Live keys in use

### Required Setup

#### Stripe Account
- **Plan Required**: Standard (2.9% + $0.30 per transaction)
- **Cost**: Pay-per-transaction
- **Sign up**: https://dashboard.stripe.com/register

#### Product Configuration
1. Navigate to: https://dashboard.stripe.com/products
2. Create product: "The Diamond Manifesto Book"
   - **Price**: $27.00 USD
   - **Type**: One-time payment
3. Copy the Price ID

#### Webhook Setup
1. Navigate to: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. **Endpoint URL**: `https://becomingdiamond.com/api/stripe/webhook`
4. **Events to send**: Select:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the Webhook Signing Secret

### Environment Variables
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 6. Bunny Stream (Video Hosting)

### Purpose
- Video content hosting for courses
- HLS adaptive streaming
- Token-based video protection
- CDN delivery

### Current Status
- **Account**: Developer account
- **Library**: `512164` (developer library)

### Required Setup

#### Bunny.net Account
- **Plan Required**: Volume plan (pay-as-you-go)
- **Cost**: $10-30/month for MVP (50+ hours 1080p storage + bandwidth)
  - Storage: $0.005/GB/month
  - Streaming bandwidth: $0.01-0.03/GB (varies by region)
- **Sign up**: https://bunny.net/signup

#### Video Library Setup
1. Navigate to: https://dash.bunny.net/stream
2. Click "Create Stream Library"
3. **Library Name**: `Becoming Diamond Videos`
4. **Replication Regions**: Select regions near target audience
   - Recommended: US East, US West, Europe
5. **Security**: Enable token authentication
6. Copy the Library ID

#### API Key Generation
1. Navigate to: https://dash.bunny.net/account/settings
2. Scroll to "API" section
3. Click "Add API Key"
4. **Name**: `Becoming Diamond Production`
5. Copy the API key

#### CDN Configuration
- Pull Zone and CDN hostname are automatically generated with library
- Copy the CDN hostname (e.g., `vz-xxxxx-xxx.b-cdn.net`)

### Environment Variables
```bash
BUNNY_STREAM_LIBRARY_ID=512164
BUNNY_STREAM_API_KEY=26deeb0e-...
BUNNY_STREAM_CDN_HOSTNAME=vz-xxxxx-xxx.b-cdn.net
BUNNY_STREAM_PULL_ZONE=vz-xxxxx-xxx
```

---

## 7. Anthropic (AI Chat Features)

### Purpose
- DiamondMindAI chat functionality
- Future: AI-assisted coaching features

### Current Status
- **Account**: Developer account
- **API Key**: Active

### Required Setup

#### Anthropic Account
- **Plan Required**: Pay-as-you-go (no monthly fee)
- **Cost**: Variable based on usage
  - Claude Sonnet: $3/million input tokens, $15/million output tokens
  - Estimated: $20-100/month depending on chat volume
- **Sign up**: https://console.anthropic.com/signup

#### API Key Generation
1. Navigate to: https://console.anthropic.com/account/keys
2. Click "Create Key"
3. **Name**: `Becoming Diamond Production`
4. Copy the API key (starts with `sk-ant-api03-`)

#### Usage Monitoring
- Set up billing alerts in Anthropic console
- Recommended: Set alert at $50/month initially

### Environment Variables
```bash
ANTHROPIC_API_KEY=sk-ant-api03-...
```

---

## 8. Google OAuth (Social Login)

### Purpose
- Google Sign-In for member portal
- Alternative authentication method to GitHub

### Current Status
- **OAuth App**: Configured under developer account

### Required Setup

#### Google Cloud Console
- **Plan Required**: Free
- **Cost**: $0/month
- **Access**: https://console.cloud.google.com

#### OAuth 2.0 Setup
1. Create new project: "Becoming Diamond"
2. Navigate to: APIs & Services → Credentials
3. Click "Create Credentials" → "OAuth client ID"
4. **Application type**: Web application
5. **Authorized JavaScript origins**:
   - `https://becomingdiamond.com`
6. **Authorized redirect URIs**:
   - `https://becomingdiamond.com/api/auth/callback/google`
7. Copy Client ID and Client Secret

#### OAuth Consent Screen
1. Navigate to: OAuth consent screen
2. **User Type**: External
3. **Application name**: Becoming Diamond
4. **Support email**: admin@turningsnowflakesintodiamonds.com
5. **Authorized domains**: `becomingdiamond.com`
6. **Scopes**: Add `email` and `profile`

### Environment Variables
```bash
AUTH_GOOGLE_ID=917577831263-...
AUTH_GOOGLE_SECRET=GOCSPX-...
```

---

## 9. NextAuth (Authentication Framework)

### Purpose
- Authentication session management
- OAuth provider integration
- Session encryption

### Required Setup

#### NextAuth
- **Plan Required**: Free (open-source library)
- **Cost**: $0/month
- **Note**: NextAuth.js (now Auth.js) is a free, open-source authentication library. No account or subscription needed.

#### Auth Secret Generation
Generate a secure random string for session encryption:

**Option 1 - OpenSSL (Mac/Linux):**
```bash
openssl rand -base64 32
```

**Option 2 - Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the generated string.

### Environment Variables
```bash
AUTH_SECRET=1NcXu+pjHL5u...
AUTH_URL=https://becomingdiamond.com
NEXTAUTH_URL=https://becomingdiamond.com
```

---

## 10. Admin API (Internal)

### Purpose
- Protected admin endpoints
- Lead data export
- Internal API access control

### Required Setup

#### Admin Key Generation
Generate a secure random string:

```bash
openssl rand -hex 32
```

### Environment Variables
```bash
ADMIN_API_KEY=your-secure-admin-key-here
```

**Important**: Keep this key secure. Anyone with this key can access all lead data via `/api/leads`.

---

## Environment Variables Summary

Create a `.env.local` file in production environment (Vercel) with all of these:

```bash
# GitHub OAuth (Member Portal)
AUTH_GITHUB_ID=<from_github_oauth_app_1>
AUTH_GITHUB_SECRET=<from_github_oauth_app_1>

# GitHub OAuth (Decap CMS)
GITHUB_CLIENT_ID=<from_github_oauth_app_2>
GITHUB_CLIENT_SECRET=<from_github_oauth_app_2>

# GitHub API Token
GITHUB_TOKEN=<from_github_tokens>

# NextAuth Configuration
AUTH_SECRET=<generated_random_string>
AUTH_URL=https://becomingdiamond.com
NEXTAUTH_URL=https://becomingdiamond.com

# Google OAuth
AUTH_GOOGLE_ID=<from_google_cloud_console>
AUTH_GOOGLE_SECRET=<from_google_cloud_console>

# Database (Turso)
TURSO_DATABASE_URL=<from_turso_db_show>
TURSO_AUTH_TOKEN=<from_turso_db_tokens>

# Email (Resend)
RESEND_API_KEY=<from_resend_api_keys>
RESEND_FROM_EMAIL=support@turningsnowflakesintodiamonds.com
RESEND_ADMIN_EMAIL=admin@turningsnowflakesintodiamonds.com

# Payment Processing (Stripe)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<from_stripe_dashboard>
STRIPE_SECRET_KEY=<from_stripe_dashboard>
STRIPE_WEBHOOK_SECRET=<from_stripe_webhooks>

# Video Hosting (Bunny Stream)
BUNNY_STREAM_LIBRARY_ID=<from_bunny_stream>
BUNNY_STREAM_API_KEY=<from_bunny_api>
BUNNY_STREAM_CDN_HOSTNAME=<from_bunny_stream>
BUNNY_STREAM_PULL_ZONE=<from_bunny_stream>

# AI Chat (Anthropic)
ANTHROPIC_API_KEY=<from_anthropic_console>

# Admin Access
ADMIN_API_KEY=<generated_random_string>

# Base URL
NEXT_PUBLIC_BASE_URL=https://becomingdiamond.com
```

---

## Cost Summary

### Minimum Cost (Free Tier Start)

| Service | Plan | Monthly Cost | Annual Cost | Notes |
|---------|------|--------------|-------------|-------|
| **GitHub** | Free | $0 | $0 | Free tier sufficient |
| **Vercel** | Hobby (Free) | $0 | $0 | Free tier, upgrade to Pro ($20/mo) for commercial use |
| **Turso** | Free | $0 | $0 | 500M reads, 10M writes, 5GB storage |
| **Resend** | Free | $0 | $0 | 50k emails/month free, then $20/mo for 100k |
| **Stripe** | Standard | Variable | Variable | 2.9% + $0.30 per transaction |
| **Bunny Stream** | Volume | $10-30 | $120-360 | Pay-as-you-go based on usage |
| **Anthropic** | Pay-as-you-go | $20-100 | $240-1,200 | Based on chat volume |
| **Google OAuth** | Free | $0 | $0 | Free tier sufficient |
| **NextAuth** | Open Source | $0 | $0 | Free library |
| **Domain Registration** | Various | $12-15 | $12-15 | Annual renewal |
| **TOTAL (MVP/Free Tier)** | | **$30-145/mo** | **$360-1,740/yr** | Minimum viable start |

### Recommended Production Cost

| Service | Plan | Monthly Cost | Annual Cost | Notes |
|---------|------|--------------|-------------|-------|
| **GitHub** | Free | $0 | $0 | Free tier sufficient |
| **Vercel** | Pro | $20 | $240 | Recommended for commercial production |
| **Turso** | Developer | $4.99 | $59.88 | 2.5B reads, better limits |
| **Resend** | Free | $0 | $0 | Can upgrade to Pro ($20/mo) if needed |
| **Stripe** | Standard | Variable | Variable | 2.9% + $0.30 per transaction |
| **Bunny Stream** | Volume | $10-30 | $120-360 | Pay-as-you-go based on usage |
| **Anthropic** | Pay-as-you-go | $20-100 | $240-1,200 | Based on chat volume |
| **Google OAuth** | Free | $0 | $0 | Free tier sufficient |
| **NextAuth** | Open Source | $0 | $0 | Free library |
| **Domain Registration** | Various | $12-15 | $12-15 | Annual renewal |
| **TOTAL (Production)** | | **$67-170/mo** | **$804-2,040/yr** | Recommended for production |

**Notes:**
- **Start with free tiers** - Can run the entire platform for ~$30-145/month initially
- **Upgrade as needed** - Scale up services based on actual usage and traffic
- **Variable costs** (Stripe, Anthropic, Bunny) depend on usage
- **Domain registration** is annual, not monthly
- **SSL certificates** included free with Vercel
- **Vercel Hobby plan** technically only for personal projects, but can start there
- Estimates assume moderate traffic (< 10k visitors/month)
- Higher traffic or commercial requirements may need Pro/paid tiers sooner

---

## Transition Checklist

Use this checklist to track account creation and configuration:

### Phase 1: Account Creation
- [ ] Create GitHub account/organization
- [ ] Create Vercel account
- [ ] Create Turso account
- [ ] Create Resend account
- [ ] Verify Stripe account (if not already done)
- [ ] Create Bunny.net account
- [ ] Create Anthropic account
- [ ] Create Google Cloud project

### Phase 2: Service Configuration
- [ ] Create 3 GitHub OAuth apps
- [ ] Generate GitHub API token
- [ ] Create Turso database and generate token
- [ ] Verify domain in Resend
- [ ] Configure Stripe products and webhooks
- [ ] Create Bunny Stream library
- [ ] Generate Anthropic API key
- [ ] Configure Google OAuth client

### Phase 3: Repository & Code
- [ ] Transfer GitHub repository to client account
- [ ] Update Decap CMS config with new repo path
- [ ] Update all hardcoded URLs in codebase
- [ ] Run database migrations on production database

### Phase 4: Deployment
- [ ] Create Vercel project
- [ ] Connect GitHub repository
- [ ] Add all environment variables to Vercel
- [ ] Configure custom domain in Vercel
- [ ] Update DNS records at domain registrar
- [ ] Deploy to production
- [ ] Test all features (see testing checklist below)

### Phase 5: Post-Deployment Testing
- [ ] Test homepage load
- [ ] Test lead capture form
- [ ] Verify welcome email delivery
- [ ] Test book purchase flow
- [ ] Test Stripe webhook delivery
- [ ] Test member portal login (GitHub OAuth)
- [ ] Test member portal login (Google OAuth)
- [ ] Test Decap CMS login and content editing
- [ ] Test video playback (if videos uploaded)
- [ ] Test DiamondMindAI chat
- [ ] Verify all images load correctly
- [ ] Test mobile responsiveness
- [ ] Run Lighthouse performance audit

---

## Support & Documentation

### Developer Handover
- **Repository**: All code is documented in `CLAUDE.md`
- **Architecture**: See `/docs/specs/` for detailed PRDs
- **Migrations**: Database migrations in `/migrations/`
- **Email Templates**: React Email templates in `/src/emails/`

### Service Documentation Links
- **Vercel**: https://vercel.com/docs
- **Turso**: https://docs.turso.tech
- **Resend**: https://resend.com/docs
- **Stripe**: https://stripe.com/docs
- **Bunny.net**: https://docs.bunny.net
- **Anthropic**: https://docs.anthropic.com
- **NextAuth**: https://authjs.dev

### Emergency Contacts
- **Developer**: [Your contact information]
- **Stripe Support**: https://support.stripe.com
- **Vercel Support**: support@vercel.com
- **Critical Issues**: [Emergency escalation process]

---

## Security Considerations

### Environment Variables
- **Never commit** `.env.local` to Git
- **Use Vercel's** environment variable encryption
- **Rotate keys** every 6-12 months
- **Set expiration** on GitHub tokens (if possible)

### Access Control
- **Limit GitHub** repository access to necessary team members
- **Enable 2FA** on all service accounts
- **Use separate** API keys for staging/production
- **Monitor** Stripe dashboard for suspicious activity

### Backups
- **Database**: Set up automated Turso backups
- **Code**: GitHub provides automatic version control
- **Email templates**: Stored in repository
- **Environment variables**: Keep secure backup in password manager

---

## Next Steps

1. **Review this document** with client and identify who will own each account
2. **Create accounts** in phases (start with critical: GitHub, Vercel, Turso)
3. **Schedule handover session** to walk through configuration
4. **Set up staging environment** first to test configuration
5. **Production deployment** once staging is verified
6. **Monitor costs** for first month to validate estimates

---

**Document Version**: 1.0
**Last Updated**: 2025-10-15
**Maintained By**: Development Team
