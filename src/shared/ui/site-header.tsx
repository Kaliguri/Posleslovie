import Link from "next/link";

import { CartButton } from "@/features/cart/ui/cart-button";
import { siteConfig } from "@/shared/config/site";

export const SiteHeader = () => (
  <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-white/80 backdrop-blur-xl">
    <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
      <Link href="/" className="text-lg font-semibold tracking-[0.2em] text-stone-950">
        {siteConfig.name}
      </Link>

      <nav className="hidden items-center gap-6 text-sm text-stone-600 md:flex">
        {siteConfig.nav.map((item) => (
          <Link key={item.href} href={item.href} className="transition hover:text-stone-950">
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <a
          href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
          className="hidden text-sm text-stone-600 transition hover:text-stone-950 sm:block"
        >
          {siteConfig.phone}
        </a>
        <CartButton />
      </div>
    </div>
  </header>
);
