# Deployment Quick Start Guide

## Quick Reference

### Deploy to Staging
```bash
git checkout staging
git merge main  # or commit changes directly
git push origin staging
```
View at: https://staging.becomingdiamond.com

### Deploy to Production
```bash
git checkout main
git merge staging  # after testing
git push origin main
```
View at: https://www.becomingdiamond.com

### Local Development
```bash
npm run dev  # http://localhost:3003
```

## Environment URLs

| Environment | URL | Branch | Auto-Deploy |
|-------------|-----|--------|-------------|
| Local | http://localhost:3003 | any | No |
| Staging | https://staging.becomingdiamond.com | `staging` | Yes |
| Production | https://www.becomingdiamond.com | `main` | Yes |

## Common Tasks

### Update Environment Variables

1. Edit `.env.staging` or `.env.production`
2. Upload to Vercel:
   ```bash
   bash scripts/upload-env-to-vercel.sh preview .env.staging
   bash scripts/upload-env-to-vercel.sh production .env.production
   ```
3. Redeploy to apply changes

### View Deployment Logs

- **GitHub Actions**: Repository → Actions tab
- **Vercel**: https://vercel.com/team-diamond-9c4b1eca/becoming-diamond-nextjs
- **Axiom**: Check `becoming-diamond-staging` or `becoming-diamond-prod` dataset

### Rollback Deployment

**Option 1: Vercel Dashboard**
1. Go to Deployments
2. Find previous successful deployment
3. Click "Promote to Production"

**Option 2: Git Revert**
```bash
git revert <bad-commit-hash>
git push origin main
```

### Run Tests Before Deploy

```bash
npm run lint           # Check code style
npm run test           # Run all tests
npm run test:e2e       # Run E2E tests locally
```

### Feature Branch Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature main

# Work on feature
git add .
git commit -m "feat: add my feature"

# Test on staging first
git checkout staging
git merge feature/my-feature
git push origin staging

# After testing, deploy to production
git checkout main
git merge feature/my-feature
git push origin main

# Clean up
git branch -d feature/my-feature
git push origin --delete feature/my-feature
```

### Hotfix Workflow

```bash
# Create hotfix from production
git checkout -b hotfix/urgent-fix main

# Make fix
git add .
git commit -m "fix: urgent production fix"

# Deploy to production immediately
git checkout main
git merge hotfix/urgent-fix
git push origin main

# Backport to staging
git checkout staging
git merge main
git push origin staging

# Clean up
git branch -d hotfix/urgent-fix
```

## Troubleshooting

### Deployment Failed

1. Check GitHub Actions logs
2. Verify all tests pass locally
3. Check Vercel build logs
4. Verify environment variables are set

### OAuth Not Working

Check that `NEXTAUTH_URL` matches the deployment URL:
- Staging: `https://staging.becomingdiamond.com`
- Production: `https://www.becomingdiamond.com`

### Build Errors

Ensure you're using `--legacy-peer-deps`:
```bash
npm install --legacy-peer-deps
npm run build
```

## CI/CD Status

View workflow status:
- Staging: ![Staging](https://github.com/rickhallett/becoming-diamond-nextjs/actions/workflows/deploy-staging.yml/badge.svg)
- Production: ![Production](https://github.com/rickhallett/becoming-diamond-nextjs/actions/workflows/deploy-production.yml/badge.svg)

## Need Help?

See full documentation: [docs/cicd-pipeline.md](./cicd-pipeline.md)
