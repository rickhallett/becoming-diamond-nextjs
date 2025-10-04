# Performance Optimization PRD

## Document Information
- **Version**: 1.0
- **Date**: 2025-10-04
- **Status**: Draft
- **Priority**: High

## Executive Summary

PageSpeed Insights analysis reveals significant performance opportunities across multiple categories. Current performance metrics indicate room for improvement in JavaScript delivery, image optimization, and resource loading strategies. This PRD outlines a systematic approach to optimize the Becoming Diamond website for improved Core Web Vitals and user experience.

## Current Performance Metrics

### PageSpeed Insights Findings

**Critical Issues:**
- Legacy JavaScript: Est savings of 11 KiB
- Reduce unused JavaScript: Est savings of 420 KiB
- JavaScript execution time: 6.5 seconds
- Improve image delivery: Est savings of 2,956 KiB
- Defer offscreen images: Est savings of 3,130 KiB
- Avoid enormous network payloads: Total size was 4,795 KiB

**Medium Priority Issues:**
- Network dependency tree: Maximum critical path latency of 514 ms
- Does not use passive listeners to improve scrolling performance

## Problem Statement

The website currently suffers from:
1. **Excessive JavaScript payload** - 420 KiB of unused JavaScript and 11 KiB of unnecessary polyfills/transforms
2. **Unoptimized images** - 2.7+ MB profile image at full resolution, multiple Unsplash images not properly sized
3. **Blocking resources** - Images loading eagerly, causing large initial payloads
4. **Inefficient execution** - 6.5 seconds of JavaScript execution time
5. **Modern browser compatibility** - Transpiling features supported by modern browsers

## Goals

### Primary Goals
1. Reduce JavaScript bundle size by 400+ KiB
2. Reduce image payload by 3+ MB through optimization and lazy loading
3. Reduce JavaScript execution time below 3 seconds
4. Improve Largest Contentful Paint (LCP) by 30%+
5. Improve Time to Interactive (TTI) by 40%+

### Success Metrics
- PageSpeed Insights Performance score: 90+ (mobile and desktop)
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.5s
- Total Blocking Time (TBT): < 200ms
- Cumulative Layout Shift (CLS): < 0.1
- Total page weight: < 2 MB

## Proposed Solutions

### 1. JavaScript Optimization

#### 1.1 Remove Legacy JavaScript Polyfills
**Issue**: 11.5 KiB wasted on polyfills for modern browsers
**Files affected**:
- `chunks/1255-5e80850ee659f6b0.js` (Array.prototype.at, flatMap, flat, fromEntries, hasOwn, trimEnd, trimStart)

**Solution**:
- Update build configuration to target modern browsers
- Remove Baseline feature transpilation
- Configure browserslist to exclude old browsers
- Update `next.config.ts` with modern browser targets

**Implementation**:
```javascript
// next.config.ts
const nextConfig = {
  transpilePackages: [],
  experimental: {
    optimizeCss: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Target modern browsers only
  target: 'es2022',
}
```

**Expected savings**: 11 KiB

#### 1.2 Reduce Unused JavaScript
**Issue**: 420 KiB of unused JavaScript across multiple chunks
**Files affected**:
- `chunks/b055d1fb.ec027d6cfe4ac069.js` - 150.2 KiB transfer, 129.2 KiB savings
- `chunks/bd904a5c-a41790b73ae35279.js` - 99.9 KiB transfer, 77.0 KiB savings
- `chunks/3003.3b0638f96c7d6576.js` - 68.8 KiB transfer, 39.5 KiB savings
- `chunks/8ffc485e.329cc36d70fa1265.js` - 55.4 KiB transfer, 21.3 KiB savings
- `chunks/b536a0f1-a89aaee2c858350d.js` - 79.8 KiB transfer, 20.3 KiB savings
- Stripe utility: 202.3 KiB transfer, 133.0 KiB savings

**Solution**:
- Implement code splitting for Stripe integration (load only on payment pages)
- Use dynamic imports for heavy dependencies
- Analyze and remove unused Aceternity UI components
- Implement tree-shaking optimization
- Lazy load non-critical features

**Implementation**:
```typescript
// Dynamic import for Stripe
const StripeCheckout = dynamic(() => import('@/components/StripeCheckout'), {
  ssr: false,
  loading: () => <CheckoutSkeleton />
});

// Only load on payment routes
if (isPaymentPage) {
  // Stripe loads here
}
```

