"use client";

import { useEffect } from "react";

import { CrossIcon } from "@/shared/ui/CrossIcon";

export function HeroVideoModal({
  open,
  src,
  title,
  withOverlay,
  onClose,
}: Readonly<{
  open: boolean;
  src: string;
  title: string;
  withOverlay: boolean;
  onClose: () => void;
}>) {
  useEffect(() => {
    if (!open) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-3 py-3 sm:px-6 sm:py-6 ${
        withOverlay ? "bg-black/60 backdrop-blur-sm" : "bg-black/40"
      }`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full max-w-[1400px] overflow-hidden rounded-[22px] bg-[#0b1321] shadow-2xl sm:rounded-[36px] lg:rounded-[50px]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/70 text-white transition hover:border-white hover:bg-white/10 sm:right-5 sm:top-5 sm:h-12 sm:w-12"
        >
          <CrossIcon />
        </button>
        <div className="grid">
          <div className="flex items-center gap-3 px-5 pb-4 pt-5 text-white sm:px-8 sm:pb-6 sm:pt-7">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
              <PlayIcon color="white" />
            </span>
            <p className="text-sm font-bold sm:text-base">{title}</p>
          </div>
          <div className="h-[62vh] w-full bg-black sm:h-[68vh] lg:h-[75vh]">
            <video src={src} controls autoPlay className="h-full w-full object-contain" />
          </div>
        </div>
      </div>
    </div>
  );
}

function PlayIcon({ color = "currentColor" }: Readonly<{ color?: string }>) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="M9 18V6l12 6-12 6Z" fill={color} />
    </svg>
  );
}
