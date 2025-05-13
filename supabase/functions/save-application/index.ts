// === 必要ヘッダ ──────────────────────────
const corsHeaders = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods":"POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// === 外部ライブラリ ──────────────────────
import { createClient } from "npm:@supabase/supabase-js@2.39.7";
import { Resend       } from "npm:resend@3.2.0";
import { PDFDocument, StandardFonts, rgb } from "npm:pdf-lib@1.17.1";

// === 環境変数チェック ────────────────────
function validateEnv() {
  const req = [
    "RESEND_API_KEY",
    "SUPABASE_URL",
    "SUPABASE_ANON_KEY",
    "PUBLIC_URL",
  ];
  const miss = req.filter((k) => !Deno.env.get(k));
  if (miss.length) throw new Error(`Missing env: ${miss.join(", ")}`);
}

// === フォーム型定義 ──────────────────────
interface FormData {
  company_name      : string;
  postal_code       : string;
  prefecture        : string;
  city              : string;
  sub_area          : string;
  building_room     : string;
  representative_name: string;
  contact_person    : string;
  contact_phone     : string;
  contact_email     : string;
  initial_fee       : string;
  monthly_fee       : string;
  excess_fee        : string;
  option_fee        : string;
  payment_method    : string;
  notes             : string;
}

// === PDF を生成して Uint8Array で返す ────
async function makePdf(d: FormData): Promise<Uint8Array> {
  const pdf  = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);              // A4
  const font = await pdf.embedFont(StandardFonts.Helvetica);

  const write = (() => {
    let y = 800;
    return (label: string, value: string) => {
      page.drawText(`${label}: ${value}`, {
        x: 40, y, font, size: 11, color: rgb(0, 0, 0),
      });
      y -= 20;
    };
  })();

  write("会社名", d.company_name);
  write("郵便番号", d.postal_code);
  write("都道府県", d.prefecture);
  write("市区町村", d.city);
  write("番地等", d.sub_area);
  write("建物/部屋", d.building_room);
  write("代表者名", d.representative_name);
  write("ご担当者", d.contact_person);
  write("電話番号", d.contact_phone);
  write("メール", d.contact_email);
  write("初期費用", d.initial_fee);
  write("月額費用", d.monthly_fee);
  write("超過費用", d.excess_fee);
  write("オプション費用", d.option_fee);
  write("支払方法", d.payment_method);
  write("備考", d.notes);

  return pdf.save();
}

// === サーバ (Deno.serve) ──────────────────
Deno.serve(async (req) => {
  // Pre‑flight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    validateEnv();

    /* ---------- リクエストボディ ---------- */
    const body = await req.json();

    // メール関係
    const contact_email   = body.contact_email   as string | undefined;
    const signed_in_email = body.signed_in_email as string | undefined;
    if (!contact_email) throw new Error("contact_email は必須です");

    // フォーム (PDF / DB 共通)
    const form: FormData = body as FormData;

    /* ---------- ① Supabase ---------- */
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")  ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    );

    // ── profiles から applicant / sales_rep の uuid を取得 ──
    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", signed_in_email)
      .single();

    if (profileErr || !profile) {
      console.error("body Err:", body);
      console.error("contact_email Err:", contact_email);
      console.error("signed_in_email Err:", signed_in_email);
      console.error("profiles Err:", profileErr);
      throw new Error("profiles からユーザ ID を取得できませんでした");
    }

    // ── applications へ INSERT ──
    const { error: insertErr } = await supabase.from("applications").insert({
      applicant_id : profile.id,           // ログインユーザ
      sales_rep_id : profile.id,           // 今回は同じ ID を登録
      status       : "submitted",          // 初期ステータス
      company_name : form.company_name,
      company_address: `${form.prefecture}${form.city}${form.sub_area}${form.building_room}`,
      representative_name: form.representative_name,
      phone_number : form.contact_phone,
      email        : form.contact_email,
      contact_name : form.contact_person,
      contact_email: form.contact_email,
      created_at   : new Date().toISOString(),
    });

    if (insertErr) throw insertErr;

    /* ---------- ② PDF 生成 ---------- */
    const pdfBytes  = await makePdf(form);
    const pdfBase64 = btoa(String.fromCharCode(...pdfBytes));

    /* ---------- ③ Resend 送信 ---------- */
    const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);

    const toList = [
      "info@aquatutorai.jp",
      contact_email,
      signed_in_email,
    ].filter(Boolean) as string[];

    for (const to of toList) {
      const { error } = await resend.emails.send({
        from   : "AquaTutorAI <info@aquatutorai.jp>",
        to,
        subject: "契約書（PDF）をお送りします",
        attachments: [{
          filename   : "aqua_application.pdf",
          content    : pdfBase64,
          contentType: "application/pdf",
        }],
        html : `
          <p>契約書を PDF でお送りいたします。</p>
          <p>添付ファイルをご確認のうえ、ご署名手続きへお進みください。</p>
          <p style="color:#666;font-size:12px;">本メールに心当たりがない場合は破棄してください。</p>
        `,
        text : `
契約書を PDF でお送りいたします。
添付ファイルをご確認のうえ、ご署名手続きへお進みください。

※本メールに心当たりがない場合は破棄してください。
        `,
      });
      if (error) throw new Error(`送信先 ${to} でエラー: ${error.message}`);
    }

    /* ---------- ④ レスポンス ---------- */
    return new Response(
      JSON.stringify({ message: "DB 登録 & PDF 付きメールを送信しました" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
    );

  } catch (err) {
    console.error("Function Error:", err);
    return new Response(
      JSON.stringify({ error: err.message, stack: err.stack }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 },
    );
  }
});
