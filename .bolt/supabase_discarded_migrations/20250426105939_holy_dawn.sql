/*
  # Add CORS Headers to Edge Functions

  1. Changes
    - Add CORS headers configuration to all Edge Functions
    - Ensure consistent CORS handling across functions
    - Add proper OPTIONS request handling
*/

-- Add comment to document CORS configuration
COMMENT ON SCHEMA public IS 'Standard CORS headers are required for all Edge Functions:
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};';