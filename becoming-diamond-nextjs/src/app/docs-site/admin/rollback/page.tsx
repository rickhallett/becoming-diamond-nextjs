/* eslint-disable react/no-unescaped-entities */
import { DocsPage } from "@/components/docs/docs-page";
import Link from "next/link";

export default function RollbackProceduresPage() {
  return (
    <DocsPage
      title="Rollback Procedures"
      description="Recover from mistakes and revert content changes"
    >
      <h2>Overview</h2>
      <p>
        One of the major benefits of using Decap CMS with a Git backend is that every
        change is tracked and reversible. If you accidentally publish incorrect content,
        delete something by mistake, or simply want to undo recent changes, you can
        easily roll back to a previous version.
      </p>

      <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 my-4">
        <p className="text-sm text-neutral-300">
          <strong>Safety net:</strong> All CMS edits create Git commits. Nothing is
          ever truly lost—you can always recover previous versions through GitHub's
          version history.
        </p>
      </div>

      <h2>How Changes Are Tracked</h2>
      <p>
        Every time you save a change in the CMS:
      </p>
      <ol>
        <li>Decap CMS creates a Git commit with your changes</li>
        <li>The commit is pushed to your GitHub repository</li>
        <li>The commit message describes what was changed (e.g., "Update sprint/day-05.md")</li>
        <li>GitHub stores a complete history of all versions</li>
        <li>Vercel automatically rebuilds and deploys the site</li>
      </ol>

      <h2>When to Use Rollback</h2>
      <p>
        Consider rolling back when:
      </p>
      <ul>
        <li>You accidentally published content with errors or typos</li>
        <li>You deleted a file or section you actually needed</li>
        <li>Changes broke the site's functionality or layout</li>
        <li>You want to compare different versions of content</li>
        <li>You need to recover content from weeks or months ago</li>
      </ul>

      <h2>Method 1: GitHub Web Interface (Recommended for Most Users)</h2>
      <p>
        The easiest way to rollback changes is through GitHub's web interface.
        No command-line knowledge required.
      </p>

      <h3>Step 1: Access Commit History</h3>
      <ol>
        <li>
          Go to{" "}
          <Link
            href="https://github.com/rickhallett/becoming-diamond-nextjs"
            className="text-primary hover:underline"
            target="_blank"
          >
            your repository on GitHub
          </Link>
        </li>
        <li>Click the "Commits" link (should show a number like "156 commits")</li>
        <li>You'll see a chronological list of all changes made to the repository</li>
      </ol>

      <h3>Step 2: Find the Problem Commit</h3>
      <ol>
        <li>Look for commits from Decap CMS (usually labeled with file names like "Update blog/post.md")</li>
        <li>Click on the commit to see what was changed</li>
        <li>Red lines show deletions, green lines show additions</li>
        <li>Identify the commit that introduced the problem</li>
      </ol>

      <h3>Step 3: Revert the Commit</h3>
      <ol>
        <li>On the commit page, click the "..." menu in the top-right corner</li>
        <li>Select "Revert commit"</li>
        <li>GitHub will create a new commit that undoes the problematic changes</li>
        <li>Click "Commit changes" to confirm</li>
        <li>Wait 2-3 minutes for Vercel to rebuild and deploy</li>
      </ol>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 my-4">
        <p className="text-sm text-neutral-400">
          <strong>Note:</strong> Reverting creates a <em>new</em> commit that undoes
          the changes. It doesn't delete the original commit. This maintains a complete
          audit trail of all changes.
        </p>
      </div>

      <h2>Method 2: Restore Specific File Versions</h2>
      <p>
        If you need to restore just one file to a previous version without reverting
        an entire commit:
      </p>

      <h3>Step 1: Navigate to the File</h3>
      <ol>
        <li>Go to your repository on GitHub</li>
        <li>Browse to the file you want to restore (e.g., content/sprint/day-10.md)</li>
        <li>Click "History" in the top-right corner of the file view</li>
      </ol>

      <h3>Step 2: Find the Correct Version</h3>
      <ol>
        <li>Review the commit history for that specific file</li>
        <li>Click on a commit to see what the file looked like at that point</li>
        <li>When you find the version you want, click "Raw" to view the raw file content</li>
      </ol>

      <h3>Step 3: Copy and Re-Save</h3>
      <ol>
        <li>Copy the entire content from the raw view</li>
        <li>Go back to the CMS and open the current version of the file</li>
        <li>Replace the content with the copied version</li>
        <li>Click "Save" to create a new commit with the restored content</li>
      </ol>

      <h2>Method 3: Command Line (For Developers)</h2>
      <p>
        If you're comfortable with Git and have the repository cloned locally:
      </p>

      <h3>Revert a Specific Commit</h3>
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 my-4">
        <code className="text-sm text-neutral-300 block">
          git revert &lt;commit-hash&gt;<br />
          git push origin main
        </code>
      </div>

      <h3>Restore a File to Previous Version</h3>
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 my-4">
        <code className="text-sm text-neutral-300 block">
          git checkout &lt;commit-hash&gt; -- path/to/file.md<br />
          git commit -m "Restore file to previous version"<br />
          git push origin main
        </code>
      </div>

      <h3>Reset to Previous State (Use with Caution)</h3>
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 my-4">
        <code className="text-sm text-neutral-300 block">
          git reset --hard &lt;commit-hash&gt;<br />
          git push origin main --force
        </code>
      </div>

      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 my-4">
        <p className="text-sm text-red-300">
          <strong>Warning:</strong> The <code className="px-2 py-1 bg-neutral-900 rounded text-xs">
            git reset --hard
          </code> command permanently deletes commits from history. Only use this if
          you're absolutely certain you want to erase recent changes. For most situations,
          <code className="px-2 py-1 bg-neutral-900 rounded text-xs">git revert</code> is safer.
        </p>
      </div>

      <h2>Preventing Accidents</h2>
      <p>
        Best practices to minimize the need for rollbacks:
      </p>

      <h3>Use Localhost for Testing</h3>
      <p>
        When editing locally (not on the live domain), changes go to the{" "}
        <code className="px-2 py-1 bg-neutral-900 rounded text-sm">cms-staging</code>{" "}
        branch instead of{" "}
        <code className="px-2 py-1 bg-neutral-900 rounded text-sm">main</code>. This
        lets you test changes before they affect production.
      </p>

      <h3>Use Draft Status</h3>
      <p>
        For blog posts and sprint days, set "Published" to false while you work. This
        saves your changes without making them visible on the live site.
      </p>

      <h3>Preview Before Publishing</h3>
      <p>
        Always use the CMS preview feature to see how your content will look before
        clicking "Save" on production.
      </p>

      <h3>Make Small, Incremental Changes</h3>
      <p>
        Instead of editing 10 files at once, edit and save one file at a time. This
        makes it easier to identify and revert problematic changes.
      </p>

      <h3>Write Clear Commit Messages</h3>
      <p>
        When the CMS asks for a commit message (or auto-generates one), make sure it
        clearly describes what you changed. Future you will thank past you.
      </p>

      <h2>Emergency Contact</h2>
      <p>
        If you encounter a situation where:
      </p>
      <ul>
        <li>The site is completely broken</li>
        <li>You can't access the CMS</li>
        <li>Rollback procedures aren't working</li>
        <li>You need urgent help</li>
      </ul>
      <p>
        Contact your developer or technical support immediately. Provide:
      </p>
      <ul>
        <li>What you were trying to do</li>
        <li>What went wrong</li>
        <li>Approximate time the error occurred</li>
        <li>Screenshots of any error messages</li>
      </ul>

      <h2>Common Rollback Scenarios</h2>

      <h3>Scenario 1: Typo in Sprint Day Title</h3>
      <p>
        <strong>Problem:</strong> You published Day 15 with "Mastter" instead of "Master"
      </p>
      <p>
        <strong>Solution:</strong> Simply go back into the CMS, edit the sprint day,
        fix the typo, and save. No rollback needed—just overwrite with the correction.
      </p>

      <h3>Scenario 2: Accidentally Deleted Blog Post</h3>
      <p>
        <strong>Problem:</strong> You deleted a blog post but actually needed it
      </p>
      <p>
        <strong>Solution:</strong> Use Method 1 (GitHub Web Interface) to find the
        commit that deleted the file, then revert that commit. The blog post will be
        restored.
      </p>

      <h3>Scenario 3: Published Incomplete Content</h3>
      <p>
        <strong>Problem:</strong> You saved a half-finished sprint day as published
      </p>
      <p>
        <strong>Solution:</strong> Quick fix: Edit the day in the CMS and set "Published"
        to false. Then take your time finishing the content before republishing.
      </p>

      <h3>Scenario 4: Changed Multiple Files, Want to Undo All</h3>
      <p>
        <strong>Problem:</strong> You made changes to 5 different sprint days but want
        to undo all of them
      </p>
      <p>
        <strong>Solution:</strong> Use Method 1 to revert each commit individually, or
        use Method 3 (Command Line) to reset to before you started making changes
        (ask your developer for help with this).
      </p>

      <h2>Verifying the Rollback Worked</h2>
      <p>
        After performing a rollback:
      </p>
      <ol>
        <li>Wait 2-3 minutes for Vercel to rebuild and deploy</li>
        <li>Clear your browser cache (or use incognito mode)</li>
        <li>Visit the affected page on the live site</li>
        <li>Verify the content is correct</li>
        <li>Check the GitHub commit history to confirm the revert commit appears</li>
      </ol>

      <h2>Next Steps</h2>
      <ul>
        <li>
          <Link
            href="https://github.com/rickhallett/becoming-diamond-nextjs/commits/main"
            className="text-primary hover:underline"
            target="_blank"
          >
            View your repository's commit history →
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
