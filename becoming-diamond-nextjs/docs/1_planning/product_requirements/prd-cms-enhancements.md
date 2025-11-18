# PRD: Decap CMS Integration Enhancements

**Status:** Draft
**Priority:** Medium
**Estimated Effort:** 3-5 days
**Current Implementation:** 95% Complete
**Target Completion:** 100%

## Executive Summary

The Decap CMS integration is production-ready with all core functionality operational. This PRD addresses the remaining 5% of functionality needed to achieve full production maturity, focusing on testing infrastructure, configuration hardening, and editorial workflow improvements.

## Background

### Current State
- Decap CMS v3.8.4 fully integrated with GitHub backend
- 5 content collections actively used (news, blog, pages, sprint, settings)
- 39 markdown files managed across 8 content directories
- GitHub OAuth authentication working
- Content API serving 20+ integration points
- Zero automated test coverage for CMS functionality

### Problem Statement
While the CMS is functional, it lacks:
1. Automated testing to prevent regressions
2. Production-ready configuration management
3. Editorial workflow for content review
4. Content preview capabilities
5. Performance optimizations for media

## Goals and Non-Goals

### Goals
1. Achieve 80%+ test coverage for CMS-critical paths
2. Harden production deployment process
3. Improve content editor experience
4. Optimize media handling
5. Add content preview functionality

