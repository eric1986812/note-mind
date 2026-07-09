export type Lang = 'zh' | 'en';

export const defaultLang: Lang = 'zh';

// 国家代码 → 语言
// 中国 / 港澳台 / 新加坡(华人圈)→ 中文
// 其他所有国家 → 英文
export function langFromCountry(countryCode: string | null | undefined): Lang {
  if (!countryCode) return defaultLang;
  const cnLocale = ['CN', 'HK', 'MO', 'TW', 'SG', 'MY'];
  return cnLocale.includes(countryCode.toUpperCase()) ? 'zh' : 'en';
}

// 国家代码 → 显示语言(用于右上角当前语言图标)
export function countryFlagEmoji(countryCode: string | null | undefined): string {
  if (!countryCode) return '🌐';
  const map: Record<string, string> = {
    CN: '🇨🇳', HK: '🇭🇰', MO: '🇲🇴', TW: '🇹🇼',
    SG: '🇸🇬', MY: '🇲🇾',
    US: '🇺🇸', GB: '🇬🇧', JP: '🇯🇵', KR: '🇰🇷',
    DE: '🇩🇪', FR: '🇫🇷', CA: '🇨🇦', AU: '🇦🇺',
    IN: '🇮🇳', BR: '🇧🇷', RU: '🇷🇺', ID: '🇮🇩',
    TH: '🇹🇭', VN: '🇻🇳', PH: '🇵🇭'
  };
  return map[countryCode.toUpperCase()] || '🌐';
}