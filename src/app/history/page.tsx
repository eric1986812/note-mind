'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Brain, ArrowLeft, Trash2, FileText, Network, Layers, Clock, Sparkles } from 'lucide-react';
import { getHistory, deleteHistoryItem, clearHistory, relativeTime, type HistoryItem } from '@/lib/history';

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    setItems(getHistory());
  }, []);

  const onDelete = (id: string) => {
    if (!confirm('确定删除这条笔记?')) return;
    deleteHistoryItem(id);
    setItems(getHistory());
  };

  const onClear = () => {
    if (!confirmClear) { setConfirmClear(true); setTimeout(() => setConfirmClear(false), 3000); return; }
    clearHistory();
    setItems([]);
    setConfirmClear(false);
  };

  const onOpen = (item: HistoryItem) => {
    // 同步到 sessionStorage 再跳转
    sessionStorage.setItem(item.id, JSON.stringify({
      filename: item.filename,
      note: item.note,
      mindmap: item.mindmap,
      cards: item.cards
    }));
    window.location.href = `/note?id=${item.id}`;
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-500 hover:text-primary-600 flex items-center gap-1 text-sm">
              <ArrowLeft className="w-4 h-4" />返回首页
            </Link>
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-primary-600" />
              <h1 className="text-lg font-bold text-gray-900">我的笔记</h1>
            </div>
          </div>
          {items.length > 0 && (
            <button
              onClick={onClear}
              className={`text-sm px-3 py-1.5 rounded-lg flex items-center gap-1 ${confirmClear ? 'bg-red-600 text-white' : 'text-gray-500 hover:text-red-600 hover:bg-red-50'}`}
            >
              <Trash2 className="w-4 h-4" />
              {confirmClear ? '再点一次确认清空' : '清空全部'}
            </button>
          )}
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">还没有笔记</h2>
            <p className="text-gray-500 mb-6">上传一份资料,开始你的第一次学习</p>
            <Link href="/upload" className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 font-medium">
              <Sparkles className="w-4 h-4" />立即上传
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-6">
              共 <strong className="text-gray-900">{items.length}</strong> 份笔记,保留最近 30 份。数据存于你的浏览器,清除浏览器数据会丢失。
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map(item => {
                const cardCount = item.cards?.length || 0;
                const noteLen = item.note?.length || 0;
                return (
                  <div key={item.id} className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition border border-gray-100 group">
                    <div onClick={() => onOpen(item)} className="cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 truncate flex-1" title={item.filename}>
                          📄 {item.filename}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                        <Clock className="w-3 h-3" />{relativeTime(item.createdAt)}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3 text-primary-500" />
                          {noteLen > 1000 ? `${(noteLen / 1000).toFixed(1)}k 字` : `${noteLen} 字`}
                        </span>
                        <span className="flex items-center gap-1">
                          <Layers className="w-3 h-3 text-primary-500" />
                          {cardCount} 卡片
                        </span>
                        {item.mindmap && (
                          <span className="flex items-center gap-1">
                            <Network className="w-3 h-3 text-primary-500" />
                            导图
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t flex justify-between items-center">
                      <button onClick={() => onOpen(item)} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                        打开 →
                      </button>
                      <button onClick={() => onDelete(item.id)} className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition" title="删除">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
