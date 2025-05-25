import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Resend } from "resend";
import { renderToBuffer } from '@react-pdf/renderer';
import ContractPDF from '../components/ContractPDF';
import { pdf } from '@react-pdf/renderer';

// フォームデータの型定義（ApplyPage.tsx と一致させる必要があります）
interface FormData {
  company_name: string;
  postal_code: string;
  prefecture: string;
  city: string;
  sub_area: string;
  building_room: string;
  representative_name: string;
  contact_person: string;
  contact_phone: string;
  contact_email: string;
  initial_fee: string;
  monthly_fee: string;
  excess_fee: string;
  option_fee: string;
  payment_method: string;
  notes: string;
  signed_in_email: string; // サインイン時のメールアドレス
}

export default function ConfirmPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const formData = location.state?.formData as FormData | undefined;

  // formData が存在しない場合のエラー処理
  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600">データがありません。再度お試しください。</p>
      </div>
    );
  }

  // 承認ボタンのハンドラ
  const handleApprove = async () => {
    try {
      console.error('tyyyy:');
      console.error(formData);      
      
      // ① PDF Blob
      const blob = await pdf(<ContractPDF application={formData} />).toBlob();

      // ② Blob → ArrayBuffer → Base64
      const buffer = await blob.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(buffer).reduce((s, b) => s + String.fromCharCode(b), '')
      );






      // 1. 申請データを保存
      const { error: saveError } = await supabase.functions.invoke(
        'save-application',
        {
          body: { 
            ...formData,
            pdf_base64: base64,   // ← 追加 
          },
        }
      );
      console.error('saveError:', saveError);
      if (saveError)
        throw new Error(`Save Application Error: ${saveError.message}`);

      // // 2. PDF を生成し、メールを送信
      // const { error: pdfError } = await supabase.functions.invoke(
      //   'generate-pdf-and-email',
      //   {
      //     body: { ...formData },
      //   }
      // );
      // console.error('pdfError:', pdfError);
      // if (pdfError) throw new Error(`Generate PDF Error: ${pdfError.message}`);

      // // 3. 契約を確認
      // const { error: confirmError } = await supabase.functions.invoke(
      //   'confirm-contract',
      //   {
      //     body: { ...formData },
      //   }
      // );
      // console.error('confirmError:', confirmError);
      // if (confirmError)
      //   throw new Error(`Confirm Contract Error: ${confirmError.message}`);


      // 成功したらダッシュボードに遷移
      navigate('/dashboard', {
        state: {
          message:
            'お申し込みありがとうございます。確認メールをお送りしましたのでご確認ください。',
        },
      });
    } catch (error) {
      console.error('Error:', error);
      alert('申し込みの送信に失敗しました。もう一度お試しください。');
      return;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">
            確認画面
          </h2>

          {/* 契約内容の表示 */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">契約内容</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  初期導入費用
                </p>
                <p className="text-base text-gray-900">
                  {formData.initial_fee} 円（税別）
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  月額基本使用料
                </p>
                <p className="text-base text-gray-900">
                  {formData.monthly_fee} 円（税別）
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">超過分</p>
                <p className="text-base text-gray-900">
                  {formData.excess_fee} 円/1,000回（税別）
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  オプション（管理機能等）
                </p>
                <p className="text-base text-gray-900">
                  {formData.option_fee} 円（税別）
                </p>
              </div>
            </div>
          </div>

          {/* 会社情報の表示 */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">会社情報</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">法人名</p>
                <p className="text-base text-gray-900">
                  {formData.company_name}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">住所</p>
                <p className="text-base text-gray-900">
                  〒{formData.postal_code} {formData.prefecture}
                  {formData.city}
                  {formData.sub_area}
                  {formData.building_room}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">代表者名</p>
                <p className="text-base text-gray-900">
                  {formData.representative_name}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  担当者名・部署
                </p>
                <p className="text-base text-gray-900">
                  {formData.contact_person}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  担当者電話番号
                </p>
                <p className="text-base text-gray-900">
                  {formData.contact_phone}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  担当者メールアドレス
                </p>
                <p className="text-base text-gray-900">
                  {formData.contact_email}
                </p>
              </div>
            </div>
          </div>

          {/* 承認ボタン */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleApprove}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-900 rounded-md hover:bg-blue-800"
            >
              承認
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
