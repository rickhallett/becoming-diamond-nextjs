/**
 * Centralized Axiom Logger Configuration
 *
 * This module provides a singleton logger instance configured with:
 * - Server-side: AxiomJSTransport (Axiom cloud) + ConsoleTransport
 * - Client-side: ConsoleTransport only (browser-safe)
 * - Next.js formatters: Adds Next.js-specific context
 *
 * Usage:
 * import { log } from '@/lib/axiom-logger';
 *
 * await log.info('Message', { userId: '123', timestamp: new Date().toISOString() });
 * await log.error('Error occurred', { error: err.message, timestamp: new Date().toISOString() });
 */

import { Logger, ConsoleTransport } from '@axiomhq/logging';

// Detect if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Create logger with environment-appropriate configuration
function createLogger() {
  // Browser environment: Console only (no Node.js APIs)
  if (isBrowser) {
    const consoleTransport = new ConsoleTransport();
    return new Logger({
      transports: [consoleTransport],
    });
  }

  // Server environment: Import server-only modules dynamically
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { AxiomJSTransport } = require('@axiomhq/logging');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Axiom } = require('@axiomhq/js');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { nextJsFormatters } = require('@axiomhq/nextjs');

    const axiomConfig = {
      token: process.env.AXIOM_TOKEN,
      dataset: process.env.AXIOM_DATASET || 'becoming-diamond-prod',
      orgId: process.env.AXIOM_ORG_ID,
    };

    const consoleTransport = new ConsoleTransport();

    // Add Axiom transport if token is configured
    const axiomTransport = axiomConfig.token
      ? new AxiomJSTransport({
          axiom: new Axiom({
            token: axiomConfig.token,
            orgId: axiomConfig.orgId,
          }),
          dataset: axiomConfig.dataset,
        })
      : null;

    const transports = axiomTransport
      ? [axiomTransport, consoleTransport]
      : [consoleTransport];

    return new Logger({
      transports: transports as [any, ...any[]],
      formatters: nextJsFormatters,
    });
  } catch (error) {
    // Fallback to console-only if server imports fail
    console.warn('Failed to initialize Axiom logger, using console only:', error);
    const consoleTransport = new ConsoleTransport();
    return new Logger({
      transports: [consoleTransport],
    });
  }
}

// Create singleton logger instance
export const log = createLogger();

// Export typed methods for convenience
export default log;
