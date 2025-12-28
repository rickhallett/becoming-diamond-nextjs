# Autonomous Deployment Quick Start Guide

**Last Updated:** 2025-12-28
**Autonomy Level:** 95% (with `.env.agent` configured)

---

## Quick Start (5 Minutes)

### 1. Create Agent Credentials File

```bash
# Copy template
cp .env.agent.template .env.agent

# Secure the file
chmod 600 .env.agent

# Edit and fill in credentials
nano .env.agent  # or your preferred editor
```

### 2. Fill in Critical Credentials

**Minimum required for 95% autonomy:**

```bash
# CLI Tokens (preferred - no browser automation needed)
VERCEL_TOKEN=<from: vercel login && cat ~/.vercel/auth.json>
GITHUB_TOKEN=<from: gh auth token>
CLOUDFLARE_API_KEY=<from Cloudflare dashboard>
CLOUDFLARE_ZONE_ID=<from Cloudflare dashboard>
TURSO_API_TOKEN=<from: turso auth token>

# Application Secrets
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
# ... fill in other secrets from template
```

**For full browser automation (optional but increases autonomy):**

```bash
# Google Account (for OAuth app creation)
GOOGLE_ACCOUNT_EMAIL=support@becomingdiamond.com
GOOGLE_ACCOUNT_PASSWORD=<password>
GOOGLE_2FA_SECRET=<base32-totp-secret>
GOOGLE_CLOUD_PROJECT_ID=<project-id>
```

### 3. Verify Setup

```bash
# Test credentials
source .env.agent

# Verify Vercel access
vercel whoami

# Verify GitHub access
gh auth status

# Verify Cloudflare access
curl -X GET "https://api.cloudflare.com/client/v4/user/tokens/verify" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_KEY}"

# Verify Turso access
turso db list
```

### 4. Run Autonomous Deployment

```bash
# Execute autonomous deployment script
./scripts/autonomous-deployment.sh

# Or trigger via Claude Code agent
# Agent will handle all phases automatically
```

---

## What Gets Automated

### With CLI Tokens Only (80% autonomy)

**Fully Autonomous:**
- ✅ Build verification and fixes
- ✅ Vercel project configuration
- ✅ Environment variable setup
- ✅ DNS configuration (via Cloudflare API)
- ✅ Database creation and migrations
- ✅ Git workflow setup
- ✅ Automated testing
- ✅ Documentation generation

**Requires Human:**
- 🟡 OAuth app creation (15 min per app)
- 🟡 Vercel billing setup (5 min, one-time)
- 🟡 UAT approval (30 min)

**Total Human Time:** ~1 hour

### With Browser Automation Credentials (95% autonomy)

**Additionally Automated:**
- ✅ Google OAuth app creation (via MCP browser automation)
- ✅ OAuth app configuration
- ✅ Credential extraction and storage

**Requires Human:**
- 🟡 Vercel billing approval (5 min, one-time)
- 🟡 UAT final approval (30 min)

**Total Human Time:** ~35 minutes

---

## Credential Extraction Guide

### Vercel Token

```bash
# Method 1: CLI
vercel login  # Follow prompts
cat ~/.vercel/auth.json | jq -r '.token'

# Method 2: Dashboard
# 1. Go to vercel.com/account/tokens
# 2. Create new token
# 3. Copy token
```

### GitHub Token

```bash
# Method 1: CLI
gh auth login  # Follow prompts
gh auth token

# Method 2: Dashboard
# 1. Go to github.com/settings/tokens
# 2. Generate new token (classic)
# 3. Select scopes: repo, admin:org, admin:repo_hook
# 4. Copy token
```

### Cloudflare API Key & Zone ID

```bash
# API Key:
# 1. Go to dash.cloudflare.com/profile/api-tokens
# 2. Create Token OR use Global API Key (legacy)
# 3. Copy key

# Zone ID:
# 1. Go to dash.cloudflare.com
# 2. Select your domain (becomingdiamond.com)
# 3. Find Zone ID in right sidebar under API section
```

### Turso Token

```bash
# Method 1: CLI
turso auth login  # Follow prompts
turso auth token

# Method 2: Dashboard
# 1. Go to turso.tech/app
# 2. Settings → Tokens
# 3. Create new token
# 4. Copy token
```

### Google 2FA Secret (for browser automation)

```bash
# During 2FA setup:
# 1. Go to myaccount.google.com/security
# 2. 2-Step Verification → Set up Authenticator app
# 3. Click "Can't scan QR code?"
# 4. Copy the 16-character base32 secret
# Example: JBSWY3DPEHPK3PXP
```

---

## Security Best Practices

### File Security

```bash
# Set restrictive permissions
chmod 600 .env.agent

# Verify .env.agent is gitignored
git status  # Should NOT show .env.agent

# Store backup in password manager
# 1Password, Bitwarden, LastPass, etc.
```

### Encryption (Optional but Recommended)

**Option A: SOPS (Mozilla)**
```bash
# Install SOPS
brew install sops  # macOS
# or
apt-get install sops  # Linux

# Encrypt
sops -e .env.agent > .env.agent.encrypted

# Commit encrypted version
git add .env.agent.encrypted
git commit -m "chore: add encrypted agent credentials"

# Decrypt when needed
sops -d .env.agent.encrypted > .env.agent
```

