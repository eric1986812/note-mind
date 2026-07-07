// 共享的 MiniMax API 调用工具
// 老板实际用的是 MiniMax M3,endpoint 是 chatcompletion_v2(不是 OpenAI 标准路径)
// 文档: https://www.minimaxi.com/models/text/m3
//
// 2026-07-07 老板截图报错 529 overloaded_error(整点高峰过载)
// 加指数退避重试:遇到 429/500/502/503/504/529 自动重试 3 次,每次间隔 2s/4s/8s

const MINIMAX_BASE = process.env.MINIMAX_BASE_URL || 'https://api.minimaxi.com';
const MINIMAX_KEY = process.env.MINIMAX_API_KEY || '';
const MINIMAX_MODEL = process.env.MINIMAX_MODEL || 'MiniMax-M3';

// 重试相关
const RETRYABLE_STATUS = new Set([408, 425, 429, 500, 502, 503, 504, 529]);
const MAX_RETRIES = 3;
const BASE_BACKOFF_MS = 2000;

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export function isMinimaxConfigured() {
  return !!MINIMAX_KEY;
}

type CallOpts = {
  maxTokens?: number;
  temperature?: number;
};

// 检测是否是过载/限流错(可以重试)
function isRetryableError(text: string, status: number): boolean {
  if (RETRYABLE_STATUS.has(status)) return true;
  if (text.includes('overloaded_error')) return true;
  if (text.includes('rate_limit')) return true;
  if (text.includes('service unavailable')) return true;
  return false;
}

export async function callMinimax(
  systemPrompt: string,
  userText: string,
  opts: CallOpts = {}
): Promise<{ ok: true; content: string } | { ok: false; error: string; retried?: number }> {
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

  let lastError = '';
  let retried = 0;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${MINIMAX_KEY}` },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const t = await res.text();
        lastError = `MiniMax API ${res.status}: ${t.slice(0, 300)}`;

        // 429/529 等可重试
        if (attempt < MAX_RETRIES && isRetryableError(t, res.status)) {
          const wait = BASE_BACKOFF_MS * Math.pow(2, attempt); // 2s/4s/8s
          retried++;
          console.log(`[minimax] attempt ${attempt + 1} failed (${res.status}), retry in ${wait}ms`);
          await sleep(wait);
          continue;
        }

        return { ok: false, error: lastError, retried };
      }

      const data = await res.json();
      const content =
        data?.choices?.[0]?.message?.content ||
        data?.choices?.[0]?.text ||
        data?.reply ||
        '';

      if (!content) {
        // 返回 200 但 content 为空,也重试一下
        if (attempt < MAX_RETRIES) {
          const wait = BASE_BACKOFF_MS * Math.pow(2, attempt);
          retried++;
          console.log(`[minimax] empty content on attempt ${attempt + 1}, retry in ${wait}ms`);
          await sleep(wait);
          continue;
        }
        return { ok: false, error: 'MiniMax 返回空内容: ' + JSON.stringify(data).slice(0, 200), retried };
      }

      return { ok: true, content: typeof content === 'string' ? content : JSON.stringify(content) };
    } catch (e: any) {
      lastError = 'MiniMax 请求失败: ' + (e.message || '未知错误');
      // 网络错也算可重试
      if (attempt < MAX_RETRIES) {
        const wait = BASE_BACKOFF_MS * Math.pow(2, attempt);
        retried++;
        console.log(`[minimax] network error on attempt ${attempt + 1}: ${e.message}, retry in ${wait}ms`);
        await sleep(wait);
        continue;
      }
      return { ok: false, error: lastError, retried };
    }
  }

  return { ok: false, error: lastError || 'MiniMax 调用失败(已重试)', retried };
}