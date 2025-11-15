# Mobile Bug Quick-Start Guide
## Immediate Production Fix (4 Hours)

**Problem:** Mobile-only client-side exception preventing app from rendering
**Goal:** Capture error details and deploy fix within 4 hours
**Status:** READY TO IMPLEMENT

---

## Implementation Checklist

### Phase 1: Error Capture (90 minutes)

#### [ ] Step 1: Create Error Boundary (30 min)
Create `/src/app/error.tsx`:
```typescript
'use client';

import { useEffect } from 'react';
import { log } from '@/lib/axiom-logger';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    log.error('React Error Boundary Caught Error', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      route: window.location.pathname,
      userAgent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      devicePixelRatio: window.devicePixelRatio,
    });
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4">
      <div className="max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <p className="text-gray-400 mb-6">
          We've been notified and are looking into it.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-primary text-black rounded-lg font-semibold hover:bg-primary/90 transition"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
```

#### [ ] Step 2: Create Global Error Boundary (20 min)
Create `/src/app/global-error.tsx`:
```typescript
'use client';

import { useEffect } from 'react';
import { log } from '@/lib/axiom-logger';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    log.error('Global Error Boundary - Critical Failure', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      route: typeof window !== 'undefined' ? window.location.pathname : 'unknown',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      viewport: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'unknown',
    });
  }, [error]);

  return (
    <html>
      <body className="bg-black text-white">
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <h2 className="text-2xl font-bold mb-4">Application Error</h2>
          <p className="text-gray-400 mb-6">Please refresh the page.</p>
          <button
            onClick={reset}
            className="px-6 py-3 bg-primary text-black rounded-lg font-semibold"
          >
            Refresh
          </button>
        </div>
      </body>
    </html>
  );
}
```

#### [ ] Step 3: Create Client Error Tracker (30 min)
Create `/src/lib/client-error-tracking.ts`:
```typescript
'use client';

import { log } from '@/lib/axiom-logger';

export function initClientErrorTracking() {
  if (typeof window === 'undefined') return;

  // Track unhandled errors
  window.addEventListener('error', (event) => {
    log.error('Unhandled JavaScript Error', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack,
      timestamp: new Date().toISOString(),
      route: window.location.pathname,
      userAgent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      devicePixelRatio: window.devicePixelRatio,
      isMobile: /iPhone|iPad|Android/i.test(navigator.userAgent),
    });
  });

  // Track unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    log.error('Unhandled Promise Rejection', {
      reason: event.reason,
      promise: String(event.promise),
      timestamp: new Date().toISOString(),
      route: window.location.pathname,
      userAgent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      isMobile: /iPhone|iPad|Android/i.test(navigator.userAgent),
    });
  });

  // Track React hydration errors
  const originalConsoleError = console.error;
  console.error = (...args: any[]) => {
    const message = args[0];
    if (
      typeof message === 'string' &&
      (message.includes('Hydration') || message.includes('hydration'))
    ) {
      log.error('React Hydration Error', {
        message: args.join(' '),
        timestamp: new Date().toISOString(),
        route: window.location.pathname,
        userAgent: navigator.userAgent,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        isMobile: /iPhone|iPad|Android/i.test(navigator.userAgent),
      });
    }
    originalConsoleError.apply(console, args);
  };

  // Log initial page load context
  log.info('Client Initialized', {
    timestamp: new Date().toISOString(),
    route: window.location.pathname,
    userAgent: navigator.userAgent,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    devicePixelRatio: window.devicePixelRatio,
    isMobile: /iPhone|iPad|Android/i.test(navigator.userAgent),
    browserFeatures: {
      webGL: !!document.createElement('canvas').getContext('webgl'),
      serviceWorker: 'serviceWorker' in navigator,
      localStorage: typeof Storage !== 'undefined',
    },
  });
}
```

#### [ ] Step 4: Update Root Layout (10 min)
Edit `/src/app/layout.tsx` - add these changes:
```typescript
"use client";
import { useEffect } from "react"; // ADD THIS IMPORT
import { initClientErrorTracking } from "@/lib/client-error-tracking"; // ADD THIS IMPORT
// ... other imports

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // ADD THIS useEffect
  useEffect(() => {
    initClientErrorTracking();
  }, []);

  return (
    // ... existing return statement
  );
}
```

---

### Phase 2: Deploy & Monitor (60 minutes)

#### [ ] Step 5: Test Locally (15 min)
```bash
# Run build to check for errors
npm run build

# Test locally
npm run dev

# Open in browser and trigger an error manually
# Verify error boundary displays
```

#### [ ] Step 6: Deploy to Production (15 min)
```bash
# Commit changes
git add .
git commit -m "feat: add comprehensive error tracking and boundaries for mobile debugging"

# Push to production
git push origin main

# Vercel will auto-deploy
```

#### [ ] Step 7: Monitor Axiom Dashboard (30 min)
1. Open Axiom: https://app.axiom.co/
2. Select dataset: `becoming-diamond-prod`
3. Run query:
```apl
['becoming-diamond-prod']
| where ['_time'] > ago(1h)
| where level == 'error'
| where isMobile == true
| project ['_time'], message, stack, userAgent, viewport, route
| sort by ['_time'] desc
```

4. Test on mobile devices:
   - iPhone (Chrome)
   - iPhone (Safari)
   - Android (Chrome)

5. Watch for errors in real-time

---

### Phase 3: Root Cause Analysis (90 minutes)

