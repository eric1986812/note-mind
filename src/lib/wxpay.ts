// 微信支付 V3 共享工具
// 文档:https://pay.weixin.qq.com/wiki/doc/apiv3/
// 商户号:1636556202(老板个体工商户 泸县玄澈服装店)
//
// 关键概念:
// 1. 商户 API 证书(apiclient_cert.pem + apiclient_key.pem):用于商户平台下载,敏感操作(退款)需要
// 2. APIv3 密钥(32位字符串):用于回调验签 + 敏感信息加密
// 3. AppID:微信公众号 / 小程序 / 开放平台的 AppID(不是商户号)

import crypto from 'crypto';

// === 配置 ===
export const WXPAY_MCH_ID = process.env.WXPAY_MCH_ID || ''; // 商户号
export const WXPAY_APPID = process.env.WXPAY_APPID || ''; // 公众号 / 小程序 AppID
export const WXPAY_API_V3_KEY = process.env.WXPAY_API_V3_KEY || ''; // 32 位 APIv3 密钥
export const WXPAY_NOTIFY_URL =
  process.env.WXPAY_NOTIFY_URL || 'https://getmind.vercel.app/api/wxpay/webhook';

// 微信支付 API 域名
const WXPAY_API = 'https://api.mch.weixin.qq.com';

// === 工具函数 ===

/**
 * 生成商户订单号
 * 规则:6-32 位字母数字,建议用时间戳 + 随机数
 */
export function generateOutTradeNo(): string {
  const ts = Date.now().toString(); // 13位时间戳
  const rand = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `gm${ts}${rand}`; // gm = getmind 前缀,避免和别的业务冲突
}

/**
 * 生成随机字符串
 * 微信支付要求 32 位以内
 */
export function generateNonceStr(length = 32): string {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
}

/**
 * SHA256 with RSA 签名(商户私钥签名)
 * 用于"商户平台 API 证书"模式
 *
 * 注意:Vercel serverless 环境没有持久文件系统,签名要在请求里做
 * 需要把 apiclient_key.pem 内容存在环境变量里
 */
export function signWithPrivateKey(message: string, privateKey: string): string {
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(message);
  sign.end();
  return sign.sign(privateKey, 'base64');
}

/**
 * 验证微信支付回调签名(用 APIv3 密钥)
 * 微信用 AES-256-GCM 加密回调中的敏感字段(支付完成时间、订单号等)
 * 但验签是用 wechatpay-signature 头里的签名
 */
export function verifyWechatPaySignature(
  timestamp: string,
  nonce: string,
  body: string,
  signature: string,
  apiV3Key: string
): boolean {
  const message = `${timestamp}\n${nonce}\n${body}\n`;
  const expected = crypto
    .createHmac('sha256', apiV3Key)
    .update(message)
    .digest('base64');
  return expected === signature;
}

/**
 * AES-256-GCM 解密(解密回调中的 resource.ciphertext)
 */
export function decryptWechatPayResource(
  ciphertext: string,
  associatedData: string,
  nonce: string,
  apiV3Key: string
): string {
  const key = Buffer.from(apiV3Key, 'utf8');
  const ciphertextBuf = Buffer.from(ciphertext, 'base64');
  const authTag = ciphertextBuf.slice(ciphertextBuf.length - 16);
  const data = ciphertextBuf.slice(0, ciphertextBuf.length - 16);

  const decipher = crypto.createDecipheriv('aes-256-gcm', key, nonce);
  decipher.setAuthTag(authTag);
  decipher.setAAD(Buffer.from(associatedData, 'utf8'));
  let decrypted = decipher.update(data);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString('utf8');
}

/**
 * 构造微信支付 V3 调起支付参数(返回给前端)
 */
export function buildJsapiPayParams(prepayId: string, appId: string): {
  appId: string;
  timeStamp: string;
  nonceStr: string;
  package: string;
  signType: string;
  paySign: string;
} {
  const timeStamp = Math.floor(Date.now() / 1000).toString();
  const nonceStr = generateNonceStr(32);

  const packageStr = `prepay_id=${prepayId}`;
  const message = `${appId}\n${timeStamp}\n${nonceStr}\n${packageStr}\n`;
  const paySign = crypto
    .createHmac('sha256', WXPAY_API_V3_KEY)
    .update(message)
    .digest('base64');

  return {
    appId,
    timeStamp,
    nonceStr,
    package: packageStr,
    signType: 'RSA',
    paySign
  };
}

/**
 * 检查配置是否完整
 */
export function isWxPayConfigured(): boolean {
  return !!(WXPAY_MCH_ID && WXPAY_APPID && WXPAY_API_V3_KEY);
}
