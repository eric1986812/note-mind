'use client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export default function MarkdownView({ content, compact = false }: { content: string; compact?: boolean }) {
  if (compact) {
    return (
      <div className="chat-markdown">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeKatex]}>
          {content}
        </ReactMarkdown>
      </div>
    );
  }
  return (
    <div className="prose prose-slate max-w-none
      prose-headings:font-bold prose-headings:text-gray-900
      prose-h1:text-3xl prose-h1:mt-0 prose-h1:mb-4 prose-h1:pb-3 prose-h1:border-b prose-h1:border-gray-200
      prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-3 prose-h2:text-primary-700
      prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-2 prose-h3:text-gray-800
      prose-h4:text-lg prose-h4:mt-4 prose-h4:mb-2 prose-h4:text-gray-700
      prose-p:my-3 prose-p:leading-7
      prose-strong:text-gray-900 prose-strong:font-semibold
      prose-em:text-primary-700
      prose-ul:my-3 prose-ul:list-disc prose-ul:pl-6
      prose-ol:my-3 prose-ol:list-decimal prose-ol:pl-6
      prose-li:my-1
      prose-table:my-4 prose-table:w-full prose-table:border-collapse
      prose-th:bg-primary-50 prose-th:text-primary-800 prose-th:font-semibold prose-th:p-3 prose-th:border prose-th:border-gray-300
      prose-td:p-3 prose-td:border prose-td:border-gray-300
      prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
      prose-pre:bg-gray-900 prose-pre:text-gray-100
      prose-blockquote:border-l-4 prose-blockquote:border-primary-400 prose-blockquote:bg-primary-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:not-italic
    ">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeKatex]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
