-- Migration: 006_rate_limiting
-- Description: Add rate_limits table for serverless-compatible rate limiting
-- Date: 2025-11-20

-- Rate limits table for tracking API request counts
-- This replaces in-memory rate limiting which doesn't work in serverless environments
CREATE TABLE IF NOT EXISTS rate_limits (
  id TEXT PRIMARY KEY,
  identifier TEXT NOT NULL,
  window_start INTEGER NOT NULL,
  count INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Index for efficient lookups by identifier and window
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier_window
  ON rate_limits(identifier, window_start);

-- Index for cleanup of old entries
CREATE INDEX IF NOT EXISTS idx_rate_limits_window_start
  ON rate_limits(window_start);
