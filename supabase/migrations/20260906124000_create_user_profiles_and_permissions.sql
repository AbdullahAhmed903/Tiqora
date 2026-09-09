-- ==============================================================================
-- Tiqora Database Migration: User Profiles, Roles, Permissions & Auth Triggers
-- Migration: 20260906124000_create_user_profiles_and_permissions.sql
-- ==============================================================================

-- 1. ENUMS & TYPES
-- ------------------------------------------------------------------------------

DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('user', 'organizer', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.user_status AS ENUM ('active', 'suspended');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.permission_section AS ENUM (
        'events',
        'venues',
        'tickets',
        'bookings',
        'coupons',
        'analytics',
        'support'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.access_level AS ENUM ('read', 'write');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- 2. TABLES: profiles, organizer_permissions & admin_audit_logs
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    email TEXT,
    full_name TEXT,
    phone_number TEXT,
    avatar_url TEXT,
    date_of_birth DATE,
    role public.user_role DEFAULT 'user'::public.user_role NOT NULL,
    status public.user_status DEFAULT 'active'::public.user_status NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,

    -- Constraints
    CONSTRAINT username_min_length CHECK (char_length(username) >= 3),
    CONSTRAINT username_valid_format CHECK (username ~ '^[a-zA-Z0-9_]+$')
);

-- Case-insensitive unique index for usernames
CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_lower_idx ON public.profiles (LOWER(username));

-- Partial indexes for high selectivity & write-performance:
-- 1. Staff roles: indexes only organizers and admins for management queries (< 1% of table)
CREATE INDEX IF NOT EXISTS idx_profiles_staff_roles ON public.profiles(role)
WHERE role IN ('organizer'::public.user_role, 'admin'::public.user_role);

-- 2. Suspended accounts: indexes only suspended users for moderation checks
CREATE INDEX IF NOT EXISTS idx_profiles_suspended ON public.profiles(status)
WHERE status = 'suspended'::public.user_status;

-- Organizer granular section permissions table
CREATE TABLE IF NOT EXISTS public.organizer_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    section public.permission_section NOT NULL,
    access_level public.access_level NOT NULL DEFAULT 'read'::public.access_level,
    granted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,

    CONSTRAINT unique_user_section_permission UNIQUE (user_id, section)
);

CREATE INDEX IF NOT EXISTS idx_organizer_permissions_user_id ON public.organizer_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_organizer_permissions_section ON public.organizer_permissions(section);

-- Admin audit logging for security governance
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_admin_id ON public.admin_audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_target_user ON public.admin_audit_logs(target_user_id);

-- ==============================================================================
-- 3. HELPER SECURITY FUNCTIONS (SECURITY DEFINER with pinned search_path)
-- ==============================================================================

-- Check if a user is an administrator (bypasses RLS recursion)
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role = 'admin'::public.user_role
  );
$$;

-- Check if a user is an organizer or admin
CREATE OR REPLACE FUNCTION public.is_organizer_or_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role IN ('admin'::public.user_role, 'organizer'::public.user_role)
  );
$$;

-- Check if an organizer has permission for a specific section
CREATE OR REPLACE FUNCTION public.has_organizer_permission(
  p_section public.permission_section,
  p_required_level public.access_level DEFAULT 'read'::public.access_level,
  p_user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role public.user_role;
  v_access public.access_level;
BEGIN
  -- 1. Check user role
  SELECT role INTO v_role FROM public.profiles WHERE id = p_user_id;

  -- Admin always has full unrestricted access to all sections
  IF v_role = 'admin'::public.user_role THEN
    RETURN TRUE;
  END IF;

  -- If user is not an organizer, access is denied
  IF v_role <> 'organizer'::public.user_role THEN
    RETURN FALSE;
  END IF;

  -- 2. Query organizer permissions
  SELECT access_level INTO v_access
  FROM public.organizer_permissions
  WHERE user_id = p_user_id AND section = p_section;

  IF v_access IS NULL THEN
    RETURN FALSE;
  END IF;

  -- 'write' access satisfies both 'read' and 'write' requirements
  IF p_required_level = 'read'::public.access_level THEN
    RETURN TRUE;
  ELSIF p_required_level = 'write'::public.access_level THEN
    RETURN v_access = 'write'::public.access_level;
  END IF;

  RETURN FALSE;
END;
$$;

-- ==============================================================================
-- 4. AUTOMATIC SIGNUP TRIGGER (Email/Password & Google OAuth)
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_raw_username TEXT;
  v_clean_username TEXT;
  v_final_username TEXT;
  v_counter INTEGER := 0;
  v_name TEXT;
  v_avatar TEXT;
  v_phone TEXT;
  v_dob DATE;
BEGIN
  -- 1. Read metadata provided during signup
  v_raw_username := NEW.raw_user_meta_data->>'username';
  v_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '');
  v_avatar := COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', '');
  v_phone := COALESCE(NEW.raw_user_meta_data->>'phone_number', NEW.phone, '');

  -- Safely parse date of birth if present
  BEGIN
    IF NEW.raw_user_meta_data->>'date_of_birth' IS NOT NULL THEN
      v_dob := (NEW.raw_user_meta_data->>'date_of_birth')::DATE;
    ELSE
      v_dob := NULL;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    v_dob := NULL;
  END;

  -- 2. Determine base username
  IF v_raw_username IS NOT NULL AND char_length(trim(v_raw_username)) >= 3 THEN
    -- Standard email signup with explicit username
    v_clean_username := lower(regexp_replace(trim(v_raw_username), '[^a-zA-Z0-9_]', '', 'g'));
  ELSE
    -- Google OAuth or missing username: generate from name or email prefix
    IF v_name <> '' THEN
      v_clean_username := lower(regexp_replace(trim(v_name), '[^a-zA-Z0-9_]', '', 'g'));
    ELSE
      v_clean_username := lower(regexp_replace(split_part(NEW.email, '@', 1), '[^a-zA-Z0-9_]', '', 'g'));
    END IF;
  END IF;

  -- Fallback if clean username is too short
  IF char_length(v_clean_username) < 3 THEN
    v_clean_username := 'user_' || substr(md5(random()::text), 1, 6);
  END IF;

  -- Truncate to maximum 24 chars to leave room for unique numeric suffixes
  v_clean_username := substr(v_clean_username, 1, 24);

  -- 3. Resolve username collision automatically
  v_final_username := v_clean_username;
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE lower(username) = lower(v_final_username)) LOOP
    v_counter := v_counter + 1;
    v_final_username := v_clean_username || '_' || floor(random() * 9000 + 1000)::text;
  END LOOP;

  -- 4. Insert into public.profiles
  -- ALWAYS enforce role = 'user' on public self-registration to prevent privilege escalation
  INSERT INTO public.profiles (
    id,
    username,
    email,
    full_name,
    phone_number,
    avatar_url,
    date_of_birth,
    role,
    status
  ) VALUES (
    NEW.id,
    v_final_username,
    NEW.email,
    NULLIF(v_name, ''),
    NULLIF(v_phone, ''),
    NULLIF(v_avatar, ''),
    v_dob,
    'user'::public.user_role,
    'active'::public.user_status
  );

  RETURN NEW;
