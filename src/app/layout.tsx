import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import localFont from "next/font/local";

import { siteConfig } from "@/shared/config/site";
import { seoConfig, siteUrl, toAbsoluteUrl } from "@/shared/config/seo";
import { assetPath } from "@/shared/lib/asset-path";
import { CookieConsent } from "@/shared/ui/cookie-consent";
import { SiteFooter } from "@/shared/ui/site-footer";
import { SiteHeader } from "@/shared/ui/site-header";

import "./globals.css";

const roboto = Roboto({
  subsets: ["cyrillic", "latin"],
  weight: ["300", "400", "500", "700", "800"],
  variable: "--font-roboto",
});

const inter = Inter({
  subsets: ["cyrillic", "latin"],
  variable: "--font-inter",
});

const educationalGothic = localFont({
  src: [
    {
      path: "./fonts/educational-gothic-regular.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-educational",
});

const faviconUrl = siteConfig.favicon ? assetPath(siteConfig.favicon) : null;

export const metadata: Metadata = {
  title: {
    default: seoConfig.metaTitle,
    template: `%s | ${seoConfig.title}`,
  },
  description: seoConfig.description,
  icons: faviconUrl ? { icon: [{ url: faviconUrl }] } : undefined,
  keywords: seoConfig.keywords,
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/",
    siteName: seoConfig.title,
    title: seoConfig.metaTitle,
    description: seoConfig.description,
    images: [
      {
        url: toAbsoluteUrl(seoConfig.ogImage),
        width: 1200,
        height: 630,
        alt: `${seoConfig.title} - премиальные подарочные наборы`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seoConfig.metaTitle,
    description: seoConfig.description,
    images: [toAbsoluteUrl(seoConfig.ogImage)],
  },
  verification: {
    yandex: "87ba27786fd06337",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${roboto.variable} ${inter.variable} ${educationalGothic.variable} min-h-screen text-stone-950 antialiased`}
      >
        <div className="relative flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
        <CookieConsent />
      </body>
    </html>
  );
}
