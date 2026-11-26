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
npm run build           # 类型检查 + 构建 + 搜索索引
```

## 发布

推送到 `main` 分支即可，GitHub Actions 自动构建并部署到 Pages。

## 部署地址

https://ustc-cy.github.io/neon-maple/
