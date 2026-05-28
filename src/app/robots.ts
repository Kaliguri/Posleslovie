import type { MetadataRoute } from "next";

import { siteUrl, withBasePath } from "@/shared/config/seo";

export const revalidate = false;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}${withBasePath("/sitemap.xml")}`,
    host: siteUrl,
  };
}
