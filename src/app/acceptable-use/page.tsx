'use client';

import { useLang } from '../../lib/lang-context';

export default function AcceptableUsePage() {
  const { lang } = useLang();
  const isEn = lang === 'en';
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <a href="/" className="text-sm text-emerald-600 hover:underline">← {isEn ? 'Back to Home' : '返回主页'}</a>
        </div>
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">{isEn ? 'MindFlow Acceptable Use Policy (AUP)' : 'MindFlow 可接受使用政策 (AUP)'}</h1>
          <p className="text-slate-600">{isEn ? 'Last updated: September 11, 2026 · Applies to all of mindflow.wang' : '最后更新:2026 年 9 月 11 日 · 适用于 mindflow.wang 全站服务'}</p>
        </header>
        <div className="prose prose-slate max-w-none space-y-6 text-slate-800 leading-relaxed">
          <section className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded">
            <p className="font-semibold text-amber-900 mb-2">
              {isEn ? 'Please read this policy before using MindFlow.' : '使用 MindFlow 之前,请仔细阅读本政策。'}
            </p>
            <p className="text-amber-900">
              {isEn
                ? 'MindFlow is a study-assist tool built on third-party large language models. It helps students organize, understand, and review their study materials. By continuing to use MindFlow you agree to this policy.'
                : 'MindFlow 是基于第三方大语言模型构建的学习辅助工具,用于帮助学生整理、理解和复习学习材料。继续使用即表示您同意遵守本政策。'}
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">{isEn ? '1. Permitted Uses' : '1. 允许的用途'}</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>{isEn ? 'Organizing your lecture slides, PDF handouts, and English-language research papers' : '整理老师课堂 PPT、PDF 讲义、英文论文等学习材料'}</li>
              <li>{isEn ? 'Generating structured notes, mind maps, and flashcards to support understanding and review' : '生成结构化笔记、思维导图、记忆卡片,辅助理解与复习'}</li>
              <li>{isEn ? 'Translating between Chinese and English for academic material' : '翻译中英文学术资料'}</li>
              <li>{isEn ? 'Asking AI questions about the concepts in your study material' : '对学习材料中的概念进行 AI 提问与追问'}</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">{isEn ? '2. Strictly Prohibited Uses' : '2. 明确禁止的用途'}</h2>
            <p className="font-semibold text-red-700 mb-2">
              {isEn ? 'You may not use MindFlow to generate, upload, or distribute any of the following:' : '您不得使用 MindFlow 生成、上传、传播以下内容:'}
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>{isEn ? 'Pornographic, obscene, or NSFW content' : '色情、淫秽、NSFW 内容'}</strong></li>
              <li><strong>{isEn ? 'Violent, gory, self-harm, or terror content' : '暴力、血腥、自残、恐怖内容'}</strong></li>
              <li><strong>{isEn ? 'Hate speech, racism, sexism, regional or religious discrimination' : '仇恨言论、种族歧视、性别歧视、地域歧视、宗教歧视'}</strong></li>
              <li><strong>{isEn ? 'Disinformation, rumors, or misleading campaigns' : '虚假信息、谣言、误导性宣传'}</strong></li>
              <li><strong>{isEn ? 'Content that infringes the intellectual property of others' : '侵犯他人知识产权'}</strong></li>
              <li><strong>{isEn ? 'Personal private information of others' : '个人隐私信息'}</strong></li>
              <li><strong>{isEn ? 'Illegal content (drugs, weapons, gambling, money laundering, fraud)' : '违法内容(毒品、武器、赌博、洗钱、诈骗)'}</strong></li>
              <li><strong>{isEn ? 'Deepfakes, face swaps, or forged statements' : '深度伪造、换脸、伪造他人言论'}</strong></li>
              <li><strong>{isEn ? 'Politically sensitive content' : '政治敏感内容'}</strong></li>
              <li><strong>{isEn ? 'Cheating and ghostwriting academic work' : '作弊与代写学术作业'}</strong></li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">{isEn ? '3. Explicit Ban on "Homework Writing"' : '3. 关于"作业代写"的明确禁止'}</h2>
            <p className="font-semibold text-red-700 mb-2">
              {isEn ? 'MindFlow is not a "homework writing" tool.' : 'MindFlow 不是"代写作业"工具。'}
            </p>
            <p>
              {isEn
                ? 'MindFlow does not provide the following services. All such use cases are prohibited:'
                : '本平台不提供以下服务,所有相关使用场景均被禁止:'}
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>{isEn ? 'Ghostwriting for course assignments, exams, theses, or academic papers' : '代写课程作业、考试、毕业论文、学术论文'}</li>
              <li>{isEn ? 'Taking exams on behalf of someone else, or organizing exam cheating' : '代考、替考、组织考试作弊'}</li>
              <li>{isEn ? 'Ghostwriting college application essays, personal statements, or recommendation letters' : '代写留学申请文书、个人陈述、推荐信'}</li>
              <li>{isEn ? 'Ghostwriting marketing copy or fake reviews' : '代写商业文案、营销话术、虚假评论'}</li>
            </ul>
            <p className="mt-3">
              <strong>{isEn ? 'Compliant use' : '合规使用方式'}</strong>
              {isEn
                ? ': you may upload your own class material (professor\'s slides, your own notes) and let AI help you organize, summarize, and review it. You may not use MindFlow to directly generate assignments, papers, or essays and then submit them as your own original work.'
                : ':用户可以上传自己的课堂材料(老师的 PPT、自己的笔记),由 AI 帮助整理、归纳、复习。但用户不得用 MindFlow 直接生成作业、论文、文书后作为自己的原创作品提交。'}
            </p>
            <p className="mt-2 text-slate-600 text-sm">
              {isEn
                ? 'You are responsible for following the academic-integrity policies of your school or institution. MindFlow is not liable for consequences of academic misconduct.'
                : '用户应遵守所在学校/机构的学术诚信政策。学术不端行为的后果由用户本人承担。'}
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">{isEn ? '4. AI-Generated Content Disclaimer' : '4. AI 生成内容的免责声明'}</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>{isEn ? 'MindFlow output is generated by third-party large language models and may contain factual errors or logical inconsistencies.' : 'MindFlow 输出由第三方大语言模型生成,可能存在事实性错误、逻辑偏差'}</li>
              <li>{isEn ? 'You should independently judge the accuracy of any AI output.' : '用户应独立判断 AI 输出内容的准确性'}</li>
              <li>{isEn ? 'For exam-critical content, please defer to your instructor\'s official materials.' : '对于重要考试考点,建议以教师指定教材为准'}</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">{isEn ? '5. Responsibility for Uploaded Content' : '5. 用户上传内容的责任'}</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>{isEn ? 'You are responsible for ensuring you have the right to use the materials you upload.' : '用户应确保拥有上传材料的使用权'}</li>
              <li>{isEn ? 'You may not upload confidential, unpublished, or unauthorized material that belongs to others.' : '用户不得上传他人的机密、未公开、未授权的材料'}</li>
              <li>{isEn ? 'You are responsible for any personal-identifying information you include in your uploads.' : '用户上传的个人身份信息由用户自行承担责任'}</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">{isEn ? '6. Account Suspension' : '6. 账户与服务的封禁'}</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>{isEn ? 'First violation: warning + content removal' : '第一次违规:警告 + 删除违规内容'}</li>
              <li>{isEn ? 'Repeat violations: account suspended for 7–30 days' : '重复违规:暂停账户 7-30 天'}</li>
              <li>{isEn ? 'Severe violations (illegal content, deepfakes, etc.): permanent ban + reported to authorities' : '严重违规(违法、色情、深度伪造):永久封禁 + 报告有关部门'}</li>
              <li>{isEn ? 'No refunds for already-paid services' : '已购买服务费用不予退款'}</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">{isEn ? '7. Reporting Violations' : '7. 举报违规'}</h2>
            <p>
              {isEn
                ? 'If you find a violation, please email '
                : '如发现违规使用行为,请发送邮件至 '}
              <strong>support@mindflow.wang</strong>
              {isEn
                ? '. We will respond within 3 business days.'
                : ',我们将在 3 个工作日内处理。'}
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-3">{isEn ? '8. Policy Changes' : '8. 政策变更'}</h2>
            <p>
              {isEn
                ? 'This policy may be updated as the service evolves. Changes will be posted on this page. Continued use constitutes acceptance.'
                : '本政策可能随服务更新而修订,变更将在本页公布,继续使用即视为接受。'}
            </p>
          </section>
          <section className="border-t pt-6 mt-8 text-sm text-slate-500">
            <p>
              {isEn
                ? 'MindFlow is an independent product built on top of third-party large language models. We are not affiliated with any model provider.'
                : 'MindFlow 是独立产品,基于第三方大语言模型构建,与模型供应商无隶属关系。'}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
