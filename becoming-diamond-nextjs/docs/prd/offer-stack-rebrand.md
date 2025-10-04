# PRD: Offer Stack Rebrand - Four-Tier Transformation Path

**Status**: Draft
**Priority**: High
**Estimated Effort**: 8-12 hours
**Last Updated**: 2025-10-04

---

## Executive Summary

This PRD documents a **major rebrand** of the Becoming Diamond offer stack from a 2-program structure to a 4-tier progression model. The rebrand aligns with the recent "Pressure Room" (PR) terminology migration and introduces clearer value ladders with revised pricing and positioning.

**Key Changes:**
- **Current**: 2 distinct programs (Diamond Activation Experience with 3 tiers + DiamondMind Collective)
- **Proposed**: 4 progressive tiers building on each other (Diamond Advantage → Diamond Edge Mastery → Pressure Room One → DiamondMind Immersion)
- **Pricing Restructure**: $97 → $497 → $1,997 → $7,995
- **Messaging Shift**: From "activation" to "transformation path" with clearer progression and outcomes
- **CTA Updates**: All button text and program descriptions require updates

---

## Current State Analysis

### Current Offer Structure (2 Programs)

#### Program 1: Diamond Activation Experience
**Location**: `/src/app/program/page.tsx` (lines 102-189)

**Tiers:**
1. **Recorded Version** - $97
   - Full Diamond Operating System Course
   - Swiss Army Knife Toolkit
   - ART & ART² Protocols
   - 30-Day Diamond Sprint Tracker
   - Lifetime Access

2. **Full Program** - $497 (Most Popular)
   - Everything in Recorded Version
   - 3 Live Coaching Calls with Michael
   - Emotional Mastery Mini-Course ($497 value)
   - Influence Masterclass ($297 value)
   - Private Diamond Forum (Priceless)
   - Total Value: $2,488

3. **Premium** - $3,000
   - Everything in Full Program
   - Private 1-on-1 Sessions
   - Priority Support
   - Custom Action Plan
   - Personalized Accountability

**CTAs:**
- "Get Started" (Recorded)
- "Start Your Transformation" (Full)
- "Apply Now" (Premium)

#### Program 2: DiamondMind Collective
**Location**: `/src/app/collective/page.tsx`, `/src/app/page.tsx` (lines 374-408)

**Description**: "Yearlong transformation journey through 5 Pressure Rooms for emerging leaders. Limited to 50 members per cohort."

**Features:**
- 12-month guided journey
- 5 transformational Pressure Rooms (PR I-V: Stabilize, Shift, Strengthen, Shine, Synthesize)
- DiamondMindAI support

**Pricing**: Not explicitly stated in current copy (implied premium tier)

**CTA**: "Explore the Collective"

---

## Proposed Changes

### New Offer Structure (4 Tiers)

#### Tier 1: Diamond Advantage – $97
**Positioning**: "Feel Calm, Clear, and Centered—Even in Chaos"

**Headline**: "Regain control of your emotions and your focus, no matter what life throws at you."

**Benefits:**
- Master one simple practice to stay calm under pressure
- Build daily habits that create unshakable peace
- Reclaim your mental clarity—even in the middle of stress

**Includes:**
- 30-day tracker to measure your progress
- Practice prompts to keep you consistent
- Lifetime access to tools that keep you grounded

**Target Audience**: "Perfect for anyone who feels overwhelmed and needs to reset fast."

**CTA**: "Access the Diamond Advantage"

---

#### Tier 2: Diamond Edge Mastery – $497
**Positioning**: "Own the Room. Command Respect. Rise with Confidence."

**Headline**: "Step into your power and become magnetic in any situation."

**Features:**
- Everything in Diamond Advantage
- 2 live experiential sessions to integrate your new skills
- 1 immersive 5-hour Diamond Seminar for a deep, lasting shift
- Access to a private community of high-achievers
- Ongoing exercises to keep you sharp and growing

**Target Audience**: "Perfect for those ready to feel strong, clear, and unstoppable in real time."

**CTA**: "Step Into Diamond Edge Mastery"

---

#### Tier 3: Pressure Room One – $1,997
**Positioning**: "Step Into the Fire. Walk Out Unshakable."

**Headline**: "Transform how you handle stress and pressure—forever."