**Expected savings**: 420 KiB

#### 1.3 Reduce JavaScript Execution Time
**Issue**: 6.5 seconds total execution time
**Breakdown**:
- `chunks/646-c6afdd57eba34341.js` - 30,608 ms total CPU time
- `chunks/8399-069cc1f8d6501e88.js` - 4,872 ms total CPU time
- `chunks/4bd1b696-100b9d70ed4e49c1.js` - 2,708 ms total CPU time
- Stripe utility - 253 ms total CPU time

**Solution**:
- Defer non-critical JavaScript
- Implement requestIdleCallback for heavy operations
- Optimize Framer Motion animations (reduce complexity)
- Use React.memo for expensive components
- Implement virtualization for long lists
- Remove or optimize heavy 3D components (Globe, World)

**Implementation**:
```typescript
// Defer heavy animations
const Globe = dynamic(() => import('@/components/ui/globe'), {
  ssr: false,
  loading: () => <GlobeSkeleton />
});

// Use React.memo for expensive renders
export const HeavyComponent = React.memo(({ data }) => {
  // Component logic
}, (prev, next) => prev.id === next.id);
```

**Expected improvement**: Reduce to < 3 seconds

### 2. Image Optimization

#### 2.1 Replace Greece Profile Image with Placeholder
**Issue**: 2,726.9 KiB profile image at full resolution (2316x2236) displayed at 332x443
**File**: `/greece_profile2.jpeg`

**Solution**:
- Replace with optimized placeholder image
- Use Next.js Image component with proper sizing
- Implement responsive images with srcset
- Serve WebP/AVIF format with fallback

**Implementation**:
```typescript
// Replace in profile page
import Image from 'next/image';

<Image
  src="/placeholder-profile.webp"
  alt="Richard Hallett"
  width={332}
  height={443}
  quality={85}
  priority
  placeholder="blur"
  blurDataURL="data:image/..."
/>
```

**Expected savings**: 2,703 KiB (1,884 KiB format optimization + 2,649 KiB sizing optimization)

#### 2.2 Optimize Unsplash Images
**Issue**: Multiple Unsplash images oversized and unoptimized
**Files**:
- `photo-150...eca07ce68773?q=80&w=800&h=400` - 57.9 KiB (49.1 KiB format + 48.1 KiB sizing)
- `photo-153...c7a0eda0e6b3?q=80&w=800&h=400` - 55.5 KiB (46.7 KiB format + 46.1 KiB sizing)
- `photo-151...91b2f5f229cc?q=80&w=800&h=400` - 49.5 KiB (41.1 KiB format + 41.1 KiB sizing)
- `photo-150...00dcc994a43e?q=80&w=600&h=600` - 57.6 KiB (39.7 KiB format + 39.3 KiB sizing)
- `photo-150...0a1dd7228f2d?q=80&w=600&h=600` - 41.0 KiB (28.0 KiB format + 28.0 KiB sizing)
- `photo-149...be9c29b29330?q=80&w=600&h=600` - 37.5 KiB (25.6 KiB format + 25.6 KiB sizing)
- `photo-149...9dddcece7f88?q=80&w=800&h=400` - 27.2 KiB (22.6 KiB format + 22.6 KiB sizing)

**Solution**:
- Use Next.js Image component for all testimonial/content images
- Implement proper sizing based on display dimensions
- Use WebP/AVIF format
- Add explicit width/height to prevent CLS
- Implement responsive images

**Implementation**:
```typescript
// Testimonials component
<Image
  src={testimonial.src}
  alt={testimonial.name}
  width={600}
  height={600}
  quality={80}
  loading="lazy"
  formats={['image/avif', 'image/webp']}
/>
```

**Expected savings**: 252.7 KiB total

#### 2.3 Defer Offscreen Images
**Issue**: 3,130 KiB of images loaded eagerly that are below the fold
**Files**:
- Profile image: 2,726.9 KiB
- Oceanheart AI logo: 63.2 KiB
- Various testimonial images: 326.3 KiB total

**Solution**:
- Use `loading="lazy"` for below-fold images
- Use `priority` only for LCP image
- Implement Intersection Observer for manual lazy loading
- Defer all testimonial/footer images

**Implementation**:
```typescript
// Above fold (LCP candidate)
<Image src="..." priority />

// Below fold
<Image src="..." loading="lazy" />
```

**Expected savings**: 3,130 KiB initial load reduction

