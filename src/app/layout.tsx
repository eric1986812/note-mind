import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NoteMind AI - 让知识主动适应你',
  description: '专为中国大学生 / 考研党设计的 AI 笔记整理工具。上传 PPT、PDF，一键生成文字笔记、思维导图、记忆卡片。',
  icons: { icon: '/favicon.svg' }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