**Features:**
- Everything in Diamond Edge Mastery
- Full access to the 3-day Pressure Room One experience
- Train under real-world tension and rewire your nervous system
- Master control over your emotions in any situation
- Step into your new presence—strong, clear, undeniable

**Target Audience**: "Perfect for those ready to experience the shift—not just think about it."

**CTA**: "Enter Pressure Room One"

---

#### Tier 4: DiamondMind Immersion – $7,995
**Positioning**: "The Ultimate Transformation: Live Unshakable Every Day."

**Headline**: "A yearlong journey to become emotionally grounded, energetically powerful, and irreplaceable."

**Features:**
- Everything in Pressure Room One
- 5x 3-day Pressure Room Intensives (22 hours each)
- 5x 2-hour Integration Labs to refine and practice your skills
- Digital platform access for ongoing learning
- Surround yourself with others becoming their clearest, strongest selves
- Build emotional precision, energetic strength, and inner steadiness
- Create a personal legacy plan to reshape your role, relationships, and reality

**Target Audience**: "Perfect for those ready to live from the Diamond frequency—every single day."

**CTA**: "Begin Your DiamondMind Immersion"

---

## Detailed Diff Analysis

### Section Header Changes

| Current | Proposed | Character Δ | Impact |
|---------|----------|-------------|---------|
| "Choose Your **Transformation** Path" | "Choose Your Transformation Path" | -4 (removed markdown bold) | Minor - formatting change |
| "From self-paced courses to yearlong coaching—find the right fit for your journey" | "From a quick clarity reset to full-body reinvention—this is your pressure-proof path forward." | +29 | Moderate - may affect layout |

### Program Name Changes

| Current | Proposed | Type | Impact |
|---------|----------|------|--------|
| Diamond Activation Experience | Diamond Advantage | Rename (Entry Tier) | Complete restructure |
| Diamond Activation Experience - Full Program | Diamond Edge Mastery | Rename (Mid Tier) | Complete restructure |
| Diamond Activation Experience - Premium | Pressure Room One | Rename + Repositioning | Major change |
| DiamondMind Collective | DiamondMind Immersion | Rename | Moderate change |

### Pricing Changes

| Tier | Current Price | Proposed Price | Δ | % Change |
|------|---------------|----------------|---|----------|
| Tier 1 (Entry) | $97 | $97 | $0 | 0% |
| Tier 2 (Mid) | $497 | $497 | $0 | 0% |
| Tier 3 (Advanced) | $3,000 | $1,997 | -$1,003 | -33.4% |
| Tier 4 (Premium) | Unspecified | $7,995 | N/A | New pricing |

**Critical Observation**: Tier 3 pricing **decreased** significantly ($3,000 → $1,997), while Tier 4 introduced higher premium pricing ($7,995).

### Messaging & Tone Changes

| Element | Current | Proposed | Analysis |
|---------|---------|----------|----------|
| **Tone** | Descriptive, feature-focused | Action-oriented, outcome-focused | Stronger emotional appeal |
| **Language** | "Complete online transformation program" | "Feel Calm, Clear, and Centered—Even in Chaos" | Direct benefit statements |
| **Positioning** | Three tiers of one program | Four distinct transformation stages | Value ladder clearer |
| **CTA Voice** | "View Program Details", "Start Your Transformation" | "Access the Diamond Advantage", "Step Into Diamond Edge Mastery" | More commanding, specific |

### Feature Comparison Table

#### Tier 1: Diamond Advantage vs. Current Recorded Version

| Feature | Current ($97) | Proposed ($97) |
|---------|---------------|----------------|
| Course Access | Full Diamond Operating System Course | 30-day tracker |
| Tools | Swiss Army Knife Toolkit, ART & ART² Protocols | Practice prompts |
| Sprint | 30-Day Diamond Sprint Tracker | Included in tracker |
| Access | Lifetime Access | Lifetime access to tools |

**Observation**: Proposed version appears **less comprehensive** - removed explicit mention of full course, Swiss Army Knife Toolkit, and ART protocols.

#### Tier 2: Diamond Edge Mastery vs. Current Full Program

| Feature | Current ($497) | Proposed ($497) |
|---------|---------------|----------------|
| Base Features | Everything in Recorded Version | Everything in Diamond Advantage |
| Live Sessions | 3 Live Coaching Calls with Michael | 2 live experiential sessions + 1 immersive 5-hour Diamond Seminar |
| Courses | Emotional Mastery Mini-Course ($497), Influence Masterclass ($297) | NOT mentioned |
| Community | Private Diamond Forum (Priceless) | Access to a private community of high-achievers |
| Ongoing | N/A | Ongoing exercises to keep you sharp and growing |

