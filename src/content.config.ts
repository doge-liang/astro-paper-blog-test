import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { SITE } from "@/config";

export const BLOG_PATH = "src/data/posts";
export const GARDEN_PATH = "src/data/garden";

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
    }),
});

// garden：publish_garden.py 输出的严格镜像（spec §4.1「一次定义、两处校验」）
// .strict() 保证转换器多写/漏写任何字段都在构建期失败
const garden = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: `./${GARDEN_PATH}` }),
  schema: z
    .object({
      title: z.string(),
      description: z.string(),
      pubDatetime: z.coerce.date(),
      modDatetime: z.coerce.date().optional(),
      tags: z.array(z.string()),
    })
    .strict(),
});

export const collections = { blog, garden };
