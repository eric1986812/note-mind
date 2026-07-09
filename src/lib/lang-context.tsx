'use client';

import { createContext, useContext, ReactNode, useCallback } from 'react';
import zhDict from '../locales/zh.json';
import enDict from '../locales/en.json';
import type { Lang } from './i18n';

type Dict = typeof zhDict;
const dicts: Record<Lang, Dict> = { zh: zhDict, en: enDict };

interface LangContextValue {
  lang: Lang;
  t: (key: string) => string;
  setLang: (lang: Lang) => void;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({
  lang,
  children
}: {
  lang: Lang;
  children: ReactNode;
}) {
  // 支持 a.b.c 路径访问
  const t = useCallback(
    (key: string) => {
      const parts = key.split('.');
      let cur: any = dicts[lang];
      for (const p of parts) {
        if (cur == null) return key;
        cur = cur[p];
      }
      return typeof cur === 'string' ? cur : key;
    },
    [lang]
  );

  // 用户手动切换:写 cookie + 跳转(去掉 query)
  const setLang = useCallback((newLang: Lang) => {
    document.cookie = `lang=${newLang}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    // 简单粗暴刷新,让 middleware 不拦截
    const url = new URL(window.location.href);
    url.searchParams.set('lang', newLang);
    window.location.href = url.toString();
  }, []);

  return (
    <LangContext.Provider value={{ lang, t, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used inside LangProvider');
  return ctx;
}