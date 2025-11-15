import { DocsPage } from "@/components/docs/docs-page";
import Link from "next/link";

export default function OverviewPage() {
  return (
    <DocsPage
      title="About Becoming Diamond"
      description="Platform overview and core features"
    >
      <h2>What is Becoming Diamond?</h2>
      <p>
        Becoming Diamond is a personal transformation platform that helps individuals
        embark on a journey of self-discovery, growth, and mastery. The platform combines
        structured training programs, insightful content, and practical resources to guide
        members through their development journey.
      </p>

      <p>
        At its core, Becoming Diamond is built around the philosophy that everyone has the
        potential to transform into their best self—to become a "diamond" through intentional
        practice, reflection, and commitment to growth.
      </p>

      <h2>Who Is This Platform For?</h2>
      <p>
        Becoming Diamond is designed for individuals who are:
      </p>
      <ul>
        <li>Committed to personal growth and self-improvement</li>
        <li>Ready to challenge themselves with structured training programs</li>
        <li>Seeking guidance and inspiration for their transformation journey</li>
        <li>Looking for practical tools and exercises to support their development</li>
        <li>Interested in exploring the deeper aspects of personal mastery</li>
      </ul>

      <p>
        Whether you're just starting your journey or looking to deepen your existing practice,
        the platform provides resources and structure to support your unique path.
      </p>

      <h2>Core Features</h2>

      <h3>30-Day Sprint Program</h3>
      <p>
        The heart of the platform is the 30-Day Sprint—an intensive training program designed
        to jumpstart your transformation journey. Each day includes:
      </p>
      <ul>
        <li><strong>Video Lessons</strong>: Daily teachings and guidance</li>
        <li><strong>Exercises</strong>: Practical tasks to apply what you've learned</li>
        <li><strong>Progress Tracking</strong>: Mark days complete and track your journey</li>
        <li><strong>Watch Playlist Mode</strong>: Continuous viewing of all sprint videos</li>
      </ul>

      <p>
        The sprint is designed to be completed in 30 consecutive days, building momentum
        and creating lasting habits through daily practice and reflection.
      </p>

      <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 my-4">
        <p className="text-sm text-neutral-300">
          <strong>Member Portal:</strong> Access the 30-Day Sprint and track your progress
          through the member portal at <Link href="/app/sprint" className="text-primary hover:underline">/app/sprint</Link>
        </p>
      </div>

      <h3>Insights (Blog)</h3>
      <p>
        The Insights section features articles, reflections, and teachings that complement
        the training programs. Content covers:
      </p>
      <ul>
        <li>Personal development concepts and frameworks</li>
        <li>Practical wisdom for daily life</li>
        <li>Deeper explorations of transformation themes</li>
        <li>Answers to common questions on the journey</li>
      </ul>

      <p>
        New insights are published regularly and organized by categories and tags for easy
        discovery.
      </p>

      <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 my-4">
        <p className="text-sm text-neutral-300">
          <strong>Public Access:</strong> Browse insights at{" "}
          <Link href="/blog" className="text-primary hover:underline">/blog</Link>
        </p>
      </div>

      <h3>Diamond Manifesto (Book)</h3>
      <p>
        The Diamond Manifesto is the foundational text of the Becoming Diamond philosophy.
        This comprehensive guide explores:
      </p>
      <ul>
        <li>The principles of personal transformation</li>
        <li>The diamond metaphor and its deeper meanings</li>
        <li>Practical frameworks for growth and development</li>
        <li>Stories and examples from the journey</li>
      </ul>

      <p>
        The book is available for purchase as a digital download, providing members with
        a permanent reference and deeper dive into the teachings.
      </p>

      <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 my-4">
        <p className="text-sm text-neutral-300">
          <strong>Purchase:</strong> Get your copy at{" "}
          <Link href="/book" className="text-primary hover:underline">/book</Link>
        </p>
      </div>

      <h3>Member Profile & Progress</h3>
      <p>
        Each member has a personal profile that tracks their journey:
      </p>
      <ul>
        <li><strong>PR Number</strong>: Your unique member identifier</li>
        <li><strong>Days Active</strong>: Total days you've engaged with the platform</li>
        <li><strong>Sprint Progress</strong>: Days completed in the 30-Day Sprint</li>
        <li><strong>Member Since</strong>: Your start date on the platform</li>
        <li><strong>Profile Customization</strong>: Add bio, location, website, social links</li>
      </ul>

      <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 my-4">
        <p className="text-sm text-neutral-300">
          <strong>Manage Profile:</strong> Update your information at{" "}
          <Link href="/app/profile" className="text-primary hover:underline">/app/profile</Link>
        </p>
      </div>

      <h2>How Revenue is Generated</h2>
      <p>
        The platform operates on a simple, transparent revenue model:
      </p>

      <h3>Book Sales</h3>
      <p>
        Revenue is primarily generated through sales of The Diamond Manifesto book. When
        visitors purchase the book ($47):
      </p>
      <ol>
        <li>Payment is processed securely through Stripe</li>
        <li>Buyer receives immediate access to digital download</li>
        <li>Revenue is deposited to the platform owner's account</li>
        <li>Transaction details are recorded in Stripe Dashboard</li>
      </ol>

      <p>
        This keeps the platform financially sustainable while maintaining accessibility
        to the core training programs.
      </p>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 my-4">
        <p className="text-sm text-neutral-400">
          <strong>For Admins:</strong> Learn how to manage book sales and view revenue in the{" "}
          <Link href="/docs-site/admin/book-sales" className="text-primary hover:underline">
            Book Sales Admin Guide
          </Link>
        </p>
      </div>

      <h2>Platform Goals & Vision</h2>
      <p>
        The vision for Becoming Diamond is to create a supportive ecosystem for personal
        transformation that is:
      </p>
      <ul>
        <li><strong>Accessible</strong>: Available to anyone committed to growth</li>
        <li><strong>Practical</strong>: Focused on actionable exercises and real-world application</li>
        <li><strong>Sustainable</strong>: Supported by book sales while keeping programs accessible</li>
        <li><strong>Evolving</strong>: Growing with new content and features based on member needs</li>
        <li><strong>Authentic</strong>: Grounded in genuine wisdom and practical experience</li>
      </ul>

      <p>
        The platform serves as both a training ground and a community for those committed
        to their transformation journey—a space where individuals can access the tools,
        teachings, and structure needed to become the diamond they're meant to be.
      </p>

      <h2>Getting Started</h2>
      <p>
        Ready to begin your journey? Here's how to get started:
      </p>

      <ol>
        <li>
          <strong>Create an Account</strong>: Sign up using email magic link or Google OAuth at{" "}
          <Link href="/auth/signin" className="text-primary hover:underline">/auth/signin</Link>
        </li>
        <li>
          <strong>Access the Member Portal</strong>: Log in to view your dashboard at{" "}
          <Link href="/app" className="text-primary hover:underline">/app</Link>
        </li>
        <li>
          <strong>Start the 30-Day Sprint</strong>: Begin Day 1 of your transformation journey
        </li>
        <li>
          <strong>Explore Insights</strong>: Read articles and deepen your understanding
        </li>
        <li>
          <strong>Get the Book</strong>: Purchase The Diamond Manifesto for comprehensive guidance
        </li>
      </ol>

      <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 my-4">
        <p className="text-sm text-neutral-300">
          <strong>New to the platform?</strong> Check out the{" "}
          <Link href="/docs-site/user/getting-started" className="text-primary hover:underline">
            Getting Started Guide
          </Link>{" "}
          for step-by-step instructions on using the member portal.
        </p>
      </div>

      <h2>Questions or Need Help?</h2>
      <p>
        If you have questions about the platform or need assistance:
      </p>
      <ul>
        <li>
          <strong>Browse Documentation</strong>: Check the user guides and admin guides for answers
        </li>
        <li>
          <strong>Contact Support</strong>: Visit the{" "}
          <Link href="/docs-site/support" className="text-primary hover:underline">
            Support page
          </Link>{" "}
          for contact information
        </li>
      </ul>

      <h2>Next Steps</h2>
      <ul>
        <li>
          <Link href="/docs-site/user/getting-started" className="text-primary hover:underline">
            User Guide: Getting Started
          </Link>{" "}
          - Learn how to use the member portal
        </li>
        <li>
          <Link href="/docs-site/admin/cms-overview" className="text-primary hover:underline">
            Admin Guide: CMS Overview
          </Link>{" "}
          - Learn how to manage content (admins only)
        </li>
        <li>
          <Link href="/docs-site/technical/architecture" className="text-primary hover:underline">
            Technical Documentation
          </Link>{" "}
          - Explore the platform architecture (developers)
        </li>
      </ul>
    </DocsPage>
  );
}
