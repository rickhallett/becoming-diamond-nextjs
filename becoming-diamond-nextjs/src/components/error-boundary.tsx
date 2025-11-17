'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary Component with Automatic Axiom Logging
 *
 * Catches unhandled React errors and logs them to Axiom for monitoring.
 * Provides a user-friendly fallback UI when errors occur.
 *
 * Features:
 * - Automatic error logging to Axiom via API route
 * - PII-safe logging (no sensitive user data)
 * - Graceful fallback UI matching design system
 * - Optional custom error callback
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  async componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to Axiom via API route (server-side safe, no PII)
    try {
      await fetch('/api/log/error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error_type: error.name || 'ClientError',
          error_message: error.message,
          error_stack: error.stack,
          component_stack: errorInfo.componentStack,
          url: typeof window !== 'undefined' ? window.location.href : 'unknown',
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
          timestamp: new Date().toISOString(),
        }),
      });
    } catch {
      // Silent fail - don't break UI for logging failures
    }

    // Call custom error callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center px-6">
            <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
            <p className="text-gray-400 mb-4">We've been notified and are looking into it.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => this.setState({ hasError: false })}
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                Try again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/80 transition-colors"
              >
                Reload page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
