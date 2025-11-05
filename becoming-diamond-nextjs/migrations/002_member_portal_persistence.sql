-- Member Portal Data Persistence Schema
-- Adds tables for course enrollments, chat sessions, and activity tracking
-- Last Updated: 2025-11-04

-- =============================================================================
-- COURSE ENROLLMENT TABLES
-- =============================================================================

-- Course enrollments table
CREATE TABLE IF NOT EXISTS course_enrollments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  enrolled_date TEXT NOT NULL,
  completed_date TEXT,
  progress INTEGER DEFAULT 0, -- 0-100
  last_accessed_date TEXT NOT NULL,
  current_lesson TEXT,
  time_spent INTEGER DEFAULT 0, -- minutes
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_course_enrollments_user_id ON course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_course_id ON course_enrollments(course_id);

-- Lesson progress tracking table
CREATE TABLE IF NOT EXISTS lesson_progress (
  id TEXT PRIMARY KEY,
  enrollment_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  completed_date TEXT NOT NULL,
  created_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (enrollment_id) REFERENCES course_enrollments(id) ON DELETE CASCADE,
  UNIQUE(enrollment_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_lesson_progress_enrollment_id ON lesson_progress(enrollment_id);

-- =============================================================================
-- CHAT SESSION TABLES
-- =============================================================================

-- Chat sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_updated_at ON chat_sessions(updated_at DESC);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  created_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_timestamp ON chat_messages(timestamp);

-- =============================================================================
-- ACTIVITY TRACKING TABLE
-- =============================================================================

-- User activity log table
CREATE TABLE IF NOT EXISTS user_activities (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('course_enrolled', 'lesson_completed', 'pr_completed', 'achievement_earned', 'profile_updated', 'login')),
  description TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  metadata TEXT, -- JSON blob for additional data
  created_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_type ON user_activities(type);
CREATE INDEX IF NOT EXISTS idx_user_activities_timestamp ON user_activities(timestamp DESC);

-- =============================================================================
-- UPDATE USER PROFILES TABLE
-- =============================================================================

-- Add additional fields to user_profiles for progress tracking
-- Note: SQLite doesn't support ADD COLUMN IF NOT EXISTS, so we check manually
-- These fields are already in the schema but adding here for completeness

-- ALTER TABLE user_profiles ADD COLUMN current_pr INTEGER DEFAULT 1;
-- ALTER TABLE user_profiles ADD COLUMN completed_prs TEXT DEFAULT '[]';
-- ALTER TABLE user_profiles ADD COLUMN level TEXT DEFAULT 'Initiate';
-- ALTER TABLE user_profiles ADD COLUMN xp INTEGER DEFAULT 0;
-- ALTER TABLE user_profiles ADD COLUMN streak INTEGER DEFAULT 0;

-- =============================================================================
-- NOTES
-- =============================================================================
-- Migration adds support for:
--   - Course enrollment and progress tracking
--   - Lesson completion tracking
--   - Chat session and message persistence
--   - User activity logging
--
-- All tables include proper foreign keys and indexes for performance
-- Timestamps use ISO 8601 format for chat/activity (TEXT)
-- Unix timestamps (INTEGER) for created_at/updated_at
