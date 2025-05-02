/*
  # Update SMTP Settings

  1. Changes
    - Update SMTP settings with correct Lolipop Mail configuration
    - Add additional settings for CORS and email templates

  2. Security
    - Maintain existing RLS policies
*/

-- Update SMTP settings with correct values
UPDATE system_settings 
SET value = 'smtp.lolipop.jp', description = 'Lolipop Mail SMTP server'
WHERE id = 'smtp_host';

UPDATE system_settings 
SET value = '465', description = 'Lolipop Mail SMTP port (SSL/TLS)'
WHERE id = 'smtp_port';

UPDATE system_settings 
SET value = 'info@aquatutorai.jp', description = 'Lolipop Mail username'
WHERE id = 'smtp_username';

UPDATE system_settings 
SET value = 'info@aquatutorai.jp', description = 'Default sender email address'
WHERE id = 'smtp_from';

-- Add new settings for CORS
INSERT INTO system_settings (id, value, description) VALUES
  ('cors_origins', '*', 'Allowed CORS origins'),
  ('cors_methods', 'GET,POST,PUT,DELETE,OPTIONS', 'Allowed CORS methods'),
  ('cors_headers', 'authorization,x-client-info,apikey,content-type', 'Allowed CORS headers'),
  ('cors_max_age', '86400', 'CORS preflight max age in seconds')
ON CONFLICT (id) DO UPDATE
SET value = EXCLUDED.value,
    description = EXCLUDED.description;