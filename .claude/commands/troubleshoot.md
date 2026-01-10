# Troubleshoot - Production Debugging Workflow

Systematically investigate and resolve production issues using available monitoring tools.

## Usage

```
/troubleshoot [issue-description]
```

- `issue-description`: Brief description of the problem (e.g., "login not working", "500 errors on profile")

## Process

### Phase 1: Gather Evidence

#### 1.1 Check Vercel Deployment Status
```bash
# Current deployment status
vercel ls 2>&1 | head -10

# Recent deployment details
vercel inspect $(vercel ls 2>&1 | grep "Ready" | head -1 | awk '{print $2}') 2>&1 | head -30
```

#### 1.2 Check Vercel Logs for Errors
```bash
# Recent production logs
vercel logs https://www.becomingdiamond.com --output=short 2>&1 | tail -50

# Filter for errors specifically
vercel logs https://www.becomingdiamond.com 2>&1 | grep -i "error\|fail\|exception\|500\|401\|403\|404" | tail -30
```

#### 1.3 Check Axiom Logs (if configured)
- Navigate to Axiom dashboard
- Filter by time range of reported issue
- Look for error patterns, stack traces
- Note correlation IDs if present

#### 1.4 Check Environment Variables
```bash
# Verify critical env vars exist
vercel env ls 2>&1 | grep -E "AUTH_|NEXTAUTH_|TURSO_|BUNNY_|STRIPE_"
```

### Phase 2: Identify Root Cause

#### 2.1 Common Issue Patterns

**Authentication Issues:**
- Check `NEXTAUTH_URL` matches production domain exactly
- Verify OAuth client IDs are for production environment
- Check session cookie settings
- Review `/api/auth/` route logs

**Database Issues:**
- Verify `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`
- Check for connection timeouts
- Review recent migrations
- Test database connectivity

**API Errors:**
- Check request/response patterns in logs
- Verify API route handlers exist
- Check for missing environment variables
- Review error messages for clues

**Build/Deploy Issues:**
- Check build logs: `vercel inspect <url>`
- Verify dependencies installed correctly
- Check for TypeScript errors
- Review `vercel.json` configuration

**Video/Media Issues:**
- Verify Bunny Stream credentials
- Check token generation in `/api/video/`
- Review CORS settings
- Test video URLs directly

### Phase 3: Reproduce Locally (if needed)

```bash
# Pull production environment
vercel env pull .env.production-debug

# Run locally with production config
npm run dev

# Test the specific issue
```

### Phase 4: Implement Fix

1. **Identify the fix** based on root cause analysis
2. **Create a hotfix branch** if needed: `git checkout -b hotfix/<issue>`
3. **Implement the fix** with minimal changes
4. **Test locally** before deploying
5. **Deploy using** `/ship-feature` or direct push

### Phase 5: Verify Resolution

```bash
# After deployment, verify fix
vercel logs https://www.becomingdiamond.com --output=short 2>&1 | tail -20

# Monitor for new errors
vercel logs https://www.becomingdiamond.com 2>&1 | grep -i "error" | tail -10
```

## Output Format

```
=== TROUBLESHOOTING: [Issue Description] ===

EVIDENCE GATHERED:
- Deployment: [status]
- Recent errors: [count] in last hour
- Pattern: [error pattern identified]

ROOT CAUSE ANALYSIS:
[Explanation of what's causing the issue]

AFFECTED COMPONENTS:
- [Component 1]
- [Component 2]

RECOMMENDED FIX:
[Step-by-step fix instructions]

VERIFICATION STEPS:
1. [How to verify fix worked]
2. [Additional checks]

PREVENTION:
[How to prevent this issue in future]

===
```

## Common Issues Quick Reference

### OAuth/Auth Loop
1. Check `NEXTAUTH_URL` matches domain exactly (no trailing slash)
2. Verify OAuth redirect URIs in Google Console
3. Check cookie settings for secure/sameSite
4. Review `auth.ts` and `auth.config.ts`

### 500 Errors on API Routes
1. Check Vercel function logs
2. Verify environment variables
3. Check database connectivity
4. Review error handling in route

### Missing Content/404s
1. Verify content files exist in `content/`
2. Check `generateStaticParams` for dynamic routes
3. Rebuild if static content changed
4. Check CMS configuration

### Slow Performance
1. Check for N+1 queries
2. Review component re-renders
3. Check for missing caching
4. Analyze bundle size

## Escalation

If unable to resolve:
1. Document all findings
2. Create detailed bug report
3. Check for similar issues on GitHub
4. Consider rollback if critical

## Notes

- Always check logs before making changes
- Document the issue and fix for future reference
- Notify client if issue affects users significantly
- Consider adding monitoring/alerting for recurring issues
