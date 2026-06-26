"use client";

import { useState } from "react";

import { SectionHeading } from "@/widgets/home-sections/ui/SharedSectionUi";

export function FaqSection({
  kicker,
  title,
  items,
}: Readonly<{
  kicker: string;
  title: string;
  items: { question: string; answer: string }[];
}>) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      data-scroll-pop
      className="bg-surface px-3 py-6 sm:px-5 sm:py-9 lg:px-10 lg:py-14 xl:px-[100px]"
    >
      <div className="mx-auto max-w-[900px]">
        <SectionHeading kicker={kicker} title={title} centered />
        <div className="mt-8 space-y-3 sm:mt-10">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.question}
                data-reveal-child
                className="overflow-hidden rounded-[20px] bg-white shadow-[0_4px_20px_rgba(15,23,42,0.06)] sm:rounded-[24px]"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-start justify-between gap-4 px-4 py-4 text-left sm:px-6 sm:py-5"
                >
                  <span className="text-base font-bold text-foreground sm:text-lg">
                    {item.question}
                  </span>
                  <span
                    className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-brand-gold text-brand-gold transition ${
                      isOpen ? "rotate-45 bg-brand-gold text-foreground" : ""
                    }`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>
                {isOpen ? (
                  <>
                    <div className="mx-4 h-px bg-foreground/10 sm:mx-6" />
                    <p className="px-4 pb-5 pt-3 text-sm leading-relaxed text-foreground/85 [font-family:var(--font-inter)] sm:px-6 sm:text-base">
                      {item.answer}
                    </p>
                  </>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
