import { NextRequest, NextResponse } from 'next/server';
import { splitIntoChunks } from '@/lib/splitter';

export const runtime = 'nodejs';
export const maxDuration = 15;

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text) return NextResponse.json({ error: '文本为空' }, { status: 400 });
    const chunks = splitIntoChunks(text);
    return NextResponse.json({
      chunks: chunks.map(c => ({ index: c.index, title: c.title, length: c.content.length }))
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
