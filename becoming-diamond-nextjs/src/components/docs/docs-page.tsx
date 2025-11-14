"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface DocsPageProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function DocsPage({ title, description, children }: DocsPageProps) {
  return (
    <div className="max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-primary to-cyan-400 bg-clip-text text-transparent leading-tight">
          {title}
        </h1>
        {description && (
          <p className="text-lg text-neutral-400 max-w-3xl">{description}</p>
        )}
        <div className="h-1 w-20 bg-gradient-to-r from-primary to-cyan-400 rounded-full mt-6" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="prose prose-invert prose-neutral max-w-none
          prose-headings:font-bold
          prose-headings:bg-gradient-to-r prose-headings:from-white prose-headings:to-neutral-300
          prose-headings:bg-clip-text prose-headings:text-transparent
          prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4
          prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
          prose-p:text-neutral-300 prose-p:leading-relaxed
          prose-a:text-primary prose-a:no-underline hover:prose-a:text-cyan-400
          prose-a:transition-colors prose-a:font-medium
          prose-strong:text-white prose-strong:font-semibold
          prose-code:text-primary prose-code:bg-neutral-900 prose-code:px-2 prose-code:py-1
          prose-code:rounded prose-code:text-sm prose-code:font-mono
          prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-neutral-800
          prose-ul:text-neutral-300 prose-ol:text-neutral-300
          prose-li:marker:text-primary
        "
      >
        {children}
      </motion.div>
    </div>
  );
}
