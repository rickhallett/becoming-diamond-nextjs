"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Breadcrumbs } from "./breadcrumbs";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface DocsPageProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  children: ReactNode;
}

export function DocsPage({ title, description, breadcrumbs, children }: DocsPageProps) {
  return (
    <div className="max-w-4xl w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 md:mb-12"
      >
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumbs items={breadcrumbs} />
        )}
        <h1 className="text-4xl md:text-5xl font-extralight mb-3 md:mb-4 text-white tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-lg text-neutral-400 font-light max-w-3xl">
            {description}
          </p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="prose prose-lg prose-invert max-w-none
          prose-headings:font-light prose-headings:text-white prose-headings:tracking-wide
          prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-12 prose-h2:first:mt-0
          prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8
          prose-h4:text-xl prose-h4:mb-3 prose-h4:mt-6
          prose-p:text-neutral-300 prose-p:leading-relaxed prose-p:mb-4 prose-p:font-light prose-p:text-base
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-normal
          prose-strong:text-white prose-strong:font-medium
          prose-code:text-primary prose-code:bg-neutral-900 prose-code:px-2 prose-code:py-1
          prose-code:rounded prose-code:text-sm
          prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-neutral-800
          prose-pre:overflow-x-auto prose-pre:max-w-full prose-pre:rounded-lg
          prose-ul:text-neutral-300 prose-ul:leading-relaxed prose-ul:space-y-2
          prose-ol:text-neutral-300 prose-ol:leading-relaxed prose-ol:space-y-2
          prose-li:marker:text-primary
          prose-table:text-sm prose-table:overflow-x-auto prose-table:block prose-table:max-w-full
          prose-td:break-words prose-th:break-words
        "
      >
        {children}
      </motion.div>
    </div>
  );
}
