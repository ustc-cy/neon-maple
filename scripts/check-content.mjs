// 内容校验脚本：检查文章 frontmatter 完整性、标签类型、图片引用存在性
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
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
      // 仅在数组有积压项时落盘；用 slice 复制，避免后续 arr 清空影响已存值
      if (currentKey && arr.length) data[currentKey] = arr.slice();
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
  if (currentKey && arr.length) data[currentKey] = arr.slice();
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
  // draft 省略是合法的（schema 默认 false）；键存在但值非 true/false 时提示
  if (fm.draft !== undefined && fm.draft !== 'true' && fm.draft !== 'false') {
    errors.push(`[${rel}] draft 应为布尔值（true/false）`);
  }

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
