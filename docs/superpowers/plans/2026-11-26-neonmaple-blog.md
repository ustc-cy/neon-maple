# NeonMaple 博客实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 用 Astro 搭建「NeonMaple / 晨枫的学习之路」暗色霓虹风个人博客，包含分类/标签/归档、站内搜索、深色模式、RSS、灯箱、阅读进度条，并部署到 GitHub Pages。

**Architecture:** Astro 静态站点，内容用 MDX Content Collections（`src/content/posts/`）。全局霓虹主题用 CSS 变量 + `data-theme` 实现深/浅色切换；搜索用 Pagefind（构建时生成静态索引）；图片用 Astro 内置 `<Image>` 优化 + 自研轻量灯箱；部署走 GitHub Actions 自动构建发布到 Pages。

**Tech Stack:** Astro 5、TypeScript、@astrojs/mdx、@astrojs/rss、@astrojs/sitemap、@pagefind/astro + pagefind、Shiki（代码高亮）、纯手写 CSS（无 UI 框架）。

**环境基线（已验证）**：Node v24.14.0、npm 11.9.0、git 2.29.2；npm 走公司内网镜像 `cmc.cloudartifact.dragon.tools.hihonor.com`。
**部署目标**：仓库 `ustc-cy/neon-maple`，站点 `https://ustc-cy.github.io/neon-maple/`，因此 `astro.config` 的 `base = '/neon-maple/'`。

---

## 文件结构总览

```
├── package.json
├── astro.config.mjs
├── tsconfig.json
├── .gitignore
├── README.md
├── themes/
│   └── neon.json                 # Shiki 霓虹代码高亮主题
├── public/
│   └── favicon.svg               # 霓虹风站点图标
├── scripts/
│   └── check-content.mjs         # 内容校验脚本
├── src/
│   ├── styles/
│   │   └── global.css            # 霓虹主题全局样式（CSS 变量 + 深/浅色）
│   ├── content/
│   │   ├── config.ts             # 内容集合 schema
│   │   └── posts/                # MDX 文章
│   ├── assets/
│   │   └── images/               # 文章图片（按分类归档）
│   ├── components/
│   │   ├── Navbar.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── ArticleCard.astro
│   │   ├── ThemeToggle.astro
│   │   ├── SearchModal.astro
│   │   ├── ProgressBar.astro
│   │   ├── Lightbox.astro
│   │   └── BackToTop.astro
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── PostLayout.astro
│   └── pages/
│       ├── index.astro           # 首页
│       ├── archive.astro         # 归档
│       ├── about.astro           # 关于
│       ├── 404.astro             # 404
│       ├── rss.xml.js            # RSS
│       ├── posts/[...slug].astro # 文章详情
│       ├── category/[category].astro
│       └── tags/[tag].astro
└── .github/
    └── workflows/
        └── deploy.yml            # GitHub Actions 部署
```

---

## Task 0: 项目初始化与基础配置

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `.gitignore`
- Create: `.gitattributes`

- [ ] **Step 1: 创建工作目录骨架**

Run:
```bash
mkdir -p src/styles src/content/posts src/assets/images src/components src/layouts src/pages/posts src/pages/category src/pages/tags public themes scripts .github/workflows
```
Expected: 目录创建成功（无输出或列出目录）。

- [ ] **Step 2: 创建 `package.json`**

```json
{
  "name": "neon-maple",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "check": "astro check",
    "check:content": "node scripts/check-content.mjs"
  },
  "dependencies": {
    "@astrojs/mdx": "^4.0.0",
    "@astrojs/rss": "^4.0.0",
    "@astrojs/sitemap": "^3.2.0",
    "astro": "^5.0.0"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.0",
    "@pagefind/astro": "^1.1.0",
    "pagefind": "^1.1.0",
    "typescript": "^5.0.0"
  }
}
```

- [ ] **Step 3: 安装依赖**

Run: `npm install`
Expected: `added <N> packages`，无 error；生成 `package-lock.json`。

- [ ] **Step 4: 创建 `astro.config.mjs`**

```js
// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import pagefind from '@pagefind/astro';
import neonTheme from './themes/neon.json' with { type: 'json' };

// https://astro.build/config
export default defineConfig({
  site: 'https://ustc-cy.github.io',
  base: '/neon-maple/',
  integrations: [mdx(), sitemap(), pagefind()],
  markdown: {
    shikiConfig: {
      theme: neonTheme,
      wrap: true,
    },
  },
});
```

- [ ] **Step 5: 创建 `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 6: 创建 `.gitignore`**

```gitignore
# build output
dist/
# generated types
.astro/
# dependencies
node_modules/
# logs
npm-debug.log*
# environment variables
.env
.env.production
# macOS
.DS_Store
# brainstorming visual companion artifacts
.superpowers/
```

- [ ] **Step 7: 创建 `.gitattributes`**（确保 GitHub Actions 里换行一致）

```
* text=auto eol=lf
```

- [ ] **Step 8: 初始化 git 并首次提交**

Run:
```bash
git init -b main
git add .
git commit -m "chore: init astro project scaffolding"
```
Expected: 提交成功，显示 1 个文件变更（含 package.json 等）。

> 说明：`astro.config` 引用了 `../themes/neon.json`（Task 1 创建），当前阶段 `astro build` 会因缺文件失败属正常，Task 1 完成后即可通过。此阶段以依赖安装成功 + git 初始化为验收。

---

## Task 1: 霓虹主题全局样式 + 代码高亮主题 + favicon

**Files:**
- Create: `src/styles/global.css`
- Create: `themes/neon.json`
- Create: `public/favicon.svg`

- [ ] **Step 1: 创建 `themes/neon.json`（Shiki 霓虹代码主题）**

基于 GitHub Dark 微调为霓虹色系（关键字紫色、字符串青色、函数粉、注释灰）：

```json
{
  "name": "neon",
  "type": "dark",
  "colors": {
    "editor.background": "#0b0f1a",
    "editor.foreground": "#e2e8f0"
  },
  "tokenColors": [
    { "scope": ["comment"], "settings": { "foreground": "#64748b", "fontStyle": "italic" } },
    { "scope": ["keyword", "storage.type", "storage.modifier"], "settings": { "foreground": "#c084fc" } },
    { "scope": ["string", "string.regexp"], "settings": { "foreground": "#67e8f9" } },
    { "scope": ["constant", "constant.numeric"], "settings": { "foreground": "#f472b6" } },
    { "scope": ["entity.name.function", "support.function"], "settings": { "foreground": "#fbbf24" } },
    { "scope": ["variable", "variable.other"], "settings": { "foreground": "#e2e8f0" } },
    { "scope": ["entity.name.tag", "tag"], "settings": { "foreground": "#22d3ee" } },
    { "scope": ["entity.other.attribute-name"], "settings": { "foreground": "#a5f3fc" } },
    { "scope": ["markup.heading"], "settings": { "foreground": "#e879f9", "fontWeight": "bold" } },
    { "scope": ["markup.bold"], "settings": { "fontWeight": "bold" } },
    { "scope": ["markup.italic"], "settings": { "fontStyle": "italic" } },
    { "scope": ["markup.code"], "settings": { "foreground": "#67e8f9" } },
    { "scope": ["markup.link", "link"], "settings": { "foreground": "#22d3ee", "textDecoration": "underline" } }
  ]
}
```

- [ ] **Step 2: 创建 `public/favicon.svg`（霓虹枫叶图标）**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#22d3ee"/>
      <stop offset="0.5" stop-color="#a855f7"/>
      <stop offset="1" stop-color="#f472b6"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="#0b0f1a"/>
  <path d="M32 12 L38 20 L46 18 L44 27 L52 33 L44 39 L46 48 L38 46 L32 54 L26 46 L18 48 L20 39 L12 33 L20 27 L18 18 L26 20 Z"
        fill="url(#g)"/>
</svg>
```

- [ ] **Step 3: 创建 `src/styles/global.css`（霓虹主题核心）**

这是整个视觉的基石，包含：CSS 变量（深/浅两套）、玻璃拟态工具类、排版、按钮、卡片、进度条、灯箱、搜索弹层、代码块美化。完整代码如下：

