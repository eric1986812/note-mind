'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Brain, ArrowLeft, Sparkles, AlertCircle } from 'lucide-react';
import Link from 'next/link';

type SharedData = {
  f: string;  // filename
  n: string;  // note
  m?: any;    // mindmap
  c?: any[];  // cards
};

function SharePageInner() {
  const params = useSearchParams();
  const router = useRouter();
  const [data, setData] = useState<SharedData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const encoded = params.get('d');
    if (!encoded) { setError('链接无效,缺少数据。'); return; }
    try {
      const json = decodeURIComponent(escape(atob(encoded)));
      const parsed = JSON.parse(json);
      setData(parsed);
    } catch (e: any) {
      setError('链接解析失败,可能已损坏。' + e.message);
    }
  }, [params]);

  const onUseAsMyOwn = () => {
    if (!data) return;
    // 把分享内容写进 sessionStorage + localStorage,然后跳到 /note
    const id = `note_share_${Date.now()}`;
    const payload = {
      filename: data.f,
      note: data.n,
      mindmap: data.m ?? null,
      cards: data.c ?? []
    };
    try {
      sessionStorage.setItem(id, JSON.stringify(payload));
      router.push(`/note?id=${id}`);
    } catch (e: any) {
      alert('打开失败: ' + e.message);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <Link href="/" className="text-gray-500 hover:text-primary-600">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Brain className="w-6 h-6 text-primary-600" />
          <h1 className="text-lg font-bold text-gray-900">分享的笔记</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
            <p className="text-yellow-800 text-lg mb-4">{error}</p>
            <Link href="/upload" className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">
              上传自己的资料
            </Link>
          </div>
        )}

        {data && (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b">
              <div>
                <div className="text-sm text-primary-600 font-medium mb-1">📄 分享资料</div>
                <h2 className="text-2xl font-bold text-gray-900">{data.f}</h2>
              </div>
              <button
                onClick={onUseAsMyOwn}
                className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 text-sm font-medium"
              >
                <Sparkles className="w-4 h-4" />
                在我这里继续编辑
              </button>
            </div>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed text-sm">{data.n}</pre>
            </div>
            {data.c && data.c.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-sm font-bold text-gray-700 mb-3">🃏 包含 {data.c.length} 张记忆卡片</h3>
                <p className="text-xs text-gray-500">点击"在我这里继续编辑"以获得完整功能(导图、卡片复习、AI 追问、导出)</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default function SharePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">加载中...</div>}>
      <SharePageInner />
    </Suspense>
  );
}
