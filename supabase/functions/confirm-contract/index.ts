const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

import { createClient } from "npm:@supabase/supabase-js@2.39.7";
import { SmtpClient } from "npm:smtp@0.1.4";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { applicationId, contractData, applicantInfo, contactInfo } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Save confirmation
    const { data: confirmation, error: confirmationError } = await supabaseClient
      .from('contract_confirmations')
      .insert({
        application_id: applicationId,
        contract_data: contractData,
        applicant_info: applicantInfo,
        contact_info: contactInfo,
        confirmed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (confirmationError) throw confirmationError;

    // Update application status
    const { error: updateError } = await supabaseClient
      .from('applications')
      .update({
        status: 'submitted',
        submitted_at: new Date().toISOString()
      })
      .eq('id', applicationId);

    if (updateError) throw updateError;

    // Send confirmation emails
    const client = new SmtpClient();
    
    try {
      await client.connectTLS({
        hostname: 'smtp.lolipop.jp',
        port: 465,
        username: 'info@aquatutorai.jp',
        password: 'Aitutor00001-',
        tls: true
      });

      // Send to applicant
      await client.send({
        from: 'info@aquatutorai.jp',
        to: applicantInfo.email,
        subject: '【AquaTutorAI】お申し込みありがとうございます',
        html: `
<html>
<body>
  <h2>お申し込みを受け付けました</h2>
  <p>${applicantInfo.representative_name} 様</p>
  <p>内容を確認次第、担当者よりご連絡させていただきます。</p>
  <hr>
  <p>AquaTutorAI</p>
  <p>アクア・プラン株式会社</p>
</body>
</html>
        `
      });

      // Send to admin
      await client.send({
        from: 'info@aquatutorai.jp',
        to: 'info@aquatutorai.jp',
        subject: `【新規申込】${applicantInfo.company_name}様`,
        html: `
<html>
<body>
  <h2>新規申込を受け付けました</h2>
  <p>会社名：${applicantInfo.company_name}</p>
  <p>代表者：${applicantInfo.representative_name}</p>
  <p>担当者：${contactInfo.name}</p>
  <p>メール：${contactInfo.email}</p>
</body>
</html>
        `
      });

      await client.close();
    } catch (smtpError) {
      console.error('SMTP Error:', smtpError);
      throw new Error('Failed to send confirmation emails');
    }

    return new Response(
      JSON.stringify({ message: 'Contract confirmed successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});