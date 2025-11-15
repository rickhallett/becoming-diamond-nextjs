import { DocsPage } from "@/components/docs/docs-page";
import Link from "next/link";

export default function LeadManagementPage() {
  return (
    <DocsPage
      title="Email Lead Management"
      description="How to access, export, and utilize captured email leads"
    >
      <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 my-6">
        <p className="text-sm text-neutral-300">
          <strong>Marketing Asset:</strong> Email leads captured through the platform represent
          individuals interested in your content and transformation journey. This guide explains
          how to access, manage, and utilize this valuable marketing data.
        </p>
      </div>

      <h2>Overview</h2>
      <p>
        The Becoming Diamond platform captures email leads from visitors who sign up for
        information about the program. All captured leads are stored securely in the database
        and can be accessed, searched, and exported through the admin lead management interface.
      </p>

      <h3>Where Leads Come From</h3>
      <p>
        Leads are captured when visitors:
      </p>
      <ul>
        <li>Fill out email signup forms on landing pages</li>
        <li>Express interest in the 30-Day Sprint program</li>
        <li>Subscribe to updates or newsletters</li>
        <li>Request more information about the platform</li>
      </ul>

      <h2>Accessing the Lead Management Interface</h2>

      <h3>How to Access Leads</h3>
      <ol>
        <li>Log in to the platform with your admin account (support@becomingdiamond.com)</li>
        <li>Navigate to the admin leads page:
          <ul>
            <li>Direct URL: <Link href="/app/admin/leads" className="text-primary hover:underline">/app/admin/leads</Link></li>
            <li>Or access through the member portal admin menu</li>
          </ul>
        </li>
        <li>You'll see the Lead Management dashboard with all captured leads</li>
      </ol>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 my-4">
        <p className="text-sm text-neutral-400">
          <strong>Admin Access Only:</strong> The lead management interface is only accessible
          to the platform owner account (support@becomingdiamond.com). Other users will not
          see this option in their dashboard.
        </p>
      </div>

      <h3>Dashboard Features</h3>
      <p>
        The lead management dashboard provides:
      </p>
      <ul>
        <li><strong>Lead Table</strong>: All captured leads with key information</li>
        <li><strong>Search & Filter</strong>: Find specific leads by email address</li>
        <li><strong>Stats Summary</strong>: Total leads, current page, showing count</li>
        <li><strong>Pagination</strong>: Browse leads 50 at a time</li>
        <li><strong>CSV Export</strong>: Download all leads for use in marketing tools</li>
        <li><strong>Refresh</strong>: Update the list to see newly captured leads</li>
      </ul>

      <h2>Understanding Lead Data Fields</h2>

      <h3>Lead Information Captured</h3>
      <p>
        Each lead record contains the following information:
      </p>

      <h4>Email Address</h4>
      <p>
        The primary identifier—the email address the visitor provided. This is what you'll
        use to contact leads through email marketing campaigns.
      </p>

      <h4>Capture Date</h4>
      <p>
        The date and time when the lead was captured. This helps you:
      </p>
      <ul>
        <li>Track lead acquisition over time</li>
        <li>Identify peak signup periods</li>
        <li>Determine how "warm" a lead is (recent signups may be more engaged)</li>
        <li>Plan follow-up timing based on signup date</li>
      </ul>

      <h4>Lead Status</h4>
      <p>
        The current status of the lead in your pipeline:
      </p>
      <ul>
        <li><strong>new</strong>: Freshly captured, not yet contacted</li>
        <li><strong>contacted</strong>: You've reached out via email (manual status)</li>
        <li><strong>converted</strong>: Lead has taken desired action (purchase, signup, etc.)</li>
      </ul>

      <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4 my-6">
        <p className="text-sm text-neutral-300">
          <strong>Note:</strong> In the current version, lead status is set automatically when
          captured (always "new"). Future updates may allow you to manually update status as
          you progress leads through your marketing funnel.
        </p>
      </div>

      <h4>Email Delivery Status</h4>
      <p>
        Indicates whether an automated welcome email was successfully sent:
      </p>
      <ul>
        <li><strong>sent</strong>: Welcome email delivered successfully</li>
        <li><strong>failed</strong>: Email delivery failed (invalid address, server issue, etc.)</li>
        <li><strong>(blank)</strong>: No automated email configured or not yet sent</li>
      </ul>

      <p>
        If you see many "failed" statuses, it may indicate:
      </p>
      <ul>
        <li>Email service configuration issue</li>
        <li>Invalid or misspelled email addresses</li>
        <li>Email server problems</li>
      </ul>

      <h4>Traffic Source</h4>
      <p>
        Shows where the lead came from:
      </p>
      <ul>
        <li><strong>Landing Page</strong>: The specific page URL where they signed up</li>
        <li><strong>Referrer</strong>: The website or page that brought them to your site (if available)</li>
      </ul>

      <p>
        This information helps you understand:
      </p>
      <ul>
        <li>Which pages are most effective at capturing leads</li>
        <li>Where your traffic is coming from (social media, search engines, referrals)</li>
        <li>Which marketing channels are working best</li>
      </ul>

      <h4>Additional Data (Not Displayed)</h4>
      <p>
        Each lead also includes metadata stored in the database but not shown in the table:
      </p>
      <ul>
        <li><strong>Consent Given</strong>: Whether the lead explicitly consented to marketing emails (GDPR compliance)</li>
        <li><strong>No Liability Accepted</strong>: Whether the lead accepted terms and conditions</li>
        <li><strong>Unsubscribe Token</strong>: Unique code for one-click unsubscribe links</li>
      </ul>

      <h2>Searching and Filtering Leads</h2>

      <h3>Email Search</h3>
      <p>
        To find a specific lead:
      </p>
      <ol>
        <li>Use the search box at the top of the lead table</li>
        <li>Type any part of an email address (e.g., "gmail", "john@", "example.com")</li>
        <li>Results update automatically as you type</li>
        <li>Search is case-insensitive</li>
      </ol>

      <h3>Pagination</h3>
      <p>
        Leads are displayed 50 at a time:
      </p>
      <ul>
        <li>Use <strong>Previous</strong> and <strong>Next</strong> buttons to navigate pages</li>
        <li>Current page number shown in stats</li>
        <li>Most recent leads appear first (sorted by capture date, newest to oldest)</li>
      </ul>

      <h2>Exporting Leads to CSV</h2>

      <h3>How to Export</h3>
      <p>
        To download all leads as a spreadsheet:
      </p>
      <ol>
        <li>Click the <strong>"Export CSV"</strong> button (top right of page)</li>
        <li>Your browser will download a file named <code>leads-YYYY-MM-DD.csv</code></li>
        <li>Open the file in Excel, Google Sheets, or any spreadsheet application</li>
      </ol>

      <h3>CSV File Contents</h3>
      <p>
        The exported CSV file includes these columns:
      </p>
      <ul>
        <li><strong>email</strong>: Email address</li>
        <li><strong>created_at</strong>: Capture date and time</li>
        <li><strong>status</strong>: Lead status (new, contacted, converted)</li>
        <li><strong>referrer</strong>: Traffic source URL</li>
        <li><strong>landing_page</strong>: Signup page URL</li>
      </ul>

      <h3>Using Exported Data</h3>
      <p>
        Once exported, you can:
      </p>
      <ul>
        <li><strong>Import to Email Marketing Tools</strong>: Upload to Mailchimp, ConvertKit, etc.</li>
        <li><strong>Clean Data</strong>: Remove duplicates, fix formatting, filter by date</li>
        <li><strong>Segment Lists</strong>: Group leads by traffic source or signup date</li>
        <li><strong>Backup Records</strong>: Keep offline copies of your lead database</li>
        <li><strong>Analyze Trends</strong>: Create charts and reports on lead acquisition</li>
      </ul>

      <h2>What to Do With Leads</h2>

      <h3>Email Marketing Campaigns</h3>
      <p>
        The primary use for captured leads is email marketing. Consider:
      </p>

      <h4>Welcome Sequence</h4>
      <ul>
        <li>Import leads to your email marketing platform</li>
        <li>Create an automated welcome series (3-5 emails)</li>
        <li>Introduce the Becoming Diamond philosophy</li>
        <li>Provide value upfront (free content, tips, insights)</li>
        <li>Guide toward the 30-Day Sprint or book purchase</li>
      </ul>

      <h4>Newsletter/Insights Digest</h4>
      <ul>
        <li>Send regular updates with new blog posts</li>
        <li>Share transformation stories and testimonials</li>
        <li>Provide practical exercises and reflections</li>
        <li>Keep leads engaged with the platform</li>
      </ul>

      <h4>Product Launches</h4>
      <ul>
        <li>Announce new programs or courses</li>
        <li>Promote book sales with special offers</li>
        <li>Invite to exclusive events or webinars</li>
      </ul>

      <h3>Email Marketing Tool Integration</h3>

      <h4>Mailchimp Integration (Example)</h4>
      <ol>
        <li>Export leads to CSV from the platform</li>
        <li>Log in to Mailchimp (or create account)</li>
        <li>Go to Audience → Import contacts</li>
        <li>Upload the CSV file</li>
        <li>Map fields: email, signup date, status</li>
        <li>Add to a specific audience or segment</li>
        <li>Create automated campaigns</li>
      </ol>

      <h4>ConvertKit Integration (Example)</h4>
      <ol>
        <li>Export leads to CSV</li>
        <li>Log in to ConvertKit</li>
        <li>Go to Subscribers → Import</li>
        <li>Upload CSV file</li>
        <li>Tag subscribers (e.g., "Becoming Diamond Leads")</li>
        <li>Add to email sequences</li>
      </ol>

      <h4>Other Platforms</h4>
      <p>
        Most email marketing platforms support CSV import:
      </p>
      <ul>
        <li>ActiveCampaign</li>
        <li>Drip</li>
        <li>AWeber</li>
        <li>GetResponse</li>
        <li>Sendinblue</li>
      </ul>

      <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 my-4">
        <p className="text-sm text-neutral-300">
          <strong>Tip:</strong> When choosing an email marketing platform, look for one with
          automation capabilities (email sequences, triggered campaigns) and good deliverability
          rates to maximize engagement with your leads.
        </p>
      </div>

      <h3>Segmentation Strategies</h3>
      <p>
        Not all leads are the same. Consider segmenting by:
      </p>

      <h4>By Signup Date</h4>
      <ul>
        <li><strong>Recent leads (last 7 days)</strong>: Send immediate welcome sequence</li>
        <li><strong>Warm leads (1-4 weeks)</strong>: More aggressive product promotion</li>
        <li><strong>Cold leads (30+ days)</strong>: Re-engagement campaign</li>
      </ul>

      <h4>By Traffic Source</h4>
      <ul>
        <li><strong>Organic search</strong>: Already seeking transformation content</li>
        <li><strong>Social media</strong>: Engaged with your posts or ads</li>
        <li><strong>Referrals</strong>: Trust factor from existing network</li>
      </ul>

      <h4>By Behavior</h4>
      <ul>
        <li><strong>Signed up but never logged in</strong>: Activation campaign</li>
        <li><strong>Started 30-Day Sprint</strong>: Encouragement and support</li>
        <li><strong>Completed Sprint</strong>: Advanced content and upsells</li>
        <li><strong>Purchased book</strong>: Premium customer nurture sequence</li>
      </ul>

      <h2>Privacy, Consent, and Legal Compliance</h2>

      <h3>GDPR and Privacy Considerations</h3>
      <p>
        When marketing to leads, ensure compliance with privacy laws:
      </p>

      <h4>Consent</h4>
      <ul>
        <li>All leads captured through the platform have explicitly provided their email</li>
        <li>The signup form should clearly state they'll receive marketing emails</li>
        <li>Keep records of when and how consent was obtained</li>
      </ul>

      <h4>Unsubscribe Requirements</h4>
      <ul>
        <li>Every marketing email MUST include an unsubscribe link (required by law)</li>
        <li>Process unsubscribe requests immediately (within 10 business days max)</li>
        <li>Most email marketing platforms handle this automatically</li>
        <li>Honor unsubscribe requests permanently</li>
      </ul>

      <h4>Data Protection</h4>
      <ul>
        <li>Store lead data securely (already handled by the platform database)</li>
        <li>Don't share or sell email addresses to third parties</li>
        <li>Allow leads to request their data or deletion (GDPR "right to be forgotten")</li>
        <li>Export lead data periodically and back up securely</li>
      </ul>

      <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4 my-6">
        <p className="text-sm text-neutral-300">
          <strong>Legal Disclaimer:</strong> This guide provides general information about
          email marketing compliance. For specific legal advice about privacy laws in your
          jurisdiction, consult with a qualified attorney. Laws vary by country and region
          (GDPR in Europe, CAN-SPAM in US, CASL in Canada, etc.).
        </p>
      </div>

      <h3>Handling Unsubscribe Requests</h3>
      <p>
        If a lead requests to unsubscribe:
      </p>

      <h4>Via Email Marketing Platform</h4>
      <ul>
        <li>Most platforms handle unsubscribes automatically</li>
        <li>Lead clicks unsubscribe link → platform removes them from list</li>
        <li>No manual action needed from you</li>
      </ul>

      <h4>Manual Unsubscribe Requests</h4>
      <p>
        If someone emails you directly asking to unsubscribe:
      </p>
      <ol>
        <li>Remove them from your email marketing platform immediately</li>
        <li>Make a note in your records (spreadsheet or CRM)</li>
        <li>Confirm the unsubscribe via reply email</li>
        <li>Do NOT add them to future campaigns or re-imports</li>
      </ol>

      <h4>Platform-Level Unsubscribe</h4>
      <p>
        The lead database includes unsubscribe tokens for potential future features:
      </p>
      <ul>
        <li>One-click unsubscribe links could be implemented</li>
        <li>Contact your developer if you want to add this functionality</li>
        <li>Would allow leads to opt out directly through the platform</li>
      </ul>

      <h2>Lead Management Best Practices</h2>

      <h3>Regular Export Schedule</h3>
      <ul>
        <li><strong>Weekly</strong>: Export new leads every week for timely follow-up</li>
        <li><strong>Monthly</strong>: Full export for backup and record-keeping</li>
        <li><strong>Before Campaigns</strong>: Export before launching new email sequences</li>
      </ul>

      <h3>Data Hygiene</h3>
      <ul>
        <li><strong>Remove Bounces</strong>: Exclude emails that failed delivery</li>
        <li><strong>Check for Duplicates</strong>: Use spreadsheet functions to find duplicate emails</li>
        <li><strong>Validate Emails</strong>: Consider using email validation services for large lists</li>
        <li><strong>Update Statuses</strong>: Keep track of which leads converted or unsubscribed</li>
      </ul>

      <h3>Engagement Tracking</h3>
      <ul>
        <li><strong>Monitor Open Rates</strong>: Track which emails get opened (email platform analytics)</li>
        <li><strong>Click-Through Rates</strong>: See which calls-to-action work best</li>
        <li><strong>Conversion Rates</strong>: Measure how many leads become customers</li>
        <li><strong>Unsubscribe Rates</strong>: High unsubscribe rate may indicate email quality issues</li>
      </ul>

      <h3>Lead Nurturing Timeline</h3>
      <p>
        A suggested timeline for nurturing leads:
      </p>
      <ol>
        <li><strong>Day 0 (immediate)</strong>: Welcome email with platform overview</li>
        <li><strong>Day 2</strong>: Value-add email (free content, insights)</li>
        <li><strong>Day 5</strong>: Introduction to 30-Day Sprint</li>
        <li><strong>Day 10</strong>: Testimonial or success story</li>
        <li><strong>Day 14</strong>: Invitation to purchase The Diamond Manifesto</li>
        <li><strong>Ongoing</strong>: Weekly insights or newsletter</li>
      </ol>

      <h2>Future Enhancement Possibilities</h2>
      <p>
        Potential future additions to lead management (would require developer):
      </p>
      <ul>
        <li><strong>Status Updates</strong>: Manually mark leads as contacted, converted, etc.</li>
        <li><strong>Notes Field</strong>: Add internal notes to lead records</li>
        <li><strong>Lead Scoring</strong>: Automatically rank leads by engagement</li>
        <li><strong>Email Campaign Tracking</strong>: See which emails were sent to each lead</li>
        <li><strong>Direct Email Integration</strong>: Send emails directly from the platform</li>
        <li><strong>Automated Sequences</strong>: Platform-native email automation</li>
        <li><strong>Lead Tags</strong>: Categorize leads with custom tags</li>
        <li><strong>Advanced Filtering</strong>: Filter by date range, status, source</li>
      </ul>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 my-4">
        <p className="text-sm text-neutral-400">
          <strong>Note:</strong> The current implementation provides core lead management
          functionality (view, search, export). Additional features can be added based on
          your specific needs and budget. Contact your developer to discuss enhancements.
        </p>
      </div>

      <h2>Troubleshooting</h2>

      <h3>Can't Access Lead Management Page</h3>
      <p>
        If you don't see the lead management option or get redirected:
      </p>
      <ul>
        <li>Ensure you're logged in with support@becomingdiamond.com</li>
        <li>Other accounts (even admin accounts) won't have access</li>
        <li>Try logging out and back in</li>
        <li>Clear browser cache and cookies</li>
      </ul>

      <h3>Export Not Working</h3>
      <p>
        If CSV export fails:
      </p>
      <ul>
        <li>Check browser pop-up blocker (may block download)</li>
        <li>Try a different browser (Chrome, Firefox, Safari)</li>
        <li>Check available disk space on your computer</li>
        <li>Refresh the page and try again</li>
      </ul>

      <h3>No Leads Showing</h3>
      <p>
        If the lead table is empty:
      </p>
      <ul>
        <li>Verify that signup forms are working on the website</li>
        <li>Check if any leads have been captured (may take time)</li>
        <li>Test the signup form yourself to capture a test lead</li>
        <li>Contact your developer if forms aren't capturing leads</li>
      </ul>

      <h2>Getting Help</h2>
      <p>
        If you need assistance with lead management:
      </p>
      <ul>
        <li>
          <strong>Technical Issues</strong>: Contact your developer (see{" "}
          <Link href="/docs-site/support" className="text-primary hover:underline">
            Support page
          </Link>)
        </li>
        <li>
          <strong>Email Marketing Strategy</strong>: Consider consulting a digital marketing
          specialist or email marketing expert
        </li>
        <li>
          <strong>Email Platform Help</strong>: Each email marketing platform has extensive
          documentation and support (Mailchimp, ConvertKit, etc.)
        </li>
      </ul>

      <h2>Next Steps</h2>
      <ul>
        <li>
          <Link href="/app/admin/leads" className="text-primary hover:underline">
            Access Lead Management Dashboard
          </Link>{" "}
          - View and export your leads
        </li>
        <li>
          <Link href="/docs-site/admin/book-sales" className="text-primary hover:underline">
            Book Sales Guide
          </Link>{" "}
          - Learn how to manage revenue from book purchases
        </li>
        <li>
          <Link href="/docs-site/support" className="text-primary hover:underline">
            Support
          </Link>{" "}
          - Get help and contact information
        </li>
      </ul>
    </DocsPage>
  );
}
