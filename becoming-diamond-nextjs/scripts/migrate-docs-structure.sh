#!/bin/bash

# Documentation Structure Migration Script (Shell version)
# This is a simpler bash alternative to the Python script
# For full features and better error handling, use migrate-docs-structure.py

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Change to repository root
cd "$(dirname "$0")/.."

# Parse arguments
DRY_RUN=false
VERBOSE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --verbose|-v)
            VERBOSE=true
            shift
            ;;
        --help|-h)
            echo "Usage: $0 [--dry-run] [--verbose]"
            echo ""
            echo "Options:"
            echo "  --dry-run    Preview changes without modifying files"
            echo "  --verbose    Show detailed output"
            echo "  --help       Show this help message"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Function to move file
move_file() {
    local src="$1"
    local dest="$2"

    if [ ! -f "$src" ]; then
        if [ "$VERBOSE" = true ]; then
            echo -e "${YELLOW}Skipped (not found): $src${NC}"
        fi
        return 1
    fi

    if [ "$DRY_RUN" = true ]; then
        echo -e "${CYAN}[DRY-RUN] Would move:${NC}"
        echo -e "  ${BLUE}FROM:${NC} $src"
        echo -e "  ${BLUE}TO:${NC}   $dest"
        return 0
    else
        # Create destination directory
        mkdir -p "$(dirname "$dest")"

        # Move file
        mv "$src" "$dest"

        if [ "$VERBOSE" = true ]; then
            echo -e "${GREEN}Moved:${NC}"
            echo -e "  ${BLUE}FROM:${NC} $src"
            echo -e "  ${BLUE}TO:${NC}   $dest"
        fi
        return 0
    fi
}

