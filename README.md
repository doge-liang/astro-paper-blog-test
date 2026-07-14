# doge-liang.github.io

个人博客，基于 AstroPaper 5.x 改造。**纯展示层**——不作为任何知识内容的源头。

## 两区结构

| 区 | 目录 | 生命周期 |
| --- | --- | --- |
| posts（精选） | `src/data/posts/` | 在本仓直接写作与维护（MD/MDX） |
| garden（数字花园） | `src/data/garden/` | 由 Knowledge vault 经 `/publish` 单向镜像同步；**本仓永不手改**（含 `_manifest.json`） |

garden 的任何修改都会在下次同步时被覆盖或删除。要改一篇花园笔记，去 Knowledge vault 改源笔记后重新 /publish。

## 发布流程

1. 在 Knowledge vault 的 `4-Outputs/drafts/` 写作，`stage` 推进到 `review`
2. 在 vault 会话执行 `/publish`：确认晋升/更新/删除清单
3. 管线写回 vault、同步本仓 `src/data/garden/` 并 push，Actions 自动构建部署

## 本地开发

pnpm install / pnpm run dev / pnpm run build（含 astro check 与 Pagefind 索引）/ pnpm test（wikilink 插件）

## 部署

push main → `.github/workflows/deploy.yml` → GitHub Pages（workflow 模式）。`ci.yml` 只跑 PR 检查。

自定义域名切换（注册后）：`src/config.ts` 的 `SITE.website`、新建 `public/CNAME`、仓库 Pages 设置 custom domain，三处一换；另按 spec §9 刷新 vault 中已发布笔记的 `url` 字段。

## 上游

原始 AstroPaper 模板说明见 `docs/astro-paper-upstream.md`。
