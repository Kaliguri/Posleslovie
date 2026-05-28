import type { MetadataRoute } from "next";

import { siteUrl, withBasePath } from "@/shared/config/seo";

export const revalidate = false;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}${withBasePath("/")}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
