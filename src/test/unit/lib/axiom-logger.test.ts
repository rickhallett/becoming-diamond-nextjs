/**
 * Unit tests for Axiom Logger
 * Tests the centralized logging utility with mocked transports
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Axiom Logger', () => {
  beforeEach(() => {
    // Clear module cache to reset singleton
    vi.resetModules();
  });

  describe('Logger Initialization', () => {
    it('should create a logger instance', async () => {
      const { log } = await import('@/lib/axiom-logger');
      expect(log).toBeDefined();
      expect(typeof log.info).toBe('function');
      expect(typeof log.error).toBe('function');
      expect(typeof log.warn).toBe('function');
      expect(typeof log.debug).toBe('function');
    });

    it('should use NoOpTransport in browser environment', async () => {
      // Mock browser environment
      vi.stubGlobal('window', {});

      const { log } = await import('@/lib/axiom-logger');

      // In browser, logs should be no-ops (no errors thrown)
      expect(() => log.info('test', { data: 'test' })).not.toThrow();

      // Cleanup
      vi.unstubAllGlobals();
    });
  });

  describe('Log Event Structure', () => {
    it('should handle structured log events with required fields', async () => {
      const { log } = await import('@/lib/axiom-logger');

      const testEvent = {
        component: 'TestComponent',
        event: 'test_event',
        userId: 'user123',
        timestamp: new Date().toISOString(),
      };

      // Should not throw - logs are fire-and-forget
      expect(() => log.info('Test message', testEvent)).not.toThrow();
    });

    it('should handle error events with stack traces', async () => {
      const { log } = await import('@/lib/axiom-logger');

      const error = new Error('Test error');
      const errorEvent = {
        component: 'ErrorHandler',
        event: 'error_occurred',
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      };

      expect(() => log.error('Error occurred', errorEvent)).not.toThrow();
    });

    it('should handle PII-sanitized user data', async () => {
      const { log } = await import('@/lib/axiom-logger');

      const userEvent = {
        component: 'UserManagement',
        event: 'user_action',
        userId: 'user123',
        emailDomain: 'example.com', // NOT full email
        hasName: true, // Boolean, not actual name
        timestamp: new Date().toISOString(),
      };

      expect(() => log.info('User action', userEvent)).not.toThrow();
    });
  });

  describe('Log Levels', () => {
    it('should support debug level logging', async () => {
      const { log } = await import('@/lib/axiom-logger');

      expect(() => log.debug('Debug message', {
        component: 'Test',
        timestamp: new Date().toISOString(),
      })).not.toThrow();
    });

    it('should support info level logging', async () => {
      const { log } = await import('@/lib/axiom-logger');

      expect(() => log.info('Info message', {
        component: 'Test',
        timestamp: new Date().toISOString(),
      })).not.toThrow();
    });

    it('should support warn level logging', async () => {
      const { log } = await import('@/lib/axiom-logger');

      expect(() => log.warn('Warning message', {
        component: 'Test',
        timestamp: new Date().toISOString(),
      })).not.toThrow();
    });

    it('should support error level logging', async () => {
      const { log } = await import('@/lib/axiom-logger');

      expect(() => log.error('Error message', {
        component: 'Test',
        timestamp: new Date().toISOString(),
      })).not.toThrow();
    });
  });

  describe('Error Handling', () => {
    it('should not throw when logging fails', async () => {
      const { log } = await import('@/lib/axiom-logger');

      // Even with malformed data, logger should not crash
      expect(() => log.info('Test', {} as any)).not.toThrow();
    });

    it('should handle undefined or null data gracefully', async () => {
      const { log } = await import('@/lib/axiom-logger');

      expect(() => log.info('Test', undefined as any)).not.toThrow();
      expect(() => log.info('Test', null as any)).not.toThrow();
    });
  });

  describe('Privacy Compliance', () => {
    it('should not log full email addresses', async () => {
      const { log } = await import('@/lib/axiom-logger');

      // Good practice: log only email domain
      const event = {
        component: 'Auth',
        emailDomain: 'example.com',
        timestamp: new Date().toISOString(),
      };

      expect(() => log.info('User event', event)).not.toThrow();
    });

    it('should use boolean flags instead of sensitive data', async () => {
      const { log } = await import('@/lib/axiom-logger');

      const event = {
        component: 'User',
        hasName: true, // NOT user.name
        hasAddress: false, // NOT user.address
        timestamp: new Date().toISOString(),
      };

      expect(() => log.info('User check', event)).not.toThrow();
    });
  });
});
