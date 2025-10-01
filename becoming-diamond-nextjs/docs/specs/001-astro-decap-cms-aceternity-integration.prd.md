# PRD 001: Astro/Decap CMS with Aceternity Components Integration

**Version:** 1.0
**Date:** 2025-10-01
**Project Name:** becoming-diamond-astro
**Status:** Draft

---

## 1. Executive Summary

Create a new Astro-based project that integrates Decap CMS for content management with Aceternity UI components, using the authentication and CMS architecture from `stadotcouk` as a reference. The initial implementation will feature a single home page that is functionally and stylistically equivalent to the Next.js version at `aceternity-demo/src/app/page.tsx` (which redirects to `/landing`), but built entirely with Astro and Astro-compatible component equivalents.

**Core Objective:** Establish a foundational Astro project with:
- Decap CMS integration with GitHub OAuth authentication
- Aceternity-style UI components adapted for Astro
- Server-side rendering capabilities
- A polished landing page with authentication UI
- Vercel deployment configuration

---

## 2. Problem Statement

### Current Issues
1. **Framework Fragmentation**: The ecosystem has both Next.js (`aceternity-demo`) and Astro (`stadotcouk`) projects with different capabilities
2. **Component Reusability**: Aceternity components are React-based and need Astro-compatible versions
3. **CMS Accessibility**: Need a unified approach to content management across Astro projects
4. **Authentication Patterns**: Require consistent auth patterns adapted from the working `stadotcouk` implementation

### Pain Points
- No existing Astro project with Aceternity-style UI components
- Manual content updates without CMS integration
- Inconsistent authentication patterns across projects
- Need for SSR-compatible component architecture

---

## 3. Requirements

### 3.1 User Requirements

**Content Managers:**
- Access Decap CMS admin interface at `/admin`
- Authenticate via GitHub OAuth
- Manage site content through visual editor
- Preview changes before publishing

**End Users:**
- View elegant landing page with smooth animations
- Experience responsive design across devices
- Interact with authentication forms (login/signup)
- Navigate seamlessly without page reloads

### 3.2 Technical Requirements

**Project Structure:**
```
becoming-diamond-astro/
├── public/
│   ├── admin/
│   │   ├── index.html
│   │   ├── config.yml
│   │   └── decap-cms.js (copied in prebuild)
│   └── uploads/ (media storage)
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── sparkles.astro
│   │   │   ├── label.astro
│   │   │   └── input.astro
│   │   └── landing/
│   │       ├── HeroSection.astro
│   │       ├── AuthSection.astro
│   │       └── AuthForm.tsx (React island)
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   └── landing.astro
│   ├── styles/
│   │   └── global.css
│   └── lib/
│       └── utils.ts
├── astro.config.mjs
├── package.json
├── tsconfig.json
└── tailwind.config.mjs
```

**Dependencies:**
```json
{
  "dependencies": {
    "@astrojs/react": "^4.3.0",
    "@astrojs/vercel": "^8.2.7",
    "@tsparticles/engine": "^3.9.1",
    "@tsparticles/react": "^3.0.0",
    "@tsparticles/slim": "^3.9.1",
    "astro": "^5.13.0",
    "astro-decap-cms-oauth": "^0.5.1",
    "decap-cms": "^3.8.3",
    "framer-motion": "^12.23.12",
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.3.1"
  }
}
```

**Astro Configuration:**
```javascript
// astro.config.mjs
import { defineConfig } from "astro/config";
import decapCmsOauth from "astro-decap-cms-oauth";
import vercel from "@astrojs/vercel";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  output: "server",
  adapter: vercel(),
  integrations: [
    decapCmsOauth(),
    react(),
    tailwind()
  ],
  server: {
    host: true,
    allowedHosts: ["localhost", "127.0.0.1"]
  }
});
```

