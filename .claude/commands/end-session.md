# End Session - End of Day Workflow

Complete your development session with proper cleanup, documentation, and client communication.

## Usage

```
/end-session [invoice=true|false]
```

- `invoice=true`: Also generate invoice for today's work
- `invoice=false` or omitted: Skip invoice generation

## Process

### Step 1: Ensure Clean Build State
```bash
# Run build to catch any issues
npm run build 2>&1 | tail -30

# If build fails, attempt fixes or document blockers
```

### Step 2: Commit Uncommitted Work

Check for any uncommitted changes:
```bash
git status
```

If changes exist:
1. Review what's uncommitted
2. Create appropriate atomic commits using conventional commit format
3. Ensure all work is captured in version control

### Step 3: Push to Remote

If on a feature branch:
```bash
git push origin <branch-name>
```

If on main and changes are ready:
```bash
git push origin main
```

### Step 4: Verify Deployment (if pushed to main)
```bash
# Wait for Vercel deployment
vercel ls 2>&1 | head -5

# Check for deployment errors
vercel logs https://www.becomingdiamond.com --output=short 2>&1 | tail -10
```

### Step 5: Generate Daily Summary

Run the Dugan summary process:
1. Check today's commits: `git log --since="midnight" --oneline`
2. Review any invoices created today
3. Generate WhatsApp-friendly summary

Output format:
```
Hey Dugan! Here's today's dev update:

**WHAT WAS DONE**
- [Item 1]
- [Item 2]

**WHAT THIS MEANS FOR USERS**
- [Impact 1]
- [Impact 2]

**STATUS**
All changes are live on the site.

**BILLING**
[X] hours today ($XX.00)

Let me know if you have any questions!
```

### Step 6: Generate Invoice (if requested)

If `invoice=true`:
1. Calculate hours worked based on commits and conversation
2. Create invoice at `docs/invoicing/invoice-[YYYY-MM-DD].md`
3. Update `src/app/docs-site/technical/invoicing/page.tsx`
4. Create feature documentation if applicable

### Step 7: Final Commit

Commit any documentation created:
```bash
git add docs/ src/app/docs-site/
git commit -m "docs: add end-of-session documentation and invoice"
git push origin main
```

## Output Format

```
=== SESSION END: [DATE] ===

BUILD STATUS: [passed/failed]

COMMITS TODAY: [count]
- [hash] [message]
- [hash] [message]

DEPLOYMENT: [verified/pending/failed]

DOCUMENTATION:
- Invoice: [created/skipped]
- Feature docs: [created/skipped]

DUGAN SUMMARY:
[WhatsApp message ready to copy]

===
Session complete. See you next time!
```

## When to Use

Run `/end-session` at the end of each development session to:
- Ensure no work is lost
- Verify deployments are successful
- Keep the client informed
- Maintain accurate billing records

## Checklist

Before ending session:
- [ ] All changes committed
- [ ] Build passing
- [ ] Pushed to remote
- [ ] Deployment verified (if applicable)
- [ ] Client summary generated
- [ ] Invoice created (if billable work)

## Notes

- Always run this before closing your terminal
- If build fails, document the issue and notify if critical
- Invoice generation uses $40/hour default rate
- Summary should be non-technical for the product owner