**Observation**: Different value stack - fewer coaching calls (2 vs 3) but adds 5-hour seminar. Removes explicit mention of bonus courses.

#### Tier 3: Pressure Room One vs. Current Premium

| Feature | Current ($3,000) | Proposed ($1,997) |
|---------|------------------|-------------------|
| Base Features | Everything in Full Program | Everything in Diamond Edge Mastery |
| Core Experience | Private 1-on-1 Sessions | Full access to 3-day Pressure Room One experience |
| Support | Priority Support, Personalized Accountability | NOT explicitly mentioned |
| Custom | Custom Action Plan | NOT mentioned |
| Focus | 1-on-1 mentoring | Group immersive experience |

**Observation**: Fundamental repositioning from **1-on-1 premium mentoring** to **group immersive intensive**. Lower price reflects this shift.

#### Tier 4: DiamondMind Immersion vs. Current DiamondMind Collective

| Feature | Current (Price Unknown) | Proposed ($7,995) |
|---------|-------------------------|-------------------|
| Duration | 12-month guided journey | Yearlong journey (5x 3-day intensives) |
| Pressure Rooms | 5 transformational Pressure Rooms | 5x 3-day Pressure Room Intensives (22 hours each) |
| Integration | NOT mentioned | 5x 2-hour Integration Labs |
| AI Support | DiamondMindAI support | NOT mentioned (implied in platform access) |
| Platform | NOT mentioned | Digital platform access for ongoing learning |
| Cohort Size | Limited to 50 members per cohort | NOT mentioned |
| Legacy | NOT mentioned | Create a personal legacy plan |

**Observation**: More detailed feature breakdown. Adds Integration Labs and explicit time commitments (22 hours per intensive).

---

## Component-Level Implementation Requirements

### Files Requiring Updates

#### 1. Landing Page - Programs Overview Section
**File**: `/src/app/page.tsx` (lines 328-411)

**Changes Required**:
- Update section subtitle
- Replace 2-card layout with 4-card grid layout
- Update all program names, descriptions, features, and CTAs
- Adjust routing (may need new pages for each tier)

**Code Location**:
```tsx
// Line 331-337: Section Header
<SectionHeader
  title={
    <>
      Choose Your <span className="text-primary">Transformation</span> Path
    </>
  }
  subtitle="From self-paced courses to yearlong coaching—find the right fit for your journey"
/>
```

**Proposed Change**:
```tsx
<SectionHeader
  title={
    <>
      Choose Your Transformation Path
    </>
  }
  subtitle="From a quick clarity reset to full-body reinvention—this is your pressure-proof path forward."
/>
```

**Code Location**:
```tsx
// Lines 340-372: Diamond Activation Card
<motion.div className="bg-gradient-to-br from-primary/10 to-primary/5...">
  <h3 className="text-2xl mb-4 font-bold">Diamond Activation Experience</h3>
  <p className="text-gray-300 mb-6">
    Complete online transformation program with three tiers...
  </p>
  {/* Features list */}
  <Link href="/program">
    <button>View Program Details</button>
  </Link>
</motion.div>
```

**Proposed Structure**: Create **4 individual tier cards** instead of 2 program cards.

---

#### 2. Program Detail Page
**File**: `/src/app/program/page.tsx` (entire file)

**Changes Required**:
- **Option A**: Replace with single "Diamond Advantage" page ($97 tier)
- **Option B**: Create multi-tier selection page
- **Recommendation**: Create separate pages per tier for clarity

**Current Page Title**: "The Diamond **Activation** Experience"
**Proposed**: Either retire this page or convert to tier selector

---

#### 3. Collective Page
**File**: `/src/app/collective/page.tsx`

**Changes Required**:
- Update program name: "DiamondMind Collective" → "DiamondMind Immersion"
- Update subtitle to include pricing: "$7,995"
- Add explicit feature breakdown matching proposed copy
- Update CTA: "Apply to Join the Collective" → "Begin Your DiamondMind Immersion"
- Consider adding Tier 3 prerequisite mention

