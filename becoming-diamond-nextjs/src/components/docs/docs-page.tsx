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
        className="prose prose-sm prose-invert prose-neutral max-w-none
          prose-headings:font-bold
          prose-headings:bg-gradient-to-r prose-headings:from-white prose-headings:to-neutral-300
          prose-headings:bg-clip-text prose-headings:text-transparent
          prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-3 prose-h2:leading-tight
          prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-2 prose-h3:leading-tight
          prose-h4:text-lg prose-h4:mt-5 prose-h4:mb-2 prose-h4:leading-tight
          prose-p:text-neutral-300 prose-p:leading-normal prose-p:text-sm prose-p:my-3
          prose-a:text-primary prose-a:no-underline hover:prose-a:text-cyan-400
          prose-a:transition-colors prose-a:font-medium
          prose-strong:text-white prose-strong:font-semibold
          prose-code:text-primary prose-code:bg-neutral-900 prose-code:px-2 prose-code:py-0.5
          prose-code:rounded prose-code:text-xs prose-code:font-mono
          prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-neutral-800
          prose-ul:text-neutral-300 prose-ul:text-sm prose-ul:my-3 prose-ul:leading-normal
          prose-ol:text-neutral-300 prose-ol:text-sm prose-ol:my-3 prose-ol:leading-normal
          prose-li:my-1 prose-li:marker:text-primary
        "
      >
        {children}
      </motion.div>
    </div>
  );
}
