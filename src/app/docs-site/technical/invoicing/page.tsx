import { DocsPage } from "@/components/docs/docs-page";
import Link from "next/link";

const GITHUB_BASE = "https://github.com/rickhallett/becoming-diamond-nextjs/blob/main/docs/invoicing";

export default function InvoicingPage() {
  return (
    <DocsPage
      title="Development Invoicing"
      description="Executive summaries and billing documentation for development work"
    >
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 my-6">
        <h3 className="text-lg font-semibold text-blue-300 mb-3">
          📋 Billing Documentation
        </h3>
        <p className="text-sm text-neutral-300 leading-relaxed">
          This section contains executive summaries of development work completed,
          including detailed breakdowns of features implemented, hours spent, and
          technical achievements. These documents serve as transparent billing records
          and project progress tracking.
        </p>
      </div>

      <h2>Current Invoice - January 9, 2026</h2>
      <div className="space-y-4 mb-8">
        <div className="border border-primary/50 rounded-lg p-6 bg-primary/5">
          <h3 className="text-xl font-semibold text-white mb-2">
            <Link
              href={`${GITHUB_BASE}/invoice-2026-01-09.md`}
              className="text-primary hover:underline"
              target="_blank"
            >
              Invoice INV-2026-01-09
            </Link>
          </h3>
          <p className="text-sm text-neutral-400 mb-4">
            Total Development Hours: 2.0 hours | Total Amount: $80.00
          </p>
          <div className="text-sm text-neutral-300 space-y-3">
            <p className="font-medium text-white">Development Services:</p>
            <div className="space-y-3 ml-2">
              <div>
                <p className="font-semibold text-primary">January 9, 2026 (2.0 hours - $80.00)</p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-neutral-400">
                  <li>Password Authentication Feature - Email/password login for iOS home screen app users</li>
                  <li>Database migration, bcrypt hashing, profile password management</li>
                  <li>Sign-in page updates with magic link/password toggle</li>
                  <li>Production deployment and Vercel CLI automation</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-700">
              <p className="font-bold text-white text-lg">Total Due: $80.00</p>
            </div>
          </div>
        </div>
      </div>

      <h2>Previous Invoice - December 20-29, 2025</h2>
      <div className="space-y-4 mb-8">
        <div className="border border-neutral-800 rounded-lg p-6 bg-neutral-900/50">
          <h3 className="text-xl font-semibold text-white mb-2">
            <Link
              href={`${GITHUB_BASE}/invoice-2025-12-29.md`}
              className="text-primary hover:underline"
              target="_blank"
            >
              Invoice INV-2025-12-29
            </Link>
          </h3>
          <p className="text-sm text-neutral-400 mb-4">
            Total Development Hours: 14.5 hours | Total Amount: $640.00
          </p>
          <div className="text-sm text-neutral-300 space-y-3">
            <p className="font-medium text-white">Development Services Breakdown:</p>
            <div className="space-y-3 ml-2">
              <div>
                <p className="font-semibold text-primary">December 29, 2025 (3.0 hours - $140.00)</p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-neutral-400">
                  <li>CI/CD Infrastructure Setup - Automated deployment pipeline with GitHub Actions</li>
                  <li>OAuth Investigation - Client ID mismatch analysis and troubleshooting</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-primary">December 25-28, 2025 (5.5 hours - $220.00)</p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-neutral-400">
                  <li>Documentation Site Enhancement - Professional redesign with search and navigation</li>
                  <li>Middleware Restoration - Seven-phase security implementation</li>
                  <li>Repository Maintenance - Structure optimization and deployment fixes</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-primary">December 24, 2025 (4.0 hours - $160.00)</p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-neutral-400">
                  <li>Video Platform Updates - 30 sprint videos updated with thumbnails and transcripts</li>
                  <li>Automated video management pipeline with 6 utility scripts</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-primary">December 20-21, 2024 (2.0 hours - $80.00)</p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-neutral-400">
                  <li>Technical Research & Planning - Stripe, CI/CD scoping, Wix migration analysis</li>
                </ul>
              </div>
            </div>
            <p className="font-medium text-white mt-4">Infrastructure Services:</p>
            <ul className="list-disc list-inside space-y-1 ml-2 text-neutral-400">
              <li>Vercel Pro Subscription - December 2025 ($30.00)</li>
              <li>Vercel Pro Subscription - November 2025 ($30.00)</li>
            </ul>
            <div className="mt-4 pt-4 border-t border-neutral-700">
              <p className="font-bold text-white text-lg">Total Due: $640.00</p>
            </div>
          </div>
        </div>
      </div>

      <h2>Individual Work Summaries</h2>

      <h3 className="text-xl mt-8 mb-4">December 2025</h3>
      <div className="space-y-4">
        <div className="border border-neutral-800 rounded-lg p-5 bg-neutral-900/50">
          <h4 className="text-lg font-semibold text-white mb-2">
            <Link
              href={`${GITHUB_BASE}/executive-summary-2025-12-24.md`}
              className="text-primary hover:underline"
              target="_blank"
            >
              Video Platform Updates - December 24, 2025
            </Link>
          </h4>
          <p className="text-sm text-neutral-400 mb-3">
            Development Hours: 4 hours
          </p>
          <div className="text-sm text-neutral-300 space-y-2">
            <p className="font-medium text-white">Work Completed:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Updated all 30 sprint day videos to new series</li>
              <li>Fixed YAML formatting issues causing dashboard errors</li>
              <li>Implemented automatic video thumbnail display</li>
              <li>Created video summary transcript generation pipeline</li>
              <li>Fixed HTML structure for consistent paragraph formatting</li>
            </ul>
            <p className="font-medium text-white mt-4">Technical Deliverables:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Automated video management scripts with filename conventions</li>
              <li>Bunny Stream API integration for thumbnails</li>
              <li>Transcript processing and formatting system</li>
              <li>Comprehensive documentation of implementation</li>
            </ul>
          </div>
        </div>
      </div>

      <h2>December 2024</h2>
      <div className="space-y-4">
        <div className="border border-neutral-800 rounded-lg p-5 bg-neutral-900/50">
          <h3 className="text-lg font-semibold text-white mb-2">
            <Link
              href={`${GITHUB_BASE}/executive-summary-2024-12-20.md`}
              className="text-primary hover:underline"
              target="_blank"
            >
              Technical Research & Planning - December 20-21, 2024
            </Link>
          </h3>
          <p className="text-sm text-neutral-400 mb-3">
            Development Hours: 2 hours
          </p>
          <div className="text-sm text-neutral-300 space-y-2">
            <p className="font-medium text-white">Work Completed:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Stripe discount codes research and setup guide</li>
              <li>Deployment environments (CI/CD) project scoping</li>
              <li>Wix migration feasibility analysis</li>
            </ul>
            <p className="font-medium text-white mt-4">Technical Deliverables:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Comprehensive Stripe promotion code documentation</li>
              <li>Three-tier deployment environment cost estimates</li>
              <li>Four-tier Wix migration options analysis</li>
              <li>Documentation site pages for all research projects</li>
            </ul>
            <p className="text-xs text-neutral-500 mt-3 italic">
              Note: Research and planning deliverables only - no implementation work performed
            </p>
          </div>
        </div>
      </div>

      <h2>Automation & Future Work</h2>
      <p>
        Video management has been streamlined with automated discovery and versioning
        scripts. Future video updates will use a filename convention that enables:
      </p>
      <ul>
        <li>Automatic discovery of new video versions</li>
        <li>Diff comparison against current production videos</li>
        <li>Selective updates with backup/restore capabilities</li>
        <li>Verification and testing automation</li>
      </ul>
      <p>
        This reduces video update time from hours to minutes and eliminates manual
        video-to-day mapping.
      </p>

      <h2>Related Documentation</h2>
      <ul>
        <li>
          <Link href="/docs-site/technical/reports" className="text-primary hover:underline">
            Technical Reports
          </Link>{" "}
          - Historical development session notes
        </li>
        <li>
          <Link href="/docs-site/technical/specs" className="text-primary hover:underline">
            Technical Specifications
          </Link>{" "}
          - Detailed implementation specs
        </li>
      </ul>
    </DocsPage>
  );
}
