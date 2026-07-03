# Vercel 部署指南

> 老板按本文档,5 分钟拿到公网链接。

## 前置准备

- [x] GitHub 账号 (老板已有)
- [x] Vercel 账号 (用 GitHub 登录即可,免注册)
- [x] MINIMAX_API_KEY (在 .env.local 里,部署时填到 Vercel)

## 第 1 步:推到 GitHub

### 1.1 在 GitHub 创建仓库
- 打开 https://github.com/new
- 仓库名填 `notemind-ai`
- 选 **Private** (私有,代码不公开)
- **不要**勾选 "Add a README" / "Add .gitignore" / "Choose a license"
- 点 **Create repository**

### 1.2 推代码
创建好后会看到一个 "push an existing repository" 的页面,把里面的命令复制下来,在项目目录跑一遍。

或者用我准备好的命令(把 `<你的用户名>` 替换成老板的 GitHub 用户名):

```bash
cd /Users/macadmin/.minimax/sessions/mvs_536b958053ad42d48f5ff50ab3e0e4c4/workspace/notemind-ai
git add .
git commit -m "feat: NoteMind AI MVP"
git branch -M main
git remote add origin https://github.com/<你的用户名>/notemind-ai.git
git push -u origin main
```

如果老板没配 SSH,GitHub 推 HTTPS 会要求输入用户名密码(用 Personal Access Token)。

## 第 2 步:用 Vercel 部署

### 2.1 连接仓库
- 打开 https://vercel.com/new
- 点 **Import Git Repository** → 选刚才创建的 `notemind-ai` 仓库
- 点 **Import**

### 2.2 配置项目
- **Project Name**: 填 `note-mind` (这决定了公网域名: `note-mind.vercel.app`)
- **Framework Preset**: 选 `Next.js` (Vercel 自动识别)
- **Build Command**: 留空 (Next.js 默认 `next build`)
- **Output Directory**: 留空 (Next.js 默认 `.next`)
- **Install Command**: 留空 (默认 `npm install`)

### 2.3 配置环境变量(关键!)
在 **Environment Variables** 区域,点 **Add**,逐个添加:

| Key | Value |
|-----|-------|
| `MINIMAX_API_KEY` | 老板的 key (sk-cp-...) |
| `MINIMAX_BASE_URL` | `https://api.minimaxi.com` |
| `MINIMAX_MODEL` | `MiniMax-M3` |
| `NEXT_PUBLIC_APP_URL` | `https://note-mind.vercel.app` |

⚠️ **重要**:这些 key 只在 Vercel 服务器里,**不会**出现在 GitHub 上。

### 2.4 点 Deploy
- 点 **Deploy** 按钮
- 等待 1-3 分钟,Vercel 跑 `npm install` + `next build`
- 部署成功后会显示 🎉 动画 + 一个链接

## 第 3 步:验证

打开分配的链接(比如 `https://note-mind.vercel.app`):
- [x] 首页能打开
- [x] /upload 能上传文件
- [x] 笔记能真生成(说明 MINIMAX_API_KEY 配置对了)

## 常见问题

### Q1: 部署成功但上传文件后 500 错误
A: 检查 Vercel 环境变量里的 `MINIMAX_API_KEY` 是不是填对了(不要有多余空格)。

### Q2: Vercel 显示 "Build failed"
A: 大概率是包安装问题。点 "View Logs" 看具体报错,通常是某个 npm 包版本问题。复制报错给我,我帮老板修。

### Q3: 部署后 10s 超时
A: Vercel 免费版 10s 函数超时,M3 生成要 20-30s。老板需要:
- 升级 Vercel Pro ($20/月,60s 超时)
- 或切到更小模型 (deepseek-chat,单次 8-10s)
- 或改用流式输出 (SSE)

### Q4: 怎么更新代码
A: 老板改完代码 → `git push` → Vercel 自动重新部署(2-3 分钟)。

### Q5: 公网域名能改吗
A: Vercel Settings → Domains → 添加自己的域名 (比如 notemind.cn),需要老板有自己的域名 + 配 DNS。

## 部署后下一步

部署成功拿到公网链接后,接入微信支付:
1. 老板去 微信支付商户平台 → 产品中心 → 开发配置
2. JSAPI 支付授权目录 → 添加 `https://note-mind.vercel.app/`
3. 设置 APIv3 密钥
4. 把商户号 + 密钥 + AppID 告诉我,我写支付集成代码
