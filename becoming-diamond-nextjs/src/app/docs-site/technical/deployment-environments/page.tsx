/* eslint-disable react/no-unescaped-entities */
import { DocsPage } from "@/components/docs/docs-page";
import Link from "next/link";

export default function DeploymentEnvironmentsPage() {
  return (
    <DocsPage
      title="Multi-Environment Deployment"
      description="Localhost, staging, and production environment setup"
    >
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6">
        <p className="text-sm text-neutral-400 mb-2">
          <strong>Executive Summary:</strong> Three deployment options available from
          $220-580 one-time cost, then $21/month ongoing.
        </p>
        <p className="text-sm text-neutral-400 mb-2">
          <strong>Recommended:</strong> Option B - Stable Foundation ($260-340)
        </p>
        <p className="text-sm text-neutral-400">
          First invoice includes initial scoping and research ($80).
        </p>
      </div>

      <h2>Three Environment Setup</h2>
      <p>
        Establishing separate localhost, staging, and production environments enables
        safe deployments with testing before code reaches live users.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        <div className="border border-neutral-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Localhost</h3>
          <p className="text-sm text-neutral-400">
            Developer's computer for testing and development work. Uses test payment systems.
          </p>
        </div>

        <div className="border border-neutral-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Staging</h3>
          <p className="text-sm text-neutral-400">
            staging.becomingdiamond.com - Final testing before launch. Team preview and approval.
          </p>
        </div>

        <div className="border border-neutral-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Production</h3>
          <p className="text-sm text-neutral-400">
            becomingdiamond.com - Live site with real users and real payment processing.
          </p>
        </div>
      </div>

      <h2>Implementation Options</h2>

      <div className="space-y-4 my-6">
        <div className="border border-neutral-800 rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold">Option A: Quick Start</h3>
            <span className="text-sm text-neutral-400">$220-260</span>
          </div>
          <p className="text-sm text-neutral-400 mb-2">
            Basic automated deployment using Vercel's built-in features.
          </p>
          <div className="text-sm space-y-1">
            <p><strong>Timeline:</strong> Half day to one day</p>
            <p><strong>Risk:</strong> Medium (some technical issues remain)</p>
            <p><strong>Best for:</strong> Immediate staging need, limited budget</p>
          </div>
        </div>

        <div className="border border-primary/30 bg-neutral-900 rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold">Option B: Stable Foundation ⭐ Recommended</h3>
            <span className="text-sm text-neutral-300">$260-340</span>
          </div>
          <p className="text-sm text-neutral-400 mb-2">
            Resolves technical issues and sets up automated deployment. All systems verified working.
          </p>
          <div className="text-sm space-y-1">
            <p><strong>Timeline:</strong> 1-2 days</p>
            <p><strong>Risk:</strong> Low</p>
            <p><strong>Best for:</strong> Reliable system, standard business needs, best value</p>
          </div>
        </div>

        <div className="border border-neutral-800 rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold">Option C: Enterprise Grade</h3>
            <span className="text-sm text-neutral-400">$420-580</span>
          </div>
          <p className="text-sm text-neutral-400 mb-2">
            Full automation with safety checks. Tests run automatically before deployment.
          </p>
          <div className="text-sm space-y-1">
            <p><strong>Timeline:</strong> 3-4 days</p>
            <p><strong>Risk:</strong> Very Low</p>
            <p><strong>Best for:</strong> Maximum safety, multiple developers, compliance requirements</p>
          </div>
        </div>
      </div>

      <h2>Cost Breakdown</h2>

      <h3>One-Time Implementation Costs</h3>
      <div className="overflow-x-auto my-4">
        <table className="w-full text-sm border border-neutral-800">
          <thead>
            <tr className="border-b border-neutral-800">
              <th className="text-left p-2">Item</th>
              <th className="text-right p-2">Option A</th>
              <th className="text-right p-2">Option B</th>
              <th className="text-right p-2">Option C</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-neutral-800">
              <td className="p-2">Initial scoping and research</td>
              <td className="text-right p-2">$80</td>
              <td className="text-right p-2">$80</td>
              <td className="text-right p-2">$80</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="p-2">Implementation hours @ $40/hr</td>
              <td className="text-right p-2">$120-160</td>
              <td className="text-right p-2">$160-240</td>
              <td className="text-right p-2">$320-480</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="p-2">Vercel reimbursement (1 month)</td>
              <td className="text-right p-2">$20</td>
              <td className="text-right p-2">$20</td>
              <td className="text-right p-2">$20</td>
            </tr>
            <tr>
              <td className="p-2 font-semibold">Total First Invoice</td>
              <td className="text-right p-2 font-semibold">$220-260</td>
              <td className="text-right p-2 font-semibold">$260-340</td>
              <td className="text-right p-2 font-semibold">$420-580</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Ongoing Monthly Costs (All Options)</h3>
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
              <td className="p-2">Vercel Pro hosting</td>
              <td className="text-right p-2">$20</td>
              <td className="p-2 text-neutral-400">Billed to client credit card</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="p-2">Domain renewal</td>
              <td className="text-right p-2">$1.25</td>
              <td className="p-2 text-neutral-400">Annual billing ($15/year)</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="p-2">GitHub</td>
              <td className="text-right p-2">$0</td>
              <td className="p-2 text-neutral-400">Free tier sufficient</td>
            </tr>
            <tr>
              <td className="p-2 font-semibold">Total Monthly</td>
              <td className="text-right p-2 font-semibold">$21</td>
              <td className="p-2 text-neutral-400">Auto-billed</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 my-6">
        <p className="text-sm text-neutral-400">
          <strong>Annual Infrastructure Cost:</strong> $255/year (no development costs after initial setup)
        </p>
      </div>

      <h2>Implementation Timeline</h2>

      <h3>Option A Timeline</h3>
      <ul>
        <li>Day 1 (morning): Configure environments</li>
        <li>Day 1 (afternoon): Test and document</li>
        <li><strong>Total: Half day to one day</strong></li>
      </ul>

      <h3>Option B Timeline (Recommended)</h3>
      <ul>
        <li>Day 1: Resolve technical issues</li>
        <li>Day 2 (morning): Configure environments</li>
        <li>Day 2 (afternoon): Quality assurance</li>
        <li><strong>Total: 1-2 days</strong></li>
      </ul>

      <h3>Option C Timeline</h3>
      <ul>
        <li>Day 1: Resolve technical issues</li>
        <li>Day 2: Configure environments and automation</li>
        <li>Day 3: Testing and approval gates</li>
        <li>Day 4: Documentation and training</li>
        <li><strong>Total: 3-4 days</strong></li>
      </ul>

      <h2>Recommendation Rationale</h2>

      <p>
        <strong>Option B (Stable Foundation)</strong> is recommended because:
      </p>
      <ul>
        <li>Fixes existing issues before they cause problems</li>
        <li>Only $40-80 more than Option A</li>
        <li>Significantly more reliable</li>
        <li>Best value for investment</li>
        <li>Can upgrade to Option C later if needed</li>
      </ul>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 my-6">
        <p className="text-sm text-neutral-400">
          <strong>Upgrade Path:</strong> Option B can be upgraded to Option C later for
          additional $160-240 (4-6 hours development).
        </p>
      </div>

      <h2>Decision Criteria</h2>

      <h3>Choose Option A if:</h3>
      <ul>
        <li>Need staging environment immediately (this week)</li>
        <li>Minimum budget required ($220-260)</li>
        <li>Comfortable with some risk</li>
        <li>Plan to invest in improvements later</li>
      </ul>

      <h3>Choose Option B if:</h3>
      <ul>
        <li>Want reliable, stable system</li>
        <li>Can wait 1-2 days for implementation</li>
        <li>Prefer proactive issue resolution</li>
        <li>Standard business quality expectations</li>
        <li>Best overall value ($260-340)</li>
      </ul>

      <h3>Choose Option C if:</h3>
      <ul>
        <li>Maximum quality and safety required</li>
        <li>Multiple developers on team</li>
        <li>Have compliance or audit requirements</li>
        <li>Budget allows for premium features ($420-580)</li>
      </ul>

      <h2>Approval Requirements</h2>

      <p>To proceed with implementation:</p>
      <ol>
        <li>Select approach (A, B, or C)</li>
        <li>Approve budget:
          <ul className="ml-6 mt-1">
            <li>First invoice: $220-580 (includes initial scoping and research)</li>
            <li>Monthly billing: $21 (ongoing)</li>
          </ul>
        </li>
        <li>Provide Vercel billing information (credit card)</li>
        <li>Confirm timeline expectations</li>
      </ol>

      <h2>Resources</h2>

      <div className="space-y-4 my-6">
        <div className="border border-neutral-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Full Scoping Document</h3>
          <p className="text-sm text-neutral-400 mb-2">
            Complete project scoping with detailed analysis, risk assessment, and implementation plans.
          </p>
          <Link
            href="https://github.com/your-repo/docs/1_planning/project_scoping/deployment-environments-setup.md"
            className="text-sm text-primary hover:underline"
            target="_blank"
          >
            View full document →
          </Link>
        </div>

        <div className="border border-neutral-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Vercel Documentation</h3>
          <p className="text-sm text-neutral-400 mb-2">
            Official Vercel deployment and environment management documentation.
          </p>
          <Link
            href="https://vercel.com/docs/deployments/environments"
            className="text-sm text-primary hover:underline"
            target="_blank"
          >
            Vercel docs →
          </Link>
        </div>
      </div>

      <div className="bg-neutral-900 border border-primary/30 rounded-lg p-4 mt-8">
        <p className="text-sm text-neutral-300">
          <strong>Next Steps:</strong> Review options above, select preferred approach
          based on budget and timeline, then approve to begin implementation within 24 hours.
        </p>
      </div>
    </DocsPage>
  );
}
