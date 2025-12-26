-- Consolidated Database Schema for Becoming Diamond
-- Last Updated: 2025-10-15
-- Production schema with unused tables removed
-- UTM tracking columns removed from leads table

-- =============================================================================
-- AUTHENTICATION TABLES
-- =============================================================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  email_verified INTEGER,
  image TEXT,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

-- Accounts table (OAuth providers)
CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS accounts_provider_idx ON accounts(provider, provider_account_id);
CREATE INDEX IF NOT EXISTS accounts_user_id_idx ON accounts(user_id);

-- Sessions table (database-backed sessions)
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  session_token TEXT UNIQUE NOT NULL,
  user_id TEXT NOT NULL,
  expires INTEGER NOT NULL,
  created_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);

-- Verification tokens (email magic links)
CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires INTEGER NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- User profiles table (extended user data for member portal)
CREATE TABLE IF NOT EXISTS user_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  bio TEXT,
  location TEXT,
  website TEXT,
  current_pr INTEGER DEFAULT 1,
  completed_prs TEXT DEFAULT '[]',
  level TEXT DEFAULT 'Initiate',
  xp INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =============================================================================
-- LEADS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  referrer TEXT,
  landing_page TEXT,
  user_agent TEXT,
  ip_address TEXT,
  consent_given INTEGER DEFAULT 1,
  subscribed INTEGER DEFAULT 1,
  status TEXT DEFAULT 'new',
  email_sent_at TEXT,
  email_status TEXT DEFAULT 'pending',
  email_id TEXT,
  unsubscribe_token TEXT
);

CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_unsubscribe_token ON leads(unsubscribe_token);
CREATE INDEX IF NOT EXISTS idx_leads_email_status ON leads(email_status);

-- =============================================================================
-- NOTES
-- =============================================================================
-- Removed tables (2025-10-15):
--   - course_enrollments
--   - lesson_progress
--   - user_activities
--   - user_achievements
-- Reason: Not implemented in codebase, reserved for future features
-- See: docs/reports/database-table-usage-survey.md
