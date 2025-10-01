"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { IconHome, IconUser, IconSettings, IconLogout, IconMenu2, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/app", icon: IconHome },
    { name: "Profile", href: "/app/profile", icon: IconUser },
    { name: "Settings", href: "/app/settings", icon: IconSettings },
  ];

  const isActive = (href: string) => {
    if (href === "/app") {
      return pathname === "/app";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex flex-col">
      {/* Header with Navigation */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2"
            >
              <Link href="/app" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg" />
                <span className="text-xl font-bold">
                  Aceternity <span className="text-purple-500">AI</span>
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all",
                        "hover:bg-white/10",
                        active && "bg-white/10 text-purple-400"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </motion.div>
                  </Link>
                );
              })}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = "/landing"}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-red-400 hover:bg-red-400/10 transition-all ml-4"
              >
                <IconLogout className="w-5 h-5" />
                <span>Logout</span>
              </motion.button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isMobileMenuOpen ? (
                <IconX className="w-6 h-6" />
              ) : (
                <IconMenu2 className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-white/10 overflow-hidden"
            >
              <nav className="container mx-auto px-4 py-4 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link key={item.href} href={item.href}>
                      <motion.div
                        whileHover={{ x: 10 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all",
                          "hover:bg-white/10",
                          active && "bg-white/10 text-purple-400"
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </motion.div>
                    </Link>
                  );
                })}

                <motion.button
                  whileHover={{ x: 10 }}
                  onClick={() => window.location.href = "/landing"}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-400/10 transition-all w-full"
                >
                  <IconLogout className="w-5 h-5" />
                  <span>Logout</span>
                </motion.button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-[calc(100vh-16rem)]"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-black/50 backdrop-blur-xl border-t border-white/10 mt-auto"
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © 2024 Aceternity AI. All rights reserved.
            </div>

            <div className="flex items-center space-x-6">
              <Link href="/app/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/app/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/app/help" className="text-sm text-gray-400 hover:text-white transition-colors">
                Help & Support
              </Link>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}