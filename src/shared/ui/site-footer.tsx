"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  defaultLegalDocumentsContent,
  defaultSiteSettingsContent,
  type LegalDocumentContent,
  type SiteSettingsContent,
} from "@/shared/config/contact-legal-content";
import { siteConfig } from "@/shared/config/site";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function SiteFooter() {
  const [siteSettings, setSiteSettings] = useState<SiteSettingsContent>(defaultSiteSettingsContent);
  const [legalDocuments, setLegalDocuments] = useState<LegalDocumentContent[]>(defaultLegalDocumentsContent);

  useEffect(() => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!apiBaseUrl) {
      return;
    }

    const controller = new AbortController();

    async function loadFooterContent() {
      try {
        const [settingsResponse, docsResponse] = await Promise.all([
          fetch(`${apiBaseUrl}/public/content/site-settings`, {
            cache: "no-store",
            signal: controller.signal,
          }),
          fetch(`${apiBaseUrl}/public/content/legal-documents`, {
            cache: "no-store",
            signal: controller.signal,
          }),
        ]);

        if (settingsResponse.ok) {
          const payload = (await settingsResponse.json()) as { data?: Partial<SiteSettingsContent> };
          if (payload.data) {
            setSiteSettings({
              phone: typeof payload.data.phone === "string" ? payload.data.phone : defaultSiteSettingsContent.phone,
              email: typeof payload.data.email === "string" ? payload.data.email : defaultSiteSettingsContent.email,
              socials:
                Array.isArray(payload.data.socials) &&
                payload.data.socials.every(
                  (item) => typeof item?.label === "string" && typeof item?.href === "string",
                )
                  ? (payload.data.socials as Array<{ label: string; href: string }>)
                  : defaultSiteSettingsContent.socials,
            });
          }
        }

        if (docsResponse.ok) {
          const payload = (await docsResponse.json()) as {
            data?: { documents?: unknown };
          };
          const incomingDocs = payload.data?.documents;
          if (Array.isArray(incomingDocs)) {
            const fallbackBySlug = new Map(defaultLegalDocumentsContent.map((doc) => [doc.slug, doc]));
            const parsed = incomingDocs
              .map((item) => {
                const slug = (item as { slug?: unknown }).slug;
                if (typeof slug !== "string") {
                  return null;
                }
                const fallback = fallbackBySlug.get(slug as LegalDocumentContent["slug"]);
                if (!fallback) {
                  return null;
                }
                const shortTitle = (item as { shortTitle?: unknown }).shortTitle;
                const title = (item as { title?: unknown }).title;
                const pdfPath = (item as { pdfPath?: unknown }).pdfPath;
                const content = (item as { content?: unknown }).content;
                return {
                  slug: fallback.slug,
                  shortTitle: typeof shortTitle === "string" ? shortTitle : fallback.shortTitle,
                  title: typeof title === "string" ? title : fallback.title,
                  pdfPath: typeof pdfPath === "string" ? pdfPath : fallback.pdfPath,
                  content:
                    Array.isArray(content) && content.every((line) => typeof line === "string")
                      ? (content as string[])
                      : fallback.content,
                } satisfies LegalDocumentContent;
              })
              .filter((item): item is LegalDocumentContent => item !== null);

            if (parsed.length > 0) {
              setLegalDocuments(parsed);
            }
          }
        }
      } catch {
        // Keep defaults
      }
    }

    void loadFooterContent();
    return () => controller.abort();
  }, []);

  return (
    <footer id="contacts" className="bg-white">
      <div className="mx-auto max-w-[1760px] px-4 py-10 sm:px-5 lg:px-20">
        <div className="flex items-center gap-2 text-[#0f172a]">
          <span className="flex h-8 w-8 items-center justify-center rounded-2xl border border-[#0f172a] text-[13px] font-bold underline [font-family:var(--font-ermilov)]">
            П.С
          </span>
          <span className="text-2xl font-normal leading-[1.1] [font-family:var(--font-educational)]">
            {siteConfig.name}
          </span>
        </div>

        <div className="flex flex-col gap-6 py-6 text-base text-[#0f172a] md:flex-row md:items-center md:justify-between">
          <p className="flex-1">@ 2026 {siteConfig.name}</p>

          <div className="flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
            <a
              href={`tel:${siteSettings.phone.replace(/\D/g, "")}`}
              title="Call Posleslovie"
              className="transition hover:text-slate-950"
            >
              {siteSettings.phone}
            </a>
            <a
              href={`mailto:${siteSettings.email}`}
              title="Email Posleslovie"
              className="transition hover:text-slate-950"
            >
              {siteSettings.email}
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {siteSettings.socials.map((social) => (
              <Link
                key={social.href}
                href={social.href}
                title="Open social profile"
                className="transition hover:text-slate-950"
              >
                {social.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid gap-x-10 gap-y-4 border-t border-[#e8c880]/50 pt-6 text-sm text-[#0f172a] sm:grid-cols-2 lg:grid-cols-3">
          {legalDocuments.map((document) => (
            <a
              key={document.slug}
              href={`${basePath}${document.pdfPath}`}
              title={`Open ${document.shortTitle} PDF`}
              target="_blank"
              rel="noopener noreferrer"
              className="leading-[1.4] underline-offset-4 transition hover:text-[#e8c880] hover:underline focus-visible:text-[#e8c880] focus-visible:outline-none"
            >
              {document.shortTitle}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
