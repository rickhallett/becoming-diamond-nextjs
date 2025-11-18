/**
 * Integration tests for Sprint Progress API
 * Tests the database-based sprint progress tracking endpoints
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';

// Create hoisted mock instances that will be available in vi.mock() factories
const { mockExecute, mockTursoClient } = vi.hoisted(() => {
  const execute = vi.fn();
  return {
    mockExecute: execute,
    mockTursoClient: { execute }
  };
});

// Mock dependencies BEFORE imports
vi.mock('@/lib/axiom-logger', () => ({
  log: {
    info: vi.fn().mockResolvedValue(undefined),
    error: vi.fn().mockResolvedValue(undefined)
  }
}));

vi.mock('@/auth', () => ({
  auth: vi.fn()
}));

vi.mock('@/lib/turso-adapter', () => ({
  getTursoClient: vi.fn(() => mockTursoClient)
}));

// Import after mocks are set up
import { GET } from '@/app/api/sprint/progress/route';
import { POST as CompleteDay } from '@/app/api/sprint/progress/complete-day/route';
import { POST as ResetProgress } from '@/app/api/sprint/progress/reset/route';
import { auth } from '@/auth';
import { getTursoClient } from '@/lib/turso-adapter';

describe('Sprint Progress API', () => {
  const mockAuth = auth as ReturnType<typeof vi.fn>;

  const mockUserId = 'user-123';
  const mockSession = {
    user: {
      id: mockUserId,
      email: 'test@example.com',
      name: 'Test User'
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/sprint/progress', () => {
    it('should return 401 when user is not authenticated', async () => {
      mockAuth.mockResolvedValue(null);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should return null progress when user has no sprint progress', async () => {
      mockAuth.mockResolvedValue(mockSession);
      mockExecute.mockResolvedValue({ rows: [] });

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.progress).toBeNull();
    });

    it('should return user sprint progress when it exists', async () => {
      mockAuth.mockResolvedValue(mockSession);

      const mockProgressRow = {
        sprint_id: '30-day-sprint',
        enrollment_date: '2025-01-01T00:00:00Z',
        completed_days: JSON.stringify([1, 2, 3]),
        current_day: 4,
        total_days_completed: 3,
        completion_percentage: 10,
        status: 'in_progress',
        last_access_date: '2025-01-03T00:00:00Z',
        created_at: 1704067200, // Unix timestamp
        updated_at: 1704153600
      };

      mockExecute.mockResolvedValue({ rows: [mockProgressRow] });

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.progress).toMatchObject({
        sprintId: '30-day-sprint',
        enrollmentDate: '2025-01-01T00:00:00Z',
        completedDays: [1, 2, 3],
        currentDay: 4,
        totalDaysCompleted: 3,
        completionPercentage: 10,
        status: 'in_progress'
      });
    });

    it('should handle database errors gracefully', async () => {
      mockAuth.mockResolvedValue(mockSession);
      mockExecute.mockRejectedValue(new Error('Database connection failed'));

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });
  });

  describe('POST /api/sprint/progress/complete-day', () => {
    it('should return 401 when user is not authenticated', async () => {
      mockAuth.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3003/api/sprint/progress/complete-day', {
        method: 'POST',
        body: JSON.stringify({ dayNumber: 1 })
      });

      const response = await CompleteDay(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should return 400 for invalid day number', async () => {
      mockAuth.mockResolvedValue(mockSession);

      const request = new NextRequest('http://localhost:3003/api/sprint/progress/complete-day', {
        method: 'POST',
        body: JSON.stringify({ dayNumber: 0 })
      });

      const response = await CompleteDay(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Invalid day number');
    });

    it('should initialize progress when user completes day 1', async () => {
      mockAuth.mockResolvedValue(mockSession);
      mockExecute.mockResolvedValue({ rows: [] }); // No existing progress

      const request = new NextRequest('http://localhost:3003/api/sprint/progress/complete-day', {
        method: 'POST',
        body: JSON.stringify({ dayNumber: 1 })
      });

      const response = await CompleteDay(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.progress.completedDays).toEqual([1]);
      expect(data.progress.currentDay).toBe(2);
      expect(data.progress.totalDaysCompleted).toBe(1);
      expect(data.dayCompleted).toBe(1);
      expect(data.streak).toBe(1);
    });

    it('should return 400 if first-time user tries to complete day other than 1', async () => {
      mockAuth.mockResolvedValue(mockSession);
      mockExecute.mockResolvedValue({ rows: [] });

      const request = new NextRequest('http://localhost:3003/api/sprint/progress/complete-day', {
        method: 'POST',
        body: JSON.stringify({ dayNumber: 2 })
      });

      const response = await CompleteDay(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Must start with Day 1');
    });

    it('should mark day as complete and unlock next day', async () => {
      mockAuth.mockResolvedValue(mockSession);

      const existingProgress = {
        sprint_id: '30-day-sprint',
        enrollment_date: '2025-01-01T00:00:00Z',
        completed_days: JSON.stringify([1, 2]),
        current_day: 3,
        total_days_completed: 2,
        completion_percentage: 6.67,
        status: 'in_progress',
        last_access_date: '2025-01-02T00:00:00Z',
        created_at: 1704067200,
        updated_at: 1704153600
      };

      mockExecute.mockResolvedValue({ rows: [existingProgress] });

      const request = new NextRequest('http://localhost:3003/api/sprint/progress/complete-day', {
        method: 'POST',
        body: JSON.stringify({ dayNumber: 3 })
      });

      const response = await CompleteDay(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.progress.completedDays).toEqual([1, 2, 3]);
      expect(data.progress.currentDay).toBe(4);
      expect(data.progress.totalDaysCompleted).toBe(3);
      expect(data.dayCompleted).toBe(3);
    });

    it('should return 400 if trying to complete future day', async () => {
      mockAuth.mockResolvedValue(mockSession);

      const existingProgress = {
        sprint_id: '30-day-sprint',
        enrollment_date: '2025-01-01T00:00:00Z',
        completed_days: JSON.stringify([1, 2]),
        current_day: 3,
        total_days_completed: 2,
        completion_percentage: 6.67,
        status: 'in_progress',
        last_access_date: '2025-01-02T00:00:00Z',
        created_at: 1704067200,
        updated_at: 1704153600
      };

      mockExecute.mockResolvedValue({ rows: [existingProgress] });

      const request = new NextRequest('http://localhost:3003/api/sprint/progress/complete-day', {
        method: 'POST',
        body: JSON.stringify({ dayNumber: 5 })
      });

      const response = await CompleteDay(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('not yet accessible');
    });

    it('should return 400 if trying to re-complete already completed day', async () => {
      mockAuth.mockResolvedValue(mockSession);

      const existingProgress = {
        sprint_id: '30-day-sprint',
        enrollment_date: '2025-01-01T00:00:00Z',
        completed_days: JSON.stringify([1, 2]),
        current_day: 3,
        total_days_completed: 2,
        completion_percentage: 6.67,
        status: 'in_progress',
        last_access_date: '2025-01-02T00:00:00Z',
        created_at: 1704067200,
        updated_at: 1704153600
      };

      mockExecute.mockResolvedValue({ rows: [existingProgress] });

      const request = new NextRequest('http://localhost:3003/api/sprint/progress/complete-day', {
        method: 'POST',
        body: JSON.stringify({ dayNumber: 2 })
      });

      const response = await CompleteDay(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('already completed');
    });

    it('should calculate streak correctly', async () => {
      mockAuth.mockResolvedValue(mockSession);

      const existingProgress = {
        sprint_id: '30-day-sprint',
        enrollment_date: '2025-01-01T00:00:00Z',
        completed_days: JSON.stringify([1, 2, 3, 4]),
        current_day: 5,
        total_days_completed: 4,
        completion_percentage: 13.33,
        status: 'in_progress',
        last_access_date: '2025-01-04T00:00:00Z',
        created_at: 1704067200,
        updated_at: 1704326400
      };

      mockExecute.mockResolvedValue({ rows: [existingProgress] });

      const request = new NextRequest('http://localhost:3003/api/sprint/progress/complete-day', {
        method: 'POST',
        body: JSON.stringify({ dayNumber: 5 })
      });

      const response = await CompleteDay(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.streak).toBe(5); // Days 1-5 consecutive
    });

    it('should mark sprint as completed when day 30 is finished', async () => {
      mockAuth.mockResolvedValue(mockSession);

      // User has completed days 1-29
      const completedDays = Array.from({ length: 29 }, (_, i) => i + 1);

      const existingProgress = {
        sprint_id: '30-day-sprint',
        enrollment_date: '2025-01-01T00:00:00Z',
        completed_days: JSON.stringify(completedDays),
        current_day: 30,
        total_days_completed: 29,
        completion_percentage: 96.67,
        status: 'in_progress',
        last_access_date: '2025-01-29T00:00:00Z',
        created_at: 1704067200,
        updated_at: 1706486400
      };

      mockExecute.mockResolvedValue({ rows: [existingProgress] });

      const request = new NextRequest('http://localhost:3003/api/sprint/progress/complete-day', {
        method: 'POST',
        body: JSON.stringify({ dayNumber: 30 })
      });

      const response = await CompleteDay(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.progress.totalDaysCompleted).toBe(30);
      expect(data.progress.completionPercentage).toBe(100);
      expect(data.progress.status).toBe('completed');
    });

    it('should handle database errors gracefully', async () => {
      mockAuth.mockResolvedValue(mockSession);
      mockExecute.mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3003/api/sprint/progress/complete-day', {
        method: 'POST',
        body: JSON.stringify({ dayNumber: 1 })
      });

      const response = await CompleteDay(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });
  });

  describe('POST /api/sprint/progress/reset', () => {
    it('should return 401 when user is not authenticated', async () => {
      mockAuth.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3003/api/sprint/progress/reset', {
        method: 'POST'
      });

      const response = await ResetProgress(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should reset sprint progress successfully', async () => {
      mockAuth.mockResolvedValue(mockSession);
      mockExecute.mockResolvedValue({ rows: [] });

      const request = new NextRequest('http://localhost:3003/api/sprint/progress/reset', {
        method: 'POST'
      });

      const response = await ResetProgress(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toContain('reset');
    });

    it('should handle database errors gracefully', async () => {
      mockAuth.mockResolvedValue(mockSession);
      mockExecute.mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3003/api/sprint/progress/reset', {
        method: 'POST'
      });

      const response = await ResetProgress(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });
  });
});