**Decap CMS Configuration:**
```yaml
# public/admin/config.yml
backend:
  name: github
  repo: [GITHUB_ORG]/becoming-diamond-astro
  branch: main
  site_domain: localhost:4321
  base_url: http://localhost:4321
  auth_endpoint: oauth

media_folder: "public/uploads"
public_folder: "/uploads"

collections:
  - name: "pages"
    label: "Pages"
    folder: "src/content/pages"
    create: true
    slug: "{{slug}}"
    fields:
      - {label: "Title", name: "title", widget: "string"}
      - {label: "Description", name: "description", widget: "text"}
      - {label: "Body", name: "body", widget: "markdown"}
```

### 3.3 Design Requirements

**Visual Style:**
- Dark theme (black background: `#000000`)
- Purple accent gradient (`from-purple-600/50 to-blue-600/50`)
- Subtle glass-morphism effects (`backdrop-blur-sm`)
- Minimal particle effects using SparklesCore
- Smooth micro-interactions with framer-motion

**Typography:**
- Primary: System font stack with elegant fallbacks
- Headings: Bold, large scale (5xl to 8xl responsive)
- Body: Medium weight, gray-400 for secondary text
- Uppercase labels with tracking

**Layout Structure:**
```
[Hero Section - Full viewport height]
  - Centered title "Aceternity AI"
  - Subtitle text
  - Background sparkles (subtle, low opacity)
  - Parallax scroll effect

[Auth Section - 50vh minimum]
  - Centered auth card
  - "Enter" button (initial state)
  - Login/Signup form (expanded state)
  - Gradient border treatment
```

---

## 4. Implementation Notes

### 4.1 Page Structure

**index.astro (Root Redirect):**
```astro
---
// Redirect to landing page
return Astro.redirect('/landing', 302);
---
```

**landing.astro (Main Landing Page):**
```astro
---
import Layout from '../layouts/Layout.astro';
import HeroSection from '../components/landing/HeroSection.astro';
import AuthSection from '../components/landing/AuthSection.astro';
---

<Layout title="Aceternity AI">
  <HeroSection />
  <AuthSection />
</Layout>
```

### 4.2 Component Adaptations

**SparklesCore Component:**
- Use `@tsparticles/react` with React island approach
- Astro component wrapper: `sparkles.astro`
- Client directive: `client:load` for interactivity
- Configurable props: `background`, `minSize`, `maxSize`, `particleDensity`, `particleColor`

**Input Component:**
```astro
---
// src/components/ui/input.astro
interface Props {
  type?: string;
  id?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}
const { type = "text", id, placeholder, required, className } = Astro.props;
---

<input
  type={type}
  id={id}
  placeholder={placeholder}
  required={required}
  class={`px-4 py-3 rounded-lg border transition-colors ${className}`}
/>
```

**Label Component:**
```astro
---
// src/components/ui/label.astro
interface Props {
  for?: string;
  className?: string;
}
const { for: htmlFor, className } = Astro.props;
---

<label
  for={htmlFor}
  class={`block text-sm font-medium ${className}`}
>
  <slot />
</label>
```

**AuthForm (React Island):**
```tsx
// src/components/landing/AuthForm.tsx
"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    window.location.href = "/app";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      // ... rest of implementation
    >
      {/* Form implementation */}
    </motion.div>
  );
}
```

### 4.3 Styling Approach

**Global Styles (global.css):**
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
```

**Tailwind Configuration:**
```javascript
// tailwind.config.mjs
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

### 4.4 Animation Specifications

**Scroll-based Parallax:**
- Hero section Y-offset: `0` to `-100px`
- Opacity fade: `1` to `0.3`
- Transition timing: Linear with scroll position

**Form Animations:**
- Initial state (Enter button): `opacity: 0` → `opacity: 1` over 0.4s
- Expanded form: `opacity: 0, y: 10` → `opacity: 1, y: 0` over 0.3s
- Loading spinner: 360° rotation, 1s duration, infinite loop

