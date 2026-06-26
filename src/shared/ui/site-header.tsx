"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { siteConfig } from "@/shared/config/site";

const navigationItems = [
  { label: "Ароматы", type: "section", target: "bombs" },
  { label: "Отзывы", type: "section", target: "reviews" },
  { label: "Вопросы", type: "section", target: "about" },
  { label: "Партнерам", type: "modal", target: "partners" },
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
        className="fixed right-5 top-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-[background-color,border-color,transform] hover:scale-105 hover:border-[var(--ritual-lilac)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ritual-lilac)] lg:hidden"
      >
        <span className="sr-only">{isMobileMenuOpen ? "Закрыть меню" : "Открыть меню"}</span>
        <span className="flex w-5 flex-col gap-1.5" aria-hidden="true">
          <span
            className={`h-0.5 rounded-full bg-current transition-transform ${isMobileMenuOpen ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`h-0.5 rounded-full bg-current transition-opacity ${isMobileMenuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`h-0.5 rounded-full bg-current transition-transform ${isMobileMenuOpen ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </span>
      </button>

      <header className="fixed inset-x-0 top-0 z-40 px-5 pt-5 lg:px-8">
        <div className="mx-auto flex h-16 max-w-[1540px] items-center justify-between rounded-full border border-white/12 bg-[#080a12]/62 px-4 text-white shadow-[0_20px_90px_rgba(0,0,0,0.26)] backdrop-blur-2xl sm:px-5">
          <Link
            href="/"
            className="group flex min-w-0 items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ritual-lilac)]"
            aria-label="На главную"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--ritual-lilac)] text-sm font-black text-[var(--ritual-ink)] transition-transform duration-300 group-hover:rotate-6">
              ПС
            </span>
            <span className="hidden text-base font-black tracking-[-0.04em] sm:block">
              {siteConfig.name}
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Основная навигация">
            {navigationItems.map((item) => (
              <HeaderNavButton key={item.label} onClick={() => handleNavigation(item)}>
                {item.label}
              </HeaderNavButton>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
              className="rounded-full px-4 py-2 text-sm font-semibold text-white/78 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ritual-lilac)]"
            >
              {siteConfig.phone}
            </a>
            <button
              type="button"
              onClick={() => openHomeModal("checkout")}
              className="rounded-full bg-[var(--ritual-lilac)] px-5 py-2.5 text-sm font-black text-[var(--ritual-ink)] transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-[#ded4ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Заказать
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen ? (
        <div
          id="mobile-navigation"
          className="fixed inset-0 z-40 bg-[#080a12]/96 px-5 pb-8 pt-24 text-white backdrop-blur-xl lg:hidden"
        >
          <nav className="mx-auto flex max-w-sm flex-col gap-3" aria-label="Мобильная навигация">
            <Link
              href="/"
              className="mb-4 inline-flex items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ritual-lilac)]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[var(--ritual-lilac)] text-sm font-black text-[var(--ritual-ink)]">
                ПС
              </span>
              <span className="text-xl font-black">{siteConfig.name}</span>
            </Link>
            {navigationItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleNavigation(item)}
                className="rounded-[1.5rem] border border-white/12 bg-white/[0.06] px-5 py-4 text-left text-xl font-black transition-[background-color,border-color,color] hover:border-[var(--ritual-lilac)] hover:bg-white/[0.1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ritual-lilac)]"
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
              className="mt-4 rounded-full bg-[var(--ritual-lilac)] px-6 py-4 text-center text-xl font-black text-[var(--ritual-ink)] transition-colors hover:bg-[#ded4ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Оформить заказ
            </button>
            <a
              href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
              className="mt-3 text-center text-base font-medium text-white/80 underline-offset-4 hover:text-[var(--ritual-lilac)] hover:underline"
            >
              {siteConfig.phone}
            </a>
          </nav>
        </div>
      ) : null}
    </>
  );
}

function HeaderNavButton({
  onClick,
  children,
}: Readonly<{ onClick: () => void; children: React.ReactNode }>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full px-4 py-2 text-sm font-semibold text-white/72 transition-[background-color,color] hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ritual-lilac)]"
    >
      {children}
    </button>
  );
}
