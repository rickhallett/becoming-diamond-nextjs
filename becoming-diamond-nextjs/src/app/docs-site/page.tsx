import { DocsPage } from "@/components/docs/docs-page";
import Link from "next/link";

export default function DocsHomePage() {
  return (
    <DocsPage
      title="Documentation Home"
      description="Complete guide to the Becoming Diamond platform"
    >
      <p className="text-lg mb-6">
        Welcome to the Becoming Diamond documentation. This guide will help you
        understand and manage the platform effectively.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        {/* User Guide Card */}
        <Link
          href="/docs-site/user/getting-started"
          className="block p-6 rounded-lg border border-neutral-800 hover:border-primary/50 transition-colors bg-neutral-900/50"
        >
          <h3 className="text-xl font-semibold mb-2 text-white">User Guide</h3>
          <p className="text-neutral-400 text-sm">
            Learn how to navigate the platform, access the sprint program, and
            manage your profile.
          </p>
          <p className="text-primary text-sm mt-4">Get started →</p>
        </Link>

        {/* Admin Guide Card */}
        <Link
          href="/docs-site/admin/cms-overview"
          className="block p-6 rounded-lg border border-neutral-800 hover:border-primary/50 transition-colors bg-neutral-900/50"
        >
          <h3 className="text-xl font-semibold mb-2 text-white">Admin Guide</h3>
          <p className="text-neutral-400 text-sm">
            Manage content with Decap CMS, edit sprint days, publish blog posts,
            and handle rollbacks.
          </p>
          <p className="text-primary text-sm mt-4">Learn more →</p>
        </Link>
      </div>

      <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6 my-8">
        <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
        <ul className="space-y-2">
          <li>
            <Link
              href="/app"
              className="text-primary hover:underline"
              target="_blank"
            >
              Access Member Portal →
            </Link>
          </li>
          <li>
            <Link
              href="/admin"
              className="text-primary hover:underline"
              target="_blank"
            >
              Access CMS (/admin) →
            </Link>
          </li>
          <li>
            <Link
              href="/docs-site/technical/architecture"
              className="text-neutral-400 hover:text-white hover:underline"
            >
              Technical Documentation
            </Link>
          </li>
        </ul>
      </div>

      <div className="border-t border-neutral-800 pt-6 mt-8">
        <p className="text-sm text-neutral-500">
          This documentation is protected and only accessible to
          support@becomingdiamond.com. For assistance, please contact support.
        </p>
      </div>
    </DocsPage>
  );
}
