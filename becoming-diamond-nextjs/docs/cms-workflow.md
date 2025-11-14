# Decap CMS Workflow Guide

**Date**: 2025-11-14
**Status**: Active

## Overview

This document describes how the Decap CMS works in both development and production environments. The CMS automatically detects which environment it's running in and adjusts its behavior accordingly.

## Environment-Based Workflow

### Automatic Environment Detection

The CMS detects the environment based on hostname:

- **Development** (`localhost` / `127.0.0.1`): Commits to `cms-staging` branch
- **Production** (your live domain): Commits to `main` branch

This is configured in `public/admin/config.js`:

```javascript
// Environment detection
const isProduction = window.location.hostname !== 'localhost' &&
                     window.location.hostname !== '127.0.0.1';

// Branch strategy:
// - Development (localhost): cms-staging (allows safe testing before merge)
// - Production (live domain): main (immediate publishing for content editors)
const targetBranch = isProduction ? 'main' : 'cms-staging';

backend: {
  name: 'github',
  repo: 'rickhallett/becoming-diamond-nextjs',
  branch: targetBranch,  // Automatically switches based on environment
  base_url: window.location.origin,
  auth_endpoint: 'api/cms-auth'
}
```

### Branch Strategy

- **`cms-staging`** - Development testing (local changes only)
- **`main`** - Production content (goes live immediately)

## Production Workflow (Content Editors)

When content editors publish changes on the **live site**:

1. Navigate to `https://your-domain.com/admin`
2. Authenticate with GitHub
3. Create/edit content
4. Click **"Publish"**
5. ✅ Changes commit directly to `main` branch
6. ✅ Site automatically redeploys (Vercel/Netlify)
7. ✅ Changes live in ~2 minutes

**No developer intervention required** - editors can publish immediately.

### Rollback Protection

Even though production publishes immediately, you can rollback any change:

- All changes are tracked in git history
- Quick revert: 30 seconds (see [Rollback Guide](./cms-rollback-guide.md))
- Restore old versions: Any content can be recovered
- Full audit trail: Know who changed what and when

**See**: [`docs/cms-rollback-guide.md`](./cms-rollback-guide.md) for complete rollback procedures

## Development Workflow

### 1. Edit Content via CMS

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3003/admin`

3. Authenticate with GitHub OAuth

4. Create or edit content (e.g., add a new sprint day)

5. Click "Publish" - this commits directly to **`cms-staging`** branch on GitHub

### 2. Pull Changes to Local

Since CMS commits to remote, you must pull to see changes locally:

```bash
# Fetch the CMS commit from GitHub
git pull origin cms-staging

# If not on cms-staging branch, switch to it first:
git checkout cms-staging
git pull origin cms-staging
```

### 3. Test Locally

With the changes pulled, your Next.js dev server will hot-reload:

1. Verify the file was created in the correct location:
   ```bash
   ls -la content/sprint/
   ```

2. Check the file content:
   ```bash
   cat content/sprint/day-XX.md
   ```

3. Test the frontend rendering:
   - Navigate to the appropriate route (e.g., `/app/sprint/day/15`)
   - Verify content displays correctly
   - Check for any layout or rendering issues

4. Test any dependent features:
   - Sprint progress tracking
   - Video player integration
   - Navigation between days

### 4. Merge to Production (When Satisfied)

Once you've verified the changes work correctly:

```bash
# Switch to main branch
git checkout main

# Merge cms-staging into main
git merge cms-staging

# Push to production
git push origin main
```

Your CI/CD pipeline (Vercel, Netlify, etc.) will automatically deploy the changes.

## Quick Reference Commands

### Everyday Testing Flow
```bash
# 1. Edit content in CMS at /admin, click Publish
# 2. Pull changes
git pull origin cms-staging

# 3. Test in dev server at localhost:3003
# 4. If good, merge to main
git checkout main
git merge cms-staging
git push origin main
```

### Check What CMS Changed
```bash
# View commits on cms-staging
git log cms-staging --oneline -5

# See diff between staging and main
git diff main..cms-staging

