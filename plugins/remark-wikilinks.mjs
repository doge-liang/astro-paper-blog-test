import { visit } from "unist-util-visit";

const WIKILINK = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * 构建期 wikilink 解析（spec 2026-07-15 §4.2）。
 * manifest 命中 → /garden/<slug>/ 站内链接；未命中 → 降级 span（断链清单进构建日志，不失败）。
 */
export default function remarkWikilinks(options = {}) {
  const manifest = options.manifest ?? {};
  return (tree, file) => {
    const broken = [];
    visit(tree, "text", (node, index, parent) => {
      if (!parent || parent.type === "link") return;
      WIKILINK.lastIndex = 0;
      if (!WIKILINK.test(node.value)) return;
      WIKILINK.lastIndex = 0;
      const parts = [];
      let last = 0;
      let m;
      while ((m = WIKILINK.exec(node.value))) {
        if (m.index > last) parts.push({ type: "text", value: node.value.slice(last, m.index) });
        const target = m[1].trim();
        const label = (m[2] ?? m[1]).trim();
        const hit = manifest[target];
        if (hit) {
          parts.push({ type: "link", url: `/garden/${hit.slug}/`, children: [{ type: "text", value: label }] });
        } else {
          broken.push(target);
          parts.push({ type: "html", value: `<span class="unpublished-link" title="尚未发布">${escapeHtml(label)}</span>` });
        }
        last = m.index + m[0].length;
      }
      if (last < node.value.length) parts.push({ type: "text", value: node.value.slice(last) });
      parent.children.splice(index, 1, ...parts);
      return index + parts.length;
    });
    if (broken.length) {
      console.warn(`[wikilinks] 断链 ${file?.basename ?? "?"}: ${[...new Set(broken)].join("、")}`);
    }
  };
}
