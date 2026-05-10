-- Add format validation for vehicle plates (Spanish format)
-- Accepts: modern "1234 ABC" or provincial "TF 1234 BA"
-- NOT VALID: validates future inserts/updates only; existing test data untouched

ALTER TABLE public.bookings
  ADD CONSTRAINT chk_vehicle_plate_format
  CHECK (
    vehicle_plate IS NULL
    OR vehicle_plate ~ '^([0-9]{4} [A-Z]{3}|[A-Z]{1,2} [0-9]{4} [A-Z]{2})$'
  ) NOT VALID;
