import React, { useState } from 'react';
import { Building2, Send, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // 追加

interface FormData {
  type: string[];
  company_name: string;
  representative_name: string;
  phone: string;
  email: string;
  message: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    type: [],
    company_name: '',
    representative_name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // 追加

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const typeParam = params.get('type');
    if (typeParam && ['document_request', 'demo_request', 'contact', 'press'].includes(typeParam)) {
      setFormData((prev) => ({ ...prev, type: [typeParam] }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.type.length === 0) {
      setError('お問い合わせ種別を少なくとも1つ選択してください。');
      return;
    }
    setLoading(true);
    setError(null);

    const submitData = {
      ...formData,
      type: formData.type.join(','),
      signed_in_email: currentUser?.email || '',  // ← ここで追加！
    };

    try {
      const response = await fetch('https://formcarry.com/s/YADCJ9xQ8Gm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        throw new Error('フォームの送信に失敗しました。');
      }

      setSuccess(true);
    } catch (err) {
      console.error('Error sending inquiry:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'フォームの送信に失敗しました。しばらく経ってからもう一度お試しください。'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const newTypes = checked
        ? [...prev.type, value]
        : prev.type.filter((t) => t !== value);
      return { ...prev, type: newTypes };
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <Building2 className="mx-auto h-12 w-12 text-blue-900" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              お問い合わせありがとうございます
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              ご入力いただいた内容を確認後、担当者よりご連絡いたします。
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              トップページへ戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/')}
          className="mb-8 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          トップページへ
        </button>
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <Building2 className="mx-auto h-12 w-12 text-blue-900" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              お問い合わせフォーム
            </h2>
            <p className="mt-2 text-sm text-gray-600 form-header-note">
              以下の項目にご記入の上、送信ボタンを押してください。必須項目は必ずご入力ください。
            </p>
          </div>

          <div className="mt-12 form-container">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className="space-y-6">
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700">
                    資料する項目を全て選択してください（複数選択可）
                    <span className="required"></span>
                  </label>
                  <div className="mt-2 space-y-2">
                    {[
                      { value: 'document_request', label: '資料請求' },
                      { value: 'demo_request', label: 'デモ版を試したい' },
                      { value: 'contact', label: 'お問合せ' },
                      { value: 'press', label: '取材依頼' },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center">
                        <input
                          type="checkbox"
                          name="type"
                          value={option.value}
                          checked={formData.type.includes(option.value)}
                          onChange={handleCheckboxChange}
                          className="h-4 w-4 text-blue-900 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-3 text-sm text-gray-700 static">
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label
                    htmlFor="company_name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    法人名
                    <span className="required"></span>
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    id="company_name"
                    required
                    value={formData.company_name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full"
                    placeholder="例: 株式会社サンプル"
                  />
                </div>

                <div className="form-group">
                  <label
                    htmlFor="representative_name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    名前
                    <span className="required"></span>
                  </label>
                  <input
                    type="text"
                    name="representative_name"
                    id="representative_name"
                    required
                    value={formData.representative_name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full"
                    placeholder="例: 山田 太郎"
                  />
                </div>

                <div className="form-group">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    電話番号
                    <span className="required"></span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full"
                    placeholder="例: 03-1234-5678"
                  />
                </div>

                <div className="form-group">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    メールアドレス
                    <span className="required"></span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full"
                    placeholder="例: example@company.com"
                  />
                </div>

                <div className="form-group">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700"
                  >
                    問合せ内容
                    <span className="required"></span>
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    className="mt-1 block w-full"
                    placeholder="お問い合わせの詳細をご記入ください"
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center"
                >
                  <Send className="h-5 w-5 mr-2" />
                  送信ボタン
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}