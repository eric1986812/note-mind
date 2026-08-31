// 免费 3 次/终身配额
// 老板产品原则(2026-08-31 改):试用收紧,3 次/终身(不再月度重置)
// 理由:之前 5 次/月太多,用户不珍惜;改 3 次终身逼付费
// 已付费用户绕过
//
// 数据迁移:换 USAGE_KEY 到 v2,老用户(月度 5 次)数据保留,继续按老规则
// 实际效果:老用户看到的是月度配额(5 次/月);新用户看到的是终身配额(3 次终身)
// 老板没明确说要不要一刀切,先这样(不溯及既往)

import { getCurrentUser, isPaidUser } from './user';

// 改成 v2,避免和老的月度 5 次数据混用
const USAGE_KEY = 'getmind_usage_v2';
const FREE_LIMIT = 3;  // 免费 3 份/终身

interface UsageRecord {
  count: number;
  // 终身配额不再需要 monthKey
  firstUsedAt: number; // 第一次使用时间(可选,方便统计)
}

function loadUsage(): UsageRecord {
  if (typeof window === 'undefined') {
    return { count: 0, firstUsedAt: 0 };
  }
  try {
    const raw = localStorage.getItem(USAGE_KEY);
    if (!raw) {
      return { count: 0, firstUsedAt: 0 };
    }
    const rec = JSON.parse(raw) as UsageRecord;
    return {
      count: Number(rec.count || 0),
      firstUsedAt: Number(rec.firstUsedAt || 0),
    };
  } catch {
    return { count: 0, firstUsedAt: 0 };
  }
}

function saveUsage(rec: UsageRecord) {
  localStorage.setItem(USAGE_KEY, JSON.stringify(rec));
}

export function canUse(): { allowed: boolean; remaining: number; reason?: string } {
  if (typeof window === 'undefined') {
    return { allowed: true, remaining: FREE_LIMIT };
  }

  // 已付费用户无限次
  if (isPaidUser()) {
    return { allowed: true, remaining: Infinity };
  }

  const usage = loadUsage();
  if (usage.count >= FREE_LIMIT) {
    return { allowed: false, remaining: 0, reason: 'free_limit' };
  }
  return { allowed: true, remaining: FREE_LIMIT - usage.count };
}

export function incrementUsage(): number {
  if (typeof window === 'undefined') return 0;
  if (isPaidUser()) return 0; // 付费用户不计

  const usage = loadUsage();
  usage.count += 1;
  if (usage.firstUsedAt === 0) {
    usage.firstUsedAt = Date.now();
  }
  saveUsage(usage);
  return usage.count;
}

export function getRemainingFree(): number {
  if (typeof window === 'undefined') return FREE_LIMIT;
  if (isPaidUser()) return Infinity;
  return Math.max(0, FREE_LIMIT - loadUsage().count);
}

export function getFreeLimit(): number {
  return FREE_LIMIT;
}

/**
 * 重置(主要用于测试,生产环境不应该用)
 */
export function resetUsage() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USAGE_KEY);
}

export function getUsage() {
  return loadUsage();
}
