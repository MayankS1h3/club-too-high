-- Migration: Add individual ticket type counters to bookings table
-- Date: 2025-10-06
-- Description: Adds separate columns to track women, couple, and stag ticket quantities

-- Add columns for individual ticket types
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS womens_tickets INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS couple_tickets INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS stag_tickets INTEGER DEFAULT 0;

-- Add check constraints to ensure non-negative values
ALTER TABLE bookings 
ADD CONSTRAINT bookings_womens_tickets_check CHECK (womens_tickets >= 0),
ADD CONSTRAINT bookings_couple_tickets_check CHECK (couple_tickets >= 0),
ADD CONSTRAINT bookings_stag_tickets_check CHECK (stag_tickets >= 0);

-- Add a check to ensure ticket breakdown matches total
ALTER TABLE bookings 
ADD CONSTRAINT bookings_tickets_total_check 
CHECK (num_of_tickets = COALESCE(womens_tickets, 0) + COALESCE(couple_tickets, 0) + COALESCE(stag_tickets, 0));

-- Add comments for documentation
COMMENT ON COLUMN bookings.womens_tickets IS 'Number of women tickets in this booking';
COMMENT ON COLUMN bookings.couple_tickets IS 'Number of couple tickets in this booking';
COMMENT ON COLUMN bookings.stag_tickets IS 'Number of stag tickets in this booking';

-- Create index for analytics queries
CREATE INDEX IF NOT EXISTS idx_bookings_ticket_types ON bookings(womens_tickets, couple_tickets, stag_tickets);

-- Update the booking_details view to include ticket breakdown
DROP VIEW IF EXISTS booking_details;
CREATE OR REPLACE VIEW booking_details AS
SELECT 
    b.*,
    e.title as event_title,
    e.event_date,
    e.dj_name,
    e.poster_image_url,
    e.woman_price,
    e.couple_price,
    e.stag_price,
    p.full_name as user_name,
    p.email as user_email,
    -- Calculate amounts per ticket type
    (b.womens_tickets * e.woman_price) as womens_amount,
    (b.couple_tickets * e.couple_price) as couple_amount,
    (b.stag_tickets * e.stag_price) as stag_amount
FROM bookings b
LEFT JOIN events e ON b.event_id = e.id
LEFT JOIN profiles p ON b.user_id = p.id;

-- Grant necessary permissions
GRANT SELECT ON booking_details TO authenticated;
GRANT SELECT ON booking_details TO anon;

-- Verify the changes
SELECT 
    column_name, 
    data_type, 
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'bookings' 
AND column_name IN ('womens_tickets', 'couple_tickets', 'stag_tickets')
ORDER BY column_name;
