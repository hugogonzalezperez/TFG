-- M-3: Soft Delete en bookings
-- Sustituye hard DELETE por deleted_at timestamp.
-- Las queries deben filtrar WHERE deleted_at IS NULL.

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_bookings_not_deleted
  ON public.bookings (renter_id, created_at DESC)
  WHERE deleted_at IS NULL;
