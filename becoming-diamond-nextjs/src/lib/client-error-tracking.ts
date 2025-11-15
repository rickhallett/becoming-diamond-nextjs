/**
 * Client-side error tracking utility
 * Sends errors to Axiom for production monitoring
 * Handles both caught errors (error boundaries) and uncaught errors (global handlers)
 */

interface ErrorContext {
  [key: string]: unknown;
}

interface ErrorEvent {
  timestamp: string;
  error_type: string;
  error_message: string;
  error_stack?: string;
  error_digest?: string;
  pathname: string;
  url: string;
  user_agent: string;
  viewport_width: number;
  viewport_height: number;
  is_mobile: boolean;
  is_ios: boolean;
  is_android: boolean;
  browser: string;
  context?: ErrorContext;
}

/**
 * Detects if the user is on a mobile device
 */
function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Detects the browser name
 */
function getBrowserName(): string {
  if (typeof window === 'undefined') return 'unknown';
  const ua = navigator.userAgent;

  if (ua.includes('Chrome') && !ua.includes('Edge')) return 'chrome';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'safari';
  if (ua.includes('Firefox')) return 'firefox';
  if (ua.includes('Edge')) return 'edge';

  return 'other';
}

/**
 * Sends error event to Axiom via API endpoint
 */
async function sendToAxiom(event: ErrorEvent): Promise<void> {
  try {
    // Only send in production to avoid noise in development
    if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
      console.error('[DEV] Error would be sent to Axiom:', event);
      return;
    }

    const response = await fetch('/api/log/error', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
      // Don't wait for response, fire and forget
      keepalive: true,
    });

    if (!response.ok) {
      console.error('Failed to send error to Axiom:', response.status);
    }
  } catch (err) {
    // Silently fail - we don't want error tracking to cause more errors
    console.error('Error tracking failed:', err);
  }
}

/**
 * Tracks an error with additional context
 */
export function trackError(error: Error, context?: ErrorContext): void {
  if (typeof window === 'undefined') return;

  const event: ErrorEvent = {
    timestamp: new Date().toISOString(),
    error_type: error.name || 'Error',
    error_message: error.message || 'Unknown error',
    error_stack: error.stack,
    error_digest: (error as Error & { digest?: string }).digest,
    pathname: window.location.pathname,
    url: window.location.href,
    user_agent: navigator.userAgent,
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
    is_mobile: isMobileDevice(),
    is_ios: /iPhone|iPad|iPod/i.test(navigator.userAgent),
    is_android: /Android/i.test(navigator.userAgent),
    browser: getBrowserName(),
    context,
  };

  // Send to Axiom
  sendToAxiom(event);

  // Also log to console in development
  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
    console.error('Client Error:', error);
    console.error('Context:', context);
  }
}

/**
 * Initialize global error handlers
 * Call this once on app initialization
 */
export function initializeErrorTracking(): void {
  if (typeof window === 'undefined') return;

  // Track unhandled errors
  window.addEventListener('error', (event) => {
    trackError(event.error || new Error(event.message), {
      source: 'window.onerror',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  // Track unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    trackError(
      event.reason instanceof Error
        ? event.reason
        : new Error(String(event.reason)),
      {
        source: 'unhandledrejection',
        promise: true,
      }
    );
  });

  // Track React hydration errors
  const originalConsoleError = console.error;
  console.error = (...args: unknown[]) => {
    const message = String(args[0] || '');

    // Detect hydration errors
    if (
      message.includes('Hydration') ||
      message.includes('hydration') ||
      message.includes('did not match')
    ) {
      trackError(new Error(message), {
        source: 'console.error',
        type: 'hydration',
        args: args.slice(0, 3), // Only first 3 args to avoid large payloads
      });
    }

    originalConsoleError.apply(console, args);
  };
}
