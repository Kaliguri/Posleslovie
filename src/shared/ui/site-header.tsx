"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { CartButton } from "@/features/cart/ui/cart-button";
import { siteConfig } from "@/shared/config/site";

export function SiteHeader() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  if (isHomePage) {
    return (
      <header className="absolute inset-x-0 top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-6 text-white sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-2xl border border-white text-[13px] font-bold underline">
              П.С
            </span>
            <span className="text-xl">{siteConfig.name}</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <HeaderPill href="/delivery">Доставка</HeaderPill>
            <HeaderPill href="/distributors">Для партнеров</HeaderPill>
            <HeaderPill href="#contacts">Контакты</HeaderPill>
          </nav>

          <Link
            href="/checkout"
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#e8c880] px-4 py-2 text-sm font-bold text-[#e8c880] transition hover:bg-[#e8c880] hover:text-slate-950"
          >
            Оформить заказ
            <ArrowRightIcon />
          </Link>
        </div>
      </header>
    );
  }

  return (
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
}

function HeaderPill({
  href,
  children,
}: Readonly<{ href: string; children: React.ReactNode }>) {
  return (
    <Link
      href={href}
      className="rounded-full px-4 py-2 text-sm font-bold text-white/90 transition hover:bg-white/10 hover:text-white"
    >
      {children}
    </Link>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="M5 12h14" />
      <path d="m13 5 7 7-7 7" />
    </svg>
  );
}
