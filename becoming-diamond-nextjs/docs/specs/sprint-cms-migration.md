# Sprint Content Management Migration to Decap CMS

**Status**: Draft
**Created**: 2025-01-13
**Owner**: Development Team
**Priority**: High

---

## Executive Summary

Migrate the 30-day sprint content management from manually edited markdown files to Decap CMS-managed content. This will enable non-technical content creators to update sprint lessons through a user-friendly interface while maintaining the existing content structure and frontend integration.

---

## Current State

### Content Structure
```
content/
└── sprint/
    ├── day-1.md
    ├── day-2.md
    └── ... (up to day-30.md)
```

### Current Markdown Format
```markdown
---
day: 1
title: "Welcome to the Sprint"
subtitle: "Your Journey Begins"
published: true
duration: "15 minutes"
difficulty: "Beginner"
video: "abc123-video-guid"
---

# Day 1 Content

Lesson content here...
```

### Current Workflow
1. Developer manually creates/edits markdown files in `/content/sprint/`
2. Commit and push changes to GitHub
3. Next.js reads files at build time via `getContentByType('sprint')`
4. Content rendered in `/app/sprint/day/[dayNumber]/page.tsx`

### Pain Points
- Requires technical knowledge (markdown, Git, deployments)
- No content preview before publishing
- Risk of syntax errors breaking builds
- No content approval workflow
- Manual video ID management

---

## Goals

### Primary Goals
1. **Enable Non-Technical Editing**: Content creators can manage sprint lessons through Decap CMS interface
2. **Maintain Data Structure**: Preserve existing frontmatter fields and markdown format
3. **Zero Frontend Changes**: No changes required to sprint pages or content rendering
4. **Git-Based Workflow**: Continue using Git as source of truth (via Decap CMS commits)

### Secondary Goals
1. **Content Preview**: Enable preview of lessons before publishing
2. **Validation**: Ensure required fields are populated
3. **Chronological Organization**: Maintain day 1-30 sequence in CMS
4. **Video Management**: Simplify video ID entry and validation

---

## Proposed Solution

### Architecture Overview

```
Content Creator → Decap CMS UI → GitHub OAuth → Git Commits
                                                      ↓
                                              content/sprint/*.md
                                                      ↓
                                        Next.js Build Process
                                                      ↓
                                          getContentByType('sprint')
                                                      ↓
                                        Sprint Pages (unchanged)
```

### Decap CMS Collection Configuration

**Location**: `/public/admin/config.js`

**Current Configuration** (already implemented):
```javascript
{
  name: 'sprint',
  label: '30 Day Sprint',
  folder: 'content/sprint',
  create: true,
  slug: 'day-{{day}}',
  identifier_field: 'day',
  fields: [
    { label: 'Day Number', name: 'day', widget: 'number', min: 1, max: 30 },
    { label: 'Title', name: 'title', widget: 'string' },
    { label: 'Subtitle', name: 'subtitle', widget: 'string' },
    { label: 'Published', name: 'published', widget: 'boolean', default: true },
    { label: 'Duration (e.g., "15 minutes")', name: 'duration', widget: 'string' },
    { label: 'Difficulty', name: 'difficulty', widget: 'select', options: ['Beginner', 'Intermediate', 'Advanced'] },
    { label: 'Video ID', name: 'video', widget: 'string', required: false },
    { label: 'Body', name: 'body', widget: 'markdown' }
  ]
}
```

### Content Schema Validation

**Required Fields**:
- `day`: Integer (1-30)
- `title`: String
- `subtitle`: String
- `published`: Boolean (default: true)
- `duration`: String (format: "X minutes")
- `difficulty`: Enum ("Beginner", "Intermediate", "Advanced")
- `body`: Markdown content

**Optional Fields**:
- `video`: String (Bunny Stream video GUID)

### Frontend Integration

**No Changes Required**:
- `src/lib/content.ts` already reads from `content/sprint/`
- `getContentByType('sprint')` works with CMS-committed files
- Sprint pages consume content identically

