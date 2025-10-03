-- Create a test event with the new pricing structure
-- Run this in Supabase SQL Editor to add sample data

INSERT INTO events (
  title,
  description,
  event_date,
  dj_name,
  women_price,
  couple_price,
  stag_price,
  poster_image_url
) VALUES (
  'Saturday Night Fever',
  'The hottest party in town with top DJs and amazing vibes. Join us for an unforgettable night of music, dancing, and pure energy.',
  '2025-10-12T22:00:00+00:00',
  'DJ Snake',
  800,  -- women entry
  1500, -- couple entry  
  2000, -- stag entry
  null
);

INSERT INTO events (
  title,
  description,
  event_date,
  dj_name,
  women_price,
  couple_price,
  stag_price,
  poster_image_url
) VALUES (
  'Bollywood Bash',
  'Dance to the beats of Bollywood hits with special themed decorations and costume contest. Experience the vibrant colors and energy of Indian cinema.',
  '2025-10-15T21:30:00+00:00',
  'DJ Aqeel',
  600,  -- women entry (discounted)
  1200, -- couple entry
  1800, -- stag entry
  null
);

INSERT INTO events (
  title,
  description,
  event_date,
  dj_name,
  women_price,
  couple_price,
  stag_price,
  poster_image_url
) VALUES (
  'Electronic Paradise',
  'Immerse yourself in electronic beats with international DJs and state-of-the-art sound system. A night of pure electronic music bliss.',
  '2025-10-20T23:00:00+00:00',
  'Armin van Buuren',
  1000, -- women entry
  2000, -- couple entry
  3000, -- stag entry (premium event)
  null
);

-- Verify the events were created
SELECT id, title, event_date, women_price, couple_price, stag_price FROM events ORDER BY event_date;