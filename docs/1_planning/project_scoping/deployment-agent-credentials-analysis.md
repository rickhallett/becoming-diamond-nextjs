# Agent Credentials Analysis - Autonomous Browser Automation

**Document Type:** Credential Requirements for Maximum Autonomy
**Date:** 2025-12-28
**Purpose:** Identify credentials needed in `.env.agent` for MCP browser automation

---

## Executive Summary

**With proper `.env.agent` configuration, autonomy can increase from 75% to 95%+**

### Autonomy Increase Breakdown

| Capability | Without .env.agent | With .env.agent | Increase |
|-----------|-------------------|-----------------|----------|
| OAuth App Creation | Manual (30 min) | Automated | +30 min |
| Vercel Configuration | Semi-automated | Fully automated | +15 min |
| DNS Configuration | Manual | Automated* | +5 min |
| Secret Management | Manual entry | Automated | +15 min |
| **Total Human Time** | **2.5 hours** | **<30 min** | **+2 hours** |
| **Autonomy Score** | **75%** | **95%+** | **+20%** |

*DNS automation depends on registrar API availability

---

## .env.agent File Structure

### Recommended File Layout

```bash
# ============================================
# .env.agent - Autonomous Deployment Credentials
# ============================================
# SECURITY: Add to .gitignore immediately!
# SECURITY: Use 1Password/Vault in production
# PURPOSE: Enable MCP browser automation and CLI tools
# ============================================

# ============================================
# BROWSER AUTOMATION CREDENTIALS
# ============================================
# These enable chrome-devtools-mcp to log into
# web consoles and perform configuration tasks

# Google Cloud Platform (OAuth App Creation)
GOOGLE_ACCOUNT_EMAIL=support@becomingdiamond.com
GOOGLE_ACCOUNT_PASSWORD=<secure-password>
GOOGLE_2FA_SECRET=<totp-secret-base32>  # For automated 2FA
GOOGLE_CLOUD_PROJECT_ID=becoming-diamond-prod
GOOGLE_CLOUD_PROJECT_NUMBER=123456789

# Vercel (if not using CLI token)
VERCEL_EMAIL=support@becomingdiamond.com
VERCEL_PASSWORD=<secure-password>

# Domain Registrar (DNS Configuration)
# Example: Cloudflare
CLOUDFLARE_EMAIL=support@becomingdiamond.com
CLOUDFLARE_API_KEY=<global-api-key>
CLOUDFLARE_ZONE_ID=<zone-id-for-becomingdiamond.com>

# Or Namecheap/GoDaddy credentials
DOMAIN_REGISTRAR=cloudflare  # Options: cloudflare, namecheap, godaddy
REGISTRAR_EMAIL=support@becomingdiamond.com
REGISTRAR_PASSWORD=<password>
REGISTRAR_API_KEY=<api-key>

# GitHub (if not using gh CLI)
GITHUB_EMAIL=support@becomingdiamond.com
GITHUB_PASSWORD=<password>
GITHUB_2FA_SECRET=<totp-secret>

# ============================================
# CLI TOOL CREDENTIALS
# ============================================
# These enable autonomous CLI operations

# Vercel CLI (preferred over browser automation)
VERCEL_TOKEN=<vercel-auth-token>
VERCEL_ORG_ID=<org-id>
VERCEL_PROJECT_ID=<project-id>

# GitHub CLI (usually already configured via `gh auth login`)
GITHUB_TOKEN=<personal-access-token>

# Turso CLI
TURSO_API_TOKEN=<turso-api-token>
TURSO_ORG=<organization-name>

# Stripe CLI
STRIPE_API_KEY=<stripe-api-key>
STRIPE_PUBLISHABLE_KEY=<stripe-publishable-key>

# ============================================
# APPLICATION SECRETS
# ============================================
# These will be set as environment variables
# in Vercel/deployment environments

# NextAuth
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
NEXTAUTH_URL_PRODUCTION=https://becomingdiamond.com
NEXTAUTH_URL_STAGING=https://staging.becomingdiamond.com
NEXTAUTH_URL_LOCALHOST=http://localhost:3003

# Database - Production
TURSO_DATABASE_URL_PROD=libsql://becoming-diamond-prod.turso.io
TURSO_AUTH_TOKEN_PROD=<production-token>

# Database - Staging
TURSO_DATABASE_URL_STAGING=libsql://becoming-diamond-staging.turso.io
TURSO_AUTH_TOKEN_STAGING=<staging-token>

# OAuth - Production
AUTH_GOOGLE_ID_PROD=<google-oauth-client-id>
AUTH_GOOGLE_SECRET_PROD=<google-oauth-client-secret>

# OAuth - Staging
AUTH_GOOGLE_ID_STAGING=<google-oauth-client-id>
AUTH_GOOGLE_SECRET_STAGING=<google-oauth-client-secret>

# Stripe - Production
STRIPE_SECRET_KEY_PROD=sk_live_<key>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_PROD=pk_live_<key>

# Stripe - Staging/Test
STRIPE_SECRET_KEY_TEST=sk_test_<key>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST=pk_test_<key>

# Bunny Stream (shared across environments)
BUNNY_STREAM_LIBRARY_ID=512164
BUNNY_STREAM_API_KEY=<api-key>
BUNNY_STREAM_CDN_HOSTNAME=vz-xxxxxxx-xxx.b-cdn.net
BUNNY_STREAM_PULL_ZONE=vz-xxxxxxx-xxx

# Email/SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=support@becomingdiamond.com
SMTP_PASS=<gmail-app-password>

# Logging
AXIOM_TOKEN=<axiom-api-token>
AXIOM_DATASET_PROD=becoming-diamond-prod
AXIOM_DATASET_STAGING=becoming-diamond-staging
AXIOM_DATASET_DEV=becoming-diamond-dev

# Decap CMS
GITHUB_CLIENT_ID=<decap-cms-oauth-client-id>
GITHUB_CLIENT_SECRET=<decap-cms-oauth-client-secret>

# ============================================
# BILLING & PAYMENT INFORMATION
# ============================================
# For automated billing setup (use with extreme caution!)

# Vercel Billing (NOT RECOMMENDED to store)
# VERCEL_CREDIT_CARD_TOKEN=<tokenized-card>  # Only if absolutely necessary

# Stripe Test Cards (safe to store)
STRIPE_TEST_CARD_NUMBER=4242424242424242
STRIPE_TEST_CARD_EXP=12/34
STRIPE_TEST_CARD_CVC=123

# ============================================
# DEPLOYMENT METADATA
# ============================================

# Deployment Configuration
DEPLOYMENT_ENVIRONMENT=development  # Options: development, staging, production
AUTO_DEPLOY_STAGING=true
AUTO_DEPLOY_PRODUCTION=false  # Require manual approval
ROLLBACK_ENABLED=true

# Notification Settings (optional)
SLACK_WEBHOOK_URL=<slack-webhook>
DEPLOYMENT_NOTIFICATION_EMAIL=support@becomingdiamond.com
```

