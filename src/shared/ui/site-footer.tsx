"use client";

import Link from "next/link";

import { legalDocuments } from "@/shared/config/legal-documents";
import { siteConfig } from "@/shared/config/site";

export function SiteFooter() {
  const openLegalDocument = (slug: string) => {
    window.dispatchEvent(new CustomEvent("posleslovie:open-modal", { detail: slug }));
  };

  return (
    <footer id="contacts" className="bg-white">
      <div className="mx-auto max-w-[1760px] px-5 py-10 lg:px-20">
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

          <div className="flex flex-wrap items-center gap-6">
            <a
              href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
              title="Call Posleslovie"
              className="transition hover:text-slate-950"
            >
              {siteConfig.phone}
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              title="Email Posleslovie"
              className="transition hover:text-slate-950"
            >
              {siteConfig.email}
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {siteConfig.socials.map((social) => (
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
            <button
              key={document.slug}
              type="button"
              title="Open legal document"
              onClick={() => openLegalDocument(document.slug)}
              className="text-left leading-[1.4] underline-offset-4 transition hover:text-[#e8c880] hover:underline focus-visible:text-[#e8c880] focus-visible:outline-none"
            >
              {document.shortTitle}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}
