# Documentation Structure

## Overview

This directory contains all project documentation organized by purpose and type.

## Directory Structure

### `/guides/`
Setup and configuration guides for developers
- `auth-setup.md` - Authentication setup instructions
- `cms-setup.md` - Decap CMS configuration guide
- `stripe-integration.md` - Stripe payment integration guide

### `/features/`
Feature documentation and overviews
- `features-overview.md` - High-level feature documentation
- `book-sales-usage.md` - Book sales feature documentation

### `/planning/`
Product requirements documents (PRDs) and project planning
- `course-viewer.md` - Course viewer feature plan
- `lead-capture-turso.md` - Lead capture system plan
- `member-portal-data-persistence.md` - Member portal data plan
- `offer-stack-rebrand.md` - Offer stack rebrand plan
- `tnitd-website.md` - "Turning Snowflakes Into Diamonds" website plan

#### `/planning/sprints/`
Sprint planning documents
- `30-day-sprint-main.md` - Main sprint overview
- `30-day-sprint-phase-1.md` - Phase 1 details
- `30-day-sprint-phase-2.md` - Phase 2 details
- `30-day-sprint-phase-3.md` - Phase 3 details
- `30-day-sprint-technical-summary.md` - Technical implementation summary

### `/specs/`
Technical specifications organized by domain

#### `/specs/integrations/`
Integration specifications
- `astro-decap-cms-aceternity-integration.md` - Main integration spec
- `astro-decap-cms-aceternity-integration-0[0-4].md` - Iteration specs
- `astro-decap-cms-aceternity-integration-breakdown.md` - Implementation breakdown

#### `/specs/performance/`
Performance optimization specifications
- `performance-optimization.md` - Performance optimization spec
- `performance-optimization-report.md` - Optimization results report

#### `/specs/video/`
Video platform specifications
- `video-hosting-analysis.md` - Platform comparison analysis
- `video-integration-plan.md` - Full integration plan
- `video-integration-simplified.md` - Simplified integration approach

#### `/specs/ai/`
AI and RAG (Retrieval Augmented Generation) specifications
- `diamond-rag.md` - Diamond RAG implementation
- `rag-setup.md` - RAG setup guide
- `turso-vector-migration-analysis.md` - Vector database migration analysis

### `/reports/`
Implementation and migration reports
- `phase1-migration-summary.md` - Phase 1 migration summary

#### `/reports/integration-reports/`
Integration implementation reports
- `astro-decap-cms-aceternity-integration-0[0-4]-report.md` - Integration reports

### `/content/`
Book content and marketing copy

#### `/content/book/`
Book manuscript and related materials
- `turning-snowflakes-into-diamonds.md` - Book manuscript (markdown)
- `turning-snowflakes-into-diamonds.pdf` - Book manuscript (PDF)

#### `/content/copy/`
Website and marketing copy
- `seed-copy-[1-3].md` - Initial website copy versions
- `copy-diff-suggested-1.md` - Suggested copy changes
- `website-copy-for-editing.md` - Current website copy for editing

### `/archive/`
Deprecated or old versions of code and documentation
- `landing-alt-all/` - Alternative landing page implementation

## Naming Conventions

All files follow kebab-case naming:
- ✅ `auth-setup.md`
- ✅ `video-integration-plan.md`
- ❌ `AUTH_SETUP.md`
- ❌ `videoIntegrationPlan.md`

## Contributing

When adding new documentation:
1. Choose the appropriate directory based on document type
2. Use kebab-case for filenames
3. Add entry to this readme if creating a new category
4. Keep related files together in subdirectories
