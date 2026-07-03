import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';

export const runtime = 'nodejs';
export const maxDuration = 30;

const MAX_SIZE = 20 * 1024 * 1024; // 20MB

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    if (!file) return NextResponse.json({ error: '未找到文件' }, { status: 400 });
    if (file.size > MAX_SIZE) return NextResponse.json({ error: '文件超过 20MB' }, { status: 413 });

    const ext = file.name.split('.').pop()?.toLowerCase();
    const buf = Buffer.from(await file.arrayBuffer());

    let text = '';
    if (ext === 'pdf') {
      // unpdf:支持 Node + Edge,API 更稳
      const { extractText, getDocumentProxy } = await import('unpdf');
      const pdf = await getDocumentProxy(new Uint8Array(buf));
      const result = await extractText(pdf, { mergePages: true });
      text = Array.isArray(result.text) ? result.text.join('\n') : (result.text as string);
    } else if (ext === 'docx' || ext === 'doc') {
      const r = await mammoth.extractRawText({ buffer: buf });
      text = r.value;
    } else if (ext === 'pptx' || ext === 'ppt') {
      // PPTX = zip 包含 slide*.xml,提取文本
      const JSZip = (await import('jszip')).default;
      const zip = await JSZip.loadAsync(buf);
      const slideFiles = Object.keys(zip.files).filter(n => n.match(/^ppt\/slides\/slide\d+\.xml$/)).sort();
      const texts: string[] = [];
      for (let i = 0; i < slideFiles.length; i++) {
        const xml = await zip.file(slideFiles[i])?.async('text');
        if (xml) {
          const plain = xml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
          if (plain) texts.push(`[Slide ${i + 1}] ${plain}`);
        }
      }
      text = texts.join('\n\n');
    } else if (['txt', 'md'].includes(ext || '')) {
      text = buf.toString('utf-8');
    } else if (['jpg', 'jpeg', 'png', 'webp'].includes(ext || '')) {
      // 图片走 M3 多模态: base64 编码后直接让模型识别
      if (!process.env.MINIMAX_API_KEY) {
        return NextResponse.json({
          text: `[图片识别需要 MINIMAX_API_KEY,当前未配置]`
        });
      }
      const b64 = buf.toString('base64');
      const mime = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;
      try {
        const r = await fetch('https://api.minimaxi.com/v1/text/chatcompletion_v2', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.MINIMAX_API_KEY}` },
          body: JSON.stringify({
            model: process.env.MINIMAX_MODEL || 'MiniMax-M3',
            messages: [
              {
                role: 'system',
                content: '你是图片文字识别助手。请仔细识别图片中所有文字(中文 / 英文 / 公式 / 数字),并按原文排版输出。如果是手写笔记,请尽量还原;如果是印刷品(教材 / PPT 截图),请完整提取所有文字。不要加任何评论或说明,只输出文字内容。'
              },
              {
                role: 'user',
                content: [
                  { type: 'text', text: '请识别这张图片中的所有文字内容,完整提取:' },
                  { type: 'image_url', image_url: { url: `data:${mime};base64,${b64}` } }
                ]
              }
            ],
            max_tokens: 4000,
            temperature: 0.1,
            stream: false,
            thinking: { type: 'disabled' }
          })
        });
        if (!r.ok) {
          const err = await r.text();
          return NextResponse.json({ error: '图片识别失败: ' + err.slice(0, 200) }, { status: 502 });
        }
        const data = await r.json();
        text = data?.choices?.[0]?.message?.content || '';
        if (!text) return NextResponse.json({ error: '图片识别返回为空' }, { status: 502 });
      } catch (e: any) {
        return NextResponse.json({ error: '图片识别异常: ' + e.message }, { status: 500 });
      }
    } else {
      return NextResponse.json({ error: `不支持的文件类型: .${ext}` }, { status: 400 });
    }

    if (!text || !text.trim()) {
      return NextResponse.json({ error: '文件解析为空,可能是扫描版 PDF 或加密文件' }, { status: 422 });
    }

    const truncated = text.length > 30000 ? text.slice(0, 30000) + '\n\n[文本过长,已截断]' : text;
    return NextResponse.json({ text: truncated, length: text.length });
  } catch (e: any) {
    console.error('parse error:', e);
    return NextResponse.json({ error: '文件解析失败: ' + (e.message || '未知错误') }, { status: 500 });
  }
}
