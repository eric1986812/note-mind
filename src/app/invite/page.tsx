'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getMyReferralStats } from '../../lib/referral';
import { useLang } from '../../lib/lang-context';

export default function InvitePage() {
  const { t } = useLang();
  const [stats, setStats] = useState<ReturnType<typeof getMyReferralStats>>(null);
  const [copied, setCopied] = useState<'code' | 'link' | null>(null);

  useEffect(() => {
    setStats(getMyReferralStats());
  }, []);

  if (typeof window !== 'undefined' && !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{t('invite.loginTitle')}</h2>
          <p className="text-gray-600 mb-6">{t('invite.loginSub')}</p>
          <Link href="/pricing?redirect=/invite" className="block bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700">
            {t('invite.loginBtn')}
          </Link>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">
        加载中...
      </div>
    );
  }

  const copy = (text: string, kind: 'code' | 'link') => {
    navigator.clipboard.writeText(text);
    setCopied(kind);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-emerald-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-3">🎁</div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{t('invite.title')}</h1>
          <p className="text-lg text-gray-600">{t('invite.subtitle')}</p>
        </div>

        {/* 分享链接大卡 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <p className="text-sm text-gray-500 mb-2">{t('invite.codeLabel')}</p>
          <div className="bg-gray-50 border-2 border-dashed border-primary-200 rounded-lg p-4 mb-4 flex items-center justify-between">
            <code className="text-3xl font-bold text-primary-600 tracking-wider">
              {stats.inviteCode}
            </code>
            <button
              onClick={() => copy(stats.inviteCode, 'code')}
              className="text-sm bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
              {copied === 'code' ? t('invite.copied') : t('invite.copyBtn')}
            </button>
          </div>

          <p className="text-sm text-gray-500 mb-2">{t('invite.linkLabel')}</p>
          <div className="bg-gray-50 rounded-lg p-3 mb-3 flex items-center gap-2">
            <code className="text-xs text-gray-700 flex-1 truncate">
              {stats.inviteLink}
            </code>
            <button
              onClick={() => copy(stats.inviteLink!, 'link')}
              className="text-sm bg-primary-600 text-white px-3 py-1.5 rounded-lg hover:bg-primary-700 flex-shrink-0"
            >
              {copied === 'link' ? t('invite.copied') : t('invite.copyBtn')}
            </button>
          </div>

          {/* 微信扫码分享按钮 */}
          <a
            href={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(stats.inviteLink || '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-sm text-primary-600 hover:underline"
          >
            🇨🇳 生成二维码发给微信好友
          </a>
        </div>

        {/* 实时统计 */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-xs text-gray-500">{t('invite.statTotal')}</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-3xl font-bold text-amber-600">{stats.pending}</div>
            <div className="text-xs text-gray-500">{t('invite.statPending')}</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-3xl font-bold text-primary-600">{stats.rewarded}</div>
            <div className="text-xs text-gray-500">{t('invite.statRewarded')}</div>
          </div>
        </div>

        {/* 奖励规则 */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-3">📌 {t('invite.rulesTitle')}</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2"><span className="text-primary-600">1.</span>{t('invite.rule1')}</li>
            <li className="flex gap-2"><span className="text-primary-600">2.</span>{t('invite.rule2')}</li>
            <li className="flex gap-2"><span className="text-primary-600">3.</span>{t('invite.rule3')}</li>
          </ul>
        </div>

        {/* 邀请历史 */}
        {stats.history.length > 0 && (
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-3">📋 {t('invite.historyTitle')}</h3>
            <ul className="space-y-2 text-sm">
              {stats.history.map((h, i) => (
                <li key={i} className="flex justify-between items-center border-b last:border-b-0 pb-2">
                  <code className="text-gray-700">{h.email}</code>
                  <span className={`text-xs px-2 py-1 rounded ${
                    h.status === 'rewarded'
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {h.status === 'rewarded' ? t('invite.statusRewarded') : t('invite.statusPending')}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">← {t('common.back')}</Link>
        </div>
      </div>
    </div>
  );
}