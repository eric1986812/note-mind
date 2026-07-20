import './globals.css';
import type { Metadata } from 'next';
import { cookies, headers } from 'next/headers';
import { langFromCountry, type Lang } from '../lib/i18n';
import { LangProvider } from '../lib/lang-context';
import { LangSwitcher } from '../components/LangSwitcher';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://mindflow.wang';

export const metadata: Metadata = {
  title: 'MindFlow — Let knowledge adapt to you',
  description:
    'AI study assistant for college students. Upload a PDF or PPT, get structured notes, a mind map, flashcards, and AI Q&A in 30 seconds. Free 5 notes per month, no credit card.',
  keywords: [
    'AI note taking',
    'PDF to notes',
    'AI study tool',
    'college students',
    'mind map',
    'flashcards',
    'spaced repetition',
    'study abroad',
    'bilingual notes'
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
    title: 'MindFlow — Let knowledge adapt to you',
    description:
      'AI study assistant for college students. Upload a PDF, get 4 ready-to-study things in 30 seconds. Free 5 notes per month.',
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
    title: 'MindFlow — Let knowledge adapt to you',
    description:
      'AI study assistant for college students. Free 5 notes per month, no credit card.',
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

  return (
    <html lang={lang === 'zh' ? 'zh-CN' : 'en'}>
      <body>
        <LangProvider lang={lang}>
          {/* 顶部 global navbar(每个页面都有)+ 嵌入语言切换器 */}
          <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
              <div className="text-xs text-gray-400">
                MindFlow
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