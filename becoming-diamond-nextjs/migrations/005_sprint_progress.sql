-- Sprint progress tracking table
-- Migration 005: Sprint Progress Database
-- Created: 2025-11-15

CREATE TABLE IF NOT EXISTS sprint_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  sprint_id TEXT NOT NULL DEFAULT '30-day-sprint',
  enrollment_date TEXT NOT NULL,
  completed_days TEXT NOT NULL DEFAULT '[]',
  current_day INTEGER NOT NULL DEFAULT 1,
  total_days_completed INTEGER DEFAULT 0,
  completion_percentage REAL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'not_started'
    CHECK (status IN ('not_started', 'in_progress', 'completed')),
  last_access_date TEXT NOT NULL,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch()),

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sprint_progress_user_id
  ON sprint_progress(user_id);

CREATE INDEX IF NOT EXISTS idx_sprint_progress_status
  ON sprint_progress(status);

CREATE INDEX IF NOT EXISTS idx_sprint_progress_updated_at
  ON sprint_progress(updated_at DESC);
