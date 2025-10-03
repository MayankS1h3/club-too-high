# Implementing Multiple Ticket Pricing for Events

## Step-by-Step Implementation Guide

### 1. Database Migration (Run in Supabase SQL Editor)

```sql
-- Add new pricing columns to events table
ALTER TABLE events 
ADD COLUMN women_price INTEGER,
ADD COLUMN couple_price INTEGER,
ADD COLUMN stag_price INTEGER;

-- Migrate existing data (copy current ticket_price to all new columns)
UPDATE events 
SET 
  women_price = ticket_price,
  couple_price = ticket_price,
  stag_price = ticket_price
WHERE ticket_price IS NOT NULL;
```

### 2. What's Changed

#### Frontend Updates:
- ✅ **Event Cards**: Now display all three pricing tiers (Women, Couple, Stag)
- ✅ **TypeScript Types**: Updated `Event` type to include new pricing fields
- ✅ **Helper Functions**: Created `event-pricing.ts` with functions to create/update events

#### Backend Schema:
- **events table** now has:
  - `women_price` (INTEGER)
  - `couple_price` (INTEGER) 
  - `stag_price` (INTEGER)
  - `ticket_price` (kept for backward compatibility)

### 3. How to Create Events with New Pricing

```typescript
import { createEvent } from '@/lib/event-pricing'

// Example: Create event with different pricing tiers
const newEvent = await createEvent({
  title: "Saturday Night Fever",
  event_date: "2025-10-15T22:00:00Z",
  dj_name: "DJ Snake",
  women_price: 800,      // ₹800 for women
  couple_price: 1500,    // ₹1500 for couples
  stag_price: 2000,      // ₹2000 for stag entry
  description: "The hottest party in town"
})
```

### 4. Event Card Display

The homepage now shows:
```
Women:  ₹800
Couple: ₹1500
Stag:   ₹2000
```

### 5. Next Steps (Optional)

After migration, you can:
1. **Remove old column**: `ALTER TABLE events DROP COLUMN ticket_price;`
2. **Make new columns required**: Add `NOT NULL` constraints
3. **Update admin forms**: Modify your event creation forms to capture all three prices

### 6. Backward Compatibility

- Existing events will have all three price tiers set to the original `ticket_price`
- The system falls back to `ticket_price` if new pricing isn't available
- You can gradually update existing events with proper pricing

## Benefits

✅ **Realistic Pricing**: Matches real nightclub pricing structure  
✅ **Better UX**: Users see exactly what they'll pay upfront  
✅ **Flexible**: Easy to set different promotional rates  
✅ **Backward Compatible**: Won't break existing data  

## Admin Interface Update Needed

You'll need to update your event creation/editing forms to include:
- Women Entry Price
- Couple Entry Price  
- Stag Entry Price

Instead of the single "Ticket Price" field.