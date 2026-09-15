-- ==============================================================================
-- Tiqora Database Migration: Fix Profile Role Protection & Sync JWT App Metadata
-- Migration: 20260914152500_fix_profile_role_protection_and_jwt_sync.sql
-- ==============================================================================

-- ==============================================================================
-- 1. FIX: ALLOW DASHBOARD & SERVICE_ROLE TO UPDATE USER ROLES
-- ==============================================================================
-- In the original trigger, public.is_admin(auth.uid()) was checked unconditionally.
-- When executing via Supabase Console (SQL Editor / Table Editor) or backend service_role,
-- auth.uid() is NULL, which evaluated to false and triggered an Access Denied error.
-- This update only restricts role modifications when invoked by authenticated web clients.

CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If the role column is changing:
  -- Only enforce the admin check if the query originates from an authenticated end-user session.
  -- If auth.uid() IS NULL or the connection is service_role (e.g. Supabase Dashboard SQL/Table Editor), allow it.
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF auth.uid() IS NOT NULL AND auth.role() = 'authenticated' THEN
      IF NOT public.is_admin(auth.uid()) THEN
        RAISE EXCEPTION 'Access Denied: Only administrators can modify user roles.';
      END IF;
    END IF;
  END IF;

  -- Automatically update timestamp
  NEW.updated_at := timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_profile_role ON public.profiles;
CREATE TRIGGER trg_protect_profile_role
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_role();

-- ==============================================================================
-- 2. JWT CUSTOM CLAIMS: SYNC PROFILE ROLE TO AUTH.USERS (0-DB-QUERY AUTH)
-- ==============================================================================
-- Automatically mirrors public.profiles.role into auth.users.raw_app_meta_data.
-- This allows Server Actions and RSCs to verify admin access directly from the
-- signed JWT payload (user.app_metadata.role) without sending queries to the profiles table.

CREATE OR REPLACE FUNCTION public.sync_profile_role_to_app_metadata()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE auth.users
  SET raw_app_meta_data = 
    coalesce(raw_app_meta_data, '{}'::jsonb) || 
    jsonb_build_object('role', NEW.role)
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_sync_profile_role ON public.profiles;
CREATE TRIGGER trigger_sync_profile_role
  AFTER INSERT OR UPDATE OF role ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_profile_role_to_app_metadata();

-- ==============================================================================
-- 3. ONE-TIME BACKFILL: SYNC ALL EXISTING USER ROLES TO APP_METADATA
-- ==============================================================================
UPDATE auth.users u
SET raw_app_meta_data = 
  coalesce(u.raw_app_meta_data, '{}'::jsonb) || 
  jsonb_build_object('role', p.role)
FROM public.profiles p
WHERE u.id = p.id;
