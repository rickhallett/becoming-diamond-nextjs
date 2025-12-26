/* eslint-disable react/no-unescaped-entities */
import { DocsPage } from "@/components/docs/docs-page";

export default function EmailServicePage() {
  return (
    <DocsPage
      title="Email Service Management"
      description="Understanding Gmail SMTP vs Resend, when to migrate, and how to switch email providers"
    >
      <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 my-6">
        <p className="text-sm text-neutral-300">
          <strong>Current Setup:</strong> Your platform uses Gmail SMTP for sending emails. This provides
          immediate, no-cost email functionality. However, you should plan to migrate to Resend (a
          professional email service) as your user base grows.
        </p>
      </div>

      <h2>Overview</h2>
      <p>
        The Becoming Diamond platform sends several types of emails to users:
      </p>
      <ul>
        <li><strong>Authentication emails:</strong> Magic links for passwordless login</li>
        <li><strong>Lead notifications:</strong> When someone joins the waiting list</li>
        <li><strong>Purchase confirmations:</strong> When someone buys the book</li>
        <li><strong>Sprint notifications:</strong> Progress updates and reminders (future feature)</li>
      </ul>
      <p>
        These emails are currently sent through <strong>Gmail SMTP</strong> using the support@becomingdiamond.com
        email account. This works well for getting started but has limitations as you scale.
      </p>

      <h2>Current Setup: Gmail SMTP</h2>

      <h3>How It Works</h3>
      <p>
        Gmail SMTP (Simple Mail Transfer Protocol) uses your existing Gmail account to send emails
        from the platform. When a user requests a magic link or purchases the book, the platform
        connects to Gmail's servers and sends the email on your behalf.
      </p>

      <h3>Advantages</h3>
      <ul>
        <li><strong>Immediate Access:</strong> Works right away with no additional setup or costs</li>
        <li><strong>Zero Cost:</strong> Completely free to use (no monthly fees or per-email charges)</li>
        <li><strong>Familiar Interface:</strong> You can see sent emails in your Gmail account</li>
        <li><strong>Simple Setup:</strong> Just requires your Gmail credentials</li>
        <li><strong>Good for Testing:</strong> Perfect for development and initial launch</li>
      </ul>

      <h3>Limitations and Issues</h3>
      <p>
        While Gmail SMTP works well initially, it has several important limitations:
      </p>

      <div className="space-y-4 my-6">
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <h4 className="text-yellow-400 font-semibold mb-2">⚠️ Daily Send Limits</h4>
          <p className="text-sm text-neutral-300">
            Gmail limits you to <strong>500 emails per day</strong> (or 2,000 for Google Workspace accounts).
            If you exceed this limit, Gmail will block sending for 24 hours. This affects:
          </p>
          <ul className="text-sm text-neutral-300 mt-2 space-y-1">
            <li>• Magic link authentication (users can't log in)</li>
            <li>• Purchase confirmations (customers don't receive their order details)</li>
            <li>• Lead notifications (you miss new signups)</li>
          </ul>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <h4 className="text-yellow-400 font-semibold mb-2">⚠️ Deliverability Issues</h4>
          <p className="text-sm text-neutral-300">
            Gmail SMTP emails are more likely to land in spam folders because:
          </p>
          <ul className="text-sm text-neutral-300 mt-2 space-y-1">
            <li>• Shared IP address with millions of Gmail users</li>
            <li>• Limited SPF/DKIM authentication options</li>
            <li>• Gmail marks automated emails as "less important"</li>
            <li>• No dedicated sending infrastructure</li>
          </ul>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <h4 className="text-yellow-400 font-semibold mb-2">⚠️ Rate Limiting</h4>
          <p className="text-sm text-neutral-300">
            Gmail enforces sending speed limits (typically 1-2 emails per second). During high-traffic
            events (launch day, marketing campaign), emails will be queued and delayed, causing:
          </p>
          <ul className="text-sm text-neutral-300 mt-2 space-y-1">
            <li>• Slow authentication (users wait for magic links)</li>
            <li>• Delayed purchase confirmations</li>
            <li>• Poor user experience during peak times</li>
          </ul>
        </div>

        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <h4 className="text-red-400 font-semibold mb-2">🚫 Account Security Risks</h4>
          <p className="text-sm text-neutral-300">
            If Gmail detects "suspicious activity" (rapid sending, unusual patterns), it may:
          </p>
          <ul className="text-sm text-neutral-300 mt-2 space-y-1">
            <li>• Lock your account temporarily</li>
            <li>• Require manual verification</li>
            <li>• Completely disable SMTP access</li>
            <li>• Take your entire platform offline until resolved</li>
          </ul>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <h4 className="text-yellow-400 font-semibold mb-2">⚠️ No Analytics or Tracking</h4>
          <p className="text-sm text-neutral-300">
            Gmail SMTP provides no insights into email performance:
          </p>
          <ul className="text-sm text-neutral-300 mt-2 space-y-1">
            <li>• Can't see open rates</li>
            <li>• Can't track click-through rates</li>
            <li>• No delivery/bounce monitoring</li>
            <li>• No A/B testing capabilities</li>
          </ul>
        </div>
      </div>

      <h2>When to Switch to Resend</h2>

      <h3>Activity Thresholds</h3>
      <p>
        You should consider migrating to Resend when you reach any of these milestones:
      </p>

      <div className="space-y-3 my-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h4 className="font-semibold text-primary mb-2">📊 Email Volume</h4>
          <ul className="text-sm text-neutral-300 space-y-2">
            <li>
              <strong>Immediate:</strong> If you're sending more than <strong>300 emails per day</strong>
              <br />
              <span className="text-neutral-400">You're approaching Gmail's 500/day limit</span>
            </li>
            <li>
              <strong>Plan Ahead:</strong> If you're sending more than <strong>150 emails per day</strong>
              <br />
              <span className="text-neutral-400">You have room to grow but should prepare for migration</span>
            </li>
          </ul>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h4 className="font-semibold text-primary mb-2">👥 User Base Size</h4>
          <ul className="text-sm text-neutral-300 space-y-2">
            <li>
              <strong>200+ active users:</strong> Migrate to avoid authentication bottlenecks
              <br />
              <span className="text-neutral-400">Users logging in daily will quickly hit rate limits</span>
            </li>
            <li>
              <strong>500+ total users:</strong> Gmail SMTP becomes unreliable
              <br />
              <span className="text-neutral-400">Announcements or broadcasts will fail</span>
            </li>
          </ul>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h4 className="font-semibold text-primary mb-2">🚀 Business Events</h4>
          <p className="text-sm text-neutral-300 mb-2">Migrate <strong>before</strong> these events:</p>
          <ul className="text-sm text-neutral-300 space-y-2">
            <li>
              <strong>Marketing campaigns:</strong> Email broadcasts to your list
              <br />
              <span className="text-neutral-400">Will immediately hit 500/day limit</span>
            </li>
            <li>
              <strong>Product launches:</strong> Expecting surge of new signups
              <br />
              <span className="text-neutral-400">Need reliable email for authentication</span>
            </li>
            <li>
              <strong>Course releases:</strong> Sprint notifications to all members
              <br />
              <span className="text-neutral-400">Requires professional delivery infrastructure</span>
            </li>
          </ul>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h4 className="font-semibold text-primary mb-2">⚠️ Warning Signs</h4>
          <p className="text-sm text-neutral-300 mb-2">
            Migrate <strong>immediately</strong> if you notice:
          </p>
          <ul className="text-sm text-neutral-300 space-y-2">
            <li>• Users reporting they didn't receive magic link emails</li>
            <li>• Emails landing in spam folders consistently</li>
            <li>• Gmail blocking or throttling your sends</li>
            <li>• Delayed email delivery (more than 1-2 minutes)</li>
            <li>• "Quota exceeded" errors in platform logs</li>
          </ul>
        </div>
      </div>

      <h3>Recommended Migration Timeline</h3>
      <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 my-4">
        <p className="text-sm text-neutral-300">
          <strong>Conservative Recommendation:</strong> Migrate to Resend when you reach <strong>100 active users</strong> or
          <strong> 100 emails per day</strong>, whichever comes first. This provides a comfortable buffer and
          ensures professional email delivery as you grow.
        </p>
      </div>

      <h2>Why Resend?</h2>

      <h3>Overview</h3>
      <p>
        Resend is a modern email API service designed specifically for developers and applications.
        It solves all the limitations of Gmail SMTP while remaining affordable.
      </p>

      <h3>Key Benefits</h3>
      <div className="space-y-3 my-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h4 className="font-semibold text-primary mb-2">📈 High Volume Support</h4>
          <ul className="text-sm text-neutral-300 space-y-1">
            <li>• <strong>Free tier:</strong> 3,000 emails per month (100/day)</li>
            <li>• <strong>Paid tier:</strong> 50,000 emails per month for $20/month</li>
            <li>• <strong>Growth tier:</strong> 1,000,000 emails per month for $250/month</li>
            <li>• No daily limits or throttling</li>
          </ul>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h4 className="font-semibold text-primary mb-2">✅ Professional Deliverability</h4>
          <ul className="text-sm text-neutral-300 space-y-1">
            <li>• Dedicated sending infrastructure</li>
            <li>• Built-in SPF/DKIM/DMARC authentication</li>
            <li>• Reputation management and monitoring</li>
            <li>• 99%+ inbox delivery rate</li>
          </ul>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h4 className="font-semibold text-primary mb-2">📊 Analytics and Insights</h4>
          <ul className="text-sm text-neutral-300 space-y-1">
            <li>• Real-time delivery tracking</li>
            <li>• Open and click-through rates</li>
            <li>• Bounce and complaint monitoring</li>
            <li>• Detailed logs and debugging tools</li>
          </ul>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h4 className="font-semibold text-primary mb-2">⚡ Performance</h4>
          <ul className="text-sm text-neutral-300 space-y-1">
            <li>• Near-instant email delivery (seconds, not minutes)</li>
            <li>• Handles traffic spikes automatically</li>
            <li>• 99.9% uptime SLA</li>
            <li>• Global infrastructure for fast delivery worldwide</li>
          </ul>
        </div>
      </div>

      <h2>Migration Process</h2>

      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 my-6">
        <p className="text-sm text-neutral-300">
          <strong>Good News:</strong> The Resend email adapter is already built into your platform.
          Switching from Gmail SMTP to Resend takes less than 15 minutes and requires no code changes.
        </p>
      </div>

      <h3>How to Switch (Quick Guide)</h3>
      <p>
        When you're ready to migrate, follow these steps:
      </p>
      <ol>
        <li>
          <strong>Create Resend Account</strong>
          <ul>
            <li>Go to <a href="https://resend.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">resend.com</a></li>
            <li>Sign up with your email (free plan available)</li>
            <li>Verify your email address</li>
          </ul>
        </li>
        <li>
          <strong>Add Your Domain</strong>
          <ul>
            <li>In Resend dashboard, go to "Domains"</li>
            <li>Add "becomingdiamond.com"</li>
            <li>Copy the DNS records provided</li>
          </ul>
        </li>
        <li>
          <strong>Update DNS Records</strong>
          <ul>
            <li>Log in to your domain registrar (Namecheap, GoDaddy, etc.)</li>
            <li>Add the TXT, CNAME, and MX records from Resend</li>
            <li>Wait 5-10 minutes for DNS propagation</li>
            <li>Verify domain in Resend dashboard</li>
          </ul>
        </li>
        <li>
          <strong>Get API Key</strong>
          <ul>
            <li>In Resend dashboard, go to "API Keys"</li>
            <li>Click "Create API Key"</li>
            <li>Copy the key (starts with "re_")</li>
          </ul>
        </li>
        <li>
          <strong>Update Environment Variables</strong>
          <ul>
            <li>Contact your developer (or access Vercel dashboard if you have access)</li>
            <li>Update these environment variables:
              <ul>
                <li><code>AUTH_RESEND_KEY=re_your_api_key</code></li>
                <li><code>RESEND_API_KEY=re_your_api_key</code></li>
                <li><code>RESEND_FROM_EMAIL=support@becomingdiamond.com</code></li>
              </ul>
            </li>
            <li>Remove or comment out Gmail SMTP variables:
              <ul>
                <li><code>GMAIL_USER</code></li>
                <li><code>GMAIL_APP_PASSWORD</code></li>
              </ul>
            </li>
          </ul>
        </li>
        <li>
          <strong>Deploy Changes</strong>
          <ul>
            <li>Your developer will redeploy the platform (automatic on Vercel)</li>
            <li>Takes 2-3 minutes</li>
          </ul>
        </li>
        <li>
          <strong>Test Email Delivery</strong>
          <ul>
            <li>Request a magic link on the login page</li>
            <li>Check that email arrives within seconds</li>
            <li>Verify it's from support@becomingdiamond.com</li>
            <li>Confirm it's not in spam folder</li>
          </ul>
        </li>
      </ol>

      <h3>Zero Downtime Migration</h3>
      <p>
        The platform automatically detects which email service is configured. The switch is seamless:
      </p>
      <ul>
        <li>When <code>RESEND_API_KEY</code> is set, the platform uses Resend</li>
        <li>When <code>GMAIL_USER</code> is set and Resend is not, the platform uses Gmail SMTP</li>
        <li>No code changes required</li>
        <li>No user impact during migration</li>
      </ul>

      <h2>Cost Comparison</h2>

      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-800">
              <th className="text-left py-2 px-4">Service</th>
              <th className="text-left py-2 px-4">Monthly Cost</th>
              <th className="text-left py-2 px-4">Email Limit</th>
              <th className="text-left py-2 px-4">Best For</th>
            </tr>
          </thead>
          <tbody className="text-neutral-300">
            <tr className="border-b border-neutral-800">
              <td className="py-2 px-4"><strong>Gmail SMTP</strong></td>
              <td className="py-2 px-4">$0 (Free)</td>
              <td className="py-2 px-4">500/day (15,000/month)</td>
              <td className="py-2 px-4">Testing, small launches (&lt;100 users)</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-2 px-4"><strong>Resend Free</strong></td>
              <td className="py-2 px-4">$0 (Free)</td>
              <td className="py-2 px-4">3,000/month (100/day)</td>
              <td className="py-2 px-4">Early growth (100-300 users)</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-2 px-4"><strong>Resend Pro</strong></td>
              <td className="py-2 px-4">$20</td>
              <td className="py-2 px-4">50,000/month (1,666/day)</td>
              <td className="py-2 px-4">Growing platform (300-2,000 users)</td>
            </tr>
            <tr>
              <td className="py-2 px-4"><strong>Resend Growth</strong></td>
              <td className="py-2 px-4">$250</td>
              <td className="py-2 px-4">1,000,000/month (33,333/day)</td>
              <td className="py-2 px-4">Established platform (2,000+ users)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Summary</h2>

      <div className="space-y-4 my-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h4 className="font-semibold mb-2">✅ Use Gmail SMTP When:</h4>
          <ul className="text-sm text-neutral-300 space-y-1">
            <li>• Platform is in development or testing</li>
            <li>• You have fewer than 100 active users</li>
            <li>• Sending fewer than 100 emails per day</li>
            <li>• No immediate marketing campaigns planned</li>
          </ul>
        </div>

        <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
          <h4 className="font-semibold mb-2">🚀 Migrate to Resend When:</h4>
          <ul className="text-sm text-neutral-300 space-y-1">
            <li>• You reach 100 active users or 100 emails/day</li>
            <li>• Planning a marketing campaign or product launch</li>
            <li>• Users report emails landing in spam</li>
            <li>• You need email analytics and tracking</li>
            <li>• Email delivery is critical to your business</li>
          </ul>
        </div>

        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <h4 className="font-semibold text-green-400 mb-2">💡 Key Takeaway</h4>
          <p className="text-sm text-neutral-300">
            Start with Gmail SMTP for zero cost and immediate functionality. Plan to migrate
            to Resend when you reach 100 users or 100 emails/day. The migration is simple,
            takes 15 minutes, and the adapter is already built in. You can even start with
            Resend's free tier (3,000 emails/month) before any paid plan is needed.
          </p>
        </div>
      </div>

      <h2>Need Help?</h2>
      <p>
        If you're unsure whether it's time to migrate or need assistance with the process,
        contact your developer. They can:
      </p>
      <ul>
        <li>Check your current email volume and usage</li>
        <li>Review email logs for delivery issues</li>
        <li>Help with Resend account setup</li>
        <li>Perform the migration for you</li>
        <li>Monitor email performance after migration</li>
      </ul>
    </DocsPage>
  );
}
