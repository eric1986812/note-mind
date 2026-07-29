// GA4 统计 API 路由
// GET /api/ga4/stats              -> 过去 24h
// GET /api/ga4/stats?days=7       -> 过去 7 天
// GET /api/ga4/stats?days=30      -> 过去 30 天
// GET /api/ga4/stats?realtime=1   -> 实时访客(过去 30 分钟在线)
//
// 不做鉴权(内部 API,只老板自己用)。生产环境建议加 IP 限制或 simple token。

import { NextRequest, NextResponse } from 'next/server';
import { getGA4Stats, getGA4Realtime } from '@/lib/ga4';

export const dynamic = 'force-dynamic';
export const maxDuration = 30; // GA4 API 通常 < 2s,留 30s 足够

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const days = Math.max(1, Math.min(90, Number(url.searchParams.get('days') || '1')));
  const realtime = url.searchParams.get('realtime') === '1';

  try {
    if (realtime) {
      const data = await getGA4Realtime();
      return NextResponse.json({ ok: true, ...data });
    }
    const data = await getGA4Stats(days);
    return NextResponse.json({ ok: true, ...data });
  } catch (e: any) {
    return NextResponse.json(
      {
        ok: false,
        error: e.message || 'Unknown error',
        hint: '检查 Vercel env: GA4_PROPERTY_ID + GOOGLE_APPLICATION_CREDENTIALS_JSON 是否配置; service account 是否在 GA4 Property 有 Viewer 权限',
      },
      { status: 500 }
    );
  }
}