---

## Credentials That Enable MCP Browser Automation

### 1. Google Cloud Console Access

**Purpose:** Autonomous OAuth app creation and configuration

**Required Credentials:**
```bash
GOOGLE_ACCOUNT_EMAIL=support@becomingdiamond.com
GOOGLE_ACCOUNT_PASSWORD=<password>
GOOGLE_2FA_SECRET=<totp-secret-base32>
GOOGLE_CLOUD_PROJECT_ID=becoming-diamond-prod
```

**What Agent Can Do Autonomously:**
1. Log into Google Cloud Console using MCP browser automation
2. Navigate to OAuth consent screen
3. Create new OAuth 2.0 Client IDs for staging and production
4. Configure authorized redirect URIs:
   - `https://staging.becomingdiamond.com/api/auth/callback/google`
   - `https://becomingdiamond.com/api/auth/callback/google`
5. Extract client ID and secret
6. Store credentials in Vercel environment variables
7. Test OAuth flow end-to-end

**MCP Automation Script:**
```typescript
// Autonomous Google OAuth app creation
async function createGoogleOAuthApp(environment: 'staging' | 'production') {
  const mcp = await connectBrowser();

  // 1. Login to Google Cloud Console
  await mcp.navigate('https://console.cloud.google.com');
  await mcp.fill('input[type="email"]', process.env.GOOGLE_ACCOUNT_EMAIL);
  await mcp.click('button:has-text("Next")');
  await mcp.fill('input[type="password"]', process.env.GOOGLE_ACCOUNT_PASSWORD);
  await mcp.click('button:has-text("Next")');

  // 2. Handle 2FA
  const totpCode = generateTOTP(process.env.GOOGLE_2FA_SECRET);
  await mcp.fill('input[type="tel"]', totpCode);
  await mcp.click('button:has-text("Next")');

  // 3. Navigate to OAuth consent screen
  await mcp.navigate(
    `https://console.cloud.google.com/apis/credentials?project=${process.env.GOOGLE_CLOUD_PROJECT_ID}`
  );

  // 4. Create OAuth 2.0 Client ID
  await mcp.click('button:has-text("Create Credentials")');
  await mcp.click('text=OAuth 2.0 Client ID');
  await mcp.fill('input[name="name"]', `Becoming Diamond ${environment}`);

  // 5. Configure redirect URIs
  const redirectUri = environment === 'staging'
    ? 'https://staging.becomingdiamond.com/api/auth/callback/google'
    : 'https://becomingdiamond.com/api/auth/callback/google';

  await mcp.click('button:has-text("Add URI")');
  await mcp.fill('input[name="redirect_uris"]', redirectUri);

  // 6. Create and extract credentials
  await mcp.click('button:has-text("Create")');
  const clientId = await mcp.textContent('.client-id-value');
  const clientSecret = await mcp.textContent('.client-secret-value');

  // 7. Store in Vercel
  await setVercelEnvVar(
    `AUTH_GOOGLE_ID`,
    clientId,
    environment === 'staging' ? 'preview' : 'production'
  );
  await setVercelEnvVar(
    `AUTH_GOOGLE_SECRET`,
    clientSecret,
    environment === 'staging' ? 'preview' : 'production'
  );

  return { clientId, clientSecret };
}
```

**Security Consideration:**
- 2FA secret stored in `.env.agent` allows TOTP code generation
- Alternative: Use Google Cloud service account (more secure)

---

### 2. Vercel Configuration

**Purpose:** Fully autonomous Vercel setup

**Required Credentials:**
```bash
VERCEL_TOKEN=<auth-token>
VERCEL_ORG_ID=<org-id>
VERCEL_PROJECT_ID=<project-id>
```

**How to Obtain Vercel Token:**
```bash
# Human runs once:
vercel login
vercel whoami
cat ~/.vercel/auth.json  # Contains auth token

