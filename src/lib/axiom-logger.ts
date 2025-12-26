/**
 * Centralized Axiom Logger Configuration
 *
 * This module provides a singleton logger instance configured with:
 * - Server-side: AxiomJSTransport (Axiom cloud only, no console)
 * - Client-side: Silent no-op (browser-safe)
 * - Next.js formatters: Adds Next.js-specific context
 *
 * Usage:
 * import { log } from '@/lib/axiom-logger';
 *
 * await log.info('Message', { userId: '123', timestamp: new Date().toISOString() });
 * await log.error('Error occurred', { error: err.message, timestamp: new Date().toISOString() });
 */

import { Logger } from '@axiomhq/logging';

// Detect if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Transport interface for type safety
interface Transport {
  log(...args: unknown[]): Promise<void> | void;
  flush(): Promise<void> | void;
}

// No-op transport for browser environment
class NoOpTransport implements Transport {
  async log() {
    // Silent - do nothing
  }
  async flush() {
    // Silent - do nothing
  }
}

// Create logger with environment-appropriate configuration
function createLogger() {
  // Browser environment: No-op transport (silent)
  if (isBrowser) {
    return new Logger({
      transports: [new NoOpTransport() as Transport],
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

    // Only use Axiom transport, no console
    const transports = axiomTransport ? [axiomTransport] : [new NoOpTransport() as Transport];

    return new Logger({
      transports: transports as [Transport, ...Transport[]],
      formatters: nextJsFormatters,
    });
  } catch {
    // Fallback to no-op if server imports fail
    return new Logger({
      transports: [new NoOpTransport() as Transport],
    });
  }
}

// Create singleton logger instance
export const log = createLogger();
