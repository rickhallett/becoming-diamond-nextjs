#!/usr/bin/env python3
"""
Documentation Structure Migration Script

This script reorganizes the repository's documentation into a cleaner,
more intuitive structure based on purpose and audience.

Usage:
    python scripts/migrate-docs-structure.py --dry-run  # Preview changes
    python scripts/migrate-docs-structure.py            # Execute migration
    python scripts/migrate-docs-structure.py --verbose  # Execute with detailed logging
"""

import os
import shutil
import argparse
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Tuple

# Base directory (repository root)
BASE_DIR = Path(__file__).parent.parent


class Colors:
    """ANSI color codes for terminal output"""
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'


def get_migration_map() -> Dict[str, str]:
    """
    Returns the complete file migration mapping.
    Format: {source_path: destination_path}
    """
    return {
        # 1_planning/analysis/
        "docs/codebase-simplification-analysis.md": "docs/1_planning/analysis/analysis-codebase-simplification.md",
        "docs/architecture/documentation-strategy-analysis.md": "docs/1_planning/analysis/analysis-documentation-strategy.md",
        "docs/specs/email-provider-migration-analysis.md": "docs/1_planning/analysis/analysis-email-provider-migration.md",
        "docs/specs/ai/turso-vector-migration-analysis.md": "docs/1_planning/analysis/analysis-turso-vector-migration.md",
        "docs/specs/video/video-hosting-analysis.md": "docs/1_planning/analysis/analysis-video-hosting.md",

        # 1_planning/product_requirements/
        "docs/specs/blog/author-pages.prd.md": "docs/1_planning/product_requirements/prd-author-pages.md",
        "docs/specs/book-purchasing.prd.md": "docs/1_planning/product_requirements/prd-book-purchasing.md",
        "docs/specs/decap-cms-enhancements.prd.md": "docs/1_planning/product_requirements/prd-cms-enhancements.md",
        "docs/specs/diamondmind-ai-public-chat.prd.md": "docs/1_planning/product_requirements/prd-diamondmind-ai-public-chat.md",
        "docs/planning/lead-capture-turso.md": "docs/1_planning/product_requirements/prd-lead-capture-turso.md",
        "docs/planning/offer-stack-rebrand.md": "docs/1_planning/product_requirements/prd-offer-stack-rebrand.md",
        "docs/specs/integrations/resend-lead-email-integration.prd.md": "docs/1_planning/product_requirements/prd-resend-lead-email-integration.md",

        # 1_planning/sprints/
        "docs/planning/sprints/30-day-sprint-main.md": "docs/1_planning/sprints/sprint-main-plan.md",
        "docs/planning/sprints/30-day-sprint-phase-1.md": "docs/1_planning/sprints/sprint-phase-1-plan.md",
        "docs/planning/sprints/30-day-sprint-phase-2.md": "docs/1_planning/sprints/sprint-phase-2-plan.md",
        "docs/planning/sprints/30-day-sprint-phase-3.md": "docs/1_planning/sprints/sprint-phase-3-plan.md",
        "docs/specs/sprint-gamification-delivery-strategy.md": "docs/1_planning/sprints/sprint-gamification-delivery-strategy.md",

        # 2_architecture_and_specs/ (root level)
        "docs/architecture/documentation-implementation-plan.md": "docs/2_architecture_and_specs/spec-documentation-site-plan.md",
        "docs/features/features-overview.md": "docs/2_architecture_and_specs/spec-features-overview.md",
        "docs/planning/member-portal-data-persistence.md": "docs/2_architecture_and_specs/spec-member-portal-data-persistence.md",
        "docs/specs/sprint-video-narrative-extraction.prd.md": "docs/2_architecture_and_specs/spec-sprint-content-extraction.md",
        "docs/specs/sprint-progress-database-migration.md": "docs/2_architecture_and_specs/spec-sprint-progress-database-migration.md",
        "docs/specs/testing-strategy.md": "docs/2_architecture_and_specs/spec-testing-strategy.md",
        "docs/planning/tnitd-website.md": "docs/2_architecture_and_specs/spec-website-initial-plan.md",

        # 2_architecture_and_specs/ai/
        "docs/specs/ai/diamond-rag.md": "docs/2_architecture_and_specs/ai/spec-diamond-rag.md",
        "docs/specs/ai/rag-setup.md": "docs/2_architecture_and_specs/ai/spec-rag-setup.md",

        # 2_architecture_and_specs/auth/
        "docs/specs/auth-magic-link-double-request-issue.md": "docs/2_architecture_and_specs/auth/spec-magic-link-double-request-issue.md",

        # 2_architecture_and_specs/cms/
        "docs/specs/cms-managed-copy-analysis-agentic.md": "docs/2_architecture_and_specs/cms/spec-cms-copy-management-agentic.md",
        "docs/specs/cms-managed-copy-analysis.md": "docs/2_architecture_and_specs/cms/spec-cms-copy-management.md",
        "docs/specs/sprint-cms-migration.md": "docs/2_architecture_and_specs/cms/spec-sprint-cms-migration.md",

        # 2_architecture_and_specs/payments/
        "docs/specs/aceternity-ui-cleanup.prd.md": "docs/2_architecture_and_specs/payments/spec-aceternity-ui-cleanup.md",

        # 2_architecture_and_specs/video/
        "docs/specs/video/video-integration-plan.md": "docs/2_architecture_and_specs/video/spec-video-integration-plan.md",
        "docs/specs/video/video-integration-simplified.md": "docs/2_architecture_and_specs/video/spec-video-integration-simplified.md",

        # 3_guides_and_how-tos/handoff/
        "docs/client-handover-services-guide.md": "docs/3_guides_and_how-tos/handoff/guide-client-handoff-services.md",
        "docs/guides/developer-handoff-guide.md": "docs/3_guides_and_how-tos/handoff/guide-developer-handoff.md",
        "docs/guides/stripe-client-setup.md": "docs/3_guides_and_how-tos/handoff/guide-stripe-client-setup.md",

        # 3_guides_and_how-tos/setup/
        "docs/guides/auth-setup.md": "docs/3_guides_and_how-tos/setup/guide-auth-setup.md",
        "docs/guides/cms-setup.md": "docs/3_guides_and_how-tos/setup/guide-cms-setup.md",
        "docs/guides/gmail-smtp-setup.md": "docs/3_guides_and_how-tos/setup/guide-gmail-smtp-setup.md",
        "docs/guides/resend-setup.md": "docs/3_guides_and_how-tos/setup/guide-resend-setup.md",
        "docs/guides/stripe-setup-guide.md": "docs/3_guides_and_how-tos/setup/guide-stripe-setup.md",

        # 3_guides_and_how-tos/workflows/
        "docs/cms-rollback-guide.md": "docs/3_guides_and_how-tos/workflows/guide-cms-rollback.md",
        "docs/cms-workflow.md": "docs/3_guides_and_how-tos/workflows/workflow-cms.md",

        # 4_content_and_copy/book/
        "docs/content/book/turning-snowflakes-into-diamonds.md": "docs/4_content_and_copy/book/turning-snowflakes-into-diamonds.md",

        # 4_content_and_copy/website_copy/
        "docs/content/copy/copy-diff-suggested-1.md": "docs/4_content_and_copy/website_copy/final-offer-stack-copy.md",
        "docs/content/copy/seed-copy-1.md": "docs/4_content_and_copy/website_copy/v1-seed-copy-1.md",
        "docs/content/copy/seed-copy-2.md": "docs/4_content_and_copy/website_copy/v1-seed-copy-2.md",
        "docs/content/copy/seed-copy-3.md": "docs/4_content_and_copy/website_copy/v1-seed-copy-3.md",
        "docs/content/copy/website-copy-for-editing.md": "docs/4_content_and_copy/website_copy/final-website-copy.md",

        # scripts/
        "mark-all-days-complete.js": "scripts/util-mark-all-days-complete.js",

        # _archive/reports/audits_and_analysis/
        "docs/reports/auth-url-environment-variables-analysis.md": "_archive/reports/audits_and_analysis/analysis-auth-url-env-vars.md",
        "docs/browser-memory-leak-analysis.md": "_archive/reports/audits_and_analysis/analysis-browser-memory-leak.md",
        "docs/reports/zombie-code-analysis-2025-11-04.md": "_archive/reports/audits_and_analysis/analysis-zombie-code-2025-11-04.md",
        "docs/reports/database-table-usage-survey.md": "_archive/reports/audits_and_analysis/audit-database-table-usage-2025-10-15.md",
        "docs/reports/documentation-audit-2025-10-16.md": "_archive/reports/audits_and_analysis/audit-documentation-2025-10-16.md",

        # _archive/reports/implementation_summaries/
        "docs/reports/axiom-logging-implementation-report.md": "_archive/reports/implementation_summaries/impl-axiom-logging.md",
        "docs/reports/bunny-credentials-update-2025-10-16.md": "_archive/reports/implementation_summaries/impl-bunny-credentials-update-2025-10-16.md",
        "docs/cms-config-sprint-slug-fix.md": "_archive/reports/implementation_summaries/impl-cms-config-sprint-slug-fix.md",
        "docs/reports/diamond-manifesto-delivery-implementation.md": "_archive/reports/implementation_summaries/impl-diamond-manifesto-delivery.md",
        "docs/knip-cleanup-summary.md": "_archive/reports/implementation_summaries/impl-knip-cleanup.md",
        "docs/reports/member-portal-db-migration-2025-11-04.md": "_archive/reports/implementation_summaries/impl-member-portal-db-migration-2025-11-04.md",
        "docs/implementation-summary-mobile-tablet-animations.md": "_archive/reports/implementation_summaries/impl-mobile-tablet-animations.md",
        "docs/reports/observability-error-tracking-plan.md": "_archive/reports/implementation_summaries/impl-observability-plan.md",
        "docs/specs/performance/performance-optimization-report.md": "_archive/reports/implementation_summaries/impl-performance-optimization.md",
        "docs/specs/integrations/resend-implementation-summary.md": "_archive/reports/implementation_summaries/impl-resend-integration.md",
        "docs/reports/stripe-integration-setup-complete.md": "_archive/reports/implementation_summaries/impl-stripe-integration-setup.md",
        "docs/reports/stripe-webhook-implementation-2025-11-03.md": "_archive/reports/implementation_summaries/impl-stripe-webhook-2025-11-03.md",

        # _archive/reports/testing/
        "docs/guides/sprint-e2e-testing.md": "_archive/reports/testing/guide-sprint-e2e-testing.md",
        "docs/knip-cleanup-checklist.md": "_archive/reports/testing/plan-knip-cleanup-checklist.md",
        "docs/reports/e2e-test-implementation-final-report.md": "_archive/reports/testing/report-e2e-test-implementation-final.md",
        "docs/reports/mobile-bug-quickstart.md": "_archive/reports/testing/report-mobile-bug-quickstart.md",
        "docs/reports/observability-executive-summary.md": "_archive/reports/testing/report-observability-executive-summary.md",
        "docs/reports/phase-1-unit-tests-summary.md": "_archive/reports/testing/report-phase-1-unit-tests-summary.md",
        "docs/reports/phase-2-component-tests-outline.md": "_archive/reports/testing/report-phase-2-component-tests-outline.md",
        "docs/reports/phase-2-component-tests-summary.md": "_archive/reports/testing/report-phase-2-component-tests-summary.md",
        "docs/test-suite-cleanup-summary.md": "_archive/reports/testing/report-test-suite-cleanup-summary.md",
        "docs/test-suite-status-report.md": "_archive/reports/testing/report-test-suite-status.md",
        "docs/reports/wave-1-authentication-tests-implementation.md": "_archive/reports/testing/report-wave-1-auth-tests.md",
        "docs/reports/wave-2-parallel-implementation-complete.md": "_archive/reports/testing/report-wave-2-implementation.md",
        "docs/reports/wave-2-sprint-e2e-tests-summary.md": "_archive/reports/testing/report-wave-2-sprint-e2e-summary.md",
        "docs/reports/wave-3-parallel-implementation-complete.md": "_archive/reports/testing/report-wave-3-implementation.md",
        "docs/reports/wave-3-profile-tests-debugging-guide.md": "_archive/reports/testing/report-wave-3-profile-tests-debugging.md",
        "docs/reports/wave-3-profile-tests-implementation-summary.md": "_archive/reports/testing/report-wave-3-profile-tests-summary.md",
        "docs/reports/wave-4-parallel-implementation-complete.md": "_archive/reports/testing/report-wave-4-implementation.md",
        "docs/reports/wave-5-parallel-implementation-complete.md": "_archive/reports/testing/report-wave-5-implementation.md",
        "docs/reports/wave-6-cms-implementation-complete.md": "_archive/reports/testing/report-wave-6-cms-implementation.md",

        # _archive/reports/weekly_updates/
        "docs/reports/dev-update-17-oct.md": "_archive/reports/weekly_updates/update-2025-10-17-dev-summary.md",
        "docs/reports/session-2025-11-04-summary.md": "_archive/reports/weekly_updates/update-2025-11-04-session-summary.md",
        "docs/reports/weekly-update-2025-11-13.md": "_archive/reports/weekly_updates/update-2025-11-13-weekly-summary.md",

        # _archive/ (root level)
        "docs/specs/documentation-handover-review.md": "_archive/handover-review-2025-11-15.md",
    }