# Or create token in Vercel dashboard:
# Settings → Tokens → Create Token
```

**What Agent Can Do Autonomously:**
```bash
# No browser automation needed - full CLI control
vercel env add NEXTAUTH_URL production "https://becomingdiamond.com"
vercel env add NEXTAUTH_SECRET staging "<secret>"
vercel env add AUTH_GOOGLE_ID production "<client-id>"
vercel env add STRIPE_SECRET_KEY production "<key>"
vercel domains add staging.becomingdiamond.com
vercel link --yes
vercel deploy --prod
```

**Autonomy Gained:**
- Environment variable setup: 100% autonomous
- Domain configuration: 100% autonomous
- Deployment: 100% autonomous
- Project linking: 100% autonomous

---

### 3. DNS Configuration

**Purpose:** Autonomous DNS record management

**Option A: Cloudflare (API Available)**
```bash
CLOUDFLARE_API_KEY=<global-api-key>
CLOUDFLARE_ZONE_ID=<zone-id>
CLOUDFLARE_EMAIL=support@becomingdiamond.com
```

**What Agent Can Do:**
```bash
# Using Cloudflare API
curl -X POST "https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/dns_records" \
  -H "X-Auth-Email: ${CLOUDFLARE_EMAIL}" \
  -H "X-Auth-Key: ${CLOUDFLARE_API_KEY}" \
  -H "Content-Type: application/json" \
  --data '{
    "type": "CNAME",
    "name": "staging",
    "content": "cname.vercel-dns.com",
    "ttl": 3600,
    "proxied": false
  }'
