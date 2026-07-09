'use client';

import Link from 'next/link';
import {
  Brain, FileText, Network, Layers, MessageCircle, Sparkles,
  Upload, CheckCircle2, X, Clock, BookOpen, GraduationCap, Globe,
  Shield, Zap, Users, ArrowRight
} from 'lucide-react';
import { useLang } from '../lib/lang-context';

export default function HomePage() {
  const { t } = useLang();

  return (
    <main className="min-h-screen bg-white">
      {/* ===== 顶部导航 ===== */}
      <nav className="border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Brain className="w-7 h-7 text-primary-600" />
            <span className="font-bold text-xl text-gray-900">{t('meta.siteName')}</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/history" className="text-gray-600 hover:text-primary-600 hidden sm:inline">{t('home.navNotes')}</Link>
            <Link href="#how" className="text-gray-600 hover:text-primary-600 hidden sm:inline">{t('home.navHow')}</Link>
            <Link href="#compare" className="text-gray-600 hover:text-primary-600 hidden sm:inline">{t('home.navCompare')}</Link>
            <Link href="#pricing" className="text-gray-600 hover:text-primary-600 hidden sm:inline">{t('home.navPricing')}</Link>
            <Link href="#faq" className="text-gray-600 hover:text-primary-600 hidden md:inline">{t('home.navFaq')}</Link>
            <Link href="/upload" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 font-medium">
              {t('home.navCta')}
            </Link>
          </div>
        </div>
      </nav>

      {/* ===== Hero ===== */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-emerald-50 py-20 md:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <Sparkles className="w-4 h-4" /> {t('home.badge')}
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-[1.15]">
            {t('home.heroTitle1')}<br />
            <span className="text-primary-600">{t('home.heroTitle2')}</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-4 max-w-2xl mx-auto leading-relaxed"
             dangerouslySetInnerHTML={{ __html: t('home.heroDesc') }} />
          <p className="text-sm text-gray-500 mb-10">
            {t('home.heroSubline')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/upload" className="bg-primary-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-700 shadow-lg shadow-primary-200 flex items-center justify-center gap-2">
              {t('home.ctaPrimary')} <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="#how" className="bg-white text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold border border-gray-200 hover:border-primary-300">
              {t('home.ctaSecondary')}
            </Link>
          </div>
          <p className="text-xs text-gray-500 mt-5">
            {t('home.ctaFootnote')}
          </p>
        </div>
      </section>

      {/* ===== 痛点场景 ===== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{t('home.scenesTitle')}</h2>
            <p className="text-gray-600">{t('home.scenesSub')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Clock, sceneKey: 'scene1' },
              { icon: GraduationCap, sceneKey: 'scene2' },
              { icon: Globe, sceneKey: 'scene3' }
            ].map((c, i) => (
              <div key={i} className="bg-white p-7 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-sm text-primary-600 font-semibold mb-3">{t(`home.${c.sceneKey}Tag`)}</div>
                <div className="flex items-start gap-3 mb-4">
                  <c.icon className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                  <h3 className="text-lg font-bold text-gray-900 leading-snug">{t(`home.${c.sceneKey}Title`)}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">{t(`home.${c.sceneKey}Pain`)}</p>
                <div className="text-sm text-primary-700 bg-primary-50 rounded-lg p-3 leading-relaxed">
                  {t(`home.${c.sceneKey}Result`)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 4 大核心功能 ===== */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-emerald-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{t('home.featuresTitle')}</h2>
            <p className="text-gray-700 text-lg">{t('home.featuresSub')}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { icon: FileText, key: 'featureNote' },
              { icon: Network, key: 'featureMap' },
              { icon: Layers, key: 'featureCard' },
              { icon: MessageCircle, key: 'featureChat' }
            ].map((f, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition flex gap-4">
                <div className="text-3xl flex-shrink-0">{t(`home.${f.key}Title`).split(' ')[0]}</div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{t(`home.${f.key}Title`).split(' ').slice(1).join(' ')}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{t(`home.${f.key}Desc`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Before / After ===== */}
      <section id="compare" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{t('home.compareTitle')}</h2>
            <p className="text-gray-600">{t('home.compareSub')}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-2 border-red-100 bg-red-50/30 rounded-2xl p-6">
              <div className="flex items-center gap-2 text-red-600 font-semibold mb-4">
                <X className="w-5 h-5" /> {t('home.compareOldTitle')}
              </div>
              <ul className="space-y-3 text-sm text-gray-700">
                {[1,2,3,4,5].map(n => (
                  <li key={n} className="flex gap-2">
                    <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <span dangerouslySetInnerHTML={{ __html: t(`home.compareOld${n}`) }} />
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-2 border-primary-200 bg-primary-50/50 rounded-2xl p-6">
              <div className="flex items-center gap-2 text-primary-700 font-semibold mb-4">
                <CheckCircle2 className="w-5 h-5" /> {t('home.compareNewTitle')}
              </div>
              <ul className="space-y-3 text-sm text-gray-700">
                {[1,2,3,4,5].map(n => (
                  <li key={n} className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span dangerouslySetInnerHTML={{ __html: t(`home.compareNew${n}`) }} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 怎么用 3 步 ===== */}
      <section id="how" className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{t('home.howTitle')}</h2>
            <p className="text-gray-600">{t('home.howSub')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n: '1', icon: Upload, key: 'howStep1' },
              { n: '2', icon: Sparkles, key: 'howStep2' },
              { n: '3', icon: MessageCircle, key: 'howStep3' }
            ].map((s, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-full text-xl font-bold mb-4">
                  {s.n}
                </div>
                <s.icon className="w-8 h-8 text-primary-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t(`home.${s.key}`)}</h3>
                <p className="text-sm text-gray-600">{t(`home.${s.key}Desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 创始人自述 ===== */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-sm text-primary-300 font-semibold mb-3 uppercase tracking-wide">{t('home.whyTitle')}</p>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 leading-relaxed">
            {t('home.whyBody')}
          </h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            {t('home.whyBody2')}
          </p>
          <p className="text-gray-300 leading-relaxed"
             dangerouslySetInnerHTML={{ __html: t('home.whyBody3') }} />
        </div>
      </section>

      {/* ===== 定价 ===== */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{t('home.pricingTitle')}</h2>
            <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: t('home.pricingSub') }} />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { key: 'planFree', hot: false },
              { key: 'planMonth', hot: true },
              { key: 'planYear', hot: false }
            ].map(p => (
              <div key={p.key} className={`p-7 rounded-2xl ${p.hot ? 'bg-primary-600 text-white ring-4 ring-primary-200 shadow-2xl scale-105' : 'bg-white border border-gray-200 shadow-sm'}`}>
                {p.hot && <div className="text-xs font-bold bg-amber-300 text-amber-900 inline-block px-2 py-0.5 rounded mb-2">{t(`home.${p.key}Hot`)}</div>}
                <h3 className={`text-2xl font-bold mb-2 ${p.hot ? 'text-white' : 'text-gray-900'}`}>{t(`home.${p.key}Name`)}</h3>
                <div className="mb-6">
                  <span className={`text-4xl font-extrabold ${p.hot ? 'text-white' : 'text-gray-900'}`}>{t(`home.${p.key}Price`)}</span>
                  <span className={`text-sm ml-1 ${p.hot ? 'text-primary-100' : 'text-gray-500'}`}>{t(`home.${p.key}Period`)}</span>
                </div>
                <ul className="space-y-2.5 mb-8 text-sm">
                  {[1,2,3,4].map(n => {
                    const feature = t(`home.${p.key}F${n}`);
                    return feature && feature !== `home.${p.key}F${n}` ? (
                      <li key={n} className="flex gap-2">
                        <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${p.hot ? 'text-primary-200' : 'text-primary-600'}`} />
                        <span className={p.hot ? 'text-primary-50' : 'text-gray-700'}>{feature}</span>
                      </li>
                    ) : null;
                  })}
                </ul>
                <Link href="/upload" className={`block text-center py-3 rounded-lg font-semibold ${p.hot ? 'bg-white text-primary-700 hover:bg-primary-50' : 'bg-primary-600 text-white hover:bg-primary-700'}`}>
                  {t(`home.${p.key}Cta`)}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">{t('home.faqTitle')}</h2>
          <div className="space-y-4">
            {[1,2,3,4].map(n => (
              <details key={n} className="bg-white rounded-xl shadow-sm p-6 group">
                <summary className="cursor-pointer font-semibold text-gray-900 flex justify-between items-center">
                  {t(`home.faq${n}Q`)}
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-3 text-gray-700 leading-relaxed">{t(`home.faq${n}A`)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA Bottom ===== */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('home.ctaBottomTitle')}</h2>
          <p className="text-primary-100 text-lg mb-8">{t('home.ctaBottomSub')}</p>
          <Link href="/upload" className="bg-white text-primary-600 px-10 py-5 rounded-xl text-xl font-bold hover:bg-gray-50 shadow-xl inline-flex items-center justify-center gap-2">
            {t('home.ctaBottomButton')} <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="bg-gray-900 text-gray-400 py-10 text-sm">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Brain className="w-5 h-5 text-primary-500" />
            <span className="text-white font-bold">{t('meta.siteName')}</span>
          </div>
          <p>{t('home.footerCopyright')}</p>
          <p className="mt-2 text-xs text-gray-500">
            <span dangerouslySetInnerHTML={{ __html: t('home.footerSubline').replace('support@mindflow.wang', `<a href="mailto:support@mindflow.wang" class="hover:text-white underline">support@mindflow.wang</a>`) }} />
          </p>
          <div className="mt-4 flex items-center justify-center gap-4 text-xs flex-wrap">
            <Link href="/privacy" className="hover:text-white">{t('home.footerPrivacy')}</Link>
            <span className="text-gray-600">·</span>
            <Link href="/terms" className="hover:text-white">{t('home.footerTerms')}</Link>
            <span className="text-gray-600">·</span>
            <Link href="/disclaimer" className="hover:text-white">{t('home.footerDisclaimerLink')}</Link>
            <span className="text-gray-600">·</span>
            <Link href="/acceptable-use" className="hover:text-white">{t('home.footerAup')}</Link>
            <span className="text-gray-600">·</span>
            <a href={t('home.manageSubUrl')} target="_blank" rel="noopener noreferrer" className="hover:text-white">{t('home.footerManageSub')}</a>
          </div>
          <p className="mt-3 text-xs text-gray-600">{t('home.footerDisclaimer')}</p>
        </div>
      </footer>
    </main>
  );
}