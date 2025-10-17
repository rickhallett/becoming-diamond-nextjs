-- Migration: Create book_orders table for MVP book purchasing
-- Created: 2025-10-16

CREATE TABLE IF NOT EXISTS book_orders (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  stripe_session_id TEXT NOT NULL UNIQUE,
  amount_paid REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed' CHECK(status IN ('completed', 'refunded')),
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_book_orders_email ON book_orders(email);
CREATE INDEX IF NOT EXISTS idx_book_orders_session_id ON book_orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_book_orders_created_at ON book_orders(created_at);
