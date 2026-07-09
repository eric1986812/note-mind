'use client';

import { useLang } from '../lib/lang-context';
import { countryFlagEmoji } from '../lib/i18n';

export function LangSwitcher({ country }: { country?: string | null }) {
  const { lang, setLang } = useLang();

  return (
    <div className="inline-flex items-center gap-1 bg-white border border-gray-200 shadow-lg rounded-full px-1 py-1 text-xs">
      <button
        onClick={() => setLang('zh')}
        className={`px-3 py-1.5 rounded-full transition ${
          lang === 'zh'
            ? 'bg-primary-600 text-white font-bold shadow-md'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        title="中文"
      >
        🇨🇳 <span className="ml-0.5">中</span>
      </button>
      <button
        onClick={() => setLang('en')}
        className={`px-3 py-1.5 rounded-full transition ${
          lang === 'en'
            ? 'bg-primary-600 text-white font-bold shadow-md'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        title="English"
      >
        🇺🇸 <span className="ml-0.5">EN</span>
      </button>
    </div>
  );
}