```

**Option B: Namecheap/GoDaddy (Browser Automation)**
```bash
REGISTRAR=namecheap
NAMECHEAP_USERNAME=<username>
NAMECHEAP_API_KEY=<api-key>
```

**MCP Browser Automation for DNS:**
```typescript
async function addDNSRecord() {
  const mcp = await connectBrowser();

  // Login to registrar
  await mcp.navigate('https://www.namecheap.com/myaccount/login');
  await mcp.fill('#username', process.env.NAMECHEAP_USERNAME);
  await mcp.fill('#password', process.env.REGISTRAR_PASSWORD);
  await mcp.click('button[type="submit"]');

  // Navigate to DNS management
  await mcp.navigate('https://ap.www.namecheap.com/domains/domaincontrolpanel/becomingdiamond.com/advancedns');

  // Add CNAME record
  await mcp.click('button:has-text("Add New Record")');
  await mcp.selectOption('select[name="RecordType"]', 'CNAME');
  await mcp.fill('input[name="Host"]', 'staging');
  await mcp.fill('input[name="Value"]', 'cname.vercel-dns.com');
  await mcp.fill('input[name="TTL"]', '3600');
  await mcp.click('button:has-text("Save")');
}
```

---

### 4. GitHub OAuth App Management

**Purpose:** Autonomous Decap CMS OAuth app creation

**Required Credentials:**
```bash
GITHUB_TOKEN=<personal-access-token>  # With admin:org and repo scopes
```

**What Agent Can Do:**
```bash
# Create OAuth app for Decap CMS via GitHub API
gh api /orgs/rickhallett/settings/oauth_application \
  --method POST \
  --field name="Becoming Diamond CMS - Staging" \
  --field homepage_url="https://staging.becomingdiamond.com" \
  --field callback_url="https://staging.becomingdiamond.com/api/cms-callback"

# Extract client ID and secret from response
# Update /public/admin/config.yml
# Commit and push changes
```

**Alternatively with MCP Browser Automation:**
```typescript
async function createGitHubOAuthApp(environment) {
  const mcp = await connectBrowser();

  await mcp.navigate('https://github.com/settings/developers');
  // ... automation steps similar to Google OAuth
}
```

---

### 5. 2FA/TOTP Secret Storage

**Purpose:** Enable automated login to services with 2FA

**Required Format:**
```bash
# TOTP secrets in base32 format (from QR code setup)
GOOGLE_2FA_SECRET=JBSWY3DPEHPK3PXP
GITHUB_2FA_SECRET=KBSWY3DPEHPK3PXQ
VERCEL_2FA_SECRET=LBSWY3DPEHPK3PXR
```

**How to Extract TOTP Secret:**
1. During 2FA setup, click "Can't scan QR code?"
2. Copy the base32 secret (usually 16 characters)
3. Store in `.env.agent`

**TOTP Code Generation in Agent:**
```typescript
import { authenticator } from 'otplib';

function generateTOTP(secret: string): string {
  return authenticator.generate(secret);
}

// Usage during automated login
const totpCode = generateTOTP(process.env.GOOGLE_2FA_SECRET);
await mcp.fill('input[name="totp"]', totpCode);
```

---

## Security Best Practices for .env.agent

### File Security

**1. Immediately Add to .gitignore:**
```bash
# .gitignore
.env.agent
.env.agent.*
*.agent.env
```

**2. File Permissions:**
```bash
# Restrict to owner only
chmod 600 .env.agent

