import React from 'react';
import { Building2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                トップページへ
              </button>
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-blue-900" />
                <h1 className="ml-3 text-2xl font-bold text-gray-900">プライバシーポリシー</h1>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6 prose max-w-none">
            <h2 className="text-xl font-bold mb-4">1. はじめに</h2>
            <p>
              アクア・プラン株式会社（以下「当社」といいます）は、本サービス（以下「本サービス」といいます）において、
              お客様や営業担当者の皆様の個人情報の保護を最重要視し、適切な管理・運用を行うとともに、
              関連する法令およびガイドライン（個人情報保護法等）を遵守いたします。
              本プライバシーポリシーは、本サービスにおける個人情報の取扱いについて定めるものです。
            </p>

            <h2 className="text-xl font-bold mt-8 mb-4">2. 取得する情報</h2>
            <h3 className="text-lg font-semibold mt-4 mb-2">(1) お客様（契約者・問い合わせ利用者）の情報</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>お名前、会社名、部署名、役職</li>
              <li>住所、電話番号、メールアドレス</li>
              <li>問い合わせ内容、契約申し込み内容、署名情報等</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4 mb-2">(2) 営業担当者および代理店に関する情報</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>営業担当者ID、氏名、担当部署、連絡先</li>
              <li>ログイン情報（ユーザー名、パスワード等、暗号化して管理）</li>
              <li>申し込みや契約に関する入力情報、サイン情報</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4 mb-2">(3) アクセス情報および利用履歴</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>IPアドレス、ブラウザ情報、端末情報、クッキー情報（必要に応じて）</li>
              <li>ログイン日時、利用状況、エラーログ</li>
            </ul>

            <h2 className="text-xl font-bold mt-8 mb-4">3. 個人情報の利用目的</h2>
            <p>当社は、取得した個人情報を以下の目的のために利用いたします。</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>本サービスの提供および運用、改善</li>
              <li>お問い合わせ対応、資料請求やデモ版申込みの処理</li>
              <li>契約締結のための本人確認、電子署名の取得、契約書の生成および送付</li>
              <li>営業担当者および代理店向けのログイン・申込み処理、データの管理</li>
              <li>管理者用ダッシュボードでの申し込み状況の確認、PDFダウンロードおよび進捗管理</li>
              <li>自動バックアップ（Google Drive連携等）による契約情報の長期保管</li>
              <li>各種通知、連絡（契約完了メール、エラー通知等）の送信</li>
              <li>セキュリティ対策および不正利用の防止</li>
            </ul>

            <h2 className="text-xl font-bold mt-8 mb-4">4. 個人情報の第三者提供</h2>
            <p>
              当社は、あらかじめお客様の同意を得る場合、または法令に定める場合を除き、
              取得した個人情報を第三者に提供することはございません。ただし、以下の場合は例外とします。
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                業務委託先（システム運用、メール送信、PDF生成、バックアップなど）への提供
                <br />
                ※この場合、当該委託先には個人情報の安全管理の義務を負わせます。
              </li>
              <li>法令に基づく開示要求があった場合</li>
            </ul>

            <h2 className="text-xl font-bold mt-8 mb-4">5. 外部サービスとの連携</h2>
            <p>
              本サービスでは、以下の外部サービスと連携し、必要な情報の取得および処理を行います。
              なお、これらのサービスの個別のプライバシーポリシーについては、各提供元の規定に従ってください。
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Firebase：ユーザー認証、データ管理を行います。</li>
              <li>電子署名サービス：契約書の電子署名取得に利用します。</li>
              <li>Google Drive API：自動バックアップ機能により契約情報をバックアップします。</li>
              <li>SMTPサーバー：契約完了メールなどの通知に利用します。</li>
              <li>その他外部ツール：プロジェクトの実装および運用基盤として利用します。</li>
            </ul>

            <h2 className="text-xl font-bold mt-8 mb-4">6. セキュリティ対策</h2>
            <p>
              当社は、個人情報の漏洩、滅失、不正アクセス等を防止するため、以下のような適切な安全管理措置を講じます。
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>データの暗号化（通信時および保存時）</li>
              <li>アクセス制御（ログイン認証、二要素認証の導入検討）</li>
              <li>定期的なバックアップおよびセキュリティ監査</li>
              <li>外部サービスとの連携における認証およびAPIキーの適切な管理</li>
            </ul>

            <h2 className="text-xl font-bold mt-8 mb-4">7. 個人情報の保管期間</h2>
            <p>
              当社は、利用目的に必要な範囲内で個人情報を保管し、利用目的が達成された後は、
              速やかに消去または匿名化いたします。ただし、法令等により保存義務がある場合はその期間保管します。
            </p>

            <h2 className="text-xl font-bold mt-8 mb-4">8. お客様の権利</h2>
            <p>お客様は、当社が保有する自身の個人情報について、以下の権利を有します。</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>開示請求、訂正、利用停止、削除の請求</li>
              <li>苦情の申し立て</li>
            </ul>
            <p>
              これらの権利行使をご希望の場合は、下記の問い合わせ窓口までご連絡ください。
            </p>

            <h2 className="text-xl font-bold mt-8 mb-4">9. プライバシーポリシーの変更</h2>
            <p>
              当社は、法令の改定やサービス内容の変更に応じ、本プライバシーポリシーを予告なく変更することがあります。
              最新のプライバシーポリシーは、本サイト上に掲載いたしますので、定期的にご確認ください。
            </p>

            <h2 className="text-xl font-bold mt-8 mb-4">10. お問い合わせ窓口</h2>
            <p>
              本プライバシーポリシーに関するお問い合わせは当HPの「お問い合わせ」よりご連絡ください。
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}