**Code Locations**:
```tsx
// Line 28: Title
<h1 className="mb-6 text-4xl md:text-6xl">
  The <span className="text-primary">DiamondMind</span> Collective
</h1>
```

**Proposed**:
```tsx
<h1 className="mb-6 text-4xl md:text-6xl">
  The <span className="text-primary">DiamondMind</span> Immersion
</h1>
```

---

#### 4. Website Copy Documentation
**File**: `/docs/website-copy-for-editing.md` (lines 247-285)

**Changes Required**:
- Complete rewrite of Programs Overview Section
- Document all 4 tiers with exact copy from proposed document

---

#### 5. Member Portal References
**Files**:
- `/src/app/app/page.tsx` - Dashboard references
- `/src/app/app/support/page.tsx` - FAQ section
- `/src/app/app/profile/page.tsx` - Subscription display

**Search Pattern**: "Diamond Activation", "DiamondMind Collective"

**Changes Required**:
- Update dashboard program name displays
- Update subscription tier names in profile/settings
- Update FAQ references to program names

---

### New Pages Required

#### Option 1: Individual Tier Pages (Recommended)
Create dedicated landing pages for each tier:

1. `/src/app/offers/diamond-advantage/page.tsx` - $97 tier
2. `/src/app/offers/diamond-edge-mastery/page.tsx` - $497 tier
3. `/src/app/offers/pressure-room-one/page.tsx` - $1,997 tier
4. `/src/app/offers/diamondmind-immersion/page.tsx` - $7,995 tier (or redirect to `/collective`)

**Benefits**:
- Clear separation of concerns
- Better SEO (separate URLs for each offer)
- Easier A/B testing
- Clearer conversion tracking

#### Option 2: Single Multi-Tier Page
Convert `/src/app/program/page.tsx` to show all 4 tiers with expanded details.

**Benefits**:
- Single page to maintain
- Easier comparison shopping
- Simpler navigation

**Recommendation**: **Option 1** for better clarity and conversion optimization.

---

### Layout & Styling Considerations

#### Grid Layout Change
**Current**: 2-column grid (`grid md:grid-cols-2`)
**Proposed**: 4-column grid (`grid md:grid-cols-2 lg:grid-cols-4`)

**Responsive Breakpoints**:
- Mobile (< 768px): 1 column (stacked)
- Tablet (768px - 1024px): 2 columns
- Desktop (> 1024px): 4 columns

**Character Count Analysis**:
| Element | Tier 1 | Tier 2 | Tier 3 | Tier 4 | Max Length |
|---------|--------|--------|--------|--------|------------|
| Program Name | 16 chars | 21 chars | 17 chars | 21 chars | 21 chars |
| Headline | 67 chars | 58 chars | 54 chars | 98 chars | **98 chars** |
| Target Audience | 67 chars | 73 chars | 72 chars | 72 chars | 73 chars |
| CTA Text | 28 chars | 34 chars | 24 chars | 33 chars | 34 chars |

**Layout Warning**: Tier 4 headline is **40% longer** than others. May require:
- Minimum card height adjustment
- Font size reduction for Tier 4 card
- Truncation with "Read more" expansion

---

## Impact Assessment

### UI/UX Implications

**Positive Changes**:
- Clearer value ladder progression
- More compelling emotional benefits vs. feature lists
- Stronger CTAs with action-oriented language
- Better separation of beginner vs. advanced paths

**Potential Issues**:
1. **4-card layout may feel cramped** on smaller screens
2. **Tier 1 appears less valuable** than current $97 tier (fewer explicit features)
3. **Tier 3 repositioning** from 1-on-1 to group may confuse existing customers
4. **Navigation complexity**: Where do users click to learn more about each tier?
5. **DiamondMind Immersion pricing** ($7,995) may cause sticker shock without adequate justification

**Recommendations**:
- Add "Compare Tiers" table on a dedicated offers page
- Include FAQ about tier differences
- Add testimonials specific to each tier
- Create visual progression diagram (Tier 1 → 2 → 3 → 4)

---

### SEO Considerations

**Impact on Existing URLs**:
- `/program` page may need redirect or repurposing
- `/collective` page URL should remain (brand equity)
- New tier pages need SEO-optimized slugs

**Keyword Changes**:
| Old Keyword | New Keyword | Search Volume Impact |
|-------------|-------------|---------------------|
| "Diamond Activation" | "Diamond Advantage", "Diamond Edge Mastery" | Unknown - requires research |
| "DiamondMind Collective" | "DiamondMind Immersion" | Potential loss of branded search |

