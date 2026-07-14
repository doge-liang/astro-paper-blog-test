import { describe, expect, it } from "vitest";
import { remark } from "remark";
import remarkWikilinks from "./remark-wikilinks.mjs";

const MANIFEST = {
  "数字花园的运作方式": { slug: "digital-garden-mechanics", title: "数字花园的运作方式" },
};

async function render(md) {
  return String(await remark().use(remarkWikilinks, { manifest: MANIFEST }).process(md));
}

describe("remark-wikilinks", () => {
  it("已发布目标解析为 /garden/<slug>/ 链接", async () => {
    const out = await render("参见 [[数字花园的运作方式]]。");
    expect(out).toContain("[数字花园的运作方式](/garden/digital-garden-mechanics/)");
  });

  it("别名语法用别名作显示文本", async () => {
    const out = await render("参见 [[数字花园的运作方式|花园机制]]。");
    expect(out).toContain("[花园机制](/garden/digital-garden-mechanics/)");
  });

  it("未发布目标降级为带样式的 span", async () => {
    const out = await render("这个想法在 [[尚未成文的想法]] 里。");
    expect(out).toContain('<span class="unpublished-link" title="尚未发布">尚未成文的想法</span>');
    expect(out).not.toContain("[[");
  });

  it("span 文本做 HTML 转义（& 字符）", async () => {
    const out = await render("[[研究&开发]]");
    expect(out).toContain('<span class="unpublished-link" title="尚未发布">研究&amp;开发</span>');
    expect(out).not.toContain("[[");
  });

  it("同一行多个链接分别处理", async () => {
    const out = await render("[[数字花园的运作方式]] 与 [[未发]] 并存");
    expect(out).toContain("(/garden/digital-garden-mechanics/)");
    expect(out).toContain('title="尚未发布"');
  });

  it("无 wikilink 的文本原样通过", async () => {
    const out = await render("普通段落 [not wiki](https://a.b)。");
    expect(out).toContain("[not wiki](https://a.b)");
  });
});