### 3. Network Optimization

#### 3.1 Reduce Network Payload
**Issue**: 4,795 KiB total page size
**Breakdown**:
- greece_profile2.jpeg: 2,727.5 KiB
- JavaScript chunks: ~1,500 KiB
- Stripe integration: 618.1 KiB
- Unsplash images: ~326.3 KiB
- Other assets: ~623.1 KiB

**Solution**:
- Implement all image optimizations above
- Enable Brotli/Gzip compression
- Implement route-based code splitting
- Use CDN for static assets
- Implement resource hints (preconnect, dns-prefetch)

**Implementation**:
```typescript
// Add to layout.tsx
<head>
  <link rel="preconnect" href="https://images.unsplash.com" />
  <link rel="dns-prefetch" href="https://js.stripe.com" />
</head>
```

**Expected result**: Reduce to < 2 MB

#### 3.2 Optimize Critical Path
**Issue**: Maximum critical path latency of 514 ms
**Chain**:
1. HTML document - 211 ms, 12.83 KiB
2. CSS file - 360 ms, 1.20 KiB
3. CSS file - 514 ms, 29.76 KiB

**Solution**:
- Inline critical CSS
- Defer non-critical CSS
- Use `preload` for critical resources
- Minimize render-blocking resources

**Implementation**:
```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    optimizeCss: true,
    inlineCss: true,
  },
}
```

**Expected improvement**: Reduce to < 300 ms

### 4. Code Quality Improvements

#### 4.1 Add Passive Event Listeners
**Issue**: Scroll performance degradation from non-passive listeners
**File**: `chunks/3003.3b0638f96c7d6576.js:370:72387`

**Solution**:
- Convert touch/wheel listeners to passive
- Update Framer Motion configuration
- Audit all scroll/touch event handlers

**Implementation**:
```typescript
// Add to scroll handlers
element.addEventListener('touchstart', handler, { passive: true });
element.addEventListener('wheel', handler, { passive: true });
```

**Expected improvement**: Smoother scrolling on mobile

## Implementation Plan

### Phase 1: Quick Wins (Week 1)
**Priority**: High
**Estimated effort**: 8-16 hours

1. ✅ Replace Greece profile image with optimized placeholder
2. ✅ Add `loading="lazy"` to all below-fold images
3. ✅ Enable modern browser targeting (remove polyfills)
4. ✅ Add passive event listeners
5. ✅ Implement basic Next.js Image optimization

**Expected impact**:
- ~3 MB reduction in page weight
- ~11 KiB JavaScript reduction
- Improved scroll performance

### Phase 2: JavaScript Optimization (Week 2)
**Priority**: High
**Estimated effort**: 16-24 hours

1. ✅ Implement code splitting for Stripe integration
2. ✅ Dynamic import heavy Aceternity components
3. ✅ Remove unused component imports
4. ✅ Optimize Framer Motion animations
5. ✅ Implement React.memo for expensive components

**Expected impact**:
- ~400 KiB JavaScript reduction
- 50%+ reduction in execution time
- Improved TTI

### Phase 3: Advanced Image Optimization (Week 3)
**Priority**: Medium
**Estimated effort**: 12-16 hours

1. ✅ Convert all images to WebP/AVIF format
2. ✅ Implement responsive image sizing
3. ✅ Add blur placeholders for all images
4. ✅ Optimize Unsplash image queries
5. ✅ Implement image CDN (Cloudinary/Vercel)

**Expected impact**:
- Additional 250+ KiB image savings
- Improved LCP
- Better perceived performance

### Phase 4: Advanced Optimizations (Week 4)
**Priority**: Low
**Estimated effort**: 16-24 hours

1. ✅ Inline critical CSS
2. ✅ Implement resource hints (preconnect, dns-prefetch)
3. ✅ Add service worker for caching
4. ✅ Implement route-based prefetching
5. ✅ Optimize font loading strategy

**Expected impact**:
- Improved FCP
- Better repeat visit performance
- Reduced critical path latency

## Technical Specifications

### Browser Support
**Target browsers**:
- Chrome/Edge: Last 2 versions
- Safari: Last 2 versions
- Firefox: Last 2 versions
- Mobile browsers: iOS Safari 14+, Chrome Android 90+

**No support for**:
- IE11 or below
- Legacy Edge
- Browsers older than 2 years

