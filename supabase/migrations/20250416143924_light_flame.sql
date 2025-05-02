/*
  # Add Contract Details and Signature Support

  1. Changes to contracts table
    - Add amount column
    - Add training_items column
    - Add manual_count column
    - Add special_notes column

  2. Add signatures table
    - Store contract signatures
    - Track signature status and timestamps

  3. Security
    - Update RLS policies for new functionality
*/

-- Add new columns to contracts table
ALTER TABLE contracts 
ADD COLUMN IF NOT EXISTS amount integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS training_items text[] NOT NULL DEFAULT '{}',
ADD COLUMN IF NOT EXISTS manual_count integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS special_notes text;

-- Create signatures table
CREATE TABLE IF NOT EXISTS signatures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid REFERENCES applications(id) ON DELETE CASCADE,
  signature_data text NOT NULL,
  signed_at timestamptz DEFAULT now(),
  signed_by uuid REFERENCES profiles(id),
  email_sent boolean DEFAULT false,
  email_sent_at timestamptz,
  pdf_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE signatures ENABLE ROW LEVEL SECURITY;

-- Create policies for signatures
CREATE POLICY "Users can view their own signatures"
  ON signatures
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM applications
      WHERE applications.id = signatures.application_id
      AND applications.applicant_id = auth.uid()
    )
  );

CREATE POLICY "Users can create signatures for their applications"
  ON signatures
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM applications
      WHERE applications.id = application_id
      AND applications.applicant_id = auth.uid()
    )
  );

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_signatures_application_id ON signatures(application_id);
CREATE INDEX IF NOT EXISTS idx_signatures_signed_by ON signatures(signed_by);