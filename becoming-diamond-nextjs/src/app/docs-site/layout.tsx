"use client";

import { DocsNav } from "@/components/docs/docs-nav";
import { BackgroundBeams } from "@/components/ui/background-beams";
import Link from "next/link";
import { motion } from "framer-motion";
import { IconSparkles } from "@tabler/icons-react";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <BackgroundBeams className="opacity-30" />

      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-800/50 p-6 flex flex-col relative z-10 bg-black/50 backdrop-blur-sm">
        {/* Logo/Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link href="/docs-site" className="block group">
            <div className="flex items-center gap-2">
              <IconSparkles className="h-5 w-5 text-primary group-hover:rotate-180 transition-transform duration-500" />
              <h2 className="text-xl font-bold bg-gradient-to-r from-primary via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Becoming Diamond
              </h2>
            </div>
            <p className="text-xs text-neutral-500 mt-1 ml-7">Documentation</p>
          </Link>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 overflow-y-auto"
        >
          <DocsNav />
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 pt-6 border-t border-neutral-800/50"
        >
          <div className="bg-gradient-to-br from-primary/10 to-transparent p-3 rounded-lg border border-primary/20">
            <p className="text-xs text-neutral-400 font-medium">
              Protected Documentation
            </p>
            <p className="text-xs text-primary/80 mt-1">
              support@becomingdiamond.com
            </p>
          </div>
        </motion.div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative z-10">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
