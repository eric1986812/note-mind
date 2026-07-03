import { NextRequest, NextResponse } from 'next/server';
import { callMinimax, isMinimaxConfigured } from '@/lib/minimax';

export const runtime = 'nodejs';
export const maxDuration = 60;

const SYSTEM_PROMPT = `你是记忆卡片设计专家,擅长把学习材料转成"问答式"记忆卡片,用于间隔重复复习。

要求:
1. 输出严格的 JSON 数组,每张卡 1 个对象
2. 字段: { "q": "问题", "a": "答案" }
3. 生成 8-15 张卡片
4. 卡片类型分布: 概念解释 30% / 对比区分 20% / 应用举例 20% / 数字/公式记忆 15% / 易错点 15%
5. 问题简洁精准(15 字内),答案详实(50-150 字)
6. 重点考 80/20 原则,只考最核心内容
7. 输出前用 <JSON> 标签包裹,仅此一个标签,不要任何额外说明

示例输出格式:
<JSON>
[{"q":"问题1","a":"答案1"}]
</JSON>`;

function parseCards(raw: string): { q: string; a: string }[] {
  // 1) 提取 <JSON>...</JSON> 内容
  let json = raw;
  const m1 = raw.match(/<JSON>([\s\S]*?)<\/JSON>/);
  if (m1) json = m1[1];

  // 2) 直接尝试严格 JSON 解析
  try {
    const arr = JSON.parse(json.trim());
    if (Array.isArray(arr)) return arr
      .filter((x: any) => x && typeof x.q === 'string' && typeof x.a === 'string')
      .map((x: any) => ({ q: x.q.trim(), a: String(x.a).trim() }));
  } catch (e1) {
    // 严格解析失败, 进入宽松模式
  }

  // 3) 宽松解析: 用正则逐个提取 {"q":"...","a":"..."} 对象
  const cards: { q: string; a: string }[] = [];
  // 找每一个对象的大致位置
  const objRegex = /\{\s*"q"\s*:\s*"((?:[^"\\]|\\.)*)"\s*,\s*"a"\s*:\s*"((?:[^"\\]|\\.)*)"\s*\}/g;
  let match: RegExpExecArray | null;
  while ((match = objRegex.exec(json)) !== null) {
    try {
      const q = JSON.parse('"' + match[1] + '"');
      const a = JSON.parse('"' + match[2] + '"');
      cards.push({ q, a });
    } catch {}
  }
  if (cards.length > 0) return cards;

  // 4) 还不行, 用行解析: 找 "q": 开头到 "a": 结尾
  console.error('parseCards 宽松模式也失败, 原始前 500:', raw.slice(0, 500));
  return [];
}

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text) return NextResponse.json({ error: '文本为空' }, { status: 400 });

    if (!isMinimaxConfigured()) {
      return NextResponse.json({
        cards: [
          { q: '演示卡片 1', a: '配置 MINIMAX_API_KEY 后 AI 会自动生成真实卡片。' },
          { q: '卡片类型', a: '8-15 张卡片,涵盖概念解释、对比区分、应用举例等。' }
        ]
      });
    }

    const r = await callMinimax(SYSTEM_PROMPT, text, { maxTokens: 5000, temperature: 0.4 });
    if (!r.ok) return NextResponse.json({ error: r.error }, { status: 502 });
    const cards = parseCards(r.content);
    return NextResponse.json({ cards });
  } catch (e: any) {
    return NextResponse.json({ error: '卡片生成失败: ' + e.message }, { status: 500 });
  }
}