# Verify permissions
ls -la .env.agent
# Should show: -rw------- (600)
```

**3. Encryption at Rest:**
```bash
# Option A: Use git-crypt
git-crypt init
echo ".env.agent filter=git-crypt diff=git-crypt" >> .gitattributes
git-crypt add-gpg-user <gpg-key-id>

# Option B: Use SOPS (Mozilla)
sops -e .env.agent > .env.agent.encrypted
# Decrypt when needed:
sops -d .env.agent.encrypted > .env.agent
```

**4. Use Secret Management Service:**
```bash
# Option A: 1Password CLI
op read "op://Private/.env.agent" > .env.agent

# Option B: AWS Secrets Manager
aws secretsmanager get-secret-value \
  --secret-id deployment-agent-env \
  --query SecretString \
  --output text > .env.agent

# Option C: HashiCorp Vault
vault kv get -field=content secret/deployment-agent > .env.agent
```

---

### Credential Rotation Strategy

**Recommended Rotation Schedule:**
```yaml
credentials:
  high_risk:  # Rotate every 30 days
    - GOOGLE_ACCOUNT_PASSWORD
    - VERCEL_PASSWORD
    - REGISTRAR_PASSWORD

  medium_risk:  # Rotate every 90 days
    - API tokens (VERCEL_TOKEN, GITHUB_TOKEN)
    - OAuth secrets
    - Database tokens

  low_risk:  # Rotate annually
    - 2FA secrets (requires re-enrollment)
    - Service API keys (Stripe, Bunny)
```

**Automated Rotation Script:**
```bash
#!/bin/bash
# scripts/rotate-agent-credentials.sh

# Check credential age
LAST_ROTATION=$(git log -1 --format=%ct -- .env.agent.encrypted)
CURRENT_TIME=$(date +%s)
DAYS_OLD=$(( (CURRENT_TIME - LAST_ROTATION) / 86400 ))

if [ $DAYS_OLD -gt 30 ]; then
  echo "⚠️  .env.agent credentials are $DAYS_OLD days old"
  echo "🔄 Rotation recommended"
  # Trigger rotation workflow
fi
```

---

### Principle of Least Privilege

**Create Service-Specific Accounts:**

Instead of using your personal Google account:
```bash
# Create dedicated service account
GOOGLE_ACCOUNT_EMAIL=deployment-agent@becomingdiamond.com
# Grant only necessary permissions:
# - OAuth app creation
# - Cloud Console access
# - No billing access
# - No production data access
```

**Use Scoped Tokens:**
```bash
# Vercel token with minimal scopes
VERCEL_TOKEN=<token-with-deploy-and-env-only>

# GitHub token with specific scopes
GITHUB_TOKEN=<token-with-repo-and-admin:org-only>

# Turso token with database-specific access
TURSO_API_TOKEN=<token-for-specific-database>
```

---

## Autonomous Checkpoint Elimination

### With .env.agent: Checkpoint Reduction

**Checkpoint #1: Provide Secrets (15 min) → ELIMINATED**
```bash
# Before: Human manually enters secrets
# After: Agent reads from .env.agent
export $(cat .env.agent | xargs)
```

**Checkpoint #2: Vercel Billing (10 min) → REMAINS**
```bash
# Cannot be fully automated (requires credit card)
# But can be pre-configured:
# - Token already set up
# - Project already linked
# - Only needs one-time billing approval
```

**Checkpoint #3: DNS Configuration (5 min) → ELIMINATED**
```bash
# Before: Human logs into registrar
# After: Agent uses Cloudflare API or browser automation
curl -X POST "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records" ...
```

**Checkpoint #4: OAuth Apps (30 min) → ELIMINATED**
```bash
# Before: Human creates apps in Google Console
# After: Agent uses MCP browser automation
createGoogleOAuthApp('staging')
createGoogleOAuthApp('production')
```

**Checkpoint #5: Database Strategy (5 min) → REMAINS**
```bash
# Strategic decision - human input valuable
# But can provide default in .env.agent:
DATABASE_STRATEGY=separate  # Options: shared, separate
```

**Checkpoint #6: UAT Approval (30 min) → REMAINS**
```bash
# Human validation still required
# But automated testing can pre-validate
```

**Checkpoint #7: Training (60 min) → REMAINS**
```bash
# Human attendance required
```

### New Autonomy Breakdown

**With .env.agent:**
- Total human time: **2.5 hours → 30 minutes** (80% reduction)
- Autonomy score: **75% → 95%+** (20% increase)
- Remaining human time:
  - Vercel billing approval: 5 min
  - Database strategy: 5 min (can be pre-decided)
  - UAT approval: 30 min
  - Training: 60 min (optional, can be async)

---

## Implementation Workflow with .env.agent

### Setup Phase (One-Time)

**Step 1: Create .env.agent**
```bash
# Copy template
cp .env.agent.template .env.agent