### Non-Goals
- Migrating from Decap CMS to another platform
- Adding user-generated content (out of scope)
- Building custom CMS UI (using Decap's interface)
- Real-time collaborative editing

## Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Test Coverage (CMS features) | 0% | 80% |
| Production Deployment Issues | Unknown | 0 |
| Content Preview Capability | No | Yes |
| Media Optimization | No | Yes |
| Editorial Workflow | No | Basic |
| Editor Onboarding Time | Unknown | <30 min |

## Requirements

### 1. Testing Infrastructure (HIGH PRIORITY)

#### 1.1 Content API Unit Tests
**Priority:** P0 (Critical)

**Acceptance Criteria:**
- [ ] Unit tests for `getContentByType()` covering:
  - Published/unpublished filtering
  - Date sorting
  - Empty directory handling
  - Invalid frontmatter handling
- [ ] Unit tests for `getContentBySlug()` covering:
  - Valid slug retrieval
  - Non-existent slug handling
  - Markdown parsing errors
- [ ] Unit tests for video placeholder replacement
- [ ] Tests for `getSprintDays()` and `getSprintDay()`
- [ ] Mock file system for deterministic testing
- [ ] 80%+ code coverage for src/lib/content.ts

**Technical Approach:**
```typescript
// Example test structure
describe('getContentByType', () => {
  it('should filter unpublished items', async () => {
    // Mock file system with published: false
    const result = await getContentByType('news');
    expect(result).not.toContain(unpublishedItem);
  });

  it('should sort by date descending', async () => {
    const result = await getContentByType('news');
    expect(result[0].frontmatter.date).toBeGreaterThan(result[1].frontmatter.date);
  });
});
```

**Dependencies:**
- Vitest or Jest test framework
- Mock file system library (memfs or mock-fs)

**Estimated Effort:** 1 day

#### 1.2 OAuth Integration Tests
**Priority:** P0 (Critical)

**Acceptance Criteria:**
- [ ] Integration test for GitHub OAuth initiation flow
- [ ] Test for token exchange with mocked GitHub API
- [ ] Test for callback postMessage communication
- [ ] Error handling tests (invalid provider, missing code, API failures)
- [ ] Environment variable validation tests

**Technical Approach:**
```typescript
describe('OAuth Flow', () => {
  it('should redirect to GitHub with correct params', async () => {
    const response = await GET(mockRequest);
    expect(response.headers.get('Location')).toContain('github.com/login/oauth/authorize');
  });

  it('should exchange code for token', async () => {
    // Mock GitHub API responses
    const response = await POST(mockRequest);
    expect(response.json()).resolves.toHaveProperty('token');
  });
});
```

**Dependencies:**
- MSW (Mock Service Worker) for API mocking
- Next.js test utilities

**Estimated Effort:** 1 day

#### 1.3 E2E CMS Admin Tests (Optional)
**Priority:** P2 (Nice to have)

**Acceptance Criteria:**
- [ ] Playwright test for admin login flow
- [ ] Test for creating new content item
- [ ] Test for editing existing content
- [ ] Test for media upload

**Estimated Effort:** 1 day

### 2. Production Configuration Hardening (HIGH PRIORITY)

#### 2.1 Environment-Specific Configuration
**Priority:** P0 (Critical)

**Acceptance Criteria:**
- [ ] Create config template generator script
- [ ] Validate GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET at build time
- [ ] Add runtime config validation middleware
- [ ] Document environment variable requirements in .env.example
- [ ] Add config validation to prebuild script

**Technical Approach:**
```typescript
// scripts/validate-cms-config.ts
const requiredEnvVars = [
  'GITHUB_CLIENT_ID',
  'GITHUB_CLIENT_SECRET',
];

for (const varName of requiredEnvVars) {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
}

// Validate public/admin/config.yml
const config = yaml.load(fs.readFileSync('public/admin/config.yml'));
if (config.backend.repo === 'owner/repo') {
  throw new Error('CMS config.yml still contains placeholder repo value');
}
```

**Files to Modify:**
- .env.example (add CMS variables)
- package.json (add validate-cms-config to prebuild)
- public/admin/config.yml (add comments for required updates)

**Estimated Effort:** 0.5 days

#### 2.2 Repository Configuration Automation
**Priority:** P1 (Important)

**Acceptance Criteria:**
- [ ] Add setup script to auto-detect GitHub repo
- [ ] Update config.yml with detected repo during setup
- [ ] Validate OAuth callback URLs match deployment environment
- [ ] Add deployment checklist to documentation

**Technical Approach:**
```bash
# scripts/setup-cms.sh
REPO=$(git config --get remote.origin.url | sed 's/.*github.com[:/]\(.*\)\.git/\1/')
BASE_URL=${1:-http://localhost:3000}

# Update config.yml
sed -i '' "s|repo: owner/repo|repo: $REPO|" public/admin/config.yml
sed -i '' "s|base_url: .*|base_url: $BASE_URL|" public/admin/config.yml

echo "CMS configured for repo: $REPO"
echo "Base URL set to: $BASE_URL"
```

**Estimated Effort:** 0.5 days

### 3. Content Preview Mode (MEDIUM PRIORITY)

#### 3.1 Unpublished Content Preview
**Priority:** P1 (Important)

**Acceptance Criteria:**
- [ ] Add preview mode flag to Next.js
- [ ] Create preview API route for authentication
- [ ] Modify content API to include unpublished items in preview mode
- [ ] Add preview banner to indicate draft content
- [ ] Implement exit preview functionality

**Technical Approach:**
```typescript
// src/app/api/preview/route.ts
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  const slug = request.nextUrl.searchParams.get('slug');

  if (secret !== process.env.PREVIEW_SECRET) {
    return new NextResponse('Invalid token', { status: 401 });
  }

  // Enable preview mode
  const response = NextResponse.redirect(new URL(slug, request.url));
  response.cookies.set('__prerender_bypass', '1');
  return response;
}

// src/lib/content.ts - modify to respect preview mode
export async function getContentByType(type: string, preview = false): Promise<ContentItem[]> {
  // ...existing code...

  // Only filter unpublished in non-preview mode
  return items.filter((item) => preview || item.frontmatter.published !== false);
}
```

**Files to Create:**
- src/app/api/preview/route.ts
- src/app/api/preview/exit/route.ts
- src/components/PreviewBanner.tsx

**Files to Modify:**
- src/lib/content.ts (add preview parameter)
- src/app/news/[slug]/page.tsx (use preview mode)

**Estimated Effort:** 1 day

#### 3.2 CMS Preview Templates
**Priority:** P2 (Nice to have)

**Acceptance Criteria:**
- [ ] Register preview templates in config.yml
- [ ] Create preview template for news collection
- [ ] Create preview template for blog collection
- [ ] Style preview to match production rendering

**Estimated Effort:** 1 day

### 4. Media Optimization (MEDIUM PRIORITY)

#### 4.1 Image Optimization Pipeline
**Priority:** P1 (Important)

**Acceptance Criteria:**
- [ ] Replace CMS-uploaded images with Next.js Image component
- [ ] Auto-convert uploads to WebP/AVIF
- [ ] Generate responsive image sizes
- [ ] Add image compression on upload
- [ ] Update content rendering to use optimized images

**Technical Approach:**
```typescript
// src/components/OptimizedContent.tsx
import Image from 'next/image';

export function OptimizedContent({ html }: { html: string }) {
  // Parse HTML and replace <img> with Next.js Image
  const optimized = html.replace(
    /<img src="([^"]+)" alt="([^"]*)"[^>]*>/g,
    (match, src, alt) => {
      // Return placeholder that React will replace
      return `<img data-optimized-src="${src}" alt="${alt}" />`;
    }
  );

  // Use dangerouslySetInnerHTML with post-processing
  // Or use proper HTML parser like htmlparser2
}
```

**Alternative Approach:**
- Integrate Cloudinary or Imgix for automatic optimization
- Update config.yml to use media library integration

**Estimated Effort:** 1.5 days

#### 4.2 Media Library Management
**Priority:** P2 (Nice to have)

**Acceptance Criteria:**
- [ ] Add media library view to CMS
- [ ] Enable image search/filtering
- [ ] Add image metadata editing
- [ ] Implement unused media cleanup

**Estimated Effort:** 1 day

### 5. Editorial Workflow (LOW PRIORITY)

#### 5.1 Draft/Review/Publish States
**Priority:** P2 (Nice to have)

**Acceptance Criteria:**
- [ ] Enable editorial workflow in config.yml
- [ ] Configure workflow states (draft → review → ready → published)
- [ ] Set up GitHub PR-based publishing
- [ ] Add workflow status badges in CMS UI

**Technical Approach:**
```yaml
# public/admin/config.yml
publish_mode: editorial_workflow
collections:
  - name: "news"
    # ... existing config ...
    # New workflow automatically creates PRs for review
```

**Dependencies:**
- GitHub repository write access for editors
- Protected main branch with PR reviews

**Estimated Effort:** 0.5 days

#### 5.2 Content Validation Rules
**Priority:** P2 (Nice to have)

**Acceptance Criteria:**
- [ ] Add field validation rules to config.yml
- [ ] Validate image dimensions for thumbnails
- [ ] Enforce character limits on descriptions
- [ ] Require tags for categorization
- [ ] Add custom validation widgets

**Example:**
```yaml
fields:
  - label: "Description"
    name: "description"
    widget: "text"
    required: true
    pattern: ['.{50,300}', "Must be between 50-300 characters"]
  - label: "Thumbnail"
    name: "thumbnail"
    widget: "image"
    required: true
    media_library:
      config:
        max_file_size: 2048000  # 2MB
```

**Estimated Effort:** 0.5 days

### 6. Documentation Improvements (LOW PRIORITY)

#### 6.1 Editor User Guide
**Priority:** P2 (Nice to have)

**Acceptance Criteria:**
- [ ] Create step-by-step content creation guide
- [ ] Document each collection's field schema
- [ ] Add screenshots of CMS interface
- [ ] Create video walkthrough (optional)
- [ ] Document markdown syntax and special features (video placeholders)

**Deliverables:**
- docs/guides/cms-editor-guide.md
- docs/guides/content-best-practices.md
- docs/guides/cms-video-integration.md

**Estimated Effort:** 1 day

#### 6.2 Deployment Documentation
**Priority:** P1 (Important)

**Acceptance Criteria:**
- [ ] Document production deployment checklist
- [ ] Add environment-specific configuration guide
- [ ] Create troubleshooting guide for common CMS issues
- [ ] Document OAuth setup for production domains

**Deliverables:**
- docs/deployment/cms-production-setup.md
- docs/deployment/cms-troubleshooting.md

**Estimated Effort:** 0.5 days

## Technical Specifications

### Test Framework Setup

```json
// package.json additions
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test"
  },
  "devDependencies": {
    "vitest": "^1.0.0",
    "@vitest/ui": "^1.0.0",
    "memfs": "^4.0.0",
    "msw": "^2.0.0",
    "@playwright/test": "^1.40.0"
  }
}
```

### Environment Variable Schema

```bash
# .env.example additions

# Decap CMS Configuration
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret

# Preview Mode
PREVIEW_SECRET=random_secret_for_preview_access

# Optional: Media Optimization
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Config Validation Script

```typescript
// scripts/validate-cms.ts
import fs from 'fs';
import yaml from 'yaml';
import path from 'path';

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateCMSConfig(): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
  };

  // Check environment variables
  const requiredEnv = ['GITHUB_CLIENT_ID', 'GITHUB_CLIENT_SECRET'];
  for (const envVar of requiredEnv) {
    if (!process.env[envVar]) {
      result.errors.push(`Missing required environment variable: ${envVar}`);
      result.valid = false;
    }
  }

  // Check config.yml
  const configPath = path.join(process.cwd(), 'public/admin/config.yml');
  if (!fs.existsSync(configPath)) {
    result.errors.push('CMS config file not found: public/admin/config.yml');
    result.valid = false;
    return result;
  }

  const config = yaml.parse(fs.readFileSync(configPath, 'utf8'));

  // Validate backend config
  if (config.backend?.repo === 'owner/repo') {
    result.errors.push('CMS config.yml contains placeholder repo value. Update with actual GitHub repository.');
    result.valid = false;
  }

  if (config.backend?.base_url?.includes('localhost') && process.env.NODE_ENV === 'production') {
    result.warnings.push('CMS config uses localhost base_url in production environment');
  }

  // Check CMS bundle
  const bundlePath = path.join(process.cwd(), 'public/admin/decap-cms.js');
  if (!fs.existsSync(bundlePath)) {
    result.errors.push('Decap CMS bundle not found. Run "npm run prebuild" to copy bundle.');
    result.valid = false;
  }

  return result;
}

