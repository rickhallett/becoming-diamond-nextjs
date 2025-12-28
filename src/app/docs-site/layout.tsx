"use client";

import { DocsNav } from "@/components/docs/docs-nav";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { IconSparkles, IconMenu2, IconX } from "@tabler/icons-react";
import { useState } from "react";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-black text-white relative overflow-hidden">
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px]" />

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-neutral-800/50">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/docs-site" className="flex items-center gap-2">
            <IconSparkles className="h-5 w-5 text-primary" />
            <span className="text-base font-medium text-white">
              Becoming Diamond
            </span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-neutral-900/50 border border-neutral-800 hover:bg-neutral-800 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <IconX className="h-5 w-5 text-primary" />
            ) : (
              <IconMenu2 className="h-5 w-5 text-primary" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Desktop + Mobile Drawer */}
      <aside
        className={`
          fixed md:relative z-50 md:z-10
          w-64 h-full
          border-r border-neutral-800/50 p-6
          flex flex-col
          bg-black/95 md:bg-black/50 backdrop-blur-sm
          transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Logo/Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            href="/docs-site"
            className="block group"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="flex items-center gap-2">
              <IconSparkles className="h-5 w-5 text-primary/70 group-hover:text-primary transition-colors" />
              <h2 className="text-xl font-light text-white">
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
          <DocsNav onNavigate={() => setMobileMenuOpen(false)} />
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 pt-6 border-t border-neutral-800/50"
        >
          <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
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
      <main className="flex-1 overflow-y-auto relative z-10 pt-16 md:pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-12">
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
