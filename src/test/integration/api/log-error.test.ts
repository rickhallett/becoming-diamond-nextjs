/**
 * Integration tests for Error Logging API
 * Tests the /api/log/error endpoint that receives client-side errors
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/log/error/route';
import { NextRequest } from 'next/server';

// Mock the axiom-logger
vi.mock('@/lib/axiom-logger', () => ({
  log: {
    error: vi.fn().mockResolvedValue(undefined),
    info: vi.fn().mockResolvedValue(undefined),
    warn: vi.fn().mockResolvedValue(undefined),
    debug: vi.fn().mockResolvedValue(undefined),
  },
}));

describe('POST /api/log/error', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should accept valid error events', async () => {
    const errorEvent = {
      error_type: 'TypeError',
      error_message: 'Cannot read property of undefined',
      error_stack: 'Error stack trace...',
      component_stack: 'Component stack trace...',
      url: 'https://example.com/page',
      user_agent: 'Mozilla/5.0...',
      timestamp: new Date().toISOString(),
    };

    const request = new NextRequest('http://localhost:3003/api/log/error', {
      method: 'POST',
      body: JSON.stringify(errorEvent),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('should reject events without error_message', async () => {
    const invalidEvent = {
      error_type: 'Error',
      // Missing error_message
      timestamp: new Date().toISOString(),
    };

    const request = new NextRequest('http://localhost:3003/api/log/error', {
      method: 'POST',
      body: JSON.stringify(invalidEvent),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Missing required fields');
  });

  it('should reject events without timestamp', async () => {
    const invalidEvent = {
      error_type: 'Error',
      error_message: 'Test error',
      // Missing timestamp
    };

    const request = new NextRequest('http://localhost:3003/api/log/error', {
      method: 'POST',
      body: JSON.stringify(invalidEvent),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Missing required fields');
  });

  it('should handle malformed JSON gracefully', async () => {
    const request = new NextRequest('http://localhost:3003/api/log/error', {
      method: 'POST',
      body: 'invalid json{',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);

    expect(response.status).toBe(500);
  });

  it('should log to Axiom with correct structure', async () => {
    const { log } = await import('@/lib/axiom-logger');

    const errorEvent = {
      error_type: 'ReferenceError',
      error_message: 'Variable is not defined',
      error_stack: 'Stack trace...',
      component_stack: 'Component stack...',
      url: 'https://example.com/app',
      user_agent: 'Chrome/120.0.0',
      timestamp: new Date().toISOString(),
    };

    const request = new NextRequest('http://localhost:3003/api/log/error', {
      method: 'POST',
      body: JSON.stringify(errorEvent),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    await POST(request);

    // Verify axiom logger was called
    expect(log.error).toHaveBeenCalledWith(
      'Client-side error',
      expect.objectContaining({
        source: 'client',
        error_type: 'ReferenceError',
        error_message: 'Variable is not defined',
        error_stack: 'Stack trace...',
        url: 'https://example.com/app',
      })
    );
  });

  it('should handle WebGL errors', async () => {
    const { log } = await import('@/lib/axiom-logger');

    const webglError = {
      error_type: 'WebGLError',
      error_message: 'WebGL context lost',
      error_stack: null,
      component_stack: null,
      url: 'https://example.com/globe',
      user_agent: 'Safari/17.0',
      timestamp: new Date().toISOString(),
    };

    const request = new NextRequest('http://localhost:3003/api/log/error', {
      method: 'POST',
      body: JSON.stringify(webglError),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(log.error).toHaveBeenCalled();
  });

  it('should handle React Error Boundary errors', async () => {
    const { log } = await import('@/lib/axiom-logger');

    const reactError = {
      error_type: 'Error',
      error_message: 'Component render error',
      error_stack: 'Error: Component render error\n  at Component...',
      component_stack: '  in ErrorBoundary\n  in App',
      url: 'https://example.com/app/sprint',
      user_agent: 'Firefox/120.0',
      timestamp: new Date().toISOString(),
    };

    const request = new NextRequest('http://localhost:3003/api/log/error', {
      method: 'POST',
      body: JSON.stringify(reactError),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(log.error).toHaveBeenCalledWith(
      'Client-side error',
      expect.objectContaining({
        component_stack: expect.stringContaining('ErrorBoundary'),
      })
    );
  });
});
