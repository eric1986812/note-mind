import { NextRequest, NextResponse } from 'next/server';
import { callMinimax, isMinimaxConfigured } from '@/lib/minimax';

export const runtime = 'nodejs';
export const maxDuration = 60;

const SYSTEM_PROMPT = `你是一位思维导图专家,擅长把文档转成**层级清晰、密度适中**的可视化思维导图。

# 设计原则(严格遵守)
- **总节点数 25-35 个**(含根节点,过密看不清,过疏没信息量)
- **深度固定 3 层**:根(1) → 一级(3-6 个) → 二级(每分支 2-5 个)
- **不再展开第三层**(避免节点爆炸)
- **根节点**:文档主题
- **一级节点**:文档的主要章节/主题
- **二级节点**:每个主题下的关键概念/步骤/分类
- 细节内容用简短的"关键词/短语",不要完整句子

# 合并/精简规则(关键!)
- 重复或并列的概念合并为一条(如"普利斯特利/英格豪兹/塞尼比尔/索绪尔"合并为"4 位科学家(1771-1804)")
- 表格/公式/具体数字/历史年表**不进导图**(导图只显示骨架)
- 但**关键的并列子项**(如"光反应 3 个步骤:水的光解/ATP合成/NADPH生成")保留为二级节点

# 节点命名
- 控制在 4-12 个汉字
- 用名词/短语,避免"的"、"是"、"了"等虚词

# 输出
只输出一个 <JSON>...</JSON> 标签,里面是 JSON 树。

格式示例:
<JSON>
{
  "label": "光合作用",
  "children": [
    { "label": "发现简史", "children": [
      { "label": "4 位科学家(1771-1804)" }
    ]},
    { "label": "光反应", "children": [
      { "label": "水的光解" },
      { "label": "ATP 合成" },
      { "label": "NADPH 生成" }
    ]},
    { "label": "暗反应", "children": [
      { "label": "CO₂ 固定" },
      { "label": "C₃ 还原" },
      { "label": "C₅ 再生" }
    ]}
  ]
}
</JSON>`;

type MindNode = { label: string; children?: MindNode[] };

function parseMindmap(raw: string): MindNode | null {
  const m = raw.match(/<JSON>([\s\S]*?)<\/JSON>/);
  if (!m) return null;
  try {
    const obj = JSON.parse(m[1].trim());
    if (obj && typeof obj.label === 'string') return obj as MindNode;
    return null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text) return NextResponse.json({ error: '文本为空' }, { status: 400 });

    if (!isMinimaxConfigured()) {
      return NextResponse.json({ mindmap: { label: '演示导图', children: [{ label: '配置 API Key' }] } });
    }

    const r = await callMinimax(SYSTEM_PROMPT, text, { maxTokens: 3000, temperature: 0.4 });
    if (!r.ok) return NextResponse.json({ error: r.error }, { status: 502 });
    const tree = parseMindmap(r.content);
    if (!tree) return NextResponse.json({ error: '导图解析失败,原始: ' + r.content.slice(0, 200) }, { status: 502 });
    return NextResponse.json({ mindmap: tree });
  } catch (e: any) {
    return NextResponse.json({ error: '导图生成失败: ' + e.message }, { status: 500 });
  }
}
