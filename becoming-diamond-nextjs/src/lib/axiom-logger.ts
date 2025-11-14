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

import { Logger } from '@axiomhq/logging';
import { AxiomJSTransport, ConsoleTransport } from '@axiomhq/logging/transports';
import { nextJsFormatters } from '@axiomhq/nextjs';

// Configuration from environment variables
const axiomConfig = {
  token: process.env.AXIOM_TOKEN,
  dataset: process.env.AXIOM_DATASET || 'becoming-diamond-prod',
  orgId: process.env.AXIOM_ORG_ID,
};

// Create transports array
const transports = [];

// Add Axiom transport if token is configured
if (axiomConfig.token) {
  transports.push(
    new AxiomJSTransport({
      token: axiomConfig.token,
      dataset: axiomConfig.dataset,
      orgId: axiomConfig.orgId,
    })
  );
}

// Always add console transport for local development and debugging
transports.push(new ConsoleTransport());

// Create singleton logger instance
export const log = new Logger({
  transports,
  formatters: nextJsFormatters,
});

// Export typed methods for convenience
export default log;