```css
/* ===== NeonMaple 全局样式 ===== */
:root {
  --bg: #0b0f1a;
  --bg-soft: rgba(255, 255, 255, 0.04);
  --surface: rgba(255, 255, 255, 0.05);
  --surface-strong: rgba(255, 255, 255, 0.09);
  --border: rgba(255, 255, 255, 0.09);
  --text: #e2e8f0;
  --text-muted: #94a3b8;
  --neon-cyan: #22d3ee;
  --neon-purple: #a855f7;
  --neon-pink: #f472b6;
  --accent: #a855f7;
  --grad: linear-gradient(90deg, var(--neon-cyan), var(--neon-purple), var(--neon-pink));
  --radius: 14px;
  --shadow-glow: 0 0 24px rgba(168, 85, 247, 0.35);
  --maxw: 760px;
}

html[data-theme='light'] {
  --bg: #f6f7fb;
  --bg-soft: rgba(15, 23, 42, 0.03);
  --surface: rgba(255, 255, 255, 0.72);
  --surface-strong: rgba(255, 255, 255, 0.95);
  --border: rgba(15, 23, 42, 0.1);
  --text: #1e293b;
  --text-muted: #64748b;
  --shadow-glow: 0 6px 18px rgba(168, 85, 247, 0.18);
}

* { box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  line-height: 1.75;
  transition: background 0.35s ease, color 0.35s ease;
  -webkit-font-smoothing: antialiased;
}

/* 背景霓虹光晕 */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(42rem 42rem at 12% -8%, rgba(34, 211, 238, 0.14), transparent 60%),
    radial-gradient(40rem 40rem at 100% 0%, rgba(168, 85, 247, 0.16), transparent 60%),
    radial-gradient(44rem 44rem at 55% 115%, rgba(244, 114, 182, 0.12), transparent 60%);
  pointer-events: none;
}

html[data-theme='light'] body::before {
  background:
    radial-gradient(42rem 42rem at 12% -8%, rgba(34, 211, 238, 0.12), transparent 60%),
    radial-gradient(40rem 40rem at 100% 0%, rgba(168, 85, 247, 0.12), transparent 60%),
    radial-gradient(44rem 44rem at 55% 115%, rgba(244, 114, 182, 0.10), transparent 60%);
}

/* ===== 布局容器 ===== */
.container {
  width: min(100% - 2.5rem, var(--maxw));
  margin-inline: auto;
}

.container-wide {
  width: min(100% - 2.5rem, 1000px);
  margin-inline: auto;
}

/* ===== 排版 ===== */
h1, h2, h3, h4 {
  line-height: 1.3;
  letter-spacing: -0.01em;
}

.neon-text {
  background: var(--grad);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

/* ===== 玻璃卡片 ===== */
.glass {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.glass:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-glow);
  border-color: rgba(168, 85, 247, 0.45);
}

/* ===== 按钮 ===== */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.55rem 1.15rem;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.25s ease;
  text-decoration: none;
}

.btn:hover { border-color: rgba(168, 85, 247, 0.5); box-shadow: var(--shadow-glow); }

.btn-primary {
  background: var(--grad);
  color: #0b0f1a;
  font-weight: 600;
  border: none;
}

.btn-primary:hover { box-shadow: var(--shadow-glow); transform: translateY(-1px); }

/* ===== 徽章 ===== */
.badge {
  display: inline-block;
  padding: 0.15rem 0.7rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #d8b4fe;
  background: rgba(168, 85, 247, 0.16);
  border: 1px solid rgba(168, 85, 247, 0.35);
  text-decoration: none;
  transition: all 0.2s ease;
}

.badge:hover { box-shadow: var(--shadow-glow); }

/* ===== 链接 ===== */
a { color: var(--neon-cyan); }
a:hover { color: var(--neon-pink); }

/* ===== 代码块 ===== */
.prose pre {
  background: #0b0f1a;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1rem 1.15rem;
  overflow-x: auto;
  font-size: 0.875rem;
}

.prose :not(pre) > code {
  background: rgba(168, 85, 247, 0.15);
  color: #d8b4fe;
  padding: 0.1rem 0.4rem;
  border-radius: 6px;
  font-size: 0.85em;
}

html[data-theme='light'] .prose pre { background: #10162b; }

.prose pre code { font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Consolas, monospace; }

/* ===== 正文排版 ===== */
.prose { font-size: 1.02rem; }
.prose h2 { margin-top: 2.4rem; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; }
.prose h3 { margin-top: 2rem; }
.prose img { max-width: 100%; border-radius: var(--radius); border: 1px solid var(--border); cursor: zoom-in; }
.prose blockquote {
  margin: 1.5rem 0;
  padding: 0.6rem 1.2rem;
  border-left: 3px solid var(--neon-purple);
  background: rgba(168, 85, 247, 0.08);
  border-radius: 0 var(--radius) var(--radius) 0;
}
.prose table { border-collapse: collapse; width: 100%; margin: 1.5rem 0; }
.prose th, .prose td { border: 1px solid var(--border); padding: 0.5rem 0.9rem; }
.prose th { background: var(--surface-strong); }

/* ===== 进度条 ===== */
.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  width: 0;
  background: var(--grad);
  z-index: 100;
  transition: width 0.1s linear;
  box-shadow: 0 0 12px rgba(168, 85, 247, 0.6);
}

/* ===== 返回顶部 ===== */
.back-to-top {
  position: fixed;
  right: 1.25rem;
  bottom: 1.25rem;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--surface);
  backdrop-filter: blur(10px);
  color: var(--text);
  font-size: 1.1rem;
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease, box-shadow 0.25s ease;
  z-index: 90;
}

.back-to-top.show { opacity: 1; pointer-events: auto; }
.back-to-top:hover { box-shadow: var(--shadow-glow); }

/* ===== 搜索弹层 ===== */
.search-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(5, 8, 15, 0.7);
  backdrop-filter: blur(6px);
  display: none;
  align-items: flex-start;
  justify-content: center;
  padding-top: 12vh;
}

.search-overlay.open { display: flex; }

.search-panel {
  width: min(100% - 2rem, 560px);
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow-glow);
}

.search-input {
  width: 100%;
  padding: 1rem 1.2rem;
  border: none;
  border-bottom: 1px solid var(--border);
  background: transparent;
  color: var(--text);
  font-size: 1rem;
  outline: none;
}

.search-results { max-height: 55vh; overflow-y: auto; padding: 0.5rem; }

.search-result {
  display: block;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  color: var(--text);
  text-decoration: none;
}

.search-result:hover { background: var(--surface-strong); }
.search-result .sr-title { font-weight: 600; margin-bottom: 0.2rem; }
.search-result .sr-meta { font-size: 0.8rem; color: var(--text-muted); }
.search-empty { padding: 1.5rem; color: var(--text-muted); text-align: center; }

/* ===== 灯箱 ===== */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 300;
  background: rgba(5, 8, 15, 0.92);
  display: none;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.lightbox.open { display: flex; }
.lightbox img { max-width: 92vw; max-height: 84vh; border-radius: 8px; box-shadow: 0 0 60px rgba(168, 85, 247, 0.4); }
.lightbox-caption { color: var(--text-muted); margin-top: 0.8rem; font-size: 0.9rem; }
.lightbox-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: 1px solid var(--border);
  color: var(--text);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  font-size: 1.1rem;
}
.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: 1px solid var(--border);
  color: var(--text);
  border-radius: 50%;
  width: 44px;
  height: 44px;
  cursor: pointer;
  font-size: 1.2rem;
}
.lightbox-nav.prev { left: 1.25rem; }
.lightbox-nav.next { right: 1.25rem; }

/* ===== 动画 ===== */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-up { animation: fadeUp 0.5s ease both; }

/* ===== 响应式 ===== */
@media (max-width: 640px) {
  .container, .container-wide { width: min(100% - 1.5rem, var(--maxw)); }
  .lightbox-nav.prev { left: 0.5rem; }
  .lightbox-nav.next { right: 0.5rem; }
}
```

- [ ] **Step 4: 验证构建**

Run: `npm run build`
Expected: 构建成功，`astro check` 无类型错误；`dist/` 生成。若报 `themes/neon.json` 路径问题，确认路径为 `astro.config.mjs` 同级的 `themes/neon.json`（Astro 解析相对配置文件目录）。

- [ ] **Step 5: 提交**

Run:
```bash
git add .
git commit -m "feat: add neon theme global styles, shiki theme, favicon"
```
Expected: 提交成功。

