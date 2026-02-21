-- Add vehicle information columns to bookings table
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS vehicle_plate TEXT,
ADD COLUMN IF NOT EXISTS vehicle_description TEXT;

-- Update existing rows if any (optional, keeping them null or empty is fine for now)
COMMENT ON COLUMN public.bookings.vehicle_plate IS 'Spanish license plate (e.g., 0000 AAA or MA 0000 AB)';
COMMENT ON COLUMN public.bookings.vehicle_description IS 'Brand and model of the car';
