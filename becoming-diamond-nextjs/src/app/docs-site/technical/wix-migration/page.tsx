/* eslint-disable react/no-unescaped-entities */
import { DocsPage } from "@/components/docs/docs-page";

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
          Wix can replicate 45-95% of features depending on tier, but loses Aceternity UI animations.
        </p>
        <p className="text-sm text-neutral-400">
          Monthly costs increase 2-9x vs. current $21/month.
        </p>
      </div>

      <h2>Current Site Inventory</h2>

      <div className="space-y-2 mb-6 text-sm">
        <p><strong>Public:</strong> Landing page, blog (3 posts), book sales, collective/program pages, docs (60+ pages), legal pages</p>
        <p><strong>Members:</strong> Authentication (magic link, OAuth), 30-day sprint (30 videos), profiles, progress tracking, admin portal</p>
        <p><strong>Technical:</strong> NextAuth v5, Stripe, Bunny Stream (planned), Gmail SMTP, Turso DB, Decap CMS</p>
      </div>

      <h2>Migration Options Overview</h2>

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
              <td className="p-2">A: Basic Presence</td>
              <td className="text-right p-2">$580</td>
              <td className="text-right p-2">$27</td>
              <td className="p-2">3-4 days</td>
              <td className="p-2 text-neutral-400">45%</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="p-2">B: Enhanced Integration</td>
              <td className="text-right p-2">$1,280</td>
              <td className="text-right p-2">$52-112</td>
              <td className="p-2">1-1.5 weeks</td>
              <td className="p-2 text-neutral-400">65%</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="p-2">C: Velo Enhanced</td>
              <td className="text-right p-2">$1,800-2,400</td>
              <td className="text-right p-2">$57-112</td>
              <td className="p-2">2-3 weeks</td>
              <td className="p-2">90%</td>
            </tr>
            <tr>
              <td className="p-2">D: Premium Build</td>
              <td className="text-right p-2">$2,800-3,600</td>
              <td className="text-right p-2">$100-205</td>
              <td className="p-2">3-4 weeks</td>
              <td className="p-2">95%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Option Details</h2>

      <div className="space-y-4 my-6">
        <div className="border border-neutral-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Option A: Basic Presence ($580, 3-4 days)</h3>
          <p className="text-sm text-neutral-400 mb-2">
            <strong>Scope:</strong> Landing page (template), blog (Wix app), book sales (Wix eCommerce), contact forms, basic members, sprint as text (no video), legal pages
          </p>
          <p className="text-sm text-neutral-400 mb-2">
            <strong>Excluded:</strong> Custom animations, video hosting, progress tracking, admin dashboard, OAuth, automations
          </p>
          <p className="text-sm text-neutral-400">
            <strong>Implementation:</strong> Wix ADI/template, built-in apps (Blog, eCommerce, Members), manual content entry
          </p>
        </div>

        <div className="border border-neutral-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Option B: Enhanced Integration ($1,280, 1-1.5 weeks)</h3>
          <p className="text-sm text-neutral-400 mb-2">
            <strong>Additional vs. A:</strong> Premium template, video integration (Wix Video), email automation, member roles, analytics, SEO optimization, third-party apps
          </p>
          <p className="text-sm text-neutral-400">
            <strong>Implementation:</strong> Premium template customization, Wix Video/Vimeo app, Wix Automations, member permissions, app marketplace integrations
          </p>
        </div>

        <div className="border border-neutral-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Option C: Velo Enhanced ($1,800-2,400, 2-3 weeks)</h3>
          <p className="text-sm text-neutral-400 mb-2">
            <strong>Additional vs. B:</strong> Sprint progress tracking (database), dynamic content loading, admin panel for leads, Stripe direct integration, custom video player with progress, database-driven content, API integrations (Bunny Stream, SendGrid), custom auth flows
          </p>
          <p className="text-sm text-neutral-400 mb-2">
            <strong>Implementation:</strong> Velo dev mode, Wix Data Collections (Users, Sprint Progress, Leads), custom page templates, server-side functions, third-party API integrations
          </p>
          <p className="text-sm text-neutral-400 mb-2">
            <strong>Features Achieved:</strong> Full sprint progress, video streaming with token auth, custom admin dashboard, lead management, automated emails, payment processing, user profiles with stats
          </p>
          <p className="text-sm text-neutral-400">
            <strong>Still Lost:</strong> Aceternity UI animations (3D globe, spotlight), some advanced UI interactions, self-hosted infrastructure, Git-based CMS, Decap CMS interface
          </p>
        </div>

        <div className="border border-neutral-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Option D: Premium Build ($2,800-3,600, 3-4 weeks)</h3>
          <p className="text-sm text-neutral-400 mb-2">
            <strong>Additional vs. C:</strong> Custom animations (GSAP, Lottie), advanced UI framework (Wix Blocks), multi-language support, advanced analytics dashboard, CRM integration, marketing automation, A/B testing, performance optimization, caching strategies
          </p>
          <p className="text-sm text-neutral-400 mb-2">
            <strong>Implementation:</strong> Advanced Velo + Wix Blocks, animation libraries (GSAP), advanced state management, Redis caching (via API), Elasticsearch integration, monitoring/logging, custom CMS interface
          </p>
          <p className="text-sm text-neutral-400 mb-2">
            <strong>Features Achieved:</strong> Near-complete parity, custom animations (not Aceternity but close), advanced admin tools, marketing automation, full API integrations, performance optimization
          </p>
          <p className="text-sm text-neutral-400">
            <strong>Cannot Match:</strong> Exact Aceternity UI, self-hosted infrastructure control, Next.js/React ecosystem, Vercel edge functions, full TypeScript compilation
          </p>
        </div>
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

      <p className="text-xs text-neutral-500 mt-2 mb-6">
        Legend: ✅ Full support | ⚠️ Partial/Alternative | ❌ Not available
      </p>

      <h2>Cost Breakdown by Option</h2>

      <div className="space-y-6 my-6">
        <div>
          <h3 className="text-base font-semibold mb-2">Option A</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-neutral-800">
              <tbody>
                <tr className="border-b border-neutral-800">
                  <td className="p-2">Site setup & template</td>
                  <td className="text-right p-2">2 hrs</td>
                  <td className="text-right p-2">$80</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="p-2">Content migration</td>
                  <td className="text-right p-2">4 hrs</td>
                  <td className="text-right p-2">$160</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="p-2">eCommerce, members, forms, testing, docs</td>
                  <td className="text-right p-2">8.5 hrs</td>
                  <td className="text-right p-2">$340</td>
                </tr>
                <tr className="font-semibold">
                  <td className="p-2">Total</td>
                  <td className="text-right p-2">14.5 hrs</td>
                  <td className="text-right p-2">$580</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold mb-2">Option B</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-neutral-800">
              <tbody>
                <tr className="border-b border-neutral-800">
                  <td className="p-2">Premium template & content migration</td>
                  <td className="text-right p-2">9 hrs</td>
                  <td className="text-right p-2">$360</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="p-2">Video integration & upload</td>
                  <td className="text-right p-2">4 hrs</td>
                  <td className="text-right p-2">$160</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="p-2">eCommerce, members, automation, analytics, apps</td>
                  <td className="text-right p-2">14 hrs</td>
                  <td className="text-right p-2">$560</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="p-2">Testing & documentation</td>
                  <td className="text-right p-2">5 hrs</td>
                  <td className="text-right p-2">$200</td>
                </tr>
                <tr className="font-semibold">
                  <td className="p-2">Total</td>
                  <td className="text-right p-2">32 hrs</td>
                  <td className="text-right p-2">$1,280</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold mb-2">Option C</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-neutral-800">
              <tbody>
                <tr className="border-b border-neutral-800">
                  <td className="p-2">Velo setup, architecture, database schema</td>
                  <td className="text-right p-2">7 hrs</td>
                  <td className="text-right p-2">$280</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="p-2">Sprint progress system</td>
                  <td className="text-right p-2">8 hrs</td>
                  <td className="text-right p-2">$320</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="p-2">Video integration (Bunny API)</td>
                  <td className="text-right p-2">6 hrs</td>
                  <td className="text-right p-2">$240</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="p-2">Member dashboard & admin panel</td>
                  <td className="text-right p-2">14 hrs</td>
                  <td className="text-right p-2">$560</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="p-2">Stripe & email API integration</td>
                  <td className="text-right p-2">8 hrs</td>
                  <td className="text-right p-2">$320</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="p-2">Content migration, template, testing, docs</td>
                  <td className="text-right p-2">20 hrs</td>
                  <td className="text-right p-2">$800</td>
                </tr>
                <tr className="font-semibold">
                  <td className="p-2">Total</td>
                  <td className="text-right p-2">45-60 hrs</td>
                  <td className="text-right p-2">$1,800-2,400</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold mb-2">Option D</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-neutral-800">
              <tbody>
                <tr className="border-b border-neutral-800">
                  <td className="p-2">All Option C work</td>
                  <td className="text-right p-2">45-60 hrs</td>
                  <td className="text-right p-2">$1,800-2,400</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="p-2">Custom animation library (GSAP)</td>
                  <td className="text-right p-2">8 hrs</td>
                  <td className="text-right p-2">$320</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="p-2">Wix Blocks components</td>
                  <td className="text-right p-2">10 hrs</td>
                  <td className="text-right p-2">$400</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="p-2">Advanced integrations, performance, CRM, testing, polish</td>
                  <td className="text-right p-2">32 hrs</td>
                  <td className="text-right p-2">$1,280</td>
                </tr>
                <tr className="font-semibold">
                  <td className="p-2">Total</td>
                  <td className="text-right p-2">70-90 hrs</td>
                  <td className="text-right p-2">$2,800-3,600</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <h2>Technical Limitations</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="border border-red-900/30 rounded-lg p-4">
          <h4 className="text-base font-semibold mb-2 text-red-400">What Wix Cannot Do</h4>
          <ul className="text-sm text-neutral-400 space-y-1">
            <li>Aceternity UI framework (React-specific)</li>
            <li>Next.js/React ecosystem</li>
            <li>Custom database (Turso)</li>
            <li>Git-based CMS workflow (Decap)</li>
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

      <h2>Monthly Cost Comparison</h2>

      <div className="overflow-x-auto my-4">
        <table className="w-full text-sm border border-neutral-800">
          <thead>
            <tr className="border-b border-neutral-800">
              <th className="text-left p-2">Component</th>
              <th className="text-right p-2">Option A</th>
              <th className="text-right p-2">Option B</th>
              <th className="text-right p-2">Option C</th>
              <th className="text-right p-2">Option D</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-neutral-800">
              <td className="p-2">Wix Platform</td>
              <td className="text-right p-2">$27</td>
              <td className="text-right p-2">$32</td>
              <td className="text-right p-2">$32</td>
              <td className="text-right p-2">$45</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="p-2">Video (Wix/Bunny)</td>
              <td className="text-right p-2">-</td>
              <td className="text-right p-2">$10-30</td>
              <td className="text-right p-2">$10-30</td>
              <td className="text-right p-2">$10-30</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="p-2">Email (SendGrid)</td>
              <td className="text-right p-2">-</td>
              <td className="text-right p-2">-</td>
              <td className="text-right p-2">$15-50</td>
              <td className="text-right p-2">$15-50</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="p-2">Third-party Apps</td>
              <td className="text-right p-2">-</td>
              <td className="text-right p-2">$10-50</td>
              <td className="text-right p-2">-</td>
              <td className="text-right p-2">$20-50</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="p-2">Marketing/Monitoring</td>
              <td className="text-right p-2">-</td>
              <td className="text-right p-2">-</td>
              <td className="text-right p-2">-</td>
              <td className="text-right p-2">$10-30</td>
            </tr>
            <tr className="font-semibold">
              <td className="p-2">Total Monthly</td>
              <td className="text-right p-2">$27</td>
              <td className="text-right p-2">$52-112</td>
              <td className="text-right p-2">$57-112</td>
              <td className="text-right p-2">$100-205</td>
            </tr>
            <tr>
              <td className="p-2 text-neutral-400">vs. Current ($21)</td>
              <td className="text-right p-2 text-neutral-400">+$6 (1.3x)</td>
              <td className="text-right p-2 text-neutral-400">+$31-91 (2.5-5.3x)</td>
              <td className="text-right p-2 text-neutral-400">+$36-91 (2.7-5.3x)</td>
              <td className="text-right p-2 text-neutral-400">+$79-184 (4.8-9.8x)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Migration Process</h2>

      <ol className="space-y-2 text-sm">
        <li><strong>Planning:</strong> Content audit, feature prioritization, design mockups, database schema (C/D), API planning (C/D)</li>
        <li><strong>Development:</strong> Template/Velo setup, database creation, API development (C/D), component building, integrations</li>
        <li><strong>Content Migration:</strong> Manual entry (A/B) or scripted import (C/D), image/video upload, blog posts, legal pages</li>
        <li><strong>Testing:</strong> Functionality, payments, email delivery, mobile/browser compatibility, load testing (C/D)</li>
        <li><strong>Launch:</strong> DNS config, QA checklist, soft launch, production, monitoring</li>
        <li><strong>Handoff:</strong> Documentation, training, admin access transfer</li>
      </ol>

      <h2>Next Steps</h2>

      <ol className="space-y-2 text-sm">
        <li>Select option based on budget and feature requirements</li>
        <li>Approve one-time and monthly costs</li>
        <li>Create Wix account and grant developer access</li>
        <li>Provide content export, video files, brand assets</li>
        <li>Schedule 2-3 hour planning session</li>
        <li>Coordinate launch timeline</li>
      </ol>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mt-8">
        <p className="text-sm text-neutral-400">
          <strong>Note:</strong> All options include $80 for this research and documentation (2 hours @ $40/hr).
        </p>
      </div>
    </DocsPage>
  );
}
