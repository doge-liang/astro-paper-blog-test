# astro-paper-blog-test

个人博客模板和发布出口，基于 AstroPaper 5.x 改造。

本仓库用于承接从 `Knowledge` 中筛选出来的可发布内容，并验证博客主题、搜索、公式、图片和发布流程。原始 AstroPaper 模板说明已保留在 `docs/astro-paper-upstream.md`。

## 定位

- `Knowledge`：知识源和长期笔记入口。
- `astro-paper-blog-test`：博客模板、发布出口和展示层。
- 旧仓库 `astro-paper-test`：已归档，保留为早期模板测试记录。

## 内容目录

| 路径 | 用途 |
| --- | --- |
| `src/data/blog/` | 博客文章内容 |
| `src/assets/images/` | 文章图片资源 |
| `src/assets/icons/` | 图标资源 |
| `src/pages/` | Astro 页面入口 |
| `src/components/` | 页面组件 |
| `public/` | 静态资源，如 favicon、ads.txt、Pagefind 产物 |
| `.github/workflows/ci.yml` | PR/复用 CI，执行 lint、format check、build |

## 本地开发

安装依赖：

```bash
pnpm install
```

启动开发服务器：

```bash
pnpm run dev
```

构建：

```bash
pnpm run build
```

预览构建结果：

```bash
pnpm run preview
```

## 常用检查

```bash
pnpm run lint
pnpm run format:check
pnpm run build
```

当前 `build` 脚本会执行：

```bash
astro check && astro build && pagefind --site dist && cp -r dist/pagefind public/
```

也就是说构建会生成 Pagefind 搜索索引，并把它复制到 `public/pagefind`。

## 内容发布流程

建议流程：

1. 在 `Knowledge` 中沉淀原始笔记和资料来源。
2. 从 `Knowledge/indexes/blog-candidates.md` 选择可发布主题。
3. 把主题整理成 `src/data/blog/` 下的文章。
4. 图片放入 `src/assets/images/`，文章中使用相对路径引用。
5. 本地执行 `pnpm run lint`、`pnpm run format:check`、`pnpm run build`。
6. 通过 PR 合入发布分支。

## 与 Knowledge 的关系

本仓库不作为知识源头。它只负责把已经整理好的内容发布为博客。

需要长期维护的原始笔记、阅读记录、项目复盘和知识索引，应放在 `Knowledge`。博客文章可以从 `Knowledge` 中抽取、改写、压缩，但不要反向把博客仓当成唯一记录。

## 后续维护建议

1. 明确部署目标：GitHub Pages、Cloudflare Pages 或其他静态托管。
2. 检查 `public/pagefind` 是否应提交，或改为部署时生成。
3. 清理重复图片和无用模板文章，降低仓库体积。
4. 大型可下载工具包不要提交到仓库，例如 Fabric 实践文章里的 `fabric-bin/`。
5. 给 `Knowledge` 到博客的内容迁移建立固定 checklist。
