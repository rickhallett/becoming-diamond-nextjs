import { DocsPage } from "@/components/docs/docs-page";
import Link from "next/link";

const GITHUB_BASE = "https://github.com/rickhallett/becoming-diamond-nextjs/blob/main/docs/specs";

export default function TechnicalSpecificationsPage() {
  return (
    <DocsPage
      title="Technical Specifications"
      description="Product requirements and technical planning documents"
    >
      <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-6 my-6">
        <h3 className="text-lg font-semibold text-amber-300 mb-3">
          ⚠️ Technical Artifact Disclaimer
        </h3>
        <p className="text-sm text-neutral-300 leading-relaxed">
          These documents are artifacts of agentic development (AI-assisted planning sessions)
          and represent historical, current, or future work on this project. They include
          Product Requirements Documents (PRDs), technical specifications, integration plans,
          and architectural explorations. Many of these are planning exercises, scoping
          estimates, or product brainstorming sessions that may never be implemented—they
          exist as thought experiments and decision-making tools. These are preserved for
          future human/AI context, enabling faster understanding of why certain technical
          decisions were made (or not made) and providing a reference for potential future
          development.
        </p>
      </div>

      <h2>Testing Strategy</h2>
      <ul>
        <li>
          <Link href={`${GITHUB_BASE}/testing-strategy.md`} className="text-primary hover:underline" target="_blank">
            Testing Strategy
          </Link>{" "}
          - Overall approach to testing
        </li>
        <li>
          <Link href={`${GITHUB_BASE}/e2e-test-coverage-plan.md`} className="text-primary hover:underline" target="_blank">
            E2E Test Coverage Plan
          </Link>{" "}
          - End-to-end testing roadmap
        </li>
      </ul>

      <h2>Video Integration</h2>
      <ul>
        <li>
          <Link href={`${GITHUB_BASE}/video/video-hosting-analysis.md`} className="text-primary hover:underline" target="_blank">
            Video Hosting Analysis
          </Link>{" "}
          - Comparison of video platforms (Bunny, Mux, Vimeo, etc.)
        </li>
        <li>
          <Link href={`${GITHUB_BASE}/video/video-integration-simplified.md`} className="text-primary hover:underline" target="_blank">
            Video Integration (Simplified Approach)
          </Link>{" "}
          - Recommended implementation with Bunny Stream
        </li>
        <li>
          <Link href={`${GITHUB_BASE}/video/video-integration-plan.md`} className="text-primary hover:underline" target="_blank">
            Video Integration Plan (Full Admin UI)
          </Link>{" "}
          - Alternative approach with custom admin interface
        </li>
      </ul>

      <h2>Sprint Features</h2>
      <ul>
        <li>
          <Link href={`${GITHUB_BASE}/sprint-cms-migration.md`} className="text-primary hover:underline" target="_blank">
            Sprint CMS Migration
          </Link>{" "}
          - Moving sprint content to Decap CMS
        </li>
        <li>
          <Link href={`${GITHUB_BASE}/sprint-gamification-phase-1-5.prd.md`} className="text-primary hover:underline" target="_blank">
            Sprint Gamification (Phases 1-5)
          </Link>{" "}
          - Gamification features PRD
        </li>
        <li>
          <Link href={`${GITHUB_BASE}/sprint-gamification-delivery-strategy.md`} className="text-primary hover:underline" target="_blank">
            Sprint Gamification Delivery Strategy
          </Link>{" "}
          - Implementation approach
        </li>
        <li>
          <Link href={`${GITHUB_BASE}/sprint-video-narrative-extraction.prd.md`} className="text-primary hover:underline" target="_blank">
            Sprint Video Narrative Extraction
          </Link>{" "}
          - AI-assisted content extraction from videos
        </li>
      </ul>

      <h2>AI Features</h2>
      <ul>
        <li>
          <Link href={`${GITHUB_BASE}/diamondmind-ai-public-chat.prd.md`} className="text-primary hover:underline" target="_blank">
            DiamondMind AI Public Chat
          </Link>{" "}
          - Public AI chat interface PRD
        </li>
        <li>
          <Link href={`${GITHUB_BASE}/ai/diamond-rag.md`} className="text-primary hover:underline" target="_blank">
            Diamond RAG System
          </Link>{" "}
          - Retrieval-augmented generation for AI assistant
        </li>
        <li>
          <Link href={`${GITHUB_BASE}/ai/rag-setup.md`} className="text-primary hover:underline" target="_blank">
            RAG Setup Guide
          </Link>{" "}
          - Technical implementation details
        </li>
        <li>
          <Link href={`${GITHUB_BASE}/ai/turso-vector-migration-analysis.md`} className="text-primary hover:underline" target="_blank">
            Turso Vector Migration Analysis
          </Link>{" "}
          - Vector database integration for RAG
        </li>
      </ul>

      <h2>Blog Features</h2>
      <ul>
        <li>
          <Link href={`${GITHUB_BASE}/blog/author-pages.prd.md`} className="text-primary hover:underline" target="_blank">
            Author Pages PRD
          </Link>{" "}
          - Individual author profile pages
        </li>
      </ul>

      <h2>E-Commerce</h2>
      <ul>
        <li>
          <Link href={`${GITHUB_BASE}/book-purchasing.prd.md`} className="text-primary hover:underline" target="_blank">
            Book Purchasing PRD
          </Link>{" "}
          - Stripe integration for book sales
        </li>
      </ul>

      <h2>Content Management</h2>
      <ul>
        <li>
          <Link href={`${GITHUB_BASE}/decap-cms-enhancements.prd.md`} className="text-primary hover:underline" target="_blank">
            Decap CMS Enhancements
          </Link>{" "}
          - Proposed CMS improvements
        </li>
        <li>
          <Link href={`${GITHUB_BASE}/diamond-manifesto-delivery.prd.md`} className="text-primary hover:underline" target="_blank">
            Diamond Manifesto Delivery
          </Link>{" "}
          - Content delivery specification
        </li>
      </ul>

      <h2>Email Integration</h2>
      <ul>
        <li>
          <Link href={`${GITHUB_BASE}/integrations/resend-lead-email-integration.prd.md`} className="text-primary hover:underline" target="_blank">
            Resend Lead Email Integration PRD
          </Link>{" "}
          - Email service integration for lead capture
        </li>
        <li>
          <Link href={`${GITHUB_BASE}/integrations/resend-implementation-summary.md`} className="text-primary hover:underline" target="_blank">
            Resend Implementation Summary
          </Link>{" "}
          - Implementation report
        </li>
      </ul>

      <h2>Performance Optimization</h2>
      <ul>
        <li>
          <Link href={`${GITHUB_BASE}/performance/performance-optimization.md`} className="text-primary hover:underline" target="_blank">
            Performance Optimization Plan
          </Link>{" "}
          - Overall optimization strategy
        </li>
        <li>
          <Link href={`${GITHUB_BASE}/performance/performance-optimization-report.md`} className="text-primary hover:underline" target="_blank">
            Performance Optimization Report
          </Link>{" "}
          - Results and metrics (59% page weight reduction achieved)
        </li>
      </ul>

      <h2>UI/UX Improvements</h2>
      <ul>
        <li>
          <Link href={`${GITHUB_BASE}/aceternity-ui-cleanup.prd.md`} className="text-primary hover:underline" target="_blank">
            Aceternity UI Cleanup PRD
          </Link>{" "}
          - Component library cleanup and optimization
        </li>
      </ul>

      <h2>Document Categories</h2>
      <p>
        Specifications are organized into several categories:
      </p>
      <ul>
        <li><strong>PRDs (Product Requirements Documents)</strong>: Detailed feature specifications with user stories, technical requirements, and success metrics</li>
        <li><strong>Technical Plans</strong>: Architecture decisions, integration strategies, and implementation approaches</li>
        <li><strong>Analyses</strong>: Research documents comparing options or evaluating technical approaches</li>
        <li><strong>Strategies</strong>: High-level planning documents for phased rollouts or delivery approaches</li>
      </ul>

      <h2>Status Indicators</h2>
      <p>
        Not all specifications represent implemented features. Documents may fall into:
      </p>
      <ul>
        <li><strong>Completed</strong>: Feature is live in production (e.g., Book Purchasing, Performance Optimization)</li>
        <li><strong>In Progress</strong>: Partially implemented or actively being worked on</li>
        <li><strong>Planned</strong>: Approved for future implementation</li>
        <li><strong>Exploratory</strong>: Research or brainstorming exercise, may never be built</li>
        <li><strong>Archived</strong>: Superseded by newer approaches or no longer relevant</li>
      </ul>

      <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 my-6">
        <p className="text-sm text-neutral-300">
          <strong>Note:</strong> Many specifications were created to explore possibilities,
          estimate scope, or document decision-making processes. Their existence doesn't
          guarantee implementation—they serve as a reference library for "what if" scenarios
          and architectural discussions.
        </p>
      </div>

      <h2>Viewing Documents</h2>
      <p>
        All specifications are stored as Markdown files in the GitHub repository. Click
        any link above to view the full document on GitHub. You can also browse the
        entire specs directory:
      </p>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 my-4">
        <p className="text-sm text-neutral-400">
          <strong>Browse all specifications:</strong>{" "}
          <Link
            href="https://github.com/rickhallett/becoming-diamond-nextjs/tree/main/docs/specs"
            className="text-primary hover:underline"
            target="_blank"
          >
            View specs directory on GitHub →
          </Link>
        </p>
      </div>

      <h2>Next Steps</h2>
      <ul>
        <li>
          <Link href="/docs-site/technical/reports" className="text-primary hover:underline">
            Browse Development Reports
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
