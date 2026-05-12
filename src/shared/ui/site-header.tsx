"use client";

import Link from "next/link";

import { siteConfig } from "@/shared/config/site";

export function SiteHeader() {
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openHomeModal = (type: "delivery" | "partners" | "contacts" | "checkout") => {
    window.dispatchEvent(new CustomEvent("posleslovie:open-modal", { detail: type }));
  };

  return (
    <header className="absolute inset-x-0 top-0 z-30 text-white">
      <div className="mx-auto max-w-[1720px] px-5 lg:px-[100px]">
        <div className="relative flex h-[85px] items-center border-b border-[#e8c880]">
          <Link href="/" className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-[20px] border-2 border-white text-[16px] font-bold underline [font-family:var(--font-ermilov)]">
              П.С
            </span>
            <span className="text-[30px] font-normal leading-[1.1] [font-family:var(--font-educational)]">
              {siteConfig.name}
            </span>
          </Link>
          <a
            href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
            className="ml-auto hidden text-base font-medium leading-[1.1] [font-family:var(--font-inter)] lg:block"
          >
            {siteConfig.phone}
          </a>
        </div>

        <nav className="hidden h-[100px] items-center justify-center lg:flex">
          <div className="flex items-center">
            <HeaderPill onClick={() => scrollToSection("bombs")}>Бомбочки</HeaderPill>
            <HeaderPill onClick={() => scrollToSection("about")}>О нас</HeaderPill>
            <HeaderPill onClick={() => scrollToSection("reviews")}>Отзывы</HeaderPill>
            <HeaderPill onClick={() => openHomeModal("delivery")}>Оплата и доставка</HeaderPill>
            <HeaderPill onClick={() => openHomeModal("partners")}>Для партнеров</HeaderPill>
            <HeaderPill onClick={() => openHomeModal("contacts")}>Контакты</HeaderPill>
          </div>
        </nav>
      </div>
    </header>
  );
}

function HeaderPill({
  onClick,
  children,
}: Readonly<{ onClick: () => void; children: React.ReactNode }>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex h-12 items-center justify-center rounded-[30px] pl-6 pr-4 py-3 text-base font-bold tracking-[0.5px] text-white outline-none transition-transform duration-300 ease-out hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#e8c880]"
    >
      <HeaderPillText>{children}</HeaderPillText>
      <span className="pointer-events-none absolute bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 translate-y-1 rotate-45 bg-[#e8c880] opacity-0 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100" />
    </button>
  );
}

function HeaderPillText({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <span className="relative z-10 leading-6 whitespace-nowrap transition-[color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:text-[#e8c880] group-focus-visible:-translate-y-1 group-focus-visible:text-[#e8c880]">
      {children}
    </span>
  );
}
