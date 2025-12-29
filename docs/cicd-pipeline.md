# CI/CD Pipeline Documentation

## Overview

This project uses a fully automated CI/CD pipeline with three environments:

- **Local Development** (`http://localhost:3003`)
- **Staging** (`https://staging.becomingdiamond.com`)
- **Production** (`https://www.becomingdiamond.com`)

## Architecture

```
┌─────────────┐
│   Developer │
└──────┬──────┘
       │
       ├─── git push origin staging ──► GitHub Actions ──► Vercel Preview ──► staging.becomingdiamond.com
       │
       └─── git push origin main ──────► GitHub Actions ──► Vercel Production ─► www.becomingdiamond.com
```

## Deployment Flow

### Staging Environment

1. **Trigger**: Push to `staging` branch
2. **Actions**:
   - Run linter
   - Run unit and integration tests
   - Build application
   - Deploy to Vercel preview
   - Assign alias `staging.becomingdiamond.com`
   - Run E2E tests against staging
3. **URL**: https://staging.becomingdiamond.com

### Production Environment

1. **Trigger**: Push to `main` branch
2. **Actions**:
   - Run linter
   - Run unit and integration tests
   - Build application
   - Deploy to Vercel production
   - Run smoke tests
   - Create deployment notification
3. **URL**: https://www.becomingdiamond.com

## Environment Variables

### Staging (.env.staging)

- `NEXTAUTH_URL`: https://staging.becomingdiamond.com
- `STRIPE_SECRET_KEY`: Test mode key
- `AXIOM_DATASET`: becoming-diamond-staging
- All other values match production

### Production (.env.production)

- `NEXTAUTH_URL`: https://www.becomingdiamond.com
- `STRIPE_SECRET_KEY`: Live mode key
- `AXIOM_DATASET`: becoming-diamond-prod

### Local Development

Use `.env.local` for local development overrides.

## GitHub Actions Workflows

### CI Pipeline (.github/workflows/ci.yml)

Runs on all PRs and pushes to `main` and `staging`:
- Linting with ESLint
- Unit tests with Vitest
- Integration tests with Vitest
- Build verification

### Deploy to Staging (.github/workflows/deploy-staging.yml)

Runs on push to `staging` branch:
- Pulls Vercel environment config
- Builds project
- Deploys to Vercel preview
- Assigns staging.becomingdiamond.com alias
- Runs E2E tests with Playwright

### Deploy to Production (.github/workflows/deploy-production.yml)

Runs on push to `main` branch:
- Pulls Vercel production config
- Builds project with `--prod` flag
- Deploys to Vercel production
- Runs smoke tests
- Creates deployment notification

## GitHub Secrets Required

The following secrets must be set in GitHub repository settings:

```bash
VERCEL_TOKEN          # Vercel authentication token
VERCEL_ORG_ID         # Vercel organization ID
VERCEL_PROJECT_ID     # Vercel project ID
NEXTAUTH_SECRET       # NextAuth.js secret
```

## Setup Instructions

### Initial Setup

1. **Authenticate CLI tools**:
   ```bash
   vercel login
   gh auth login
   turso auth login
   ```

2. **Link Vercel project**:
   ```bash
   vercel link
   ```

3. **Run setup script**:
   ```bash
   bash scripts/setup-cicd.sh
   ```

This will:
- Verify authentication
- Create GitHub secrets
- Set up GitHub environments
- Upload environment variables to Vercel

### Manual Setup (Alternative)

If the setup script fails, follow these steps:

1. **Create GitHub secrets** (Settings → Secrets and variables → Actions):
   - `VERCEL_TOKEN`: Get from `vercel whoami` or Vercel dashboard
   - `VERCEL_ORG_ID`: From `.vercel/project.json`
   - `VERCEL_PROJECT_ID`: From `.vercel/project.json`
   - `NEXTAUTH_SECRET`: From `.env.production`

2. **Upload environment variables to Vercel**:
   ```bash
   bash scripts/upload-env-to-vercel.sh preview .env.staging
   bash scripts/upload-env-to-vercel.sh production .env.production
   ```

## Deployment Workflow

### Deploying to Staging

```bash
git checkout staging
git merge main  # or cherry-pick specific commits
git push origin staging
```

This triggers:
1. CI pipeline (lint, test, build)
2. Deployment to staging.becomingdiamond.com
3. E2E test suite

