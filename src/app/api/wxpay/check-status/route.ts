// 微信支付 V3 查询订单状态 API
// 文档:https://pay.weixin.qq.com/wiki/doc/apiv3/wxpay/pay/transactions/chapter3_2.shtml
//
// 前端轮询这个接口检查用户是否付款成功

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { WXPAY_MCH_ID } from '@/lib/wxpay';

const WXPAY_API = 'https://api.mch.weixin.qq.com';

export async function POST(req: NextRequest) {
  try {
    const { outTradeNo } = await req.json();
    if (!outTradeNo) {
      return NextResponse.json({ error: '缺少 outTradeNo' }, { status: 400 });
    }

    const privateKey = (process.env.WXPAY_PRIVATE_KEY || '').replace(/\\n/g, '\n');
    if (!privateKey) {
      return NextResponse.json({ error: 'WXPAY_PRIVATE_KEY 未配置' }, { status: 500 });
    }

    const method = 'GET';
    const path = '/v3/pay/transactions/out-trade-no/' + outTradeNo;
    const query = '?mchid=' + WXPAY_MCH_ID;
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const nonceStr = crypto.randomBytes(16).toString('hex');

    // 签名串:method + path + timestamp + nonce_str + query(带 ?)
    const signStr = `${method}\n${path}\n${timestamp}\n${nonceStr}\n${query}\n`;
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(signStr);
    const signature = sign.sign(privateKey, 'base64');

    const authHeader = `WECHATPAY2-SHA256-RSA2048 mchid="${WXPAY_MCH_ID}",nonce_str="${nonceStr}",signature="${signature}",timestamp="${timestamp}",serial_no="${process.env.WXPAY_SERIAL_NO || ''}"`;

    const wxRes = await fetch(`${WXPAY_API}${path}${query}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: authHeader,
        'User-Agent': 'getmind/1.0 wxpay-client'
      }
    });

    const data = await wxRes.json();

    // trade_state 可能的值:
    // SUCCESS—支付成功
    // REFUND—转入退款
    // NOTPAY—未支付
    // CLOSED—已关闭
    // REVOKED—已撤销(付款码支付)
    // USERPAYING--用户支付中
    // PAYERROR--支付失败(其他原因,如银行返回失败)
    return NextResponse.json({
      ok: true,
      tradeState: data.trade_state,
      isPaid: data.trade_state === 'SUCCESS',
      transactionId: data.transaction_id,
      amount: data.amount?.total,
      paidAt: data.success_time
    });
  } catch (e: any) {
    return NextResponse.json({ error: '查询失败: ' + e.message }, { status: 500 });
  }
}
