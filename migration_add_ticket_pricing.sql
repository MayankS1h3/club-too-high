-- Migration: Add multiple ticket pricing to events table
-- Run this in Supabase SQL Editor

-- Step 1: Add new columns for different ticket types (nullable first)
ALTER TABLE events 
ADD COLUMN women_price INTEGER,
ADD COLUMN couple_price INTEGER,
ADD COLUMN stag_price INTEGER;

-- Step 2: Migrate existing data (set all ticket types to current ticket_price)
-- Handle cases where ticket_price might be null and ensure all rows are updated
UPDATE events 
SET 
  women_price = COALESCE(ticket_price, 1000),
  couple_price = COALESCE(ticket_price, 1500), 
  stag_price = COALESCE(ticket_price, 2000);

-- Step 3: Now make the columns NOT NULL (after all data is migrated)
ALTER TABLE events 
ALTER COLUMN women_price SET NOT NULL,
ALTER COLUMN couple_price SET NOT NULL,
ALTER COLUMN stag_price SET NOT NULL;

-- Step 4: (Optional) Drop the old ticket_price column after updating frontend
-- ALTER TABLE events DROP COLUMN ticket_price;

-- Verify the changes
SELECT id, title, ticket_price, women_price, couple_price, stag_price FROM events;