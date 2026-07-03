import { NextRequest, NextResponse } from 'next/server';
import { callMinimax, isMinimaxConfigured } from '@/lib/minimax';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { text, targetLang } = await req.json();
    if (!text) return NextResponse.json({ error: '文本为空' }, { status: 400 });

    const target = targetLang === 'en' ? '英文 (English)' : '中文 (Chinese)';
    const systemPrompt = `你是一位专业的英中双向翻译专家,擅长学术 / 教材 / 论文 / 商业文档翻译。

任务: 把用户给的内容翻译成${target}。

要求:
1. 严格忠实原文,不要漏译或加译
2. 学术术语用标准译法
3. 保持原文段落结构和 Markdown 格式(标题、列表、表格、引用、加粗等都要保留)
4. 如果是 Markdown 文档,翻译后输出仍是 Markdown
5. 输出${target},不加任何评论或前言说明`;

    if (!isMinimaxConfigured()) {
      return NextResponse.json({ translation: `(${target} 演示模式)\n\n# 翻译示例\n\n这是翻译后的内容...` });
    }

    // 文本过长时截断
    const truncated = text.length > 8000 ? text.slice(0, 8000) + '\n\n[原文过长,已截断]' : text;
    const r = await callMinimax(systemPrompt, truncated, { maxTokens: 6000, temperature: 0.3 });
    if (!r.ok) return NextResponse.json({ error: r.error }, { status: 502 });
    return NextResponse.json({ translation: r.content });
  } catch (e: any) {
    return NextResponse.json({ error: '翻译失败: ' + e.message }, { status: 500 });
  }
}
