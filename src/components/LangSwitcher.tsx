'use client';

import { useLang } from '../lib/lang-context';
import { countryFlagEmoji } from '../lib/i18n';

export function LangSwitcher({ country }: { country?: string | null }) {
  const { lang, setLang } = useLang();

  return (
    <div className="inline-flex items-center gap-1 bg-white border-2 border-gray-300 shadow-lg rounded-full px-1 py-1 text-sm">
      <button
        onClick={() => setLang('zh')}
        className={`px-4 py-1.5 rounded-full transition ${
          lang === 'zh'
            ? 'bg-primary-600 text-white font-bold shadow-md'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        title="中文"
      >
        🇨🇳 <span className="ml-1">中文</span>
      </button>
      <button
        onClick={() => setLang('en')}
        className={`px-4 py-1.5 rounded-full transition ${
          lang === 'en'
            ? 'bg-primary-600 text-white font-bold shadow-md'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        title="English"
      >
        🇺🇸 <span className="ml-1">EN</span>
      </button>
    </div>
  );
}