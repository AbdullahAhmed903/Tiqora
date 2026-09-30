-- ==============================================================================
-- Tiqora Database Migration: Contact Submissions Table, Storage & RLS
-- Migration: 20260927210000_create_contact_submissions_table_and_storage.sql
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. TABLE: public.contact_submissions
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    department TEXT NOT NULL CHECK (department IN ('tickets', 'payments', 'stadium', 'organizers', 'technical', 'general')),
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'pending', 'resolved')),
    subject TEXT,
    message TEXT NOT NULL,
    attachment_url TEXT,
    attachment_path TEXT,
    attachment_name TEXT,
    attachment_size_bytes BIGINT,
    attachment_mime_type TEXT,
    ip_address TEXT,
    admin_notes TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,

    -- Data integrity constraints
    CONSTRAINT contact_name_not_empty CHECK (char_length(trim(full_name)) >= 2),
    CONSTRAINT contact_email_not_empty CHECK (char_length(trim(email)) >= 5),
    CONSTRAINT contact_phone_not_empty CHECK (char_length(trim(phone)) >= 6),
    CONSTRAINT contact_message_not_empty CHECK (char_length(trim(message)) >= 10)
);

-- ------------------------------------------------------------------------------
-- 2. INDEXES
-- ------------------------------------------------------------------------------

-- Unique lookup by ticket number (e.g. #TIQ-783921)
CREATE UNIQUE INDEX IF NOT EXISTS idx_contact_ticket_number 
ON public.contact_submissions (ticket_number);

-- Fast lookup for quota check and user history by email
CREATE INDEX IF NOT EXISTS idx_contact_email_lower 
ON public.contact_submissions (LOWER(TRIM(email)));

-- Filter by ticket workflow status (new, pending, resolved)
CREATE INDEX IF NOT EXISTS idx_contact_status 
ON public.contact_submissions (status);

-- Filter by department
CREATE INDEX IF NOT EXISTS idx_contact_department 
ON public.contact_submissions (department);

-- Chronological sorting for admin inbox
CREATE INDEX IF NOT EXISTS idx_contact_created_at 
ON public.contact_submissions (created_at DESC);

-- Composite index for cumulative 30-day storage quota calculation
CREATE INDEX IF NOT EXISTS idx_contact_storage_quota 
ON public.contact_submissions (LOWER(TRIM(email)), created_at DESC) 
WHERE attachment_size_bytes IS NOT NULL;

-- ------------------------------------------------------------------------------
-- 3. AUTOMATIC UPDATED_AT TRIGGER
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.set_contact_submissions_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_contact_submissions_updated_at ON public.contact_submissions;
CREATE TRIGGER trigger_contact_submissions_updated_at
    BEFORE UPDATE ON public.contact_submissions
    FOR EACH ROW
    EXECUTE FUNCTION public.set_contact_submissions_updated_at();

-- ------------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- 4.1 Anyone can submit (both anonymous visitors and authenticated users)
DROP POLICY IF EXISTS "Anyone can submit contact inquiry" ON public.contact_submissions;
CREATE POLICY "Anyone can submit contact inquiry"
    ON public.contact_submissions FOR INSERT
    WITH CHECK (true);

-- 4.2 Only Admins can view contact submissions
DROP POLICY IF EXISTS "Only admins can view contact submissions" ON public.contact_submissions;
CREATE POLICY "Only admins can view contact submissions"
    ON public.contact_submissions FOR SELECT
    TO authenticated
    USING (public.is_admin(auth.uid()));

-- 4.3 Only Admins can update status and admin notes
DROP POLICY IF EXISTS "Only admins can update contact submissions" ON public.contact_submissions;
CREATE POLICY "Only admins can update contact submissions"
    ON public.contact_submissions FOR UPDATE
    TO authenticated
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

-- 4.4 Only Admins can delete contact submissions
DROP POLICY IF EXISTS "Only admins can delete contact submissions" ON public.contact_submissions;
CREATE POLICY "Only admins can delete contact submissions"
    ON public.contact_submissions FOR DELETE
    TO authenticated
    USING (public.is_admin(auth.uid()));

-- ------------------------------------------------------------------------------
-- 5. SUPABASE STORAGE BUCKET: contact-attachments
-- ------------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'contact-attachments',
    'contact-attachments',
    false,
    2097152, -- 2MB max per file (2 * 1024 * 1024 bytes)
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
    public = false,
    file_size_limit = 2097152,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];

-- 5.1 Storage Policies
DROP POLICY IF EXISTS "Public can view contact attachments" ON storage.objects;

DROP POLICY IF EXISTS "Anyone can upload contact attachments" ON storage.objects;
CREATE POLICY "Anyone can upload contact attachments"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'contact-attachments');

DROP POLICY IF EXISTS "Only admins can view contact attachments" ON storage.objects;
CREATE POLICY "Only admins can view contact attachments"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'contact-attachments' AND
        public.is_admin(auth.uid())
    );

DROP POLICY IF EXISTS "Only admins can delete contact attachments" ON storage.objects;
CREATE POLICY "Only admins can delete contact attachments"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'contact-attachments' AND
        public.is_admin(auth.uid())
    );
