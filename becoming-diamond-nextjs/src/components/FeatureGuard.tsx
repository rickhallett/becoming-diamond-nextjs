"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getDisabledRoutes, FEATURE_REDIRECT_PATH } from "@/config/features";
import { logSync } from '@/lib/logger';

/**
 * FeatureGuard Component
 *
 * Protects routes based on feature flags.
 * Redirects users from disabled feature pages to the fallback page.
 *
 * Usage: Wrap this around pages that should be feature-flagged
 */
interface FeatureGuardProps {
  children: React.ReactNode;
}

export function FeatureGuard({ children }: FeatureGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const disabledRoutes = getDisabledRoutes();

  useEffect(() => {
    // Check if current path matches any disabled route
    const isDisabled = disabledRoutes.some(route => pathname.startsWith(route));

    if (isDisabled) {
      logSync.debug(`[FeatureGuard] Route ${pathname} is disabled, redirecting to ${FEATURE_REDIRECT_PATH}`, 'Component');
      router.replace(FEATURE_REDIRECT_PATH);
    }
  }, [pathname, router, disabledRoutes]);

  return <>{children}</>;
}
