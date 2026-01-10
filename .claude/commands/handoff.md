# Handoff - Developer Handoff Documentation

Generate comprehensive handoff documentation for transitioning work to another developer or for future reference.

## Usage

```
/handoff [scope=full|session]
```

- `scope=full`: Complete project handoff (default)
- `scope=session`: Current session/in-progress work only

## Process

### Phase 1: Analyze Current State

#### 1.1 Repository Status
```bash
# Current branch and status
git status
git branch -a

# Recent commit history
git log --oneline -20

# Any stashed work
git stash list
```

#### 1.2 In-Progress Work
- Check for uncommitted changes
- Identify feature branches with unmerged work
- Note any TODOs in recent commits

#### 1.3 PRD Status
- Scan `docs/specs/` for active PRDs
- Check `docs/planning/prd-index.md` if exists
- Identify incomplete implementations

### Phase 2: Document System State

#### 2.1 Architecture Overview
Reference existing documentation:
- `CLAUDE.md` - Main architecture reference
- `README.md` - Setup instructions
- `docs/` - Additional documentation

#### 2.2 Active Features
List features by status:
- **Complete**: Shipped and working
- **In Progress**: Partially implemented
- **Planned**: PRD exists, not started

#### 2.3 Known Issues
Document any known bugs or technical debt:
- Open issues
- Workarounds in place
- TODOs in code

### Phase 3: Generate Handoff Document

Create `docs/handoff/handoff-[YYYY-MM-DD].md`:

```markdown
# Developer Handoff

**Date:** [Date]
**Prepared By:** Claude Code
**Project:** Becoming Diamond

---

## Quick Start

1. Clone repository
2. Run `npm install --legacy-peer-deps`
3. Copy `.env.example` to `.env.local` and configure
4. Run `npm run dev` (starts on port 3003)

---

## Current State Summary

### Repository
- **Branch:** [current branch]
- **Last Commit:** [hash] [message]
- **Clean:** [yes/no]

### Deployment
- **Production:** https://www.becomingdiamond.com
- **Status:** [healthy/issues]
- **Last Deploy:** [date/time]

---

## In-Progress Work

### [Feature/Task 1]
**Status:** [percentage]%
**Branch:** [branch name if applicable]
**Files:**
- [file 1]
- [file 2]

**What's Done:**
- [completed item]

**What's Remaining:**
- [remaining item]

**Notes:**
[Any context needed to continue]

---

## Active PRDs

| PRD | Status | Completion | Priority |
|-----|--------|------------|----------|
| [PRD 1] | In Progress | 60% | High |
| [PRD 2] | Not Started | 0% | Medium |

---

## Known Issues

### [Issue 1]
**Severity:** [Critical/High/Medium/Low]
**Description:** [What's wrong]
**Workaround:** [Temporary solution if any]
**Fix Required:** [What needs to be done]

---

## Technical Debt

- [ ] [Debt item 1]
- [ ] [Debt item 2]

---

## Environment Setup

### Required Environment Variables
```
NEXTAUTH_URL=
NEXTAUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
BUNNY_STREAM_LIBRARY_ID=
BUNNY_STREAM_API_KEY=
BUNNY_STREAM_CDN_HOSTNAME=
GMAIL_USER=
GMAIL_APP_PASSWORD=
```

### External Services
| Service | Purpose | Dashboard |
|---------|---------|-----------|
| Vercel | Hosting | vercel.com/dashboard |
| Turso | Database | turso.tech/dashboard |
| Bunny | Video CDN | bunny.net/dashboard |
| Google Cloud | OAuth | console.cloud.google.com |

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `auth.ts` | NextAuth configuration |
| `middleware.ts` | Route protection |
| `CLAUDE.md` | Architecture documentation |
| `src/config/features.ts` | Feature flags |

---

## Recommended Next Steps

1. **Immediate:** [What should be done first]
2. **Short-term:** [Within the week]
3. **Future:** [Longer-term improvements]

---

## Contacts

- **Product Owner:** Michael T Dugan (support@becomingdiamond.com)
- **Developer:** Oceanheart.ai (kai@oceanheart.ai)

---

## Notes

[Any additional context, warnings, or helpful information]
```

### Phase 4: Commit Handoff Document

```bash
git add docs/handoff/
git commit -m "docs: add developer handoff documentation"
git push origin main
```

## Output Format

```
=== HANDOFF DOCUMENT GENERATED ===

Location: docs/handoff/handoff-[date].md

SUMMARY:
- Repository: [clean/uncommitted work]
- In-Progress Features: [count]
- Active PRDs: [count]
- Known Issues: [count]

KEY AREAS REQUIRING ATTENTION:
1. [Priority item 1]
2. [Priority item 2]

HANDOFF READY: [Yes/No - based on completeness]

===
```

## When to Use

Run `/handoff` when:
- Transitioning project to another developer
- Taking extended time off
- Documenting current state for reference
- Onboarding new team members
- Project milestone review

## Best Practices

- Run before any extended absence
- Keep handoff docs in version control
- Reference but don't duplicate existing docs
- Focus on "what's not obvious" information
- Include both technical and business context

## Notes

- Handoff docs are saved to `docs/handoff/` directory
- Previous handoffs are preserved for history
- Links to existing documentation rather than duplicating
- Emphasizes actionable next steps
