# PRD 001-04: Production Deployment and Optimization

**Version:** 1.0
**Date:** 2025-10-01
**Parent PRD:** 001-astro-decap-cms-aceternity-integration
**Status:** Ready for Implementation
**Estimated Complexity:** Medium
**Duration:** 3-5 hours

---

## 1. Scope

This final chunk prepares the application for production deployment on Vercel, including build optimizations, environment configuration, production OAuth setup, performance monitoring, and documentation. This completes the implementation of the parent PRD.

### What's Included
- Vercel deployment configuration
- Production environment variable setup
- Production GitHub OAuth app configuration
- Build optimizations and performance tuning
- SEO meta tags and Open Graph setup
- Error handling and logging
- Production testing and verification
- Deployment documentation
- Performance benchmarking

### What's NOT Included
- Additional pages or features (future enhancements)
- Database integration
- Real authentication backend
- Analytics integration (future phase)
- CDN configuration beyond Vercel defaults

### Dependencies
**Requires:**
- PRD 001-00 (Project Foundation) - completed
- PRD 001-01 (Decap CMS Integration) - completed
- PRD 001-02 (React Integration and UI Components) - completed
- PRD 001-03 (Animations and Particle Effects) - completed

**Blocks:** None (final chunk)

---

## 2. Requirements

### 2.1 Vercel Configuration

**Create `vercel.json`:**
```json
{
  "framework": "astro",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "regions": ["iad1"],
  "git": {
    "deploymentEnabled": true
  },
  "env": {
    "NODE_VERSION": "20"
  }
}
```

### 2.2 Environment Variable Configuration

**Update `.env.example` for production:**
```bash
# GitHub OAuth Configuration
# Development values
OAUTH_GITHUB_CLIENT_ID=your_dev_github_oauth_client_id_here
OAUTH_GITHUB_CLIENT_SECRET=your_dev_github_oauth_client_secret_here
OAUTH_TOKEN_SECRET=your_random_secret_string_here

# Production values (set in Vercel dashboard)
# OAUTH_GITHUB_CLIENT_ID_PROD=your_prod_github_oauth_client_id_here
# OAUTH_GITHUB_CLIENT_SECRET_PROD=your_prod_github_oauth_client_secret_here
# OAUTH_TOKEN_SECRET_PROD=your_prod_random_secret_string_here

# GitHub Repository
GITHUB_REPO=your-org/becoming-diamond-astro

# Environment (auto-detected by Vercel)
# NODE_ENV=production
```

**Vercel Environment Variables (set in dashboard):**
- `OAUTH_GITHUB_CLIENT_ID` (Production GitHub OAuth App Client ID)
- `OAUTH_GITHUB_CLIENT_SECRET` (Production GitHub OAuth App Secret)
- `OAUTH_TOKEN_SECRET` (Production token secret - generate new one)

### 2.3 Production OAuth App Setup

**Create separate production GitHub OAuth App:**

1. Go to GitHub Settings → Developer settings → OAuth Apps → New OAuth App
2. Fill in the form:
   - **Application name**: `Becoming Diamond Astro CMS (Production)`
   - **Homepage URL**: `https://your-production-domain.vercel.app`
   - **Authorization callback URL**: `https://your-production-domain.vercel.app/oauth/callback`
3. Click "Register application"
4. Copy Client ID and generate Client Secret
5. Add to Vercel environment variables

### 2.4 SEO and Meta Tags

**Update `src/layouts/Layout.astro`:**
```astro
---
interface Props {
  title: string;
  description?: string;
  image?: string;
  url?: string;
}

const {
  title,
  description = "Aceternity AI - Modern web experiences with elegant design",
  image = "/og-image.png",
  url = "https://your-production-domain.vercel.app"
} = Astro.props;

const canonicalUrl = new URL(Astro.url.pathname, url).toString();
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="description" content={description} />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- SEO -->
    <link rel="canonical" href={canonicalUrl} />
    <meta name="robots" content="index, follow" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonicalUrl} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content={canonicalUrl} />
    <meta property="twitter:title" content={title} />
    <meta property="twitter:description" content={description} />
    <meta property="twitter:image" content={image} />

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

    <!-- Preconnect to optimize font loading if using external fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

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

### 2.5 Favicon and Images

**Create required image assets:**

Files to create/add:
- `public/favicon.svg` - Site favicon (SVG format preferred)
- `public/apple-touch-icon.png` - 180x180px PNG
- `public/og-image.png` - 1200x630px Open Graph image

**Placeholder favicon.svg:**
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#000000"/>
  <circle cx="50" cy="50" r="30" fill="#9333ea"/>
</svg>
```

