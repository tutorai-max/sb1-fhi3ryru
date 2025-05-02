/*
  # Add Contract Form Fields

  1. Changes
    - Add new columns to aqua_tutor_contracts table for form data
    - Add indexes for better performance

  2. Security
    - Maintain existing RLS policies
*/

CREATE TABLE IF NOT EXISTS aqua_tutor_contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  postal_code text NOT NULL,
  prefecture text NOT NULL,
  city text NOT NULL,
  sub_area text,
  building_room text,
  representative_name text NOT NULL,
  contact_person text NOT NULL,
  contact_phone text NOT NULL,
  contact_email text NOT NULL,
  initial_fee text NOT NULL,
  monthly_fee text NOT NULL,
  excess_fee text NOT NULL,
  option_fee text NOT NULL,
  payment_method text NOT NULL,
  notes text,
  pdf_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE aqua_tutor_contracts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own contracts"
  ON aqua_tutor_contracts
  FOR SELECT
  USING (auth.uid() IN (
    SELECT applicant_id FROM applications 
    WHERE applications.contract_id = aqua_tutor_contracts.id
  ));

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_aqua_tutor_contracts_created_at 
  ON aqua_tutor_contracts(created_at);