**Existing API** (continues to work):
```typescript
// Fetch all sprint days
const sprintDays = await getContentByType('sprint');

// Fetch specific day
const day5 = await getContentBySlug('sprint', 'day-5');
```

---

## Implementation Plan

### Phase 1: Validation (1 hour)

**Tasks**:
1. ✅ Verify Decap CMS sprint collection is configured (already done)
2. Test creating a new sprint day via CMS
3. Verify Git commits are created correctly
4. Confirm frontend renders CMS-created content

**Acceptance Criteria**:
- Can create "Day 31" test entry via CMS
- Entry appears in `content/sprint/day-31.md`
- Git commit is created with proper message
- Sprint page renders the new content
- Delete test entry after validation

### Phase 2: Content Migration (2-3 hours)

**Option A: No Migration Needed** (Recommended)
- Existing markdown files already match CMS format
- CMS can read and edit existing files directly
- Only create missing days (if any) through CMS

**Option B: Manual Migration** (If content structure differs)
1. Back up existing `content/sprint/` directory
2. For each day 1-30:
   - Open in Decap CMS
   - Verify all fields populate correctly
   - Make any formatting corrections
   - Save (creates Git commit)

**Acceptance Criteria**:
- All 30 sprint days are editable in Decap CMS
- No frontend rendering changes
- All existing content displays correctly
- Git history preserved

### Phase 3: Documentation & Training (1 hour)

**Create Content Creator Guide**:

`docs/content-creator-guide.md`:
```markdown
# Managing Sprint Content

## Accessing Decap CMS
1. Navigate to: https://[your-domain]/admin
2. Click "Login with GitHub"
3. Authorize the application

## Editing a Sprint Day
1. Click "30 Day Sprint" in sidebar
2. Select the day to edit (Day 1, Day 2, etc.)
3. Make your changes:
   - Update title/subtitle
   - Modify lesson content (markdown supported)
   - Change difficulty or duration
   - Add/update video ID
4. Click "Save" (creates draft)
5. Click "Publish" to commit to GitHub

## Creating a New Day
1. Click "30 Day Sprint" → "New 30 Day Sprint"
2. Fill in all required fields
3. Day Number must be unique (1-30)
4. Publish when ready

## Markdown Formatting
- `# Heading 1`
- `## Heading 2`
- `**bold text**`
- `*italic text*`
- `[link text](url)`
- `![image alt](image-url)`

## Video Integration
- Get video GUID from Bunny Stream dashboard
- Paste into "Video ID" field
- Leave empty if day has no video
```

**Acceptance Criteria**:
- Documentation created and reviewed
- Content team trained on CMS usage
- Test workflow completed successfully

### Phase 4: Validation & Rollout (1 hour)

**Pre-Launch Checklist**:
- [ ] All existing sprint days accessible in CMS
- [ ] Test edit + publish workflow (non-prod)
- [ ] Verify Git commits have proper attribution
- [ ] Frontend renders CMS changes correctly
- [ ] Content team completes training
- [ ] Rollback plan documented

**Rollout Plan**:
1. Week 1: Content team uses CMS for minor edits only
2. Week 2: Create 1-2 new sprint days via CMS
3. Week 3: Full adoption for all sprint content updates

**Acceptance Criteria**:
- Content team successfully edits sprint days via CMS
- No production incidents
- Positive feedback from content creators

---

## Content Creator Workflow

### Editing Existing Day

```
1. Access CMS
   https://becomingdiamond.com/admin

2. Navigate to Sprint Collection
   Sidebar → "30 Day Sprint"

3. Select Day to Edit
   Click on "Day X: [Title]"

4. Edit Content
   - Modify fields as needed
   - Use markdown editor for body
   - Preview formatting

5. Save Draft
   Click "Save" button

6. Publish Changes
   Click "Publish" → "Publish now"
   (Creates Git commit)

