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
      <header className="absolute inset-x-0 top-0 z-30 text-white">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-0">
          <div className="flex h-[85px] items-center justify-between border-b border-[#e8c880]">
            <span className="hidden text-2xl text-transparent lg:block">+7 777 777-77-77</span>
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-base font-bold underline">
                П.С
              </span>
              <span className="text-3xl">{siteConfig.name}</span>
            </Link>
            <a
              href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
              className="hidden text-xl font-medium lg:block"
            >
              {siteConfig.phone}
            </a>
          </div>

          <nav className="hidden h-[70px] items-center justify-center lg:flex">
            <HeaderPill href="#bombs">Бомбочки</HeaderPill>
            <HeaderPill href="#about">О нас</HeaderPill>
            <HeaderPill href="#reviews">Отзывы</HeaderPill>
            <HeaderPill href="/delivery">Оплата и доставка</HeaderPill>
            <HeaderPill href="/distributors">Для партнеров</HeaderPill>
            <HeaderPill href="#contacts">Контакты</HeaderPill>
          </nav>
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
      className="rounded-full px-5 py-3 text-base font-bold tracking-[0.03em] text-white transition hover:bg-white/10"
    >
      {children}
    </Link>
  );
}
