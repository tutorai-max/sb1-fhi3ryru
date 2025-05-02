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

    // Generate PDF and get URL
    const pdfBuffer = await generatePDF(contractData, applicantInfo, contactInfo);
    const pdfFileName = `contracts/${applicationId}/contract.pdf`;

    const { error: uploadError } = await supabaseClient
      .storage
      .from('contracts')
      .upload(pdfFileName, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabaseClient
      .storage
      .from('contracts')
      .getPublicUrl(pdfFileName);

    // Update application with PDF URL
    const { error: updateError } = await supabaseClient
      .from('applications')
      .update({
        original_pdf_url: publicUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', applicationId);

    if (updateError) throw updateError;

    // Send emails
    const client = new SmtpClient();
    
    try {
      await client.connectTLS({
        hostname: 'smtp.lolipop.jp',
        port: 465,
        username: 'info@aquatutorai.jp',
        password: 'Aitutor00001-',
        tls: true
      });

      // Send to contact person
      await client.send({
        from: 'info@aquatutorai.jp',
        to: contactInfo.email,
        subject: '【AquaTutorAI】契約書のご確認',
        html: `
<html>
<body>
  <h2>契約書のご確認</h2>
  <p>${contactInfo.name} 様</p>
  <p>契約書が作成されました。以下のURLからご確認ください。</p>
  <p><a href="${publicUrl}">契約書を表示</a></p>
  <hr>
  <p>AquaTutorAI</p>
  <p>アクア・プラン株式会社</p>
</body>
</html>
        `
      });

      // Send to applicant
      await client.send({
        from: 'info@aquatutorai.jp',
        to: applicantInfo.email,
        subject: '【AquaTutorAI】契約書のご確認',
        html: `
<html>
<body>
  <h2>契約書のご確認</h2>
  <p>${applicantInfo.representative_name} 様</p>
  <p>契約書が作成されました。以下のURLからご確認ください。</p>
  <p><a href="${publicUrl}">契約書を表示</a></p>
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
        subject: `【契約書作成】${applicantInfo.company_name}様`,
        html: `
<html>
<body>
  <h2>契約書が作成されました</h2>
  <p>会社名：${applicantInfo.company_name}</p>
  <p>代表者：${applicantInfo.representative_name}</p>
  <p>担当者：${contactInfo.name}</p>
  <p><a href="${publicUrl}">契約書を表示</a></p>
</body>
</html>
        `
      });

      await client.close();
    } catch (smtpError) {
      console.error('SMTP Error:', smtpError);
      throw new Error('Failed to send emails');
    }

    return new Response(
      JSON.stringify({ message: 'PDF generated and sent successfully' }),
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

async function generatePDF(contractData: any, applicantInfo: any, contactInfo: any) {
  // This is a placeholder. In a real implementation, you would use a PDF generation library
  // For now, we'll return an empty buffer
  return new Uint8Array([]);
}