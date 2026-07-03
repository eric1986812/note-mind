// 轻量语言检测: 基于 CJK 字符比例
// 阈值: CJK > 30% → 中文, 否则 → 英文

const CJK_REGEX = /[\u4e00-\u9fff\u3400-\u4dbf]/g;

export type Lang = 'zh' | 'en' | 'mixed';

export function detectLanguage(text: string): Lang {
  if (!text) return 'en';
  // 抽样前 2000 字符判断(快)
  const sample = text.slice(0, 2000);
  const cjkCount = (sample.match(CJK_REGEX) || []).length;
  const ratio = cjkCount / sample.length;
  if (ratio > 0.3) return 'zh';
  // 简单判断:有大量英文字母
  if (/[a-zA-Z]/.test(sample) && ratio < 0.05) return 'en';
  return 'mixed';
}
