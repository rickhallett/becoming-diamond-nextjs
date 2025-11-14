import { DocsPage } from "@/components/docs/docs-page";
import Link from "next/link";

export default function UserGettingStartedPage() {
  return (
    <DocsPage
      title="Getting Started"
      description="Your first steps with the Becoming Diamond platform"
    >
      <h2>Logging In</h2>
      <p>
        The platform uses NextAuth for secure authentication. You can log in using:
      </p>
      <ul>
        <li><strong>Magic Link</strong>: Receive a login link via email (no password needed)</li>
        <li><strong>Google OAuth</strong>: Use your Google account</li>
      </ul>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 my-4">
        <p className="text-sm text-neutral-400">
          <strong>Try it:</strong>{" "}
          <Link href="/auth/signin" className="text-primary hover:underline" target="_blank">
            Open the login page →
          </Link>
        </p>
      </div>

      <h2>Dashboard Overview</h2>
      <p>
        After logging in, you'll land on your personal dashboard at{" "}
        <code className="px-2 py-1 bg-neutral-900 rounded text-sm">/app</code>.
      </p>

      <p>The dashboard shows:</p>
      <ul>
        <li><strong>Sprint Progress</strong>: Your current day and completion percentage</li>
        <li><strong>Quick Actions</strong>: Links to continue where you left off</li>
        <li><strong>Profile</strong>: Access to your profile settings</li>
      </ul>

      <h2>Navigation</h2>
      <p>
        The platform uses a sidebar navigation on the left side (desktop) or a mobile menu (mobile devices):
      </p>

      <ul>
        <li><strong>Dashboard</strong>: Overview and statistics</li>
        <li><strong>30 Day Sprint</strong>: Access all sprint content</li>
        <li><strong>Profile</strong>: Manage your account settings</li>
      </ul>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 my-4">
        <p className="text-sm text-neutral-400">
          <strong>Try it:</strong>{" "}
          <Link href="/app" className="text-primary hover:underline" target="_blank">
            Open your dashboard →
          </Link>
        </p>
      </div>

      <h2>Next Steps</h2>
      <p>Now that you know the basics, explore:</p>
      <ul>
        <li>
          <Link href="/docs-site/user/sprint-program" className="text-primary hover:underline">
            Sprint Program Guide
          </Link>{" "}
          - Learn how to use the 30-day program
        </li>
        <li>
          <Link href="/docs-site/user/profile" className="text-primary hover:underline">
            Profile Management
          </Link>{" "}
          - Customize your account
        </li>
      </ul>
    </DocsPage>
  );
}
