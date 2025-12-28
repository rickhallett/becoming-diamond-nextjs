"use client";

import { ReactNode } from "react";
import { IconSparkles } from "@tabler/icons-react";

interface FutureEnhancementProps {
  children: ReactNode;
}

export function FutureEnhancement({ children }: FutureEnhancementProps) {
  return (
    <div className="my-8 rounded-lg border-l-4 border-primary bg-primary/5 p-6">
      <div className="flex items-start gap-4">
        <IconSparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="text-base font-medium text-primary mb-2">
            Potential Enhancement
          </h4>
          <div className="text-sm text-neutral-300 leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0 [&>strong]:text-white [&>strong]:font-medium">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
