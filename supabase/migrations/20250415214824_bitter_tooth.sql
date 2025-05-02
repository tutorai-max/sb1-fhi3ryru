/*
  # Contract Management System Schema

  1. New Tables
    - `contracts`
      - `id` (uuid, primary key)
      - `name` (text, contract template name)
      - `description` (text)
      - `terms` (text, contract terms)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `is_active` (boolean)

    - `applications`
      - `id` (uuid, primary key)
      - `contract_id` (uuid, references contracts)
      - `applicant_id` (uuid, references profiles)
      - `sales_rep_id` (uuid, references profiles)
      - `status` (text, application status)
      - `company_name` (text)
      - `company_address` (text)
      - `representative_name` (text)
      - `phone_number` (text)
      - `email` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `submitted_at` (timestamp)
      - `approved_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for secure access control
*/

-- Create contracts table
CREATE TABLE IF NOT EXISTS contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  terms text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id uuid REFERENCES contracts(id) ON DELETE CASCADE,
  applicant_id uuid REFERENCES profiles(id),
  sales_rep_id uuid REFERENCES profiles(id),
  status text NOT NULL CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected')) DEFAULT 'draft',
  company_name text NOT NULL,
  company_address text NOT NULL,
  representative_name text NOT NULL,
  phone_number text NOT NULL,
  email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  submitted_at timestamptz,
  approved_at timestamptz
);

-- Enable RLS
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Contracts policies
CREATE POLICY "Anyone can view active contracts"
  ON contracts
  FOR SELECT
  USING (is_active = true);

-- Applications policies
CREATE POLICY "Users can view their own applications"
  ON applications
  FOR SELECT
  USING (auth.uid() = applicant_id);

CREATE POLICY "Users can create their own applications"
  ON applications
  FOR INSERT
  WITH CHECK (auth.uid() = applicant_id);

CREATE POLICY "Users can update their own draft applications"
  ON applications
  FOR UPDATE
  USING (auth.uid() = applicant_id AND status = 'draft');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_applications_applicant_id ON applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_applications_contract_id ON applications(contract_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);