**Micro-interactions:**
- Button hover: `opacity: 0.8` → `opacity: 1`
- Input focus: Border color transition over 0.2s
- Background blur transitions: 0.3s ease

### 4.5 OAuth Authentication Flow

**Configuration:**
```javascript
// astro.config.mjs integration
decapCmsOauth({
  // OAuth provider config from environment
  adminPath: '/admin',
  oauthLoginRoute: '/oauth'
})
```

**Environment Variables:**
```bash
# .env
OAUTH_GITHUB_CLIENT_ID=your_client_id
OAUTH_GITHUB_CLIENT_SECRET=your_client_secret
OAUTH_TOKEN_SECRET=random_secret_string
```

**Authentication Routes:**
- `/admin` - Decap CMS admin interface
- `/oauth` - OAuth callback endpoint (handled by astro-decap-cms-oauth)
- GitHub OAuth flow managed automatically

---

## 5. Responsive Design

### Breakpoints
- **Mobile**: < 768px
  - Single column layout
  - Title: `text-5xl`
  - Reduced padding and margins
  - Full-width auth form

- **Tablet**: 768px - 1024px
  - Title: `text-6xl`
  - Moderate spacing

- **Desktop**: > 1024px
  - Title: `text-8xl`
  - Maximum width constraints (max-w-2xl, max-w-md)
  - Generous spacing

### Mobile Considerations
```css
/* Mobile-first approach */
@media (max-width: 768px) {
  .hero-title {
    font-size: clamp(3rem, 10vw, 5rem);
  }

  .auth-card {
    padding: 1.5rem;
    margin: 1rem;
  }

  .sparkles-container {
    opacity: 0.2; /* Reduce on mobile for performance */
  }
}
```

---

## 6. Build and Deployment

### Build Scripts
```json
{
  "scripts": {
    "dev": "astro dev",
    "prebuild": "cp node_modules/decap-cms/dist/decap-cms.js public/admin/decap-cms.js",
    "build": "astro build",
    "preview": "astro preview"
  }
}
```

### Vercel Configuration
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "astro",
  "env": {
    "OAUTH_GITHUB_CLIENT_ID": "@oauth_github_client_id",
    "OAUTH_GITHUB_CLIENT_SECRET": "@oauth_github_client_secret",
    "OAUTH_TOKEN_SECRET": "@oauth_token_secret"
  }
}
```

### Environment Setup
- Development: `http://localhost:4321`
- Production: Vercel automatic deployment
- OAuth redirect URLs must be configured in GitHub App settings

---

## 7. Success Metrics

**Technical Metrics:**
- Lighthouse Performance Score: > 90
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- CMS load time: < 2s

**User Experience Metrics:**
- Successful OAuth authentication: > 95%
- Form submission success rate: > 98%
- Mobile usability score: > 90
- Zero critical accessibility issues

**Development Metrics:**
- Build time: < 30s
- Hot reload time: < 500ms
- Zero TypeScript errors
- Zero console warnings

---

## 8. Future Enhancements

### Phase 2 Additions
1. **Additional Pages**
   - `/app` - Main application dashboard
   - `/about` - About page
   - `/docs` - Documentation

2. **Extended Components**
   - Globe component (three.js integration)
   - Timeline component
   - Card components with hover effects
   - Animated testimonials

3. **CMS Collections**
   - Blog posts
   - Team members
   - Product features
   - Case studies

4. **Advanced Features**
   - Real authentication with user sessions
   - Database integration (Neon/Supabase)
   - API routes for dynamic content
   - Search functionality

### Phase 3 Enhancements
1. **Performance Optimizations**
   - Image optimization with Astro Image
   - Lazy loading for heavy components
   - Code splitting strategies
   - CDN integration

2. **SEO Improvements**
   - Dynamic meta tags
   - Structured data (JSON-LD)
   - Sitemap generation
   - RSS feed

