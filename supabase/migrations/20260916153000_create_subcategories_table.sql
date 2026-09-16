-- ==============================================================================
-- Tiqora Database Migration: Subcategories Table, Indexes & RLS Policies
-- Migration: 20260916153000_create_subcategories_table.sql
-- ==============================================================================

-- ==============================================================================
-- 1. TABLE: public.subcategories
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.subcategories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    icon TEXT DEFAULT 'Tag',
    is_published BOOLEAN DEFAULT true NOT NULL,
    display_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,

    -- Data integrity constraints
    CONSTRAINT subcategory_name_not_empty CHECK (char_length(trim(name)) > 0),
    CONSTRAINT subcategory_slug_valid CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
    CONSTRAINT subcategories_category_slug_unique UNIQUE (category_id, slug)
);

-- ==============================================================================
-- 2. INDEXES
-- ==============================================================================

-- Foreign key lookup index
CREATE INDEX IF NOT EXISTS idx_subcategories_category_id ON public.subcategories (category_id);

-- Partial index for active published subcategories per category
CREATE INDEX IF NOT EXISTS idx_subcategories_published ON public.subcategories (category_id) 
WHERE is_published = true;

-- Case-insensitive unique slug index per parent category for routing
CREATE INDEX IF NOT EXISTS idx_subcategories_slug ON public.subcategories (category_id, LOWER(slug));

-- ==============================================================================
-- 3. AUTOMATIC UPDATED_AT TRIGGER
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.set_subcategories_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_subcategories_updated_at ON public.subcategories;
CREATE TRIGGER trigger_subcategories_updated_at
    BEFORE UPDATE ON public.subcategories
    FOR EACH ROW
    EXECUTE FUNCTION public.set_subcategories_updated_at();

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;

-- Anyone can view published subcategories; Admins can see all (including unpublished drafts)
DROP POLICY IF EXISTS "Published subcategories are viewable by everyone" ON public.subcategories;
CREATE POLICY "Published subcategories are viewable by everyone"
    ON public.subcategories FOR SELECT
    USING (is_published = true OR public.is_admin(auth.uid()));

-- Only Admins can insert subcategories
DROP POLICY IF EXISTS "Only admins can insert subcategories" ON public.subcategories;
CREATE POLICY "Only admins can insert subcategories"
    ON public.subcategories FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin(auth.uid()));

-- Only Admins can update subcategories
DROP POLICY IF EXISTS "Only admins can update subcategories" ON public.subcategories;
CREATE POLICY "Only admins can update subcategories"
    ON public.subcategories FOR UPDATE
    TO authenticated
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

-- Only Admins can delete subcategories
DROP POLICY IF EXISTS "Only admins can delete subcategories" ON public.subcategories;
CREATE POLICY "Only admins can delete subcategories"
    ON public.subcategories FOR DELETE
    TO authenticated
    USING (public.is_admin(auth.uid()));
