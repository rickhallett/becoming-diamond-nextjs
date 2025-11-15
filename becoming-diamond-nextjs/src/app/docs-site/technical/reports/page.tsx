import { DocsPage } from "@/components/docs/docs-page";
import Link from "next/link";

const GITHUB_BASE = "https://github.com/rickhallett/becoming-diamond-nextjs/blob/main/becoming-diamond-nextjs/docs/reports";

export default function TechnicalReportsPage() {
  return (
    <DocsPage
      title="Development Reports"
      description="Historical implementation reports from agentic development sessions"
    >
      <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-6 my-6">
        <h3 className="text-lg font-semibold text-amber-300 mb-3">
          ⚠️ Technical Artifact Disclaimer
        </h3>
        <p className="text-sm text-neutral-300 leading-relaxed">
          These documents are artifacts of agentic development (AI-assisted coding sessions)
          and represent historical, current, or future work on this project. They include
          implementation reports, technical explorations, debugging sessions, and migration
          summaries. Some documents describe completed work, while others may represent
          plans, experiments, or exercises in scoping and estimation that were never
          implemented. These are preserved largely for future human/AI context and to
          enable more rapid problem-solving by providing a searchable history of
          architectural decisions and technical approaches.
        </p>
      </div>

      <h2>Recent Updates</h2>
      <ul>
        <li>
          <Link href={`${GITHUB_BASE}/weekly-update-2025-11-13.md`} className="text-primary hover:underline" target="_blank">
            Weekly Update 2025-11-13
          </Link>{" "}
          - Latest weekly development summary
        </li>
        <li>
          <Link href={`${GITHUB_BASE}/session-2025-11-04-summary.md`} className="text-primary hover:underline" target="_blank">
            Session Summary 2025-11-04
          </Link>{" "}
          - Development session notes
        </li>
        <li>
          <Link href={`${GITHUB_BASE}/dev-update-17-oct.md`} className="text-primary hover:underline" target="_blank">
            Development Update October 17
          </Link>{" "}
          - Mid-October progress report
        </li>
      </ul>

      <h2>Testing & Quality Assurance</h2>

      <h3>End-to-End Testing</h3>
      <ul>
        <li>
          <Link href={`${GITHUB_BASE}/e2e-test-implementation-final-report.md`} className="text-primary hover:underline" target="_blank">
            E2E Test Implementation Final Report
          </Link>{" "}
          - Comprehensive testing strategy summary
        </li>
        <li>
          <Link href={`${GITHUB_BASE}/wave-1-authentication-tests-implementation.md`} className="text-primary hover:underline" target="_blank">
            Wave 1: Authentication Tests
          </Link>{" "}
          - Initial auth testing implementation
        </li>
        <li>
          <Link href={`${GITHUB_BASE}/wave-2-sprint-e2e-tests-summary.md`} className="text-primary hover:underline" target="_blank">
            Wave 2: Sprint E2E Tests
          </Link>{" "}
          - Sprint functionality testing
        </li>
        <li>
          <Link href={`${GITHUB_BASE}/wave-2-parallel-implementation-complete.md`} className="text-primary hover:underline" target="_blank">
            Wave 2: Parallel Implementation Complete
          </Link>
        </li>
        <li>
          <Link href={`${GITHUB_BASE}/wave-3-profile-tests-implementation-summary.md`} className="text-primary hover:underline" target="_blank">
            Wave 3: Profile Tests Implementation
          </Link>{" "}
          - Profile page testing
        </li>
        <li>
          <Link href={`${GITHUB_BASE}/wave-3-profile-tests-debugging-guide.md`} className="text-primary hover:underline" target="_blank">
            Wave 3: Profile Tests Debugging Guide
          </Link>
        </li>
        <li>
          <Link href={`${GITHUB_BASE}/wave-3-parallel-implementation-complete.md`} className="text-primary hover:underline" target="_blank">
            Wave 3: Parallel Implementation Complete
          </Link>
        </li>
        <li>
          <Link href={`${GITHUB_BASE}/wave-4-parallel-implementation-complete.md`} className="text-primary hover:underline" target="_blank">
            Wave 4: Parallel Implementation Complete
          </Link>
        </li>
        <li>
          <Link href={`${GITHUB_BASE}/wave-5-parallel-implementation-complete.md`} className="text-primary hover:underline" target="_blank">
            Wave 5: Parallel Implementation Complete
          </Link>
        </li>
        <li>
          <Link href={`${GITHUB_BASE}/wave-6-cms-implementation-complete.md`} className="text-primary hover:underline" target="_blank">
            Wave 6: CMS Implementation Complete
          </Link>
        </li>
      </ul>

      <h3>Unit & Component Testing</h3>
      <ul>
        <li>
          <Link href={`${GITHUB_BASE}/phase-1-unit-tests-summary.md`} className="text-primary hover:underline" target="_blank">
            Phase 1 Unit Tests Summary
          </Link>
        </li>
        <li>
          <Link href={`${GITHUB_BASE}/phase-2-component-tests-outline.md`} className="text-primary hover:underline" target="_blank">
            Phase 2 Component Tests Outline
          </Link>
        </li>
        <li>
          <Link href={`${GITHUB_BASE}/phase-2-component-tests-summary.md`} className="text-primary hover:underline" target="_blank">
            Phase 2 Component Tests Summary
          </Link>
        </li>
      </ul>

      <h2>Feature Implementation</h2>

      <h3>Authentication</h3>
      <ul>
        <li>
          <Link href={`${GITHUB_BASE}/auth-url-environment-variables-analysis.md`} className="text-primary hover:underline" target="_blank">
            Auth URL Environment Variables Analysis
          </Link>
        </li>
        <li>
          <Link href={`${GITHUB_BASE}/test-auth-navigation-fix.md`} className="text-primary hover:underline" target="_blank">
            Test Auth Navigation Fix
          </Link>
        </li>
      </ul>

      <h3>Video Integration</h3>
      <ul>
        <li>
          <Link href={`${GITHUB_BASE}/bunny-stream-video-inventory.md`} className="text-primary hover:underline" target="_blank">
            Bunny Stream Video Inventory
          </Link>{" "}
          - Complete video asset catalog
        </li>
        <li>
          <Link href={`${GITHUB_BASE}/bunny-video-migration-2025-10-16.md`} className="text-primary hover:underline" target="_blank">
            Bunny Video Migration Report
          </Link>
        </li>
        <li>
          <Link href={`${GITHUB_BASE}/bunny-credentials-update-2025-10-16.md`} className="text-primary hover:underline" target="_blank">
            Bunny Credentials Update
          </Link>
        </li>
      </ul>

      <h3>Stripe Integration</h3>
      <ul>
        <li>
          <Link href={`${GITHUB_BASE}/stripe-integration-setup-complete.md`} className="text-primary hover:underline" target="_blank">
            Stripe Integration Setup Complete
          </Link>
        </li>
        <li>
          <Link href={`${GITHUB_BASE}/stripe-webhook-implementation-2025-11-03.md`} className="text-primary hover:underline" target="_blank">
            Stripe Webhook Implementation
          </Link>
        </li>
      </ul>

      <h3>Content Management</h3>
      <ul>
        <li>
          <Link href={`${GITHUB_BASE}/diamond-manifesto-delivery-implementation.md`} className="text-primary hover:underline" target="_blank">
            Diamond Manifesto Delivery Implementation
          </Link>
        </li>
        <li>
          <Link href={`${GITHUB_BASE}/documentation-audit-2025-10-16.md`} className="text-primary hover:underline" target="_blank">
            Documentation Audit
          </Link>
        </li>
      </ul>

      <h2>Database & Migrations</h2>
      <ul>
        <li>
          <Link href={`${GITHUB_BASE}/member-portal-db-migration-2025-11-04.md`} className="text-primary hover:underline" target="_blank">
            Member Portal Database Migration
          </Link>
        </li>
        <li>
          <Link href={`${GITHUB_BASE}/phase1-migration-summary.md`} className="text-primary hover:underline" target="_blank">
            Phase 1 Migration Summary
          </Link>
        </li>
        <li>
          <Link href={`${GITHUB_BASE}/database-table-usage-survey.md`} className="text-primary hover:underline" target="_blank">
            Database Table Usage Survey
          </Link>
        </li>
      </ul>

      <h2>Bug Fixes & Debugging</h2>
      <ul>
        <li>
          <Link href={`${GITHUB_BASE}/profile-navigation-bug-fix.md`} className="text-primary hover:underline" target="_blank">
            Profile Navigation Bug Fix
          </Link>
        </li>
      </ul>

      <h2>Code Quality & Analysis</h2>
      <ul>
        <li>
          <Link href={`${GITHUB_BASE}/zombie-code-analysis-2025-11-04.md`} className="text-primary hover:underline" target="_blank">
            Zombie Code Analysis
          </Link>{" "}
          - Identifying and removing dead code
        </li>
        <li>
          <Link href={`${GITHUB_BASE}/ship-confidence-analysis.md`} className="text-primary hover:underline" target="_blank">
            Ship Confidence Analysis
          </Link>{" "}
          - Production readiness assessment
        </li>
      </ul>

      <h2>Viewing Documents</h2>
      <p>
        All reports are stored as Markdown files in the GitHub repository. Click any
        link above to view the full document on GitHub. You can also browse the entire
        reports directory:
      </p>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 my-4">
        <p className="text-sm text-neutral-400">
          <strong>Browse all reports:</strong>{" "}
          <Link
            href="https://github.com/rickhallett/becoming-diamond-nextjs/tree/main/becoming-diamond-nextjs/docs/reports"
            className="text-primary hover:underline"
            target="_blank"
          >
            View reports directory on GitHub →
          </Link>
        </p>
      </div>

      <h2>Next Steps</h2>
      <ul>
        <li>
          <Link href="/docs-site/technical/specs" className="text-primary hover:underline">
            Browse Technical Specifications
          </Link>
        </li>
        <li>
          <Link href="/docs-site/technical/architecture" className="text-primary hover:underline">
            Back to Architecture Overview
          </Link>
        </li>
      </ul>
    </DocsPage>
  );
}
