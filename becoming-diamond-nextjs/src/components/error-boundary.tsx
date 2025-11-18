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
  webglSupported?: boolean;
}

/**
 * Error Boundary Component with Automatic Axiom Logging and WebGL Detection
 *
 * Catches unhandled React errors and logs them to Axiom for monitoring.
 * Provides a user-friendly fallback UI when errors occur.
 * Detects WebGL support for 3D graphics rendering.
 *
 * Features:
 * - Automatic error logging to Axiom via API route
 * - PII-safe logging (no sensitive user data)
 * - WebGL capability detection
 * - Graceful fallback UI matching design system
 * - Optional custom error callback
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, webglSupported: undefined };
  }

  componentDidMount() {
    // Check WebGL support
    this.checkWebGLSupport();
  }

  /**
   * Detects WebGL support in the current browser
   */
  checkWebGLSupport() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      const isSupported = !!gl;

      this.setState({ webglSupported: isSupported });

      // Log WebGL support status (non-PII)
      if (!isSupported) {
        fetch('/api/log/error', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            error_type: 'WebGLNotSupported',
            error_message: 'WebGL is not supported in this browser',
            url: typeof window !== 'undefined' ? window.location.href : 'unknown',
            user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
            timestamp: new Date().toISOString(),
          }),
        }).catch(() => {
          // Silent fail
        });
      }
    } catch {
      this.setState({ webglSupported: false });
    }
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

  /**
   * Checks if the error is WebGL-related
   */
  isWebGLError(): boolean {
    if (!this.state.error) return false;

    const errorMsg = this.state.error.message?.toLowerCase() || '';
    const errorStack = this.state.error.stack?.toLowerCase() || '';

    return (
      errorMsg.includes('webgl') ||
      errorMsg.includes('three') ||
      errorMsg.includes('shader') ||
      errorMsg.includes('context lost') ||
      errorStack.includes('webgl') ||
      errorStack.includes('three')
    );
  }

  render() {
    // Show WebGL warning if not supported
    if (this.state.webglSupported === false && !this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center px-6 max-w-md">
            <h2 className="text-xl font-bold text-white mb-2">WebGL Not Supported</h2>
            <p className="text-gray-400 mb-4">
              Your browser does not support WebGL, which is required for 3D graphics.
              Some visual features may not work properly.
            </p>
            <p className="text-gray-500 text-sm mb-4">
              Try updating your browser or enabling hardware acceleration in your browser settings.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/80 transition-colors"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }

    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isWebGLRelated = this.isWebGLError();

      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center px-6 max-w-md">
            <h2 className="text-xl font-bold text-white mb-2">
              {isWebGLRelated ? 'Graphics Error' : 'Something went wrong'}
            </h2>
            <p className="text-gray-400 mb-4">
              {isWebGLRelated
                ? 'There was a problem loading 3D graphics. This may be due to WebGL support issues.'
                : "We've been notified and are looking into it."}
            </p>
            {isWebGLRelated && (
              <p className="text-gray-500 text-sm mb-4">
                Try updating your browser, enabling hardware acceleration, or using a different browser.
              </p>
            )}
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
