/* eslint-disable react/no-unescaped-entities */
import { DocsPage } from "@/components/docs/docs-page";
import Link from "next/link";

export default function RollbackProceduresPage() {
  return (
    <DocsPage
      title="Rollback & Recovery"
      description="Understanding content versioning and recovery options"
    >
      <h2>Your Content is Always Safe</h2>
      <p>
        One of the major benefits of using Decap CMS with a Git backend is that every
        change is automatically tracked and can be recovered. You have a complete safety
        net—nothing is ever truly lost.
      </p>

      <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 my-4">
        <p className="text-sm text-neutral-300">
          <strong>Safety guarantee:</strong> Every edit you make creates a permanent
          record in GitHub's version history. Even if you accidentally delete something
          or publish incorrect content, it can always be recovered.
        </p>
      </div>

      <h2>How Version Control Works</h2>
      <p>
        Every time you save a change in the CMS:
      </p>
      <ol>
        <li>Decap CMS creates a timestamped record of your changes</li>
        <li>The record is saved to GitHub with a description (e.g., "Update sprint/day-05.md")</li>
        <li>GitHub stores the complete history—you can see who changed what and when</li>
        <li>The site automatically rebuilds and deploys within 2-3 minutes</li>
      </ol>

      <h2>Preventing Mistakes</h2>
      <p>
        The best rollback is the one you never need. Follow these practices to work safely:
      </p>

      <h3>Use Draft Status</h3>
      <p>
        For blog posts and sprint days, set "Published" to false while you work. This
        saves your changes without making them visible on the live site.
      </p>

      <h3>Preview Before Publishing</h3>
      <p>
        Always use the CMS preview feature to see how your content will look before
        clicking "Save" with "Published" set to true.
      </p>

      <h3>Make Small, Incremental Changes</h3>
      <p>
        Instead of editing 10 files at once, edit and save one file at a time. This
        makes it easier to identify and fix any issues that arise.
      </p>

      <h3>Double-Check Before Deleting</h3>
      <p>
        When deleting content through the CMS, make sure you're deleting the right item.
        While everything can be recovered, it's better to avoid mistakes in the first place.
      </p>

      <h2>When You Need to Recover Content</h2>
      <p>
        If you need to undo a change or recover deleted content, contact your developer.
        They can:
      </p>
      <ul>
        <li>View the complete history of all changes made through the CMS</li>
        <li>Revert specific changes while keeping other recent edits</li>
        <li>Restore deleted content from any point in time</li>
        <li>Compare different versions to see exactly what changed</li>
        <li>Fix any issues caused by accidental edits</li>
      </ul>

      <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4 my-4">
        <h3 className="text-base font-semibold text-amber-300 mb-2">
          When to Contact Your Developer
        </h3>
        <p className="text-sm text-neutral-300 mb-2">
          Reach out if you:
        </p>
        <ul className="text-sm text-neutral-300 space-y-1 ml-4">
          <li>Accidentally published content with significant errors</li>
          <li>Deleted a file or section you actually needed</li>
          <li>Made changes that broke the site's functionality or layout</li>
          <li>Need to compare different versions of content</li>
          <li>Want to recover content from weeks or months ago</li>
        </ul>
      </div>

      <h2>What Information to Provide</h2>
      <p>
        When contacting your developer for rollback assistance, provide:
      </p>
      <ul>
        <li><strong>What you were trying to do</strong>: "I was editing Day 15 of the sprint"</li>
        <li><strong>What went wrong</strong>: "I accidentally deleted the entire lesson content"</li>
        <li><strong>Approximate time</strong>: "Around 2:30pm today" or "Earlier this week"</li>
        <li><strong>What needs to be restored</strong>: "I need the previous version of Day 15 back"</li>
      </ul>

      <h2>Common Recovery Scenarios</h2>

      <h3>Scenario 1: Typo in Published Content</h3>
      <p>
        <strong>Problem:</strong> You published a sprint day with a typo
      </p>
      <p className="text-sm text-neutral-400">
        <strong>Solution:</strong> Simply go back into the CMS, edit the content,
        fix the typo, and save. No rollback needed—just overwrite with the correction.
      </p>

      <h3>Scenario 2: Accidentally Deleted Content</h3>
      <p>
        <strong>Problem:</strong> You deleted a blog post or sprint day by mistake
      </p>
      <p className="text-sm text-neutral-400">
        <strong>Solution:</strong> Contact your developer. They can restore the deleted
        content from the version history within minutes.
      </p>

      <h3>Scenario 3: Published Incomplete Content</h3>
      <p>
        <strong>Problem:</strong> You saved a half-finished sprint day as published
      </p>
      <p className="text-sm text-neutral-400">
        <strong>Solution:</strong> Quick fix: Edit the day in the CMS and set "Published"
        to false. Then take your time finishing the content before republishing.
      </p>

      <h3>Scenario 4: Need Previous Version for Reference</h3>
      <p>
        <strong>Problem:</strong> You changed content but want to see what it said before
      </p>
      <p className="text-sm text-neutral-400">
        <strong>Solution:</strong> Contact your developer. They can show you previous
        versions without affecting the current content, so you can copy what you need.
      </p>

      <h2>The Bottom Line</h2>
      <p>
        Don't be afraid to experiment and make changes through the CMS. You have a
        complete safety net:
      </p>
      <ul>
        <li>Every change is tracked and reversible</li>
        <li>Nothing is permanently deleted</li>
        <li>Your developer can recover anything if needed</li>
        <li>The version history goes back to day one</li>
      </ul>

      <p>
        Use draft status when working on content, preview before publishing, and make
        changes confidently knowing you can always get help if something goes wrong.
      </p>

      <h2>Next Steps</h2>
      <ul>
        <li>
          <Link
            href="https://github.com/rickhallett/becoming-diamond-nextjs/commits/main"
            className="text-primary hover:underline"
            target="_blank"
          >
            View your site's change history on GitHub →
          </Link>
        </li>
        <li>
          <Link href="/docs-site/admin/cms-overview" className="text-primary hover:underline">
            Back to CMS Overview
          </Link>
        </li>
        <li>
          <Link href="/docs-site/admin/sprint-management" className="text-primary hover:underline">
            Sprint Content Management
          </Link>
        </li>
        <li>
          <Link href="/docs-site/admin/blog-management" className="text-primary hover:underline">
            Blog Management
          </Link>
        </li>
      </ul>
    </DocsPage>
  );
}
