const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

import { createClient } from "npm:@supabase/supabase-js@2.39.7";
import { SmtpClient } from "npm:smtp@0.1.4";


function validateSmtpConfig() {
  const required = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USERNAME', 'SMTP_PASSWORD', 'SMTP_FROM'];
  const missing = required.filter(key => !Deno.env.get(key));
  
  if (missing.length > 0) {
    throw new Error(`Missing required configuration: ${missing.join(', ')}`);
  }
}
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    validateSmtpConfig();
    const { applicationId } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get application data
    const { data: application, error: applicationError } = await supabaseClient
      .from('applications')
      .select(`
        *,
        contracts (*),
        signatures (*)
      `)
      .eq('id', applicationId)
      .single();

    if (applicationError) throw applicationError;

    // Get signature data
    const { data: signature, error: signatureError } = await supabaseClient
      .from('signatures')
      .select('*')
      .eq('application_id', applicationId)
      .single();

    if (signatureError) throw signatureError;

    // Generate PDF and store in bucket
    const pdfData = await generatePDF(application, signature);
    const pdfFileName = `contracts/${applicationId}/contract.pdf`;

    const { error: uploadError } = await supabaseClient
      .storage
      .from('contracts')
      .upload(pdfFileName, pdfData, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabaseClient
      .storage
      .from('contracts')
      .getPublicUrl(pdfFileName);

    // Update signature record with PDF URL
    const { error: updateError } = await supabaseClient
      .from('signatures')
      .update({
        pdf_url: publicUrl,
        email_sent: true,
        email_sent_at: new Date().toISOString(),
      })
      .eq('id', signature.id);

    if (updateError) throw updateError;

    // Send emails
    const client = new SmtpClient();

    try {
      await client.connectTLS({
        hostname: Deno.env.get('SMTP_HOST') ?? '',
        port: parseInt(Deno.env.get('SMTP_PORT') ?? '587'),
        username: Deno.env.get('SMTP_USERNAME') ?? '',
        password: Deno.env.get('SMTP_PASSWORD') ?? '',
      });

      // Send to customer
      await client.send({
        from: Deno.env.get('SMTP_FROM') ?? '',
        to: application.email,
        subject: '契約書の締結完了のお知らせ',
        content: `
契約書の締結が完了いたしました。

以下のURLから契約書をダウンロードいただけます。
${publicUrl}

ご不明な点がございましたら、お気軽にお問い合わせください。
        `,
      });

      // Send to admin
      await client.send({
        from: Deno.env.get('SMTP_FROM') ?? '',
        to: 'info@aquatutorai.jp',
        subject: `【契約締結完了】${application.company_name}様`,
        content: `
${application.company_name}様との契約書の締結が完了いたしました。

契約書URL: ${publicUrl}
        `,
      });

      await client.close();
    } catch (smtpError) {
      console.error('SMTP Error:', smtpError);
      return new Response(
        JSON.stringify({ 
          message: 'PDF generated but email notification failed',
          error: smtpError.message,
          pdfUrl: publicUrl
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        message: 'PDF generated and sent successfully',
        pdfUrl: publicUrl
      }),
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
        details: error.stack 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

async function generatePDF(application: any, signature: any) {
  // PDF生成ロジックをここに実装
  // 実際のPDF生成には、PDFKitやPuppeteerなどのライブラリを使用します
  // この例では簡略化のためダミーのPDFデータを返しています
  return new Uint8Array([]);
}