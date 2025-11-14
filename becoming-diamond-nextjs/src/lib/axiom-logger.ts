/**
 * Centralized Axiom Logger Configuration
 *
 * This module provides a singleton logger instance configured with:
 * - AxiomJSTransport: Sends logs to Axiom cloud
 * - ConsoleTransport: Logs to console in development
 * - Next.js formatters: Adds Next.js-specific context
 *
 * Usage:
 * import { log } from '@/lib/axiom-logger';
 *
 * await log.info('Message', { userId: '123', timestamp: new Date().toISOString() });
 * await log.error('Error occurred', { error: err.message, timestamp: new Date().toISOString() });
 */

import { Logger, AxiomJSTransport, ConsoleTransport } from '@axiomhq/logging';
import { Axiom } from '@axiomhq/js';
import { nextJsFormatters } from '@axiomhq/nextjs';

// Configuration from environment variables
const axiomConfig = {
  token: process.env.AXIOM_TOKEN,
  dataset: process.env.AXIOM_DATASET || 'becoming-diamond-prod',
  orgId: process.env.AXIOM_ORG_ID,
};

// Create transports - always start with console transport (required minimum)
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

// Build transports array with at least one transport (console)
const transports = axiomTransport
  ? [axiomTransport, consoleTransport]
  : [consoleTransport];

// Create singleton logger instance
export const log = new Logger({
  transports: transports as [ConsoleTransport, ...typeof transports],
  formatters: nextJsFormatters,
});

// Export typed methods for convenience
export default log;
