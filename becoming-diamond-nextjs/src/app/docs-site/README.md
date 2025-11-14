# Documentation Site - Developer Guide

## Overview

This is the documentation site for Becoming Diamond, built with Next.js and protected by NextAuth. Only `support@becomingdiamond.com` can access these docs.

## Structure

```
app/docs-site/
├── layout.tsx              # Main layout with sidebar
├── page.tsx                # Documentation homepage
├── user/                   # User-facing guides
│   ├── getting-started/
│   └── sprint-program/
├── admin/                  # Admin/CMS guides
│   ├── cms-overview/
│   └── sprint-management/
└── technical/              # Technical documentation
    ├── architecture/
    ├── reports/
    └── specs/
```

## Adding a New Page

### 1. Create the Page File

Create a new `page.tsx` file in the appropriate directory:

```typescript
// app/docs-site/admin/new-feature/page.tsx
import { DocsPage } from "@/components/docs/docs-page";
import { FutureEnhancement } from "@/components/docs/future-enhancement";
import Link from "next/link";

export default function NewFeaturePage() {
  return (
    <DocsPage
      title="Your Page Title"
      description="Brief description of what this page covers"
    >
      <h2>Section Heading</h2>
      <p>Your content here...</p>

      {/* Add links to actual features */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 my-4">
        <p className="text-sm text-neutral-400">
          <strong>Try it:</strong>{" "}
          <Link href="/app/feature" className="text-primary hover:underline" target="_blank">
            Open feature →
          </Link>
        </p>
      </div>

      {/* Optional: Add subtle upsell */}
      <FutureEnhancement>
        <p>
          <strong>Future enhancement:</strong> This feature could be expanded to...
        </p>
      </FutureEnhancement>
    </DocsPage>
  );
}
```

### 2. Add to Navigation

Update the navigation in `components/docs/docs-nav.tsx`:

```typescript
const navigation: NavItem[] = [
  // ... existing items
  {
    title: "Admin Guide",
    items: [
      // ... existing items
      {
        title: "New Feature",
        href: "/docs-site/admin/new-feature",
      },
    ],
  },
];
```

### 3. That's It!

The page will automatically:
- ✅ Be protected by NextAuth (support@ only)
- ✅ Use consistent styling
- ✅ Appear in sidebar navigation
- ✅ Support dark mode

## Components Available

### DocsPage

Wrapper for all documentation pages with title and description:

```typescript
<DocsPage
  title="Page Title"
  description="Optional description"
>
  {children}
</DocsPage>
```

### FutureEnhancement

Callout box for subtle upsell opportunities:

```typescript
<FutureEnhancement>
  <p>Future enhancement ideas go here...</p>
</FutureEnhancement>
```

### Code Blocks

Use inline code or code blocks:

```typescript
<code className="px-2 py-1 bg-neutral-900 rounded text-sm">
  npm run dev
</code>
```

### Links to Features

Always link to actual app features when possible:

```typescript
<Link href="/app/sprint" className="text-primary hover:underline" target="_blank">
  Try the Sprint →
</Link>
```

## Adding Screenshots

1. Take screenshot (Cmd+Shift+4 on macOS)
2. Save to `public/docs/screenshots/`
3. Reference in your page:

```typescript
<img
  src="/docs/screenshots/feature-name.png"
  alt="Description of screenshot"
  className="rounded-lg border border-neutral-800 my-6"
/>
```

## Styling Guidelines

### Headings

- `<h2>` for main sections
- `<h3>` for subsections
- Don't use `<h1>` (DocsPage handles this)

### Lists

- Use `<ul>` for unordered lists
- Use `<ol>` for ordered/numbered lists
- Keep list items concise

### Callout Boxes

```typescript
<div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 my-4">
  <p className="text-sm text-neutral-400">
    Important information here
  </p>
</div>
```

### Links

- Internal links: `<Link href="/docs-site/...">`
- External links: Add `target="_blank"`
- Features: Add `target="_blank"` to open in new tab

## Authentication

Pages are automatically protected by NextAuth middleware. Only users with email `support@becomingdiamond.com` can access `/docs-site/*` routes.

No additional configuration needed - it just works!

## Best Practices

### Content Writing

1. **Be concise**: Short paragraphs, clear language
2. **Show, don't just tell**: Link to actual features
3. **Use examples**: Code snippets and screenshots
4. **Be helpful**: Think about what the reader needs

### Upselling

Use `FutureEnhancement` sparingly (1-2 per page max):
- Be subtle, not salesy
- Focus on value, not features
- Position as evolution, not missing features
- Make it contextual (mention where it makes sense)

### Maintenance

- Update screenshots when UI changes
- Keep links to features up to date
- Remove outdated information promptly
- Test all links regularly

## Quick Reference

**Create page**: Add `page.tsx` in appropriate directory
**Add to nav**: Update `components/docs/docs-nav.tsx`
**Add screenshots**: Save to `public/docs/screenshots/`
**Use components**: Import from `@/components/docs/`

That's all you need to know to add documentation pages!
