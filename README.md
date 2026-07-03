# NoteMind AI

> 上传 1 份课堂 PPT,30 秒拿到 4 件套学习资料(结构化笔记 + 思维导图 + 记忆卡片 + AI 追问)

专为中国大学生 / 考研党 / 海外留学生设计的 AI 学习工具。

## 功能

- **文字笔记** - AI 自动提取核心概念 / 考点 / 对比表 / 公式 / 易错点
- **思维导图** - 可缩放/拖拽的可视化导图,自动紧凑布局,4 色节点
- **记忆卡片** - 翻转动画 + 间隔重复算法
- **AI 追问** - 基于资料上下文回答问题
- **中英对照** - 自动检测语言,中→英 或 英→中
- **术语表** - 自动提取学科专业术语 + 释义
- **学习历史** - localStorage 存最近 30 份笔记
- **导出** - 复制 / .md / .doc / .pdf 4 种格式
- **分享** - 一键生成分享链接

## 技术栈

- **前端**: Next.js 14 (App Router) + TypeScript + TailwindCSS
- **UI**: react-markdown + remark-gfm + rehype-katex
- **可视化**: @xyflow/react (思维导图) + dagre (自动布局)
- **后端**: Next.js API Routes (Serverless)
- **AI**: MiniMax M3 (主力) + DeepSeek (备选)
- **解析**: unpdf (PDF) + mammoth (Word) + jszip (PPTX)

## 本地开发

```bash
npm install
cp env.example .env.local  # 填入 MINIMAX_API_KEY
npm run dev
```

## 部署到 Vercel

详见 [DEPLOY.md](./DEPLOY.md)

## License

MIT
