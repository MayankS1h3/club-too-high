-- Alternative Migration: Create separate ticket_types table
-- This approach is more flexible for future expansion

-- Step 1: Create ticket_types table
CREATE TABLE ticket_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  ticket_type VARCHAR(50) NOT NULL, -- 'women', 'couple', 'stag'
  price INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Create index for better performance
CREATE INDEX idx_ticket_types_event_id ON ticket_types(event_id);

-- Step 3: Enable RLS (Row Level Security)
ALTER TABLE ticket_types ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS policies
CREATE POLICY "Ticket types are viewable by everyone" ON ticket_types
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert ticket types" ON ticket_types
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update ticket types" ON ticket_types
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete ticket types" ON ticket_types
  FOR DELETE USING (auth.role() = 'authenticated');

-- Step 5: Migrate existing data
INSERT INTO ticket_types (event_id, ticket_type, price)
SELECT 
  id as event_id,
  'women' as ticket_type,
  ticket_price as price
FROM events 
WHERE ticket_price IS NOT NULL;

INSERT INTO ticket_types (event_id, ticket_type, price)
SELECT 
  id as event_id,
  'couple' as ticket_type,
  ticket_price as price
FROM events 
WHERE ticket_price IS NOT NULL;

INSERT INTO ticket_types (event_id, ticket_type, price)
SELECT 
  id as event_id,
  'stag' as ticket_type,
  ticket_price as price
FROM events 
WHERE ticket_price IS NOT NULL;

-- Verify the changes
SELECT e.title, tt.ticket_type, tt.price 
FROM events e 
JOIN ticket_types tt ON e.id = tt.event_id 
ORDER BY e.title, tt.ticket_type;