**Meta Description Updates Required**:
- Home page meta (references old programs)
- Program page meta
- Collective page meta
- New tier pages (need new meta descriptions)

**Recommendations**:
- 301 redirects from old program URLs to new tier pages
- Update sitemap.xml
- Update internal linking structure
- Add schema.org Product markup for each tier

---

### Accessibility Impact

**Considerations**:
- CTA button text changes (screen reader announcements)
- Program name changes in navigation (ARIA labels)
- New tier cards need proper heading hierarchy
- Ensure keyboard navigation works across 4-card grid

**Required Updates**:
- Update aria-labels on CTA buttons
- Ensure proper heading hierarchy (h1 → h2 → h3)
- Test keyboard tab order on 4-card layout
- Verify screen reader announcement of tier names

---

### Performance Considerations

**Potential Issues**:
- 4-card layout with background gradients may impact paint performance
- Additional tier pages increase build time (SSG)
- More routing logic for tier-specific pages

**Mitigation**:
- Use CSS transforms for hover effects (GPU-accelerated)
- Lazy load tier detail content
- Optimize images for each tier card
- Consider dynamic imports for tier-specific components

---

## Implementation Plan

### Phase 1: Foundation & Content Updates (3-4 hours)

**Step 1.1: Create New Tier Pages**
- Create `/src/app/offers/` directory
- Build 4 tier landing pages based on `/src/app/program/page.tsx` template
- Implement proposed copy for each tier
- Add tier-specific imagery and CTAs

**Files to Create**:
- `/src/app/offers/diamond-advantage/page.tsx`
- `/src/app/offers/diamond-edge-mastery/page.tsx`
- `/src/app/offers/pressure-room-one/page.tsx`
- `/src/app/offers/diamondmind-immersion/page.tsx` (or keep `/collective` as-is)

**Step 1.2: Update DiamondMind Immersion Page**
- Modify `/src/app/collective/page.tsx`
- Update program name, pricing, features
- Update CTA text

**Files to Modify**:
- `/src/app/collective/page.tsx` (lines 28, 358-364)

---

### Phase 2: Landing Page Programs Section Redesign (2-3 hours)

**Step 2.1: Redesign Programs Overview Section**
- Update section header copy
- Replace 2-card layout with 4-card grid
- Add responsive breakpoints
- Implement proposed tier cards with new copy

**Files to Modify**:
- `/src/app/page.tsx` (lines 328-411)

**Step 2.2: Update Navigation Links**
- Update "Program" nav link to point to new offers page or tier selector
- Update "Collective" nav link (remains same or updates to "Immersion")

**Files to Modify**:
- `/src/components/Navigation.tsx` (if program links exist)

---

### Phase 3: Documentation & Member Portal Updates (2-3 hours)

**Step 3.1: Update Content Documentation**
- Rewrite Programs Overview section in documentation
- Document all 4 tiers with exact copy
- Update CTA text references

**Files to Modify**:
- `/docs/website-copy-for-editing.md` (lines 247-285)

**Step 3.2: Update Member Portal References**
- Search for "Diamond Activation" and "DiamondMind Collective" in member portal files
- Update subscription tier names
- Update dashboard program references
- Update FAQs

**Files to Modify**:
- `/src/app/app/page.tsx`
- `/src/app/app/support/page.tsx`
- `/src/app/app/profile/page.tsx`
- `/src/app/app/settings/page.tsx`

---

### Phase 4: Routing & Navigation (1-2 hours)

**Step 4.1: Configure Routing**
- Update `/program` page (redirect or repurpose)
- Add routes for new tier pages
- Update internal links across site

**Step 4.2: Add Tier Comparison Page (Optional)**
- Create `/src/app/offers/compare/page.tsx`
- Build comparison table showing all 4 tiers side-by-side
- Add "Compare All Tiers" CTA on landing page

---

### Phase 5: Testing & QA (1-2 hours)

**Step 5.1: Visual Regression Testing**
- Test 4-card layout on mobile/tablet/desktop
- Verify responsive breakpoints
- Check gradient backgrounds and hover effects
- Test CTA button states

**Step 5.2: Content Verification**
- Proofread all tier copy against proposed document
- Verify character counts don't break layouts
- Check heading hierarchy (h1 → h2 → h3)

**Step 5.3: Functional Testing**
- Test all CTAs navigate correctly
- Verify tier page routing
- Test keyboard navigation
- Run accessibility audit (Lighthouse)

**Step 5.4: SEO Validation**
- Verify meta descriptions updated
- Check 301 redirects working
- Test sitemap generation
- Validate schema markup

---

## Testing Requirements

### Visual Regression Testing

**Breakpoints to Test**:
- [ ] Mobile (375px width)
- [ ] Tablet (768px width)
- [ ] Desktop (1024px width)
- [ ] Large Desktop (1440px width)

**Elements to Verify**:
- [ ] 4-card grid layout responsive
- [ ] Tier card heights consistent
- [ ] Gradient backgrounds render correctly
- [ ] Text doesn't overflow containers
- [ ] CTAs remain visible and clickable

---

### Functional Testing

**Navigation Tests**:
- [ ] Landing page Programs section scrolls correctly
- [ ] All tier CTAs navigate to correct pages
- [ ] "Compare Tiers" link works (if implemented)
- [ ] Navigation menu "Program" link updated
- [ ] Breadcrumbs work on tier pages

**Content Tests**:
- [ ] All tier copy matches proposed document exactly
- [ ] Pricing displays correctly
- [ ] Feature lists render properly
- [ ] Target audience copy displays
- [ ] No broken links or images

**Member Portal Tests**:
- [ ] Dashboard shows correct program names
- [ ] Profile displays correct subscription tier
- [ ] Settings page subscription matches new tier names
- [ ] FAQ references updated program names

---

### Accessibility Testing

**Keyboard Navigation**:
- [ ] Tab order flows logically through tier cards
- [ ] Focus indicators visible on all interactive elements
- [ ] Enter key activates CTAs
- [ ] Escape closes modals (if any)

**Screen Reader Testing**:
- [ ] Program names announced correctly
- [ ] CTA buttons have descriptive labels
- [ ] Heading hierarchy logical (h1 → h2 → h3)
- [ ] ARIA labels updated for new tier names

**Lighthouse Audit**:
- [ ] Accessibility score ≥ 95
- [ ] No ARIA errors
- [ ] Sufficient color contrast ratios
- [ ] Alt text present on all images

---

### Performance Testing

**Page Load Metrics**:
- [ ] First Contentful Paint < 1.8s
- [ ] Time to Interactive < 3.8s
- [ ] Cumulative Layout Shift < 0.1
- [ ] No layout shifts when tier cards load

**Bundle Size**:
- [ ] Check JavaScript bundle size for new tier pages
- [ ] Verify images optimized (WebP format)
- [ ] Ensure no duplicate dependencies

---

## Acceptance Criteria

### Content Accuracy
1. ✅ All tier names match proposed copy exactly
2. ✅ All pricing matches proposed structure
3. ✅ All feature lists match proposed copy
4. ✅ All CTAs match proposed button text
5. ✅ Section headers match proposed copy
6. ✅ Target audience statements match proposed copy

### Layout & Design
1. ✅ 4-card grid displays correctly on desktop
2. ✅ Cards stack appropriately on mobile
3. ✅ No layout breaks on tablet
4. ✅ Text doesn't overflow containers
5. ✅ Gradient backgrounds render smoothly
6. ✅ Hover effects work on all tier cards

### Functionality
1. ✅ All tier CTAs navigate to correct pages
2. ✅ Navigation menu updated correctly
3. ✅ Member portal references updated
4. ✅ No broken links or 404 errors
5. ✅ Routing works for all new tier pages

### SEO & Performance
1. ✅ Meta descriptions updated for all affected pages
2. ✅ 301 redirects configured for old program URLs
3. ✅ Sitemap includes new tier pages
4. ✅ Lighthouse Performance score ≥ 90
5. ✅ No regression in page load times

### Accessibility
1. ✅ Lighthouse Accessibility score ≥ 95
2. ✅ Keyboard navigation works throughout
3. ✅ Screen reader announcements correct
4. ✅ ARIA labels updated for new tier names
5. ✅ Color contrast ratios pass WCAG AA

---

## Rollback Plan

### Pre-Implementation Backup
1. Create git branch: `feature/offer-stack-rebrand`
2. Tag current state: `git tag pre-rebrand-2025-10-04`
3. Document current URLs and routing
4. Export current analytics data for comparison