# Fill in credentials
nano .env.agent
```

**Step 2: Secure the File**
```bash
# Set permissions
chmod 600 .env.agent

# Add to .gitignore
echo ".env.agent" >> .gitignore

# Encrypt (optional but recommended)
sops -e .env.agent > .env.agent.encrypted
git add .env.agent.encrypted
```

**Step 3: Test Credentials**
```bash
# Test Vercel CLI
source .env.agent
vercel whoami

# Test GitHub CLI
gh auth status

# Test Cloudflare API
curl -X GET "https://api.cloudflare.com/client/v4/user/tokens/verify" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_KEY}"
```

---

### Execution Phase (Autonomous)

**Agent Execution Script:**
```bash
#!/bin/bash
# scripts/autonomous-deployment.sh

set -e

echo "🤖 Starting autonomous deployment..."

# 1. Load credentials
source .env.agent

# 2. Verify all credentials present
required_vars=(
  "VERCEL_TOKEN"
  "GOOGLE_ACCOUNT_EMAIL"
  "CLOUDFLARE_API_KEY"
  "TURSO_API_TOKEN"
)

for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ Missing required credential: $var"
    exit 1
  fi
done

echo "✅ All credentials loaded"

# 3. Phase 1: Technical Resolution (autonomous)
echo "🔧 Phase 1: Technical resolution..."
npm run build
npm run lint:fix
npm run knip

# 4. Phase 2: Vercel Configuration (autonomous with token)
echo "☁️  Phase 2: Vercel configuration..."
vercel link --yes
vercel env add NEXTAUTH_URL staging "${NEXTAUTH_URL_STAGING}"
vercel env add NEXTAUTH_SECRET staging "${NEXTAUTH_SECRET}"
vercel domains add staging.becomingdiamond.com

# 5. Phase 3: DNS Configuration (autonomous with API)
echo "🌐 Phase 3: DNS configuration..."
curl -X POST "https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/dns_records" \
  -H "X-Auth-Email: ${CLOUDFLARE_EMAIL}" \
  -H "X-Auth-Key: ${CLOUDFLARE_API_KEY}" \
  -H "Content-Type: application/json" \
  --data '{
    "type": "CNAME",
    "name": "staging",
    "content": "cname.vercel-dns.com",
    "ttl": 3600
  }'

# 6. Phase 4: OAuth Apps (autonomous with MCP)
echo "🔐 Phase 4: OAuth configuration..."
node scripts/create-oauth-apps.js  # Uses MCP browser automation

# 7. Phase 5: Database Setup (autonomous)
echo "🗄️  Phase 5: Database setup..."
turso db create becoming-diamond-staging
turso db tokens create becoming-diamond-staging
npm run db:migrate

# 8. Phase 6: Testing (autonomous)
echo "🧪 Phase 6: Testing..."
npm run test
npx playwright test
lighthouse https://staging.becomingdiamond.com --output json

# 9. Phase 7: Documentation (autonomous)
echo "📚 Phase 7: Documentation..."
node scripts/generate-deployment-docs.js

