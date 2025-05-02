/*
  # Add SMTP Configuration Settings

  1. New Tables
    - `system_settings`
      - `id` (text, primary key)
      - `value` (text)
      - `description` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on system_settings table
    - Add policies for admin access only
*/

-- Create system_settings table
CREATE TABLE IF NOT EXISTS system_settings (
  id text PRIMARY KEY,
  value text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Only admins can view settings"
  ON system_settings
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Only admins can modify settings"
  ON system_settings
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Insert default SMTP settings
INSERT INTO system_settings (id, value, description) VALUES
  ('smtp_host', '', 'SMTP server hostname'),
  ('smtp_port', '587', 'SMTP server port'),
  ('smtp_username', '', 'SMTP authentication username'),
  ('smtp_password', '', 'SMTP authentication password'),
  ('smtp_from', '', 'Default sender email address'),
  ('smtp_secure', 'true', 'Use TLS for SMTP connection'),
  ('public_url', '', 'Public URL of the application')
ON CONFLICT (id) DO NOTHING;