"use client";

import { GoldRule } from "@/shared/ui/GoldRule";

export function FeatureCardsSection({
  sectionTitle,
  cards,
}: Readonly<{
  sectionTitle: string;
  cards: { title: string; description: string; icon: string }[];
}>) {
  return (
    <section
      id="bombs"
      data-scroll-pop
      className="px-3 py-10 sm:px-5 sm:py-16 lg:px-[100px] lg:py-[100px]"
    >
      <div className="mx-auto max-w-[1280px] rounded-[28px] bg-white px-4 py-10 sm:rounded-[48px] sm:px-6 sm:py-14 lg:min-h-[750px] lg:rounded-[100px] lg:px-20 lg:py-20">
        <div className="mx-auto max-w-[780px] text-center">
          <h2 className="text-[26px] font-extrabold leading-[1.12] sm:text-4xl lg:text-5xl">
            {sectionTitle}
          </h2>
          <GoldRule centered />
        </div>
        <div className="mt-8 grid gap-6 sm:mt-14 lg:grid-cols-3 lg:gap-16">
          {cards.map((card) => (
            <article
              key={card.title}
              className="group rounded-[18px] px-3 py-3 text-center transition duration-300 hover:-translate-y-2 hover:bg-[#f8f8f8] hover:shadow-[0_4px_9px_rgba(0,0,0,0.15)] sm:rounded-[10px] sm:px-4 sm:py-3"
            >
              <div
                aria-hidden="true"
                className="mx-auto h-14 w-14 bg-contain bg-center bg-no-repeat sm:h-16 sm:w-16"
                style={{ backgroundImage: `url(${card.icon})` }}
              />
              <h3 className="mt-3 text-xl font-bold leading-[1.1] sm:mt-4 sm:text-2xl">
                {card.title}
              </h3>
              <p className="mt-2 text-[15px] leading-7 [font-family:var(--font-inter)] sm:mt-4 sm:text-base sm:leading-8 lg:text-xl lg:leading-[1.8]">
                {card.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
