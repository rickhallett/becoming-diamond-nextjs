"use client";

import React, { Component, ReactNode, ErrorInfo } from 'react';
import { IconAlertTriangle, IconRefresh } from '@tabler/icons-react';
import { logSync } from '@/lib/logger';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary component
 * Catches JavaScript errors anywhere in the child component tree
 * and displays a fallback UI instead of crashing the entire application
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      logSync.error('Error caught by boundary', 'Component', { error, errorInfo });
    }

    // Call optional error handler
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-secondary/30 border border-red-500/30 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconAlertTriangle className="w-8 h-8 text-red-400" />
            </div>

            <h2 className="text-xl font-light mb-2 text-white">Something went wrong</h2>
            <p className="text-gray-400 text-sm mb-6">
              We encountered an unexpected error. Don&apos;t worry, your data is safe.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-400 mb-2">
                  Error Details (dev only)
                </summary>
                <pre className="text-xs bg-black/50 p-3 rounded overflow-auto max-h-40 text-red-400">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}

            <button
              onClick={this.handleReset}
              className="flex items-center gap-2 mx-auto bg-primary/20 border border-primary/50 text-primary px-6 py-3 rounded-lg hover:bg-primary/30 transition-all"
            >
              <IconRefresh className="w-5 h-5" />
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Functional wrapper component for easier use with hooks
 */
export function ErrorBoundaryWrapper({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Could send to error tracking service here
        logSync.error('Application error', 'Component', { error, errorInfo });
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