def create_directory_structure(dry_run: bool = False, verbose: bool = False) -> None:
    """Create the new directory structure"""
    directories = [
        "docs/1_planning/analysis",
        "docs/1_planning/product_requirements",
        "docs/1_planning/sprints",
        "docs/2_architecture_and_specs/ai",
        "docs/2_architecture_and_specs/auth",
        "docs/2_architecture_and_specs/cms",
        "docs/2_architecture_and_specs/payments",
        "docs/2_architecture_and_specs/video",
        "docs/3_guides_and_how-tos/handoff",
        "docs/3_guides_and_how-tos/setup",
        "docs/3_guides_and_how-tos/workflows",
        "docs/4_content_and_copy/book",
        "docs/4_content_and_copy/website_copy",
        "scripts",
        "_archive/reports/weekly_updates",
        "_archive/reports/implementation_summaries",
        "_archive/reports/audits_and_analysis",
        "_archive/reports/testing",
    ]

    for directory in directories:
        dir_path = BASE_DIR / directory
        if dry_run:
            if verbose:
                print(f"{Colors.CYAN}[DRY-RUN] Would create: {directory}{Colors.ENDC}")
        else:
            dir_path.mkdir(parents=True, exist_ok=True)
            if verbose:
                print(f"{Colors.GREEN}Created: {directory}{Colors.ENDC}")


