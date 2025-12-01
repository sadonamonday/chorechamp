-- Create verifications table
CREATE TABLE IF NOT EXISTS public.verifications (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add verification_id to verification_documents if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'verification_documents' AND column_name = 'verification_id') THEN
        ALTER TABLE public.verification_documents ADD COLUMN verification_id bigint REFERENCES public.verifications(id);
    END IF;
END $$;

-- RLS Policies for verifications
ALTER TABLE public.verifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own verifications" ON public.verifications;
CREATE POLICY "Users can view their own verifications"
ON public.verifications FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own verifications" ON public.verifications;
CREATE POLICY "Users can insert their own verifications"
ON public.verifications FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for verification_documents
ALTER TABLE public.verification_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own verification documents" ON public.verification_documents;
CREATE POLICY "Users can view their own verification documents"
ON public.verification_documents FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own verification documents" ON public.verification_documents;
CREATE POLICY "Users can insert their own verification documents"
ON public.verification_documents FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Storage Bucket Setup (Automated)
INSERT INTO storage.buckets (id, name, public)
VALUES ('verification-docs', 'verification-docs', false)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'verification-docs' AND
  auth.uid() = owner
);

DROP POLICY IF EXISTS "Allow users to view own files" ON storage.objects;
CREATE POLICY "Allow users to view own files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'verification-docs' AND
  auth.uid() = owner
);
