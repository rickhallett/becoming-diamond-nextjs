# Wix Migration Feasibility & Cost Estimate

**Document Type:** Technical Feasibility Analysis & Scoping
**Date:** December 20, 2025
**Status:** Planning Phase

---

## Executive Summary

Four implementation tiers available ($580-3,600 one-time, $27-205/month ongoing) to replicate Becoming Diamond functionality on Wix for business continuity. Wix can replicate 45-95% of features depending on tier, but will lose Aceternity UI animations. Monthly costs increase 2-9x vs. current $21/month.

---

## Current Site Inventory

**Public:** Landing page, blog (3 posts), book sales, collective/program pages, docs (60+ pages), legal pages
**Members:** Authentication (magic link, OAuth), 30-day sprint (30 videos), profiles, progress tracking, admin portal
**Technical:** NextAuth v5, Stripe, Bunny Stream (planned), Gmail SMTP, Turso DB, Decap CMS

---

## Wix Platform Capabilities

### Vanilla Wix (Editor Only)
Drag-and-drop design, built-in members, forms, SEO, mobile responsive, SSL. Cannot use custom code, limited database access, basic animations only, fixed templates.

### Wix Velo (Dev Mode)
JavaScript/TypeScript coding, database collections, custom APIs, third-party integrations, advanced logic, limited NPM packages. Still cannot use React/Next.js, Aceternity UI, self-host video, custom databases (Turso), or deploy to Vercel.

---

## Migration Options

| Option | One-Time | Monthly | Timeline | Features | Dev Approach |
|--------|----------|---------|----------|----------|--------------|
| **A: Basic Presence** | $580 | $27 | 3-4 days | 45% | Wix Editor only |
| **B: Enhanced Integration** | $1,280 | $52-112 | 1-1.5 weeks | 65% | Editor + Apps |
| **C: Velo Enhanced** | $1,800-2,400 | $57-112 | 2-3 weeks | 90% | Velo + APIs |
| **D: Premium Build** | $2,800-3,600 | $100-205 | 3-4 weeks | 95% | Advanced Velo |

---

## Option A: Basic Presence ($580, 3-4 days)

**Scope:** Landing page (template), blog (Wix app), book sales (Wix eCommerce), contact forms, basic members, sprint content as text (no video), legal pages.

**Excluded:** Custom animations, video hosting, progress tracking, admin dashboard, OAuth, automations.

**Implementation:** Wix ADI/template, built-in apps (Blog, eCommerce, Members), manual content entry, form setup, payment gateway config.

**Cost Breakdown:**
| Task | Hours | Cost |
|------|-------|------|
| Site setup & template | 2 | $80 |
| Content migration | 4 | $160 |
| eCommerce setup | 2 | $80 |
| Member area config | 2 | $80 |
| Forms & email | 1 | $40 |
| Testing & launch | 2 | $80 |
| Documentation | 1.5 | $60 |
| **Total** | **14.5** | **$580** |

**Monthly:** Wix Business Plan ($27)

---

## Option B: Enhanced Integration ($1,280, 1-1.5 weeks)

**Additional vs. A:** Premium template, video integration (Wix Video), email automation, member roles, analytics, SEO optimization, third-party apps.

**Implementation:** Premium template customization, Wix Video/Vimeo app for sprint lessons, Wix Automations for email, member permissions, app marketplace integrations.

**Cost Breakdown:**
| Task | Hours | Cost |
|------|-------|------|
| Premium template customization | 4 | $160 |
| Content migration (enhanced) | 5 | $200 |
| Video integration & upload | 4 | $160 |
| eCommerce (enhanced) | 3 | $120 |
| Member area + roles | 3 | $120 |
| Automation workflows | 3 | $120 |
| Analytics & SEO | 2 | $80 |
| App integrations | 3 | $120 |
| Testing & QA | 3 | $120 |
| Documentation | 2 | $80 |
| **Total** | **32** | **$1,280** |

**Monthly:** Wix Business Unlimited ($32), Wix Video storage ($10-30), third-party apps ($10-50) = $52-112 total

---

## Option C: Velo Enhanced ($1,800-2,400, 2-3 weeks)

**Additional vs. B:** Sprint progress tracking (database), dynamic content loading, admin panel for leads, Stripe direct integration, custom video player with progress, database-driven content, API integrations (Bunny Stream, SendGrid), custom auth flows.

**Implementation:** Velo dev mode enabled, Wix Data Collections (Users, Sprint Progress, Leads, Video Progress), custom page templates, server-side functions, third-party API integrations.

**Code Example - Sprint Progress:**
```javascript
// Backend: save-progress.jsw
import wixData from 'wix-data';

export async function saveProgress(dayNumber, userId) {
  const progress = await wixData.query('SprintProgress')
    .eq('userId', userId)
    .eq('dayNumber', dayNumber)
    .find();

  if (progress.items.length === 0) {
    await wixData.insert('SprintProgress', {
      userId, dayNumber, completedAt: new Date()
    });
  }
}
```

**Features Achieved:** Full sprint progress, video streaming with token auth, custom admin dashboard, lead management, automated emails, payment processing, user profiles with stats.

**Still Lost:** Aceternity UI animations (3D globe, spotlight), some advanced UI interactions, self-hosted infrastructure, Git-based CMS, Decap CMS interface.

**Cost Breakdown:**
| Task | Hours | Cost |
|------|-------|------|
| Velo setup & architecture | 4 | $160 |
| Database schema | 3 | $120 |
| Sprint progress system | 8 | $320 |
| Video integration (Bunny API) | 6 | $240 |
| Member dashboard | 6 | $240 |
| Admin panel | 8 | $320 |
| Stripe API integration | 4 | $160 |
| Email automation (SendGrid) | 4 | $160 |
| Content migration (automated) | 6 | $240 |
| Template customization | 5 | $200 |
| Testing & debugging | 6 | $240 |
| Documentation | 3 | $120 |
| **Total** | **45-60** | **$1,800-2,400** |