7. Verify Changes
   Visit /app/sprint/day/X
   (May require cache clear)
```

### Creating New Day

```
1. Access Sprint Collection
   Sidebar → "30 Day Sprint"

2. Create New Entry
   Click "New 30 Day Sprint" button

3. Fill Required Fields
   - Day Number: 1-30 (unique)
   - Title: Lesson title
   - Subtitle: Brief description
   - Duration: "15 minutes"
   - Difficulty: Select from dropdown
   - Video ID: (optional) Bunny Stream GUID
   - Body: Markdown lesson content

4. Publish
   Click "Publish" → "Publish now"

5. Verify
   Check /app/sprint/day/X
```

---

## Technical Considerations

### Git Commit Messages

Decap CMS generates commits like:
```
Create content/sprint/day-15.md
Update content/sprint/day-3.md
Delete content/sprint/day-31.md
```

**Customization** (if needed):
Can configure commit message format in Decap CMS config:
```javascript
backend: {
  name: 'github',
  repo: 'rickhallett/becoming-diamond-nextjs',
  branch: 'main',
  commit_messages: {
    create: 'content: add sprint day {{slug}}',
    update: 'content: update sprint day {{slug}}',
    delete: 'content: remove sprint day {{slug}}',
  }
}
```

### Content Validation

**Client-Side** (Decap CMS):
- Day number: 1-30, required, number
- Title: required, string
- Duration: required, string
- Difficulty: required, select

**Server-Side** (Build):
- Gray-matter parses frontmatter
- TypeScript types validate structure
- Build fails if content malformed

### Preview Functionality

**Current Limitations**:
- Decap CMS preview requires custom React component
- Not included in MVP implementation

**Future Enhancement**:
```javascript
// In config.js
CMS.registerPreviewTemplate('sprint', SprintDayPreview);

