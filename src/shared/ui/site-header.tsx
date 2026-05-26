"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { siteConfig } from "@/shared/config/site";

const navigationItems = [
  { label: "Бомбочки", type: "section", target: "bombs" },
  { label: "О нас", type: "section", target: "about" },
  { label: "Отзывы", type: "section", target: "reviews" },
  { label: "Для партнеров", type: "modal", target: "partners" },
  { label: "Контакты", type: "modal", target: "contacts" },
] as const;
const socialOrder = ["VK", "TG", "MAX"] as const;
const socialIconPaths: Record<(typeof socialOrder)[number], string> = {
  VK: "/images/social/vk-round.svg",
  TG: "/images/social/tg-round.svg",
  MAX: "/images/social/max-round.svg",
};
const assetPath = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const socialsByLabel = new Map(
    siteConfig.socials.map((social) => [social.label.trim().toUpperCase(), social.href]),
  );
  const socialLinks = socialOrder
    .map((label) => ({ label, href: socialsByLabel.get(label) }))
    .filter((social): social is { label: (typeof socialOrder)[number]; href: string } =>
      Boolean(social.href),
    );

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
              className="absolute left-0 top-1/2 z-50 flex h-[46px] w-[46px] -translate-y-1/2 items-center justify-center rounded-2xl border-2 border-[#e8c880] bg-[#0f2037]/90 text-white shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition hover:border-[#ffdfa0] hover:text-[#ffdfa0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c880] lg:hidden"
            >
              <span className="sr-only">{isMobileMenuOpen ? "Закрыть меню" : "Открыть меню"}</span>
              <span className="flex w-5 flex-col gap-1.5" aria-hidden="true">
                <span className={`h-0.5 rounded-full bg-current transition ${isMobileMenuOpen ? "translate-y-2 rotate-45" : ""}`} />
                <span className={`h-0.5 rounded-full bg-current transition ${isMobileMenuOpen ? "opacity-0" : ""}`} />
                <span className={`h-0.5 rounded-full bg-current transition ${isMobileMenuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
              </span>
            </button>

            <Link href="/" className="absolute bottom-3 left-1/2 ml-2 flex -translate-x-1/2 items-center gap-2 sm:ml-0 lg:bottom-[14px]">
              <span className="flex h-11 w-11 items-center justify-center rounded-[20px] border-2 border-white text-[16px] font-bold underline [font-family:var(--font-ermilov)] lg:h-10 lg:w-10 lg:rounded-[20px] lg:text-[16px]">
                П.С
              </span>
              <span className="text-2xl font-normal leading-[1.1] [font-family:var(--font-educational)] sm:text-[30px]">
                {siteConfig.name}
              </span>
            </Link>
            <div className="ml-auto hidden items-end gap-3 pb-[14px] lg:flex">
              {socialLinks.map((social) => (
                <SocialIconButton key={social.label} label={social.label} href={social.href} />
              ))}
              <a
                href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
                className="pl-3 text-base font-medium leading-[1.1] [font-family:var(--font-inter)]"
              >
                {siteConfig.phone}
              </a>
            </div>
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
            <div className="mt-2 flex items-center justify-center gap-3">
              {socialLinks.map((social) => (
                <SocialIconButton key={`mobile-${social.label}`} label={social.label} href={social.href} />
              ))}
            </div>
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
      className="pointer-events-none absolute bottom-0 left-0 right-0 flex items-center"
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

function SocialIconButton({
  label,
  href,
}: Readonly<{
  label: "VK" | "TG" | "MAX";
  href: string;
}>) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-full transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c880]"
    >
      <img
        src={assetPath(socialIconPaths[label])}
        alt={label}
        className="h-11 w-11 rounded-full object-cover"
      />
    </a>
  );
}
