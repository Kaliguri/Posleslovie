"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { siteConfig } from "@/shared/config/site";

const navigationItems = [
  { label: "Бомбочки", type: "section", target: "bombs" },
  { label: "О нас", type: "section", target: "about" },
  { label: "Отзывы", type: "section", target: "reviews" },
  { label: "Оплата и доставка", type: "modal", target: "delivery" },
  { label: "Для партнеров", type: "modal", target: "partners" },
  { label: "Контакты", type: "modal", target: "contacts" },
] as const;

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    const onResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [isMobileMenuOpen]);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openHomeModal = (type: "delivery" | "partners" | "contacts" | "checkout") => {
    window.dispatchEvent(new CustomEvent("posleslovie:open-modal", { detail: type }));
  };

  const handleNavigation = (item: (typeof navigationItems)[number]) => {
    if (item.type === "section") {
      scrollToSection(item.target);
    } else {
      openHomeModal(item.target);
    }

    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="absolute inset-x-0 top-0 z-50 text-white">
        <div className="mx-auto max-w-[1720px] px-5 lg:px-[100px]">
          <div className="relative flex h-[76px] items-center lg:h-[85px]">
            <HeaderRule />
            <button
              type="button"
              aria-label={isMobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setIsMobileMenuOpen((current) => !current)}
              className="relative z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/70 text-white transition hover:border-[#e8c880] hover:text-[#e8c880] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c880] lg:hidden"
            >
              <span className="sr-only">{isMobileMenuOpen ? "Закрыть меню" : "Открыть меню"}</span>
              <span className="flex w-5 flex-col gap-1.5" aria-hidden="true">
                <span className={`h-0.5 rounded-full bg-current transition ${isMobileMenuOpen ? "translate-y-2 rotate-45" : ""}`} />
                <span className={`h-0.5 rounded-full bg-current transition ${isMobileMenuOpen ? "opacity-0" : ""}`} />
                <span className={`h-0.5 rounded-full bg-current transition ${isMobileMenuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
              </span>
            </button>

            <Link href="/" className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-[18px] border-2 border-white text-[14px] font-bold underline [font-family:var(--font-ermilov)] lg:h-10 lg:w-10 lg:rounded-[20px] lg:text-[16px]">
                П.С
              </span>
              <span className="text-2xl font-normal leading-[1.1] [font-family:var(--font-educational)] sm:text-[30px]">
                {siteConfig.name}
              </span>
            </Link>

            <a
              href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
              aria-label={`Позвонить ${siteConfig.phone}`}
              className="ml-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/70 text-sm font-bold transition hover:border-[#e8c880] hover:text-[#e8c880] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c880] lg:hidden"
            >
              <PhoneIcon />
            </a>
            <a
              href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
              className="ml-auto hidden text-base font-medium leading-[1.1] [font-family:var(--font-inter)] lg:block"
            >
              {siteConfig.phone}
            </a>
          </div>

          <nav className="hidden h-[100px] items-center justify-center lg:flex">
            <div className="flex items-center">
              {navigationItems.map((item) => (
                <HeaderPill key={item.label} onClick={() => handleNavigation(item)}>
                  {item.label}
                </HeaderPill>
              ))}
            </div>
          </nav>
        </div>
      </header>

      {isMobileMenuOpen ? (
        <div
          id="mobile-navigation"
          className="fixed inset-0 z-40 bg-[#102038]/95 px-5 pb-8 pt-24 text-white backdrop-blur-md lg:hidden"
        >
          <nav className="mx-auto flex max-w-sm flex-col gap-3" aria-label="Мобильная навигация">
            {navigationItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleNavigation(item)}
                className="rounded-3xl border border-white/15 bg-white/[0.08] px-5 py-4 text-left text-xl font-bold transition hover:border-[#e8c880] hover:text-[#e8c880] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c880]"
              >
                {item.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                openHomeModal("checkout");
                setIsMobileMenuOpen(false);
              }}
              className="mt-4 rounded-full bg-[#e8c880] px-6 py-4 text-center text-xl font-bold text-[#0f172a] transition hover:bg-[#ffecbf] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Оформить заказ
            </button>
            <a
              href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
              className="mt-3 text-center text-base font-medium text-white/80 underline-offset-4 hover:text-[#e8c880] hover:underline"
            >
              {siteConfig.phone}
            </a>
          </nav>
        </div>
      ) : null}
    </>
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

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.68 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.32 1.85.55 2.81.68A2 2 0 0 1 22 16.92Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}
