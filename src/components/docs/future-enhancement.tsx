"use client";

import { ReactNode } from "react";
import { IconSparkles } from "@tabler/icons-react";
import { motion } from "framer-motion";

interface FutureEnhancementProps {
  children: ReactNode;
}

export function FutureEnhancement({ children }: FutureEnhancementProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="my-8 rounded-lg border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 backdrop-blur-sm relative overflow-hidden group"
    >
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-cyan-500/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex items-start gap-4 relative z-10">
        <div className="p-2 rounded-lg bg-primary/20 border border-primary/30 group-hover:rotate-180 transition-transform duration-500">
          <IconSparkles className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h4 className="text-base font-bold mb-3 bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
            💎 Potential Enhancement
          </h4>
          <div className="text-sm text-neutral-300 leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0 [&>strong]:text-white [&>strong]:font-semibold">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
