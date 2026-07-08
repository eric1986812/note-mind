// 微信支付 V3 Native 统一下单 API
// 文档:https://pay.weixin.qq.com/wiki/doc/apiv3/wxpay/pay/transactions/chapter3_3.shtml
//
// Native 支付 vs JSAPI 支付:
// - JSAPI:公众号内打开,微信自动拉起支付窗口,需 ICP 备案 + openId
// - Native:返回二维码图片,用户扫一扫付款,**不需 ICP 备案 + 不需 openId** ⭐
//
// 流程:
// 1. 客户端调用 /api/wxpay/create-order,传入 plan(价格档)
// 2. 服务端生成商户订单号 + 调微信 V3 统一下单接口(Native)
// 3. 拿到 code_url,返回给前端
// 4. 前端用 qrcode.js / canvas 把 code_url 渲染成二维码
// 5. 用户微信扫一扫 → 付款
// 6. 支付成功后,微信 POST /api/wxpay/webhook 通知
// 7. 前端轮询 /api/wxpay/check-status 查订单状态 → 跳转 /upload

import { NextRequest, NextResponse } from 'next/server';
import {
  WXPAY_MCH_ID,
  WXPAY_APPID,
  WXPAY_NOTIFY_URL,
  generateOutTradeNo,
  generateNonceStr
} from '@/lib/wxpay';

// 价格档(单位:分)
const PLANS: Record<string, { name: string; amount: number; days: number; description: string }> = {
  monthly: {
    name: '学期版(月付)',
    amount: 3900, // ¥39
    days: 30,
    description: '每月 ¥39,无限次生成'
  },
  yearly: {
    name: '年度版',
    amount: 29900, // ¥299
    days: 365,
    description: '一次 ¥299,管一年,比月付省 ¥169'
  },
  // 测试档:1 分钱,只在老板联调时用
  test: {
    name: '联调测试',
    amount: 1, // ¥0.01
    days: 30,
    description: '老板联调专用'
  }
};

const WXPAY_API = 'https://api.mch.weixin.qq.com';

export async function POST(req: NextRequest) {
  try {
    // 1) 解析请求体
    const { plan } = await req.json();
    if (!plan || !PLANS[plan]) {
      return NextResponse.json({ error: '无效的价格档: ' + plan }, { status: 400 });
    }

    // 2) 检查 Vercel 环境变量
    const privateKey = (process.env.WXPAY_PRIVATE_KEY || '').replace(/\\n/g, '\n');
    if (!privateKey) {
      return NextResponse.json(
        { error: 'WXPAY_PRIVATE_KEY 未配置(去商户平台下载 API 证书,把 apiclient_key.pem 内容填到 Vercel)' },
        { status: 500 }
      );
    }
    if (!process.env.WXPAY_SERIAL_NO) {
      return NextResponse.json(
        { error: 'WXPAY_SERIAL_NO 未配置(商户平台 → API 安全 → API 证书,看证书序列号)' },
        { status: 500 }
      );
    }

    // 3) 准备订单参数
    const outTradeNo = generateOutTradeNo();
    const planInfo = PLANS[plan];
    const body = {
      appid: WXPAY_APPID,
      mchid: WXPAY_MCH_ID,
      description: planInfo.name,
      out_trade_no: outTradeNo,
      // 回调地址,注意:不能用 localhost,必须是公网能访问的 URL
      notify_url: WXPAY_NOTIFY_URL,
      amount: {
        total: planInfo.amount, // 单位:分
        currency: 'CNY'
      }
      // Native 支付不需要 payer.openid
    };

    // 4) 调微信 V3 统一下单(Native)
    const method = 'POST';
    const url = '/v3/pay/transactions/native';
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const nonceStr = generateNonceStr(32);
    const bodyStr = JSON.stringify(body);

    // 签名串:method + url + timestamp + nonce_str + body
    const signStr = `${method}\n${url}\n${timestamp}\n${nonceStr}\n${bodyStr}\n`;

    const crypto = await import('crypto');
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(signStr);
    const signature = sign.sign(privateKey, 'base64');

    const authHeader = `WECHATPAY2-SHA256-RSA2048 mchid="${WXPAY_MCH_ID}",nonce_str="${nonceStr}",signature="${signature}",timestamp="${timestamp}",serial_no="${process.env.WXPAY_SERIAL_NO}"`;

    // 5) 调微信下单
    const wxRes = await fetch(`${WXPAY_API}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: authHeader,
        'User-Agent': 'mindflow/1.0 wxpay-client'
      },
      body: bodyStr
    });

    const wxData = await wxRes.json();

    if (!wxRes.ok || !wxData.code_url) {
      return NextResponse.json(
        {
          error: '微信下单失败',
          detail: wxData
        },
        { status: 500 }
      );
    }

    // 6) 返回前端:outTradeNo(订单号) + code_url(二维码内容) + plan/amount/days
    return NextResponse.json({
      ok: true,
      outTradeNo,
      plan,
      planName: planInfo.name,
      amount: planInfo.amount, // 分
      amountDisplay: `¥${(planInfo.amount / 100).toFixed(2)}`,
      days: planInfo.days,
      codeUrl: wxData.code_url // 用户微信扫这个链接付款
    });
  } catch (e: any) {
    return NextResponse.json({ error: '服务器异常: ' + e.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST 到此接口创建 Native 支付订单',
    plans: Object.entries(PLANS).map(([key, p]) => ({
      key,
      name: p.name,
      price: `¥${(p.amount / 100).toFixed(2)}`,
      days: p.days,
      description: p.description
    })),
    note: 'Native 支付不需 ICP 备案,不需 openId,任何地方打开都能用'
  });
}
