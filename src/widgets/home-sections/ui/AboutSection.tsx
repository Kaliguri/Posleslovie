"use client";

import { GoldRule } from "@/shared/ui/GoldRule";
import { SectionKicker } from "@/shared/ui/SectionKicker";

import { ZoomImage } from "./SharedSectionUi";

export function AboutSection({
  kicker,
  title,
  paragraphs,
  image,
}: Readonly<{
  kicker: string;
  title: string;
  paragraphs: string[];
  image: string;
}>) {
  return (
    <section
      id="about"
      data-scroll-pop
      className="bg-[#f8f8f8] px-3 py-3 sm:px-5 sm:py-6 lg:px-[100px] lg:py-[56px]"
    >
      <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-[28px] bg-white sm:rounded-[42px] lg:rounded-[70px]">
        <div className="pointer-events-none absolute inset-0 hidden grid-cols-[1fr_323px] lg:grid">
          <div />
          <div className="bg-white mix-blend-lighten" />
        </div>
        <div className="relative grid items-center gap-6 p-3 sm:gap-10 sm:p-8 lg:min-h-[665px] lg:grid-cols-2 lg:items-start lg:gap-16 lg:p-12">
          <div className="max-w-[552px]">
            <SectionKicker>{kicker}</SectionKicker>
            <h2 className="mt-2 text-[26px] font-extrabold leading-[1.12] sm:text-4xl lg:text-5xl">
              {title}
            </h2>
            <GoldRule />
            <div className="mt-4 space-y-3 text-[15px] leading-7 [font-family:var(--font-inter)] sm:mt-5 sm:space-y-6 sm:text-base sm:leading-8 lg:text-xl lg:leading-[1.8]">
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
          <ZoomImage
            image={image}
            label="Бомбочки Послесловие"
            className="mx-auto aspect-square w-full max-w-[525px] rounded-[24px] sm:rounded-[32px] lg:h-[525px] lg:w-[525px] lg:rounded-[50px]"
          />
        </div>
      </div>
    </section>
  );
}
