"use client";

import { DocsPage } from "@/components/docs/docs-page";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import Link from "next/link";
import { IconUser, IconSettings, IconCode, IconArrowRight } from "@tabler/icons-react";

export default function DocsHomePage() {
  return (
    <DocsPage
      title="Documentation Home"
      description="Complete guide to the Becoming Diamond platform"
    >
      <p className="text-lg mb-6 text-neutral-300">
        Welcome to the Becoming Diamond documentation. This guide will help you
        understand and manage the platform effectively.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        {/* User Guide Card */}
        <Link href="/docs-site/user/getting-started">
          <CardSpotlight className="h-full group cursor-pointer">
            <div className="relative h-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <IconUser className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-white">User Guide</h3>
              </div>
              <p className="text-neutral-400 text-sm mb-4">
                Learn how to navigate the platform, access the sprint program, and
                manage your profile.
              </p>
              <div className="flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
                Get started
                <IconArrowRight className="h-4 w-4" />
              </div>
            </div>
          </CardSpotlight>
        </Link>

        {/* Admin Guide Card */}
        <Link href="/docs-site/admin/cms-overview">
          <CardSpotlight className="h-full group cursor-pointer">
            <div className="relative h-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <IconSettings className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-white">Admin Guide</h3>
              </div>
              <p className="text-neutral-400 text-sm mb-4">
                Manage content with Decap CMS, edit sprint days, publish blog posts,
                and handle rollbacks.
              </p>
              <div className="flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
                Learn more
                <IconArrowRight className="h-4 w-4" />
              </div>
            </div>
          </CardSpotlight>
        </Link>
      </div>

      <div className="bg-gradient-to-br from-neutral-900/80 to-neutral-900/40 border border-neutral-800/50 rounded-lg p-6 my-8 backdrop-blur-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="text-primary">→</span>
          Quick Links
        </h3>
        <ul className="space-y-3">
          <li>
            <Link
              href="/app"
              className="text-primary hover:text-cyan-400 transition-colors flex items-center gap-2 group"
              target="_blank"
            >
              <IconArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              Access Member Portal
            </Link>
          </li>
          <li>
            <Link
              href="/admin"
              className="text-primary hover:text-cyan-400 transition-colors flex items-center gap-2 group"
              target="_blank"
            >
              <IconArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              Access CMS (/admin)
            </Link>
          </li>
          <li>
            <Link
              href="/docs-site/technical/architecture"
              className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2 group"
            >
              <IconCode className="h-4 w-4" />
              Technical Documentation
            </Link>
          </li>
        </ul>
      </div>

      <div className="border-t border-neutral-800/50 pt-6 mt-8">
        <div className="flex items-start gap-3 text-sm text-neutral-500">
          <div className="mt-0.5 p-1 rounded bg-primary/10">
            <IconSettings className="h-4 w-4 text-primary" />
          </div>
          <p>
            This documentation is protected and only accessible to
            support@becomingdiamond.com. For assistance, please contact support.
          </p>
        </div>
      </div>
    </DocsPage>
  );
}
