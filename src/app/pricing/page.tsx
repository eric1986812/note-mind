// 定价页面 - 国内微信支付 + 海外 Creem 双轨
// 老板用 getmind.vercel.app/pricing 打开
//
// 双策略:
// 1. 微信支付(Native 扫码): 等 ICP 备案完成才能上线(JSAPI 也一样要备案)
// 2. Creem: 绕过备案,立刻能收海外华人信用卡
// 国内用户暂时看到 Creem,等备案通过后切回微信支付

'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { register, login, getCurrentUser, logout } from '@/lib/user';

const PLANS = [
  {
    key: 'free',
    name: '免费版',
    price: '¥0',
    period: '永久',
    highlight: false,
    features: ['每月 5 份笔记', '基础笔记生成', '基础思维导图', '8 张记忆卡片'],
    cta: '当前方案',
    isPaid: false
  },
  {
    key: 'monthly',
    name: '学期版',
    price: '¥39',
    period: '月付',
    highlight: true,
    features: [
      '无限次生成',
      '完整 4 大功能(笔记/导图/卡片/追问)',
      '长文分章节(>2500字自动切)',
      '中英对照 + 术语表',
      '图片识别 / OCR',
      '学习历史',
      '笔记导出(MD/DOC/PDF)'
    ],
    cta: '立即开通',
    isPaid: true
  },
  {
    key: 'yearly',
    name: '年度版',
    price: '¥299',
    period: '年付',
    highlight: false,
    saveHint: '省 ¥169',
    features: [
      '学期版全部功能',
      '解锁未来 P1 功能(校园代理 / Supabase 同步)',
      '优先客服',
      '专属学习群'
    ],
    cta: '立即开通',
    isPaid: true
  }
];

export default function PricingPageWrapper() {
  // Next.js 14 + useSearchParams 必须包 Suspense(避免 build 预渲染失败)
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500">加载中...</div>}>
      <PricingPage />
    </Suspense>
  );
}

function PricingPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'wxpay' | 'creem'>('creem');

  // 注册/登录弹窗(老板产品原则:付前要注册)
  const [authModal, setAuthModal] = useState<{ mode: 'register' | 'login'; reason?: string } | null>(null);
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);

  // 进来时检查:如果 reason=free_limit 强制弹注册
  useEffect(() => {
    const reason = searchParams.get('reason');
    if (reason === 'free_limit') {
      setAuthModal({ mode: 'register', reason: 'free_limit' });
      setAuthMode('register');
    }
    // 恢复已登录用户
    if (typeof window !== 'undefined') {
      setCurrentUser(getCurrentUser());
    }
  }, [searchParams]);

  // Native 支付弹窗
  const [payModal, setPayModal] = useState<{
    outTradeNo: string;
    plan: string;
    amountDisplay: string;
    codeUrl: string;
    expireAt: number;
  } | null>(null);
  const [pollCount, setPollCount] = useState(0);
  const [pollStatus, setPollStatus] = useState<'waiting' | 'paid' | 'failed' | 'expired'>(
    'waiting'
  );

  // 检测 ?paid= 参数(从 success_url 回来后)
  useEffect(() => {
    const paid = searchParams.get('paid');
    if (paid) {
      localStorage.setItem('getmind_paid_plan', paid);
      localStorage.setItem('getmind_paid_at', String(Date.now()));
      localStorage.setItem('getmind_paid_expire', String(Date.now() + 30 * 24 * 60 * 60 * 1000));
      alert('支付成功!正在跳转...');
      setTimeout(() => {
        window.location.href = '/upload';
      }, 1500);
    }
  }, [searchParams]);

  async function handleAuth() {
    if (authMode === 'register') {
      const res = await register(authEmail, authPassword, authName);
      if (res.ok) {
        setAuthModal(null);
        setCurrentUser(getCurrentUser());
        setAuthError('');
      } else {
        setAuthError(res.error || '注册失败');
      }
    } else {
      const res = await login(authEmail, authPassword);
      if (res.ok) {
        setAuthModal(null);
        setCurrentUser(getCurrentUser());
        setAuthError('');
      } else {
        setAuthError(res.error || '登录失败');
      }
    }
  }

  // Creem / WxPay 都要先登录
  function ensureAuthed(action: () => void) {
    if (getCurrentUser()) {
      action();
    } else {
      setAuthMode('register');
      setAuthModal({ mode: 'register' });
    }
  }

  async function handleWxPay(plan: string) {
    if (plan === 'free') {
      window.location.href = '/upload';
      return;
    }
    setLoading(plan);
    setError('');
    try {
      const res = await fetch('/api/wxpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan })
      });
      const data = await res.json();
      if (!res.ok || !data.codeUrl) {
        setError(
          '微信下单失败: ' +
            (data.error || '未知错误') +
            (data.detail ? ' / ' + JSON.stringify(data.detail).slice(0, 200) : '')
        );
        setLoading('');
        return;
      }
      setPayModal({
        outTradeNo: data.outTradeNo,
        plan,
        amountDisplay: data.amountDisplay,
        codeUrl: data.codeUrl,
        expireAt: Date.now() + data.days * 24 * 60 * 60 * 1000
      });
      setPollCount(0);
      setPollStatus('waiting');
      setLoading('');
    } catch (e: any) {
      setError('网络异常: ' + e.message);
      setLoading('');
    }
  }

  async function handleCreem(plan: string) {
    if (plan === 'free') {
      window.location.href = '/upload';
      return;
    }
    setLoading(plan);
    setError('');

    try {
      const res = await fetch('/api/creem/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan })
      });
      const data = await res.json();

      if (!res.ok || !data.checkoutUrl) {
        setError(
          'Creem 跳转失败: ' +
            (data.error || '未知错误') +
            (data.detail ? ' / ' + JSON.stringify(data.detail).slice(0, 200) : '')
        );
        setLoading('');
        return;
      }

      // 直接跳转 Creem 支付页
      window.location.href = data.checkoutUrl;
    } catch (e: any) {
      setError('网络异常: ' + e.message);
      setLoading('');
    }
  }

  // 微信 Native 轮询
  useEffect(() => {
    if (!payModal || pollStatus !== 'waiting') return;

    const timer = setInterval(async () => {
      setPollCount((c) => c + 1);
      try {
        const res = await fetch('/api/wxpay/check-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ outTradeNo: payModal.outTradeNo })
        });
        const data = await res.json();
        if (data.isPaid) {
          setPollStatus('paid');
          localStorage.setItem('getmind_paid_plan', payModal.plan);
          localStorage.setItem('getmind_paid_at', String(Date.now()));
          localStorage.setItem(
            'getmind_paid_expire',
            String(payModal.expireAt)
          );
          setTimeout(() => {
            window.location.href = '/upload';
          }, 3000);
          return;
        }
        if (pollCount >= 30) {
          setPollStatus('expired');
        }
      } catch (e) {}
    }, 2000);
    return () => clearInterval(timer);
  }, [payModal, pollStatus, pollCount]);

  function closePayModal() {
    setPayModal(null);
    setPollStatus('waiting');
    setPollCount(0);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">定价方案</h1>
          <p className="text-slate-600 text-lg">
            选择适合你的学习节奏,按需付费
          </p>
        </div>

        {/* 支付方式切换 */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setPaymentMethod('creem')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition ${
                paymentMethod === 'creem'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600'
              }`}
            >
              🌍 海外华人(Creem)
            </button>
            <button
              onClick={() => setPaymentMethod('wxpay')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition ${
                paymentMethod === 'wxpay'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600'
              }`}
            >
              🇨🇳 国内(微信支付)
            </button>
          </div>
        </div>

        {/* 已登录用户显示 */}
        {currentUser && (
          <div className="max-w-md mx-auto mb-4 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-2 rounded-lg text-sm flex items-center justify-between">
            <span>👋 {currentUser.name || currentUser.email} 已登录</span>
            <button
              onClick={() => { logout(); setCurrentUser(null); }}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >退出</button>
          </div>
        )}

        {paymentMethod === 'wxpay' && (
          <div className="max-w-2xl mx-auto mb-6 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg text-sm">
            ⚠️ 微信支付需要域名 ICP 备案,getmind.vercel.app 暂时不能直接收款。
            <br />
            ✅ 我们已启动备案流程,预计 3-15 天通过。通过后立刻切换。
            <br />
            🎯 现在推荐使用 <strong>Creem(海外华人通道)</strong>,任何信用卡都能付,即时开通。
          </div>
        )}

        {error && (
          <div className="max-w-md mx-auto mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((p) => (
            <div
              key={p.key}
              className={`relative rounded-2xl border-2 p-8 ${
                p.highlight
                  ? 'border-blue-500 bg-white shadow-xl scale-105'
                  : 'border-slate-200 bg-white'
              }`}
            >
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                  最受欢迎
                </div>
              )}
              {p.saveHint && (
                <div className="absolute -top-3 right-4 bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                  {p.saveHint}
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{p.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-slate-900">{p.price}</span>
                  <span className="text-slate-500 text-sm">/ {p.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() =>
                  ensureAuthed(() =>
                    paymentMethod === 'creem' ? handleCreem(p.key) : handleWxPay(p.key)
                  )
                }
                disabled={loading === p.key}
                className={`w-full py-3 px-4 rounded-lg font-medium transition ${
                  p.highlight
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                } ${loading === p.key ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading === p.key ? '处理中...' : p.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-slate-500">
          {paymentMethod === 'creem' ? (
            <>
              <p>支付由 Creem.io 处理 · 支持 Visa / MasterCard / American Express</p>
              <p className="mt-2">任何国家都可以付款,即时开通</p>
            </>
          ) : (
            <>
              <p>支付由微信支付担保 · 7 天无理由退款</p>
              <p className="mt-2">ICP 备案完成后自动切换到自动拉起支付</p>
            </>
          )}
        </div>
      </div>

      {/* 注册/登录弹窗(老板原则:付前要注册) */}
      {authModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full relative">
            <button
              onClick={() => setAuthModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >×</button>

            {authModal.reason === 'free_limit' && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                🎉 您的 5 次免费试用已用完
                <br />
                订阅解锁 <strong>无限次</strong> 笔记生成
              </div>
            )}

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {authMode === 'register' ? '创建账户' : '登录账户'}
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              {authMode === 'register'
                ? '注册以管理订阅与查看历史'
                : '欢迎回来,继续您的学习'}
            </p>

            <form onSubmit={async (e) => { e.preventDefault(); await handleAuth(); }}>
              {authMode === 'register' && (
                <input
                  type="text"
                  placeholder="昵称(选填)"
                  value={authName}
                  onChange={e => setAuthName(e.target.value)}
                  className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-lg"
                />
              )}
              <input
                type="email"
                placeholder="邮箱"
                value={authEmail}
                onChange={e => setAuthEmail(e.target.value)}
                required
                className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="password"
                placeholder="密码(至少 6 位)"
                value={authPassword}
                onChange={e => setAuthPassword(e.target.value)}
                required
                minLength={6}
                className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-lg"
              />

              {authError && (
                <div className="mb-3 text-sm text-red-600">{authError}</div>
              )}

              <button
                type="submit"
                disabled={loading === 'auth'}
                className="w-full py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50"
              >
                {authMode === 'register' ? '注册并继续支付' : '登录'}
              </button>
            </form>

            <div className="mt-4 text-center text-sm text-gray-500">
              {authMode === 'register' ? (
                <>已有账户?<button onClick={() => setAuthMode('login')} className="text-primary-600 underline ml-1">去登录</button></>
              ) : (
                <>没账户?<button onClick={() => setAuthMode('register')} className="text-primary-600 underline ml-1">去注册</button></>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 微信 Native 支付二维码弹窗 */}
      {payModal && paymentMethod === 'wxpay' && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full relative">
            <button
              onClick={closePayModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-2xl leading-none"
            >
              ×
            </button>

            {pollStatus === 'paid' ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">支付成功!</h2>
                <p className="text-slate-600 mb-6">会员已开通,正在跳转...</p>
                <div className="animate-pulse text-sm text-slate-500">3 秒后自动跳转</div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">
                  微信扫码支付
                </h2>
                <p className="text-center text-slate-600 mb-6">
                  应付金额:{' '}
                  <span className="text-3xl font-bold text-blue-600">
                    {payModal.amountDisplay}
                  </span>
                </p>

                <div className="bg-white p-4 border-2 border-slate-200 rounded-xl flex justify-center">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(payModal.codeUrl)}&margin=10`}
                    alt="支付二维码"
                    width={240}
                    height={240}
                    className="block"
                  />
                </div>

                <div className="mt-6 text-center text-sm text-slate-500 space-y-1">
                  <p>📱 打开微信,扫一扫上方二维码</p>
                  <p className="text-xs text-slate-400">订单号: {payModal.outTradeNo}</p>
                  {pollStatus === 'waiting' && (
                    <p className="text-xs">⏳ 等待支付中...({pollCount}/30)</p>
                  )}
                  {pollStatus === 'expired' && (
                    <p className="text-xs text-orange-600 mt-2">
                      ⏰ 等待超时,请重新发起支付或检查是否已完成
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
