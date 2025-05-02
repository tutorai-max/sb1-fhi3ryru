const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

import { Resend } from 'npm:resend@3.2.0';
import { SmtpClient } from 'https://deno.land/x/smtp/mod.ts';

function validateResendConfig() {
  if (!Deno.env.get('RESEND_API_KEY')) {
    throw new Error('Missing RESEND_API_KEY environment variable');
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    validateResendConfig();
    const { to, subject, html, text } = await req.json();

    if (!to || !subject || (!html && !text)) {
      throw new Error('Missing required email parameters');
    }

    // Initialize SMTP client
    const client = new SmtpClient();
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

    const data = await resend.emails.send({
      from: 'AquaTutorAI <info@aquatutorai.jp>',
      to,
      subject,
      html,
      text,
    });

    return new Response(
      JSON.stringify({ message: 'Email sent successfully', data }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
