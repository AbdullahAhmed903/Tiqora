-- ==============================================================================
-- Tiqora Database Migration: Categories Table, RLS & Storage Bucket
-- Migration: 20260914125000_create_categories_table_and_storage.sql
-- ==============================================================================

-- ==============================================================================
-- 1. TABLE: public.categories
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    pic TEXT,
    small_description TEXT,
    icon TEXT,
    is_popular BOOLEAN DEFAULT false NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    display_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,

    -- Data integrity constraints
    CONSTRAINT category_name_not_empty CHECK (char_length(trim(name)) > 0),
    CONSTRAINT category_slug_valid CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

-- Case-insensitive unique index on slug for dynamic routing (/events/[category])
CREATE UNIQUE INDEX IF NOT EXISTS categories_slug_lower_idx ON public.categories (LOWER(slug));

-- Partial indexes for high-selectivity filtering and ordering
CREATE INDEX IF NOT EXISTS idx_categories_popular_display ON public.categories (display_order) 
WHERE is_popular = true;

CREATE INDEX IF NOT EXISTS idx_categories_active_display ON public.categories (display_order) 
WHERE is_active = true;

-- ==============================================================================
-- 2. AUTOMATIC UPDATED_AT TRIGGER
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.set_categories_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_categories_updated_at ON public.categories;
CREATE TRIGGER trigger_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW
    EXECUTE FUNCTION public.set_categories_updated_at();

-- ==============================================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Anyone can read active categories; Admins can see all (including unpublished drafts)
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
CREATE POLICY "Categories are viewable by everyone"
    ON public.categories FOR SELECT
    USING (is_active = true OR public.is_admin(auth.uid()));

-- Only Admins can insert categories
DROP POLICY IF EXISTS "Only admins can insert categories" ON public.categories;
CREATE POLICY "Only admins can insert categories"
    ON public.categories FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin(auth.uid()));

-- Only Admins can update categories
DROP POLICY IF EXISTS "Only admins can update categories" ON public.categories;
CREATE POLICY "Only admins can update categories"
    ON public.categories FOR UPDATE
    TO authenticated
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

-- Only Admins can delete categories
DROP POLICY IF EXISTS "Only admins can delete categories" ON public.categories;
CREATE POLICY "Only admins can delete categories"
    ON public.categories FOR DELETE
    TO authenticated
    USING (public.is_admin(auth.uid()));

-- ==============================================================================
-- 4. SUPABASE STORAGE: category-images Bucket & Storage Policies
-- ==============================================================================

-- Create or update the storage bucket with 2MB limit and image MIME restrictions
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'category-images',
    'category-images',
    true,
    2097152, -- 2MB max file size (2 * 1024 * 1024 bytes)
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 2097152,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif', 'image/avif'];

-- Anyone can read category images (public bucket)
DROP POLICY IF EXISTS "Category images are publicly accessible" ON storage.objects;
CREATE POLICY "Category images are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'category-images');

-- Only Admins can upload category images
DROP POLICY IF EXISTS "Only admins can upload category images" ON storage.objects;
CREATE POLICY "Only admins can upload category images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'category-images' AND
        public.is_admin(auth.uid())
    );

-- Only Admins can update category images
DROP POLICY IF EXISTS "Only admins can update category images" ON storage.objects;
CREATE POLICY "Only admins can update category images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'category-images' AND
        public.is_admin(auth.uid())
    );

-- Only Admins can delete category images
DROP POLICY IF EXISTS "Only admins can delete category images" ON storage.objects;
CREATE POLICY "Only admins can delete category images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'category-images' AND
        public.is_admin(auth.uid())
    );
