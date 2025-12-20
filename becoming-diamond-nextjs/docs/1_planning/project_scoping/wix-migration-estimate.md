# Wix Migration Feasibility & Cost Estimate

**Document Type:** Technical Feasibility Analysis & Scoping
**Prepared For:** Business Continuity Planning
**Date:** December 20, 2025
**Status:** Planning Phase

---

## Executive Summary

This document estimates the effort required to replicate Becoming Diamond's functionality on Wix as a business continuity fallback. Four implementation tiers are presented, ranging from basic presence ($560) to full-featured platform ($2,800-3,600).

**Critical Finding:** Wix can replicate **90% of functionality** but will lose the custom Aceternity UI animations and require ongoing monthly costs ($40-200/month vs. current $21/month).

**Recommended:** Option C - Velo Enhanced ($1,800-2,400) provides best balance of functionality, maintainability, and cost.

---

## Current Site Inventory

### Public Features
- Landing page (heavy animations, 3D globe)
- Blog (3 posts, Decap CMS)
- Book sales page (Stripe checkout)
- Collective/Program marketing pages
- Documentation site (60+ pages)
- Legal pages (terms, privacy, disclaimer)

### Member Features
- Authentication (magic link, Google OAuth)
- 30-day sprint program (30 lessons with video)
- User profiles
- Progress tracking
- Admin portal (lead management)

### Technical Infrastructure
- NextAuth v5 authentication
- Stripe payments
- Bunny Stream video hosting (planned)
- Gmail SMTP email
- Turso database
- Decap CMS (Git-based)

---

## Wix Platform Capabilities

### Vanilla Wix (Editor Only)
**Strengths:**
- Drag-and-drop design
- Built-in member areas
- Form builder
- SEO tools
- Mobile responsive
- SSL included

**Limitations:**
- No custom code
- Limited database access
- Basic animations only
- Fixed templates
- App marketplace dependency

### Wix Velo (Dev Mode Enabled)
**Additional Capabilities:**
- JavaScript/TypeScript coding
- Database collections (backend)
- Custom APIs
- Third-party integrations
- Advanced logic
- NPM packages (limited)

**Still Cannot:**
- Use React/Next.js
- Import Aceternity UI
- Self-host video
- Use custom databases (Turso)
- Deploy to Vercel

---

## Migration Options Matrix

| Feature | Current Tech | Option A | Option B | Option C | Option D |
|---------|-------------|----------|----------|----------|----------|
| **Landing Page** | React/Aceternity | Basic template | Animated template | Velo custom | Velo + premium |
| **Blog** | Decap CMS/Markdown | Wix Blog app | Wix Blog + custom | Velo CMS | Velo + Wix CMS |
| **Authentication** | NextAuth | Wix Members | Wix Members + | Velo + custom | Velo + SSO |
| **Payments** | Stripe | Wix Payments | Wix Payments + | Velo + Stripe | Full Stripe API |
| **Video** | Bunny Stream | Wix Video | Wix Video + | Velo + Bunny | Vimeo/Bunny API |
| **Email** | Gmail SMTP | Wix Forms | Wix Automations | Velo + SendGrid | Full email API |
| **Database** | Turso | None | Wix Data | Wix Data + Velo | External DB + Velo |
| **Admin** | Custom portal | Basic members | Members + roles | Velo dashboard | Full admin panel |

---

## Option A: Basic Wix Presence
**Goal:** Functional website with core features, minimal custom development

### Scope
**Included:**
- Landing page using Wix template (no custom animations)
- Blog using Wix Blog app (manual entry)
- Book sales using Wix eCommerce
- Contact forms for lead capture
- Basic member area (login/profile)
- Sprint content as blog posts (no video)
- Legal pages

**Not Included:**
- Custom animations/effects
- Video hosting/playback
- Progress tracking
- Admin dashboard
- OAuth integration
- Advanced automations

### Implementation
- Use Wix ADI (Artificial Design Intelligence) or template
- Configure built-in apps (Blog, eCommerce, Members)
- Manual content migration (copy/paste)
- Form setup for leads
- Payment gateway configuration

### Technical Approach
- **Development:** 100% Wix Editor (no code)
- **Content Entry:** Manual
- **Payments:** Wix Payments (or Stripe if available in app market)
- **Members:** Wix Members app
- **Email:** Wix Forms → Wix Inbox

