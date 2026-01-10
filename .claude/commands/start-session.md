# Start Session - Morning Workflow

Begin your development session with a comprehensive status check and priority overview.

## Process

### Step 1: Check System Status
```bash
# Check for any uncommitted work from previous session
git status

# Check recent commits to understand current state
git log --oneline -5
```

### Step 2: Review PRD Status
Run a quick index of all PRDs to see what's in progress:
- Check `docs/planning/prd-index.md` if it exists
- Scan `docs/specs/` for active PRDs
- Identify PRDs marked as "in progress" or "partial"

### Step 3: Check Deployment Health
```bash
# Check recent deployments
vercel ls 2>&1 | head -10

# Check for any production errors (last 20 entries)
vercel logs https://www.becomingdiamond.com --output=short 2>&1 | tail -20 | grep -i "error\|fail" || echo "No recent errors found"
```

### Step 4: Review Today's Priorities

Based on the analysis, present:

1. **Uncommitted Work**: Any staged or unstaged changes that need attention
2. **In-Progress PRDs**: Features currently being implemented
3. **Blocked Items**: Any failing builds or deployments
4. **Recommended Focus**: Suggested priority for the session

## Output Format

```
=== SESSION START: [DATE] ===

SYSTEM STATUS:
- Git: [clean/uncommitted changes]
- Last commit: [hash] [message]
- Branch: [branch name]

DEPLOYMENT STATUS:
- Production: [healthy/issues detected]
- Recent errors: [count or "none"]

PRD STATUS:
- In Progress: [count]
  - [PRD 1]: [percentage]%
  - [PRD 2]: [percentage]%
- Not Started: [count]

RECOMMENDED FOCUS:
1. [Priority 1]
2. [Priority 2]
3. [Priority 3]

Ready to begin? Use TodoWrite to plan your tasks.
===
```

## When to Use

Run `/start-session` at the beginning of each development session to:
- Avoid losing uncommitted work
- Understand current project state
- Identify blockers early
- Set clear priorities for the session

## Notes

- This command is read-only and makes no changes
- If issues are detected, address them before starting new work
- Consider running `/prd-review $INDEX=true` for detailed PRD analysis
