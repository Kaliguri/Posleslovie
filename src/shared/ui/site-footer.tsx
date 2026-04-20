"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/shared/config/site";

export function SiteFooter() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  if (isHomePage) {
    return (
      <footer id="contacts" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-slate-900">
            <span className="flex h-8 w-8 items-center justify-center rounded-2xl border border-slate-900 text-[13px] font-bold underline">
              П.С
            </span>
            <span className="text-xl">{siteConfig.name}</span>
          </div>

          <div className="mt-6 flex flex-col gap-6 border-t border-slate-200 pt-6 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
            <p>@ 2026 {siteConfig.name}. Политика конфиденциальности</p>

            <div className="flex flex-wrap items-center gap-6">
              <a href={`tel:${siteConfig.phone.replace(/\D/g, "")}`} className="transition hover:text-slate-950">
                {siteConfig.phone}
              </a>
              <a href={`mailto:${siteConfig.email}`} className="transition hover:text-slate-950">
                {siteConfig.email}
              </a>
              <span>{siteConfig.address}</span>
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

  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-stone-500">{siteConfig.name}</p>
          <p className="mt-4 max-w-md text-sm leading-7 text-stone-600">
            {siteConfig.description}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium uppercase tracking-[0.2em] text-stone-500">
            Навигация
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-stone-600">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition hover:text-stone-950">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-medium uppercase tracking-[0.2em] text-stone-500">
            Контакты
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-stone-600">
            <li>{siteConfig.phone}</li>
            <li>{siteConfig.email}</li>
            <li>{siteConfig.address}</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
