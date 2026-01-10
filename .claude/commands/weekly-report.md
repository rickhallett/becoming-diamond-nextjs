# Weekly Report - Executive Summary for Product Owner

Generate a comprehensive weekly summary of development work for the product owner (Dugan), formatted for WhatsApp.

## Usage

```
/weekly-report [weeks=1]
```

- `weeks`: Number of weeks to include (default: 1)

## Process

### Step 1: Gather Commit History

```bash
# Get commits from the past week (or specified period)
git log --since="7 days ago" --oneline --no-merges

# Get commit details with dates
git log --since="7 days ago" --format="%h %ad %s" --date=short
```

### Step 2: Analyze Invoices

Check `docs/invoicing/` for invoices created in the time period:
- Sum total hours
- Sum total billing
- List features/work items

### Step 3: Review PRD Progress

Check `docs/planning/prd-index.md` or scan `docs/specs/`:
- PRDs completed this week
- PRDs with progress changes
- New PRDs created

### Step 4: Identify Key Deliverables

Categorize commits into user-facing deliverables:
- New features
- Bug fixes
- Improvements
- Documentation

### Step 5: Generate Report

## Output Format (WhatsApp-Friendly)

```
Hey Dugan! Here's your weekly dev summary:

=== WEEK OF [DATE RANGE] ===

**FEATURES SHIPPED**
- [Feature 1] - [brief description]
- [Feature 2] - [brief description]

**FIXES & IMPROVEMENTS**
- [Fix 1]
- [Fix 2]

**WHAT USERS WILL NOTICE**
- [User-facing impact 1]
- [User-facing impact 2]

**PROJECT STATUS**
- Features Complete: [X]
- In Progress: [Y]
- Planned: [Z]

**BILLING SUMMARY**
- Total Hours: [X] hours
- Total Amount: $[XXX].00
- Invoices: [list invoice numbers]

**NEXT WEEK'S FOCUS**
- [Priority 1]
- [Priority 2]

Everything's running smoothly on the site. Let me know if you have any questions!
```

## Detailed Report (Optional)

For more detailed tracking, also generate `docs/reports/weekly-report-[YYYY-MM-DD].md`:

```markdown
# Weekly Development Report

**Period:** [Start Date] - [End Date]
**Generated:** [Timestamp]

## Summary Statistics

| Metric | Value |
|--------|-------|
| Commits | [count] |
| Files Changed | [count] |
| Hours Worked | [hours] |
| Billing | $[amount] |

## Commits by Day

### [Day 1]
- [commit hash] [message]

### [Day 2]
- [commit hash] [message]

## Features Delivered

### [Feature 1]
- **Status:** Live
- **Commits:** [list]
- **Hours:** [X]

## PRD Progress

| PRD | Start % | End % | Change |
|-----|---------|-------|--------|
| [PRD 1] | 40% | 95% | +55% |

## Invoices This Week

| Date | Invoice # | Hours | Amount |
|------|-----------|-------|--------|
| [date] | INV-[num] | [hrs] | $[amt] |

## Next Week Priorities

1. [Priority 1]
2. [Priority 2]

## Notes

[Any additional context]
```

## When to Use

Run `/weekly-report` to:
- Provide executive visibility to stakeholders
- Track billing across multiple work sessions
- Summarize project progress for planning
- Generate documentation for project records

## Best Practices

- Run every Friday or end of work week
- Compare to previous weeks to show velocity
- Highlight user-facing changes prominently
- Keep WhatsApp version brief and scannable
- Save detailed report for records

## Notes

- Report is non-technical for product owner audience
- Billing sums across all invoices in the period
- Automatically calculates totals from invoice files
- PRD progress tracked if prd-index.md exists
