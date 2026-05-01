import Link from "next/link";

import { siteConfig } from "@/shared/config/site";

export function SiteFooter() {
  return (
    <footer id="contacts" className="bg-white">
      <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:px-0">
        <div className="flex items-center gap-2 text-[#0f172a]">
          <span className="flex h-8 w-8 items-center justify-center rounded-2xl border border-[#0f172a] text-[13px] font-bold underline">
            П.С
          </span>
          <span className="text-2xl">{siteConfig.name}</span>
        </div>

        <div className="flex flex-col gap-6 py-6 text-base text-[#0f172a] md:flex-row md:items-center md:justify-between">
          <p className="flex-1">@ 2026 {siteConfig.name}. Политика конфиденциальности</p>

          <div className="flex flex-wrap items-center gap-6">
            <a href={`tel:${siteConfig.phone.replace(/\D/g, "")}`} className="transition hover:text-slate-950">
              {siteConfig.phone}
            </a>
            <a href={`mailto:${siteConfig.email}`} className="transition hover:text-slate-950">
              {siteConfig.email}
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {siteConfig.socials.map((social) => (
              <Link
                key={social.href}
                href={social.href}
                className="transition hover:text-slate-950"
              >
                {social.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