### 2.6 Build Optimization

**Update `astro.config.mjs` with production optimizations:**
```javascript
import { defineConfig } from "astro/config";
import decapCmsOauth from "astro-decap-cms-oauth";
import vercel from "@astrojs/vercel";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  output: "server",
  adapter: vercel({
    webAnalytics: {
      enabled: true
    }
  }),
  integrations: [
    decapCmsOauth({
      adminPath: '/admin',
      oauthLoginRoute: '/oauth'
    }),
    react(),
    tailwind()
  ],
  server: {
    host: true,
    port: 4321,
    allowedHosts: ["localhost", "127.0.0.1"]
  },
  vite: {
    build: {
      cssMinify: true,
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'motion-vendor': ['framer-motion'],
            'particles-vendor': ['@tsparticles/react', '@tsparticles/engine', '@tsparticles/slim']
          }
        }
      }
    }
  }
});
```

### 2.7 Error Pages

**Create `src/pages/404.astro`:**
```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="404 - Page Not Found">
  <main class="min-h-screen bg-black text-white flex items-center justify-center px-4">
    <div class="text-center max-w-2xl mx-auto">
      <h1 class="text-6xl md:text-8xl font-bold mb-4 text-purple-600">
        404
      </h1>
      <h2 class="text-2xl md:text-3xl font-semibold mb-4">
        Page Not Found
      </h2>
      <p class="text-gray-400 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <a
        href="/landing"
        class="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
      >
        Go Home
      </a>
    </div>
  </main>
</Layout>
```

**Create `src/pages/500.astro`:**
```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="500 - Server Error">
  <main class="min-h-screen bg-black text-white flex items-center justify-center px-4">
    <div class="text-center max-w-2xl mx-auto">
      <h1 class="text-6xl md:text-8xl font-bold mb-4 text-red-600">
        500
      </h1>
      <h2 class="text-2xl md:text-3xl font-semibold mb-4">
        Server Error
      </h2>
      <p class="text-gray-400 mb-8">
        Something went wrong on our end. Please try again later.
      </p>
      <a
        href="/landing"
        class="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
      >
        Go Home
      </a>
    </div>
  </main>
</Layout>
```

### 2.8 Package.json Updates

**Add production scripts:**
```json
{
  "scripts": {
    "dev": "astro dev",
    "prebuild": "cp node_modules/decap-cms/dist/decap-cms.js public/admin/decap-cms.js",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf dist .astro node_modules/.vite"
  }
}
```

### 2.9 Deployment Documentation

**Update `README.md` with deployment section:**
```markdown
## Deployment

### Prerequisites
1. Vercel account
2. GitHub repository
3. Production GitHub OAuth App configured

### Deploy to Vercel

#### Option 1: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Option 2: Vercel Dashboard
1. Import your GitHub repository in Vercel
2. Configure environment variables:
   - `OAUTH_GITHUB_CLIENT_ID`
   - `OAUTH_GITHUB_CLIENT_SECRET`
   - `OAUTH_TOKEN_SECRET`
3. Click "Deploy"

### Environment Variables Setup

In Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add the following variables:
   - `OAUTH_GITHUB_CLIENT_ID`: Your production GitHub OAuth Client ID
   - `OAUTH_GITHUB_CLIENT_SECRET`: Your production GitHub OAuth Client Secret
   - `OAUTH_TOKEN_SECRET`: Generate with `openssl rand -base64 32`
3. Set environment to "Production"
4. Save changes

### Post-Deployment

1. Update GitHub OAuth App:
   - Homepage URL: `https://your-domain.vercel.app`
   - Callback URL: `https://your-domain.vercel.app/oauth/callback`

2. Test deployment:
   - Visit your production URL
   - Test landing page loads
   - Test CMS authentication at `/admin`
   - Verify animations work
   - Check mobile responsiveness

### Continuous Deployment

Vercel automatically deploys:
- **Production**: Pushes to `main` branch
- **Preview**: Pull requests and other branches

### Rollback

