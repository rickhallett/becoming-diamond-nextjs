/* eslint-disable react/no-unescaped-entities */
import { DocsPage } from "@/components/docs/docs-page";
import { FutureEnhancement } from "@/components/docs/future-enhancement";
import Link from "next/link";

export default function SprintProgramPage() {
  return (
    <DocsPage
      title="30 Day Sprint Program"
      description="Your transformation journey through 30 days of focused growth"
    >
      <h2>What is the Sprint Program?</h2>
      <p>
        The 30 Day Transformation Sprint is the core of your Becoming Diamond journey.
        Each day builds on the previous one, creating a progressive path toward
        sustainable personal growth and transformation.
      </p>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 my-4">
        <p className="text-sm text-neutral-400">
          <strong>Access the Sprint:</strong>{" "}
          <Link href="/app/sprint" className="text-primary hover:underline" target="_blank">
            Open your sprint overview →
          </Link>
        </p>
      </div>

      <h2>Starting Your Sprint</h2>
      <p>
        When you first access the sprint, you'll see an overview page with your progress
        stats and a call-to-action to begin. Days unlock progressively—you must complete
        each day before moving to the next. This ensures you build a solid foundation.
      </p>

      <h3>Time Commitment</h3>
      <p>
        Each day requires approximately 15-20 minutes of focused attention. Consistency
        is more important than speed—take your time to fully absorb each lesson.
      </p>

      <h2>Navigating the Sprint</h2>

      <h3>Sprint Overview</h3>
      <p>
        Your main sprint page at{" "}
        <code className="px-2 py-1 bg-neutral-900 rounded text-sm">/app/sprint</code>{" "}
        shows:
      </p>
      <ul>
        <li><strong>Progress Stats</strong>: Days completed, current day, completion percentage</li>
        <li><strong>Continue Button</strong>: Quick access to your current day</li>
        <li><strong>Quick Links</strong>: Access to the full dashboard and watch playlist</li>
      </ul>

      <h3>Sprint Dashboard</h3>
      <p>
        The dashboard displays all 30 days in a grid view, showing:
      </p>
      <ul>
        <li><strong>Day Number</strong>: Each day is numbered 1-30</li>
        <li><strong>Title</strong>: A brief description of the day's focus</li>
        <li><strong>Status</strong>: Visual indicators for completed, current, and locked days</li>
        <li><strong>Duration & Difficulty</strong>: Time estimate and difficulty level</li>
      </ul>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 my-4">
        <p className="text-sm text-neutral-400">
          <strong>Try it:</strong>{" "}
          <Link href="/app/sprint/dashboard" className="text-primary hover:underline" target="_blank">
            View all 30 days →
          </Link>
        </p>
      </div>

      <h2>Daily Lessons</h2>
      <p>
        Each day's page includes:
      </p>
      <ul>
        <li><strong>Video Content</strong>: Core teaching delivered via video (when available)</li>
        <li><strong>Written Content</strong>: Supporting materials, exercises, and reflections</li>
        <li><strong>Navigation</strong>: Quick links to previous/next days and back to dashboard</li>
        <li><strong>Mark Complete</strong>: Button to mark the day as finished</li>
      </ul>

      <h3>Completing a Day</h3>
      <p>
        At the bottom of each day's content, you'll find a "Mark Complete" button.
        Clicking this:
      </p>
      <ol>
        <li>Records your completion in the system</li>
        <li>Shows a celebration modal with your current streak</li>
        <li>Unlocks the next day (if not already complete)</li>
        <li>Updates your progress statistics</li>
      </ol>

      <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 my-4">
        <p className="text-sm text-neutral-300">
          <strong>Tip:</strong> Your progress is saved locally in your browser. For best
          results, complete your sprint on the same device. Cross-device sync is not yet
          available but is planned for future updates.
        </p>
      </div>

      <h2>Progress Tracking</h2>
      <p>
        Your sprint progress is tracked automatically:
      </p>
      <ul>
        <li><strong>Completion Percentage</strong>: Overall progress through the 30 days</li>
        <li><strong>Current Streak</strong>: Consecutive days completed (shown after marking complete)</li>
        <li><strong>Days Active</strong>: Total days since you started the sprint</li>
        <li><strong>Remaining Days</strong>: How many days left to complete</li>
      </ul>

      <h2>Watch Playlist Mode</h2>
      <p>
        If you prefer to watch multiple videos in sequence, the Watch Playlist feature
        allows continuous playback:
      </p>
      <ul>
        <li><strong>Auto-play</strong>: Videos play one after another</li>
        <li><strong>Track Progress</strong>: See which videos you've watched</li>
        <li><strong>Quick Navigation</strong>: Jump to any day in the playlist</li>
      </ul>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 my-4">
        <p className="text-sm text-neutral-400">
          <strong>Note:</strong> Watch Playlist is currently in beta and may not be
          available on all accounts. Check your sprint overview page for access.
        </p>
      </div>

      <FutureEnhancement>
        <p>
          <strong>Upcoming features:</strong> Cross-device progress synchronization
          will allow you to seamlessly continue your sprint from any device. We're also
          exploring features like scheduled reminders, downloadable worksheets, and
          community progress sharing.
        </p>
      </FutureEnhancement>

      <h2>Tips for Success</h2>
      <ul>
        <li>Set a consistent time each day for your sprint work</li>
        <li>Complete days in order—don't skip ahead</li>
        <li>Take notes or journal about key insights</li>
        <li>Revisit previous days if you need reinforcement</li>
        <li>Don't rush—transformation takes time and reflection</li>
      </ul>

      <h2>Next Steps</h2>
      <p>Ready to dive in?</p>
      <ul>
        <li>
          <Link href="/app/sprint" className="text-primary hover:underline" target="_blank">
            Start your 30-day sprint →
          </Link>
        </li>
        <li>
          <Link href="/docs-site/user/profile" className="text-primary hover:underline">
            Learn about Profile Management
          </Link>
        </li>
      </ul>
    </DocsPage>
  );
}