---

## Task 2: 内容集合 schema

**Files:**
- Create: `src/content/config.ts`

- [ ] **Step 1: 创建 `src/content/config.ts`**

```ts
import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      category: z.string(),
      tags: z.array(z.string()).default([]),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: image().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { posts };
```

- [ ] **Step 2: 验证**

Run: `npm run check`
Expected: 无错误（当前还没有文章，但 schema 编译通过即可）。

- [ ] **Step 3: 提交**

Run:
```bash
git add src/content/config.ts
git commit -m "feat: add content collection schema for posts"
```
Expected: 提交成功。

---

## Task 3: 布局框架（BaseLayout / Navbar / Footer / ThemeToggle / BackToTop）

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/Navbar.astro`
- Create: `src/components/Footer.astro`
- Create: `src/components/ThemeToggle.astro`
- Create: `src/components/BackToTop.astro`

- [ ] **Step 1: 创建 `src/components/ThemeToggle.astro`（深/浅色切换）**

```astro
---
const label = '切换主题';
---

<button class="theme-toggle" id="theme-toggle" aria-label={label} title={label}>
  <span class="icon-dark" aria-hidden="true">🌙</span>
  <span class="icon-light" aria-hidden="true">☀️</span>
</button>

<style>
  .theme-toggle {
    background: none;
    border: 1px solid var(--border);
    border-radius: 50%;
    width: 36px;
    height: 36px;
    cursor: pointer;
    color: var(--text);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    transition: all 0.25s ease;
  }
  .theme-toggle:hover { box-shadow: var(--shadow-glow); }
  .icon-light { display: none; }
  html[data-theme='light'] .icon-light { display: inline; }
  html[data-theme='light'] .icon-dark { display: none; }
</style>

<script>
  function applyTheme(theme: 'dark' | 'light') {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('neon-theme', theme);
  }

  const toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }
</script>
```

- [ ] **Step 2: 创建 `src/components/Navbar.astro`**

毛玻璃固定顶栏，含 logo、导航链接、搜索按钮（占位，Task 7 填充）、主题切换：

```astro
---
import ThemeToggle from './ThemeToggle.astro';

const links = [
  { href: '/', label: '首页' },
  { href: '/archive', label: '归档' },
  { href: '/tags/前端', label: '标签' },
  { href: '/about', label: '关于' },
];
const base = import.meta.env.BASE_URL;
---

