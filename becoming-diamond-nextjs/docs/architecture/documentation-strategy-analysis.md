# Documentation Architecture Analysis

**Date**: 2025-11-14
**Status**: Analysis Complete

## Requirements

### Documentation Structure
- **Primary**: Handover guide (user + admin level)
- **Secondary**: Tech specs, reports, proof of work (navigable but not center stage)
- **Access Control**: Protected via NextAuth (only support@becomingdiamond.com)
- **Content Types**:
  - User guides (client + website owner perspective)
  - Admin guides (Decap CMS with working links/examples)
  - Technical specifications
  - Weekly reports
  - Architecture documentation

### Key Constraints
1. Must work seamlessly with Next.js ecosystem
2. NextAuth integration for access control
3. Support for rich documentation (screenshots, videos, interactive examples)
4. Easy to maintain and update
5. Professional presentation for client handover

## Option 1: MkDocs Static Output Served on Next.js Route

### Architecture
```
/docs route in Next.js → serves MkDocs static HTML
MkDocs build → output to public/docs/
Next.js middleware → NextAuth protection on /docs/*
```

### Implementation
```yaml
# mkdocs.yml
site_name: Becoming Diamond Documentation
theme:
  name: material
  features:
    - navigation.tabs
    - navigation.sections
    - toc.integrate

nav:
  - Home: index.md
  - User Guide:
      - Getting Started: user/getting-started.md
      - Sprint Program: user/sprint.md
  - Admin Guide:
      - CMS Overview: admin/cms-overview.md
      - Content Management: admin/content.md
  - Technical:
      - Architecture: tech/architecture.md
      - Deployment: tech/deployment.md
```

### Pros
✅ **Excellent theming**: Material for MkDocs is industry-standard, beautiful
✅ **Fast search**: Built-in full-text search
✅ **Markdown-based**: Easy to write and maintain
✅ **Version control**: Docs in git with code
✅ **No runtime overhead**: Static HTML
✅ **Navigation**: Auto-generated sidebar, breadcrumbs
✅ **Code highlighting**: Excellent syntax highlighting out of box
✅ **Extensions**: Admonitions, tabs, diagrams (Mermaid)

### Cons
❌ **Separate build process**: Must run `mkdocs build` before Next.js
❌ **No dynamic content**: Can't embed live Next.js components
❌ **Authentication complexity**: Must protect static files via middleware
❌ **No interactive examples**: Can't demonstrate actual app features
❌ **Styling disconnect**: Docs look different from main site
❌ **Two systems to maintain**: MkDocs config + Next.js
❌ **Link management**: Links to app features are static, can break

### Setup Complexity
**Medium** (4/10)
- Install MkDocs
- Configure theme
- Add to build pipeline
- Setup middleware protection

### Maintenance
**Low-Medium** (6/10)
- Markdown files easy to update
- But two build systems to manage
- Must rebuild MkDocs on every doc change

### Client Handover Quality
**Good** (7/10)
- Professional Material theme
- But feels separate from main app
- No live examples

---

## Option 2: Next.js Native with Subdomain (docs.becomingdiamond.com)

### Architecture
```
Subdomain: docs.becomingdiamond.com
Same Next.js app, different route tree
/app/docs-site/ → documentation routes
NextAuth middleware → protect entire subdomain
Shared components → consistent styling with main app
```

### Implementation
```typescript
// app/docs-site/layout.tsx
export default function DocsLayout({ children }) {
  return (
    <div className="docs-container">
      <DocsSidebar />
      <main>{children}</main>
    </div>
  );
}

// app/docs-site/user/getting-started/page.tsx
import { VideoDemo } from '@/components/docs/video-demo';

export default function GettingStartedPage() {
  return (
    <DocsPage>
      <h1>Getting Started</h1>

      {/* Live component demo */}
      <InteractiveSprintPreview />

      {/* Embedded video */}
      <VideoDemo src="/docs/videos/login-flow.mp4" />

      {/* Links to actual app routes */}
      <Link href="/app/sprint">Try the Sprint →</Link>
    </DocsPage>
  );
}
```

### Pros
✅ **Fully integrated**: Same codebase, shared components
✅ **NextAuth native**: Built-in authentication, no hacks
✅ **Interactive examples**: Embed live React components
✅ **Dynamic content**: Server components, API data
✅ **Consistent styling**: Same Tailwind theme as main site
✅ **Live links**: Links to app features stay in sync
✅ **Rich media**: Video players, image galleries, interactive demos
✅ **TypeScript**: Full type safety for doc content
✅ **Component reuse**: Use actual UI components in docs
✅ **One build**: Single deployment process
✅ **Search**: Can use Algolia, Fuse.js, or build custom

