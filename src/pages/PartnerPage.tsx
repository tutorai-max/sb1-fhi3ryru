import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ArrowLeft, CheckCircle2, ArrowRight } from 'lucide-react';

export default function PartnerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                トップページへ
              </Link>
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-blue-900" />
                <h1 className="ml-3 text-2xl font-bold text-gray-900">代理店募集</h1>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <div className="bg-blue-900 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-4xl font-extrabold tracking-tight">
                AquaTutorAI代理店募集
              </h2>
              <p className="mt-4 text-xl">
                成長市場で、私たちと共に事業を展開しませんか？
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-gray-900">代理店の特徴</h3>
              <p className="mt-4 text-lg text-gray-600">
                AquaTutorAI代理店として活動することで、以下のメリットがあります
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <CheckCircle2 className="h-6 w-6 text-blue-600" />
                  <h4 className="ml-3 text-lg font-semibold">高い収益性</h4>
                </div>
                <p className="text-gray-600">
                  初期費用と月額利用料の両方から継続的な収益を得られます。
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <CheckCircle2 className="h-6 w-6 text-blue-600" />
                  <h4 className="ml-3 text-lg font-semibold">充実したサポート</h4>
                </div>
                <p className="text-gray-600">
                  商談から導入まで、経験豊富なスタッフが全面的にバックアップします。
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <CheckCircle2 className="h-6 w-6 text-blue-600" />
                  <h4 className="ml-3 text-lg font-semibold">成長市場</h4>
                </div>
                <p className="text-gray-600">
                  AI研修市場は今後も拡大が見込まれ、大きな成長機会があります。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Requirements Section */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-gray-900">募集要項</h3>
              <p className="mt-4 text-lg text-gray-600">
                以下の条件を満たす企業様を募集しています
              </p>
            </div>

            <div className="mt-12 bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-8">
                <dl className="divide-y divide-gray-200">
                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">対象企業</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      法人研修事業を展開している企業、または人材育成・教育関連事業を行っている企業
                    </dd>
                  </div>

                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">必要な資格</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      特になし（研修事業の経験があれば望ましい）
                    </dd>
                  </div>

                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">契約形態</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      販売代理店契約（契約期間1年、以降自動更新）
                    </dd>
                  </div>

                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">報酬</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      初期費用の30%＋月額利用料の20%（継続）
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h3 className="text-3xl font-bold">お問い合わせ</h3>
              <p className="mt-4 text-xl">
                代理店についての詳細資料をお送りいたします
              </p>
              <div className="mt-8">
                <Link
                  to="/contact"
                  className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-900 bg-white hover:bg-blue-50 transition-colors"
                >
                  資料請求・お問い合わせ
                  <ArrowRight className="ml-2 -mr-1 w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">© AquaTutorAI All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}