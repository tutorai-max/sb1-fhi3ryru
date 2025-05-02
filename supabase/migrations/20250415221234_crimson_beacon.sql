/*
  # Add Inquiries Table and Admin Flag

  1. New Tables
    - `inquiries`
      - `id` (uuid, primary key)
      - `type` (text, inquiry type)
      - `company_name` (text)
      - `representative_name` (text)
      - `email` (text)
      - `phone` (text)
      - `message` (text)
      - `created_at` (timestamp)

  2. Changes
    - Add `is_admin` column to `profiles` table

  3. Security
    - Enable RLS on `inquiries` table
    - Add policies for secure access control
*/

-- Add is_admin column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Create inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('document_request', 'demo_request', 'press', 'contact', 'other')),
  company_name text NOT NULL,
  representative_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Inquiries policies
CREATE POLICY "Admins can view all inquiries"
  ON inquiries
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Anyone can create inquiries"
  ON inquiries
  FOR INSERT
  WITH CHECK (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at);