### Rollback Triggers
- Critical layout breaks on mobile
- Conversion rate drops > 20% in first week
- SEO traffic drops > 15% in first 2 weeks
- User feedback indicates confusion about new structure
- Payment processing errors with new tier names

### Rollback Procedure
1. Revert to `pre-rebrand-2025-10-04` tag
2. Restore old program pages
3. Remove new tier pages
4. Update navigation links back to original
5. Clear CDN cache
6. Monitor analytics for recovery
7. Communicate changes to affected users

### Partial Rollback Options
- **Option A**: Keep new tier pages but restore old landing page Programs section
- **Option B**: Keep DiamondMind Immersion rebrand, rollback Diamond Activation restructure
- **Option C**: Implement new structure but revert pricing changes

---

## Open Questions & Risks

### Content Clarifications Needed
1. **Tier 1 Feature Reduction**: Proposed $97 tier appears less comprehensive than current. Is this intentional?
   - Current: Full DOS Course + Swiss Army Knife + ART Protocols
   - Proposed: 30-day tracker + practice prompts
   - **Risk**: May reduce perceived value and conversions

2. **Tier 2 Bonus Courses**: Current $497 tier includes Emotional Mastery Mini-Course ($497) and Influence Masterclass ($297). Are these included in proposed version?
   - **Impact**: $794 of stated value missing from proposed copy

3. **Tier 3 vs. Current Premium**: Proposed Pressure Room One is a **group intensive**, while current Premium is **1-on-1 mentoring**. Is this intentional repositioning?
   - **Risk**: Existing Premium customers may feel downgraded

4. **DiamondMind Immersion Pricing**: $7,995 is a significant premium. Is this competitive with similar yearlong programs?
   - **Risk**: Price point may limit conversions without strong justification

5. **Cohort Size Limit**: Current Collective mentions "Limited to 50 members per cohort". Should this be retained in Immersion copy?

### Technical Risks
1. **Routing Complexity**: 4 separate tier pages increases maintenance overhead
2. **Member Portal Sync**: Subscription tier names must match exactly across billing, profile, and dashboard
3. **Analytics Tracking**: Conversion tracking will need updates for new tier structure
4. **Payment Processing**: Stripe/PayPal product SKUs need updating for new tier names
5. **CMS Integration**: Decap CMS configuration may reference old program names

### Migration Risks
1. **Existing Customers**: How to handle customers on current "Premium" ($3,000) tier?
   - Grandfather into new structure?
   - Migrate to equivalent tier?
   - Offer upgrade path to DiamondMind Immersion?

2. **In-Flight Purchases**: What happens to users who purchased during migration?
   - Hold purchases during deployment?
   - Manual reconciliation?

3. **Email Marketing**: Existing email sequences reference old program names
   - **Action Required**: Audit and update all email templates

4. **Affiliate Links**: External partners may link to `/program` page
   - **Action Required**: Communicate URL changes to affiliates

---

## Recommendations

### Critical Actions Before Launch
1. **Validate Tier 1 Features**: Confirm whether Tier 1 should include full DOS Course or just tracker
2. **Clarify Tier 2 Bonuses**: Determine if bonus courses are included or removed
3. **Customer Migration Plan**: Define how existing customers map to new tiers
4. **Pricing Justification**: Add value breakdown for $7,995 DiamondMind Immersion tier
5. **A/B Testing Plan**: Consider soft launch with 50/50 traffic split to measure impact

### Enhancement Opportunities
1. **Tier Comparison Table**: Build interactive comparison showing all 4 tiers side-by-side
2. **Visual Progression Diagram**: Create infographic showing transformation journey through tiers
3. **Tier-Specific Testimonials**: Add social proof relevant to each tier's outcomes
4. **Quiz/Assessment**: Build "Which Tier is Right for You?" quiz to guide selection
5. **Video Explainers**: Record short videos explaining each tier's unique value

### Post-Launch Monitoring
1. **Conversion Rate Tracking**: Monitor tier-specific conversion rates for first 30 days
2. **User Feedback Collection**: Add survey asking about new tier clarity
3. **Heatmap Analysis**: Track user interaction with 4-card layout
4. **SEO Impact**: Monitor organic traffic to new tier pages
5. **Support Tickets**: Track questions about tier differences

---

## Appendix A: File Modification Checklist

