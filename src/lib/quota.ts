// 免费 5 次/月配额
// 老板产品原则:打开即用,5 次用完才跳支付
// 已付费用户绕过

import { getCurrentUser, isPaidUser } from './user';

const USAGE_KEY = 'getmind_usage_v1';
const FREE_LIMIT = 5;  // 免费 5 份/月

interface UsageRecord {
  count: number;
  monthKey: string; // 形如 "2026-07",自然月清零
}

function getMonthKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function loadUsage(): UsageRecord {
  if (typeof window === 'undefined') return { count: 0, monthKey: getMonthKey() };
  try {
    const raw = localStorage.getItem(USAGE_KEY);
    if (!raw) return { count: 0, monthKey: getMonthKey() };
    const rec = JSON.parse(raw) as UsageRecord;
    // 跨月清零
    if (rec.monthKey !== getMonthKey()) {
      return { count: 0, monthKey: getMonthKey() };
    }
    return rec;
  } catch {
    return { count: 0, monthKey: getMonthKey() };
  }
}

function saveUsage(rec: UsageRecord) {
  localStorage.setItem(USAGE_KEY, JSON.stringify(rec));
}

export function canUse(): { allowed: boolean; remaining: number; reason?: string } {
  if (typeof window === 'undefined') return { allowed: true, remaining: FREE_LIMIT };

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

export function resetUsage() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USAGE_KEY);
}

export function getUsage() {
  return loadUsage();
}