echo ""
echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}  Documentation Structure Migration  ${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""

if [ "$DRY_RUN" = true ]; then
    echo -e "${CYAN}Running in DRY-RUN mode${NC}"
    echo -e "${CYAN}No files will be modified${NC}"
    echo ""
fi

# Step 1: Create directory structure
echo -e "${GREEN}Step 1: Creating directory structure...${NC}"

if [ "$DRY_RUN" = false ]; then
    mkdir -p docs/1_planning/{analysis,product_requirements,sprints}
    mkdir -p docs/2_architecture_and_specs/{ai,auth,cms,payments,video}
    mkdir -p docs/3_guides_and_how-tos/{handoff,setup,workflows}
    mkdir -p docs/4_content_and_copy/{book,website_copy}
    mkdir -p scripts
    mkdir -p _archive/reports/{weekly_updates,implementation_summaries,audits_and_analysis,testing}
fi

echo -e "${GREEN}✓ Directory structure ready${NC}"
echo ""

# Step 2: Migrate files
echo -e "${GREEN}Step 2: Migrating files...${NC}"

# Counters
SUCCESS=0
FAILED=0
SKIPPED=0

# 1_planning/analysis/
move_file "codebase-simplification-analysis.md" "docs/1_planning/analysis/analysis-codebase-simplification.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "architecture/documentation-strategy-analysis.md" "docs/1_planning/analysis/analysis-documentation-strategy.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "specs/email-provider-migration-analysis.md" "docs/1_planning/analysis/analysis-email-provider-migration.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "specs/ai/turso-vector-migration-analysis.md" "docs/1_planning/analysis/analysis-turso-vector-migration.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "specs/video/video-hosting-analysis.md" "docs/1_planning/analysis/analysis-video-hosting.md" && ((SUCCESS++)) || ((SKIPPED++))

# 1_planning/product_requirements/
move_file "specs/blog/author-pages.prd.md" "docs/1_planning/product_requirements/prd-author-pages.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "specs/book-purchasing.prd.md" "docs/1_planning/product_requirements/prd-book-purchasing.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "specs/decap-cms-enhancements.prd.md" "docs/1_planning/product_requirements/prd-cms-enhancements.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "specs/diamondmind-ai-public-chat.md" "docs/1_planning/product_requirements/prd-diamondmind-ai-public-chat.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "planning/lead-capture-turso.md" "docs/1_planning/product_requirements/prd-lead-capture-turso.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "planning/offer-stack-rebrand.md" "docs/1_planning/product_requirements/prd-offer-stack-rebrand.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "specs/integrations/resend-lead-email-integration.prd.md" "docs/1_planning/product_requirements/prd-resend-lead-email-integration.md" && ((SUCCESS++)) || ((SKIPPED++))

# 1_planning/sprints/
move_file "planning/sprints/30-day-sprint-main.md" "docs/1_planning/sprints/sprint-main-plan.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "planning/sprints/30-day-sprint-phase-1.md" "docs/1_planning/sprints/sprint-phase-1-plan.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "planning/sprints/30-day-sprint-phase-2.md" "docs/1_planning/sprints/sprint-phase-2-plan.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "planning/sprints/30-day-sprint-phase-3.md" "docs/1_planning/sprints/sprint-phase-3-plan.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "specs/sprint-gamification-delivery-strategy.md" "docs/1_planning/sprints/sprint-gamification-delivery-strategy.md" && ((SUCCESS++)) || ((SKIPPED++))

# 2_architecture_and_specs/ (root level)
move_file "architecture/documentation-implementation-plan.md" "docs/2_architecture_and_specs/spec-documentation-site-plan.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "features/features-overview.md" "docs/2_architecture_and_specs/spec-features-overview.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "planning/member-portal-data-persistence.md" "docs/2_architecture_and_specs/spec-member-portal-data-persistence.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "specs/sprint-video-narrative-extraction.prd.md" "docs/2_architecture_and_specs/spec-sprint-content-extraction.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "specs/sprint-progress-database-migration.md" "docs/2_architecture_and_specs/spec-sprint-progress-database-migration.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "specs/testing-strategy.md" "docs/2_architecture_and_specs/spec-testing-strategy.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "planning/tnitd-website.md" "docs/2_architecture_and_specs/spec-website-initial-plan.md" && ((SUCCESS++)) || ((SKIPPED++))

# 2_architecture_and_specs/ai/
move_file "specs/ai/diamond-rag.md" "docs/2_architecture_and_specs/ai/spec-diamond-rag.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "specs/ai/rag-setup.md" "docs/2_architecture_and_specs/ai/spec-rag-setup.md" && ((SUCCESS++)) || ((SKIPPED++))

# 2_architecture_and_specs/auth/
move_file "specs/auth-magic-link-double-request-issue.md" "docs/2_architecture_and_specs/auth/spec-magic-link-double-request-issue.md" && ((SUCCESS++)) || ((SKIPPED++))

# 2_architecture_and_specs/cms/
move_file "specs/cms-managed-copy-analysis-agentic.md" "docs/2_architecture_and_specs/cms/spec-cms-copy-management-agentic.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "specs/cms-managed-copy-analysis.md" "docs/2_architecture_and_specs/cms/spec-cms-copy-management.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "specs/sprint-cms-migration.md" "docs/2_architecture_and_specs/cms/spec-sprint-cms-migration.md" && ((SUCCESS++)) || ((SKIPPED++))

# 2_architecture_and_specs/payments/
move_file "specs/aceternity-ui-cleanup.prd.md" "docs/2_architecture_and_specs/payments/spec-aceternity-ui-cleanup.md" && ((SUCCESS++)) || ((SKIPPED++))

# 2_architecture_and_specs/video/
move_file "specs/video/video-integration-plan.md" "docs/2_architecture_and_specs/video/spec-video-integration-plan.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "specs/video/video-integration-simplified.md" "docs/2_architecture_and_specs/video/spec-video-integration-simplified.md" && ((SUCCESS++)) || ((SKIPPED++))

# 3_guides_and_how-tos/handoff/
move_file "client-handover-services-guide.md" "docs/3_guides_and_how-tos/handoff/guide-client-handoff-services.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "guides/developer-handoff-guide.md" "docs/3_guides_and_how-tos/handoff/guide-developer-handoff.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "guides/stripe-client-setup.md" "docs/3_guides_and_how-tos/handoff/guide-stripe-client-setup.md" && ((SUCCESS++)) || ((SKIPPED++))

# 3_guides_and_how-tos/setup/
move_file "guides/auth-setup.md" "docs/3_guides_and_how-tos/setup/guide-auth-setup.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "guides/cms-setup.md" "docs/3_guides_and_how-tos/setup/guide-cms-setup.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "guides/gmail-smtp-setup.md" "docs/3_guides_and_how-tos/setup/guide-gmail-smtp-setup.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "guides/resend-setup.md" "docs/3_guides_and_how-tos/setup/guide-resend-setup.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "guides/stripe-setup-guide.md" "docs/3_guides_and_how-tos/setup/guide-stripe-setup.md" && ((SUCCESS++)) || ((SKIPPED++))

# 3_guides_and_how-tos/workflows/
move_file "cms-rollback-guide.md" "docs/3_guides_and_how-tos/workflows/guide-cms-rollback.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "cms-workflow.md" "docs/3_guides_and_how-tos/workflows/workflow-cms.md" && ((SUCCESS++)) || ((SKIPPED++))

# 4_content_and_copy/book/
move_file "content/book/turning-snowflakes-into-diamonds.md" "docs/4_content_and_copy/book/turning-snowflakes-into-diamonds.md" && ((SUCCESS++)) || ((SKIPPED++))

# 4_content_and_copy/website_copy/
move_file "content/copy/copy-diff-suggested-1.md" "docs/4_content_and_copy/website_copy/final-offer-stack-copy.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "content/copy/seed-copy-1.md" "docs/4_content_and_copy/website_copy/v1-seed-copy-1.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "content/copy/seed-copy-2.md" "docs/4_content_and_copy/website_copy/v1-seed-copy-2.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "content/copy/seed-copy-3.md" "docs/4_content_and_copy/website_copy/v1-seed-copy-3.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "content/copy/website-copy-for-editing.md" "docs/4_content_and_copy/website_copy/final-website-copy.md" && ((SUCCESS++)) || ((SKIPPED++))

# scripts/
move_file "mark-all-days-complete.js" "scripts/util-mark-all-days-complete.js" && ((SUCCESS++)) || ((SKIPPED++))

# _archive/reports/audits_and_analysis/
move_file "reports/auth-url-environment-variables-analysis.md" "_archive/reports/audits_and_analysis/analysis-auth-url-env-vars.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "browser-memory-leak-analysis.md" "_archive/reports/audits_and_analysis/analysis-browser-memory-leak.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "reports/zombie-code-analysis-2025-11-04.md" "_archive/reports/audits_and_analysis/analysis-zombie-code-2025-11-04.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "reports/database-table-usage-survey.md" "_archive/reports/audits_and_analysis/audit-database-table-usage-2025-10-15.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "reports/documentation-audit-2025-10-16.md" "_archive/reports/audits_and_analysis/audit-documentation-2025-10-16.md" && ((SUCCESS++)) || ((SKIPPED++))

# _archive/reports/implementation_summaries/
move_file "reports/axiom-logging-implementation-report.md" "_archive/reports/implementation_summaries/impl-axiom-logging.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "reports/bunny-credentials-update-2025-10-16.md" "_archive/reports/implementation_summaries/impl-bunny-credentials-update-2025-10-16.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "cms-config-sprint-slug-fix.md" "_archive/reports/implementation_summaries/impl-cms-config-sprint-slug-fix.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "reports/diamond-manifesto-delivery-implementation.md" "_archive/reports/implementation_summaries/impl-diamond-manifesto-delivery.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "reports/knip-cleanup-summary.md" "_archive/reports/implementation_summaries/impl-knip-cleanup.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "reports/member-portal-db-migration-2025-11-04.md" "_archive/reports/implementation_summaries/impl-member-portal-db-migration-2025-11-04.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "implementation-summary-mobile-tablet-animations.md" "_archive/reports/implementation_summaries/impl-mobile-tablet-animations.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "reports/observability-error-tracking-plan.md" "_archive/reports/implementation_summaries/impl-observability-plan.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "specs/performance/performance-optimization-report.md" "_archive/reports/implementation_summaries/impl-performance-optimization.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "specs/integrations/resend-implementation-summary.md" "_archive/reports/implementation_summaries/impl-resend-integration.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "reports/stripe-integration-setup-complete.md" "_archive/reports/implementation_summaries/impl-stripe-integration-setup.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "reports/stripe-webhook-implementation-2025-11-03.md" "_archive/reports/implementation_summaries/impl-stripe-webhook-2025-11-03.md" && ((SUCCESS++)) || ((SKIPPED++))

# _archive/reports/testing/
move_file "guides/sprint-e2e-testing.md" "_archive/reports/testing/guide-sprint-e2e-testing.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "knip-cleanup-checklist.md" "_archive/reports/testing/plan-knip-cleanup-checklist.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "reports/e2e-test-implementation-final-report.md" "_archive/reports/testing/report-e2e-test-implementation-final.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "reports/mobile-bug-quickstart.md" "_archive/reports/testing/report-mobile-bug-quickstart.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "reports/observability-executive-summary.md" "_archive/reports/testing/report-observability-executive-summary.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "reports/phase-1-unit-tests-summary.md" "_archive/reports/testing/report-phase-1-unit-tests-summary.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "reports/phase-2-component-tests-outline.md" "_archive/reports/testing/report-phase-2-component-tests-outline.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "reports/phase-2-component-tests-summary.md" "_archive/reports/testing/report-phase-2-component-tests-summary.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "test-suite-cleanup-summary.md" "_archive/reports/testing/report-test-suite-cleanup-summary.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "test-suite-status-report.md" "_archive/reports/testing/report-test-suite-status.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "reports/wave-1-authentication-tests-implementation.md" "_archive/reports/testing/report-wave-1-auth-tests.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "reports/wave-2-parallel-implementation-complete.md" "_archive/reports/testing/report-wave-2-implementation.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "reports/wave-2-sprint-e2e-tests-summary.md" "_archive/reports/testing/report-wave-2-sprint-e2e-summary.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "reports/wave-3-parallel-implementation-complete.md" "_archive/reports/testing/report-wave-3-implementation.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "reports/wave-3-profile-tests-debugging-guide.md" "_archive/reports/testing/report-wave-3-profile-tests-debugging.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "reports/wave-3-profile-tests-implementation-summary.md" "_archive/reports/testing/report-wave-3-profile-tests-summary.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "reports/wave-4-parallel-implementation-complete.md" "_archive/reports/testing/report-wave-4-implementation.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "reports/wave-5-parallel-implementation-complete.md" "_archive/reports/testing/report-wave-5-implementation.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "reports/wave-6-cms-implementation-complete.md" "_archive/reports/testing/report-wave-6-cms-implementation.md" && ((SUCCESS++)) || ((SKIPPED++))

# _archive/reports/weekly_updates/
move_file "reports/dev-update-17-oct.md" "_archive/reports/weekly_updates/update-2025-10-17-dev-summary.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "reports/session-2025-11-04-summary.md" "_archive/reports/weekly_updates/update-2025-11-04-session-summary.md" && ((SUCCESS++)) || ((SKIPPED++))
move_file "reports/weekly-update-2025-11-13.md" "_archive/reports/weekly_updates/update-2025-11-13-weekly-summary.md" && ((SUCCESS++)) || ((SKIPPED++))

# _archive/ (root level)
move_file "specs/documentation-handover-review.md" "_archive/handover-review-2025-11-15.md" && ((SUCCESS++)) || ((SKIPPED++))

echo -e "${GREEN}✓ File migration complete${NC}"
echo ""

# Step 3: Cleanup empty directories
if [ "$DRY_RUN" = false ]; then
    echo -e "${GREEN}Step 3: Cleaning up empty directories...${NC}"

    # Try to remove empty directories (will only remove if empty)
    rmdir docs/architecture 2>/dev/null || true
    rmdir docs/specs/ai 2>/dev/null || true
    rmdir docs/specs/blog 2>/dev/null || true
    rmdir docs/specs/integrations 2>/dev/null || true
    rmdir docs/specs/performance 2>/dev/null || true
    rmdir docs/specs/video 2>/dev/null || true
    rmdir docs/specs 2>/dev/null || true
    rmdir docs/planning/sprints 2>/dev/null || true
    rmdir docs/planning 2>/dev/null || true
    rmdir docs/guides 2>/dev/null || true
    rmdir docs/reports 2>/dev/null || true
    rmdir docs/features 2>/dev/null || true
    rmdir content/book 2>/dev/null || true
    rmdir content/copy 2>/dev/null || true
    rmdir content 2>/dev/null || true

    echo -e "${GREEN}✓ Cleanup complete${NC}"
fi

# Print summary
echo ""
echo -e "${BLUE}=====================================${NC}"
echo -e "${BLUE}           MIGRATION SUMMARY         ${NC}"
echo -e "${BLUE}=====================================${NC}"
echo ""
echo -e "${GREEN}Successfully moved: $SUCCESS files${NC}"
echo -e "${YELLOW}Skipped (not found): $SKIPPED files${NC}"
echo ""

if [ "$DRY_RUN" = true ]; then
    echo -e "${CYAN}This was a dry run. No files were actually moved.${NC}"
    echo -e "${CYAN}Run without --dry-run to execute the migration.${NC}"
fi

echo ""
