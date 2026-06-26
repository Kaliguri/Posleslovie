"use client";

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
      className="bg-[#f8f8f8] px-3 py-3 sm:px-5 sm:py-6 lg:px-10 lg:py-10 xl:px-[100px] xl:py-[56px]"
    >
      <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-[28px] bg-white sm:rounded-[42px] xl:rounded-[70px]">
        <div className="pointer-events-none absolute inset-0 hidden grid-cols-[1fr_323px] xl:grid">
          <div />
          <div className="bg-white mix-blend-lighten" />
        </div>
        <div className="relative grid items-center gap-6 p-3 sm:gap-10 sm:p-8 lg:p-10 xl:min-h-[665px] xl:grid-cols-2 xl:items-start xl:gap-16 xl:p-12">
          <div className="max-w-[552px]">
            <SectionKicker>{kicker}</SectionKicker>
            <h2 className="mt-2 text-[26px] font-extrabold leading-[1.12] sm:text-4xl lg:text-5xl">
              {title}
            </h2>
            <div className="mt-4 space-y-3 text-[15px] leading-7 [font-family:var(--font-inter)] sm:mt-5 sm:space-y-6 sm:text-base sm:leading-8 lg:text-xl lg:leading-[1.8]">
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
          <ZoomImage
            image={image}
            label="Бомбочки Послесловие"
            className="mx-auto aspect-square w-full max-w-[525px] rounded-[24px] sm:rounded-[32px] xl:h-[525px] xl:w-[525px] xl:rounded-[50px]"
          />
        </div>
      </div>
    </section>
  );
}