**Monthly:** Wix Business Unlimited ($32), Bunny Stream ($10-30), SendGrid ($15-50) = $57-112 total

---

## Option D: Premium Build ($2,800-3,600, 3-4 weeks)

**Additional vs. C:** Custom animations (GSAP, Lottie), advanced UI framework (Wix Blocks), multi-language support, advanced analytics dashboard, CRM integration, marketing automation, A/B testing, performance optimization, caching strategies.

**Implementation:** Advanced Velo + Wix Blocks, animation libraries (GSAP), advanced state management, Redis caching (via API), Elasticsearch integration, monitoring/logging, custom CMS interface.

**Features Achieved:** Near-complete parity, custom animations (not Aceternity but close), advanced admin tools, marketing automation, full API integrations, performance optimization.

**Cannot Match:** Exact Aceternity UI, self-hosted infrastructure control, Next.js/React ecosystem, Vercel edge functions, full TypeScript compilation.

**Cost Breakdown:**
| Task | Hours | Cost |
|------|-------|------|
| All Option C work | 45-60 | $1,800-2,400 |
| Custom animation library | 8 | $320 |
| Wix Blocks components | 10 | $400 |
| Advanced integrations | 8 | $320 |
| Performance optimization | 6 | $240 |
| CRM/marketing automation | 8 | $320 |
| Advanced testing | 4 | $160 |
| Polish & refinement | 6 | $240 |
| **Total** | **70-90** | **$2,800-3,600** |

**Monthly:** Wix Business VIP ($45), Bunny Stream ($10-30), SendGrid ($15-50), marketing tools ($20-50), monitoring ($10-30) = $100-205 total

---

## Feature Comparison

| Feature | Current | Option A | Option B | Option C | Option D |
|---------|---------|----------|----------|----------|----------|
| Custom Animations | ✅ | ❌ | ❌ | ❌ | ⚠️ (GSAP) |
| 30-Day Sprint | ✅ | ❌ (text only) | ⚠️ (video) | ✅ | ✅ |
| Video Streaming | ✅ | ❌ | ✅ (Wix Video) | ✅ (Bunny API) | ✅ (Bunny + DRM) |
| Progress Tracking | ✅ | ❌ | ❌ | ✅ (database) | ✅ (advanced) |
| Stripe Payments | ✅ | ⚠️ (Wix Pay) | ⚠️ (Wix Pay) | ✅ (API) | ✅ (full API) |
| Admin Dashboard | ✅ | ❌ | ⚠️ (basic) | ✅ (custom) | ✅ (advanced) |
| Email Automation | ✅ | ❌ | ✅ (Wix Auto) | ✅ (SendGrid) | ✅ (full marketing) |
| Maintenance Ease | ❌ (dev req) | ✅ (self-service) | ✅ (self-service) | ⚠️ (medium) | ⚠️ (complex) |

Legend: ✅ Full | ⚠️ Partial | ❌ None

---

## Technical Limitations

**Wix Cannot:**
- Use Aceternity UI, Next.js/React
- Deploy to Vercel or custom databases
- Git-based CMS workflow (Decap)
- Full TypeScript compilation
- Unlimited NPM packages

**Wix Handles Better:**
- Zero devops, automatic SSL/backups
- No framework updates needed
- 24/7 platform support
- Enterprise uptime, automatic scaling

---

## Migration Process

1. **Planning:** Content audit, feature prioritization, design mockups, database schema (C/D), API planning (C/D)
2. **Development:** Template/Velo setup, database creation, API development (C/D), component building, integrations
3. **Content Migration:** Manual entry (A/B) or scripted import (C/D), image/video upload, blog posts, legal pages
4. **Testing:** Functionality, payments, email delivery, mobile/browser compatibility, load testing (C/D)
5. **Launch:** DNS config, QA checklist, soft launch, production, monitoring
6. **Handoff:** Documentation, training, admin access transfer

---

## Ongoing Maintenance

**Options A/B:** Client self-service content updates, Wix support for technical issues. No developer retainer needed.

**Options C/D:** Bug fixes (1-2 hrs/month, $40-80), feature enhancements (2-4 hrs/month, $80-160). Recommended retainer: $120-240/month (3-6 hours).

---

## Risk Assessment

| Risk | Option A | Option B | Option C | Option D |
|------|----------|----------|----------|----------|
| Vendor Lock-in | High | High | High | High |
| Cost Escalation | Low | Medium | Medium | High |
| Complexity | Low | Low | Medium | High |
| Maintenance Burden | Low | Low | Medium | High |
| Feature Limitations | High | Medium | Low | Very Low |

---

## Cost Summary

| Component | Option A | Option B | Option C | Option D |
|-----------|----------|----------|----------|----------|
| **One-Time** | $580 | $1,280 | $1,800-2,400 | $2,800-3,600 |
| **Monthly** | $27 | $52-112 | $57-112 | $100-205 |
| **vs. Current ($21)** | +$6 (1.3x) | +$31-91 (2.5-5.3x) | +$36-91 (2.7-5.3x) | +$79-184 (4.8-9.8x) |

All options include initial research and scoping ($80).

---

## Next Steps

1. Select option based on budget and feature requirements
2. Approve one-time and monthly costs
3. Create Wix account and grant developer access
4. Provide content export, video files, brand assets
5. Schedule 2-3 hour planning session
6. Coordinate launch timeline

---

**Document Prepared By:** Development Team
**Review Date:** December 20, 2025
**Version:** 1.0
