-- Migration script to add Razorpay fields to bookings table
-- Run this in your Supabase SQL editor

-- Add new columns for Razorpay integration
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT,
ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT,
ADD COLUMN IF NOT EXISTS razorpay_signature TEXT,
ADD COLUMN IF NOT EXISTS receipt_id TEXT,
ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS failure_reason TEXT,
ADD COLUMN IF NOT EXISTS amount_paid DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS webhook_confirmed BOOLEAN DEFAULT FALSE;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bookings_razorpay_order_id ON bookings(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_bookings_razorpay_payment_id ON bookings(razorpay_payment_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id_status ON bookings(user_id, status);

-- Update existing bookings to have proper status
UPDATE bookings 
SET status = 'confirmed' 
WHERE status IS NULL OR status = '';

-- Add constraints
ALTER TABLE bookings 
ADD CONSTRAINT bookings_status_check 
CHECK (status IN ('pending', 'confirmed', 'failed', 'cancelled', 'refunded'));

-- Add comments for documentation
COMMENT ON COLUMN bookings.razorpay_order_id IS 'Razorpay order ID for payment tracking';
COMMENT ON COLUMN bookings.razorpay_payment_id IS 'Razorpay payment ID after successful payment';
COMMENT ON COLUMN bookings.razorpay_signature IS 'Razorpay signature for payment verification';
COMMENT ON COLUMN bookings.receipt_id IS 'Unique receipt ID for the booking';
COMMENT ON COLUMN bookings.confirmed_at IS 'Timestamp when booking was confirmed';
COMMENT ON COLUMN bookings.failure_reason IS 'Reason for payment failure';
COMMENT ON COLUMN bookings.amount_paid IS 'Actual amount paid (may differ from total_amount due to discounts)';
COMMENT ON COLUMN bookings.webhook_confirmed IS 'Whether booking was confirmed via webhook';

-- Create a view for booking details with event information
CREATE OR REPLACE VIEW booking_details AS
SELECT 
    b.*,
    e.title as event_title,
    e.event_date,
    e.dj_name,
    e.poster_image_url,
    p.full_name as user_name,
    p.email as user_email
FROM bookings b
LEFT JOIN events e ON b.event_id = e.id
LEFT JOIN profiles p ON b.user_id = p.id;

-- Grant necessary permissions
GRANT SELECT ON booking_details TO authenticated;
GRANT SELECT ON booking_details TO anon;