// 导出工具: 复制 Markdown / 下载 PDF / 下载 Word
// 纯前端实现, 不依赖后端

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// 把 Markdown 转成 HTML(简单版,够用就行)
function mdToHtml(md: string): string {
  let html = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // 标题
    .replace(/^###### (.+)$/gm, '<h6>$1</h6>')
    .replace(/^##### (.+)$/gm, '<h5>$1</h5>')
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // 粗体/斜体
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // 行内代码
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // 链接
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // 水平线
    .replace(/^---+$/gm, '<hr/>')
    // 引用
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');

  // 表格(Markdown 表格语法)
  const tableRegex = /\|(.+)\|\n\|([-:|\s]+)\|\n((?:\|.+\|\n?)+)/g;
  html = html.replace(tableRegex, (_match, header: string, _align: string, body: string) => {
    const ths = header.split('|').map(s => s.trim()).filter(Boolean);
    const rows = body.trim().split('\n').map(row =>
      row.split('|').map(s => s.trim()).filter(Boolean)
    );
    return `<table style="border-collapse:collapse;width:100%;margin:12px 0;">
      <thead><tr>${ths.map(t => `<th style="border:1px solid #ddd;padding:6px 10px;background:#f0fdf4;color:#065f46;">${t}</th>`).join('')}</tr></thead>
      <tbody>${rows.map(r => `<tr>${r.map(c => `<td style="border:1px solid #ddd;padding:6px 10px;">${c}</td>`).join('')}</tr>`).join('')}</tbody>
    </table>`;
  });

  // 列表
  html = html.replace(/(?:^[-*] .+(?:\n|$))+/gm, (block) => {
    const items = block.trim().split('\n').map(l => `<li>${l.replace(/^[-*] /, '')}</li>`).join('');
    return `<ul style="margin:8px 0 8px 24px;">${items}</ul>`;
  });
  html = html.replace(/(?:^\d+\. .+(?:\n|$))+/gm, (block) => {
    const items = block.trim().split('\n').map(l => `<li>${l.replace(/^\d+\. /, '')}</li>`).join('');
    return `<ol style="margin:8px 0 8px 24px;">${items}</ol>`;
  });

  // 段落: 连续两行 \n\n 当段
  html = html
    .split(/\n\n+/)
    .map(block => {
      if (/^<(h\d|ul|ol|table|blockquote|hr|pre)/.test(block.trim())) return block;
      return `<p style="margin:6px 0;line-height:1.7;">${block.replace(/\n/g, '<br/>')}</p>`;
    })
    .join('\n');

  return html;
}

// 1. 复制 Markdown 到剪贴板
export async function copyMarkdown(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // fallback: 用 textarea 选中再 execCommand
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch {}
    document.body.removeChild(ta);
    return ok;
  }
}

// 2. 下载 Markdown 文件
export function downloadMarkdown(filename: string, content: string) {
  triggerDownload(filename + '.md', content, 'text/markdown;charset=utf-8');
}

// 3. 下载 Word 文件(.doc, 实际是 HTML)
export function downloadWord(filename: string, markdownContent: string) {
  const body = mdToHtml(markdownContent);
  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>${filename}</title>
<style>
body { font-family: "Microsoft YaHei", "PingFang SC", sans-serif; max-width: 800px; margin: 24px auto; padding: 0 16px; line-height: 1.7; color: #1f2937; }
h1 { border-bottom: 2px solid #10b981; padding-bottom: 8px; }
h2 { color: #047857; margin-top: 24px; }
h3 { color: #065f46; }
blockquote { border-left: 3px solid #10b981; background: #f0fdf4; padding: 8px 16px; margin: 12px 0; }
code { background: #f1f5f9; padding: 1px 6px; border-radius: 3px; font-family: monospace; }
</style></head><body>${body}</body></html>`;
  triggerDownload(filename + '.doc', html, 'application/msword;charset=utf-8');
}

// 4. 下载 PDF(把指定 DOM 元素截图塞进 PDF)
export async function downloadPdf(filename: string, element: HTMLElement): Promise<void> {
  // 隐藏滚动条,避免截图出现
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false
  });
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  // 分页
  let heightLeft = imgHeight;
  let position = 0;
  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pdfHeight;
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
  }
  pdf.save(filename + '.pdf');
}

function triggerDownload(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// 5. 把笔记 + 卡片打包成完整 Markdown(供复制/下载/Word)
export function buildExportMarkdown(opts: {
  filename: string;
  note: string;
  cards: { q: string; a: string }[];
  mindmap?: { label: string; children?: any[] } | null;
}): string {
  const parts: string[] = [];
  parts.push(`# ${opts.filename} - NoteMind AI 学习笔记\n`);
  parts.push(`> 生成时间: ${new Date().toLocaleString('zh-CN')}\n`);

  if (opts.note) {
    parts.push(`## 📝 文字笔记\n`);
    parts.push(opts.note);
    parts.push('');
  }

  if (opts.cards && opts.cards.length > 0) {
    parts.push(`\n## 🃏 记忆卡片 (${opts.cards.length} 张)\n`);
    opts.cards.forEach((c, i) => {
      parts.push(`### 卡片 ${i + 1}`);
      parts.push(`**Q:** ${c.q}`);
      parts.push('');
      parts.push(`**A:** ${c.a}`);
      parts.push('');
    });
  }

  if (opts.mindmap) {
    parts.push(`\n## 🧠 思维导图\n`);
    parts.push('```');
    parts.push(renderMindmapAsText(opts.mindmap, 0));
    parts.push('```');
  }

  return parts.join('\n');
}

function renderMindmapAsText(node: { label: string; children?: any[] }, depth: number): string {
  const indent = '  '.repeat(depth);
  let s = `${indent}- ${node.label}\n`;
  if (node.children) {
    for (const c of node.children) s += renderMindmapAsText(c, depth + 1);
  }
  return s;
}
