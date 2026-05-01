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
        <div className="relative flex h-[85px] items-center">
          <HeaderRule />
          <Link href="/" className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-base font-bold underline">
              П.С
            </span>
            <span className="text-3xl">{siteConfig.name}</span>
          </Link>
          <a
            href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
            className="ml-auto hidden text-base font-medium lg:block"
          >
            {siteConfig.phone}
          </a>
        </div>

        <nav className="hidden h-[70px] items-center justify-center lg:flex">
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

function HeaderRule() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-0 left-1/2 flex w-[calc(100vw-32px)] -translate-x-1/2 items-center lg:w-[calc(100vw-80px)]"
    >
      <span className="h-2 w-2 shrink-0 rotate-45 bg-[#e8c880]" />
      <span className="h-px flex-1 bg-[#e8c880]" />
      <span className="h-2 w-2 shrink-0 rotate-45 bg-[#e8c880]" />
    </div>
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
      className="group relative h-12 overflow-hidden px-2 py-3 text-base font-medium tracking-[0.5px] text-white outline-none focus-visible:ring-2 focus-visible:ring-[#e8c880]"
    >
      <HeaderPillText>{children}</HeaderPillText>
    </button>
  );
}

function HeaderPillText({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <span className="relative block h-6">
      <span className="block leading-6 whitespace-nowrap transition-[color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:text-[#e8c880] group-focus-visible:-translate-y-1 group-focus-visible:text-[#e8c880]">
        {children}
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[29px] h-2 w-2 -translate-x-1/2 rotate-45 bg-[#e8c880] opacity-0 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-[-2px] group-hover:opacity-100 group-focus-visible:translate-y-[-2px] group-focus-visible:opacity-100"
      />
    </span>
  );
}
