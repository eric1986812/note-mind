// Email 收集 API
// POST /api/email/subscribe  { email: string, source?: string }
// 老板需求:留住 0 变现期间流失的潜在用户
// 设计:不依赖任何第三方服务,直接 log 到 Vercel logs(老板 Vercel 后台 → Logs 搜 EMAIL_SUBSCRIBE 即可看到所有邮箱)
//
// 后续升级:接 Resend / Mailgun / 飞书 webhook 老板说"用"再接

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// 简单邮箱格式校验
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = String(body?.email || '').trim().toLowerCase();
    const source = String(body?.source || 'home_footer').slice(0, 50); // 限制来源标识长度

    if (!email) {
      return NextResponse.json(
        { ok: false, error: '请输入邮箱' },
        { status: 400 }
      );
    }
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { ok: false, error: '邮箱格式不对,检查下' },
        { status: 400 }
      );
    }
    if (email.length > 254) {
      return NextResponse.json(
        { ok: false, error: '邮箱太长了' },
        { status: 400 }
      );
    }

    // 拿一些上下文(方便老板判断从哪来)
    const referer = request.headers.get('referer') || '';
    const userAgent = request.headers.get('user-agent') || '';
    const country =
      request.headers.get('x-vercel-ip-country') ||
      request.headers.get('cf-ipcountry') ||
      '';
    const ts = new Date().toISOString();

    // 关键:老板在 Vercel 后台 → 项目 → Logs → 搜 "EMAIL_SUBSCRIBE" 就能看到所有订阅
    console.log('EMAIL_SUBSCRIBE', JSON.stringify({
      email,
      source,
      referer: referer.slice(0, 200),
      country,
      ua: userAgent.slice(0, 100),
      ts,
    }));

    return NextResponse.json({
      ok: true,
      message: '订阅成功!新功能上线会通知你~',
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: '服务器异常,稍后重试' },
      { status: 500 }
    );
  }
}
