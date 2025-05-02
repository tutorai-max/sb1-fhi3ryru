/*
  # Add Contact Fields to Applications Table

  1. Changes
    - Add contact_name column
    - Add contact_email column

  2. Security
    - No changes to RLS policies needed
*/

-- Add new columns to applications table
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS contact_name text,
ADD COLUMN IF NOT EXISTS contact_email text;