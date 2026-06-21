"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { siteConfig } from "@/shared/config/site";
import { assetPath } from "@/shared/lib/asset-path";
import { SiteLogo } from "@/shared/ui/site-logo";
import siteBehaviorJson from "../../../content/site-behavior.json";

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
const globalOverlaysEnabled = Boolean(siteBehaviorJson.enableGlobalOverlays);

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHeroHeaderLight, setIsHeroHeaderLight] = useState(true);

  useEffect(() => {
    const hero = document.getElementById("hero");

    const updateHeaderTheme = () => {
      if (!hero) {
        setIsHeroHeaderLight(false);
        return;
      }

      const heroBottom = hero.getBoundingClientRect().bottom;
      setIsHeroHeaderLight(heroBottom > 120);
    };

    const frame = requestAnimationFrame(updateHeaderTheme);
    if (!hero) {
      return () => cancelAnimationFrame(frame);
    }

    window.addEventListener("scroll", updateHeaderTheme, { passive: true });
    window.addEventListener("resize", updateHeaderTheme);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateHeaderTheme);
      window.removeEventListener("resize", updateHeaderTheme);
    };
  }, []);

  const socialConfigByLabel = new Map(
    siteConfig.socials.map((social) => [
      social.label.trim().toUpperCase(),
      { href: social.href, icon: social.icon },
    ]),
  );
  const socialLinks = socialOrder.flatMap((label) => {
    const config = socialConfigByLabel.get(label);
    if (!config?.href) {
      return [];
    }

    return [
      {
        label,
        href: config.href,
        icon: config.icon || socialIconPaths[label],
      },
    ];
  });

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

  const openHomeModal = (type: "partners" | "contacts" | "checkout") => {
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
      <button
        type="button"
        aria-label={isMobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
        aria-expanded={isMobileMenuOpen}
        aria-controls="mobile-navigation"
        onClick={() => setIsMobileMenuOpen((current) => !current)}
        className={`fixed left-5 top-3 z-50 flex h-[46px] w-[46px] items-center justify-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c880] lg:hidden ${
          isHeroHeaderLight && !isMobileMenuOpen
            ? "bg-brand-navy text-white"
            : "bg-[#e8c880] text-[#0f172a] shadow-[0_8px_24px_rgba(0,0,0,0.35)] hover:bg-[#ffecbf]"
        }`}
      >
        <span className="sr-only">{isMobileMenuOpen ? "Закрыть меню" : "Открыть меню"}</span>
        <span className="flex w-5 flex-col gap-1.5" aria-hidden="true">
          <span
            className={`h-0.5 rounded-full bg-current transition ${isMobileMenuOpen ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`h-0.5 rounded-full bg-current transition ${isMobileMenuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`h-0.5 rounded-full bg-current transition ${isMobileMenuOpen ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </span>
      </button>

      <header
        className={`absolute inset-x-0 top-0 z-40 ${isHeroHeaderLight ? "text-brand-navy" : "text-white"}`}
      >
        <div className="mx-auto max-w-[1720px] px-5 lg:px-[100px]">
          <div className="relative flex h-[76px] items-center lg:h-[85px]">
            <div className="hidden items-center gap-3 lg:flex">
              {socialLinks.map((social) => (
                <SocialIconButton
                  key={social.label}
                  label={social.label}
                  href={social.href}
                  icon={social.icon}
                  light={isHeroHeaderLight}
                />
              ))}
            </div>

            <Link
              href="/"
              className="absolute left-1/2 top-1/2 flex max-w-[calc(100vw-10rem)] -translate-x-1/2 -translate-y-1/2 justify-center lg:max-w-none"
            >
              <SiteLogo variant={isHeroHeaderLight ? "dark" : "light"} />
            </Link>
            <a
              href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
              className={`relative z-10 ml-auto hidden items-center text-lg font-medium leading-[1.1] [font-family:var(--font-inter)] lg:flex ${
                isHeroHeaderLight ? "text-brand-navy" : "text-white"
              }`}
            >
              {siteConfig.phone}
            </a>
          </div>

          <nav className="hidden h-[100px] items-center justify-center lg:flex lg:-mt-6">
            <div className="flex items-center">
              {navigationItems.map((item) => (
                <HeaderPill
                  key={item.label}
                  light={isHeroHeaderLight}
                  onClick={() => handleNavigation(item)}
                >
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
          className={`fixed inset-0 z-40 px-5 pb-8 pt-24 text-white lg:hidden ${
            globalOverlaysEnabled ? "bg-[#102038]/95 backdrop-blur-md" : "bg-[#102038]"
          }`}
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
                <SocialIconButton
                  key={`mobile-${social.label}`}
                  label={social.label}
                  href={social.href}
                  icon={social.icon}
                />
              ))}
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}

function HeaderPill({
  light,
  onClick,
  children,
}: Readonly<{ light: boolean; onClick: () => void; children: React.ReactNode }>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative h-12 overflow-hidden px-2 py-3 text-base font-medium tracking-[0.5px] outline-none focus-visible:ring-2 focus-visible:ring-[#e8c880] ${
        light ? "text-brand-navy" : "text-white"
      }`}
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
  icon,
  light = false,
}: Readonly<{
  label: "VK" | "TG" | "MAX";
  href: string;
  icon: string;
  light?: boolean;
}>) {
  const iconSrc = light ? icon.replace(/\.svg$/, "-navy.svg") : icon;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full transition hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c880]"
    >
      <img src={assetPath(iconSrc)} alt={label} className="h-9 w-9 rounded-full object-cover" />
    </a>
  );
}
