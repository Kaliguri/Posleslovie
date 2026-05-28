"use client";

import { ArrowIcon } from "@/shared/ui/ArrowIcon";

export function ScrollTopButton({ visible }: Readonly<{ visible: boolean }>) {
  return (
    <button
      type="button"
      aria-label="Наверх"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-4 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#e8c880] text-[#0f172a] shadow-lg transition sm:bottom-6 sm:right-6 sm:h-[60px] sm:w-[60px] ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <span className="-rotate-90">
        <ArrowIcon size={30} />
      </span>
    </button>
  );
}