END;
$$;

-- Trigger execution on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 5. ROLE TAMPERING PREVENTION & TIMESTAMPS TRIGGERS
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If role is changing, verify that the executing caller is an admin
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF NOT public.is_admin(auth.uid()) THEN
      RAISE EXCEPTION 'Access Denied: Only administrators can modify user roles.';
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

-- Auto-update timestamp on organizer_permissions
CREATE OR REPLACE FUNCTION public.update_organizer_permissions_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_organizer_permissions_updated_at ON public.organizer_permissions;
CREATE TRIGGER trg_organizer_permissions_updated_at
  BEFORE UPDATE ON public.organizer_permissions
  FOR EACH ROW EXECUTE FUNCTION public.update_organizer_permissions_updated_at();

-- ==============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizer_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- Profiles Policies
-- ------------------------------------------------------------------------------

-- Public profile info (username, avatar, etc.) is viewable
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

-- Authenticated users can update their own profile data (role escalation blocked by trigger)
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Administrators have full update privileges
DROP POLICY IF EXISTS "Admins have full update access on profiles" ON public.profiles;
CREATE POLICY "Admins have full update access on profiles"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Administrators have delete privileges
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;
CREATE POLICY "Admins can delete profiles"
  ON public.profiles FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- ------------------------------------------------------------------------------
-- Organizer Permissions Policies
-- ------------------------------------------------------------------------------

-- Organizers can inspect their assigned permissions; Admins can see all
DROP POLICY IF EXISTS "Organizers can view their own permissions" ON public.organizer_permissions;
CREATE POLICY "Organizers can view their own permissions"
  ON public.organizer_permissions FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR public.is_admin(auth.uid())
  );

-- Only Admins can insert organizer permissions
DROP POLICY IF EXISTS "Admins can insert organizer permissions" ON public.organizer_permissions;
CREATE POLICY "Admins can insert organizer permissions"
  ON public.organizer_permissions FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

-- Only Admins can update organizer permissions
DROP POLICY IF EXISTS "Admins can update organizer permissions" ON public.organizer_permissions;
CREATE POLICY "Admins can update organizer permissions"
  ON public.organizer_permissions FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Only Admins can delete organizer permissions
DROP POLICY IF EXISTS "Admins can delete organizer permissions" ON public.organizer_permissions;
CREATE POLICY "Admins can delete organizer permissions"
  ON public.organizer_permissions FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- ------------------------------------------------------------------------------
-- Admin Audit Logs Policies
-- ------------------------------------------------------------------------------

DROP POLICY IF EXISTS "Admins can view audit logs" ON public.admin_audit_logs;
CREATE POLICY "Admins can view audit logs"
  ON public.admin_audit_logs FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can insert audit logs" ON public.admin_audit_logs;
CREATE POLICY "Admins can insert audit logs"
  ON public.admin_audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

-- ==============================================================================
-- 7. SUPABASE STORAGE: Avatars Bucket & Policies
-- ==============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  2097152, -- 2MB max file size
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 2097152,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Anyone can read avatar images
DROP POLICY IF EXISTS "Avatars are publicly accessible" ON storage.objects;
CREATE POLICY "Avatars are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Authenticated users can upload to their own user directory: avatars/{user_id}/*
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Authenticated users can update their own avatar
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Authenticated users can delete their own avatar
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
