/*
  # SMTP Configuration

  This migration adds a comment to document that SMTP configuration should be
  handled through environment variables in the Edge Functions rather than
  storing them in the database.

  The following environment variables should be set in the Supabase dashboard:
  - SMTP_HOST
  - SMTP_PORT
  - SMTP_USERNAME
  - SMTP_PASSWORD
  - SMTP_FROM
  - PUBLIC_URL
*/

-- Add a comment to document SMTP configuration
COMMENT ON SCHEMA public IS 'SMTP configuration is handled through environment variables in Edge Functions.
Required variables:
- SMTP_HOST: SMTP server hostname
- SMTP_PORT: SMTP server port
- SMTP_USERNAME: SMTP authentication username
- SMTP_PASSWORD: SMTP authentication password
- SMTP_FROM: Sender email address
- PUBLIC_URL: Public URL of the application';