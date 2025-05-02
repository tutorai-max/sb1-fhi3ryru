const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

import { createClient } from 'npm:@supabase/supabase-js@2.39.7';
import { Resend } from 'npm:resend@3.2.0';

function validateResendConfig() {
  const required = ['RESEND_API_KEY', 'SUPABASE_URL', 'SUPABASE_ANON_KEY', 'PUBLIC_URL'];
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
    validateResendConfig();

    const { contact_email } = await req.json();

    if (!contact_email) {
      throw new Error('Missing contact_email in request body');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // --- 将来DB更新を再開する場合のためコメントアウト保存 ---
    /*
    const { error: updateError } = await supabaseClient
      .from('applications')
      .update({
        status: 'under_review',
        updated_at: new Date().toISOString(),
      })
      .eq('id', applicationId);

    if (updateError) throw updateError;
    */
    // ---------------------------------------------------------

    const resend = new Resend(Deno.env.get('RESEND_API_KEY') ?? '');

    const signatureLink = `${Deno.env.get('PUBLIC_URL')}/sign/`; // applicationId無いので仮リンク

    const { error: resendError } = await resend.emails.send({
      from: 'AquaTutorAI <info@aquatutorai.jp>',
      to: contact_email,
      subject: '契約書の確認とご署名のお願い',
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
      text: `
契約書のご確認をお願いいたします。

以下のリンクから契約書の内容をご確認いただき、ご署名をお願いいたします。
${signatureLink}

※本メールに心当たりがない場合は、破棄していただきますようお願いいたします。
      `
    });

    if (resendError) {
      throw new Error(resendError.message);
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
