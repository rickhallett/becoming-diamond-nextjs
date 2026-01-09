-- Migration: 007_password_auth
-- Description: Add password_hash column to users table for optional password authentication
-- Date: 2026-01-09
-- Context: Enables password login as alternative to magic link/OAuth for home screen app users

-- Add password_hash column to users table (nullable - existing users don't have passwords)
-- Users can set a password via their profile after authenticating via magic link or OAuth
ALTER TABLE users ADD COLUMN password_hash TEXT;

-- Index for efficient lookup during password authentication
CREATE INDEX IF NOT EXISTS idx_users_email_password ON users(email) WHERE password_hash IS NOT NULL;
