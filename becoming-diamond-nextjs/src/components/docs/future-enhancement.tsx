import { ReactNode } from "react";
import { IconSparkles } from "@tabler/icons-react";

interface FutureEnhancementProps {
  children: ReactNode;
}

export function FutureEnhancement({ children }: FutureEnhancementProps) {
  return (
    <div className="my-6 rounded-lg border border-primary/20 bg-primary/5 p-6">
      <div className="flex items-start gap-3">
        <IconSparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-primary mb-2">
            💎 Potential Enhancement
          </h4>
          <div className="text-sm text-neutral-300 [&>p]:mb-2 [&>p:last-child]:mb-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
