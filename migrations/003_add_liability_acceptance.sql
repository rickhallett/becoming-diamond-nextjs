-- Add no_liability_accepted column to leads table
-- Migration: 003_add_liability_acceptance
-- Date: 2025-10-15

ALTER TABLE leads ADD COLUMN no_liability_accepted INTEGER DEFAULT 0;

-- Update existing leads to have liability accepted (grandfather clause)
UPDATE leads SET no_liability_accepted = 1 WHERE no_liability_accepted = 0;
