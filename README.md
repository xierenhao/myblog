# 🦀 虾兵xie讲

AI 产品经理的个人博客。两条线：AI 产品层面的结构性问题（agent harness / context window / memory architecture），和足球场上的观察。

**站点 → [101.33.221.90:8080](http://101.33.221.90:8080)**

---

## 功能

- **合辑系统** — 文章按系列组织（harness / 世界杯复盘 / 业余踢球笔记），支持跨合辑导航
- **全文搜索** — 构建时生成索引，客户端检索，支持 AND 组合、精确短语、排除关键词、标题/摘要关键词高亮
- **生成式 SVG 封面** — 8 种图形 motif（loop / viewfinder / strata / curve / multiline / weeknum / keyword / firstChar），根据文章类型和元数据自动匹配
- **订阅** — RSS feed
- **明暗主题切换**
- **编辑型排版** — 衬线字族 + 分类强调色（AI 青 / 足球珊瑚 / 碎片琥珀）

## 技术栈

| 层面 | 选型 |
|------|------|
| 框架 | [Astro](https://astro.build) v5（纯静态） |
| 内容 | Markdown 文件（Astro Content Collections） |
| 样式 | CSS 自定义属性（无 Tailwind） |
| 搜索 | 客户端 JS + 构建时 JSON 索引（约 22KB，7 篇文章） |
| 封面 | 服务端渲染 SVG → 直出到 HTML |
| 部署 | nginx + 云服务器，git push → SSH 自动构建 |

## 快速开始

```bash
npm install
npm run dev        # 开发预览 http://localhost:4321
npm run build      # 构建到 dist/
npm run preview    # 预览构建结果
```

## 部署

当前通过 SSH 推送部署到云服务器：

```bash
git push origin main
# 服务器端 deploy.sh 自动拉取 → npm install → astro build → nginx reload
```

## 构建

这个项目采用**氛围编程**方式开发——人判断方向与审美，AI 执行代码与部署。完整的八轮迭代流程记录在项目的对话历史中。

## 许可

MIT
