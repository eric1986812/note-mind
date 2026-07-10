// 推荐裂变系统 - MindFlow(简化版,单机 localStorage)
// 适用阶段:用户 < 100,OPC 一人公司
// 限制:用户必须换设备/清除 localStorage 才能再次分享奖励
// P1 接 Supabase 时重写为后端版
//
// 流程:
//  1. 老用户分享 /?ref=CODE 链接
//  2. 新用户点链接访问,cookie+localStorage 记下 CODE
//  3. 新用户注册后 bindReferral() 存 localStorage
//  4. 新用户完成首次笔记生成,claimReward() 发奖励给老用户
//
// 注意:OPC 阶段,这套机制对真实场景(用户在亲友推荐后注册)的奖励发放有缺陷 —
// 老用户浏览器看不到新用户的注册。但作为"埋点 + 后续 Supabase 迁移的基础",有总比没有好。

import { getCurrentUser, updateUserPlan } from './user';

const REFERRALS_DB_KEY = 'mindflow_referrals_v1';
const PENDING_CLAIM_KEY = 'mindflow_pending_referral';

interface Referral {
  inviteCode: string;
  inviteeEmail: string;
  invitedAt: number;
  rewardClaimedAt?: number;
}

// 用 user.id 生成 6 位邀请码(确定性 — 同一用户永远同一码)
function generateInviteCode(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = ((hash << 5) - hash) + userId.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36).toUpperCase().slice(0, 6).padEnd(6, 'X');
}

export function getMyInviteCode(): string | null {
  const user = getCurrentUser();
  if (!user) return null;
  return generateInviteCode(user.id);
}

export function getMyInviteLink(): string | null {
  const code = getMyInviteCode();
  if (!code) return null;
  const base = typeof window !== 'undefined' ? window.location.origin : 'https://mindflow.wang';
  return `${base}/?ref=${code}`;
}

// 页面加载时 URL ?ref=XXX → 存进 localStorage
export function capturePendingReferral(): string | null {
  if (typeof window === 'undefined') return null;
  const url = new URL(window.location.href);
  const ref = url.searchParams.get('ref');
  if (ref && /^[A-Z0-9]{6}$/.test(ref.toUpperCase())) {
    const code = ref.toUpperCase();
    localStorage.setItem(PENDING_CLAIM_KEY, code);
    return code;
  }
  return null;
}

// 注册成功后,绑定邀请关系
export function bindReferral(inviteeEmail: string): { ok: boolean; reason?: string } {
  if (typeof window === 'undefined') return { ok: false, reason: 'ssr' };
  const pendingCode = localStorage.getItem(PENDING_CLAIM_KEY);
  if (!pendingCode) return { ok: true, reason: 'no_pending_ref' };

  // 不能邀请自己
  const currentUser = getCurrentUser();
  if (currentUser && generateInviteCode(currentUser.id) === pendingCode) {
    localStorage.removeItem(PENDING_CLAIM_KEY);
    return { ok: false, reason: 'self_referral' };
  }

  const db = loadDB();
  if (db.some(r => r.inviteeEmail === inviteeEmail.toLowerCase())) {
    return { ok: false, reason: 'already_bound' };
  }
  // 防刷 — 24h 内同 inviteeEmail 已绑过
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const recent = db.filter(r => r.inviteeEmail === inviteeEmail.toLowerCase() && r.invitedAt > oneDayAgo);
  if (recent.length >= 1) return { ok: false, reason: 'too_recent' };

  db.push({
    inviteCode: pendingCode,
    inviteeEmail: inviteeEmail.toLowerCase(),
    invitedAt: Date.now()
  });
  saveDB(db);
  localStorage.removeItem(PENDING_CLAIM_KEY);
  return { ok: true };
}

// 给邀请人发放奖励(在 upload 完成时调用)
export function tryClaimRewardForCurrentUser(): { rewarded: boolean; reason?: string } {
  if (typeof window === 'undefined') return { rewarded: false, reason: 'ssr' };
  const me = getCurrentUser();
  if (!me) return { rewarded: false, reason: 'no_user' };

  const db = loadDB();
  const r = db.find(x => x.inviteeEmail === me.email.toLowerCase());
  if (!r) return { rewarded: false, reason: 'not_referred' };
  if (r.rewardClaimedAt) return { rewarded: false, reason: 'already_claimed' };

  // 找到邀请人 — localStorage 遍历
  const usersDbRaw = localStorage.getItem('getmind_users_db');
  if (!usersDbRaw) return { rewarded: false, reason: 'no_users_db' };
  const usersDb = JSON.parse(usersDbRaw) as Record<string, any>;
  const inviter = Object.values(usersDb).find((u: any) => generateInviteCode(u.id) === r.inviteCode);
  if (!inviter) {
    // 邀请人不在本地 db — 真实场景里这是正常的(他不在你这台电脑)
    // 后端 Supabase 时才能查
    r.rewardClaimedAt = Date.now();
    saveDB(db);
    return { rewarded: false, reason: 'inviter_not_local_skipped' };
  }

  const now = Date.now();
  const oneMonth = 30 * 24 * 60 * 60 * 1000;
  const currentExpiry = inviter.planExpiresAt || 0;
  const newExpiry = currentExpiry > now ? currentExpiry + oneMonth : now + oneMonth;
  updateUserPlan(inviter.email, inviter.plan || 'monthly', newExpiry);

  r.rewardClaimedAt = now;
  saveDB(db);
  return { rewarded: true };
}

// 用户查自己邀请数据
export function getMyReferralStats() {
  if (typeof window === 'undefined') return null;
  const me = getCurrentUser();
  if (!me) return null;
  const myCode = generateInviteCode(me.id);
  const db = loadDB();
  const mine = db.filter(r => r.inviteCode === myCode);
  return {
    inviteCode: myCode,
    inviteLink: getMyInviteLink(),
    total: mine.length,
    pending: mine.filter(r => !r.rewardClaimedAt).length,
    rewarded: mine.filter(r => r.rewardClaimedAt).length,
    history: mine.map(r => ({
      email: r.inviteeEmail.replace(/(.{2}).*(@.*)/, '$1***$2'),
      invitedAt: r.invitedAt,
      status: r.rewardClaimedAt ? ('rewarded' as const) : ('pending' as const)
    }))
  };
}

function loadDB(): Referral[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(REFERRALS_DB_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveDB(db: Referral[]) {
  localStorage.setItem(REFERRALS_DB_KEY, JSON.stringify(db));
}