import Link from "next/link";

import { siteConfig } from "@/shared/config/site";

export const SiteFooter = () => (
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
