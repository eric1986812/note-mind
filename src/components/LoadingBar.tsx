'use client';
import { useEffect, useState } from 'react';
import { Loader2, Languages, BookOpen } from 'lucide-react';

// 中英对照 / 术语 专用的进度条组件
// 模拟 0-95% 动画,完成后显示真内容
// props: loading: 布尔, finished: 是否已加载完成(隐藏loading显示内容), label: 显示文字, type: 'translate' | 'terms'

type Props = {
  loading: boolean;
  finished: boolean;
  label: string;
  type: 'translate' | 'terms';
  detail?: string;
};

export default function LoadingBar({ loading, finished, label, type, detail }: Props) {
  const [percent, setPercent] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!loading) return;
    const start = Date.now();
    const tick = () => {
      const dt = (Date.now() - start) / 1000;
      setElapsed(Math.floor(dt));
      // 翻译通常 10-20s, 术语 12-25s, 按 22s 跑满
      const target = Math.min(95, dt * 4.5);
      setPercent(target);
    };
    const interval = setInterval(tick, 100);
    return () => clearInterval(interval);
  }, [loading]);

  if (finished) return null;

  const Icon = type === 'translate' ? Languages : BookOpen;
  const colorClass = type === 'translate' ? 'from-blue-500 to-blue-600' : 'from-purple-500 to-purple-600';
  const ringColor = type === 'translate' ? 'text-blue-600' : 'text-purple-600';
  const remaining = Math.max(0, 22 - elapsed);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <Icon className={`w-12 h-12 ${ringColor} mb-4 animate-pulse`} />
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{label}</h3>
      <p className="text-sm text-gray-500 mb-6">{detail || 'AI 正在思考中...'}</p>

      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="text-gray-600">⏳ 正在处理</span>
          <span className={`font-bold tabular-nums ${type === 'translate' ? 'text-blue-600' : 'text-purple-600'}`}>
            {Math.floor(percent)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className={`bg-gradient-to-r ${colorClass} h-2 rounded-full transition-all duration-200 ease-out`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          已用 {elapsed}s · 预计还需 ~{remaining}s
        </p>
      </div>

      <div className="mt-6 flex items-center gap-1.5 text-xs text-gray-400">
        <Loader2 className="w-3 h-3 animate-spin" />
        <span>请勿关闭页面</span>
      </div>
    </div>
  );
}
