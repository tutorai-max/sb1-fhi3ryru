/*
  # Storage for Contract PDFs

  1. New Tables
    - `buckets` for storing file metadata
    - `objects` for storing file objects
  
  2. Security
    - Enable RLS on objects table
    - Add policies for secure access control
*/

-- Create buckets table
CREATE TABLE IF NOT EXISTS storage_buckets (
  id text PRIMARY KEY,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT buckets_name_check CHECK (name ~* '^[A-Za-z0-9_-]+$')
);

-- Create objects table
CREATE TABLE IF NOT EXISTS storage_objects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_id text NOT NULL REFERENCES storage_buckets(id),
  name text NOT NULL,
  size bigint,
  mime_type text,
  etag text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_accessed_at timestamptz DEFAULT now(),
  metadata jsonb,
  path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/')) STORED,
  CONSTRAINT objects_name_check CHECK (name ~* '^[A-Za-z0-9_-]+/[A-Za-z0-9_.-]+$')
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS objects_path_tokens_idx ON storage_objects USING gin(path_tokens);
CREATE INDEX IF NOT EXISTS objects_bucket_id_idx ON storage_objects(bucket_id);

-- Enable RLS
ALTER TABLE storage_objects ENABLE ROW LEVEL SECURITY;

-- Create bucket for contracts
INSERT INTO storage_buckets (id, name)
VALUES ('contracts', 'contracts')
ON CONFLICT DO NOTHING;

-- Create policies for objects
CREATE POLICY "Users can view their own contracts"
  ON storage_objects
  FOR SELECT
  USING (
    bucket_id = 'contracts'
    AND (
      EXISTS (
        SELECT 1 FROM applications
        WHERE applications.id::text = SPLIT_PART(name, '/', 2)
        AND applications.applicant_id = auth.uid()
      )
      OR
      EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
      )
    )
  );

CREATE POLICY "Only system can upload contracts"
  ON storage_objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'contracts'
    AND auth.role() = 'service_role'
  );