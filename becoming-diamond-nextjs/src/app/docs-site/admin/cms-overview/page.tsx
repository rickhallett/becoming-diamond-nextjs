/* eslint-disable react/no-unescaped-entities */
import { DocsPage } from "@/components/docs/docs-page";
import { FutureEnhancement } from "@/components/docs/future-enhancement";
import Link from "next/link";

export default function CMSOverviewPage() {
  return (
    <DocsPage
      title="CMS Overview"
      description="Managing content with Decap CMS"
    >
      <h2>What is Decap CMS?</h2>
      <p>
        Decap CMS (formerly Netlify CMS) is a Git-based content management system
        that lets you edit content directly through a user-friendly interface.
        All changes are committed to GitHub, giving you full version control and
        audit history.
      </p>

      <h2>Accessing the CMS</h2>
      <p>
        To access the CMS, navigate to the{" "}
        <code className="px-2 py-1 bg-neutral-900 rounded text-sm">/admin</code>{" "}
        route on your live site.
      </p>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 my-4">
        <p className="text-sm text-neutral-400">
          <strong>Access CMS:</strong>{" "}
          <Link href="/admin" className="text-primary hover:underline" target="_blank">
            Open /admin →
          </Link>
        </p>
      </div>

      <h2>Authentication</h2>
      <p>
        The CMS uses GitHub OAuth for authentication. You'll need to:
      </p>
      <ol>
        <li>Click "Login with GitHub"</li>
        <li>Authorize the application</li>
        <li>You'll be redirected back to the CMS interface</li>
      </ol>

      <p className="text-sm text-neutral-500 mt-2">
        <strong>Note:</strong> Only users with write access to the GitHub repository
        can edit content through the CMS.
      </p>

      <h2>CMS Workflow</h2>
      <p>
        The CMS operates on an environment-based workflow:
      </p>

      <ul>
        <li>
          <strong>Development (localhost)</strong>: Changes commit to <code>cms-staging</code> branch for testing
        </li>
        <li>
          <strong>Production (live site)</strong>: Changes commit directly to <code>main</code> branch and go live immediately
        </li>
      </ul>

      <p>
        This allows you to test content changes locally before they affect the live site.
      </p>

      <h2>Content Collections</h2>
      <p>The CMS manages several content types:</p>

      <div className="space-y-4 my-6">
        <div className="border border-neutral-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">30 Day Sprint</h3>
          <p className="text-sm text-neutral-400 mb-2">
            Manage all 30 days of sprint content, including titles, videos, difficulty levels, and markdown content.
          </p>
          <Link
            href="/docs-site/admin/sprint-management"
            className="text-sm text-primary hover:underline"
          >
            Learn more →
          </Link>
        </div>

        <div className="border border-neutral-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Blog Posts (Insights)</h3>
          <p className="text-sm text-neutral-400 mb-2">
            Create and publish blog posts with author info, featured images, categories, and tags. Displayed on the website under "Insights" navigation.
          </p>
          <Link
            href="/docs-site/admin/blog-management"
            className="text-sm text-primary hover:underline"
          >
            Learn more →
          </Link>
        </div>
      </div>

      <FutureEnhancement>
        <p>
          Currently, content publishing is immediate in production.{" "}
          <strong>Future enhancement:</strong> Multi-user approval workflow could
          be added, allowing content to be drafted, reviewed, and approved by
          different team members before going live.
        </p>
      </FutureEnhancement>

      <h2>Safety and Rollback</h2>
      <p>
        All CMS changes are committed to Git, which means:
      </p>
      <ul>
        <li>Complete audit trail of who changed what and when</li>
        <li>Easy rollback if a mistake is made</li>
        <li>Version history for all content</li>
      </ul>

      <p className="text-sm text-neutral-500 mt-2">
        See the{" "}
        <Link href="/docs-site/admin/rollback" className="text-primary hover:underline">
          Rollback Procedures
        </Link>{" "}
        guide for recovery instructions.
      </p>

      <FutureEnhancement>
        <p>
          <strong>Future enhancement:</strong> Scheduled publishing could be added,
          allowing you to prepare content in advance and have it automatically
          publish at a specific date and time.
        </p>
      </FutureEnhancement>

      <h2>Next Steps</h2>
      <ul>
        <li>
          <Link href="/docs-site/admin/sprint-management" className="text-primary hover:underline">
            Managing Sprint Content
          </Link>{" "}
          - Learn how to edit sprint days
        </li>
        <li>
          <Link href="/docs-site/admin/blog-management" className="text-primary hover:underline">
            Blog Management
          </Link>{" "}
          - Publishing blog posts (Insights)
        </li>
        <li>
          <Link href="/docs-site/admin/rollback" className="text-primary hover:underline">
            Rollback Procedures
          </Link>{" "}
          - What to do if something goes wrong
        </li>
      </ul>
    </DocsPage>
  );
}