### Cons
❌ **More code**: Must build doc UI from scratch
❌ **Navigation**: Must implement sidebar, search manually
❌ **Markdown handling**: Need MDX or similar for rich content
❌ **Bundle size**: Docs increase overall app size
❌ **SEO**: Docs are protected, not indexable (but you don't want this anyway)
❌ **Complexity**: More moving parts than static site

### Setup Complexity
**Medium-High** (6/10)
- Build docs UI components
- Setup MDX for content
- Implement navigation
- Configure subdomain routing

### Maintenance
**Medium** (5/10)
- Easy to update (same Next.js workflow)
- Can become complex with many docs
- But benefits from shared component library

### Client Handover Quality
**Excellent** (9/10)
- Feels part of the main product
- Live, interactive examples
- Consistent branding
- Professional and modern

---

## Option 3: Separate Astro Deployment with Starlight Theme

### Architecture
```
Separate repo: becoming-diamond-docs
Astro + Starlight theme
Deploy to: docs.becomingdiamond.com (Vercel/Netlify)
Authentication: Vercel/Netlify password protection OR custom
```

### Implementation
```javascript
// astro.config.mjs
export default defineConfig({
  integrations: [
    starlight({
      title: 'Becoming Diamond Docs',
      sidebar: [
        {
          label: 'User Guide',
          items: [
            { label: 'Getting Started', link: '/user/getting-started/' },
            { label: 'Sprint Program', link: '/user/sprint/' },
          ],
        },
        {
          label: 'Admin Guide',
          items: [
            { label: 'CMS Overview', link: '/admin/cms/' },
          ],
        },
        {
          label: 'Technical',
          collapsed: true,
          items: [
            { label: 'Architecture', link: '/tech/architecture/' },
          ],
        },
      ],
    }),
  ],
});
```

### Pros
✅ **Best docs theme**: Starlight is specifically built for docs
✅ **Blazing fast**: Astro's partial hydration
✅ **SEO optimized**: (though you don't need this)
✅ **Beautiful UI**: Out-of-box professional design
✅ **Auto features**: Search, dark mode, mobile nav, i18n
✅ **Markdown/MDX**: Great content authoring experience
✅ **Component islands**: Can embed interactive demos
✅ **Separation**: Docs completely isolated from main app
✅ **No impact**: Zero effect on main app bundle/performance
✅ **Version control**: Can version docs separately

### Cons
❌ **Separate repo**: Must maintain two codebases
❌ **Separate deployment**: Two deploy pipelines
❌ **Authentication**: No NextAuth, must use alternative:
  - Vercel password protection (basic)
  - Netlify identity (complex)
  - Custom auth layer (overhead)
❌ **No shared code**: Can't reuse Next.js components
❌ **No live examples**: Must use screenshots/videos only
❌ **Link maintenance**: Links to main app can break
❌ **Extra cost**: Separate deployment (minor)
❌ **Context switching**: Different dev environment

### Setup Complexity
**Low-Medium** (5/10)
- Quick Astro + Starlight setup
- But separate repo/deploy pipeline
- Auth is the tricky part

### Maintenance
**Medium** (5/10)
- Easy Markdown editing
- But maintaining two repos
- Must keep screenshots/examples in sync with main app

### Client Handover Quality
**Good** (8/10)
- Professional Starlight theme
- But separate from main product
- No interactive examples

---

## Option 4: Hybrid - Astro Docs in Next.js Monorepo

### Architecture
```
Monorepo structure:
/becoming-diamond-nextjs (main app)
/docs (Astro Starlight site)
/package.json (workspaces)

Deploy:
- Main app: becomingdiamond.com
- Docs: docs.becomingdiamond.com
But share one git repo, coordinate deploys
```

### Implementation
```json
// package.json (root)
{
  "workspaces": [
    "becoming-diamond-nextjs",
    "docs"
  ],
  "scripts": {
    "dev": "concurrently \"npm:dev:*\"",
    "dev:app": "npm run dev --workspace=becoming-diamond-nextjs",
    "dev:docs": "npm run dev --workspace=docs"
  }
}
```

### Pros
✅ **Best of both**: Starlight quality + monorepo benefits
✅ **Single repo**: All code in one place
✅ **Version sync**: Docs versioned with app
✅ **Coordinated deploys**: Deploy both together
✅ **Starlight features**: All the Starlight goodness
✅ **Separation**: Docs don't affect app bundle

### Cons
❌ **Complex setup**: Monorepo configuration
❌ **Two build processes**: Must build both
❌ **Authentication**: Still need non-NextAuth solution
❌ **No shared components**: Can't embed Next.js components
❌ **Learning curve**: Team must know both Astro and Next.js

### Setup Complexity
**High** (7/10)
- Monorepo setup
- Two framework configurations
- Coordinated deployment

### Maintenance
**Medium** (5/10)
- Same repo helps
- But two frameworks to maintain

### Client Handover Quality
**Good** (8/10)
- Professional Starlight
- Versioned with code
- But no live examples

---

## Option 5: Next.js + Contentlayer (Recommended for Your Use Case)

### Architecture
```
Next.js app with Contentlayer for MDX
/docs/content/ → MDX files with frontmatter
Contentlayer → processes to type-safe content
Next.js routes → /app/docs-site/[...slug]/page.tsx
Authentication → NextAuth middleware
Subdomain → docs.becomingdiamond.com
```

### Implementation
```typescript
// contentlayer.config.ts
export const Doc = defineDocumentType(() => ({
  name: 'Doc',
  filePathPattern: `**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: true },
    category: { type: 'enum', options: ['user', 'admin', 'tech'], required: true },
    order: { type: 'number' },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath,
    },
  },
}));

