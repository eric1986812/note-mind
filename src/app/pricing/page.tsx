// 定价页面 - 暂时只走 Creem(微信支付等 ICP 备案后再启用)
// 老板 9-1 决策:ICP 备案没完成前,不显示微信支付选项,避免用户困惑
// ICP 备案后,加回 payMethod 切换 + handleWxPay 函数已经实现好,只需 uncomment

'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { register, login, getCurrentUser, logout } from '@/lib/user';
import { useLang } from '@/lib/lang-context';

export default function PricingPageWrapper() {
  // Next.js 14 + useSearchParams 必须包 Suspense(避免 build 预渲染失败)
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500">Loading...</div>}>
      <PricingPage />
    </Suspense>
  );
}

function PricingPage() {
  const searchParams = useSearchParams();
  const { t, lang } = useLang();
  const [loading, setLoading] = useState<string>('');

  const PLANS = [
    {
      key: 'free',
      name: t('pricing.planFreeName'),
      price: t('pricing.planFreePrice'),
      period: t('pricing.planFreePeriod'),
      highlight: false,
      features: [
        t('pricing.planFreeF1'),
        t('pricing.planFreeF2'),
        t('pricing.planFreeF3'),
        t('pricing.planFreeF4')
      ],
      cta: t('pricing.currentPlan'),
      isPaid: false
    },
    {
      key: 'monthly',
      name: t('pricing.planMonthName'),
      price: t('pricing.planMonthPrice'),
      period: t('pricing.planMonthPeriod'),
      highlight: true,
      features: [
        t('pricing.planMonthF1'),
        t('pricing.planMonthF2'),
        t('pricing.planMonthF3'),
        t('pricing.planMonthF4'),
        t('pricing.planMonthF5'),
        t('pricing.planMonthF6'),
        t('pricing.planMonthF7')
      ],
      cta: t('pricing.subscribe'),
      isPaid: true
    },
    {
      key: 'yearly',
      name: t('pricing.planYearName'),
      price: t('pricing.planYearPrice'),
      period: t('pricing.planYearPeriod'),
      highlight: false,
      saveHint: t('pricing.saveHint'),
      features: [
        t('pricing.planYearF1'),
        t('pricing.planYearF2'),
        t('pricing.planYearF3'),
        t('pricing.planYearF4'),
        t('pricing.planYearF5')
      ],
      cta: t('pricing.subscribe'),
      isPaid: true
    }
  ];
  const [error, setError] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'wxpay' | 'creem'>('creem');
  // 老板 9-1 决定:暂时只走 Creem,微信支付等 ICP 备案后再加回
  // paymentMethod 现在永远 = 'creem',但保留 state 和 setPaymentMethod 以便将来恢复

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
      const successMsg = lang === 'zh' ? '支付成功!正在跳转...' : 'Payment successful! Redirecting...';
      alert(successMsg);
      setTimeout(() => {
        window.location.href = '/upload';
      }, 1500);
    }
  }, [searchParams]);

  // 注册/登录成功后要继续的动作(老板 9-1 修:之前注册后用户得再点一次,UX 差)
  // 用 ref 不用 state:state 在 handleAuth 闭包中是旧值,ref 是最新值
  const pendingActionRef = useRef<(() => void) | null>(null);

  async function handleAuth() {
    if (authMode === 'register') {
      const res = await register(authEmail, authPassword, authName);
      if (res.ok) {
        // 绑定邀请关系(新注册用户如果 ?ref= 开过来)
        try {
          const { bindReferral, capturePendingReferral } = await import('@/lib/referral');
          capturePendingReferral();
          bindReferral(authEmail);
        } catch (e) {
          console.warn('referral bind failed:', e);
        }
        setAuthModal(null);
        setCurrentUser(getCurrentUser());
        setAuthError('');
        // 自动继续上次的操作(老板 UX 改进:不要让用户再点)
        if (pendingActionRef.current) {
          const a = pendingActionRef.current;
          pendingActionRef.current = null;
          // 用 setTimeout 让 modal 关闭动画播完再跳转
          setTimeout(() => a(), 100);
        }
      } else {
        setAuthError(res.error || '注册失败');
      }
    } else {
      const res = await login(authEmail, authPassword);
      if (res.ok) {
        setAuthModal(null);
        setCurrentUser(getCurrentUser());
        setAuthError('');
        if (pendingActionRef.current) {
          const a = pendingActionRef.current;
          pendingActionRef.current = null;
          setTimeout(() => a(), 100);
        }
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
      pendingActionRef.current = action; // 注册成功后自动继续
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
          (lang === 'zh' ? '微信下单失败: ' : 'WeChat order failed: ') +
            (data.error || (lang === 'zh' ? '未知错误' : 'Unknown error')) +
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
      setError((lang === 'zh' ? '网络异常: ' : 'Network error: ') + e.message);
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
      // 必须传 customerEmail(用户已登录),这样 webhook 来时能识别是谁
      // 注意:用 getCurrentUser() 直接读 localStorage,不要用 currentUser state(setTimeout 内可能未更新)
      const user = getCurrentUser();
      const userEmail = user?.email || '';
      const res = await fetch('/api/creem/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, customerEmail: userEmail })
      });
      const data = await res.json();

      if (!res.ok || !data.checkoutUrl) {
        setError(
          (lang === 'zh' ? 'Creem 跳转失败: ' : 'Creem redirect failed: ') +
            (data.error || (lang === 'zh' ? '未知错误' : 'Unknown error')) +
            (data.detail ? ' / ' + JSON.stringify(data.detail).slice(0, 200) : '')
        );
        setLoading('');
        return;
      }

      // 直接跳转 Creem 支付页
      window.location.href = data.checkoutUrl;
    } catch (e: any) {
      setError((lang === 'zh' ? '网络异常: ' : 'Network error: ') + e.message);
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
          <h1 className="text-4xl font-bold text-slate-900 mb-3">{t('pricing.title')}</h1>
          <p className="text-slate-600 text-lg">
            {t('pricing.subtitle')}
          </p>
        </div>

        {/* 支付方式切换(老板 9-1 暂时隐藏:海外为主,只走 Creem 信用卡)
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
              🌍 {t('pricing.payMethodCreem')}
            </button>
            <button
              onClick={() => setPaymentMethod('wxpay')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition ${
                paymentMethod === 'wxpay'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600'
              }`}
            >
              🇨🇳 {t('pricing.payMethodWxpay')}
            </button>
          </div>
        </div>
        */}

        {/* 支付方式切换(老板 9-1 暂时隐藏:ICP 备案后加回)
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
              🌍 {t('pricing.payMethodCreem')}
            </button>
            <button
              onClick={() => setPaymentMethod('wxpay')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition ${
                paymentMethod === 'wxpay'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600'
              }`}
            >
              🇨🇳 {t('pricing.payMethodWxpay')}
            </button>
          </div>
        </div>
        */}

        {/* 已登录用户显示 */}
        {currentUser && (
          <div className="max-w-md mx-auto mb-4 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-2 rounded-lg text-sm flex items-center justify-between">
            <span>👋 {currentUser.name || currentUser.email} {lang === 'zh' ? '已登录' : '(signed in)'}</span>
            <button
              onClick={() => { logout(); setCurrentUser(null); }}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >{lang === 'zh' ? '退出' : 'Sign out'}</button>
          </div>
        )}

        {error && (
          <div className="max-w-md mx-auto mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
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
                  {lang === 'zh' ? '最受欢迎' : 'Most popular'}
                </div>
              )}
              {(p as any).badge && !p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                  {(p as any).badge}
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
                    // 老板 9-11 决策:主战场海外,只走 Creem 信用卡
                    handleCreem(p.key)
                  )
                }
                disabled={loading === p.key || (p as any).comingSoon}
                className={`w-full py-3 px-4 rounded-lg font-medium transition ${
                  (p as any).comingSoon
                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    : p.highlight
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                } ${loading === p.key ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading === p.key ? (lang === 'zh' ? '处理中...' : 'Processing...') : p.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-slate-500">
          {/* 老板 9-11:主战场海外,只走 Creem 信用卡 */}
          <p>Payments processed by Creem.io · Visa / MasterCard / American Express supported</p>
          <p className="mt-2">Pay from any country · Instant activation</p>
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
                🎉 You've used your 5 free trials
                <br />
                Subscribe to unlock <strong>unlimited</strong> note generation
              </div>
            )}

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {authMode === 'register' ? `🎓 ${t('pricing.submitRegister')}` : `👋 ${t('pricing.submitLogin')}`}
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              {authMode === 'register'
                ? t('pricing.freeCtaRegister')
                : `${t('pricing.welcomeBack')}, ${t('home.meta.siteName') === 'MindFlow' ? 'keep learning' : ''}`}
            </p>

            <form onSubmit={async (e) => { e.preventDefault(); await handleAuth(); }}>
              {authMode === 'register' && (
                <input
                  type="text"
                  placeholder={t('pricing.nicknamePh')}
                  value={authName}
                  onChange={e => setAuthName(e.target.value)}
                  className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-lg"
                />
              )}
              <input
                type="email"
                placeholder={t('pricing.emailPh')}
                value={authEmail}
                onChange={e => setAuthEmail(e.target.value)}
                required
                className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="password"
                placeholder={t('pricing.passwordPh')}
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
                {authMode === 'register' ? t('pricing.submitRegister') : t('pricing.submitLogin')}
              </button>
            </form>

            <div className="mt-4 text-center text-sm text-gray-500">
              {authMode === 'register' ? (
                <>{lang === 'zh' ? '已有账户?' : 'Already have an account?'}<button onClick={() => setAuthMode('login')} className="text-primary-600 underline ml-1">{lang === 'zh' ? '去登录' : 'Sign in'}</button></>
              ) : (
                <>{lang === 'zh' ? '没账户?' : 'No account?'}<button onClick={() => setAuthMode('register')} className="text-primary-600 underline ml-1">{lang === 'zh' ? '去注册' : 'Sign up'}</button></>
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
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  {lang === 'zh' ? '支付成功!' : 'Payment successful!'}
                </h2>
                <p className="text-slate-600 mb-6">
                  {lang === 'zh' ? '会员已开通,正在跳转...' : 'Subscription activated. Redirecting...'}
                </p>
                <div className="animate-pulse text-sm text-slate-500">{t('pricing.wxpayAutoRedirect')}</div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">
                  {t('pricing.wxpayTitle')}
                </h2>
                <p className="text-center text-slate-600 mb-6">
                  {t('pricing.wxpayAmount')}:{' '}
                  <span className="text-3xl font-bold text-blue-600">
                    {payModal.amountDisplay}
                  </span>
                </p>

                <div className="bg-white p-4 border-2 border-slate-200 rounded-xl flex justify-center">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(payModal.codeUrl)}&margin=10`}
                    alt={lang === 'zh' ? '支付二维码' : 'Payment QR code'}
                    width={240}
                    height={240}
                    className="block"
                  />
                </div>

                <div className="mt-6 text-center text-sm text-slate-500 space-y-1">
                  <p>📱 {lang === 'zh' ? '打开微信,扫一扫上方二维码' : 'Open WeChat and scan the QR code above'}</p>
                  <p className="text-xs text-slate-400">
                    {lang === 'zh' ? '订单号' : 'Order'}: {payModal.outTradeNo}
                  </p>
                  {pollStatus === 'waiting' && (
                    <p className="text-xs">⏳ {lang === 'zh' ? '等待支付中' : 'Awaiting payment'}...({pollCount}/30)</p>
                  )}
                  {pollStatus === 'expired' && (
                    <p className="text-xs text-orange-600 mt-2">
                      ⏰ {lang === 'zh' ? '等待超时,请重新发起支付或检查是否已完成' : 'Timed out. Please retry or check if the payment went through.'}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 退订 / 客服 footer */}
      <div className="max-w-5xl mx-auto px-6 py-8 text-center text-sm text-slate-500 border-t border-slate-200 mt-12">
        <p>
          {t('pricing.cancelSub')}
        </p>
        <p className="mt-2" dangerouslySetInnerHTML={{ __html: t('pricing.supportSub').replace('support@mindflow.wang', '<a href="mailto:support@mindflow.wang" class="text-blue-600 hover:underline">support@mindflow.wang</a>') }} />
      </div>
    </div>
  );
}