If needed, rollback in Vercel dashboard:
1. Go to Deployments
2. Find previous successful deployment
3. Click "..." → "Promote to Production"
```

---

## 3. Implementation Details

### 3.1 Deployment Checklist

**Pre-deployment:**
1. [ ] All environment variables documented
2. [ ] Production GitHub OAuth App created
3. [ ] Favicon and OG image added
4. [ ] Error pages created (404, 500)
5. [ ] SEO meta tags added
6. [ ] Build completes without errors locally
7. [ ] TypeScript check passes
8. [ ] All tests pass (manual testing)

**Deployment:**
1. [ ] Push code to GitHub main branch
2. [ ] Connect repository to Vercel
3. [ ] Configure environment variables in Vercel
4. [ ] Trigger initial deployment
5. [ ] Verify deployment succeeded

**Post-deployment:**
1. [ ] Update GitHub OAuth App URLs
2. [ ] Test production site loads
3. [ ] Test CMS authentication works
4. [ ] Verify animations perform well
5. [ ] Check Lighthouse scores
6. [ ] Test on mobile devices
7. [ ] Verify error pages work

### 3.2 Performance Benchmarks

**Target Metrics (Lighthouse):**
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: > 90

**Core Web Vitals:**
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

**Custom Metrics:**
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Total JavaScript: < 150KB (gzipped)
- Total CSS: < 30KB (gzipped)

### 3.3 Production Testing

**Manual Test Suite:**

1. **Landing Page**
   - [ ] Page loads without errors
   - [ ] Sparkles render correctly
   - [ ] Parallax scroll works
   - [ ] Auth form expands/collapses
   - [ ] Form validation works
   - [ ] Form submission redirects to /app

2. **CMS Admin**
   - [ ] `/admin` loads correctly
   - [ ] GitHub OAuth flow works
   - [ ] Can create new content
   - [ ] Can upload media
   - [ ] Can publish content
   - [ ] Can edit existing content

3. **Error Handling**
   - [ ] Navigate to `/nonexistent-page` → 404 page
   - [ ] 404 page styled correctly
   - [ ] "Go Home" link works

4. **Responsive Design**
   - [ ] Test on iPhone (Safari)
   - [ ] Test on Android (Chrome)
   - [ ] Test on tablet (iPad)
   - [ ] Test on desktop (1920x1080)

5. **Performance**
   - [ ] Run Lighthouse audit
   - [ ] Check Core Web Vitals
   - [ ] Verify animations are 60fps
   - [ ] Check bundle sizes

---

## 4. Success Criteria

### Testing Checkpoints

1. **Build Process**
   - [ ] `npm run build` completes without errors
   - [ ] `npm run check` passes
   - [ ] Build output size is reasonable (< 500KB JS)
   - [ ] No TypeScript errors

2. **Vercel Deployment**
   - [ ] Repository connected to Vercel
   - [ ] Environment variables configured
   - [ ] Deployment succeeds
   - [ ] Production URL accessible

3. **Production Site**
   - [ ] Landing page loads correctly
   - [ ] All animations work
   - [ ] Forms are functional
   - [ ] CMS authentication works
   - [ ] No console errors

4. **Performance**
   - [ ] Lighthouse Performance > 90
   - [ ] Lighthouse Accessibility > 95
   - [ ] Lighthouse Best Practices > 95
   - [ ] Lighthouse SEO > 90
   - [ ] LCP < 2.5s
   - [ ] FID < 100ms
   - [ ] CLS < 0.1

5. **SEO**
   - [ ] Meta tags present and correct
   - [ ] Open Graph tags working (test with social debuggers)
   - [ ] Favicon loads correctly
   - [ ] Canonical URLs correct
   - [ ] Robots.txt accessible

6. **Error Handling**
   - [ ] 404 page works
   - [ ] 500 page exists
   - [ ] Error pages styled correctly

7. **Mobile**
   - [ ] Site works on iOS Safari
   - [ ] Site works on Android Chrome
   - [ ] Touch interactions work
   - [ ] Performance acceptable on mobile
   - [ ] No layout shifts

8. **CMS Production**
   - [ ] OAuth flow works with production URLs
   - [ ] Can authenticate to CMS
   - [ ] Can manage content
   - [ ] Media uploads work
   - [ ] Changes persist correctly

---

## 5. Common Issues and Solutions

### Issue: Build Fails on Vercel
**Symptom**: Deployment fails during build step
**Solution**:
- Check build logs for specific error
- Verify all dependencies in package.json
- Ensure Node version matches (20.x)
- Check for missing environment variables
- Try clean build locally first

### Issue: OAuth Fails in Production
**Symptom**: CMS login redirects to error page
**Solution**:
- Verify production OAuth app callback URL matches exactly
- Check environment variables are set correctly in Vercel
- Ensure `OAUTH_TOKEN_SECRET` is set
- Verify GitHub OAuth app is not in development mode
- Check site domain in Decap config.yml

### Issue: Environment Variables Not Loading
**Symptom**: App behavior differs from local
**Solution**:
- Verify variables are set in Vercel dashboard
- Check variable names match exactly (case-sensitive)
- Redeploy after adding variables
- Verify environment is set to "Production"

### Issue: Poor Performance Scores
**Symptom**: Lighthouse scores below targets
**Solution**:
- Check bundle sizes (run `npm run build` and inspect dist/)
- Reduce particle density if needed
- Ensure images are optimized
- Enable compression in Vercel
- Use code splitting for heavy dependencies

### Issue: Sparkles Don't Render in Production
**Symptom**: Hero section missing particles
**Solution**:
- Verify prebuild script ran (check for decap-cms.js)
- Check browser console for errors
- Ensure @tsparticles packages are in dependencies (not devDependencies)
- Verify client:load directive is present

---

## 6. Rollback Plan

### If Deployment Has Critical Issues

1. **Immediate Rollback (Vercel Dashboard)**
   ```
   1. Go to Deployments tab
   2. Find last working deployment
   3. Click "..." menu
   4. Select "Promote to Production"
   ```

2. **Git Rollback (if needed)**
   ```bash
   git revert HEAD
   git push origin main
   # Vercel will auto-deploy the reverted commit
   ```

3. **Environment Variable Rollback**
   - Keep backup of working environment variables
   - Restore from Vercel settings if needed

---

## 7. Monitoring and Maintenance

### Post-Launch Monitoring

**Week 1 - Daily Checks:**
- [ ] Site is accessible
- [ ] CMS authentication works
- [ ] No error spikes
- [ ] Performance remains acceptable

**Ongoing - Weekly:**
- [ ] Review Vercel analytics
- [ ] Check for dependency updates
- [ ] Monitor bundle sizes
- [ ] Review any user-reported issues

### Maintenance Tasks

**Monthly:**
- [ ] Update dependencies (patch versions)
- [ ] Review and rotate OAuth secrets if needed
- [ ] Check for Astro updates
- [ ] Review performance metrics

**Quarterly:**
- [ ] Major dependency updates
- [ ] Security audit
- [ ] Performance optimization review
- [ ] Content cleanup in CMS

---

## 8. Acceptance Criteria Summary

**This chunk is complete when:**

1. Application is successfully deployed to Vercel production
2. Production URL is accessible and functional
3. All Lighthouse scores meet targets (Performance > 90, etc.)
4. CMS authentication works with production GitHub OAuth app
5. Error pages (404, 500) work correctly
6. SEO meta tags are present and correct
7. Mobile experience is smooth and performant
8. No console errors in production
9. All animations work as expected
10. Documentation is complete and accurate

**Final Testing Checklist:**
- [ ] Production deployment successful
- [ ] Test landing page on production URL
- [ ] Test CMS authentication flow
- [ ] Run Lighthouse audit (all scores meet targets)
- [ ] Test on mobile device (real device, not just DevTools)
- [ ] Verify 404 page works
- [ ] Check Open Graph preview (Facebook debugger, Twitter card validator)
- [ ] Verify favicon loads
- [ ] Test form submission end-to-end
- [ ] Check bundle sizes are reasonable
- [ ] Verify no console errors or warnings
- [ ] Test on multiple browsers (Chrome, Firefox, Safari)
- [ ] Verify animations are smooth
- [ ] Check responsive design on various screen sizes

**Project Complete:**
This completes the implementation of PRD 001. All core requirements from the parent PRD have been fulfilled:
- ✓ Astro project with SSR
- ✓ Decap CMS with GitHub OAuth
- ✓ Aceternity-style UI components
- ✓ Polished landing page with animations
- ✓ Vercel deployment

---

## 9. Next Steps (Future Enhancements)

After this PRD is complete, consider these future phases:

**Phase 2 (from parent PRD):**
- Additional pages (/app, /about, /docs)
- Extended Aceternity components
- More CMS collections
- Real authentication backend

**Phase 3 (from parent PRD):**
- Performance optimizations
- SEO improvements
- Analytics integration

These are documented in the parent PRD section 8 (Future Enhancements) and can be split into their own PRDs as needed.

---

**End of PRD 001-04**
