import { NextRequest, NextResponse } from 'next/server';
import { callMinimax, isMinimaxConfigured } from '@/lib/minimax';

export const runtime = 'nodejs';
export const maxDuration = 60;

const SYSTEM_PROMPT = `你是术语提取专家,擅长从英文学习材料(论文 / 教材 / 课程)中提取关键学术 / 学科术语。

要求:
1. 输出严格的 JSON 数组,每条 1 个对象
2. 字段: { "term": "英文术语", "translation": "中文译名", "definition": "一句话中文解释" }
3. 提取 8-20 个最核心的术语
4. 优先提取: 学科专有名词 / 关键概念 / 缩写 / 难词
5. 排除: 通用词(the/is/a)、人名、简单名词
6. definition 用一句话(20-50 字)解释,中文
7. 输出前用 <JSON> 标签包裹,仅此一个标签,不要任何额外说明

示例:
<JSON>
[{"term":"photosynthesis","translation":"光合作用","definition":"植物利用光能将二氧化碳和水转化为有机物的过程"}]
</JSON>`;

function parseTerms(raw: string): { term: string; translation: string; definition: string }[] {
  const m = raw.match(/<JSON>([\s\S]*?)<\/JSON>/);
  if (m) {
    try {
      const arr = JSON.parse(m[1].trim());
      if (Array.isArray(arr)) return arr.filter((x: any) => x && x.term && x.translation);
    } catch {}
  }
  // 宽松模式
  const cards: any[] = [];
  const objRegex = /\{\s*"term"\s*:\s*"((?:[^"\\]|\\.)*)"\s*,\s*"translation"\s*:\s*"((?:[^"\\]|\\.)*)"\s*,\s*"definition"\s*:\s*"((?:[^"\\]|\\.)*)"/g;
  let match: RegExpExecArray | null;
  while ((match = objRegex.exec(raw)) !== null) {
    try {
      const term = JSON.parse('"' + match[1] + '"');
      const translation = JSON.parse('"' + match[2] + '"');
      const definition = JSON.parse('"' + match[3] + '"');
      cards.push({ term, translation, definition });
    } catch {}
  }
  return cards;
}

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text) return NextResponse.json({ error: '文本为空' }, { status: 400 });

    if (!isMinimaxConfigured()) {
      return NextResponse.json({
        terms: [
          { term: 'demo term', translation: '演示术语', definition: '配置 API Key 后提取真实术语' }
        ]
      });
    }

    const truncated = text.length > 6000 ? text.slice(0, 6000) + '\n\n[原文过长,已截断]' : text;
    const r = await callMinimax(SYSTEM_PROMPT, truncated, { maxTokens: 4000, temperature: 0.3 });
    if (!r.ok) return NextResponse.json({ error: r.error }, { status: 502 });
    const terms = parseTerms(r.content);
    return NextResponse.json({ terms });
  } catch (e: any) {
    return NextResponse.json({ error: '术语提取失败: ' + e.message }, { status: 500 });
  }
}
