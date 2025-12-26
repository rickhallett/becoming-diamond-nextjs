/**
 * Integration tests for Turso Adapter Logging
 * Tests that authentication flow is properly logged to Axiom
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock axiom-logger before importing adapter
const mockLog = {
  info: vi.fn().mockResolvedValue(undefined),
  error: vi.fn().mockResolvedValue(undefined),
  warn: vi.fn().mockResolvedValue(undefined),
  debug: vi.fn().mockResolvedValue(undefined),
};

vi.mock('@/lib/axiom-logger', () => ({
  log: mockLog,
}));

// Mock libsql client
const mockClient = {
  execute: vi.fn(),
};

vi.mock('@libsql/client', () => ({
  createClient: vi.fn(() => mockClient),
}));

describe('Turso Adapter Logging', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createUser Logging', () => {
    it('should log user creation start', async () => {
      const { TursoAdapter } = await import('@/lib/turso-adapter');

      // Mock database responses
      mockClient.execute.mockResolvedValueOnce({ rowsAffected: 1 }); // INSERT
      mockClient.execute.mockResolvedValueOnce({
        rows: [{
          id: 'test-user-id',
          name: 'Test User',
          email: 'test@example.com',
          email_verified: null,
          image: null,
        }],
      }); // SELECT after insert

      const adapter = TursoAdapter(mockClient);
      await adapter.createUser({
        email: 'test@example.com',
        emailVerified: null,
      });

      // Verify logging
      expect(mockLog.info).toHaveBeenCalledWith(
        'Adapter: createUser started',
        expect.objectContaining({
          component: 'TursoAdapter',
          method: 'createUser',
          emailDomain: 'example.com',
        })
      );
    });

    it('should log user creation success with duration', async () => {
      const { TursoAdapter } = await import('@/lib/turso-adapter');

      mockClient.execute.mockResolvedValueOnce({ rowsAffected: 1 });
      mockClient.execute.mockResolvedValueOnce({
        rows: [{
          id: 'test-user-id',
          name: 'Test User',
          email: 'test@example.com',
          email_verified: null,
          image: null,
        }],
      });

      const adapter = TursoAdapter(mockClient);
      await adapter.createUser({
        email: 'test@example.com',
        emailVerified: null,
      });

      expect(mockLog.info).toHaveBeenCalledWith(
        'Adapter: createUser success',
        expect.objectContaining({
          component: 'TursoAdapter',
          method: 'createUser',
          emailDomain: 'example.com',
          durationMs: expect.any(Number),
        })
      );
    });

    it('should log validation errors', async () => {
      const { TursoAdapter } = await import('@/lib/turso-adapter');

      const adapter = TursoAdapter(mockClient);

      await expect(adapter.createUser({
        email: '', // Invalid email
        emailVerified: null,
      })).rejects.toThrow();

      expect(mockLog.error).toHaveBeenCalledWith(
        'Adapter: createUser validation failed',
        expect.objectContaining({
          component: 'TursoAdapter',
          method: 'createUser',
          error: 'Email is required',
        })
      );
    });

    it('should not log full email addresses (PII compliance)', async () => {
      const { TursoAdapter } = await import('@/lib/turso-adapter');

      mockClient.execute.mockResolvedValueOnce({ rowsAffected: 1 });
      mockClient.execute.mockResolvedValueOnce({
        rows: [{
          id: 'test-user-id',
          name: 'Test',
          email: 'sensitive@private.com',
          email_verified: null,
          image: null,
        }],
      });

      const adapter = TursoAdapter(mockClient);
      await adapter.createUser({
        email: 'sensitive@private.com',
        emailVerified: null,
      });

      // Verify NO log call contains full email
      const allLogCalls = mockLog.info.mock.calls;
      allLogCalls.forEach(call => {
        const logData = JSON.stringify(call);
        expect(logData).not.toContain('sensitive@private.com');
        expect(logData).toContain('private.com'); // Domain is OK
      });
    });
  });

  describe('getUserByEmail Logging', () => {
    it('should log email lookup attempts', async () => {
      const { TursoAdapter } = await import('@/lib/turso-adapter');

      mockClient.execute.mockResolvedValueOnce({
        rows: [{
          id: 'user-123',
          name: 'John',
          email: 'john@example.com',
          email_verified: null,
          image: null,
        }],
      });

      const adapter = TursoAdapter(mockClient);
      await adapter.getUserByEmail('john@example.com');

      expect(mockLog.debug).toHaveBeenCalledWith(
        'Adapter: getUserByEmail started',
        expect.objectContaining({
          component: 'TursoAdapter',
          method: 'getUserByEmail',
          emailDomain: 'example.com',
        })
      );
    });

    it('should log when user not found', async () => {
      const { TursoAdapter } = await import('@/lib/turso-adapter');

      mockClient.execute.mockResolvedValueOnce({ rows: [] });

      const adapter = TursoAdapter(mockClient);
      await adapter.getUserByEmail('notfound@example.com');

      expect(mockLog.debug).toHaveBeenCalledWith(
        'Adapter: getUserByEmail not found',
        expect.objectContaining({
          component: 'TursoAdapter',
          method: 'getUserByEmail',
          emailDomain: 'example.com',
        })
      );
    });
  });

  describe('createSession Logging', () => {
    it('should log session creation', async () => {
      const { TursoAdapter } = await import('@/lib/turso-adapter');

      mockClient.execute.mockResolvedValueOnce({ rowsAffected: 1 });

      const adapter = TursoAdapter(mockClient);
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

      await adapter.createSession({
        sessionToken: 'test-token',
        userId: 'user-123',
        expires,
      });

      expect(mockLog.info).toHaveBeenCalledWith(
        'Adapter: createSession started',
        expect.objectContaining({
          component: 'TursoAdapter',
          method: 'createSession',
          userId: 'user-123',
          expiresAt: expires.toISOString(),
        })
      );
    });
  });

  describe('useVerificationToken Logging', () => {
    it('should log token usage attempts', async () => {
      const { TursoAdapter } = await import('@/lib/turso-adapter');

      mockClient.execute.mockResolvedValueOnce({
        rows: [{
          identifier: 'test@example.com',
          token: 'valid-token',
          expires: Math.floor(Date.now() / 1000) + 3600,
        }],
      });
      mockClient.execute.mockResolvedValueOnce({ rowsAffected: 1 }); // DELETE

      const adapter = TursoAdapter(mockClient);
      await adapter.useVerificationToken({
        identifier: 'test@example.com',
        token: 'valid-token-12345678',
      });

      expect(mockLog.info).toHaveBeenCalledWith(
        'Adapter: useVerificationToken started',
        expect.objectContaining({
          component: 'TursoAdapter',
          method: 'useVerificationToken',
          identifierDomain: 'example.com',
          tokenPreview: expect.stringContaining('...'),
        })
      );
    });

    it('should log expired tokens', async () => {
      const { TursoAdapter } = await import('@/lib/turso-adapter');

      mockClient.execute.mockResolvedValueOnce({
        rows: [{
          identifier: 'test@example.com',
          token: 'expired-token',
          expires: Math.floor(Date.now() / 1000) - 3600, // Expired 1 hour ago
        }],
      });
      mockClient.execute.mockResolvedValueOnce({ rowsAffected: 1 }); // DELETE

      const adapter = TursoAdapter(mockClient);
      await adapter.useVerificationToken({
        identifier: 'test@example.com',
        token: 'expired-token-12345678',
      });

      expect(mockLog.warn).toHaveBeenCalledWith(
        'Adapter: useVerificationToken expired',
        expect.objectContaining({
          component: 'TursoAdapter',
          method: 'useVerificationToken',
          identifierDomain: 'example.com',
        })
      );
    });
  });

  describe('Performance Metrics', () => {
    it('should include duration in all success logs', async () => {
      const { TursoAdapter } = await import('@/lib/turso-adapter');

      mockClient.execute.mockResolvedValueOnce({ rowsAffected: 1 });
      mockClient.execute.mockResolvedValueOnce({
        rows: [{
          id: 'user-123',
          name: 'Test',
          email: 'test@example.com',
          email_verified: null,
          image: null,
        }],
      });

      const adapter = TursoAdapter(mockClient);
      await adapter.createUser({
        email: 'test@example.com',
        emailVerified: null,
      });

      const successCall = mockLog.info.mock.calls.find(
        call => call[0] === 'Adapter: createUser success'
      );

      expect(successCall).toBeDefined();
      expect(successCall![1]).toHaveProperty('durationMs');
      expect(typeof successCall![1].durationMs).toBe('number');
      expect(successCall![1].durationMs).toBeGreaterThanOrEqual(0);
    });
  });
});