**Option B: git-crypt**
```bash
# Install git-crypt
brew install git-crypt

# Initialize
git-crypt init

# Configure
echo ".env.agent filter=git-crypt diff=git-crypt" >> .gitattributes
git-crypt add-gpg-user <your-gpg-key-id>

# Now .env.agent will be encrypted in git automatically
```

### Credential Rotation

```bash
# Create rotation reminder
# Rotate every 30-90 days

# High priority (30 days):
# - Passwords
# - API keys for critical services

# Medium priority (90 days):
# - CLI tokens
# - OAuth secrets

# Low priority (annually):
# - 2FA secrets (requires re-enrollment)
```

---

## Autonomous Deployment Flow

### Phase-by-Phase Execution

```
🤖 AUTONOMOUS PHASES (No Human Required)
├─ Phase 1: Technical Resolution (4-6 hours)
│  ├─ Build verification and fixes
│  ├─ Dependency resolution
│  └─ Code quality checks
│
├─ Phase 2: Vercel Configuration (2-3 hours)
│  ├─ Project linking via CLI
│  ├─ Environment variable setup
│  └─ Domain configuration
│
├─ Phase 3: Git Workflow (1 hour)
│  ├─ Branch creation
│  ├─ Protection rules
│  └─ Workflow documentation
│
├─ Phase 4: OAuth Configuration (1-2 hours)
│  ├─ OAuth app creation (if browser creds provided)
│  ├─ Redirect URI configuration
│  └─ Credential storage
│
├─ Phase 5: Database Setup (1 hour)
│  ├─ Database creation
│  ├─ Migration execution
│  └─ Connection verification
│
├─ Phase 6: Testing (2-3 hours)
│  ├─ E2E test execution
│  ├─ Performance auditing
│  └─ Log verification
│
└─ Phase 7: Documentation (1-2 hours)
   ├─ Guide generation
   └─ Training materials

👤 HUMAN CHECKPOINTS
├─ Vercel Billing Approval (5 min) - one-time
├─ OAuth App Creation (15 min) - if no browser creds
└─ UAT Approval (30 min) - final validation
```

---

## Troubleshooting

### "Permission denied" on .env.agent

```bash
# Fix permissions
chmod 600 .env.agent

# Verify
ls -la .env.agent
# Should show: -rw------- (600)
```

### "Token invalid" errors

```bash
# Re-authenticate and get fresh tokens
vercel login
gh auth login
turso auth login

# Update tokens in .env.agent
```

### "2FA code rejected" (browser automation)

```bash
# Verify 2FA secret is correct
npm install -g otp-cli
otp <your-2fa-secret>
# Compare with code from authenticator app

# Ensure base32 format (no spaces)
GOOGLE_2FA_SECRET=JBSWY3DPEHPK3PXP  # Correct
GOOGLE_2FA_SECRET=JBSW Y3DP EHPK 3PXP  # Wrong (has spaces)
```

### DNS not propagating

```bash
# Check DNS status
dig staging.becomingdiamond.com

# Check Cloudflare configuration
curl -X GET \
  "https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/dns_records" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_KEY}"

# DNS can take 24-48 hours to propagate globally
# Agent will continue with other tasks during propagation
```

---

## Cost Comparison

### Traditional Manual Deployment
- **Human Time:** 12-16 hours
- **Cost:** $480-640 @ $40/hr
- **Risk:** High (manual errors)

### Autonomous with .env.agent
- **Human Time:** 30-60 minutes (checkpoints only)
- **Agent Time:** 12-16 hours (automated)
- **Cost:** $260-340 (includes agent execution)
- **Savings:** $220-300 (45% reduction)
- **Risk:** Low (automated testing, rollback)

---

## Next Steps

### For Immediate Deployment

1. **Fill out `.env.agent`** (15 min)
2. **Verify credentials** (5 min)
3. **Approve Vercel billing** (5 min, one-time)
4. **Start autonomous deployment** (automated)
5. **UAT approval when ready** (30 min)

### For Maximum Security

1. Set up encryption (SOPS or git-crypt)
2. Create service accounts (not personal)
3. Configure credential rotation
4. Enable audit logging
5. Set up monitoring alerts

---

## Support

**Documentation:**
- Full implementation plan: `docs/1_planning/project_scoping/deployment-implementation-plan-option-b.md`
- Credentials analysis: `docs/1_planning/project_scoping/deployment-agent-credentials-analysis.md`
- Autonomous analysis: `docs/1_planning/project_scoping/deployment-autonomous-implementation-analysis.md`

**Tools:**
- Vercel CLI: `vercel --help`
- GitHub CLI: `gh --help`
- Turso CLI: `turso --help`

**Emergency Rollback:**
```bash
# Via Vercel dashboard (instant)
vercel rollback <deployment-url>

# Via git (redeploy previous commit)
git revert HEAD
git push origin main
```

---

**Document Version:** 1.0
**Created:** 2025-12-28
**Autonomy Level:** 95% (with full .env.agent configuration)
