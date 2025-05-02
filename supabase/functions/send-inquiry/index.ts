const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

import { createClient } from "npm:@supabase/supabase-js@2.39.7";
import { Resend } from 'npm:resend@3.2.0';

function validateResendConfig() {
  if (!Deno.env.get('RESEND_API_KEY')) {
    throw new Error('Missing RESEND_API_KEY environment variable');
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    let body;
    try {
      const text = await req.text();
      body = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      throw new Error('Invalid request body');
    }

    const { type, company_name, representative_name, email, phone, message } = body;

    // Validate required fields
    if (!type || !company_name || !representative_name || !email || !phone || !message) {
      throw new Error('Missing required fields');
    }
    
    // Validate Resend configuration
    validateResendConfig();

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Save to database first
    const { error: dbError } = await supabaseClient
      .from('inquiries')
      .insert([
        { type, company_name, representative_name, email, phone, message }
      ]);

    if (dbError) {
      console.error('Database Error:', dbError);
      throw new Error('Failed to save inquiry to database');
    }

    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
    const inquiryTypes = {
      document_request: '資料請求',
      demo_request: 'デモ版を試したい',
      press: '取材申し込み',
      contact: 'お問い合わせ',
      other: 'その他',
    };

    try {
      // Send confirmation email to inquirer
      await resend.emails.send({
        from: 'AquaTutorAI <info@aquatutorai.jp>',
        to: email,
        subject: `【${inquiryTypes[type] || type}】お問い合わせありがとうございます`,
        text: `
${representative_name} 様

この度は、AquaTutorAIにお問い合わせいただき、誠にありがとうございます。
以下の内容で承りました。

お問い合わせ種別: ${inquiryTypes[type] || type}
会社名: ${company_name}
代表者名: ${representative_name}
メールアドレス: ${email}
電話番号: ${phone}
お問い合わせ内容:
${message}

内容を確認次第、担当者よりご連絡させていただきます。
今しばらくお待ちくださいますようお願い申し上げます。

※本メールは自動送信です。このメールに返信いただいてもご回答できかねますのでご了承ください。

--
AquaTutorAI
アクア・プラン株式会社
        `,
        html: `
<html>
<body style="font-family: sans-serif; line-height: 1.6; color: #333;">
  <h2>お問い合わせありがとうございます</h2>
  <p>${representative_name} 様</p>
  <p>この度は、AquaTutorAIにお問い合わせいただき、誠にありがとうございます。<br>以下の内容で承りました。</p>
  <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;">
    <p><strong>お問い合わせ種別:</strong> ${inquiryTypes[type] || type}</p>
    <p><strong>会社名:</strong> ${company_name}</p>
    <p><strong>代表者名:</strong> ${representative_name}</p>
    <p><strong>メールアドレス:</strong> ${email}</p>
    <p><strong>電話番号:</strong> ${phone}</p>
    <p><strong>お問い合わせ内容:</strong></p>
    <pre style="white-space: pre-wrap;">${message}</pre>
  </div>
  <p>内容を確認次第、担当者よりご連絡させていただきます。<br>今しばらくお待ちくださいますようお願い申し上げます。</p>
  <p style="color: #666; font-size: 0.9em;">※本メールは自動送信です。このメールに返信いただいてもご回答できかねますのでご了承ください。</p>
  <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
  <p style="color: #666; font-size: 0.9em;">
    AquaTutorAI<br>
    アクア・プラン株式会社
  </p>
</body>
</html>
        `,
      });

      // Send email
      await resend.emails.send({
        from: 'AquaTutorAI <info@aquatutorai.jp>',
        to: 'info@aquatutorai.jp',
        subject: `【${inquiryTypes[type] || type}】新規お問い合わせ`,
        text: `
【新規お問い合わせ】

会社名: ${company_name}
代表者名: ${representative_name}
メールアドレス: ${email}
電話番号: ${phone}
お問い合わせ内容:
${message}

※このメールは自動通知です。
        `,
        html: `
<html>
<body style="font-family: sans-serif; line-height: 1.6; color: #333;">
<h2>新規お問い合わせ</h2>
<div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;">
  <p><strong>会社名:</strong> ${company_name}</p>
  <p><strong>代表者名:</strong> ${representative_name}</p>
  <p><strong>メールアドレス:</strong> ${email}</p>
  <p><strong>電話番号:</strong> ${phone}</p>
  <p><strong>お問い合わせ内容:</strong></p>
  <pre style="white-space: pre-wrap;">${message}</pre>
</div>
<p style="color: #666; font-size: 0.9em;">※このメールは自動通知です。</p>
</body>
</html>
        `,
      });

      return new Response(
        JSON.stringify({ message: 'Inquiry sent successfully' }),
        {
          status: 200,
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store'
          },
        }
      );
    } catch (smtpError) {
      console.error('SMTP Error:', smtpError);
      
      return new Response(
        JSON.stringify({ 
          message: 'Inquiry saved but email notification failed',
          error: 'メール送信に失敗しました。担当者に通知されましたのでご連絡させていただきます。'
        }),
        {
          status: 500,
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store'
          },
        }
      );
    }
  } catch (error) {
    console.error('Function Error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        message: '処理に失敗しました。しばらく経ってからもう一度お試しください。'
      }),
      {
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        },
      }
    );
  }
});