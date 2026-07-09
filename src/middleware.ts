import { NextRequest, NextResponse } from 'next/server';
import { langFromCountry } from './lib/i18n';

// 仅在根路径运行,避免影响 API / 静态资源
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // 1. 用户手动选择优先(从 query param ?lang=en)
  const url = new URL(req.url);
  const queryLang = url.searchParams.get('lang');
  if (queryLang === 'zh' || queryLang === 'en') {
    res.cookies.set('lang', queryLang, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 年
      sameSite: 'lax'
    });
    // 去掉 query,避免污染分享链接
    url.searchParams.delete('lang');
    return NextResponse.redirect(url);
  }

  // 2. 已经手动选过 → 跳过
  const existing = req.cookies.get('lang')?.value;
  if (existing === 'zh' || existing === 'en') return res;

  // 3. 首次访问 → 看 IP 国家 → 默认语言
  // Vercel 自动注入 x-vercel-ip-country(海外节点,免费)
  const country =
    req.headers.get('x-vercel-ip-country') ||
    req.headers.get('cf-ipcountry') || // Cloudflare 兼容
    null;

  const lang = langFromCountry(country);

  res.cookies.set('lang', lang, {
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 天后重新检测(避免换国家出差)
    sameSite: 'lax'
  });

  // 设置 header 让 server component 能直接读到
  res.headers.set('x-mindflow-lang', lang);

  return res;
}