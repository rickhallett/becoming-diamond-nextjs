/* eslint-disable react/no-unescaped-entities */
import { DocsPage } from "@/components/docs/docs-page";
import { FutureEnhancement } from "@/components/docs/future-enhancement";
import Link from "next/link";

export default function ProfileManagementPage() {
  return (
    <DocsPage
      title="Profile Management"
      description="Customize your account and track your journey"
    >
      <h2>Accessing Your Profile</h2>
      <p>
        Your profile page is where you manage your personal information and view your
        membership details. Access it anytime from the sidebar navigation or by visiting{" "}
        <code className="px-2 py-1 bg-neutral-900 rounded text-sm">/app/profile</code>.
      </p>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 my-4">
        <p className="text-sm text-neutral-400">
          <strong>Access Your Profile:</strong>{" "}
          <Link href="/app/profile" className="text-primary hover:underline" target="_blank">
            Open profile page →
          </Link>
        </p>
      </div>

      <h2>Profile Overview</h2>
      <p>
        Your profile is divided into two main sections:
      </p>

      <h3>Profile Card (Left Side)</h3>
      <p>
        The profile card displays your key identity and stats:
      </p>
      <ul>
        <li><strong>Avatar</strong>: Your profile picture with hover-to-edit functionality</li>
        <li><strong>Name</strong>: Your display name</li>
        <li><strong>Level</strong>: Your current membership level (e.g., "Diamond Member")</li>
        <li><strong>Current Pressure Room</strong>: Your PR number</li>
        <li><strong>Member Since</strong>: When you joined the platform</li>
        <li><strong>Days Active</strong>: Total days since enrollment</li>
      </ul>

      <h3>Personal Information (Right Side)</h3>
      <p>
        This section contains your editable profile details:
      </p>
      <ul>
        <li><strong>Full Name</strong>: Your display name (editable)</li>
        <li><strong>Email Address</strong>: Your login email (read-only)</li>
        <li><strong>Location</strong>: City, State/Country (optional)</li>
        <li><strong>Website</strong>: Your personal or professional website (optional)</li>
        <li><strong>Bio</strong>: A short description about yourself (optional)</li>
      </ul>

      <h2>Editing Your Profile</h2>
      <p>
        To update your profile information:
      </p>
      <ol>
        <li>Click the "Edit" button in the top-right corner of the Personal Information section</li>
        <li>Make your desired changes to any editable fields</li>
        <li>Click "Save" to apply changes, or "Cancel" to discard them</li>
      </ol>

      <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 my-4">
        <p className="text-sm text-neutral-300">
          <strong>Note:</strong> Your email address cannot be changed from the profile
          page as it's tied to your authentication. If you need to change your email,
          please contact support.
        </p>
      </div>

      <h2>Profile Picture</h2>
      <p>
        Your avatar is displayed prominently on your profile card. The current system:
      </p>
      <ul>
        <li>Uses your Google account avatar if you logged in with Google OAuth</li>
        <li>Uses a default placeholder if no avatar is available</li>
        <li>Shows a camera icon overlay on hover (feature in development)</li>
      </ul>

      <FutureEnhancement>
        <p>
          <strong>Coming soon:</strong> Direct avatar upload functionality will allow
          you to upload custom profile pictures from your device. You'll be able to crop,
          resize, and preview your avatar before saving.
        </p>
      </FutureEnhancement>

      <h2>Understanding Your Stats</h2>

      <h3>Current Pressure Room (PR)</h3>
      <p>
        Your Pressure Room number indicates your current level within the Becoming Diamond
        ecosystem. This number may increase as you progress through the program and achieve
        milestones.
      </p>

      <h3>Member Since</h3>
      <p>
        This shows the month and year you joined the platform, helping you track how long
        you've been on your transformation journey.
      </p>

      <h3>Days Active</h3>
      <p>
        Calculated automatically based on your join date, this metric shows your total
        commitment to the program over time.
      </p>

      <h2>Achievements System</h2>
      <p>
        The platform includes an achievement system that tracks your progress and milestones.
        This feature is currently disabled in the simplified MVP version but will be activated
        in future updates.
      </p>

      <FutureEnhancement>
        <p>
          <strong>Achievements coming soon:</strong> Earn badges and recognition for
          completing milestones like your first week, finishing the sprint, maintaining
          streaks, and engaging with the community. These will be displayed on your profile
          and can be shared publicly.
        </p>
      </FutureEnhancement>

      <h2>Privacy and Data</h2>
      <p>
        Your profile information is:
      </p>
      <ul>
        <li><strong>Private by default</strong>: Only visible to you unless you choose to share</li>
        <li><strong>Stored securely</strong>: Data is encrypted and protected</li>
        <li><strong>Fully under your control</strong>: You can edit or delete information anytime</li>
      </ul>

      <h2>Profile Best Practices</h2>
      <ul>
        <li><strong>Keep it current</strong>: Update your information as things change</li>
        <li><strong>Add context</strong>: A good bio helps you connect with the community</li>
        <li><strong>Use a clear avatar</strong>: A recognizable photo helps build connection</li>
        <li><strong>Link your work</strong>: Share your website or portfolio if relevant</li>
      </ul>

      <h2>Troubleshooting</h2>

      <h3>Changes Not Saving</h3>
      <p>
        If your profile changes aren't being saved:
      </p>
      <ul>
        <li>Make sure you clicked the "Save" button (not just "Edit")</li>
        <li>Check your internet connection</li>
        <li>Refresh the page and try again</li>
        <li>If the problem persists, contact support</li>
      </ul>

      <h3>Avatar Not Displaying</h3>
      <p>
        If your avatar shows the default placeholder instead of your photo:
      </p>
      <ul>
        <li>This is normal if you haven't uploaded a custom avatar yet</li>
        <li>If you logged in with Google, it may take a moment to load</li>
        <li>Check your browser's privacy settings aren't blocking external images</li>
      </ul>

      <h2>Next Steps</h2>
      <ul>
        <li>
          <Link href="/app/profile" className="text-primary hover:underline" target="_blank">
            Visit your profile page →
          </Link>
        </li>
        <li>
          <Link href="/docs-site/user/sprint-program" className="text-primary hover:underline">
            Learn about the Sprint Program
          </Link>
        </li>
        <li>
          <Link href="/docs-site/user/getting-started" className="text-primary hover:underline">
            Back to Getting Started
          </Link>
        </li>
      </ul>
    </DocsPage>
  );
}