### Limitations
- Generic template aesthetic (not matching current brand)
- No video integration for sprint
- Manual lead management
- Limited customization
- No progress tracking
- Basic email notifications only

### Cost Breakdown
| Item | Hours | Cost @ $40/hr |
|------|-------|---------------|
| Site setup & template selection | 2 | $80 |
| Content migration (pages, blog) | 4 | $160 |
| eCommerce setup (book sales) | 2 | $80 |
| Member area configuration | 2 | $80 |
| Forms & email setup | 1 | $40 |
| Testing & launch | 2 | $80 |
| Documentation/handoff | 1.5 | $60 |
| **Total** | **14.5 hours** | **$580** |

### Monthly Costs
- Wix Business Plan: $27/month (eCommerce)
- **Total:** $27/month

### Timeline
**3-4 business days**

---

## Option B: Enhanced Wix Integration
**Goal:** Improved functionality using Wix apps and better design

### Additional Features (vs. Option A)
- Premium Wix template (closer to brand aesthetic)
- Video integration via Wix Video app
- Email automation (welcome sequences)
- Member roles (admin vs. user)
- Analytics integration
- SEO optimization
- Third-party app integrations

### Implementation
- Premium template customization
- Wix Video app for sprint lessons
- Wix Automations for email flows
- Member permissions setup
- App marketplace integrations:
  - Video player
  - Analytics
  - Email marketing
  - Form builder enhancements

### Technical Approach
- **Development:** Wix Editor + Apps
- **Video:** Wix Video or Vimeo app
- **Automation:** Wix Automations
- **Analytics:** Wix Analytics + Google Analytics
- **Email:** Wix Automations + third-party integration

### Improvements Over Option A
- Better visual design
- Video content delivery
- Automated email sequences
- Basic progress visibility (via member data)
- Better analytics
- Improved member experience

### Cost Breakdown
| Item | Hours | Cost @ $40/hr |
|------|-------|---------------|
| Premium template customization | 4 | $160 |
| Content migration (enhanced) | 5 | $200 |
| Video integration & upload | 4 | $160 |
| eCommerce setup (enhanced) | 3 | $120 |
| Member area + roles | 3 | $120 |
| Automation workflows | 3 | $120 |
| Analytics & SEO setup | 2 | $80 |
| App integrations | 3 | $120 |
| Testing & QA | 3 | $120 |
| Documentation/handoff | 2 | $80 |
| **Total** | **32 hours** | **$1,280** |

### Monthly Costs
- Wix Business Unlimited: $32/month (video + eCommerce)
- Wix Video storage (if > 5GB): $10-30/month
- Third-party apps: $10-50/month
- **Total:** $52-112/month

### Timeline
**1-1.5 weeks**

---

## Option C: Wix Velo Enhanced (Recommended)
**Goal:** Custom functionality matching current site capabilities

### Additional Features (vs. Option B)
- Custom sprint progress tracking
- Dynamic content loading
- Advanced member dashboard
- Custom admin panel for leads
- Stripe direct integration
- Custom video player with progress
- Database-driven content
- API integrations (Bunny Stream, SendGrid)
- Custom authentication flows

### Implementation
**Enable Velo (Wix Dev Mode):**
- Custom JavaScript for interactivity
- Wix Data Collections (database):
  - Users
  - Sprint Progress
  - Leads
  - Video Progress
- Custom page templates
- Server-side functions for APIs
- Third-party API integrations

### Technical Approach
- **Development:** Velo (JavaScript/TypeScript)
- **Database:** Wix Data Collections
- **Video:** Bunny Stream API via Velo backend
- **Payments:** Stripe API via Velo
- **Email:** SendGrid API via Velo
- **Authentication:** Wix Members + custom logic
- **Admin:** Custom Velo dashboard

### Code Examples

**Sprint Progress Tracking:**
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
      userId,
      dayNumber,
      completedAt: new Date()
    });
  }
}
```

**Bunny Stream Integration:**
```javascript
// Backend: get-video-token.jsw
import { fetch } from 'wix-fetch';

