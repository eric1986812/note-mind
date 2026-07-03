// 共享的 MiniMax API 调用工具
// 老板实际用的是 MiniMax M3,endpoint 是 chatcompletion_v2(不是 OpenAI 标准路径)
// 文档: https://www.minimaxi.com/models/text/m3

const MINIMAX_BASE = process.env.MINIMAX_BASE_URL || 'https://api.minimaxi.com';
const MINIMAX_KEY = process.env.MINIMAX_API_KEY || '';
const MINIMAX_MODEL = process.env.MINIMAX_MODEL || 'MiniMax-M3';

export function isMinimaxConfigured() {
  return !!MINIMAX_KEY;
}

type CallOpts = {
  maxTokens?: number;
  temperature?: number;
};

export async function callMinimax(
  systemPrompt: string,
  userText: string,
  opts: CallOpts = {}
): Promise<{ ok: true; content: string } | { ok: false; error: string }> {
  if (!MINIMAX_KEY) return { ok: false, error: 'MINIMAX_API_KEY 未配置' };

  const url = `${MINIMAX_BASE}/v1/text/chatcompletion_v2`;
  const body: any = {
    model: MINIMAX_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userText }
    ],
    max_tokens: opts.maxTokens ?? 8000,
    temperature: opts.temperature ?? 0.5,
    stream: false,
    // 关闭 thinking 模式:让所有 token 都给 content,避免 finish_reason=length
    thinking: { type: 'disabled' }
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${MINIMAX_KEY}` },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const t = await res.text();
      return { ok: false, error: `MiniMax API ${res.status}: ${t.slice(0, 300)}` };
    }
    const data = await res.json();
    // 兼容多种返回格式
    const content =
      data?.choices?.[0]?.message?.content ||
      data?.choices?.[0]?.text ||
      data?.reply ||
      '';
    if (!content) {
      return { ok: false, error: 'MiniMax 返回空内容: ' + JSON.stringify(data).slice(0, 200) };
    }
    return { ok: true, content: typeof content === 'string' ? content : JSON.stringify(content) };
  } catch (e: any) {
    return { ok: false, error: 'MiniMax 请求失败: ' + (e.message || '未知错误') };
  }
}
