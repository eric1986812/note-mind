import './globals.css';
import type { Metadata } from 'next';
import { cookies, headers } from 'next/headers';
import { langFromCountry, type Lang } from '../lib/i18n';
import { LangProvider } from '../lib/lang-context';
import { LangSwitcher } from '../components/LangSwitcher';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://mindflow.wang';

export const metadata: Metadata = {
  title: 'MindFlow — Turn any PDF into 4 study materials in 1 minute',
  description:
    'AI study assistant for college and grad-school students. Upload a lecture slide deck, a research paper, or any PDF and get structured notes, a mind map, flashcards, and AI Q&A in under a minute. 3 free notes (lifetime) — no credit card required.',
  keywords: [
    'AI note taking',
    'PDF to notes',
    'PPT to notes',
    'AI study tool',
    'college students',
    'grad school',
    'MCAT prep',
    'GRE prep',
    'LSAT prep',
    'mind map',
    'flashcards',
    'spaced repetition',
    'international students',
    'bilingual notes',
    'finals week',
    'study tool'
  ],
  authors: [{ name: 'MindFlow' }],
  creator: 'MindFlow',
  metadataBase: new URL(APP_URL),
  alternates: {
    canonical: '/',
    languages: {
      'en': '/en',
      'zh-CN': '/zh'
    }
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_URL,
    siteName: 'MindFlow',
    title: 'MindFlow — Turn any PDF into 4 study materials in 1 minute',
    description:
      'Upload a PDF, get structured notes + mind map + flashcards + AI Q&A in 1 minute. 3 free notes (lifetime) — no credit card required.',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'MindFlow — AI study assistant'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MindFlow — Turn any PDF into 4 study materials in 1 minute',
    description:
      'AI study assistant for college and grad-school students. 3 free notes (lifetime) — no credit card required.',
    images: ['/og-image.svg'],
    creator: '@mindflow_wang'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg'
  }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // 决定语言:cookie 优先 > IP 推断
  const cookieStore = await cookies();
  const headerStore = await headers();

  const cookieLang = cookieStore.get('lang')?.value;
  const country =
    headerStore.get('x-vercel-ip-country') || headerStore.get('cf-ipcountry') || null;

  const lang: Lang =
    cookieLang === 'zh' || cookieLang === 'en'
      ? (cookieLang as Lang)
      : langFromCountry(country);

  // GA4 跟踪 - 配置 Vercel env NEXT_PUBLIC_GA_MEASUREMENT_ID 后自动启用

  // GA4 Measurement ID(从 Vercel env 读)
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

  return (
    <html lang={lang === 'zh' ? 'zh-CN' : 'en'}>
      <head>
        {/* Google Analytics 4 — 只在老板配了 ID 时加载 */}
        {GA_MEASUREMENT_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_MEASUREMENT_ID}', {
                    page_path: window.location.pathname,
                    send_page_view: true
                  });
                `
              }}
            />
          </>
        )}
      </head>
      <body>
        <LangProvider lang={lang}>
          {/* 顶部 global navbar(每个页面都有)+ 嵌入语言切换器 + 导航链接 */}
          <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center gap-4">
              <a href="/" className="flex items-center gap-2 text-gray-900 font-bold hover:text-primary-600">
                <span className="text-lg">🧠 MindFlow</span>
              </a>
              <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
                <a href="/#how" className="hover:text-primary-600">{lang === 'zh' ? '怎么用' : 'How it works'}</a>
                <a href="/#compare" className="hover:text-primary-600">{lang === 'zh' ? '对比' : 'Compare'}</a>
                <a href="/pricing" className="hover:text-primary-600">{lang === 'zh' ? '定价' : 'Pricing'}</a>
                <a href="/#faq" className="hover:text-primary-600">FAQ</a>
                <a href="/upload" className="bg-primary-600 text-white px-4 py-1.5 rounded-lg hover:bg-primary-700">
                  {lang === 'zh' ? '免费试用' : 'Try free'}
                </a>
              </div>
              <LangSwitcher country={country} />
            </div>
          </nav>
          {children}
        </LangProvider>
      </body>
    </html>
  );
}