echo "✅ Autonomous deployment complete!"
echo "👤 Human approval needed for:"
echo "   - UAT testing on staging"
echo "   - Production promotion"
```

---

## Example: Complete OAuth App Creation Script

**File: `scripts/create-oauth-apps.js`**

```javascript
import { chromium } from 'playwright';
import { authenticator } from 'otplib';
import { execSync } from 'child_process';

async function createGoogleOAuthApps() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 1. Login to Google Cloud Console
    console.log('🔐 Logging into Google Cloud Console...');
    await page.goto('https://console.cloud.google.com');

    await page.fill('input[type="email"]', process.env.GOOGLE_ACCOUNT_EMAIL);
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(2000);

    await page.fill('input[type="password"]', process.env.GOOGLE_ACCOUNT_PASSWORD);
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(2000);

    // Handle 2FA
    if (await page.isVisible('input[type="tel"]')) {
      const totpCode = authenticator.generate(process.env.GOOGLE_2FA_SECRET);
      await page.fill('input[type="tel"]', totpCode);
      await page.click('button:has-text("Next")');
      await page.waitForTimeout(2000);
    }

    // 2. Create OAuth app for staging
    console.log('🏗️  Creating staging OAuth app...');
    const stagingCreds = await createOAuthApp(page, 'staging');

    // 3. Create OAuth app for production
    console.log('🏗️  Creating production OAuth app...');
    const productionCreds = await createOAuthApp(page, 'production');

    // 4. Store in Vercel
    console.log('☁️  Storing credentials in Vercel...');
    execSync(`vercel env add AUTH_GOOGLE_ID preview "${stagingCreds.clientId}"`);
    execSync(`vercel env add AUTH_GOOGLE_SECRET preview "${stagingCreds.clientSecret}"`);
    execSync(`vercel env add AUTH_GOOGLE_ID production "${productionCreds.clientId}"`);
    execSync(`vercel env add AUTH_GOOGLE_SECRET production "${productionCreds.clientSecret}"`);

    console.log('✅ OAuth apps created and configured!');

  } finally {
    await browser.close();
  }
}

async function createOAuthApp(page, environment) {
  const baseUrl = environment === 'staging'
    ? 'https://staging.becomingdiamond.com'
    : 'https://becomingdiamond.com';

  // Navigate to credentials page
  await page.goto(
    `https://console.cloud.google.com/apis/credentials?project=${process.env.GOOGLE_CLOUD_PROJECT_ID}`
  );

  // Create credentials
  await page.click('button:has-text("Create Credentials")');
  await page.click('text=OAuth 2.0 Client ID');

  // Configure
  await page.selectOption('select[name="applicationType"]', 'web');
  await page.fill('input[name="name"]', `Becoming Diamond - ${environment}`);

  // Add redirect URIs
  await page.click('button:has-text("Add URI")');
  await page.fill(
    'input[name="authorizedRedirectUris[0]"]',
    `${baseUrl}/api/auth/callback/google`
  );

  // Create
  await page.click('button:has-text("Create")');
  await page.waitForTimeout(2000);

  // Extract credentials
  const clientId = await page.textContent('[data-test="client-id"]');
  const clientSecret = await page.textContent('[data-test("client-secret"]');

  return { clientId, clientSecret };
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createGoogleOAuthApps().catch(console.error);
}
```

---

## .env.agent Template

**File: `.env.agent.template`**

```bash
# ============================================
# .env.agent TEMPLATE
# ============================================
# Copy this file to .env.agent and fill in values
# DO NOT commit .env.agent to git!
# ============================================

# ============================================
# BROWSER AUTOMATION CREDENTIALS
# ============================================

# Google Cloud Platform
GOOGLE_ACCOUNT_EMAIL=
GOOGLE_ACCOUNT_PASSWORD=
GOOGLE_2FA_SECRET=
GOOGLE_CLOUD_PROJECT_ID=

