// 服务条款
// 老板 MindFlow / mindflow.wang
// 国内合规版本,平衡用户保护和创业公司灵活度

'use client';

import { useLang } from '../../lib/lang-context';

export default function Terms() {
  const { lang } = useLang();
  const isEn = lang === 'en';
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">{isEn ? 'Terms of Service' : '服务条款'}</h1>
        <p className="text-slate-500 text-sm mb-8">{isEn ? 'Last updated: July 9, 2026' : '最后更新: 2026 年 7 月 9 日'}</p>

        <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">{isEn ? '1. Acceptance of Terms' : '1. 接受条款'}</h2>
            <p>
              {isEn ? 'Welcome to MindFlow ("the Service"), operated by ' : '欢迎使用 MindFlow(以下简称"本服务"),由'}
              <strong>泸县玄澈服装店</strong>{isEn ? ' (sole proprietorship). By using the Service you agree to these terms.' : '(个体工商户)运营。使用本服务即表示您同意以下条款。'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">{isEn ? '2. Service Description' : '2. 服务说明'}</h2>
            <p>
              {isEn ? 'MindFlow is an AI study-note assistant. It takes your uploaded PPT, PDF, or Word materials and outputs structured notes, mind maps, flashcards, and AI Q&A. The service runs on top of third-party large language models.' : 'MindFlow 是一款 AI 学习笔记助手,接收您上传的 PPT、PDF 或 Word 材料,输出结构化笔记、思维导图、记忆卡片和 AI 追问。本服务基于第三方大语言模型构建。'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">{isEn ? '3. User Obligations' : '3. 用户义务'}</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>{isEn ? 'You must be at least 18 years old, or use the Service under the supervision of a legal guardian.' : '您必须年满 18 周岁,或在法定监护人陪同下使用本服务'}</li>
              <li>{isEn ? 'You must have legal rights to all materials you upload (own coursework, public materials, or authorized content).' : '您必须拥有您上传材料的所有合法权利(本人课件、公开资料或已获授权的内容)'}</li>
              <li>{isEn ? 'You must NOT use the Service to generate or distribute NSFW, illegal, hateful, or harmful content.' : '您不得使用本服务生成或传播淫秽、违法、仇恨或有害内容'}</li>
              <li>{isEn ? 'You must NOT use the Service for academic cheating (writing homework, essays, theses, applications on behalf of you or others).' : '您不得使用本服务进行学术不端(代写作业、论文、文书、替考等)'}</li>
              <li>{isEn ? 'You must NOT attempt to reverse-engineer, scrape, or attack the Service.' : '您不得尝试反向工程、爬取或攻击本服务'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">{isEn ? '4. Subscription and Payment' : '4. 订阅与支付'}</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>{isEn ? 'Subscription fees are billed monthly or annually in advance through our payment partners (Creem.io for international users).' : '订阅费用通过我们的支付合作伙伴(Creem.io 服务海外用户)按月或按年预收'}</li>
              <li>{isEn ? 'You can cancel your subscription at any time; the service stays active until the end of the current billing period.' : '您可以随时取消订阅,服务将持续到当前计费周期结束'}</li>
              <li>{isEn ? '7-day refund: refund within 7 days of purchase, no questions asked.' : '7 天无理由退款:购买后 7 天内 100% 退款'}</li>
              <li>{isEn ? 'After 7 days, no pro-rated refunds. The service is "as-is".' : '7 天后不再按比例退款,服务按"现状"提供'}</li>
              <li dangerouslySetInnerHTML={{ __html: isEn ? 'Refunds contact: <strong>support@mindflow.wang</strong>.' : '退款请联系 <strong>support@mindflow.wang</strong>。' }} />
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">{isEn ? '5. Intellectual Property' : '5. 知识产权'}</h2>
            <p>
              {isEn ? 'You retain all rights to your uploaded materials. The AI-generated outputs (notes, mind maps, etc.) belong to you for personal study use. You may NOT republish, resell, or redistribute MindFlow-generated content as a paid product or service.' : '您保留对上传材料的所有权利。AI 生成的输出(笔记、思维导图等)归您个人学习使用。未经授权,不得将 MindFlow 生成的内容作为付费产品或服务再发布、再销售或再分发。'}
            </p>
            <p className="mt-3">
              {isEn ? 'The MindFlow brand, product design, code, and documentation are owned by the operator. You may NOT copy or imitate them.' : 'MindFlow 品牌、产品设计、代码和文档归运营者所有。您不得复制或模仿。'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">{isEn ? '6. Service Availability' : '6. 服务可用性'}</h2>
            <p>
              {isEn ? 'We aim for 99% uptime but do not guarantee uninterrupted service. We may suspend the service for maintenance, upgrades, or force majeure. We will notify you of major changes via in-site messages.' : '我们力争 99% 可用率,但不保证服务不中断。我们可能因维护、升级或不可抗力暂停服务。重大变更将通过站内消息通知您。'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">{isEn ? '7. Limitation of Liability' : '7. 责任限制'}</h2>
            <p>
              {isEn ? 'AI-generated content is for reference only. We are not liable for any damages arising from reliance on AI outputs, including but not limited to academic, medical, legal, or financial decisions.' : 'AI 生成的内容仅供参考。我们对因依赖 AI 输出而产生的任何损失不承担责任,包括但不限于学术、医疗、法律或财务决策。'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">{isEn ? '8. Account Suspension and Termination' : '8. 账户暂停与终止'}</h2>
            <p>
              {isEn ? 'We reserve the right to suspend or terminate accounts that violate these terms, our Acceptable Use Policy, or applicable laws. No refund for terminated accounts that violated terms.' : '我们保留暂停或终止违反这些条款、可接受使用政策或适用法律的账户的权利。违反条款被终止的账户不予退款。'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">{isEn ? '9. Governing Law' : '9. 适用法律'}</h2>
            <p>
              {isEn ? 'These terms are governed by the laws of the People\'s Republic of China. Disputes will be resolved by the operator\'s local People\'s Court.' : '本条款适用中华人民共和国法律。争议由运营者所在地人民法院管辖。'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">{isEn ? '10. Terms Changes' : '10. 条款变更'}</h2>
            <p>
              {isEn ? 'We may update these terms as needed. Continued use of the Service constitutes your acceptance of the new terms.' : '我们可能根据需要更新这些条款。继续使用本服务即视为您接受新条款。'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">{isEn ? '11. Contact' : '11. 联系方式'}</h2>
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
          <a href="/privacy" className="text-blue-600 hover:underline">{isEn ? 'Privacy Policy' : '隐私政策'}</a>
        </div>
      </div>
    </div>
  );
}