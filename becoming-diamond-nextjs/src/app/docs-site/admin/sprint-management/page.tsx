/* eslint-disable react/no-unescaped-entities */
import { DocsPage } from "@/components/docs/docs-page";
import { FutureEnhancement } from "@/components/docs/future-enhancement";
import Link from "next/link";

export default function SprintManagementPage() {
  return (
    <DocsPage
      title="Managing Sprint Content"
      description="Edit and publish 30-day sprint lessons via Decap CMS"
    >
      <h2>Overview</h2>
      <p>
        The 30 Day Sprint is managed through Decap CMS, allowing you to edit lesson
        content, update videos, adjust difficulty levels, and modify text directly
        through a user-friendly interface without touching code.
      </p>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 my-4">
        <p className="text-sm text-neutral-400">
          <strong>Access CMS:</strong>{" "}
          <Link href="/admin" className="text-primary hover:underline" target="_blank">
            Open /admin →
          </Link>
        </p>
      </div>

      <h2>Accessing Sprint Content</h2>
      <ol>
        <li>Navigate to <code className="px-2 py-1 bg-neutral-900 rounded text-sm">/admin</code> in your browser</li>
        <li>Click "Login with GitHub" and authorize the application</li>
        <li>From the CMS dashboard, click "30 Day Sprint" in the left sidebar</li>
        <li>You'll see a list of all 30 sprint days</li>
      </ol>

      <h2>Sprint Content Structure</h2>
      <p>
        Each sprint day contains the following fields:
      </p>

      <h3>Day Number</h3>
      <p>
        The day number (1-30) is selected from a dropdown. This determines the day's
        position in the program and generates the URL slug (e.g., day-01, day-15, day-30).
      </p>

      <h3>Title</h3>
      <p>
        The main heading for the day. Keep it concise and action-oriented. Examples:
        "Set Your Baseline", "Master Your Morning", "Lead Through Pressure".
      </p>

      <h3>Subtitle</h3>
      <p>
        A supporting tagline that appears below the title. This should be engaging and
        provide context about what the user will learn.
      </p>

      <h3>Published</h3>
      <p>
        Toggle to control visibility. If unchecked, the day won't appear in the program
        (useful for drafting content before it's ready).
      </p>

      <h3>Duration</h3>
      <p>
        Estimated time to complete the lesson (e.g., "15 minutes", "20 minutes"). This
        helps users plan their time.
      </p>

      <h3>Difficulty</h3>
      <p>
        Select from Beginner, Intermediate, or Advanced. Most days should be Beginner
        or Intermediate to maintain accessibility.
      </p>

      <h3>Video ID</h3>
      <p>
        The unique identifier for the video associated with this day. This is obtained
        from your video hosting platform (Bunny Stream).
      </p>

      <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 my-4">
        <p className="text-sm text-neutral-300">
          <strong>Video ID Format:</strong> Video IDs are UUIDs like{" "}
          <code className="px-2 py-1 bg-neutral-900 rounded text-xs">
            4a151e6b-7911-41b9-b1ef-c6fa00bafaa5
          </code>
          . Copy this from your video platform's dashboard after uploading.
        </p>
      </div>

      <h3>Body (Markdown Content)</h3>
      <p>
        The main lesson content written in Markdown format. This is where you include:
      </p>
      <ul>
        <li><strong>Introduction</strong>: Context for the day's lesson</li>
        <li><strong>Video embed</strong>: Use the syntax <code className="px-2 py-1 bg-neutral-900 rounded text-sm">{"{{video:VIDEO_ID}}"}</code></li>
        <li><strong>Key teachings</strong>: Core concepts and insights</li>
        <li><strong>Action items</strong>: Specific steps the user should take</li>
        <li><strong>Reflections</strong>: Questions or prompts for journaling</li>
      </ul>

      <h2>Editing a Sprint Day</h2>

      <h3>Step 1: Select the Day</h3>
      <ol>
        <li>In the CMS, click "30 Day Sprint" from the sidebar</li>
        <li>Find and click the day you want to edit (e.g., "Day 01 - Set Your Baseline")</li>
      </ol>

      <h3>Step 2: Make Your Changes</h3>
      <ol>
        <li>Edit any fields as needed</li>
        <li>For the body content, use the rich text editor or switch to Markdown mode</li>
        <li>Preview your changes using the preview panel (if available)</li>
      </ol>

      <h3>Step 3: Save and Publish</h3>
      <ol>
        <li>Click "Save" in the top-right corner</li>
        <li>The CMS will commit your changes to GitHub</li>
        <li>Changes are automatically deployed to the live site within 2-3 minutes</li>
        <li>Use the "Published" toggle to save drafts without making them visible to users</li>
      </ol>

      <h2>Markdown Formatting Guide</h2>

      <h3>Headings</h3>
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 my-4">
        <code className="text-sm text-neutral-300 block">
          # Main Heading<br />
          ## Section Heading<br />
          ### Subsection
        </code>
      </div>

      <h3>Text Formatting</h3>
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 my-4">
        <code className="text-sm text-neutral-300 block">
          **bold text**<br />
          *italic text*<br />
          `code or technical terms`
        </code>
      </div>

      <h3>Lists</h3>
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 my-4">
        <code className="text-sm text-neutral-300 block">
          - Bullet point<br />
          - Another point<br />
          <br />
          1. Numbered item<br />
          2. Another item
        </code>
      </div>

      <h3>Video Embedding</h3>
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 my-4">
        <code className="text-sm text-neutral-300 block">
          {"{{video:4a151e6b-7911-41b9-b1ef-c6fa00bafaa5}}"}
        </code>
      </div>
      <p className="text-sm text-neutral-400 mt-2">
        Replace the UUID with your actual video ID from Bunny Stream.
      </p>

      <h2>Creating a New Sprint Day</h2>
      <ol>
        <li>In the CMS, click "30 Day Sprint" from the sidebar</li>
        <li>Click the "New 30 Day Sprint" button</li>
        <li>Select the day number from the dropdown</li>
        <li>Fill in all required fields (title, subtitle, duration, difficulty)</li>
        <li>Add your video ID if available</li>
        <li>Write the lesson content in Markdown</li>
        <li>Set "Published" to true when ready to make it live</li>
        <li>Click "Save" to publish</li>
      </ol>

      <FutureEnhancement>
        <p>
          <strong>Planned improvements:</strong> Video upload directly through the CMS
          interface would eliminate the need to manually copy video IDs. We're also
          exploring AI-assisted content suggestions and automated formatting checks
          to help maintain consistency across all 30 days.
        </p>
      </FutureEnhancement>

      <h2>Best Practices</h2>
      <ul>
        <li><strong>Consistency</strong>: Keep similar structure across all days for familiarity</li>
        <li><strong>Brevity</strong>: Users have 15-20 minutes per day; keep content focused</li>
        <li><strong>Action-oriented</strong>: Always include specific steps the user can take</li>
        <li><strong>Progressive difficulty</strong>: Earlier days should be Beginner, later days can be Advanced</li>
        <li><strong>Use draft status</strong>: Set "Published" to false while working to avoid publishing incomplete content</li>
        <li><strong>Version control</strong>: All changes are tracked in Git; you can always roll back with developer assistance (see Rollback Procedures)</li>
      </ul>

      <h2>Common Issues</h2>

      <h3>Video Not Displaying</h3>
      <p>
        If the video doesn't show on the sprint page:
      </p>
      <ul>
        <li>Verify the Video ID is correct (no extra spaces or characters)</li>
        <li>Check that the video exists in your Bunny Stream library</li>
        <li>Ensure the video is published and not in draft status</li>
        <li>Confirm the embed syntax is correct: <code className="px-2 py-1 bg-neutral-900 rounded text-sm">{"{{video:ID}}"}</code></li>
      </ul>

      <h3>Changes Not Showing</h3>
      <p>
        If your changes aren't appearing on the live site:
      </p>
      <ul>
        <li>Check that you clicked "Save" (not just "Preview")</li>
        <li>Wait 2-3 minutes for the site to rebuild and deploy</li>
        <li>Clear your browser cache or try incognito mode</li>
        <li>Verify the "Published" toggle is set to true</li>
      </ul>

      <h3>Markdown Not Rendering</h3>
      <p>
        If Markdown formatting isn't working correctly:
      </p>
      <ul>
        <li>Ensure there's a blank line before and after headings</li>
        <li>Check for extra spaces or tabs that might break syntax</li>
        <li>Switch between Rich Text and Markdown modes to troubleshoot</li>
      </ul>

      <h2>Next Steps</h2>
      <ul>
        <li>
          <Link href="/admin" className="text-primary hover:underline" target="_blank">
            Open the CMS and explore sprint content →
          </Link>
        </li>
        <li>
          <Link href="/docs-site/admin/blog-management" className="text-primary hover:underline">
            Learn about Blog Management
          </Link>
        </li>
        <li>
          <Link href="/docs-site/admin/rollback" className="text-primary hover:underline">
            Review Rollback Procedures
          </Link>
        </li>
      </ul>
    </DocsPage>
  );
}
