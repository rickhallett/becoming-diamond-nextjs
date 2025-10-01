"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";

const loadingStates = [
  { text: "Activating Diamond Operating System..." },
  { text: "Calibrating nervous system regulation..." },
  { text: "Loading transformation protocols..." },
  { text: "Syncing progress tracking..." },
  { text: "Preparing your courses..." },
  { text: "Connecting to DiamondMindAI..." },
  { text: "Initializing member dashboard..." },
  { text: "Welcome to the Diamond Community" },
];

interface MemberAreaTransitionProps {
  children: (props: { startTransition: () => void }) => React.ReactNode;
}

export function MemberAreaTransition({ children }: MemberAreaTransitionProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const startTransition = () => {
    setLoading(true);

    // Navigate after loader completes (3 seconds total)
    setTimeout(() => {
      router.push('/app');
    }, 3000);
  };

  return (
    <>
      <MultiStepLoader
        loadingStates={loadingStates}
        loading={loading}
        duration={3000}
      />
      {children({ startTransition })}
    </>
  );
}
