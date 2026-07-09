'use client';

import { useLang } from '../lib/lang-context';
import { countryFlagEmoji } from '../lib/i18n';

export function LangSwitcher({ country }: { country?: string | null }) {
  const { lang, setLang } = useLang();
  const flag = countryFlagEmoji(country);

  return (
    <div className="inline-flex items-center gap-1 bg-white/10 backdrop-blur rounded-full px-1 py-1 text-xs">
      <button
        onClick={() => setLang('zh')}
        className={`px-3 py-1 rounded-full transition ${
          lang === 'zh'
            ? 'bg-primary-600 text-white font-semibold'
            : 'text-gray-300 hover:text-white'
        }`}
        title="中文"
      >
        🇨🇳 中
      </button>
      <button
        onClick={() => setLang('en')}
        className={`px-3 py-1 rounded-full transition ${
          lang === 'en'
            ? 'bg-primary-600 text-white font-semibold'
            : 'text-gray-300 hover:text-white'
        }`}
        title="English"
      >
        🇺🇸 EN
      </button>
    </div>
  );
}