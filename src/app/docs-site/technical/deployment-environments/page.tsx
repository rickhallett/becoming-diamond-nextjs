/* eslint-disable react/no-unescaped-entities */
import { DocsPage } from "@/components/docs/docs-page";
import Link from "next/link";

export default function DeploymentEnvironmentsPage() {
  return (
    <DocsPage
      title="Multi-Environment Deployment"
      description="Production, staging, and development environment architecture"
    >
      <div className="bg-neutral-900 border border-primary/30 rounded-lg p-4 mb-6">
        <p className="text-sm text-neutral-300 mb-2">
          <strong>Status:</strong> Fully Implemented (December 2025)
        </p>
        <p className="text-sm text-neutral-400">
          Three-environment deployment pipeline with automated deployments via Vercel
          native Git integration. All environments verified and operational.
        </p>
      </div>

      <h2>Environment Architecture</h2>
      <p>
        The platform uses three separate environments for safe development and deployment.
        Each environment has its own OAuth clients, database, and configuration.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        <div className="border border-neutral-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Development</h3>
          <p className="text-sm text-primary mb-2">http://localhost:3003</p>
          <p className="text-sm text-neutral-400 mb-3">
            Local development environment for testing and debugging before pushing to staging.
          </p>
          <div className="text-xs space-y-1">
            <p><strong>Database:</strong> becoming-diamond-staging</p>
            <p><strong>OAuth:</strong> Development client</p>
            <p><strong>Payments:</strong> Stripe test mode</p>
          </div>
        </div>

        <div className="border border-neutral-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Staging</h3>
          <p className="text-sm text-primary mb-2">https://staging.becomingdiamond.com</p>
          <p className="text-sm text-neutral-400 mb-3">
            Pre-production testing environment. Deploys automatically from staging branch.
          </p>
          <div className="text-xs space-y-1">
            <p><strong>Database:</strong> becoming-diamond-staging</p>
            <p><strong>OAuth:</strong> Staging-specific client</p>
            <p><strong>Payments:</strong> Stripe test mode</p>
          </div>
        </div>

        <div className="border border-primary/30 bg-neutral-900 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Production</h3>
          <p className="text-sm text-primary mb-2">https://www.becomingdiamond.com</p>
          <p className="text-sm text-neutral-400 mb-3">
            Live production environment with real users. Deploys automatically from main branch.
          </p>
          <div className="text-xs space-y-1">
            <p><strong>Database:</strong> becoming-diamond-production</p>
            <p><strong>OAuth:</strong> Production-specific client</p>
            <p><strong>Payments:</strong> Stripe live mode</p>
          </div>
        </div>
      </div>

      <h2>Deployment Pipeline</h2>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 my-6">
        <h3 className="text-lg font-semibold mb-3">Automated Git Deployment</h3>
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-neutral-300 font-medium">Staging Deployment</p>
            <code className="text-xs text-neutral-400">
              git push origin staging → Vercel deploys to staging.becomingdiamond.com
            </code>
          </div>
          <div>
            <p className="text-neutral-300 font-medium">Production Deployment</p>
            <code className="text-xs text-neutral-400">
              git push origin main → Vercel deploys to www.becomingdiamond.com
            </code>
          </div>
        </div>
      </div>

      <h3>Deployment Method</h3>
      <p>
        The platform uses <strong>Vercel Native Git Integration</strong> as the primary
        deployment method. This provides:
      </p>
      <ul>
        <li>Automatic deployments on git push</li>
        <li>Fast deployment times (~1 minute)</li>
        <li>Preview deployments for feature branches</li>
        <li>Built-in rollback capabilities</li>
        <li>Zero-downtime deployments</li>
      </ul>

      <h2>OAuth Configuration</h2>

      <p>
        Each environment has its own Google OAuth 2.0 client to ensure redirect URIs
        match exactly and prevent authentication errors.
      </p>

      <div className="overflow-x-auto my-4">
        <table className="w-full text-sm border border-neutral-800">
          <thead>
            <tr className="border-b border-neutral-800">
              <th className="text-left p-2">Environment</th>
              <th className="text-left p-2">Client ID</th>
              <th className="text-left p-2">Redirect URI</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-neutral-800">
              <td className="p-2">Development</td>
              <td className="p-2 font-mono text-xs">307181021676-e9ig7opv0hf20ohutre91cga8462i1bi</td>
              <td className="p-2 text-neutral-400">http://localhost:3003/api/auth/callback/google</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="p-2">Staging</td>
              <td className="p-2 font-mono text-xs">307181021676-jpq6a199e39po5uaomqbqqa81dhit4rt</td>
              <td className="p-2 text-neutral-400">https://staging.becomingdiamond.com/api/auth/callback/google</td>
            </tr>
            <tr>
              <td className="p-2">Production</td>
              <td className="p-2 font-mono text-xs">307181021676-m8l4b0dudkk59sn5ffej4s74ckse80sd</td>
              <td className="p-2 text-neutral-400">https://www.becomingdiamond.com/api/auth/callback/google</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 my-6">
        <p className="text-sm text-neutral-400">
          <strong>Google Cloud Project:</strong> becoming-diamond-master (307181021676)
        </p>
        <p className="text-sm text-neutral-400 mt-2">
          All OAuth clients are managed in the{" "}
          <Link
            href="https://console.cloud.google.com/apis/credentials?project=becoming-diamond-master"
            className="text-primary hover:underline"
            target="_blank"
          >
            Google Cloud Console
          </Link>
        </p>
      </div>

      <h2>Environment Variables</h2>

      <p>
        Each environment requires specific configuration variables. These are managed
        in Vercel environment settings and local .env files.
      </p>

      <h3>Required Variables (All Environments)</h3>
      <ul>
        <li><code>NEXTAUTH_URL</code> - Environment-specific base URL</li>
        <li><code>NEXTAUTH_SECRET</code> - Encryption secret</li>
        <li><code>AUTH_GOOGLE_ID</code> - Environment-specific OAuth client ID</li>
        <li><code>AUTH_GOOGLE_SECRET</code> - OAuth client secret</li>
        <li><code>TURSO_DATABASE_URL</code> - Environment-specific database URL</li>
        <li><code>TURSO_AUTH_TOKEN</code> - Database authentication token</li>
        <li><code>ADMIN_EMAIL</code> - Admin user email (support@becomingdiamond.com)</li>
        <li><code>GMAIL_USER</code> / <code>GMAIL_APP_PASSWORD</code> - Magic link authentication</li>
      </ul>

      <h3>Managing Environment Variables</h3>
      <ol>
        <li>Local development: Edit <code>.env.local</code></li>
        <li>Staging/Production: Update via Vercel dashboard or CLI</li>
        <li>Redeploy after variable changes to apply</li>
      </ol>

      <h2>Deployment Workflow</h2>

      <h3>Standard Feature Deployment</h3>
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 my-4">
        <ol className="space-y-2 text-sm">
          <li>1. Develop and test locally on <code>feature/*</code> branch</li>
          <li>2. Merge to <code>staging</code> branch</li>
          <li>3. Push to GitHub: <code>git push origin staging</code></li>
          <li>4. Vercel auto-deploys to staging.becomingdiamond.com</li>
          <li>5. Test on staging environment</li>
          <li>6. Merge <code>staging</code> to <code>main</code></li>
          <li>7. Push to GitHub: <code>git push origin main</code></li>
          <li>8. Vercel auto-deploys to www.becomingdiamond.com</li>
        </ol>
      </div>

      <h3>Hotfix Workflow</h3>
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 my-4">
        <ol className="space-y-2 text-sm">
          <li>1. Create <code>hotfix/*</code> branch from <code>main</code></li>
          <li>2. Make critical fix and test locally</li>
          <li>3. Merge to <code>main</code> and push</li>
          <li>4. Backport to <code>staging</code> branch</li>
        </ol>
      </div>

      <h2>Monitoring and Logs</h2>

      <div className="space-y-4 my-6">
        <div className="border border-neutral-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Vercel Deployments</h3>
          <p className="text-sm text-neutral-400 mb-2">
            View deployment status, build logs, and rollback options.
          </p>
          <Link
            href="https://vercel.com/team-diamond-9c4b1eca/becoming-diamond"
            className="text-sm text-primary hover:underline"
            target="_blank"
          >
            View Vercel Dashboard →
          </Link>
        </div>

        <div className="border border-neutral-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Axiom Logging</h3>
          <p className="text-sm text-neutral-400 mb-2">
            Real-time application logs, error tracking, and analytics.
          </p>
          <div className="text-xs space-y-1 mt-2">
            <p><strong>Staging:</strong> becoming-diamond-staging dataset</p>
            <p><strong>Production:</strong> becoming-diamond-prod dataset</p>
          </div>
        </div>
      </div>

      <h2>Infrastructure Costs</h2>

      <div className="overflow-x-auto my-4">
        <table className="w-full text-sm border border-neutral-800">
          <thead>
            <tr className="border-b border-neutral-800">
              <th className="text-left p-2">Service</th>
              <th className="text-right p-2">Monthly Cost</th>
              <th className="text-left p-2">Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-neutral-800">
              <td className="p-2">Vercel Pro</td>
              <td className="text-right p-2">$20</td>
              <td className="p-2 text-neutral-400">Hosting and deployments</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="p-2">Domain (becomingdiamond.com)</td>
              <td className="text-right p-2">$1.25</td>
              <td className="p-2 text-neutral-400">Annual billing ($15/year)</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="p-2">GitHub</td>
              <td className="text-right p-2">$0</td>
              <td className="p-2 text-neutral-400">Free tier</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="p-2">Turso Database</td>
              <td className="text-right p-2">$0</td>
              <td className="p-2 text-neutral-400">Free tier (8GB storage)</td>
            </tr>
            <tr>
              <td className="p-2 font-semibold">Total</td>
              <td className="text-right p-2 font-semibold">$21</td>
              <td className="p-2 text-neutral-400">Auto-billed monthly</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Documentation Resources</h2>

      <div className="space-y-4 my-6">
        <div className="border border-neutral-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Deployment Quick Start</h3>
          <p className="text-sm text-neutral-400 mb-2">
            Quick reference guide for common deployment tasks and workflows.
          </p>
          <Link
            href="/docs-site/technical/deployment"
            className="text-sm text-primary hover:underline"
          >
            View guide →
          </Link>
        </div>

        <div className="border border-neutral-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">CI/CD Pipeline Documentation</h3>
          <p className="text-sm text-neutral-400 mb-2">
            Complete documentation for automated deployment pipeline and troubleshooting.
          </p>
          <Link
            href="https://github.com/rickhallett/becoming-diamond-nextjs/blob/main/docs/cicd-pipeline.md"
            className="text-sm text-primary hover:underline"
            target="_blank"
          >
            View on GitHub →
          </Link>
        </div>

        <div className="border border-neutral-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">OAuth Setup Instructions</h3>
          <p className="text-sm text-neutral-400 mb-2">
            Detailed guide for OAuth configuration and environment-specific client setup.
          </p>
          <Link
            href="https://github.com/rickhallett/becoming-diamond-nextjs/blob/main/docs/oauth-setup-instructions.md"
            className="text-sm text-primary hover:underline"
            target="_blank"
          >
            View on GitHub →
          </Link>
        </div>
      </div>

      <div className="bg-neutral-900 border border-primary/30 rounded-lg p-4 mt-8">
        <p className="text-sm text-neutral-300">
          <strong>Deployment Status:</strong> All environments operational and verified.
          OAuth migration completed December 29, 2025. System ready for production use.
        </p>
      </div>
    </DocsPage>
  );
}
