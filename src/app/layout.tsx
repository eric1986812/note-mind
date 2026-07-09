import './globals.css';
import type { Metadata } from 'next';
import { cookies, headers } from 'next/headers';
import { langFromCountry, type Lang } from '../lib/i18n';
import { LangProvider } from '../lib/lang-context';
import { LangSwitcher } from '../components/LangSwitcher';

export const metadata: Metadata = {
  title: 'MindFlow - 进入学习心流,让知识主动流入心智 | Get into the learning flow',
  description:
    '专为中国大学生 / 考研党 / 海外华人设计的 AI 笔记整理工具。上传 PPT、PDF,一键生成文字笔记、思维导图、记忆卡片。',
  icons: { icon: '/favicon.svg' }
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