def migrate_files(dry_run: bool = False, verbose: bool = False) -> Tuple[List[str], List[str], List[str]]:
    """
    Migrate files according to the migration map.

    Returns:
        Tuple of (successful_moves, failed_moves, skipped_files)
    """
    migration_map = get_migration_map()
    successful = []
    failed = []
    skipped = []

    for source, destination in migration_map.items():
        source_path = BASE_DIR / source
        dest_path = BASE_DIR / destination

        if not source_path.exists():
            skipped.append(source)
            if verbose:
                print(f"{Colors.YELLOW}Skipped (not found): {source}{Colors.ENDC}")
            continue

        if dry_run:
            print(f"{Colors.CYAN}[DRY-RUN] Would move:{Colors.ENDC}")
            print(f"  {Colors.BLUE}FROM:{Colors.ENDC} {source}")
            print(f"  {Colors.BLUE}TO:{Colors.ENDC}   {destination}")
            successful.append(source)
        else:
            try:
                # Ensure destination directory exists
                dest_path.parent.mkdir(parents=True, exist_ok=True)

                # Move the file
                shutil.move(str(source_path), str(dest_path))
                successful.append(source)

                if verbose:
                    print(f"{Colors.GREEN}Moved:{Colors.ENDC}")
                    print(f"  {Colors.BLUE}FROM:{Colors.ENDC} {source}")
                    print(f"  {Colors.BLUE}TO:{Colors.ENDC}   {destination}")
            except Exception as e:
                failed.append(f"{source} -> {destination}: {str(e)}")
                print(f"{Colors.RED}Failed to move {source}: {str(e)}{Colors.ENDC}")

    return successful, failed, skipped