// Run validation
const result = validateCMSConfig();

if (result.errors.length > 0) {
  console.error('❌ CMS Configuration Errors:');
  result.errors.forEach(err => console.error(`  - ${err}`));
}

if (result.warnings.length > 0) {
  console.warn('⚠️  CMS Configuration Warnings:');
  result.warnings.forEach(warn => console.warn(`  - ${warn}`));
}

if (result.valid) {
  console.log('✅ CMS configuration is valid');
} else {
  process.exit(1);
}
```

## Implementation Phases

### Phase 1: Critical Foundation (2 days)
**Goal:** Ensure production stability and prevent regressions

- [ ] 1.1 Content API Unit Tests (P0)
- [ ] 1.2 OAuth Integration Tests (P0)
- [ ] 2.1 Environment-Specific Configuration (P0)
- [ ] 2.2 Repository Configuration Automation (P1)

**Deliverables:**
- 80% test coverage for content.ts
- Full OAuth flow test coverage
- Automated config validation
- Setup script for new deployments

### Phase 2: User Experience (2 days)
**Goal:** Improve editor experience and content preview

- [ ] 3.1 Unpublished Content Preview (P1)
- [ ] 4.1 Image Optimization Pipeline (P1)
- [ ] 6.2 Deployment Documentation (P1)

**Deliverables:**
- Preview mode for unpublished content
- Optimized image rendering
- Production deployment guide

### Phase 3: Polish & Enhancement (1-2 days - Optional)
**Goal:** Add nice-to-have features

- [ ] 1.3 E2E CMS Admin Tests (P2)
- [ ] 3.2 CMS Preview Templates (P2)
- [ ] 4.2 Media Library Management (P2)
- [ ] 5.1 Draft/Review/Publish States (P2)
- [ ] 5.2 Content Validation Rules (P2)
- [ ] 6.1 Editor User Guide (P2)

**Deliverables:**
- E2E test coverage
- Enhanced CMS UI
- Editorial workflow
- Comprehensive documentation

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Breaking existing CMS functionality during refactor | Medium | High | Comprehensive test coverage before changes |
| OAuth configuration issues in production | Low | High | Automated config validation, detailed docs |
| Performance degradation from image optimization | Low | Medium | Benchmark before/after, use CDN |
| Editor confusion with new preview mode | Low | Low | Clear documentation, training materials |
| Test maintenance overhead | Medium | Low | Keep tests focused, use good abstractions |

## Dependencies

### External Dependencies
- GitHub OAuth App (already configured)
- Git repository access (already granted)
- Decap CMS v3.8.4 (already installed)

### Internal Dependencies
- Next.js 15.5.3
- Content rendering pipeline
- Existing OAuth implementation

### New Dependencies Required
```json
{
  "devDependencies": {
    "vitest": "^1.0.0",
    "@vitest/ui": "^1.0.0",
    "memfs": "^4.0.0",
    "msw": "^2.0.0",
    "@playwright/test": "^1.40.0"
  }
}
```

## Open Questions

1. **Image Optimization Strategy**: Should we use built-in Next.js image optimization or integrate a third-party CDN (Cloudinary/Imgix)?
   - **Recommendation**: Start with Next.js Image component, migrate to CDN if performance issues arise

2. **Editorial Workflow**: Do content editors need PR-based review workflow, or is direct publishing acceptable?
   - **Recommendation**: Start without editorial workflow, add if multiple editors require it

3. **Test Coverage Target**: Is 80% coverage for CMS features sufficient, or should we aim higher?
   - **Recommendation**: 80% is sufficient for current scale, focus on critical paths

4. **Preview Mode**: Should preview require authentication, or use shared secret?
   - **Recommendation**: Use shared secret for simplicity, add auth if security concerns arise

## Success Criteria

This PRD will be considered complete when:
- ✅ All P0 (Critical) requirements are implemented and tested
- ✅ Test coverage for CMS features reaches 80%
- ✅ Production deployment process is documented and validated
- ✅ Zero critical bugs in CMS functionality
- ✅ Editor can preview unpublished content
- ✅ Images from CMS are optimized for web delivery

## Appendix

### A. Current CMS Statistics
- **Total Collections:** 5
- **Total Content Items:** 39
- **Integration Points:** 20+
- **Dependencies:** 1 (decap-cms@3.8.4)
- **Test Coverage:** 0%
- **Production Deployments:** Unknown

### B. Related Documentation
- docs/guides/cms-setup.md - Initial setup instructions
- CLAUDE.md - Architecture documentation
- public/admin/config.yml - CMS configuration
- src/lib/content.ts - Content API implementation

### C. Reference Implementation
See existing CMS integrations:
- News collection: src/app/news/
- Blog collection: src/app/blog/
- Sprint collection: src/app/api/sprint/
- Legal pages: src/app/legal/

### D. Future Considerations
Items not in current scope but worth tracking:
- Multi-language content support
- Content scheduling/embargoes
- Advanced search with Algolia/Meilisearch
- Content analytics and insights
- Automated content migration tools
- GraphQL API for content
