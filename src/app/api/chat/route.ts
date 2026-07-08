import { NextRequest, NextResponse } from 'next/server';
import { callMinimax, isMinimaxConfigured } from '@/lib/minimax';

export const runtime = 'nodejs';
export const maxDuration = 30;

const SYSTEM_PROMPT = `你是 MindFlow 的学习助手。基于用户提供的资料内容回答问题。

要求:
1. 优先基于资料内容回答,引用具体段落
2. 如资料没覆盖,坦诚说明"资料中未涉及"
3. 回答简洁(200 字内),结构清晰
4. 必要时用列表/表格
5. 语气亲切,像学长学姐在解答`;

export async function POST(req: NextRequest) {
  try {
    const { question, context } = await req.json();
    if (!question) return NextResponse.json({ error: '问题为空' }, { status: 400 });

    if (!isMinimaxConfigured()) {
      return NextResponse.json({ answer: '⚠️ 演示模式:配置 MINIMAX_API_KEY 后启用真实 AI 追问。' });
    }

    const ctx = (context || '').slice(0, 15000);
    const r = await callMinimax(
      SYSTEM_PROMPT,
      `资料内容:\n${ctx}\n\n用户问题: ${question}`,
      { maxTokens: 1500, temperature: 0.5 }
    );
    if (!r.ok) return NextResponse.json({ error: r.error }, { status: 502 });
    return NextResponse.json({ answer: r.content });
  } catch (e: any) {
    return NextResponse.json({ error: '追问失败: ' + e.message }, { status: 500 });
  }
}