<header class="nav-wrap">
  <nav class="nav container-wide">
    <a href={base} class="brand">
      <span class="brand-dot" aria-hidden="true"></span>
      <span class="brand-name">晨枫的学习之路</span>
    </a>
    <div class="nav-links">
      {
        links.map((l) => (
          <a href={base + l.href.replace(/^\//, '')} class="nav-link">{l.label}</a>
        ))
      }
    </div>
    <div class="nav-actions">
      <button id="search-btn" class="nav-icon" aria-label="搜索" title="搜索">🔍</button>
      <ThemeToggle />
    </div>
  </nav>
</header>

<style>
  .nav-wrap {
    position: sticky;
    top: 0;
    z-index: 100;
    background: color-mix(in srgb, var(--bg) 78%, transparent);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-bottom: 1px solid var(--border);
  }
  .nav {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    height: 60px;
  }
  .brand { display: flex; align-items: center; gap: 0.55rem; text-decoration: none; }
  .brand-dot {
    width: 12px; height: 12px; border-radius: 50%;
    background: var(--grad);
    box-shadow: 0 0 12px rgba(168, 85, 247, 0.8);
  }
  .brand-name { font-weight: 700; letter-spacing: 0.02em; color: var(--text); }
  .nav-links { display: flex; gap: 1.2rem; margin-left: auto; }
  .nav-link { color: var(--text-muted); text-decoration: none; font-size: 0.95rem; transition: color 0.2s; }
  .nav-link:hover { color: var(--neon-cyan); }
  .nav-actions { display: flex; align-items: center; gap: 0.6rem; }
  .nav-icon {
    background: none; border: 1px solid var(--border); border-radius: 50%;
    width: 36px; height: 36px; cursor: pointer; color: var(--text);
    font-size: 0.95rem; transition: all 0.25s ease;
  }
  .nav-icon:hover { box-shadow: var(--shadow-glow); }
  @media (max-width: 640px) {
    .nav-links { display: none; }
  }
</style>
```

- [ ] **Step 3: 创建 `src/components/Footer.astro`**

```astro
---
const base = import.meta.env.BASE_URL;
const year = new Date().getFullYear();
---

<footer class="footer">
  <div class="container-wide footer-inner">
    <p class="footer-brand">晨枫的学习之路 · <span class="neon-text">NeonMaple</span></p>
    <p class="footer-meta">记录学习历程与经验总结</p>
    <div class="footer-links">
      <a href={base + 'rss.xml'} class="footer-link">RSS</a>
      <a href={base + 'about'} class="footer-link">关于我</a>
    </div>
  </div>
</footer>

<style>
  .footer {
    margin-top: 4rem;
    border-top: 1px solid var(--border);
    background: var(--bg-soft);
  }
  .footer-inner { padding: 2rem 0 2.5rem; display: flex; flex-direction: column; align-items: center; gap: 0.4rem; text-align: center; }
  .footer-brand { margin: 0; font-weight: 600; }
  .footer-meta { margin: 0; color: var(--text-muted); font-size: 0.85rem; }
  .footer-links { display: flex; gap: 1.2rem; margin-top: 0.4rem; }
  .footer-link { color: var(--text-muted); font-size: 0.85rem; text-decoration: none; }
  .footer-link:hover { color: var(--neon-cyan); }
</style>
```

- [ ] **Step 4: 创建 `src/components/BackToTop.astro`**

```astro
<button class="back-to-top" id="back-to-top" aria-label="返回顶部" title="返回顶部">↑</button>

<style>
  .back-to-top {
    position: fixed;
    right: 1.25rem;
    bottom: 1.25rem;
    width: 42px; height: 42px;
    border-radius: 50%;
    border: 1px solid var(--border);
    background: var(--surface);
    backdrop-filter: blur(10px);
    color: var(--text);
    font-size: 1.1rem;
    cursor: pointer;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.25s ease, box-shadow 0.25s ease;
    z-index: 90;
  }
  .back-to-top.show { opacity: 1; pointer-events: auto; }
  .back-to-top:hover { box-shadow: var(--shadow-glow); }
</style>

<script>
  const btn = document.getElementById('back-to-top');
  if (btn) {
    const onScroll = () => btn.classList.toggle('show', window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
</script>
```

- [ ] **Step 5: 创建 `src/layouts/BaseLayout.astro`**

```astro
---
import '../styles/global.css';
import Navbar from '../components/Navbar.astro';
import Footer from '../components/Footer.astro';
import BackToTop from '../components/BackToTop.astro';

interface Props {
  title: string;
  description?: string;
}

const { title, description = '晨枫的学习之路 · 记录学习历程与经验总结' } = Astro.props;
const base = import.meta.env.BASE_URL;
const canonical = new URL(Astro.url.pathname, Astro.site);
---

<!doctype html>
<html lang="zh-CN" data-theme="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href={base + 'favicon.svg'} />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <script is:inline>
      // 首屏前应用已保存的主题，避免闪烁
      (function () {
        try {
          var saved = localStorage.getItem('neon-theme');
          var theme = saved || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
          document.documentElement.setAttribute('data-theme', theme);
        } catch (e) {
          document.documentElement.setAttribute('data-theme', 'dark');
        }
      })();
    </script>
  </head>
  <body>
    <Navbar />
    <main>
      <slot />
    </main>
    <Footer />
    <BackToTop />
  </body>
</html>
```

- [ ] **Step 6: 验证**

Run: `npm run build`
Expected: 构建通过（当前无页面内容，但布局组件能编译）。

- [ ] **Step 7: 提交**

Run:
```bash
git add .
git commit -m "feat: add base layout, navbar, footer, theme toggle, back-to-top"
```
Expected: 提交成功。

---

## Task 4: 首页（Hero + ArticleCard）

**Files:**
- Create: `src/components/Hero.astro`
- Create: `src/components/ArticleCard.astro`
- Create: `src/pages/index.astro`

- [ ] **Step 1: 创建 `src/components/ArticleCard.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';

interface Props {
  post: CollectionEntry<'posts'>;
}

const { post } = Astro.props;
const base = import.meta.env.BASE_URL;
const { title, description, pubDate, category, tags, heroImage } = post.data;
const href = base + `posts/${post.slug}/`;
const dateStr = pubDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
---

<article class="glass card">
  <a href={href} class="card-link">
    <div class="card-body">
      <div class="card-meta">
        <span class="badge">{category}</span>
        <time class="card-date">{dateStr}</time>
      </div>
      <h3 class="card-title">{title}</h3>
      <p class="card-desc">{description}</p>
      <div class="card-tags">
        {tags.slice(0, 4).map((t) => <span class="card-tag">#{t}</span>)}
      </div>
    </div>
  </a>
</article>

<style>
  .card { overflow: hidden; }
  .card-link { text-decoration: none; color: inherit; display: block; padding: 1.25rem 1.4rem; }
  .card-body { display: flex; flex-direction: column; gap: 0.55rem; }
  .card-meta { display: flex; align-items: center; gap: 0.8rem; }
  .card-date { color: var(--text-muted); font-size: 0.82rem; }
  .card-title { margin: 0; font-size: 1.2rem; color: var(--text); transition: color 0.2s; }
  .card:hover .card-title { background: var(--grad); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
  .card-desc { margin: 0; color: var(--text-muted); font-size: 0.92rem; }
  .card-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
  .card-tag { color: var(--neon-cyan); font-size: 0.78rem; opacity: 0.85; }
</style>
```

> 注：`heroImage` 在 schema 中声明了但卡片先不做封面图展示（第一版保持简洁，封面图字段保留供后续使用）。如需封面，可在 Task 4 后补充 `<Image>` 展示，属可选增强。

- [ ] **Step 2: 创建 `src/components/Hero.astro`**

```astro
---
const base = import.meta.env.BASE_URL;
---

<section class="hero">
  <div class="container hero-inner">
    <span class="badge hero-badge">✦ 个人学习博客</span>
    <h1 class="hero-title">
      <span class="neon-text">晨枫的学习之路</span>
    </h1>
    <p class="hero-sub">记录学习历程，分享经验总结。与热爱学习的你同行。</p>
    <div class="hero-actions">
      <a href={base + 'archive'} class="btn btn-primary">浏览归档 →</a>
      <a href={base + 'about'} class="btn">关于我</a>
    </div>
  </div>
</section>

<style>
  .hero { padding: 4.5rem 0 3rem; text-align: center; }
  .hero-inner { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
  .hero-badge { font-size: 0.85rem; letter-spacing: 0.1em; }
  .hero-title { font-size: clamp(2.2rem, 6vw, 3.4rem); margin: 0; font-weight: 800; }
  .hero-sub { color: var(--text-muted); max-width: 34em; margin: 0; font-size: 1.05rem; }
  .hero-actions { display: flex; gap: 0.9rem; margin-top: 0.6rem; }
</style>
```

- [ ] **Step 3: 创建 `src/pages/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import ArticleCard from '../components/ArticleCard.astro';

const posts = (await getCollection('posts'))
  .filter((p) => !p.data.draft)
  .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

const recent = posts.slice(0, 6);

const categories = [...new Set(posts.map((p) => p.data.category))].slice(0, 8);
const base = import.meta.env.BASE_URL;
---

<BaseLayout title="晨枫的学习之路">
  <Hero />

  <section class="section container-wide">
    <div class="section-head">
      <h2 class="section-title">最新文章</h2>
      <a href={base + 'archive'} class="section-more">全部文章 →</a>
    </div>
    <div class="grid">
      {recent.map((post) => <ArticleCard post={post} />)}
    </div>
  </section>

  {
    categories.length > 0 && (
      <section class="section container-wide">
        <div class="section-head">
          <h2 class="section-title">分类</h2>
        </div>
        <div class="cat-list">
          {categories.map((c) => (
            <a href={base + `category/${c}/`} class="badge cat-badge">{c}</a>
          ))}
        </div>
      </section>
    )
  }
</BaseLayout>

<style>
  .section { margin-top: 3rem; }
  .section-head { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 1.2rem; }
  .section-title { margin: 0; font-size: 1.4rem; }
  .section-title::before { content: '✦ '; color: var(--neon-purple); }
  .section-more { color: var(--text-muted); text-decoration: none; font-size: 0.9rem; }
  .section-more:hover { color: var(--neon-cyan); }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.1rem; }
  .cat-list { display: flex; flex-wrap: wrap; gap: 0.7rem; }
  .cat-badge { font-size: 0.9rem; padding: 0.35rem 1rem; }
</style>
```

- [ ] **Step 4: 验证**

Run: `npm run build`
Expected: 构建通过；`dist/index.html` 生成。可 `npm run dev` 本地查看首页。

- [ ] **Step 5: 提交**

Run:
```bash
git add .
git commit -m "feat: add homepage with hero and article cards"
```
Expected: 提交成功。

---

## Task 5: 文章详情页 + 阅读进度条

**Files:**
- Create: `src/components/ProgressBar.astro`
- Create: `src/layouts/PostLayout.astro`
- Create: `src/pages/posts/[...slug].astro`

- [ ] **Step 1: 创建 `src/components/ProgressBar.astro`**

```astro
<div class="progress-bar" id="progress-bar" aria-hidden="true"></div>

<script>
  const bar = document.getElementById('progress-bar');
  if (bar) {
    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      const pct = total > 0 ? (h.scrollTop / total) * 100 : 0;
      bar.style.width = pct + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
  }
</script>
```

- [ ] **Step 2: 创建 `src/layouts/PostLayout.astro`**

```astro
---
import BaseLayout from './BaseLayout.astro';
import ProgressBar from '../components/ProgressBar.astro';
import Lightbox from '../components/Lightbox.astro';
import type { CollectionEntry } from 'astro:content';

interface Props {
  post: CollectionEntry<'posts'>;
}

const { post } = Astro.props;
const { title, description, pubDate, updatedDate, tags, category } = post.data;
const base = import.meta.env.BASE_URL;
const dateStr = pubDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
const updatedStr = updatedDate?.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
---

<BaseLayout title={`${title} · 晨枫的学习之路`} description={description}>
  <ProgressBar />
  <article class="container post">
    <header class="post-head">
      <div class="post-meta">
        <a href={base + `category/${category}/`} class="badge">{category}</a>
        <time>{dateStr}</time>
        {updatedStr && <span class="updated">更新于 {updatedStr}</span>}
      </div>
      <h1 class="post-title">{title}</h1>
      <p class="post-desc">{description}</p>
      <div class="post-tags">
        {tags.map((t) => <a href={base + `tags/${t}/`} class="post-tag">#{t}</a>)}
      </div>
    </header>
    <div class="prose post-body">
      <slot />
    </div>
  </article>
  <Lightbox />
</BaseLayout>

<style>
  .post { padding-top: 2.2rem; padding-bottom: 3rem; }
  .post-head { margin-bottom: 2.2rem; }
  .post-meta { display: flex; align-items: center; gap: 0.9rem; color: var(--text-muted); font-size: 0.85rem; }
  .updated { opacity: 0.8; }
  .post-title { font-size: clamp(1.8rem, 4.5vw, 2.5rem); margin: 0.8rem 0 0.6rem; }
  .post-desc { color: var(--text-muted); font-size: 1.02rem; margin: 0 0 0.8rem; }
  .post-tags { display: flex; flex-wrap: wrap; gap: 0.6rem; }
  .post-tag { color: var(--neon-cyan); text-decoration: none; font-size: 0.85rem; }
  .post-tag:hover { color: var(--neon-pink); }
  .post-body { max-width: var(--maxw); }
</style>
```

> 注：PostLayout 引用了 `Lightbox` 组件（Task 8 创建）。若按顺序执行会因缺文件构建失败——Task 5 阶段可先创建 `Lightbox.astro` 的空壳（`<div></div>`），Task 8 再填充完整实现；或者本任务跳过构建验证、放到 Task 8 完成后一并验证。

- [ ] **Step 3: 创建空壳 `src/components/Lightbox.astro`（Task 8 填充完整实现）**

```astro
<div></div>
```

- [ ] **Step 4: 创建 `src/pages/posts/[...slug].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import PostLayout from '../../layouts/PostLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('posts');
  return posts
    .filter((p) => !p.data.draft)
    .map((post) => ({
      params: { slug: post.slug },
      props: { post },
    }));
}

const { post } = Astro.props;
const { Content } = await render(post);

const allPosts = (await getCollection('posts'))
  .filter((p) => !p.data.draft)
  .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
const idx = allPosts.findIndex((p) => p.slug === post.slug);
const prev = allPosts[idx + 1];
const next = allPosts[idx - 1];
const base = import.meta.env.BASE_URL;
---

<PostLayout post={post}>
  <Content />
  <nav class="post-nav" aria-label="文章导航">
    {prev && (
      <a href={base + `posts/${prev.slug}/`} class="post-nav-item">
        <span class="post-nav-label">← 上一篇</span>
        <span class="post-nav-title">{prev.data.title}</span>
      </a>
    )}
    {next && (
      <a href={base + `posts/${next.slug}/`} class="post-nav-item">
        <span class="post-nav-label">下一篇 →</span>
        <span class="post-nav-title">{next.data.title}</span>
      </a>
    )}
  </nav>
</PostLayout>

<style>
  .post-nav { display: flex; justify-content: space-between; gap: 1rem; margin-top: 3rem; border-top: 1px solid var(--border); padding-top: 1.5rem; }
  .post-nav-item { text-decoration: none; color: var(--text); display: flex; flex-direction: column; gap: 0.2rem; max-width: 45%; }
  .post-nav-label { color: var(--text-muted); font-size: 0.8rem; }
  .post-nav-title { font-weight: 600; }
  .post-nav-item:hover .post-nav-title { color: var(--neon-cyan); }
  .post-nav-item:last-child { text-align: right; margin-left: auto; }
</style>
```

- [ ] **Step 5: 验证（先跳过，Task 8 完成后统一验证）**

Run: `npm run build`
Expected: 若 Lightbox 仍是空壳也应构建通过；若当前无任何文章，`getStaticPaths` 返回空数组属正常，构建仍成功。

- [ ] **Step 6: 提交**

Run:
```bash
git add .
git commit -m "feat: add post detail page with progress bar and prev/next nav"
```
Expected: 提交成功。

---

## Task 6: 分类 / 标签 / 归档页

**Files:**
- Create: `src/pages/category/[category].astro`
- Create: `src/pages/tags/[tag].astro`
- Create: `src/pages/archive.astro`

- [ ] **Step 1: 创建 `src/pages/category/[category].astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import ArticleCard from '../../components/ArticleCard.astro';

export async function getStaticPaths() {
  const posts = await getCollection('posts');
  const live = posts.filter((p) => !p.data.draft);
  const categories = [...new Set(live.map((p) => p.data.category))];
  return categories.map((category) => ({ params: { category }, props: { category } }));
}

const { category } = Astro.props;
const posts = (await getCollection('posts'))
  .filter((p) => !p.data.draft && p.data.category === category)
  .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
---

<BaseLayout title={`分类：${category} · 晨枫的学习之路`} description={`分类「${category}」下的全部文章`}>
  <section class="container-wide page">
    <h1 class="page-title">分类：<span class="neon-text">{category}</span></h1>
    <p class="page-count">共 {posts.length} 篇文章</p>
    <div class="grid">
      {posts.map((post) => <ArticleCard post={post} />)}
    </div>
  </section>
</BaseLayout>

<style>
  .page { padding-top: 2.5rem; padding-bottom: 3rem; }
  .page-title { font-size: 1.9rem; margin: 0 0 0.3rem; }
  .page-count { color: var(--text-muted); margin: 0 0 1.5rem; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.1rem; }
</style>
```

- [ ] **Step 2: 创建 `src/pages/tags/[tag].astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import ArticleCard from '../../components/ArticleCard.astro';

export async function getStaticPaths() {
  const posts = await getCollection('posts');
  const live = posts.filter((p) => !p.data.draft);
  const tags = [...new Set(live.flatMap((p) => p.data.tags))];
  return tags.map((tag) => ({ params: { tag }, props: { tag } }));
}

const { tag } = Astro.props;
const posts = (await getCollection('posts'))
  .filter((p) => !p.data.draft && p.data.tags.includes(tag))
  .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
---

<BaseLayout title={`标签：${tag} · 晨枫的学习之路`} description={`标签「${tag}」下的全部文章`}>
  <section class="container-wide page">
    <h1 class="page-title">标签：<span class="neon-text">{tag}</span></h1>
    <p class="page-count">共 {posts.length} 篇文章</p>
    <div class="grid">
      {posts.map((post) => <ArticleCard post={post} />)}
    </div>
  </section>
</BaseLayout>

<style>
  .page { padding-top: 2.5rem; padding-bottom: 3rem; }
  .page-title { font-size: 1.9rem; margin: 0 0 0.3rem; }
  .page-count { color: var(--text-muted); margin: 0 0 1.5rem; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.1rem; }
</style>
```

- [ ] **Step 3: 创建 `src/pages/archive.astro`**

按年月分组的归档页：

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';

const posts = (await getCollection('posts'))
  .filter((p) => !p.data.draft)
  .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

const byMonth = new Map<string, typeof posts>();
for (const post of posts) {
  const key = post.data.pubDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' });
  if (!byMonth.has(key)) byMonth.set(key, []);
  byMonth.get(key)!.push(post);
}
const base = import.meta.env.BASE_URL;
---

<BaseLayout title="归档 · 晨枫的学习之路" description="全部文章按时间归档">
  <section class="container archive">
    <h1 class="page-title">归档</h1>
    <p class="page-count">共 {posts.length} 篇文章</p>
    {
      [...byMonth.entries()].map(([month, items]) => (
        <div class="month-block">
          <h2 class="month-title">{month}</h2>
          <ul class="month-list">
            {items.map((post) => (
              <li class="month-item">
                <time class="month-date">{post.data.pubDate.toLocaleDateString('zh-CN', { day: 'numeric' })}日</time>
                <a href={base + `posts/${post.slug}/`} class="month-link">{post.data.title}</a>
                <span class="month-cat">{post.data.category}</span>
              </li>
            ))}
          </ul>
        </div>
      ))
    }
  </section>
</BaseLayout>

<style>
  .archive { padding-top: 2.5rem; padding-bottom: 3rem; }
  .page-title { font-size: 1.9rem; margin: 0 0 0.3rem; }
  .page-count { color: var(--text-muted); margin: 0 0 1.8rem; }
  .month-block { margin-bottom: 1.8rem; }
  .month-title { font-size: 1.25rem; margin: 0 0 0.6rem; color: var(--neon-purple); }
  .month-list { list-style: none; margin: 0; padding: 0; }
  .month-item { display: flex; align-items: baseline; gap: 1rem; padding: 0.5rem 0; border-bottom: 1px dashed var(--border); }
  .month-date { color: var(--text-muted); font-size: 0.85rem; min-width: 3em; }
  .month-link { color: var(--text); text-decoration: none; font-weight: 500; }
  .month-link:hover { color: var(--neon-cyan); }
  .month-cat { margin-left: auto; color: var(--text-muted); font-size: 0.8rem; }
</style>
```

- [ ] **Step 4: 验证**

Run: `npm run build`
Expected: 构建通过（无文章时分类/标签页生成 0 个静态页，归档页显示 0 篇，均正常）。

- [ ] **Step 5: 提交**

Run:
```bash
git add .
git commit -m "feat: add category, tag and archive pages"
```
Expected: 提交成功。

---

## Task 7: 站内搜索（Pagefind + 霓虹搜索弹层）

**Files:**
- Modify: `src/components/Navbar.astro`（挂载搜索弹层）
- Create: `src/components/SearchModal.astro`

- [ ] **Step 1: 创建 `src/components/SearchModal.astro`**

使用 Pagefind 客户端 API 实现霓虹风搜索弹层：

```astro
<div class="search-overlay" id="search-overlay" aria-hidden="true">
  <div class="search-panel" role="dialog" aria-label="搜索文章">
    <input
      type="text"
      class="search-input"
      id="search-input"
      placeholder="搜索文章标题或内容…"
      autocomplete="off"
    />
    <div class="search-results" id="search-results"></div>
  </div>
</div>

<style>
  .search-overlay {
    position: fixed;
    inset: 0;
    z-index: 200;
    background: rgba(5, 8, 15, 0.7);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    display: none;
    align-items: flex-start;
    justify-content: center;
    padding-top: 12vh;
  }
  .search-overlay.open { display: flex; }
  .search-panel {
    width: min(100% - 2rem, 560px);
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    box-shadow: var(--shadow-glow);
  }
  .search-input {
    width: 100%;
    padding: 1rem 1.2rem;
    border: none;
    border-bottom: 1px solid var(--border);
    background: transparent;
    color: var(--text);
    font-size: 1rem;
    outline: none;
  }
  .search-results { max-height: 55vh; overflow-y: auto; padding: 0.5rem; }
  .search-result { display: block; padding: 0.75rem 1rem; border-radius: 10px; color: var(--text); text-decoration: none; }
  .search-result:hover { background: var(--surface-strong); }
  .search-result .sr-title { font-weight: 600; margin-bottom: 0.2rem; }
  .search-result .sr-meta { font-size: 0.8rem; color: var(--text-muted); }
  .search-empty { padding: 1.5rem; color: var(--text-muted); text-align: center; }
</style>

<script>
  const overlay = document.getElementById('search-overlay');
  const input = document.getElementById('search-input') as HTMLInputElement;
  const results = document.getElementById('search-results');
  // Astro 编译时注入站点 base（如 /neon-maple/），保证在子路径部署下索引 URL 正确
  const base = import.meta.env.BASE_URL;

  let pagefind: any = null;
  let timer: number | undefined;

  async function ensurePagefind() {
    if (pagefind) return;
    pagefind = await import(/* @vite-ignore */ base + 'pagefind/pagefind.js');
  }

  async function doSearch(query: string) {
    results!.innerHTML = '';
    if (!query.trim()) {
      results!.innerHTML = '<div class="search-empty">输入关键词开始搜索</div>';
      return;
    }
    try {
      await ensurePagefind();
      const search = await pagefind.search(query);
      const items = search.results?.slice(0, 12) ?? [];
      if (items.length === 0) {
        results!.innerHTML = '<div class="search-empty">没有找到相关文章</div>';
        return;
      }
      for (const item of items) {
        const data = await item.data();
        const a = document.createElement('a');
        a.className = 'search-result';
        a.href = base + (data.url ?? '').replace(/^\//, '');
        a.innerHTML = `<div class="sr-title">${data.meta?.title ?? ''}</div>
          <div class="sr-meta">${data.meta?.description ?? ''}</div>`;
        results!.appendChild(a);
      }
    } catch (e) {
      results!.innerHTML = '<div class="search-empty">搜索暂不可用（构建时未生成索引）</div>';
    }
  }

  function open() {
    overlay!.classList.add('open');
    overlay!.setAttribute('aria-hidden', 'false');
    setTimeout(() => input?.focus(), 60);
  }

  function close() {
    overlay!.classList.remove('open');
    overlay!.setAttribute('aria-hidden', 'true');
  }

  const searchBtn = document.getElementById('search-btn');
  searchBtn?.addEventListener('click', open);

  input?.addEventListener('input', () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => doSearch(input.value), 200);
  });

  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      overlay!.classList.contains('open') ? close() : open();
    }
  });
</script>
```

- [ ] **Step 2: 在 `src/components/Navbar.astro` 中集成搜索弹层**

在 Navbar 的 frontmatter 中 `import SearchModal from './SearchModal.astro';`，并在 `</header>` 后渲染 `<SearchModal />`：

修改 `Navbar.astro`：
1. frontmatter 加一行：`import SearchModal from './SearchModal.astro';`
2. 在 `</nav>` 与 `</header>` 之间（即 `</header>` 前）加入 `<SearchModal />`

- [ ] **Step 3: 验证**

Run: `npm run build`
Expected: 构建通过，`@pagefind/astro` 会在 `dist/` 生成 `pagefind/` 索引目录。

Run: `npm run dev`，浏览器打开首页，点导航 🔍 按钮或按 `Ctrl+K`，输入关键词能看到结果（需先有文章，Task 10 后效果完整）。

- [ ] **Step 4: 提交**

Run:
```bash
git add .
git commit -m "feat: add pagefind search with neon search modal"
```
Expected: 提交成功。

---

## Task 8: 图片灯箱（Lightbox）

**Files:**
- Create: `src/components/Lightbox.ts`（逻辑）
- Modify: `src/components/Lightbox.astro`（替换空壳为完整组件）

- [ ] **Step 1: 创建 `src/components/Lightbox.ts`**

```ts
// 灯箱逻辑：收集文章正文中的图片，点击放大，支持多图切换/ESC/触摸
export function initLightbox() {
  const overlay = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img') as HTMLImageElement;
  const caption = document.getElementById('lightbox-caption');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  const closeBtn = document.getElementById('lightbox-close');

  if (!overlay || !img) return;

  let images: HTMLImageElement[] = [];
  let current = 0;

  function openAt(index: number) {
    current = index;
    const target = images[current];
    img.src = target.currentSrc || target.src;
    caption!.textContent = target.getAttribute('alt') || '';
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    syncNav();
  }

  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function next() {
    if (current < images.length - 1) openAt(current + 1);
  }

  function prev() {
    if (current > 0) openAt(current - 1);
  }

  function syncNav() {
    prevBtn!.style.display = images.length > 1 ? '' : 'none';
    nextBtn!.style.display = images.length > 1 ? '' : 'none';
    prevBtn!.disabled = current === 0;
    nextBtn!.disabled = current === images.length - 1;
  }

  // 收集 .prose 内的图片
  function collect() {
    images = Array.from(document.querySelectorAll('.prose img'));
    images.forEach((el, i) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        openAt(i);
      });
      el.style.cursor = 'zoom-in';
    });
  }

  collect();
  // 若文章正文由客户端渲染动态插入，用 MutationObserver 兜底
  const mo = new MutationObserver(() => collect());
  mo.observe(document.body, { childList: true, subtree: true });

  closeBtn!.addEventListener('click', close);
  prevBtn!.addEventListener('click', prev);
  nextBtn!.addEventListener('click', next);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });

  // 触摸滑动
  let touchX = 0;
  overlay.addEventListener('touchstart', (e) => {
    touchX = e.touches[0].clientX;
  });
  overlay.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) (dx < 0 ? next() : prev());
  });
}
```

- [ ] **Step 2: 用完整实现替换 `src/components/Lightbox.astro`**

```astro
---
const label = '查看大图';
---

<div class="lightbox" id="lightbox" aria-hidden="true">
  <button class="lightbox-btn" id="lightbox-close" aria-label="关闭">✕</button>
  <button class="lightbox-nav prev" id="lightbox-prev" aria-label="上一张">‹</button>
  <button class="lightbox-nav next" id="lightbox-next" aria-label="下一张">›</button>
  <img id="lightbox-img" alt="" />
  <p class="lightbox-caption" id="lightbox-caption"></p>
</div>

<style>
  .lightbox {
    position: fixed;
    inset: 0;
    z-index: 300;
    background: rgba(5, 8, 15, 0.92);
    display: none;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .lightbox.open { display: flex; }
  .lightbox img { max-width: 92vw; max-height: 84vh; border-radius: 8px; box-shadow: 0 0 60px rgba(168, 85, 247, 0.4); }
  .lightbox-caption { color: var(--text-muted); margin: 0.8rem 1rem 0; font-size: 0.9rem; text-align: center; }
  .lightbox-btn {
    position: absolute; top: 1rem; right: 1rem;
    background: none; border: 1px solid var(--border); color: var(--text);
    border-radius: 50%; width: 40px; height: 40px; cursor: pointer; font-size: 1.1rem;
  }
  .lightbox-nav {
    position: absolute; top: 50%; transform: translateY(-50%);
    background: none; border: 1px solid var(--border); color: var(--text);
    border-radius: 50%; width: 44px; height: 44px; cursor: pointer; font-size: 1.3rem;
  }
  .lightbox-nav.prev { left: 1.25rem; }
  .lightbox-nav.next { right: 1.25rem; }
  @media (max-width: 640px) {
    .lightbox-nav.prev { left: 0.5rem; }
    .lightbox-nav.next { right: 0.5rem; }
  }
</style>

<script>
  import { initLightbox } from './Lightbox.ts';
  initLightbox();
</script>
```

> 注：Astro 组件 `<script>` 中 `import './Lightbox.ts'` 会被 Astro 打包处理为浏览器脚本，正常可用。

- [ ] **Step 3: 验证**

Run: `npm run build`
Expected: 构建通过。`npm run dev` 打开任一文章页（需 Task 10 有文章），点击正文图片可放大、ESC 关闭。

- [ ] **Step 4: 提交**

Run:
```bash
git add .
git commit -m "feat: add image lightbox with keyboard and touch support"
```
Expected: 提交成功。

---

## Task 9: 关于页 + 404 + RSS

**Files:**
- Create: `src/pages/about.astro`
- Create: `src/pages/404.astro`
- Create: `src/pages/rss.xml.js`

- [ ] **Step 1: 创建 `src/pages/about.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
const base = import.meta.env.BASE_URL;
---

<BaseLayout title="关于我 · 晨枫的学习之路" description="关于晨枫的学习之路">
  <article class="container about">
    <h1 class="about-title">关于<span class="neon-text">我</span></h1>
    <div class="prose">
      <p>你好，我是 <strong>晨枫</strong>，一名技术经理，也是兼职产品经理。</p>
      <p>这个博客「<strong>晨枫的学习之路</strong>」用于记录我的学习历程、踩坑经验与总结分享。希望能把零散的知识沉淀下来，也帮助到同样在路上的你。</p>
      <p>技术方向：前端、后端、工程化、以及一切值得学习的东西。</p>
      <p>欢迎通过 RSS 订阅，或到我的 GitHub 交流：<a href="https://github.com/ustc-cy" target="_blank" rel="noopener">github.com/ustc-cy</a>。</p>
    </div>
    <div class="about-actions">
      <a href={base + 'archive'} class="btn btn-primary">浏览全部文章 →</a>
    </div>
  </article>
</BaseLayout>

<style>
  .about { padding-top: 2.5rem; padding-bottom: 3rem; }
  .about-title { font-size: 2rem; margin: 0 0 1.2rem; }
  .about-actions { margin-top: 2rem; }
</style>
```

- [ ] **Step 2: 创建 `src/pages/404.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
const base = import.meta.env.BASE_URL;
---

<BaseLayout title="页面不存在 · 晨枫的学习之路" description="页面不存在">
  <section class="container nf">
    <p class="nf-code neon-text">404</p>
    <h1 class="nf-title">页面走丢了</h1>
    <p class="nf-desc">你要找的内容不存在或已被移动。</p>
    <a href={base} class="btn btn-primary">回到首页</a>
  </section>
</BaseLayout>

<style>
  .nf { padding-top: 5rem; padding-bottom: 5rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
  .nf-code { font-size: 5rem; font-weight: 800; margin: 0; line-height: 1; }
  .nf-title { font-size: 1.6rem; margin: 0; }
  .nf-desc { color: var(--text-muted); margin: 0; }
</style>
```

- [ ] **Step 3: 创建 `src/pages/rss.xml.js`**

```js
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('posts'))
    .filter((p) => !p.data.draft)
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

  return rss({
    title: '晨枫的学习之路',
    description: '记录学习历程与经验总结',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/posts/${post.slug}/`,
      categories: post.data.tags,
    })),
  });
}
```

- [ ] **Step 4: 验证**

Run: `npm run build`
Expected: 构建通过；`dist/404.html` 与 `dist/rss.xml` 生成。

- [ ] **Step 5: 提交**

Run:
```bash
git add .
git commit -m "feat: add about, 404 and rss feed pages"
```
Expected: 提交成功。

---

## Task 10: 示例文章（含图片，验证全链路）

**Files:**
- Create: `src/content/posts/hello-neonmaple.mdx`
- Create: `src/content/posts/frontend-learning-roadmap.mdx`
- Create: `src/assets/images/frontend/`（示例封面图）

- [ ] **Step 1: 生成示例封面图（霓虹风 SVG 转 PNG 不需要——直接用 SVG 占位）**

示例文章封面直接用 SVG 文件即可被 Astro `<Image>` 或 Markdown 引用。创建 `src/assets/images/frontend/cover-frontend.svg`：

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#22d3ee"/>
      <stop offset="0.5" stop-color="#a855f7"/>
      <stop offset="1" stop-color="#f472b6"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="#0b0f1a"/>
  <circle cx="1000" cy="100" r="220" fill="rgba(168,85,247,0.18)"/>
  <circle cx="150" cy="480" r="260" fill="rgba(34,211,238,0.14)"/>
  <text x="80" y="330" font-family="sans-serif" font-size="72" font-weight="800" fill="url(#g)">前端学习路线</text>
  <text x="80" y="410" font-family="sans-serif" font-size="30" fill="#94a3b8">从入门到实战的完整路径</text>
</svg>
```

- [ ] **Step 2: 创建第一篇文章 `src/content/posts/hello-neonmaple.mdx`**

```mdx
---
title: 你好，NeonMaple！我的学习博客开张了
description: 这是我的第一篇博客，聊聊为什么建站、会写什么，以及 NeonMaple 名字的由来。
category: 随笔
tags: [开篇, 博客]
pubDate: 2026-11-26
draft: false
---

## 为什么建这个博客

一直想把学习过程沉淀下来。**写下来是最好的学习方式**——把知识讲清楚，才算真正学会。

## 会写什么

- 📝 学习历程与踩坑记录
- 🧭 技术方向的经验总结
- 🚀 阶段性项目复盘

## NeonMaple 名字的由来

**Neon** 是霓虹，呼应站点的暗色霓虹风格；**Maple** 是枫，取自「晨枫」中的「枫」。合在一起，就是这条路的样子：

> 在暗色里发光，一路向上生长。

```js
console.log('Hello, NeonMaple!');
```

以后多关照，常来逛逛。
```

- [ ] **Step 3: 创建第二篇文章 `src/content/posts/frontend-learning-roadmap.mdx`**

```mdx
---
title: 前端学习路线：从入门到实战
description: 一份面向新人的前端学习路线图，涵盖 HTML/CSS/JS、框架、工程化与项目实战。
category: 前端
tags: [前端, 学习路线, 入门]
pubDate: 2026-11-25
draft: false
---

## 路线概览

import { Image } from 'astro:assets';
import cover from '../assets/images/frontend/cover-frontend.svg';

<Image src={cover} alt="前端学习路线" />

一条主线：**基础 → 框架 → 工程化 → 实战**。

## 第一阶段：基础

- **HTML/CSS**：语义化、布局（Flex/Grid）、响应式
- **JavaScript**：语法、DOM、异步、ES6+

```js
const skill = await learn('JavaScript');
console.log(skill); // 基础扎实
```

## 第二阶段：框架

选一个主流框架深入：**React / Vue**。

## 第三阶段：工程化

构建工具、代码规范、测试、CI/CD。

## 第四阶段：实战

用真实项目检验学习成果，输出作品集。

> 学习没有捷径，但有更短的路——多写、多总结、多分享。
```

> 注：MDX 中用 `import { Image } from 'astro:assets'` + `<Image src>` 引用图片，Astro 会自动处理部署 base（`/neon-maple/`）并做优化（压缩/响应式/懒加载），这是本项目文章配图的标准做法。图片放在 `src/assets/images/` 下，MDX 中按相对路径 import。

- [ ] **Step 4: 验证内容与构建**

Run: `npm run check:content`
Expected: 通过，提示 2 篇文章、图片引用存在。

Run: `npm run build`
Expected: 构建成功；`dist/` 下生成首页、2 篇文章、分类页（随笔/前端）、标签页、归档页、`rss.xml`、`pagefind/` 索引。

Run: `npm run dev` 本地浏览：首页文章卡片、文章正文图片可点击放大（灯箱）、顶部霓虹进度条随滚动、搜索 Ctrl+K 可搜到文章、主题切换正常、深浅色均正常。

- [ ] **Step 5: 提交**

Run:
```bash
git add .
git commit -m "feat: add sample posts with images to verify full pipeline"
```
Expected: 提交成功。

---

## Task 11: 内容校验脚本

**Files:**
- Create: `scripts/check-content.mjs`

- [ ] **Step 1: 创建 `scripts/check-content.mjs`**

校验每篇文章 frontmatter 必需字段、tags 类型、图片引用存在性。用 Node 原生能力，无额外依赖：

```js
// 内容校验脚本：检查文章 frontmatter 完整性、标签类型、图片引用存在性
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const postsDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'content', 'posts');
const publicDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

// 极简 frontmatter 解析（支持标量 + 数组 tags）
function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const data = {};
  const body = m[1];
  const lines = body.split(/\r?\n/);
  let currentKey = null;
  const arr = [];
  for (const line of lines) {
    const kv = line.match(/^([A-Za-z]+):\s*(.*)$/);
    if (kv) {
      if (currentKey) data[currentKey] = arr.length ? arr : '';
      currentKey = kv[1];
      const val = kv[2].trim();
      if (val.startsWith('[')) {
        arr.length = 0;
        val.slice(1, -1).split(',').map((s) => s.trim()).filter(Boolean).forEach((s) => arr.push(s));
      } else {
        arr.length = 0;
        data[currentKey] = val.replace(/^["']|["']$/g, '');
      }
    }
  }
  if (currentKey) data[currentKey] = arr.length ? arr : '';
  return data;
}

const required = ['title', 'description', 'category', 'pubDate'];
const errors = [];
let fileCount = 0;

for (const file of readdirSync(postsDir)) {
  if (!file.endsWith('.mdx') && !file.endsWith('.md')) continue;
  fileCount++;
  const raw = readFileSync(join(postsDir, file), 'utf8');
  const fm = parseFrontmatter(raw);
  const rel = `src/content/posts/${file}`;
  if (!fm) {
    errors.push(`[${rel}] 缺少 frontmatter`);
    continue;
  }
  for (const key of required) {
    if (!fm[key]) errors.push(`[${rel}] 缺少必需字段: ${key}`);
  }
  if (fm.tags && !Array.isArray(fm.tags)) errors.push(`[${rel}] tags 必须是数组`);
  if (fm.draft === '') errors.push(`[${rel}] draft 应为布尔值`);

  // 检查 Markdown 图片引用（![](...)），路径相对 public/ 根
  for (const imgMatch of raw.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) {
    let src = imgMatch[1].replace(/["']$/, '');
    if (src.startsWith('http') || src.startsWith('.')) continue;
    src = src.split('#')[0].split('?')[0];
    if (!existsSync(join(publicDir, src.replace(/^\//, '')))) {
      errors.push(`[${rel}] 图片不存在: ${src}`);
    }
  }

  // 检查 MDX 中 import 的图片资源（相对路径，相对于文章所在目录）
  const imgExt = /\.(svg|png|jpe?g|webp|gif|avif)$/;
  for (const imp of raw.matchAll(/import\s+[^'";]+\s+from\s+['"]([^'"]+)['"]/g)) {
    const p = imp[1];
    if (!p.startsWith('.') || !imgExt.test(p)) continue;
    const target = join(dirname(join(postsDir, file)), p);
    if (!existsSync(target)) {
      errors.push(`[${rel}] import 的图片不存在: ${p}`);
    }
  }
}

if (errors.length) {
  console.error(`❌ 内容校验失败（${errors.length} 个问题）`);
  errors.forEach((e) => console.error('  ' + e));
  process.exit(1);
}
console.log(`✅ 内容校验通过：${fileCount} 篇文章，图片引用均存在`);
```

- [ ] **Step 2: 验证脚本**

Run: `npm run check:content`
Expected: `✅ 内容校验通过：2 篇文章，图片引用均存在`

Run（反向验证）：临时在第二篇文章改一个不存在的图片路径，再跑一次应失败退出码 1；改回后恢复。此步验证脚本能真正发现问题。

- [ ] **Step 3: 提交**

Run:
```bash
git add scripts/check-content.mjs package.json
git commit -m "feat: add content validation script"
```
Expected: 提交成功。

---

## Task 12: GitHub Actions 部署工作流 + 本地完整验证

**Files:**
- Create: `.github/workflows/deploy.yml`
- Create: `README.md`

- [ ] **Step 1: 创建 `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - name: Install dependencies
        run: npm ci
      - name: Check content
        run: npm run check:content
      - name: Build
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: 创建 `README.md`**

```markdown
# NeonMaple · 晨枫的学习之路

暗色霓虹风个人博客，记录学习历程与经验总结。基于 Astro 构建，部署在 GitHub Pages。

## 本地开发

```bash
npm install
npm run dev
```

## 写文章

在 `src/content/posts/` 下新建 `.mdx` 文件，frontmatter 字段：`title`、`description`、`category`、`tags`、`pubDate`（`heroImage`、`updatedDate`、`draft` 可选）。

## 校验与构建

```bash
npm run check:content   # 校验文章字段与图片引用
npm run build           # 类型检查 + 构建
```

## 发布

推送到 `main` 分支即可，GitHub Actions 自动构建并部署到 Pages。

## 部署地址

https://ustc-cy.github.io/neon-maple/
```

- [ ] **Step 3: 本地完整验证（发布前硬性检查）**

Run: `npm ci`（干净安装，确保 lock 文件有效）
Run: `npm run check:content`
Run: `npm run build`
Run: `npm run preview` 后浏览器检查：
- 首页渲染正常，霓虹渐变标题可见
- 打开一篇文章：正文排版、代码高亮、图片灯箱、进度条、上一篇/下一篇
- 搜索（Ctrl+K）能搜到示例文章
- 切换深/浅色，刷新后记忆保留
- 手机宽度（DevTools 响应式）下导航与卡片正常

Expected: 以上全部通过。

- [ ] **Step 4: 提交**

Run:
```bash
git add .
git commit -m "chore: add GitHub Actions deploy workflow and README"
```
Expected: 提交成功。

---

## Task 13: 推送到 GitHub 并部署

- [ ] **Step 1: 确认远端仓库**

Run: `git remote -v`
Expected: 若有输出则为已关联；若无，执行：
```bash
git remote add origin https://github.com/ustc-cy/neon-maple.git
```

- [ ] **Step 2: 首次推送**

Run: `git push -u origin main`
Expected: 推送成功。

- [ ] **Step 3: 在 GitHub 开启 Pages**

引导用户（或按如下确认）：仓库 Settings → Pages → Source 选 **GitHub Actions**（工作流会自动使用 upload-pages-artifact/deploy-pages）。由于工作流内已用 `actions/configure-pages`，通常无需手动设置 Source，若为首次需在 Settings → Pages 确认已启用。

- [ ] **Step 4: 验证线上部署**

等待 Actions 运行完成，访问 `https://ustc-cy.github.io/neon-maple/`，确认首页、文章、图片、搜索、主题切换在线上正常。

- [ ] **Step 5: 最终提交（若有工作流修改）**

Run: `git status` 确认干净；若 Push 后有额外改动，补一次 commit 并 push。

---

## 自审说明

- **Spec 覆盖**：设计文档中「内容模型（Task 2/10）、站点结构（Task 4/5/6/9）、霓虹视觉（Task 1/3）、搜索（Task 7）、深色模式（Task 3/1）、灯箱（Task 8）、进度条（Task 5）、RSS（Task 9）、404（Task 9）、图片优化（Task 10 + `<Image>`/MDX）、部署（Task 12/13）、错误处理（404 页面、图片兜底 alt）、测试验收（Task 11/12）」均有对应任务。
- **一致性**：`base` 全程用 `import.meta.env.BASE_URL` 拼接路径；搜索用 `base + 'pagefind/pagefind.js'`；RSS 用 `context.site`。灯箱组件名、id 在 Task 5 引用与 Task 8 定义一致。
- **已知取舍**：ArticleCard 首版不展示 heroImage 封面图（保留字段），如需封面展示可在 Task 4 后增强；浅色模式下代码块保持深色底以保证可读性。
- **自审修正记录**（2026-11-26）：
  1. Shiki 主题改为 `import neonTheme from './themes/neon.json' with { type: 'json' }`，避免传路径字符串不被支持。
  2. SearchModal 的 base 改用 `import.meta.env.BASE_URL`（Astro 组件 script 会编译注入），替代不可靠的 `document.querySelector('base')`。
  3. 示例文章正文图片改用 MDX `<Image>` 组件（Astro 自动处理 base 与优化），避免 Markdown 绝对路径在 `/neon-maple/` 子路径下 404；校验脚本相应增加对 `import` 图片资源与 `![]()` 的检查。
