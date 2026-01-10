# Ship Feature - End-to-End Feature Deployment

Orchestrate the complete shipping of a feature from final validation to production deployment, documentation, and client communication.

## Usage

```
/ship-feature <feature-name> [invoice=true|false]
```

- `feature-name`: Descriptive name of the feature being shipped
- `invoice=true`: Generate invoice for the work (default: true)

## Process

### Phase 1: Pre-Flight Checks

#### 1.1 Verify Clean Working State
```bash
git status
```
- All changes must be committed
- Working tree must be clean
- If uncommitted changes exist, commit them first

#### 1.2 Run Build Validation
```bash
npm run build 2>&1
```
- Build must pass without errors
- Note any warnings for later review

#### 1.3 Run Tests
```bash
npm test 2>&1
```
- All tests must pass
- If tests fail, fix them before proceeding

### Phase 2: Deploy to Production

#### 2.1 Push to Main
```bash
# If on feature branch, merge to main first
git checkout main
git merge <feature-branch>
git push origin main
```

#### 2.2 Monitor Deployment
```bash
# Wait for Vercel to pick up the change
sleep 30

# Check deployment status
vercel ls 2>&1 | head -10
```

#### 2.3 Verify Deployment Health
```bash
# Check for errors in production logs
vercel logs https://www.becomingdiamond.com --output=short 2>&1 | tail -20

# Look for specific errors
vercel logs https://www.becomingdiamond.com 2>&1 | grep -i "error\|fail\|exception" | tail -10
```

### Phase 3: Documentation

#### 3.1 Create Feature Documentation

Create feature doc at `docs/2_architecture_and_specs/feature-<name>-<date>.md`:

```markdown
# <Feature Name>

**Date:** <Date>
**Status:** Live on Production

---

## Summary
[One sentence summary]

---

## Problem
[What issue did this address?]

---

## Solution
[How does it work for users?]

---

## User-Facing Changes
- [Change 1]
- [Change 2]

---

## Technical Implementation

### Files Changed
| File | Description |
|------|-------------|
| [file] | [description] |

---

## Notes
[Any additional context]
```

#### 3.2 Create Invoice (if requested)

Create invoice at `docs/invoicing/invoice-<YYYY-MM-DD>.md` with:
- Itemized hours by task
- Rate: $40.00/hour
- Total calculation

Update `src/app/docs-site/technical/invoicing/page.tsx`:
- Move current invoice to "Previous"
- Add new invoice as "Current"

### Phase 4: Client Communication

#### 4.1 Generate Dugan Summary

Create WhatsApp-friendly summary:

```
Hey Dugan! Just shipped: <Feature Name>

**WHAT'S NEW**
- [User-facing change 1]
- [User-facing change 2]

**STATUS**
Live on the site now.

**BILLING**
[X] hours ($XX.00)

Let me know if you have any questions!
```

### Phase 5: Update Tracking

#### 5.1 Update PRD Status (if applicable)
- Mark related PRD as complete in index
- Update completion percentage

#### 5.2 Final Commit
```bash
git add docs/ src/app/docs-site/
git commit -m "docs: add <feature-name> documentation and invoice"
git push origin main
```

## Output Format

```
=== SHIPPING: <Feature Name> ===

PRE-FLIGHT:
[x] Working tree clean
[x] Build passed
[x] Tests passed

DEPLOYMENT:
[x] Pushed to main
[x] Vercel deployment successful
[x] Production health verified

DOCUMENTATION:
[x] Feature doc created: docs/2_architecture_and_specs/feature-<name>.md
[x] Invoice created: docs/invoicing/invoice-<date>.md
[x] Invoicing page updated

CLIENT COMMUNICATION:
[Ready to send - copy below]

---
Hey Dugan! Just shipped: <Feature Name>
...
---

=== FEATURE SHIPPED SUCCESSFULLY ===
```

## Abort Conditions

Stop the shipping process if:
- Build fails (fix errors first)
- Tests fail (fix tests first)
- Deployment fails (check Vercel logs)
- Production errors detected (investigate before proceeding)

## Rollback

If issues are detected post-deployment:
```bash
# Revert the merge commit
git revert HEAD
git push origin main

# Or restore previous deployment
vercel rollback
```

## Notes

- This command assumes feature is complete and tested locally
- Always verify the feature works in production after shipping
- Keep the client informed of any issues discovered post-deployment
- Invoice generation uses $40/hour default rate
