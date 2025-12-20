/* eslint-disable react/no-unescaped-entities */
import { DocsPage } from "@/components/docs/docs-page";
import Link from "next/link";

export default function WixMigrationPage() {
  return (
    <DocsPage
      title="Wix Migration Feasibility & Estimate"
      description="Business continuity fallback: Replicating site functionality on Wix platform"
    >
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6">
        <p className="text-sm text-neutral-400 mb-2">
          <strong>Executive Summary:</strong> Four migration tiers available from $580-3,600 one-time cost, $27-205/month ongoing.
        </p>
        <p className="text-sm text-neutral-400 mb-2">
          <strong>Recommended:</strong> Option C - Velo Enhanced ($1,800-2,400) for 90% feature parity.
        </p>
        <p className="text-sm text-neutral-400">
          <strong>Critical Finding:</strong> Wix can replicate functionality but loses Aceternity UI animations.
        </p>
      </div>

      <div className="bg-neutral-900 border border-primary/30 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-semibold mb-2">Research & Documentation Cost</h3>
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-neutral-800">
              <td className="py-1">Platform capability analysis</td>
              <td className="text-right py-1">0.5 hours</td>
              <td className="text-right py-1">$20</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-1">Migration complexity assessment</td>
              <td className="text-right py-1">1 hour</td>
              <td className="text-right py-1">$40</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-1">Documentation production</td>
              <td className="text-right py-1">0.5 hours</td>
              <td className="text-right py-1">$20</td>
            </tr>
            <tr className="font-semibold">
              <td className="py-1">Total Research & Documentation</td>
              <td className="text-right py-1">2 hours</td>
              <td className="text-right py-1">$80</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Migration Options Overview</h2>

      <div className="space-y-4 my-6">
        <div className="border border-neutral-800 rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold">Option A: Basic Presence</h3>
            <div className="text-right">
              <span className="text-sm text-neutral-400 block">$580</span>
              <span className="text-xs text-neutral-500">$27/month</span>
            </div>
          </div>
          <p className="text-sm text-neutral-400 mb-2">
            Functional website using Wix templates and built-in apps. No custom code.
          </p>
          <div className="text-sm space-y-1">
            <p><strong>Timeline:</strong> 3-4 days</p>
            <p><strong>Features:</strong> 45% retention (basic pages, no video, limited members)</p>
            <p><strong>Development:</strong> Wix Editor only</p>
            <p><strong>Best for:</strong> Emergency fallback, minimal budget</p>
          </div>
        </div>

        <div className="border border-neutral-800 rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold">Option B: Enhanced Integration</h3>
            <div className="text-right">
              <span className="text-sm text-neutral-400 block">$1,280</span>
              <span className="text-xs text-neutral-500">$52-112/month</span>
            </div>
          </div>
          <p className="text-sm text-neutral-400 mb-2">
            Premium template with Wix apps for video, automation, and better UX.
          </p>
          <div className="text-sm space-y-1">
            <p><strong>Timeline:</strong> 1-1.5 weeks</p>
            <p><strong>Features:</strong> 65% retention (video content, automations, improved design)</p>
            <p><strong>Development:</strong> Wix Editor + Apps</p>
            <p><strong>Best for:</strong> Good UX with reasonable budget</p>
          </div>
        </div>

        <div className="border border-primary/30 bg-neutral-900 rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold">Option C: Velo Enhanced ⭐ Recommended</h3>
            <div className="text-right">
              <span className="text-sm text-neutral-300 block">$1,800-2,400</span>
              <span className="text-xs text-neutral-400">$57-112/month</span>
            </div>
          </div>
          <p className="text-sm text-neutral-400 mb-2">
            Custom development with Wix Velo for full feature parity. Database, APIs, custom logic.
          </p>
          <div className="text-sm space-y-1">
            <p><strong>Timeline:</strong> 2-3 weeks</p>
            <p><strong>Features:</strong> 90% retention (sprint tracking, video API, admin panel, Stripe)</p>
            <p><strong>Development:</strong> Velo (JavaScript/TypeScript) + Wix Data</p>
            <p><strong>Best for:</strong> Feature parity, best value, business continuity</p>
          </div>
        </div>

        <div className="border border-neutral-800 rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold">Option D: Premium Build</h3>
            <div className="text-right">
              <span className="text-sm text-neutral-400 block">$2,800-3,600</span>
              <span className="text-xs text-neutral-500">$100-205/month</span>
            </div>
          </div>
          <p className="text-sm text-neutral-400 mb-2">
            Maximum quality with custom animations, advanced integrations, and premium polish.
          </p>
          <div className="text-sm space-y-1">
            <p><strong>Timeline:</strong> 3-4 weeks</p>
            <p><strong>Features:</strong> 95% retention (custom animations, CRM, marketing automation)</p>
            <p><strong>Development:</strong> Advanced Velo + Wix Blocks + GSAP</p>
            <p><strong>Best for:</strong> Maximum quality, high budget</p>
          </div>
        </div>
      </div>

      <h2>Cost Comparison</h2>

      <div className="overflow-x-auto my-4">
        <table className="w-full text-sm border border-neutral-800">
          <thead>
            <tr className="border-b border-neutral-800">
              <th className="text-left p-2">Option</th>
              <th className="text-right p-2">One-Time</th>
              <th className="text-right p-2">Monthly</th>
              <th className="text-left p-2">Timeline</th>
              <th className="text-left p-2">Features</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-neutral-800">
              <td className="p-2">A: Basic</td>
              <td className="text-right p-2">$580</td>
              <td className="text-right p-2">$27</td>
              <td className="p-2">3-4 days</td>
              <td className="p-2 text-neutral-400">45%</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="p-2">B: Enhanced</td>
              <td className="text-right p-2">$1,280</td>
              <td className="text-right p-2">$52-112</td>
              <td className="p-2">1-1.5 weeks</td>
              <td className="p-2 text-neutral-400">65%</td>
            </tr>
            <tr className="border-b border-neutral-800 bg-neutral-900">
              <td className="p-2 font-semibold">C: Velo ⭐</td>
              <td className="text-right p-2 font-semibold">$1,800-2,400</td>
              <td className="text-right p-2 font-semibold">$57-112</td>
              <td className="p-2">2-3 weeks</td>
              <td className="p-2 text-primary">90%</td>
            </tr>
            <tr>
              <td className="p-2">D: Premium</td>
              <td className="text-right p-2">$2,800-3,600</td>
              <td className="text-right p-2">$100-205</td>
              <td className="p-2">3-4 weeks</td>
              <td className="p-2 text-neutral-400">95%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 my-6">
        <p className="text-sm text-neutral-400">
          <strong>Note:</strong> Monthly costs are 2-9x higher than current infrastructure ($21/month) due to Wix platform fees and third-party services.
        </p>
      </div>

      <h2>Feature Comparison</h2>

      <div className="overflow-x-auto my-4">
        <table className="w-full text-sm border border-neutral-800">
          <thead>
            <tr className="border-b border-neutral-800">
              <th className="text-left p-2">Feature</th>
              <th className="text-center p-2">Current</th>
              <th className="text-center p-2">A</th>
              <th className="text-center p-2">B</th>
              <th className="text-center p-2">C</th>
              <th className="text-center p-2">D</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-neutral-800">
              <td className="p-2">Custom Animations</td>
              <td className="text-center p-2">✅</td>
              <td className="text-center p-2">❌</td>
              <td className="text-center p-2">❌</td>
              <td className="text-center p-2">❌</td>
              <td className="text-center p-2">⚠️</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="p-2">30-Day Sprint</td>
              <td className="text-center p-2">✅</td>
              <td className="text-center p-2">❌</td>
              <td className="text-center p-2">⚠️</td>
              <td className="text-center p-2">✅</td>
              <td className="text-center p-2">✅</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="p-2">Video Streaming</td>
              <td className="text-center p-2">✅</td>
              <td className="text-center p-2">❌</td>
              <td className="text-center p-2">✅</td>
              <td className="text-center p-2">✅</td>
              <td className="text-center p-2">✅</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="p-2">Progress Tracking</td>
              <td className="text-center p-2">✅</td>
              <td className="text-center p-2">❌</td>
              <td className="text-center p-2">❌</td>
              <td className="text-center p-2">✅</td>
              <td className="text-center p-2">✅</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="p-2">Stripe Payments</td>
              <td className="text-center p-2">✅</td>
              <td className="text-center p-2">⚠️</td>
              <td className="text-center p-2">⚠️</td>
              <td className="text-center p-2">✅</td>
              <td className="text-center p-2">✅</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="p-2">Admin Dashboard</td>
              <td className="text-center p-2">✅</td>
              <td className="text-center p-2">❌</td>
              <td className="text-center p-2">⚠️</td>
              <td className="text-center p-2">✅</td>
              <td className="text-center p-2">✅</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="p-2">Email Automation</td>
              <td className="text-center p-2">✅</td>
              <td className="text-center p-2">❌</td>
              <td className="text-center p-2">✅</td>
              <td className="text-center p-2">✅</td>
              <td className="text-center p-2">✅</td>
            </tr>
            <tr>
              <td className="p-2">Maintenance Ease</td>
              <td className="text-center p-2">❌</td>
              <td className="text-center p-2">✅</td>
              <td className="text-center p-2">✅</td>
              <td className="text-center p-2">⚠️</td>
              <td className="text-center p-2">⚠️</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-xs text-neutral-500 mt-2">
        Legend: ✅ Full support | ⚠️ Partial/Alternative | ❌ Not available
      </p>

      <h2>Option C: Velo Enhanced (Recommended)</h2>

      <h3>Why This Option</h3>
      <ul>
        <li><strong>Functionality:</strong> Replicates 90% of current features</li>
        <li><strong>Maintainability:</strong> Client can make simple edits, developer for complex</li>
        <li><strong>Cost:</strong> Reasonable one-time and monthly fees</li>
        <li><strong>Future-Proof:</strong> Extensible for additional features</li>
        <li><strong>Handoff:</strong> Easier to train on than Next.js/React stack</li>
        <li><strong>Support:</strong> Wix provides platform-level support</li>
      </ul>

      <h3>What's Included</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="border border-neutral-800 rounded-lg p-4">
          <h4 className="text-base font-semibold mb-2">Database & Backend</h4>
          <ul className="text-sm text-neutral-400 space-y-1">
            <li>Wix Data Collections (Users, Sprint Progress, Leads)</li>
            <li>Server-side functions for APIs</li>
            <li>Third-party API integrations</li>
            <li>Custom authentication logic</li>
          </ul>
        </div>

        <div className="border border-neutral-800 rounded-lg p-4">
          <h4 className="text-base font-semibold mb-2">Frontend Features</h4>
          <ul className="text-sm text-neutral-400 space-y-1">
            <li>Custom member dashboard</li>
            <li>Sprint progress tracking UI</li>
            <li>Video player integration</li>
            <li>Dynamic content loading</li>
          </ul>
        </div>

        <div className="border border-neutral-800 rounded-lg p-4">
          <h4 className="text-base font-semibold mb-2">Admin Tools</h4>
          <ul className="text-sm text-neutral-400 space-y-1">
            <li>Lead management interface</li>
            <li>User administration panel</li>
            <li>Content management system</li>
            <li>Analytics dashboard</li>
          </ul>
        </div>

        <div className="border border-neutral-800 rounded-lg p-4">
          <h4 className="text-base font-semibold mb-2">Integrations</h4>
          <ul className="text-sm text-neutral-400 space-y-1">
            <li>Bunny Stream API (video)</li>
            <li>Stripe API (payments)</li>
            <li>SendGrid API (email)</li>
            <li>Google Analytics</li>
          </ul>
        </div>
      </div>

      <h3>Implementation Breakdown</h3>

      <div className="overflow-x-auto my-4">
        <table className="w-full text-sm border border-neutral-800">
          <thead>
            <tr className="border-b border-neutral-800">
              <th className="text-left p-2">Task</th>
              <th className="text-right p-2">Hours</th>
              <th className="text-right p-2">Cost @ $40/hr</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-neutral-800">
              <td className="p-2">Velo setup & architecture</td>
              <td className="text-right p-2">4</td>
              <td className="text-right p-2">$160</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="p-2">Database schema design</td>
              <td className="text-right p-2">3</td>
              <td className="text-right p-2">$120</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="p-2">Sprint progress system (Velo)</td>
              <td className="text-right p-2">8</td>
              <td className="text-right p-2">$320</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="p-2">Video integration (Bunny API)</td>
              <td className="text-right p-2">6</td>
              <td className="text-right p-2">$240</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="p-2">Custom member dashboard</td>
              <td className="text-right p-2">6</td>
              <td className="text-right p-2">$240</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="p-2">Admin panel (leads, users)</td>
              <td className="text-right p-2">8</td>
              <td className="text-right p-2">$320</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="p-2">Stripe API integration</td>
              <td className="text-right p-2">4</td>
              <td className="text-right p-2">$160</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="p-2">Email automation (SendGrid)</td>
              <td className="text-right p-2">4</td>
              <td className="text-right p-2">$160</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="p-2">Content migration (automated)</td>
              <td className="text-right p-2">6</td>
              <td className="text-right p-2">$240</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="p-2">Template customization</td>
              <td className="text-right p-2">5</td>
              <td className="text-right p-2">$200</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="p-2">Testing & debugging</td>
              <td className="text-right p-2">6</td>
              <td className="text-right p-2">$240</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="p-2">Documentation/handoff</td>
              <td className="text-right p-2">3</td>
              <td className="text-right p-2">$120</td>
            </tr>
            <tr className="font-semibold">
              <td className="p-2">Total</td>
              <td className="text-right p-2">45-60 hours</td>
              <td className="text-right p-2">$1,800-2,400</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Technical Limitations</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="border border-red-900/30 rounded-lg p-4">
          <h4 className="text-base font-semibold mb-2 text-red-400">What Wix Cannot Do</h4>
          <ul className="text-sm text-neutral-400 space-y-1">
            <li>Aceternity UI framework (React-specific)</li>
            <li>Next.js/React ecosystem</li>
            <li>Custom database (Turso)</li>
            <li>Git-based CMS workflow</li>
            <li>Vercel edge functions</li>
            <li>Full TypeScript compilation</li>
            <li>Unlimited NPM packages</li>
          </ul>
        </div>

        <div className="border border-green-900/30 rounded-lg p-4">
          <h4 className="text-base font-semibold mb-2 text-green-400">What Wix Handles Better</h4>
          <ul className="text-sm text-neutral-400 space-y-1">
            <li>Zero devops required</li>
            <li>Automatic SSL/security</li>
            <li>Automatic backups</li>
            <li>No framework updates</li>
            <li>24/7 platform support</li>
            <li>Enterprise uptime</li>
            <li>Automatic scaling</li>
          </ul>
        </div>
      </div>

      <h2>Monthly Cost Breakdown (Option C)</h2>

      <div className="overflow-x-auto my-4">
        <table className="w-full text-sm border border-neutral-800">
          <thead>
            <tr className="border-b border-neutral-800">
              <th className="text-left p-2">Service</th>
              <th className="text-right p-2">Monthly</th>
              <th className="text-left p-2">Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-neutral-800">
              <td className="p-2">Wix Business Unlimited</td>
              <td className="text-right p-2">$32</td>
              <td className="p-2 text-neutral-400">Platform hosting</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="p-2">Bunny Stream</td>
              <td className="text-right p-2">$10-30</td>
              <td className="p-2 text-neutral-400">50+ hours 1080p video</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="p-2">SendGrid</td>
              <td className="text-right p-2">$15-50</td>
              <td className="p-2 text-neutral-400">Email API (5K-15K emails/month)</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="p-2">Stripe fees</td>
              <td className="text-right p-2">Variable</td>
              <td className="p-2 text-neutral-400">2.9% + $0.30 per transaction</td>
            </tr>
            <tr className="font-semibold">
              <td className="p-2">Total</td>
              <td className="text-right p-2">$57-112</td>
              <td className="p-2 text-neutral-400">vs. $21 current</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-neutral-900 border border-yellow-900/30 rounded-lg p-4 my-6">
        <p className="text-sm text-yellow-400/90">
          <strong>Cost Increase:</strong> Wix migration increases monthly operating costs by $36-91 (2.7x-5.3x) compared to current infrastructure.
        </p>
      </div>

      <h2>Migration Timeline</h2>

      <h3>Option C: 2-3 Weeks</h3>
      <ul>
        <li><strong>Week 1:</strong> Setup, architecture, database design, backend APIs</li>
        <li><strong>Week 2:</strong> Frontend development, integrations, content migration</li>
        <li><strong>Week 3:</strong> Testing, debugging, polish, launch preparation</li>
      </ul>

      <h2>Recommendation Rationale</h2>

      <p><strong>Option C (Velo Enhanced)</strong> is recommended because:</p>
      <ul>
        <li>Achieves 90% feature parity with current site</li>
        <li>Costs 2.3-3x less than Option D with similar functionality</li>
        <li>Significantly more capable than Options A/B</li>
        <li>Client can self-service simple updates</li>
        <li>Wix provides platform support (reduces dev dependency)</li>
        <li>Extensible for future features</li>
        <li>Reasonable timeline (2-3 weeks vs. 3-4 days for basic or 3-4 weeks for premium)</li>
      </ul>

      <h2>Next Steps</h2>

      <p>To proceed with Wix migration:</p>
      <ol>
        <li>Select option (A, B, C, or D) based on budget and requirements</li>
        <li>Approve budget (one-time + monthly costs)</li>
        <li>Create Wix account and grant access</li>
        <li>Provide content export and brand assets</li>
        <li>Schedule 2-3 hour planning session</li>
        <li>Coordinate launch timeline</li>
      </ol>

      <h2>Resources</h2>

      <div className="space-y-4 my-6">
        <div className="border border-neutral-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Full Scoping Document</h3>
          <p className="text-sm text-neutral-400 mb-2">
            Comprehensive 300+ line analysis with detailed breakdowns, code examples, and appendices.
          </p>
          <Link
            href="https://github.com/your-repo/docs/1_planning/project_scoping/wix-migration-estimate.md"
            className="text-sm text-primary hover:underline"
            target="_blank"
          >
            View full document →
          </Link>
        </div>

        <div className="border border-neutral-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Wix Velo Documentation</h3>
          <p className="text-sm text-neutral-400 mb-2">
            Official Wix developer documentation for custom code and APIs.
          </p>
          <Link
            href="https://www.wix.com/velo/reference"
            className="text-sm text-primary hover:underline"
            target="_blank"
          >
            Wix Velo docs →
          </Link>
        </div>

        <div className="border border-neutral-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Wix Pricing</h3>
          <p className="text-sm text-neutral-400 mb-2">
            Current Wix Business plan pricing and features comparison.
          </p>
          <Link
            href="https://www.wix.com/upgrade/website"
            className="text-sm text-primary hover:underline"
            target="_blank"
          >
            View Wix pricing →
          </Link>
        </div>
      </div>

      <div className="bg-neutral-900 border border-primary/30 rounded-lg p-4 mt-8">
        <p className="text-sm text-neutral-300">
          <strong>Business Continuity Assessment:</strong> Wix provides adequate fallback with 90% functionality at 2-5x monthly cost increase. Recommended to implement Option C within 2-3 weeks for peace of mind.
        </p>
      </div>
    </DocsPage>
  );
}
