// 隐私政策
// 老板 MindFlow / mindflow.wang
// 国内合规版本,覆盖《个人信息保护法》《网络安全法》《数据安全法》

export const dynamic = 'force-static';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">隐私政策</h1>
        <p className="text-slate-500 text-sm mb-8">最后更新: 2026 年 7 月 6 日</p>

        <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">1. 引言</h2>
            <p>
              MindFlow(以下简称"我们")由<strong>泸县玄澈服装店</strong>(个体工商户)运营,非常重视您的隐私。
              本隐私政策说明我们如何收集、使用、存储和保护您的个人信息。
              我们仅收集为您提供服务所必需的最少信息。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">2. 我们收集的信息</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>您主动上传的内容</strong>:您上传的 PPT、PDF、Word、图片等学习资料</li>
              <li><strong>使用数据</strong>:笔记生成次数、付费记录(本地存储)</li>
              <li><strong>支付信息</strong>:通过 Creem 处理的信用卡号、账单地址(我们<strong>不存储</strong>任何支付信息,均由 Creem.io 处理)</li>
              <li><strong>设备信息</strong>:浏览器类型、IP 地址(用于反爬虫)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">3. 我们如何使用您的信息</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>提供 AI 笔记生成服务(笔记、思维导图、记忆卡片、AI 追问)</li>
              <li>处理您的付费订单</li>
              <li>改进产品体验(匿名使用统计)</li>
              <li>回复您的客服咨询</li>
            </ul>
            <p className="mt-3">
              <strong>我们不会</strong>:将您的学习资料用于 AI 模型训练、卖给第三方、做广告精准投放。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">4. AI 模型处理</h2>
            <p>
              您上传的学习资料会发送给 AI 模型(由 MiniMax 提供,MiniMax-M3 模型)进行内容理解与生成。
              资料内容<strong>仅用于本次生成请求</strong>,不会被 MiniMax 用于模型训练。
              处理完成后,服务端<strong>不存储</strong>您的原始文件。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">5. 数据存储与跨境传输</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>本地存储</strong>:学习历史、付费状态保存在您的浏览器 localStorage 中,不上传服务器</li>
              <li><strong>服务器存储</strong>:Vercel(美国)部署,临时处理您的请求</li>
              <li><strong>AI 处理</strong>:MiniMax API 处理您的资料内容</li>
              <li><strong>支付处理</strong>:Creem.io(美国)处理您的信用卡信息</li>
            </ul>
            <p className="mt-3">
              根据《个人信息保护法》第 38-40 条,跨境传输您的个人信息前,您明确同意。
              继续使用本服务即视为您同意上述跨境传输。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">6. 您的权利</h2>
            <p>根据《个人信息保护法》第 44-50 条,您有权:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>查看我们持有的关于您的所有信息</li>
              <li>更正不准确的信息</li>
              <li>删除您的信息</li>
              <li>撤回您的同意</li>
              <li>注销账号(如有账号系统)</li>
            </ul>
            <p className="mt-3">
              行使上述权利,请联系:<strong>support@mindflow.wang</strong>(我们会在 15 个工作日内回复)。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">7. Cookie 与类似技术</h2>
            <p>
              我们仅使用必要的功能性 Cookie(如登录状态)。不使用追踪 Cookie 或第三方广告 Cookie。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">8. 未成年人保护</h2>
            <p>
              本服务面向成年人(大学生、研究生等)。如您是未成年人(18 岁以下),
              请在法定监护人陪同下使用本服务。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">9. 政策变更</h2>
            <p>
              我们可能根据业务发展或法律变化更新本政策。重大变更会通过站内通知告知您。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">10. 联系我们</h2>
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
          <a href="/terms" className="text-blue-600 hover:underline">服务条款</a>
        </div>
      </div>
    </div>
  );
}