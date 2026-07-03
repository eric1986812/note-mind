// Creem webhook - 接收支付成功通知
// 文档:https://docs.creem.io/learn/webhooks/handling-webhooks
//
// 事件类型:
// - checkout.completed  一次性订单完成
// - subscription.active  订阅激活(开始周期扣款)
// - subscription.paid   订阅周期扣款成功
// - subscription.canceled 订阅取消
// - subscription.expired 订阅到期

import { NextRequest, NextResponse } from 'next/server';
import { CREEM_WEBHOOK_SECRET, verifyCreemSignature } from '@/lib/creem';

// 调试用:记录所有 webhook 事件
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('creem-signature') || '';

    // 1) 验签(防止伪造回调)
    if (CREEM_WEBHOOK_SECRET) {
      const valid = verifyCreemSignature(rawBody, signature, CREEM_WEBHOOK_SECRET);
      if (!valid) {
        return NextResponse.json({ error: '签名验证失败' }, { status: 401 });
      }
    }

    // 2) 解析事件
    const event = JSON.parse(rawBody);
    const type = event.type || event.event_type || event.event;
    const data = event.data || event;

    console.log('Creem webhook:', type, data?.id);

    // 3) 根据事件类型处理
    switch (type) {
      case 'checkout.completed': {
        // 一次性订单完成
        const customerEmail = data.customer?.email;
        const plan = data.metadata?.plan;
        const productId = data.product?.id;

        // TODO:更新用户付费状态
        // 真实实现:写 Supabase / KV
        // 例如:await db.setUserPaid(customerEmail, plan, exp)
        console.log('一次性订单完成:', customerEmail, plan, productId);
        break;
      }

      case 'subscription.active':
      case 'subscription.paid': {
        // 订阅激活或扣款成功
        const customerEmail = data.customer?.email;
        const plan = data.metadata?.plan;
        const expiresAt = data.current_period_end; // 周期结束时间
        console.log('订阅成功:', customerEmail, plan, expiresAt);
        // TODO:延长期限
        break;
      }

      case 'subscription.canceled':
      case 'subscription.expired': {
        // 订阅取消或到期
        const customerEmail = data.customer?.email;
        console.log('订阅取消/到期:', customerEmail);
        // TODO:标记用户为非会员
        break;
      }

      default:
        console.log('未知 Creem 事件:', type);
    }

    // 4) 返回 200(必须返 200,Creem 才会停止重试)
    return NextResponse.json({ received: true });
  } catch (e: any) {
    console.error('Creem webhook 错误:', e);
    return NextResponse.json({ received: true, error: e.message }, { status: 200 });
  }
}