# View specific file changes
git show cms-staging:content/sprint/day-15.md
```

### Sync Staging with Main (Periodically)
If main has changes that staging doesn't:

```bash
git checkout cms-staging
git merge main
git push origin cms-staging
```

## Troubleshooting

### Issue: Changes Not Showing Locally

**Symptoms**: You published content in CMS but don't see it on localhost

**Solution**:
```bash
# Pull the latest from cms-staging
git pull origin cms-staging

# Verify you're on the right branch
git branch --show-current

# Check if file exists
ls content/sprint/
```

### Issue: CMS Shows Old Content

**Symptoms**: CMS editor shows outdated content or file list

**Solution**: Clear browser cache and reload `/admin` page

### Issue: File Created in Wrong Location

**Symptoms**: CMS creates files outside `becoming-diamond-nextjs/` directory

**Solution**: Verify config has correct folder paths (should include `becoming-diamond-nextjs/` prefix)

```bash
grep -A 3 "folder:" public/admin/config.js
```

### Issue: Merge Conflicts

**Symptoms**: Git reports conflicts when merging cms-staging to main

**Solution**:
```bash
# View conflicting files
git status

# For content files, usually safe to take staging version
git checkout --theirs content/sprint/day-XX.md

# Add resolved files
git add content/sprint/day-XX.md

# Complete the merge
git commit
```

## Advanced: Local Backend (Optional)

For heavy CMS development work, consider setting up local backend mode:

```bash
# Install Decap local backend server
npm install -g decap-server

# Run in separate terminal
npx decap-server

# This allows CMS to commit to local git instead of remote
```

See Decap CMS documentation for local backend setup details.

## Best Practices

1. **Always pull before testing**: CMS commits to remote, you must pull to see changes
2. **Test thoroughly on staging**: Don't merge to main until verified
3. **Keep staging in sync**: Periodically merge main back to cms-staging to avoid drift
4. **Use descriptive CMS commit messages**: They show up in git history
5. **Clean up test content**: Delete test entries before merging to main

## Workflow Comparison

| Aspect | Development (localhost) | Production (live site) |
|--------|------------------------|----------------------|
| **Target Branch** | `cms-staging` | `main` |
| **Publish Speed** | Manual merge required | Immediate (2 min deploy) |
| **Testing** | Pull and test locally | Live immediately |
| **Risk** | Zero (isolated testing) | Low (rollback available) |
| **Best For** | New features, bulk changes, testing | Day-to-day content updates |

## Key Benefits

✅ **Development Safety**: Test CMS changes locally without affecting production
✅ **Production Speed**: Content editors can publish immediately
✅ **Rollback Ready**: All changes tracked in git, easy to revert
✅ **No Configuration**: Environment detection is automatic
✅ **Clear Separation**: Development testing vs. production publishing

## Support Scenarios

### Scenario 1: Content Editor Makes a Mistake

**Problem**: Editor accidentally publishes wrong content to production

**Solution**: Use git revert (30 seconds)

```bash
git revert HEAD --no-edit
git push origin main
```

**See**: [Rollback Guide - Quick Revert](./cms-rollback-guide.md#quick-revert-last-commit)

### Scenario 2: Need to Test Major Content Restructure

**Problem**: Planning to restructure sprint content, want to test first

**Solution**: Use development workflow

1. Test on `localhost:3003/admin` (writes to `cms-staging`)
2. Pull and verify: `git pull origin cms-staging`
3. Test thoroughly on local dev server
4. Merge when ready: `git merge cms-staging`

### Scenario 3: Urgent Content Fix Needed

**Problem**: Production has error, need immediate fix

**Solution**: Use production CMS for speed

1. Editor logs into `your-domain.com/admin`
2. Makes fix and publishes
3. Live in ~2 minutes
4. If fix causes issues, revert immediately

## Related Documentation

- **[CMS Rollback Guide](./cms-rollback-guide.md)** - Complete rollback procedures and recovery strategies
- `/docs/cms-config-sprint-slug-fix.md` - CMS path configuration details
- `/docs/specs/sprint-cms-migration.md` - Sprint CMS migration plan
- `public/admin/config.js` - CMS configuration file
- [Decap CMS Documentation](https://decapcms.org/docs/)
