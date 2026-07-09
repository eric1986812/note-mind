// AI 模型免责声明
// MindFlow 使用第三方 AI 模型(MiniMax-M3)提供内容生成

'use client';

import { useLang } from '../../lib/lang-context';

export default function Disclaimer() {
  const { lang } = useLang();
  const isEn = lang === 'en';
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">{isEn ? 'AI Model Disclaimer' : 'AI 模型免责声明'}</h1>
        <p className="text-slate-500 text-sm mb-8">{isEn ? 'Last updated: July 9, 2026' : '最后更新: 2026 年 7 月 9 日'}</p>

        <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">{isEn ? 'Service Description' : '服务说明'}</h2>
            <p>
              MindFlow({isEn ? '"the Service"' : '以下简称"本服务"'}){isEn ? ' is operated by ' : '由'}<strong>泸县玄澈服装店</strong>
              ({isEn ? 'sole proprietorship) as an AI study-note assistant.' : '个体工商户)运营,是一个 AI 学习笔记助手。'})
            </p>
            <p>
              {isEn ? 'The Service provides content generation ' : '本服务'}<strong>{isEn ? 'powered by third-party AI models (MiniMax-M3)' : '基于第三方 AI 模型(MiniMax-M3)提供'}</strong>{isEn ? ', including but not limited to: structured notes, mind maps, flashcards, and AI Q&A.' : '内容生成服务,包括但不限于:文字笔记、思维导图、记忆卡片、AI 追问。'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">{isEn ? 'Independence Statement' : '独立性声明'}</h2>
            <p>
              MindFlow {isEn ? 'is an' : '是一个'}<strong>{isEn ? 'independent product' : '独立产品'}</strong>{isEn ? ' with no affiliation to MiniMax. We use an independent brand, independent product design, and independent pricing. The product name "MindFlow" does not contain any AI model name.' : ',与 MiniMax 公司无隶属关系。我们使用独立品牌、独立服务设计、独立定价,产品名称"MindFlow"不包含任何 AI 模型名称。'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">{isEn ? 'Disclaimer' : '免责声明'}</h2>
            <p>
              {isEn ? 'AI-generated content is ' : 'AI 生成的内容'}<strong>{isEn ? 'for reference only — accuracy, completeness, and reliability are NOT guaranteed' : '仅供参考学习,不保证准确性、完整性、可靠性'}</strong>{isEn ? '. Please verify all AI-generated content before relying on it.' : '。请仔细核查 AI 生成内容后再使用。'}
            </p>
            <p>{isEn ? 'AI-generated content should NOT be used as the basis for:' : '本服务生成的内容不应作为以下用途的依据:'}</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>{isEn ? 'Medical diagnosis, treatment plans, medication advice' : '医学诊断、治疗方案、用药建议'}</li>
              <li>{isEn ? 'Legal advice or compliance judgments' : '法律意见、合规判断'}</li>
              <li>{isEn ? 'Investment decisions or financial advice' : '投资决策、财务建议'}</li>
              <li>{isEn ? 'Academic citations (without independent verification)' : '学术引用(未经人工核实)'}</li>
              <li>{isEn ? 'The sole basis for any critical decision' : '任何关键决策的唯一依据'}</li>
            </ul>
            <p className="mt-3">
              {isEn ? 'The operator ' : '因依赖 AI 输出造成的任何损失,本服务运营者'}<strong>{isEn ? 'assumes no liability' : '不承担责任'}</strong>{isEn ? ' for any damages arising from reliance on AI outputs.' : '。'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">{isEn ? 'Data Usage' : '数据使用'}</h2>
            <p>
              {isEn ? 'Your uploaded study materials are ' : '您上传的学习资料'}<strong>{isEn ? 'used only for the current generation request' : '仅用于本次生成请求'}</strong>{isEn ? ' and will NOT be used by MiniMax for model training. After processing, the server ' : ',不会被 MiniMax 用于模型训练。处理完成后,服务端'}<strong>{isEn ? 'does not store' : '不存储'}</strong>{isEn ? ' your original files.' : '您的原始文件。'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">{isEn ? 'Contact' : '联系方式'}</h2>
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
          {' · '}
          <a href="/terms" className="text-blue-600 hover:underline">{isEn ? 'Terms of Service' : '服务条款'}</a>
        </div>
      </div>
    </div>
  );
}