// SprintDayPreview.jsx
const SprintDayPreview = ({ entry, widgetFor }) => {
  const data = entry.getIn(['data']).toJS();
  return (
    <div className="sprint-preview">
      <h1>{data.title}</h1>
      <h2>{data.subtitle}</h2>
      <div>{widgetFor('body')}</div>
    </div>
  );
};
```

### Access Control

**Current**:
- Anyone with GitHub OAuth access can edit
- Relies on GitHub repo permissions

**Future Enhancement**:
- Limit CMS access to specific GitHub org/team
- Add approval workflow via GitHub PRs
- Use Decap CMS editorial workflow (draft → review → publish)

### Backup Strategy

**Automated** (Git-based):
- Every CMS change creates Git commit
- Full content history in Git log
- Revert via `git revert <commit>`

**Manual**:
```bash
# Before major content changes
git tag -a sprint-backup-$(date +%Y%m%d) -m "Sprint content backup"
git push origin --tags
```

---

## Testing Plan

### Test Cases

#### TC1: Create New Sprint Day
**Given**: CMS is authenticated
**When**: Create "Day 25" with all required fields
**Then**:
- File created at `content/sprint/day-25.md`
- Git commit message: "Create content/sprint/day-25.md"
- Content visible at `/app/sprint/day/25`

#### TC2: Edit Existing Sprint Day
**Given**: Day 1 exists
**When**: Update title to "New Title"
**Then**:
- File `content/sprint/day-1.md` updated
- Git commit created
- Title changes on `/app/sprint/day/1`

#### TC3: Publish/Unpublish Day
**Given**: Day 10 exists with `published: true`
**When**: Set `published: false` and save
**Then**:
- Frontmatter updated to `published: false`
- Day 10 not visible in sprint list (filtered by `getContentByType`)

#### TC4: Invalid Day Number
**Given**: Creating new sprint day
**When**: Enter day number 31 (> max 30)
**Then**: Validation error prevents saving

#### TC5: Markdown Rendering
**Given**: Editing day content
**When**: Add markdown with headings, bold, links
**Then**: Markdown renders correctly on sprint page

### Performance Testing

**Baseline**:
- Current build time with 30 sprint days: ~X seconds
- Sprint page load time: ~X ms

**Post-Migration**:
- Build time should remain identical (same content source)
- No runtime performance impact (static generation)

---

## Risks & Mitigations

### Risk 1: Content Corruption
**Impact**: High
**Probability**: Low
**Mitigation**:
- Git provides full history and rollback
- Content validation at CMS and build time
- Regular backups via Git tags

### Risk 2: Duplicate Day Numbers
**Impact**: Medium
**Probability**: Low
**Mitigation**:
- Decap CMS `identifier_field: 'day'` warns on duplicates
- File slug pattern `day-{{day}}` prevents file conflicts
- Frontend sorts by day number (handles duplicates gracefully)

### Risk 3: Broken Markdown Links
**Impact**: Low
**Probability**: Medium
**Mitigation**:
- Link checker in CI/CD pipeline
- Content creator training on markdown
- Preview functionality (future enhancement)

### Risk 4: Video ID Errors
**Impact**: Medium
**Probability**: Medium
**Mitigation**:
- Make field optional (won't break page)
- Document correct format (GUID from Bunny Stream)
- Add validation regex (future enhancement)

### Risk 5: CMS Authentication Issues
**Impact**: High
**Probability**: Low
**Mitigation**:
- Fallback to manual Git edits
- Monitor GitHub OAuth app uptime
- Document troubleshooting steps

---

## Success Metrics

### Adoption Metrics
- **Target**: 90% of sprint edits via CMS within 4 weeks
- **Measure**: Compare Git commits from CMS vs manual

### Efficiency Metrics
- **Target**: 50% reduction in time to update sprint content
- **Measure**: Survey content team before/after

### Quality Metrics
- **Target**: Zero build failures due to malformed content
- **Measure**: CI/CD pipeline success rate

### User Satisfaction
- **Target**: 8/10 satisfaction rating from content team
- **Measure**: Survey after 2 weeks of usage

---

## Future Enhancements

### Short-Term (1-2 months)
1. **Rich Preview**: Live preview of sprint day in CMS
2. **Bulk Operations**: Update multiple days at once
3. **Content Templates**: Starter templates for new days
4. **Video Picker**: Browse Bunny Stream videos in CMS

### Medium-Term (3-6 months)
1. **Editorial Workflow**: Draft → Review → Publish states
2. **Content Scheduling**: Schedule day releases
3. **A/B Testing**: Test different lesson versions
4. **Analytics Integration**: Track lesson completion in CMS

### Long-Term (6-12 months)
1. **Multi-Language Support**: Translate sprint days
2. **Versioning**: Track content versions and rollback
3. **AI Assistance**: Suggest content improvements
4. **User Feedback Loop**: Integrate lesson ratings into CMS

---

## Appendix

### Related Documentation
- `/CLAUDE.md` - Project architecture and Decap CMS configuration
- `/docs/specs/video-integration-simplified.md` - Video ID format and usage
- `/public/admin/config.js` - Decap CMS collection configuration
- `/src/lib/content.ts` - Content API implementation

### Reference Links
- [Decap CMS Documentation](https://decapcms.org/docs/)
- [Decap CMS Collections](https://decapcms.org/docs/collection-types/)
- [Markdown Guide](https://www.markdownguide.org/)

### Glossary
- **CMS**: Content Management System
- **Frontmatter**: YAML metadata at top of markdown files
- **GUID**: Globally Unique Identifier (for videos)
- **Slug**: URL-friendly identifier (e.g., "day-5")
- **Git-based CMS**: CMS that commits changes to Git repository

---

## Approval

**Technical Review**: _________________ Date: _______
**Content Team Lead**: _________________ Date: _______
**Product Owner**: _________________ Date: _______

---

**Document Version**: 1.0
**Last Updated**: 2025-01-13
**Next Review**: After Phase 1 Validation
