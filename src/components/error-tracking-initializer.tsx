'use client';

import { useEffect } from 'react';
import { initializeErrorTracking } from '@/lib/client-error-tracking';

/**
 * Component that initializes client-side error tracking
 * Must be rendered once in the root layout
 */
export function ErrorTrackingInitializer() {
  useEffect(() => {
    // Initialize global error handlers on mount
    initializeErrorTracking();
  }, []);

  return null; // This component doesn't render anything
}
