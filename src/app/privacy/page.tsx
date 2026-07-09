// 隐私政策
// 老板 MindFlow / mindflow.wang
// 国内合规版本,覆盖《个人信息保护法》《网络安全法》《数据安全法》

'use client';

import { useLang } from '../../lib/lang-context';

export default function PrivacyPolicy() {
  const { t, lang } = useLang();
  const isEn = lang === 'en';
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">{isEn ? 'Privacy Policy' : '隐私政策'}</h1>
        <p className="text-slate-500 text-sm mb-8">{isEn ? 'Last updated: July 9, 2026' : '最后更新: 2026 年 7 月 9 日'}</p>

        <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">{isEn ? '1. Introduction' : '1. 引言'}</h2>
            <p>
              {isEn ? 'MindFlow ("we") is operated by ' : 'MindFlow(以下简称"我们")由'}
              <strong>泸县玄澈服装店</strong>{isEn ? ' (sole proprietorship). We take your privacy seriously. This Privacy Policy explains how we collect, use, store, and protect your personal information. We collect only the minimum information necessary to provide our service.' : '(个体工商户)运营,非常重视您的隐私。本隐私政策说明我们如何收集、使用、存储和保护您的个人信息。我们仅收集为您提供服务所必需的最少信息。'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">{isEn ? '2. Information We Collect' : '2. 我们收集的信息'}</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>{isEn ? 'Content you upload' : '您主动上传的内容'}</strong>:{isEn ? ' PPT, PDF, Word, images, and other study materials you upload.' : '您上传的 PPT、PDF、Word、图片等学习资料'}</li>
              <li><strong>{isEn ? 'Usage data' : '使用数据'}</strong>:{isEn ? ' Note-generation counts and payment records (stored locally).' : '笔记生成次数、付费记录(本地存储)'}</li>
              <li><strong>{isEn ? 'Payment information' : '支付信息'}</strong>:{isEn ? ' Credit-card numbers and billing addresses processed by Creem. We ' : '通过 Creem 处理的信用卡号、账单地址(我们'}<strong>{isEn ? 'do not store' : '不存储'}</strong>{isEn ? ' any payment information — all handled by Creem.io.' : '任何支付信息,均由 Creem.io 处理)'}</li>
              <li><strong>{isEn ? 'Device information' : '设备信息'}</strong>:{isEn ? ' Browser type and IP address (for anti-scraping).' : '浏览器类型、IP 地址(用于反爬虫)'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">{isEn ? '3. How We Use Your Information' : '3. 我们如何使用您的信息'}</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>{isEn ? 'To provide AI note-generation services (notes, mind maps, flashcards, Q&A).' : '提供 AI 笔记生成服务(笔记、思维导图、记忆卡片、AI 追问)'}</li>
              <li>{isEn ? 'To process your payment orders.' : '处理您的付费订单'}</li>
              <li>{isEn ? 'To improve the product (anonymous usage statistics).' : '改进产品体验(匿名使用统计)'}</li>
              <li>{isEn ? 'To respond to your customer-service inquiries.' : '回复您的客服咨询'}</li>
            </ul>
            <p className="mt-3">
              <strong>{isEn ? 'We will NOT' : '我们不会'}</strong>{isEn ? ': use your study materials to train AI models, sell to third parties, or target ads to you.' : ':将您的学习资料用于 AI 模型训练、卖给第三方、做广告精准投放。'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">{isEn ? '4. AI Model Processing' : '4. AI 模型处理'}</h2>
            <p>
              {isEn ? 'Your uploaded materials are sent to our AI model (provided by MiniMax, model MiniMax-M3) for content understanding and generation. The content is ' : '您上传的学习资料会发送给 AI 模型(由 MiniMax 提供,MiniMax-M3 模型)进行内容理解与生成。资料内容'}<strong>{isEn ? 'used only for the current generation request' : '仅用于本次生成请求'}</strong>{isEn ? ' and will not be used by MiniMax for model training. After processing, the server ' : ',不会被 MiniMax 用于模型训练。处理完成后,服务端'}<strong>{isEn ? 'does not store' : '不存储'}</strong>{isEn ? ' your original files.' : '您的原始文件。'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">{isEn ? '5. Data Storage and Cross-Border Transfer' : '5. 数据存储与跨境传输'}</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>{isEn ? 'Local storage' : '本地存储'}</strong>:{isEn ? ' Learning history and payment status stored in your browser localStorage, not on our servers.' : '学习历史、付费状态保存在您的浏览器 localStorage 中,不上传服务器'}</li>
              <li><strong>{isEn ? 'Server storage' : '服务器存储'}</strong>:{isEn ? ' Deployed on Vercel (US), temporarily processing your requests.' : 'Vercel(美国)部署,临时处理您的请求'}</li>
              <li><strong>{isEn ? 'AI processing' : 'AI 处理'}</strong>:{isEn ? ' MiniMax API processes your materials.' : 'MiniMax API 处理您的资料内容'}</li>
              <li><strong>{isEn ? 'Payment processing' : '支付处理'}</strong>:{isEn ? ' Creem.io (US) processes your credit-card information.' : 'Creem.io(美国)处理您的信用卡信息'}</li>
            </ul>
            <p className="mt-3">
              {isEn ? 'Under Articles 38–40 of the Personal Information Protection Law, you explicitly consent to cross-border transfer of your personal information. Continued use of the service constitutes your consent.' : '根据《个人信息保护法》第 38-40 条,跨境传输您的个人信息前,您明确同意。继续使用本服务即视为您同意上述跨境传输。'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">{isEn ? '6. Your Rights' : '6. 您的权利'}</h2>
            <p>{isEn ? 'Under Articles 44–50 of the Personal Information Protection Law, you have the right to:' : '根据《个人信息保护法》第 44-50 条,您有权:'}</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>{isEn ? 'View all information we hold about you.' : '查看我们持有的关于您的所有信息'}</li>
              <li>{isEn ? 'Correct inaccurate information.' : '更正不准确的信息'}</li>
              <li>{isEn ? 'Delete your information.' : '删除您的信息'}</li>
              <li>{isEn ? 'Withdraw your consent.' : '撤回您的同意'}</li>
              <li>{isEn ? 'Cancel your account (if you have one).' : '注销账号(如有账号系统)'}</li>
            </ul>
            <p className="mt-3">
              {isEn ? 'To exercise these rights, contact ' : '行使上述权利,请联系:'}<strong>support@mindflow.wang</strong>{isEn ? ' (we will reply within 15 business days).' : '(我们会在 15 个工作日内回复)。'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">{isEn ? '7. Cookies and Similar Technologies' : '7. Cookie 与类似技术'}</h2>
            <p>
              {isEn ? 'We only use strictly necessary functional cookies (e.g., login status). No tracking cookies or third-party advertising cookies.' : '我们仅使用必要的功能性 Cookie(如登录状态)。不使用追踪 Cookie 或第三方广告 Cookie。'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">{isEn ? '8. Minor Protection' : '8. 未成年人保护'}</h2>
            <p>
              {isEn ? 'This service is for adults (college students, graduate students, etc.). If you are a minor (under 18), please use this service under the supervision of a legal guardian.' : '本服务面向成年人(大学生、研究生等)。如您是未成年人(18 岁以下),请在法定监护人陪同下使用本服务。'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">{isEn ? '9. Policy Changes' : '9. 政策变更'}</h2>
            <p>
              {isEn ? 'We may update this policy as our business or applicable laws change. Significant changes will be notified on the site.' : '我们可能根据业务发展或法律变化更新本政策。重大变更会通过站内通知告知您。'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">{isEn ? '10. Contact Us' : '10. 联系我们'}</h2>
            <p>
              {isEn ? 'Operator' : '经营者'}:<strong>泸县玄澈服装店</strong>({isEn ? 'sole proprietorship' : '个体工商户'})<br />
              {isEn ? 'Email' : '邮箱'}:<strong>support@mindflow.wang</strong><br />
              {isEn ? 'Website' : '网址'}:<strong>https://mindflow.wang</strong>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200 text-sm text-slate-500">
          <a href="/" className="text-blue-600 hover:underline">← {isEn ? 'Back to Home' : '返回首页'}</a>
          {' · '}
          <a href="/terms" className="text-blue-600 hover:underline">{isEn ? 'Terms of Service' : '服务条款'}</a>
        </div>
      </div>
    </div>
  );
}