#### [ ] Step 8: Identify Error Pattern (30 min)
Once error appears in Axiom, analyze:
- **Error message:** What component/library is failing?
- **Stack trace:** Which line of code?
- **Device context:** iOS vs Android? Specific browsers?
- **Viewport size:** Does it only happen on small screens?
- **Route:** Which page is affected?

Common culprits:
1. **Hydration mismatch:** SSR HTML ≠ CSR HTML
   - Look for: `window.innerWidth`, `navigator.userAgent` in render
   - Fix: Move to `useEffect` or use CSS media queries

2. **3D components failing on mobile:**
   - Look for: WebGL errors, Three.js errors
   - Fix: Add `ssr: false` to dynamic imports, disable on mobile

3. **Browser API unavailable:**
   - Look for: IntersectionObserver, ResizeObserver errors
   - Fix: Add polyfill or feature detection

4. **Memory exhaustion:**
   - Look for: Out of memory errors
   - Fix: Reduce animations, lazy load components

#### [ ] Step 9: Create Targeted Fix (45 min)
Based on error identified, implement fix. Examples:

**If hydration mismatch:**
```typescript
// BAD: Causes hydration mismatch
function Component() {
  const isMobile = window.innerWidth < 768;
  return <div>{isMobile ? 'Mobile' : 'Desktop'}</div>;
}

// GOOD: Use CSS or client-only render
function Component() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  return <div>{isMobile ? 'Mobile' : 'Desktop'}</div>;
}
```

**If 3D component failing:**
```typescript
// Add mobile detection and fallback
const World = dynamic(
  () => import('@/components/ui/globe').then((m) => m.World),
  {
    ssr: false,
    loading: () => <div className="h-[600px] bg-black/50" />,
  }
);

function GlobeSection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|Android/i.test(navigator.userAgent));
  }, []);

  if (isMobile) {
    return <SimpleFallbackVisual />;
  }

  return <World data={sampleArcs} globeConfig={globeConfig} />;
}
```

#### [ ] Step 10: Test & Redeploy (15 min)
```bash
# Test fix locally on mobile device
# Connect phone to dev server via network

# Deploy fix
git add .
git commit -m "fix: resolve mobile-only rendering error in [component]"
git push origin main
```

---

### Phase 4: Verification (60 minutes)

#### [ ] Step 11: Monitor Error Resolution (30 min)
After deployment:
1. Wait 10 minutes for deployment
2. Test on real mobile devices again
3. Check Axiom for errors:
```apl
['becoming-diamond-prod']
| where ['_time'] > ago(30m)
| where level == 'error'
| where isMobile == true
| summarize count() by message
```

Expected result: 0 errors (or significantly reduced)

#### [ ] Step 12: Document Findings (30 min)
Create post-mortem in `/docs/incidents/`:
```markdown
# Mobile Rendering Error - 2025-11-15

## Summary
Mobile users experienced "Application error: a client-side exception"
preventing app from loading.

## Root Cause
[Fill in based on your findings]

## Timeline
- 00:00 - Error tracking deployed
- 00:30 - Error captured in Axiom
- 01:00 - Root cause identified: [cause]
- 01:45 - Fix implemented
- 02:15 - Fix deployed
- 02:45 - Verified resolution

## Fix
[Describe the fix]

## Prevention
- Added error boundaries to catch future issues
- Added mobile-specific testing to CI/CD
- Added monitoring dashboard for mobile errors
```

---

## Success Criteria

✅ **Error captured in Axiom with full context**
✅ **Root cause identified within 2 hours**
✅ **Fix deployed within 4 hours**
✅ **Zero mobile errors in 24 hours post-fix**
✅ **Error boundaries prevent future blank screens**

---

## Rollback Plan

If fix causes new issues:
```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or rollback in Vercel dashboard
# https://vercel.com/becomingdiamond/deployments
# Click "..." on previous deployment → "Promote to Production"
```

---

## Emergency Contacts

- **Axiom Dashboard:** https://app.axiom.co/
- **Vercel Dashboard:** https://vercel.com/becomingdiamond
- **Slack Channel:** #engineering-alerts (create if needed)

---

## Post-Fix Actions

Once mobile error is resolved:
1. [ ] Implement comprehensive error tracking (see main report)
2. [ ] Set up production error dashboard
3. [ ] Configure critical alerts (payment, auth, mobile errors)
4. [ ] Add mobile-specific E2E tests
5. [ ] Schedule weekly error review meetings

---

## Common Axiom Queries

**All mobile errors (last hour):**
```apl
['becoming-diamond-prod']
| where ['_time'] > ago(1h)
| where isMobile == true
| where level == 'error'
```

**Error count by route:**
```apl
['becoming-diamond-prod']
| where ['_time'] > ago(1h)
| where level == 'error'
| summarize count() by route
| sort by count_ desc
```

**Hydration errors only:**
```apl
['becoming-diamond-prod']
| where ['_time'] > ago(1h)
| where message contains "Hydration"
```

**Device breakdown:**
```apl
['becoming-diamond-prod']
| where ['_time'] > ago(1h)
| where level == 'error'
| summarize count() by userAgent
| sort by count_ desc
```

---

## Next Steps

After immediate fix:
1. Review full observability report: `/docs/reports/observability-error-tracking-plan.md`
2. Implement Phase 2 (comprehensive tracking)
3. Implement Phase 3 (dashboards)
4. Implement Phase 4 (alerting)

**Total Additional Time:** 16 hours over next 2 weeks
**Outcome:** Production-grade error monitoring
