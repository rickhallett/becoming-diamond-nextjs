/* eslint-disable react/no-unescaped-entities */
import { DocsPage } from "@/components/docs/docs-page";
import Link from "next/link";

export default function ArchitecturePage() {
  return (
    <DocsPage
      title="Architecture Overview"
      description="Technical architecture and design decisions"
    >
      <p className="text-neutral-400">
        This section contains technical documentation for developers who need to
        understand the platform's architecture, make modifications, or perform
        maintenance.
      </p>

      <h2>Documentation Structure</h2>
      <p>
        Technical documentation is organized into several resources:
      </p>

      <div className="space-y-4 my-6">
        <div className="border border-neutral-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">CLAUDE.md</h3>
          <p className="text-sm text-neutral-400 mb-2">
            Comprehensive architecture documentation covering the entire codebase,
            technology stack, design patterns, and development workflows.
          </p>
          <Link
            href="https://github.com/rickhallett/becoming-diamond-nextjs/blob/main/becoming-diamond-nextjs/CLAUDE.md"
            className="text-sm text-primary hover:underline"
            target="_blank"
          >
            View on GitHub →
          </Link>
        </div>

        <div className="border border-neutral-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Weekly Reports</h3>
          <p className="text-sm text-neutral-400 mb-2">
            Development progress reports documenting features implemented,
            challenges addressed, and technical decisions made.
          </p>
          <Link
            href="/docs-site/technical/reports"
            className="text-sm text-primary hover:underline"
          >
            View reports →
          </Link>
        </div>

        <div className="border border-neutral-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Technical Specifications</h3>
          <p className="text-sm text-neutral-400 mb-2">
            Detailed specifications for specific features, including CMS
            configuration, video integration, and performance optimizations.
          </p>
          <Link
            href="/docs-site/technical/specs"
            className="text-sm text-primary hover:underline"
          >
            View specs →
          </Link>
        </div>
      </div>

      <h2>Key Technologies</h2>
      <ul>
        <li><strong>Next.js 15</strong> - React framework with App Router</li>
        <li><strong>NextAuth v5</strong> - Authentication with magic links and OAuth</li>
        <li><strong>Turso (libSQL)</strong> - Database for user data and sessions</li>
        <li><strong>Decap CMS</strong> - Git-based content management</li>
        <li><strong>Tailwind CSS 4</strong> - Utility-first styling</li>
        <li><strong>Aceternity UI</strong> - Component library for animations</li>
      </ul>

      <h2>Git Repository</h2>
      <p>
        The source code is hosted on GitHub:
      </p>
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 my-4">
        <p className="text-sm font-mono">
          <Link
            href="https://github.com/rickhallett/becoming-diamond-nextjs"
            className="text-primary hover:underline"
            target="_blank"
          >
            github.com/rickhallett/becoming-diamond-nextjs
          </Link>
        </p>
      </div>

      <h2>Deployment</h2>
      <p>
        The application is deployed on Vercel with automatic deployments from the
        main branch. Environment variables and configuration are managed through
        the Vercel dashboard.
      </p>

      <h2>For Developers</h2>
      <p>
        If you need to work on this codebase:
      </p>
      <ol>
        <li>Clone the repository from GitHub</li>
        <li>Install dependencies: <code className="px-2 py-1 bg-neutral-900 rounded text-sm">npm install</code></li>
        <li>Set up environment variables (see <code>.env.example</code>)</li>
        <li>Run development server: <code className="px-2 py-1 bg-neutral-900 rounded text-sm">npm run dev</code></li>
        <li>Read <code>CLAUDE.md</code> for complete architecture details</li>
      </ol>
    </DocsPage>
  );
}
