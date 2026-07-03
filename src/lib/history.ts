// 学习历史: localStorage 存最近 30 份笔记
// 纯前端,不依赖数据库,刷新 / 关浏览器都在

const KEY = 'notemind_history_v1';
const MAX_ITEMS = 30;

export type HistoryItem = {
  id: string;
  filename: string;
  note: string;
  mindmap: { label: string; children?: any[] } | null;
  cards: { q: string; a: string }[];
  createdAt: number;
};

export function saveNoteToHistory(item: HistoryItem): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getHistory();
    // 同 id 去重
    const filtered = list.filter(x => x.id !== item.id);
    filtered.unshift(item);
    const trimmed = filtered.slice(0, MAX_ITEMS);
    localStorage.setItem(KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.error('saveNoteToHistory 失败:', e);
  }
}

export function getHistory(): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr.filter(x => x && x.id && x.filename);
  } catch {
    return [];
  }
}

export function deleteHistoryItem(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getHistory().filter(x => x.id !== id);
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {}
}

export function clearHistory(): void {
  if (typeof window === 'undefined') return;
  try { localStorage.removeItem(KEY); } catch {}
}

// 时间格式化(相对时间)
export function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60_000) return '刚刚';
  if (diff < 3600_000) return `${Math.floor(diff / 60_000)} 分钟前`;
  if (diff < 86400_000) return `${Math.floor(diff / 3600_000)} 小时前`;
  if (diff < 7 * 86400_000) return `${Math.floor(diff / 86400_000)} 天前`;
  const d = new Date(ts);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}
