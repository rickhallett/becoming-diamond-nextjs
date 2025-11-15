/* eslint-disable react/no-unescaped-entities */
import { DocsPage } from "@/components/docs/docs-page";
import Link from "next/link";

export default function SupportPage() {
  return (
    <DocsPage
      title="Getting Help & Support"
      description="Resources and contact information for platform assistance"
    >
      <h2>Overview</h2>
      <p>
        This page provides guidance on getting help with the Becoming Diamond platform. Most
        questions can be answered through the documentation, but developer support is available
        when needed.
      </p>

      <h2>Self-Service Resources</h2>
      <p>
        Before reaching out for help, check if your question is answered in the documentation:
      </p>

      <h3>User Guides</h3>
      <ul>
        <li>
          <Link href="/docs-site/user/getting-started" className="text-primary hover:underline">
            Getting Started
          </Link>{" "}
          - How to log in, navigate the dashboard, and use basic features
        </li>
        <li>
          <Link href="/docs-site/user/sprint-program" className="text-primary hover:underline">
            Sprint Program
          </Link>{" "}
          - How to access and complete the 30-Day Sprint
        </li>
        <li>
          <Link href="/docs-site/user/profile" className="text-primary hover:underline">
            Profile Management
          </Link>{" "}
          - How to update your profile information
        </li>
      </ul>

      <h3>Admin Guides</h3>
      <ul>
        <li>
          <Link href="/docs-site/admin/cms-overview" className="text-primary hover:underline">
            CMS Overview
          </Link>{" "}
          - Introduction to content management system
        </li>
        <li>
          <Link href="/docs-site/admin/sprint-management" className="text-primary hover:underline">
            Managing Sprint Content
          </Link>{" "}
          - How to edit sprint days and lessons
        </li>
        <li>
          <Link href="/docs-site/admin/blog-management" className="text-primary hover:underline">
            Blog Management
          </Link>{" "}
          - How to create and publish blog posts
        </li>
        <li>
          <Link href="/docs-site/admin/book-sales" className="text-primary hover:underline">
            Book Sales
          </Link>{" "}
          - How to manage revenue and view orders in Stripe
        </li>
        <li>
          <Link href="/docs-site/admin/lead-management" className="text-primary hover:underline">
            Lead Management
          </Link>{" "}
          - How to access and export email leads
        </li>
        <li>
          <Link href="/docs-site/admin/rollback" className="text-primary hover:underline">
            Rollback Procedures
          </Link>{" "}
          - How to recover from content mistakes
        </li>
      </ul>

      <h3>Platform Overview</h3>
      <ul>
        <li>
          <Link href="/docs-site/overview" className="text-primary hover:underline">
            About Becoming Diamond
          </Link>{" "}
          - Platform features, goals, and revenue model
        </li>
      </ul>

      <h2>When to Contact Developer vs. Self-Service</h2>

      <h3>Questions You Can Solve Yourself</h3>
      <p>
        These issues can typically be resolved using the documentation:
      </p>
      <ul>
        <li><strong>CMS Usage</strong>: How to edit content, publish posts, manage sprint days</li>
        <li><strong>Viewing Data</strong>: Accessing Stripe Dashboard, viewing leads, exporting CSVs</li>
        <li><strong>Content Formatting</strong>: Markdown syntax, adding images, embedding videos</li>
        <li><strong>User Navigation</strong>: How members access features, view progress, edit profiles</li>
        <li><strong>Understanding Features</strong>: What the platform does and how it works</li>
      </ul>

      <h3>Issues That Require Developer Support</h3>
      <p>
        Contact the developer for technical issues or feature changes:
      </p>

      <h4>Technical Problems</h4>
      <ul>
        <li><strong>Website Down or Errors</strong>: Site not loading, error messages, broken features</li>
        <li><strong>CMS Not Working</strong>: Can't log in to CMS, changes not saving, GitHub errors</li>
        <li><strong>Payment Issues</strong>: Stripe integration broken, payments failing</li>
        <li><strong>Email Not Sending</strong>: Authentication emails, lead notifications not working</li>
        <li><strong>Data Not Saving</strong>: User progress, profile updates, or content not persisting</li>
      </ul>

      <h4>Feature Modifications</h4>
      <ul>
        <li><strong>Price Changes</strong>: Updating book price (requires code + Stripe changes)</li>
        <li><strong>Content Structure</strong>: Adding new sprint days, changing program length</li>
        <li><strong>Design Changes</strong>: Layout modifications, color scheme updates</li>
        <li><strong>New Features</strong>: Adding functionality not currently available</li>
        <li><strong>Integration Updates</strong>: Changing video hosting, email service, etc.</li>
      </ul>

      <h4>Data Recovery</h4>
      <ul>
        <li><strong>Content Rollback</strong>: Recovering deleted content or reverting changes</li>
        <li><strong>Database Issues</strong>: User data problems, missing records</li>
        <li><strong>Accidental Deletions</strong>: Restoring removed content or settings</li>
      </ul>

      <h4>Access and Security</h4>
      <ul>
        <li><strong>Login Problems</strong>: Can't access admin account, password issues</li>
        <li><strong>Permission Changes</strong>: Adding/removing CMS access</li>
        <li><strong>Security Concerns</strong>: Suspected breaches, unusual activity</li>
      </ul>

      <h2>How to Contact Developer</h2>

      <h3>Developer Information</h3>
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 my-4">
        <p className="text-sm text-neutral-400 mb-4">
          <strong>Developer Contact:</strong>
        </p>
        <ul className="text-sm text-neutral-300 space-y-2">
          <li>
            <strong>Name:</strong> [Developer Name]
          </li>
          <li>
            <strong>Email:</strong> <span className="text-primary">[developer@email.com]</span>
          </li>
          <li>
            <strong>Availability:</strong> [Business hours / timezone]
          </li>
          <li>
            <strong>Response Time:</strong> [Expected response time]
          </li>
        </ul>
      </div>

      <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4 my-6">
        <p className="text-sm text-neutral-300">
          <strong>Note:</strong> Replace the placeholder information above with actual developer
          contact details before handover.
        </p>
      </div>

      <h3>What to Include in Your Support Request</h3>
      <p>
        When contacting the developer, provide:
      </p>

      <h4>For Technical Issues</h4>
      <ol>
        <li><strong>What happened</strong>: Describe the problem in detail</li>
        <li><strong>When it happened</strong>: Date and approximate time</li>
        <li><strong>What you were doing</strong>: Steps that led to the issue</li>
        <li><strong>Error messages</strong>: Any error text or codes you saw</li>
        <li><strong>Screenshots</strong>: Visual evidence of the problem (if applicable)</li>
        <li><strong>Urgency level</strong>: How critical is this issue?</li>
      </ol>

      <h4>For Feature Requests</h4>
      <ol>
        <li><strong>What you want to change</strong>: Clearly describe the desired outcome</li>
        <li><strong>Why you want it</strong>: Business reason or user benefit</li>
        <li><strong>Current workaround</strong>: How you're handling it now (if applicable)</li>
        <li><strong>Priority</strong>: How important is this change?</li>
        <li><strong>Timeline</strong>: When do you need it by?</li>
      </ol>

      <h4>For Content Recovery</h4>
      <ol>
        <li><strong>What was deleted/changed</strong>: Specific content or page</li>
        <li><strong>When it happened</strong>: Date and approximate time</li>
        <li><strong>What version you need</strong>: Describe the content to restore</li>
      </ol>

      <h3>Expected Response Times</h3>

      <h4>Issue Priority Levels</h4>

      <div className="space-y-4 my-4">
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <p className="text-sm font-semibold text-red-300 mb-2">🚨 CRITICAL (Same Day)</p>
          <p className="text-sm text-neutral-300">
            Website completely down, payment processing broken, major security issue,
            data loss affecting users
          </p>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
          <p className="text-sm font-semibold text-amber-300 mb-2">⚠️ HIGH (1-2 Business Days)</p>
          <p className="text-sm text-neutral-300">
            Feature broken but site functional, CMS not working, email not sending,
            affecting multiple users
          </p>
        </div>

        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <p className="text-sm font-semibold text-blue-300 mb-2">📌 MEDIUM (3-5 Business Days)</p>
          <p className="text-sm text-neutral-300">
            Minor bugs, content recovery requests, cosmetic issues, affecting single
            user or admin only
          </p>
        </div>

        <div className="bg-neutral-900 border border-neutral-600/30 rounded-lg p-4">
          <p className="text-sm font-semibold text-neutral-300 mb-2">💡 LOW (1-2 Weeks)</p>
          <p className="text-sm text-neutral-300">
            Feature requests, enhancements, optimization, nice-to-have changes,
            documentation updates
          </p>
        </div>
      </div>

      <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 my-4">
        <p className="text-sm text-neutral-300">
          <strong>Note:</strong> Response times are estimates based on typical issue complexity.
          Actual times may vary based on developer availability and issue investigation requirements.
        </p>
      </div>

      <h2>Emergency Procedures</h2>

      <h3>What Qualifies as an Emergency</h3>
      <p>
        An emergency is a situation that:
      </p>
      <ul>
        <li>Prevents the website from loading entirely</li>
        <li>Breaks payment processing (can't accept book purchases)</li>
        <li>Exposes sensitive user data or security vulnerability</li>
        <li>Causes data loss affecting multiple users</li>
        <li>Makes the platform completely unusable</li>
      </ul>

      <h3>Emergency Contact Procedure</h3>
      <ol>
        <li><strong>Email developer immediately</strong>: Use subject line "URGENT: [Brief Description]"</li>
        <li><strong>Provide details</strong>: What's broken, when it started, error messages</li>
        <li><strong>Include screenshots</strong>: Visual evidence helps diagnosis</li>
        <li><strong>Follow up if needed</strong>: If no response within 4 hours during business hours</li>
      </ol>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 my-4">
        <p className="text-sm text-neutral-400">
          <strong>Alternative Emergency Contact:</strong> [Phone number or alternative contact
          method if available]
        </p>
      </div>

      <h3>What to Do While Waiting</h3>
      <p>
        If you encounter an emergency issue:
      </p>
      <ul>
        <li><strong>Don't make changes</strong>: Avoid trying to fix technical issues yourself</li>
        <li><strong>Document everything</strong>: Take screenshots, note times, save error messages</li>
        <li><strong>Communicate with users</strong>: If public-facing issue, consider social media update</li>
        <li><strong>Check status</strong>: Verify if it's just you (try different browser/device)</li>
        <li><strong>Wait for response</strong>: Developer will investigate and provide updates</li>
      </ul>

      <h2>Common Questions</h2>

      <h3>How often should I back up my content?</h3>
      <p>
        Content is automatically backed up through Git version control with every save.
        Additionally:
      </p>
      <ul>
        <li>The entire repository is stored on GitHub</li>
        <li>All CMS changes are committed and tracked</li>
        <li>You can access full change history at any time</li>
        <li>No manual backup needed for content</li>
      </ul>

      <h3>What if I accidentally delete something?</h3>
      <p>
        Content can be recovered:
      </p>
      <ul>
        <li>All deletions are tracked in Git history</li>
        <li>Contact developer to restore deleted content</li>
        <li>Usually can be recovered within minutes</li>
        <li>See <Link href="/docs-site/admin/rollback" className="text-primary hover:underline">Rollback Procedures</Link> guide</li>
      </ul>

      <h3>Can I add more admin users to the CMS?</h3>
      <p>
        The current configuration supports single admin access (website owner):
      </p>
      <ul>
        <li>Only support@becomingdiamond.com has CMS access</li>
        <li>Additional users can be added (requires developer)</li>
        <li>Each user needs a GitHub account</li>
        <li>Contact developer to set up additional CMS users</li>
      </ul>

      <h3>How do I update the book file?</h3>
      <p>
        Updating the digital book file requires developer assistance:
      </p>
      <ul>
        <li>Book files are stored on hosting service (Stripe or CDN)</li>
        <li>Send updated PDF/ePub to developer</li>
        <li>Developer will upload and update download links</li>
        <li>Existing purchasers may need re-notification (optional)</li>
      </ul>

      <h3>What hosting service is the site on?</h3>
      <p>
        Platform hosting details:
      </p>
      <ul>
        <li><strong>Web Hosting</strong>: [Hosting provider - e.g., Vercel, Netlify]</li>
        <li><strong>Database</strong>: Turso (libSQL cloud database)</li>
        <li><strong>Video Hosting</strong>: Bunny Stream</li>
        <li><strong>Payments</strong>: Stripe</li>
        <li><strong>Email</strong>: Gmail SMTP (or transactional email service)</li>
        <li><strong>CMS Backend</strong>: GitHub (repository storage)</li>
      </ul>

      <h3>What happens if payment processing stops working?</h3>
      <p>
        If you can't accept book purchases:
      </p>
      <ol>
        <li>Contact developer immediately (HIGH priority)</li>
        <li>Check Stripe Dashboard for any alerts or issues</li>
        <li>Verify Stripe account is in good standing</li>
        <li>Developer will investigate integration and webhooks</li>
        <li>Usually resolved within 1-2 business days</li>
      </ol>

      <h3>Can I change the platform design or colors?</h3>
      <p>
        Design changes require developer:
      </p>
      <ul>
        <li><strong>Minor changes</strong>: Color updates, font sizes (quick, 1-2 hours)</li>
        <li><strong>Layout changes</strong>: Rearranging sections, new components (medium, 3-8 hours)</li>
        <li><strong>Major redesign</strong>: Complete visual overhaul (large, 20+ hours)</li>
        <li>Discuss scope and timeline with developer before requesting</li>
      </ul>

      <h2>Maintenance and Updates</h2>

      <h3>Platform Maintenance Schedule</h3>
      <p>
        The platform is maintained by the developer:
      </p>
      <ul>
        <li><strong>Security Updates</strong>: Applied as needed (usually automatic)</li>
        <li><strong>Dependency Updates</strong>: Monthly or quarterly</li>
        <li><strong>Feature Additions</strong>: Based on your requests and budget</li>
        <li><strong>Bug Fixes</strong>: Addressed as reported</li>
      </ul>

      <h3>Service Monitoring</h3>
      <p>
        Platform uptime and performance:
      </p>
      <ul>
        <li>Hosting provider typically has 99.9% uptime SLA</li>
        <li>Automated monitoring alerts developer to issues</li>
        <li>Most outages are brief and resolved automatically</li>
        <li>Check hosting provider status page for known issues</li>
      </ul>

      <h3>Requesting New Features</h3>
      <p>
        To propose new functionality:
      </p>
      <ol>
        <li><strong>Describe the feature</strong>: What should it do?</li>
        <li><strong>Explain the benefit</strong>: Why is it valuable?</li>
        <li><strong>Provide examples</strong>: Show similar features on other sites</li>
        <li><strong>Discuss with developer</strong>: Get scope and cost estimate</li>
        <li><strong>Prioritize</strong>: Decide if/when to implement</li>
      </ol>

      <h2>Documentation Updates</h2>

      <h3>Keeping Documentation Current</h3>
      <p>
        This documentation reflects the platform's current state:
      </p>
      <ul>
        <li>When features change, documentation should be updated</li>
        <li>Request doc updates from developer alongside feature changes</li>
        <li>Report any inaccuracies or outdated information</li>
        <li>Suggest additions for topics not currently covered</li>
      </ul>

      <h3>Missing Information?</h3>
      <p>
        If you can't find answers in the docs:
      </p>
      <ul>
        <li>Contact developer with your question</li>
        <li>They can add missing documentation</li>
        <li>Helps future reference and reduces repeat questions</li>
      </ul>

      <h2>Third-Party Service Support</h2>

      <h3>Stripe Support</h3>
      <p>
        For payment processing issues:
      </p>
      <ul>
        <li><strong>Stripe Dashboard</strong>: Click "?" icon for help</li>
        <li><strong>Live Chat</strong>: Available 24/7 in dashboard</li>
        <li><strong>Help Center</strong>: <a href="https://support.stripe.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">support.stripe.com</a></li>
        <li><strong>Email</strong>: support@stripe.com</li>
      </ul>

      <h3>Email Marketing Platforms</h3>
      <p>
        For email campaign support:
      </p>
      <ul>
        <li><strong>Mailchimp</strong>: <a href="https://mailchimp.com/help/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">mailchimp.com/help</a></li>
        <li><strong>ConvertKit</strong>: <a href="https://help.convertkit.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">help.convertkit.com</a></li>
        <li>Most platforms have live chat or knowledge bases</li>
      </ul>

      <h3>GitHub (for CMS)</h3>
      <p>
        For GitHub-related issues:
      </p>
      <ul>
        <li><strong>GitHub Support</strong>: <a href="https://support.github.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">support.github.com</a></li>
        <li><strong>Community Forum</strong>: <a href="https://github.community" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">github.community</a></li>
        <li>Most CMS issues are solved by developer, not GitHub directly</li>
      </ul>

      <h2>Additional Resources</h2>
      <ul>
        <li>
          <Link href="/docs-site/technical/architecture" className="text-primary hover:underline">
            Technical Documentation
          </Link>{" "}
          - For developers working on the platform
        </li>
        <li>
          <Link href="/docs-site/overview" className="text-primary hover:underline">
            Platform Overview
          </Link>{" "}
          - High-level understanding of the system
        </li>
      </ul>

      <h2>Feedback and Suggestions</h2>
      <p>
        Your feedback helps improve the platform:
      </p>
      <ul>
        <li>Share ideas for new features or improvements</li>
        <li>Report bugs or confusing user experiences</li>
        <li>Suggest documentation topics to add</li>
        <li>All feedback welcome—send to developer email</li>
      </ul>

      <div className="bg-primary/10 border border-primary/30 rounded-lg p-6 my-6">
        <p className="text-neutral-300 mb-2">
          <strong>Remember:</strong> Most questions can be answered through this documentation.
          Take a few minutes to search the guides before reaching out—it's often faster
          than waiting for a response!
        </p>
        <p className="text-neutral-300">
          For everything else, your developer is here to help.
        </p>
      </div>
    </DocsPage>
  );
}
