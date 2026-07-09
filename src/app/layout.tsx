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
  const countryLabel = country;

  const lang: Lang =
    cookieLang === 'zh' || cookieLang === 'en'
      ? (cookieLang as Lang)
      : langFromCountry(country);

  return (
    <html lang={lang === 'zh' ? 'zh-CN' : 'en'}>
      <body>
        <LangProvider lang={lang}>
          {/* 全局浮动语言切换器 — 右上角 */}
          <div className="fixed top-4 right-4 z-50">
            <LangSwitcher country={countryLabel} />
          </div>
          {children}
        </LangProvider>
      </body>
    </html>
  );
}