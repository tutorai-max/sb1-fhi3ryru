import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  ArrowRight, 
  MessageSquare, 
  BarChart3, 
  Globe2, 
  Clock, 
  Users2, 
  CheckCircle2,
  HelpCircle,
  LogIn,
  Zap,
  Target,
  TrendingUp,
  Building2,
  FileText,
  Users
} from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const Section = ({ children, className = "" }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeIn}
      transition={{ duration: 0.6 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="bg-blue-900 text-white shadow-sm fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center text-white">
                <img src="/images/logos/B.png" alt="Logo" className="h-8 w-8" />
                <span className="ml-2 font-bold text-lg">AquaTutorAI</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/company"
                className="text-sm font-medium hover:text-blue-200 transition-colors"
              >
                会社概要
              </Link>
              <Link
                to="/contact?type=document_request"
                className="text-sm font-medium hover:text-blue-200 transition-colors"
              >
                資料請求
              </Link>
              <Link
                to="/contact?type=demo_request"
                className="text-sm font-medium hover:text-blue-200 transition-colors"
              >
                デモ版を試す
              </Link>
              <Link
                to="/login"
                className="flex items-center px-4 py-2 text-sm font-medium text-blue-900 bg-white rounded-md hover:bg-blue-50 transition-colors"
              >
                <LogIn className="h-4 w-4 mr-2" />
                営業用ログイン
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative pt-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 px-4 sm:px-6 lg:px-8">
            <Section className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left space-y-6">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl space-y-3">
                  <span className="block">研修も、接客も、</span>
                  <span className="block text-blue-600">ロールプレイングも――</span>
                  <span className="block">時代は「対話型」へ。</span>
                </h1>
                <p className="text-xl text-gray-500">
                  AIが変える、法人研修の常識
                </p>
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800 p-6 rounded-lg shadow-sm">
                  <p className="font-semibold text-lg">≪ IT導入補助金対応 ≫</p>
                  <p className="mt-2">
                    費用の1/2の補助金を受けられます。<br />
                    申請サポート費用も無料です。
                  </p>
                  <p className="mt-2 font-medium">
                    最大50～70％のコスト削減と効率UPを同時実現。<br />
                    業務効率化と人材育成の両立を実現します。
                  </p>
                </div>
                <div className="mt-8 sm:flex sm:justify-center lg:justify-start space-x-4">
                  <Link
                    to="/contact?type=demo_request"
                    className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg"
                  >
                    デモ版を試す（無料）
                    <ArrowRight className="ml-2 -mr-1 w-5 h-5" />
                  </Link>
                  <Link
                    to="/contact?type=document_request"
                    className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors shadow-md"
                  >
                    資料請求（無料）
                  </Link>
                </div>
              </div>
            </Section>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full shadow-2xl"
            src="/images/hero/ai-training.png"
            alt="AI Training"
          />
        </div>
      </div>

      {/* Features Section */}
      <Section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
              これからの研修に求められるスタイル
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              「一方通行の学習」から「実践的な対話」へ
            </p>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              研修の形が進化しています。
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-blue-100 rounded-2xl transform -rotate-2"></div>
                <img
                  src="/images/feature/rollplaying_image.png"
                  alt="Roleplaying"
                  className="relative rounded-xl shadow-xl"
                />
              </div>
              <div className="space-y-8">
                <div className="bg-white p-6 rounded-xl shadow-md transform hover:scale-105 transition-transform">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <MessageSquare className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        AIとの対話によるロールプレイング
                      </h3>
                      <p className="mt-2 text-gray-600">
                        実践力を自然に習得できる、新しい学習方法。リアルな会話シナリオで実践的なスキルを磨きます。
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md transform hover:scale-105 transition-transform">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <Users2 className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        話す・考える・伝える力
                      </h3>
                      <p className="mt-2 text-gray-600">
                        学ぶだけでなく、実践的なスキルを身につける。AIとの対話を通じて、コミュニケーション能力を向上させます。
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md transform hover:scale-105 transition-transform">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <BarChart3 className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        成長を実感できる
                      </h3>
                      <p className="mt-2 text-gray-600">
                        受講者自身が自分の進歩を確認できる。データに基づいた成長の可視化で、モチベーションを維持します。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Benefits Section */}
      <Section className="py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-blue-200 font-semibold tracking-wide uppercase">
              なぜ「対話型AI」なのか？
            </h2>
            <p className="mt-2 text-3xl font-extrabold sm:text-4xl">
              AIを活用した研修の価値
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 transform hover:scale-105 transition-transform border border-white/20">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-400 text-white mx-auto">
                  <Target className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-center">
                  現場に合った「柔軟な対応」
                </h3>
                <p className="mt-4 text-blue-200 text-center">
                  受講者ごとに違うスキルレベルや課題に、AIが最適な対応を自動で提供。一人ひとりに合わせた学習体験を実現します。
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 transform hover:scale-105 transition-transform border border-white/20">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-400 text-white mx-auto">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-center">
                  「効率」と「効果」を両立
                </h3>
                <p className="mt-4 text-blue-200 text-center">
                  移動や集合が不要。日々の業務と並行して、短時間でも高い効果を実現。時間と場所の制約から解放されます。
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 transform hover:scale-105 transition-transform border border-white/20">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-400 text-white mx-auto">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-center">
                  多様なニーズに応える「対応力」
                </h3>
                <p className="mt-4 text-blue-200 text-center">
                  多拠点・多国籍のチームでも、場所や言語に縛られない研修を。グローバルな環境でも一貫した品質を提供します。
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* FAQ Section */}
      <Section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
              FAQ
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              よくあるご質問
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                      <HelpCircle className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      サポート体制は？
                    </h3>
                    <p className="mt-2 text-gray-600">
                      専任スタッフが初期設定〜運用まで丁寧に伴走します。導入後も継続的なサポートで安心してご利用いただけます。
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                      <HelpCircle className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      IT導入補助金の対応は？
                    </h3>
                    <p className="mt-2 text-gray-600">
                      提携の専門会社が申請〜入金までしっかり支援いたします。補助金申請のノウハウを活かし、確実な補助金取得をサポートします。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="bg-gradient-to-r from-blue-900 to-blue-800">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block">未来の研修を今、選びませんか？</span>
              <span className="block text-blue-200 mt-2">
                まずは無料のデモ版で、ご体験ください。
              </span>
            </h2>
            <div className="mt-12 flex justify-center space-x-6">
              <Link
                to="/contact?type=demo_request"
                className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-blue-900 bg-white hover:bg-blue-50 transition-colors shadow-xl"
              >
                無料デモ版を試す
                <ArrowRight className="ml-2 -mr-1 w-6 h-6" />
              </Link>
              <Link
                to="/contact?type=document_request"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-lg font-medium rounded-md text-white hover:bg-blue-700 transition-colors shadow-xl"
              >
                資料請求（無料）
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center text-white">
                <img src="/images/logos/B.png" alt="Logo" className="h-8 w-8" />
                <span className="ml-2 font-bold text-lg">AquaTutorAI</span>
              </div>
              <p className="mt-4 text-gray-400">
                AIを活用した次世代の研修ソリューション
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">リンク</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/company" className="text-gray-400 hover:text-white transition-colors">
                    会社概要
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                    プライバシーポリシー
                  </Link>
                </li>
                <li>
                  <Link to="/partner" className="text-gray-400 hover:text-white transition-colors">
                    代理店募集
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">お問い合わせ</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/contact?type=document_request" className="text-gray-400 hover:text-white transition-colors">
                    資料請求
                  </Link>
                </li>
                <li>
                  <Link to="/contact?type=demo_request" className="text-gray-400 hover:text-white transition-colors">
                    デモ版を試す
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                    お問い合わせ
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">© AquaTutorAI All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;