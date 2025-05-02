const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

import { createClient } from 'npm:@supabase/supabase-js@2.39.7';
import { SmtpClient } from 'https://deno.land/x/smtp/mod.ts';

function validateSmtpConfig() {
  const required = [
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USERNAME',
    'SMTP_PASSWORD',
    'SMTP_FROM',
    'PUBLIC_URL',
  ];
  const missing = required.filter((key) => !Deno.env.get(key));

  if (missing.length > 0) {
    throw new Error(`Missing required configuration: ${missing.join(', ')}`);
  }
}
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    validateSmtpConfig();

    const { applicationId, email } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Update application status first
    const { error: updateError } = await supabaseClient
      .from('applications')
      .update({
        status: 'under_review',
        updated_at: new Date().toISOString(),
      })
      .eq('id', applicationId);

    if (updateError) throw updateError;

    // Initialize SMTP client
    const client = new SmtpClient();

    try {
      await client.connectTLS({
        hostname: Deno.env.get('SMTP_HOST') ?? '',
        port: parseInt(Deno.env.get('SMTP_PORT') ?? '587'),
        username: Deno.env.get('SMTP_USERNAME') ?? '',
        password: Deno.env.get('SMTP_PASSWORD') ?? '',
      });

      const signatureLink = `${Deno.env.get(
        'PUBLIC_URL'
      )}/sign/${applicationId}`;

      await client.send({
        from: Deno.env.get('SMTP_FROM') ?? '',
        to: email,
        subject: '契約書の確認とご署名のお願い',
        content: `
契約書のご確認をお願いいたします。

以下のリンクから契約書の内容をご確認いただき、ご署名をお願いいたします。
${signatureLink}

※本メールに心当たりがない場合は、破棄していただきますようお願いいたします。
        `,
        html: `
<!DOCTYPE html>
<html>
<body>
  <p>契約書のご確認をお願いいたします。</p>
  <p>以下のリンクから契約書の内容をご確認いただき、ご署名をお願いいたします。</p>
  <p><a href="${signatureLink}">契約書の確認とご署名</a></p>
  <p style="color: #666; font-size: 12px;">※本メールに心当たりがない場合は、破棄していただきますようお願いいたします。</p>
</body>
</html>
        `,
      });

      await client.close();
    } catch (smtpError) {
      console.error('SMTP Error:', smtpError);
      return new Response(
        JSON.stringify({
          message: 'Application status updated but email notification failed',
          error: smtpError.message,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Contract sent successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Function Error:', error);
    return new Response(
      JSON.stringify({
        error: error.message,
        type: error.name,
        details: error.stack,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
