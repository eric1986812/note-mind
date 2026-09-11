export type Lang = 'zh' | 'en';

// 老板 9-11 决策:主战场转向海外用户,默认英文
// 中文保留为辅助(海外华人 / 港澳台 / 新加坡 / 中国大陆)
export const defaultLang: Lang = 'en';

// 国家代码 → 语言
// 华人圈(CN/HK/MO/TW/SG/MY)→ 中文
// 其他所有国家 → 英文(主战场)
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