// AI 模型免责声明
// MindFlow 使用第三方 AI 模型(MiniMax-M3)提供内容生成

export const dynamic = 'force-static';

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">AI 模型免责声明</h1>
        <p className="text-slate-500 text-sm mb-8">最后更新: 2026 年 7 月 6 日</p>

        <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">服务说明</h2>
            <p>
              MindFlow(以下简称"本服务")由<strong>泸县玄澈服装店</strong>(个体工商户)运营,
              是一个 AI 学习笔记助手。
            </p>
            <p>
              本服务<strong>基于第三方 AI 模型(MiniMax-M3)提供</strong>内容生成服务,
              包括但不限于:文字笔记、思维导图、记忆卡片、AI 追问。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">独立性声明</h2>
            <p>
              MindFlow 是一个<strong>独立产品</strong>,与 MiniMax 公司无隶属关系。
              我们使用独立品牌、独立服务设计、独立定价,产品名称"MindFlow"不包含任何 AI 模型名称。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">免责声明</h2>
            <p>
              AI 生成的内容<strong>仅供参考学习,不保证准确性、完整性、可靠性</strong>。
              请仔细核查 AI 生成内容后再使用。
            </p>
            <p>本服务生成的内容<strong>不应作为</strong>以下用途的依据:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>医学诊断、治疗方案、用药建议</li>
              <li>法律意见、合规判断</li>
              <li>投资决策、财务建议</li>
              <li>学术引用(未经人工核实)</li>
              <li>任何关键决策的唯一依据</li>
            </ul>
            <p className="mt-3">
              因依赖 AI 输出造成的任何损失,本服务运营者<strong>不承担责任</strong>。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">数据使用</h2>
            <p>
              您上传的学习资料<strong>仅用于本次生成请求</strong>,不会被 MiniMax 用于模型训练。
              处理完成后,服务端<strong>不存储</strong>您的原始文件。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">English Version / 英文版</h2>
            <p>
              <strong>AI Model Disclaimer</strong>
            </p>
            <p>
              MindFlow is powered by third-party AI models (MiniMax-M3).
              AI-generated content is for reference only and accuracy is not guaranteed.
              Please verify all AI outputs independently before use.
            </p>
            <p>
              This service is independent from MiniMax. We use an independent brand,
              independent product design, and independent pricing.
              The product name "MindFlow" does not contain any AI model name.
            </p>
            <p>
              We are not liable for any damages arising from reliance on AI outputs.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">联系方式</h2>
            <p>
              经营者:<strong>泸县玄澈服装店</strong>(个体工商户)<br />
              邮箱:<strong>support@mindflow.wang</strong><br />
              网址:<strong>https://mindflow.wang</strong>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200 text-sm text-slate-500">
          <a href="/" className="text-blue-600 hover:underline">← 返回首页</a>
          {' · '}
          <a href="/privacy" className="text-blue-600 hover:underline">隐私政策</a>
          {' · '}
          <a href="/terms" className="text-blue-600 hover:underline">服务条款</a>
        </div>
      </div>
    </div>
  );
}