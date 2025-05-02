/*
  # Add Contract Confirmation Table

  1. New Tables
    - `contract_confirmations`
      - `id` (uuid, primary key)
      - `application_id` (uuid, references applications)
      - `contract_data` (jsonb, contract form data)
      - `applicant_info` (jsonb, applicant information)
      - `contact_info` (jsonb, contact person information)
      - `created_at` (timestamp)
      - `confirmed_at` (timestamp)
      - `pdf_url` (text)

  2. Security
    - Enable RLS
    - Add policies for secure access
*/

CREATE TABLE IF NOT EXISTS contract_confirmations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid REFERENCES applications(id) ON DELETE CASCADE,
  contract_data jsonb NOT NULL,
  applicant_info jsonb NOT NULL,
  contact_info jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  confirmed_at timestamptz,
  pdf_url text,
  CONSTRAINT contract_data_check CHECK (contract_data ? 'initial_cost' AND contract_data ? 'monthly_cost'),
  CONSTRAINT applicant_info_check CHECK (applicant_info ? 'company_name' AND applicant_info ? 'representative_name'),
  CONSTRAINT contact_info_check CHECK (contact_info ? 'name' AND contact_info ? 'email')
);

-- Enable RLS
ALTER TABLE contract_confirmations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own confirmations"
  ON contract_confirmations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM applications
      WHERE applications.id = contract_confirmations.application_id
      AND applications.applicant_id = auth.uid()
    )
  );

CREATE POLICY "Users can create confirmations for their applications"
  ON contract_confirmations
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM applications
      WHERE applications.id = application_id
      AND applications.applicant_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX idx_contract_confirmations_application_id 
  ON contract_confirmations(application_id);
CREATE INDEX idx_contract_confirmations_created_at 
  ON contract_confirmations(created_at);