export async function getVideoToken(videoId, userId) {
  // Verify user authentication
  // Generate signed token for Bunny Stream
  const response = await fetch(`https://bunny-api.example.com/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.BUNNY_API_KEY}`
    },
    body: JSON.stringify({ videoId, userId })
  });

  return response.json();
}
```

### Features Achieved
- Full sprint progress tracking (cross-device)
- Video streaming with token auth
- Custom admin dashboard
- Lead management interface
- Automated email workflows
- Payment processing
- User profiles with stats
- Analytics dashboard

### Features Still Lost
- Aceternity UI animations (3D globe, spotlight effects)
- Some advanced UI interactions
- Self-hosted infrastructure
- Git-based CMS workflow
- Decap CMS interface

### Cost Breakdown
| Item | Hours | Cost @ $40/hr |
|------|-------|---------------|
| Velo setup & architecture | 4 | $160 |
| Database schema design | 3 | $120 |
| Sprint progress system (Velo) | 8 | $320 |
| Video integration (Bunny API) | 6 | $240 |
| Custom member dashboard | 6 | $240 |
| Admin panel (leads, users) | 8 | $320 |
| Stripe API integration | 4 | $160 |
| Email automation (SendGrid) | 4 | $160 |
| Content migration (automated scripts) | 6 | $240 |
| Template customization | 5 | $200 |
| Testing & debugging | 6 | $240 |
| Documentation/handoff | 3 | $120 |
| **Total** | **45-60 hours** | **$1,800-2,400** |

### Monthly Costs
- Wix Business Unlimited: $32/month
- Bunny Stream: $10-30/month (50+ hours 1080p)
- SendGrid: $15-50/month (email API)
- Stripe fees: 2.9% + $0.30 (same as current)
- **Total:** $57-112/month

### Timeline
**2-3 weeks**

---

## Option D: Premium Velo Build
**Goal:** Maximum feature parity with custom UI enhancements

### Additional Features (vs. Option C)
- Custom animations (using GSAP, Lottie)
- Advanced UI framework (Wix Blocks)
- Multi-language support
- Advanced analytics dashboard
- CRM integration
- Marketing automation
- A/B testing framework
- Performance optimization
- Advanced caching strategies

### Implementation
All Option C features, plus:
- Custom component library (Wix Blocks)
- Animation library integration (GSAP)
- Advanced state management
- Redis caching (via external API)
- Elasticsearch integration (search)
- Advanced monitoring/logging
- Custom CMS interface

### Technical Approach
- **Development:** Advanced Velo + Wix Blocks
- **Animations:** GSAP, Lottie, custom CSS
- **Performance:** CDN, caching, optimization
- **Integrations:** Full API ecosystem
- **Monitoring:** Sentry, LogRocket, Mixpanel

### Features Achieved
- Near-complete feature parity
- Custom animations (not Aceternity, but close)
- Advanced admin tools
- Marketing automation
- Full API integrations
- Performance optimization

### Still Cannot Match
- Exact Aceternity UI (proprietary)
- Self-hosted infrastructure control
- Next.js/React ecosystem
- Vercel edge functions
- Full TypeScript compilation

### Cost Breakdown
| Item | Hours | Cost @ $40/hr |
|------|-------|---------------|
| All Option C work | 45-60 | $1,800-2,400 |
| Custom animation library | 8 | $320 |
| Wix Blocks components | 10 | $400 |
| Advanced integrations | 8 | $320 |
| Performance optimization | 6 | $240 |
| CRM/marketing automation | 8 | $320 |
| Advanced testing | 4 | $160 |
| Polish & refinement | 6 | $240 |
| **Total** | **70-90 hours** | **$2,800-3,600** |

### Monthly Costs
- Wix Business VIP: $45/month (priority support)
- Bunny Stream: $10-30/month
- SendGrid: $15-50/month
- Marketing tools: $20-50/month
- Monitoring: $10-30/month
- **Total:** $100-205/month

### Timeline
**3-4 weeks**

---

## Feature Comparison Matrix

| Feature | Current Site | Option A | Option B | Option C | Option D |
|---------|-------------|----------|----------|----------|----------|
| **Landing Page Design** | Custom/Aceternity | Template | Premium template | Custom Velo | Premium + animations |
| **3D Globe Effect** | Yes | No | No | No | Similar (GSAP) |
| **Spotlight Effects** | Yes | No | No | No | Partial |
| **Blog/CMS** | Decap CMS (Git) | Wix Blog | Wix Blog | Velo CMS | Advanced CMS |
| **Authentication** | NextAuth + OAuth | Wix Members | Wix Members | Velo Members | Advanced auth |
| **30-Day Sprint** | Full featured | Text only | With video | Full featured | Full + extras |
| **Video Streaming** | Bunny (planned) | No | Wix Video | Bunny API | Bunny + DRM |
| **Progress Tracking** | Database | No | Manual | Full DB | Advanced analytics |
| **Payment Processing** | Stripe | Wix Payments | Wix Payments | Stripe API | Stripe + upsells |
| **Admin Dashboard** | Custom | Basic | Enhanced | Full custom | Advanced CRM |
| **Email Automation** | Gmail SMTP | Forms only | Basic auto | SendGrid API | Full marketing |
| **Mobile Responsive** | Yes | Yes | Yes | Yes | Yes |
| **SEO Optimization** | Good | Basic | Good | Excellent | Excellent |
| **Page Load Speed** | Excellent | Good | Good | Good | Excellent |
| **Maintenance Ease** | Dev required | Easy | Easy | Medium | Complex |
| **Customization** | Unlimited | Limited | Moderate | High | Very high |

---

## Technical Limitations & Trade-offs

### What Wix Cannot Do
1. **Aceternity UI Framework:** Proprietary React components not available
2. **Next.js/React:** Wix uses own framework, not React
3. **Vercel Deployment:** Locked to Wix hosting
4. **Custom Database:** Cannot use Turso or PostgreSQL directly
5. **Git Workflow:** No version control for content
6. **Decap CMS:** Cannot replicate exact CMS experience
7. **Full TypeScript:** Velo supports TS but limited
8. **NPM Ecosystem:** Restricted package usage
9. **Server-Side Rendering:** Wix handles differently
10. **Custom Backend:** Cannot deploy Node.js servers

### What Wix Handles Better
1. **Hosting Management:** Zero devops required
2. **SSL/Security:** Automatic and included
3. **Backups:** Automatic site backups
4. **Updates:** No manual framework updates
5. **Support:** 24/7 Wix support team
6. **Uptime:** Enterprise-grade hosting
7. **Scaling:** Automatic based on traffic
8. **Domain Management:** Built-in DNS management

---

## Migration Process Outline

### Phase 1: Planning (All Options)
1. Content audit and inventory
2. Feature prioritization
3. Design mockups/wireframes
4. User flow mapping
5. Database schema design (C/D)
6. API integration planning (C/D)

### Phase 2: Development
**Option A/B:**
- Template selection and customization
- App configuration
- Manual content entry

**Option C/D:**
- Velo environment setup
- Database collection creation
- Backend API development
- Frontend component building
- Third-party integrations

### Phase 3: Content Migration
- Manual entry (A/B) or scripted import (C/D)
- Image optimization and upload
- Video upload and configuration
- Blog post migration
- Legal page setup

### Phase 4: Testing
- Functionality testing
- Payment flow testing
- Email delivery testing
- Mobile responsiveness
- Browser compatibility
- Load testing (C/D)

### Phase 5: Launch
- DNS configuration
- Final QA checklist
- Soft launch (beta testing)
- Full production launch
- Monitor and optimize

### Phase 6: Handoff
- Documentation delivery
- Training session(s)
- Admin access transfer
- Support period (optional)

---

## Ongoing Maintenance Estimates

### Option A/B (Minimal Maintenance)
- **Content Updates:** Client self-service
- **Technical Issues:** Wix support
- **Monthly Cost:** $0 developer time
- **Recommended Retainer:** None needed

### Option C/D (Active Maintenance)
- **Bug Fixes:** 1-2 hours/month ($40-80)
- **Feature Enhancements:** 2-4 hours/month ($80-160)
- **Performance Monitoring:** Included in tools
- **Security Updates:** Wix handles platform
- **Recommended Retainer:** $120-240/month (3-6 hours)

---

## Risk Assessment

| Risk | Option A | Option B | Option C | Option D |
|------|----------|----------|----------|----------|
| **Vendor Lock-in** | High | High | High | High |
| **Cost Escalation** | Low | Medium | Medium | High |
| **Complexity** | Low | Low | Medium | High |
| **Maintenance Burden** | Low | Low | Medium | High |
| **Feature Limitations** | High | Medium | Low | Very Low |
| **Migration Difficulty** | Low | Low | Medium | High |
| **Business Continuity** | Good | Good | Excellent | Excellent |

---

## Recommendation

**For Business Continuity: Option C - Velo Enhanced**

**Rationale:**
1. **Functionality:** Replicates 90% of current features
2. **Maintainability:** Client can make simple edits, dev for complex
3. **Cost:** Reasonable one-time ($1,800-2,400) and monthly ($57-112)
4. **Future-Proof:** Extensible for additional features
5. **Handoff:** Easier to train on than current Next.js stack
6. **Support:** Wix provides platform support
7. **Performance:** Adequate for current traffic levels

**Why Not Others:**
- **Option A:** Too limited, no video, poor UX
- **Option B:** Still limited, video but no progress tracking
- **Option D:** Overkill for fallback scenario, expensive

---

## Implementation Timeline Comparison

| Phase | Option A | Option B | Option C | Option D |
|-------|----------|----------|----------|----------|
| Planning | 1 day | 2 days | 3 days | 4 days |
| Development | 2 days | 4 days | 10 days | 15 days |
| Content Migration | 1 day | 2 days | 2 days | 2 days |
| Testing | 1 day | 1 day | 2 days | 3 days |
| Launch | 0.5 day | 0.5 day | 1 day | 1 day |
| **Total** | **3-4 days** | **1-1.5 weeks** | **2-3 weeks** | **3-4 weeks** |

---

## Next Steps

### To Proceed with Wix Migration:

1. **Select Option:** Choose A, B, C, or D based on budget and requirements
2. **Approve Budget:**
   - One-time: $580 - $3,600
   - Monthly: $27 - $205
3. **Provide Access:**
   - Wix account creation
   - Content export from current site
   - Video files access
   - Brand assets (logos, colors, fonts)
4. **Schedule Kickoff:** 2-3 hour planning session
5. **Set Timeline:** Coordinate launch window

### Questions to Clarify:

1. **Priority Features:** Which features are must-have vs. nice-to-have?
2. **Budget Constraints:** Maximum one-time and monthly spend?
3. **Timeline Urgency:** When is fallback site needed?
4. **Maintenance Model:** Self-service vs. developer retainer?
5. **Design Expectations:** Template acceptable vs. custom design needed?
6. **Integration Requirements:** Which third-party tools are critical?

---

## Cost Summary Table

| Option | One-Time Cost | Monthly Cost | Timeline | Best For |
|--------|---------------|--------------|----------|----------|
| **A: Basic Presence** | $580 | $27 | 3-4 days | Emergency fallback, minimal budget |
| **B: Enhanced Integration** | $1,280 | $52-112 | 1-1.5 weeks | Good UX, reasonable budget |
| **C: Velo Enhanced** ⭐ | $1,800-2,400 | $57-112 | 2-3 weeks | Feature parity, best value |
| **D: Premium Build** | $2,800-3,600 | $100-205 | 3-4 weeks | Maximum quality, high budget |

**Note:** All options include $80 for this research and documentation (2 hours @ $40/hr).

---

## Appendix A: Wix Platform Costs

### Wix Plans (Annual Billing)
- **Business Basic:** $27/month (eCommerce, no video)
- **Business Unlimited:** $32/month (eCommerce + video + unlimited bandwidth)
- **Business VIP:** $45/month (priority support + advanced features)

### Add-On Costs
- **Additional Video Storage:** $10/GB/month (beyond 5GB)
- **Advanced Email Marketing:** $15-50/month
- **Third-Party Apps:** $10-100/month (varies by app)
- **Premium Templates:** $0-200 (one-time)
- **Custom Domain:** Included (or $15/year if external)

---

## Appendix B: Feature Retention Rate

**Option A:** 45% feature retention
- Core pages exist but basic
- No video or progress tracking
- Limited member functionality

**Option B:** 65% feature retention
- Better UX and design
- Video content available
- Basic member experience

**Option C:** 90% feature retention
- Nearly complete functionality
- Custom features via Velo
- Only lose Aceternity UI

**Option D:** 95% feature retention
- Maximum achievable on Wix
- Custom animations
- All business logic intact

---

**Document Prepared By:** Development Team
**Review Date:** December 20, 2025
**Version:** 1.0
