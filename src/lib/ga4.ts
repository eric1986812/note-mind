// Google Analytics 4 Data API 客户端
// 用法:由 /api/ga4/stats 路由调用,不在客户端使用
// 配置 Vercel env:
//   - GA4_PROPERTY_ID       (例: 522345316)
//   - GOOGLE_APPLICATION_CREDENTIALS_JSON  (整个 service account JSON 字符串)

import { BetaAnalyticsDataClient } from '@google-analytics/data';

let cachedClient: BetaAnalyticsDataClient | null = null;
let cachedCredsKey: string | null = null;

function getClient(): BetaAnalyticsDataClient {
  const credsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  if (!credsJson) {
    throw new Error('GOOGLE_APPLICATION_CREDENTIALS_JSON env 未配置');
  }

  let creds: any;
  try {
    creds = JSON.parse(credsJson);
  } catch (e: any) {
    throw new Error('GOOGLE_APPLICATION_CREDENTIALS_JSON 不是合法 JSON: ' + e.message);
  }

  if (!creds.client_email || !creds.private_key) {
    throw new Error('service account JSON 缺少 client_email 或 private_key');
  }

  // 用 client_email 当缓存 key,避免重复实例化
  if (cachedClient && cachedCredsKey === creds.client_email) {
    return cachedClient;
  }

  cachedClient = new BetaAnalyticsDataClient({
    credentials: {
      client_email: creds.client_email,
      private_key: creds.private_key,
    },
  });
  cachedCredsKey = creds.client_email;
  return cachedClient;
}

function getPropertyId(): string {
  const id = process.env.GA4_PROPERTY_ID;
  if (!id) {
    throw new Error('GA4_PROPERTY_ID env 未配置');
  }
  return id;
}

export interface GA4SourceRow {
  source: string;
  medium: string;
  campaign: string;
  sessions: number;
  totalUsers: number;
  engagedSessions: number;
  bounceRate: number;
  avgSessionDuration: number;
}

export interface GA4Stats {
  propertyId: string;
  dateRange: string;
  days: number;
  fetchedAt: string;
  totals: {
    sessions: number;
    totalUsers: number;
    engagedSessions: number;
    bounceRate: number;
    avgSessionDuration: number;
    pageViews: number;
  };
  bySource: GA4SourceRow[];
  byPage: Array<{ path: string; views: number; users: number }>;
}

/**
 * 拉取过去 N 天的 GA4 核心数据
 * @param days 1 = 过去 24h, 7 = 过去 7 天
 */
export async function getGA4Stats(days = 1): Promise<GA4Stats> {
  const propertyId = getPropertyId();
  const client = getClient();
  const startDate = `${Math.max(1, days)}daysAgo`;
  const endDate = 'today';

  // 1) 总览(只有 metrics,没有 dimension)
  const [overviewResp] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate, endDate }],
    metrics: [
      { name: 'sessions' },
      { name: 'totalUsers' },
      { name: 'engagedSessions' },
      { name: 'bounceRate' },
      { name: 'averageSessionDuration' },
      { name: 'screenPageViews' },
    ],
  });

  // 2) 按来源拆分
  const [sourceResp] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate, endDate }],
    dimensions: [
      { name: 'sessionSource' },
      { name: 'sessionMedium' },
      { name: 'sessionCampaign' },
    ],
    metrics: [
      { name: 'sessions' },
      { name: 'totalUsers' },
      { name: 'engagedSessions' },
      { name: 'bounceRate' },
      { name: 'averageSessionDuration' },
    ],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 15,
  });

  // 3) 页面浏览排行
  const [pageResp] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'pagePath' }],
    metrics: [
      { name: 'screenPageViews' },
      { name: 'totalUsers' },
    ],
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    limit: 10,
  });

  const num = (v: any) => Number(v?.value || 0);

  const totalRow = overviewResp.totals?.[0]?.metricValues || [];
  const totals = {
    sessions: num(totalRow[0]),
    totalUsers: num(totalRow[1]),
    engagedSessions: num(totalRow[2]),
    bounceRate: num(totalRow[3]),
    avgSessionDuration: num(totalRow[4]),
    pageViews: num(totalRow[5]),
  };

  const bySource: GA4SourceRow[] = (sourceResp.rows || []).map((r) => ({
    source: r.dimensionValues?.[0]?.value || '(direct)',
    medium: r.dimensionValues?.[1]?.value || '(none)',
    campaign: r.dimensionValues?.[2]?.value || '(not set)',
    sessions: num(r.metricValues?.[0]),
    totalUsers: num(r.metricValues?.[1]),
    engagedSessions: num(r.metricValues?.[2]),
    bounceRate: num(r.metricValues?.[3]),
    avgSessionDuration: num(r.metricValues?.[4]),
  }));

  const byPage = (pageResp.rows || []).map((r) => ({
    path: r.dimensionValues?.[0]?.value || '/',
    views: num(r.metricValues?.[0]),
    users: num(r.metricValues?.[1]),
  }));

  return {
    propertyId,
    dateRange: `${startDate} ~ ${endDate}`,
    days,
    fetchedAt: new Date().toISOString(),
    totals,
    bySource,
    byPage,
  };
}

/**
 * 实时访客数(过去 30 分钟在线)
 */
export async function getGA4Realtime(): Promise<{ activeUsers: number; fetchedAt: string }> {
  const propertyId = getPropertyId();
  const client = getClient();

  const [resp] = await client.runRealtimeReport({
    property: `properties/${propertyId}`,
    metrics: [{ name: 'activeUsers' }],
  });

  return {
    activeUsers: Number(resp.totals?.[0]?.metricValues?.[0]?.value || 0),
    fetchedAt: new Date().toISOString(),
  };
}
