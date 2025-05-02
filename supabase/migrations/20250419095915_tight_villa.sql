/*
  # Add PDF and Contract Fields

  1. Changes
    - Add PDF-related fields to applications table
    - Add contract template fields
    - Update RLS policies

  2. Security
    - Maintain existing RLS policies
    - Add new policies for PDF access
*/

-- Add PDF-related fields to applications
ALTER TABLE applications
ADD COLUMN IF NOT EXISTS original_pdf_url text,
ADD COLUMN IF NOT EXISTS signed_pdf_url text;

-- Create policy for PDF access
CREATE POLICY "Users can access their own PDFs"
  ON applications
  FOR SELECT
  USING (
    auth.uid() = applicant_id OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );