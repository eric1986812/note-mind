'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart3, CreditCard, Users, Settings } from 'lucide-react';

export default function AdminHome() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState('');

  // 极简版:用老板 support 邮箱的 SHA256(后 6 位)做密码
  // 真后端版需要 Supabase Auth,OPC 阶段极简版够用
  const ADMIN_PASSWORD = 'mindflow2026'; // 老板在 Vercel env 改这个

  const handleAuth = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      setError('');
    } else {
      setError('密码不对');
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">MindFlow 后台</h1>
          <p className="text-sm text-gray-600 mb-6">老板专属 · 输入密码进入</p>
          <input
            type="password"
            placeholder="管理密码"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAuth()}
            className="w-full mb-3 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
          />
          {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
          <button
            onClick={handleAuth}
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700"
          >
            进入
          </button>
          <p className="text-xs text-gray-400 mt-4 text-center">
            默认密码 <code className="bg-gray-100 px-2 py-0.5 rounded">mindflow2026</code> · 老板在 <code className="bg-gray-100 px-1 rounded">.env</code> 改
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">MindFlow 后台</h1>
            <p className="text-sm text-gray-500">老板专属控制台 · 极简版</p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← 回到首页
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* 4 个真用得上的入口 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* GA4 数据看板 */}
          <a
            href="https://analytics.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition group"
          >
            <BarChart3 className="w-8 h-8 text-primary-600 mb-3" />
            <h3 className="font-bold text-gray-900 mb-1">访问数据</h3>
            <p className="text-sm text-gray-500 mb-3">
              看每天多少人来 · 从哪来 · 看哪些页面
            </p>
            <span className="text-xs text-primary-600 group-hover:underline">
              打开 Google Analytics →
            </span>
          </a>

          {/* Creem 后台 */}
          <a
            href="https://creem.io/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition group"
          >
            <CreditCard className="w-8 h-8 text-emerald-600 mb-3" />
            <h3 className="font-bold text-gray-900 mb-1">收款数据</h3>
            <p className="text-sm text-gray-500 mb-3">
              看付费用户 · 订阅状态 · 退款
            </p>
            <span className="text-xs text-primary-600 group-hover:underline">
              打开 Creem Dashboard →
            </span>
          </a>

          {/* Vercel Logs */}
          <a
            href="https://vercel.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition group"
          >
            <Settings className="w-8 h-8 text-amber-600 mb-3" />
            <h3 className="font-bold text-gray-900 mb-1">运行日志</h3>
            <p className="text-sm text-gray-500 mb-3">
              看 API 错误 · Webhook 事件 · 部署历史
            </p>
            <span className="text-xs text-primary-600 group-hover:underline">
              打开 Vercel →
            </span>
          </a>

          {/* 邀请裂变统计 */}
          <a
            href="/invite"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition group"
          >
            <Users className="w-8 h-8 text-purple-600 mb-3" />
            <h3 className="font-bold text-gray-900 mb-1">邀请裂变</h3>
            <p className="text-sm text-gray-500 mb-3">
              看老板你的邀请码 · 邀请了多少人
            </p>
            <span className="text-xs text-primary-600 group-hover:underline">
              打开 /invite →
            </span>
          </a>
        </div>

        {/* 真实数据模块 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">📊 实时数据(从 MindFlow 服务拉)</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-primary-50 to-emerald-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Creem 总收入</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">$0.00</p>
              <p className="text-xs text-gray-500 mt-1">从 Creem Dashboard 拉</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">活跃订阅</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">0</p>
              <p className="text-xs text-gray-500 mt-1">从 Creem Dashboard 拉</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Vercel 部署</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">7</p>
              <p className="text-xs text-gray-500 mt-1">最近 7 天</p>
            </div>
          </div>
        </div>

        {/* 老板要注意的提醒 */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded">
          <h3 className="font-bold text-amber-900 mb-2">⚠️ 老板注意</h3>
          <ul className="text-sm text-amber-900 space-y-1 list-disc pl-5">
            <li>本后台是"看板入口",真数据在 Google Analytics / Creem / Vercel</li>
            <li>改首页文案 / 价格 / 翻译 → 找 AI 助手(我),通过代码改 + 部署</li>
            <li>看付费用户 / 退款 → 直接去 Creem 后台(我无权)</li>
            <li>30+ 付费用户后,再考虑接入 Supabase 做完整用户管理</li>
          </ul>
        </div>
      </div>
    </div>
  );
}