### Primary Files (Must Update)
- [ ] `/src/app/page.tsx` - Landing page Programs section (lines 328-411)
- [ ] `/src/app/collective/page.tsx` - DiamondMind Immersion rebrand (entire file)
- [ ] `/docs/website-copy-for-editing.md` - Programs documentation (lines 247-285)

### New Files (Create)
- [ ] `/src/app/offers/diamond-advantage/page.tsx`
- [ ] `/src/app/offers/diamond-edge-mastery/page.tsx`
- [ ] `/src/app/offers/pressure-room-one/page.tsx`
- [ ] `/src/app/offers/diamondmind-immersion/page.tsx` (optional - may use /collective)

### Secondary Files (Search & Update)
- [ ] `/src/app/program/page.tsx` - Retire or repurpose
- [ ] `/src/app/app/page.tsx` - Dashboard program references
- [ ] `/src/app/app/support/page.tsx` - FAQ updates
- [ ] `/src/app/app/profile/page.tsx` - Subscription display
- [ ] `/src/app/app/settings/page.tsx` - Billing tier names
- [ ] `/src/components/Navigation.tsx` - Nav menu links (if exists)

### Documentation Files
- [ ] `/CLAUDE.md` - Update architecture docs if needed
- [ ] `/docs/FEATURES_OVERVIEW.md` - Update feature list
- [ ] `/README.md` - Update project description (if mentions programs)

### CMS Configuration
- [ ] `/public/admin/config.yml` - Check for program references

---

## Appendix B: Copy Reference Sheet

### Quick Copy Lookup Table

| Element | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|---------|--------|--------|--------|--------|
| **Name** | Diamond Advantage | Diamond Edge Mastery | Pressure Room One | DiamondMind Immersion |
| **Price** | $97 | $497 | $1,997 | $7,995 |
| **Headline** | Feel Calm, Clear, and Centered—Even in Chaos | Own the Room. Command Respect. Rise with Confidence. | Step Into the Fire. Walk Out Unshakable. | The Ultimate Transformation: Live Unshakable Every Day. |
| **Subhead** | Regain control of your emotions and your focus, no matter what life throws at you. | Step into your power and become magnetic in any situation. | Transform how you handle stress and pressure—forever. | A yearlong journey to become emotionally grounded, energetically powerful, and irreplaceable. |
| **CTA** | Access the Diamond Advantage | Step Into Diamond Edge Mastery | Enter Pressure Room One | Begin Your DiamondMind Immersion |
| **Target** | Perfect for anyone who feels overwhelmed and needs to reset fast. | Perfect for those ready to feel strong, clear, and unstoppable in real time. | Perfect for those ready to experience the shift—not just think about it. | Perfect for those ready to live from the Diamond frequency—every single day. |

---

## Appendix C: Visual Layout Mockup

### Proposed 4-Card Grid Structure

```
┌─────────────────────────────────────────────────────────────┐
│  Choose Your Transformation Path                            │
│  From a quick clarity reset to full-body reinvention—       │
│  this is your pressure-proof path forward.                  │
└─────────────────────────────────────────────────────────────┘

┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ Diamond  │ │ Diamond  │ │ Pressure │ │ Diamond  │
│ Advantage│ │   Edge   │ │ Room One │ │   Mind   │
│          │ │ Mastery  │ │          │ │Immersion │
│   $97    │ │  $497    │ │ $1,997   │ │ $7,995   │
│          │ │          │ │          │ │          │
│ [CTA]    │ │ [CTA]    │ │ [CTA]    │ │ [CTA]    │
└──────────┘ └──────────┘ └──────────┘ └──────────┘
  Tier 1      Tier 2        Tier 3       Tier 4
```

**Responsive Behavior**:
- **Desktop (> 1024px)**: 4 columns
- **Tablet (768px - 1024px)**: 2 columns (2x2 grid)
- **Mobile (< 768px)**: 1 column (stacked)

---

## Document Control

**Version History**:
- v1.0 (2025-10-04): Initial PRD created by Copy & Content Diff Analyst agent

**Stakeholders**:
- Product Owner: [TBD]
- Development Lead: [TBD]
- Content/Copy: [TBD]
- Design: [TBD]

**Review Status**: Awaiting stakeholder review

**Next Steps**:
1. Review and validate proposed tier features
2. Approve pricing structure
3. Greenlight implementation
4. Assign development resources

---

**END OF PRD**
