// Creem checkout API - 创建一次性 checkout 链接
// 文档:https://docs.creem.io/api-reference/endpoint/checkout/create

import { NextRequest, NextResponse } from 'next/server';
import { isCreemConfigured, CREEM_API_KEY, CREEM_PLANS } from '@/lib/creem';

const CREEM_API = 'https://api.creem.io/v1';

export async function POST(req: NextRequest) {
  try {
    if (!isCreemConfigured()) {
      return NextResponse.json({ error: 'Creem 未配置' }, { status: 500 });
    }

    const { plan, customerEmail } = await req.json();
    if (!plan || !CREEM_PLANS[plan]) {
      return NextResponse.json({ error: '无效的价格档: ' + plan }, { status: 400 });
    }

    const planInfo = CREEM_PLANS[plan];

    // Creem checkout 创建请求
    // 实际 API: POST https://api.creem.io/v1/checkouts
    // 文档:https://docs.creem.io/api-reference/endpoint/checkout/create
    const res = await fetch(`${CREEM_API}/checkouts`, {
      method: 'POST',
      headers: {
        'x-api-key': CREEM_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        product_id: planInfo.productId,
        // 成功后跳转
        success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://getmind.vercel.app'}/upload?paid=${plan}`,
        // 取消后跳转
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://getmind.vercel.app'}/pricing`,
        // 客户邮箱(可选,Creem 会发收据)
        customer: customerEmail ? { email: customerEmail } : undefined,
        // 元数据:我们自己的订单号
        metadata: {
          plan,
          productName: planInfo.name,
          source: 'getmind.ai'
        }
      })
    });

    const data = await res.json();

    if (!res.ok || !data.checkout_url) {
      return NextResponse.json(
        {
          error: 'Creem checkout 创建失败',
          detail: data
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      checkoutUrl: data.checkout_url, // 让用户跳到这个链接付款
      plan,
      planName: planInfo.name,
      amount: planInfo.amount,
      days: planInfo.days,
      // Creem 不像微信那种"前端轮询",而是 success_url 跳转,我们用 ?paid= 参数带回来
      successUrl: data.checkout_url
    });
  } catch (e: any) {
    return NextResponse.json({ error: '服务器异常: ' + e.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST 到此接口创建 Creem 支付链接',
    plans: Object.values(CREEM_PLANS),
    note: 'Creem 不需要 ICP 备案,海外华人可直接信用卡支付'
  });
}