def cleanup_empty_directories(dry_run: bool = False, verbose: bool = False) -> List[str]:
    """Remove empty directories after migration"""
    removed = []
    directories_to_check = [
        "docs/architecture",
        "docs/specs/ai",
        "docs/specs/blog",
        "docs/specs/integrations",
        "docs/specs/performance",
        "docs/specs/video",
        "docs/specs",
        "docs/planning/sprints",
        "docs/planning",
        "docs/guides",
        "docs/reports",
        "docs/features",
        "content/book",
        "content/copy",
        "content",
    ]

    for directory in directories_to_check:
        dir_path = BASE_DIR / directory
        if dir_path.exists():
            try:
                if not any(dir_path.iterdir()):  # Check if empty
                    if dry_run:
                        if verbose:
                            print(f"{Colors.CYAN}[DRY-RUN] Would remove empty: {directory}{Colors.ENDC}")
                        removed.append(directory)
                    else:
                        dir_path.rmdir()
                        removed.append(directory)
                        if verbose:
                            print(f"{Colors.GREEN}Removed empty directory: {directory}{Colors.ENDC}")
            except OSError:
                if verbose:
                    print(f"{Colors.YELLOW}Could not remove {directory} (not empty or in use){Colors.ENDC}")

    return removed


def print_summary(successful: List[str], failed: List[str], skipped: List[str],
                 removed_dirs: List[str], dry_run: bool = False) -> None:
    """Print migration summary"""
    mode = "DRY-RUN SUMMARY" if dry_run else "MIGRATION SUMMARY"

    print(f"\n{Colors.HEADER}{Colors.BOLD}{'='*60}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{mode:^60}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{'='*60}{Colors.ENDC}\n")

    print(f"{Colors.GREEN}{Colors.BOLD}Successfully moved:{Colors.ENDC} {len(successful)} files")
    print(f"{Colors.RED}{Colors.BOLD}Failed:{Colors.ENDC} {len(failed)} files")
    print(f"{Colors.YELLOW}{Colors.BOLD}Skipped (not found):{Colors.ENDC} {len(skipped)} files")
    print(f"{Colors.BLUE}{Colors.BOLD}Empty directories removed:{Colors.ENDC} {len(removed_dirs)}")

    if failed:
        print(f"\n{Colors.RED}{Colors.BOLD}Failed migrations:{Colors.ENDC}")
        for failure in failed:
            print(f"  - {failure}")

    if skipped and len(skipped) > 5:
        print(f"\n{Colors.YELLOW}{Colors.BOLD}Skipped files (showing first 5):{Colors.ENDC}")
        for skip in skipped[:5]:
            print(f"  - {skip}")
        print(f"  ... and {len(skipped) - 5} more")
    elif skipped:
        print(f"\n{Colors.YELLOW}{Colors.BOLD}Skipped files:{Colors.ENDC}")
        for skip in skipped:
            print(f"  - {skip}")

    if dry_run:
        print(f"\n{Colors.CYAN}{Colors.BOLD}This was a dry run. No files were actually moved.{Colors.ENDC}")
        print(f"{Colors.CYAN}Run without --dry-run to execute the migration.{Colors.ENDC}")

    print(f"\n{Colors.HEADER}{Colors.BOLD}{'='*60}{Colors.ENDC}\n")


