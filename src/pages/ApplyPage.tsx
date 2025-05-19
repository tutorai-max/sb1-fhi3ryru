import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext'; // 追加

// ステップの型定義
type Step = 'contract' | 'company';

// フォームデータの型定義
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
  pdf_url?: File;
}

export default function ApplyPage() {
  const { currentUser } = useAuth(); // 追加
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('contract');
  const [formData, setFormData] = useState<FormData>({
    company_name: '',
    postal_code: '',
    prefecture: '',
    city: '',
    sub_area: '',
    building_room: '',
    representative_name: '',
    contact_person: '',
    contact_phone: '',
    contact_email: '',
    initial_fee: '',
    monthly_fee: '',
    excess_fee: '',
    option_fee: '',
    payment_method: '',
    notes: '',
  });

  // 入力値の変更を処理（トリムとメールアドレスの小文字変換）
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    let newValue = value.trim();
    if (name === 'contact_email') {
      newValue = newValue.toLowerCase(); // メールアドレスを小文字に変換
    }
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  // 郵便番号入力時の住所自動入力
  const handlePostalCodeInput = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const postalCode = e.target.value.replace('-', '').trim();
    if (postalCode.length === 7) {
      try {
        const response = await fetch(
          `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${postalCode}`
        );
        const data = await response.json();
        if (data.status === 200 && data.results) {
          const result = data.results[0];
          setFormData((prev) => ({
            ...prev,
            prefecture: result.address1,
            city: result.address2,
            sub_area: result.address3,
          }));
        } else {
          alert('該当する住所が見つかりません。郵便番号を確認してください。');
        }
      } catch (error) {
        console.error('住所取得エラー:', error);
        alert('住所を取得できませんでした。もう一度お試しください。');
      }
    }
  };

  // 次のステップまたは確認画面への遷移
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 'contract') {
      setCurrentStep('company');
    } else if (currentStep === 'company') {
      console.error('currentUser:', currentUser);
      console.log('currentUser:', currentUser);
      const submitData = {
        ...formData,
        signed_in_email: currentUser?.email || '',  // ← ここで追加！
      };
      // ConfirmPage.tsx にフォームデータを渡して遷移
      navigate('/confirm', { state: { formData: submitData }});
    }
  };

  // 戻るボタンの処理
  const handleBack = () => {
    if (currentStep === 'company') {
      setCurrentStep('contract');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ナビゲーションバー */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() =>
                  currentStep === 'contract'
                    ? navigate('/dashboard')
                    : handleBack()
                }
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                戻る
              </button>
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-blue-900" />
                <h1 className="ml-3 text-2xl font-bold text-gray-900">
                  お申込み情報フォーム
                </h1>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* フォームコンテナ */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-2">
            AquaTutorAI お申込みフォーム
          </h2>
          <p className="text-center text-sm text-gray-600 mb-6">
            正確に慎重に入力してください（
            <span className="text-red-600">*</span>は必須項目）
          </p>

          {/* 契約情報ステップ */}
          {currentStep === 'contract' && (
            <form onSubmit={handleNext}>
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="initial_fee"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    初期導入費用 <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="initial_fee"
                      name="initial_fee"
                      value={formData.initial_fee}
                      onChange={handleInputChange}
                      placeholder="例: 500000"
                      required
                      className="block w-full pr-16 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2 px-3"
                    />
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                      円（税別）
                    </span>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="monthly_fee"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    月額基本使用料 <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="monthly_fee"
                      name="monthly_fee"
                      value={formData.monthly_fee}
                      onChange={handleInputChange}
                      placeholder="例: 100000"
                      required
                      className="block w-full pr-16 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2 px-3"
                    />
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                      円（税別）
                    </span>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="excess_fee"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    超過分 <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="excess_fee"
                      name="excess_fee"
                      value={formData.excess_fee}
                      onChange={handleInputChange}
                      placeholder="例: 5000"
                      required
                      className="block w-full pr-24 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2 px-3"
                    />
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                      円/1,000回（税別）
                    </span>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="option_fee"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    オプション（管理機能等）{' '}
                    <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="option_fee"
                      name="option_fee"
                      value={formData.option_fee}
                      onChange={handleInputChange}
                      placeholder="例: 20000"
                      required
                      className="block w-full pr-16 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2 px-3"
                    />
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                      円（税別）
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="w-full mt-8 px-4 py-2 text-sm font-medium text-white bg-blue-900 rounded-md hover:bg-blue-800"
              >
                次へ
              </button>
            </form>
          )}

          {/* 企業情報ステップ */}
          {currentStep === 'company' && (
            <form onSubmit={handleNext}>
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="company_name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    法人名 <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="company_name"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleInputChange}
                    placeholder="例: アクア・プラン株式会社"
                    required
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2 px-3"
                  />
                </div>
                <fieldset className="space-y-4">
                  <legend className="text-sm font-medium text-gray-700 mb-2">
                    住所 <span className="text-red-600">*</span>
                  </legend>
                  <div>
                    <label
                      htmlFor="postal_code"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      郵便番号 <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="postal_code"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={(e) => {
                        handleInputChange(e);
                        handlePostalCodeInput(e);
                      }}
                      placeholder="例: 123-4567"
                      required
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2 px-3"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="prefecture"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      都道府県 <span className="text-red-600">*</span>
                    </label>
                    <select
                      id="prefecture"
                      name="prefecture"
                      value={formData.prefecture}
                      onChange={handleInputChange}
                      required
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2 px-3"
                    >
                      <option value="" disabled>
                        選択してください
                      </option>
                      {[
                        '北海道',
                        '青森県',
                        '岩手県',
                        '宮城県',
                        '秋田県',
                        '山形県',
                        '福島県',
                        '茨城県',
                        '栃木県',
                        '群馬県',
                        '埼玉県',
                        '千葉県',
                        '東京都',
                        '神奈川県',
                        '新潟県',
                        '富山県',
                        '石川県',
                        '福井県',
                        '山梨県',
                        '長野県',
                        '岐阜県',
                        '静岡県',
                        '愛知県',
                        '三重県',
                        '滋賀県',
                        '京都府',
                        '大阪府',
                        '兵庫県',
                        '奈良県',
                        '和歌山県',
                        '鳥取県',
                        '島根県',
                        '岡山県',
                        '広島県',
                        '山口県',
                        '徳島県',
                        '香川県',
                        '愛媛県',
                        '高知県',
                        '福岡県',
                        '佐賀県',
                        '長崎県',
                        '熊本県',
                        '大分県',
                        '宮崎県',
                        '鹿児島県',
                        '沖縄県',
                      ].map((pref) => (
                        <option key={pref} value={pref}>
                          {pref}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      市区町村 <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="例: 品川区"
                      required
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2 px-3"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="sub_area"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      番地 <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="sub_area"
                      name="sub_area"
                      value={formData.sub_area}
                      onChange={handleInputChange}
                      placeholder="例: 南品川2-3-4"
                      required
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2 px-3"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="building_room"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      建物名・部屋番号（任意）
                    </label>
                    <input
                      type="text"
                      id="building_room"
                      name="building_room"
                      value={formData.building_room}
                      onChange={handleInputChange}
                      placeholder="例: アクアビル301"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2 px-3"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      建物名や部屋番号がある場合は入力してください
                    </p>
                  </div>
                </fieldset>
                <div>
                  <label
                    htmlFor="representative_name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    代表者名 <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="representative_name"
                    name="representative_name"
                    value={formData.representative_name}
                    onChange={handleInputChange}
                    placeholder="例: 山田太郎"
                    required
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2 px-3"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact_person"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    担当者名・部署 <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="contact_person"
                    name="contact_person"
                    value={formData.contact_person}
                    onChange={handleInputChange}
                    placeholder="例: 山田太郎（営業部）"
                    required
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2 px-3"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact_phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    担当者電話番号 <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    id="contact_phone"
                    name="contact_phone"
                    value={formData.contact_phone}
                    onChange={handleInputChange}
                    placeholder="例: 03-1234-5678"
                    required
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2 px-3"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact_email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    担当者メールアドレス <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    id="contact_email"
                    name="contact_email"
                    value={formData.contact_email}
                    onChange={handleInputChange}
                    placeholder="例: example@domain.com"
                    required
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2 px-3"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full mt-8 px-4 py-2 text-sm font-medium text-white bg-blue-900 rounded-md hover:bg-blue-800"
              >
                確認画面へ
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
