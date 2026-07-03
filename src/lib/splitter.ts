// 把长文按章节 / 标题切分
// 支持: Markdown 标题 (# / ## / ###)、PPT 风格的 [Slide N]、纯文本"第N章/节"、空白段

export type Chunk = {
  index: number;
  title: string;
  content: string;
};

export function splitIntoChunks(text: string): Chunk[] {
  const lines = text.split('\n');
  const chunks: { title: string; lines: string[] }[] = [];
  let current: { title: string; lines: string[] } = { title: '开头', lines: [] };
  let hasContent = false;

  for (const line of lines) {
    const trimmed = line.trim();
    // 1) Markdown 标题
    const md = trimmed.match(/^(#{1,4})\s+(.+)$/);
    if (md) {
      if (hasContent || current.lines.length > 0) chunks.push(current);
      current = { title: md[2].slice(0, 40), lines: [] };
      hasContent = true;
      continue;
    }
    // 2) PPT 风格 [Slide N]
    const slide = trimmed.match(/^\[Slide\s*(\d+)\]/i);
    if (slide) {
      if (hasContent || current.lines.length > 0) chunks.push(current);
      current = { title: `Slide ${slide[1]}`, lines: [line] };
      hasContent = true;
      continue;
    }
    // 3) "第N章 / 第N节"
    const cn = trimmed.match(/^第[一二三四五六七八九十百\d]+(章|节|部分|篇)/);
    if (cn) {
      if (hasContent || current.lines.length > 0) chunks.push(current);
      current = { title: trimmed.slice(0, 30), lines: [line] };
      hasContent = true;
      continue;
    }
    // 4) 罗马数字 / 数字开头 (1. / 一、)
    const ord = trimmed.match(/^([一二三四五六七八九十]+、|\d+[\.\、])\s*\S/);
    if (ord && current.lines.length > 3) {
      // 已经有内容时,新章节
      chunks.push(current);
      current = { title: trimmed.slice(0, 30), lines: [line] };
      hasContent = true;
      continue;
    }
    current.lines.push(line);
  }
  if (current.lines.length > 0) chunks.push(current);

  // 限制章节数:超过 8 章就按字数平均切
  if (chunks.length > 8) {
    return equalCharSplit(text, 8);
  }
  if (chunks.length === 0) {
    return [{ index: 0, title: '全文', content: text }];
  }

  return chunks.map((c, i) => ({
    index: i,
    title: c.title,
    content: c.lines.join('\n').trim()
  })).filter(c => c.content.length > 0);
}

// 平均按字符数切
function equalCharSplit(text: string, parts: number): Chunk[] {
  const chunkSize = Math.ceil(text.length / parts);
  const chunks: Chunk[] = [];
  for (let i = 0; i < parts; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, text.length);
    if (start >= text.length) break;
    // 找最近的段落边界
    let realEnd = end;
    if (end < text.length) {
      const next = text.indexOf('\n\n', end);
      if (next > 0 && next - end < 300) realEnd = next;
    }
    chunks.push({
      index: i,
      title: `第 ${i + 1} 部分`,
      content: text.slice(start, realEnd)
    });
  }
  return chunks;
}
