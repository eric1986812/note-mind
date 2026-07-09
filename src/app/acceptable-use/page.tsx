'use client';

export default function AcceptableUsePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <a href="/" className="text-sm text-emerald-600 hover:underline">← 返回主页</a>
        </div>
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">MindFlow 可接受使用政策 (AUP)</h1>
          <p className="text-slate-600">最后更新:2026 年 7 月 9 日 · 适用于 mindflow.wang 全站服务</p>
        </header>
        <div className="prose prose-slate max-w-none space-y-6 text-slate-800 leading-relaxed">
          <section className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded">
            <p className="font-semibold text-amber-900 mb-2">使用 MindFlow 之前,请仔细阅读本政策。</p>
            <p className="text-amber-900">
              MindFlow 是基于第三方大语言模型构建的<strong>学习辅助工具</strong>,用于帮助学生整理、理解和复习学习材料。
              继续使用即表示您同意遵守本政策。
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">1. 允许的用途</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>整理老师课堂 PPT、PDF 讲义、英文论文等学习材料</li>
              <li>生成结构化笔记、思维导图、记忆卡片,辅助理解与复习</li>
              <li>翻译中英文学术资料</li>
              <li>对学习材料中的概念进行 AI 提问与追问</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">2. 明确禁止的用途</h2>
            <p className="font-semibold text-red-700 mb-2">您不得使用 MindFlow 生成、上传、传播以下内容:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>色情、淫秽、NSFW 内容</strong></li>
              <li><strong>暴力、血腥、自残、恐怖内容</strong></li>
              <li><strong>仇恨言论、种族歧视、性别歧视、地域歧视、宗教歧视</strong></li>
              <li><strong>虚假信息、谣言、误导性宣传</strong></li>
              <li><strong>侵犯他人知识产权</strong></li>
              <li><strong>个人隐私信息</strong></li>
              <li><strong>违法内容</strong>(毒品、武器、赌博、洗钱、诈骗)</li>
              <li><strong>深度伪造、换脸、伪造他人言论</strong></li>
              <li><strong>政治敏感内容</strong></li>
              <li><strong>作弊与代写学术作业</strong></li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">3. 关于"作业代写"的明确禁止</h2>
            <p className="font-semibold text-red-700 mb-2">MindFlow 不是"代写作业"工具。</p>
            <p>本平台不提供以下服务,所有相关使用场景均被禁止:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>代写课程作业、考试、毕业论文、学术论文</li>
              <li>代考、替考、组织考试作弊</li>
              <li>代写留学申请文书、个人陈述、推荐信</li>
              <li>代写商业文案、营销话术、虚假评论</li>
            </ul>
            <p className="mt-3">
              <strong>合规使用方式</strong>:用户可以上传<strong>自己的课堂材料</strong>(老师的 PPT、自己的笔记),由 AI 帮助<strong>整理、归纳、复习</strong>。
              但用户<strong>不得</strong>用 MindFlow 直接生成作业、论文、文书后<strong>作为自己的原创作品提交</strong>。
            </p>
            <p className="mt-2 text-slate-600 text-sm">
              用户应遵守所在学校/机构的学术诚信政策。学术不端行为的后果由用户本人承担。
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">4. AI 生成内容的免责声明</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>MindFlow 输出由第三方大语言模型生成,可能存在事实性错误、逻辑偏差</li>
              <li>用户应<strong>独立判断</strong>AI 输出内容的准确性</li>
              <li>对于<strong>重要考试考点</strong>,建议以教师指定教材为准</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">5. 用户上传内容的责任</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>用户应确保拥有上传材料的使用权</li>
              <li>用户不得上传他人的<strong>机密、未公开、未授权</strong>的材料</li>
              <li>用户上传的<strong>个人身份信息</strong>由用户自行承担责任</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">6. 账户与服务的封禁</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>第一次违规:警告 + 删除违规内容</li>
              <li>重复违规:暂停账户 7-30 天</li>
              <li>严重违规(违法、色情、深度伪造):永久封禁 + 报告有关部门</li>
              <li>已购买服务费用<strong>不予退款</strong></li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">7. 举报违规</h2>
            <p>如发现违规使用行为,请发送邮件至 <strong>support@mindflow.wang</strong>,我们将在 3 个工作日内处理。</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">8. 政策变更</h2>
            <p>本政策可能随服务更新而修订,变更将在本页公布,继续使用即视为接受。</p>
          </section>
          <section className="border-t pt-6 mt-8 text-sm text-slate-500">
            <p>MindFlow 是独立产品,基于第三方大语言模型构建,与模型供应商无隶属关系。</p>
          </section>
        </div>
      </div>
    </div>
  );
}
