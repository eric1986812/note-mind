// 微信支付 V3 回调通知 API
// 文档:https://pay.weixin.qq.com/wiki/doc/apiv3/wxpay/pay/transactions/chapter3_12.shtml
//
// 流程:
// 1. 微信在用户支付成功后,POST 这个地址,Header 带 wechatpay-* 系列头
// 2. 第一步:验证签名(用 APIv3 密钥)
// 3. 第二步:解密 resource.ciphertext(用 APIv3 密钥)
// 4. 第三步:处理业务(更新用户付费状态)
// 5. 返回 200 OK(必须),否则微信会在 4h 内多次重试

import { NextRequest, NextResponse } from 'next/server';
import {
  WXPAY_API_V3_KEY,
  verifyWechatPaySignature,
  decryptWechatPayResource
} from '@/lib/wxpay';

export async function POST(req: NextRequest) {
  try {
    // 1) 读取 header
    const timestamp = req.headers.get('Wechatpay-Timestamp') || '';
    const nonce = req.headers.get('Wechatpay-Nonce') || '';
    const signature = req.headers.get('Wechatpay-Signature') || '';
    const serial = req.headers.get('Wechatpay-Serial') || '';

    // 2) 读取 body
    const body = await req.text();

    if (!timestamp || !nonce || !signature) {
      return NextResponse.json({ code: 'FAIL', message: '缺少签名头' }, { status: 400 });
    }

    // 3) 验证签名
    if (!WXPAY_API_V3_KEY) {
      console.error('WXPAY_API_V3_KEY 未配置');
      return NextResponse.json({ code: 'FAIL', message: '服务器未配置' }, { status: 500 });
    }

    const signValid = verifyWechatPaySignature(
      timestamp,
      nonce,
      body,
      signature,
      WXPAY_API_V3_KEY
    );
    if (!signValid) {
      return NextResponse.json({ code: 'FAIL', message: '签名验证失败' }, { status: 401 });
    }

    // 4) 解析 body,解密 resource
    const payload = JSON.parse(body);
    const resource = payload.resource;
    if (!resource) {
      return NextResponse.json({ code: 'FAIL', message: '缺少 resource 字段' }, { status: 400 });
    }

    let decrypted: any;
    try {
      const decryptedStr = decryptWechatPayResource(
        resource.ciphertext,
        resource.associated_data,
        resource.nonce,
        WXPAY_API_V3_KEY
      );
      decrypted = JSON.parse(decryptedStr);
    } catch (e: any) {
      return NextResponse.json(
        { code: 'FAIL', message: '解密失败: ' + e.message },
        { status: 400 }
      );
    }

    // 5) 处理业务逻辑
    const { out_trade_no, transaction_id, trade_state, amount } = decrypted;
    console.log('支付回调:', {
      out_trade_no,
      transaction_id,
      trade_state,
      amount: amount?.total
    });

    if (trade_state !== 'SUCCESS') {
      // 支付未成功(可能用户关闭、失败等)
      return NextResponse.json({ code: 'SUCCESS', message: '已收到非成功状态' });
    }

    // TODO:更新用户付费状态
    // MVP 阶段:不接数据库,只 log
    // 进阶:写 Supabase / Upstash Redis
    // 这里应该把 out_trade_no → 用户 openId → 会员到期时间 存起来
    // 等用户来 /note 页面时,前端拿 openId 调 /api/wxpay/check-status 查

    // 6) 返回 200(必须用这种格式)
    return NextResponse.json({ code: 'SUCCESS', message: '成功' });
  } catch (e: any) {
    console.error('webhook 异常:', e);
    // 异常也要返 200,避免微信重试
    return NextResponse.json({ code: 'SUCCESS', message: '已处理' });
  }
}
