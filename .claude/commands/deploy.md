# Deployment Management Skill

You are a deployment assistant for the Becoming Diamond Next.js application. Use the Vercel CLI to manage deployments, environment variables, and monitor logs without requiring human intervention.

## Environment Overview

| Environment | Branch | Domain | Database |
|-------------|--------|--------|----------|
| Production | main | www.becomingdiamond.com | becoming-diamond-production-diamond-dev0 |
| Preview/Staging | staging | staging.becomingdiamond.com | becoming-diamond-production-diamond-dev0 |
| Development | - | localhost:3003 | becoming-diamond-staging-diamond-dev0 |

**Note:** Production and Preview share the same Turso database.

## Quick Commands Reference

### Check Deployment Status
```bash
vercel ls 2>&1 | head -15
```

### View Recent Logs (Production)
```bash
vercel logs https://www.becomingdiamond.com --output=short 2>&1 | tail -50
```

### View Recent Logs (Staging)
```bash
vercel logs https://staging.becomingdiamond.com --output=short 2>&1 | tail -50
```

### Search Logs for Errors
```bash
vercel logs https://www.becomingdiamond.com 2>&1 | grep -i "error\|fail\|exception" | tail -20
```

## Environment Variables

### List All Environment Variables
```bash
vercel env ls
```

### Pull Environment Variables for Inspection
```bash
# Production
vercel env pull .env.prod-temp --environment=production && cat .env.prod-temp && rm .env.prod-temp

# Preview/Staging
vercel env pull .env.preview-temp --environment=preview && cat .env.preview-temp && rm .env.preview-temp
```

### Add Environment Variable

**CRITICAL: Always use `printf`, never `echo`** - echo adds a trailing `\n` that breaks OAuth and other secrets.

```bash
# Add to production
printf '%s' 'value' | vercel env add VAR_NAME production

# Add to preview
printf '%s' 'value' | vercel env add VAR_NAME preview

# Add to all environments
printf '%s' 'value' | vercel env add VAR_NAME production preview development
```

### Remove Environment Variable
```bash
vercel env rm VAR_NAME production
```

## Deployment Workflow

### Deploy to Production
```bash
# Option 1: Push to main (triggers automatic deployment)
git push origin main

# Option 2: Direct deploy via CLI
vercel --prod
```

### Deploy to Staging
```bash
git push origin staging
```

### Trigger Redeploy (after env var changes)
```bash
vercel --prod
```

### Check Build Logs for Failed Deployment
```bash
# Get the deployment URL from vercel ls, then:
vercel inspect <deployment-url> 2>&1
```

## Database Migrations

### Pull Database Credentials
```bash
# Get production/preview database URL
vercel env pull .env-db-temp --environment=production && grep TURSO .env-db-temp && rm .env-db-temp
```

### Run Migration on Production/Preview Database
```bash
# First pull the credentials
vercel env pull .env-db-temp --environment=production

# Extract and run migration
TURSO_DATABASE_URL=$(grep "^TURSO_DATABASE_URL=" .env-db-temp | cut -d'"' -f2)
TURSO_AUTH_TOKEN=$(grep "^TURSO_AUTH_TOKEN=" .env-db-temp | cut -d'"' -f2)

TURSO_DATABASE_URL="$TURSO_DATABASE_URL" TURSO_AUTH_TOKEN="$TURSO_AUTH_TOKEN" \
node -e "
const { createClient } = require('@libsql/client');
const { readFileSync } = require('fs');
const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function migrate() {
  const sql = readFileSync('migrations/YOUR_MIGRATION.sql', 'utf-8');
  const statements = sql.split(';').filter(s => s.trim() && !s.trim().startsWith('--'));
  for (const stmt of statements) {
    try {
      await turso.execute(stmt);
      console.log('✓', stmt.substring(0, 50) + '...');
    } catch (e) {
      if (e.message.includes('already exists') || e.message.includes('duplicate')) {
        console.log('⚠ Already exists:', stmt.substring(0, 50));
      } else {
        console.error('✗', e.message);
      }
    }
  }
}
migrate();
"

rm .env-db-temp
```

## Troubleshooting Common Issues

### Build Fails with Missing Environment Variable
1. Check which env var is missing from the error
2. Verify it exists: `vercel env ls | grep VAR_NAME`
3. If missing, add it: `echo "value" | vercel env add VAR_NAME production`
4. Redeploy: `vercel --prod`

### Database Column Missing on Staging/Production
1. Pull the correct database credentials (production vs preview)
2. Run the migration against that database
3. Verify the change took effect

### Different Behavior Between Environments
1. Compare environment variables:
```bash
vercel env pull .env-prod --environment=production
vercel env pull .env-preview --environment=preview
diff .env-prod .env-preview
rm .env-prod .env-preview
```

### OAuth/Auth Issues
Key variables to check:
- `AUTH_GOOGLE_ID` - Must match the environment (different OAuth clients per env)
- `AUTH_GOOGLE_SECRET` - Corresponding secret
- `NEXTAUTH_URL` - Must match the deployment domain exactly
- `NEXTAUTH_SECRET` - Should be consistent

## When to Use This Skill

Invoke this skill with `/deploy` when:
- Deploying code changes to staging or production
- Debugging deployment failures
- Managing environment variables
- Running database migrations on remote databases
- Investigating production errors via logs
- Comparing environment configurations

## Proactive Actions

When deploying, always:
1. Check current deployment status first (`vercel ls`)
2. Verify required env vars exist for target environment
3. If adding new env vars, add to both production AND preview
4. After deployment, verify it succeeded (`vercel ls`)
5. If failed, check logs immediately (`vercel logs`)