### Image Specifications
**Profile images**:
- Format: WebP/AVIF with JPEG fallback
- Desktop: 400x400 @ 1x, 800x800 @ 2x
- Mobile: 300x300 @ 1x, 600x600 @ 2x
- Quality: 85
- Compression: Lossless where appropriate

**Testimonial images**:
- Format: WebP/AVIF with JPEG fallback
- Size: 600x600 @ 1x, 1200x1200 @ 2x
- Quality: 80
- All lazy loaded

**Content images**:
- Format: WebP/AVIF with JPEG fallback
- Responsive sizing based on viewport
- Quality: 75-85 (content dependent)
- All lazy loaded except LCP candidate

### Code Splitting Strategy
**Route-based**:
- `/` - Landing page bundle
- `/app/*` - Member portal bundle
- `/auth/*` - Authentication bundle
- `/legal/*` - Legal pages bundle

**Component-based**:
- Stripe integration - Dynamic import
- 3D components (Globe, World) - Dynamic import with ssr: false
- Heavy Aceternity components - Lazy load below fold
- Chat interface - Dynamic import

### Build Configuration
```typescript
// next.config.ts
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@tabler/icons-react', 'framer-motion'],
  },
  swcMinify: true,
  reactStrictMode: true,
}
```

## Testing & Validation

### Performance Testing
**Tools**:
- PageSpeed Insights (mobile and desktop)
- Chrome DevTools Lighthouse
- WebPageTest (multiple locations)
- Real User Monitoring (RUM) via Vercel Analytics

**Test scenarios**:
1. Cold cache (first visit)
2. Warm cache (repeat visit)
3. 3G/4G mobile network simulation
4. Desktop high-speed connection

**Acceptance criteria**:
- PageSpeed Performance: 90+ (mobile and desktop)
- All Core Web Vitals in "Good" range
- Total page weight: < 2 MB
- JavaScript execution: < 3 seconds
- LCP: < 2.5s on 3G

### Visual Regression Testing
**Tools**:
- Percy.io or Chromatic
- Manual QA on real devices

**Test cases**:
- Homepage hero section
- Testimonials grid
- Member portal navigation
- All lazy-loaded images appear correctly

## Risks & Mitigation

### Risk 1: Breaking Changes from Modern Browser Target
**Impact**: High
**Probability**: Medium
**Mitigation**:
- Comprehensive browser testing
- Staged rollout with feature flags
- Monitoring error tracking for older browsers
- Clear browser support policy

### Risk 2: Layout Shift from Image Optimization
**Impact**: Medium
**Probability**: Low
**Mitigation**:
- Explicit width/height on all images
- Aspect ratio CSS
- Blur placeholders
- CLS monitoring

### Risk 3: Stripe Integration Breaking
**Impact**: High
**Probability**: Low
**Mitigation**:
- Thorough testing of payment flow
- Keep Stripe bundle separate
- Error boundaries around payment components
- Fallback to synchronous loading if dynamic import fails

### Risk 4: Performance Regression in Development
**Impact**: Low
**Probability**: Medium
**Mitigation**:
- Add Lighthouse CI to GitHub Actions
- Performance budgets in CI/CD
- Regular PageSpeed audits
- Performance monitoring dashboards

## Dependencies

### Required packages
- `next@15.5.3` (already installed)
- `sharp` - For image optimization
- `@next/bundle-analyzer` - For bundle analysis

### Optional packages
- `@vercel/analytics` - RUM tracking
- `workbox` - Service worker generation
- `compression-webpack-plugin` - Brotli compression

## Success Criteria

### Must Have (Phase 1-2)
- ✅ Profile image replaced with optimized placeholder
- ✅ PageSpeed Performance: 80+ mobile, 90+ desktop
- ✅ Total page weight: < 3 MB
- ✅ JavaScript bundle reduced by 250+ KiB
- ✅ All images lazy loaded except LCP

### Should Have (Phase 3)
- ✅ PageSpeed Performance: 90+ mobile and desktop
- ✅ All images in WebP/AVIF format
- ✅ JavaScript execution: < 4 seconds
- ✅ LCP: < 3.0s

### Nice to Have (Phase 4)
- ✅ Service worker caching
- ✅ Resource hints implemented
- ✅ Critical CSS inlined
- ✅ All Core Web Vitals "Good" on real users

## Rollout Plan

### Week 1: Phase 1 Implementation
- Replace profile image
- Add lazy loading
- Enable modern browser targeting
- Deploy to staging
- Test on real devices
- Deploy to production

