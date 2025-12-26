"use client";

import { DocsPage } from "@/components/docs/docs-page";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import Link from "next/link";
import {
  IconUser,
  IconSettings,
  IconCode,
  IconArrowRight,
  IconRocket,
  IconBook,
  IconMail,
  IconCreditCard,
  IconLifebuoy,
  IconSparkles,
  IconCheck,
} from "@tabler/icons-react";

export default function DocsHomePage() {
  return (
    <DocsPage
      title="Documentation Home"
      description="Complete guide to the Becoming Diamond platform"
    >
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/5 via-transparent to-cyan-500/5 border border-primary/20 rounded-xl p-4 sm:p-6 md:p-8 mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-primary/20 to-cyan-500/10 border border-primary/30">
            <IconSparkles className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-light mb-2">
              Welcome to <span className="text-primary font-medium">Becoming Diamond</span>
            </h2>
            <p className="text-neutral-300 text-sm sm:text-base">
              A personal transformation platform combining structured training programs,
              insightful content, and practical resources to guide members through their
              development journey.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-black/20 border border-neutral-800/50">
            <IconCheck className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-white mb-1">30-Day Sprint Program</p>
              <p className="text-xs text-neutral-400">
                Daily video lessons with progress tracking
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg bg-black/20 border border-neutral-800/50">
            <IconCheck className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-white mb-1">Insights Blog</p>
              <p className="text-xs text-neutral-400">
                Transformational content and teachings
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg bg-black/20 border border-neutral-800/50">
            <IconCheck className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-white mb-1">Diamond Manifesto</p>
              <p className="text-xs text-neutral-400">
                Digital book sales and delivery
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Cards */}
      <h2 className="text-lg sm:text-xl font-light mb-3 sm:mb-4 flex items-center gap-2">
        <span className="text-primary">→</span>
        Documentation Sections
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Platform Overview */}
        <Link href="/docs-site/overview">
          <CardSpotlight className="h-full group cursor-pointer">
            <div className="relative h-full p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <IconSparkles className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white">Platform Overview</h3>
              </div>
              <p className="text-neutral-400 text-xs sm:text-sm mb-3 sm:mb-4">
                Learn about the platform, core features, revenue model, and getting started.
              </p>
              <div className="flex items-center gap-2 text-primary text-xs sm:text-sm font-medium group-hover:gap-3 transition-all">
                Read overview
                <IconArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
            </div>
          </CardSpotlight>
        </Link>

        {/* User Guide */}
        <Link href="/docs-site/user/getting-started">
          <CardSpotlight className="h-full group cursor-pointer">
            <div className="relative h-full p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <IconUser className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white">User Guide</h3>
              </div>
              <p className="text-neutral-400 text-xs sm:text-sm mb-3 sm:mb-4">
                Navigate the platform, access the sprint program, and manage your profile.
              </p>
              <div className="flex items-center gap-2 text-primary text-xs sm:text-sm font-medium group-hover:gap-3 transition-all">
                Get started
                <IconArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
            </div>
          </CardSpotlight>
        </Link>

        {/* Admin Guide */}
        <Link href="/docs-site/admin/cms-overview">
          <CardSpotlight className="h-full group cursor-pointer">
            <div className="relative h-full p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <IconSettings className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white">Admin Guide</h3>
              </div>
              <p className="text-neutral-400 text-xs sm:text-sm mb-3 sm:mb-4">
                Manage content, edit sprint days, publish blog posts, and handle revenue.
              </p>
              <div className="flex items-center gap-2 text-primary text-xs sm:text-sm font-medium group-hover:gap-3 transition-all">
                Learn more
                <IconArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
            </div>
          </CardSpotlight>
        </Link>

        {/* Technical Docs */}
        <Link href="/docs-site/technical/architecture">
          <CardSpotlight className="h-full group cursor-pointer">
            <div className="relative h-full p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <IconCode className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white">Technical Docs</h3>
              </div>
              <p className="text-neutral-400 text-xs sm:text-sm mb-3 sm:mb-4">
                Architecture overview, development reports, and technical specifications.
              </p>
              <div className="flex items-center gap-2 text-primary text-xs sm:text-sm font-medium group-hover:gap-3 transition-all">
                View docs
                <IconArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
            </div>
          </CardSpotlight>
        </Link>

        {/* Book Sales */}
        <Link href="/docs-site/admin/book-sales">
          <CardSpotlight className="h-full group cursor-pointer">
            <div className="relative h-full p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <IconCreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white">Book Sales</h3>
              </div>
              <p className="text-neutral-400 text-xs sm:text-sm mb-3 sm:mb-4">
                View orders, manage revenue in Stripe, and handle customer support.
              </p>
              <div className="flex items-center gap-2 text-primary text-xs sm:text-sm font-medium group-hover:gap-3 transition-all">
                Manage sales
                <IconArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
            </div>
          </CardSpotlight>
        </Link>

        {/* Lead Management */}
        <Link href="/docs-site/admin/lead-management">
          <CardSpotlight className="h-full group cursor-pointer">
            <div className="relative h-full p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <IconMail className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white">Lead Management</h3>
              </div>
              <p className="text-neutral-400 text-xs sm:text-sm mb-3 sm:mb-4">
                Access, export, and utilize email leads for marketing campaigns.
              </p>
              <div className="flex items-center gap-2 text-primary text-xs sm:text-sm font-medium group-hover:gap-3 transition-all">
                View leads
                <IconArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
            </div>
          </CardSpotlight>
        </Link>
      </div>

      {/* Quick Links Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 my-6 sm:my-8">
        {/* Platform Access */}
        <div className="bg-gradient-to-br from-neutral-900/80 to-neutral-900/40 border border-neutral-800/50 rounded-lg p-4 sm:p-6 backdrop-blur-sm">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
            <IconRocket className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Platform Access
          </h3>
          <ul className="space-y-3">
            <li>
              <Link
                href="/app"
                className="text-primary hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                target="_blank"
              >
                <IconArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                Member Portal Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/app/sprint"
                className="text-primary hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                target="_blank"
              >
                <IconArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                30-Day Sprint Program
              </Link>
            </li>
            <li>
              <Link
                href="/app/admin/leads"
                className="text-primary hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                target="_blank"
              >
                <IconArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                Lead Management Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/admin"
                className="text-primary hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                target="_blank"
              >
                <IconArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                Content Management System
              </Link>
            </li>
          </ul>
        </div>

        {/* External Tools */}
        <div className="bg-gradient-to-br from-neutral-900/80 to-neutral-900/40 border border-neutral-800/50 rounded-lg p-4 sm:p-6 backdrop-blur-sm">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
            <IconBook className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            External Tools
          </h3>
          <ul className="space-y-3">
            <li>
              <a
                href="https://dashboard.stripe.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2 group"
              >
                <IconArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                Stripe Dashboard (Revenue)
              </a>
            </li>
            <li>
              <a
                href="https://github.com/rickhallett/becoming-diamond-nextjs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2 group"
              >
                <IconArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                GitHub Repository
              </a>
            </li>
            <li>
              <Link
                href="/docs-site/support"
                className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2 group"
              >
                <IconLifebuoy className="h-4 w-4" />
                Get Help & Support
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 rounded-xl p-4 sm:p-6 my-6 sm:my-8">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-neutral-200">Platform Features</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="text-center p-3 sm:p-4 rounded-lg bg-black/30 border border-neutral-800/30">
            <div className="text-2xl sm:text-3xl font-light text-primary mb-1">30</div>
            <div className="text-xs text-neutral-400">Sprint Days</div>
          </div>
          <div className="text-center p-3 sm:p-4 rounded-lg bg-black/30 border border-neutral-800/30">
            <div className="text-2xl sm:text-3xl font-light text-primary mb-1">1</div>
            <div className="text-xs text-neutral-400">Digital Book</div>
          </div>
          <div className="text-center p-3 sm:p-4 rounded-lg bg-black/30 border border-neutral-800/30">
            <div className="text-2xl sm:text-3xl font-light text-primary mb-1">∞</div>
            <div className="text-xs text-neutral-400">Blog Insights</div>
          </div>
          <div className="text-center p-3 sm:p-4 rounded-lg bg-black/30 border border-neutral-800/30">
            <div className="text-2xl sm:text-3xl font-light text-primary mb-1">100%</div>
            <div className="text-xs text-neutral-400">Git Tracked</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-neutral-800/50 pt-4 sm:pt-6 mt-6 sm:mt-8">
        <div className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-neutral-500">
          <div className="mt-0.5 p-1 rounded bg-primary/10 flex-shrink-0">
            <IconSettings className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
          </div>
          <p>
            This documentation is protected and only accessible to authorized administrators.
            For assistance, visit the{" "}
            <Link href="/docs-site/support" className="text-primary hover:underline">
              Support page
            </Link>.
          </p>
        </div>
      </div>
    </DocsPage>
  );
}