3. **Analytics Integration**
   - Plausible/Fathom Analytics
   - User behavior tracking
   - Conversion funnel analysis

---

## 9. Testing Strategy

### Unit Tests
- Component rendering tests
- Form validation logic
- Utility function tests

### Integration Tests
- OAuth flow testing
- CMS content CRUD operations
- Page navigation flows

### E2E Tests
- Complete user authentication journey
- Content management workflow
- Responsive design validation

### Manual Testing Checklist
- [ ] OAuth authentication works
- [ ] Form submissions trigger correctly
- [ ] Animations are smooth (60fps)
- [ ] Mobile responsiveness verified
- [ ] Cross-browser compatibility (Chrome, Firefox, Safari)
- [ ] Accessibility audit passed
- [ ] CMS admin interface functional

---

## 10. Dependencies and Prerequisites

### Required Accounts
- GitHub account for OAuth
- GitHub repository for the project
- Vercel account for deployment

### Development Environment
- Node.js 18+
- npm/pnpm/bun package manager
- Git version control
- Code editor with TypeScript support

### GitHub OAuth App Setup
1. Create new OAuth App in GitHub Settings
2. Set Homepage URL: `http://localhost:4321` (dev) / production URL
3. Set Authorization callback URL: `http://localhost:4321/oauth/callback`
4. Copy Client ID and Client Secret to `.env`

---

## 11. Migration Path from stadotcouk

**Reusable Patterns:**
- Astro config structure (`astro.config.mjs`)
- Decap CMS OAuth integration pattern
- Environment variable handling
- Public directory structure (`public/admin/`)
- Build script pattern (prebuild step)

**Adaptations Needed:**
- Brutalist design → Modern/elegant Aceternity design
- Data-heavy components → Animation-heavy components
- Database integration → Content-first approach (initially)
- React islands for interactive forms vs static Astro components

---

## 12. Risk Assessment

### High Risk
- **OAuth Integration Complexity**: Mitigated by using proven `astro-decap-cms-oauth` package
- **React Island Performance**: Ensure lazy loading and proper hydration

### Medium Risk
- **Animation Performance on Mobile**: Reduce particle density, use CSS transforms
- **Cross-browser Animation Support**: Test thoroughly, provide fallbacks

### Low Risk
- **Build Configuration**: Well-documented Astro + Vercel pattern
- **TypeScript Configuration**: Standard Astro TypeScript setup

---

## Appendix A: Component Equivalents

| Aceternity (React) | Astro Equivalent | Implementation |
|-------------------|------------------|----------------|
| SparklesCore | sparkles.astro + React island | Use client:load directive |
| Label | label.astro | Pure Astro component |
| Input | input.astro | Pure Astro component |
| motion.div | Astro + framer-motion via React | React island for complex animations |
| useScroll | Astro + view-transitions | Use View Transitions API or React island |

---

## Appendix B: File Checklist

**Essential Files:**
- [ ] `package.json` with all dependencies
- [ ] `astro.config.mjs` with integrations
- [ ] `tsconfig.json` extending Astro strict
- [ ] `tailwind.config.mjs` with theme
- [ ] `public/admin/config.yml` for Decap CMS
- [ ] `public/admin/index.html` for CMS interface
- [ ] `.env.example` with required variables
- [ ] `.gitignore` with node_modules, dist, .env
- [ ] `README.md` with setup instructions

**Source Files:**
- [ ] `src/layouts/Layout.astro`
- [ ] `src/pages/index.astro`
- [ ] `src/pages/landing.astro`
- [ ] `src/components/ui/sparkles.astro`
- [ ] `src/components/ui/label.astro`
- [ ] `src/components/ui/input.astro`
- [ ] `src/components/landing/HeroSection.astro`
- [ ] `src/components/landing/AuthSection.astro`
- [ ] `src/components/landing/AuthForm.tsx`
- [ ] `src/styles/global.css`
- [ ] `src/lib/utils.ts`

---

**End of PRD**
