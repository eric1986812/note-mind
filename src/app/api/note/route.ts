import { NextRequest, NextResponse } from 'next/server';
import { callMinimax, isMinimaxConfigured } from '@/lib/minimax';

export const runtime = 'nodejs';
export const maxDuration = 60;

const SYSTEM_PROMPT = `你是一位经验丰富的大学/高中特级教师,擅长把学习材料整理成"考试导向"的高质量结构化笔记。

# 核心原则
- **以"学生学完能考高分"为目标**,不是简单复述原文
- 提取知识骨架,补充学生难以自己想到的对比、避坑、口诀
- 严格基于原文事实,不要臆造数据/公式/历史

# 输出格式(Markdown)
1. **# 标题**:用文档主题命名
2. **## 文档概览**:3-5 句话说清本章讲什么、为什么重要
3. **## 核心知识**:用 2-4 级标题分层
   - 关键概念用 **加粗**,次要用 *斜体*
   - 必须用 Markdown 表格做对比(如:光反应 vs 暗反应)
   - 用 - 列表展示并列内容,用 1.2.3 展示步骤
4. **## 关键公式/数据**:用 $$...$$ 包裹 LaTeX 公式
5. **## 易考点提示**:列出 3-5 个具体考点(用 - 开头,每个点用 **加粗** 标注考频)
6. **## 易错点提醒**:列出 3-5 个学生常错的细节
7. **## 考前速记**:3-5 句口诀/一句话总结,便于快速回忆

# 重要:不要输出
- 禁止用代码块包裹笔记内容(用户要直接看到渲染效果)
- 禁止长篇复制原文
- 禁止"以下为..."之类的废话
- 禁止 JSON,直接出 Markdown 文本`;

export async function POST(req: NextRequest) {
  try {
    const { text, filename } = await req.json();
    if (!text) return NextResponse.json({ error: '文本为空' }, { status: 400 });

    if (!isMinimaxConfigured()) {
      return NextResponse.json({ note: `# ${filename || '演示笔记'}\n\n> ⚠️ 演示模式` });
    }

    const r = await callMinimax(
      SYSTEM_PROMPT,
      `文件名: ${filename || '未命名'}\n\n文档内容:\n${text}`,
      { maxTokens: 6000, temperature: 0.5 }
    );
    if (!r.ok) return NextResponse.json({ error: r.error }, { status: 502 });
    return NextResponse.json({ note: r.content });
  } catch (e: any) {
    return NextResponse.json({ error: '笔记生成失败: ' + e.message }, { status: 500 });
  }
}
