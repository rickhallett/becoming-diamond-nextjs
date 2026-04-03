---
title: Research Methodology
---

# Research Methodology

How this platform evaluation was conducted.

## Objective

Evaluate 8 platforms as replacements for the custom-built becomingdiamond.com Next.js website. The client is a personal transformation coach who needs to manage his online business independently without engineering support.

## What Must Be Replaced

| Category | Current Implementation | Priority |
|---|---|---|
| Landing Page | Custom Next.js with animated hero, testimonials | HIGH |
| Lead Capture | Email form, validation, welcome email, CSV export | HIGH |
| Book Sales | Stripe Checkout ($14.99 digital book), promo codes | HIGH |
| Course Platform | 30-day sprint: 30 lessons + Bunny Stream video, progress tracking, progressive unlock | **HIGHEST** |
| Blog | Decap CMS (Git-based), categories/tags | MEDIUM |
| Authentication | NextAuth v5 (magic link, Google OAuth, password) | MEDIUM |
| Member Portal | User profiles, sprint dashboard, progress stats | HIGH |
| Video Hosting | Bunny Stream with HLS adaptive streaming | HIGH |

## Evaluation Criteria (Weighted)

### Tier 1: Core Requirements (Must-Haves)

1. **Course Development & Delivery** (HIGHEST) — Builder quality, video hosting, progress tracking, drip content, student experience
2. **Landing Page Builder** (HIGH) — Templates, customization, mobile responsiveness, conversion optimization
3. **Lead Capture & CRM** (HIGH) — Forms, email automation, contact management, segmentation
4. **Digital Product Sales** (HIGH) — Checkout, digital delivery, payment processing

### Tier 2: Platform Viability

5. **Onboarding Friction** (HIGH) — Learning curve, setup time, documentation, support
6. **Pricing & Total Cost** (MEDIUM) — Monthly cost, transaction fees, hidden costs
7. **Migration Ease** (HIGH) — DNS switchover, content import, time-to-live
8. **Platform Health** (MEDIUM) — Company age, stability, funding, user base

### Tier 3: Feature Depth

Email/SMS, funnels, community, analytics, booking, integrations, SEO, video hosting, scheduling.

## Platforms Evaluated

| # | Platform | Rationale for Inclusion |
|---|---|---|
| 1 | Go High Level | Primary candidate under consideration |
| 2 | Kajabi | Leading all-in-one for coaches |
| 3 | ClickFunnels 2.0 | Strong funnel + course combo |
| 4 | Kartra | Direct GHL competitor |
| 5 | Systeme.io | Budget baseline, free tier available |
| 6 | Skool | Community/course focused, ultra-simple |
| 7 | Teachable | Course-first platform |
| 8 | WordPress + Plugins | Self-hosted comparison baseline |

## Research Architecture

Each platform was researched by an isolated research process with its own clean context. This prevents cross-contamination of facts between platforms and avoids context overflow from accumulated web page data.

```
ORCHESTRATOR:
  |
  |-- Research Agent → Go High Level profile
  |-- Research Agent → Kajabi profile
  |-- Research Agent → ClickFunnels profile
  |-- Research Agent → Kartra profile
  |-- Research Agent → Systeme.io profile
  |-- Research Agent → Skool profile
  |-- Research Agent → Teachable profile
  |-- Research Agent → WordPress profile
  |
  |-- Synthesis: Comparison matrix
  |-- Synthesis: Pricing comparison
  |-- Synthesis: Sentiment analysis
  |-- Synthesis: Final recommendation
```

Each research agent fetched official platform websites, pricing pages, feature documentation, and review aggregators (G2, Capterra, Trustpilot). Findings were structured into a consistent profile template and written to disk immediately.

## Weighted Scoring Model

The final recommendation uses a weighted scoring model based on the client's stated priorities:

| Criterion | Weight | Rationale |
|---|---|---|
| Course Quality | **35%** | Highest stated priority. The course IS the product. |
| Ease of Use | **25%** | Busy, non-technical user. Low friction is critical. |
| All-in-One Completeness | **20%** | Fewer tools = less complexity = more independence. |
| Migration Speed | **10%** | Wants to be live quickly. |
| Value/Price | **10%** | Budget is flexible but shouldn't overspend on unused features. |

## Key Client Context

- Personal transformation coach building a 30-day video program
- Nervous about depending on an engineer for his website
- Intelligent but busy — lowest friction wins
- Budget is flexible — will pay for quality
- Wants to migrate quickly (DNS switch, fast time-to-live)
- Current assets: $14.99 book via Stripe, 30 Bunny Stream videos, blog content, member portal

## Data Sources

- Official platform websites and pricing pages
- G2, Capterra, and Trustpilot review data
- Platform documentation and help centers
- Community forums and Facebook groups
- Training data knowledge (where live data was inaccessible)

!!! info "Research Date"
    All data gathered on **April 3, 2026**. Pricing and features are point-in-time snapshots and may change.
