/* eslint-disable react/no-unescaped-entities */
import { DocsPage } from "@/components/docs/docs-page";
import { FutureEnhancement } from "@/components/docs/future-enhancement";
import Link from "next/link";

export default function BlogManagementPage() {
  return (
    <DocsPage
      title="Blog Management"
      description="Create and publish blog posts via Decap CMS"
    >
      <h2>Overview</h2>
      <p>
        Blog posts (displayed as "Insights" on the website) are managed through Decap CMS.
        You can create, edit, and publish articles with full control over content,
        categories, tags, and featured images—all without touching code.
      </p>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 my-4">
        <p className="text-sm text-neutral-400">
          <strong>View Published Posts:</strong>{" "}
          <Link href="/blog" className="text-primary hover:underline" target="_blank">
            Open Insights page →
          </Link>
        </p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 my-4">
        <p className="text-sm text-neutral-400">
          <strong>Access CMS:</strong>{" "}
          <Link href="/admin" className="text-primary hover:underline" target="_blank">
            Open /admin →
          </Link>
        </p>
      </div>

      <h2>Accessing Blog Content</h2>
      <ol>
        <li>Navigate to <code className="px-2 py-1 bg-neutral-900 rounded text-sm">/admin</code> in your browser</li>
        <li>Click "Login with GitHub" and authorize the application</li>
        <li>From the CMS dashboard, click "Blog Posts" in the left sidebar</li>
        <li>You'll see a list of all published and draft blog posts</li>
      </ol>

      <h2>Blog Post Structure</h2>
      <p>
        Each blog post contains the following fields:
      </p>

      <h3>Title</h3>
      <p>
        The main headline for your blog post. Should be compelling and SEO-friendly.
        Keep it under 60 characters for optimal display.
      </p>
      <p className="text-sm text-neutral-400">
        Example: "Mastering Pressure: The Diamond Operating System"
      </p>

      <h3>Author</h3>
      <p>
        The name of the article's author. This appears in the byline and helps build
        authority and connection with readers.
      </p>
      <p className="text-sm text-neutral-400">
        Example: "Michael T Dugan"
      </p>

      <h3>Date</h3>
      <p>
        Publication date for the article. This is displayed on the blog listing and
        individual post pages. Posts are automatically sorted by date (newest first).
      </p>

      <h3>Featured Image (Thumbnail)</h3>
      <p>
        The main image that appears at the top of the post and in the blog listing.
        You can:
      </p>
      <ul>
        <li><strong>Upload from your computer</strong>: Use the "Upload" button to add images</li>
        <li><strong>Use an external URL</strong>: Paste a link from Unsplash, your hosting, etc.</li>
      </ul>

      <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 my-4">
        <p className="text-sm text-neutral-300">
          <strong>Image recommendations:</strong> Use images that are at least 1200x630px
          for best quality. Landscape orientation works best. Free sources include
          Unsplash, Pexels, or your own photography.
        </p>
      </div>

      <h3>Excerpt</h3>
      <p>
        A short summary (1-2 sentences) that appears on the blog listing page.
        This is your "hook" to entice readers to click and read more.
      </p>
      <p className="text-sm text-neutral-400">
        Example: "Discover how to transform pressure into power using the Diamond
        Operating System. Learn the neuroscience-backed techniques that help you stay
        calm under pressure."
      </p>

      <h3>Categories</h3>
      <p>
        Broad topics that classify your post. Categories help readers find related
        content and appear as filters on the blog listing page.
      </p>
      <p className="text-sm text-neutral-400">
        Examples: "Personal Development", "Mindfulness", "Leadership", "AI & Technology"
      </p>
      <p className="text-xs text-neutral-500 mt-2">
        To add multiple categories, type each one and press Enter.
      </p>

      <h3>Tags</h3>
      <p>
        Specific keywords related to your post. Tags are more granular than categories
        and help with SEO and content discovery.
      </p>
      <p className="text-sm text-neutral-400">
        Examples: "nervous system", "resilience", "pressure", "transformation"
      </p>
      <p className="text-xs text-neutral-500 mt-2">
        Use 3-6 relevant tags per post. Type each tag and press Enter.
      </p>

      <h3>Published</h3>
      <p>
        Toggle to control visibility. When checked, the post appears on the live site.
        When unchecked, it's saved as a draft (useful for work-in-progress articles).
      </p>

      <h3>Body (Markdown Content)</h3>
      <p>
        The main article content written in Markdown format. This is where you write
        your full article, including:
      </p>
      <ul>
        <li><strong>Introduction</strong>: Hook the reader and set context</li>
        <li><strong>Main sections</strong>: Break content into digestible headings</li>
        <li><strong>Key insights</strong>: Core teachings and takeaways</li>
        <li><strong>Call to action</strong>: What should readers do next?</li>
      </ul>

      <h2>Creating a New Blog Post</h2>

      <h3>Step 1: Start a New Post</h3>
      <ol>
        <li>In the CMS, click "Blog Posts" from the sidebar</li>
        <li>Click the "New Blog Posts" button</li>
        <li>You'll see an empty form with all the fields listed above</li>
      </ol>

      <h3>Step 2: Fill in Post Details</h3>
      <ol>
        <li><strong>Title</strong>: Write a compelling headline</li>
        <li><strong>Author</strong>: Enter the author's name</li>
        <li><strong>Date</strong>: Select publication date (defaults to today)</li>
        <li><strong>Featured Image</strong>: Upload or link to an image</li>
        <li><strong>Excerpt</strong>: Write 1-2 sentence summary</li>
        <li><strong>Categories</strong>: Add 1-3 broad categories</li>
        <li><strong>Tags</strong>: Add 3-6 specific keywords</li>
      </ol>

      <h3>Step 3: Write Your Article</h3>
      <p>
        In the Body field, write your article using Markdown syntax. You can:
      </p>
      <ul>
        <li>Switch between "Rich Text" and "Markdown" modes using the toolbar</li>
        <li>Use the formatting buttons for headings, lists, bold, italic, etc.</li>
        <li>Preview how your content will look on the live site</li>
      </ul>

      <h3>Step 4: Save and Publish</h3>
      <ol>
        <li>Set "Published" to <strong>false</strong> if you want to save as draft</li>
        <li>Set "Published" to <strong>true</strong> when ready to go live</li>
        <li>Click "Save" in the top-right corner</li>
        <li>The CMS commits your changes to GitHub</li>
        <li>
          In <strong>production</strong>, the post goes live immediately after deployment (2-3 minutes)
        </li>
        <li>
          In <strong>development</strong> (localhost), changes save to the{" "}
          <code className="px-2 py-1 bg-neutral-900 rounded text-sm">cms-staging</code> branch for testing
        </li>
      </ol>

      <h2>Editing an Existing Post</h2>
      <ol>
        <li>In the CMS, click "Blog Posts" from the sidebar</li>
        <li>Find and click the post you want to edit</li>
        <li>Make your changes to any field</li>
        <li>Click "Save" to publish the updates</li>
      </ol>

      <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 my-4">
        <p className="text-sm text-neutral-300">
          <strong>Note:</strong> All changes are tracked in Git. If you make a mistake,
          you can always roll back to a previous version (see Rollback Procedures).
        </p>
      </div>

      <h2>Markdown Formatting Guide</h2>

      <h3>Headings</h3>
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 my-4">
        <code className="text-sm text-neutral-300 block">
          # Main Heading (Title - auto-generated)<br />
          ## Section Heading<br />
          ### Subsection
        </code>
      </div>

      <h3>Text Formatting</h3>
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 my-4">
        <code className="text-sm text-neutral-300 block">
          **bold text** for emphasis<br />
          *italic text* for subtle emphasis<br />
          `code or technical terms`
        </code>
      </div>

      <h3>Lists</h3>
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 my-4">
        <code className="text-sm text-neutral-300 block">
          - Bullet point<br />
          - Another point<br />
          &nbsp;&nbsp;- Nested point<br />
          <br />
          1. Numbered item<br />
          2. Another item
        </code>
      </div>

      <h3>Links</h3>
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 my-4">
        <code className="text-sm text-neutral-300 block">
          [Link text](https://example.com)
        </code>
      </div>

      <h3>Quotes</h3>
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 my-4">
        <code className="text-sm text-neutral-300 block">
          &gt; This is a blockquote<br />
          &gt; It can span multiple lines
        </code>
      </div>

      <h2>Blog Writing Best Practices</h2>
      <ul>
        <li><strong>Compelling headlines</strong>: Make readers want to click</li>
        <li><strong>Strong opening</strong>: Hook readers in the first paragraph</li>
        <li><strong>Clear structure</strong>: Use headings to break up content</li>
        <li><strong>Scannable content</strong>: Use lists, short paragraphs, bold text</li>
        <li><strong>Actionable takeaways</strong>: Give readers something they can do</li>
        <li><strong>Consistent voice</strong>: Match the tone of existing posts</li>
        <li><strong>SEO optimization</strong>: Use keywords naturally in title, excerpt, and body</li>
        <li><strong>Proofread</strong>: Check spelling, grammar, and formatting before publishing</li>
      </ul>

      <h2>SEO Optimization Tips</h2>
      <ul>
        <li><strong>Title</strong>: Include primary keyword, keep under 60 characters</li>
        <li><strong>Excerpt</strong>: Use compelling language that includes keywords</li>
        <li><strong>Categories</strong>: Choose categories that readers actually search for</li>
        <li><strong>Tags</strong>: Use specific keywords readers might search</li>
        <li><strong>Headings</strong>: Use H2 and H3 tags to structure content logically</li>
        <li><strong>Internal links</strong>: Link to other blog posts or pages on your site</li>
        <li><strong>Alt text</strong>: Describe images (though Markdown doesn't always support this)</li>
      </ul>

      <FutureEnhancement>
        <p>
          <strong>Planned features:</strong> Scheduled publishing would allow you to write
          posts in advance and have them automatically go live at a specific date and time.
          We're also exploring AI-assisted content suggestions, SEO scoring, and
          readability analysis to help you write better blog posts faster.
        </p>
      </FutureEnhancement>

      <h2>Common Issues</h2>

      <h3>Image Not Displaying</h3>
      <p>
        If your featured image doesn't show:
      </p>
      <ul>
        <li>Verify the URL is correct and publicly accessible</li>
        <li>Check that the image URL starts with https:// (not http://)</li>
        <li>Try opening the image URL in a new tab to confirm it loads</li>
        <li>If uploading, ensure the file size is under 5MB</li>
      </ul>

      <h3>Post Not Appearing on Blog Page</h3>
      <p>
        If your post isn't showing on the live site:
      </p>
      <ul>
        <li>Check that "Published" is set to <strong>true</strong></li>
        <li>Verify the date isn't set in the future</li>
        <li>Wait 2-3 minutes for Vercel to rebuild and deploy</li>
        <li>Clear your browser cache or try incognito mode</li>
      </ul>

      <h3>Categories/Tags Not Working</h3>
      <p>
        If categories or tags aren't filtering correctly:
      </p>
      <ul>
        <li>Ensure you pressed Enter after typing each category/tag</li>
        <li>Check for typos or inconsistent capitalization</li>
        <li>Use the exact same spelling across all posts for consistency</li>
      </ul>

      <h2>Next Steps</h2>
      <ul>
        <li>
          <Link href="/admin" className="text-primary hover:underline" target="_blank">
            Open the CMS and create your first blog post →
          </Link>
        </li>
        <li>
          <Link href="/blog" className="text-primary hover:underline" target="_blank">
            View published Insights →
          </Link>
        </li>
        <li>
          <Link href="/docs-site/admin/sprint-management" className="text-primary hover:underline">
            Learn about Sprint Management
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
