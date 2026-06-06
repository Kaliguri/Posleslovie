import { env } from "@/shared/config/env";
import { siteConfig } from "@/shared/config/site";

const fallbackSiteUrl = "https://posleslovie.online";

function normalizeUrl(value?: string) {
  if (!value) {
    return fallbackSiteUrl;
  }

  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;

  try {
    const parsed = new URL(withProtocol);
    return parsed.origin;
  } catch {
    return fallbackSiteUrl;
  }
}

export const siteUrl = normalizeUrl(env.siteUrl);
export const basePath = env.basePath;

export function withBasePath(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalizedPath}`;
}

export function toAbsoluteUrl(path: string) {
  return `${siteUrl}${withBasePath(path)}`;
}

export const seoConfig = {
  title: siteConfig.name,
  metaTitle: siteConfig.seoTitle?.trim() || siteConfig.name,
  description: siteConfig.description,
  keywords: [
    "подарочные наборы",
    "бомбочки для ванны",
    "подарки на заказ",
    "корпоративные подарки",
    "премиальные подарки",
    "Послесловие",
  ],
  ogImage: "/images/photos/hero.jpg",
};