# Vercel (optional if using token below)
VERCEL_EMAIL=
VERCEL_PASSWORD=

# Domain Registrar
CLOUDFLARE_EMAIL=
CLOUDFLARE_API_KEY=
CLOUDFLARE_ZONE_ID=

# ============================================
# CLI TOKENS (Preferred over passwords)
# ============================================

# Vercel CLI (get with: vercel login && cat ~/.vercel/auth.json)
VERCEL_TOKEN=

# GitHub CLI (get with: gh auth token)
GITHUB_TOKEN=

# Turso CLI (get with: turso auth token)
TURSO_API_TOKEN=

# ============================================
# APPLICATION SECRETS
# ============================================

# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=

# Environments
NEXTAUTH_URL_PRODUCTION=https://becomingdiamond.com
NEXTAUTH_URL_STAGING=https://staging.becomingdiamond.com
NEXTAUTH_URL_LOCALHOST=http://localhost:3003

# Database URLs (get from Turso dashboard)
TURSO_DATABASE_URL_PROD=
TURSO_AUTH_TOKEN_PROD=
TURSO_DATABASE_URL_STAGING=
TURSO_AUTH_TOKEN_STAGING=

# Stripe (get from Stripe dashboard)
STRIPE_SECRET_KEY_PROD=
STRIPE_SECRET_KEY_TEST=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_PROD=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST=

# Bunny Stream (already in main .env)
BUNNY_STREAM_LIBRARY_ID=512164
BUNNY_STREAM_API_KEY=
BUNNY_STREAM_CDN_HOSTNAME=
BUNNY_STREAM_PULL_ZONE=

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=

# Logging
AXIOM_TOKEN=
AXIOM_DATASET_PROD=becoming-diamond-prod
AXIOM_DATASET_STAGING=becoming-diamond-staging

# ============================================
# CONFIGURATION
# ============================================

# Deployment preferences
AUTO_DEPLOY_STAGING=true
AUTO_DEPLOY_PRODUCTION=false
REQUIRE_APPROVAL_FOR_PROD=true
DATABASE_STRATEGY=separate  # Options: shared, separate
```

---

## Security Checklist

**Before Using .env.agent:**

- [ ] File added to `.gitignore`
- [ ] File permissions set to 600 (`chmod 600 .env.agent`)
- [ ] Encryption configured (git-crypt or SOPS)
- [ ] Credentials stored in password manager backup
- [ ] Service accounts created (not personal accounts)
- [ ] API tokens scoped to minimum permissions
- [ ] Rotation schedule documented
- [ ] Audit logging enabled for all services
- [ ] 2FA secrets backed up securely
- [ ] Team trained on security practices

**Never Do:**
- ❌ Commit `.env.agent` to git (even private repos)
- ❌ Share `.env.agent` in Slack/email
- ❌ Store credit card numbers in `.env.agent`
- ❌ Use production credentials in development
- ❌ Copy `.env.agent` to untrusted machines

---

## Summary

### With .env.agent Configuration

**Autonomy Increase:**
- From 75% → 95%+
- Human time: 2.5 hours → 30 minutes
- Only remaining checkpoints:
  - Vercel billing approval (5 min, one-time)
  - UAT approval (30 min)
  - Optional: Training session (can be async)

**Key Credentials Needed:**
1. **Google account + 2FA secret** → OAuth app creation
2. **Vercel token** → Full deployment automation
3. **Cloudflare API key** → DNS automation
4. **GitHub token** → Branch/OAuth management
5. **All application secrets** → Environment configuration

**Security:**
- Use service accounts, not personal accounts
- Encrypt `.env.agent` at rest
- Rotate credentials regularly
- Never commit to git
- Scope tokens to minimum permissions

**Result:**
With proper `.env.agent` configuration, the deployment can be **95%+ autonomous**, requiring human intervention only for strategic decisions and final approvals.

---

**Document Version:** 1.0
**Created:** 2025-12-28
**Security Classification:** Confidential - Contains credential patterns
