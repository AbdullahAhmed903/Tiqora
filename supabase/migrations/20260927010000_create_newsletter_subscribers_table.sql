-- ==============================================================================
-- Tiqora Database Migration: Newsletter Subscribers Table & RLS
-- Migration: 20260927010000_create_newsletter_subscribers_table.sql
-- ==============================================================================

-- ==============================================================================
-- 1. TABLE: public.newsletter_subscribers
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
    source TEXT NOT NULL DEFAULT 'footer',
    ip_hash TEXT,
    subscribed_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    unsubscribed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,

    -- Data integrity constraints
    CONSTRAINT newsletter_email_not_empty CHECK (char_length(trim(email)) > 0),
    CONSTRAINT newsletter_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- ==============================================================================
-- 2. INDEXES
-- ==============================================================================

-- Case-insensitive unique index (prevents user@tiqora.com vs USER@tiqora.com duplicates)
CREATE UNIQUE INDEX IF NOT EXISTS idx_newsletter_subscribers_email_unique 
ON public.newsletter_subscribers (LOWER(TRIM(email)));

-- Filter by status (active vs unsubscribed)
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status 
ON public.newsletter_subscribers (status);

-- Sort by subscription timestamp for campaign exports and admin review
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_subscribed_at 
ON public.newsletter_subscribers (subscribed_at DESC);

-- ==============================================================================
-- 3. AUTOMATIC UPDATED_AT TRIGGER
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.set_newsletter_subscribers_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_newsletter_subscribers_updated_at ON public.newsletter_subscribers;
CREATE TRIGGER trigger_newsletter_subscribers_updated_at
    BEFORE UPDATE ON public.newsletter_subscribers
    FOR EACH ROW
    EXECUTE FUNCTION public.set_newsletter_subscribers_updated_at();

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- 4.1 SELECT: Only Admins can view newsletter subscribers (protects subscriber privacy)
DROP POLICY IF EXISTS "Admins can view all newsletter subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admins can view all newsletter subscribers"
    ON public.newsletter_subscribers FOR SELECT
    TO authenticated
    USING (public.is_admin(auth.uid()));

-- 4.2 INSERT: Anyone can subscribe (both anonymous visitors and authenticated users)
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe to newsletter"
    ON public.newsletter_subscribers FOR INSERT
    WITH CHECK (true);

-- 4.3 UPDATE: Admins can update any subscription status; Service Role / Backend for re-activation
DROP POLICY IF EXISTS "Only admins can update newsletter subscriptions" ON public.newsletter_subscribers;
CREATE POLICY "Only admins can update newsletter subscriptions"
    ON public.newsletter_subscribers FOR UPDATE
    TO authenticated
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

-- 4.4 DELETE: Only Admins can delete or purge subscriber records
DROP POLICY IF EXISTS "Only admins can delete newsletter subscriptions" ON public.newsletter_subscribers;
CREATE POLICY "Only admins can delete newsletter subscriptions"
    ON public.newsletter_subscribers FOR DELETE
    TO authenticated
    USING (public.is_admin(auth.uid()));