// app/docs-site/[...slug]/page.tsx
import { allDocs } from 'contentlayer/generated';
import { VideoPlayer } from '@/components/video-player';
import { InteractiveDemo } from '@/components/docs/interactive-demo';

export default function DocPage({ params }) {
  const doc = allDocs.find((d) => d.slug === params.slug);

  return (
    <DocsLayout>
      <MDXContent
        code={doc.body.code}
        components={{
          VideoPlayer,
          InteractiveDemo,
          // All your UI components available in MDX!
        }}
      />
    </DocsLayout>
  );
}
```

### Pros
✅ **Best of all worlds**: MDX + Next.js + Components + Type Safety
✅ **Type-safe content**: Contentlayer validates frontmatter
✅ **MDX power**: Markdown with embedded React components
✅ **NextAuth native**: Perfect integration
✅ **Shared components**: Reuse all app components
✅ **Live examples**: Embed working demos
✅ **Single codebase**: Everything together
✅ **Fast**: Build-time processing
✅ **Great DX**: Auto-generated types for all docs
✅ **Flexible**: Custom layouts per doc type
✅ **Search**: Can integrate Algolia/Fuse easily
✅ **Git-based**: All docs in version control

### Cons
❌ **UI from scratch**: Must build nav, sidebar, search
❌ **Learning curve**: Team must learn Contentlayer
❌ **Build complexity**: One more tool in pipeline

### Setup Complexity
**Medium** (5/10)
- Install Contentlayer
- Configure schema
- Build docs UI components
- One-time investment

### Maintenance
**Low** (8/10)
- MDX files easy to edit
- Type safety prevents errors
- Component reuse is easy
- Single deployment

### Client Handover Quality
**Excellent** (10/10)
- Fully integrated with app
- Live, working examples
- Can demonstrate actual features
- Professional and polished
- Links never break (type-safe)

---

## Comparison Matrix

| Criteria | MkDocs + Next.js | Next.js Native | Astro Separate | Astro Monorepo | Next.js + Contentlayer |
|----------|-----------------|----------------|----------------|----------------|----------------------|
| **Setup Effort** | 4/10 | 6/10 | 5/10 | 7/10 | 5/10 |
| **Maintenance** | 6/10 | 5/10 | 5/10 | 5/10 | 8/10 |
| **NextAuth Integration** | 6/10 | 10/10 | 3/10 | 3/10 | 10/10 |
| **Live Examples** | 2/10 | 10/10 | 4/10 | 4/10 | 10/10 |
| **Professional Look** | 8/10 | 7/10 | 9/10 | 9/10 | 9/10 |
| **Component Reuse** | 0/10 | 10/10 | 2/10 | 2/10 | 10/10 |
| **Content Authoring** | 9/10 | 6/10 | 9/10 | 9/10 | 9/10 |
| **Type Safety** | 0/10 | 8/10 | 2/10 | 2/10 | 10/10 |
| **Bundle Impact** | 1/10 | 6/10 | 0/10 | 0/10 | 3/10 |
| **Client Handover** | 7/10 | 9/10 | 8/10 | 8/10 | 10/10 |
| **Overall** | 43/100 | 77/100 | 51/100 | 54/100 | 82/100 |

---

## Recommendation: Next.js + Contentlayer (Option 5)

### Why This Solution Wins

For your specific requirements, **Next.js + Contentlayer** is the clear winner:

1. **NextAuth Integration**: Native, zero friction
   - Only support@becomingdiamond.com can access
   - Uses existing auth infrastructure
   - No hacks or workarounds

2. **Live, Working Examples**: Game-changer for handover
   - Embed actual Sprint component with real data
   - Show working CMS login flow
   - Demonstrate video player in action
   - Client can click through actual features

3. **Consistent Branding**: Professional presentation
   - Same Tailwind theme
   - Same Aceternity UI components
   - Feels like one cohesive product
   - Client sees it as part of the platform, not separate docs

4. **Component Reuse**: Maximum efficiency
   ```mdx
   # Using the Video Player

   Here's how the video player works in the Sprint:

   <VideoPlayer videoId="demo-video" autoplay={false} />

   The player supports:
   - HLS streaming
   - Token-based auth
   - Progress tracking
   ```

5. **Type Safety**: Fewer bugs
   - Frontmatter validated at build time
   - Auto-generated types for all docs
   - TypeScript catches broken links

6. **Easy Maintenance**: Content editors can use MDX
   - Markdown for text
   - Components for interactive parts
   - No context switching

7. **Single Deployment**: Simpler operations
   - One build, one deploy
   - Docs always match code version
   - No sync issues

### Implementation Roadmap

**Phase 1: Foundation (2-3 hours)**
```bash
npm install contentlayer next-contentlayer
```

Configure Contentlayer schema:
```typescript
// contentlayer.config.ts
export const Doc = defineDocumentType(() => ({
  name: 'Doc',
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string' },
    category: {
      type: 'enum',
      options: ['user-guide', 'admin-guide', 'technical', 'reports'],
      required: true
    },
    audience: {
      type: 'enum',
      options: ['client', 'owner', 'developer'],
    },
    order: { type: 'number' },
    featured: { type: 'boolean', default: false },
  },
}));
```

**Phase 2: Docs UI (4-6 hours)**
- Build sidebar navigation
- Create docs layout with Aceternity styling
- Add search (Fuse.js or Algolia)
- Breadcrumbs and TOC

**Phase 3: Content Migration (6-8 hours)**
- Convert existing docs to MDX
- Add interactive examples
- Create video embeds
- Screenshot key flows

**Phase 4: Auth & Deployment (2 hours)**
- Middleware for docs.becomingdiamond.com
- Email whitelist check
- Vercel subdomain config

**Total: ~15-20 hours**

---

## Alternative If Time is Constrained: MkDocs

If you need docs **fast** and polish can come later:

**Use MkDocs Material** for immediate handover, then migrate to Contentlayer later:

1. **Week 1**: MkDocs setup (4 hours)
2. **Weeks 2-4**: Write content in Markdown
3. **Month 2**: Migrate to Contentlayer for interactivity

This gives you:
- Quick initial handover
- Time to write content
- Graceful upgrade path

---

## Decision Framework

Choose **Next.js + Contentlayer** if:
- ✅ You have 15-20 hours for setup
- ✅ Interactive examples are valuable
- ✅ Consistent branding matters
- ✅ You want type safety

Choose **MkDocs** if:
- ✅ You need docs in < 1 week
- ✅ Screenshots are enough (no live demos)
- ✅ Separate look is acceptable

Choose **Astro Starlight** if:
- ✅ Docs will be huge (100+ pages)
- ✅ Performance is critical
- ✅ You don't need NextAuth integration

---

## Final Recommendation

**Primary Choice**: Next.js + Contentlayer on docs.becomingdiamond.com
- Best for your use case
- Worth the upfront investment
- Scales with project growth
- Best client handover experience

**Fallback**: MkDocs Material on /docs route
- If timeline is tight
- Upgrade to Contentlayer later

**Not Recommended**: Separate Astro deployment
- Authentication complexity outweighs benefits
- Maintaining two repos for this use case is overkill