### Deploying to Production

```bash
git checkout main
git merge staging  # after testing on staging
git push origin main
```

This triggers:
1. CI pipeline (lint, test, build)
2. Deployment to www.becomingdiamond.com
3. Smoke tests

### Hotfix Workflow

For urgent production fixes:

```bash
git checkout -b hotfix/description main
# Make changes
git push origin hotfix/description

# After PR approval
git checkout main
git merge hotfix/description
git push origin main

# Backport to staging
git checkout staging
git merge main
git push origin staging
```

## Vercel Configuration

### Branch Configuration

Configured in `vercel.json`:

```json
{
  "git": {
    "deploymentEnabled": {
      "main": true,
      "staging": false  // Handled by GitHub Actions
    }
  }
}
```

Note: Staging deployments are handled by GitHub Actions to enable custom domain aliasing.

### Domain Configuration

Set up in Vercel dashboard:

- **Production**: www.becomingdiamond.com (assigned to `main` branch)
- **Staging**: staging.becomingdiamond.com (assigned via GitHub Actions)

## Monitoring and Logs

### GitHub Actions

View deployment status:
- Repository → Actions tab
- Click on workflow run for detailed logs

### Vercel Dashboard

View deployment logs:
- Visit https://vercel.com/team-diamond-9c4b1eca/becoming-diamond-nextjs
- Click on deployment for logs

### Axiom Logs

View application logs:
- Staging: Dataset `becoming-diamond-staging`
- Production: Dataset `becoming-diamond-prod`

## Rollback Procedure

### Automatic Rollback (Vercel)

If deployment fails, Vercel automatically keeps the previous version live.

### Manual Rollback

1. **Via Vercel Dashboard**:
   - Go to Deployments
   - Find previous successful deployment
   - Click "Promote to Production"

2. **Via CLI**:
   ```bash
   vercel rollback www.becomingdiamond.com
   ```

3. **Via Git**:
   ```bash
   git revert <commit-hash>
   git push origin main
   ```

## Testing

### Local Testing

```bash
npm run dev          # Start dev server
npm run test         # Run all tests
npm run test:e2e     # Run E2E tests locally
```

### Testing Staging

```bash
BASE_URL=https://staging.becomingdiamond.com npm run test:e2e
```

### Testing Production

```bash
BASE_URL=https://www.becomingdiamond.com npm run test:e2e
```

## Troubleshooting

### Deployment fails with "Module not found"

Ensure `vercel.json` has correct `installCommand`:
```json
"installCommand": "npm install --legacy-peer-deps"
```

### OAuth redirect loops

Verify `NEXTAUTH_URL` matches deployment URL exactly:
- Staging: `https://staging.becomingdiamond.com`
- Production: `https://www.becomingdiamond.com`

### Environment variables not updating

1. Update `.env.staging` or `.env.production`
2. Run upload script:
   ```bash
   bash scripts/upload-env-to-vercel.sh preview .env.staging
   ```
3. Redeploy:
   ```bash
   git push origin staging --force
   ```

### GitHub Actions failing

Check:
1. All required secrets are set
2. Vercel token is valid
3. Vercel project is linked

## Best Practices

1. **Always test on staging first** before deploying to production
2. **Use feature branches** for development
3. **Keep staging and main in sync** - merge staging into main regularly
4. **Never force push to main** - use proper git workflow
5. **Monitor Axiom logs** after deployment for errors
6. **Run E2E tests locally** before pushing to staging

## Scripts Reference

- `scripts/setup-cicd.sh` - Initial CI/CD setup
- `scripts/upload-env-to-vercel.sh` - Upload environment variables
- `.github/workflows/ci.yml` - CI pipeline
- `.github/workflows/deploy-staging.yml` - Staging deployment
- `.github/workflows/deploy-production.yml` - Production deployment

## Security Notes

1. **Never commit** `.env.staging`, `.env.production`, `.env.local`, or `.env.agent`
2. **Rotate secrets** regularly (every 90 days)
3. **Use environment-specific OAuth apps** for staging and production
4. **Review Vercel access logs** monthly
5. **Enable 2FA** on all service accounts (Vercel, GitHub, Turso)

## Support

For CI/CD issues:
1. Check GitHub Actions logs
2. Check Vercel deployment logs
3. Review this documentation
4. Check `.env.agent` configuration
5. Verify all CLI tools are authenticated
