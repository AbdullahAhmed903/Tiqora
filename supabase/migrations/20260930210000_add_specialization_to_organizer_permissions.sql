-- ==============================================================================
-- Tiqora Database Migration: Add Specializations to Organizer Permissions
-- Migration: 20260930210000_add_specialization_to_organizer_permissions.sql
-- ==============================================================================

-- 1. Add specializations array column to organizer_permissions table
-- Allows organizers to have single or multiple domain specialties (e.g., Football only, Music, or multiple)
ALTER TABLE public.organizer_permissions
ADD COLUMN IF NOT EXISTS specializations text[] DEFAULT '{}' NOT NULL;

-- 2. Create GIN index on specializations for high-speed queries
CREATE INDEX IF NOT EXISTS idx_organizer_permissions_specializations 
ON public.organizer_permissions USING GIN (specializations);

-- 3. Schema documentation comment
COMMENT ON COLUMN public.organizer_permissions.specializations IS 
'Domain event categories or specializations (e.g., {"football"}, {"music", "theatre"}) assigned to this organizer permission.';
