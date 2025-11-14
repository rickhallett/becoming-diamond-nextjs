# Decap CMS Development Workflow

**Date**: 2025-11-14
**Status**: Active

## Overview

This document describes the workflow for testing Decap CMS changes in a local development environment. Since Decap CMS commits directly to GitHub (bypassing local git), we use a staging branch strategy to safely test content changes before they reach production.

## Branch Strategy

- **`cms-staging`** - CMS writes all content changes here
- **`main`** - Production branch (deploys to live site)

The CMS is configured to commit to `cms-staging` branch instead of `main`, allowing you to test changes locally before merging to production.

## Configuration

The CMS backend is configured in `public/admin/config.js`:

```javascript
backend: {
  name: 'github',
  repo: 'rickhallett/becoming-diamond-nextjs',
  branch: 'cms-staging',  // CMS commits go here
  base_url: window.location.origin,
  auth_endpoint: 'api/cms-auth'
}
```

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

## Related Documentation

- `/docs/cms-config-sprint-slug-fix.md` - CMS path configuration details
- `/docs/specs/sprint-cms-migration.md` - Sprint CMS migration plan
- `public/admin/config.js` - CMS configuration file
- [Decap CMS Documentation](https://decapcms.org/docs/)
