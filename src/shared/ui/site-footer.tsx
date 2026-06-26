import Link from "next/link";

import { legalDocuments } from "@/shared/config/legal-documents";
import { siteConfig } from "@/shared/config/site";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function SiteFooter() {
  return (
    <footer id="contacts" className="bg-[#080a12] text-white">
      <div className="mx-auto max-w-[1540px] px-5 py-12 sm:px-8 lg:px-14 lg:py-16">
        <div className="grid gap-8 rounded-[2.5rem] border border-white/10 bg-white/[0.045] p-7 sm:p-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-[var(--ritual-lilac)] text-sm font-black text-[var(--ritual-ink)]">
                ПС
              </span>
              <span className="text-2xl font-black tracking-[-0.05em]">{siteConfig.name}</span>
            </div>
            <p className="mt-8 max-w-[620px] text-[clamp(2.5rem,6vw,6.8rem)] font-black leading-[0.84] tracking-[-0.08em]">
              Вода помнит детали.
            </p>
          </div>

          <div className="flex flex-col justify-between gap-8">
            <div className="grid gap-3 text-base text-white/76">
              <a
                href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
                title="Позвонить Posleslovie"
                className="rounded-full underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ritual-lilac)]"
              >
                {siteConfig.phone}
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                title="Написать Posleslovie"
                className="rounded-full underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ritual-lilac)]"
              >
                {siteConfig.email}
              </a>
            </div>

            <div className="flex flex-wrap gap-3">
              {siteConfig.socials.map((social) => (
                <Link
                  key={social.href}
                  href={social.href}
                  title={`Открыть ${social.label}`}
                  className="rounded-full border border-white/12 px-4 py-2 text-sm font-semibold text-white/72 transition-[background-color,border-color,color] hover:border-[var(--ritual-lilac)] hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ritual-lilac)]"
                >
                  {social.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-x-10 gap-y-4 border-t border-white/10 pt-6 text-sm text-white/56 sm:grid-cols-2 lg:grid-cols-3">
          {legalDocuments.map((document) => (
            <a
              key={document.slug}
              href={`${basePath}${document.pdfPath}`}
              title={`Открыть ${document.shortTitle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="leading-[1.4] underline-offset-4 transition-colors hover:text-[var(--ritual-lilac)] hover:underline focus-visible:text-[var(--ritual-lilac)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ritual-lilac)]"
            >
              {document.shortTitle}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
