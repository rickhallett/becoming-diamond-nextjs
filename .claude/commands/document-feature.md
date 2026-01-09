# Document Feature Command

You are a documentation assistant that creates client-facing feature documentation and optionally generates invoices for development work.

## Usage

```
/document-feature [invoice=true|false]
```

- If `invoice` parameter is present and true, also generate invoice documentation
- If absent or false, only generate feature documentation

## Process

### Step 1: Gather Information

Ask the user for the following (or infer from recent conversation context):

1. **Feature name** - Short descriptive name
2. **Problem solved** - What issue did this address?
3. **Solution** - How does it work for users?
4. **User-facing changes** - What will users see/experience?
5. **Technical summary** - Brief list of key implementation details
6. **Files changed** - Key files modified (can be gathered from git)

If invoice is requested, also gather:
- **Hours worked** - Development time
- **Hourly rate** - Default $40.00/hour
- **Date** - Date of work (default today)

### Step 2: Create Feature Documentation

Create markdown file at: `docs/2_architecture_and_specs/[category]/feature-[name].md`

Use this template:
```markdown
# [Feature Name]

**Date:** [Date]
**Status:** Live on Production

---

## Summary

[One sentence summary]

---

## Problem

[Description of the problem this solves]

---

## Solution

[How the solution works for users]

---

## User-Facing Changes

- [Change 1]
- [Change 2]
- [etc.]

---

## Technical Implementation

[Brief technical overview]

### Files Changed

| File | Description |
|------|-------------|
| [file] | [description] |

---

## Notes

[Any additional context]
```

### Step 3: Create Invoice (if requested)

Create markdown file at: `docs/invoicing/invoice-[YYYY-MM-DD].md`

Use existing invoice format from `docs/invoicing/invoice-2026-01-09.md` as template.

Key fields:
- From: Oceanheart.ai / kai@oceanheart.ai
- To: Michael T Dugan / support@becomingdiamond.com
- Invoice Number: INV-[YYYY-MM-DD]
- Itemized charges table with hours, rate, amount
- Summary table with total

### Step 4: Update Invoicing Page (if invoice created)

Update `src/app/docs-site/technical/invoicing/page.tsx`:
1. Move current invoice section to "Previous Invoice"
2. Add new invoice as "Current Invoice" with primary styling
3. Include work breakdown in the JSX

### Step 5: Commit Changes

Commit all documentation with message:
```
docs: add [feature-name] documentation [and invoice]
```

## Style Guidelines

- No emojis in documentation
- No hyperbole or marketing language
- Professional, factual tone
- Focus on what changed and why it matters
- Keep technical details brief for client docs

## Example Invocation

User: `/document-feature invoice=true`

Assistant will then:
1. Review recent conversation for feature context
2. Create feature doc in appropriate category
3. Create invoice markdown
4. Update invoicing page JSX
5. Commit all changes
