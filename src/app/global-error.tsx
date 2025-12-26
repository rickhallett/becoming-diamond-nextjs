'use client';

import { useEffect } from 'react';
import { trackError } from '@/lib/client-error-tracking';

/**
 * Global error boundary for the entire application
 * Catches errors that escape other error boundaries
 * This is the last line of defense before the white screen of death
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Track the error to Axiom
    trackError(error, {
      boundary: 'global',
      digest: error.digest,
      fatal: true,
    });
  }, [error]);

  return (
    <html>
      <body style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#000000',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '20px',
      }}>
        <div style={{
          maxWidth: '600px',
          textAlign: 'center',
        }}>
          <h1 style={{
            fontSize: '2rem',
            marginBottom: '1rem',
            color: '#4fc3f7',
          }}>
            Something went wrong
          </h1>
          <p style={{
            marginBottom: '2rem',
            opacity: 0.8,
          }}>
            We&apos;ve encountered an unexpected error. Our team has been notified and we&apos;re working on a fix.
          </p>
          {error.digest && (
            <p style={{
              fontSize: '0.875rem',
              opacity: 0.6,
              marginBottom: '2rem',
              fontFamily: 'monospace',
            }}>
              Error ID: {error.digest}
            </p>
          )}
          <button
            onClick={reset}
            style={{
              backgroundColor: '#4fc3f7',
              color: '#000000',
              border: 'none',
              padding: '12px 24px',
              fontSize: '1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