### Week 2: Phase 2 Implementation
- Code splitting
- Dynamic imports
- Animation optimization
- Deploy to staging
- Performance testing
- Deploy to production

### Week 3: Phase 3 Implementation
- Image format conversion
- Responsive images
- Blur placeholders
- Deploy to staging
- Visual regression testing
- Deploy to production

### Week 4: Phase 4 Implementation
- Advanced optimizations
- CSS optimization
- Resource hints
- Deploy to staging
- Final performance audit
- Deploy to production

## Monitoring & Maintenance

### Key Metrics to Track
- Core Web Vitals (LCP, FID, CLS, FCP, TTFB)
- Page load time (p50, p75, p95, p99)
- JavaScript bundle size
- Total page weight
- Time to Interactive
- Lighthouse scores

### Alerting Thresholds
- LCP > 3.0s - Warning
- LCP > 4.0s - Critical
- JavaScript execution > 5s - Warning
- Total page weight > 3 MB - Warning
- PageSpeed score < 80 - Warning
- PageSpeed score < 70 - Critical

### Regular Reviews
- Weekly: Review Core Web Vitals dashboard
- Monthly: Full PageSpeed audit of all pages
- Quarterly: Bundle analysis and cleanup
- Per PR: Lighthouse CI checks

## Appendix

### A. PageSpeed Insights Raw Data

**Legacy JavaScript**:
```
oceanheart.ai - 11.5 KiB wasted
  chunks/1255-5e80850ee659f6b0.js
    - Array.prototype.at
    - Array.prototype.flat
    - Array.prototype.flatMap
    - Object.fromEntries
    - Object.hasOwn
    - String.prototype.trimEnd
    - String.prototype.trimStart
```

**Unused JavaScript**:
```
oceanheart.ai - 454.1 KiB transfer, 287.3 KiB savings
  chunks/b055d1fb.ec027d6cfe4ac069.js - 150.2 KiB / 129.2 KiB
  chunks/bd904a5c-a41790b73ae35279.js - 99.9 KiB / 77.0 KiB
  chunks/3003.3b0638f96c7d6576.js - 68.8 KiB / 39.5 KiB
  chunks/8ffc485e.329cc36d70fa1265.js - 55.4 KiB / 21.3 KiB
  chunks/b536a0f1-a89aaee2c858350d.js - 79.8 KiB / 20.3 KiB

Stripe - 202.3 KiB transfer, 133.0 KiB savings
  clover/stripe.js - 202.3 KiB / 133.0 KiB
```

**JavaScript Execution Time**:
```
Total: 40,586 ms

oceanheart.ai - 40,586 ms total
  chunks/646-c6afdd57eba34341.js - 30,608 ms
  chunks/8399-069cc1f8d6501e88.js - 4,872 ms
  chunks/4bd1b696-100b9d70ed4e49c1.js - 2,708 ms
  https://diamond.oceanheart.ai - 1,104 ms
  chunks/1255-5e80850ee659f6b0.js - 781 ms
  chunks/3003.3b0638f96c7d6576.js - 274 ms
  chunks/5478.2111e2fd5c54853b.js - 239 ms

Stripe - 253 ms total
  clover/stripe.js - 190 ms
  inner.html - 63 ms
```

### B. Image Optimization Details

**Profile Image**:
- Current: 2,726.9 KiB (2316x2236 JPEG)
- Displayed: 332x443
- Format waste: 1,884.2 KiB (use WebP/AVIF)
- Sizing waste: 2,649.5 KiB (oversized)
- **Total savings: 2,703.0 KiB**

**Testimonial Images** (Unsplash):
- Total current: 326.3 KiB
- Total savings: 252.7 KiB (format + sizing)

### C. Network Dependency Chain
```
Initial Navigation (211 ms, 12.83 KiB)
  ├─ CSS (360 ms, 1.20 KiB)
  └─ CSS (514 ms, 29.76 KiB)
```

### D. Recommended Reading
- [Web.dev: Optimize Largest Contentful Paint](https://web.dev/optimize-lcp/)
- [Web.dev: Reduce JavaScript Execution Time](https://web.dev/bootup-time/)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Chrome DevTools: Analyze Runtime Performance](https://developer.chrome.com/docs/devtools/performance/)

---

**Document Owner**: Development Team
**Last Updated**: 2025-10-04
**Next Review**: After Phase 1 completion
