// 用户注册/登录 - localStorage 版本(等备案后迁 Supabase)
// 老板产品原则:付前要注册,这样能管理订阅
// 密码用 SHA-256 hash 存(localStorage 是明文,所以至少加个 salt)

const USERS_KEY = 'getmind_users_db';
const CURRENT_USER_KEY = 'getmind_user_v1';
const SALT = 'getmind-2026-v1';

interface User {
  id: string;
  email: string;
  name?: string;
  passwordHash: string;
  createdAt: number;
  // 订阅状态(被 Creem webhook 写入)
  plan?: 'monthly' | 'yearly';
  planExpiresAt?: number;
  creemCustomerId?: string;
}

async function sha256(text: string): Promise<string> {
  if (typeof window === 'undefined') return '';
  const enc = new TextEncoder().encode(text + SALT);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function loadDB(): Record<string, User> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveDB(db: Record<string, User>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(db));
}

export async function register(email: string, password: string, name?: string) {
  if (!email || !password) return { ok: false, error: '邮箱和密码必填' };
  if (password.length < 6) return { ok: false, error: '密码至少 6 位' };
  if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) return { ok: false, error: '邮箱格式不对' };

  const db = loadDB();
  const lowerEmail = email.toLowerCase();
  if (db[lowerEmail]) return { ok: false, error: '该邮箱已注册,请直接登录' };

  const passwordHash = await sha256(password);
  const user: User = {
    id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    email: lowerEmail,
    name: name || lowerEmail.split('@')[0],
    passwordHash,
    createdAt: Date.now()
  };
  db[lowerEmail] = user;
  saveDB(db);

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return { ok: true, user };
}

export async function login(email: string, password: string) {
  if (!email || !password) return { ok: false, error: '邮箱和密码必填' };

  const db = loadDB();
  const lowerEmail = email.toLowerCase();
  const user = db[lowerEmail];
  if (!user) return { ok: false, error: '该邮箱没注册' };

  const passwordHash = await sha256(password);
  if (user.passwordHash !== passwordHash) return { ok: false, error: '密码错' };

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return { ok: true, user };
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    // 重新读 db 检查 plan 状态(可能 webhook 更新过)
    const user = JSON.parse(raw) as User;
    const db = loadDB();
    const fresh = db[user.email];
    if (fresh) {
      user.plan = fresh.plan;
      user.planExpiresAt = fresh.planExpiresAt;
      user.creemCustomerId = fresh.creemCustomerId;
    }
    return user;
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function isPaidUser(user?: User | null): boolean {
  const u = user || getCurrentUser();
  if (!u) return false;
  if (!u.plan) return false;
  if (!u.planExpiresAt) return false;
  return u.planExpiresAt > Date.now();
}

export function updateUserPlan(email: string, plan: 'monthly' | 'yearly', expiresAt: number, creemCustomerId?: string) {
  const db = loadDB();
  const lowerEmail = email.toLowerCase();
  if (!db[lowerEmail]) return;
  db[lowerEmail].plan = plan;
  db[lowerEmail].planExpiresAt = expiresAt;
  if (creemCustomerId) db[lowerEmail].creemCustomerId = creemCustomerId;
  saveDB(db);

  // 同步 currentUser
  const current = getCurrentUser();
  if (current && current.email === lowerEmail) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(db[lowerEmail]));
  }
}

export type { User };
