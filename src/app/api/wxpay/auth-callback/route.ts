// 微信 OAuth 2.0 获取 openId
// 文档:https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html
//
// 流程:
// 1. 前端跳转到微信授权页(带上回调地址)
// 2. 用户同意后,微信回调到我们的 /api/wxpay/auth-callback?code=xxx
// 3. 用 code 调微信接口换 access_token + openId
// 4. 把 openId 存到前端(URL 参数 / cookie / localStorage)
// 5. 跳到 /pricing?openId=xxx

import { NextRequest, NextResponse } from 'next/server';

const WXPAY_APPID = process.env.WXPAY_APPID || '';
const WXPAY_SECRET = process.env.WXPAY_SECRET || ''; // 公众号 AppSecret

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state') || '/pricing';

  if (!code) {
    return NextResponse.json({ error: '缺少 code 参数' }, { status: 400 });
  }
  if (!WXPAY_APPID || !WXPAY_SECRET) {
    return NextResponse.json(
      { error: 'WXPAY_APPID 或 WXPAY_SECRET 未配置' },
      { status: 500 }
    );
  }

  try {
    // 用 code 换 access_token + openid
    const url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${WXPAY_APPID}&secret=${WXPAY_SECRET}&code=${code}&grant_type=authorization_code`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.errcode) {
      return NextResponse.json(
        { error: '微信返回错误', detail: data },
        { status: 400 }
      );
    }

    const openId = data.openid;
    // 把 openId 拼到 state URL 里,跳过去
    const target = state.includes('?')
      ? `${state}&openId=${openId}`
      : `${state}?openId=${openId}`;

    return NextResponse.redirect(target);
  } catch (e: any) {
    return NextResponse.json({ error: '换取 openId 失败: ' + e.message }, { status: 500 });
  }
}
