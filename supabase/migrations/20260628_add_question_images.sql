-- Add image support to quiz questions and options
-- Creates image_url columns, storage bucket, and RLS policies

BEGIN;

-- Add image_url column to question tables
ALTER TABLE public.quiz_questions_year6 ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.quiz_questions_year9 ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add image_url column to option tables
ALTER TABLE public.quiz_options_year6 ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.quiz_options_year9 ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Create the storage bucket for question images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'question-images',
  'question-images',
  true,
  3145728, -- 3 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for the question-images bucket
CREATE POLICY "Authenticated users can view question images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'question-images');

CREATE POLICY "Authenticated users can upload question images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'question-images');

CREATE POLICY "Authenticated users can update question images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'question-images');

CREATE POLICY "Authenticated users can delete question images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'question-images');

COMMIT;
