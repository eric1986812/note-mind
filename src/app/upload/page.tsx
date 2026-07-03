'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Loader2, Sparkles, Check, FileText, Network, Layers, Save } from 'lucide-react';
import { saveNoteToHistory } from '@/lib/history';
import { splitIntoChunks } from '@/lib/splitter';

type ChunkMeta = { index: number; title: string; content: string };
type TaskState = 'pending' | 'active' | 'done';

type Task = {
  key: string;
  icon: any;
  label: string;
  state: TaskState;
  // 模拟进度 0-100
  progress: number;
};

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const [tasks, setTasks] = useState<Task[]>([
    { key: 'parse', icon: FileText, label: '解析文件', state: 'pending', progress: 0 },
    { key: 'ai', icon: Sparkles, label: 'AI 生成(并发)', state: 'pending', progress: 0 },
    { key: 'save', icon: Save, label: '保存笔记', state: 'pending', progress: 0 }
  ]);
  const [overallPercent, setOverallPercent] = useState(0);
  const [chunks, setChunks] = useState<ChunkMeta[] | null>(null);
  const [selectedChunks, setSelectedChunks] = useState<Set<number>>(new Set());
  const startTimeRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  // 进度条动画: 模拟 0-95% 跑动 (卡在 95% 等真完成)
  useEffect(() => {
    if (!uploading) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }
    startTimeRef.current = Date.now();
    const tick = () => {
      const dt = (Date.now() - startTimeRef.current) / 1000;
      setElapsed(Math.floor(dt));
      setTasks(prev => prev.map(t => {
        if (t.state === 'done') return { ...t, progress: 100 };
        if (t.state === 'active') {
          // 模拟进度: 0-95% 渐近, 但卡在 95 等真完成
          // 实际并发 AI 通常 18-25s, 让进度条"看起来在动"
          let target = 0;
          if (t.key === 'parse') target = Math.min(95, dt * 30); // 0-3s 跑满
          else if (t.key === 'ai') target = Math.min(95, dt * 4); // 25s 跑满
          else if (t.key === 'save') target = Math.min(95, dt * 50);
          return { ...t, progress: target };
        }
        return t;
      }));
      // 总进度: parse 5% + ai 90% + save 5%
      const total = (() => {
        const t = Math.min(95, dt * 3.8); // ~25s 跑满 95%
        return Math.floor(t);
      })();
      setOverallPercent(total);
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [uploading]);

  const setTaskState = (key: string, state: TaskState) => {
    setTasks(prev => prev.map(t => t.key === key ? { ...t, state, progress: state === 'done' ? 100 : t.progress } : t));
  };

  const resetChunks = () => {
    setChunks(null);
    setSelectedChunks(new Set());
  };

  const onUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgressText('正在解析文件...');
    setTaskState('parse', 'active');

    try {
      // 1) 解析文件
      const form = new FormData();
      form.append('file', file);
      const parseRes = await fetch('/api/parse', { method: 'POST', body: form });
      const parseData = await parseRes.json();
      if (!parseRes.ok) throw new Error(parseData.error || '解析失败');
      setTaskState('parse', 'done');

      // 2) 长文 (>2500 字) 切章节让用户选
      if (parseData.text.length > 2500) {
        const split = splitIntoChunks(parseData.text);
        if (split.length >= 2) {
          setChunks(split);
          setSelectedChunks(new Set(split.map(c => c.index)));
          setUploading(false);
          setProgressText('');
          return;
        }
      }

      // 短文直接全量生成
      await runGeneration(file.name, parseData.text);
    } catch (e: any) {
      alert('出错了: ' + e.message);
      setUploading(false);
      setProgressText('');
      setTasks(prev => prev.map(t => ({ ...t, state: 'pending' as TaskState, progress: 0 })));
    }
  };

  const runGeneration = async (filename: string, text: string) => {
    setUploading(true);
    setProgressText('AI 正在同时生成笔记 / 导图 / 卡片...');
    setTaskState('ai', 'active');
    try {
      const t0 = Date.now();
      const [noteRes, mindmapRes, cardRes] = await Promise.all([
        fetch('/api/note', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, filename })
        }),
        fetch('/api/mindmap', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text })
        }),
        fetch('/api/flashcards', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text })
        })
      ]);
      const [noteData, mindmapData, cardData] = await Promise.all([
        noteRes.json(), mindmapRes.json(), cardRes.json()
      ]);
      const dt = ((Date.now() - t0) / 1000).toFixed(1);
      console.log(`3 个 AI 任务并发完成, 总耗时 ${dt}s`);

      if (!noteRes.ok) throw new Error(noteData.error || '笔记生成失败');
      setTaskState('ai', 'done');

      const id = `note_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      setTaskState('save', 'active');
      const notePayload = {
        filename,
        note: noteData.note,
        mindmap: mindmapData.mindmap,
        cards: cardData.cards
      };
      try {
        sessionStorage.setItem(id, JSON.stringify(notePayload));
        saveNoteToHistory({
          id,
          filename: notePayload.filename,
          note: notePayload.note,
          mindmap: notePayload.mindmap,
          cards: notePayload.cards,
          createdAt: Date.now()
        });
      } catch (e: any) {
        alert('存储失败: ' + e.message);
        setUploading(false);
        setProgressText('');
        return;
      }
      setTaskState('save', 'done');
      setOverallPercent(100);
      router.push(`/note?id=${id}`);
    } catch (e: any) {
      alert('出错了: ' + e.message);
      setUploading(false);
      setProgressText('');
    }
  };

  // 用户确认选完章节后
  const onConfirmChunks = async () => {
    if (!chunks || selectedChunks.size === 0) {
      alert('请至少选择一个章节');
      return;
    }
    const selectedText = chunks
      .filter(c => selectedChunks.has(c.index))
      .map(c => `## ${c.title}\n\n${c.content}`)
      .join('\n\n');
    const originalName = file?.name || '资料';
    setChunks(null);
    setUploading(true);
    setTaskState('ai', 'active');
    await runGeneration(originalName, selectedText);
  };

  // 预估剩余时间(简单线性: 100% 跑完需要 28s, 所以剩余 = 28 - elapsed)
  const estimatedTotal = 28;
  const remaining = Math.max(0, estimatedTotal - elapsed);

  // 实际生成 (短文 / 用户确认章节后)
  // 优化: 3 个 API 并发, 总耗时 = max(各自耗时) 而不是 sum
  // (已合并到上面的 runGeneration)

  const toggleChunk = (idx: number) => {
    const next = new Set(selectedChunks);
    if (next.has(idx)) next.delete(idx); else next.add(idx);
    setSelectedChunks(next);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">上传你的学习资料</h1>
          <p className="text-gray-600 mb-8">支持 PPT、PDF、Word、<strong>图片拍照/截图</strong>。最大 20MB。</p>

        {/* 上传框 */}
        {!chunks && (
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <label className="block">
              <div className="border-2 border-dashed border-primary-300 rounded-xl p-12 text-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition">
                <Upload className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <p className="text-gray-700 font-medium mb-1">{file ? file.name : '点击或拖拽文件到这里'}</p>
                <p className="text-sm text-gray-500">支持 PPT / PDF / Word / 图片拍照 / 截图</p>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,.md,.jpg,.jpeg,.png"
                  onChange={e => { setFile(e.target.files?.[0] || null); }}
                />
              </div>
            </label>

            {file && !uploading && (
              <div className="mt-4 p-4 bg-primary-50 rounded-lg text-sm text-primary-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>已选择: {file.name} ({(file.size / 1024).toFixed(0)} KB)</span>
              </div>
            )}

            <button
              onClick={onUpload}
              disabled={!file || uploading}
              className="w-full mt-6 bg-primary-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {uploading ? (
                <><Loader2 className="w-5 h-5 animate-spin" />{progressText}</>
              ) : (
                <><Sparkles className="w-5 h-5" />开始 AI 处理</>
              )}
            </button>

            {uploading && (
              <div className="mt-6">
                {/* 总进度条 */}
                <div className="flex items-center justify-between mb-2 text-sm">
                  <span className="text-gray-700 font-medium">⏳ AI 正在学习这份资料</span>
                  <span className="text-primary-600 font-bold">{overallPercent}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-primary-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${overallPercent}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1.5">
                  已用 {elapsed}s · 预计还需 ~{remaining}s
                </p>

                {/* 分步状态 */}
                <div className="mt-5 space-y-2">
                  {tasks.map(t => (
                    <div key={t.key} className="flex items-center gap-2 text-sm">
                      <div className="w-5 flex-shrink-0">
                        {t.state === 'done' ? <Check className="w-4 h-4 text-primary-600" /> :
                         t.state === 'active' ? <Loader2 className="w-4 h-4 animate-spin text-amber-600" /> :
                         <span className="w-4 h-4 rounded-full border-2 border-gray-300 block" />}
                      </div>
                      <t.icon className={`w-4 h-4 flex-shrink-0 ${t.state === 'pending' ? 'text-gray-300' : 'text-primary-600'}`} />
                      <span className={`flex-1 ${t.state === 'pending' ? 'text-gray-400' : t.state === 'done' ? 'text-primary-700' : 'text-gray-800 font-medium'}`}>
                        {t.label}
                      </span>
                      <span className={`text-xs tabular-nums ${t.state === 'pending' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {Math.floor(t.progress)}%
                      </span>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-gray-400 mt-4 text-center">
                  💡 3 个 AI 任务并发执行,通常 20-30 秒完成
                </p>
              </div>
            )}
          </div>
        )}

        {/* 章节选择 UI */}
        {chunks && (
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">📑 选择要生成的章节</h2>
              <span className="text-sm text-gray-500">共 {chunks.length} 章, 已选 {selectedChunks.size}</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              AI 已自动识别文档结构(标题/章节),可只生成需要的部分,避免内容过载。默认全选。
            </p>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {chunks.map(c => {
                const checked = selectedChunks.has(c.index);
                return (
                  <label key={c.index} className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition ${checked ? 'border-primary-400 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="checkbox" checked={checked} onChange={() => toggleChunk(c.index)} className="mt-1" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900">{c.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{c.content.length} 字</div>
                    </div>
                    {checked && <Check className="w-5 h-5 text-primary-600 flex-shrink-0" />}
                  </label>
                );
              })}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={resetChunks} className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                返回上传
              </button>
              <button
                onClick={onConfirmChunks}
                disabled={selectedChunks.size === 0}
                className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {uploading ? <><Loader2 className="w-4 h-4 animate-spin" />{progressText}</> : <><Sparkles className="w-4 h-4" />开始生成 (已选 {selectedChunks.size} 章)</>}
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-500">
          免费用户每月可处理 5 份资料 · 学期版用户无限
        </div>
      </div>
    </main>
  );
}
