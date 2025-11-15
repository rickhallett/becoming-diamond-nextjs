'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { trackError } from '@/lib/client-error-tracking';

/**
 * Page-level error boundary
 * Catches errors in page components and client components
 * Provides a user-friendly error UI while logging to Axiom
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Track the error to Axiom with context
    trackError(error, {
      boundary: 'page',
      digest: error.digest,
      pathname: typeof window !== 'undefined' ? window.location.pathname : 'unknown',
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
    });
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="max-w-md text-center">
        <div className="mb-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2 text-primary">
            Oops! Something went wrong
          </h2>
          <p className="text-white/60 mb-6">
            We&apos;ve encountered an unexpected error. Our team has been notified.
          </p>
        </div>

        {error.message && process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10 text-left">
            <p className="text-sm font-mono text-red-400">
              {error.message}
            </p>
          </div>
        )}

        {error.digest && (
          <p className="text-xs text-white/40 font-mono mb-6">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-primary text-black font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
