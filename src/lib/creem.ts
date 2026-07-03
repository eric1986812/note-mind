// Creem 共享工具
// 文档:https://docs.creem.io/
//
// 关键概念:
// 1. API Key:在 Creem Dashboard → Settings → API Keys 拿到,用于服务端调用
// 2. Webhook:Creem 在订单状态变化时 POST 通知,需要验签
// 3. 产品 ID:在 Dashboard → Products 创产品时拿到
// 4. 测试模式:Dashboard 有 "Test mode" 开关,开启后用测试卡 4242 4242 4242 4242
//
// 常用 endpoint:
// - POST /v1/checkouts   创建一次性 checkout 链接
// - POST /v1/subscriptions 创建订阅
// - GET  /v1/subscriptions/:id   查订阅状态
// - GET  /v1/products/:id   查产品详情
// - Webhook events:checkout.completed / subscription.active / subscription.canceled

import crypto from 'crypto';

const CREEM_API = 'https://api.creem.io/v1';

// 老板的环境变量
export const CREEM_API_KEY = process.env.CREEM_API_KEY || '';
export const CREEM_WEBHOOK_SECRET = process.env.CREEM_WEBHOOK_SECRET || '';
export const CREEM_PRODUCT_MONTHLY = process.env.CREEM_PRODUCT_MONTHLY || '';
export const CREEM_PRODUCT_YEARLY = process.env.CREEM_PRODUCT_YEARLY || '';

// 价格档(美元,带小数点)
export const CREEM_PLANS: Record<
  string,
  { key: string; productId: string; name: string; amount: number; days: number }
> = {
  monthly: {
    key: 'monthly',
    productId: CREEM_PRODUCT_MONTHLY,
    name: 'GetMind Semester Plan (Monthly)',
    amount: 39, // USD
    days: 30
  },
  yearly: {
    key: 'yearly',
    productId: CREEM_PRODUCT_YEARLY,
    name: 'GetMind Annual Plan',
    amount: 299, // USD (海外用户)
    days: 365
  }
};

// Creem 测试模式开关(老板本地调试用)
export function isCreemConfigured(): boolean {
  return !!CREEM_API_KEY;
}

/**
 * 验证 Creem webhook 签名
 * 文档:https://docs.creem.io/learn/webhooks
 *
 * Creem 用 HMAC-SHA256,在 header 里是 `creem-signature: t=...,v1=...`
 */
export function verifyCreemSignature(
  rawBody: string,
  signatureHeader: string,
  secret: string
): boolean {
  if (!secret) return false;

  // 解析 signature header
  const parts = signatureHeader.split(',').reduce(
    (acc, part) => {
      const [k, v] = part.split('=');
      acc[k.trim()] = v.trim();
      return acc;
    },
    {} as Record<string, string>
  );
  const t = parts['t'];
  const v1 = parts['v1'];
  if (!t || !v1) return false;

  // 签名内容:timestamp + "." + rawBody
  const message = `${t}.${rawBody}`;
  const expected = crypto
    .createHmac('sha256', secret)
    .update(message)
    .digest('hex');

  return expected === v1;
}
