import type { MetadataRoute } from "next";
import { getSiteContent } from "@/lib/site-content";
import { siteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getSiteContent();
  return [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/reflexoes`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/privacidade`, changeFrequency: "yearly", priority: 0.2 },
    ...content.reflections.filter((item) => item.published && item.slug).map((item) => ({
      url: `${siteUrl}/reflexoes/${item.slug}`,
      lastModified: item.publishedAt || undefined,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