def create_migration_log(successful: List[str], failed: List[str],
                        skipped: List[str], removed_dirs: List[str]) -> None:
    """Create a log file of the migration"""
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    log_file = BASE_DIR / f"migration-log-{timestamp}.txt"

    with open(log_file, 'w') as f:
        f.write(f"Documentation Migration Log\n")
        f.write(f"Timestamp: {datetime.now().isoformat()}\n")
        f.write(f"{'='*60}\n\n")

        f.write(f"Successfully moved: {len(successful)} files\n")
        for item in successful:
            f.write(f"  ✓ {item}\n")

        f.write(f"\nFailed: {len(failed)} files\n")
        for item in failed:
            f.write(f"  ✗ {item}\n")

        f.write(f"\nSkipped (not found): {len(skipped)} files\n")
        for item in skipped:
            f.write(f"  - {item}\n")

        f.write(f"\nEmpty directories removed: {len(removed_dirs)}\n")
        for item in removed_dirs:
            f.write(f"  - {item}\n")

    print(f"{Colors.GREEN}Migration log created: {log_file.name}{Colors.ENDC}")


def main():
    parser = argparse.ArgumentParser(
        description="Migrate documentation structure to new organization",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python scripts/migrate-docs-structure.py --dry-run
      Preview all changes without modifying files

  python scripts/migrate-docs-structure.py --verbose
      Execute migration with detailed output

  python scripts/migrate-docs-structure.py --dry-run --verbose
      Preview with detailed output
        """
    )
    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='Preview changes without actually moving files'
    )
    parser.add_argument(
        '--verbose', '-v',
        action='store_true',
        help='Show detailed output for each operation'
    )

    args = parser.parse_args()

    print(f"\n{Colors.HEADER}{Colors.BOLD}Documentation Structure Migration{Colors.ENDC}")
    print(f"{Colors.HEADER}{'='*60}{Colors.ENDC}\n")

    if args.dry_run:
        print(f"{Colors.CYAN}{Colors.BOLD}Running in DRY-RUN mode{Colors.ENDC}")
        print(f"{Colors.CYAN}No files will be modified{Colors.ENDC}\n")

    # Step 1: Create directory structure
    print(f"{Colors.BOLD}Step 1: Creating directory structure...{Colors.ENDC}")
    create_directory_structure(dry_run=args.dry_run, verbose=args.verbose)
    print(f"{Colors.GREEN}✓ Directory structure ready{Colors.ENDC}\n")

    # Step 2: Migrate files
    print(f"{Colors.BOLD}Step 2: Migrating files...{Colors.ENDC}")
    successful, failed, skipped = migrate_files(dry_run=args.dry_run, verbose=args.verbose)
    print(f"{Colors.GREEN}✓ File migration complete{Colors.ENDC}\n")

    # Step 3: Cleanup empty directories
    if not args.dry_run:
        print(f"{Colors.BOLD}Step 3: Cleaning up empty directories...{Colors.ENDC}")
        removed_dirs = cleanup_empty_directories(dry_run=args.dry_run, verbose=args.verbose)
        print(f"{Colors.GREEN}✓ Cleanup complete{Colors.ENDC}\n")
    else:
        print(f"{Colors.BOLD}Step 3: Checking for empty directories...{Colors.ENDC}")
        removed_dirs = cleanup_empty_directories(dry_run=args.dry_run, verbose=args.verbose)
        print(f"{Colors.GREEN}✓ Check complete{Colors.ENDC}\n")

    # Print summary
    print_summary(successful, failed, skipped, removed_dirs, dry_run=args.dry_run)

    # Create log file if not dry-run
    if not args.dry_run:
        create_migration_log(successful, failed, skipped, removed_dirs)

    # Exit with appropriate code
    if failed:
        exit(1)
    else:
        exit(0)


if __name__ == "__main__":
    main()
