import type { MetadataRoute } from "next";
import { getAllSlugs, SUPPORTED_LANGS } from "@/lib/hidden-gems";

export const dynamic = "force-static";

const BASE_URL = "https://verona.guide";

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = getAllSlugs();

  // List pages — one per language
  const listPages: MetadataRoute.Sitemap = SUPPORTED_LANGS.map((lang) => ({
    url: `${BASE_URL}/${lang}/hidden-gems`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Detail pages — 40 slugs × 3 languages = 120 URLs
  const detailPages: MetadataRoute.Sitemap = SUPPORTED_LANGS.flatMap((lang) =>
    slugs.map((slug) => ({
      url: `${BASE_URL}/${lang}/hidden-gems/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }))
  );

  return [...listPages, ...detailPages];
}
