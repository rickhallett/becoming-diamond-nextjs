# PRD 001-00: Project Foundation and Basic Astro Setup

**Version:** 1.0
**Date:** 2025-10-01
**Parent PRD:** 001-astro-decap-cms-aceternity-integration
**Status:** Ready for Implementation
**Estimated Complexity:** Low
**Duration:** 2-4 hours

---

## 1. Scope

This chunk establishes the foundational Astro project structure with minimal dependencies and configuration. The goal is to create a working Astro project that can be run locally and builds successfully, without any CMS or complex UI components.

### What's Included
- Basic Astro project initialization
- TypeScript configuration
- Tailwind CSS integration
- Basic project structure (directories and core files)
- Simple landing page with static content
- Build and dev scripts
- Git configuration

### What's NOT Included
- Decap CMS integration (saved for chunk 01)
- OAuth authentication (saved for chunk 01)
- Aceternity UI components (saved for chunk 02)
- React integration (saved for chunk 02)
- Animations and particles (saved for chunk 03)
- Vercel deployment (saved for chunk 04)

---

## 2. Requirements

### 2.1 Project Structure
Create the following directory structure:

```
becoming-diamond-astro/
├── public/
│   └── .gitkeep
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   └── .gitkeep
│   │   └── landing/
│   │       └── .gitkeep
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   └── landing.astro
│   ├── styles/
│   │   └── global.css
│   └── lib/
│       └── utils.ts
├── .gitignore
├── astro.config.mjs
├── package.json
├── tsconfig.json
└── tailwind.config.mjs
```

### 2.2 Dependencies (Minimal Set)
```json
{
  "dependencies": {
    "astro": "^5.13.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.3.1"
  },
  "devDependencies": {
    "@astrojs/tailwind": "^6.1.3",
    "tailwindcss": "^4.1.7",
    "typescript": "^5.7.3"
  }
}
```

### 2.3 Configuration Files

**astro.config.mjs:**
```javascript
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  integrations: [tailwind()],
  server: {
    host: true,
    port: 4321,
    allowedHosts: ["localhost", "127.0.0.1"]
  }
});
```

**tsconfig.json:**
```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "strictNullChecks": true,
    "allowImportingTsExtensions": true
  }
}
```

**tailwind.config.mjs:**
```javascript
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        purple: {
          400: '#c084fc',
          600: '#9333ea',
          950: '#4a044e',
        }
      }
    }
  }
}
```

**.gitignore:**
```
# Dependencies
node_modules/

# Build outputs
dist/
.astro/

# Environment variables
.env
.env.local
.env.production

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

### 2.4 Global Styles

**src/styles/global.css:**
```css
:root {
  --background: 0 0% 0%;
  --foreground: 0 0% 100%;
  --purple-primary: 270 70% 60%;
  --purple-light: 270 70% 70%;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: hsl(var(--background));
  color: hsl(var(--foreground));
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

html {
  scroll-behavior: smooth;
}
```

### 2.5 Utility Functions

**src/lib/utils.ts:**
```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 2.6 Basic Layout

**src/layouts/Layout.astro:**
```astro
---
interface Props {
  title: string;
  description?: string;
}

const { title, description = "Aceternity AI - Modern Web Experience" } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="description" content={description} />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>

<style is:global>
  @import '../styles/global.css';
</style>
```

### 2.7 Static Pages

**src/pages/index.astro:**
```astro
---
// Redirect to landing page
return Astro.redirect('/landing', 302);
---
```

**src/pages/landing.astro:**
```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="Aceternity AI">
  <main class="min-h-screen bg-black text-white">
    <!-- Hero Section -->
    <section class="flex items-center justify-center min-h-screen px-4">
      <div class="text-center max-w-2xl mx-auto">
        <h1 class="text-5xl md:text-6xl lg:text-8xl font-bold mb-6">
          Aceternity AI
        </h1>
        <p class="text-lg md:text-xl text-gray-400 mb-8">
          Modern web experiences with elegant design
        </p>
      </div>
    </section>

    <!-- Auth Section Placeholder -->
    <section class="flex items-center justify-center min-h-[50vh] px-4 pb-20">
      <div class="w-full max-w-md">
        <div class="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10">
          <h2 class="text-2xl font-semibold mb-4">Get Started</h2>
          <p class="text-gray-400 mb-6">
            Authentication form will be added in the next phase
          </p>
          <button
            class="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Enter
          </button>
        </div>
      </div>
    </section>
  </main>
</Layout>
```

### 2.8 Package Scripts

**package.json scripts:**
```json
{
  "name": "becoming-diamond-astro",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check"
  }
}
```

---

## 3. Success Criteria

### Testing Checkpoints
1. **Installation**: Run `npm install` without errors
2. **Development Server**: `npm run dev` starts successfully on port 4321
3. **Page Access**: Navigate to `http://localhost:4321` and verify redirect to `/landing`
4. **Landing Page**: Verify static landing page displays with:
   - "Aceternity AI" heading
   - Subtitle text
   - Placeholder auth section with "Enter" button
   - Dark theme applied correctly
   - Purple accent colors visible
5. **Build Process**: `npm run build` completes without errors
6. **TypeScript**: `npm run check` passes with no TypeScript errors
7. **Responsive Design**: Page is viewable on mobile, tablet, and desktop viewports

### Validation
- [ ] Project initializes without errors
- [ ] Dev server runs on localhost:4321
- [ ] Root path redirects to /landing
- [ ] Landing page renders with static content
- [ ] Tailwind classes apply correctly
- [ ] Dark theme is active
- [ ] Purple accent colors are visible
- [ ] Build completes successfully
- [ ] No TypeScript errors
- [ ] No console errors in browser
- [ ] Responsive on all screen sizes

---

## 4. Dependencies

### Prerequisites
- Node.js 18+ installed
- npm/pnpm package manager
- Git installed

### Blocks
- None (this is the foundation)

### Blocked By
- None

---

## 5. Implementation Notes

### Development Principles
1. **Simplicity First**: Use only essential dependencies
2. **Static-First**: No dynamic features in this phase
3. **Type Safety**: Ensure TypeScript is configured correctly from the start
4. **Clean Structure**: Establish clear directory organization for future components

### Testing Approach
- Manual testing only for this phase
- Visual verification of page rendering
- Browser DevTools to check for errors
- Responsive design testing using browser viewport tools

### Common Pitfalls to Avoid
- Don't add React integration yet (that's chunk 02)
- Don't install Decap CMS dependencies (that's chunk 01)
- Don't add complex animations (that's chunk 03)
- Keep the landing page purely static with placeholder content
- Ensure Tailwind is working before proceeding to next chunk

### Defensive Programming
- Validate environment (Node version check in README)
- Use strict TypeScript configuration
- Add proper error boundaries in layout
- Include proper meta tags for SEO foundation

---

## 6. Acceptance Criteria Summary

**This chunk is complete when:**
1. A developer can clone the repo, run `npm install`, and start the dev server
2. The landing page displays static content with dark theme and purple accents
3. The build process completes without errors
4. TypeScript validation passes
5. The project structure matches the specified layout
6. Git is initialized with proper .gitignore

**Ready for Next Chunk:**
Once this foundation is stable and tested, proceed to chunk 01 for Decap CMS integration.

---

**End of PRD 001-00**
