'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FileText, Network, Layers, MessageCircle, Send, Loader2, Download, Copy, FileType, Check, BookOpen, Languages, Search, Share2, Link as LinkIcon } from 'lucide-react';
import MindmapView from '@/components/MindmapView';
import MarkdownView from '@/components/MarkdownView';
import LoadingBar from '@/components/LoadingBar';
import { copyMarkdown, downloadMarkdown, downloadWord, downloadPdf, buildExportMarkdown } from '@/lib/export';
import { saveNoteToHistory } from '@/lib/history';
import { detectLanguage, type Lang } from '@/lib/lang';

type Flashcard = { q: string; a: string };
type MindNode = { label: string; children?: MindNode[] };
type Term = { term: string; translation: string; definition: string };

function NotePageInner() {
  const params = useSearchParams();
  const id = params.get('id');

  // 从 sessionStorage 读数据(避免 URL 过长触发 431)
  const [data, setData] = useState<{
    filename: string; note: string; mindmap: MindNode | null; cards: Flashcard[]; raw: string;
  } | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) { setLoadError('缺少数据 ID,请返回重新上传。'); return; }
    try {
      const raw = sessionStorage.getItem(id);
      if (!raw) { setLoadError('数据已失效(可能刷新过页面),请返回重新上传。'); return; }
      const parsed = JSON.parse(raw);
      setData({
        filename: parsed.filename || '未命名资料',
        note: parsed.note || '',
        mindmap: parsed.mindmap ?? null,
        cards: Array.isArray(parsed.cards) ? parsed.cards : [],
        raw: parsed.raw || parsed.note || ''
      });
    } catch (e: any) {
      setLoadError('数据读取失败: ' + e.message);
    }
  }, [id]);

  const filename = data?.filename || '加载中...';
  const note = data?.note || '';
  const mindmap = data?.mindmap ?? null;
  const cards = data?.cards || [];

  const [tab, setTab] = useState<'note' | 'mindmap' | 'card' | 'bilingual' | 'chat'>('note');
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [copyState, setCopyState] = useState<'idle' | 'ok' | 'fail'>('idle');
  const [pdfLoading, setPdfLoading] = useState(false);
  const [shareState, setShareState] = useState<'idle' | 'ok' | 'fail'>('idle');
  const noteRef = useRef<HTMLDivElement>(null);

  // 翻译 + 术语(懒加载)
  const [translation, setTranslation] = useState<string | null>(null);
  const [translationLoading, setTranslationLoading] = useState(false);
  const [terms, setTerms] = useState<Term[] | null>(null);
  const [termsLoading, setTermsLoading] = useState(false);

  // 自动检测语言(用原文)
  const detectedLang: Lang = data?.raw ? detectLanguage(data.raw) : 'en';
  const targetLang: 'zh' | 'en' = detectedLang === 'zh' ? 'en' : 'zh';
  const bilingualLabel = detectedLang === 'zh' ? '中→英' : detectedLang === 'en' ? '英→中' : '对照';

  const loadTranslation = async () => {
    if (translation || translationLoading || !data?.raw) return;
    setTranslationLoading(true);
    try {
      const r = await fetch('/api/translate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: data.raw, targetLang })
      });
      const d = await r.json();
      if (r.ok) setTranslation(d.translation);
    } catch {}
    setTranslationLoading(false);
  };

  const loadTerms = async () => {
    if (terms || termsLoading || !data?.raw) return;
    setTermsLoading(true);
    try {
      const r = await fetch('/api/terms', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: data.raw })
      });
      const d = await r.json();
      if (r.ok) setTerms(d.terms || []);
    } catch {}
    setTermsLoading(false);
  };

  const onTabChange = (newTab: typeof tab) => {
    setTab(newTab);
    if (newTab === 'bilingual') loadTranslation();
  };

  const onShare = async () => {
    // 简化:直接分享主页,避免长 URL 在 IM 截断 / atob 报错
    const url = process.env.NEXT_PUBLIC_APP_URL || 'https://mindflow.wang';
    let ok = false;
    try {
      await navigator.clipboard.writeText(url);
      ok = true;
    } catch {
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      try { ok = document.execCommand('copy'); } catch {}
      document.body.removeChild(ta);
    }
    setShareState(ok ? 'ok' : 'fail');
    setTimeout(() => setShareState('idle'), 3000);
  };

  // 笔记加载完后自动存进历史
  useEffect(() => {
    if (data && data.filename) {
      saveNoteToHistory({
        id: id || 'unknown',
        filename: data.filename,
        note: data.note,
        mindmap: data.mindmap,
        cards: data.cards,
        createdAt: Date.now()
      });
    }
  }, [data?.filename]); // eslint-disable-line react-hooks/exhaustive-deps

  const exportMd = buildExportMarkdown({
    filename: filename,
    note: note,
    cards: cards,
    mindmap: mindmap
  });

  const onCopy = async () => {
    const ok = await copyMarkdown(exportMd);
    if (ok) {
      setCopyState('ok');
    } else {
      setCopyState('fail');
    }
    setTimeout(() => setCopyState('idle'), 2500);
  };

  const onDownloadMd = () => {
    downloadMarkdown(filename.replace(/\.[^.]+$/, ''), exportMd);
    setExportOpen(false);
  };

  const onDownloadWord = () => {
    downloadWord(filename.replace(/\.[^.]+$/, ''), exportMd);
    setExportOpen(false);
  };

  const onDownloadPdf = async () => {
    if (!noteRef.current) return;
    setPdfLoading(true);
    try {
      await downloadPdf(filename.replace(/\.[^.]+$/, ''), noteRef.current);
    } catch (e: any) {
      alert('PDF 导出失败: ' + e.message);
    }
    setPdfLoading(false);
    setExportOpen(false);
  };

  const onAsk = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(h => [...h, { role: 'user', content: userMsg }]);
    setChatLoading(true);

    // 前端再重试 1 次(后端已重试 3 次,这里兜底防止 Vercel 冷启动)
    let lastError = '';
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: userMsg, context: note })
        });
        const data = await res.json();
        if (!res.ok) {
          lastError = data.error || `HTTP ${res.status}`;
          if (attempt === 0 && /529|overloaded|rate_limit|服务繁忙/i.test(lastError)) {
            await new Promise(r => setTimeout(r, 3000));
            continue;
          }
          break;
        }
        setChatHistory(h => [...h, { role: 'ai', content: data.answer }]);
        setChatLoading(false);
        return;
      } catch (e: any) {
        lastError = e.message || '网络错';
        if (attempt === 0) {
          await new Promise(r => setTimeout(r, 2000));
          continue;
        }
        break;
      }
    }

    const isOverloaded = /529|overloaded|rate_limit|服务繁忙|网络|timeout|ETIMEDOUT|ENOTFOUND/i.test(lastError);
    const aiMsg = isOverloaded
      ? '😅 服务器正在高峰期繁忙,后端已重试 3 次。可以稍等 1-2 分钟再问我一次。\n\n技术细节: ' + lastError.slice(0, 100)
      : '出错了: ' + lastError;
    setChatHistory(h => [...h, { role: 'ai', content: aiMsg }]);
    setChatLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900 truncate">📄 {filename}</h1>
          {data && (
            <div className="flex items-center gap-2">
              <button
                onClick={onShare}
                className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:border-primary-300 hover:text-primary-700 text-sm font-medium"
                title="生成分享链接,发给同学"
              >
                {shareState === 'ok' ? <Check className="w-4 h-4 text-green-600" /> :
                 shareState === 'fail' ? <LinkIcon className="w-4 h-4 text-red-500" /> :
                 <Share2 className="w-4 h-4" />}
                {shareState === 'ok' ? '已复制主页' : shareState === 'fail' ? '复制失败' : '分享主页'}
              </button>
              <div className="relative">
              <button
                onClick={() => setExportOpen(!exportOpen)}
                className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                导出笔记
              </button>
                {exportOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl w-56 z-20 overflow-hidden">
                  <button onClick={onCopy} className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2 text-sm">
                    {copyState === 'ok' ? <Check className="w-4 h-4 text-green-600" /> :
                     copyState === 'fail' ? <span className="w-4 h-4 text-red-500">✕</span> :
                     <Copy className="w-4 h-4 text-gray-500" />}
                    {copyState === 'ok' ? '已复制到剪贴板 ✓' :
                     copyState === 'fail' ? '复制失败,试试用 .md 下载' :
                     '复制为 Markdown'}
                  </button>
                  <button onClick={onDownloadMd} className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2 text-sm">
                    <Download className="w-4 h-4 text-gray-500" />下载 .md 文件
                  </button>
                  <button onClick={onDownloadWord} className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2 text-sm">
                    <FileType className="w-4 h-4 text-gray-500" />下载 Word (.doc)
                  </button>
                  <button onClick={onDownloadPdf} disabled={pdfLoading} className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2 text-sm border-t disabled:opacity-50">
                    <Download className="w-4 h-4 text-gray-500" />
                    {pdfLoading ? '生成 PDF 中...' : '下载 PDF (当前页)'}
                  </button>
                </div>
              )}
              </div>
            </div>
          )}
        </div>
      </header>

      {loadError && (
        <div className="max-w-2xl mx-auto mt-12 p-8 bg-yellow-50 border border-yellow-200 rounded-xl text-center">
          <p className="text-yellow-800 text-lg mb-4">⚠️ {loadError}</p>
          <a href="/upload" className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">
            返回上传
          </a>
        </div>
      )}

      {/* Tabs - 4 大核心 + 1 翻译(中英对照合并术语表) */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 flex gap-1">
          {[
            { k: 'note', icon: FileText, label: '文字笔记', primary: true },
            { k: 'mindmap', icon: Network, label: '思维导图', primary: true },
            { k: 'card', icon: Layers, label: `记忆卡片 (${cards.length})`, primary: true },
            { k: 'chat', icon: MessageCircle, label: 'AI 追问', primary: true },
            { k: 'bilingual', icon: Languages, label: bilingualLabel, primary: false },
          ].map(t => (
            <button
              key={t.k}
              onClick={() => onTabChange(t.k as any)}
              className={`px-3 py-3 font-medium text-sm flex items-center gap-1.5 border-b-2 ${tab === t.k ? 'border-primary-600 text-primary-700' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
            >
              <t.icon className="w-4 h-4" /><span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {tab === 'note' && (
          <article ref={noteRef} className="bg-white p-8 md:p-10 rounded-xl shadow-sm">
            <MarkdownView content={note} />
          </article>
        )}

        {tab === 'mindmap' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {mindmap ? <MindmapView data={mindmap} /> : (
              <div className="p-8 text-gray-500 text-center">
                暂无导图数据。请检查后端 /api/mindmap 返回是否为 JSON 树结构。
              </div>
            )}
          </div>
        )}

        {tab === 'card' && (
          <div className="grid md:grid-cols-2 gap-4">
            {cards.map((c, i) => <FlashcardItem key={i} card={c} />)}
            {cards.length === 0 && <p className="text-gray-500 col-span-2 text-center py-8">暂无记忆卡片</p>}
          </div>
        )}

        {tab === 'bilingual' && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wide">
                  📄 原文 {detectedLang === 'zh' ? '🇨🇳' : detectedLang === 'en' ? '🇬🇧' : ''} ({data?.raw?.length || 0} 字)
                </h3>
                {data?.raw ? (
                  <div className="prose prose-sm max-w-none max-h-[600px] overflow-y-auto pr-2">
                    <MarkdownView content={data.raw} />
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">暂无原文</p>
                )}
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-sm font-bold text-primary-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                  🌐 译文 {targetLang === 'zh' ? '🇨🇳' : '🇬🇧'}
                  {translationLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                </h3>
                {!translation && !translationLoading && (
                  <p className="text-gray-400 text-sm py-12 text-center">切换到本 Tab 后自动开始翻译</p>
                )}
                {translationLoading && (
                  <LoadingBar
                    loading={translationLoading}
                    finished={!!translation}
                    label={detectedLang === 'zh' ? '正在翻译为英文...' : '正在翻译为中文...'}
                    type="translate"
                    detail="AI 正在逐段理解并翻译,通常 10-20 秒"
                  />
                )}
                {translation && (
                  <div className="prose prose-sm max-w-none max-h-[600px] overflow-y-auto pr-2">
                    <MarkdownView content={translation} />
                  </div>
                )}
              </div>
            </div>
            {/* 术语表 - 内嵌在中英对照 Tab 里 */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  📖 关键术语表
                  {termsLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                </h3>
                {terms && <span className="text-sm text-gray-500">共 {terms.length} 个术语</span>}
              </div>
              {termsLoading && !terms && (
                <LoadingBar
                  loading={termsLoading}
                  finished={!!terms}
                  label="正在提取关键术语..."
                  type="terms"
                  detail="AI 正在识别学术 / 学科核心术语,通常 12-25 秒"
                />
              )}
              {terms && terms.length > 0 && (
                <div className="grid md:grid-cols-2 gap-3">
                  {terms.map((t, i) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-3 hover:border-primary-300 transition">
                      <div className="font-bold text-gray-900">{t.term}</div>
                      <div className="text-sm text-gray-600 mt-1">{t.definition}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'chat' && (
          <div className="bg-white rounded-xl shadow-sm flex flex-col h-[600px]">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {chatHistory.length === 0 && (
                <p className="text-gray-500 text-center py-12">💡 对这份资料的任何内容提问，比如"第三章的核心观点是什么？"</p>
              )}
              {chatHistory.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-4 py-3 rounded-2xl ${m.role === 'user' ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 shadow-sm text-gray-900'}`}>
                    {m.role === 'user' ? (
                      <div className="whitespace-pre-wrap leading-relaxed text-sm">{m.content}</div>
                    ) : (
                      <MarkdownView content={m.content} compact />
                    )}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-4 py-3 rounded-2xl flex items-center gap-2 text-gray-600">
                    <Loader2 className="w-4 h-4 animate-spin" />AI 正在思考...
                  </div>
                </div>
              )}
            </div>
            <div className="border-t p-4 flex gap-2">
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && onAsk()}
                placeholder="对这份资料提问..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button onClick={onAsk} disabled={chatLoading} className="bg-primary-600 text-white px-5 py-2 rounded-lg hover:bg-primary-700 disabled:bg-gray-300">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function FlashcardItem({ card }: { card: Flashcard }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div onClick={() => setFlipped(!flipped)} className="cursor-pointer h-48 perspective">
      <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${flipped ? 'rotate-y-180' : ''}`}>
        <div className="absolute inset-0 bg-white border-2 border-primary-200 rounded-xl p-6 flex items-center justify-center text-center backface-hidden">
          <p className="text-gray-900 font-medium">{card.q}</p>
          <span className="absolute bottom-2 right-3 text-xs text-gray-400">点击看答案</span>
        </div>
        <div className="absolute inset-0 bg-primary-600 text-white rounded-xl p-6 flex items-center justify-center text-center backface-hidden rotate-y-180">
          <p>{card.a}</p>
        </div>
      </div>
    </div>
  );
}

export default function NotePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">加载中...</div>}>
      <NotePageInner />
    </Suspense>
  );
}
