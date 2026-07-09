import Link from 'next/link';
import {
  Brain, FileText, Network, Layers, MessageCircle, Sparkles,
  Upload, CheckCircle2, X, Clock, BookOpen, GraduationCap, Globe,
  Shield, Zap, Users, ArrowRight
} from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* ===== 顶部导航 ===== */}
      <nav className="border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Brain className="w-7 h-7 text-primary-600" />
            <span className="font-bold text-xl text-gray-900">MindFlow</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/history" className="text-gray-600 hover:text-primary-600 hidden sm:inline">📚 我的笔记</Link>
            <Link href="#how" className="text-gray-600 hover:text-primary-600 hidden sm:inline">怎么用</Link>
            <Link href="#compare" className="text-gray-600 hover:text-primary-600 hidden sm:inline">对比</Link>
            <Link href="#pricing" className="text-gray-600 hover:text-primary-600 hidden sm:inline">定价</Link>
            <Link href="#faq" className="text-gray-600 hover:text-primary-600 hidden md:inline">FAQ</Link>
            <Link href="/upload" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 font-medium">
              免费试用
            </Link>
          </div>
        </div>
      </nav>

      {/* ===== Hero - 痛点 + 承诺 ===== */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-emerald-50 py-20 md:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <Sparkles className="w-4 h-4" /> 开学季福利 · 限时免费 5 份学习材料
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-[1.15]">
            上传 1 份 PPT / 论文 / PDF,<br />
            <span className="text-primary-600">30 秒,AI 帮你进入学习心流</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-4 max-w-2xl mx-auto leading-relaxed">
            MindFlow 把老师的 PPT、英文论文、PDF 资料,
            <strong className="text-gray-900">1 键变成你的 4 份学习材料学习资料</strong>。
            <br className="hidden md:block" />
            期末、考研、考公、出国 — 不再手抄,不再硬背,把时间留给真正理解。
          </p>
          <p className="text-sm text-gray-500 mb-10">
            永久免费 5 份/月 · 无需信用卡 · 30 秒出笔记
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/upload" className="bg-primary-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-700 shadow-lg shadow-primary-200 flex items-center justify-center gap-2">
              30 秒拿到 4 份学习材料 <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="#how" className="bg-white text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold border border-gray-200 hover:border-primary-300">
              看 30 秒演示
            </Link>
          </div>
          <p className="text-xs text-gray-500 mt-5">
            30 秒上传 · 1 分钟出笔记 · 无需信用卡 · 支持 PPT/PDF/Word
          </p>
        </div>
      </section>

      {/* ===== 痛点场景 - 3 个真实学生党的痛 ===== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">这些场景,你是不是很熟?</h2>
            <p className="text-gray-600">不是"学生不努力",是工具不对</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Clock,
                tag: '🎓 本科生',
                title: '期末 1 周,5 门课的 PPT 还没整理',
                pain: '老师 400 页 PPT 讲完了,你却要花 3 天手抄重点,抄完还没时间复习。',
                result: '用 MindFlow:1 份 PPT 30 秒出笔记 + 思维导图 + 卡片,1 小时搞定 1 门课。'
              },
              {
                icon: GraduationCap,
                tag: '📚 考研 / 考公',
                title: '政治 1000+ 页,看完就忘',
                pain: '每天看 8 小时,但考点记不住,做模拟卷正确率上不去,焦虑到睡不着。',
                result: 'AI 自动出 200 张记忆卡片,按记忆曲线每天推 30 张复习,2 个月稳上考场。'
              },
              {
                icon: Globe,
                tag: '🌏 海外留学生',
                title: '英文文献 50 篇,看不完',
                pain: '教授让 2 周内读完 50 篇 paper,自己读 1 篇要 3 小时,根本来不及。',
                result: '上传 PDF 1 分钟出中文摘要 + 关键术语解释 + 思维导图,2 小时扫完 1 章节。'
              }
            ].map((c, i) => (
              <div key={i} className="bg-white p-7 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-sm text-primary-600 font-semibold mb-3">{c.tag}</div>
                <div className="flex items-start gap-3 mb-4">
                  <c.icon className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                  <h3 className="text-lg font-bold text-gray-900 leading-snug">{c.title}</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex gap-2 text-gray-600">
                    <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>{c.pain}</span>
                  </div>
                  <div className="flex gap-2 text-primary-700 bg-primary-50 -mx-3 px-3 py-2 rounded">
                    <CheckCircle2 className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span className="font-medium">{c.result}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 3 步走 + 30 秒演示 ===== */}
      <section id="how" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">3 步搞定,1 分钟出活</h2>
            <p className="text-gray-600">从上传到复习,不用动脑</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-primary-200" />
            {[
              { n: '1', icon: Upload, t: '上传资料', d: '拖拽 PPT / PDF / Word,30 秒搞定。' },
              { n: '2', icon: Sparkles, t: 'AI 自动 4 份学习材料', d: '笔记 + 导图 + 卡片 + 追问,1 分钟出。' },
              { n: '3', icon: BookOpen, t: '开始复习', d: '卡片按记忆曲线推,导图查骨架。' }
            ].map(s => (
              <div key={s.n} className="text-center relative">
                <div className="w-24 h-24 rounded-full bg-primary-100 text-primary-700 mx-auto mb-5 flex items-center justify-center relative z-10">
                  <s.icon className="w-10 h-10" />
                </div>
                <div className="text-xs text-primary-600 font-bold mb-1">STEP {s.n}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{s.t}</h3>
                <p className="text-sm text-gray-600">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 4 大核心功能(改写为"用户能获得什么") ===== */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-emerald-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">上传 1 份资料,得到 4 份学习材料</h2>
            <p className="text-gray-700 text-lg">不用切换 4 个 App · 不用记 4 套密码 · 不用再手抄笔记</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { icon: FileText, t: '📝 结构化笔记', d: 'AI 提取核心概念、考点、对比表。原文 30% 长度,半小时能复习完一章。' },
              { icon: Network, t: '🧠 思维导图(可缩放)', d: '一张图看清整章结构,颜色按层级,点击展开/收起,告别 PPT 翻来翻去。' },
              { icon: Layers, t: '🃏 记忆卡片(自动复习)', d: '8-15 张问答卡,按"艾宾浩斯曲线"每天推你复习 30 张,记得更牢。' },
              { icon: MessageCircle, t: '💬 AI 追问', d: '对笔记任意段落提问,3 秒出答案。不再翻书、不再群里问同学。' }
            ].map((f, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition flex gap-4">
                <div className="text-3xl flex-shrink-0">{f.t.split(' ')[0]}</div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{f.t.split(' ').slice(1).join(' ')}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{f.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Before / After 对比 ===== */}
      <section id="compare" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">传统 vs MindFlow</h2>
            <p className="text-gray-600">同样的 1 份生物课 PPT(40 页),看看差别</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-2 border-red-100 bg-red-50/30 rounded-2xl p-6">
              <div className="flex items-center gap-2 text-red-600 font-semibold mb-4">
                <X className="w-5 h-5" /> 自己整理(传统方式)
              </div>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex gap-2"><X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" /> 3 小时手抄笔记</li>
                <li className="flex gap-2"><X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" /> 重点凭感觉划,容易漏考点</li>
                <li className="flex gap-2"><X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" /> 没有记忆卡片,背不下来</li>
                <li className="flex gap-2"><X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" /> 同学问问题答不上,翻半天</li>
                <li className="flex gap-2"><X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" /> 考前一周才开始复习,来不及</li>
              </ul>
            </div>
            <div className="border-2 border-primary-200 bg-primary-50/50 rounded-2xl p-6">
              <div className="flex items-center gap-2 text-primary-700 font-semibold mb-4">
                <CheckCircle2 className="w-5 h-5" /> MindFlow 出活
              </div>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" /> <strong>30 秒</strong> 拿到结构化笔记</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" /> AI 标出<strong>必考点、易错点</strong></li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" /> <strong>8-15 张</strong>记忆卡片,自动复习</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" /> AI 追问 3 秒答,<strong>不再翻书</strong></li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" /> 边学边复习,考前不慌</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 创始人自述(只有真的,没有编的) ===== */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-sm text-primary-300 font-semibold mb-3 uppercase tracking-wide">为什么做 MindFlow</p>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 leading-relaxed">
            "我自己期末周被 PPT 淹过,所以做了这个工具。"
          </h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            老板做过 300 家零售门店,深知"重复劳动"是最大的效率杀手。
            学生党的"抄笔记"和店长的"贴标签"本质一样 — 90% 时间花在整理,只剩 10% 给真正的思考。
          </p>
          <p className="text-gray-300 leading-relaxed">
            MindFlow 不画大饼、不编数据。
            <strong className="text-white">自己用、真有用</strong>,才推荐给你。
          </p>
        </div>
      </section>

      {/* ===== 定价 ===== */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">学生也能负担的定价</h2>
            <p className="text-gray-600">免费版永久能用,付费版 <strong>7 天无理由退款</strong></p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: '免费版', price: '¥0', period: '永久免费', features: ['每月 5 份学习材料', '4 大功能全部解锁', 'AI 追问 10 次 / 月'], cta: '免费开始', hot: false },
              { name: '学期版', price: '¥39', period: '/ 月', features: ['无限资料', '全部功能', 'AI 追问 200 次 / 月', '无水印导出'], cta: '立即订阅', hot: true },
              { name: '年度版', price: '¥299', period: '/ 年(省 36%)', features: ['学期版全部权益', '优先客服', '历史资料不限量', '考前突击模式'], cta: '立即订阅', hot: false }
            ].map(p => (
              <div key={p.name} className={`p-7 rounded-2xl ${p.hot ? 'bg-primary-600 text-white ring-4 ring-primary-200 shadow-2xl scale-105' : 'bg-white border border-gray-200 shadow-sm'}`}>
                {p.hot && <div className="text-xs font-bold bg-amber-300 text-amber-900 inline-block px-2 py-0.5 rounded mb-2">🔥 最受欢迎</div>}
                <h3 className={`text-2xl font-bold mb-2 ${p.hot ? 'text-white' : 'text-gray-900'}`}>{p.name}</h3>
                <div className="mb-6">
                  <span className={`text-4xl font-extrabold ${p.hot ? 'text-white' : 'text-gray-900'}`}>{p.price}</span>
                  <span className={`text-sm ml-1 ${p.hot ? 'text-primary-100' : 'text-gray-500'}`}>{p.period}</span>
                </div>
                <ul className="space-y-2.5 mb-8 text-sm">
                  {p.features.map(f => (
                    <li key={f} className="flex gap-2">
                      <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${p.hot ? 'text-primary-200' : 'text-primary-600'}`} />
                      <span className={p.hot ? 'text-primary-50' : 'text-gray-700'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/upload" className={`block text-center py-3 rounded-lg font-semibold ${p.hot ? 'bg-white text-primary-700 hover:bg-primary-50' : 'bg-primary-600 text-white hover:bg-primary-700'}`}>
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">常见问题</h2>
            <p className="text-gray-600">还在犹豫?看看这些</p>
          </div>
          <div className="space-y-4">
            {[
              { q: '上传的资料安全吗?会不会被泄露?', a: '所有文件仅用于本次 AI 处理,处理完成后 24 小时内自动删除。我们不存储、不训练、不分享任何用户数据(详见隐私协议)。' },
              { q: '支持哪些文件类型?最大多大?', a: '支持 PPT / PPTX / PDF / Word / TXT / 图片。单文件最大 20MB。扫描版 PDF 暂不支持(需要文字版)。' },
              { q: 'AI 生成的质量怎么样?会不会胡说?', a: '基于 MiniMax M3 大模型,只基于你上传的原文生成,不会臆造数据。数学公式、英文术语、考点都按原文事实。生成不满意可重新生成。' },
              { q: '免费版和付费版差别大吗?', a: '免费版每月 5 份学习材料够轻度使用。学期版(¥39/月)适合期末 / 考研党无限刷,年度版适合长期学习者。功能完全一样,差别是额度。' },
              { q: '我能退款吗?', a: '付费后 7 天内不满意,100% 退款,无理由。发邮件到 support@mindflow.wang 即可。' }
            ].map((f, i) => (
              <details key={i} className="bg-white rounded-xl p-5 group">
                <summary className="font-semibold text-gray-900 cursor-pointer flex items-center justify-between">
                  {f.q}
                  <span className="text-primary-600 group-open:rotate-45 transition-transform text-xl">+</span>
                </summary>
                <p className="mt-3 text-gray-600 text-sm leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 底部 CTA ===== */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">还在等什么?下次期末前,先免费用 5 份</h2>
          <p className="text-primary-100 text-lg">5 分钟注册,5 份学习材料免费出 — 看完不订阅,我都替你觉得亏。</p>
          <p className="text-primary-100 mb-8 text-lg">不用注册,直接上传就用</p>
          <Link href="/upload" className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-4 rounded-xl text-lg font-bold hover:bg-primary-50 shadow-xl">
            立即开始 · 免费 5 份 <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="bg-gray-900 text-gray-400 py-10 text-sm">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Brain className="w-5 h-5 text-primary-500" />
            <span className="text-white font-bold">MindFlow</span>
          </div>
          <p>© 2026 MindFlow · 让知识主动适应你</p>
          <p className="mt-2 text-xs text-gray-500">v0.1.0 MVP · 由 MiniMax-M3 模型驱动 · 客服:<a href="mailto:support@mindflow.wang" className="hover:text-white underline">support@mindflow.wang</a></p>
          <div className="mt-4 flex items-center justify-center gap-4 text-xs flex-wrap">
            <Link href="/privacy" className="hover:text-white">隐私政策</Link>
            <span className="text-gray-600">·</span>
            <Link href="/terms" className="hover:text-white">服务条款</Link>
            <span className="text-gray-600">·</span>
            <Link href="/disclaimer" className="hover:text-white">AI 免责声明</Link>
            <span className="text-gray-600">·</span>
            <Link href="/acceptable-use" className="hover:text-white">可接受使用政策 (AUP)</Link>
            <span className="text-gray-600">·</span>
            <a href="https://creem.io/portal" target="_blank" rel="noopener noreferrer" className="hover:text-white">管理订阅 / 退订</a>
          </div>
          <p className="mt-3 text-xs text-gray-600">MindFlow 是独立产品,基于第三方大语言模型构建,与模型供应商无隶属关系。</p>
        </div>
      </footer>
    </main>
  );
}
